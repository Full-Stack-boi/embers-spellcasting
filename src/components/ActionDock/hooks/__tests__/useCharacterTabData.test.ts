import { describe, it, expect, vi } from "vitest";

vi.mock("react", () => ({
    useMemo: (fn: () => unknown) => fn(),
}));

import { useCharacterTabData } from "../useCharacterTabData";
import type { DockSpell } from "../../domain/types";

describe("useCharacterTabData", () => {
    const dummySpells: DockSpell[] = [
        {
            id: "fire_bolt",
            name: "Fire Bolt",
            level: 0,
            school: "Evocation",
            castingTime: "1 Action",
            rangeText: "120 ft.",
            isPrepared: true,
            fromChar: true,
        },
        {
            id: "magic_missile",
            name: "Magic Missile",
            level: 1,
            school: "Evocation",
            castingTime: "1 Action",
            rangeText: "120 ft.",
            isPrepared: true,
            fromChar: true,
        },
        {
            id: "misty_step",
            name: "Misty Step",
            level: 2,
            school: "Conjuration",
            castingTime: "1 Bonus Action",
            rangeText: "Self",
            isPrepared: true,
            fromChar: true,
        },
        {
            id: "hunger_of_hadar",
            name: "Hunger of Hadar",
            level: 3,
            school: "Conjuration",
            castingTime: "1 Action",
            rangeText: "150 ft.",
            isPrepared: true,
            fromChar: true,
        },
    ];

    it("returns no spells under PACT filter when pactMagicLevel is undefined (non-Warlock)", () => {
        const result = useCharacterTabData({
            spells: dummySpells,
            spellsFilter: "PACT",
            spellSearch: "",
            pactMagicLevel: undefined,
            features: [],
            featuresFilter: "ALL",
            inventory: [],
            inventoryFilter: "ALL",
            inventorySearch: "",
            strength: 10,
        });

        // Previously, undefined pactMagicLevel fell back to level 2, mistakenly returning level-2 spells (like Misty Step)
        expect(result.spellGroups).toEqual([]);
    });

    it("returns only matching pact-level spells when pactMagicLevel is specified", () => {
        const result = useCharacterTabData({
            spells: dummySpells,
            spellsFilter: "PACT",
            spellSearch: "",
            pactMagicLevel: 3,
            features: [],
            featuresFilter: "ALL",
            inventory: [],
            inventoryFilter: "ALL",
            inventorySearch: "",
            strength: 10,
        });

        expect(result.spellGroups).toHaveLength(1);
        expect(result.spellGroups[0].level).toBe(3);
        expect(result.spellGroups[0].spells.map(s => s.name)).toEqual(["Hunger of Hadar"]);
    });

    it("returns all spells under ALL filter regardless of pactMagicLevel", () => {
        const result = useCharacterTabData({
            spells: dummySpells,
            spellsFilter: "ALL",
            spellSearch: "",
            pactMagicLevel: undefined,
            features: [],
            featuresFilter: "ALL",
            inventory: [],
            inventoryFilter: "ALL",
            inventorySearch: "",
            strength: 10,
        });

        const totalSpells = result.spellGroups.reduce((acc, g) => acc + g.spells.length, 0);
        expect(totalSpells).toBe(4);
    });
});
