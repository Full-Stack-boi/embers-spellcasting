import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const ARCANE_TRICKSTER_FORMULAS: Record<string, ManualActionFormula> = {
  mageHandLegerdemain: {
    id: "embers:rogue:arcane-trickster:mage-hand-legerdemain",
    name: "Mage Hand Legerdemain",
    kind: "class_feature",
    status: "verified",
    classes: ["rogue"],
    subclass: "arcaneTrickster",
    activationType: "bonus",
    operations: [
      {
        type: "apply_effect",
        name: "Invisible Arcane Hand",
        description:
          "Your Mage Hand is invisible; control it as a Bonus Action to stow/retrieve objects from containers, pick locks, or disarm traps at 30 ft range.",
      },
    ],
    description:
      "Perform delicate larceny and lockpicking from safety using an invisible hand.",
    source: "Player's Handbook (2024), Rogue: Arcane Trickster",
  },

  magicalAmbush: {
    id: "embers:rogue:arcane-trickster:magical-ambush",
    name: "Magical Ambush",
    kind: "class_feature",
    status: "verified",
    classes: ["rogue"],
    subclass: "arcaneTrickster",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Hidden Spellcasting",
        description:
          "If you are hidden from a creature when you cast a spell on it, the creature has Disadvantage on any saving throw it makes against the spell this turn.",
      },
    ],
    description:
      "Catch targets off guard so they cannot brace against your spells.",
    source: "Player's Handbook (2024), Rogue: Arcane Trickster",
  },

  versatileTrickster: {
    id: "embers:rogue:arcane-trickster:versatile-trickster",
    name: "Versatile Trickster",
    kind: "class_feature",
    status: "verified",
    classes: ["rogue"],
    subclass: "arcaneTrickster",
    activationType: "bonus",
    operations: [
      {
        type: "apply_effect",
        name: "Mage Hand Feint",
        description:
          "Bonus Action distract a creature within 5 ft of your Mage Hand: you have Advantage on attack rolls against it until end of turn.",
      },
    ],
    description:
      "Distract enemies with your spectral hand to trigger Sneak Attack.",
    source: "Player's Handbook (2024), Rogue: Arcane Trickster",
  },
};
