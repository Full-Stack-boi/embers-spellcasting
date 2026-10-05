import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const BLADESINGER_FORMULAS: Record<string, ManualActionFormula> = {
  bladesong: {
    id: "embers:wizard:bladesinger:bladesong",
    name: "Bladesong",
    kind: "class_feature",
    status: "verified",
    classes: ["wizard"],
    subclass: "bladesinger",
    activationType: "bonus",
    resource: {
      name: "Bladesong",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Bladesong",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Bladesong",
        description:
          "As a Bonus Action, you invoke an elven magic called the Bladesong, provided you aren’t wearing armor or using a Shield.\n\nThe Bladesong lasts for 1 minute and ends early if you have the Incapacitated condition, if you don armor or a Shield, or if you use two hands to make an attack with a weapon. You can dismiss the Bladesong at any time (no action required).\n\nWhile the Bladesong is active, you gain the following benefits. You can invoke the Bladesong a number of times equal to your Intelligen...",
      },
    ],
    description:
      "As a Bonus Action, you invoke an elven magic called the Bladesong, provided you aren’t wearing armor or using a Shield.\n\nThe Bladesong lasts for 1 minute and ends early if you have the Incapacitated condition, if you don armor or a Shield, or if y...",
    source: "Forgotten Realms: Heroes of Faerûn, Wizard: Bladesinger",
  },

  trainingInWarAndSong: {
    id: "embers:wizard:bladesinger:training-in-war-and-song",
    name: "Training in War and Song",
    kind: "class_feature",
    status: "verified",
    classes: ["wizard"],
    subclass: "bladesinger",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Training in War and Song",
        description:
          "You gain proficiency with all Melee Martial weapons that don’t have the Two-Handed or Heavy property. You can use a Melee weapon with which you have proficiency as a Spellcasting Focus for your Wizard spells.\n\nYou also gain proficiency in one of the following skills of your choice: Acrobatics, Athletics, Performance, or Persuasion.",
      },
    ],
    description:
      "You gain proficiency with all Melee Martial weapons that don’t have the Two-Handed or Heavy property. You can use a Melee weapon with which you have proficiency as a Spellcasting Focus for your Wizard spells.\n\nYou also gain proficiency in one of t...",
    source: "Forgotten Realms: Heroes of Faerûn, Wizard: Bladesinger",
  },

  extraAttack: {
    id: "embers:wizard:bladesinger:extra-attack",
    name: "Extra Attack",
    kind: "class_feature",
    status: "verified",
    classes: ["wizard"],
    subclass: "bladesinger",
    activationType: "action",
    operations: [
      {
        type: "apply_effect",
        name: "Extra Attack",
        description:
          "You can attack twice, instead of once, whenever you take the Attack action on your turn. Moreover, you can cast one of your Wizard cantrips that has a casting time of an action in place of one of those attacks.",
      },
    ],
    description:
      "You can attack twice, instead of once, whenever you take the Attack action on your turn. Moreover, you can cast one of your Wizard cantrips that has a casting time of an action in place of one of those attacks.",
    source: "Forgotten Realms: Heroes of Faerûn, Wizard: Bladesinger",
  },

  songOfDefense: {
    id: "embers:wizard:bladesinger:song-of-defense",
    name: "Song of Defense",
    kind: "class_feature",
    status: "verified",
    classes: ["wizard"],
    subclass: "bladesinger",
    activationType: "reaction",
    resource: {
      name: "Song of Defense",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Song of Defense",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Song of Defense",
        description:
          "When you take damage while your Bladesong is active, you can take a Reaction to expend one spell slot and reduce the damage taken by an amount equal to five times the spell slot’s level.",
      },
    ],
    description:
      "When you take damage while your Bladesong is active, you can take a Reaction to expend one spell slot and reduce the damage taken by an amount equal to five times the spell slot’s level.",
    source: "Forgotten Realms: Heroes of Faerûn, Wizard: Bladesinger",
  },

  songOfVictory: {
    id: "embers:wizard:bladesinger:song-of-victory",
    name: "Song of Victory",
    kind: "class_feature",
    status: "verified",
    classes: ["wizard"],
    subclass: "bladesinger",
    activationType: "bonus",
    operations: [
      {
        type: "apply_effect",
        name: "Song of Victory",
        description:
          "After you cast a spell that has a casting time of an action, you can make one attack with a weapon as a Bonus Action.",
      },
    ],
    description:
      "After you cast a spell that has a casting time of an action, you can make one attack with a weapon as a Bonus Action.",
    source: "Forgotten Realms: Heroes of Faerûn, Wizard: Bladesinger",
  },
};
