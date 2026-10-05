import type { ManualActionFormula } from "../../../../types/manualFormula";
import { ABJURER_FORMULAS } from "./subclasses/abjurer";
import { BLADESINGER_FORMULAS } from "./subclasses/bladesinger";
import { CONJURER_FORMULAS } from "./subclasses/conjurer";
import { DAEMONOLOGIST_FORMULAS } from "./subclasses/daemonologist";
import { DIVINER_FORMULAS } from "./subclasses/diviner";
import { ENCHANTER_FORMULAS } from "./subclasses/enchanter";
import { EVOKER_FORMULAS } from "./subclasses/evoker";
import { ILLUSIONIST_FORMULAS } from "./subclasses/illusionist";
import { MAGIC_MISSILE_MAGE_FORMULAS } from "./subclasses/magicMissileMage";
import { NECROMANCER_FORMULAS } from "./subclasses/necromancer";
import { PLAGUE_DOCTOR_FORMULAS } from "./subclasses/plagueDoctor";
import { SANGROMANCER_FORMULAS } from "./subclasses/sangromancer";
import { TRANSMUTER_FORMULAS } from "./subclasses/transmuter";
import { VERSATILE_MISSILE_OPTIONS } from "./subclasses/magicMissileMage";

export const WIZARD_CLASS_FORMULAS: Record<string, ManualActionFormula> = {
  arcaneRecovery: {
    id: "embers:wizard:arcane-recovery",
    name: "Arcane Recovery",
    kind: "class_feature",
    status: "verified",
    classes: ["wizard"],
    activationType: "special",
    resource: {
      name: "Arcane Recovery",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "apply_effect",
        name: "Slot Recovery",
        description:
          "At the end of a Short Rest, regain expended spell slots of combined level equal to half your Wizard level (rounded up, max 5th level slot).",
      },
    ],
    description:
      "Regain magical energy during a short rest by studying your spellbook.",
    source: "Player's Handbook (2024), Wizard: Arcane Recovery",
  },
  scholar: {
    id: "embers:wizard:scholar",
    name: "Scholar",
    kind: "class_feature",
    status: "verified",
    classes: ["wizard"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Academic Expertise",
        description:
          "Gain Expertise in one proficient academic skill: Arcana, History, Nature, Religion, or Medicine.",
      },
    ],
    description: "Deep academic specialization in scholarly disciplines.",
    source: "Player's Handbook (2024), Wizard: Scholar",
  },
  ...ABJURER_FORMULAS,
  ...BLADESINGER_FORMULAS,
  ...CONJURER_FORMULAS,
  ...DAEMONOLOGIST_FORMULAS,
  ...DIVINER_FORMULAS,
  ...ENCHANTER_FORMULAS,
  ...EVOKER_FORMULAS,
  ...ILLUSIONIST_FORMULAS,
  ...MAGIC_MISSILE_MAGE_FORMULAS,
  ...NECROMANCER_FORMULAS,
  ...PLAGUE_DOCTOR_FORMULAS,
  ...SANGROMANCER_FORMULAS,
  ...TRANSMUTER_FORMULAS,
};

export {
  ABJURER_FORMULAS,
  BLADESINGER_FORMULAS,
  CONJURER_FORMULAS,
  DAEMONOLOGIST_FORMULAS,
  DIVINER_FORMULAS,
  ENCHANTER_FORMULAS,
  EVOKER_FORMULAS,
  ILLUSIONIST_FORMULAS,
  MAGIC_MISSILE_MAGE_FORMULAS,
  NECROMANCER_FORMULAS,
  PLAGUE_DOCTOR_FORMULAS,
  SANGROMANCER_FORMULAS,
  TRANSMUTER_FORMULAS,
  VERSATILE_MISSILE_OPTIONS,
};
