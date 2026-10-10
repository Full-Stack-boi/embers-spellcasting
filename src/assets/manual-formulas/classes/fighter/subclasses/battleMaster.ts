import type {
  ManualActionFormula,
  FeatureActionOption,
} from "../../../../../types/manualFormula";

export const MANEUVER_OPTIONS: FeatureActionOption[] = [
  {
    id: "commanders_strike",
    name: "Commander's Strike",
    cost: 1,
    desc: "Forgo one attack + bonus action to direct ally reaction attack (+die)",
    actionType: "bonus",
  },
  {
    id: "disarming",
    name: "Disarming Attack",
    cost: 1,
    desc: "On hit: +die damage and force STR save or drop item",
    actionType: "none",
  },
  {
    id: "distracting",
    name: "Distracting Strike",
    cost: 1,
    desc: "On hit: +die damage and next ally attack has advantage",
    actionType: "none",
  },
  {
    id: "evasive",
    name: "Evasive Footwork",
    cost: 1,
    desc: "When moving: +die to AC until you stop moving",
    actionType: "none",
  },
  {
    id: "feinting",
    name: "Feinting Attack",
    cost: 1,
    desc: "Bonus Action: advantage on next attack roll (+die damage on hit)",
    actionType: "bonus",
  },
  {
    id: "goading",
    name: "Goading Attack",
    cost: 1,
    desc: "On hit: +die damage and target has disadvantage vs others",
    actionType: "none",
  },
  {
    id: "lunging",
    name: "Lunging Attack",
    cost: 1,
    desc: "Dash as bonus action or +5ft reach (+die damage on hit)",
    actionType: "none",
  },
  {
    id: "maneuvering",
    name: "Maneuvering Attack",
    cost: 1,
    desc: "On hit: +die damage and ally can move half speed without opportunity attacks",
    actionType: "none",
  },
  {
    id: "menacing",
    name: "Menacing Attack",
    cost: 1,
    desc: "On hit: +die damage and force WIS save or Frightened until end of next turn",
    actionType: "none",
  },
  {
    id: "parry",
    name: "Parry",
    cost: 1,
    desc: "Reaction: reduce incoming melee damage by die + DEX mod",
    actionType: "reaction",
  },
  {
    id: "precision",
    name: "Precision Attack",
    cost: 1,
    desc: "Add superiority die to weapon attack roll",
    actionType: "none",
  },
  {
    id: "pushing",
    name: "Pushing Attack",
    cost: 1,
    desc: "On hit: +die damage and force STR save or push up to 15 ft",
    actionType: "none",
  },
  {
    id: "rally",
    name: "Rally",
    cost: 1,
    desc: "Bonus Action: grant ally Temporary HP equal to die + CHA mod",
    actionType: "bonus",
  },
  {
    id: "riposte",
    name: "Riposte",
    cost: 1,
    desc: "Reaction when enemy misses you with melee attack: make melee attack (+die damage)",
    actionType: "reaction",
  },
  {
    id: "sweeping",
    name: "Sweeping Attack",
    cost: 1,
    desc: "On hit: deal superiority die damage to adjacent creature",
    actionType: "none",
  },
  {
    id: "tactical_assessment",
    name: "Tactical Assessment",
    cost: 1,
    desc: "Add superiority die to Investigation, History, or Insight check",
    actionType: "none",
  },
  {
    id: "trip",
    name: "Trip Attack",
    cost: 1,
    desc: "On hit: +die damage and force STR save or knock Large/smaller Prone",
    actionType: "none",
  },
];

export const BATTLE_MASTER_FORMULAS: Record<string, ManualActionFormula> = {
  combatSuperiority: {
    id: "embers:fighter:battle-master:combat-superiority",
    name: "Combat Superiority: Maneuvers",
    kind: "class_feature",
    status: "verified",
    classes: ["fighter"],
    subclass: "battleMaster",
    activationType: "special" as const,
    flyoutType: "options_grid",
    options: MANEUVER_OPTIONS,
    resource: {
      name: "Superiority Dice",
      resetType: "Short or Long Rest",
      scaling: {
        type: "level_table",
        classId: "fighter",
        table: [
          { minLevel: 3, value: 4 },
          { minLevel: 7, value: 5 },
          { minLevel: 15, value: 6 },
        ],
      },
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Superiority Dice",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Maneuver Effect",
        description:
          "Expend 1 Superiority Die to enhance an attack roll, damage, or defensive reaction.",
      },
    ],
    description:
      "Maneuvers are special combat techniques fueled by Superiority Dice.",
    source: "Player's Handbook (2024), Fighter: Battle Master",
    notes: "You can use only one Maneuver per attack unless noted otherwise.",
  },
  knowYourEnemy: {
    id: "embers:fighter:battle-master:know-your-enemy",
    name: "Know Your Enemy",
    kind: "class_feature",
    status: "verified",
    classes: ["fighter"],
    subclass: "battleMaster",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Tactical Assessment",
        description:
          "Bonus Action or action: discern creature AC, damage immunities, resistances, and vulnerabilities.",
      },
    ],
    description: "Discern the combat capabilities and weaknesses of an opponent.",
    source: "Player's Handbook (2024), Fighter: Battle Master",
  },
  relentless: {
    id: "embers:fighter:battle-master:relentless",
    name: "Relentless",
    kind: "class_feature",
    status: "verified",
    classes: ["fighter"],
    subclass: "battleMaster",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Relentless Superiority",
        description:
          "When you roll Initiative and have no Superiority Dice remaining, you regain 1 Superiority Die.",
      },
    ],
    description: "Regain 1 Superiority Die upon rolling Initiative if you have none left.",
    source: "Player's Handbook (2024), Fighter: Battle Master",
  },
};
