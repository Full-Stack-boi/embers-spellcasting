import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const WARRIOR_OF_PRIDE_FORMULAS: Record<string, ManualActionFormula> = {
  tallTales: {
    id: "embers:monk:warrior-of-pride:tall-tales",
    name: "Tall Tales",
    kind: "class_feature",
    status: "verified",
    classes: ["monk"],
    subclass: "warriorOfPride",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Tall Tales",
        description:
          "You have gained a knack for telling embellished tales of your past achievements. You gain proficiency in one of the following skills of your choice: Deception, Intimidation, Performance, or Persuasion.",
      },
    ],
    description:
      "You have gained a knack for telling embellished tales of your past achievements. You gain proficiency in one of the following skills of your choice: Deception, Intimidation, Performance, or Persuasion.",
    source: "Grim Hollow: Player’s Guide, Monk: Warrior of Pride",
  },

  bruisedEgo: {
    id: "embers:monk:warrior-of-pride:bruised-ego",
    name: "Bruised Ego",
    kind: "class_feature",
    status: "verified",
    classes: ["monk"],
    subclass: "warriorOfPride",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Bruised Ego",
        description:
          "Your ego strengthens you as you fight to prove your value. When you expend a Focus Point, you can also gain Temporary Hit Points equal to your Wisdom modifier (minimum of 1 Temporary Hit Point). While you are Bloodied, you gain twice that amount instead.",
      },
    ],
    description:
      "Your ego strengthens you as you fight to prove your value. When you expend a Focus Point, you can also gain Temporary Hit Points equal to your Wisdom modifier (minimum of 1 Temporary Hit Point). While you are Bloodied, you gain twice that amount i...",
    source: "Grim Hollow: Player’s Guide, Monk: Warrior of Pride",
  },

  assertiveAttacker: {
    id: "embers:monk:warrior-of-pride:assertive-attacker",
    name: "Assertive Attacker",
    kind: "class_feature",
    status: "verified",
    classes: ["monk"],
    subclass: "warriorOfPride",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Assertive Attacker",
        description:
          "While you are Bloodied, you add your Wisdom modifier to the damage you deal with Unarmed Strikes and Monk weapons.",
      },
    ],
    description:
      "While you are Bloodied, you add your Wisdom modifier to the damage you deal with Unarmed Strikes and Monk weapons.",
    source: "Grim Hollow: Player’s Guide, Monk: Warrior of Pride",
  },

  irrationalRetaliation: {
    id: "embers:monk:warrior-of-pride:irrational-retaliation",
    name: "Irrational Retaliation",
    kind: "class_feature",
    status: "verified",
    classes: ["monk"],
    subclass: "warriorOfPride",
    activationType: "reaction",
    operations: [
      {
        type: "apply_effect",
        name: "Irrational Retaliation",
        description:
          "Damage dealt to you is damage dealt to your pride, and that is something you simply can’t allow. Whenever a creature deals damage to you, you can take a Reaction and expend 1 Focus Point. You have Advantage on attack rolls against that creature until the end of your next turn.",
      },
    ],
    description:
      "Damage dealt to you is damage dealt to your pride, and that is something you simply can’t allow. Whenever a creature deals damage to you, you can take a Reaction and expend 1 Focus Point. You have Advantage on attack rolls against that creature un...",
    source: "Grim Hollow: Player’s Guide, Monk: Warrior of Pride",
  },

  redoubledEfforts: {
    id: "embers:monk:warrior-of-pride:redoubled-efforts",
    name: "Redoubled Efforts",
    kind: "class_feature",
    status: "verified",
    classes: ["monk"],
    subclass: "warriorOfPride",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Redoubled Efforts",
        description:
          "When you score a Critical Hit while you are Bloodied, you can roll one additional damage die when determining the extra damage dealt by the attack.",
      },
    ],
    description:
      "When you score a Critical Hit while you are Bloodied, you can roll one additional damage die when determining the extra damage dealt by the attack.",
    source: "Grim Hollow: Player’s Guide, Monk: Warrior of Pride",
  },

  everPrideful: {
    id: "embers:monk:warrior-of-pride:ever-prideful",
    name: "Ever Prideful",
    kind: "class_feature",
    status: "verified",
    classes: ["monk"],
    subclass: "warriorOfPride",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Ever Prideful",
        description:
          "When you are reduced to 0 Hit Points and not killed outright, you can expend 1 Focus Point to enter a trance.\n\nWhile in this trance, you have the following effects:\n\nYou are immune to the Unconscious condition.\nYou can’t speak.\nYou can’t cast or concentrate on spells.\nYou suffer 1 Death Saving Throw failure from damage from a Critical Hit instead of 2.\n\nWhenever you start your turn with 0 Hit Point, you must expend 1 Focus Point to maintain a trance, and you make Death Saving Throws as normal.",
      },
    ],
    description:
      "When you are reduced to 0 Hit Points and not killed outright, you can expend 1 Focus Point to enter a trance.\n\nWhile in this trance, you have the following effects:\n\nYou are immune to the Unconscious condition.\nYou can’t speak.\nYou can’t cast or c...",
    source: "Grim Hollow: Player’s Guide, Monk: Warrior of Pride",
  },

  egotistical: {
    id: "embers:monk:warrior-of-pride:egotistical",
    name: "Egotistical",
    kind: "class_feature",
    status: "verified",
    classes: ["monk"],
    subclass: "warriorOfPride",
    activationType: "special",
    resource: {
      name: "Egotistical",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Egotistical",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Egotistical",
        description:
          "Injuries to your pride enrage you. You are considered Bloodied if your current Hit Points are below your Hit Point maximum.",
      },
    ],
    description:
      "Injuries to your pride enrage you. You are considered Bloodied if your current Hit Points are below your Hit Point maximum.",
    source: "Grim Hollow: Player’s Guide, Monk: Warrior of Pride",
  },
};
