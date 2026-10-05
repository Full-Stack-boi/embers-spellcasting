/**
 * Manual Spell Formula Overrides — Necromancy (Leveled Spells 1st–9th)
 */

import type { SpellFormula } from "../../../types/spellFormula";

export const necromancySpellOverrides: Record<string, SpellFormula> = {
    // Level 1 (4 spells)
    // False Life (D&D Free Rules 2024, Spell Descriptions)
  false_life: {
    id: "false_life",
    name: "False Life",
    category: {
      spellType: "spell",
      school: "necromancy",
      level: 1,
      classes: ["sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 271",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Self",
      components: "V, S, M (a drop of alcohol)",
      duration: "Instantaneous",
    },
    interaction: { type: "utility" },
    damage: [],
    upcasting: {
      notes:
        "Gain 5 additional Temporary Hit Points per spell slot level above 1st.",
    },
    effectNotes: ["You gain 2d4 + 4 Temporary Hit Points."],
    isManualOverride: true,
    notes:
      "Roll and track Temporary Hit Points manually; they are not added as ordinary Hit Points.",
  },

  // Inflict Wounds (D&D Free Rules 2024, Spell Descriptions)
  inflict_wounds: {
    id: "inflict_wounds",
    name: "Inflict Wounds",
    category: {
      spellType: "spell",
      school: "necromancy",
      level: 1,
      classes: ["cleric"],
      source: "Player's Handbook (2024), pg. 288",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Touch",
      components: "V, S",
      duration: "Instantaneous",
    },
    interaction: { type: "save", saveAbility: "CON" },
    damage: [{ dice: "2d10", type: "necrotic", isBase: true }],
    upcasting: {
      notes: "+1d10 necrotic damage per spell slot level above 1st",
      perSlotLevel: { dice: "1d10", type: "necrotic" },
    },
    effectNotes: [
      "The target makes a Constitution save, taking the damage on a failed save or half as much on a successful one.",
    ],
    isManualOverride: true,
    notes:
      "Resolve half damage on a successful save using the normal table rounding rule.",
  },

  ray_of_sickness: {
    id: "ray_of_sickness",
    name: "Ray of Sickness",
    category: {
      spellType: "spell",
      school: "necromancy",
      level: 1,
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
    interaction: { type: "spell_attack" },
    damage: [{ dice: "2d8", type: "poison", isBase: true }],
    upcasting: {
      notes: "+1d8 Poison damage per slot level above 1st",
      perSlotLevel: { dice: "1d8", type: "poison" },
    },
    effectNotes: [
      "Make a ranged spell attack against a creature within 60 feet.",
      "On a hit, the target takes 2d8 Poison damage and automatically gains the Poisoned condition until the end of your next turn (no save in 2024 rules).",
      "Using a Higher-Level Spell Slot: damage increases by 1d8 for each spell slot level above 1.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Make ranged spell attack roll vs AC.",
        "On a hit, apply 2d8 Poison damage (+1d8 per upcast level) and apply Poisoned condition until end of caster's next turn.",
      ],
    },
    isManualOverride: true,
    notes:
      "Ranged spell attack. 2d8 Poison damage (+1d8 per upcast level). 2024 revision: on hit, target is automatically Poisoned until end of your next turn without a saving throw.",
  },

  wrathful_smite: {
    id: "wrathful_smite",
    name: "Wrathful Smite",
    category: {
      spellType: "spell",
      school: "necromancy",
      level: 1,
      classes: ["paladin"],
      source: "Player's Handbook (2024), pg. 343",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 bonus action",
      range: "Self",
      components: "V",
      duration: "1 minute",
    },
    interaction: { type: "save", saveAbility: "WIS" },
    damage: [{ dice: "1d6", type: "necrotic", isBase: true }],
    upcasting: {
      perSlotLevel: { dice: "1d6", type: "necrotic" },
      notes: "+1d6 Necrotic damage per slot level above 1st",
    },
    effectNotes: [
      "You cast this spell immediately after you hit a creature with a melee weapon or an Unarmed Strike.",
      "The target takes an extra 1d6 Necrotic damage and must make a Wisdom saving throw.",
      "On a failed save, the target has the Frightened condition until the spell ends.",
      "At the end of each of its turns, the Frightened target repeats the Wisdom saving throw, ending the spell on a success.",
      "Using a Higher-Level Spell Slot: The extra damage increases by 1d6 for each spell slot level above 1.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Cast as Bonus Action immediately after melee hit.",
        "Apply 1d6 Necrotic damage (+1d6 per slot level above 1).",
        "Prompt Wisdom save.",
        "On failed save: apply Frightened condition for 1 min (no concentration). Target repeats save at end of each of its turns.",
      ],
    },
    isManualOverride: true,
    notes:
      "Player's Handbook (2024). Marked for detailed verification against printed book/DDB. In 2024, Bonus Action on hit; concentration removed entirely; damage type changed to Necrotic (from Psychic). Frightened target repeats WIS save at end of its turns.",
  },

    // Level 2 (4 spells)
    death_armor: {
    id: "death_armor",
    name: "Death Armor",
    category: {
      spellType: "spell",
      school: "necromancy",
      level: 2,
      classes: ["sorcerer", "wizard"],
      source: "Forgotten Realms: Heroes of Faerûn, pg. 143",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Touch",
      components: "V, S, M (an onyx worth 50+ GP, which the spell consumes)",
      duration: "1 hour",
    },
    interaction: { type: "utility" },
    damage: [
      {
        dice: "2d4",
        type: "necrotic",
        isBase: true,
        condition:
          "Retaliation damage when hit by a melee attack within 5 ft (once per turn)",
      },
    ],
    effectNotes: [
      "An inky aura surrounds one creature you touch for 1 hour without concentration.",
      "Consumes an onyx worth 50+ GP.",
      "Target has Advantage on Death Saving Throws.",
      "Retaliation: Once per turn, when a creature within 5 feet hits the target with a melee attack roll, the attacker takes 2d4 Necrotic damage.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Verify 50+ GP onyx is consumed. Touch target.",
        "Grant Advantage on Death Saving Throws for 1 hour (no concentration).",
        "Trigger 2d4 Necrotic retaliation damage once per turn when attacker within 5 ft hits target with melee attack.",
      ],
    },
    isManualOverride: true,
    notes:
      "Forgotten Realms: Heroes of Faerûn, pg. 143. Consumes 50+ GP onyx. 1 hour (no concentration). Touched target gains Advantage on Death Saving Throws and deals 2d4 Necrotic retaliation damage to adjacent melee attackers once per turn.",
  },

  // Gentle Repose (D&D Free Rules 2024, Spell Descriptions)
  gentle_repose: {
    id: "gentle_repose",
    name: "Gentle Repose",
    category: {
      spellType: "spell",
      school: "necromancy",
      level: 2,
      classes: ["cleric", "paladin", "wizard"],
      source: "Player's Handbook (2024), pg. 278",
      concentration: false,
      ritual: true,
    },
    casting: {
      time: "1 action or Ritual",
      range: "Touch",
      components: "V, S, M (2 copper pieces, consumed)",
      duration: "10 days",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Protect a corpse or remains from decay and prevent it from becoming Undead for the duration. Days under this spell don't count against the time limit for spells that raise the dead.",
    ],
    isManualOverride: true,
    notes:
      "Record the protected remains and expiry; track the extended resurrection time limit at the table.",
  },

  ray_of_enfeeblement: {
    id: "ray_of_enfeeblement",
    name: "Ray of Enfeeblement",
    category: {
      spellType: "spell",
      school: "necromancy",
      level: 2,
      classes: ["warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 311",
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
    damage: [],
    effectNotes: [
      "Constitution saving throw against beam of enervating energy within 60 feet.",
      "Successful save: target has Disadvantage on the next attack roll it makes until start of your next turn.",
      "Failed save: target has Disadvantage on Strength-based D20 Tests for the duration, and subtracts 1d8 from all its damage rolls.",
      "Target repeats the Constitution saving throw at the end of each of its turns, ending the spell on a success.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Prompt Constitution saving throw from target within 60 feet.",
        "On success: flag Disadvantage on next attack roll until start of caster's next turn.",
        "On failure: track Disadvantage on Strength D20 Tests and -1d8 damage reduction; prompt recurring CON save at end of each target turn.",
      ],
    },
    isManualOverride: true,
    notes:
      "2024 revision: Constitution saving throw (not an attack roll). Success: Disadvantage on next attack until start of next turn. Failure: Disadvantage on Strength D20 Tests and -1d8 to all damage rolls (repeats save at end of each turn).",
  },

  // Wither and Bloom (Arcana Unleashed, pg. 45)
  wither_and_bloom: {
    id: "wither_and_bloom",
    name: "Wither and Bloom",
    category: {
      spellType: "spell",
      school: "necromancy",
      level: 2,
      classes: ["druid", "sorcerer", "wizard"],
      source: "Arcana Unleashed, pg. 45",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "60 ft.",
      components: "V, S, M (a withered vine twisted into a loop)",
      duration: "Instantaneous",
    },
    interaction: { type: "save", saveAbility: "CON" },
    area: { shape: "Sphere", sizeFeet: 10 },
    damage: [
      {
        dice: "3d6",
        type: "necrotic",
        isBase: true,
        condition:
          "Chosen creatures in 10-ft sphere: Constitution save (half on success)",
      },
    ],
    upcasting: {
      perSlotLevel: { dice: "1d6", type: "necrotic" },
      notes:
        "Damage increases by 1d6 for each spell slot level above 2. Number of Hit Point Dice rolled increases by 1 per slot level above 2.",
    },
    effectNotes: [
      "Evoke death and life in a 10-foot-radius Sphere centered on a point within 60 feet. Nonmagical plants in area wither.",
      "Wither: Each creature of your choice in the area makes a Constitution saving throw: takes 3d6 Necrotic damage on failure, half on success.",
      "Bloom Healing: One creature of your choice in the area can roll one of its unexpended Hit Point Dice and regain HP equal to the roll plus your spellcasting ability modifier (die is expended).",
      "Using a Higher-Level Spell Slot: Damage increases by 1d6 per slot level above 2, and the healing creature can roll 1 additional Hit Point Die per slot level above 2 (modifier added only once).",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Place 10-ft radius Sphere within 60 ft.",
        "Prompt Constitution save for chosen creatures: 3d6 Necrotic (half on success).",
        "Choose 1 creature in area to expend 1 Hit Point Die (+1 per upcast level) and heal total + caster modifier.",
      ],
    },
    isManualOverride: true,
    notes:
      "Arcana Unleashed, pg. 45. 60 ft, 10-ft radius Sphere. CON save for chosen creatures vs 3d6 Necrotic (half on success). 1 creature in area can expend Hit Die to heal roll + caster modifier. Upcast +1d6 Necrotic, +1 Hit Die.",
  },

    // Level 3 (7 spells)
    // Animate Dead (D&D Free Rules 2024, Spell Descriptions)
  animate_dead: {
    id: "animate_dead",
    name: "Animate Dead",
    category: {
      spellType: "spell",
      school: "necromancy",
      level: 3,
      classes: ["cleric", "wizard"],
      source: "Player's Handbook (2024), pg. 240",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 minute",
      range: "10 ft.",
      components:
        "V, S, M (a drop of blood, a piece of flesh, and a pinch of bone dust)",
      duration: "Instantaneous",
    },
    interaction: { type: "utility" },
    damage: [],
    upcasting: {
      notes:
        "Animate or reassert control over two additional Undead for each slot level above 3; each comes from a different corpse or pile of bones.",
    },
    effectNotes: [
      "Choose bones or a corpse of a Small or Medium Humanoid to create a Skeleton or Zombie, using the relevant creature stat block. You can mentally command creatures you created with a Bonus Action on your turn while within 60 feet; if given no command, they Dodge and avoid harm.",
      "Control lasts 24 hours. Recasting before it ends renews control rather than creating a new creature; one casting can reassert control over up to four creatures.",
    ],
    isManualOverride: true,
    notes:
      "Create or select the relevant stat block, track each creature and 24-hour control expiry, and issue commands manually.",
  },

  // Bestow Curse (D&D Free Rules 2024, Spell Descriptions)
  bestow_curse: {
    id: "bestow_curse",
    name: "Bestow Curse",
    category: {
      spellType: "spell",
      school: "necromancy",
      level: 3,
      classes: ["bard", "cleric", "wizard"],
      source: "Player's Handbook (2024), pg. 246",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Touch",
      components: "V, S",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "save", saveAbility: "WIS" },
    damage: [
      {
        dice: "1d8",
        type: "necrotic",
        isBase: false,
        condition:
          "If you damage the cursed target with an attack roll or spell",
      },
    ],
    upcasting: {
      notes:
        "Level 4: Concentration up to 10 minutes. Level 5-6: no Concentration, duration 8 hours. Level 7-8: no Concentration, duration 24 hours. Level 9: lasts until dispelled.",
    },
    effectNotes: [
      "On a failed Wisdom save, curse the target and choose one: Disadvantage on checks/saves using one ability; Disadvantage on attacks against you; at the start of each of its turns, a failed Wisdom save forces it to Dodge; or your attacks/spells deal an extra 1d8 Necrotic damage to it.",
    ],
    isManualOverride: true,
    notes:
      "Track the chosen curse, its target and duration. The recurring Wisdom save applies only to the Dodge option; the damage rider applies to your attacks and spells.",
  },

  feign_death: {
    id: "feign_death",
    name: "Feign Death",
    category: {
      spellType: "spell",
      school: "necromancy",
      level: 3,
      classes: ["bard", "cleric", "druid", "wizard"],
      source: "Player's Handbook (2024), pg. 271",
      concentration: false,
      ritual: true,
    },
    casting: {
      time: "1 action",
      range: "Touch",
      components: "V, S, M (a pinch of graveyard dirt)",
      duration: "1 hour",
    },
    damage: [],
    effectNotes: [
      "You touch a willing creature, putting it into a cataleptic state that is indistinguishable from death.",
      "For the duration, the target appears dead to all outward inspection and to spells used to determine status.",
      "The target has the Blinded and Incapacitated conditions, and its Speed is 0.",
      "The target has Resistance to all damage except Psychic damage, and Immunity to the Poisoned condition. If diseased or poisoned when cast, the effect is suspended for the duration.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Touch willing creature.",
        "Apply Blinded and Incapacitated conditions and set Speed to 0.",
        "Grant Resistance to all damage except Psychic, and Immunity to Poisoned condition.",
      ],
    },
    isManualOverride: true,
    notes:
      "Player's Handbook (2024). Marked for detailed verification against printed book/DDB. In 2024, explicitly grants Immunity to the Poisoned condition and suspends ongoing poison/disease.",
  },

  revivify: {
    id: "revivify",
    name: "Revivify",
    category: {
      spellType: "spell",
      school: "necromancy",
      level: 3,
      classes: ["cleric", "druid", "paladin", "ranger"],
      source: "Player's Handbook (2024), pg. 312",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Touch",
      components: "V, S, M (a diamond worth 300+ GP, which the spell consumes)",
      duration: "Instantaneous",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Touch a creature that has died within the last minute.",
      "The creature revives with 1 Hit Point.",
      "Cannot revive a creature that died of old age, nor does it restore missing body parts.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Verify 300+ GP diamond is consumed. Touch target dead <= 1 minute (not old age).",
        "Revive target with 1 Hit Point. Missing body parts are not restored.",
      ],
    },
    isManualOverride: true,
    notes:
      "1 action touch, consumes 300+ GP diamond. Revives creature dead within the last minute with 1 HP. Does not work on old age or restore missing body parts.",
  },

  speak_with_dead: {
    id: "speak_with_dead",
    name: "Speak with Dead",
    category: {
      spellType: "spell",
      school: "necromancy",
      level: 3,
      classes: ["bard", "cleric", "wizard"],
      source: "Player's Handbook (2024), pg. 318",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "10 ft.",
      components: "V, S, M (burning incense)",
      duration: "10 minutes",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Grant semblance of life to a corpse with a mouth within 10 feet lasting 10 minutes without concentration.",
      "Fails if deceased was Undead when it died, or was targeted by Speak with Dead within the past 10 days.",
      "Ask up to five questions. Answers are brief, cryptic, or repetitive; corpse is not compelled to answer truthfully to enemies.",
      "Does not return the soul and corpse knows only what it knew in life.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Target corpse within 10 ft (must have mouth, not Undead at death, not targeted within 10 days).",
        "Track up to 5 questions over 10 minutes (no concentration); adjudicate cryptic/hostile answers.",
      ],
    },
    isManualOverride: true,
    notes:
      "10 ft range, 10 minutes (no concentration). Ask up to 5 questions to a non-Undead corpse (10-day cooldown). Answers reflect life knowledge and corpse can mislead enemies.",
  },

  summon_undead: {
    id: "summon_undead",
    name: "Summon Undead",
    category: {
      spellType: "spell",
      school: "necromancy",
      level: 3,
      classes: ["warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 328",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "90 ft.",
      components: "V, S, M (a gilded skull worth 300+ GP)",
      duration: "Concentration, up to 1 hour",
    },
    interaction: { type: "utility" },
    damage: [{ dice: "1d8+3", type: "necrotic", isBase: true }],
    upcasting: {
      notes:
        "AC equals 11 + spell level; HP equals 30 + 10 per level above 3rd; attacks equal half spell level (rounded down)",
    },
    effectNotes: [
      "You call forth an Undead Spirit in an unoccupied space within range. Choose its form: Ghostly, Putrid, or Skeletal.",
      "The creature is an ally that takes its turn immediately after yours.",
      "AC: 11 + spell level. HP: 30 + 10 for each level above 3rd. Attacks: half spell level (rounded down).",
      "Ghostly has Deathly Touch (1d8 + 3 + slot level Necrotic, WIS save vs Frightened) and Incorporeal Passage. Putrid has Rotting Claw (1d6 + 3 + slot level Slashing, CON save vs Poisoned/Paralyzed) and Festering Aura. Skeletal has Grave Bolt (ranged 2d4 + 3 + slot level Necrotic).",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Summon Undead Spirit within 90 ft and pick form (Ghostly/Putrid/Skeletal).",
        "Track HP (30 + 10 per slot level above 3) and AC (11 + slot level).",
        "Spirit takes turn immediately after caster.",
      ],
    },
    isManualOverride: true,
    notes:
      "Player's Handbook (2024). Marked for detailed verification against printed book/DDB. In 2024 PHB, standardized summon spell (Warlock, Wizard). Undead Spirit (Ghostly, Putrid, Skeletal); acts immediately after caster.",
  },

  vampiric_touch: {
    id: "vampiric_touch",
    name: "Vampiric Touch",
    category: {
      spellType: "spell",
      school: "necromancy",
      level: 3,
      classes: ["sorcerer", "warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 337",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Self",
      components: "V, S",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "melee_spell_attack" },
    damage: [
      {
        dice: "3d6",
        type: "necrotic",
        isBase: true,
        condition:
          "On hit; caster regains HP equal to half necrotic damage dealt",
      },
    ],
    upcasting: {
      notes: "+1d6 Necrotic damage per slot level above 3rd",
      perSlotLevel: { dice: "1d6", type: "necrotic" },
    },
    effectNotes: [
      "Make a melee spell attack against one creature within reach.",
      "On a hit, the target takes 3d6 Necrotic damage, and you regain Hit Points equal to half the Necrotic damage dealt.",
      "Until the spell ends, you can make the attack again on each of your turns as a Magic action.",
      "Using a Higher-Level Spell Slot: Damage increases by 1d6 for each spell slot level above 3.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Make melee spell attack against target within reach.",
        "On hit, roll 3d6 Necrotic damage (+1d6/level upcast) and heal caster for half.",
        "Repeat attack as a Magic action on each turn while concentrating.",
      ],
    },
    isManualOverride: true,
    notes:
      "Concentration up to 1 min. Melee spell attack deals 3d6 Necrotic damage and heals caster for half damage dealt. Repeat attack as a Magic action on subsequent turns. Upcast adds +1d6 Necrotic damage per slot level.",
  },

    // Level 4 (2 spells)
    // Blight (D&D Free Rules 2024, Spell Descriptions)
  blight: {
    id: "blight",
    name: "Blight",
    category: {
      spellType: "spell",
      school: "necromancy",
      level: 4,
      classes: ["druid", "sorcerer", "warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 247",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "30 ft.",
      components: "V, S",
      duration: "Instantaneous",
    },
    interaction: { type: "save", saveAbility: "CON" },
    damage: [{ dice: "8d8", type: "necrotic", isBase: true }],
    upcasting: {
      notes: "+1d8 necrotic damage per spell slot level above 4.",
      perSlotLevel: { dice: "1d8", type: "necrotic" },
    },
    effectNotes: [
      "A visible creature makes a Constitution save, taking 8d8 Necrotic damage on a failure or half on a success. Plant creatures automatically fail.",
      "Alternatively, target a nonmagical plant that isn't a creature; it withers and dies without a save.",
    ],
    isManualOverride: true,
    notes:
      "The plant-object option is not a damage roll; apply the automatic failed save to Plant creatures.",
  },

  // Festering Blast (Arcana Unleashed, pg. 39)
  festering_blast: {
    id: "festering_blast",
    name: "Festering Blast",
    category: {
      spellType: "spell",
      school: "necromancy",
      level: 4,
      classes: ["druid", "sorcerer", "warlock", "wizard"],
      source: "Arcana Unleashed, pg. 39",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Self (60-ft. line)",
      components: "V, S",
      duration: "1 minute",
    },
    interaction: { type: "save", saveAbility: "CON" },
    area: { shape: "Line", sizeFeet: 60 },
    damage: [
      {
        dice: "4d10",
        type: "necrotic",
        isBase: true,
        condition: "Initial failed Constitution save",
      },
      {
        dice: "2d10",
        type: "poison",
        isBase: false,
        condition:
          "Poisoned target takes 2d10 Poison damage at start of each of its turns",
      },
    ],
    upcasting: {
      perSlotLevel: { dice: "1d10", type: "necrotic" },
      notes:
        "The initial damage increases by 1d10 for each spell slot level above 4",
    },
    effectNotes: [
      "A 60-foot-long, 10-foot-wide Line of miasma blasts from you in a direction you choose.",
      "Constitution saving throw: on a failed save, target takes 4d10 Necrotic damage and has the Poisoned condition for 1 minute.",
      "A creature Poisoned by this spell takes 2d10 Poison damage at the start of each of its turns.",
      "At the end of each of its turns, a Poisoned target repeats the Constitution save, ending the spell on itself on a success.",
      "Using a Higher-Level Spell Slot: Initial damage increases by 1d10 per slot level above 4.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Originate 60x10 ft Line; prompt Constitution saves for creatures in area.",
        "Failed save: deal 4d10 Necrotic and apply Poisoned condition (1 min).",
        "Poisoned targets take 2d10 Poison damage at turn start and repeat CON save at turn end to recover.",
      ],
    },
    isManualOverride: true,
    notes:
      "Arcana Unleashed, pg. 39. 1 minute (no concentration). 60x10 ft Line. CON save vs 4d10 Necrotic + Poisoned; Poisoned targets take 2d10 Poison damage at start of turns, repeat save at end of turns. Upcast +1d10 initial.",
  },

    // Level 5 (8 spells)
    // Contagion (D&D Free Rules 2024, Spell Descriptions)
  contagion: {
    id: "contagion",
    name: "Contagion",
    category: {
      spellType: "spell",
      school: "necromancy",
      level: 5,
      classes: ["cleric", "druid"],
      source: "Player's Handbook (2024), pg. 256",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Touch",
      components: "V, S",
      duration: "7 days",
    },
    interaction: { type: "save", saveAbility: "CON" },
    damage: [
      {
        dice: "11d8",
        type: "necrotic",
        isBase: true,
        condition: "On failed initial save",
      },
    ],
    effectNotes: [
      "On a failed Constitution save, the target takes 11d8 Necrotic damage, becomes Poisoned, and has Disadvantage on saves using one ability you choose while Poisoned. At the end of each of its turns, it repeats the save until it has three successes or three failures; three successes end the spell, while three failures make it last 7 days.",
      "When an effect would end the Poisoned condition, the target must first succeed on a Constitution save or Poisoned remains.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Resolve the initial Constitution save and damage; on failure record the chosen ability, Poisoned condition, and Disadvantage on its saves.",
        "Track end-of-turn saves until three successes or failures, and track the 7-day duration after three failures. Resolve Constitution saves when another effect would end Poisoned.",
      ],
    },
    isManualOverride: true,
    notes:
      "The 7-day duration applies after three failed repeat saves; the effect can end earlier after three successes. Track both counters and the selected ability.",
  },

  // Enervation (Arcana Unleashed, pg. 38)
  enervation: {
    id: "enervation",
    name: "Enervation",
    category: {
      spellType: "spell",
      school: "necromancy",
      level: 5,
      classes: ["sorcerer", "warlock", "wizard"],
      source: "Arcana Unleashed, pg. 38",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "60 ft.",
      components: "V, S",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "save", saveAbility: "DEX" },
    damage: [
      {
        dice: "6d8",
        type: "necrotic",
        isBase: true,
        condition:
          "Initial Dexterity save on casting (half damage on success, spell ends)",
      },
      {
        dice: "2d8",
        type: "necrotic",
        isBase: false,
        condition:
          "Subsequent turns: Bonus Action deals automatic 2d8 Necrotic while in range/LoS",
      },
    ],
    upcasting: {
      perSlotLevel: { dice: "1d8", type: "necrotic" },
      notes:
        "The initial damage increases by 1d8 for each spell slot level above 5",
    },
    effectNotes: [
      "A tendril of inky darkness reaches out to drain life from a creature within 60 feet.",
      "Dexterity saving throw: on a failed save, target takes 6d8 Necrotic damage.",
      "On each subsequent turn, you can take a Bonus Action to deal 2d8 Necrotic damage to target automatically. Spell ends if target is outside 60 ft range or has Total Cover.",
      "On a successful save, target takes half initial damage only, and spell ends.",
      "Whenever this spell deals damage to a target, you regain Hit Points equal to half the amount of Necrotic damage dealt.",
      "Using a Higher-Level Spell Slot: Initial damage increases by 1d8 per slot level above 5.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Cast on target within 60 ft; prompt Dexterity save.",
        "Failed save: apply 6d8 Necrotic damage (half on success, ends spell).",
        "Caster heals for half Necrotic damage dealt.",
        "Subsequent turns: Bonus Action deals automatic 2d8 Necrotic and heals half while in range/LoS.",
      ],
    },
    isManualOverride: true,
    notes:
      "Arcana Unleashed, pg. 38. Conc up to 1 min. DEX save vs 6d8 Necrotic (half on success, ends). Subsequent turns: BA deals 2d8 Necrotic automatically. Regains HP equal to half damage dealt. Upcast +1d8 initial.",
  },

  // Grave Ground (Arcana Unleashed, pg. 40)
  grave_ground: {
    id: "grave_ground",
    name: "Grave Ground",
    category: {
      spellType: "spell",
      school: "necromancy",
      level: 5,
      classes: ["cleric", "warlock", "wizard"],
      source: "Arcana Unleashed, pg. 40",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "120 ft.",
      components: "V, S, M (a handful of grave dirt)",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "save", saveAbility: "STR" },
    area: { shape: "Cube", sizeFeet: 20 },
    damage: [
      {
        dice: "6d6",
        type: "necrotic",
        isBase: true,
        condition:
          "Failed Strength save when appearing, entering, or ending turn in area",
      },
    ],
    upcasting: {
      perSlotLevel: { dice: "1d6", type: "necrotic" },
      notes: "The damage increases by 1d6 for each spell slot level above 5",
    },
    effectNotes: [
      "Skeletal hands burst from up to four 10-foot contiguous squares within 120 feet. That area is Difficult Terrain for enemies.",
      "Strength saving throw: any enemy in the area when hands appear, entering, or ending its turn there makes a Strength save (max once per turn).",
      "Failed save: takes 6d6 Necrotic damage, and until end of its next turn, subtracts 1d6 from all its damage rolls.",
      "Using a Higher-Level Spell Slot: Damage increases by 1d6 per slot level above 5.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Place up to four contiguous 10-ft squares within 120 ft as Difficult Terrain for enemies.",
        "Prompt Strength save on appearance, entering, or ending turn (once per turn).",
        "Failed save: deal 6d6 Necrotic damage and subtract 1d6 from all damage rolls until end of target's next turn.",
      ],
    },
    isManualOverride: true,
    notes:
      "Arcana Unleashed, pg. 40. Conc up to 1 min. Up to four 10-ft contiguous squares within 120 ft. Difficult terrain for enemies. STR save vs 6d6 Necrotic + subtract 1d6 from damage rolls until next turn end. Upcast +1d6.",
  },

  // Negative Energy Flood (Arcana Unleashed, pg. 42)
  negative_energy_flood: {
    id: "negative_energy_flood",
    name: "Negative Energy Flood",
    category: {
      spellType: "spell",
      school: "necromancy",
      level: 5,
      classes: ["warlock", "wizard"],
      source: "Arcana Unleashed, pg. 42",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "60 ft.",
      components: "V, M (a broken bone and a square of black silk)",
      duration: "Instantaneous",
    },
    interaction: { type: "save", saveAbility: "CON" },
    damage: [
      {
        dice: "3d10 + 25",
        type: "necrotic",
        isBase: true,
        condition: "Non-Undead target: Constitution save for half damage",
      },
    ],
    upcasting: {
      perSlotLevel: { dice: "1d10", type: "necrotic" },
      notes: "Damage increases by 1d10 for each spell slot level above 5",
    },
    effectNotes: [
      "Ribbons of negative energy strike one creature within 60 feet.",
      "Non-Undead Target: Constitution saving throw. Takes 3d10 + 25 Necrotic damage on failed save, or half as much on success.",
      "Zombie Spawn: A Humanoid killed by this spell rises at start of your next turn as a Zombie obeying your verbal commands for 24 hours.",
      "Undead Target: Undead makes no save and instead gains 3d10 Temporary Hit Points.",
      "Using a Higher-Level Spell Slot: Damage increases by 1d10 per slot level above 5.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Target creature within 60 ft.",
        "If Undead: grant 3d10 Temporary Hit Points.",
        "If Non-Undead: prompt Constitution save; deal 3d10 + 25 Necrotic damage (half on success).",
        "If a Humanoid dies from this spell, spawn a Zombie at start of next turn under caster's command (24 hours).",
      ],
    },
    isManualOverride: true,
    notes:
      "Arcana Unleashed, pg. 42. 60 ft. Non-Undead: CON save vs 3d10+25 Necrotic (half on success). Humanoid slain rises as Zombie under command. Undead gains 3d10 Temp HP. Upcast +1d10.",
  },

  raise_dead: {
    id: "raise_dead",
    name: "Raise Dead",
    category: {
      spellType: "spell",
      school: "necromancy",
      level: 5,
      classes: ["bard", "cleric", "paladin"],
      source: "Player's Handbook (2024), pg. 310",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 hour",
      range: "Touch",
      components: "V, S, M (a diamond worth 500+ GP, which the spell consumes)",
      duration: "Instantaneous",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Touch a dead creature (dead no longer than 10 days, not Undead when it died) to revive it with 1 Hit Point.",
      "Neutralizes any poisons affecting the creature at time of death and closes mortal wounds.",
      "Fails automatically if missing body parts or organs integral for survival (e.g. head). Does not restore missing body parts.",
      "Target takes a -4 penalty to D20 Tests; penalty reduces by 1 each time it finishes a Long Rest until it reaches 0.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Verify 500+ GP diamond is consumed. Touch target dead <= 10 days (non-Undead).",
        "Set target HP to 1, clear poisons at death, verify integral organs intact.",
        "Apply -4 penalty to D20 Tests and reduce by 1 after each Long Rest.",
      ],
    },
    isManualOverride: true,
    notes:
      "1 hour cast, consumes 500+ GP diamond. Revives non-Undead dead <= 10 days with 1 HP. Closes mortal wounds (fails if missing head/vital organs). Target suffers -4 penalty to D20 Tests, reduced by 1 per Long Rest.",
  },

  reincarnate: {
    id: "reincarnate",
    name: "Reincarnate",
    category: {
      spellType: "spell",
      school: "necromancy",
      level: 5,
      classes: ["druid"],
      source: "Player's Handbook (2024), pg. 311",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 hour",
      range: "Touch",
      components:
        "V, S, M (rare oils worth 1,000+ GP, which the spell consumes)",
      duration: "Instantaneous",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Touch a dead Humanoid (or a piece of one) dead no longer than 10 days to form a new adult body and return the soul.",
      "Roll 1d10 to determine the body's species (or DM choice): 1 Aasimar, 2 Dragonborn, 3 Dwarf, 4 Elf, 5 Gnome, 6 Goliath, 7 Halfling, 8 Human, 9 Orc, 10 Tiefling.",
      "Target retains its memories and capabilities from original form, but loses old species traits and gains the traits of its new species.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Verify 1,000+ GP rare oils consumed. Touch dead Humanoid <= 10 days.",
        "Roll 1d10 on 2024 species table (1 Aasimar, 2 Dragonborn, 3 Dwarf, 4 Elf, 5 Gnome, 6 Goliath, 7 Halfling, 8 Human, 9 Orc, 10 Tiefling) or DM adjudicates.",
        "Update character sheet: swap former species traits for new species traits; preserve class levels, memories, and capabilities.",
      ],
    },
    isManualOverride: true,
    notes:
      "1 hour cast, consumes 1,000+ GP oils. Touch dead Humanoid <= 10 days. 2024 revision: roll 1d10 for core species (1 Aasimar .. 10 Tiefling). Target replaces old species traits with new species traits while keeping memories and capabilities.",
  },

  // Spirit Lantern (Arcana Unleashed, pg. 43)
  spirit_lantern: {
    id: "spirit_lantern",
    name: "Spirit Lantern",
    category: {
      spellType: "spell",
      school: "necromancy",
      level: 5,
      classes: ["artificer", "cleric", "warlock", "wizard"],
      source: "Arcana Unleashed, pg. 43",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Self",
      components: "V, S, M (a black lantern)",
      duration: "10 minutes",
    },
    interaction: { type: "save", saveAbility: "CON" },
    damage: [
      {
        dice: "4d8",
        type: "necrotic",
        isBase: false,
        condition:
          "Bonus Action Drain Life: failed Constitution save (plus spellcasting modifier, half on success)",
      },
    ],
    effectNotes: [
      "Ghostly black lantern hovers above you shedding 60 ft Dim Light for 10 minutes without concentration.",
      "Soul Collection: When an enemy dies in Dim Light, its soul fragment enters lantern (holds up to your spellcasting ability modifier fragments).",
      "Bonus Action to expend 1 soul fragment for one of three benefits:",
      "- Drain Life: Creature within 60 ft makes CON save: takes 4d8 + spellcasting modifier Necrotic damage on failure, half on success.",
      "- Repair Undead: Undead creature within 60 ft regains 4d8 + spellcasting modifier HP.",
      "- Ward Ally: Ally within 60 ft causes attacks against it to have Disadvantage until start of your next turn.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Track black lantern focus and 60-ft Dim Light aura (10 min, no concentration).",
        "Collect soul fragments when enemies die in radius (max = spellcasting modifier).",
        "Bonus Action expend fragment: Drain Life (4d8+mod Necrotic CON save), Repair Undead (4d8+mod heal), or Ward Ally (Disadvantage on attacks against ally).",
      ],
    },
    isManualOverride: true,
    notes:
      "Arcana Unleashed, pg. 43. 10 min (no concentration). 60-ft Dim Light. Collects soul fragments when enemies die in aura (max = modifier). Bonus Action expends fragment: Drain Life (4d8+mod Necrotic CON save), Repair Undead (4d8+mod heal), or Ward Ally (attacks against ally have Disadvantage).",
  },

  // Waves of Exhaustion (Arcana Unleashed, pg. 45)
  waves_of_exhaustion: {
    id: "waves_of_exhaustion",
    name: "Waves of Exhaustion",
    category: {
      spellType: "spell",
      school: "necromancy",
      level: 5,
      classes: ["sorcerer", "warlock", "wizard"],
      source: "Arcana Unleashed, pg. 45",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 bonus action",
      range: "Self (60-ft. cone)",
      components: "V, S, M (a piece of dried meat)",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "save", saveAbility: "CON" },
    area: { shape: "Cone", sizeFeet: 60 },
    damage: [],
    effectNotes: [
      "Nimbus of flickering gray light surrounds you for up to 1 minute with concentration.",
      "For the duration, you can take a Magic action to emit a wave of gray light in a 60-foot Cone.",
      "Constitution saving throw: creatures in the area must succeed on a Constitution save or gain 1 Exhaustion level.",
      "Cannot increase a creature's Exhaustion level above 4.",
      "Exhaustion levels gained from this spell are removed when the spell ends.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Cast as Bonus Action; track concentration up to 1 min.",
        "Magic Action: emit 60-ft Cone of gray light.",
        "Prompt Constitution save for creatures in cone: failure gains 1 Exhaustion level (capped at 4).",
        "Remove all Exhaustion levels caused by this spell when concentration ends.",
      ],
    },
    isManualOverride: true,
    notes:
      "Arcana Unleashed, pg. 45. Bonus Action, conc up to 1 min. Magic action fires 60-ft Cone: CON save vs 1 Exhaustion level (capped at 4). Exhaustion removed when spell ends.",
  },

    // Level 6 (5 spells)
    // Circle of Death (D&D Free Rules 2024, Spell Descriptions)
  circle_of_death: {
    id: "circle_of_death",
    name: "Circle of Death",
    category: {
      spellType: "spell",
      school: "necromancy",
      level: 6,
      classes: ["sorcerer", "warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 250",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "150 ft.",
      components: "V, S, M (powder of a crushed black pearl worth 500+ GP)",
      duration: "Instantaneous",
    },
    interaction: { type: "save", saveAbility: "CON" },
    area: { shape: "Sphere", sizeFeet: 60 },
    damage: [{ dice: "8d8", type: "necrotic", isBase: true }],
    upcasting: {
      notes: "+2d8 Necrotic damage per slot level above 6.",
      perSlotLevel: { dice: "2d8", type: "necrotic" },
    },
    effectNotes: [
      "A point within range erupts in a 60-foot-radius Sphere. Each creature in the area makes a Constitution save, taking 8d8 Necrotic damage on a failure or half as much on a success.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Select the origin point, target creatures in the 60-foot-radius Sphere, and apply half damage on successful saves; token HP is not automatically updated.",
      ],
    },
    isManualOverride: true,
    notes:
      "Large-radius creature selection must be checked against the Owlbear scene; spell rolls do not update token HP.",
  },

  create_undead: {
    id: "create_undead",
    name: "Create Undead",
    category: {
      spellType: "spell",
      school: "necromancy",
      level: 6,
      classes: ["cleric", "warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 258",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 minute",
      range: "10 feet",
      components: "V, S, M (one 150+ GP black onyx stone for each corpse)",
      duration: "Instantaneous",
    },
    damage: [],
    effectNotes: [
      "Can cast only at night.",
      "Animate up to 3 Medium or Small Humanoid corpses within 10 feet as Ghouls under your control for 24 hours.",
      "Bonus Action on each turn to mentally command creatures within 120 feet.",
      "Recasting within 24 hours reasserts control over up to 3 previously animated creatures.",
      "Using a Higher-Level Spell Slot: Slot 7 (4 Ghouls); Slot 8 (5 Ghouls or 2 Ghasts/Wights); Slot 9 (6 Ghouls, 3 Ghasts/Wights, or 2 Mummies).",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Cast at night; verify 150+ GP black onyx per corpse.",
        "Animate 3 Ghouls (or upcast amounts/types).",
        "Bonus Action to command all controlled undead within 120 ft.",
        "Recast within 24 hours to maintain control.",
      ],
    },
    isManualOverride: true,
    notes:
      "1-minute cast at night, requires 150+ GP black onyx per corpse. Animates up to 3 corpses as Ghouls under control for 24 hours. Bonus Action to command within 120 ft. Upcast: slot 7 (4 Ghouls), slot 8 (5 Ghouls or 2 Ghasts/Wights), slot 9 (6 Ghouls, 3 Ghasts/Wights, or 2 Mummies).",
  },

  eyebite: {
    id: "eyebite",
    name: "Eyebite",
    category: {
      spellType: "spell",
      school: "necromancy",
      level: 6,
      classes: ["bard", "sorcerer", "warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 270",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Self",
      components: "V, S",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "save", saveAbility: "WIS" },
    damage: [],
    effectNotes: [
      "Choose a visible creature within 60 feet; it makes a Wisdom save or suffers one chosen effect for the duration. On each of your turns, you can take a Magic action to target another creature, but cannot target again a creature that succeeded on a save against this casting.",
      "Asleep: the target is Unconscious and wakes if it takes any damage or another creature uses an action to shake it awake. Panicked: the target is Frightened and must Dash and move away by the safest, shortest route on each turn; this effect ends if it reaches a space at least 60 feet away where it cannot see you. Sickened: the target is Poisoned.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Resolve a Wisdom save for a visible creature within 60 feet and record the chosen effect and concentration. Track each affected creature separately.",
        "On later turns, spend a Magic action to target another eligible creature; do not retarget a creature that succeeded against this casting. Track Unconscious wake conditions, Panicked movement/end condition, or Poisoned as applicable.",
      ],
    },
    isManualOverride: true,
    notes:
      "The spell can affect multiple creatures over successive turns, but each successful save makes that creature ineligible for this casting.",
  },

  harm: {
    id: "harm",
    name: "Harm",
    category: {
      spellType: "spell",
      school: "necromancy",
      level: 6,
      classes: ["cleric"],
      source: "Player's Handbook (2024), pg. 283",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "60 ft.",
      components: "V, S",
      duration: "Instantaneous",
    },
    interaction: { type: "save", saveAbility: "CON" },
    damage: [{ dice: "14d6", type: "necrotic", isBase: true }],
    effectNotes: [
      "A visible creature within range makes a Constitution save. On failure it takes 14d6 Necrotic damage and its Hit Point maximum is reduced by the damage taken; on success it takes half damage only. The maximum cannot be reduced below 1.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Resolve the Constitution save; apply full damage on failure or half on success. On failure, reduce the target's Hit Point maximum by damage actually taken, but not below 1.",
        "Track the reduced maximum separately from current HP and restore it when the applicable effect ends, according to table adjudication.",
      ],
    },
    isManualOverride: true,
    notes:
      "Only a failed save reduces the Hit Point maximum; a successful save deals half damage without the reduction.",
  },

  magic_jar: {
    id: "magic_jar",
    name: "Magic Jar",
    category: {
      spellType: "spell",
      school: "necromancy",
      level: 6,
      classes: ["wizard"],
      source: "Player's Handbook (2024), pg. 294",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 minute",
      range: "Self",
      components: "V, S, M (a gem, crystal, or reliquary worth 500+ GP)",
      duration: "Until dispelled",
    },
    interaction: { type: "save", saveAbility: "CHA" },
    damage: [],
    effectNotes: [
      "Your body becomes catatonic as your soul enters the 500+ GP container. While in the container, you perceive surroundings from its space, cannot move or take Reactions, and your only action is projecting your soul up to 100 feet to return to your body (ending the spell) or possess a Humanoid.",
      "Attempting possession: Visible Humanoid within 100 feet makes a Charisma save (cannot possess targets warded by Protection from Evil and Good or Magic Circle). Failure: your soul enters host body and its soul is trapped in the container. Success: target resists and is immune for 24 hours.",
      "While possessing: control the body; retain your game statistics except HP, Hit Dice, STR, DEX, CON, Speed, and senses which are replaced by the host's. Host soul perceives from container but is Incapacitated.",
      "Magic action to return to container if within 100 feet. If host dies: host dies and you make a Charisma save against your own spell save DC (success: return to container if within 100 feet; failure: you die). If container destroyed or spell ends: soul returns to body if alive and within 100 feet, otherwise you die. When spell ends, container is destroyed.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Verify the 500+ GP container. Track the caster's catatonic body and container location.",
        "Resolve Charisma save on possession attempt (100 ft. range, visible Humanoid; check for Protection from Evil and Good / Magic Circle immunity).",
        "On possession, swap HP, Hit Dice, STR/DEX/CON, Speed, and senses with the host while keeping other stats; host soul becomes Incapacitated in container.",
        "Adjudicate host death (CHA save vs own DC), container destruction, distance checks (100 ft.), and container destruction at spell end.",
      ],
    },
    isManualOverride: true,
    notes:
      "Requires a 500+ GP container. Extensive soul transfer and mortality rules adjudicated by the GM. Target immune for 24 hours on successful Charisma save.",
  },

    // Level 7 (2 spells)
    finger_of_death: {
    id: "finger_of_death",
    name: "Finger of Death",
    category: {
      spellType: "spell",
      school: "necromancy",
      level: 7,
      classes: ["sorcerer", "warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 273",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "60 ft.",
      components: "V, S",
      duration: "Instantaneous",
    },
    interaction: { type: "save", saveAbility: "CON" },
    damage: [{ dice: "7d8 + 30", type: "necrotic", isBase: true }],
    effectNotes: [
      "A creature you can see within range makes a Constitution save, taking 7d8 + 30 Necrotic damage on a failure or half as much on a success. A Humanoid killed by this spell rises at the start of your next turn as a Zombie that follows your verbal orders.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Resolve the target's Constitution save and apply full or half Necrotic damage. If a Humanoid is killed, create/track a Zombie at the start of your next turn and record its obedience to verbal orders.",
      ],
    },
    isManualOverride: true,
    notes:
      "The Zombie is created only if the spell kills a Humanoid, and appears at the start of your next turn.",
  },

  resurrection: {
    id: "resurrection",
    name: "Resurrection",
    category: {
      spellType: "spell",
      school: "necromancy",
      level: 7,
      classes: ["bard", "cleric"],
      source: "Player's Handbook (2024), pg. 312",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 hour",
      range: "Touch",
      components:
        "V, S, M (a diamond worth 1,000+ GP, which the spell consumes)",
      duration: "Instantaneous",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Touch a dead creature dead <= 100 years that didn't die of old age and wasn't Undead when it died.",
      "Revived with all its Hit Points, neutralizes poisons at death, closes all mortal wounds, and restores any missing body parts.",
      "Target takes a -4 penalty to D20 Tests, reduced by 1 each time it finishes a Long Rest until it reaches 0.",
      "Caster tax: if target was dead 365 days or longer, caster cannot cast spells and has Disadvantage on D20 Tests until finishing a Long Rest.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Verify 1,000+ GP diamond is consumed. Touch target dead <= 100 years (non-Undead, not old age).",
        "Restore target to full HP, clear poisons, close wounds, and regrow missing body parts.",
        "Apply -4 penalty to D20 Tests to target (reduced by 1 per Long Rest).",
        "If dead >= 365 days, apply caster tax: cannot cast spells and Disadvantage on D20 Tests until Long Rest.",
      ],
    },
    isManualOverride: true,
    notes:
      "1 hour cast, consumes 1,000+ GP diamond. Revives non-Undead dead <= 100 years with full HP, neutralizing poisons and restoring missing body parts. Target takes -4 to D20 Tests (reduced by 1 per Long Rest). If dead >= 1 year, caster is taxed until a Long Rest.",
  },

    // Level 8 (1 spells)
    clone: {
    id: "clone",
    name: "Clone",
    category: {
      spellType: "spell",
      school: "necromancy",
      level: 8,
      classes: ["wizard"],
      source: "Player's Handbook (2024), pg. 251",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 hour",
      range: "Touch",
      components:
        "V, S, M (a diamond worth 1,000+ GP, which the spell consumes, and a sealable vessel worth 2,000+ GP that is large enough to hold the creature being cloned)",
      duration: "Instantaneous",
    },
    damage: [],
    effectNotes: [
      "Touch a creature or at least 1 cubic inch of its flesh.",
      "An inert duplicate forms inside the vessel and finishes growing after 120 days (choose same age or younger). Remains inert indefinitely while vessel is undisturbed.",
      "When the original creature dies, its soul transfers to the clone if free and willing. Physically identical with same personality, memories, and abilities, but no equipment. Original remains become inert and cannot be revived.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Verify 1,000+ GP diamond consumed and 2,000+ GP sealable vessel present.",
        "Record clone creation (finishes growing in 120 days).",
        "On original creature's death, transfer soul to clone.",
      ],
    },
    isManualOverride: true,
    notes:
      "1-hour cast, consumes 1,000+ GP diamond, requires 2,000+ GP vessel. Creates inert duplicate of creature taking 120 days to mature. When original dies, soul transfers to clone.",
  },

    // Level 9 (3 spells)
    // Astral Projection (D&D Free Rules 2024, Spell Descriptions)
  astral_projection: {
    id: "astral_projection",
    name: "Astral Projection",
    category: {
      spellType: "spell",
      school: "necromancy",
      level: 9,
      classes: ["cleric", "warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 243",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 hour",
      range: "10 ft.",
      components:
        "V, S, M (per target: jacinth worth 1,000+ GP and silver bar worth 100+ GP, consumed)",
      duration: "Until dispelled",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "You and up to eight willing creatures in range project astral bodies to the Astral Plane; the spell ends immediately if cast while already there. Each physical body remains Unconscious in suspended animation, needs no food or air, and does not age.",
      "Each astral form duplicates its statistics and possessions and has a silvery cord. Leaving the Astral Plane returns the target and possessions to its body on the new plane. Effects and damage to the astral form do not affect the body, and vice versa. If either form reaches 0 HP, the spell ends for that target; you can take a Magic action to dismiss it for all targets. Living targets return to their bodies when the spell ends.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Track each willing target, body and astral form separately, plane/location, silvery cord and HP. Apply independent damage/effects, target-specific endings, and caster dismissal manually.",
      ],
    },
    isManualOverride: true,
    notes:
      "This is a multi-target planar-travel effect with separated bodies/forms; GM adjudication and persistent per-target tracking are required.",
  },

  true_resurrection: {
    id: "true_resurrection",
    name: "True Resurrection",
    category: {
      spellType: "spell",
      school: "necromancy",
      level: 9,
      classes: ["cleric", "druid"],
      source: "Player's Handbook (2024), pg. 336",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 hour",
      range: "Touch",
      components:
        "V, S, M (diamonds worth 25,000+ GP, which the spell consumes)",
      duration: "Instantaneous",
    },
    damage: [],
    effectNotes: [
      "Touch a creature dead <= 200 years (died for any reason except old age). Revived with all its Hit Points.",
      "Closes all wounds, neutralizes poisons, cures magical contagions, lifts curses, replaces damaged/missing organs and limbs.",
      "Restores Undead to non-Undead form.",
      "Can provide a new body if original no longer exists; caster speaks name and creature appears in unoccupied space within 10 feet.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Verify 25,000+ GP diamonds consumed.",
        "Verify creature dead <= 200 years ago and not from old age.",
        "Revive target at maximum Hit Points, curing poisons, contagions, curses, and recreating body if destroyed.",
      ],
    },
    isManualOverride: true,
    notes:
      "1-hour cast, consumes 25,000+ GP diamonds. Revives creature dead <= 200 years (not old age) with full HP, replacing lost body/limbs and removing curses, poisons, and diseases. Restores undead to life.",
  },

  // Wail of the Banshee (Arcana Unleashed, pg. 45)
  wail_of_the_banshee: {
    id: "wail_of_the_banshee",
    name: "Wail of the Banshee",
    category: {
      spellType: "spell",
      school: "necromancy",
      level: 9,
      classes: ["sorcerer", "warlock", "wizard"],
      source: "Arcana Unleashed, pg. 45",
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
    damage: [
      {
        dice: "12d10",
        type: "psychic",
        isBase: true,
        condition:
          "Targets with > 50 HP: failed Constitution save (half on success, no Deafened)",
      },
    ],
    effectNotes: [
      "Emit a terrible scream targeting up to ten creatures you choose within 60 feet that can hear you.",
      "Instant Death: Each target with 50 Hit Points or fewer dies instantly.",
      "Constitution saving throw for targets with more than 50 Hit Points:",
      "Failed save: takes 12d10 Psychic damage and has the Deafened condition for 1 hour.",
      "Successful save: takes half damage only.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Target up to 10 hearing creatures within 60 ft.",
        "If target HP <= 50, target dies instantly.",
        "If target HP > 50, prompt Constitution save: 12d10 Psychic damage and Deafened for 1 hour on failure (half damage only on success).",
      ],
    },
    isManualOverride: true,
    notes:
      "Arcana Unleashed, pg. 45. 60 ft. Targets up to 10 creatures that can hear. Targets <= 50 HP die instantly. Targets > 50 HP: CON save vs 12d10 Psychic + Deafened for 1 hour (half on success).",
  },
};
