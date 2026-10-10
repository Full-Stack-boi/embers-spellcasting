import type {
  ManualActionFormula,
  FeatureActionOption,
} from "../../../../types/manualFormula";
import { ARCANE_TRICKSTER_FORMULAS } from "./subclasses/arcaneTrickster";
import { ASSASSIN_FORMULAS } from "./subclasses/assassin";
import { HIGHWAY_RIDER_FORMULAS } from "./subclasses/highwayRider";
import { MISFORTUNE_BRINGER_FORMULAS } from "./subclasses/misfortuneBringer";
import { SANGUINE_THIEF_FORMULAS } from "./subclasses/sanguineThief";
import { SCION_OF_THE_THREE_FORMULAS } from "./subclasses/scionOfTheThree";
import { SOULKNIFE_FORMULAS } from "./subclasses/soulknife";
import { THIEF_FORMULAS } from "./subclasses/thief";

const CUNNING_STRIKE_OPTIONS: FeatureActionOption[] = [
  {
    id: "poison",
    name: "Poison (1d6)",
    cost: 1,
    desc: "Forego 1d6 Sneak Attack damage: force CON save or Poisoned for 1 minute",
    actionType: "none",
  },
  {
    id: "trip",
    name: "Trip (1d6)",
    cost: 1,
    desc: "Forego 1d6 Sneak Attack damage: force DEX save or Prone (Large or smaller)",
    actionType: "none",
  },
  {
    id: "withdraw",
    name: "Withdraw (1d6)",
    cost: 1,
    desc: "Forego 1d6 Sneak Attack damage: move up to half Speed without provoking Opportunity Attacks",
    actionType: "none",
  },
  {
    id: "daze",
    name: "Daze (2d6)",
    cost: 2,
    desc: "Forego 2d6 Sneak Attack damage: force CON save or target can only move or take an action/bonus action",
    actionType: "none",
  },
  {
    id: "knock_out",
    name: "Knock Out (6d6)",
    cost: 6,
    desc: "Forego 6d6 Sneak Attack damage: force CON save or Unconscious for 1 minute",
    actionType: "none",
  },
  {
    id: "obscure",
    name: "Obscure (3d6)",
    cost: 3,
    desc: "Forego 3d6 Sneak Attack damage: force DEX save or Blinded until end of its next turn",
    actionType: "none",
  },
];

export const ROGUE_CLASS_FORMULAS: Record<string, ManualActionFormula> = {
  sneakAttack: {
    id: "embers:rogue:sneak-attack",
    name: "Sneak Attack",
    kind: "class_feature",
    status: "verified",
    classes: ["rogue"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Precision Sneak Damage",
        description:
          "Once per turn when you hit with Advantage (or with an ally within 5 ft) using a Finesse or Ranged weapon, deal extra Sneak Attack damage (d6s scaling with level).",
      },
    ],
    weaponRider: {
      type: "weapon_damage_rider",
      id: "sneak-attack",
      name: "Sneak Attack",
      classId: "rogue",
      requiresWeaponProperties: ["finesse", "ranged"],
      diceByClassLevel: [
        { minLevel: 1, dice: "1d6" },
        { minLevel: 3, dice: "2d6" },
        { minLevel: 5, dice: "3d6" },
        { minLevel: 7, dice: "4d6" },
        { minLevel: 9, dice: "5d6" },
        { minLevel: 11, dice: "6d6" },
        { minLevel: 13, dice: "7d6" },
        { minLevel: 15, dice: "8d6" },
        { minLevel: 17, dice: "9d6" },
        { minLevel: 19, dice: "10d6" },
      ],
      damageType: "weapon",
      frequency: "first_hit_per_turn",
    },
    description:
      "Exploit an opponent's distraction to deliver a deadly precision strike.",
    source: "Player's Handbook (2024), Rogue: Sneak Attack",
  },
  cunningAction: {
    id: "embers:rogue:cunning-action",
    name: "Cunning Action",
    kind: "class_feature",
    status: "verified",
    classes: ["rogue"],
    activationType: "bonus",
    operations: [
      {
        type: "apply_effect",
        name: "Nimble Maneuver",
        description:
          "Take Dash, Disengage, or Hide action as a Bonus Action on each of your turns.",
      },
    ],
    description:
      "Quick thinking and agility allow you to move and hide with extreme speed.",
    source: "Player's Handbook (2024), Rogue: Cunning Action",
  },
  cunningStrike: {
    id: "embers:rogue:cunning-strike",
    name: "Cunning Strike",
    kind: "class_feature",
    status: "verified",
    classes: ["rogue"],
    activationType: "special",
    flyoutType: "options_grid",
    options: CUNNING_STRIKE_OPTIONS,
    resource: {
      name: "Sneak Attack Dice",
      resetType: "Turn",
      scaling: {
        type: "half_class_level",
        classId: "rogue",
      },
    },
    operations: [
      {
        type: "apply_effect",
        name: "Tactical Sneak Debuff",
        description:
          "Forego Sneak Attack damage dice to apply tactical effects: Poison (1d6, CON save vs Poisoned), Trip (1d6, DEX save vs Prone), Withdraw (1d6, half speed disengage), Daze (2d6), Knock Out (6d6), or Obscure (3d6).",
      },
    ],
    description:
      "Forego raw damage to trip, poison, blind, or knock out foes on sneak attacks.",
    source: "Player's Handbook (2024), Rogue: Cunning Strike",
  },

  steadyAim: {
    id: "embers:rogue:steady-aim",
    name: "Steady Aim",
    kind: "class_feature",
    status: "verified",
    classes: ["rogue"],
    activationType: "bonus",
    operations: [
      {
        type: "apply_effect",
        name: "Sharpshooter Focus",
        description:
          "As a Bonus Action, give yourself Advantage on your next attack roll on the current turn. You can use this only if you haven't moved during this turn, and your speed becomes 0 until the end of the turn.",
      },
    ],
    description:
      "Plant your feet and take careful aim to grant yourself Advantage on your next strike.",
    source: "Player's Handbook (2024), Rogue: Steady Aim",
  },

  uncannyDodge: {
    id: "embers:rogue:uncanny-dodge",
    name: "Uncanny Dodge",
    kind: "class_feature",
    status: "verified",
    classes: ["rogue"],
    activationType: "reaction",
    operations: [
      {
        type: "apply_effect",
        name: "Halve Damage",
        description:
          "Reaction when hit by an attacker you can see: halve the attack's damage against you.",
      },
    ],
    description:
      "Instinctively dodge out of the full force of incoming attacks to halve damage.",
    source: "Player's Handbook (2024), Rogue: Uncanny Dodge",
  },

  evasion: {
    id: "embers:rogue:evasion",
    name: "Evasion",
    kind: "class_feature",
    status: "verified",
    classes: ["rogue"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Agile Slip",
        description:
          "When subjected to an effect that allows a Dexterity saving throw to take only half damage, take no damage on a success and only half damage on a failure.",
      },
    ],
    description:
      "Slip completely out of harm's way when dodging area-of-effect spells and breath weapons.",
    source: "Player's Handbook (2024), Rogue: Evasion",
  },

  reliableTalent: {
    id: "embers:rogue:reliable-talent",
    name: "Reliable Talent",
    kind: "class_feature",
    status: "verified",
    classes: ["rogue"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Masterful Floor",
        description:
          "Whenever you make an ability check using a skill or tool in which you have proficiency, treat a d20 roll of 9 or lower as a 10.",
      },
    ],
    description:
      "Refined expertise guarantees a minimum d20 roll of 10 on all proficient skill and tool checks.",
    source: "Player's Handbook (2024), Rogue: Reliable Talent",
  },

  improvedCunningStrike: {
    id: "embers:rogue:improved-cunning-strike",
    name: "Improved Cunning Strike",
    kind: "class_feature",
    status: "verified",
    classes: ["rogue"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Dual Cunning Effects",
        description:
          "You can apply up to two Cunning Strike effects whenever you deal Sneak Attack damage, paying the die cost for each.",
      },
    ],
    description:
      "Combine two tactical debilitating effects on the same Sneak Attack.",
    source: "Player's Handbook (2024), Rogue: Improved Cunning Strike",
  },

  deviousStrikes: {
    id: "embers:rogue:devious-strikes",
    name: "Devious Strikes",
    kind: "class_feature",
    status: "verified",
    classes: ["rogue"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Advanced Debuffs",
        description:
          "Unlock Daze (2d6, CON save), Knock Out (6d6, CON save vs Unconscious), and Obscure (3d6, DEX save vs Blinded) for Cunning Strike.",
      },
    ],
    description:
      "Add devastating debuffs (Daze, Knock Out, Obscure) to your Cunning Strike arsenal.",
    source: "Player's Handbook (2024), Rogue: Devious Strikes",
  },

  slipperyMind: {
    id: "embers:rogue:slippery-mind",
    name: "Slippery Mind",
    kind: "class_feature",
    status: "verified",
    classes: ["rogue"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Mental Fortitude",
        description:
          "Gain proficiency in Wisdom and Charisma saving throws.",
      },
    ],
    description:
      "Hone mental acuity to gain proficiency in Wisdom and Charisma saving throws.",
    source: "Player's Handbook (2024), Rogue: Slippery Mind",
  },

  elusive: {
    id: "embers:rogue:elusive",
    name: "Elusive",
    kind: "class_feature",
    status: "verified",
    classes: ["rogue"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Unexploitable Stance",
        description:
          "No attack roll can have Advantage against you unless you have the Incapacitated condition.",
      },
    ],
    description:
      "Move with such uncanny unpredictability that no attacker can gain Advantage against you.",
    source: "Player's Handbook (2024), Rogue: Elusive",
  },

  strokeOfLuck: {
    id: "embers:rogue:stroke-of-luck",
    name: "Stroke of Luck",
    kind: "class_feature",
    status: "verified",
    classes: ["rogue"],
    activationType: "special",
    resource: {
      name: "Stroke of Luck",
      resetType: "Short or Long Rest",
    },
    operations: [
      {
        type: "apply_effect",
        name: "Turn to Natural 20",
        description:
          "If you miss with an attack roll or fail an ability check, you can turn the roll into a 20 (resets on Short or Long Rest).",
      },
    ],
    description:
      "Level 20 Capstone: Turn any missed attack or failed ability check into a natural 20.",
    source: "Player's Handbook (2024), Rogue: Stroke of Luck",
  },
  ...ARCANE_TRICKSTER_FORMULAS,
  ...ASSASSIN_FORMULAS,
  ...HIGHWAY_RIDER_FORMULAS,
  ...MISFORTUNE_BRINGER_FORMULAS,
  ...SANGUINE_THIEF_FORMULAS,
  ...SCION_OF_THE_THREE_FORMULAS,
  ...SOULKNIFE_FORMULAS,
  ...THIEF_FORMULAS,
};

export {
  CUNNING_STRIKE_OPTIONS,
  ARCANE_TRICKSTER_FORMULAS,
  ASSASSIN_FORMULAS,
  HIGHWAY_RIDER_FORMULAS,
  MISFORTUNE_BRINGER_FORMULAS,
  SANGUINE_THIEF_FORMULAS,
  SCION_OF_THE_THREE_FORMULAS,
  SOULKNIFE_FORMULAS,
  THIEF_FORMULAS,
};
