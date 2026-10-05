import { PHB_2024_FEAT_FORMULAS } from "./phb2024";
import { GRIM_HOLLOW_FEAT_FORMULAS } from "./grimHollow";
import { ARCANA_UNLEASHED_FEAT_FORMULAS } from "./arcanaUnleashed";
import { VSSPP2_FEAT_FORMULAS } from "./vsspp2";
import type { ManualActionFormula } from "../../../types/manualFormula";

export const ALL_MANUAL_FEAT_FORMULAS: Record<string, ManualActionFormula> = {
  ...PHB_2024_FEAT_FORMULAS,
  ...GRIM_HOLLOW_FEAT_FORMULAS,
  ...ARCANA_UNLEASHED_FEAT_FORMULAS,
  ...VSSPP2_FEAT_FORMULAS,
};

export {
  PHB_2024_FEAT_FORMULAS,
  GRIM_HOLLOW_FEAT_FORMULAS,
  ARCANA_UNLEASHED_FEAT_FORMULAS,
  VSSPP2_FEAT_FORMULAS,
};
