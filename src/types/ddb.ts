import { TokenVisionRules } from "../features/targeting/domain/vision";

export interface DDBSpellSlot {
  level: number;
  max: number;
  used: number;
}

export interface DDBParsedSpell {
  id: string;
  ddbId?: number;
  name: string;
  level: number;
  school: string;
  castingTime: string;
  range: number;
  rangeText: string;
  aoe?: {
    shape: "Sphere" | "Cone" | "Cube" | "Line";
    size: number;
  };
  duration: string;
  components: string;
  concentration: boolean;
  ritual: boolean;
  damage?: string;
  damageType?: string;
  saveOrAttack?: string;
  notes?: string;
  beamCount?: number;
  description: string;
  higherLevels?: string;
  /** Sourcebook metadata from DDB when present; missing for some legacy entries. */
  sourceBook?: string;
  rulesEdition?: "2014" | "2024" | "unknown";
  canUpcast: boolean;
  isPrepared: boolean;
  alwaysPrepared?: boolean;
  usesSpellSlot?: boolean;
  componentId?: number;
  source: "class" | "race" | "feat" | "item" | "custom";
  castingClass?: string;
}

export interface DDBCharacterClass {
  name: string;
  level: number;
  subclass?: string;
}

export interface DDBClassSpellStats {
  className: string;
  ability: "INT" | "WIS" | "CHA";
  modifier: number;
  attackBonus: number;
  saveDC: number;
}

export interface DDBWeaponAttack {
  id: string;
  name: string;
  isCustom?: boolean;
  type: "melee" | "ranged";
  subtype?: string;
  rangeText: string;
  rangeFeet: number;
  reachFeet?: number;
  hasThrown?: boolean;
  thrownRange?: number;
  thrownLongRange?: number;
  isLight?: boolean;
  toHit: number;
  damage: string;
  baseDamageDice?: string;
  magicDamageBonus?: number;
  isProficient?: boolean;
  damageType: string;
  properties: string[];
  cantripRiders?: string[];
}

export interface DDBCharacterHP {
  current: number;
  max: number;
  temp: number;
}

export interface DDBCharacterDefenses {
  resistances: string[];
  immunities: string[];
  vulnerabilities: string[];
}

export interface DDBFeatureAction {
  id: string;
  componentId?: number;
  name: string;
  source: "class" | "race" | "feat";
  activationType?: "action" | "bonus" | "reaction" | "special" | "none";
  description?: string;
  rawDescription?: string;
  sourceBook?: string;
  rangeText?: string;
  limitedUse?: {
    max: number;
    used: number;
    resetType?: string;
  };
}

export interface DDBParsedCharacter {
  id: number;
  name: string;
  avatarUrl: string;
  level: number;
  classes: DDBCharacterClass[];
  stats: {
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
  };
  modifiers: {
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
  };
  proficiencyBonus: number;
  spellCastingAbility: "INT" | "WIS" | "CHA" | "NONE";
  spellSaveDC: number;
  spellSaveDCDisplay: string;
  spellAttackBonus: number;
  spellAttackBonusDisplay: string;
  classSpellStats?: DDBClassSpellStats[];
  casterLevel?: number;
  spellSlots: Record<number, DDBSpellSlot>;
  pactMagic?: {
    level: number;
    max: number;
    used: number;
  };
  spells: DDBParsedSpell[];
  weapons?: DDBWeaponAttack[];
  actions?: DDBFeatureAction[];
  hasTwoWeaponFighting?: boolean;
  offhandWeapon?: DDBWeaponAttack;
  martialArtsDie?: string;
  hp?: DDBCharacterHP;
  hitDice?: Array<{ die: string; total: number; used: number }>;
  armorClass?: number;
  acBreakdown?: Array<{ label: string; value: string }>;
  speed?: number;
  initiative?: number;
  hasInitiativeAdvantage?: boolean;
  defenses?: DDBCharacterDefenses;
  heroicInspiration?: boolean;
  senses: TokenVisionRules;
  /** Ability Saving Throws */
  savingThrows?: Record<
    "str" | "dex" | "con" | "int" | "wis" | "cha",
    DDBSavingThrow
  >;
  /** All 18 Skills */
  skills?: DDBSkill[];
  /** Senses breakdown (Passives & Darkvision) */
  sensesInfo?: DDBSensesInfo;
  /** Proficiencies (Armor, Weapons, Tools, Languages) */
  proficiencies?: DDBProficiencies;
  /** Inventory Items */
  inventory?: DDBInventoryItem[];
  /** Attunement tracker (e.g. 1/3) */
  attunement?: {
    current: number;
    max: number;
  };
  /** Currencies */
  currencies?: DDBCurrencies;
  /** Background Info */
  backgroundInfo?: DDBBackgroundInfo;
  /** Character Notes & Backstory */
  notesInfo?: DDBNotes;
  /** Feats assigned to the character */
  feats?: Array<{ id: number; name: string; description?: string }>;
  /** Class level features computed from the registry (Martial Arts die, Sneak Attack dice, etc.) */
  classFeatures?: Record<
    string,
    import("../services/ddbService").ClassLevelFeatures
  >;
  lastSynced: string;
}

export interface DDBSavingThrow {
  ability: "str" | "dex" | "con" | "int" | "wis" | "cha";
  label: string;
  bonus: number;
  proficient: boolean;
}

export interface DDBSkill {
  key: string;
  name: string;
  ability: "str" | "dex" | "con" | "int" | "wis" | "cha";
  abilityLabel: string;
  bonus: number;
  proficient: boolean;
  expertise?: boolean;
}

export interface DDBSensesInfo {
  passivePerception: number;
  passiveInvestigation: number;
  passiveInsight: number;
  specialSenses: string[];
}

export interface DDBProficiencies {
  armor: string[];
  weapons: string[];
  tools: string[];
  languages: string[];
}

export interface DDBInventoryItem {
  id: number;
  name: string;
  quantity: number;
  equipped: boolean;
  isAttuned?: boolean;
  canAttune?: boolean;
  requiresAttunement?: boolean;
  weight: number;
  cost?: number | null;
  rarity?: string;
  type?: string;
  description?: string;
}

export interface DDBCurrencies {
  cp: number;
  sp: number;
  ep: number;
  gp: number;
  pp: number;
}

export interface DDBBackgroundInfo {
  name: string;
  description?: string;
  featureName?: string;
  featureDescription?: string;
  traits?: {
    personalityTraits?: string;
    ideals?: string;
    bonds?: string;
    flaws?: string;
  };
}

export interface DDBNotes {
  backstory?: string;
  allies?: string;
  enemies?: string;
  organizations?: string;
  otherNotes?: string;
}

export interface DDBSyncState {
  status: "idle" | "loading" | "synced" | "error";
  characterId?: number;
  character?: DDBParsedCharacter;
  error?: string;
  isOffline?: boolean;
}
