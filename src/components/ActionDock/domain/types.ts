import type { DDBInventoryItem, DDBParsedSpell, DDBWeaponAttack } from "../../../types/ddb";

export interface SpellSlotConfig {
    max: number;
    used: number;
}

export type MainTab = "ACTIONS" | "SPELLS" | "INVENTORY" | "FEATURES" | "BACKGROUND" | "NOTES" | "EXTRAS";
export type ActionsFilter = "ALL" | "ATTACK" | "ACTION" | "BONUS ACTION" | "REACTION" | "OTHER" | "LIMITED USE";
export type SpellsFilter = "ALL" | "0" | "1" | "2" | "PACT" | "3+";
export type FeaturesFilter = "ALL" | "CLASS" | "SPECIES" | "FEATS";
export type InventoryFilter = "ALL" | "EQUIPPED" | "ATTUNED" | "WEAPONS" | "ARMOR" | "GEAR";

export interface DockSpell {
    id: string;
    name: string;
    level: number;
    school: string;
    castingTime: string;
    rangeText: string;
    hitOrDc?: string;
    damage?: string;
    damageType?: string;
    notes?: string;
    isPrepared: boolean;
    usesSpellSlot?: boolean;
    componentId?: number;
    fromChar: boolean;
    rawDdbSpell?: DDBParsedSpell;
}

export interface SpellGroup {
    label: string;
    level: number;
    spells: DockSpell[];
}

export type DetailDrawerItem =
    | {
          type: "feature";
          id: string;
          name: string;
          category?: string;
          activationType?: string;
          rangeText?: string;
          description?: string;
          rawDescription?: string;
          componentId?: number;
          limitedUse?: { max: number; used: number; resetType?: string };
      }
    | {
          type: "weapon";
          weapon: DDBWeaponAttack;
      }
    | {
          type: "spell";
          spell: {
              id: string;
              name: string;
              level: number;
              school: string;
              castingTime: string;
              rangeText: string;
              hitOrDc?: string;
              damage?: string;
              damageType?: string;
              notes?: string;
              isPrepared?: boolean;
              usesSpellSlot?: boolean;
              componentId?: number;
              rawDdbSpell?: DDBParsedSpell;
          };
      }
    | {
          type: "item";
          item: DDBInventoryItem;
      }
    | {
          type: "checks";
      }
    | {
          type: "ac";
          ac: number;
          breakdown: Array<{ label: string; value: string }>;
          description: string;
      }
    | {
          type: "hp";
          current: number;
          max: number;
          temp: number;
      }
    | {
          type: "defenses";
          resistances: string[];
          immunities: string[];
          vulnerabilities: string[];
      }
    | {
          type: "log";
      }
    | null;
