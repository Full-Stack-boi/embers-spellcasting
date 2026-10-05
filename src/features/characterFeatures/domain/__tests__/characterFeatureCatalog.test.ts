import { describe, expect, it } from "vitest";
import { getCharacterFeatures } from "../characterFeatureCatalog";
import type { DDBParsedCharacter } from "../../../../types/ddb";

const character = (classes: DDBParsedCharacter["classes"], actions: DDBParsedCharacter["actions"] = []): DDBParsedCharacter => ({
    id: 1,
    name: "Test Sorcerer",
    avatarUrl: "",
    level: classes.reduce((sum, c) => sum + c.level, 0),
    classes,
    stats: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
    modifiers: { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 },
    proficiencyBonus: 2,
    spellCastingAbility: "CHA",
    spellSaveDC: 10,
    spellSaveDCDisplay: "10",
    spellAttackBonus: 2,
    spellAttackBonusDisplay: "+2",
    spellSlots: {},
    spells: [],
    actions,
    senses: {} as DDBParsedCharacter["senses"],
    lastSynced: ""
});

describe("getCharacterFeatures", () => {
    it("provides Font of Magic for Sorcerers when DDB omits it", () => {
        const result = getCharacterFeatures(character([{ name: "Sorcerer", level: 4 }]));
        const font = result.find(feature => feature.id === "embers:font-of-magic");

        expect(font?.limitedUse).toEqual({ max: 4, used: 0, resetType: "Long Rest" });
        expect(font?.activationType).toBe("special");
    });

    it("keeps the DDB version and fills in its missing Sorcery Point tracker", () => {
        const ddbFeature = { id: "ddb-font", name: "Font of Magic: Sorcery Points", source: "class" as const };
        const result = getCharacterFeatures(character([{ name: "Sorcerer", level: 3 }], [ddbFeature]));

        expect(result).toHaveLength(1);
        expect(result[0]).toMatchObject({ ...ddbFeature, limitedUse: { max: 3, used: 0, resetType: "Long Rest" } });
    });

    it("does not add Sorcerer features to other classes", () => {
        expect(getCharacterFeatures(character([{ name: "Wizard", level: 5 }]))).toEqual([]);
    });

    it("injects Lucky feat with Luck Points pool equal to Proficiency Bonus", () => {
        const char = {
            ...character([{ name: "Fighter", level: 5 }]),
            proficiencyBonus: 3,
            feats: [{ id: 101, name: "Lucky" }]
        };
        const result = getCharacterFeatures(char);
        const lucky = result.find(f => f.id === "feat:lucky");
        expect(lucky).toBeDefined();
        expect(lucky?.limitedUse).toEqual({ max: 3, used: 0, resetType: "Long Rest" });
    });

    it("does not duplicate Lucky when DDB already has a Luck Points action", () => {
        const char = {
            ...character([{ name: "Sorcerer", level: 20 }], [
                { id: "action_feat_luck", name: "Luck Points", source: "feat" as const, limitedUse: { max: 6, used: 0, resetType: "Long Rest" } }
            ]),
            proficiencyBonus: 6,
            feats: [{ id: 101, name: "Lucky" }]
        };
        const result = getCharacterFeatures(char);
        const luckFeatures = result.filter(f => f.name.toLowerCase().includes("luck"));
        expect(luckFeatures).toHaveLength(1);
    });

    it("injects Telekinetic Bonus Action Shove with correct Spell DC", () => {
        const char = {
            ...character([{ name: "Wizard", level: 4 }]),
            spellSaveDC: 15,
            feats: [{ id: 102, name: "Telekinetic" }]
        };
        const result = getCharacterFeatures(char);
        const tele = result.find(f => f.id === "feat:telekinetic");
        expect(tele).toBeDefined();
        expect(tele?.activationType).toBe("bonus");
        expect(tele?.description).toContain("DC 15");
        expect(tele?.rangeText).toBe("30 ft.");
    });

    it("injects Sangromantic Initiate reserve pool of 2d12 for Grim Hollow", () => {
        const char = {
            ...character([{ name: "Warlock", level: 3 }]),
            feats: [{ id: 103, name: "Sangromantic Initiate" }]
        };
        const result = getCharacterFeatures(char);
        const sangro = result.find(f => f.id === "feat:sangromantic-initiate");
        expect(sangro).toBeDefined();
        expect(sangro?.limitedUse).toEqual({ max: 2, used: 0, resetType: "Long Rest" });
    });

    it("injects Portal Jumper from Arcana Unleashed with PB phase steps", () => {
        const char = {
            ...character([{ name: "Rogue", level: 8 }]),
            proficiencyBonus: 3,
            feats: [{ id: 104, name: "Portal Jumper" }]
        };
        const result = getCharacterFeatures(char);
        const portal = result.find(f => f.id === "feat:portal-jumper");
        expect(portal).toBeDefined();
        expect(portal?.limitedUse).toEqual({ max: 3, used: 0, resetType: "Long Rest" });
        expect(portal?.rangeText).toBe("15 ft.");
    });

    it("injects Boon of the Iron Mind concentration defense", () => {
        const char = {
            ...character([{ name: "Sorcerer", level: 20 }]),
            feats: [{ id: 105, name: "Boon of the Iron Mind" }]
        };
        const result = getCharacterFeatures(char);
        const boon = result.find(f => f.id === "feat:boon-of-the-iron-mind");
        expect(boon).toBeDefined();
        expect(boon?.description).toContain("Unshakable Focus");
    });

    it("injects Spellblade Channeled Attack with PB limited uses for VSSPP2", () => {
        const char = {
            ...character([{ name: "Warlock", level: 5 }]),
            proficiencyBonus: 3,
            feats: [{ id: 106, name: "Spellblade" }]
        };
        const result = getCharacterFeatures(char);
        const spellblade = result.find(f => f.id === "feat:spellblade");
        expect(spellblade).toBeDefined();
        expect(spellblade?.name).toBe("Spellblade: Channeled Attack");
        expect(spellblade?.limitedUse).toEqual({ max: 3, used: 0, resetType: "Long Rest" });
        expect(spellblade?.description).toContain("Channeled Attack");
    });

    it("injects Familiar Keeper Reaction Distraction with PB uses for VSSPP2", () => {
        const char = {
            ...character([{ name: "Wizard", level: 4 }]),
            proficiencyBonus: 2,
            feats: [{ id: 107, name: "Familiar Keeper" }]
        };
        const result = getCharacterFeatures(char);
        const fk = result.find(f => f.id === "feat:familiar-keeper");
        expect(fk).toBeDefined();
        expect(fk?.activationType).toBe("reaction");
        expect(fk?.limitedUse).toEqual({ max: 2, used: 0, resetType: "Long Rest" });
    });

    it("injects Showman Bonus Action Taunt with PB uses for VSSPP2", () => {
        const char = {
            ...character([{ name: "Bard", level: 4 }]),
            proficiencyBonus: 2,
            feats: [{ id: 108, name: "Showman" }]
        };
        const result = getCharacterFeatures(char);
        const showman = result.find(f => f.id === "feat:showman");
        expect(showman).toBeDefined();
        expect(showman?.activationType).toBe("bonus");
        expect(showman?.limitedUse).toEqual({ max: 2, used: 0, resetType: "Long Rest" });
    });

    it("injects College of Masks features for Bard (VSSPP2)", () => {
        const char = {
            ...character([{ name: "Bard", level: 5, subclass: "College of Masks" }]),
            modifiers: { str: 0, dex: 2, con: 1, int: 0, wis: 1, cha: 4 },
        };
        const result = getCharacterFeatures(char);
        const masks = result.find(f => f.id === "embers:bard:college-of-masks:persona-masks");
        expect(masks).toBeDefined();
        expect(masks?.activationType).toBe("bonus");
        expect(masks?.limitedUse?.max).toBe(4);

        const virtuoso = result.find(f => f.id === "embers:bard:college-of-masks:virtuoso-skill");
        expect(virtuoso).toBeDefined();
        expect(virtuoso?.limitedUse?.max).toBe(4);
    });

    it("injects Dragon Domain features for Cleric (VSSPP2)", () => {
        const char = {
            ...character([{ name: "Cleric", level: 6, subclass: "Dragon Domain" }]),
            modifiers: { str: 1, dex: 0, con: 2, int: 0, wis: 4, cha: 0 },
        };
        const result = getCharacterFeatures(char);
        const chromatic = result.find(f => f.id === "embers:cleric:dragon-domain:chromatic-affinity");
        expect(chromatic).toBeDefined();
        expect(chromatic?.description).toContain("+6");
        expect(chromatic?.limitedUse?.max).toBe(4);

        const majesty = result.find(f => f.id === "embers:cleric:dragon-domain:draconic-majesty");
        expect(majesty).toBeDefined();
        expect(majesty?.activationType).toBe("action");
    });

    it("injects Circle of the City features for Druid (VSSPP2)", () => {
        const char = character([{ name: "Druid", level: 4, subclass: "Circle of the City" }]);
        const result = getCharacterFeatures(char);
        const cityShape = result.find(f => f.id === "embers:druid:circle-of-the-city:city-shape");
        expect(cityShape).toBeDefined();
        expect(cityShape?.activationType).toBe("action");

        const wallWarp = result.find(f => f.id === "embers:druid:circle-of-the-city:wall-warp");
        expect(wallWarp).toBeDefined();
        expect(wallWarp?.activationType).toBe("reaction");
    });

    it("injects Beastborne features for Ranger (VSSPP2)", () => {
        const char = character([{ name: "Ranger", level: 5, subclass: "Beastborne" }]);
        const result = getCharacterFeatures(char);
        const aspect = result.find(f => f.id === "embers:ranger:beastborne:bestial-aspect");
        expect(aspect).toBeDefined();
        expect(aspect?.activationType).toBe("bonus");
    });

    it("injects Heroic Sorcery features for Sorcerer (VSSPP2)", () => {
        const char = character([{ name: "Sorcerer", level: 6, subclass: "Heroic Sorcery" }]);
        const result = getCharacterFeatures(char);
        const soul = result.find(f => f.id === "embers:sorcerer:heroic-sorcery:heroic-soul");
        expect(soul).toBeDefined();
        expect(soul?.description).toContain("1d6 + 6");

        const maneuvers = result.find(f => f.id === "embers:sorcerer:heroic-sorcery:mystical-maneuvers");
        expect(maneuvers).toBeDefined();
        expect(maneuvers?.activationType).toBe("bonus");
    });

    it("injects Magic Missile Mage features for Wizard (VSSPP2)", () => {
        const char = {
            ...character([{ name: "Wizard", level: 7, subclass: "Magic Missile Mage" }]),
            modifiers: { str: 0, dex: 2, con: 2, int: 4, wis: 1, cha: 0 },
        };
        const result = getCharacterFeatures(char);
        const savant = result.find(f => f.id === "embers:wizard:magic-missile-mage:magic-missile-savant");
        expect(savant).toBeDefined();
        expect(savant?.limitedUse?.max).toBe(4);

        const shield = result.find(f => f.id === "embers:wizard:magic-missile-mage:shield-of-missiles");
        expect(shield).toBeDefined();

        const giga = result.find(f => f.id === "embers:wizard:magic-missile-mage:giga-missile");
        expect(giga).toBeDefined();
        expect(giga?.description).toContain("+4");
    });

    it("injects Pistolero features for Gunslinger (VSSPP2)", () => {
        const char = character([{ name: "Gunslinger", level: 5, subclass: "Pistolero" }]);
        const result = getCharacterFeatures(char);
        const fan = result.find(f => f.id === "embers:gunslinger:pistolero:fan-the-hammer");
        expect(fan).toBeDefined();
        expect(fan?.activationType).toBe("bonus");

        const showdown = result.find(f => f.id === "embers:gunslinger:pistolero:showdown");
        expect(showdown).toBeDefined();
    });

    it("injects Deeds & Risk Dice for Gunslinger base class", () => {
        const char = character([{ name: "Gunslinger", level: 5 }]);
        const result = getCharacterFeatures(char);
        const deeds = result.find(f => f.id === "embers:gunslinger:deeds");
        expect(deeds).toBeDefined();
        expect(deeds?.limitedUse?.max).toBe(3);
    });

    it("injects Focus for Monster Hunter base class", () => {
        const char = {
            ...character([{ name: "Monster Hunter", level: 3 }]),
            modifiers: { str: 2, dex: 3, con: 2, int: 3, wis: 1, cha: 0 }
        };
        const result = getCharacterFeatures(char);
        const focus = result.find(f => f.id === "embers:monster-hunter:focus");
        expect(focus).toBeDefined();
        expect(focus?.activationType).toBe("bonus");
        expect(focus?.limitedUse?.max).toBe(6); // 3 level + 3 int
    });

    it("injects Infuse Item and Flash of Genius for Artificer", () => {
        const char = {
            ...character([{ name: "Artificer", level: 7 }]),
            modifiers: { str: 0, dex: 2, con: 2, int: 4, wis: 1, cha: 0 }
        };
        const result = getCharacterFeatures(char);
        const infuse = result.find(f => f.id === "embers:artificer:infuse-item");
        expect(infuse).toBeDefined();
        expect(infuse?.limitedUse?.max).toBe(3);

        const flash = result.find(f => f.id === "embers:artificer:flash-of-genius");
        expect(flash).toBeDefined();
        expect(flash?.limitedUse?.max).toBe(4);
    });

    it("injects Alchemist and Bladesinger features", () => {
        const alchChar = {
            ...character([{ name: "Artificer", level: 3, subclass: "Alchemist" }]),
            modifiers: { str: 0, dex: 2, con: 2, int: 3, wis: 1, cha: 0 }
        };
        const alchResult = getCharacterFeatures(alchChar);
        const elixir = alchResult.find(f => f.id === "embers:artificer:alchemist:experimental-elixir");
        expect(elixir).toBeDefined();
        expect(elixir?.limitedUse?.max).toBe(3);

        const bladeChar = {
            ...character([{ name: "Wizard", level: 4, subclass: "Bladesinging" }]),
            proficiencyBonus: 2
        };
        const bladeResult = getCharacterFeatures(bladeChar);
        const bladesong = bladeResult.find(f => f.id === "embers:wizard:bladesinger:bladesong");
        expect(bladesong).toBeDefined();
        expect(bladesong?.limitedUse?.max).toBe(2);
    });
});

