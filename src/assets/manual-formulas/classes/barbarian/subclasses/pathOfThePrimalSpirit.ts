import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const PATH_OF_THE_PRIMAL_SPIRIT_FORMULAS: Record<
  string,
  ManualActionFormula
> = {
  primalCompanion: {
    id: "embers:barbarian:path-of-the-primal-spirit:primal-companion",
    name: "Primal Companion",
    kind: "class_feature",
    status: "verified",
    classes: ["barbarian"],
    subclass: "pathOfThePrimalSpirit",
    activationType: "bonus",
    resource: {
      name: "Primal Companion",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Primal Companion",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Primal Companion",
        description:
          "You magically summon a primal spirit that adopts the form of a beast and accompanies you on your adventures. Choose its stat block: Primal Guardian or Primal Striker. In addition, choose an environment that will modify the creature’s stat block: Land, Sea, or Sky. You also determine the kind of animal it is, choosing a kind appropriate for the stat block. Whatever companion you choose, it bears eldritch markings indicating its otherworldly origin.\n\nThe companion is Friendly to you and your al...",
      },
    ],
    description:
      "You magically summon a primal spirit that adopts the form of a beast and accompanies you on your adventures. Choose its stat block: Primal Guardian or Primal Striker. In addition, choose an environment that will modify the creature’s stat block: L...",
    source: "Grim Hollow: Player’s Guide, Barbarian: Path of the Primal Spirit",
  },

  sharedRage: {
    id: "embers:barbarian:path-of-the-primal-spirit:shared-rage",
    name: "Shared Rage",
    kind: "class_feature",
    status: "verified",
    classes: ["barbarian"],
    subclass: "pathOfThePrimalSpirit",
    activationType: "special",
    resource: {
      name: "Shared Rage",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Shared Rage",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Shared Rage",
        description:
          "While your Rage is active, your primal companion has Resistance to Bludgeoning, Piercing, and Slashing damage.",
      },
    ],
    description:
      "While your Rage is active, your primal companion has Resistance to Bludgeoning, Piercing, and Slashing damage.",
    source: "Grim Hollow: Player’s Guide, Barbarian: Path of the Primal Spirit",
  },

  kinToBeasts: {
    id: "embers:barbarian:path-of-the-primal-spirit:kin-to-beasts",
    name: "Kin to Beasts",
    kind: "class_feature",
    status: "verified",
    classes: ["barbarian"],
    subclass: "pathOfThePrimalSpirit",
    activationType: "special",
    resource: {
      name: "Kin to Beasts",
      resetType: "Short or Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Kin to Beasts",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Kin to Beasts",
        description:
          "You always have the Animal Friendship and Speak with Animals spells prepared. You can cast each of these spells without expending a spell slot. Once you cast either spell in this way, you can’t cast that spell in this way again until you finish a Short or Long Rest. You can also cast these spells using spell slots you have of the appropriate level. Constitution is your spellcasting ability for them.",
      },
    ],
    description:
      "You always have the Animal Friendship and Speak with Animals spells prepared. You can cast each of these spells without expending a spell slot. Once you cast either spell in this way, you can’t cast that spell in this way again until you finish a ...",
    source: "Grim Hollow: Player’s Guide, Barbarian: Path of the Primal Spirit",
  },

  skinriderSTrance: {
    id: "embers:barbarian:path-of-the-primal-spirit:skinrider-s-trance",
    name: "Skinrider’s Trance",
    kind: "class_feature",
    status: "verified",
    classes: ["barbarian"],
    subclass: "pathOfThePrimalSpirit",
    activationType: "action",
    resource: {
      name: "Skinrider’s Trance",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Skinrider’s Trance",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Skinrider’s Trance",
        description:
          "You take a Magic action to enter a trance and choose your primal companion or one Beast currently under the effect of your Animal Friendship spell within 60 feet of yourself. For the duration of this trance, you possess the chosen creature.\n\nOnce you possess a creature’s body, you control it. Your Hit Points, Hit Point Dice, Strength, Dexterity, Constitution, Speed, and senses are replaced by the creature’s. You otherwise keep your game statistics. This possession ends if you choose to exit t...",
      },
    ],
    description:
      "You take a Magic action to enter a trance and choose your primal companion or one Beast currently under the effect of your Animal Friendship spell within 60 feet of yourself. For the duration of this trance, you possess the chosen creature.\n\nOnce ...",
    source: "Grim Hollow: Player’s Guide, Barbarian: Path of the Primal Spirit",
  },

  shapeOfTheWild: {
    id: "embers:barbarian:path-of-the-primal-spirit:shape-of-the-wild",
    name: "Shape of the Wild",
    kind: "class_feature",
    status: "verified",
    classes: ["barbarian"],
    subclass: "pathOfThePrimalSpirit",
    activationType: "bonus",
    resource: {
      name: "Shape of the Wild",
      resetType: "Short or Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Shape of the Wild",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Shape of the Wild",
        description:
          "As a Bonus Action, you can choose a new form for your primal companion, causing it to transform instantaneously. When you cause your primal companion to transform in this way, its current Hit Points change to its new Hit Point maximum.\n\nOnce you use this feature, you can’t use it again until you finish a Short or Long Rest. You can also restore your use of it by expending one use of your Rage (no action required).",
      },
    ],
    description:
      "As a Bonus Action, you can choose a new form for your primal companion, causing it to transform instantaneously. When you cause your primal companion to transform in this way, its current Hit Points change to its new Hit Point maximum.\n\nOnce you u...",
    source: "Grim Hollow: Player’s Guide, Barbarian: Path of the Primal Spirit",
  },

  primalGuardian: {
    id: "embers:barbarian:path-of-the-primal-spirit:primal-guardian",
    name: "PRIMAL GUARDIAN",
    kind: "class_feature",
    status: "verified",
    classes: ["barbarian"],
    subclass: "pathOfThePrimalSpirit",
    activationType: "special",
    resource: {
      name: "PRIMAL GUARDIAN",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "PRIMAL GUARDIAN",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "PRIMAL GUARDIAN",
        description:
          "Medium (Large if Land or Sea) Beast, Neutral\n\nAC 12 plus your Constitution modifier\n\nHP 6 plus six times your Barbarian level (the beast has Hit Dice [d10s] equal to your Barbarian level)\n\nSpeed 30 ft.; Fly 40 ft. (Sky only); Swim 40 ft. (Sea only)\n\nABILITY\tSCORE\tMOD\tSAVE\nSTR\t15\t+2\t+2\nDEX\t12\t+1\t+1\nCON\t16\t+3\t+3\n\nABILITY\tSCORE\tMOD\tSAVE\nINT\t4\t-3\t-3\nWIS\t12\t+1\t+1\nCHA\t6\t-2\t-2\n\nSenses Darkvision 60 ft., Passive Perception 11\n\nLanguages Understands the languages you know\n\nCR None (XP 0; PB equals you...",
      },
    ],
    description:
      "Medium (Large if Land or Sea) Beast, Neutral\n\nAC 12 plus your Constitution modifier\n\nHP 6 plus six times your Barbarian level (the beast has Hit Dice [d10s] equal to your Barbarian level)\n\nSpeed 30 ft.; Fly 40 ft. (Sky only); Swim 40 ft. (Sea only...",
    source: "Grim Hollow: Player’s Guide, Barbarian: Path of the Primal Spirit",
  },

  primalStriker: {
    id: "embers:barbarian:path-of-the-primal-spirit:primal-striker",
    name: "PRIMAL STRIKER",
    kind: "class_feature",
    status: "verified",
    classes: ["barbarian"],
    subclass: "pathOfThePrimalSpirit",
    activationType: "special",
    resource: {
      name: "PRIMAL STRIKER",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "PRIMAL STRIKER",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "PRIMAL STRIKER",
        description:
          "Medium Beast, Neutral\n\nAC 12 plus your Constitution modifier\n\nHP 5 plus four times your Barbarian level (the beast has Hit Dice [d6s] equal to your Barbarian level)\n\nSpeed 40 ft.; Fly 60 ft. (Sky only); Swim 60 ft. (Sea only)\n\nABILITY\tSCORE\tMOD\tSAVE\nSTR\t15\t+2\t+2\nDEX\t15\t+2\t+2\nCON\t15\t+2\t+2\n\nABILITY\tSCORE\tMOD\tSAVE\nINT\t4\t-3\t-3\nWIS\t12\t+1\t+1\nCHA\t7\t-2\t-2\n\nSenses Darkvision 60 ft., Passive Perception 11\n\nLanguages Understands the languages you know\n\nCR None (XP 0; PB equals your Proficiency Bonus)\n\nT...",
      },
    ],
    description:
      "Medium Beast, Neutral\n\nAC 12 plus your Constitution modifier\n\nHP 5 plus four times your Barbarian level (the beast has Hit Dice [d6s] equal to your Barbarian level)\n\nSpeed 40 ft.; Fly 60 ft. (Sky only); Swim 60 ft. (Sea only)\n\nABILITY\tSCORE\tMOD\tSA...",
    source: "Grim Hollow: Player’s Guide, Barbarian: Path of the Primal Spirit",
  },
};
