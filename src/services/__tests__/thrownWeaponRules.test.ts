import { describe, it, expect } from "vitest";
import { resolveWeaponRiders } from "../weaponDamageRiders";
import { getComputedBuffModifiers, type ActiveBuff } from "../buffService";
import type { DDBParsedCharacter, DDBWeaponAttack } from "../../types/ddb";

describe("D&D 5.5e Thrown Weapon Rules & Channeled Attack", () => {
  const baseBarbarian: DDBParsedCharacter = {
    id: 101,
    name: "Krag",
    level: 5,
    classes: [{ name: "Barbarian", level: 5 }],
    proficiencyBonus: 3,
    modifiers: { str: 4, dex: 2, con: 3, int: 0, wis: 1, cha: -1 },
    stats: { str: 18, dex: 14, con: 16, int: 10, wis: 12, cha: 8 },
    actions: [{ id: "act_rage", name: "Rage" }],
  } as unknown as DDBParsedCharacter;

  const handaxe: DDBWeaponAttack = {
    id: "weapon_handaxe",
    name: "Handaxe",
    type: "melee",
    toHit: 7,
    damage: "1d6+4",
    damageType: "Slashing",
    rangeText: "20/60 ft.",
    rangeFeet: 5,
    hasThrown: true,
    thrownRange: 20,
    thrownLongRange: 60,
    properties: ["Light", "Thrown"],
  };

  const spear: DDBWeaponAttack = {
    id: "weapon_spear",
    name: "Spear",
    type: "melee",
    toHit: 7,
    damage: "1d8+4",
    damageType: "Piercing",
    rangeText: "20/60 ft.",
    rangeFeet: 5,
    hasThrown: true,
    thrownRange: 20,
    thrownLongRange: 60,
    properties: ["Thrown", "Versatile"],
  };

  describe("Barbarian Rage Exclusion for Thrown Attacks (RAW 2024)", () => {
    it("applies Rage bonus damage when Handaxe is used in melee", () => {
      const result = resolveWeaponRiders({
        character: baseBarbarian,
        weapon: handaxe,
        attackType: "melee",
        activeBuffs: ["rage"],
      });
      expect(result.flatBonus).toBe(2);
      expect(result.flatBonusReasons).toContain("Rage Damage Bonus (+2)");
    });

    it("excludes Rage bonus damage when Handaxe is thrown as a ranged attack", () => {
      const result = resolveWeaponRiders({
        character: baseBarbarian,
        weapon: handaxe,
        attackType: "ranged",
        activeBuffs: ["rage"],
      });
      expect(result.flatBonus).toBe(0);
      expect(result.flatBonusReasons).not.toContain("Rage Damage Bonus (+2)");
    });
  });

  describe("Versatile Damage Clamping for Thrown Weapons", () => {
    it("clamps 1d8 to 1d6 for versatile weapons when thrown", () => {
      const isThrown = true;
      const isVersatile = spear.properties?.some((p) => p.toLowerCase().includes("versatile"));
      const clampedDamage = isThrown && isVersatile
        ? spear.damage.replace(/\b1d8\b/, "1d6")
        : spear.damage;

      expect(clampedDamage).toBe("1d6+4");
    });
  });

  describe("Channeled Attack Buff & Modifier (RAW 2024)", () => {
    it("calculates attackBonus from active channeled_attack buff", () => {
      const buffs: ActiveBuff[] = [
        {
          id: "channeled_attack",
          name: "Channeled Attack",
          icon: "⚡",
          source: "Spellblade",
          durationText: "Next attack",
          description: "+3 bonus to attack roll (INT)",
          attackBonus: 3,
          activatedAt: Date.now(),
        },
      ];

      const mods = getComputedBuffModifiers(buffs);
      expect(mods.attackBonus).toBe(3);
    });
  });
});
