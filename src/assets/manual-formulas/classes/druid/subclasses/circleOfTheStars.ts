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
      operations: [
        {
          type: "apply_effect",
          name: "Constellation Aspect",
          description:
            "Bonus Action spend 1 Wild Shape: assume Starry Form for 10 minutes: Archer (Bonus Action 1d8+WIS radiant arrow 60 ft), Chalice (heal extra 1d8+WIS on healing spells), or Dragon (minimum 10 on concentration saves).",
        },
      ],
      description:
        "Glimmer with the patterns of constellations: Archer, Chalice, or Dragon.",
      source: "Player's Handbook (2024), Druid: Circle of the Stars",
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
            "Roll d6 after Long Rest: Weal (reaction add 1d6 to an ally's d20 test) or Woe (reaction subtract 1d6 from an enemy's d20 test) equal to Proficiency Bonus uses.",
        },
      ],
      description:
        "Consult the night sky at dawn to divine fortunes of fortune or disaster.",
      source: "Player's Handbook (2024), Druid: Circle of the Stars",
    },
  };
