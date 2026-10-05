import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const CIRCLE_OF_BLOOD_FORMULAS: Record<string, ManualActionFormula> = {
  circleOfBloodSpells: {
    id: "embers:druid:circle-of-blood:circle-of-blood-spells",
    name: "Circle of Blood Spells",
    kind: "class_feature",
    status: "verified",
    classes: ["druid"],
    subclass: "circleOfBlood",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Circle of Blood Spells",
        description:
          "When you reach a Druid level specified in the Circle of Blood Spells table, you thereafter always have the listed spells prepared.\n\nCircle of Blood Spells\nDruid Level\tPrepared Spells\n3\tBlood Rush, Crimson Lash, Sense Lifeblood\n5\tBlood Bond, Sanguine Poppet\n7\tCircle of Scarlet, Dark Sacrament\n9\tDominate Person, Mortality",
      },
    ],
    description:
      "When you reach a Druid level specified in the Circle of Blood Spells table, you thereafter always have the listed spells prepared.\n\nCircle of Blood Spells\nDruid Level\tPrepared Spells\n3\tBlood Rush, Crimson Lash, Sense Lifeblood\n5\tBlood Bond, Sangui...",
    source: "Grim Hollow: Player’s Guide, Druid: Circle of Blood",
  },

  riteOfTheBloodMoon: {
    id: "embers:druid:circle-of-blood:rite-of-the-blood-moon",
    name: "Rite of the Blood Moon",
    kind: "class_feature",
    status: "verified",
    classes: ["druid"],
    subclass: "circleOfBlood",
    activationType: "bonus",
    resource: {
      name: "Rite of the Blood Moon",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Rite of the Blood Moon",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Rite of the Blood Moon",
        description:
          "As a Bonus Action, you can expend a use of your Wild Shape to adopt the violent savagery of the Blood Moon for 10 minutes. During this time, you gain the following benefits:\n\nRed Resilience. You gain Temporary Hit Points equal to three times your Druid level.\n\nSpeed Increased. Your Speed increases by 10 feet, and you can take the Dash action as a Bonus Action.\n\nViolent Strikes. When you hit a creature with a weapon or Unarmed Strike, you can deal an extra 1d6 Necrotic damage to the target.",
      },
    ],
    description:
      "As a Bonus Action, you can expend a use of your Wild Shape to adopt the violent savagery of the Blood Moon for 10 minutes. During this time, you gain the following benefits:\n\nRed Resilience. You gain Temporary Hit Points equal to three times your ...",
    source: "Grim Hollow: Player’s Guide, Druid: Circle of Blood",
  },

  bloodBoon: {
    id: "embers:druid:circle-of-blood:blood-boon",
    name: "Blood Boon",
    kind: "class_feature",
    status: "verified",
    classes: ["druid"],
    subclass: "circleOfBlood",
    activationType: "reaction",
    resource: {
      name: "Blood Boon",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Blood Boon",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Blood Boon",
        description:
          "Whenever a creature you can see within 60 feet of you is reduced to 0 Hit Points, you can take a Reaction to claim the last vestiges of its vitality. You regain 1 spent Hit Die and grant a creature you can see within 60 feet of you Temporary Hit Points equal to your Druid level.\n\nYou can use this feature a number of times equal to your Wisdom modifier (minimum once). You regain one expended use when you finish a Short Rest, and you regain all expended uses when you finish a Long Rest.",
      },
    ],
    description:
      "Whenever a creature you can see within 60 feet of you is reduced to 0 Hit Points, you can take a Reaction to claim the last vestiges of its vitality. You regain 1 spent Hit Die and grant a creature you can see within 60 feet of you Temporary Hit P...",
    source: "Grim Hollow: Player’s Guide, Druid: Circle of Blood",
  },

  bloodLust: {
    id: "embers:druid:circle-of-blood:blood-lust",
    name: "Blood Lust",
    kind: "class_feature",
    status: "verified",
    classes: ["druid"],
    subclass: "circleOfBlood",
    activationType: "special",
    resource: {
      name: "Blood Lust",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Blood Lust",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Blood Lust",
        description:
          "While your Blood Moon is active, you gain the following benefits:\n\nImproved Violent Strikes. The extra Necrotic damage from your Violent Strikes increases to 2d6.\n\nRed Rage. You have Resistance to Bludgeoning, Piercing, and Slashing damage.",
      },
    ],
    description:
      "While your Blood Moon is active, you gain the following benefits:\n\nImproved Violent Strikes. The extra Necrotic damage from your Violent Strikes increases to 2d6.\n\nRed Rage. You have Resistance to Bludgeoning, Piercing, and Slashing damage.",
    source: "Grim Hollow: Player’s Guide, Druid: Circle of Blood",
  },

  exsanguinate: {
    id: "embers:druid:circle-of-blood:exsanguinate",
    name: "Exsanguinate",
    kind: "class_feature",
    status: "verified",
    classes: ["druid"],
    subclass: "circleOfBlood",
    activationType: "special",
    resource: {
      name: "Exsanguinate",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Exsanguinate",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Exsanguinate",
        description:
          "When you use your Blood Boon, you regain spent Hit Dice equal to half your Druid level and give Temporary Hit Points equal to twice your Druid level to a number of creatures up to your Wisdom modifier (minimum of one creature) that you can see within 60 feet of yourself.\n\nOnce you use this feature, you can’t do so again until you finish a Long Rest.",
      },
    ],
    description:
      "When you use your Blood Boon, you regain spent Hit Dice equal to half your Druid level and give Temporary Hit Points equal to twice your Druid level to a number of creatures up to your Wisdom modifier (minimum of one creature) that you can see wit...",
    source: "Grim Hollow: Player’s Guide, Druid: Circle of Blood",
  },
};
