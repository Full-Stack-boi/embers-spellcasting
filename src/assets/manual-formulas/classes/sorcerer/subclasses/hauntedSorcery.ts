import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const HAUNTED_SORCERY_FORMULAS: Record<string, ManualActionFormula> = {
  hauntedSpells: {
    id: "embers:sorcerer:haunted-sorcery:haunted-spells",
    name: "Haunted Spells",
    kind: "class_feature",
    status: "verified",
    classes: ["sorcerer"],
    subclass: "hauntedSorcery",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Haunted Spells",
        description:
          "When you reach a Sorcerer level specified in the Haunted Spells table, you thereafter always have the listed spells prepared.\n\nHaunted Spells\nSorcerer Level\tSpells\n3\tBane, Chill Touch, Invisibility, See Invisibility, Unseen Servant\n5\tFly, Speak with Dead\n7\tDeath Ward, Greater Invisibility\n9\tLittle Death, Telekinesis",
      },
    ],
    description:
      "When you reach a Sorcerer level specified in the Haunted Spells table, you thereafter always have the listed spells prepared.\n\nHaunted Spells\nSorcerer Level\tSpells\n3\tBane, Chill Touch, Invisibility, See Invisibility, Unseen Servant\n5\tFly, Speak wi...",
    source: "Grim Hollow: Player’s Guide, Sorcerer: Haunted Sorcery",
  },

  sixthSense: {
    id: "embers:sorcerer:haunted-sorcery:sixth-sense",
    name: "Sixth Sense",
    kind: "class_feature",
    status: "verified",
    classes: ["sorcerer"],
    subclass: "hauntedSorcery",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Sixth Sense",
        description:
          "When you roll Initiative, you can add your Charisma modifier to the roll.",
      },
    ],
    description:
      "When you roll Initiative, you can add your Charisma modifier to the roll.",
    source: "Grim Hollow: Player’s Guide, Sorcerer: Haunted Sorcery",
  },

  phantomCompanion: {
    id: "embers:sorcerer:haunted-sorcery:phantom-companion",
    name: "Phantom Companion",
    kind: "class_feature",
    status: "verified",
    classes: ["sorcerer"],
    subclass: "hauntedSorcery",
    activationType: "action",
    resource: {
      name: "Phantom Companion",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Phantom Companion",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Phantom Companion",
        description:
          "You learn the Find Familiar spell and can cast it as a Magic action without expending a spell slot.\n\nThe familiar takes the form of a Specter, though it is an Undead instead of a Celestial, Fey, or Fiend. As a Magic action, you can command your phantom companion to gain the Invisible condition until it attacks or you cast a spell through it. While Invisible, it leaves no physical evidence of its passage and can be tracked only by magic. Any equipment or objects it is holding remains visible.\n...",
      },
    ],
    description:
      "You learn the Find Familiar spell and can cast it as a Magic action without expending a spell slot.\n\nThe familiar takes the form of a Specter, though it is an Undead instead of a Celestial, Fey, or Fiend. As a Magic action, you can command your ph...",
    source: "Grim Hollow: Player’s Guide, Sorcerer: Haunted Sorcery",
  },

  strengthOfSpirit: {
    id: "embers:sorcerer:haunted-sorcery:strength-of-spirit",
    name: "Strength of Spirit",
    kind: "class_feature",
    status: "verified",
    classes: ["sorcerer"],
    subclass: "hauntedSorcery",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Strength of Spirit",
        description:
          "Your bond with your phantom companion empowers it. You gain the following benefits:\n\nYour familiar’s Hit Point maximum increases by four times your Sorcerer level.\nYou can cast spells as if you were in the familiar’s space.\nWhen you use your action to cast a spell, you can use a Bonus Action to command your phantom companion to use its Life Drain attack with its Reaction.",
      },
    ],
    description:
      "Your bond with your phantom companion empowers it. You gain the following benefits:\n\nYour familiar’s Hit Point maximum increases by four times your Sorcerer level.\nYou can cast spells as if you were in the familiar’s space.\nWhen you use your actio...",
    source: "Grim Hollow: Player’s Guide, Sorcerer: Haunted Sorcery",
  },

  deathlyPallor: {
    id: "embers:sorcerer:haunted-sorcery:deathly-pallor",
    name: "Deathly Pallor",
    kind: "class_feature",
    status: "verified",
    classes: ["sorcerer"],
    subclass: "hauntedSorcery",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Deathly Pallor",
        description:
          "You have Resistance to Necrotic damage, and when you cast a Sorcerer spell that deals damage, it can deal your choice of Necrotic damage or its normal damage type.",
      },
    ],
    description:
      "You have Resistance to Necrotic damage, and when you cast a Sorcerer spell that deals damage, it can deal your choice of Necrotic damage or its normal damage type.",
    source: "Grim Hollow: Player’s Guide, Sorcerer: Haunted Sorcery",
  },

  phantomPossession: {
    id: "embers:sorcerer:haunted-sorcery:phantom-possession",
    name: "Phantom Possession",
    kind: "class_feature",
    status: "verified",
    classes: ["sorcerer"],
    subclass: "hauntedSorcery",
    activationType: "reaction",
    resource: {
      name: "Phantom Possession",
      resetType: "Short or Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Phantom Possession",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Phantom Possession",
        description:
          "As a Magic action, you can direct your phantom companion to possess a creature of your choice within 5 feet of your phantom. The target makes a Charisma saving throw against your spell save DC. On a failed save, your phantom companion enters the target’s body for 1 minute. On a successful save, the target resists the efforts to possess it, and your familiar can’t possess it again for 24 hours.\n\nOnce the phantom companion possesses a creature’s body, it controls that creature. The familiar’s H...",
      },
    ],
    description:
      "As a Magic action, you can direct your phantom companion to possess a creature of your choice within 5 feet of your phantom. The target makes a Charisma saving throw against your spell save DC. On a failed save, your phantom companion enters the t...",
    source: "Grim Hollow: Player’s Guide, Sorcerer: Haunted Sorcery",
  },

  becomeDeath: {
    id: "embers:sorcerer:haunted-sorcery:become-death",
    name: "Become Death",
    kind: "class_feature",
    status: "verified",
    classes: ["sorcerer"],
    subclass: "hauntedSorcery",
    activationType: "special",
    resource: {
      name: "Become Death",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Become Death",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Become Death",
        description:
          "You can transmute your physical form into a spectral one when near death. When you are reduced to 0 Hit Points and not killed outright, you can drop to 1 Hit Point instead and gain Temporary Hit Points equal to half your Hit Point maximum. At the start of each of your turns, you lose 10 Temporary Hit Points and creatures of your choice within 30 feet of you take 10 Necrotic damage. While you have Temporary Hit Points granted by this feature, you have Resistance to all damage, a Fly Speed of 3...",
      },
    ],
    description:
      "You can transmute your physical form into a spectral one when near death. When you are reduced to 0 Hit Points and not killed outright, you can drop to 1 Hit Point instead and gain Temporary Hit Points equal to half your Hit Point maximum. At the ...",
    source: "Grim Hollow: Player’s Guide, Sorcerer: Haunted Sorcery",
  },
};
