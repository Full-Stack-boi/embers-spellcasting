import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const CLOCKWORK_SORCERY_FORMULAS: Record<string, ManualActionFormula> = {
  restoreBalance: {
    id: "embers:sorcerer:clockwork:restore-balance",
    name: "Restore Balance",
    kind: "class_feature",
    status: "verified",
    classes: ["sorcerer"],
    subclass: "clockworkSorcery",
    activationType: "reaction",
    resource: {
      name: "Restore Balance",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "apply_effect",
        name: "Equilibrium Nullification",
        description:
          "Reaction when a creature within 60 ft rolls with Advantage or Disadvantage: cancel the Advantage or Disadvantage (Proficiency Bonus uses per Long Rest).",
      },
    ],
    description:
      "Enforce cosmic Mechanus symmetry by denying roll advantages or penalties.",
    source: "Player's Handbook (2024), Sorcerer: Clockwork Sorcery",
  },

  bastionOfLaw: {
    id: "embers:sorcerer:clockwork:bastion-of-law",
    name: "Bastion of Law",
    kind: "class_feature",
    status: "verified",
    classes: ["sorcerer"],
    subclass: "clockworkSorcery",
    activationType: "action",
    operations: [
      {
        type: "apply_effect",
        name: "Aegis Shield of D8s",
        description:
          "Action spend 1 to 5 Sorcery Points to create a protective ward of d8s equal to the points spent; the warded creature can roll and subtract dice to reduce incoming damage.",
      },
    ],
    description:
      "Imbue an ally with clockwork geometric wards that absorb damage.",
    source: "Player's Handbook (2024), Sorcerer: Clockwork Sorcery",
  },

  tranceOfOrder: {
    id: "embers:sorcerer:clockwork:trance-of-order",
    name: "Trance of Order",
    kind: "class_feature",
    status: "verified",
    classes: ["sorcerer"],
    subclass: "clockworkSorcery",
    activationType: "bonus",
    operations: [
      {
        type: "apply_effect",
        name: "Flawless Probability",
        description:
          "Bonus Action spend 5 Sorcery Points for 1 minute: any attack roll, ability check, or save you make that rolls 9 or lower on the d20 becomes a 10; attacks against you cannot have advantage.",
      },
    ],
    description:
      "Enter a state of supreme cosmic order where probability bends to perfection.",
    source: "Player's Handbook (2024), Sorcerer: Clockwork Sorcery",
  },

  clockworkCavalcade: {
    id: "embers:sorcerer:clockwork:clockwork-cavalcade",
    name: "Clockwork Cavalcade",
    kind: "class_feature",
    status: "verified",
    classes: ["sorcerer"],
    subclass: "clockworkSorcery",
    activationType: "action",
    resource: {
      name: "Clockwork Cavalcade",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "apply_effect",
        name: "Spirits of Mechanus",
        description: "Action spend 7 Sorcery Points or 1/Long Rest: summon spirits in a 30-foot cube to heal up to 100 Hit Points divided among creatures, repair objects, and dispel all spells of level 6 or lower.",
      },
    ],
    description: "Summon a march of modron spirits of absolute order to repair and cleanse reality.",
    source: "Player's Handbook (2024), Sorcerer: Clockwork Sorcery",
  },
};
