import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const GREAT_OLD_ONE_PATRON_FORMULAS: Record<
  string,
  ManualActionFormula
> = {
  awakenedMind: {
    id: "embers:warlock:great-old-one:awakened-mind",
    name: "Awakened Mind",
    kind: "class_feature",
    status: "verified",
    classes: ["warlock"],
    subclass: "greatOldOnePatron",
    activationType: "bonus",
    operations: [
      {
        type: "apply_effect",
        name: "Alien Telepathy",
        description:
          "Bonus Action establish telepathic communication with a creature within 30 ft; psychic damage dealt to the target by you is augmented.",
      },
    ],
    description:
      "Project your consciousness directly into the minds of other creatures.",
    source: "Player's Handbook (2024), Warlock: Great Old One Patron",
  },

  entropicWard: {
    id: "embers:warlock:great-old-one:entropic-ward",
    name: "Entropic Ward",
    kind: "class_feature",
    status: "verified",
    classes: ["warlock"],
    subclass: "greatOldOnePatron",
    activationType: "reaction",
    resource: {
      name: "Entropic Ward",
      resetType: "Short or Long Rest",
    },
    operations: [
      {
        type: "apply_effect",
        name: "Chaos Deflection",
        description:
          "Reaction when a creature attacks you: impose Disadvantage on the attack roll; if it misses, your next attack against it has Advantage.",
      },
    ],
    description:
      "Bend entropic reality to make enemy strikes miss and leave them vulnerable.",
    source: "Player's Handbook (2024), Warlock: Great Old One Patron",
  },

  thoughtShield: {
    id: "embers:warlock:great-old-one:thought-shield",
    name: "Thought Shield",
    kind: "class_feature",
    status: "verified",
    classes: ["warlock"],
    subclass: "greatOldOnePatron",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Psychic Mirror",
        description:
          "Your thoughts cannot be read by telepathy; when a creature deals Psychic damage to you, it takes the same amount of damage.",
      },
    ],
    description: "Turn your mind into an impenetrable, razor-sharp labyrinth.",
    source: "Player's Handbook (2024), Warlock: Great Old One Patron",
  },
};
