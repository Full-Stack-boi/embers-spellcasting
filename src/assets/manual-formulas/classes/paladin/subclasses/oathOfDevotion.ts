import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const OATH_OF_DEVOTION_FORMULAS: Record<string, ManualActionFormula> = {
  sacredWeapon: {
    id: "embers:paladin:devotion:sacred-weapon",
    name: "Channel Divinity: Sacred Weapon",
    kind: "class_feature",
    status: "verified",
    classes: ["paladin"],
    subclass: "oathOfDevotion",
    activationType: "bonus",
    operations: [
      {
        type: "apply_effect",
        name: "Consecrated Blade",
        description:
          "Bonus Action expend 1 Channel Divinity: add Charisma modifier to attack rolls with your weapon for 10 minutes; weapon sheds bright light and deals Radiant damage.",
      },
    ],
    description:
      "Imbue your weapon with dazzling solar brilliance and heightened accuracy.",
    source: "Player's Handbook (2024), Paladin: Oath of Devotion",
  },

  turnTheUnholy: {
    id: "embers:paladin:devotion:turn-the-unholy",
    name: "Channel Divinity: Turn the Unholy",
    kind: "class_feature",
    status: "verified",
    classes: ["paladin"],
    subclass: "oathOfDevotion",
    activationType: "action",
    operations: [
      {
        type: "apply_effect",
        name: "Purifying Repulsion",
        description:
          "Action expend 1 Channel Divinity: each Fiend and Undead within 30 feet makes Wisdom saving throw or has the Frightened and Incapacitated conditions for 1 minute.",
      },
    ],
    description:
      "Brandish your holy symbol to banish and turn fiends and walking dead.",
    source: "Player's Handbook (2024), Paladin: Oath of Devotion",
  },

  smiteOfProtection: {
    id: "embers:paladin:devotion:smite-of-protection",
    name: "Smite of Protection",
    kind: "class_feature",
    status: "verified",
    classes: ["paladin"],
    subclass: "oathOfDevotion",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Smite Aegis",
        description:
          "Whenever you cast a Smite spell, you and allies in your aura gain Half Cover until the start of your next turn.",
      },
    ],
    description:
      "Discharge protective holy warding around your allies whenever striking with a smite.",
    source: "Player's Handbook (2024), Paladin: Oath of Devotion",
  },
};
