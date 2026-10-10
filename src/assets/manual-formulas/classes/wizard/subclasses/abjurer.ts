import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const ABJURER_FORMULAS: Record<string, ManualActionFormula> = {
  arcaneWard: {
    id: "embers:wizard:abjurer:arcane-ward",
    name: "Arcane Ward",
    kind: "class_feature",
    status: "verified",
    classes: ["wizard"],
    subclass: "abjurer",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Magical Barrier",
        description:
          "When you cast an Abjuration spell with a spell slot, create an Arcane Ward with HP equal to 2x Wizard level + INT mod. The ward absorbs damage instead of your HP; casting abjuration spells restores ward HP.",
      },
    ],
    description:
      "Erect a durable arcane shield that absorbs damage directed at you.",
    source: "Player's Handbook (2024), Wizard: Abjurer",
  },

  projectedWard: {
    id: "embers:wizard:abjurer:projected-ward",
    name: "Projected Ward",
    kind: "class_feature",
    status: "verified",
    classes: ["wizard"],
    subclass: "abjurer",
    activationType: "reaction",
    operations: [
      {
        type: "apply_effect",
        name: "Shield Ally",
        description:
          "Reaction when an ally within 30 feet takes damage: your Arcane Ward intercepts and absorbs the damage for them.",
      },
    ],
    description:
      "Project your protective ward to intercept damage dealt to companions.",
    source: "Player's Handbook (2024), Wizard: Abjurer",
  },

  spellBreaker: {
    id: "embers:wizard:abjurer:spell-breaker",
    name: "Spell Breaker",
    kind: "class_feature",
    status: "verified",
    classes: ["wizard"],
    subclass: "abjurer",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Dispel Mastery",
        description:
          "Add Intelligence modifier to ability checks made as part of casting Counterspell and Dispel Magic; cast Dispel Magic as a Ritual.",
      },
    ],
    description:
      "Unravel hostile spells with effortless, clinical counter-magic mastery.",
    source: "Player's Handbook (2024), Wizard: Abjurer",
  },

  spellResistance: {
    id: "embers:wizard:abjurer:spell-resistance",
    name: "Spell Resistance",
    kind: "class_feature",
    status: "verified",
    classes: ["wizard"],
    subclass: "abjurer",
    activationType: "special",
    description: "You have Advantage on saving throws against spells, and Resistance against damage dealt by spells.",
    source: "Player's Handbook (2024), Wizard: Abjurer",
    operations: [
      {
        type: "apply_effect",
        name: "Abjuration Immunity Ward",
        description: "Advantage on saving throws against spells; Resistance against the damage of spells.",
      },
    ],
  },
};
