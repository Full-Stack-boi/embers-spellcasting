import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const TRANSMUTER_FORMULAS: Record<string, ManualActionFormula> = {
  transmutationSavant: {
    id: "embers:wizard:transmuter:transmutation-savant",
    name: "Transmutation Savant",
    kind: "class_feature",
    status: "verified",
    classes: ["wizard"],
    subclass: "transmuter",
    activationType: "special",
    resource: {
      name: "Transmutation Savant",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Transmutation Savant",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Transmutation Savant",
        description:
          "Choose two Wizard spells from the Transmutation school, each of which must be no higher than level 2, and add them to your spellbook for free.\n\nIn addition, whenever you gain access to a new level of spell slots in this class, you can add one Wizard spell from the Transmutation school to your spellbook for free. The chosen spell must be of a level for which you have spell slots.",
      },
    ],
    description:
      "Choose two Wizard spells from the Transmutation school, each of which must be no higher than level 2, and add them to your spellbook for free.\n\nIn addition, whenever you gain access to a new level of spell slots in this class, you can add one Wiza...",
    source: "Arcana Unleashed, Wizard: Transmuter",
  },

  transmuterSStone: {
    id: "embers:wizard:transmuter:transmuter-s-stone",
    name: "Transmuter’s Stone",
    kind: "class_feature",
    status: "verified",
    classes: ["wizard"],
    subclass: "transmuter",
    activationType: "special",
    resource: {
      name: "Transmuter’s Stone",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Transmuter’s Stone",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Transmuter’s Stone",
        description:
          "When you finish a Long Rest, you can create a magic stone that lasts until you use this feature again. The stone is a Tiny object, and you can use it as a Spellcasting Focus for your Wizard spells. A creature with the stone in its possession gains proficiency in Constitution saving throws and one of the following benefits, which you choose when you create the stone. You can change the stone’s benefit when you cast a Transmutation spell using a spell slot.\n\nDarkvision. The bearer gains Darkvis...",
      },
    ],
    description:
      "When you finish a Long Rest, you can create a magic stone that lasts until you use this feature again. The stone is a Tiny object, and you can use it as a Spellcasting Focus for your Wizard spells. A creature with the stone in its possession gains...",
    source: "Arcana Unleashed, Wizard: Transmuter",
  },

  wondrousAlteration: {
    id: "embers:wizard:transmuter:wondrous-alteration",
    name: "Wondrous Alteration",
    kind: "class_feature",
    status: "verified",
    classes: ["wizard"],
    subclass: "transmuter",
    activationType: "bonus",
    resource: {
      name: "Wondrous Alteration",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Wondrous Alteration",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Wondrous Alteration",
        description:
          "You always have the Alter Self spell prepared and can cast it once without expending a spell slot. You regain the ability to cast it in this way when you finish a Long Rest.\n\nWhile under the effects of Alter Self, you gain an additional benefit for each of its options.\n\nAquatic Adaptation. While underwater, you can take the Dash action as a Bonus Action.\n\nChange Appearance. You have Advantage on Charisma (Deception) checks.\n\nNatural Weapons. The damage of your new growth increases to 2d6 dama...",
      },
    ],
    description:
      "You always have the Alter Self spell prepared and can cast it once without expending a spell slot. You regain the ability to cast it in this way when you finish a Long Rest.\n\nWhile under the effects of Alter Self, you gain an additional benefit fo...",
    source: "Arcana Unleashed, Wizard: Transmuter",
  },

  empoweredTransmutation: {
    id: "embers:wizard:transmuter:empowered-transmutation",
    name: "Empowered Transmutation",
    kind: "class_feature",
    status: "verified",
    classes: ["wizard"],
    subclass: "transmuter",
    activationType: "special",
    resource: {
      name: "Empowered Transmutation",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Empowered Transmutation",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Empowered Transmutation",
        description:
          "When you use a spell slot to cast a Transmutation spell that doesn’t make an attack roll or force a saving throw, such as Fly or Magic Weapon, you can increase the spell’s effective level by 1.\n\nYou can use this feature a number of times equal to your Intelligence modifier (minimum of once), and you regain all expended uses when you finish a Long Rest.",
      },
    ],
    description:
      "When you use a spell slot to cast a Transmutation spell that doesn’t make an attack roll or force a saving throw, such as Fly or Magic Weapon, you can increase the spell’s effective level by 1.\n\nYou can use this feature a number of times equal to ...",
    source: "Arcana Unleashed, Wizard: Transmuter",
  },

  potentStone: {
    id: "embers:wizard:transmuter:potent-stone",
    name: "Potent Stone",
    kind: "class_feature",
    status: "verified",
    classes: ["wizard"],
    subclass: "transmuter",
    activationType: "special",
    resource: {
      name: "Potent Stone",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Potent Stone",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Potent Stone",
        description:
          "Your Transmuter’s Stone is more versatile. When you create your Transmuter’s Stone, you can choose up to two benefits. You can choose each option other than Resistance only once. If you choose Resistance twice, you must choose different damage types. You can change either or both benefits when you cast a Transmutation spell using a spell slot.\n\nIn addition, the following are now among your benefit options for Transmuter’s Stone.\n\nMighty Build. The bearer has Advantage on Strength saving throw...",
      },
    ],
    description:
      "Your Transmuter’s Stone is more versatile. When you create your Transmuter’s Stone, you can choose up to two benefits. You can choose each option other than Resistance only once. If you choose Resistance twice, you must choose different damage typ...",
    source: "Arcana Unleashed, Wizard: Transmuter",
  },

  shapeShifter: {
    id: "embers:wizard:transmuter:shape-shifter",
    name: "Shape-Shifter",
    kind: "class_feature",
    status: "verified",
    classes: ["wizard"],
    subclass: "transmuter",
    activationType: "special",
    resource: {
      name: "Shape-Shifter",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Shape-Shifter",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Shape-Shifter",
        description:
          "You always have the Polymorph spell prepared and can cast it once without expending a spell slot. You regain the ability to cast it in this way when you finish a Long Rest.\n\nIn addition, when you target yourself with the spell, you can modify the spell to gain the benefits below. Once you modify the spell using this feature, you can’t do so again until you finish a Long Rest.\n\nGame Statistics. In addition to retaining the features specified in the spell, you retain your memories and ability t...",
      },
    ],
    description:
      "You always have the Polymorph spell prepared and can cast it once without expending a spell slot. You regain the ability to cast it in this way when you finish a Long Rest.\n\nIn addition, when you target yourself with the spell, you can modify the ...",
    source: "Arcana Unleashed, Wizard: Transmuter",
  },

  masterTransmuter: {
    id: "embers:wizard:transmuter:master-transmuter",
    name: "Master Transmuter",
    kind: "class_feature",
    status: "verified",
    classes: ["wizard"],
    subclass: "transmuter",
    activationType: "action",
    resource: {
      name: "Master Transmuter",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Master Transmuter",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Master Transmuter",
        description:
          "While you carry your Transmuter’s Stone, you can take a Magic action to consume the reserve of transmutation magic stored inside and choose one of the following benefits. After you use the stone in this way, it crumbles to dust. You can prevent the stone from crumbling by expending a level 7+ spell slot as part of the Magic action you take using this feature.\n\nMajor Transformation. You can transmute one nonmagical object—no larger than a 10-foot Cube or eight connected 5-foot Cubes—into anoth...",
      },
    ],
    description:
      "While you carry your Transmuter’s Stone, you can take a Magic action to consume the reserve of transmutation magic stored inside and choose one of the following benefits. After you use the stone in this way, it crumbles to dust. You can prevent th...",
    source: "Arcana Unleashed, Wizard: Transmuter",
  },
};
