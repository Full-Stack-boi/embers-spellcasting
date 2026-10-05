import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const WILD_MAGIC_SORCERY_FORMULAS: Record<string, ManualActionFormula> =
  {
    tidesOfChaos: {
      id: "embers:sorcerer:wild:tides-of-chaos",
      name: "Tides of Chaos",
      kind: "class_feature",
      status: "verified",
      classes: ["sorcerer"],
      subclass: "wildMagicSorcery",
      activationType: "special",
      resource: {
        name: "Tides of Chaos",
        resetType: "Long Rest",
      },
      operations: [
        {
          type: "apply_effect",
          name: "Chaotic Advantage",
          description:
            "Gain Advantage on one d20 test. Once used, the DM can trigger a Wild Magic Surge when you cast a level 1+ spell, regaining this feature (recharges on Long Rest).",
        },
      ],
      description:
        "Manipulate the chaotic forces of chance to gain instant Advantage.",
      source: "Player's Handbook (2024), Sorcerer: Wild Magic Sorcery",
    },

    bendLuck: {
      id: "embers:sorcerer:wild:bend-luck",
      name: "Bend Luck",
      kind: "class_feature",
      status: "verified",
      classes: ["sorcerer"],
      subclass: "wildMagicSorcery",
      activationType: "reaction",
      operations: [
        {
          type: "apply_effect",
          name: "Fate Fluctuation",
          description:
            "Reaction spend 2 Sorcery Points when another creature within 60 ft makes an attack roll, ability check, or save: add or subtract 1d4 from the result.",
        },
      ],
      description:
        "Twist the probability strings of fate to make foes miss or allies succeed.",
      source: "Player's Handbook (2024), Sorcerer: Wild Magic Sorcery",
    },

    controlledChaos: {
      id: "embers:sorcerer:wild:controlled-chaos",
      name: "Controlled Chaos",
      kind: "class_feature",
      status: "verified",
      classes: ["sorcerer"],
      subclass: "wildMagicSorcery",
      activationType: "special",
      operations: [
        {
          type: "apply_effect",
          name: "Surge Selection",
          description:
            "Whenever you roll on the Wild Magic Surge table, roll twice and choose which of the two effects occurs.",
        },
      ],
      description:
        "Tame untamed magic by choosing between two surge possibilities.",
      source: "Player's Handbook (2024), Sorcerer: Wild Magic Sorcery",
    },
  };
