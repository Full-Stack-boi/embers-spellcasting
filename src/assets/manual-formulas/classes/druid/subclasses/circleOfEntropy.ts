import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const CIRCLE_OF_ENTROPY_FORMULAS: Record<string, ManualActionFormula> = {
  catastrophicPower: {
    id: "embers:druid:circle-of-entropy:catastrophic-power",
    name: "Catastrophic Power",
    kind: "class_feature",
    status: "verified",
    classes: ["druid"],
    subclass: "circleOfEntropy",
    activationType: "action",
    resource: {
      name: "Catastrophic Power",
      resetType: "Short or Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Catastrophic Power",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Catastrophic Power",
        description:
          "You have mastered talents, both magical and martial, in your pursuit of the inevitable destruction of mortals and their works. When you finish a Short or Long Rest, you gain one of the following benefits until you finish your next Short or Long Rest.\n\nElemental Cataclysm. As a Magic action, you can expend a spell slot to cause elemental energy to burst in a 10-foot-radius Sphere centered on a point within 60 feet of yourself. Choose a damage type: Acid, Cold, Fire, or Lightning.\n\nEach creatur...",
      },
    ],
    description:
      "You have mastered talents, both magical and martial, in your pursuit of the inevitable destruction of mortals and their works. When you finish a Short or Long Rest, you gain one of the following benefits until you finish your next Short or Long Re...",
    source: "Grim Hollow: Player’s Guide, Druid: Circle of Entropy",
  },

  ruinIncarnate: {
    id: "embers:druid:circle-of-entropy:ruin-incarnate",
    name: "Ruin Incarnate",
    kind: "class_feature",
    status: "verified",
    classes: ["druid"],
    subclass: "circleOfEntropy",
    activationType: "bonus",
    resource: {
      name: "Ruin Incarnate",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Ruin Incarnate",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Ruin Incarnate",
        description:
          "As a Bonus Action, you can expend a use of your Wild Shape to adopt an aspect of entropy and the inevitable end of all things for 10 minutes. You gain the following benefits.\n\nAll Things Pass. You have Advantage on attack rolls against Bloodied creatures.\n\nInexorable Onslaught. You can attack twice instead of once whenever you take the Attack action on your turn.\n\nIronskin Armor. Your base AC becomes 17 plus your Wisdom modifier (minimum of +1) if your AC is lower than that.",
      },
    ],
    description:
      "As a Bonus Action, you can expend a use of your Wild Shape to adopt an aspect of entropy and the inevitable end of all things for 10 minutes. You gain the following benefits.\n\nAll Things Pass. You have Advantage on attack rolls against Bloodied cr...",
    source: "Grim Hollow: Player’s Guide, Druid: Circle of Entropy",
  },

  manyRoadsToRuin: {
    id: "embers:druid:circle-of-entropy:many-roads-to-ruin",
    name: "Many Roads to Ruin",
    kind: "class_feature",
    status: "verified",
    classes: ["druid"],
    subclass: "circleOfEntropy",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Many Roads to Ruin",
        description:
          "Your mystic connection to catastrophe and destruction grows stronger. You gain the following benefits.\n\nElemental Assault. While your Ruin Incarnate feature is active, whenever you hit with a weapon or an Unarmed Strike, you can cause it to deal your choice of Acid, Cold, Fire, Lightning, or Necrotic damage rather than its normal damage type.\n\nIncreased Might. While your Ruin Incarnate feature is active, you can add your Wisdom modifier (minimum bonus of +1) to your Strength and Dexterity sav...",
      },
    ],
    description:
      "Your mystic connection to catastrophe and destruction grows stronger. You gain the following benefits.\n\nElemental Assault. While your Ruin Incarnate feature is active, whenever you hit with a weapon or an Unarmed Strike, you can cause it to deal y...",
    source: "Grim Hollow: Player’s Guide, Druid: Circle of Entropy",
  },

  shakeTheEarth: {
    id: "embers:druid:circle-of-entropy:shake-the-earth",
    name: "Shake the Earth",
    kind: "class_feature",
    status: "verified",
    classes: ["druid"],
    subclass: "circleOfEntropy",
    activationType: "action",
    resource: {
      name: "Shake the Earth",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Shake the Earth",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Shake the Earth",
        description:
          "As a Magic action, you can strike the earth with a thunderous tremor and grow. When you do so, your size increases by one category (from Medium to Large, for example) for 10 minutes. In addition, each creature in a 30-foot Emanation originating from your new form must make a Dexterity saving throw against your spell save DC or have the Prone condition. The tremor deals Bludgeoning damage to each structure in contact with the ground in the area. To determine this damage, roll a number of d10s ...",
      },
    ],
    description:
      "As a Magic action, you can strike the earth with a thunderous tremor and grow. When you do so, your size increases by one category (from Medium to Large, for example) for 10 minutes. In addition, each creature in a 30-foot Emanation originating fr...",
    source: "Grim Hollow: Player’s Guide, Druid: Circle of Entropy",
  },

  entropySApex: {
    id: "embers:druid:circle-of-entropy:entropy-s-apex",
    name: "Entropy’s Apex",
    kind: "class_feature",
    status: "verified",
    classes: ["druid"],
    subclass: "circleOfEntropy",
    activationType: "action",
    resource: {
      name: "Entropy’s Apex",
      resetType: "Short or Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Entropy’s Apex",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Entropy’s Apex",
        description:
          "You have mastered the ability to hasten the inevitable slide toward entropy. You gain the following benefits.\n\nEnhanced Ruinous Smite. Until the end of your next turn, any creature affected by your Ruinous Smite suffers a Critical Hit on a roll of 19-20 on the d20.\n\nImproved Inexorable Onslaught. While your Ruin Incarnate feature is active, you can attack with a weapon or an Unarmed Strike three times instead of once whenever you take the Attack action on your turn.\n\nWorld Breaker. You regain...",
      },
    ],
    description:
      "You have mastered the ability to hasten the inevitable slide toward entropy. You gain the following benefits.\n\nEnhanced Ruinous Smite. Until the end of your next turn, any creature affected by your Ruinous Smite suffers a Critical Hit on a roll of...",
    source: "Grim Hollow: Player’s Guide, Druid: Circle of Entropy",
  },
};
