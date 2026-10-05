import { describe, it, expect } from "vitest";
import { getSpellBeamInfo } from "../spellBeamService";

describe("spellBeamService", () => {
    describe("Weapon Attacks", () => {
        it("returns 1 target for melee_weapon_attack", () => {
            const info = getSpellBeamInfo("melee_weapon_attack");
            expect(info.totalBeams).toBe(1);
            expect(info.isMultiBeam).toBe(false);
            expect(info.canSplitTargets).toBe(false);
        });

        it("returns 1 target for ranged_weapon_attack", () => {
            const info = getSpellBeamInfo("ranged_weapon_attack");
            expect(info.totalBeams).toBe(1);
            expect(info.isMultiBeam).toBe(false);
        });
    });

    describe("Single Target Cantrips and Spells", () => {
        it("returns 1 target for Sorcerous Burst at level 1 and level 5", () => {
            const lv1 = getSpellBeamInfo("sorcerous_burst", 1);
            expect(lv1.totalBeams).toBe(1);
            expect(lv1.isMultiBeam).toBe(false);

            const lv5 = getSpellBeamInfo("sorcerous_burst", 5);
            expect(lv5.totalBeams).toBe(1);
            expect(lv5.isMultiBeam).toBe(false);
        });

        it("returns 1 target for Fire Bolt at level 5 and level 11", () => {
            const lv5 = getSpellBeamInfo("fire_bolt", 5);
            expect(lv5.totalBeams).toBe(1);
            expect(lv5.isMultiBeam).toBe(false);

            const lv11 = getSpellBeamInfo("fire_bolt", 11);
            expect(lv11.totalBeams).toBe(1);
            expect(lv11.isMultiBeam).toBe(false);
        });

        it("returns 1 target for Sacred Flame (which had legacy maxTargets=2)", () => {
            const info = getSpellBeamInfo("sacred_flame");
            expect(info.totalBeams).toBe(1);
            expect(info.isMultiBeam).toBe(false);
        });

        it("returns 1 target for Ray of Frost and Toll the Dead", () => {
            expect(getSpellBeamInfo("ray_of_frost").totalBeams).toBe(1);
            expect(getSpellBeamInfo("toll_the_dead").totalBeams).toBe(1);
        });
    });

    describe("Multi-Beam Spells — Eldritch Blast", () => {
        it("returns 1 beam at character levels 1 to 4", () => {
            expect(getSpellBeamInfo("eldritch_blast", 1).totalBeams).toBe(1);
            expect(getSpellBeamInfo("eldritch_blast", 1).isMultiBeam).toBe(false);
            expect(getSpellBeamInfo("eldritch_blast", 4).totalBeams).toBe(1);
            expect(getSpellBeamInfo("eldritch_blast", 4).isMultiBeam).toBe(false);
        });

        it("returns 2 beams at character levels 5 to 10", () => {
            const info5 = getSpellBeamInfo("eldritch_blast", 5);
            expect(info5.totalBeams).toBe(2);
            expect(info5.isMultiBeam).toBe(true);
            expect(info5.canSplitTargets).toBe(true);
            expect(info5.beamUnit).toBe("Beam");

            const info10 = getSpellBeamInfo("eldritch_blast", 10);
            expect(info10.totalBeams).toBe(2);
            expect(info10.isMultiBeam).toBe(true);
        });

        it("returns 3 beams at character levels 11 to 16", () => {
            const info = getSpellBeamInfo("eldritch_blast", 11);
            expect(info.totalBeams).toBe(3);
            expect(info.isMultiBeam).toBe(true);
        });

        it("returns 4 beams at character levels 17+", () => {
            const info = getSpellBeamInfo("eldritch_blast", 17);
            expect(info.totalBeams).toBe(4);
            expect(info.isMultiBeam).toBe(true);

            const info20 = getSpellBeamInfo("eldritch_blast", 20);
            expect(info20.totalBeams).toBe(4);
            expect(info20.isMultiBeam).toBe(true);
        });
    });

    describe("Multi-Beam Leveled Spells — Scorching Ray & Magic Missile", () => {
        it("returns 3 rays for Scorching Ray at 2nd level, scales with slot level", () => {
            const base = getSpellBeamInfo("scorching_ray", 5, 2);
            expect(base.totalBeams).toBe(3);
            expect(base.isMultiBeam).toBe(true);
            expect(base.beamUnit).toBe("Ray");

            const upcast3 = getSpellBeamInfo("scorching_ray", 5, 3);
            expect(upcast3.totalBeams).toBe(4);

            const upcast5 = getSpellBeamInfo("scorching_ray", 9, 5);
            expect(upcast5.totalBeams).toBe(6);
        });

        it("returns 3 darts for Magic Missile at 1st level, scales with slot level", () => {
            const base = getSpellBeamInfo("magic_missile", 1, 1);
            expect(base.totalBeams).toBe(3);
            expect(base.isMultiBeam).toBe(true);
            expect(base.beamUnit).toBe("Dart");

            const upcast2 = getSpellBeamInfo("magic_missile", 3, 2);
            expect(upcast2.totalBeams).toBe(4);
        });
    });
});
