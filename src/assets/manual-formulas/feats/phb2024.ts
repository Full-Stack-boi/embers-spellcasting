import type { ManualActionFormula } from "../../../types/manualFormula";

export const PHB_2024_FEAT_FORMULAS: Record<string, ManualActionFormula> = {
  lucky: {
    id: "feat:lucky",
    name: "Lucky: Luck Points",
    kind: "feat",
    status: "verified",
    classes: [],
    activationType: "special",
    resource: {
      name: "Luck Points",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Luck Points",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Advantage on D20 Test",
        description:
          "Spend 1 Luck Point to give yourself Advantage on a d20 Test, or give an attacker Disadvantage on an attack roll against you.",
      },
    ],
    description:
      "You have a pool of Luck Points equal to your Proficiency Bonus. Regain all points when you finish a Long Rest.",
    source: "Player's Handbook (2024), pg. 200",
    notes:
      "Spend 1 Luck Point to gain Advantage on your d20 test or impose Disadvantage on an attack against you.",
  },

  healer: {
    id: "feat:healer",
    name: "Healer: Battle Medic",
    kind: "feat",
    status: "verified",
    classes: [],
    activationType: "action",
    operations: [
      {
        type: "apply_effect",
        name: "Battle Medic",
        description:
          "Utilize a Healer's Kit to allow a creature within 5 ft to expend one of its Hit Point Dice and regain HP equal to the roll plus your Proficiency Bonus.",
      },
    ],
    description:
      "As an Action, expend one use of a Healer's Kit to touch a creature and have it expend a Hit Die to heal (die + PB). A creature cannot benefit from this again until it finishes a Short or Long Rest.",
    source: "Player's Handbook (2024), pg. 200",
    notes:
      "Also whenever you roll a die to determine the HP a spell restores, you can reroll any roll of 1 (must use new roll).",
  },

  musician: {
    id: "feat:musician",
    name: "Musician: Inspiring Song",
    kind: "feat",
    status: "verified",
    classes: [],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Heroic Inspiration",
        description:
          "At the end of a Short or Long Rest, play an instrument to grant Heroic Inspiration to allies (up to your Proficiency Bonus).",
      },
    ],
    description:
      "As you finish a Short or Long Rest, play a musical instrument to grant Heroic Inspiration to allies equal to your Proficiency Bonus.",
    source: "Player's Handbook (2024), pg. 200",
    notes:
      "Allies lose this Heroic Inspiration if unused by the time they start their next Long Rest.",
  },

  telekinetic: {
    id: "feat:telekinetic",
    name: "Telekinetic: Telekinetic Shove",
    kind: "feat",
    status: "verified",
    classes: [],
    activationType: "bonus",
    operations: [
      {
        type: "saving_throw",
        ability: "STR",
        dc: "spell_save",
        failure: "The target is moved 5 feet toward you or away from you.",
        success: "No effect.",
      },
    ],
    description:
      "As a Bonus Action, you can telekinetically shove one creature you can see within 30 feet. The target must succeed on a Strength saving throw (DC = 8 + PB + spellcasting ability modifier) or be moved 5 feet toward you or away from you. A willing creature can choose to fail the save.",
    source: "Player's Handbook (2024), General Feats",
    notes:
      "Range is 30 ft. Target moves 5 ft directly toward or away from caster. Bonus Action.",
  },

  shield_master: {
    id: "feat:shield-master",
    name: "Shield Master: Shield Bash",
    kind: "feat",
    status: "verified",
    classes: [],
    activationType: "bonus",
    operations: [
      {
        type: "saving_throw",
        ability: "STR",
        dc: "spell_save",
        failure: "The target is knocked Prone or pushed 5 feet away from you.",
        success: "No effect.",
      },
    ],
    description:
      "If you take the Attack action on your turn and hit a creature with a melee weapon while wielding a shield, you can use a Bonus Action to force the target to make a Strength saving throw (DC = 8 + PB + STR mod) or be pushed 5 feet or knocked Prone.",
    source: "Player's Handbook (2024), General Feats",
    notes:
      "Bonus Action after hitting with melee attack. Also provides Interpose (add shield AC bonus to DEX saves and take half/no damage).",
  },

  inspiring_leader: {
    id: "feat:inspiring-leader",
    name: "Inspiring Leader: Inspiring Performance",
    kind: "feat",
    status: "verified",
    classes: [],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Bolstered Morale",
        description:
          "Grant Temporary Hit Points equal to your level + Charisma or Wisdom modifier to yourself and up to five allies within 30 feet.",
      },
    ],
    description:
      "Over 10 minutes of performance or encouragement, grant yourself and up to five companions within 30 feet Temporary Hit Points equal to your level + Charisma/Wisdom modifier. Can be used once per Short or Long Rest.",
    source: "Player's Handbook (2024), General Feats",
    notes:
      "Target cannot gain Temporary Hit Points from this feat again until finishing a Short or Long Rest.",
  },

  great_weapon_master: {
    id: "feat:great-weapon-master",
    name: "Great Weapon Master: Hew",
    kind: "feat",
    status: "verified",
    classes: [],
    activationType: "bonus",
    operations: [
      {
        type: "apply_effect",
        name: "Bonus Action Melee Attack",
        description:
          "Make one melee weapon attack as a Bonus Action after scoring a Critical Hit or reducing a creature to 0 Hit Points with a melee weapon.",
      },
    ],
    description:
      "When you score a Critical Hit with a melee weapon or reduce a creature to 0 Hit Points, you can make one melee weapon attack as a Bonus Action. Also adds your Proficiency Bonus to damage on attacks with Heavy weapons.",
    source: "Player's Handbook (2024), General Feats",
    notes:
      "Heavy Weapon Mastery adds +PB to damage on hit. Hew grants Bonus Action attack on Crit or Kill.",
  },
};
