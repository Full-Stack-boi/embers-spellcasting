import { TriggerConditionKind } from "./spellFormula";

export type TriggerConditionType = TriggerConditionKind;

export interface ConditionalTrigger {
  id: string;
  spellId: string;
  spellName: string;
  casterId?: string;
  casterName: string;
  targetId: string;
  targetName: string;
  conditionType: TriggerConditionType;
  damageFormula: string;
  damageType: string;
  conditionDescription?: string;
  appliedAt: number;
  initialPosition?: { x: number; y: number };
  expiresRound?: number;
}
