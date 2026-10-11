import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock @owlbear-rodeo/sdk so that it doesn't try to access window in node environment
vi.mock("@owlbear-rodeo/sdk", () => {
    return {
        default: {
            player: {
                getSelection: vi.fn(async () => []),
                getId: vi.fn(async () => "player-1"),
                getRole: vi.fn(async () => "PLAYER"),
                getMetadata: vi.fn(async () => ({})),
            },
            scene: {
                items: {
                    getItems: vi.fn(async () => []),
                }
            }
        },
        isImage: vi.fn(() => true)
    };
});

import { captureCastContext } from "../castContext";
import * as activeCasterResolver from "../../infrastructure/obr/activeCasterResolver";
import * as ddbService from "../../../../services/ddbService";

describe("captureCastContext", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it("returns null when no active caster is resolved", async () => {
        vi.spyOn(activeCasterResolver, "resolveActiveCaster").mockResolvedValue(null);

        const context = await captureCastContext("PLAYER", "player-1");
        expect(context).toBeNull();
    });

    it("creates an immutable snapshot binding caster ID, item, position, and DDB character", async () => {
        const mockItem = {
            id: "token-cleric",
            name: "Shadowheart",
            position: { x: 150, y: 300 },
            layer: "CHARACTER",
            metadata: {}
        } as any;

        const mockDdbChar = {
            id: 123456,
            name: "Shadowheart",
            level: 5,
            classes: [{ name: "Cleric", level: 5 }]
        } as any;

        vi.spyOn(activeCasterResolver, "resolveActiveCaster").mockResolvedValue({
            id: "token-cleric",
            item: mockItem,
            name: "Shadowheart",
            position: { x: 150, y: 300 },
            isDM: false
        });

        vi.spyOn(ddbService, "resolveCasterCharacter").mockReturnValue(mockDdbChar);

        const context = await captureCastContext("PLAYER", "player-1");

        expect(context).not.toBeNull();
        expect(context?.casterTokenId).toBe("token-cleric");
        expect(context?.casterName).toBe("Shadowheart");
        expect(context?.position).toEqual({ x: 150, y: 300 });
        expect(context?.isDM).toBe(false);
        expect(context?.playerId).toBe("player-1");
        expect(context?.ddbCharacter?.id).toBe(123456);
        expect(context?.ddbCharacterId).toBe(123456);

        // Verify resolveActiveCaster was called with purpose: "cast"
        expect(activeCasterResolver.resolveActiveCaster).toHaveBeenCalledWith(
            "PLAYER",
            "player-1",
            { purpose: "cast" }
        );
    });

    it("falls back to Dungeon Master name for GM without bound DDB character", async () => {
        const mockItem = {
            id: "token-dragon",
            name: "Red Dragon",
            position: { x: 500, y: 500 },
            layer: "CHARACTER",
            metadata: {}
        } as any;

        vi.spyOn(activeCasterResolver, "resolveActiveCaster").mockResolvedValue({
            id: "token-dragon",
            item: mockItem,
            name: "",
            position: { x: 500, y: 500 },
            isDM: true
        });

        vi.spyOn(ddbService, "resolveCasterCharacter").mockReturnValue(null);

        const context = await captureCastContext("GM", "gm-1");

        expect(context).not.toBeNull();
        expect(context?.casterTokenId).toBe("token-dragon");
        expect(context?.casterName).toBe("Red Dragon");
        expect(context?.isDM).toBe(true);
        expect(context?.ddbCharacter).toBeNull();
    });
});
