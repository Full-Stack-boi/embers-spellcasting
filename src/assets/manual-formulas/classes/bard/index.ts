import type { ManualActionFormula } from "../../../../types/manualFormula";
import { COLLEGE_OF_ADVENTURERS_FORMULAS } from "./subclasses/collegeOfAdventurers";
import { COLLEGE_OF_DANCE_FORMULAS } from "./subclasses/collegeOfDance";
import { COLLEGE_OF_FOOLS_FORMULAS } from "./subclasses/collegeOfFools";
import { COLLEGE_OF_GLAMOUR_FORMULAS } from "./subclasses/collegeOfGlamour";
import { COLLEGE_OF_LORE_FORMULAS } from "./subclasses/collegeOfLore";
import { COLLEGE_OF_MASKS_FORMULAS } from "./subclasses/collegeOfMasks";
import { COLLEGE_OF_REQUIEMS_FORMULAS } from "./subclasses/collegeOfRequiems";
import { COLLEGE_OF_THE_MOON_FORMULAS } from "./subclasses/collegeOfTheMoon";
import { COLLEGE_OF_VALOR_FORMULAS } from "./subclasses/collegeOfValor";
import { PERSONA_MASK_OPTIONS } from "./subclasses/collegeOfMasks";

export const BARD_CLASS_FORMULAS: Record<string, ManualActionFormula> = {
  bardicInspiration: {
    id: "embers:bard:bardic-inspiration",
    name: "Bardic Inspiration",
    kind: "class_feature",
    status: "verified",
    classes: ["bard"],
    activationType: "bonus",
    resource: {
      name: "Bardic Inspiration",
      resetType: "Short or Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Bardic Inspiration",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Bardic Inspiration Die",
        description:
          "Bonus Action grant inspiration die (1d6 to 1d12) to a creature within 60 ft; within 1 hour it can add the die to a d20 test or use it as a reaction to regain HP when taking damage.",
      },
    ],
    description: "Inspire others through stirring words, music, or presence.",
    source: "Player's Handbook (2024), Bard: Bardic Inspiration",
  },
  fontOfInspiration: {
    id: "embers:bard:font-of-inspiration",
    name: "Font of Inspiration",
    kind: "class_feature",
    status: "verified",
    classes: ["bard"],
    activationType: "special",
    description: "You regain all expended uses of Bardic Inspiration when you finish a Short or Long Rest, and can expend a spell slot to regain 1 use.",
    source: "Player's Handbook (2024), Bard: Font of Inspiration",
    operations: [
      {
        type: "apply_effect",
        name: "Spell Slot Inspiration Recovery",
        description: "Regain all Bardic Inspiration uses on Short or Long Rest; or expend a spell slot (level 1+) to regain 1 use of Bardic Inspiration.",
      },
    ],
  },
  countercharm: {
    id: "embers:bard:countercharm",
    name: "Countercharm",
    kind: "class_feature",
    status: "verified",
    classes: ["bard"],
    activationType: "reaction",
    operations: [
      {
        type: "apply_effect",
        name: "Harmonic Ward",
        description:
          "Reaction when you or a creature within 30 ft fails a saving throw against Charmed or Frightened: allow target to reroll the save with Advantage.",
      },
    ],
    description:
      "Use musical notes or spoken words to disrupt mind-influencing effects.",
    source: "Player's Handbook (2024), Bard: Countercharm",
  },
  magicalSecrets: {
    id: "embers:bard:magical-secrets",
    name: "Magical Secrets",
    kind: "class_feature",
    status: "verified",
    classes: ["bard"],
    activationType: "special",
    description: "Your understanding of magic expands to encompass all traditions.",
    source: "Player's Handbook (2024), Bard: Magical Secrets",
    operations: [
      {
        type: "apply_effect",
        name: "Universal Spell Access",
        description: "Whenever you prepare or replace your Bard spells, you can choose spells from the Cleric, Druid, and Wizard spell lists in addition to the Bard spell list.",
      },
    ],
  },
  superiorInspiration: {
    id: "embers:bard:superior-inspiration",
    name: "Superior Inspiration",
    kind: "class_feature",
    status: "verified",
    classes: ["bard"],
    activationType: "special",
    description: "When you roll Initiative, if you have fewer than 2 uses of Bardic Inspiration left, you regain uses until you have 2.",
    source: "Player's Handbook (2024), Bard: Superior Inspiration",
    operations: [
      {
        type: "apply_effect",
        name: "Guaranteed Inspiration",
        description: "When rolling Initiative, regain expended uses of Bardic Inspiration up to a minimum of 2.",
      },
    ],
  },
  wordsOfCreation: {
    id: "embers:bard:words-of-creation",
    name: "Words of Creation",
    kind: "class_feature",
    status: "verified",
    classes: ["bard"],
    activationType: "special",
    description: "You have mastered words of primal reality: Power Word Heal and Power Word Kill are always prepared and can target two creatures.",
    source: "Player's Handbook (2024), Bard: Words of Creation",
    operations: [
      {
        type: "apply_effect",
        name: "Twin Power Words",
        description: "Power Word Heal and Power Word Kill are always prepared. When you cast either, you can target a second creature within the spell's range.",
      },
    ],
  },
  ...COLLEGE_OF_ADVENTURERS_FORMULAS,
  ...COLLEGE_OF_DANCE_FORMULAS,
  ...COLLEGE_OF_FOOLS_FORMULAS,
  ...COLLEGE_OF_GLAMOUR_FORMULAS,
  ...COLLEGE_OF_LORE_FORMULAS,
  ...COLLEGE_OF_MASKS_FORMULAS,
  ...COLLEGE_OF_REQUIEMS_FORMULAS,
  ...COLLEGE_OF_THE_MOON_FORMULAS,
  ...COLLEGE_OF_VALOR_FORMULAS,
};

export {
  COLLEGE_OF_ADVENTURERS_FORMULAS,
  COLLEGE_OF_DANCE_FORMULAS,
  COLLEGE_OF_FOOLS_FORMULAS,
  COLLEGE_OF_GLAMOUR_FORMULAS,
  COLLEGE_OF_LORE_FORMULAS,
  COLLEGE_OF_MASKS_FORMULAS,
  COLLEGE_OF_REQUIEMS_FORMULAS,
  COLLEGE_OF_THE_MOON_FORMULAS,
  COLLEGE_OF_VALOR_FORMULAS,
  PERSONA_MASK_OPTIONS,
};
