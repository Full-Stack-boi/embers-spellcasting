import type { ManualActionFormula } from "../../../../types/manualFormula";
import { ARCANA_DOMAIN_FORMULAS } from "./subclasses/arcanaDomain";
import { DRAGON_DOMAIN_FORMULAS } from "./subclasses/dragonDomain";
import { ELDRITCH_DOMAIN_FORMULAS } from "./subclasses/eldritchDomain";
import { INQUISITION_DOMAIN_FORMULAS } from "./subclasses/inquisitionDomain";
import { KNOWLEDGE_DOMAIN_FORMULAS } from "./subclasses/knowledgeDomain";
import { LIFE_DOMAIN_FORMULAS } from "./subclasses/lifeDomain";
import { LIGHT_DOMAIN_FORMULAS } from "./subclasses/lightDomain";
import { PURIFICATION_DOMAIN_FORMULAS } from "./subclasses/purificationDomain";
import { TRICKERY_DOMAIN_FORMULAS } from "./subclasses/trickeryDomain";
import { WAR_DOMAIN_FORMULAS } from "./subclasses/warDomain";
import { LEGENDARY_ASPECT_OPTIONS } from "./subclasses/dragonDomain";

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
