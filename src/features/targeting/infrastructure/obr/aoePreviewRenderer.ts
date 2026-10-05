import OBR, { Item, Shape, Vector2, buildCurve, buildLabel, buildShape } from "@owlbear-rodeo/sdk";
import {
    AoETemplate,
    GridInfo,
    feetToPixels,
    getAffectedGridCells,
    isTokenInAffectedCells,
    normalize,
    snapAoECenter,
    snapToCellCenter
} from "../../domain/targetingGeometry";
import { APP_KEY } from "../../../../config";

export const AOE_GRID_PREFIX = `${APP_KEY}/aoe-grid-cell-`;
export const AOE_OUTLINE_ID = `${APP_KEY}/aoe-outline`;
export const AOE_OUTLINE_LABEL_ID = `${APP_KEY}/aoe-outline-label`;
export const AOE_TOKEN_HIGHLIGHT_PREFIX = `${APP_KEY}/aoe-token-hl-`;

export interface AoePreviewRenderOptions {
    template: AoETemplate;
    grid: GridInfo;
    casterId?: string;
    themeColor?: string; // default orange (#f97316)
    strokeColor?: string;
}

export interface AoePreviewRenderResult {
    affectedCellCount: number;
    affectedTokenIds: string[];
}

/**
 * Builds the geometric wireframe overlay items (red outline polygon/circle and distance text label),
 * matching standard VTT spell templates (e.g. 5e 53.13° cone with apex at caster edge).
 */
function buildAoEGeometricOverlay(template: AoETemplate, grid: GridInfo): Item[] {
    const items: Item[] = [];
    const sizePixels = feetToPixels(template.sizeFeet, grid.dpi, grid.scaleMultiplier);

    if (template.shape === "Cone") {
        const casterCenter = snapToCellCenter(template.origin, grid);
        const dir = normalize({ x: template.cursor.x - casterCenter.x, y: template.cursor.y - casterCenter.y });
        if (dir.x === 0 && dir.y === 0) return items;

        const coneOrigin: Vector2 = {
            x: casterCenter.x + dir.x * (grid.dpi * 0.5),
            y: casterCenter.y + dir.y * (grid.dpi * 0.5)
        };

        const angle = Math.atan2(dir.y, dir.x);
        const halfAngleRad = ((template.coneAngleDeg ?? 53.13) / 2) * (Math.PI / 180);

        const pLeft: Vector2 = {
            x: coneOrigin.x + Math.cos(angle - halfAngleRad) * sizePixels,
            y: coneOrigin.y + Math.sin(angle - halfAngleRad) * sizePixels
        };
        const pRight: Vector2 = {
            x: coneOrigin.x + Math.cos(angle + halfAngleRad) * sizePixels,
            y: coneOrigin.y + Math.sin(angle + halfAngleRad) * sizePixels
        };

        // Red triangle cone outline (apex -> left -> right -> apex)
        const triangle = buildCurve()
            .id(AOE_OUTLINE_ID)
            .points([coneOrigin, pLeft, pRight])
            .closed(true)
            .tension(0)
            .strokeColor("#ef4444")
            .strokeWidth(3)
            .strokeOpacity(0.9)
            .fillColor("#ef4444")
            .fillOpacity(0.08)
            .disableHit(true)
            .locked(true)
            .layer("ATTACHMENT")
            .build();
        items.push(triangle);

        // Distance text label centered inside the cone
        const labelPos: Vector2 = {
            x: coneOrigin.x + Math.cos(angle) * (sizePixels * 0.45),
            y: coneOrigin.y + Math.sin(angle) * (sizePixels * 0.45)
        };

        const label = buildLabel()
            .id(AOE_OUTLINE_LABEL_ID)
            .position(labelPos)
            .plainText(`${template.sizeFeet}ft`)
            .fontSize(16)
            .fontWeight(700)
            .padding(6)
            .cornerRadius(6)
            .fillColor("#ffffff")
            .backgroundColor("#0f172a")
            .backgroundOpacity(0.85)
            .disableHit(true)
            .locked(true)
            .layer("ATTACHMENT")
            .build();
        items.push(label);
    } else if (template.shape === "Sphere") {
        const effectiveCursor = snapAoECenter(template.cursor, template.shape, template.sizeFeet, grid);
        const circle = buildShape()
            .id(AOE_OUTLINE_ID)
            .shapeType("CIRCLE")
            .position(effectiveCursor)
            .width(sizePixels * 2)
            .height(sizePixels * 2)
            .strokeColor("#ef4444")
            .strokeWidth(3)
            .strokeOpacity(0.9)
            .fillColor("#ef4444")
            .fillOpacity(0.08)
            .disableHit(true)
            .locked(true)
            .layer("ATTACHMENT")
            .build();
        items.push(circle);

        const label = buildLabel()
            .id(AOE_OUTLINE_LABEL_ID)
            .position({ x: effectiveCursor.x, y: effectiveCursor.y - sizePixels - 20 })
            .plainText(`${template.sizeFeet}ft radius`)
            .fontSize(16)
            .fontWeight(700)
            .padding(6)
            .cornerRadius(6)
            .fillColor("#ffffff")
            .backgroundColor("#0f172a")
            .backgroundOpacity(0.85)
            .disableHit(true)
            .locked(true)
            .layer("ATTACHMENT")
            .build();
        items.push(label);
    } else if (template.shape === "Cube") {
        const effectiveCursor = snapAoECenter(template.cursor, template.shape, template.sizeFeet, grid);
        const square = buildShape()
            .id(AOE_OUTLINE_ID)
            .shapeType("RECTANGLE")
            .position({
                x: effectiveCursor.x - sizePixels / 2,
                y: effectiveCursor.y - sizePixels / 2
            })
            .width(sizePixels)
            .height(sizePixels)
            .strokeColor("#ef4444")
            .strokeWidth(3)
            .strokeOpacity(0.9)
            .fillColor("#ef4444")
            .fillOpacity(0.08)
            .disableHit(true)
            .locked(true)
            .layer("ATTACHMENT")
            .build();
        items.push(square);

        const label = buildLabel()
            .id(AOE_OUTLINE_LABEL_ID)
            .position({ x: effectiveCursor.x, y: effectiveCursor.y - sizePixels / 2 - 20 })
            .plainText(`${template.sizeFeet}ft cube`)
            .fontSize(16)
            .fontWeight(700)
            .padding(6)
            .cornerRadius(6)
            .fillColor("#ffffff")
            .backgroundColor("#0f172a")
            .backgroundOpacity(0.85)
            .disableHit(true)
            .locked(true)
            .layer("ATTACHMENT")
            .build();
        items.push(label);
    } else if (template.shape === "Line") {
        const casterCenter = snapToCellCenter(template.origin, grid);
        const dir = normalize({ x: template.cursor.x - casterCenter.x, y: template.cursor.y - casterCenter.y });
        if (dir.x === 0 && dir.y === 0) return items;

        const perp = { x: -dir.y, y: dir.x };
        const widthPixels = feetToPixels(template.widthFeet ?? 5, grid.dpi, grid.scaleMultiplier);
        const lineOrigin: Vector2 = {
            x: casterCenter.x + dir.x * (grid.dpi * 0.5),
            y: casterCenter.y + dir.y * (grid.dpi * 0.5)
        };
        const lineEnd: Vector2 = {
            x: lineOrigin.x + dir.x * sizePixels,
            y: lineOrigin.y + dir.y * sizePixels
        };

        const halfW = widthPixels / 2;
        const p1: Vector2 = { x: lineOrigin.x - perp.x * halfW, y: lineOrigin.y - perp.y * halfW };
        const p2: Vector2 = { x: lineEnd.x - perp.x * halfW, y: lineEnd.y - perp.y * halfW };
        const p3: Vector2 = { x: lineEnd.x + perp.x * halfW, y: lineEnd.y + perp.y * halfW };
        const p4: Vector2 = { x: lineOrigin.x + perp.x * halfW, y: lineOrigin.y + perp.y * halfW };

        const lineRect = buildCurve()
            .id(AOE_OUTLINE_ID)
            .points([p1, p2, p3, p4])
            .closed(true)
            .tension(0)
            .strokeColor("#ef4444")
            .strokeWidth(3)
            .strokeOpacity(0.9)
            .fillColor("#ef4444")
            .fillOpacity(0.08)
            .disableHit(true)
            .locked(true)
            .layer("ATTACHMENT")
            .build();
        items.push(lineRect);

        const label = buildLabel()
            .id(AOE_OUTLINE_LABEL_ID)
            .position({ x: lineOrigin.x + dir.x * (sizePixels * 0.5), y: lineOrigin.y + dir.y * (sizePixels * 0.5) - 20 })
            .plainText(`${template.sizeFeet}ft line`)
            .fontSize(16)
            .fontWeight(700)
            .padding(6)
            .cornerRadius(6)
            .fillColor("#ffffff")
            .backgroundColor("#0f172a")
            .backgroundOpacity(0.85)
            .disableHit(true)
            .locked(true)
            .layer("ATTACHMENT")
            .build();
        items.push(label);
    }

    return items;
}

/**
 * Renders or updates the AoE grid cell highlights, token warning highlights,
 * and the geometric wireframe overlay (red cone/sphere outline + distance label).
 * Rendered on OBR.scene.local (private to this player's screen).
 */
export async function renderAoePreview(state: AoePreviewRenderOptions): Promise<AoePreviewRenderResult> {
    const { template, grid, casterId, themeColor = "#f97316", strokeColor = "#ea580c" } = state;
    const affectedCells = getAffectedGridCells(template, grid);

    // Find affected tokens on CHARACTER layer (excluding caster)
    const sceneItems = await OBR.scene.items.getItems();
    const characterTokens = sceneItems.filter(item => item.layer === "CHARACTER" && item.visible);
    const affectedTokenIds: string[] = [];

    for (const token of characterTokens) {
        if (casterId && token.id === casterId) {
            continue; // Caster does not burn themselves
        }
        if (isTokenInAffectedCells(token.position, affectedCells)) {
            affectedTokenIds.push(token.id);
        }
    }

    // 1. Build grid cell highlight shapes
    const cellItems: Shape[] = [];
    for (const cell of affectedCells) {
        const cellId = `${AOE_GRID_PREFIX}${cell.x}_${cell.y}`;
        const shape = buildShape()
            .id(cellId)
            .shapeType("RECTANGLE")
            .position({ x: cell.bounds.minX, y: cell.bounds.minY })
            .width(grid.dpi)
            .height(grid.dpi)
            .fillColor(themeColor)
            .fillOpacity(0.25)
            .strokeColor(strokeColor)
            .strokeWidth(2)
            .strokeOpacity(0.65)
            .disableHit(true)
            .locked(true)
            .layer("ATTACHMENT")
            .build();
        cellItems.push(shape);
    }

    // 2. Build token warning highlight rings
    const tokenHighlights: Shape[] = [];
    for (const tokenId of affectedTokenIds) {
        const token = characterTokens.find(t => t.id === tokenId);
        if (!token) continue;
        const hlShape = buildShape()
            .id(`${AOE_TOKEN_HIGHLIGHT_PREFIX}${tokenId}`)
            .shapeType("CIRCLE")
            .position(token.position)
            .width(grid.dpi * 1.3)
            .height(grid.dpi * 1.3)
            .fillColor("#ef4444")
            .fillOpacity(0.2)
            .strokeColor("#dc2626")
            .strokeWidth(3)
            .strokeOpacity(0.9)
            .disableHit(true)
            .locked(true)
            .layer("ATTACHMENT")
            .build();
        tokenHighlights.push(hlShape);
    }

    // 3. Build geometric outline and label overlay
    const overlayItems = buildAoEGeometricOverlay(template, grid);

    // Combine all new items
    const newItems = [...cellItems, ...tokenHighlights, ...overlayItems];
    const newIds = new Set(newItems.map(i => i.id));

    // Get current local items matching our AoE prefixes
    const localItems = await OBR.scene.local.getItems();
    const existingAoeItems = localItems.filter(
        item =>
            item.id.startsWith(AOE_GRID_PREFIX) ||
            item.id.startsWith(AOE_TOKEN_HIGHLIGHT_PREFIX) ||
            item.id === AOE_OUTLINE_ID ||
            item.id === AOE_OUTLINE_LABEL_ID
    );
    const existingMap = new Map(existingAoeItems.map(i => [i.id, i]));

    const idsToDelete: string[] = [];
    for (const existing of existingAoeItems) {
        if (!newIds.has(existing.id)) {
            idsToDelete.push(existing.id);
        }
    }

    const itemsToAdd: Item[] = [];
    const itemsToUpdate: Item[] = [];

    for (const item of newItems) {
        const existing = existingMap.get(item.id);
        // If it already exists and shares the exact same item type, update in place
        if (existing && existing.type === item.type) {
            itemsToUpdate.push(item);
        } else {
            // If item changed type (e.g. from Curve to Shape when switching spell), delete old and add new
            if (existing) {
                idsToDelete.push(existing.id);
            }
            itemsToAdd.push(item);
        }
    }

    // Delete removed or type-changed items
    if (idsToDelete.length > 0) {
        await OBR.scene.local.deleteItems(idsToDelete);
    }

    // Add new items
    if (itemsToAdd.length > 0) {
        await OBR.scene.local.addItems(itemsToAdd);
    }

    // Update existing items
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
        affectedCellCount: affectedCells.length,
        affectedTokenIds
    };
}

/**
 * Clears all AoE grid highlights, geometric outlines, and token warning rings from the local scene.
 */
export async function clearAoePreview(): Promise<void> {
    const localItems = await OBR.scene.local.getItems();
    const aoeIds = localItems
        .filter(
            item =>
                item.id.startsWith(AOE_GRID_PREFIX) ||
                item.id.startsWith(AOE_TOKEN_HIGHLIGHT_PREFIX) ||
                item.id === AOE_OUTLINE_ID ||
                item.id === AOE_OUTLINE_LABEL_ID
        )
        .map(item => item.id);

    if (aoeIds.length > 0) {
        await OBR.scene.local.deleteItems(aoeIds);
    }
}
