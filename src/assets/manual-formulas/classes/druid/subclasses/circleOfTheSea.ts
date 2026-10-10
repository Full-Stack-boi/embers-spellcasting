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

  aquaticAffinity: {
    id: "embers:druid:sea:aquatic-affinity",
    name: "Aquatic Affinity",
    kind: "class_feature",
    status: "verified",
    classes: ["druid"],
    subclass: "circleOfTheSea",
    activationType: "special",
    description: "You gain a Swim speed equal to your Speed, and the emanation radius of Wrath of the Sea increases to 15 feet.",
    source: "Player's Handbook (2024), Druid: Circle of the Sea",
    operations: [
      {
        type: "apply_effect",
        name: "Aquatic Mastery",
        description: "Swim speed equals Speed; Wrath of the Sea aura expands to 15-foot radius.",
      },
    ],
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

  oceanicGift: {
    id: "embers:druid:sea:oceanic-gift",
    name: "Oceanic Gift",
    kind: "class_feature",
    status: "verified",
    classes: ["druid"],
    subclass: "circleOfTheSea",
    activationType: "special",
    description: "When you manifest Wrath of the Sea, you can manifest a second ocean aura around a willing creature within 60 feet.",
    source: "Player's Handbook (2024), Druid: Circle of the Sea",
    operations: [
      {
        type: "apply_effect",
        name: "Shared Ocean Tempest",
        description: "A willing ally within 60 feet gains their own Wrath of the Sea aura and benefits from your Stormborn fly speed and resistances.",
      },
    ],
  },
};
