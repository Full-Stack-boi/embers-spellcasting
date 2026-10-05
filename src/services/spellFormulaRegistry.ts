/**
 * SpellFormulaRegistry
 *
 * A lightweight in-memory registry that maps spell IDs to SpellFormula objects.
 * Built once per character sync and queried by the ActionDock drawer/tooltips.
 *
 * Usage:
 *   const registry = buildRegistry(character.spells);
 *   const formula  = registry.get("fire_bolt");
 *   const tierDice = registry.getCantripDice("fire_bolt", charLevel);
 */

import type { DDBParsedSpell } from "../types/ddb";
import type {
    SpellFormula,
    SpellFormulaSummary,
    SpellSchool,
    SpellType,
} from "../types/spellFormula";
import { buildSpellFormula, normalizeSpellId } from "./spellFormulaBuilder";

// ─── Registry Class ────────────────────────────────────────────────────────────

export class SpellFormulaRegistry {
    private readonly _map: Map<string, SpellFormula>;

    constructor(formulas: SpellFormula[]) {
        this._map = new Map();
        for (const f of formulas) {
            // Index by original id first to guarantee exact id lookups
            this._map.set(f.id, f);
        }
        for (const f of formulas) {
            const normalized = normalizeSpellId(f.name);
            if (!this._map.has(normalized)) {
                this._map.set(normalized, f);
            }
        }
    }

    // ── Lookup ──────────────────────────────────────────────────────────────

    /** Returns the SpellFormula for a spell ID/name, or null if not found. */
    get(spellIdOrName: string): SpellFormula | null {
        return (
            this._map.get(spellIdOrName) ??
            this._map.get(normalizeSpellId(spellIdOrName)) ??
            null
        );
    }

    /** True if the registry has a formula for the given ID. */
    has(spellIdOrName: string): boolean {
        return this.get(spellIdOrName) !== null;
    }

    // ── Category Queries ────────────────────────────────────────────────────

    /** Returns all formulas matching the given spell school. */
    getBySchool(school: SpellSchool): SpellFormula[] {
        return this.all().filter(f => f.category.school === school);
    }

    /** Returns all cantrips or leveled spells. */
    getByType(spellType: SpellType): SpellFormula[] {
        return this.all().filter(f => f.category.spellType === spellType);
    }

    /** Returns all spells for a given class (e.g. "sorcerer"). */
    getByClass(className: string): SpellFormula[] {
        const lower = className.toLowerCase();
        return this.all().filter(f => f.category.classes.includes(lower));
    }

    /** Returns all formulas in the registry (de-duplicated by id). */
    all(): SpellFormula[] {
        const seen = new Set<string>();
        const result: SpellFormula[] = [];
        for (const formula of this._map.values()) {
            if (!seen.has(formula.id)) {
                seen.add(formula.id);
                result.push(formula);
            }
        }
        return result;
    }

    // ── Cantrip Scaling ─────────────────────────────────────────────────────

    /**
     * Returns the current dice string for a cantrip at the given character level.
     * e.g. getCantripDice("fire_bolt", 7) → "2d10"
     */
    getCantripDice(spellIdOrName: string, charLevel: number): string {
        const formula = this.get(spellIdOrName);
        if (!formula?.cantripScale) return "—";
        return resolveCantripTier(formula, charLevel);
    }

    // ── Summary ─────────────────────────────────────────────────────────────

    /** Returns a lightweight summary for table cells / tooltips. */
    getSummary(spellIdOrName: string, charLevel: number): SpellFormulaSummary | null {
        const formula = this.get(spellIdOrName);
        if (!formula) return null;

        const baseDamage = formula.damage.find(d => d.isBase);
        const mechanic = formula.mechanics?.[0];

        return {
            id: formula.id,
            name: formula.name,
            spellType: formula.category.spellType,
            school: formula.category.school,
            currentDice: formula.cantripScale
                ? resolveCantripTier(formula, charLevel)
                : (baseDamage?.dice ?? "—"),
            damageType: baseDamage?.type ?? "force",
            hasMechanic: (formula.mechanics?.length ?? 0) > 0,
            mechanicLabel: mechanic ? mechanicLabel(mechanic.kind) : undefined,
        };
    }
}

// ─── Cantrip Tier Resolver ─────────────────────────────────────────────────────

/**
 * Picks the highest tier whose minLevel is ≤ charLevel.
 * Falls back to the first tier if no match.
 */
function resolveCantripTier(formula: SpellFormula, charLevel: number): string {
    if (!formula.cantripScale) return "—";
    const tiers = [...formula.cantripScale.tiers].sort((a, b) => b.minLevel - a.minLevel);
    const tier = tiers.find(t => charLevel >= t.minLevel);
    return tier?.totalDice ?? formula.cantripScale.tiers[0]?.totalDice ?? "—";
}

// ─── Mechanic Label Helper ─────────────────────────────────────────────────────

function mechanicLabel(kind: string): string {
    switch (kind) {
        case "exploding":          return "Exploding Dice";
        case "weapon_step_upgrade": return "Weapon Step";
        case "rider":              return "Conditional Rider";
        case "concentration_dot":  return "DoT";
        default:                   return kind;
    }
}

// ─── Factory ───────────────────────────────────────────────────────────────────

/**
 * Builds a SpellFormulaRegistry from an array of DDBParsedSpell objects.
 * Call this once after a character sync.
 */
export function buildRegistry(spells: DDBParsedSpell[]): SpellFormulaRegistry {
    const formulas = spells.map(buildSpellFormula);
    return new SpellFormulaRegistry(formulas);
}

/** A singleton registry — replaced on each character sync. */
let _registry: SpellFormulaRegistry | null = null;

export function setActiveRegistry(registry: SpellFormulaRegistry): void {
    _registry = registry;
}

export function getActiveRegistry(): SpellFormulaRegistry | null {
    return _registry;
}
