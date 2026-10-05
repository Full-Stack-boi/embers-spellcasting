/**
 * Manual Spell Formula Overrides — Divination Cantrips
 */

import type { SpellFormula } from "../../../types/spellFormula";

export const divinationCantripOverrides: Record<string, SpellFormula> = {
  // Guidance (Player's Handbook 2024, pg. 282)
  guidance: {
    id: "guidance",
    name: "Guidance",
    category: {
      spellType: "cantrip",
      school: "divination",
      level: 0,
      classes: ["artificer", "cleric", "druid"],
      source: "Player's Handbook (2024), pg. 282",
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
      "Touch a willing creature and choose one skill. Until the spell ends, the target adds 1d4 to ability checks that use that skill.",
    ],
    isManualOverride: true,
    notes:
      "Track the chosen skill and concentration manually; the bonus applies only to ability checks using that skill.",
  },

  // True Strike (Player's Handbook 2024, pg. 336)
  true_strike: {
    id: "true_strike",
    name: "True Strike",
    category: {
      spellType: "cantrip",
      school: "divination",
      level: 0,
      classes: ["artificer", "bard", "druid", "sorcerer", "warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 336",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Self",
      components: "S, M (a proficient weapon worth 1+ CP)",
      duration: "Instantaneous",
    },
    interaction: {
      type: "weapon_based",
      useSpellcastingMod: true,
      weaponAttack: { meleeRangeFeet: 5 },
    },
    damage: [
      {
        dice: "weapon",
        type: "choice",
        typeChoices: ["radiant", "weapon"],
        isBase: true,
        condition: "Choose Radiant or the weapon's normal damage type",
      },
    ],
    cantripScale: {
      tiers: [
        { minLevel: 1, totalDice: "0d6" },
        { minLevel: 5, totalDice: "1d6" },
        { minLevel: 11, totalDice: "2d6" },
        { minLevel: 17, totalDice: "3d6" },
      ],
      scaleMode: "add_dice",
      extraDamageType: "radiant",
    },
    isManualOverride: true,
    notes:
      "Make one melee weapon attack using the spellcasting ability for its attack and damage rolls. The weapon's normal damage remains the base; choose Radiant or its normal type, then add the listed Radiant cantrip damage. Druid access is limited to the Circle of the Unbroken.",
  },
};
