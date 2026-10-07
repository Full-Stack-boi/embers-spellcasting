import OBR from "@owlbear-rodeo/sdk";
import { getSpellBeamInfo } from "../../../services/spellBeamService";
import { broadcastDDBRoll } from "../../../services/rollLogService";
import { checkAndFireActionTriggers } from "../../../services/conditionalTriggerService";
import { hasPotentCantrip } from "../../../services/ddbService";
import { rollAttack, rollDamageDDB } from "../../../utils/dice";
import type { DDBParsedCharacter } from "../../../types/ddb";
import type { DDBRollCardData, DDBSubRollEntry, DDBSubRollExtraDamage } from "../../../types/ddbRollLog";

interface UseSpellAttackRollOptions {
    casterId?: string;
    character: DDBParsedCharacter | null;
    hasSpellAdvantage: boolean;
    concentrationSpell: { id: string; name: string } | null;
    selectedHexAbility: string;
    onSelectSpell: (spellId: string) => void;
}

export function useSpellAttackRoll({
    casterId,
    character,
    hasSpellAdvantage,
    concentrationSpell,
    selectedHexAbility,
    onSelectSpell,
}: UseSpellAttackRollOptions) {
    return (spell: { id: string; name: string; hitOrDc?: string }) => {
        if (casterId) checkAndFireActionTriggers(casterId, "spell").catch(() => {});
        onSelectSpell(spell.id);
        const casterName = character?.name || "Character";
        const beamInfo = getSpellBeamInfo(spell.id, character?.level ?? 1);

        if (spell.hitOrDc?.startsWith("+")) {
            const bonus = parseInt(spell.hitOrDc.replace("+", ""), 10) || 0;
            const mode = hasSpellAdvantage ? "advantage" : "normal";
            const isHexActive = concentrationSpell?.id?.toLowerCase() === "hex" || concentrationSpell?.name?.toLowerCase() === "hex";
            const ddbSpell = character?.spells?.find(s => s.id === spell.id || s.name.toLowerCase() === spell.name.toLowerCase());
            const damageType = ddbSpell?.damageType || "Force";
            const dieFaces = Number(ddbSpell?.damage?.match(/d(\d+)/i)?.[1] ?? 10);

            if (beamInfo.isMultiBeam) {
                const subRolls: DDBSubRollEntry[] = [];
                let totalCombinedDamage = 0;
                let totalHexDamage = 0;
                let anyCrit = false;
                let allMiss = true;

                for (let b = 1; b <= beamInfo.totalBeams; b++) {
                    const roll = rollAttack(bonus, "", mode);
                    if (roll.isCrit) anyCrit = true;
                    if (!roll.isMiss) allMiss = false;
                    let bDmgResult: ReturnType<typeof rollDamageDDB> | null = null;
                    const extraDamage: DDBSubRollExtraDamage[] = [];
                    if (!roll.isMiss) {
                        bDmgResult = ddbSpell?.damage ? rollDamageDDB(ddbSpell.damage, damageType, "", roll.isCrit) : null;
                        if (bDmgResult) totalCombinedDamage += bDmgResult.total;
                        if (isHexActive) {
                            const hexDice = roll.isCrit ? "2d6" : "1d6";
                            const hexDmg = rollDamageDDB("1d6", "Necrotic", "", roll.isCrit);
                            totalHexDamage += hexDmg.total;
                            extraDamage.push({
                                name: "Hex", total: hexDmg.total, damageType: "Necrotic",
                                diceBreakdown: hexDmg.breakdown.replace(/\+/g, " + "),
                                formula: `${hexDice} Necrotic`, isCrit: roll.isCrit,
                            });
                        }
                    } else {
                        const isCantrip = ddbSpell?.level === 0;
                        if (isCantrip && hasPotentCantrip(character) && ddbSpell?.damage) {
                            const fullDmg = rollDamageDDB(ddbSpell.damage, damageType, "", false);
                            const halfDmg = Math.max(1, Math.floor(fullDmg.total / 2));
                            totalCombinedDamage += halfDmg;
                            bDmgResult = {
                                total: halfDmg, damageType, breakdown: `${halfDmg} (Half)`,
                                formatted: `${halfDmg} ${damageType}`, message: `${halfDmg} ${damageType}`,
                            };
                        }
                    }
                    subRolls.push({
                        unitLabel: `${beamInfo.beamUnit.toUpperCase()} ${b}`, targetName: "TARGET",
                        toHit: {
                            total: roll.total,
                            diceBreakdown: `${roll.d20} ${roll.bonus >= 0 ? `+ ${roll.bonus}` : `- ${Math.abs(roll.bonus)}`}`,
                            formula: `1d20${bonus >= 0 ? `+${bonus}` : `${bonus}`}${mode === "advantage" ? " (ADV)" : ""}`,
                            isCrit: roll.isCrit, isMiss: roll.isMiss,
                        },
                        damage: bDmgResult ? {
                            total: bDmgResult.total, damageType,
                            diceBreakdown: bDmgResult.breakdown.replace(/\+/g, " + "),
                            formula: `${ddbSpell?.damage || ""} ${damageType}`.trim(), isCrit: roll.isCrit,
                        } : undefined,
                        extraDamage: extraDamage.length > 0 ? extraDamage : undefined,
                    });
                }

                const summaryTotal = totalHexDamage > 0 ? `${totalCombinedDamage} + ${totalHexDamage}` : totalCombinedDamage;
                const groupedCard: DDBRollCardData = {
                    id: `${Date.now()}-dock-multi-${spell.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
                    casterName, targetName: "TARGET", actionName: spell.name.toUpperCase(), actionType: "SPELL",
                    dieType: dieFaces, diceBreakdown: subRolls.map(s => `${s.toHit?.total ?? 0}`).join(", "),
                    formula: `${beamInfo.totalBeams} ${beamInfo.beamUnit}s (${ddbSpell?.damage || ""} ${damageType} each)`,
                    total: summaryTotal,
                    subtitle: anyCrit ? `Critical Hit! • ${beamInfo.totalBeams} ${beamInfo.beamUnit}s` : `${beamInfo.totalBeams} ${beamInfo.beamUnit}s • ${damageType}`,
                    isCrit: anyCrit, isMiss: allMiss, timestamp: Date.now(), subRolls,
                };
                broadcastDDBRoll([groupedCard]);
                OBR.notification.show(
                    `${casterName} - ${spell.name} (${beamInfo.totalBeams} ${beamInfo.beamUnit}s): ${subRolls.map(s => s.toHit?.total).join(", ")}`,
                    anyCrit ? "SUCCESS" : "INFO"
                );
                return;
            }

            const roll = rollAttack(bonus, "", mode);
            const cards: DDBRollCardData[] = [{
                id: `${Date.now()}-dock-spell-atk`, casterName, targetName: "TARGET", actionName: spell.name.toUpperCase(),
                actionType: "TO HIT", dieType: 20,
                diceBreakdown: `${roll.d20} ${roll.bonus >= 0 ? `+ ${roll.bonus}` : `- ${Math.abs(roll.bonus)}`}`,
                formula: `1d20${bonus >= 0 ? `+${bonus}` : `${bonus}`}${mode === "advantage" ? " (ADV)" : ""}`,
                total: roll.total, subtitle: roll.isCrit ? "Critical Hit!" : roll.isMiss ? "Critical Miss!" : "Spell Attack Roll",
                isCrit: roll.isCrit, isMiss: roll.isMiss, timestamp: Date.now()
            }];

            let extraNotice = "";
            if (!roll.isMiss) {
                if (isHexActive) {
                    const hexDice = roll.isCrit ? "2d6" : "1d6";
                    const hexDmg = rollDamageDDB("1d6", "Necrotic", "", roll.isCrit);
                    cards.push({
                        id: `${Date.now()}-dock-hex-dmg`, casterName, targetName: "TARGET",
                        actionName: selectedHexAbility ? `HEX (${selectedHexAbility.toUpperCase()})` : "HEX (CURSE)",
                        actionType: "DAMAGE", dieType: 6, diceBreakdown: hexDmg.breakdown.replace(/\+/g, " + "),
                        formula: `${hexDice} Necrotic`, total: hexDmg.total,
                        subtitle: roll.isCrit ? "Hex Critical Hit (+2d6 Necrotic)" : "Hex Curse (+1d6 Necrotic)",
                        isCrit: roll.isCrit, timestamp: Date.now() + 1
                    });
                    extraNotice = ` | Hex: +${hexDmg.total} Necrotic`;
                }
            } else {
                const isCantrip = ddbSpell?.level === 0;
                if (isCantrip && hasPotentCantrip(character) && ddbSpell?.damage) {
                    const fullDmg = rollDamageDDB(ddbSpell.damage, damageType, "", false);
                    const halfDmg = Math.max(1, Math.floor(fullDmg.total / 2));
                    const potentDieFaces = Number(ddbSpell.damage.match(/d(\d+)/i)?.[1] ?? 8);
                    cards.push({
                        id: `${Date.now()}-dock-potent-dmg`, casterName, targetName: "TARGET",
                        actionName: `${spell.name.toUpperCase()} (POTENT CANTRIP)`, actionType: "DAMAGE", dieType: potentDieFaces,
                        diceBreakdown: `${halfDmg} (Half)`, formula: `${halfDmg} ${damageType}`, total: halfDmg,
                        subtitle: "Potent Cantrip (Half Damage on Miss)", timestamp: Date.now() + 1
                    });
                    extraNotice = ` | Potent Cantrip: ${halfDmg} ${damageType}`;
                }
            }
            broadcastDDBRoll(cards);
            OBR.notification.show(`${casterName} - ${spell.name}: ${roll.formatted}${extraNotice}`, roll.isCrit ? "SUCCESS" : roll.isMiss ? "WARNING" : "INFO");
        } else if (spell.hitOrDc) {
            OBR.notification.show(`${spell.name} Save: ${spell.hitOrDc}`, "INFO");
        } else {
            OBR.notification.show(`Selected ${spell.name}`, "INFO");
        }
    };
}
