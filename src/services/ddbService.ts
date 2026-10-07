import {
    DDBParsedCharacter,
    DDBParsedSpell,
    DDBCharacterClass,
    DDBSpellSlot,
    DDBWeaponAttack,
    DDBFeatureAction,
    DDBSkill,
    DDBSavingThrow,
    DDBProficiencies,
    DDBInventoryItem,
    DDBCurrencies,
    DDBBackgroundInfo,
    DDBNotes,
    DDBSensesInfo
} from "../types/ddb";
import { TokenVisionRules } from "../features/targeting/domain/vision";
import { APP_KEY } from "../config";

export const DDB_CHARACTER_METADATA_KEY = `${APP_KEY}/ddb-character-id`;
// Bump CACHE_VERSION whenever the parsing output format changes significantly.
// This auto-invalidates all old cached character data (prevents stale spells, wrong AC, etc.)
const CACHE_VERSION = "v8"; // v8: fix AC shield vs armor detection and prepared caster spell status
export const DDB_CACHE_STORAGE_PREFIX = `${APP_KEY}/ddb-cache/${CACHE_VERSION}/`;

/**
 * Extracts a numeric D&D Beyond Character ID from a string, URL, or share link.
 * Examples:
 * - "https://www.dndbeyond.com/characters/12345678" -> 12345678
 * - "https://www.dndbeyond.com/profile/Name/characters/12345678" -> 12345678
 * - "https://ddb.ac/characters/12345678" -> 12345678
 * - "12345678" -> 12345678
 */
export function extractDDBCharacterId(input: string): number | null {
    if (!input) return null;
    const trimmed = input.trim();

    // Direct numeric string
    if (/^\d+$/.test(trimmed)) {
        const id = parseInt(trimmed, 10);
        return isNaN(id) ? null : id;
    }

    // Match /characters/<id> in URL
    const match = trimmed.match(/characters\/(\d+)/i);
    if (match && match[1]) {
        const id = parseInt(match[1], 10);
        return isNaN(id) ? null : id;
    }

    return null;
}

/**
 * Calculates D&D 5e Proficiency Bonus from total character level.
 */
export function calculateProficiencyBonus(totalLevel: number): number {
    return Math.floor((Math.max(1, totalLevel) - 1) / 4) + 2;
}

/**
 * Calculates ability score modifier.
 */
export function calculateModifier(score: number): number {
    return Math.floor((score - 10) / 2);
}

/**
 * Map ability ID in DDB (1=STR, 2=DEX, 3=CON, 4=INT, 5=WIS, 6=CHA) to string key
 */
const ABILITY_ID_MAP: Record<number, "str" | "dex" | "con" | "int" | "wis" | "cha"> = {
    1: "str",
    2: "dex",
    3: "con",
    4: "int",
    5: "wis",
    6: "cha"
};

/**
 * Maps D&D Beyond limitedUse resetType integer values to human-readable strings.
 * 1: Short Rest, 2: Long Rest, 3: Dawn, 4: Daily, 5: Weekly
 */
export const DDB_RESET_TYPE_MAP: Record<number, string> = {
    1: "Short Rest",
    2: "Long Rest",
    3: "Dawn",
    4: "Daily",
    5: "Weekly"
};

/**
 * Standard multiclass spell slots table by combined spellcaster level (1-20)
 */
const FULL_CASTER_SLOTS: Record<number, number[]> = {
    1: [2, 0, 0, 0, 0, 0, 0, 0, 0],
    2: [3, 0, 0, 0, 0, 0, 0, 0, 0],
    3: [4, 2, 0, 0, 0, 0, 0, 0, 0],
    4: [4, 3, 0, 0, 0, 0, 0, 0, 0],
    5: [4, 3, 2, 0, 0, 0, 0, 0, 0],
    6: [4, 3, 3, 0, 0, 0, 0, 0, 0],
    7: [4, 3, 3, 1, 0, 0, 0, 0, 0],
    8: [4, 3, 3, 2, 0, 0, 0, 0, 0],
    9: [4, 3, 3, 3, 1, 0, 0, 0, 0],
    10: [4, 3, 3, 3, 2, 0, 0, 0, 0],
    11: [4, 3, 3, 3, 2, 1, 0, 0, 0],
    12: [4, 3, 3, 3, 2, 1, 0, 0, 0],
    13: [4, 3, 3, 3, 2, 1, 1, 0, 0],
    14: [4, 3, 3, 3, 2, 1, 1, 0, 0],
    15: [4, 3, 3, 3, 2, 1, 1, 1, 0],
    16: [4, 3, 3, 3, 2, 1, 1, 1, 0],
    17: [4, 3, 3, 3, 2, 1, 1, 1, 1],
    18: [4, 3, 3, 3, 3, 1, 1, 1, 1],
    19: [4, 3, 3, 3, 3, 2, 1, 1, 1],
    20: [4, 3, 3, 3, 3, 2, 2, 1, 1]
};

import { SpellMetadata } from "../assets/spellInfo";
import {
    extractResetType,
    extractDamageDice,
    extractCantripScaling,
    extractMaxUses,
    extractActivationType
} from "./descriptionParser";

// ─────────────────────────────────────────────────────────────────────────────
// CLASS LEVEL FEATURE REGISTRY
//
// DDB does NOT expose these as modifiers — they are computed purely from class
// level in DDB's own client-side JavaScript. We maintain them here in one place.
//
// HOW TO ADD A NEW CLASS:
//   1. Add an entry below with the class name (lowercase) and a function
//      that takes the class level and returns computed values.
//   2. Use it in parseDDBCharacterData via getClassLevelFeatures().
//   3. Never scatter class name checks throughout the parser.
//
// DETECTION TIP: Instead of checking class names directly, prefer checking for
// class-exclusive modifier types first (e.g. "monk-weapon", "unarmored-movement").
// Only fall back to class name when no modifier signal exists.
// ─────────────────────────────────────────────────────────────────────────────

export interface ClassLevelFeatures {
    /** Die used for Unarmed Strike / Martial Arts (e.g. "1d6") */
    martialArtsDie?: string;
    /** Sneak Attack dice (e.g. "3d6" at Rogue lv5) */
    sneakAttackDice?: string;
    /** Rage damage bonus flat (Barbarian) */
    rageDamageBonus?: number;
    /** Ki/Focus Points max */
    focusPoints?: number;
    /** Lay on Hands HP pool (Paladin) */
    layOnHandsPool?: number;
    /** Bardic Inspiration die (e.g. "1d8") */
    bardicInspirationDie?: string;
    /** Superiority dice die size (Fighter Battle Master) */
    superiorityDie?: string;
    /** Innate Sorcery uses (Sorcerer 2024: 2 / Long Rest) */
    innateSorceryUses?: number;
    /** Sorcery Points pool */
    sorceryPoints?: number;
}

/**
 * Returns the level-based class features for a given class name and level.
 * All values here are sourced from the official 2024 D&D Player's Handbook
 * (the ruleset DDB now uses by default).
 */
export function getClassLevelFeatures(className: string, level: number): ClassLevelFeatures {
    const cls = className.toLowerCase();
    const features: ClassLevelFeatures = {};

    if (cls === "monk") {
        // Martial Arts die: 1d6 (lv1-4), 1d8 (lv5-10), 1d10 (lv11-16), 1d12 (lv17+)
        // Source: 2024 PHB Monk class table
        features.martialArtsDie = level >= 17 ? "1d12" : level >= 11 ? "1d10" : level >= 5 ? "1d8" : "1d6";
        features.focusPoints = level;
    }

    if (cls === "rogue") {
        // Sneak Attack: 1d6 per 2 rogue levels (rounded up)
        const dice = Math.ceil(level / 2);
        features.sneakAttackDice = `${dice}d6`;
    }

    if (cls === "barbarian") {
        // Rage Damage: +2 (lv1-8), +3 (lv9-15), +4 (lv16+)
        features.rageDamageBonus = level >= 16 ? 4 : level >= 9 ? 3 : 2;
    }

    if (cls === "paladin") {
        // Lay on Hands: 5 × paladin level HP pool
        features.layOnHandsPool = level * 5;
    }

    if (cls === "bard") {
        // Bardic Inspiration die: d6 (lv1-4), d8 (lv5-9), d10 (lv10-14), d12 (lv15+)
        features.bardicInspirationDie = level >= 15 ? "1d12" : level >= 10 ? "1d10" : level >= 5 ? "1d8" : "1d6";
    }

    if (cls === "fighter") {
        // Superiority die (Battle Master subclass) — d8 (lv1-9), d10 (lv10-17), d12 (lv18+)
        features.superiorityDie = level >= 18 ? "1d12" : level >= 10 ? "1d10" : "1d8";
    }

    if (cls === "sorcerer") {
        // Innate Sorcery (2024 PHB Level 1 feature):
        // 2 uses per Long Rest, Bonus Action, 1 minute duration.
        // +1 to Sorcerer spell save DC, Advantage on Sorcerer spell attack rolls.
        features.innateSorceryUses = 2;
        features.sorceryPoints = level >= 2 ? level : 0;
    }

    return features;
}

/**
 * Checks if a character has the Potent Cantrip feature (e.g. Evocation Wizard level 6+).
 */
export function hasPotentCantrip(char?: DDBParsedCharacter | null): boolean {
    if (!char) return false;
    const wizardClass = char.classes?.find(c => c.name.toLowerCase() === "wizard");
    if (wizardClass && wizardClass.level >= 6 && wizardClass.subclass?.toLowerCase().includes("evocation")) {
        return true;
    }
    if (char.actions?.some(a => a.name.toLowerCase().includes("potent cantrip"))) return true;
    if (char.feats?.some(f => f.name.toLowerCase().includes("potent cantrip"))) return true;
    return false;
}

/**
 * Checks if a weapon has the Graze mastery property.
 */
export function hasWeaponGraze(weapon?: DDBWeaponAttack | null): boolean {
    if (!weapon) return false;
    return weapon.properties?.some(p => p.toLowerCase().includes("graze")) ?? false;
}

/**
 * 5e / 2024 classes that prepare spells from their class spell list or spellbook daily.
 * For these classes, leveled class spells require explicit preparation (`prepared === true || alwaysPrepared === true`).
 * Known casters (Sorcerer, Warlock, Bard, Ranger) learn spells permanently, so `countsAsKnownSpell === true` grants them.
 */
export const PREPARED_CASTER_CLASSES = ["paladin", "cleric", "druid", "wizard", "artificer"];

export function isClassPreparedCaster(className?: string): boolean {
    if (!className) return false;
    const lower = className.toLowerCase();
    return PREPARED_CASTER_CLASSES.some(c => lower.includes(c));
}

/**
 * Strips HTML tags and decodes common HTML entities from D&D Beyond description text.
 */
export function stripHtml(html?: string): string {
    if (!html) return "";
    return html
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/p>/gi, "\n\n")
        .replace(/<p>/gi, "")
        .replace(/&rsquo;|&lsquo;/g, "'")
        .replace(/&rdquo;|&ldquo;/g, '"')
        .replace(/&mdash;/g, "—")
        .replace(/&ndash;/g, "–")
        .replace(/&nbsp;/g, " ")
        .replace(/<[^>]+>/g, "")
        .trim();
}

/**
 * Normalizes a raw D&D Beyond spell item into DDBParsedSpell
 */
function parseDDBSpell(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spellObj: any,
    source: "class" | "race" | "feat" | "item" | "custom",
    castingClass?: string,
    characterLevel: number = 1
): DDBParsedSpell | null {
    const def = spellObj.definition || spellObj;
    if (!def || !def.name) return null;

    const name: string = def.name;
    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
    const level: number = typeof def.level === "number" ? def.level : 0;
    const rawSchool = def.school || "Evocation";
    const school: string = rawSchool.charAt(0).toUpperCase() + rawSchool.slice(1).toLowerCase();
    const sourceCandidate = def.source ?? (Array.isArray(def.sources) ? def.sources[0] : undefined);
    const sourceBook = typeof sourceCandidate === "string"
        ? sourceCandidate
        : sourceCandidate?.name ?? sourceCandidate?.sourceName ?? sourceCandidate?.title;
    const rulesEdition: DDBParsedSpell["rulesEdition"] = /2014|legacy/i.test(sourceBook ?? "")
        ? "2014"
        : /2024|5\.5e|5\.2/i.test(sourceBook ?? "")
            ? "2024"
            : "unknown";

    // Range
    let rangeFeet = 5;
    let rangeText = "5 ft";
    if (def.range) {
        if (def.range.origin === "Self") {
            rangeFeet = 0;
            rangeText = "Self";
        } else if (def.range.origin === "Touch") {
            rangeFeet = 5;
            rangeText = "Touch";
        } else if (typeof def.range.rangeValue === "number") {
            rangeFeet = def.range.rangeValue;
            rangeText = `${rangeFeet} ft`;
        }
    }

    // AoE
    let aoe: { shape: "Sphere" | "Cone" | "Cube" | "Line"; size: number } | undefined = undefined;
    if (def.range && def.range.aoeType && def.range.aoeValue) {
        const shape = def.range.aoeType as "Sphere" | "Cone" | "Cube" | "Line";
        aoe = {
            shape,
            size: def.range.aoeValue
        };
    }

    // Casting Time
    let castingTime = "1 Action";
    if (def.activation && def.activation.activationTime) {
        const type = def.activation.activationType === 1 ? "Action"
            : def.activation.activationType === 3 ? "Bonus Action"
            : def.activation.activationType === 4 ? "Reaction"
            : def.activation.activationType === 6 ? "Minute"
            : def.activation.activationType === 7 ? "Hour" : "Action";
        castingTime = `${def.activation.activationTime} ${type}${def.activation.activationTime > 1 ? "s" : ""}`;
    }

    // Duration
    let duration = "Instantaneous";
    if (def.duration) {
        if (def.duration.durationInterval === 0 || !def.duration.durationInterval) {
            duration = def.duration.durationType || "Instantaneous";
        } else {
            duration = `${def.duration.durationInterval} ${def.duration.durationUnit || "round"}`;
        }
        if (def.concentration) {
            duration += " (Concentration)";
        }
    }

    // Components
    const comps: string[] = [];
    if (def.components && Array.isArray(def.components)) {
        if (def.components.includes(1)) comps.push("V");
        if (def.components.includes(2)) comps.push("S");
        if (def.components.includes(3)) comps.push("M");
    }
    const components = comps.join(", ") || (def.componentsDescription ? `M (${def.componentsDescription})` : "V, S");

    // Damage & Modifiers
    let damage: string | undefined = undefined;
    let damageType: string | undefined = undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let dmgMod: any = undefined;
    if (def.modifiers && Array.isArray(def.modifiers)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dmgMod = def.modifiers.find((m: any) => m.type === "damage");
        if (dmgMod) {
            damage = dmgMod.die?.diceString || dmgMod.friendlySubtypeName;
            damageType = dmgMod.friendlySubtypeName;
        }
    }
    // Fallback: extract damage from description if not in modifiers
    if (!damage && def.description) {
        const dmgMatch = def.description.match(/(\d+d\d+(?:\s*[+-]\s*\d+)?)\s*([a-zA-Z]+)?\s*damage/i);
        if (dmgMatch) {
            damage = dmgMatch[1] + (dmgMatch[2] ? ` ${dmgMatch[2].charAt(0).toUpperCase() + dmgMatch[2].slice(1).toLowerCase()}` : "");
            if (dmgMatch[2]) damageType = dmgMatch[2];
        }
    }

    // Cantrip scaling (e.g. Chill Touch 1d10 -> 2d10 at level 5+)
    if (level === 0 && characterLevel >= 5) {
        const higherDefs = dmgMod?.atHigherLevels?.higherLevelDefinitions || def.atHigherLevels?.higherLevelDefinitions;
        if (Array.isArray(higherDefs) && higherDefs.length > 0) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const eligible = higherDefs.filter((h: any) => h.level <= characterLevel && h.dice?.diceString);
            if (eligible.length > 0) {
                const highest = eligible[eligible.length - 1];
                damage = highest.dice.diceString;
            }
        }
    }

    // Cantrip beam / attack scaling (e.g. Eldritch Blast 2 beams at level 5+)
    let beamCount = 1;
    const beamDefs = def.atHigherLevels?.higherLevelDefinitions || dmgMod?.atHigherLevels?.higherLevelDefinitions;
    if (Array.isArray(beamDefs) && characterLevel >= 5) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const eligibleBeams = beamDefs.filter((h: any) => h.level <= characterLevel && (h.typeId === 16 || h.details?.toLowerCase().includes("beam") || h.details?.toLowerCase().includes("attack")));
        if (eligibleBeams.length > 0) {
            const highest = eligibleBeams[eligibleBeams.length - 1];
            if (typeof highest.value === "number") {
                beamCount = 1 + highest.value;
            }
        }
    }

    // Notes: beam count, components, concentration, ritual
    const noteParts: string[] = [];
    if (beamCount > 1) {
        noteParts.push(`Count: ${beamCount}`);
    }
    if (components) {
        noteParts.push(components);
    }
    if (def.concentration) {
        noteParts.push("C");
    }
    if (def.ritual) {
        noteParts.push("R");
    }
    const notes = noteParts.join(", ");

    // Save or Attack (strictly requiresAttackRoll, requiresSavingThrow, or explicit spell attack/saving throw text)
    let saveOrAttack: string | undefined = undefined;
    if (def.requiresSavingThrow && def.saveDcAbilityId) {
        const saveAbility = ABILITY_ID_MAP[def.saveDcAbilityId]?.toUpperCase() || "DEX";
        saveOrAttack = `${saveAbility} Save`;
    } else if (def.requiresAttackRoll) {
        saveOrAttack = "Spell Attack";
    } else if (def.description) {
        if (/\b(make a|ranged|melee)\s+spell attack\b/i.test(def.description)) {
            saveOrAttack = "Spell Attack";
        } else {
            const saveMatch = def.description.match(/(Strength|Dexterity|Constitution|Intelligence|Wisdom|Charisma)\s+saving throw/i);
            if (saveMatch) {
                saveOrAttack = `${saveMatch[1].slice(0, 3).toUpperCase()} Save`;
            }
        }
    }

    // Upcastable
    const rawHigher = def.higherLevelsDescription || def.higherLevelDefinitions?.[0]?.description || "";
    const higherLevels = stripHtml(rawHigher);
    const canUpcast = level > 0 && Boolean(higherLevels || damage);

    const usesSpellSlot = spellObj.usesSpellSlot !== false;
    const componentId = typeof spellObj.componentId === "number" ? spellObj.componentId : undefined;

    const isPrepared = level === 0 || source !== "class" || !usesSpellSlot
        ? true
        : isClassPreparedCaster(castingClass)
            ? Boolean(spellObj.prepared === true || spellObj.alwaysPrepared === true)
            : Boolean(spellObj.prepared === true || spellObj.alwaysPrepared === true || spellObj.countsAsKnownSpell === true);

    let finalComponents = components;
    let finalNotes = notes;
    if (!usesSpellSlot) {
        if (
            spellObj.additionalDescription?.toLowerCase().includes("without spell components") ||
            def.description?.toLowerCase().includes("without spell components")
        ) {
            finalComponents = "None";
        }
        if (
            spellObj.additionalDescription?.toLowerCase().includes("focus point") ||
            def.description?.toLowerCase().includes("focus point")
        ) {
            finalNotes = finalNotes ? `${finalNotes}, 1 Focus Point` : "1 Focus Point";
        } else if (!finalNotes.toLowerCase().includes("no slot") && level > 0) {
            finalNotes = finalNotes ? `${finalNotes}, No Spell Slot` : "No Spell Slot";
        }
    }

    return {
        id,
        ddbId: def.id,
        componentId,
        name,
        level,
        school,
        castingTime,
        range: rangeFeet,
        rangeText,
        aoe,
        duration,
        components: finalComponents,
        concentration: Boolean(def.concentration),
        ritual: Boolean(def.ritual),
        damage,
        damageType,
        saveOrAttack,
        notes: finalNotes,
        beamCount: beamCount > 1 ? beamCount : undefined,
        description: stripHtml(def.description || ""),
        higherLevels: higherLevels || undefined,
        sourceBook,
        rulesEdition,
        canUpcast,
        isPrepared,
        alwaysPrepared: Boolean(spellObj.alwaysPrepared),
        usesSpellSlot,
        source,
        castingClass
    };
}

/**
 * Converts a DDBParsedSpell to standard SpellMetadata
 */
export function ddbSpellToMetadata(spell: DDBParsedSpell): SpellMetadata {
    return {
        id: spell.id,
        name: spell.name,
        level: spell.level,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        school: (spell.school as any) || "Evocation",
        castingTime: spell.castingTime,
        range: spell.rangeText || (spell.range ? `${spell.range} ft` : "Self"),
        aoe: spell.aoe ? `${spell.aoe.size} ft ${spell.aoe.shape}` : undefined,
        duration: spell.duration,
        components: spell.components,
        concentration: spell.concentration,
        ritual: spell.ritual,
        damage: spell.damage,
        saveOrAttack: spell.saveOrAttack,
        description: spell.description,
        higherLevels: spell.higherLevels,
        canUpcast: spell.canUpcast
    };
}

/**
 * Parses raw D&D Beyond Character JSON into normalized DDBParsedCharacter
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseDDBCharacterData(raw: any): DDBParsedCharacter {
    const data = raw.data || raw;

    const id: number = data.id;
    const name: string = data.name || "Adventurer";
    const avatarUrl: string = data.avatarUrl || data.decorations?.avatarUrl || "";

    // Parse Classes
    const classes: DDBCharacterClass[] = [];
    const hitDice: Array<{ die: string; total: number; used: number }> = [];
    let totalLevel = 0;
    let casterLevel = 0;
    let pactMagicLevel = 0;
    let pactSlotsMax = 0;

    if (Array.isArray(data.classes)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data.classes.forEach((c: any) => {
            const className = c.definition?.name || "Adventurer";
            const classLvl = c.level || 1;
            totalLevel += classLvl;

            const dieVal = c.definition?.hitDice || 8;
            hitDice.push({
                die: `d${dieVal}`,
                total: classLvl,
                used: c.hitDiceUsed || 0
            });

            classes.push({
                name: className,
                level: classLvl,
                subclass: c.subclassDefinition?.name
            });

            // Spellcaster progression
            const lowerName = className.toLowerCase();
            if (["wizard", "sorcerer", "cleric", "druid", "bard"].includes(lowerName)) {
                casterLevel += classLvl;
            } else if (["paladin", "ranger"].includes(lowerName)) {
                casterLevel += Math.floor(classLvl / 2);
            } else if (["artificer"].includes(lowerName)) {
                casterLevel += Math.ceil(classLvl / 2);
            } else if (lowerName === "warlock") {
                pactMagicLevel = classLvl;
                pactSlotsMax = classLvl >= 11 ? 3 : classLvl >= 2 ? 2 : 1;
            } else if (c.subclassDefinition?.canCastSpells) {
                // Eldritch Knight / Arcane Trickster
                casterLevel += Math.floor(classLvl / 3);
            }
        });
    }

    if (totalLevel === 0) totalLevel = 1;
    const proficiencyBonus = calculateProficiencyBonus(totalLevel);

    // Calculate Base Ability Scores
    const stats = { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 };
    if (Array.isArray(data.stats)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data.stats.forEach((s: any) => {
            const key = ABILITY_ID_MAP[s.id];
            if (key && typeof s.value === "number") {
                stats[key] = s.value;
            }
        });
    }

    // Check if background or feat provided an initial ASI (__INITIAL_ASI)
    // In D&D 2024 / DDB, background feat ASI replaces species initial ASI
    const hasFeatInitialAsi = Array.isArray(data.feats) && data.feats.some((f: any) =>
        f.definition?.categories?.some((c: any) => c.tagName === "__INITIAL_ASI")
    );

    const ABILITY_SUBTYPES: Record<string, keyof typeof stats> = {
        "strength-score": "str",
        "dexterity-score": "dex",
        "constitution-score": "con",
        "intelligence-score": "int",
        "wisdom-score": "wis",
        "charisma-score": "cha",
    };

    // Add racial, feat, background, class, and item bonuses
    const modSources = ["race", "class", "background", "item", "feat"];
    const modifiersList = [
        ...(data.modifiers?.race || []),
        ...(data.modifiers?.class || []),
        ...(data.modifiers?.background || []),
        ...(data.modifiers?.item || []),
        ...(data.modifiers?.feat || [])
    ];
    modSources.forEach(src => {
        const list = data.modifiers?.[src];
        if (Array.isArray(list)) {
            list.forEach((m: any) => {
                if (m.type === "bonus") {
                    const key = ABILITY_SUBTYPES[m.subType] || (m.statId ? ABILITY_ID_MAP[m.statId] : undefined);
                    if (!key || typeof m.value !== "number") return;

                    // If character has a background feat __INITIAL_ASI, skip racial trait __INITIAL_ASI
                    if (src === "race" && hasFeatInitialAsi) {
                        const isRacialInitialAsi = (data.race?.racialTraits || []).some((t: any) => {
                            const matchId = t.definition?.id === m.componentId ||
                                (data.options?.race || []).some((opt: any) => opt.definition?.id === m.componentId && opt.componentId === t.definition?.id);
                            return matchId && t.definition?.categories?.some((c: any) => c.tagName === "__INITIAL_ASI");
                        });
                        if (isRacialInitialAsi) return;
                    }

                    stats[key] += m.value;
                }
            });
        }
    });

    // Add custom bonusStats if available (custom user adjustments in DDB sheet)
    if (Array.isArray(data.bonusStats)) {
        data.bonusStats.forEach((s: any) => {
            const key = ABILITY_ID_MAP[s.id];
            if (key && typeof s.value === "number") {
                stats[key] += s.value;
            }
        });
    }

    // Apply overrideStats if available
    if (Array.isArray(data.overrideStats)) {
        data.overrideStats.forEach((s: any) => {
            const key = ABILITY_ID_MAP[s.id];
            if (key && typeof s.value === "number") {
                stats[key] = s.value;
            }
        });
    }

    // Apply set-score items (e.g. Gauntlets of Ogre Power, Amulet of Health)
    if (Array.isArray(data.modifiers?.item)) {
        data.modifiers.item.forEach((m: any) => {
            if (m.type === "set") {
                const key = ABILITY_SUBTYPES[m.subType];
                if (key && typeof m.value === "number" && m.value > stats[key]) {
                    stats[key] = m.value;
                }
            }
        });
    }

    const modifiers = {
        str: calculateModifier(stats.str),
        dex: calculateModifier(stats.dex),
        con: calculateModifier(stats.con),
        int: calculateModifier(stats.int),
        wis: calculateModifier(stats.wis),
        cha: calculateModifier(stats.cha)
    };

    // Compute per-class spellcasting stats & check for class-specific DC bonuses
    const classSpellStats: import("../types/ddb").DDBClassSpellStats[] = [];
    const saveDCs: number[] = [];

    let globalDcBonus = 0;
    modSources.forEach(src => {
        const list = data.modifiers?.[src];
        if (Array.isArray(list)) {
            list.forEach((m: any) => {
                if (m.type === "bonus" && m.subType === "spell-save-dc" && typeof m.value === "number") {
                    globalDcBonus += m.value;
                }
            });
        }
    });

    classes.forEach(c => {
        const lowerName = c.name.toLowerCase();
        let ability: "INT" | "WIS" | "CHA" | "NONE" = "NONE";
        if (["wizard", "artificer"].includes(lowerName)) {
            ability = "INT";
        } else if (["cleric", "druid", "ranger"].includes(lowerName)) {
            ability = "WIS";
        } else if (["sorcerer", "warlock", "bard", "paladin"].includes(lowerName)) {
            ability = "CHA";
        } else if (c.subclass && ["eldritch knight", "arcane trickster"].some(s => c.subclass?.toLowerCase().includes(s))) {
            ability = "INT";
        }

        if (ability !== "NONE") {
            const mod = modifiers[ability.toLowerCase() as "int" | "wis" | "cha"];
            let classDcBonus = globalDcBonus;
            modSources.forEach(src => {
                const list = data.modifiers?.[src];
                if (Array.isArray(list)) {
                    list.forEach((m: any) => {
                        if (m.type === "bonus" && m.subType === `${lowerName}-spell-save-dc` && typeof m.value === "number") {
                            classDcBonus += m.value;
                        }
                    });
                }
            });

            const classDC = 8 + proficiencyBonus + mod + classDcBonus;
            const classAtk = proficiencyBonus + mod;

            classSpellStats.push({
                className: c.name,
                ability,
                modifier: mod,
                attackBonus: classAtk,
                saveDC: classDC
            });

            if (!saveDCs.includes(classDC)) {
                saveDCs.push(classDC);
            }
        }
    });

    // Primary spellcasting ability
    let spellCastingAbility: "INT" | "WIS" | "CHA" | "NONE" = (classSpellStats[0]?.ability as "INT" | "WIS" | "CHA" | undefined) ?? "NONE";
    if (spellCastingAbility === "NONE") {
        if (modifiers.int >= modifiers.wis && modifiers.int >= modifiers.cha && modifiers.int > 0) {
            spellCastingAbility = "INT";
        } else if (modifiers.wis >= modifiers.cha && modifiers.wis > 0) {
            spellCastingAbility = "WIS";
        } else if (modifiers.cha > 0) {
            spellCastingAbility = "CHA";
        }
    }

    const castMod = (spellCastingAbility === "NONE") ? 0 : modifiers[spellCastingAbility.toLowerCase() as "int" | "wis" | "cha"];
    const spellSaveDC = classSpellStats[0]?.saveDC || (8 + proficiencyBonus + castMod);
    const spellAttackBonus = classSpellStats[0]?.attackBonus || (proficiencyBonus + castMod);
    const spellSaveDCDisplay = saveDCs.length > 1 ? saveDCs.sort((a, b) => a - b).join(" | ") : `${spellSaveDC}`;
    const spellAttackBonusDisplay = `+${spellAttackBonus}`;

    // Calculate Spell Slots
    const spellSlots: Record<number, DDBSpellSlot> = {};
    const maxSlotsArray = FULL_CASTER_SLOTS[Math.min(20, Math.max(1, casterLevel))] || [0, 0, 0, 0, 0, 0, 0, 0, 0];

    for (let lvl = 1; lvl <= 9; lvl++) {
        const max = maxSlotsArray[lvl - 1] || 0;
        // Check used slots from DDB
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const usedEntry = data.spellSlots?.find((s: any) => s.level === lvl);
        const used = usedEntry ? usedEntry.used || 0 : 0;
        spellSlots[lvl] = {
            level: lvl,
            max,
            used: Math.min(max, used)
        };
    }

    // Pact Magic
    let pactMagic: { level: number; max: number; used: number } | undefined = undefined;
    if (pactMagicLevel > 0) {
        const slotLvl = pactMagicLevel >= 9 ? 5 : pactMagicLevel >= 7 ? 4 : pactMagicLevel >= 5 ? 3 : pactMagicLevel >= 3 ? 2 : 1;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pactUsed = data.pactMagic?.find((p: any) => p.level === slotLvl)?.used || 0;
        pactMagic = {
            level: slotLvl,
            max: pactSlotsMax,
            used: Math.min(pactSlotsMax, pactUsed)
        };
    }

    // Parse Spells — only include spells the character actually knows or has prepared.
    // DDB sends the FULL available list in classSpells, not just what's prepared.
    // We must filter using these flags on each spell object:
    //   s.prepared           = true → Wizard, Cleric, Druid, Paladin prepared spells
    //   s.alwaysPrepared     = true → Domain spells, Oath spells, always-on spells
    //   s.countsAsKnownSpell = true → Sorcerer, Warlock, Ranger, Bard known spells
    //   s.definition.level === 0    → Cantrips are always "known"
    const spellsMap = new Map<string, DDBParsedSpell>();

    // Class spells — filtered to only known/prepared
    if (Array.isArray(data.classSpells)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data.classSpells.forEach((cs: any) => {
            const rawCls = Array.isArray(data.classes) ? data.classes.find((rc: any) => rc.id === cs.characterClassId) : undefined;
            const className = rawCls?.definition?.name || classes[0]?.name;

            if (Array.isArray(cs.spells)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                cs.spells.forEach((s: any) => {
                    const spellLevel = s.definition?.level ?? s.level ?? -1;
                    const isCantrip = spellLevel === 0;
                    const isKnownOrPrepared =
                        s.usesSpellSlot === false ||
                        s.prepared === true ||
                        s.alwaysPrepared === true ||
                        s.countsAsKnownSpell === true ||
                        isCantrip;

                    if (!isKnownOrPrepared) return; // skip unprepared/unknown spells

                    const parsed = parseDDBSpell(s, "class", className, totalLevel);
                    if (parsed && !spellsMap.has(parsed.id)) {
                        spellsMap.set(parsed.id, parsed);
                    }
                });
            }
        });
    }

    // 2. data.spells (race, feat, item, class, etc.)
    // Note: data.spells.class MUST be filtered for prepared/known — it contains all class spells!
    // Race/feat/item spells and feature spells (usesSpellSlot === false) are granted unconditionally.
    if (data.spells && typeof data.spells === "object") {
        for (const [key, spellList] of Object.entries(data.spells)) {
            if (Array.isArray(spellList)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const source = (["race", "feat", "item", "class"].includes(key) ? key : "custom") as any;
                const defaultClassName = classes[0]?.name;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (spellList as any[]).forEach((s: any) => {
                    const spellLevel = s.definition?.level ?? s.level ?? -1;
                    // Cantrips, race/feat/item spells, and non-slot feature spells are always granted.
                    // Only skip leveled class spells that are explicitly unprepared, not known, AND use regular spell slots.
                    if (key === "class" && spellLevel > 0 && s.usesSpellSlot !== false && s.prepared === false && !s.alwaysPrepared && !s.countsAsKnownSpell) {
                        return;
                    }

                    const rawCls = Array.isArray(data.classes) && s.characterClassId
                        ? data.classes.find((rc: any) => rc.id === s.characterClassId)
                        : undefined;
                    const spellCastingClass = key === "class"
                        ? (rawCls?.definition?.name || defaultClassName)
                        : undefined;

                    const parsed = parseDDBSpell(s, source, spellCastingClass, totalLevel);
                    if (parsed && !spellsMap.has(parsed.id)) {
                        spellsMap.set(parsed.id, parsed);
                    }
                });
            }
        }
    }

    if (typeof window !== "undefined") {
        console.log(`[DDB Debug] Parsed ${spellsMap.size} spells:`, Array.from(spellsMap.values()).map(s => `${s.name} (lv${s.level}, ${s.source})`));
    }

    // 3. Custom spells
    if (Array.isArray(data.customSpells)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data.customSpells.forEach((s: any) => {
            const parsed = parseDDBSpell(s, "custom", undefined, totalLevel);
            if (parsed && !spellsMap.has(parsed.id)) {
                spellsMap.set(parsed.id, parsed);
            }
        });
    }

    // Apply spell-specific bonus damage modifiers (e.g. Agonizing Blast: type "eldritch-blast", subType "bonus-damage", statId: 6)
    const spellDamageBonuses: Record<string, number> = {};
    modifiersList.forEach((m: any) => {
        if (m.subType === "bonus-damage" && m.isGranted !== false) {
            const spellKey = (m.type || "").toLowerCase().replace(/[^a-z0-9]/g, "");
            const friendlyKey = (m.friendlyTypeName || "").toLowerCase().replace(/[^a-z0-9]/g, "");
            let bonusVal = 0;
            if (typeof m.value === "number") {
                bonusVal = m.value;
            } else if (m.statId) {
                const statKey = ABILITY_ID_MAP[m.statId];
                if (statKey && modifiers[statKey] != null) {
                    bonusVal = modifiers[statKey];
                }
            }
            if (bonusVal !== 0) {
                if (spellKey) spellDamageBonuses[spellKey] = (spellDamageBonuses[spellKey] || 0) + bonusVal;
                if (friendlyKey && friendlyKey !== spellKey) spellDamageBonuses[friendlyKey] = (spellDamageBonuses[friendlyKey] || 0) + bonusVal;
            }
        }
    });

    spellsMap.forEach(spell => {
        const key = spell.name.toLowerCase().replace(/[^a-z0-9]/g, "");
        const bonus = spellDamageBonuses[key];
        if (bonus && spell.damage) {
            const match = spell.damage.match(/^(\d+d\d+)(?:\s*([+-]\s*\d+))?\s*(.*)$/);
            if (match) {
                const baseDice = match[1];
                const existing = match[2] ? parseInt(match[2].replace(/\s+/g, ""), 10) : 0;
                const total = existing + bonus;
                const typeStr = match[3] ? ` ${match[3]}` : (spell.damageType ? ` ${spell.damageType}` : "");
                spell.damage = `${baseDice}${total >= 0 ? `+${total}` : `${total}`}${typeStr}`.trim();
            }
        }
    });

    // Parse Senses
    const senses: TokenVisionRules = {
        darkvision: 0
    };
    modifiersList.forEach(m => {
        if (m.type === "sense") {
            const sub = m.subType?.toLowerCase() || "";
            if (sub.includes("darkvision")) {
                const range = m.value || 60;
                senses.darkvision = Math.max(senses.darkvision || 0, range);
            } else if (sub.includes("blindsight") || sub.includes("blind-fighting")) {
                senses.blindFighting = Math.max(senses.blindFighting || 0, m.value || 10);
            } else if (sub.includes("truesight")) {
                senses.truesight = Math.max(senses.truesight || 0, m.value || 120);
            } else if (sub.includes("tremorsense")) {
                senses.tremorsense = Math.max(senses.tremorsense || 0, m.value || 60);
            }
        }
    });

    // Check for Devil's Sight in feats/class features/options
    const featureNames: string[] = [];

    if (Array.isArray(data.options?.class)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data.options.class.forEach((o: any) => {
            if (o.definition?.name) featureNames.push(o.definition.name.toLowerCase());
            if (o.name) featureNames.push(o.name.toLowerCase());
        });
    }

    if (Array.isArray(data.options?.race)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data.options.race.forEach((o: any) => {
            if (o.definition?.name) featureNames.push(o.definition.name.toLowerCase());
            if (o.name) featureNames.push(o.name.toLowerCase());
        });
    }

    if (Array.isArray(data.feats)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data.feats.forEach((f: any) => {
            if (f.definition?.name) featureNames.push(f.definition.name.toLowerCase());
            if (f.name) featureNames.push(f.name.toLowerCase());
        });
    }

    if (Array.isArray(data.race?.racialTraits)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data.race.racialTraits.forEach((t: any) => {
            if (t.definition?.name) featureNames.push(t.definition.name.toLowerCase());
            if (t.name) featureNames.push(t.name.toLowerCase());
        });
    }

    if (Array.isArray(data.classes)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data.classes.forEach((c: any) => {
            if (Array.isArray(c.classFeatures)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                c.classFeatures.forEach((cf: any) => {
                    if (cf.definition?.name) featureNames.push(cf.definition.name.toLowerCase());
                    if (cf.name) featureNames.push(cf.name.toLowerCase());
                });
            }
        });
    }

    const hasDevilsSight = featureNames.some(name =>
        name.includes("devil's sight") || name.includes("devil’s sight")
    );
    if (hasDevilsSight) {
        senses.devilsSight = true;
    }

    const hasShadowArts = featureNames.some(name =>
        name.includes("shadow arts") || name.includes("warrior of shadow") || name.includes("way of shadow")
    ) || (Array.isArray(data.classes) && data.classes.some((c: any) => c.subclassDefinition?.name?.toLowerCase().includes("shadow")));

    if (hasShadowArts) {
        senses.shadowMonkSight = {
            enabled: true,
            sourceOnly: true, // Only own Darkness per 2024 PHB
            range: 60
        };
        // Shadow Arts grants Darkvision 60 ft, or increases existing Darkvision by 60 ft
        senses.darkvision = Math.max((senses.darkvision || 0) + 60, 120);
    }

    // All modifier sources from DDB — used by weapon, Unarmed Strike, and AC calculations
    const allModSources = ["race", "class", "background", "item", "feat", "classOption"] as const;
    const allModifiers: any[] = [];
    allModSources.forEach(src => {
        const list = (data.modifiers as any)?.[src];
        if (Array.isArray(list)) allModifiers.push(...list);
    });

    // Parse Equipped Weapons & Attacks
    const weapons: DDBWeaponAttack[] = [];
    const knownWeaponCantrips: Array<{ name: string; damage: string; damageType: string }> = [];

    // Check which weapon cantrips the character knows — dynamically extract damage and scaling
    Array.from(spellsMap.values()).forEach(s => {
        const lowerName = s.name.toLowerCase();
        const descDamage = extractCantripScaling(s.description, totalLevel);
        const diceList = extractDamageDice(s.description);
        const primaryDie = diceList[0];

        if (lowerName.includes("booming blade")) {
            const dmg = descDamage || primaryDie?.dice || "1d8";
            knownWeaponCantrips.push({ name: "Booming Blade", damage: dmg, damageType: primaryDie?.type || "Thunder" });
        } else if (lowerName.includes("burning blade")) {
            const dmg = descDamage || primaryDie?.dice || "1d6+3";
            knownWeaponCantrips.push({ name: "Burning Blade", damage: dmg, damageType: primaryDie?.type || "Fire" });
        } else if (lowerName.includes("arc blade")) {
            const dmg = descDamage || primaryDie?.dice || "1d6+3";
            knownWeaponCantrips.push({ name: "Arc Blade", damage: dmg, damageType: primaryDie?.type || "Lightning" });
        } else if (lowerName.includes("frigid blade")) {
            const dmg = descDamage || primaryDie?.dice || "1d6+3";
            knownWeaponCantrips.push({ name: "Frigid Blade", damage: dmg, damageType: primaryDie?.type || "Cold" });
        } else if (lowerName.includes("vengeful blade")) {
            const dmg = descDamage || primaryDie?.dice || "2d8";
            knownWeaponCantrips.push({ name: "Vengeful Blade", damage: dmg, damageType: primaryDie?.type || "Necrotic" });
        } else if (lowerName.includes("green-flame blade")) {
            const dmg = descDamage || primaryDie?.dice || "1d8";
            knownWeaponCantrips.push({ name: "Green-Flame Blade", damage: dmg, damageType: primaryDie?.type || "Fire" });
        } else if (s.level === 0 && (lowerName.includes("blade") || lowerName.includes("strike") || lowerName.includes("smite")) && diceList.length > 0) {
            const dmg = descDamage || primaryDie.dice;
            knownWeaponCantrips.push({ name: s.name, damage: dmg, damageType: primaryDie.type });
        }
    });

    if (Array.isArray(data.inventory)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data.inventory.forEach((inv: any) => {
            if (!inv.equipped) return;
            const def = inv.definition;
            if (!def || def.filterType !== "Weapon") return;

            const weaponName = inv.customName || def.name;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const properties: string[] = (def.properties || []).map((p: any) => p.name || p);
            const isFinesse = properties.some(p => typeof p === "string" && p.toLowerCase() === "finesse");
            const isLight = properties.some(p => typeof p === "string" && p.toLowerCase() === "light");
            const isThrown = properties.some(p => typeof p === "string" && p.toLowerCase() === "thrown");
            const isRanged = def.attackType === 2;

            // Ability mod: Finesse = max(STR, DEX), Ranged = DEX, Melee = STR
            const abilityMod = isRanged
                ? modifiers.dex
                : isFinesse
                    ? Math.max(modifiers.str, modifiers.dex)
                    : modifiers.str;

            // Magic item bonus — read from DDB's own grantedModifiers on the item
            // This handles +1/+2/+3 weapons, Sword of Sharpness, etc. correctly
            let magicBonus = 0;
            const itemModifiers: any[] = [
                ...(inv.definition?.grantedModifiers || []),
                ...(inv.grantedModifiers || [])
            ];
            itemModifiers.forEach((m: any) => {
                if (m.type === "bonus" && (m.subType === "magic" || m.subType === "weapon-attacks") && typeof m.value === "number") {
                    magicBonus = Math.max(magicBonus, m.value);
                }
            });
            // Fallback: read magic bonus from item's own fixedValue enchantment field
            if (magicBonus === 0 && def.magic && typeof def.fixedValue === "number") {
                magicBonus = def.fixedValue;
            }

            // Proficiency: DDB sends isProficient on the inventory item
            const isProficient = inv.isProficient !== false; // true by default if equipped
            const profBonus = isProficient ? proficiencyBonus : 0;

            const toHit = profBonus + abilityMod + magicBonus;
            const baseDice = def.damage?.diceString || "1d4";
            const totalDmgBonus = abilityMod + magicBonus;
            const damageStr = totalDmgBonus > 0 ? `${baseDice}+${totalDmgBonus}` : (totalDmgBonus < 0 ? `${baseDice}${totalDmgBonus}` : baseDice);
            const damageType = def.damageType || (def.type === "Dagger" ? "Piercing" : "Slashing");

            let rangeText = "5 ft. Reach";
            let rangeFeet = 5;
            if (isThrown && def.range && def.longRange) {
                rangeText = `${def.range} (${def.longRange})`;
                rangeFeet = 5;
            } else if (def.range && def.longRange) {
                rangeText = `${def.range} (${def.longRange})`;
                rangeFeet = def.range;
            } else if (def.range) {
                rangeText = `${def.range} ft.`;
                rangeFeet = def.range;
            }

            // Cantrip riders formatting
            const riders: string[] = [];
            if (!isRanged) {
                knownWeaponCantrips.forEach(c => {
                    if (c.name === "Booming Blade") {
                        const moveDmg = totalLevel >= 17 ? "4d8" : totalLevel >= 11 ? "3d8" : totalLevel >= 5 ? "2d8" : "1d8";
                        riders.push(`Booming Blade: ${c.damage} 🌧️, ${moveDmg} 🌧️ (if moves)`);
                    } else if (c.name === "Burning Blade") {
                        riders.push(`Burning Blade: ${c.damage} 🔥`);
                    } else if (c.name === "Arc Blade") {
                        riders.push(`Arc Blade: ${c.damage} ⚡`);
                    } else if (c.name === "Frigid Blade") {
                        riders.push(`Frigid Blade: ${c.damage} ❄️`);
                    } else if (c.name === "Vengeful Blade") {
                        riders.push(`Vengeful Blade: ${c.damage} 💀`);
                    } else {
                        riders.push(`${c.name}: ${c.damage}`);
                    }
                });
            }

            weapons.push({
                id: `weapon_${inv.id || def.id}`,
                name: weaponName,
                isCustom: Boolean(inv.customName),
                type: isRanged ? "ranged" : "melee",
                rangeText,
                rangeFeet,
                reachFeet: !isRanged ? 5 : undefined,
                hasThrown: isThrown,
                thrownRange: isThrown ? (def.range || 20) : undefined,
                thrownLongRange: isThrown ? (def.longRange || 60) : undefined,
                isLight,
                toHit,
                damage: damageStr,
                baseDamageDice: baseDice,
                magicDamageBonus: magicBonus,
                isProficient,
                damageType,
                properties,
                cantripRiders: riders
            });
        });
    }

    // ── Build class level features from the registry ──────────────────────────
    // For features DDB doesn't expose as modifiers, we use the CLASS_LEVEL_FEATURES
    // registry. All class-level logic lives there — not scattered here.
    const classLevelFeatureMap = new Map<string, ReturnType<typeof getClassLevelFeatures>>();
    classes.forEach(c => {
        classLevelFeatureMap.set(c.name.toLowerCase(), getClassLevelFeatures(c.name, c.level));
    });

    // Detect Monk via data signal first (no class name check needed here):
    // "monk-weapon" modifier type only exists on Monk characters in DDB JSON.
    const isMonkCharacter = allModifiers.some((m: any) => m.type === "monk-weapon") ||
        allModifiers.some((m: any) => m.type === "bonus" && m.subType === "unarmored-movement");

    const monkFeatures = isMonkCharacter
        ? (classLevelFeatureMap.get("monk") ?? getClassLevelFeatures("monk", classes.find(c => c.name.toLowerCase() === "monk")?.level ?? 1))
        : null;

    // Unarmed ability: Monk Martial Arts lets you use DEX instead of STR
    const unarmedAbilityMod = isMonkCharacter
        ? Math.max(modifiers.str, modifiers.dex)
        : modifiers.str;

    const unarmedBaseDmg = monkFeatures?.martialArtsDie ?? "1";
    const unarmedDmgTotal = unarmedAbilityMod >= 0
        ? `${unarmedBaseDmg}+${unarmedAbilityMod}`
        : `${unarmedBaseDmg}${unarmedAbilityMod}`;

    weapons.push({
        id: "weapon_unarmed_strike",
        name: "Unarmed Strike",
        type: "melee",
        rangeText: "5 ft. Reach",
        rangeFeet: 5,
        reachFeet: 5,
        toHit: proficiencyBonus + unarmedAbilityMod,
        damage: unarmedDmgTotal,
        damageType: "Bludgeoning",
        properties: ["Melee Attack"]
    });

    // Detect Two-Weapon Fighting eligibility (2+ equipped Light weapons)
    const equippedLightWeapons = weapons.filter(w => w.isLight && w.name !== "Unarmed Strike");
    const hasTwoWeaponFighting = equippedLightWeapons.length >= 2;
    let offhandWeapon: DDBWeaponAttack | undefined = undefined;

    if (hasTwoWeaponFighting && equippedLightWeapons.length >= 2) {
        const offhand = equippedLightWeapons[1];
        let magicBonus = 0;

        // Try reading magic bonus from grantedModifiers on matching inventory item
        if (Array.isArray(data.inventory)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const matchingInv = data.inventory.find((inv: any) => {
                const def = inv.definition || {};
                const weaponName = inv.customName || def.name;
                const matchesId = `weapon_${inv.id || def.id || weaponName?.toLowerCase().replace(/[^a-z0-9]+/g, "_")}` === offhand.id;
                return matchesId || weaponName === offhand.name;
            });
            if (matchingInv) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const itemModifiers: any[] = [
                    ...(matchingInv.definition?.grantedModifiers || []),
                    ...(matchingInv.grantedModifiers || [])
                ];
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                itemModifiers.forEach((m: any) => {
                    if (m.type === "bonus" && (m.subType === "magic" || m.subType === "weapon-attacks") && typeof m.value === "number") {
                        magicBonus = Math.max(magicBonus, m.value);
                    }
                });
                if (magicBonus === 0 && matchingInv.definition?.magic && typeof matchingInv.definition?.fixedValue === "number") {
                    magicBonus = matchingInv.definition.fixedValue;
                }
            }
        }

        // Fallback: substring matching in weapon name (+1, +2, +3)
        if (magicBonus === 0) {
            if (offhand.name.includes("+1")) magicBonus = 1;
            else if (offhand.name.includes("+2")) magicBonus = 2;
            else if (offhand.name.includes("+3")) magicBonus = 3;
        }

        const baseDice = offhand.damage.split("+")[0].split("-")[0] || "1d4";
        const offhandDmg = magicBonus > 0 ? `${baseDice}+${magicBonus}` : baseDice;

        offhandWeapon = {
            ...offhand,
            id: `${offhand.id}_offhand`,
            name: `${offhand.name} (Offhand)`,
            damage: offhandDmg
        };
    }

    // Parse Feature Actions
    const featureActions: DDBFeatureAction[] = [];
    const actionCategories = ["class", "race", "feat"];

    // Check if character actually has Circle Casting as a legitimate class feature or feat
    const hasCircleCastingFeature = ((data.classes as any[]) || []).some((c: any) =>
        (c.classFeatures || []).some((cf: any) =>
            cf.definition?.name?.toLowerCase().includes("circle casting") ||
            cf.definition?.name?.toLowerCase().includes("circle magic")
        )
    ) || ((data.feats as any[]) || []).some((f: any) =>
        f.definition?.name?.toLowerCase().includes("circle casting") ||
        f.definition?.name?.toLowerCase().includes("circle magic")
    );

    actionCategories.forEach(cat => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const list = (data.actions as any)?.[cat];
        if (Array.isArray(list)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            list.forEach((a: any) => {
                if (!a || !a.name) return;
                const lowerName = a.name.toLowerCase();

                // D&D Beyond Bug Workaround:
                // DDB's backend API injects phantom "Circle Spell" actions (e.g. "Initiate a Circle Spell", "Circle Spell: Augment")
                // into actions.class for 2024 spellcasters, even though the web sheet hides them unless the character
                // legitimately possesses a Circle Casting feature. We filter them out to match the real character sheet.
                if (!hasCircleCastingFeature && (lowerName.includes("circle spell") || lowerName.includes("initiate a circle spell"))) {
                    return;
                }

                let activation: DDBFeatureAction["activationType"] = "special";
                if (a.activation?.activationType === 1) activation = "action";
                else if (a.activation?.activationType === 3) activation = "bonus";
                else if (a.activation?.activationType === 4) activation = "reaction";
                else if (a.activation?.activationType === 2) activation = "none";
                else {
                    const descAct = extractActivationType(stripHtml(a.snippet || a.description || ""));
                    if (descAct) activation = descAct;
                }

                let limitedUse: DDBFeatureAction["limitedUse"] = undefined;
                if (a.limitedUse) {
                    const max = a.limitedUse.useProficiencyBonus
                        ? proficiencyBonus
                        : (a.limitedUse.maxUses || 0);
                    const used = a.limitedUse.numberUsed || 0;
                    const resetFromMap = typeof a.limitedUse.resetType === "string"
                        ? a.limitedUse.resetType
                        : DDB_RESET_TYPE_MAP[a.limitedUse.resetType];
                    const resetFromDesc = !resetFromMap
                        ? extractResetType(stripHtml(a.snippet || a.description || ""))
                        : null;
                    const reset = resetFromMap || resetFromDesc || "Long Rest";
                    if (max > 0) {
                        limitedUse = { max, used, resetType: reset };
                    }
                }

                // Fallback: extract max uses and reset type from description if limitedUse was omitted
                if (!limitedUse) {
                    const descText = stripHtml(a.snippet || a.description || "");
                    const descMax = extractMaxUses(descText);
                    if (descMax && descMax > 0) {
                        const descReset = extractResetType(descText) || "Long Rest";
                        limitedUse = { max: descMax, used: 0, resetType: descReset };
                    }
                }

                // Fallback for key class resources if DDB omitted limitedUse
                if (a.name && cat === "class") {
                    const lowerName = a.name.toLowerCase();
                    if (!limitedUse && (lowerName.includes("focus point") || lowerName.includes("ki point")) && classLevelFeatureMap.get("monk")?.focusPoints) {
                        limitedUse = { max: classLevelFeatureMap.get("monk")!.focusPoints!, used: 0, resetType: "Short Rest" };
                    }
                    if (lowerName.includes("innate sorcery") || lowerName.includes("activate innate sorcery")) {
                        if (!limitedUse) {
                            limitedUse = { max: 2, used: 0, resetType: "Long Rest" };
                        }
                        activation = "bonus";
                    }
                }

                const rangeVal = a.range?.range || a.range?.rangeValue;
                const rangeText = rangeVal ? `${rangeVal} ft.` : "-- ft. Reach";

                featureActions.push({
                    id: `action_${cat}_${a.id || a.name.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`,
                    componentId: typeof a.id === "number" ? a.id : (typeof a.componentId === "number" ? a.componentId : undefined),
                    name: a.name,
                    source: cat as "class" | "race" | "feat",
                    activationType: activation,
                    description: stripHtml(a.snippet || a.description || ""),
                    rawDescription: a.description || a.snippet || "",
                    rangeText,
                    limitedUse
                });
            });
        }
    });

    // Universal Class & Subclass Features Ingestion:
    // DDB sends active and future class features in data.classes[].classFeatures
    // and data.classes[].subclassDefinition.classFeatures.
    // Ingest all active features (requiredLevel <= classLevel && !hideInSheet)
    // deduplicating with actions already extracted.
    const existingActionNames = new Set(featureActions.map(f => f.name.toLowerCase().trim()));

    if (Array.isArray(data.classes)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data.classes.forEach((c: any) => {
            const classLevel = c.level || 1;
            const classFeatureList: any[] = [
                ...(Array.isArray(c.classFeatures) ? c.classFeatures : []),
                ...(Array.isArray(c.subclassDefinition?.classFeatures) ? c.subclassDefinition.classFeatures : [])
            ];

            classFeatureList.forEach((cf: any) => {
                const def = cf.definition || cf;
                if (!def || !def.name) return;
                const reqLevel = def.requiredLevel ?? 1;
                if (reqLevel > classLevel) return;
                if (def.hideInSheet === true) return;

                const normName = def.name.toLowerCase().trim();
                if (existingActionNames.has(normName)) return;
                existingActionNames.add(normName);

                let activation: DDBFeatureAction["activationType"] = "special";
                if (def.activation?.activationType === 1) activation = "action";
                else if (def.activation?.activationType === 3) activation = "bonus";
                else if (def.activation?.activationType === 4) activation = "reaction";
                else if (def.activation?.activationType === 2) activation = "none";
                else {
                    const descAct = extractActivationType(stripHtml(def.snippet || def.description || ""));
                    if (descAct) activation = descAct;
                }

                const descText = stripHtml(def.snippet || def.description || "");

                featureActions.push({
                    id: `class_feature_${def.id || normName.replace(/[^a-z0-9]+/g, "_")}`,
                    componentId: typeof def.id === "number" ? def.id : undefined,
                    name: def.name,
                    source: "class",
                    activationType: activation,
                    description: descText,
                    rawDescription: def.description || def.snippet || "",
                    rangeText: "--",
                    limitedUse: undefined
                });
            });
        });
    }

    // ── Inject class level computed values into feature actions ────────────────
    // For features that DDB sends in actions but without computed dice/pools,
    // we enrich them using the class feature registry.
    featureActions.forEach(feat => {
        const lowerName = feat.name.toLowerCase();
        classes.forEach(c => {
            const cf = classLevelFeatureMap.get(c.name.toLowerCase());
            if (!cf) return;

            // Append computed stats to description where relevant
            if (lowerName.includes("bardic inspiration") && cf.bardicInspirationDie) {
                feat.description = `[${cf.bardicInspirationDie}] ${feat.description}`.trim();
            }
            if ((lowerName.includes("rage") || lowerName === "rage") && cf.rageDamageBonus !== undefined) {
                feat.description = `[+${cf.rageDamageBonus} damage] ${feat.description}`.trim();
            }
            if (lowerName.includes("lay on hands") && cf.layOnHandsPool !== undefined) {
                feat.description = `[Pool: ${cf.layOnHandsPool} HP] ${feat.description}`.trim();
            }
            if ((lowerName.includes("focus point") || lowerName.includes("ki point")) && cf.focusPoints !== undefined) {
                feat.description = `[${cf.focusPoints} points] ${feat.description}`.trim();
            }
        });
    });

    // ── Add Sneak Attack weapon entry for Rogues ──────────────────────────────
    // Sneak Attack dice are NOT in DDB modifiers — computed from Rogue level.
    const rogueFeatures = classLevelFeatureMap.get("rogue");
    if (rogueFeatures?.sneakAttackDice) {
        // Sneak Attack uses a finesse or ranged weapon's ability mod
        const sneakAbilityMod = Math.max(modifiers.str, modifiers.dex);
        const sneakDmg = sneakAbilityMod >= 0
            ? `${rogueFeatures.sneakAttackDice}+${sneakAbilityMod}`
            : `${rogueFeatures.sneakAttackDice}${sneakAbilityMod}`;
        weapons.push({
            id: "weapon_sneak_attack",
            name: "Sneak Attack",
            type: "melee",
            rangeText: "With Finesse/Ranged weapon",
            rangeFeet: 5,
            reachFeet: 5,
            toHit: proficiencyBonus + sneakAbilityMod,
            damage: sneakDmg,
            damageType: "Weapon damage type",
            properties: ["Sneak Attack", "Finesse or Ranged"]
        });
    }

    // Calculate HP (base + conMod * level + bonusHp - removedHp)
    const conMod = modifiers.con;
    const baseHp = typeof data.baseHitPoints === "number" ? data.baseHitPoints : 0;
    const bonusHp = typeof data.bonusHitPoints === "number" ? data.bonusHitPoints : 0;
    const overrideHp = typeof data.overrideHitPoints === "number" ? data.overrideHitPoints : undefined;
    const maxHp = overrideHp !== undefined ? overrideHp : (baseHp + (conMod * totalLevel) + bonusHp);
    const removedHp = typeof data.removedHitPoints === "number" ? data.removedHitPoints : 0;
    const currentHp = Math.max(0, maxHp - removedHp);
    const tempHp = typeof data.temporaryHitPoints === "number" ? data.temporaryHitPoints : 0;
    const hp: import("../types/ddb").DDBCharacterHP = {
        current: currentHp,
        max: maxHp,
        temp: tempHp
    };

    // Calculate Speed
    let speed = 30;
    if (data.race?.weightSpeeds?.normal?.walk) {
        speed = data.race.weightSpeeds.normal.walk;
    } else if (data.speed?.walk) {
        speed = data.speed.walk;
    }
    // Add speed bonuses — DDB uses "unarmored-movement" for Monk, "speed" / "walking-speed" for others
    // Confirmed from raw JSON: { type: "bonus", subType: "unarmored-movement", value: 10 }
    allModifiers.forEach((m: any) => {
        if (m.type === "bonus" && typeof m.value === "number" &&
            (m.subType === "unarmored-movement" || m.subType === "speed" || m.subType === "walking-speed")) {
            speed += m.value;
        }
    });

    // Calculate Initiative & Advantage
    const dexMod = modifiers.dex;
    let initBonus = 0;
    modifiersList.forEach((m: any) => {
        if (m.type === "bonus" && m.subType === "initiative" && typeof m.value === "number") {
            initBonus += m.value;
        }
    });
    const initiative = dexMod + initBonus;
    const hasInitiativeAdvantage = (data.inventory || []).some((i: any) =>
        i.equipped && (
            i.definition?.name?.toLowerCase().includes("warning") ||
            i.customName?.toLowerCase().includes("warning")
        )
    ) || modifiersList.some((m: any) => m.type === "advantage" && m.subType === "initiative");

    // Calculate Defenses (Resistances, Immunities, Vulnerabilities)
    const resistances: string[] = [];
    const immunities: string[] = [];
    const vulnerabilities: string[] = [];
    modifiersList.forEach((m: any) => {
        const name = m.friendlySubtypeName || m.subType;
        if (!name) return;
        const formatted = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
        if (m.type === "resistance" && !resistances.includes(formatted)) {
            resistances.push(formatted);
        } else if (m.type === "immunity" && !immunities.includes(formatted)) {
            immunities.push(formatted);
        } else if (m.type === "vulnerability" && !vulnerabilities.includes(formatted)) {
            vulnerabilities.push(formatted);
        }
    });

    // -----------------------------------------------------------------------
    // Calculate Armor Class — pure data-driven from DDB modifiers
    // We never check class names. Everything comes from the modifier entries
    // that DDB sends, so any class/subclass/feat that grants AC works automatically.
    // -----------------------------------------------------------------------

    // 1. Override: if the player has set a manual AC override in DDB
    const overrideAc: number | undefined =
        typeof data.overrideArmorClass === "number" ? data.overrideArmorClass : undefined;

    const isShieldItem = (item: any): boolean => {
        if (!item) return false;
        const def = item.definition || {};
        if (def.armorTypeId === 4) return true;
        if (def.filterType === "Shield") return true;
        const subType = (def.subType || "").toLowerCase();
        if (subType === "shield" || subType.includes("shield")) return true;
        const type = (def.type || "").toLowerCase();
        if (type === "shield" || type.includes("shield")) return true;
        const name = (def.name || item.name || item.customName || "").toLowerCase();
        if (name.includes("shield")) return true;
        return false;
    };

    const isBodyArmorItem = (item: any): boolean => {
        if (!item) return false;
        if (isShieldItem(item)) return false;
        const def = item.definition || {};
        if ([1, 2, 3].includes(def.armorTypeId)) return true;
        if (def.filterType === "Armor") return true;
        const type = (def.type || "").toLowerCase();
        if (["light armor", "medium armor", "heavy armor"].includes(type)) return true;
        const subType = (def.subType || "").toLowerCase();
        if (["light armor", "medium armor", "heavy armor"].includes(subType)) return true;
        return false;
    };

    const equippedArmor = (data.inventory || []).find((i: any) => i.equipped && isBodyArmorItem(i));
    const equippedShield = (data.inventory || []).find((i: any) => i.equipped && isShieldItem(i));

    // (allModifiers already collected above, shared between weapon and AC calculation)

    // 3. Compute base AC and DEX cap from equipped armor (or lack thereof)
    let baseAc = 10;
    let addDex = true;
    let maxDex: number | undefined = undefined;

    if (equippedArmor) {
        baseAc = equippedArmor.definition?.armorClass || 10;
        const armorTypeId = equippedArmor.definition?.armorTypeId;
        const armorType = (equippedArmor.definition?.type || "").toLowerCase();
        const armorSubType = (equippedArmor.definition?.subType || "").toLowerCase();
        const isHeavy = armorTypeId === 3 || armorType.includes("heavy") || armorSubType.includes("heavy");
        const isMedium = armorTypeId === 2 || armorType.includes("medium") || armorSubType.includes("medium");

        if (isHeavy) addDex = false;
        else if (isMedium) maxDex = 2;
        // Magic armor +X enchantment (e.g. +1 Breastplate)
        const armorEnchant = equippedArmor.definition?.magic ? (equippedArmor.definition?.armorClass ?? 0) - (equippedArmor.definition?.baseArmorClass ?? equippedArmor.definition?.armorClass ?? 0) : 0;
        void armorEnchant; // already included in armorClass field from DDB
    }

    // 4. DEX contribution (with cap)
    let acDex = addDex ? modifiers.dex : 0;
    if (maxDex !== undefined) acDex = Math.min(acDex, maxDex);

    // 5. Collect every AC-modifying entry from DDB modifiers (no class name checks!)
    //
    //  DDB uses these subTypes for AC:
    //    "armor-class"            → additive bonus (shield, +X enchant, feat, etc.)
    //    "unarmored-armor-class"  → ability score added when unarmored (Monk WIS, Barb CON, etc.)
    //                               can be: { value: N } for fixed (Natural Armor base)
    //                                   or: { statId: N } for "add ability mod" (Unarmored Defense)
    //    "set" type + value       → sets a fixed AC floor (Mage Armor = 13, Natural Armor)

    let extraAbilityBonus = 0; // from Unarmored Defense (e.g. WIS, CON)
    let extraAbilityBonusName: string | undefined = undefined;
    let setAcFloor = 0;        // from Mage Armor / Natural Armor "set" entries
    let bonusAc = 0;           // additive bonuses (shield, Ring of Protection, etc.)
    const additionalAcBonuses: Array<{ label: string; value: number }> = [];

    const ABILITY_NAME_MAP: Record<string, string> = {
        str: "Strength",
        dex: "Dexterity",
        con: "Constitution",
        int: "Intelligence",
        wis: "Wisdom",
        cha: "Charisma"
    };

    if (!equippedArmor) {
        // Check for class features/invocations that grant Mage Armor floor (e.g. Armor of Shadows)
        const hasArmorOfShadows = (data.options?.class || []).some((o: any) =>
            o.definition?.name?.toLowerCase().includes("armor of shadows") ||
            o.name?.toLowerCase().includes("armor of shadows")
        );
        if (hasArmorOfShadows) {
            setAcFloor = Math.max(setAcFloor, 13);
        }

        // Only apply unarmored modifiers when not wearing armor
        allModifiers.forEach((m: any) => {
            if (m.subType === "unarmored-armor-class") {
                if (m.type === "bonus" && typeof m.value === "number") {
                    bonusAc += m.value;
                    additionalAcBonuses.push({
                        label: m.friendlySubtypeName || m.friendlyTypeName || "Unarmored Bonus",
                        value: m.value
                    });
                } else if (m.type === "set" && typeof m.value === "number") {
                    setAcFloor = Math.max(setAcFloor, m.value);
                } else if ((m.type === "set" || m.type === "bonus") && m.statId) {
                    const abilityKey = ABILITY_ID_MAP[m.statId as number];
                    // Monk Unarmored Defense (Wisdom) does not apply with a shield (PHB rules)
                    if (abilityKey === "wis" && isMonkCharacter && equippedShield) {
                        return;
                    }
                    if (abilityKey) {
                        const candidateBonus = modifiers[abilityKey];
                        // Unarmored Defense features do not stack (PHB Multiclass rules: choose highest)
                        if (candidateBonus > extraAbilityBonus || extraAbilityBonus === 0) {
                            extraAbilityBonus = candidateBonus;
                            extraAbilityBonusName = ABILITY_NAME_MAP[abilityKey] || abilityKey.toUpperCase();
                        }
                    }
                }
            }
        });

        // Apply set floor: if any modifier sets a fixed AC base, use it if higher than 10
        if (setAcFloor > baseAc) {
            baseAc = setAcFloor;
            extraAbilityBonus = 0; // Natural Armor / Mage Armor doesn't stack with Unarmored Defense
            extraAbilityBonusName = undefined;
        }
    }

    // 6. Shield and other additive AC bonuses (always apply regardless of armor)
    if (equippedShield) {
        const shieldVal = equippedShield.definition?.armorClass || 2;
        bonusAc += shieldVal;
        additionalAcBonuses.push({
            label: equippedShield.definition?.name || "Shield",
            value: shieldVal
        });
    }
    allModifiers.forEach((m: any) => {
        if (m.isGranted !== false && m.type === "bonus" && m.subType === "armor-class" && typeof m.value === "number") {
            const label = m.friendlySubtypeName || m.friendlyTypeName || "Magic Bonus";
            const isDefenseFightingStyle = label.toLowerCase().includes("defense");
            // Defense fighting style requires wearing armor
            if (isDefenseFightingStyle && !equippedArmor) return;

            bonusAc += m.value;
            additionalAcBonuses.push({
                label,
                value: m.value
            });
        }
    });

    // 7. Final AC = override if set, else compute
    const armorClass = overrideAc !== undefined
        ? overrideAc
        : baseAc + acDex + extraAbilityBonus + bonusAc;

    // 8. Build detailed, fully dynamic AC breakdown from real character data
    const acBreakdown: Array<{ label: string; value: string }> = [];
    if (overrideAc !== undefined) {
        acBreakdown.push({ label: "Manual Override", value: `${overrideAc}` });
    } else {
        if (equippedArmor) {
            acBreakdown.push({
                label: equippedArmor.definition?.name || "Armor",
                value: `${baseAc}`
            });
            if (addDex) {
                acBreakdown.push({
                    label: maxDex !== undefined ? `Dexterity (max +${maxDex})` : "Dexterity",
                    value: acDex >= 0 ? `+${acDex}` : `${acDex}`
                });
            }
        } else {
            // Unarmored
            if (setAcFloor === 13) {
                acBreakdown.push({ label: "Armor of Shadows (Mage Armor)", value: "13" });
            } else if (setAcFloor > 10) {
                acBreakdown.push({ label: "Natural Armor", value: `${baseAc}` });
            } else {
                acBreakdown.push({ label: "Base (Unarmored)", value: "10" });
            }

            acBreakdown.push({
                label: "Dexterity",
                value: acDex >= 0 ? `+${acDex}` : `${acDex}`
            });

            if (extraAbilityBonus !== 0 && extraAbilityBonusName) {
                acBreakdown.push({
                    label: `Unarmored Defense (${extraAbilityBonusName})`,
                    value: extraAbilityBonus >= 0 ? `+${extraAbilityBonus}` : `${extraAbilityBonus}`
                });
            }
        }

        additionalAcBonuses.forEach(b => {
            acBreakdown.push({
                label: b.label,
                value: b.value >= 0 ? `+${b.value}` : `${b.value}`
            });
        });
    }

    // -----------------------------------------------------------------------
    // Saving Throws calculation
    // -----------------------------------------------------------------------
    // Multiclass rule: Saving throw proficiencies ONLY come from the starting class.
    // Secondary classes (isStartingClass === false) do not grant starting saving throws.
    const nonStartingClassFeatureIds = new Set<number>();
    if (Array.isArray(data.classes) && data.classes.length > 1) {
        const startingClass = data.classes.find((c: any) => c.isStartingClass) || data.classes[0];
        data.classes.forEach((c: any) => {
            if (c !== startingClass) {
                (c.classFeatures || []).forEach((f: any) => {
                    if (f.definition?.requiredLevel === 1 || f.definition?.name?.toLowerCase().includes("core")) {
                        if (f.definition?.id) nonStartingClassFeatureIds.add(f.definition.id);
                        if (f.id) nonStartingClassFeatureIds.add(f.id);
                    }
                });
            }
        });
    }

    const savingThrowProficiencies = new Set<string>();
    modifiersList.forEach((m: any) => {
        if (m.type === "proficiency" && m.subType && m.subType.endsWith("-saving-throws")) {
            // Multiclass rule: ignore saving throw proficiency from non-starting class level 1 features
            if (m.componentId && nonStartingClassFeatureIds.has(m.componentId)) {
                return;
            }
            const abl = m.subType.replace("-saving-throws", "");
            if (abl.startsWith("str")) savingThrowProficiencies.add("str");
            else if (abl.startsWith("dex")) savingThrowProficiencies.add("dex");
            else if (abl.startsWith("con")) savingThrowProficiencies.add("con");
            else if (abl.startsWith("int")) savingThrowProficiencies.add("int");
            else if (abl.startsWith("wis")) savingThrowProficiencies.add("wis");
            else if (abl.startsWith("cha")) savingThrowProficiencies.add("cha");
        }
    });

    const savingThrows: Record<"str" | "dex" | "con" | "int" | "wis" | "cha", DDBSavingThrow> = {
        str: { ability: "str", label: "STR", bonus: modifiers.str + (savingThrowProficiencies.has("str") ? proficiencyBonus : 0), proficient: savingThrowProficiencies.has("str") },
        dex: { ability: "dex", label: "DEX", bonus: modifiers.dex + (savingThrowProficiencies.has("dex") ? proficiencyBonus : 0), proficient: savingThrowProficiencies.has("dex") },
        con: { ability: "con", label: "CON", bonus: modifiers.con + (savingThrowProficiencies.has("con") ? proficiencyBonus : 0), proficient: savingThrowProficiencies.has("con") },
        int: { ability: "int", label: "INT", bonus: modifiers.int + (savingThrowProficiencies.has("int") ? proficiencyBonus : 0), proficient: savingThrowProficiencies.has("int") },
        wis: { ability: "wis", label: "WIS", bonus: modifiers.wis + (savingThrowProficiencies.has("wis") ? proficiencyBonus : 0), proficient: savingThrowProficiencies.has("wis") },
        cha: { ability: "cha", label: "CHA", bonus: modifiers.cha + (savingThrowProficiencies.has("cha") ? proficiencyBonus : 0), proficient: savingThrowProficiencies.has("cha") }
    };

    // -----------------------------------------------------------------------
    // Skills calculation (all 18 standard D&D 5e skills)
    // -----------------------------------------------------------------------
    const SKILL_DEFINITIONS: Array<{ key: string; name: string; ability: "str" | "dex" | "con" | "int" | "wis" | "cha"; abilityLabel: string }> = [
        { key: "acrobatics", name: "Acrobatics", ability: "dex", abilityLabel: "DEX" },
        { key: "animal-handling", name: "Animal Handling", ability: "wis", abilityLabel: "WIS" },
        { key: "arcana", name: "Arcana", ability: "int", abilityLabel: "INT" },
        { key: "athletics", name: "Athletics", ability: "str", abilityLabel: "STR" },
        { key: "deception", name: "Deception", ability: "cha", abilityLabel: "CHA" },
        { key: "history", name: "History", ability: "int", abilityLabel: "INT" },
        { key: "insight", name: "Insight", ability: "wis", abilityLabel: "WIS" },
        { key: "intimidation", name: "Intimidation", ability: "cha", abilityLabel: "CHA" },
        { key: "investigation", name: "Investigation", ability: "int", abilityLabel: "INT" },
        { key: "medicine", name: "Medicine", ability: "wis", abilityLabel: "WIS" },
        { key: "nature", name: "Nature", ability: "int", abilityLabel: "INT" },
        { key: "perception", name: "Perception", ability: "wis", abilityLabel: "WIS" },
        { key: "performance", name: "Performance", ability: "cha", abilityLabel: "CHA" },
        { key: "persuasion", name: "Persuasion", ability: "cha", abilityLabel: "CHA" },
        { key: "religion", name: "Religion", ability: "int", abilityLabel: "INT" },
        { key: "sleight-of-hand", name: "Sleight of Hand", ability: "dex", abilityLabel: "DEX" },
        { key: "stealth", name: "Stealth", ability: "dex", abilityLabel: "DEX" },
        { key: "survival", name: "Survival", ability: "wis", abilityLabel: "WIS" }
    ];

    const skillProficiencies = new Set<string>();
    const skillExpertises = new Set<string>();
    modifiersList.forEach((m: any) => {
        const sub = (m.subType || "").toLowerCase();
        if (m.type === "proficiency" && sub) {
            skillProficiencies.add(sub);
        }
        if (m.type === "expertise" && sub) {
            skillExpertises.add(sub);
        }
    });

    const parsedSkills: DDBSkill[] = SKILL_DEFINITIONS.map(def => {
        const isProf = skillProficiencies.has(def.key);
        const isExp = skillExpertises.has(def.key);
        const baseMod = modifiers[def.ability] || 0;
        const bonus = baseMod + (isExp ? proficiencyBonus * 2 : isProf ? proficiencyBonus : 0);
        return {
            key: def.key,
            name: def.name,
            ability: def.ability,
            abilityLabel: def.abilityLabel,
            bonus,
            proficient: isProf,
            expertise: isExp
        };
    });

    // -----------------------------------------------------------------------
    // Senses & Passives
    // -----------------------------------------------------------------------
    const percSkill = parsedSkills.find(s => s.key === "perception");
    const invSkill = parsedSkills.find(s => s.key === "investigation");
    const insSkill = parsedSkills.find(s => s.key === "insight");

    const sensesInfo: DDBSensesInfo = {
        passivePerception: 10 + (percSkill?.bonus ?? modifiers.wis),
        passiveInvestigation: 10 + (invSkill?.bonus ?? modifiers.int),
        passiveInsight: 10 + (insSkill?.bonus ?? modifiers.wis),
        specialSenses: senses.darkvision ? [`Darkvision ${senses.darkvision} ft.`] : []
    };

    // -----------------------------------------------------------------------
    // Proficiencies & Training (Armor, Weapons, Tools, Languages)
    // -----------------------------------------------------------------------
    const armorProfs = new Set<string>();
    const weaponProfs = new Set<string>();
    const toolProfs = new Set<string>();
    const languages = new Set<string>();

    modifiersList.forEach((m: any) => {
        const rawName = m.friendlySubtypeName || m.subType || "";
        if (!rawName) return;
        const formatted = rawName.split("-").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
        if (m.type === "language") {
            languages.add(formatted);
        } else if (m.type === "proficiency") {
            const sub = (m.subType || "").toLowerCase();
            if (sub.includes("armor") || sub.includes("shield")) {
                armorProfs.add(formatted);
            } else if (sub.includes("weapon") || sub.includes("simple") || sub.includes("martial")) {
                weaponProfs.add(formatted);
            } else if (sub.includes("tool") || sub.includes("kit") || sub.includes("instrument") || sub.includes("set") || sub.includes("thieves")) {
                toolProfs.add(formatted);
            }
        }
    });

    const parsedProficiencies: DDBProficiencies = {
        armor: Array.from(armorProfs),
        weapons: Array.from(weaponProfs),
        tools: Array.from(toolProfs),
        languages: Array.from(languages)
    };

    // -----------------------------------------------------------------------
    // Inventory Items & Currencies
    // -----------------------------------------------------------------------
    const parsedInventory: DDBInventoryItem[] = (data.inventory || []).map((i: any, index: number) => {
        const def = i.definition || {};
        const canAttune = Boolean(def.canAttune || i.canAttune || def.requiresAttunement);
        return {
            id: i.id || index,
            name: def.name || "Item",
            quantity: i.quantity || 1,
            equipped: Boolean(i.equipped),
            isAttuned: Boolean(i.isAttuned),
            canAttune,
            requiresAttunement: canAttune,
            weight: typeof def.weight === "number" ? def.weight : 0,
            cost: typeof def.cost === "number" ? def.cost : null,
            rarity: def.rarity || "Common",
            type: def.filterType || def.type || "Other Gear",
            description: stripHtml(def.description || "")
        };
    });

    const attunedCount = parsedInventory.filter(i => i.isAttuned).length;
    const attunement = {
        current: attunedCount,
        max: 3
    };

    const parsedCurrencies: DDBCurrencies = {
        cp: data.currencies?.cp || 0,
        sp: data.currencies?.sp || 0,
        ep: data.currencies?.ep || 0,
        gp: data.currencies?.gp || 0,
        pp: data.currencies?.pp || 0
    };

    // -----------------------------------------------------------------------
    // Background Info & Notes
    // -----------------------------------------------------------------------
    const bgDef = data.background?.definition || {};
    const parsedBackground: DDBBackgroundInfo = {
        name: bgDef.name || "Adventurer",
        description: stripHtml(bgDef.description || bgDef.shortDescription || ""),
        featureName: bgDef.featureName || undefined,
        featureDescription: stripHtml(bgDef.featureDescription || ""),
        traits: {
            personalityTraits: data.traits?.personalityTraits || undefined,
            ideals: data.traits?.ideals || undefined,
            bonds: data.traits?.bonds || undefined,
            flaws: data.traits?.flaws || undefined
        }
    };

    const parsedNotes: DDBNotes = {
        backstory: stripHtml(data.notes?.backstory || ""),
        allies: stripHtml(data.notes?.allies || ""),
        enemies: stripHtml(data.notes?.enemies || ""),
        organizations: stripHtml(data.notes?.organizations || ""),
        otherNotes: stripHtml(data.notes?.otherNotes || "")
    };

    const parsedFeats = Array.isArray(data.feats)
        ? data.feats.map((f: any) => ({
            id: Number(f.id ?? 0),
            name: String(f.definition?.name ?? f.name ?? ""),
            description: stripHtml(f.definition?.description ?? f.description ?? "")
        })).filter((f: any) => f.name.length > 0)
        : undefined;

    return {
        id,
        name,
        avatarUrl,
        level: totalLevel,
        classes,
        stats,
        modifiers,
        proficiencyBonus,
        spellCastingAbility,
        spellSaveDC,
        spellSaveDCDisplay,
        spellAttackBonus,
        spellAttackBonusDisplay,
        classSpellStats,
        spellSlots,
        pactMagic,
        spells: Array.from(spellsMap.values()),
        weapons,
        actions: featureActions,
        hasTwoWeaponFighting,
        offhandWeapon,
        hp,
        hitDice,
        armorClass,
        acBreakdown,
        speed,
        initiative,
        hasInitiativeAdvantage,
        defenses: {
            resistances,
            immunities,
            vulnerabilities
        },
        heroicInspiration: Boolean(data.inspiration ?? data.heroicInspiration ?? false),
        senses,
        savingThrows,
        skills: parsedSkills,
        sensesInfo,
        proficiencies: parsedProficiencies,
        inventory: parsedInventory,
        attunement,
        currencies: parsedCurrencies,
        backgroundInfo: parsedBackground,
        notesInfo: parsedNotes,
        feats: parsedFeats,
        classFeatures: Object.fromEntries(classLevelFeatureMap),
        lastSynced: new Date().toISOString()
    };
}

/**
 * Saves character to local storage cache for offline reliability.
 */
export function cacheDDBCharacter(char: DDBParsedCharacter): void {
    try {
        localStorage.setItem(`${DDB_CACHE_STORAGE_PREFIX}${char.id}`, JSON.stringify(char));
    } catch {
        // LocalStorage quota might be exceeded
    }
}

/**
 * Loads character from local storage cache.
 */
export function getCachedDDBCharacter(characterId: number): DDBParsedCharacter | null {
    try {
        const raw = localStorage.getItem(`${DDB_CACHE_STORAGE_PREFIX}${characterId}`);
        if (!raw) return null;
        return JSON.parse(raw) as DDBParsedCharacter;
    } catch {
        return null;
    }
}

/**
 * Retrieves all D&D Beyond characters currently stored in localStorage cache.
 */
export function getAllCachedDDBCharacters(): DDBParsedCharacter[] {
    const list: DDBParsedCharacter[] = [];
    if (typeof localStorage === "undefined") return list;
    try {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(DDB_CACHE_STORAGE_PREFIX)) {
                const raw = localStorage.getItem(key);
                if (raw) {
                    try {
                        const parsed = JSON.parse(raw) as DDBParsedCharacter;
                        if (parsed && parsed.id) list.push(parsed);
                    } catch {
                        // ignore malformed JSON
                    }
                }
            }
        }
    } catch {
        // storage access errors
    }
    return list;
}

/**
 * Finds a cached character by numeric ID or by name (case-insensitive).
 */
export function findCachedDDBCharacter(identifier: number | string): DDBParsedCharacter | null {
    if (typeof identifier === "number") {
        return getCachedDDBCharacter(identifier);
    }
    const num = Number(identifier);
    if (!isNaN(num) && num > 0) {
        const byId = getCachedDDBCharacter(num);
        if (byId) return byId;
    }
    const all = getAllCachedDDBCharacters();
    const nameLower = identifier.toLowerCase().trim();
    return all.find(c => c.name.toLowerCase().trim() === nameLower) ?? null;
}

/**
 * Fetches character data from D&D Beyond API with multi-tier CORS fallback.
 */
export async function fetchDDBCharacter(characterId: number): Promise<DDBParsedCharacter> {
    const directUrl = `https://character-service.dndbeyond.com/character/v5/character/${characterId}`;
    const localProxyUrl = typeof window !== "undefined" && window.location?.origin
        ? `${window.location.origin}/api/ddb/character/v5/character/${characterId}`
        : `http://localhost:5173/api/ddb/character/v5/character/${characterId}`;

    const proxyCandidates = [
        localProxyUrl,
        directUrl
    ];

    let lastError: Error | null = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let characterJson: any = null;

    for (const url of proxyCandidates) {
        try {
            const res = await fetch(url, {
                headers: {
                    Accept: "application/json"
                }
            });

            if (res.ok) {
                const data = await res.json();
                if (data && (data.data || data.id)) {
                    characterJson = data;
                    break;
                }
            } else {
                // Read response body if available to extract DDB error details
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                let errorData: any = null;
                try {
                    errorData = await res.json();
                } catch {
                    // Ignore non-JSON response body
                }

                const serverMsg = errorData?.data?.serverMessage || errorData?.message || "";
                const isUnauthorized = res.status === 401 || res.status === 403 || serverMsg.toLowerCase().includes("unauthorized");

                if (isUnauthorized) {
                    throw new Error(
                        `Character ${characterId} is set to Private on D&D Beyond. Please edit your character on D&D Beyond, go to the "Home" tab, and change Character Privacy to "Public" (or use "Paste Character JSON directly").`
                    );
                }

                if (res.status === 404) {
                    throw new Error(`Character ${characterId} was not found on D&D Beyond. Please check the character ID or URL.`);
                }

                // If proxy returned a server error (e.g., 500, 502, 503)
                if (url === localProxyUrl && res.status !== 404) {
                    throw new Error(`D&D Beyond returned HTTP ${res.status}${serverMsg ? `: ${serverMsg}` : ""}`);
                }
            }
        } catch (err) {
            lastError = err instanceof Error ? err : new Error(String(err));
            // Break early on definitive errors so we don't mask them with CORS errors
            if (
                lastError.message.includes("Private on D&D Beyond") ||
                lastError.message.includes("not found on D&D Beyond")
            ) {
                break;
            }
        }
    }

    if (!characterJson) {
        // Fallback to cache if network fails
        const cached = getCachedDDBCharacter(characterId);
        if (cached) {
            return cached;
        }

        if (lastError && /failed to fetch|network|load failed/i.test(lastError.message)) {
            throw new Error(
                `Failed to connect to D&D Beyond. If your character is Private, set Character Privacy to "Public" on D&D Beyond, or click "Can't connect? Paste Character JSON directly".`
            );
        }

        throw new Error(lastError ? `Failed to load D&D Beyond character: ${lastError.message}` : `Character ${characterId} not found or inaccessible`);
    }

    const raw = characterJson.data || characterJson;

    // ─── DEBUG: dump raw DDB modifier structure to console ────────────────────
    // Remove this block once all modifier subTypes are confirmed working.
    // Open browser DevTools → Console when syncing a character to inspect.
    if (typeof window !== "undefined") {
        console.group(`[DDB Debug] Raw JSON for character ${raw.id} — ${raw.name}`);
        console.log("📊 modifiers.class:", raw.modifiers?.class?.slice(0, 40));
        console.log("📊 modifiers.race:", raw.modifiers?.race?.slice(0, 20));
        console.log("📊 modifiers.feat:", raw.modifiers?.feat?.slice(0, 20));
        console.log("📊 inventory (equipped weapons):",
            (raw.inventory || []).filter((i: any) => i.equipped && i.definition?.filterType === "Weapon")
                .map((i: any) => ({
                    name: i.definition?.name,
                    isProficient: i.isProficient,
                    grantedModifiers: i.definition?.grantedModifiers,
                    fixedValue: i.definition?.fixedValue,
                    damage: i.definition?.damage,
                    attackType: i.definition?.attackType,
                    properties: (i.definition?.properties || []).map((p: any) => p.name)
                }))
        );
        console.log("📊 actions.class:", (raw.actions?.class || []).slice(0, 10).map((a: any) => ({
            name: a.name,
            activation: a.activation,
            range: a.range
        })));
        // Specifically look for AC-related and Martial Arts modifiers
        const allMods = [
            ...(raw.modifiers?.class || []),
            ...(raw.modifiers?.race || []),
            ...(raw.modifiers?.feat || []),
            ...(raw.modifiers?.item || [])
        ];
        console.log("🛡️ AC-related modifiers (subType includes 'armor' or 'unarmored'):",
            allMods.filter((m: any) => m.subType?.includes("armor") || m.subType?.includes("unarmored"))
        );
        console.log("👊 Unarmed/Martial Arts modifiers:",
            allMods.filter((m: any) => m.subType?.includes("unarmed") || m.subType?.includes("martial"))
        );
        console.groupEnd();
    }
    // ─── END DEBUG ─────────────────────────────────────────────────────────────

    const parsed = parseDDBCharacterData(characterJson);
    cacheDDBCharacter(parsed);
    return parsed;
}

/**
 * Links a DDB character to a specific OBR scene token item.
 */
export async function linkCharacterToToken(tokenId: string, characterId: number): Promise<void> {
    const OBR = (await import("@owlbear-rodeo/sdk")).default;
    await OBR.scene.items.updateItems([tokenId], items => {
        items.forEach(item => {
            item.metadata[DDB_CHARACTER_METADATA_KEY] = characterId;
        });
    });
}

/**
 * Retrieves the linked DDB character ID from an OBR token.
 */
export function getLinkedDDBCharacterId(item: { metadata?: Record<string, unknown> }): number | null {
    if (!item?.metadata) return null;
    const val = item.metadata[DDB_CHARACTER_METADATA_KEY];
    if (typeof val === "number") return val;
    if (typeof val === "string") {
        const id = parseInt(val, 10);
        return isNaN(id) ? null : id;
    }
    return null;
}

/**
 * Unlinks a DDB character from an OBR token item.
 */
export async function unlinkCharacterFromToken(tokenId: string): Promise<void> {
    const OBR = (await import("@owlbear-rodeo/sdk")).default;
    await OBR.scene.items.updateItems([tokenId], items => {
        items.forEach(item => {
            delete item.metadata[DDB_CHARACTER_METADATA_KEY];
        });
    });
}

export const ddbTokenMenuId = `${APP_KEY}/ddb-token-menu`;

/**
 * Registers a right-click context menu item on tokens to sync with D&D Beyond.
 */
export async function setupDDBTokenContextMenuOption(): Promise<void> {
    const OBR = (await import("@owlbear-rodeo/sdk")).default;
    try {
        await OBR.contextMenu.remove(ddbTokenMenuId);
        await OBR.contextMenu.create({
            id: ddbTokenMenuId,
            icons: [{
                icon: "/embers.svg",
                label: "Sync D&D Beyond Character",
                filter: {
                    min: 1,
                    max: 1,
                    some: [
                        { key: "layer", value: "CHARACTER" },
                        { key: "layer", value: "ATTACHMENT" }
                    ]
                }
            }],
            onClick: async (context) => {
                const tokenId = context.items[0]?.id;
                if (tokenId) {
                    const { openDDBSyncModal } = await import("../views/DDBSyncModal");
                    await openDDBSyncModal(tokenId);
                }
            }
        });
    } catch (err) {
        console.error("Failed to setup DDB context menu:", err);
    }
}

