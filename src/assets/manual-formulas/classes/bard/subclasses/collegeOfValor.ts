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

  extraAttack: {
    id: "embers:bard:valor:extra-attack",
    name: "Extra Attack",
    kind: "class_feature",
    status: "verified",
    classes: ["bard"],
    subclass: "collegeOfValor",
    activationType: "special",
    description: "You can attack twice when you take the Attack action, and you can cast one of your cantrips that has a casting time of 1 action in place of one of those attacks.",
    source: "Player's Handbook (2024), Bard: College of Valor",
    operations: [
      {
        type: "apply_effect",
        name: "Martial Cantrip Extra Attack",
        description: "Attack twice when taking the Attack action; you can replace one attack with a cantrip that has a casting time of 1 action.",
      },
    ],
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
