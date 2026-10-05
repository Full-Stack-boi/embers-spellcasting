import type { ManualActionFormula } from "../../../../types/manualFormula";
import { PATH_OF_THE_BERSERKER_FORMULAS } from "./subclasses/pathOfTheBerserker";
import { PATH_OF_THE_FRACTURED_FORMULAS } from "./subclasses/pathOfTheFractured";
import { PATH_OF_THE_PRIMAL_SPIRIT_FORMULAS } from "./subclasses/pathOfThePrimalSpirit";
import { PATH_OF_THE_WILD_HEART_FORMULAS } from "./subclasses/pathOfTheWildHeart";
import { PATH_OF_THE_WORLD_TREE_FORMULAS } from "./subclasses/pathOfTheWorldTree";
import { PATH_OF_THE_WRATHFUL_DEAD_FORMULAS } from "./subclasses/pathOfTheWrathfulDead";
import { PATH_OF_THE_ZEALOT_FORMULAS } from "./subclasses/pathOfTheZealot";

export const BARBARIAN_CLASS_FORMULAS: Record<string, ManualActionFormula> = {
  rage: {
    id: "embers:barbarian:rage",
    name: "Rage",
    kind: "class_feature",
    status: "verified",
    classes: ["barbarian"],
    activationType: "bonus",
    resource: {
      name: "Rage",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Rage",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Rage Frenzy",
        duration: "10 minutes",
        description:
          "Advantage on Strength checks and saves; bonus damage on Strength-based attacks (+2 to +4); Resistance to Bludgeoning, Piercing, and Slashing damage.",
      },
    ],
    description:
      "Enter a primal battle frenzy that enhances your strength, damage, and durability.",
    source: "Player's Handbook (2024), Barbarian: Rage",
  },
  recklessAttack: {
    id: "embers:barbarian:reckless-attack",
    name: "Reckless Attack",
    kind: "class_feature",
    status: "verified",
    classes: ["barbarian"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Reckless Assault",
        description:
          "Gain Advantage on melee attack rolls using Strength during this turn, but attack rolls against you have Advantage until the start of your next turn.",
      },
    ],
    description:
      "Throw aside all concern for defense to attack with fierce desperation.",
    source: "Player's Handbook (2024), Barbarian: Reckless Attack",
  },
  brutalStrike: {
    id: "embers:barbarian:brutal-strike",
    name: "Brutal Strike",
    kind: "class_feature",
    status: "verified",
    classes: ["barbarian"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Brutal Impact",
        description:
          "When using Reckless Attack, forego Advantage on one attack to deal extra 1d10 damage and apply Forceful Blow (push 15 ft) or Hamstring (reduce speed 15 ft).",
      },
    ],
    description:
      "Forego defense and advantage to shatter foes with staggering force.",
    source: "Player's Handbook (2024), Barbarian: Brutal Strike",
  },
  ...PATH_OF_THE_BERSERKER_FORMULAS,
  ...PATH_OF_THE_FRACTURED_FORMULAS,
  ...PATH_OF_THE_PRIMAL_SPIRIT_FORMULAS,
  ...PATH_OF_THE_WILD_HEART_FORMULAS,
  ...PATH_OF_THE_WORLD_TREE_FORMULAS,
  ...PATH_OF_THE_WRATHFUL_DEAD_FORMULAS,
  ...PATH_OF_THE_ZEALOT_FORMULAS,
};

export {
  PATH_OF_THE_BERSERKER_FORMULAS,
  PATH_OF_THE_FRACTURED_FORMULAS,
  PATH_OF_THE_PRIMAL_SPIRIT_FORMULAS,
  PATH_OF_THE_WILD_HEART_FORMULAS,
  PATH_OF_THE_WORLD_TREE_FORMULAS,
  PATH_OF_THE_WRATHFUL_DEAD_FORMULAS,
  PATH_OF_THE_ZEALOT_FORMULAS,
};
