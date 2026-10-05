import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const ELDRITCH_KNIGHT_FORMULAS: Record<string, ManualActionFormula> = {
  weaponBond: {
    id: "embers:fighter:eldritch-knight:weapon-bond",
    name: "Weapon Bond",
    kind: "class_feature",
    status: "verified",
    classes: ["fighter"],
    subclass: "eldritchKnight",
    activationType: "bonus",
    operations: [
      {
        type: "apply_effect",
        name: "Bonded Blade",
        description:
          "Bond with up to two weapons; you cannot be disarmed of a bonded weapon, and can summon it to your hand as a Bonus Action from any distance on the same plane.",
      },
    ],
    description:
      "Forge an unbreakable arcane connection with your primary combat weapons.",
    source: "Player's Handbook (2024), Fighter: Eldritch Knight",
  },

  warMagic: {
    id: "embers:fighter:eldritch-knight:war-magic",
    name: "War Magic",
    kind: "class_feature",
    status: "verified",
    classes: ["fighter"],
    subclass: "eldritchKnight",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Cantrip Strike",
        description:
          "When you take the Attack action on your turn, you can replace one of your attacks with casting a Wizard cantrip that has a casting time of 1 action.",
      },
    ],
    description:
      "Intertwine devastating offensive cantrips directly into your multiattack sequence.",
    source: "Player's Handbook (2024), Fighter: Eldritch Knight",
  },

  arcaneCharge: {
    id: "embers:fighter:eldritch-knight:arcane-charge",
    name: "Arcane Charge",
    kind: "class_feature",
    status: "verified",
    classes: ["fighter"],
    subclass: "eldritchKnight",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Surge Teleport",
        description:
          "When you use your Action Surge, you can teleport up to 30 feet to an unoccupied space you can see before or after the additional action.",
      },
    ],
    description:
      "Teleport across the battlefield when unleashing your explosive Action Surge.",
    source: "Player's Handbook (2024), Fighter: Eldritch Knight",
  },
};
