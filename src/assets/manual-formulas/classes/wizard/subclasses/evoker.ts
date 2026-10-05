import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const EVOKER_FORMULAS: Record<string, ManualActionFormula> = {
  sculptSpells: {
    id: "embers:wizard:evoker:sculpt-spells",
    name: "Sculpt Spells",
    kind: "class_feature",
    status: "verified",
    classes: ["wizard"],
    subclass: "evoker",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Safe Pockets",
        description:
          "When casting an Evocation spell affecting an area, choose 1 + spell level creatures: chosen creatures automatically succeed on saving throws and take no damage from the spell.",
      },
    ],
    description:
      "Carve pockets of safety in blast zones to protect your allies from fireballs.",
    source: "Player's Handbook (2024), Wizard: Evoker",
  },

  potentCantrip: {
    id: "embers:wizard:evoker:potent-cantrip",
    name: "Potent Cantrip",
    kind: "class_feature",
    status: "verified",
    classes: ["wizard"],
    subclass: "evoker",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Guaranteed Cantrip Damage",
        description:
          "When a creature succeeds on a saving throw against your cantrip, or you miss with a cantrip attack, the creature still takes half damage.",
      },
    ],
    description:
      "Ensure your offensive cantrips inflict damage even on misses or successful saves.",
    source: "Player's Handbook (2024), Wizard: Evoker",
  },

  empoweredEvocation: {
    id: "embers:wizard:evoker:empowered-evocation",
    name: "Empowered Evocation",
    kind: "class_feature",
    status: "verified",
    classes: ["wizard"],
    subclass: "evoker",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Intense Destruction",
        description:
          "Add Intelligence modifier to one damage roll of any Wizard evocation spell you cast.",
      },
    ],
    description:
      "Supercharge evocation damage rolls with concentrated intellect.",
    source: "Player's Handbook (2024), Wizard: Evoker",
  },

  overchannel: {
    id: "embers:wizard:evoker:overchannel",
    name: "Overchannel",
    kind: "class_feature",
    status: "verified",
    classes: ["wizard"],
    subclass: "evoker",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Maximized Spell Energy",
        description:
          "When casting a level 1-5 Wizard evocation spell, deal maximum damage on all damage dice. Subsequent uses before a Long Rest deal 2d12 to 5d12 Necrotic damage to you per spell level.",
      },
    ],
    description:
      "Unleash maximum theoretical destructive energy from your evocation spells.",
    source: "Player's Handbook (2024), Wizard: Evoker",
  },
};
