import type { DDBFeatureAction, DDBParsedCharacter } from "../../../types/ddb";
import { CLASS_MANUAL_FORMULAS } from "../../../assets/manual-formulas";

const fontOfMagic = CLASS_MANUAL_FORMULAS.sorcerer.fontOfMagic;

type FeatureFallback = {
    matches: (character: DDBParsedCharacter) => boolean;
    findExisting: (features: DDBFeatureAction[]) => DDBFeatureAction | undefined;
    create: (character: DDBParsedCharacter) => DDBFeatureAction;
};

function hasFeatOrAction(character: DDBParsedCharacter, name: string): boolean {
    const lower = name.toLowerCase();
    const inFeats = character.feats?.some(f => f.name.toLowerCase().includes(lower)) ?? false;
    const inActions = character.actions?.some(a => a.name.toLowerCase().includes(lower)) ?? false;
    return inFeats || inActions;
}

function hasSubclassOrAction(character: DDBParsedCharacter, name: string): boolean {
    const lower = name.toLowerCase();
    const inSubclass = character.classes?.some(c => c.subclass?.toLowerCase().includes(lower)) ?? false;
    const inActions = character.actions?.some(a => a.name.toLowerCase().includes(lower)) ?? false;
    return inSubclass || inActions;
}

const featureFallbacks: FeatureFallback[] = [
    // ── Class Features ─────────────────────────────────────────────────────────
    {
        matches: character => character.classes.some(c => c.name.toLowerCase().includes("sorcerer") && c.level > 0),
        findExisting: features => features.find(feature => feature.name.toLowerCase().includes("font of magic")),
        create: character => {
            const sorcererLevel = character.classes
                .filter(c => c.name.toLowerCase().includes("sorcerer"))
                .reduce((total, c) => total + c.level, 0);

            return {
                id: fontOfMagic.id,
                name: fontOfMagic.name,
                source: "class",
                activationType: fontOfMagic.activationType,
                description: "Your Sorcery Points fuel Metamagic and other magical effects. You have " + sorcererLevel +
                    " Sorcery Points, regained when you finish a Long Rest. You can expend a spell slot to gain Sorcery Points equal to its level (no action required), or use a Bonus Action to create a spell slot (maximum level 5): level 1 costs 2 points, level 2 costs 3, level 3 costs 5, level 4 costs 6, and level 5 costs 7. Created spell slots vanish when you finish a Long Rest.",
                rangeText: "Self",
                limitedUse: {
                    max: sorcererLevel * (fontOfMagic.resource?.maxPerClassLevel ?? 1),
                    used: 0,
                    resetType: fontOfMagic.resource?.resetType ?? "Long Rest"
                }
            };
        }
    },

    // ── VSSPP2 Subclass Features ────────────────────────────────────────────────
    {
        matches: character => hasSubclassOrAction(character, "masks"),
        findExisting: features => features.find(f => f.name.toLowerCase().includes("persona masks")),
        create: character => ({
            id: "embers:bard:college-of-masks:persona-masks",
            name: "Persona Masks",
            source: "class",
            activationType: "bonus",
            description: "Put on or switch a persona mask as a Bonus Action. Channel the archetype of Angel, Archmage, Devil, Dragon, Faceless, Gladiator, Hierophant, Jester, or Noble.",
            rangeText: "Self",
            limitedUse: {
                max: Math.max(1, character.modifiers?.cha ?? 1),
                used: 0,
                resetType: "Short or Long Rest"
            }
        })
    },
    {
        matches: character => hasSubclassOrAction(character, "masks"),
        findExisting: features => features.find(f => f.name.toLowerCase().includes("virtuoso skill")),
        create: character => ({
            id: "embers:bard:college-of-masks:virtuoso-skill",
            name: "Virtuoso Skill",
            source: "class",
            activationType: "special",
            description: "Once per turn when you make a D20 Test, make it with Charisma instead of its normal ability score.",
            rangeText: "Self",
            limitedUse: {
                max: Math.max(1, character.modifiers?.cha ?? 1),
                used: 0,
                resetType: "Long Rest"
            }
        })
    },
    {
        matches: character => hasSubclassOrAction(character, "dragon domain") || (hasSubclassOrAction(character, "dragon") && character.classes?.some(c => c.name.toLowerCase().includes("cleric"))),
        findExisting: features => features.find(f => f.name.toLowerCase().includes("chromatic affinity")),
        create: character => {
            const clericLevel = character.classes
                .filter(c => c.name.toLowerCase().includes("cleric"))
                .reduce((total, c) => total + c.level, 0);
            return {
                id: "embers:cleric:dragon-domain:chromatic-affinity",
                name: "Chromatic Affinity",
                source: "class",
                activationType: "special",
                description: `Transmute Necrotic/Radiant Cleric damage to Acid, Cold, Fire, Lightning, or Poison. Once per turn deal +${clericLevel} extra elemental damage.`,
                rangeText: "Self",
                limitedUse: {
                    max: Math.max(1, character.modifiers?.wis ?? 1),
                    used: 0,
                    resetType: "Long Rest"
                }
            };
        }
    },
    {
        matches: character => hasSubclassOrAction(character, "dragon domain") || (hasSubclassOrAction(character, "dragon") && character.classes?.some(c => c.name.toLowerCase().includes("cleric"))),
        findExisting: features => features.find(f => f.name.toLowerCase().includes("draconic majesty")),
        create: character => ({
            id: "embers:cleric:dragon-domain:draconic-majesty",
            name: "Channel Divinity: Draconic Majesty",
            source: "class",
            activationType: "action",
            description: `Expend 1 Channel Divinity to project a 30-ft emanation aura of draconic majesty. Chosen creatures make a Wisdom save (DC ${character.spellSaveDC}) or become Charmed or Frightened for 1 minute.`,
            rangeText: "30 ft."
        })
    },
    {
        matches: character => hasSubclassOrAction(character, "city"),
        findExisting: features => features.find(f => f.name.toLowerCase().includes("city shape")),
        create: () => ({
            id: "embers:druid:circle-of-the-city:city-shape",
            name: "Circle of the City: City Shape",
            source: "class",
            activationType: "action",
            description: "Expend 1 Wild Shape to cast Meld into Stone, Passwall, or Stone Shape without expending a spell slot.",
            rangeText: "Self"
        })
    },
    {
        matches: character => hasSubclassOrAction(character, "city"),
        findExisting: features => features.find(f => f.name.toLowerCase().includes("wall warp")),
        create: () => ({
            id: "embers:druid:circle-of-the-city:wall-warp",
            name: "Circle of the City: Wall Warp",
            source: "class",
            activationType: "reaction",
            description: "Reaction when a creature within 60 ft takes attack damage: manifest a 10x10 ft stone barrier (AC 15, 30 HP) absorbing the damage.",
            rangeText: "60 ft.",
            limitedUse: {
                max: 1,
                used: 0,
                resetType: "Long Rest"
            }
        })
    },
    {
        matches: character => hasSubclassOrAction(character, "beastborne"),
        findExisting: features => features.find(f => f.name.toLowerCase().includes("bestial aspect")),
        create: () => ({
            id: "embers:ranger:beastborne:bestial-aspect",
            name: "Beastborne: Bestial Aspect",
            source: "class",
            activationType: "bonus",
            description: "On dealing damage, Bonus Action to advance Bestial Aspect Level (1 to 5): L1 Carnage (+2 dmg), L2 Fast Movement (+10 ft), L3 Blood Frenzy (Adv on wounded), L4 Thick Hide (+2 AC), L5 Retaliation (reaction attack).",
            rangeText: "Self"
        })
    },
    {
        matches: character => hasSubclassOrAction(character, "heroic"),
        findExisting: features => features.find(f => f.name.toLowerCase().includes("heroic soul")),
        create: character => {
            const sorcLevel = character.classes
                .filter(c => c.name.toLowerCase().includes("sorcerer"))
                .reduce((total, c) => total + c.level, 0);
            return {
                id: "embers:sorcerer:heroic-sorcery:heroic-soul",
                name: "Heroic Sorcery: Heroic Soul",
                source: "class",
                activationType: "special",
                description: `At the start of your turn, spend 1 Sorcery Point (no action required) to gain 1d6 + ${sorcLevel} Temporary Hit Points.`,
                rangeText: "Self"
            };
        }
    },
    {
        matches: character => hasSubclassOrAction(character, "heroic"),
        findExisting: features => features.find(f => f.name.toLowerCase().includes("mystical maneuvers")),
        create: character => ({
            id: "embers:sorcerer:heroic-sorcery:mystical-maneuvers",
            name: "Heroic Sorcery: Mystical Maneuvers",
            source: "class",
            activationType: "bonus",
            description: `On weapon or unarmed hit, spend 2 Sorcery Points as a Bonus Action for Blinding Attack (+2d8, DC ${character.spellSaveDC} CON save vs Blinded), Ruinous Blow (+2d8, −3 AC), or Wounding Strike (+2d8, 1d8/turn bleed).`,
            rangeText: "Self"
        })
    },
    {
        matches: character => hasSubclassOrAction(character, "magic missile mage"),
        findExisting: features => features.find(f => f.name.toLowerCase().includes("magic missile savant")),
        create: character => ({
            id: "embers:wizard:magic-missile-mage:magic-missile-savant",
            name: "Magic Missile Savant: Free Cast",
            source: "class",
            activationType: "action",
            description: "Cast Magic Missile without expending a spell slot. Creates extra darts based on level, and penetrating darts ignore Shield spells.",
            rangeText: "120 ft.",
            limitedUse: {
                max: Math.max(1, character.modifiers?.int ?? 1),
                used: 0,
                resetType: "Long Rest (1 on Short Rest)"
            }
        })
    },
    {
        matches: character => hasSubclassOrAction(character, "magic missile mage"),
        findExisting: features => features.find(f => f.name.toLowerCase().includes("shield of missiles")),
        create: () => ({
            id: "embers:wizard:magic-missile-mage:shield-of-missiles",
            name: "Magic Missile Mage: Shield of Missiles",
            source: "class",
            activationType: "special",
            description: "Orbiting 10-ft emanation barrier of Magic Missiles (+1 AC per dart max +5, retaliate on miss dealing dart damage, damage creatures entering emanation).",
            rangeText: "Self (10-ft. Emanation)",
            limitedUse: {
                max: 1,
                used: 0,
                resetType: "Long Rest"
            }
        })
    },
    {
        matches: character => hasSubclassOrAction(character, "magic missile mage"),
        findExisting: features => features.find(f => f.name.toLowerCase().includes("giga-missile")),
        create: character => ({
            id: "embers:wizard:magic-missile-mage:giga-missile",
            name: "Magic Missile Mage: Giga-Missile",
            source: "class",
            activationType: "special",
            description: `When casting Magic Missile, each dart deals extra Force damage equal to +${Math.max(1, character.modifiers?.int ?? 1)}.`,
            rangeText: "Self",
            limitedUse: {
                max: 1,
                used: 0,
                resetType: "Long Rest"
            }
        })
    },
    {
        matches: character => hasSubclassOrAction(character, "pistolero"),
        findExisting: features => features.find(f => f.name.toLowerCase().includes("fan the hammer")),
        create: () => ({
            id: "embers:gunslinger:pistolero:fan-the-hammer",
            name: "Pistolero: Fan the Hammer",
            source: "class",
            activationType: "bonus",
            description: "When taking the Attack action with a one-handed Ranged weapon, expend 1 Risk Die as a Bonus Action to make two additional ranged attacks with Disadvantage.",
            rangeText: "Weapon"
        })
    },
    {
        matches: character => hasSubclassOrAction(character, "pistolero"),
        findExisting: features => features.find(f => f.name.toLowerCase().includes("showdown")),
        create: () => ({
            id: "embers:gunslinger:pistolero:showdown",
            name: "Pistolero: Showdown",
            source: "class",
            activationType: "special",
            description: "On rolling Initiative, expend 1 Risk Die to quickdraw and attack with bonus Risk Die damage. On hit, target has Disadvantage against others in round 1.",
            rangeText: "Weapon"
        })
    },

    // ── Additional Classes & Subclasses (VSSPP2, GHPG, AU, FRHOF, EFOTA) ───────
    // Gunslinger Base Class
    {
        matches: character => character.classes.some(c => c.name.toLowerCase().includes("gunslinger") && c.level > 0),
        findExisting: features => features.find(f => f.name.toLowerCase().includes("risk dice") || f.name.toLowerCase().includes("deeds")),
        create: character => {
            const gsLevel = character.classes
                .filter(c => c.name.toLowerCase().includes("gunslinger"))
                .reduce((total, c) => total + c.level, 0);
            const diceCount = gsLevel < 5 ? 2 : gsLevel < 9 ? 3 : gsLevel < 13 ? 4 : gsLevel < 17 ? 5 : 6;
            return {
                id: "embers:gunslinger:deeds",
                name: "Gunslinger: Deeds & Risk Dice",
                source: "class",
                activationType: "special",
                description: "Expend Risk Dice to perform deeds such as Covering Fire, Piercing Shot, and Quick Draw. Regain all Risk Dice on Short or Long Rest.",
                rangeText: "Self",
                limitedUse: {
                    max: diceCount,
                    used: 0,
                    resetType: "Short or Long Rest"
                }
            };
        }
    },
    // Monster Hunter Base Class
    {
        matches: character => character.classes.some(c => c.name.toLowerCase().includes("monster hunter") && c.level > 0),
        findExisting: features => features.find(f => f.name.toLowerCase().includes("focus") || f.name.toLowerCase().includes("studied response")),
        create: character => {
            const mhLevel = character.classes
                .filter(c => c.name.toLowerCase().includes("monster hunter"))
                .reduce((total, c) => total + c.level, 0);
            return {
                id: "embers:monster-hunter:focus",
                name: "Monster Hunter: Focus",
                source: "class",
                activationType: "bonus",
                description: "Focus Points fuel your tactical acumen and combat composure. Spend Focus to fuel Studied Response, Guild techniques, and exploit vulnerabilities.",
                rangeText: "Self",
                limitedUse: {
                    max: mhLevel + Math.max(1, character.modifiers?.int ?? character.modifiers?.wis ?? 1),
                    used: 0,
                    resetType: "Short or Long Rest"
                }
            };
        }
    },
    // Artificer Base Class
    {
        matches: character => character.classes.some(c => c.name.toLowerCase().includes("artificer") && c.level >= 2),
        findExisting: features => features.find(f => f.name.toLowerCase().includes("infuse item") || f.name.toLowerCase().includes("infusion")),
        create: character => {
            const artLevel = character.classes
                .filter(c => c.name.toLowerCase().includes("artificer"))
                .reduce((total, c) => total + c.level, 0);
            const infusedItemsMax = artLevel < 6 ? 2 : artLevel < 10 ? 3 : artLevel < 14 ? 4 : artLevel < 18 ? 5 : 6;
            return {
                id: "embers:artificer:infuse-item",
                name: "Artificer: Infuse Item",
                source: "class",
                activationType: "special",
                description: "Imbue mundane items with magical infusions, turning them into magic items. Regain infusions upon finishing a Long Rest.",
                rangeText: "Touch",
                limitedUse: {
                    max: infusedItemsMax,
                    used: 0,
                    resetType: "Long Rest"
                }
            };
        }
    },
    {
        matches: character => character.classes.some(c => c.name.toLowerCase().includes("artificer") && c.level >= 7),
        findExisting: features => features.find(f => f.name.toLowerCase().includes("flash of genius")),
        create: character => ({
            id: "embers:artificer:flash-of-genius",
            name: "Artificer: Flash of Genius",
            source: "class",
            activationType: "reaction",
            description: "Reaction when you or another creature within 30 ft makes an ability check or saving throw: add your Intelligence modifier to the roll.",
            rangeText: "30 ft.",
            limitedUse: {
                max: Math.max(1, character.modifiers?.int ?? 1),
                used: 0,
                resetType: "Long Rest"
            }
        })
    },
    // Artificer Subclasses
    {
        matches: character => hasSubclassOrAction(character, "alchemist"),
        findExisting: features => features.find(f => f.name.toLowerCase().includes("experimental elixir")),
        create: character => ({
            id: "embers:artificer:alchemist:experimental-elixir",
            name: "Alchemist: Experimental Elixir",
            source: "class",
            activationType: "action",
            description: "Produce experimental elixirs touching an empty flask. Roll or choose: Healing, Swiftness, Resilience, Boldness, Flight, Transformation.",
            rangeText: "Touch",
            limitedUse: {
                max: Math.max(1, character.modifiers?.int ?? 1),
                used: 0,
                resetType: "Long Rest"
            }
        })
    },
    {
        matches: character => hasSubclassOrAction(character, "armorer"),
        findExisting: features => features.find(f => f.name.toLowerCase().includes("arcane armor") || f.name.toLowerCase().includes("armor model")),
        create: () => ({
            id: "embers:artificer:armorer:arcane-armor",
            name: "Armorer: Arcane Armor",
            source: "class",
            activationType: "action",
            description: "Turn a suit of armor into Arcane Armor as an action. Choose Guardian (Thunder Gauntlets, Defensive Field) or Infiltrator (Lightning Launcher, Powered Steps, Dampening Field).",
            rangeText: "Self"
        })
    },
    {
        matches: character => hasSubclassOrAction(character, "artillerist"),
        findExisting: features => features.find(f => f.name.toLowerCase().includes("eldritch cannon")),
        create: () => ({
            id: "embers:artificer:artillerist:eldritch-cannon",
            name: "Artillerist: Eldritch Cannon",
            source: "class",
            activationType: "action",
            description: "Create a Small or Tiny Eldritch Cannon (Flamethrower, Force Ballista, or Protector) within 5 ft for 1 hour. Activate as a Bonus Action.",
            rangeText: "5 ft.",
            limitedUse: {
                max: 1,
                used: 0,
                resetType: "Long Rest"
            }
        })
    },
    {
        matches: character => hasSubclassOrAction(character, "battle smith"),
        findExisting: features => features.find(f => f.name.toLowerCase().includes("steel defender")),
        create: () => ({
            id: "embers:artificer:battle-smith:steel-defender",
            name: "Battle Smith: Steel Defender",
            source: "class",
            activationType: "bonus",
            description: "Command your companion Steel Defender as a Bonus Action in combat (Force-Empowered Rend, Repair, Deflect Attack).",
            rangeText: "60 ft."
        })
    },
    {
        matches: character => hasSubclassOrAction(character, "cartographer"),
        findExisting: features => features.find(f => f.name.toLowerCase().includes("cartographer") || f.name.toLowerCase().includes("mapper's survey")),
        create: () => ({
            id: "embers:artificer:cartographer:mappers-survey",
            name: "Cartographer: Mapper's Survey",
            source: "class",
            activationType: "action",
            description: "Survey terrain or an architectural site to create a magical navigational blueprint, revealing traps, secret paths, and contours.",
            rangeText: "Self"
        })
    },
    // Monster Hunter Guilds
    {
        matches: character => hasSubclassOrAction(character, "weapon master"),
        findExisting: features => features.find(f => f.name.toLowerCase().includes("close quarters") || f.name.toLowerCase().includes("master's stride")),
        create: () => ({
            id: "embers:monster-hunter:guild-of-the-weapon-master:close-quarters",
            name: "Weapon Master: Close Quarters",
            source: "class",
            activationType: "special",
            description: "Spend Focus to maneuver through hostile threat zones without provoking Opportunity Attacks and strike with increased reach.",
            rangeText: "Self"
        })
    },
    {
        matches: character => hasSubclassOrAction(character, "mystic"),
        findExisting: features => features.find(f => f.name.toLowerCase().includes("mystic focus") || f.name.toLowerCase().includes("ward")),
        create: () => ({
            id: "embers:monster-hunter:guild-of-the-mystic:mystic-focus",
            name: "Guild of the Mystic: Mystic Focus",
            source: "class",
            activationType: "bonus",
            description: "Weave arcane power into your martial weapon strikes, expending Focus to pierce magical resistances and deflect spell attacks.",
            rangeText: "Self"
        })
    },
    {
        matches: character => hasSubclassOrAction(character, "apothecary"),
        findExisting: features => features.find(f => f.name.toLowerCase().includes("poultice craft") || f.name.toLowerCase().includes("tincture")),
        create: character => ({
            id: "embers:monster-hunter:guild-of-the-apothecary:poultice-craft",
            name: "Apothecary: Poultice Craft",
            source: "class",
            activationType: "bonus",
            description: "Administer rapid concoctions and healing salves to cleanse poisons, neutralize acids, or restore vitality.",
            rangeText: "Touch",
            limitedUse: {
                max: Math.max(1, character.modifiers?.wis ?? character.modifiers?.int ?? 1),
                used: 0,
                resetType: "Short or Long Rest"
            }
        })
    },
    {
        matches: character => hasSubclassOrAction(character, "trapper"),
        findExisting: features => features.find(f => f.name.toLowerCase().includes("cunning snare") || f.name.toLowerCase().includes("hunter's ambush")),
        create: () => ({
            id: "embers:monster-hunter:guild-of-the-trapper:cunning-snare",
            name: "Guild of the Trapper: Cunning Snare",
            source: "class",
            activationType: "action",
            description: "Deploy an ingenious tactical snare or restraining tether to hamper beasts and monstrous creatures.",
            rangeText: "15 ft."
        })
    },
    // Arcana Unleashed Subclasses
    {
        matches: character => hasSubclassOrAction(character, "arcane archer"),
        findExisting: features => features.find(f => f.name.toLowerCase().includes("arcane shot")),
        create: () => ({
            id: "embers:fighter:arcane-archer:arcane-shot",
            name: "Arcane Archer: Arcane Shot",
            source: "class",
            activationType: "special",
            description: "Once per turn when you fire an arrow from a shortbow or longbow as part of the Attack action, apply an Arcane Shot option.",
            rangeText: "Self",
            limitedUse: {
                max: 2,
                used: 0,
                resetType: "Short or Long Rest"
            }
        })
    },
    {
        matches: character => hasSubclassOrAction(character, "bladesing"),
        findExisting: features => features.find(f => f.name.toLowerCase().includes("bladesong")),
        create: character => ({
            id: "embers:wizard:bladesinger:bladesong",
            name: "Bladesinger: Bladesong",
            source: "class",
            activationType: "bonus",
            description: "Bonus Action to invoke Bladesong for 1 minute (+INT to AC, +10 ft speed, Adv on Acrobatics, +INT to CON concentration saves).",
            rangeText: "Self",
            limitedUse: {
                max: character.proficiencyBonus,
                used: 0,
                resetType: "Long Rest"
            }
        })
    },
    {
        matches: character => hasSubclassOrAction(character, "mystic arts"),
        findExisting: features => features.find(f => f.name.toLowerCase().includes("mystic ki") || f.name.toLowerCase().includes("mystic arts")),
        create: () => ({
            id: "embers:monk:warrior-of-the-mystic-arts:mystic-arts",
            name: "Warrior of the Mystic Arts: Mystic Arts",
            source: "class",
            activationType: "special",
            description: "Infuse martial strikes with arcane elementals, expending Focus to discharge spells through unarmed strikes.",
            rangeText: "Self"
        })
    },
    // Grim Hollow Subclasses
    {
        matches: character => hasSubclassOrAction(character, "misfortune bringer"),
        findExisting: features => features.find(f => f.name.toLowerCase().includes("evil eye")),
        create: () => ({
            id: "embers:rogue:misfortune-bringer:evil-eye",
            name: "Misfortune Bringer: Evil Eye",
            source: "class",
            activationType: "bonus",
            description: "As a Bonus Action, place your Evil Eye curse on a creature within 60 ft for 1 minute. You can deal Sneak Attack to the cursed creature without Disadvantage.",
            rangeText: "60 ft."
        })
    },
    {
        matches: character => hasSubclassOrAction(character, "circle of blood"),
        findExisting: features => features.find(f => f.name.toLowerCase().includes("rite of the blood moon") || f.name.toLowerCase().includes("blood boon")),
        create: () => ({
            id: "embers:druid:circle-of-blood:rite-of-the-blood-moon",
            name: "Circle of Blood: Rite of the Blood Moon",
            source: "class",
            activationType: "bonus",
            description: "Bonus Action expend 1 Wild Shape to invoke the Blood Moon for 10 minutes: empower spells with blood boons and gain darkvision/resistance.",
            rangeText: "Self"
        })
    },
    {
        matches: character => hasSubclassOrAction(character, "plague doctor"),
        findExisting: features => features.find(f => f.name.toLowerCase().includes("potion craft") || f.name.toLowerCase().includes("good medicine")),
        create: () => ({
            id: "embers:wizard:plague-doctor:potion-craft",
            name: "Plague Doctor: Potion Craft",
            source: "class",
            activationType: "bonus",
            description: "Prepare medicinal and poisonous draughts (Good Medicine / Bad Medicine) during rests or in 10 minutes using herbalism or alchemist tools.",
            rangeText: "Self"
        })
    },
    {
        matches: character => hasSubclassOrAction(character, "sangromancer"),
        findExisting: features => features.find(f => f.name.toLowerCase().includes("full-blooded") || f.name.toLowerCase().includes("sangromancy")),
        create: character => {
            const wizLevel = character.classes
                .filter(c => c.name.toLowerCase().includes("wizard"))
                .reduce((total, c) => total + c.level, 0);
            return {
                id: "embers:wizard:sangromancer:full-blooded",
                name: "Sangromancer: Sangromancy Dice",
                source: "class",
                activationType: "special",
                description: "You have a pool of d12 Sangromancy Dice to fuel blood spells instead of Hit Dice. Pool size equals 1 + Wizard Level.",
                rangeText: "Self",
                limitedUse: {
                    max: 1 + wizLevel,
                    used: 0,
                    resetType: "Long Rest"
                }
            };
        }
    },

    // ── Player's Handbook (2024) Feats ─────────────────────────────────────────
    {
        matches: character => hasFeatOrAction(character, "lucky") || hasFeatOrAction(character, "luck"),
        findExisting: features => features.find(f => f.name.toLowerCase().includes("lucky") || f.name.toLowerCase().includes("luck")),
        create: character => ({
            id: "feat:lucky",
            name: "Lucky: Luck Points",
            source: "feat",
            activationType: "special",
            description: "Spend 1 Luck Point to give yourself Advantage on a d20 Test, or give an attacker Disadvantage on an attack roll against you.",
            rangeText: "Self",
            limitedUse: {
                max: character.proficiencyBonus,
                used: 0,
                resetType: "Long Rest"
            }
        })
    },
    {
        matches: character => hasFeatOrAction(character, "telekinetic"),
        findExisting: features => features.find(f => f.name.toLowerCase().includes("telekinetic")),
        create: character => ({
            id: "feat:telekinetic",
            name: "Telekinetic: Telekinetic Shove",
            source: "feat",
            activationType: "bonus",
            description: "As a Bonus Action, shove a creature within 30 ft. Target must succeed on a Strength saving throw (DC " + character.spellSaveDC + ") or be moved 5 ft toward or away from you.",
            rangeText: "30 ft."
        })
    },
    {
        matches: character => hasFeatOrAction(character, "shield master"),
        findExisting: features => features.find(f => f.name.toLowerCase().includes("shield master") || f.name.toLowerCase().includes("shield bash")),
        create: character => ({
            id: "feat:shield-master",
            name: "Shield Master: Shield Bash",
            source: "feat",
            activationType: "bonus",
            description: "As a Bonus Action after hitting with a melee weapon attack while wielding a shield, force the target to make a Strength save (DC " + (8 + character.proficiencyBonus + (character.modifiers?.str ?? 0)) + ") or be pushed 5 ft or knocked Prone.",
            rangeText: "5 ft."
        })
    },
    {
        matches: character => hasFeatOrAction(character, "healer"),
        findExisting: features => features.find(f => f.name.toLowerCase().includes("healer") || f.name.toLowerCase().includes("battle medic")),
        create: character => ({
            id: "feat:healer",
            name: "Healer: Battle Medic",
            source: "feat",
            activationType: "action",
            description: "Utilize a Healer's Kit to touch a creature within 5 ft; it expends 1 Hit Die and regains HP equal to the roll + " + character.proficiencyBonus + ". (1/Rest per creature).",
            rangeText: "Touch"
        })
    },
    {
        matches: character => hasFeatOrAction(character, "musician"),
        findExisting: features => features.find(f => f.name.toLowerCase().includes("musician")),
        create: character => ({
            id: "feat:musician",
            name: "Musician: Inspiring Song",
            source: "feat",
            activationType: "special",
            description: "Finish a Short or Long Rest to grant Heroic Inspiration to up to " + character.proficiencyBonus + " allies.",
            rangeText: "Self"
        })
    },
    {
        matches: character => hasFeatOrAction(character, "inspiring leader"),
        findExisting: features => features.find(f => f.name.toLowerCase().includes("inspiring leader")),
        create: character => ({
            id: "feat:inspiring-leader",
            name: "Inspiring Leader",
            source: "feat",
            activationType: "special",
            description: "Over 10 minutes of performance, bolster yourself and up to 5 companions within 30 ft with " + (character.level + Math.max(character.modifiers?.cha ?? 0, character.modifiers?.wis ?? 0)) + " Temporary HP. (1/Short or Long Rest).",
            rangeText: "30 ft."
        })
    },

    // ── Grim Hollow: Player's Guide Feats ──────────────────────────────────────
    {
        matches: character => hasFeatOrAction(character, "sangromantic initiate"),
        findExisting: features => features.find(f => f.name.toLowerCase().includes("sangromantic")),
        create: () => ({
            id: "feat:sangromantic-initiate",
            name: "Sangromantic Initiate: Blood Reserve",
            source: "feat",
            activationType: "special",
            description: "You have a reserve pool of two d12 Sangromancy dice to expend instead of Hit Point Dice when casting Sangromancy spells.",
            rangeText: "Self",
            limitedUse: {
                max: 2,
                used: 0,
                resetType: "Long Rest"
            }
        })
    },
    {
        matches: character => hasFeatOrAction(character, "fortune of the thaumaturge"),
        findExisting: features => features.find(f => f.name.toLowerCase().includes("fortune of the thaumaturge")),
        create: character => ({
            id: "feat:fortune-of-the-thaumaturge",
            name: "Fortune of the Thaumaturge",
            source: "feat",
            activationType: "special",
            description: "On a failed d20 Test, expend and roll 1 Hit Die to add to the result. If you roll the minimum or maximum on the die, the Hit Die is not consumed.",
            rangeText: "Self",
            limitedUse: {
                max: character.proficiencyBonus,
                used: 0,
                resetType: "Long Rest"
            }
        })
    },
    {
        matches: character => hasFeatOrAction(character, "lightning caster"),
        findExisting: features => features.find(f => f.name.toLowerCase().includes("lightning caster")),
        create: () => ({
            id: "feat:lightning-caster",
            name: "Lightning Caster: Fork Cantrip",
            source: "feat",
            activationType: "bonus",
            description: "Bonus Action after casting a single-target 1-Action cantrip to duplicate it against a second target within range. Also cast 1 reaction spell without spending a slot per Long Rest.",
            rangeText: "Self"
        })
    },
    {
        matches: character => hasFeatOrAction(character, "witch hunter"),
        findExisting: features => features.find(f => f.name.toLowerCase().includes("witch hunter")),
        create: () => ({
            id: "feat:witch-hunter",
            name: "Witch Hunter: Counter Magic",
            source: "feat",
            activationType: "reaction",
            description: "Reaction Wisdom save vs spell save DC to negate a spell targeting only you. Melee weapon hits reduce caster Speed by 15 ft.",
            rangeText: "Self"
        })
    },
    {
        matches: character => hasFeatOrAction(character, "thrown weapon master"),
        findExisting: features => features.find(f => f.name.toLowerCase().includes("thrown weapon master")),
        create: () => ({
            id: "feat:thrown-weapon-master",
            name: "Thrown Weapon Master: Rapid Volley",
            source: "feat",
            activationType: "bonus",
            description: "Bonus Action make two ranged attacks with simple Thrown weapons, or retrieve all thrown weapons within 5 ft. Thrown weapons automatically return to hand.",
            rangeText: "20/60 ft."
        })
    },

    // ── Arcana Unleashed Feats ─────────────────────────────────────────────────
    {
        matches: character => hasFeatOrAction(character, "portal jumper"),
        findExisting: features => features.find(f => f.name.toLowerCase().includes("portal jumper") || f.name.toLowerCase().includes("phase step")),
        create: character => ({
            id: "feat:portal-jumper",
            name: "Portal Jumper: Phase Step",
            source: "feat",
            activationType: "special",
            description: "Expend 15 ft of movement to teleport 15 ft to an unoccupied space you can see (once per turn).",
            rangeText: "15 ft.",
            limitedUse: {
                max: character.proficiencyBonus,
                used: 0,
                resetType: "Long Rest"
            }
        })
    },
    {
        matches: character => hasFeatOrAction(character, "arcane infiltrator"),
        findExisting: features => features.find(f => f.name.toLowerCase().includes("arcane infiltrator") || f.name.toLowerCase().includes("elusive dodge")),
        create: character => ({
            id: "feat:arcane-infiltrator",
            name: "Arcane Infiltrator: Elusive Dodge",
            source: "feat",
            activationType: "bonus",
            description: "Take the Dodge action as a Bonus Action.",
            rangeText: "Self",
            limitedUse: {
                max: character.proficiencyBonus,
                used: 0,
                resetType: "Long Rest"
            }
        })
    },
    {
        matches: character => hasFeatOrAction(character, "arcane safeguard"),
        findExisting: features => features.find(f => f.name.toLowerCase().includes("arcane safeguard")),
        create: character => ({
            id: "feat:arcane-safeguard",
            name: "Arcane Safeguard: Ward Ally",
            source: "feat",
            activationType: "bonus",
            description: "Cast Resistance cantrip as a Bonus Action. In addition, when you take the Help action to assist an ally, that ally gains " + character.proficiencyBonus + " Temporary HP.",
            rangeText: "Touch",
            limitedUse: {
                max: character.proficiencyBonus,
                used: 0,
                resetType: "Long Rest"
            }
        })
    },
    {
        matches: character => hasFeatOrAction(character, "arcane omens"),
        findExisting: features => features.find(f => f.name.toLowerCase().includes("arcane omens") || f.name.toLowerCase().includes("fateful guidance")),
        create: character => ({
            id: "feat:arcane-omens",
            name: "Arcane Omens: Fateful Guidance",
            source: "feat",
            activationType: "reaction",
            description: "Reaction when a creature within 30 ft fails a saving throw to roll 1d4 and add it to the save result.",
            rangeText: "30 ft.",
            limitedUse: {
                max: character.proficiencyBonus,
                used: 0,
                resetType: "Long Rest"
            }
        })
    },
    {
        matches: character => hasFeatOrAction(character, "iron mind"),
        findExisting: features => features.find(f => f.name.toLowerCase().includes("iron mind")),
        create: () => ({
            id: "feat:boon-of-the-iron-mind",
            name: "Boon of the Iron Mind: Unshakable Focus",
            source: "feat",
            activationType: "special",
            description: "Unshakable Focus: Taking damage cannot cause you to lose Concentration on a spell.",
            rangeText: "Self"
        })
    },

    // ── Valda's Spire of Secrets: Player Pack 2 Feats ──────────────────────────
    {
        matches: character => hasFeatOrAction(character, "spellblade"),
        findExisting: features => features.find(f => f.name.toLowerCase().includes("spellblade") || f.name.toLowerCase().includes("channeled attack")),
        create: character => ({
            id: "feat:spellblade",
            name: "Spellblade: Channeled Attack",
            source: "feat",
            activationType: "special",
            description: "Channeled Attack: When you make a weapon attack using Strength or Dexterity with a proficient weapon, gain a bonus to the attack roll equal to your Intelligence, Wisdom, or Charisma modifier (minimum +1). Arcane Strike: Replace one Attack action attack with Arc Blade, Burning Blade, Frigid Blade, or True Strike.",
            rangeText: "Self",
            limitedUse: {
                max: character.proficiencyBonus,
                used: 0,
                resetType: "Long Rest"
            }
        })
    },
    {
        matches: character => hasFeatOrAction(character, "familiar keeper"),
        findExisting: features => features.find(f => f.name.toLowerCase().includes("familiar distraction") || f.name.toLowerCase().includes("familiar keeper")),
        create: character => ({
            id: "feat:familiar-keeper",
            name: "Familiar Keeper: Familiar Distraction",
            source: "feat",
            activationType: "reaction",
            description: "Reaction when a creature within 5 ft of your familiar makes an attack roll to impose Disadvantage on the attack roll.",
            rangeText: "5 ft.",
            limitedUse: {
                max: character.proficiencyBonus,
                used: 0,
                resetType: "Long Rest"
            }
        })
    },
    {
        matches: character => hasFeatOrAction(character, "flex caster"),
        findExisting: features => features.find(f => f.name.toLowerCase().includes("flex caster")),
        create: () => ({
            id: "feat:flex-caster",
            name: "Flex Caster: Upcast & Downcast",
            source: "feat",
            activationType: "special",
            description: "Upcast: Expend an additional spell slot to increase effective spell level by 1 (max 9). Downcast: When casting with a higher-level slot, cast at base level to regain an expended 1st-level spell slot.",
            rangeText: "Self"
        })
    },
    {
        matches: character => hasFeatOrAction(character, "magitechnician"),
        findExisting: features => features.find(f => f.name.toLowerCase().includes("magitechnician") || f.name.toLowerCase().includes("magic item recharge")),
        create: () => ({
            id: "feat:magitechnician",
            name: "Magitechnician: Magic Item Recharge",
            source: "feat",
            activationType: "special",
            description: "At the end of a Short Rest, cause a magic item that regains charges or properties to recharge as if it were the next dawn (1/Long Rest). Also item save DC = 8 + Mod + PB.",
            rangeText: "Self",
            limitedUse: {
                max: 1,
                used: 0,
                resetType: "Long Rest"
            }
        })
    },
    {
        matches: character => hasFeatOrAction(character, "metabolistic magic"),
        findExisting: features => features.find(f => f.name.toLowerCase().includes("metabolistic magic") || f.name.toLowerCase().includes("vital fuel")),
        create: character => ({
            id: "feat:metabolistic-magic",
            name: "Metabolistic Magic: Vital Fuel",
            source: "feat",
            activationType: "special",
            description: "At the end of a Short Rest, expend up to " + character.proficiencyBonus + " Hit Point Dice to recover expended spell slots (combined level <= Hit Dice spent). On failed D20 Test, expend a spell slot for +(2 + slot level) bonus.",
            rangeText: "Self",
            limitedUse: {
                max: 1,
                used: 0,
                resetType: "Long Rest"
            }
        })
    },
    {
        matches: character => hasFeatOrAction(character, "pyromaniac"),
        findExisting: features => features.find(f => f.name.toLowerCase().includes("pyromaniac") || f.name.toLowerCase().includes("flare damage")),
        create: character => ({
            id: "feat:pyromaniac",
            name: "Pyromaniac: Flare Damage",
            source: "feat",
            activationType: "special",
            description: "When dealing Fire damage and rolling the maximum on a damage die, reroll that die and add it (exploding dice, max " + character.proficiencyBonus + " extra dice). Also cast Burning Hands and Scorching Ray once per Long Rest without a spell slot.",
            rangeText: "Self"
        })
    },
    {
        matches: character => hasFeatOrAction(character, "shock trooper"),
        findExisting: features => features.find(f => f.name.toLowerCase().includes("shock trooper") || f.name.toLowerCase().includes("first strike")),
        create: () => ({
            id: "feat:shock-trooper",
            name: "Shock Trooper: First Strike",
            source: "feat",
            activationType: "special",
            description: "When you roll Initiative without Disadvantage, draw a weapon and make an attack. During the first round of combat, your Speed is doubled.",
            rangeText: "Self"
        })
    },
    {
        matches: character => hasFeatOrAction(character, "showman"),
        findExisting: features => features.find(f => f.name.toLowerCase().includes("showman") || f.name.toLowerCase().includes("taunt")),
        create: character => ({
            id: "feat:showman",
            name: "Showman: Taunt",
            source: "feat",
            activationType: "bonus",
            description: "As a Bonus Action, mock a creature within 15 ft that can hear you. It has Disadvantage on the next attack roll it makes against anyone other than you before the end of its next turn.",
            rangeText: "15 ft.",
            limitedUse: {
                max: character.proficiencyBonus,
                used: 0,
                resetType: "Long Rest"
            }
        })
    }
];

export function getCharacterFeatures(character: DDBParsedCharacter): DDBFeatureAction[] {
    const features = [...(character.actions ?? [])];

    for (const fallback of featureFallbacks) {
        if (!fallback.matches(character)) continue;
        const feature = fallback.create(character);
        const existing = fallback.findExisting(features);
        if (!existing) {
            features.push(feature);
        } else if (!existing.limitedUse || existing.limitedUse.max <= 0) {
            const index = features.indexOf(existing);
            features[index] = { ...existing, limitedUse: feature.limitedUse };
        }
    }

    return features;
}
