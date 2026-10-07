import OBR from "@owlbear-rodeo/sdk";
import { broadcastDDBRoll } from "../../../services/rollLogService";
import { rollDamageDDB, rollDamageExploding, rollDamageExplodingAnyDie } from "../../../utils/dice";
import { resolveSpellFormula } from "../../../services/spellFormulaBuilder";
import type { SpellFormulaRegistry } from "../../../services/spellFormulaRegistry";
import type { DDBParsedCharacter } from "../../../types/ddb";

interface SpellDamageRollInput {
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
    rawDdbSpell?: DDBParsedCharacter["spells"][number];
}

interface UseSpellDamageRollOptions {
    character: DDBParsedCharacter | null;
    spellRegistry: SpellFormulaRegistry | null;
    damageTypeOverrides: Record<string, string>;
    onSelectSpell: (spellId: string) => void;
    onOpenUpcastPicker: (spell: SpellDamageRollInput) => void;
}

export function useSpellDamageRoll({
    character,
    spellRegistry,
    damageTypeOverrides,
    onSelectSpell,
    onOpenUpcastPicker,
}: UseSpellDamageRollOptions) {
    return (spell: SpellDamageRollInput) => {
        const ddbSpell = character?.spells?.find(s => s.id === spell.id || s.name.toLowerCase() === spell.name.toLowerCase());
        const isSpellPrepared = spell.isPrepared ?? ddbSpell?.isPrepared ?? true;
        if (!isSpellPrepared && (spell.level ?? 0) > 0) {
            OBR.notification.show(`${spell.name} is not prepared!`, "WARNING");
            return;
        }

        onSelectSpell(spell.id);
        if (spell.id.toLowerCase() === "hex" || spell.name.toLowerCase() === "hex") {
            onOpenUpcastPicker(spell);
            return;
        }

        const formula = spellRegistry?.get(spell.id) ?? resolveSpellFormula(spell);
        const charLevel = character?.level ?? 1;
        let effectiveDice: string | undefined;
        if (formula?.cantripScale) {
            const scaled = spellRegistry?.getCantripDice(spell.id, charLevel);
            effectiveDice = scaled && scaled !== "—" ? scaled : undefined;
        }
        if (!effectiveDice) effectiveDice = (spell.damage as string | undefined) || undefined;
        if (!effectiveDice) {
            const formulaBase = formula?.damage.find(d => d.isBase);
            if (formulaBase?.dice && formulaBase.dice !== "weapon") effectiveDice = formulaBase.dice;
        }
        if (!effectiveDice) {
            OBR.notification.show(`Selected ${spell.name}`, "INFO");
            return;
        }

        const baseDmg = formula?.damage.find(d => d.isBase);
        const chosenType = damageTypeOverrides[spell.id] ??
            (baseDmg?.type === "choice" && baseDmg.typeChoices ? baseDmg.typeChoices[0] : (spell.damageType || ""));
        const damageTypeLabel = chosenType ? chosenType.charAt(0).toUpperCase() + chosenType.slice(1) : "";
        const casterName = character?.name || "Character";
        const dieFaces = Number(effectiveDice.match(/d(\d+)/i)?.[1] ?? 8);
        const explodingMechanic = formula?.mechanics?.find(m => m.kind === "exploding");
        const explodingAnyDie = formula?.mechanics?.find(m => m.kind === "exploding_any_die");
        const statKey = (character?.spellCastingAbility?.toLowerCase() || "cha") as "int" | "wis" | "cha";
        const spellcastingMod = Math.max(1, character?.modifiers?.[statKey] ?? 3);

        let dmgResult: ReturnType<typeof rollDamageDDB>;
        if (explodingMechanic) {
            const triggerValue = explodingMechanic.triggerValue ?? 8;
            const maxExplosions = explodingMechanic.maxExtra === "spellcastingMod"
                ? spellcastingMod
                : (typeof explodingMechanic.maxExtra === "number" ? explodingMechanic.maxExtra : 0);
            dmgResult = rollDamageExploding(effectiveDice, chosenType, triggerValue, maxExplosions);
        } else if (explodingAnyDie) {
            const maxExplosions = explodingAnyDie.maxExtra === "spellcastingMod"
                ? spellcastingMod
                : (typeof explodingAnyDie.maxExtra === "number" ? explodingAnyDie.maxExtra : 0);
            dmgResult = rollDamageExplodingAnyDie(effectiveDice, chosenType, maxExplosions);
        } else {
            dmgResult = rollDamageDDB(effectiveDice, chosenType);
        }

        const isExploded = Boolean(dmgResult.explosionCount && dmgResult.explosionCount > 0);
        const explosionCount = dmgResult.explosionCount ?? 0;
        broadcastDDBRoll([{
            id: `${Date.now()}-dock-spell-dmg`, casterName, targetName: "TARGET",
            actionName: spell.name.toUpperCase(), actionType: "DAMAGE", dieType: dieFaces,
            diceBreakdown: dmgResult.breakdown.replace(/\+/g, " + "),
            formula: isExploded
                ? `${effectiveDice} ${damageTypeLabel} (+${explosionCount} Exploded)`.trim()
                : `${effectiveDice} ${damageTypeLabel}`.trim(),
            total: dmgResult.total,
            subtitle: isExploded
                ? `Damage (${damageTypeLabel || "Spell"}) • ${explosionCount} Bonus ${explosionCount > 1 ? "Dice" : "Die"}`
                : `Damage (${damageTypeLabel || "Spell"})`,
            timestamp: Date.now()
        }]);
        OBR.notification.show(`${spell.name} Damage: ${dmgResult.formatted}`, "INFO");
    };
}
