import OBR, { Item, Vector2, isImage } from "@owlbear-rodeo/sdk";
import { LOCAL_STORAGE_KEYS, getSettingsValue } from "../../../../components/Settings/settings";
import { getLinkedDDBCharacterId, getAllCachedDDBCharacters } from "../../../../services/ddbService";

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
 * Priority:
 * 1. Current player selection (if exactly one character token is selected)
 * 2. Last resolved active caster (if still present on scene)
 * 3. Default Caster from local settings
 * 4. Token linked to cached/synced D&D Beyond character
 * 5. Owned character token (if player owns character on the scene)
 * 6. Single character token on the scene (for player)
 */
export async function resolveActiveCaster(
    playerRole: "GM" | "PLAYER",
    playerID: string
): Promise<ActiveCasterInfo | null> {
    const isDM = playerRole === "GM";

    // 1. Check current selection
    const selection = await OBR.player.getSelection();
    if (selection && selection.length === 1) {
        const selectedItems = await OBR.scene.items.getItems(selection);
        const selected = selectedItems[0];
        if (selected && (selected.layer === "CHARACTER" || (isImage(selected) && selected.layer !== "DRAWING"))) {
            const tokenPosition = getTokenPosition(selected);
            const casterInfo: ActiveCasterInfo = {
                item: selected,
                id: selected.id,
                position: tokenPosition,
                name: selected.name,
                isDM
            };
            lastResolvedCaster = casterInfo;
            return casterInfo;
        }
    }

    // 2. Check if last resolved active caster is still present on scene
    if (lastResolvedCaster?.id) {
        try {
            const matched = await OBR.scene.items.getItems([lastResolvedCaster.id]);
            if (matched && matched.length > 0 && matched[0]) {
                const refreshed = matched[0];
                const refreshedCaster: ActiveCasterInfo = {
                    item: refreshed,
                    id: refreshed.id,
                    position: getTokenPosition(refreshed),
                    name: refreshed.name,
                    isDM
                };
                lastResolvedCaster = refreshedCaster;
                return refreshedCaster;
            }
        } catch {
            // Ignore error and fall through
        }
    }

    // 3. Fallback: Check Default Caster in Local Settings
    const defaultCasters = getSettingsValue(LOCAL_STORAGE_KEYS.DEFAULT_CASTER);
    if (defaultCasters && defaultCasters.length > 0) {
        const defaultCasterId = defaultCasters[0].id;
        const matched = await OBR.scene.items.getItems([defaultCasterId]);
        if (matched && matched.length > 0) {
            const defaultItem = matched[0];
            const tokenPosition = getTokenPosition(defaultItem);
            const casterInfo: ActiveCasterInfo = {
                item: defaultItem,
                id: defaultItem.id,
                position: tokenPosition,
                name: defaultItem.name,
                isDM
            };
            lastResolvedCaster = casterInfo;
            return casterInfo;
        }
    }

    // 4. Fallback: Match any scene token linked to cached D&D Beyond characters
    const sceneItems = await OBR.scene.items.getItems();
    const characterItems = sceneItems.filter(
        item => item.layer === "CHARACTER" || (isImage(item) && item.layer !== "DRAWING" && item.layer !== "MAP")
    );

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
                    isDM
                };
                lastResolvedCaster = casterInfo;
                return casterInfo;
            }
        }
    }

    // 5. If player (not GM) and no selection, find token owned by this player
    if (!isDM) {
        const ownedCharacters = characterItems.filter(
            item => item.createdUserId === playerID
        );
        if (ownedCharacters.length === 1) {
            const owned = ownedCharacters[0];
            const tokenPosition = getTokenPosition(owned);
            const casterInfo: ActiveCasterInfo = {
                item: owned,
                id: owned.id,
                position: tokenPosition,
                name: owned.name,
                isDM: false
            };
            lastResolvedCaster = casterInfo;
            return casterInfo;
        }

        // 6. If player and there is exactly 1 character token on scene, default to it
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
    }

    return null;
}
