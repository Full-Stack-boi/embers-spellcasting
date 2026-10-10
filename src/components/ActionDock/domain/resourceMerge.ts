import type { DDBParsedCharacter } from "../../../types/ddb";
import type { SpellSlotConfig } from "./types";
import { getCharacterFeatures } from "../../../features/characterFeatures/domain/characterFeatureCatalog";
import type { DdbResourceBaseline } from "../../../services/combatStateService";

export type SyncMode = "merge" | "replace";

export function isCharacterCaster(char: DDBParsedCharacter): boolean {
    return (
        (char.casterLevel ?? 0) > 0 ||
        (char.classes || []).some(c =>
            ["wizard", "sorcerer", "cleric", "druid", "bard", "paladin", "ranger", "artificer"].includes(c.name.toLowerCase()) ||
            c.subclass?.toLowerCase().includes("eldritch knight") ||
            c.subclass?.toLowerCase().includes("arcane trickster")
        )
    );
}

export function extractDdbBaseline(char: DDBParsedCharacter): DdbResourceBaseline {
    const spellSlotsUsed: Record<number, number> = {};
    if (char.spellSlots) {
        for (let lvl = 1; lvl <= 9; lvl++) {
            const s = char.spellSlots[lvl];
            if (s && typeof s.used === "number") {
                spellSlotsUsed[lvl] = s.used;
            }
        }
    }

    const pactSlotsUsed = char.pactMagic?.used ?? 0;

    const featureUses: Record<string, number> = {};
    const features = getCharacterFeatures(char);
    for (const feat of features) {
        if (feat.limitedUse && typeof feat.limitedUse.used === "number") {
            featureUses[feat.id] = feat.limitedUse.used;
        }
    }

    const hitDiceUsed: Record<string, number> = {};
    if (char.hitDice) {
        for (const hd of char.hitDice) {
            if (typeof hd.used === "number") {
                hitDiceUsed[hd.die] = hd.used;
            }
        }
    }

    return {
        spellSlotsUsed,
        pactSlotsUsed,
        featureUses,
        hitDiceUsed,
    };
}

export interface MergeSpellSlotsOptions {
    char: DDBParsedCharacter;
    currentSlots: Record<number, SpellSlotConfig>;
    persistedSlotsUsed?: Record<number, number>;
    createdSpellSlots?: Record<number, number>;
    baselineSlotsUsed?: Record<number, number>;
    mode: SyncMode;
}

export function mergeSpellSlots({
    char,
    currentSlots,
    persistedSlotsUsed,
    createdSpellSlots,
    baselineSlotsUsed,
    mode,
}: MergeSpellSlotsOptions): Record<number, SpellSlotConfig> {
    if (!isCharacterCaster(char) || !char.spellSlots) {
        return {};
    }

    const result: Record<number, SpellSlotConfig> = {};

    for (let lvl = 1; lvl <= 9; lvl++) {
        const ddbSlot = char.spellSlots[lvl];
        const ddbMax = ddbSlot ? ddbSlot.max : 0;
        const created = mode === "replace" ? 0 : (createdSpellSlots?.[lvl] ?? 0);
        const totalMax = ddbMax + created;

        if (totalMax <= 0 && (!ddbSlot || ddbSlot.max <= 0)) {
            result[lvl] = { max: 0, used: 0 };
            continue;
        }

        if (mode === "replace") {
            const used = ddbSlot ? Math.min(totalMax, ddbSlot.used) : 0;
            result[lvl] = { max: totalMax, used: Math.max(0, used) };
            continue;
        }

        // Mode is "merge" (auto sync / background / token switch)
        const ddbUsed = ddbSlot ? ddbSlot.used : 0;
        const baseUsed = baselineSlotsUsed?.[lvl];
        const currentSlot = currentSlots[lvl];
        const localUsed = currentSlot !== undefined ? currentSlot.used : persistedSlotsUsed?.[lvl];

        let effectiveUsed: number;
        // If DDB changed its used value compared to last baseline, respect DDB change
        if (baseUsed !== undefined && ddbUsed !== baseUsed) {
            effectiveUsed = ddbUsed;
        } else if (localUsed !== undefined) {
            // Keep local used value
            effectiveUsed = localUsed;
        } else {
            // No local value recorded yet, fallback to DDB used
            effectiveUsed = ddbUsed;
        }

        const clampedUsed = Math.max(0, Math.min(totalMax, effectiveUsed));
        result[lvl] = { max: totalMax, used: clampedUsed };
    }

    return result;
}

export interface MergePactSlotsOptions {
    char: DDBParsedCharacter;
    currentPact: SpellSlotConfig;
    persistedPactUsed?: number;
    baselinePactUsed?: number;
    mode: SyncMode;
}

export function mergePactSlots({
    char,
    currentPact,
    persistedPactUsed,
    baselinePactUsed,
    mode,
}: MergePactSlotsOptions): SpellSlotConfig {
    if (!char.pactMagic || char.pactMagic.max <= 0) {
        return { max: 0, used: 0 };
    }

    const totalMax = char.pactMagic.max;

    if (mode === "replace") {
        return { max: totalMax, used: Math.max(0, Math.min(totalMax, char.pactMagic.used)) };
    }

    const ddbUsed = char.pactMagic.used;
    const baseUsed = baselinePactUsed;
    const localUsed = currentPact.max > 0 ? currentPact.used : (persistedPactUsed ?? currentPact.used);

    let effectiveUsed: number;
    if (baseUsed !== undefined && ddbUsed !== baseUsed) {
        effectiveUsed = ddbUsed;
    } else if (localUsed !== undefined && localUsed > 0) {
        effectiveUsed = localUsed;
    } else if (persistedPactUsed !== undefined && persistedPactUsed > 0) {
        effectiveUsed = persistedPactUsed;
    } else {
        effectiveUsed = ddbUsed;
    }

    return {
        max: totalMax,
        used: Math.max(0, Math.min(totalMax, effectiveUsed)),
    };
}

export interface MergeFeatureUsesOptions {
    char: DDBParsedCharacter;
    currentFeatureUses: Record<string, number>;
    persistedFeatureUses?: Record<string, number>;
    baselineFeatureUses?: Record<string, number>;
    mode: SyncMode;
}

export function mergeFeatureUses({
    char,
    currentFeatureUses,
    persistedFeatureUses,
    baselineFeatureUses,
    mode,
}: MergeFeatureUsesOptions): Record<string, number> {
    const features = getCharacterFeatures(char);
    const result: Record<string, number> = {};

    if (mode === "replace") {
        for (const feat of features) {
            if (feat.limitedUse && feat.limitedUse.max > 0) {
                result[feat.id] = Math.max(0, Math.min(feat.limitedUse.max, feat.limitedUse.used ?? 0));
            }
        }
        return result;
    }

    for (const feat of features) {
        if (!feat.limitedUse || feat.limitedUse.max <= 0) continue;

        const featId = feat.id;
        const max = feat.limitedUse.max;
        const ddbUsed = feat.limitedUse.used ?? 0;
        const baseUsed = baselineFeatureUses?.[featId];
        const localUsed = currentFeatureUses[featId] ?? persistedFeatureUses?.[featId];

        let effectiveUsed: number;
        if (baseUsed !== undefined && ddbUsed !== baseUsed) {
            effectiveUsed = ddbUsed;
        } else if (localUsed !== undefined) {
            effectiveUsed = localUsed;
        } else {
            effectiveUsed = ddbUsed;
        }

        result[featId] = Math.max(0, Math.min(max, effectiveUsed));
    }

    // Preserve any existing keys in currentFeatureUses not in standard features (custom resources)
    for (const [key, val] of Object.entries(currentFeatureUses)) {
        if (result[key] === undefined && typeof val === "number") {
            result[key] = val;
        }
    }

    return result;
}

export interface MergeHitDiceOptions {
    char: DDBParsedCharacter;
    currentHitDiceUsed: Record<string, number>;
    persistedHitDiceUsed?: Record<string, number>;
    baselineHitDiceUsed?: Record<string, number>;
    mode: SyncMode;
}

export function mergeHitDice({
    char,
    currentHitDiceUsed,
    persistedHitDiceUsed,
    baselineHitDiceUsed,
    mode,
}: MergeHitDiceOptions): Record<string, number> {
    if (!char.hitDice || char.hitDice.length === 0) {
        return {};
    }

    const result: Record<string, number> = {};

    for (const hd of char.hitDice) {
        const total = hd.total;
        const ddbUsed = hd.used ?? 0;

        if (mode === "replace") {
            result[hd.die] = Math.max(0, Math.min(total, ddbUsed));
            continue;
        }

        const baseUsed = baselineHitDiceUsed?.[hd.die];
        const localUsed = currentHitDiceUsed[hd.die] ?? persistedHitDiceUsed?.[hd.die];

        let effectiveUsed: number;
        if (baseUsed !== undefined && ddbUsed !== baseUsed) {
            effectiveUsed = ddbUsed;
        } else if (localUsed !== undefined) {
            effectiveUsed = localUsed;
        } else {
            effectiveUsed = ddbUsed;
        }

        result[hd.die] = Math.max(0, Math.min(total, effectiveUsed));
    }

    return result;
}
