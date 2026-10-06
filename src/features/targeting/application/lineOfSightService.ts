import { Vector2, Item } from "@owlbear-rodeo/sdk";
import { DarknessZone, TokenVisionRules, VisionCheckResult } from "../domain/vision";
import { GridInfo } from "../domain/targetingGeometry";
import { APP_KEY } from "../../../config";
import { getLinkedDDBCharacterId, getCachedDDBCharacter, findCachedDDBCharacter } from "../../../services/ddbService";

export const DARKNESS_ZONE_METADATA_KEY = `${APP_KEY}/darkness-zone`;
export const TOKEN_VISION_METADATA_KEY = `${APP_KEY}/vision`;

/**
 * Calculates distance from point C to the line segment AB in feet.
 */
export function distancePointToSegmentFeet(
    c: Vector2,
    a: Vector2,
    b: Vector2,
    grid: GridInfo
): number {
    const abX = b.x - a.x;
    const abY = b.y - a.y;
    const lenSq = abX * abX + abY * abY;

    if (lenSq === 0) {
        const dx = c.x - a.x;
        const dy = c.y - a.y;
        const distPx = Math.sqrt(dx * dx + dy * dy);
        return (distPx / grid.dpi) * grid.scaleMultiplier;
    }

    const t = Math.max(0, Math.min(1, ((c.x - a.x) * abX + (c.y - a.y) * abY) / lenSq));
    const projX = a.x + t * abX;
    const projY = a.y + t * abY;

    const dx = c.x - projX;
    const dy = c.y - projY;
    const distPx = Math.sqrt(dx * dx + dy * dy);
    return (distPx / grid.dpi) * grid.scaleMultiplier;
}

/**
 * Checks if a line of sight segment between caster and target is obstructed by a darkness zone.
 */
export function doesSegmentIntersectDarkness(
    casterPos: Vector2,
    targetPos: Vector2,
    darkness: DarknessZone,
    grid: GridInfo
): boolean {
    const distToCenterFeet = distancePointToSegmentFeet(darkness.position, casterPos, targetPos, grid);
    return distToCenterFeet <= darkness.radiusFeet;
}

/**
 * Resolves whether the caster can see the target through any magical darkness zones present.
 */
export function evaluateLineOfSight(
    casterPos: Vector2,
    targetPos: Vector2,
    darknessZones: DarknessZone[],
    grid: GridInfo,
    options: {
        isDM?: boolean;
        casterId?: string;
        visionRules?: TokenVisionRules;
        opacityMode?: "dynamic" | "always-transparent" | "always-opaque";
    } = {}
): VisionCheckResult {
    // DM always has unhindered vision
    if (options.isDM) {
        return { canSee: true, isBlockedByDarkness: false };
    }

    // Room-wide override: always transparent
    if (options.opacityMode === "always-transparent") {
        return { canSee: true, isBlockedByDarkness: false };
    }

    if (!darknessZones || darknessZones.length === 0) {
        return { canSee: true, isBlockedByDarkness: false };
    }

    // Distance between caster and target in feet
    const dx = targetPos.x - casterPos.x;
    const dy = targetPos.y - casterPos.y;
    const distFeet = (Math.sqrt(dx * dx + dy * dy) / grid.dpi) * grid.scaleMultiplier;

    // Check if target is inside any darkness zone
    const targetInDarkness = darknessZones.some(zone => {
        const tDx = targetPos.x - zone.position.x;
        const tDy = targetPos.y - zone.position.y;
        const tDistFeet = (Math.sqrt(tDx * tDx + tDy * tDy) / grid.dpi) * grid.scaleMultiplier;
        return tDistFeet <= zone.radiusFeet;
    });

    // Find any darkness zone intersecting the sight line
    const obstructingZone = darknessZones.find(zone =>
        doesSegmentIntersectDarkness(casterPos, targetPos, zone, grid)
    );

    if (!obstructingZone) {
        return { canSee: true, isBlockedByDarkness: false, targetInDarkness: false };
    }

    // Zone specifically set as transparent (and room not forcing always-opaque)
    if (obstructingZone.transparent && options.opacityMode !== "always-opaque") {
        return { canSee: true, isBlockedByDarkness: false, targetInDarkness: false };
    }

    // Room-wide override: always opaque (blocks everyone except DM)
    if (options.opacityMode === "always-opaque") {
        return {
            canSee: false,
            reason: "Line of sight blocked by Magical Darkness (Always Opaque mode)!",
            isBlockedByDarkness: true,
            targetInDarkness
        };
    }

    const vision = options.visionRules || {};

    // 1. Truesight (penetrates darkness up to truesight range)
    if (vision.truesight !== undefined && distFeet <= vision.truesight) {
        return { canSee: true, reason: "Truesight", isBlockedByDarkness: false, targetInDarkness };
    }

    // 2. Devil's Sight (can see normally through darkness up to 120 ft)
    if (vision.devilsSight && distFeet <= 120) {
        return { canSee: true, reason: "Devil's Sight", isBlockedByDarkness: false, targetInDarkness };
    }

    // 3. Blind Fighting (10 ft blindsight radius around creature)
    if (vision.blindFighting !== undefined && distFeet <= vision.blindFighting) {
        return { canSee: true, reason: "Blind Fighting", isBlockedByDarkness: false, targetInDarkness };
    }

    // 4. Shadow Monk Sight (D&D 2024 / homebrew)
    if (vision.shadowMonkSight?.enabled) {
        const range = vision.shadowMonkSight.range || 60;
        const matchesSource = !vision.shadowMonkSight.sourceOnly || obstructingZone.sourceCasterId === options.casterId;
        if (matchesSource && distFeet <= range) {
            return { canSee: true, reason: "Shadow Monk Sight", isBlockedByDarkness: false, targetInDarkness };
        }
    }

    // 5. Custom Sense / DM override
    if (vision.customDarknessVision?.canSeeInMagicalDarkness) {
        const maxRange = vision.customDarknessVision.maxRange || 120;
        if (distFeet <= maxRange) {
            return {
                canSee: true,
                reason: vision.customDarknessVision.description || "Custom Senses",
                isBlockedByDarkness: false,
                targetInDarkness
            };
        }
    }

    // Line of sight blocked!
    return {
        canSee: false,
        reason: "Line of sight blocked by Magical Darkness!",
        isBlockedByDarkness: true,
        targetInDarkness
    };
}

/**
 * Extracts all active Darkness zones from scene items.
 */
export function extractDarknessZones(items: Item[]): DarknessZone[] {
    const zones: DarknessZone[] = [];

    for (const item of items) {
        const metadata = item.metadata[DARKNESS_ZONE_METADATA_KEY] as { radiusFeet?: number; sourceCasterId?: string; transparent?: boolean } | undefined;
        if (metadata && typeof metadata.radiusFeet === "number") {
            const isTransparent = Boolean(metadata.transparent === true || (metadata.transparent as unknown) === "true");
            zones.push({
                id: item.id,
                position: item.position,
                radiusFeet: metadata.radiusFeet,
                sourceCasterId: metadata.sourceCasterId,
                transparent: isTransparent
            });
            continue;
        }

        // Also detect Embers darkness effect items by effectMetadataKey or spellMetadataKey
        const effectName = (item.metadata[`${APP_KEY}/effect-id`] as string | undefined)?.toLowerCase();
        const spellInfo = item.metadata[`${APP_KEY}/spell-id`] as { name?: string; caster?: string } | undefined;
        if (
            (effectName && effectName.includes("darkness")) ||
            (spellInfo?.name && spellInfo.name.toLowerCase() === "darkness")
        ) {
            const isTransparent = Boolean(metadata?.transparent === true || (metadata as any)?.transparent === "true");
            zones.push({
                id: item.id,
                position: item.position,
                radiusFeet: 15,
                sourceCasterId: spellInfo?.caster,
                transparent: isTransparent
            });
        }
    }

    return zones;
}

/**
 * Reads token vision rules from item metadata with DDB character fallback.
 */
export function readTokenVisionRules(item: Item): TokenVisionRules {
    const meta = item.metadata[TOKEN_VISION_METADATA_KEY] as TokenVisionRules | undefined;
    if (meta && Object.keys(meta).length > 0) {
        return meta;
    }

    // Fallback: check linked cached DDB character
    const charId = getLinkedDDBCharacterId(item);
    if (charId) {
        const ddbChar = getCachedDDBCharacter(charId);
        if (ddbChar?.senses) {
            return ddbChar.senses;
        }
    }
    if (item.name) {
        const ddbChar = findCachedDDBCharacter(item.name);
        if (ddbChar?.senses) {
            return ddbChar.senses;
        }
    }

    return {};
}
