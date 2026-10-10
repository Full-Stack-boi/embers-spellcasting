import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const THIEF_FORMULAS: Record<string, ManualActionFormula> = {
  fastHands: {
    id: "embers:rogue:thief:fast-hands",
    name: "Fast Hands",
    kind: "class_feature",
    status: "verified",
    classes: ["rogue"],
    subclass: "thief",
    activationType: "bonus",
    operations: [
      {
        type: "apply_effect",
        name: "Rapid Interaction",
        description:
          "Take the Utilize action, make a Dexterity (Sleight of Hand) check, or use thieves' tools to disarm a trap or open a lock as a Bonus Action.",
      },
    ],
    description:
      "Interact with objects, drink potions, and pick locks with blinding swiftness.",
    source: "Player's Handbook (2024), Rogue: Thief",
  },

  secondStoryWork: {
    id: "embers:rogue:thief:second-story-work",
    name: "Second-Story Work",
    kind: "class_feature",
    status: "verified",
    classes: ["rogue"],
    subclass: "thief",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Rooftop Agility",
        description:
          "Gain a Climb speed equal to your Speed; when you make a running jump, the distance you jump increases by your Dexterity modifier.",
      },
    ],
    description:
      "Scale stone walls and leap across city rooftops with acrobatic ease.",
    source: "Player's Handbook (2024), Rogue: Thief",
  },

  supremeSneak: {
    id: "embers:rogue:thief:supreme-sneak",
    name: "Supreme Sneak",
    kind: "class_feature",
    status: "verified",
    classes: ["rogue"],
    subclass: "thief",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Stealth Attack",
        description:
          "Cunning Strike option: forego 1d6 Sneak Attack damage to make your attack without revealing your position if you have heavy cover or concealment.",
      },
    ],
    description:
      "Strike from hiding without giving away your concealed location.",
    source: "Player's Handbook (2024), Rogue: Thief",
  },

  useMagicDevice: {
    id: "embers:rogue:thief:use-magic-device",
    name: "Use Magic Device",
    kind: "class_feature",
    status: "verified",
    classes: ["rogue"],
    subclass: "thief",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Arcane Attunement Mastery",
        description:
          "You can attune to up to 4 magic items, ignore class/species/level prerequisites on magic items, and when you expend a charge from a magic item roll a d6: on a 6, the charge isn't expended.",
      },
    ],
    description:
      "Attune to more items, ignore restrictions, and conserve magic item charges.",
    source: "Player's Handbook (2024), Rogue: Thief",
  },

  thiefsReflexes: {
    id: "embers:rogue:thief:thiefs-reflexes",
    name: "Thief's Reflexes",
    kind: "class_feature",
    status: "verified",
    classes: ["rogue"],
    subclass: "thief",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Double Initiative Turn",
        description:
          "You can take two turns in the first round of any combat (first at your normal initiative, second at initiative - 10).",
      },
    ],
    description:
      "Act twice in the opening round of combat before foes can react.",
    source: "Player's Handbook (2024), Rogue: Thief",
  },
};
