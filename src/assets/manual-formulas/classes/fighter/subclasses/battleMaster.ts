import type {
  ManualActionFormula,
  FeatureActionOption,
} from "../../../../../types/manualFormula";

export const MANEUVER_OPTIONS: FeatureActionOption[] = [
  {
    id: "trip",
    name: "Trip Attack",
    cost: 1,
    desc: "Add Superiority Die to damage; target STR Save or Prone",
    actionType: "none",
  },
  {
    id: "menacing",
    name: "Menacing Attack",
    cost: 1,
    desc: "Add Superiority Die to damage; target WIS Save or Frightened",
    actionType: "none",
  },
  {
    id: "precision",
    name: "Precision Attack",
    cost: 1,
    desc: "Add Superiority Die to attack roll",
    actionType: "none",
  },
  {
    id: "riposte",
    name: "Riposte",
    cost: 1,
    desc: "Reaction when creature misses you: attack + Superiority Die",
    actionType: "reaction",
  },
  {
    id: "pushing",
    name: "Pushing Attack",
    cost: 1,
    desc: "Add Superiority Die to damage; target STR Save or pushed 15 ft",
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
    resource: {
      name: "Superiority Dice",
      resetType: "Short or Long Rest",
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
};
