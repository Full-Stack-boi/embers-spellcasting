import OBR, { Vector2 } from "@owlbear-rodeo/sdk";
import { APP_KEY } from "../../../../config";
import { GLOBAL_STORAGE_KEYS, getGlobalSettingsValue } from "../../../../components/Settings/settings";
import {
    DARKNESS_ZONE_METADATA_KEY,
    EFFECT_METADATA_KEY,
    SPELL_METADATA_KEY,
    extractDarknessZones,
    isDarknessZoneFromCaster,
    readTokenElevation,
    readTokenVisionRules
} from "../../application/lineOfSightService";
import { resolveActiveCaster } from "./activeCasterResolver";
import { getLinkedDDBCharacterId } from "../../../../services/ddbService";
import { buildEffectImage, getEffect } from "../../../../effects/effects";
import { DarknessZone } from "../../domain/vision";

export const darknessToggleMenuId = `${APP_KEY}/darkness-toggle-menu`;

// Track active local fog item IDs created by this client and their current effect variant
const activeLocalFogIds = new Set<string>();
const activeLocalFogEffects = new Map<string, string>();

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
    creatureItem: any,
    activePlayerId?: string
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

    // 4. Shadow Monk Sight (D&D 2024: only own darkness)
    if (vision.shadowMonkSight?.enabled) {
        const range = vision.shadowMonkSight.range || 60;
        const matchesSource = !vision.shadowMonkSight.sourceOnly || isDarknessZoneFromCaster(zone, {
            id: creatureItem?.id,
            playerId: activePlayerId,
            characterId: creatureItem ? getLinkedDDBCharacterId(creatureItem) ?? undefined : undefined,
            metadata: creatureItem?.metadata
        });
        if (matchesSource && distFeet <= range) {
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
    const currentZoneIds = new Set(darknessZones.map(z => z.id));

    // Auto-migrate any existing Darkness zone items on the scene so they are draggable
    const zonesToUnlock = sceneItems.filter(item => {
        const isDarkness = currentZoneIds.has(item.id);
        return isDarkness && (item.disableHit === true || item.locked === true || item.layer === "ATTACHMENT");
    });
    if (zonesToUnlock.length > 0) {
        OBR.scene.items.updateItems(zonesToUnlock.map(z => z.id), items => {
            for (const it of items) {
                it.disableHit = false;
                it.locked = false;
                it.layer = "CHARACTER";
                it.zIndex = -1;
            }
        }).catch(console.error);
    }

    // Synchronize token layer and zIndex based on flight elevation:
    // Flying tokens (elevation > 15 ft) -> layer: "ATTACHMENT", zIndex: 10 (above darkness shroud overlay)
    // Ground tokens (elevation <= 15 ft) -> layer: "CHARACTER", zIndex: 0 (under darkness shroud overlay)
    const tokensToUpdateElevation: { id: string; targetLayer: "CHARACTER" | "ATTACHMENT"; targetZIndex: number }[] = [];
    for (const item of sceneItems) {
        if (
            (item.layer === "CHARACTER" || (item.layer === "ATTACHMENT" && (item as any).attachedTo === undefined && item.type === "IMAGE")) &&
            !currentZoneIds.has(item.id) &&
            item.metadata?.[EFFECT_METADATA_KEY] === undefined &&
            item.metadata?.[SPELL_METADATA_KEY] === undefined
        ) {
            const elevation = readTokenElevation(item);
            const targetLayer = elevation > 15 ? "ATTACHMENT" : "CHARACTER";
            const targetZIndex = elevation > 15 ? 10 : 0;
            if (item.layer !== targetLayer || item.zIndex !== targetZIndex) {
                if (item.zIndex === undefined || item.zIndex === 0 || item.zIndex === 10) {
                    tokensToUpdateElevation.push({ id: item.id, targetLayer, targetZIndex });
                }
            }
        }
    }
    if (tokensToUpdateElevation.length > 0) {
        const updateMap = new Map(tokensToUpdateElevation.map(u => [u.id, u]));
        OBR.scene.items.updateItems(Array.from(updateMap.keys()), draft => {
            for (const it of draft) {
                const u = updateMap.get(it.id);
                if (u !== undefined) {
                    it.layer = u.targetLayer;
                    it.zIndex = u.targetZIndex;
                }
            }
        }).catch(console.error);
    }

    // Remove local fog for zones that were removed from the scene or legacy disc items
    for (const localId of Array.from(activeLocalFogIds)) {
        if (localId.includes("-disc-")) {
            await OBR.scene.local.deleteItems([localId]);
            activeLocalFogIds.delete(localId);
            activeLocalFogEffects.delete(localId);
            continue;
        }
        const zoneId = localId.replace("embers-darkness-fog-", "");
        if (!currentZoneIds.has(zoneId)) {
            await OBR.scene.local.deleteItems([localId]);
            activeLocalFogIds.delete(localId);
            activeLocalFogEffects.delete(localId);
        }
    }

    if (darknessZones.length === 0) return;

    // Resolve active character token: if GM, resolve selected token to preview what that token sees; if PLAYER, resolve player token / active perspective
    const activeCaster = await resolveActiveCaster(playerRole, playerId);

    for (const zone of darknessZones) {
        const fogId = `embers-darkness-fog-${zone.id}`;

        let canSee = false;
        if (activeMode === "always-opaque") {
            canSee = false;
        } else if (activeMode === "always-transparent" || zone.transparent) {
            canSee = true;
        } else if (isGM && (!selection || selection.length === 0)) {
            canSee = true;
        } else if (activeCaster) {
            canSee = await canCreatureSeeInDarkness(activeCaster.position, zone, activeCaster.item, playerId);
        }

        // VTT usability: if the viewer's own token is physically inside this darkness zone,
        // show transparent (75%) so they can still see where their token is.
        // D&D rules still apply — the creature is blinded by darkness for combat purposes.
        if (!canSee && activeMode !== "always-opaque" && activeCaster) {
            const distToZoneFeet = await calculateDistanceFeet(activeCaster.position, zone.position);
            if (distToZoneFeet <= zone.radiusFeet) {
                canSee = true;
            }
        }

        if (canSee) {
            // When the viewer CAN see in darkness (Devil's Sight, Shadow Monk in own darkness, GM, etc.):
            // Do NOT spawn a duplicate smoke overlay on OBR.scene.local!
            // The base Darkness item on OBR.scene.items already provides the single ambient smoke layer.
            // Removing the local fog overlay prevents 2x smoke stacking (94% opacity) and keeps tokens inside visible.
            if (activeLocalFogIds.has(fogId)) {
                await OBR.scene.local.deleteItems([fogId]).catch(() => {});
                activeLocalFogIds.delete(fogId);
                activeLocalFogEffects.delete(fogId);
            }
            continue;
        }

        const isGreen = sceneItems.some(it => it.id === zone.id && ((it.metadata?.[`${APP_KEY}/effect-id`] as string | undefined)?.includes("green") || (it.metadata?.[`${APP_KEY}/spell-id`] as any)?.id?.includes("green")));
        const desiredEffect = isGreen ? "darkness.green.opaque" : "darkness.black.opaque";

        const currentEffect = activeLocalFogEffects.get(fogId);

        if (activeLocalFogIds.has(fogId) && currentEffect !== desiredEffect) {
            await OBR.scene.local.deleteItems([fogId]);
            activeLocalFogIds.delete(fogId);
            activeLocalFogEffects.delete(fogId);
        }

        if (!activeLocalFogIds.has(fogId)) {
            await OBR.scene.local.deleteItems([fogId]).catch(() => {});
            const effect = getEffect(desiredEffect);
            if (effect) {
                const sizeCells = (zone.radiusFeet * 2) / 5;
                const result = buildEffectImage(
                    desiredEffect,
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
                    1
                );
                if (result) {
                    const fogImage = result.image
                        .id(fogId)
                        .layer("ATTACHMENT")
                        .zIndex(1)
                        .locked(true)
                        .disableHit(true)
                        .build();
                    await OBR.scene.local.addItems([fogImage]);
                    activeLocalFogIds.add(fogId);
                    activeLocalFogEffects.set(fogId, desiredEffect);
                }
            }
        } else {
            // Keep local fog position synced with zone position if it moved
            await OBR.scene.local.updateItems([fogId], draft => {
                for (const item of draft) {
                    if (item.position.x !== zone.position.x || item.position.y !== zone.position.y) {
                        item.position = zone.position;
                    }
                }
            });
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
