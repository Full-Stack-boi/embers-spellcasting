import { describe, it, expect } from "vitest";

// Mock window and localStorage before importing modules that depend on OBR SDK
const store: Record<string, string> = {};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).localStorage = {
  getItem: (k: string) => store[k] ?? null,
  setItem: (k: string, v: string) => { store[k] = v; },
  removeItem: (k: string) => { delete store[k]; },
  clear: () => { Object.keys(store).forEach((k) => delete store[k]); },
  key: (i: number) => Object.keys(store)[i] ?? null,
  length: 0,
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).window = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  localStorage: (globalThis as any).localStorage,
  location: { search: "", origin: "http://localhost" },
  addEventListener: () => {},
  removeEventListener: () => {},
};

const {
  resolveSpellcastingModifier,
  rollSpellDamageWithMechanics,
} = await import("../../../../effectsTool");
import {
  resolveSpellFormula,
  resolveFormulaFullDamage,
} from "../../../../services/spellFormulaBuilder";
import {
  getAffectedGridCells,
  isTokenInAffectedCells,
  AoETemplate,
  GridInfo,
} from "../targetingGeometry";
import type { DDBParsedCharacter, DDBParsedSpell } from "../../../../types/ddb";

describe("AoE Ground Spell Casting & Resolution", () => {
  const dummyGrid: GridInfo = {
    dpi: 150,
    scaleMultiplier: 5,
  };

  describe("resolveSpellcastingModifier", () => {
    it("resolves modifier from classSpellStats matching spell castingClass", () => {
      const char = {
        name: "Luca Arbanshi",
        level: 6,
        proficiencyBonus: 3,
        spellAttackBonus: 7,
        spellSaveDC: 15,
        spellCastingAbility: "CHA",
        modifiers: { cha: 4, int: 1, wis: 2, str: 0, dex: 2, con: 2 },
        classSpellStats: [
          { className: "Bard", modifier: 4, spellAttackBonus: 7 },
        ],
      } as unknown as DDBParsedCharacter;
      const ddbSpell = {
        id: "moonbeam",
        name: "Moonbeam",
        level: 2,
        school: "Evocation",
        castingTime: "1 action",
        range: 120,
        rangeText: "120 ft.",
        duration: "Concentration, up to 1 minute",
        components: "V, S, M",
        concentration: true,
        ritual: false,
        castingClass: "Bard",
      } as unknown as DDBParsedSpell;
      const formula = resolveSpellFormula({
        id: "moonbeam",
        name: "Moonbeam",
        level: 2,
        school: "Evocation",
        damage: "2d10",
        damageType: "Radiant",
      });

      const mod = resolveSpellcastingModifier(char, formula, ddbSpell, 7);
      expect(mod).toBe(4);
    });

    it("falls back to ability modifier or spellAttackBonus when classSpellStats not present", () => {
      const char = {
        name: "Caster",
        level: 5,
        proficiencyBonus: 3,
        spellAttackBonus: 7,
        spellCastingAbility: "INT",
        modifiers: { int: 4, str: 0, dex: 0, con: 0, wis: 0, cha: 0 },
      } as unknown as DDBParsedCharacter;
      const formula = resolveSpellFormula({
        id: "fireball",
        name: "Fireball",
        level: 3,
        school: "Evocation",
        damage: "8d6",
        damageType: "Fire",
      });

      const mod = resolveSpellcastingModifier(char, formula, undefined, 7);
      expect(mod).toBe(4);
    });
  });

  describe("rollSpellDamageWithMechanics", () => {
    it("rolls standard spell damage without exploding mechanics", () => {
      const formula = resolveSpellFormula({
        id: "moonbeam",
        name: "Moonbeam",
        level: 2,
        school: "Evocation",
        damage: "2d10",
        damageType: "Radiant",
      });
      const result = rollSpellDamageWithMechanics(formula, "2d10", "Radiant", 4, false);
      expect(result.total).toBeGreaterThanOrEqual(2);
      expect(result.total).toBeLessThanOrEqual(20);
      expect(result.damageType).toBe("Radiant");
    });
  });

  describe("AoE token hit detection on grid", () => {
    it("detects tokens inside Moonbeam 5ft radius Sphere", () => {
      const origin = { x: 300, y: 300 };
      const cursor = { x: 300, y: 300 };
      const template: AoETemplate = {
        shape: "Sphere",
        origin,
        cursor,
        sizeFeet: 5,
      };

      const cells = getAffectedGridCells(template, dummyGrid);
      expect(cells.length).toBeGreaterThan(0);

      // Token right at center of the 5ft sphere
      expect(isTokenInAffectedCells({ x: 300, y: 300 }, cells)).toBe(true);

      // Token 2000 pixels away (far outside 5ft sphere)
      expect(isTokenInAffectedCells({ x: 2000, y: 2000 }, cells)).toBe(false);
    });
  });

  describe("resolveFormulaFullDamage for AoE upcasting", () => {
    it("calculates Moonbeam base damage at Level 2 and upcast at Level 3", () => {
      const formula = resolveSpellFormula({
        id: "moonbeam",
        name: "Moonbeam",
        level: 2,
        school: "Evocation",
        damage: "2d10",
        damageType: "Radiant",
      });

      const level2Dmg = resolveFormulaFullDamage(formula, 6, 2, { spellcastingModifier: 4 });
      expect(level2Dmg).toBe("2d10");

      const level3Dmg = resolveFormulaFullDamage(formula, 6, 3, { spellcastingModifier: 4 });
      expect(level3Dmg).toBe("3d10");

      const level4Dmg = resolveFormulaFullDamage(formula, 6, 4, { spellcastingModifier: 4 });
      expect(level4Dmg).toBe("4d10");
    });

    it("identifies Moonbeam saving throw as CON Save", () => {
      const formula = resolveSpellFormula({
        id: "moonbeam",
        name: "Moonbeam",
        level: 2,
        school: "Evocation",
      });

      expect(formula.interaction?.type).toBe("save");
      expect(formula.interaction?.saveAbility).toBe("CON");
    });
  });
});
