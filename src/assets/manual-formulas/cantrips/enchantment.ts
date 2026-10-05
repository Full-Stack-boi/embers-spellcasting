/**
 * Manual Spell Formula Overrides — Enchantment Cantrips
 */

import type { SpellFormula } from "../../../types/spellFormula";

export const enchantmentCantripOverrides: Record<string, SpellFormula> = {
  // Friends (Player's Handbook 2024, pg. 277)
  friends: {
    id: "friends",
    name: "Friends",
    category: {
      spellType: "cantrip",
      school: "enchantment",
      level: 0,
      classes: ["bard", "sorcerer", "warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 277",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "10 ft.",
      components: "S, M (some makeup)",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "save", saveAbility: "WIS" },
    damage: [],
    effectNotes: [
      "One creature you can see makes a Wisdom save or has the Charmed condition for the duration. It succeeds automatically if it is not a Humanoid, you are fighting it, or you cast this spell on it within the past 24 hours.",
      "The spell ends early if the target takes damage, or you make an attack roll, deal damage, or force anyone to make a saving throw. When it ends, the target knows it was Charmed by you.",
    ],
    isManualOverride: true,
    notes:
      "Track concentration and the early-end triggers; the target becomes aware of the charm when it ends.",
  },

  // Mind Sliver (Player's Handbook 2024, pg. 298)
  mind_sliver: {
    id: "mind_sliver",
    name: "Mind Sliver",
    category: {
      spellType: "cantrip",
      school: "enchantment",
      level: 0,
      classes: ["sorcerer", "warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 298",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "60 ft.",
      components: "V",
      duration: "1 round",
    },
    interaction: { type: "save", saveAbility: "INT" },
    damage: [{ dice: "1d6", type: "psychic", isBase: true }],
    cantripScale: {
      tiers: [
        { minLevel: 1, totalDice: "1d6" },
        { minLevel: 5, totalDice: "2d6" },
        { minLevel: 11, totalDice: "3d6" },
        { minLevel: 17, totalDice: "4d6" },
      ],
      scaleMode: "replace",
    },
    effectNotes: [
      "On a failed Intelligence save, the target subtracts 1d4 from the next saving throw it makes before the end of your next turn.",
    ],
    isManualOverride: true,
    notes:
      "The save penalty is a separate rider and does not scale with cantrip level. Aberrant Sorcery features may grant additional access.",
  },

  // Vicious Mockery (Player's Handbook 2024, pg. 337)
  vicious_mockery: {
    id: "vicious_mockery",
    name: "Vicious Mockery",
    category: {
      spellType: "cantrip",
      school: "enchantment",
      level: 0,
      classes: ["bard"],
      source: "Player's Handbook (2024), pg. 337",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "60 ft.",
      components: "V",
      duration: "Instantaneous",
    },
    interaction: { type: "save", saveAbility: "WIS" },
    damage: [{ dice: "1d6", type: "psychic", isBase: true }],
    cantripScale: {
      tiers: [
        { minLevel: 1, totalDice: "1d6" },
        { minLevel: 5, totalDice: "2d6" },
        { minLevel: 11, totalDice: "3d6" },
        { minLevel: 17, totalDice: "4d6" },
      ],
      scaleMode: "replace",
    },
    effectNotes: [
      "The target must be able to see or hear you. On a failed Wisdom save, it takes the damage and has Disadvantage on its next attack roll before the end of your next turn.",
    ],
    isManualOverride: true,
    notes:
      "Track the one-attack Disadvantage rider manually. Additional subclass access (Great Fool Patron or Architect of Ruin) is not represented by the base class list.",
  },
};
