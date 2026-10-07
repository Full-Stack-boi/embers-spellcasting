import React, { useState } from "react";
import OBR from "@owlbear-rodeo/sdk";
import "./CustomDiceRoller";
import {
    rollCustomDicePool,
    rollFormula,
    CustomDicePoolResult,
} from "../../../utils/dice";
import { broadcastDDBRoll } from "../../../services/rollLogService";
import { IconClose, IconDiceD20 } from "../shared/Bg3Icons";

// Polyhedral Dice Icons as precise, clean SVGs
export const DieIconD4: React.FC<{ size?: number; className?: string }> = ({ size = 28, className }) => (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor">
        <polygon points="16,4 29,26 3,26" strokeWidth="2.2" strokeLinejoin="round" fill="rgba(255,255,255,0.04)" />
        <line x1="16" y1="4" x2="16" y2="18" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="3" y1="26" x2="16" y2="18" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="29" y1="26" x2="16" y2="18" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
);

export const DieIconD6: React.FC<{ size?: number; className?: string }> = ({ size = 28, className }) => (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor">
        <rect x="5" y="5" width="22" height="22" rx="4" strokeWidth="2.2" strokeLinejoin="round" fill="rgba(255,255,255,0.04)" />
        <circle cx="10" cy="10" r="2" fill="currentColor" />
        <circle cx="22" cy="10" r="2" fill="currentColor" />
        <circle cx="10" cy="16" r="2" fill="currentColor" />
        <circle cx="22" cy="16" r="2" fill="currentColor" />
        <circle cx="10" cy="22" r="2" fill="currentColor" />
        <circle cx="22" cy="22" r="2" fill="currentColor" />
    </svg>
);

export const DieIconD8: React.FC<{ size?: number; className?: string }> = ({ size = 28, className }) => (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor">
        <polygon points="16,3 29,16 16,29 3,16" strokeWidth="2.2" strokeLinejoin="round" fill="rgba(255,255,255,0.04)" />
        <line x1="3" y1="16" x2="29" y2="16" strokeWidth="1.8" />
        <line x1="16" y1="3" x2="16" y2="29" strokeWidth="1.8" />
    </svg>
);

export const DieIconD10: React.FC<{ size?: number; className?: string }> = ({ size = 28, className }) => (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor">
        <polygon points="16,3 28,12 16,29 4,12" strokeWidth="2.2" strokeLinejoin="round" fill="rgba(255,255,255,0.04)" />
        <line x1="16" y1="3" x2="16" y2="18" strokeWidth="1.8" />
        <line x1="4" y1="12" x2="16" y2="18" strokeWidth="1.8" />
        <line x1="28" y1="12" x2="16" y2="18" strokeWidth="1.8" />
        <line x1="16" y1="29" x2="16" y2="18" strokeWidth="1.8" />
    </svg>
);

export const DieIconD12: React.FC<{ size?: number; className?: string }> = ({ size = 28, className }) => (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor">
        <polygon points="16,3 28.5,12 23.7,27 8.3,27 3.5,12" strokeWidth="2.2" strokeLinejoin="round" fill="rgba(255,255,255,0.04)" />
        <polygon points="16,9 22.5,14 20,22 12,22 9.5,14" strokeWidth="1.6" strokeLinejoin="round" fill="none" />
        <line x1="16" y1="3" x2="16" y2="9" strokeWidth="1.5" />
        <line x1="28.5" y1="12" x2="22.5" y2="14" strokeWidth="1.5" />
        <line x1="23.7" y1="27" x2="20" y2="22" strokeWidth="1.5" />
        <line x1="8.3" y1="27" x2="12" y2="22" strokeWidth="1.5" />
        <line x1="3.5" y1="12" x2="9.5" y2="14" strokeWidth="1.5" />
    </svg>
);

export const DieIconD20: React.FC<{ size?: number; className?: string }> = ({ size = 28, className }) => (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor">
        <polygon points="16,3 28.5,10.2 28.5,24.6 16,31.8 3.5,24.6 3.5,10.2" strokeWidth="2.2" strokeLinejoin="round" fill="rgba(255,255,255,0.04)" />
        <polygon points="16,7 24.5,14.5 16,26 7.5,14.5" strokeWidth="1.6" strokeLinejoin="round" />
        <line x1="16" y1="3" x2="16" y2="7" strokeWidth="1.5" />
        <line x1="28.5" y1="10.2" x2="24.5" y2="14.5" strokeWidth="1.5" />
        <line x1="28.5" y1="24.6" x2="16" y2="26" strokeWidth="1.5" />
        <line x1="16" y1="31.8" x2="16" y2="26" strokeWidth="1.5" />
        <line x1="3.5" y1="24.6" x2="7.5" y2="14.5" strokeWidth="1.5" />
        <line x1="3.5" y1="10.2" x2="7.5" y2="14.5" strokeWidth="1.5" />
    </svg>
);

export const DieIconD100: React.FC<{ size?: number; className?: string }> = ({ size = 28, className }) => (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor">
        <polygon points="16,3 28,12 16,29 4,12" strokeWidth="2.2" strokeLinejoin="round" fill="rgba(255,255,255,0.04)" />
        <text x="16" y="20" fill="currentColor" fontSize="10" fontWeight="bold" textAnchor="middle" stroke="none">00</text>
    </svg>
);

const DIE_CONFIGS: Array<{ die: number; label: string; icon: React.FC<{ size?: number; className?: string }> }> = [
    { die: 4, label: "d4", icon: DieIconD4 },
    { die: 6, label: "d6", icon: DieIconD6 },
    { die: 8, label: "d8", icon: DieIconD8 },
    { die: 10, label: "d10", icon: DieIconD10 },
    { die: 12, label: "d12", icon: DieIconD12 },
    { die: 20, label: "d20", icon: DieIconD20 },
    { die: 100, label: "d100", icon: DieIconD100 },
];

export interface CustomDiceRollerProps {
    onClose: () => void;
    casterName?: string;
}

export const CustomDiceRoller: React.FC<CustomDiceRollerProps> = ({ onClose, casterName }) => {
    // Dice pool state: { [die]: count }
    const [dicePool, setDicePool] = useState<Record<number, number>>({});
    const [modifier, setModifier] = useState<number>(0);
    const [d20Mode, setD20Mode] = useState<"normal" | "advantage" | "disadvantage">("normal");

    // Free text input mode
    const [customFormulaText, setCustomFormulaText] = useState<string>("");
    const [isTextMode, setIsTextMode] = useState<boolean>(false);

    // Latest roll result & History
    const [latestResult, setLatestResult] = useState<CustomDicePoolResult | null>(null);
    const [rollHistory, setRollHistory] = useState<CustomDicePoolResult[]>([]);
    const [isRollingAnim, setIsRollingAnim] = useState<boolean>(false);

    // Compute live formula string from pool
    const activeFormula = React.useMemo(() => {
        if (isTextMode && customFormulaText.trim()) {
            return customFormulaText.trim();
        }
        const parts: string[] = [];
        for (const { die } of DIE_CONFIGS) {
            const count = dicePool[die] || 0;
            if (count > 0) {
                parts.push(`${count}d${die}`);
            }
        }
        if (parts.length === 0) {
            return modifier !== 0 ? `1d20 ${modifier > 0 ? `+ ${modifier}` : `- ${Math.abs(modifier)}`}` : "1d20";
        }
        const diceStr = parts.join(" + ");
        if (modifier > 0) return `${diceStr} + ${modifier}`;
        if (modifier < 0) return `${diceStr} - ${Math.abs(modifier)}`;
        return diceStr;
    }, [dicePool, modifier, isTextMode, customFormulaText]);

    // Add die to pool
    const handleAddDie = (die: number) => {
        setDicePool(prev => ({
            ...prev,
            [die]: (prev[die] || 0) + 1
        }));
    };

    // Remove die from pool
    const handleRemoveDie = (die: number, e: React.MouseEvent) => {
        e.preventDefault();
        setDicePool(prev => {
            const count = prev[die] || 0;
            if (count <= 1) {
                const copy = { ...prev };
                delete copy[die];
                return copy;
            }
            return { ...prev, [die]: count - 1 };
        });
    };

    // Clear pool
    const handleClearPool = () => {
        setDicePool({});
        setModifier(0);
        setD20Mode("normal");
        setCustomFormulaText("");
    };

    // Quick roll a single die immediately
    const handleQuickRoll = (die: number) => {
        const singlePool = { [die]: 1 };
        executeRoll(singlePool, 0, die === 20 ? d20Mode : "normal");
    };

    // Execute the roll
    const executeRoll = (
        poolToRoll: Record<number, number>,
        modToRoll: number,
        modeToRoll: "normal" | "advantage" | "disadvantage"
    ) => {
        setIsRollingAnim(true);
        setTimeout(() => setIsRollingAnim(false), 250);

        let result: CustomDicePoolResult;

        if (isTextMode && customFormulaText.trim()) {
            // Roll using raw text formula
            const rawRes = rollFormula(customFormulaText.trim());
            result = {
                total: rawRes.total,
                formula: customFormulaText.trim(),
                breakdown: rawRes.breakdown,
                diceGroups: [],
                modifier: 0,
                d20Mode: "normal",
                isNat20: rawRes.isNat20,
                isNat1: rawRes.isNat1,
                timestamp: Date.now()
            };
        } else {
            result = rollCustomDicePool(poolToRoll, modToRoll, modeToRoll);
        }

        setLatestResult(result);
        setRollHistory(prev => [result, ...prev.slice(0, 9)]);

        // Broadcast D&D Beyond roll card
        broadcastDDBRoll([
            {
                id: `${Date.now()}-custom-roll`,
                casterName: casterName || "Character",
                targetName: "SELF",
                actionName: "CUSTOM ROLL",
                actionType: "CHECK",
                dieType: result.diceGroups[0]?.die || 20,
                diceBreakdown: result.breakdown.replace(/ = \d+$/, "").replace(/\[|\]/g, ""),
                formula: result.formula,
                total: result.total,
                subtitle: result.isNat20 ? "Natural 20!" : result.isNat1 ? "Natural 1!" : "Rolled with Elder Flame",
                isCrit: result.isNat20,
                isMiss: result.isNat1,
                timestamp: Date.now()
            }
        ]);

        // Broadcast to OBR notification
        const sender = casterName ? `${casterName}: ` : "";
        if (result.isNat20) {
            OBR.notification.show(`${sender}NATURAL 20! (${result.formula}) -> ${result.breakdown}`, "SUCCESS");
        } else if (result.isNat1) {
            OBR.notification.show(`${sender}NATURAL 1! (${result.formula}) -> ${result.breakdown}`, "WARNING");
        } else {
            OBR.notification.show(`${sender}Roll (${result.formula}) -> ${result.breakdown}`, "INFO");
        }
    };

    const handleMainRollClick = () => {
        executeRoll(dicePool, modifier, d20Mode);
    };

    return (
        <div className="ddb-custom-dice-tray" role="dialog" aria-label="D&D Beyond Dice Roller">
            {/* 1. Header Bar */}
            <div className="ddb-dice-tray-header">
                <div className="ddb-dice-tray-title">
                    <IconDiceD20 size={16} className="ddb-dice-header-icon" />
                    <span>DICE ROLLER</span>
                </div>
                <div className="ddb-dice-header-actions">
                    <button
                        type="button"
                        className="ddb-dice-clear-btn"
                        onClick={handleClearPool}
                        title="Clear Dice Pool"
                    >
                        Clear
                    </button>
                    <button
                        type="button"
                        className="ddb-dice-close-btn"
                        onClick={onClose}
                        title="Close Dice Roller"
                    >
                        <IconClose size={13} />
                    </button>
                </div>
            </div>

            {/* 2. Dice Selection Grid */}
            <div className="ddb-dice-grid-section">
                <div className="ddb-dice-grid">
                    {DIE_CONFIGS.map(({ die, label, icon: IconComponent }) => {
                        const count = dicePool[die] || 0;
                        const isSelected = count > 0;
                        return (
                            <button
                                key={die}
                                type="button"
                                className={`ddb-die-select-btn ${isSelected ? "selected" : ""}`}
                                onClick={() => handleAddDie(die)}
                                onContextMenu={(e) => handleRemoveDie(die, e)}
                                title={`Left click: +1 ${label}\nRight click: -1 ${label}`}
                            >
                                <div className="ddb-die-icon-wrap">
                                    <IconComponent size={24} className="ddb-die-svg" />
                                    {isSelected && <span className="ddb-die-count-badge">×{count}</span>}
                                </div>
                                <span className="ddb-die-name">{label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* 3. Controls Bar: d20 Mode (ADV/DIS/NORM) & Modifier (+/-) */}
            <div className="ddb-dice-controls-bar">
                {/* d20 Mode Selector */}
                <div className="ddb-d20-mode-pills" title="Roll mode for d20">
                    <button
                        type="button"
                        className={`ddb-mode-pill ${d20Mode === "normal" ? "active" : ""}`}
                        onClick={() => setD20Mode("normal")}
                    >
                        Normal
                    </button>
                    <button
                        type="button"
                        className={`ddb-mode-pill adv ${d20Mode === "advantage" ? "active" : ""}`}
                        onClick={() => setD20Mode("advantage")}
                        title="Roll 2d20 and take the higher roll"
                    >
                        ADV
                    </button>
                    <button
                        type="button"
                        className={`ddb-mode-pill dis ${d20Mode === "disadvantage" ? "active" : ""}`}
                        onClick={() => setD20Mode("disadvantage")}
                        title="Roll 2d20 and take the lower roll"
                    >
                        DIS
                    </button>
                </div>

                {/* Modifier Stepper */}
                <div className="ddb-mod-stepper-wrap" title="Add or subtract static bonus">
                    <span className="ddb-mod-label">MOD:</span>
                    <button
                        type="button"
                        className="ddb-mod-btn"
                        onClick={() => setModifier(prev => prev - 1)}
                        title="Decrease modifier"
                    >
                        -
                    </button>
                    <input
                        type="number"
                        className="ddb-mod-input"
                        value={modifier}
                        onChange={(e) => setModifier(parseInt(e.target.value, 10) || 0)}
                    />
                    <button
                        type="button"
                        className="ddb-mod-btn"
                        onClick={() => setModifier(prev => prev + 1)}
                        title="Increase modifier"
                    >
                        +
                    </button>
                </div>
            </div>

            {/* 4. Formula Bar & Input Mode */}
            <div className="ddb-dice-formula-row">
                {isTextMode ? (
                    <input
                        type="text"
                        className="ddb-formula-input"
                        placeholder="e.g. 2d6 + 1d8 + 4"
                        value={customFormulaText}
                        onChange={(e) => setCustomFormulaText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleMainRollClick();
                        }}
                        autoFocus
                    />
                ) : (
                    <div className="ddb-formula-display" onClick={() => setIsTextMode(true)} title="Click to type custom text formula">
                        <span className="ddb-formula-text">{activeFormula}</span>
                        {d20Mode !== "normal" && (
                            <span className={`ddb-formula-badge ${d20Mode}`}>
                                {d20Mode === "advantage" ? "ADV" : "DIS"}
                            </span>
                        )}
                    </div>
                )}
                <button
                    type="button"
                    className="ddb-text-mode-toggle"
                    onClick={() => {
                        if (!isTextMode) {
                            setCustomFormulaText(activeFormula);
                        }
                        setIsTextMode(!isTextMode);
                    }}
                    title={isTextMode ? "Switch to Dice Button Mode" : "Type Custom Text Formula"}
                >
                    {isTextMode ? "Dice" : "Type"}
                </button>
            </div>

            {/* 5. Main ROLL Action Button */}
            <div className="ddb-dice-roll-action-row">
                <button
                    type="button"
                    className={`ddb-big-roll-btn ${isRollingAnim ? "rolling" : ""}`}
                    onClick={handleMainRollClick}
                >
                    <IconDiceD20 size={20} className="ddb-roll-btn-icon" />
                    <span>ROLL {activeFormula}</span>
                </button>
            </div>

            {/* 6. Quick Roll Row */}
            <div className="ddb-quick-roll-row">
                <span className="ddb-quick-roll-title">Quick 1-Click:</span>
                <div className="ddb-quick-roll-chips">
                    {DIE_CONFIGS.map(({ die, label }) => (
                        <button
                            key={die}
                            type="button"
                            className="ddb-quick-chip"
                            onClick={() => handleQuickRoll(die)}
                            title={`Instantly roll 1${label}`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* 7. Latest Result Display (DDB Glowing Card) */}
            {latestResult && (
                <div className={`ddb-latest-result-card ${latestResult.isNat20 ? "nat20" : latestResult.isNat1 ? "nat1" : ""}`}>
                    <div className="ddb-result-left">
                        <div className="ddb-result-total-num">
                            {latestResult.total}
                        </div>
                        {latestResult.isNat20 && <span className="ddb-crit-badge nat20">NAT 20!</span>}
                        {latestResult.isNat1 && <span className="ddb-crit-badge nat1">NAT 1</span>}
                    </div>
                    <div className="ddb-result-right">
                        <div className="ddb-result-formula-label">{latestResult.formula}</div>
                        <div className="ddb-result-breakdown-text">{latestResult.breakdown}</div>
                    </div>
                </div>
            )}

            {/* 8. Recent History (collapsible/list) */}
            {rollHistory.length > 1 && (
                <div className="ddb-dice-history-drawer">
                    <span className="ddb-history-label">RECENT ROLLS</span>
                    <div className="ddb-history-list">
                        {rollHistory.slice(1, 5).map((h, idx) => (
                            <div key={idx} className="ddb-history-item">
                                <span className="ddb-history-formula">{h.formula}</span>
                                <span className="ddb-history-breakdown">{h.breakdown}</span>
                                <button
                                    type="button"
                                    className="ddb-reroll-btn"
                                    onClick={() => {
                                        if (h.diceGroups && h.diceGroups.length > 0) {
                                            const pool: Record<number, number> = {};
                                            h.diceGroups.forEach(g => { pool[g.die] = g.count; });
                                            executeRoll(pool, h.modifier, h.d20Mode || "normal");
                                        } else {
                                            executeRoll({}, h.modifier || 0, h.d20Mode || "normal");
                                        }
                                    }}
                                    title="Re-roll this formula"
                                >
                                    ↻
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
export default CustomDiceRoller;
