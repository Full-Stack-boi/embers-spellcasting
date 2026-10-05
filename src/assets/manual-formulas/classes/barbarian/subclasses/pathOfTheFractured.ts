import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const PATH_OF_THE_FRACTURED_FORMULAS: Record<
  string,
  ManualActionFormula
> = {
  faceOfRage: {
    id: "embers:barbarian:path-of-the-fractured:face-of-rage",
    name: "Face of Rage",
    kind: "class_feature",
    status: "verified",
    classes: ["barbarian"],
    subclass: "pathOfTheFractured",
    activationType: "special",
    resource: {
      name: "Face of Rage",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Face of Rage",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Face of Rage",
        description:
          "When you activate your Rage, your countenance distorts and your body swells. Creatures that haven’t witnessed your transformation, now or previously, don’t recognize you. In addition, while your Rage is active, you gain the following benefits:\n\nYou can roll 1d8 in place of the normal damage of your Unarmed Strike, and whenever you deal damage with an Unarmed Strike, it can deal your choice of Force damage or its normal damage type.\nWhen you hit a creature with an Unarmed Strike, you can push ...",
      },
    ],
    description:
      "When you activate your Rage, your countenance distorts and your body swells. Creatures that haven’t witnessed your transformation, now or previously, don’t recognize you. In addition, while your Rage is active, you gain the following benefits:\n\nYo...",
    source: "Grim Hollow: Player’s Guide, Barbarian: Path of the Fractured",
  },

  maskOfCivility: {
    id: "embers:barbarian:path-of-the-fractured:mask-of-civility",
    name: "Mask of Civility",
    kind: "class_feature",
    status: "verified",
    classes: ["barbarian"],
    subclass: "pathOfTheFractured",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Mask of Civility",
        description:
          "You are proficient in one of the following skills of your choice: Arcana, History, Investigation, Medicine, Nature, Persuasion, or Religion. In addition, you gain proficiency with one type of Artisan’s Tools of your choice or you know one language of your choice.",
      },
    ],
    description:
      "You are proficient in one of the following skills of your choice: Arcana, History, Investigation, Medicine, Nature, Persuasion, or Religion. In addition, you gain proficiency with one type of Artisan’s Tools of your choice or you know one language...",
    source: "Grim Hollow: Player’s Guide, Barbarian: Path of the Fractured",
  },

  brainsAndBrawn: {
    id: "embers:barbarian:path-of-the-fractured:brains-and-brawn",
    name: "Brains and Brawn",
    kind: "class_feature",
    status: "verified",
    classes: ["barbarian"],
    subclass: "pathOfTheFractured",
    activationType: "special",
    resource: {
      name: "Brains and Brawn",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Brains and Brawn",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Brains and Brawn",
        description:
          "While your Rage is not active, you have Resistance to Psychic damage. While your Rage is active, you have Resistance to every damage type except Force and Psychic.",
      },
    ],
    description:
      "While your Rage is not active, you have Resistance to Psychic damage. While your Rage is active, you have Resistance to every damage type except Force and Psychic.",
    source: "Grim Hollow: Player’s Guide, Barbarian: Path of the Fractured",
  },

  cunningAndBrutal: {
    id: "embers:barbarian:path-of-the-fractured:cunning-and-brutal",
    name: "Cunning and Brutal",
    kind: "class_feature",
    status: "verified",
    classes: ["barbarian"],
    subclass: "pathOfTheFractured",
    activationType: "bonus",
    resource: {
      name: "Cunning and Brutal",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Cunning and Brutal",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Cunning and Brutal",
        description:
          "While your Rage is not active, you can take the Disengage or Help action as a Bonus Action. While your Rage is active, your attack rolls with Unarmed Strikes score a Critical Hit on a roll of 19 or 20 on the d20.",
      },
    ],
    description:
      "While your Rage is not active, you can take the Disengage or Help action as a Bonus Action. While your Rage is active, your attack rolls with Unarmed Strikes score a Critical Hit on a roll of 19 or 20 on the d20.",
    source: "Grim Hollow: Player’s Guide, Barbarian: Path of the Fractured",
  },

  betterHalf: {
    id: "embers:barbarian:path-of-the-fractured:better-half",
    name: "Better Half",
    kind: "class_feature",
    status: "verified",
    classes: ["barbarian"],
    subclass: "pathOfTheFractured",
    activationType: "special",
    resource: {
      name: "Better Half",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Better Half",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Better Half",
        description:
          "When you are reduced to 0 Hit Points and not killed outright, you can drop to 1 Hit Point instead, and you gain Temporary Hit Points equal to half your Hit Point maximum. In addition, if your Rage is active, your Rage ends. If your Rage was not active, you immediately activate your Rage (even if you have no remaining uses of your Rage). If any of these Temporary Hit Points remain after 1 minute, they vanish.\n\nOnce you use this feature, you can’t use it again until you finish a Long Rest.",
      },
    ],
    description:
      "When you are reduced to 0 Hit Points and not killed outright, you can drop to 1 Hit Point instead, and you gain Temporary Hit Points equal to half your Hit Point maximum. In addition, if your Rage is active, your Rage ends. If your Rage was not ac...",
    source: "Grim Hollow: Player’s Guide, Barbarian: Path of the Fractured",
  },
};
