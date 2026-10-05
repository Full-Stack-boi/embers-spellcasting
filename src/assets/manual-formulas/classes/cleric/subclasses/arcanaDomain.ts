import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const ARCANA_DOMAIN_FORMULAS: Record<string, ManualActionFormula> = {
  arcanaDomainSpells: {
    id: "embers:cleric:arcana-domain:arcana-domain-spells",
    name: "Arcana Domain Spells",
    kind: "class_feature",
    status: "verified",
    classes: ["cleric"],
    subclass: "arcanaDomain",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Arcana Domain Spells",
        description:
          "Your connection to this divine domain means you always have certain spells ready. When you reach a Cleric level specified in the Arcana Domain Spells table, you thereafter always have the listed spells prepared.\n\nArcana Domain Spells\nCleric Level\tPrepared Spells\n3\tDetect Magic, Magic Missile, Magic Weapon, Nystul’s Magic Aura\n5\tCounterspell, Dispel Magic\n7\tArcane Eye, Leomund’s Secret Chest\n9\tBigby’s Hand, Teleportation Circle",
      },
    ],
    description:
      "Your connection to this divine domain means you always have certain spells ready. When you reach a Cleric level specified in the Arcana Domain Spells table, you thereafter always have the listed spells prepared.\n\nArcana Domain Spells\nCleric Level\t...",
    source: "Arcana Unleashed, Cleric: Arcana Domain",
  },

  modifyMagic: {
    id: "embers:cleric:arcana-domain:modify-magic",
    name: "Modify Magic",
    kind: "class_feature",
    status: "verified",
    classes: ["cleric"],
    subclass: "arcanaDomain",
    activationType: "special",
    resource: {
      name: "Modify Magic",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Modify Magic",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Modify Magic",
        description:
          "You can use your Channel Divinity to alter your spells as you cast them. When you cast a spell, you can expend one use of your Channel Divinity and change the spell in one of the following ways (no action required).\n\nFortifying Spell. One target of the spell gains a number of Temporary Hit Points equal to 2d8 plus your Cleric level.\n\nTenacious Spell. When you cast a spell that forces a creature to make a saving throw, and a creature you can see succeeds on that saving throw, roll 1d6 and subt...",
      },
    ],
    description:
      "You can use your Channel Divinity to alter your spells as you cast them. When you cast a spell, you can expend one use of your Channel Divinity and change the spell in one of the following ways (no action required).\n\nFortifying Spell. One target o...",
    source: "Arcana Unleashed, Cleric: Arcana Domain",
  },

  studentOfArcana: {
    id: "embers:cleric:arcana-domain:student-of-arcana",
    name: "Student of Arcana",
    kind: "class_feature",
    status: "verified",
    classes: ["cleric"],
    subclass: "arcanaDomain",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Student of Arcana",
        description:
          "You gain the following benefits.\n\nMagical Knowledge. You gain proficiency in the Arcana skill or one skill of your choice from the skills available to Clerics at level 1.\n\nCantrips. You learn two Wizard cantrips of your choice. Whenever you gain a Cleric level, you can replace one of these cantrips with another Wizard cantrip.\n\nMagic and the divine are naturally in harmony, like colors in a beautiful cosmic painting.",
      },
    ],
    description:
      "You gain the following benefits.\n\nMagical Knowledge. You gain proficiency in the Arcana skill or one skill of your choice from the skills available to Clerics at level 1.\n\nCantrips. You learn two Wizard cantrips of your choice. Whenever you gain a...",
    source: "Arcana Unleashed, Cleric: Arcana Domain",
  },

  dispellingRecovery: {
    id: "embers:cleric:arcana-domain:dispelling-recovery",
    name: "Dispelling Recovery",
    kind: "class_feature",
    status: "verified",
    classes: ["cleric"],
    subclass: "arcanaDomain",
    activationType: "bonus",
    resource: {
      name: "Dispelling Recovery",
      resetType: "Short or Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Dispelling Recovery",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Dispelling Recovery",
        description:
          "Immediately after you cast a spell with a spell slot that restores Hit Points to a creature or ends a condition on a creature, you can cast Dispel Magic as part of that action, Bonus Action, or Reaction, and without expending a spell slot.\n\nOnce you use this feature, you can’t use it again until you finish a Short or Long Rest. You also restore your use of it by expending one use of Channel Divinity (no action required).",
      },
    ],
    description:
      "Immediately after you cast a spell with a spell slot that restores Hit Points to a creature or ends a condition on a creature, you can cast Dispel Magic as part of that action, Bonus Action, or Reaction, and without expending a spell slot.\n\nOnce y...",
    source: "Arcana Unleashed, Cleric: Arcana Domain",
  },

  magicalMastery: {
    id: "embers:cleric:arcana-domain:magical-mastery",
    name: "Magical Mastery",
    kind: "class_feature",
    status: "verified",
    classes: ["cleric"],
    subclass: "arcanaDomain",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Magical Mastery",
        description:
          "You learn four Wizard spells, one from each of levels 6, 7, 8, and 9. You thereafter always have those spells prepared. Whenever you gain a Cleric level, you can replace one of these spells with another Wizard spell of the same level.",
      },
    ],
    description:
      "You learn four Wizard spells, one from each of levels 6, 7, 8, and 9. You thereafter always have those spells prepared. Whenever you gain a Cleric level, you can replace one of these spells with another Wizard spell of the same level.",
    source: "Arcana Unleashed, Cleric: Arcana Domain",
  },
};
