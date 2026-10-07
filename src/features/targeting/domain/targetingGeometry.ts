import { Vector2 } from "@owlbear-rodeo/sdk";

export interface GridInfo {
    dpi: number;
    scaleMultiplier: number; // e.g. 5 for 5ft per grid cell
    cellCenterOffset?: Vector2; // The phase offset of cell centers in scene coordinates
}

export type AoEShape = "Sphere" | "Cone" | "Cube" | "Line";

export interface AoETemplate {
    shape: AoEShape;
    origin: Vector2;
    cursor: Vector2;
    sizeFeet: number; // radius, length, or edge length in feet
    widthFeet?: number; // for lines (default 5ft)
    coneAngleDeg?: number; // for cones (default 53.13 degrees)
}

export interface GridCell {
    x: number; // cell column index
    y: number; // cell row index
    center: Vector2;
    bounds: { minX: number; minY: number; maxX: number; maxY: number };
}

/**
 * Calculates Euclidean distance between two 2D points in pixels.
 */
export function distancePixels(a: Vector2, b: Vector2): number {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Converts distance in pixels to feet using scene grid DPI and scale multiplier.
 */
export function pixelsToFeet(pixels: number, dpi: number, scaleMultiplier: number): number {
    if (dpi <= 0) return 0;
    return (pixels / dpi) * scaleMultiplier;
}

/**
 * Converts distance in feet to pixels using scene grid DPI and scale multiplier.
 */
export function feetToPixels(feet: number, dpi: number, scaleMultiplier: number): number {
    if (scaleMultiplier <= 0) return 0;
    return (feet / scaleMultiplier) * dpi;
}

/**
 * Calculates distance in feet between two points.
 */
export function distanceFeet(a: Vector2, b: Vector2, grid: GridInfo): number {
    return pixelsToFeet(distancePixels(a, b), grid.dpi, grid.scaleMultiplier);
}

/**
 * Returns the normalized vector.
 */
export function normalize(v: Vector2): Vector2 {
    const len = Math.sqrt(v.x * v.x + v.y * v.y);
    if (len === 0) return { x: 0, y: 0 };
    return { x: v.x / len, y: v.y / len };
}

/**
 * Calculates angle from vector a to b in radians.
 */
export function angleRadians(from: Vector2, to: Vector2): number {
    return Math.atan2(to.y - from.y, to.x - from.x);
}

/**
 * Calculates angle from vector a to b in degrees (-180 to 180).
 */
export function angleDegrees(from: Vector2, to: Vector2): number {
    return (angleRadians(from, to) * 180) / Math.PI;
}

/**
 * Checks if a distance is within maximum spell range.
 */
export function isWithinRange(
    casterPos: Vector2,
    targetPos: Vector2,
    maxRangeFeet: number,
    grid: GridInfo,
    rangeMultiplier = 1
): { withinRange: boolean; currentDistanceFeet: number; effectiveMaxRangeFeet: number } {
    const distFeet = distanceFeet(casterPos, targetPos, grid);
    const effectiveMax = maxRangeFeet * rangeMultiplier;

    // D&D 5e Grid Chebyshev distance (1 square diagonal = 5 ft reach)
    const dxFeet = Math.abs(targetPos.x - casterPos.x) / (grid.dpi || 1) * (grid.scaleMultiplier || 5);
    const dyFeet = Math.abs(targetPos.y - casterPos.y) / (grid.dpi || 1) * (grid.scaleMultiplier || 5);
    const chebyshevDist = Math.max(dxFeet, dyFeet);

    // For melee/reach (maxRangeFeet <= 5), an adjacent diagonal square (dx=5, dy=5) is strictly within 5ft reach in 5e rules
    const isMeleeReach = maxRangeFeet <= 5 && (chebyshevDist <= 5.5 || distFeet <= 5 * Math.SQRT2 + 0.5);
    const isGeneralRange = distFeet <= effectiveMax + 0.5 || chebyshevDist <= effectiveMax + 0.5;

    const withinRange = isMeleeReach || isGeneralRange;
    const currentDistanceFeet = (maxRangeFeet <= 5 && isMeleeReach)
        ? 5
        : Math.round(distFeet * 10) / 10;

    return {
        withinRange,
        currentDistanceFeet,
        effectiveMaxRangeFeet: effectiveMax
    };
}

/**
 * Generates grid cells within a bounding box centered around a point,
 * aligned to cell center offsets so cell bounds match the grid lines perfectly.
 */
export function getSurroundingGridCells(
    center: Vector2,
    radiusPixels: number,
    dpi: number,
    cellCenterOffset?: Vector2
): GridCell[] {
    if (dpi <= 0) return [];

    const offX = cellCenterOffset ? (((cellCenterOffset.x % dpi) + dpi) % dpi) : dpi / 2;
    const offY = cellCenterOffset ? (((cellCenterOffset.y % dpi) + dpi) % dpi) : dpi / 2;

    const minCellX = Math.floor((center.x - radiusPixels - offX) / dpi);
    const maxCellX = Math.ceil((center.x + radiusPixels - offX) / dpi);
    const minCellY = Math.floor((center.y - radiusPixels - offY) / dpi);
    const maxCellY = Math.ceil((center.y + radiusPixels - offY) / dpi);

    const cells: GridCell[] = [];
    for (let cx = minCellX; cx <= maxCellX; cx++) {
        for (let cy = minCellY; cy <= maxCellY; cy++) {
            const cellCenterX = cx * dpi + offX;
            const cellCenterY = cy * dpi + offY;
            const minX = cellCenterX - dpi / 2;
            const minY = cellCenterY - dpi / 2;
            const maxX = cellCenterX + dpi / 2;
            const maxY = cellCenterY + dpi / 2;
            cells.push({
                x: cx,
                y: cy,
                center: { x: cellCenterX, y: cellCenterY },
                bounds: { minX, minY, maxX, maxY }
            });
        }
    }
    return cells;
}

/**
 * Tests if a point lies inside a Sphere/Circle AoE.
 */
export function isPointInSphere(point: Vector2, center: Vector2, radiusPixels: number): boolean {
    return distancePixels(point, center) <= radiusPixels + 0.001;
}

/**
 * Tests if a point lies inside a Cone AoE with apex at origin pointing toward cursor.
 */
export function isPointInCone(
    point: Vector2,
    origin: Vector2,
    cursor: Vector2,
    lengthPixels: number,
    coneAngleDeg = 53.13
): boolean {
    const dist = distancePixels(origin, point);
    if (dist > lengthPixels + 0.001) return false;
    if (dist < 1) return false; // Exclude origin apex itself

    const targetDir = normalize({ x: cursor.x - origin.x, y: cursor.y - origin.y });
    const pointDir = normalize({ x: point.x - origin.x, y: point.y - origin.y });

    const dot = targetDir.x * pointDir.x + targetDir.y * pointDir.y;
    const halfAngleRad = ((coneAngleDeg / 2) * Math.PI) / 180;
    const minDot = Math.cos(halfAngleRad);

    return dot >= minDot - 0.001;
}

/**
 * Snaps any point to the true center of its grid cell.
 */
export function snapToCellCenter(pos: Vector2, grid: GridInfo): Vector2 {
    const dpi = grid.dpi;
    if (dpi <= 0) return pos;
    const offX = grid.cellCenterOffset ? (((grid.cellCenterOffset.x % dpi) + dpi) % dpi) : dpi / 2;
    const offY = grid.cellCenterOffset ? (((grid.cellCenterOffset.y % dpi) + dpi) % dpi) : dpi / 2;
    return {
        x: Math.round((pos.x - offX) / dpi) * dpi + offX,
        y: Math.round((pos.y - offY) / dpi) * dpi + offY
    };
}

/**
 * Tests if a point lies inside a 2D triangle defined by vertices a, b, c.
 */
export function isPointInTriangle(p: Vector2, a: Vector2, b: Vector2, c: Vector2): boolean {
    const v0x = c.x - a.x;
    const v0y = c.y - a.y;
    const v1x = b.x - a.x;
    const v1y = b.y - a.y;
    const v2x = p.x - a.x;
    const v2y = p.y - a.y;

    const dot00 = v0x * v0x + v0y * v0y;
    const dot01 = v0x * v1x + v0y * v1y;
    const dot02 = v0x * v2x + v0y * v2y;
    const dot11 = v1x * v1x + v1y * v1y;
    const dot12 = v1x * v2x + v1y * v2y;

    const denom = dot00 * dot11 - dot01 * dot01;
    if (denom === 0) return false;
    const u = (dot11 * dot02 - dot01 * dot12) / denom;
    const v = (dot00 * dot12 - dot01 * dot02) / denom;

    return u >= 0 && v >= 0 && u + v <= 1;
}

/**
 * Tests if an entire grid cell is affected by a cone according to D&D 5e standard cone rules.
 * Uses the exact geometric triangle [origin, pLeft, pRight] matching the visual red cone wireframe.
 */
export function isCellInCone(
    cell: GridCell,
    origin: Vector2,
    cursor: Vector2,
    lengthPixels: number,
    dpi: number,
    coneAngleDeg = 53.13,
    casterCenter?: Vector2
): boolean {
    // Strictly exclude the caster's own cell
    if (casterCenter && distancePixels(casterCenter, cell.center) < dpi * 0.5) {
        return false;
    }

    const dir = normalize({ x: cursor.x - origin.x, y: cursor.y - origin.y });
    if (dir.x === 0 && dir.y === 0) return false;

    const angle = Math.atan2(dir.y, dir.x);
    const halfAngleRad = ((coneAngleDeg / 2) * Math.PI) / 180;

    const pLeft: Vector2 = {
        x: origin.x + Math.cos(angle - halfAngleRad) * lengthPixels,
        y: origin.y + Math.sin(angle - halfAngleRad) * lengthPixels
    };
    const pRight: Vector2 = {
        x: origin.x + Math.cos(angle + halfAngleRad) * lengthPixels,
        y: origin.y + Math.sin(angle + halfAngleRad) * lengthPixels
    };

    // 1. Center of cell is inside cone triangle
    if (isPointInTriangle(cell.center, origin, pLeft, pRight)) {
        return true;
    }

    // 2. Inner sample points (25% from center towards edges) for cells with substantial coverage
    const off = dpi * 0.25;
    const samplePoints: Vector2[] = [
        { x: cell.center.x + off, y: cell.center.y },
        { x: cell.center.x - off, y: cell.center.y },
        { x: cell.center.x, y: cell.center.y + off },
        { x: cell.center.x, y: cell.center.y - off }
    ];

    for (const pt of samplePoints) {
        if (isPointInTriangle(pt, origin, pLeft, pRight)) {
            return true;
        }
    }

    return false;
}

/**
 * Tests if a point lies inside a Line AoE with given width.
 */
export function isPointInLine(
    point: Vector2,
    origin: Vector2,
    cursor: Vector2,
    lengthPixels: number,
    widthPixels: number
): boolean {
    const dir = normalize({ x: cursor.x - origin.x, y: cursor.y - origin.y });
    const toPoint = { x: point.x - origin.x, y: point.y - origin.y };

    // Projection along line direction
    const projAlong = toPoint.x * dir.x + toPoint.y * dir.y;
    if (projAlong < 0 || projAlong > lengthPixels) return false;

    // Perpendicular distance from line
    const perpDist = Math.abs(toPoint.x * -dir.y + toPoint.y * dir.x);
    return perpDist <= widthPixels / 2;
}

/**
 * Tests if a grid cell is affected by a Line AoE with given width,
 * checking center and inner sample points to ensure continuous coverage on diagonal angles.
 */
export function isCellInLine(
    cell: GridCell,
    origin: Vector2,
    cursor: Vector2,
    lengthPixels: number,
    widthPixels: number,
    dpi: number,
    casterCenter?: Vector2
): boolean {
    if (casterCenter && distancePixels(casterCenter, cell.center) < dpi * 0.5) {
        return false;
    }
    if (isPointInLine(cell.center, origin, cursor, lengthPixels, widthPixels)) {
        return true;
    }
    const off = dpi * 0.25;
    const samplePoints: Vector2[] = [
        { x: cell.center.x + off, y: cell.center.y },
        { x: cell.center.x - off, y: cell.center.y },
        { x: cell.center.x, y: cell.center.y + off },
        { x: cell.center.x, y: cell.center.y - off }
    ];
    for (const pt of samplePoints) {
        if (isPointInLine(pt, origin, cursor, lengthPixels, widthPixels)) {
            return true;
        }
    }
    return false;
}


/**
 * Tests if a point lies inside a Cube/Square AoE centered at cursor.
 */
export function isPointInCube(point: Vector2, center: Vector2, sizePixels: number): boolean {
    const half = sizePixels / 2;
    return (
        point.x >= center.x - half &&
        point.x <= center.x + half &&
        point.y >= center.y - half &&
        point.y <= center.y + half
    );
}

/**
 * Snaps AoE center to grid intersection or grid cell center according to standard D&D 5e grid rules.
 * For spheres with even diameter (like Fireball 20ft radius = 40ft diameter = 8 cells),
 * D&D rules state the origin is a grid intersection (corner of 4 squares where the + crosses are).
 * For odd diameter areas (like a 15ft cube = 3 cells), origin is cell center.
 */
export function snapAoECenter(pos: Vector2, shape: AoEShape, _sizeFeet: number, grid: GridInfo): Vector2 {
    const dpi = grid.dpi;
    if (dpi <= 0) return pos;

    const offX = grid.cellCenterOffset ? (((grid.cellCenterOffset.x % dpi) + dpi) % dpi) : dpi / 2;
    const offY = grid.cellCenterOffset ? (((grid.cellCenterOffset.y % dpi) + dpi) % dpi) : dpi / 2;

    // Corner (grid intersection) is offset by half a cell from cell center
    const cornerOffX = (((offX - dpi / 2) % dpi) + dpi) % dpi;
    const cornerOffY = (((offY - dpi / 2) % dpi) + dpi) % dpi;

    if (shape === "Sphere" || shape === "Cube") {
        const cellCenterPos = {
            x: Math.round((pos.x - offX) / dpi) * dpi + offX,
            y: Math.round((pos.y - offY) / dpi) * dpi + offY
        };
        const cornerPos = {
            x: Math.round((pos.x - cornerOffX) / dpi) * dpi + cornerOffX,
            y: Math.round((pos.y - cornerOffY) / dpi) * dpi + cornerOffY
        };

        const distToCell = Math.hypot(pos.x - cellCenterPos.x, pos.y - cellCenterPos.y);
        const distToCorner = Math.hypot(pos.x - cornerPos.x, pos.y - cornerPos.y);

        // Snap to whichever anchor (token/cell center vs intersection) the player is pointing closer to
        return distToCell <= distToCorner ? cellCenterPos : cornerPos;
    }

    return pos;
}

/**
 * Computes all grid cells covered by an AoE template based on D&D 5e standard rules.
 */
export function getAffectedGridCells(template: AoETemplate, grid: GridInfo): GridCell[] {
    const sizePixels = feetToPixels(template.sizeFeet, grid.dpi, grid.scaleMultiplier);
    const effectiveCursor = snapAoECenter(template.cursor, template.shape, template.sizeFeet, grid);
    const casterCenter = snapToCellCenter(template.origin, grid);

    // For Cone and Line, spell begins at the perimeter edge of caster's space pointing toward cursor
    let effectOrigin = casterCenter;
    if (template.shape === "Cone" || template.shape === "Line") {
        const dir = normalize({ x: template.cursor.x - casterCenter.x, y: template.cursor.y - casterCenter.y });
        effectOrigin = {
            x: casterCenter.x + dir.x * (grid.dpi * 0.5),
            y: casterCenter.y + dir.y * (grid.dpi * 0.5)
        };
    }

    const searchCenter = template.shape === "Cone" || template.shape === "Line" ? casterCenter : effectiveCursor;
    const searchRadius = sizePixels * 1.5 + grid.dpi;

    const candidateCells = getSurroundingGridCells(searchCenter, searchRadius, grid.dpi, grid.cellCenterOffset);
    const affectedCells: GridCell[] = [];

    const widthPixels = feetToPixels(template.widthFeet ?? 5, grid.dpi, grid.scaleMultiplier);

    for (const cell of candidateCells) {
        let isHit = false;
        switch (template.shape) {
            case "Sphere":
                isHit = isPointInSphere(cell.center, effectiveCursor, sizePixels);
                break;
            case "Cone":
                isHit = isCellInCone(
                    cell,
                    effectOrigin,
                    template.cursor,
                    sizePixels,
                    grid.dpi,
                    template.coneAngleDeg ?? 53.13,
                    casterCenter
                );
                break;
            case "Line":
                isHit = isCellInLine(cell, effectOrigin, template.cursor, sizePixels, widthPixels, grid.dpi, casterCenter);
                break;
            case "Cube":
                isHit = isPointInCube(cell.center, effectiveCursor, sizePixels);
                break;
        }

        if (isHit) {
            affectedCells.push(cell);
        }
    }

    return affectedCells;
}

/**
 * Tests whether a token's position is contained within any of the affected grid cells.
 */
export function isTokenInAffectedCells(tokenPos: Vector2, cells: GridCell[]): boolean {
    for (const cell of cells) {
        if (
            tokenPos.x >= cell.bounds.minX &&
            tokenPos.x <= cell.bounds.maxX &&
            tokenPos.y >= cell.bounds.minY &&
            tokenPos.y <= cell.bounds.maxY
        ) {
            return true;
        }
    }
    return false;
}

export interface Point3D {
    x: number;
    y: number;
    z: number; // elevation in feet
}

/**
 * Calculates Euclidean distance in feet between two 3D points.
 * x and y are in scene pixels, z is in feet.
 */
export function distance3DFeet(a: Point3D, b: Point3D, grid: GridInfo): number {
    const dxPx = b.x - a.x;
    const dyPx = b.y - a.y;
    const dxFt = (dxPx / grid.dpi) * grid.scaleMultiplier;
    const dyFt = (dyPx / grid.dpi) * grid.scaleMultiplier;
    const dzFt = b.z - a.z;
    return Math.sqrt(dxFt * dxFt + dyFt * dyFt + dzFt * dzFt);
}

/**
 * Calculates the shortest distance in feet from a 3D point C to a 3D line segment AB.
 * a.x, a.y, b.x, b.y, c.x, c.y are in pixels; a.z, b.z, c.z are in feet.
 */
export function distancePoint3DToSegment3DFeet(
    c: Point3D,
    a: Point3D,
    b: Point3D,
    grid: GridInfo
): number {
    const ax = (a.x / grid.dpi) * grid.scaleMultiplier;
    const ay = (a.y / grid.dpi) * grid.scaleMultiplier;
    const az = a.z;

    const bx = (b.x / grid.dpi) * grid.scaleMultiplier;
    const by = (b.y / grid.dpi) * grid.scaleMultiplier;
    const bz = b.z;

    const cx = (c.x / grid.dpi) * grid.scaleMultiplier;
    const cy = (c.y / grid.dpi) * grid.scaleMultiplier;
    const cz = c.z;

    const vx = bx - ax;
    const vy = by - ay;
    const vz = bz - az;
    const lenSq = vx * vx + vy * vy + vz * vz;

    if (lenSq === 0) {
        const dx = cx - ax;
        const dy = cy - ay;
        const dz = cz - az;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    const t = Math.max(0, Math.min(1, ((cx - ax) * vx + (cy - ay) * vy + (cz - az) * vz) / lenSq));
    const projX = ax + t * vx;
    const projY = ay + t * vy;
    const projZ = az + t * vz;

    const dx = cx - projX;
    const dy = cy - projY;
    const dz = cz - projZ;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Checks whether a 3D line of sight segment between caster and target intersects a 3D sphere.
 */
export function doesSegmentIntersectSphere3D(
    caster: Point3D,
    target: Point3D,
    sphereCenter: Point3D,
    radiusFeet: number,
    grid: GridInfo
): boolean {
    const distFeet = distancePoint3DToSegment3DFeet(sphereCenter, caster, target, grid);
    return distFeet <= radiusFeet;
}

