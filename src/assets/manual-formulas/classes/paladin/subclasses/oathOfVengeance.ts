import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const OATH_OF_VENGEANCE_FORMULAS: Record<string, ManualActionFormula> = {
  vowOfEnmity: {
    id: "embers:paladin:vengeance:vow-of-enmity",
    name: "Channel Divinity: Vow of Enmity",
    kind: "class_feature",
    status: "verified",
    classes: ["paladin"],
    subclass: "oathOfVengeance",
    activationType: "bonus",
    operations: [
      {
        type: "apply_effect",
        name: "Inescapable Nemesis",
        description:
          "Bonus Action expend 1 Channel Divinity: gain Advantage on attack rolls against target within 30 feet for 1 minute; if it drops to 0 HP, transfer vow to new creature as Bonus Action.",
      },
    ],
    description:
      "Mark a chosen foe as your sworn quarry, mercilessly hunting it down.",
    source: "Player's Handbook (2024), Paladin: Oath of Vengeance",
  },

  abjureEnemy: {
    id: "embers:paladin:vengeance:abjure-enemy",
    name: "Channel Divinity: Abjure Enemy",
    kind: "class_feature",
    status: "verified",
    classes: ["paladin"],
    subclass: "oathOfVengeance",
    activationType: "action",
    operations: [
      {
        type: "apply_effect",
        name: "Paralyzing Dread",
        description:
          "Action expend 1 Channel Divinity: creature within 60 feet makes Wisdom save; on failed save it is Frightened and its Speed is reduced to 0 for 1 minute.",
      },
    ],
    description: "Strike paralyzing terror into the heart of a transgressor.",
    source: "Player's Handbook (2024), Paladin: Oath of Vengeance",
  },

  relentlessAvenger: {
    id: "embers:paladin:vengeance:relentless-avenger",
    name: "Relentless Avenger",
    kind: "class_feature",
    status: "verified",
    classes: ["paladin"],
    subclass: "oathOfVengeance",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Relentless Pursuit",
        description:
          "When you hit a creature with an Opportunity Attack, you can move up to half your speed immediately without provoking Opportunity Attacks.",
      },
    ],
    description:
      "Pursue retreating adversaries without allowing them to break away.",
    source: "Player's Handbook (2024), Paladin: Oath of Vengeance",
  },
};
