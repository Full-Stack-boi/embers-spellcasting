import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const COLLEGE_OF_LORE_FORMULAS: Record<string, ManualActionFormula> = {
  cuttingWords: {
    id: "embers:bard:lore:cutting-words",
    name: "Cutting Words",
    kind: "class_feature",
    status: "verified",
    classes: ["bard"],
    subclass: "collegeOfLore",
    activationType: "reaction",
    operations: [
      {
        type: "apply_effect",
        name: "Witty Repartee",
        description:
          "Reaction when a creature you can see within 60 feet makes an attack roll, ability check, or damage roll: expend 1 Bardic Inspiration to subtract the roll from the target's total.",
      },
    ],
    description:
      "Disrupt enemy confidence and precision with scathing, razor-sharp insults.",
    source: "Player's Handbook (2024), Bard: College of Lore",
  },

  magicalDiscoveries: {
    id: "embers:bard:lore:magical-discoveries",
    name: "Magical Discoveries",
    kind: "class_feature",
    status: "verified",
    classes: ["bard"],
    subclass: "collegeOfLore",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Esoteric Magic",
        description:
          "Learn two spells of your choice from any class spell list, which count as Bard spells for you.",
      },
    ],
    description:
      "Plumb the deepest vaults of magical lore to master spells from other classes.",
    source: "Player's Handbook (2024), Bard: College of Lore",
  },

  peerlessSkill: {
    id: "embers:bard:lore:peerless-skill",
    name: "Peerless Skill",
    kind: "class_feature",
    status: "verified",
    classes: ["bard"],
    subclass: "collegeOfLore",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Mastery Assurance",
        description:
          "When you make an ability check or attack roll and fail, expend 1 Bardic Inspiration to add the die. If you still fail, the die is not expended.",
      },
    ],
    description:
      "Guarantee triumph on crucial checks without wasting your inspirations.",
    source: "Player's Handbook (2024), Bard: College of Lore",
  },
};
