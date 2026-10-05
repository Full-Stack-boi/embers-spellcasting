import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const HUNTER_FORMULAS: Record<string, ManualActionFormula> = {
  huntersPrey: {
    id: "embers:ranger:hunter:hunters-prey",
    name: "Hunter's Prey",
    kind: "class_feature",
    status: "verified",
    classes: ["ranger"],
    subclass: "hunter",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Colossus Slayer or Horde Breaker",
        description:
          "Choose Colossus Slayer (deal extra 1d8 damage to target below maximum HP once per turn) or Horde Breaker (make an additional weapon attack against adjacent creature once per turn).",
      },
    ],
    description:
      "Specialize your martial strikes to fell giants or cut down enemy swarms.",
    source: "Player's Handbook (2024), Ranger: Hunter",
  },

  defensiveTactics: {
    id: "embers:ranger:hunter:defensive-tactics",
    name: "Defensive Tactics",
    kind: "class_feature",
    status: "verified",
    classes: ["ranger"],
    subclass: "hunter",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Hunter Defense",
        description:
          "Choose Escape the Horde (Disadvantage on enemy Opportunity Attacks against you) or Multiattack Defense (+4 to AC against subsequent attacks from the same creature).",
      },
    ],
    description:
      "Master defensive footwork designed to foil multiattack combos.",
    source: "Player's Handbook (2024), Ranger: Hunter",
  },

  superiorHuntersDefense: {
    id: "embers:ranger:hunter:superior-hunters-defense",
    name: "Superior Hunter's Defense",
    kind: "class_feature",
    status: "verified",
    classes: ["ranger"],
    subclass: "hunter",
    activationType: "reaction",
    operations: [
      {
        type: "apply_effect",
        name: "Evasive Resilience",
        description:
          "When you take damage from an attack, use Reaction to take only half damage (Uncanny Dodge), or gain Evasion against Dexterity saves.",
      },
    ],
    description:
      "Dodge lethal dragon breath and reduce incoming attack damage by half.",
    source: "Player's Handbook (2024), Ranger: Hunter",
  },
};
