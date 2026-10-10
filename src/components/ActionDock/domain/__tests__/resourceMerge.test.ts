import { describe, it, expect } from "vitest";
import {
    mergeSpellSlots,
    mergePactSlots,
    mergeFeatureUses,
    mergeHitDice,
    extractDdbBaseline,
    isCharacterCaster,
} from "../resourceMerge";
import type { DDBParsedCharacter } from "../../../../types/ddb";

function createMockCharacter(overrides: Partial<DDBParsedCharacter> = {}): DDBParsedCharacter {
    return {
        id: 12345,
        name: "Test Wizard",
        classes: [{ name: "Wizard", level: 5 }],
        casterLevel: 5,
        level: 5,
        proficiencyBonus: 3,
        spellSlots: {
            1: { level: 1, max: 4, used: 0 },
            2: { level: 2, max: 3, used: 0 },
            3: { level: 3, max: 2, used: 0 },
        },
        actions: [
            {
                id: "feat:arcane_recovery",
                name: "Arcane Recovery",
                limitedUse: { max: 1, used: 0, resetType: "Long Rest" },
            },
        ],
        hitDice: [
            { die: "d6", total: 5, used: 0 },
        ],
        ...overrides,
    };
}

describe("resourceMerge", () => {
    describe("isCharacterCaster", () => {
        it("returns true for full caster classes", () => {
            const char = createMockCharacter();
            expect(isCharacterCaster(char)).toBe(true);
        });

        it("returns false for pure fighter without caster level or subclass", () => {
            const char = createMockCharacter({
                classes: [{ name: "Fighter", level: 5 }],
                casterLevel: 0,
            });
            expect(isCharacterCaster(char)).toBe(false);
        });

        it("returns true for eldritch knight fighter", () => {
            const char = createMockCharacter({
                classes: [{ name: "Fighter", level: 5, subclass: "Eldritch Knight" }],
                casterLevel: 0,
            });
            expect(isCharacterCaster(char)).toBe(true);
        });
    });

    describe("mergeSpellSlots", () => {
        it("preserves local used slots on auto-sync (mode=merge) when DDB used is 0", () => {
            const char = createMockCharacter();
            const currentSlots = {
                1: { max: 4, used: 2 },
                2: { max: 3, used: 1 },
                3: { max: 2, used: 0 },
            };

            const merged = mergeSpellSlots({
                char,
                currentSlots,
                baselineSlotsUsed: { 1: 0, 2: 0, 3: 0 },
                mode: "merge",
            });

            expect(merged[1]).toEqual({ max: 4, used: 2 });
            expect(merged[2]).toEqual({ max: 3, used: 1 });
            expect(merged[3]).toEqual({ max: 2, used: 0 });
        });

        it("respects DDB change when DDB used changed from baseline", () => {
            const char = createMockCharacter({
                spellSlots: {
                    1: { level: 1, max: 4, used: 3 }, // User used slot in DDB sheet directly
                    2: { level: 2, max: 3, used: 0 },
                },
            });
            const currentSlots = {
                1: { max: 4, used: 1 },
                2: { max: 3, used: 2 },
            };

            const merged = mergeSpellSlots({
                char,
                currentSlots,
                baselineSlotsUsed: { 1: 0, 2: 0 }, // Baseline had 0, now DDB has 3
                mode: "merge",
            });

            // Level 1 should adopt DDB's 3 because DDB changed from baseline (0 -> 3)
            expect(merged[1]).toEqual({ max: 4, used: 3 });
            // Level 2 should retain local's 2 because DDB remained 0 (matches baseline)
            expect(merged[2]).toEqual({ max: 3, used: 2 });
        });

        it("includes created spell slots (Font of Magic) into max in merge mode", () => {
            const char = createMockCharacter();
            const currentSlots = {
                1: { max: 5, used: 1 },
            };
            const createdSpellSlots = { 1: 1 };

            const merged = mergeSpellSlots({
                char,
                currentSlots,
                createdSpellSlots,
                mode: "merge",
            });

            expect(merged[1]).toEqual({ max: 5, used: 1 });
        });

        it("clamps used slots when max slots decrease from DDB", () => {
            const char = createMockCharacter({
                spellSlots: {
                    1: { level: 1, max: 2, used: 0 }, // DDB max dropped to 2
                },
            });
            const currentSlots = {
                1: { max: 4, used: 3 },
            };

            const merged = mergeSpellSlots({
                char,
                currentSlots,
                mode: "merge",
            });

            // Used should be clamped to max (2)
            expect(merged[1]).toEqual({ max: 2, used: 2 });
        });

        it("resets to DDB values completely on manual resync (mode=replace)", () => {
            const char = createMockCharacter({
                spellSlots: {
                    1: { level: 1, max: 4, used: 0 },
                    2: { level: 2, max: 3, used: 1 },
                },
            });
            const currentSlots = {
                1: { max: 5, used: 4 }, // local had created slot and 4 used
                2: { max: 3, used: 3 },
            };
            const createdSpellSlots = { 1: 1 };

            const merged = mergeSpellSlots({
                char,
                currentSlots,
                createdSpellSlots,
                mode: "replace",
            });

            // Should ignore created slots and adopt DDB used directly
            expect(merged[1]).toEqual({ max: 4, used: 0 });
            expect(merged[2]).toEqual({ max: 3, used: 1 });
        });
    });

    describe("mergePactSlots", () => {
        it("preserves local used pact slots on auto-sync (mode=merge)", () => {
            const char = createMockCharacter({
                pactMagic: { level: 3, max: 2, used: 0 },
            });
            const currentPact = { max: 2, used: 1 };

            const merged = mergePactSlots({
                char,
                currentPact,
                baselinePactUsed: 0,
                mode: "merge",
            });

            expect(merged).toEqual({ max: 2, used: 1 });
        });

        it("updates when DDB pact used changes from baseline", () => {
            const char = createMockCharacter({
                pactMagic: { level: 3, max: 2, used: 2 },
            });
            const currentPact = { max: 2, used: 1 };

            const merged = mergePactSlots({
                char,
                currentPact,
                baselinePactUsed: 0,
                mode: "merge",
            });

            expect(merged).toEqual({ max: 2, used: 2 });
        });

        it("reverts to DDB pact magic on manual resync (mode=replace)", () => {
            const char = createMockCharacter({
                pactMagic: { level: 3, max: 2, used: 0 },
            });
            const currentPact = { max: 2, used: 2 };

            const merged = mergePactSlots({
                char,
                currentPact,
                mode: "replace",
            });

            expect(merged).toEqual({ max: 2, used: 0 });
        });
    });

    describe("mergeFeatureUses", () => {
        it("preserves locally used feature resources on merge", () => {
            const char = createMockCharacter();
            const currentFeatureUses = {
                "feat:arcane_recovery": 1,
            };

            const merged = mergeFeatureUses({
                char,
                currentFeatureUses,
                baselineFeatureUses: { "feat:arcane_recovery": 0 },
                mode: "merge",
            });

            expect(merged["feat:arcane_recovery"]).toBe(1);
        });

        it("reverts feature uses to DDB on manual resync (mode=replace)", () => {
            const char = createMockCharacter();
            const currentFeatureUses = {
                "feat:arcane_recovery": 1,
            };

            const merged = mergeFeatureUses({
                char,
                currentFeatureUses,
                mode: "replace",
            });

            expect(merged["feat:arcane_recovery"]).toBe(0);
        });
    });

    describe("mergeHitDice", () => {
        it("preserves locally used hit dice on merge", () => {
            const char = createMockCharacter();
            const currentHitDiceUsed = { d6: 2 };

            const merged = mergeHitDice({
                char,
                currentHitDiceUsed,
                baselineHitDiceUsed: { d6: 0 },
                mode: "merge",
            });

            expect(merged["d6"]).toBe(2);
        });

        it("reverts hit dice to DDB on manual resync (mode=replace)", () => {
            const char = createMockCharacter({
                hitDice: [{ die: "d6", total: 5, used: 1 }],
            });
            const currentHitDiceUsed = { d6: 4 };

            const merged = mergeHitDice({
                char,
                currentHitDiceUsed,
                mode: "replace",
            });

            expect(merged["d6"]).toBe(1);
        });
    });

    describe("extractDdbBaseline", () => {
        it("extracts baseline state from DDB character", () => {
            const char = createMockCharacter({
                pactMagic: { level: 2, max: 2, used: 1 },
                hitDice: [{ die: "d6", total: 5, used: 2 }],
            });

            const baseline = extractDdbBaseline(char);
            expect(baseline.spellSlotsUsed?.[1]).toBe(0);
            expect(baseline.pactSlotsUsed).toBe(1);
            expect(baseline.hitDiceUsed?.["d6"]).toBe(2);
        });
    });
});
