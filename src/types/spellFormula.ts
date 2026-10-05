/**
 * SpellFormula Type System
 *
 * V1 scope: Display formula data in ActionDock drawer/tooltip.
 */

// ─── Category Types ────────────────────────────────────────────────────────────

export type SpellSchool =
  | "abjuration"
  | "conjuration"
  | "divination"
  | "enchantment"
  | "evocation"
  | "illusion"
  | "necromancy"
  | "transmutation"
  | "any";

export type SpellType = "cantrip" | "spell";

export type AbilityKey = "STR" | "DEX" | "CON" | "INT" | "WIS" | "CHA";

export type DamageType =
  | "acid"
  | "bludgeoning"
  | "cold"
  | "fire"
  | "force"
  | "lightning"
  | "necrotic"
  | "piercing"
  | "poison"
  | "psychic"
  | "radiant"
  | "slashing"
  | "thunder"
  // Special tokens
  | "weapon" // inherits equipped weapon damage type
  | "choice" // player picks at cast time
  | "healing";

/** Category block — determines grouping, filtering, and display badges */
export interface SpellCategory {
  spellType: SpellType;
  school: SpellSchool;
  /** 0 = cantrip, 1–9 = leveled spell */
  level: number;
  /** Class(es) that grant this spell, e.g. ["sorcerer", "wizard"] */
  classes: string[];
  source?: string;
  concentration: boolean;
  ritual: boolean;
}

// ─── Damage Formula ────────────────────────────────────────────────────────────

export interface SpellDamageFormula {
  /** Dice string: "1d8", "2d6", "weapon+1step", "0" (utility) */
  dice: string;
  type: DamageType;
  /** Available when type === "choice" */
  typeChoices?: DamageType[];
  /** True for the primary damage roll (not a rider/secondary) */
  isBase: boolean;
  /** Human-readable trigger condition for non-base dice */
  condition?: string; // e.g. "on move", "end of turn", "on failed save"
}

// ─── Special Mechanics ─────────────────────────────────────────────────────────

/** Exploding dice: rolling max value adds another die (e.g. Sorcerous Burst) */
export interface MechanicExploding {
  kind: "exploding";
  /** Die face value that triggers an explosion */
  triggerValue: number;
  /** Die to add on explosion, e.g. "1d8" */
  addDice: string;
  /** Maximum extra dice that can be added */
  maxExtra: number | "spellcastingMod";
  
}

export interface MechanicExplodingAnyDie {
  kind: "exploding_any_die";
  maxExtra: number | "spellcastingMod";
}

/** Weapon die step upgrade (e.g. Frigid Blade: d4→d6→d8→d10→d12) */
export interface MechanicWeaponStepUpgrade {
  kind: "weapon_step_upgrade";
  steps: number;
  
}

/** Conditional rider damage appended when a condition is met */
export interface MechanicRider {
  kind: "rider";
  condition: string;
  dice: string;
  type: DamageType;
}

/** Damage over time per turn (concentration spells) */
export interface MechanicConcentrationDot {
  kind: "concentration_dot";
  dice: string;
  type: DamageType;
  saveDC?: boolean;
  
}

/** Conditional trigger damage applied deferred when a condition is met (e.g. Booming Blade, Vengeful Blade) */
export type TriggerConditionKind =
  | "movement"
  | "action_attack_or_cast"
  | "start_of_turn"
  | "end_of_turn"
  | "took_damage"
  | "manual";

export interface MechanicConditionalTrigger {
  kind: "conditional_trigger";
  triggerCondition: TriggerConditionKind;
  conditionDesc?: string;
  damageDice: string;
  damageType: DamageType;
  duration?: "start_of_caster_next_turn" | "end_of_turn" | "1_minute";
  cantripScaleTiers?: CantripScaleTier[];
}

export type SpellMechanic =
  | MechanicExploding
  | MechanicExplodingAnyDie
  | MechanicWeaponStepUpgrade
  | MechanicRider
  | MechanicConcentrationDot
  | MechanicConditionalTrigger;

// ─── Scaling ───────────────────────────────────────────────────────────────────

export interface CantripScaleTier {
  /** Minimum character level to reach this tier */
  minLevel: number;
  /** Total base dice at this tier, e.g. "2d8" */
  totalDice: string;
  /** Optional per-damage-entry dice for spells with conditional alternatives. */
  damageDice?: string[];
}

/**
 * Cantrip scaling block.
 * Standard D&D 5e cantrips scale at levels 5, 11, and 17.
 */
export interface CantripScale {
  tiers: CantripScaleTier[];
  /**
   * How the scaling works:
   * - "add_dice"    → extra dice added on top of base (e.g. Sorcerous Burst extra Cold)
   * - "replace"     → totalDice replaces the base dice (e.g. standard cantrip scaling)
   * - "weapon_step" → weapon die steps up (Frigid Blade base)
   */
  scaleMode: "add_dice" | "replace" | "weapon_step";
  /** Damage type of the extra scaling dice if different from base */
  extraDamageType?: DamageType;
}

/** Upcast scaling for leveled spells */
export interface UpcastFormula {
  /** Human-readable upcast description, e.g. "+1d6 per slot level above 1st" */
  notes: string;
  /** Dice added per slot level above base */
  perSlotLevel?: { dice: string; type?: DamageType };
  /** Specific breakpoints override perSlotLevel */
  breakpoints?: Record<number, { dice: string; notes?: string }>;
  
}

// ─── Interaction (Attack / Save) ───────────────────────────────────────────────

export type InteractionType =
  | "spell_attack" // ranged spell attack roll
  | "melee_spell_attack" // melee spell attack roll
  | "save" // target makes a saving throw
  | "utility" // no attack or save
  | "weapon_based"; // uses weapon attack roll (melee spell cantrips)

export interface SpellInteraction {
  type: InteractionType;
  /** Which ability the target saves against */
  saveAbility?: AbilityKey;
  /** True = use spellcasting modifier instead of STR/DEX (e.g. Frigid Blade) */
  useSpellcastingMod?: boolean;
  /** Optional ranged delivery for weapon cantrips that can attack beyond melee reach. */
  weaponAttack?: {
    meleeRangeFeet?: number;
    rangedSpellAttack?: { rangeFeet: number; damageType: DamageType };
  };
  
}

// ─── Root Interface ────────────────────────────────────────────────────────────

export interface SpellFormula {
  /** Matches the spell ID used in dockSpells / DDBParsedSpell */
  id: string;
  name: string;

  /** Category: spellType, school, level, classes, concentration, ritual */
  category: SpellCategory;

  /** Casting parameters for display */
  casting: {
    time: string; // "1 action", "1 bonus action", "1 reaction"
    range: string; // "Self", "120 ft.", "Touch"
    components: string; // "V, S", "S, M (a melee weapon...)"
    duration: string; // "Instantaneous", "Concentration, up to 1 minute"
  };

  /** Attack or save type. Absent for utility spells. */
  interaction?: SpellInteraction;

  /** Rules data for an area template; runtime damage is resolved per selected target. */
  area?: {
    shape:
      | "Sphere"
      | "Cone"
      | "Cube"
      | "Line"
      | "Cylinder"
      | "Emanation"
      | "Circle"
      | "Wall";
    sizeFeet: number;
    heightFeet?: number;
    thicknessFeet?: number;
  };

  /** Concise implementation notes for effects that need turn/state tracking or GM adjudication. */
  effectNotes?: string[];

  /** Explicitly separates source review, runtime coverage, and live playtesting. */
  implementation?: {
    sourceStatus: "checked" | "unchecked";
    runtimeStatus: "assisted" | "manual";
    playtestStatus: "not-tested" | "passed" | "failed";
    manualSteps: string[];
  };

  /** All damage formulae for this spell (base + conditional riders) */
  damage: SpellDamageFormula[];

  /** Cantrip tier scaling. Only set when category.spellType === "cantrip". */
  cantripScale?: CantripScale;

  /** Upcast scaling. Only set when category.level >= 1. */
  upcasting?: UpcastFormula;

  /** Special mechanics beyond a simple roll */
  mechanics?: SpellMechanic[];

  /**
   * True when this record was written by hand in a manual-formulas file.
   * False when auto-generated by SpellFormulaBuilder from DDB data.
   */
  isManualOverride: boolean;

  /** Free-text notes visible in the drawer (edge cases, designer intent, etc.) */
  notes?: string;
}

// ─── Registry Lookup Helper Types ──────────────────────────────────────────────

/** Lightweight summary used in tooltip / table cells */
export interface SpellFormulaSummary {
  id: string;
  name: string;
  spellType: SpellType;
  school: SpellSchool;
  /** Dice string resolved for the current character level */
  currentDice: string;
  damageType: DamageType;
  hasMechanic: boolean;
  mechanicLabel?: string; // e.g. "Exploding Dice", "Weapon Step"
}
