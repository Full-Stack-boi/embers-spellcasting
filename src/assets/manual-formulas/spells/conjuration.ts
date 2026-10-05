/**
 * Manual Spell Formula Overrides — Conjuration (Leveled Spells 1st–9th)
 */

import type { SpellFormula } from "../../../types/spellFormula";

export const conjurationSpellOverrides: Record<string, SpellFormula> = {
    // Level 1 (11 spells)
    arms_of_hadar: {
    id: "arms_of_hadar",
    name: "Arms of Hadar",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 1,
      classes: ["warlock"],
      source: "Player's Handbook (2024), pg. 243",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Self (10-ft. emanation)",
      components: "V, S",
      duration: "Instantaneous",
    },
    interaction: { type: "save", saveAbility: "STR" },
    area: { shape: "Sphere", sizeFeet: 10 },
    damage: [{ dice: "2d6", type: "necrotic", isBase: true }],
    upcasting: {
      notes: "+1d6 Necrotic damage per slot level above 1st",
      perSlotLevel: { dice: "1d6", type: "necrotic" },
    },
    effectNotes: [
      "You invoke the power of Hadar, the Dark Hunger. Tendrils of dark energy erupt from you in a 10-foot Emanation.",
      "Each creature in that area must make a Strength saving throw. On a failed save, a creature takes 2d6 Necrotic damage and can't take Reactions until the start of its next turn. On a successful save, it takes half damage only.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Prompt Strength saves for creatures in the 10-ft Emanation.",
        "Apply 2d6 Necrotic damage (half on save), scaling +1d6 per slot level above 1st.",
        "On failed save, strip Reactions until the start of the target's next turn.",
      ],
    },
    isManualOverride: true,
    notes:
      "Player's Handbook (2024). Marked for detailed verification against printed book/DDB. Classified as a 10-ft Emanation in 2024. Failed save deals 2d6 Necrotic damage and denies Reactions until the start of target's next turn.",
  },

  ensnaring_strike: {
    id: "ensnaring_strike",
    name: "Ensnaring Strike",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 1,
      classes: ["ranger"],
      source: "Player's Handbook (2024), pg. 268",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "Bonus Action (immediately after hitting with a weapon)",
      range: "Self",
      components: "V",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "save", saveAbility: "STR" },
    damage: [
      {
        dice: "1d6",
        type: "piercing",
        isBase: false,
        condition: "At the start of each turn while Restrained",
      },
    ],
    upcasting: {
      notes: "+1d6 piercing damage for each spell slot level above 1st",
      perSlotLevel: { dice: "1d6", type: "piercing" },
    },
    effectNotes: [
      "Cast immediately after hitting a creature with a weapon. The target makes a Strength save, with Advantage if it is Large or larger. On a failure it is Restrained; on a success the vines shrivel and the spell ends.",
      "While Restrained, the target takes 1d6 Piercing damage at the start of each of its turns. The target or a creature within reach can use an action to make a Strength (Athletics) check against your spell save DC; success ends the spell.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Cast only immediately after a weapon hit; resolve the target's Strength save, granting Advantage to Large or larger creatures. On success, end the spell.",
        "On failure, track Restrained, concentration, and recurring start-of-turn damage. Allow the target or a creature within reach to attempt the action-based Athletics escape check. Apply upcast damage scaling.",
      ],
    },
    isManualOverride: true,
    notes:
      "The spell is a post-hit Bonus Action; its recurring damage and escape attempt need turn tracking.",
  },

  // Entangle (D&D Free Rules 2024, Spell Descriptions)
  entangle: {
    id: "entangle",
    name: "Entangle",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 1,
      classes: ["druid", "ranger"],
      source: "Player's Handbook (2024), pg. 268",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "90 ft.",
      components: "V, S",
      duration: "Concentration, up to 1 minute",
    },
    area: { shape: "Cube", sizeFeet: 20 },
    interaction: { type: "save", saveAbility: "STR" },
    damage: [],
    effectNotes: [
      "Plants fill a 20-foot square within range, making the ground Difficult Terrain for the duration.",
      "Creatures other than you in the area when cast make a Strength save or become Restrained. A Restrained creature can use an action to escape with a Strength (Athletics) check against your spell save DC.",
    ],
    isManualOverride: true,
    notes:
      "Place the 20-foot square and track Difficult Terrain, Restrained, and escape checks manually.",
  },

  find_familiar: {
    id: "find_familiar",
    name: "Find Familiar",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 1,
      classes: ["wizard"],
      source: "Player's Handbook (2024), pg. 272",
      concentration: false,
      ritual: true,
    },
    casting: {
      time: "1 hour or Ritual",
      range: "10 ft.",
      components: "V, S, M (burning incense worth 10+ GP, consumed)",
      duration: "Instantaneous",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Summon a spirit in an unoccupied space within range, choosing a Beast form with CR 0 (including an eligible form not listed by name); the familiar is Celestial, Fey, or Fiend instead of Beast. It acts independently, obeys commands, shares telepathy with you within 100 feet, and you can use a Bonus Action to perceive through its senses until your next turn.",
      "It can deliver a spell with range Touch using its Reaction if within 100 feet. It cannot attack. At 0 HP it disappears; you can temporarily dismiss or resummon it with a Magic action. You can have only one familiar; casting again changes its eligible form or brings a previously dismissed familiar back.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Choose an eligible CR 0 Beast form and Celestial, Fey, or Fiend type; create/track its stat block and independent Initiative. Track the consumed incense and one-familiar limit.",
        "Track telepathy/senses and Touch spell delivery distances and actions. Resolve dismiss, reappearance, and disappearance at 0 HP; the familiar leaves carried/worn objects behind when it vanishes.",
      ],
    },
    isManualOverride: true,
    notes:
      "A familiar's stat block and independent token are managed manually; it cannot attack, but can take other actions normally.",
  },

  // Fog Cloud (D&D Free Rules 2024, Spell Descriptions)
  fog_cloud: {
    id: "fog_cloud",
    name: "Fog Cloud",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 1,
      classes: ["druid", "ranger", "sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 276",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "120 ft.",
      components: "V, S",
      duration: "Concentration, up to 1 hour",
    },
    area: { shape: "Sphere", sizeFeet: 20 },
    interaction: { type: "utility" },
    damage: [],
    upcasting: {
      notes:
        "The Sphere's radius increases by 20 feet per spell slot level above 1st.",
    },
    effectNotes: [
      "Create a 20-foot-radius Sphere of fog centered on a point within range. The area is Heavily Obscured; a strong wind disperses the fog.",
    ],
    isManualOverride: true,
    notes:
      "Place the Sphere and adjudicate visibility and wind interactions manually.",
  },

  // Goodberry (D&D Free Rules 2024, Spell Descriptions)
  goodberry: {
    id: "goodberry",
    name: "Goodberry",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 1,
      classes: ["druid", "ranger"],
      source: "Player's Handbook (2024), pg. 280",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Self",
      components: "V, S, M (a sprig of mistletoe)",
      duration: "24 hours",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Create ten magical berries. A creature can use a Bonus Action to eat one, regain 1 Hit Point, and receive enough nourishment for one day. Uneaten berries vanish when the spell ends.",
    ],
    isManualOverride: true,
    notes:
      "Track the ten berries and their expiry manually; eating one costs the creature a Bonus Action.",
  },

  // Grease (D&D Free Rules 2024, Spell Descriptions)
  grease: {
    id: "grease",
    name: "Grease",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 1,
      classes: ["sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 280",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "60 ft.",
      components: "V, S, M (a bit of pork rind or butter)",
      duration: "1 minute",
    },
    area: { shape: "Cube", sizeFeet: 10 },
    interaction: { type: "save", saveAbility: "DEX" },
    damage: [],
    effectNotes: [
      "Cover a 10-foot square of ground with nonflammable grease, making it Difficult Terrain. Creatures in the area when it appears, and creatures that enter or end a turn there, make a Dexterity save or fall Prone.",
    ],
    isManualOverride: true,
    notes:
      "Place the 10-foot square and resolve entry/end-of-turn saves and Difficult Terrain manually.",
  },

  hail_of_thorns: {
    id: "hail_of_thorns",
    name: "Hail of Thorns",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 1,
      classes: ["ranger"],
      source: "Player's Handbook (2024), pg. 283",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 bonus action",
      range: "Self",
      components: "V",
      duration: "Instantaneous",
    },
    interaction: { type: "save", saveAbility: "DEX" },
    area: { shape: "Sphere", sizeFeet: 5 },
    damage: [{ dice: "1d10", type: "piercing", isBase: true }],
    upcasting: {
      perSlotLevel: { dice: "1d10", type: "piercing" },
      notes: "+1d10 Piercing damage per slot level above 1st (max 6d10)",
    },
    effectNotes: [
      "You cast this spell immediately after you hit a creature with a ranged weapon attack.",
      "A rain of thorns sprouts from your ranged weapon or ammunition. The target and each creature within 5 feet of it must make a Dexterity saving throw.",
      "A creature takes 1d10 Piercing damage on a failed save, or half as much on a successful one.",
      "Using a Higher-Level Spell Slot: The damage increases by 1d10 for each spell slot level above 1 (up to a maximum of 6d10).",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Cast as Bonus Action immediately after hitting with a ranged weapon attack.",
        "Prompt Dexterity saves for target and creatures within 5 ft.",
        "Apply 1d10 Piercing damage (half on save).",
        "Apply upcast scaling (+1d10 per slot level above 1).",
      ],
    },
    isManualOverride: true,
    notes:
      "Player's Handbook (2024). Marked for detailed verification against printed book/DDB. In 2024, cast as a Bonus Action on hit; concentration removed entirely. Deals 1d10 Piercing in 5-ft radius, DEX save half.",
  },

  // Ice Knife (D&D Free Rules 2024, Spell Descriptions)
  ice_knife: {
    id: "ice_knife",
    name: "Ice Knife",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 1,
      classes: ["druid", "sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 287",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "60 ft.",
      components: "S, M (a drop of water or a piece of ice)",
      duration: "Instantaneous",
    },
    interaction: { type: "spell_attack" },
    area: { shape: "Sphere", sizeFeet: 5 },
    damage: [
      {
        dice: "1d10",
        type: "piercing",
        isBase: true,
        condition: "on a hit against the initial target",
      },
      {
        dice: "2d6",
        type: "cold",
        isBase: false,
        condition:
          "Dexterity save for each creature within 5 feet of the initial target; slot scaling applies to this damage only",
      },
    ],
    upcasting: {
      notes:
        "+1d6 cold damage per slot level above 1st; the piercing damage is unchanged",
      perSlotLevel: { dice: "1d6", type: "cold" },
    },
    effectNotes: [
      "Make a ranged spell attack against one creature. On a hit, it takes 1d10 Piercing damage. Hit or miss, the shard explodes; the initial target and each creature within 5 feet make a Dexterity save or take 2d6 Cold damage.",
    ],
    isManualOverride: true,
    notes:
      "This spell has two distinct resolution steps: attack roll for Piercing damage, then a separate Dexterity save for the Cold burst even if the attack misses. Resolve the two rolls separately.",
  },

  tensers_floating_disk: {
    id: "tensers_floating_disk",
    name: "Tenser's Floating Disk",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 1,
      classes: ["wizard"],
      source: "Player's Handbook (2024), pg. 332",
      concentration: false,
      ritual: true,
    },
    casting: {
      time: "1 action",
      range: "30 feet",
      components: "V, S, M (a drop of mercury)",
      duration: "1 hour",
    },
    damage: [],
    effectNotes: [
      "Creates a circular, horizontal plane of force 3 feet in diameter and 1 inch thick, floating 3 feet above ground in unoccupied space within range.",
      "Remains for 1 hour and holds up to 500 pounds. Exceeding weight limit ends spell.",
      "Immobile while caster is within 20 feet; follows caster to stay within 20 feet if caster moves farther away.",
      "Can cross uneven terrain, stairs, and slopes, but cannot cross elevation changes of 10 feet or more.",
      "Spell ends if caster moves more than 100 feet away.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Spawn 3-foot floating disk token 3 feet above ground within 30 feet.",
        "Track carried weight (max 500 lbs).",
        "Follow caster when beyond 20 feet (max 100 feet range, cannot cross 10-ft elevation changes).",
      ],
    },
    isManualOverride: true,
    notes:
      "Ritual. 1 hour. Creates 3-ft diameter disk holding up to 500 lbs that follows caster within 20 ft. Cannot cross 10+ ft elevation drop/rise. Ends if caster moves >100 ft away.",
  },

  unseen_servant: {
    id: "unseen_servant",
    name: "Unseen Servant",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 1,
      classes: ["bard", "warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 336",
      concentration: false,
      ritual: true,
    },
    casting: {
      time: "1 action",
      range: "60 feet",
      components: "V, S, M (a bit of string and of wood)",
      duration: "1 hour",
    },
    damage: [],
    effectNotes: [
      "Creates an Invisible, mindless, shapeless Medium force in an unoccupied space on the ground within 60 feet.",
      "Has AC 10, 1 Hit Point, and Strength 2, and cannot attack. Drops to 0 HP ends the spell.",
      "Once on each of your turns as a Bonus Action, mentally command the servant to move up to 15 feet and interact with an object (fetch, clean, mend, fold clothes, light fires, serve food, pour drinks).",
      "Spell ends if commanded to perform a task moving it more than 60 feet away from you.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Spawn Invisible Unseen Servant token (AC 10, 1 HP, STR 2) within 60 ft.",
        "Use Bonus Action on each turn to move it 15 ft and perform simple object interaction.",
        "Dismiss if reduced to 0 HP or moves >60 ft away.",
      ],
    },
    isManualOverride: true,
    notes:
      "Ritual. 1 hour. Creates invisible servant (AC 10, 1 HP, STR 2) within 60 ft. Bonus Action each turn to move 15 ft and perform simple tasks. Ends if reduced to 0 HP or moves >60 ft away.",
  },

    // Level 2 (9 spells)
    battle_familiar: {
    id: "battle_familiar",
    name: "Battle Familiar",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 2,
      classes: ["druid", "warlock", "wizard"],
      source: "Arcana Unleashed, pg. 35",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "10 ft.",
      components: "V, S, M (a diamond worth 25+ GP)",
      duration: "1 hour",
    },
    interaction: { type: "utility" },
    damage: [
      {
        dice: "1d8+5",
        type: "force",
        isBase: true,
        condition: "Rend melee attack (1d8 + 3 + spell level Force)",
      },
    ],
    upcasting: {
      perSlotLevel: { dice: "1d8", type: "force" },
      notes:
        "Stat block scales with slot level: AC 11+level (+2 Brute), HP 30/20 + 5 per level above 2nd, Multiattack = floor(level/2), Rend damage 1d8+3+level Force",
    },
    effectNotes: [
      "Conjure a battle familiar (Medium Celestial, Fey, or Fiend) in an unoccupied space within 10 feet for 1 hour without concentration.",
      "Choose form: Brute (AC 13+level, HP 30+5/level above 2), Flyer (Fly 30 ft hover, Flyby), or Stalker (Prowl).",
      "Rolls its own Initiative and acts on its own turn. Multiattack: makes floor(level / 2) Rend attacks (1d8 + 3 + level Force).",
      "Find Familiar synergy: If you already have a familiar, it is empowered instead, gaining Battle Familiar stats and Temp HP equal to Battle Familiar's HP.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Verify 25+ GP diamond.",
        "Choose form (Brute, Flyer, Stalker) and creature type (Celestial, Fey, Fiend).",
        "Spawn Battle Familiar token with scaled HP/AC or grant Temp HP to existing familiar.",
        "Roll separate Initiative; track 1-hour duration without concentration.",
      ],
    },
    isManualOverride: true,
    notes:
      "Arcana Unleashed, pg. 35. 1 hour (no concentration), 25+ GP diamond. Conjures combat-capable familiar (Brute, Flyer, Stalker) acting on its own turn. Scales with slot level (HP, AC, attacks, damage). Can empower existing Find Familiar.",
  },

  cloud_of_daggers: {
    id: "cloud_of_daggers",
    name: "Cloud of Daggers",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 2,
      classes: ["bard", "sorcerer", "warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 251",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "60 ft.",
      components: "V, S, M (a sliver of glass)",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "save" },
    area: { shape: "Cube", sizeFeet: 5 },
    damage: [{ dice: "4d4", type: "slashing", isBase: true }],
    upcasting: {
      notes: "+2d4 Slashing damage per spell slot level above 2nd",
      perSlotLevel: { dice: "2d4", type: "slashing" },
    },
    effectNotes: [
      "You fill the air with spinning daggers in a 5-foot Cube at a point within range.",
      "A creature takes 4d4 Slashing damage when it enters the Cube for the first time on a turn or ends its turn there.",
      "As a Magic action on your later turns, you can teleport the Cube up to 30 feet.",
      "Using a Higher-Level Spell Slot: Damage increases by 2d4 for each spell slot level above 2.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Place 5-ft Cube area within 60 ft.",
        "Track concentration up to 1 minute.",
        "Apply 4d4 Slashing damage (+2d4 per slot level above 2) when entering first time on turn or ending turn in area.",
        "Allow Magic action on later turns to teleport the Cube up to 30 feet.",
      ],
    },
    isManualOverride: true,
    notes:
      "Player's Handbook (2024). Marked for detailed verification against printed book/DDB. In 2024, the 5-ft Cube can be teleported up to 30 ft as a Magic action on subsequent turns. Deals 4d4 Slashing (+2d4/level upcast) on entry/end of turn.",
  },

  deryans_helpful_homunculi: {
    id: "deryans_helpful_homunculi",
    name: "Deryan's Helpful Homunculi",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 2,
      classes: ["cleric", "wizard"],
      source: "Forgotten Realms: Heroes of Faerûn, pg. 143",
      concentration: false,
      ritual: true,
    },
    casting: {
      time: "1 action",
      range: "Self",
      components:
        "V, S, M (powdered gemstones worth 100+ GP, which the spell consumes, and one set of Artisan’s Tools with which you have proficiency)",
      duration: "8 hours",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Summon a group of helpful spirits for 8 hours (no concentration).",
      "Appear as homunculi or other intangible, invulnerable Constructs of your choice.",
      "Proficient in the Arcana skill and with the Artisan's Tools used during casting.",
      "If crafting an item, functions as a single crafting assistant, halving the crafting time.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Verify 100+ GP powdered gemstones consumed and proficiency in used Artisan's Tools.",
        "Summon intangible homunculi spirits for 8 hours (no concentration).",
        "Halve crafting time when crafting with the designated Artisan's Tools.",
      ],
    },
    isManualOverride: true,
    notes:
      "Forgotten Realms: Heroes of Faerûn, pg. 143. Ritual. Consumes 100+ GP gems. 8 hours (no concentration). Intangible crafting assistants proficient in Arcana and chosen tools; halves crafting time.",
  },

  find_steed: {
    id: "find_steed",
    name: "Find Steed",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 2,
      classes: ["paladin"],
      source: "Player's Handbook (2024), pg. 272",
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
    damage: [
      {
        dice: "1d8",
        type: "radiant",
        isBase: false,
        condition: "Celestial steed slam; add spell level",
      },
      {
        dice: "1d8",
        type: "psychic",
        isBase: false,
        condition: "Fey steed slam; add spell level",
      },
      {
        dice: "1d8",
        type: "necrotic",
        isBase: false,
        condition: "Fiend steed slam; add spell level",
      },
    ],
    upcasting: {
      notes:
        "Use the slot level as the steed's spell level for its stat block and attacks.",
    },
    effectNotes: [
      "Summon a Large otherworldly steed in an unoccupied space within range, choosing Celestial, Fey, or Fiend. It uses the Otherworldly Steed stat block; a new casting replaces an existing summoned steed, and you may choose to resummon one that disappeared.",
      "The steed shares your Initiative and is a controlled mount while you ride it. At spell level 4 or higher it gains Fly Speed 60 feet. Its type determines its special Bonus Action: Fiend frightens, Fey teleports with rider, or Celestial heals. If you are Incapacitated, it acts independently to protect you. It disappears at 0 HP or when you die.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Create/track the Otherworldly Steed stat block using the cast slot level, creature type, HP, AC, speeds, and spell save/attack modifier. Replace or resummon existing steeds as specified.",
        "Track shared Initiative, controlled-mount behavior, type-specific Bonus Action recharge, and disappearance. Resolve stat block actions and effects manually; choose the appropriate damage type for its Slam.",
      ],
    },
    isManualOverride: true,
    notes:
      "The summoned stat block scales from spell level; type-specific actions and HP are tracked on the steed token. Slam damage is 1d8 + spell level.",
  },

  // Flaming Sphere (D&D Free Rules 2024, Spell Descriptions)
  flaming_sphere: {
    id: "flaming_sphere",
    name: "Flaming Sphere",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 2,
      classes: ["druid", "sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 275",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "60 ft.",
      components: "V, S, M (a ball of wax)",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "save", saveAbility: "DEX" },
    area: { shape: "Sphere", sizeFeet: 5 },
    damage: [{ dice: "2d6", type: "fire", isBase: true }],
    upcasting: {
      notes: "+1d6 fire damage per slot level above 2nd",
      perSlotLevel: { dice: "1d6", type: "fire" },
    },
    effectNotes: [
      "Create a 5-foot-diameter sphere of fire on the ground in an unoccupied space. Creatures ending their turn within 5 feet make a Dexterity save, taking full damage on a failure or half on a success.",
      "As a Bonus Action, move the sphere up to 30 feet; a creature whose space it enters makes the save and stops the sphere for that turn. It sheds Bright Light for 20 feet and Dim Light for an additional 20 feet; touched unattended flammable objects ignite.",
    ],
    isManualOverride: true,
    notes:
      "Track the sphere's position, light, and concentration. Resolve the save when a creature ends its turn nearby or the sphere enters its space.",
  },

  // Homunculus Servant (Eberron: Forge of the Artificer, pg. 21)
  homunculus_servant: {
    id: "homunculus_servant",
    name: "Homunculus Servant",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 2,
      classes: ["artificer"],
      source: "Eberron: Forge of the Artificer, pg. 21",
      concentration: false,
      ritual: true,
    },
    casting: {
      time: "1 hour or Ritual",
      range: "10 ft.",
      components: "V, S, M (a gem worth 100+ GP)",
      duration: "Instantaneous",
    },
    interaction: { type: "utility" },
    damage: [
      {
        dice: "1d6",
        type: "force",
        isBase: false,
        condition:
          "Homunculus Force Strike action: 1d6 + spell level Force damage",
      },
    ],
    upcasting: {
      notes:
        "Uses the spell slot's level for the spell's level in the stat block (HP: 5 + 5 per spell level; Force Strike: 1d6 + spell level; Magic Bond bonus = spell level)",
    },
    effectNotes: [
      "Summon a special homunculus in an unoccupied space within 10 feet. It uses the Homunculus Servant stat block and replaces any existing homunculus from this spell.",
      "Homunculus Servant: Tiny Construct, AC 13, HP 5 + (5 * spell level), Speed 20 ft., Fly 30 ft. Immunities: Poison; Exhaustion, Poisoned. Darkvision 60 ft., Telepathy 1 mile with caster.",
      "Combat: Shares Initiative count, takes turn immediately after yours. Obeys commands (no action required); Dodges if no command given.",
      "Evasion: Takes no damage on successful Dex save against half-damage effects, and half damage on failure.",
      "Magic Bond: Adds the spell's level to any ability check or saving throw it makes.",
      "Force Strike: Melee or Ranged Attack Roll (spell attack modifier, reach 5 ft or range 30 ft). Hit: 1d6 + spell level Force damage.",
      "Channel Magic Reaction: When you cast a Touch spell while homunculus is within 120 feet, homunculus delivers it through its touch.",
      "Using a Higher-Level Spell Slot: Use the spell slot's level for the spell's level in the stat block.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Verify 100+ GP gem focus.",
        "Summon Tiny Construct homunculus servant (AC 13, HP 5 + 5*level, fly 30 ft, Evasion, Magic Bond).",
        "Deliver Touch spells up to 120 ft via Channel Magic reaction.",
        "Command Force Strike: 1d6 + spell level Force damage.",
      ],
    },
    isManualOverride: true,
    notes:
      "Eberron: Forge of the Artificer, pg. 21. 1 hour cast (Ritual), 100+ GP gem. Summons Homunculus Servant construct. Delivers touch spells up to 120 ft, Evasion, Magic Bond, Force Strike (1d6+level Force). Scales HP and bonus with spell slot level.",
  },

  // Misty Step (D&D Free Rules 2024, Spell Descriptions)
  misty_step: {
    id: "misty_step",
    name: "Misty Step",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 2,
      classes: ["sorcerer", "warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 299",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "Bonus Action",
      range: "Self (30 ft.)",
      components: "V",
      duration: "Instantaneous",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: ["Teleport up to 30 feet to an unoccupied space you can see."],
    isManualOverride: true,
    notes:
      "Choose a visible, unoccupied destination within 30 feet to teleport.",
  },

  summon_beast: {
    id: "summon_beast",
    name: "Summon Beast",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 2,
      classes: ["druid", "ranger"],
      source: "Player's Handbook (2024), pg. 322",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "90 ft.",
      components:
        "V, S, M (a feather, a tuft of fur, and a fish tail inside a gilded acorn worth 200+ GP)",
      duration: "Concentration, up to 1 hour",
    },
    interaction: { type: "utility" },
    damage: [{ dice: "1d8+4", type: "piercing", isBase: true }],
    upcasting: {
      notes:
        "AC equals 11 + spell level; HP equals 20 (Air) or 30 (Land/Water) + 5 per level above 2nd; attacks equal half spell level (rounded down)",
    },
    effectNotes: [
      "You call forth a Bestial Spirit in an unoccupied space within range. Choose its environment: Air, Land, or Water.",
      "The creature is an ally that takes its turn immediately after yours.",
      "AC: 11 + spell level. HP: 20 (Air) or 30 (Land/Water), plus 5 for each level above 2nd. Attacks: half spell level (rounded down).",
      "Air has Flyby and fly speed 60 ft. Land/Water has Pack Tactics. Water has swim speed 30 ft and Water Breathing.",
      "Rend deals 1d8 + 4 + spell level Piercing damage with your spell attack modifier.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Summon Bestial Spirit within 90 ft and pick environment (Air/Land/Water).",
        "Track HP (20/30 base + 5 per slot level above 2) and AC (11 + slot level).",
        "Spirit takes turn immediately after caster.",
      ],
    },
    isManualOverride: true,
    notes:
      "Player's Handbook (2024). Marked for detailed verification against printed book/DDB. In 2024 PHB, standardized summon spell. Bestial Spirit (Air, Land, Water); acts immediately after caster.",
  },

  // Web (D&D Free Rules 2024, Spell Descriptions)
  web: {
    id: "web",
    name: "Web",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 2,
      classes: ["sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 340",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "60 ft.",
      components: "V, S, M (a bit of spiderweb)",
      duration: "Concentration, up to 1 hour",
    },
    area: { shape: "Cube", sizeFeet: 20 },
    interaction: { type: "save", saveAbility: "DEX" },
    damage: [],
    effectNotes: [
      "Fill a 20-foot Cube with webbing that is Difficult Terrain and Lightly Obscured. If not anchored between solid masses or layered across a surface, it collapses at the start of your next turn.",
      "The first time a creature enters the webs on a turn or starts its turn there, it makes a Dexterity save or becomes Restrained while in the webs or until it escapes with an action and a successful Strength (Athletics) check against your spell save DC. A 5-foot Cube exposed to fire burns away in 1 round; creatures starting their turn in that fire take 2d4 Fire damage.",
    ],
    isManualOverride: true,
    notes:
      "Track web placement, anchoring, concentration, Restrained creatures and escape checks, and any burning 5-foot Cubes.",
  },

    // Level 3 (12 spells)
    // Call Lightning (D&D Free Rules 2024, Spell Descriptions)
  call_lightning: {
    id: "call_lightning",
    name: "Call Lightning",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 3,
      classes: ["druid"],
      source: "Player's Handbook (2024), pg. 248",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "120 ft.",
      components: "V, S",
      duration: "Concentration, up to 10 minutes",
    },
    interaction: { type: "save", saveAbility: "DEX" },
    area: { shape: "Cylinder", sizeFeet: 60, heightFeet: 10 },
    damage: [{ dice: "3d10", type: "lightning", isBase: true }],
    effectNotes: [
      "A storm cloud appears above you as a 10-foot-high Cylinder with a 60-foot radius. On casting, choose a visible point beneath it; each creature within 5 feet of that point makes a Dexterity save, taking 3d10 Lightning damage on a failure or half on a success.",
      "On later turns, use a Magic action to call lightning again at the same or a different point. If cast outdoors during a storm, control that storm instead and damage increases by 1d10.",
    ],
    isManualOverride: true,
    notes:
      "Track the cloud, concentration, later Magic actions and 5-foot impact area. The outdoor-storm damage bonus is +1d10.",
  },

  // Conjure Animals (D&D Free Rules 2024, Spell Descriptions)
  conjure_animals: {
    id: "conjure_animals",
    name: "Conjure Animals",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 3,
      classes: ["druid", "ranger"],
      source: "Player's Handbook (2024), pg. 254",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "60 ft.",
      components: "V, S",
      duration: "Concentration, up to 10 minutes",
    },
    interaction: { type: "save", saveAbility: "DEX" },
    area: { shape: "Sphere", sizeFeet: 10 },
    damage: [
      {
        dice: "3d10",
        type: "slashing",
        isBase: true,
        condition:
          "On a failed save when a creature enters or ends its turn within 10 feet of the pack, or when the pack moves within 10 feet of it",
      },
    ],
    upcasting: { notes: "+1d10 Slashing damage per spell slot level above 3." },
    effectNotes: [
      "A Large pack of spectral, intangible animals appears in an unoccupied space you can see. While within 5 feet of it, you have Advantage on Strength saves; when you move, you can move the pack up to 30 feet to a visible unoccupied space.",
      "Creatures can trigger a Dexterity save when the pack moves within 10 feet, when they enter within 10 feet, or end their turn there. On a failure they take 3d10 Slashing damage; a creature can be affected only once per turn.",
    ],
    isManualOverride: true,
    notes:
      "Track the pack location, concentration, once-per-turn trigger per creature, damage and the caster's Strength-save benefit.",
  },

  conjure_barrage: {
    id: "conjure_barrage",
    name: "Conjure Barrage",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 3,
      classes: ["ranger"],
      source: "Player's Handbook (2024), pg. 254",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Self (60-ft. cone)",
      components: "V, S, M (one piece of ammunition or a thrown weapon)",
      duration: "Instantaneous",
    },
    interaction: { type: "save", saveAbility: "DEX" },
    area: { shape: "Cone", sizeFeet: 60 },
    damage: [
      {
        dice: "5d8",
        type: "force",
        isBase: true,
        condition: "Damage type matches weapon/ammunition or Force",
      },
    ],
    upcasting: {
      notes: "+1d8 damage per spell slot level above 3rd",
      perSlotLevel: { dice: "1d8", type: "force" },
    },
    effectNotes: [
      "You throw a nonmagical weapon or fire a piece of nonmagical ammunition into the air to create a 60-foot Cone of identical weapons.",
      "Each creature in the area must make a Dexterity saving throw. A creature takes 5d8 damage on a failed save, or half as much damage on a successful one. The damage type is the same as the weapon or ammunition used (or Force if unspecified).",
      "Using a Higher-Level Spell Slot: Damage increases by 1d8 for each spell slot level above 3.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Place 60-ft Cone from caster.",
        "Prompt Dexterity saves for all creatures in the cone.",
        "Apply 5d8 damage (half on save), scaling +1d8 per slot level above 3.",
      ],
    },
    isManualOverride: true,
    notes:
      "Player's Handbook (2024). Marked for detailed verification against printed book/DDB. In 2024, base damage buffed from 3d8 to 5d8 in a 60-ft Cone, upcasting +1d8/level.",
  },

  conjure_constructs: {
    id: "conjure_constructs",
    name: "Conjure Constructs",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 3,
      classes: ["wizard"],
      source: "Forgotten Realms: Heroes of Faerûn, pg. 143",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "60 ft.",
      components: "V, S, M (a brass cog)",
      duration: "Concentration, up to 10 minutes",
    },
    interaction: { type: "save", saveAbility: "DEX" },
    damage: [
      {
        dice: "3d6",
        type: "force",
        isBase: true,
        condition:
          "Clockwork Force option on failed DEX save (half on success)",
      },
    ],
    upcasting: {
      perSlotLevel: { dice: "1d6", type: "force" },
      notes: "+1d6 Force damage and +1d6 Temporary HP per slot level above 3rd",
    },
    effectNotes: [
      "Conjure intangible construct spirits in an unoccupied space within 60 feet for up to 10 minutes with concentration.",
      "When cast and as a Magic action on subsequent turns, choose one creature/object within 5 feet of spirits:",
      "- Clockwork Force: Target makes a Dexterity saving throw, taking 3d6 Force damage (half on success).",
      "- Orderly Ward: Target gains Temporary Hit Points equal to 1d6 + spellcasting ability modifier.",
      "When you move on your turn, you can move the spirits up to 30 feet to an unoccupied space you can see.",
      "Using a Higher-Level Spell Slot: Damage and Temporary Hit Points both increase by 1d6 per slot level above 3.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Place construct spirits token within 60 ft; move up to 30 ft when caster moves.",
        "On cast and as Magic action on later turns, target within 5 ft: Clockwork Force (DEX save vs 3d6 Force, half on save) OR Orderly Ward (grant 1d6 + mod Temp HP).",
        "Track concentration up to 10 minutes.",
      ],
    },
    isManualOverride: true,
    notes:
      "Forgotten Realms: Heroes of Faerûn, pg. 143. Conc up to 10 min. 60 ft range. Spirits move 30 ft with caster. Magic action each turn to deal 3d6 Force (DEX save half) or grant 1d6 + mod Temp HP to target within 5 ft. Upcasts +1d6 damage and Temp HP/level.",
  },

  // Create Food and Water (D&D Free Rules 2024, Spell Descriptions)
  create_food_and_water: {
    id: "create_food_and_water",
    name: "Create Food and Water",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 3,
      classes: ["cleric", "paladin"],
      source: "Player's Handbook (2024), pg. 258",
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
      "Create 45 pounds of bland but nourishing food and 30 gallons of clean fresh water on the ground or in containers within range. Uneaten food spoils after 24 hours.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Record the produced food and water and their locations; track the food's 24-hour spoilage. The spell does not create containers or update inventory automatically.",
      ],
    },
    isManualOverride: true,
    notes:
      "Created food is nourishing but bland and spoils after 24 hours; clean water has no listed expiry.",
  },

  hunger_of_hadar: {
    id: "hunger_of_hadar",
    name: "Hunger of Hadar",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 3,
      classes: ["warlock"],
      source: "Player's Handbook (2024), pg. 286",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "150 ft. (20-ft.-radius sphere)",
      components: "V, S, M (a pickled octopus tentacle)",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "save", saveAbility: "DEX" },
    area: { shape: "Sphere", sizeFeet: 20 },
    damage: [
      { dice: "2d6", type: "cold", isBase: true },
      { dice: "2d6", type: "acid", isBase: false },
    ],
    upcasting: {
      notes:
        "+1d6 Cold or Acid damage (caster choice) per spell slot level above 3rd",
    },
    effectNotes: [
      "You open a gateway to the dark between the stars in a 20-foot-radius sphere centered on a point within range.",
      "The area is Difficult Terrain, and no light can illuminate it. Creatures fully within the area have the Blinded condition.",
      "Any creature that starts its turn in the area takes 2d6 Cold damage.",
      "Any creature that ends its turn in the area must make a Dexterity saving throw, taking 2d6 Acid damage on a failed save.",
      "Using a Higher-Level Spell Slot: The Cold or Acid damage (your choice) increases by 1d6 for each spell slot level above 3.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Place 20-ft radius Sphere of darkness within 150 ft.",
        "Mark area as difficult terrain and apply Blinded to creatures inside.",
        "At start of creature turn inside: apply 2d6 Cold damage (no save).",
        "At end of creature turn inside: prompt DEX save; on failure, apply 2d6 Acid damage.",
      ],
    },
    isManualOverride: true,
    notes:
      "Player's Handbook (2024). Marked for detailed verification against printed book/DDB. 20-ft sphere of darkness/difficult terrain. 2d6 Cold at start of turn, 2d6 Acid on DEX save at end of turn.",
  },

  sleet_storm: {
    id: "sleet_storm",
    name: "Sleet Storm",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 3,
      classes: ["druid", "sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 317",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "150 ft.",
      components: "V, S, M (a miniature umbrella)",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "save", saveAbility: "DEX" },
    area: { shape: "Cylinder", sizeFeet: 20, heightFeet: 40 },
    damage: [],
    effectNotes: [
      "Freezing rain and sleet fill a 40-foot-tall, 20-foot-radius Cylinder within 150 feet lasting up to 1 minute with concentration.",
      "Area is Heavily Obscured, douses exposed flames, and ground is Difficult Terrain.",
      "Creatures entering for the first time on a turn or starting turn there must succeed on a Dexterity saving throw or have the Prone condition.",
      "Creatures concentrating on a spell in the area must succeed on a Constitution saving throw against your spell save DC or lose concentration.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Place 20-ft radius x 40-ft high Cylinder within 150 feet; track concentration up to 1 minute.",
        "Apply Heavily Obscured and Difficult Terrain inside cylinder.",
        "Prompt Dexterity save vs Prone on first entry per turn or turn start.",
        "Prompt Constitution save vs spell save DC for creatures concentrating on spells in the area.",
      ],
    },
    isManualOverride: true,
    notes:
      "20-ft radius, 40-ft high Cylinder. Concentration up to 1 min. Heavily Obscured, douses fire, Difficult Terrain. DEX save vs Prone on entering/turn start. Forces CON save vs DC to maintain concentration.",
  },

  spirit_guardians: {
    id: "spirit_guardians",
    name: "Spirit Guardians",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 3,
      classes: ["cleric"],
      source: "Player's Handbook (2024), pg. 318",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Self",
      components: "V, S, M (a prayer scroll)",
      duration: "Concentration, up to 10 minutes",
    },
    interaction: { type: "save", saveAbility: "WIS" },
    area: { shape: "Emanation", sizeFeet: 15 },
    damage: [
      {
        dice: "3d8",
        type: "choice",
        typeChoices: ["radiant", "necrotic"],
        isBase: true,
        condition:
          "Radiant (Good/Neutral) or Necrotic (Evil) on failed save (half on success)",
      },
    ],
    upcasting: {
      notes:
        "+1d8 Radiant or Necrotic damage for each spell slot level above 3rd",
      perSlotLevel: { dice: "1d8", type: "choice" },
    },
    effectNotes: [
      "Protective spirits surround you in a 15-foot Emanation for up to 10 minutes with concentration.",
      "Designate any creatures to be unaffected when casting.",
      "Unaffected creatures have their Speed halved while in the Emanation.",
      "Trigger: whenever the Emanation enters a creature's space, and whenever a creature enters the Emanation or ends its turn there (once per turn).",
      "Target makes a Wisdom saving throw, taking 3d8 Radiant (good/neutral) or Necrotic (evil) damage (half on success).",
      "Using a Higher-Level Spell Slot: damage increases by 1d8 for each spell slot level above 3.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Designate immune allies; place 15-foot Emanation and track concentration up to 10 minutes.",
        "Halve Speed for non-designated creatures in Emanation.",
        "Trigger Wisdom save (3d8 Radiant or Necrotic, half on save) when emanation enters a creature's space, or when a creature enters or ends its turn there (once per turn).",
      ],
    },
    isManualOverride: true,
    notes:
      "15-foot Emanation, concentration up to 10 min. Halves hostile speed. Triggers on entering creature's space, entering emanation, or ending turn there (once per turn): WIS save vs 3d8 Radiant/Necrotic (half on save). Upcasts +1d8/level.",
  },

  stinking_cloud: {
    id: "stinking_cloud",
    name: "Stinking Cloud",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 3,
      classes: ["bard", "sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 320",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "90 ft.",
      components: "V, S, M (a rotten egg)",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "save", saveAbility: "CON" },
    area: { shape: "Sphere", sizeFeet: 20 },
    damage: [],
    effectNotes: [
      "Create a 20-foot-radius Sphere of yellow, nauseating gas within 90 feet lasting up to 1 minute with concentration.",
      "The cloud is Heavily Obscured and lingers until duration ends or strong wind disperses it.",
      "Each creature that starts its turn in the Sphere must succeed on a Constitution saving throw or have the Poisoned condition until the end of the current turn.",
      "While Poisoned in this way, the creature cannot take an action or a Bonus Action.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Place 20-foot-radius Sphere within 90 feet; apply Heavily Obscured.",
        "Prompt Constitution saving throw at start of each creature's turn in area.",
        "On failed save, apply Poisoned condition until end of turn and prevent taking actions or bonus actions.",
      ],
    },
    isManualOverride: true,
    notes:
      "20-ft radius Sphere within 90 ft. Concentration up to 1 min. Heavily Obscured. Creatures starting turn in cloud make CON save: fail = Poisoned until turn end and cannot take an action or Bonus Action.",
  },

  summon_fey: {
    id: "summon_fey",
    name: "Summon Fey",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 3,
      classes: ["druid", "ranger", "warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 326",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "90 ft.",
      components: "V, S, M (a gilded flower worth 300+ GP)",
      duration: "Concentration, up to 1 hour",
    },
    interaction: { type: "utility" },
    damage: [{ dice: "2d6+3", type: "force", isBase: true }],
    upcasting: {
      notes:
        "AC equals 12 + spell level; HP equals 30 + 10 per level above 3rd; attacks equal half spell level (rounded down)",
    },
    effectNotes: [
      "You call forth a Fey Spirit in an unoccupied space within range. Choose its mood: Fuming, Mirthful, or Tricksy.",
      "The creature is an ally that takes its turn immediately after yours.",
      "AC: 12 + spell level. HP: 30 + 10 for each level above 3rd. Attacks: half spell level (rounded down).",
      "Fey Blade deals 2d6 + 3 + slot level Force damage.",
      "Fey Step: Bonus Action teleport up to 30 ft with mood rider (Fuming: Advantage on next attack; Mirthful: WIS save vs Charmed on creature within 10 ft; Tricksy: 5-ft cube magical darkness).",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Summon Fey Spirit within 90 ft and pick mood (Fuming/Mirthful/Tricksy).",
        "Track HP (30 + 10 per slot level above 3) and AC (12 + slot level).",
        "Spirit takes turn immediately after caster.",
      ],
    },
    isManualOverride: true,
    notes:
      "Player's Handbook (2024). Marked for detailed verification against printed book/DDB. In 2024 PHB, standardized summon spell (Druid, Ranger, Warlock, Wizard). Fey Spirit (Fuming, Mirthful, Tricksy); acts immediately after caster.",
  },

  // Syluné’s Viper (Forgotten Realms: Heroes of Faerûn, pg. 147)
  sylunes_viper: {
    id: "sylunes_viper",
    name: "Syluné’s Viper",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 3,
      classes: ["druid", "wizard"],
      source: "Forgotten Realms: Heroes of Faerûn, pg. 147",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 bonus action",
      range: "Self",
      components: "V, S, M (a snake fang)",
      duration: "1 hour",
    },
    interaction: { type: "spell_attack" },
    damage: [
      {
        dice: "1d6",
        type: "force",
        isBase: true,
        condition:
          "Venomous Bite ranged spell attack: 50 ft range, + Poisoned and Incapacitated until start of next turn",
      },
    ],
    upcasting: {
      notes:
        "For each spell slot level above 3, gain +5 Temporary Hit Points, and damage of Venomous Bite increases by 1d6 Force.",
    },
    effectNotes: [
      "Spectral snake encircles your body for 1 hour without concentration. Gain 15 Temporary Hit Points (spell ends early if Temp HP depleted).",
      "Climbing: Gain Climb Speed equal to your Speed.",
      "Venomous Bite: As a Magic action, make a ranged spell attack against a creature within 50 feet. Hit: 1d6 Force damage and target is Poisoned until start of your next turn. While Poisoned in this way, the target is Incapacitated.",
      "Using a Higher-Level Spell Slot: Gain +5 Temp HP and +1d6 Force damage per slot level above 3.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Cast as Bonus Action; grant 15 Temp HP (+5 per slot level above 3) and Climb speed for 1 hour.",
        "Track Temp HP: spell ends when Temp HP reach 0.",
        "Magic Action Venomous Bite: ranged spell attack up to 50 ft dealing 1d6 (+1d6 per slot level above 3) Force damage on hit.",
        "Apply Poisoned and Incapacitated conditions until start of caster's next turn.",
      ],
    },
    isManualOverride: true,
    notes:
      "Forgotten Realms: Heroes of Faerûn, pg. 147. Bonus Action, 1 hour (no concentration). Grants 15 Temp HP and Climb speed. Magic action 50-ft ranged attack: 1d6 Force + Poisoned and Incapacitated until next turn start. Upcast +5 Temp HP, +1d6 Force.",
  },

  // Thunder Step (XGtE, pg. 168)
  thunder_step: {
    id: "thunder_step",
    name: "Thunder Step",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 3,
      classes: ["sorcerer", "warlock", "wizard"],
      source: "Xanathar's Guide to Everything, pg. 168",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "90 ft.",
      components: "V",
      duration: "Instantaneous",
    },
    area: { shape: "Cube", sizeFeet: 10 },
    interaction: { type: "save", saveAbility: "CON" },
    damage: [{ dice: "3d8", type: "thunder", isBase: true }],
    upcasting: {
      notes: "+1d8 thunder damage per spell slot level above 3rd.",
      perSlotLevel: { dice: "1d8", type: "thunder" },
    },
    effectNotes: [
      "Teleport yourself up to 90 feet to an unoccupied space. You can bring one willing creature within 5 feet. Each creature within 10 feet of the space you left makes a CON save, taking 3d8 Thunder damage on failure, half on success.",
    ],
    isManualOverride: true,
    notes:
      "Teleport 90 ft. 10-ft Cube centered on departure space. CON save for 3d8 Thunder damage.",
  },

    // Level 4 (14 spells)
    black_tentacles: {
    id: "black_tentacles",
    name: "Evard's Black Tentacles",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 4,
      classes: ["sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 270",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "90 ft. (20-ft. square)",
      components: "V, S, M (a tentacle)",
      duration: "Concentration",
    },
    area: { shape: "Cube", sizeFeet: 20 },
    interaction: { type: "save", saveAbility: "STR" },
    damage: [
      {
        dice: "3d6",
        type: "bludgeoning",
        isBase: true,
        condition: "Failed Strength save",
      },
    ],
    effectNotes: [
      "Tentacles fill a 20-foot square on ground you can see within range, making it Difficult Terrain. Each creature in the area makes a Strength save; on a failure it takes 3d6 Bludgeoning damage and is Restrained until the spell ends.",
    ],
    isManualOverride: true,
    notes: "Alias for evards_black_tentacles.",
  },

  // Conjure Minor Elementals (D&D Free Rules 2024, Spell Descriptions; PHB 2024 errata applied)
  conjure_minor_elementals: {
    id: "conjure_minor_elementals",
    name: "Conjure Minor Elementals",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 4,
      classes: ["druid", "wizard"],
      source: "Player's Handbook (2024), pg. 255; PHB 2024 errata applied",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Self (15-ft. Emanation)",
      components: "V, S",
      duration: "Concentration, up to 10 minutes",
    },
    interaction: { type: "utility" },
    damage: [
      {
        dice: "2d8",
        type: "choice",
        typeChoices: ["acid", "cold", "fire", "lightning"],
        isBase: false,
        condition: "When your attack hits a creature in the Emanation",
      },
    ],
    upcasting: {
      notes:
        "+1d8 chosen Acid, Cold, Fire, or Lightning damage per slot level above 4 (PHB 2024 errata; replaces the original +2d8 text).",
      perSlotLevel: { dice: "1d8" },
    },
    effectNotes: [
      "Elemental spirits fill a 15-foot Emanation around you. For the duration, your attacks deal an extra 2d8 damage on a hit against a creature in the Emanation; choose Acid, Cold, Fire, or Lightning for each hit.",
      "The ground in the Emanation is Difficult Terrain for your enemies.",
    ],
    isManualOverride: true,
    notes:
      "Track the emanation, concentration, each attack hit inside it, chosen damage type and enemy Difficult Terrain.",
  },

  // Conjure Woodland Beings (Player's Handbook 2024, pg. 255)
  conjure_woodland_beings: {
    id: "conjure_woodland_beings",
    name: "Conjure Woodland Beings",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 4,
      classes: ["druid", "ranger"],
      source: "Player's Handbook (2024), pg. 255",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Self (10-ft. Emanation)",
      components: "V, S",
      duration: "Concentration, up to 10 minutes",
    },
    interaction: { type: "save", saveAbility: "WIS" },
    area: { shape: "Sphere", sizeFeet: 10 },
    damage: [
      {
        dice: "5d8",
        type: "force",
        isBase: true,
        condition:
          "On a failed save when the Emanation enters a creature's space, when it enters the Emanation, or ends its turn there; once per turn per creature",
      },
    ],
    upcasting: {
      notes: "+1d8 Force damage per spell slot level above 4th.",
      perSlotLevel: { dice: "1d8", type: "force" },
    },
    effectNotes: [
      "Nature spirits fill a 10-foot Emanation around you. When it enters a visible creature's space, or a visible creature enters it or ends its turn there, you can force a Wisdom save. On a failure, the creature takes 5d8 Force damage; on a success, it takes half. A creature can make this save only once per turn.",
      "You can take the Disengage action as a Bonus Action for the spell's duration.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Track the moving Emanation and each creature's once-per-turn save; apply half damage on a successful save and full damage on a failure.",
        "The current Free Rules spell-description entry differs from the PHB 2024 spell listing; this record follows the PHB 2024, pg. 255 version (5d8 Force and Disengage Bonus Action).",
      ],
    },
    isManualOverride: true,
    notes:
      "Use the cited PHB 2024 text rather than the inconsistent Basic Rules entry. The Emanation geometry and trigger movement require manual adjudication.",
  },

  dimension_door: {
    id: "dimension_door",
    name: "Dimension Door",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 4,
      classes: ["bard", "sorcerer", "warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 262",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "500 ft.",
      components: "V",
      duration: "Instantaneous",
    },
    interaction: { type: "utility" },
    damage: [
      {
        dice: "4d6",
        type: "force",
        isBase: false,
        condition:
          "Teleportation fails because an arrival space is occupied or completely filled",
      },
    ],
    effectNotes: [
      "Teleport yourself to a location within range that you see, visualize, or describe by distance and direction. You can bring one willing creature within 5 feet; it arrives in a space within 5 feet of your destination.",
      "If an arrival space for you or your companion is occupied by a creature or completely filled by objects, teleportation fails and each traveler takes 4d6 Force damage.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Choose and validate destination and whether to bring one willing creature within 5 feet. The GM verifies occupancy/obstruction; if an arrival space is invalid, cancel teleportation and roll 4d6 Force for each traveler.",
      ],
    },
    isManualOverride: true,
    notes:
      "A partially obstructed space is not described as completely filled; have the GM adjudicate destination validity rather than auto-failing it.",
  },

  doomtide: {
    id: "doomtide",
    name: "Doomtide",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 4,
      classes: ["bard", "cleric", "warlock"],
      source: "Forgotten Realms: Heroes of Faerûn, pg. 144",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "120 ft.",
      components: "V, S, M (soot and a dried eel)",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "save", saveAbility: "WIS" },
    area: { shape: "Sphere", sizeFeet: 20 },
    damage: [
      {
        dice: "5d6",
        type: "psychic",
        isBase: true,
        condition:
          "On failed WIS save (half on success); failed save also subtracts 1d6 from saves until next turn end",
      },
    ],
    effectNotes: [
      "A 20-foot-radius Sphere of inky magical Darkness appears within 120 feet lasting up to 1 minute with concentration.",
      "Moves 10 feet away from you at the start of each of your turns.",
      "Each creature in Sphere on appearance, or when Sphere moves into its space, enters it, or ends turn inside (once per turn) makes a Wisdom saving throw.",
      "Failed save: takes 5d6 Psychic damage and subtracts 1d6 from all saving throws until the end of its next turn.",
      "Successful save: takes half damage only.",
      "Circle Spell option: With 5+ secondary casters expending 3rd+ level slots and three black pearls from Pandemonium, range is 1 mile and duration becomes Until Dispelled (no concentration).",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Place 20-ft magical darkness Sphere within 120 ft; advance 10 ft away from caster at start of each turn.",
        "Prompt WIS save on appearance / move into space / enter / end turn: fail = 5d6 Psychic and -1d6 to saves until next turn end (half damage on success).",
        "Track Circle Spell mode if cast with 5+ secondary casters.",
      ],
    },
    isManualOverride: true,
    notes:
      "Forgotten Realms: Heroes of Faerûn, pg. 144. 20-ft radius Sphere within 120 ft (magical Darkness), conc up to 1 min. Moves 10 ft away each turn. WIS save vs 5d6 Psychic and -1d6 to saves (half on save). Circle Spell permanent option.",
  },

  evards_black_tentacles: {
    id: "evards_black_tentacles",
    name: "Evard's Black Tentacles",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 4,
      classes: ["sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 270",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "90 ft. (20-ft. square)",
      components: "V, S, M (a tentacle)",
      duration: "Concentration",
    },
    area: { shape: "Cube", sizeFeet: 20 },
    interaction: { type: "save", saveAbility: "STR" },
    damage: [
      {
        dice: "3d6",
        type: "bludgeoning",
        isBase: true,
        condition: "Failed Strength save",
      },
    ],
    effectNotes: [
      "Tentacles fill a 20-foot square on ground you can see within range, making it Difficult Terrain. Each creature in the area makes a Strength save; on a failure it takes 3d6 Bludgeoning damage and is Restrained until the spell ends.",
      "A creature makes the save when it enters the area or ends its turn there, at most once per turn. A Restrained creature can use an action to make a Strength (Athletics) check against your spell save DC, ending the condition on itself on a success.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Place and track the 20-foot square and concentration. Resolve Strength saves on initial casting, entry, and end of turn, limiting each creature to one save per turn.",
        "On a failed save apply 3d6 Bludgeoning damage and Restrained; track Difficult Terrain and allow the action-based Athletics escape check.",
      ],
    },
    isManualOverride: true,
    notes:
      "The Free Rules text lists the duration as Concentration without a maximum; preserve that source wording rather than inferring a cap.",
  },

  giant_insect: {
    id: "giant_insect",
    name: "Giant Insect",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 4,
      classes: ["druid"],
      source: "Player's Handbook (2024), pg. 279",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "60 ft.",
      components: "V, S",
      duration: "Concentration, up to 10 minutes",
    },
    interaction: { type: "utility" },
    damage: [],
    upcasting: {
      notes:
        "Use the spell slot level as the spell's level in the Giant Insect stat block.",
    },
    effectNotes: [
      "Summon a giant centipede, spider, or wasp in a visible unoccupied space within range. Use the Giant Insect stat block; it is a Large Beast with AC 11 + spell level, HP 30 + 10 per slot level above 4, Speed 40 feet and Climb 40 feet (Wasp also Fly 40 feet).",
      "It shares your Initiative and acts immediately after you, obeying verbal commands without an action; without commands it Dodges and avoids danger. It disappears at 0 HP or when the spell ends. The stat block's Multiattack count is half the spell level rounded down; attacks and type-specific traits vary by form.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Choose the insect form and create its stat block using the cast slot level; track its HP, AC, movement, concentration, shared Initiative, and independent token.",
        "Resolve its attacks, multiattack, Spider Climb, and form-specific traits from the official stat block. It disappears at 0 HP or when the spell ends.",
      ],
    },
    isManualOverride: true,
    notes:
      "The summoned stat block scales with spell slot; use the matching centipede, spider, or wasp trait and action text.",
  },

  grasping_vine: {
    id: "grasping_vine",
    name: "Grasping Vine",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 4,
      classes: ["druid", "ranger"],
      source: "Player's Handbook (2024), pg. 280",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 bonus action",
      range: "60 ft.",
      components: "V, S",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "melee_spell_attack" },
    damage: [{ dice: "4d8", type: "bludgeoning", isBase: true }],
    upcasting: {
      notes: "Can grapple 1 additional creature per slot level above 4th",
    },
    effectNotes: [
      "You conjure a vine that sprouts from a surface in an unoccupied space you can see within range.",
      "Make a melee spell attack against a creature within 30 feet of the vine. On a hit, the target takes 4d8 Bludgeoning damage and you pull it up to 30 feet toward the vine. If the creature is Huge or smaller, it also has the Grappled condition (escape DC equals your spell save DC).",
      "On later turns as a Bonus Action, you can repeat the attack against a creature within 30 feet of the vine.",
      "Using a Higher-Level Spell Slot: The number of creatures the vine can grapple increases by 1 for each spell slot level above 4.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Conjure vine within 60 ft.",
        "Make melee spell attack vs creature within 30 ft of vine; apply 4d8 Bludgeoning damage on hit.",
        "Pull creature up to 30 ft toward vine; apply Grappled condition if Huge or smaller.",
        "Repeat attack as a Bonus Action on later turns.",
      ],
    },
    isManualOverride: true,
    notes:
      "Player's Handbook (2024). Marked for detailed verification against printed book/DDB. In 2024, cast as a Bonus Action, makes a melee spell attack for 4d8 Bludgeoning damage, pulls up to 30 ft, and grapples.",
  },

  guardian_of_faith: {
    id: "guardian_of_faith",
    name: "Guardian of Faith",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 4,
      classes: ["cleric"],
      source: "Player's Handbook (2024), pg. 281",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "30 ft.",
      components: "V",
      duration: "8 hours",
    },
    interaction: { type: "save", saveAbility: "DEX" },
    damage: [
      { dice: "20", type: "radiant", isBase: false, condition: "Failed save" },
    ],
    effectNotes: [
      "A Large spectral guardian appears in a visible unoccupied space within range, occupies it, and is invulnerable. An enemy that first moves within 10 feet on a turn or starts its turn there makes a Dexterity save, taking 20 Radiant damage on a failure or half on a success. The guardian vanishes after dealing 60 total damage.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Place and track the invulnerable Large guardian and its occupied space for up to 8 hours. Record total damage dealt toward its 60-damage limit.",
        "For each enemy entering the 10-foot trigger area for the first time on a turn or starting there, resolve a Dexterity save and 20 Radiant damage (half on success); remove the guardian after 60 total damage.",
      ],
    },
    isManualOverride: true,
    notes:
      "Track the first-entry-per-turn and start-of-turn triggers separately; the guardian's damage threshold is cumulative.",
  },

  leomunds_secret_chest: {
    id: "leomunds_secret_chest",
    name: "Leomund's Secret Chest",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 4,
      classes: ["cleric", "wizard"],
      source: "Player's Handbook (2024), pg. 290",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Touch",
      components:
        "V, S, M (a chest, 3 feet by 2 feet by 2 feet, constructed from rare materials worth 5,000+ GP, and a Tiny replica of the chest made from the same materials worth 50+ GP)",
      duration: "Until dispelled",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Hide a chest and all its contents (up to 12 cubic feet of nonliving material, 3x2x2 ft.) on the Ethereal Plane by touching the chest and the Tiny replica.",
      "While the chest remains on the Ethereal Plane, you can take a Magic action and touch the replica to recall the chest to an unoccupied space on the ground within 5 feet of you. You can send it back to the Ethereal Plane by taking a Magic action and touching both the chest and replica.",
      "After 60 days, there is a cumulative 5% chance at the end of each day that the spell ends. The spell also ends if you cast this spell again or if the Tiny replica chest is destroyed. If the spell ends while the chest is on the Ethereal Plane, the chest remains stranded there.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Verify material components (5,000+ GP chest, 50+ GP replica) and nonliving cargo capacity up to 12 cubic feet.",
        "Track current plane of the chest; recall or send back using a Magic action.",
        "Starting on day 61, check a cumulative 5% daily chance for the spell to end and strand the chest on the Ethereal Plane. End immediately if recast or replica destroyed.",
      ],
    },
    isManualOverride: true,
    notes:
      "Player's Handbook (2024), pg. 290. Chest holds only nonliving material. Recalling or banishing requires a Magic action. Stranded chest remains on the Ethereal Plane if the spell ends.",
  },

  mordenkainens_faithful_hound: {
    id: "mordenkainens_faithful_hound",
    name: "Mordenkainen's Faithful Hound",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 4,
      classes: ["wizard"],
      source: "Player's Handbook (2024), pg. 300",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "30 ft.",
      components: "V, S, M (a silver whistle)",
      duration: "8 hours",
    },
    interaction: { type: "save", saveAbility: "DEX" },
    damage: [{ dice: "4d8", type: "force", isBase: true }],
    effectNotes: [
      "Conjure a phantom watchdog in an unoccupied space in range. Lasts 8 hours or until you are more than 300 feet apart. Intangible, invulnerable, and visible only to you.",
      "When a Small or larger creature comes within 30 feet of it without speaking the password, the hound barks loudly. The hound has Truesight out to 30 feet.",
      "At the start of each of your turns, the hound attempts to bite one enemy within 5 feet of it. That enemy makes a Dexterity saving throw or takes 4d8 Force damage.",
      "On your later turns, you can take a Magic action to move the hound up to 30 feet.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Place phantom watchdog token; record password and track 8-hour duration / 300 ft. separation limit.",
        "Trigger alarm bark if Small+ creature without password approaches within 30 feet (hound has 30 ft. Truesight).",
        "At the start of caster's turns, prompt DEX save for 4d8 Force damage against one enemy within 5 feet.",
        "Allow Magic action on caster's turn to reposition hound up to 30 feet.",
      ],
    },
    isManualOverride: true,
    notes:
      "Lasts 8 hours without concentration (ends if > 300 ft away). 30 ft. Truesight and intruder alarm. Bites one adjacent enemy at the start of each of your turns for 4d8 Force (DEX save). Magic action to move 30 ft.",
  },

  summon_aberration: {
    id: "summon_aberration",
    name: "Summon Aberration",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 4,
      classes: ["warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 322",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "90 ft.",
      components:
        "V, S, M (a pickled tentacle and an eyeball in a platinum-inlaid vial worth 400+ GP)",
      duration: "Concentration, up to 1 hour",
    },
    interaction: { type: "utility" },
    damage: [{ dice: "1d8+3", type: "psychic", isBase: true }],
    upcasting: {
      notes:
        "AC increases by +1, HP by +10, and attacks equal half spell level (rounded down)",
    },
    effectNotes: [
      "You call forth an Aberrant Spirit in an unoccupied space within range. Choose its form: Beholderkin, Mind Flayer, or Slaad.",
      "The creature is an ally that takes its turn immediately after yours.",
      "AC: 11 + spell level. HP: 40 + 10 for each level above 4th. Attacks: half spell level (rounded down).",
      "Beholderkin has Eye Ray (ranged attack, 1d8 + 3 + slot level Psychic).",
      "Mind Flayer has Whispering Aura (2d6 Psychic) and Psychic Slam.",
      "Slaad has Regeneration and Claws (1d10 + 3 + slot level Slashing, prevents healing).",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Summon Aberrant Spirit within 90 ft and pick form (Beholderkin/Mind Flayer/Slaad).",
        "Track spirit HP (40 + 10 per slot level above 4) and AC (11 + slot level).",
        "Spirit takes turn immediately after caster.",
      ],
    },
    isManualOverride: true,
    notes:
      "Player's Handbook (2024). Marked for detailed verification against printed book/DDB. In 2024 PHB, standardized summon spell. Uses 2024 Aberrant Spirit stat block; acts immediately after caster.",
  },

  summon_construct: {
    id: "summon_construct",
    name: "Summon Construct",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 4,
      classes: ["wizard"],
      source: "Player's Handbook (2024), pg. 324",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "90 ft.",
      components: "V, S, M (a lockbox worth 400+ GP)",
      duration: "Concentration, up to 1 hour",
    },
    interaction: { type: "utility" },
    damage: [{ dice: "1d8+4", type: "bludgeoning", isBase: true }],
    upcasting: {
      notes:
        "AC equals 13 + spell level; HP equals 40 + 15 per level above 4th; attacks equal half spell level (rounded down)",
    },
    effectNotes: [
      "You call forth a Construct Spirit in an unoccupied space within range. Choose its material: Clay, Metal, or Stone.",
      "The creature is an ally that takes its turn immediately after yours.",
      "AC: 13 + spell level. HP: 40 + 15 for each level above 4th. Attacks: half spell level (rounded down).",
      "Slam deals 1d8 + 4 + slot level Bludgeoning damage.",
      "Clay has Berserk Lurch. Metal has Heated Body (1d10 Fire to melee attackers). Stone has Stone Lethargy (10-ft aura slows enemies).",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Summon Construct Spirit within 90 ft and pick material (Clay/Metal/Stone).",
        "Track HP (40 + 15 per slot level above 4) and AC (13 + slot level).",
        "Spirit takes turn immediately after caster.",
      ],
    },
    isManualOverride: true,
    notes:
      "Player's Handbook (2024). Marked for detailed verification against printed book/DDB. In 2024 PHB, standardized summon spell (Wizard). Construct Spirit (Clay, Metal, Stone); acts immediately after caster.",
  },

  summon_elemental: {
    id: "summon_elemental",
    name: "Summon Elemental",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 4,
      classes: ["druid", "ranger", "wizard"],
      source: "Player's Handbook (2024), pg. 325",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "90 ft.",
      components:
        "V, S, M (air, a pebble, ash, and water inside a gold-inlaid vial worth 400+ GP)",
      duration: "Concentration, up to 1 hour",
    },
    interaction: { type: "utility" },
    damage: [
      {
        dice: "1d10+4",
        type: "choice",
        typeChoices: ["lightning", "bludgeoning", "fire", "cold"],
        isBase: true,
      },
    ],
    upcasting: {
      notes:
        "AC equals 11 + spell level; HP equals 50 + 10 per level above 4th; attacks equal half spell level (rounded down)",
    },
    effectNotes: [
      "You call forth an Elemental Spirit in an unoccupied space within range. Choose its element: Air, Earth, Fire, or Water.",
      "The creature is an ally that takes its turn immediately after yours.",
      "AC: 11 + spell level. HP: 50 + 10 for each level above 4th. Attacks: half spell level (rounded down).",
      "Slam deals 1d10 + 4 + slot level damage (Lightning for Air, Bludgeoning for Earth, Fire for Fire, Cold for Water). Earth has Burrow, Air has Fly, Water has Swim.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Summon Elemental Spirit within 90 ft and pick element (Air/Earth/Fire/Water).",
        "Track HP (50 + 10 per slot level above 4) and AC (11 + slot level).",
        "Spirit takes turn immediately after caster.",
      ],
    },
    isManualOverride: true,
    notes:
      "Player's Handbook (2024). Marked for detailed verification against printed book/DDB. In 2024 PHB, standardized summon spell (Druid, Ranger, Wizard). Elemental Spirit (Air, Earth, Fire, Water); acts immediately after caster.",
  },

    // Level 5 (11 spells)
    banishing_smite: {
    id: "banishing_smite",
    name: "Banishing Smite",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 5,
      classes: ["paladin"],
      source: "Player's Handbook (2024), pg. 245",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 bonus action",
      range: "Self",
      components: "V",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "save", saveAbility: "CHA" },
    damage: [
      {
        dice: "5d10",
        type: "force",
        isBase: true,
        condition:
          "Immediately after hitting a creature with a weapon or Unarmed Strike",
      },
    ],
    effectNotes: [
      "Cast as a Bonus Action immediately after hitting a creature with a weapon or an Unarmed Strike. The target takes an extra 5d10 Force damage.",
      "If this damage reduces the target to 50 Hit Points or fewer, it must succeed on a Charisma saving throw or be transported to a harmless demiplane, where it has the Incapacitated condition.",
      "While there, the target remains until the spell ends. If the target is native to a different plane, it doesn't return when the spell ends; otherwise it reappears in its space (or nearest unoccupied space).",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Cast as Bonus Action upon weapon/unarmed hit.",
        "Deal 5d10 Force damage.",
        "If target is reduced to <= 50 HP, prompt Charisma saving throw.",
        "If failed, banish to harmless demiplane with Incapacitated condition; track concentration up to 1 minute.",
      ],
    },
    isManualOverride: true,
    notes:
      "Player's Handbook (2024). Marked for detailed verification against printed book/DDB. In 2024, cast as a Bonus Action on hit, dealing 5d10 Force damage; banishes target reduced to <= 50 HP on failed Charisma save.",
  },

  // Cloudkill (D&D Free Rules 2024, Spell Descriptions)
  cloudkill: {
    id: "cloudkill",
    name: "Cloudkill",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 5,
      classes: ["sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 251",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "120 ft.",
      components: "V, S",
      duration: "Concentration, up to 10 minutes",
    },
    interaction: { type: "save", saveAbility: "CON" },
    area: { shape: "Sphere", sizeFeet: 20 },
    damage: [{ dice: "5d8", type: "poison", isBase: true }],
    upcasting: {
      notes: "+1d8 Poison damage per spell slot level above 5.",
      perSlotLevel: { dice: "1d8", type: "poison" },
    },
    effectNotes: [
      "Create a 20-foot-radius Sphere of Heavily Obscured yellow-green fog. Each creature in it makes a Constitution save, taking 5d8 Poison damage on a failure or half on a success. A creature saves only once per turn, including when the Sphere moves into it, it enters the Sphere, or ends its turn there.",
      "At the start of each of your turns, the Sphere moves 10 feet away from you. Strong wind disperses it and ends the spell.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Track the moving Sphere, Heavily Obscured area, concentration, strong wind, and once-per-turn saves for each creature; token HP is not automatically updated.",
      ],
    },
    isManualOverride: true,
    notes:
      "The spell moves automatically away from the caster at turn start; update its position and apply the once-per-turn limit manually.",
  },

  // Conjure Elemental (D&D Free Rules 2024, Spell Descriptions; PHB 2024 errata applied)
  conjure_elemental: {
    id: "conjure_elemental",
    name: "Conjure Elemental",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 5,
      classes: ["druid", "wizard"],
      source: "Player's Handbook (2024), pg. 254; PHB 2024 errata applied",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "60 ft.",
      components: "V, S",
      duration: "Concentration, up to 10 minutes",
    },
    interaction: { type: "save", saveAbility: "DEX" },
    damage: [
      {
        dice: "8d8",
        type: "choice",
        typeChoices: ["lightning", "thunder", "fire", "cold"],
        isBase: true,
        condition: "On failed save; target also becomes Restrained",
      },
    ],
    upcasting: {
      notes:
        "+2d8 damage per slot level above 4, following PHB 2024 errata (rather than the original Free Rules wording). Repeated damage while Restrained is 4d8 before slot scaling.",
      perSlotLevel: { dice: "2d8" },
    },
    effectNotes: [
      "Conjure a Large intangible elemental spirit in an unoccupied space and choose Air (Lightning), Earth (Thunder), Fire (Fire), or Water (Cold). If it has no creature Restrained, when a visible creature enters its space or starts its turn within 5 feet, you can force a Dexterity save; on a failure, it takes 8d8 damage of the chosen type and is Restrained.",
      "A Restrained target repeats the save at the start of each turn. Failure deals 4d8 damage; success ends the Restrained condition from the spirit.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Track the spirit, element/damage type, concentration, current Restrained target and recurring saves. Apply the PHB erratum to slot scaling; the Basic Rules page still displays the uncorrected threshold.",
      ],
    },
    isManualOverride: true,
    notes:
      "PHB 2024 errata changes the upcast threshold from above 5 to above 4; follow the errata even though the Free Rules spell page still shows the original text. Track one Restrained creature per spirit.",
  },

  conjure_volley: {
    id: "conjure_volley",
    name: "Conjure Volley",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 5,
      classes: ["ranger"],
      source: "Player's Handbook (2024), pg. 255",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "150 ft. (40-ft.-radius, 20-ft.-high cylinder)",
      components: "V, S, M (one piece of ammunition or a thrown weapon)",
      duration: "Instantaneous",
    },
    interaction: { type: "save", saveAbility: "DEX" },
    area: { shape: "Cylinder", sizeFeet: 40, heightFeet: 20 },
    damage: [{ dice: "8d8", type: "force", isBase: true }],
    effectNotes: [
      "You brandish the weapon used to cast the spell and choose a point within range.",
      "Spectral weapons rain down in a 40-foot-radius, 20-foot-high Cylinder centered on that point.",
      "Each creature in that area must make a Dexterity saving throw, taking 8d8 Force damage on a failed save, or half as much on a successful one.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Place 40-ft radius Cylinder within 150 ft.",
        "Prompt Dexterity saves for creatures in the cylinder.",
        "Apply 8d8 Force damage (half on save).",
      ],
    },
    isManualOverride: true,
    notes:
      "Player's Handbook (2024). Marked for detailed verification against printed book/DDB. In 2024, deals 8d8 Force damage (standardized from nonmagical weapon damage) in a 40-ft-radius, 20-ft-high cylinder.",
  },

  insect_plague: {
    id: "insect_plague",
    name: "Insect Plague",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 5,
      classes: ["cleric", "druid", "sorcerer"],
      source: "Player's Handbook (2024), pg. 289",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "300 ft. (20-ft. radius)",
      components: "V, S, M (a locust)",
      duration: "Concentration, up to 10 minutes",
    },
    interaction: { type: "save", saveAbility: "CON" },
    area: { shape: "Sphere", sizeFeet: 20 },
    damage: [{ dice: "4d10", type: "piercing", isBase: true }],
    upcasting: {
      notes: "+1d10 Piercing damage per spell slot level above 5th",
      perSlotLevel: { dice: "1d10", type: "piercing" },
    },
    effectNotes: [
      "A 20-foot-radius Sphere of locusts is Lightly Obscured and Difficult Terrain. When it appears, each creature inside makes a Constitution save, taking 4d10 Piercing damage on a failure or half on a success. A creature also saves when it first enters the area on a turn or ends its turn there, but only once per turn.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Place and track the 20-foot-radius Lightly Obscured, Difficult Terrain Sphere and concentration. Resolve Constitution saves when it appears, when a creature first enters on a turn, or ends its turn there; one save per creature per turn.",
        "Apply 4d10 Piercing damage (half on success), adding 1d10 per slot level above 5.",
      ],
    },
    isManualOverride: true,
    notes:
      "Unlike Incendiary Cloud, Insect Plague is stationary; its area imposes both Lightly Obscured and Difficult Terrain.",
  },

  steel_wind_strike: {
    id: "steel_wind_strike",
    name: "Steel Wind Strike",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 5,
      classes: ["ranger", "wizard"],
      source: "Player's Handbook (2024), pg. 319",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "30 ft.",
      components: "S, M (a melee weapon worth at least 1 SP)",
      duration: "Instantaneous",
    },
    interaction: { type: "melee_spell_attack" },
    damage: [{ dice: "6d10", type: "force", isBase: true }],
    effectNotes: [
      "You flourish the weapon used as the material component and make a melee spell attack against up to five creatures you can see within 30 feet.",
      "On a hit, a target takes 6d10 Force damage.",
      "After the attacks, you can teleport to an unoccupied space you can see within 5 feet of one of the targets (hit or missed).",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Select up to 5 creatures within 30 ft.",
        "Make a melee spell attack against each target; apply 6d10 Force damage on hit.",
        "Optionally teleport within 5 ft of any of the targets.",
      ],
    },
    isManualOverride: true,
    notes:
      "Player's Handbook (2024). Marked for detailed verification against printed book/DDB. In 2024, targets up to 5 creatures within 30 ft with melee spell attacks for 6d10 Force each, then teleports.",
  },

  summon_celestial: {
    id: "summon_celestial",
    name: "Summon Celestial",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 5,
      classes: ["cleric", "paladin"],
      source: "Player's Handbook (2024), pg. 323",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "90 ft.",
      components: "V, S, M (a reliquary worth 500+ GP)",
      duration: "Concentration, up to 1 hour",
    },
    interaction: { type: "utility" },
    damage: [{ dice: "2d6+2", type: "radiant", isBase: true }],
    upcasting: {
      notes:
        "AC equals 11 + spell level; HP equals 40 + 10 per level above 5th; attacks equal half spell level (rounded down)",
    },
    effectNotes: [
      "You call forth a Celestial Spirit in an unoccupied space within range. Choose its form: Avenger or Defender.",
      "The creature is an ally that takes its turn immediately after yours.",
      "AC: 11 + spell level. HP: 40 + 10 for each level above 5th. Attacks: half spell level (rounded down).",
      "Avenger has Radiant Bow (ranged attack, 2d6 + 2 + slot level Radiant).",
      "Defender has Radiant Mace (melee attack, 1d10 + 3 + slot level Radiant) and Healing Touch (action: heals 2d8 + slot level once per day).",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Summon Celestial Spirit within 90 ft and pick form (Avenger/Defender).",
        "Track HP (40 + 10 per slot level above 5) and AC (11 + slot level).",
        "Spirit takes turn immediately after caster.",
      ],
    },
    isManualOverride: true,
    notes:
      "Player's Handbook (2024). Marked for detailed verification against printed book/DDB. In 2024 PHB, standardized summon spell (Cleric, Paladin). Celestial Spirit (Avenger, Defender); acts immediately after caster.",
  },

  summon_dragon: {
    id: "summon_dragon",
    name: "Summon Dragon",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 5,
      classes: ["wizard"],
      source: "Player's Handbook (2024), pg. 324",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "60 ft.",
      components:
        "V, S, M (an object with the image of a dragon engraved on it worth 500+ GP)",
      duration: "Concentration, up to 1 hour",
    },
    interaction: { type: "utility" },
    damage: [],
    upcasting: {
      notes: "+1d6 Piercing damage per slot level above 5th",
      perSlotLevel: { dice: "1d6", type: "piercing" },
    },
    effectNotes: [
      "Call forth a Dragon spirit manifesting in an unoccupied space within 60 feet using the Draconic Spirit stat block.",
      "Lasts up to 1 hour with concentration, or until reduced to 0 Hit Points.",
      "Shares your Initiative count, acts immediately after you in combat, and obeys verbal commands (no action required). Dodges by default if no command given.",
      "Using a Higher-Level Spell Slot: stat block scales with slot level (HP, AC, Rend damage, and breath weapon).",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Verify 500+ GP engraved dragon object focus.",
        "Spawn Draconic Spirit token; scale statistics based on spell slot level (level 5+).",
        "Insert token in initiative order immediately after summoner; track concentration up to 1 hour.",
      ],
    },
    isManualOverride: true,
    notes:
      "Requires 500+ GP engraved focus. Concentration up to 1 hour. Summons Draconic Spirit acting right after caster's turn. Scales attacks, AC, and HP with slot level above 5.",
  },

  // Summon Plant (Arcana Unleashed, pg. 44)
  summon_plant: {
    id: "summon_plant",
    name: "Summon Plant",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 5,
      classes: ["druid", "ranger"],
      source: "Arcana Unleashed, pg. 44",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "90 ft.",
      components: "V, S, M (herbs worth 500+ GP)",
      duration: "Concentration, up to 1 hour",
    },
    interaction: { type: "utility" },
    damage: [
      {
        dice: "1d10 + 3",
        type: "bludgeoning",
        isBase: false,
        condition:
          "Tree/Vine Slam: reach 5 ft, + spell level Bludgeoning damage",
      },
      {
        dice: "1d4",
        type: "poison",
        isBase: false,
        condition:
          "Fungus Spore Spray: reach 5 ft or range 30 ft, + spell level Poison damage + Poisoned (extra 3d4 if already Poisoned)",
      },
    ],
    upcasting: {
      notes:
        "Use the spell slot's level for the spell's level in the stat block (AC: 11 + level [+2 Tree]; HP: 50 + 10 per level above 5; attacks = half level round down; damage adds spell level)",
    },
    effectNotes: [
      "Summon a Plant Spirit (Large Plant) within 90 feet: choose Fungus, Tree, or Vine form.",
      "Combat: Shares Initiative count, acts immediately after you. Obeys commands (no action); Dodges if no command.",
      "Stat block: AC 11 + level (+2 Tree), HP 50 + (10 * level above 5), Speed 40 ft (Climb 40 ft Vine). Vulnerabilities: Fire (Tree), Slashing (Fungus/Vine). STR 17 (+3), DEX 13 (+1), CON 14 (+2), INT 10 (+0), WIS 13 (+1), CHA 10 (+0).",
      "Siege Monster (Tree): Double damage to structures. Twist Away (Vine): Bonus Action Dash or Disengage.",
      "Multiattack: Makes attacks equal to half spell level (round down).",
      "Slam (Tree/Vine): Reach 5 ft. Hit: 1d10 + 3 + spell level Bludgeoning.",
      "Spore Spray (Fungus): Reach 5 ft or range 30 ft. Hit: 1d4 + spell level Poison and Poisoned until end of next turn (if already Poisoned, takes extra 3d4 Poison damage instead).",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Verify 500+ GP herbs focus.",
        "Summon Large Plant Spirit (Fungus, Tree, or Vine form).",
        "Scale stats by spell slot level (AC 11+level, HP 50+10*(level-5), attacks = floor(level/2), damage bonus = 3 + level).",
        "Resolve special actions: Tree siege slam, Vine bonus dash/disengage, or Fungus spore poison spray.",
      ],
    },
    isManualOverride: true,
    notes:
      "Arcana Unleashed, pg. 44. Conc up to 1 hour, 500+ GP herbs. Summons Large Plant Spirit (Fungus, Tree, or Vine). Scales HP, AC, multiattack, and damage by spell slot level.",
  },

  teleportation_circle: {
    id: "teleportation_circle",
    name: "Teleportation Circle",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 5,
      classes: ["bard", "sorcerer", "warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 332",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 minute",
      range: "10 feet",
      components: "V, M (rare inks worth 50+ GP, which the spell consumes)",
      duration: "1 round",
    },
    area: { shape: "Sphere", sizeFeet: 5 },
    damage: [],
    effectNotes: [
      "Draw a 5-foot-radius circle on the ground inscribed with sigils linking to a known permanent teleportation circle on the same plane.",
      "A shimmering portal opens within the circle and remains until the end of your next turn.",
      "Any creature that enters the portal instantly appears within 5 feet of destination circle or nearest unoccupied space.",
      "Casting in the same location daily for 365 days creates a permanent teleportation circle.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Verify 50+ GP rare inks consumed.",
        "Place 5-foot-radius portal circle on ground.",
        "Portal links to chosen known permanent teleportation circle until end of next turn.",
        "Move entering creatures to destination.",
      ],
    },
    isManualOverride: true,
    notes:
      "1-minute cast, consumes 50+ GP rare inks. Creates 5-ft radius portal for 1 round linking to a known permanent teleportation circle on same plane. Casting daily for 365 days makes circle permanent.",
  },

  tree_stride: {
    id: "tree_stride",
    name: "Tree Stride",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 5,
      classes: ["druid", "ranger"],
      source: "Player's Handbook (2024), pg. 335",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Self",
      components: "V, S",
      duration: "Concentration, up to 1 minute",
    },
    damage: [],
    effectNotes: [
      "Gain the ability to enter a living tree at least your size and move inside it to another living tree of the same kind within 500 feet.",
      "Spend 5 feet of movement to enter a tree. Instantly know location of all trees of same kind within 500 feet.",
      "Pass into one of those trees and step out within 5 feet of destination tree using another 5 feet of movement (or within 5 ft of entry tree if no movement left).",
      "Can be used only once per turn. Must end each turn outside a tree.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Activate 1-minute concentration buff.",
        "Once per turn, spend 5 ft movement to enter living tree of caster's size or larger.",
        "Teleport to tree of same kind within 500 ft and exit within 5 ft spending another 5 ft movement.",
      ],
    },
    isManualOverride: true,
    notes:
      "Concentration up to 1 min. Once per turn, spend 5 ft movement to step into living tree and exit within 5 ft of another tree of same kind within 500 ft (using 5 ft movement). Must end turn outside tree.",
  },

    // Level 6 (11 spells)
    arcane_gate: {
    id: "arcane_gate",
    name: "Arcane Gate",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 6,
      classes: ["sorcerer", "warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 242",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "500 ft.",
      components: "V, S",
      duration: "Concentration, up to 10 minutes",
    },
    damage: [],
    area: { shape: "Circle", sizeFeet: 10 },
    effectNotes: [
      "Create two linked teleportation portals in two Large, unoccupied spaces on the ground that you can see within range (at least 10 feet apart).",
      "Each portal is a 10-foot-diameter mist-filled circular ring hovering perpendicular to the ground, with an open side that blocks line of sight. Entering the open side instantly teleports a creature or object out the open side of the other portal as if adjacent (costing normal movement).",
      "As a Bonus Action on your turn, you can rotate the portals so that each open side faces a different direction.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Place two 10-ft circular portal tokens in Large unoccupied ground spaces within 500 ft.",
        "Track concentration up to 10 minutes.",
        "Teleport any creature or object entering the active open side to the exit portal.",
        "Allow Bonus Action rotation of portal orientations.",
      ],
    },
    isManualOverride: true,
    notes:
      "Player's Handbook (2024). Marked for detailed verification against printed book/DDB. In 2024, portals must be placed in Large, unoccupied ground spaces; open sides block line of sight and can be rotated with a Bonus Action.",
  },

  // Conjure Fey (D&D Free Rules 2024, Spell Descriptions; PHB 2024 errata applied)
  conjure_fey: {
    id: "conjure_fey",
    name: "Conjure Fey",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 6,
      classes: ["druid"],
      source: "Player's Handbook (2024), pg. 255; PHB 2024 errata applied",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "60 ft.",
      components: "V, S",
      duration: "Concentration, up to 10 minutes",
    },
    interaction: { type: "melee_spell_attack" },
    damage: [
      {
        dice: "3d12",
        type: "psychic",
        isBase: true,
        condition: "On a hit; add spellcasting ability modifier",
      },
    ],
    upcasting: {
      notes:
        "+1d12 Psychic damage per slot level above 6 (PHB 2024 errata; replaces the original +2d12 text).",
      perSlotLevel: { dice: "1d12", type: "psychic" },
    },
    effectNotes: [
      "Conjure a Medium Fey spirit in a visible unoccupied space. When it appears, make a melee spell attack against a creature within 5 feet; on a hit, deal 3d12 Psychic damage plus your spellcasting modifier and Frighten it until the start of your next turn.",
      "On later turns, a Bonus Action can teleport the spirit up to 30 feet to a visible unoccupied space and make the attack again.",
    ],
    isManualOverride: true,
    notes:
      "Track the spirit, concentration and Frightened duration; the spell includes an initial attack and optional Bonus Action attacks on later turns.",
  },

  drawmijs_instant_summons: {
    id: "drawmijs_instant_summons",
    name: "Drawmij's Instant Summons",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 6,
      classes: ["wizard"],
      source: "Player's Handbook (2024), pg. 266",
      concentration: false,
      ritual: true,
    },
    casting: {
      time: "1 minute",
      range: "Touch",
      components: "V, S, M (a sapphire worth 1,000+ GP)",
      duration: "Until dispelled",
    },
    damage: [],
    effectNotes: [
      "Touch the sapphire and an object weighing 10 pounds or less (longest dimension <= 6 feet). Leaves invisible mark on object and invisibly inscribes object's name on sapphire.",
      "Thereafter, take a Magic action to speak the object's name and crush sapphire: object instantly appears in your hand regardless of physical or planar distances, ending spell.",
      "If another creature is holding or carrying the object, crushing the sapphire reveals who that creature is and where that creature is located instead of transporting object.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Verify 1,000+ GP sapphire; mark eligible object (<=10 lbs, <=6 ft).",
        "Magic action to crush sapphire and summon object to hand from anywhere.",
        "If carried by another creature, reveal carrier identity and location instead.",
      ],
    },
    isManualOverride: true,
    notes:
      "Ritual, Until Dispelled, requires 1,000+ GP sapphire. Marks object <= 10 lbs (<= 6 ft). Magic action to crush sapphire summons object to hand across planes, or reveals creature holding it if carried.",
  },

  heroes_feast: {
    id: "heroes_feast",
    name: "Heroes' Feast",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 6,
      classes: ["bard", "cleric", "druid"],
      source: "Player's Handbook (2024), pg. 284",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "10 minutes",
      range: "Self",
      components: "V, S, M (gem-encrusted bowl worth 1,000+ GP, consumed)",
      duration: "Instantaneous",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Create a feast in an unoccupied 10-foot Cube next to you. Up to twelve creatures can partake; it takes 1 hour to consume, then disappears, and benefits begin after that hour. Each creature that partakes gains 24 hours of Resistance to Poison damage, Immunity to Frightened and Poisoned, and an increase to its Hit Point maximum and current HP by 2d10.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Track the consumed bowl, feast location, up to twelve participants, and 1-hour consumption period; benefits do not begin until the hour ends.",
        "For each participant, roll 2d10 and increase both current HP and HP maximum by that amount; track Poison Resistance and immunity to Frightened/Poisoned for 24 hours.",
      ],
    },
    isManualOverride: true,
    notes:
      "Participants must consume the feast; benefits begin only after the full hour and last 24 hours.",
  },

  planar_ally: {
    id: "planar_ally",
    name: "Planar Ally",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 6,
      classes: ["cleric"],
      source: "Player's Handbook (2024), pg. 304",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "10 minutes",
      range: "60 ft.",
      components: "V, S",
      duration: "Instantaneous",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Beseech a known otherworldly cosmic entity (god, demon prince, etc.) to send a Celestial, Elemental, or Fiend loyal to it within 60 feet.",
      "The creature is under no compulsion to obey; you must bargain and pay for services (100 GP/min for minute tasks, 1,000 GP/hour for hour tasks, 10,000 GP/day up to 10 days; GM may halve/waive or adjust based on alignment/risk).",
      "Returns to home plane when task completes, agreed duration ends, or if unable to agree on price.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Record contacted cosmic entity and summon appropriate Celestial, Elemental, or Fiend token.",
        "Adjudicate bargaining, task difficulty, and payment (100 GP/min, 1,000 GP/hr, 10,000 GP/day).",
        "Creature departs upon task completion or lack of agreement.",
      ],
    },
    isManualOverride: true,
    notes:
      "10-minute cast. Summons an otherworldly creature (Celestial, Elemental, or Fiend). Creature is not compelled to obey; services require payment negotiated with GM.",
  },

  // Summon Dinosaur (Arcana Unleashed, pg. 43)
  summon_dinosaur: {
    id: "summon_dinosaur",
    name: "Summon Dinosaur",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 6,
      classes: ["druid"],
      source: "Arcana Unleashed, pg. 43",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "90 ft.",
      components: "V, S, M (a polished scale worth 600+ GP)",
      duration: "Concentration, up to 1 hour",
    },
    interaction: { type: "utility" },
    damage: [
      {
        dice: "2d10 + 5",
        type: "piercing",
        isBase: false,
        condition:
          "Tyrannosaur Bite: reach 10 ft, + spell level, Large or smaller grappled/restrained",
      },
      {
        dice: "1d10 + 5",
        type: "piercing",
        isBase: false,
        condition:
          "Triceratops Gore: reach 5 ft, + spell level (+1d10 and Prone if charged 20+ ft)",
      },
      {
        dice: "1d10 + 5",
        type: "bludgeoning",
        isBase: false,
        condition: "Dinosaur Slam: reach 10 ft, + spell level",
      },
    ],
    upcasting: {
      notes:
        "Use the spell slot's level for the spell's level in the stat block (AC: 11 + level [+2 Ankylosaur]; HP: 60 + 10 per level above 6; attacks = half level round down; damage adds spell level; Tough bonus = half level round down)",
    },
    effectNotes: [
      "Summon a Dinosaur Spirit (Huge Beast) within 90 feet: choose Ankylosaur, Triceratops, or Tyrannosaur form.",
      "Combat: Shares Initiative count, acts immediately after you. Obeys commands (no action); Dodges if no command.",
      "Stat block: AC 11 + level (+2 Ankylosaur), HP 60 + (10 * level above 6), Speed 40 ft. STR 21 (+5), DEX 11 (+0), CON 15 (+2), INT 4 (-3), WIS 12 (+1), CHA 9 (-1).",
      "Tough: Add half spell level (round down) to STR and CON saves. Siege Monster (Ankylosaur): Double damage to structures.",
      "Multiattack: Makes attacks equal to half spell level (round down).",
      "Bite (Tyrannosaur): Reach 10 ft. Hit: 2d10 + 5 + spell level Piercing, and Large or smaller target is Grappled and Restrained.",
      "Gore (Triceratops): Reach 5 ft. Hit: 1d10 + 5 + spell level Piercing (+1d10 extra and Prone on 20+ ft charge).",
      "Slam: Reach 10 ft. Hit: 1d10 + 5 + spell level Bludgeoning.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Verify 600+ GP polished scale focus.",
        "Summon Huge Dinosaur Spirit (Ankylosaur, Triceratops, or Tyrannosaur form).",
        "Scale stats by spell slot level (AC 11+level, HP 60+10*(level-6), multiattack = floor(level/2), damage bonus = 5 + level).",
        "Resolve special actions: Tyrannosaur grapple/restrain, Triceratops charge gore, or Ankylosaur siege slam.",
      ],
    },
    isManualOverride: true,
    notes:
      "Arcana Unleashed, pg. 43. Conc up to 1 hour, 600+ GP scale. Summons Huge Dinosaur Spirit (Ankylosaur, Triceratops, or Tyrannosaur). Scales HP, AC, multiattack, and damage by spell slot level.",
  },

  summon_fiend: {
    id: "summon_fiend",
    name: "Summon Fiend",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 6,
      classes: ["warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 326",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "90 ft.",
      components: "V, S, M (humanoid blood and a ruby worth 600+ GP)",
      duration: "Concentration, up to 1 hour",
    },
    interaction: { type: "utility" },
    damage: [{ dice: "1d12+3", type: "fire", isBase: true }],
    upcasting: {
      notes:
        "AC equals 12 + spell level; HP equals 50 + 15 per level above 6th; attacks equal half spell level (rounded down)",
    },
    effectNotes: [
      "You call forth a Fiendish Spirit in an unoccupied space within range. Choose its form: Demon, Devil, or Yugoloth.",
      "The creature is an ally that takes its turn immediately after yours.",
      "AC: 12 + spell level. HP: 50 + 15 for each level above 6th. Attacks: half spell level (rounded down).",
      "Demon has Bite (1d12 + 3 + slot level Fire) and Death Throes (bursts into fire upon death). Devil has Hurl Flame (ranged 2d6 + 3 + slot level Fire) and Devil's Sight. Yugoloth has Claws (1d10 + 3 + slot level Slashing) and Teleportation (Bonus Action 30 ft).",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Summon Fiendish Spirit within 90 ft and pick form (Demon/Devil/Yugoloth).",
        "Track HP (50 + 15 per slot level above 6) and AC (12 + slot level).",
        "Spirit takes turn immediately after caster.",
      ],
    },
    isManualOverride: true,
    notes:
      "Player's Handbook (2024). Marked for detailed verification against printed book/DDB. In 2024 PHB, standardized summon spell (Warlock, Wizard). Fiendish Spirit (Demon, Devil, Yugoloth); acts immediately after caster.",
  },

  tashas_bubbling_cauldron: {
    id: "tashas_bubbling_cauldron",
    name: "Tasha's Bubbling Cauldron",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 6,
      classes: ["warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 330",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "5 ft.",
      components: "V, S, M (a gilded ladle worth 500+ GP)",
      duration: "10 minutes",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "You conjure a claw-footed cauldron in an unoccupied space within 5 feet.",
      "The cauldron is filled with a bubbling liquid replicating a Common or Uncommon potion of your choice.",
      "It produces a number of potions equal to your spellcasting ability modifier (minimum 1).",
      "As a Bonus Action, you or an ally can withdraw one potion from the cauldron. The potion disappears when consumed.",
      "The cauldron disappears when the spell ends, all potions are withdrawn, or you cast this spell again (at which point any unconsumed potions disappear).",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Conjure cauldron within 5 ft and choose Common or Uncommon potion.",
        "Track potion count (equal to spellcasting ability modifier).",
        "Caster or ally can withdraw a potion as a Bonus Action; unconsumed potions vanish after 10 min.",
      ],
    },
    isManualOverride: true,
    notes:
      "Player's Handbook (2024). Marked for detailed verification against printed book/DDB. New 2024 spell (Warlock, Wizard). Conjures a cauldron producing Common/Uncommon potions equal to spellcasting ability mod.",
  },

  transport_via_plants: {
    id: "transport_via_plants",
    name: "Transport via Plants",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 6,
      classes: ["druid"],
      source: "Player's Handbook (2024), pg. 334",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "10 feet",
      components: "V, S",
      duration: "1 minute",
    },
    damage: [],
    effectNotes: [
      "Creates a magical link between a Large or larger inanimate plant within 10 feet and another plant on the same plane that you have seen or touched at least once.",
      "For 1 minute, any creature can step into the target plant and exit from the destination plant by using 5 feet of movement.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Target Large or larger plant within 10 feet.",
        "Designate destination plant on same plane previously seen or touched.",
        "Allow creatures to enter origin plant and exit destination plant using 5 feet of movement for 1 minute.",
      ],
    },
    isManualOverride: true,
    notes:
      "1 minute (no concentration). Links Large+ plant to any plant previously seen/touched on same plane. Any creature can step in and exit using 5 ft of movement.",
  },

  wall_of_thorns: {
    id: "wall_of_thorns",
    name: "Wall of Thorns",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 6,
      classes: ["druid"],
      source: "Player's Handbook (2024), pg. 339",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "120 feet",
      components: "V, S, M (a handful of thorns)",
      duration: "Concentration, up to 10 minutes",
    },
    interaction: { type: "save", saveAbility: "DEX" },
    area: { shape: "Wall", sizeFeet: 60, heightFeet: 10, thicknessFeet: 5 },
    damage: [
      {
        dice: "7d8",
        type: "piercing",
        isBase: true,
        condition: "When wall appears (DEX save half)",
      },
      {
        dice: "7d8",
        type: "slashing",
        isBase: false,
        condition:
          "First time entering space in wall on a turn or ending turn there (DEX save half)",
      },
    ],
    upcasting: {
      notes: "+1d8 Piercing and Slashing damage per slot level above 6th",
      perSlotLevel: { dice: "1d8", type: "piercing" },
    },
    effectNotes: [
      "Create a wall of thorny brush up to 60 feet long, 10 feet high, and 5 feet thick, or a circle with 20-foot diameter, 20 feet high, and 5 feet thick. Blocks line of sight.",
      "When the wall appears, each creature in its area makes a Dexterity saving throw, taking 7d8 Piercing damage (half on success).",
      "Moving through costs 4 feet of movement for every 1 foot moved.",
      "First time a creature enters the wall on a turn or ends its turn there: makes a Dexterity saving throw, taking 7d8 Slashing damage (half on success; once per turn).",
      "Using a Higher-Level Spell Slot: Both Piercing and Slashing damage increase by 1d8 for each spell slot level above 6.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Place wall (60x10x5 ft or 20-ft ring) within 120 ft; blocks line of sight.",
        "Prompt DEX save for creatures on appearance (7d8 Piercing, half on save).",
        "Apply difficult terrain (costs 4 ft per 1 ft).",
        "Prompt DEX save for creatures entering wall or ending turn there (7d8 Slashing, half on save).",
        "Upcast: +1d8 Piercing & Slashing per slot level.",
      ],
    },
    isManualOverride: true,
    notes:
      "Concentration up to 10 min. Wall 60x10x5 ft or 20-ft ring. Blocks line of sight. On appearance: DEX save vs 7d8 Piercing (half on save). Moving through costs 4 ft per 1 ft. Entering or ending turn in wall: DEX save vs 7d8 Slashing (half on save). Upcast adds +1d8 to both damages per level.",
  },

  word_of_recall: {
    id: "word_of_recall",
    name: "Word of Recall",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 6,
      classes: ["cleric"],
      source: "Player's Handbook (2024), pg. 343",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "5 feet",
      components: "V",
      duration: "Instantaneous",
    },
    damage: [],
    effectNotes: [
      "You and up to five willing creatures within 5 feet of you instantly teleport to a previously designated sanctuary.",
      "You and allies appear in the nearest unoccupied space to the spot designated when you prepared your sanctuary.",
      "You must designate a location (such as a temple) as a sanctuary by casting this spell there beforehand; casting without a prepared sanctuary has no effect.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Sanctuary setup: Cast spell at location to designate it as sanctuary.",
        "Recall use: Teleport caster and up to 5 willing creatures within 5 feet to prepared sanctuary.",
      ],
    },
    isManualOverride: true,
    notes:
      "Instantly teleports caster and up to 5 willing creatures within 5 feet to a previously designated sanctuary. Requires designating the sanctuary ahead of time by casting the spell there.",
  },

    // Level 7 (5 spells)
    // Conjure Celestial (D&D Free Rules 2024, Spell Descriptions)
  conjure_celestial: {
    id: "conjure_celestial",
    name: "Conjure Celestial",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 7,
      classes: ["cleric"],
      source: "Player's Handbook (2024), pg. 254",
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
    damage: [
      {
        dice: "6d12",
        type: "radiant",
        isBase: true,
        condition: "Searing Light; failed save, half damage on success",
      },
    ],
    upcasting: {
      notes:
        "+1d12 to Healing Light and Searing Light per spell slot level above 7.",
      perSlotLevel: { dice: "1d12" },
    },
    effectNotes: [
      "A spirit manifests as a 10-foot-radius, 40-foot-high Cylinder centered on a point within range. Choose a visible creature in the Cylinder to receive either Healing Light (4d12 + spellcasting modifier HP) or Searing Light (Dexterity save; 6d12 Radiant on failure, half on success).",
      "The Cylinder sheds Bright Light. When you move on your turn, you can move it up to 30 feet. When it moves into a visible creature's space, or a visible creature enters or ends its turn in it, choose one light for that creature. Each creature can be affected only once per turn.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Track the Cylinder, concentration, and once-per-turn limit for each creature. Choose healing or damage per affected target; the formula area preview does not represent Cylinder height or movement, and token HP is not automatically updated.",
      ],
    },
    isManualOverride: true,
    notes:
      "The spell can heal or damage on initial casting and subsequent area triggers. Track selected light per creature and apply the 40-foot Cylinder geometry manually.",
  },

  etherealness: {
    id: "etherealness",
    name: "Etherealness",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 7,
      classes: ["bard", "cleric", "sorcerer", "warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 269",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Self",
      components: "V, S",
      duration: "Up to 8 hours",
    },
    interaction: { type: "utility" },
    damage: [],
    upcasting: {
      notes:
        "Target up to three additional willing creatures (including yourself) per slot level above 7th; each must be within 10 feet when you cast.",
    },
    effectNotes: [
      "Enter the Border Ethereal for the duration. You can move in any direction, but moving vertically costs 1 extra foot per foot; you perceive the plane you left as gray and cannot see more than 60 feet into it.",
      "On the Ethereal Plane, you can affect and be affected only by creatures, objects, and effects there; creatures on other planes cannot perceive or interact with you unless a feature allows it. When the spell ends, return to the corresponding space; if occupied, move to the nearest unoccupied space and take Force damage equal to twice the distance moved in feet.",
      "The spell ends instantly if cast while already on the Ethereal Plane or on a plane that does not border it.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Track affected willing creatures, plane, duration, and vertical movement cost. Adjudicate cross-plane perception, interaction, and effects.",
        "When the spell ends, return each target to its corresponding space; if occupied, find the nearest unoccupied space and apply Force damage equal to twice the distance moved in feet. Check plane restrictions at casting.",
      ],
    },
    isManualOverride: true,
    notes:
      "Planar state and corresponding-space return cannot be represented by ordinary Owlbear token movement alone.",
  },

  mordenkainens_magnificent_mansion: {
    id: "mordenkainens_magnificent_mansion",
    name: "Mordenkainen's Magnificent Mansion",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 7,
      classes: ["bard", "wizard"],
      source: "Player's Handbook (2024), pg. 300",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 minute",
      range: "300 ft.",
      components: "V, S, M (a miniature door worth 15+ GP)",
      duration: "24 hours",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Conjure a shimmering door (5x10 ft.) in range leading to an extradimensional dwelling lasting 24 hours. You and designated creatures can enter while open. You can open/close it (no action) within 30 feet; while closed, it is imperceptible.",
      "Dwelling floor plan can be up to 50 contiguous 10-foot Cubes, decorated and furnished as you choose. Contains sufficient food for a nine-course banquet for up to 100 people. Removed furnishings dissipate into smoke.",
      "Staff of 100 near-transparent, invulnerable servants obey your commands and perform non-harmful human tasks (cleaning, serving, cooking, etc.). Servants cannot leave dwelling.",
      "When spell ends, all occupants and non-native objects are expelled into the nearest unoccupied spaces outside.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Verify miniature door worth 15+ GP. Record entrance portal location and designated allowed creatures.",
        "Manage mansion entry/exit and door state (open/shut, imperceptible when closed within 30 ft).",
        "Track 24-hour duration, banquet food resources, 100 translucent servant activities, and expulsion of all creatures upon spell expiration.",
      ],
    },
    isManualOverride: true,
    notes:
      "Requires a 15+ GP miniature door focus. Creates a 50-cube extradimensional mansion with 100 servants and a banquet for 100 people. Lasts 24 hours; expels occupants when finished.",
  },

  plane_shift: {
    id: "plane_shift",
    name: "Plane Shift",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 7,
      classes: ["cleric", "druid", "sorcerer", "warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 305",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Touch",
      components:
        "V, S, M (a forked metal rod worth 250+ GP attuned to a plane of existence)",
      duration: "Instantaneous",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "You and up to eight willing creatures linking hands are transported to a different plane of existence.",
      "Specify destination in general terms (arrive at or near destination, DM determined) or to a known teleportation circle's sigil sequence.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Verify 250+ GP planar attuned forked rod. Designate up to 8 willing creatures linking hands.",
        "GM adjudicates arrival location on destination plane (or teleportation circle).",
      ],
    },
    isManualOverride: true,
    notes:
      "Requires a 250+ GP planar attuned rod. Transports caster and up to 8 willing hand-linking creatures to another plane of existence (general location or teleportation circle).",
  },

  teleport: {
    id: "teleport",
    name: "Teleport",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 7,
      classes: ["bard", "sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 331",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "10 feet",
      components: "V",
      duration: "Instantaneous",
    },
    damage: [
      {
        dice: "3d10",
        type: "force",
        isBase: true,
        condition: "Each teleporting creature on Mishap",
      },
    ],
    effectNotes: [
      "Instantly transports you and up to 8 willing creatures or a single Large or smaller object within 10 feet to a known destination on the same plane.",
      "DM rolls 1d100 based on familiarity:",
      "- Permanent circle: 01-00 On Target",
      "- Linked object: 01-00 On Target",
      "- Very familiar: 01-05 Mishap, 06-13 Similar Area, 14-24 Off Target, 25-00 On Target",
      "- Seen casually: 01-33 Mishap, 34-43 Similar Area, 44-53 Off Target, 54-00 On Target",
      "- Viewed once or described: 01-43 Mishap, 44-53 Similar Area, 54-73 Off Target, 74-00 On Target",
      "- False destination: 01-50 Mishap, 51-00 Similar Area",
      "Mishap: Each teleporting creature takes 3d10 Force damage and DM rerolls on table.",
      "Off Target: Arrive 2d12 miles away in a random 1d8 direction.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Select up to 8 willing creatures or 1 Large object within 10 feet.",
        "Determine destination familiarity (Permanent Circle, Linked Object, Very Familiar, Seen Casually, Viewed Once, False Destination).",
        "Roll 1d100 on outcome table.",
        "If Mishap, roll 3d10 Force damage for each traveler and reroll.",
      ],
    },
    isManualOverride: true,
    notes:
      "Transports caster and up to 8 willing creatures or 1 Large object to known destination on same plane. 1d100 roll for outcome: On Target, Off Target (2d12 miles), Similar Area, or Mishap (3d10 Force damage each + reroll).",
  },

    // Level 8 (4 spells)
    demiplane: {
    id: "demiplane",
    name: "Demiplane",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 8,
      classes: ["sorcerer", "warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 261",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "60 ft.",
      components: "S",
      duration: "1 hour",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Create a shadowy Medium door on a visible flat, solid surface within range. It leads to an empty 30-foot room of wood or stone. You can create a new demiplane or connect to one created by this spell previously, including another caster's demiplane if you know its nature and contents.",
      "When the spell ends, the door vanishes; objects remain inside. Creatures remain unless they choose to be shunted to the nearest unoccupied space by the former door, landing Prone.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Track the door, selected/new demiplane, contents, and 1-hour duration. When it ends, resolve each creature's choice to remain or be shunted and become Prone; record contents separately from map tokens.",
      ],
    },
    isManualOverride: true,
    notes:
      "The room persists as a demiplane; ending the spell removes the door but does not eject its contents automatically.",
  },

  incendiary_cloud: {
    id: "incendiary_cloud",
    name: "Incendiary Cloud",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 8,
      classes: ["druid", "sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 288",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "150 ft. (20-ft. radius)",
      components: "V, S",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "save", saveAbility: "DEX" },
    area: { shape: "Sphere", sizeFeet: 20 },
    damage: [{ dice: "10d8", type: "fire", isBase: true }],
    effectNotes: [
      "A 20-foot-radius Sphere of embers and smoke is Heavily Obscured. When it appears, each creature inside makes a Dexterity save, taking 10d8 Fire damage on a failure or half on a success. A creature also saves when the Sphere moves into its space, when it enters the Sphere, or ends its turn there; a creature saves at most once per turn.",
      "At the start of each of your turns, the cloud moves 10 feet in a direction you choose. A strong wind can disperse it.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Place and track the 20-foot-radius Heavily Obscured Sphere and concentration. At initial appearance and when it moves into a creature's space, entering, or ending a turn there, resolve Dexterity saves; limit each creature to one save per turn.",
        "At the start of the caster's turns, move the cloud 10 feet in a chosen direction. A strong wind can disperse it; resolve full/half Fire damage and movement manually.",
      ],
    },
    isManualOverride: true,
    notes:
      "Save triggers can overlap; each creature makes the save only once per turn. The cloud's movement occurs at the start of the caster's turn.",
  },

  maze: {
    id: "maze",
    name: "Maze",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 8,
      classes: ["wizard"],
      source: "Player's Handbook (2024), pg. 296",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "60 ft.",
      components: "V, S",
      duration: "Concentration, up to 10 minutes",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Banish a visible creature within 60 feet into a labyrinthine demiplane. The target remains there for the duration or until it escapes (no initial saving throw).",
      "The target can take a Study action on its turn to make a DC 20 Intelligence (Investigation) check; success escapes and ends the spell.",
      "When the spell ends, the target reappears in the space it left or the nearest unoccupied space.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Banish the target token from the scene to the demiplane; track concentration up to 10 minutes.",
        "On the target's turn, it can use a Study action for a DC 20 Intelligence (Investigation) check to escape.",
        "When the spell ends, return the target token to its original or nearest unoccupied space.",
      ],
    },
    isManualOverride: true,
    notes:
      "Automatic banishment without an initial save. Escape requires a Study action with a DC 20 Intelligence (Investigation) check.",
  },

  tsunami: {
    id: "tsunami",
    name: "Tsunami",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 8,
      classes: ["druid"],
      source: "Player's Handbook (2024), pg. 336",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 minute",
      range: "1 mile",
      components: "V, S",
      duration: "Concentration, up to 6 rounds",
    },
    interaction: { type: "save", saveAbility: "STR" },
    area: { shape: "Wall", sizeFeet: 300, heightFeet: 300, thicknessFeet: 50 },
    damage: [
      {
        dice: "6d10",
        type: "bludgeoning",
        isBase: true,
        condition: "When wall appears on failed STR save (half on success)",
      },
      {
        dice: "5d10",
        type: "bludgeoning",
        isBase: false,
        condition:
          "At start of turn when wall moves 50 ft into or through creature (STR save)",
      },
    ],
    effectNotes: [
      "A wall of water up to 300 feet long, 300 feet high, and 50 feet thick springs into existence within 1 mile.",
      "When wall appears, each creature in its area makes a Strength saving throw, taking 6d10 Bludgeoning damage (half on success).",
      "At start of caster's turns, wall moves 50 feet away from caster carrying creatures. Huge or smaller creature inside or entered by wall makes a Strength saving throw or takes 5d10 Bludgeoning damage (max once per round).",
      "At end of turn, wall height reduces by 50 feet and damage reduces by 1d10. Ends when height reaches 0 feet.",
      "Creatures can swim with DC Strength (Athletics) check; falling when leaving wall.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Place wall of water up to 300 ft long, 300 ft high, 50 ft thick within 1 mile.",
        "Prompt STR save for creatures in initial area (6d10 Bludgeoning, half on save).",
        "Each round, advance wall 50 ft away from caster; prompt STR save for caught creatures (damage decrements by 1d10 each round, height -50 ft).",
        "Allow Strength (Athletics) check to swim.",
      ],
    },
    isManualOverride: true,
    notes:
      "1-minute cast, conc up to 6 rounds. Wall of water up to 300x300x50 ft within 1 mile. Initial STR save: 6d10 Bludgeoning (half on save). Moves 50 ft away each round dealing damage (starts at 5d10, reduces by 1d10/round) and reducing height by 50 ft until 0 ft.",
  },

    // Level 9 (4 spells)
    blade_of_disaster: {
    id: "blade_of_disaster",
    name: "Blade of Disaster",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 9,
      classes: ["sorcerer", "warlock", "wizard"],
      source: "Forgotten Realms: Heroes of Faerûn, pg. 143",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 bonus action",
      range: "60 ft.",
      components: "V, S",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "melee_spell_attack" },
    damage: [
      {
        dice: "10d6",
        type: "force",
        isBase: true,
        condition: "On hit with melee spell attack",
      },
      {
        dice: "20d6",
        type: "force",
        isBase: false,
        condition:
          "Critical hit on a roll of 18-20 (deals extra 20d6 Force damage)",
      },
    ],
    effectNotes: [
      "Create a 3-foot blade-shaped planar rift within 60 feet lasting up to 1 minute with concentration.",
      "Immediately make up to two melee spell attacks against a creature or object within 5 feet of the blade.",
      "On a hit: deals 10d6 Force damage. Critical Hit: scores a crit on a d20 roll of 18–20, dealing 20d6 Force damage.",
      "As a Bonus Action on subsequent turns: move the blade up to 60 feet and repeat the two melee spell attacks.",
      "Harmlessly passes through any barrier, including a Wall of Force.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Place blade token within 60 ft.",
        "Make 2 melee spell attacks within 5 ft of blade (10d6 Force each, crits on 18-20 for 20d6 Force).",
        "On later turns, use Bonus Action to move up to 60 ft and attack twice again.",
        "Bypasses all barriers including Wall of Force.",
      ],
    },
    isManualOverride: true,
    notes:
      "Forgotten Realms: Heroes of Faerûn, pg. 143. 9th level Bonus Action, conc up to 1 min. Makes 2 melee spell attacks for 10d6 Force each. Crits on 18-20 dealing 20d6 Force. Move 60 ft and attack twice on subsequent turns with Bonus Action. Bypasses Wall of Force.",
  },

  gate: {
    id: "gate",
    name: "Gate",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 9,
      classes: ["cleric", "sorcerer", "warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 277",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "60 ft.",
      components: "V, S, M (a diamond worth 5,000+ GP)",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Create a 5-to-20-foot-diameter portal at a visible unoccupied space within range, linking it to a precise location on another plane; the destination is visible and the portal has a front and back on each plane. Only passage through its front transports a creature to the nearest unoccupied space on the other plane.",
      "A deity or planar ruler can prevent a portal opening in its presence or domain. When cast, you may name a specific creature on another plane; the portal opens beside it and transports it to the nearest unoccupied space on your side. The creature is not controlled and may act as the GM decides.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Record the exact destination plane/location, portal size/orientation, front/back, and concentration. GM confirms whether planar powers prevent the portal.",
        "Resolve which creatures pass through the portal's front and where they appear. If naming a creature, verify its plane and identity; it is transported but remains free to act.",
      ],
    },
    isManualOverride: true,
    notes:
      "Planar destination and movement through a two-sided portal require GM adjudication and cannot be represented by ordinary distance targeting.",
  },

  storm_of_vengeance: {
    id: "storm_of_vengeance",
    name: "Storm of Vengeance",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 9,
      classes: ["druid"],
      source: "Player's Handbook (2024), pg. 320",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "1 mile",
      components: "V, S",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "save", saveAbility: "CON" },
    area: { shape: "Cylinder", sizeFeet: 300 },
    damage: [
      {
        dice: "2d6",
        type: "thunder",
        isBase: true,
        condition: "Turn 1: Thunder on failed CON save",
      },
    ],
    effectNotes: [
      "Create a 300-foot-radius storm cloud within 1 mile lasting up to 1 minute (10 rounds) with concentration.",
      "Turn 1: CON save or take 2d6 Thunder damage and Deafened for duration.",
      "Turn 2: Acid rain deals 4d6 Acid damage to each creature and object under cloud.",
      "Turn 3: Call six lightning bolts (10d6 Lightning each, DEX save half; max 1 bolt per creature).",
      "Turn 4: Hailstones deal 2d6 Bludgeoning damage to each creature under cloud.",
      "Turns 5-10: Freezing rain deals 1d6 Cold damage each turn; area is Heavily Obscured and Difficult Terrain.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Place 300-ft radius storm cloud within 1 mile; track concentration and round count (1 to 10).",
        "Round 1: prompt CON save vs 2d6 Thunder and Deafened.",
        "Round 2: deal 4d6 Acid to all in area. Round 3: target up to 6 creatures with 10d6 Lightning (DEX save half).",
        "Round 4: deal 2d6 Bludgeoning to all in area. Rounds 5-10: deal 1d6 Cold and apply Heavily Obscured / Difficult Terrain.",
      ],
    },
    isManualOverride: true,
    notes:
      "1-mile range, 300-ft radius cloud, concentration up to 1 minute. Multi-stage weather apocalypse: R1 2d6 Thunder + Deafened, R2 4d6 Acid, R3 6x 10d6 Lightning bolts, R4 2d6 Bludgeoning hail, R5-10 1d6 Cold + Heavily Obscured + Difficult Terrain.",
  },

  wish: {
    id: "wish",
    name: "Wish",
    category: {
      spellType: "spell",
      school: "conjuration",
      level: 9,
      classes: ["sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 341",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Self",
      components: "V",
      duration: "Instantaneous",
    },
    damage: [],
    effectNotes: [
      "The mightiest mortal spell: alter reality itself.",
      "Basic use: Duplicate any spell of level 8 or lower without meeting requirements or component costs.",
      "Alternative options:",
      "- Object Creation: Nonmagical object up to 25,000 GP value, up to 300 ft in size.",
      "- Instant Health: Self and up to 20 creatures regain all HP + Greater Restoration.",
      "- Resistance: Up to 10 creatures gain permanent Resistance to one damage type.",
      "- Spell Immunity: Up to 10 creatures gain 8-hour immunity to a specific spell or magical effect.",
      "- Sudden Learning: Swap one feat for another eligible feat.",
      "- Roll Redo: Force a reroll (with Advantage or Disadvantage) of any die roll made within the last round.",
      "- Reshape Reality: State custom wish to the DM.",
      "Stress of non-duplication: 1d10 Necrotic damage per spell slot level cast until Long Rest (unpreventable), Strength becomes 3 for 2d4 days, and 33% chance of permanently losing the ability to cast Wish.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Basic use: Duplicate any level 8 or lower spell instantly without component requirements.",
        "Alternative use: Object Creation (25k GP), Instant Health (20 creatures full heal), Permanent Resistance (10 creatures), Spell Immunity (10 creatures 8 hrs), Sudden Learning (feat swap), Roll Redo (reroll last round), or Reshape Reality.",
        "If alternative used, apply Wish stress: unpreventable 1d10 Necrotic/slot cast until Long Rest, STR=3 for 2d4 days, and roll 1d100 for 33% chance to lose Wish.",
      ],
    },
    isManualOverride: true,
    notes:
      "Instantaneous. Duplicates any level 8 or lower spell without components. Alternative effects: 25k GP object, full heal 20 creatures, permanent resistance for 10, spell immunity 8 hrs, feat swap, reroll within last round, or custom GM wish. Alternative uses cause severe casting stress, STR drops to 3, and 33% permanent loss chance.",
  },
};
