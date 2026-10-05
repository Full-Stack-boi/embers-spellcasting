/**
 * Manual Spell Formula Overrides — Evocation (Leveled Spells 1st–9th)
 */

import type { SpellFormula } from "../../../types/spellFormula";

export const evocationSpellOverrides: Record<string, SpellFormula> = {
    // Level 1 (12 spells)
      // Burning Hands (PHB, pg. 220) — Evocation
    burning_hands: {
    id: "burning_hands",
    name: "Burning Hands",
    category: {
      spellType: "spell",
      school: "evocation",
      level: 1,
      classes: ["sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 248",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Self (15-ft. cone)",
      components: "V, S",
      duration: "Instantaneous",
    },
    area: { shape: "Cone", sizeFeet: 15 },
    interaction: {
      type: "save",
      saveAbility: "DEX",
    },
    damage: [
      {
        dice: "3d6",
        type: "fire",
        isBase: true,
      },
    ],
    upcasting: {
      notes: "+1d6 per slot level above 1st",
      perSlotLevel: { dice: "1d6", type: "fire" },
    },
    isManualOverride: true,
    notes: "DEX save. On failed save: full damage. On success: half damage.",
  },

  // Chromatic Orb (D&D Free Rules 2024, Spell Descriptions)
  chromatic_orb: {
    id: "chromatic_orb",
    name: "Chromatic Orb",
    category: {
      spellType: "spell",
      school: "evocation",
      level: 1,
      classes: ["sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 249",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "90 ft.",
      components: "V, S, M (a diamond worth 50+ GP)",
      duration: "Instantaneous",
    },
    interaction: { type: "spell_attack" },
    damage: [
      {
        dice: "3d8",
        type: "choice",
        typeChoices: ["acid", "cold", "fire", "lightning", "poison", "thunder"],
        isBase: true,
      },
    ],
    upcasting: {
      notes:
        "+1d8 damage and one additional possible leap for each slot level above 1st",
      perSlotLevel: { dice: "1d8", type: "choice" },
    },
    effectNotes: [
      "Choose Acid, Cold, Fire, Lightning, Poison, or Thunder damage. On a hit, if two or more d8s show the same number, the orb can leap to a different target of your choice within 30 feet; make another attack and damage roll.",
      "The orb can leap only once with a 1st-level slot. A creature can be targeted only once by this casting.",
    ],
    isManualOverride: true,
    notes:
      "Choose damage type and resolve matching-die leap(s) manually. The extra-die upcast and maximum leap count both use the slot level.",
  },

  divine_smite: {
    id: "divine_smite",
    name: "Divine Smite",
    category: {
      spellType: "spell",
      school: "evocation",
      level: 1,
      classes: ["paladin"],
      source: "Player's Handbook (2024), pg. 265",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 bonus action immediately after hitting with a Melee weapon or Unarmed Strike",
      range: "Self",
      components: "V",
      duration: "Instantaneous",
    },
    interaction: { type: "utility" },
    damage: [
      { dice: "2d8", type: "radiant", isBase: true },
      {
        dice: "1d8",
        type: "radiant",
        isBase: false,
        condition: "Target is a Fiend or Undead",
      },
    ],
    upcasting: {
      notes: "+1d8 Radiant damage per slot level above 1.",
      perSlotLevel: { dice: "1d8", type: "radiant" },
    },
    effectNotes: [
      "Cast immediately after hitting with a Melee weapon or Unarmed Strike. The target takes an extra 2d8 Radiant damage, plus 1d8 if it is a Fiend or Undead.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Confirm a qualifying hit occurred, then spend the Bonus Action and spell slot. Roll 2d8 Radiant, add 1d8 for a Fiend or Undead, and add 1d8 per slot level above 1.",
      ],
    },
    isManualOverride: true,
    notes:
      "This is a spell cast after a qualifying hit; it is not an automatic rider that triggers without spending its Bonus Action and slot.",
  },

  // Faerie Fire (D&D Free Rules 2024, Spell Descriptions)
  faerie_fire: {
    id: "faerie_fire",
    name: "Faerie Fire",
    category: {
      spellType: "spell",
      school: "evocation",
      level: 1,
      classes: ["bard", "druid"],
      source: "Player's Handbook (2024), pg. 271",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "60 ft.",
      components: "V",
      duration: "Concentration, up to 1 minute",
    },
    area: { shape: "Cube", sizeFeet: 20 },
    interaction: { type: "save", saveAbility: "DEX" },
    damage: [],
    effectNotes: [
      "Outline objects in a 20-foot Cube with a chosen blue, green, or violet light. Creatures in the Cube are outlined if they fail a Dexterity save.",
      "Outlined targets shed Dim Light in a 10-foot radius, cannot benefit from the Invisible condition, and attack rolls against them have Advantage if the attacker can see them.",
    ],
    isManualOverride: true,
    notes:
      "Place the Cube, resolve each creature's save, and track visibility, Dim Light, and Advantage manually.",
  },

  // Guiding Bolt (D&D Free Rules 2024, Spell Descriptions)
  guiding_bolt: {
    id: "guiding_bolt",
    name: "Guiding Bolt",
    category: {
      spellType: "spell",
      school: "evocation",
      level: 1,
      classes: ["cleric"],
      source: "Player's Handbook (2024), pg. 282",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "120 ft.",
      components: "V, S",
      duration: "1 round",
    },
    interaction: { type: "spell_attack" },
    damage: [{ dice: "4d6", type: "radiant", isBase: true }],
    upcasting: {
      notes: "+1d6 radiant damage per spell slot level above 1st",
      perSlotLevel: { dice: "1d6", type: "radiant" },
    },
    effectNotes: [
      "On a hit, the next attack roll against the target before the end of your next turn has Advantage.",
    ],
    isManualOverride: true,
    notes:
      "Track the next-attack Advantage rider and its expiry manually; it is not an additional damage roll.",
  },

  hellish_rebuke: {
    id: "hellish_rebuke",
    name: "Hellish Rebuke",
    category: {
      spellType: "spell",
      school: "evocation",
      level: 1,
      classes: ["warlock"],
      source: "Player's Handbook (2024), pg. 284",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "Reaction (when a creature you can see within 60 ft. damages you)",
      range: "60 ft.",
      components: "V, S",
      duration: "Instantaneous",
    },
    interaction: { type: "save", saveAbility: "DEX" },
    damage: [{ dice: "2d10", type: "fire", isBase: true }],
    upcasting: {
      notes: "+1d10 Fire damage per spell slot level above 1st",
      perSlotLevel: { dice: "1d10", type: "fire" },
    },
    effectNotes: [
      "The creature that damaged you makes a Dexterity save, taking 2d10 Fire damage on a failure or half as much on a success.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Use the Reaction only in response to damage from a creature you can see within 60 feet. Resolve its Dexterity save and full/half Fire damage.",
        "Add 1d10 Fire damage per slot level above 1st.",
      ],
    },
    isManualOverride: true,
    notes:
      "The reaction trigger requires the damaging creature to be visible and within range when the reaction is taken.",
  },

    // 1st Level
      // Magic Missile (PHB, pg. 257) — Evocation
  // Mechanic: always hits (no attack roll), 3 darts + 1 per slot above 1st
    magic_missile: {
    id: "magic_missile",
    name: "Magic Missile",
    category: {
      spellType: "spell",
      school: "evocation",
      level: 1,
      classes: ["sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 295",
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
      type: "utility", // auto-hit, no attack roll
    },
    damage: [
      {
        dice: "1d4+1",
        type: "force",
        isBase: true,
        condition: "per dart (3 darts base)",
      },
    ],
    upcasting: {
      notes: "+1 dart per slot level above 1st (base 3 darts at 1st level)",
      perSlotLevel: { dice: "1d4+1", type: "force" },
      
    },
    isManualOverride: true,
    notes:
      "Always hits — no attack roll required. Each dart deals 1d4+1 force damage. All darts can hit the same or different targets.",
  },

  searing_smite: {
    id: "searing_smite",
    name: "Searing Smite",
    category: {
      spellType: "spell",
      school: "evocation",
      level: 1,
      classes: ["paladin"],
      source: "Player's Handbook (2024), pg. 314",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "Bonus Action, taken immediately after hitting with a Melee weapon or Unarmed Strike",
      range: "Self",
      components: "V",
      duration: "1 minute",
    },
    interaction: { type: "save", saveAbility: "CON" },
    damage: [
      {
        dice: "1d6",
        type: "fire",
        isBase: true,
        condition:
          "Extra damage on hit and recurring damage at start of target turn",
      },
    ],
    upcasting: {
      notes: "+1d6 Fire damage per spell slot level above 1st",
      perSlotLevel: { dice: "1d6", type: "fire" },
    },
    effectNotes: [
      "Cast as a Bonus Action immediately after hitting a target with a Melee weapon or Unarmed Strike (no concentration in 2024 rules).",
      "Target takes an extra 1d6 Fire damage from the triggering attack.",
      "At the start of each of its turns until the spell ends (1 minute), target takes 1d6 Fire damage, then makes a Constitution saving throw. On success, spell ends.",
      "Using a Higher-Level Spell Slot: all damage (initial and recurring) increases by 1d6 for each spell slot level above 1.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Trigger on hit with melee weapon / unarmed strike; apply 1d6 (+1d6/level) Fire damage.",
        "At the start of each of target's turns, deal 1d6 (+1d6/level) Fire damage, then prompt Constitution save to end spell.",
        "Duration 1 minute without concentration.",
      ],
    },
    isManualOverride: true,
    notes:
      "Bonus Action on hit (no concentration). Deals +1d6 Fire damage on hit. At start of each target turn, deals 1d6 Fire damage, then target makes CON save to end spell. Upcasting adds +1d6 to all damage per slot level above 1.",
  },

  // Spellfire Flare (Forgotten Realms: Heroes of Faerûn, pg. 146)
  spellfire_flare: {
    id: "spellfire_flare",
    name: "Spellfire Flare",
    category: {
      spellType: "spell",
      school: "evocation",
      level: 1,
      classes: ["sorcerer", "wizard"],
      source: "Forgotten Realms: Heroes of Faerûn, pg. 146",
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
    damage: [
      {
        dice: "2d10",
        type: "radiant",
        isBase: true,
        condition: "Ranged spell attack ignores Half and Three-Quarters Cover",
      },
    ],
    upcasting: {
      notes:
        "Create 1 additional blast for each spell slot level above 1; can target same or different creatures with separate attack rolls.",
    },
    effectNotes: [
      "Unleash a blast of brilliant spellfire at a creature within 60 feet.",
      "Make a ranged spell attack. The target gains no benefit from Half Cover or Three-Quarters Cover.",
      "Hit: 2d10 Radiant damage.",
      "Using a Higher-Level Spell Slot: Create 1 additional blast per slot level above 1, with separate attack rolls.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Make ranged spell attack up to 60 ft (ignores Half and Three-Quarters Cover).",
        "Hit: deal 2d10 Radiant damage.",
        "Upcasting: fire 1 additional blast per slot level above 1 with separate attack rolls.",
      ],
    },
    isManualOverride: true,
    notes:
      "Forgotten Realms: Heroes of Faerûn, pg. 146. 60 ft. Ranged spell attack ignores Half and 3/4 Cover. Hit: 2d10 Radiant. Upcast +1 blast per slot level.",
  },

  thunderous_smite: {
    id: "thunderous_smite",
    name: "Thunderous Smite",
    category: {
      spellType: "spell",
      school: "evocation",
      level: 1,
      classes: ["paladin"],
      source: "Player's Handbook (2024), pg. 334",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 bonus action",
      range: "Self",
      components: "V",
      duration: "Instantaneous",
    },
    interaction: { type: "save", saveAbility: "STR" },
    damage: [{ dice: "2d6", type: "thunder", isBase: true }],
    upcasting: {
      perSlotLevel: { dice: "1d6", type: "thunder" },
      notes: "+1d6 Thunder damage per slot level above 1st",
    },
    effectNotes: [
      "You cast this spell immediately after you hit a creature with a melee weapon or an Unarmed Strike.",
      "The attack rings with thunder that is audible within 300 feet. The target takes an extra 2d6 Thunder damage and must make a Strength saving throw.",
      "On a failed save, the target is pushed 10 feet away from you and has the Prone condition.",
      "Using a Higher-Level Spell Slot: The extra damage increases by 1d6 for each spell slot level above 1.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Cast as Bonus Action immediately after melee hit.",
        "Apply 2d6 Thunder damage (audible 300 ft).",
        "Prompt Strength save.",
        "On failed save: push target 10 ft away and apply Prone condition.",
      ],
    },
    isManualOverride: true,
    notes:
      "Player's Handbook (2024). Marked for detailed verification against printed book/DDB. In 2024, Bonus Action on hit; concentration removed entirely. Deals 2d6 Thunder; pushes 10 ft and knocks Prone on failed STR save.",
  },

  // Thunderwave (D&D Free Rules 2024, Spell Descriptions)
  thunderwave: {
    id: "thunderwave",
    name: "Thunderwave",
    category: {
      spellType: "spell",
      school: "evocation",
      level: 1,
      classes: ["bard", "druid", "sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 334",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Self (15-ft. Cube)",
      components: "V, S",
      duration: "Instantaneous",
    },
    area: { shape: "Cube", sizeFeet: 15 },
    interaction: { type: "save", saveAbility: "CON" },
    damage: [{ dice: "2d8", type: "thunder", isBase: true }],
    upcasting: {
      notes: "+1d8 thunder damage per spell slot level above 1st",
      perSlotLevel: { dice: "1d8", type: "thunder" },
    },
    effectNotes: [
      "Each creature in the Cube makes a Constitution save, taking full damage on a failed save or half on a success. A creature that fails is pushed 10 feet away from you.",
      "Unsecured objects entirely in the Cube are also pushed 10 feet away, and the boom is audible within 300 feet.",
    ],
    isManualOverride: true,
    notes:
      "Position the 15-foot Cube and resolve the push, objects, and audible boom manually.",
  },

  witch_bolt: {
    id: "witch_bolt",
    name: "Witch Bolt",
    category: {
      spellType: "spell",
      school: "evocation",
      level: 1,
      classes: ["sorcerer", "warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 343",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "60 ft.",
      components:
        "V, S, M (a twig from a tree that has been struck by lightning)",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "spell_attack" },
    damage: [{ dice: "2d12", type: "lightning", isBase: true }],
    upcasting: {
      perSlotLevel: { dice: "1d12", type: "lightning" },
      notes: "+1d12 initial Lightning damage per slot level above 1st",
    },
    effectNotes: [
      "A beam of crackling energy lances toward a creature within range. Make a ranged spell attack against the target.",
      "On a hit, the target takes 2d12 Lightning damage.",
      "On each of your subsequent turns for the duration, you can use a Bonus Action to automatically deal 1d12 Lightning damage to the target (even if the initial attack missed).",
      "The spell ends early if the target ever has Total Cover from you or is outside the spell's 60-foot range.",
      "Using a Higher-Level Spell Slot: The initial damage increases by 1d12 for each spell slot level above 1.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Target creature within 60 ft, make ranged spell attack.",
        "On hit, apply 2d12 Lightning damage (+1d12 per slot level above 1).",
        "On subsequent turns, use Bonus Action to apply 1d12 Lightning damage automatically.",
        "Ends if target has Total Cover or moves beyond 60 ft.",
      ],
    },
    isManualOverride: true,
    notes:
      "Player's Handbook (2024). Marked for detailed verification against printed book/DDB. Heavily buffed in 2024: initial damage 2d12; subsequent damage 1d12 requires only a Bonus Action (not an Action), and can trigger even after initial miss.",
  },

    // Level 2 (9 spells)
    // Continual Flame (D&D Free Rules 2024, Spell Descriptions)
  continual_flame: {
    id: "continual_flame",
    name: "Continual Flame",
    category: {
      spellType: "spell",
      school: "evocation",
      level: 2,
      classes: ["cleric", "druid", "wizard"],
      source: "Player's Handbook (2024), pg. 256",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Touch",
      components: "V, S, M (ruby dust worth 50+ GP, consumed)",
      duration: "Until dispelled",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "A touched object emits Bright Light in a 20-foot radius and Dim Light for an additional 20 feet. The flame creates no heat, consumes no fuel, and can be covered or hidden but not smothered or quenched.",
    ],
    isManualOverride: true,
    notes:
      "Track the light source and its areas manually; the ruby dust is consumed by casting.",
  },

  // Darkness (D&D Free Rules 2024, Spell Descriptions)
  darkness: {
    id: "darkness",
    name: "Darkness",
    category: {
      spellType: "spell",
      school: "evocation",
      level: 2,
      classes: ["sorcerer", "warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 260",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "60 ft.",
      components: "V, M (bat fur and a piece of coal)",
      duration: "Concentration, up to 10 minutes",
    },
    interaction: { type: "utility" },
    area: { shape: "Sphere", sizeFeet: 15 },
    damage: [],
    effectNotes: [
      "Magical Darkness fills a 15-foot-radius Sphere. Darkvision cannot see through it, and nonmagical light cannot illuminate it.",
      "Alternatively, center a 15-foot Emanation on an object that isn't being worn or carried; covering that object with something opaque blocks the Darkness. Overlapping Bright or Dim Light created by a spell of level 2 or lower is dispelled.",
    ],
    isManualOverride: true,
    notes:
      "Place the Sphere or mark the source object; resolve line of sight, covering, and spell-light overlap manually.",
  },

  // Flame Blade (D&D Free Rules 2024, Spell Descriptions)
  flame_blade: {
    id: "flame_blade",
    name: "Flame Blade",
    category: {
      spellType: "spell",
      school: "evocation",
      level: 2,
      classes: ["druid", "sorcerer"],
      source: "Player's Handbook (2024), pg. 275",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 bonus action",
      range: "Self",
      components: "V, S, M (a sumac leaf)",
      duration: "Concentration, up to 10 minutes",
    },
    interaction: { type: "melee_spell_attack" },
    damage: [{ dice: "3d6", type: "fire", isBase: true }],
    upcasting: {
      notes: "+1d6 fire damage per slot level above 2nd.",
      perSlotLevel: { dice: "1d6", type: "fire" },
    },
    effectNotes: [
      "Create a fiery blade in a free hand. As a Magic action, make a melee spell attack; on a hit it deals 3d6 + your spellcasting ability modifier Fire damage. The blade sheds Bright Light 10 feet and Dim Light for another 10 feet.",
      "If released, the blade disappears and can be evoked again as a Bonus Action.",
    ],
    isManualOverride: true,
    notes:
      "Casting creates the blade but does not make its attack. Make the attack with a later Magic action; track concentration and the light.",
  },

  // Gust of Wind (D&D Free Rules 2024, Spell Descriptions)
  gust_of_wind: {
    id: "gust_of_wind",
    name: "Gust of Wind",
    category: {
      spellType: "spell",
      school: "evocation",
      level: 2,
      classes: ["druid", "ranger", "sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 282",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Self (60-ft. Line)",
      components: "V, S, M (a legume seed)",
      duration: "Concentration, up to 1 minute",
    },
    area: { shape: "Line", sizeFeet: 60 },
    interaction: { type: "save", saveAbility: "STR" },
    damage: [],
    effectNotes: [
      "A 60-foot-long, 10-foot-wide Line pushes creatures that fail a Strength save 15 feet away from you; a creature ending its turn in the Line repeats the save. Moving closer to you through it costs 2 feet of movement per foot.",
      "The wind disperses gas or vapor and affects flames. On later turns, you can use a Bonus Action to change the Line's direction.",
    ],
    isManualOverride: true,
    notes:
      "Track the Line's direction, affected creatures, repeat saves, forced movement, and ongoing terrain/flame interactions manually.",
  },

  melfs_acid_arrow: {
    id: "melfs_acid_arrow",
    name: "Melf's Acid Arrow",
    category: {
      spellType: "spell",
      school: "evocation",
      level: 2,
      classes: ["wizard"],
      source: "Player's Handbook (2024), pg. 297",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "90 ft.",
      components: "V, S, M (powdered rhubarb leaf)",
      duration: "Instantaneous",
    },
    interaction: { type: "spell_attack" },
    damage: [
      { dice: "4d4", type: "acid", isBase: true },
      {
        dice: "2d4",
        type: "acid",
        isBase: false,
        condition: "At the end of the target's next turn on a hit",
      },
    ],
    upcasting: {
      notes:
        "+1d4 initial damage and +1d4 delayed damage per spell slot level above 2nd",
      perSlotLevel: { dice: "1d4", type: "acid" },
    },
    effectNotes: [
      "Make a ranged spell attack against a target within 90 feet.",
      "On a hit: Target takes 4d4 Acid damage immediately and 2d4 Acid damage at the end of its next turn.",
      "On a miss: Target takes half of the initial damage only (2d4 Acid damage) and no delayed damage.",
      "Upcasting: Both initial and delayed damage increase by 1d4 for each slot level above 2.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Make a ranged spell attack roll against the target.",
        "On hit: apply 4d4 (+1d4/upcast level) Acid damage immediately, and track 2d4 (+1d4/upcast level) Acid damage to resolve at the end of its next turn.",
        "On miss: apply half of the initial damage (2d4 Acid base) only.",
      ],
    },
    isManualOverride: true,
    notes:
      "Deals delayed acid damage at the end of the target's next turn on a hit. On a miss, still deals half of the initial damage.",
  },

  // Moonbeam (Player's Handbook 2024, pg. 300)
  moonbeam: {
    id: "moonbeam",
    name: "Moonbeam",
    category: {
      spellType: "spell",
      school: "evocation",
      level: 2,
      classes: ["druid"],
      source: "Player's Handbook (2024), pg. 300",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "120 ft.",
      components: "V, S, M (a moonseed leaf)",
      duration: "Concentration, up to 1 minute",
    },
    area: { shape: "Sphere", sizeFeet: 5 },
    interaction: { type: "save", saveAbility: "CON" },
    damage: [{ dice: "2d10", type: "radiant", isBase: true }],
    upcasting: {
      notes: "+1d10 radiant damage per slot level above 2nd.",
      perSlotLevel: { dice: "1d10", type: "radiant" },
    },
    effectNotes: [
      "A 5-foot-radius, 40-foot-high Cylinder sheds Dim Light. Creatures make a Constitution save when it appears, when the area moves into their space, when they enter it, or end their turn there; a creature is affected at most once per turn. Failed save: 2d10 Radiant damage; success: half damage.",
      "A shape-shifted creature that fails the save reverts to its true form and cannot shape-shift again until it leaves the Cylinder. On later turns, moving the Cylinder up to 60 feet costs a Magic action.",
    ],
    isManualOverride: true,
    notes:
      "Track the Cylinder, concentration, once-per-turn save triggers, half damage on success, and the shape-shifting exception.",
  },

  scorching_ray: {
    id: "scorching_ray",
    name: "Scorching Ray",
    category: {
      spellType: "spell",
      school: "evocation",
      level: 2,
      classes: ["sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 314",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "120 ft.",
      components: "V, S",
      duration: "Instantaneous",
    },
    interaction: { type: "spell_attack" },
    damage: [
      {
        dice: "2d6",
        type: "fire",
        isBase: true,
        condition: "Per ray (3 rays base)",
      },
    ],
    upcasting: {
      notes: "+1 ray (2d6 Fire) per spell slot level above 2nd",
      perSlotLevel: { dice: "2d6", type: "fire" },
    },
    effectNotes: [
      "Hurl three fiery rays at one target or several within 120 feet. Make a separate ranged spell attack for each ray.",
      "Each ray that hits deals 2d6 Fire damage.",
      "Using a Higher-Level Spell Slot: create one additional ray for each spell slot level above 2.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Assign 3 rays (+1 per upcast level) to targets within 120 feet.",
        "Roll separate ranged spell attack per ray and apply 2d6 Fire damage on hit.",
      ],
    },
    isManualOverride: true,
    notes:
      "120 ft range. Hurl 3 rays (+1 per slot level above 2). Separate ranged spell attack roll per ray, dealing 2d6 Fire damage each on hit.",
  },

    // Shatter (PHB, pg. 275) — Evocation
    shatter: {
    id: "shatter",
    name: "Shatter",
    category: {
      spellType: "spell",
      school: "evocation",
      level: 2,
      classes: ["bard", "sorcerer", "warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 316",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "60 ft.",
      components: "V, S, M (a chip of mica)",
      duration: "Instantaneous",
    },
    area: { shape: "Sphere", sizeFeet: 10 },
    interaction: {
      type: "save",
      saveAbility: "CON",
    },
    damage: [
      {
        dice: "3d8",
        type: "thunder",
        isBase: true,
      },
    ],
    upcasting: {
      notes: "+1d8 per slot level above 2nd",
      perSlotLevel: { dice: "1d8", type: "thunder" },
    },
    isManualOverride: true,
    notes:
      "CON save. Inorganic objects, constructs, and objects made of metal or stone have disadvantage on the save.",
  },

  // Spiritual Weapon (D&D Free Rules 2024, Spell Descriptions)
  spiritual_weapon: {
    id: "spiritual_weapon",
    name: "Spiritual Weapon",
    category: {
      spellType: "spell",
      school: "evocation",
      level: 2,
      classes: ["cleric"],
      source: "Player's Handbook (2024), pg. 318",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "Bonus Action",
      range: "60 ft.",
      components: "V, S",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "spell_attack" },
    damage: [
      {
        dice: "1d8",
        type: "force",
        isBase: true,
        condition: "plus your spellcasting ability modifier on a hit",
      },
    ],
    upcasting: {
      notes: "+1d8 force damage for each slot level above 2nd",
      perSlotLevel: { dice: "1d8", type: "force" },
    },
    effectNotes: [
      "Create a spectral force resembling a weapon in a space within range and immediately make a melee spell attack against a creature within 5 feet of it.",
      "On later turns, you can use a Bonus Action to move it up to 20 feet and repeat the attack against a creature within 5 feet.",
    ],
    isManualOverride: true,
    notes:
      "Track the weapon's position, its 5-foot reach, and later Bonus Action attacks manually; add your spellcasting ability modifier to hit damage.",
  },

    // Level 3 (9 spells)
    blinding_smite: {
    id: "blinding_smite",
    name: "Blinding Smite",
    category: {
      spellType: "spell",
      school: "evocation",
      level: 3,
      classes: ["paladin"],
      source: "Player's Handbook (2024), pg. 247",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 bonus action",
      range: "Self",
      components: "V",
      duration: "1 minute",
    },
    interaction: { type: "save", saveAbility: "CON" },
    damage: [
      {
        dice: "3d8",
        type: "radiant",
        isBase: true,
        condition:
          "Immediately after hitting a creature with a weapon or Unarmed Strike",
      },
    ],
    upcasting: {
      notes: "+1d8 Radiant damage per spell slot level above 3rd",
      perSlotLevel: { dice: "1d8", type: "radiant" },
    },
    effectNotes: [
      "Cast as a Bonus Action immediately after hitting a creature with a weapon or an Unarmed Strike. The target takes an extra 3d8 Radiant damage and has the Blinded condition.",
      "At the end of each of its turns, the target makes a Constitution saving throw, ending the spell on a success.",
      "Using a Higher-Level Spell Slot: The extra damage increases by 1d8 for each spell slot level above 3.",
      "In 2024, Blinding Smite no longer requires concentration.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Cast as Bonus Action upon weapon/unarmed hit.",
        "Deal 3d8 Radiant damage (+1d8 per slot level above 3).",
        "Inflict Blinded condition on target (no concentration required).",
        "Prompt Constitution save at end of each of target's turns to end blindness.",
      ],
    },
    isManualOverride: true,
    notes:
      "Player's Handbook (2024). Marked for detailed verification against printed book/DDB. In 2024, no longer requires concentration! Bonus Action on hit, deals 3d8 Radiant damage (+1d8 upcast) and inflicts Blinded until CON save at turn end.",
  },

  cacophonic_shield: {
    id: "cacophonic_shield",
    name: "Cacophonic Shield",
    category: {
      spellType: "spell",
      school: "evocation",
      level: 3,
      classes: ["bard", "sorcerer", "wizard"],
      source: "Forgotten Realms: Heroes of Faerûn, pg. 143",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Self",
      components: "V, S",
      duration: "Concentration, up to 10 minutes",
    },
    interaction: { type: "save", saveAbility: "CON" },
    area: { shape: "Emanation", sizeFeet: 10 },
    damage: [
      {
        dice: "3d6",
        type: "thunder",
        isBase: true,
        condition:
          "On entering space, entering area, or ending turn there (CON save half)",
      },
    ],
    upcasting: {
      perSlotLevel: { dice: "1d6", type: "thunder" },
      notes: "+1d6 Thunder damage per slot level above 3rd",
    },
    effectNotes: [
      "Thunderous reverberations fill a 10-foot Emanation around you for up to 10 minutes with concentration.",
      "You can designate creatures to be unaffected when you cast the spell.",
      "Caster benefits: Resistance to Thunder damage, and ranged attack rolls against you are made with Disadvantage.",
      "When the Emanation enters a creature's space, or a creature enters it or ends its turn there (once per turn): CON save or 3d6 Thunder damage and Deafened until your next turn (half damage and not Deafened on save).",
      "Using a Higher-Level Spell Slot: Damage increases by 1d6 per slot level above 3.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Place 10-ft Emanation on caster.",
        "Grant caster Thunder resistance and impose Disadvantage on ranged attacks against caster.",
        "When entering creature space, or creature enters/ends turn there (once per turn): prompt CON save vs 3d6 Thunder (+1d6/level, half on save) and apply Deafened on failure.",
      ],
    },
    isManualOverride: true,
    notes:
      "Forgotten Realms: Heroes of Faerûn, pg. 143. 10-ft Emanation, conc up to 10 min. Caster gets Thunder resistance and ranged attacks against caster have Disadvantage. Hostiles make CON save vs 3d6 Thunder + Deafened (half on save). Upcasts +1d6/level.",
  },

  crusaders_mantle: {
    id: "crusaders_mantle",
    name: "Crusader's Mantle",
    category: {
      spellType: "spell",
      school: "evocation",
      level: 3,
      classes: ["paladin"],
      source: "Player's Handbook (2024), pg. 259",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Self (30-foot Emanation)",
      components: "V",
      duration: "Concentration, up to 1 minute",
    },
    area: { shape: "Emanation", sizeFeet: 30 },
    damage: [{ dice: "1d4", type: "radiant", isBase: true }],
    effectNotes: [
      "Holy power radiates from you in an aura with a 30-foot Emanation.",
      "Until the spell ends, you and your allies within the area deal an extra 1d4 Radiant damage when hitting with a weapon attack or an Unarmed Strike.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Place 30-ft Emanation on caster.",
        "Allies within area add 1d4 Radiant damage on hit with weapon or unarmed strikes.",
      ],
    },
    isManualOverride: true,
    notes:
      "Player's Handbook (2024). Marked for detailed verification against printed book/DDB. In 2024, explicitly includes Unarmed Strikes and standardizes area as a 30-ft Emanation.",
  },

  daylight: {
    id: "daylight",
    name: "Daylight",
    category: {
      spellType: "spell",
      school: "evocation",
      level: 3,
      classes: ["cleric", "druid", "paladin", "ranger", "sorcerer"],
      source: "Player's Handbook (2024), pg. 260",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "60 ft.",
      components: "V, S",
      duration: "1 hour",
    },
    interaction: { type: "utility" },
    area: { shape: "Sphere", sizeFeet: 60 },
    damage: [],
    effectNotes: [
      "Sunlight fills a 60-foot-radius Sphere centered on a point within range, creating Bright Light and Dim Light for an additional 60 feet. Alternatively, cast it on an unattended object to create a 60-foot Emanation from it; covering the object with something opaque blocks the light.",
      "Overlapping areas dispel Darkness created by a spell of level 3 or lower.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Choose a point or eligible unattended object and track the light area for 1 hour. Resolve overlap with lower-level Darkness and opaque cover manually; the Sphere preview does not model the alternate Emanation mode.",
      ],
    },
    isManualOverride: true,
    notes:
      "The spell creates sunlight; track the chosen point or object and its light area, including whether opaque cover blocks an object-centered effect.",
  },

    // 3rd Level
      // Fireball (PHB, pg. 241) — Evocation
    fireball: {
    id: "fireball",
    name: "Fireball",
    category: {
      spellType: "spell",
      school: "evocation",
      level: 3,
      classes: ["sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 274",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "150 ft. (20-ft. radius sphere)",
      components: "V, S, M (a tiny ball of bat guano and sulfur)",
      duration: "Instantaneous",
    },
    area: { shape: "Sphere", sizeFeet: 20 },
    interaction: {
      type: "save",
      saveAbility: "DEX",
    },
    damage: [
      {
        dice: "8d6",
        type: "fire",
        isBase: true,
      },
    ],
    upcasting: {
      notes: "+1d6 per slot level above 3rd",
      perSlotLevel: { dice: "1d6", type: "fire" },
    },
    isManualOverride: true,
    notes:
      "DEX save. On failed save: full damage. On success: half damage. Fire spreads around corners.",
  },

  // Laeral's Silver Lance (Forgotten Realms: Heroes of Faerûn, pg. 145)
  laerals_silver_lance: {
    id: "laerals_silver_lance",
    name: "Laeral's Silver Lance",
    category: {
      spellType: "spell",
      school: "evocation",
      level: 3,
      classes: ["cleric", "sorcerer", "wizard"],
      source: "Forgotten Realms: Heroes of Faerûn, pg. 145",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Self (120-ft. line)",
      components: "V, S, M (a silver pin worth 250+ GP)",
      duration: "Instantaneous",
    },
    interaction: { type: "save", saveAbility: "STR" },
    area: { shape: "Line", sizeFeet: 120 },
    damage: [
      {
        dice: "3d10",
        type: "force",
        isBase: true,
        condition: "Failed Strength save (half damage on success, no Prone)",
      },
    ],
    upcasting: {
      perSlotLevel: { dice: "1d10", type: "force" },
      notes: "Damage increases by 1d10 for each spell slot level above 3",
    },
    effectNotes: [
      "A 120-foot-long, 5-foot-wide Line of silver energy bursts from you.",
      "Strength saving throw: each creature of your choice in the Line must make a Strength save.",
      "Failed save: takes 3d10 Force damage and gains the Prone condition.",
      "Successful save: takes half damage only.",
      "Using a Higher-Level Spell Slot: Damage increases by 1d10 per slot level above 3.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Originate 120x5 ft Line; select targets of your choice in area.",
        "Prompt Strength save for each chosen creature.",
        "Failed save: deal 3d10 Force damage and apply Prone condition.",
        "Successful save: deal half damage only.",
      ],
    },
    isManualOverride: true,
    notes:
      "Forgotten Realms: Heroes of Faerûn, pg. 145. 120x5 ft Line. Selective targets. STR save vs 3d10 Force + Prone (half on success). Upcast +1d10.",
  },

  leomunds_tiny_hut: {
    id: "leomunds_tiny_hut",
    name: "Leomund's Tiny Hut",
    category: {
      spellType: "spell",
      school: "evocation",
      level: 3,
      classes: ["bard", "cleric", "wizard"],
      source: "Player's Handbook (2024), pg. 291",
      concentration: false,
      ritual: true,
    },
    casting: {
      time: "1 minute or Ritual",
      range: "Self (10-ft. Emanation)",
      components: "V, S, M (a crystal bead)",
      duration: "8 hours",
    },
    interaction: { type: "utility" },
    area: { shape: "Sphere", sizeFeet: 10 },
    damage: [],
    effectNotes: [
      "A 10-foot stationary Emanation springs into existence around you for 8 hours. The spell fails if the area cannot encapsulate all creatures inside at casting.",
      "Creatures and objects within the Emanation when cast can move through it freely; all other creatures and objects are barred from passing through. Spells of level 3 or lower cannot be cast through it, and effects of such spells cannot extend into it.",
      "The atmosphere inside is comfortable and dry regardless of outside weather. You can command the interior to have Dim Light or Darkness (no action required). The dome is opaque from outside (color of your choice) and transparent from inside.",
      "Ends early if you leave the Emanation or cast this spell again.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Place the stationary 10-foot Emanation centered on the caster; record creatures and objects inside at casting.",
        "Allow permitted creatures/objects free movement while barring all others, as well as spells of level 3 or lower.",
        "Track interior lighting (Dim Light or Darkness). End early if the caster leaves or recasts.",
      ],
    },
    isManualOverride: true,
    notes:
      "Player's Handbook (2024), pg. 291. In 2024 rules, Tiny Hut is Evocation (formerly Abjuration) and bars spells of level 3 or lower. Ends if the caster exits.",
  },

    // Lightning Bolt (PHB, pg. 255) — Evocation
    lightning_bolt: {
    id: "lightning_bolt",
    name: "Lightning Bolt",
    category: {
      spellType: "spell",
      school: "evocation",
      level: 3,
      classes: ["sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 292",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Self (100-ft. line)",
      components:
        "V, S, M (a bit of fur and a rod of amber, crystal, or glass)",
      duration: "Instantaneous",
    },
    area: { shape: "Line", sizeFeet: 100 },
    interaction: {
      type: "save",
      saveAbility: "DEX",
    },
    damage: [
      {
        dice: "8d6",
        type: "lightning",
        isBase: true,
      },
    ],
    upcasting: {
      notes: "+1d6 per slot level above 3rd",
      perSlotLevel: { dice: "1d6", type: "lightning" },
    },
    isManualOverride: true,
    notes:
      "DEX save. 100 ft. line, 5 ft. wide. On failed save: full damage. On success: half damage.",
  },

  wind_wall: {
    id: "wind_wall",
    name: "Wind Wall",
    category: {
      spellType: "spell",
      school: "evocation",
      level: 3,
      classes: ["druid", "ranger"],
      source: "Player's Handbook (2024), pg. 341",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "120 feet",
      components: "V, S, M (a fan and a feather)",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "save", saveAbility: "STR" },
    area: { shape: "Wall", sizeFeet: 50, heightFeet: 15, thicknessFeet: 1 },
    damage: [
      {
        dice: "4d8",
        type: "bludgeoning",
        isBase: true,
        condition: "When wall appears on failed STR save (half on success)",
      },
    ],
    effectNotes: [
      "A wall of strong wind up to 50 feet long, 15 feet high, and 1 foot thick rises from the ground within 120 feet.",
      "When the wall appears, each creature in its area makes a Strength saving throw, taking 4d8 Bludgeoning damage (half on success).",
      "Keeps fog, smoke, and gases at bay.",
      "Small or smaller flying creatures/objects and gaseous creatures cannot pass through.",
      "Arrows, bolts, and ordinary projectiles launched across the wall are deflected upward and miss automatically.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Place wind wall up to 50x15x1 ft within 120 ft.",
        "Prompt STR save for creatures on appearance (4d8 Bludgeoning, half on save).",
        "Blocks small flying creatures, gases, and automatically deflects ordinary ranged projectiles passing through.",
      ],
    },
    isManualOverride: true,
    notes:
      "Concentration up to 1 min. Wall 50x15x1 ft within 120 ft. STR save on appearance for 4d8 Bludgeoning (half on save). Deflects ordinary projectiles automatically. Blocks small flying creatures, gaseous form, and gases.",
  },

    // Level 4 (6 spells)
    fire_shield: {
    id: "fire_shield",
    name: "Fire Shield",
    category: {
      spellType: "spell",
      school: "evocation",
      level: 4,
      classes: ["druid", "sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 274",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Self",
      components: "V, S, M (phosphorus or a firefly)",
      duration: "10 minutes",
    },
    interaction: { type: "utility" },
    damage: [
      {
        dice: "2d8",
        type: "fire",
        isBase: false,
        condition:
          "Warm shield; creature within 5 ft. hits caster with melee attack",
      },
      {
        dice: "2d8",
        type: "cold",
        isBase: false,
        condition:
          "Chill shield; creature within 5 ft. hits caster with melee attack",
      },
    ],
    effectNotes: [
      "Choose a warm or chill shield. Warm grants Resistance to Cold damage; chill grants Resistance to Fire damage. Whenever a creature within 5 feet hits you with a melee attack roll, it takes 2d8 Fire damage (warm) or 2d8 Cold damage (chill). You shed Bright Light in 10 feet and Dim Light for another 10 feet.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Record the chosen shield, 10-minute duration, light, and granted damage Resistance.",
        "When a creature within 5 feet hits the caster with a melee attack roll, roll the matching 2d8 damage and apply it to the attacker.",
      ],
    },
    isManualOverride: true,
    notes:
      "The retaliation triggers on a melee attack roll hit, not only on a melee weapon hit.",
  },

  fount_of_moonlight: {
    id: "fount_of_moonlight",
    name: "Fount of Moonlight",
    category: {
      spellType: "spell",
      school: "evocation",
      level: 4,
      classes: ["bard", "druid"],
      source: "Player's Handbook (2024), pg. 277",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Self",
      components: "V, S",
      duration: "Concentration, up to 10 minutes",
    },
    interaction: { type: "utility" },
    damage: [{ dice: "2d6", type: "radiant", isBase: true }],
    effectNotes: [
      "A cool light wreathes your body, shedding Bright Light in a 20-foot radius and Dim Light for an additional 20 feet.",
      "For the duration, you have Resistance to Radiant damage, and your melee attacks deal an extra 2d6 Radiant damage on a hit.",
      "Immediately after you take damage from a creature you can see within 60 feet, you can use your Reaction to force that creature to make a Constitution saving throw. On a failed save, the creature has the Blinded condition until the end of your next turn.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Apply 20-ft bright / 20-ft dim light aura to caster.",
        "Grant Radiant resistance and add 2d6 Radiant damage to melee attacks.",
        "Reaction trigger: when caster takes damage from creature <= 60 ft, prompt CON save; on failure, target is Blinded until end of caster next turn.",
      ],
    },
    isManualOverride: true,
    notes:
      "Player's Handbook (2024). Marked for detailed verification against printed book/DDB. New 2024 spell (Bard, Druid). 2d6 Radiant to melee attacks, Radiant resistance, and Reaction to Blind attackers on CON save.",
  },

  ice_storm: {
    id: "ice_storm",
    name: "Ice Storm",
    category: {
      spellType: "spell",
      school: "evocation",
      level: 4,
      classes: ["druid", "sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 287",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "300 ft. (20-ft. radius, 40-ft. high Cylinder)",
      components: "V, S, M (a mitten)",
      duration: "Instantaneous",
    },
    interaction: { type: "save", saveAbility: "DEX" },
    damage: [
      { dice: "2d10", type: "bludgeoning", isBase: true },
      { dice: "4d6", type: "cold", isBase: true },
    ],
    upcasting: {
      notes: "+1d10 Bludgeoning damage per spell slot level above 4th",
      perSlotLevel: { dice: "1d10", type: "bludgeoning" },
    },
    effectNotes: [
      "Creatures in a 20-foot-radius, 40-foot-high Cylinder make Dexterity saves, taking 2d10 Bludgeoning and 4d6 Cold damage on a failure or half of each on a success. The hailstones make ground in the Cylinder Difficult Terrain until the end of your next turn.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Aim the 20-foot-radius, 40-foot-high Cylinder within range; resolve Dexterity saves and both damage types, halving both on success.",
        "Apply Difficult Terrain to ground in the Cylinder until the end of your next turn. Upcasting adds 1d10 Bludgeoning damage per slot level above 4.",
      ],
    },
    isManualOverride: true,
    notes:
      "Upcasting increases only the Bludgeoning damage; Cold damage remains 4d6.",
  },

  // Spellfire Storm (Forgotten Realms: Heroes of Faerûn, pg. 146)
  spellfire_storm: {
    id: "spellfire_storm",
    name: "Spellfire Storm",
    category: {
      spellType: "spell",
      school: "evocation",
      level: 4,
      classes: ["sorcerer", "wizard"],
      source: "Forgotten Realms: Heroes of Faerûn, pg. 146",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "60 ft.",
      components: "V, S",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "save", saveAbility: "CON" },
    area: { shape: "Sphere", sizeFeet: 20 },
    damage: [
      {
        dice: "4d10",
        type: "radiant",
        isBase: true,
        condition:
          "Pillar of spellfire Cylinder: Constitution save when appearing, entering, or ending turn (half on success)",
      },
    ],
    upcasting: {
      perSlotLevel: { dice: "1d10", type: "radiant" },
      notes: "Damage increases by 1d10 for each spell slot level above 4",
    },
    effectNotes: [
      "Pillar of spellfire fills a 20-foot-radius, 20-foot-high Cylinder within 60 feet. Can designate creatures to be unaffected.",
      "Constitution saving throw: creature in area on appearance, entering for first time on turn, or ending turn makes save: 4d10 Radiant damage on failure, half on success (max once per turn).",
      "Spell Disruption: When a creature in the Cylinder casts a spell, it must make a Constitution save; on failure, the spell dissipates with no effect and action/bonus/reaction is wasted (slot is NOT expended).",
      "Circle Spell: With 25,000+ GP blue star sapphire (consumed) and secondary casters, range becomes 1 mile, no concentration, radius expands up to 100 ft, duration up to 24 hours.",
      "Using a Higher-Level Spell Slot: Damage increases by 1d10 per slot level above 4.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Place 20-ft radius, 20-ft high Cylinder within 60 ft; designate exempt creatures.",
        "Prompt Constitution save on appearance, entering, or ending turn (4d10 Radiant, half on success).",
        "Spell Disruption: prompt CON save when creature in area casts a spell (fails = wasted action, slot preserved).",
        "Circle casting: expands area, range to 1 mile, removes concentration, extends duration up to 24 hrs.",
      ],
    },
    isManualOverride: true,
    notes:
      "Forgotten Realms: Heroes of Faerûn, pg. 146. Conc up to 1 min (Circle up to 24 hr). 20-ft radius Cylinder within 60 ft. CON save vs 4d10 Radiant (selective). Spell disruption in area. Upcast +1d10.",
  },

  vitriolic_sphere: {
    id: "vitriolic_sphere",
    name: "Vitriolic Sphere",
    category: {
      spellType: "spell",
      school: "evocation",
      level: 4,
      classes: ["sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 337",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "150 feet",
      components: "V, S, M (a drop of bile)",
      duration: "Instantaneous",
    },
    interaction: { type: "save", saveAbility: "DEX" },
    area: { shape: "Sphere", sizeFeet: 20 },
    damage: [
      {
        dice: "10d4",
        type: "acid",
        isBase: true,
        condition: "Initial damage on failed DEX save (half on success)",
      },
      {
        dice: "5d4",
        type: "acid",
        isBase: false,
        condition: "At the end of target's next turn on failed DEX save only",
      },
    ],
    upcasting: {
      notes: "+2d4 Acid damage per slot level above 4th",
      perSlotLevel: { dice: "2d4", type: "acid" },
    },
    effectNotes: [
      "A glowing 1-foot ball of acid streaks to a point within 150 feet and explodes in a 20-foot-radius Sphere.",
      "Each creature makes a Dexterity saving throw.",
      "On a failed save, a creature takes 10d4 Acid damage and another 5d4 Acid damage at the end of its next turn.",
      "On a successful save, a creature takes half the initial damage only.",
      "Using a Higher-Level Spell Slot: Initial damage increases by 2d4 for each spell slot level above 4.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Place 20-foot-radius Sphere within 150 feet.",
        "Prompt DEX saving throw for each creature caught.",
        "On fail, apply 10d4 Acid (+2d4/level upcast) and queue 5d4 Acid at end of its next turn.",
        "On success, apply half initial damage only.",
      ],
    },
    isManualOverride: true,
    notes:
      "20-ft radius Sphere within 150 ft. DEX save: 10d4 Acid + 5d4 Acid at end of next turn (half initial damage only on save). Upcast adds +2d4 initial Acid per slot level.",
  },

  wall_of_fire: {
    id: "wall_of_fire",
    name: "Wall of Fire",
    category: {
      spellType: "spell",
      school: "evocation",
      level: 4,
      classes: ["druid", "sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 338",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "120 feet",
      components: "V, S, M (a piece of charcoal)",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "save", saveAbility: "DEX" },
    area: { shape: "Wall", sizeFeet: 60, heightFeet: 20, thicknessFeet: 1 },
    damage: [
      {
        dice: "5d8",
        type: "fire",
        isBase: true,
        condition:
          "On appearance (DEX save half) and when entering or ending turn within 10 ft of selected damaging side",
      },
    ],
    upcasting: {
      notes: "+1d8 Fire damage per slot level above 4th",
      perSlotLevel: { dice: "1d8", type: "fire" },
    },
    effectNotes: [
      "Create an opaque wall of fire up to 60 feet long, 20 feet high, and 1 foot thick, or a ringed wall up to 20 feet in diameter, 20 feet high, and 1 foot thick.",
      "When the wall appears, each creature in its area makes a Dexterity saving throw, taking 5d8 Fire damage (half on success).",
      "One chosen side deals 5d8 Fire damage to each creature ending its turn within 10 feet of that side or inside the wall. A creature takes the same damage when entering the wall for the first time on a turn or ending its turn there. Other side deals no damage.",
      "Using a Higher-Level Spell Slot: Damage increases by 1d8 for each spell slot level above 4.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Place wall (60x20x1 ft or 20-ft ring) within 120 ft and designate damaging side.",
        "Prompt DEX save for caught creatures on appearance (5d8 Fire, half on save).",
        "Apply 5d8 Fire when entering wall or ending turn inside / within 10 ft of damaging side.",
        "Upcast adds +1d8 Fire per slot level.",
      ],
    },
    isManualOverride: true,
    notes:
      "Concentration up to 1 min. Wall 60x20 ft or 20-ft ring. DEX save on appearance for 5d8 Fire (half on save). Chosen hot side deals 5d8 Fire within 10 ft on turn end or on entry. Upcast adds +1d8 Fire per level.",
  },

    // Level 5 (7 spells)
    // Bigby's Hand (D&D Free Rules 2024, Spell Descriptions)
  bigbys_hand: {
    id: "bigbys_hand",
    name: "Bigby's Hand",
    category: {
      spellType: "spell",
      school: "evocation",
      level: 5,
      classes: ["sorcerer", "warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 245",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "120 ft.",
      components: "V, S, M (an eggshell and a glove)",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "utility" },
    damage: [],
    upcasting: {
      notes:
        "Clenched Fist damage increases by 2d8 and Grasping Hand crush damage by 2d6 per slot level above 5.",
    },
    effectNotes: [
      "Create a Large hand in a visible unoccupied space. It has AC 20, HP equal to your HP maximum, does not occupy its space, and ends if reduced to 0 HP. When cast and as a Bonus Action later, move it up to 60 feet and choose an effect.",
      "Clenched Fist: melee spell attack within 5 feet, 5d8 Force on a hit. Forceful Hand: Strength save or push a Huge or smaller creature up to 5 feet plus 5 times your spellcasting modifier. Grasping Hand: Dexterity save or Grappled (escape DC equals spell save DC); while grappling, a Bonus Action crush deals 4d6 + spellcasting modifier Bludgeoning. Interposing Hand: grants you Half Cover against attacks/effects from or through its space, which is Difficult Terrain for enemies.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Track hand position, AC/HP, concentration, selected mode, movement, saves/attack, grapple escape DC and duration. Apply slot scaling to the relevant damage option.",
      ],
    },
    isManualOverride: true,
    notes:
      "The hand is a separate object with its own HP and position. Its four modes have distinct action, attack/save, movement and damage rules; resolve them manually.",
  },

  // Cone of Cold (D&D Free Rules 2024, Spell Descriptions)
  cone_of_cold: {
    id: "cone_of_cold",
    name: "Cone of Cold",
    category: {
      spellType: "spell",
      school: "evocation",
      level: 5,
      classes: ["druid", "sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 253",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Self (60-ft. Cone)",
      components: "V, S, M (a small crystal or glass cone)",
      duration: "Instantaneous",
    },
    area: { shape: "Cone", sizeFeet: 60 },
    interaction: { type: "save", saveAbility: "CON" },
    damage: [{ dice: "8d8", type: "cold", isBase: true }],
    upcasting: {
      notes: "+1d8 Cold damage per spell slot level above 5.",
      perSlotLevel: { dice: "1d8", type: "cold" },
    },
    effectNotes: [
      "Creatures in a 60-foot Cone originating from you make a Constitution save, taking 8d8 Cold damage on a failure or half as much on a success. A creature killed by this spell becomes a frozen statue until it thaws.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Aim the 60-foot Cone and confirm affected creatures; the current formula preview has no Cone geometry, so determine targets manually. Apply half damage on a successful save and track the frozen-statue effect for creatures killed.",
      ],
    },
    isManualOverride: true,
    notes:
      "The structured area preview currently supports Spheres only; aim this Cone and determine targets manually until Cone targeting is implemented.",
  },

  destructive_wave: {
    id: "destructive_wave",
    name: "Destructive Wave",
    category: {
      spellType: "spell",
      school: "evocation",
      level: 5,
      classes: ["paladin"],
      source: "Player's Handbook (2024), pg. 261",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Self (30-foot Emanation)",
      components: "V",
      duration: "Instantaneous",
    },
    interaction: { type: "save", saveAbility: "CON" },
    area: { shape: "Emanation", sizeFeet: 30 },
    damage: [
      { dice: "5d6", type: "thunder", isBase: true },
      { dice: "5d6", type: "radiant", isBase: false },
    ],
    effectNotes: [
      "You strike the ground, creating a burst of divine energy in a 30-foot Emanation.",
      "Each creature you choose within the area must make a Constitution saving throw.",
      "On a failed save, a target takes 5d6 Thunder damage plus 5d6 Radiant or Necrotic damage (your choice) and has the Prone condition.",
      "On a successful save, a target takes half as much damage only.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Place 30-ft Emanation centered on caster.",
        "Select target creatures to affect (can exclude allies).",
        "Prompt Constitution saves.",
        "Apply 5d6 Thunder + 5d6 Radiant/Necrotic damage (half on save).",
        "Apply Prone condition on failed save.",
      ],
    },
    isManualOverride: true,
    notes:
      "Player's Handbook (2024). Marked for detailed verification against printed book/DDB. In 2024, 30-ft Emanation. Targets chosen creatures; failed save takes 5d6 Thunder + 5d6 Radiant or Necrotic and is knocked Prone.",
  },

  flame_strike: {
    id: "flame_strike",
    name: "Flame Strike",
    category: {
      spellType: "spell",
      school: "evocation",
      level: 5,
      classes: ["cleric"],
      source: "Player's Handbook (2024), pg. 275",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "60 ft.",
      components: "V, S, M (a pinch of sulfur)",
      duration: "Instantaneous",
    },
    interaction: { type: "save", saveAbility: "DEX" },
    damage: [
      { dice: "5d6", type: "fire", isBase: true },
      { dice: "5d6", type: "radiant", isBase: true },
    ],
    upcasting: {
      notes: "+1d6 Fire and +1d6 Radiant damage per spell slot level above 5th",
      perSlotLevel: { dice: "1d6", type: "fire" },
    },
    effectNotes: [
      "Creatures in a 10-foot-radius, 40-foot-high Cylinder centered on a point within range make a Dexterity save, taking 5d6 Fire and 5d6 Radiant damage on a failure or half of each on a success.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Aim the 10-foot-radius, 40-foot-high Cylinder and resolve each Dexterity save. On a success, halve both damage types; on failure, apply both full rolls.",
        "For each slot level above 5th, add one Fire d6 and one Radiant d6. Resolve vertical coverage manually if the scene does not represent elevation.",
      ],
    },
    isManualOverride: true,
    notes: "Upcasting adds one die to each damage type, not one die total.",
  },

  jallarzis_storm_of_radiance: {
    id: "jallarzis_storm_of_radiance",
    name: "Jallarzi's Storm of Radiance",
    category: {
      spellType: "spell",
      school: "evocation",
      level: 5,
      classes: ["warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 289",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "120 ft. (10-ft.-radius, 40-ft.-high cylinder)",
      components: "V, S, M (a pinch of phosphorus)",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "save", saveAbility: "CON" },
    area: { shape: "Cylinder", sizeFeet: 10, heightFeet: 40 },
    damage: [
      { dice: "2d10", type: "radiant", isBase: true },
      { dice: "2d10", type: "thunder", isBase: false },
    ],
    upcasting: {
      notes:
        "+1d10 Radiant damage and +1d10 Thunder damage per spell slot level above 5th",
    },
    effectNotes: [
      "You create a storm of brilliant light and booming thunder in a 10-foot-radius, 40-foot-high Cylinder centered on a point within range.",
      "Creatures within the area have the Blinded and Deafened conditions, and they can't cast spells that have a Verbal component.",
      "When the storm appears, each creature in it must make a Constitution saving throw, taking 2d10 Radiant damage and 2d10 Thunder damage on a failed save, or half as much on a successful one. A creature also makes this save when it enters the area for the first time on a turn or ends its turn there (only once per turn).",
      "Using a Higher-Level Spell Slot: The Radiant and Thunder damage each increase by 1d10 for each spell slot level above 5.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Place 10-ft radius, 40-ft high Cylinder within 120 ft.",
        "Creatures inside gain Blinded and Deafened conditions and cannot cast Verbal spells.",
        "Prompt Constitution saves on cast, entering, or ending turn (once per turn).",
        "Apply 2d10 Radiant + 2d10 Thunder damage (half on save).",
      ],
    },
    isManualOverride: true,
    notes:
      "Player's Handbook (2024). Marked for detailed verification against printed book/DDB. New 2024 spell (Warlock, Wizard). Blinds, deafens, and silences Verbal spellcasting. 2d10 Radiant + 2d10 Thunder on CON save.",
  },

  wall_of_force: {
    id: "wall_of_force",
    name: "Wall of Force",
    category: {
      spellType: "spell",
      school: "evocation",
      level: 5,
      classes: ["wizard"],
      source: "Player's Handbook (2024), pg. 338",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "120 feet",
      components: "V, S, M (a shard of glass)",
      duration: "Concentration, up to 10 minutes",
    },
    damage: [],
    area: { shape: "Wall", sizeFeet: 100 },
    effectNotes: [
      "An Invisible wall of force springs into existence within 120 feet: horizontal, vertical, or angled barrier.",
      "Form it into a hemispherical dome or globe up to 10-foot radius, or a flat surface of ten contiguous 10x10-foot panels (1/4 inch thick).",
      "Pushes intersecting creatures to one chosen side.",
      "Nothing can physically pass through; immune to all damage; cannot be dispelled by Dispel Magic. Disintegrate destroys it instantly.",
      "Extends into Ethereal Plane, blocking ethereal travel.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Place invisible barrier (10 panels of 10x10 ft or 10-ft dome/globe) within 120 ft.",
        "Push intersected creatures to chosen side.",
        "Blocks all physical and ethereal travel; immune to damage and Dispel Magic; destroyed by Disintegrate.",
      ],
    },
    isManualOverride: true,
    notes:
      "Concentration up to 10 min. Invisible barrier (ten 10x10 ft panels or 10-ft dome/globe). Immune to all damage and Dispel Magic. Pushes caught creatures to chosen side. Blocks ethereal travel. Destroyed by Disintegrate.",
  },

  wall_of_stone: {
    id: "wall_of_stone",
    name: "Wall of Stone",
    category: {
      spellType: "spell",
      school: "evocation",
      level: 5,
      classes: ["druid", "sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 339",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "120 feet",
      components: "V, S, M (a cube of granite)",
      duration:
        "Concentration, up to 10 minutes (Permanent if maintained full duration)",
    },
    interaction: { type: "save", saveAbility: "DEX" },
    damage: [],
    area: { shape: "Wall", sizeFeet: 100 },
    effectNotes: [
      "A nonmagical wall of solid stone springs into existence within 120 feet: ten 10x10-foot panels (6 inches thick) or ten 10x20-foot panels (3 inches thick).",
      "Must merge with and be solidly supported by existing stone.",
      "Creatures in space pushed to chosen side. If surrounded on all sides, creature can make a Dexterity saving throw to use Reaction to move up to Speed to avoid enclosure.",
      "Object: AC 15, 30 Hit Points per inch of thickness per panel. Immune to Poison and Psychic.",
      "If maintained for full 10 minutes, becomes permanent nonmagical stone and cannot be dispelled.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Place stone wall panels (ten 10x10 ft panels 6 in thick or 10x20 ft 3 in thick) anchored to stone within 120 ft.",
        "Push intersected creatures to chosen side; allow DEX save Reaction escape if surrounded.",
        "Track panel HP (AC 15, 30 HP/inch).",
        "If concentration maintained for full 10 minutes, wall becomes permanent.",
      ],
    },
    isManualOverride: true,
    notes:
      "Concentration up to 10 min (becomes permanent nonmagical stone if held full duration). Ten 10x10 ft panels (6 in thick) or 10x20 ft (3 in thick). DEX save Reaction to escape if enclosed. AC 15, 30 HP/inch per panel.",
  },

    // Level 6 (6 spells)
    // Blade Barrier (D&D Free Rules 2024, Spell Descriptions)
  blade_barrier: {
    id: "blade_barrier",
    name: "Blade Barrier",
    category: {
      spellType: "spell",
      school: "evocation",
      level: 6,
      classes: ["cleric"],
      source: "Player's Handbook (2024), pg. 247",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "90 ft.",
      components: "V, S",
      duration: "Concentration, up to 10 minutes",
    },
    interaction: { type: "save", saveAbility: "DEX" },
    damage: [{ dice: "6d10", type: "force", isBase: true }],
    effectNotes: [
      "Create a straight wall up to 100 feet long, 20 feet high, and 5 feet thick, or a ringed wall up to 60 feet in diameter, 20 feet high, and 5 feet thick. It provides Three-Quarters Cover and its space is Difficult Terrain.",
      "Creatures in the wall when it appears, entering its space, or ending their turn there make a Dexterity save, taking 6d10 Force damage on a failure or half on a success. A creature makes this save only once per turn.",
    ],
    isManualOverride: true,
    notes:
      "Place and track the wall manually, including its shape, cover, difficult terrain, concentration, and once-per-turn damage triggers.",
  },

  // Chain Lightning (D&D Free Rules 2024, Spell Descriptions)
  chain_lightning: {
    id: "chain_lightning",
    name: "Chain Lightning",
    category: {
      spellType: "spell",
      school: "evocation",
      level: 6,
      classes: ["sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 249",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "150 ft.",
      components: "V, S, M (three silver pins)",
      duration: "Instantaneous",
    },
    interaction: { type: "save", saveAbility: "DEX" },
    damage: [{ dice: "10d8", type: "lightning", isBase: true }],
    upcasting: {
      notes:
        "One additional bolt jumps from the first target to another target for each slot level above 6.",
    },
    effectNotes: [
      "Choose one visible creature or object in range; three bolts can then leap from it to up to three other targets, each within 30 feet of the first. Each target is struck only once and makes a Dexterity save, taking 10d8 Lightning damage on a failure or half on a success.",
    ],
    isManualOverride: true,
    notes:
      "Select and resolve each target separately; higher-level slots add targets, not damage dice.",
  },

  elminsters_effulgent_spheres: {
    id: "elminsters_effulgent_spheres",
    name: "Elminster's Effulgent Spheres",
    category: {
      spellType: "spell",
      school: "evocation",
      level: 6,
      classes: ["druid", "sorcerer", "wizard"],
      source: "Forgotten Realms: Heroes of Faerûn, pg. 144",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Self",
      components: "V, S, M (an opal worth 1,000+ GP)",
      duration: "1 hour",
    },
    interaction: { type: "spell_attack" },
    damage: [
      {
        dice: "3d6",
        type: "choice",
        typeChoices: ["acid", "cold", "fire", "lightning", "thunder"],
        isBase: true,
        condition:
          "Energy Blast: bonus action attack with 1 sphere up to 120 ft",
      },
    ],
    upcasting: {
      notes:
        "Number of spheres created increases by 1 for each spell slot level above 6th",
    },
    effectNotes: [
      "Six glowing chromatic spheres orbit you for 1 hour without concentration.",
      "Expend spheres for two options:",
      "- Absorb Energy: Reaction when taking Acid, Cold, Fire, Lightning, or Thunder damage, expend 1 sphere to gain Resistance to that damage type until start of your next turn.",
      "- Energy Blast: Bonus Action, fire 1 sphere at target within 120 feet. Make a ranged spell attack roll dealing 3d6 Acid, Cold, Fire, Lightning, or Thunder damage (your choice) on a hit.",
      "Spell ends early if all spheres are expended.",
      "Using a Higher-Level Spell Slot: Gain 1 additional sphere per slot level above 6.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Verify 1,000+ GP opal focus. Track 6 orbiting spheres (or +1 per slot level above 6).",
        "Reaction: expend 1 sphere for elemental Resistance (Acid/Cold/Fire/Lightning/Thunder) until next turn start.",
        "Bonus Action: expend 1 sphere to fire ranged spell attack up to 120 ft dealing 3d6 chosen elemental damage on hit.",
        "Dismiss when all spheres expended.",
      ],
    },
    isManualOverride: true,
    notes:
      "Forgotten Realms: Heroes of Faerûn, pg. 144. 1 hour (no concentration), 1,000+ GP opal. Creates 6 spheres (+1 per upcast level). Reaction absorbs elemental damage (grants resistance); Bonus Action fires sphere up to 120 ft (ranged spell attack for 3d6 chosen damage).",
  },

  otilukes_freezing_sphere: {
    id: "otilukes_freezing_sphere",
    name: "Otiluke's Freezing Sphere",
    category: {
      spellType: "spell",
      school: "evocation",
      level: 6,
      classes: ["sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 302",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "300 ft. (60-ft. radius Sphere)",
      components: "V, S, M (a miniature crystal sphere)",
      duration: "Instantaneous",
    },
    interaction: { type: "save", saveAbility: "CON" },
    area: { shape: "Sphere", sizeFeet: 60 },
    damage: [{ dice: "10d6", type: "cold", isBase: true }],
    upcasting: {
      notes: "+1d6 Cold damage per spell slot level above 6th",
      perSlotLevel: { dice: "1d6", type: "cold" },
    },
    effectNotes: [
      "Explodes in a 60-foot-radius Sphere at a point within 300 feet. Each creature makes a Constitution save, taking 10d6 Cold damage on failure or half on success.",
      "If striking water: freezes water 6 inches deep across a 30-foot square for 1 minute; swimming surface creatures are Restrained (escape with an action and DC Athletics check against your spell save DC).",
      "Can delay firing: create a small globe in hand that can be thrown (40 ft) or slung (normal range) within 1 minute, shattering on impact with normal effect (or explodes after 1 minute).",
      "Upcasting: Damage increases by 1d6 for each slot level above 6.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Place 60-foot-radius Sphere and resolve Constitution saving throws for 10d6 (+1d6/slot above 6) Cold damage (half on success).",
        "If targeting water, create 30-foot square ice sheet for 1 minute; apply Restrained condition to surface swimming creatures.",
        "If holding the globe, track 1-minute expiration and allow throw (40 ft) or sling to trigger the effect.",
      ],
    },
    isManualOverride: true,
    notes:
      "60-foot-radius Sphere dealing 10d6 Cold (CON save for half). Freezes water surface for 1 min and Restrains swimming creatures. Can be held as a 1-minute throwable globe.",
  },

  sunbeam: {
    id: "sunbeam",
    name: "Sunbeam",
    category: {
      spellType: "spell",
      school: "evocation",
      level: 6,
      classes: ["cleric", "druid", "sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 329",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Self (60-ft. Line)",
      components: "V, S, M (a magnifying glass)",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "save", saveAbility: "CON" },
    area: { shape: "Line", sizeFeet: 60 },
    damage: [{ dice: "6d8", type: "radiant", isBase: true }],
    effectNotes: [
      "Launch a beam of sunlight in a 5-foot-wide, 60-foot-long Line. Each creature makes a Constitution saving throw, taking 6d8 Radiant damage and gaining the Blinded condition until start of your next turn (half damage and not Blinded on success).",
      "Until the spell ends (concentration up to 1 minute), you can take a Magic action on subsequent turns to create a new Line.",
      "Sheds Bright Light in a 30-foot radius and Dim Light for an additional 30 feet.",
      "Dispels any darkness created by a spell of level 6 or lower within its light.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Aim 5x60 ft Line; prompt CON save for creatures in path (6d8 Radiant + Blinded until next turn, half on save).",
        "Provide aura shedding 30-ft Bright Light / 30-ft Dim Light; dispel darkness <= level 6.",
        "Allow Magic action on subsequent turns to fire another beam; track concentration up to 1 minute.",
      ],
    },
    isManualOverride: true,
    notes:
      "60x5 ft Line. Concentration up to 1 min. CON save: 6d8 Radiant + Blinded until your next turn (half on save). Magic action allows firing a new beam on later turns. Dispels darkness of level 6 or lower.",
  },

  wall_of_ice: {
    id: "wall_of_ice",
    name: "Wall of Ice",
    category: {
      spellType: "spell",
      school: "evocation",
      level: 6,
      classes: ["wizard"],
      source: "Player's Handbook (2024), pg. 339",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "120 feet",
      components: "V, S, M (a piece of quartz)",
      duration: "Concentration, up to 10 minutes",
    },
    interaction: { type: "save", saveAbility: "DEX" },
    area: { shape: "Wall", sizeFeet: 100 },
    damage: [
      {
        dice: "10d6",
        type: "cold",
        isBase: true,
        condition: "When wall appears cutting creature's space (DEX save half)",
      },
      {
        dice: "5d6",
        type: "cold",
        isBase: false,
        condition:
          "Moving through sheet of frigid air left by breached section (CON save half)",
      },
    ],
    upcasting: {
      notes:
        "+2d6 initial Cold damage and +1d6 frigid air damage per slot level above 6th",
      perSlotLevel: { dice: "2d6", type: "cold" },
    },
    effectNotes: [
      "Create an ice wall within 120 feet: hemispherical dome or globe up to 10-foot radius, or ten contiguous 10x10-foot panels (1 foot thick).",
      "If cutting through a creature's space: creature is pushed to chosen side and makes a Dexterity saving throw, taking 10d6 Cold damage (half on success).",
      "Object: AC 12, 30 Hit Points per 10-foot section. Immune to Cold, Poison, Psychic; Vulnerable to Fire.",
      "Destroying a section leaves a sheet of frigid air: moving through for the first time on a turn requires a Constitution saving throw, taking 5d6 Cold damage (half on success).",
      "Using a Higher-Level Spell Slot: Initial damage increases by 2d6 and frigid air damage increases by 1d6 for each spell slot level above 6.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Place ice wall (ten 10x10 ft panels or 10-ft dome) within 120 ft.",
        "Prompt DEX save for intersected creatures (10d6 Cold, half on save; pushed to side).",
        "Track section HP (AC 12, 30 HP, Vuln Fire). Breached sections leave frigid air (CON save vs 5d6 Cold).",
        "Upcast: +2d6 initial / +1d6 frigid air per slot level above 6.",
      ],
    },
    isManualOverride: true,
    notes:
      "Concentration up to 10 min. Ten 10x10 ft panels or 10-ft dome. Intersected: pushed to side + DEX save vs 10d6 Cold (half on save). Sections have AC 12, 30 HP (vuln Fire). Breached section leaves frigid air (CON save vs 5d6 Cold). Upcast: +2d6 initial / +1d6 frigid air per level.",
  },

    // Level 7 (7 spells)
    delayed_blast_fireball: {
    id: "delayed_blast_fireball",
    name: "Delayed Blast Fireball",
    category: {
      spellType: "spell",
      school: "evocation",
      level: 7,
      classes: ["sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 261",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "150 feet",
      components: "V, S, M (a ball of bat guano and sulfur)",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "save", saveAbility: "DEX" },
    area: { shape: "Sphere", sizeFeet: 20 },
    damage: [
      {
        dice: "12d6",
        type: "fire",
        isBase: true,
        condition:
          "When bead explodes (DEX save half; increases by 1d6 at end of each caster turn)",
      },
    ],
    upcasting: {
      notes: "+1d6 Fire damage per slot level above 7th",
      perSlotLevel: { dice: "1d6", type: "fire" },
    },
    effectNotes: [
      "Glowing bead condenses at chosen point within 150 feet.",
      "Base damage 12d6 Fire in 20-foot-radius Sphere; damage increases by 1d6 whenever your turn ends and spell hasn't ended.",
      "Creature touching bead makes DEX save: on fail explodes immediately; on success can throw it up to 40 feet (explodes on collision).",
      "Ignites unattended flammable objects in explosion.",
      "Using a Higher-Level Spell Slot: Base damage increases by 1d6 per slot level above 7.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Place glowing bead within 150 feet; start concentration (base 12d6 Fire).",
        "At end of each caster turn, increment explosion damage by 1d6.",
        "If creature touches bead, prompt DEX save: fail explodes, success can throw 40 ft.",
        "On detonation, place 20-ft Sphere; prompt DEX save for accumulated Fire damage (half on save).",
      ],
    },
    isManualOverride: true,
    notes:
      "Concentration up to 1 min. Glowing bead within 150 ft. Base 12d6 Fire in 20-ft Sphere (DEX save half). Increases by 1d6 Fire at end of each turn (max +10d6). Touching bead requires DEX save or triggers detonation. Upcast adds +1d6 base Fire.",
  },

  divine_word: {
    id: "divine_word",
    name: "Divine Word",
    category: {
      spellType: "spell",
      school: "evocation",
      level: 7,
      classes: ["cleric"],
      source: "Player's Handbook (2024), pg. 265",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 bonus action",
      range: "30 ft.",
      components: "V",
      duration: "Instantaneous",
    },
    interaction: { type: "save", saveAbility: "CHA" },
    damage: [],
    effectNotes: [
      "Each creature of your choice in range makes a Charisma save. On a failure, a target with 50 HP or fewer is affected by its current HP: 0-20 dies; 21-30 is Blinded, Deafened, and Stunned for 1 hour; 31-40 is Blinded and Deafened for 10 minutes; 41-50 is Deafened for 1 minute. Above 50 HP, these HP-band effects do not apply.",
      "Regardless of HP, a Celestial, Elemental, Fey, or Fiend that fails is returned to its plane of origin (if elsewhere) and cannot return for 24 hours except by Wish.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Select creatures in range and resolve each Charisma save. For each failure, check current HP and creature type separately; apply the correct condition/death or planar return. Track condition durations and the 24-hour return restriction manually.",
      ],
    },
    isManualOverride: true,
    notes:
      "Creature type can trigger planar return regardless of HP; the HP bands apply only to failed-save targets at 50 HP or fewer.",
  },

  fire_storm: {
    id: "fire_storm",
    name: "Fire Storm",
    category: {
      spellType: "spell",
      school: "evocation",
      level: 7,
      classes: ["cleric", "druid", "sorcerer"],
      source: "Player's Handbook (2024), pg. 275",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "150 ft.",
      components: "V, S",
      duration: "Instantaneous",
    },
    interaction: { type: "save", saveAbility: "DEX" },
    damage: [{ dice: "7d10", type: "fire", isBase: true }],
    effectNotes: [
      "Arrange up to ten 10-foot Cubes within range; every Cube must be contiguous with at least one other. Creatures in the area make Dexterity saves, taking 7d10 Fire damage on a failure or half as much on a success. Flammable objects there that are not worn or carried start burning.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Place up to ten contiguous 10-foot Cubes within range; the area can be irregular. Resolve Dexterity saves and half damage on success for each creature.",
        "Track flammable objects that are not worn or carried and adjudicate ignition. The area placement is not automatically represented as a multi-cube shape.",
      ],
    },
    isManualOverride: true,
    notes:
      "The caster arranges up to ten contiguous cubes; a single cube or sphere preview would not express all legal shapes.",
  },

  forcecage: {
    id: "forcecage",
    name: "Forcecage",
    category: {
      spellType: "spell",
      school: "evocation",
      level: 7,
      classes: ["bard", "warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 276",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "100 ft.",
      components: "V, S, M (ruby dust worth 1,500+ GP, consumed)",
      duration: "Concentration, up to 1 hour",
    },
    interaction: { type: "save", saveAbility: "CHA" },
    damage: [],
    effectNotes: [
      "Create an immobile Invisible Cube-shaped prison within range: a cage up to 20 feet per side with bars, or a solid box up to 10 feet per side. Creatures fully inside are trapped; partially inside or too-large creatures are pushed outside. The solid box blocks matter and spells passing through its boundary.",
      "A trapped creature cannot leave nonmagically. Teleportation or interplanar escape requires a Charisma save; success permits escape, failure wastes that spell/effect. The cage extends into the Ethereal Plane. Dispel Magic cannot end this spell.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Choose cage or solid box, place its dimensions, and determine which creatures are fully enclosed or pushed outside. Track its immobility, invisibility, concentration, and duration.",
        "Adjudicate movement, matter/spell blocking, planar/Ethereal containment, and Charisma saves when a trapped creature attempts teleportation or planar travel. Dispel Magic cannot end it.",
      ],
    },
    isManualOverride: true,
    notes:
      "Although the spell requires concentration, it is immobile and its prison is invisible; manually represent the boundary and its chosen form.",
  },

  mordenkainens_sword: {
    id: "mordenkainens_sword",
    name: "Mordenkainen's Sword",
    category: {
      spellType: "spell",
      school: "evocation",
      level: 7,
      classes: ["bard", "wizard"],
      source: "Player's Handbook (2024), pg. 302",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "90 ft.",
      components: "V, S, M (a miniature sword worth 250+ GP)",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "melee_spell_attack" },
    damage: [{ dice: "4d12", type: "force", isBase: true }],
    effectNotes: [
      "Create a hovering spectral sword within 90 feet lasting 1 minute (no concentration required in 2024 rules).",
      "When created, make a melee spell attack against a target within 5 feet of the sword. On a hit, target takes 4d12 plus your spellcasting ability modifier Force damage.",
      "On later turns, take a Bonus Action to move the sword up to 30 feet and repeat the attack against the same or different target.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Verify 250+ GP miniature sword focus. Place spectral sword token within 90 feet.",
        "Make initial melee spell attack against an adjacent target (5 ft reach) dealing 4d12 + spellcasting modifier Force damage.",
        "Allow Bonus Action on subsequent turns to fly sword up to 30 feet and repeat attack. Track 1 minute duration (no concentration).",
      ],
    },
    isManualOverride: true,
    notes:
      "In 2024 rules, Mordenkainen's Sword does NOT require concentration! Lasts 1 minute. Requires a 250+ GP miniature sword. Deals 4d12 + spellcasting modifier Force damage on hit. Bonus Action to move 30 ft and re-attack.",
  },

  prismatic_spray: {
    id: "prismatic_spray",
    name: "Prismatic Spray",
    category: {
      spellType: "spell",
      school: "evocation",
      level: 7,
      classes: ["bard", "sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 307",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Self (60-ft. Cone)",
      components: "V, S",
      duration: "Instantaneous",
    },
    interaction: { type: "save", saveAbility: "DEX" },
    damage: [
      {
        dice: "12d6",
        type: "choice",
        typeChoices: ["fire", "acid", "lightning", "poison", "cold"],
        isBase: true,
        condition:
          "Determined by 1d8 ray roll on failed save (half on success)",
      },
    ],
    effectNotes: [
      "Eight rays flash in a 60-foot Cone. Each creature makes a Dexterity saving throw and rolls 1d8 for its ray color.",
      "1 Red: 12d6 Fire (half on save). 2 Orange: 12d6 Acid (half on save). 3 Yellow: 12d6 Lightning (half on save). 4 Green: 12d6 Poison (half on save). 5 Blue: 12d6 Cold (half on save).",
      "6 Indigo: Failed save = Restrained; CON save at end of each turn (3 successes end, 3 failures = Petrified until Greater Restoration).",
      "7 Violet: Failed save = Blinded; WIS save at start of your next turn (success ends, failure = teleports to another plane of existence, DM choice).",
      "8 Special: Struck by two rays; roll twice rerolling 8s.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Aim 60-foot Cone and prompt Dexterity saves for all caught creatures.",
        "Roll 1d8 per target (or reroll twice on 8) to determine color ray effect.",
        "Apply 12d6 elemental damage (half on save) or resolve Indigo petrification tracking / Violet plane shift on failed saves.",
      ],
    },
    isManualOverride: true,
    notes:
      "60-foot Cone. Each target rolls 1d8: 1-5 deal 12d6 elemental damage (half on save); 6 causes Restrained leading to Petrification (3 fails); 7 causes Blinded leading to planar teleportation; 8 strikes with two rays.",
  },

  // Whirlwind (PHB 2024, pg. 341)
  whirlwind: {
    id: "whirlwind",
    name: "Whirlwind",
    category: {
      spellType: "spell",
      school: "evocation",
      level: 7,
      classes: ["druid", "sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 341",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "300 ft.",
      components: "V, M (a piece of straw)",
      duration: "Concentration, up to 1 minute",
    },
    area: { shape: "Sphere", sizeFeet: 10 },
    interaction: { type: "save", saveAbility: "DEX" },
    damage: [{ dice: "10d6", type: "bludgeoning", isBase: true }],
    effectNotes: [
      "A whirlwind of howling air forms in a 10-foot-radius, 30-foot-high Cylinder centered on a point within range. Creatures in the area make a DEX save: 10d6 Bludgeoning on failure, or half on success.",
    ],
    isManualOverride: true,
    notes:
      "300 ft range, 10-foot radius Cylinder/Sphere. DEX save for 10d6 Bludgeoning.",
  },

    // Level 8 (3 spells)
    // Holy Star of Mystra (Forgotten Realms: Heroes of Faerûn, pg. 145)
  holy_star_of_mystra: {
    id: "holy_star_of_mystra",
    name: "Holy Star of Mystra",
    category: {
      spellType: "spell",
      school: "evocation",
      level: 8,
      classes: ["cleric", "wizard"],
      source: "Forgotten Realms: Heroes of Faerûn, pg. 145",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 bonus action",
      range: "Self",
      components: "V, S",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "spell_attack" },
    damage: [
      {
        dice: "4d10",
        type: "choice",
        typeChoices: ["force", "radiant"],
        isBase: true,
        condition:
          "Shining bolt ranged spell attack on cast and as Bonus Action (plus spellcasting ability modifier)",
      },
    ],
    effectNotes: [
      "A glowing mote of energy hovers above you shedding 5 ft Bright Light and 5 ft Dim Light.",
      "Defensive Cover: While the mote is present, you have Three-Quarters Cover (+5 to AC and Dexterity saving throws).",
      "Shining Bolt: When you cast and as a Bonus Action on later turns, unleash a bolt at one creature within 120 feet. Make a ranged spell attack roll dealing 4d10 + spellcasting modifier Force or Radiant damage (your choice) on hit.",
      "Spell Deflection: Reaction when succeeding on a saving throw against a spell of 7th level or lower that targeted only you and didn't create an area of effect; deflect that spell back at its caster using that caster's own spell save DC.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Cast as Bonus Action; track concentration up to 1 min.",
        "Apply Three-Quarters Cover (+5 AC and DEX saves) to caster.",
        "Bonus Action: make ranged spell attack up to 120 ft dealing 4d10 + modifier Force or Radiant on hit.",
        "Reaction: deflect single-target spell <= level 7 back at caster on successful save.",
      ],
    },
    isManualOverride: true,
    notes:
      "Forgotten Realms: Heroes of Faerûn, pg. 145. Bonus Action, conc up to 1 min. Grants Three-Quarters Cover (+5 AC/Dex saves). BA ranged spell attack up to 120 ft for 4d10+mod Force or Radiant. Reaction deflector for single-target spells <= 7th level on successful save.",
  },

  // Lightning Ring (Arcana Unleashed, pg. 41)
  lightning_ring: {
    id: "lightning_ring",
    name: "Lightning Ring",
    category: {
      spellType: "spell",
      school: "evocation",
      level: 8,
      classes: ["druid", "sorcerer", "warlock", "wizard"],
      source: "Arcana Unleashed, pg. 41",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 bonus action",
      range: "Self (10-ft. Emanation)",
      components: "V, S, M (a bit of fur and a glass ring)",
      duration: "Concentration, up to 10 minutes",
    },
    interaction: { type: "save", saveAbility: "CON" },
    area: { shape: "Sphere", sizeFeet: 10 },
    damage: [
      {
        dice: "3d6",
        type: "lightning",
        isBase: true,
        condition:
          "Emanation Constitution save: enter space, creature enters or ends turn",
      },
      {
        dice: "3d6",
        type: "thunder",
        isBase: true,
        condition:
          "Emanation Constitution save: enter space, creature enters or ends turn",
      },
      {
        dice: "6d6",
        type: "lightning",
        isBase: false,
        condition:
          "Magic Action: 60x5 ft Line Dexterity save (half on success)",
      },
    ],
    effectNotes: [
      "A ring of crackling electricity fills a 10-foot Emanation originating from you for up to 10 minutes with concentration.",
      "Emanation: whenever ring enters a creature's space, or a creature enters or ends its turn there, force Constitution save: takes 3d6 Lightning + 3d6 Thunder damage and Deafened for 1 minute on failure (half damage only on success).",
      "Line Attack: as a Magic action while active, emit a 60-foot-long, 5-foot-wide Line. Each creature in Line makes a Dexterity saving throw: takes 6d6 Lightning damage on failure, half on success.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Cast as Bonus Action; track 10-ft Emanation and concentration up to 10 min.",
        "Prompt Constitution save when entering space or ending turn: 3d6 Lightning + 3d6 Thunder + Deafened (half damage on success).",
        "Magic Action: fire 60x5 ft Line for Dexterity save (6d6 Lightning, half on success).",
      ],
    },
    isManualOverride: true,
    notes:
      "Arcana Unleashed, pg. 41. Bonus Action, conc up to 10 min. 10-ft Emanation: CON save vs 3d6 Lightning + 3d6 Thunder + Deafened. Magic Action fires 60x5 ft Line (DEX save vs 6d6 Lightning).",
  },

  sunburst: {
    id: "sunburst",
    name: "Sunburst",
    category: {
      spellType: "spell",
      school: "evocation",
      level: 8,
      classes: ["cleric", "druid", "sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 329",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "150 ft.",
      components: "V, S, M (a piece of sunstone)",
      duration: "Instantaneous",
    },
    interaction: { type: "save", saveAbility: "CON" },
    area: { shape: "Sphere", sizeFeet: 60 },
    damage: [{ dice: "12d6", type: "radiant", isBase: true }],
    effectNotes: [
      "Brilliant sunlight flashes in a 60-foot-radius Sphere within 150 feet.",
      "Each creature makes a Constitution saving throw, taking 12d6 Radiant damage and gaining the Blinded condition for 1 minute (half damage and not Blinded on success).",
      "A Blinded creature makes another Constitution saving throw at the end of each of its turns, ending Blinded on a success.",
      "Dispels darkness of any level in the area.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Place 60-foot-radius Sphere within 150 feet; dispel all magical darkness in area.",
        "Prompt Constitution saving throw for all creatures caught (12d6 Radiant + Blinded for 1 min, half on save).",
        "Prompt recurring CON save at end of each Blinded target's turn.",
      ],
    },
    isManualOverride: true,
    notes:
      "60-ft radius Sphere within 150 ft. CON save: 12d6 Radiant + Blinded for 1 minute (half on save). Repeats CON save at end of each turn. Dispels all magical darkness in area.",
  },

    // Level 9 (2 spells)
    detonate: {
    id: "detonate",
    name: "Detonate",
    category: {
      spellType: "spell",
      school: "evocation",
      level: 9,
      classes: ["sorcerer", "warlock", "wizard"],
      source: "Arcana Unleashed, pg. 38",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "500 ft.",
      components: "V, S, M (a piece of tinder)",
      duration: "Instantaneous",
    },
    interaction: { type: "save", saveAbility: "CON" },
    area: { shape: "Emanation", sizeFeet: 60 },
    damage: [
      {
        dice: "10d10",
        type: "fire",
        isBase: true,
        condition: "Target inside range on failed CON save (half on success)",
      },
      {
        dice: "10d10",
        type: "fire",
        isBase: false,
        condition:
          "Creatures in 60-ft Emanation from target on failed DEX save (Disadvantage if target dropped to 0 HP; half on success)",
      },
    ],
    effectNotes: [
      "Create an explosive seed inside a creature within 500 feet: CON save, 10d10 Fire damage (half on success).",
      "An explosion erupts in a 60-foot Emanation centered on target (excluding target): each creature makes a DEX save, taking 10d10 Fire damage (half on success).",
      "Creatures in the Emanation save with Disadvantage if the seed reduced the initial target to 0 Hit Points.",
      "Ignites flammable unattended nonmagical objects in the area.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Target creature within 500 ft; prompt CON save vs 10d10 Fire (half on save).",
        "Originating from target: place 60-ft Emanation; prompt DEX save vs 10d10 Fire for each creature (Disadvantage if target dropped to 0 HP).",
        "Ignite flammable objects in area.",
      ],
    },
    isManualOverride: true,
    notes:
      "Arcana Unleashed, pg. 38. 500 ft range. Initial target CON save: 10d10 Fire (half on save). Then 60-ft Emanation from target: DEX save vs 10d10 Fire (Disadvantage if initial target dropped to 0 HP; half on save).",
  },

  meteor_swarm: {
    id: "meteor_swarm",
    name: "Meteor Swarm",
    category: {
      spellType: "spell",
      school: "evocation",
      level: 9,
      classes: ["sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 298",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "1 mile (4x 40-ft. radius Spheres)",
      components: "V, S",
      duration: "Instantaneous",
    },
    interaction: { type: "save", saveAbility: "DEX" },
    area: { shape: "Sphere", sizeFeet: 40 },
    damage: [
      { dice: "20d6", type: "fire", isBase: true },
      { dice: "20d6", type: "bludgeoning", isBase: true },
    ],
    effectNotes: [
      "Blazing orbs plummet at four different points you can see within 1 mile. Each creature in a 40-foot-radius Sphere centered on each point makes a Dexterity saving throw.",
      "A creature takes 20d6 Fire damage and 20d6 Bludgeoning damage on a failed save, or half as much on a successful one.",
      "A creature in the area of more than one fiery Sphere is affected only once. Nonmagical flammable objects in the area that aren't being worn or carried take the damage and catch fire.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Select four distinct impact points within 1 mile and place 40-foot-radius Spheres.",
        "Resolve Dexterity saves for all creatures caught in the areas. Ensure creatures in overlapping Spheres are only affected once.",
        "Apply 20d6 Fire + 20d6 Bludgeoning damage (half on success); ignite unworn/uncarried flammable objects.",
      ],
    },
    isManualOverride: true,
    notes:
      "1 mile range. Four 40-foot-radius Spheres dealing 20d6 Fire and 20d6 Bludgeoning (DEX save for half). Overlapping areas do not deal multiple damage. Ignites flammable objects.",
  },
};
