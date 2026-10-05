import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const SANGUINE_THIEF_FORMULAS: Record<string, ManualActionFormula> = {
  spellcasting: {
    id: "embers:rogue:sanguine-thief:spellcasting",
    name: "Spellcasting",
    kind: "class_feature",
    status: "verified",
    classes: ["rogue"],
    subclass: "sanguineThief",
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
          "You have learned to cast Wizard spells, as well as spells from the Sangromancy school. All Sangromancy spells and cantrips are treated as Wizard spells for the purposes of this subclass.\n\nCantrips. You know three cantrips from the Wizard spell list and from the list of Sangromancy spells. Whenever you gain a Rogue level, you can replace one of your cantrips with another Wizard cantrip of your choice.\n\nWhen you reach Rogue level 10, you learn another Wizard cantrip of your choice.\n\nSpell Slots...",
      },
    ],
    description:
      "You have learned to cast Wizard spells, as well as spells from the Sangromancy school. All Sangromancy spells and cantrips are treated as Wizard spells for the purposes of this subclass.\n\nCantrips. You know three cantrips from the Wizard spell lis...",
    source: "Grim Hollow: Player’s Guide, Rogue: Sanguine Thief",
  },

  stolenPower: {
    id: "embers:rogue:sanguine-thief:stolen-power",
    name: "Stolen Power",
    kind: "class_feature",
    status: "verified",
    classes: ["rogue"],
    subclass: "sanguineThief",
    activationType: "special",
    resource: {
      name: "Stolen Power",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Stolen Power",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Stolen Power",
        description:
          "You draw magic from blood. It is represented by your Sangromancy Dice, which fuel powers you have from this subclass. You have a pool of d8s that you can use on Sanguine Thief features. The number of damage dice in the pool equals the number of damage dice as shown in the Sneak Attack column of the Rogue Features table. You can’t have more Sangromancy Dice than the number of damage dice shown in the Sneak Attack column for your level, unless you have Sangromancy Dice from a different source.\n...",
      },
    ],
    description:
      "You draw magic from blood. It is represented by your Sangromancy Dice, which fuel powers you have from this subclass. You have a pool of d8s that you can use on Sanguine Thief features. The number of damage dice in the pool equals the number of da...",
    source: "Grim Hollow: Player’s Guide, Rogue: Sanguine Thief",
  },

  stealBlood: {
    id: "embers:rogue:sanguine-thief:steal-blood",
    name: "Steal Blood",
    kind: "class_feature",
    status: "verified",
    classes: ["rogue"],
    subclass: "sanguineThief",
    activationType: "special",
    resource: {
      name: "Steal Blood",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Steal Blood",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Steal Blood",
        description:
          "When you deal Sneak Attack damage, you can restore 1 Sangromancy Die.\n\nIf you are Bloodied, instead of restoring 1 Sangromancy Die when you deal Sneak Attack damage, you can immediately roll the die and regain a number of Hit Points equal to the roll’s total.\n\nYou can use this feature a number of times equal to your Intelligence modifier (minimum of once). You regain all expended uses when you finish a Long Rest.",
      },
    ],
    description:
      "When you deal Sneak Attack damage, you can restore 1 Sangromancy Die.\n\nIf you are Bloodied, instead of restoring 1 Sangromancy Die when you deal Sneak Attack damage, you can immediately roll the die and regain a number of Hit Points equal to the r...",
    source: "Grim Hollow: Player’s Guide, Rogue: Sanguine Thief",
  },

  bloodyBlades: {
    id: "embers:rogue:sanguine-thief:bloody-blades",
    name: "Bloody Blades",
    kind: "class_feature",
    status: "verified",
    classes: ["rogue"],
    subclass: "sanguineThief",
    activationType: "special",
    resource: {
      name: "Bloody Blades",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Bloody Blades",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Bloody Blades",
        description:
          "When you finish a Long Rest, you can spend up to 2 Hit Dice or Sangromancy Dice to create a number of Daggers equal to the number of dice spent in this way. Each Dagger counts as an Arcane Focus for your Sanguine Thief spells, and you can cast spells with Somatic components even if you wield these weapons in one or both hands.\n\nAdditionally, when you score a Critical Hit with this weapon, you can cause the weapon to deal extra damage to the target. The extra damage is a number of d8s equal to...",
      },
    ],
    description:
      "When you finish a Long Rest, you can spend up to 2 Hit Dice or Sangromancy Dice to create a number of Daggers equal to the number of dice spent in this way. Each Dagger counts as an Arcane Focus for your Sanguine Thief spells, and you can cast spe...",
    source: "Grim Hollow: Player’s Guide, Rogue: Sanguine Thief",
  },

  bloodstitch: {
    id: "embers:rogue:sanguine-thief:bloodstitch",
    name: "Bloodstitch",
    kind: "class_feature",
    status: "verified",
    classes: ["rogue"],
    subclass: "sanguineThief",
    activationType: "action",
    resource: {
      name: "Bloodstitch",
      resetType: "Short or Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Bloodstitch",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Bloodstitch",
        description:
          "As a Magic action, you can spend 3 Hit Dice or Sangromancy Dice to fling a wave of needle-like blood shards. When you do so, each creature of your choice in a 30-foot Emanation originating from you must make a Dexterity saving throw against your spell save DC, taking 3d8 Necrotic damage on a failed save or half as much damage on a successful one. You regain 1 Hit Die or Sangromancy Die (your choice) for each creature reduced to 0 Hit Points by this feature.\n\nOnce you use this feature, you can...",
      },
    ],
    description:
      "As a Magic action, you can spend 3 Hit Dice or Sangromancy Dice to fling a wave of needle-like blood shards. When you do so, each creature of your choice in a 30-foot Emanation originating from you must make a Dexterity saving throw against your s...",
    source: "Grim Hollow: Player’s Guide, Rogue: Sanguine Thief",
  },

  bloodyExit: {
    id: "embers:rogue:sanguine-thief:bloody-exit",
    name: "Bloody Exit",
    kind: "class_feature",
    status: "verified",
    classes: ["rogue"],
    subclass: "sanguineThief",
    activationType: "reaction",
    resource: {
      name: "Bloody Exit",
      resetType: "Short or Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Bloody Exit",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Bloody Exit",
        description:
          "When a creature hits you with an attack roll, you can take a Reaction and spend 5 Hit Dice or Sangromancy Dice to turn into bloody mist. The attack automatically misses you, you can teleport up to 30 feet to an unoccupied space you can see, and you regain your normal form. As part of this Reaction, you can make an attack with a Melee weapon immediately after you teleport. On a hit, this attack deals an extra 5d8 Necrotic damage to the target.\n\nOnce you use this feature, you can’t use it again...",
      },
    ],
    description:
      "When a creature hits you with an attack roll, you can take a Reaction and spend 5 Hit Dice or Sangromancy Dice to turn into bloody mist. The attack automatically misses you, you can teleport up to 30 feet to an unoccupied space you can see, and yo...",
    source: "Grim Hollow: Player’s Guide, Rogue: Sanguine Thief",
  },
};
