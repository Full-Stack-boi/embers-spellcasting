import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const BULWARK_WARRIOR_FORMULAS: Record<string, ManualActionFormula> = {
  protectiveTaunt: {
    id: "embers:fighter:bulwark-warrior:protective-taunt",
    name: "Protective Taunt",
    kind: "class_feature",
    status: "verified",
    classes: ["fighter"],
    subclass: "bulwarkWarrior",
    activationType: "special",
    resource: {
      name: "Protective Taunt",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Protective Taunt",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Protective Taunt",
        description:
          "Once per turn when you hit a creature with a melee attack using a weapon or Unarmed Strike, you can taunt it. Until the start of your next turn or until you have the Incapacitated condition, the target has Disadvantage on attack rolls against targets other than you. A creature can only be affected by one Taunt at a time.",
      },
    ],
    description:
      "Once per turn when you hit a creature with a melee attack using a weapon or Unarmed Strike, you can taunt it. Until the start of your next turn or until you have the Incapacitated condition, the target has Disadvantage on attack rolls against targ...",
    source: "Grim Hollow: Player’s Guide, Fighter: Bulwark Warrior",
  },

  weatherTheStorm: {
    id: "embers:fighter:bulwark-warrior:weather-the-storm",
    name: "Weather the Storm",
    kind: "class_feature",
    status: "verified",
    classes: ["fighter"],
    subclass: "bulwarkWarrior",
    activationType: "bonus",
    resource: {
      name: "Weather the Storm",
      resetType: "Short or Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Weather the Storm",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Weather the Storm",
        description:
          "You have grown accustomed to being battered and bruised. As a Bonus Action, you toughen up for 1 minute. At the end of each of your turns, you gain Temporary Hit Points equal to your Fighter level plus your Constitution modifier.\n\nOnce you use this feature, you can’t use it again until you finish a Short or Long Rest.",
      },
    ],
    description:
      "You have grown accustomed to being battered and bruised. As a Bonus Action, you toughen up for 1 minute. At the end of each of your turns, you gain Temporary Hit Points equal to your Fighter level plus your Constitution modifier.\n\nOnce you use thi...",
    source: "Grim Hollow: Player’s Guide, Fighter: Bulwark Warrior",
  },

  threateningPresence: {
    id: "embers:fighter:bulwark-warrior:threatening-presence",
    name: "Threatening Presence",
    kind: "class_feature",
    status: "verified",
    classes: ["fighter"],
    subclass: "bulwarkWarrior",
    activationType: "action",
    resource: {
      name: "Threatening Presence",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Threatening Presence",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Threatening Presence",
        description:
          "You can provoke your enemies into single-minded hatred of you. As a Magic action, each creature of your choice that can hear you in a 30-foot Emanation originating from you must make a Wisdom saving throw (DC 8 plus your Constitution modifier and Proficiency Bonus). On a failed save, the creature takes 5d6 Psychic damage and has Disadvantage on attack rolls against targets other than you. When you use this feature, you restore your use of Weather the Storm.\n\nYou can use this feature twice. Yo...",
      },
    ],
    description:
      "You can provoke your enemies into single-minded hatred of you. As a Magic action, each creature of your choice that can hear you in a 30-foot Emanation originating from you must make a Wisdom saving throw (DC 8 plus your Constitution modifier and ...",
    source: "Grim Hollow: Player’s Guide, Fighter: Bulwark Warrior",
  },

  aggressiveDefense: {
    id: "embers:fighter:bulwark-warrior:aggressive-defense",
    name: "Aggressive Defense",
    kind: "class_feature",
    status: "verified",
    classes: ["fighter"],
    subclass: "bulwarkWarrior",
    activationType: "special",
    resource: {
      name: "Aggressive Defense",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Aggressive Defense",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Aggressive Defense",
        description:
          "You know when to switch from defense to offense. Once on each of your turns when you hit a creature with an attack roll using a Melee weapon or Unarmed Strike, you can lose Temporary Hit Points equal to no more than half your Fighter level (round down) to deal extra damage to the target equal to the number of Temporary Hit Points lost in this way.",
      },
    ],
    description:
      "You know when to switch from defense to offense. Once on each of your turns when you hit a creature with an attack roll using a Melee weapon or Unarmed Strike, you can lose Temporary Hit Points equal to no more than half your Fighter level (round ...",
    source: "Grim Hollow: Player’s Guide, Fighter: Bulwark Warrior",
  },

  improvedSecondWind: {
    id: "embers:fighter:bulwark-warrior:improved-second-wind",
    name: "Improved Second Wind",
    kind: "class_feature",
    status: "verified",
    classes: ["fighter"],
    subclass: "bulwarkWarrior",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Improved Second Wind",
        description:
          "Your endurance is unrivaled. When you regain Hit Points from Second Wind, you gain a number of Temporary Hit Points equal to the roll’s total.",
      },
    ],
    description:
      "Your endurance is unrivaled. When you regain Hit Points from Second Wind, you gain a number of Temporary Hit Points equal to the roll’s total.",
    source: "Grim Hollow: Player’s Guide, Fighter: Bulwark Warrior",
  },

  haltTheAssault: {
    id: "embers:fighter:bulwark-warrior:halt-the-assault",
    name: "Halt the Assault",
    kind: "class_feature",
    status: "verified",
    classes: ["fighter"],
    subclass: "bulwarkWarrior",
    activationType: "reaction",
    operations: [
      {
        type: "apply_effect",
        name: "Halt the Assault",
        description:
          "When another creature you can see within 5 feet of you is hit by an attack roll, you can take a Reaction to change the target to yourself. You have Resistance to all damage against that attack.\n\nEvery so often you find one: a soldier ready and willing to put themselves in harm’s way for their comrades.\n\n— General Leonidas Dawnglyph",
      },
    ],
    description:
      "When another creature you can see within 5 feet of you is hit by an attack roll, you can take a Reaction to change the target to yourself. You have Resistance to all damage against that attack.\n\nEvery so often you find one: a soldier ready and wil...",
    source: "Grim Hollow: Player’s Guide, Fighter: Bulwark Warrior",
  },
};
