/**
 * Manual Spell Formula Overrides — Necromancy Cantrips
 */

import type { SpellFormula } from "../../../types/spellFormula";

export const necromancyCantripOverrides: Record<string, SpellFormula> = {
    // Chill Touch (PHB, pg. 221) — Necromancy
    chill_touch: {
    id: "chill_touch",
    name: "Chill Touch",
    category: {
      spellType: "cantrip",
      school: "necromancy",
      level: 0,
      classes: ["sorcerer", "warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 249",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Touch",
      components: "V, S",
      duration: "1 round",
    },
    interaction: {
      type: "melee_spell_attack",
    },
    damage: [
      {
        dice: "1d10",
        type: "necrotic",
        isBase: true,
      },
    ],
    cantripScale: {
      tiers: [
        { minLevel: 1, totalDice: "1d10" },
        { minLevel: 5, totalDice: "2d10" },
        { minLevel: 11, totalDice: "3d10" },
        { minLevel: 17, totalDice: "4d10" },
      ],
      scaleMode: "replace",
    },
    isManualOverride: true,
    notes:
      "On hit: target can't regain HP until start of your next turn. Undead have disadvantage on attack rolls against you until end of your next turn.",
  },

    // Poison Spray (PHB, pg. 266) — Conjuration
    poison_spray: {
    id: "poison_spray",
    name: "Poison Spray",
    category: {
      spellType: "cantrip",
      school: "necromancy",
      level: 0,
      classes: ["druid", "sorcerer", "warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 306",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "30 ft.",
      components: "V, S",
      duration: "Instantaneous",
    },
    interaction: {
      type: "spell_attack",
    },
    damage: [
      {
        dice: "1d12",
        type: "poison",
        isBase: true,
      },
    ],
    cantripScale: {
      tiers: [
        { minLevel: 1, totalDice: "1d12" },
        { minLevel: 5, totalDice: "2d12" },
        { minLevel: 11, totalDice: "3d12" },
        { minLevel: 17, totalDice: "4d12" },
      ],
      scaleMode: "replace",
    },
    effectNotes: [
      "You spray toxic mist at a creature within range. Make a ranged spell attack against the target. On a hit, the target takes 1d12 Poison damage.",
    ],
    isManualOverride: true,
    notes:
      "In 2024 rules: Necromancy cantrip, 30 ft range, ranged spell attack dealing 1d12 Poison damage.",
  },

  // Spare the Dying (Player's Handbook 2024, pg. 318)
  spare_the_dying: {
    id: "spare_the_dying",
    name: "Spare the Dying",
    category: {
      spellType: "cantrip",
      school: "necromancy",
      level: 0,
      classes: ["artificer", "cleric", "druid"],
      source: "Player's Handbook (2024), pg. 318",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "15 ft.",
      components: "V, S",
      duration: "Instantaneous",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Choose a living creature within range that has 0 Hit Points and is not dead; it becomes Stable.",
      "Cantrip Upgrade: range doubles at character levels 5 (30 feet), 11 (60 feet), and 17 (120 feet).",
    ],
    isManualOverride: true,
    notes:
      "Stabilize the creature manually. Range scaling is listed explicitly because this cantrip scales range rather than damage.",
  },

  // Toll the Dead (Xanathar's Guide, pg. 169) — Necromancy
  // Mechanic: damage die is d8 normally, d12 if target is missing HP
    toll_the_dead: {
    id: "toll_the_dead",
    name: "Toll the Dead",
    category: {
      spellType: "cantrip",
      school: "necromancy",
      level: 0,
      classes: ["cleric", "warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 334",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "60 ft.",
      components: "V, S",
      duration: "Instantaneous",
    },
    interaction: {
      type: "save",
      saveAbility: "WIS",
    },
    damage: [
      {
        dice: "1d8",
        type: "necrotic",
        isBase: true,
        condition: "target at full HP",
      },
      {
        dice: "1d12",
        type: "necrotic",
        isBase: false,
        condition: "target is missing any HP (replaces base die)",
      },
    ],
    cantripScale: {
      tiers: [
        { minLevel: 1, totalDice: "1d8 / 1d12", damageDice: ["1d8", "1d12"] },
        { minLevel: 5, totalDice: "2d8 / 2d12", damageDice: ["2d8", "2d12"] },
        { minLevel: 11, totalDice: "3d8 / 3d12", damageDice: ["3d8", "3d12"] },
        { minLevel: 17, totalDice: "4d8 / 4d12", damageDice: ["4d8", "4d12"] },
      ],
      scaleMode: "replace",
    },
    isManualOverride: true,
    notes:
      "1d8 normally; 1d12 if the target is missing any HP. WIS save or take full damage.",
  },
};
