import { describe, it, expect } from "vitest";
import { registerDynamicSpell, getSpellMetadata, SpellMetadata } from "../spellInfo";

describe("spellInfo Character-Scoped Registry", () => {
    it("isolates spells of different characters having the same spell ID", () => {
        const clericSpell: SpellMetadata = {
            id: "custom_bless",
            name: "Bless (Cleric)",
            level: 1,
            school: "Enchantment",
            castingTime: "1 Action",
            range: "30 ft",
            duration: "1 minute",
            components: "V, S, M",
            damage: "1d4 Buff",
            saveOrAttack: "None",
            description: "Blesses allies.",
            concentration: true,
            ritual: false
        };

        const paladinSpell: SpellMetadata = {
            id: "custom_bless",
            name: "Bless (Paladin)",
            level: 1,
            school: "Enchantment",
            castingTime: "1 Action",
            range: "30 ft",
            duration: "1 minute",
            components: "V, S, M",
            damage: "1d4 Radiant Buff",
            saveOrAttack: "None",
            description: "Blesses allies with radiant vigor.",
            concentration: true,
            ritual: false
        };

        // Register for character 101 (Cleric) and character 202 (Paladin)
        registerDynamicSpell(clericSpell, 101);
        registerDynamicSpell(paladinSpell, 202);

        // Fetching with owner ID 101 returns Cleric version
        const resultCleric = getSpellMetadata("custom_bless", undefined, 101);
        expect(resultCleric.name).toBe("Bless (Cleric)");
        expect(resultCleric.damage).toBe("1d4 Buff");

        // Fetching with owner ID 202 returns Paladin version
        const resultPaladin = getSpellMetadata("custom_bless", undefined, 202);
        expect(resultPaladin.name).toBe("Bless (Paladin)");
        expect(resultPaladin.damage).toBe("1d4 Radiant Buff");

        // Overload flexibility: passing owner ID as 2nd argument
        const resultOverload = getSpellMetadata("custom_bless", 101);
        expect(resultOverload.name).toBe("Bless (Cleric)");
    });
});
