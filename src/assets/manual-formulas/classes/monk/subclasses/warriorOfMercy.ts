import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const WARRIOR_OF_MERCY_FORMULAS: Record<string, ManualActionFormula> = {
  handOfHealing: {
    id: "embers:monk:mercy:hand-of-healing",
    name: "Hand of Healing",
    kind: "class_feature",
    status: "verified",
    classes: ["monk"],
    subclass: "warriorOfMercy",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Merciful Restoration",
        description:
          "Spend 1 Focus Point (or replace one attack of Flurry of Blows) to touch a creature and restore HP equal to your Martial Arts die + Wisdom modifier.",
      },
    ],
    description:
      "Channel revitalizing ki to close wounds and restore vitality with a gentle touch.",
    source: "Player's Handbook (2024), Monk: Warrior of Mercy",
  },

  handOfHarm: {
    id: "embers:monk:mercy:hand-of-harm",
    name: "Hand of Harm",
    kind: "class_feature",
    status: "verified",
    classes: ["monk"],
    subclass: "warriorOfMercy",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Wrathful Touch",
        description:
          "When you hit a creature with an Unarmed Strike, spend 1 Focus Point to deal extra Necrotic damage equal to your Martial Arts die + Wisdom modifier.",
      },
    ],
    description: "Discharge necrotic ki that withers and punishes enemies.",
    source: "Player's Handbook (2024), Monk: Warrior of Mercy",
  },

  physiciansTouch: {
    id: "embers:monk:mercy:physicians-touch",
    name: "Physician's Touch",
    kind: "class_feature",
    status: "verified",
    classes: ["monk"],
    subclass: "warriorOfMercy",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Condition Remedy and Affliction",
        description:
          "Hand of Healing cures Blinded, Deafened, Paralyzed, Poisoned, or Stunned conditions; Hand of Harm inflicts the Poisoned condition until the end of your next turn.",
      },
    ],
    description:
      "Cleanse debilitating afflictions from friends or poison enemies.",
    source: "Player's Handbook (2024), Monk: Warrior of Mercy",
  },
};
