import { describe, it, expect, beforeEach, vi } from "vitest";
import {
    addConditionalTrigger,
    getActiveTriggers,
    getActiveTriggersForTarget,
    removeConditionalTrigger,
    fireConditionalTrigger,
    checkAndFireMovementTriggers,
    checkAndFireActionTriggers,
    resetConditionalTriggerState
} from "../conditionalTriggerService";
import * as rollLogService from "../rollLogService";

vi.mock("@owlbear-rodeo/sdk", () => {
    return {
        default: {
            onReady: vi.fn((cb) => cb()),
            scene: {
                isReady: vi.fn().mockResolvedValue(true),
                getMetadata: vi.fn().mockResolvedValue({}),
                setMetadata: vi.fn().mockResolvedValue(undefined),
            },
            notification: {
                show: vi.fn(),
            },
            player: {
                getId: vi.fn().mockResolvedValue("player-1"),
                getRole: vi.fn().mockResolvedValue("GM"),
            },
        },
    };
});

describe("conditionalTriggerService", () => {
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
        resetConditionalTriggerState();
        vi.restoreAllMocks();
    });

    it("adds and retrieves conditional triggers", async () => {
        await addConditionalTrigger({
            id: "trig-1",
            spellId: "booming_blade",
            spellName: "Booming Blade",
            casterName: "Kazmalia",
            targetId: "plant-1",
            targetName: "Plant",
            conditionType: "movement",
            damageFormula: "2d8",
            damageType: "Thunder",
            appliedAt: Date.now(),
            initialPosition: { x: 100, y: 100 }
        });

        const all = await getActiveTriggers();
        expect(all).toHaveLength(1);
        expect(all[0].spellName).toBe("Booming Blade");

        const forPlant = await getActiveTriggersForTarget("plant-1");
        expect(forPlant).toHaveLength(1);

        const forOther = await getActiveTriggersForTarget("other-token");
        expect(forOther).toHaveLength(0);

        await removeConditionalTrigger("trig-1");
        const afterRemove = await getActiveTriggers();
        expect(afterRemove).toHaveLength(0);
    });

    it("replaces existing trigger for same spell on same target", async () => {
        await addConditionalTrigger({
            id: "trig-1",
            spellId: "booming_blade",
            spellName: "Booming Blade",
            casterName: "Kazmalia",
            targetId: "plant-1",
            targetName: "Plant",
            conditionType: "movement",
            damageFormula: "1d8",
            damageType: "Thunder",
            appliedAt: 1000
        });

        await addConditionalTrigger({
            id: "trig-2",
            spellId: "booming_blade",
            spellName: "Booming Blade",
            casterName: "Kazmalia",
            targetId: "plant-1",
            targetName: "Plant",
            conditionType: "movement",
            damageFormula: "2d8",
            damageType: "Thunder",
            appliedAt: 2000
        });

        const all = await getActiveTriggers();
        expect(all).toHaveLength(1);
        expect(all[0].id).toBe("trig-2");
        expect(all[0].damageFormula).toBe("2d8");
    });

    it("fires conditional trigger and broadcasts roll card", async () => {
        const broadcastSpy = vi.spyOn(rollLogService, "broadcastDDBRoll").mockResolvedValue(undefined);

        await addConditionalTrigger({
            id: "trig-bb",
            spellId: "booming_blade",
            spellName: "Booming Blade",
            casterName: "Kazmalia",
            targetId: "plant-1",
            targetName: "Plant",
            conditionType: "movement",
            damageFormula: "2d8",
            damageType: "Thunder",
            appliedAt: Date.now()
        });

        const card = await fireConditionalTrigger("trig-bb");
        expect(card).not.toBeNull();
        expect(card?.actionName).toBe("BOOMING BLADE (TRIGGER)");
        expect(card?.actionType).toBe("DAMAGE");
        expect(card?.isConditionTrigger).toBe(true);
        expect(card?.triggerConditionDesc).toContain("Movement Trigger");
        expect(card?.targetName).toBe("Plant");
        expect(card?.formula).toBe("2d8 Thunder");
        expect(typeof card?.total).toBe("number");
        expect(broadcastSpy).toHaveBeenCalledTimes(1);

        // Should be removed after firing
        const remaining = await getActiveTriggers();
        expect(remaining).toHaveLength(0);
    });

    it("fires movement trigger only when target moves 5ft+", async () => {
        const broadcastSpy = vi.spyOn(rollLogService, "broadcastDDBRoll").mockResolvedValue(undefined);

        await addConditionalTrigger({
            id: "trig-bb-move",
            spellId: "booming_blade",
            spellName: "Booming Blade",
            casterName: "Kazmalia",
            targetId: "plant-1",
            targetName: "Plant",
            conditionType: "movement",
            damageFormula: "2d8",
            damageType: "Thunder",
            appliedAt: Date.now(),
            initialPosition: { x: 0, y: 0 }
        });

        // Small nudge (less than 5ft, e.g. 50px when dpi=400, threshold is 240px)
        const minorMove = await checkAndFireMovementTriggers("plant-1", { x: 50, y: 50 }, 400);
        expect(minorMove).toHaveLength(0);
        expect(broadcastSpy).not.toHaveBeenCalled();

        // Substantial move (e.g. 300px away)
        const bigMove = await checkAndFireMovementTriggers("plant-1", { x: 300, y: 0 }, 400);
        expect(bigMove).toHaveLength(1);
        expect(bigMove[0].actionName).toBe("BOOMING BLADE (TRIGGER)");
        expect(broadcastSpy).toHaveBeenCalledTimes(1);

        // Cleared after move
        const remaining = await getActiveTriggers();
        expect(remaining).toHaveLength(0);
    });

    it("fires action trigger when target attacks or casts (Vengeful Blade)", async () => {
        const broadcastSpy = vi.spyOn(rollLogService, "broadcastDDBRoll").mockResolvedValue(undefined);

        await addConditionalTrigger({
            id: "trig-vb",
            spellId: "vengeful_blade",
            spellName: "Vengeful Blade",
            casterName: "Kazmalia",
            targetId: "cultist-1",
            targetName: "Cultist",
            conditionType: "action_attack_or_cast",
            damageFormula: "2d8",
            damageType: "Necrotic",
            appliedAt: Date.now()
        });

        const fired = await checkAndFireActionTriggers("cultist-1", "attack");
        expect(fired).toHaveLength(1);
        expect(fired[0].actionName).toBe("VENGEFUL BLADE (TRIGGER)");
        expect(fired[0].isConditionTrigger).toBe(true);
        expect(fired[0].triggerConditionDesc).toContain("Action Trigger");
        expect(fired[0].formula).toBe("2d8 Necrotic");
        expect(broadcastSpy).toHaveBeenCalledTimes(1);

        const remaining = await getActiveTriggers();
        expect(remaining).toHaveLength(0);
    });

    it("prevents double-firing if fireConditionalTrigger is called multiple times concurrently", async () => {
        const broadcastSpy = vi.spyOn(rollLogService, "broadcastDDBRoll").mockResolvedValue(undefined);

        await addConditionalTrigger({
            id: "trig-race-condition",
            spellId: "booming_blade",
            spellName: "Booming Blade",
            casterName: "Kazmalia",
            targetId: "plant-1",
            targetName: "Plant",
            conditionType: "movement",
            damageFormula: "2d8",
            damageType: "Thunder",
            appliedAt: Date.now(),
            initialPosition: { x: 0, y: 0 }
        });

        // Simulate two concurrent calls trying to fire the same trigger
        const [result1, result2] = await Promise.all([
            fireConditionalTrigger("trig-race-condition"),
            fireConditionalTrigger("trig-race-condition"),
        ]);

        // Exactly one should succeed, the other must be null
        const successCount = [result1, result2].filter(Boolean).length;
        expect(successCount).toBe(1);
        expect(broadcastSpy).toHaveBeenCalledTimes(1);
    });
});
