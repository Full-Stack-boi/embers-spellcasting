import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const PATH_OF_THE_WORLD_TREE_FORMULAS: Record<
  string,
  ManualActionFormula
> = {
  vitalityOfTheTree: {
    id: "embers:barbarian:world-tree:vitality-of-the-tree",
    name: "Vitality of the Tree",
    kind: "class_feature",
    status: "verified",
    classes: ["barbarian"],
    subclass: "pathOfTheWorldTree",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "World Tree Vitality",
        description:
          "When you activate your Rage, gain Temporary Hit Points equal to your Barbarian level. At the start of each of your turns while raging, grant Temporary HP equal to your Rage Damage bonus in d6s (2d6 to 4d6) to an ally within 10 ft.",
      },
    ],
    description:
      "Draw life force from the cosmic ash tree to protect yourself and your companions.",
    source: "Player's Handbook (2024), Barbarian: Path of the World Tree",
  },

  branchesOfTheTree: {
    id: "embers:barbarian:world-tree:branches-of-the-tree",
    name: "Branches of the Tree",
    kind: "class_feature",
    status: "verified",
    classes: ["barbarian"],
    subclass: "pathOfTheWorldTree",
    activationType: "reaction",
    operations: [
      {
        type: "apply_effect",
        name: "Spectral Root Tether",
        description:
          "Reaction when a creature you can see starts its turn within 30 feet of you while raging: force it to make a Strength save (DC 8 + STR mod + PB) or be teleported to an unoccupied space within 5 feet of you, reducing its speed to 0 until end of turn.",
      },
    ],
    description:
      "Spectral roots pull moving foes directly into your martial reach.",
    source: "Player's Handbook (2024), Barbarian: Path of the World Tree",
  },

  batteringRoots: {
    id: "embers:barbarian:world-tree:battering-roots",
    name: "Battering Roots",
    kind: "class_feature",
    status: "verified",
    classes: ["barbarian"],
    subclass: "pathOfTheWorldTree",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Elongated Strikes",
        description:
          "During your turn, your reach is 10 feet greater with any Melee weapon with the Heavy or Versatile property. When you hit with such a weapon, you can activate the Push or Topple mastery property in addition to another mastery property.",
      },
    ],
    description:
      "Tendrils of Yggdrasil extend your weapons and bash enemies across the battlefield.",
    source: "Player's Handbook (2024), Barbarian: Path of the World Tree",
  },

  travelAlongTheTree: {
    id: "embers:barbarian:world-tree:travel-along-the-tree",
    name: "Travel Along the Tree",
    kind: "class_feature",
    status: "verified",
    classes: ["barbarian"],
    subclass: "pathOfTheWorldTree",
    activationType: "bonus",
    operations: [
      {
        type: "apply_effect",
        name: "Cosmic Ash Jaunt",
        description:
          "When entering Rage or as a Bonus Action in Rage, teleport up to 60 feet. Once per Rage, you can increase range to 150 feet and bring up to 6 willing allies within 10 feet.",
      },
    ],
    description:
      "Phase through space along the cosmic roots of the multiverse.",
    source: "Player's Handbook (2024), Barbarian: Path of the World Tree",
  },
};
