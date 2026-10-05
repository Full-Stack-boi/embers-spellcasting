import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const COLLEGE_OF_VALOR_FORMULAS: Record<string, ManualActionFormula> = {
  combatInspiration: {
    id: "embers:bard:valor:combat-inspiration",
    name: "Combat Inspiration",
    kind: "class_feature",
    status: "verified",
    classes: ["bard"],
    subclass: "collegeOfValor",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Martial Valor",
        description:
          "Creatures with your Bardic Inspiration can add the die to a weapon damage roll or use a Reaction to add it to their Armor Class against an attack.",
      },
    ],
    description:
      "Inspire your comrades to deliver devastating blows and ward off incoming attacks.",
    source: "Player's Handbook (2024), Bard: College of Valor",
  },

  battleMagic: {
    id: "embers:bard:valor:battle-magic",
    name: "Battle Magic",
    kind: "class_feature",
    status: "verified",
    classes: ["bard"],
    subclass: "collegeOfValor",
    activationType: "bonus",
    operations: [
      {
        type: "apply_effect",
        name: "Spell and Blade Strike",
        description:
          "When you cast a spell that has a casting time of 1 action, you can make one weapon attack as a Bonus Action.",
      },
    ],
    description:
      "Seamlessly combine spellcasting with an immediate martial strike.",
    source: "Player's Handbook (2024), Bard: College of Valor",
  },
};
