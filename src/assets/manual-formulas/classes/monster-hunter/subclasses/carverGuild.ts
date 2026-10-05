import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const CARVER_GUILD_FORMULAS: Record<string, ManualActionFormula> = {
  equippedForBattle: {
    id: "embers:monster-hunter:carver-guild:equipped-for-battle",
    name: "Equipped for Battle",
    kind: "class_feature",
    status: "verified",
    classes: ["monster-hunter"],
    subclass: "carverGuild",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Equipped for Battle",
        description: "You gain training with Heavy armor.",
      },
    ],
    description: "You gain training with Heavy armor.",
    source: "Grim Hollow: Player’s Guide, monster-hunter: Carver Guild",
  },

  closeQuarters: {
    id: "embers:monster-hunter:carver-guild:close-quarters",
    name: "Close Quarters",
    kind: "class_feature",
    status: "verified",
    classes: ["monster-hunter"],
    subclass: "carverGuild",
    activationType: "reaction",
    operations: [
      {
        type: "apply_effect",
        name: "Close Quarters",
        description:
          "Your skill in close combat enables you to inflict crushing blows while keeping your opponent off balance. When you hit a creature with an attack roll using a Melee weapon, you can take a Reaction to deal an extra 2d6 damage of the same type dealt by the weapon. That creature has Disadvantage on its next attack roll before the start of your next turn.\n\nThe damage becomes 4d6 when you reach Monster Hunter level 11.",
      },
    ],
    description:
      "Your skill in close combat enables you to inflict crushing blows while keeping your opponent off balance. When you hit a creature with an attack roll using a Melee weapon, you can take a Reaction to deal an extra 2d6 damage of the same type dealt ...",
    source: "Grim Hollow: Player’s Guide, monster-hunter: Carver Guild",
  },

  trueGrit: {
    id: "embers:monster-hunter:carver-guild:true-grit",
    name: "True Grit",
    kind: "class_feature",
    status: "verified",
    classes: ["monster-hunter"],
    subclass: "carverGuild",
    activationType: "reaction",
    operations: [
      {
        type: "apply_effect",
        name: "True Grit",
        description:
          "You have Advantage on saving throws you make to avoid or end the Frightened condition, and you are immune to the Frightened condition caused by creature types in your Monster Grimoire.\n\nAdditionally, when you hit a creature with an attack as part of a Reaction, you can choose a Frightened creature within 60 feet that can see you (including yourself). The condition ends on that creature.",
      },
    ],
    description:
      "You have Advantage on saving throws you make to avoid or end the Frightened condition, and you are immune to the Frightened condition caused by creature types in your Monster Grimoire.\n\nAdditionally, when you hit a creature with an attack as part ...",
    source: "Grim Hollow: Player’s Guide, monster-hunter: Carver Guild",
  },

  terrorizeTheTerrors: {
    id: "embers:monster-hunter:carver-guild:terrorize-the-terrors",
    name: "Terrorize the Terrors",
    kind: "class_feature",
    status: "verified",
    classes: ["monster-hunter"],
    subclass: "carverGuild",
    activationType: "reaction",
    operations: [
      {
        type: "apply_effect",
        name: "Terrorize the Terrors",
        description:
          "Your reputation has become such that monsters preying on the fearful have come to fear you. When you hit a creature with an attack as part of a Reaction, you can force the creature to make a Wisdom saving throw or have the Frightened condition until the end of your next turn. The DC for the saving throw equals 8 plus your Intelligence modifier and your Proficiency Bonus.",
      },
    ],
    description:
      "Your reputation has become such that monsters preying on the fearful have come to fear you. When you hit a creature with an attack as part of a Reaction, you can force the creature to make a Wisdom saving throw or have the Frightened condition unt...",
    source: "Grim Hollow: Player’s Guide, monster-hunter: Carver Guild",
  },

  deadlyRedirect: {
    id: "embers:monster-hunter:carver-guild:deadly-redirect",
    name: "Deadly Redirect",
    kind: "class_feature",
    status: "verified",
    classes: ["monster-hunter"],
    subclass: "carverGuild",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Deadly Redirect",
        description:
          "Your strikes have become even deadlier. The extra damage of your Close Quarters increases to 6d6.\n\nIn addition, if you deal damage to a creature with Close Quarters, the target has Disadvantage on all attack rolls until the end of your next turn.",
      },
    ],
    description:
      "Your strikes have become even deadlier. The extra damage of your Close Quarters increases to 6d6.\n\nIn addition, if you deal damage to a creature with Close Quarters, the target has Disadvantage on all attack rolls until the end of your next turn.",
    source: "Grim Hollow: Player’s Guide, monster-hunter: Carver Guild",
  },

  controlledFootwork: {
    id: "embers:monster-hunter:carver-guild:controlled-footwork",
    name: "Controlled Footwork",
    kind: "class_feature",
    status: "verified",
    classes: ["monster-hunter"],
    subclass: "carverGuild",
    activationType: "reaction",
    operations: [
      {
        type: "apply_effect",
        name: "Controlled Footwork",
        description:
          "You are such an effective combatant that you are always in control and never off balance. You can take a Reaction twice in a round instead of once.",
      },
    ],
    description:
      "You are such an effective combatant that you are always in control and never off balance. You can take a Reaction twice in a round instead of once.",
    source: "Grim Hollow: Player’s Guide, monster-hunter: Carver Guild",
  },
};
