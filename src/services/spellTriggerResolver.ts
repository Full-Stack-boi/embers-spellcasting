import { MechanicConditionalTrigger, SpellFormula, TriggerConditionKind } from "../types/spellFormula";
import { ALL_MANUAL_OVERRIDES } from "../assets/manual-formulas";
import { normalizeSpellId } from "./spellFormulaBuilder";
import { extractCantripScaling, extractDamageDice } from "./descriptionParser";

export interface ResolvedSpellTrigger {
    hasTrigger: boolean;
    conditionType: TriggerConditionKind;
    damageDice: string;
    damageType: string;
    conditionDesc: string;
    immediateOnHitDice?: string;
}

/**
 * Resolves whether a spell has a deferred conditional trigger (like Booming Blade, Vengeful Blade, etc.),
 * extracting the trigger condition, scaled damage dice, and damage type.
 *
 * Fully data-driven: resolves triggers from the spell formula definition and mechanics.
 */
export function resolveSpellConditionalTrigger(
    spellName: string,
    description: string = "",
    charLevel: number = 1,
    formula?: SpellFormula
): ResolvedSpellTrigger | null {
    // 1. Resolve formula: use passed formula, or look up from registry by normalized id or name
    const targetFormula = formula
        ?? ALL_MANUAL_OVERRIDES[normalizeSpellId(spellName)]
        ?? ALL_MANUAL_OVERRIDES[spellName.toLowerCase().trim()];

    const explicitMechanic = targetFormula?.mechanics?.find(
        (m): m is MechanicConditionalTrigger => m.kind === "conditional_trigger"
    );

    if (explicitMechanic) {
        // Resolve scaled trigger dice from formula mechanics or cantrip scaling tiers
        let triggerDice = explicitMechanic.damageDice;
        if (explicitMechanic.cantripScaleTiers && explicitMechanic.cantripScaleTiers.length > 0) {
            const sortedTiers = [...explicitMechanic.cantripScaleTiers].sort((a, b) => b.minLevel - a.minLevel);
            const matchingTier = sortedTiers.find(t => charLevel >= t.minLevel);
            if (matchingTier) {
                triggerDice = matchingTier.totalDice;
            }
        }

        // Resolve immediate on-hit dice from formula's cantripScale (e.g. Booming Blade / Vengeful Blade weapon riders)
        let immediateOnHitDice: string | undefined = undefined;
        if (targetFormula?.cantripScale?.tiers) {
            const sortedTiers = [...targetFormula.cantripScale.tiers].sort((a, b) => b.minLevel - a.minLevel);
            const matchingTier = sortedTiers.find(t => charLevel >= t.minLevel);
            if (matchingTier && matchingTier.totalDice !== "0d8" && matchingTier.totalDice !== "0") {
                immediateOnHitDice = matchingTier.totalDice;
            } else {
                immediateOnHitDice = "";
            }
        }

        const normalizedDamageType =
            explicitMechanic.damageType.toLowerCase() === "thunder"
                ? "Thunder"
                : explicitMechanic.damageType.toLowerCase() === "necrotic"
                ? "Necrotic"
                : explicitMechanic.damageType;

        return {
            hasTrigger: true,
            conditionType: explicitMechanic.triggerCondition,
            damageDice: triggerDice,
            damageType: normalizedDamageType,
            conditionDesc: explicitMechanic.conditionDesc || `Triggered when condition is met`,
            immediateOnHitDice,
        };
    }

    // 2. Dynamic heuristic extraction from description (for homebrew or future D&D Beyond spells)
    const descLower = description.toLowerCase();
    if (descLower.includes("moves 5 feet or more") || descLower.includes("if the target moves") || descLower.includes("willingly moves")) {
        const diceList = extractDamageDice(description);
        const damageDice = extractCantripScaling(description, charLevel) || diceList[0]?.dice || "1d8";
        const damageType = diceList[0]?.type || "Thunder";
        return {
            hasTrigger: true,
            conditionType: "movement",
            damageDice,
            damageType,
            conditionDesc: "Target moves 5+ ft",
        };
    }

    if (descLower.includes("makes an attack") || descLower.includes("casts a spell") || descLower.includes("takes an action")) {
        const diceList = extractDamageDice(description);
        const damageDice = extractCantripScaling(description, charLevel) || diceList[0]?.dice || "2d8";
        const damageType = diceList[0]?.type || "Necrotic";
        return {
            hasTrigger: true,
            conditionType: "action_attack_or_cast",
            damageDice,
            damageType,
            conditionDesc: "Target attacks or casts a spell",
        };
    }

    return null;
}
