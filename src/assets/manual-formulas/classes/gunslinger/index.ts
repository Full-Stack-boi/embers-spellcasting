import type { ManualActionFormula } from "../../../../types/manualFormula";
import { PISTOLERO_FORMULAS } from "./subclasses/pistolero";

export const GUNSLINGER_CLASS_FORMULAS: Record<string, ManualActionFormula> = {
  riskDice: {
    id: "embers:gunslinger:risk-dice",
    name: "Risk Dice",
    kind: "class_feature",
    status: "verified",
    classes: ["gunslinger"],
    activationType: "special",
    resource: {
      name: "Risk Dice",
      resetType: "Short or Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Risk Dice",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "High Stakes Gamble",
        description:
          "Fuel high-stakes maneuvers, deeds, and trick shots using Risk Dice.",
      },
    ],
    description:
      "Your deadly prowess with firearms and reckless courage are measured by your pool of Risk Dice.",
    source: "Valda's Spire of Secrets: Player Pack 2, Gunslinger: Risk Dice",
  },

  ...PISTOLERO_FORMULAS,
};

export { PISTOLERO_FORMULAS };
