import type { ManualActionFormula } from "../types/manualFormula";
import type { DDBParsedCharacter, DDBFeatureAction } from "../types/ddb";
import { findMatchingActionFormula } from "../assets/manual-formulas/classes";

export type FeatureFlyoutKind =
  | "font_of_magic"
  | "harness_divine_power"
  | "arcane_recovery"
  | "focus_points"
  | "lay_on_hands"
  | "metamagic"
  | "maneuvers"
  | "cunning_strike"
  | "second_wind"
  | "tactical_mind"
  | "divine_spark"
  | "options_grid";

export interface ResolvedFeatureResource {
  resourceName: string;
  maxPoints: number;
  availablePoints: number;
  resetType: string;
}

export function resolveFeatureResource(params: {
  formula?: ManualActionFormula;
  character?: DDBParsedCharacter | null;
  feature?: DDBFeatureAction | null;
  featureUses?: Record<string, number>;
}): ResolvedFeatureResource {
  const { formula, character, feature, featureUses = {} } = params;

  let resourceName = formula?.resource?.name || feature?.name || "Resource";
  let maxPoints = feature?.limitedUse?.max || 0;
  let resetType = formula?.resource?.resetType || feature?.limitedUse?.resetType || "Long Rest";

  if (maxPoints === 0 && formula?.resource?.scaling && character) {
    const { scaling } = formula.resource;
    const classId = scaling.classId?.toLowerCase();
    const classLevel = classId
      ? character.classes
          .filter((c) => c.name.toLowerCase().includes(classId))
          .reduce((sum, c) => sum + c.level, 0)
      : character.classes.reduce((sum, c) => sum + c.level, 0);

    if (scaling.type === "class_level") {
      maxPoints = classLevel * (scaling.multiplier ?? 1);
    } else if (scaling.type === "half_class_level") {
      maxPoints = Math.max(1, Math.ceil(classLevel / 2));
    } else if (scaling.type === "level_table" && scaling.table) {
      const match = [...scaling.table]
        .sort((a, b) => b.minLevel - a.minLevel)
        .find((entry) => classLevel >= entry.minLevel);
      maxPoints = match ? match.value : (scaling.table[0]?.value ?? 0);
    } else if (scaling.type === "flat") {
      maxPoints = scaling.multiplier ?? 1;
    }
  }

  const used = feature ? (featureUses[feature.id] ?? (feature.limitedUse?.used || 0)) : 0;
  const availablePoints = Math.max(0, maxPoints - used);

  return {
    resourceName,
    maxPoints,
    availablePoints,
    resetType,
  };
}

export function getFeatureFlyoutKind(feat: { name: string; id?: string }): FeatureFlyoutKind | null {
  if (!feat?.name) return null;
  const lower = feat.name.toLowerCase().trim();
  const formula = findMatchingActionFormula(feat.name);

  if (formula?.flyoutType === "convert_slots" || lower.includes("font of magic")) return "font_of_magic";
  if (lower.includes("arcane recovery")) return "arcane_recovery";
  if (lower.includes("harness divine power")) return "harness_divine_power";
  if (
    lower.includes("focus point") ||
    lower.includes("ki point") ||
    lower === "ki" ||
    lower.includes("step of the wind") ||
    lower.includes("flurry of blows") ||
    lower.includes("patient defense") ||
    lower.includes("stunning strike")
  ) {
    return "focus_points";
  }
  if (lower.includes("lay on hands")) return "lay_on_hands";
  if (lower.includes("metamagic")) return "metamagic";
  if (lower.includes("maneuver") || lower.includes("superiority dice") || lower.includes("combat superiority")) {
    return "maneuvers";
  }
  if (lower.includes("cunning strike")) return "cunning_strike";
  if (lower.includes("tactical mind")) return "tactical_mind";
  if (lower.includes("divine spark") || (lower.includes("channel divinity") && lower.includes("spark"))) {
    return "divine_spark";
  }
  if (formula?.options && formula.options.length > 0) return "options_grid";
  return null;
}
