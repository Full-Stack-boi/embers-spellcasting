import { describe, it, expect, beforeEach, vi } from "vitest";
import {
    loadCombatState,
    saveCombatState,
    resetCombatState,
    getDefaultCombatState
} from "../combatStateService";

describe("combatStateService", () => {
    beforeEach(() => {
        const store: Record<string, string> = {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (globalThis as any).localStorage = {
            getItem: (k: string) => store[k] ?? null,
            setItem: (k: string, v: string) => { store[k] = v; },
            removeItem: (k: string) => { delete store[k]; },
            clear: () => { Object.keys(store).forEach(k => delete store[k]); },
            key: (i: number) => Object.keys(store)[i] ?? null,
            length: 0,
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const storageObj = (globalThis as any).localStorage;
        (globalThis as unknown as { window: unknown }).window = {
            localStorage: storageObj,
            location: { search: "" }
        };
        vi.clearAllMocks();
    });

    it("returns null when loading non-existent state", async () => {
        const state = await loadCombatState(12345);
        expect(state).toBeNull();
    });

    it("generates default combat state with all tracking fields", () => {
        const def = getDefaultCombatState(12345);
        expect(def.characterId).toBe(12345);
        expect(def.spellSlotsUsed).toEqual({});
        expect(def.pactSlotsUsed).toBe(0);
        expect(def.actionUsed).toBe(false);
        expect(def.bonusActionUsed).toBe(false);
        expect(def.heroicInspiration).toBe(false);
        expect(def.deathSaves).toEqual({ successes: 0, failures: 0 });
        expect(def.hitDiceUsed).toEqual({});
        expect(def.exhaustionLevel).toBe(0);
        expect(def.conditions).toEqual([]);
        expect(def.concentrationSpellId).toBeNull();
        expect(def.ddbBaseline).toEqual({});
    });

    it("saves and reloads state via storage including extended combat state fields", async () => {
        await saveCombatState(12345, {
            spellSlotsUsed: { 1: 2, 3: 1 },
            pactSlotsUsed: 1,
            featureUses: { action_feat_lucky: 2 },
            hpCurrent: 18,
            actionUsed: true,
            heroicInspiration: true,
            concentrationSpellId: "hex",
            concentrationSpellName: "Hex",
            deathSaves: { successes: 2, failures: 1 },
            hitDiceUsed: { d8: 3, d6: 1 },
            exhaustionLevel: 2,
            conditions: ["Poisoned", "Blinded"]
        });

        const loaded = await loadCombatState(12345);
        expect(loaded).toBeDefined();
        expect(loaded?.characterId).toBe(12345);
        expect(loaded?.spellSlotsUsed).toEqual({ 1: 2, 3: 1 });
        expect(loaded?.pactSlotsUsed).toBe(1);
        expect(loaded?.featureUses.action_feat_lucky).toBe(2);
        expect(loaded?.hpCurrent).toBe(18);
        expect(loaded?.actionUsed).toBe(true);
        expect(loaded?.heroicInspiration).toBe(true);
        expect(loaded?.concentrationSpellId).toBe("hex");
        expect(loaded?.concentrationSpellName).toBe("Hex");
        expect(loaded?.deathSaves).toEqual({ successes: 2, failures: 1 });
        expect(loaded?.hitDiceUsed).toEqual({ d8: 3, d6: 1 });
        expect(loaded?.exhaustionLevel).toBe(2);
        expect(loaded?.conditions).toEqual(["Poisoned", "Blinded"]);
    });

    it("resets state back to default", async () => {
        await saveCombatState(999, {
            spellSlotsUsed: { 1: 4 },
            actionUsed: true,
            conditions: ["Stunned"]
        });

        await resetCombatState(999);
        const loaded = await loadCombatState(999);
        expect(loaded?.spellSlotsUsed).toEqual({});
        expect(loaded?.actionUsed).toBe(false);
        expect(loaded?.conditions).toEqual([]);
        expect(loaded?.hexTargetId).toBeNull();
    });

    it("tracks Hex concentration and target correctly", async () => {
        const { isHexConcentrationActive } = await import("../combatStateService");

        expect(isHexConcentrationActive(null)).toBe(false);
        expect(isHexConcentrationActive(getDefaultCombatState(123))).toBe(false);

        await saveCombatState(555, {
            concentrationSpellId: "hex",
            concentrationSpellName: "Hex",
            hexTargetId: "token-goblin-1",
            hexTargetName: "Goblin Chief"
        });

        const state = await loadCombatState(555);
        expect(isHexConcentrationActive(state)).toBe(true);
        expect(state?.hexTargetId).toBe("token-goblin-1");
        expect(state?.hexTargetName).toBe("Goblin Chief");

        // Switching concentration away from Hex
        await saveCombatState(555, {
            concentrationSpellId: "bless",
            concentrationSpellName: "Bless",
            hexTargetId: null,
            hexTargetName: null
        });

        const updated = await loadCombatState(555);
        expect(isHexConcentrationActive(updated)).toBe(false);
        expect(updated?.hexTargetId).toBeNull();
    });
});
