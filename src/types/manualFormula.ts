export type ManualFormulaStatus = "needs-review" | "verified";

export type ManualActionKind = "action" | "class_feature" | "feat";

export type ManualFormulaKind = "spell" | "cantrip" | ManualActionKind;

export interface WeaponDamageRiderOperation {
  type: "weapon_damage_rider";
  id: string;
  name?: string;
  classId: string;
  subclassId?: string;
  minLevel?: number;
  requiresBuff?: string;
  requiresWeaponProperties?: string[];
  flat?: {
    byClassLevel: Array<{ minLevel: number; value: number }>;
  };
  dice?: string;
  diceByClassLevel?: Array<{ minLevel: number; dice: string }>;
  bonus?: "halfClassLevel";
  damageType?: string;
  damageTypeChoices?: string[];
  defaultChoice?: string;
  frequency?: "every_hit" | "first_hit_per_turn";
}

export type ManualActionOperation =
  | WeaponDamageRiderOperation
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
  cost?: number;
  desc?: string;
  description?: string;
  actionType?: "action" | "bonus" | "reaction" | "none" | "special";
  weaponDamageRider?: {
    damageFormula: string;
    damageType: string;
    condition?: string;
  };
  weaponRider?: WeaponDamageRiderOperation;
}

export interface ActionResourceScaling {
  type: "class_level" | "half_class_level" | "level_table" | "flat";
  classId?: string;
  multiplier?: number;
  table?: Array<{ minLevel: number; value: number }>;
}

export interface ActionResourceConfig {
  name: string;
  maxPerClassLevel?: number;
  canExceedMax?: boolean;
  resetType?: string;
  scaling?: ActionResourceScaling;
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
  resource?: ActionResourceConfig;
  flyoutType?: "options_grid" | "convert_slots" | "heal_pool" | "slot_recovery" | "custom";
  operations: ManualActionOperation[];
  /** Sub-choices / options rendered on the flyout bar (e.g. Metamagic, Maneuvers, Ki) */
  options?: FeatureActionOption[];
  /** Executable weapon damage rider (e.g. Rage bonus, Divine Fury, Sneak Attack) */
  weaponRider?: WeaponDamageRiderOperation;
  weaponDamageRider?: {
    damageFormula: string;
    damageType: string;
    condition?: string;
  };
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
