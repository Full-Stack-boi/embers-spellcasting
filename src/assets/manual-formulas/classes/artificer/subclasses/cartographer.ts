import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const CARTOGRAPHER_FORMULAS: Record<string, ManualActionFormula> = {
  toolsOfTheTrade: {
    id: "embers:artificer:cartographer:tools-of-the-trade",
    name: "Tools of the Trade",
    kind: "class_feature",
    status: "verified",
    classes: ["artificer"],
    subclass: "cartographer",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Tools of the Trade",
        description:
          "You gain the following benefits.\n\nTool Proficiency. You gain proficiency with Calligrapher’s Supplies and Cartographer’s Tools. If you already have one of these proficiencies, you gain proficiency with one other type of Artisan’s Tools of your choice (or with two other types if you have both).\n\nScroll Crafting. When you scribe a Spell Scroll using the crafting rules in the Player’s Handbook, the amount of time required to craft it is halved.",
      },
    ],
    description:
      "You gain the following benefits.\n\nTool Proficiency. You gain proficiency with Calligrapher’s Supplies and Cartographer’s Tools. If you already have one of these proficiencies, you gain proficiency with one other type of Artisan’s Tools of your cho...",
    source: "Eberron: Forge of the Artificer, artificer: Cartographer",
  },

  cartographerSpells: {
    id: "embers:artificer:cartographer:cartographer-spells",
    name: "Cartographer Spells",
    kind: "class_feature",
    status: "verified",
    classes: ["artificer"],
    subclass: "cartographer",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Cartographer Spells",
        description:
          "When you reach an Artificer level specified in the Cartographer Spells table, you thereafter always have the listed spells prepared.\n\nCartographer Spells\nArtificer Level\tSpells\n3\tFaerie Fire, Guiding Bolt, Healing Word\n5\tLocate Object, Mind Spike\n9\tCall Lightning, Clairvoyance\n13\tBanishment, Locate Creature\n17\tScrying, Teleportation Circle",
      },
    ],
    description:
      "When you reach an Artificer level specified in the Cartographer Spells table, you thereafter always have the listed spells prepared.\n\nCartographer Spells\nArtificer Level\tSpells\n3\tFaerie Fire, Guiding Bolt, Healing Word\n5\tLocate Object, Mind Spike\n...",
    source: "Eberron: Forge of the Artificer, artificer: Cartographer",
  },

  adventurerSAtlas: {
    id: "embers:artificer:cartographer:adventurer-s-atlas",
    name: "Adventurer’s Atlas",
    kind: "class_feature",
    status: "verified",
    classes: ["artificer"],
    subclass: "cartographer",
    activationType: "special",
    resource: {
      name: "Adventurer’s Atlas",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Adventurer’s Atlas",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Adventurer’s Atlas",
        description:
          "Whenever you finish a Long Rest while holding Cartographer’s Tools, you can use that tool to create a set of magical maps by touching at least two creatures (one of whom can be yourself), up to a maximum number of creatures equal to 1 plus your Intelligence modifier (minimum of two creatures). Each target receives a magical map, which constantly updates to show the relative position of all the map holders but is illegible to all others. The maps last until you die or until you use this featur...",
      },
    ],
    description:
      "Whenever you finish a Long Rest while holding Cartographer’s Tools, you can use that tool to create a set of magical maps by touching at least two creatures (one of whom can be yourself), up to a maximum number of creatures equal to 1 plus your In...",
    source: "Eberron: Forge of the Artificer, artificer: Cartographer",
  },

  mappingMagic: {
    id: "embers:artificer:cartographer:mapping-magic",
    name: "Mapping Magic",
    kind: "class_feature",
    status: "verified",
    classes: ["artificer"],
    subclass: "cartographer",
    activationType: "special",
    resource: {
      name: "Mapping Magic",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Mapping Magic",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Mapping Magic",
        description:
          "You gain the following benefits.\n\nIlluminated Cartography. You can cast Faerie Fire without expending a spell slot, outlining the affected creatures as if in ink. You can do so a number of times equal to your Intelligence modifier (minimum of once), and you regain all expended uses when you finish a Long Rest.\n\nPortal Jump. On your turn, you can spend an amount of movement equal to half your Speed (round down) to teleport to an unoccupied space you can see within 10 feet of yourself or within...",
      },
    ],
    description:
      "You gain the following benefits.\n\nIlluminated Cartography. You can cast Faerie Fire without expending a spell slot, outlining the affected creatures as if in ink. You can do so a number of times equal to your Intelligence modifier (minimum of once...",
    source: "Eberron: Forge of the Artificer, artificer: Cartographer",
  },

  guidedPrecision: {
    id: "embers:artificer:cartographer:guided-precision",
    name: "Guided Precision",
    kind: "class_feature",
    status: "verified",
    classes: ["artificer"],
    subclass: "cartographer",
    activationType: "special",
    resource: {
      name: "Guided Precision",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Guided Precision",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Guided Precision",
        description:
          "Once per turn, whenever you cast a spell from your Cartographer Spells list or hit a creature affected by your Faerie Fire with an attack roll, you can add your Intelligence modifier to one damage roll of the spell or attack.\n\nIn addition, taking damage can’t cause you to lose Concentration on Faerie Fire.",
      },
    ],
    description:
      "Once per turn, whenever you cast a spell from your Cartographer Spells list or hit a creature affected by your Faerie Fire with an attack roll, you can add your Intelligence modifier to one damage roll of the spell or attack.\n\nIn addition, taking ...",
    source: "Eberron: Forge of the Artificer, artificer: Cartographer",
  },

  ingeniousMovement: {
    id: "embers:artificer:cartographer:ingenious-movement",
    name: "Ingenious Movement",
    kind: "class_feature",
    status: "verified",
    classes: ["artificer"],
    subclass: "cartographer",
    activationType: "reaction",
    operations: [
      {
        type: "apply_effect",
        name: "Ingenious Movement",
        description:
          "When you use your Flash of Genius, you or a willing creature of your choice that you can see within 30 feet of yourself can teleport up to 30 feet to an unoccupied space you can see as part of that same Reaction.",
      },
    ],
    description:
      "When you use your Flash of Genius, you or a willing creature of your choice that you can see within 30 feet of yourself can teleport up to 30 feet to an unoccupied space you can see as part of that same Reaction.",
    source: "Eberron: Forge of the Artificer, artificer: Cartographer",
  },

  superiorAtlas: {
    id: "embers:artificer:cartographer:superior-atlas",
    name: "Superior Atlas",
    kind: "class_feature",
    status: "verified",
    classes: ["artificer"],
    subclass: "cartographer",
    activationType: "special",
    resource: {
      name: "Superior Atlas",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Superior Atlas",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Superior Atlas",
        description:
          "Your Adventurer’s Atlas improves, gaining the following benefits.\n\nSafe Haven. When a map holder would be reduced to 0 Hit Points but not killed outright, that creature can destroy its map. The creature’s Hit Points instead change to a number equal to twice your Artificer level, and the creature is teleported to an unoccupied space within 5 feet of you or another map holder of its choice.\n\nUnerring Path. If you are one of the map holders for your Adventurer’s Atlas, you can cast Find the Path...",
      },
    ],
    description:
      "Your Adventurer’s Atlas improves, gaining the following benefits.\n\nSafe Haven. When a map holder would be reduced to 0 Hit Points but not killed outright, that creature can destroy its map. The creature’s Hit Points instead change to a number equa...",
    source: "Eberron: Forge of the Artificer, artificer: Cartographer",
  },
};
