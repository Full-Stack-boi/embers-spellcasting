import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const MISFORTUNE_BRINGER_FORMULAS: Record<string, ManualActionFormula> =
  {
    evilEye: {
      id: "embers:rogue:misfortune-bringer:evil-eye",
      name: "Evil Eye",
      kind: "class_feature",
      status: "verified",
      classes: ["rogue"],
      subclass: "misfortuneBringer",
      activationType: "bonus",
      operations: [
        {
          type: "apply_effect",
          name: "Evil Eye",
          description:
            "You can place a minor curse with a glance. As a Bonus Action, choose a creature you can see within 60 feet of yourself to be cursed by your Evil Eye. While a creature is cursed by your Evil Eye, you can deal Sneak Attack damage to the creature if you don’t have Disadvantage on the attack roll.\n\nThe creature remains cursed by your Evil Eye for 1 minute or until you curse a different creature with your Evil Eye, whichever comes first.",
        },
      ],
      description:
        "You can place a minor curse with a glance. As a Bonus Action, choose a creature you can see within 60 feet of yourself to be cursed by your Evil Eye. While a creature is cursed by your Evil Eye, you can deal Sneak Attack damage to the creature if ...",
      source: "Grim Hollow: Player’s Guide, Rogue: Misfortune Bringer",
    },

    misfortunist: {
      id: "embers:rogue:misfortune-bringer:misfortunist",
      name: "Misfortunist",
      kind: "class_feature",
      status: "verified",
      classes: ["rogue"],
      subclass: "misfortuneBringer",
      activationType: "special",
      resource: {
        name: "Misfortunist",
        resetType: "Short or Long Rest",
      },
      operations: [
        {
          type: "resource_cost",
          resource: "Misfortunist",
          amount: 1,
        },
        {
          type: "apply_effect",
          name: "Misfortunist",
          description:
            "You learn Misfortunes that you can inflict on those cursed by your Evil Eye.\n\nMisfortunes. You learn two Misfortunes of your choice, which are detailed under “Misfortunes” below.\n\nYou learn an additional Misfortune of your choice when you reach Rogue levels 9, 13, and 17. When you finish a Long Rest, you can replace one Misfortune you know with a different one.\n\nJinx Points. You have 4 Jinx Points. You gain 2 additional Jinx Points at Rogue level 13. To use a Misfortune option, you must spend...",
        },
      ],
      description:
        "You learn Misfortunes that you can inflict on those cursed by your Evil Eye.\n\nMisfortunes. You learn two Misfortunes of your choice, which are detailed under “Misfortunes” below.\n\nYou learn an additional Misfortune of your choice when you reach Ro...",
      source: "Grim Hollow: Player’s Guide, Rogue: Misfortune Bringer",
    },

    stealLuck: {
      id: "embers:rogue:misfortune-bringer:steal-luck",
      name: "Steal Luck",
      kind: "class_feature",
      status: "verified",
      classes: ["rogue"],
      subclass: "misfortuneBringer",
      activationType: "reaction",
      resource: {
        name: "Steal Luck",
        resetType: "Short or Long Rest",
      },
      operations: [
        {
          type: "resource_cost",
          resource: "Steal Luck",
          amount: 1,
        },
        {
          type: "apply_effect",
          name: "Steal Luck",
          description:
            "When a creature you can see within 30 feet of yourself is about to make a D20 Test with Advantage, you can take a Reaction to prevent the roll from being affected by Advantage. When you do so, you regain 1 expended Jinx Point.\n\nOnce you use this feature, you can’t do so again until you finish a Short or Long Rest.",
        },
      ],
      description:
        "When a creature you can see within 30 feet of yourself is about to make a D20 Test with Advantage, you can take a Reaction to prevent the roll from being affected by Advantage. When you do so, you regain 1 expended Jinx Point.\n\nOnce you use this f...",
      source: "Grim Hollow: Player’s Guide, Rogue: Misfortune Bringer",
    },

    curseCaster: {
      id: "embers:rogue:misfortune-bringer:curse-caster",
      name: "Curse Caster",
      kind: "class_feature",
      status: "verified",
      classes: ["rogue"],
      subclass: "misfortuneBringer",
      activationType: "action",
      operations: [
        {
          type: "apply_effect",
          name: "Curse Caster",
          description:
            "You can take a Magic action and spend 3 Jinx Points to cast Bestow Curse.",
        },
      ],
      description:
        "You can take a Magic action and spend 3 Jinx Points to cast Bestow Curse.",
      source: "Grim Hollow: Player’s Guide, Rogue: Misfortune Bringer",
    },

    improvedStealLuck: {
      id: "embers:rogue:misfortune-bringer:improved-steal-luck",
      name: "Improved Steal Luck",
      kind: "class_feature",
      status: "verified",
      classes: ["rogue"],
      subclass: "misfortuneBringer",
      activationType: "special",
      resource: {
        name: "Improved Steal Luck",
        resetType: "Long Rest",
      },
      operations: [
        {
          type: "resource_cost",
          resource: "Improved Steal Luck",
          amount: 1,
        },
        {
          type: "apply_effect",
          name: "Improved Steal Luck",
          description:
            "You can use your Steal Luck feature three times, and you regain all expended uses when you finish a Long Rest.",
        },
      ],
      description:
        "You can use your Steal Luck feature three times, and you regain all expended uses when you finish a Long Rest.",
      source: "Grim Hollow: Player’s Guide, Rogue: Misfortune Bringer",
    },

    misfortunes: {
      id: "embers:rogue:misfortune-bringer:misfortunes",
      name: "Misfortunes",
      kind: "class_feature",
      status: "verified",
      classes: ["rogue"],
      subclass: "misfortuneBringer",
      activationType: "bonus",
      operations: [
        {
          type: "apply_effect",
          name: "Misfortunes",
          description:
            "The following options are available to your Misfortunist feature. The options are presented in alphabetical order.\n\nCurse of the Befuddled\n\nCost: 2 Jinx Points\n\nAs a Magic action, choose a creature that you can see within 60 feet of yourself that is cursed by your Evil Eye and spend 2 Jinx Points. The target must make a Wisdom saving throw.\n\nOn a failed save, the creature has the Charmed condition for 10 minutes or until you or your allies damage it. When the effect ends, the target knows it ...",
        },
      ],
      description:
        "The following options are available to your Misfortunist feature. The options are presented in alphabetical order.\n\nCurse of the Befuddled\n\nCost: 2 Jinx Points\n\nAs a Magic action, choose a creature that you can see within 60 feet of yourself that ...",
      source: "Grim Hollow: Player’s Guide, Rogue: Misfortune Bringer",
    },
  };
