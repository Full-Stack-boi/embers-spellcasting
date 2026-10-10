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
    weaponRider: {
      type: "weapon_damage_rider",
      id: "colossus-slayer",
      name: "Colossus Slayer",
      classId: "ranger",
      subclassId: "hunter",
      dice: "1d8",
      damageType: "weapon",
      frequency: "first_hit_per_turn",
    },
    description:
      "Specialize your martial strikes to fell giants or cut down enemy swarms.",
    source: "Player's Handbook (2024), Ranger: Hunter",
  },

  huntersLore: {
    id: "embers:ranger:hunter:hunters-lore",
    name: "Hunter's Lore",
    kind: "class_feature",
    status: "verified",
    classes: ["ranger"],
    subclass: "hunter",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Analyze Vulnerabilities",
        description:
          "You instinctively know whether a creature marked by your Hunter's Mark has any damage immunities, resistances, or vulnerabilities, and what they are.",
      },
    ],
    description:
      "Instantly discover the damage immunities, resistances, and vulnerabilities of your marked quarry.",
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

  superiorHuntersPrey: {
    id: "embers:ranger:hunter:superior-hunters-prey",
    name: "Superior Hunter's Prey",
    kind: "class_feature",
    status: "verified",
    classes: ["ranger"],
    subclass: "hunter",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Volley Whirlwind",
        description:
          "When you take the Attack action and hit a creature marked by your Hunter's Mark, you can make an additional attack against each other creature within 5 feet of the quarry.",
      },
    ],
    description:
      "Chain explosive secondary strikes against all foes crowded around your quarry.",
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
