/**
 * Manual Formula Override Index
 *
 * Merges all school-specific override files into one lookup map.
 * Import from this file — do NOT import individual override files directly.
 *
 * File organization:
 *   cantrips/  — Cantrips organized by school (evocation, transmutation, etc.)
 *   spells/    — Leveled spells (1st–9th) organized by school
 */

import { ALL_CANTRIP_OVERRIDES } from "./cantrips";
import { ALL_LEVELED_SPELL_OVERRIDES } from "./spells";
import { vsspp2SpellOverrides } from "./sourcebook-vsspp2";
import { grimHollowSpellOverrides } from "./sourcebook-grimhollow";
import type { SpellFormula } from "../../types/spellFormula";
import type { ManualFormulaRecord } from "../../types/manualFormula";
import { ALL_MANUAL_ACTION_FORMULAS } from "./classes";
import { ALL_MANUAL_FEAT_FORMULAS } from "./feats";

export { ALL_CANTRIP_OVERRIDES } from "./cantrips";
export { ALL_LEVELED_SPELL_OVERRIDES } from "./spells";
export * from "./cantrips";
export * from "./spells";

/** All manual overrides merged into a single lookup map (spell ID → SpellFormula) */
export const ALL_MANUAL_OVERRIDES: Record<string, SpellFormula> = {
  ...ALL_CANTRIP_OVERRIDES,
  ...ALL_LEVELED_SPELL_OVERRIDES,
  ...vsspp2SpellOverrides,
  ...grimHollowSpellOverrides,
};

/** Unified registry for manual spell, cantrip, action, class-feature, and feat interpretations. */
export const ALL_MANUAL_FORMULAS: Record<string, ManualFormulaRecord> = {
  ...Object.fromEntries(
    Object.values(ALL_MANUAL_OVERRIDES).map((formula) => [
      formula.id,
      {
        kind: formula.category.spellType,
        status: "needs-review" as const,
        formula,
      },
    ]),
  ),
  ...Object.fromEntries(
    Object.values(ALL_MANUAL_ACTION_FORMULAS).map((formula) => [
      formula.id,
      {
        kind: formula.kind,
        status: formula.status,
        formula,
      },
    ]),
  ),
  ...Object.fromEntries(
    Object.values(ALL_MANUAL_FEAT_FORMULAS).map((formula) => [
      formula.id,
      {
        kind: formula.kind,
        status: formula.status,
        formula,
      },
    ]),
  ),
};

export type { SpellFormula };
export type {
  ManualActionFormula,
  ManualActionKind,
  ManualActionOperation,
  ManualFormulaKind,
  ManualFormulaRecord,
  ManualFormulaStatus,
} from "../../types/manualFormula";
export {
  ALL_MANUAL_ACTION_FORMULAS,
  CLASS_MANUAL_FORMULAS,
  BARBARIAN_CLASS_FORMULAS,
  BARD_CLASS_FORMULAS,
  CLERIC_CLASS_FORMULAS,
  DRUID_CLASS_FORMULAS,
  FIGHTER_CLASS_FORMULAS,
  GUNSLINGER_CLASS_FORMULAS,
  MONK_CLASS_FORMULAS,
  PALADIN_CLASS_FORMULAS,
  RANGER_CLASS_FORMULAS,
  ROGUE_CLASS_FORMULAS,
  SORCERER_CLASS_FORMULAS,
  WARLOCK_CLASS_FORMULAS,
  WIZARD_CLASS_FORMULAS,
  MONSTER_HUNTER_CLASS_FORMULAS,
  ARTIFICER_CLASS_FORMULAS,
  FONT_CREATE_OPTIONS,
  METAMAGIC_OPTIONS,
  HEROIC_SORCERY_FORMULAS,
  MYSTICAL_MANEUVER_OPTIONS,
  MANEUVER_OPTIONS,
  BATTLE_MASTER_FORMULAS,
  FOCUS_POINT_OPTIONS,
  LAY_ON_HANDS_OPTIONS,
  TACTICAL_MIND_OPTIONS,
  CUNNING_STRIKE_OPTIONS,
  DIVINE_SPARK_OPTIONS,
  MAGIC_MISSILE_MAGE_FORMULAS,
  VERSATILE_MISSILE_OPTIONS,
  DRAGON_DOMAIN_FORMULAS,
  LEGENDARY_ASPECT_OPTIONS,
  PERSONA_MASK_OPTIONS,
  COLLEGE_OF_MASKS_FORMULAS,
  CIRCLE_OF_THE_CITY_FORMULAS,
  BEASTBORNE_FORMULAS,
  BESTIAL_ASPECT_LEVELS,
  PISTOLERO_FORMULAS,
  findMatchingActionFormula,
} from "./classes";
export {
  getFeatureFlyoutKind,
  resolveFeatureResource,
} from "../../services/classResourceService";
export type {
  FeatureFlyoutKind,
  ResolvedFeatureResource,
} from "../../services/classResourceService";
export {
  ALL_MANUAL_FEAT_FORMULAS,
  PHB_2024_FEAT_FORMULAS,
  GRIM_HOLLOW_FEAT_FORMULAS,
  ARCANA_UNLEASHED_FEAT_FORMULAS,
  VSSPP2_FEAT_FORMULAS,
} from "./feats";
export {
  DDB_55E_DIRECTORY_PROGRESS,
  DDB_55E_MECHANICS_PROGRESS,
  DDB_55E_SPELL_DIRECTORY,
  getDdb55eDirectoryCoverage,
  getSpellManualCoverage,
  MANUAL_FORMULA_COVERAGE,
} from "./coverage";
export type {
  Ddb55eCatalogPhaseStatus,
  Ddb55eSpellDirectoryEntry,
  FormulaCoverageStatus,
  SpellManualCoverageEntry,
} from "./coverage";
export {
  classifySpellCatalogEntry,
  DND_SPELL_SOURCEBOOKS,
  getRulesEditionForSourcebook,
} from "./sourcebooks";
export type {
  DndBeyondSourceCategory,
  DndRulesEdition,
  DndSpellSourcebook,
  SpellCatalogDecision,
} from "./sourcebooks";
export { DND_SOURCEBOOK_SPELLS } from "./sourcebookSpells";
export { vsspp2SpellOverrides } from "./sourcebook-vsspp2";
export { grimHollowSpellOverrides } from "./sourcebook-grimhollow";
export {
  ALL_BACKGROUNDS,
  PHB_2024_BACKGROUNDS,
  GRIM_HOLLOW_BACKGROUNDS,
  ARCANA_UNLEASHED_BACKGROUNDS,
} from "./backgrounds";
export type { DndBackgroundDefinition } from "./backgrounds";
export type {
  SourcebookSpellFormulaStatus,
  SourcebookSpellReference,
} from "./sourcebookSpells";
