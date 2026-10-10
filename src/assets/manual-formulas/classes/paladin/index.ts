import type {
  ManualActionFormula,
  FeatureActionOption,
} from "../../../../types/manualFormula";
import { OATH_OF_DEVOTION_FORMULAS } from "./subclasses/oathOfDevotion";
import { OATH_OF_GLORY_FORMULAS } from "./subclasses/oathOfGlory";
import { OATH_OF_PESTILENCE_FORMULAS } from "./subclasses/oathOfPestilence";
import { OATH_OF_SLAUGHTER_FORMULAS } from "./subclasses/oathOfSlaughter";
import { OATH_OF_THE_ANCIENTS_FORMULAS } from "./subclasses/oathOfTheAncients";
import { OATH_OF_THE_NOBLE_GENIES_FORMULAS } from "./subclasses/oathOfTheNobleGenies";
import { OATH_OF_VENGEANCE_FORMULAS } from "./subclasses/oathOfVengeance";
import { OATH_OF_ZEAL_FORMULAS } from "./subclasses/oathOfZeal";

const LAY_ON_HANDS_OPTIONS: FeatureActionOption[] = [
  {
    id: "heal_hp",
    name: "Heal Hit Points",
    cost: 1,
    desc: "Bonus Action: restore 1 HP per point spent from your healing pool",
    actionType: "bonus",
  },
  {
    id: "neutralize_poison",
    name: "Purify Ailment",
    cost: 5,
    desc: "Bonus Action: expend 5 HP from pool to cure target of Poisoned condition",
    actionType: "bonus",
  },
];

export const PALADIN_CLASS_FORMULAS: Record<string, ManualActionFormula> = {
  layOnHands: {
    id: "embers:paladin:lay-on-hands",
    name: "Lay on Hands",
    kind: "class_feature",
    status: "verified",
    classes: ["paladin"],
    activationType: "bonus",
    flyoutType: "options_grid",
    options: LAY_ON_HANDS_OPTIONS,
    resource: {
      name: "Lay on Hands Pool",
      resetType: "Long Rest",
      scaling: {
        type: "class_level",
        classId: "paladin",
        multiplier: 5,
      },
    },
    operations: [
      {
        type: "apply_effect",
        name: "Healing and Purification",
        description:
          "Bonus Action touch a creature and restore HP from pool (5x Paladin level), or expend 5 HP to remove the Poisoned condition.",
      },
    ],
    description: "Blessed touch that restores vitality and cleanses poisons.",
    source: "Player's Handbook (2024), Paladin: Lay on Hands",
  },
  radiantStrikes: {
    id: "embers:paladin:radiant-strikes",
    name: "Radiant Strikes",
    kind: "class_feature",
    status: "verified",
    classes: ["paladin"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Radiant Strikes",
        description:
          "Whenever you hit with a melee weapon, deal an extra 1d6 Radiant damage.",
      },
    ],
    weaponRider: {
      type: "weapon_damage_rider",
      id: "radiant-strikes",
      name: "Radiant Strikes",
      classId: "paladin",
      minLevel: 11,
      dice: "1d6",
      damageType: "Radiant",
      frequency: "every_hit",
    },
    description: "Your melee strikes carry divine radiant power at 11th level.",
    source: "Player's Handbook (2024), Paladin: Radiant Strikes",
  },
  channelDivinity: {
    id: "embers:paladin:channel-divinity",
    name: "Channel Divinity",
    kind: "class_feature",
    status: "verified",
    classes: ["paladin"],
    activationType: "bonus",
    resource: {
      name: "Channel Divinity",
      resetType: "Short or Long Rest",
      scaling: {
        type: "level_table",
        classId: "paladin",
        table: [
          { minLevel: 3, value: 1 },
          { minLevel: 7, value: 2 },
        ],
      },
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Channel Divinity",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Divine Channeling",
        description:
          "Channel holy power to fuel subclass oaths, Divine Sense, or Harness Divine Power.",
      },
    ],
    description:
      "Channel raw holy authority to smite foes or empower companions.",
    source: "Player's Handbook (2024), Paladin: Channel Divinity",
  },
  auraOfProtection: {
    id: "embers:paladin:aura-of-protection",
    name: "Aura of Protection",
    kind: "class_feature",
    status: "verified",
    classes: ["paladin"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Aura Bonus to Saves",
        description:
          "You and allies within 10 feet gain a bonus equal to your Charisma modifier (minimum +1) on all saving throws.",
      },
    ],
    description:
      "Shield nearby allies with a radiant aura granting your Charisma bonus to all saves.",
    source: "Player's Handbook (2024), Paladin: Aura of Protection",
  },

  weaponMastery: {
    id: "embers:paladin:weapon-mastery",
    name: "Weapon Mastery",
    kind: "class_feature",
    status: "verified",
    classes: ["paladin"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Mastery Properties",
        description:
          "Use the mastery properties of 2 Melee or Ranged weapons of your choice.",
      },
    ],
    description:
      "Channel martial expertise through the masteries of your chosen weapons.",
    source: "Player's Handbook (2024), Paladin: Weapon Mastery",
  },

  paladinsSmite: {
    id: "embers:paladin:paladins-smite",
    name: "Paladin's Smite",
    kind: "class_feature",
    status: "verified",
    classes: ["paladin"],
    activationType: "bonus",
    resource: {
      name: "Free Divine Smite",
      resetType: "Long Rest",
      scaling: {
        type: "flat",
        multiplier: 1,
      },
    },
    operations: [
      {
        type: "apply_effect",
        name: "Free Smite Cast",
        description:
          "You always have the Divine Smite spell prepared. You can cast Divine Smite once per Long Rest without expending a spell slot.",
      },
    ],
    description:
      "Cast Divine Smite once per Long Rest without expending a spell slot.",
    source: "Player's Handbook (2024), Paladin: Paladin's Smite",
  },

  divineSense: {
    id: "embers:paladin:divine-sense",
    name: "Divine Sense",
    kind: "class_feature",
    status: "verified",
    classes: ["paladin"],
    activationType: "bonus",
    operations: [
      {
        type: "apply_effect",
        name: "Celestial Perception",
        duration: "10 minutes",
        description:
          "Bonus Action: open your awareness to detect Celestials, Fiends, and Undead within 60 feet (1 free use per Long Rest, or expend 1 Channel Divinity).",
      },
    ],
    description:
      "Open your sensory awareness to locate celestials, fiends, and undead.",
    source: "Player's Handbook (2024), Paladin: Divine Sense",
  },

  extraAttack: {
    id: "embers:paladin:extra-attack",
    name: "Extra Attack",
    kind: "class_feature",
    status: "verified",
    classes: ["paladin"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Multiattack Strike",
        description:
          "You can attack twice instead of once whenever you take the Attack action on your turn.",
      },
    ],
    description:
      "Attack twice whenever you take the Attack action on your turn.",
    source: "Player's Handbook (2024), Paladin: Extra Attack",
  },

  faithfulSteed: {
    id: "embers:paladin:faithful-steed",
    name: "Faithful Steed",
    kind: "class_feature",
    status: "verified",
    classes: ["paladin"],
    activationType: "special",
    resource: {
      name: "Free Find Steed",
      resetType: "Long Rest",
      scaling: {
        type: "flat",
        multiplier: 1,
      },
    },
    operations: [
      {
        type: "apply_effect",
        name: "Divine Mount Bond",
        description:
          "You always have Find Steed prepared. You can cast it once per Long Rest without expending a spell slot.",
      },
    ],
    description:
      "Summon a celestial, fey, or fiendish steed once per Long Rest without expending a slot.",
    source: "Player's Handbook (2024), Paladin: Faithful Steed",
  },

  abjureFoes: {
    id: "embers:paladin:abjure-foes",
    name: "Abjure Foes",
    kind: "class_feature",
    status: "verified",
    classes: ["paladin"],
    activationType: "action",
    operations: [
      {
        type: "apply_effect",
        name: "Holy Rebuke",
        duration: "1 minute",
        description:
          "Action expend 1 Channel Divinity: present your holy symbol to abjure up to your Charisma modifier foes within 60 feet. Targets make Wisdom saving throw or have the Frightened and Dazed conditions for 1 minute.",
      },
    ],
    description:
      "Terrify and daze nearby enemies with overwhelming holy authority.",
    source: "Player's Handbook (2024), Paladin: Abjure Foes",
  },

  auraOfCourage: {
    id: "embers:paladin:aura-of-courage",
    name: "Aura of Courage",
    kind: "class_feature",
    status: "verified",
    classes: ["paladin"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Fear Immunity",
        description:
          "You and allies within your aura are immune to the Frightened condition.",
      },
    ],
    description:
      "Inspire unwavering bravery in all allies within your protective aura.",
    source: "Player's Handbook (2024), Paladin: Aura of Courage",
  },

  restoringTouch: {
    id: "embers:paladin:restoring-touch",
    name: "Restoring Touch",
    kind: "class_feature",
    status: "verified",
    classes: ["paladin"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Condition Cure",
        description:
          "When you use Lay on Hands, you can expend 5 points from your pool to remove Blinded, Charmed, Deafened, Frightened, Paralyzed, Poisoned, or Stunned conditions.",
      },
    ],
    description:
      "Cleanse a wide spectrum of debilitating afflictions using Lay on Hands.",
    source: "Player's Handbook (2024), Paladin: Restoring Touch",
  },

  auraExpansion: {
    id: "embers:paladin:aura-expansion",
    name: "Aura Expansion",
    kind: "class_feature",
    status: "verified",
    classes: ["paladin"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "30-Foot Emanation",
        description:
          "The range of your Aura of Protection, Aura of Courage, and subclass auras expands from 10 feet to 30 feet.",
      },
    ],
    description:
      "Expand all your protective paladin auras to a 30-foot emanation.",
    source: "Player's Handbook (2024), Paladin: Aura Expansion",
  },
  ...OATH_OF_DEVOTION_FORMULAS,
  ...OATH_OF_GLORY_FORMULAS,
  ...OATH_OF_PESTILENCE_FORMULAS,
  ...OATH_OF_SLAUGHTER_FORMULAS,
  ...OATH_OF_THE_ANCIENTS_FORMULAS,
  ...OATH_OF_THE_NOBLE_GENIES_FORMULAS,
  ...OATH_OF_VENGEANCE_FORMULAS,
  ...OATH_OF_ZEAL_FORMULAS,
};

export {
  LAY_ON_HANDS_OPTIONS,
  OATH_OF_DEVOTION_FORMULAS,
  OATH_OF_GLORY_FORMULAS,
  OATH_OF_PESTILENCE_FORMULAS,
  OATH_OF_SLAUGHTER_FORMULAS,
  OATH_OF_THE_ANCIENTS_FORMULAS,
  OATH_OF_THE_NOBLE_GENIES_FORMULAS,
  OATH_OF_VENGEANCE_FORMULAS,
  OATH_OF_ZEAL_FORMULAS,
};
