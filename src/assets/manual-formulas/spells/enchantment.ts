/**
 * Manual Spell Formula Overrides — Enchantment (Leveled Spells 1st–9th)
 */

import type { SpellFormula } from "../../../types/spellFormula";

export const enchantmentSpellOverrides: Record<string, SpellFormula> = {
    // Level 1 (11 spells)
    // Animal Friendship (D&D Free Rules 2024, Spell Descriptions)
  animal_friendship: {
    id: "animal_friendship",
    name: "Animal Friendship",
    category: {
      spellType: "spell",
      school: "enchantment",
      level: 1,
      classes: ["bard", "druid", "ranger"],
      source: "Player's Handbook (2024), pg. 239",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "30 ft.",
      components: "V, S, M (a morsel of food)",
      duration: "24 hours",
    },
    interaction: { type: "save", saveAbility: "WIS" },
    damage: [],
    upcasting: {
      notes: "Target one additional Beast for each spell slot level above 1st.",
    },
    effectNotes: [
      "Choose a Beast you can see. On a failed Wisdom save, it has the Charmed condition for the duration. The spell ends on it if you or an ally deals damage to it.",
    ],
    isManualOverride: true,
    notes:
      "The target must be a Beast. Track the Charmed condition and damage-based early ending manually.",
  },

  // Bane (D&D Free Rules 2024, Spell Descriptions)
  bane: {
    id: "bane",
    name: "Bane",
    category: {
      spellType: "spell",
      school: "enchantment",
      level: 1,
      classes: ["bard", "cleric", "warlock"],
      source: "Player's Handbook (2024), pg. 245",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "30 ft.",
      components: "V, S, M (a drop of blood)",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "save", saveAbility: "CHA" },
    damage: [],
    upcasting: {
      notes:
        "Target one additional creature for each spell slot level above 1st.",
    },
    effectNotes: [
      "Choose up to three visible creatures in range. Each makes a Charisma save; on a failure, subtract 1d4 from its attack rolls and saving throws while the spell lasts.",
    ],
    isManualOverride: true,
    notes:
      "Choose targets and track the 1d4 penalty manually. Additional targets depend on the slot level.",
  },

  // Bless (D&D Free Rules 2024, Spell Descriptions)
  bless: {
    id: "bless",
    name: "Bless",
    category: {
      spellType: "spell",
      school: "enchantment",
      level: 1,
      classes: ["cleric", "paladin"],
      source: "Player's Handbook (2024), pg. 247",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "30 ft.",
      components: "V, S, M (a Holy Symbol worth 5+ GP)",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "utility" },
    damage: [],
    upcasting: {
      notes:
        "Target one additional creature for each spell slot level above 1.",
    },
    effectNotes: [
      "Choose up to three creatures within range. Each target adds 1d4 to attack rolls and saving throws for the duration.",
    ],
    isManualOverride: true,
    notes:
      "Track concentration and the chosen targets; apply the d4 to each eligible attack roll and saving throw.",
  },

  // Charm Person (D&D Free Rules 2024, Spell Descriptions)
  charm_person: {
    id: "charm_person",
    name: "Charm Person",
    category: {
      spellType: "spell",
      school: "enchantment",
      level: 1,
      classes: ["bard", "druid", "sorcerer", "warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 249",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "30 ft.",
      components: "V, S",
      duration: "1 hour",
    },
    interaction: { type: "save", saveAbility: "WIS" },
    damage: [],
    upcasting: {
      notes:
        "Target one additional Humanoid for each spell slot level above 1st.",
    },
    effectNotes: [
      "One Humanoid you can see makes a Wisdom save with Advantage if you or your allies are fighting it. On a failure, it is Charmed and Friendly to you until the spell ends or you or your allies damage it. When the spell ends, it knows it was Charmed.",
    ],
    isManualOverride: true,
    notes:
      "The target must be a Humanoid. Track the condition, damage-based ending, and target awareness manually.",
  },

  // Command (D&D Free Rules 2024, Spell Descriptions)
  command: {
    id: "command",
    name: "Command",
    category: {
      spellType: "spell",
      school: "enchantment",
      level: 1,
      classes: ["bard", "cleric", "paladin"],
      source: "Player's Handbook (2024), pg. 251",
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
    damage: [],
    upcasting: {
      notes:
        "Target one additional creature for each spell slot level above 1st.",
    },
    effectNotes: [
      "On a failed save, the target follows a one-word command on its next turn. The command options include Approach, Drop, Flee, Grovel, and Halt; resolve the chosen word and its movement/action effects manually.",
    ],
    isManualOverride: true,
    notes:
      "The chosen command determines the target's turn; resolve its wording and behavior manually. Additional targets depend on slot level.",
  },

  compelled_duel: {
    id: "compelled_duel",
    name: "Compelled Duel",
    category: {
      spellType: "spell",
      school: "enchantment",
      level: 1,
      classes: ["paladin"],
      source: "Player's Handbook (2024), pg. 252",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 bonus action",
      range: "30 ft.",
      components: "V",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "save", saveAbility: "WIS" },
    damage: [],
    effectNotes: [
      "You attempt to compel a creature into a duel. One creature you can see within range makes a Wisdom saving throw.",
      "On a failed save, the target is drawn to you: it has Disadvantage on attack rolls against creatures other than you, and it can't willingly move to a space more than 30 feet away from you.",
      "The spell ends if you make an attack roll against any other creature, cast a spell targeting another creature, an ally damages the target, or you end your turn more than 30 feet from the target.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Cast as Bonus Action within 30 ft.",
        "Prompt Wisdom saving throw.",
        "On failure, target has Disadvantage against others and cannot willingly move > 30 ft away; track concentration up to 1 minute.",
        "Monitor end conditions: attack/spell on other target, ally damages target, or ending turn > 30 ft away.",
      ],
    },
    isManualOverride: true,
    notes:
      "Player's Handbook (2024). Marked for detailed verification against printed book/DDB. In 2024, the recurring save when moving away is removed: target strictly cannot willingly move > 30 ft away.",
  },

  // Dissonant Whispers (Player's Handbook 2024, pg. 264)
  dissonant_whispers: {
    id: "dissonant_whispers",
    name: "Dissonant Whispers",
    category: {
      spellType: "spell",
      school: "enchantment",
      level: 1,
      classes: ["bard", "cleric", "sorcerer", "warlock"],
      source: "Player's Handbook (2024), pg. 264",
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
    damage: [{ dice: "3d6", type: "psychic", isBase: true }],
    upcasting: {
      notes: "+1d6 psychic damage per spell slot level above 1st",
      perSlotLevel: { dice: "1d6", type: "psychic" },
    },
    effectNotes: [
      "On a failed save, the target must use its Reaction, if available, to move as far away from you as it can using the safest route. A successful save deals half damage only.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Choose one creature you can see within range and resolve its Wisdom saving throw.",
        "On a failed save, move the target using its Reaction along the safest route; Embers does not move tokens or resolve opportunity attacks automatically.",
        "Apply damage and track the target's HP on its character sheet; spell rolls do not update Owlbear token HP.",
      ],
    },
    isManualOverride: true,
    notes:
      "The forced movement uses the target's Reaction and the safest available route; resolve its path and any opportunity attacks manually.",
  },

  heroism: {
    id: "heroism",
    name: "Heroism",
    category: {
      spellType: "spell",
      school: "enchantment",
      level: 1,
      classes: ["bard", "paladin"],
      source: "Player's Handbook (2024), pg. 285",
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
    upcasting: {
      notes: "Target one additional creature per spell slot level above 1st.",
    },
    effectNotes: [
      "A willing creature you touch is immune to Frightened and gains Temporary HP equal to your spellcasting ability modifier at the start of each of its turns for the duration.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Confirm a willing touched target, then track Frightened immunity, concentration, and recurring Temporary HP equal to the caster's spellcasting ability modifier at the start of each target turn.",
        "Upcasting adds one target per slot level above 1; track each target's Temporary HP separately using normal Temporary HP rules.",
      ],
    },
    isManualOverride: true,
    notes:
      "Temporary HP is gained at the start of each turn; it does not accumulate with existing Temporary HP.",
  },

  hex: {
    id: "hex",
    name: "Hex",
    category: {
      spellType: "spell",
      school: "enchantment",
      level: 1,
      classes: ["warlock"],
      source: "Player's Handbook (2024), pg. 285",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "Bonus Action",
      range: "90 ft.",
      components: "V, S, M (the petrified eye of a newt)",
      duration: "Concentration, up to 1 hour",
    },
    interaction: { type: "utility" },
    damage: [
      {
        dice: "1d6",
        type: "necrotic",
        isBase: false,
        condition: "Whenever you hit the cursed target with an attack roll",
      },
    ],
    effectNotes: [
      "Curse a visible creature within range and choose one ability; it has Disadvantage on ability checks using that ability. Whenever you hit it with an attack roll, it takes an extra 1d6 Necrotic damage.",
      "If the target drops to 0 HP before the spell ends, you can take a Bonus Action on a later turn to curse another creature. The curse lasts longer with a level 2 slot (up to 4 hours), level 3-4 (up to 8 hours), or level 5+ (24 hours).",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "On casting, choose and record the target and one ability; track concentration, duration, Disadvantage on ability checks using that ability, and +1d6 Necrotic damage whenever the caster hits it with an attack roll.",
        "If the target reaches 0 HP while the spell continues, the caster may use a Bonus Action on a later turn to move the curse to a visible creature within 90 feet. Preserve the selected ability when moving it; track duration based on slot level.",
      ],
    },
    isManualOverride: true,
    notes:
      "The damage triggers on the caster's attack rolls against the cursed target; the ability choice affects checks, not saving throws. This formula follows Free Rules 2024 and is not BG3's version.",
  },

  sleep: {
    id: "sleep",
    name: "Sleep",
    category: {
      spellType: "spell",
      school: "enchantment",
      level: 1,
      classes: ["bard", "sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 317",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "60 ft. (5-ft.-radius sphere)",
      components:
        "V, S, M (a pinch of fine sand, sweet rose petals, or a cricket)",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "save", saveAbility: "WIS" },
    damage: [],
    area: { shape: "Sphere", sizeFeet: 5 },
    effectNotes: [
      "Each creature of your choice in a 5-foot-radius sphere centered on a point within range must make a Wisdom saving throw (creatures that don't sleep or are immune to Exhaustion succeed automatically).",
      "On a failed save, the target has the Incapacitated condition until the end of its next turn, at which point it repeats the save.",
      "If it fails the second save, it has the Unconscious condition for the duration of the spell.",
      "The spell ends on a target if it takes damage or if someone within 5 feet uses an action to shake or slap it awake.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Place 5-ft radius Sphere within 60 ft.",
        "Prompt Wisdom saves for chosen creatures inside (undead/elves/exhaustion-immune succeed automatically).",
        "On initial failure: apply Incapacitated condition.",
        "At end of target next turn: prompt repeat Wisdom save; on second failure, apply Unconscious condition.",
        "Ends on target if it takes damage or someone uses an action to shake it awake.",
      ],
    },
    isManualOverride: true,
    notes:
      "Player's Handbook (2024). Marked for detailed verification against printed book/DDB. Completely redesigned in 2024: 5-ft sphere, Wisdom saves instead of rolling HP dice. Failed save causes Incapacitated then Unconscious on second failure. Requires Concentration.",
  },

  tashas_hideous_laughter: {
    id: "tashas_hideous_laughter",
    name: "Tasha's Hideous Laughter",
    category: {
      spellType: "spell",
      school: "enchantment",
      level: 1,
      classes: ["bard", "wizard"],
      source: "Player's Handbook (2024), pg. 331",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "30 feet",
      components: "V, S, M (a tart and a feather)",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "save", saveAbility: "WIS" },
    damage: [],
    upcasting: {
      notes:
        "Target one additional creature for each spell slot level above 1st",
    },
    effectNotes: [
      "One creature you can see within range makes a Wisdom saving throw.",
      "On a failed save, it gains the Prone and Incapacitated conditions for the duration, laughs uncontrollably if able, and cannot end the Prone condition on itself.",
      "At the end of each of its turns and each time it takes damage, it makes another Wisdom saving throw (with Advantage if triggered by damage), ending the spell on a success.",
      "Using a Higher-Level Spell Slot: Target one additional creature for each spell slot level above 1.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Select target creature within 30 feet.",
        "Prompt Wisdom saving throw; apply Prone and Incapacitated conditions on a failure.",
        "Prompt recurring Wisdom saving throw at end of each turn and whenever target takes damage (with Advantage).",
        "If upcast, target 1 additional creature per slot level above 1.",
      ],
    },
    isManualOverride: true,
    notes:
      "WIS save or Prone and Incapacitated for up to 1 min (conc). Repeats save at end of each turn or on taking damage (Advantage if triggered by damage). Upcast adds +1 target per slot level.",
  },

    // Level 2 (7 spells)
    // Animal Messenger (D&D Free Rules 2024, Spell Descriptions)
  animal_messenger: {
    id: "animal_messenger",
    name: "Animal Messenger",
    category: {
      spellType: "spell",
      school: "enchantment",
      level: 2,
      classes: ["bard", "druid", "ranger"],
      source: "Player's Handbook (2024), pg. 240",
      concentration: false,
      ritual: true,
    },
    casting: {
      time: "1 action or Ritual",
      range: "30 ft.",
      components: "V, S, M (a morsel of food)",
      duration: "24 hours",
    },
    interaction: { type: "save", saveAbility: "CHA" },
    damage: [],
    upcasting: {
      notes: "Duration increases by 48 hours per slot level above 2nd.",
    },
    effectNotes: [
      "Choose a visible Tiny Beast; one with Challenge Rating 0 makes a Charisma save, while a Beast with a higher Challenge Rating automatically succeeds. On a failed save, it carries a message of up to 25 words to a visited location and a generally described recipient.",
      "Travel takes about 25 miles per 24 hours, or 50 miles if the Beast can fly. If it fails to arrive before the spell ends, the message is lost and it returns to the casting location.",
    ],
    isManualOverride: true,
    notes:
      "The GM determines the Beast, route, recipient match, travel progress, and delivery. Track the message and expiration manually.",
  },

  // Calm Emotions (D&D Free Rules 2024, Spell Descriptions)
  calm_emotions: {
    id: "calm_emotions",
    name: "Calm Emotions",
    category: {
      spellType: "spell",
      school: "enchantment",
      level: 2,
      classes: ["bard", "cleric"],
      source: "Player's Handbook (2024), pg. 249",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "60 ft.",
      components: "V, S",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "save", saveAbility: "CHA" },
    area: { shape: "Sphere", sizeFeet: 20 },
    damage: [],
    effectNotes: [
      "Each Humanoid in the Sphere makes a Charisma save. For each creature that fails, choose either to suppress Charmed/Frightened (granting immunity to those conditions for the duration) or make it Indifferent toward creatures it is Hostile toward.",
      "Indifference ends if the target takes damage or witnesses its allies taking damage; its attitude returns to normal when the spell ends.",
    ],
    isManualOverride: true,
    notes:
      "Resolve each Humanoid's save and chosen effect individually; track suppressed conditions or the end of Indifference manually.",
  },

  crown_of_madness: {
    id: "crown_of_madness",
    name: "Crown of Madness",
    category: {
      spellType: "spell",
      school: "enchantment",
      level: 2,
      classes: ["bard", "sorcerer", "warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 259",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "120 ft.",
      components: "V, S",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "save", saveAbility: "WIS" },
    damage: [],
    effectNotes: [
      "One Humanoid of your choice that you can see within range must make a Wisdom saving throw (non-Humanoids succeed automatically).",
      "On a failed save, the target has the Charmed condition. On each of its turns before moving, it must use its action to make a melee attack against another creature you choose within its reach (acting normally if no creature chosen or reachable).",
      "On your later turns, you must take the Magic action to maintain control over the target, or the spell ends.",
      "The target repeats the Wisdom saving throw at the end of each of its turns, ending the spell on a success.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Target Humanoid within 120 ft, prompt Wisdom save.",
        "On failure, target is Charmed and forced to attack a chosen creature in reach before moving.",
        "Requires caster Magic action each turn to maintain control.",
        "Prompt Wisdom save at end of each target turn to end spell.",
      ],
    },
    isManualOverride: true,
    notes:
      "Player's Handbook (2024). Marked for detailed verification against printed book/DDB. Target must be Humanoid. Requires Magic action on later turns to maintain control; target repeats save at end of its turns.",
  },

  // Enthrall (D&D Free Rules 2024, Spell Descriptions)
  enthrall: {
    id: "enthrall",
    name: "Enthrall",
    category: {
      spellType: "spell",
      school: "enchantment",
      level: 2,
      classes: ["bard", "warlock"],
      source: "Player's Handbook (2024), pg. 269",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "60 ft.",
      components: "V, S",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "save", saveAbility: "WIS" },
    damage: [],
    effectNotes: [
      "Creatures of your choice that you can see in range make a Wisdom save. A creature you or your companions are fighting automatically succeeds. On a failure, it takes a -10 penalty to Wisdom (Perception) checks and Passive Perception until the spell ends.",
    ],
    isManualOverride: true,
    notes:
      "Select eligible visible creatures; exclude creatures already being fought, then track failed saves and the Perception penalty while concentrating.",
  },

  // Hold Person (D&D Free Rules 2024, Spell Descriptions)
  hold_person: {
    id: "hold_person",
    name: "Hold Person",
    category: {
      spellType: "spell",
      school: "enchantment",
      level: 2,
      classes: ["bard", "cleric", "druid", "sorcerer", "warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 286",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "60 ft.",
      components: "V, S, M (a straight piece of iron)",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "save", saveAbility: "WIS" },
    damage: [],
    upcasting: {
      notes: "Target one additional Humanoid for each slot level above 2nd.",
    },
    effectNotes: [
      "A Humanoid you can see makes a Wisdom save or has the Paralyzed condition. At the end of each of its turns, it repeats the save, ending the spell on itself on a success.",
    ],
    isManualOverride: true,
    notes:
      "The target must be a Humanoid. Track concentration, Paralyzed, and repeated saves manually.",
  },

  // Suggestion (D&D Free Rules 2024, Spell Descriptions)
  suggestion: {
    id: "suggestion",
    name: "Suggestion",
    category: {
      spellType: "spell",
      school: "enchantment",
      level: 2,
      classes: ["bard", "sorcerer", "warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 320",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "30 ft.",
      components: "V, M (a drop of honey)",
      duration: "Concentration, up to 8 hours",
    },
    interaction: { type: "save", saveAbility: "WIS" },
    damage: [],
    effectNotes: [
      "Give one creature that can hear and understand you a reasonable course of activity described in 25 words or fewer; it must not obviously deal damage to it or its allies. On a failed Wisdom save, it is Charmed and pursues the suggestion to the best of its ability.",
      "The spell ends for the target if you or an ally damages it, it completes the activity, or the spell duration ends. The target can be evasive where the suggestion allows it.",
    ],
    isManualOverride: true,
    notes:
      "GM adjudicates whether the suggestion sounds achievable and its completion; track concentration and the target's Charmed condition.",
  },

  // Zone of Truth (D&D Free Rules 2024, Spell Descriptions)
  zone_of_truth: {
    id: "zone_of_truth",
    name: "Zone of Truth",
    category: {
      spellType: "spell",
      school: "enchantment",
      level: 2,
      classes: ["bard", "cleric", "paladin"],
      source: "Player's Handbook (2024), pg. 343",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "60 ft.",
      components: "V, S",
      duration: "10 minutes",
    },
    interaction: { type: "save", saveAbility: "CHA" },
    area: { shape: "Sphere", sizeFeet: 15 },
    damage: [],
    effectNotes: [
      "A creature entering the 15-foot-radius Sphere for the first time on a turn or starting its turn there makes a Charisma save. On a failure, it cannot deliberately lie while in the area; you know whether it succeeds or fails.",
      "Affected creatures know the spell is active and can refuse to answer or be evasive, but their statements must remain truthful.",
    ],
    isManualOverride: true,
    notes:
      "Track the Sphere and each creature's save result; the spell does not compel an answer.",
  },

    // Level 3 (2 spells)
    catnap: {
    id: "catnap",
    name: "Catnap",
    category: {
      spellType: "spell",
      school: "enchantment",
      level: 3,
      classes: ["artificer", "bard", "sorcerer", "wizard"],
      source: "Arcana Unleashed, pg. 37",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "30 ft.",
      components: "S, M (a pinch of sand)",
      duration: "10 minutes",
    },
    interaction: { type: "utility" },
    damage: [],
    upcasting: {
      notes:
        "Target one additional willing creature for each spell slot level above 3rd",
    },
    effectNotes: [
      "Up to three willing creatures within 30 feet fall Unconscious for 10 minutes (no concentration).",
      "Ends early if a target takes damage or another creature takes an action to shake it awake.",
      "If a target remains Unconscious for the full 10 minutes, it gains the full benefits of finishing a Short Rest.",
      "A creature cannot benefit from Catnap again until it finishes a Long Rest.",
      "Using a Higher-Level Spell Slot: Target one additional willing creature per slot level above 3.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Select up to 3 willing creatures (or +1 per slot level above 3).",
        "Apply Unconscious condition for 10 minutes (ends on damage or action to shake).",
        "If target remains asleep for full 10 min, grant Short Rest benefits and track 1/Long Rest lockout.",
      ],
    },
    isManualOverride: true,
    notes:
      "Arcana Unleashed, pg. 37. 10 min (no concentration). Up to 3 willing creatures fall asleep. If asleep full 10 min, gain benefits of a Short Rest (1/Long Rest limit). Upcast adds +1 creature per slot level.",
  },

  // Inflict Doubt (Arcana Unleashed, pg. 40)
  inflict_doubt: {
    id: "inflict_doubt",
    name: "Inflict Doubt",
    category: {
      spellType: "spell",
      school: "enchantment",
      level: 3,
      classes: ["bard", "sorcerer", "warlock", "wizard"],
      source: "Arcana Unleashed, pg. 40",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "120 ft.",
      components: "V, S",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "save", saveAbility: "WIS" },
    damage: [],
    effectNotes: [
      "Inflict self-doubt on a creature you can see within 120 feet.",
      "Wisdom saving throw: target must succeed on a Wisdom saving throw or have Disadvantage on D20 Tests for the duration.",
      "At the end of each of its turns, the target repeats the Wisdom save, ending the spell on itself on a success.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Target creature within 120 ft; prompt Wisdom save.",
        "Failed save: apply Disadvantage on all D20 Tests while concentration holds.",
        "Target repeats WIS save at end of each turn to clear.",
      ],
    },
    isManualOverride: true,
    notes:
      "Arcana Unleashed, pg. 40. Conc up to 1 min. 120 ft. WIS save vs Disadvantage on D20 Tests. Repeat save at end of turns.",
  },

    // Level 4 (6 spells)
    // Charm Monster (D&D Free Rules 2024, Spell Descriptions)
  charm_monster: {
    id: "charm_monster",
    name: "Charm Monster",
    category: {
      spellType: "spell",
      school: "enchantment",
      level: 4,
      classes: ["bard", "druid", "sorcerer", "warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 249",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "30 ft.",
      components: "V, S",
      duration: "1 hour",
    },
    interaction: { type: "save", saveAbility: "WIS" },
    damage: [],
    upcasting: {
      notes:
        "Target one additional creature for each spell slot level above 4.",
    },
    effectNotes: [
      "One visible creature makes a Wisdom save with Advantage if you or your allies are fighting it. On a failure, it is Charmed and Friendly to you until the spell ends or you or an ally damages it.",
      "When the spell ends, the creature knows you Charmed it.",
    ],
    isManualOverride: true,
    notes:
      "Track the Charmed condition, Friendly attitude, damage that ends the spell, and the creature's awareness afterward.",
  },

  // Compulsion (D&D Free Rules 2024, Spell Descriptions)
  compulsion: {
    id: "compulsion",
    name: "Compulsion",
    category: {
      spellType: "spell",
      school: "enchantment",
      level: 4,
      classes: ["bard"],
      source: "Player's Handbook (2024), pg. 252",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "30 ft.",
      components: "V, S",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "save", saveAbility: "WIS" },
    damage: [],
    effectNotes: [
      "Creatures of your choice that you can see in range make a Wisdom save or become Charmed for the duration. As a Bonus Action, designate a horizontal direction; each Charmed target must use as much movement as possible to move that way by the safest route, then repeat the save, ending the spell on itself on a success.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Track each failed-save target and Charmed duration. Each Bonus Action selects a direction for that turn; resolve safest-route movement and the repeat save after movement manually.",
      ],
    },
    isManualOverride: true,
    notes:
      "The direction is selected using a Bonus Action and applies to the Charmed targets' next turns; forced paths and repeat saves need manual handling.",
  },

  // Confusion (D&D Free Rules 2024, Spell Descriptions)
  confusion: {
    id: "confusion",
    name: "Confusion",
    category: {
      spellType: "spell",
      school: "enchantment",
      level: 4,
      classes: ["bard", "druid", "sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 253",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "90 ft.",
      components: "V, S, M (three nut shells)",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "save", saveAbility: "WIS" },
    area: { shape: "Sphere", sizeFeet: 10 },
    damage: [],
    upcasting: {
      notes: "+5 feet to the Sphere's radius per spell slot level above 4.",
    },
    effectNotes: [
      "Each creature in the 10-foot-radius Sphere makes a Wisdom save. On a failure, it cannot take Bonus Actions or Reactions and rolls 1d10 at the start of each turn: 1, no action and move in a random cardinal direction; 2-6, no movement or action; 7-8, no movement and one melee attack against a random creature in reach (or no action if none); 9-10, target chooses its behavior.",
      "At the end of each affected creature's turn, it repeats the Wisdom save, ending the spell on itself on a success.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Aim the 10-foot-radius Sphere and determine affected creatures; roll and track each target's start-of-turn behavior, prohibited Bonus Actions/Reactions, and end-of-turn save. Resolve random direction and random attack target manually.",
        "For upcasting, expand the Sphere radius by 5 feet per slot level above 4; the current area preview is not a 3D rules simulation.",
      ],
    },
    isManualOverride: true,
    notes:
      "The per-turn behavior table and repeated saves require separate tracking for each affected creature.",
  },

  dominate_beast: {
    id: "dominate_beast",
    name: "Dominate Beast",
    category: {
      spellType: "spell",
      school: "enchantment",
      level: 4,
      classes: ["druid", "ranger", "sorcerer"],
      source: "Player's Handbook (2024), pg. 265",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "60 ft.",
      components: "V, S",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "save", saveAbility: "WIS" },
    damage: [],
    upcasting: {
      notes:
        "Concentration can last up to 10 minutes with a level 5 slot, 1 hour with level 6, or 8 hours with level 7 or higher.",
    },
    effectNotes: [
      "One visible Beast makes a Wisdom save, with Advantage if you or your allies are fighting it. On failure, it is Charmed for the duration; whenever it takes damage, it repeats the save, ending the spell on a success.",
      "While you are on the same plane, you can telepathically issue commands on your turn without an action. The Beast tries to obey; after completing an order without new direction, it acts to protect itself. To command it to take a Reaction, you must use your own Reaction.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Confirm the target is a Beast and resolve its Wisdom save, granting Advantage if you or allies are fighting it. Track concentration, Charmed, commands and repeat saves whenever it takes damage.",
        "Track the extended duration when upcast. A command using the target's Reaction also uses the caster's Reaction; GM adjudicates behavior and obedience.",
      ],
    },
    isManualOverride: true,
    notes:
      "The target remains Charmed and does its best to obey commands; this is not automatic control. Damage prompts another save.",
  },

  staggering_smite: {
    id: "staggering_smite",
    name: "Staggering Smite",
    category: {
      spellType: "spell",
      school: "enchantment",
      level: 4,
      classes: ["paladin"],
      source: "Player's Handbook (2024), pg. 319",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 bonus action",
      range: "Self",
      components: "V",
      duration: "Instantaneous",
    },
    interaction: { type: "save", saveAbility: "WIS" },
    damage: [{ dice: "4d6", type: "psychic", isBase: true }],
    upcasting: {
      perSlotLevel: { dice: "1d6", type: "psychic" },
      notes: "+1d6 Psychic damage per slot level above 4th",
    },
    effectNotes: [
      "You cast this spell immediately after you hit a creature with a melee weapon or an Unarmed Strike.",
      "The target takes an extra 4d6 Psychic damage and must make a Wisdom saving throw.",
      "On a failed save, the target has the Stunned condition until the end of your next turn.",
      "Using a Higher-Level Spell Slot: The extra damage increases by 1d6 for each spell slot level above 4.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Cast as Bonus Action immediately after melee hit.",
        "Apply 4d6 Psychic damage.",
        "Prompt Wisdom save.",
        "Apply Stunned condition until end of caster next turn on failed save.",
      ],
    },
    isManualOverride: true,
    notes:
      "Player's Handbook (2024). Marked for detailed verification against printed book/DDB. In 2024, Bonus Action on hit; concentration removed entirely. Deals 4d6 Psychic; failed WIS save inflicts Stunned condition.",
  },

  // Zone of Amicability (Arcana Unleashed, pg. 45)
  zone_of_amicability: {
    id: "zone_of_amicability",
    name: "Zone of Amicability",
    category: {
      spellType: "spell",
      school: "enchantment",
      level: 4,
      classes: ["bard", "warlock"],
      source: "Arcana Unleashed, pg. 45",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Self (60-ft. emanation)",
      components: "V, S",
      duration: "10 minutes",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Zone radiates from you in a 60-foot Emanation for 10 minutes without concentration.",
      "Silver Tongue: When you make an ability check to influence a creature in that area, you can treat a d20 roll of 9 or lower as a 10.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Establish 60-ft Emanation centered on caster for 10 minutes (no concentration).",
        "When making social/influence ability checks against creatures in area, treat d20 rolls <= 9 as a 10.",
      ],
    },
    isManualOverride: true,
    notes:
      "Arcana Unleashed, pg. 45. 10 minutes (no concentration). 60-ft Emanation. Treat d20 rolls <= 9 as a 10 on ability checks to influence creatures in area.",
  },

    // Level 5 (6 spells)
    dominate_person: {
    id: "dominate_person",
    name: "Dominate Person",
    category: {
      spellType: "spell",
      school: "enchantment",
      level: 5,
      classes: ["bard", "sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 266",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "60 ft.",
      components: "V, S",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "save", saveAbility: "WIS" },
    damage: [],
    upcasting: {
      notes:
        "Concentration can last up to 10 minutes with a level 6 slot, 1 hour with level 7, or 8 hours with level 8 or higher.",
    },
    effectNotes: [
      "One visible Humanoid makes a Wisdom save, with Advantage if you or your allies are fighting it. On failure, it is Charmed; whenever it takes damage, it repeats the save, ending the spell on a success.",
      "While you are on the same plane, you can telepathically issue commands on your turn without an action. The target tries to obey; after completing an order without new direction, it acts to protect itself. To command it to take a Reaction, you must use your own Reaction.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Confirm target is Humanoid and resolve its Wisdom save, granting Advantage if you or allies are fighting it. Track concentration, Charmed condition, telepathic commands, and repeat saves whenever it takes damage.",
        "Track upcast duration. A command that uses the target's Reaction also consumes the caster's Reaction; GM adjudicates how the target follows commands and protects itself.",
      ],
    },
    isManualOverride: true,
    notes:
      "Damage triggers a repeat save. The target is Charmed rather than becoming an automatically controlled token; commands and behavior need table adjudication.",
  },

  geas: {
    id: "geas",
    name: "Geas",
    category: {
      spellType: "spell",
      school: "enchantment",
      level: 5,
      classes: ["bard", "cleric", "druid", "paladin", "wizard"],
      source: "Player's Handbook (2024), pg. 278",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 minute",
      range: "60 ft.",
      components: "V",
      duration: "30 days",
    },
    interaction: { type: "save", saveAbility: "WIS" },
    damage: [
      {
        dice: "5d10",
        type: "psychic",
        isBase: false,
        condition:
          "Target acts directly counter to the command; at most once each day",
      },
    ],
    upcasting: {
      notes:
        "With a level 7 or 8 slot, duration is 365 days; with a level 9 slot, it lasts until ended by Remove Curse, Greater Restoration, or Wish.",
    },
    effectNotes: [
      "Give a visible creature a verbal command to perform a service or refrain from an action. It makes a Wisdom save, automatically succeeding if it cannot understand the command. On a failure, it is Charmed for the duration and takes 5d10 Psychic damage if it directly acts against the command, no more than once per day.",
      "A command that would cause certain death ends the spell. Remove Curse, Greater Restoration, or Wish also ends it.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Record the understood command, target, Charmed duration, and daily damage limit; the GM decides whether an action directly counters the command or risks certain death.",
        "Track duration and any ending spell. Apply the 365-day duration for slot 7-8 or until-ended duration for slot 9.",
      ],
    },
    isManualOverride: true,
    notes:
      "Damage is limited to once per day, and the target automatically succeeds if it cannot understand the command.",
  },

  hold_monster: {
    id: "hold_monster",
    name: "Hold Monster",
    category: {
      spellType: "spell",
      school: "enchantment",
      level: 5,
      classes: ["bard", "sorcerer", "warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 285",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "90 ft.",
      components: "V, S, M (a straight piece of iron)",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "save", saveAbility: "WIS" },
    damage: [],
    upcasting: {
      notes: "Target one additional creature per spell slot level above 5th.",
    },
    effectNotes: [
      "A creature you can see within range makes a Wisdom save or has the Paralyzed condition for the duration. At the end of each of its turns, it repeats the save; success ends the spell on that target.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Resolve the initial Wisdom save, apply Paralyzed on failure, and track concentration. Repeat the save at the end of each affected target's turn; success ends the spell on that target.",
        "Upcasting adds one target per slot level above 5; track each target's saves and condition independently.",
      ],
    },
    isManualOverride: true,
    notes:
      "The repeat save occurs at the end of each target's turn, not at the start.",
  },

  modify_memory: {
    id: "modify_memory",
    name: "Modify Memory",
    category: {
      spellType: "spell",
      school: "enchantment",
      level: 5,
      classes: ["bard", "wizard"],
      source: "Player's Handbook (2024), pg. 299",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "30 ft.",
      components: "V, S",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "save", saveAbility: "WIS" },
    damage: [],
    upcasting: {
      notes:
        "Higher slots allow modifying older events: level 6 (up to 7 days ago), level 7 (up to 30 days ago), level 8 (up to 365 days ago), level 9 (any time in target's past).",
    },
    effectNotes: [
      "One creature you can see within 30 feet makes a Wisdom saving throw (with Advantage if you are fighting it). On a failed save, it has the Charmed and Incapacitated conditions and is unaware of surroundings (though it can hear you).",
      "If it takes damage or is targeted by another spell, the spell ends and no memories are modified.",
      "While charmed, you can describe how to reshape a memory of an event up to 10 minutes long from the last 24 hours (permanently eliminate, clarify, change details, or create a false memory). Target must understand your language.",
      "Modified memories take hold when the spell ends if description finished. Remove Curse or Greater Restoration restores original memory.",
      "Upcasting: Alter events up to 7 days ago (slot level 6), 30 days ago (slot level 7), 365 days ago (slot level 8), or any time in creature's past (slot level 9).",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Target visible creature within 30 feet; roll Wisdom save (with Advantage if in combat).",
        "On failure, apply Charmed + Incapacitated conditions and track concentration up to 1 minute. Break if damaged or targeted by another spell.",
        "Speak to describe the memory modification (up to 10 minutes duration) within the slot's timeframe (24 hrs at lv 5, 7 days at 6, 30 days at 7, 365 days at 8, entire past at 9).",
        "If full duration finishes without interruption, solidify modified memory; can be restored with Remove Curse or Greater Restoration.",
      ],
    },
    isManualOverride: true,
    notes:
      "Wisdom save (Advantage if in combat). Target is Charmed and Incapacitated while caster describes memory changes for up to 1 minute. Breaks on damage or another spell. Higher slot levels extend reachable past from 24 hours up to any time in past.",
  },

  synaptic_static: {
    id: "synaptic_static",
    name: "Synaptic Static",
    category: {
      spellType: "spell",
      school: "enchantment",
      level: 5,
      classes: ["bard", "sorcerer", "warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 330",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "120 ft. (20-ft.-radius sphere)",
      components: "V, S",
      duration: "Instantaneous",
    },
    interaction: { type: "save", saveAbility: "INT" },
    area: { shape: "Sphere", sizeFeet: 20 },
    damage: [{ dice: "8d6", type: "psychic", isBase: true }],
    effectNotes: [
      "You cause psychic energy to erupt in a 20-foot-radius sphere centered on a point within range.",
      "Each creature in that area must make an Intelligence saving throw (creatures with Intelligence 2 or lower succeed automatically).",
      "On a failed save, a target takes 8d6 Psychic damage and has muddled thoughts for 1 minute: it subtracts 1d6 from all attack rolls, ability checks, and Constitution saves to maintain concentration.",
      "On a successful save, a target takes half as much damage only.",
      "An affected creature can repeat the Intelligence saving throw at the end of each of its turns, ending the muddled thoughts on a success.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Place 20-ft radius Sphere within 120 ft.",
        "Prompt Intelligence saves for creatures inside (Int <= 2 unaffected).",
        "Apply 8d6 Psychic damage (half on save).",
        "On failed save, subtract 1d6 from attack rolls, ability checks, and concentration saves for 1 min (repeats save at end of its turns).",
      ],
    },
    isManualOverride: true,
    notes:
      "Player's Handbook (2024). Marked for detailed verification against printed book/DDB. In 2024 PHB, 20-ft sphere. Deals 8d6 Psychic on INT save; failure subtracts 1d6 from attacks, checks, and concentration saves.",
  },

  yolandes_regal_presence: {
    id: "yolandes_regal_presence",
    name: "Yolande's Regal Presence",
    category: {
      spellType: "spell",
      school: "enchantment",
      level: 5,
      classes: ["bard", "wizard"],
      source: "Player's Handbook (2024), pg. 343",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Self (10-foot Emanation)",
      components: "V, S, M (a miniature tiara)",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "save", saveAbility: "WIS" },
    area: { shape: "Emanation", sizeFeet: 10 },
    damage: [{ dice: "4d6", type: "psychic", isBase: true }],
    effectNotes: [
      "You surround yourself with an aura of majesty in a 10-foot Emanation.",
      "Whenever the Emanation enters the space of a creature you can see, or whenever a creature you can see enters the Emanation or ends its turn there, you can force that creature to make a Wisdom saving throw (once per turn).",
      "On a failed save, the target takes 4d6 Psychic damage, has the Prone condition, and you can push it up to 10 feet away.",
      "On a successful save, the target takes half as much damage only.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Place 10-ft Emanation on caster.",
        "When entering a creature's space, or when creature enters or ends turn there (once per turn): prompt Wisdom save.",
        "Apply 4d6 Psychic damage (half on save).",
        "On failed save: apply Prone condition and optionally push creature up to 10 ft away.",
      ],
    },
    isManualOverride: true,
    notes:
      "Player's Handbook (2024). Marked for detailed verification against printed book/DDB. New 2024 spell (Bard, Wizard). 10-ft Emanation. Deals 4d6 Psychic, knocks Prone, and pushes 10 ft on failed WIS save.",
  },

    // Level 6 (3 spells)
    dirge: {
    id: "dirge",
    name: "Dirge",
    category: {
      spellType: "spell",
      school: "enchantment",
      level: 6,
      classes: ["bard", "cleric"],
      source: "Forgotten Realms: Heroes of Faerûn, pg. 144",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Self",
      components: "V",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "save", saveAbility: "CON" },
    area: { shape: "Emanation", sizeFeet: 60 },
    damage: [
      {
        dice: "3d10",
        type: "necrotic",
        isBase: true,
        condition:
          "On failed CON save (half on success); failed save also knocks Prone, successful save halves speed",
      },
    ],
    effectNotes: [
      "Deathly power fills a 60-foot Emanation around you for up to 1 minute with concentration.",
      "Designate unaffected creatures on cast. Affected creatures cannot regain Hit Points while in the Emanation.",
      "Trigger: when Emanation enters creature space, or creature enters/ends turn there (once per turn): CON save.",
      "Failed save: takes 3d10 Necrotic damage and gains the Prone condition.",
      "Successful save: takes half damage and has Speed halved.",
      "Circle Spell option: With 2+ secondary casters expending 4th+ level slots, concentration extends to 10 minutes and failed saves also inflict 1 Exhaustion level (cannot be cured by Long Rest while having exhaustion).",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Place 60-ft Emanation on caster; prevent HP recovery for non-designated creatures in area.",
        "Trigger CON save (once per turn): fail = 3d10 Necrotic + Prone; success = half damage + Speed halved.",
        "Track Circle Spell mode if cast with secondary casters (10 min duration, +1 Exhaustion).",
      ],
    },
    isManualOverride: true,
    notes:
      "Forgotten Realms: Heroes of Faerûn, pg. 144. 60-ft Emanation, conc up to 1 min. Blocks healing. Triggers CON save (once per turn): 3d10 Necrotic + Prone (success = half damage + speed halved). Circle Spell mode inflicts Exhaustion.",
  },

  mass_suggestion: {
    id: "mass_suggestion",
    name: "Mass Suggestion",
    category: {
      spellType: "spell",
      school: "enchantment",
      level: 6,
      classes: ["bard", "sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 296",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "60 ft.",
      components: "V, M (a snake's tongue)",
      duration: "24 hours",
    },
    interaction: { type: "save", saveAbility: "WIS" },
    damage: [],
    upcasting: {
      notes:
        "Duration increases with higher spell slots: level 7 (10 days), level 8 (30 days), level 9 (366 days)",
    },
    effectNotes: [
      "Suggest a course of activity (25 words or fewer) to twelve or fewer visible creatures within 60 feet that can hear and understand you. Must sound achievable and not involve obvious self-harm or harm to allies.",
      "Each target makes a Wisdom saving throw. On a failure, it gains the Charmed condition for the duration or until you or your allies deal damage to it, pursuing the suggestion to the best of its ability.",
      "The spell ends for a target once the suggested activity is completed.",
      "Upcasting: Duration extends to 10 days (level 7), 30 days (level 8), or 366 days (level 9) without requiring Concentration.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "State the suggestion (<= 25 words) and resolve Wisdom saves for up to 12 creatures within 60 feet.",
        "Track the Charmed condition and the suggested activity for each failed target. End if damage is dealt or activity is completed.",
        "Track duration based on slot level (24 hours at level 6; 10 days at 7; 30 days at 8; 366 days at 9). No concentration required.",
      ],
    },
    isManualOverride: true,
    notes:
      "No concentration required. Up to 12 creatures make Wisdom saves. Damage from you or allies breaks the effect. Extended duration at 7th+ level slots.",
  },

  ottos_irresistible_dance: {
    id: "ottos_irresistible_dance",
    name: "Otto's Irresistible Dance",
    category: {
      spellType: "spell",
      school: "enchantment",
      level: 6,
      classes: ["bard", "wizard"],
      source: "Player's Handbook (2024), pg. 303",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "30 ft.",
      components: "V",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "save", saveAbility: "WIS" },
    damage: [],
    effectNotes: [
      "One creature you can see within 30 feet makes a Wisdom saving throw.",
      "On a successful save: target dances comically until the end of its next turn, during which it must spend all its movement to dance in place.",
      "On a failed save: target has the Charmed condition for the duration. While Charmed, it dances comically, must spend all its movement to dance in place, has Disadvantage on Dexterity saving throws and attack rolls, and attackers have Advantage against it.",
      "On each of its turns, the target can take an action to collect itself and repeat the Wisdom save, ending the spell on a success.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Target visible creature within 30 feet and prompt Wisdom saving throw.",
        "On success: compel comical dancing until end of its next turn (must spend all movement dancing in place).",
        "On failure: apply Charmed condition for 1 minute (no concentration in 2024); target spends all movement dancing in place, takes Disadvantage on DEX saves and attacks, and grants Advantage to attackers.",
        "Target can take an action on each turn to repeat Wisdom save to end the effect.",
      ],
    },
    isManualOverride: true,
    notes:
      "In 2024 rules, does not require concentration (1 minute duration). Even on a successful Wisdom save, the target must dance in place until the end of its next turn. On a failure, Charmed with attack/DEX save penalties until it passes an action repeat save.",
  },

    // Level 7 (3 spells)
    power_word_fortify: {
    id: "power_word_fortify",
    name: "Power Word Fortify",
    category: {
      spellType: "spell",
      school: "enchantment",
      level: 7,
      classes: ["bard", "cleric"],
      source: "Player's Handbook (2024), pg. 306",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "60 ft.",
      components: "V",
      duration: "Instantaneous",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "You speak a word of power that fortifies up to six creatures you can see within range.",
      "A pool of 120 Temporary Hit Points is divided equally among the recipients (e.g. 20 each for 6 creatures, or 120 for 1 creature).",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Select up to 6 targets within 60 ft.",
        "Divide 120 Temporary Hit Points equally among them.",
      ],
    },
    isManualOverride: true,
    notes:
      "Player's Handbook (2024). Marked for detailed verification against printed book/DDB. New 2024 spell (Bard, Cleric). Grants 120 THP split equally among up to 6 creatures.",
  },

  // Power Word Pain (Arcana Unleashed, pg. 42)
  power_word_pain: {
    id: "power_word_pain",
    name: "Power Word Pain",
    category: {
      spellType: "spell",
      school: "enchantment",
      level: 7,
      classes: ["bard", "sorcerer", "warlock", "wizard"],
      source: "Arcana Unleashed, pg. 42",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "60 ft.",
      components: "V",
      duration: "1 minute",
    },
    interaction: { type: "utility" },
    damage: [
      {
        dice: "6d8",
        type: "force",
        isBase: true,
        condition: "Deals 6d8 Force damage to target",
      },
    ],
    effectNotes: [
      "Speak a word of power at one creature within 60 feet.",
      "Target takes 6d8 Force damage.",
      "If the target has 100 HP or fewer when cast, it also gains the Charmed condition for the duration.",
      "While Charmed by this spell: Speed maximum is 10 feet, and it has Disadvantage on D20 Tests except Constitution saving throws. If it attempts to cast a spell, it must succeed on a Constitution saving throw or the spell dissipates without taking effect (action/reaction wasted, slot NOT expended).",
      "At the end of each of its turns, a Charmed target makes a Constitution saving throw, ending the spell on itself on a success.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Target creature within 60 ft; apply 6d8 Force damage.",
        "Check current HP: if 100 HP or fewer, apply Charmed condition (1 min).",
        "Charmed target: speed max 10 ft, Disadvantage on D20 Tests (except CON saves), must pass CON save to cast spells.",
        "Target repeats CON save at end of each turn to end Charmed.",
      ],
    },
    isManualOverride: true,
    notes:
      "Arcana Unleashed, pg. 42. 1 min (no concentration). 60 ft. Target takes 6d8 Force damage. If <= 100 HP, also gains Charmed: max 10 ft speed, Disadvantage on D20 tests (except CON saves), CON save needed to cast spells. Repeat CON save at end of turns.",
  },

  // Transfix (Arcana Unleashed, pg. 44)
  transfix: {
    id: "transfix",
    name: "Transfix",
    category: {
      spellType: "spell",
      school: "enchantment",
      level: 7,
      classes: ["bard", "warlock", "wizard"],
      source: "Arcana Unleashed, pg. 44",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Self",
      components: "V, S",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "save", saveAbility: "CHA" },
    damage: [
      {
        dice: "4d8",
        type: "psychic",
        isBase: true,
        condition: "Charmed target ending its turn within 5 feet of you",
      },
    ],
    upcasting: {
      perSlotLevel: { dice: "1d8", type: "psychic" },
      notes: "Damage increases by 1d8 for each spell slot level above 7",
    },
    effectNotes: [
      "Your appearance becomes otherworldly and alluring. One creature you can see within 60 feet must make a Charisma saving throw.",
      "Failed save: gains the Charmed condition for the duration.",
      "While Charmed: target has the Incapacitated condition and if more than 5 feet away, moves toward you on its turn by the most direct route to get within 5 feet.",
      "Psychic Backlash: if the Charmed creature ends its turn within 5 feet of you, it takes 4d8 Psychic damage.",
      "Doesn't avoid Opportunity Attacks; repeats save before moving into damaging terrain, ending spell on success.",
      "On subsequent turns, you can use a Magic action to target another creature within 60 feet (cannot re-target a creature that previously succeeded).",
      "Using a Higher-Level Spell Slot: Damage increases by 1d8 per slot level above 7.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Target creature within 60 ft; prompt Charisma save.",
        "Failed save: apply Charmed + Incapacitated conditions; target must move toward caster on its turns.",
        "Apply 4d8 Psychic damage if target ends turn within 5 ft of caster.",
        "Magic Action on subsequent turns: retarget a new creature within 60 ft.",
      ],
    },
    isManualOverride: true,
    notes:
      "Arcana Unleashed, pg. 44. Conc up to 1 min. 60 ft. CHA save vs Charmed + Incapacitated; moves toward caster and takes 4d8 Psychic damage if ending turn within 5 ft. Magic action retargets. Upcast +1d8.",
  },

    // Level 8 (5 spells)
    // Antipathy/Sympathy (D&D Free Rules 2024, Spell Descriptions)
  antipathy_sympathy: {
    id: "antipathy_sympathy",
    name: "Antipathy/Sympathy",
    category: {
      spellType: "spell",
      school: "enchantment",
      level: 8,
      classes: ["bard", "druid", "wizard"],
      source: "Player's Handbook (2024), pg. 242",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 hour",
      range: "60 ft.",
      components: "V, S, M (a mix of vinegar and honey)",
      duration: "10 days",
    },
    interaction: { type: "save", saveAbility: "WIS" },
    damage: [],
    effectNotes: [
      "Choose Antipathy or Sympathy, one creature or object of Huge size or smaller within range, and a kind of creature. A creature of that kind makes a Wisdom save when it comes within 120 feet of the target.",
      "Antipathy: on a failure, it is Frightened and uses its movement to get as far away as possible by the safest route. Sympathy: on a failure, it is Charmed and moves as close as possible; within 5 feet it cannot willingly move away. If the target damages it, it can repeat the save to end the effect.",
      "If an affected creature ends its turn more than 120 feet away, it repeats the save, ending the effect on a success. A creature that succeeds is immune for 1 minute.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Record the target, creature kind, selected mode, and 10-day duration; resolve the entry and end-of-turn saves, forced movement, and one-minute immunity manually.",
      ],
    },
    isManualOverride: true,
    notes:
      "The selected attraction/repulsion mode, target, creature category, forced movement and repeated saves require GM adjudication and manual tracking.",
  },

  // Befuddlement (D&D Free Rules 2024, Spell Descriptions)
  befuddlement: {
    id: "befuddlement",
    name: "Befuddlement",
    category: {
      spellType: "spell",
      school: "enchantment",
      level: 8,
      classes: ["bard", "druid", "warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 245",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "150 ft.",
      components: "V, S, M (a key ring with no keys)",
      duration: "Instantaneous",
    },
    interaction: { type: "save", saveAbility: "INT" },
    damage: [
      {
        dice: "10d12",
        type: "psychic",
        isBase: true,
        condition: "On failed save; successful save takes half damage only",
      },
    ],
    effectNotes: [
      "On a failed Intelligence save, the target takes 10d12 Psychic damage and cannot cast spells or take the Magic action. It repeats the save every 30 days, ending the effect on a success. Greater Restoration, Heal, or Wish can also end the effect.",
      "On a successful save, the target takes half damage only.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Resolve the Intelligence save and damage; on a failure, record the long-term spell/Magic-action restriction and schedule repeat saves every 30 days. Remove the effect if an ending spell succeeds; token HP and campaign-time tracking are manual.",
      ],
    },
    isManualOverride: true,
    notes:
      "The effect is instantaneous but its restriction persists until a successful 30-day repeat save or one of the listed ending spells; track it beyond the casting turn.",
  },

  dominate_monster: {
    id: "dominate_monster",
    name: "Dominate Monster",
    category: {
      spellType: "spell",
      school: "enchantment",
      level: 8,
      classes: ["bard", "sorcerer", "warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 265",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "60 ft.",
      components: "V, S",
      duration: "Concentration, up to 1 hour",
    },
    interaction: { type: "save", saveAbility: "WIS" },
    damage: [],
    upcasting: {
      notes: "Concentration can last up to 8 hours with a level 9 slot.",
    },
    effectNotes: [
      "One visible creature makes a Wisdom save, with Advantage if you or your allies are fighting it. On failure, it is Charmed for the duration; whenever it takes damage, it repeats the save, ending the spell on a success.",
      "While you are on the same plane, you can telepathically issue commands on your turn without an action. The target tries to obey; after completing an order without new direction, it acts to protect itself. To command it to take a Reaction, you must use your own Reaction.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Resolve the Wisdom save, granting Advantage if you or allies are fighting the target. Track concentration, Charmed, commands, and repeat saves whenever it takes damage.",
        "Track the 8-hour duration if cast with a level 9 slot. A command using the target's Reaction also uses the caster's Reaction; GM adjudicates behavior and obedience.",
      ],
    },
    isManualOverride: true,
    notes:
      "The target remains Charmed and does its best to obey commands; this is not automatic control. Damage prompts another save.",
  },

  glibness: {
    id: "glibness",
    name: "Glibness",
    category: {
      spellType: "spell",
      school: "enchantment",
      level: 8,
      classes: ["bard", "warlock"],
      source: "Player's Handbook (2024), pg. 279",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Self",
      components: "V",
      duration: "1 hour",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "For 1 hour, when you make a Charisma check you can replace the number rolled with 15. Magic that determines whether you are telling the truth indicates that you are truthful, regardless of what you say.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Track the 1-hour duration. Whenever the caster makes a Charisma check, allow replacing the d20 number rolled with 15; apply modifiers normally.",
        "For magic that determines truth, record that it reads the caster as truthful for the duration, even if the statement is false.",
      ],
    },
    isManualOverride: true,
    notes:
      "The replacement is the number rolled, before adding modifiers; the truth-detection clause is separate.",
  },

  power_word_stun: {
    id: "power_word_stun",
    name: "Power Word Stun",
    category: {
      spellType: "spell",
      school: "enchantment",
      level: 8,
      classes: ["bard", "sorcerer", "warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 306",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "60 ft.",
      components: "V",
      duration: "Instantaneous",
    },
    interaction: { type: "save", saveAbility: "CON" },
    damage: [],
    effectNotes: [
      "Overwhelm the mind of one visible creature within 60 feet.",
      "If the target has 150 Hit Points or fewer, it gains the Stunned condition. It makes a Constitution save at the end of each of its turns, ending the condition on a success.",
      "2024 Rules Update: If the target has more than 150 Hit Points, its Speed is reduced to 0 until the start of your next turn instead of nothing happening.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Check target HP within 60 feet.",
        "If 150 HP or fewer: apply Stunned condition; prompt Constitution save at the end of each of its turns to end.",
        "If > 150 HP: reduce Speed to 0 until start of caster's next turn.",
      ],
    },
    isManualOverride: true,
    notes:
      "Verbal only, no concentration. Stuns target with 150 HP or fewer (repeats CON save at end of its turns). In 2024 rules, targets with > 150 HP have Speed reduced to 0 until start of your next turn.",
  },

    // Level 9 (2 spells)
    power_word_heal: {
    id: "power_word_heal",
    name: "Power Word Heal",
    category: {
      spellType: "spell",
      school: "enchantment",
      level: 9,
      classes: ["bard", "cleric"],
      source: "Player's Handbook (2024), pg. 306",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "60 ft.",
      components: "V",
      duration: "Instantaneous",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "One visible creature within 60 feet regains all its Hit Points.",
      "Ends the Charmed, Frightened, Paralyzed, Poisoned, and Stunned conditions on the creature.",
      "If the creature has the Prone condition, it can use its Reaction to stand up.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Target visible creature within 60 feet: restore HP to maximum.",
        "Cleanse Charmed, Frightened, Paralyzed, Poisoned, and Stunned conditions.",
        "If target is Prone, allow it to expend Reaction to stand up immediately.",
      ],
    },
    isManualOverride: true,
    notes:
      "Verbal only. Restores target creature to full HP, cleanses Charmed, Frightened, Paralyzed, Poisoned, and Stunned conditions, and allows standing from Prone using Reaction.",
  },

  power_word_kill: {
    id: "power_word_kill",
    name: "Power Word Kill",
    category: {
      spellType: "spell",
      school: "enchantment",
      level: 9,
      classes: ["bard", "sorcerer", "warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 306",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "60 ft.",
      components: "V",
      duration: "Instantaneous",
    },
    interaction: { type: "utility" },
    damage: [
      {
        dice: "12d12",
        type: "psychic",
        isBase: false,
        condition: "If target has more than 100 Hit Points",
      },
    ],
    effectNotes: [
      "Compel one visible creature within 60 feet to die.",
      "If the target has 100 Hit Points or fewer, it dies instantly.",
      "2024 Rules Update: If the target has more than 100 Hit Points, it takes 12d12 Psychic damage instead of nothing happening.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Check target HP within 60 feet.",
        "If 100 HP or fewer: target dies immediately.",
        "If > 100 HP: roll 12d12 Psychic damage and apply to target.",
      ],
    },
    isManualOverride: true,
    notes:
      "Verbal only. Instantly kills a creature with 100 HP or fewer. In 2024 rules, if target has more than 100 HP, it takes 12d12 Psychic damage instead of the spell failing.",
  },
};
