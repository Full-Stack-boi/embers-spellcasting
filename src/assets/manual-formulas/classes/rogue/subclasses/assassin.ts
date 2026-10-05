import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const ASSASSIN_FORMULAS: Record<string, ManualActionFormula> = {
  assassinate: {
    id: "embers:rogue:assassin:assassinate",
    name: "Assassinate",
    kind: "class_feature",
    status: "verified",
    classes: ["rogue"],
    subclass: "assassin",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Opening Ambush",
        description:
          "You have Advantage on attack rolls against any creature that hasn't taken a turn in combat; when you hit during round 1, deal extra damage equal to your Rogue level.",
      },
    ],
    description:
      "Strike first with lethal surprise and overwhelming ambush damage.",
    source: "Player's Handbook (2024), Rogue: Assassin",
  },

  envenomWeapons: {
    id: "embers:rogue:assassin:envenom-weapons",
    name: "Envenom Weapons",
    kind: "class_feature",
    status: "verified",
    classes: ["rogue"],
    subclass: "assassin",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Lethal Toxin Strike",
        description:
          "When using Cunning Strike (Poison option), you bypass Poison resistance and deal extra 2d6 Poison damage.",
      },
    ],
    description:
      "Coat blades in lethal alchemical toxins that bypass common resistances.",
    source: "Player's Handbook (2024), Rogue: Assassin",
  },

  deathStrike: {
    id: "embers:rogue:assassin:death-strike",
    name: "Death Strike",
    kind: "class_feature",
    status: "verified",
    classes: ["rogue"],
    subclass: "assassin",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Execution Blow",
        description:
          "When you hit with Sneak Attack in round 1, target makes a Constitution save; on a failure, double all damage dealt by the attack.",
      },
    ],
    description:
      "Deliver a devastating execution blow capable of ending foes instantly.",
    source: "Player's Handbook (2024), Rogue: Assassin",
  },
};
