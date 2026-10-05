import type { ManualActionFormula } from "../../../../types/manualFormula";
import { FOCUS_POINT_OPTIONS } from "../../mechanics/classMechanicRegistry";
import { WARRIOR_OF_MERCY_FORMULAS } from "./subclasses/warriorOfMercy";
import { WARRIOR_OF_PRIDE_FORMULAS } from "./subclasses/warriorOfPride";
import { WARRIOR_OF_REGRET_FORMULAS } from "./subclasses/warriorOfRegret";
import { WARRIOR_OF_SHADOW_FORMULAS } from "./subclasses/warriorOfShadow";
import { WARRIOR_OF_THE_ELEMENTS_FORMULAS } from "./subclasses/warriorOfTheElements";
import { WARRIOR_OF_THE_LEADEN_CROWN_FORMULAS } from "./subclasses/warriorOfTheLeadenCrown";
import { WARRIOR_OF_THE_MYSTIC_ARTS_FORMULAS } from "./subclasses/warriorOfTheMysticArts";
import { WARRIOR_OF_THE_OPEN_HAND_FORMULAS } from "./subclasses/warriorOfTheOpenHand";

export const MONK_CLASS_FORMULAS: Record<string, ManualActionFormula> = {
  focusPoints: {
    id: "embers:monk:focus-points",
    name: "Focus Points",
    kind: "class_feature",
    status: "verified",
    classes: ["monk"],
    activationType: "special",
    resource: {
      name: "Focus Points (Ki)",
      resetType: "Short or Long Rest",
    },
    operations: [
      {
        type: "apply_effect",
        name: "Monastic Focus",
        description:
          "Spend Focus to fuel Flurry of Blows (Bonus Action two unarmed strikes), Patient Defense (Bonus Action Disengage and Dodge), Step of the Wind (Bonus Action Dash and Disengage), and Stunning Strike.",
      },
    ],
    description:
      "Harness mystical internal focus to fuel superhuman martial arts abilities.",
    source: "Player's Handbook (2024), Monk: Focus Points",
  },
  deflectAttacks: {
    id: "embers:monk:deflect-attacks",
    name: "Deflect Attacks",
    kind: "class_feature",
    status: "verified",
    classes: ["monk"],
    activationType: "reaction",
    operations: [
      {
        type: "apply_effect",
        name: "Deflect and Redirect",
        description:
          "Reaction reduce damage from any attack roll by 1d10 + Dexterity modifier + Monk level. If reduced to 0, spend 1 Focus Point to redirect the strike/projectile at a target within range.",
      },
    ],
    description:
      "Catch, deflect, and turn aside incoming weapon attacks and projectiles.",
    source: "Player's Handbook (2024), Monk: Deflect Attacks",
  },
  uncannyMetabolism: {
    id: "embers:monk:uncanny-metabolism",
    name: "Uncanny Metabolism",
    kind: "class_feature",
    status: "verified",
    classes: ["monk"],
    activationType: "special",
    resource: {
      name: "Uncanny Metabolism",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "apply_effect",
        name: "Combat Adrenaline Recovery",
        description:
          "When you roll Initiative, regain all expended Focus Points and roll your Martial Arts die + Monk level, regaining that many Hit Points (1/Long Rest).",
      },
    ],
    description:
      "Instantly refresh your entire focus pool and restore HP at the outbreak of battle.",
    source: "Player's Handbook (2024), Monk: Uncanny Metabolism",
  },
  ...WARRIOR_OF_MERCY_FORMULAS,
  ...WARRIOR_OF_PRIDE_FORMULAS,
  ...WARRIOR_OF_REGRET_FORMULAS,
  ...WARRIOR_OF_SHADOW_FORMULAS,
  ...WARRIOR_OF_THE_ELEMENTS_FORMULAS,
  ...WARRIOR_OF_THE_LEADEN_CROWN_FORMULAS,
  ...WARRIOR_OF_THE_MYSTIC_ARTS_FORMULAS,
  ...WARRIOR_OF_THE_OPEN_HAND_FORMULAS,
};

export {
  FOCUS_POINT_OPTIONS,
  WARRIOR_OF_MERCY_FORMULAS,
  WARRIOR_OF_PRIDE_FORMULAS,
  WARRIOR_OF_REGRET_FORMULAS,
  WARRIOR_OF_SHADOW_FORMULAS,
  WARRIOR_OF_THE_ELEMENTS_FORMULAS,
  WARRIOR_OF_THE_LEADEN_CROWN_FORMULAS,
  WARRIOR_OF_THE_MYSTIC_ARTS_FORMULAS,
  WARRIOR_OF_THE_OPEN_HAND_FORMULAS,
};
