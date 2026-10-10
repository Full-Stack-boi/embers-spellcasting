import type {
  ManualActionFormula,
  FeatureActionOption,
} from "../../../../types/manualFormula";
import { ARCANA_DOMAIN_FORMULAS } from "./subclasses/arcanaDomain";
import { DRAGON_DOMAIN_FORMULAS, LEGENDARY_ASPECT_OPTIONS } from "./subclasses/dragonDomain";
import { ELDRITCH_DOMAIN_FORMULAS } from "./subclasses/eldritchDomain";
import { INQUISITION_DOMAIN_FORMULAS } from "./subclasses/inquisitionDomain";
import { KNOWLEDGE_DOMAIN_FORMULAS } from "./subclasses/knowledgeDomain";
import { LIFE_DOMAIN_FORMULAS } from "./subclasses/lifeDomain";
import { LIGHT_DOMAIN_FORMULAS } from "./subclasses/lightDomain";
import { PURIFICATION_DOMAIN_FORMULAS } from "./subclasses/purificationDomain";
import { TRICKERY_DOMAIN_FORMULAS } from "./subclasses/trickeryDomain";
import { WAR_DOMAIN_FORMULAS } from "./subclasses/warDomain";

const DIVINE_SPARK_OPTIONS: FeatureActionOption[] = [
  {
    id: "divine_spark_heal",
    name: "Divine Spark: Healing",
    cost: 1,
    desc: "Action expend 1 Channel Divinity: heal creature within 30 ft for 1d8 + WIS modifier HP (scales with cleric level)",
    actionType: "action",
  },
  {
    id: "divine_spark_damage",
    name: "Divine Spark: Harm",
    cost: 1,
    desc: "Action expend 1 Channel Divinity: deal 1d8 + WIS modifier Radiant or Necrotic damage to target within 30 ft (CON save half)",
    actionType: "action",
  },
  {
    id: "turn_undead",
    name: "Turn Undead",
    cost: 1,
    desc: "Action expend 1 Channel Divinity: each Undead within 30 ft makes WIS save or Frightened & Incapacitated for 1 minute",
    actionType: "action",
  },
];

export const CLERIC_CLASS_FORMULAS: Record<string, ManualActionFormula> = {
  channelDivinity: {
    id: "embers:cleric:channel-divinity",
    name: "Channel Divinity",
    kind: "class_feature",
    status: "verified",
    classes: ["cleric"],
    activationType: "action",
    resource: {
      name: "Channel Divinity",
      resetType: "Short or Long Rest",
      scaling: {
        type: "level_table",
        classId: "cleric",
        table: [
          { minLevel: 2, value: 1 },
          { minLevel: 6, value: 2 },
          { minLevel: 17, value: 3 },
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
        name: "Divine Spark or Turn Undead",
        description:
          "Channel divine energy to fuel Divine Spark (heal 1d8+WIS HP or deal 1d8+WIS Radiant/Necrotic damage) or Turn Undead.",
      },
    ],
    description:
      "Channel divine energy directly from your deity to fuel miraculous effects.",
    source: "Player's Handbook (2024), Cleric: Channel Divinity",
  },
  divineSpark: {
    id: "embers:cleric:divine-spark",
    name: "Divine Spark",
    kind: "class_feature",
    status: "verified",
    classes: ["cleric"],
    activationType: "action",
    flyoutType: "options_grid",
    options: DIVINE_SPARK_OPTIONS,
    operations: [
      {
        type: "apply_effect",
        name: "Healing or Holy Smite",
        description:
          "Expend 1 Channel Divinity: heal a creature within 30 ft for 1d8 + Wisdom modifier HP, or deal 1d8 + Wisdom modifier Radiant or Necrotic damage to an enemy (Constitution save half).",
      },
    ],
    description: "Unleash a spark of pure divine power to heal or harm.",
    source: "Player's Handbook (2024), Cleric: Divine Spark",
  },
  turnUndead: {
    id: "embers:cleric:turn-undead",
    name: "Turn Undead",
    kind: "class_feature",
    status: "verified",
    classes: ["cleric"],
    activationType: "action",
    operations: [
      {
        type: "apply_effect",
        name: "Turn Undead",
        description:
          "Action expend 1 Channel Divinity: each Undead within 30 ft makes a Wisdom saving throw; on a failed save, it has the Frightened and Incapacitated conditions for 1 minute.",
      },
    ],
    description:
      "Present your holy symbol to rebuke and rout undead abominations.",
    source: "Player's Handbook (2024), Cleric: Turn Undead",
  },

  divineOrder: {
    id: "embers:cleric:divine-order",
    name: "Divine Order",
    kind: "class_feature",
    status: "verified",
    classes: ["cleric"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Protector or Thaumaturge",
        description:
          "Choose Protector (proficiency with Martial weapons and training with Heavy armor) or Thaumaturge (gain one extra Cleric cantrip and add Wisdom modifier to Religion and Arcana checks).",
      },
    ],
    description:
      "Dedicate yourself to martial defense or scholarly thaumaturgical lore.",
    source: "Player's Handbook (2024), Cleric: Divine Order",
  },

  harnessDivinePower: {
    id: "embers:cleric:harness-divine-power",
    name: "Harness Divine Power",
    kind: "class_feature",
    status: "verified",
    classes: ["cleric"],
    activationType: "bonus",
    flyoutType: "slot_recovery",
    operations: [
      {
        type: "apply_effect",
        name: "Spell Slot Restoration",
        description:
          "Bonus Action expend 1 Channel Divinity to recover one expended spell slot (maximum slot level equals half your Proficiency Bonus rounded up; 1/Long Rest at level 2, 2 at level 3, 3 at level 7).",
      },
    ],
    description:
      "Channel your deity's energy to refresh your expended spell slots.",
    source: "Player's Handbook (2024), Cleric: Harness Divine Power",
  },

  searUndead: {
    id: "embers:cleric:sear-undead",
    name: "Sear Undead",
    kind: "class_feature",
    status: "verified",
    classes: ["cleric"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Radiant Burst on Turn",
        description:
          "Whenever you use Turn Undead, roll a number of d8s equal to your Wisdom modifier and deal that much Radiant damage to each Undead turned.",
      },
    ],
    description:
      "Unleash searing radiance that burns undead to ashes when turned.",
    source: "Player's Handbook (2024), Cleric: Sear Undead",
  },

  blessedStrikes: {
    id: "embers:cleric:blessed-strikes",
    name: "Blessed Strikes",
    kind: "class_feature",
    status: "verified",
    classes: ["cleric"],
    activationType: "special",
    flyoutType: "options_grid",
    options: [
      {
        id: "divine_strike",
        name: "Divine Strike",
        cost: 0,
        desc: "Once on each of your turns when you hit with a weapon attack, deal extra 1d8 Radiant or Necrotic damage (2d8 at level 14).",
        actionType: "none",
      },
      {
        id: "potent_spellcasting",
        name: "Potent Spellcasting",
        cost: 0,
        desc: "Add your Wisdom modifier to the damage dealt by your Cleric cantrips.",
        actionType: "none",
      },
    ],
    weaponRider: {
      type: "weapon_damage_rider",
      id: "divine-strike",
      name: "Divine Strike",
      classId: "cleric",
      minLevel: 7,
      diceByClassLevel: [
        { minLevel: 7, dice: "1d8" },
        { minLevel: 14, dice: "2d8" },
      ],
      damageTypeChoices: ["Radiant", "Necrotic"],
      defaultChoice: "Radiant",
      frequency: "first_hit_per_turn",
    },
    operations: [
      {
        type: "apply_effect",
        name: "Holy Infusion",
        description:
          "Choose Divine Strike (deal extra 1d8 Radiant or Necrotic damage on weapon hits once per turn) or Potent Spellcasting (add Wisdom modifier to Cleric cantrip damage).",
      },
    ],
    description:
      "Infuse weapon strikes or offensive cantrips with holy power.",
    source: "Player's Handbook (2024), Cleric: Blessed Strikes",
  },

  divineIntervention: {
    id: "embers:cleric:divine-intervention",
    name: "Divine Intervention",
    kind: "class_feature",
    status: "verified",
    classes: ["cleric"],
    activationType: "action",
    resource: {
      name: "Divine Intervention",
      resetType: "Long Rest",
      scaling: {
        type: "flat",
        multiplier: 1,
      },
    },
    operations: [
      {
        type: "apply_effect",
        name: "Miraculous Request",
        description:
          "As an Action, choose any Cleric spell of level 5 or lower with a casting time of 1 action: you cast the spell without expending a spell slot or material components (1/Long Rest).",
      },
    ],
    description:
      "Call directly on your deity for an instantaneous miraculous casting of any level 1-5 cleric spell.",
    source: "Player's Handbook (2024), Cleric: Divine Intervention",
  },

  improvedBlessedStrikes: {
    id: "embers:cleric:improved-blessed-strikes",
    name: "Improved Blessed Strikes",
    kind: "class_feature",
    status: "verified",
    classes: ["cleric"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Pinnacle Holy Infusion",
        description:
          "Divine Strike damage increases to 2d8; Potent Spellcasting now grants Temporary Hit Points equal to twice your Wisdom modifier to you or an ally when you hit with a cantrip.",
      },
    ],
    description:
      "Elevate your blessed strikes with double damage or restorative temp HP.",
    source: "Player's Handbook (2024), Cleric: Improved Blessed Strikes",
  },

  greaterDivineIntervention: {
    id: "embers:cleric:greater-divine-intervention",
    name: "Greater Divine Intervention",
    kind: "class_feature",
    status: "verified",
    classes: ["cleric"],
    activationType: "action",
    operations: [
      {
        type: "apply_effect",
        name: "Wish of the Gods",
        description:
          "Level 20 Capstone: You can choose the Wish spell when you use your Divine Intervention feature. After casting Wish this way, you cannot use Divine Intervention again until 2d4 Long Rests pass.",
      },
    ],
    description:
      "Level 20 Capstone: Beseech your deity to manifest the reality-warping Wish spell.",
    source: "Player's Handbook (2024), Cleric: Greater Divine Intervention",
  },
  ...ARCANA_DOMAIN_FORMULAS,
  ...DRAGON_DOMAIN_FORMULAS,
  ...ELDRITCH_DOMAIN_FORMULAS,
  ...INQUISITION_DOMAIN_FORMULAS,
  ...KNOWLEDGE_DOMAIN_FORMULAS,
  ...LIFE_DOMAIN_FORMULAS,
  ...LIGHT_DOMAIN_FORMULAS,
  ...PURIFICATION_DOMAIN_FORMULAS,
  ...TRICKERY_DOMAIN_FORMULAS,
  ...WAR_DOMAIN_FORMULAS,
};

export {
  DIVINE_SPARK_OPTIONS,
  ARCANA_DOMAIN_FORMULAS,
  DRAGON_DOMAIN_FORMULAS,
  ELDRITCH_DOMAIN_FORMULAS,
  INQUISITION_DOMAIN_FORMULAS,
  KNOWLEDGE_DOMAIN_FORMULAS,
  LIFE_DOMAIN_FORMULAS,
  LIGHT_DOMAIN_FORMULAS,
  PURIFICATION_DOMAIN_FORMULAS,
  TRICKERY_DOMAIN_FORMULAS,
  WAR_DOMAIN_FORMULAS,
  LEGENDARY_ASPECT_OPTIONS,
};
