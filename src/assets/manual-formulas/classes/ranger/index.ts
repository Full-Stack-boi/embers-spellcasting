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
          "Expertise in one proficient skill, languages, and climb/swim speeds equal to Speed (Roving); gain Temporary HP at start of turn (Tireless).",
      },
    ],
    description:
      "Navigate rugged terrain and endure extreme environments with effortless expertise.",
    source: "Player's Handbook (2024), Ranger: Deft Explorer",
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
