import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const WARRIOR_OF_REGRET_FORMULAS: Record<string, ManualActionFormula> = {
  shadeOfRegret: {
    id: "embers:monk:warrior-of-regret:shade-of-regret",
    name: "Shade of Regret",
    kind: "class_feature",
    status: "verified",
    classes: ["monk"],
    subclass: "warriorOfRegret",
    activationType: "bonus",
    resource: {
      name: "Shade of Regret",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Shade of Regret",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Shade of Regret",
        description:
          "Once per turn, on your turn, you can expend 1 Focus Point (no action required) to create a shade of yourself in an unoccupied space you can see within 10 feet of yourself. The shade is intangible and doesn’t occupy its space. It lasts until the end of your next turn, but it ends early if you dismiss it (no action required) or have the Incapacitated condition. While it persists, you gain the following benefits.\n\nShade Strike. When you use Flurry of Blows, you can have the attacks originate fro...",
      },
    ],
    description:
      "Once per turn, on your turn, you can expend 1 Focus Point (no action required) to create a shade of yourself in an unoccupied space you can see within 10 feet of yourself. The shade is intangible and doesn’t occupy its space. It lasts until the en...",
    source: "Grim Hollow: Player’s Guide, Monk: Warrior of Regret",
  },

  theRoadNotTraveled: {
    id: "embers:monk:warrior-of-regret:the-road-not-traveled",
    name: "The Road Not Traveled",
    kind: "class_feature",
    status: "verified",
    classes: ["monk"],
    subclass: "warriorOfRegret",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "The Road Not Traveled",
        description:
          "When you take the Dash action, instead of moving, you can teleport yourself or an ally within 60 feet of you to the location of your shade.",
      },
    ],
    description:
      "When you take the Dash action, instead of moving, you can teleport yourself or an ally within 60 feet of you to the location of your shade.",
    source: "Grim Hollow: Player’s Guide, Monk: Warrior of Regret",
  },

  aidNotGiven: {
    id: "embers:monk:warrior-of-regret:aid-not-given",
    name: "Aid Not Given",
    kind: "class_feature",
    status: "verified",
    classes: ["monk"],
    subclass: "warriorOfRegret",
    activationType: "bonus",
    operations: [
      {
        type: "apply_effect",
        name: "Aid Not Given",
        description:
          "You can take a Bonus Action to take the Help action or expend 1 Focus Point to touch a creature and restore a number of Hit Points equal to a roll of your Martial Arts die plus your Wisdom modifier.",
      },
    ],
    description:
      "You can take a Bonus Action to take the Help action or expend 1 Focus Point to touch a creature and restore a number of Hit Points equal to a roll of your Martial Arts die plus your Wisdom modifier.",
    source: "Grim Hollow: Player’s Guide, Monk: Warrior of Regret",
  },

  crushingGuilt: {
    id: "embers:monk:warrior-of-regret:crushing-guilt",
    name: "Crushing Guilt",
    kind: "class_feature",
    status: "verified",
    classes: ["monk"],
    subclass: "warriorOfRegret",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Crushing Guilt",
        description:
          "You can expend 3 Focus Points to release your pent-up guilt in a crushing wave that drops your foes to their knees. Creatures of your choice in a 20-foot Emanation originating from you or your shade must make a Wisdom saving throw against your Focus Point save DC. On a failed save, a creature takes Psychic damage equal to three rolls of your Martial Arts die and has the Prone condition. On a successful save, a creature takes half as much damage only.",
      },
    ],
    description:
      "You can expend 3 Focus Points to release your pent-up guilt in a crushing wave that drops your foes to their knees. Creatures of your choice in a 20-foot Emanation originating from you or your shade must make a Wisdom saving throw against your Foc...",
    source: "Grim Hollow: Player’s Guide, Monk: Warrior of Regret",
  },

  reliveThePast: {
    id: "embers:monk:warrior-of-regret:relive-the-past",
    name: "Relive the Past",
    kind: "class_feature",
    status: "verified",
    classes: ["monk"],
    subclass: "warriorOfRegret",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Relive the Past",
        description:
          "Your Shade of Regret now lasts for 10 minutes. After using Flurry of Blows, your Shade can make one additional Unarmed Strike as per Shade Strike. You can also use the Stunning Strike feature through the Shade Strike.",
      },
    ],
    description:
      "Your Shade of Regret now lasts for 10 minutes. After using Flurry of Blows, your Shade can make one additional Unarmed Strike as per Shade Strike. You can also use the Stunning Strike feature through the Shade Strike.",
    source: "Grim Hollow: Player’s Guide, Monk: Warrior of Regret",
  },
};
