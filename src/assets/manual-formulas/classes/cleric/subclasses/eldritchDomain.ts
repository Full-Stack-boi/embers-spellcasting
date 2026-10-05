import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const ELDRITCH_DOMAIN_FORMULAS: Record<string, ManualActionFormula> = {
  eldritchDomainSpells: {
    id: "embers:cleric:eldritch-domain:eldritch-domain-spells",
    name: "Eldritch Domain Spells",
    kind: "class_feature",
    status: "verified",
    classes: ["cleric"],
    subclass: "eldritchDomain",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Eldritch Domain Spells",
        description:
          "Your connection to this divine domain ensures you always have certain spells ready. When you reach a Cleric level specified in the Eldritch Domain Spells table, you thereafter always have the listed spells prepared.\n\nEldritch Domain Spells\nCleric Level\tPrepared Spells\n3\tDetect Thoughts, Tasha's Hideous Laughter, See Invisibility, Sleep\n5\tFear, Tongues\n7\tConfusion, Phantasmal Killer\n9\tContact Other Plane, Dream",
      },
    ],
    description:
      "Your connection to this divine domain ensures you always have certain spells ready. When you reach a Cleric level specified in the Eldritch Domain Spells table, you thereafter always have the listed spells prepared.\n\nEldritch Domain Spells\nCleric ...",
    source: "Grim Hollow: Player’s Guide, Cleric: Eldritch Domain",
  },

  eldritchContagion: {
    id: "embers:cleric:eldritch-domain:eldritch-contagion",
    name: "Eldritch Contagion",
    kind: "class_feature",
    status: "verified",
    classes: ["cleric"],
    subclass: "eldritchDomain",
    activationType: "action",
    resource: {
      name: "Eldritch Contagion",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Eldritch Contagion",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Eldritch Contagion",
        description:
          "You’ve been gifted with the ability to impart a fleeting taste of the unknowable on others. When you take a Magic action to cast a spell using a spell slot that targets one or more creatures, you can force one target of the original spell to make a Wisdom saving throw against your spell save DC. On a failed save, roll on the Eldritch Effects table, and the target creature suffers that effect for 1 minute. At the end of each of its turns, the target repeats the save, ending the effect on itsel...",
      },
    ],
    description:
      "You’ve been gifted with the ability to impart a fleeting taste of the unknowable on others. When you take a Magic action to cast a spell using a spell slot that targets one or more creatures, you can force one target of the original spell to make ...",
    source: "Grim Hollow: Player’s Guide, Cleric: Eldritch Domain",
  },

  prophecyOfDoom: {
    id: "embers:cleric:eldritch-domain:prophecy-of-doom",
    name: "Prophecy of Doom",
    kind: "class_feature",
    status: "verified",
    classes: ["cleric"],
    subclass: "eldritchDomain",
    activationType: "action",
    resource: {
      name: "Prophecy of Doom",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Prophecy of Doom",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Prophecy of Doom",
        description:
          "As a Magic action, you expend a use of your Channel Divinity to choose a point within 120 feet of you that you can see and roll on the Eldritch Effects table. Each creature in a 15-foot-radius Sphere centered on that point must succeed on a Wisdom saving throw against your spell save DC or suffer the rolled effect for 1 minute. At the end of each of its turns, the target repeats the save, ending the effect on itself on a success.",
      },
    ],
    description:
      "As a Magic action, you expend a use of your Channel Divinity to choose a point within 120 feet of you that you can see and roll on the Eldritch Effects table. Each creature in a 15-foot-radius Sphere centered on that point must succeed on a Wisdom...",
    source: "Grim Hollow: Player’s Guide, Cleric: Eldritch Domain",
  },

  otherworldlyCalm: {
    id: "embers:cleric:eldritch-domain:otherworldly-calm",
    name: "Otherworldly Calm",
    kind: "class_feature",
    status: "verified",
    classes: ["cleric"],
    subclass: "eldritchDomain",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Otherworldly Calm",
        description:
          "You have Resistance to Psychic damage and Advantage on saving throws to avoid or end the Charmed and Frightened conditions.\n\nAdditionally, your thoughts can’t be read by telepathy or other means unless you allow it. The attempt automatically fails, and the creature must succeed on a Wisdom saving throw against your spell save DC or take Psychic damage equal to your Cleric level.",
      },
    ],
    description:
      "You have Resistance to Psychic damage and Advantage on saving throws to avoid or end the Charmed and Frightened conditions.\n\nAdditionally, your thoughts can’t be read by telepathy or other means unless you allow it. The attempt automatically fails...",
    source: "Grim Hollow: Player’s Guide, Cleric: Eldritch Domain",
  },

  singTheSongThatEndsTheWorld: {
    id: "embers:cleric:eldritch-domain:sing-the-song-that-ends-the-world",
    name: "Sing the Song that Ends the World",
    kind: "class_feature",
    status: "verified",
    classes: ["cleric"],
    subclass: "eldritchDomain",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Sing the Song that Ends the World",
        description:
          "When a creature fails a Wisdom saving throw against your Prophecy of Doom feature, you can deal 10d10 Psychic damage to it. Once a creature takes damage in this way, it is immune to this effect for 10 minutes, after which it can be affected again.",
      },
    ],
    description:
      "When a creature fails a Wisdom saving throw against your Prophecy of Doom feature, you can deal 10d10 Psychic damage to it. Once a creature takes damage in this way, it is immune to this effect for 10 minutes, after which it can be affected again.",
    source: "Grim Hollow: Player’s Guide, Cleric: Eldritch Domain",
  },
};
