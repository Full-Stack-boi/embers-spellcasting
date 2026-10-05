/**
 * SpellFormulaBuilder
 *
 * Converts a DDBParsedSpell (from D&D Beyond API) into a SpellFormula.
 * Manual overrides from src/assets/manual-formulas/ take priority over
 * auto-generated data.
 *
 * V1: fields are populated for display purposes only.
 */

import type { DDBParsedSpell } from "../types/ddb";
import type {
    SpellFormula,
    SpellSchool,
    SpellType,
    SpellCategory,
    SpellDamageFormula,
    DamageType,
    InteractionType,
    CantripScale,
} from "../types/spellFormula";
import { ALL_MANUAL_OVERRIDES } from "../assets/manual-formulas/index";

// ─── School Normalizer ─────────────────────────────────────────────────────────

const SCHOOL_MAP: Record<string, SpellSchool> = {
    abjuration: "abjuration",
    conjuration: "conjuration",
    divination: "divination",
    enchantment: "enchantment",
    evocation: "evocation",
    illusion: "illusion",
    necromancy: "necromancy",
    transmutation: "transmutation",
};

function normalizeSchool(raw: string): SpellSchool {
    return SCHOOL_MAP[raw?.toLowerCase()] ?? "any";
}

// ─── Damage Type Normalizer ────────────────────────────────────────────────────

const DAMAGE_TYPE_MAP: Record<string, DamageType> = {
    acid: "acid",
    bludgeoning: "bludgeoning",
    cold: "cold",
    fire: "fire",
    force: "force",
    lightning: "lightning",
    necrotic: "necrotic",
    piercing: "piercing",
    poison: "poison",
    psychic: "psychic",
    radiant: "radiant",
    slashing: "slashing",
    thunder: "thunder",
    healing: "healing",
};

function normalizeDamageType(raw?: string): DamageType {
    if (!raw) return "force";
    return DAMAGE_TYPE_MAP[raw.toLowerCase()] ?? "force";
}

// ─── Interaction Type Inference ────────────────────────────────────────────────

function inferInteractionType(saveOrAttack?: string): InteractionType {
    if (!saveOrAttack) return "utility";
    const lower = saveOrAttack.toLowerCase();
    if (lower.includes("melee spell") || lower.includes("melee attack")) return "melee_spell_attack";
    if (lower.includes("spell attack") || lower.includes("ranged")) return "spell_attack";
    if (lower.includes("save")) return "save";
    return "utility";
}

// ─── Cantrip Scale Inference ───────────────────────────────────────────────────

/**
 * Infers a standard 4-tier cantrip scale from the spell's damage string.
 * Standard D&D 5e cantrips: lv1 / lv5 / lv11 / lv17
 * e.g. damage "1d10" → tiers "1d10", "2d10", "3d10", "4d10"
 */
function inferCantripScale(baseDice: string): CantripScale | undefined {
    // Match dice notation like "1d6", "1d10", "1d12"
    const match = baseDice.match(/^(\d+)(d\d+)$/);
    if (!match) return undefined;

    const die = match[2]; // e.g. "d10"
    return {
        tiers: [
            { minLevel: 1,  totalDice: `1${die}` },
            { minLevel: 5,  totalDice: `2${die}` },
            { minLevel: 11, totalDice: `3${die}` },
            { minLevel: 17, totalDice: `4${die}` },
        ],
        scaleMode: "replace",
    };
}

// ─── Damage Formula Inference ──────────────────────────────────────────────────

function inferDamageFormulae(spell: DDBParsedSpell): SpellDamageFormula[] {
    if (!spell.damage) return [];

    return [
        {
            dice: spell.damage,
            type: normalizeDamageType(spell.damageType),
            isBase: true,
        },
    ];
}

// ─── Category Builder ──────────────────────────────────────────────────────────

function buildCategory(spell: DDBParsedSpell): SpellCategory {
    const spellType: SpellType = spell.level === 0 ? "cantrip" : "spell";
    return {
        spellType,
        school: normalizeSchool(spell.school),
        level: spell.level,
        classes: spell.castingClass ? [spell.castingClass.toLowerCase()] : [],
        concentration: spell.concentration,
        ritual: spell.ritual,
    };
}

// ─── ID Normalizer ─────────────────────────────────────────────────────────────

/**
 * Converts a spell name/id to a normalized lookup key.
 * e.g. "Sorcerous Burst" → "sorcerous_burst"
 *      "fire_bolt" → "fire_bolt"
 */
export function normalizeSpellId(raw: string): string {
    return raw
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_|_$/g, "");
}

function addDiceNotation(base: string, extra: string): string {
    const first = base.match(/^(\d+)d(\d+)$/i);
    const second = extra.match(/^(\d+)d(\d+)$/i);
    if (first && second && first[2] === second[2]) return `${Number(first[1]) + Number(second[1])}d${first[2]}`;
    return `${base}+${extra}`;
}

export function resolveFormulaDamageDice(formula: SpellFormula, characterLevel: number, castSlotLevel = formula.category.level): string | undefined {
    const base = formula.damage.find(entry => entry.isBase)?.dice;
    if (!base) return undefined;
    if (formula.cantripScale) {
        const tier = formula.cantripScale.tiers.filter(item => item.minLevel <= characterLevel).sort((a, b) => b.minLevel - a.minLevel)[0];
        if (tier) return tier.totalDice;
    }
    const perSlot = formula.upcasting?.perSlotLevel;
    const slotLevels = Math.max(0, castSlotLevel - formula.category.level);
    if (!perSlot || slotLevels === 0) return base;
    const extraMatch = perSlot.dice.match(/^(\d+)d(\d+)$/i);
    const extra = extraMatch ? `${Number(extraMatch[1]) * slotLevels}d${extraMatch[2]}` : perSlot.dice;
    return addDiceNotation(base, extra);
}

// ─── Main Builder ──────────────────────────────────────────────────────────────

/**
 * Builds a SpellFormula from a DDBParsedSpell.
 * If a manual override exists for this spell ID, it is returned as-is (preferred).
 * Otherwise, an auto-generated formula is produced from DDB data.
 */
export function buildSpellFormula(spell: DDBParsedSpell): SpellFormula {
    // 1. Check manual overrides (by spell id and by normalized name)
    const byId = ALL_MANUAL_OVERRIDES[spell.id];
    const byName = ALL_MANUAL_OVERRIDES[normalizeSpellId(spell.name)];
    if (byId) return byId;
    if (byName) return byName;

    // 2. Auto-generate from DDB data
    const category = buildCategory(spell);
    const interactionType = inferInteractionType(spell.saveOrAttack);
    const damageFormulae = inferDamageFormulae(spell);

    const formula: SpellFormula = {
        id: spell.id,
        name: spell.name,
        category,
        casting: {
            time: spell.castingTime,
            range: spell.rangeText,
            components: spell.components,
            duration: spell.duration,
        },
        area: spell.aoe ? { shape: spell.aoe.shape, sizeFeet: spell.aoe.size } : undefined,
        interaction: interactionType !== "utility"
            ? { type: interactionType }
            : undefined,
        damage: damageFormulae,
        isManualOverride: false,
        notes: spell.notes || undefined,
    };

    // 3. Cantrip scale (auto-inferred from base damage dice)
    if (category.spellType === "cantrip" && spell.damage) {
        formula.cantripScale = inferCantripScale(spell.damage);
    }

    // 4. Upcast (leveled spells with higherLevels text)
    if (category.level >= 1 && spell.higherLevels) {
        formula.upcasting = {
            notes: spell.higherLevels,
            
        };
    }

    return formula;
}

/**
 * Resolves a SpellFormula from a partial spell object or DDBParsedSpell.
 * Useful when working with local dock spell items or fallback objects.
 */
export function resolveSpellFormula(spell: {
    id: string;
    name: string;
    level: number;
    school: string;
    castingTime?: string;
    rangeText?: string;
    damage?: string;
    damageType?: string;
    notes?: string;
    rawDdbSpell?: DDBParsedSpell;
}): SpellFormula {
    if (spell.rawDdbSpell) {
        return buildSpellFormula(spell.rawDdbSpell);
    }
    const byId = ALL_MANUAL_OVERRIDES[spell.id];
    const byName = ALL_MANUAL_OVERRIDES[normalizeSpellId(spell.name)];
    if (byId) return byId;
    if (byName) return byName;

    return buildSpellFormula({
        id: spell.id,
        name: spell.name,
        level: spell.level,
        school: spell.school,
        castingTime: spell.castingTime || "1 action",
        range: 0,
        rangeText: spell.rangeText || "Self",
        duration: "Instantaneous",
        components: spell.notes || "V, S",
        concentration: false,
        ritual: false,
        damage: spell.damage,
        damageType: spell.damageType,
        description: "",
        canUpcast: spell.level > 0,
        isPrepared: true,
        source: "custom",
    });
}
