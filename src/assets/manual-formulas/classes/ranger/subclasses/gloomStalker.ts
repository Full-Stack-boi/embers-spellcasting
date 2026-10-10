import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const GLOOM_STALKER_FORMULAS: Record<string, ManualActionFormula> = {
  dreadAmbusher: {
    id: "embers:ranger:gloom-stalker:dread-ambusher",
    name: "Dread Ambusher",
    kind: "class_feature",
    status: "verified",
    classes: ["ranger"],
    subclass: "gloomStalker",
    activationType: "special",
    resource: {
      name: "Dread Ambusher",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "apply_effect",
        name: "Ambush Shock",
        description:
          "Add Wisdom modifier to Initiative. On hit with an attack roll, deal an extra 2d6 Psychic damage and force target to make a Wisdom save or have the Frightened condition until start of its next turn (Proficiency Bonus uses per Long Rest).",
      },
    ],
    description:
      "Strike from darkness with terrifying ambush speed and psychic shock.",
    source: "Player's Handbook (2024), Ranger: Gloom Stalker",
  },

  umbralSight: {
    id: "embers:ranger:gloom-stalker:umbral-sight",
    name: "Umbral Sight",
    kind: "class_feature",
    status: "verified",
    classes: ["ranger"],
    subclass: "gloomStalker",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Invisibility in Darkness",
        description:
          "You gain Darkvision out to 60 feet. While in darkness, you are Invisible to any creature that relies on darkvision to see you.",
      },
    ],
    description:
      "Become entirely invisible to creatures scanning the dark with darkvision.",
    source: "Player's Handbook (2024), Ranger: Gloom Stalker",
  },

  ironMind: {
    id: "embers:ranger:gloom-stalker:iron-mind",
    name: "Iron Mind",
    kind: "class_feature",
    status: "verified",
    classes: ["ranger"],
    subclass: "gloomStalker",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Mental Discipline",
        description:
          "You gain proficiency in Wisdom saving throws (or Intelligence/Charisma if you already have Wisdom proficiency).",
      },
    ],
    description:
      "Hone mental iron discipline to resist supernatural enchantments and fear.",
    source: "Player's Handbook (2024), Ranger: Gloom Stalker",
  },

  stalkersFlurry: {
    id: "embers:ranger:gloom-stalker:stalkers-flurry",
    name: "Stalker's Flurry",
    kind: "class_feature",
    status: "verified",
    classes: ["ranger"],
    subclass: "gloomStalker",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Chained Ambush Shock",
        description:
          "The extra damage of your Dread Ambusher increases from 2d6 to 2d8. In addition, you can cause a second creature within 5 feet of the target to also take the extra damage and be subject to the Frightened effect.",
      },
    ],
    description:
      "Amplify your dread ambusher strikes into a cascading flurry that shocks multiple enemies.",
    source: "Player's Handbook (2024), Ranger: Gloom Stalker",
  },

  shadowyDodge: {
    id: "embers:ranger:gloom-stalker:shadowy-dodge",
    name: "Shadowy Dodge",
    kind: "class_feature",
    status: "verified",
    classes: ["ranger"],
    subclass: "gloomStalker",
    activationType: "reaction",
    operations: [
      {
        type: "apply_effect",
        name: "Gloom Evasion and Jaunt",
        description:
          "Reaction when a creature attacks you without Advantage: impose Disadvantage on the attack roll, and teleport up to 30 feet to an unoccupied space you can see.",
      },
    ],
    description: "Disrupt an enemy's aim by fading into gloom and teleporting up to 30 feet.",
    source: "Player's Handbook (2024), Ranger: Gloom Stalker",
  },
};
