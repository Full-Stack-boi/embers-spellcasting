import type { FeatureActionOption } from "../../../types/manualFormula";
import type { DDBParsedCharacter, DDBFeatureAction } from "../../../types/ddb";

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
  | "divine_spark";

export interface FeatureResourceCalculation {
  kind: FeatureFlyoutKind;
  resourceName: string;
  maxPoints: number;
  availablePoints: number;
  resetType: string;
}

export const FONT_CREATE_OPTIONS = [
  { slotLevel: 1, cost: 2, minLevel: 2 },
  { slotLevel: 2, cost: 3, minLevel: 3 },
  { slotLevel: 3, cost: 5, minLevel: 5 },
  { slotLevel: 4, cost: 6, minLevel: 7 },
  { slotLevel: 5, cost: 7, minLevel: 9 },
];

export const METAMAGIC_OPTIONS: FeatureActionOption[] = [
  {
    id: "careful",
    name: "Careful Spell",
    cost: 1,
    desc: "Protect allies from spell effects (automatic success on saving throw)",
    actionType: "none",
  },
  {
    id: "distant",
    name: "Distant Spell",
    cost: 1,
    desc: "Double range or extend touch range to 30 ft",
    actionType: "none",
  },
  {
    id: "empowered",
    name: "Empowered Spell",
    cost: 1,
    desc: "Reroll damage dice up to Charisma modifier (minimum 1)",
    actionType: "none",
  },
  {
    id: "extended",
    name: "Extended Spell",
    cost: 1,
    desc: "Double duration up to 24 hours, or advantage on concentration saves",
    actionType: "none",
  },
  {
    id: "heightened",
    name: "Heightened Spell",
    cost: 2,
    desc: "Impose Disadvantage on target's first saving throw against the spell",
    actionType: "none",
  },
  {
    id: "quickened",
    name: "Quickened Spell",
    cost: 2,
    desc: "Change casting time from 1 action to 1 bonus action",
    actionType: "none",
  },
  {
    id: "seeking",
    name: "Seeking Spell",
    cost: 2,
    desc: "Reroll a missed spell attack roll",
    actionType: "none",
  },
  {
    id: "subtle",
    name: "Subtle Spell",
    cost: 1,
    desc: "Cast without Verbal, Somatic, or non-cost Material components",
    actionType: "none",
  },
  {
    id: "transmuted",
    name: "Transmuted Spell",
    cost: 1,
    desc: "Change elemental damage type to Acid, Cold, Fire, Lightning, Poison, or Thunder",
    actionType: "none",
  },
  {
    id: "twinned",
    name: "Twinned Spell",
    cost: 1,
    desc: "Target second creature when upcasting single-target spell",
    actionType: "none",
  },
];

export const MANEUVER_OPTIONS: FeatureActionOption[] = [
  {
    id: "commanders_strike",
    name: "Commander's Strike",
    cost: 1,
    desc: "Forgo one attack + bonus action to direct ally reaction attack (+die)",
    actionType: "bonus",
  },
  {
    id: "disarming",
    name: "Disarming Attack",
    cost: 1,
    desc: "On hit: +die damage and force STR save or drop item",
    actionType: "none",
  },
  {
    id: "distracting",
    name: "Distracting Strike",
    cost: 1,
    desc: "On hit: +die damage and next ally attack has advantage",
    actionType: "none",
  },
  {
    id: "evasive",
    name: "Evasive Footwork",
    cost: 1,
    desc: "When moving: +die to AC until you stop moving",
    actionType: "none",
  },
  {
    id: "feinting",
    name: "Feinting Attack",
    cost: 1,
    desc: "Bonus Action: advantage on next attack roll (+die damage on hit)",
    actionType: "bonus",
  },
  {
    id: "goading",
    name: "Goading Attack",
    cost: 1,
    desc: "On hit: +die damage and target has disadvantage vs others",
    actionType: "none",
  },
  {
    id: "lunging",
    name: "Lunging Attack",
    cost: 1,
    desc: "Dash as bonus action or +5ft reach (+die damage on hit)",
    actionType: "none",
  },
  {
    id: "maneuvering",
    name: "Maneuvering Attack",
    cost: 1,
    desc: "On hit: +die damage and ally can move half speed without opportunity attacks",
    actionType: "none",
  },
  {
    id: "menacing",
    name: "Menacing Attack",
    cost: 1,
    desc: "On hit: +die damage and force WIS save or Frightened until end of next turn",
    actionType: "none",
  },
  {
    id: "parry",
    name: "Parry",
    cost: 1,
    desc: "Reaction: reduce incoming melee damage by die + DEX mod",
    actionType: "reaction",
  },
  {
    id: "precision",
    name: "Precision Attack",
    cost: 1,
    desc: "Add superiority die to weapon attack roll",
    actionType: "none",
  },
  {
    id: "pushing",
    name: "Pushing Attack",
    cost: 1,
    desc: "On hit: +die damage and force STR save or push up to 15 ft",
    actionType: "none",
  },
  {
    id: "rally",
    name: "Rally",
    cost: 1,
    desc: "Bonus Action: grant ally Temporary HP equal to die + CHA mod",
    actionType: "bonus",
  },
  {
    id: "riposte",
    name: "Riposte",
    cost: 1,
    desc: "Reaction when enemy misses you with melee attack: make melee attack (+die damage)",
    actionType: "reaction",
  },
  {
    id: "sweeping",
    name: "Sweeping Attack",
    cost: 1,
    desc: "On hit: deal superiority die damage to adjacent creature",
    actionType: "none",
  },
  {
    id: "tactical_assessment",
    name: "Tactical Assessment",
    cost: 1,
    desc: "Add superiority die to Investigation, History, or Insight check",
    actionType: "none",
  },
  {
    id: "trip",
    name: "Trip Attack",
    cost: 1,
    desc: "On hit: +die damage and force STR save or knock Large/smaller Prone",
    actionType: "none",
  },
];

export const FOCUS_POINT_OPTIONS: FeatureActionOption[] = [
  {
    id: "flurry",
    name: "Flurry of Blows",
    cost: 1,
    desc: "Bonus Action: make two unarmed strikes",
    actionType: "bonus",
  },
  {
    id: "patient",
    name: "Patient Defense",
    cost: 1,
    desc: "Bonus Action: take Disengage and Dodge actions",
    actionType: "bonus",
  },
  {
    id: "step",
    name: "Step of the Wind",
    cost: 1,
    desc: "Bonus Action: take Disengage and Dash actions, double jump distance",
    actionType: "bonus",
  },
  {
    id: "stun",
    name: "Stunning Strike",
    cost: 1,
    desc: "On hit with melee attack: force CON save or target is Stunned until start of your next turn",
    actionType: "none",
  },
  {
    id: "deflect",
    name: "Deflect Attacks (Redirect)",
    cost: 1,
    desc: "Spend 1 Focus Point after reducing attack damage to 0 to redirect projectile/strike",
    actionType: "reaction",
  },
  {
    id: "metabolism",
    name: "Uncanny Metabolism",
    cost: 0,
    desc: "On rolling Initiative: regain all expended Focus Points and roll Martial Arts die + Monk level HP (1/Long Rest)",
    actionType: "none",
  },
];

export const LAY_ON_HANDS_OPTIONS: FeatureActionOption[] = [
  {
    id: "heal_hp",
    name: "Heal Hit Points",
    cost: 1,
    desc: "Bonus Action: restore 1 HP per point spent from your healing pool",
    actionType: "bonus",
  },
  {
    id: "neutralize_poison",
    name: "Purify Ailment",
    cost: 5,
    desc: "Bonus Action: expend 5 HP from pool to cure target of Poisoned condition",
    actionType: "bonus",
  },
];

export const CUNNING_STRIKE_OPTIONS: FeatureActionOption[] = [
  {
    id: "poison",
    name: "Poison (1d6)",
    cost: 1,
    desc: "Forego 1d6 Sneak Attack damage: force CON save or Poisoned for 1 minute",
    actionType: "none",
  },
  {
    id: "trip",
    name: "Trip (1d6)",
    cost: 1,
    desc: "Forego 1d6 Sneak Attack damage: force DEX save or Prone (Large or smaller)",
    actionType: "none",
  },
  {
    id: "withdraw",
    name: "Withdraw (1d6)",
    cost: 1,
    desc: "Forego 1d6 Sneak Attack damage: move up to half Speed without provoking Opportunity Attacks",
    actionType: "none",
  },
  {
    id: "daze",
    name: "Daze (2d6)",
    cost: 2,
    desc: "Forego 2d6 Sneak Attack damage: force CON save or target can only move or take an action/bonus action",
    actionType: "none",
  },
  {
    id: "knock_out",
    name: "Knock Out (6d6)",
    cost: 6,
    desc: "Forego 6d6 Sneak Attack damage: force CON save or Unconscious for 1 minute",
    actionType: "none",
  },
  {
    id: "obscure",
    name: "Obscure (3d6)",
    cost: 3,
    desc: "Forego 3d6 Sneak Attack damage: force DEX save or Blinded until end of its next turn",
    actionType: "none",
  },
];

export const TACTICAL_MIND_OPTIONS: FeatureActionOption[] = [
  {
    id: "tactical_mind",
    name: "Tactical Mind",
    cost: 1,
    desc: "On failed d20 test: expend 1 Second Wind use to add 1d10 to the result (not expended if still failing)",
    actionType: "none",
  },
  {
    id: "tactical_shift",
    name: "Tactical Shift",
    cost: 0,
    desc: "When activating Second Wind as a Bonus Action, move up to half speed without provoking Opportunity Attacks",
    actionType: "bonus",
  },
];

export const DIVINE_SPARK_OPTIONS: FeatureActionOption[] = [
  {
    id: "divine_spark_heal",
    name: "Divine Spark: Healing",
    cost: 1,
    desc: "Action expend 1 Channel Divinity: heal creature within 30 ft for 1d8 + WIS modifier HP (scales with cleric level)",
    actionType: "action",
  },
  {
    id: "divine_spark_damage",
    name: "Divine Spark: Harm",
    cost: 1,
    desc: "Action expend 1 Channel Divinity: deal 1d8 + WIS modifier Radiant or Necrotic damage to target within 30 ft (CON save half)",
    actionType: "action",
  },
  {
    id: "turn_undead",
    name: "Turn Undead",
    cost: 1,
    desc: "Action expend 1 Channel Divinity: each Undead within 30 ft makes WIS save or Frightened & Incapacitated for 1 minute",
    actionType: "action",
  },
];

/**
 * Resolves whether a given feature or action maps to an interactive mechanic flyout.
 */
export function getFeatureFlyoutKind(feat: {
  name: string;
  id?: string;
}): FeatureFlyoutKind | null {
  const lower = (feat.name || "").toLowerCase().trim();
  if (lower.includes("font of magic")) return "font_of_magic";
  if (lower.includes("harness divine power")) return "harness_divine_power";
  if (lower.includes("arcane recovery")) return "arcane_recovery";
  if (
    lower.includes("focus point") ||
    lower.includes("ki point") ||
    lower === "ki" ||
    lower.includes("step of the wind") ||
    lower.includes("flurry of blows") ||
    lower.includes("patient defense") ||
    lower.includes("stunning strike")
  )
    return "focus_points";
  if (lower.includes("lay on hands")) return "lay_on_hands";
  if (lower.includes("metamagic")) return "metamagic";
  if (
    lower.includes("maneuver") ||
    lower.includes("superiority dice") ||
    lower.includes("combat superiority")
  )
    return "maneuvers";
  if (lower.includes("cunning strike")) return "cunning_strike";
  if (lower.includes("tactical mind")) return "tactical_mind";
  if (
    lower.includes("divine spark") ||
    (lower.includes("channel divinity") && lower.includes("spark"))
  )
    return "divine_spark";
  return null;
}

/**
 * Computes pure game mechanics resource totals for character features.
 */
export function computeClassFeatureResource(params: {
  kind: FeatureFlyoutKind;
  character?: DDBParsedCharacter | null;
  feature?: DDBFeatureAction;
  featureUses?: Record<string, number>;
}): FeatureResourceCalculation {
  const { kind, character, feature, featureUses = {} } = params;

  const sorcererLevel =
    character?.classes
      .filter((c) => c.name.toLowerCase().includes("sorcerer"))
      .reduce((s, c) => s + c.level, 0) || 0;
  const paladinLevel =
    character?.classes
      .filter((c) => c.name.toLowerCase().includes("paladin"))
      .reduce((s, c) => s + c.level, 0) || 0;
  const monkLevel =
    character?.classes
      .filter((c) => c.name.toLowerCase().includes("monk"))
      .reduce((s, c) => s + c.level, 0) || 0;
  const clericLevel =
    character?.classes
      .filter((c) => c.name.toLowerCase().includes("cleric"))
      .reduce((s, c) => s + c.level, 0) || 0;
  const fighterLevel =
    character?.classes
      .filter((c) => c.name.toLowerCase().includes("fighter"))
      .reduce((s, c) => s + c.level, 0) || 0;
  const rogueLevel =
    character?.classes
      .filter((c) => c.name.toLowerCase().includes("rogue"))
      .reduce((s, c) => s + c.level, 0) || 0;

  let resourceName = feature?.name || "Resource";
  let maxPoints = feature?.limitedUse?.max || 0;
  let resetType = feature?.limitedUse?.resetType || "Long Rest";

  if (kind === "font_of_magic") {
    resourceName = "Sorcery Points";
    if (maxPoints === 0) maxPoints = sorcererLevel;
    resetType = "Long Rest";
  } else if (kind === "harness_divine_power" || kind === "divine_spark") {
    resourceName = "Channel Divinity";
    if (maxPoints === 0) {
      maxPoints = clericLevel >= 6 || paladinLevel >= 7 ? 2 : 1;
    }
    resetType = "Short or Long Rest";
  } else if (kind === "arcane_recovery") {
    resourceName = "Arcane Recovery";
    if (maxPoints === 0) maxPoints = 1;
    resetType = "Long Rest";
  } else if (kind === "focus_points") {
    resourceName = "Focus Points (Ki)";
    if (maxPoints === 0) maxPoints = monkLevel;
    resetType = "Short or Long Rest";
  } else if (kind === "lay_on_hands") {
    resourceName = "Lay on Hands Pool";
    if (maxPoints === 0) maxPoints = paladinLevel * 5;
    resetType = "Long Rest";
  } else if (kind === "metamagic") {
    resourceName = "Sorcery Points";
    if (maxPoints === 0) maxPoints = sorcererLevel;
    resetType = "Long Rest";
  } else if (kind === "maneuvers") {
    resourceName = "Superiority Dice";
    if (maxPoints === 0) {
      maxPoints =
        fighterLevel >= 15
          ? 6
          : fighterLevel >= 7
            ? 5
            : fighterLevel >= 3
              ? 4
              : 2;
    }
    resetType = "Short or Long Rest";
  } else if (kind === "cunning_strike") {
    resourceName = "Sneak Attack Dice";
    if (maxPoints === 0) maxPoints = Math.ceil(rogueLevel / 2);
    resetType = "Turn";
  } else if (kind === "tactical_mind" || kind === "second_wind") {
    resourceName = "Second Wind";
    if (maxPoints === 0) {
      maxPoints = fighterLevel >= 10 ? 4 : fighterLevel >= 4 ? 3 : 2;
    }
    resetType = "Short or Long Rest";
  }

  const used = feature
    ? (featureUses[feature.id] ?? (feature.limitedUse?.used || 0))
    : 0;
  const availablePoints = Math.max(0, maxPoints - used);

  return {
    kind,
    resourceName,
    maxPoints,
    availablePoints,
    resetType,
  };
}
