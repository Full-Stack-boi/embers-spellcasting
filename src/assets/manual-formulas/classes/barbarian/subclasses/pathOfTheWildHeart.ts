import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const PATH_OF_THE_WILD_HEART_FORMULAS: Record<
  string,
  ManualActionFormula
> = {
  rageOfTheWilds: {
    id: "embers:barbarian:wild-heart:rage-of-the-wilds",
    name: "Rage of the Wilds",
    kind: "class_feature",
    status: "verified",
    classes: ["barbarian"],
    subclass: "pathOfTheWildHeart",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Animal Aspect",
        description:
          "When entering Rage, choose Bear (Resistance to all damage except Force and Psychic), Eagle (Dash and Disengage as Bonus Action), or Wolf (Allies have Advantage on melee attacks against enemies within 5 ft).",
      },
    ],
    description:
      "Channel the primal spirit of the Bear, Eagle, or Wolf while raging.",
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
    operations: [
      {
        type: "apply_effect",
        name: "Wild Aspect Boon",
        description:
          "Gain mystical animal blessings: Elephant (Strength advantage), Owl (Keen darkvision and perception), or Spider (Climb speed equal to speed).",
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
        name: "Commune With Beasts",
        description:
          "You can cast Beast Sense and Commune with Nature as Rituals using Wisdom as your spellcasting ability.",
      },
    ],
    description: "Commune with the flora and fauna of the wilderness.",
    source: "Player's Handbook (2024), Barbarian: Path of the Wild Heart",
  },
};
