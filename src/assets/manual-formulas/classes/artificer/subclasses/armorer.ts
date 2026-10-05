import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const ARMORER_FORMULAS: Record<string, ManualActionFormula> = {
  toolsOfTheTrade: {
    id: "embers:artificer:armorer:tools-of-the-trade",
    name: "Tools of the Trade",
    kind: "class_feature",
    status: "verified",
    classes: ["artificer"],
    subclass: "armorer",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Tools of the Trade",
        description:
          "You gain the following benefits.\n\nArmor Training. You gain training with Heavy armor.\n\nTool Proficiency. You gain proficiency with Smith’s Tools. If you already have this tool proficiency, you gain proficiency with one other type of Artisan’s Tools of your choice.\n\nArmor Crafting. When you craft nonmagical or magic armor, the amount of time required to craft it is halved.",
      },
    ],
    description:
      "You gain the following benefits.\n\nArmor Training. You gain training with Heavy armor.\n\nTool Proficiency. You gain proficiency with Smith’s Tools. If you already have this tool proficiency, you gain proficiency with one other type of Artisan’s Tool...",
    source: "Eberron: Forge of the Artificer, artificer: Armorer",
  },

  armorerSpells: {
    id: "embers:artificer:armorer:armorer-spells",
    name: "Armorer Spells",
    kind: "class_feature",
    status: "verified",
    classes: ["artificer"],
    subclass: "armorer",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Armorer Spells",
        description:
          "When you reach an Artificer level specified in the Armorer Spells table, you thereafter always have the listed spells prepared.\n\nArmorer Spells\nArtificer Level\tSpells\n3\tMagic Missile, Thunderwave\n5\tMirror Image, Shatter\n9\tHypnotic Pattern, Lightning Bolt\n13\tFire Shield, Greater Invisibility\n17\tPasswall, Wall of Force",
      },
    ],
    description:
      "When you reach an Artificer level specified in the Armorer Spells table, you thereafter always have the listed spells prepared.\n\nArmorer Spells\nArtificer Level\tSpells\n3\tMagic Missile, Thunderwave\n5\tMirror Image, Shatter\n9\tHypnotic Pattern, Lightni...",
    source: "Eberron: Forge of the Artificer, artificer: Armorer",
  },

  arcaneArmor: {
    id: "embers:artificer:armorer:arcane-armor",
    name: "Arcane Armor",
    kind: "class_feature",
    status: "verified",
    classes: ["artificer"],
    subclass: "armorer",
    activationType: "action",
    operations: [
      {
        type: "apply_effect",
        name: "Arcane Armor",
        description:
          "As a Magic action while you have Smith’s Tools in hand, you can turn a suit of armor you are wearing into Arcane Armor. The armor continues to be Arcane Armor until you don another suit of armor or you die.\n\nYou gain the following benefits while wearing your Arcane Armor.\n\nNo Strength Requirement. If the armor normally has a Strength requirement, the Arcane Armor lacks this requirement for you.\n\nQuick Don and Doff. You can don or doff the armor as a Utilize action. The armor can’t be removed ...",
      },
    ],
    description:
      "As a Magic action while you have Smith’s Tools in hand, you can turn a suit of armor you are wearing into Arcane Armor. The armor continues to be Arcane Armor until you don another suit of armor or you die.\n\nYou gain the following benefits while w...",
    source: "Eberron: Forge of the Artificer, artificer: Armorer",
  },

  armorModel: {
    id: "embers:artificer:armorer:armor-model",
    name: "Armor Model",
    kind: "class_feature",
    status: "verified",
    classes: ["artificer"],
    subclass: "armorer",
    activationType: "bonus",
    resource: {
      name: "Armor Model",
      resetType: "Short or Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Armor Model",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Armor Model",
        description:
          "You can customize your Arcane Armor. When you do so, choose one of the following armor models: Dreadnaught, Guardian, or Infiltrator. The model you choose gives you special benefits while you wear it.\n\nEach model includes a special weapon. When you attack with that weapon, you can add your Intelligence modifier, instead of your Strength or Dexterity modifier, to the attack and damage rolls.\n\nYou can change the armor’s model whenever you finish a Short or Long Rest if you have Smith’s Tools in...",
      },
    ],
    description:
      "You can customize your Arcane Armor. When you do so, choose one of the following armor models: Dreadnaught, Guardian, or Infiltrator. The model you choose gives you special benefits while you wear it.\n\nEach model includes a special weapon. When yo...",
    source: "Eberron: Forge of the Artificer, artificer: Armorer",
  },

  extraAttack: {
    id: "embers:artificer:armorer:extra-attack",
    name: "Extra Attack",
    kind: "class_feature",
    status: "verified",
    classes: ["artificer"],
    subclass: "armorer",
    activationType: "action",
    operations: [
      {
        type: "apply_effect",
        name: "Extra Attack",
        description:
          "You can attack twice instead of once whenever you take the Attack action on your turn.",
      },
    ],
    description:
      "You can attack twice instead of once whenever you take the Attack action on your turn.",
    source: "Eberron: Forge of the Artificer, artificer: Armorer",
  },

  improvedArmorer: {
    id: "embers:artificer:armorer:improved-armorer",
    name: "Improved Armorer",
    kind: "class_feature",
    status: "verified",
    classes: ["artificer"],
    subclass: "armorer",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Improved Armorer",
        description:
          "You gain the following benefits.\n\nArmor Replication. You learn an additional plan for your Replicate Magic Item feature, and it must be in the Armor category. If you replace that plan, you must replace it with another Armor plan.\n\nIn addition, you can create an additional item with that feature, and the item must also be in the Armor category.\n\nImproved Arsenal. You gain a +1 bonus to attack and damage rolls made with the special weapon of your Arcane Armor model.",
      },
    ],
    description:
      "You gain the following benefits.\n\nArmor Replication. You learn an additional plan for your Replicate Magic Item feature, and it must be in the Armor category. If you replace that plan, you must replace it with another Armor plan.\n\nIn addition, you...",
    source: "Eberron: Forge of the Artificer, artificer: Armorer",
  },

  perfectedArmor: {
    id: "embers:artificer:armorer:perfected-armor",
    name: "Perfected Armor",
    kind: "class_feature",
    status: "verified",
    classes: ["artificer"],
    subclass: "armorer",
    activationType: "bonus",
    resource: {
      name: "Perfected Armor",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Perfected Armor",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Perfected Armor",
        description:
          "Your Arcane Armor gains additional benefits based on its model, as detailed below.\n\nDreadnaught. The damage die of your Force Demolisher increases to 2d6 Force damage.\n\nIn addition, when you use your Giant Stature, your reach increases by 10 feet, your size can increase to Large or Huge (your choice), and you have Advantage on Strength checks and Strength saving throws for the duration.\n\nGuardian. The damage die of your Thunder Pulse increases to 1d10 Thunder damage.\n\nIn addition, when a Huge...",
      },
    ],
    description:
      "Your Arcane Armor gains additional benefits based on its model, as detailed below.\n\nDreadnaught. The damage die of your Force Demolisher increases to 2d6 Force damage.\n\nIn addition, when you use your Giant Stature, your reach increases by 10 feet,...",
    source: "Eberron: Forge of the Artificer, artificer: Armorer",
  },
};
