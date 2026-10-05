import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const SCION_OF_THE_THREE_FORMULAS: Record<string, ManualActionFormula> =
  {
    bloodthirst: {
      id: "embers:rogue:scion-of-the-three:bloodthirst",
      name: "Bloodthirst",
      kind: "class_feature",
      status: "verified",
      classes: ["rogue"],
      subclass: "scionOfTheThree",
      activationType: "reaction",
      resource: {
        name: "Bloodthirst",
        resetType: "Long Rest",
      },
      operations: [
        {
          type: "resource_cost",
          resource: "Bloodthirst",
          amount: 1,
        },
        {
          type: "apply_effect",
          name: "Bloodthirst",
          description:
            "When an enemy you can see within 30 feet of yourself takes damage and is Bloodied after taking that damage but not killed outright, you can take a Reaction and teleport to an unoccupied space you can see within 5 feet of that enemy. You can then make one melee attack. You can use this feature a number of times equal to your Intelligence modifier (minimum of once), and you regain all expended uses when you finish a Long Rest.",
        },
      ],
      description:
        "When an enemy you can see within 30 feet of yourself takes damage and is Bloodied after taking that damage but not killed outright, you can take a Reaction and teleport to an unoccupied space you can see within 5 feet of that enemy. You can then m...",
      source: "Forgotten Realms: Heroes of Faerûn, Rogue: Scion of the Three",
    },

    dreadAllegiance: {
      id: "embers:rogue:scion-of-the-three:dread-allegiance",
      name: "Dread Allegiance",
      kind: "class_feature",
      status: "verified",
      classes: ["rogue"],
      subclass: "scionOfTheThree",
      activationType: "special",
      resource: {
        name: "Dread Allegiance",
        resetType: "Long Rest",
      },
      operations: [
        {
          type: "resource_cost",
          resource: "Dread Allegiance",
          amount: 1,
        },
        {
          type: "apply_effect",
          name: "Dread Allegiance",
          description:
            "Choose one of the Dead Three: Bane, Bhaal, or Myrkul. You gain Resistance to one type of damage and the ability to cast a cantrip, as detailed in the table below; Intelligence is your spellcasting ability for this cantrip. When you finish a Long Rest, you can change your choice.\n\nGod\tDamage Resistance\tCantrip\nBane\tPsychic\tMinor Illusion\nBhaal\tPoison\tBlade Ward\nMyrkul\tNecrotic\tChill Touch",
        },
      ],
      description:
        "Choose one of the Dead Three: Bane, Bhaal, or Myrkul. You gain Resistance to one type of damage and the ability to cast a cantrip, as detailed in the table below; Intelligence is your spellcasting ability for this cantrip. When you finish a Long R...",
      source: "Forgotten Realms: Heroes of Faerûn, Rogue: Scion of the Three",
    },

    strikeFear: {
      id: "embers:rogue:scion-of-the-three:strike-fear",
      name: "Strike Fear",
      kind: "class_feature",
      status: "verified",
      classes: ["rogue"],
      subclass: "scionOfTheThree",
      activationType: "special",
      operations: [
        {
          type: "apply_effect",
          name: "Strike Fear",
          description:
            "You gain the following Cunning Strike option.\n\nTerrify (Cost: 1d6). The target must succeed on a Wisdom saving throw, or it has the Frightened condition for 1 minute. While the target is Frightened in this way, you have Advantage on attack rolls against the target.\n\nThe Frightened target repeats the save at the end of each of its turns, ending the effect on itself on a success.",
        },
      ],
      description:
        "You gain the following Cunning Strike option.\n\nTerrify (Cost: 1d6). The target must succeed on a Wisdom saving throw, or it has the Frightened condition for 1 minute. While the target is Frightened in this way, you have Advantage on attack rolls a...",
      source: "Forgotten Realms: Heroes of Faerûn, Rogue: Scion of the Three",
    },

    auraOfMalevolence: {
      id: "embers:rogue:scion-of-the-three:aura-of-malevolence",
      name: "Aura of Malevolence",
      kind: "class_feature",
      status: "verified",
      classes: ["rogue"],
      subclass: "scionOfTheThree",
      activationType: "special",
      operations: [
        {
          type: "apply_effect",
          name: "Aura of Malevolence",
          description:
            "You radiate malignant power associated with one of the Dead Three. When you use Bloodthirst and teleport, each creature of your choice within 10 feet of either the space you left or your destination space (your choice) takes damage equal to your Intelligence modifier; the damage type is the same as the damage Resistance granted by your choice in the Dread Allegiance feature. Damage dealt by this feature ignores Resistance.",
        },
      ],
      description:
        "You radiate malignant power associated with one of the Dead Three. When you use Bloodthirst and teleport, each creature of your choice within 10 feet of either the space you left or your destination space (your choice) takes damage equal to your I...",
      source: "Forgotten Realms: Heroes of Faerûn, Rogue: Scion of the Three",
    },

    dreadIncarnate: {
      id: "embers:rogue:scion-of-the-three:dread-incarnate",
      name: "Dread Incarnate",
      kind: "class_feature",
      status: "verified",
      classes: ["rogue"],
      subclass: "scionOfTheThree",
      activationType: "special",
      resource: {
        name: "Dread Incarnate",
        resetType: "Short or Long Rest",
      },
      operations: [
        {
          type: "resource_cost",
          resource: "Dread Incarnate",
          amount: 1,
        },
        {
          type: "apply_effect",
          name: "Dread Incarnate",
          description:
            "You gain the following benefits.\n\nCutthroat. You regain one expended use of Bloodthirst when you finish a Short Rest.\n\nMurderous Intent. When you roll for your Sneak Attack damage, you can treat a roll of a 1 or 2 on the die as a 3.",
        },
      ],
      description:
        "You gain the following benefits.\n\nCutthroat. You regain one expended use of Bloodthirst when you finish a Short Rest.\n\nMurderous Intent. When you roll for your Sneak Attack damage, you can treat a roll of a 1 or 2 on the die as a 3.",
      source: "Forgotten Realms: Heroes of Faerûn, Rogue: Scion of the Three",
    },
  };
