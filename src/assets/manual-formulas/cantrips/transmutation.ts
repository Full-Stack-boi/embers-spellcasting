/**
 * Manual Spell Formula Overrides — Transmutation Cantrips
 */

import type { SpellFormula } from "../../../types/spellFormula";

export const transmutationCantripOverrides: Record<string, SpellFormula> = {
  // Druidcraft (D&D Free Rules 2024, Spell Descriptions)
  druidcraft: {
    id: "druidcraft",
    name: "Druidcraft",
    category: {
      spellType: "cantrip",
      school: "transmutation",
      level: 0,
      classes: ["druid"],
      source: "Player's Handbook (2024), pg. 266",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "30 ft.",
      components: "V, S",
      duration: "Instantaneous",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Choose one minor nature effect: predict local weather for the next 24 hours (sensory sign lasts 1 round); make a flower, seed pod, or leaf bloom; create a harmless sensory effect that fits in a 5-foot Cube; or light/snuff a candle, torch, or campfire.",
    ],
    isManualOverride: true,
    notes:
      "The selected sensory or environmental effect is resolved at the table; no damage or saving throw is involved.",
  },

  // Elementalism (Player's Handbook 2024, pg. 267)
  elementalism: {
    id: "elementalism",
    name: "Elementalism",
    category: {
      spellType: "cantrip",
      school: "transmutation",
      level: 0,
      classes: ["artificer", "druid", "paladin", "sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 267",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "30 ft.",
      components: "V, S",
      duration: "Instantaneous",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Choose one effect within range: Air creates a breeze in a 5-foot Cube that can close unheld doors and shutters; Earth lightly covers a 5-foot-square surface with dust or sand, or writes one word in dirt or sand.",
      "Fire creates harmless embers and colored, scented smoke in a 5-foot Cube; the embers can light candles, torches, or lamps, and the scent lingers for 1 minute.",
      "Water creates cool mist that lightly dampens creatures and objects in a 5-foot Cube, or creates 1 cup of clean water that evaporates after 1 minute.",
      "Sculpt Element shapes a small amount of dirt, sand, fire, smoke, mist, or water (up to a 1-foot Cube) into a crude form for 1 hour.",
    ],
    isManualOverride: true,
    notes:
      "Paladin access is limited to the Oath of the Noble Genies. This utility cantrip has five distinct options; object interactions and resulting scene state remain manual.",
  },

  // Mending (D&D Free Rules 2024, Spell Descriptions)
  mending: {
    id: "mending",
    name: "Mending",
    category: {
      spellType: "cantrip",
      school: "transmutation",
      level: 0,
      classes: ["bard", "cleric", "druid", "sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 297",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 minute",
      range: "Touch",
      components: "V, S, M (two lodestones)",
      duration: "Instantaneous",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Repair one break or tear in a touched object if the damage is no larger than 1 foot in any dimension. A magic item can be physically repaired, but its magic is not restored.",
    ],
    isManualOverride: true,
    notes:
      "Object repair is adjudicated manually; the spell does not restore a magic item's magical properties.",
  },

  // Message (D&D Free Rules 2024, Spell Descriptions)
  message: {
    id: "message",
    name: "Message",
    category: {
      spellType: "cantrip",
      school: "transmutation",
      level: 0,
      classes: ["bard", "druid", "sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 298",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "120 ft.",
      components: "S, M (a copper wire)",
      duration: "1 round",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Whisper to one creature within range; only it hears, and it can reply in a whisper only you hear. The spell can pass through a solid object when you know and are familiar with the creature beyond it.",
      "The spell is blocked by magical silence, at least 1 foot of stone/metal/wood, or a thin sheet of lead.",
    ],
    isManualOverride: true,
    notes:
      "Requires the caster and target to resolve the private message at the table; barriers and silence are checked manually.",
  },

  // Prestidigitation (D&D Free Rules 2024, Spell Descriptions)
  prestidigitation: {
    id: "prestidigitation",
    name: "Prestidigitation",
    category: {
      spellType: "cantrip",
      school: "transmutation",
      level: 0,
      classes: ["bard", "sorcerer", "warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 307",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "10 ft.",
      components: "V, S",
      duration: "Up to 1 hour",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Choose one: create a harmless instantaneous sensory effect; light/snuff a candle, torch, or small campfire; clean/soil an object up to 1 cubic foot; chill, warm, or flavor up to 1 cubic foot of nonliving material for 1 hour; make a color, small mark, or symbol last 1 hour; or create a harmless nonmagical trinket/illusory image fitting in your hand until the end of your next turn.",
      "You can have up to three non-instantaneous effects from this spell active at once.",
    ],
    isManualOverride: true,
    notes:
      "The selected cosmetic/object effect and active-effect limit are tracked manually; the created trinket cannot deal damage and has no monetary worth.",
  },

    // Shillelagh (PHB, pg. 275)
  // Mechanic: weapon die becomes d8 (club/quarterstaff), uses WIS for attack/damage
    shillelagh: {
    id: "shillelagh",
    name: "Shillelagh",
    category: {
      spellType: "cantrip",
      school: "transmutation",
      level: 0,
      classes: ["druid"],
      source: "Player's Handbook (2024), pg. 316",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 bonus action",
      range: "Touch",
      components:
        "V, S, M (mistletoe, a shamrock leaf, and a club or quarterstaff)",
      duration: "1 minute",
    },
    interaction: {
      type: "melee_spell_attack",
      useSpellcastingMod: true, // uses WIS (druid spellcasting mod)
    },
    damage: [
      {
        dice: "1d8",
        type: "bludgeoning",
        isBase: true,
      },
    ],
    cantripScale: {
      // No standard cantrip scale — damage die is fixed at d8
      tiers: [
        { minLevel: 1, totalDice: "1d8" },
        { minLevel: 5, totalDice: "1d8" },
        { minLevel: 11, totalDice: "1d8" },
        { minLevel: 17, totalDice: "1d8" },
      ],
      scaleMode: "replace",
    },
    isManualOverride: true,
    notes:
      "Weapon becomes magical for the duration. Attack and damage rolls use WIS modifier. Weapon damage die becomes 1d8 regardless of weapon type.",
  },

  // Thaumaturgy (D&D Free Rules 2024, Spell Descriptions)
  thaumaturgy: {
    id: "thaumaturgy",
    name: "Thaumaturgy",
    category: {
      spellType: "cantrip",
      school: "transmutation",
      level: 0,
      classes: ["cleric"],
      source: "Player's Handbook (2024), pg. 333",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "30 ft.",
      components: "V",
      duration: "Up to 1 minute",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Choose one: alter your eyes for 1 minute; boom your voice up to three times louder and gain Advantage on Charisma (Intimidation) checks for 1 minute; alter flames for 1 minute; instantly open or slam an unlocked door/window; create an instantaneous sound at a point within range; or cause harmless ground tremors for 1 minute.",
      "You can have up to three of this spell's 1-minute effects active at once.",
    ],
    isManualOverride: true,
    notes:
      "Track ongoing visual/audio effects and the limit of three simultaneous 1-minute effects manually.",
  },

  // Thorn Whip (Player's Handbook 2024, pg. 333)
  thorn_whip: {
    id: "thorn_whip",
    name: "Thorn Whip",
    category: {
      spellType: "cantrip",
      school: "transmutation",
      level: 0,
      classes: ["druid", "artificer"],
      source: "Player's Handbook (2024), pg. 333",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "30 ft.",
      components: "V, S, M (the stem of a plant with thorns)",
      duration: "Instantaneous",
    },
    interaction: { type: "spell_attack" },
    damage: [{ dice: "1d6", type: "piercing", isBase: true }],
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
      "On a hit, you can pull a Large or smaller target up to 10 feet straight toward yourself.",
    ],
    isManualOverride: true,
    notes:
      "Resolve the optional pull manually after a hit; token movement is not automatic.",
  },
};
