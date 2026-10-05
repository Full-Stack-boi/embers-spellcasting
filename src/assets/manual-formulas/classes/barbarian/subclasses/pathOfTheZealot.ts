import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const PATH_OF_THE_ZEALOT_FORMULAS: Record<string, ManualActionFormula> =
  {
    divineFury: {
      id: "embers:barbarian:zealot:divine-fury",
      name: "Divine Fury",
      kind: "class_feature",
      status: "verified",
      classes: ["barbarian"],
      subclass: "pathOfTheZealot",
      activationType: "special",
      operations: [
        {
          type: "apply_effect",
          name: "Holy Wrath",
          description:
            "While raging, the first target you hit with a weapon on your turn takes extra 1d6 + half Barbarian level Radiant or Necrotic damage.",
        },
      ],
      description: "Infuse your martial fury with wrathful divine retribution.",
      source: "Player's Handbook (2024), Barbarian: Path of the Zealot",
    },

    fanaticalFocus: {
      id: "embers:barbarian:zealot:fanatical-focus",
      name: "Fanatical Focus",
      kind: "class_feature",
      status: "verified",
      classes: ["barbarian"],
      subclass: "pathOfTheZealot",
      activationType: "special",
      operations: [
        {
          type: "apply_effect",
          name: "Indomitable Faith",
          description:
            "Once per Rage, if you fail a saving throw, you can reroll it and must use the new result.",
        },
      ],
      description:
        "Channel unyielding religious conviction to overcome debilitating spells and hazards.",
      source: "Player's Handbook (2024), Barbarian: Path of the Zealot",
    },

    zealousPresence: {
      id: "embers:barbarian:zealot:zealous-presence",
      name: "Zealous Presence",
      kind: "class_feature",
      status: "verified",
      classes: ["barbarian"],
      subclass: "pathOfTheZealot",
      activationType: "bonus",
      resource: {
        name: "Zealous Presence",
        resetType: "Long Rest",
      },
      operations: [
        {
          type: "apply_effect",
          name: "Zealot Battle Cry",
          description:
            "As a Bonus Action, unleash a battle cry: up to 10 allies within 60 feet gain Advantage on attack rolls and saving throws until start of your next turn.",
        },
      ],
      description:
        "Inspire your entire party with a thunderous war cry of holy fervor.",
      source: "Player's Handbook (2024), Barbarian: Path of the Zealot",
    },
  };
