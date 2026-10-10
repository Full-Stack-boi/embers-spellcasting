import type { ManualActionFormula } from "../../../../types/manualFormula";
import { CARVER_GUILD_FORMULAS } from "./subclasses/carverGuild";
import { DEVOURER_GUILD_FORMULAS } from "./subclasses/devourerGuild";
import { OCCULTIST_GUILD_FORMULAS } from "./subclasses/occultistGuild";
import { TRAPPER_GUILD_FORMULAS } from "./subclasses/trapperGuild";

export const MONSTER_HUNTER_CLASS_FORMULAS: Record<
  string,
  ManualActionFormula
> = {
  monsterGrimoire: {
    id: "embers:monster-hunter:monster-grimoire",
    name: "Monster Grimoire",
    kind: "class_feature",
    status: "verified",
    classes: ["monster-hunter"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Studied Monster Lore",
        description:
          "Maintain records of creature types. Double your Proficiency Bonus on Arcana, History, Nature, and Religion checks to recall information about studied types, and learn their languages.",
      },
    ],
    description:
      "You keep a personal grimoire detailing the weaknesses, anatomies, and behaviors of terrifying monsters.",
    source: "Grim Hollow: Player’s Guide, Monster Hunter: Monster Grimoire",
  },

  weaponMastery: {
    id: "embers:monster-hunter:weapon-mastery",
    name: "Weapon Mastery (Monster Hunter)",
    kind: "class_feature",
    status: "verified",
    classes: ["monster-hunter"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Monster Hunter Weapon Mastery",
        description: "You gain mastery properties for two kinds of simple or martial melee weapons of your choice.",
      },
    ],
    description: "Dedicated training in the mastery of specialized monster-hunting weapons.",
    source: "Grim Hollow: Player’s Guide, Monster Hunter: Weapon Mastery",
  },

  studiedResponse: {
    id: "embers:monster-hunter:studied-response",
    name: "Studied Response",
    kind: "class_feature",
    status: "verified",
    classes: ["monster-hunter"],
    activationType: "reaction",
    operations: [
      {
        type: "apply_effect",
        name: "Preemptive Strike",
        description:
          "When a creature within 60 feet targets you or an ally with an attack, take a Reaction before the attack roll to make one weapon or unarmed attack against that creature. If you miss, your Reaction is refunded.",
      },
    ],
    description:
      "Strike a monster's most vulnerable weak point at the exact instant it commits to an attack.",
    source: "Grim Hollow: Player’s Guide, Monster Hunter: Studied Response",
  },

  expertStrike: {
    id: "embers:monster-hunter:expert-strike",
    name: "Expert Strike",
    kind: "class_feature",
    status: "verified",
    classes: ["monster-hunter"],
    activationType: "special",
    weaponRider: {
      type: "weapon_damage_rider",
      id: "embers:monster-hunter:expert-strike:rider",
      name: "Expert Strike",
      classId: "monsterHunter",
      minLevel: 5,
      frequency: "every_hit",
      damageType: "weapon",
    },
    operations: [
      {
        type: "apply_effect",
        name: "Calculated Weapon Precision",
        description:
          "Add your Intelligence modifier to weapon and Unarmed Strike attack rolls and damage rolls.",
      },
    ],
    description:
      "Apply encyclopedic physiological knowledge to weapon strikes.",
    source: "Grim Hollow: Player’s Guide, Monster Hunter: Expert Strike",
  },

  improvedMonsterGrimoire: {
    id: "embers:monster-hunter:improved-monster-grimoire",
    name: "Improved Monster Grimoire",
    kind: "class_feature",
    status: "verified",
    classes: ["monster-hunter"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Expanded Grimoire Studies",
        description:
          "Choose an additional creature type to study at 6th level and again at 13th level. You gain all Grimoire benefits against those creature types.",
      },
    ],
    description: "Expand your catalog of monster weaknesses and physiological traits.",
    source: "Grim Hollow: Player’s Guide, Monster Hunter: Improved Monster Grimoire",
  },

  knowledgeableDefense: {
    id: "embers:monster-hunter:knowledgeable-defense",
    name: "Knowledgeable Defense",
    kind: "class_feature",
    status: "verified",
    classes: ["monster-hunter"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Anticipate Attacks",
        description:
          "Add your Intelligence modifier to your Armor Class and saving throws against attacks and abilities made by creatures cataloged in your Monster Grimoire.",
      },
    ],
    description: "Read monster telegraphs and attack patterns before they land.",
    source: "Grim Hollow: Player’s Guide, Monster Hunter: Knowledgeable Defense",
  },

  extraAttack: {
    id: "embers:monster-hunter:extra-attack",
    name: "Extra Attack (Monster Hunter)",
    kind: "class_feature",
    status: "verified",
    classes: ["monster-hunter"],
    activationType: "action",
    operations: [
      {
        type: "apply_effect",
        name: "Relentless Hunter Strikes",
        description: "You can attack twice instead of once whenever you take the Attack action on your turn.",
      },
    ],
    description: "Chain multiple precision strikes against monstrous foes.",
    source: "Grim Hollow: Player’s Guide, Monster Hunter: Extra Attack",
  },

  lairSense: {
    id: "embers:monster-hunter:lair-sense",
    name: "Lair Sense",
    kind: "class_feature",
    status: "verified",
    classes: ["monster-hunter"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Environmental Awareness",
        description:
          "You can discern whether an area is a creature's lair and cannot be surprised while within a monster's lair or natural habitat.",
      },
    ],
    description: "Heightened instincts detect ambushes and predatory terrain.",
    source: "Grim Hollow: Player’s Guide, Monster Hunter: Lair Sense",
  },

  slayersAid: {
    id: "embers:monster-hunter:slayers-aid",
    name: "Slayer's Aid",
    kind: "class_feature",
    status: "verified",
    classes: ["monster-hunter"],
    activationType: "bonus",
    operations: [
      {
        type: "apply_effect",
        name: "Direct Allies to Weak Point",
        description:
          "As a Bonus Action, call out a monster's flaw to all allies within 30 feet. Allies gain Advantage on their next attack roll against that creature before your next turn.",
      },
    ],
    description: "Command and direct your party to ruthlessly capitalize on monster vulnerabilities.",
    source: "Grim Hollow: Player’s Guide, Monster Hunter: Slayer's Aid",
  },

  graveStrike: {
    id: "embers:monster-hunter:grave-strike",
    name: "Grave Strike",
    kind: "class_feature",
    status: "verified",
    classes: ["monster-hunter"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Lethal Execution",
        description:
          "Level 20 Capstone: When you hit a creature studied in your Monster Grimoire that has 50 Hit Points or fewer, you can force it to make a Constitution saving throw (DC 8 + PB + INT). On a failure, the creature is instantly reduced to 0 Hit Points.",
      },
    ],
    description:
      "Level 20 Capstone: Execute a studied beast with unmatched surgical precision.",
    source: "Grim Hollow: Player’s Guide, Monster Hunter: Grave Strike",
  },

  ...CARVER_GUILD_FORMULAS,
  ...DEVOURER_GUILD_FORMULAS,
  ...OCCULTIST_GUILD_FORMULAS,
  ...TRAPPER_GUILD_FORMULAS,
};

export {
  CARVER_GUILD_FORMULAS,
  DEVOURER_GUILD_FORMULAS,
  OCCULTIST_GUILD_FORMULAS,
  TRAPPER_GUILD_FORMULAS,
};
