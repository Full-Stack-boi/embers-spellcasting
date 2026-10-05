import { describe, it, expect } from "vitest";
import {
    extractResetType,
    extractDamageDice,
    extractCantripScaling,
    extractMaxUses,
    extractActivationType,
    extractBuffEffects,
    isDescriptionActivatableBuff
} from "../descriptionParser";

describe("descriptionParser", () => {
    describe("extractResetType", () => {
        it("detects Long Rest from standard phrasing", () => {
            expect(extractResetType("You regain all expended uses when you finish a Long Rest.")).toBe("Long Rest");
            expect(extractResetType("regain expended luck points when you finish a Long Rest.")).toBe("Long Rest");
        });

        it("detects Short Rest", () => {
            expect(extractResetType("You regain all uses when you finish a Short or Long Rest.")).toBe("Short Rest");
            expect(extractResetType("You regain this use when you finish a Short Rest.")).toBe("Short Rest");
        });

        it("detects Dawn", () => {
            expect(extractResetType("The wand regains 1d6 + 1 expended charges daily at dawn.")).toBe("Dawn");
            expect(extractResetType("You regain this ability each dawn.")).toBe("Dawn");
        });

        it("detects Daily", () => {
            expect(extractResetType("You can cast this spell daily.")).toBe("Daily");
        });

        it("returns null for text with no reset conditions", () => {
            expect(extractResetType("A simple magical trinket.")).toBeNull();
        });
    });

    describe("extractDamageDice", () => {
        it("extracts single damage dice and type", () => {
            const result = extractDamageDice("The blast deals 1d10 force damage to the target.");
            expect(result).toHaveLength(1);
            expect(result[0]).toEqual({ dice: "1d10", type: "Force", condition: undefined });
        });

        it("extracts multi-dice with conditional riders (Booming Blade style)", () => {
            const desc = "The weapon deals an extra 1d8 thunder damage to the target. If the target moves 5 feet or more before then, it takes 1d8 thunder damage.";
            const result = extractDamageDice(desc);
            expect(result.length).toBeGreaterThanOrEqual(2);
            expect(result[0].dice).toBe("1d8");
            expect(result[0].type).toBe("Thunder");
            expect(result[1].condition).toBe("if moves");
        });

        it("handles dice with flat bonuses like 1d6+3", () => {
            const result = extractDamageDice("deals 1d6+3 fire damage on hit");
            expect(result).toHaveLength(1);
            expect(result[0].dice).toBe("1d6+3");
            expect(result[0].type).toBe("Fire");
        });
    });

    describe("extractCantripScaling", () => {
        const boomingBladeDesc = "The weapon deals an extra 1d8 thunder damage. This spell's damage increases when you reach higher levels. At 5th level, the melee attack deals an extra 1d8 thunder damage (2d8), at 11th level (3d8), and at 17th level (4d8).";

        it("returns base damage for level 1-4", () => {
            expect(extractCantripScaling(boomingBladeDesc, 1)).toBe("1d8");
            expect(extractCantripScaling(boomingBladeDesc, 4)).toBe("1d8");
        });

        it("scales to 2d8 at level 5-10", () => {
            expect(extractCantripScaling(boomingBladeDesc, 5)).toBe("2d8");
            expect(extractCantripScaling(boomingBladeDesc, 9)).toBe("2d8");
        });

        it("scales to 3d8 at level 11-16", () => {
            expect(extractCantripScaling(boomingBladeDesc, 11)).toBe("3d8");
            expect(extractCantripScaling(boomingBladeDesc, 16)).toBe("3d8");
        });

        it("scales to 4d8 at level 17+", () => {
            expect(extractCantripScaling(boomingBladeDesc, 17)).toBe("4d8");
            expect(extractCantripScaling(boomingBladeDesc, 20)).toBe("4d8");
        });

        it("handles alternative 'increases to 2d8 at 5th level' phrasing", () => {
            const altDesc = "The damage increases to 2d8 at 5th level, 3d8 at 11th level, and 4d8 at 17th level.";
            expect(extractCantripScaling(altDesc, 5)).toBe("2d8");
            expect(extractCantripScaling(altDesc, 11)).toBe("3d8");
            expect(extractCantripScaling(altDesc, 17)).toBe("4d8");
        });
    });

    describe("extractMaxUses", () => {
        it("extracts numeric luck points or charges", () => {
            expect(extractMaxUses("You have 3 luck points. Whenever you make an attack roll...")).toBe(3);
            expect(extractMaxUses("The staff has 10 charges.")).toBe(10);
        });

        it("extracts word-based limits", () => {
            expect(extractMaxUses("You can use this feature twice per Long Rest.")).toBe(2);
            expect(extractMaxUses("You can use this trait once per Short Rest.")).toBe(1);
        });
    });

    describe("extractActivationType", () => {
        it("detects bonus action", () => {
            expect(extractActivationType("As a Bonus Action, you can unleash your inner power.")).toBe("bonus");
        });

        it("detects reaction", () => {
            expect(extractActivationType("As a Reaction when hit by an attack...")).toBe("reaction");
        });

        it("detects action", () => {
            expect(extractActivationType("As an Action on your turn, you cast...")).toBe("action");
        });
    });

    describe("extractBuffEffects", () => {
        it("extracts Innate Sorcery effects (+1 DC, spell attack advantage)", () => {
            const desc = "A bonus action to activate for 1 minute: +1 to Sorcerer spell save DC, and you have advantage on Sorcerer spell attack rolls.";
            const effects = extractBuffEffects(desc);
            expect(effects.spellSaveDcBonus).toBe(1);
            expect(effects.spellAttackAdvantage).toBe(true);
        });

        it("extracts Rage effects (+2 melee damage, STR advantage, physical resistance)", () => {
            const desc = "In battle, you enter a rage as a bonus action. While active: advantage on Strength checks and Strength saving throws, +2 bonus to the melee damage roll, and resistance to bludgeoning, piercing, and slashing damage.";
            const effects = extractBuffEffects(desc);
            expect(effects.damageBonusFlat).toBe(2);
            expect(effects.advantage).toContain("STR Checks");
            expect(effects.advantage).toContain("STR Saves");
            expect(effects.resistances).toContain("Bludgeoning");
        });
    });

    describe("isDescriptionActivatableBuff", () => {
        it("identifies stance/buff with duration and bonus action", () => {
            expect(isDescriptionActivatableBuff("As a bonus action, you enter a rage for 1 minute.")).toBe(true);
            expect(isDescriptionActivatableBuff("You can activate innate sorcery as a bonus action for 1 minute.")).toBe(true);
        });

        it("rejects instantaneous non-buff descriptions", () => {
            expect(isDescriptionActivatableBuff("A bright streak flashes from your pointing finger to a point you choose.")).toBe(false);
            expect(isDescriptionActivatableBuff("You strike a target with your weapon.")).toBe(false);
        });
    });
});
