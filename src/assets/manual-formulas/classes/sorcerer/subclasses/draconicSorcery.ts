import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const DRACONIC_SORCERY_FORMULAS: Record<string, ManualActionFormula> = {
  draconicResilience: {
    id: "embers:sorcerer:draconic:draconic-resilience",
    name: "Draconic Resilience",
    kind: "class_feature",
    status: "verified",
    classes: ["sorcerer"],
    subclass: "draconicSorcery",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Scales of the Dragon",
        description:
          "While not wearing armor: base AC = 13 + DEX mod; your Hit Point maximum increases by 1 per Sorcerer level.",
      },
    ],
    description:
      "Grow dragon scales that deflect attacks and bolster your vital stamina.",
    source: "Player's Handbook (2024), Sorcerer: Draconic Sorcery",
  },

  elementalAffinity: {
    id: "embers:sorcerer:draconic:elemental-affinity",
    name: "Elemental Affinity",
    kind: "class_feature",
    status: "verified",
    classes: ["sorcerer"],
    subclass: "draconicSorcery",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Dragon Breath Synergy",
        description:
          "Add Charisma modifier to one damage roll of spells matching your dragon ancestor; spend 1 Sorcery Point to gain 1 hour Resistance to that damage type.",
      },
    ],
    description:
      "Empower spells of your dragon ancestor's element with fierce extra damage.",
    source: "Player's Handbook (2024), Sorcerer: Draconic Sorcery",
  },

  dragonWings: {
    id: "embers:sorcerer:draconic:dragon-wings",
    name: "Dragon Wings",
    kind: "class_feature",
    status: "verified",
    classes: ["sorcerer"],
    subclass: "draconicSorcery",
    activationType: "bonus",
    operations: [
      {
        type: "apply_effect",
        name: "Draconic Flight",
        description:
          "Bonus Action manifest leathery dragon wings from your back, gaining a Fly speed equal to your Speed.",
      },
    ],
    description: "Sprout draconic wings to take to the skies at will.",
    source: "Player's Handbook (2024), Sorcerer: Draconic Sorcery",
  },
};
