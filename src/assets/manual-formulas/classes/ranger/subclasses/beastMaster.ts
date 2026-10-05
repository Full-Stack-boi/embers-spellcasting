import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const BEAST_MASTER_FORMULAS: Record<string, ManualActionFormula> = {
  primalCompanion: {
    id: "embers:ranger:beast-master:primal-companion",
    name: "Primal Companion",
    kind: "class_feature",
    status: "verified",
    classes: ["ranger"],
    subclass: "beastMaster",
    activationType: "action",
    operations: [
      {
        type: "apply_effect",
        name: "Beast Companion Command",
        description:
          "Summon Beast of the Land, Sea, or Sky; command it to take actions using a Bonus Action or by replacing one of your weapon attacks.",
      },
    ],
    description:
      "Bond with a primal beast that fights loyally at your side in combat.",
    source: "Player's Handbook (2024), Ranger: Beast Master",
  },

  exceptionalTraining: {
    id: "embers:ranger:beast-master:exceptional-training",
    name: "Exceptional Training",
    kind: "class_feature",
    status: "verified",
    classes: ["ranger"],
    subclass: "beastMaster",
    activationType: "bonus",
    operations: [
      {
        type: "apply_effect",
        name: "Companion Cunning",
        description:
          "On any turn you command your companion, you can command it to take Dash, Disengage, Dodge, or Help as a Bonus Action; attacks count as magical.",
      },
    ],
    description:
      "Train your companion to dodge, reposition, and assist with exceptional agility.",
    source: "Player's Handbook (2024), Ranger: Beast Master",
  },

  bestialFury: {
    id: "embers:ranger:beast-master:bestial-fury",
    name: "Bestial Fury",
    kind: "class_feature",
    status: "verified",
    classes: ["ranger"],
    subclass: "beastMaster",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Multiattack Companion",
        description:
          "When your beast companion attacks, it can make two attacks instead of one and deals extra Hunter's Mark damage.",
      },
    ],
    description:
      "Unleash your companion in a ferocious frenzy of multiple strikes.",
    source: "Player's Handbook (2024), Ranger: Beast Master",
  },
};
