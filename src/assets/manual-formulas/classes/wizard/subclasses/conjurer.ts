import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const CONJURER_FORMULAS: Record<string, ManualActionFormula> = {
  benignTransposition: {
    id: "embers:wizard:conjurer:benign-transposition",
    name: "Benign Transposition",
    kind: "class_feature",
    status: "verified",
    classes: ["wizard"],
    subclass: "conjurer",
    activationType: "bonus",
    resource: {
      name: "Benign Transposition",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Benign Transposition",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Benign Transposition",
        description:
          "As a Bonus Action, you teleport up to 30 feet to an unoccupied space that you can see. Alternatively, you can choose a space within range that is occupied by a Medium or smaller creature. If that creature is willing, you both teleport, swapping places.\n\nYou can use this feature a number of times equal to your Intelligence modifier (minimum of once), and you regain all expended uses when you finish a Long Rest.",
      },
    ],
    description:
      "As a Bonus Action, you teleport up to 30 feet to an unoccupied space that you can see. Alternatively, you can choose a space within range that is occupied by a Medium or smaller creature. If that creature is willing, you both teleport, swapping pl...",
    source: "Arcana Unleashed, Wizard: Conjurer",
  },

  conjurationSavant: {
    id: "embers:wizard:conjurer:conjuration-savant",
    name: "Conjuration Savant",
    kind: "class_feature",
    status: "verified",
    classes: ["wizard"],
    subclass: "conjurer",
    activationType: "special",
    resource: {
      name: "Conjuration Savant",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Conjuration Savant",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Conjuration Savant",
        description:
          "Choose two Wizard spells from the Conjuration school, each of which must be no higher than level 2, and add them to your spellbook for free.\n\nIn addition, whenever you gain access to a new level of spell slots in this class, you can add one Wizard spell from the Conjuration school to your spellbook for free. The chosen spell must be of a level for which you have spell slots.",
      },
    ],
    description:
      "Choose two Wizard spells from the Conjuration school, each of which must be no higher than level 2, and add them to your spellbook for free.\n\nIn addition, whenever you gain access to a new level of spell slots in this class, you can add one Wizard...",
    source: "Arcana Unleashed, Wizard: Conjurer",
  },

  distantTransposition: {
    id: "embers:wizard:conjurer:distant-transposition",
    name: "Distant Transposition",
    kind: "class_feature",
    status: "verified",
    classes: ["wizard"],
    subclass: "conjurer",
    activationType: "special",
    resource: {
      name: "Distant Transposition",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Distant Transposition",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Distant Transposition",
        description:
          "The range of your Benign Transposition feature increases to 60 feet. Additionally, you can restore one use of it by expending a level 3+ spell slot (no action required).",
      },
    ],
    description:
      "The range of your Benign Transposition feature increases to 60 feet. Additionally, you can restore one use of it by expending a level 3+ spell slot (no action required).",
    source: "Arcana Unleashed, Wizard: Conjurer",
  },

  durableSummons: {
    id: "embers:wizard:conjurer:durable-summons",
    name: "Durable Summons",
    kind: "class_feature",
    status: "verified",
    classes: ["wizard"],
    subclass: "conjurer",
    activationType: "special",
    resource: {
      name: "Durable Summons",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Durable Summons",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Durable Summons",
        description:
          "When you cast a Conjuration spell to summon or create a creature using a spell slot, that creature gains Temporary Hit Points equal to twice your Wizard level when it first appears. While it has these Temporary Hit Points, the creature has Resistance to every damage type except Force, Necrotic, Psychic, and Radiant.\n\nThere is no concept of physical distance in the Weave. With enough magical power, you can travel anywhere in existence with merely a thought.",
      },
    ],
    description:
      "When you cast a Conjuration spell to summon or create a creature using a spell slot, that creature gains Temporary Hit Points equal to twice your Wizard level when it first appears. While it has these Temporary Hit Points, the creature has Resista...",
    source: "Arcana Unleashed, Wizard: Conjurer",
  },

  focusedConjuration: {
    id: "embers:wizard:conjurer:focused-conjuration",
    name: "Focused Conjuration",
    kind: "class_feature",
    status: "verified",
    classes: ["wizard"],
    subclass: "conjurer",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Focused Conjuration",
        description:
          "Taking damage can’t break your Concentration on Conjuration spells.",
      },
    ],
    description:
      "Taking damage can’t break your Concentration on Conjuration spells.",
    source: "Arcana Unleashed, Wizard: Conjurer",
  },

  splinteredSummons: {
    id: "embers:wizard:conjurer:splintered-summons",
    name: "Splintered Summons",
    kind: "class_feature",
    status: "verified",
    classes: ["wizard"],
    subclass: "conjurer",
    activationType: "special",
    resource: {
      name: "Splintered Summons",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Splintered Summons",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Splintered Summons",
        description:
          "When you use a spell slot to cast a Conjuration spell that summons a spirit whose stat block is included in the spell description, such as Summon Aberration, you can modify the spell to summon two creatures with the spell instead of one. Each creature is of the same kind, uses the stat block and rules denoted by the spell, and manifests in a different unoccupied space of your choice within the spell’s range, but the summoned creatures’ Hit Point maximums and current Hit Points are halved. If ...",
      },
    ],
    description:
      "When you use a spell slot to cast a Conjuration spell that summons a spirit whose stat block is included in the spell description, such as Summon Aberration, you can modify the spell to summon two creatures with the spell instead of one. Each crea...",
    source: "Arcana Unleashed, Wizard: Conjurer",
  },
};
