import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const HIGHWAY_RIDER_FORMULAS: Record<string, ManualActionFormula> = {
  hairTrigger: {
    id: "embers:rogue:highway-rider:hair-trigger",
    name: "Hair Trigger",
    kind: "class_feature",
    status: "verified",
    classes: ["rogue"],
    subclass: "highwayRider",
    activationType: "reaction",
    operations: [
      {
        type: "apply_effect",
        name: "Hair Trigger",
        description:
          "You gain proficiency with Blackpowder Pistols. In addition, when you roll Initiative and don’t have Disadvantage on that roll, you can immediately take a Reaction for one of the following options:\n\nMake one attack with a weapon or Unarmed Strike.\nMove up to your Speed without provoking Opportunity Attack action.\nA controlled mount moves up to its Speed without provoking Opportunity Attack action.\nTake the Dodge or Utilize action.",
      },
    ],
    description:
      "You gain proficiency with Blackpowder Pistols. In addition, when you roll Initiative and don’t have Disadvantage on that roll, you can immediately take a Reaction for one of the following options:\n\nMake one attack with a weapon or Unarmed Strike.\n...",
    source: "Grim Hollow: Player’s Guide, Rogue: Highway Rider",
  },

  trustyMount: {
    id: "embers:rogue:highway-rider:trusty-mount",
    name: "Trusty Mount",
    kind: "class_feature",
    status: "verified",
    classes: ["rogue"],
    subclass: "highwayRider",
    activationType: "special",
    resource: {
      name: "Trusty Mount",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Trusty Mount",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Trusty Mount",
        description:
          "You always have the Find Steed spell prepared. With this feature, you can cast it without a spell slot or components, and your spellcasting ability for it is Intelligence.\n\nOnce you cast the spell with this feature, you can’t do so in this way again until you finish a Long Rest.",
      },
    ],
    description:
      "You always have the Find Steed spell prepared. With this feature, you can cast it without a spell slot or components, and your spellcasting ability for it is Intelligence.\n\nOnce you cast the spell with this feature, you can’t do so in this way aga...",
    source: "Grim Hollow: Player’s Guide, Rogue: Highway Rider",
  },

  rideThemDown: {
    id: "embers:rogue:highway-rider:ride-them-down",
    name: "Ride Them Down",
    kind: "class_feature",
    status: "verified",
    classes: ["rogue"],
    subclass: "highwayRider",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Ride Them Down",
        description:
          "You don’t need Advantage on the attack roll to Sneak Attack if you or a controlled mount you ride moves at least 20 feet, and you don’t have Disadvantage on the attack roll.",
      },
    ],
    description:
      "You don’t need Advantage on the attack roll to Sneak Attack if you or a controlled mount you ride moves at least 20 feet, and you don’t have Disadvantage on the attack roll.",
    source: "Grim Hollow: Player’s Guide, Rogue: Highway Rider",
  },

  horseLord: {
    id: "embers:rogue:highway-rider:horse-lord",
    name: "Horse Lord",
    kind: "class_feature",
    status: "verified",
    classes: ["rogue"],
    subclass: "highwayRider",
    activationType: "bonus",
    operations: [
      {
        type: "apply_effect",
        name: "Horse Lord",
        description:
          "You can spend 1 minute grooming and caring for your mount, at the end of which it gains a number of Temporary Hit Points equal to twice your Rogue level.\n\nIn addition, your cunning extends to your steed. While you control a mount, it can take one of the following actions as a Bonus Action: Dash, Disengage, or Dodge.",
      },
    ],
    description:
      "You can spend 1 minute grooming and caring for your mount, at the end of which it gains a number of Temporary Hit Points equal to twice your Rogue level.\n\nIn addition, your cunning extends to your steed. While you control a mount, it can take one ...",
    source: "Grim Hollow: Player’s Guide, Rogue: Highway Rider",
  },

  trueGrit: {
    id: "embers:rogue:highway-rider:true-grit",
    name: "True Grit",
    kind: "class_feature",
    status: "verified",
    classes: ["rogue"],
    subclass: "highwayRider",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "True Grit",
        description:
          "You gain proficiency in Constitution saving throws. In addition, when you are subjected to an effect that allows you to make a Constitution saving throw to take only half damage, you instead take no damage if you succeed on the saving throw, and only half damage if you fail.",
      },
    ],
    description:
      "You gain proficiency in Constitution saving throws. In addition, when you are subjected to an effect that allows you to make a Constitution saving throw to take only half damage, you instead take no damage if you succeed on the saving throw, and o...",
    source: "Grim Hollow: Player’s Guide, Rogue: Highway Rider",
  },

  desperado: {
    id: "embers:rogue:highway-rider:desperado",
    name: "Desperado",
    kind: "class_feature",
    status: "verified",
    classes: ["rogue"],
    subclass: "highwayRider",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Desperado",
        description:
          "When you are reduced to 0 Hit Points and not killed outright, you can use your Hair Trigger feature immediately before you fall Unconscious.\n\nThe back roads are getting too dangerous. Our carriage got held up and ransacked three times… today!\n\n— Disgruntled Noble",
      },
    ],
    description:
      "When you are reduced to 0 Hit Points and not killed outright, you can use your Hair Trigger feature immediately before you fall Unconscious.\n\nThe back roads are getting too dangerous. Our carriage got held up and ransacked three times… today!\n\n— D...",
    source: "Grim Hollow: Player’s Guide, Rogue: Highway Rider",
  },
};
