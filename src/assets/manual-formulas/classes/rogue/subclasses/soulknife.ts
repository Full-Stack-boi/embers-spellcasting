import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const SOULKNIFE_FORMULAS: Record<string, ManualActionFormula> = {
  psychicBlades: {
    id: "embers:rogue:soulknife:psychic-blades",
    name: "Psychic Blades",
    kind: "class_feature",
    status: "verified",
    classes: ["rogue"],
    subclass: "soulknife",
    activationType: "action",
    operations: [
      {
        type: "apply_effect",
        name: "Psionic Dagger Manifestation",
        description:
          "Manifest a blade of psionic energy dealing 1d6 Psychic damage with Finesse and Thrown 60 ft; make a Bonus Action second strike dealing 1d4 Psychic damage.",
      },
    ],
    description:
      "Manifest shimmering blades of pure psionic energy from your hands.",
    source: "Player's Handbook (2024), Rogue: Soulknife",
  },

  psiBolsteredKnack: {
    id: "embers:rogue:soulknife:psi-bolstered-knack",
    name: "Psi-Bolstered Knack",
    kind: "class_feature",
    status: "verified",
    classes: ["rogue"],
    subclass: "soulknife",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Psionic Skill Surge",
        description:
          "When you fail an ability check using a proficient skill, add a Psionic Talent die to the roll; if you still fail, the die is not expended.",
      },
    ],
    description:
      "Boost failed skill checks with mental focus without losing psionic dice.",
    source: "Player's Handbook (2024), Rogue: Soulknife",
  },

  homingStrikes: {
    id: "embers:rogue:soulknife:homing-strikes",
    name: "Homing Strikes",
    kind: "class_feature",
    status: "verified",
    classes: ["rogue"],
    subclass: "soulknife",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Guided Blade",
        description:
          "When you make an attack roll with your Psychic Blades and miss, you can roll 1 Psionic Energy Die and add it to the attack roll. The die is expended only if the attack hits.",
      },
    ],
    description:
      "Guide errant psychic blade throws mentally to ensure strikes find their mark.",
    source: "Player's Handbook (2024), Rogue: Soulknife",
  },

  psychicTeleportation: {
    id: "embers:rogue:soulknife:psychic-teleportation",
    name: "Psychic Teleportation",
    kind: "class_feature",
    status: "verified",
    classes: ["rogue"],
    subclass: "soulknife",
    activationType: "bonus",
    operations: [
      {
        type: "apply_effect",
        name: "Blade Blink",
        description:
          "Bonus Action throw a psychic blade and teleport up to 10x the roll of a Psionic Talent die to an unoccupied space it reaches.",
      },
    ],
    description:
      "Hurl a psionic blade through the ether and instantly blink to its landing site.",
    source: "Player's Handbook (2024), Rogue: Soulknife",
  },

  psychicVeil: {
    id: "embers:rogue:soulknife:psychic-veil",
    name: "Psychic Veil",
    kind: "class_feature",
    status: "verified",
    classes: ["rogue"],
    subclass: "soulknife",
    activationType: "action",
    resource: {
      name: "Psychic Veil",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "apply_effect",
        name: "Psionic Invisibility",
        duration: "1 hour",
        description:
          "As an Action, weave a veil of telepathic static to become Invisible for 1 hour or until you deal damage or force a saving throw (1/Long Rest, or expend 1 Psionic die).",
      },
    ],
    description:
      "Weave psionic static into the minds of observers to become completely invisible.",
    source: "Player's Handbook (2024), Rogue: Soulknife",
  },

  rendMind: {
    id: "embers:rogue:soulknife:rend-mind",
    name: "Rend Mind",
    kind: "class_feature",
    status: "verified",
    classes: ["rogue"],
    subclass: "soulknife",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Psionic Stun",
        description:
          "When you deal Sneak Attack damage with a Psychic Blade, forego all Sneak Attack dice to force the target to make a Wisdom saving throw (DC 8 + DEX mod + PB) or have the Stunned condition for 1 minute (1/Long Rest, or expend 3 Psionic dice).",
      },
    ],
    description:
      "Sweep a psychic blade across the synapses of a foe, rendering them completely stunned.",
    source: "Player's Handbook (2024), Rogue: Soulknife",
  },
};
