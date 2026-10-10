import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const CIRCLE_OF_THE_STARS_FORMULAS: Record<string, ManualActionFormula> =
  {
    starMap: {
      id: "embers:druid:stars:star-map",
      name: "Star Map",
      kind: "class_feature",
      status: "verified",
      classes: ["druid"],
      subclass: "circleOfTheStars",
      activationType: "special",
      operations: [
        {
          type: "apply_effect",
          name: "Cosmic Guidance",
          description:
            "You know the Guidance cantrip and can cast Guiding Bolt without a spell slot a number of times equal to your Proficiency Bonus per Long Rest.",
        },
      ],
      description:
        "Chart celestial constellations to channel radiant guidance and guiding bolts.",
      source: "Player's Handbook (2024), Druid: Circle of the Stars",
    },

    starryForm: {
      id: "embers:druid:stars:starry-form",
      name: "Starry Form",
      kind: "class_feature",
      status: "verified",
      classes: ["druid"],
      subclass: "circleOfTheStars",
      activationType: "bonus",
      description: "Bonus Action expend 1 Wild Shape: assume a starry constellation form for 10 minutes.",
      source: "Player's Handbook (2024), Druid: Circle of the Stars",
      operations: [],
      options: [
        {
          id: "archer",
          name: "Archer",
          description: "When you activate this form and as a Bonus Action on subsequent turns, make a ranged spell attack against a creature within 60 feet, dealing 1d8 (2d8 at Level 10) + Wisdom modifier Radiant damage.",
        },
        {
          id: "chalice",
          name: "Chalice",
          description: "Whenever you cast a spell that restores Hit Points using a spell slot, you or another creature within 30 feet regains 1d8 (2d8 at Level 10) + Wisdom modifier Hit Points.",
        },
        {
          id: "dragon",
          name: "Dragon",
          description: "When you make an Intelligence or Wisdom check or a Constitution saving throw to maintain Concentration, any roll of 9 or lower on the d20 is treated as a 10.",
        },
      ],
    },

    cosmicOmen: {
      id: "embers:druid:stars:cosmic-omen",
      name: "Cosmic Omen",
      kind: "class_feature",
      status: "verified",
      classes: ["druid"],
      subclass: "circleOfTheStars",
      activationType: "reaction",
      operations: [
        {
          type: "apply_effect",
          name: "Weal or Woe",
          description:
            "Roll d6 after Long Rest: Weal (reaction add 1d6 to an ally's d20 test) or Woe (reaction subtract 1d6 from an enemy's d20 test) equal to Wisdom modifier uses per Long Rest.",
        },
      ],
      description:
        "Consult the night sky at dawn to divine fortunes of fortune or disaster.",
      source: "Player's Handbook (2024), Druid: Circle of the Stars",
    },

    twinklingConstellations: {
      id: "embers:druid:stars:twinkling-constellations",
      name: "Twinkling Constellations",
      kind: "class_feature",
      status: "verified",
      classes: ["druid"],
      subclass: "circleOfTheStars",
      activationType: "special",
      description: "The constellation dice for Archer and Chalice increase to 2d8, and you can change which constellation form you are in at the start of each of your turns.",
      source: "Player's Handbook (2024), Druid: Circle of the Stars",
      operations: [],
    },

    fullOfStars: {
      id: "embers:druid:stars:full-of-stars",
      name: "Full of Stars",
      kind: "class_feature",
      status: "verified",
      classes: ["druid"],
      subclass: "circleOfTheStars",
      activationType: "special",
      description: "While in your Starry Form, you become partially incorporeal, gaining Resistance to Bludgeoning, Piercing, and Slashing damage.",
      source: "Player's Handbook (2024), Druid: Circle of the Stars",
      operations: [
        {
          type: "apply_effect",
          name: "Starry Incorporeality",
          description: "Resistance to Bludgeoning, Piercing, and Slashing damage while in Starry Form.",
        },
      ],
    },
  };
