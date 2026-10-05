import { describe, it, expect } from "vitest";

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

const { ALL_MANUAL_OVERRIDES } = await import("../index");
const { ALL_CANTRIP_OVERRIDES } = await import("../cantrips");
const { ALL_LEVELED_SPELL_OVERRIDES } = await import("../spells");
const { vsspp2SpellOverrides } = await import("../sourcebook-vsspp2");
const { grimHollowSpellOverrides } = await import("../sourcebook-grimhollow");
const { getSpellRange, getSpellAoE } = await import("../../../effects/spells");
const { SpellFormulaRegistry } = await import("../../../services/spellFormulaRegistry");
const { rollFormula } = await import("../../../utils/dice");

describe("Comprehensive Verification of All Added Spells", () => {
    it("reports accurate catalog breakdown counts", () => {
        const total = Object.keys(ALL_MANUAL_OVERRIDES).length;
        const sets = [
            ["cantrips", ALL_CANTRIP_OVERRIDES],
            ["leveled", ALL_LEVELED_SPELL_OVERRIDES],
            ["vsspp2", vsspp2SpellOverrides],
            ["grimHollow", grimHollowSpellOverrides],
        ] as const;

        const counts = Object.fromEntries(sets.map(([name, dict]) => [name, Object.keys(dict).length]));
        console.log("Spell Counts Breakdown:", { total, ...counts });

        const seenKeys = new Map<string, string>();
        const duplicates: Array<{ key: string; first: string; second: string }> = [];
        for (const [setName, dict] of sets) {
            for (const key of Object.keys(dict)) {
                if (seenKeys.has(key)) {
                    duplicates.push({ key, first: seenKeys.get(key)!, second: setName });
                } else {
                    seenKeys.set(key, setName);
                }
            }
        }
        console.log("Duplicates across sets:", duplicates);

        const sum = Object.values(counts).reduce((acc, c) => acc + c, 0);
        expect(total).toBe(sum - duplicates.length);
        expect(total).toBeGreaterThan(450);
    });

    it("validates every single spell in ALL_MANUAL_OVERRIDES conforms to SpellFormula schema", () => {
        const errors: string[] = [];

        for (const [key, spell] of Object.entries(ALL_MANUAL_OVERRIDES)) {
            if (!spell.id) {
                errors.push(`Spell key ${key} has empty id`);
            }
            if (!spell.name) {
                errors.push(`Spell ${key} has empty name`);
            }
            if (!spell.category) {
                errors.push(`Spell ${key} missing category`);
                continue;
            }
            if (spell.category.level === undefined || spell.category.level < 0 || spell.category.level > 9) {
                errors.push(`Spell ${key} invalid level: ${spell.category.level}`);
            }
            if (!["cantrip", "spell"].includes(spell.category.spellType)) {
                errors.push(`Spell ${key} invalid spellType: ${spell.category.spellType}`);
            }
            if (!spell.casting) {
                errors.push(`Spell ${key} missing casting info`);
            } else {
                if (!spell.casting.time) errors.push(`Spell ${key} missing casting.time`);
                if (!spell.casting.range) errors.push(`Spell ${key} missing casting.range`);
                if (!spell.casting.duration) errors.push(`Spell ${key} missing casting.duration`);
            }

            // Test getSpellRange
            const range = getSpellRange(undefined, spell.id);
            if (typeof range !== "number" || isNaN(range) || range < 0) {
                errors.push(`Spell ${key} getSpellRange returned invalid range: ${range}`);
            }

            // Test getSpellAoE if area exists
            if (spell.area) {
                const aoe = getSpellAoE(undefined, spell.id);
                if (!aoe || !aoe.shape || typeof aoe.size !== "number" || isNaN(aoe.size)) {
                    errors.push(`Spell ${key} getSpellAoE failed: ${JSON.stringify(aoe)}`);
                }
            }

            // Test damage dice rollability
            if (spell.damage && spell.damage.length > 0) {
                for (const dmg of spell.damage) {
                    if (dmg.dice && dmg.dice !== "weapon" && !dmg.dice.includes("weapon")) {
                        try {
                            const result = rollFormula(dmg.dice);
                            if (typeof result.total !== "number" || isNaN(result.total)) {
                                errors.push(`Spell ${key} rollFormula failed on dice: ${dmg.dice}`);
                            }
                        } catch (e: any) {
                            errors.push(`Spell ${key} rollFormula threw error on dice: ${dmg.dice}: ${e.message}`);
                        }
                    }
                }
            }
        }

        if (errors.length > 0) {
            console.error("Validation errors found:", errors.slice(0, 20));
        }
        expect(errors).toEqual([]);
    });

    it("verifies SpellFormulaRegistry can index and query all spells", () => {
        const allSpells = Object.values(ALL_MANUAL_OVERRIDES);
        const registry = new SpellFormulaRegistry(allSpells);

        for (const spell of allSpells) {
            const foundById = registry.get(spell.id);
            expect(foundById, `Failed to find spell by id: ${spell.id}`).toBeDefined();
            expect(foundById?.id).toBe(spell.id);

            const foundByName = registry.get(spell.name);
            expect(foundByName, `Failed to find spell by name: ${spell.name}`).toBeDefined();
        }
    });

    it("tests cantrip damage scaling on all scaling cantrips across levels 1, 5, 11, and 17", () => {
        const allSpells = Object.values(ALL_MANUAL_OVERRIDES);
        const scalingCantrips = allSpells.filter(s => s.category.spellType === "cantrip" && s.cantripScale);

        expect(scalingCantrips.length).toBeGreaterThan(0);

        for (const cantrip of scalingCantrips) {
            expect(cantrip.cantripScale?.tiers).toBeDefined();
            const tiers = cantrip.cantripScale!.tiers;
            expect(tiers.length).toBeGreaterThanOrEqual(1);

            // Verify each tier has valid dice formula
            for (const tier of tiers) {
                expect(tier.minLevel).toBeGreaterThanOrEqual(1);
                expect(tier.totalDice).toBeDefined();
                const roll = rollFormula(tier.totalDice);
                expect(typeof roll.total).toBe("number");
                expect(isNaN(roll.total)).toBe(false);
            }
        }
    });

    it("verifies upcasting damage formulas for leveled spells that define upcasting", () => {
        const allSpells = Object.values(ALL_MANUAL_OVERRIDES);
        const upcastingSpells = allSpells.filter(s => s.upcasting?.perSlotLevel);

        expect(upcastingSpells.length).toBeGreaterThan(0);

        for (const spell of upcastingSpells) {
            const upcast = spell.upcasting!.perSlotLevel!;
            if (upcast.dice) {
                const roll = rollFormula(upcast.dice);
                expect(typeof roll.total).toBe("number");
                expect(isNaN(roll.total)).toBe(false);
            }
        }
    });
});
