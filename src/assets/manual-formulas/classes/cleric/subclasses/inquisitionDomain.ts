import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const INQUISITION_DOMAIN_FORMULAS: Record<string, ManualActionFormula> =
  {
    inquisitionDomainSpells: {
      id: "embers:cleric:inquisition-domain:inquisition-domain-spells",
      name: "Inquisition Domain Spells",
      kind: "class_feature",
      status: "verified",
      classes: ["cleric"],
      subclass: "inquisitionDomain",
      activationType: "special",
      operations: [
        {
          type: "apply_effect",
          name: "Inquisition Domain Spells",
          description:
            "Your connection to this divine domain ensures you always have certain spells ready. When you reach a Cleric level specified in the Inquisition Domain Spells table, you thereafter always have the listed spells prepared.\n\nInquisition Domain Spells\nCleric Level\tPrepared Spells\n3\tSee Invisibility, Silence\n5\tDispel Magic, Remove Curse\n7\tArcane Eye, Locate Creature\n9\tCreation, Hallow",
        },
      ],
      description:
        "Your connection to this divine domain ensures you always have certain spells ready. When you reach a Cleric level specified in the Inquisition Domain Spells table, you thereafter always have the listed spells prepared.\n\nInquisition Domain Spells\nC...",
      source: "Grim Hollow: Player’s Guide, Cleric: Inquisition Domain",
    },

    witchHunterSStrike: {
      id: "embers:cleric:inquisition-domain:witch-hunter-s-strike",
      name: "Witch Hunter’s Strike",
      kind: "class_feature",
      status: "verified",
      classes: ["cleric"],
      subclass: "inquisitionDomain",
      activationType: "special",
      resource: {
        name: "Witch Hunter’s Strike",
        resetType: "Long Rest",
      },
      operations: [
        {
          type: "resource_cost",
          resource: "Witch Hunter’s Strike",
          amount: 1,
        },
        {
          type: "apply_effect",
          name: "Witch Hunter’s Strike",
          description:
            "When you hit a creature with a weapon attack or Unarmed Strike, you can deal an extra 1d8 Force damage to the target. If the creature is concentrating on a spell, you deal an extra 2d8 Force damage instead. At Cleric level 14, the extra Force damage increases to 2d8, or 3d8 if the creature is concentrating on a spell.\n\nIf a creature fails its saving throw to maintain Concentration as a result of taking damage from this feature, you gain Temporary Hit Points equal to the extra Force damage dea...",
        },
      ],
      description:
        "When you hit a creature with a weapon attack or Unarmed Strike, you can deal an extra 1d8 Force damage to the target. If the creature is concentrating on a spell, you deal an extra 2d8 Force damage instead. At Cleric level 14, the extra Force dama...",
      source: "Grim Hollow: Player’s Guide, Cleric: Inquisition Domain",
    },

    spellShield: {
      id: "embers:cleric:inquisition-domain:spell-shield",
      name: "Spell Shield",
      kind: "class_feature",
      status: "verified",
      classes: ["cleric"],
      subclass: "inquisitionDomain",
      activationType: "bonus",
      resource: {
        name: "Spell Shield",
        resetType: "Long Rest",
      },
      operations: [
        {
          type: "resource_cost",
          resource: "Spell Shield",
          amount: 1,
        },
        {
          type: "apply_effect",
          name: "Spell Shield",
          description:
            "As a Bonus Action, you can expend one use of your Channel Divinity to bestow a temporary resilience against arcane harm for 10 minutes. Choose a creature you can see (including yourself) within 30 feet of yourself. The chosen creature gains Temporary Hit Points equal to 1d10 plus your Cleric level. While a creature has Temporary Hit Points granted by your Spell Shield, the creature has Advantage on saving throws against spells, and it has Resistance to the damage of spells. If any of these Te...",
        },
      ],
      description:
        "As a Bonus Action, you can expend one use of your Channel Divinity to bestow a temporary resilience against arcane harm for 10 minutes. Choose a creature you can see (including yourself) within 30 feet of yourself. The chosen creature gains Tempor...",
      source: "Grim Hollow: Player’s Guide, Cleric: Inquisition Domain",
    },

    rebukeInvoker: {
      id: "embers:cleric:inquisition-domain:rebuke-invoker",
      name: "Rebuke Invoker",
      kind: "class_feature",
      status: "verified",
      classes: ["cleric"],
      subclass: "inquisitionDomain",
      activationType: "reaction",
      resource: {
        name: "Rebuke Invoker",
        resetType: "Long Rest",
      },
      operations: [
        {
          type: "resource_cost",
          resource: "Rebuke Invoker",
          amount: 1,
        },
        {
          type: "apply_effect",
          name: "Rebuke Invoker",
          description:
            "As a Reaction in response to a creature you can see within 60 feet of yourself using a Magic action to cast a spell, you can force the creature to make a Constitution saving throw against your spell save DC. On a failed save, the creature takes 1d8 Force damage, plus another 1d8 per level of the spell slot the creature expended. Cantrips are considered level 1 spells for this ability. On a successful save, the creature takes half as much damage instead.\n\nYou can use this feature a number of t...",
        },
      ],
      description:
        "As a Reaction in response to a creature you can see within 60 feet of yourself using a Magic action to cast a spell, you can force the creature to make a Constitution saving throw against your spell save DC. On a failed save, the creature takes 1d...",
      source: "Grim Hollow: Player’s Guide, Cleric: Inquisition Domain",
    },

    supernalSafeguard: {
      id: "embers:cleric:inquisition-domain:supernal-safeguard",
      name: "Supernal Safeguard",
      kind: "class_feature",
      status: "verified",
      classes: ["cleric"],
      subclass: "inquisitionDomain",
      activationType: "special",
      operations: [
        {
          type: "apply_effect",
          name: "Supernal Safeguard",
          description:
            "Spell Shield can target a number of creatures up to your Wisdom modifier (minimum of one creature).",
        },
      ],
      description:
        "Spell Shield can target a number of creatures up to your Wisdom modifier (minimum of one creature).",
      source: "Grim Hollow: Player’s Guide, Cleric: Inquisition Domain",
    },
  };
