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
        name: "Academic Advantage",
        description:
          "Gain Advantage on checks with one chosen academic skill: Arcana, History, Investigation, Nature, or Religion.",
      },
    ],
    description: "Deep academic specialization in scholarly disciplines.",
    source: "Player's Handbook (2024), Wizard: Scholar",
  },
  memorizeSpell: {
    id: "embers:wizard:memorize-spell",
    name: "Memorize Spell",
    kind: "class_feature",
    status: "verified",
    classes: ["wizard"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Spellbook Study",
        description: "Whenever you finish a Short Rest, you can study your spellbook and replace one of your prepared spells with another spell of your choice from your spellbook.",
      },
    ],
    description: "Swap a prepared spell during a short rest by consulting your spellbook.",
    source: "Player's Handbook (2024), Wizard: Memorize Spell",
  },
  spellMastery: {
    id: "embers:wizard:spell-mastery",
    name: "Spell Mastery",
    kind: "class_feature",
    status: "verified",
    classes: ["wizard"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "At-Will 1st & 2nd Level Spells",
        description: "Choose one 1st-level spell and one 2nd-level spell in your spellbook. You always have them prepared and can cast them at their lowest level without expending a spell slot.",
      },
    ],
    description: "Cast chosen 1st- and 2nd-level spells at will without using spell slots.",
    source: "Player's Handbook (2024), Wizard: Spell Mastery",
  },
  signatureSpells: {
    id: "embers:wizard:signature-spells",
    name: "Signature Spells",
    kind: "class_feature",
    status: "verified",
    classes: ["wizard"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Free 3rd-Level Signature Casts",
        description: "Choose two 3rd-level spells in your spellbook as signature spells. They are always prepared, and you can cast each once at level 3 without expending a spell slot (recharges on Short or Long Rest).",
      },
    ],
    description: "Two 3rd-level spells become your signature magic, castable for free each rest.",
    source: "Player's Handbook (2024), Wizard: Signature Spells",
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
