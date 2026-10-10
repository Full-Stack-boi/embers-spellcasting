import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const WARRIOR_OF_SHADOW_FORMULAS: Record<string, ManualActionFormula> = {
  shadowArts: {
    id: "embers:monk:shadow:shadow-arts",
    name: "Shadow Arts",
    kind: "class_feature",
    status: "verified",
    classes: ["monk"],
    subclass: "warriorOfShadow",
    activationType: "action",
    operations: [
      {
        type: "apply_effect",
        name: "Veil of Darkness",
        description:
          "Spend 1 Focus Point to cast Darkness without spell components; you can see through this darkness, and you gain 60 feet of Darkvision.",
      },
    ],
    description:
      "Shrouds the battlefield in supernatural darkness that only your eyes pierce.",
    source: "Player's Handbook (2024), Monk: Warrior of Shadow",
  },

  shadowStep: {
    id: "embers:monk:shadow:shadow-step",
    name: "Shadow Step",
    kind: "class_feature",
    status: "verified",
    classes: ["monk"],
    subclass: "warriorOfShadow",
    activationType: "bonus",
    operations: [
      {
        type: "apply_effect",
        name: "Umbral Jaunt",
        description:
          "Bonus Action while in Dim Light or Darkness: teleport up to 60 feet to an unoccupied space you can see that is also in Dim Light or Darkness; you have Advantage on your next melee attack this turn.",
      },
    ],
    description:
      "Step seamlessly through shadows to emerge behind unsuspecting foes.",
    source: "Player's Handbook (2024), Monk: Warrior of Shadow",
  },

  improvedShadowStep: {
    id: "embers:monk:shadow:improved-shadow-step",
    name: "Improved Shadow Step",
    kind: "class_feature",
    status: "verified",
    classes: ["monk"],
    subclass: "warriorOfShadow",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Shadow Strike Jaunt",
        description:
          "When you use Shadow Step, you can make one Unarmed Strike as part of that same Bonus Action. In addition, you can spend 1 Focus Point to ignore the lighting requirement for your destination space.",
      },
    ],
    description:
      "Strike immediately upon emerging from shadows and teleport even into brightly lit spaces.",
    source: "Player's Handbook (2024), Monk: Warrior of Shadow",
  },

  cloakOfShadows: {
    id: "embers:monk:shadow:cloak-of-shadows",
    name: "Cloak of Shadows",
    kind: "class_feature",
    status: "verified",
    classes: ["monk"],
    subclass: "warriorOfShadow",
    activationType: "bonus",
    operations: [
      {
        type: "apply_effect",
        name: "Shadow Shroud",
        description:
          "Bonus Action spend 3 Focus Points while in Dim Light or Darkness to become Invisible for 1 minute; you can use Flurry of Blows without spending Focus Points while this invisibility lasts.",
      },
    ],
    description:
      "Merge completely into the gloom to become an unseen shadow wraith.",
    source: "Player's Handbook (2024), Monk: Warrior of Shadow",
  },
};
