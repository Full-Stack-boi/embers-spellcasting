import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const TRAPPER_GUILD_FORMULAS: Record<string, ManualActionFormula> = {
  sneakyAndCrafty: {
    id: "embers:monster-hunter:trapper-guild:sneaky-and-crafty",
    name: "Sneaky and Crafty",
    kind: "class_feature",
    status: "verified",
    classes: ["monster-hunter"],
    subclass: "trapperGuild",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Sneaky and Crafty",
        description:
          "You gain proficiency in the Stealth skill and with Tinker’s Tools.",
      },
    ],
    description:
      "You gain proficiency in the Stealth skill and with Tinker’s Tools.",
    source: "Grim Hollow: Player’s Guide, monster-hunter: Trapper Guild",
  },

  trapperGadgets: {
    id: "embers:monster-hunter:trapper-guild:trapper-gadgets",
    name: "Trapper Gadgets",
    kind: "class_feature",
    status: "verified",
    classes: ["monster-hunter"],
    subclass: "trapperGuild",
    activationType: "bonus",
    resource: {
      name: "Trapper Gadgets",
      resetType: "Short or Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Trapper Gadgets",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Trapper Gadgets",
        description:
          "You learn to create gadgets and mechanisms that help you during the hunt.\n\nAs part of a Long Rest, you can craft two Trapper Gadgets if you have materials and Tinker’s Tools on hand. Also, with 1 hour of work with such a kit and expending 20 GP worth of materials (such as equipment or monster salvage), you can create one Trapper Gadget from the list below.\n\nSome Trapper Gadgets allow your target to make an ability check or saving throw to resist the gadget’s effects. The saving throw DC is ca...",
      },
    ],
    description:
      "You learn to create gadgets and mechanisms that help you during the hunt.\n\nAs part of a Long Rest, you can craft two Trapper Gadgets if you have materials and Tinker’s Tools on hand. Also, with 1 hour of work with such a kit and expending 20 GP wo...",
    source: "Grim Hollow: Player’s Guide, monster-hunter: Trapper Guild",
  },

  ambusherSAdvantage: {
    id: "embers:monster-hunter:trapper-guild:ambusher-s-advantage",
    name: "Ambusher’s Advantage",
    kind: "class_feature",
    status: "verified",
    classes: ["monster-hunter"],
    subclass: "trapperGuild",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Ambusher’s Advantage",
        description:
          "You have become a ferocious ambusher. When you roll Initiative, you can add your Intelligence modifier to the roll. Additionally, you can’t be surprised by enemies that include creature types in your Monster Grimoire.",
      },
    ],
    description:
      "You have become a ferocious ambusher. When you roll Initiative, you can add your Intelligence modifier to the roll. Additionally, you can’t be surprised by enemies that include creature types in your Monster Grimoire.",
    source: "Grim Hollow: Player’s Guide, monster-hunter: Trapper Guild",
  },

  agileResponse: {
    id: "embers:monster-hunter:trapper-guild:agile-response",
    name: "Agile Response",
    kind: "class_feature",
    status: "verified",
    classes: ["monster-hunter"],
    subclass: "trapperGuild",
    activationType: "reaction",
    operations: [
      {
        type: "apply_effect",
        name: "Agile Response",
        description:
          "You can leap aside to avoid enemies rushing toward you. When a creature makes a melee attack roll against you, you can take a Reaction to impose Disadvantage on that roll and use your Studied Response as part of the same Reaction. Whether the attack hits or misses, you can then move up to half your Speed. This movement doesn’t provoke Opportunity Attack action.",
      },
    ],
    description:
      "You can leap aside to avoid enemies rushing toward you. When a creature makes a melee attack roll against you, you can take a Reaction to impose Disadvantage on that roll and use your Studied Response as part of the same Reaction. Whether the atta...",
    source: "Grim Hollow: Player’s Guide, monster-hunter: Trapper Guild",
  },

  monsterHideArmor: {
    id: "embers:monster-hunter:trapper-guild:monster-hide-armor",
    name: "Monster-Hide Armor",
    kind: "class_feature",
    status: "verified",
    classes: ["monster-hunter"],
    subclass: "trapperGuild",
    activationType: "bonus",
    resource: {
      name: "Monster-Hide Armor",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Monster-Hide Armor",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Monster-Hide Armor",
        description:
          "You have learned to craft a set of Light or Medium armor by using dragon scales, werewolf hide, troll leather, or a similar monster component. The armor takes on the appearance of your choice, reflecting the component it is made from.\n\nThe armor has the same properties as Light or Medium armor (your choice when the armor is crafted) and gains two modifications from the Armor Modifications list. Whenever you gain a Monster Hunter level, you can replace one of these modifications with another m...",
      },
    ],
    description:
      "You have learned to craft a set of Light or Medium armor by using dragon scales, werewolf hide, troll leather, or a similar monster component. The armor takes on the appearance of your choice, reflecting the component it is made from.\n\nThe armor h...",
    source: "Grim Hollow: Player’s Guide, monster-hunter: Trapper Guild",
  },

  rapidTinkerer: {
    id: "embers:monster-hunter:trapper-guild:rapid-tinkerer",
    name: "Rapid Tinkerer",
    kind: "class_feature",
    status: "verified",
    classes: ["monster-hunter"],
    subclass: "trapperGuild",
    activationType: "special",
    resource: {
      name: "Rapid Tinkerer",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Rapid Tinkerer",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Rapid Tinkerer",
        description:
          "You have become capable of crafting trapper tools at a much faster rate. You can spend 1 minute to make a Trapper Gadget without spending GP or components.\n\nYou can use this feature twice, and you regain all expended uses when you finish a Long Rest.",
      },
    ],
    description:
      "You have become capable of crafting trapper tools at a much faster rate. You can spend 1 minute to make a Trapper Gadget without spending GP or components.\n\nYou can use this feature twice, and you regain all expended uses when you finish a Long Rest.",
    source: "Grim Hollow: Player’s Guide, monster-hunter: Trapper Guild",
  },
};
