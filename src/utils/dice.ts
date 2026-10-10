export interface RollResult {
    total: number;
    breakdown: string;
    isNat20?: boolean;
    isNat1?: boolean;
    rolls: number[];
}

/**
 * Rolls a formula like "1d20+6", "1d4+4", "2d6+3", "0", or compound "1d4+4 + 1d8".
 */
export function rollFormula(formula: string): RollResult {
    const cleaned = (formula || "").trim().toLowerCase();
    if (!cleaned) {
        return { total: 0, breakdown: "0", rolls: [] };
    }

    // Split on '+' or '-' while preserving signs for compound rolls
    // e.g. "1d4+4+1d8" or "1d4+4"
    const diceRegex = /([+-]?\s*\d*)d(\d+)/gi;
    let total = 0;
    const rolls: number[] = [];
    const parts: string[] = [];
    let isNat20 = false;
    let isNat1 = false;

    // Track which parts were dice
    let remainder = cleaned;
    let match: RegExpExecArray | null;

    while ((match = diceRegex.exec(cleaned)) !== null) {
        const fullMatch = match[0];
        const countStr = match[1].replace(/\s+/g, "").replace("+", "");
        let count = 1;
        let sign = 1;

        if (countStr.startsWith("-")) {
            sign = -1;
            const stripped = countStr.slice(1);
            count = stripped ? parseInt(stripped, 10) : 1;
        } else if (countStr) {
            count = parseInt(countStr, 10);
        }

        const die = parseInt(match[2], 10);
        const currentRolls: number[] = [];
        let rollSum = 0;

        for (let i = 0; i < count; i++) {
            const r = Math.floor(Math.random() * die) + 1;
            currentRolls.push(r);
            rolls.push(r);
            rollSum += r;
        }

        if (count === 1 && die === 20) {
            if (currentRolls[0] === 20) isNat20 = true;
            if (currentRolls[0] === 1) isNat1 = true;
        }

        total += sign * rollSum;
        const rollDisplay = currentRolls.length === 1 ? `[${currentRolls[0]}]` : `[${currentRolls.join(", ")}]`;
        parts.push(sign < 0 ? `-${rollDisplay}` : rollDisplay);

        remainder = remainder.replace(fullMatch, " ");
    }

    // Parse any remaining fixed integers (e.g., "+4", "-2", "0")
    const fixedRegex = /([+-]?\s*\d+)/g;
    let fixedMatch: RegExpExecArray | null;
    while ((fixedMatch = fixedRegex.exec(remainder)) !== null) {
        const str = fixedMatch[1].replace(/\s+/g, "");
        if (!str) continue;
        const val = parseInt(str, 10);
        if (!isNaN(val)) {
            total += val;
            parts.push(val >= 0 ? `+${val}` : `${val}`);
        }
    }

    const breakdown = parts.length > 0 ? `${parts.join(" ")} = ${total}` : `${total}`;
    return {
        total,
        breakdown,
        isNat20,
        isNat1,
        rolls
    };
}

export interface ExplodingRollResult {
    baseRolls: number[];
    explodedRolls: number[];
    allRolls: number[];
    total: number;
    explosionCount: number;
    maxExplosions: number;
    breakdown: string;
}

/**
 * Rolls exploding dice (e.g. Sorcerous Burst, Great Weapon Fighting, etc.).
 * When any die rolls >= triggerValue (default max face), another die is rolled and added,
 * up to maxExplosions times.
 *
 * Clean text breakdown without unnecessary emojis.
 */
export function rollExplodingDice(
    count: number,
    faces: number,
    triggerValue: number = faces,
    maxExplosions: number = 0,
    bonus: number = 0
): ExplodingRollResult {
    const baseRolls: number[] = [];
    const explodedRolls: number[] = [];
    let pendingExplosions = 0;

    // Roll base dice
    for (let i = 0; i < count; i++) {
        const r = Math.floor(Math.random() * faces) + 1;
        baseRolls.push(r);
        if (r >= triggerValue && (explodedRolls.length + pendingExplosions) < maxExplosions) {
            pendingExplosions++;
        }
    }

    // Process explosions sequentially (each explosion can also trigger further explosions if under cap)
    while (pendingExplosions > 0 && explodedRolls.length < maxExplosions) {
        pendingExplosions--;
        const ex = Math.floor(Math.random() * faces) + 1;
        explodedRolls.push(ex);
        if (ex >= triggerValue && (explodedRolls.length + pendingExplosions) < maxExplosions) {
            pendingExplosions++;
        }
    }

    const allRolls = [...baseRolls, ...explodedRolls];
    const rollSum = allRolls.reduce((sum, r) => sum + r, 0);
    const total = rollSum + bonus;

    const baseStr = `[${baseRolls.join(", ")}]`;
    const bonusStr = bonus !== 0 ? (bonus > 0 ? ` + ${bonus}` : ` - ${Math.abs(bonus)}`) : "";

    let breakdown = baseStr;
    if (explodedRolls.length > 0) {
        breakdown += ` + Exploded [${explodedRolls.join(", ")}]`;
    }
    if (bonusStr) {
        breakdown += bonusStr;
    }
    breakdown += ` = ${total}`;

    if (explodedRolls.length > 0) {
        breakdown += ` (${explodedRolls.length} bonus ${explodedRolls.length > 1 ? "dice" : "die"})`;
    }

    return {
        baseRolls,
        explodedRolls,
        allRolls,
        total,
        explosionCount: explodedRolls.length,
        maxExplosions,
        breakdown
    };
}

/**
 * Parses a formula like "1d8", "2d8", "3d8" and rolls it with exploding dice support.
 */
export function rollFormulaWithExplosion(
    formula: string,
    triggerValue: number = 8,
    maxExplosions: number = 0
): ExplodingRollResult {
    const match = (formula || "").trim().toLowerCase().match(/^(\d+)d(\d+)([+-]\d+)?$/);
    if (match) {
        const count = parseInt(match[1], 10);
        const faces = parseInt(match[2], 10);
        const bonus = match[3] ? parseInt(match[3], 10) : 0;
        return rollExplodingDice(count, faces, triggerValue, maxExplosions, bonus);
    }
    // Fallback if not a simple XdY formula
    const res = rollFormula(formula);
    return {
        baseRolls: res.rolls,
        explodedRolls: [],
        allRolls: res.rolls,
        total: res.total,
        explosionCount: 0,
        maxExplosions,
        breakdown: res.breakdown
    };
}

/**
/**
 * Doubles the dice count in a formula for critical hits (e.g. 1d10+3 -> 2d10+3, 2d6 -> 4d6).
 */
export function doubleDiceFormula(formula: string): string {
    return (formula || "").replace(/(\d*)d(\d+)/gi, (_match, countStr, die) => {
        const count = countStr ? parseInt(countStr, 10) : 1;
        return `${count * 2}d${die}`;
    });
}

export function combineDamageBonus(formula: string, bonus: number): string {
    if (!bonus || isNaN(bonus)) return formula;
    const trimmed = (formula || "").trim();
    if (!trimmed) return bonus >= 0 ? `+${bonus}` : `${bonus}`;

    const modMatch = trimmed.match(/^([\s\S]*?)([+-]\s*\d+)$/);
    if (modMatch) {
        const dicePart = modMatch[1].trim();
        const existingMod = parseInt(modMatch[2].replace(/\s+/g, ""), 10);
        const newMod = existingMod + bonus;
        if (newMod === 0) return dicePart;
        return newMod > 0 ? `${dicePart}+${newMod}` : `${dicePart}${newMod}`;
    }

    return bonus > 0 ? `${trimmed}+${bonus}` : `${trimmed}${bonus}`;
}

export interface AttackRollResult {
    total: number;
    message: string;
    formatted: string;
    isCrit: boolean;
    isMiss: boolean;
    d20: number;
    bonus: number;
    mode: "normal" | "advantage" | "disadvantage";
    rolls: number[];
}

/**
 * Rolls an attack roll (1d20 + bonus) with optional Advantage or Disadvantage in clean D&D Beyond format.
 */
export function rollAttack(
    bonus: number,
    name: string = "",
    mode: "normal" | "advantage" | "disadvantage" = "normal"
): AttackRollResult {
    const d1 = Math.floor(Math.random() * 20) + 1;
    const d2 = Math.floor(Math.random() * 20) + 1;

    let chosen = d1;
    let modeTag = "";

    if (mode === "advantage") {
        chosen = Math.max(d1, d2);
        modeTag = `ADV: [${d1}, ${d2}] -> `;
    } else if (mode === "disadvantage") {
        chosen = Math.min(d1, d2);
        modeTag = `DIS: [${d1}, ${d2}] -> `;
    }

    const total = chosen + bonus;
    const bonusStr = bonus >= 0 ? `+${bonus}` : `${bonus}`;
    const isCrit = chosen === 20;
    const isMiss = chosen === 1;

    let breakdownStr: string;
    if (isCrit) {
        breakdownStr = `(${modeTag}CRIT! 20${bonusStr})`;
    } else if (isMiss) {
        breakdownStr = `(${modeTag}NAT 1: 1${bonusStr})`;
    } else {
        breakdownStr = `(${modeTag}${chosen}${bonusStr})`;
    }

    const formatted = `To Hit: ${total} ${breakdownStr}`.trim();
    const message = name ? `${name} - ${formatted}` : formatted;

    return {
        total,
        message,
        formatted,
        isCrit,
        isMiss,
        d20: chosen,
        bonus,
        mode,
        rolls: mode === "normal" ? [d1] : [d1, d2]
    };
}

export interface DDBDamageResult {
    total: number;
    damageType: string;
    breakdown: string;
    formatted: string;
    message: string;
    explosionCount?: number;
}

/**
 * Rolls damage and formats it cleanly matching D&D Beyond style (e.g. "Damage: 12 Force (9+3)").
 */
export function rollDamageDDB(
    damageFormula: string,
    damageType: string = "",
    attackName: string = "",
    isCrit: boolean = false
): DDBDamageResult {
    let formula = damageFormula;
    if (isCrit) {
        formula = doubleDiceFormula(damageFormula);
    }
    const res = rollFormula(formula);
    const typeStr = damageType ? ` ${damageType}` : "";
    const dicePart = res.breakdown.replace(/ = \d+$/, "").replace(/\[|\]/g, "").replace(/\s+/g, "");

    const formatted = `Damage: ${res.total}${typeStr} (${dicePart})`;
    const message = attackName ? `${attackName} - ${formatted}` : formatted;

    return {
        total: res.total,
        damageType,
        breakdown: dicePart,
        formatted,
        message
    };
}

/**
 * Rolls damage with exploding dice support (e.g. Sorcerous Burst).
 * Returns DDBDamageResult with exploded dice marked in the breakdown.
 */
export function rollDamageExploding(
    damageFormula: string,
    damageType: string = "",
    triggerValue: number = 8,
    maxExplosions: number = 0,
    attackName: string = "",
    isCrit: boolean = false
): DDBDamageResult {
    let formula = damageFormula;
    if (isCrit) {
        formula = doubleDiceFormula(damageFormula);
    }
    const roll = rollFormulaWithExplosion(formula, triggerValue, maxExplosions);
    const typeStr = damageType ? ` ${damageType}` : "";

    const baseDiceStr = roll.baseRolls.join(", ");
    let breakdown = baseDiceStr;
    if (roll.explodedRolls.length > 0) {
        breakdown += ` + ${roll.explodedRolls.join(", ")} (Exploded)`;
    }

    const formatted = `Damage: ${roll.total}${typeStr} (${breakdown})`;
    const message = attackName ? `${attackName} - ${formatted}` : formatted;

    return {
        total: roll.total,
        damageType,
        breakdown,
        formatted,
        message,
        explosionCount: roll.explosionCount
    };
}

export function rollDamageExplodingAnyDie(
    damageFormula: string,
    damageType: string,
    maxExtraDice: number,
    isCrit = false,
): DDBDamageResult {
    const critFormula = isCrit ? doubleDiceFormula(damageFormula) : damageFormula;
    const tokens = critFormula.match(/\d+d\d+(?:[+-]\d+)?/gi) ?? [];
    let remaining = Math.max(0, Math.floor(maxExtraDice));
    const details: string[] = [];
    let total = 0;
    let explosionCount = 0;
    let expanded = critFormula;
    for (const token of tokens) {
        const match = token.match(/^(\d+)d(\d+)([+-]\d+)?$/i);
        if (!match) continue;
        const result = rollExplodingDice(Number(match[1]), Number(match[2]), Number(match[2]), remaining, Number(match[3] ?? 0));
        remaining -= result.explosionCount;
        explosionCount += result.explosionCount;
        total += result.total;
        details.push(result.breakdown.replace(/ = -?\d+$/, ""));
        expanded = expanded.replace(token, "0");
    }
    if (expanded.replace(/[+\-\s0]/g, "")) {
        const flat = rollFormula(expanded);
        total += flat.total;
        details.push(flat.breakdown.replace(/ = -?\d+$/, ""));
    }
    const breakdown = details.join(" + ") || "0";
    const typeStr = damageType ? ` ${damageType}` : "";
    const formatted = `Damage: ${total}${typeStr} (${breakdown})`;
    return { total, damageType, breakdown, formatted, message: formatted, explosionCount };
}

/**
 * Rolls damage with optional rider (e.g. Booming Blade / Burning Blade) in clean D&D Beyond format.
 */
export function rollDamageBreakdown(
    baseDamage: string,
    damageType: string,
    attackName: string,
    rider?: { name: string; damage: string; damageType?: string; moveTrigger?: string },
    isCrit: boolean = false
): { total: number; message: string; formatted: string } {
    let baseFormula = baseDamage;
    if (isCrit) {
        baseFormula = doubleDiceFormula(baseDamage);
    }
    const baseResult = rollFormula(baseFormula);
    let total = baseResult.total;
    const typeStr = damageType ? ` ${damageType}` : "";
    const baseDiceStr = baseResult.breakdown.replace(/ = \d+$/, "").replace(/\[|\]/g, "").replace(/\s+/g, "");

    let formatted = `Damage: ${total}${typeStr} (${baseDiceStr})`;
    let message = attackName ? `${attackName} - ${formatted}` : formatted;

    if (rider && rider.damage) {
        let riderFormula = rider.damage;
        if (isCrit) {
            riderFormula = doubleDiceFormula(rider.damage);
        }
        const riderResult = rollFormula(riderFormula);
        total += riderResult.total;
        const riderTypeStr = rider.damageType ? ` ${rider.damageType}` : "";
        const riderDiceStr = riderResult.breakdown.replace(/ = \d+$/, "").replace(/\[|\]/g, "").replace(/\s+/g, "");

        formatted = `Damage: ${total}${typeStr} + ${rider.name} (${riderResult.total}${riderTypeStr}) [${baseDiceStr} + ${riderDiceStr}]`;
        message = (attackName ? `${attackName} - ` : "") + `Damage: ${total}${typeStr} + ${rider.name} (${riderResult.total}${riderTypeStr})`;

        if (rider.moveTrigger) {
            formatted += ` • [Target takes ${rider.moveTrigger} if it moves]`;
            message += ` • [Target takes ${rider.moveTrigger} if it moves]`;
        }
    }

    return { total, message, formatted };
}

export interface DetailedDieRoll {
    die: number; // 4, 6, 8, 10, 12, 20, 100
    count: number;
    rolls: number[];
    keptRoll?: number; // for advantage/disadvantage
    droppedRoll?: number;
    subtotal: number;
}

export interface CustomDicePoolResult {
    total: number;
    formula: string;
    breakdown: string;
    diceGroups: DetailedDieRoll[];
    modifier: number;
    d20Mode: "normal" | "advantage" | "disadvantage";
    isNat20?: boolean;
    isNat1?: boolean;
    timestamp: number;
}

/**
 * Rolls an interactive custom dice pool (e.g. 2d6 + 1d8 + 3) matching D&D Beyond's dice roller.
 */
export function rollCustomDicePool(
    pool: Record<number, number>,
    modifier: number = 0,
    d20Mode: "normal" | "advantage" | "disadvantage" = "normal"
): CustomDicePoolResult {
    const diceGroups: DetailedDieRoll[] = [];
    const breakdownParts: string[] = [];
    const formulaParts: string[] = [];
    let diceTotal = 0;
    let isNat20 = false;
    let isNat1 = false;

    // Check if pool is empty; if so, default to 1d20
    const hasAnyDice = Object.values(pool).some(count => count > 0);
    const effectivePool: Record<number, number> = hasAnyDice ? { ...pool } : { 20: 1 };

    // Standard polyhedral dice order
    const standardDice = [4, 6, 8, 10, 12, 20, 100];
    for (const die of standardDice) {
        const count = effectivePool[die] || 0;
        if (count <= 0) continue;

        formulaParts.push(`${count}d${die}`);

        if (die === 20 && count === 1 && (d20Mode === "advantage" || d20Mode === "disadvantage")) {
            const r1 = Math.floor(Math.random() * 20) + 1;
            const r2 = Math.floor(Math.random() * 20) + 1;
            const kept = d20Mode === "advantage" ? Math.max(r1, r2) : Math.min(r1, r2);
            const dropped = d20Mode === "advantage" ? Math.min(r1, r2) : Math.max(r1, r2);

            if (kept === 20) isNat20 = true;
            if (kept === 1) isNat1 = true;

            diceTotal += kept;
            diceGroups.push({
                die: 20,
                count: 1,
                rolls: [r1, r2],
                keptRoll: kept,
                droppedRoll: dropped,
                subtotal: kept
            });
            const modeTag = d20Mode === "advantage" ? "ADV" : "DIS";
            breakdownParts.push(`1d20 ${modeTag}[${kept}, (${dropped})]`);
        } else {
            const rolls: number[] = [];
            let subtotal = 0;
            for (let i = 0; i < count; i++) {
                const r = Math.floor(Math.random() * die) + 1;
                rolls.push(r);
                subtotal += r;
            }

            if (die === 20 && count === 1) {
                if (rolls[0] === 20) isNat20 = true;
                if (rolls[0] === 1) isNat1 = true;
            }

            diceTotal += subtotal;
            diceGroups.push({
                die,
                count,
                rolls,
                subtotal
            });
            breakdownParts.push(`${count}d${die} [${rolls.join(", ")}]`);
        }
    }

    const total = diceTotal + modifier;
    const modStr = modifier > 0 ? ` + ${modifier}` : modifier < 0 ? ` - ${Math.abs(modifier)}` : "";
    const formulaStr = (formulaParts.length > 0 ? formulaParts.join(" + ") : "0") + modStr;
    const breakdown = (breakdownParts.length > 0 ? breakdownParts.join(" + ") : "0") + (modStr ? modStr : "") + ` = ${total}`;

    return {
        total,
        formula: formulaStr,
        breakdown,
        diceGroups,
        modifier,
        d20Mode,
        isNat20,
        isNat1,
        timestamp: Date.now()
    };
}

