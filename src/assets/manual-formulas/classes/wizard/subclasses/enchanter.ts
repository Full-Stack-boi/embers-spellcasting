import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const ENCHANTER_FORMULAS: Record<string, ManualActionFormula> = {
  enchantingConversationalist: {
    id: "embers:wizard:enchanter:enchanting-conversationalist",
    name: "Enchanting Conversationalist",
    kind: "class_feature",
    status: "verified",
    classes: ["wizard"],
    subclass: "enchanter",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Enchanting Conversationalist",
        description:
          "You gain proficiency in one of the following skills of your choice: Deception, Intimidation, or Persuasion.\n\nIn addition, when you make an ability check with the chosen skill, you gain a bonus to the check equal to your Intelligence modifier (minimum of +1).",
      },
    ],
    description:
      "You gain proficiency in one of the following skills of your choice: Deception, Intimidation, or Persuasion.\n\nIn addition, when you make an ability check with the chosen skill, you gain a bonus to the check equal to your Intelligence modifier (mini...",
    source: "Arcana Unleashed, Wizard: Enchanter",
  },

  enchantmentSavant: {
    id: "embers:wizard:enchanter:enchantment-savant",
    name: "Enchantment Savant",
    kind: "class_feature",
    status: "verified",
    classes: ["wizard"],
    subclass: "enchanter",
    activationType: "special",
    resource: {
      name: "Enchantment Savant",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Enchantment Savant",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Enchantment Savant",
        description:
          "Choose two Wizard spells from the Enchantment school, each of which must be no higher than level 2, and add them to your spellbook for free.\n\nIn addition, whenever you gain access to a new level of spell slots in this class, you can add one Wizard spell from the Enchantment school to your spellbook for free. The chosen spell must be of a level for which you have spell slots.\n\nMinds can be molded like clay when magic is involved. Take care you don’t abuse this power.",
      },
    ],
    description:
      "Choose two Wizard spells from the Enchantment school, each of which must be no higher than level 2, and add them to your spellbook for free.\n\nIn addition, whenever you gain access to a new level of spell slots in this class, you can add one Wizard...",
    source: "Arcana Unleashed, Wizard: Enchanter",
  },

  hypnoticPresence: {
    id: "embers:wizard:enchanter:hypnotic-presence",
    name: "Hypnotic Presence",
    kind: "class_feature",
    status: "verified",
    classes: ["wizard"],
    subclass: "enchanter",
    activationType: "action",
    resource: {
      name: "Hypnotic Presence",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Hypnotic Presence",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Hypnotic Presence",
        description:
          "Your charming words and enchanting gaze can enthrall another creature. As a Magic action, choose one creature that you can see within 10 feet of yourself. If the target can see or hear you, it must succeed on a Wisdom saving throw against your spell save DC or have the Charmed condition for 1 minute or until the target is more than 10 feet away from you, the target can neither see nor hear you, or the target takes damage. While Charmed, the target has the Incapacitated condition and a Speed o...",
      },
    ],
    description:
      "Your charming words and enchanting gaze can enthrall another creature. As a Magic action, choose one creature that you can see within 10 feet of yourself. If the target can see or hear you, it must succeed on a Wisdom saving throw against your spe...",
    source: "Arcana Unleashed, Wizard: Enchanter",
  },

  splitEnchantment: {
    id: "embers:wizard:enchanter:split-enchantment",
    name: "Split Enchantment",
    kind: "class_feature",
    status: "verified",
    classes: ["wizard"],
    subclass: "enchanter",
    activationType: "special",
    resource: {
      name: "Split Enchantment",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Split Enchantment",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Split Enchantment",
        description:
          "When you use a spell slot to cast an Enchantment spell, such as Charm Person, that can be cast with a higher-level spell slot to target an additional creature, you can increase the spell’s effective level by 1.\n\nYou can use this feature a number of times equal to your Intelligence modifier, and you regain all expended uses when you finish a Long Rest.",
      },
    ],
    description:
      "When you use a spell slot to cast an Enchantment spell, such as Charm Person, that can be cast with a higher-level spell slot to target an additional creature, you can increase the spell’s effective level by 1.\n\nYou can use this feature a number o...",
    source: "Arcana Unleashed, Wizard: Enchanter",
  },

  instinctiveCharm: {
    id: "embers:wizard:enchanter:instinctive-charm",
    name: "Instinctive Charm",
    kind: "class_feature",
    status: "verified",
    classes: ["wizard"],
    subclass: "enchanter",
    activationType: "reaction",
    resource: {
      name: "Instinctive Charm",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Instinctive Charm",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Instinctive Charm",
        description:
          "When a creature within 30 feet of you that you can see hits you with an attack roll, you can take a Reaction to force the attacker to make a Wisdom saving throw against your spell save DC. On a failed save, the attack misses instead, and if there is another creature within range of the attack other than the attacker, the attacker targets that creature with the triggering attack, using the same attack roll. If multiple creatures are within the attack’s range, you choose which one to target.\n\nO...",
      },
    ],
    description:
      "When a creature within 30 feet of you that you can see hits you with an attack roll, you can take a Reaction to force the attacker to make a Wisdom saving throw against your spell save DC. On a failed save, the attack misses instead, and if there ...",
    source: "Arcana Unleashed, Wizard: Enchanter",
  },

  alterMemories: {
    id: "embers:wizard:enchanter:alter-memories",
    name: "Alter Memories",
    kind: "class_feature",
    status: "verified",
    classes: ["wizard"],
    subclass: "enchanter",
    activationType: "action",
    resource: {
      name: "Alter Memories",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Alter Memories",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Alter Memories",
        description:
          "You can make a creature unaware of your magical influence. When you cast an Enchantment spell that imposes the Charmed condition using a spell slot, you can choose one creature targeted by the spell. That creature remains unaware of being Charmed by you.\n\nIn addition, once before the spell ends, you can take a Magic action to force the chosen creature to make an Intelligence saving throw against your spell save DC. On a failed save, you can make the creature lose a number of hours of its memo...",
      },
    ],
    description:
      "You can make a creature unaware of your magical influence. When you cast an Enchantment spell that imposes the Charmed condition using a spell slot, you can choose one creature targeted by the spell. That creature remains unaware of being Charmed ...",
    source: "Arcana Unleashed, Wizard: Enchanter",
  },
};
