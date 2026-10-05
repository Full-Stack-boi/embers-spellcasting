import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const OCCULTIST_GUILD_FORMULAS: Record<string, ManualActionFormula> = {
  acolyteOfTheOccult: {
    id: "embers:monster-hunter:occultist-guild:acolyte-of-the-occult",
    name: "Acolyte of the Occult",
    kind: "class_feature",
    status: "verified",
    classes: ["monster-hunter"],
    subclass: "occultistGuild",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Acolyte of the Occult",
        description: "You gain proficiency in the Arcana skill.",
      },
    ],
    description: "You gain proficiency in the Arcana skill.",
    source: "Grim Hollow: Player’s Guide, monster-hunter: Occultist Guild",
  },

  spellcasting: {
    id: "embers:monster-hunter:occultist-guild:spellcasting",
    name: "Spellcasting",
    kind: "class_feature",
    status: "verified",
    classes: ["monster-hunter"],
    subclass: "occultistGuild",
    activationType: "special",
    resource: {
      name: "Spellcasting",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Spellcasting",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Spellcasting",
        description:
          "Your study of the occult gives you the ability to cast spells.\n\nCantrips. You learn two cantrips of your choice from the Wizard spell list. Whenever you gain a Monster Hunter level, you can replace one of these cantrips with another of your choice from the Wizard spell list.\n\nWhen you reach Monster Hunter level 10, you learn another Wizard cantrip of your choice.\n\nSpell Slots. The Occultist Spellcasting table shows how many spell slots you have to cast your level 1+ spells. You regain all exp...",
      },
    ],
    description:
      "Your study of the occult gives you the ability to cast spells.\n\nCantrips. You learn two cantrips of your choice from the Wizard spell list. Whenever you gain a Monster Hunter level, you can replace one of these cantrips with another of your choice...",
    source: "Grim Hollow: Player’s Guide, monster-hunter: Occultist Guild",
  },

  arcaneInterference: {
    id: "embers:monster-hunter:occultist-guild:arcane-interference",
    name: "Arcane Interference",
    kind: "class_feature",
    status: "verified",
    classes: ["monster-hunter"],
    subclass: "occultistGuild",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Arcane Interference",
        description:
          "You have Advantage on saving throws against spells cast by creature types in your Monster Grimoire. Additionally, when a creature you can see within 60 feet of you casts a spell or makes a spell attack, you can use Studied Response against that creature before the spell is cast.",
      },
    ],
    description:
      "You have Advantage on saving throws against spells cast by creature types in your Monster Grimoire. Additionally, when a creature you can see within 60 feet of you casts a spell or makes a spell attack, you can use Studied Response against that cr...",
    source: "Grim Hollow: Player’s Guide, monster-hunter: Occultist Guild",
  },

  mageHunter: {
    id: "embers:monster-hunter:occultist-guild:mage-hunter",
    name: "Mage Hunter",
    kind: "class_feature",
    status: "verified",
    classes: ["monster-hunter"],
    subclass: "occultistGuild",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Mage Hunter",
        description:
          "You consider Humanoids that can cast spells as being a creature type in your Monster Grimoire.\n\nAdditionally, when you damage a creature type in your Monster Grimoire that is concentrating, it has Disadvantage on the saving throw it makes to maintain its Concentration.\n\nSay what you will about their methods. The results speak for themselves.\n\n—Arcanist Inquisitor",
      },
    ],
    description:
      "You consider Humanoids that can cast spells as being a creature type in your Monster Grimoire.\n\nAdditionally, when you damage a creature type in your Monster Grimoire that is concentrating, it has Disadvantage on the saving throw it makes to maint...",
    source: "Grim Hollow: Player’s Guide, monster-hunter: Occultist Guild",
  },

  occultKnowledge: {
    id: "embers:monster-hunter:occultist-guild:occult-knowledge",
    name: "Occult Knowledge",
    kind: "class_feature",
    status: "verified",
    classes: ["monster-hunter"],
    subclass: "occultistGuild",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Occult Knowledge",
        description:
          "Your knowledge of magic has increased so that you learn to cast Rituals. You can cast any spell as a Ritual if that spell has the Ritual tag and it’s a spell you have prepared.\n\nIn addition, you learn two spells of your choice. These spells can come from the Cleric, Druid, or Wizard spell list or any combination thereof (see a class’s section for its spell list). A spell you choose must have the Ritual tag.\n\nWhen you reach Monster Hunter level 14, you can replace one of the spells you know fr...",
      },
    ],
    description:
      "Your knowledge of magic has increased so that you learn to cast Rituals. You can cast any spell as a Ritual if that spell has the Ritual tag and it’s a spell you have prepared.\n\nIn addition, you learn two spells of your choice. These spells can co...",
    source: "Grim Hollow: Player’s Guide, monster-hunter: Occultist Guild",
  },

  magicalAegis: {
    id: "embers:monster-hunter:occultist-guild:magical-aegis",
    name: "Magical Aegis",
    kind: "class_feature",
    status: "verified",
    classes: ["monster-hunter"],
    subclass: "occultistGuild",
    activationType: "special",
    resource: {
      name: "Magical Aegis",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Magical Aegis",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Magical Aegis",
        description:
          "You gain the ability to extend a protective charm. You radiate an unseeable aura in a 20-foot Emanation that originates from you. The aura is inactive while you have the Incapacitated condition. You and allies in your aura have Advantage on saving throws against spells cast by creature types in your Monster Grimoire.\n\nAdditionally, you always have the Counterspell spell prepared. You can cast Counterspell once without expending a spell slot. Once you cast the spell with this feature, you can’...",
      },
    ],
    description:
      "You gain the ability to extend a protective charm. You radiate an unseeable aura in a 20-foot Emanation that originates from you. The aura is inactive while you have the Incapacitated condition. You and allies in your aura have Advantage on saving...",
    source: "Grim Hollow: Player’s Guide, monster-hunter: Occultist Guild",
  },

  arcaneResponse: {
    id: "embers:monster-hunter:occultist-guild:arcane-response",
    name: "Arcane Response",
    kind: "class_feature",
    status: "verified",
    classes: ["monster-hunter"],
    subclass: "occultistGuild",
    activationType: "special",
    resource: {
      name: "Arcane Response",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Arcane Response",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Arcane Response",
        description:
          "You have learned to anticipate your enemies well enough to rapidly cast spells in response to their attacks. When you use Studied Response, you can cast a spell. The spell must have a casting time of an action and must target only that creature.\n\nOccultist Spellcasting\nLevel\tCantrips Known\tPrepared Spells\tSpell Slots per Spell Level\n\t\t\t1\t2\t3\t4\n3\t2\t3\t2\t-\t-\t-\n4\t2\t4\t3\t-\t-\t-\n5\t2\t4\t3\t-\t-\t-\n6\t2\t4\t3\t-\t-\t-\n7\t2\t5\t4\t2\t-\t-\n8\t2\t6\t4\t2\t-\t-\n9\t2\t6\t4\t2\t-\t-\n10\t3\t7\t4\t3\t-\t-\n11\t3\t8\t4\t3\t-\t-\n12\t3\t8\t4\t3\t-\t-\n13\t3\t9\t4...",
      },
    ],
    description:
      "You have learned to anticipate your enemies well enough to rapidly cast spells in response to their attacks. When you use Studied Response, you can cast a spell. The spell must have a casting time of an action and must target only that creature.\n\n...",
    source: "Grim Hollow: Player’s Guide, monster-hunter: Occultist Guild",
  },
};
