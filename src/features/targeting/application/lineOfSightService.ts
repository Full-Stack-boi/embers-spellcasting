import { Vector2, Item } from "@owlbear-rodeo/sdk";
import { DarknessZone, TokenVisionRules, VisionCheckResult } from "../domain/vision";
import { GridInfo } from "../domain/targetingGeometry";
import { APP_KEY } from "../../../config";

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
    } = {}
): VisionCheckResult {
    // DM always has unhindered vision
    if (options.isDM) {
        return { canSee: true, isBlockedByDarkness: false };
    }

    if (!darknessZones || darknessZones.length === 0) {
        return { canSee: true, isBlockedByDarkness: false };
    }

    // Distance between caster and target in feet
    const dx = targetPos.x - casterPos.x;
    const dy = targetPos.y - casterPos.y;
    const distFeet = (Math.sqrt(dx * dx + dy * dy) / grid.dpi) * grid.scaleMultiplier;

    // Find any darkness zone intersecting the sight line
    const obstructingZone = darknessZones.find(zone =>
        doesSegmentIntersectDarkness(casterPos, targetPos, zone, grid)
    );

    if (!obstructingZone) {
        return { canSee: true, isBlockedByDarkness: false };
    }

    const vision = options.visionRules || {};

    // 1. Truesight
    if (vision.truesight !== undefined && distFeet <= vision.truesight) {
        return { canSee: true, reason: "Truesight", isBlockedByDarkness: false };
    }

    // 2. Devil's Sight (can see normally through darkness up to 120 ft)
    if (vision.devilsSight && distFeet <= 120) {
        return { canSee: true, reason: "Devil's Sight", isBlockedByDarkness: false };
    }

    // 3. Blind Fighting (10 ft blindsight)
    if (vision.blindFighting !== undefined && distFeet <= vision.blindFighting) {
        return { canSee: true, reason: "Blind Fighting", isBlockedByDarkness: false };
    }

    // 4. Shadow Monk Sight (D&D 2024 / homebrew)
    if (vision.shadowMonkSight?.enabled) {
        const range = vision.shadowMonkSight.range || 60;
        const matchesSource = !vision.shadowMonkSight.sourceOnly || obstructingZone.sourceCasterId === options.casterId;
        if (matchesSource && distFeet <= range) {
            return { canSee: true, reason: "Shadow Monk Sight", isBlockedByDarkness: false };
        }
    }

    // 5. Custom Sense / DM override
    if (vision.customDarknessVision?.canSeeInMagicalDarkness) {
        const maxRange = vision.customDarknessVision.maxRange || 120;
        if (distFeet <= maxRange) {
            return {
                canSee: true,
                reason: vision.customDarknessVision.description || "Custom Senses",
                isBlockedByDarkness: false
            };
        }
    }

    // Line of sight blocked!
    return {
        canSee: false,
        reason: "Line of sight blocked by Magical Darkness!",
        isBlockedByDarkness: true
    };
}

/**
 * Extracts all active Darkness zones from scene items.
 */
export function extractDarknessZones(items: Item[]): DarknessZone[] {
    const zones: DarknessZone[] = [];

    for (const item of items) {
        const metadata = item.metadata[DARKNESS_ZONE_METADATA_KEY] as { radiusFeet?: number; sourceCasterId?: string } | undefined;
        if (metadata && typeof metadata.radiusFeet === "number") {
            zones.push({
                id: item.id,
                position: item.position,
                radiusFeet: metadata.radiusFeet,
                sourceCasterId: metadata.sourceCasterId
            });
        }
    }

    return zones;
}

/**
 * Reads token vision rules from item metadata.
 */
export function readTokenVisionRules(item: Item): TokenVisionRules {
    const meta = item.metadata[TOKEN_VISION_METADATA_KEY] as TokenVisionRules | undefined;
    return meta || {};
}
