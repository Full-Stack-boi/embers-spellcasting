import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const LIFE_DOMAIN_FORMULAS: Record<string, ManualActionFormula> = {
  discipleOfLife: {
    id: "embers:cleric:life:disciple-of-life",
    name: "Disciple of Life",
    kind: "class_feature",
    status: "verified",
    classes: ["cleric"],
    subclass: "lifeDomain",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Empowered Restoration",
        description:
          "Whenever you cast a spell with a spell slot that restores Hit Points to a creature, the creature regains additional HP equal to 2 + the spell's level.",
      },
    ],
    description: "Infuse your healing magic with surplus divine energy.",
    source: "Player's Handbook (2024), Cleric: Life Domain",
  },

  preserveLife: {
    id: "embers:cleric:life:preserve-life",
    name: "Channel Divinity: Preserve Life",
    kind: "class_feature",
    status: "verified",
    classes: ["cleric"],
    subclass: "lifeDomain",
    activationType: "action",
    operations: [
      {
        type: "apply_effect",
        name: "Aura of Healing",
        description:
          "Action expend 1 Channel Divinity: restore Hit Points equal to 5x Cleric level, divided among bloodied creatures within 30 feet of you (cannot heal above half max HP).",
      },
    ],
    description:
      "Channel pure life-giving divine light to revitalize severely wounded allies.",
    source: "Player's Handbook (2024), Cleric: Life Domain",
  },

  blessedHealer: {
    id: "embers:cleric:life:blessed-healer",
    name: "Blessed Healer",
    kind: "class_feature",
    status: "verified",
    classes: ["cleric"],
    subclass: "lifeDomain",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Reciprocal Healing",
        description:
          "When you cast a healing spell on another creature, you regain Hit Points equal to 2 + the spell's level.",
      },
    ],
    description:
      "Heal yourself whenever providing life-saving restoration to allies.",
    source: "Player's Handbook (2024), Cleric: Life Domain",
  },

  supremeHealing: {
    id: "embers:cleric:life:supreme-healing",
    name: "Supreme Healing",
    kind: "class_feature",
    status: "verified",
    classes: ["cleric"],
    subclass: "lifeDomain",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Maximized Healing",
        description:
          "Whenever you would normally roll one or more dice to restore Hit Points with a spell, you instead use the highest number possible for each die.",
      },
    ],
    description:
      "Level 17 Capstone: Maximize all healing dice rolled by your spells without rolling.",
    source: "Player's Handbook (2024), Cleric: Life Domain",
  },
};
