import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const WARRIOR_OF_THE_LEADEN_CROWN_FORMULAS: Record<
  string,
  ManualActionFormula
> = {
  subtleHand: {
    id: "embers:monk:warrior-of-the-leaden-crown:subtle-hand",
    name: "Subtle Hand",
    kind: "class_feature",
    status: "verified",
    classes: ["monk"],
    subclass: "warriorOfTheLeadenCrown",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Subtle Hand",
        description:
          "Your martial arts are enhanced by a capacity for telekinetic strikes. During your turn, your reach is 5 feet greater with Unarmed Strikes. In addition, when you hit a creature with an Unarmed Strike as part of the Attack action on your turn, you can choose to have it deal your choice of Psychic damage or its normal damage type.",
      },
    ],
    description:
      "Your martial arts are enhanced by a capacity for telekinetic strikes. During your turn, your reach is 5 feet greater with Unarmed Strikes. In addition, when you hit a creature with an Unarmed Strike as part of the Attack action on your turn, you c...",
    source: "Grim Hollow: Player’s Guide, Monk: Warrior of the Leaden Crown",
  },

  psionicProwess: {
    id: "embers:monk:warrior-of-the-leaden-crown:psionic-prowess",
    name: "Psionic Prowess",
    kind: "class_feature",
    status: "verified",
    classes: ["monk"],
    subclass: "warriorOfTheLeadenCrown",
    activationType: "action",
    operations: [
      {
        type: "apply_effect",
        name: "Psionic Prowess",
        description:
          "Your psychic powers have manifested in the ability to cast certain spells. You know the Mage Hand cantrip. You can cast it without Verbal or Somatic components, and you can make the spectral hand Invisible.\n\nIn addition, you can cast certain spells by expending Focus Points. You can take a Magic action and expend 1 Focus Point to cast Detect Evil and Good or Protection from Evil and Good. You can also take a Magic action and expend 2 Focus Points to cast Hold Person, Levitate, or Shatter. Wis...",
      },
    ],
    description:
      "Your psychic powers have manifested in the ability to cast certain spells. You know the Mage Hand cantrip. You can cast it without Verbal or Somatic components, and you can make the spectral hand Invisible.\n\nIn addition, you can cast certain spell...",
    source: "Grim Hollow: Player’s Guide, Monk: Warrior of the Leaden Crown",
  },

  unsubtleStrike: {
    id: "embers:monk:warrior-of-the-leaden-crown:unsubtle-strike",
    name: "Unsubtle Strike",
    kind: "class_feature",
    status: "verified",
    classes: ["monk"],
    subclass: "warriorOfTheLeadenCrown",
    activationType: "special",
    resource: {
      name: "Unsubtle Strike",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Unsubtle Strike",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Unsubtle Strike",
        description:
          "Once on each of your turns when you hit a creature with your Unarmed Strike or Monk weapon, you can force it to make a Strength saving throw against your Focus Point save DC. On a failed save, you can move the target up to 10 feet toward or away from you.",
      },
    ],
    description:
      "Once on each of your turns when you hit a creature with your Unarmed Strike or Monk weapon, you can force it to make a Strength saving throw against your Focus Point save DC. On a failed save, you can move the target up to 10 feet toward or away f...",
    source: "Grim Hollow: Player’s Guide, Monk: Warrior of the Leaden Crown",
  },

  psychicCrush: {
    id: "embers:monk:warrior-of-the-leaden-crown:psychic-crush",
    name: "Psychic Crush",
    kind: "class_feature",
    status: "verified",
    classes: ["monk"],
    subclass: "warriorOfTheLeadenCrown",
    activationType: "bonus",
    operations: [
      {
        type: "apply_effect",
        name: "Psychic Crush",
        description:
          "Each time you hit a creature with an Unarmed Strike, it gains a Pressure Point. A creature loses all Pressure Points if you cause a different creature to gain a Pressure Point or after 1 minute, whichever comes first. As a Bonus Action, you can expend 1 Focus Point to telekinetically crush a creature with 1 or more of your Pressure Points. The creature loses all Pressure Points and must make a Strength saving throw against your Focus Point save DC. On a failed save, the creature takes 1d8 For...",
      },
    ],
    description:
      "Each time you hit a creature with an Unarmed Strike, it gains a Pressure Point. A creature loses all Pressure Points if you cause a different creature to gain a Pressure Point or after 1 minute, whichever comes first. As a Bonus Action, you can ex...",
    source: "Grim Hollow: Player’s Guide, Monk: Warrior of the Leaden Crown",
  },

  psionicMastery: {
    id: "embers:monk:warrior-of-the-leaden-crown:psionic-mastery",
    name: "Psionic Mastery",
    kind: "class_feature",
    status: "verified",
    classes: ["monk"],
    subclass: "warriorOfTheLeadenCrown",
    activationType: "action",
    operations: [
      {
        type: "apply_effect",
        name: "Psionic Mastery",
        description:
          "After much training, you have mastered the psionic disciplines necessary to defend mortals from planar threats. As a Magic action, you can spend 5 Focus Points to cast Dispel Evil and Good, Hold Monster, Telekinesis, or Wall of Force. Wisdom is your spellcasting ability for these spells, and you can cast them without Material components.",
      },
    ],
    description:
      "After much training, you have mastered the psionic disciplines necessary to defend mortals from planar threats. As a Magic action, you can spend 5 Focus Points to cast Dispel Evil and Good, Hold Monster, Telekinesis, or Wall of Force. Wisdom is yo...",
    source: "Grim Hollow: Player’s Guide, Monk: Warrior of the Leaden Crown",
  },
};
