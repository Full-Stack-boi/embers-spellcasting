import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const LIVING_CRUCIBLE_FORMULAS: Record<string, ManualActionFormula> = {
  compoundCreator: {
    id: "embers:fighter:living-crucible:compound-creator",
    name: "Compound Creator",
    kind: "class_feature",
    status: "verified",
    classes: ["fighter"],
    subclass: "livingCrucible",
    activationType: "bonus",
    resource: {
      name: "Compound Creator",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Compound Creator",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Compound Creator",
        description:
          "You learn to create alchemical compounds toxic to others but empowering to you.\n\nCompounds. You learn three compounds of your choice from the “Compound Options” section below. You learn two additional compounds of your choice when you reach Fighter levels 7, 10, and 15. Each time you learn new compounds, you can also replace one compound you know with a different one.\n\nCreating. Whenever you finish a Long Rest while holding Alchemist’s Supplies, you can use that tool to magically produce any ...",
      },
    ],
    description:
      "You learn to create alchemical compounds toxic to others but empowering to you.\n\nCompounds. You learn three compounds of your choice from the “Compound Options” section below. You learn two additional compounds of your choice when you reach Fighte...",
    source: "Grim Hollow: Player’s Guide, Fighter: Living Crucible",
  },

  studentOfAlchemy: {
    id: "embers:fighter:living-crucible:student-of-alchemy",
    name: "Student of Alchemy",
    kind: "class_feature",
    status: "verified",
    classes: ["fighter"],
    subclass: "livingCrucible",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Student of Alchemy",
        description:
          "You gain Alchemist’s Supplies, and you have proficiency with it. In addition, your Proficiency Bonus is doubled for ability checks with Alchemist’s Supplies.",
      },
    ],
    description:
      "You gain Alchemist’s Supplies, and you have proficiency with it. In addition, your Proficiency Bonus is doubled for ability checks with Alchemist’s Supplies.",
    source: "Grim Hollow: Player’s Guide, Fighter: Living Crucible",
  },

  livingCauldron: {
    id: "embers:fighter:living-crucible:living-cauldron",
    name: "Living Cauldron",
    kind: "class_feature",
    status: "verified",
    classes: ["fighter"],
    subclass: "livingCrucible",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Living Cauldron",
        description:
          "The number of compounds you can safely consume increases to three plus your Constitution modifier (minimum one).\n\nAt Fighter level 18, the number of compounds you can safely consume increases to five plus your Constitution modifier (minimum one).",
      },
    ],
    description:
      "The number of compounds you can safely consume increases to three plus your Constitution modifier (minimum one).\n\nAt Fighter level 18, the number of compounds you can safely consume increases to five plus your Constitution modifier (minimum one).",
    source: "Grim Hollow: Player’s Guide, Fighter: Living Crucible",
  },

  rapidConsumption: {
    id: "embers:fighter:living-crucible:rapid-consumption",
    name: "Rapid Consumption",
    kind: "class_feature",
    status: "verified",
    classes: ["fighter"],
    subclass: "livingCrucible",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Rapid Consumption",
        description:
          "When you use a Bonus Action to drink a compound, you can drink a second compound.",
      },
    ],
    description:
      "When you use a Bonus Action to drink a compound, you can drink a second compound.",
    source: "Grim Hollow: Player’s Guide, Fighter: Living Crucible",
  },

  toxinTransmutation: {
    id: "embers:fighter:living-crucible:toxin-transmutation",
    name: "Toxin Transmutation",
    kind: "class_feature",
    status: "verified",
    classes: ["fighter"],
    subclass: "livingCrucible",
    activationType: "bonus",
    resource: {
      name: "Toxin Transmutation",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Toxin Transmutation",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Toxin Transmutation",
        description:
          "You have Resistance to Poison damage. Also, as a Bonus Action, you can end the Poisoned condition on yourself.\n\nWhen you end the Poisoned condition on yourself in this way, you can choose to gain Temporary Hit Points equal to your Fighter level. You regain the ability to gain these Temporary Hit Points after completing a Long Rest.",
      },
    ],
    description:
      "You have Resistance to Poison damage. Also, as a Bonus Action, you can end the Poisoned condition on yourself.\n\nWhen you end the Poisoned condition on yourself in this way, you can choose to gain Temporary Hit Points equal to your Fighter level. Y...",
    source: "Grim Hollow: Player’s Guide, Fighter: Living Crucible",
  },

  livingCatalyst: {
    id: "embers:fighter:living-crucible:living-catalyst",
    name: "Living Catalyst",
    kind: "class_feature",
    status: "verified",
    classes: ["fighter"],
    subclass: "livingCrucible",
    activationType: "special",
    resource: {
      name: "Living Catalyst",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Living Catalyst",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Living Catalyst",
        description:
          "When you finish a Long Rest, you can replace one compound you know with another one.",
      },
    ],
    description:
      "When you finish a Long Rest, you can replace one compound you know with another one.",
    source: "Grim Hollow: Player’s Guide, Fighter: Living Crucible",
  },

  compoundOptions: {
    id: "embers:fighter:living-crucible:compound-options",
    name: "Compound Options",
    kind: "class_feature",
    status: "verified",
    classes: ["fighter"],
    subclass: "livingCrucible",
    activationType: "bonus",
    resource: {
      name: "Compound Options",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Compound Options",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Compound Options",
        description:
          "The compounds are presented here in alphabetical order.\n\nAdrenal Injection. For 1 minute, your Speed increases by 10 feet. In addition, once on each of your turns, you can jump up to 30 feet by spending 10 feet of movement.\n\nAllsense Injection. For 1 minute, you have Blindsight with a range of 30 feet.\n\nArcane Eye Oil. For 1 hour, you sense the presence of magical effects within 30 feet of yourself. If you sense such effects, you can take the Magic action to see a faint aura around any visibl...",
      },
    ],
    description:
      "The compounds are presented here in alphabetical order.\n\nAdrenal Injection. For 1 minute, your Speed increases by 10 feet. In addition, once on each of your turns, you can jump up to 30 feet by spending 10 feet of movement.\n\nAllsense Injection. Fo...",
    source: "Grim Hollow: Player’s Guide, Fighter: Living Crucible",
  },
};
