import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const ARTILLERIST_FORMULAS: Record<string, ManualActionFormula> = {
  toolsOfTheTrade: {
    id: "embers:artificer:artillerist:tools-of-the-trade",
    name: "Tools of the Trade",
    kind: "class_feature",
    status: "verified",
    classes: ["artificer"],
    subclass: "artillerist",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Tools of the Trade",
        description:
          "You gain the following benefits.\n\nRanged Weaponry. You gain proficiency with Martial Ranged weapons.\n\nTool Proficiency. You gain proficiency with Woodcarver’s Tools. If you already have this proficiency, you gain proficiency with one other type of Artisan’s Tools of your choice.\n\nWand Crafting. When you craft a magic Wand, the amount of time required to craft it is halved.",
      },
    ],
    description:
      "You gain the following benefits.\n\nRanged Weaponry. You gain proficiency with Martial Ranged weapons.\n\nTool Proficiency. You gain proficiency with Woodcarver’s Tools. If you already have this proficiency, you gain proficiency with one other type of...",
    source: "Eberron: Forge of the Artificer, artificer: Artillerist",
  },

  artilleristSpells: {
    id: "embers:artificer:artillerist:artillerist-spells",
    name: "Artillerist Spells",
    kind: "class_feature",
    status: "verified",
    classes: ["artificer"],
    subclass: "artillerist",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Artillerist Spells",
        description:
          "When you reach an Artificer level specified in the Artillerist Spells table, you thereafter always have the listed spells prepared.\n\nArtillerist Spells\nArtificer Level\tSpells\n3\tShield, Thunderwave\n5\tScorching Ray, Shatter\n9\tFireball, Wind Wall\n13\tIce Storm, Wall of Fire\n17\tCone of Cold, Wall of Force",
      },
    ],
    description:
      "When you reach an Artificer level specified in the Artillerist Spells table, you thereafter always have the listed spells prepared.\n\nArtillerist Spells\nArtificer Level\tSpells\n3\tShield, Thunderwave\n5\tScorching Ray, Shatter\n9\tFireball, Wind Wall\n13\t...",
    source: "Eberron: Forge of the Artificer, artificer: Artillerist",
  },

  eldritchCannon: {
    id: "embers:artificer:artillerist:eldritch-cannon",
    name: "Eldritch Cannon",
    kind: "class_feature",
    status: "verified",
    classes: ["artificer"],
    subclass: "artillerist",
    activationType: "action",
    resource: {
      name: "Eldritch Cannon",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Eldritch Cannon",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Eldritch Cannon",
        description:
          "Using Smith’s Tools or Woodcarver’s Tools, you can take a Magic action to create a Small or Tiny Eldritch Cannon in an unoccupied space on a horizontal surface within 5 feet of yourself. The cannon’s game statistics appear below. You determine its appearance, including whether you carry it or not (and your choice of legs or wheels, for the latter). It disappears if it is reduced to 0 Hit Points or after 1 hour. You can dismiss it early as a Magic action.\n\nOnce you create a cannon, you can’t d...",
      },
    ],
    description:
      "Using Smith’s Tools or Woodcarver’s Tools, you can take a Magic action to create a Small or Tiny Eldritch Cannon in an unoccupied space on a horizontal surface within 5 feet of yourself. The cannon’s game statistics appear below. You determine its...",
    source: "Eberron: Forge of the Artificer, artificer: Artillerist",
  },

  eldritchCannon2: {
    id: "embers:artificer:artillerist:eldritch-cannon",
    name: "Eldritch Cannon",
    kind: "class_feature",
    status: "verified",
    classes: ["artificer"],
    subclass: "artillerist",
    activationType: "bonus",
    operations: [
      {
        type: "apply_effect",
        name: "Eldritch Cannon",
        description:
          "Small or Tiny Object\n\nArmor Class: 18 Hit Points: 5 × your Artificer level (casting Mending on the cannon restores 2d6 Hit Points to it)\n\nImmunities: Poison, Psychic\n\nActivate Cannon (Requires You to Be within 60 Feet of the Cannon). As a Bonus Action, you order the cannon to use the Flamethrower, Force Ballista, or Protector option below; you can direct the cannon to move up to 15 feet before or after that option:\n\nFlamethrower. The cannon blasts fire in a 15-foot Cone. Each creature in that...",
      },
    ],
    description:
      "Small or Tiny Object\n\nArmor Class: 18 Hit Points: 5 × your Artificer level (casting Mending on the cannon restores 2d6 Hit Points to it)\n\nImmunities: Poison, Psychic\n\nActivate Cannon (Requires You to Be within 60 Feet of the Cannon). As a Bonus Ac...",
    source: "Eberron: Forge of the Artificer, artificer: Artillerist",
  },

  arcaneFirearm: {
    id: "embers:artificer:artillerist:arcane-firearm",
    name: "Arcane Firearm",
    kind: "class_feature",
    status: "verified",
    classes: ["artificer"],
    subclass: "artillerist",
    activationType: "special",
    resource: {
      name: "Arcane Firearm",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Arcane Firearm",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Arcane Firearm",
        description:
          "When you finish a Long Rest, you can use Woodcarver’s Tools to carve special sigils into a Rod, Staff, Wand, or Martial Ranged weapon and thereby turn it into your Arcane Firearm. The sigils disappear from the object if you later carve them on a different item. The sigils otherwise last indefinitely.\n\nYou can use your Arcane Firearm as a Spellcasting Focus for your Artificer spells. When you cast an Artificer spell through the firearm, roll 1d8, and you gain a bonus to one of the spell’s dama...",
      },
    ],
    description:
      "When you finish a Long Rest, you can use Woodcarver’s Tools to carve special sigils into a Rod, Staff, Wand, or Martial Ranged weapon and thereby turn it into your Arcane Firearm. The sigils disappear from the object if you later carve them on a d...",
    source: "Eberron: Forge of the Artificer, artificer: Artillerist",
  },

  explosiveCannon: {
    id: "embers:artificer:artillerist:explosive-cannon",
    name: "Explosive Cannon",
    kind: "class_feature",
    status: "verified",
    classes: ["artificer"],
    subclass: "artillerist",
    activationType: "reaction",
    operations: [
      {
        type: "apply_effect",
        name: "Explosive Cannon",
        description:
          "Every Eldritch Cannon you create is now more destructive. You gain the following benefits.\n\nDetonate. When your cannon takes damage, you can take a Reaction to command the cannon to detonate if you are within 60 feet of it. Doing so destroys the cannon and forces each creature within 20 feet of it to make a Dexterity saving throw against your spell save DC, taking 3d10 Force damage on a failed save or half as much damage on a successful one.\n\nFirepower. The cannon’s damage rolls and the numbe...",
      },
    ],
    description:
      "Every Eldritch Cannon you create is now more destructive. You gain the following benefits.\n\nDetonate. When your cannon takes damage, you can take a Reaction to command the cannon to detonate if you are within 60 feet of it. Doing so destroys the c...",
    source: "Eberron: Forge of the Artificer, artificer: Artillerist",
  },

  fortifiedPosition: {
    id: "embers:artificer:artillerist:fortified-position",
    name: "Fortified Position",
    kind: "class_feature",
    status: "verified",
    classes: ["artificer"],
    subclass: "artillerist",
    activationType: "bonus",
    resource: {
      name: "Fortified Position",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Fortified Position",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Fortified Position",
        description:
          "You’re a master at forming well-defended emplacements using your Eldritch Cannon. You gain the following benefits.\n\nDouble Firepower. You can now have two cannons at the same time, and you can create two with the same Magic action. (If you expend a spell slot to create the first cannon, you must expend another spell slot to create the second.) You can activate both of them with the same Bonus Action, ordering them to use the same activation option or different ones. You can’t create a third c...",
      },
    ],
    description:
      "You’re a master at forming well-defended emplacements using your Eldritch Cannon. You gain the following benefits.\n\nDouble Firepower. You can now have two cannons at the same time, and you can create two with the same Magic action. (If you expend ...",
    source: "Eberron: Forge of the Artificer, artificer: Artillerist",
  },
};
