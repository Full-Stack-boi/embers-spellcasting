import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const PATH_OF_THE_BERSERKER_FORMULAS: Record<
  string,
  ManualActionFormula
> = {
  frenzy: {
    id: "embers:barbarian:berserker:frenzy",
    name: "Frenzy",
    kind: "class_feature",
    status: "verified",
    classes: ["barbarian"],
    subclass: "pathOfTheBerserker",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Frenzy Damage",
        description:
          "While raging, your first hit with a Strength-based weapon on your turn deals extra damage equal to 2d6 (increases to 3d6 at level 10 and 4d6 at level 14).",
      },
    ],
    weaponRider: {
      type: "weapon_damage_rider",
      id: "frenzy",
      name: "Frenzy",
      classId: "barbarian",
      subclassId: "pathOfTheBerserker",
      requiresBuff: "rage",
      diceByClassLevel: [
        { minLevel: 3, dice: "2d6" },
        { minLevel: 9, dice: "3d6" },
        { minLevel: 16, dice: "4d6" },
      ],
      frequency: "first_hit_per_turn",
    },
    description:
      "While raging, your first hit with a Strength weapon on each of your turns deals extra Frenzy damage.",
    source: "Player's Handbook (2024), Barbarian: Path of the Berserker",
  },

  mindlessRage: {
    id: "embers:barbarian:berserker:mindless-rage",
    name: "Mindless Rage",
    kind: "class_feature",
    status: "verified",
    classes: ["barbarian"],
    subclass: "pathOfTheBerserker",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Mindless Rage",
        description:
          "You are immune to the Charmed and Frightened conditions while raging. If charmed or frightened when entering rage, the condition is suspended for the duration.",
      },
    ],
    description: "Your battle rage shields your mind against mental intrusion.",
    source: "Player's Handbook (2024), Barbarian: Path of the Berserker",
  },

  retaliation: {
    id: "embers:barbarian:berserker:retaliation",
    name: "Retaliation",
    kind: "class_feature",
    status: "verified",
    classes: ["barbarian"],
    subclass: "pathOfTheBerserker",
    activationType: "reaction",
    operations: [
      {
        type: "apply_effect",
        name: "Retaliation Strike",
        description:
          "When you take damage from a creature within 5 feet of you, you can take a Reaction to make a melee weapon attack against that creature.",
      },
    ],
    description:
      "Strike back against any attacker who dares injure you in melee range.",
    source: "Player's Handbook (2024), Barbarian: Path of the Berserker",
  },

  intimidatingPresence: {
    id: "embers:barbarian:berserker:intimidating-presence",
    name: "Intimidating Presence",
    kind: "class_feature",
    status: "verified",
    classes: ["barbarian"],
    subclass: "pathOfTheBerserker",
    activationType: "bonus",
    resource: {
      name: "Intimidating Presence",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "apply_effect",
        name: "Terrifying Glare",
        description:
          "As a Bonus Action, project a terrifying aura in a 30-foot emanation. Each creature of your choice must succeed on a Wisdom saving throw or have the Frightened condition for 1 minute.",
      },
    ],
    description:
      "Exude an overwhelming aura of menace that terrorizes nearby enemies.",
    source: "Player's Handbook (2024), Barbarian: Path of the Berserker",
  },
};
