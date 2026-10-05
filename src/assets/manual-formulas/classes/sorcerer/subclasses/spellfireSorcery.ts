import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const SPELLFIRE_SORCERY_FORMULAS: Record<string, ManualActionFormula> = {
  spellfireBurst: {
    id: "embers:sorcerer:spellfire-sorcery:spellfire-burst",
    name: "Spellfire Burst",
    kind: "class_feature",
    status: "verified",
    classes: ["sorcerer"],
    subclass: "spellfireSorcery",
    activationType: "bonus",
    resource: {
      name: "Spellfire Burst",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Spellfire Burst",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Spellfire Burst",
        description:
          "When you spend at least 1 Sorcery Point as part of a Magic action or a Bonus Action on your turn, you can unleash one of the following magical effects of your choice. You can do so only once per turn.\n\nBolstering Flames. You or one creature you can see within 30 feet of yourself gains Temporary Hit Points equal to 1d4 plus your Charisma modifier.\n\nRadiant Fire. One creature you can see within 30 feet of yourself takes 1d4 Fire or Radiant damage (your choice).",
      },
    ],
    description:
      "When you spend at least 1 Sorcery Point as part of a Magic action or a Bonus Action on your turn, you can unleash one of the following magical effects of your choice. You can do so only once per turn.\n\nBolstering Flames. You or one creature you ca...",
    source: "Forgotten Realms: Heroes of Faerûn, Sorcerer: Spellfire Sorcery",
  },

  spellfireSpells: {
    id: "embers:sorcerer:spellfire-sorcery:spellfire-spells",
    name: "Spellfire Spells",
    kind: "class_feature",
    status: "verified",
    classes: ["sorcerer"],
    subclass: "spellfireSorcery",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Spellfire Spells",
        description:
          "When you reach a Sorcerer level specified in the Spellfire Spells table, you thereafter always have the listed spells prepared.\n\nSpellfire Spells\nSorcerer Level\tSpells\n3\tCure Wounds, Guiding Bolt, Lesser Restoration, Scorching Ray\n5\tAura of Vitality, Dispel Magic\n7\tFire Shield, Wall of Fire\n9\tGreater Restoration, Flame Strike",
      },
    ],
    description:
      "When you reach a Sorcerer level specified in the Spellfire Spells table, you thereafter always have the listed spells prepared.\n\nSpellfire Spells\nSorcerer Level\tSpells\n3\tCure Wounds, Guiding Bolt, Lesser Restoration, Scorching Ray\n5\tAura of Vitali...",
    source: "Forgotten Realms: Heroes of Faerûn, Sorcerer: Spellfire Sorcery",
  },

  absorbSpells: {
    id: "embers:sorcerer:spellfire-sorcery:absorb-spells",
    name: "Absorb Spells",
    kind: "class_feature",
    status: "verified",
    classes: ["sorcerer"],
    subclass: "spellfireSorcery",
    activationType: "special",
    resource: {
      name: "Absorb Spells",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Absorb Spells",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Absorb Spells",
        description:
          "You always have the Counterspell spell prepared.\n\nAdditionally, whenever a target fails the saving throw against a Counterspell you cast, you regain 1d4 Sorcery Points.",
      },
    ],
    description:
      "You always have the Counterspell spell prepared.\n\nAdditionally, whenever a target fails the saving throw against a Counterspell you cast, you regain 1d4 Sorcery Points.",
    source: "Forgotten Realms: Heroes of Faerûn, Sorcerer: Spellfire Sorcery",
  },

  honedSpellfire: {
    id: "embers:sorcerer:spellfire-sorcery:honed-spellfire",
    name: "Honed Spellfire",
    kind: "class_feature",
    status: "verified",
    classes: ["sorcerer"],
    subclass: "spellfireSorcery",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Honed Spellfire",
        description:
          "Your Spellfire Burst improves. You add your Sorcerer level to the Temporary Hit Points gained from Bolstering Flames, and the damage of your Radiant Fire increases to 1d8.",
      },
    ],
    description:
      "Your Spellfire Burst improves. You add your Sorcerer level to the Temporary Hit Points gained from Bolstering Flames, and the damage of your Radiant Fire increases to 1d8.",
    source: "Forgotten Realms: Heroes of Faerûn, Sorcerer: Spellfire Sorcery",
  },

  crownOfSpellfire: {
    id: "embers:sorcerer:spellfire-sorcery:crown-of-spellfire",
    name: "Crown of Spellfire",
    kind: "class_feature",
    status: "verified",
    classes: ["sorcerer"],
    subclass: "spellfireSorcery",
    activationType: "special",
    resource: {
      name: "Crown of Spellfire",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Crown of Spellfire",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Crown of Spellfire",
        description:
          "When you use Innate Sorcery, you can alter it and infuse yourself with the essence of spellfire, gaining the following benefits while this use of Innate Sorcery is active. Once you use this feature to alter Innate Sorcery, you can’t use it again until you finish a Long Rest unless you spend 5 Sorcery Points (no action required) to restore your use of it.\n\nBurning Life Force. Once per turn when you are hit by an attack roll, you can expend a number of Hit Point Dice, up to a maximum equal to y...",
      },
    ],
    description:
      "When you use Innate Sorcery, you can alter it and infuse yourself with the essence of spellfire, gaining the following benefits while this use of Innate Sorcery is active. Once you use this feature to alter Innate Sorcery, you can’t use it again u...",
    source: "Forgotten Realms: Heroes of Faerûn, Sorcerer: Spellfire Sorcery",
  },
};
