import React from "react";
import "./DDBRollCard.css";
import { DDBRollCardData } from "../../types/ddbRollLog";
import { fireConditionalTrigger } from "../../services/conditionalTriggerService";
import {
    DieIconD4,
    DieIconD6,
    DieIconD8,
    DieIconD10,
    DieIconD12,
    DieIconD20,
} from "../ActionDock/overlays/CustomDiceRoller";

export const ElderFlameDieIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className="ddb-roll-card-flame-icon">
        <defs>
            <linearGradient id="elderFlameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="40%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
            <radialGradient id="elderGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#b45309" stopOpacity="0" />
            </radialGradient>
        </defs>
        <circle cx="16" cy="16" r="14" fill="url(#elderGlow)" />
        <polygon points="16,3 28.5,10.2 28.5,24.6 16,31.8 3.5,24.6 3.5,10.2" fill="url(#elderFlameGrad)" stroke="#fef3c7" strokeWidth="1" />
        <polygon points="16,7 24.5,14.5 16,26 7.5,14.5" fill="#78350f" fillOpacity="0.3" stroke="#fde68a" strokeWidth="0.8" />
        <line x1="16" y1="3" x2="16" y2="7" stroke="#fde68a" strokeWidth="0.8" />
        <line x1="28.5" y1="10.2" x2="24.5" y2="14.5" stroke="#fde68a" strokeWidth="0.8" />
        <line x1="28.5" y1="24.6" x2="16" y2="26" stroke="#fde68a" strokeWidth="0.8" />
        <line x1="16" y1="31.8" x2="16" y2="26" stroke="#fde68a" strokeWidth="0.8" />
        <line x1="3.5" y1="24.6" x2="7.5" y2="14.5" stroke="#fde68a" strokeWidth="0.8" />
        <line x1="3.5" y1="10.2" x2="7.5" y2="14.5" stroke="#fde68a" strokeWidth="0.8" />
    </svg>
);

function renderDieIcon(dieType: number, size: number = 20) {
    switch (dieType) {
        case 4:
            return <DieIconD4 size={size} />;
        case 6:
            return <DieIconD6 size={size} />;
        case 8:
            return <DieIconD8 size={size} />;
        case 10:
            return <DieIconD10 size={size} />;
        case 12:
            return <DieIconD12 size={size} />;
        case 20:
        default:
            return <DieIconD20 size={size} />;
    }
}

function getTagClass(actionType: DDBRollCardData["actionType"], isConditionTrigger?: boolean): string {
    if (isConditionTrigger) {
        return "tag-trigger";
    }
    switch (actionType) {
        case "CHECK":
            return "tag-check";
        case "TO HIT":
        case "ATTACK":
            return "tag-to-hit";
        case "DAMAGE":
            return "tag-damage";
        case "SAVE":
            return "tag-save";
        case "SPELL":
            return "tag-spell";
        default:
            return "tag-check";
    }
}

function renderFormattedFormula(formula?: string) {
    if (!formula) return null;
    if (formula.includes("(DIS)")) {
        const parts = formula.split("(DIS)");
        return (
            <>
                {parts[0]}
                <span className="formula-mode-dis">(DIS)</span>
                {parts.slice(1).join("(DIS)")}
            </>
        );
    }
    if (formula.includes("(ADV)")) {
        const parts = formula.split("(ADV)");
        return (
            <>
                {parts[0]}
                <span className="formula-mode-adv">(ADV)</span>
                {parts.slice(1).join("(ADV)")}
            </>
        );
    }
    return formula;
}

export interface DDBRollCardProps {
    data: DDBRollCardData;
}

export const DDBRollCard: React.FC<DDBRollCardProps> = ({ data }) => {
    const isCrit = Boolean(data.isCrit);
    const isMiss = Boolean(data.isMiss);
    const isGrouped = Boolean(data.subRolls && data.subRolls.length > 0);
    const isConditionTrigger = Boolean(data.isConditionTrigger || data.actionName?.includes("(TRIGGER)"));
    const isDisadvantage = Boolean(
        data.isDisadvantage ||
        data.rollMode === "disadvantage" ||
        data.formula?.includes("(DIS)") ||
        data.diceBreakdown?.includes("DIS") ||
        data.subtitle?.toLowerCase().includes("disadvantage")
    );
    const isAdvantage = Boolean(
        data.isAdvantage ||
        data.rollMode === "advantage" ||
        data.formula?.includes("(ADV)") ||
        data.diceBreakdown?.includes("ADV") ||
        data.subtitle?.toLowerCase().includes("advantage")
    );

    const cardClasses = [
        "ddb-roll-card",
        isGrouped ? "is-grouped" : "",
        isCrit ? "is-crit" : "",
        isMiss ? "is-miss" : "",
        isConditionTrigger ? "is-condition-trigger" : "",
        isDisadvantage ? "is-disadvantage" : "",
        isAdvantage ? "is-advantage" : "",
    ].filter(Boolean).join(" ");

    // Grouped Multi-Roll Card (Multi-Beam / Multi-Ray / Multi-Attack)
    if (isGrouped && data.subRolls) {
        return (
            <div className="ddb-roll-card-wrapper" role="article" aria-label={`${data.casterName} ${data.actionName} grouped roll card`}>
                {/* Top Caster Name */}
                <div className="ddb-roll-card-caster">
                    {data.casterName || "Character"}
                </div>

                <div className={cardClasses}>
                    {/* 1. Header Row */}
                    <div className="ddb-roll-card-header">
                        <div className="ddb-roll-card-title-row">
                            <span className="ddb-roll-card-action-name">{data.actionName}</span>
                            <span className="ddb-roll-card-tag tag-spell">
                                {data.subRolls.length} {data.subRolls.length === 1 ? "BEAM" : "BEAMS"} • SPELL
                            </span>
                            {isDisadvantage && <span className="ddb-roll-card-tag tag-dis">DIS</span>}
                            {isAdvantage && <span className="ddb-roll-card-tag tag-adv">ADV</span>}
                        </div>
                        <div className="ddb-roll-card-target-row">
                            TO: {data.targetName || "TARGET"}
                        </div>
                    </div>

                    {/* 2. Sub-Roll Items */}
                    <div className="ddb-subroll-list">
                        {data.subRolls.map((sub, idx) => {
                            const subCrit = Boolean(sub.toHit?.isCrit || sub.damage?.isCrit);
                            const subMiss = Boolean(sub.toHit?.isMiss);
                            const subDis = Boolean(
                                sub.toHit?.mode === "disadvantage" ||
                                sub.toHit?.formula?.includes("(DIS)") ||
                                sub.toHit?.diceBreakdown?.includes("DIS")
                            );
                            const subAdv = Boolean(
                                sub.toHit?.mode === "advantage" ||
                                sub.toHit?.formula?.includes("(ADV)") ||
                                sub.toHit?.diceBreakdown?.includes("ADV")
                            );
                            const itemClass = [
                                "ddb-subroll-item",
                                subCrit ? "is-crit" : "",
                                subMiss ? "is-miss" : "",
                            ].filter(Boolean).join(" ");

                            return (
                                <div key={idx} className={itemClass}>
                                    <div className="ddb-subroll-item-header">
                                        <span className="ddb-subroll-unit-badge">{sub.unitLabel}</span>
                                        {sub.targetName && (
                                            <span className="ddb-subroll-target-badge" title={sub.targetName}>➔ {sub.targetName}</span>
                                        )}
                                        {subDis && <span className="ddb-subroll-mode-tag tag-dis">DIS</span>}
                                        {subAdv && <span className="ddb-subroll-mode-tag tag-adv">ADV</span>}
                                        {subCrit && <span className="ddb-subroll-crit-pill">CRIT!</span>}
                                        {subMiss && <span className="ddb-subroll-miss-pill">MISS</span>}
                                    </div>

                                    <div className="ddb-subroll-item-body">
                                        {/* Attack / To Hit */}
                                        {sub.toHit && (
                                            <div className="ddb-subroll-cell ddb-subroll-tohit">
                                                <span className="ddb-subroll-label">TO HIT</span>
                                                <div className="ddb-subroll-value-row">
                                                    <span className="ddb-subroll-total-val">{sub.toHit.total}</span>
                                                    <span className="ddb-subroll-breakdown-val">({sub.toHit.diceBreakdown})</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Divider */}
                                        {sub.toHit && sub.damage && (
                                            <div className="ddb-subroll-divider" />
                                        )}

                                        {/* Damage */}
                                        {sub.damage && (
                                            <div className="ddb-subroll-cell ddb-subroll-damage">
                                                <span className="ddb-subroll-label">
                                                    DAMAGE <span className="ddb-subroll-dmg-type">({sub.damage.damageType})</span>
                                                </span>
                                                <div className="ddb-subroll-value-row">
                                                    <span className="ddb-subroll-total-val ddb-dmg-num">{sub.damage.total}</span>
                                                    <span className="ddb-subroll-breakdown-val">({sub.damage.diceBreakdown})</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Extra Damage Riders (e.g. Hex) */}
                                    {sub.extraDamage && sub.extraDamage.length > 0 && (
                                        <div className="ddb-subroll-extra-row">
                                            {sub.extraDamage.map((ex, exIdx) => (
                                                <span key={exIdx} className="ddb-subroll-extra-pill">
                                                    +{ex.total} {ex.damageType} ({ex.name}: {ex.diceBreakdown})
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* 3. Footer Summary */}
                    <div className="ddb-subroll-footer">
                        <ElderFlameDieIcon size={20} />
                        <div className="ddb-subroll-footer-info">
                            <span className="ddb-subroll-footer-label">POTENTIAL TOTAL:</span>
                            <span className="ddb-subroll-footer-total">
                                {data.total} <span className="ddb-subroll-footer-sub">DMG</span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Bottom Timestamp */}
                <div className="ddb-roll-card-timestamp">
                    NOW
                </div>
            </div>
        );
    }

    const breakdownLength = (data.diceBreakdown || "").length;
    const breakdownClass = [
        "ddb-roll-card-breakdown",
        breakdownLength > 24 ? "is-extra-long" : breakdownLength > 14 ? "is-long" : "",
    ].filter(Boolean).join(" ");

    return (
        <div className="ddb-roll-card-wrapper" role="article" aria-label={`${data.casterName} roll card`}>
            {/* Top Caster Name */}
            <div className="ddb-roll-card-caster">
                {data.casterName || "Character"}
            </div>

            {/* Main Rounded Dark Card */}
            <div className={cardClasses}>
                {/* 1. Header Row */}
                <div className="ddb-roll-card-header">
                    <div className="ddb-roll-card-title-row">
                        <span className="ddb-roll-card-action-name">{data.actionName}:</span>
                        <span className={`ddb-roll-card-tag ${getTagClass(data.actionType, isConditionTrigger)}`}>
                            {isConditionTrigger ? "TRIGGER" : data.actionType}
                        </span>
                        {isDisadvantage && <span className="ddb-roll-card-tag tag-dis">DIS</span>}
                        {isAdvantage && <span className="ddb-roll-card-tag tag-adv">ADV</span>}
                    </div>
                    <div className="ddb-roll-card-target-row">
                        TO: {data.targetName || "SELF"}
                    </div>
                </div>

                {/* 2. Middle Calculation Row */}
                <div className="ddb-roll-card-calc-row">
                    <div className="ddb-roll-card-left-calc">
                        <div className="ddb-roll-card-dice-line">
                            <span className="ddb-roll-card-die-icon">
                                {renderDieIcon(data.dieType, 20)}
                            </span>
                            <span className={breakdownClass}>
                                {data.diceBreakdown}
                            </span>
                        </div>
                        <div className="ddb-roll-card-formula">
                            {renderFormattedFormula(data.formula)}
                        </div>
                    </div>

                    <div className="ddb-roll-card-divider-wrap">
                        <div className="ddb-roll-card-vdivider" />
                        <span className="ddb-roll-card-equals">=</span>
                    </div>

                    <div className="ddb-roll-card-right-total">
                        <span className="ddb-roll-card-total-num">
                            {data.total}
                        </span>
                    </div>
                </div>

                {/* 3. Footer Row */}
                <div className="ddb-roll-card-footer">
                    <ElderFlameDieIcon size={20} />
                    <div className="ddb-roll-card-footer-line" />
                    <span className="ddb-roll-card-subtitle">
                        {data.subtitle || "Rolled with Elder Flame"}
                    </span>
                    {data.pendingTriggerId && (
                        <button
                            type="button"
                            className="ddb-trigger-btn"
                            onClick={async (e) => {
                                e.stopPropagation();
                                await fireConditionalTrigger(data.pendingTriggerId!);
                            }}
                        >
                            Trigger {data.pendingTriggerName || "Effect"}
                        </button>
                    )}
                </div>
            </div>

            {/* Bottom Timestamp */}
            <div className="ddb-roll-card-timestamp">
                NOW
            </div>
        </div>
    );
};
