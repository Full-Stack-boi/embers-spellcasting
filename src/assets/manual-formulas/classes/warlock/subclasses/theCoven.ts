import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const THE_COVEN_FORMULAS: Record<string, ManualActionFormula> = {
  covenSpells: {
    id: "embers:warlock:the-coven:coven-spells",
    name: "Coven Spells",
    kind: "class_feature",
    status: "verified",
    classes: ["warlock"],
    subclass: "theCoven",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Coven Spells",
        description:
          "The magic of your patron ensures you always have certain spells ready; when you reach a Warlock level specified in the Coven Spells table, you thereafter always have the listed spells prepared.\n\nCoven Spells\nWarlock Level\tSpells\n3\tHold Person, Identify, Locate Object, Ray of Sickness\n5\tBestow Curse, Counterspell\n7\tPhantasmal Killer, Polymorph\n9\tDivination, Locate Creature\n17\tContact Other Plane, Scrying",
      },
    ],
    description:
      "The magic of your patron ensures you always have certain spells ready; when you reach a Warlock level specified in the Coven Spells table, you thereafter always have the listed spells prepared.\n\nCoven Spells\nWarlock Level\tSpells\n3\tHold Person, Ide...",
    source: "Grim Hollow: Player’s Guide, Warlock: The Coven",
  },

  hagSEye: {
    id: "embers:warlock:the-coven:hag-s-eye",
    name: "Hag’s Eye",
    kind: "class_feature",
    status: "verified",
    classes: ["warlock"],
    subclass: "theCoven",
    activationType: "special",
    resource: {
      name: "Hag’s Eye",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Hag’s Eye",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Hag’s Eye",
        description:
          "As an agent of a Hag, you have been gifted with a magical item known as a Hag’s Eye. Crafted from a real eye and fitted into a ring, pendant, or other accessory, this item can be used as an Arcane Focus for your Warlock spells. The Hag can see through the eye, and the destruction of the item can cause the Hag actual pain, so any pawn who loses this talisman often invokes the Hag’s ire.\n\nWhile you possess the eye, you can cast Hex a number of times equal to your Charisma modifier (minimum of o...",
      },
    ],
    description:
      "As an agent of a Hag, you have been gifted with a magical item known as a Hag’s Eye. Crafted from a real eye and fitted into a ring, pendant, or other accessory, this item can be used as an Arcane Focus for your Warlock spells. The Hag can see thr...",
    source: "Grim Hollow: Player’s Guide, Warlock: The Coven",
  },

  hagSGuile: {
    id: "embers:warlock:the-coven:hag-s-guile",
    name: "Hag’s Guile",
    kind: "class_feature",
    status: "verified",
    classes: ["warlock"],
    subclass: "theCoven",
    activationType: "reaction",
    resource: {
      name: "Hag’s Guile",
      resetType: "Short or Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Hag’s Guile",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Hag’s Guile",
        description:
          "Hags delight in deceiving and manipulating others, and you gain some of their skill in doing so. You know the Minor Illusion cantrip. If you already know it, you learn a different Warlock cantrip of your choice. The cantrip doesn’t count against your number of cantrips known.\n\nAdditionally, if a creature takes a Study action to examine an illusion you have created, you can take a Reaction to impose Disadvantage on the check.\n\nAlso, the first time a creature takes a Study action to examine an ...",
      },
    ],
    description:
      "Hags delight in deceiving and manipulating others, and you gain some of their skill in doing so. You know the Minor Illusion cantrip. If you already know it, you learn a different Warlock cantrip of your choice. The cantrip doesn’t count against y...",
    source: "Grim Hollow: Player’s Guide, Warlock: The Coven",
  },

  hagSVisage: {
    id: "embers:warlock:the-coven:hag-s-visage",
    name: "Hag’s Visage",
    kind: "class_feature",
    status: "verified",
    classes: ["warlock"],
    subclass: "theCoven",
    activationType: "bonus",
    resource: {
      name: "Hag’s Visage",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Hag’s Visage",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Hag’s Visage",
        description:
          "As a Magic action, you twist your face into a horrifying mask resembling your Hag patron. It lasts for 1 minute, but it ends early if you dismiss it (no action required) or have the Incapacitated condition. While this effect lasts, you gain the benefits listed below.\n\nOnce you use this feature, you can’t use it again until you finish a Long Rest.\n\nHorrifying Gaze. As a Bonus Action, choose one Humanoid that you can see and that can see you within 30 feet of you. The creature must make a Wisdo...",
      },
    ],
    description:
      "As a Magic action, you twist your face into a horrifying mask resembling your Hag patron. It lasts for 1 minute, but it ends early if you dismiss it (no action required) or have the Incapacitated condition. While this effect lasts, you gain the be...",
    source: "Grim Hollow: Player’s Guide, Warlock: The Coven",
  },

  hagSCraft: {
    id: "embers:warlock:the-coven:hag-s-craft",
    name: "Hag’s Craft",
    kind: "class_feature",
    status: "verified",
    classes: ["warlock"],
    subclass: "theCoven",
    activationType: "special",
    resource: {
      name: "Hag’s Craft",
      resetType: "Short or Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Hag’s Craft",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Hag’s Craft",
        description:
          "The Hag imparts the knowledge to craft two magic items. You can temporarily turn a normal vessel into a Hag's Cauldron by expending a spell slot. This magical cauldron lasts for 10 minutes. During that time, you can take the Magic to pour out three Common, two Uncommon, or one Rare potion. The potions lose efficacy at the end of your next Short or Long Rest. You regain this ability at the end of a Long Rest.\n\nAdditionally, when you finish a Long Rest, you can expend a spell slot and imbue a g...",
      },
    ],
    description:
      "The Hag imparts the knowledge to craft two magic items. You can temporarily turn a normal vessel into a Hag's Cauldron by expending a spell slot. This magical cauldron lasts for 10 minutes. During that time, you can take the Magic to pour out thre...",
    source: "Grim Hollow: Player’s Guide, Warlock: The Coven",
  },
};
