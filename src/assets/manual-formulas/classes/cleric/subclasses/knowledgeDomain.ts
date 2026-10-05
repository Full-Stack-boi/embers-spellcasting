import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const KNOWLEDGE_DOMAIN_FORMULAS: Record<string, ManualActionFormula> = {
  blessingsOfKnowledge: {
    id: "embers:cleric:knowledge-domain:blessings-of-knowledge",
    name: "Blessings of Knowledge",
    kind: "class_feature",
    status: "verified",
    classes: ["cleric"],
    subclass: "knowledgeDomain",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Blessings of Knowledge",
        description:
          "You gain proficiency with one type of Artisan’s Tools of your choice and in two of the following skills of your choice: Arcana, History, Nature, or Religion. You have Expertise in those two skills.",
      },
    ],
    description:
      "You gain proficiency with one type of Artisan’s Tools of your choice and in two of the following skills of your choice: Arcana, History, Nature, or Religion. You have Expertise in those two skills.",
    source: "Forgotten Realms: Heroes of Faerûn, Cleric: Knowledge Domain",
  },

  knowledgeDomainSpells: {
    id: "embers:cleric:knowledge-domain:knowledge-domain-spells",
    name: "Knowledge Domain Spells",
    kind: "class_feature",
    status: "verified",
    classes: ["cleric"],
    subclass: "knowledgeDomain",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Knowledge Domain Spells",
        description:
          "When you reach a Cleric level specified in the Knowledge Domain Spells table, you thereafter always have the listed spells prepared.\n\nKnowledge Domain Spells\nCleric Level\tPrepared Spells\n3\tCommand, Comprehend Languages*, Detect Magic*, Detect Thoughts*, Identify*, Mind Spike*\n5\tDispel Magic, Nondetection, Tongues*\n7\tArcane Eye*, Banishment, Confusion\n9\tLegend Lore*, Scrying*, Synaptic Static\n*Spell of the Divination school",
      },
    ],
    description:
      "When you reach a Cleric level specified in the Knowledge Domain Spells table, you thereafter always have the listed spells prepared.\n\nKnowledge Domain Spells\nCleric Level\tPrepared Spells\n3\tCommand, Comprehend Languages*, Detect Magic*, Detect Thou...",
    source: "Forgotten Realms: Heroes of Faerûn, Cleric: Knowledge Domain",
  },

  mindMagic: {
    id: "embers:cleric:knowledge-domain:mind-magic",
    name: "Mind Magic",
    kind: "class_feature",
    status: "verified",
    classes: ["cleric"],
    subclass: "knowledgeDomain",
    activationType: "action",
    resource: {
      name: "Mind Magic",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Mind Magic",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Mind Magic",
        description:
          "As a Magic action, you can expend one use of your Channel Divinity to manifest your magical knowledge. Choose one spell from the Divination school on the Knowledge Domain Spells table that you have prepared. As part of that action, you cast that spell without expending a spell slot or needing Material components.",
      },
    ],
    description:
      "As a Magic action, you can expend one use of your Channel Divinity to manifest your magical knowledge. Choose one spell from the Divination school on the Knowledge Domain Spells table that you have prepared. As part of that action, you cast that s...",
    source: "Forgotten Realms: Heroes of Faerûn, Cleric: Knowledge Domain",
  },

  unfetteredMind: {
    id: "embers:cleric:knowledge-domain:unfettered-mind",
    name: "Unfettered Mind",
    kind: "class_feature",
    status: "verified",
    classes: ["cleric"],
    subclass: "knowledgeDomain",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Unfettered Mind",
        description:
          "You gain telepathy out to 60 feet. When you use this telepathy, you can simultaneously contact a number of creatures equal to your Wisdom modifier (minimum of one).\n\nAdditionally, you gain proficiency in Intelligence saving throws. If you already have this proficiency, you instead gain saving throw proficiency with one ability in which you lack it.",
      },
    ],
    description:
      "You gain telepathy out to 60 feet. When you use this telepathy, you can simultaneously contact a number of creatures equal to your Wisdom modifier (minimum of one).\n\nAdditionally, you gain proficiency in Intelligence saving throws. If you already ...",
    source: "Forgotten Realms: Heroes of Faerûn, Cleric: Knowledge Domain",
  },

  divineForeknowledge: {
    id: "embers:cleric:knowledge-domain:divine-foreknowledge",
    name: "Divine Foreknowledge",
    kind: "class_feature",
    status: "verified",
    classes: ["cleric"],
    subclass: "knowledgeDomain",
    activationType: "bonus",
    resource: {
      name: "Divine Foreknowledge",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Divine Foreknowledge",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Divine Foreknowledge",
        description:
          "As a Bonus Action, you magically expand your mind to the future. For 1 hour, you have Advantage on D20 Tests. Once you use this feature, you can’t use it again until you finish a Long Rest. You can also restore your use of this feature by expending a level 6+ spell slot (no action required).",
      },
    ],
    description:
      "As a Bonus Action, you magically expand your mind to the future. For 1 hour, you have Advantage on D20 Tests. Once you use this feature, you can’t use it again until you finish a Long Rest. You can also restore your use of this feature by expendin...",
    source: "Forgotten Realms: Heroes of Faerûn, Cleric: Knowledge Domain",
  },
};
