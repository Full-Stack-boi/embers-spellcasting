import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const PRIMORDIAL_ARCHER_FORMULAS: Record<string, ManualActionFormula> = {
  elementalArrows: {
    id: "embers:ranger:primordial-archer:elemental-arrows",
    name: "Elemental Arrows",
    kind: "class_feature",
    status: "verified",
    classes: ["ranger"],
    subclass: "primordialArcher",
    activationType: "bonus",
    resource: {
      name: "Elemental Arrows",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Elemental Arrows",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Elemental Arrows",
        description:
          "As a Bonus Action, you can imbue a Longbow or Shortbow with elemental energy for 1 minute. Choose one of the following damage types: Acid, Cold, Fire, Lightning, or Thunder. For the duration, the imbued weapon deals damage of the selected type instead of its normal type and deals an extra 1d6 damage of the chosen type when it hits. At the start of each of your turns, you can change this choice.\n\nYou can use this feature a number of times equal to your Wisdom modifier (minimum of once), and yo...",
      },
    ],
    description:
      "As a Bonus Action, you can imbue a Longbow or Shortbow with elemental energy for 1 minute. Choose one of the following damage types: Acid, Cold, Fire, Lightning, or Thunder. For the duration, the imbued weapon deals damage of the selected type ins...",
    source: "Grim Hollow: Player’s Guide, Ranger: Primordial Archer",
  },

  herbalLore: {
    id: "embers:ranger:primordial-archer:herbal-lore",
    name: "Herbal Lore",
    kind: "class_feature",
    status: "verified",
    classes: ["ranger"],
    subclass: "primordialArcher",
    activationType: "bonus",
    resource: {
      name: "Herbal Lore",
      resetType: "Short or Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Herbal Lore",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Herbal Lore",
        description:
          "You gain an Herbalism Kit and are proficient with it. You can use the Herbalism Kit as a Bonus Action to stabilize an Unconscious creature within 5 feet of you that has 0 Hit Points as if using a Healer’s Kit without needing to make a Wisdom (Medicine) check. If you take a Utilize action, an Unconscious creature within 5 feet of you that has 0 Hit Points gains 1 Hit Point instead.\n\nOnce you use this feature, you can’t do so again until you finish a Short or Long Rest.",
      },
    ],
    description:
      "You gain an Herbalism Kit and are proficient with it. You can use the Herbalism Kit as a Bonus Action to stabilize an Unconscious creature within 5 feet of you that has 0 Hit Points as if using a Healer’s Kit without needing to make a Wisdom (Medi...",
    source: "Grim Hollow: Player’s Guide, Ranger: Primordial Archer",
  },

  primordialArcherSpells: {
    id: "embers:ranger:primordial-archer:primordial-archer-spells",
    name: "Primordial Archer Spells",
    kind: "class_feature",
    status: "verified",
    classes: ["ranger"],
    subclass: "primordialArcher",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Primordial Archer Spells",
        description:
          "When you reach a Ranger level specified in the Primordial Archer Spells table, you thereafter always have the listed spells prepared.\n\nPrimordial Archer Spells\nRanger Level\tSpells\n3\tHex\n5\tBlindness/Deafness\n9\tCall Lightning\n13\tPolymorph\n17\tWall of Stone",
      },
    ],
    description:
      "When you reach a Ranger level specified in the Primordial Archer Spells table, you thereafter always have the listed spells prepared.\n\nPrimordial Archer Spells\nRanger Level\tSpells\n3\tHex\n5\tBlindness/Deafness\n9\tCall Lightning\n13\tPolymorph\n17\tWall of...",
    source: "Grim Hollow: Player’s Guide, Ranger: Primordial Archer",
  },

  weaveTheElements: {
    id: "embers:ranger:primordial-archer:weave-the-elements",
    name: "Weave the Elements",
    kind: "class_feature",
    status: "verified",
    classes: ["ranger"],
    subclass: "primordialArcher",
    activationType: "special",
    resource: {
      name: "Weave the Elements",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Weave the Elements",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Weave the Elements",
        description:
          "With 1 hour of work or when you finish a Long Rest, you can use an Herbalism Kit to mark yourself with elemental patterns. You gain Resistance to one of the following damage types of your choice until you finish a Long Rest: Acid, Cold, Fire, Lightning, or Thunder.",
      },
    ],
    description:
      "With 1 hour of work or when you finish a Long Rest, you can use an Herbalism Kit to mark yourself with elemental patterns. You gain Resistance to one of the following damage types of your choice until you finish a Long Rest: Acid, Cold, Fire, Ligh...",
    source: "Grim Hollow: Player’s Guide, Ranger: Primordial Archer",
  },

  witchingArrows: {
    id: "embers:ranger:primordial-archer:witching-arrows",
    name: "Witching Arrows",
    kind: "class_feature",
    status: "verified",
    classes: ["ranger"],
    subclass: "primordialArcher",
    activationType: "special",
    resource: {
      name: "Witching Arrows",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Witching Arrows",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Witching Arrows",
        description:
          "You gain the ability to imbue curses into your arrows. Once per turn when you hit a creature with a ranged attack using a Longbow or Shortbow, you can expend a level 1+ spell slot to choose one of the following effects (no action required). The listed damage increases by 2d6 for each spell slot above 1.\n\nArcing Shot. Electricity crackles around the arrow. Make a ranged attack roll with the same weapon against a second creature within 30 feet of the first that is also within your range. Each c...",
      },
    ],
    description:
      "You gain the ability to imbue curses into your arrows. Once per turn when you hit a creature with a ranged attack using a Longbow or Shortbow, you can expend a level 1+ spell slot to choose one of the following effects (no action required). The li...",
    source: "Grim Hollow: Player’s Guide, Ranger: Primordial Archer",
  },

  primordialMagic: {
    id: "embers:ranger:primordial-archer:primordial-magic",
    name: "Primordial Magic",
    kind: "class_feature",
    status: "verified",
    classes: ["ranger"],
    subclass: "primordialArcher",
    activationType: "bonus",
    resource: {
      name: "Primordial Magic",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Primordial Magic",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Primordial Magic",
        description:
          "Taking damage can’t break your Concentration on any Ranger spells you cast.\n\nIn addition, you can take a Bonus Action to change the damage type you chose for the Weave the Elements feature to a different damage type in the list. When you do, you can choose a creature that you can see within 30 feet of yourself. That creature must succeed on a Constitution saving throw or take 6d6 damage of either damage type (your choice).\n\nYou can use this feature a number of times equal to your Wisdom modif...",
      },
    ],
    description:
      "Taking damage can’t break your Concentration on any Ranger spells you cast.\n\nIn addition, you can take a Bonus Action to change the damage type you chose for the Weave the Elements feature to a different damage type in the list. When you do, you c...",
    source: "Grim Hollow: Player’s Guide, Ranger: Primordial Archer",
  },
};
