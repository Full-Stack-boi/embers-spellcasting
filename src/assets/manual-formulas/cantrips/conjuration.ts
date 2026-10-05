/**
 * Manual Spell Formula Overrides — Conjuration Cantrips
 */

import type { SpellFormula } from "../../../types/spellFormula";

export const conjurationCantripOverrides: Record<string, SpellFormula> = {
  // Mage Hand (Player's Handbook 2024, pg. 293)
  mage_hand: {
    id: "mage_hand",
    name: "Mage Hand",
    category: {
      spellType: "cantrip",
      school: "conjuration",
      level: 0,
      classes: ["artificer", "bard", "rogue", "sorcerer", "warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 293",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "30 ft.",
      components: "V, S",
      duration: "1 minute",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Summon a spectral hand at a point within range. It vanishes if more than 30 feet from you or if you cast this spell again.",
      "Use a Magic action on later turns to manipulate an object, open an unlocked door or container, stow/retrieve an item from an open container, or pour a vial; the hand can move up to 30 feet as part of that action.",
      "The hand cannot attack, activate magic items, or carry more than 10 pounds. Arcane Trickster can use subclass features to alter how Mage Hand works.",
    ],
    isManualOverride: true,
    notes:
      "The hand's movement and object interactions are tracked manually. Rogue access is limited to the Arcane Trickster subclass.",
  },

  // Produce Flame (Player's Handbook 2024, pg. 308)
  produce_flame: {
    id: "produce_flame",
    name: "Produce Flame",
    category: {
      spellType: "cantrip",
      school: "conjuration",
      level: 0,
      classes: ["druid", "artificer"],
      source: "Player's Handbook (2024), pg. 308",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "Bonus Action",
      range: "Self",
      components: "V, S",
      duration: "10 minutes",
    },
    interaction: { type: "spell_attack" },
    damage: [{ dice: "1d8", type: "fire", isBase: true }],
    cantripScale: {
      tiers: [
        { minLevel: 1, totalDice: "1d8" },
        { minLevel: 5, totalDice: "2d8" },
        { minLevel: 11, totalDice: "3d8" },
        { minLevel: 17, totalDice: "4d8" },
      ],
      scaleMode: "replace",
    },
    effectNotes: [
      "The flame sheds Bright Light in a 20-foot radius and Dim Light for another 20 feet. It gives no heat and ignites nothing; casting again ends the previous flame.",
      "While the flame lasts, use a Magic action to make a ranged spell attack against a creature or object within 60 feet; on a hit, it deals the cantrip's Fire damage.",
    ],
    isManualOverride: true,
    notes:
      "This is a two-stage spell: the initial Bonus Action creates the flame; the later Magic action makes the attack. Track the flame's duration and attack availability manually.",
  },
};
