import { describe, it, expect, beforeEach, vi } from "vitest";
import {
    extractDDBCharacterId,
    calculateProficiencyBonus,
    calculateModifier,
    parseDDBCharacterData,
    getLinkedDDBCharacterId,
    cacheDDBCharacter,
    getCachedDDBCharacter,
    ddbSpellToMetadata,
    stripHtml,
    DDB_RESET_TYPE_MAP,
    fetchDDBCharacter,
    hasPotentCantrip,
    hasWeaponGraze
} from "../ddbService";
import { getSpellMetadata, registerDynamicSpells } from "../../assets/spellInfo";

describe("ddbService", () => {
    const mockRawDDB = {
        id: 12345,
        name: "Gale of Waterdeep",
        avatarUrl: "https://example.com/gale.png",
        classes: [
            {
                level: 5,
                definition: { name: "Wizard" },
                subclassDefinition: { name: "School of Evocation" }
            }
        ],
        stats: [
            { id: 1, value: 8 },  // STR
            { id: 2, value: 14 }, // DEX
            { id: 3, value: 14 }, // CON
            { id: 4, value: 18 }, // INT (+4)
            { id: 5, value: 12 }, // WIS
            { id: 6, value: 10 }  // CHA
        ],
        modifiers: {
            race: [
                { type: "sense", subType: "darkvision", value: 60 }
            ],
            class: [],
            background: [],
            item: [],
            feat: []
        },
        classSpells: [
            {
                spells: [
                    {
                        prepared: true,
                        definition: {
                            id: 101,
                            name: "Fireball",
                            level: 3,
                            school: "Evocation",
                            activation: { activationType: 1, activationTime: 1 },
                            range: { rangeValue: 150, aoeType: "Sphere", aoeValue: 20 },
                            duration: { durationInterval: 0, durationType: "Instantaneous" },
                            components: [1, 2, 3],
                            requiresSavingThrow: true,
                            saveDcAbilityId: 2, // DEX
                            modifiers: [{ type: "damage", die: { diceString: "8d6" }, friendlySubtypeName: "Fire" }],
                            description: "Explosion of fire.",
                            higherLevelsDescription: "+1d6 per slot above 3rd."
                        }
                    },
                    {
                        prepared: true,
                        definition: {
                            id: 102,
                            name: "Fire Bolt",
                            level: 0,
                            school: "Evocation",
                            activation: { activationType: 1, activationTime: 1 },
                            range: { rangeValue: 120 },
                            duration: { durationInterval: 0 },
                            components: [1, 2],
                            requiresAttackRoll: true,
                            description: "Hurl a mote of fire."
                        }
                    }
                ]
            }
        ]
    };

    describe("extractDDBCharacterId", () => {
        it("extracts ID from standard DDB character URL", () => {
            expect(extractDDBCharacterId("https://www.dndbeyond.com/characters/12345678")).toBe(12345678);
        });

        it("extracts ID from profile DDB URL", () => {
            expect(extractDDBCharacterId("https://www.dndbeyond.com/profile/DM_Wizard/characters/98765432")).toBe(98765432);
        });

        it("extracts ID from short link", () => {
            expect(extractDDBCharacterId("https://ddb.ac/characters/55443322")).toBe(55443322);
        });

        it("extracts ID from plain numeric string", () => {
            expect(extractDDBCharacterId("12345678")).toBe(12345678);
            expect(extractDDBCharacterId("  87654321  ")).toBe(87654321);
        });

        it("returns null for invalid inputs", () => {
            expect(extractDDBCharacterId("")).toBeNull();
            expect(extractDDBCharacterId("https://google.com")).toBeNull();
            expect(extractDDBCharacterId("random text")).toBeNull();
        });
    });

    describe("calculateProficiencyBonus", () => {
        it("returns correct proficiency bonus per level", () => {
            expect(calculateProficiencyBonus(1)).toBe(2);
            expect(calculateProficiencyBonus(4)).toBe(2);
            expect(calculateProficiencyBonus(5)).toBe(3);
            expect(calculateProficiencyBonus(8)).toBe(3);
            expect(calculateProficiencyBonus(9)).toBe(4);
            expect(calculateProficiencyBonus(13)).toBe(5);
            expect(calculateProficiencyBonus(17)).toBe(6);
            expect(calculateProficiencyBonus(20)).toBe(6);
        });
    });

    describe("calculateModifier", () => {
        it("calculates ability modifier correctly", () => {
            expect(calculateModifier(10)).toBe(0);
            expect(calculateModifier(11)).toBe(0);
            expect(calculateModifier(12)).toBe(1);
            expect(calculateModifier(14)).toBe(2);
            expect(calculateModifier(18)).toBe(4);
            expect(calculateModifier(20)).toBe(5);
            expect(calculateModifier(8)).toBe(-1);
            expect(calculateModifier(7)).toBe(-2);
        });
    });

    describe("parseDDBCharacterData", () => {
        it("parses character stats, spell save DC, and attack bonus", () => {
            const char = parseDDBCharacterData(mockRawDDB);

            expect(char.name).toBe("Gale of Waterdeep");
            expect(char.level).toBe(5);
            expect(char.proficiencyBonus).toBe(3); // Level 5
            expect(char.spellCastingAbility).toBe("INT");
            // DC = 8 + 3 (prof) + 4 (INT mod) = 15
            expect(char.spellSaveDC).toBe(15);
            // Attack = 3 (prof) + 4 (INT mod) = +7
            expect(char.spellAttackBonus).toBe(7);
        });

        it("extracts 5th level wizard spell slots (4/3/2)", () => {
            const char = parseDDBCharacterData(mockRawDDB);

            expect(char.spellSlots[1].max).toBe(4);
            expect(char.spellSlots[2].max).toBe(3);
            expect(char.spellSlots[3].max).toBe(2);
            expect(char.spellSlots[4].max).toBe(0);
        });

        it("parses spells and upcastable flags correctly", () => {
            const char = parseDDBCharacterData(mockRawDDB);

            expect(char.spells.length).toBe(2);

            const fireball = char.spells.find(s => s.id === "fireball");
            expect(fireball).toBeDefined();
            expect(fireball?.level).toBe(3);
            expect(fireball?.range).toBe(150);
            expect(fireball?.aoe?.shape).toBe("Sphere");
            expect(fireball?.aoe?.size).toBe(20);
            expect(fireball?.canUpcast).toBe(true);

            const fireBolt = char.spells.find(s => s.id === "fire_bolt");
            expect(fireBolt).toBeDefined();
            expect(fireBolt?.level).toBe(0);
            expect(fireBolt?.canUpcast).toBe(false);
        });

        it("extracts darkvision sense into TokenVisionRules", () => {
            const char = parseDDBCharacterData(mockRawDDB);
            expect(char.senses.darkvision).toBe(60);
        });

        it("parses Warlock Pact Magic correctly", () => {
            const warlockData = {
                id: 999,
                name: "Wyll",
                classes: [
                    {
                        level: 5,
                        definition: { name: "Warlock" },
                        subclassDefinition: { name: "The Fiend" }
                    }
                ],
                stats: [
                    { id: 1, value: 10 },
                    { id: 2, value: 14 },
                    { id: 3, value: 14 },
                    { id: 4, value: 10 },
                    { id: 5, value: 12 },
                    { id: 6, value: 18 } // CHA +4
                ],
                pactMagic: [{ level: 3, used: 1 }]
            };

            const char = parseDDBCharacterData(warlockData);
            expect(char.spellCastingAbility).toBe("CHA");
            expect(char.pactMagic).toBeDefined();
            expect(char.pactMagic?.level).toBe(3);
            expect(char.pactMagic?.max).toBe(2);
            expect(char.pactMagic?.used).toBe(1);
        });

        it("parses Paladin half-caster spell slots correctly", () => {
            const paladinData = {
                id: 888,
                name: "Minthara",
                classes: [
                    {
                        level: 6,
                        definition: { name: "Paladin" },
                        subclassDefinition: { name: "Oath of Vengeance" }
                    }
                ],
                stats: [
                    { id: 1, value: 16 },
                    { id: 2, value: 10 },
                    { id: 3, value: 14 },
                    { id: 4, value: 10 },
                    { id: 5, value: 12 },
                    { id: 6, value: 16 } // CHA +3
                ]
            };

            const char = parseDDBCharacterData(paladinData);
            expect(char.spellCastingAbility).toBe("CHA");
            // Level 6 Paladin has casterLevel = Math.floor(6/2) = 3 -> 4 level 1, 2 level 2
            expect(char.spellSlots[1].max).toBe(4);
            expect(char.spellSlots[2].max).toBe(2);
            expect(char.spellSlots[3].max).toBe(0);
        });

        it("handles DDB characters where traits is an object and options has Devil's Sight", () => {
            const rawWithTraitsObject = {
                id: 170484944,
                name: "Kazmalia",
                classes: [
                    { level: 4, definition: { name: "Warlock" } },
                    { level: 2, definition: { name: "Sorcerer" } }
                ],
                traits: { personalityTraits: "brave", ideals: null, bonds: "", flaws: null },
                options: {
                    class: [
                        { definition: { name: "Devil’s Sight" } }
                    ]
                },
                stats: [{ id: 6, value: 16 }] // CHA 16 (+3)
            };

            const char = parseDDBCharacterData(rawWithTraitsObject);
            expect(char.name).toBe("Kazmalia");
            expect(char.level).toBe(6);
            expect(char.senses.devilsSight).toBe(true);
        });

        it("parses Monk Warrior of Shadow senses with sourceOnly: true per 2024 PHB", () => {
            const rawShadowMonk = {
                id: 170182790,
                name: "Kage Shadow",
                classes: [
                    {
                        level: 4,
                        definition: { name: "Monk" },
                        subclassDefinition: { name: "Warrior of Shadow" }
                    }
                ],
                stats: [
                    { id: 1, value: 10 },
                    { id: 2, value: 16 },
                    { id: 3, value: 14 },
                    { id: 4, value: 10 },
                    { id: 5, value: 16 },
                    { id: 6, value: 8 }
                ],
                modifiers: {
                    race: [],
                    class: [],
                    background: [],
                    item: [],
                    feat: []
                }
            };

            const char = parseDDBCharacterData(rawShadowMonk);
            expect(char.senses.shadowMonkSight).toEqual({
                enabled: true,
                sourceOnly: true,
                range: 60
            });
            expect(char.senses.darkvision).toBeGreaterThanOrEqual(60);
        });

        it("dynamically parses spells from all DDB categories (class, race, feat, item, custom) without hardcoding", () => {
            const multiSourceSpellData = {
                id: 999,
                name: "All-Sources Caster",
                classes: [{ level: 5, definition: { name: "Warlock" } }],
                stats: [{ id: 6, value: 18 }],
                classSpells: [
                    {
                        spells: [
                            {
                                countsAsKnownSpell: true,
                                definition: {
                                    id: 501,
                                    name: "Booming Blade",
                                    level: 0,
                                    school: "Evocation",
                                    description: "<p>You brandish the weapon and make a melee attack. Target takes 1d8 thunder damage.</p>"
                                }
                            }
                        ]
                    }
                ],
                spells: {
                    class: [
                        {
                            definition: {
                                id: 502,
                                name: "Burning Hands",
                                level: 1,
                                school: "Evocation",
                                description: "<p>A sheet of flames shoots forth. Each creature takes 3d6 fire damage.</p>"
                            }
                        }
                    ],
                    race: [
                        {
                            definition: {
                                id: 503,
                                name: "Chill Touch",
                                level: 0,
                                school: "Necromancy",
                                description: "<p>Create a ghostly, skeletal hand. Deals 1d8 necrotic damage.</p>"
                            }
                        }
                    ],
                    feat: [
                        {
                            definition: {
                                id: 504,
                                name: "Burning Blade",
                                level: 0,
                                school: "Evocation",
                                description: "<p>Strike with flaming weapon.</p>"
                            }
                        }
                    ],
                    item: [
                        {
                            definition: {
                                id: 505,
                                name: "Detect Magic",
                                level: 1,
                                school: "Divination",
                                description: "<p>You sense the presence of magic.</p>"
                            }
                        }
                    ]
                },
                customSpells: [
                    {
                        definition: {
                            id: 506,
                            name: "Homebrew Gravity Well",
                            level: 2,
                            school: "Transmutation",
                            description: "<p>Pulls creatures closer.</p>"
                        }
                    }
                ]
            };

            const char = parseDDBCharacterData(multiSourceSpellData);
            expect(char.spells.length).toBe(6);

            const spellNames = char.spells.map(s => s.name);
            expect(spellNames).toContain("Booming Blade");
            expect(spellNames).toContain("Burning Hands");
            expect(spellNames).toContain("Chill Touch");
            expect(spellNames).toContain("Burning Blade");
            expect(spellNames).toContain("Detect Magic");
            expect(spellNames).toContain("Homebrew Gravity Well");

            // Verify clean HTML and damage regex extraction
            const bb = char.spells.find(s => s.name === "Booming Blade");
            expect(bb?.description).toBe("You brandish the weapon and make a melee attack. Target takes 1d8 thunder damage.");
            expect(bb?.damage).toBe("1d8 Thunder");
            expect(bb?.school).toBe("Evocation");
            expect(bb?.level).toBe(0);

            // Verify ddbSpellToMetadata conversion
            const meta = ddbSpellToMetadata(bb!);
            expect(meta.name).toBe("Booming Blade");
            expect(meta.level).toBe(0);
            expect(meta.damage).toBe("1d8 Thunder");

            // Verify dynamic registration in spellInfo
            registerDynamicSpells([meta]);
            const retrievedMeta = getSpellMetadata("booming_blade");
            expect(retrievedMeta.name).toBe("Booming Blade");
            expect(retrievedMeta.level).toBe(0);
            expect(retrievedMeta.school).toBe("Evocation");
        });

        it("strips HTML tags and entities properly", () => {
            const raw = "<p>Creatures take <strong>2d6</strong> fire damage &mdash; &lsquo;test&rsquo; &nbsp; &ldquo;quoted&rdquo;</p>";
            expect(stripHtml(raw)).toBe("Creatures take 2d6 fire damage — 'test'   \"quoted\"");
        });
    });

    describe("getLinkedDDBCharacterId", () => {
        it("retrieves ID from token metadata with number", () => {
            const item = { metadata: { "eu.armindo.embers/ddb-character-id": 45678 } };
            expect(getLinkedDDBCharacterId(item)).toBe(45678);
        });

        it("retrieves ID from token metadata with numeric string", () => {
            const item = { metadata: { "eu.armindo.embers/ddb-character-id": "45678" } };
            expect(getLinkedDDBCharacterId(item)).toBe(45678);
        });

        it("returns null when metadata is missing or invalid", () => {
            expect(getLinkedDDBCharacterId({})).toBeNull();
            expect(getLinkedDDBCharacterId({ metadata: {} })).toBeNull();
            expect(getLinkedDDBCharacterId({ metadata: { "eu.armindo.embers/ddb-character-id": "invalid" } })).toBeNull();
        });
    });

    describe("cacheDDBCharacter & getCachedDDBCharacter", () => {
        beforeEach(() => {
            const store: Record<string, string> = {};
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (globalThis as any).localStorage = {
                getItem: (k: string) => store[k] ?? null,
                setItem: (k: string, v: string) => { store[k] = v; },
                removeItem: (k: string) => { delete store[k]; },
                clear: () => { Object.keys(store).forEach(k => delete store[k]); },
                key: (i: number) => Object.keys(store)[i] ?? null,
                length: 0,
            };
        });

        it("persists character to localStorage cache and retrieves it", () => {
            const char = parseDDBCharacterData(mockRawDDB);

            cacheDDBCharacter(char);
            const retrieved = getCachedDDBCharacter(char.id);

            expect(retrieved).not.toBeNull();
            expect(retrieved?.id).toBe(char.id);
            expect(retrieved?.name).toBe("Gale of Waterdeep");
            expect(retrieved?.spellSaveDC).toBe(15);
        });
    });

    describe("real character 170484944 parsing", () => {
        it("accurately parses ability scores, modifiers, spell attack bonus, and save DCs", async () => {
            const fs = await import("fs");
            const path = "C:/Users/Nattawut/.gemini/antigravity/brain/ca11a4b2-5109-4e47-9096-dc45d03fc24d/scratch/character_170484944.json";
            if (!fs.existsSync(path)) return;
            const raw = JSON.parse(fs.readFileSync(path, "utf-8"));
            const char = parseDDBCharacterData(raw);

            console.log("PARSED CHAR STATS:", char.stats);
            console.log("PARSED CHAR MODS:", char.modifiers);
            console.log("PARSED ATK BONUS:", char.spellAttackBonus);
            console.log("PARSED SAVE DC:", char.spellSaveDC);
            const hex = char.spells.find(s => s.name.toLowerCase() === "hex");
            console.log("PARSED HEX:", hex);

            // Based on user screenshot:
            // STR: 8 (-1), DEX: 16 (+3), CON: 14 (+2), INT: 12 (+1), WIS: 10 (+0), CHA: 16 (+3)
            expect(char.stats.dex).toBe(16);
            expect(char.modifiers.dex).toBe(3);
            expect(char.stats.cha).toBe(16);
            expect(char.modifiers.cha).toBe(3);
            expect(char.spellAttackBonus).toBe(6);
            expect(char.spellSaveDCDisplay).toBe("14 | 15");
            expect(hex?.saveOrAttack).toBeUndefined();

            // Eldritch Blast with Agonizing Blast (+3 CHA modifier) & Level 6 scaling (2 beams)
            const eb = char.spells.find(s => s.name === "Eldritch Blast");
            expect(eb).toBeDefined();
            expect(eb?.damage).toBe("1d10+3 Force");
            expect(eb?.beamCount).toBe(2);
            expect(eb?.notes).toContain("Count: 2");

            // Chill Touch Level 6 cantrip scaling (2d10)
            const chill = char.spells.find(s => s.name === "Chill Touch");
            expect(chill).toBeDefined();
            expect(chill?.damage).toBe("2d10");

            // Two-Weapon Fighting & Thrown Weapon detection
            expect(char.hasTwoWeaponFighting).toBe(true);
            expect(char.offhandWeapon).toBeDefined();
            const dagger1 = char.weapons?.find(w => w.name === "Dagger, +1");
            expect(dagger1).toBeDefined();

            // Verify phantom Circle Spell bug entries from DDB API are cleanly filtered out
            const circleActions = (char.actions || []).filter(a => a.name.toLowerCase().includes("circle spell"));
            expect(circleActions.length).toBe(0);
            expect(dagger1?.reachFeet).toBe(5);
            expect(dagger1?.hasThrown).toBe(true);
            expect(dagger1?.thrownRange).toBe(20);
            expect(dagger1?.thrownLongRange).toBe(60);
            expect(dagger1?.isLight).toBe(true);

            // Core stats matching D&D Beyond screenshot:
            // HP: 43 / 43, Speed: 30 ft, AC: 16, Initiative: +3 with Advantage, Defenses: Necrotic
            expect(char.hp).toEqual({ current: 43, max: 43, temp: 0 });
            expect(char.speed).toBe(30);
            expect(char.armorClass).toBe(16);
            expect(char.initiative).toBe(3);
            expect(char.hasInitiativeAdvantage).toBe(true);
            expect(char.defenses?.resistances).toContain("Necrotic");

            // Verify Image 2: Saving Throws (WIS +3 proficient, CHA +6 proficient, CON +2 unproficient)
            expect(char.savingThrows?.wis.proficient).toBe(true);
            expect(char.savingThrows?.wis.bonus).toBe(3);
            expect(char.savingThrows?.cha.proficient).toBe(true);
            expect(char.savingThrows?.cha.bonus).toBe(6);
            expect(char.savingThrows?.con.proficient).toBe(false);
            expect(char.savingThrows?.con.bonus).toBe(2);
            expect(char.savingThrows?.str.bonus).toBe(-1);
            expect(char.savingThrows?.dex.bonus).toBe(3);
            expect(char.savingThrows?.int.bonus).toBe(1);

            // Verify Image 2: Skills (Arcana +4 prof, Stealth +6 prof, Insight +3 prof, Investigation +4 prof)
            const arcana = char.skills?.find(s => s.name === "Arcana");
            expect(arcana?.bonus).toBe(4);
            expect(arcana?.proficient).toBe(true);

            const stealth = char.skills?.find(s => s.name === "Stealth");
            expect(stealth?.bonus).toBe(6);
            expect(stealth?.proficient).toBe(true);

            const acrobatics = char.skills?.find(s => s.name === "Acrobatics");
            expect(acrobatics?.bonus).toBe(3);
            expect(acrobatics?.proficient).toBe(false);

            // Verify Image 2: Senses & Proficiencies
            expect(char.sensesInfo?.passivePerception).toBe(10);
            expect(char.sensesInfo?.passiveInvestigation).toBe(14);
            expect(char.sensesInfo?.passiveInsight).toBe(13);
            expect(char.proficiencies?.armor).toContain("Light Armor");
            expect(char.proficiencies?.weapons).toContain("Simple Weapons");
            expect(char.proficiencies?.languages).toContain("Alzhedo");

            // Verify Inventory, Attunement (Augment) & Background
            expect(char.inventory && char.inventory.length).toBeGreaterThan(0);
            expect(char.attunement).toEqual({ current: 1, max: 3 });
            const warningDagger = char.inventory?.find(i => i.name.includes("Warning"));
            expect(warningDagger?.isAttuned).toBe(true);
            expect(warningDagger?.canAttune).toBe(true);
            expect(char.currencies?.gp).toBe(2364);
            expect(char.backgroundInfo?.name).toBe("Wayfarer");
        });
    });

    describe("DDB Accuracy & Rule Verifications", () => {
        it("correctly maps all DDB limitedUse resetType values via DDB_RESET_TYPE_MAP", () => {
            expect(DDB_RESET_TYPE_MAP[1]).toBe("Short Rest");
            expect(DDB_RESET_TYPE_MAP[2]).toBe("Long Rest");
            expect(DDB_RESET_TYPE_MAP[3]).toBe("Dawn");
            expect(DDB_RESET_TYPE_MAP[4]).toBe("Daily");
            expect(DDB_RESET_TYPE_MAP[5]).toBe("Weekly");

            const raw = {
                id: 99901,
                name: "Cleric of Dawn",
                classes: [{ level: 5, definition: { name: "Cleric" } }],
                stats: [{ id: 1, value: 10 }, { id: 2, value: 10 }, { id: 3, value: 10 }, { id: 4, value: 10 }, { id: 5, value: 16 }, { id: 6, value: 10 }],
                actions: {
                    feat: [
                        {
                            id: 301,
                            name: "Channel Divinity: Radiance of the Dawn",
                            limitedUse: { maxUses: 2, numberUsed: 1, resetType: 3 }
                        },
                        {
                            id: 302,
                            name: "Daily Species Trait",
                            limitedUse: { maxUses: 1, numberUsed: 0, resetType: 4 }
                        }
                    ]
                }
            };
            const parsed = parseDDBCharacterData(raw);
            const radiance = parsed.actions?.find(a => a.name.includes("Radiance of the Dawn"));
            expect(radiance?.limitedUse?.resetType).toBe("Dawn");

            const dailyTrait = parsed.actions?.find(a => a.name.includes("Daily Species Trait"));
            expect(dailyTrait?.limitedUse?.resetType).toBe("Daily");
        });

        it("parses spell slots through level 9 for high-level casters", () => {
            const raw = {
                id: 99902,
                name: "Archmage Elminster",
                classes: [{ level: 17, definition: { name: "Wizard" } }],
                stats: [{ id: 1, value: 10 }, { id: 2, value: 14 }, { id: 3, value: 14 }, { id: 4, value: 20 }, { id: 5, value: 14 }, { id: 6, value: 12 }],
                spellSlots: [
                    { level: 7, used: 1 },
                    { level: 8, used: 0 },
                    { level: 9, used: 1 }
                ]
            };
            const parsed = parseDDBCharacterData(raw);
            expect(parsed.spellSlots[7]).toBeDefined();
            expect(parsed.spellSlots[7].max).toBe(1);
            expect(parsed.spellSlots[7].used).toBe(1);

            expect(parsed.spellSlots[8]).toBeDefined();
            expect(parsed.spellSlots[8].max).toBe(1);
            expect(parsed.spellSlots[8].used).toBe(0);

            expect(parsed.spellSlots[9]).toBeDefined();
            expect(parsed.spellSlots[9].max).toBe(1);
            expect(parsed.spellSlots[9].used).toBe(1);
        });

        it("correctly reads heroicInspiration from data.inspiration", () => {
            const rawInspired = {
                id: 99903,
                name: "Inspired Hero",
                inspiration: true,
                classes: [{ level: 1, definition: { name: "Fighter" } }],
                stats: [{ id: 1, value: 16 }, { id: 2, value: 14 }, { id: 3, value: 14 }, { id: 4, value: 10 }, { id: 5, value: 10 }, { id: 6, value: 10 }]
            };
            const parsed = parseDDBCharacterData(rawInspired);
            expect(parsed.heroicInspiration).toBe(true);

            const rawUninspired = {
                id: 99904,
                name: "Uninspired Hero",
                inspiration: false,
                classes: [{ level: 1, definition: { name: "Fighter" } }],
                stats: [{ id: 1, value: 16 }, { id: 2, value: 14 }, { id: 3, value: 14 }, { id: 4, value: 10 }, { id: 5, value: 10 }, { id: 6, value: 10 }]
            };
            const parsedUninspired = parseDDBCharacterData(rawUninspired);
            expect(parsedUninspired.heroicInspiration).toBe(false);
        });

        it("derives offhand magic bonus from inventory grantedModifiers even without +X in weapon name", () => {
            const raw = {
                id: 99905,
                name: "Drizzt",
                classes: [{ level: 5, definition: { name: "Ranger" } }],
                stats: [{ id: 1, value: 10 }, { id: 2, value: 18 }, { id: 3, value: 14 }, { id: 4, value: 12 }, { id: 5, value: 14 }, { id: 6, value: 10 }],
                inventory: [
                    {
                        id: 501,
                        equipped: true,
                        definition: {
                            id: 801,
                            name: "Scimitar of Speed",
                            filterType: "Weapon",
                            properties: [{ name: "Light" }, { name: "Finesse" }],
                            damage: { diceString: "1d6" },
                            damageType: "Slashing",
                            grantedModifiers: [
                                { type: "bonus", subType: "magic", value: 2 }
                            ]
                        }
                    },
                    {
                        id: 502,
                        equipped: true,
                        definition: {
                            id: 802,
                            name: "Icingdeath Frost Scimitar",
                            filterType: "Weapon",
                            properties: [{ name: "Light" }, { name: "Finesse" }],
                            damage: { diceString: "1d6" },
                            damageType: "Slashing",
                            grantedModifiers: [
                                { type: "bonus", subType: "magic", value: 3 }
                            ]
                        }
                    }
                ]
            };
            const parsed = parseDDBCharacterData(raw);
            expect(parsed.hasTwoWeaponFighting).toBe(true);
            expect(parsed.offhandWeapon).toBeDefined();
            // Should be +3 from grantedModifiers even though name doesn't say "+3"
            expect(parsed.offhandWeapon?.damage).toBe("1d6+3");
        });

        it("extracts limitedUse and resetType from description when DDB omits structured limitedUse", () => {
            const raw = {
                id: 99906,
                name: "Lucky Adventurer",
                classes: [{ level: 4, definition: { name: "Rogue" } }],
                stats: [{ id: 1, value: 10 }, { id: 2, value: 16 }, { id: 3, value: 14 }, { id: 4, value: 12 }, { id: 5, value: 10 }, { id: 6, value: 10 }],
                actions: {
                    feat: [
                        {
                            id: 777,
                            name: "Lucky",
                            snippet: "You have 3 luck points. You regain expended luck points when you finish a Long Rest."
                            // Note: limitedUse structured object omitted intentionally
                        }
                    ]
                }
            };
            const parsed = parseDDBCharacterData(raw);
            const lucky = parsed.actions?.find(a => a.name === "Lucky");
            expect(lucky).toBeDefined();
            expect(lucky?.limitedUse).toBeDefined();
            expect(lucky?.limitedUse?.max).toBe(3);
            expect(lucky?.limitedUse?.resetType).toBe("Long Rest");
        });

        it("dynamically scales Booming Blade rider at character level 5+", () => {
            const raw = {
                id: 99907,
                name: "Hexblade",
                classes: [{ level: 5, definition: { name: "Warlock" } }],
                stats: [{ id: 1, value: 10 }, { id: 2, value: 14 }, { id: 3, value: 14 }, { id: 4, value: 10 }, { id: 5, value: 10 }, { id: 6, value: 18 }],
                classSpells: [
                    {
                        spells: [
                            {
                                prepared: true,
                                definition: {
                                    id: 888,
                                    name: "Booming Blade",
                                    level: 0,
                                    school: "Evocation",
                                    range: { rangeValue: 5 },
                                    description: "The weapon deals an extra 1d8 thunder damage. At 5th level (2d8), at 11th level (3d8), and at 17th level (4d8)."
                                }
                            }
                        ]
                    }
                ],
                inventory: [
                    {
                        id: 991,
                        equipped: true,
                        definition: {
                            id: 991,
                            name: "Rapier",
                            filterType: "Weapon",
                            properties: [{ name: "Finesse" }],
                            damage: { diceString: "1d8" },
                            damageType: "Piercing"
                        }
                    }
                ]
            };
            const parsed = parseDDBCharacterData(raw);
            const rapier = parsed.weapons?.find(w => w.name === "Rapier");
            expect(rapier?.cantripRiders).toBeDefined();
            expect(rapier?.cantripRiders?.[0]).toContain("Booming Blade: 2d8");
            expect(rapier?.cantripRiders?.[0]).toContain("2d8 🌧️ (if moves)");
        });

        it("accurately parses Hit Dice per class (die, total, used) including multiclassing", () => {
            const raw = {
                id: 99908,
                name: "Multiclass Caster",
                classes: [
                    {
                        level: 4,
                        hitDiceUsed: 1,
                        definition: { name: "Warlock", hitDice: 8 }
                    },
                    {
                        level: 2,
                        hitDiceUsed: 0,
                        definition: { name: "Wizard", hitDice: 6 }
                    }
                ],
                stats: [{ id: 1, value: 10 }, { id: 2, value: 14 }, { id: 3, value: 14 }, { id: 4, value: 16 }, { id: 5, value: 10 }, { id: 6, value: 14 }],
                inspiration: true
            };
            const parsed = parseDDBCharacterData(raw);
            expect(parsed.hitDice).toBeDefined();
            expect(parsed.hitDice?.length).toBe(2);
            expect(parsed.hitDice?.[0]).toEqual({ die: "d8", total: 4, used: 1 });
            expect(parsed.hitDice?.[1]).toEqual({ die: "d6", total: 2, used: 0 });
            expect(parsed.heroicInspiration).toBe(true);
        });
    });

    describe("fetchDDBCharacter", () => {
        beforeEach(() => {
            vi.restoreAllMocks();
        });

        it("throws informative error when DDB returns 403 Forbidden (character is Private)", async () => {
            global.fetch = vi.fn().mockResolvedValue({
                ok: false,
                status: 403,
                json: async () => ({
                    success: false,
                    message: "An unexpected error has occurred",
                    data: { serverMessage: "Unauthorized Access Attempt." }
                })
            } as any);

            await expect(fetchDDBCharacter(171883974)).rejects.toThrow(
                /Character 171883974 is set to Private on D&D Beyond/i
            );
        });

        it("throws informative error when DDB returns 404 Not Found", async () => {
            global.fetch = vi.fn().mockResolvedValue({
                ok: false,
                status: 404,
                json: async () => ({ message: "Not found" })
            } as any);

            await expect(fetchDDBCharacter(99999999)).rejects.toThrow(
                /Character 99999999 was not found on D&D Beyond/i
            );
        });

        it("throws clear network error when browser fetch fails with CORS error", async () => {
            global.fetch = vi.fn().mockRejectedValue(new TypeError("Failed to fetch"));

            await expect(fetchDDBCharacter(171883974)).rejects.toThrow(
                /Failed to connect to D&D Beyond/i
            );
        });
    });

    describe("hasPotentCantrip and hasWeaponGraze", () => {
        it("identifies Evocation Wizard level 6+ as having Potent Cantrip", () => {
            const evokerLv6 = {
                classes: [{ name: "Wizard", level: 6, subclass: "School of Evocation" }]
            } as any;
            expect(hasPotentCantrip(evokerLv6)).toBe(true);

            const evokerLv5 = {
                classes: [{ name: "Wizard", level: 5, subclass: "School of Evocation" }]
            } as any;
            expect(hasPotentCantrip(evokerLv5)).toBe(false);

            const abjurerLv6 = {
                classes: [{ name: "Wizard", level: 6, subclass: "School of Abjuration" }]
            } as any;
            expect(hasPotentCantrip(abjurerLv6)).toBe(false);
        });

        it("identifies Potent Cantrip via action or feat name", () => {
            const featChar = {
                feats: [{ name: "Potent Cantrip" }]
            } as any;
            expect(hasPotentCantrip(featChar)).toBe(true);

            const actionChar = {
                actions: [{ name: "Potent Cantrip (Evoker)" }]
            } as any;
            expect(hasPotentCantrip(actionChar)).toBe(true);

            expect(hasPotentCantrip(null)).toBe(false);
            expect(hasPotentCantrip(undefined)).toBe(false);
        });

        it("identifies weapons with the Graze mastery property", () => {
            const grazeWeapon = {
                name: "Glaive",
                properties: ["Heavy", "Reach", "Two-Handed", "Graze"]
            } as any;
            expect(hasWeaponGraze(grazeWeapon)).toBe(true);

            const normalWeapon = {
                name: "Longsword",
                properties: ["Versatile", "Sap"]
            } as any;
            expect(hasWeaponGraze(normalWeapon)).toBe(false);

            expect(hasWeaponGraze(null)).toBe(false);
            expect(hasWeaponGraze(undefined)).toBe(false);
        });
    });

    describe("AC calculation and spell preparation for prepared casters", () => {
        it("calculates AC 23 correctly for character wearing Plate, +2 and Shield, +1 with negative DEX", () => {
            const rawCharacter = {
                id: 171379419,
                name: "St.Arthur Trueheart",
                classes: [{ level: 5, definition: { name: "Paladin" } }],
                stats: [
                    { id: 1, value: 16 }, // STR 16 (+3)
                    { id: 2, value: 8 },  // DEX 8 (-1)
                    { id: 3, value: 14 }, // CON 14 (+2)
                    { id: 4, value: 10 }, // INT 10 (+0)
                    { id: 5, value: 12 }, // WIS 12 (+1)
                    { id: 6, value: 16 }  // CHA 16 (+3)
                ],
                inventory: [
                    {
                        equipped: true,
                        definition: {
                            id: 1001,
                            name: "Shield, +1",
                            filterType: "Armor", // DDB gives Shields filterType: "Armor"
                            type: null,
                            armorTypeId: 4,
                            armorClass: 2,
                            magic: true
                        }
                    },
                    {
                        equipped: true,
                        definition: {
                            id: 1002,
                            name: "Plate, +2",
                            filterType: "Armor",
                            type: null,
                            armorTypeId: 3,
                            armorClass: 18,
                            magic: true
                        }
                    }
                ],
                modifiers: {
                    race: [],
                    class: [],
                    background: [],
                    item: [
                        { type: "bonus", subType: "armor-class", value: 1, isGranted: true, friendlySubtypeName: "Armor Class" },
                        { type: "bonus", subType: "armor-class", value: 2, isGranted: true, friendlySubtypeName: "Armor Class" }
                    ],
                    feat: []
                }
            };

            const char = parseDDBCharacterData(rawCharacter);
            // Base plate 18 + heavy armor (no DEX) + shield base 2 + shield enchant 1 + plate enchant 2 = 23
            expect(char.armorClass).toBe(23);
        });

        it("correctly identifies prepared vs unprepared class spells for Paladin", () => {
            const paladinData = {
                id: 171379419,
                name: "Paladin Caster",
                classes: [{ id: 101, level: 5, definition: { name: "Paladin" } }],
                stats: [{ id: 6, value: 16 }],
                classSpells: [
                    {
                        characterClassId: 101,
                        spells: [
                            {
                                prepared: false,
                                alwaysPrepared: false,
                                countsAsKnownSpell: true, // DDB sets this to true even when unprepared
                                definition: {
                                    id: 201,
                                    name: "Divine Favor",
                                    level: 1,
                                    school: "Transmutation"
                                }
                            },
                            {
                                prepared: false,
                                alwaysPrepared: false,
                                countsAsKnownSpell: true,
                                definition: {
                                    id: 202,
                                    name: "Aid",
                                    level: 2,
                                    school: "Abjuration"
                                }
                            }
                        ]
                    }
                ],
                spells: {
                    class: [
                        {
                            prepared: false,
                            alwaysPrepared: true, // Subclass oath spell or Divine Smite
                            countsAsKnownSpell: false,
                            definition: {
                                id: 203,
                                name: "Guiding Bolt",
                                level: 1,
                                school: "Evocation"
                            }
                        },
                        {
                            prepared: false,
                            alwaysPrepared: false,
                            countsAsKnownSpell: false,
                            definition: {
                                id: 204,
                                name: "Sacred Flame",
                                level: 0, // Cantrip is always prepared
                                school: "Evocation"
                            }
                        }
                    ]
                }
            };

            const char = parseDDBCharacterData(paladinData);
            const divineFavor = char.spells.find(s => s.name === "Divine Favor");
            const aid = char.spells.find(s => s.name === "Aid");
            const guidingBolt = char.spells.find(s => s.name === "Guiding Bolt");
            const sacredFlame = char.spells.find(s => s.name === "Sacred Flame");

            expect(divineFavor).toBeDefined();
            expect(divineFavor?.isPrepared).toBe(false);

            expect(aid).toBeDefined();
            expect(aid?.isPrepared).toBe(false);

            expect(guidingBolt).toBeDefined();
            expect(guidingBolt?.isPrepared).toBe(true);

            expect(sacredFlame).toBeDefined();
            expect(sacredFlame?.isPrepared).toBe(true);
        });
    });
});

