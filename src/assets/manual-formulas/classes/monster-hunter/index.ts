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
