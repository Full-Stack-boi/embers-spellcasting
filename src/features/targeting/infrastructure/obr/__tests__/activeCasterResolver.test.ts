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
let mockPlayerMetadata: Record<string, any> = {};

vi.mock("@owlbear-rodeo/sdk", () => {
    return {
        default: {
            player: {
                getSelection: vi.fn(async () => mockSelection),
                getId: vi.fn(async () => "player-1"),
                getRole: vi.fn(async () => "PLAYER"),
                getMetadata: vi.fn(async () => mockPlayerMetadata),
                setMetadata: vi.fn(async (data: any) => { Object.assign(mockPlayerMetadata, data); })
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
import { toolMetadataSelectedCaster } from "../../../../../effectsTool";

describe("activeCasterResolver", () => {
    beforeEach(() => {
        mockSceneItems.length = 0;
        mockSelection = [];
        mockPlayerMetadata = {};
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

    it("resolves selected character token for perspective viewing when player selects another character token", async () => {
        const playerToken = {
            id: "player-wizard",
            layer: "CHARACTER",
            position: { x: 100, y: 100 },
            name: "Gandalf",
            metadata: {
                "eu.armindo.embers/bound-player": { playerId: "player-1", playerName: "Gandalf" }
            }
        };
        const allyToken = {
            id: "ally-warlock",
            layer: "CHARACTER",
            position: { x: 500, y: 500 },
            name: "Wyll",
            createdUserId: "gm-user",
            metadata: {}
        };
        mockSceneItems.push(playerToken, allyToken);

        // Player clicks ally to preview their perspective / vision:
        mockSelection = ["ally-warlock"];

        const resolved = await resolveActiveCaster("PLAYER", "player-1");
        expect(resolved).not.toBeNull();
        expect(resolved?.id).toBe("ally-warlock");
        expect(resolved?.name).toBe("Wyll");

        // When player deselects (clears selection), reverts to their primary bound character:
        mockSelection = [];
        const reverted = await resolveActiveCaster("PLAYER", "player-1");
        expect(reverted).not.toBeNull();
        expect(reverted?.id).toBe("player-wizard");
        expect(reverted?.name).toBe("Gandalf");
    });

    it("rejects darkness zone and keeps player bound character", async () => {
        const playerToken = {
            id: "player-wizard",
            layer: "CHARACTER",
            position: { x: 100, y: 100 },
            name: "Gandalf",
            metadata: {
                "eu.armindo.embers/bound-player": { playerId: "player-1", playerName: "Gandalf" }
            }
        };
        const darknessItem = {
            id: "darkness-effect",
            layer: "ATTACHMENT",
            position: { x: 200, y: 200 },
            name: "Darkness",
            metadata: {
                "eu.armindo.embers/darkness-zone": { radiusFeet: 15 }
            }
        };
        mockSceneItems.push(playerToken, darknessItem);

        // Player clicks darkness zone:
        mockSelection = ["darkness-effect"];

        const resolved = await resolveActiveCaster("PLAYER", "player-1");
        // Must NOT be the darkness zone! Gandalf must remain the active caster!
        expect(resolved).not.toBeNull();
        expect(resolved?.id).toBe("player-wizard");
        expect(resolved?.name).toBe("Gandalf");
    });

    it("allows GM to select and control any token including enemy", async () => {
        const enemyToken = {
            id: "enemy-goblin",
            layer: "CHARACTER",
            position: { x: 500, y: 500 },
            name: "Goblin Archer",
            createdUserId: "gm-user",
            metadata: {}
        };
        mockSceneItems.push(enemyToken);
        mockSelection = ["enemy-goblin"];

        const resolved = await resolveActiveCaster("GM", "gm-user");
        expect(resolved).not.toBeNull();
        expect(resolved?.id).toBe("enemy-goblin");
        expect(resolved?.name).toBe("Goblin Archer");
    });

    it("preserves explicit caster bound via toolMetadataSelectedCaster regardless of map selection", async () => {
        const wizardToken = {
            id: "player-wizard",
            layer: "CHARACTER",
            position: { x: 100, y: 100 },
            name: "Gandalf",
            metadata: {
                "eu.armindo.embers/bound-player": { playerId: "player-1", playerName: "Player 1" }
            }
        };
        const enemyToken = {
            id: "enemy-target",
            layer: "CHARACTER",
            position: { x: 200, y: 200 },
            name: "Orc Brute",
            metadata: {}
        };
        mockSceneItems.push(wizardToken, enemyToken);

        // Player selected the enemy token on the map to target it, but explicitly aiming as wizard
        mockSelection = ["enemy-target"];
        mockPlayerMetadata[toolMetadataSelectedCaster] = "player-wizard";

        const resolved = await resolveActiveCaster("PLAYER", "player-1");
        expect(resolved).not.toBeNull();
        expect(resolved?.id).toBe("player-wizard");
        expect(resolved?.name).toBe("Gandalf");
    });
});
