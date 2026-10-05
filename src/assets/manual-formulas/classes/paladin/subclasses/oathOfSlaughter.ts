import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const OATH_OF_SLAUGHTER_FORMULAS: Record<string, ManualActionFormula> = {
  frenziedSlaughter: {
    id: "embers:paladin:oath-of-slaughter:frenzied-slaughter",
    name: "Frenzied Slaughter",
    kind: "class_feature",
    status: "verified",
    classes: ["paladin"],
    subclass: "oathOfSlaughter",
    activationType: "bonus",
    resource: {
      name: "Frenzied Slaughter",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Frenzied Slaughter",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Frenzied Slaughter",
        description:
          "You can harness the rush of battle to drive you to even greater acts of violence. As a Bonus Action, you can expend one use of your Channel Divinity to enter a battle frenzy. You gain the following benefits while this feature is active.\n\nReflexive Attack. When you miss with an attack roll using a Melee weapon or Unarmed Strike, you can take a Reaction to make another attack with the same weapon.\n\nCondition Resistance. You have Advantage on saving throws to avoid or end the Charmed, Frightened...",
      },
    ],
    description:
      "You can harness the rush of battle to drive you to even greater acts of violence. As a Bonus Action, you can expend one use of your Channel Divinity to enter a battle frenzy. You gain the following benefits while this feature is active.\n\nReflexive...",
    source: "Grim Hollow: Player’s Guide, Paladin: Oath of Slaughter",
  },

  oathOfSlaughterSpells: {
    id: "embers:paladin:oath-of-slaughter:oath-of-slaughter-spells",
    name: "Oath of Slaughter Spells",
    kind: "class_feature",
    status: "verified",
    classes: ["paladin"],
    subclass: "oathOfSlaughter",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Oath of Slaughter Spells",
        description:
          "The magic of your oath ensures you always have certain spells ready; when you reach a Paladin level specified in the Oath of Slaughter Spells table, you thereafter always have the listed spells prepared.\n\nOath of Slaughter Spells\nPaladin Level\tSpells\n3\tCrimson Lash, Inflict Wounds\n5\tBloodletter, Shatter\n9\tFear, Suffocate\n13\tConsume Mind, Supernal Smite\n17\tDestructive Wave, Incite Riot",
      },
    ],
    description:
      "The magic of your oath ensures you always have certain spells ready; when you reach a Paladin level specified in the Oath of Slaughter Spells table, you thereafter always have the listed spells prepared.\n\nOath of Slaughter Spells\nPaladin Level\tSpe...",
    source: "Grim Hollow: Player’s Guide, Paladin: Oath of Slaughter",
  },

  bloodthirstAura: {
    id: "embers:paladin:oath-of-slaughter:bloodthirst-aura",
    name: "Bloodthirst Aura",
    kind: "class_feature",
    status: "verified",
    classes: ["paladin"],
    subclass: "oathOfSlaughter",
    activationType: "reaction",
    operations: [
      {
        type: "apply_effect",
        name: "Bloodthirst Aura",
        description:
          "Your lust for blood infects those around you. When a Bloodied ally within your Aura of Protection makes an attack with a weapon or an Unarmed Strike, it gains a bonus to damage. The bonus equals your Charisma modifier.\n\nAdditionally, when a Bloodied creature within your Aura of Protection makes a saving throw against a Sangromancy spell, you can take a Reaction to impose Disadvantage on the save.\n\nWe’re more similar than different to those paladins who revel in slaughter, I think. Though, the...",
      },
    ],
    description:
      "Your lust for blood infects those around you. When a Bloodied ally within your Aura of Protection makes an attack with a weapon or an Unarmed Strike, it gains a bonus to damage. The bonus equals your Charisma modifier.\n\nAdditionally, when a Bloodi...",
    source: "Grim Hollow: Player’s Guide, Paladin: Oath of Slaughter",
  },

  followThrough: {
    id: "embers:paladin:oath-of-slaughter:follow-through",
    name: "Follow Through",
    kind: "class_feature",
    status: "verified",
    classes: ["paladin"],
    subclass: "oathOfSlaughter",
    activationType: "reaction",
    operations: [
      {
        type: "apply_effect",
        name: "Follow Through",
        description:
          "When a creature in your Aura of Protection becomes Bloodied, you can take a Reaction to move up to half your Speed and make an attack with a Melee weapon or Unarmed Strike. This movement doesn’t provoke Opportunity Attack action, and you have Advantage on the attack roll.",
      },
    ],
    description:
      "When a creature in your Aura of Protection becomes Bloodied, you can take a Reaction to move up to half your Speed and make an attack with a Melee weapon or Unarmed Strike. This movement doesn’t provoke Opportunity Attack action, and you have Adva...",
    source: "Grim Hollow: Player’s Guide, Paladin: Oath of Slaughter",
  },

  bloodKnight: {
    id: "embers:paladin:oath-of-slaughter:blood-knight",
    name: "Blood Knight",
    kind: "class_feature",
    status: "verified",
    classes: ["paladin"],
    subclass: "oathOfSlaughter",
    activationType: "bonus",
    resource: {
      name: "Blood Knight",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Blood Knight",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Blood Knight",
        description:
          "Your bloodthirst imbues you with preternatural strength and resilience, allowing you to keep sowing slaughter. As a Bonus Action, you gain the benefits below for 10 minutes or until you end them (no action required). Once you use this feature, you can’t use it again until you finish a Long Rest. You can also restore your use of it by expending a level 5 spell slot (no action required).\n\nCrimson Armor. When a creature within your Aura of Protection becomes Bloodied by an enemy, you gain 30 Tem...",
      },
    ],
    description:
      "Your bloodthirst imbues you with preternatural strength and resilience, allowing you to keep sowing slaughter. As a Bonus Action, you gain the benefits below for 10 minutes or until you end them (no action required). Once you use this feature, you...",
    source: "Grim Hollow: Player’s Guide, Paladin: Oath of Slaughter",
  },
};
