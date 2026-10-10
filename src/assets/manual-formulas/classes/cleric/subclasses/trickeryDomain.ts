import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const TRICKERY_DOMAIN_FORMULAS: Record<string, ManualActionFormula> = {
  blessingOfTheTrickster: {
    id: "embers:cleric:trickery:blessing-of-the-trickster",
    name: "Blessing of the Trickster",
    kind: "class_feature",
    status: "verified",
    classes: ["cleric"],
    subclass: "trickeryDomain",
    activationType: "action",
    operations: [
      {
        type: "apply_effect",
        name: "Stealth Boon",
        description:
          "Action touch a willing creature: grant it Advantage on Dexterity (Stealth) checks for 1 hour or until you use this feature again.",
      },
    ],
    description: "Veil a companion in stealth and misdirection.",
    source: "Player's Handbook (2024), Cleric: Trickery Domain",
  },

  invokeDuplicity: {
    id: "embers:cleric:trickery:invoke-duplicity",
    name: "Channel Divinity: Invoke Duplicity",
    kind: "class_feature",
    status: "verified",
    classes: ["cleric"],
    subclass: "trickeryDomain",
    activationType: "bonus",
    operations: [
      {
        type: "apply_effect",
        name: "Illusory Double",
        description:
          "Bonus Action expend 1 Channel Divinity: create an illusory double within 30 ft for 1 minute; cast spells from its space, gain Advantage on attacks while within 5 ft of it.",
      },
    ],
    description:
      "Manifest a convincing spectral decoy to confuse foes and project spells.",
    source: "Player's Handbook (2024), Cleric: Trickery Domain",
  },

  trickstersTransposition: {
    id: "embers:cleric:trickery:tricksters-transposition",
    name: "Trickster's Transposition",
    kind: "class_feature",
    status: "verified",
    classes: ["cleric"],
    subclass: "trickeryDomain",
    activationType: "bonus",
    operations: [
      {
        type: "apply_effect",
        name: "Duplicate Swap",
        description:
          "As a Bonus Action, teleport swapping spaces with your illusory duplicate up to 30 feet away.",
      },
    ],
    description: "Swap places with your duplicate in the blink of an eye.",
    source: "Player's Handbook (2024), Cleric: Trickery Domain",
  },

  improvedDuplicity: {
    id: "embers:cleric:trickery:improved-duplicity",
    name: "Improved Duplicity",
    kind: "class_feature",
    status: "verified",
    classes: ["cleric"],
    subclass: "trickeryDomain",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Supreme Illusion",
        description:
          "Your illusory duplicate now grants Advantage on attack rolls to you and your allies within 5 feet of it. In addition, when you cast a spell that restores Hit Points, you can cause the duplicate to heal a creature near it as well.",
      },
    ],
    description:
      "Level 17 Capstone: Empower your illusory duplicate to grant party-wide advantage and mirror spells.",
    source: "Player's Handbook (2024), Cleric: Trickery Domain",
  },
};
