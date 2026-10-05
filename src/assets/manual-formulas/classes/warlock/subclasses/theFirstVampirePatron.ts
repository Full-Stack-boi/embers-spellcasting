import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const THE_FIRST_VAMPIRE_PATRON_FORMULAS: Record<
  string,
  ManualActionFormula
> = {
  drainLife: {
    id: "embers:warlock:the-first-vampire-patron:drain-life",
    name: "Drain Life",
    kind: "class_feature",
    status: "verified",
    classes: ["warlock"],
    subclass: "theFirstVampirePatron",
    activationType: "action",
    resource: {
      name: "Drain Life",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Drain Life",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Drain Life",
        description:
          "You gain an innate power to drain life from the living. After you take the Attack or Magic action, you can use a Bonus Action to make an Unarmed Strike. On a hit, the Unarmed Strike deals Necrotic damage equal to 1d6 plus your Charisma modifier instead of its normal damage.\n\nWhen you hit a creature with Drain Life, you can expend a Pact Magic spell slot to deal an extra 1d8 Necrotic damage to the target, plus another 1d8 per level of the spell slot. When you expend a spell slot in this way, y...",
      },
    ],
    description:
      "You gain an innate power to drain life from the living. After you take the Attack or Magic action, you can use a Bonus Action to make an Unarmed Strike. On a hit, the Unarmed Strike deals Necrotic damage equal to 1d6 plus your Charisma modifier in...",
    source: "Grim Hollow: Player’s Guide, Warlock: The First Vampire Patron",
  },

  nocturnalPredator: {
    id: "embers:warlock:the-first-vampire-patron:nocturnal-predator",
    name: "Nocturnal Predator",
    kind: "class_feature",
    status: "verified",
    classes: ["warlock"],
    subclass: "theFirstVampirePatron",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Nocturnal Predator",
        description:
          "As a predator of the night, you have been blessed with enhanced vision in darkness. You have Darkvision with a range of 60 feet. If you already have Darkvision, its range increases by 60 feet.",
      },
    ],
    description:
      "As a predator of the night, you have been blessed with enhanced vision in darkness. You have Darkvision with a range of 60 feet. If you already have Darkvision, its range increases by 60 feet.",
    source: "Grim Hollow: Player’s Guide, Warlock: The First Vampire Patron",
  },

  firstVampireSpells: {
    id: "embers:warlock:the-first-vampire-patron:first-vampire-spells",
    name: "First Vampire Spells",
    kind: "class_feature",
    status: "verified",
    classes: ["warlock"],
    subclass: "theFirstVampirePatron",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "First Vampire Spells",
        description:
          "The magic of your patron ensures you always have certain spells ready; when you reach a Warlock level specified in the First Vampire Spells table, you thereafter always have the listed spells prepared.\n\nFirst Vampire Spells\nWarlock Level\tSpells\n3\tBane, Command, False Life, Fog Cloud\n5\tConjure Animals (bats, rats, or wolves only), Gaseous Form\n7\tDominate Person, Seeming\n9\tLittle Death, Telekinesis",
      },
    ],
    description:
      "The magic of your patron ensures you always have certain spells ready; when you reach a Warlock level specified in the First Vampire Spells table, you thereafter always have the listed spells prepared.\n\nFirst Vampire Spells\nWarlock Level\tSpells\n3\t...",
    source: "Grim Hollow: Player’s Guide, Warlock: The First Vampire Patron",
  },

  creatureOfTheNight: {
    id: "embers:warlock:the-first-vampire-patron:creature-of-the-night",
    name: "Creature of the Night",
    kind: "class_feature",
    status: "verified",
    classes: ["warlock"],
    subclass: "theFirstVampirePatron",
    activationType: "special",
    resource: {
      name: "Creature of the Night",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Creature of the Night",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Creature of the Night",
        description:
          "You always have the Polymorph spell prepared. With this feature, you can cast it only on yourself without expending a spell slot and without Material components to transform into a Bat, Rat, or Wolf.\n\nYour game statistics are replaced by the Beast’s stat block, but you retain your creature type; Hit Points; Hit Point Dice; Intelligence, Wisdom, and Charisma scores; class features; languages; and feats. You also retain your skill and saving throw proficiencies and use your Proficiency Bonus fo...",
      },
    ],
    description:
      "You always have the Polymorph spell prepared. With this feature, you can cast it only on yourself without expending a spell slot and without Material components to transform into a Bat, Rat, or Wolf.\n\nYour game statistics are replaced by the Beast...",
    source: "Grim Hollow: Player’s Guide, Warlock: The First Vampire Patron",
  },

  eldritchAppetite: {
    id: "embers:warlock:the-first-vampire-patron:eldritch-appetite",
    name: "Eldritch Appetite",
    kind: "class_feature",
    status: "verified",
    classes: ["warlock"],
    subclass: "theFirstVampirePatron",
    activationType: "reaction",
    resource: {
      name: "Eldritch Appetite",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Eldritch Appetite",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Eldritch Appetite",
        description:
          "When you reduce an enemy to 0 Hit Points with your Drain Life feature, you can take a Reaction to consume the last of its fleeting mortality. When you do so, you regain one of your expended Pact Magic spell slots.\n\nOnce you use this feature, you can’t use it again until you finish a Long Rest.",
      },
    ],
    description:
      "When you reduce an enemy to 0 Hit Points with your Drain Life feature, you can take a Reaction to consume the last of its fleeting mortality. When you do so, you regain one of your expended Pact Magic spell slots.\n\nOnce you use this feature, you c...",
    source: "Grim Hollow: Player’s Guide, Warlock: The First Vampire Patron",
  },

  eternalNight: {
    id: "embers:warlock:the-first-vampire-patron:eternal-night",
    name: "Eternal Night",
    kind: "class_feature",
    status: "verified",
    classes: ["warlock"],
    subclass: "theFirstVampirePatron",
    activationType: "bonus",
    resource: {
      name: "Eternal Night",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Eternal Night",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Eternal Night",
        description:
          "Your vampire patron grants you a taste of true immortality. You no longer age, and you gain Resistance to Necrotic damage.\n\nAs a Bonus Action, you gain the following benefits for 1 minute:\n\nAt the start of each of your turns, you regain 1d6 Hit Points if you have at least 1 Hit Point and you aren’t in direct sunlight or running water. If you take Radiant damage, you don’t regain Hit Points from this feature at the start of your next turn.\nWhen you use your Drain Life feature, you can deal an ...",
      },
    ],
    description:
      "Your vampire patron grants you a taste of true immortality. You no longer age, and you gain Resistance to Necrotic damage.\n\nAs a Bonus Action, you gain the following benefits for 1 minute:\n\nAt the start of each of your turns, you regain 1d6 Hit Po...",
    source: "Grim Hollow: Player’s Guide, Warlock: The First Vampire Patron",
  },
};
