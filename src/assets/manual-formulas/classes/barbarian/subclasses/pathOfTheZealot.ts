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
      options: [
        {
          id: "radiant",
          name: "Radiant",
          cost: 0,
          desc: "Infuse first hit each turn while Raging with 1d6 + half Barbarian level Radiant damage",
          actionType: "none",
        },
        {
          id: "necrotic",
          name: "Necrotic",
          cost: 0,
          desc: "Infuse first hit each turn while Raging with 1d6 + half Barbarian level Necrotic damage",
          actionType: "none",
        },
      ],
      weaponRider: {
        type: "weapon_damage_rider",
        id: "divine-fury",
        name: "Divine Fury",
        classId: "barbarian",
        subclassId: "pathOfTheZealot",
        minLevel: 3,
        requiresBuff: "rage",
        dice: "1d6",
        bonus: "halfClassLevel",
        damageTypeChoices: ["Radiant", "Necrotic"],
        defaultChoice: "Radiant",
        frequency: "first_hit_per_turn",
      },
      description: "Infuse your martial fury with wrathful divine retribution.",
      source: "Player's Handbook (2024), Barbarian: Path of the Zealot",
    },

    warriorOfTheGods: {
      id: "embers:barbarian:zealot:warrior-of-the-gods",
      name: "Warrior of the Gods",
      kind: "class_feature",
      status: "verified",
      classes: ["barbarian"],
      subclass: "pathOfTheZealot",
      activationType: "bonus",
      resource: {
        name: "Warrior of the Gods Dice",
        resetType: "Long Rest",
        scaling: {
          type: "level_table",
          classId: "barbarian",
          table: [
            { minLevel: 3, value: 4 },
            { minLevel: 6, value: 5 },
            { minLevel: 12, value: 6 },
            { minLevel: 17, value: 7 },
          ],
        },
      },
      operations: [
        {
          type: "resource_cost",
          resource: "Warrior of the Gods Dice",
          amount: 1,
        },
        {
          type: "apply_effect",
          name: "Divine Healing Pool",
          description:
            "Expend d12 dice from your pool, roll them, and regain a number of Hit Points equal to the roll total.",
        },
      ],
      description:
        "A pool of d12 dice granted by a deity that you can expend as a Bonus Action to heal yourself.",
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
            "Once per active Rage, if you fail a saving throw, you can reroll it with a bonus equal to your Rage Damage bonus, and you must use the new roll.",
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
            "As a Bonus Action, unleash a battle cry: up to 10 allies within 60 feet gain Advantage on attack rolls and saving throws until start of your next turn. 1 use per Long Rest, or expend 1 use of Rage to restore.",
        },
      ],
      description:
        "Inspire your entire party with a thunderous war cry of holy fervor.",
      source: "Player's Handbook (2024), Barbarian: Path of the Zealot",
    },

    rageOfTheGods: {
      id: "embers:barbarian:zealot:rage-of-the-gods",
      name: "Rage of the Gods",
      kind: "class_feature",
      status: "verified",
      classes: ["barbarian"],
      subclass: "pathOfTheZealot",
      activationType: "special",
      operations: [
        {
          type: "apply_effect",
          name: "Divine Avatar Form",
          duration: "1 minute",
          description:
            "When entering Rage (1/Long Rest), assume divine warrior form: Fly Speed equal to Speed with hover, Resistance to Necrotic, Psychic, and Radiant damage. Reaction: Revivification (when ally within 30 ft drops to 0 HP, expend 1 Rage to set their HP to your Barbarian level).",
        },
      ],
      description:
        "Assume the form of an exalted divine warrior while raging with flight and revivification.",
      source: "Player's Handbook (2024), Barbarian: Path of the Zealot",
    },
  };
