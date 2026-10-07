import { Vector2, Item } from "@owlbear-rodeo/sdk";
import { DarknessZone, TokenVisionRules, VisionCheckResult } from "../domain/vision";
import { GridInfo, Point3D, distance3DFeet, doesSegmentIntersectSphere3D } from "../domain/targetingGeometry";
import { APP_KEY } from "../../../config";
import { getLinkedDDBCharacterId, getCachedDDBCharacter, findCachedDDBCharacter } from "../../../services/ddbService";
import { getTokenBuffs } from "../../../services/buffService";

export const DARKNESS_ZONE_METADATA_KEY = `${APP_KEY}/darkness-zone`;
export const TOKEN_VISION_METADATA_KEY = `${APP_KEY}/vision`;
export const EFFECT_METADATA_KEY = `${APP_KEY}/effect-id`;
export const SPELL_METADATA_KEY = `${APP_KEY}/spell-id`;
export const ELEVATION_METADATA_KEY = `${APP_KEY}/elevation`;

/**
 * Reads token elevation (in feet) from standard Owlbear Rodeo extensions,
 * Embers elevation metadata, or active Fly buffs. Defaults to 0 (ground level).
 */
export function readTokenElevation(item: Item | null | undefined): number {
    if (!item?.metadata) return 0;

    // 1. Embers elevation key
    const embersEle = item.metadata[ELEVATION_METADATA_KEY];
    if (typeof embersEle === "number") return embersEle;
    if (typeof embersEle === "string" && !isNaN(Number(embersEle))) return Number(embersEle);

    // 2. Official Owlbear Rodeo Elevation extension
    const obrEle = item.metadata["rodeo.owlbear.elevation/elevation"];
    if (typeof obrEle === "number") return obrEle;
    if (typeof obrEle === "string" && !isNaN(Number(obrEle))) return Number(obrEle);

    // 3. Battle-System elevation extension
    const bsEle = item.metadata["com.battle-system.elevation/elevation"];
    if (typeof bsEle === "number") return bsEle;
    if (typeof bsEle === "object" && bsEle !== null && typeof (bsEle as any).elevation === "number") {
        return (bsEle as any).elevation;
    }

    // 4. Generic elevation / altitude property
    const genEle = item.metadata["elevation"] ?? item.metadata["altitude"];
    if (typeof genEle === "number") return genEle;
    if (typeof genEle === "string" && !isNaN(Number(genEle))) return Number(genEle);

    // 5. Active Fly buff
    const buffs = getTokenBuffs(item);
    const hasFlyBuff = buffs.some(b => b.name?.toLowerCase().includes("fly") || b.id?.toLowerCase().includes("fly"));
    if (hasFlyBuff) return 30;

    return 0;
}

/**
 * Validates whether an OBR item is an attackable character or creature token.
 * Prevents darkness zones, spell effects, and attachments from being targeted as combat targets.
 */
export function isValidCombatTargetToken(item: Item | undefined | null): boolean {
    if (!item) return false;
    const isCharacterOrDrawing = item.layer === "CHARACTER" || item.layer === "DRAWING";
    const isStandaloneAttachment = item.layer === "ATTACHMENT" && (item as any).attachedTo === undefined && item.type === "IMAGE";
    if (!isCharacterOrDrawing && !isStandaloneAttachment) return false;
    if (item.metadata?.[DARKNESS_ZONE_METADATA_KEY] !== undefined) return false;
    if (item.metadata?.[EFFECT_METADATA_KEY] !== undefined) return false;
    if (item.metadata?.[SPELL_METADATA_KEY] !== undefined) return false;
    return true;
}

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
 * Supports 3D elevation coordinates (in feet).
 */
export function doesSegmentIntersectDarkness(
    casterPos: Vector2,
    targetPos: Vector2,
    darkness: DarknessZone,
    grid: GridInfo,
    casterElevation: number = 0,
    targetElevation: number = 0
): boolean {
    const caster3D: Point3D = { x: casterPos.x, y: casterPos.y, z: casterElevation };
    const target3D: Point3D = { x: targetPos.x, y: targetPos.y, z: targetElevation };
    const sphereCenter: Point3D = { x: darkness.position.x, y: darkness.position.y, z: 0 };
    return doesSegmentIntersectSphere3D(caster3D, target3D, sphereCenter, darkness.radiusFeet, grid);
}

/**
 * Checks if a given Darkness zone originated from the specified creature / token / player.
 */
export function isDarknessZoneFromCaster(
    zone: DarknessZone,
    creature: {
        id?: string;
        playerId?: string;
        characterId?: string | number;
        metadata?: Record<string, unknown>;
    }
): boolean {
    if (!zone) return false;

    // 1. Direct Token ID match (highest precision)
    if (zone.sourceCasterId && creature.id && zone.sourceCasterId === creature.id) {
        return true;
    }

    // 2. Character ID match (D&D Beyond Character ID, e.g. 170182790)
    const charId = creature.characterId ?? (creature.metadata ? getLinkedDDBCharacterId({ metadata: creature.metadata }) : undefined);
    if (zone.sourceCharacterId && charId && String(zone.sourceCharacterId) === String(charId)) {
        return true;
    }

    return false;
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
        playerId?: string;
        characterId?: string | number;
        visionRules?: TokenVisionRules;
        opacityMode?: "dynamic" | "always-transparent" | "always-opaque";
        casterElevation?: number;
        targetElevation?: number;
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

    const casterElevation = options.casterElevation ?? 0;
    const targetElevation = options.targetElevation ?? 0;
    const caster3D: Point3D = { x: casterPos.x, y: casterPos.y, z: casterElevation };
    const target3D: Point3D = { x: targetPos.x, y: targetPos.y, z: targetElevation };
    const distFeet = distance3DFeet(caster3D, target3D, grid);

    // Check if target is inside any darkness zone in 3D
    const targetInDarkness = darknessZones.some(zone => {
        const center3D: Point3D = { x: zone.position.x, y: zone.position.y, z: 0 };
        return distance3DFeet(target3D, center3D, grid) <= zone.radiusFeet;
    });

    // Check if caster is inside any darkness zone in 3D
    const casterInDarkness = darknessZones.some(zone => {
        const center3D: Point3D = { x: zone.position.x, y: zone.position.y, z: 0 };
        return distance3DFeet(caster3D, center3D, grid) <= zone.radiusFeet;
    });

    // Find any darkness zone intersecting the sight line in 3D
    const obstructingZone = darknessZones.find(zone =>
        doesSegmentIntersectDarkness(casterPos, targetPos, zone, grid, casterElevation, targetElevation)
    );

    if (!obstructingZone) {
        return { canSee: true, isBlockedByDarkness: false, targetInDarkness, casterInDarkness };
    }

    // Zone specifically set as transparent (and room not forcing always-opaque)
    if (obstructingZone.transparent && options.opacityMode !== "always-opaque") {
        return { canSee: true, isBlockedByDarkness: false, targetInDarkness, casterInDarkness };
    }

    // Room-wide override: always opaque (blocks everyone except DM)
    if (options.opacityMode === "always-opaque") {
        return {
            canSee: false,
            reason: "Line of sight blocked by Magical Darkness (Always Opaque mode)!",
            isBlockedByDarkness: true,
            targetInDarkness,
            casterInDarkness
        };
    }

    const vision = options.visionRules || {};

    // 1. Truesight (penetrates darkness up to truesight range)
    if (vision.truesight !== undefined && distFeet <= vision.truesight) {
        return { canSee: true, reason: "Truesight", isBlockedByDarkness: false, targetInDarkness, casterInDarkness };
    }

    // 2. Devil's Sight (can see normally through darkness up to 120 ft)
    if (vision.devilsSight && distFeet <= 120) {
        return { canSee: true, reason: "Devil's Sight", isBlockedByDarkness: false, targetInDarkness, casterInDarkness };
    }

    // 3. Blind Fighting (10 ft blindsight radius around creature)
    if (vision.blindFighting !== undefined && distFeet <= vision.blindFighting) {
        return { canSee: true, reason: "Blind Fighting", isBlockedByDarkness: false, targetInDarkness, casterInDarkness };
    }

    // 4. Shadow Monk Sight (D&D 2024 / homebrew)
    if (vision.shadowMonkSight?.enabled) {
        const range = vision.shadowMonkSight.range || 60;
        const matchesSource = !vision.shadowMonkSight.sourceOnly || isDarknessZoneFromCaster(obstructingZone, {
            id: options.casterId,
            playerId: options.playerId,
            characterId: options.characterId
        });
        if (matchesSource && distFeet <= range) {
            return { canSee: true, reason: "Shadow Monk Sight", isBlockedByDarkness: false, targetInDarkness, casterInDarkness };
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
                targetInDarkness,
                casterInDarkness
            };
        }
    }

    // Line of sight blocked!
    return {
        canSee: false,
        reason: "Line of sight blocked by Magical Darkness!",
        isBlockedByDarkness: true,
        targetInDarkness,
        casterInDarkness
    };
}

/**
 * Extracts all active Darkness zones from scene items.
 */
export function extractDarknessZones(items: Item[]): DarknessZone[] {
    const zones: DarknessZone[] = [];

    for (const item of items) {
        const metadata = item.metadata[DARKNESS_ZONE_METADATA_KEY] as {
            radiusFeet?: number;
            sourceCasterId?: string;
            sourcePlayerId?: string;
            sourceCharacterId?: string | number;
            transparent?: boolean;
        } | undefined;
        const spellInfo = item.metadata[`${APP_KEY}/spell-id`] as {
            name?: string;
            caster?: string;
            casterTokenId?: string;
            characterId?: string | number;
        } | undefined;

        const effectName = (item.metadata[`${APP_KEY}/effect-id`] as string | undefined)?.toLowerCase();
        const isDarkness = Boolean(
            (metadata && typeof metadata.radiusFeet === "number") ||
            (effectName && effectName.includes("darkness")) ||
            (spellInfo?.name && spellInfo.name.toLowerCase() === "darkness")
        );

        if (!isDarkness) continue;

        const radiusFeet = metadata?.radiusFeet ?? 15;
        const isTransparent = Boolean(metadata?.transparent === true || (metadata?.transparent as unknown) === "true");
        const sourceCasterId = metadata?.sourceCasterId || spellInfo?.casterTokenId || spellInfo?.caster;
        const sourcePlayerId = metadata?.sourcePlayerId || spellInfo?.caster;
        const sourceCharacterId = metadata?.sourceCharacterId || spellInfo?.characterId;

        zones.push({
            id: item.id,
            position: item.position,
            radiusFeet,
            sourceCasterId,
            sourcePlayerId,
            sourceCharacterId,
            transparent: isTransparent
        });
    }

    return zones;
}

/**
 * Reads token vision rules from item metadata with DDB character fallback.
 */
export function readTokenVisionRules(item: Item): TokenVisionRules {
    let rules: TokenVisionRules = {};
    const meta = item.metadata[TOKEN_VISION_METADATA_KEY] as TokenVisionRules | undefined;
    if (meta && Object.keys(meta).length > 0) {
        rules = { ...meta };
    } else {
        // Fallback: check linked cached DDB character
        const charId = getLinkedDDBCharacterId(item);
        if (charId) {
            const ddbChar = getCachedDDBCharacter(charId);
            if (ddbChar?.senses) {
                rules = { ...ddbChar.senses };
            }
        }
        if (Object.keys(rules).length === 0 && item.name) {
            const ddbChar = findCachedDDBCharacter(item.name);
            if (ddbChar?.senses) {
                rules = { ...ddbChar.senses };
            }
        }
    }

    // Always enforce: Shadow Monk Sight can ONLY see through their own Darkness (2024 PHB)
    if (rules.shadowMonkSight?.enabled) {
        rules.shadowMonkSight = {
            ...rules.shadowMonkSight,
            sourceOnly: true,
            range: rules.shadowMonkSight.range || 60
        };
    }

    return rules;
}
