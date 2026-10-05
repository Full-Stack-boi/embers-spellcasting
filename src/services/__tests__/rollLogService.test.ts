import { describe, it, expect, beforeEach, vi } from "vitest";
import {
    getStoredRollHistory,
    saveStoredRollHistory,
    clearStoredRollHistory,
    setPopoverOpenState,
    isPopoverCurrentlyOpen,
    openDDBRollLogPopover,
    closeDDBRollLogPopover,
    toggleDDBRollLogPopover,
} from "../rollLogService";
import OBR from "@owlbear-rodeo/sdk";
import { DDBRollCardData } from "../../types/ddbRollLog";

vi.mock("@owlbear-rodeo/sdk", () => {
    return {
        default: {
            onReady: vi.fn((cb) => cb()),
            viewport: {
                getWidth: vi.fn().mockResolvedValue(1920),
                getHeight: vi.fn().mockResolvedValue(1080),
            },
            popover: {
                open: vi.fn().mockResolvedValue(undefined),
                close: vi.fn().mockResolvedValue(undefined),
                getHeight: vi.fn().mockResolvedValue(undefined),
            },
            broadcast: {
                sendMessage: vi.fn().mockResolvedValue(undefined),
            },
            player: {
                getId: vi.fn().mockResolvedValue("player-1"),
            },
        },
    };
});

describe("rollLogService", () => {
    let store: Record<string, string> = {};

    beforeEach(() => {
        store = {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (globalThis as any).localStorage = {
            getItem: (k: string) => store[k] ?? null,
            setItem: (k: string, v: string) => { store[k] = v; },
            removeItem: (k: string) => { delete store[k]; },
            clear: () => { Object.keys(store).forEach(k => delete store[k]); },
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (globalThis as any).window = {
            location: {
                origin: "http://localhost:5173",
                search: "?test=1",
            },
            innerWidth: 1920,
            innerHeight: 1080,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
        };
        vi.clearAllMocks();
    });

    it("stores and retrieves roll history properly", () => {
        clearStoredRollHistory();
        expect(getStoredRollHistory()).toEqual([]);

        const sampleCard: DDBRollCardData = {
            id: "card-1",
            casterName: "Astarion",
            actionName: "Sneak Attack",
            actionType: "DAMAGE",
            dieType: 6,
            diceBreakdown: "3, 5, 6",
            formula: "3d6",
            total: 14,
            timestamp: Date.now(),
        };

        saveStoredRollHistory([sampleCard]);
        const history = getStoredRollHistory();
        expect(history.length).toBe(1);
        expect(history[0].id).toBe("card-1");
    });

    it("correctly synchronizes popover open state", () => {
        setPopoverOpenState(false);
        expect(isPopoverCurrentlyOpen()).toBe(false);

        setPopoverOpenState(true);
        expect(isPopoverCurrentlyOpen()).toBe(true);

        setPopoverOpenState(false);
        expect(isPopoverCurrentlyOpen()).toBe(false);
    });

    it("opens popover with manual mode by default or when toggled", async () => {
        setPopoverOpenState(false);
        await toggleDDBRollLogPopover();

        expect(OBR.popover.open).toHaveBeenCalledWith(
            expect.objectContaining({
                width: 360,
                url: expect.stringContaining("mode=manual"),
            })
        );
        expect(isPopoverCurrentlyOpen()).toBe(true);

        // Toggling again closes it
        await toggleDDBRollLogPopover();
        expect(OBR.popover.close).toHaveBeenCalled();
        expect(isPopoverCurrentlyOpen()).toBe(false);
    });

    it("opens popover with auto mode when specified", async () => {
        await openDDBRollLogPopover("auto");
        expect(OBR.popover.open).toHaveBeenCalledWith(
            expect.objectContaining({
                width: 360,
                url: expect.stringContaining("mode=auto"),
            })
        );
        expect(isPopoverCurrentlyOpen()).toBe(true);
    });

    it("closes popover when closeDDBRollLogPopover is called", async () => {
        setPopoverOpenState(true);
        await closeDDBRollLogPopover();
        expect(OBR.popover.close).toHaveBeenCalled();
        expect(isPopoverCurrentlyOpen()).toBe(false);
    });

    it("correctly stores and retrieves grouped multi-beam roll card data", () => {
        const groupedCard: DDBRollCardData = {
            id: "card-eb-grouped",
            casterName: "Warlock",
            targetName: "Goblin Archer",
            actionName: "ELDRITCH BLAST",
            actionType: "SPELL",
            dieType: 10,
            diceBreakdown: "19, 14",
            formula: "2 Beams (1d10+4 Force each)",
            total: 22,
            subtitle: "2 Beams • Force",
            isCrit: false,
            timestamp: Date.now(),
            subRolls: [
                {
                    unitLabel: "BEAM 1",
                    targetName: "Goblin Archer",
                    toHit: {
                        total: 19,
                        diceBreakdown: "14 + 5",
                        formula: "1d20+5",
                        isCrit: false,
                    },
                    damage: {
                        total: 12,
                        damageType: "Force",
                        diceBreakdown: "8 + 4",
                        formula: "1d10+4 Force",
                    },
                    extraDamage: [
                        {
                            name: "Hex",
                            total: 3,
                            damageType: "Necrotic",
                            diceBreakdown: "3",
                            formula: "1d6 Necrotic",
                        },
                    ],
                },
                {
                    unitLabel: "BEAM 2",
                    targetName: "Goblin Boss",
                    toHit: {
                        total: 14,
                        diceBreakdown: "9 + 5",
                        formula: "1d20+5",
                    },
                    damage: {
                        total: 10,
                        damageType: "Force",
                        diceBreakdown: "6 + 4",
                        formula: "1d10+4 Force",
                    },
                },
            ],
        };

        saveStoredRollHistory([groupedCard]);
        const history = getStoredRollHistory();
        const found = history.find(c => c.id === "card-eb-grouped");
        expect(found).toBeDefined();
        expect(found?.subRolls?.length).toBe(2);
        expect(found?.subRolls?.[0].unitLabel).toBe("BEAM 1");
        expect(found?.subRolls?.[0].toHit?.total).toBe(19);
        expect(found?.subRolls?.[0].damage?.total).toBe(12);
        expect(found?.subRolls?.[0].extraDamage?.[0].name).toBe("Hex");
        expect(found?.subRolls?.[1].unitLabel).toBe("BEAM 2");
        expect(found?.subRolls?.[1].targetName).toBe("Goblin Boss");
    });
});
