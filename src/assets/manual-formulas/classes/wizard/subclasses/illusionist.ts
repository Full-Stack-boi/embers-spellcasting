import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const ILLUSIONIST_FORMULAS: Record<string, ManualActionFormula> = {
  improvedMinorIllusion: {
    id: "embers:wizard:illusionist:improved-minor-illusion",
    name: "Improved Minor Illusion",
    kind: "class_feature",
    status: "verified",
    classes: ["wizard"],
    subclass: "illusionist",
    activationType: "bonus",
    operations: [
      {
        type: "apply_effect",
        name: "Compound Illusion",
        description:
          "Minor Illusion creates both sound and image simultaneously in a single cast; you can cast it as a Bonus Action.",
      },
    ],
    description:
      "Weave compound sound and visual illusions in the blink of an eye.",
    source: "Player's Handbook (2024), Wizard: Illusionist",
  },

  malleableIllusions: {
    id: "embers:wizard:illusionist:malleable-illusions",
    name: "Malleable Illusions",
    kind: "class_feature",
    status: "verified",
    classes: ["wizard"],
    subclass: "illusionist",
    activationType: "action",
    operations: [
      {
        type: "apply_effect",
        name: "Dynamic Phantasm",
        description:
          "Action change the sensory parameters, appearance, and behavior of an ongoing illusion spell you cast.",
      },
    ],
    description:
      "Reshape active illusions dynamically to adapt to changing battlefield situations.",
    source: "Player's Handbook (2024), Wizard: Illusionist",
  },

  phantasmalCreatures: {
    id: "embers:wizard:illusionist:phantasmal-creatures",
    name: "Phantasmal Creatures",
    kind: "class_feature",
    status: "verified",
    classes: ["wizard"],
    subclass: "illusionist",
    activationType: "special",
    description: "Summon Beast and Summon Fey are always prepared for you and count as Illusion spells. You can cast each once without material components and summon an additional illusory twin creature.",
    source: "Player's Handbook (2024), Wizard: Illusionist",
    operations: [
      {
        type: "apply_effect",
        name: "Phantasmal Summons",
        description: "Cast Summon Beast and Summon Fey as Illusion spells without material components; summon an illusory twin alongside the creature.",
      },
    ],
  },

  illusorySelf: {
    id: "embers:wizard:illusionist:illusory-self",
    name: "Illusory Self",
    kind: "class_feature",
    status: "verified",
    classes: ["wizard"],
    subclass: "illusionist",
    activationType: "reaction",
    resource: {
      name: "Illusory Self",
      resetType: "Short or Long Rest",
    },
    operations: [
      {
        type: "apply_effect",
        name: "Doppelganger Decoy",
        description:
          "Reaction when a creature makes an attack roll against you: manifest an illusory decoy, causing the attack to automatically miss (1/Short or Long Rest, or expend a level 2+ spell slot).",
      },
    ],
    description:
      "Substitute a decoy at the instant of impact, causing an attack to miss completely.",
    source: "Player's Handbook (2024), Wizard: Illusionist",
  },

  illusoryReality: {
    id: "embers:wizard:illusionist:illusory-reality",
    name: "Illusory Reality",
    kind: "class_feature",
    status: "verified",
    classes: ["wizard"],
    subclass: "illusionist",
    activationType: "bonus",
    description: "Bonus Action make one inanimate, nonmagical object that is part of an illusion spell of level 1 or higher real for 1 minute.",
    source: "Player's Handbook (2024), Wizard: Illusionist",
    operations: [
      {
        type: "apply_effect",
        name: "Shadow Reality Conversion",
        description: "Weave shadow substance into an illusion, making one inanimate object real for 1 minute (cannot deal damage directly).",
      },
    ],
  },
};
