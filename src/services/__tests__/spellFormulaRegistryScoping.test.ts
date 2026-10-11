import { describe, it, expect } from "vitest";
import { buildRegistry, setActiveRegistry, getRegistry, getActiveRegistry } from "../spellFormulaRegistry";
import type { DDBParsedSpell } from "../../types/ddb";

describe("SpellFormulaRegistry Scoping", () => {
    it("maintains separate registries for distinct characters", () => {
        const wizardSpells = [
            {
                id: "custom_strike",
                name: "Custom Strike (Wizard)",
                level: 0,
                school: "Evocation",
                castingTime: "1A",
                range: 120,
                damage: "1d10 Fire",
                damageType: "fire",
                components: "V, S",
                isPrepared: true
            }
        ] as unknown as DDBParsedSpell[];

        const sorcererSpells = [
            {
                id: "custom_strike",
                name: "Custom Strike (Sorcerer)",
                level: 0,
                school: "Evocation",
                castingTime: "1BA",
                range: 120,
                damage: "2d10 Fire",
                damageType: "fire",
                components: "V, S",
                isPrepared: true
            }
        ] as unknown as DDBParsedSpell[];

        const wizardReg = buildRegistry(wizardSpells);
        const sorcererReg = buildRegistry(sorcererSpells);

        setActiveRegistry(wizardReg, "char-wizard-1");
        setActiveRegistry(sorcererReg, "char-sorcerer-2");

        // Character 1 lookup returns wizard formula
        const reg1 = getRegistry("char-wizard-1");
        expect(reg1?.get("custom_strike")?.name).toBe("Custom Strike (Wizard)");

        // Character 2 lookup returns sorcerer formula
        const reg2 = getRegistry("char-sorcerer-2");
        expect(reg2?.get("custom_strike")?.name).toBe("Custom Strike (Sorcerer)");

        // Fallback returns the most recently activated registry
        expect(getActiveRegistry()?.get("custom_strike")?.name).toBe("Custom Strike (Sorcerer)");
    });
});
