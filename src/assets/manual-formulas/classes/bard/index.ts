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
          "Bonus Action grant inspiration die (d6 to d12) to creature within 60 ft; within 1 hour it can add the die to a d20 test or use it to regain HP.",
      },
    ],
    description: "Inspire others through stirring words, music, or presence.",
    source: "Player's Handbook (2024), Bard: Bardic Inspiration",
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
          "Reaction when you or a creature within 30 ft fails a saving throw against Charmed or Frightened: allow target to reroll the save.",
      },
    ],
    description:
      "Use musical notes or spoken words to disrupt mind-influencing effects.",
    source: "Player's Handbook (2024), Bard: Countercharm",
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
