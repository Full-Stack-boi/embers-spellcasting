/**
 * Manual Spell Formula Overrides — Abjuration (Leveled Spells 1st–9th)
 */

import type { SpellFormula } from "../../../types/spellFormula";

export const abjurationSpellOverrides: Record<string, SpellFormula> = {
    // Level 1 (10 spells)
    // Alarm (D&D Free Rules 2024, Spell Descriptions)
  alarm: {
    id: "alarm",
    name: "Alarm",
    category: {
      spellType: "spell",
      school: "abjuration",
      level: 1,
      classes: ["ranger", "wizard"],
      source: "Player's Handbook (2024), pg. 239",
      concentration: false,
      ritual: true,
    },
    casting: {
      time: "1 minute or Ritual",
      range: "30 ft.",
      components: "V, S, M (a bell and silver wire)",
      duration: "8 hours",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Ward a door, window, or area no larger than a 20-foot Cube. Choose creatures that don't trigger the alarm and choose an audible bell alert (10 seconds, within 60 feet) or a mental ping (while within 1 mile; it can wake you).",
    ],
    isManualOverride: true,
    notes:
      "Record the warded location, exempt creatures, alert mode, and trigger events manually.",
  },

  armor_of_agathys: {
    id: "armor_of_agathys",
    name: "Armor of Agathys",
    category: {
      spellType: "spell",
      school: "abjuration",
      level: 1,
      classes: ["warlock"],
      source: "Player's Handbook (2024), pg. 243",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 bonus action",
      range: "Self",
      components: "V, S, M (a cup of water)",
      duration: "1 hour",
    },
    interaction: { type: "utility" },
    damage: [
      {
        dice: "5",
        type: "cold",
        isBase: true,
        condition:
          "When a creature hits you with a melee attack roll while you have any Temporary Hit Points",
      },
    ],
    upcasting: {
      notes: "+5 Temp HP and +5 Cold damage per spell slot level above 1st",
      perSlotLevel: { dice: "5", type: "cold" },
    },
    effectNotes: [
      "A protective frost covers you, granting you 5 Temporary Hit Points.",
      "While you have any Temporary Hit Points, whenever a creature hits you with a melee attack roll, it takes 5 Cold damage.",
      "The spell ends early if you have no Temporary Hit Points.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Grant 5 Temporary Hit Points (+5 per slot level above 1st).",
        "Whenever hit by a melee attack roll while any Temporary Hit Points remain, deal 5 Cold damage (+5 per slot level above 1st) to the attacker.",
        "Spell ends when the caster has 0 Temporary Hit Points.",
      ],
    },
    isManualOverride: true,
    notes:
      "Player's Handbook (2024). Marked for detailed verification against printed book/DDB. In 2024, casting time is 1 Bonus Action. The spell ends early only when you have no Temporary Hit Points from any source, allowing refreshed THP to sustain the cold retaliation.",
  },

  // Cure Wounds (D&D Free Rules 2024, Spell Descriptions)
  cure_wounds: {
    id: "cure_wounds",
    name: "Cure Wounds",
    category: {
      spellType: "spell",
      school: "abjuration",
      level: 1,
      classes: ["bard", "cleric", "druid", "paladin", "ranger"],
      source: "Player's Handbook (2024), pg. 259",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Touch",
      components: "V, S",
      duration: "Instantaneous",
    },
    interaction: { type: "utility" },
    damage: [{ dice: "2d8", type: "healing", isBase: true }],
    upcasting: {
      notes: "+2d8 healing per spell slot level above 1st",
      perSlotLevel: { dice: "2d8", type: "healing" },
    },
    effectNotes: [
      "A creature you touch regains Hit Points equal to 2d8 plus your spellcasting ability modifier.",
    ],
    isManualOverride: true,
    notes:
      "Healing amount is rolled separately from damage; add the caster's spellcasting ability modifier. Higher-level slots add 2d8 per slot level.",
  },

  // Healing Word (D&D Free Rules 2024, Spell Descriptions)
  healing_word: {
    id: "healing_word",
    name: "Healing Word",
    category: {
      spellType: "spell",
      school: "abjuration",
      level: 1,
      classes: ["bard", "cleric", "druid"],
      source: "Player's Handbook (2024), pg. 284",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "Bonus Action",
      range: "60 ft.",
      components: "V",
      duration: "Instantaneous",
    },
    interaction: { type: "utility" },
    damage: [{ dice: "2d4", type: "healing", isBase: true }],
    upcasting: {
      notes: "+2d4 healing per spell slot level above 1st",
      perSlotLevel: { dice: "2d4", type: "healing" },
    },
    effectNotes: [
      "A creature you choose that you can see within range regains Hit Points equal to 2d4 plus your spellcasting ability modifier.",
    ],
    isManualOverride: true,
    notes:
      "Healing amount is rolled separately from damage; add the caster's spellcasting ability modifier. Higher-level slots add 2d4 per slot level.",
  },

  // Mage Armor (D&D Free Rules 2024, Spell Descriptions)
  mage_armor: {
    id: "mage_armor",
    name: "Mage Armor",
    category: {
      spellType: "spell",
      school: "abjuration",
      level: 1,
      classes: ["sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 293",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Touch",
      components: "V, S, M (a piece of cured leather)",
      duration: "8 hours",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Touch a willing creature that isn't wearing armor. Its base AC becomes 13 + its Dexterity modifier for the duration; the spell ends early if it dons armor.",
    ],
    isManualOverride: true,
    notes:
      "Update the target's base AC manually; the spell does not prevent separate bonuses (such as a shield) from applying.",
  },

  // Protection from Evil and Good (D&D Free Rules 2024, Spell Descriptions)
  protection_from_evil_and_good: {
    id: "protection_from_evil_and_good",
    name: "Protection from Evil and Good",
    category: {
      spellType: "spell",
      school: "abjuration",
      level: 1,
      classes: ["cleric", "druid", "paladin", "warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 309",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Touch",
      components: "V, S, M (Holy Water worth 25+ GP, consumed)",
      duration: "Concentration, up to 10 minutes",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Protect one willing creature against Aberrations, Celestials, Elementals, Fey, Fiends, and Undead: those creatures have Disadvantage on attack rolls against it and cannot possess, Charm, or Frighten it.",
      "If the target is already possessed, Charmed, or Frightened by one of those creature types, it has Advantage on new saves against the relevant effect.",
    ],
    isManualOverride: true,
    notes:
      "Check attacker/condition source types and track concentration; apply the relevant roll and condition protections manually.",
  },

  // Sanctuary (D&D Free Rules 2024, Spell Descriptions)
  sanctuary: {
    id: "sanctuary",
    name: "Sanctuary",
    category: {
      spellType: "spell",
      school: "abjuration",
      level: 1,
      classes: ["cleric"],
      source: "Player's Handbook (2024), pg. 313",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "Bonus Action",
      range: "30 ft.",
      components: "V, S, M (a shard of glass from a mirror)",
      duration: "1 minute",
    },
    interaction: { type: "save", saveAbility: "WIS" },
    damage: [],
    effectNotes: [
      "Until the spell ends, a creature that targets the warded creature with an attack roll or damaging spell makes a Wisdom save; on a failure it must choose a new target or lose the attack or spell. Areas of effect bypass this protection.",
      "The spell ends if the warded creature makes an attack roll, casts a spell, or deals damage.",
    ],
    isManualOverride: true,
    notes:
      "Apply protection and the three ending triggers manually; the ward does not protect from areas of effect.",
  },

  // Shield (D&D Free Rules 2024, Spell Descriptions)
  shield: {
    id: "shield",
    name: "Shield",
    category: {
      spellType: "spell",
      school: "abjuration",
      level: 1,
      classes: ["sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 316",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "Reaction, when hit by an attack roll or targeted by Magic Missile",
      range: "Self",
      components: "V, S",
      duration: "Until the start of your next turn",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Gain a +5 bonus to AC, including against the triggering attack, until the start of your next turn. You also take no damage from Magic Missile for that duration.",
    ],
    isManualOverride: true,
    notes:
      "Resolve the reaction timing and temporary AC bonus manually; the AC increase can cause the triggering attack to miss.",
  },

  // Shield of Faith (D&D Free Rules 2024, Spell Descriptions)
  shield_of_faith: {
    id: "shield_of_faith",
    name: "Shield of Faith",
    category: {
      spellType: "spell",
      school: "abjuration",
      level: 1,
      classes: ["cleric", "paladin"],
      source: "Player's Handbook (2024), pg. 316",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "Bonus Action",
      range: "60 ft.",
      components: "V, S, M (a prayer scroll)",
      duration: "Concentration, up to 10 minutes",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "A creature of your choice within range gains a +2 bonus to AC for the duration.",
    ],
    isManualOverride: true,
    notes:
      "Track the target's AC bonus and the caster's concentration manually.",
  },

  // Wardaway (Forgotten Realms: Heroes of Faerûn, pg. 147)
  wardaway: {
    id: "wardaway",
    name: "Wardaway",
    category: {
      spellType: "spell",
      school: "abjuration",
      level: 1,
      classes: ["bard", "cleric", "paladin", "wizard"],
      source: "Forgotten Realms: Heroes of Faerûn, pg. 147",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "60 ft.",
      components: "V, S, M (a miniature clay hand)",
      duration: "Instantaneous",
    },
    interaction: { type: "save", saveAbility: "CON" },
    damage: [
      {
        dice: "2d4",
        type: "force",
        isBase: true,
        condition:
          "Failed Constitution save (half on success, no speed/action penalty)",
      },
    ],
    upcasting: {
      perSlotLevel: { dice: "2d4", type: "force" },
      notes: "Damage increases by 2d4 for each spell slot level above 1",
    },
    effectNotes: [
      "Hurl disorienting magical force toward one creature within 60 feet.",
      "Constitution saving throw (Constructs and Undead automatically succeed).",
      "Failed save: takes 2d4 Force damage, Speed is halved until start of your next turn, and on its next turn, it can take only an action or a Bonus Action (not both).",
      "Successful save: takes half damage only.",
      "Using a Higher-Level Spell Slot: Damage increases by 2d4 per slot level above 1.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Target creature within 60 ft; prompt Constitution save (Constructs/Undead auto-succeed).",
        "Failed save: deal 2d4 Force damage, halve Speed until next turn start, restrict to action OR bonus action on next turn.",
        "Successful save: deal half damage only.",
      ],
    },
    isManualOverride: true,
    notes:
      "Forgotten Realms: Heroes of Faerûn, pg. 147. 60 ft. CON save (Constructs/Undead auto-succeed) vs 2d4 Force + Speed halved + action or bonus action restriction. Upcast +2d4.",
  },

    // Level 2 (11 spells)
    // Aid (D&D Free Rules 2024, Spell Descriptions)
  aid: {
    id: "aid",
    name: "Aid",
    category: {
      spellType: "spell",
      school: "abjuration",
      level: 2,
      classes: ["bard", "cleric", "druid", "paladin", "ranger"],
      source: "Player's Handbook (2024), pg. 239",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "30 ft.",
      components: "V, S, M (a strip of white cloth)",
      duration: "8 hours",
    },
    interaction: { type: "utility" },
    damage: [],
    upcasting: {
      notes:
        "Each target's current and maximum Hit Points increase by 5 more for each slot level above 2nd.",
    },
    effectNotes: [
      "Choose up to three creatures within range. Each target's current Hit Points and Hit Point maximum increase by 5 for the duration.",
    ],
    isManualOverride: true,
    notes:
      "Adjust both current and maximum Hit Points for each target; restore their previous maximum when the duration ends.",
  },

  // Arcane Lock (D&D Free Rules 2024, Spell Descriptions)
  arcane_lock: {
    id: "arcane_lock",
    name: "Arcane Lock",
    category: {
      spellType: "spell",
      school: "abjuration",
      level: 2,
      classes: ["wizard"],
      source: "Player's Handbook (2024), pg. 242",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Touch",
      components: "V, S, M (gold dust worth 25+ GP, consumed)",
      duration: "Until dispelled",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Magically lock a closed door, window, gate, container, or hatch. Nonmagical means cannot unlock it. Creatures designated when the spell is cast can open and close it. A password spoken within 5 feet unlocks it for 1 minute.",
    ],
    isManualOverride: true,
    notes:
      "Record the affected object and designated creatures; adjudicate attempts to break or pick the lock using the applicable 2024 rule text.",
  },

    // 2nd Level
      // Arcane Vigor (Player's Handbook 2024, pg. 242) — Abjuration
    arcane_vigor: {
    id: "arcane_vigor",
    name: "Arcane Vigor",
    category: {
      spellType: "spell",
      school: "abjuration",
      level: 2,
      classes: ["artificer", "sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 242",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 bonus action",
      range: "Self",
      components: "V, S",
      duration: "Instantaneous",
    },
    interaction: { type: "utility" },
    damage: [],
    upcasting: {
      notes:
        "Each slot level above 2nd increases by one the maximum number of Hit Dice you can roll.",
    },
    effectNotes: [
      "Roll one or two unexpended Hit Dice and regain Hit Points equal to their total plus your spellcasting ability modifier. The rolled Hit Dice are expended.",
      "At higher slot levels, the maximum number of Hit Dice you can roll increases by one per slot level above 2nd.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Choose one or more available Hit Dice, up to the spell's limit for the slot used.",
        "Roll and expend those Hit Dice, then add the spellcasting ability modifier to the healing total.",
        "Update the character's Hit Dice and Hit Points; Embers does not currently track either resource for this spell.",
      ],
    },
    isManualOverride: true,
    notes:
      "Self-healing only. This formula records the Hit Dice cost and upcast limit; resource consumption and healing are handled manually.",
  },

  disruptive_tune: {
    id: "disruptive_tune",
    name: "Disruptive Tune",
    category: {
      spellType: "spell",
      school: "abjuration",
      level: 2,
      classes: ["bard", "sorcerer", "wizard"],
      source: "Arcana Unleashed, pg. 38",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "120 ft.",
      components: "V, S",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "save", saveAbility: "CON" },
    area: { shape: "Sphere", sizeFeet: 20 },
    damage: [],
    effectNotes: [
      "A jarring melody fills a 20-foot-radius Sphere within 120 feet for up to 1 minute with concentration.",
      "Each creature in the Sphere must make a Constitution saving throw.",
      "On a failed save, the creature loses Concentration on any active spell or effect, and has Disadvantage on Constitution saving throws to maintain Concentration for the duration of this spell.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Place 20-ft-radius Sphere within 120 ft.",
        "Prompt CON save for creatures in area.",
        "On failed save: break current Concentration and impose Disadvantage on Concentration saves for duration.",
      ],
    },
    isManualOverride: true,
    notes:
      "Arcana Unleashed, pg. 38. 20-ft radius Sphere within 120 ft, conc up to 1 min. CON save: breaks target's Concentration and imposes Disadvantage on future Concentration saves for duration.",
  },

  dueling_ground: {
    id: "dueling_ground",
    name: "Dueling Ground",
    category: {
      spellType: "spell",
      school: "abjuration",
      level: 2,
      classes: [
        "artificer",
        "bard",
        "cleric",
        "druid",
        "paladin",
        "ranger",
        "sorcerer",
        "warlock",
        "wizard",
      ],
      source: "Arcana Unleashed, pg. 38",
      concentration: false,
      ritual: true,
    },
    casting: {
      time: "10 minutes",
      range: "Touch",
      components: "V, S, M (a silk flag worth 100+ GP)",
      duration: "1 hour",
    },
    interaction: { type: "utility" },
    area: { shape: "Sphere", sizeFeet: 15 },
    damage: [],
    upcasting: {
      notes:
        "Target one additional willing creature for each spell slot level above 2nd",
    },
    effectNotes: [
      "Creates a 15-foot-radius Sphere bounded by glowing runes on touched ground for 1 hour without concentration.",
      "Designate two willing creatures as duelists. Spell ends early if any other creature enters the Sphere.",
      "Non-lethal protection: If a duelist drops to 0 Hit Points, it is Stable and teleports to the nearest unoccupied space outside the Sphere.",
      "If subjected to an effect that kills instantly without dealing damage, target doesn't die and instead has 0 HP, Unconscious, Stable, and teleports outside.",
      "When only one duelist remains, runes flash like a crown over its head.",
      "Using a Higher-Level Spell Slot: Target one additional willing creature per slot level above 2.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Verify 100+ GP silk flag focus.",
        "Place 15-ft dueling circle on touched ground.",
        "Designate 2 duelists (or +1 per slot level above 2); dismiss if non-duelist enters.",
        "Auto-stabilize and teleport out any duelist dropping to 0 HP.",
      ],
    },
    isManualOverride: true,
    notes:
      "Arcana Unleashed, pg. 38. Ritual. 1 hour (no concentration), 100+ GP flag. 15-ft dueling circle for 2 willing duelists (+1 per upcast level). Prevents death: drops to 0 HP teleports duelist outside Stable and Unconscious. Ends if intruder enters.",
  },

  elminsters_elusion: {
    id: "elminsters_elusion",
    name: "Elminster's Elusion",
    category: {
      spellType: "spell",
      school: "abjuration",
      level: 2,
      classes: ["wizard"],
      source: "Forgotten Realms: Heroes of Faerûn, pg. 144",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 bonus action",
      range: "Self",
      components: "V, S",
      duration: "Concentration, up to 10 minutes",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Arcane wards protect you for up to 10 minutes with concentration.",
      "You have Advantage on saving throws against spells and other magical effects.",
      "Spell Evasion: If you succeed on a saving throw against a spell or magical effect that allows half damage on success, you instead take no damage.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Cast as Bonus Action; track concentration up to 10 minutes.",
        "Grant caster Advantage on saving throws against spells and magical effects.",
        "Apply Spell Evasion (take 0 damage on successful save against half-damage magical effects).",
      ],
    },
    isManualOverride: true,
    notes:
      "Forgotten Realms: Heroes of Faerûn, pg. 144. Bonus Action, conc up to 10 min. Grants Advantage on saving throws vs spells and magical effects, plus Spell Evasion (take 0 damage on successful save).",
  },

  // Lesser Restoration (D&D Free Rules 2024, Spell Descriptions)
  lesser_restoration: {
    id: "lesser_restoration",
    name: "Lesser Restoration",
    category: {
      spellType: "spell",
      school: "abjuration",
      level: 2,
      classes: ["bard", "cleric", "druid", "paladin", "ranger"],
      source: "Player's Handbook (2024), pg. 291",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "Bonus Action",
      range: "Touch",
      components: "V, S",
      duration: "Instantaneous",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Touch a creature and end one condition on it: Blinded, Deafened, Paralyzed, or Poisoned.",
    ],
    isManualOverride: true,
    notes:
      "Choose one listed condition and remove it from the target manually.",
  },

  // Pass without Trace (D&D Free Rules 2024, Spell Descriptions)
  pass_without_trace: {
    id: "pass_without_trace",
    name: "Pass without Trace",
    category: {
      spellType: "spell",
      school: "abjuration",
      level: 2,
      classes: ["druid", "ranger"],
      source: "Player's Handbook (2024), pg. 303",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Self (30-ft. Emanation)",
      components: "V, S, M (ashes from burned mistletoe)",
      duration: "Concentration, up to 1 hour",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "You and creatures you choose in the Emanation gain a +10 bonus to Dexterity (Stealth) checks and leave no tracks while in the aura.",
    ],
    isManualOverride: true,
    notes:
      "Track which creatures are included, their presence in the Emanation, the Stealth bonus, and concentration.",
  },

  // Prayer of Healing (Player's Handbook 2024, pg. 307)
  prayer_of_healing: {
    id: "prayer_of_healing",
    name: "Prayer of Healing",
    category: {
      spellType: "spell",
      school: "abjuration",
      level: 2,
      classes: ["cleric", "paladin"],
      source: "Player's Handbook (2024), pg. 307",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "10 minutes",
      range: "30 ft.",
      components: "V",
      duration: "Instantaneous",
    },
    interaction: { type: "utility" },
    damage: [{ dice: "2d8", type: "healing", isBase: true }],
    upcasting: {
      notes: "+1d8 healing per slot level above 2nd.",
      perSlotLevel: { dice: "1d8", type: "healing" },
    },
    effectNotes: [
      "Up to five chosen creatures who remain within 30 feet for the entire casting gain Short Rest benefits and regain 2d8 Hit Points. A creature cannot benefit from this spell again until it finishes a Long Rest.",
    ],
    isManualOverride: true,
    notes:
      "Track eligible creatures, confirm they remain in range for all 10 minutes, and record each affected creature's Long Rest restriction.",
  },

  // Protection from Poison (D&D Free Rules 2024, Spell Descriptions)
  protection_from_poison: {
    id: "protection_from_poison",
    name: "Protection from Poison",
    category: {
      spellType: "spell",
      school: "abjuration",
      level: 2,
      classes: ["cleric", "druid", "paladin", "ranger"],
      source: "Player's Handbook (2024), pg. 310",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Touch",
      components: "V, S",
      duration: "1 hour",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "End the Poisoned condition on a touched creature. For 1 hour, it has Advantage on saving throws to avoid or end the Poisoned condition and Resistance to Poison damage.",
    ],
    isManualOverride: true,
    notes:
      "Remove Poisoned if present, then track the hour-long saving throw benefit and Poison damage Resistance.",
  },

  warding_bond: {
    id: "warding_bond",
    name: "Warding Bond",
    category: {
      spellType: "spell",
      school: "abjuration",
      level: 2,
      classes: ["cleric", "paladin"],
      source: "Player's Handbook (2024), pg. 340",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Touch",
      components:
        "V, S, M (a pair of platinum rings worth 50+ GP each, which you and the target must wear for the duration)",
      duration: "1 hour",
    },
    damage: [],
    effectNotes: [
      "Touch a willing creature, creating a mystic connection for 1 hour.",
      "While within 60 feet of you: target gains +1 bonus to AC and saving throws, and Resistance to all damage.",
      "Each time the target takes damage, you take the same amount of damage.",
      "Ends if you drop to 0 Hit Points, if separated by more than 60 feet, or if cast again on either creature.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Verify pair of 50+ GP platinum rings worn by caster and target.",
        "Grant target +1 AC, +1 saving throws, and Resistance to all damage while within 60 feet.",
        "Mirror all damage taken by target onto caster.",
        "End if separated >60 ft, caster drops to 0 HP, or recast.",
      ],
    },
    isManualOverride: true,
    notes:
      "Touch, 1 hour (no concentration), requires pair of 50+ GP platinum rings. Target gains +1 AC, +1 saves, and Resistance to all damage while within 60 ft. Caster takes identical damage whenever target takes damage. Ends if separated >60 ft or caster drops to 0 HP.",
  },

    // Level 3 (10 spells)
    aura_of_vitality: {
    id: "aura_of_vitality",
    name: "Aura of Vitality",
    category: {
      spellType: "spell",
      school: "abjuration",
      level: 3,
      classes: ["cleric", "druid", "paladin"],
      source: "Player's Handbook (2024), pg. 244",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Self (30-ft. emanation)",
      components: "V",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "utility" },
    area: { shape: "Sphere", sizeFeet: 30 },
    damage: [
      {
        dice: "2d6",
        type: "healing",
        isBase: true,
        condition:
          "Healing to one creature in the aura when cast and at the start of each of your turns",
      },
    ],
    effectNotes: [
      "Healing energy radiates from you in a 30-foot Emanation for the duration.",
      "When you cast the spell and at the start of each of your subsequent turns, you can cause one creature in the emanation (which can be you) to regain 2d6 Hit Points.",
      "Does not require a Bonus Action to trigger healing on subsequent turns.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Place and attach a 30-ft Emanation aura to caster.",
        "Track concentration up to 1 minute.",
        "Automatically prompt 2d6 HP healing for one target within the aura upon cast and at start of each subsequent turn.",
      ],
    },
    isManualOverride: true,
    notes:
      "Player's Handbook (2024). Marked for detailed verification against printed book/DDB. In 2024, moved to Abjuration and added to Cleric, Druid, and Paladin base spell lists. Triggers healing automatically upon cast and at start of each turn without consuming a Bonus Action.",
  },

  // Beacon of Hope (D&D Free Rules 2024, Spell Descriptions)
  beacon_of_hope: {
    id: "beacon_of_hope",
    name: "Beacon of Hope",
    category: {
      spellType: "spell",
      school: "abjuration",
      level: 3,
      classes: ["cleric"],
      source: "Player's Handbook (2024), pg. 245",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "30 ft.",
      components: "V, S",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Choose any number of creatures within range. For the duration, each has Advantage on Wisdom saving throws and Death Saving Throws, and regains the maximum possible Hit Points from healing.",
    ],
    isManualOverride: true,
    notes:
      "Track chosen creatures and concentration; apply maximum healing only while the spell affects each target.",
  },

  // Counterspell (D&D Free Rules 2024, Spell Descriptions)
  counterspell: {
    id: "counterspell",
    name: "Counterspell",
    category: {
      spellType: "spell",
      school: "abjuration",
      level: 3,
      classes: ["sorcerer", "warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 258",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "Reaction, when you see a creature within 60 feet casting a spell with Verbal, Somatic, or Material components",
      range: "60 ft.",
      components: "S",
      duration: "Instantaneous",
    },
    interaction: { type: "save", saveAbility: "CON" },
    damage: [],
    effectNotes: [
      "The caster of the triggering spell makes a Constitution save. On a failure, the spell dissipates, and the action, Bonus Action, or Reaction used to cast it is wasted; any spell slot used for it is not expended.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Confirm the trigger is visible and the target spell has Verbal, Somatic, or Material components. Resolve a Constitution save for the triggering caster; on failure, cancel the spell and its action but do not expend its spell slot.",
      ],
    },
    isManualOverride: true,
    notes:
      "2024 Counterspell uses a Constitution saving throw, not a spellcasting ability check; on failure, the target's slot is retained.",
  },

  dispel_magic: {
    id: "dispel_magic",
    name: "Dispel Magic",
    category: {
      spellType: "spell",
      school: "abjuration",
      level: 3,
      classes: [
        "bard",
        "cleric",
        "druid",
        "paladin",
        "ranger",
        "sorcerer",
        "warlock",
        "wizard",
      ],
      source: "Player's Handbook (2024), pg. 265",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "120 ft.",
      components: "V, S",
      duration: "Instantaneous",
    },
    interaction: { type: "utility" },
    damage: [],
    upcasting: {
      notes:
        "A spell on the target ends automatically if its level is equal to or lower than the slot used; otherwise resolve the spellcasting ability check (DC 10 + spell level).",
    },
    effectNotes: [
      "Choose one creature, object, or magical effect in range. Ongoing spells of level 3 or lower on it end. For each ongoing spell of level 4 or higher, make a spellcasting ability check against DC 10 + that spell's level; on a success, that spell ends.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Identify ongoing spells on the chosen target, compare their levels with the slot used, and resolve each required spellcasting ability check separately. Remove only effects that end; Embers does not inspect or remove other active spell effects automatically.",
      ],
    },
    isManualOverride: true,
    notes:
      "When upcast, the automatic-ending threshold equals the slot level; higher-level spells still require separate checks.",
  },

  glyph_of_warding: {
    id: "glyph_of_warding",
    name: "Glyph of Warding",
    category: {
      spellType: "spell",
      school: "abjuration",
      level: 3,
      classes: ["bard", "cleric", "wizard"],
      source: "Player's Handbook (2024), pg. 279",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 hour",
      range: "Touch",
      components: "V, S, M (powdered diamond worth 200+ GP, consumed)",
      duration: "Until dispelled or triggered",
    },
    interaction: { type: "save", saveAbility: "DEX" },
    damage: [
      {
        dice: "5d8",
        type: "acid",
        isBase: false,
        condition:
          "Explosive Rune; choose Acid, Cold, Fire, Lightning, or Thunder",
      },
    ],
    upcasting: {
      notes:
        "+1d8 Explosive Rune damage per slot level above 3; Spell Glyph can store a spell up to the level of the slot used.",
    },
    effectNotes: [
      "Inscribe a nearly imperceptible glyph on a surface or inside a closable object, no more than 10 feet in diameter; moving its surface/object more than 10 feet ends the spell. Set a trigger, optional creature-type conditions/password, and choose an Explosive Rune or Spell Glyph. Detecting it requires a Wisdom (Perception) check against your spell save DC.",
      "Explosive Rune: when triggered, creatures in a 20-foot-radius Sphere make Dexterity saves against 5d8 chosen Acid, Cold, Fire, Lightning, or Thunder damage, half on success. Spell Glyph: store a prepared spell targeting one creature or an area; it has no immediate effect and triggers against the creature that triggered it or centers its area on that creature. A stored Concentration spell lasts its full duration.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Record inscription location/object, trigger and exclusions, rune/glyph mode, stored spell and slot, and consumed diamond cost. Track the 10-foot movement limit and duration.",
        "On trigger, end the glyph and resolve the explosive rune save/damage or cast the stored spell using its trigger-based target/area rules. For explosive runes, upcast adds 1d8 per slot level; spell glyph can store a spell no higher than the slot used.",
      ],
    },
    isManualOverride: true,
    notes:
      "The trigger definition, stored spell, movement limit, and triggered resolution all require explicit manual tracking.",
  },

  magic_circle: {
    id: "magic_circle",
    name: "Magic Circle",
    category: {
      spellType: "spell",
      school: "abjuration",
      level: 3,
      classes: ["cleric", "paladin", "warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 293",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 minute",
      range: "10 ft.",
      components: "V, S, M (salt and powdered silver worth 100+ GP, consumed)",
      duration: "1 hour",
    },
    interaction: { type: "utility" },
    area: { shape: "Cylinder", sizeFeet: 10 },
    damage: [],
    upcasting: { notes: "+1 hour duration per spell slot level above 3rd" },
    effectNotes: [
      "Create a 10-foot-radius, 20-foot-tall Cylinder of magical energy centered on a point on the ground within range. Choose one or more creature types: Celestials, Elementals, Fey, Fiends, or Undead.",
      "Chosen creatures cannot willingly enter the Cylinder nonmagically, and must succeed on a Charisma saving throw to enter via teleportation or planar travel. They have Disadvantage on attack rolls against targets inside, and cannot possess, Charm, or Frighten targets inside.",
      "You can invert the circle at casting so its magic prevents the chosen creature type from leaving the Cylinder and protects targets outside.",
      "Upcasting: The duration increases by 1 hour for each slot level above 3.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Place the 10-foot-radius, 20-foot-tall Cylinder and record chosen creature type(s) and whether the barrier is standard or inverted.",
        "Adjudicate entry/exit barriers, Charisma saves against teleportation, Disadvantage on attacks against protected targets, and immunity to Charm/Frighten/possession.",
        "Track duration (1 hour base, +1 hour per upcast slot level above 3).",
      ],
    },
    isManualOverride: true,
    notes:
      "Salt and powdered silver (100+ GP) is consumed. Can be cast inverted to trap creatures inside. Upcasting extends duration by 1 hour per slot level above 3.",
  },

  mass_healing_word: {
    id: "mass_healing_word",
    name: "Mass Healing Word",
    category: {
      spellType: "spell",
      school: "abjuration",
      level: 3,
      classes: ["bard", "cleric"],
      source: "Player's Handbook (2024), pg. 296",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "Bonus Action",
      range: "60 ft.",
      components: "V",
      duration: "Instantaneous",
    },
    interaction: { type: "utility" },
    damage: [{ dice: "2d4", type: "healing", isBase: true }],
    upcasting: {
      notes: "+1d4 healing per spell slot level above 3rd",
      perSlotLevel: { dice: "1d4", type: "healing" },
    },
    effectNotes: [
      "Up to six creatures of your choice that you can see within 60 feet regain Hit Points equal to 2d4 plus your spellcasting ability modifier.",
      "Upcasting: The healing increases by 1d4 for each spell slot level above 3.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Select up to 6 visible target creatures within 60 feet.",
        "Roll 2d4 + spellcasting ability modifier (+1d4 per slot level above 3) and apply healing to each target.",
      ],
    },
    isManualOverride: true,
    notes:
      "In 2024 rules, Mass Healing Word is Abjuration (previously Evocation). Heals up to 6 visible creatures as a Bonus Action.",
  },

  nondetection: {
    id: "nondetection",
    name: "Nondetection",
    category: {
      spellType: "spell",
      school: "abjuration",
      level: 3,
      classes: ["bard", "ranger", "wizard"],
      source: "Player's Handbook (2024), pg. 302",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Touch",
      components: "V, S, M (diamond dust worth 25+ GP, consumed)",
      duration: "8 hours",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Touch a willing creature, or a place or object no larger than 10 feet in any dimension, hiding it from Divination spells for 8 hours.",
      "The target cannot be targeted by any Divination spell or perceived through magical scrying sensors.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Verify 25+ GP diamond dust is consumed. Record touched target and 8-hour duration.",
        "Prevent Divination spell targeting and scrying sensor perception.",
      ],
    },
    isManualOverride: true,
    notes:
      "Diamond dust (25+ GP) is consumed. Lasts 8 hours without concentration. Protects target from Divination spells and scrying sensors.",
  },

  protection_from_energy: {
    id: "protection_from_energy",
    name: "Protection from Energy",
    category: {
      spellType: "spell",
      school: "abjuration",
      level: 3,
      classes: ["cleric", "druid", "ranger", "sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 309",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Touch",
      components: "V, S",
      duration: "Concentration, up to 1 hour",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Touch a willing creature: for the duration, it gains Resistance to one damage type of your choice: Acid, Cold, Fire, Lightning, or Thunder.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Touch willing creature; select Acid, Cold, Fire, Lightning, or Thunder.",
        "Apply Resistance to chosen damage type and track concentration up to 1 hour.",
      ],
    },
    isManualOverride: true,
    notes:
      "Touch a willing creature to grant Resistance to Acid, Cold, Fire, Lightning, or Thunder for up to 1 hour with concentration.",
  },

  remove_curse: {
    id: "remove_curse",
    name: "Remove Curse",
    category: {
      spellType: "spell",
      school: "abjuration",
      level: 3,
      classes: ["cleric", "paladin", "warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 312",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Touch",
      components: "V, S",
      duration: "Instantaneous",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "At your touch, all curses affecting one creature or object end.",
      "If the object is a cursed magic item, its curse remains, but the spell breaks its owner's Attunement to the object so it can be removed or discarded.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Touch target creature or object; remove active curses.",
        "If touching a cursed magic item, break owner's Attunement so item can be unequipped/discarded.",
      ],
    },
    isManualOverride: true,
    notes:
      "Touch. Ends all curses on target creature or object. If object is a cursed magic item, breaks owner's Attunement so it can be removed or discarded.",
  },

    // Level 4 (8 spells)
    // Aura of Life (D&D Free Rules 2024, Spell Descriptions)
  aura_of_life: {
    id: "aura_of_life",
    name: "Aura of Life",
    category: {
      spellType: "spell",
      school: "abjuration",
      level: 4,
      classes: ["cleric", "paladin"],
      source: "Player's Handbook (2024), pg. 244",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Self (30-ft. Emanation)",
      components: "V",
      duration: "Concentration, up to 10 minutes",
    },
    interaction: { type: "utility" },
    area: { shape: "Sphere", sizeFeet: 30 },
    damage: [],
    effectNotes: [
      "You and allies in the Emanation have Resistance to Necrotic damage, and their Hit Point maximums cannot be reduced. An ally with 0 Hit Points who starts its turn in the Emanation regains 1 Hit Point.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Track the moving Emanation and concentration; apply Necrotic Resistance and prevent maximum-HP reduction only while eligible creatures are inside. Restore 1 HP at the start of an ally's turn at 0 HP in the aura.",
      ],
    },
    isManualOverride: true,
    notes:
      "Aura membership and the start-of-turn healing trigger are tracked manually; the healing is 1 HP, not a roll.",
  },

  aura_of_purity: {
    id: "aura_of_purity",
    name: "Aura of Purity",
    category: {
      spellType: "spell",
      school: "abjuration",
      level: 4,
      classes: ["cleric", "paladin"],
      source: "Player's Handbook (2024), pg. 244",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Self (30-ft. emanation)",
      components: "V",
      duration: "Concentration, up to 10 minutes",
    },
    interaction: { type: "utility" },
    damage: [],
    area: { shape: "Sphere", sizeFeet: 30 },
    effectNotes: [
      "Purifying energy radiates from you in a 30-foot Emanation for the duration.",
      "You and your allies in the emanation have Resistance to Poison damage.",
      "You and your allies in the emanation have Advantage on saving throws to avoid or end the Blinded, Charmed, Deafened, Frightened, Paralyzed, Poisoned, and Stunned conditions.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Place and attach a 30-ft Emanation aura to caster.",
        "Track concentration up to 10 minutes.",
        "Grant Poison damage Resistance to caster and allies inside.",
        "Grant Advantage on saves vs Blinded, Charmed, Deafened, Frightened, Paralyzed, Poisoned, and Stunned.",
      ],
    },
    isManualOverride: true,
    notes:
      "Player's Handbook (2024). Marked for detailed verification against printed book/DDB. In 2024, available to Cleric and Paladin. Provides Poison resistance and Advantage on saving throws against 7 conditions (diseases removed).",
  },

  backlash: {
    id: "backlash",
    name: "Backlash",
    category: {
      spellType: "spell",
      school: "abjuration",
      level: 4,
      classes: ["bard", "sorcerer", "warlock", "wizard"],
      source: "Forgotten Realms: Heroes of Faerûn, pg. 142",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 reaction",
      range: "60 ft.",
      components: "V",
      duration: "Instantaneous",
    },
    interaction: { type: "save", saveAbility: "CON" },
    damage: [
      {
        dice: "4d6",
        type: "force",
        isBase: true,
        condition:
          "Retaliation Force damage on failed CON save (half on success)",
      },
    ],
    upcasting: {
      perSlotLevel: { dice: "1d6", type: "force" },
      notes:
        "+1d6 damage reduction and +1d6 Force damage per slot level above 4th",
    },
    effectNotes: [
      "Casting Trigger: Taken in response to taking damage.",
      "Reduce the triggering damage taken by 4d6 plus your spellcasting ability modifier.",
      "If the triggering damage was from a creature within 60 feet, force the creature to make a Constitution saving throw.",
      "Target takes 4d6 Force damage on a failed save, or half as much on a successful one.",
      "Using a Higher-Level Spell Slot: Both the damage reduction and the Force damage increase by 1d6 for each spell slot level above 4.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Trigger Reaction on taking damage.",
        "Roll 4d6 + mod (+1d6 per slot level above 4) and reduce damage taken.",
        "If attacker is within 60 ft, prompt CON save for 4d6 Force (+1d6/level, half on save).",
      ],
    },
    isManualOverride: true,
    notes:
      "Forgotten Realms: Heroes of Faerûn, pg. 142. Reaction on taking damage: reduce damage by 4d6 + mod, and attacker within 60 ft makes CON save vs 4d6 Force (half on save). Upcasts +1d6 reduction and +1d6 Force damage/level.",
  },

  // Banishment (D&D Free Rules 2024, Spell Descriptions)
  banishment: {
    id: "banishment",
    name: "Banishment",
    category: {
      spellType: "spell",
      school: "abjuration",
      level: 4,
      classes: ["cleric", "paladin", "sorcerer", "warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 245",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "30 ft.",
      components: "V, S, M (a pentacle)",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "save", saveAbility: "CHA" },
    damage: [],
    upcasting: {
      notes:
        "Target one additional creature for each spell slot level above 4.",
    },
    effectNotes: [
      "On a failed Charisma save, transport one visible creature to a harmless demiplane; it is Incapacitated until the spell ends, then returns to its original space or the nearest unoccupied space.",
      "If the target is an Aberration, Celestial, Elemental, Fey, or Fiend and the spell lasts the full minute, it instead goes to a random location on a plane associated with its creature type (GM's choice).",
    ],
    isManualOverride: true,
    notes:
      "Track concentration, the target's creature type, and its return or alternate-plane destination.",
  },

  death_ward: {
    id: "death_ward",
    name: "Death Ward",
    category: {
      spellType: "spell",
      school: "abjuration",
      level: 4,
      classes: ["cleric", "paladin"],
      source: "Player's Handbook (2024), pg. 261",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Touch",
      components: "V, S",
      duration: "8 hours",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "The first time the target would drop to 0 Hit Points, it drops to 1 Hit Point instead and the spell ends. If still active when an effect would kill the target instantly without dealing damage, that effect is negated against the target and the spell ends.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Record the protected target and 8-hour duration. When either trigger occurs, prevent the specified outcome and remove the ward; track this trigger manually because damage automation cannot monitor all lethal effects.",
      ],
    },
    isManualOverride: true,
    notes:
      "The ward is consumed by either trigger, not only by damage reducing the target to 0 HP.",
  },

  freedom_of_movement: {
    id: "freedom_of_movement",
    name: "Freedom of Movement",
    category: {
      spellType: "spell",
      school: "abjuration",
      level: 4,
      classes: ["bard", "cleric", "druid", "ranger"],
      source: "Player's Handbook (2024), pg. 277",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Touch",
      components: "V, S, M (a leather strap)",
      duration: "1 hour",
    },
    interaction: { type: "utility" },
    damage: [],
    upcasting: {
      notes:
        "Target one additional willing creature per spell slot level above 4.",
    },
    effectNotes: [
      "A willing target ignores Difficult Terrain; spells and other magical effects cannot reduce its Speed or give it Paralyzed or Restrained. It gains a Swim Speed equal to its Speed and can spend 5 feet of movement to automatically escape nonmagical restraints, including a Grappled condition.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Track the target and 1-hour duration. Ignore eligible movement/condition effects, grant an equal Swim Speed, and allow escape from nonmagical restraints by spending 5 feet; this does not remove magical restraints.",
      ],
    },
    isManualOverride: true,
    notes:
      "The escape clause applies to nonmagical restraints; it does not generally end Restrained from magical effects.",
  },

  mordenkainens_private_sanctum: {
    id: "mordenkainens_private_sanctum",
    name: "Mordenkainen's Private Sanctum",
    category: {
      spellType: "spell",
      school: "abjuration",
      level: 4,
      classes: ["wizard"],
      source: "Player's Handbook (2024), pg. 301",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "10 minutes",
      range: "120 ft.",
      components: "V, S, M (a thin sheet of lead)",
      duration: "24 hours",
    },
    interaction: { type: "utility" },
    area: { shape: "Cube", sizeFeet: 100 },
    damage: [],
    upcasting: {
      notes:
        "Increase the size of the Cube by 100 feet for each spell slot level above 4th",
    },
    effectNotes: [
      "Make an area within range magically secure for 24 hours. The area is a Cube from 5 feet to 100 feet on each side.",
      "Choose any security properties: sound blocked; dark foggy barrier blocking vision (including Darkvision); divination sensors blocked; creatures immune to divination targeting; teleportation blocked; planar travel blocked.",
      "Casting this spell on the same spot every day for 365 days makes the effect last until dispelled.",
      "Upcasting: The size of the Cube increases by 100 feet per slot level above 4.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Define Cube area (5 to 100 ft per side, +100 ft/slot level above 4) within 120 feet and track selected warding properties.",
        "Enforce barriers: prevent sound, block vision/darkvision, block divination sensors/spells, prevent teleportation and planar transit into/out of area.",
        "Track 24-hour duration (or track 365 daily castings toward permanence until dispelled).",
      ],
    },
    isManualOverride: true,
    notes:
      "10-minute cast, 24-hour duration without concentration. Wards a 5-100 ft Cube against sound, vision, divination, teleportation, and planar transit. Upcasting increases Cube size by 100 ft per slot level above 4. Permanent if cast daily for 365 days.",
  },

  otilukes_resilient_sphere: {
    id: "otilukes_resilient_sphere",
    name: "Otiluke's Resilient Sphere",
    category: {
      spellType: "spell",
      school: "abjuration",
      level: 4,
      classes: ["cleric", "paladin", "wizard"],
      source: "Player's Handbook (2024), pg. 303",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "30 ft.",
      components: "V, S, M (a glass sphere)",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "save", saveAbility: "DEX" },
    damage: [],
    effectNotes: [
      "Enclose a Large or smaller creature or object within 30 feet in an impervious shimmering sphere for 1 minute (an unwilling creature makes a Dexterity saving throw to avoid being enclosed).",
      "Nothing can pass through the barrier in either direction, though an enclosed creature can breathe. The sphere is immune to all damage, and creatures inside and outside cannot damage each other.",
      "The sphere is weightless. An enclosed creature can take an action to push against the walls and roll the sphere at up to half its Speed. Other creatures can pick up and move the globe.",
      "A Disintegrate spell targeting the globe destroys it without harming anything inside.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Target Large or smaller creature or object within 30 feet; prompt Dexterity save if unwilling.",
        "If enclosed, render target impervious to damage and external spell effects for 1 minute; prevent it from affecting outside.",
        "Allow enclosed creature to use an action to roll the sphere at half Speed, or allow others to move it.",
        "Destroy immediately without harm if targeted by Disintegrate.",
      ],
    },
    isManualOverride: true,
    notes:
      "In 2024 rules, Resilient Sphere is Abjuration and does not require concentration (1 minute duration). Impervious weightless sphere enclosing Large or smaller target (DEX save if unwilling). Destroyed by Disintegrate.",
  },

    // Level 5 (8 spells)
    alustriels_mooncloak: {
    id: "alustriels_mooncloak",
    name: "Alustriel's Mooncloak",
    category: {
      spellType: "spell",
      school: "abjuration",
      level: 5,
      classes: ["bard", "druid", "ranger", "wizard"],
      source: "Forgotten Realms: Heroes of Faerûn, pg. 142",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Self",
      components: "V, S, M (a moonstone worth 50+ GP)",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "utility" },
    area: { shape: "Emanation", sizeFeet: 20 },
    damage: [],
    effectNotes: [
      "Moonlight fills a 20-foot Emanation originating from you with Dim Light for up to 1 minute (concentration).",
      "While in that area, you and your allies have Half Cover and Resistance to Cold, Lightning, and Radiant damage.",
      "Special dismissal options (using either option ends the spell immediately):",
      "- Liberation: When you fail a saving throw to avoid or end the Frightened, Grappled, or Restrained condition, you can take a Reaction to succeed on the save instead.",
      "- Respite: As a Magic action, you or an ally within the area regains Hit Points equal to 4d10 plus your spellcasting ability modifier.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Place 20-ft Emanation on caster (concentration up to 1 min).",
        "Apply Half Cover and Resistance to Cold, Lightning, and Radiant damage to caster and allies in area.",
        "Allow ending spell early via Reaction (Liberation: auto-succeed save vs Frightened/Grappled/Restrained) or Magic action (Respite: heal 4d10 + mod).",
      ],
    },
    isManualOverride: true,
    notes:
      "Forgotten Realms: Heroes of Faerûn, pg. 142. 20-ft Emanation granting Half Cover and Cold/Lightning/Radiant resistance. Can dismiss early for Liberation (Reaction auto-succeed vs Frightened/Grappled/Restrained) or Respite (Magic action heal 4d10 + mod).",
  },

  // Antilife Shell (D&D Free Rules 2024, Spell Descriptions)
  antilife_shell: {
    id: "antilife_shell",
    name: "Antilife Shell",
    category: {
      spellType: "spell",
      school: "abjuration",
      level: 5,
      classes: ["druid"],
      source: "Player's Handbook (2024), pg. 241",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Self (10-ft. Emanation)",
      components: "V, S",
      duration: "Concentration, up to 1 hour",
    },
    area: { shape: "Sphere", sizeFeet: 10 },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "A 10-foot Emanation prevents creatures other than Constructs and Undead from passing or reaching through it. Affected creatures can still cast spells and make attacks with Ranged or Reach weapons through the barrier.",
      "If you move in a way that forces an affected creature to pass through the barrier, the spell ends.",
    ],
    isManualOverride: true,
    notes:
      "Track the aura boundary, eligible creature types, concentration, and whether movement forces a creature through the barrier.",
  },

  circle_of_power: {
    id: "circle_of_power",
    name: "Circle of Power",
    category: {
      spellType: "spell",
      school: "abjuration",
      level: 5,
      classes: ["cleric", "paladin", "wizard"],
      source: "Player's Handbook (2024), pg. 250",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Self (30-ft. emanation)",
      components: "V",
      duration: "Concentration, up to 10 minutes",
    },
    interaction: { type: "utility" },
    damage: [],
    area: { shape: "Sphere", sizeFeet: 30 },
    effectNotes: [
      "Divine power radiates from you in a 30-foot Emanation for the duration.",
      "You and your allies in the emanation have Advantage on saving throws against spells and other magical effects.",
      "When an affected creature succeeds on a saving throw against a spell or magical effect to take only half damage, it instead takes no damage.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Place and attach 30-ft Emanation aura to caster.",
        "Track concentration up to 10 minutes.",
        "Grant Advantage on saves vs spells and magical effects to caster and allies inside.",
        "Convert half damage on successful save against spells/magical effects to 0 damage.",
      ],
    },
    isManualOverride: true,
    notes:
      "Player's Handbook (2024). Marked for detailed verification against printed book/DDB. In 2024, added to Cleric and Wizard spell lists. Grants Advantage on saves vs spells/magical effects and Evasion-like zero damage on success in 30-ft Emanation.",
  },

  dispel_evil_and_good: {
    id: "dispel_evil_and_good",
    name: "Dispel Evil and Good",
    category: {
      spellType: "spell",
      school: "abjuration",
      level: 5,
      classes: ["cleric", "paladin"],
      source: "Player's Handbook (2024), pg. 263",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Self",
      components: "V, S, M (powdered silver and iron)",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "save", saveAbility: "CHA" },
    damage: [],
    effectNotes: [
      "Celestials, Elementals, Fey, Fiends, and Undead have Disadvantage on attack rolls against you.",
      "Break Enchantment: Magic action to touch a creature possessed by or Charmed/Frightened by those types to end the condition.",
      "Dismissal: Magic action to target creature of those types within 5 feet. Target makes Charisma saving throw or is banished to its home plane (Undead to Shadowfell, Fey to Feywild if not on home plane).",
      "Using either special function ends the spell.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Activate protective aura: Celestials, Elementals, Fey, Fiends, Undead have Disadvantage on attacks against caster.",
        "Option 1 (Break Enchantment): Magic action touch to end possession/Charmed/Frightened by those types (ends spell).",
        "Option 2 (Dismissal): Magic action prompt CHA save for target within 5 ft; on fail banish to home plane (ends spell).",
      ],
    },
    isManualOverride: true,
    notes:
      "Concentration up to 1 min. Celestials, Elementals, Fey, Fiends, and Undead have Disadvantage on attacks against you. Magic action to Break Enchantment (end charm/fear/possession) or Dismissal (CHA save or banished to home plane), either of which ends the spell.",
  },

  greater_restoration: {
    id: "greater_restoration",
    name: "Greater Restoration",
    category: {
      spellType: "spell",
      school: "abjuration",
      level: 5,
      classes: ["bard", "cleric", "druid", "paladin", "ranger"],
      source: "Player's Handbook (2024), pg. 281",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Touch",
      components: "V, S, M (diamond dust worth 100+ GP, consumed)",
      duration: "Instantaneous",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Touch a creature and remove one chosen effect: one Exhaustion level; Charmed or Petrified; a curse (including attunement to a cursed magic item); a reduction to one ability score; or a reduction to its Hit Point maximum.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Choose exactly one listed effect on the touched target and remove it. Record and consume diamond dust worth at least 100 GP; update the relevant condition, curse/attunement, ability score, or Hit Point maximum manually.",
      ],
    },
    isManualOverride: true,
    notes:
      "This spell removes one listed effect per casting; it does not restore Hit Points directly.",
  },

  hallow: {
    id: "hallow",
    name: "Hallow",
    category: {
      spellType: "spell",
      school: "abjuration",
      level: 5,
      classes: ["cleric"],
      source: "Player's Handbook (2024), pg. 283",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "24 hours",
      range: "Touch",
      components: "V, S, M (incense worth 1,000+ GP, consumed)",
      duration: "Until dispelled",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Infuse an area with radius up to 60 feet; casting fails if it overlaps an existing Hallow. Choose creature types (Aberration, Celestial, Elemental, Fey, Fiend, Undead) that cannot willingly enter, and whose possession/Charmed/Frightened effects from those creatures are suppressed inside.",
      "Choose one extra area effect: Courage (chosen types cannot become Frightened), Darkness, Daylight, Peaceful Rest (interred corpses cannot become Undead), Extradimensional Interference (chosen types cannot teleport/planar travel in or out), Fear (chosen types are Frightened), Resistance or Vulnerability to one damage type for chosen types, Silence, or Tongues for chosen types.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Map and track the up-to-60-foot-radius area indefinitely; check that it does not overlap another Hallow. Record excluded creature types and the chosen extra effect with affected creature types/damage type.",
        "Apply entry, possession/condition suppression, lighting, planar travel, communication, damage resistance/vulnerability, sound, or corpse effects as appropriate. Track dispelling manually.",
      ],
    },
    isManualOverride: true,
    notes:
      "The area ward has one selected extra effect plus the Hallowed Ward; store both choices and their eligible creature types.",
  },

  mass_cure_wounds: {
    id: "mass_cure_wounds",
    name: "Mass Cure Wounds",
    category: {
      spellType: "spell",
      school: "abjuration",
      level: 5,
      classes: ["bard", "cleric", "druid"],
      source: "Player's Handbook (2024), pg. 296",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "60 ft. (30-ft. radius Sphere)",
      components: "V, S",
      duration: "Instantaneous",
    },
    interaction: { type: "utility" },
    area: { shape: "Sphere", sizeFeet: 30 },
    damage: [{ dice: "5d8", type: "healing", isBase: true }],
    upcasting: {
      notes: "+1d8 healing per spell slot level above 5th",
      perSlotLevel: { dice: "1d8", type: "healing" },
    },
    effectNotes: [
      "Choose up to six creatures in a 30-foot-radius Sphere centered on a point you can see within 60 feet.",
      "Each target regains Hit Points equal to 5d8 plus your spellcasting ability modifier.",
      "Upcasting: Healing increases by 1d8 for each spell slot level above 5.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Aim the 30-foot-radius Sphere within 60 feet and select up to 6 target creatures.",
        "Roll 5d8 + spellcasting ability modifier (adding 1d8 per slot level above 5) and restore HP to selected targets.",
      ],
    },
    isManualOverride: true,
    notes:
      "In 2024 rules, Mass Cure Wounds is Abjuration (previously Evocation). Heals up to 6 creatures within a 30-foot-radius Sphere.",
  },

  planar_binding: {
    id: "planar_binding",
    name: "Planar Binding",
    category: {
      spellType: "spell",
      school: "abjuration",
      level: 5,
      classes: ["bard", "cleric", "druid", "warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 305",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 hour",
      range: "60 ft.",
      components: "V, S, M (a jewel worth 1,000+ GP, which the spell consumes)",
      duration: "24 hours",
    },
    interaction: { type: "save", saveAbility: "CHA" },
    damage: [],
    upcasting: {
      notes:
        "Duration increases with higher spell slots: level 6 (10 days), level 7 (30 days), level 8 (180 days), level 9 (366 days)",
    },
    effectNotes: [
      "Target a Celestial, Elemental, Fey, or Fiend within 60 feet for the entire 1-hour casting. At completion, target makes a Charisma saving throw or is bound to your service for 24 hours.",
      "If the creature was summoned/created by another spell, that spell's duration is extended to match this spell's duration.",
      "Bound creature must follow commands to best of ability (if Hostile, strives to twist commands).",
      "Upcasting: Duration extends to 10 days (level 6), 30 days (level 7), 180 days (level 8), or 366 days (level 9).",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Verify 1,000+ GP jewel is consumed. Ensure target remained within 60 feet throughout 1-hour casting.",
        "Prompt Charisma saving throw at casting completion.",
        "On failure, bind creature to service and extend summoning spell duration if applicable.",
        "Track duration based on slot level (24 hrs at lv 5, 10 days at 6, 30 days at 7, 180 days at 8, 366 days at 9).",
      ],
    },
    isManualOverride: true,
    notes:
      "1-hour casting, consumes 1,000+ GP jewel. Binds Celestial, Elemental, Fey, or Fiend on failed CHA save for 24 hours (or up to 366 days at 9th level). Extends duration of summoning spell.",
  },

    // Level 6 (5 spells)
    // Contingency (D&D Free Rules 2024, Spell Descriptions)
  contingency: {
    id: "contingency",
    name: "Contingency",
    category: {
      spellType: "spell",
      school: "abjuration",
      level: 6,
      classes: ["wizard"],
      source: "Player's Handbook (2024), pg. 256",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "10 minutes",
      range: "Self",
      components:
        "V, S, M (a gem-encrusted statuette of yourself worth 1,500+ GP)",
      duration: "10 days",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Choose a spell of level 5 or lower that you can cast, has a casting time of an action, and can target you. Cast it as part of Contingency, expending both spell slots, but hold its effect until a trigger you describe occurs; then it takes effect immediately and Contingency ends.",
      "The contingent spell can affect only you. You can have only one Contingency at a time; casting it again ends the previous one. Contingency also ends if its material component is no longer on your person.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Validate the chosen spell (level 5 or lower, action casting time, can target you), record both slot expenditures, trigger, and statuette; GM adjudicates trigger wording.",
        "Track the 10-day duration, trigger activation, and statuette possession. The stored spell resolves on the caster only and cannot be delayed after its trigger.",
      ],
    },
    isManualOverride: true,
    notes:
      "The contingent spell is cast and its slot is expended during Contingency's casting; only its effect is held for the described trigger.",
  },

  forbiddance: {
    id: "forbiddance",
    name: "Forbiddance",
    category: {
      spellType: "spell",
      school: "abjuration",
      level: 6,
      classes: ["cleric"],
      source: "Player's Handbook (2024), pg. 276",
      concentration: false,
      ritual: true,
    },
    casting: {
      time: "10 minutes or Ritual",
      range: "Touch",
      components: "V, S, M (ruby dust worth 1,000+ GP)",
      duration: "1 day",
    },
    interaction: { type: "utility" },
    damage: [
      {
        dice: "5d10",
        type: "radiant",
        isBase: false,
        condition:
          "Chosen creature type enters for first time on turn or ends turn in area",
      },
      {
        dice: "5d10",
        type: "necrotic",
        isBase: false,
        condition:
          "Chosen creature type enters for first time on turn or ends turn in area",
      },
    ],
    effectNotes: [
      "Ward up to 40,000 square feet of floor to 30 feet high against teleportation into the area, portals, and planar travel. Choose one or more creature types (Aberration, Celestial, Elemental, Fey, Fiend, Undead) and either Radiant or Necrotic damage; a chosen creature takes 5d10 when it enters for the first time on a turn or ends its turn there, unless it speaks the password as it enters.",
      "Areas of Forbiddance cannot overlap. Recasting daily in the same place for 30 days makes the ward permanent, consuming the Material component on the last casting.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Map the ward area and height; record protected travel modes, chosen creature types, damage type, password, and 1-day duration. Track planar/teleportation restrictions and apply recurring damage triggers.",
        "Check for overlap with other Forbiddance areas. If maintaining the ward through daily castings, track the consecutive 30-day process and consume the material on the final casting.",
      ],
    },
    isManualOverride: true,
    notes:
      "This large persistent ward requires manual map boundaries, creature-type checks, travel adjudication, password handling, and duration tracking.",
  },

  globe_of_invulnerability: {
    id: "globe_of_invulnerability",
    name: "Globe of Invulnerability",
    category: {
      spellType: "spell",
      school: "abjuration",
      level: 6,
      classes: ["sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 279",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Self (10-ft. Emanation)",
      components: "V, S, M (a glass bead)",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "utility" },
    damage: [],
    upcasting: {
      notes:
        "The barrier blocks spells one additional level higher for each slot level above 6th.",
    },
    effectNotes: [
      "An immobile barrier in a 10-foot Emanation surrounds you. A spell of level 5 or lower cast from outside cannot affect anything within the barrier, even if it targets a creature or object there; areas of effect from such spells also exclude the barrier's interior.",
      "For each slot level above 6, the maximum blocked spell level increases by one.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Track the immobile 10-foot Emanation, caster location, concentration, and blocked spell-level threshold (5 + levels upcast).",
        "For each spell cast from outside, compare its level and origin to the barrier; resolve target and area exclusion manually. The barrier does not block spells cast from inside according to this spell's text.",
      ],
    },
    isManualOverride: true,
    notes:
      "The source describes the barrier as immobile; track its location as fixed when cast and adjudicate spell origin/area interactions.",
  },

  guards_and_wards: {
    id: "guards_and_wards",
    name: "Guards and Wards",
    category: {
      spellType: "spell",
      school: "abjuration",
      level: 6,
      classes: ["bard", "wizard"],
      source: "Player's Handbook (2024), pg. 282",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 hour",
      range: "Touch",
      components: "V, S, M (a silver rod worth 10+ GP)",
      duration: "24 hours",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Ward up to 2,500 square feet of floor, up to 20 feet high, shaped as one 50-foot square, 100 contiguous 5-foot squares, or 25 contiguous 10-foot squares. Choose unaffected individuals and a password. The ward creates fog in corridors (Heavily Obscured and a 50% chance to misdirect at junctions), Arcane Lock on doors and illusions on up to ten doors, Webs on stairs (regrowing after 10 minutes), plus one selected extra effect: Dancing Lights in four corridors, Magic Mouth in two places, Stinking Cloud in two places, Gust of Wind in one corridor/room, or Suggestion in one 5-foot square.",
      "Dispel Magic has no effect on Guards and Wards itself, but can dispel each of the four effect groups; removing all four ends the spell. Casting daily in the same area for 365 days makes it last until all effects are dispelled.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Map the warded area and height; record exempt creatures, password, 24-hour duration, and chosen additional effect. Apply corridor, door, and stair effects to the map.",
        "Track the four dispellable effect groups separately; Dispel Magic cannot directly end the ward, but dispelling all four does. For permanence, track daily casting for 365 days in the same area.",
      ],
    },
    isManualOverride: true,
    notes:
      "This is a complex area ward; track four effect groups, their dispelling, and permanent-casting progress independently.",
  },

  heal: {
    id: "heal",
    name: "Heal",
    category: {
      spellType: "spell",
      school: "abjuration",
      level: 6,
      classes: ["cleric", "druid"],
      source: "Player's Handbook (2024), pg. 284",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "60 ft.",
      components: "V, S",
      duration: "Instantaneous",
    },
    interaction: { type: "utility" },
    damage: [],
    upcasting: {
      notes: "+10 Hit Points restored per spell slot level above 6th",
    },
    effectNotes: [
      "A visible creature within range regains 70 Hit Points. The spell also ends Blinded, Deafened, and Poisoned on that creature.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Choose a visible creature within range, restore 70 HP (plus 10 per slot level above 6), and remove its Blinded, Deafened, and Poisoned conditions.",
      ],
    },
    isManualOverride: true,
    notes:
      "This spell restores HP and removes exactly the listed conditions; it does not remove other conditions.",
  },

    // Level 7 (2 spells)
    aura_of_evasion: {
    id: "aura_of_evasion",
    name: "Aura of Evasion",
    category: {
      spellType: "spell",
      school: "abjuration",
      level: 7,
      classes: ["sorcerer", "warlock", "wizard"],
      source: "Arcana Unleashed, pg. 35",
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
    area: { shape: "Emanation", sizeFeet: 30 },
    damage: [],
    effectNotes: [
      "An aura of alacrity radiates from you in a 30-foot Emanation for up to 1 minute with concentration.",
      "While in the aura, you and your allies have Advantage on Dexterity saving throws.",
      "Full Evasion: When an affected creature is subjected to an effect that allows a Dexterity saving throw to take only half damage, it takes no damage if it succeeds on the save and only half damage if it fails.",
      "Incapacitated creatures do not gain any benefit from the aura.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Place 30-ft Emanation on caster.",
        "Grant Advantage on DEX saves to caster and conscious allies in area.",
        "Apply Evasion (no damage on success, half on failure) vs half-damage DEX save effects.",
      ],
    },
    isManualOverride: true,
    notes:
      "Arcana Unleashed, pg. 35. 30-ft Emanation. Grants caster and allies Advantage on DEX saves and full Evasion (0 damage on success, half on fail). Incapacitated creatures gain no benefit.",
  },

  symbol: {
    id: "symbol",
    name: "Symbol",
    category: {
      spellType: "spell",
      school: "abjuration",
      level: 7,
      classes: ["bard", "cleric", "druid", "wizard"],
      source: "Player's Handbook (2024), pg. 329",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 minute",
      range: "Touch",
      components:
        "V, S, M (powdered diamond worth 1,000+ GP, which the spell consumes)",
      duration: "Until dispelled or triggered",
    },
    interaction: { type: "save", saveAbility: "CON" },
    area: { shape: "Sphere", sizeFeet: 60 },
    damage: [
      {
        dice: "10d10",
        type: "necrotic",
        isBase: true,
        condition: "Death glyph option on failed CON save (half on success)",
      },
    ],
    effectNotes: [
      "Inscribe a 10-foot-diameter harmful glyph on a surface or inside a closeable object lasting until dispelled or triggered.",
      "Requires Wisdom (Perception) check vs DC to notice. Set trigger condition (stepping on, touching, opening).",
      "When triggered, erupts in a 60-foot-radius Sphere with one chosen effect:",
      "- Death: 10d10 Necrotic damage (CON save half).",
      "- Discord: Disadvantage on attack rolls and ability checks for 1 minute (CON save).",
      "- Fear: Frightened for 1 minute, must use Dash action to move away (WIS save).",
      "- Hopelessness: Overwhelmed with despair for 1 minute, cannot attack or target hostile creatures with harm (CHA save).",
      "- Insanity: Incapacitated with delirium for 1 minute (INT save).",
      "- Pain: Incapacitated with agonizing pain for 1 minute (CON save).",
      "- Sleep: Unconscious for 10 minutes (WIS save; ends on damage or shake action).",
      "- Stunning: Stunned for 1 minute (CON save).",
      "Targets repeat saving throw at end of each turn to end active condition.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Verify 1,000+ GP diamond dust consumed. Inscribe 10-ft glyph and define trigger condition.",
        "Choose glyph effect: Death, Discord, Fear, Hopelessness, Insanity, Pain, Sleep, or Stunning.",
        "When triggered, expand 60-foot Sphere; prompt appropriate save (CON, WIS, CHA, or INT) and apply condition/damage.",
        "Prompt recurring save at end of each affected target's turn.",
      ],
    },
    isManualOverride: true,
    notes:
      "1-minute cast, consumes 1,000+ GP diamond dust. Inscribes a 10-ft glyph that triggers a 60-ft Sphere: Death (10d10 Necrotic), Discord, Fear, Hopelessness, Insanity, Pain, Sleep, or Stunning. Save repeats at end of each turn.",
  },

    // Level 8 (3 spells)
    // Antimagic Field (D&D Free Rules 2024, Spell Descriptions)
  antimagic_field: {
    id: "antimagic_field",
    name: "Antimagic Field",
    category: {
      spellType: "spell",
      school: "abjuration",
      level: 8,
      classes: ["cleric", "wizard"],
      source: "Player's Handbook (2024), pg. 241",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Self (10-ft. Emanation)",
      components: "V, S, M (iron filings)",
      duration: "Concentration, up to 1 hour",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Within the 10-foot Emanation, spells cannot be cast, Magic actions or other magical effects cannot be created, and magic item properties do not function. Spell or magical areas cannot extend into the Emanation; teleportation and planar travel into or out of it are blocked, and portals close temporarily.",
      "Ongoing spells are suppressed inside the area, except those cast by an Artifact or deity; suppressed duration continues to elapse. Dispel Magic does not affect this aura, and separate Antimagic Field auras do not nullify each other.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Track the moving 10-foot Emanation and adjudicate spell, magic-item, area, portal, teleportation, planar-travel, and ongoing-effect suppression interactions.",
      ],
    },
    isManualOverride: true,
    notes:
      "This is an adjudication-heavy aura; Embers does not automatically suppress other effects or prevent actions based on token positions.",
  },

  holy_aura: {
    id: "holy_aura",
    name: "Holy Aura",
    category: {
      spellType: "spell",
      school: "abjuration",
      level: 8,
      classes: ["cleric"],
      source: "Player's Handbook (2024), pg. 286",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Self (30-ft. Emanation)",
      components: "V, S, M (a reliquary worth 1,000+ GP)",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "save", saveAbility: "CON" },
    damage: [],
    effectNotes: [
      "Creatures you choose in your 30-foot Emanation have Advantage on all saving throws, and other creatures have Disadvantage on attack rolls against them. When a Fiend or Undead hits an affected creature with a melee attack roll, the attacker makes a Constitution save or is Blinded until the end of its next turn.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Track the caster-centered 30-foot Emanation, chosen affected creatures, and concentration. Apply Advantage on their saves and Disadvantage on attacks against them.",
        "When a Fiend or Undead hits an affected creature with a melee attack roll, resolve a Constitution save and apply Blinded through the end of its next turn on failure.",
      ],
    },
    isManualOverride: true,
    notes:
      "The save and attack modifiers depend on who is inside the aura and which creatures the caster chose.",
  },

  mind_blank: {
    id: "mind_blank",
    name: "Mind Blank",
    category: {
      spellType: "spell",
      school: "abjuration",
      level: 8,
      classes: ["bard", "wizard"],
      source: "Player's Handbook (2024), pg. 298",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Touch",
      components: "V, S",
      duration: "24 hours",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "One willing creature you touch gains Immunity to Psychic damage and the Charmed condition for 24 hours.",
      "The target is unaffected by anything that would sense its emotions or alignment, read its thoughts, or magically detect its location.",
      "No spell—not even Wish—can gather information about the target, observe it remotely, or control its mind.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Grant touched willing target Immunity to Psychic damage and the Charmed condition for 24 hours.",
        "Adjudicate absolute protection against thought detection, emotion/alignment sensing, magical location tracking, scrying/remote observation, and mind control (including Wish).",
      ],
    },
    isManualOverride: true,
    notes:
      "24 hour duration, no concentration. Grants absolute immunity to Psychic damage, Charmed condition, scrying, mind reading, and mind control even against Wish.",
  },

    // Level 9 (4 spells)
    imprisonment: {
    id: "imprisonment",
    name: "Imprisonment",
    category: {
      spellType: "spell",
      school: "abjuration",
      level: 9,
      classes: ["warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 288",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 minute",
      range: "30 ft.",
      components: "V, S, M (a statuette of the target worth 5,000+ GP)",
      duration: "Until dispelled",
    },
    interaction: { type: "save", saveAbility: "WIS" },
    damage: [],
    effectNotes: [
      "A visible creature makes a Wisdom save. Success: unaffected and immune to this spell for 24 hours. Failure: imprisoned; it no longer needs to breathe, eat, or drink, does not age, cannot be located/perceived by Divination spells, and cannot teleport. Choose one mode: Burial (sealed underground globe); Chaining (Restrained and immovable); Hedged Prison (a chosen demiplane); Minimus Containment (1-inch target in an indestructible gem); or Slumber (Unconscious and cannot be awoken).",
      "When casting, specify an observable ending trigger that the GM agrees is highly likely within the next decade. Dispel Magic ends the spell only when cast with a level 9 slot, targeting the prison or its material component.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Resolve the Wisdom save and 24-hour immunity on success. On failure, record the chosen prison mode, target, statuette, and agreed observable ending trigger.",
        "Track the target's ongoing exclusions and prison-specific state. Ordinary Dispel Magic is insufficient; only a level 9 casting targeting the prison or component can end the spell. GM adjudicates trigger fulfillment.",
      ],
    },
    isManualOverride: true,
    notes:
      "The chosen prison mode and ending trigger must be recorded at casting; do not treat this as a generic Restrained condition.",
  },

  // Invulnerability (Arcana Unleashed, pg. 41)
  invulnerability: {
    id: "invulnerability",
    name: "Invulnerability",
    category: {
      spellType: "spell",
      school: "abjuration",
      level: 9,
      classes: ["wizard"],
      source: "Arcana Unleashed, pg. 41",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Self",
      components: "V, S, M (a piece of adamantine worth 500+ GP, consumed)",
      duration: "Concentration, up to 10 minutes",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "You have Immunity to all damage until the spell ends.",
      "Requires concentration up to 10 minutes and consumes a piece of adamantine worth 500+ GP.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Verify 500+ GP adamantine consumed on cast.",
        "Grant caster Immunity to all damage types for duration.",
        "Maintain concentration up to 10 minutes.",
      ],
    },
    isManualOverride: true,
    notes:
      "Arcana Unleashed, pg. 41. Conc up to 10 min, consumes 500+ GP adamantine. Grants caster Immunity to all damage.",
  },

  mass_heal: {
    id: "mass_heal",
    name: "Mass Heal",
    category: {
      spellType: "spell",
      school: "abjuration",
      level: 9,
      classes: ["cleric"],
      source: "Player's Handbook (2024), pg. 296",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "60 ft.",
      components: "V, S",
      duration: "Instantaneous",
    },
    interaction: { type: "utility" },
    damage: [{ dice: "700", type: "healing", isBase: true }],
    effectNotes: [
      "A flood of healing energy flows into creatures around you. Restore up to 700 Hit Points, divided as you choose among any number of visible creatures within 60 feet.",
      "Creatures healed by this spell also have the Blinded, Deafened, and Poisoned conditions removed from them.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Select visible target creatures within 60 feet and allocate portions of the 700 HP pool among them.",
        "Apply HP recovery and automatically remove Blinded, Deafened, and Poisoned conditions from all healed creatures.",
      ],
    },
    isManualOverride: true,
    notes:
      "In 2024 rules, Mass Heal is Abjuration. Divides up to 700 HP pool among visible targets and cleanses Blinded, Deafened, and Poisoned.",
  },

  prismatic_wall: {
    id: "prismatic_wall",
    name: "Prismatic Wall",
    category: {
      spellType: "spell",
      school: "abjuration",
      level: 9,
      classes: ["bard", "wizard"],
      source: "Player's Handbook (2024), pg. 308",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "60 ft.",
      components: "V, S",
      duration: "10 minutes",
    },
    interaction: { type: "save", saveAbility: "DEX" },
    damage: [
      {
        dice: "12d6",
        type: "choice",
        typeChoices: ["fire", "acid", "lightning", "poison", "cold"],
        isBase: true,
        condition:
          "12d6 per damaging layer crossed on failed save (half on success)",
      },
    ],
    effectNotes: [
      "Form an opaque wall (up to 90 ft long, 30 ft high, 1 inch thick) or a globe (up to 30 ft diameter) within 60 feet lasting 10 minutes without concentration.",
      "Sheds Bright Light 100 ft and Dim Light 100 ft. You and designated creatures are unharmed. Other creatures within 20 ft seeing wall make CON save or Blinded for 1 minute.",
      "Passing through forces a separate Dexterity save against each of the 7 layers in order: 1 Red (12d6 Fire; blocks nonmagical ranged attacks; destroyed by 25+ Cold damage); 2 Orange (12d6 Acid; blocks magical ranged attacks; destroyed by strong wind like Gust of Wind); 3 Yellow (12d6 Lightning; destroyed by 60+ Force damage); 4 Green (12d6 Poison; destroyed by Passwall); 5 Blue (12d6 Cold; destroyed by 25+ Fire damage); 6 Indigo (Restrained, CON save each turn, 3 fails = Petrified; blocks spells; destroyed by Daylight); 7 Violet (Blinded, WIS save next turn, fail = teleported to another plane; destroyed by Dispel Magic).",
      "Unaffected by Antimagic Field; Dispel Magic only affects layer 7.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Place wall (90x30 ft) or 30-ft globe; record designated safe creatures and 10-minute duration (no concentration).",
        "Resolve CON save vs Blinded (1 min) for creatures moving within 20 ft.",
        "When a creature passes through, resolve each remaining layer in order from 1 (Red) to 7 (Violet).",
        "Track layer destruction conditions in order (Cold, strong wind, Force, Passwall, Fire, Daylight, Dispel Magic).",
      ],
    },
    isManualOverride: true,
    notes:
      "10 minutes, no concentration. 7-layer wall or 30-ft globe. Approaching within 20 ft: CON save vs Blinded. Passing through triggers all 7 layers sequentially. Layers must be destroyed in order (1 to 7). Immune to Antimagic Field.",
  },
};
