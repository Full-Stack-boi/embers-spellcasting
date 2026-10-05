import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const CIRCLE_OF_THE_LAND_FORMULAS: Record<string, ManualActionFormula> =
  {
    landsAid: {
      id: "embers:druid:land:lands-aid",
      name: "Land's Aid",
      kind: "class_feature",
      status: "verified",
      classes: ["druid"],
      subclass: "circleOfTheLand",
      activationType: "action",
      operations: [
        {
          type: "apply_effect",
          name: "Floral Surge",
          description:
            "Action expend 1 Wild Shape: summon a 10-foot-radius sphere within 60 ft; enemies make Constitution save or take 2d8 Necrotic damage (half on save), and one ally regains 2d8 HP.",
        },
      ],
      description:
        "Summon thorny vines and curative pollen to harm enemies and revitalize companions.",
      source: "Player's Handbook (2024), Druid: Circle of the Land",
    },

    naturalRecovery: {
      id: "embers:druid:land:natural-recovery",
      name: "Natural Recovery",
      kind: "class_feature",
      status: "verified",
      classes: ["druid"],
      subclass: "circleOfTheLand",
      activationType: "special",
      resource: {
        name: "Natural Recovery",
        resetType: "Long Rest",
      },
      operations: [
        {
          type: "apply_effect",
          name: "Earth Meditation",
          description:
            "Finish a Short Rest to regain expended spell slots of a combined level equal to half your Druid level (no slot higher than 5th).",
        },
      ],
      description:
        "Commune with the earth during rests to restore your magical reserves.",
      source: "Player's Handbook (2024), Druid: Circle of the Land",
    },

    naturesSanctuary: {
      id: "embers:druid:land:natures-sanctuary",
      name: "Nature's Sanctuary",
      kind: "class_feature",
      status: "verified",
      classes: ["druid"],
      subclass: "circleOfTheLand",
      activationType: "action",
      operations: [
        {
          type: "apply_effect",
          name: "Spectral Grove",
          description:
            "Action manifest a spectral grove in a 15-foot cube: you and allies inside have Half Cover and Resistance to your land's damage type.",
        },
      ],
      description:
        "Erect a sacred nature sanctuary providing defensive cover and elemental wards.",
      source: "Player's Handbook (2024), Druid: Circle of the Land",
    },
  };
