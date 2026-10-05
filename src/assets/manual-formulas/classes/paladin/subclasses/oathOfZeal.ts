import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const OATH_OF_ZEAL_FORMULAS: Record<string, ManualActionFormula> = {
  markOfTheHeretic: {
    id: "embers:paladin:oath-of-zeal:mark-of-the-heretic",
    name: "Mark of the Heretic",
    kind: "class_feature",
    status: "verified",
    classes: ["paladin"],
    subclass: "oathOfZeal",
    activationType: "bonus",
    resource: {
      name: "Mark of the Heretic",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Mark of the Heretic",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Mark of the Heretic",
        description:
          "As a Bonus Action, you can expend one use of your Channel Divinity to mark a creature you can see within 30 feet of yourself as a heretic.\n\nFor 1 minute, your weapon attacks and Unarmed Strikes against the chosen creature can score a Critical Hit on a roll of 19 or 20 on the d20. In addition, whenever the target starts its turn, you can take a Reaction to make a melee attack against that creature if it’s within reach.",
      },
    ],
    description:
      "As a Bonus Action, you can expend one use of your Channel Divinity to mark a creature you can see within 30 feet of yourself as a heretic.\n\nFor 1 minute, your weapon attacks and Unarmed Strikes against the chosen creature can score a Critical Hit ...",
    source: "Grim Hollow: Player’s Guide, Paladin: Oath of Zeal",
  },

  oathOfZealSpells: {
    id: "embers:paladin:oath-of-zeal:oath-of-zeal-spells",
    name: "Oath of Zeal Spells",
    kind: "class_feature",
    status: "verified",
    classes: ["paladin"],
    subclass: "oathOfZeal",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Oath of Zeal Spells",
        description:
          "The magic of your oath ensures you always have certain spells ready; when you reach a Paladin level specified in the Oath of Zeal Spells table, you thereafter always have the listed spells prepared.\n\nOath of Zeal Spells\nPaladin Level\tSpells\n3\tDetect Evil and Good, Hunter’s Mark\n5\tDetect Thoughts, Knock\n9\tFear, Tongues\n13\tDivination, Locate Creature\n17\tInsect Plague, Scrying",
      },
    ],
    description:
      "The magic of your oath ensures you always have certain spells ready; when you reach a Paladin level specified in the Oath of Zeal Spells table, you thereafter always have the listed spells prepared.\n\nOath of Zeal Spells\nPaladin Level\tSpells\n3\tDete...",
    source: "Grim Hollow: Player’s Guide, Paladin: Oath of Zeal",
  },

  auraOfClarity: {
    id: "embers:paladin:oath-of-zeal:aura-of-clarity",
    name: "Aura of Clarity",
    kind: "class_feature",
    status: "verified",
    classes: ["paladin"],
    subclass: "oathOfZeal",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Aura of Clarity",
        description:
          "You and your allies have Immunity to the Blinded condition while in your Aura of Protection. If a Blinded ally enters the aura, that condition has no effect on that ally while there. Additionally, you can see Invisible creatures within your Aura of Protection.",
      },
    ],
    description:
      "You and your allies have Immunity to the Blinded condition while in your Aura of Protection. If a Blinded ally enters the aura, that condition has no effect on that ally while there. Additionally, you can see Invisible creatures within your Aura o...",
    source: "Grim Hollow: Player’s Guide, Paladin: Oath of Zeal",
  },

  compelConfession: {
    id: "embers:paladin:oath-of-zeal:compel-confession",
    name: "Compel Confession",
    kind: "class_feature",
    status: "verified",
    classes: ["paladin"],
    subclass: "oathOfZeal",
    activationType: "special",
    resource: {
      name: "Compel Confession",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Compel Confession",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Compel Confession",
        description:
          "You can cast Zone of Truth without expending a spell slot. In addition, a creature that succeeds on its saving throw takes 1d6 Psychic damage at the start of each of its turns while in your Zone of Truth until it chooses to fail its saving throw instead.",
      },
    ],
    description:
      "You can cast Zone of Truth without expending a spell slot. In addition, a creature that succeeds on its saving throw takes 1d6 Psychic damage at the start of each of its turns while in your Zone of Truth until it chooses to fail its saving throw i...",
    source: "Grim Hollow: Player’s Guide, Paladin: Oath of Zeal",
  },

  apocalypticRevelation: {
    id: "embers:paladin:oath-of-zeal:apocalyptic-revelation",
    name: "Apocalyptic Revelation",
    kind: "class_feature",
    status: "verified",
    classes: ["paladin"],
    subclass: "oathOfZeal",
    activationType: "bonus",
    resource: {
      name: "Apocalyptic Revelation",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Apocalyptic Revelation",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Apocalyptic Revelation",
        description:
          "As a Bonus Action, you can reveal the true nature of your enemies for 1 minute. Once you use this feature, you can’t use it again until you finish a Long Rest. You can also restore your use of it by expending a level 5 spell slot (no action required). You gain the following benefits.\n\nBlinding Glory. Enemies that start their turn within 5 feet of you must make a Constitution saving throw against the Paladin's spell save DC. On a failed save, the creature has the Blinded condition until the st...",
      },
    ],
    description:
      "As a Bonus Action, you can reveal the true nature of your enemies for 1 minute. Once you use this feature, you can’t use it again until you finish a Long Rest. You can also restore your use of it by expending a level 5 spell slot (no action requir...",
    source: "Grim Hollow: Player’s Guide, Paladin: Oath of Zeal",
  },
};
