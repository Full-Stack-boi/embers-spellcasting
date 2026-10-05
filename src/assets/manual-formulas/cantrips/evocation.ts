/**
 * Manual Spell Formula Overrides — Evocation Cantrips
 */

import type { SpellFormula } from "../../../types/spellFormula";

export const evocationCantripOverrides: Record<string, SpellFormula> = {
  // Acid Splash (Player's Handbook 2024, pg. 239)
  acid_splash: {
    id: "acid_splash",
    name: "Acid Splash",
    category: {
      spellType: "cantrip",
      school: "evocation",
      level: 0,
      classes: ["artificer", "sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 239",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "60 ft. (5-ft. Sphere)",
      components: "V, S",
      duration: "Instantaneous",
    },
    interaction: {
      type: "save",
      saveAbility: "DEX",
    },
    area: {
      shape: "Sphere",
      sizeFeet: 5,
    },
    damage: [
      {
        dice: "1d6",
        type: "acid",
        isBase: true,
      },
    ],
    cantripScale: {
      tiers: [
        { minLevel: 1, totalDice: "1d6" },
        { minLevel: 5, totalDice: "2d6" },
        { minLevel: 11, totalDice: "3d6" },
        { minLevel: 17, totalDice: "4d6" },
      ],
      scaleMode: "replace",
    },
    isManualOverride: true,
    notes:
      "Choose a point within range; each creature in the 5-foot-radius Sphere makes a Dexterity saving throw, taking the listed Acid damage on a failed save.",
  },

  // Arc Blade (Valda's Spire of Secrets: Player Pack 2)
  arc_blade: {
    id: "arc_blade",
    name: "Arc Blade",
    category: {
      spellType: "cantrip",
      school: "evocation",
      level: 0,
      classes: ["sorcerer", "warlock", "wizard"],
      source: "Valda's Spire of Secrets: Player Pack 2 (2024 rules)",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "15 ft.",
      components: "S, M (proficient melee weapon worth 1+ CP)",
      duration: "Instantaneous",
    },
    interaction: {
      type: "weapon_based",
      useSpellcastingMod: true,
      weaponAttack: {
        meleeRangeFeet: 5,
        rangedSpellAttack: { rangeFeet: 15, damageType: "lightning" },
      },
    },
    damage: [
      {
        dice: "weapon",
        type: "choice",
        typeChoices: ["lightning", "weapon"],
        isBase: true,
        condition: "Melee: lightning or weapon damage type; ranged: lightning",
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
      extraDamageType: "lightning",
    },
    isManualOverride: true,
    notes:
      "Uses a proficient melee weapon. Choose melee or ranged delivery. Both attack and damage use the spellcasting ability; the ranged option deals Lightning damage, while the melee option lets the caster choose Lightning or the weapon's normal damage type.",
  },

  // Booming Blade (Tasha's Cauldron of Everything, pg. 106)
  booming_blade: {
    id: "booming_blade",
    name: "Booming Blade",
    category: {
      spellType: "cantrip",
      school: "evocation",
      level: 0,
      classes: ["artificer", "sorcerer", "warlock", "wizard"],
      source: "Tasha's Cauldron of Everything, pg. 106",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Self (5-ft. radius)",
      components: "S, M (proficient melee weapon worth 1+ CP)",
      duration: "1 round",
    },
    interaction: {
      type: "weapon_based",
      useSpellcastingMod: false,
      weaponAttack: { meleeRangeFeet: 5 },
    },
    damage: [
      {
        dice: "weapon",
        type: "weapon",
        isBase: true,
        condition: "Normal melee weapon damage",
      },
    ],
    cantripScale: {
      tiers: [
        { minLevel: 1, totalDice: "0d8" },
        { minLevel: 5, totalDice: "1d8" },
        { minLevel: 11, totalDice: "2d8" },
        { minLevel: 17, totalDice: "3d8" },
      ],
      scaleMode: "add_dice",
      extraDamageType: "thunder",
    },
    mechanics: [
      {
        kind: "conditional_trigger",
        triggerCondition: "movement",
        conditionDesc:
          "Target moves 5+ ft before the start of caster's next turn",
        damageDice: "1d8",
        damageType: "thunder",
        duration: "start_of_caster_next_turn",
        cantripScaleTiers: [
          { minLevel: 1, totalDice: "1d8" },
          { minLevel: 5, totalDice: "2d8" },
          { minLevel: 11, totalDice: "3d8" },
          { minLevel: 17, totalDice: "4d8" },
        ],
      },
    ],
    effectNotes: [
      "Make a melee weapon attack. On hit, the target suffers normal weapon damage.",
      "At 5th level, the attack deals an extra 1d8 Thunder damage (2d8 at 11th, 3d8 at 17th).",
      "If the target willingly moves 5 feet or more before start of your next turn, it takes 1d8 Thunder damage (2d8 at 5th, 3d8 at 11th, 4d8 at 17th).",
    ],
    isManualOverride: true,
  },

    // Eldritch Blast (PHB, pg. 237) — Evocation (Warlock-exclusive)
  // Note: each beam is a separate attack roll; beam count scales with level
    eldritch_blast: {
    id: "eldritch_blast",
    name: "Eldritch Blast",
    category: {
      spellType: "cantrip",
      school: "evocation",
      level: 0,
      classes: ["warlock"],
      source: "Player's Handbook (2024), pg. 267",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "120 ft.",
      components: "V, S",
      duration: "Instantaneous",
    },
    interaction: {
      type: "spell_attack",
      
    },
    damage: [
      {
        dice: "1d10",
        type: "force",
        isBase: true,
        condition: "per beam",
      },
    ],
    cantripScale: {
      // Scale = number of beams (not dice size)
      tiers: [
        { minLevel: 1, totalDice: "1d10" }, // 1 beam
        { minLevel: 5, totalDice: "2d10" }, // 2 beams
        { minLevel: 11, totalDice: "3d10" }, // 3 beams
        { minLevel: 17, totalDice: "4d10" }, // 4 beams
      ],
      scaleMode: "replace",
    },
    isManualOverride: true,
    notes:
      "Creates multiple separate beams. Each beam is an independent ranged spell attack. May target the same or different creatures.",
  },

    // Fire Bolt (PHB, pg. 257)
  // Standard evocation cantrip — kept here as reference baseline
    fire_bolt: {
    id: "fire_bolt",
    name: "Fire Bolt",
    category: {
      spellType: "cantrip",
      school: "evocation",
      level: 0,
      classes: ["sorcerer", "wizard", "artificer"],
      source: "Player's Handbook (2024), pg. 274",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "120 ft.",
      components: "V, S",
      duration: "Instantaneous",
    },
    interaction: {
      type: "spell_attack",
    },
    damage: [
      {
        dice: "1d10",
        type: "fire",
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
  },

    // Frigid Blade (Valda's Spire of Secrets: Player Pack 2)
  // Mechanic: weapon die steps up 1 tier; uses spellcasting mod for attack/damage.
  //           Extra Cold damage scales at lv5/11/17.
    frigid_blade: {
    id: "frigid_blade",
    name: "Frigid Blade",
    category: {
      spellType: "cantrip",
      school: "evocation", // Valda's lists it as Evocation
      level: 0,
      classes: ["sorcerer", "warlock", "wizard"],
      source: "Valda's Spire of Secrets: Player Pack 2",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Self",
      components: "S, M (proficient melee weapon worth 1+ CP)",
      duration: "Instantaneous",
    },
    interaction: {
      type: "weapon_based",
      useSpellcastingMod: true,
      
    },
    damage: [
      {
        // Base: weapon die stepped up by 1 (d4→d6, d6→d8, d8→d10, d10→d12/2d6)
        dice: "weapon+1step",
        type: "choice",
        typeChoices: ["cold", "weapon"],
        isBase: true,
        condition: "Choose Cold or the weapon's normal damage type",
      },
    ],
    cantripScale: {
      // Cantrip Upgrade: extra COLD damage at lv5/11/17
      tiers: [
        { minLevel: 1, totalDice: "0d6" },
        { minLevel: 5, totalDice: "1d6" },
        { minLevel: 11, totalDice: "2d6" },
        { minLevel: 17, totalDice: "3d6" },
      ],
      scaleMode: "add_dice",
      extraDamageType: "cold",
    },
    mechanics: [
      {
        kind: "weapon_step_upgrade",
        steps: 1,
        
      },
    ],
    isManualOverride: true,
    notes:
      "Weapon die steps up 1 tier. Attack and damage use spellcasting modifier instead of STR/DEX. Extra Cold damage from cantrip upgrade stacks on top of base weapon damage.",
  },

  // Light (Player's Handbook 2024, pg. 292)
  light: {
    id: "light",
    name: "Light",
    category: {
      spellType: "cantrip",
      school: "evocation",
      level: 0,
      classes: ["artificer", "bard", "cleric", "sorcerer", "wizard", "warlock"],
      source: "Player's Handbook (2024), pg. 292",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Touch",
      components: "V, M (a firefly or phosphorescent moss)",
      duration: "1 hour",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Target one Large-or-smaller object not worn or carried by someone else. It sheds Bright Light for 20 feet and Dim Light for another 20 feet; choose the light's color. Opaque cover blocks the light, and recasting ends the previous casting.",
    ],
    isManualOverride: true,
    notes:
      "Warlock access is limited to the Celestial Patron; apply the light radius to the selected token/object manually.",
  },

    // Ray of Frost (PHB, pg. 271)
    ray_of_frost: {
    id: "ray_of_frost",
    name: "Ray of Frost",
    category: {
      spellType: "cantrip",
      school: "evocation",
      level: 0,
      classes: ["sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 311",
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
      type: "spell_attack",
    },
    damage: [
      {
        dice: "1d8",
        type: "cold",
        isBase: true,
      },
    ],
    cantripScale: {
      tiers: [
        { minLevel: 1, totalDice: "1d8" },
        { minLevel: 5, totalDice: "2d8" },
        { minLevel: 11, totalDice: "3d8" },
        { minLevel: 17, totalDice: "4d8" },
      ],
      scaleMode: "replace",
    },
    isManualOverride: true,
    notes:
      "On hit, target's speed is reduced by 10 ft. until the start of your next turn.",
  },

  // Sacred Flame (Player's Handbook 2024, pg. 313)
  sacred_flame: {
    id: "sacred_flame",
    name: "Sacred Flame",
    category: {
      spellType: "cantrip",
      school: "evocation",
      level: 0,
      classes: ["cleric", "warlock"],
      source: "Player's Handbook (2024), pg. 313",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "60 ft.",
      components: "V, S",
      duration: "Instantaneous",
    },
    interaction: { type: "save", saveAbility: "DEX" },
    damage: [{ dice: "1d8", type: "radiant", isBase: true }],
    cantripScale: {
      tiers: [
        { minLevel: 1, totalDice: "1d8" },
        { minLevel: 5, totalDice: "2d8" },
        { minLevel: 11, totalDice: "3d8" },
        { minLevel: 17, totalDice: "4d8" },
      ],
      scaleMode: "replace",
    },
    isManualOverride: true,
    notes:
      "The target gains no benefit from Half Cover or Three-Quarters Cover for this Dexterity save. Warlock access is limited to the Celestial Patron.",
  },

    // Shocking Grasp (PHB, pg. 275)
    shocking_grasp: {
    id: "shocking_grasp",
    name: "Shocking Grasp",
    category: {
      spellType: "cantrip",
      school: "evocation",
      level: 0,
      classes: ["sorcerer", "wizard", "artificer"],
      source: "Player's Handbook (2024), pg. 316",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Touch",
      components: "V, S",
      duration: "Instantaneous",
    },
    interaction: {
      type: "melee_spell_attack",
    },
    damage: [
      {
        dice: "1d8",
        type: "lightning",
        isBase: true,
      },
    ],
    cantripScale: {
      tiers: [
        { minLevel: 1, totalDice: "1d8" },
        { minLevel: 5, totalDice: "2d8" },
        { minLevel: 11, totalDice: "3d8" },
        { minLevel: 17, totalDice: "4d8" },
      ],
      scaleMode: "replace",
    },
    isManualOverride: true,
    notes:
      "Advantage on attack if target is wearing metal armor. On hit, target can't take reactions until its next turn.",
  },

    // Sorcerous Burst (PHB 2024, pg. 318)
  // Mechanic: exploding dice — roll max (8) → add 1d8, capped by spell mod
    sorcerous_burst: {
    id: "sorcerous_burst",
    name: "Sorcerous Burst",
    category: {
      spellType: "cantrip",
      school: "evocation",
      level: 0,
      classes: ["sorcerer"],
      source: "Player's Handbook (2024), pg. 318",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "120 ft.",
      components: "V, S",
      duration: "Instantaneous",
    },
    interaction: {
      type: "spell_attack",
      
    },
    damage: [
      {
        dice: "1d8",
        type: "choice",
        typeChoices: [
          "acid",
          "cold",
          "fire",
          "lightning",
          "poison",
          "psychic",
          "thunder",
        ],
        isBase: true,
      },
    ],
    cantripScale: {
      tiers: [
        { minLevel: 1, totalDice: "1d8" },
        { minLevel: 5, totalDice: "2d8" },
        { minLevel: 11, totalDice: "3d8" },
        { minLevel: 17, totalDice: "4d8" },
      ],
      scaleMode: "replace",
    },
    mechanics: [
      {
        kind: "exploding",
        triggerValue: 8,
        addDice: "1d8",
        maxExtra: "spellcastingMod",
        
      },
    ],
    isManualOverride: true,
    notes:
      "Exploding Dice: rolling an 8 adds another 1d8. Maximum extra dice = spellcasting modifier.",
  },

  // Starry Wisp (Player's Handbook 2024, pg. 320)
  starry_wisp: {
    id: "starry_wisp",
    name: "Starry Wisp",
    category: {
      spellType: "cantrip",
      school: "evocation",
      level: 0,
      classes: ["bard", "cleric", "druid"],
      source: "Player's Handbook (2024), pg. 320",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "60 ft.",
      components: "V, S",
      duration: "Instantaneous",
    },
    interaction: { type: "spell_attack" },
    damage: [{ dice: "1d8", type: "radiant", isBase: true }],
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
      "On a hit, the target emits Dim Light in a 10-foot radius and cannot benefit from the Invisible condition until the end of your next turn.",
    ],
    isManualOverride: true,
    notes:
      "Cleric access is limited to the Astral Domain; Druid access includes the Circle of the Moon. Track the light and Invisible interaction through the target's next turn.",
  },

  // Thunderclap (Player's Handbook 2024, pg. 333)
  thunderclap: {
    id: "thunderclap",
    name: "Thunderclap",
    category: {
      spellType: "cantrip",
      school: "evocation",
      level: 0,
      classes: ["artificer", "bard", "druid", "sorcerer", "warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 333",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Self (5-ft. Emanation)",
      components: "S",
      duration: "Instantaneous",
    },
    area: { shape: "Sphere", sizeFeet: 5 },
    interaction: { type: "save", saveAbility: "CON" },
    damage: [{ dice: "1d6", type: "thunder", isBase: true }],
    cantripScale: {
      tiers: [
        { minLevel: 1, totalDice: "1d6" },
        { minLevel: 5, totalDice: "2d6" },
        { minLevel: 11, totalDice: "3d6" },
        { minLevel: 17, totalDice: "4d6" },
      ],
      scaleMode: "replace",
    },
    effectNotes: ["The thunderous sound can be heard up to 100 feet away."],
    isManualOverride: true,
    notes:
      "Each creature in the 5-foot Emanation originating from you makes a Constitution save. Emanation targeting is currently described for manual resolution rather than auto-previewed.",
  },

  // Vengeful Blade
  vengeful_blade: {
    id: "vengeful_blade",
    name: "Vengeful Blade",
    category: {
      spellType: "cantrip",
      school: "evocation",
      level: 0,
      classes: ["sorcerer", "warlock", "wizard"],
      source: "Grim Hollow / Homebrew",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Self (5-ft. radius)",
      components: "S, M (proficient melee weapon worth 1+ CP)",
      duration: "1 round",
    },
    interaction: {
      type: "weapon_based",
      useSpellcastingMod: false,
      weaponAttack: { meleeRangeFeet: 5 },
    },
    damage: [
      {
        dice: "weapon",
        type: "weapon",
        isBase: true,
        condition: "Normal melee weapon damage",
      },
    ],
    cantripScale: {
      tiers: [
        { minLevel: 1, totalDice: "0d8" },
        { minLevel: 5, totalDice: "1d8" },
        { minLevel: 11, totalDice: "2d8" },
        { minLevel: 17, totalDice: "3d8" },
      ],
      scaleMode: "add_dice",
      extraDamageType: "necrotic",
    },
    mechanics: [
      {
        kind: "conditional_trigger",
        triggerCondition: "action_attack_or_cast",
        conditionDesc:
          "Target attacks or casts a spell before the start of caster's next turn",
        damageDice: "2d8",
        damageType: "necrotic",
        duration: "start_of_caster_next_turn",
        cantripScaleTiers: [
          { minLevel: 1, totalDice: "2d8" },
          { minLevel: 5, totalDice: "2d8" },
          { minLevel: 11, totalDice: "3d8" },
          { minLevel: 17, totalDice: "4d8" },
        ],
      },
    ],
    effectNotes: [
      "Make a melee weapon attack. On hit, target suffers normal weapon damage.",
      "If the target makes an attack roll or casts a spell before the start of your next turn, it takes Necrotic damage.",
    ],
    isManualOverride: true,
  },

  // Word of Radiance (Player's Handbook 2024, pg. 343)
  word_of_radiance: {
    id: "word_of_radiance",
    name: "Word of Radiance",
    category: {
      spellType: "cantrip",
      school: "evocation",
      level: 0,
      classes: ["cleric"],
      source: "Player's Handbook (2024), pg. 343",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Self (5-ft. Emanation)",
      components: "V, M (a sunburst token)",
      duration: "Instantaneous",
    },
    interaction: { type: "save", saveAbility: "CON" },
    damage: [{ dice: "1d6", type: "radiant", isBase: true }],
    cantripScale: {
      tiers: [
        { minLevel: 1, totalDice: "1d6" },
        { minLevel: 5, totalDice: "2d6" },
        { minLevel: 11, totalDice: "3d6" },
        { minLevel: 17, totalDice: "4d6" },
      ],
      scaleMode: "replace",
    },
    isManualOverride: true,
    notes:
      "Each creature of your choice that you can see in the 5-foot Emanation makes a Constitution save. Emanation targeting is currently resolved manually.",
  },
};
