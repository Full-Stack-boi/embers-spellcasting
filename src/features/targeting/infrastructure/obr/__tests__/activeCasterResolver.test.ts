import { describe, it, expect, beforeEach, vi } from "vitest";

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

// Mock OBR and items
const mockSceneItems: any[] = [];
let mockSelection: string[] = [];

vi.mock("@owlbear-rodeo/sdk", () => {
    return {
        default: {
            player: {
                getSelection: vi.fn(async () => mockSelection),
                getId: vi.fn(async () => "player-1"),
                getRole: vi.fn(async () => "PLAYER")
            },
            scene: {
                items: {
                    getItems: vi.fn(async (ids?: string[]) => {
                        if (ids && ids.length > 0) {
                            return mockSceneItems.filter(item => ids.includes(item.id));
                        }
                        return mockSceneItems;
                    })
                }
            }
        },
        isImage: vi.fn((item: any) => Boolean(item.image))
    };
});

// Mock settings
vi.mock("../../../../components/Settings/settings", () => {
    return {
        LOCAL_STORAGE_KEYS: { DEFAULT_CASTER: "default-caster" },
        getSettingsValue: vi.fn(() => null)
    };
});

// Mock ddbService
vi.mock("../../../../services/ddbService", () => {
    return {
        getLinkedDDBCharacterId: vi.fn((item: any) => item.metadata?.["eu.armindo.embers/ddb-character-id"] ?? null),
        getAllCachedDDBCharacters: vi.fn(() => [
            { id: 99999, name: "Aria Shadowstep" }
        ])
    };
});

import { resolveActiveCaster, setActiveCaster } from "../activeCasterResolver";

describe("activeCasterResolver", () => {
    beforeEach(() => {
        mockSceneItems.length = 0;
        mockSelection = [];
        setActiveCaster(null);
        vi.clearAllMocks();
    });

    it("resolves active caster from single selected character token", async () => {
        const token = {
            id: "token-1",
            layer: "CHARACTER",
            position: { x: 100, y: 150 },
            name: "Hero",
            createdUserId: "gm-user"
        };
        mockSceneItems.push(token);
        mockSelection = ["token-1"];

        const resolved = await resolveActiveCaster("PLAYER", "player-1");
        expect(resolved).not.toBeNull();
        expect(resolved?.id).toBe("token-1");
        expect(resolved?.name).toBe("Hero");
        expect(resolved?.position).toEqual({ x: 100, y: 150 });
    });

    it("falls back to lastResolvedCaster when selection is cleared (e.g. during map targeting clicks)", async () => {
        const token = {
            id: "token-1",
            layer: "CHARACTER",
            position: { x: 100, y: 150 },
            name: "Hero",
            createdUserId: "gm-user"
        };
        mockSceneItems.push(token);
        mockSelection = ["token-1"];

        // 1. Initial selection
        const first = await resolveActiveCaster("PLAYER", "player-1");
        expect(first?.id).toBe("token-1");

        // 2. User clicks empty ground to cast Misty Step, clearing selection:
        mockSelection = [];
        const second = await resolveActiveCaster("PLAYER", "player-1");
        expect(second).not.toBeNull();
        expect(second?.id).toBe("token-1");
        expect(second?.name).toBe("Hero");
    });

    it("resolves token linked to cached D&D Beyond character when no selection exists", async () => {
        const ddbToken = {
            id: "ddb-token-1",
            layer: "CHARACTER",
            position: { x: 200, y: 300 },
            name: "Aria Shadowstep",
            metadata: {
                "eu.armindo.embers/ddb-character-id": 99999
            }
        };
        mockSceneItems.push(ddbToken);
        mockSelection = [];

        const resolved = await resolveActiveCaster("PLAYER", "player-1");
        expect(resolved).not.toBeNull();
        expect(resolved?.id).toBe("ddb-token-1");
        expect(resolved?.name).toBe("Aria Shadowstep");
    });

    it("resolves single character token on scene for player", async () => {
        const soloToken = {
            id: "solo-1",
            layer: "CHARACTER",
            position: { x: 50, y: 50 },
            name: "Fighter"
        };
        mockSceneItems.push(soloToken);
        mockSelection = [];

        const resolved = await resolveActiveCaster("PLAYER", "player-1");
        expect(resolved).not.toBeNull();
        expect(resolved?.id).toBe("solo-1");
    });
});
