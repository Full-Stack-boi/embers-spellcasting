export type ManualFormulaStatus = "needs-review" | "verified";

export type ManualActionKind = "action" | "class_feature" | "feat";

export type ManualFormulaKind = "spell" | "cantrip" | ManualActionKind;

export type ManualActionOperation =
  | {
      type: "convert_spell_slot_to_resource";
      actionType: "none";
      resourcePerSlotLevel: number;
    }
  | {
      type: "create_spell_slot";
      actionType: "bonus";
      maxSlotLevel: number;
      options: Array<{
        slotLevel: number;
        pointCost: number;
        minimumClassLevel: number;
      }>;
    }
  | {
      type: "attack";
      attackType: "melee" | "ranged" | "spell";
      range?: string;
      attackAbility?: "STR" | "DEX" | "spellcasting";
      damage?: Array<{ dice: string; damageType: string; condition?: string }>;
      onHit?: string;
    }
  | {
      type: "saving_throw";
      ability: "STR" | "DEX" | "CON" | "INT" | "WIS" | "CHA";
      dc: "spell_save" | { fixed: number };
      failure: string;
      success?: string;
    }
  | {
      type: "apply_effect";
      name: string;
      duration?: string;
      description: string;
    }
  | {
      type: "resource_cost";
      resource: string;
      amount: number;
    };

export interface FeatureActionOption {
  id: string;
  name: string;
  cost: number;
  desc: string;
  actionType: "action" | "bonus" | "reaction" | "none";
}

export interface ManualActionFormula {
  id: string;
  name: string;
  kind: ManualActionKind;
  status: ManualFormulaStatus;
  /** Empty for general actions; class features list their owning classes. */
  classes: string[];
  subclass?: string;
  activationType: "action" | "bonus" | "reaction" | "special";
  resource?: {
    name: string;
    maxPerClassLevel?: number;
    canExceedMax?: boolean;
    resetType?: string;
  };
  operations: ManualActionOperation[];
  description?: string;
  source?: string;
  notes?: string;
}

export type ManualFormulaRecord =
  | {
      kind: "spell" | "cantrip";
      status: ManualFormulaStatus;
      formula: import("./spellFormula").SpellFormula;
    }
  | {
      kind: ManualActionKind;
      status: ManualFormulaStatus;
      formula: ManualActionFormula;
    };
