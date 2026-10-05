/**
 * Description Intelligence Engine
 * 
 * Extracts mechanical rules, damage dice, cantrip scaling, reset types,
 * and buff effects directly from D&D Beyond description and snippet texts.
 * 
 * This serves as a dynamic, resilient layer that adapts to 2024 PHB updates,
 * errata, and homebrew without requiring hardcoded lists.
 */

export interface ParsedDamageDie {
    dice: string;
    type: string;
    condition?: string;
}

export interface ParsedBuffEffects {
    advantage?: string[];
    disadvantage?: string[];
    damageBonusFlat?: number;
    spellSaveDcBonus?: number;
    spellAttackAdvantage?: boolean;
    attackAdvantage?: boolean;
    resistances?: string[];
    acBonus?: number;
}

/**
 * Extracts reset condition from description text.
 * Used as fallback when structured limitedUse.resetType field is unknown or missing.
 */
export function extractResetType(text: string): "Short Rest" | "Long Rest" | "Dawn" | "Daily" | null {
    if (!text) return null;
    const lower = text.toLowerCase();

    // Check Short Rest (matches "Short Rest", "Short or Long Rest")
    if (lower.includes("short or long rest") || lower.includes("short rest")) {
        return "Short Rest";
    }

    // Check Long Rest
    if (lower.includes("long rest")) {
        return "Long Rest";
    }

    // Check Dawn
    if (lower.includes("at dawn") || lower.includes("each dawn") || lower.includes("next dawn")) {
        return "Dawn";
    }

    // Check Daily / Morning
    if (lower.includes("daily") || lower.includes("each morning") || lower.includes("every morning")) {
        return "Daily";
    }

    return null;
}

/**
 * Extracts all damage dice expressions from description text.
 * Handles patterns such as "1d8 thunder damage", "2d6 fire damage",
 * as well as rider conditions like "if the target moves".
 */
export function extractDamageDice(text: string): ParsedDamageDie[] {
    if (!text) return [];

    const results: ParsedDamageDie[] = [];
    const regex = /(\d+d\d+(?:\s*[+-]\s*\d+)?)\s*([a-zA-Z]+)?\s*damage/gi;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
        const dice = match[1].replace(/\s+/g, "");
        const rawType = match[2] || "";
        const type = rawType ? rawType.charAt(0).toUpperCase() + rawType.slice(1).toLowerCase() : "Untyped";

        // Check surrounding context for conditions
        const contextSlice = text.substring(Math.max(0, match.index - 50), Math.min(text.length, match.index + match[0].length + 50)).toLowerCase();
        let condition: string | undefined = undefined;

        if (contextSlice.includes("if the target moves") || contextSlice.includes("if it moves") || contextSlice.includes("moves 5 feet")) {
            condition = "if moves";
        } else if (contextSlice.includes("critical hit") || contextSlice.includes("on a crit")) {
            condition = "on crit";
        }

        results.push({ dice, type, condition });
    }

    return results;
}

/**
 * Scales cantrip damage based on character level from description text.
 * Reads patterns like:
 * - "at 5th level (2d8), 11th level (3d8), and 17th level (4d8)"
 * - "increases to 2d8 at 5th level, 3d8 at 11th level, and 4d8 at 17th level"
 * Falls back to base damage if characterLevel < 5 or no scaling pattern found.
 */
export function extractCantripScaling(text: string, characterLevel: number): string | null {
    if (!text) return null;

    // Pattern A: "5th level (2d8)" or "at 5th level, ... (2d8)"
    const level17Paren = text.match(/17th\s+level[^)]{0,120}\((\d+d\d+)\)/i);
    const level11Paren = text.match(/11th\s+level[^)]{0,120}\((\d+d\d+)\)/i);
    const level5Paren = text.match(/5th\s+level[^)]{0,120}\((\d+d\d+)\)/i);

    // Pattern B: "increases to 2d8 at 5th level"
    const level17Direct = text.match(/(\d+d\d+)\s+at\s+17th\s+level/i);
    const level11Direct = text.match(/(\d+d\d+)\s+at\s+11th\s+level/i);
    const level5Direct = text.match(/(\d+d\d+)\s+at\s+5th\s+level/i);

    const dice17 = level17Paren?.[1] || level17Direct?.[1];
    const dice11 = level11Paren?.[1] || level11Direct?.[1];
    const dice5 = level5Paren?.[1] || level5Direct?.[1];

    if (characterLevel >= 17 && dice17) return dice17;
    if (characterLevel >= 11 && dice11) return dice11;
    if (characterLevel >= 5 && dice5) return dice5;

    // Base damage before level 5
    const baseDamageMatch = text.match(/(\d+d\d+)\s+([a-zA-Z]+)?\s*damage/i);
    if (baseDamageMatch) {
        return baseDamageMatch[1];
    }

    return null;
}

/**
 * Extracts max uses/charges from description text.
 * Examples:
 * - "you have 3 luck points" -> 3
 * - "can use this feature twice" -> 2
 * - "can use this feature 4 times" -> 4
 */
export function extractMaxUses(text: string): number | null {
    if (!text) return null;
    const lower = text.toLowerCase();

    // Direct digit: "you have 3 luck points", "has 5 charges"
    const pointsMatch = lower.match(/(?:have|has|gain)\s+(\d+)\s+(?:luck\s+points|charges|uses|points)/i);
    if (pointsMatch) {
        const val = parseInt(pointsMatch[1], 10);
        if (!isNaN(val) && val > 0) return val;
    }

    // "X times per"
    const timesMatch = lower.match(/(\d+)\s+times\s+per/i);
    if (timesMatch) {
        const val = parseInt(timesMatch[1], 10);
        if (!isNaN(val) && val > 0) return val;
    }

    // Word quantities
    if (lower.includes("twice per") || lower.includes("use this feature twice") || lower.includes("use this trait twice")) {
        return 2;
    }
    if (lower.includes("once per") || lower.includes("use this feature once") || lower.includes("use this trait once")) {
        return 1;
    }
    if (lower.includes("three times per") || lower.includes("use this feature three times")) {
        return 3;
    }

    return null;
}

/**
 * Extracts activation type from description text.
 * Examples:
 * - "As a Bonus Action on your turn" -> "bonus"
 * - "As a Reaction when" -> "reaction"
 * - "As an Action" -> "action"
 */
export function extractActivationType(text: string): "action" | "bonus" | "reaction" | null {
    if (!text) return null;
    const lower = text.toLowerCase();

    if (/\bas a bonus action\b/i.test(lower) || /\byou can take a bonus action\b/i.test(lower)) {
        return "bonus";
    }
    if (/\bas a reaction\b/i.test(lower) || /\byou can take a reaction\b/i.test(lower)) {
        return "reaction";
    }
    if (/\bas an action\b/i.test(lower) || /\byou can take an action\b/i.test(lower)) {
        return "action";
    }

    return null;
}

/**
 * Extracts buff/stance mechanical effects from description text.
 * Used to dynamically detect bonuses without hardcoded per-feature registries.
 */
export function extractBuffEffects(text: string): ParsedBuffEffects {
    if (!text) return {};
    const lower = text.toLowerCase();
    const effects: ParsedBuffEffects = {};

    // 1. Spell Save DC Bonus
    // e.g. "+1 to Sorcerer spell save DC", "+1 bonus to your spell save DC"
    const dcMatch = lower.match(/\+(\d+)\s*(?:bonus\s+)?(?:to\s+(?:[a-zA-Z]+\s+)?spell\s+save\s+dc)/i);
    if (dcMatch) {
        effects.spellSaveDcBonus = parseInt(dcMatch[1], 10);
    }

    // 2. Spell Attack Advantage
    // e.g. "Advantage on Sorcerer spell attack rolls", "Advantage on spell attack rolls"
    if (/advantage\s+on\s+(?:[a-zA-Z]+\s+)?spell\s+attack\s+rolls/i.test(lower)) {
        effects.spellAttackAdvantage = true;
    }

    // 3. Attack Advantage (general or melee)
    // e.g. "Advantage on melee weapon attack rolls", "Advantage on attack rolls"
    if (/(?:advantage\s+on\s+(?:all\s+)?(?:melee\s+(?:weapon\s+)?)?attack\s+rolls)/i.test(lower) && !effects.spellAttackAdvantage) {
        effects.attackAdvantage = true;
    }

    // 4. Flat Damage Bonus
    // e.g. "+2 bonus to the damage roll", "+2 bonus to melee damage"
    const dmgMatch = lower.match(/\+(\d+)\s*(?:bonus\s+to\s+(?:the\s+)?(?:melee\s+)?damage\s+roll)/i);
    if (dmgMatch) {
        effects.damageBonusFlat = parseInt(dmgMatch[1], 10);
    }

    // 5. Advantage on checks/saves
    const advMatches: string[] = [];
    if (/advantage[^\n.]*\bstrength\s+checks\b/i.test(lower)) advMatches.push("STR Checks");
    if (/advantage[^\n.]*\b(?:strength\s+)?saving\s+throws\b/i.test(lower)) advMatches.push("STR Saves");
    if (/advantage[^\n.]*\bdexterity\s+checks\b/i.test(lower)) advMatches.push("DEX Checks");
    if (/advantage[^\n.]*\bconstitution\s+checks\b/i.test(lower)) advMatches.push("CON Checks");
    if (/advantage[^\n.]*\bacrobatics\s+checks\b/i.test(lower)) advMatches.push("Acrobatics Checks");
    if (advMatches.length > 0) {
        effects.advantage = advMatches;
    }

    // 6. Resistances
    // e.g. "resistance to bludgeoning, piercing, and slashing damage"
    if (lower.includes("bludgeoning, piercing, and slashing")) {
        effects.resistances = ["Bludgeoning", "Piercing", "Slashing"];
    }

    // 7. AC Bonus
    const acMatch = lower.match(/\+(\d+)\s*(?:bonus\s+)?to\s+(?:your\s+)?ac\b/i);
    if (acMatch) {
        effects.acBonus = parseInt(acMatch[1], 10);
    }

    return effects;
}

/**
 * Determines whether a feature description indicates an activatable stance or buff.
 * Looks for duration ("1 minute"), activation timing ("as a bonus action, you enter/activate"),
 * or stance phrasing.
 */
export function isDescriptionActivatableBuff(text: string): boolean {
    if (!text) return false;
    const lower = text.toLowerCase();

    // Check for 1 minute or rounds duration buff phrasing
    const hasDuration = lower.includes("for 1 minute") || lower.includes("lasts for 1 minute") || lower.includes("10 rounds") || lower.includes("until the start of your next turn");
    const hasActivation = lower.includes("as a bonus action") || lower.includes("as an action") || lower.includes("bonus action to");
    const hasStancePhrasing = lower.includes("you enter") || lower.includes("you can enter") || lower.includes("you activate") || lower.includes("you can activate") || lower.includes("while active") || lower.includes("while in this");

    const hasEffects = Object.keys(extractBuffEffects(text)).length > 0;

    return (hasDuration && (hasActivation || hasStancePhrasing || hasEffects)) ||
        (hasStancePhrasing && hasActivation);
}
