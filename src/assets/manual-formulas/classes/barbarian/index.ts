import type { ManualActionFormula } from "../../../../types/manualFormula";
import { PATH_OF_THE_BERSERKER_FORMULAS } from "./subclasses/pathOfTheBerserker";
import { PATH_OF_THE_FRACTURED_FORMULAS } from "./subclasses/pathOfTheFractured";
import { PATH_OF_THE_PRIMAL_SPIRIT_FORMULAS } from "./subclasses/pathOfThePrimalSpirit";
import { PATH_OF_THE_WILD_HEART_FORMULAS } from "./subclasses/pathOfTheWildHeart";
import { PATH_OF_THE_WORLD_TREE_FORMULAS } from "./subclasses/pathOfTheWorldTree";
import { PATH_OF_THE_WRATHFUL_DEAD_FORMULAS } from "./subclasses/pathOfTheWrathfulDead";
import { PATH_OF_THE_ZEALOT_FORMULAS } from "./subclasses/pathOfTheZealot";

export const BARBARIAN_CLASS_FORMULAS: Record<string, ManualActionFormula> = {
  rage: {
    id: "embers:barbarian:rage",
    name: "Rage",
    kind: "class_feature",
    status: "verified",
    classes: ["barbarian"],
    activationType: "bonus",
    resource: {
      name: "Rage",
      resetType: "Long Rest",
      scaling: {
        type: "level_table",
        classId: "barbarian",
        table: [
          { minLevel: 1, value: 2 },
          { minLevel: 3, value: 3 },
          { minLevel: 6, value: 4 },
          { minLevel: 12, value: 5 },
          { minLevel: 17, value: 6 },
          { minLevel: 20, value: 99 },
        ],
      },
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Rage",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Rage Frenzy",
        duration: "10 minutes",
        description:
          "Advantage on Strength checks and saves; bonus damage on Strength-based attacks (+2 to +4); Resistance to Bludgeoning, Piercing, and Slashing damage.",
      },
    ],
    weaponRider: {
      type: "weapon_damage_rider",
      id: "rage-damage",
      name: "Rage Damage Bonus",
      classId: "barbarian",
      requiresBuff: "rage",
      flat: {
        byClassLevel: [
          { minLevel: 1, value: 2 },
          { minLevel: 9, value: 3 },
          { minLevel: 16, value: 4 },
        ],
      },
      frequency: "every_hit",
    },
    description:
      "Enter a primal battle frenzy that enhances your strength, damage, and durability. Regain 1 expended use on Short Rest.",
    source: "Player's Handbook (2024), Barbarian: Rage",
  },

  unarmoredDefense: {
    id: "embers:barbarian:unarmored-defense",
    name: "Unarmored Defense",
    kind: "class_feature",
    status: "verified",
    classes: ["barbarian"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Primal Resilience",
        description:
          "While not wearing armor, your base Armor Class equals 10 + Dexterity modifier + Constitution modifier (Shield allowed).",
      },
    ],
    description:
      "Your innate resilience shields you without the burden of heavy armor.",
    source: "Player's Handbook (2024), Barbarian: Unarmored Defense",
  },

  weaponMastery: {
    id: "embers:barbarian:weapon-mastery",
    name: "Weapon Mastery",
    kind: "class_feature",
    status: "verified",
    classes: ["barbarian"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Mastery Properties",
        description:
          "Use the mastery properties of 2 Melee weapons (increases to 3 at level 4 and 4 at level 10).",
      },
    ],
    description:
      "Channel martial expertise through the masteries of your chosen melee weapons.",
    source: "Player's Handbook (2024), Barbarian: Weapon Mastery",
  },

  dangerSense: {
    id: "embers:barbarian:danger-sense",
    name: "Danger Sense",
    kind: "class_feature",
    status: "verified",
    classes: ["barbarian"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Instinctive Reflexes",
        description:
          "You have Advantage on Dexterity saving throws unless you have the Incapacitated condition.",
      },
    ],
    description:
      "Gain an uncanny sense of when perils loom, granting Advantage on Dexterity saving throws.",
    source: "Player's Handbook (2024), Barbarian: Danger Sense",
  },

  recklessAttack: {
    id: "embers:barbarian:reckless-attack",
    name: "Reckless Attack",
    kind: "class_feature",
    status: "verified",
    classes: ["barbarian"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Reckless Assault",
        description:
          "Gain Advantage on attack rolls using Strength until start of your next turn, but attack rolls against you have Advantage during that time.",
      },
    ],
    description:
      "Throw aside defense to attack with fierce ferocity, gaining Advantage on Strength attacks.",
    source: "Player's Handbook (2024), Barbarian: Reckless Attack",
  },

  primalKnowledge: {
    id: "embers:barbarian:primal-knowledge",
    name: "Primal Knowledge",
    kind: "class_feature",
    status: "verified",
    classes: ["barbarian"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Primal Competence",
        description:
          "While Rage is active, you can make Acrobatics, Intimidation, Perception, Stealth, or Survival checks using Strength.",
      },
    ],
    description:
      "Channel your primal power into sensory sharpness and physical feats while raging.",
    source: "Player's Handbook (2024), Barbarian: Primal Knowledge",
  },

  extraAttack: {
    id: "embers:barbarian:extra-attack",
    name: "Extra Attack",
    kind: "class_feature",
    status: "verified",
    classes: ["barbarian"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Double Strike",
        description:
          "You can attack twice instead of once whenever you take the Attack action on your turn.",
      },
    ],
    description: "Attack twice whenever you take the Attack action on your turn.",
    source: "Player's Handbook (2024), Barbarian: Extra Attack",
  },

  fastMovement: {
    id: "embers:barbarian:fast-movement",
    name: "Fast Movement",
    kind: "class_feature",
    status: "verified",
    classes: ["barbarian"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Fleet Footed",
        description:
          "Your speed increases by 10 feet while you aren't wearing Heavy armor.",
      },
    ],
    description: "Speed increases by 10 feet while not wearing Heavy armor.",
    source: "Player's Handbook (2024), Barbarian: Fast Movement",
  },

  feralInstinct: {
    id: "embers:barbarian:feral-instinct",
    name: "Feral Instinct",
    kind: "class_feature",
    status: "verified",
    classes: ["barbarian"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Honed Senses",
        description: "You have Advantage on Initiative rolls.",
      },
    ],
    description: "Preternatural instincts give you Advantage on Initiative rolls.",
    source: "Player's Handbook (2024), Barbarian: Feral Instinct",
  },

  instinctivePounce: {
    id: "embers:barbarian:instinctive-pounce",
    name: "Instinctive Pounce",
    kind: "class_feature",
    status: "verified",
    classes: ["barbarian"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Sudden Surge",
        description:
          "As part of the Bonus Action you take to enter Rage, you can move up to half your Speed.",
      },
    ],
    description:
      "Close distance instantly when entering Rage by moving up to half your speed.",
    source: "Player's Handbook (2024), Barbarian: Instinctive Pounce",
  },

  brutalStrike: {
    id: "embers:barbarian:brutal-strike",
    name: "Brutal Strike",
    kind: "class_feature",
    status: "verified",
    classes: ["barbarian"],
    activationType: "special",
    flyoutType: "options_grid",
    operations: [
      {
        type: "apply_effect",
        name: "Brutal Impact",
        description:
          "When using Reckless Attack, forego Advantage on one Strength attack to deal extra 1d10 damage (2d10 at level 17) and apply chosen rider effects.",
      },
    ],
    options: [
      {
        id: "forceful-blow",
        name: "Forceful Blow",
        cost: 0,
        desc: "Push target 15 ft away; you can move up to half Speed toward target without provoking opportunity attacks.",
        actionType: "none",
      },
      {
        id: "hamstring-blow",
        name: "Hamstring Blow",
        cost: 0,
        desc: "Reduce target's Speed by 15 ft until start of your next turn.",
        actionType: "none",
      },
      {
        id: "staggering-blow",
        name: "Staggering Blow",
        cost: 0,
        desc: "Target has Disadvantage on its next saving throw and cannot make Opportunity Attacks until start of your next turn.",
        actionType: "none",
      },
      {
        id: "sundering-blow",
        name: "Sundering Blow",
        cost: 0,
        desc: "The next attack roll made by another creature against the target gains a +5 bonus before start of your next turn.",
        actionType: "none",
      },
    ],
    weaponRider: {
      type: "weapon_damage_rider",
      id: "brutal-strike",
      name: "Brutal Strike",
      classId: "barbarian",
      minLevel: 9,
      diceByClassLevel: [
        { minLevel: 9, dice: "1d10" },
        { minLevel: 17, dice: "2d10" },
      ],
      frequency: "first_hit_per_turn",
    },
    description:
      "Forego advantage on a Reckless Attack to shatter foes with staggering force and tactical penalties.",
    source: "Player's Handbook (2024), Barbarian: Brutal Strike",
  },

  relentlessRage: {
    id: "embers:barbarian:relentless-rage",
    name: "Relentless Rage",
    kind: "class_feature",
    status: "verified",
    classes: ["barbarian"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Defy Death",
        description:
          "If dropped to 0 HP while raging, make DC 10 Constitution save to instead drop to HP equal to twice your Barbarian level. DC increases by 5 per use (resets on Short or Long Rest).",
      },
    ],
    description:
      "Keep fighting despite mortal injury by making Constitution saving throws when dropping to 0 HP.",
    source: "Player's Handbook (2024), Barbarian: Relentless Rage",
  },

  persistentRage: {
    id: "embers:barbarian:persistent-rage",
    name: "Persistent Rage",
    kind: "class_feature",
    status: "verified",
    classes: ["barbarian"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Unquenchable Fury",
        description:
          "Regain all expended uses of Rage when rolling Initiative (once per Long Rest). Rage lasts 10 minutes without needing to extend round-to-round.",
      },
    ],
    description:
      "Rage lasts the full 10 minutes and you can instantly regain all uses on Initiative once per Long Rest.",
    source: "Player's Handbook (2024), Barbarian: Persistent Rage",
  },

  indomitableMight: {
    id: "embers:barbarian:indomitable-might",
    name: "Indomitable Might",
    kind: "class_feature",
    status: "verified",
    classes: ["barbarian"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Peerless Might",
        description:
          "If your total for a Strength check or Strength saving throw is less than your Strength score, you can use your Strength score instead.",
      },
    ],
    description:
      "Ensure feats of physical power never fail by setting minimum Strength checks and saves to your Strength score.",
    source: "Player's Handbook (2024), Barbarian: Indomitable Might",
  },

  primalChampion: {
    id: "embers:barbarian:primal-champion",
    name: "Primal Champion",
    kind: "class_feature",
    status: "verified",
    classes: ["barbarian"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Primal Ascendance",
        description:
          "Your Strength and Constitution scores increase by 4, up to a maximum of 25.",
      },
    ],
    description:
      "Embody primal power: Strength and Constitution scores increase by 4, to a maximum of 25.",
    source: "Player's Handbook (2024), Barbarian: Primal Champion",
  },
  ...PATH_OF_THE_BERSERKER_FORMULAS,
  ...PATH_OF_THE_FRACTURED_FORMULAS,
  ...PATH_OF_THE_PRIMAL_SPIRIT_FORMULAS,
  ...PATH_OF_THE_WILD_HEART_FORMULAS,
  ...PATH_OF_THE_WORLD_TREE_FORMULAS,
  ...PATH_OF_THE_WRATHFUL_DEAD_FORMULAS,
  ...PATH_OF_THE_ZEALOT_FORMULAS,
};

export {
  PATH_OF_THE_BERSERKER_FORMULAS,
  PATH_OF_THE_FRACTURED_FORMULAS,
  PATH_OF_THE_PRIMAL_SPIRIT_FORMULAS,
  PATH_OF_THE_WILD_HEART_FORMULAS,
  PATH_OF_THE_WORLD_TREE_FORMULAS,
  PATH_OF_THE_WRATHFUL_DEAD_FORMULAS,
  PATH_OF_THE_ZEALOT_FORMULAS,
};
