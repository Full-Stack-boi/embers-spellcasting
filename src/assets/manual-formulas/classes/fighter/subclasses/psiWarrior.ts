import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const PSI_WARRIOR_FORMULAS: Record<string, ManualActionFormula> = {
  psionicPower: {
    id: "embers:fighter:psi-warrior:psionic-power",
    name: "Psionic Power",
    kind: "class_feature",
    status: "verified",
    classes: ["fighter"],
    subclass: "psiWarrior",
    activationType: "special",
    resource: {
      name: "Psionic Energy Dice",
      resetType: "Short or Long Rest",
    },
    operations: [
      {
        type: "apply_effect",
        name: "Psionic Talents",
        description:
          "You have a pool of Psionic Energy Dice (2x Proficiency Bonus, d6 to d12): Protective Field (Reaction reduce damage by die + INT), Psionic Strike (deal extra Force damage = die + INT), and Telekinetic Movement (move object/willing creature 30 ft).",
      },
    ],
    description:
      "Harness raw mental telekinesis to shield allies and crush foes.",
    source: "Player's Handbook (2024), Fighter: Psi Warrior",
  },

  telekineticAdept: {
    id: "embers:fighter:psi-warrior:telekinetic-adept",
    name: "Telekinetic Adept",
    kind: "class_feature",
    status: "verified",
    classes: ["fighter"],
    subclass: "psiWarrior",
    activationType: "bonus",
    operations: [
      {
        type: "apply_effect",
        name: "Psi Leap and Thrust",
        description:
          "Psi-Powered Leap (Bonus Action flying speed until end of turn) and Telekinetic Thrust (when hitting with Psionic Strike, force STR save or knock Prone or push 10 ft).",
      },
    ],
    description:
      "Propel yourself through the air and telekinetically bash foes to the ground.",
    source: "Player's Handbook (2024), Fighter: Psi Warrior",
  },

  bulwarkOfForce: {
    id: "embers:fighter:psi-warrior:bulwark-of-force",
    name: "Bulwark of Force",
    kind: "class_feature",
    status: "verified",
    classes: ["fighter"],
    subclass: "psiWarrior",
    activationType: "bonus",
    resource: {
      name: "Bulwark of Force",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "apply_effect",
        name: "Telekinetic Shielding",
        description:
          "As a Bonus Action, shield yourself and allies within 30 feet with telekinetic force: affected creatures have Half Cover for 1 minute.",
      },
    ],
    description:
      "Erect invisible telekinetic barrier shielding your entire party.",
    source: "Player's Handbook (2024), Fighter: Psi Warrior",
  },
};
