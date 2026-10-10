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
    flyoutType: "options_grid",
    resource: {
      name: "Psionic Energy Dice",
      resetType: "Short or Long Rest",
    },
    operations: [
      {
        type: "apply_effect",
        name: "Psionic Talents",
        description:
          "You have a pool of Psionic Energy Dice (2x PB dice): Protective Field (Reaction reduce damage), Psionic Strike (deal extra Force damage), and Telekinetic Movement (move object/willing creature).",
      },
    ],
    options: [
      {
        id: "protective-field",
        name: "Protective Field",
        cost: 1,
        desc: "Reaction when you or a creature within 30 ft takes damage: roll 1 Psionic Energy Die + INT mod to reduce the damage.",
        actionType: "reaction",
      },
      {
        id: "psionic-strike",
        name: "Psionic Strike",
        cost: 1,
        desc: "Once on each of your turns when you hit with a weapon attack within 30 ft: deal extra Force damage equal to 1 Psionic Energy Die + INT mod.",
        actionType: "none",
      },
      {
        id: "telekinetic-movement",
        name: "Telekinetic Movement",
        cost: 0,
        desc: "Action: telekinetically move one loose object or willing creature within 30 ft up to 30 ft (free once per Short/Long Rest, or costs 1 die).",
        actionType: "action",
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
          "Psi-Powered Leap (Bonus Action flying speed equal to twice walking speed until end of turn) and Telekinetic Thrust (force STR save or knock Prone or push 10 ft when hitting with Psionic Strike).",
      },
    ],
    description:
      "Propel yourself through the air and telekinetically bash foes to the ground.",
    source: "Player's Handbook (2024), Fighter: Psi Warrior",
  },

  guardedMind: {
    id: "embers:fighter:psi-warrior:guarded-mind",
    name: "Guarded Mind",
    kind: "class_feature",
    status: "verified",
    classes: ["fighter"],
    subclass: "psiWarrior",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Mental Bastion",
        description:
          "You have Resistance to Psychic damage. If you start your turn Charmed or Frightened, you can expend 1 Psionic Energy Die to end every effect causing those conditions on yourself.",
      },
    ],
    description:
      "Mental shielding provides psychic resistance and allows expending psionic dice to shatter charms and fear.",
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
          "As a Bonus Action, shield yourself and allies within 30 feet (up to INT mod): affected creatures gain Half Cover for 1 minute (1/Long Rest, or expend 1 Psionic die).",
      },
    ],
    description:
      "Erect an invisible telekinetic barrier shielding your entire party with Half Cover.",
    source: "Player's Handbook (2024), Fighter: Psi Warrior",
  },

  telekineticMaster: {
    id: "embers:fighter:psi-warrior:telekinetic-master",
    name: "Telekinetic Master",
    kind: "class_feature",
    status: "verified",
    classes: ["fighter"],
    subclass: "psiWarrior",
    activationType: "action",
    operations: [
      {
        type: "apply_effect",
        name: "Pinnacle Telekinesis",
        description:
          "Cast the Telekinesis spell without spell slots or components (1/Long Rest or expend 1 Psionic die). While concentrating on it, you can make one weapon attack as a Bonus Action.",
      },
    ],
    description:
      "Channel masterful telekinesis without components, making bonus attacks while manipulating the battlefield.",
    source: "Player's Handbook (2024), Fighter: Psi Warrior",
  },
};
