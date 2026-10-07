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

const mockSceneItems: any[] = [];
let mockSelected: string[] = [];
let animatedBounds: any = null;

vi.mock("@owlbear-rodeo/sdk", () => {
    return {
        default: {
            player: {
                getId: vi.fn(async () => "player-1"),
                select: vi.fn(async (ids: string[]) => { mockSelected = ids; })
            },
            viewport: {
                animateToBounds: vi.fn(async (b: any) => { animatedBounds = b; })
            },
            scene: {
                items: {
                    getItems: vi.fn(async (ids?: string[]) => {
                        if (ids && ids.length > 0) {
                            return mockSceneItems.filter(item => ids.includes(item.id));
                        }
                        return mockSceneItems;
                    }),
                    updateItems: vi.fn(async (ids: string[], updater: (items: any[]) => void) => {
                        const targets = mockSceneItems.filter(i => ids.includes(i.id));
                        updater(targets);
                    })
                }
            },
            notification: {
                show: vi.fn()
            }
        },
        isImage: vi.fn((item: any) => Boolean(item.image))
    };
});

vi.mock("../../../services/ddbService", () => {
    return {
        getLinkedDDBCharacterId: vi.fn((item: any) => item.metadata?.["eu.armindo.embers/ddb-character-id"] ?? null),
        getAllCachedDDBCharacters: vi.fn(() => [
            { id: 777, name: "Gale of Waterdeep" }
        ])
    };
});

import {
    BOUND_PLAYER_METADATA_KEY,
    PRIMARY_CHARACTER_STORAGE_KEY,
    EFFECT_METADATA_KEY,
    SPELL_METADATA_KEY,
    DARKNESS_METADATA_KEY,
    isCharacterToken,
    getBoundPlayer,
    isTokenOwnedByPlayer,
    bindTokenToPlayer,
    unbindTokenFromPlayer,
    getPlayerOwnedTokens,
    getMyPrimaryCharacterToken,
    focusCameraOnToken
} from "../playerCharacterService";

describe("playerCharacterService", () => {
    beforeEach(() => {
        mockSceneItems.length = 0;
        mockSelected = [];
        animatedBounds = null;
        Object.keys(store).forEach(k => delete store[k]);
        vi.clearAllMocks();
    });

    it("identifies bound player from metadata", () => {
        const item: any = {
            id: "token-1",
            layer: "CHARACTER",
            metadata: {
                [BOUND_PLAYER_METADATA_KEY]: { playerId: "player-1", playerName: "Astarion" }
            }
        };
        const bound = getBoundPlayer(item);
        expect(bound).toEqual({ playerId: "player-1", playerName: "Astarion" });
        expect(isTokenOwnedByPlayer(item, "player-1")).toBe(true);
        expect(isTokenOwnedByPlayer(item, "player-2")).toBe(false);
    });

    it("falls back to createdUserId when no bound player exists", () => {
        const item: any = {
            id: "token-2",
            layer: "CHARACTER",
            createdUserId: "player-1",
            metadata: {}
        };
        expect(isTokenOwnedByPlayer(item, "player-1")).toBe(true);
        expect(isTokenOwnedByPlayer(item, "player-2")).toBe(false);
    });

    it("identifies ownership via linked DDB character", () => {
        const item: any = {
            id: "token-3",
            layer: "CHARACTER",
            createdUserId: "gm-id",
            metadata: {
                "eu.armindo.embers/ddb-character-id": 777
            }
        };
        expect(isTokenOwnedByPlayer(item, "player-1")).toBe(true);
    });

    it("binds token to player and updates metadata", async () => {
        const item: any = {
            id: "token-1",
            metadata: {}
        };
        mockSceneItems.push(item);

        await bindTokenToPlayer("token-1", "player-1", "Shadowheart");
        expect(item.metadata[BOUND_PLAYER_METADATA_KEY]).toEqual({
            playerId: "player-1",
            playerName: "Shadowheart"
        });
    });

    it("unbinds token from player and clears primary storage", async () => {
        const item: any = {
            id: "token-1",
            layer: "CHARACTER",
            createdUserId: "player-1",
            metadata: {
                [BOUND_PLAYER_METADATA_KEY]: { playerId: "player-1" }
            }
        };
        mockSceneItems.push(item);
        localStorage.setItem(PRIMARY_CHARACTER_STORAGE_KEY, "token-1");

        await unbindTokenFromPlayer("token-1");
        expect(item.metadata[BOUND_PLAYER_METADATA_KEY]).toEqual({ playerId: "unassigned" });
        expect(isTokenOwnedByPlayer(item, "player-1")).toBe(false);
        expect(localStorage.getItem(PRIMARY_CHARACTER_STORAGE_KEY)).toBeNull();
    });

    describe("isCharacterToken", () => {
        it("accepts valid CHARACTER layer token without spell/effect metadata", () => {
            const item: any = {
                id: "char-1",
                layer: "CHARACTER",
                metadata: {}
            };
            expect(isCharacterToken(item)).toBe(true);
        });

        it("rejects items on ATTACHMENT, DRAWING or MAP layers", () => {
            const attachment: any = { id: "att-1", layer: "ATTACHMENT", metadata: {} };
            const map: any = { id: "map-1", layer: "MAP", metadata: {} };
            const drawing: any = { id: "draw-1", layer: "DRAWING", metadata: {} };

            expect(isCharacterToken(attachment)).toBe(false);
            expect(isCharacterToken(map)).toBe(false);
            expect(isCharacterToken(drawing)).toBe(false);
        });

        it("accepts elevated flying token (> 15 ft) on ATTACHMENT layer", () => {
            const flyingToken: any = {
                id: "flying-char",
                type: "IMAGE",
                layer: "ATTACHMENT",
                metadata: {
                    "eu.armindo.embers/elevation": 30
                }
            };
            expect(isCharacterToken(flyingToken)).toBe(true);
        });

        it("rejects attached child items on ATTACHMENT layer even if elevated", () => {
            const attachedEffect: any = {
                id: "effect-1",
                type: "IMAGE",
                layer: "ATTACHMENT",
                attachedTo: "flying-char",
                metadata: {
                    "eu.armindo.embers/elevation": 30
                }
            };
            expect(isCharacterToken(attachedEffect)).toBe(false);
        });

        it("rejects items with spell effect or darkness metadata", () => {
            const darknessZone: any = {
                id: "darkness-1",
                layer: "ATTACHMENT",
                metadata: { [DARKNESS_METADATA_KEY]: { radiusFeet: 15 } }
            };
            const spellEffect: any = {
                id: "spell-1",
                layer: "CHARACTER",
                metadata: { [EFFECT_METADATA_KEY]: "fireball" }
            };
            const spellItem: any = {
                id: "spell-2",
                layer: "CHARACTER",
                metadata: { [SPELL_METADATA_KEY]: { name: "Darkness" } }
            };

            expect(isCharacterToken(darknessZone)).toBe(false);
            expect(isCharacterToken(spellEffect)).toBe(false);
            expect(isCharacterToken(spellItem)).toBe(false);
        });
    });

    it("focusCameraOnToken animates viewport and selects token", async () => {
        const item: any = {
            id: "char-token",
            name: "Karlach",
            position: { x: 500, y: 300 }
        };
        mockSceneItems.push(item);

        const result = await focusCameraOnToken("char-token");
        expect(result).toBe(true);
        expect(animatedBounds).not.toBeNull();
        expect(animatedBounds.center).toEqual({ x: 500, y: 300 });
        expect(mockSelected).toEqual(["char-token"]);
    });

    it("retrieves player owned tokens and primary character token", async () => {
        const item1: any = {
            id: "char-1",
            layer: "CHARACTER",
            metadata: {
                [BOUND_PLAYER_METADATA_KEY]: { playerId: "player-1", playerName: "Astarion" }
            }
        };
        const item2: any = {
            id: "char-2",
            layer: "CHARACTER",
            createdUserId: "player-1",
            metadata: {}
        };
        mockSceneItems.push(item1, item2);

        const owned = await getPlayerOwnedTokens("player-1");
        expect(owned.length).toBe(2);

        const primary = await getMyPrimaryCharacterToken("player-1");
        expect(primary).not.toBeNull();
        expect(primary?.id).toBe("char-1");
    });
});
