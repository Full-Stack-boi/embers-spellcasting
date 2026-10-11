import OBR, { Item, Vector2 } from "@owlbear-rodeo/sdk";
import { resolveActiveCaster } from "../infrastructure/obr/activeCasterResolver";
import { resolveCasterCharacter } from "../../../services/ddbService";
import type { DDBParsedCharacter } from "../../../types/ddb";

export interface CastContext {
    casterTokenId: string;
    casterItem: Item;
    casterName: string;
    position: Vector2;
    isDM: boolean;
    playerId: string;
    ddbCharacter?: DDBParsedCharacter | null;
    ddbCharacterId?: number | null;
}

/**
 * Captures a single immutable snapshot of the active caster for a spellcast.
 * Guarantees that:
 * 1. Spell VFX origin,
 * 2. Game Log roll card,
 * 3. Spell slot deduction,
 * 4. Concentration tracking, and
 * 5. Conditional triggers
 * ALL use the exact same character identity and token position without drift or desync.
 *
 * If `preferredTokenId` is given (e.g. the caster chosen in the ActionDock), that token is
 * used directly; otherwise the caster is resolved from metadata/selection.
 */
export async function captureCastContext(
    playerRole: "GM" | "PLAYER",
    playerId: string,
    preferredTokenId?: string
): Promise<CastContext | null> {
    let casterItem: Item | undefined;
    let position: Vector2 | undefined;
    let resolvedName: string | undefined;

    if (preferredTokenId) {
        try {
            const items = await OBR.scene.items.getItems([preferredTokenId]);
            if (items.length > 0) {
                casterItem = items[0];
                position = items[0].position;
                resolvedName = items[0].name;
            }
        } catch {
            // fall through to resolver
        }
    }

    if (!casterItem) {
        const activeCaster = await resolveActiveCaster(playerRole, playerId, { purpose: "cast" });
        if (!activeCaster || !activeCaster.item) {
            return null;
        }
        casterItem = activeCaster.item;
        position = activeCaster.position;
        resolvedName = activeCaster.name;
    }

    const ddbChar = resolveCasterCharacter(casterItem);
    const ddbCharId = ddbChar?.id ?? null;
    const isDM = playerRole === "GM";
    const casterName = ddbChar?.name || resolvedName || casterItem.name || (isDM ? "Dungeon Master" : "Caster");

    return {
        casterTokenId: casterItem.id,
        casterItem,
        casterName,
        position: position ?? casterItem.position,
        isDM,
        playerId,
        ddbCharacter: ddbChar,
        ddbCharacterId: ddbCharId
    };
}
