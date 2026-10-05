import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const PURIFICATION_DOMAIN_FORMULAS: Record<string, ManualActionFormula> =
  {
    cleanseWithFire: {
      id: "embers:cleric:purification-domain:cleanse-with-fire",
      name: "Cleanse with Fire",
      kind: "class_feature",
      status: "verified",
      classes: ["cleric"],
      subclass: "purificationDomain",
      activationType: "special",
      resource: {
        name: "Cleanse with Fire",
        resetType: "Short or Long Rest",
      },
      operations: [
        {
          type: "resource_cost",
          resource: "Cleanse with Fire",
          amount: 1,
        },
        {
          type: "apply_effect",
          name: "Cleanse with Fire",
          description:
            "When you deal damage with a cantrip or an attack with a weapon or Unarmed Strike, you can deal an additional 1d8 Fire damage. You can use this feature a number of times equal to your Wisdom modifier plus your Proficiency Bonus (minimum of once), and you regain all expended uses when you finish a Short or Long Rest.",
        },
      ],
      description:
        "When you deal damage with a cantrip or an attack with a weapon or Unarmed Strike, you can deal an additional 1d8 Fire damage. You can use this feature a number of times equal to your Wisdom modifier plus your Proficiency Bonus (minimum of once), a...",
      source: "Grim Hollow: Player’s Guide, Cleric: Purification Domain",
    },

    purificationDomainSpells: {
      id: "embers:cleric:purification-domain:purification-domain-spells",
      name: "Purification Domain Spells",
      kind: "class_feature",
      status: "verified",
      classes: ["cleric"],
      subclass: "purificationDomain",
      activationType: "special",
      operations: [
        {
          type: "apply_effect",
          name: "Purification Domain Spells",
          description:
            "Your connection to this divine domain ensures you always have certain spells ready. When you reach a Cleric level specified in the Purification Domain Spells table, you thereafter always have the listed spells prepared.\n\nPurification Domain Spells\nCleric Level\tPrepared Spells\n3\tDetect Poison and Disease, Flame Blade\n5\tFear, Flash Fever\n7\tAura of Purity, Wall of Fire\n9\tFlame Strike, Hold Monster",
        },
      ],
      description:
        "Your connection to this divine domain ensures you always have certain spells ready. When you reach a Cleric level specified in the Purification Domain Spells table, you thereafter always have the listed spells prepared.\n\nPurification Domain Spells...",
      source: "Grim Hollow: Player’s Guide, Cleric: Purification Domain",
    },

    uncleanBrand: {
      id: "embers:cleric:purification-domain:unclean-brand",
      name: "Unclean Brand",
      kind: "class_feature",
      status: "verified",
      classes: ["cleric"],
      subclass: "purificationDomain",
      activationType: "special",
      resource: {
        name: "Unclean Brand",
        resetType: "Long Rest",
      },
      operations: [
        {
          type: "resource_cost",
          resource: "Unclean Brand",
          amount: 1,
        },
        {
          type: "apply_effect",
          name: "Unclean Brand",
          description:
            "When you hit a creature with a melee attack with a weapon or Unarmed Strike, instead of dealing the strike’s normal damage, you can expend one use of your Channel Divinity to sear a symbol into the creature’s flesh, marking it with a glowing brand for 1 minute. During that time, the creature has Disadvantage on saving throws against your spells. Additionally, the creature gains Vulnerability to Fire damage you deal, even if it normally has Resistance or Immunity to Fire damage.",
        },
      ],
      description:
        "When you hit a creature with a melee attack with a weapon or Unarmed Strike, instead of dealing the strike’s normal damage, you can expend one use of your Channel Divinity to sear a symbol into the creature’s flesh, marking it with a glowing brand...",
      source: "Grim Hollow: Player’s Guide, Cleric: Purification Domain",
    },

    wardAgainstCorruption: {
      id: "embers:cleric:purification-domain:ward-against-corruption",
      name: "Ward Against Corruption",
      kind: "class_feature",
      status: "verified",
      classes: ["cleric"],
      subclass: "purificationDomain",
      activationType: "action",
      operations: [
        {
          type: "apply_effect",
          name: "Ward Against Corruption",
          description:
            "You have Advantage on saving throws to avoid or end diseases and against any effect that would change your form, such as the Polymorph spell.\n\nAs a Magic action, you can touch a willing creature to grant this benefit, but the creature takes Fire damage equal to your Wisdom modifier (minimum of 1). This damage ignores Resistance and Immunity. Once you grant this benefit, it lasts for 1 hour or until you grant this benefit again.",
        },
      ],
      description:
        "You have Advantage on saving throws to avoid or end diseases and against any effect that would change your form, such as the Polymorph spell.\n\nAs a Magic action, you can touch a willing creature to grant this benefit, but the creature takes Fire d...",
      source: "Grim Hollow: Player’s Guide, Cleric: Purification Domain",
    },

    searImperfections: {
      id: "embers:cleric:purification-domain:sear-imperfections",
      name: "Sear Imperfections",
      kind: "class_feature",
      status: "verified",
      classes: ["cleric"],
      subclass: "purificationDomain",
      activationType: "special",
      resource: {
        name: "Sear Imperfections",
        resetType: "Long Rest",
      },
      operations: [
        {
          type: "resource_cost",
          resource: "Sear Imperfections",
          amount: 1,
        },
        {
          type: "apply_effect",
          name: "Sear Imperfections",
          description:
            "You can cast Lesser Restoration and Greater Restoration on a willing creature without expending spell slots and without Material components, but the target takes 1d6 Fire damage for each level of the spell slot immediately after you cast it. This damage ignores Resistance and Immunity.",
        },
      ],
      description:
        "You can cast Lesser Restoration and Greater Restoration on a willing creature without expending spell slots and without Material components, but the target takes 1d6 Fire damage for each level of the spell slot immediately after you cast it. This ...",
      source: "Grim Hollow: Player’s Guide, Cleric: Purification Domain",
    },
  };
