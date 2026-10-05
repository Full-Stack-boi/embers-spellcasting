import type { ManualActionFormula } from "../../../types/manualFormula";

export const ARCANA_UNLEASHED_FEAT_FORMULAS: Record<
  string,
  ManualActionFormula
> = {
  portal_jumper: {
    id: "feat:portal-jumper",
    name: "Portal Jumper: Phase Step",
    kind: "feat",
    status: "verified",
    classes: [],
    activationType: "special",
    resource: {
      name: "Phase Step Uses",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Phase Step Uses",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "15-Foot Teleport",
        description:
          "Spend 15 feet of your movement to teleport up to 15 feet to an unoccupied space you can see.",
      },
    ],
    description:
      "Once on each of your turns, you can expend 15 feet of your movement to teleport up to 15 feet to an unoccupied space you can see. You can use this feature a number of times equal to your Proficiency Bonus per Long Rest. You also gain resistance to Necrotic, Psychic, or Radiant damage (chosen upon taking the feat).",
    source: "Arcana Unleashed, pg. 22",
    notes:
      "Teleport 15 ft using 15 ft of speed (PB times per Long Rest). Also grants chosen damage resistance.",
  },

  arcane_infiltrator: {
    id: "feat:arcane-infiltrator",
    name: "Arcane Infiltrator: Elusive Dodge",
    kind: "feat",
    status: "verified",
    classes: [],
    activationType: "bonus",
    resource: {
      name: "Elusive Dodge Uses",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Elusive Dodge Uses",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Bonus Action Dodge",
        description: "Take the Dodge action as a Bonus Action.",
      },
    ],
    description:
      "You learn the Friends cantrip. As a Bonus Action, you can take the Dodge action. You can use this Bonus Action a number of times equal to your Proficiency Bonus per Long Rest.",
    source: "Arcana Unleashed, pg. 21",
    notes:
      "Bonus Action Dodge PB times per Long Rest. Also grants Friends cantrip.",
  },

  arcane_omens: {
    id: "feat:arcane-omens",
    name: "Arcane Omens: Fateful Guidance",
    kind: "feat",
    status: "verified",
    classes: [],
    activationType: "reaction",
    resource: {
      name: "Fateful Guidance Uses",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Fateful Guidance Uses",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Add 1d4 to Saving Throw",
        description:
          "Use your Reaction when a creature within 30 feet fails a saving throw to roll 1d4 and add it to the save result.",
      },
    ],
    description:
      "You learn the Guidance cantrip. When a creature you can see within 30 feet fails a saving throw, you can use your Reaction to roll 1d4 and add the result to the save, potentially turning failure into success. You can use this Reaction a number of times equal to your Proficiency Bonus per Long Rest.",
    source: "Arcana Unleashed, pg. 21",
    notes:
      "Reaction add 1d4 to failed save within 30 ft PB times/Long Rest. Also grants Guidance cantrip.",
  },

  arcane_safeguard: {
    id: "feat:arcane-safeguard",
    name: "Arcane Safeguard: Ward Ally",
    kind: "feat",
    status: "verified",
    classes: [],
    activationType: "bonus",
    resource: {
      name: "Quick Ward Uses",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Quick Ward Uses",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Bonus Action Resistance",
        description:
          "Cast the Resistance cantrip as a Bonus Action targeting a creature within range.",
      },
    ],
    description:
      "You learn the Resistance cantrip. You can cast it as a Bonus Action a number of times equal to your Proficiency Bonus per Long Rest. In addition, when you take the Help action to assist an ally, that ally gains Temporary Hit Points equal to your Proficiency Bonus.",
    source: "Arcana Unleashed, pg. 21",
    notes:
      "Bonus Action Resistance PB times per Long Rest. Help action grants Temp HP equal to PB.",
  },

  boon_of_the_iron_mind: {
    id: "feat:boon-of-the-iron-mind",
    name: "Boon of the Iron Mind: Unshakable Focus",
    kind: "feat",
    status: "verified",
    classes: [],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Unshakable Focus",
        description:
          "You cannot lose Concentration on a spell as a result of taking damage.",
      },
    ],
    description:
      "Your focus is impenetrable. Taking damage cannot cause you to lose Concentration on a spell. Your Concentration ends only if you cast another spell requiring Concentration, become Incapacitated, or die.",
    source: "Arcana Unleashed, pg. 26",
    notes: "Epic Boon (Level 19+). Concentration is immune to damage breaks.",
  },

  boon_of_erupting_spellpower: {
    id: "feat:boon-of-erupting-spellpower",
    name: "Boon of Erupting Spellpower",
    kind: "feat",
    status: "verified",
    classes: [],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Erupting Spell Damage",
        description:
          "When you roll damage for a spell, any die roll of 1 or 2 is treated as a 3. Additionally, creatures damaged by the spell must succeed on a Strength saving throw against your spell save DC or be knocked Prone.",
      },
    ],
    description:
      "Whenever you roll damage for a spell, any damage die that rolls a 1 or 2 is treated as having rolled a 3. In addition, when you deal damage to a creature with a spell of 1st level or higher, you can force the creature to make a Strength saving throw against your spell save DC or have the Prone condition.",
    source: "Arcana Unleashed, pg. 26",
    notes:
      "Epic Boon (Level 19+). Minimum 3 on spell damage dice + knock targets Prone.",
  },
};
