import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const ARCHFEY_PATRON_FORMULAS: Record<string, ManualActionFormula> = {
  stepsOfTheFey: {
    id: "embers:warlock:archfey:steps-of-the-fey",
    name: "Steps of the Fey",
    kind: "class_feature",
    status: "verified",
    classes: ["warlock"],
    subclass: "archfeyPatron",
    activationType: "bonus",
    resource: {
      name: "Steps of the Fey",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "apply_effect",
        name: "Misty Jaunt With Rider",
        description:
          "Cast Misty Step without a slot (Proficiency Bonus uses / Long Rest); apply Taunting Step (frighten/charm), Refreshing Step (Temp HP to ally), or Dreadful Step (psychic damage in origin space).",
      },
    ],
    description:
      "Teleport across the battlefield leaving magical fey trickery in your wake.",
    source: "Player's Handbook (2024), Warlock: Archfey Patron",
  },

  mistyEscape: {
    id: "embers:warlock:archfey:misty-escape",
    name: "Misty Escape",
    kind: "class_feature",
    status: "verified",
    classes: ["warlock"],
    subclass: "archfeyPatron",
    activationType: "reaction",
    operations: [
      {
        type: "apply_effect",
        name: "Vanish On Hit",
        description:
          "Reaction when you take damage: cast Misty Step immediately and become Invisible until the start of your next turn.",
      },
    ],
    description: "Dissolve into mist when struck, evading danger unseen.",
    source: "Player's Handbook (2024), Warlock: Archfey Patron",
  },

  beguilingDefenses: {
    id: "embers:warlock:archfey:beguiling-defenses",
    name: "Beguiling Defenses",
    kind: "class_feature",
    status: "verified",
    classes: ["warlock"],
    subclass: "archfeyPatron",
    activationType: "reaction",
    operations: [
      {
        type: "apply_effect",
        name: "Immunity and Charm Counter",
        description:
          "You are immune to the Charmed condition. Reaction when a creature attempts to charm you: force it to make a Wisdom save or be Charmed by you for 1 minute.",
      },
    ],
    description:
      "Turn enemy enchantment magic directly back against the caster.",
    source: "Player's Handbook (2024), Warlock: Archfey Patron",
  },

  bewitchingMagic: {
    id: "embers:warlock:archfey:bewitching-magic",
    name: "Bewitching Magic",
    kind: "class_feature",
    status: "verified",
    classes: ["warlock"],
    subclass: "archfeyPatron",
    activationType: "special",
    description: "Whenever you cast an Enchantment or Illusion spell with a spell slot of level 1 or higher, you can cast Misty Step as part of the same action without expending a spell slot.",
    source: "Player's Handbook (2024), Warlock: Archfey Patron",
    operations: [
      {
        type: "apply_effect",
        name: "Free Illusion/Enchantment Teleport",
        description: "Cast Misty Step as part of casting any 1st+ level Enchantment or Illusion spell without expending a spell slot.",
      },
    ],
  },
};
