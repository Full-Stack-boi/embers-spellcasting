import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const CHAMPION_FORMULAS: Record<string, ManualActionFormula> = {
  improvedCritical: {
    id: "embers:fighter:champion:improved-critical",
    name: "Improved Critical",
    kind: "class_feature",
    status: "verified",
    classes: ["fighter"],
    subclass: "champion",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Expanded Crit Window",
        description:
          "Your weapon attacks score a Critical Hit on a roll of 19 or 20 on the d20.",
      },
    ],
    description: "Deliver devastating critical strikes with razor perfection.",
    source: "Player's Handbook (2024), Fighter: Champion",
  },

  remarkableAthlete: {
    id: "embers:fighter:champion:remarkable-athlete",
    name: "Remarkable Athlete",
    kind: "class_feature",
    status: "verified",
    classes: ["fighter"],
    subclass: "champion",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Athletic Prowess",
        description:
          "You have Advantage on Initiative rolls and Strength (Athletics) checks; your running jump distance increases by your Strength modifier.",
      },
    ],
    description:
      "Excel at all feats of physical agility, explosive speed, and endurance.",
    source: "Player's Handbook (2024), Fighter: Champion",
  },

  heroicWarrior: {
    id: "embers:fighter:champion:heroic-warrior",
    name: "Heroic Warrior",
    kind: "class_feature",
    status: "verified",
    classes: ["fighter"],
    subclass: "champion",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Perpetual Inspiration",
        description:
          "In combat, you gain Heroic Inspiration at the start of each of your turns if you don't already have it.",
      },
    ],
    description:
      "Maintain unrelenting combat momentum and unwavering heroic inspiration.",
    source: "Player's Handbook (2024), Fighter: Champion",
  },

  superiorCritical: {
    id: "embers:fighter:champion:superior-critical",
    name: "Superior Critical",
    kind: "class_feature",
    status: "verified",
    classes: ["fighter"],
    subclass: "champion",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Ultimate Crit Window",
        description:
          "Your weapon attack rolls score a Critical Hit on a roll of 18, 19, or 20 on the d20.",
      },
    ],
    description:
      "Master martial lethal precision with legendary critical strike potential.",
    source: "Player's Handbook (2024), Fighter: Champion",
  },
};
