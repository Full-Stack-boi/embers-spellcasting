/**
 * Manual Spell Formula Overrides — Divination (Leveled Spells 1st–9th)
 */

import type { SpellFormula } from "../../../types/spellFormula";

export const divinationSpellOverrides: Record<string, SpellFormula> = {
    // Level 1 (7 spells)
    // Comprehend Languages (D&D Free Rules 2024, Spell Descriptions)
  comprehend_languages: {
    id: "comprehend_languages",
    name: "Comprehend Languages",
    category: {
      spellType: "spell",
      school: "divination",
      level: 1,
      classes: ["bard", "sorcerer", "warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 252",
      concentration: false,
      ritual: true,
    },
    casting: {
      time: "1 action or Ritual",
      range: "Self",
      components: "V, S, M (a pinch of soot and salt)",
      duration: "1 hour",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Understand the literal meaning of spoken language you hear and written language you see while touching its surface; reading takes about 1 minute per page.",
      "The spell doesn't decode secret messages or glyphs that aren't part of a written language.",
    ],
    isManualOverride: true,
    notes:
      "Language comprehension and reading time are resolved by the player and GM; encrypted or non-language symbols remain undecoded.",
  },

  detect_evil_and_good: {
    id: "detect_evil_and_good",
    name: "Detect Evil and Good",
    category: {
      spellType: "spell",
      school: "divination",
      level: 1,
      classes: ["cleric", "paladin"],
      source: "Player's Handbook (2024), pg. 261",
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
    damage: [],
    effectNotes: [
      "For the duration, sense the location of Aberrations, Celestials, Elementals, Fey, Fiends, and Undead within 30 feet. You also sense whether Hallow is active in the area and where.",
      "The detection is blocked by 1 foot of stone, dirt, or wood; 1 inch of metal; or a thin sheet of lead.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Track concentration, caster position, and the 30-foot detection radius. GM determines qualifying creature locations and Hallow presence, respecting the listed barriers.",
      ],
    },
    isManualOverride: true,
    notes:
      "The spell reports locations and Hallow presence; it does not identify alignment or detect every creature described as evil or good.",
  },

  // Detect Magic (D&D Free Rules 2024, Spell Descriptions)
  detect_magic: {
    id: "detect_magic",
    name: "Detect Magic",
    category: {
      spellType: "spell",
      school: "divination",
      level: 1,
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
      source: "Player's Handbook (2024), pg. 262",
      concentration: true,
      ritual: true,
    },
    casting: {
      time: "1 action or Ritual",
      range: "Self",
      components: "V, S",
      duration: "Concentration, up to 10 minutes",
    },
    area: { shape: "Sphere", sizeFeet: 30 },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "For the duration, sense magical effects within 30 feet. Using a Magic action, you can see a faint aura around visible creatures or objects bearing magic and learn a spell's school if a spell created the effect.",
      "The spell is blocked by 1 foot of stone, dirt, or wood; 1 inch of metal; or a thin sheet of lead.",
    ],
    isManualOverride: true,
    notes:
      "Detection and aura inspection require GM adjudication; blockers are resolved manually.",
  },

  // Detect Poison and Disease (D&D Free Rules 2024, Spell Descriptions)
  detect_poison_and_disease: {
    id: "detect_poison_and_disease",
    name: "Detect Poison and Disease",
    category: {
      spellType: "spell",
      school: "divination",
      level: 1,
      classes: ["cleric", "druid", "paladin", "ranger"],
      source: "Player's Handbook (2024), pg. 262",
      concentration: true,
      ritual: true,
    },
    casting: {
      time: "1 action or Ritual",
      range: "Self",
      components: "V, S, M (a yew leaf)",
      duration: "Concentration, up to 10 minutes",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "For the duration, sense the location and kind of poisons, poisonous or venomous creatures, and magical contagions within 30 feet.",
      "The spell is blocked by 1 foot of stone, dirt, or wood; 1 inch of metal; or a thin sheet of lead.",
    ],
    isManualOverride: true,
    notes: "Detection results and blocking materials require GM adjudication.",
  },

  hunters_mark: {
    id: "hunters_mark",
    name: "Hunter's Mark",
    category: {
      spellType: "spell",
      school: "divination",
      level: 1,
      classes: ["ranger"],
      source: "Player's Handbook (2024), pg. 287",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "Bonus Action",
      range: "90 ft.",
      components: "V",
      duration: "Concentration, up to 1 hour",
    },
    interaction: { type: "utility" },
    damage: [
      {
        dice: "1d6",
        type: "force",
        isBase: false,
        condition: "Whenever you hit the marked target with an attack roll",
      },
    ],
    effectNotes: [
      "Mark a visible creature as your quarry. You deal an extra 1d6 Force damage to it whenever you hit it with an attack roll, and have Advantage on Wisdom (Perception or Survival) checks to find it.",
      "If the target drops to 0 HP while the spell continues, you can use a Bonus Action to move the mark to a new visible creature within range. Concentration lasts up to 8 hours with a level 3-4 slot or 24 hours with a level 5+ slot.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Record the marked target, +1d6 Force damage on the caster's attack-roll hits, Advantage on Wisdom (Perception or Survival) checks to find it, and concentration duration.",
        "If the target reaches 0 HP, allow a Bonus Action to move the mark to a visible creature within 90 feet. Apply extended duration for slot levels 3-4 or 5+.",
      ],
    },
    isManualOverride: true,
    notes:
      "The 2024 version deals Force damage; do not reuse BG3/legacy damage typing. Mark movement requires a later Bonus Action.",
  },

  // Identify (D&D Free Rules 2024, Spell Descriptions)
  identify: {
    id: "identify",
    name: "Identify",
    category: {
      spellType: "spell",
      school: "divination",
      level: 1,
      classes: ["bard", "wizard"],
      source: "Player's Handbook (2024), pg. 287",
      concentration: false,
      ritual: true,
    },
    casting: {
      time: "1 minute or Ritual",
      range: "Touch",
      components: "V, S, M (a pearl worth 100+ GP)",
      duration: "Instantaneous",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Touch an object throughout the casting to learn a magic item's properties, use, Attunement requirement, charges, ongoing spells, and (if spell-created) the spell's name.",
      "Alternatively, touch a creature throughout the casting to learn which ongoing spells affect it.",
    ],
    isManualOverride: true,
    notes:
      "Requires uninterrupted contact for the full casting; the revealed item or spell details are adjudicated by the GM.",
  },

  speak_with_animals: {
    id: "speak_with_animals",
    name: "Speak with Animals",
    category: {
      spellType: "spell",
      school: "divination",
      level: 1,
      classes: ["bard", "druid", "ranger", "warlock"],
      source: "Player's Handbook (2024), pg. 318",
      concentration: false,
      ritual: true,
    },
    casting: {
      time: "1 action",
      range: "Self",
      components: "V, S",
      duration: "10 minutes",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Comprehend and verbally communicate with Beasts for 10 minutes without concentration (can be cast as a Ritual).",
      "Can use any of the Influence action's skill options with Beasts.",
      "Beasts can give information about nearby locations, monsters, and whatever they perceived within the past day.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Cast as Action or Ritual; track 10-minute duration without concentration.",
        "Enable verbal communication and Influence action checks with Beasts.",
      ],
    },
    isManualOverride: true,
    notes:
      "Ritual eligible. 10 minutes, no concentration. Comprehend and verbally communicate with Beasts; allow Influence action checks.",
  },

    // Level 2 (8 spells)
    // Augury (D&D Free Rules 2024, Spell Descriptions)
  augury: {
    id: "augury",
    name: "Augury",
    category: {
      spellType: "spell",
      school: "divination",
      level: 2,
      classes: ["cleric", "druid", "wizard"],
      source: "Player's Handbook (2024), pg. 244",
      concentration: false,
      ritual: true,
    },
    casting: {
      time: "1 minute or Ritual",
      range: "Self",
      components: "V, S, M (divination tokens worth 25+ GP)",
      duration: "Instantaneous",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Ask for an omen about the results of a course of action you plan to take within the next 30 minutes. The GM provides Weal, Woe, Weal and woe, or Indifference; the omen doesn't account for circumstances that could change the outcome.",
      "After the first casting before a Long Rest, each additional casting has a cumulative 25% chance of receiving no answer.",
    ],
    isManualOverride: true,
    notes:
      "The GM determines the omen and tracks repeated casts before the next Long Rest.",
  },

  beast_sense: {
    id: "beast_sense",
    name: "Beast Sense",
    category: {
      spellType: "spell",
      school: "divination",
      level: 2,
      classes: ["druid", "ranger"],
      source: "Player's Handbook (2024), pg. 245",
      concentration: true,
      ritual: true,
    },
    casting: {
      time: "1 action",
      range: "Touch",
      components: "S",
      duration: "Concentration, up to 1 hour",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Touch a willing beast. For the duration, you can perceive through the beast's senses as well as your own.",
      "When perceiving through the beast's senses, you benefit from any special senses that the beast possesses.",
      "Unlike the 2014 version, your own body is not blinded and deafened while looking through the beast.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Touch willing beast.",
        "Track concentration up to 1 hour.",
        "GM adjudicates shared sensory perception and beast's special senses without blinding the caster.",
      ],
    },
    isManualOverride: true,
    notes:
      "Player's Handbook (2024). Marked for detailed verification against printed book/DDB. Ritual. In 2024, you perceive through the beast's senses simultaneously with your own without blinding or deafening your body.",
  },

  // Detect Thoughts (D&D Free Rules 2024, Spell Descriptions)
  detect_thoughts: {
    id: "detect_thoughts",
    name: "Detect Thoughts",
    category: {
      spellType: "spell",
      school: "divination",
      level: 2,
      classes: ["bard", "sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 262",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Self",
      components: "V, S, M (a copper piece)",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Sense the presence of thoughts within 30 feet from creatures that know languages or are telepathic; this doesn't reveal the thoughts themselves. The spell is blocked by 1 foot of stone, dirt, or wood; 1 inch of metal; or a thin sheet of lead.",
      "As a Magic action, read the surface thoughts of a creature you can see within 30 feet or one you sensed. On a later Magic action, you can probe deeper; resolve the target's Wisdom save and possible discovery of the probe manually.",
    ],
    isManualOverride: true,
    notes:
      "Track Sense Thoughts, selected targets, deeper probing, and barriers manually; deeper probing can alert the target.",
  },

  // Find Traps (D&D Free Rules 2024, Spell Descriptions)
  find_traps: {
    id: "find_traps",
    name: "Find Traps",
    category: {
      spellType: "spell",
      school: "divination",
      level: 2,
      classes: ["cleric", "druid", "ranger"],
      source: "Player's Handbook (2024), pg. 273",
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
    effectNotes: [
      "Sense any trap in range and line of sight and learn the general nature of its danger, but not its location. Traps include harmful objects or mechanisms; natural structural hazards such as an unstable ceiling are not detected.",
    ],
    isManualOverride: true,
    notes:
      "The GM checks only qualifying traps within line of sight and reveals presence and general danger, not location.",
  },

  locate_animals_or_plants: {
    id: "locate_animals_or_plants",
    name: "Locate Animals or Plants",
    category: {
      spellType: "spell",
      school: "divination",
      level: 2,
      classes: ["bard", "druid", "ranger"],
      source: "Player's Handbook (2024), pg. 292",
      concentration: false,
      ritual: true,
    },
    casting: {
      time: "1 action or Ritual",
      range: "Self",
      components: "V, S, M (fur from a bloodhound)",
      duration: "Instantaneous",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Describe or name a specific kind of Beast, Plant creature, or nonmagical plant.",
      "You learn the direction and distance to the closest creature or plant of that kind within 5 miles, if any are present.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Record the described kind of Beast, Plant creature, or nonmagical plant.",
        "The 5-mile range operates on a narrative/world map level rather than a tactical token grid. GM adjudicates presence and narrates direction and distance to the closest match.",
        "Note that the duration is Instantaneous (a single ping at casting); it does not provide continuous tracking.",
      ],
    },
    isManualOverride: true,
    notes:
      "Player's Handbook (2024), pg. 292. Instantaneous single ping revealing direction and distance to the nearest target within 5 miles. Unlike Locate Creature, it does not require concentration, does not track ongoing movement, and lacks the lead barrier block.",
  },

  // Locate Object (D&D Free Rules 2024, Spell Descriptions)
  locate_object: {
    id: "locate_object",
    name: "Locate Object",
    category: {
      spellType: "spell",
      school: "divination",
      level: 2,
      classes: ["bard", "cleric", "druid", "paladin", "ranger", "wizard"],
      source: "Player's Handbook (2024), pg. 293",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Self",
      components: "V, S, M (a forked twig)",
      duration: "Concentration, up to 10 minutes",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Describe a familiar object. If it is within 1,000 feet, sense its direction and, if moving, its direction of movement. You can seek a specific object seen up close before or the nearest object of a named kind.",
      "A thickness of lead blocks a direct path to the object.",
    ],
    isManualOverride: true,
    notes:
      "The GM determines whether the described object is sufficiently familiar and within range; lead blocks the spell.",
  },

  mind_spike: {
    id: "mind_spike",
    name: "Mind Spike",
    category: {
      spellType: "spell",
      school: "divination",
      level: 2,
      classes: ["sorcerer", "warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 298",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "120 ft.",
      components: "S",
      duration: "Concentration, up to 1 hour",
    },
    interaction: { type: "save", saveAbility: "WIS" },
    damage: [{ dice: "3d8", type: "psychic", isBase: true }],
    upcasting: {
      notes: "+1d8 Psychic damage per spell slot level above 2nd",
      perSlotLevel: { dice: "1d8", type: "psychic" },
    },
    effectNotes: [
      "Drive psionic energy into one creature you can see within 120 feet. Target makes a Wisdom saving throw, taking 3d8 Psychic damage on a failed save or half as much on a successful one.",
      "On a failed save, you also always know the target's location until the spell ends while on the same plane of existence.",
      "While you have this knowledge, the target cannot become hidden from you, and gains no benefit from the Invisible condition against you.",
      "Upcasting: Damage increases by 1d8 for each slot level above 2.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Target one visible creature within 120 feet and resolve Wisdom saving throw for 3d8 (+1d8/slot above 2) Psychic damage (half on success).",
        "On a failed save, track concentration up to 1 hour: caster always knows target's location on the same plane; target cannot hide from caster and gains no benefit from Invisibility against caster.",
      ],
    },
    isManualOverride: true,
    notes:
      "Level 2 Divination, Concentration up to 1 hour. Wisdom save for 3d8 Psychic (half on save). On failure, caster tracks location on same plane, negating hiding and Invisibility benefits.",
  },

  // See Invisibility (Player's Handbook 2024, pg. 314)
  see_invisibility: {
    id: "see_invisibility",
    name: "See Invisibility",
    category: {
      spellType: "spell",
      school: "divination",
      level: 2,
      classes: ["bard", "sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 314",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Self",
      components: "V, S, M (a pinch of talc)",
      duration: "1 hour",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "For the duration, see creatures and objects with the Invisible condition as if visible, and see into the Ethereal Plane; creatures and objects there appear ghostly.",
    ],
    isManualOverride: true,
    notes:
      "Apply the caster's altered perception manually; this does not itself reveal hidden creatures that aren't Invisible.",
  },

    // Level 3 (3 spells)
    // Clairvoyance (D&D Free Rules 2024, Spell Descriptions)
  clairvoyance: {
    id: "clairvoyance",
    name: "Clairvoyance",
    category: {
      spellType: "spell",
      school: "divination",
      level: 3,
      classes: ["bard", "cleric", "sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 250",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "10 minutes",
      range: "1 mile",
      components:
        "V, S, M (a focus worth 100+ GP: jeweled horn for hearing or glass eye for seeing)",
      duration: "Concentration, up to 10 minutes",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Create an Invisible, intangible, invulnerable sensor at a familiar location or an obvious unfamiliar location within range. Choose seeing or hearing and perceive through it as if in its space. As a Bonus Action, switch between the two senses.",
      "A creature that can see the sensor perceives it as a luminous orb about the size of a fist.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Choose the sensor's location and initial sense; track concentration and the 10-minute duration. The GM adjudicates what the sensor can perceive and which creatures can see it.",
      ],
    },
    isManualOverride: true,
    notes:
      "Remote sensing is narrative/GM-adjudicated; Embers does not create a sensor token or provide remote vision automatically.",
  },

  sending: {
    id: "sending",
    name: "Sending",
    category: {
      spellType: "spell",
      school: "divination",
      level: 3,
      classes: ["bard", "cleric", "wizard"],
      source: "Player's Handbook (2024), pg. 314",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Unlimited",
      components: "V, S, M (a copper wire)",
      duration: "Instantaneous",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Send a message of 25 words or fewer to a creature you have met or that was described to you.",
      "Target hears message in its mind, recognizes sender if known, and can reply immediately in kind.",
      "Can send across planes, but 5% failure chance (caster knows if delivery fails).",
      "Upon receiving message, a creature can block your ability to reach it again with this spell.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Compose message of <= 25 words to known or described creature.",
        "If cross-plane, roll d100 (1-5 = delivery failure, caster notified).",
        "Allow immediate reply (<= 25 words). Track if recipient chooses to block future Sending spells from caster.",
      ],
    },
    isManualOverride: true,
    notes:
      "Unlimited range. 25-word message with immediate 25-word reply. Crosses planes with 5% failure chance. Recipient can block future Sending attempts from caster.",
  },

  tongues: {
    id: "tongues",
    name: "Tongues",
    category: {
      spellType: "spell",
      school: "divination",
      level: 3,
      classes: ["bard", "cleric", "sorcerer", "warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 334",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Touch",
      components: "V, M (a miniature ziggurat)",
      duration: "1 hour",
    },
    damage: [],
    effectNotes: [
      "Touch a willing creature, granting it the ability to understand any spoken or signed language that it hears or sees for 1 hour.",
      "When the target communicates by speaking or signing, any creature that knows at least one language can understand it if able to hear or see.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Touch willing creature.",
        "Grant ability to comprehend all spoken and signed languages for 1 hour.",
        "Grant all creatures knowing at least one language ability to understand target's speech and signing.",
      ],
    },
    isManualOverride: true,
    notes:
      "Touch, 1 hour (no concentration). Target understands any spoken or signed language heard/seen, and any creature knowing at least 1 language understands target's speech or signing.",
  },

    // Level 4 (3 spells)
    // Arcane Eye (D&D Free Rules 2024, Spell Descriptions)
  arcane_eye: {
    id: "arcane_eye",
    name: "Arcane Eye",
    category: {
      spellType: "spell",
      school: "divination",
      level: 4,
      classes: ["wizard"],
      source: "Player's Handbook (2024), pg. 242",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "30 ft.",
      components: "V, S, M (a bit of bat fur)",
      duration: "Concentration, up to 1 hour",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Create an Invisible, invulnerable eye within range that hovers for the duration. You mentally receive visual information from it; it sees in every direction and has Darkvision to 30 feet.",
      "As a Bonus Action, move the eye up to 30 feet in any direction. A solid barrier blocks it, but it can pass through an opening at least 1 inch across.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Track the eye's location, movement, line of access through openings, visual information, and concentration; the eye's movement is not a token automation.",
      ],
    },
    isManualOverride: true,
    notes:
      "The caster perceives through the eye; track its position and what its all-direction vision can observe manually.",
  },

  divination: {
    id: "divination",
    name: "Divination",
    category: {
      spellType: "spell",
      school: "divination",
      level: 4,
      classes: ["cleric", "druid", "wizard"],
      source: "Player's Handbook (2024), pg. 264",
      concentration: false,
      ritual: true,
    },
    casting: {
      time: "1 action or Ritual",
      range: "Self",
      components: "V, S, M (incense worth 25+ GP, consumed)",
      duration: "Instantaneous",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Ask a god or its servants one question about a specific goal, event, or activity expected within 7 days. The DM gives a truthful reply, possibly a short phrase or cryptic rhyme; the answer does not account for circumstances that may change the outcome.",
      "Each casting after the first before finishing a Long Rest has a cumulative 25% chance to receive no answer.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Have the player state one specific question about an event within 7 days; the GM supplies a truthful answer and determines relevant caveats. Track previous castings since the last Long Rest and roll the cumulative no-answer chance after the first.",
      ],
    },
    isManualOverride: true,
    notes:
      "This is a GM-mediated question about a specific near-future event, not unrestricted future sight.",
  },

  locate_creature: {
    id: "locate_creature",
    name: "Locate Creature",
    category: {
      spellType: "spell",
      school: "divination",
      level: 4,
      classes: ["bard", "cleric", "druid", "paladin", "ranger", "wizard"],
      source: "Player's Handbook (2024), pg. 292",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Self",
      components: "V, S, M (fur from a bloodhound)",
      duration: "Concentration, up to 1 hour",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Describe or name a creature familiar to you. You sense the direction to its location if within 1,000 feet of you; if moving, you know the direction of movement.",
      "Can locate a specific known creature or the nearest creature of a specific kind (such as a human or unicorn) if you have seen such a creature within 30 feet at least once.",
      "Cannot locate a creature in a different form (such as under Flesh to Stone or Polymorph), or if any thickness of lead blocks a direct path between you and the creature.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Record target creature/kind and concentration up to 1 hour.",
        "GM reveals direction and movement direction while within 1,000 feet.",
        "Blocked if target is shapechanged/polymorphed or if a lead barrier intervenes.",
      ],
    },
    isManualOverride: true,
    notes:
      "Player's Handbook (2024), pg. 292. Concentration up to 1 hour; senses direction within 1,000 ft. Foilable by lead barriers or polymorph effects.",
  },

    // Level 5 (7 spells)
    // Commune (D&D Free Rules 2024, Spell Descriptions)
  commune: {
    id: "commune",
    name: "Commune",
    category: {
      spellType: "spell",
      school: "divination",
      level: 5,
      classes: ["cleric"],
      source: "Player's Handbook (2024), pg. 252",
      concentration: false,
      ritual: true,
    },
    casting: {
      time: "1 minute or Ritual",
      range: "Self",
      components: "V, S, M (incense)",
      duration: "1 minute",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Contact a deity or divine proxy and ask up to three yes/no questions during the spell's 1-minute duration. Answers are correct within the entity's knowledge; the GM can answer unclearly or with a short phrase when a one-word answer would mislead or conflict with the deity's interests.",
      "Each casting after the first before a Long Rest has a cumulative 25% chance of receiving no answer.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Track the number of castings since the last Long Rest and roll the cumulative no-answer chance after the first; the GM adjudicates what the contacted entity knows and how it responds.",
      ],
    },
    isManualOverride: true,
    notes:
      "Answers depend on the contacted divine entity's knowledge and interests; this is GM-facing narrative resolution, not an automatic information lookup.",
  },

  // Commune with Nature (D&D Free Rules 2024, Spell Descriptions)
  commune_with_nature: {
    id: "commune_with_nature",
    name: "Commune with Nature",
    category: {
      spellType: "spell",
      school: "divination",
      level: 5,
      classes: ["druid", "ranger"],
      source: "Player's Handbook (2024), pg. 252",
      concentration: false,
      ritual: true,
    },
    casting: {
      time: "1 minute or Ritual",
      range: "Self",
      components: "V, S",
      duration: "Instantaneous",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Learn about the surrounding natural area: within 3 miles outdoors or 300 feet in natural underground settings. The spell fails where nature has been replaced by construction.",
      "Choose three: settlement locations; planar portal locations; location of one CR 10+ Celestial, Elemental, Fey, Fiend, or Undead (GM chooses); most prevalent kind of plant, mineral, or Beast (choose which); or locations of bodies of water.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Determine whether the location qualifies as natural terrain, select three information categories, and have the GM provide only applicable facts within the correct radius.",
      ],
    },
    isManualOverride: true,
    notes:
      "The GM determines available facts in the area; the effect does not function in areas where nature has been replaced by construction.",
  },

  contact_other_plane: {
    id: "contact_other_plane",
    name: "Contact Other Plane",
    category: {
      spellType: "spell",
      school: "divination",
      level: 5,
      classes: ["warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 255",
      concentration: false,
      ritual: true,
    },
    casting: {
      time: "1 minute",
      range: "Self",
      components: "V",
      duration: "1 minute",
    },
    interaction: { type: "save", saveAbility: "INT" },
    damage: [
      {
        dice: "6d6",
        type: "psychic",
        isBase: true,
        condition: "On failed DC 15 INT save",
      },
    ],
    effectNotes: [
      "Mentally contact an otherworldly entity.",
      "Make a DC 15 Intelligence saving throw.",
      "On success: Ask up to five questions before spell ends. DM answers each with one word ('yes', 'no', 'maybe', 'never', 'irrelevant', 'unclear') or short phrase.",
      "On failure: Take 6d6 Psychic damage and gain Incapacitated condition until finishing a Long Rest (ended by Greater Restoration).",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Prompt DC 15 Intelligence saving throw for caster.",
        "On success: permit up to 5 questions (DM gives one-word answers).",
        "On fail: apply 6d6 Psychic damage and Incapacitated condition until Long Rest.",
      ],
    },
    isManualOverride: true,
    notes:
      "Ritual. 1 minute cast. DC 15 INT save: On fail, take 6d6 Psychic damage and Incapacitated until Long Rest. On success, ask entity up to 5 questions with one-word answers.",
  },

  legend_lore: {
    id: "legend_lore",
    name: "Legend Lore",
    category: {
      spellType: "spell",
      school: "divination",
      level: 5,
      classes: ["bard", "cleric", "wizard"],
      source: "Player's Handbook (2024), pg. 290",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "10 minutes",
      range: "Self",
      components:
        "V, S, M (incense worth 250+ GP, which the spell consumes, and four ivory strips worth 50+ GP each)",
      duration: "Instantaneous",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Name or describe a famous person, place, or object. The spell brings to your mind a brief summary of significant lore about that famous subject, as described by the GM.",
      "The lore might consist of important details, amusing revelations, or secret lore that has never been widely known. The more information you already know about the subject, the more precise and detailed the information you receive. The information is accurate but might be couched in figurative language or poetry, as determined by the GM.",
      "If the famous subject you chose isn't actually famous, you hear sad musical notes played on a trombone, and the spell fails.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Verify the material component (250+ GP incense consumed, four 50+ GP ivory strips).",
        "Confirm the subject is famous; if not, rule spell failure with a trombone sound.",
        "The GM provides accurate (potentially figurative or poetic) lore based on existing knowledge.",
      ],
    },
    isManualOverride: true,
    notes:
      "Player's Handbook (2024), pg. 290. Requires a famous subject; GM adjudicates lore accuracy and poetic delivery. Fails with trombone music if the subject is not famous.",
  },

  // Mordenkainen’s Lucubration (Arcana Unleashed, pg. 42)
  mordenkainens_lucubration: {
    id: "mordenkainens_lucubration",
    name: "Mordenkainen’s Lucubration",
    category: {
      spellType: "spell",
      school: "divination",
      level: 5,
      classes: ["wizard"],
      source: "Arcana Unleashed, pg. 42",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Self",
      components: "V, S",
      duration: "Instantaneous",
    },
    interaction: { type: "utility" },
    damage: [],
    upcasting: {
      notes:
        "The maximum level of spell slots you can recover increases to level 3 (if cast with level 6-7 slot) or level 4 (if cast with level 8+ slot)",
    },
    effectNotes: [
      "You recover up to two expended spell slots of level 2 or lower.",
      "Using a Higher-Level Spell Slot: The maximum level of spell slots you can recover increases to level 3 (with a 6th or 7th-level slot) or level 4 (with an 8th-level or higher slot).",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Verify 5th-level spell slot expended.",
        "Recover up to 2 expended spell slots of level 2 or lower (or level 3 with 6th-7th slot, level 4 with 8th+ slot).",
        "Update character spell slot tracker.",
      ],
    },
    isManualOverride: true,
    notes:
      "Arcana Unleashed, pg. 42. 1 action, instantaneous. Recovers up to two expended spell slots of level 2 or lower. Upcast to 6-7 recovers up to level 3 slots; upcast to 8+ recovers up to level 4 slots.",
  },

  rarys_telepathic_bond: {
    id: "rarys_telepathic_bond",
    name: "Rary's Telepathic Bond",
    category: {
      spellType: "spell",
      school: "divination",
      level: 5,
      classes: ["bard", "cleric", "paladin", "sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 311",
      concentration: false,
      ritual: true,
    },
    casting: {
      time: "1 action",
      range: "30 ft.",
      components: "V, S, M (two eggs)",
      duration: "1 hour",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Forge a telepathic link among up to eight willing creatures of your choice within 30 feet lasting 1 hour without concentration.",
      "Creatures that can't communicate in any languages are unaffected.",
      "Targets can communicate telepathically through the bond whether or not they share a language, across any distance on the same plane of existence.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Select up to 8 willing creatures within 30 feet that know at least one language.",
        "Establish telepathic link lasting 1 hour (no concentration) across any distance on the current plane.",
      ],
    },
    isManualOverride: true,
    notes:
      "Ritual eligible. No concentration, 1 hour. Links up to 8 willing creatures within 30 ft that speak any language; telepathic communication functions across any distance on the same plane.",
  },

  scrying: {
    id: "scrying",
    name: "Scrying",
    category: {
      spellType: "spell",
      school: "divination",
      level: 5,
      classes: ["bard", "cleric", "druid", "warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 314",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "10 minutes",
      range: "Self",
      components:
        "V, S, M (a focus worth 1,000+ GP, such as a crystal ball, mirror, or water-filled font)",
      duration: "Concentration, up to 10 minutes",
    },
    interaction: { type: "save", saveAbility: "WIS" },
    damage: [],
    effectNotes: [
      "See and hear a chosen creature on the same plane of existence. Target makes a Wisdom saving throw with modifiers based on familiarity and connection.",
      "Familiarity modifier: Secondhand (+5), Firsthand (+0), Extensive (-5).",
      "Connection modifier: Picture (+0), Possession/garment (-2), Body part/lock of hair (-10).",
      "On failed save, invisible sensor appears within 10 feet of target and follows it (Speed 30 ft). On successful save, spell fails and target feels uneasy.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Verify 1,000+ GP focus. Adjudicate Knowledge and Connection modifiers to Wisdom save.",
        "On failed save, manifest invisible sensor (Speed 30 ft) within 10 ft of target; track concentration up to 10 minutes.",
        "If target succeeds, notify target only of uneasy feeling; spell fails.",
      ],
    },
    isManualOverride: true,
    notes:
      "10-minute cast, requires 1,000+ GP focus. Target on same plane makes WIS save (modified by familiarity/connection). On fail, invisible sensor follows target for up to 10 min with concentration.",
  },

    // Level 6 (2 spells)
    find_the_path: {
    id: "find_the_path",
    name: "Find the Path",
    category: {
      spellType: "spell",
      school: "divination",
      level: 6,
      classes: ["bard", "cleric", "druid"],
      source: "Player's Handbook (2024), pg. 273",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 minute",
      range: "Self",
      components: "V, S, M (divination tools worth 100+ GP)",
      duration: "Concentration, up to 1 day",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Name a location you are familiar with to sense the most direct physical route. The spell fails for a destination on another plane, a moving destination, or an unspecific destination.",
      "For the duration, while on the same plane as the destination, you know its distance and direction and know the most direct path whenever you face a route choice.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Confirm the named destination is familiar, specific, stationary, and on the same plane; otherwise the spell fails or provides no route as specified.",
        "Track concentration and the 1-day maximum. The GM provides distance, direction, and the most direct path at relevant route choices.",
      ],
    },
    isManualOverride: true,
    notes:
      "Route knowledge is narrative/GM-provided rather than a token pathfinding effect.",
  },

  true_seeing: {
    id: "true_seeing",
    name: "True Seeing",
    category: {
      spellType: "spell",
      school: "divination",
      level: 6,
      classes: ["bard", "cleric", "sorcerer", "warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 336",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Touch",
      components:
        "V, S, M (mushroom powder worth 25+ GP, which the spell consumes)",
      duration: "1 hour",
    },
    damage: [],
    effectNotes: [
      "Touch a willing creature, granting it Truesight with a range of 120 feet for 1 hour (no concentration).",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Verify 25+ GP mushroom powder consumed.",
        "Grant Truesight 120 ft to touched willing creature for 1 hour.",
      ],
    },
    isManualOverride: true,
    notes:
      "Touch, 1 hour (no concentration), consumes 25+ GP mushroom powder. Grants willing creature Truesight out to 120 feet.",
  },

    // Level 7 (2 spells)
    // Fractured Awareness (Arcana Unleashed, pg. 40)
  fractured_awareness: {
    id: "fractured_awareness",
    name: "Fractured Awareness",
    category: {
      spellType: "spell",
      school: "divination",
      level: 7,
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
    interaction: { type: "save", saveAbility: "INT" },
    damage: [
      {
        dice: "12d10",
        type: "psychic",
        isBase: true,
        condition:
          "Failed Intelligence save (half damage on success, ends spell)",
      },
    ],
    effectNotes: [
      "Conflicting visions of multiple possible futures assail a creature you can see within 120 feet.",
      "Intelligence saving throw: on a failed save, target takes 12d10 Psychic damage and has Disadvantage on D20 Tests for the duration.",
      "On a successful save, target takes half damage only, and the spell ends.",
      "At the end of each of its turns, an affected target repeats the Intelligence save, ending the spell on a success.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Target creature within 120 ft; prompt Intelligence save.",
        "Failed save: deal 12d10 Psychic damage and impose Disadvantage on all D20 Tests.",
        "Successful save: deal half damage only and end effect.",
        "Target repeats INT save at end of its turns to clear.",
      ],
    },
    isManualOverride: true,
    notes:
      "Arcana Unleashed, pg. 40. Conc up to 1 min. 120 ft. INT save vs 12d10 Psychic + Disadvantage on D20 Tests (half damage only on success). Repeat save at end of turns.",
  },

  // Reweave Fate (Arcana Unleashed, pg. 42)
  reweave_fate: {
    id: "reweave_fate",
    name: "Reweave Fate",
    category: {
      spellType: "spell",
      school: "divination",
      level: 7,
      classes: ["bard", "cleric", "warlock", "wizard"],
      source: "Arcana Unleashed, pg. 42",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 reaction",
      range: "60 ft.",
      components: "S",
      duration: "Instantaneous",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Reaction when a creature you can see within 60 feet fails a D20 Test.",
      "The target rerolls the D20 Test with Advantage and must use the new roll.",
      "Strengthened Fate: If the rerolled D20 Test succeeds, the creature gains 6d10 Temporary Hit Points.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Trigger on failed D20 Test within 60 ft.",
        "Target rerolls with Advantage and uses new result.",
        "If successful, grant target 6d10 Temporary Hit Points.",
      ],
    },
    isManualOverride: true,
    notes:
      "Arcana Unleashed, pg. 42. Reaction when creature within 60 ft fails D20 Test. Reroll with Advantage (must use new roll); on success gains 6d10 Temp HP.",
  },

    // Level 8 (2 spells)
    // Moment of Prescience (Arcana Unleashed, pg. 42)
  moment_of_prescience: {
    id: "moment_of_prescience",
    name: "Moment of Prescience",
    category: {
      spellType: "spell",
      school: "divination",
      level: 8,
      classes: ["wizard"],
      source: "Arcana Unleashed, pg. 42",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 reaction",
      range: "Self",
      components: "V, S",
      duration: "Instantaneous",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Casting trigger: Reaction when you fail a D20 Test or when a creature hits you with an attack roll.",
      "Powerful sixth sense lets you alter fate:",
      "- Turn the d20 roll of your failed D20 Test into a 20, OR",
      "- Turn the d20 roll of the triggering attack roll into a 1.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Trigger on failed D20 Test or incoming hit.",
        "Replace own failed d20 die roll with a 20, OR replace triggering attacker's d20 die roll with a 1.",
        "Resolve the adjusted roll immediately.",
      ],
    },
    isManualOverride: true,
    notes:
      "Arcana Unleashed, pg. 42. Reaction on failed D20 Test or being hit. Turns failed D20 test roll into 20, or turns attacker's roll into 1.",
  },

  telepathy: {
    id: "telepathy",
    name: "Telepathy",
    category: {
      spellType: "spell",
      school: "divination",
      level: 8,
      classes: ["wizard"],
      source: "Player's Handbook (2024), pg. 331",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Unlimited",
      components: "V, S, M (a pair of linked silver rings)",
      duration: "24 hours",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "You create a telepathic link between yourself and a willing creature with which you are familiar, provided both of you are on the same plane of existence. The target must have an Intelligence score of at least 1.",
      "Until the spell ends, you and the target can instantaneously share words, images, sounds, and other sensory messages across any distance.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Choose familiar willing creature on same plane (Int >= 1).",
        "Establish 24-hour non-concentration telepathic link for sensory and message sharing.",
      ],
    },
    isManualOverride: true,
    notes:
      "Player's Handbook (2024). Marked for detailed verification against printed book/DDB. 24-hour duration without concentration. Allows unlimited-range two-way telepathy on same plane.",
  },

    // Level 9 (2 spells)
    foresight: {
    id: "foresight",
    name: "Foresight",
    category: {
      spellType: "spell",
      school: "divination",
      level: 9,
      classes: ["bard", "druid", "warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 276",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 minute",
      range: "Touch",
      components: "V, S, M (a hummingbird feather)",
      duration: "8 hours",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Touch a willing creature. For 8 hours it has Advantage on D20 Tests, and other creatures have Disadvantage on attack rolls against it. The spell ends early if you cast it again.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Record the willing target and 8-hour duration. Apply Advantage on its D20 Tests and Disadvantage on attack rolls against it.",
        "End the previous Foresight when the caster casts it again; no Concentration is required.",
      ],
    },
    isManualOverride: true,
    notes:
      "Foresight affects D20 Tests broadly; it is not limited to attack rolls, ability checks, or saving throws individually.",
  },

  // Hindsight (Arcana Unleashed, pg. 40)
  hindsight: {
    id: "hindsight",
    name: "Hindsight",
    category: {
      spellType: "spell",
      school: "divination",
      level: 9,
      classes: ["wizard"],
      source: "Arcana Unleashed, pg. 40",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "10 minutes",
      range: "500 ft.",
      components:
        "V, S, M (a tiny hourglass worth 500+ GP, which the spell consumes)",
      duration: "Concentration, up to 1 hour",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Peer backward through the fabric of time within 500 feet.",
      "You see visions of events that occurred within range throughout the past 10 years, racing by at approximately 1 day per second.",
      "Throughout the spell's duration, you can freely slow down, pause, rewind, or fast-forward through these visions.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Verify 500+ GP hourglass component (consumed upon casting).",
        "Establish 500-ft divination sensor centered on caster.",
        "Facilitate DM narration of historical events up to 10 years past at 1 day/second with pause/rewind controls.",
      ],
    },
    isManualOverride: true,
    notes:
      "Arcana Unleashed, pg. 40. 10 min cast, conc up to 1 hour, consumes 500+ GP hourglass. 500 ft. Peer backward up to 10 years at 1 day/sec with pause/rewind.",
  },
};
