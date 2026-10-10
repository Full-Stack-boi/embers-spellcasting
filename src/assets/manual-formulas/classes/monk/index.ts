import type {
  ManualActionFormula,
  FeatureActionOption,
} from "../../../../types/manualFormula";
import { WARRIOR_OF_MERCY_FORMULAS } from "./subclasses/warriorOfMercy";
import { WARRIOR_OF_PRIDE_FORMULAS } from "./subclasses/warriorOfPride";
import { WARRIOR_OF_REGRET_FORMULAS } from "./subclasses/warriorOfRegret";
import { WARRIOR_OF_SHADOW_FORMULAS } from "./subclasses/warriorOfShadow";
import { WARRIOR_OF_THE_ELEMENTS_FORMULAS } from "./subclasses/warriorOfTheElements";
import { WARRIOR_OF_THE_LEADEN_CROWN_FORMULAS } from "./subclasses/warriorOfTheLeadenCrown";
import { WARRIOR_OF_THE_MYSTIC_ARTS_FORMULAS } from "./subclasses/warriorOfTheMysticArts";
import { WARRIOR_OF_THE_OPEN_HAND_FORMULAS } from "./subclasses/warriorOfTheOpenHand";

const FOCUS_POINT_OPTIONS: FeatureActionOption[] = [
  {
    id: "flurry",
    name: "Flurry of Blows",
    cost: 1,
    desc: "Bonus Action: make two unarmed strikes",
    actionType: "bonus",
  },
  {
    id: "patient",
    name: "Patient Defense",
    cost: 1,
    desc: "Bonus Action: take Disengage and Dodge actions",
    actionType: "bonus",
  },
  {
    id: "step",
    name: "Step of the Wind",
    cost: 1,
    desc: "Bonus Action: take Disengage and Dash actions, double jump distance",
    actionType: "bonus",
  },
  {
    id: "stun",
    name: "Stunning Strike",
    cost: 1,
    desc: "On hit with melee attack: force CON save or target is Stunned until start of your next turn",
    actionType: "none",
  },
  {
    id: "deflect",
    name: "Deflect Attacks (Redirect)",
    cost: 1,
    desc: "Spend 1 Focus Point after reducing attack damage to 0 to redirect projectile/strike",
    actionType: "reaction",
  },
  {
    id: "metabolism",
    name: "Uncanny Metabolism",
    cost: 0,
    desc: "On rolling Initiative: regain all expended Focus Points and roll Martial Arts die + Monk level HP (1/Long Rest)",
    actionType: "none",
  },
];

export const MONK_CLASS_FORMULAS: Record<string, ManualActionFormula> = {
  focusPoints: {
    id: "embers:monk:focus-points",
    name: "Focus Points",
    kind: "class_feature",
    status: "verified",
    classes: ["monk"],
    activationType: "special",
    flyoutType: "options_grid",
    options: FOCUS_POINT_OPTIONS,
    resource: {
      name: "Focus Points (Ki)",
      resetType: "Short or Long Rest",
      scaling: {
        type: "class_level",
        classId: "monk",
        multiplier: 1,
      },
    },
    operations: [
      {
        type: "apply_effect",
        name: "Monastic Focus",
        description:
          "Spend Focus to fuel Flurry of Blows (Bonus Action two unarmed strikes), Patient Defense (Bonus Action Disengage and Dodge), Step of the Wind (Bonus Action Dash and Disengage), and Stunning Strike.",
      },
    ],
    description:
      "Harness mystical internal focus to fuel superhuman martial arts abilities.",
    source: "Player's Handbook (2024), Monk: Focus Points",
  },
  deflectAttacks: {
    id: "embers:monk:deflect-attacks",
    name: "Deflect Attacks",
    kind: "class_feature",
    status: "verified",
    classes: ["monk"],
    activationType: "reaction",
    operations: [
      {
        type: "apply_effect",
        name: "Deflect and Redirect",
        description:
          "Reaction reduce damage from any attack roll by 1d10 + Dexterity modifier + Monk level. If reduced to 0, spend 1 Focus Point to redirect the strike/projectile at a target within range.",
      },
    ],
    description:
      "Catch, deflect, and turn aside incoming weapon attacks and projectiles.",
    source: "Player's Handbook (2024), Monk: Deflect Attacks",
  },
  uncannyMetabolism: {
    id: "embers:monk:uncanny-metabolism",
    name: "Uncanny Metabolism",
    kind: "class_feature",
    status: "verified",
    classes: ["monk"],
    activationType: "special",
    resource: {
      name: "Uncanny Metabolism",
      resetType: "Long Rest",
      scaling: {
        type: "flat",
        multiplier: 1,
      },
    },
    operations: [
      {
        type: "apply_effect",
        name: "Combat Adrenaline Recovery",
        description:
          "When you roll Initiative, regain all expended Focus Points and roll your Martial Arts die + Monk level, regaining that many Hit Points (1/Long Rest).",
      },
    ],
    description:
      "Instantly refresh your entire focus pool and restore HP at the outbreak of battle.",
    source: "Player's Handbook (2024), Monk: Uncanny Metabolism",
  },

  martialArts: {
    id: "embers:monk:martial-arts",
    name: "Martial Arts",
    kind: "class_feature",
    status: "verified",
    classes: ["monk"],
    activationType: "bonus",
    operations: [
      {
        type: "apply_effect",
        name: "Bonus Unarmed Strike",
        description:
          "Make one Unarmed Strike as a Bonus Action whenever you take the Attack action with an Unarmed Strike or Monk weapon on your turn. Use Dexterity for attack and damage rolls; Martial Arts die scales from 1d6 to 1d12.",
      },
    ],
    description:
      "Master unarmed strikes and agile weapons with scaling martial arts dice and bonus strikes.",
    source: "Player's Handbook (2024), Monk: Martial Arts",
  },

  unarmoredDefense: {
    id: "embers:monk:unarmored-defense",
    name: "Unarmored Defense",
    kind: "class_feature",
    status: "verified",
    classes: ["monk"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Monastic AC",
        description:
          "While not wearing armor or wielding a shield, your base Armor Class equals 10 + Dexterity modifier + Wisdom modifier.",
      },
    ],
    description:
      "Dodge and weave through attacks relying solely on unarmored agility and wisdom.",
    source: "Player's Handbook (2024), Monk: Unarmored Defense",
  },

  unarmoredMovement: {
    id: "embers:monk:unarmored-movement",
    name: "Unarmored Movement",
    kind: "class_feature",
    status: "verified",
    classes: ["monk"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Speed Enhancement",
        description:
          "Speed increases by 10 ft while not wearing armor (+15 at level 6, +20 at level 10, +25 at level 14, +30 at level 18).",
      },
    ],
    description:
      "Supernatural speed and stride when moving without heavy gear.",
    source: "Player's Handbook (2024), Monk: Unarmored Movement",
  },

  slowFall: {
    id: "embers:monk:slow-fall",
    name: "Slow Fall",
    kind: "class_feature",
    status: "verified",
    classes: ["monk"],
    activationType: "reaction",
    operations: [
      {
        type: "apply_effect",
        name: "Feather Fall Kinetic Diffusion",
        description:
          "Reaction when you fall: reduce falling damage by five times your Monk level.",
      },
    ],
    description:
      "Absorb vertical kinetic momentum to glide down sheer drops unharmed.",
    source: "Player's Handbook (2024), Monk: Slow Fall",
  },

  extraAttack: {
    id: "embers:monk:extra-attack",
    name: "Extra Attack",
    kind: "class_feature",
    status: "verified",
    classes: ["monk"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Multiattack Strike",
        description:
          "You can attack twice instead of once whenever you take the Attack action on your turn.",
      },
    ],
    description:
      "Attack twice whenever you take the Attack action on your turn.",
    source: "Player's Handbook (2024), Monk: Extra Attack",
  },

  stunningStrike: {
    id: "embers:monk:stunning-strike",
    name: "Stunning Strike",
    kind: "class_feature",
    status: "verified",
    classes: ["monk"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Ki Disruption",
        description:
          "Once per turn when hitting with a Monk weapon or Unarmed Strike: spend 1 Focus Point to force target to make a Constitution save (DC 8 + DEX mod + PB). On failure, target is Stunned until start of your next turn; on success, its speed is halved.",
      },
    ],
    description:
      "Disrupt enemy ki pathways to leave foes stunned and defenseless.",
    source: "Player's Handbook (2024), Monk: Stunning Strike",
  },

  empoweredStrikes: {
    id: "embers:monk:empowered-strikes",
    name: "Empowered Strikes",
    kind: "class_feature",
    status: "verified",
    classes: ["monk"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Forceful Impacts",
        description:
          "Whenever you deal damage with an Unarmed Strike, it can deal Force damage instead of Bludgeoning damage.",
      },
    ],
    description:
      "Channel internal energy to turn unarmed strikes into lethal force blows.",
    source: "Player's Handbook (2024), Monk: Empowered Strikes",
  },

  evasion: {
    id: "embers:monk:evasion",
    name: "Evasion",
    kind: "class_feature",
    status: "verified",
    classes: ["monk"],
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
      "Dodge completely out of explosive blast radiuses and breath weapons.",
    source: "Player's Handbook (2024), Monk: Evasion",
  },

  heightenedFocus: {
    id: "embers:monk:heightened-focus",
    name: "Heightened Focus",
    kind: "class_feature",
    status: "verified",
    classes: ["monk"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Enhanced Monastic Techniques",
        description:
          "Flurry of Blows grants 3 unarmed strikes instead of 2; Patient Defense grants Temporary HP equal to 2 rolls of Martial Arts die; Step of the Wind allows carrying a willing creature.",
      },
    ],
    description:
      "Elevate all foundational focus abilities to heightened perfection.",
    source: "Player's Handbook (2024), Monk: Heightened Focus",
  },

  selfRestoration: {
    id: "embers:monk:self-restoration",
    name: "Self-Restoration",
    kind: "class_feature",
    status: "verified",
    classes: ["monk"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Purifying Stasis",
        description:
          "At the start of your turn, end the Charmed, Frightened, or Poisoned condition on yourself without spending an action or Focus Points.",
      },
    ],
    description:
      "Instantly shake off charms, fear, and poisons at the start of your turn.",
    source: "Player's Handbook (2024), Monk: Self-Restoration",
  },

  deflectEnergy: {
    id: "embers:monk:deflect-energy",
    name: "Deflect Energy",
    kind: "class_feature",
    status: "verified",
    classes: ["monk"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Universal Deflection",
        description:
          "Deflect Attacks can now mitigate and redirect attacks of any damage type, including spells and magical beams.",
      },
    ],
    description:
      "Deflect any type of damage, catching magical rays and elemental bolts.",
    source: "Player's Handbook (2024), Monk: Deflect Energy",
  },

  disciplinedSurvivor: {
    id: "embers:monk:disciplined-survivor",
    name: "Disciplined Survivor",
    kind: "class_feature",
    status: "verified",
    classes: ["monk"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Mastery of Saves",
        description:
          "Gain proficiency in all saving throws. If you fail a saving throw, you can spend 1 Focus Point to reroll it and must use the new result.",
      },
    ],
    description:
      "Attain proficiency in all saving throws and reroll failed saves for 1 Focus.",
    source: "Player's Handbook (2024), Monk: Disciplined Survivor",
  },

  perfectFocus: {
    id: "embers:monk:perfect-focus",
    name: "Perfect Focus",
    kind: "class_feature",
    status: "verified",
    classes: ["monk"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Focus Floor",
        description:
          "When you roll Initiative, if you have 3 or fewer Focus Points remaining, your pool is immediately restored to 4 Focus Points.",
      },
    ],
    description:
      "Never enter battle depleted: guarantees at least 4 Focus Points on Initiative.",
    source: "Player's Handbook (2024), Monk: Perfect Focus",
  },

  superiorDefense: {
    id: "embers:monk:superior-defense",
    name: "Superior Defense",
    kind: "class_feature",
    status: "verified",
    classes: ["monk"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Impenetrable Stance",
        duration: "1 minute",
        description:
          "At the start of your turn, spend 3 Focus Points to gain Resistance to all damage types except Force for 1 minute or until you have the Incapacitated condition.",
      },
    ],
    description:
      "Surround yourself with an impenetrable ki barrier resisting all damage except Force.",
    source: "Player's Handbook (2024), Monk: Superior Defense",
  },

  bodyAndMind: {
    id: "embers:monk:body-and-mind",
    name: "Body and Mind",
    kind: "class_feature",
    status: "verified",
    classes: ["monk"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Transcendent Apotheosis",
        description:
          "Your Dexterity and Wisdom scores increase by 4, up to a maximum of 25.",
      },
    ],
    description:
      "Level 20 Capstone: Achieve total harmony of body and mind, increasing Dexterity and Wisdom by 4 (max 25).",
    source: "Player's Handbook (2024), Monk: Body and Mind",
  },
  ...WARRIOR_OF_MERCY_FORMULAS,
  ...WARRIOR_OF_PRIDE_FORMULAS,
  ...WARRIOR_OF_REGRET_FORMULAS,
  ...WARRIOR_OF_SHADOW_FORMULAS,
  ...WARRIOR_OF_THE_ELEMENTS_FORMULAS,
  ...WARRIOR_OF_THE_LEADEN_CROWN_FORMULAS,
  ...WARRIOR_OF_THE_MYSTIC_ARTS_FORMULAS,
  ...WARRIOR_OF_THE_OPEN_HAND_FORMULAS,
};

export {
  FOCUS_POINT_OPTIONS,
  WARRIOR_OF_MERCY_FORMULAS,
  WARRIOR_OF_PRIDE_FORMULAS,
  WARRIOR_OF_REGRET_FORMULAS,
  WARRIOR_OF_SHADOW_FORMULAS,
  WARRIOR_OF_THE_ELEMENTS_FORMULAS,
  WARRIOR_OF_THE_LEADEN_CROWN_FORMULAS,
  WARRIOR_OF_THE_MYSTIC_ARTS_FORMULAS,
  WARRIOR_OF_THE_OPEN_HAND_FORMULAS,
};
