import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const WAR_DOMAIN_FORMULAS: Record<string, ManualActionFormula> = {
  warPriest: {
    id: "embers:cleric:war:war-priest",
    name: "War Priest",
    kind: "class_feature",
    status: "verified",
    classes: ["cleric"],
    subclass: "warDomain",
    activationType: "bonus",
    resource: {
      name: "War Priest",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "apply_effect",
        name: "Bonus Attack",
        description:
          "When you take the Attack or Magic action, you can make one weapon attack as a Bonus Action (Wisdom modifier uses, min 1).",
      },
    ],
    description:
      "Strike down foes with rapid extra attacks fueled by divine zeal.",
    source: "Player's Handbook (2024), Cleric: War Domain",
  },

  guidedStrike: {
    id: "embers:cleric:war:guided-strike",
    name: "Channel Divinity: Guided Strike",
    kind: "class_feature",
    status: "verified",
    classes: ["cleric"],
    subclass: "warDomain",
    activationType: "reaction",
    operations: [
      {
        type: "apply_effect",
        name: "Guaranteed Blow",
        description:
          "Reaction when you or an ally within 30 feet makes an attack roll: expend 1 Channel Divinity to grant a +10 bonus to the roll.",
      },
    ],
    description: "Guide your weapon with infallible divine precision.",
    source: "Player's Handbook (2024), Cleric: War Domain",
  },

  warGodsBlessing: {
    id: "embers:cleric:war:war-gods-blessing",
    name: "War God's Blessing",
    kind: "class_feature",
    status: "verified",
    classes: ["cleric"],
    subclass: "warDomain",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Unfettered Warfare",
        description:
          "You can cast Shield of Faith and Spiritual Weapon without requiring Concentration (duration 1 minute each, only one un-concentrated spell at a time). In addition, you can use Guided Strike on an ally within 30 feet.",
      },
    ],
    description:
      "Cast key war domain spells without concentrating on them and bolster ally strikes.",
    source: "Player's Handbook (2024), Cleric: War Domain",
  },

  avatarOfBattle: {
    id: "embers:cleric:war:avatar-of-battle",
    name: "Avatar of Battle",
    kind: "class_feature",
    status: "verified",
    classes: ["cleric"],
    subclass: "warDomain",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Martial Resilience",
        description:
          "You gain Resistance to Bludgeoning, Piercing, and Slashing damage.",
      },
    ],
    description:
      "Armor yourself with divine endurance against physical weaponry.",
    source: "Player's Handbook (2024), Cleric: War Domain",
  },
};
