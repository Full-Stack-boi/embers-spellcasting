import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const APOCALYPSE_SORCERY_FORMULAS: Record<string, ManualActionFormula> =
  {
    apocalypticSpells: {
      id: "embers:sorcerer:apocalypse-sorcery:apocalyptic-spells",
      name: "Apocalyptic Spells",
      kind: "class_feature",
      status: "verified",
      classes: ["sorcerer"],
      subclass: "apocalypseSorcery",
      activationType: "special",
      operations: [
        {
          type: "apply_effect",
          name: "Apocalyptic Spells",
          description:
            "When you reach a Sorcerer level specified in the Apocalyptic Spells table, you thereafter always have the listed spells prepared.\n\nApocalyptic Spells\nSorcerer Level\tSpells\n3\tAugury, Comprehend Languages, Hellish Rebuke, Ray of Enfeeblement\n5\tBestow Curse, Revivify\n7\tBanishment, Divination\n9\tContagion, Insect Plague",
        },
      ],
      description:
        "When you reach a Sorcerer level specified in the Apocalyptic Spells table, you thereafter always have the listed spells prepared.\n\nApocalyptic Spells\nSorcerer Level\tSpells\n3\tAugury, Comprehend Languages, Hellish Rebuke, Ray of Enfeeblement\n5\tBesto...",
      source: "Grim Hollow: Player’s Guide, Sorcerer: Apocalypse Sorcery",
    },

    unhingedAsservations: {
      id: "embers:sorcerer:apocalypse-sorcery:unhinged-asservations",
      name: "Unhinged Asservations",
      kind: "class_feature",
      status: "verified",
      classes: ["sorcerer"],
      subclass: "apocalypseSorcery",
      activationType: "special",
      resource: {
        name: "Unhinged Asservations",
        resetType: "Long Rest",
      },
      operations: [
        {
          type: "resource_cost",
          resource: "Unhinged Asservations",
          amount: 1,
        },
        {
          type: "apply_effect",
          name: "Unhinged Asservations",
          description:
            "You are obsessed with documenting your visions. You gain proficiency with Calligrapher’s Supplies and you can create Spell Scrolls in half the time and at half the cost in GP.\n\nIn addition, when you create a Spell Scroll, you can ensorcell it. When you ensorcell a Spell Scroll, you must expend a spell slot equal to or greater than the spell’s level and you can spend Sorcery Points to apply one of your Metamagic options. Any creature that knows at least one language can use your ensorcelled Sp...",
        },
      ],
      description:
        "You are obsessed with documenting your visions. You gain proficiency with Calligrapher’s Supplies and you can create Spell Scrolls in half the time and at half the cost in GP.\n\nIn addition, when you create a Spell Scroll, you can ensorcell it. Whe...",
      source: "Grim Hollow: Player’s Guide, Sorcerer: Apocalypse Sorcery",
    },

    bearWitness: {
      id: "embers:sorcerer:apocalypse-sorcery:bear-witness",
      name: "Bear Witness",
      kind: "class_feature",
      status: "verified",
      classes: ["sorcerer"],
      subclass: "apocalypseSorcery",
      activationType: "bonus",
      operations: [
        {
          type: "apply_effect",
          name: "Bear Witness",
          description:
            "You have prepared your entire life for the end of the world. While your Innate Sorcery feature is active, you gain the following benefits.\n\nApocalyptic Inurement. You have Resistance to Force damage.\n\nRecite Scripture. Once per active Innate Sorcery, as a Bonus action you can use a Spell Scroll that has a spell with a casting time of Action.\n\nUnflappable. You are immune to the Frightened condition.",
        },
      ],
      description:
        "You have prepared your entire life for the end of the world. While your Innate Sorcery feature is active, you gain the following benefits.\n\nApocalyptic Inurement. You have Resistance to Force damage.\n\nRecite Scripture. Once per active Innate Sorce...",
      source: "Grim Hollow: Player’s Guide, Sorcerer: Apocalypse Sorcery",
    },

    arcaneApocrypha: {
      id: "embers:sorcerer:apocalypse-sorcery:arcane-apocrypha",
      name: "Arcane Apocrypha",
      kind: "class_feature",
      status: "verified",
      classes: ["sorcerer"],
      subclass: "apocalypseSorcery",
      activationType: "special",
      resource: {
        name: "Arcane Apocrypha",
        resetType: "Long Rest",
      },
      operations: [
        {
          type: "resource_cost",
          resource: "Arcane Apocrypha",
          amount: 1,
        },
        {
          type: "apply_effect",
          name: "Arcane Apocrypha",
          description:
            "Your obsessive reflections on the end of existence inspire your writing. Whenever you finish a Long Rest, you can create one Spell Scroll at no cost. It must be a spell of level 5 or lower that you can cast. This Spell Scroll disintegrates when you finish a Long Rest.",
        },
      ],
      description:
        "Your obsessive reflections on the end of existence inspire your writing. Whenever you finish a Long Rest, you can create one Spell Scroll at no cost. It must be a spell of level 5 or lower that you can cast. This Spell Scroll disintegrates when yo...",
      source: "Grim Hollow: Player’s Guide, Sorcerer: Apocalypse Sorcery",
    },

    forbiddenMagic: {
      id: "embers:sorcerer:apocalypse-sorcery:forbidden-magic",
      name: "Forbidden Magic",
      kind: "class_feature",
      status: "verified",
      classes: ["sorcerer"],
      subclass: "apocalypseSorcery",
      activationType: "special",
      resource: {
        name: "Forbidden Magic",
        resetType: "Long Rest",
      },
      operations: [
        {
          type: "resource_cost",
          resource: "Forbidden Magic",
          amount: 1,
        },
        {
          type: "apply_effect",
          name: "Forbidden Magic",
          description:
            "The end of Etharis is a time when magic is unbound and magical powers long hidden are unearthed. When you cast a Sorcerer spell using a spell slot, you can choose one option below.\n\nExcessive. If the spell requires a Material component with a cost, you can cast the spell without the Material component. You take Force damage equal to four times the level of the spell slot immediately after you cast it. This damage ignores Resistance and Immunity.\n\nInexorable. Taking damage can’t break your Con...",
        },
      ],
      description:
        "The end of Etharis is a time when magic is unbound and magical powers long hidden are unearthed. When you cast a Sorcerer spell using a spell slot, you can choose one option below.\n\nExcessive. If the spell requires a Material component with a cost...",
      source: "Grim Hollow: Player’s Guide, Sorcerer: Apocalypse Sorcery",
    },

    theEndIsNigh: {
      id: "embers:sorcerer:apocalypse-sorcery:the-end-is-nigh",
      name: "The End is Nigh",
      kind: "class_feature",
      status: "verified",
      classes: ["sorcerer"],
      subclass: "apocalypseSorcery",
      activationType: "action",
      resource: {
        name: "The End is Nigh",
        resetType: "Long Rest",
      },
      operations: [
        {
          type: "resource_cost",
          resource: "The End is Nigh",
          amount: 1,
        },
        {
          type: "apply_effect",
          name: "The End is Nigh",
          description:
            "You loudly proclaim what will come to pass when the world ends. As a Magic action, you describe the end of days. When you do so, each creature of your choice in a 30-foot Emanation originating from you must make a Wisdom saving throw against your spell save DC. On a failed save, a creature takes 6d6 Psychic damage and 6d6 Force damage and has the Frightened condition for 1 minute. On a successful save, the creature takes half as much damage only. A Frightened creature can repeat the saving th...",
        },
      ],
      description:
        "You loudly proclaim what will come to pass when the world ends. As a Magic action, you describe the end of days. When you do so, each creature of your choice in a 30-foot Emanation originating from you must make a Wisdom saving throw against your ...",
      source: "Grim Hollow: Player’s Guide, Sorcerer: Apocalypse Sorcery",
    },
  };
