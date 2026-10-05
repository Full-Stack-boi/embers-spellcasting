import type { ManualActionFormula } from "../../../../types/manualFormula";
import { LAY_ON_HANDS_OPTIONS } from "../../mechanics/classMechanicRegistry";
import { OATH_OF_DEVOTION_FORMULAS } from "./subclasses/oathOfDevotion";
import { OATH_OF_GLORY_FORMULAS } from "./subclasses/oathOfGlory";
import { OATH_OF_PESTILENCE_FORMULAS } from "./subclasses/oathOfPestilence";
import { OATH_OF_SLAUGHTER_FORMULAS } from "./subclasses/oathOfSlaughter";
import { OATH_OF_THE_ANCIENTS_FORMULAS } from "./subclasses/oathOfTheAncients";
import { OATH_OF_THE_NOBLE_GENIES_FORMULAS } from "./subclasses/oathOfTheNobleGenies";
import { OATH_OF_VENGEANCE_FORMULAS } from "./subclasses/oathOfVengeance";
import { OATH_OF_ZEAL_FORMULAS } from "./subclasses/oathOfZeal";

export const PALADIN_CLASS_FORMULAS: Record<string, ManualActionFormula> = {
  layOnHands: {
    id: "embers:paladin:lay-on-hands",
    name: "Lay on Hands",
    kind: "class_feature",
    status: "verified",
    classes: ["paladin"],
    activationType: "bonus",
    resource: {
      name: "Lay on Hands Pool",
      resetType: "Long Rest",
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
