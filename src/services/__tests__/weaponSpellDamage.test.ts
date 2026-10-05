import { describe, expect, it } from "vitest";
import { buildWeaponStepDamage, increaseWeaponDamageDie } from "../weaponSpellDamage";

describe("Frigid Blade weapon damage", () => {
    it.each([
        ["1d4", "1d6"],
        ["1d6", "1d8"],
        ["1d8", "1d10"],
        ["1d10", "1d12"],
        ["2d6", "2d6"],
    ])("steps %s to %s", (source, expected) => {
        expect(increaseWeaponDamageDie(source)).toBe(expected);
    });

    it("replaces the weapon ability modifier with spellcasting modifier and preserves magic bonus", () => {
        expect(buildWeaponStepDamage({ damage: "1d6+5", baseDamageDice: "1d6", magicDamageBonus: 1 }, 3, "1d6"))
            .toEqual({ weaponDice: "1d8", weaponFormula: "1d8+4", extraDice: "1d6" });
    });

    it("omits cold damage before the cantrip scaling breakpoint", () => {
        expect(buildWeaponStepDamage({ damage: "1d8+2", baseDamageDice: "1d8" }, 2, "0d6"))
            .toEqual({ weaponDice: "1d10", weaponFormula: "1d10+2", extraDice: undefined });
    });

    it("uses the normal weapon die for blade cantrips without a die-step mechanic", () => {
        expect(buildWeaponStepDamage({ damage: "1d6+5", baseDamageDice: "1d6" }, 3, "2d6", 0))
            .toEqual({ weaponDice: "1d6", weaponFormula: "1d6+3", extraDice: "2d6" });
    });
});
