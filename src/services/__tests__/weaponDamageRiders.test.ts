import { describe, it, expect } from "vitest";
import { resolveWeaponRiders } from "../weaponDamageRiders";
import type { DDBParsedCharacter, DDBWeaponAttack } from "../../types/ddb";

function createMockCharacter(overrides: Partial<DDBParsedCharacter> = {}): DDBParsedCharacter {
  return {
    id: 1,
    name: "Test Warrior",
    avatarUrl: "",
    level: 5,
    classes: [{ name: "Barbarian", level: 5, subclass: "Path of the Zealot" }],
    proficiencyBonus: 3,
    stats: { str: 18, dex: 14, con: 16, int: 10, wis: 12, cha: 8 },
    modifiers: { str: 4, dex: 2, con: 3, int: 0, wis: 1, cha: -1 },
    spellCastingAbility: "NONE",
    spellSaveDC: 10,
    spellSaveDCDisplay: "10",
    spellAttackBonus: 0,
    spellAttackBonusDisplay: "+0",
    spellSlots: {},
    spells: [],
    actions: [{ id: "feat-divine-fury", name: "Divine Fury", source: "class" }],
    senses: {} as DDBParsedCharacter["senses"],
    lastSynced: "",
    ...overrides,
  };
}

const mockWeapon: DDBWeaponAttack = {
  id: "w-handaxe",
  name: "Handaxe",
  type: "melee",
  rangeText: "20/60 ft",
  rangeFeet: 5,
  toHit: 7,
  damage: "1d6+4",
  damageType: "Slashing",
  isProficient: true,
  properties: ["Light", "Thrown"],
};

describe("weaponDamageRiders resolver", () => {
  it("resolves Rage flat bonus when Rage buff is active", () => {
    const char = createMockCharacter({
      classes: [{ name: "Barbarian", level: 5, subclass: "Berserker" }],
    });

    // Without Rage
    const unraged = resolveWeaponRiders({
      character: char,
      weapon: mockWeapon,
      activeBuffs: [],
    });
    expect(unraged.flatBonus).toBe(0);

    // With Rage
    const raged = resolveWeaponRiders({
      character: char,
      weapon: mockWeapon,
      activeBuffs: ["rage"],
    });
    expect(raged.flatBonus).toBe(2);
    expect(raged.flatBonusReasons).toEqual(["Rage Damage Bonus (+2)"]);
  });

  it("scales Rage flat bonus with Barbarian level", () => {
    const lv10Char = createMockCharacter({
      classes: [{ name: "Barbarian", level: 10 }],
    });
    const raged10 = resolveWeaponRiders({
      character: lv10Char,
      weapon: mockWeapon,
      activeBuffs: ["rage"],
    });
    expect(raged10.flatBonus).toBe(3);

    const lv17Char = createMockCharacter({
      classes: [{ name: "Barbarian", level: 17 }],
    });
    const raged17 = resolveWeaponRiders({
      character: lv17Char,
      weapon: mockWeapon,
      activeBuffs: ["rage"],
    });
    expect(raged17.flatBonus).toBe(4);
  });

  it("resolves Divine Fury when Raging, and respects Option A (first_hit_per_turn)", () => {
    const char = createMockCharacter({
      classes: [{ name: "Barbarian", level: 5, subclass: "Path of the Zealot" }],
    });

    // Strike 1: Raging, no used riders yet
    const strike1 = resolveWeaponRiders({
      character: char,
      weapon: mockWeapon,
      activeBuffs: ["rage"],
      riderChoice: "Radiant",
      usedRidersThisTurn: new Set(),
    });

    expect(strike1.flatBonus).toBe(2);
    expect(strike1.activeDiceRiders).toHaveLength(1);
    expect(strike1.activeDiceRiders[0]).toEqual({
      id: "divine-fury",
      name: "Divine Fury",
      dice: "1d6",
      bonus: 2, // Math.floor(5 / 2) = 2
      damageType: "Radiant",
      frequency: "first_hit_per_turn",
    });
    expect(strike1.availableRiderChoice?.choices).toEqual(["Radiant", "Necrotic"]);

    // Strike 2 (Extra Attack): Divine Fury already triggered this turn
    const strike2 = resolveWeaponRiders({
      character: char,
      weapon: mockWeapon,
      activeBuffs: ["rage"],
      riderChoice: "Radiant",
      usedRidersThisTurn: new Set(["divine-fury"]),
    });

    // Still gets Rage flat bonus, but Divine Fury is omitted!
    expect(strike2.flatBonus).toBe(2);
    expect(strike2.activeDiceRiders).toHaveLength(0);
  });

  it("resolves Necrotic choice for Divine Fury", () => {
    const char = createMockCharacter({
      classes: [{ name: "Barbarian", level: 6, subclass: "Path of the Zealot" }],
    });

    const res = resolveWeaponRiders({
      character: char,
      weapon: mockWeapon,
      activeBuffs: ["rage"],
      riderChoice: "Necrotic",
    });

    expect(res.activeDiceRiders[0].damageType).toBe("Necrotic");
    expect(res.activeDiceRiders[0].bonus).toBe(3); // Math.floor(6 / 2) = 3
  });

  it("resolves Rogue Sneak Attack only for Finesse or Ranged weapons", () => {
    const rogueChar = createMockCharacter({
      classes: [{ name: "Rogue", level: 5 }],
    });

    const greatsword: DDBWeaponAttack = {
      ...mockWeapon,
      name: "Greatsword",
      properties: ["Heavy", "Two-Handed"],
    };

    const rapier: DDBWeaponAttack = {
      ...mockWeapon,
      name: "Rapier",
      properties: ["Finesse"],
    };

    // Greatsword: does not qualify
    const gsResult = resolveWeaponRiders({
      character: rogueChar,
      weapon: greatsword,
    });
    expect(gsResult.activeDiceRiders).toHaveLength(0);

    // Rapier: qualifies for 3d6 Sneak Attack (Lv 5)
    const rapierResult = resolveWeaponRiders({
      character: rogueChar,
      weapon: rapier,
    });
    expect(rapierResult.activeDiceRiders).toHaveLength(1);
    expect(rapierResult.activeDiceRiders[0].dice).toBe("3d6");
  });

  it("resolves Paladin Radiant Strikes at level 11+", () => {
    const paladin10 = createMockCharacter({
      classes: [{ name: "Paladin", level: 10 }],
    });
    const paladin11 = createMockCharacter({
      classes: [{ name: "Paladin", level: 11 }],
    });

    expect(resolveWeaponRiders({ character: paladin10, weapon: mockWeapon }).activeDiceRiders).toHaveLength(0);

    const res11 = resolveWeaponRiders({ character: paladin11, weapon: mockWeapon });
    expect(res11.activeDiceRiders).toHaveLength(1);
    expect(res11.activeDiceRiders[0].damageType).toBe("Radiant");
    expect(res11.activeDiceRiders[0].dice).toBe("1d6");
  });
});
