import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const ARCANE_ARCHER_FORMULAS: Record<string, ManualActionFormula> = {
  arcaneArcherLore: {
    id: "embers:fighter:arcane-archer:arcane-archer-lore",
    name: "Arcane Archer Lore",
    kind: "class_feature",
    status: "verified",
    classes: ["fighter"],
    subclass: "arcaneArcher",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Arcane Archer Lore",
        description:
          "You learn magical theory and secrets of nature, granting you the following benefits.\n\nCantrip. You know either the Druidcraft or the Prestidigitation cantrip. Intelligence is your spellcasting ability for it.\n\nSkills. You gain proficiency in the Arcana and Nature skills. If you already have one of these proficiencies, you instead gain proficiency in a different skill of your choice from the skills available to Fighters at level 1 (or in two skills available to Fighters at level 1 if you have ...",
      },
    ],
    description:
      "You learn magical theory and secrets of nature, granting you the following benefits.\n\nCantrip. You know either the Druidcraft or the Prestidigitation cantrip. Intelligence is your spellcasting ability for it.\n\nSkills. You gain proficiency in the A...",
    source: "Arcana Unleashed, Fighter: Arcane Archer",
  },

  arcaneShot: {
    id: "embers:fighter:arcane-archer:arcane-shot",
    name: "Arcane Shot",
    kind: "class_feature",
    status: "verified",
    classes: ["fighter"],
    subclass: "arcaneArcher",
    activationType: "special",
    resource: {
      name: "Arcane Shot",
      resetType: "Short or Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Arcane Shot",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Arcane Shot",
        description:
          "You learn to unleash special magical effects with your shots.\n\nArcane Shot Options. You learn two Arcane Shot options of your choice from the “Arcane Shot Options” section later in this subclass’s description.\n\nYou learn an additional Arcane Shot option of your choice when you reach Fighter levels 7, 10, 15, and 18. Each time you learn a new Arcane Shot option, you can also replace one option you know with a different one.\n\nUsing Arcane Shot. Once per turn when you make a ranged attack using ...",
      },
    ],
    description:
      "You learn to unleash special magical effects with your shots.\n\nArcane Shot Options. You learn two Arcane Shot options of your choice from the “Arcane Shot Options” section later in this subclass’s description.\n\nYou learn an additional Arcane Shot ...",
    source: "Arcana Unleashed, Fighter: Arcane Archer",
  },

  curvingShot: {
    id: "embers:fighter:arcane-archer:curving-shot",
    name: "Curving Shot",
    kind: "class_feature",
    status: "verified",
    classes: ["fighter"],
    subclass: "arcaneArcher",
    activationType: "bonus",
    operations: [
      {
        type: "apply_effect",
        name: "Curving Shot",
        description:
          "You learn how to direct an errant shot toward a new target. If you make a ranged attack roll with a weapon with the Ammunition property and miss, you can cause the shot to ricochet toward a new target as a Bonus Action immediately after the attack misses. The new target must be a creature you can see within the weapon’s range and within 60 feet of the attack’s original target. Make an attack roll against the new target.\n\nWhen Mystra guides your arrows, they seldom miss.",
      },
    ],
    description:
      "You learn how to direct an errant shot toward a new target. If you make a ranged attack roll with a weapon with the Ammunition property and miss, you can cause the shot to ricochet toward a new target as a Bonus Action immediately after the attack...",
    source: "Arcana Unleashed, Fighter: Arcane Archer",
  },

  magicalAmmunition: {
    id: "embers:fighter:arcane-archer:magical-ammunition",
    name: "Magical Ammunition",
    kind: "class_feature",
    status: "verified",
    classes: ["fighter"],
    subclass: "arcaneArcher",
    activationType: "action",
    resource: {
      name: "Magical Ammunition",
      resetType: "Short or Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Magical Ammunition",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Magical Ammunition",
        description:
          "You learn to imbue your ammunition with magical properties. As a Magic action, you can imbue a piece of nonmagical ammunition with one of the following magical properties and fire it at a solid surface you can see within the weapon’s range. When the ammunition hits the surface, the ammunition’s effect activates, and the ammunition attaches to the surface it hit for the duration of the effect; you can remove an attached piece of ammunition as a Magic action, ending the effect early. When the e...",
      },
    ],
    description:
      "You learn to imbue your ammunition with magical properties. As a Magic action, you can imbue a piece of nonmagical ammunition with one of the following magical properties and fire it at a solid surface you can see within the weapon’s range. When t...",
    source: "Arcana Unleashed, Fighter: Arcane Archer",
  },

  everReadyShot: {
    id: "embers:fighter:arcane-archer:ever-ready-shot",
    name: "Ever-Ready Shot",
    kind: "class_feature",
    status: "verified",
    classes: ["fighter"],
    subclass: "arcaneArcher",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Ever-Ready Shot",
        description:
          "When you roll Initiative, you can regain one expended use of Arcane Shot.",
      },
    ],
    description:
      "When you roll Initiative, you can regain one expended use of Arcane Shot.",
    source: "Arcana Unleashed, Fighter: Arcane Archer",
  },

  indomitableTeleport: {
    id: "embers:fighter:arcane-archer:indomitable-teleport",
    name: "Indomitable Teleport",
    kind: "class_feature",
    status: "verified",
    classes: ["fighter"],
    subclass: "arcaneArcher",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Indomitable Teleport",
        description:
          "Your magical mastery lets you escape dire situations. When you use your Indomitable feature and succeed on the saving throw, you can teleport up to 60 feet to an unoccupied space you can see.",
      },
    ],
    description:
      "Your magical mastery lets you escape dire situations. When you use your Indomitable feature and succeed on the saving throw, you can teleport up to 60 feet to an unoccupied space you can see.",
    source: "Arcana Unleashed, Fighter: Arcane Archer",
  },

  masterfulShots: {
    id: "embers:fighter:arcane-archer:masterful-shots",
    name: "Masterful Shots",
    kind: "class_feature",
    status: "verified",
    classes: ["fighter"],
    subclass: "arcaneArcher",
    activationType: "reaction",
    operations: [
      {
        type: "apply_effect",
        name: "Masterful Shots",
        description:
          "You employ agility in your sharpshooting. When a creature you can see misses you with an attack roll, you can take a Reaction to move up to half your Speed away from the attacker without provoking Opportunity Attacks. You can then make a ranged attack roll against the attacker as part of this Reaction if the attacker is within the weapon’s range.",
      },
    ],
    description:
      "You employ agility in your sharpshooting. When a creature you can see misses you with an attack roll, you can take a Reaction to move up to half your Speed away from the attacker without provoking Opportunity Attacks. You can then make a ranged at...",
    source: "Arcana Unleashed, Fighter: Arcane Archer",
  },

  arcaneShotOptions: {
    id: "embers:fighter:arcane-archer:arcane-shot-options",
    name: "Arcane Shot Options",
    kind: "class_feature",
    status: "verified",
    classes: ["fighter"],
    subclass: "arcaneArcher",
    activationType: "special",
    resource: {
      name: "Arcane Shot Options",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Arcane Shot Options",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Arcane Shot Options",
        description:
          "The Arcane Shot options are presented here in alphabetical order.\n\nBanishing Shot. Your ammunition temporarily sequesters your target in a harmless demiplane. The creature you hit takes extra Psychic damage equal to one roll of your Arcane Shot Die and must succeed on a Charisma saving throw or be banished. While banished, the creature has the Incapacitated condition and a Speed of 0. At the end of its next turn, the target reappears in the space it left or, if that space is occupied, in the ...",
      },
    ],
    description:
      "The Arcane Shot options are presented here in alphabetical order.\n\nBanishing Shot. Your ammunition temporarily sequesters your target in a harmless demiplane. The creature you hit takes extra Psychic damage equal to one roll of your Arcane Shot Di...",
    source: "Arcana Unleashed, Fighter: Arcane Archer",
  },
};
