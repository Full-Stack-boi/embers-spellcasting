/**
 * Manual Spell Formula Overrides — Transmutation (Leveled Spells 1st–9th)
 */

import type { SpellFormula } from "../../../types/spellFormula";

export const transmutationSpellOverrides: Record<string, SpellFormula> = {
    // Level 1 (7 spells)
    // Create or Destroy Water (D&D Free Rules 2024, Spell Descriptions)
  create_or_destroy_water: {
    id: "create_or_destroy_water",
    name: "Create or Destroy Water",
    category: {
      spellType: "spell",
      school: "transmutation",
      level: 1,
      classes: ["cleric", "druid"],
      source: "Player's Handbook (2024), pg. 258",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "30 ft.",
      components: "V, S, M (a mix of water and sand)",
      duration: "Instantaneous",
    },
    interaction: { type: "utility" },
    damage: [],
    upcasting: {
      notes:
        "Create or destroy 10 additional gallons, or increase the Cube option's size by 5 feet per slot level above 1st.",
    },
    effectNotes: [
      "Choose one: create or destroy up to 10 gallons of water in an open container; create rain or destroy fog in a 30-foot Cube. Created rain extinguishes exposed flames in the Cube.",
    ],
    isManualOverride: true,
    notes:
      "Choose the mode and track water volume, area, and affected flames manually.",
  },

  divine_favor: {
    id: "divine_favor",
    name: "Divine Favor",
    category: {
      spellType: "spell",
      school: "transmutation",
      level: 1,
      classes: ["paladin"],
      source: "Player's Handbook (2024), pg. 265",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 bonus action",
      range: "Self",
      components: "V, S",
      duration: "1 minute",
    },
    interaction: { type: "utility" },
    damage: [
      {
        dice: "1d4",
        type: "radiant",
        isBase: false,
        condition: "Extra damage when you hit with a weapon attack",
      },
    ],
    effectNotes: [
      "Until the spell ends, your attacks with weapons deal an extra 1d4 Radiant damage on a hit.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Track the 1-minute duration and add 1d4 Radiant damage to each weapon hit. The spell does not make an attack itself; apply the extra damage separately to each qualifying hit.",
      ],
    },
    isManualOverride: true,
    notes:
      "The extra damage applies on weapon hits, not to every attack or damage roll automatically.",
  },

  // Expeditious Retreat (D&D Free Rules 2024, Spell Descriptions)
  expeditious_retreat: {
    id: "expeditious_retreat",
    name: "Expeditious Retreat",
    category: {
      spellType: "spell",
      school: "transmutation",
      level: 1,
      classes: ["sorcerer", "warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 270",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "Bonus Action",
      range: "Self",
      components: "V, S",
      duration: "Concentration, up to 10 minutes",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "When you cast the spell, take the Dash action. Until the spell ends, you can take the Dash action as a Bonus Action on your later turns.",
    ],
    isManualOverride: true,
    notes:
      "Track concentration and the additional Bonus Action Dash option manually.",
  },

  // Feather Fall (D&D Free Rules 2024, Spell Descriptions)
  feather_fall: {
    id: "feather_fall",
    name: "Feather Fall",
    category: {
      spellType: "spell",
      school: "transmutation",
      level: 1,
      classes: ["bard", "sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 271",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "Reaction, when you or a creature you can see within 60 feet falls",
      range: "60 ft.",
      components: "V, M (a small feather or piece of down)",
      duration: "1 minute",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Choose up to five falling creatures within range. Their descent slows to 60 feet per round until the spell ends; a creature that lands before then takes no damage from the fall.",
    ],
    isManualOverride: true,
    notes:
      "Choose eligible falling creatures and resolve fall distance and landing manually.",
  },

  // Jump (D&D Free Rules 2024, Spell Descriptions)
  jump: {
    id: "jump",
    name: "Jump",
    category: {
      spellType: "spell",
      school: "transmutation",
      level: 1,
      classes: ["druid", "ranger", "sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 290",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "Bonus Action",
      range: "Touch",
      components: "V, S, M (a grasshopper's hind leg)",
      duration: "1 minute",
    },
    interaction: { type: "utility" },
    damage: [],
    upcasting: {
      notes:
        "Target one additional willing creature for each spell slot level above 1st.",
    },
    effectNotes: [
      "A willing creature you touch can, once on each of its turns before the spell ends, jump up to 30 feet by spending 10 feet of movement.",
    ],
    isManualOverride: true,
    notes:
      "Track the target and once-per-turn jump option manually; this does not itself move the Owlbear Rodeo token.",
  },

  // Longstrider (D&D Free Rules 2024, Spell Descriptions)
  longstrider: {
    id: "longstrider",
    name: "Longstrider",
    category: {
      spellType: "spell",
      school: "transmutation",
      level: 1,
      classes: ["bard", "druid", "ranger", "wizard"],
      source: "Player's Handbook (2024), pg. 293",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Touch",
      components: "V, S, M (a pinch of dirt)",
      duration: "1 hour",
    },
    interaction: { type: "utility" },
    damage: [],
    upcasting: {
      notes:
        "Target one additional creature for each spell slot level above 1st.",
    },
    effectNotes: [
      "A creature you touch has its Speed increased by 10 feet for the duration.",
    ],
    isManualOverride: true,
    notes: "Track the Speed bonus and duration manually.",
  },

  // Purify Food and Drink (D&D Free Rules 2024, Spell Descriptions)
  purify_food_and_drink: {
    id: "purify_food_and_drink",
    name: "Purify Food and Drink",
    category: {
      spellType: "spell",
      school: "transmutation",
      level: 1,
      classes: ["cleric", "druid", "paladin"],
      source: "Player's Handbook (2024), pg. 310",
      concentration: false,
      ritual: true,
    },
    casting: {
      time: "1 action or Ritual",
      range: "10 ft.",
      components: "V, S",
      duration: "Instantaneous",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Remove poison and rot from nonmagical food and drink in a 5-foot-radius Sphere centered on a point within range.",
    ],
    isManualOverride: true,
    notes: "Resolve affected nonmagical provisions in the Sphere manually.",
  },

    // Level 2 (16 spells)
    // Alter Self (D&D Free Rules 2024, Spell Descriptions)
  alter_self: {
    id: "alter_self",
    name: "Alter Self",
    category: {
      spellType: "spell",
      school: "transmutation",
      level: 2,
      classes: ["sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 239",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Self",
      components: "V, S",
      duration: "Concentration, up to 1 hour",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Choose Aquatic Adaptation (breathe underwater and gain a Swim Speed equal to your Speed), Change Appearance, or Natural Weapons. As a Magic action, replace the chosen option while the spell lasts.",
      "Natural Weapons: choose claws (slashing), fangs or horns (piercing), or hooves (bludgeoning). Unarmed Strike damage becomes 1d6 of that type and uses your spellcasting ability modifier for attack and damage rolls.",
    ],
    isManualOverride: true,
    notes:
      "Track the active option and appearance choices manually; changing options costs a Magic action.",
  },

  // Barkskin (D&D Free Rules 2024, Spell Descriptions)
  barkskin: {
    id: "barkskin",
    name: "Barkskin",
    category: {
      spellType: "spell",
      school: "transmutation",
      level: 2,
      classes: ["druid", "ranger"],
      source: "Player's Handbook (2024), pg. 245",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 bonus action",
      range: "Touch",
      components: "V, S, M (a handful of bark)",
      duration: "1 hour",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "A willing touched creature's Armor Class becomes 17 if it is lower than 17 for the duration.",
    ],
    isManualOverride: true,
    notes:
      "Apply the AC floor only when the target's current AC is below 17; track the one-hour duration.",
  },

  // Blindness/Deafness (D&D Free Rules 2024, Spell Descriptions)
  blindness_deafness: {
    id: "blindness_deafness",
    name: "Blindness/Deafness",
    category: {
      spellType: "spell",
      school: "transmutation",
      level: 2,
      classes: ["bard", "cleric", "sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 248",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "120 ft.",
      components: "V",
      duration: "1 minute",
    },
    interaction: { type: "save", saveAbility: "CON" },
    damage: [],
    upcasting: {
      notes: "Target one additional creature for each slot level above 2nd.",
    },
    effectNotes: [
      "Choose Blinded or Deafened. One creature you can see makes a Constitution save or has the chosen condition for the duration; it repeats the save at the end of each of its turns, ending the spell on itself on a success.",
    ],
    isManualOverride: true,
    notes: "Choose the condition and track end-of-turn saves manually.",
  },

  cordon_of_arrows: {
    id: "cordon_of_arrows",
    name: "Cordon of Arrows",
    category: {
      spellType: "spell",
      school: "transmutation",
      level: 2,
      classes: ["ranger"],
      source: "Player's Handbook (2024), pg. 258",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Touch",
      components: "V, S, M (four or more arrows or bolts)",
      duration: "8 hours",
    },
    interaction: { type: "save", saveAbility: "DEX" },
    damage: [{ dice: "2d4", type: "piercing", isBase: true }],
    upcasting: {
      notes: "+2 pieces of ammunition per spell slot level above 2nd",
    },
    effectNotes: [
      "You plant up to four pieces of nonmagical ammunition into the ground within 5 feet of you. You can designate any creatures you choose when casting to ignore the effect.",
      "Whenever a non-designated creature enters a space within 30 feet of the ammunition for the first time on a turn or ends its turn there, one piece flies and strikes it.",
      "The target makes a Dexterity saving throw, taking 2d4 Piercing damage on a failure (none on a success), and that piece of ammunition is destroyed.",
      "Using a Higher-Level Spell Slot: You can affect two additional pieces of ammunition for each spell slot level above 2.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Plant 4 pieces of ammunition (+2 per slot level above 2).",
        "Designate exempt allies/creatures.",
        "Trigger 2d4 Piercing damage on DEX save when non-designated creature enters <= 30 ft on a turn or ends turn there, destroying 1 piece per trigger.",
      ],
    },
    isManualOverride: true,
    notes:
      "Player's Handbook (2024). Marked for detailed verification against printed book/DDB. In 2024, damage buffed to 2d4 (from 1d6) and explicitly allows designating creatures to ignore.",
  },

  // Darkvision (D&D Free Rules 2024, Spell Descriptions)
  darkvision: {
    id: "darkvision",
    name: "Darkvision",
    category: {
      spellType: "spell",
      school: "transmutation",
      level: 2,
      classes: ["druid", "ranger", "sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 260",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Touch",
      components: "V, S, M (a dried carrot)",
      duration: "8 hours",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "A willing touched creature gains Darkvision with a range of 150 feet for the duration.",
    ],
    isManualOverride: true,
    notes:
      "Track the target and duration; this grants Darkvision and does not change other lighting rules.",
  },

  dragons_breath: {
    id: "dragons_breath",
    name: "Dragon's Breath",
    category: {
      spellType: "spell",
      school: "transmutation",
      level: 2,
      classes: ["sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 266",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 bonus action",
      range: "Touch",
      components: "V, S, M (a hot pepper)",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "save", saveAbility: "DEX" },
    area: { shape: "Cone", sizeFeet: 15 },
    damage: [
      {
        dice: "3d6",
        type: "fire",
        isBase: true,
        condition:
          "Exhaled breath weapon in 15-ft cone (Acid, Cold, Fire, Lightning, or Poison) on failed DEX save (half on success)",
      },
    ],
    upcasting: {
      notes: "+1d6 damage per spell slot level above 2nd",
      perSlotLevel: { dice: "1d6", type: "fire" },
    },
    effectNotes: [
      "Touch one willing creature and choose Acid, Cold, Fire, Lightning, or Poison.",
      "Until the spell ends, the target can take a Magic action to exhale energy in a 15-foot Cone.",
      "Each creature in the area makes a Dexterity saving throw, taking 3d6 damage of chosen type (half on success).",
      "Using a Higher-Level Spell Slot: Damage increases by 1d6 for each spell slot level above 2.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Cast as Bonus Action on touched willing creature; choose damage type (Acid, Cold, Fire, Lightning, or Poison).",
        "Target can use Magic action each turn to exhale 15-ft Cone.",
        "Prompt DEX save for creatures in cone: 3d6 chosen damage (+1d6/level upcast), half on save.",
      ],
    },
    isManualOverride: true,
    notes:
      "Bonus Action, Touch, conc up to 1 min. Target willing creature can use a Magic action each turn to exhale a 15-ft Cone of Acid, Cold, Fire, Lightning, or Poison dealing 3d6 damage (DEX save half). Upcast adds +1d6 damage per slot level.",
  },

  // Enhance Ability (D&D Free Rules 2024, Spell Descriptions)
  enhance_ability: {
    id: "enhance_ability",
    name: "Enhance Ability",
    category: {
      spellType: "spell",
      school: "transmutation",
      level: 2,
      classes: ["bard", "cleric", "druid", "ranger", "sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 268",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Touch",
      components: "V, S, M (fur or a feather)",
      duration: "Concentration, up to 1 hour",
    },
    interaction: { type: "utility" },
    damage: [],
    upcasting: {
      notes:
        "Target one additional creature for each slot level above 2nd; choose a different ability for each target if desired.",
    },
    effectNotes: [
      "Touch a creature and choose Strength, Dexterity, Intelligence, Wisdom, or Charisma. The target has Advantage on ability checks using that ability for the duration.",
    ],
    isManualOverride: true,
    notes:
      "Track the chosen ability and Advantage on its ability checks; the spell does not grant Advantage on saving throws.",
  },

  // Enlarge/Reduce (D&D Free Rules 2024, Spell Descriptions)
  enlarge_reduce: {
    id: "enlarge_reduce",
    name: "Enlarge/Reduce",
    category: {
      spellType: "spell",
      school: "transmutation",
      level: 2,
      classes: ["bard", "druid", "sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 268",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "30 ft.",
      components: "V, S, M (a pinch of powdered iron)",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "save", saveAbility: "CON" },
    damage: [],
    effectNotes: [
      "Choose Enlarge or Reduce for a visible creature or an object that isn't worn or carried. An unwilling creature can succeed on a Constitution save to avoid the effect.",
      "Enlarge increases size by one category, grants Advantage on Strength checks and saves, and adds 1d4 damage to attacks with enlarged weapons or Unarmed Strikes. Reduce decreases size by one category, imposes Disadvantage on Strength checks and saves, and subtracts 1d4 from such attacks (minimum 1 damage).",
    ],
    isManualOverride: true,
    notes:
      "Track size, Strength check/save Advantage or Disadvantage, and the per-hit 1d4 damage adjustment manually. Dropped gear returns to normal size.",
  },

  // Heat Metal (D&D Free Rules 2024, Spell Descriptions)
  heat_metal: {
    id: "heat_metal",
    name: "Heat Metal",
    category: {
      spellType: "spell",
      school: "transmutation",
      level: 2,
      classes: ["bard", "druid"],
      source: "Player's Handbook (2024), pg. 284",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "60 ft.",
      components: "V, S, M (a piece of iron and a flame)",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "utility" },
    damage: [{ dice: "2d8", type: "fire", isBase: true }],
    upcasting: {
      notes: "+1d8 fire damage per slot level above 2nd.",
      perSlotLevel: { dice: "1d8", type: "fire" },
    },
    effectNotes: [
      "Choose a visible manufactured metal object. Creatures in physical contact take 2d8 Fire damage when cast; on later turns, you can use a Bonus Action to repeat the damage while the object is in range.",
      "A creature holding or wearing the object when damaged makes a Constitution save or drops it if able. If it keeps holding/wearing it, it has Disadvantage on attack rolls and ability checks until the start of your next turn.",
    ],
    isManualOverride: true,
    notes:
      "The initial damage has no save; the Constitution save only governs dropping the object. Track the affected object, later Bonus Action damage, and concentration.",
  },

  // Knock (D&D Free Rules 2024, Spell Descriptions)
  knock: {
    id: "knock",
    name: "Knock",
    category: {
      spellType: "spell",
      school: "transmutation",
      level: 2,
      classes: ["bard", "sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 290",
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
      "Choose a visible object held shut by a mundane lock, or an object that is stuck or barred; it becomes unlocked, unstuck, or unbarred. One casting unlocks only one lock.",
      "If the object is held shut by Arcane Lock, suppress that spell on it for 10 minutes. A loud knock from the target is audible within 300 feet.",
    ],
    isManualOverride: true,
    notes:
      "Resolve the selected lock/barrier and announce the audible knock; only one lock is affected.",
  },

  // Levitate (D&D Free Rules 2024, Spell Descriptions)
  levitate: {
    id: "levitate",
    name: "Levitate",
    category: {
      spellType: "spell",
      school: "transmutation",
      level: 2,
      classes: ["sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 291",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "60 ft.",
      components: "V, S, M (a metal spring)",
      duration: "Concentration, up to 10 minutes",
    },
    interaction: { type: "save", saveAbility: "CON" },
    damage: [],
    effectNotes: [
      "A visible creature or loose object rises vertically up to 20 feet and remains suspended. Objects can weigh up to 500 pounds; an unwilling creature that succeeds on a Constitution save is unaffected.",
      "The target can move only by pushing or pulling against a fixed surface within reach. On your turn, you can change its altitude by up to 20 feet in either direction.",
    ],
    isManualOverride: true,
    notes:
      "Track concentration, target altitude, the object's weight, and eligible push/pull movement manually.",
  },

  // Magic Weapon (Player's Handbook 2024, pg. 295)
  magic_weapon: {
    id: "magic_weapon",
    name: "Magic Weapon",
    category: {
      spellType: "spell",
      school: "transmutation",
      level: 2,
      classes: ["paladin", "ranger", "sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 295",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 bonus action",
      range: "Touch",
      components: "V, S",
      duration: "1 hour",
    },
    interaction: { type: "utility" },
    damage: [],
    upcasting: {
      notes:
        "+2 attack and damage bonus with a level 3-5 slot; +3 with a level 6+ slot.",
    },
    effectNotes: [
      "A touched nonmagical weapon becomes magical and gains a +1 bonus to attack and damage rolls. Casting this spell again ends its earlier instance.",
    ],
    isManualOverride: true,
    notes:
      "Track the affected weapon and duration; apply the slot-dependent bonus to its attack and damage rolls.",
  },

  rope_trick: {
    id: "rope_trick",
    name: "Rope Trick",
    category: {
      spellType: "spell",
      school: "transmutation",
      level: 2,
      classes: ["wizard"],
      source: "Player's Handbook (2024), pg. 312",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Touch",
      components: "V, S, M (a segment of rope)",
      duration: "1 hour",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Touch a rope: one end hovers upward until the rope hangs perpendicular to the ground or reaches a ceiling.",
      "At the upper end, an Invisible 3-foot-by-5-foot portal opens to an extradimensional space lasting 1 hour without concentration.",
      "Reached by climbing the rope, which can be pulled into or dropped out of the space.",
      "Holds up to eight Medium or smaller creatures.",
      "Attacks, spells, and effects cannot pass into or out of the space, but creatures inside can see through the portal.",
      "Anything inside drops to the ground when the spell ends.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Touch rope; elevate upper end up to rope length and open invisible 3x5 ft portal lasting 1 hour (no concentration).",
        "Manage extradimensional space holding up to 8 Medium or smaller creatures; block all attacks/spells across portal boundary.",
        "When 1 hour expires, drop anything remaining inside out of the space.",
      ],
    },
    isManualOverride: true,
    notes:
      "Touch a rope to create an extradimensional haven for up to 8 Medium/smaller creatures lasting 1 hour without concentration. Rope can be pulled in. Completely blocks spells and attacks across boundary; occupants can see out.",
  },

  shining_smite: {
    id: "shining_smite",
    name: "Shining Smite",
    category: {
      spellType: "spell",
      school: "transmutation",
      level: 2,
      classes: ["paladin"],
      source: "Player's Handbook (2024), pg. 316",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "Bonus Action, taken immediately after hitting with a Melee weapon or Unarmed Strike",
      range: "Self",
      components: "V",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "weapon_based" },
    damage: [
      {
        dice: "2d6",
        type: "radiant",
        isBase: true,
        condition: "Extra damage on hit",
      },
    ],
    upcasting: {
      notes: "+1d6 Radiant damage per spell slot level above 2nd",
      perSlotLevel: { dice: "1d6", type: "radiant" },
    },
    effectNotes: [
      "Cast as a Bonus Action immediately after hitting with a Melee weapon or Unarmed Strike.",
      "Target takes an extra 2d6 Radiant damage from the attack (+1d6 per slot level above 2).",
      "Until the spell ends (up to 1 minute with concentration), the target sheds Bright Light in a 5-foot radius, attack rolls against it have Advantage, and it cannot benefit from the Invisible condition.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Trigger on melee hit: deal 2d6 (+1d6/level) extra Radiant damage.",
        "Apply glowing rider: shed 5-ft Bright Light, grant Advantage on attack rolls against target, negate Invisible condition.",
        "Track concentration up to 1 minute.",
      ],
    },
    isManualOverride: true,
    notes:
      "Bonus Action on melee hit. Deals +2d6 Radiant damage (+1d6 per slot level above 2). Target sheds 5-ft Bright Light, grants Advantage to attacks against it, and cannot benefit from Invisible condition for up to 1 min with concentration.",
  },

  // Spider Climb (D&D Free Rules 2024, Spell Descriptions)
  spider_climb: {
    id: "spider_climb",
    name: "Spider Climb",
    category: {
      spellType: "spell",
      school: "transmutation",
      level: 2,
      classes: ["sorcerer", "warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 318",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Touch",
      components: "V, S, M (a drop of bitumen and a spider)",
      duration: "Concentration, up to 1 hour",
    },
    interaction: { type: "utility" },
    damage: [],
    upcasting: {
      notes:
        "Target one additional willing creature for each slot level above 2nd.",
    },
    effectNotes: [
      "A willing creature you touch can move up, down, and across vertical surfaces and along ceilings with its hands free. It gains a Climb Speed equal to its Speed.",
    ],
    isManualOverride: true,
    notes:
      "Track the target's Climb Speed, concentration, and movement over walls and ceilings manually.",
  },

  // Spike Growth (D&D Free Rules 2024, Spell Descriptions)
  spike_growth: {
    id: "spike_growth",
    name: "Spike Growth",
    category: {
      spellType: "spell",
      school: "transmutation",
      level: 2,
      classes: ["druid", "ranger"],
      source: "Player's Handbook (2024), pg. 318",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "150 ft.",
      components: "V, S, M (seven thorns)",
      duration: "Concentration, up to 10 minutes",
    },
    interaction: { type: "utility" },
    area: { shape: "Sphere", sizeFeet: 20 },
    damage: [],
    effectNotes: [
      "The 20-foot-radius area is Difficult Terrain. A creature takes 2d4 Piercing damage for every 5 feet it moves into or within the area.",
      "The terrain appears natural. A creature unable to see the area when cast must use a Search action and succeed on a Wisdom (Perception or Survival) check against your spell save DC to recognize the hazard before entering.",
    ],
    isManualOverride: true,
    notes:
      "Track concentration and the hazardous area. Damage is movement-triggered (2d4 per 5 feet), not a single cast-time roll.",
  },

    // Level 3 (12 spells)
    // Blink (D&D Free Rules 2024, Spell Descriptions)
  blink: {
    id: "blink",
    name: "Blink",
    category: {
      spellType: "spell",
      school: "transmutation",
      level: 3,
      classes: ["sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 248",
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
      "At the end of each of your turns, roll a d6. On 4-6, vanish from your current plane and appear in the Ethereal Plane; return at the start of your next turn or when the spell ends to a visible unoccupied space within 10 feet of the departure space. If none is available, appear in the nearest unoccupied space.",
      "While on the Ethereal Plane, perceive the plane you left in shades of gray, with a 60-foot limit. You can affect and be affected only by creatures on the Ethereal Plane; creatures on the other plane can't perceive you without a special ability.",
    ],
    isManualOverride: true,
    notes:
      "Roll separately at the end of each caster turn and track the caster's plane and return space; no concentration is required.",
  },

  elemental_weapon: {
    id: "elemental_weapon",
    name: "Elemental Weapon",
    category: {
      spellType: "spell",
      school: "transmutation",
      level: 3,
      classes: ["druid", "paladin", "ranger"],
      source: "Player's Handbook (2024), pg. 268",
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
    damage: [
      {
        dice: "1d4",
        type: "choice",
        typeChoices: ["acid", "cold", "fire", "lightning", "thunder"],
        isBase: true,
      },
    ],
    upcasting: {
      notes:
        "+2 to attack rolls and 2d4 extra damage with a 5th- or 6th-level slot; +3 to attack rolls and 3d4 extra damage with a 7th-level or higher slot",
    },
    effectNotes: [
      "A nonmagical weapon you touch becomes a magic weapon.",
      "Choose one damage type: Acid, Cold, Fire, Lightning, or Thunder.",
      "For the duration, the weapon has a +1 bonus to attack rolls and deals an extra 1d4 damage of the chosen type on a hit.",
      "Using a Higher-Level Spell Slot: When cast with a 5th- or 6th-level slot, the attack bonus is +2 and extra damage is 2d4. With a 7th-level or higher slot, the bonus is +3 and extra damage is 3d4.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Touch nonmagical weapon and select element (Acid/Cold/Fire/Lightning/Thunder).",
        "Weapon gains +1 attack bonus (+2 at 5th-6th, +3 at 7th+) and +1d4 damage (+2d4 at 5th-6th, +3d4 at 7th+).",
      ],
    },
    isManualOverride: true,
    notes:
      "Player's Handbook (2024). Marked for detailed verification against printed book/DDB. Available to Druid, Paladin, Ranger in 2024. Concentration up to 1 hour.",
  },

  fly: {
    id: "fly",
    name: "Fly",
    category: {
      spellType: "spell",
      school: "transmutation",
      level: 3,
      classes: ["sorcerer", "warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 276",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Touch",
      components: "V, S, M (a feather)",
      duration: "Concentration, up to 10 minutes",
    },
    interaction: { type: "utility" },
    damage: [],
    upcasting: {
      notes:
        "Target one additional willing creature per spell slot level above 3.",
    },
    effectNotes: [
      "A willing creature you touch gains a Fly Speed of 60 feet and can hover for the duration. When the spell ends, a target still aloft falls unless it can stop the fall.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Confirm each target is willing, track the 60-foot Fly Speed, hovering and concentration. Check each target's altitude when the spell ends and resolve any resulting fall.",
      ],
    },
    isManualOverride: true,
    notes: "Upcasting increases the number of targets, not their Fly Speed.",
  },

  gaseous_form: {
    id: "gaseous_form",
    name: "Gaseous Form",
    category: {
      spellType: "spell",
      school: "transmutation",
      level: 3,
      classes: ["sorcerer", "warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 277",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Touch",
      components: "V, S, M (a bit of gauze)",
      duration: "Concentration, up to 1 hour",
    },
    interaction: { type: "utility" },
    damage: [],
    upcasting: {
      notes:
        "Target one additional creature for each spell slot level above 3rd.",
    },
    effectNotes: [
      "A willing touched creature and its worn/carried equipment become a misty cloud. It has Fly Speed 10 feet and can hover, enter another creature's space, Resistance to Bludgeoning/Piercing/Slashing, Immunity to Prone, and Advantage on Strength, Dexterity, and Constitution saves. It can pass through narrow openings but treats liquids as solid.",
      "The target cannot talk, manipulate objects, attack, or cast spells. The spell ends for that target if it reaches 0 HP or uses a Magic action to end it.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Confirm each target is willing; track cloud form, 10-foot Fly Speed, hovering, defenses, and concentration. Upcasting adds one target per slot level above 3.",
        "Apply restrictions on speech, object interaction, attacks, and spellcasting. End the effect for a target at 0 HP or when it takes a Magic action to end it; adjudicate narrow openings and solid liquids manually.",
      ],
    },
    isManualOverride: true,
    notes:
      "The spell changes movement, defenses, and available actions; these cannot all be enforced automatically on Owlbear tokens.",
  },

  haste: {
    id: "haste",
    name: "Haste",
    category: {
      spellType: "spell",
      school: "transmutation",
      level: 3,
      classes: ["sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 284",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "30 ft.",
      components: "V, S, M (a shaving of licorice root)",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Choose a willing visible creature. Its Speed doubles, it gains +2 AC and Advantage on Dexterity saves, and gets one additional action on each turn, usable only for Attack (one attack only), Dash, Disengage, Hide, or Utilize.",
      "When the spell ends, the target is Incapacitated and has Speed 0 until the end of its next turn.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Track the willing target, doubled Speed, +2 AC, Advantage on Dexterity saves, and the restricted additional action each turn.",
        "When concentration ends for any reason, apply Incapacitated and Speed 0 until the end of that target's next turn.",
      ],
    },
    isManualOverride: true,
    notes:
      "The 2024 spell grants a restricted additional action and applies Incapacitated plus Speed 0 when it ends.",
  },

  lightning_arrow: {
    id: "lightning_arrow",
    name: "Lightning Arrow",
    category: {
      spellType: "spell",
      school: "transmutation",
      level: 3,
      classes: ["ranger"],
      source: "Player's Handbook (2024), pg. 292",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 bonus action",
      range: "Self",
      components: "V, S",
      duration: "Instantaneous",
    },
    interaction: { type: "save", saveAbility: "DEX" },
    area: { shape: "Sphere", sizeFeet: 10 },
    damage: [
      { dice: "4d8", type: "lightning", isBase: true },
      { dice: "2d8", type: "lightning", isBase: false },
    ],
    upcasting: {
      notes:
        "+1d8 Lightning damage to primary target and splash creatures per spell slot level above 3rd",
    },
    effectNotes: [
      "You cast this spell immediately after you hit or miss a creature with a ranged weapon attack.",
      "The weapon or ammunition transforms into a bolt of lightning. The target takes 4d8 Lightning damage on a hit, or half as much on a miss.",
      "Whether you hit or miss, each creature within 10 feet of the target must make a Dexterity saving throw, taking 2d8 Lightning damage on a failed save, or half as much on a successful one.",
      "Using a Higher-Level Spell Slot: The damage increases by 1d8 for each spell slot level above 3 for both effects.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Cast as Bonus Action immediately after hitting or missing with a ranged weapon attack.",
        "Apply 4d8 Lightning damage to primary target (half on miss).",
        "Prompt Dexterity saves for creatures within 10 ft of target.",
        "Apply 2d8 Lightning damage (half on save).",
        "Apply upcast scaling (+1d8 to both damages per slot level above 3).",
      ],
    },
    isManualOverride: true,
    notes:
      "Player's Handbook (2024). Marked for detailed verification against printed book/DDB. In 2024, Bonus Action on hit or miss; concentration removed entirely. Primary takes 4d8 (half on miss); 10-ft splash takes 2d8 on DEX save.",
  },

  meld_into_stone: {
    id: "meld_into_stone",
    name: "Meld into Stone",
    category: {
      spellType: "spell",
      school: "transmutation",
      level: 3,
      classes: ["cleric", "druid", "ranger"],
      source: "Player's Handbook (2024), pg. 296",
      concentration: false,
      ritual: true,
    },
    casting: {
      time: "1 action or Ritual",
      range: "Touch",
      components: "V, S",
      duration: "8 hours",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Step into a stone object or surface large enough to contain you, merging yourself and equipment for 8 hours. Nonmagical senses cannot detect you.",
      "While merged, you cannot see outside, make Wisdom (Perception) checks to hear outside with Disadvantage, cannot move (except 5 feet of movement to exit where you entered, ending the spell), and can cast spells on yourself.",
      "Minor physical damage to the stone does not harm you. Partial destruction or shape change expels you, dealing 6d6 Force damage and knocking you Prone.",
      "Complete destruction or transmutation of the stone expels you, dealing 50 Force damage and knocking you Prone.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Record merged status with the chosen stone object/surface and 8-hour duration.",
        "Apply Disadvantage to Wisdom (Perception) checks to hear outside, and prevent standard movement.",
        "If exiting normally: consume 5 feet of movement and end the spell.",
        "If expelled by stone destruction: apply 6d6 Force damage (partial destruction) or 50 Force damage (complete destruction) and impose Prone condition in closest unoccupied space.",
      ],
    },
    isManualOverride: true,
    notes:
      "Ritual-capable. Merges with stone for up to 8 hours. Expulsion from stone destruction deals 6d6 or 50 Force damage and knocks the caster Prone.",
  },

  plant_growth: {
    id: "plant_growth",
    name: "Plant Growth",
    category: {
      spellType: "spell",
      school: "transmutation",
      level: 3,
      classes: ["bard", "druid", "ranger"],
      source: "Player's Handbook (2024), pg. 305",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action or 8 hours",
      range: "150 ft.",
      components: "V, S",
      duration: "Instantaneous",
    },
    interaction: { type: "utility" },
    area: { shape: "Sphere", sizeFeet: 100 },
    damage: [],
    effectNotes: [
      "Overgrowth (1 Action): Normal plants in a 100-foot-radius Sphere within 150 feet become thick and overgrown. Moving through costs 4 feet of movement per 1 foot moved. Can exclude any areas within the area.",
      "Enrichment (8 Hours): Plants in a half-mile radius become enriched for 365 days, yielding double food when harvested (max once per year).",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "If cast as 1 Action (Overgrowth): place 100-foot-radius Sphere; creatures spend 4 ft movement per 1 ft moved; exclude chosen interior areas.",
        "If cast over 8 Hours (Enrichment): record half-mile radius enriched agriculture for 365 days.",
      ],
    },
    isManualOverride: true,
    notes:
      "Instantaneous. Overgrowth creates a 100-foot-radius Sphere costing 4 ft of movement per 1 ft moved (caster can exclude areas). Enrichment boosts crop yields across half-mile radius for 1 year.",
  },

  slow: {
    id: "slow",
    name: "Slow",
    category: {
      spellType: "spell",
      school: "transmutation",
      level: 3,
      classes: ["bard", "sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 318",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "120 ft.",
      components: "V, S, M (a drop of molasses)",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "save", saveAbility: "WIS" },
    area: { shape: "Cube", sizeFeet: 40 },
    damage: [],
    effectNotes: [
      "Target up to six creatures of your choice in a 40-foot Cube within 120 feet. Each must succeed on a Wisdom saving throw or be affected for up to 1 minute with concentration.",
      "Affected creature: Speed is halved, takes a -2 penalty to AC and Dexterity saving throws, and cannot take Reactions.",
      "Action economy: on its turns, can take either an action or a Bonus Action (not both), and can make only one attack if taking the Attack action.",
      "Casting with Somatic component has a 25% chance to fail and waste the action. Repeats Wisdom save at end of each of its turns, ending effect on success.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Target up to 6 creatures in 40-foot Cube within 120 ft; prompt Wisdom saving throw.",
        "On failure, apply: speed halved, -2 AC, -2 DEX saves, no Reactions, action OR bonus action only, max 1 attack.",
        "On Somatic spell cast, roll d100 (1-25 wasted). Prompt recurring Wisdom save at end of each target turn.",
      ],
    },
    isManualOverride: true,
    notes:
      "Up to 6 targets in 40-ft Cube make WIS save. On fail: speed halved, -2 AC/DEX saves, no reactions, only 1 attack, action OR bonus action only, 25% spell waste for Somatic spells. Repeats save at end of each turn.",
  },

  speak_with_plants: {
    id: "speak_with_plants",
    name: "Speak with Plants",
    category: {
      spellType: "spell",
      school: "transmutation",
      level: 3,
      classes: ["bard", "druid", "ranger"],
      source: "Player's Handbook (2024), pg. 318",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Self",
      components: "V, S",
      duration: "10 minutes",
    },
    interaction: { type: "utility" },
    area: { shape: "Emanation", sizeFeet: 30 },
    damage: [],
    effectNotes: [
      "Imbue plants in an immobile 30-foot Emanation with limited sentience and animation for 10 minutes without concentration.",
      "Question plants about events within the past day (creatures, weather, circumstances).",
      "Terrain manipulation: turn plant-based Difficult Terrain into ordinary terrain, or ordinary terrain with plants into Difficult Terrain for the duration.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Manifest immobile 30-foot Emanation lasting 10 minutes (no concentration).",
        "Adjudicate information gathered from plants about past 24 hours.",
        "Toggle Difficult Terrain in plant-covered areas within emanation.",
      ],
    },
    isManualOverride: true,
    notes:
      "Immobile 30-foot Emanation, 10 minutes (no concentration). Communicate with plants for past day's events, and toggle plant-based Difficult Terrain on or off.",
  },

  water_breathing: {
    id: "water_breathing",
    name: "Water Breathing",
    category: {
      spellType: "spell",
      school: "transmutation",
      level: 3,
      classes: ["druid", "ranger", "sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 340",
      concentration: false,
      ritual: true,
    },
    casting: {
      time: "1 action",
      range: "30 feet",
      components: "V, S, M (a short reed)",
      duration: "24 hours",
    },
    damage: [],
    effectNotes: [
      "Grants up to ten willing creatures within 30 feet the ability to breathe underwater for 24 hours.",
      "Affected creatures retain their normal mode of respiration.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Select up to 10 willing creatures within 30 feet.",
        "Grant underwater breathing for 24 hours (no concentration, normal breathing retained).",
      ],
    },
    isManualOverride: true,
    notes:
      "Ritual. 24 hours (no concentration). Up to 10 willing creatures within 30 ft gain ability to breathe underwater while retaining normal breathing.",
  },

  water_walk: {
    id: "water_walk",
    name: "Water Walk",
    category: {
      spellType: "spell",
      school: "transmutation",
      level: 3,
      classes: ["cleric", "druid", "ranger", "sorcerer"],
      source: "Player's Handbook (2024), pg. 340",
      concentration: false,
      ritual: true,
    },
    casting: {
      time: "1 action",
      range: "30 feet",
      components: "V, S, M (a piece of cork)",
      duration: "1 hour",
    },
    damage: [],
    effectNotes: [
      "Up to ten willing creatures within 30 feet gain the ability to move across any liquid surface (water, acid, mud, snow, quicksand, lava) as solid ground for 1 hour.",
      "Creatures crossing molten lava still take damage from the heat.",
      "An affected target can take a Bonus Action to pass into the liquid and vice versa; falling into liquid passes through surface.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Select up to 10 willing creatures within 30 feet.",
        "Grant liquid surface walking for 1 hour (no concentration).",
        "Use Bonus Action to pass between surface and liquid below.",
      ],
    },
    isManualOverride: true,
    notes:
      "Ritual. 1 hour (no concentration). Up to 10 willing creatures within 30 ft walk across liquid surfaces (water, lava, mud, acid) as solid ground. Bonus Action to submerge/emerge.",
  },

    // Level 4 (5 spells)
    // Control Water (D&D Free Rules 2024, Spell Descriptions)
  control_water: {
    id: "control_water",
    name: "Control Water",
    category: {
      spellType: "spell",
      school: "transmutation",
      level: 4,
      classes: ["cleric", "druid", "wizard"],
      source: "Player's Handbook (2024), pg. 256",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "300 ft.",
      components: "V, S, M (a mixture of water and dust)",
      duration: "Concentration, up to 10 minutes",
    },
    interaction: { type: "save", saveAbility: "STR" },
    damage: [
      {
        dice: "2d8",
        type: "bludgeoning",
        isBase: true,
        condition:
          "Whirlpool: when a creature enters it for the first time on a turn or ends its turn there; half damage on successful save",
      },
    ],
    effectNotes: [
      "Control water in a Cube up to 100 feet on a side. Choose Flood, Part Water, Redirect Flow, or Whirlpool; on later turns, a Magic action can repeat or change the effect.",
      "Flood raises standing water up to 20 feet; a wave across a large body of water carries Huge or smaller vehicles and gives each struck vehicle a 25% chance to capsize. Part Water creates a trench and side walls, then water refills it over the next round when the effect ends. Redirect Flow changes direction even over obstacles; water resumes natural flow after leaving the area.",
      "Whirlpool requires water at least 50 feet square and 25 feet deep. Creatures in the water within 25 feet are pulled 10 feet toward it. Entering it for the first time on a turn or ending a turn there triggers a Strength save; failure deals 2d8 Bludgeoning, success half. Swimming away requires an action and successful Strength (Athletics) check against your spell save DC.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Choose an eligible water area and one mode; the GM adjudicates terrain, vehicles, flow and water volume. Track concentration and repeated Magic actions. Resolve Whirlpool movement, saves and Athletics checks manually.",
      ],
    },
    isManualOverride: true,
    notes:
      "The four modes have distinct terrain and vehicle interactions; no water simulation or capsizing automation is provided.",
  },

  fabricate: {
    id: "fabricate",
    name: "Fabricate",
    category: {
      spellType: "spell",
      school: "transmutation",
      level: 4,
      classes: ["wizard"],
      source: "Player's Handbook (2024), pg. 271",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "10 minutes",
      range: "120 ft.",
      components: "V, S",
      duration: "Instantaneous",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Convert sufficient raw materials you can see within range into products made of the same material. The result can be Large or smaller, contained within a 10-foot Cube or eight connected 5-foot Cubes; if working with metal, stone, or another mineral, it can be no larger than Medium in a 5-foot Cube.",
      "The result's quality depends on the raw materials. The spell cannot create creatures or magic items, and cannot create objects requiring high skill (such as weapons or armor) unless you have proficiency with the relevant Artisan's Tools.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Choose visible raw material within range and confirm there is enough material for the intended object and size limits.",
        "Confirm tool proficiency for an object requiring high skill. The GM adjudicates feasibility, craftsmanship, and material sufficiency; the spell does not create creatures or magic items.",
      ],
    },
    isManualOverride: true,
    notes:
      "Material quantity and whether an object requires high craftsmanship are GM adjudications.",
  },

  polymorph: {
    id: "polymorph",
    name: "Polymorph",
    category: {
      spellType: "spell",
      school: "transmutation",
      level: 4,
      classes: ["bard", "druid", "sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 306",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "60 ft.",
      components: "V, S, M (a caterpillar cocoon)",
      duration: "Concentration, up to 1 hour",
    },
    interaction: { type: "save", saveAbility: "WIS" },
    damage: [],
    effectNotes: [
      "Target one creature within 60 feet: Wisdom saving throw or transform into a Beast (CR <= target's CR or level) for up to 1 hour with concentration.",
      "2024 Rules Update: Target retains its alignment, personality, creature type, Hit Points, and Hit Point Dice.",
      "Target gains Temporary Hit Points equal to the Beast's HP. The spell ends early on the target if it has no Temporary Hit Points left.",
      "Target game statistics are replaced by Beast stat block. Cannot speak, cast spells, or use gear (gear melds into form).",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Target creature within 60 feet; resolve Wisdom saving throw.",
        "On failure, select Beast form (CR <= target level/CR); replace stat block while preserving HP and creature type.",
        "Grant Temporary Hit Points equal to the Beast form's HP. Track concentration up to 1 hour.",
        "End spell early when Beast form's Temporary Hit Points are depleted.",
      ],
    },
    isManualOverride: true,
    notes:
      "Major 2024 update: Target retains its base HP and gains Temporary HP equal to the Beast form's HP. The spell ends early when these Temporary HP reach 0. Target cannot speak, cast spells, or use gear.",
  },

  stone_shape: {
    id: "stone_shape",
    name: "Stone Shape",
    category: {
      spellType: "spell",
      school: "transmutation",
      level: 4,
      classes: ["cleric", "druid", "wizard"],
      source: "Player's Handbook (2024), pg. 320",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Touch",
      components: "V, S, M (soft clay)",
      duration: "Instantaneous",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Touch a stone object of Medium size or smaller or a section of stone no more than 5 feet in any dimension and form it into any shape you like.",
      "Can create a weapon, statue, coffer, a 5-foot-thick passage through a stone wall, or seal a stone door.",
      "Created object can include up to two hinges and a latch (finer mechanical details not possible).",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Touch stone object <= Medium or 5-foot section.",
        "Adjudicate shape change (e.g. passage, door seal, receptacle) with up to 2 hinges and 1 latch.",
      ],
    },
    isManualOverride: true,
    notes:
      "Touch a Medium stone object or 5-ft stone section to reshape it permanently (passage through 5-ft wall, door, statue, weapon, with up to 2 hinges and a latch).",
  },

  stoneskin: {
    id: "stoneskin",
    name: "Stoneskin",
    category: {
      spellType: "spell",
      school: "transmutation",
      level: 4,
      classes: ["druid", "ranger", "sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 320",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Touch",
      components:
        "V, S, M (diamond dust worth 100+ GP, which the spell consumes)",
      duration: "Concentration, up to 1 hour",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Touch a willing creature: until the spell ends (up to 1 hour with concentration), it has Resistance to Bludgeoning, Piercing, and Slashing damage (all sources in 2024 rules).",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Verify 100+ GP diamond dust is consumed. Touch willing target.",
        "Grant Resistance to Bludgeoning, Piercing, and Slashing damage; track concentration up to 1 hour.",
      ],
    },
    isManualOverride: true,
    notes:
      "Consumes 100+ GP diamond dust. Concentration up to 1 hour. Willing creature gains Resistance to all Bludgeoning, Piercing, and Slashing damage.",
  },

    // Level 5 (6 spells)
    // Animate Objects (D&D Free Rules 2024, Spell Descriptions)
  animate_objects: {
    id: "animate_objects",
    name: "Animate Objects",
    category: {
      spellType: "spell",
      school: "transmutation",
      level: 5,
      classes: ["bard", "sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 240",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "120 ft.",
      components: "V, S",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "utility" },
    damage: [],
    upcasting: {
      notes:
        "The animated creature's Slam damage increases by size: +1d4 (Medium or smaller), +1d6 (Large), or +1d12 (Huge) for each slot level above 5.",
    },
    effectNotes: [
      "Animate eligible nonmagical objects within range that are not worn, carried, fixed, or Gargantuan. Maximum object units equal your spellcasting ability modifier; Medium or smaller counts as one, Large as two, and Huge as three.",
      "Each becomes a Construct using the Animated Object stat block, shares your Initiative and acts after you. You can mentally command them with a Bonus Action within 500 feet; without commands, they Dodge and move only to avoid harm. At 0 Hit Points, an animated object reverts to its object form.",
    ],
    isManualOverride: true,
    notes:
      "Choose the objects and size-based stat blocks, track Initiative/HP/commands and concentration, and apply the slot-dependent Slam damage manually.",
  },

  // Awaken (D&D Free Rules 2024, Spell Descriptions)
  awaken: {
    id: "awaken",
    name: "Awaken",
    category: {
      spellType: "spell",
      school: "transmutation",
      level: 5,
      classes: ["bard", "druid"],
      source: "Player's Handbook (2024), pg. 245",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "8 hours",
      range: "Touch",
      components: "V, S, M (an agate worth 1,000+ GP, consumed)",
      duration: "Instantaneous",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "An eligible Beast or Plant creature with Intelligence 3 or lower, or a natural noncreature plant, gains Intelligence 10 and can speak one language you know. A natural plant becomes a Plant creature, can move its limbs/roots/vines, and gains humanlike senses; the GM chooses suitable statistics.",
      "The awakened target is Charmed for 30 days or until you or your allies deal damage to it. When that condition ends, it chooses its attitude toward you.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Verify target eligibility and complete the 8-hour casting. GM selects an appropriate stat block for an awakened plant; record the language, Intelligence, Charmed duration, and damage that ends the condition.",
      ],
    },
    isManualOverride: true,
    notes:
      "Awakened creature statistics are GM-selected; do not infer a stat block for a natural plant automatically.",
  },

  passwall: {
    id: "passwall",
    name: "Passwall",
    category: {
      spellType: "spell",
      school: "transmutation",
      level: 5,
      classes: ["wizard"],
      source: "Player's Handbook (2024), pg. 303",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "30 ft.",
      components: "V, S, M (a pinch of sesame seeds)",
      duration: "1 hour",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "A passage opens on a visible wooden, plaster, or stone surface within 30 feet lasting 1 hour.",
      "Dimensions: up to 5 feet wide, 8 feet tall, and 20 feet deep. Does not cause structural instability.",
      "When the spell ends, any creatures or objects still inside the passage are safely ejected to an unoccupied space nearest the casting surface.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Designate opening on qualifying surface (wood, plaster, stone) within 30 feet: up to 5 ft wide, 8 ft tall, 20 ft deep.",
        "Track 1-hour duration (no concentration); safely eject occupants to nearest unoccupied space when spell expires.",
      ],
    },
    isManualOverride: true,
    notes:
      "1-hour duration without concentration. Creates a passage up to 5x8x20 ft through wood, plaster, or stone without structural collapse. Safely ejects occupants when the spell ends.",
  },

  // Songal's Elemental Suffusion (Forgotten Realms: Heroes of Faerûn, pg. 145)
  songals_elemental_suffusion: {
    id: "songals_elemental_suffusion",
    name: "Songal's Elemental Suffusion",
    category: {
      spellType: "spell",
      school: "transmutation",
      level: 5,
      classes: ["druid", "sorcerer", "wizard"],
      source: "Forgotten Realms: Heroes of Faerûn, pg. 145",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Self",
      components: "V, S, M (a pearl worth 100+ GP)",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "save", saveAbility: "DEX" },
    area: { shape: "Sphere", sizeFeet: 15 },
    damage: [
      {
        dice: "2d6",
        type: "choice",
        typeChoices: ["acid", "cold", "fire", "lightning", "thunder"],
        isBase: true,
        condition:
          "Elemental Pulse in 15-ft Emanation: failed Dexterity save (half on success, no Prone)",
      },
    ],
    effectNotes: [
      "Choose Acid, Cold, Fire, Lightning, or Thunder upon casting.",
      "Gain Resistance to the chosen damage type, plus Fly Speed 30 feet with hover.",
      "Elemental Pulse: On casting and at start of each of your turns, release a burst in a 15-foot Emanation. Each chosen creature makes a Dexterity save: 2d6 chosen damage and Prone condition on failure, half damage only on success.",
      "Circle Spell: Can be cast as a circle spell (1 min cast, 10 min conc, up to 9 secondary casters expending level 2+ slots grant benefits to up to 9 additional creatures).",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Verify 100+ GP pearl focus.",
        "Choose elemental type: grant Resistance and Fly 30 ft (hover).",
        "15-ft Emanation: on cast and turn start, prompt Dexterity saves for chosen creatures: 2d6 damage + Prone (half on success).",
        "Circle casting: expands recipients up to 9 additional creatures with secondary casters.",
      ],
    },
    isManualOverride: true,
    notes:
      "Forgotten Realms: Heroes of Faerûn, pg. 145. Conc up to 1 min (Circle: 10 min). Choose element: Resistance, Fly 30 ft hover, 15-ft Emanation pulse on cast and turn start (DEX save vs 2d6 + Prone). Can target multiple creatures if cast as Circle Spell.",
  },

  swift_quiver: {
    id: "swift_quiver",
    name: "Swift Quiver",
    category: {
      spellType: "spell",
      school: "transmutation",
      level: 5,
      classes: ["ranger"],
      source: "Player's Handbook (2024), pg. 329",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 bonus action",
      range: "Touch",
      components:
        "V, S, M (a quiver containing at least one piece of ammunition)",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "You transmute your quiver so it produces an endless supply of nonmagical ammunition.",
      "On your subsequent turns until the spell ends, you can use a Bonus Action to make two attacks with a weapon that uses ammunition from the quiver.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Touch quiver to empower it.",
        "On subsequent turns, use Bonus Action to make two weapon attacks firing arrows or bolts from the quiver.",
      ],
    },
    isManualOverride: true,
    notes:
      "Player's Handbook (2024). Marked for detailed verification against printed book/DDB. In 2024, cast as Bonus Action; allows 2 attacks as a Bonus Action on subsequent turns.",
  },

  telekinesis: {
    id: "telekinesis",
    name: "Telekinesis",
    category: {
      spellType: "spell",
      school: "transmutation",
      level: 5,
      classes: ["sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 331",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "60 feet",
      components: "V, S",
      duration: "Concentration, up to 10 minutes",
    },
    interaction: { type: "save", saveAbility: "STR" },
    damage: [],
    effectNotes: [
      "Exert telekinetic will on one creature or object you can see within 60 feet when cast and as a Magic action on later turns.",
      "Creature: Try to move a Huge or smaller creature. Creature makes a Strength saving throw or is moved up to 30 feet in any direction within range and has the Restrained condition until end of your next turn (suspended if lifted into air; falls at end of next turn unless repeated).",
      "Object: Try to move a Huge or smaller object up to 30 feet within range. Unattended objects move automatically; worn/carried objects require the holding creature to make a Strength saving throw to retain them.",
      "Can exert fine control: manipulating simple tools, opening doors/containers, retrieving/stowing items, pouring vials.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Target creature or object within 60 feet on cast or as a Magic action on subsequent turns.",
        "Creature: prompt STR save; on fail move up to 30 ft and apply Restrained.",
        "Object: move unattended object up to 30 ft (prompt STR save if worn/carried).",
        "Fine control options available for tool manipulation, container opening, etc.",
      ],
    },
    isManualOverride: true,
    notes:
      "Concentration up to 10 min. Magic action each turn to affect Huge or smaller creature or object within 60 ft. Creature: STR save or moved up to 30 ft and Restrained. Object: moved up to 30 ft (STR save if carried).",
  },

    // Level 6 (4 spells)
    disintegrate: {
    id: "disintegrate",
    name: "Disintegrate",
    category: {
      spellType: "spell",
      school: "transmutation",
      level: 6,
      classes: ["sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 263",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "60 ft.",
      components: "V, S, M (a lodestone and dust)",
      duration: "Instantaneous",
    },
    interaction: { type: "save", saveAbility: "DEX" },
    damage: [
      {
        dice: "10d6+40",
        type: "force",
        isBase: true,
        condition: "On failed save against a creature",
      },
    ],
    upcasting: {
      notes: "+3d6 Force damage per slot level above 6.",
      perSlotLevel: { dice: "3d6", type: "force" },
    },
    effectNotes: [
      "A visible creature, nonmagical object, or creation of magical force within range is targeted. A creature makes a Dexterity save; on a failure it takes 10d6 + 40 Force damage. If this reduces it to 0 HP, it and its nonmagical worn/carried items are disintegrated; revival requires True Resurrection or Wish.",
      "A Large or smaller nonmagical object or force creation is automatically disintegrated. For a Huge or larger target, disintegrate a 10-foot Cube portion.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Choose a visible valid target. Roll the Dexterity save for a creature; on success, the spell deals no damage. Check post-damage HP for disintegration and record that ordinary revival cannot restore it; GM resolves size and object/force-creation rules.",
        "For upcasting, add 3d6 Force per slot level above 6. The spell does not automatically delete tokens, objects, or carried inventory.",
      ],
    },
    isManualOverride: true,
    notes:
      "Only a creature target makes the save. Nonmagical objects and force creations follow separate size-based destruction rules.",
  },

  flesh_to_stone: {
    id: "flesh_to_stone",
    name: "Flesh to Stone",
    category: {
      spellType: "spell",
      school: "transmutation",
      level: 6,
      classes: ["druid", "sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 275",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "60 ft.",
      components: "V, S, M (a cockatrice feather)",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "save", saveAbility: "CON" },
    damage: [],
    effectNotes: [
      "One visible creature makes a Constitution save; Constructs automatically succeed. On failure it is Restrained for the duration; on success its Speed is 0 until the start of your next turn.",
      "A Restrained target repeats the save at the end of each turn. Track successes and failures independently: three successes end the spell; three failures make the target Petrified for the duration. If concentration lasts for the entire possible duration, the target remains Petrified until Greater Restoration or similar magic ends it.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Resolve the initial Constitution save; Constructs automatically succeed. On a failed save track Restrained and concentration; on success track Speed 0 until the start of the target's next turn.",
        "At each target turn end, record a success or failure. Three successes end the spell; three failures apply Petrified. If concentration is maintained for the full possible duration, track the extended Petrified condition and its removal requirement.",
      ],
    },
    isManualOverride: true,
    notes:
      "The save counters need not be consecutive; keep separate totals and stop at three of either result.",
  },

  move_earth: {
    id: "move_earth",
    name: "Move Earth",
    category: {
      spellType: "spell",
      school: "transmutation",
      level: 6,
      classes: ["druid", "sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 302",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "120 ft.",
      components: "V, S, M (a miniature shovel)",
      duration: "Concentration, up to 2 hours",
    },
    interaction: { type: "utility" },
    area: { shape: "Cube", sizeFeet: 40 },
    damage: [],
    effectNotes: [
      "Reshape dirt, sand, or clay in an area up to 40 feet on a side within 120 feet for up to 2 hours with concentration.",
      "Raise or lower elevation, dig or fill trenches, erect or flatten walls, or form pillars. Extent of change cannot exceed half the largest dimension (e.g. up to 20 feet for a 40-foot area).",
      "Transformation takes 10 minutes to complete. Terrain changes slowly, so creatures cannot usually be trapped or harmed.",
      "At the end of every 10 minutes spent concentrating, you can choose a new area within range to affect.",
      "Cannot manipulate natural stone or stone construction. If reshaping undermines a structure, it might collapse. Plants are carried along with moved earth.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Target an area of dirt/sand/clay up to 40 feet on a side within 120 feet and track concentration up to 2 hours.",
        "Adjudicate gradual earth alterations (up to 20 feet elevation shift, taking 10 minutes). Cannot alter natural stone.",
        "Every 10 minutes, allow the caster to select another adjacent or in-range patch to reshape.",
      ],
    },
    isManualOverride: true,
    notes:
      "Concentration up to 2 hours. Gradually reshapes dirt, sand, or clay up to 40 ft across by up to 20 ft in elevation over 10 minutes per area. Does not affect stone or stone constructions.",
  },

  wind_walk: {
    id: "wind_walk",
    name: "Wind Walk",
    category: {
      spellType: "spell",
      school: "transmutation",
      level: 6,
      classes: ["druid"],
      source: "Player's Handbook (2024), pg. 341",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 minute",
      range: "30 feet",
      components: "V, S, M (a candle)",
      duration: "8 hours",
    },
    damage: [],
    effectNotes: [
      "You and up to ten willing creatures within 30 feet assume cloud forms for 8 hours.",
      "While in cloud form: Fly Speed 300 feet (can hover), Immunity to Prone condition, Resistance to Bludgeoning, Piercing, and Slashing damage.",
      "Only permitted actions: Dash action or Magic action to begin 1-minute transformation to revert (target has Stunned condition while transforming). Reverting to cloud form also takes Magic action and 1-minute transformation.",
      "Descends 60 feet per round safely for 1 minute if flying when spell ends.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Target up to 10 willing creatures within 30 feet.",
        "Grant cloud form: Fly Speed 300 ft (hover), Prone immunity, B/P/S resistance for 8 hours.",
        "Permit only Dash or 1-minute reversion action (Stunned while transitioning).",
        "Safe descent (60 ft/round for 1 min) when spell ends.",
      ],
    },
    isManualOverride: true,
    notes:
      "1-minute cast, 8 hours (no concentration). Up to 10 willing creatures gain cloud form: Fly Speed 300 ft (hover), Prone immunity, Resistance to B/P/S damage. Only Dash or 1-min reversion (Stunned while reverting) permitted.",
  },

    // Level 7 (4 spells)
    regenerate: {
    id: "regenerate",
    name: "Regenerate",
    category: {
      spellType: "spell",
      school: "transmutation",
      level: 7,
      classes: ["bard", "cleric", "druid"],
      source: "Player's Handbook (2024), pg. 311",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 minute",
      range: "Touch",
      components: "V, S, M (a prayer wheel)",
      duration: "1 hour",
    },
    interaction: { type: "utility" },
    damage: [
      {
        dice: "4d8+15",
        type: "healing",
        isBase: true,
        condition: "Immediate Hit Points regained",
      },
    ],
    effectNotes: [
      "Touch a creature: it immediately regains 4d8 + 15 Hit Points.",
      "For the 1-hour duration (no concentration), the target regains 1 Hit Point at the start of each of its turns.",
      "Any severed body parts regrow after 2 minutes.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Touch target; roll 4d8 + 15 healing immediately.",
        "Track 1-hour duration (no concentration); restore 1 HP at the start of each of target's turns.",
        "Regrow severed body parts after 2 minutes.",
      ],
    },
    isManualOverride: true,
    notes:
      "1-minute cast, 1 hour (no concentration). Target regains 4d8 + 15 HP immediately, then 1 HP at start of each turn. Severed limbs regrow after 2 minutes.",
  },

  reverse_gravity: {
    id: "reverse_gravity",
    name: "Reverse Gravity",
    category: {
      spellType: "spell",
      school: "transmutation",
      level: 7,
      classes: ["druid", "sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 312",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "100 ft.",
      components: "V, S, M (a lodestone and iron filings)",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "save", saveAbility: "DEX" },
    area: { shape: "Cylinder", sizeFeet: 50, heightFeet: 100 },
    damage: [],
    effectNotes: [
      "Reverses gravity in a 50-foot-radius, 100-foot-high Cylinder centered on a point within 100 feet lasting up to 1 minute with concentration.",
      "All unanchored creatures and objects fall upward to the top of the Cylinder.",
      "Dexterity saving throw allows a creature to grab a fixed object within reach to avoid falling upward.",
      "Creatures/objects striking a ceiling or obstacle take falling damage as if from a downward fall (1d6 bludgeoning per 10 ft).",
      "Creatures reaching top without striking anything hover there until spell ends, then fall downward.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Place 50-ft radius x 100-ft high Cylinder within 100 feet; track concentration up to 1 minute.",
        "Prompt Dexterity save for unanchored creatures near fixed objects to grab on.",
        "Fall creatures/objects upward; apply falling damage if striking ceiling/obstacle or hover at top.",
        "When spell ends, drop suspended creatures/objects downward.",
      ],
    },
    isManualOverride: true,
    notes:
      "50-ft radius, 100-ft high Cylinder. Concentration up to 1 minute. Unanchored targets fall upward to top of cylinder (DEX save to grab fixed object). Striking obstacles deals falling damage. Hovers at top until spell ends, then falls downward.",
  },

  sequester: {
    id: "sequester",
    name: "Sequester",
    category: {
      spellType: "spell",
      school: "transmutation",
      level: 7,
      classes: ["wizard"],
      source: "Player's Handbook (2024), pg. 315",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Touch",
      components:
        "V, S, M (gem dust worth 5,000+ GP, which the spell consumes)",
      duration: "Until dispelled",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Touch an object or willing creature to magically sequester it until dispelled.",
      "Target gains Invisible condition and cannot be targeted by Divination spells, detected by magic, or scried upon.",
      "Creature target enters suspended animation: Unconscious condition, does not age, and does not require food, water, or air.",
      "Can set an optional trigger condition to end early (must occur or be visible within 1 mile).",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Verify 5,000+ GP gem dust consumed. Touch willing creature or object.",
        "Apply Invisible condition and complete immunity to Divination / magical detection.",
        "If creature: apply Unconscious condition, halt aging and metabolic needs.",
        "Record optional ending condition occurring within 1 mile.",
      ],
    },
    isManualOverride: true,
    notes:
      "Consumes 5,000+ GP gem dust. Permanent until dispelled. Touched target becomes Invisible and undetectable by Divination. Living creatures enter suspended animation (Unconscious, ageless, no air/food). Optional trigger condition within 1 mile to dismiss.",
  },

  // Simbul's Synostodweomer (Forgotten Realms: Heroes of Faerûn, pg. 145)
  simbuls_synostodweomer: {
    id: "simbuls_synostodweomer",
    name: "Simbul's Synostodweomer",
    category: {
      spellType: "spell",
      school: "transmutation",
      level: 7,
      classes: ["sorcerer", "wizard"],
      source: "Forgotten Realms: Heroes of Faerûn, pg. 145",
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
      "Imbue touched creature with magical healing energy for 1 hour without concentration.",
      "Whenever target casts a spell using a spell slot, target can immediately roll unexpended Hit Point Dice equal to the slot level and regain HP equal to roll total plus your spellcasting ability modifier (dice are then expended).",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Touch creature; apply 1-hour healing aura (no concentration).",
        "When target casts a slotted spell, allow spending up to slot level Hit Point Dice to heal roll total + caster modifier.",
      ],
    },
    isManualOverride: true,
    notes:
      "Forgotten Realms: Heroes of Faerûn, pg. 145. 1 hour (no concentration). Touch. When target casts slotted spell, can expend up to slot level Hit Dice to regain HP equal to roll + caster modifier.",
  },

    // Level 8 (4 spells)
    // Animal Shapes (Player's Handbook 2024, pg. 240; errata applied)
  animal_shapes: {
    id: "animal_shapes",
    name: "Animal Shapes",
    category: {
      spellType: "spell",
      school: "transmutation",
      level: 8,
      classes: ["druid"],
      source: "Player's Handbook (2024), pg. 240; errata applied",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "30 ft.",
      components: "V, S",
      duration: "24 hours",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Choose any number of willing creatures you can see in range. Each becomes a Large or smaller Beast of CR 4 or lower; you can use a Magic action on later turns to change their forms.",
      "Targets use the Beast's statistics but retain creature type, HP, Hit Dice, alignment, communication, and Intelligence, Wisdom, and Charisma. They cannot cast spells, and equipment melds into the form.",
      "Each target gains Temporary HP equal to the first Beast form's HP. The transformation ends after 24 hours, when those Temporary HP are gone, or when the target ends it as a Bonus Action. Temporary HP remaining when the spell ends vanish.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Choose willing targets and eligible Beast forms; replace statistics while preserving the spell's listed retained traits.",
        "Track each target's Temporary HP and transformation duration separately; apply the PHB 2024 errata to the Temporary HP and end conditions.",
      ],
    },
    isManualOverride: true,
    notes:
      "Manual transformation; use creature stat blocks and track each target separately. PHB 2024 errata clarifies that the Temporary HP vanish when the spell ends and that a target can end the form as a Bonus Action.",
  },

  // Control Weather (D&D Free Rules 2024, Spell Descriptions)
  control_weather: {
    id: "control_weather",
    name: "Control Weather",
    category: {
      spellType: "spell",
      school: "transmutation",
      level: 8,
      classes: ["cleric", "druid", "wizard"],
      source: "Player's Handbook (2024), pg. 257",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "10 minutes",
      range: "Self (5-mile radius)",
      components: "V, S, M (burning incense)",
      duration: "Concentration, up to 8 hours",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "You must be outdoors to cast this spell; it ends early if you go indoors. The GM determines current weather. You can shift precipitation, temperature, and wind by one stage at a time; wind direction can also change.",
      "New conditions take 1d4 x 10 minutes to take effect. Once in effect, you can change them again. Weather gradually returns to normal after the spell ends.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Record each current weather stage, chosen one-stage change, wind direction, and the 1d4 x 10 minute onset. GM adjudicates local weather and gradual return to normal; ending concentration if the caster enters indoors.",
      ],
    },
    isManualOverride: true,
    notes:
      "Weather is set by the GM and changes gradually; the effect is narrative and requires ongoing concentration tracking.",
  },

  earthquake: {
    id: "earthquake",
    name: "Earthquake",
    category: {
      spellType: "spell",
      school: "transmutation",
      level: 8,
      classes: ["cleric", "druid", "sorcerer"],
      source: "Player's Handbook (2024), pg. 267",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "500 ft.",
      components: "V, S, M (a fractured rock)",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "save", saveAbility: "DEX" },
    damage: [
      {
        dice: "1d6",
        type: "bludgeoning",
        isBase: false,
        condition: "A creature falls into a fissure",
      },
      {
        dice: "12d6",
        type: "bludgeoning",
        isBase: false,
        condition: "A structure collapses onto a creature",
      },
    ],
    effectNotes: [
      "A 100-foot-radius circle of ground becomes Difficult Terrain. When cast and at the end of each of your turns, creatures on the ground there make a Dexterity save or fall Prone and lose Concentration.",
      "When cast, choose fissure locations in the area; each fissure is 1d10 x 10 feet deep and 10 feet wide. A creature in a fissure's space makes a Dexterity save or falls in; on a success, it moves with the fissure's edge. Structures take 50 Bludgeoning damage when the spell is cast and at the end of each of your turns; a structure reduced to 0 HP collapses, dealing 12d6 Bludgeoning damage to creatures beneath it, who fall Prone and are buried. A buried creature can use an action to make a DC 20 Strength (Athletics) check to escape; on a success it is no longer buried. A successful save against the collapse halves its damage only.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Track the 100-foot-radius ground area and concentration; resolve initial and end-of-turn Dexterity saves, Prone, and Concentration loss.",
        "Choose and map fissures; resolve their dimensions and creature saves. Track structure HP and repeat 50 damage at each trigger, then resolve collapse, buried state, escape checks, and damage manually.",
      ],
    },
    isManualOverride: true,
    notes:
      "Large-area terrain, fissure placement, structures, and buried creatures require GM adjudication; the spell does not automatically alter Owlbear terrain or tokens.",
  },

  // Iron Body (Arcana Unleashed, pg. 41)
  iron_body: {
    id: "iron_body",
    name: "Iron Body",
    category: {
      spellType: "spell",
      school: "transmutation",
      level: 8,
      classes: ["sorcerer", "warlock", "wizard"],
      source: "Arcana Unleashed, pg. 41",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Touch",
      components: "V, S, M (diamond dust worth 250+ GP, consumed)",
      duration: "Concentration, up to 1 hour",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Transform one willing touched creature into living metal for up to 1 hour with concentration.",
      "Exhaustion level cannot increase while transformed.",
      "Damage Resistances: Bludgeoning, Fire, Piercing, and Slashing.",
      "Damage Immunity: Poison.",
      "Condition Immunities: Paralyzed, Petrified, and Poisoned.",
      "If already Paralyzed, Petrified, or Poisoned when cast, those conditions immediately end.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Verify 250+ GP diamond dust consumed on cast.",
        "Target willing creature on touch; end Paralyzed/Petrified/Poisoned if active.",
        "Apply Resistances (Bludgeoning, Fire, Piercing, Slashing) and Immunities (Poison damage, Paralyzed, Petrified, Poisoned, Exhaustion cap).",
        "Track concentration up to 1 hour.",
      ],
    },
    isManualOverride: true,
    notes:
      "Arcana Unleashed, pg. 41. Conc up to 1 hour, consumes 250+ GP diamond dust. Living metal: Resist B/P/S/Fire, Immune Poison + Paralyzed/Petrified/Poisoned/Exhaustion.",
  },

    // Level 9 (3 spells)
    shapechange: {
    id: "shapechange",
    name: "Shapechange",
    category: {
      spellType: "spell",
      school: "transmutation",
      level: 9,
      classes: ["druid", "wizard"],
      source: "Player's Handbook (2024), pg. 315",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "Self",
      components: "V, S, M (a jade circlet worth 1,500+ GP)",
      duration: "Concentration, up to 1 hour",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Shape-shift into an eligible creature (CR <= your level/CR, seen before, non-Construct, non-Undead) lasting up to 1 hour with concentration.",
      "Gain Temporary Hit Points equal to the Hit Points of the form. The spell ends early if you have no Temporary Hit Points left (2024 rules).",
      "Retain alignment, mental ability scores, personality, and features unless specified. Can take a Magic action to shift into a different eligible form.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Verify 1,500+ GP jade circlet focus.",
        "Select eligible form (CR <= character level, seen before, not Construct/Undead).",
        "Grant Temporary Hit Points equal to form's HP; end spell early if Temp HP drops to 0.",
        "Allow Magic action to shift forms; track concentration up to 1 hour.",
      ],
    },
    isManualOverride: true,
    notes:
      "1 hour with concentration. CR <= level (seen before, non-Construct/Undead). 2024 revision: grants Temporary HP equal to form's HP; spell ends early when Temp HP hits 0. Magic action allows switching forms.",
  },

  time_stop: {
    id: "time_stop",
    name: "Time Stop",
    category: {
      spellType: "spell",
      school: "transmutation",
      level: 9,
      classes: ["sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 334",
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
      "Briefly stop the flow of time for everyone but yourself.",
      "Take 1d4 + 1 turns in a row, during which you can use actions and move as normal, while no time passes for others.",
      "Ends early if an action used during this period or effect created affects a creature other than you or an object worn/carried by someone else.",
      "Ends early if you move more than 1,000 feet from cast location.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "assisted",
      playtestStatus: "not-tested",
      manualSteps: [
        "Roll 1d4 + 1 for consecutive bonus turns granted.",
        "Allow caster to take turns while other creatures take no actions.",
        "End effect immediately if caster affects another creature or worn/carried object, or moves >1,000 ft away.",
      ],
    },
    isManualOverride: true,
    notes:
      "Take 1d4 + 1 consecutive turns in a row. No time passes for other creatures. Ends early if an action or effect affects another creature or worn/carried object, or if caster moves >1,000 ft.",
  },

  true_polymorph: {
    id: "true_polymorph",
    name: "True Polymorph",
    category: {
      spellType: "spell",
      school: "transmutation",
      level: 9,
      classes: ["bard", "warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 335",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "30 feet",
      components:
        "V, S, M (a drop of mercury, a dollop of gum arabic, and a wisp of smoke)",
      duration:
        "Concentration, up to 1 hour (Permanent until dispelled if maintained for full hour)",
    },
    interaction: { type: "save", saveAbility: "WIS" },
    damage: [],
    effectNotes: [
      "Transform one creature or nonmagical object within 30 feet. Unwilling creature makes Wisdom saving throw to negate.",
      "Lasts up to 1 hour (concentration); if maintained for the full duration, the spell lasts until dispelled.",
      "Creature into Creature: New form can be any kind with CR <= target's CR or level. Target gains Temporary Hit Points equal to new form's Hit Points. Spell ends early on target if it has no Temporary Hit Points left! Retains its own HP, HP Dice, alignment, and personality. Gear melds.",
      "Object into Creature: Turn object into any creature CR 9 or lower, size <= object's size. Friendly to caster and allies, obeys commands, acts after caster. After 1 hour, no longer controlled.",
      "Creature into Object: Size <= creature's size. Creature retains no memory after spell ends.",
    ],
    implementation: {
      sourceStatus: "checked",
      runtimeStatus: "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Target creature or object within 30 feet (WIS save if unwilling creature).",
        "Creature into Creature: new form CR <= target level/CR; grant Temp HP equal to form's HP; ends when Temp HP reaches 0.",
        "Object into Creature: CR <= 9, size <= object; Friendly creature acting after caster.",
        "Creature into Object: size <= creature; reverts when destroyed or dispelled.",
        "If concentration held for 1 hour, becomes permanent until dispelled.",
      ],
    },
    isManualOverride: true,
    notes:
      "Concentration up to 1 hour (becomes permanent until dispelled if held full hour). WIS save negates. Creature into Creature: CR <= target CR/level, gains Temp HP equal to form's HP (ends when Temp HP reaches 0). Object into Creature: CR <= 9, friendly. Creature into Object: size <= creature.",
  },
};
