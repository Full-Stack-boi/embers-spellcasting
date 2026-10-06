import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// Mock window and localStorage before importing modules that depend on OBR SDK
const store: Record<string, string> = {};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).localStorage = {
    getItem: (k: string) => store[k] ?? null,
    setItem: (k: string, v: string) => { store[k] = v; },
    removeItem: (k: string) => { delete store[k]; },
    clear: () => { Object.keys(store).forEach(k => delete store[k]); },
    key: (i: number) => Object.keys(store)[i] ?? null,
    length: 0,
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).window = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    localStorage: (globalThis as any).localStorage,
    location: { search: "" },
    addEventListener: () => {},
    removeEventListener: () => {}
};

const { getSpellRange, getSpellAoE, isTeleportSpell } = await import("../spells");
const { APP_KEY } = await import("../../config");

describe("Spell Range & AoE Accuracy Audit (D&D 5e Rules)", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    afterEach(() => {
        localStorage.clear();
        vi.restoreAllMocks();
    });

    describe("getSpellRange", () => {
        it("returns official 5e ranges for corrected spells", () => {
            expect(getSpellRange(undefined, "chain_lightning")).toBe(150);
            expect(getSpellRange(undefined, "call_lightning")).toBe(120);
            expect(getSpellRange(undefined, "fireball")).toBe(150);
            expect(getSpellRange(undefined, "burning_hands")).toBe(15);
            expect(getSpellRange(undefined, "melee_weapon_attack")).toBe(5);
            expect(getSpellRange(undefined, "eldritch_blast")).toBe(120);
            expect(getSpellRange(undefined, "arc_blade")).toBe(15);
            expect(getSpellRange(undefined, "frigid_blade")).toBe(5);
            expect(getSpellRange(undefined, "detect_magic")).toBe(0);
            expect(getSpellRange(undefined, "misty_step")).toBe(30);
            expect(getSpellRange(undefined, "thunder_step")).toBe(90);
            expect(getSpellRange(undefined, "dimension_door")).toBe(500);
            expect(getSpellRange(undefined, "fey_step")).toBe(30);
            expect(getSpellRange(undefined, "far_step")).toBe(60);
            expect(getSpellRange(undefined, "vortex_warp")).toBe(90);
            expect(getSpellRange(undefined, "shadow_step")).toBe(60);
            expect(getSpellRange(undefined, "relentless_hex")).toBe(30);
        });

        it("correctly identifies teleportation spells via isTeleportSpell", () => {
            expect(isTeleportSpell("misty_step")).toBe(true);
            expect(isTeleportSpell("Misty Step")).toBe(true);
            expect(isTeleportSpell("thunder_step")).toBe(true);
            expect(isTeleportSpell("dimension_door")).toBe(true);
            expect(isTeleportSpell("fey_step")).toBe(true);
            expect(isTeleportSpell("far_step")).toBe(true);
            expect(isTeleportSpell("vortex_warp")).toBe(true);
            expect(isTeleportSpell("shadow_step")).toBe(true);
            expect(isTeleportSpell("relentless_hex")).toBe(true);
            expect(isTeleportSpell("fireball")).toBe(false);
            expect(isTeleportSpell(undefined)).toBe(false);
        });
    });

    describe("getSpellAoE (Official 5e Radius and Dimensions)", () => {
        it("correctly identifies Fireball as 20ft radius Sphere (not 50ft)", () => {
            const aoe = getSpellAoE(undefined, "fireball");
            expect(aoe).toEqual({ shape: "Sphere", size: 20 });
        });

        it("uses the manual VSSPP2 area templates", () => {
            expect(getSpellAoE(undefined, "cosmic_horror")).toEqual({ shape: "Sphere", size: 10 });
            expect(getSpellAoE(undefined, "rocks_fall")).toEqual({ shape: "Sphere", size: 60 });
            expect(getSpellAoE(undefined, "sword_of_judgment")).toEqual({ shape: "Sphere", size: 20 });
        });

        it("correctly identifies Darkness as 15ft radius Sphere (not 30ft)", () => {
            const aoe = getSpellAoE(undefined, "darkness");
            expect(aoe).toEqual({ shape: "Sphere", size: 15 });
        });

        it("correctly identifies Shatter as 10ft radius Sphere (not 20ft)", () => {
            const aoe = getSpellAoE(undefined, "shatter");
            expect(aoe).toEqual({ shape: "Sphere", size: 10 });
        });

        it("correctly identifies Spirit Guardians as 15ft radius Sphere / Emanation (not 30ft)", () => {
            const aoe = getSpellAoE(undefined, "spirit_guardians");
            expect(aoe).toEqual({ shape: "Sphere", size: 15 });
        });

        it("correctly identifies Detect Magic as 30ft radius Sphere / Emanation on Self", () => {
            const aoe = getSpellAoE(undefined, "detect_magic");
            expect(aoe).toEqual({ shape: "Sphere", size: 30 });
        });

        it("correctly identifies Fog Cloud & Cloudkill as 20ft radius Sphere (not 40ft)", () => {
            expect(getSpellAoE(undefined, "fog_cloud")).toEqual({ shape: "Sphere", size: 20 });
            expect(getSpellAoE(undefined, "cloudkill")).toEqual({ shape: "Sphere", size: 20 });
        });

        it("correctly identifies Silence as 20ft radius Sphere (not 40ft)", () => {
            expect(getSpellAoE(undefined, "silence")).toEqual({ shape: "Sphere", size: 20 });
        });

        it("correctly identifies Moonbeam as 5ft radius Sphere / Cylinder (not 10ft)", () => {
            expect(getSpellAoE(undefined, "moonbeam")).toEqual({ shape: "Sphere", size: 5 });
        });

        it("correctly identifies Call Lightning as 60ft radius Sphere / Cloud (not 125ft)", () => {
            expect(getSpellAoE(undefined, "call_lightning")).toEqual({ shape: "Sphere", size: 60 });
        });

        it("correctly identifies Sleet Storm as 20ft (2024) or 40ft (2014) radius Sphere / Cylinder (not 25ft)", () => {
            const aoe = getSpellAoE(undefined, "sleet_storm");
            expect(aoe?.shape).toBe("Sphere");
            expect([20, 40]).toContain(aoe?.size);
        });

        it("correctly identifies Burning Hands as 15ft Cone (not 25ft)", () => {
            const aoe = getSpellAoE(undefined, "burning_hands");
            expect(aoe).toEqual({ shape: "Cone", size: 15 });
        });

        it("correctly identifies Thunderwave as 15ft Cube", () => {
            const aoe = getSpellAoE(undefined, "thunderwave");
            expect(aoe).toEqual({ shape: "Cube", size: 15 });
        });

        it("correctly identifies Lightning Bolt as 100ft Line", () => {
            const aoe = getSpellAoE(undefined, "lightning_bolt");
            expect(aoe).toEqual({ shape: "Line", size: 100 });
        });
    });

    describe("Legacy Parameter Sanitization (Old Cached Blueprints)", () => {
        it("normalizes legacy Fireball radius 10 cells (50ft) down to official 20ft", () => {
            localStorage.setItem(`${APP_KEY}/spell-parameters/fireball`, JSON.stringify({ radius: 10 }));
            const aoe = getSpellAoE(undefined, "fireball");
            expect(aoe).toEqual({ shape: "Sphere", size: 20 });
        });

        it("normalizes legacy Burning Hands length 5 cells (25ft) down to official 15ft", () => {
            localStorage.setItem(`${APP_KEY}/spell-parameters/burning_hands`, JSON.stringify({ length: 5 }));
            const aoe = getSpellAoE(undefined, "burning_hands");
            expect(aoe).toEqual({ shape: "Cone", size: 15 });
        });

        it("normalizes legacy Darkness radius 6 cells (30ft) down to official 15ft", () => {
            localStorage.setItem(`${APP_KEY}/spell-parameters/darkness`, JSON.stringify({ radius: 6 }));
            const aoe = getSpellAoE(undefined, "darkness");
            expect(aoe).toEqual({ shape: "Sphere", size: 15 });
        });

        it("normalizes legacy Call Lightning radius 25 cells (125ft) down to official 60ft", () => {
            localStorage.setItem(`${APP_KEY}/spell-parameters/call_lightning`, JSON.stringify({ radius: 25 }));
            const aoe = getSpellAoE(undefined, "call_lightning");
            expect(aoe).toEqual({ shape: "Sphere", size: 60 });
        });
    });
});
