import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const FEY_WANDERER_FORMULAS: Record<string, ManualActionFormula> = {
  dreadfulStrikes: {
    id: "embers:ranger:fey-wanderer:dreadful-strikes",
    name: "Dreadful Strikes",
    kind: "class_feature",
    status: "verified",
    classes: ["ranger"],
    subclass: "feyWanderer",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Psychic Weaponry",
        description:
          "Once per turn when you hit a creature with a weapon, you can deal an extra 1d4 Psychic damage to the target (scales to 1d6 at level 11).",
      },
    ],
    description:
      "Lace weapon strikes with mind-twisting shadows from the Feywild.",
    source: "Player's Handbook (2024), Ranger: Fey Wanderer",
  },

  beguilingTwist: {
    id: "embers:ranger:fey-wanderer:beguiling-twist",
    name: "Beguiling Twist",
    kind: "class_feature",
    status: "verified",
    classes: ["ranger"],
    subclass: "feyWanderer",
    activationType: "reaction",
    operations: [
      {
        type: "apply_effect",
        name: "Redirect Glamour",
        description:
          "Reaction when you or a creature within 120 ft succeeds on a save vs Charmed or Frightened: force another creature within 120 ft to make Wisdom save or be Charmed/Frightened for 1 minute.",
      },
    ],
    description:
      "Turn failed charm or fear magic into an offensive weapon against adversaries.",
    source: "Player's Handbook (2024), Ranger: Fey Wanderer",
  },

  mistyWanderer: {
    id: "embers:ranger:fey-wanderer:misty-wanderer",
    name: "Misty Wanderer",
    kind: "class_feature",
    status: "verified",
    classes: ["ranger"],
    subclass: "feyWanderer",
    activationType: "bonus",
    resource: {
      name: "Misty Wanderer",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "apply_effect",
        name: "Fey Jaunt",
        description:
          "Cast Misty Step without expending a spell slot Proficiency Bonus times per Long Rest; bring a willing ally within 5 feet along with you.",
      },
    ],
    description:
      "Step effortlessly through mist and transport a friend beside you.",
    source: "Player's Handbook (2024), Ranger: Fey Wanderer",
  },
};
