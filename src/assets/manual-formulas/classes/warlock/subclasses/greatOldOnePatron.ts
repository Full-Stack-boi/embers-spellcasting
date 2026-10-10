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
          "Bonus Action establish telepathic communication with a creature within 30 ft x Warlock level for miles equal to Charisma modifier.",
      },
    ],
    description:
      "Project your consciousness directly into the minds of other creatures.",
    source: "Player's Handbook (2024), Warlock: Great Old One Patron",
  },

  psychicSpells: {
    id: "embers:warlock:great-old-one:psychic-spells",
    name: "Psychic Spells",
    kind: "class_feature",
    status: "verified",
    classes: ["warlock"],
    subclass: "greatOldOnePatron",
    activationType: "special",
    description: "Whenever you cast a Warlock spell that deals damage, you can change the damage type to Psychic. You can also cast Enchantment and Illusion spells without Verbal components.",
    source: "Player's Handbook (2024), Warlock: Great Old One Patron",
    operations: [
      {
        type: "apply_effect",
        name: "Psychic Spell Infusion",
        description: "Change spell damage to Psychic damage; omit Verbal components for Enchantment and Illusion spells.",
      },
    ],
  },

  clairvoyantCombatant: {
    id: "embers:warlock:great-old-one:clairvoyant-combatant",
    name: "Clairvoyant Combatant",
    kind: "class_feature",
    status: "verified",
    classes: ["warlock"],
    subclass: "greatOldOnePatron",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Psionic Sensor & Hex Disadvantage",
        description: "Target linked by Awakened Mind has Disadvantage on attack rolls against you, and you have Advantage on attack rolls against it.",
      },
    ],
    description: "Predict the movements of your telepathically linked target.",
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
        name: "Psychic Mirror & Resistance",
        description:
          "Your thoughts cannot be read by telepathy; you have Resistance to Psychic damage; when a creature deals Psychic damage to you, it takes the same amount of damage.",
      },
    ],
    description: "Turn your mind into an impenetrable, razor-sharp labyrinth.",
    source: "Player's Handbook (2024), Warlock: Great Old One Patron",
  },

  createThrall: {
    id: "embers:warlock:great-old-one:create-thrall",
    name: "Create Thrall",
    kind: "class_feature",
    status: "verified",
    classes: ["warlock"],
    subclass: "greatOldOnePatron",
    activationType: "action",
    resource: {
      name: "Create Thrall",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "apply_effect",
        name: "Summon Aberrant Thrall",
        description: "Cast Summon Aberration without material components (1/Long Rest, or expend a level 5 spell slot). The aberration gains bonus psychic damage equal to your Charisma modifier.",
      },
    ],
    description: "Summon an aberrant spirit bound to your alien patron's will.",
    source: "Player's Handbook (2024), Warlock: Great Old One Patron",
  },
};
