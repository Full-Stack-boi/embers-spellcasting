import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const PATH_OF_THE_WRATHFUL_DEAD_FORMULAS: Record<
  string,
  ManualActionFormula
> = {
  rageOfTheDead: {
    id: "embers:barbarian:path-of-the-wrathful-dead:rage-of-the-dead",
    name: "Rage of the Dead",
    kind: "class_feature",
    status: "verified",
    classes: ["barbarian"],
    subclass: "pathOfTheWrathfulDead",
    activationType: "special",
    resource: {
      name: "Rage of the Dead",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Rage of the Dead",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Rage of the Dead",
        description:
          "Your Rage taps into the endless fury of the unquiet dead. While your Rage is active, you take on aspects of restless spirits and you gain the following benefits.\n\nShadow Form. You ignore Difficult Terrain. In addition, you can move through the space of any creature, but you can’t end your move in an occupied space.\n\nShadowy Sidestep. Your Speed increases by 10 feet, and Opportunity Attack action have Disadvantage against you.\n\nSpectral Sight. You see creatures and objects within 120 feet that...",
      },
    ],
    description:
      "Your Rage taps into the endless fury of the unquiet dead. While your Rage is active, you take on aspects of restless spirits and you gain the following benefits.\n\nShadow Form. You ignore Difficult Terrain. In addition, you can move through the spa...",
    source: "Grim Hollow: Player’s Guide, Barbarian: Path of the Wrathful Dead",
  },

  finalNightCatharsis: {
    id: "embers:barbarian:path-of-the-wrathful-dead:final-night-catharsis",
    name: "Final Night Catharsis",
    kind: "class_feature",
    status: "verified",
    classes: ["barbarian"],
    subclass: "pathOfTheWrathfulDead",
    activationType: "bonus",
    resource: {
      name: "Final Night Catharsis",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Final Night Catharsis",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Final Night Catharsis",
        description:
          "You are overcome by an emotion a nearby spirit experienced at its death. You gain one of the following options of your choice. Whenever you finish a Long Rest, you can change your choice.\n\nHate. When you miss with an attack roll against a creature, you have Advantage on the next attack roll you make against it before the end of your next turn.\n\nJealousy. When a creature you have Grappled is about to make an ability check to end the Grappled condition on itself, you can take a Reaction to impo...",
      },
    ],
    description:
      "You are overcome by an emotion a nearby spirit experienced at its death. You gain one of the following options of your choice. Whenever you finish a Long Rest, you can change your choice.\n\nHate. When you miss with an attack roll against a creature...",
    source: "Grim Hollow: Player’s Guide, Barbarian: Path of the Wrathful Dead",
  },

  darkDoomRevisited: {
    id: "embers:barbarian:path-of-the-wrathful-dead:dark-doom-revisited",
    name: "Dark Doom Revisited",
    kind: "class_feature",
    status: "verified",
    classes: ["barbarian"],
    subclass: "pathOfTheWrathfulDead",
    activationType: "action",
    resource: {
      name: "Dark Doom Revisited",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Dark Doom Revisited",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Dark Doom Revisited",
        description:
          "Once per active Rage, you can take a Magic action to channel a traumatic death. When you do, choose one of the following options.\n\nContamination. At the start of their turn, each creature of your choice in a 10-foot Emanation originating from you must make a Constitution saving throw (DC 8 plus your Constitution modifier and Proficiency Bonus) or take Poison damage and gain the Poisoned condition for 1 minute.\n\nTo determine the Poison damage, roll a number of d6s equal to your Rage Damage bon...",
      },
    ],
    description:
      "Once per active Rage, you can take a Magic action to channel a traumatic death. When you do, choose one of the following options.\n\nContamination. At the start of their turn, each creature of your choice in a 10-foot Emanation originating from you ...",
    source: "Grim Hollow: Player’s Guide, Barbarian: Path of the Wrathful Dead",
  },

  deathIsButADoor: {
    id: "embers:barbarian:path-of-the-wrathful-dead:death-is-but-a-door",
    name: "Death Is but a Door",
    kind: "class_feature",
    status: "verified",
    classes: ["barbarian"],
    subclass: "pathOfTheWrathfulDead",
    activationType: "special",
    resource: {
      name: "Death Is but a Door",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Death Is but a Door",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Death Is but a Door",
        description:
          "Your familiarity with death has left you resistant to its call. You gain the following benefits.\n\nHard to Kill. You have Advantage on Death Saving Throws. In addition, you must fail four Death Saving Throws to die instead of three as normal.\n\nReturn the Spirit. You can call the spirits of the deceased to restore life essence to a nearby creature. You can cast the Cure Wounds, Raise Dead, or Revivify spell without providing Material components. When you do, you gain 1 Exhaustion level for Cure...",
      },
    ],
    description:
      "Your familiarity with death has left you resistant to its call. You gain the following benefits.\n\nHard to Kill. You have Advantage on Death Saving Throws. In addition, you must fail four Death Saving Throws to die instead of three as normal.\n\nRetu...",
    source: "Grim Hollow: Player’s Guide, Barbarian: Path of the Wrathful Dead",
  },

  poweredByPathos: {
    id: "embers:barbarian:path-of-the-wrathful-dead:powered-by-pathos",
    name: "Powered by Pathos",
    kind: "class_feature",
    status: "verified",
    classes: ["barbarian"],
    subclass: "pathOfTheWrathfulDead",
    activationType: "reaction",
    resource: {
      name: "Powered by Pathos",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Powered by Pathos",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Powered by Pathos",
        description:
          "Your Rage is empowered by the overwhelming emotions of the unquiet dead. Your Final Night Catharsis feature grants an additional effect based on the chosen emotion.\n\nHate. While your Rage is active, your attacks with weapons and Unarmed Strikes score a Critical Hit on a roll of 19 or 20 on the d20.\n\nJealousy. Whenever a creature you can see starts its turn within 30 feet of you while your Rage is active, you can take a Reaction to summon spectral assailants to Grapple the creature. The creatu...",
      },
    ],
    description:
      "Your Rage is empowered by the overwhelming emotions of the unquiet dead. Your Final Night Catharsis feature grants an additional effect based on the chosen emotion.\n\nHate. While your Rage is active, your attacks with weapons and Unarmed Strikes sc...",
    source: "Grim Hollow: Player’s Guide, Barbarian: Path of the Wrathful Dead",
  },
};
