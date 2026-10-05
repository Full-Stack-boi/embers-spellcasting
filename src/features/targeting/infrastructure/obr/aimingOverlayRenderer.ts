import OBR, { Item, Vector2, buildLabel, buildLine, buildShape } from "@owlbear-rodeo/sdk";
import { GridInfo, feetToPixels, isWithinRange, snapToCellCenter } from "../../domain/targetingGeometry";
import { VisionCheckResult } from "../../domain/vision";
import { APP_KEY } from "../../../../config";

export const AIMING_RANGE_CIRCLE_ID = `${APP_KEY}/aiming-range-circle`;
export const AIMING_TETHER_LINE_ID = `${APP_KEY}/aiming-tether-line`;
export const AIMING_DISTANCE_LABEL_ID = `${APP_KEY}/aiming-distance-label`;
export const AIMING_TARGET_CELL_ID = `${APP_KEY}/aiming-target-cell`;

export interface AimingOverlayRenderOptions {
    casterPos: Vector2;
    cursorPos: Vector2;
    maxRangeFeet: number;
    grid: GridInfo;
    rangeMultiplier?: number;
    colorBlindMode?: boolean;
    visionCheck?: VisionCheckResult;
}

export interface AimingOverlayRenderResult {
    withinRange: boolean;
    currentDistanceFeet: number;
    maxRangeFeet: number;
    canSee: boolean;
    reason?: string;
}

/**
 * Renders or updates the BG3-style range circle, tether line, and distance pill HUD.
 * All items are rendered on OBR.scene.local (private to this player's screen).
 */
export async function renderAimingOverlay(state: AimingOverlayRenderOptions): Promise<AimingOverlayRenderResult> {
    const { casterPos, cursorPos, maxRangeFeet, grid, rangeMultiplier = 1, colorBlindMode = false, visionCheck } = state;
    const rangeCheck = isWithinRange(casterPos, cursorPos, maxRangeFeet, grid, rangeMultiplier);
    const canSee = visionCheck ? visionCheck.canSee : true;
    const isValid = rangeCheck.withinRange && canSee;

    const rangePixels = feetToPixels(rangeCheck.effectiveMaxRangeFeet, grid.dpi, grid.scaleMultiplier);

    // Color definitions
    const validColor = colorBlindMode ? "#38bdf8" : "#38bdf8"; // Cyan / Light Blue
    const invalidColor = colorBlindMode ? "#ea580c" : "#ef4444"; // Deep Orange for color blind / Red standard

    const strokeColor = isValid ? validColor : invalidColor;
    const strokeDash = isValid ? [] : [14, 10]; // Solid if valid, dashed if invalid

    // 1. Range Circle (centered on caster)
    const rangeCircle = buildShape()
        .id(AIMING_RANGE_CIRCLE_ID)
        .shapeType("CIRCLE")
        .position(casterPos)
        .width(rangePixels * 2)
        .height(rangePixels * 2)
        .strokeColor(strokeColor)
        .strokeWidth(2)
        .strokeOpacity(0.4)
        .fillColor(strokeColor)
        .fillOpacity(0.04)
        .disableHit(true)
        .locked(true)
        .layer("ATTACHMENT")
        .build();

    // 2. Tether Line (from caster to cursor)
    const tetherLine = buildLine()
        .id(AIMING_TETHER_LINE_ID)
        .startPosition(casterPos)
        .endPosition(cursorPos)
        .strokeColor(strokeColor)
        .strokeWidth(isValid ? 4 : 3)
        .strokeOpacity(isValid ? 0.9 : 0.75)
        .strokeDash(strokeDash)
        .disableHit(true)
        .locked(true)
        .layer("ATTACHMENT")
        .build();

    // 3. Distance Pill Label (near cursor)
    let textLabel = `${rangeCheck.currentDistanceFeet} ft / ${rangeCheck.effectiveMaxRangeFeet} ft`;
    if (!rangeCheck.withinRange) {
        textLabel = `❌ ${rangeCheck.currentDistanceFeet} ft / ${rangeCheck.effectiveMaxRangeFeet} ft (Out of range)`;
    } else if (!canSee) {
        textLabel = `⚠️ ${rangeCheck.currentDistanceFeet} ft / ${rangeCheck.effectiveMaxRangeFeet} ft (${visionCheck?.reason || "Blocked"})`;
    }

    // Position label slightly above cursor
    const labelPos: Vector2 = {
        x: cursorPos.x + 20,
        y: cursorPos.y - 30
    };

    const distanceLabel = buildLabel()
        .id(AIMING_DISTANCE_LABEL_ID)
        .position(labelPos)
        .plainText(textLabel)
        .fontSize(14)
        .padding(8)
        .cornerRadius(6)
        .fillColor(isValid ? "#ffffff" : "#fca5a5")
        .backgroundColor(isValid ? "#0f172a" : "#450a0a")
        .backgroundOpacity(0.9)
        .disableHit(true)
        .locked(true)
        .layer("ATTACHMENT")
        .build();

    // 4. Target Cell Highlight (subtle grid cell indicator)
    const targetCellCenter = snapToCellCenter(cursorPos, grid);
    const targetCellShape = buildShape()
        .id(AIMING_TARGET_CELL_ID)
        .shapeType("RECTANGLE")
        .position({
            x: targetCellCenter.x - grid.dpi / 2,
            y: targetCellCenter.y - grid.dpi / 2
        })
        .width(grid.dpi)
        .height(grid.dpi)
        .strokeColor(strokeColor)
        .strokeWidth(2)
        .strokeOpacity(0.7)
        .fillColor(strokeColor)
        .fillOpacity(0.12)
        .disableHit(true)
        .locked(true)
        .layer("ATTACHMENT")
        .build();

    const localItems = await OBR.scene.local.getItems();
    const existingIds = new Set(localItems.map(item => item.id));

    const itemsToUpdate: Item[] = [];
    const itemsToAdd: Item[] = [];

    const candidates = [rangeCircle, tetherLine, distanceLabel, targetCellShape];
    for (const item of candidates) {
        if (existingIds.has(item.id)) {
            itemsToUpdate.push(item);
        } else {
            itemsToAdd.push(item);
        }
    }

    if (itemsToAdd.length > 0) {
        await OBR.scene.local.addItems(itemsToAdd);
    }
    if (itemsToUpdate.length > 0) {
        await OBR.scene.local.updateItems(
            itemsToUpdate.map(i => i.id),
            items => {
                for (let i = 0; i < items.length; i++) {
                    const newItem = itemsToUpdate.find(u => u.id === items[i].id);
                    if (newItem) {
                        Object.assign(items[i], newItem);
                    }
                }
            }
        );
    }

    return {
        withinRange: rangeCheck.withinRange,
        currentDistanceFeet: rangeCheck.currentDistanceFeet,
        maxRangeFeet: rangeCheck.effectiveMaxRangeFeet,
        canSee,
        reason: visionCheck?.reason
    };
}

/**
 * Clears the aiming tether, range circle, and distance label from the local scene.
 */
export async function clearAimingOverlay(): Promise<void> {
    const ids = [AIMING_RANGE_CIRCLE_ID, AIMING_TETHER_LINE_ID, AIMING_DISTANCE_LABEL_ID, AIMING_TARGET_CELL_ID];
    await OBR.scene.local.deleteItems(ids);
}

