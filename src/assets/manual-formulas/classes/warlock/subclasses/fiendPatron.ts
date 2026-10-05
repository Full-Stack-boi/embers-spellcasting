import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const FIEND_PATRON_FORMULAS: Record<string, ManualActionFormula> = {
  darkOnesBlessing: {
    id: "embers:warlock:fiend:dark-ones-blessing",
    name: "Dark One's Blessing",
    kind: "class_feature",
    status: "verified",
    classes: ["warlock"],
    subclass: "fiendPatron",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Infernal Soul Siphon",
        description:
          "Whenever you reduce a hostile creature to 0 HP, gain Temporary Hit Points equal to your Charisma modifier + Warlock level.",
      },
    ],
    description:
      "Siphon vital essence from fallen enemies to feed your infernal ward.",
    source: "Player's Handbook (2024), Warlock: Fiend Patron",
  },

  darkOnesOwnLuck: {
    id: "embers:warlock:fiend:dark-ones-own-luck",
    name: "Dark One's Own Luck",
    kind: "class_feature",
    status: "verified",
    classes: ["warlock"],
    subclass: "fiendPatron",
    activationType: "special",
    resource: {
      name: "Dark One's Own Luck",
      resetType: "Short or Long Rest",
    },
    operations: [
      {
        type: "apply_effect",
        name: "Infernal Die Surge",
        description:
          "When you fail an ability check or saving throw, add 1d10 to the roll (1/Short or Long Rest).",
      },
    ],
    description:
      "Call upon infernal favor to turn failure into decisive triumph.",
    source: "Player's Handbook (2024), Warlock: Fiend Patron",
  },

  hurlThroughHell: {
    id: "embers:warlock:fiend:hurl-through-hell",
    name: "Hurl Through Hell",
    kind: "class_feature",
    status: "verified",
    classes: ["warlock"],
    subclass: "fiendPatron",
    activationType: "special",
    resource: {
      name: "Hurl Through Hell",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "apply_effect",
        name: "Infernal Banishment Blast",
        description:
          "When you hit with an attack, banish the target through the Lower Planes for 1 turn; when it returns, it takes 10d10 Psychic damage (1/Long Rest or expend level 5 slot).",
      },
    ],
    description:
      "Hurl an enemy into the fires of the Nine Hells for shattering psychic torment.",
    source: "Player's Handbook (2024), Warlock: Fiend Patron",
  },
};
