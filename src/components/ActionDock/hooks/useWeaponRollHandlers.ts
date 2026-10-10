import type { Dispatch, SetStateAction } from "react";
import OBR from "@owlbear-rodeo/sdk";
import { setSelectedSpell, toolID } from "../../../effectsTool";
import { hasWeaponGraze } from "../../../services/ddbService";
import { addConditionalTrigger, checkAndFireActionTriggers } from "../../../services/conditionalTriggerService";
import { resolveSpellConditionalTrigger } from "../../../services/spellTriggerResolver";
import { broadcastDDBRoll } from "../../../services/rollLogService";
import { resolveWeaponRiders } from "../../../services/weaponDamageRiders";
import { rollAttack, rollDamageBreakdown, rollDamageDDB, combineDamageBonus } from "../../../utils/dice";
import type { DDBParsedCharacter, DDBWeaponAttack } from "../../../types/ddb";
import type { DDBRollCardData } from "../../../types/ddbRollLog";
import { parseRiderString } from "../domain/riders";

interface UseWeaponRollHandlersOptions {
    casterId?: string;
    character: DDBParsedCharacter | null;
    hasAttackAdvantage: boolean;
    damageBonus?: number;
    isRaging?: boolean;
    activeBuffs?: string[];
    riderChoice?: string;
    concentrationSpell: { id: string; name: string } | null;
    activeRiderMap: Record<string, string | null>;
    setActiveRiderMap: Dispatch<SetStateAction<Record<string, string | null>>>;
    spells: Array<{ id: string; name: string }>;
    setSelected: Dispatch<SetStateAction<string | null>>;
}

export function useWeaponRollHandlers({
    casterId,
    character,
    hasAttackAdvantage,
    damageBonus,
    isRaging,
    activeBuffs,
    riderChoice,
    concentrationSpell,
    activeRiderMap,
    setActiveRiderMap,
    spells,
    setSelected,
}: UseWeaponRollHandlersOptions) {
    const handleWeaponAttackRoll = (weapon: DDBWeaponAttack) => {
        if (casterId) checkAndFireActionTriggers(casterId, "attack").catch(() => {});
        const mode: "normal" | "advantage" | "disadvantage" = hasAttackAdvantage ? "advantage" : "normal";
        const roll = rollAttack(weapon.toHit, "", mode);
        const casterName = character?.name || "Character";
        const isHexActive = concentrationSpell?.id?.toLowerCase() === "hex" || concentrationSpell?.name?.toLowerCase() === "hex";
        const cards: DDBRollCardData[] = [{
            id: `${Date.now()}-dock-atk`, casterName, targetName: "TARGET", actionName: weapon.name.toUpperCase(),
            actionType: "TO HIT", dieType: 20,
            diceBreakdown: `${roll.d20} ${roll.bonus >= 0 ? `+ ${roll.bonus}` : `- ${Math.abs(roll.bonus)}`}`,
            formula: `1d20${roll.bonus >= 0 ? `+${roll.bonus}` : `${roll.bonus}`}${roll.mode === "advantage" ? " (ADV)" : roll.mode === "disadvantage" ? " (DIS)" : ""}`,
            total: roll.total, subtitle: roll.isCrit ? "Critical Hit!" : roll.isMiss ? "Critical Miss!" : "Weapon Attack Roll",
            isCrit: roll.isCrit, isMiss: roll.isMiss, rollMode: roll.mode,
            isAdvantage: roll.mode === "advantage", isDisadvantage: roll.mode === "disadvantage", timestamp: Date.now()
        }];
        if (!roll.isMiss && isHexActive) {
            const hexDice = roll.isCrit ? "2d6" : "1d6";
            const hexDmg = rollDamageDDB("1d6", "Necrotic", "", roll.isCrit);
            cards.push({
                id: `${Date.now()}-dock-hex-dmg`, casterName, targetName: "TARGET", actionName: "HEX (CURSE)",
                actionType: "DAMAGE", dieType: 6, diceBreakdown: hexDmg.breakdown.replace(/\+/g, " + "),
                formula: `${hexDice} Necrotic`, total: hexDmg.total,
                subtitle: roll.isCrit ? "Hex Critical Hit (+2d6 Necrotic)" : "Hex Curse (+1d6 Necrotic)",
                isCrit: roll.isCrit, timestamp: Date.now() + 1
            });
        } else if (roll.isMiss && hasWeaponGraze(weapon)) {
            const abilityMod = Math.max(1, weapon.toHit - (character?.proficiencyBonus ?? 2));
            const weaponDamageType = weapon.damageType || "Slashing";
            cards.push({
                id: `${Date.now()}-dock-graze-dmg`, casterName, targetName: "TARGET",
                actionName: `${weapon.name.toUpperCase()} (GRAZE)`, actionType: "DAMAGE", dieType: 0,
                diceBreakdown: `${abilityMod}`, formula: `${abilityMod} ${weaponDamageType}`, total: abilityMod,
                subtitle: "Weapon Mastery: Graze (Damage on Miss)", timestamp: Date.now() + 1
            });
        }
        broadcastDDBRoll(cards);
    };

    const handleWeaponDamageRoll = async (weapon: DDBWeaponAttack, riderName?: string | null) => {
        if (casterId) checkAndFireActionTriggers(casterId, "attack").catch(() => {});
        let riderObj: ReturnType<typeof parseRiderString> | undefined;
        if (riderName && weapon.cantripRiders) {
            const found = weapon.cantripRiders.find(r => r.startsWith(riderName));
            if (found) riderObj = parseRiderString(found);
        }
        const triggerInfo = riderObj ? resolveSpellConditionalTrigger(riderObj.name, riderObj.raw, character?.level || 1) : null;
        const effectiveRiderDamage = triggerInfo?.hasTrigger ? (triggerInfo.immediateOnHitDice || "") : (riderObj?.damage || "");
        const bonusNum = typeof damageBonus === "number" && damageBonus > 0 ? damageBonus : 0;
        const effectiveBaseDamage = combineDamageBonus(weapon.damage, bonusNum);
        const { total, formatted } = rollDamageBreakdown(effectiveBaseDamage, weapon.damageType, "", riderObj ? {
            name: riderObj.name, damage: effectiveRiderDamage, damageType: riderObj.damageType, moveTrigger: undefined
        } : undefined);
        const casterName = character?.name || "Character";
        const isHexActive = concentrationSpell?.id?.toLowerCase() === "hex" || concentrationSpell?.name?.toLowerCase() === "hex";
        let pendingTriggerId: string | undefined;
        let triggerSubtitle = "";
        if (triggerInfo?.hasTrigger) {
            const triggerId = `trig_${Date.now()}_dock`;
            pendingTriggerId = triggerId;
            let targetTokenId = "TARGET";
            let targetTokenName = "TARGET";
            let targetPosition: { x: number; y: number } | undefined;
            try {
                const selection = await OBR.player.getSelection().catch(() => [] as string[]);
                if (selection?.length) {
                    const sceneItems = await OBR.scene.items.getItems(selection);
                    const selItem = sceneItems[0];
                    if (selItem) {
                        targetTokenId = selItem.id;
                        targetTokenName = selItem.name || "Target";
                        targetPosition = selItem.position;
                    }
                }
            } catch { /* Ignore selection error */ }
            await addConditionalTrigger({
                id: triggerId, spellId: riderObj?.name.toLowerCase().replace(/[^a-z0-9_]/g, "") || "rider_spell",
                spellName: riderObj?.name || "Spell", casterName, targetId: targetTokenId, targetName: targetTokenName,
                conditionType: triggerInfo.conditionType, damageFormula: triggerInfo.damageDice,
                damageType: triggerInfo.damageType, conditionDescription: triggerInfo.conditionDesc,
                appliedAt: Date.now(), initialPosition: targetPosition
            });
            triggerSubtitle = ` • Condition Applied: ${triggerInfo.conditionDesc}`;
        }
        const bonusNote = bonusNum > 0 ? (isRaging ? ` • Rage (+${bonusNum})` : ` • Buff (+${bonusNum})`) : "";

        const buffsToPass = activeBuffs || (isRaging ? ["rage"] : []);
        const riders = resolveWeaponRiders({
            character,
            weapon,
            activeBuffs: buffsToPass,
            riderChoice,
        });

        const extraRiderRolls: Array<{ rider: import("../../../services/weaponDamageRiders").ActiveWeaponRider; roll: import("../../../utils/dice").DDBDamageResult }> = [];
        for (const r of riders.activeDiceRiders) {
            const formula = r.bonus ? `${r.dice}+${r.bonus}` : (r.dice || "1d6");
            const rRoll = rollDamageDDB(formula, r.damageType);
            extraRiderRolls.push({ rider: r, roll: rRoll });
        }

        const ridersTotal = extraRiderRolls.reduce((sum, item) => sum + item.roll.total, 0);
        const finalTotal = total + ridersTotal;

        const baseBreakdown = formatted.replace(/^Damage:\s*\d+\s*[A-Za-z]*\s*\(/, "").replace(/\)$/, "").replace(/\+/g, " + ");
        let finalBreakdown = baseBreakdown;
        let finalFormula = `${effectiveBaseDamage} ${weapon.damageType}`;

        if (extraRiderRolls.length > 0) {
            finalBreakdown += " + " + extraRiderRolls.map(i => `${i.roll.breakdown.replace(/\+/g, " + ")} (${i.rider.damageType})`).join(" + ");
            finalFormula += " + " + extraRiderRolls.map(i => `${i.rider.dice}${i.rider.bonus ? `+${i.rider.bonus}` : ""} ${i.rider.damageType}`).join(" + ");
        }

        const riderSubtitles = extraRiderRolls.map(i => ` • ${i.rider.name} (${i.rider.damageType})`).join("");
        const finalSubtitle = `Damage (${weapon.damageType})${bonusNote}${riderSubtitles}${triggerSubtitle}`;

        const cards: DDBRollCardData[] = [{
            id: `${Date.now()}-dock-dmg`, casterName, targetName: "TARGET", actionName: weapon.name.toUpperCase(),
            actionType: "DAMAGE", dieType: 8,
            diceBreakdown: finalBreakdown,
            formula: finalFormula, total: finalTotal,
            subtitle: finalSubtitle, pendingTriggerId,
            pendingTriggerName: riderObj?.name, timestamp: Date.now()
        }];
        if (isHexActive) {
            const hexDmg = rollDamageDDB("1d6", "Necrotic");
            cards.push({
                id: `${Date.now()}-dock-hex-dmg`, casterName, targetName: "TARGET", actionName: "HEX (CURSE)",
                actionType: "DAMAGE", dieType: 6, diceBreakdown: hexDmg.breakdown.replace(/\+/g, " + "),
                formula: "1d6 Necrotic", total: hexDmg.total, subtitle: "Hex Curse (+1d6 Necrotic)", timestamp: Date.now() + 1
            });
        }
        broadcastDDBRoll(cards);
    };

    const handleRiderClick = (weapon: DDBWeaponAttack, rider: ReturnType<typeof parseRiderString>) => {
        const currentActive = activeRiderMap[weapon.id];
        const nextRider = currentActive === rider.name ? null : rider.name;
        setActiveRiderMap(prev => ({ ...prev, [weapon.id]: nextRider }));
        const matchSpell = spells.find(s => s.name.toLowerCase() === rider.name.toLowerCase());
        if (matchSpell) {
            setSelectedSpell(matchSpell.id);
            setSelected(matchSpell.id);
            OBR.tool.activateTool(toolID);
        }
        const bonusNum = typeof damageBonus === "number" && damageBonus > 0 ? damageBonus : 0;
        const effectiveBaseDamage = combineDamageBonus(weapon.damage, bonusNum);
        const { total, formatted } = rollDamageBreakdown(effectiveBaseDamage, weapon.damageType, "", {
            name: rider.name, damage: rider.damage, damageType: rider.damageType, moveTrigger: rider.moveTrigger
        });
        const casterName = character?.name || "Character";
        broadcastDDBRoll([{
            id: `${Date.now()}-dock-rider-dmg`, casterName, targetName: "TARGET", actionName: weapon.name.toUpperCase(),
            actionType: "DAMAGE", dieType: 8,
            diceBreakdown: formatted.replace(/^Damage:\s*\d+\s*[A-Za-z]*\s*\(/, "").replace(/\)$/, "").replace(/\+/g, " + "),
            formula: `${effectiveBaseDamage} + ${rider.damage}`, total, subtitle: `${rider.name} Rider Damage`, timestamp: Date.now()
        }]);
    };

    return { handleWeaponAttackRoll, handleWeaponDamageRoll, handleRiderClick };
}
