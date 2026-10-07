import OBR, { Item, Vector2 } from "@owlbear-rodeo/sdk";
import { LOCAL_STORAGE_KEYS, getSettingsValue } from "../../../../components/Settings/settings";
import { getPlayerOwnedTokens, getMyPrimaryCharacterToken, isCharacterToken } from "../../../player/playerCharacterService";
import { getLinkedDDBCharacterId, getAllCachedDDBCharacters } from "../../../../services/ddbService";
import { toolMetadataSelectedCaster } from "../../../../effectsTool";

export interface ActiveCasterInfo {
    item: Item;
    id: string;
    position: Vector2;
    name?: string;
    isDM: boolean;
}

// Retain last successfully resolved active caster so selection loss during tool clicks doesn't drop caster
let lastResolvedCaster: ActiveCasterInfo | null = null;

export function setActiveCaster(caster: ActiveCasterInfo | null): void {
    lastResolvedCaster = caster;
}

export function getLastResolvedCaster(): ActiveCasterInfo | null {
    return lastResolvedCaster;
}

/**
 * Returns a token's position directly without corrupting it with grid corner snaps.
 * True cell centering is handled mathematically by snapToCellCenter with scene grid info.
 */
function getTokenPosition(item: Item): Vector2 {
    return item.position;
}


/**
 * Automatically resolves the active caster token and its true grid cell center.
 *
 * For GM:
 * 1. Current GM selection (any character token)
 * 2. Last resolved active caster
 * 3. Default caster
 *
 * For PLAYER:
 * 1. If player owns character token(s):
 *    a. If selection is one of player's OWN tokens, switch to it.
 *    b. If selection is NOT owned by player (e.g. enemy target / ally), PRESERVE player's bound character.
 *    c. If no selection, return primary bound character.
 * 2. If no tokens owned yet, fallback to selection / single token.
 */
export async function resolveActiveCaster(
    playerRole: "GM" | "PLAYER",
    playerID: string
): Promise<ActiveCasterInfo | null> {
    const isDM = playerRole === "GM";
    const selection = await OBR.player.getSelection();

    const sceneItems = await OBR.scene.items.getItems();
    const characterItems = sceneItems.filter(isCharacterToken);

    // =========================================================================
    // 0. EXPLICIT CASTER BINDING (ActionDock/Tool selected caster)
    // =========================================================================
    const playerMeta = typeof OBR.player?.getMetadata === "function" ? await OBR.player.getMetadata() : {};
    const explicitCasterId = playerMeta[toolMetadataSelectedCaster] as string | undefined;
    if (explicitCasterId) {
        const boundItem = characterItems.find(item => item.id === explicitCasterId);
        if (boundItem) {
            const casterInfo: ActiveCasterInfo = {
                item: boundItem,
                id: boundItem.id,
                position: getTokenPosition(boundItem),
                name: boundItem.name,
                isDM
            };
            lastResolvedCaster = casterInfo;
            return casterInfo;
        }
    }

    // =========================================================================
    // 1. GM RESOLUTION
    // =========================================================================
    if (isDM) {
        if (selection && selection.length === 1) {
            const selected = characterItems.find(item => item.id === selection[0]);
            if (selected) {
                const casterInfo: ActiveCasterInfo = {
                    item: selected,
                    id: selected.id,
                    position: getTokenPosition(selected),
                    name: selected.name,
                    isDM: true
                };
                lastResolvedCaster = casterInfo;
                return casterInfo;
            }
        }

        if (lastResolvedCaster?.id) {
            const refreshed = characterItems.find(item => item.id === lastResolvedCaster?.id);
            if (refreshed) {
                const refreshedCaster: ActiveCasterInfo = {
                    item: refreshed,
                    id: refreshed.id,
                    position: getTokenPosition(refreshed),
                    name: refreshed.name,
                    isDM: true
                };
                lastResolvedCaster = refreshedCaster;
                return refreshedCaster;
            }
        }

        const defaultCasters = getSettingsValue(LOCAL_STORAGE_KEYS.DEFAULT_CASTER);
        if (defaultCasters && defaultCasters.length > 0) {
            const defaultItem = characterItems.find(item => item.id === defaultCasters[0].id);
            if (defaultItem) {
                const casterInfo: ActiveCasterInfo = {
                    item: defaultItem,
                    id: defaultItem.id,
                    position: getTokenPosition(defaultItem),
                    name: defaultItem.name,
                    isDM: true
                };
                lastResolvedCaster = casterInfo;
                return casterInfo;
            }
        }

        if (characterItems.length > 0) {
            const first = characterItems[0];
            const casterInfo: ActiveCasterInfo = {
                item: first,
                id: first.id,
                position: getTokenPosition(first),
                name: first.name,
                isDM: true
            };
            lastResolvedCaster = casterInfo;
            return casterInfo;
        }

        return null;
    }

    // =========================================================================
    // 2. PLAYER RESOLUTION (Perspective Viewing & Character Fallback)
    // =========================================================================
    const ownedTokens = await getPlayerOwnedTokens(playerID, characterItems);

    // A. If the player selected a single valid character token (own character, ally, or token to view):
    // Resolve that token so the player can see its vision POV and perspective!
    if (selection && selection.length === 1) {
        const selected = characterItems.find(item => item.id === selection[0]);
        if (selected) {
            const casterInfo: ActiveCasterInfo = {
                item: selected,
                id: selected.id,
                position: getTokenPosition(selected),
                name: selected.name,
                isDM: false
            };
            lastResolvedCaster = casterInfo;
            return casterInfo;
        }
        // If selection is NOT a valid character token (e.g. darkness zone, spell effect, prop),
        // ignore it and fall through to player's own character token!
    }

    // B. If no character token selected, fallback to player's primary or owned character:
    if (ownedTokens.length > 0) {
        // Return primary bound character
        const primary = await getMyPrimaryCharacterToken(playerID, characterItems);
        if (primary) {
            const casterInfo: ActiveCasterInfo = {
                item: primary,
                id: primary.id,
                position: getTokenPosition(primary),
                name: primary.name,
                isDM: false
            };
            lastResolvedCaster = casterInfo;
            return casterInfo;
        }

        const firstOwned = ownedTokens[0];
        const casterInfo: ActiveCasterInfo = {
            item: firstOwned,
            id: firstOwned.id,
            position: getTokenPosition(firstOwned),
            name: firstOwned.name,
            isDM: false
        };
        lastResolvedCaster = casterInfo;
        return casterInfo;
    }

    // =========================================================================
    // 3. FALLBACK (Player has no claimed/bound tokens yet)
    // =========================================================================
    // Match linked DDB character token
    const cachedDDBChars = getAllCachedDDBCharacters();
    if (cachedDDBChars.length > 0) {
        for (const char of cachedDDBChars) {
            const matchedToken = characterItems.find(
                item => getLinkedDDBCharacterId(item) === char.id || (char.name && item.name?.toLowerCase() === char.name.toLowerCase())
            );
            if (matchedToken) {
                const casterInfo: ActiveCasterInfo = {
                    item: matchedToken,
                    id: matchedToken.id,
                    position: getTokenPosition(matchedToken),
                    name: matchedToken.name || char.name,
                    isDM: false
                };
                lastResolvedCaster = casterInfo;
                return casterInfo;
            }
        }
    }

    // If selection exists
    if (selection && selection.length === 1) {
        const selected = characterItems.find(item => item.id === selection[0]);
        if (selected) {
            const casterInfo: ActiveCasterInfo = {
                item: selected,
                id: selected.id,
                position: getTokenPosition(selected),
                name: selected.name,
                isDM: false
            };
            lastResolvedCaster = casterInfo;
            return casterInfo;
        }
    }

    // Single character token on the scene
    if (characterItems.length === 1) {
        const single = characterItems[0];
        const casterInfo: ActiveCasterInfo = {
            item: single,
            id: single.id,
            position: getTokenPosition(single),
            name: single.name,
            isDM: false
        };
        lastResolvedCaster = casterInfo;
        return casterInfo;
    }

    return null;
}
