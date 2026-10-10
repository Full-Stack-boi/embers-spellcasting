import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const ABERRANT_SORCERY_FORMULAS: Record<string, ManualActionFormula> = {
  telepathicSpeech: {
    id: "embers:sorcerer:aberrant:telepathic-speech",
    name: "Telepathic Speech",
    kind: "class_feature",
    status: "verified",
    classes: ["sorcerer"],
    subclass: "aberrantSorcery",
    activationType: "bonus",
    operations: [
      {
        type: "apply_effect",
        name: "Mind Link",
        description:
          "Bonus Action create a telepathic link with a creature you can see within 30 ft for a number of miles equal to your Charisma modifier.",
      },
    ],
    description:
      "Open an intimate telepathic corridor into another creature's consciousness.",
    source: "Player's Handbook (2024), Sorcerer: Aberrant Sorcery",
  },

  psionicSorcery: {
    id: "embers:sorcerer:aberrant:psionic-sorcery",
    name: "Psionic Sorcery",
    kind: "class_feature",
    status: "verified",
    classes: ["sorcerer"],
    subclass: "aberrantSorcery",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Componentless Casting",
        description:
          "Cast any Psionic Spell by spending Sorcery Points equal to its level; doing so requires no Verbal, Somatic, or non-cost Material components.",
      },
    ],
    description:
      "Cast spells entirely through raw thought without verbal or somatic tells.",
    source: "Player's Handbook (2024), Sorcerer: Aberrant Sorcery",
  },

  psychicDefenses: {
    id: "embers:sorcerer:aberrant:psychic-defenses",
    name: "Psychic Defenses",
    kind: "class_feature",
    status: "verified",
    classes: ["sorcerer"],
    subclass: "aberrantSorcery",
    activationType: "special",
    description: "You have Resistance to Psychic damage, and you have Advantage on saving throws against being Charmed or Frightened.",
    source: "Player's Handbook (2024), Sorcerer: Aberrant Sorcery",
    operations: [
      {
        type: "apply_effect",
        name: "Alien Mind Ward",
        description: "Resistance to Psychic damage; Advantage on saves against Charmed and Frightened.",
      },
    ],
  },

  revelationInFlesh: {
    id: "embers:sorcerer:aberrant:revelation-in-flesh",
    name: "Revelation in Flesh",
    kind: "class_feature",
    status: "verified",
    classes: ["sorcerer"],
    subclass: "aberrantSorcery",
    activationType: "bonus",
    description: "Spend 1 or more Sorcery Points as a Bonus Action to transform your body for 10 minutes, choosing adaptations: flying, swimming/breathing, squeezing/escape, or seeing invisible creatures.",
    source: "Player's Handbook (2024), Sorcerer: Aberrant Sorcery",
    operations: [],
    options: [
      {
        id: "see_invisible",
        name: "See the Invisible",
        cost: 1,
        desc: "See invisible creatures within 60 feet that aren't behind total cover",
        actionType: "bonus",
      },
      {
        id: "flying",
        name: "Flying",
        cost: 1,
        desc: "Gain a Fly speed equal to your Speed and can hover",
        actionType: "bonus",
      },
      {
        id: "swimming",
        name: "Swimming",
        cost: 1,
        desc: "Gain a Swim speed twice your Speed and breathe underwater",
        actionType: "bonus",
      },
      {
        id: "gaseous",
        name: "Squeeze & Escape",
        cost: 1,
        desc: "Move through spaces as narrow as 1 inch without squeezing; spend 5 ft of movement to escape nonmagical restraints or grapples",
        actionType: "bonus",
      },
    ],
  },

  warpingImplosion: {
    id: "embers:sorcerer:aberrant:warping-implosion",
    name: "Warping Implosion",
    kind: "class_feature",
    status: "verified",
    classes: ["sorcerer"],
    subclass: "aberrantSorcery",
    activationType: "action",
    operations: [
      {
        type: "apply_effect",
        name: "Void Rift",
        description:
          "Action spend 5 Sorcery Points: teleport up to 120 ft; creatures within 30 ft of origin space make Strength save or take 3d10 Force damage and are pulled toward the center.",
      },
    ],
    description:
      "Tear open an alien void rift that pulls nearby enemies into an imploding singularity.",
    source: "Player's Handbook (2024), Sorcerer: Aberrant Sorcery",
  },
};
