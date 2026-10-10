import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const PATH_OF_THE_WILD_HEART_FORMULAS: Record<
  string,
  ManualActionFormula
> = {
  animalSpeaker: {
    id: "embers:barbarian:wild-heart:animal-speaker",
    name: "Animal Speaker",
    kind: "class_feature",
    status: "verified",
    classes: ["barbarian"],
    subclass: "pathOfTheWildHeart",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Beast Communication",
        description:
          "You can cast Beast Sense and Speak with Animals spells as Rituals using Wisdom as your spellcasting ability.",
      },
    ],
    description:
      "Form an innate magical communion with the animals of the natural world.",
    source: "Player's Handbook (2024), Barbarian: Path of the Wild Heart",
  },

  rageOfTheWilds: {
    id: "embers:barbarian:wild-heart:rage-of-the-wilds",
    name: "Rage of the Wilds",
    kind: "class_feature",
    status: "verified",
    classes: ["barbarian"],
    subclass: "pathOfTheWildHeart",
    activationType: "special",
    flyoutType: "options_grid",
    operations: [
      {
        type: "apply_effect",
        name: "Animal Aspect",
        description:
          "When entering Rage, choose Bear (Resistance to all damage except Force, Necrotic, Psychic, Radiant), Eagle (Dash and Disengage as Bonus Action), or Wolf (Allies have Advantage on attack rolls against enemies within 5 ft).",
      },
    ],
    options: [
      {
        id: "bear",
        name: "Bear",
        cost: 0,
        desc: "Resistance to all damage types except Force, Necrotic, Psychic, and Radiant while raging.",
        actionType: "none",
      },
      {
        id: "eagle",
        name: "Eagle",
        cost: 0,
        desc: "Take Disengage and Dash as part of entering Rage, and as a Bonus Action while raging.",
        actionType: "bonus",
      },
      {
        id: "wolf",
        name: "Wolf",
        cost: 0,
        desc: "Allies have Advantage on attack rolls against any enemy of yours within 5 feet while raging.",
        actionType: "none",
      },
    ],
    description:
      "Channel the primal spirits of the Bear, Eagle, or Wolf while raging.",
    source: "Player's Handbook (2024), Barbarian: Path of the Wild Heart",
  },

  aspectOfTheWilds: {
    id: "embers:barbarian:wild-heart:aspect-of-the-wilds",
    name: "Aspect of the Wilds",
    kind: "class_feature",
    status: "verified",
    classes: ["barbarian"],
    subclass: "pathOfTheWildHeart",
    activationType: "special",
    flyoutType: "options_grid",
    operations: [
      {
        type: "apply_effect",
        name: "Wild Aspect Boon",
        description:
          "Gain mystical animal blessings: Owl (+60 ft Darkvision), Panther (Climb speed equal to Speed), or Salmon (Swim speed equal to Speed). Change choice after Long Rest.",
      },
    ],
    options: [
      {
        id: "owl",
        name: "Owl",
        cost: 0,
        desc: "Darkvision 60 ft (or increases by 60 ft if you already have it).",
        actionType: "none",
      },
      {
        id: "panther",
        name: "Panther",
        cost: 0,
        desc: "Climb speed equal to your Speed.",
        actionType: "none",
      },
      {
        id: "salmon",
        name: "Salmon",
        cost: 0,
        desc: "Swim speed equal to your Speed.",
        actionType: "none",
      },
    ],
    description:
      "Attune yourself to the passive gifts of natural predators and beasts.",
    source: "Player's Handbook (2024), Barbarian: Path of the Wild Heart",
  },

  natureSpeaker: {
    id: "embers:barbarian:wild-heart:nature-speaker",
    name: "Nature Speaker",
    kind: "class_feature",
    status: "verified",
    classes: ["barbarian"],
    subclass: "pathOfTheWildHeart",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Commune With Nature",
        description:
          "You can cast Commune with Nature as a Ritual using Wisdom as your spellcasting ability.",
      },
    ],
    description: "Commune with the flora and fauna of the wilderness.",
    source: "Player's Handbook (2024), Barbarian: Path of the Wild Heart",
  },

  powerOfTheWilds: {
    id: "embers:barbarian:wild-heart:power-of-the-wilds",
    name: "Power of the Wilds",
    kind: "class_feature",
    status: "verified",
    classes: ["barbarian"],
    subclass: "pathOfTheWildHeart",
    activationType: "special",
    flyoutType: "options_grid",
    operations: [
      {
        type: "apply_effect",
        name: "Apex Primal Power",
        description:
          "Whenever you activate Rage, choose Falcon (Fly speed equal to Speed if unarmored), Lion (Enemies within 5 ft have Disadvantage on attacks against others), or Ram (Melee hit knocks Large or smaller creature Prone).",
      },
    ],
    options: [
      {
        id: "falcon",
        name: "Falcon",
        cost: 0,
        desc: "Fly speed equal to Speed while raging if not wearing armor.",
        actionType: "none",
      },
      {
        id: "lion",
        name: "Lion",
        cost: 0,
        desc: "Enemies within 5 ft have Disadvantage against anyone except you or another Lion Barbarian.",
        actionType: "none",
      },
      {
        id: "ram",
        name: "Ram",
        cost: 0,
        desc: "Cause a Large or smaller creature to fall Prone when you hit it with a melee attack.",
        actionType: "none",
      },
    ],
    description:
      "Channel apex predators for flight, protective disruption, or crushing knockdowns.",
    source: "Player's Handbook (2024), Barbarian: Path of the Wild Heart",
  },
};
