import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const ALCHEMIST_FORMULAS: Record<string, ManualActionFormula> = {
  toolsOfTheTrade: {
    id: "embers:artificer:alchemist:tools-of-the-trade",
    name: "Tools of the Trade",
    kind: "class_feature",
    status: "verified",
    classes: ["artificer"],
    subclass: "alchemist",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Tools of the Trade",
        description:
          "You gain the following benefits.\n\nTool Proficiency. You gain proficiency with Alchemist’s Supplies and the Herbalism Kit. If you already have one of these proficiencies, you gain proficiency with one other type of Artisan’s Tools of your choice (or with two other types if you have both).\n\nPotion Crafting. When you brew a potion using the crafting rules in the Dungeon Master’s Guide, the amount of time required to craft it is halved.",
      },
    ],
    description:
      "You gain the following benefits.\n\nTool Proficiency. You gain proficiency with Alchemist’s Supplies and the Herbalism Kit. If you already have one of these proficiencies, you gain proficiency with one other type of Artisan’s Tools of your choice (o...",
    source: "Eberron: Forge of the Artificer, artificer: Alchemist",
  },

  alchemistSpells: {
    id: "embers:artificer:alchemist:alchemist-spells",
    name: "Alchemist Spells",
    kind: "class_feature",
    status: "verified",
    classes: ["artificer"],
    subclass: "alchemist",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Alchemist Spells",
        description:
          "When you reach an Artificer level specified in the Alchemist Spells table, you thereafter always have the listed spells prepared.\n\nAlchemist Spells\nArtificer Level\tSpells\n3\tHealing Word, Ray of Sickness\n5\tFlaming Sphere, Melf’s Acid Arrow\n9\tGaseous Form, Mass Healing Word\n13\tDeath Ward, Vitriolic Sphere\n17\tCloudkill, Raise Dead",
      },
    ],
    description:
      "When you reach an Artificer level specified in the Alchemist Spells table, you thereafter always have the listed spells prepared.\n\nAlchemist Spells\nArtificer Level\tSpells\n3\tHealing Word, Ray of Sickness\n5\tFlaming Sphere, Melf’s Acid Arrow\n9\tGaseou...",
    source: "Eberron: Forge of the Artificer, artificer: Alchemist",
  },

  experimentalElixir: {
    id: "embers:artificer:alchemist:experimental-elixir",
    name: "Experimental Elixir",
    kind: "class_feature",
    status: "verified",
    classes: ["artificer"],
    subclass: "alchemist",
    activationType: "bonus",
    resource: {
      name: "Experimental Elixir",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Experimental Elixir",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Experimental Elixir",
        description:
          "Whenever you finish a Long Rest while holding Alchemist’s Supplies, you can use that tool to magically produce two elixirs. For each elixir, roll on the Experimental Elixir table for the elixir’s effect, which is triggered when someone drinks the elixir. The elixir appears in a vial, and the vial vanishes when the elixir is drunk or poured out. If any elixir remains when you finish a Long Rest, the elixir and its vial vanish.\n\nDrinking an Elixir. As a Bonus Action, a creature can drink the el...",
      },
    ],
    description:
      "Whenever you finish a Long Rest while holding Alchemist’s Supplies, you can use that tool to magically produce two elixirs. For each elixir, roll on the Experimental Elixir table for the elixir’s effect, which is triggered when someone drinks the ...",
    source: "Eberron: Forge of the Artificer, artificer: Alchemist",
  },

  alchemicalSavant: {
    id: "embers:artificer:alchemist:alchemical-savant",
    name: "Alchemical Savant",
    kind: "class_feature",
    status: "verified",
    classes: ["artificer"],
    subclass: "alchemist",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Alchemical Savant",
        description:
          "Whenever you cast a spell using your Alchemist’s Supplies as the Spellcasting Focus, you gain a bonus to one roll of the spell. That roll must restore Hit Points or be a damage roll that deals Acid, Fire, or Poison damage. The bonus equals your Intelligence modifier (minimum bonus of +1).",
      },
    ],
    description:
      "Whenever you cast a spell using your Alchemist’s Supplies as the Spellcasting Focus, you gain a bonus to one roll of the spell. That roll must restore Hit Points or be a damage roll that deals Acid, Fire, or Poison damage. The bonus equals your In...",
    source: "Eberron: Forge of the Artificer, artificer: Alchemist",
  },

  restorativeReagents: {
    id: "embers:artificer:alchemist:restorative-reagents",
    name: "Restorative Reagents",
    kind: "class_feature",
    status: "verified",
    classes: ["artificer"],
    subclass: "alchemist",
    activationType: "special",
    resource: {
      name: "Restorative Reagents",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Restorative Reagents",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Restorative Reagents",
        description:
          "You can cast Lesser Restoration without expending a spell slot and without preparing the spell, provided you use Alchemist’s Supplies as the Spellcasting Focus. You can do so a number of times equal to your Intelligence modifier (minimum of once), and you regain all expended uses when you finish a Long Rest.",
      },
    ],
    description:
      "You can cast Lesser Restoration without expending a spell slot and without preparing the spell, provided you use Alchemist’s Supplies as the Spellcasting Focus. You can do so a number of times equal to your Intelligence modifier (minimum of once),...",
    source: "Eberron: Forge of the Artificer, artificer: Alchemist",
  },

  chemicalMastery: {
    id: "embers:artificer:alchemist:chemical-mastery",
    name: "Chemical Mastery",
    kind: "class_feature",
    status: "verified",
    classes: ["artificer"],
    subclass: "alchemist",
    activationType: "special",
    resource: {
      name: "Chemical Mastery",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Chemical Mastery",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Chemical Mastery",
        description:
          "You gain the following benefits.\n\nAlchemical Eruption. When you cast an Artificer spell that deals Acid, Fire, or Poison damage to a target, you can also deal 2d8 Force damage to that target. You can use this benefit only once on each of your turns.\n\nChemical Resistance. You gain Resistance to Acid damage and Poison damage. You also gain Immunity to the Poisoned condition.\n\nConjured Cauldron. You can cast Tasha’s Bubbling Cauldron without expending a spell slot, without preparing the spell, a...",
      },
    ],
    description:
      "You gain the following benefits.\n\nAlchemical Eruption. When you cast an Artificer spell that deals Acid, Fire, or Poison damage to a target, you can also deal 2d8 Force damage to that target. You can use this benefit only once on each of your turn...",
    source: "Eberron: Forge of the Artificer, artificer: Alchemist",
  },
};
