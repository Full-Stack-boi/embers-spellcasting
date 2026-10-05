import type { ManualActionFormula } from "../../../types/manualFormula";

export const VSSPP2_FEAT_FORMULAS: Record<string, ManualActionFormula> = {
  familiar_keeper: {
    id: "feat:familiar-keeper",
    name: "Familiar Keeper: Familiar Distraction",
    kind: "feat",
    status: "verified",
    classes: [],
    activationType: "reaction",
    resource: {
      name: "Familiar Distraction Uses",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Familiar Distraction Uses",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Familiar Distraction",
        description:
          "Reaction when a creature within 5 feet of your familiar makes an attack roll to give the attack Disadvantage.",
      },
    ],
    description:
      "Reaction when a creature within 5 ft of your familiar makes an attack roll to give it Disadvantage (PB uses/Long Rest). Also always have Find Familiar prepared, castable as a Magic action without a slot or material components (1/Long Rest), with special forms: Imp, Pseudodragon, Quasit, Sphinx of Wonder, or Sprite.",
    source: "Valda's Spire of Secrets: Player Pack 2, Feats",
    notes:
      "Reaction Distraction within 5 ft of familiar (PB uses/LR). Free Find Familiar Magic action (1/LR).",
  },

  flex_caster: {
    id: "feat:flex-caster",
    name: "Flex Caster: Upcast & Downcast",
    kind: "feat",
    status: "verified",
    classes: [],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Flex Casting",
        description:
          "Upcast: Expend an additional spell slot to increase effective spell level by 1 (max 9). Downcast: When casting with a higher-level slot, cast at base level to regain an expended 1st-level spell slot.",
      },
    ],
    description:
      "Upcast: When casting a spell that benefits from higher slots, expend any additional spell slot to increase effective level by 1 (max 9). Downcast: When casting using a higher-level slot, cast at base level and recycle energy to regain an expended level 1 spell slot.",
    source: "Valda's Spire of Secrets: Player Pack 2, Feats",
    notes:
      "Expend additional slot for +1 level upcast, or downcast to regain a 1st level slot.",
  },

  magitechnician: {
    id: "feat:magitechnician",
    name: "Magitechnician: Magic Item Recharge",
    kind: "feat",
    status: "verified",
    classes: [],
    activationType: "special",
    resource: {
      name: "Magic Item Recharge Uses",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Magic Item Recharge Uses",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Recharge Item",
        description:
          "At the end of a Short Rest, cause a magic item that regains charges or properties to recharge as if it were the next dawn.",
      },
    ],
    description:
      "When you finish a Short Rest, cause a magic item that regains charges to recharge as if it were the next dawn (1/Long Rest). Magic items calling for a saving throw use DC = 8 + INT/WIS/CHA mod + PB if higher.",
    source: "Valda's Spire of Secrets: Player Pack 2, Feats",
    notes:
      "Recharge magic item on Short Rest (1/LR). Item save DC = 8 + Mod + PB.",
  },

  metabolistic_magic: {
    id: "feat:metabolistic-magic",
    name: "Metabolistic Magic: Vital Fuel & Arcane Skill",
    kind: "feat",
    status: "verified",
    classes: [],
    activationType: "special",
    resource: {
      name: "Vital Fuel Uses",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Vital Fuel Uses",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Vital Fuel",
        description:
          "At the end of a Short Rest, expend up to PB Hit Point Dice to recover expended spell slots with combined level equal to or less than the Hit Dice expended.",
      },
    ],
    description:
      "Vital Fuel: At the end of a Short Rest, expend up to PB Hit Point Dice to recover expended spell slots (combined level <= Hit Dice spent, 1/Long Rest). Arcane Skill: When you fail a D20 Test, expend a spell slot to gain a bonus equal to 2 + slot level.",
    source: "Valda's Spire of Secrets: Player Pack 2, Feats",
    notes:
      "Vital Fuel: Hit Dice to Spell Slots on Short Rest (1/LR). Arcane Skill: Expend slot for +2+Level to failed D20 test.",
  },

  pyromaniac: {
    id: "feat:pyromaniac",
    name: "Pyromaniac: Flare Damage",
    kind: "feat",
    status: "verified",
    classes: [],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Flare Damage",
        description:
          "When dealing Fire damage and rolling the max number on a damage die, reroll that die and add it (exploding dice), capped at Proficiency Bonus extra dice.",
      },
    ],
    description:
      "Whenever you deal Fire damage and roll the highest number on any damage die, roll it again and add it (exploding dice), up to a max of PB extra dice (min 1). Learn Fire Bolt; have Burning Hands and Scorching Ray prepared and cast each once per Long Rest without expending a spell slot.",
    source: "Valda's Spire of Secrets: Player Pack 2, Feats",
    notes:
      "Fire damage dice explode on max roll (up to PB extra dice). Free cast Burning Hands and Scorching Ray (1/LR each).",
  },

  shock_trooper: {
    id: "feat:shock-trooper",
    name: "Shock Trooper: First Strike",
    kind: "feat",
    status: "verified",
    classes: [],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "First Strike Attack",
        description:
          "When you roll Initiative and don't have Disadvantage, immediately draw a weapon and make an attack using it.",
      },
    ],
    description:
      "First Strike: When you roll Initiative and do not have Disadvantage, draw a weapon and make an attack. Rapid Advance: During the first round of each combat, your Speed is doubled.",
    source: "Valda's Spire of Secrets: Player Pack 2, Feats",
    notes: "Free weapon attack on Initiative roll. Speed doubled in round 1.",
  },

  showman: {
    id: "feat:showman",
    name: "Showman: Taunt",
    kind: "feat",
    status: "verified",
    classes: [],
    activationType: "bonus",
    resource: {
      name: "Taunt Uses",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Taunt Uses",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Taunt",
        description:
          "Bonus Action mock a creature within 15 ft that can hear you. It has Disadvantage on its next attack against anyone other than you before the end of its next turn.",
      },
    ],
    description:
      "As a Bonus Action, mock a creature within 15 ft that can hear you. It has Disadvantage on the next attack roll it makes against a creature other than you before the end of its next turn (PB uses/Long Rest). Also gain Proficiency or Expertise in Performance.",
    source: "Valda's Spire of Secrets: Player Pack 2, Feats",
    notes:
      "Bonus Action Taunt 15 ft (PB uses/Long Rest). Performance skill proficiency/expertise.",
  },

  spellblade: {
    id: "feat:spellblade",
    name: "Spellblade: Channeled Attack",
    kind: "feat",
    status: "verified",
    classes: [],
    activationType: "special",
    resource: {
      name: "Channeled Attack Uses",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Channeled Attack Uses",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Channeled Attack",
        description:
          "When making a weapon attack using Strength or Dexterity with a proficient weapon, add your Intelligence, Wisdom, or Charisma modifier (minimum +1) to the attack roll.",
      },
    ],
    description:
      "When you make a weapon attack using Strength or Dexterity with a proficient weapon, gain a bonus to the attack roll equal to your Intelligence, Wisdom, or Charisma modifier (minimum +1). Usable a number of times equal to your Proficiency Bonus per Long Rest. Also allows replacing one Attack action attack with Arc Blade, Burning Blade, Frigid Blade, or True Strike (Arcane Strike).",
    source: "Valda's Spire of Secrets: Player Pack 2, Feats",
    notes:
      "Prerequisites: Level 4+, Int/Wis/Cha 13+. Grants +1 ASI, 2 blade cantrips, Arcane Strike (replace 1 attack with blade cantrip), and Channeled Attack (PB uses/Long Rest).",
  },
};
