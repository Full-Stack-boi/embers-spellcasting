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
