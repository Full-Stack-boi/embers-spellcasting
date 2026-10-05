/**
 * Manual Spell Formula Overrides — Illusion (Leveled Spells 1st–9th)
 */

import type { SpellFormula } from "../../../types/spellFormula";

export const illusionSpellOverrides: Record<string, SpellFormula> = {
    // Level 1 (4 spells)
    // Color Spray (D&D Free Rules 2024, Spell Descriptions)
  color_spray: {
    id: "color_spray",
    name: "Color Spray",
    category: {
      spellType: "spell",
      school: "illusion",
      level: 1,
      classes: ["bard", "sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 251",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Self (15-ft. Cone)",
      components: "V, S, M (a pinch of colorful sand)",
      duration: "Instantaneous",
    },
    area: { shape: "Cone", sizeFeet: 15 },
    interaction: { type: "save", saveAbility: "CON" },
    damage: [],
    effectNotes: [
      "Each creature in the Cone makes a Constitution save or has the Blinded condition until the end of your next turn.",
    ],
    isManualOverride: true,
    notes: "Resolve the 15-foot Cone and track the Blinded duration manually.",
  },

  // Disguise Self (D&D Free Rules 2024, Spell Descriptions)
  disguise_self: {
    id: "disguise_self",
    name: "Disguise Self",
    category: {
      spellType: "spell",
      school: "illusion",
      level: 1,
      classes: ["bard", "sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 262",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Self",
      components: "V, S",
      duration: "1 hour",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Change the apparent appearance of yourself and belongings on your person for the duration. The disguise can alter apparent height by up to 1 foot; physical interaction reveals discrepancies, and a creature can use Study to examine it against your spell save DC.",
    ],
    isManualOverride: true,
    notes:
      "The appearance is illusory; track the chosen disguise and adjudicate physical interaction or Study checks manually.",
  },

  illusory_script: {
    id: "illusory_script",
    name: "Illusory Script",
    category: {
      spellType: "spell",
      school: "illusion",
      level: 1,
      classes: ["bard", "warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 288",
      concentration: false,
      ritual: true,
    },
    casting: {
      time: "1 minute or Ritual",
      range: "Touch",
      components: "S, M (ink worth 10+ GP, consumed)",
      duration: "10 days",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Imbue writing on suitable material with an illusion for 10 days. You and creatures designated at casting see the text as normal, in your handwriting, and conveying your intended meaning; others see unintelligible unknown or magical script. Alternatively alter the apparent meaning, handwriting, and language, but the language must be one you know.",
      "If dispelled, both the original script and illusion disappear. Truesight can read the hidden message.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Record the written document, intended message, designated readers, and 10-day duration. If using altered text, record a language known by the caster.",
        "Resolve what each observer perceives; Truesight reveals hidden writing. Dispel Magic removes both the original script and illusion.",
      ],
    },
    isManualOverride: true,
    notes:
      "This is a document-level illusion; protect the actual message and reveal text selectively to readers.",
  },

  silent_image: {
    id: "silent_image",
    name: "Silent Image",
    category: {
      spellType: "spell",
      school: "illusion",
      level: 1,
      classes: ["bard", "sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 317",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "60 ft.",
      components: "V, S, M (a bit of fleece)",
      duration: "Concentration, up to 10 minutes",
    },
    interaction: { type: "utility" },
    area: { shape: "Cube", sizeFeet: 15 },
    damage: [],
    effectNotes: [
      "Create a purely visual image of an object, creature, or phenomenon up to a 15-foot Cube within 60 feet lasting up to 10 minutes with concentration.",
      "Magic action: move the image to any spot within 60 feet and alter its appearance to appear natural.",
      "Physical interaction reveals it as an illusion. Study action with Intelligence (Investigation) check against spell save DC reveals it (faint image).",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Place 15-foot Cube visual illusion within 60 feet; track concentration up to 10 minutes.",
        "Allow Magic action to move illusion within range and adjust movements.",
        "Adjudicate physical contact and Study action Investigation checks vs DC.",
      ],
    },
    isManualOverride: true,
    notes:
      "15-foot Cube visual illusion up to 10 min with concentration. Magic action moves and animates within 60 ft. Discovered by touch or Study action Intelligence (Investigation) check vs DC.",
  },

    // Level 2 (8 spells)
    // Blur (D&D Free Rules 2024, Spell Descriptions)
  blur: {
    id: "blur",
    name: "Blur",
    category: {
      spellType: "spell",
      school: "illusion",
      level: 2,
      classes: ["sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 248",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Self",
      components: "V",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Attack rolls against you have Disadvantage for the duration. An attacker perceiving you with Blindsight or Truesight ignores this benefit.",
    ],
    isManualOverride: true,
    notes:
      "Track concentration and apply the attack-roll exception for Blindsight and Truesight.",
  },

  // Invisibility (D&D Free Rules 2024, Spell Descriptions)
  invisibility: {
    id: "invisibility",
    name: "Invisibility",
    category: {
      spellType: "spell",
      school: "illusion",
      level: 2,
      classes: ["bard", "sorcerer", "warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 289",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Touch",
      components: "V, S, M (an eyelash in gum arabic)",
      duration: "Concentration, up to 1 hour",
    },
    interaction: { type: "utility" },
    damage: [],
    upcasting: {
      notes: "Target one additional creature for each slot level above 2nd.",
    },
    effectNotes: [
      "A creature you touch has the Invisible condition until the spell ends. It ends early immediately after the target makes an attack roll, deals damage, or casts a spell.",
    ],
    isManualOverride: true,
    notes:
      "Track concentration, the Invisible condition, and the three early-ending triggers manually.",
  },

  magic_mouth: {
    id: "magic_mouth",
    name: "Magic Mouth",
    category: {
      spellType: "spell",
      school: "illusion",
      level: 2,
      classes: ["bard", "wizard"],
      source: "Player's Handbook (2024), pg. 295",
      concentration: false,
      ritual: true,
    },
    casting: {
      time: "1 minute or Ritual",
      range: "30 ft.",
      components: "V, S, M (jade dust worth 10+ GP, consumed)",
      duration: "Until dispelled",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Implant a message of up to 25 words within a visible unworn/uncarried object within range, delivered over up to 10 minutes when a trigger condition occurs.",
      "Specify visual or audible trigger conditions occurring within 30 feet of the object. When triggered, a mouth appears and speaks the message in your voice at your original volume.",
      "Choose whether the spell ends after speaking once or repeats whenever triggered in the future.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Verify 10+ GP jade dust is consumed. Record the target object, spoken message (up to 25 words), and whether it is one-time or repeating.",
        "Record the trigger condition (visual or audible within 30 feet). GM adjudicates when trigger condition is met and triggers the message.",
      ],
    },
    isManualOverride: true,
    notes:
      "Jade dust (10+ GP) is consumed. Message is up to 25 words with visual or audible triggers within 30 feet. Can repeat or end upon delivery.",
  },

  // Mirror Image (Player's Handbook 2024, pg. 299)
  mirror_image: {
    id: "mirror_image",
    name: "Mirror Image",
    category: {
      spellType: "spell",
      school: "illusion",
      level: 2,
      classes: ["bard", "sorcerer", "warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 299",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Self",
      components: "V, S",
      duration: "1 minute",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Three illusory duplicates move with you. Each time an attack roll hits you, roll a d6 for each remaining duplicate; any die showing 3 or higher causes one duplicate to be hit and destroyed instead.",
      "A duplicate ignores other damage and effects. The spell ends when all three are destroyed. A creature with Blinded, Blindsight, or Truesight is unaffected.",
    ],
    isManualOverride: true,
    notes:
      "Track remaining duplicates and resolve the d6 interception rolls after an attack hits; this does not require Concentration.",
  },

  nystuls_magic_aura: {
    id: "nystuls_magic_aura",
    name: "Nystul's Magic Aura",
    category: {
      spellType: "spell",
      school: "illusion",
      level: 2,
      classes: ["wizard"],
      source: "Player's Handbook (2024), pg. 302",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Touch",
      components: "V, S, M (a small square of silk)",
      duration: "24 hours",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Touch a willing creature or unworn/uncarried object for 24 hours (lasts until dispelled if cast on the same target daily for 30 days).",
      "Mask (Creature): Choose a creature type other than its actual type; spells and magical effects treat target as the chosen type.",
      "False Aura (Object): Change how target appears to aura-detecting spells like Detect Magic (make nonmagical appear magical, magic item appear nonmagical, or alter apparent magic school).",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Select willing creature (Mask) or object (False Aura); track 24-hour duration (or 30 daily casts for permanence until dispelled).",
        "Mask: treat target as chosen creature type against spells/effects.",
        "False Aura: deceive aura detection regarding magical status and school.",
      ],
    },
    isManualOverride: true,
    notes:
      "Touch a willing creature (Mask) or object (False Aura) for 24 hours without concentration. Permanent if cast daily for 30 days. Fools creature type targeting and magical aura detection.",
  },

  phantasmal_force: {
    id: "phantasmal_force",
    name: "Phantasmal Force",
    category: {
      spellType: "spell",
      school: "illusion",
      level: 2,
      classes: ["bard", "sorcerer", "warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 304",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "60 ft. (10-ft. Square)",
      components: "V, S, M (a bit of fleece)",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "save", saveAbility: "INT" },
    area: { shape: "Cube", sizeFeet: 10 },
    damage: [
      {
        dice: "2d8",
        type: "psychic",
        isBase: true,
        condition:
          "Perceived as an appropriate damage type by target on each of your turns if within area or within 5 ft",
      },
    ],
    effectNotes: [
      "One creature you can see within 60 feet makes an Intelligence saving throw. On a failed save, create a phantasm no larger than a 10-foot Cube perceivable only to the target.",
      "Target treats phantasm as real and rationalizes illogical interactions. Target can use a Study action for an Intelligence (Investigation) check against your spell save DC; success realizes it is an illusion and ends the spell.",
      "On each of your turns, a hazardous/hostile phantasm can deal 2d8 Psychic damage if the target is in the area or within 5 feet of it (target perceives damage as an appropriate type).",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Prompt Intelligence saving throw against visible target within 60 feet.",
        "On failure, place 10-foot Cube phantasm (visible only to target) and track concentration up to 1 minute.",
        "Allow Study action Intelligence (Investigation) check vs DC to end early.",
        "On caster's turn, trigger 2d8 Psychic damage if target is within area or within 5 feet.",
      ],
    },
    isManualOverride: true,
    notes:
      "Intelligence save. Creates 10-foot Cube phantasm perceived only by target. Deals 2d8 Psychic damage each turn if adjacent/inside. Study action Investigation check ends early.",
  },

  // Silence (D&D Free Rules 2024, Spell Descriptions)
  silence: {
    id: "silence",
    name: "Silence",
    category: {
      spellType: "spell",
      school: "illusion",
      level: 2,
      classes: ["bard", "cleric", "ranger"],
      source: "Player's Handbook (2024), pg. 316",
      concentration: true,
      ritual: true,
    },
    casting: {
      time: "1 action or Ritual",
      range: "120 ft.",
      components: "V, S",
      duration: "Concentration, up to 10 minutes",
    },
    interaction: { type: "utility" },
    area: { shape: "Sphere", sizeFeet: 20 },
    damage: [],
    effectNotes: [
      "No sound can be created within or pass through the 20-foot-radius Sphere. Creatures and objects entirely inside have Immunity to Thunder damage; creatures are Deafened while entirely inside. Spells with Verbal components cannot be cast there.",
    ],
    isManualOverride: true,
    notes:
      "Track the Sphere and concentration; apply sound, Deafened, Thunder damage, and Verbal-component restrictions only while fully inside.",
  },

  // Uncertain Footing (Arcana Unleashed, pg. 44)
  uncertain_footing: {
    id: "uncertain_footing",
    name: "Uncertain Footing",
    category: {
      spellType: "spell",
      school: "illusion",
      level: 2,
      classes: ["artificer", "bard", "warlock", "wizard"],
      source: "Arcana Unleashed, pg. 44",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "120 ft.",
      components: "V, S, M (a distorted lens)",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "save", saveAbility: "INT" },
    damage: [],
    effectNotes: [
      "Creates illusory obstacles to confuse up to three creatures you can see within 120 feet.",
      "Intelligence saving throw: each target makes an Intelligence save.",
      "Failed save: target's Speed is halved and it cannot take the Dash action.",
      "At the end of each of its turns, target repeats the Intelligence save, ending the spell on itself on a success.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Target up to 3 creatures within 120 ft; prompt Intelligence saves.",
        "Failed save: halve Speed and forbid Dash action.",
        "Targets repeat INT save at end of each turn to clear.",
      ],
    },
    isManualOverride: true,
    notes:
      "Arcana Unleashed, pg. 44. Conc up to 1 min. 120 ft. Up to 3 targets. INT save vs halved Speed and no Dash. Repeat save at end of turns.",
  },

    // Level 3 (4 spells)
    fear: {
    id: "fear",
    name: "Fear",
    category: {
      spellType: "spell",
      school: "illusion",
      level: 3,
      classes: ["bard", "sorcerer", "warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 271",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Self (30-ft. Cone)",
      components: "V, S, M (a white feather)",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "save", saveAbility: "WIS" },
    damage: [],
    effectNotes: [
      "Each creature in a 30-foot Cone makes a Wisdom save or drops what it is holding and has the Frightened condition for the duration. A Frightened creature must take the Dash action and move away from you by the safest route on its turns unless there is nowhere to move; if it ends its turn where it cannot see you, it repeats the save, ending the spell on itself on a success.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Aim the 30-foot Cone and resolve each Wisdom save. Track dropped held items, Frightened targets, concentration, forced Dash/movement, and repeat saves for targets ending a turn out of your line of sight; Cone geometry is resolved manually.",
      ],
    },
    isManualOverride: true,
    notes:
      "The repeat save depends on ending a turn unable to see the caster; leaving the Cone alone does not end the effect.",
  },

  hypnotic_pattern: {
    id: "hypnotic_pattern",
    name: "Hypnotic Pattern",
    category: {
      spellType: "spell",
      school: "illusion",
      level: 3,
      classes: ["bard", "sorcerer", "warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 287",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "120 ft. (30-ft. Cube)",
      components: "S, M (a pinch of confetti)",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "save", saveAbility: "WIS" },
    damage: [],
    effectNotes: [
      "Creatures in a 30-foot Cube that can see the briefly appearing pattern make Wisdom saves. On a failure, a creature is Charmed, Incapacitated, and has Speed 0 for the duration. The effect ends for a creature if it takes any damage or another creature uses an action to shake it out of the stupor.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Place the 30-foot Cube and resolve Wisdom saves only for creatures able to see the pattern. On failure track Charmed, Incapacitated, Speed 0, and concentration.",
        "End the effect on a creature if it takes any damage or another creature uses an action to shake it; track remaining affected creatures independently.",
      ],
    },
    isManualOverride: true,
    notes:
      "Creatures that cannot see the pattern are not affected; damage or an action to shake ends the effect for that creature.",
  },

  major_image: {
    id: "major_image",
    name: "Major Image",
    category: {
      spellType: "spell",
      school: "illusion",
      level: 3,
      classes: ["bard", "sorcerer", "warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 295",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "120 ft.",
      components: "V, S, M (a bit of fleece)",
      duration: "Concentration, up to 10 minutes",
    },
    interaction: { type: "utility" },
    area: { shape: "Cube", sizeFeet: 20 },
    damage: [],
    upcasting: {
      notes:
        "When cast with a slot of level 4 or higher, the spell lasts until dispelled without requiring Concentration.",
    },
    effectNotes: [
      "Create an image of an object, creature, or phenomenon up to a 20-foot Cube within 120 feet. It includes sound, smell, and temperature, but cannot deal damage or cause conditions.",
      "Magic action to move the image within range and alter its appearance/actions/sounds so movement looks natural.",
      "Physical interaction reveals it as an illusion (things pass through it). A creature can take a Study action to examine it with an Intelligence (Investigation) check against your spell save DC; success reveals the illusion, making it faint and transparent.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Place the 20-foot Cube illusion and track concentration (or permanent if cast at level 4+).",
        "Allow the caster to use a Magic action to move and animate the image within range.",
        "Resolve Investigation checks (Study action) against spell save DC, or physical interaction to see through the illusion.",
      ],
    },
    isManualOverride: true,
    notes:
      "Upcasting with a 4th+ level slot makes the duration until dispelled without requiring concentration. Investigation check uses the Study action.",
  },

  phantom_steed: {
    id: "phantom_steed",
    name: "Phantom Steed",
    category: {
      spellType: "spell",
      school: "illusion",
      level: 3,
      classes: ["wizard"],
      source: "Player's Handbook (2024), pg. 304",
      concentration: false,
      ritual: true,
    },
    casting: {
      time: "1 minute or Ritual",
      range: "30 ft.",
      components: "V, S",
      duration: "1 hour",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "A Large quasi-real horselike steed appears in an unoccupied space within 30 feet lasting 1 hour.",
      "Equipped with saddle, bit, and bridle (equipment vanishes if carried > 10 feet from steed).",
      "Uses Riding Horse stat block, except it has Speed of 100 feet and can travel 13 miles per hour.",
      "When spell ends, fades gradually giving rider 1 minute to dismount. Ends early if steed takes any damage.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Spawn Phantom Steed token (Riding Horse statistics with 100 ft Speed).",
        "Track 1-hour duration (ritual-capable, no concentration).",
        "If steed takes any damage, dismiss steed immediately. At normal expiration, grant 1 minute dismount window.",
      ],
    },
    isManualOverride: true,
    notes:
      "Ritual-capable. Lasts 1 hour without concentration. Large steed with 100 ft. Speed (13 mph). Ends immediately if it takes any damage; 1-minute fadeout at normal expiration.",
  },

    // Level 4 (4 spells)
    distorted_distance: {
    id: "distorted_distance",
    name: "Distorted Distance",
    category: {
      spellType: "spell",
      school: "illusion",
      level: 4,
      classes: ["artificer", "bard", "warlock", "wizard"],
      source: "Arcana Unleashed, pg. 38",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "120 ft.",
      components: "V, S",
      duration: "Concentration, up to 10 minutes",
    },
    interaction: { type: "save", saveAbility: "INT" },
    area: { shape: "Sphere", sizeFeet: 60 },
    damage: [
      {
        dice: "2d10",
        type: "psychic",
        isBase: true,
        condition:
          "Dizzying Elongation on failed INT save (area is Difficult Terrain for target)",
      },
    ],
    effectNotes: [
      "Create spatial dilation in a 60-foot-radius Sphere within 120 feet lasting up to 10 minutes with concentration.",
      "For each creature seen in Sphere on cast, or entering or ending turn there (once per turn), choose one effect:",
      "- Dizzying Elongation: INT save. Fail = 2d10 Psychic damage and Sphere is Difficult Terrain for target until end of its turn.",
      "- Shortened Space: Target's Speed increases by 20 feet until the end of its next turn.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Place 60-ft-radius Sphere within 120 ft.",
        "For each creature caught (once per turn), choose Dizzying Elongation (INT save vs 2d10 Psychic + Difficult Terrain) OR Shortened Space (+20 ft Speed until next turn end).",
        "Track concentration up to 10 minutes.",
      ],
    },
    isManualOverride: true,
    notes:
      "Arcana Unleashed, pg. 38. 60-ft radius Sphere within 120 ft, conc up to 1 min. Choose per creature (once per turn): Dizzying Elongation (INT save: 2d10 Psychic + Difficult Terrain) or Shortened Space (+20 ft Speed).",
  },

  greater_invisibility: {
    id: "greater_invisibility",
    name: "Greater Invisibility",
    category: {
      spellType: "spell",
      school: "illusion",
      level: 4,
      classes: ["bard", "sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 281",
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
      "A creature you touch has the Invisible condition until the spell ends.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Confirm the touched target and track concentration and duration. Apply the Invisible condition using the current rules for attacks, visibility, and detection.",
      ],
    },
    isManualOverride: true,
    notes:
      "Do not infer additional effects; the 2024 spell description grants the Invisible condition for the duration.",
  },

  hallucinatory_terrain: {
    id: "hallucinatory_terrain",
    name: "Hallucinatory Terrain",
    category: {
      spellType: "spell",
      school: "illusion",
      level: 4,
      classes: ["bard", "druid", "warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 283",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "10 minutes",
      range: "300 ft.",
      components: "V, S, M (a mushroom)",
      duration: "24 hours",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Change the apparent look, sound, and smell of natural terrain in a 150-foot Cube within range. Structures, equipment, and creatures are unchanged; tactile characteristics remain real, so contact can reveal the illusion.",
      "If touch does not make the illusion obvious, a creature examining it can take the Study action and make an Intelligence (Investigation) check against your spell save DC. A creature that discerns the illusion sees a vague image over the real terrain.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Mark the 150-foot Cube and record the real terrain and its illusion. Keep structures, equipment, creatures, and tactile features unchanged.",
        "When a creature examines the effect and touch does not reveal it, resolve the Study action and Intelligence (Investigation) check against the caster's spell save DC; update that creature's perception if it discerns the illusion.",
      ],
    },
    isManualOverride: true,
    notes:
      "This changes perception, not actual terrain or difficult/impassable movement; do not alter map collision based on the illusion.",
  },

  phantasmal_killer: {
    id: "phantasmal_killer",
    name: "Phantasmal Killer",
    category: {
      spellType: "spell",
      school: "illusion",
      level: 4,
      classes: ["bard", "wizard"],
      source: "Player's Handbook (2024), pg. 304",
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
    damage: [{ dice: "4d10", type: "psychic", isBase: true }],
    upcasting: {
      notes: "+1d10 Psychic damage per spell slot level above 4th",
      perSlotLevel: { dice: "1d10", type: "psychic" },
    },
    effectNotes: [
      "Target one creature within 120 feet: Wisdom saving throw. On failed save: takes 4d10 Psychic damage and has Disadvantage on ability checks and attack rolls for the duration.",
      "On successful save: takes half damage, and the spell ends.",
      "At the end of each of its turns, target makes another Wisdom save. Failed save: takes the Psychic damage again. Successful save: the spell ends.",
      "Upcasting: Damage increases by 1d10 for each slot level above 4.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Target visible creature within 120 feet; prompt initial Wisdom save.",
        "Failed save: deal 4d10 (+1d10/slot above 4) Psychic damage and apply Disadvantage on ability checks and attack rolls; track concentration up to 1 minute.",
        "Successful save: deal half damage and end spell.",
        "At end of target's turns, prompt repeat Wisdom save: repeat full Psychic damage on failure, or end spell on success.",
      ],
    },
    isManualOverride: true,
    notes:
      "Notice 2024 update: Target takes damage immediately upon casting (4d10 Psychic, half on save). On failed save, also has Disadvantage on ability checks and attack rolls, and repeats save at end of each turn for recurring damage.",
  },

    // Level 5 (4 spells)
    creation: {
    id: "creation",
    name: "Creation",
    category: {
      spellType: "spell",
      school: "illusion",
      level: 5,
      classes: ["sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 259",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 minute",
      range: "30 feet",
      components: "V, S, M (a paintbrush)",
      duration: "Special",
    },
    damage: [],
    effectNotes: [
      "Create an object of vegetable matter or mineral matter up to a 5-foot Cube.",
      "Duration depends on material:",
      "- Vegetable matter: 24 hours",
      "- Stone or crystal: 12 hours",
      "- Precious metals: 1 hour",
      "- Gems: 10 minutes",
      "- Adamantine or mithral: 1 minute",
      "Using created object as another spell's Material component causes that spell to fail.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Choose material and shape object up to 5-ft Cube within 30 ft.",
        "Set duration timer based on material: Vegetable (24h), Stone/crystal (12h), Precious metal (1h), Gems (10 min), Adamantine/mithral (1 min).",
      ],
    },
    isManualOverride: true,
    notes:
      "1-minute cast. Creates an object up to a 5-foot Cube from shadow material. Duration by material: Vegetable (24h), Stone (12h), Precious metals (1h), Gems (10 min), Adamantine/mithral (1 min).",
  },

  dream: {
    id: "dream",
    name: "Dream",
    category: {
      spellType: "spell",
      school: "illusion",
      level: 5,
      classes: ["bard", "warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 266",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 minute",
      range: "Special",
      components: "V, S, M (a handful of sand)",
      duration: "8 hours",
    },
    interaction: { type: "save", saveAbility: "WIS" },
    damage: [
      {
        dice: "3d6",
        type: "psychic",
        isBase: false,
        condition:
          "Frightening dream; target fails save and damage occurs when it wakes",
      },
    ],
    effectNotes: [
      "Target a creature you know on the same plane. You or a willing creature you touch enters a trance as messenger, Incapacitated with Speed 0. If the target is asleep, the messenger appears in its dreams and can converse or shape the dream; the messenger can end the spell by leaving the trance. If the target is awake, the messenger knows and can end the spell or wait for it to sleep.",
      "For a terrifying dream, the messenger can deliver a message of up to 10 words; the target makes a Wisdom save. On failure, it gains no benefit from its rest and takes 3d6 Psychic damage when it wakes.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Verify target is known and on the same plane; record who enters the trance, its incapacitated state and the 8-hour window. GM resolves target sleep, dream conversation/imagery, and whether the messenger ends the trance.",
        "If using the frightening option, limit the message to 10 words, resolve the Wisdom save, and on failure track lost rest benefit and 3d6 Psychic damage on waking.",
      ],
    },
    isManualOverride: true,
    notes:
      "The target's sleep state changes when the dream begins; the frightening option has a delayed damage trigger on waking.",
  },

  mislead: {
    id: "mislead",
    name: "Mislead",
    category: {
      spellType: "spell",
      school: "illusion",
      level: 5,
      classes: ["bard", "warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 299",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Self",
      components: "S",
      duration: "Concentration, up to 1 hour",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "You gain the Invisible condition while an illusory double of you appears where you are standing.",
      "The double lasts for the duration, but your invisibility ends immediately after you make an attack roll, deal damage, or cast a spell.",
      "As a Magic action, you can move the illusory double up to twice your Speed and make it gesture, speak, and behave as you choose. It is intangible and invulnerable.",
      "You can see through its eyes and hear through its ears as if located in its space.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Apply Invisible condition to caster and place illusory double token at caster's space; track concentration up to 1 hour.",
        "If caster makes an attack roll, deals damage, or casts a spell, remove Invisible condition from caster (the double remains).",
        "Allow Magic action to move the double up to 2x Speed, manipulate speech/gestures, and switch perception to the double's senses.",
      ],
    },
    isManualOverride: true,
    notes:
      "Grants Invisibility and creates an illusory double. Invisibility breaks on attack, damage, or casting a spell, but double persists for up to 1 hour of concentration. Magic action moves double twice Speed and channels perception.",
  },

  seeming: {
    id: "seeming",
    name: "Seeming",
    category: {
      spellType: "spell",
      school: "illusion",
      level: 5,
      classes: ["bard", "sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 314",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "30 ft.",
      components: "V, S",
      duration: "8 hours",
    },
    interaction: { type: "save", saveAbility: "CHA" },
    damage: [],
    effectNotes: [
      "Give illusory appearance to each creature of your choice seen within 30 feet lasting 8 hours without concentration.",
      "Unwilling targets can make a Charisma saving throw to resist.",
      "Alters appearance of bodies and equipment (+/- 1 ft height, heavier/lighter), maintaining basic limb arrangement.",
      "Fails physical inspection. A creature can take the Study action to make an Intelligence (Investigation) check against your spell save DC to discern illusion.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Choose targets within 30 feet; prompt Charisma save for unwilling targets.",
        "Record illusory appearances for duration of 8 hours (no concentration).",
        "Adjudicate physical interactions and Study action Investigation checks vs spell save DC.",
      ],
    },
    isManualOverride: true,
    notes:
      "8 hours, no concentration. Alters appearance of any chosen creatures within 30 ft (unwilling make CHA save). Discovered by touch or Study action Intelligence (Investigation) check vs DC.",
  },

    // Level 6 (1 spells)
    programmed_illusion: {
    id: "programmed_illusion",
    name: "Programmed Illusion",
    category: {
      spellType: "spell",
      school: "illusion",
      level: 6,
      classes: ["bard", "wizard"],
      source: "Player's Handbook (2024), pg. 309",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "120 ft.",
      components: "V, S, M (jade dust worth 25+ GP)",
      duration: "Until dispelled",
    },
    interaction: { type: "utility" },
    area: { shape: "Cube", sizeFeet: 30 },
    damage: [],
    effectNotes: [
      "Create a dormant scripted illusion up to a 30-foot Cube within 120 feet lasting until dispelled.",
      "Activates upon specified visual or audible trigger within 30 feet, performing scripted routine (visual/audio) for up to 5 minutes.",
      "After performing, goes dormant for 10 minutes before it can trigger again.",
      "Physical interaction reveals it as an illusion. Study action with Intelligence (Investigation) check vs DC discerns illusion, making it transparent with hollow sounds.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Verify 25+ GP jade dust focus. Record 30-foot Cube scripted performance (<= 5 min) and trigger condition.",
        "Trigger activates performance, followed by 10-minute cooldown.",
        "Adjudicate physical interactions and Study action Investigation checks against spell save DC.",
      ],
    },
    isManualOverride: true,
    notes:
      "Requires 25+ GP jade dust. Permanent until dispelled. 30-foot Cube scripted performance (up to 5 min) activated by visual/auditory trigger within 30 ft, then 10 min cooldown.",
  },

    // Level 7 (3 spells)
    mirage_arcane: {
    id: "mirage_arcane",
    name: "Mirage Arcane",
    category: {
      spellType: "spell",
      school: "illusion",
      level: 7,
      classes: ["bard", "druid", "wizard"],
      source: "Player's Handbook (2024), pg. 299",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "10 minutes",
      range: "Sight (1-mile square)",
      components: "V, S",
      duration: "10 days",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Make terrain in an area up to 1 mile square look, sound, smell, and feel like some other sort of terrain for 10 days. Alter appearances of structures or add them where none exist (does not conceal, disguise, or add creatures).",
      "Includes audible, visual, tactile, and olfactory elements; can turn clear ground into Difficult Terrain (or vice versa) or otherwise impede movement.",
      "Pieces of illusory terrain removed from the area disappear immediately.",
      "Creatures with Truesight see through the illusion to true form, but all other tactile/physical elements remain so they still physically interact with it.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Define up to 1 mile square area in sight and record sensory/tactile terrain changes and 10-day duration.",
        "Adjudicate Difficult Terrain changes and physical barriers. Any removed matter vanishes.",
        "Creatures with Truesight perceive the underlying reality visually, but still physically interact with tactile elements.",
      ],
    },
    isManualOverride: true,
    notes:
      "10-minute cast, 10-day duration without concentration. Affects up to 1 mile square with full tactile illusion capable of creating or removing Difficult Terrain. Truesight reveals true appearance but does not pierce physical interaction.",
  },

  project_image: {
    id: "project_image",
    name: "Project Image",
    category: {
      spellType: "spell",
      school: "illusion",
      level: 7,
      classes: ["bard", "wizard"],
      source: "Player's Handbook (2024), pg. 309",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "500 miles",
      components: "V, S, M (a statuette of yourself worth 5+ GP)",
      duration: "Concentration, up to 1 day",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Create an intangible illusory copy of yourself at any previously seen location within 500 miles lasting up to 1 day with concentration.",
      "See through its eyes and hear through its ears as if in its space.",
      "Magic action: move image up to 60 feet, speak, gesture, and perfectly mimic mannerisms.",
      "Disappears and spell ends immediately if the image takes any damage.",
      "Physical interaction reveals illusion. Study action with Intelligence (Investigation) check vs DC reveals illusion (faint image, hollow sound).",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Place illusory copy at a previously seen location within 500 miles; track concentration up to 1 day.",
        "Allow Magic action to move copy up to 60 feet and speak/gesture.",
        "If the illusory copy takes any damage, dismiss image and end spell immediately.",
        "Adjudicate Investigation check (Study action) vs DC.",
      ],
    },
    isManualOverride: true,
    notes:
      "500-mile range. Creates an illusory copy lasting up to 1 day with concentration. Perceive through its senses and use Magic action to move 60 ft and speak. Ends immediately if the image takes any damage.",
  },

  simulacrum: {
    id: "simulacrum",
    name: "Simulacrum",
    category: {
      spellType: "spell",
      school: "illusion",
      level: 7,
      classes: ["wizard"],
      source: "Player's Handbook (2024), pg. 317",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "12 hours",
      range: "Touch",
      components:
        "V, S, M (powdered ruby worth 1,500+ GP, which the spell consumes)",
      duration: "Until dispelled",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Touch a Beast or Humanoid within 10 feet throughout casting + pile of ice/snow to create an illusory duplicate lasting until dispelled.",
      "Uses game statistics of target at time of casting, except it is a Construct, its HP maximum is half, and it cannot cast Simulacrum.",
      "Friendly to you, obeys commands, and acts on your turn in combat. Cannot gain levels or regain expended spell slots.",
      "Repaired via complex laboratory process consuming 100 GP alchemical supplies per Hit Point restored. Only one active simulacrum per caster at a time.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Verify 1,500+ GP powdered ruby consumed and 12-hour casting time.",
        "Instantiate duplicate token: Construct creature type, half base max HP, no spell slots recoverable.",
        "If caster creates another simulacrum, destroy previous duplicate immediately.",
      ],
    },
    isManualOverride: true,
    notes:
      "12-hour cast, consumes 1,500+ GP ruby. Duplicates a Beast or Humanoid with half max HP as a Construct. Acts on caster's turn. Cannot recover spell slots or gain levels. Only one active per caster.",
  },

    // Level 8 (2 spells)
    // Entrancing Mirrors (Arcana Unleashed, pg. 39)
  entrancing_mirrors: {
    id: "entrancing_mirrors",
    name: "Entrancing Mirrors",
    category: {
      spellType: "spell",
      school: "illusion",
      level: 8,
      classes: ["bard", "sorcerer", "warlock", "wizard"],
      source: "Arcana Unleashed, pg. 39",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "90 ft.",
      components: "V, S, M (a mirror shard)",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "save", saveAbility: "INT" },
    damage: [
      {
        dice: "7d6",
        type: "psychic",
        isBase: true,
        condition: "Failed Intelligence save (half damage on success)",
      },
    ],
    effectNotes: [
      "Create dozens of illusory mirrors to confuse up to three creatures you can see within 90 feet.",
      "Intelligence saving throw: on a failed save, target takes 7d6 Psychic damage and has the Stunned condition with Speed halved.",
      "On a successful save, target takes half damage only.",
      "A Stunned target repeats the Intelligence save at the end of each of its turns, ending the spell on itself on a success.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Target up to 3 creatures within 90 ft; prompt Intelligence saves.",
        "Failed save: deal 7d6 Psychic damage, apply Stunned condition and halve Speed.",
        "Successful save: deal half damage only.",
        "Stunned targets repeat INT save at end of each turn to end.",
      ],
    },
    isManualOverride: true,
    notes:
      "Arcana Unleashed, pg. 39. Conc up to 1 min. Targets up to 3 creatures within 90 ft. INT save vs 7d6 Psychic + Stunned + speed halved (half damage only on success). Repeat save at end of turns.",
  },

  // Illusory Dragon (Arcana Unleashed, pg. 40)
  illusory_dragon: {
    id: "illusory_dragon",
    name: "Illusory Dragon",
    category: {
      spellType: "spell",
      school: "illusion",
      level: 8,
      classes: ["wizard"],
      source: "Arcana Unleashed, pg. 40",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "120 ft.",
      components: "S",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "save", saveAbility: "WIS" },
    area: { shape: "Cone", sizeFeet: 60 },
    damage: [
      {
        dice: "6d6",
        type: "choice",
        typeChoices: [
          "acid",
          "cold",
          "fire",
          "lightning",
          "necrotic",
          "poison",
        ],
        isBase: true,
        condition:
          "Bonus Action 60-ft cone breath weapon: Intelligence save for half damage",
      },
    ],
    effectNotes: [
      "Gather threads of shadow material to create a Huge shadowy dragon within 120 feet. Occupies space as a creature, immune to all damage and conditions.",
      "Arrival Fear: When it appears, enemies that can see it must make a Wisdom saving throw or drop held items and gain the Frightened condition for the duration (repeats save when breaking line of sight).",
      "Breath Weapon: As a Bonus Action, move the dragon up to 60 feet and exhale a 60-foot Cone. Creatures make an Intelligence saving throw taking 6d6 Acid, Cold, Fire, Lightning, Necrotic, or Poison damage (chosen upon creation) on failure, or half on success.",
      "Study Action: Intelligence (Investigation) check against spell save DC discerns the illusion, granting Advantage on saves against its fear and breath.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Place Huge shadowy dragon within 120 ft; prompt Wisdom saves vs Frightened for enemies with line of sight.",
        "Bonus Action: move dragon up to 60 ft and unleash 60-ft Cone breath.",
        "Prompt Intelligence saves for creatures in cone: 6d6 chosen elemental damage (half on success).",
        "Investigation check against spell DC grants Advantage on subsequent saves.",
      ],
    },
    isManualOverride: true,
    notes:
      "Arcana Unleashed, pg. 40. Conc up to 1 min. 120 ft. Huge tangible dragon immune to damage/conditions. WIS save vs Frightened. Bonus Action move 60 ft + 60-ft Cone breath (INT save vs 6d6 chosen damage). Investigation check against spell DC reveals illusion.",
  },

    // Level 9 (2 spells)
    // Vision of Elapsing Eons (Arcana Unleashed, pg. 45)
  vision_of_elapsing_eons: {
    id: "vision_of_elapsing_eons",
    name: "Vision of Elapsing Eons",
    category: {
      spellType: "spell",
      school: "illusion",
      level: 9,
      classes: ["bard", "sorcerer", "warlock", "wizard"],
      source: "Arcana Unleashed, pg. 45",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "120 ft.",
      components: "V, S",
      duration: "1 minute",
    },
    interaction: { type: "save", saveAbility: "INT" },
    damage: [
      {
        dice: "10d12",
        type: "psychic",
        isBase: true,
        condition: "Failed Intelligence save",
      },
    ],
    effectNotes: [
      "Tricks a creature within 120 feet into believing it is witnessing eons passing in moments.",
      "Intelligence saving throw: on a failed save, target takes 10d12 Psychic damage and has the Paralyzed condition for the 1-minute duration.",
      "While Paralyzed, target repeats the Intelligence save at the end of each of its turns: on a failed save, it gains 1 Exhaustion level; on a success, the spell ends.",
      "Ends early if another creature within 5 feet uses an action to shake the target free.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Target creature within 120 ft; prompt Intelligence save.",
        "Failed save: deal 10d12 Psychic damage and apply Paralyzed condition (1 min, no conc).",
        "Turn end: prompt INT save; failure gains 1 Exhaustion level; success ends spell.",
        "Allow ally within 5 ft to spend action to shake target free.",
      ],
    },
    isManualOverride: true,
    notes:
      "Arcana Unleashed, pg. 45. 1 min (no concentration). 120 ft. INT save vs 10d12 Psychic + Paralyzed. Turn end save: failure adds 1 Exhaustion level; success ends spell. Ally action can end early.",
  },

  weird: {
    id: "weird",
    name: "Weird",
    category: {
      spellType: "spell",
      school: "illusion",
      level: 9,
      classes: ["warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 341",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "120 feet",
      components: "V, S",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "save", saveAbility: "WIS" },
    area: { shape: "Sphere", sizeFeet: 30 },
    damage: [
      {
        dice: "10d10",
        type: "psychic",
        isBase: true,
        condition: "Initial damage on failed WIS save (half on success)",
      },
      {
        dice: "5d10",
        type: "psychic",
        isBase: false,
        condition:
          "At end of turn while Frightened on failed recurring WIS save",
      },
    ],
    effectNotes: [
      "Create illusory terrors in a 30-foot-radius Sphere centered within 120 feet.",
      "Each creature of your choice makes a Wisdom saving throw.",
      "On a failed save, a target takes 10d10 Psychic damage and has the Frightened condition for the duration.",
      "On a successful save, a target takes half damage only and is not Frightened.",
      "A Frightened target makes a Wisdom saving throw at the end of each of its turns, taking 5d10 Psychic damage on a fail, or ending the spell on that target on a success.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Place 30-foot-radius Sphere within 120 feet.",
        "Prompt WIS save for chosen creatures in area.",
        "On fail, apply 10d10 Psychic and Frightened condition (half damage only on save).",
        "At end of turn, Frightened targets repeat WIS save: 5d10 Psychic on fail, ends on success.",
      ],
    },
    isManualOverride: true,
    notes:
      "Concentration up to 1 min. 30-ft radius Sphere within 120 ft. Chosen targets make WIS save: 10d10 Psychic + Frightened (half on save). Repeats WIS save at end of each turn: 5d10 Psychic on fail, ends on success.",
  },
};
