import { describe, expect, it } from "vitest";
import {
    AoETemplate,
    GridInfo,
    distanceFeet,
    distancePixels,
    feetToPixels,
    getAffectedGridCells,
    isPointInCone,
    isPointInCube,
    isPointInLine,
    isPointInSphere,
    isWithinRange,
    pixelsToFeet,
    snapToCellCenter,
    distancePoint3DToSegment3DFeet,
    doesSegmentIntersectSphere3D,
    Point3D
} from "./targetingGeometry";

describe("Geometry & Grid Utilities", () => {
    const grid: GridInfo = {
        dpi: 100, // 100 pixels per grid cell
        scaleMultiplier: 5 // each grid cell = 5 feet (standard D&D)
    };

    it("converts between pixels and feet correctly", () => {
        expect(pixelsToFeet(100, grid.dpi, grid.scaleMultiplier)).toBe(5);
        expect(pixelsToFeet(2400, grid.dpi, grid.scaleMultiplier)).toBe(120);

        expect(feetToPixels(5, grid.dpi, grid.scaleMultiplier)).toBe(100);
        expect(feetToPixels(120, grid.dpi, grid.scaleMultiplier)).toBe(2400);
    });

    it("calculates distance between points in feet", () => {
        const a = { x: 0, y: 0 };
        const b = { x: 300, y: 400 }; // 500 pixels = 5 cells = 25 feet
        expect(distancePixels(a, b)).toBe(500);
        expect(distanceFeet(a, b, grid)).toBe(25);
    });

    it("correctly enforces range clamping (e.g. Eldritch Blast 120 ft)", () => {
        const caster = { x: 0, y: 0 };
        const validTarget = { x: 2000, y: 0 }; // 2000 px = 20 cells = 100 ft <= 120 ft
        const outOfRangeTarget = { x: 2800, y: 0 }; // 2800 px = 28 cells = 140 ft > 120 ft

        const check1 = isWithinRange(caster, validTarget, 120, grid);
        expect(check1.withinRange).toBe(true);
        expect(check1.currentDistanceFeet).toBe(100);

        const check2 = isWithinRange(caster, outOfRangeTarget, 120, grid);
        expect(check2.withinRange).toBe(false);
        expect(check2.currentDistanceFeet).toBe(140);

        // Spell Sniper feat (2x range)
        const check3 = isWithinRange(caster, outOfRangeTarget, 120, grid, 2);
        expect(check3.withinRange).toBe(true);
        expect(check3.effectiveMaxRangeFeet).toBe(240);
    });

    it("allows 5ft melee reach targeting on adjacent orthogonal and diagonal cells", () => {
        const caster = { x: 500, y: 500 };
        const orthogonalTarget = { x: 600, y: 500 }; // 1 cell East (5 ft)
        const diagonalTarget = { x: 600, y: 600 }; // 1 cell SE (diagonal, 7.07 ft Euclidean, 5 ft Chebyshev)
        const twoCellsAway = { x: 700, y: 500 }; // 2 cells East (10 ft)

        const orthoCheck = isWithinRange(caster, orthogonalTarget, 5, grid);
        expect(orthoCheck.withinRange).toBe(true);
        expect(orthoCheck.currentDistanceFeet).toBe(5);

        const diagCheck = isWithinRange(caster, diagonalTarget, 5, grid);
        expect(diagCheck.withinRange).toBe(true);
        expect(diagCheck.currentDistanceFeet).toBe(5);

        const farCheck = isWithinRange(caster, twoCellsAway, 5, grid);
        expect(farCheck.withinRange).toBe(false);
    });

    it("correctly detects points in a Sphere / Circle AoE", () => {
        const center = { x: 500, y: 500 };
        const radiusPixels = 200; // 10 ft radius

        expect(isPointInSphere({ x: 500, y: 600 }, center, radiusPixels)).toBe(true);
        expect(isPointInSphere({ x: 500, y: 700 }, center, radiusPixels)).toBe(true);
        expect(isPointInSphere({ x: 500, y: 750 }, center, radiusPixels)).toBe(false);
    });

    it("correctly detects points in a Cone AoE", () => {
        const origin = { x: 0, y: 0 };
        const cursor = { x: 100, y: 0 }; // pointing straight East along +X
        const coneLength = 300; // 15 ft cone

        // In front along axis
        expect(isPointInCone({ x: 200, y: 0 }, origin, cursor, coneLength)).toBe(true);
        // Slightly off axis within 53 degree cone
        expect(isPointInCone({ x: 200, y: 50 }, origin, cursor, coneLength)).toBe(true);
        // Behind the caster
        expect(isPointInCone({ x: -100, y: 0 }, origin, cursor, coneLength)).toBe(false);
        // Beyond cone length
        expect(isPointInCone({ x: 400, y: 0 }, origin, cursor, coneLength)).toBe(false);
    });

    it("correctly detects points in a Line AoE", () => {
        const origin = { x: 0, y: 0 };
        const cursor = { x: 1000, y: 0 }; // line along X axis
        const lineLength = 600; // 30 ft
        const lineWidth = 100; // 5 ft

        expect(isPointInLine({ x: 300, y: 20 }, origin, cursor, lineLength, lineWidth)).toBe(true);
        expect(isPointInLine({ x: 300, y: 60 }, origin, cursor, lineLength, lineWidth)).toBe(false);
        expect(isPointInLine({ x: 700, y: 0 }, origin, cursor, lineLength, lineWidth)).toBe(false);
    });

    it("correctly detects points in a Cube AoE", () => {
        const center = { x: 500, y: 500 };
        const cubeSize = 300; // 15 ft cube

        expect(isPointInCube({ x: 550, y: 550 }, center, cubeSize)).toBe(true);
        expect(isPointInCube({ x: 700, y: 500 }, center, cubeSize)).toBe(false);
    });

    it("computes affected grid cells for a Fireball (Sphere 20ft radius) matching exact 5e template", () => {
        const template: AoETemplate = {
            shape: "Sphere",
            origin: { x: 0, y: 0 },
            cursor: { x: 500, y: 500 }, // Grid intersection at (500, 500)
            sizeFeet: 20 // 20 ft radius = 4 cells radius = 8 cells diameter
        };

        const cells = getAffectedGridCells(template, grid);
        // The standard D&D 5e 20ft sphere template on a 5ft grid covers exactly 52 squares:
        // rows: 4, 6, 8, 8, 8, 8, 6, 4 (4+6+8+8+8+8+6+4 = 52)
        expect(cells.length).toBe(52);

        // Group by row (y) and check widths
        const rowCounts = new Map<number, number>();
        for (const cell of cells) {
            rowCounts.set(cell.y, (rowCounts.get(cell.y) ?? 0) + 1);
        }
        const sortedRowCounts = Array.from(rowCounts.entries())
            .sort((a, b) => a[0] - b[0])
            .map(e => e[1]);
        expect(sortedRowCounts).toEqual([4, 6, 8, 8, 8, 8, 6, 4]);
    });

    it("snaps arbitrary positions to the true cell center", () => {
        // With cellCenterOffset = (50, 50) and dpi = 100
        const testGrid: GridInfo = {
            dpi: 100,
            scaleMultiplier: 5,
            cellCenterOffset: { x: 50, y: 50 }
        };
        // Points inside the cell [0, 100] x [0, 100] should all snap to (50, 50)
        expect(snapToCellCenter({ x: 10, y: 10 }, testGrid)).toEqual({ x: 50, y: 50 });
        expect(snapToCellCenter({ x: 50, y: 50 }, testGrid)).toEqual({ x: 50, y: 50 });
        expect(snapToCellCenter({ x: 90, y: 90 }, testGrid)).toEqual({ x: 50, y: 50 });
    });

    it("computes affected grid cells for Burning Hands (Cone 15ft) with no gap and without hitting caster", () => {
        const testGrid: GridInfo = {
            dpi: 100,
            scaleMultiplier: 5,
            cellCenterOffset: { x: 50, y: 50 }
        };
        const casterPos = { x: 50, y: 350 }; // Row y=3, Col x=0

        // 1. Aim straight North (y < 350)
        const templateNorth: AoETemplate = {
            shape: "Cone",
            origin: casterPos,
            cursor: { x: 50, y: 50 },
            sizeFeet: 15
        };
        const cellsNorth = getAffectedGridCells(templateNorth, testGrid);
        
        // Must NOT contain the caster's own cell (x=0, y=3)
        expect(cellsNorth.some(c => c.x === 0 && c.y === 3)).toBe(false);
        // MUST contain the directly adjacent cell in front (x=0, y=2)
        expect(cellsNorth.some(c => c.x === 0 && c.y === 2)).toBe(true);
        // Exactly 3 cells long along axis (y=2, y=1, y=0)
        expect(cellsNorth.some(c => c.x === 0 && c.y === 1)).toBe(true);
        expect(cellsNorth.some(c => c.x === 0 && c.y === 0)).toBe(true);
        // Symmetrical along X axis (at furthest row y=0, width includes x=-1, x=0, x=1)
        expect(cellsNorth.some(c => c.x === -1 && c.y === 0)).toBe(true);
        expect(cellsNorth.some(c => c.x === 1 && c.y === 0)).toBe(true);

        // 2. Aim straight East (x > 50)
        const templateEast: AoETemplate = {
            shape: "Cone",
            origin: casterPos,
            cursor: { x: 450, y: 350 },
            sizeFeet: 15
        };
        const cellsEast = getAffectedGridCells(templateEast, testGrid);
        // Must NOT contain caster cell (x=0, y=3)
        expect(cellsEast.some(c => c.x === 0 && c.y === 3)).toBe(false);
        // MUST contain the directly adjacent cell in front (x=1, y=3)
        expect(cellsEast.some(c => c.x === 1 && c.y === 3)).toBe(true);
    });

    it("computes affected grid cells for Thunderwave (Cube 15ft) covering exactly 3x3 (9) cells", () => {
        const testGrid: GridInfo = {
            dpi: 100,
            scaleMultiplier: 5,
            cellCenterOffset: { x: 50, y: 50 }
        };
        const template: AoETemplate = {
            shape: "Cube",
            origin: { x: 50, y: 50 },
            cursor: { x: 250, y: 250 }, // Cell center of (x=2, y=2)
            sizeFeet: 15
        };
        const cells = getAffectedGridCells(template, testGrid);
        expect(cells.length).toBe(9); // 3x3 = 9 cells
        // Bounded by x in [1, 3] and y in [1, 3]
        for (const cell of cells) {
            expect(cell.x).toBeGreaterThanOrEqual(1);
            expect(cell.x).toBeLessThanOrEqual(3);
            expect(cell.y).toBeGreaterThanOrEqual(1);
            expect(cell.y).toBeLessThanOrEqual(3);
        }
    });

    it("computes affected grid cells for Entangle (Cube 20ft) covering exactly 4x4 (16) cells", () => {
        const testGrid: GridInfo = {
            dpi: 100,
            scaleMultiplier: 5,
            cellCenterOffset: { x: 50, y: 50 }
        };
        const template: AoETemplate = {
            shape: "Cube",
            origin: { x: 50, y: 50 },
            cursor: { x: 300, y: 300 }, // Snaps to corner (300, 300)
            sizeFeet: 20
        };
        const cells = getAffectedGridCells(template, testGrid);
        expect(cells.length).toBe(16); // 4x4 = 16 cells
    });

    it("computes affected grid cells for Lightning Bolt (Line 100ft x 5ft) covering 20 cells along axis", () => {
        const testGrid: GridInfo = {
            dpi: 100,
            scaleMultiplier: 5,
            cellCenterOffset: { x: 50, y: 50 }
        };
        const casterPos = { x: 50, y: 50 }; // Cell (0, 0)
        const template: AoETemplate = {
            shape: "Line",
            origin: casterPos,
            cursor: { x: 2500, y: 50 }, // Aiming straight East along row y=0
            sizeFeet: 100,
            widthFeet: 5
        };
        const cells = getAffectedGridCells(template, testGrid);
        // Excludes caster cell (0, 0)
        expect(cells.some(c => c.x === 0 && c.y === 0)).toBe(false);
        // Covers 20 cells from x=1 to x=20
        expect(cells.length).toBe(20);
        for (let x = 1; x <= 20; x++) {
            expect(cells.some(c => c.x === x && c.y === 0)).toBe(true);
        }
    });

    describe("3D Segment Distance and Sphere Intersection", () => {
        const testGrid: GridInfo = {
            dpi: 100, // 100px = 5ft => 20px per foot
            scaleMultiplier: 5
        };

        it("calculates 3D distance from point to segment correctly on ground", () => {
            // Segment from (-200, 0, 0) to (200, 0, 0) (x=-10ft to +10ft)
            // Point C at (0, 0, 0) is on the segment => distance 0
            const a: Point3D = { x: -200, y: 0, z: 0 };
            const b: Point3D = { x: 200, y: 0, z: 0 };
            const c: Point3D = { x: 0, y: 0, z: 0 };

            expect(distancePoint3DToSegment3DFeet(c, a, b, testGrid)).toBeCloseTo(0, 5);
        });

        it("detects sphere intersection when segment passes through sphere in 3D", () => {
            // Sphere at center (0, 0, 0) with radius 15ft
            const sphere: Point3D = { x: 0, y: 0, z: 0 };
            // Segment passing through center at height z = 5ft
            const caster: Point3D = { x: -600, y: 0, z: 5 }; // -30ft
            const target: Point3D = { x: 600, y: 0, z: 5 }; // +30ft

            expect(doesSegmentIntersectSphere3D(caster, target, sphere, 15, testGrid)).toBe(true);
        });

        it("detects segment passing OVER sphere when caster flies high enough", () => {
            // Sphere at center (0, 0, 0) with radius 15ft
            const sphere: Point3D = { x: 0, y: 0, z: 0 };
            // Caster flying at 35ft height at x=-600 (-30ft), target on ground at x=600 (+30ft, z=0)
            // Midpoint at x=0 has height z = 17.5ft > 15ft radius!
            const caster: Point3D = { x: -600, y: 0, z: 35 };
            const target: Point3D = { x: 600, y: 0, z: 0 };

            expect(doesSegmentIntersectSphere3D(caster, target, sphere, 15, testGrid)).toBe(false);
        });

        it("detects flying caster directly above darkness sphere targeting outside", () => {
            // Sphere at center (0, 0, 0) with radius 15ft
            const sphere: Point3D = { x: 0, y: 0, z: 0 };
            // Caster hovering directly above sphere center at 30ft height (x=0, y=0, z=30)
            // Target is outside at x=1000 (50ft away), z=0
            const caster: Point3D = { x: 0, y: 0, z: 30 };
            const target: Point3D = { x: 1000, y: 0, z: 0 };

            // Segment goes from (0, 0, 30) to (50, 0, 0) ft. Shortest dist to (0,0,0) is > 15ft
            expect(doesSegmentIntersectSphere3D(caster, target, sphere, 15, testGrid)).toBe(false);
        });
    });
});

