import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const OATH_OF_THE_NOBLE_GENIES_FORMULAS: Record<
  string,
  ManualActionFormula
> = {
  elementalSmite: {
    id: "embers:paladin:oath-of-the-noble-genies:elemental-smite",
    name: "Elemental Smite",
    kind: "class_feature",
    status: "verified",
    classes: ["paladin"],
    subclass: "oathOfTheNobleGenies",
    activationType: "special",
    resource: {
      name: "Elemental Smite",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Elemental Smite",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Elemental Smite",
        description:
          "Immediately after you cast Divine Smite, you can expend one use of your Channel Divinity and invoke one of the following effects.\n\nDao’s Crush. Earth rises up around the target of your Divine Smite. The target has the Grappled condition (escape DC equal to your spell save DC). While Grappled, the target has the Restrained condition.\n\nDjinni’s Escape. You teleport to an unoccupied space you can see within 30 feet of yourself and take on a semi-incorporeal form, which lasts until the end of you...",
      },
    ],
    description:
      "Immediately after you cast Divine Smite, you can expend one use of your Channel Divinity and invoke one of the following effects.\n\nDao’s Crush. Earth rises up around the target of your Divine Smite. The target has the Grappled condition (escape DC...",
    source:
      "Forgotten Realms: Heroes of Faerûn, Paladin: Oath of the Noble Genies",
  },

  genieSpells: {
    id: "embers:paladin:oath-of-the-noble-genies:genie-spells",
    name: "Genie Spells",
    kind: "class_feature",
    status: "verified",
    classes: ["paladin"],
    subclass: "oathOfTheNobleGenies",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Genie Spells",
        description:
          "When you reach a Paladin level specified in the Genie Spells table, you thereafter always have the listed spells prepared.\n\nGenie Spells\nPaladin Level\tSpells\n3\tChromatic Orb, Elementalism, Thunderous Smite\n5\tMirror Image, Phantasmal Force\n9\tFly, Gaseous Form\n13\tConjure Minor Elementals, Summon Elemental\n17\tBanishing Smite, Contact Other Plane",
      },
    ],
    description:
      "When you reach a Paladin level specified in the Genie Spells table, you thereafter always have the listed spells prepared.\n\nGenie Spells\nPaladin Level\tSpells\n3\tChromatic Orb, Elementalism, Thunderous Smite\n5\tMirror Image, Phantasmal Force\n9\tFly, G...",
    source:
      "Forgotten Realms: Heroes of Faerûn, Paladin: Oath of the Noble Genies",
  },

  genieSSplendor: {
    id: "embers:paladin:oath-of-the-noble-genies:genie-s-splendor",
    name: "Genie’s Splendor",
    kind: "class_feature",
    status: "verified",
    classes: ["paladin"],
    subclass: "oathOfTheNobleGenies",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Genie’s Splendor",
        description:
          "When you aren’t wearing any armor, your base Armor Class equals 10 plus your Dexterity and Charisma modifiers. You can use a Shield and still gain this benefit.\n\nYou also gain proficiency in one of the following skills of your choice: Acrobatics, Intimidation, Performance, or Persuasion.",
      },
    ],
    description:
      "When you aren’t wearing any armor, your base Armor Class equals 10 plus your Dexterity and Charisma modifiers. You can use a Shield and still gain this benefit.\n\nYou also gain proficiency in one of the following skills of your choice: Acrobatics, ...",
    source:
      "Forgotten Realms: Heroes of Faerûn, Paladin: Oath of the Noble Genies",
  },

  auraOfElementalShielding: {
    id: "embers:paladin:oath-of-the-noble-genies:aura-of-elemental-shielding",
    name: "Aura of Elemental Shielding",
    kind: "class_feature",
    status: "verified",
    classes: ["paladin"],
    subclass: "oathOfTheNobleGenies",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Aura of Elemental Shielding",
        description:
          "Choose one of the following damage types: Acid, Cold, Fire, Lightning, or Thunder. You and your allies have Resistance to that damage type while in your Aura of Protection.\n\nAt the start of each of your turns, you can change the damage type affected by this feature to one of the other listed options (no action required).",
      },
    ],
    description:
      "Choose one of the following damage types: Acid, Cold, Fire, Lightning, or Thunder. You and your allies have Resistance to that damage type while in your Aura of Protection.\n\nAt the start of each of your turns, you can change the damage type affect...",
    source:
      "Forgotten Realms: Heroes of Faerûn, Paladin: Oath of the Noble Genies",
  },

  elementalRebuke: {
    id: "embers:paladin:oath-of-the-noble-genies:elemental-rebuke",
    name: "Elemental Rebuke",
    kind: "class_feature",
    status: "verified",
    classes: ["paladin"],
    subclass: "oathOfTheNobleGenies",
    activationType: "reaction",
    resource: {
      name: "Elemental Rebuke",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Elemental Rebuke",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Elemental Rebuke",
        description:
          "When you are hit by an attack roll, you can take a Reaction to halve the attack’s damage against yourself (round down) and force the attacker to make a Dexterity saving throw against your spell save DC. On a failed save, the attacker takes damage equal to 2d10 plus your Charisma modifier of one of the following types (your choice): Acid, Cold, Fire, Lightning, or Thunder. On a successful save, the attacker takes half as much damage.\n\nYou can use this feature a number of times equal to your Ch...",
      },
    ],
    description:
      "When you are hit by an attack roll, you can take a Reaction to halve the attack’s damage against yourself (round down) and force the attacker to make a Dexterity saving throw against your spell save DC. On a failed save, the attacker takes damage ...",
    source:
      "Forgotten Realms: Heroes of Faerûn, Paladin: Oath of the Noble Genies",
  },

  nobleScion: {
    id: "embers:paladin:oath-of-the-noble-genies:noble-scion",
    name: "Noble Scion",
    kind: "class_feature",
    status: "verified",
    classes: ["paladin"],
    subclass: "oathOfTheNobleGenies",
    activationType: "bonus",
    resource: {
      name: "Noble Scion",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Noble Scion",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Noble Scion",
        description:
          "As a Bonus Action, you gain the benefits below for 10 minutes or until you end them (no action required). Once you use this feature, you can’t use it again until you finish a Long Rest. You can also restore your use of it by expending a level 5 spell slot (no action required).\n\nFlight. You have a Fly Speed of 60 feet and can hover.\n\nMinor Wish. When you or an ally in your Aura of Protection fails a D20 Test, you can take a Reaction to make you or that ally succeed instead.",
      },
    ],
    description:
      "As a Bonus Action, you gain the benefits below for 10 minutes or until you end them (no action required). Once you use this feature, you can’t use it again until you finish a Long Rest. You can also restore your use of it by expending a level 5 sp...",
    source:
      "Forgotten Realms: Heroes of Faerûn, Paladin: Oath of the Noble Genies",
  },
};
