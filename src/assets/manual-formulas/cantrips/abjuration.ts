/**
 * Manual Spell Formula Overrides — Abjuration Cantrips
 */

import type { SpellFormula } from "../../../types/spellFormula";

export const abjurationCantripOverrides: Record<string, SpellFormula> = {
  // Blade Ward (Player's Handbook 2024, pg. 247)
  blade_ward: {
    id: "blade_ward",
    name: "Blade Ward",
    category: {
      spellType: "cantrip",
      school: "abjuration",
      level: 0,
      classes: ["bard", "sorcerer", "warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 247",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Self",
      components: "V, S",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Whenever a creature makes an attack roll against you before the spell ends, subtract 1d4 from that roll.",
    ],
    isManualOverride: true,
    notes:
      "Apply the 1d4 penalty to each attack roll against the caster while concentration lasts. Druid access is limited to Circle of the Forged.",
  },

    // Resistance (Player's Handbook 2024, pg. 312)
  resistance: {
    id: "resistance",
    name: "Resistance",
    category: {
      spellType: "cantrip",
      school: "abjuration",
      level: 0,
      classes: ["cleric", "druid", "artificer"],
      source: "Player's Handbook (2024), pg. 312",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Touch",
      components: "V, S",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Touch a willing creature and choose Acid, Bludgeoning, Cold, Fire, Lightning, Necrotic, Piercing, Poison, Radiant, Slashing, or Thunder damage.",
      "The first time each turn the target takes the chosen damage type, reduce that instance's total by 1d4. A creature can benefit from this spell only once per turn.",
    ],
    isManualOverride: true,
    notes:
      "Choose and track the damage type and once-per-turn reduction manually; the reduction is not rolled as spell damage.",
  },
};
