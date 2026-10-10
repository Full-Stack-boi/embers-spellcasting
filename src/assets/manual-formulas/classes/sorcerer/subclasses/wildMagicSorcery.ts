import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const WILD_MAGIC_SORCERY_FORMULAS: Record<string, ManualActionFormula> =
  {
    wildMagicSurge: {
      id: "embers:sorcerer:wild:wild-magic-surge",
      name: "Wild Magic Surge",
      kind: "class_feature",
      status: "verified",
      classes: ["sorcerer"],
      subclass: "wildMagicSorcery",
      activationType: "special",
      description: "Once per turn when you cast a Sorcerer spell of level 1 or higher, roll 1d20. On a 20 (or automatically if Tides of Chaos was used), roll on the Wild Magic Surge table.",
      source: "Player's Handbook (2024), Sorcerer: Wild Magic Sorcery",
      operations: [
        {
          type: "apply_effect",
          name: "Chaotic Spell Surge",
          description: "Roll on the Wild Magic Surge table when casting a leveled Sorcerer spell, unleashing random magical phenomena.",
        },
      ],
    },

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
            "Gain Advantage on one d20 test. Once used, the next leveled spell you cast automatically triggers a Wild Magic Surge and recharges this feature.",
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
            "Reaction spend 1 Sorcery Point when another creature within 60 ft makes an attack roll, ability check, or save: add or subtract 1d4 from the result.",
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

    tamedSurge: {
      id: "embers:sorcerer:wild:tamed-surge",
      name: "Tamed Surge",
      kind: "class_feature",
      status: "verified",
      classes: ["sorcerer"],
      subclass: "wildMagicSorcery",
      activationType: "special",
      description: "Immediately after rolling on the Wild Magic Surge table, you can regain Sorcery Points equal to the spell level cast, or regain a spell slot of up to level 5 (1/Long Rest).",
      source: "Player's Handbook (2024), Sorcerer: Wild Magic Sorcery",
      operations: [
        {
          type: "apply_effect",
          name: "Surge Resource Siphon",
          description: "Regain Sorcery Points equal to spell level after surging, or regain a spell slot up to level 5 (1/Long Rest).",
        },
      ],
    },
  };
