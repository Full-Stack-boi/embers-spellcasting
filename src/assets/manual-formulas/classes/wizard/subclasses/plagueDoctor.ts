import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const PLAGUE_DOCTOR_FORMULAS: Record<string, ManualActionFormula> = {
  potionCraft: {
    id: "embers:wizard:plague-doctor:potion-craft",
    name: "Potion Craft",
    kind: "class_feature",
    status: "verified",
    classes: ["wizard"],
    subclass: "plagueDoctor",
    activationType: "bonus",
    resource: {
      name: "Potion Craft",
      resetType: "Short or Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Potion Craft",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Potion Craft",
        description:
          "You gain proficiency in the Medicine skill and proficiency with the Herbalism Kit and Alchemist’s Supplies.\n\nAdditionally, you have learned to create magical potions.\n\nCrafting. With 10 minutes of work or when you finish a Short or Long Rest, you can prepare magical potions if you have an Herbalism Kit or Alchemist’s Supplies. When you do so, you must expend a level 1+ spell slot for each potion you create and choose a spell from your spellbook that targets only one creature. The chosen spell...",
      },
    ],
    description:
      "You gain proficiency in the Medicine skill and proficiency with the Herbalism Kit and Alchemist’s Supplies.\n\nAdditionally, you have learned to create magical potions.\n\nCrafting. With 10 minutes of work or when you finish a Short or Long Rest, you ...",
    source: "Grim Hollow: Player’s Guide, Wizard: Plague Doctor",
  },

  goodMedicine: {
    id: "embers:wizard:plague-doctor:good-medicine",
    name: "Good Medicine",
    kind: "class_feature",
    status: "verified",
    classes: ["wizard"],
    subclass: "plagueDoctor",
    activationType: "bonus",
    resource: {
      name: "Good Medicine",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Good Medicine",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Good Medicine",
        description:
          "When you craft a potion, you can choose to expend a spell slot without choosing a spell to craft a dose of Good Medicine. As a Bonus Action, you can drink the dose or administer it to another creature within 5 feet of yourself. When Good Medicine is consumed, roll a number of d8s equal to the level of the spell slot expended, and the target regains Hit Points equal to the roll’s total. If you expended a level 3+ spell slot on this feature, Good Medicine also removes the Poisoned condition.",
      },
    ],
    description:
      "When you craft a potion, you can choose to expend a spell slot without choosing a spell to craft a dose of Good Medicine. As a Bonus Action, you can drink the dose or administer it to another creature within 5 feet of yourself. When Good Medicine ...",
    source: "Grim Hollow: Player’s Guide, Wizard: Plague Doctor",
  },

  badMedicine: {
    id: "embers:wizard:plague-doctor:bad-medicine",
    name: "Bad Medicine",
    kind: "class_feature",
    status: "verified",
    classes: ["wizard"],
    subclass: "plagueDoctor",
    activationType: "action",
    resource: {
      name: "Bad Medicine",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Bad Medicine",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Bad Medicine",
        description:
          "When you craft a potion, you can choose to expend a spell slot without choosing a spell to craft a dose of Bad Medicine. When you create a dose, choose one effect per level of the spell slot expended.\n\nThe creature has the Poisoned condition.\nThe creature’s Speed is halved.\nThe creature takes an extra 1d4 Necrotic damage the first time it takes damage each turn.\nThe creature takes 1d6 Poison damage each time it takes an action, Bonus Action, or Reaction.\nThe creature takes Acid damage equal t...",
      },
    ],
    description:
      "When you craft a potion, you can choose to expend a spell slot without choosing a spell to craft a dose of Bad Medicine. When you create a dose, choose one effect per level of the spell slot expended.\n\nThe creature has the Poisoned condition.\nThe ...",
    source: "Grim Hollow: Player’s Guide, Wizard: Plague Doctor",
  },

  breatheItIn: {
    id: "embers:wizard:plague-doctor:breathe-it-in",
    name: "Breathe It In",
    kind: "class_feature",
    status: "verified",
    classes: ["wizard"],
    subclass: "plagueDoctor",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Breathe It In",
        description:
          "Being persistently exposed to the deadliest ailments known has given you some small measure of resistance. After you take Necrotic or Poison damage, you gain Temporary Hit Points equal to the damage taken. In addition, you are immune to the Poisoned condition.",
      },
    ],
    description:
      "Being persistently exposed to the deadliest ailments known has given you some small measure of resistance. After you take Necrotic or Poison damage, you gain Temporary Hit Points equal to the damage taken. In addition, you are immune to the Poison...",
    source: "Grim Hollow: Player’s Guide, Wizard: Plague Doctor",
  },

  medicinalMaster: {
    id: "embers:wizard:plague-doctor:medicinal-master",
    name: "Medicinal Master",
    kind: "class_feature",
    status: "verified",
    classes: ["wizard"],
    subclass: "plagueDoctor",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Medicinal Master",
        description:
          "When Good Medicine restores Hit Points to a creature, that creature regains 2d8 additional Hit Points.\n\nWhen Bad Medicine deals Acid damage to a creature, that creature takes 2d8 extra Acid damage. Additionally, target creatures have Disadvantage on their saving throw.\n\nIt’s amazing what one can manage with just a few herbs and decades of intense singleminded study.\n\n— Tawnybruck Malore, Master Physician",
      },
    ],
    description:
      "When Good Medicine restores Hit Points to a creature, that creature regains 2d8 additional Hit Points.\n\nWhen Bad Medicine deals Acid damage to a creature, that creature takes 2d8 extra Acid damage. Additionally, target creatures have Disadvantage ...",
    source: "Grim Hollow: Player’s Guide, Wizard: Plague Doctor",
  },
};
