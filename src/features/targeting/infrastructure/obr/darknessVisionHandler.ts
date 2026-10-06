import OBR, { Vector2 } from "@owlbear-rodeo/sdk";
import { APP_KEY } from "../../../../config";
import { GLOBAL_STORAGE_KEYS, getGlobalSettingsValue } from "../../../../components/Settings/settings";
import {
    DARKNESS_ZONE_METADATA_KEY,
    extractDarknessZones,
    readTokenVisionRules
} from "../../application/lineOfSightService";
import { resolveActiveCaster } from "./activeCasterResolver";
import { buildEffectImage, getEffect } from "../../../../effects/effects";
import { DarknessZone } from "../../domain/vision";

export const darknessToggleMenuId = `${APP_KEY}/darkness-toggle-menu`;

// Track active local fog item IDs created by this client
const activeLocalFogIds = new Set<string>();

/**
 * Calculates distance in feet between two points using scene grid settings.
 */
async function calculateDistanceFeet(posA: Vector2, posB: Vector2): Promise<number> {
    try {
        const [gridDpi, gridScale] = await Promise.all([
            OBR.scene.grid.getDpi(),
            OBR.scene.grid.getScale()
        ]);
        const dx = posB.x - posA.x;
        const dy = posB.y - posA.y;
        const distPx = Math.sqrt(dx * dx + dy * dy);
        const scaleMultiplier = gridScale?.parsed?.multiplier ?? 5;
        return (distPx / gridDpi) * scaleMultiplier;
    } catch {
        const dx = posB.x - posA.x;
        const dy = posB.y - posA.y;
        return (Math.sqrt(dx * dx + dy * dy) / 150) * 5;
    }
}

/**
 * Determines whether a creature with given vision rules can see inside or through a Darkness zone.
 */
async function canCreatureSeeInDarkness(
    creaturePos: Vector2,
    zone: DarknessZone,
    creatureItem: any
): Promise<boolean> {
    const vision = readTokenVisionRules(creatureItem);
    const distFeet = await calculateDistanceFeet(creaturePos, zone.position);

    // 1. Truesight (can see through normal and magical darkness out to truesight range)
    if (typeof vision.truesight === "number" && distFeet <= vision.truesight) {
        return true;
    }

    // 2. Devil's Sight (can see normally through darkness up to 120 ft)
    if (vision.devilsSight && distFeet <= 120) {
        return true;
    }

    // 3. Blind Fighting / Blindsight (perceives within blindsight radius, typically 10 ft)
    if (typeof vision.blindFighting === "number" && distFeet <= vision.blindFighting) {
        return true;
    }

    // 4. Shadow Monk Sight
    if (vision.shadowMonkSight?.enabled) {
        const range = vision.shadowMonkSight.range || 60;
        if (distFeet <= range) {
            return true;
        }
    }

    // 5. Custom magical darkness vision
    if (vision.customDarknessVision?.canSeeInMagicalDarkness) {
        const maxRange = vision.customDarknessVision.maxRange || 120;
        if (distFeet <= maxRange) {
            return true;
        }
    }

    return false;
}

/**
 * Synchronizes local opaque fog overlays on OBR.scene.local based on client role and character vision.
 */
export async function updateDarknessVision(): Promise<void> {
    const isReady = await OBR.scene.isReady();
    if (!isReady) return;

    const [sceneItems, playerRole, playerId, opacityMode, selection] = await Promise.all([
        OBR.scene.items.getItems(),
        OBR.player.getRole(),
        OBR.player.getId(),
        getGlobalSettingsValue(GLOBAL_STORAGE_KEYS.DARKNESS_OPACITY_MODE) as Promise<"dynamic" | "always-transparent" | "always-opaque" | undefined>,
        OBR.player.getSelection()
    ]);

    const activeMode = opacityMode ?? "dynamic";
    const darknessZones = extractDarknessZones(sceneItems);
    const isGM = playerRole === "GM";

    // If GM and no token selected: GM sees transparent version and tokens inside; remove any local opaque fog
    if (isGM && (!selection || selection.length === 0)) {
        if (activeLocalFogIds.size > 0) {
            await OBR.scene.local.deleteItems(Array.from(activeLocalFogIds));
            activeLocalFogIds.clear();
        }
        return;
    }

    // If room is set to always transparent, remove local opaque fog for all
    if (activeMode === "always-transparent") {
        if (activeLocalFogIds.size > 0) {
            await OBR.scene.local.deleteItems(Array.from(activeLocalFogIds));
            activeLocalFogIds.clear();
        }
        return;
    }

    const currentZoneIds = new Set(darknessZones.map(z => z.id));

    // Remove local fog for zones that were removed from the scene or legacy disc items
    for (const localId of Array.from(activeLocalFogIds)) {
        if (localId.includes("-disc-")) {
            await OBR.scene.local.deleteItems([localId]);
            activeLocalFogIds.delete(localId);
            continue;
        }
        const zoneId = localId.replace("embers-darkness-fog-", "");
        if (!currentZoneIds.has(zoneId)) {
            await OBR.scene.local.deleteItems([localId]);
            activeLocalFogIds.delete(localId);
        }
    }

    if (darknessZones.length === 0) return;

    // Resolve active character token: if GM, resolve selected token to preview what that token sees; if PLAYER, resolve player token
    const activeCaster = await resolveActiveCaster(playerRole, playerId);

    for (const zone of darknessZones) {
        const fogId = `embers-darkness-fog-${zone.id}`;

        // If zone has individual transparency enabled and room isn't forcing always-opaque:
        if (zone.transparent && activeMode !== "always-opaque") {
            if (activeLocalFogIds.has(fogId)) {
                await OBR.scene.local.deleteItems([fogId]);
                activeLocalFogIds.delete(fogId);
            }
            continue;
        }

        // If active token is INSIDE this Darkness zone (distance <= radius):
        // Show as transparent so player/GM can see tokens and play the game!
        const isInsideZone = activeCaster
            ? (await calculateDistanceFeet(activeCaster.position, zone.position)) <= zone.radiusFeet
            : false;

        if (isInsideZone && activeMode !== "always-opaque") {
            if (activeLocalFogIds.has(fogId)) {
                await OBR.scene.local.deleteItems([fogId]);
                activeLocalFogIds.delete(fogId);
            }
            continue;
        }

        let canSee = false;
        if (activeMode === "always-opaque") {
            canSee = false;
        } else if (activeCaster) {
            canSee = await canCreatureSeeInDarkness(activeCaster.position, zone, activeCaster.item);
        }

        if (canSee) {
            // Player / token has vision to see through darkness: remove opaque fog
            if (activeLocalFogIds.has(fogId)) {
                await OBR.scene.local.deleteItems([fogId]);
                activeLocalFogIds.delete(fogId);
            }
        } else {
            // Token is outside Darkness and cannot see through darkness: add or update opaque smoke on local scene
            if (!activeLocalFogIds.has(fogId)) {
                const effect = getEffect("darkness.black.opaque");
                if (effect) {
                    const sizeCells = (zone.radiusFeet * 2) / 5;
                    const result = buildEffectImage(
                        "darkness.black.opaque",
                        effect,
                        sizeCells,
                        { x: 0.5, y: 0.5 },
                        zone.position,
                        0,
                        undefined,
                        undefined,
                        true,
                        undefined,
                        -1,
                        1,
                        undefined,
                        "ATTACHMENT",
                        99
                    );
                    if (result) {
                        const fogImage = result.image
                            .id(fogId)
                            .layer("ATTACHMENT")
                            .zIndex(99)
                            .locked(true)
                            .disableHit(true)
                            .build();
                        await OBR.scene.local.addItems([fogImage]);
                        activeLocalFogIds.add(fogId);
                    }
                }
            } else {
                // Keep local fog position synced with zone position
                await OBR.scene.local.updateItems([fogId], draft => {
                    for (const item of draft) {
                        item.position = zone.position;
                    }
                });
            }
        }
    }
}

/**
 * Registers GM context menu option to toggle Darkness transparency on the fly.
 */
export async function setupDarknessContextMenuOption(): Promise<void> {
    try {
        await OBR.contextMenu.remove(darknessToggleMenuId);
        await OBR.contextMenu.create({
            id: darknessToggleMenuId,
            icons: [{
                icon: "/embers.svg",
                label: "Toggle Darkness Transparency (GM)",
                filter: {
                    roles: ["GM"],
                    min: 1,
                    max: 1,
                    some: [
                        { key: ["metadata", DARKNESS_ZONE_METADATA_KEY], operator: "!=", value: undefined },
                        { key: ["metadata", `${APP_KEY}/spell-id`, "name"], operator: "==", value: "Darkness" }
                    ]
                }
            }],
            onClick: async (context) => {
                const item = context.items[0];
                if (!item) return;

                const existingMeta = (item.metadata[DARKNESS_ZONE_METADATA_KEY] as Record<string, unknown>) || {};
                const currentTransparent = Boolean(existingMeta.transparent);
                const nextTransparent = !currentTransparent;

                await OBR.scene.items.updateItems([item.id], (items) => {
                    for (const it of items) {
                        const m = (it.metadata[DARKNESS_ZONE_METADATA_KEY] as Record<string, unknown>) || {};
                        it.metadata[DARKNESS_ZONE_METADATA_KEY] = {
                            ...m,
                            radiusFeet: m.radiusFeet ?? 15,
                            transparent: nextTransparent
                        };
                    }
                });

                OBR.notification.show(
                    `Darkness is now ${nextTransparent ? "Transparent (Visible)" : "Opaque (Black Fog)"}`,
                    "INFO"
                );
            }
        });
    } catch (err) {
        console.error("Failed to setup Darkness context menu:", err);
    }
}

/**
 * Initializes darkness vision handling across scene and player state changes.
 */
export function setupDarknessVisionHandler(): () => void {
    let timeout: number | null = null;
    const debouncedUpdate = () => {
        if (timeout != null) window.clearTimeout(timeout);
        timeout = window.setTimeout(() => {
            updateDarknessVision().catch(console.error);
        }, 100);
    };

    const unsubItems = OBR.scene.items.onChange(() => {
        debouncedUpdate();
    });

    const unsubPlayer = OBR.player.onChange(() => {
        debouncedUpdate();
    });

    setupDarknessContextMenuOption().catch(console.error);
    debouncedUpdate();

    return () => {
        if (timeout != null) window.clearTimeout(timeout);
        unsubItems();
        unsubPlayer();
        if (activeLocalFogIds.size > 0) {
            OBR.scene.local.deleteItems(Array.from(activeLocalFogIds)).catch(console.error);
            activeLocalFogIds.clear();
        }
    };
}
