import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const CIRCLE_OF_THE_SEA_FORMULAS: Record<string, ManualActionFormula> = {
  wrathOfTheSea: {
    id: "embers:druid:sea:wrath-of-the-sea",
    name: "Wrath of the Sea",
    kind: "class_feature",
    status: "verified",
    classes: ["druid"],
    subclass: "circleOfTheSea",
    activationType: "bonus",
    operations: [
      {
        type: "apply_effect",
        name: "Oceanic Tempest Aura",
        description:
          "Bonus Action expend 1 Wild Shape: manifest a 10-foot emanation storm aura for 10 minutes. When manifest and as a Bonus Action on subsequent turns, blast an enemy for Cold or Thunder damage equal to d6s (scale with level) and push it 15 ft.",
      },
    ],
    description:
      "Summon the raging surf and tempest winds to blast nearby adversaries.",
    source: "Player's Handbook (2024), Druid: Circle of the Sea",
  },

  stormborn: {
    id: "embers:druid:sea:stormborn",
    name: "Stormborn",
    kind: "class_feature",
    status: "verified",
    classes: ["druid"],
    subclass: "circleOfTheSea",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Aerial Surf",
        description:
          "While Wrath of the Sea is active, you have a Fly speed equal to your Speed and Resistance to Cold, Lightning, and Thunder damage.",
      },
    ],
    description:
      "Ride gale-force ocean winds with lightning-fast flight and elemental resistance.",
    source: "Player's Handbook (2024), Druid: Circle of the Sea",
  },
};
