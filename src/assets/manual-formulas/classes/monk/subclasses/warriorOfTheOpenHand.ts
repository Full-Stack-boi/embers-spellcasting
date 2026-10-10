import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const WARRIOR_OF_THE_OPEN_HAND_FORMULAS: Record<
  string,
  ManualActionFormula
> = {
  openHandTechnique: {
    id: "embers:monk:open-hand:open-hand-technique",
    name: "Open Hand Technique",
    kind: "class_feature",
    status: "verified",
    classes: ["monk"],
    subclass: "warriorOfTheOpenHand",
    activationType: "special",
    flyoutType: "options_grid",
    operations: [
      {
        type: "apply_effect",
        name: "Martial Manipulation",
        description:
          "Whenever you hit a creature with one of your Flurry of Blows attacks: Addle (no reactions until start of next turn), Push (push target 15 ft on failed STR save), or Topple (knock target Prone on failed DEX save).",
      },
    ],
    options: [
      {
        id: "addle",
        name: "Addle",
        cost: 0,
        desc: "Target cannot make Opportunity Attacks or take reactions until start of its next turn.",
        actionType: "none",
      },
      {
        id: "push",
        name: "Push (15 ft)",
        cost: 0,
        desc: "Force target to make a Strength save or be pushed up to 15 feet away from you.",
        actionType: "none",
      },
      {
        id: "topple",
        name: "Topple (Prone)",
        cost: 0,
        desc: "Force target to make a Dexterity save or have the Prone condition.",
        actionType: "none",
      },
    ],
    description:
      "Manipulate enemy momentum to topple, push, or disorient them on every strike.",
    source: "Player's Handbook (2024), Monk: Warrior of the Open Hand",
  },

  wholenessOfBody: {
    id: "embers:monk:open-hand:wholeness-of-body",
    name: "Wholeness of Body",
    kind: "class_feature",
    status: "verified",
    classes: ["monk"],
    subclass: "warriorOfTheOpenHand",
    activationType: "bonus",
    resource: {
      name: "Wholeness of Body",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "apply_effect",
        name: "Somatic Restoration",
        description:
          "Bonus Action heal yourself for a roll of your Martial Arts die + Wisdom modifier (Wisdom modifier uses per Long Rest).",
      },
    ],
    description:
      "Channel internal reserves to rapidly knit wounds and purify body tissues.",
    source: "Player's Handbook (2024), Monk: Warrior of the Open Hand",
  },

  fleetStep: {
    id: "embers:monk:open-hand:fleet-step",
    name: "Fleet Step",
    kind: "class_feature",
    status: "verified",
    classes: ["monk"],
    subclass: "warriorOfTheOpenHand",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Fluid Agility",
        description:
          "When you take a Bonus Action other than Step of the Wind, you can also use Step of the Wind as part of that same Bonus Action.",
      },
    ],
    description:
      "Seamlessly blend Step of the Wind into any Bonus Action you take.",
    source: "Player's Handbook (2024), Monk: Warrior of the Open Hand",
  },

  quiveringPalm: {
    id: "embers:monk:open-hand:quivering-palm",
    name: "Quivering Palm",
    kind: "class_feature",
    status: "verified",
    classes: ["monk"],
    subclass: "warriorOfTheOpenHand",
    activationType: "action",
    operations: [
      {
        type: "apply_effect",
        name: "Lethal Vibrations",
        description:
          "Hit creature with Unarmed Strike and spend 4 Focus Points to set up deadly vibrations. Later take an Action to end vibrations: target makes Constitution save, taking 10d12 Force damage on failed save or half on success.",
      },
    ],
    description:
      "Impart lethal harmonic vibrations that can shatter a creature's vital organs.",
    source: "Player's Handbook (2024), Monk: Warrior of the Open Hand",
  },
};
