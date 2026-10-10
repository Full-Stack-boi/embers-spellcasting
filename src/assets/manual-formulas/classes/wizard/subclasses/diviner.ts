import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const DIVINER_FORMULAS: Record<string, ManualActionFormula> = {
  portent: {
    id: "embers:wizard:diviner:portent",
    name: "Portent",
    kind: "class_feature",
    status: "verified",
    classes: ["wizard"],
    subclass: "diviner",
    activationType: "special",
    resource: {
      name: "Portent Dice",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "apply_effect",
        name: "Foretold D20s",
        description:
          "Roll two d20s at the end of a Long Rest. Before any creature you see rolls a d20 test, replace the roll with one of your foretold portent dice.",
      },
    ],
    description:
      "Glimpse fragments of the future and substitute destiny's rolls.",
    source: "Player's Handbook (2024), Wizard: Diviner",
  },

  expertDivination: {
    id: "embers:wizard:diviner:expert-divination",
    name: "Expert Divination",
    kind: "class_feature",
    status: "verified",
    classes: ["wizard"],
    subclass: "diviner",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Slot Rebate",
        description:
          "When you cast a level 2+ Divination spell using a spell slot, regain an expended spell slot of a lower level (max 5th).",
      },
    ],
    description:
      "Reclaim magical energy whenever consulting the omens of divination.",
    source: "Player's Handbook (2024), Wizard: Diviner",
  },

  theThirdEye: {
    id: "embers:wizard:diviner:the-third-eye",
    name: "The Third Eye",
    kind: "class_feature",
    status: "verified",
    classes: ["wizard"],
    subclass: "diviner",
    activationType: "action",
    resource: {
      name: "The Third Eye",
      resetType: "Short or Long Rest",
    },
    operations: [
      {
        type: "apply_effect",
        name: "Sensory Revelation",
        description:
          "Action gain one sensory gift until rest: Darkvision 60 ft, Ethereal Sight 60 ft, Read All Languages, or See Invisibility 60 ft.",
      },
    ],
    description:
      "Awaken your mystical third eye to perceive unseen dimensional truths.",
    source: "Player's Handbook (2024), Wizard: Diviner",
  },

  greaterPortent: {
    id: "embers:wizard:diviner:greater-portent",
    name: "Greater Portent",
    kind: "class_feature",
    status: "verified",
    classes: ["wizard"],
    subclass: "diviner",
    activationType: "special",
    description: "The vision of your portent grows clearer: roll three d20s for your Portent feature instead of two.",
    source: "Player's Handbook (2024), Wizard: Diviner",
    operations: [
      {
        type: "apply_effect",
        name: "Three Portent Dice",
        description: "Roll three d20s at the end of a Long Rest for your Portent pool.",
      },
    ],
  },
};
