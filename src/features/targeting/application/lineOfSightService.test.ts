import { describe, it, expect } from "vitest";
import {
    distancePointToSegmentFeet,
    doesSegmentIntersectDarkness,
    evaluateLineOfSight,
    extractDarknessZones,
    isDarknessZoneFromCaster,
    readTokenVisionRules,
    DARKNESS_ZONE_METADATA_KEY,
    TOKEN_VISION_METADATA_KEY,
    isValidCombatTargetToken,
    ELEVATION_METADATA_KEY,
    readTokenElevation
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

        it("enforces sourceOnly: true on readTokenVisionRules for shadowMonkSight even if omitted in metadata", () => {
            const monkItem: any = {
                id: "monk-1",
                metadata: {
                    [TOKEN_VISION_METADATA_KEY]: {
                        shadowMonkSight: { enabled: true, range: 60 }
                    }
                }
            };
            const rules = readTokenVisionRules(monkItem);
            expect(rules.shadowMonkSight?.enabled).toBe(true);
            expect(rules.shadowMonkSight?.sourceOnly).toBe(true);
            expect(rules.shadowMonkSight?.range).toBe(60);
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

    describe("isDarknessZoneFromCaster", () => {
        const zone: DarknessZone = {
            id: "zone-1",
            position: { x: 0, y: 0 },
            radiusFeet: 15,
            sourceCasterId: "token-123",
            sourcePlayerId: "player-abc",
            sourceCharacterId: "170182790"
        };

        it("matches by direct token ID", () => {
            expect(isDarknessZoneFromCaster(zone, { id: "token-123" })).toBe(true);
            expect(isDarknessZoneFromCaster(zone, { id: "other-token" })).toBe(false);
        });

        it("matches by DDB character ID", () => {
            expect(isDarknessZoneFromCaster(zone, { characterId: "170182790" })).toBe(true);
            expect(isDarknessZoneFromCaster(zone, { characterId: 170182790 })).toBe(true);
            expect(isDarknessZoneFromCaster(zone, { characterId: "999999999" })).toBe(false);
        });

        it("rejects when token ID and character ID do not match", () => {
            expect(isDarknessZoneFromCaster(zone, { id: "other-token", characterId: "other-char" })).toBe(false);
            expect(isDarknessZoneFromCaster({ ...zone, sourceCasterId: undefined, sourceCharacterId: undefined }, { id: "token-123" })).toBe(false);
        });

        it("matches in evaluateLineOfSight via characterId or casterId", () => {
            const grid = { dpi: 150, scaleMultiplier: 5, cellCenterOffset: { x: 75, y: 75 } };
            const caster = { x: 0, y: 0 };
            const target = { x: 300, y: 0 };

            // Matching via characterId
            const resChar = evaluateLineOfSight(caster, target, [zone], grid, {
                isDM: false,
                characterId: "170182790",
                visionRules: {
                    shadowMonkSight: { enabled: true, sourceOnly: true, range: 60 }
                }
            });
            expect(resChar.canSee).toBe(true);

            // Matching via casterId (token ID)
            const resToken = evaluateLineOfSight(caster, target, [zone], grid, {
                isDM: false,
                casterId: "token-123",
                visionRules: {
                    shadowMonkSight: { enabled: true, sourceOnly: true, range: 60 }
                }
            });
            expect(resToken.canSee).toBe(true);

            // Mismatched enemy character
            const resEnemy = evaluateLineOfSight(caster, target, [zone], grid, {
                isDM: false,
                casterId: "other-token",
                characterId: "enemy-999",
                visionRules: {
                    shadowMonkSight: { enabled: true, sourceOnly: true, range: 60 }
                }
            });
            expect(resEnemy.canSee).toBe(false);
            expect(resEnemy.isBlockedByDarkness).toBe(true);
        });
    });

    describe("dynamic darkness movement", () => {
        it("re-evaluates LoS dynamically when darkness zone position changes", () => {
            const grid = { dpi: 150, scaleMultiplier: 5, cellCenterOffset: { x: 75, y: 75 } };
            const caster = { x: 0, y: 0 };
            const target = { x: 300, y: 0 };

            // Darkness in the middle (blocking line of sight)
            let movableDarkness: DarknessZone = {
                id: "drag-darkness-1",
                position: { x: 150, y: 0 },
                radiusFeet: 15,
                transparent: false
            };

            let res = evaluateLineOfSight(caster, target, [movableDarkness], grid);
            expect(res.canSee).toBe(false);
            expect(res.isBlockedByDarkness).toBe(true);

            // Drag darkness away to (150, 1000)
            movableDarkness = {
                ...movableDarkness,
                position: { x: 150, y: 1000 }
            };

            res = evaluateLineOfSight(caster, target, [movableDarkness], grid);
            expect(res.canSee).toBe(true);
            expect(res.isBlockedByDarkness).toBe(false);

            // Drag darkness back directly over target
            movableDarkness = {
                ...movableDarkness,
                position: { x: 300, y: 0 }
            };

            res = evaluateLineOfSight(caster, target, [movableDarkness], grid);
            expect(res.canSee).toBe(false);
            expect(res.isBlockedByDarkness).toBe(true);
            expect(res.targetInDarkness).toBe(true);
        });
    });

    describe("isValidCombatTargetToken", () => {
        it("identifies valid character and drawing tokens as targets", () => {
            const characterToken: any = {
                id: "token-1",
                layer: "CHARACTER",
                metadata: {}
            };
            const drawingToken: any = {
                id: "token-2",
                layer: "DRAWING",
                metadata: {}
            };
            expect(isValidCombatTargetToken(characterToken)).toBe(true);
            expect(isValidCombatTargetToken(drawingToken)).toBe(true);
        });

        it("rejects null or undefined items", () => {
            expect(isValidCombatTargetToken(null)).toBe(false);
            expect(isValidCombatTargetToken(undefined)).toBe(false);
        });

        it("rejects items on non-combat layers like ATTACHMENT, MAP, or PROP", () => {
            const attachmentItem: any = {
                id: "item-att",
                layer: "ATTACHMENT",
                metadata: {}
            };
            const mapItem: any = {
                id: "item-map",
                layer: "MAP",
                metadata: {}
            };
            expect(isValidCombatTargetToken(attachmentItem)).toBe(false);
            expect(isValidCombatTargetToken(mapItem)).toBe(false);
        });

        it("rejects draggable darkness zones even when placed on CHARACTER layer", () => {
            const draggableDarknessToken: any = {
                id: "darkness-token",
                layer: "CHARACTER",
                metadata: {
                    [DARKNESS_ZONE_METADATA_KEY]: { radiusFeet: 15 }
                }
            };
            expect(isValidCombatTargetToken(draggableDarknessToken)).toBe(false);
        });

        it("rejects spell effects and templates even when placed on CHARACTER layer", () => {
            const spellEffectToken: any = {
                id: "fireball-effect",
                layer: "CHARACTER",
                metadata: {
                    "eu.armindo.embers/effect-id": "spell.fireball.aoe"
                }
            };
            const spellItemToken: any = {
                id: "spell-marker",
                layer: "CHARACTER",
                metadata: {
                    "eu.armindo.embers/spell-id": "darkness"
                }
            };
            expect(isValidCombatTargetToken(spellEffectToken)).toBe(false);
            expect(isValidCombatTargetToken(spellItemToken)).toBe(false);
        });

        it("accepts elevated standalone token on ATTACHMENT layer", () => {
            const elevatedTarget: any = {
                id: "flying-enemy",
                type: "IMAGE",
                layer: "ATTACHMENT",
                metadata: {}
            };
            expect(isValidCombatTargetToken(elevatedTarget)).toBe(true);
        });

        it("rejects attached child items on ATTACHMENT layer even if image", () => {
            const auraAttachment: any = {
                id: "aura-item",
                type: "IMAGE",
                layer: "ATTACHMENT",
                attachedTo: "character-1",
                metadata: {}
            };
            expect(isValidCombatTargetToken(auraAttachment)).toBe(false);
        });
    });

    describe("readTokenElevation", () => {
        it("defaults to 0 when no elevation metadata is present", () => {
            expect(readTokenElevation(null)).toBe(0);
            expect(readTokenElevation(undefined)).toBe(0);
            expect(readTokenElevation({ metadata: {} } as any)).toBe(0);
        });

        it("reads elevation from ELEVATION_METADATA_KEY", () => {
            const item: any = {
                metadata: {
                    [ELEVATION_METADATA_KEY]: 30
                }
            };
            expect(readTokenElevation(item)).toBe(30);
        });

        it("reads elevation from official OBR elevation extension", () => {
            const item: any = {
                metadata: {
                    "rodeo.owlbear.elevation/elevation": "45"
                }
            };
            expect(readTokenElevation(item)).toBe(45);
        });

        it("reads elevation from battle-system elevation extension", () => {
            const item: any = {
                metadata: {
                    "com.battle-system.elevation/elevation": { elevation: 25 }
                }
            };
            expect(readTokenElevation(item)).toBe(25);
        });

        it("reads elevation from active Fly buff", () => {
            const item: any = {
                metadata: {
                    "eu.armindo.embers/active-buffs": [
                        { id: "fly_spell", name: "Fly", activatedAt: Date.now() }
                    ]
                }
            };
            expect(readTokenElevation(item)).toBe(30);
        });
    });

    describe("3D Elevation & Flight Line of Sight", () => {
        const grid: GridInfo = {
            dpi: 150, // 150px = 5ft => 30px per foot
            scaleMultiplier: 5,
            cellCenterOffset: { x: 75, y: 75 }
        };

        const darknessSphere: DarknessZone = {
            id: "dark-1",
            position: { x: 0, y: 0 },
            radiusFeet: 15,
            transparent: false
        };

        it("blocks line of sight on ground level across darkness", () => {
            // Caster at (-30ft, 0), Target at (+30ft, 0)
            const caster = { x: -900, y: 0 };
            const target = { x: 900, y: 0 };

            const res = evaluateLineOfSight(caster, target, [darknessSphere], grid, {
                casterElevation: 0,
                targetElevation: 0
            });
            expect(res.canSee).toBe(false);
            expect(res.isBlockedByDarkness).toBe(true);
        });

        it("allows line of sight when flying caster shoots OVER 15ft darkness sphere to target on ground", () => {
            // Caster at (-30ft, 0, z=35ft), Target at (+30ft, 0, z=0ft)
            // Midpoint over darkness center (0,0) is at z=17.5ft > 15ft!
            const caster = { x: -900, y: 0 };
            const target = { x: 900, y: 0 };

            const res = evaluateLineOfSight(caster, target, [darknessSphere], grid, {
                casterElevation: 35,
                targetElevation: 0
            });
            expect(res.canSee).toBe(true);
            expect(res.isBlockedByDarkness).toBe(false);
            expect(res.casterInDarkness).toBe(false);
            expect(res.targetInDarkness).toBe(false);
        });

        it("treats flying target above darkness as outside darkness", () => {
            // Target is at darkness center (0, 0) in 2D, but flying at 30ft in 3D
            const caster = { x: 900, y: 0 };
            const targetAboveDarkness = { x: 0, y: 0 };

            const res = evaluateLineOfSight(caster, targetAboveDarkness, [darknessSphere], grid, {
                casterElevation: 0,
                targetElevation: 30
            });
            expect(res.targetInDarkness).toBe(false);
            expect(res.canSee).toBe(true);
            expect(res.isBlockedByDarkness).toBe(false);
        });

        it("treats low-altitude target (<= 15ft) at darkness center as inside darkness", () => {
            // Target is hovering at 10ft height within the 15ft sphere
            const caster = { x: 900, y: 0 };
            const targetLow = { x: 0, y: 0 };

            const res = evaluateLineOfSight(caster, targetLow, [darknessSphere], grid, {
                casterElevation: 0,
                targetElevation: 10
            });
            expect(res.targetInDarkness).toBe(true);
            expect(res.canSee).toBe(false);
            expect(res.isBlockedByDarkness).toBe(true);
        });
    });
});
