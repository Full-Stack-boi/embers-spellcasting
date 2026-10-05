import { describe, it, expect, vi } from "vitest";
import { rollFormula, rollAttack, rollDamageBreakdown, rollCustomDicePool, doubleDiceFormula, rollDamageDDB, rollDamageExplodingAnyDie, rollDamageExploding } from "../dice";

describe("dice utility", () => {
    it("rolls exploding dice for Sorcerous Burst (e.g. 2d8 with an 8 adds +1d8)", () => {
        // Mock random: first die = 4 (0.376 -> 4), second die = 8 (0.999 -> 8), exploded die = 5 (0.501 -> 5)
        const mockRolls = [3 / 8, 7 / 8, 4 / 8];
        let rollIndex = 0;
        vi.spyOn(Math, "random").mockImplementation(() => mockRolls[rollIndex++]);

        const result = rollDamageExploding("2d8", "Thunder", 8, 3, "Sorcerous Burst");
        expect(result.total).toBe(4 + 8 + 5); // 17
        expect(result.explosionCount).toBe(1);
        expect(result.damageType).toBe("Thunder");
        expect(result.breakdown).toBe("4, 8 + 5 (Exploded)");
        expect(result.formatted).toBe("Damage: 17 Thunder (4, 8 + 5 (Exploded))");
        expect(result.message).toBe("Sorcerous Burst - Damage: 17 Thunder (4, 8 + 5 (Exploded))");

        vi.restoreAllMocks();
    });

    it("handles sequential explosions in rollDamageExploding capped by maxExplosions", () => {
        // Mock random: rolls 8, then exploded rolls 8, then exploded rolls 3
        const mockRolls = [7 / 8, 7 / 8, 2 / 8];
        let rollIndex = 0;
        vi.spyOn(Math, "random").mockImplementation(() => mockRolls[rollIndex++]);

        const result = rollDamageExploding("1d8", "Fire", 8, 2, "Sorcerous Burst");
        expect(result.total).toBe(8 + 8 + 3); // 19
        expect(result.explosionCount).toBe(2);
        expect(result.breakdown).toBe("8 + 8, 3 (Exploded)");

        vi.restoreAllMocks();
    });

    it("does not explode when no die reaches triggerValue", () => {
        const mockRolls = [2 / 8, 4 / 8];
        let rollIndex = 0;
        vi.spyOn(Math, "random").mockImplementation(() => mockRolls[rollIndex++]);

        const result = rollDamageExploding("2d8", "Thunder", 8, 3, "Sorcerous Burst");
        expect(result.total).toBe(3 + 5); // 8
        expect(result.explosionCount).toBe(0);
        expect(result.breakdown).toBe("3, 5");

        vi.restoreAllMocks();
    });

    it("explodes each damage die while enforcing one shared extra-die limit", () => {
        vi.spyOn(Math, "random").mockReturnValue(0.999);
        const result = rollDamageExplodingAnyDie("1d6+3", "Fire", 2);
        expect(result.total).toBe(21);
        expect(result.explosionCount).toBe(2);
        vi.restoreAllMocks();
    });
    it("should roll standard single dice formulas", () => {
        const res = rollFormula("1d4+4");
        expect(res.total).toBeGreaterThanOrEqual(5);
        expect(res.total).toBeLessThanOrEqual(8);
        expect(res.breakdown).toContain("+4");
        expect(res.rolls).toHaveLength(1);
    });

    it("should roll multi-dice formulas", () => {
        const res = rollFormula("2d6");
        expect(res.total).toBeGreaterThanOrEqual(2);
        expect(res.total).toBeLessThanOrEqual(12);
        expect(res.rolls).toHaveLength(2);
    });

    it("should handle compound formulas like 1d4+4 + 1d8", () => {
        const res = rollFormula("1d4+4+1d8");
        expect(res.total).toBeGreaterThanOrEqual(6); // min: 1 + 4 + 1 = 6
        expect(res.total).toBeLessThanOrEqual(16); // max: 4 + 4 + 8 = 16
        expect(res.rolls).toHaveLength(2);
    });

    it("should format attack rolls", () => {
        const attack = rollAttack(6, "Dagger, +1");
        expect(attack.total).toBeGreaterThanOrEqual(7);
        expect(attack.total).toBeLessThanOrEqual(26);
        expect(attack.message).toContain("Dagger, +1");
        expect(attack.message).toContain("+6");
    });

    it("should handle advantage and disadvantage in rollAttack", () => {
        const adv = rollAttack(5, "Fire Bolt", "advantage");
        expect(adv.total).toBeGreaterThanOrEqual(6);
        expect(adv.total).toBeLessThanOrEqual(25);
        expect(adv.message).toContain("ADV");

        const dis = rollAttack(5, "Fire Bolt", "disadvantage");
        expect(dis.total).toBeGreaterThanOrEqual(6);
        expect(dis.total).toBeLessThanOrEqual(25);
        expect(dis.message).toContain("DIS");
    });

    it("should format damage rolls with cantrip rider", () => {
        const res = rollDamageBreakdown("1d4+4", "Piercing", "Dagger, +1", {
            name: "Booming Blade",
            damage: "1d8",
            damageType: "Thunder",
            moveTrigger: "2d8 Thunder"
        });
        expect(res.total).toBeGreaterThanOrEqual(6);
        expect(res.message).toContain("Piercing");
        expect(res.message).toContain("Booming Blade");
        expect(res.message).toContain("2d8 Thunder if it moves");
    });

    it("should roll custom dice pool with modifier", () => {
        const res = rollCustomDicePool({ 6: 2, 8: 1 }, 3);
        expect(res.total).toBeGreaterThanOrEqual(2 + 1 + 3); // min: 2*1 + 1 + 3 = 6
        expect(res.total).toBeLessThanOrEqual(2 * 6 + 8 + 3); // max: 12 + 8 + 3 = 23
        expect(res.formula).toBe("2d6 + 1d8 + 3");
        expect(res.diceGroups).toHaveLength(2);
        expect(res.diceGroups[0].die).toBe(6);
        expect(res.diceGroups[0].rolls).toHaveLength(2);
        expect(res.diceGroups[1].die).toBe(8);
        expect(res.diceGroups[1].rolls).toHaveLength(1);
    });

    it("should handle advantage and disadvantage in custom dice pool", () => {
        const advRes = rollCustomDicePool({ 20: 1 }, 4, "advantage");
        expect(advRes.diceGroups[0].rolls).toHaveLength(2);
        expect(advRes.diceGroups[0].keptRoll).toBeDefined();
        expect(advRes.diceGroups[0].droppedRoll).toBeDefined();
        expect(advRes.diceGroups[0].keptRoll!).toBeGreaterThanOrEqual(advRes.diceGroups[0].droppedRoll!);
        expect(advRes.breakdown).toContain("ADV[");

        const disRes = rollCustomDicePool({ 20: 1 }, 2, "disadvantage");
        expect(disRes.diceGroups[0].rolls).toHaveLength(2);
        expect(disRes.diceGroups[0].keptRoll!).toBeLessThanOrEqual(disRes.diceGroups[0].droppedRoll!);
        expect(disRes.breakdown).toContain("DIS[");
    });

    it("should default to 1d20 when pool is empty", () => {
        const res = rollCustomDicePool({}, 2);
        expect(res.formula).toBe("1d20 + 2");
        expect(res.diceGroups).toHaveLength(1);
        expect(res.diceGroups[0].die).toBe(20);
        expect(res.total).toBeGreaterThanOrEqual(3);
        expect(res.total).toBeLessThanOrEqual(22);
    });

    it("should double dice formula correctly on critical hits", () => {
        expect(doubleDiceFormula("1d10+3")).toBe("2d10+3");
        expect(doubleDiceFormula("2d6")).toBe("4d6");
        expect(doubleDiceFormula("1d4+4+1d8")).toBe("2d4+4+2d8");
    });

    it("should format rollDamageDDB matching D&D Beyond style", () => {
        const dmg = rollDamageDDB("1d10+3", "Force", "Eldritch Blast");
        expect(dmg.total).toBeGreaterThanOrEqual(4);
        expect(dmg.total).toBeLessThanOrEqual(13);
        expect(dmg.formatted).toMatch(/^Damage:\s\d+\sForce\s\(\d+\+3\)$/);
        expect(dmg.message).toContain("Eldritch Blast - Damage:");
    });

    it("should accurately roll Hex curse necrotic damage and double dice on critical hits", () => {
        const hexNormal = rollDamageDDB("1d6", "Necrotic", "Hex");
        expect(hexNormal.total).toBeGreaterThanOrEqual(1);
        expect(hexNormal.total).toBeLessThanOrEqual(6);
        expect(hexNormal.damageType).toBe("Necrotic");
        expect(hexNormal.formatted).toContain("Necrotic");

        const hexCrit = rollDamageDDB("1d6", "Necrotic", "Hex (Crit)", true);
        expect(hexCrit.total).toBeGreaterThanOrEqual(2);
        expect(hexCrit.total).toBeLessThanOrEqual(12);
        expect(hexCrit.damageType).toBe("Necrotic");
        expect(hexCrit.formatted).toContain("Necrotic");
    });
});

