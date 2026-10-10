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

  auraOfDevotion: {
    id: "embers:paladin:devotion:aura-of-devotion",
    name: "Aura of Devotion",
    kind: "class_feature",
    status: "verified",
    classes: ["paladin"],
    subclass: "oathOfDevotion",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Charm Immunity",
        description:
          "You and allies within your aura are immune to the Charmed condition.",
      },
    ],
    description:
      "Radiate protective clarity shielding your aura companions from charm enchantments.",
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

  holyNimbus: {
    id: "embers:paladin:devotion:holy-nimbus",
    name: "Holy Nimbus",
    kind: "class_feature",
    status: "verified",
    classes: ["paladin"],
    subclass: "oathOfDevotion",
    activationType: "bonus",
    resource: {
      name: "Holy Nimbus",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "apply_effect",
        name: "Solar Avatar Form",
        duration: "10 minutes",
        description:
          "As a Bonus Action, emanate an aura of sunlight for 10 minutes: enemies starting their turn in your aura take Radiant damage equal to your Proficiency Bonus + Charisma modifier, and you have Advantage on saves against spells cast by Fiends and Undead (1/Long Rest or expend a level 5 spell slot).",
      },
    ],
    description:
      "Level 20 Capstone: Become an avatar of solar radiance that scorches foes and wards allies.",
    source: "Player's Handbook (2024), Paladin: Oath of Devotion",
  },
};
