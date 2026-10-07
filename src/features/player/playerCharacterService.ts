import OBR, { Item, BoundingBox } from "@owlbear-rodeo/sdk";
import { APP_KEY } from "../../config";
import { getLinkedDDBCharacterId, getAllCachedDDBCharacters } from "../../services/ddbService";
import { readTokenElevation } from "../targeting/application/lineOfSightService";

export const BOUND_PLAYER_METADATA_KEY = `${APP_KEY}/bound-player`;
export const PRIMARY_CHARACTER_STORAGE_KEY = `${APP_KEY}/primary-character-token-id`;
export const EFFECT_METADATA_KEY = `${APP_KEY}/effect-id`;
export const SPELL_METADATA_KEY = `${APP_KEY}/spell-id`;
export const DARKNESS_METADATA_KEY = `${APP_KEY}/darkness-zone`;

export interface BoundPlayerInfo {
    playerId: string;
    playerName?: string;
}

/**
 * Strictly verifies whether an OBR scene item is a valid playable character token.
 * Prevents spell effects, darkness zones, attachments, drawings, and maps from being treated as characters.
 */
export function isCharacterToken(item: Item): boolean {
    if (!item) return false;
    // Must be on the CHARACTER layer, or ATTACHMENT layer if it's an elevated flying token
    const isCharacterLayer = item.layer === "CHARACTER";
    const isElevatedToken = item.layer === "ATTACHMENT" && (item as any).attachedTo === undefined && item.type === "IMAGE" && readTokenElevation(item) > 15;
    if (!isCharacterLayer && !isElevatedToken) return false;
    // Must NOT have spell effect, darkness, or spell metadata
    if (item.metadata?.[EFFECT_METADATA_KEY] !== undefined) return false;
    if (item.metadata?.[SPELL_METADATA_KEY] !== undefined) return false;
    if (item.metadata?.[DARKNESS_METADATA_KEY] !== undefined) return false;
    return true;
}

/**
 * Reads bound player info from a token item's metadata.
 */
export function getBoundPlayer(item: Item): BoundPlayerInfo | null {
    if (!item?.metadata) return null;
    const data = item.metadata[BOUND_PLAYER_METADATA_KEY];
    if (!data) return null;

    if (typeof data === "string") {
        return { playerId: data };
    }
    if (typeof data === "object" && data !== null && "playerId" in data) {
        return data as BoundPlayerInfo;
    }
    return null;
}

/**
 * Checks whether a token item is owned by or bound to the specified player.
 */
export function isTokenOwnedByPlayer(item: Item, playerId: string): boolean {
    if (!item || !playerId) return false;
    if (!isCharacterToken(item)) return false;

    // 1. Explicit bound-player metadata has highest priority
    const bound = getBoundPlayer(item);
    if (bound) {
        return bound.playerId === playerId;
    }

    // 2. Created by this player (if not bound to anyone else)
    if (item.createdUserId === playerId) {
        return true;
    }

    // 3. Matched linked D&D Beyond character cached by this player
    const charId = getLinkedDDBCharacterId(item);
    if (charId) {
        const cachedChars = getAllCachedDDBCharacters();
        if (cachedChars.some(c => c.id === charId)) {
            return true;
        }
    }

    return false;
}

/**
 * Checks if a token is claimed/owned by another player (not myPlayerId).
 * Returns the other player's info if claimed by someone else, or null if unclaimed or owned by myPlayerId.
 */
export function getOtherClaimedPlayer(item: Item, myPlayerId: string): BoundPlayerInfo | null {
    if (!item) return null;
    const bound = getBoundPlayer(item);
    if (bound && bound.playerId && bound.playerId !== "unassigned" && bound.playerId !== myPlayerId) {
        return bound;
    }
    return null;
}

/**
 * Binds a scene token to a specific player.
 */
export async function bindTokenToPlayer(
    tokenId: string,
    playerId: string,
    playerName?: string
): Promise<void> {
    const boundInfo: BoundPlayerInfo = {
        playerId,
        playerName: playerName || "Player"
    };

    await OBR.scene.items.updateItems([tokenId], items => {
        items.forEach(item => {
            item.metadata[BOUND_PLAYER_METADATA_KEY] = boundInfo;
        });
    });

    // Store in local storage as current client's primary token if it's for this player
    try {
        const myId = await OBR.player.getId();
        if (myId === playerId) {
            localStorage.setItem(PRIMARY_CHARACTER_STORAGE_KEY, tokenId);
        }
    } catch {}
}

/**
 * Unbinds a token from any player.
 */
export async function unbindTokenFromPlayer(tokenId: string): Promise<void> {
    await OBR.scene.items.updateItems([tokenId], items => {
        items.forEach(item => {
            // Setting playerId to "unassigned" prevents createdUserId from re-claiming this token
            item.metadata[BOUND_PLAYER_METADATA_KEY] = { playerId: "unassigned" };
        });
    });

    try {
        const storedId = localStorage.getItem(PRIMARY_CHARACTER_STORAGE_KEY);
        if (storedId === tokenId) {
            localStorage.removeItem(PRIMARY_CHARACTER_STORAGE_KEY);
        }
    } catch {}
}

/**
 * Finds all character tokens on the scene owned by the specified player.
 */
export async function getPlayerOwnedTokens(
    playerId: string,
    existingItems?: Item[]
): Promise<Item[]> {
    const items = existingItems ?? (await OBR.scene.items.getItems());
    const characterItems = items.filter(isCharacterToken);

    return characterItems.filter(item => isTokenOwnedByPlayer(item, playerId));
}

/**
 * Gets the primary character token for a player on the current scene.
 */
export async function getMyPrimaryCharacterToken(
    playerId: string,
    existingItems?: Item[]
): Promise<Item | null> {
    const owned = await getPlayerOwnedTokens(playerId, existingItems);
    if (owned.length === 0) return null;

    // Check preferred stored primary token id
    try {
        const storedId = localStorage.getItem(PRIMARY_CHARACTER_STORAGE_KEY);
        if (storedId) {
            const matched = owned.find(t => t.id === storedId);
            if (matched) return matched;
        }
    } catch {}

    // Fallback: return the first owned token
    return owned[0] ?? null;
}

/**
 * Focuses the OBR camera directly on a token with smooth animation and selects it.
 */
export async function focusCameraOnToken(tokenId: string): Promise<boolean> {
    try {
        const items = await OBR.scene.items.getItems([tokenId]);
        if (!items || items.length === 0 || !items[0]) {
            OBR.notification.show("Character token not found on current scene.", "WARNING");
            return false;
        }

        const token = items[0];
        const pos = token.position;

        // Comfortable framing bounds around token
        const frameHalfSize = 350;
        const bounds: BoundingBox = {
            min: { x: pos.x - frameHalfSize, y: pos.y - frameHalfSize },
            max: { x: pos.x + frameHalfSize, y: pos.y + frameHalfSize },
            width: frameHalfSize * 2,
            height: frameHalfSize * 2,
            center: { x: pos.x, y: pos.y }
        };

        // Smooth camera animation
        await OBR.viewport.animateToBounds(bounds);

        // Select the token so the player has it highlighted/ready
        await OBR.player.select([token.id], true);

        const tokenName = token.name || "Character";
        OBR.notification.show(`Camera focused on ${tokenName}`, "INFO");
        return true;
    } catch (err) {
        console.error("Failed to focus camera on token:", err);
        return false;
    }
}

export const claimCharacterMenuId = `${APP_KEY}/claim-character-menu`;
export const unclaimCharacterMenuId = `${APP_KEY}/unclaim-character-menu`;
export const focusCameraMenuId = `${APP_KEY}/focus-camera-menu`;
export const gmAssignTokenMenuId = `${APP_KEY}/gm-assign-token-menu`;
export const gmUnassignTokenMenuId = `${APP_KEY}/gm-unassign-token-menu`;

/**
 * Registers "Set as My Character" context menu for players.
 */
export async function setupCharacterContextMenuOption(): Promise<void> {
    try {
        await OBR.contextMenu.remove(claimCharacterMenuId);
        await OBR.contextMenu.create({
            id: claimCharacterMenuId,
            icons: [{
                icon: "/embers.svg",
                label: "Set as My Character",
                filter: {
                    min: 1,
                    max: 1,
                    some: [
                        { key: "layer", value: "CHARACTER" },
                        { key: "layer", value: "ATTACHMENT" }
                    ]
                }
            }],
            onClick: async (context) => {
                const item = context.items[0];
                if (!item || !isCharacterToken(item)) {
                    OBR.notification.show("Selected item is not a character token.", "WARNING");
                    return;
                }
                const [myId, myName] = await Promise.all([OBR.player.getId(), OBR.player.getName()]);
                const otherOwner = getOtherClaimedPlayer(item, myId);
                if (otherOwner) {
                    OBR.notification.show(`This character is already claimed by ${otherOwner.playerName || "another player"}.`, "WARNING");
                    return;
                }
                await bindTokenToPlayer(item.id, myId, myName);
                OBR.notification.show(`Bound "${item.name || "Token"}" as your character!`, "SUCCESS");
            }
        });
    } catch (err) {
        console.error("Failed to setup claim character context menu:", err);
    }
}

/**
 * Registers "Remove from My Characters" context menu for players.
 */
export async function setupUnclaimContextMenuOption(): Promise<void> {
    try {
        await OBR.contextMenu.remove(unclaimCharacterMenuId);
        await OBR.contextMenu.create({
            id: unclaimCharacterMenuId,
            icons: [{
                icon: "/embers.svg",
                label: "Remove from My Characters",
                filter: {
                    min: 1,
                    max: 1,
                    some: [
                        { key: "layer", value: "CHARACTER" },
                        { key: "layer", value: "ATTACHMENT" }
                    ]
                }
            }],
            onClick: async (context) => {
                const item = context.items[0];
                if (!item) return;
                const myId = await OBR.player.getId();
                if (isTokenOwnedByPlayer(item, myId)) {
                    await unbindTokenFromPlayer(item.id);
                    OBR.notification.show(`Removed "${item.name || "Token"}" from your characters.`, "INFO");
                } else {
                    OBR.notification.show("This token is not your character.", "WARNING");
                }
            }
        });
    } catch (err) {
        console.error("Failed to setup unclaim character context menu:", err);
    }
}

/**
 * Registers "Focus Camera on Token" context menu for all users.
 */
export async function setupFocusCameraContextMenuOption(): Promise<void> {
    try {
        await OBR.contextMenu.remove(focusCameraMenuId);
        await OBR.contextMenu.create({
            id: focusCameraMenuId,
            icons: [{
                icon: "/embers.svg",
                label: "Focus Camera on Token",
                filter: {
                    min: 1,
                    max: 1,
                    some: [
                        { key: "layer", value: "CHARACTER" },
                        { key: "layer", value: "ATTACHMENT" }
                    ]
                }
            }],
            onClick: async (context) => {
                const item = context.items[0];
                if (!item) return;
                await focusCameraOnToken(item.id);
            }
        });
    } catch (err) {
        console.error("Failed to setup focus camera context menu:", err);
    }
}

/**
 * Registers "Assign Token to Player (GM)" context menu for GMs.
 */
export async function setupGMAssignContextMenuOption(): Promise<void> {
    try {
        await OBR.contextMenu.remove(gmAssignTokenMenuId);
        await OBR.contextMenu.create({
            id: gmAssignTokenMenuId,
            icons: [{
                icon: "/embers.svg",
                label: "Assign Token to Player (GM)",
                filter: {
                    roles: ["GM"],
                    min: 1,
                    max: 1,
                    some: [
                        { key: "layer", value: "CHARACTER" },
                        { key: "layer", value: "ATTACHMENT" }
                    ]
                }
            }],
            onClick: async (context) => {
                const item = context.items[0];
                if (!item || !isCharacterToken(item)) {
                    OBR.notification.show("Selected item is not a character token.", "WARNING");
                    return;
                }
                const players = await OBR.party.getPlayers();
                const nonGMPlayers = players.filter(p => p.role === "PLAYER");
                if (nonGMPlayers.length === 0) {
                    OBR.notification.show("No other players currently connected in the room.", "WARNING");
                    return;
                }
                const currentBound = getBoundPlayer(item);
                const currentIndex = nonGMPlayers.findIndex(p => p.id === currentBound?.playerId);
                const nextPlayer = nonGMPlayers[(currentIndex + 1) % nonGMPlayers.length];
                await bindTokenToPlayer(item.id, nextPlayer.id, nextPlayer.name);
                OBR.notification.show(`Assigned "${item.name || "Token"}" to ${nextPlayer.name}!`, "SUCCESS");
            }
        });
    } catch (err) {
        console.error("Failed to setup GM assign context menu:", err);
    }
}

/**
 * Registers "Unassign Character (GM)" context menu for GMs.
 */
export async function setupGMUnassignContextMenuOption(): Promise<void> {
    try {
        await OBR.contextMenu.remove(gmUnassignTokenMenuId);
        await OBR.contextMenu.create({
            id: gmUnassignTokenMenuId,
            icons: [{
                icon: "/embers.svg",
                label: "Unassign Character (GM)",
                filter: {
                    roles: ["GM"],
                    min: 1,
                    max: 1,
                    some: [
                        { key: "layer", value: "CHARACTER" },
                        { key: "layer", value: "ATTACHMENT" }
                    ]
                }
            }],
            onClick: async (context) => {
                const item = context.items[0];
                if (!item) return;
                await unbindTokenFromPlayer(item.id);
                OBR.notification.show(`Unassigned "${item.name || "Token"}" from all players.`, "INFO");
            }
        });
    } catch (err) {
        console.error("Failed to setup GM unassign context menu:", err);
    }
}

/**
 * Sets up all player character context menus.
 */
export async function setupPlayerCharacterContextMenus(): Promise<void> {
    await Promise.all([
        setupCharacterContextMenuOption(),
        setupUnclaimContextMenuOption(),
        setupFocusCameraContextMenuOption(),
        setupGMAssignContextMenuOption(),
        setupGMUnassignContextMenuOption()
    ]);
}
