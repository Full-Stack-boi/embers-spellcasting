import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const WARRIOR_OF_THE_MYSTIC_ARTS_FORMULAS: Record<
  string,
  ManualActionFormula
> = {
  spellcasting: {
    id: "embers:monk:warrior-of-the-mystic-arts:spellcasting",
    name: "Spellcasting",
    kind: "class_feature",
    status: "verified",
    classes: ["monk"],
    subclass: "warriorOfTheMysticArts",
    activationType: "special",
    resource: {
      name: "Spellcasting",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Spellcasting",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Spellcasting",
        description:
          "You have learned to cast spells. See the Player’s Handbook for the rules on spellcasting. The information below details how you use those rules as a Warrior of the Mystic Arts.\n\nCantrips. You know two cantrips of your choice from the Sorcerer spell list. Blade Ward and Thunderclap are recommended. Whenever you gain a Monk level, you can replace one of these cantrips with another cantrip of your choice from the Sorcerer spell list.\n\nWhen you reach Monk level 10, you learn another Sorcerer cant...",
      },
    ],
    description:
      "You have learned to cast spells. See the Player’s Handbook for the rules on spellcasting. The information below details how you use those rules as a Warrior of the Mystic Arts.\n\nCantrips. You know two cantrips of your choice from the Sorcerer spel...",
    source: "Arcana Unleashed, Monk: Warrior of the Mystic Arts",
  },

  mysticFightingStyle: {
    id: "embers:monk:warrior-of-the-mystic-arts:mystic-fighting-style",
    name: "Mystic Fighting Style",
    kind: "class_feature",
    status: "verified",
    classes: ["monk"],
    subclass: "warriorOfTheMysticArts",
    activationType: "action",
    operations: [
      {
        type: "apply_effect",
        name: "Mystic Fighting Style",
        description:
          "When you take the Attack action on your turn, you can replace one Unarmed Strike with a casting of one of your Sorcerer cantrips that has a casting time of an action.",
      },
    ],
    description:
      "When you take the Attack action on your turn, you can replace one Unarmed Strike with a casting of one of your Sorcerer cantrips that has a casting time of an action.",
    source: "Arcana Unleashed, Monk: Warrior of the Mystic Arts",
  },

  mysticFocus: {
    id: "embers:monk:warrior-of-the-mystic-arts:mystic-focus",
    name: "Mystic Focus",
    kind: "class_feature",
    status: "verified",
    classes: ["monk"],
    subclass: "warriorOfTheMysticArts",
    activationType: "special",
    resource: {
      name: "Mystic Focus",
      resetType: "Short or Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Mystic Focus",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Mystic Focus",
        description:
          "You keep your magical power and martial focus in perfect balance, allowing you to convert spell slots into Focus Points, or convert Focus Points into spell slots.\n\nConverting Spell Slots to Focus Points. You can expend a spell slot to regain a number of expended Focus Points equal to the slot’s level (no action required).\n\nRecovering Spell Slots. When you finish a Short Rest or use Uncanny Metabolism, you can transform unexpended Focus Points to recover one expended spell slot. The Recovering...",
      },
    ],
    description:
      "You keep your magical power and martial focus in perfect balance, allowing you to convert spell slots into Focus Points, or convert Focus Points into spell slots.\n\nConverting Spell Slots to Focus Points. You can expend a spell slot to regain a num...",
    source: "Arcana Unleashed, Monk: Warrior of the Mystic Arts",
  },

  focusedStrike: {
    id: "embers:monk:warrior-of-the-mystic-arts:focused-strike",
    name: "Focused Strike",
    kind: "class_feature",
    status: "verified",
    classes: ["monk"],
    subclass: "warriorOfTheMysticArts",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Focused Strike",
        description:
          "When you use your Stunning Strike, whether the target succeeds or fails on the saving throw, the target has Disadvantage on saving throws against your spells until the start of your next turn.",
      },
    ],
    description:
      "When you use your Stunning Strike, whether the target succeeds or fails on the saving throw, the target has Disadvantage on saving throws against your spells until the start of your next turn.",
    source: "Arcana Unleashed, Monk: Warrior of the Mystic Arts",
  },

  improvedMysticFightingStyle: {
    id: "embers:monk:warrior-of-the-mystic-arts:improved-mystic-fighting-style",
    name: "Improved Mystic Fighting Style",
    kind: "class_feature",
    status: "verified",
    classes: ["monk"],
    subclass: "warriorOfTheMysticArts",
    activationType: "bonus",
    operations: [
      {
        type: "apply_effect",
        name: "Improved Mystic Fighting Style",
        description:
          "When you use Flurry of Blows, you can replace two of the Unarmed Strikes with a casting of one of your level 1 or 2 Sorcerer spells that has a casting time of an action, and you cast it as part of the same Bonus Action you use to activate Flurry of Blows.",
      },
    ],
    description:
      "When you use Flurry of Blows, you can replace two of the Unarmed Strikes with a casting of one of your level 1 or 2 Sorcerer spells that has a casting time of an action, and you cast it as part of the same Bonus Action you use to activate Flurry o...",
    source: "Arcana Unleashed, Monk: Warrior of the Mystic Arts",
  },
};
