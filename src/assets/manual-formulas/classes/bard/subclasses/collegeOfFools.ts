import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const COLLEGE_OF_FOOLS_FORMULAS: Record<string, ManualActionFormula> = {
  antagonisticAntics: {
    id: "embers:bard:college-of-fools:antagonistic-antics",
    name: "Antagonistic Antics",
    kind: "class_feature",
    status: "verified",
    classes: ["bard"],
    subclass: "collegeOfFools",
    activationType: "bonus",
    operations: [
      {
        type: "apply_effect",
        name: "Antagonistic Antics",
        description:
          "You know the Vicious Mockery cantrip. If you already know it, you learn a different Bard cantrip of your choice. The cantrip doesn’t count against your number of cantrips known. Additionally, you always have the Dissonant Whispers spell prepared.\n\nIn addition, when you take the Dash, Disengage, or Influence action on your turn, you can take a Bonus Action on the same turn to cast Vicious Mockery.",
      },
    ],
    description:
      "You know the Vicious Mockery cantrip. If you already know it, you learn a different Bard cantrip of your choice. The cantrip doesn’t count against your number of cantrips known. Additionally, you always have the Dissonant Whispers spell prepared.\n...",
    source: "Grim Hollow: Player’s Guide, Bard: College of Fools",
  },

  cruelJest: {
    id: "embers:bard:college-of-fools:cruel-jest",
    name: "Cruel Jest",
    kind: "class_feature",
    status: "verified",
    classes: ["bard"],
    subclass: "collegeOfFools",
    activationType: "reaction",
    resource: {
      name: "Cruel Jest",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Cruel Jest",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Cruel Jest",
        description:
          "When a creature that you can see or hear within 30 feet of yourself fails a D20 Test, you can take a Reaction to expend one use of your Bardic Inspiration; roll your Bardic Inspiration die and deal Psychic damage equal to the number rolled plus your Charisma modifier. In addition, the creature has Disadvantage on the next D20 Test it makes before the end of its next turn.",
      },
    ],
    description:
      "When a creature that you can see or hear within 30 feet of yourself fails a D20 Test, you can take a Reaction to expend one use of your Bardic Inspiration; roll your Bardic Inspiration die and deal Psychic damage equal to the number rolled plus yo...",
    source: "Grim Hollow: Player’s Guide, Bard: College of Fools",
  },

  gallowsHumor: {
    id: "embers:bard:college-of-fools:gallows-humor",
    name: "Gallows Humor",
    kind: "class_feature",
    status: "verified",
    classes: ["bard"],
    subclass: "collegeOfFools",
    activationType: "reaction",
    resource: {
      name: "Gallows Humor",
      resetType: "Short or Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Gallows Humor",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Gallows Humor",
        description:
          "When a creature that you can see within 60 feet of you is reduced to 0 Hit Points or killed outright, you can take a Reaction to regain an expended use of your Bardic Inspiration. When you do so, choose a creature within 30 feet of you that can hear and understand you. That creature must succeed on a Wisdom saving throw against your spell save DC or gain the Prone condition and have its Speed reduced to 0 until the end of its next turn. If the creature succeeds on the Wisdom saving throw, you...",
      },
    ],
    description:
      "When a creature that you can see within 60 feet of you is reduced to 0 Hit Points or killed outright, you can take a Reaction to regain an expended use of your Bardic Inspiration. When you do so, choose a creature within 30 feet of you that can he...",
    source: "Grim Hollow: Player’s Guide, Bard: College of Fools",
  },

  lastLaugh: {
    id: "embers:bard:college-of-fools:last-laugh",
    name: "Last Laugh",
    kind: "class_feature",
    status: "verified",
    classes: ["bard"],
    subclass: "collegeOfFools",
    activationType: "reaction",
    resource: {
      name: "Last Laugh",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Last Laugh",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Last Laugh",
        description:
          "When you become Bloodied or take damage while you are Bloodied, you can take a Reaction to regain all expended Bardic Inspiration dice and break out into a cackling fit of fatalistic glee at your own impending doom. For 1 minute, you have Resistance to all damage. Also, when a creature within 60 feet of you hits you with an attack roll, you can expend up to three Bardic Inspiration dice to force the attacker to make a Charisma saving throw against your spell save DC. On a failure, the creatur...",
      },
    ],
    description:
      "When you become Bloodied or take damage while you are Bloodied, you can take a Reaction to regain all expended Bardic Inspiration dice and break out into a cackling fit of fatalistic glee at your own impending doom. For 1 minute, you have Resistan...",
    source: "Grim Hollow: Player’s Guide, Bard: College of Fools",
  },
};
