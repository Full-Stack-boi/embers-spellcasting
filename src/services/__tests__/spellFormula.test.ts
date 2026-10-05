import { describe, it, expect, vi } from "vitest";
import { buildSpellFormula, resolveFormulaDamageDice, resolveSpellFormula } from "../spellFormulaBuilder";
import { buildRegistry } from "../spellFormulaRegistry";
import type { DDBParsedSpell } from "../../types/ddb";
import { rollExplodingDice, rollFormulaWithExplosion } from "../../utils/dice";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { SpellFormulaDisplay } from "../../components/ActionDock/SpellFormulaDisplay";

describe("SpellFormula System", () => {
    it("resolves VSSPP2 cantrip scaling and leveled-spell upcasting from manual data", async () => {
        const { vsspp2SpellOverrides } = await import("../../assets/manual-formulas");
        expect(resolveFormulaDamageDice(vsspp2SpellOverrides.candy_blast, 11)).toBe("3d8");
        expect(resolveFormulaDamageDice(vsspp2SpellOverrides.cosmic_horror, 10, 5)).toBe("8d6");
        expect(resolveFormulaDamageDice(vsspp2SpellOverrides.rusting_grasp, 10, 5)).toBe("10d4");
    });

    describe("Manual Overrides", () => {
        it("loads Frigid Blade with weapon step and cold scale", () => {
            const formula = resolveSpellFormula({
                id: "frigid_blade",
                name: "Frigid Blade",
                level: 0,
                school: "Evocation",
            });

            expect(formula.id).toBe("frigid_blade");
            expect(formula.isManualOverride).toBe(true);
            expect(formula.category.spellType).toBe("cantrip");
            expect(formula.interaction?.useSpellcastingMod).toBe(true);

            // Base damage is weapon step upgrade
            expect(formula.damage[0].dice).toBe("weapon+1step");
            expect(formula.damage[0].type).toBe("choice");
            expect(formula.damage[0].typeChoices).toEqual(["cold", "weapon"]);

            // Mechanic check
            const mechanic = formula.mechanics?.find(m => m.kind === "weapon_step_upgrade");
            expect(mechanic).toBeDefined();

            // Cantrip scale
            expect(formula.cantripScale?.extraDamageType).toBe("cold");
            expect(formula.cantripScale?.tiers).toHaveLength(4);
            expect(formula.cantripScale?.tiers[1].totalDice).toBe("1d6"); // at lv5
        });

        it("shows additive weapon and cold damage as separate components", () => {
            const formula = resolveSpellFormula({
                id: "frigid_blade",
                name: "Frigid Blade",
                level: 0,
                school: "Evocation",
            });
            const markup = renderToStaticMarkup(createElement(SpellFormulaDisplay, {
                formula,
                charLevel: 5,
                onSelectDamageType: () => undefined,
            }));

            expect(markup).toContain("weapon+1step");
            expect(markup).toContain("1d6");
            expect(markup).toContain("Cantrip scaling");
            expect(markup).toContain("Select Damage Type:");
        });

        it("labels source, runtime, and playtest status independently", async () => {
            const { vsspp2SpellOverrides } = await import("../../assets/manual-formulas");
            const markup = renderToStaticMarkup(createElement(SpellFormulaDisplay, {
                formula: vsspp2SpellOverrides.flashback,
                charLevel: 9,
            }));
            expect(markup).toContain("SOURCE CHECKED");
            expect(markup).toContain("MANUAL RESOLUTION");
            expect(markup).toContain("NOT PLAYTESTED");
            expect(markup).toContain("GM adjudicates");
        });

        it("shows Toll the Dead's scaled damage alternatives with their conditions", () => {
            const formula = resolveSpellFormula({
                id: "toll_the_dead",
                name: "Toll the Dead",
                level: 0,
                school: "Necromancy",
            });
            const markup = renderToStaticMarkup(createElement(SpellFormulaDisplay, { formula, charLevel: 5 }));

            expect(markup).toContain("2d8");
            expect(markup).toContain("2d12");
            expect(markup).toContain("target at full HP");
            expect(markup).toContain("target is missing any HP");
        });

        it("loads Sorcerous Burst with exploding dice and choice damage type", () => {
            const formula = resolveSpellFormula({
                id: "sorcerous_burst",
                name: "Sorcerous Burst",
                level: 0,
                school: "Evocation",
            });

            expect(formula.id).toBe("sorcerous_burst");
            expect(formula.isManualOverride).toBe(true);
            expect(formula.damage[0].type).toBe("choice");
            expect(formula.damage[0].typeChoices).toContain("fire");
            expect(formula.damage[0].typeChoices).toContain("cold");

            // Exploding dice mechanic
            const mechanic = formula.mechanics?.find(m => m.kind === "exploding");
            expect(mechanic).toBeDefined();
            if (mechanic && mechanic.kind === "exploding") {
                expect(mechanic.triggerValue).toBe(8);
                expect(mechanic.addDice).toBe("1d8");
                expect(mechanic.maxExtra).toBe("spellcastingMod");
            }
        });
    });

    describe("Auto-generation from DDBParsedSpell", () => {
        it("generates formula for a standard spell", () => {
            const mockDdbSpell: DDBParsedSpell = {
                id: "acid_arrow",
                name: "Melf's Acid Arrow",
                level: 2,
                school: "Evocation",
                castingTime: "1 action",
                range: 90,
                rangeText: "90 ft.",
                duration: "Instantaneous",
                components: "V, S, M",
                concentration: false,
                ritual: false,
                damage: "4d4",
                damageType: "Acid",
                saveOrAttack: "Ranged Spell Attack",
                description: "A shimmering green arrow streaks toward a target.",
                higherLevels: "When you cast this spell using a spell slot of 3rd level or higher, the damage increases by 1d4 for each slot level above 2nd.",
                canUpcast: true,
                isPrepared: true,
                source: "class",
            };

            const formula = buildSpellFormula(mockDdbSpell);

            expect(formula.id).toBe("acid_arrow");
            expect(formula.isManualOverride).toBe(false);
            expect(formula.category.school).toBe("evocation");
            expect(formula.category.level).toBe(2);
            expect(formula.interaction?.type).toBe("spell_attack");
            expect(formula.damage[0].dice).toBe("4d4");
            expect(formula.damage[0].type).toBe("acid");
            expect(formula.upcasting?.notes).toContain("increases by 1d4");
        });

        it("infers standard cantrip scale from base dice", () => {
            const mockCantrip: DDBParsedSpell = {
                id: "custom_zap",
                name: "Custom Zap",
                level: 0,
                school: "Evocation",
                castingTime: "1 action",
                range: 60,
                rangeText: "60 ft.",
                duration: "Instantaneous",
                components: "V, S",
                concentration: false,
                ritual: false,
                damage: "1d8",
                damageType: "Lightning",
                saveOrAttack: "Ranged Spell Attack",
                description: "A zap of electricity.",
                canUpcast: false,
                isPrepared: true,
                source: "custom",
            };

            const formula = buildSpellFormula(mockCantrip);

            expect(formula.cantripScale).toBeDefined();
            expect(formula.cantripScale?.tiers).toEqual([
                { minLevel: 1, totalDice: "1d8" },
                { minLevel: 5, totalDice: "2d8" },
                { minLevel: 11, totalDice: "3d8" },
                { minLevel: 17, totalDice: "4d8" },
            ]);
        });
    });

    describe("SpellFormulaRegistry", () => {
        const spells: DDBParsedSpell[] = [
            {
                id: "fire_bolt",
                name: "Fire Bolt",
                level: 0,
                school: "Evocation",
                castingTime: "1 action",
                range: 120,
                rangeText: "120 ft.",
                duration: "Instantaneous",
                components: "V, S",
                concentration: false,
                ritual: false,
                damage: "1d10",
                damageType: "Fire",
                saveOrAttack: "Ranged Spell Attack",
                description: "You hurl a mote of fire.",
                canUpcast: false,
                isPrepared: true,
                source: "class",
            },
            {
                id: "sorcerous_burst",
                name: "Sorcerous Burst",
                level: 0,
                school: "Evocation",
                castingTime: "1 action",
                range: 120,
                rangeText: "120 ft.",
                duration: "Instantaneous",
                components: "V, S",
                concentration: false,
                ritual: false,
                description: "Burst of energy.",
                canUpcast: false,
                isPrepared: true,
                source: "class",
            },
        ];

        it("resolves cantrip dice scaling correctly by character level", () => {
            const registry = buildRegistry(spells);

            expect(registry.getCantripDice("fire_bolt", 1)).toBe("1d10");
            expect(registry.getCantripDice("fire_bolt", 4)).toBe("1d10");
            expect(registry.getCantripDice("fire_bolt", 5)).toBe("2d10");
            expect(registry.getCantripDice("fire_bolt", 10)).toBe("2d10");
            expect(registry.getCantripDice("fire_bolt", 11)).toBe("3d10");
            expect(registry.getCantripDice("fire_bolt", 17)).toBe("4d10");
            expect(registry.getCantripDice("fire_bolt", 20)).toBe("4d10");
        });

        it("filters spells by school and type", () => {
            const registry = buildRegistry(spells);

            const evocationSpells = registry.getBySchool("evocation");
            expect(evocationSpells).toHaveLength(2);

            const cantrips = registry.getByType("cantrip");
            expect(cantrips).toHaveLength(2);

            const leveled = registry.getByType("spell");
            expect(leveled).toHaveLength(0);
        });

        it("returns lightweight summary with mechanic label", () => {
            const registry = buildRegistry(spells);

            const summary = registry.getSummary("sorcerous_burst", 5);
            expect(summary).not.toBeNull();
            expect(summary?.currentDice).toBe("2d8");
            expect(summary?.hasMechanic).toBe(true);
            expect(summary?.mechanicLabel).toBe("Exploding Dice");
        });
    });

    describe("Exploding Dice Engine", () => {
        it("does not explode when roll is below trigger value", () => {
            vi.spyOn(Math, "random").mockReturnValue(0.5); // (0.5 * 8) + 1 = 5
            const res = rollExplodingDice(2, 8, 8, 3);
            expect(res.baseRolls).toEqual([5, 5]);
            expect(res.explodedRolls).toHaveLength(0);
            expect(res.explosionCount).toBe(0);
            expect(res.total).toBe(10);
            expect(res.breakdown).toBe("[5, 5] = 10");
            vi.restoreAllMocks();
        });

        it("explodes when an 8 is rolled on d8 and stays within maxExplosions cap", () => {
            // First die: 8, second die: 8, extra die: 3
            let call = 0;
            vi.spyOn(Math, "random").mockImplementation(() => {
                call++;
                if (call === 1) return 0.999; // 8 (explodes)
                if (call === 2) return 0.999; // 8 (explodes)
                if (call === 3) return 0.3;   // 3 (extra from 1st 8)
                if (call === 4) return 0.4;   // 4 (extra from 2nd 8)
                return 0.1;
            });

            // cap = 2
            const res = rollExplodingDice(2, 8, 8, 2);
            expect(res.baseRolls).toEqual([8, 8]);
            expect(res.explodedRolls).toEqual([3, 4]);
            expect(res.explosionCount).toBe(2);
            expect(res.total).toBe(23);
            expect(res.breakdown).toContain("[8, 8] + Exploded [3, 4] = 23 (2 bonus dice)");
            vi.restoreAllMocks();
        });

        it("parses formula and applies exploding dice cleanly without unnecessary emojis", () => {
            vi.spyOn(Math, "random").mockReturnValue(0.1);
            const res = rollFormulaWithExplosion("2d8", 8, 4);
            // Breakdown should be clean text/numbers only (ASCII)
            expect(res.breakdown).toMatch(/^[\x20-\x7E]+$/);
            vi.restoreAllMocks();
        });
    });
});

