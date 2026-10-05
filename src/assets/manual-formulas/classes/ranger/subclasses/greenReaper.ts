import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const GREEN_REAPER_FORMULAS: Record<string, ManualActionFormula> = {
  envenomedAttack: {
    id: "embers:ranger:green-reaper:envenomed-attack",
    name: "Envenomed Attack",
    kind: "class_feature",
    status: "verified",
    classes: ["ranger"],
    subclass: "greenReaper",
    activationType: "bonus",
    resource: {
      name: "Envenomed Attack",
      resetType: "Short or Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Envenomed Attack",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Envenomed Attack",
        description:
          "As a Bonus Action, you can apply a poison dose to a weapon or up to 20 pieces of ammunition. Once applied, the poison retains its potency for 1 minute. Your attacks with the poisoned item deal an extra 1d4 Poison damage on a hit.\n\nYou can use this feature a number of times equal to your Wisdom modifier (minimum of once). You regain all expended uses when you finish a Long Rest.\n\nAt Ranger level 11, the extra Poison damage increases to 2d4, and you regain all expended uses when you finish a Sh...",
      },
    ],
    description:
      "As a Bonus Action, you can apply a poison dose to a weapon or up to 20 pieces of ammunition. Once applied, the poison retains its potency for 1 minute. Your attacks with the poisoned item deal an extra 1d4 Poison damage on a hit.\n\nYou can use this...",
    source: "Grim Hollow: Player’s Guide, Ranger: Green Reaper",
  },

  toxicTradecraft: {
    id: "embers:ranger:green-reaper:toxic-tradecraft",
    name: "Toxic Tradecraft",
    kind: "class_feature",
    status: "verified",
    classes: ["ranger"],
    subclass: "greenReaper",
    activationType: "special",
    resource: {
      name: "Toxic Tradecraft",
      resetType: "Short or Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Toxic Tradecraft",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Toxic Tradecraft",
        description:
          "You gain a Poisoner’s Kit, and you have proficiency with it. In addition, your Proficiency Bonus is doubled for ability checks with a Poisoner’s Kit. If you lose the kit, you can harvest toxic flora and venomous fauna for 1 hour to magically create a replacement. This harvest can be performed during a Short or Long Rest, and it destroys the previous Poisoner’s Kit.\n\nOnce per turn when you deal Poison damage to a creature with a weapon attack, you can expend a spell slot (no action required). ...",
      },
    ],
    description:
      "You gain a Poisoner’s Kit, and you have proficiency with it. In addition, your Proficiency Bonus is doubled for ability checks with a Poisoner’s Kit. If you lose the kit, you can harvest toxic flora and venomous fauna for 1 hour to magically creat...",
    source: "Grim Hollow: Player’s Guide, Ranger: Green Reaper",
  },

  greenReaperSpells: {
    id: "embers:ranger:green-reaper:green-reaper-spells",
    name: "Green Reaper Spells",
    kind: "class_feature",
    status: "verified",
    classes: ["ranger"],
    subclass: "greenReaper",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Green Reaper Spells",
        description:
          "When you reach a Ranger level specified in the Green Reaper Spells table, you thereafter always have the listed spells prepared.\n\nGreen Reaper Spells\nRanger Level\tSpells\n3\tDetect Poison and Disease\n5\tHold Person\n9\tBestow Curse\n13\tGreater Invisibility\n17\tCloudkill",
      },
    ],
    description:
      "When you reach a Ranger level specified in the Green Reaper Spells table, you thereafter always have the listed spells prepared.\n\nGreen Reaper Spells\nRanger Level\tSpells\n3\tDetect Poison and Disease\n5\tHold Person\n9\tBestow Curse\n13\tGreater Invisibil...",
    source: "Grim Hollow: Player’s Guide, Ranger: Green Reaper",
  },

  poisonControl: {
    id: "embers:ranger:green-reaper:poison-control",
    name: "Poison Control",
    kind: "class_feature",
    status: "verified",
    classes: ["ranger"],
    subclass: "greenReaper",
    activationType: "special",
    resource: {
      name: "Poison Control",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Poison Control",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Poison Control",
        description:
          "You gain Resistance to Poison damage and have Advantage on saving throws to avoid or end the Poisoned condition.\n\nIn addition, you can cast the Protection from Poison spell without expending a spell slot. You can do so a number of times equal to your Wisdom modifier (minimum of once), and you regain all expended uses when you finish a Long Rest.",
      },
    ],
    description:
      "You gain Resistance to Poison damage and have Advantage on saving throws to avoid or end the Poisoned condition.\n\nIn addition, you can cast the Protection from Poison spell without expending a spell slot. You can do so a number of times equal to y...",
    source: "Grim Hollow: Player’s Guide, Ranger: Green Reaper",
  },

  variegatedVexations: {
    id: "embers:ranger:green-reaper:variegated-vexations",
    name: "Variegated Vexations",
    kind: "class_feature",
    status: "verified",
    classes: ["ranger"],
    subclass: "greenReaper",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Variegated Vexations",
        description:
          "Whenever you would deal Poison damage with a weapon attack, you can change that damage to be either Acid or Necrotic instead.",
      },
    ],
    description:
      "Whenever you would deal Poison damage with a weapon attack, you can change that damage to be either Acid or Necrotic instead.",
    source: "Grim Hollow: Player’s Guide, Ranger: Green Reaper",
  },

  painTolerance: {
    id: "embers:ranger:green-reaper:pain-tolerance",
    name: "Pain Tolerance",
    kind: "class_feature",
    status: "verified",
    classes: ["ranger"],
    subclass: "greenReaper",
    activationType: "reaction",
    operations: [
      {
        type: "apply_effect",
        name: "Pain Tolerance",
        description:
          "You have learned to quickly inure yourself against harm. Immediately before you take damage from a creature you can see within 60 feet of yourself, you can take a Reaction to gain Temporary Hit Points equal to the damage you take. If any of these Temporary Hit Points remain at the end of your next turn, they vanish.",
      },
    ],
    description:
      "You have learned to quickly inure yourself against harm. Immediately before you take damage from a creature you can see within 60 feet of yourself, you can take a Reaction to gain Temporary Hit Points equal to the damage you take. If any of these ...",
    source: "Grim Hollow: Player’s Guide, Ranger: Green Reaper",
  },

  toxinEffects: {
    id: "embers:ranger:green-reaper:toxin-effects",
    name: "Toxin Effects",
    kind: "class_feature",
    status: "verified",
    classes: ["ranger"],
    subclass: "greenReaper",
    activationType: "special",
    resource: {
      name: "Toxin Effects",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Toxin Effects",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Toxin Effects",
        description:
          "The following Toxin Effects are presented in order of spell slot level:\n\nLevel 1 Spell Slot Effects\n\nWhen you expend a level 1+ spell slot, choose one of the following effects to add to the toxin.\n\nAttenuate. While a creature has the Poisoned condition from this toxin, it has Disadvantage on Strength and Dexterity saving throws.\n\nBefuddled. While a creature has the Poisoned condition from this toxin, it can’t speak, read, or write and it has Disadvantage on saving throws made to maintain Conc...",
      },
    ],
    description:
      "The following Toxin Effects are presented in order of spell slot level:\n\nLevel 1 Spell Slot Effects\n\nWhen you expend a level 1+ spell slot, choose one of the following effects to add to the toxin.\n\nAttenuate. While a creature has the Poisoned cond...",
    source: "Grim Hollow: Player’s Guide, Ranger: Green Reaper",
  },
};
