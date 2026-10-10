import type { ManualActionFormula } from "../../../../types/manualFormula";
import { BEASTBORNE_FORMULAS } from "./subclasses/beastborne";
import { BEAST_MASTER_FORMULAS } from "./subclasses/beastMaster";
import { FEY_WANDERER_FORMULAS } from "./subclasses/feyWanderer";
import { GLOOM_STALKER_FORMULAS } from "./subclasses/gloomStalker";
import { GREEN_REAPER_FORMULAS } from "./subclasses/greenReaper";
import { HUNTER_FORMULAS } from "./subclasses/hunter";
import { PRIMORDIAL_ARCHER_FORMULAS } from "./subclasses/primordialArcher";
import { VERMIN_LORD_FORMULAS } from "./subclasses/verminLord";
import { WINTER_WALKER_FORMULAS } from "./subclasses/winterWalker";
import { BESTIAL_ASPECT_LEVELS } from "./subclasses/beastborne";

export const RANGER_CLASS_FORMULAS: Record<string, ManualActionFormula> = {
  huntersMark: {
    id: "embers:ranger:hunters-mark",
    name: "Hunter's Mark",
    kind: "class_feature",
    status: "verified",
    classes: ["ranger"],
    activationType: "bonus",
    operations: [
      {
        type: "apply_effect",
        name: "Quarry Mark",
        description:
          "Bonus Action mark quarry within 90 ft: deal extra 1d6 damage on weapon hits, and Advantage on Perception and Survival checks to track it.",
      },
    ],
    description: "Mystically mark a quarry to deal devastating hunter damage.",
    source: "Player's Handbook (2024), Ranger: Hunter's Mark",
  },
  deftExplorer: {
    id: "embers:ranger:deft-explorer",
    name: "Deft Explorer",
    kind: "class_feature",
    status: "verified",
    classes: ["ranger"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Wilderness Mastery",
        description:
          "Expertise in one proficient skill, two additional languages, and expert exploration capabilities.",
      },
    ],
    description:
      "Navigate rugged terrain and endure extreme environments with effortless expertise.",
    source: "Player's Handbook (2024), Ranger: Deft Explorer",
  },

  weaponMastery: {
    id: "embers:ranger:weapon-mastery",
    name: "Weapon Mastery",
    kind: "class_feature",
    status: "verified",
    classes: ["ranger"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Mastery Properties",
        description:
          "Use the mastery properties of 2 weapons of your choice.",
      },
    ],
    description:
      "Master the tactical properties of your chosen hunting weapons.",
    source: "Player's Handbook (2024), Ranger: Weapon Mastery",
  },

  favoredEnemy: {
    id: "embers:ranger:favored-enemy",
    name: "Favored Enemy",
    kind: "class_feature",
    status: "verified",
    classes: ["ranger"],
    activationType: "bonus",
    resource: {
      name: "Free Hunter's Mark",
      resetType: "Long Rest",
      scaling: {
        type: "level_table",
        classId: "ranger",
        table: [
          { minLevel: 1, value: 2 },
          { minLevel: 5, value: 3 },
          { minLevel: 9, value: 4 },
          { minLevel: 13, value: 5 },
          { minLevel: 17, value: 6 },
        ],
      },
    },
    operations: [
      {
        type: "apply_effect",
        name: "Free Quarry Mark",
        description:
          "You always have the Hunter's Mark spell prepared. You can cast it without expending a spell slot (2 uses at level 1, increasing to 6 uses at level 17; resets on Long Rest).",
      },
    ],
    description:
      "Always prepare Hunter's Mark and cast it multiple times per Long Rest without expending spell slots.",
    source: "Player's Handbook (2024), Ranger: Favored Enemy",
  },

  extraAttack: {
    id: "embers:ranger:extra-attack",
    name: "Extra Attack",
    kind: "class_feature",
    status: "verified",
    classes: ["ranger"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Multiattack Strike",
        description:
          "You can attack twice instead of once whenever you take the Attack action on your turn.",
      },
    ],
    description:
      "Attack twice whenever you take the Attack action on your turn.",
    source: "Player's Handbook (2024), Ranger: Extra Attack",
  },

  roving: {
    id: "embers:ranger:roving",
    name: "Roving",
    kind: "class_feature",
    status: "verified",
    classes: ["ranger"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Wilderness Mobility",
        description:
          "Your Speed increases by 10 feet, and you gain Climb and Swim speeds equal to your Speed while not wearing Heavy armor.",
      },
    ],
    description:
      "Enhanced speed, climbing, and swimming while traveling light.",
    source: "Player's Handbook (2024), Ranger: Roving",
  },

  tireless: {
    id: "embers:ranger:tireless",
    name: "Tireless",
    kind: "class_feature",
    status: "verified",
    classes: ["ranger"],
    activationType: "action",
    resource: {
      name: "Tireless Vigor",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "apply_effect",
        name: "Restorative Vigor",
        description:
          "As an Action, give yourself Temporary HP equal to 1d8 + your Wisdom modifier (Wisdom modifier times per Long Rest). In addition, your Exhaustion level decreases by 1 whenever you finish a Short Rest.",
      },
    ],
    description:
      "Draw upon internal stamina to grant yourself Temporary HP and shed exhaustion on Short Rests.",
    source: "Player's Handbook (2024), Ranger: Tireless",
  },

  relentlessHunter: {
    id: "embers:ranger:relentless-hunter",
    name: "Relentless Hunter",
    kind: "class_feature",
    status: "verified",
    classes: ["ranger"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Unbroken Quarry Focus",
        description:
          "Taking damage cannot break your Concentration on the Hunter's Mark spell.",
      },
    ],
    description:
      "Maintain unbreakable hunter concentration: taking damage never breaks Hunter's Mark.",
    source: "Player's Handbook (2024), Ranger: Relentless Hunter",
  },

  naturesVeil: {
    id: "embers:ranger:natures-veil",
    name: "Nature's Veil",
    kind: "class_feature",
    status: "verified",
    classes: ["ranger"],
    activationType: "bonus",
    resource: {
      name: "Nature's Veil",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "apply_effect",
        name: "Camouflage Vanish",
        description:
          "As a Bonus Action, invoke nature spirits to gain the Invisible condition until the end of your next turn (Wisdom modifier uses per Long Rest).",
      },
    ],
    description:
      "Vanish into nature's embrace, becoming Invisible as a Bonus Action.",
    source: "Player's Handbook (2024), Ranger: Nature's Veil",
  },

  preciseHunter: {
    id: "embers:ranger:precise-hunter",
    name: "Precise Hunter",
    kind: "class_feature",
    status: "verified",
    classes: ["ranger"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Quarry Advantage",
        description:
          "You have Advantage on attack rolls against the creature marked by your Hunter's Mark.",
      },
    ],
    description:
      "Gain Advantage on all attack rolls against your marked quarry.",
    source: "Player's Handbook (2024), Ranger: Precise Hunter",
  },

  feralSenses: {
    id: "embers:ranger:feral-senses",
    name: "Feral Senses",
    kind: "class_feature",
    status: "verified",
    classes: ["ranger"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Apex Perception",
        description: "You gain Blindsight with a range of 30 feet.",
      },
    ],
    description:
      "Heightened senses grant 30 feet of Blindsight, piercing illusions and total darkness.",
    source: "Player's Handbook (2024), Ranger: Feral Senses",
  },

  foeSlayer: {
    id: "embers:ranger:foe-slayer",
    name: "Foe Slayer",
    kind: "class_feature",
    status: "verified",
    classes: ["ranger"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Lethal Quarry Die",
        description:
          "The damage die of your Hunter's Mark increases from 1d6 to 1d10.",
      },
    ],
    description:
      "Level 20 Capstone: The damage die of your Hunter's Mark increases to 1d10.",
    source: "Player's Handbook (2024), Ranger: Foe Slayer",
  },
  ...BEASTBORNE_FORMULAS,
  ...BEAST_MASTER_FORMULAS,
  ...FEY_WANDERER_FORMULAS,
  ...GLOOM_STALKER_FORMULAS,
  ...GREEN_REAPER_FORMULAS,
  ...HUNTER_FORMULAS,
  ...PRIMORDIAL_ARCHER_FORMULAS,
  ...VERMIN_LORD_FORMULAS,
  ...WINTER_WALKER_FORMULAS,
};

export {
  BEASTBORNE_FORMULAS,
  BEAST_MASTER_FORMULAS,
  FEY_WANDERER_FORMULAS,
  GLOOM_STALKER_FORMULAS,
  GREEN_REAPER_FORMULAS,
  HUNTER_FORMULAS,
  PRIMORDIAL_ARCHER_FORMULAS,
  VERMIN_LORD_FORMULAS,
  WINTER_WALKER_FORMULAS,
  BESTIAL_ASPECT_LEVELS,
};
