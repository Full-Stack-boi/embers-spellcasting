import type { ManualActionFormula } from "../../../../types/manualFormula";
import { CIRCLE_OF_BLOOD_FORMULAS } from "./subclasses/circleOfBlood";
import { CIRCLE_OF_ENTROPY_FORMULAS } from "./subclasses/circleOfEntropy";
import { CIRCLE_OF_MUTATION_FORMULAS } from "./subclasses/circleOfMutation";
import { CIRCLE_OF_THE_CITY_FORMULAS } from "./subclasses/circleOfTheCity";
import { CIRCLE_OF_THE_LAND_FORMULAS } from "./subclasses/circleOfTheLand";
import { CIRCLE_OF_THE_MOON_FORMULAS } from "./subclasses/circleOfTheMoon";
import { CIRCLE_OF_THE_SEA_FORMULAS } from "./subclasses/circleOfTheSea";
import { CIRCLE_OF_THE_STARS_FORMULAS } from "./subclasses/circleOfTheStars";

export const DRUID_CLASS_FORMULAS: Record<string, ManualActionFormula> = {
  wildShape: {
    id: "embers:druid:wild-shape",
    name: "Wild Shape",
    kind: "class_feature",
    status: "verified",
    classes: ["druid"],
    activationType: "bonus",
    resource: {
      name: "Wild Shape",
      resetType: "Short or Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Wild Shape",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Beast Transformation",
        description:
          "Assume the shape of a known Beast form as a Bonus Action, gaining its physical traits, speed, and attacks while retaining mental stats.",
      },
    ],
    description: "Magically assume the shape of a beast that you have learned.",
    source: "Player's Handbook (2024), Druid: Wild Shape",
  },
  wildCompanion: {
    id: "embers:druid:wild-companion",
    name: "Wild Companion",
    kind: "class_feature",
    status: "verified",
    classes: ["druid"],
    activationType: "action",
    operations: [
      {
        type: "apply_effect",
        name: "Fey Familiar",
        description:
          "Action expend 1 Wild Shape to cast Find Familiar without material components; the familiar is a Fey and disappears after a Long Rest.",
      },
    ],
    description:
      "Summon a nature spirit familiar using a use of your Wild Shape.",
    source: "Player's Handbook (2024), Druid: Wild Companion",
  },
  ...CIRCLE_OF_BLOOD_FORMULAS,
  ...CIRCLE_OF_ENTROPY_FORMULAS,
  ...CIRCLE_OF_MUTATION_FORMULAS,
  ...CIRCLE_OF_THE_CITY_FORMULAS,
  ...CIRCLE_OF_THE_LAND_FORMULAS,
  ...CIRCLE_OF_THE_MOON_FORMULAS,
  ...CIRCLE_OF_THE_SEA_FORMULAS,
  ...CIRCLE_OF_THE_STARS_FORMULAS,
};

export {
  CIRCLE_OF_BLOOD_FORMULAS,
  CIRCLE_OF_ENTROPY_FORMULAS,
  CIRCLE_OF_MUTATION_FORMULAS,
  CIRCLE_OF_THE_CITY_FORMULAS,
  CIRCLE_OF_THE_LAND_FORMULAS,
  CIRCLE_OF_THE_MOON_FORMULAS,
  CIRCLE_OF_THE_SEA_FORMULAS,
  CIRCLE_OF_THE_STARS_FORMULAS,
};
