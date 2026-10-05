import type { ManualActionFormula } from "../../../../types/manualFormula";
import { CUNNING_STRIKE_OPTIONS } from "../../mechanics/classMechanicRegistry";
import { ARCANE_TRICKSTER_FORMULAS } from "./subclasses/arcaneTrickster";
import { ASSASSIN_FORMULAS } from "./subclasses/assassin";
import { HIGHWAY_RIDER_FORMULAS } from "./subclasses/highwayRider";
import { MISFORTUNE_BRINGER_FORMULAS } from "./subclasses/misfortuneBringer";
import { SANGUINE_THIEF_FORMULAS } from "./subclasses/sanguineThief";
import { SCION_OF_THE_THREE_FORMULAS } from "./subclasses/scionOfTheThree";
import { SOULKNIFE_FORMULAS } from "./subclasses/soulknife";
import { THIEF_FORMULAS } from "./subclasses/thief";

export const ROGUE_CLASS_FORMULAS: Record<string, ManualActionFormula> = {
  sneakAttack: {
    id: "embers:rogue:sneak-attack",
    name: "Sneak Attack",
    kind: "class_feature",
    status: "verified",
    classes: ["rogue"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Precision Sneak Damage",
        description:
          "Once per turn when you hit with Advantage (or with an ally within 5 ft) using a Finesse or Ranged weapon, deal extra Sneak Attack damage (d6s scaling with level).",
      },
    ],
    description:
      "Exploit an opponent's distraction to deliver a deadly precision strike.",
    source: "Player's Handbook (2024), Rogue: Sneak Attack",
  },
  cunningAction: {
    id: "embers:rogue:cunning-action",
    name: "Cunning Action",
    kind: "class_feature",
    status: "verified",
    classes: ["rogue"],
    activationType: "bonus",
    operations: [
      {
        type: "apply_effect",
        name: "Nimble Maneuver",
        description:
          "Take Dash, Disengage, or Hide action as a Bonus Action on each of your turns.",
      },
    ],
    description:
      "Quick thinking and agility allow you to move and hide with extreme speed.",
    source: "Player's Handbook (2024), Rogue: Cunning Action",
  },
  cunningStrike: {
    id: "embers:rogue:cunning-strike",
    name: "Cunning Strike",
    kind: "class_feature",
    status: "verified",
    classes: ["rogue"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Tactical Sneak Debuff",
        description:
          "Forego Sneak Attack damage dice to apply tactical effects: Poison (1d6, CON save vs Poisoned), Trip (1d6, DEX save vs Prone), Withdraw (1d6, half speed disengage), Daze (2d6), Knock Out (6d6), or Obscure (3d6).",
      },
    ],
    description:
      "Forego raw damage to trip, poison, blind, or knock out foes on sneak attacks.",
    source: "Player's Handbook (2024), Rogue: Cunning Strike",
  },
  ...ARCANE_TRICKSTER_FORMULAS,
  ...ASSASSIN_FORMULAS,
  ...HIGHWAY_RIDER_FORMULAS,
  ...MISFORTUNE_BRINGER_FORMULAS,
  ...SANGUINE_THIEF_FORMULAS,
  ...SCION_OF_THE_THREE_FORMULAS,
  ...SOULKNIFE_FORMULAS,
  ...THIEF_FORMULAS,
};

export {
  CUNNING_STRIKE_OPTIONS,
  ARCANE_TRICKSTER_FORMULAS,
  ASSASSIN_FORMULAS,
  HIGHWAY_RIDER_FORMULAS,
  MISFORTUNE_BRINGER_FORMULAS,
  SANGUINE_THIEF_FORMULAS,
  SCION_OF_THE_THREE_FORMULAS,
  SOULKNIFE_FORMULAS,
  THIEF_FORMULAS,
};
