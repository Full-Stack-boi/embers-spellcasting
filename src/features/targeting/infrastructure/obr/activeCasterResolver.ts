import OBR, { Item, Vector2, isImage } from "@owlbear-rodeo/sdk";
import { LOCAL_STORAGE_KEYS, getSettingsValue } from "../../../../components/Settings/settings";

export interface ActiveCasterInfo {
    item: Item;
    id: string;
    position: Vector2;
    name?: string;
    isDM: boolean;
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
 * 2. Owned character token (if player owns exactly one character on the scene)
 * 3. Default Caster from local settings
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
            return {
                item: selected,
                id: selected.id,
                position: tokenPosition,
                name: selected.name,
                isDM
            };
        }
    }

    // 2. If player (not GM) and no selection, find token owned by this player
    if (!isDM) {
        const sceneItems = await OBR.scene.items.getItems();
        const ownedCharacters = sceneItems.filter(
            item => item.layer === "CHARACTER" && item.createdUserId === playerID
        );
        if (ownedCharacters.length === 1) {
            const owned = ownedCharacters[0];
            const tokenPosition = getTokenPosition(owned);
            return {
                item: owned,
                id: owned.id,
                position: tokenPosition,
                name: owned.name,
                isDM: false
            };
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
            return {
                item: defaultItem,
                id: defaultItem.id,
                position: tokenPosition,
                name: defaultItem.name,
                isDM
            };
        }
    }

    return null;
}
