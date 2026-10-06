import { describe, it, expect } from "vitest";
import {
    distancePointToSegmentFeet,
    doesSegmentIntersectDarkness,
    evaluateLineOfSight,
    extractDarknessZones,
    readTokenVisionRules,
    DARKNESS_ZONE_METADATA_KEY,
    TOKEN_VISION_METADATA_KEY
} from "./lineOfSightService";
import { GridInfo } from "../domain/targetingGeometry";
import { DarknessZone } from "../domain/vision";

describe("lineOfSightService", () => {
    const grid: GridInfo = {
        dpi: 150,
        scaleMultiplier: 5,
        cellCenterOffset: { x: 75, y: 75 }
    };

    describe("distancePointToSegmentFeet", () => {
        it("calculates 0 distance when point is on segment", () => {
            const a = { x: 0, y: 0 };
            const b = { x: 300, y: 0 }; // 10 ft
            const c = { x: 150, y: 0 }; // midpoint
            expect(distancePointToSegmentFeet(c, a, b, grid)).toBeCloseTo(0);
        });

        it("calculates perpendicular distance", () => {
            const a = { x: 0, y: 0 };
            const b = { x: 300, y: 0 };
            const c = { x: 150, y: 150 }; // 1 cell (5 ft) perpendicular
            expect(distancePointToSegmentFeet(c, a, b, grid)).toBeCloseTo(5);
        });

        it("calculates distance to closest endpoint when beyond segment", () => {
            const a = { x: 0, y: 0 };
            const b = { x: 300, y: 0 };
            const c = { x: 450, y: 0 }; // 5 ft past b
            expect(distancePointToSegmentFeet(c, a, b, grid)).toBeCloseTo(5);
        });
    });

    describe("doesSegmentIntersectDarkness", () => {
        const darkness: DarknessZone = {
            id: "dark-1",
            position: { x: 150, y: 0 },
            radiusFeet: 15 // 15 ft radius
        };

        it("returns true if line of sight passes through darkness center", () => {
            const caster = { x: 0, y: 0 };
            const target = { x: 300, y: 0 };
            expect(doesSegmentIntersectDarkness(caster, target, darkness, grid)).toBe(true);
        });

        it("returns false if line of sight passes well outside darkness radius", () => {
            const caster = { x: 0, y: 600 }; // 20 ft away vertically
            const target = { x: 300, y: 600 };
            expect(doesSegmentIntersectDarkness(caster, target, darkness, grid)).toBe(false);
        });
    });

    describe("evaluateLineOfSight", () => {
        const darkness: DarknessZone = {
            id: "dark-1",
            position: { x: 300, y: 0 }, // 10 ft away
            radiusFeet: 15,
            sourceCasterId: "caster-1"
        };
        const caster = { x: 0, y: 0 };
        const target = { x: 600, y: 0 }; // 20 ft away, across darkness

        it("passes if no darkness zones present", () => {
            const res = evaluateLineOfSight(caster, target, [], grid);
            expect(res.canSee).toBe(true);
            expect(res.isBlockedByDarkness).toBe(false);
        });

        it("always allows DM to see through darkness", () => {
            const res = evaluateLineOfSight(caster, target, [darkness], grid, { isDM: true });
            expect(res.canSee).toBe(true);
            expect(res.isBlockedByDarkness).toBe(false);
        });

        it("blocks player without special senses", () => {
            const res = evaluateLineOfSight(caster, target, [darkness], grid, { isDM: false });
            expect(res.canSee).toBe(false);
            expect(res.isBlockedByDarkness).toBe(true);
            expect(res.reason).toContain("Magical Darkness");
        });

        it("allows player with Devil's Sight within 120 ft", () => {
            const res = evaluateLineOfSight(caster, target, [darkness], grid, {
                isDM: false,
                visionRules: { devilsSight: true }
            });
            expect(res.canSee).toBe(true);
            expect(res.reason).toBe("Devil's Sight");
        });

        it("allows player with Truesight if target is within range", () => {
            const res = evaluateLineOfSight(caster, target, [darkness], grid, {
                isDM: false,
                visionRules: { truesight: 30 } // target is at 20 ft
            });
            expect(res.canSee).toBe(true);
            expect(res.reason).toBe("Truesight");
        });

        it("blocks Truesight if target is beyond truesight range", () => {
            const res = evaluateLineOfSight(caster, target, [darkness], grid, {
                isDM: false,
                visionRules: { truesight: 10 } // target is at 20 ft
            });
            expect(res.canSee).toBe(false);
            expect(res.isBlockedByDarkness).toBe(true);
        });

        it("allows Blind Fighting within 10 ft", () => {
            const closeTarget = { x: 300, y: 0 }; // 10 ft away
            const res = evaluateLineOfSight(caster, closeTarget, [darkness], grid, {
                isDM: false,
                visionRules: { blindFighting: 10 }
            });
            expect(res.canSee).toBe(true);
            expect(res.reason).toBe("Blind Fighting");
        });

        it("handles Shadow Monk Sight with source-only restriction", () => {
            // Own darkness
            const resOwn = evaluateLineOfSight(caster, target, [darkness], grid, {
                isDM: false,
                casterId: "caster-1",
                visionRules: {
                    shadowMonkSight: { enabled: true, sourceOnly: true, range: 60 }
                }
            });
            expect(resOwn.canSee).toBe(true);

            // Enemy's darkness
            const resEnemy = evaluateLineOfSight(caster, target, [darkness], grid, {
                isDM: false,
                casterId: "other-caster",
                visionRules: {
                    shadowMonkSight: { enabled: true, sourceOnly: true, range: 60 }
                }
            });
            expect(resEnemy.canSee).toBe(false);
        });

        it("allows vision when opacityMode is always-transparent", () => {
            const res = evaluateLineOfSight(caster, target, [darkness], grid, {
                isDM: false,
                opacityMode: "always-transparent"
            });
            expect(res.canSee).toBe(true);
            expect(res.isBlockedByDarkness).toBe(false);
        });

        it("blocks vision when opacityMode is always-opaque even with Devil's Sight", () => {
            const res = evaluateLineOfSight(caster, target, [darkness], grid, {
                isDM: false,
                opacityMode: "always-opaque",
                visionRules: { devilsSight: true }
            });
            expect(res.canSee).toBe(false);
            expect(res.isBlockedByDarkness).toBe(true);
            expect(res.reason).toContain("Always Opaque mode");
        });

        it("allows vision when darkness zone itself is marked transparent", () => {
            const transparentZone: DarknessZone = { ...darkness, transparent: true };
            const res = evaluateLineOfSight(caster, target, [transparentZone], grid, {
                isDM: false,
                opacityMode: "dynamic"
            });
            expect(res.canSee).toBe(true);
            expect(res.isBlockedByDarkness).toBe(false);
        });
    });

    describe("metadata helpers", () => {
        it("extracts darkness zones and vision rules", () => {
            const mockDarkItem: any = {
                id: "d1",
                position: { x: 100, y: 200 },
                metadata: {
                    [DARKNESS_ZONE_METADATA_KEY]: { radiusFeet: 15, sourceCasterId: "char-1" }
                }
            };
            const mockCharItem: any = {
                id: "c1",
                metadata: {
                    [TOKEN_VISION_METADATA_KEY]: { devilsSight: true, darkvision: 60 }
                }
            };

            const zones = extractDarknessZones([mockDarkItem]);
            expect(zones.length).toBe(1);
            expect(zones[0].radiusFeet).toBe(15);
            expect(zones[0].transparent).toBe(false);

            const vision = readTokenVisionRules(mockCharItem);
            expect(vision.devilsSight).toBe(true);
            expect(vision.darkvision).toBe(60);
        });

        it("does not treat darkness as transparent just because effectName contains transparent", () => {
            const effectItem: any = {
                id: "d2",
                position: { x: 100, y: 200 },
                metadata: {
                    "eu.armindo.embers/effect-id": "darkness.black.transparent",
                    [DARKNESS_ZONE_METADATA_KEY]: { radiusFeet: 15, transparent: "$transparent" }
                }
            };
            const zones = extractDarknessZones([effectItem]);
            expect(zones.length).toBe(1);
            expect(zones[0].transparent).toBe(false);
        });

        it("treats darkness as transparent only when metadata.transparent is boolean true", () => {
            const effectItem: any = {
                id: "d3",
                position: { x: 100, y: 200 },
                metadata: {
                    [DARKNESS_ZONE_METADATA_KEY]: { radiusFeet: 15, transparent: true }
                }
            };
            const zones = extractDarknessZones([effectItem]);
            expect(zones.length).toBe(1);
            expect(zones[0].transparent).toBe(true);
        });

        it("detects targetInDarkness when target is inside the darkness zone", () => {
            const darkZone = {
                id: "z1",
                position: { x: 100, y: 100 },
                radiusFeet: 15,
                transparent: false
            };
            const grid = { dpi: 150, scaleMultiplier: 5 };
            // Target is 10ft from zone center (inside 15ft radius)
            // 10ft / 5 * 150 = 300px
            const targetInside = { x: 100, y: 400 };
            const casterOutside = { x: 100, y: 800 };

            const result = evaluateLineOfSight(casterOutside, targetInside, [darkZone], grid);
            expect(result.canSee).toBe(false);
            expect(result.isBlockedByDarkness).toBe(true);
            expect(result.targetInDarkness).toBe(true);
        });
    });
});
