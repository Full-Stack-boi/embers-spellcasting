import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const NIGHTWATCHER_FORMULAS: Record<string, ManualActionFormula> = {
  skilledGuardian: {
    id: "embers:fighter:nightwatcher:skilled-guardian",
    name: "Skilled Guardian",
    kind: "class_feature",
    status: "verified",
    classes: ["fighter"],
    subclass: "nightwatcher",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Skilled Guardian",
        description:
          "Unraveling mysteries under the cover of night has honed your skills. You gain the following benefits.\n\nExpertise. Choose one of your skill proficiencies with which you lack Expertise. You gain Expertise in that skill.\n\nSkilled. You gain proficiency in two skills of your choice from the following list: Deception, History, Insight, Intimidation, Investigation, Perception, or Stealth.",
      },
    ],
    description:
      "Unraveling mysteries under the cover of night has honed your skills. You gain the following benefits.\n\nExpertise. Choose one of your skill proficiencies with which you lack Expertise. You gain Expertise in that skill.\n\nSkilled. You gain proficienc...",
    source: "Grim Hollow: Player’s Guide, Fighter: Nightwatcher",
  },

  everVigilant: {
    id: "embers:fighter:nightwatcher:ever-vigilant",
    name: "Ever Vigilant",
    kind: "class_feature",
    status: "verified",
    classes: ["fighter"],
    subclass: "nightwatcher",
    activationType: "reaction",
    resource: {
      name: "Ever Vigilant",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Ever Vigilant",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Ever Vigilant",
        description:
          "Your long nights of vigilance have left your senses attuned to signs of danger, granting you the following benefits.\n\nDarkvision. You gain Darkvision with a range of 60 feet. If you already have Darkvision when you gain this feature, its range increases by 60 feet.\n\nKeen Senses. You have Advantage on Initiative rolls and Wisdom (Perception) checks.\n\nWarning Shout. When you make an Initiative roll, you can take a Reaction to warn creatures of your choice within 30 feet of yourself that can see...",
      },
    ],
    description:
      "Your long nights of vigilance have left your senses attuned to signs of danger, granting you the following benefits.\n\nDarkvision. You gain Darkvision with a range of 60 feet. If you already have Darkvision when you gain this feature, its range inc...",
    source: "Grim Hollow: Player’s Guide, Fighter: Nightwatcher",
  },

  sizeUp: {
    id: "embers:fighter:nightwatcher:size-up",
    name: "Size Up",
    kind: "class_feature",
    status: "verified",
    classes: ["fighter"],
    subclass: "nightwatcher",
    activationType: "bonus",
    operations: [
      {
        type: "apply_effect",
        name: "Size Up",
        description:
          "As a Bonus Action, you assess a creature you can see within 30 feet of you. Until the start of your next turn, when that creature makes an attack roll against you or another creature within 5 feet of you, you can take a Reaction to impose Disadvantage on that roll and give Resistance to that damage.",
      },
    ],
    description:
      "As a Bonus Action, you assess a creature you can see within 30 feet of you. Until the start of your next turn, when that creature makes an attack roll against you or another creature within 5 feet of you, you can take a Reaction to impose Disadvan...",
    source: "Grim Hollow: Player’s Guide, Fighter: Nightwatcher",
  },

  nightStalker: {
    id: "embers:fighter:nightwatcher:night-stalker",
    name: "Night Stalker",
    kind: "class_feature",
    status: "verified",
    classes: ["fighter"],
    subclass: "nightwatcher",
    activationType: "bonus",
    resource: {
      name: "Night Stalker",
      resetType: "Short or Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Night Stalker",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Night Stalker",
        description:
          "You are adept at tracking down enemies in the dead of night, giving you these benefits.\n\nBlindsight. As a Bonus Action, you gain Blindsight with a range of 30 feet for 10 minutes. Once you use this benefit, you can’t use it again until you finish a Short or Long Rest.\n\nSlippery. Opportunity Attack action have Disadvantage against you. While entirely within Dim Light or Darkness, your movement doesn’t provoke Opportunity Attack action.",
      },
    ],
    description:
      "You are adept at tracking down enemies in the dead of night, giving you these benefits.\n\nBlindsight. As a Bonus Action, you gain Blindsight with a range of 30 feet for 10 minutes. Once you use this benefit, you can’t use it again until you finish ...",
    source: "Grim Hollow: Player’s Guide, Fighter: Nightwatcher",
  },

  readyForAction: {
    id: "embers:fighter:nightwatcher:ready-for-action",
    name: "Ready for Action",
    kind: "class_feature",
    status: "verified",
    classes: ["fighter"],
    subclass: "nightwatcher",
    activationType: "action",
    operations: [
      {
        type: "apply_effect",
        name: "Ready for Action",
        description:
          "When you make an Initiative roll, you can treat a d20 roll of 9 or lower as a 10. When you roll 18-20 on an Initiative roll, you can take one additional action, except the Magic action, on your first turn.",
      },
    ],
    description:
      "When you make an Initiative roll, you can treat a d20 roll of 9 or lower as a 10. When you roll 18-20 on an Initiative roll, you can take one additional action, except the Magic action, on your first turn.",
    source: "Grim Hollow: Player’s Guide, Fighter: Nightwatcher",
  },

  beatDown: {
    id: "embers:fighter:nightwatcher:beat-down",
    name: "Beat Down",
    kind: "class_feature",
    status: "verified",
    classes: ["fighter"],
    subclass: "nightwatcher",
    activationType: "bonus",
    operations: [
      {
        type: "apply_effect",
        name: "Beat Down",
        description:
          "Immediately after you miss a creature under the effect of your Size Up feature with an attack roll, you can take a Bonus Action or Reaction to make a melee attack against that creature if it’s within range. You have Advantage on the new attack roll against that creature.",
      },
    ],
    description:
      "Immediately after you miss a creature under the effect of your Size Up feature with an attack roll, you can take a Bonus Action or Reaction to make a melee attack against that creature if it’s within range. You have Advantage on the new attack rol...",
    source: "Grim Hollow: Player’s Guide, Fighter: Nightwatcher",
  },
};
