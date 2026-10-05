import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const WARRIOR_OF_THE_ELEMENTS_FORMULAS: Record<
  string,
  ManualActionFormula
> = {
  elementalAttunement: {
    id: "embers:monk:elements:elemental-attunement",
    name: "Elemental Attunement",
    kind: "class_feature",
    status: "verified",
    classes: ["monk"],
    subclass: "warriorOfTheElements",
    activationType: "bonus",
    operations: [
      {
        type: "apply_effect",
        name: "Elemental Reach and Impact",
        description:
          "Bonus Action spend 1 Focus Point: your Unarmed Strikes have +10 ft reach and deal Acid, Cold, Fire, Lightning, or Thunder damage for 10 minutes; push/pull enemies 10 ft on hit.",
      },
    ],
    description:
      "Ignite fists and kicks with elemental force to strike foes at range.",
    source: "Player's Handbook (2024), Monk: Warrior of the Elements",
  },

  elementalBurst: {
    id: "embers:monk:elements:elemental-burst",
    name: "Elemental Burst",
    kind: "class_feature",
    status: "verified",
    classes: ["monk"],
    subclass: "warriorOfTheElements",
    activationType: "action",
    operations: [
      {
        type: "apply_effect",
        name: "Elemental Explosion",
        description:
          "Action spend 2 Focus Points: create a 20-foot-radius sphere within 120 ft; creatures make Dexterity save or take damage equal to 3 rolls of your Martial Arts die (half on save).",
      },
    ],
    description: "Detonate an explosive blast of primeval elemental power.",
    source: "Player's Handbook (2024), Monk: Warrior of the Elements",
  },

  strideOfTheElements: {
    id: "embers:monk:elements:stride-of-the-elements",
    name: "Stride of the Elements",
    kind: "class_feature",
    status: "verified",
    classes: ["monk"],
    subclass: "warriorOfTheElements",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Elemental Flight",
        description:
          "While Elemental Attunement is active, you gain a Fly speed and Swim speed equal to your Speed.",
      },
    ],
    description:
      "Ride thermal updrafts and atmospheric currents with agile flight.",
    source: "Player's Handbook (2024), Monk: Warrior of the Elements",
  },
};
