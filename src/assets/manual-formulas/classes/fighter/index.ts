import type {
  ManualActionFormula,
  FeatureActionOption,
} from "../../../../types/manualFormula";
import { ARCANE_ARCHER_FORMULAS } from "./subclasses/arcaneArcher";
import { BANNERET_FORMULAS } from "./subclasses/banneret";
import {
  BATTLE_MASTER_FORMULAS,
  MANEUVER_OPTIONS,
} from "./subclasses/battleMaster";
import { BULWARK_WARRIOR_FORMULAS } from "./subclasses/bulwarkWarrior";
import { CHAMPION_FORMULAS } from "./subclasses/champion";
import { ELDRITCH_KNIGHT_FORMULAS } from "./subclasses/eldritchKnight";
import { LIVING_CRUCIBLE_FORMULAS } from "./subclasses/livingCrucible";
import { NIGHTWATCHER_FORMULAS } from "./subclasses/nightwatcher";
import { PSI_WARRIOR_FORMULAS } from "./subclasses/psiWarrior";

const TACTICAL_MIND_OPTIONS: FeatureActionOption[] = [
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

export const FIGHTER_CLASS_FORMULAS: Record<string, ManualActionFormula> = {
  secondWind: {
    id: "embers:fighter:second-wind",
    name: "Second Wind",
    kind: "class_feature",
    status: "verified",
    classes: ["fighter"],
    activationType: "bonus",
    flyoutType: "options_grid",
    resource: {
      name: "Second Wind",
      resetType: "Short or Long Rest",
      scaling: {
        type: "level_table",
        classId: "fighter",
        table: [
          { minLevel: 1, value: 2 },
          { minLevel: 4, value: 3 },
          { minLevel: 10, value: 4 },
        ],
      },
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Second Wind",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Regain Hit Points",
        description:
          "As a Bonus Action, regain Hit Points equal to 1d10 + your Fighter level.",
      },
    ],
    description:
      "Draw on a stamina reserve to heal yourself and fuel tactical maneuvers.",
    source: "Player's Handbook (2024), Fighter: Second Wind",
  },
  actionSurge: {
    id: "embers:fighter:action-surge",
    name: "Action Surge",
    kind: "class_feature",
    status: "verified",
    classes: ["fighter"],
    activationType: "special",
    resource: {
      name: "Action Surge",
      resetType: "Short or Long Rest",
      scaling: {
        type: "level_table",
        classId: "fighter",
        table: [
          { minLevel: 2, value: 1 },
          { minLevel: 17, value: 2 },
        ],
      },
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Action Surge",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Additional Action",
        description:
          "Take one additional action on your turn (except the Magic action in 2024 rules).",
      },
    ],
    description:
      "Push yourself beyond normal physical limits to take an additional action.",
    source: "Player's Handbook (2024), Fighter: Action Surge",
  },
  tacticalMind: {
    id: "embers:fighter:tactical-mind",
    name: "Tactical Mind",
    kind: "class_feature",
    status: "verified",
    classes: ["fighter"],
    activationType: "special",
    flyoutType: "options_grid",
    options: TACTICAL_MIND_OPTIONS,
    operations: [
      {
        type: "apply_effect",
        name: "Tactical Mind Surge",
        description:
          "When you fail an ability check, expend 1 use of Second Wind to add 1d10 to the check. If the check still fails, the use is not expended.",
      },
    ],
    description:
      "Apply tactical acumen and physical discipline to overcome skill challenges.",
    source: "Player's Handbook (2024), Fighter: Tactical Mind",
  },
  tacticalShift: {
    id: "embers:fighter:tactical-shift",
    name: "Tactical Shift",
    kind: "class_feature",
    status: "verified",
    classes: ["fighter"],
    activationType: "bonus",
    operations: [
      {
        type: "apply_effect",
        name: "Tactical Repositioning",
        description:
          "Whenever you activate Second Wind as a Bonus Action, move up to half your speed without provoking Opportunity Attacks.",
      },
    ],
    description:
      "Reposition across the battle line whenever tapping your second wind.",
    source: "Player's Handbook (2024), Fighter: Tactical Shift",
  },
  indomitable: {
    id: "embers:fighter:indomitable",
    name: "Indomitable",
    kind: "class_feature",
    status: "verified",
    classes: ["fighter"],
    activationType: "special",
    resource: {
      name: "Indomitable",
      resetType: "Long Rest",
      scaling: {
        type: "level_table",
        classId: "fighter",
        table: [
          { minLevel: 9, value: 1 },
          { minLevel: 13, value: 2 },
          { minLevel: 17, value: 3 },
        ],
      },
    },
    operations: [
      {
        type: "apply_effect",
        name: "Reroll with Level Bonus",
        description:
          "Reroll a failed saving throw, adding your Fighter level to the new result.",
      },
    ],
    description:
      "Reroll failed saves with an overwhelming bonus equal to your Fighter level.",
    source: "Player's Handbook (2024), Fighter: Indomitable",
  },

  weaponMastery: {
    id: "embers:fighter:weapon-mastery",
    name: "Weapon Mastery",
    kind: "class_feature",
    status: "verified",
    classes: ["fighter"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Mastery Properties",
        description:
          "Use the mastery properties of 3 weapons (increases to 4 at level 4, 5 at level 10, and 6 at level 16).",
      },
    ],
    description:
      "Master the tactical properties of your chosen weapons with peerless skill.",
    source: "Player's Handbook (2024), Fighter: Weapon Mastery",
  },

  extraAttack: {
    id: "embers:fighter:extra-attack",
    name: "Extra Attack",
    kind: "class_feature",
    status: "verified",
    classes: ["fighter"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Multiattack Strike",
        description:
          "You can attack twice instead of once whenever you take the Attack action on your turn.",
      },
    ],
    description:
      "Attack twice whenever you take the Attack action on your turn.",
    source: "Player's Handbook (2024), Fighter: Extra Attack",
  },

  twoExtraAttacks: {
    id: "embers:fighter:two-extra-attacks",
    name: "Two Extra Attacks",
    kind: "class_feature",
    status: "verified",
    classes: ["fighter"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Triple Attack",
        description:
          "You can attack three times instead of once whenever you take the Attack action on your turn.",
      },
    ],
    description:
      "Attack three times whenever you take the Attack action on your turn.",
    source: "Player's Handbook (2024), Fighter: Extra Attack (2)",
  },

  studiedAttacks: {
    id: "embers:fighter:studied-attacks",
    name: "Studied Attacks",
    kind: "class_feature",
    status: "verified",
    classes: ["fighter"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Tactical Read",
        description:
          "If you make an attack roll against a creature and miss, you have Advantage on your next attack roll against that creature before the end of your next turn.",
      },
    ],
    description:
      "Study opponent defenses on a miss to gain Advantage on your next strike.",
    source: "Player's Handbook (2024), Fighter: Studied Attacks",
  },

  threeExtraAttacks: {
    id: "embers:fighter:three-extra-attacks",
    name: "Three Extra Attacks",
    kind: "class_feature",
    status: "verified",
    classes: ["fighter"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Quadruple Attack",
        description:
          "You can attack four times instead of once whenever you take the Attack action on your turn.",
      },
    ],
    description:
      "Level 20 Capstone: Attack four times whenever you take the Attack action on your turn.",
    source: "Player's Handbook (2024), Fighter: Extra Attack (3)",
  },
  ...ARCANE_ARCHER_FORMULAS,
  ...BANNERET_FORMULAS,
  ...BATTLE_MASTER_FORMULAS,
  ...BULWARK_WARRIOR_FORMULAS,
  ...CHAMPION_FORMULAS,
  ...ELDRITCH_KNIGHT_FORMULAS,
  ...LIVING_CRUCIBLE_FORMULAS,
  ...NIGHTWATCHER_FORMULAS,
  ...PSI_WARRIOR_FORMULAS,
};

export {
  MANEUVER_OPTIONS,
  TACTICAL_MIND_OPTIONS,
  ARCANE_ARCHER_FORMULAS,
  BANNERET_FORMULAS,
  BATTLE_MASTER_FORMULAS,
  BULWARK_WARRIOR_FORMULAS,
  CHAMPION_FORMULAS,
  ELDRITCH_KNIGHT_FORMULAS,
  LIVING_CRUCIBLE_FORMULAS,
  NIGHTWATCHER_FORMULAS,
  PSI_WARRIOR_FORMULAS,
};
