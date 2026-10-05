import type { ManualActionFormula } from "../../../../types/manualFormula";
import { MANEUVER_OPTIONS } from "../../mechanics/classMechanicRegistry";
import { ARCANE_ARCHER_FORMULAS } from "./subclasses/arcaneArcher";
import { BANNERET_FORMULAS } from "./subclasses/banneret";
import { BATTLE_MASTER_FORMULAS } from "./subclasses/battleMaster";
import { BULWARK_WARRIOR_FORMULAS } from "./subclasses/bulwarkWarrior";
import { CHAMPION_FORMULAS } from "./subclasses/champion";
import { ELDRITCH_KNIGHT_FORMULAS } from "./subclasses/eldritchKnight";
import { LIVING_CRUCIBLE_FORMULAS } from "./subclasses/livingCrucible";
import { NIGHTWATCHER_FORMULAS } from "./subclasses/nightwatcher";
import { PSI_WARRIOR_FORMULAS } from "./subclasses/psiWarrior";

export const FIGHTER_CLASS_FORMULAS: Record<string, ManualActionFormula> = {
  secondWind: {
    id: "embers:fighter:second-wind",
    name: "Second Wind",
    kind: "class_feature",
    status: "verified",
    classes: ["fighter"],
    activationType: "bonus",
    resource: {
      name: "Second Wind",
      resetType: "Short or Long Rest",
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
