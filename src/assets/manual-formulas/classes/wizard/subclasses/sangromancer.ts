import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const SANGROMANCER_FORMULAS: Record<string, ManualActionFormula> = {
  sangromancySavant: {
    id: "embers:wizard:sangromancer:sangromancy-savant",
    name: "Sangromancy Savant",
    kind: "class_feature",
    status: "verified",
    classes: ["wizard"],
    subclass: "sangromancer",
    activationType: "special",
    resource: {
      name: "Sangromancy Savant",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Sangromancy Savant",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Sangromancy Savant",
        description:
          "Sangromancy spells count as Wizard spells for you. Choose two Sangromancy spells, each of which must be no higher than level 2, and add them to your spellbook for free.\n\nIn addition, whenever you gain access to a new level of spell slots in this class, you can add one Sangromancy spell to your spellbook for free. The chosen spell must be of a level for which you have spell slots.",
      },
    ],
    description:
      "Sangromancy spells count as Wizard spells for you. Choose two Sangromancy spells, each of which must be no higher than level 2, and add them to your spellbook for free.\n\nIn addition, whenever you gain access to a new level of spell slots in this c...",
    source: "Grim Hollow: Player’s Guide, Wizard: Sangromancer",
  },

  fullBlooded: {
    id: "embers:wizard:sangromancer:full-blooded",
    name: "Full-Blooded",
    kind: "class_feature",
    status: "verified",
    classes: ["wizard"],
    subclass: "sangromancer",
    activationType: "special",
    resource: {
      name: "Full-Blooded",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Full-Blooded",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Full-Blooded",
        description:
          "You draw magic from blood. It is represented by your Sangromancy Dice, which fuel powers you have from this subclass. You have a pool of d12s that you can expend instead of a Hit Die when you cast Sangromancy spells. The number of dice in the pool equals 1 plus your Wizard level. You regain one expended Sangromancy Die when you finish a Short Rest, and you regain all expended Sangromancy Dice when you finish a Long Rest.",
      },
    ],
    description:
      "You draw magic from blood. It is represented by your Sangromancy Dice, which fuel powers you have from this subclass. You have a pool of d12s that you can expend instead of a Hit Die when you cast Sangromancy spells. The number of dice in the pool...",
    source: "Grim Hollow: Player’s Guide, Wizard: Sangromancer",
  },

  sanguineVigor: {
    id: "embers:wizard:sangromancer:sanguine-vigor",
    name: "Sanguine Vigor",
    kind: "class_feature",
    status: "verified",
    classes: ["wizard"],
    subclass: "sangromancer",
    activationType: "special",
    resource: {
      name: "Sanguine Vigor",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Sanguine Vigor",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Sanguine Vigor",
        description:
          "Your Hit Point maximum increases by 6, and it increases by 1 whenever you gain another Wizard level. In addition, whenever you cast a Sangromancy spell with a spell slot, you regain Hit Points equal to the level of the spell slot.",
      },
    ],
    description:
      "Your Hit Point maximum increases by 6, and it increases by 1 whenever you gain another Wizard level. In addition, whenever you cast a Sangromancy spell with a spell slot, you regain Hit Points equal to the level of the spell slot.",
    source: "Grim Hollow: Player’s Guide, Wizard: Sangromancer",
  },

  bloodForBlood: {
    id: "embers:wizard:sangromancer:blood-for-blood",
    name: "Blood for Blood",
    kind: "class_feature",
    status: "verified",
    classes: ["wizard"],
    subclass: "sangromancer",
    activationType: "special",
    resource: {
      name: "Blood for Blood",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Blood for Blood",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Blood for Blood",
        description:
          "Once on each of your turns when you deal damage to one or more creatures with a Wizard spell you cast, you can spend a Hit Point Die or a Sangromancy Die, roll the die, and deal extra damage to one of those creatures equal to the roll. If the creature is Bloodied, you can roll twice and use the higher of the two rolls.",
      },
    ],
    description:
      "Once on each of your turns when you deal damage to one or more creatures with a Wizard spell you cast, you can spend a Hit Point Die or a Sangromancy Die, roll the die, and deal extra damage to one of those creatures equal to the roll. If the crea...",
    source: "Grim Hollow: Player’s Guide, Wizard: Sangromancer",
  },

  redRenewal: {
    id: "embers:wizard:sangromancer:red-renewal",
    name: "Red Renewal",
    kind: "class_feature",
    status: "verified",
    classes: ["wizard"],
    subclass: "sangromancer",
    activationType: "special",
    resource: {
      name: "Red Renewal",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Red Renewal",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Red Renewal",
        description:
          "When you finish a Short Rest, you regain expended Hit Point Dice and Sangromancy Dice equal to half your Wizard level.\n\nOnce you use this feature, you can’t use it again until you finish a Long Rest.\n\nRemember, you only have so much blood to use. Your opponents, on the other hand…\n\n—The Red Book of Sangromancy",
      },
    ],
    description:
      "When you finish a Short Rest, you regain expended Hit Point Dice and Sangromancy Dice equal to half your Wizard level.\n\nOnce you use this feature, you can’t use it again until you finish a Long Rest.\n\nRemember, you only have so much blood to use. ...",
    source: "Grim Hollow: Player’s Guide, Wizard: Sangromancer",
  },
};
