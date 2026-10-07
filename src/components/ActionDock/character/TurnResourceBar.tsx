import React from "react";
import type { DDBFeatureAction } from "../../../types/ddb";
import type { SpellSlotConfig } from "../domain/types";
import { GemAction, GemBonusAction } from "../shared/Bg3Icons";
import { getResourceBadge } from "./resourceBadges";
import { getFeatureFlyoutKind } from "../../../assets/manual-formulas/index";

interface TurnResourceBarProps {
    isOpen: boolean;
    actionUsed: boolean;
    bonusActionUsed: boolean;
    resources: DDBFeatureAction[];
    featureUses: Record<string, number>;
    spellSlots: Record<number, SpellSlotConfig>;
    pactSlots: SpellSlotConfig;
    activeFlyoutFeatureId: string | null;
    onActionToggle: () => void;
    onBonusActionToggle: () => void;
    onResourceClick: (feature: DDBFeatureAction) => void;
    onResourceContextMenu: (feature: DDBFeatureAction) => void;
    onSpellSlotToggle: (level: number) => void;
    onPactSlotToggle: () => void;
}

const ROMAN_NUMERALS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"];

export const TurnResourceBar: React.FC<TurnResourceBarProps> = ({
    isOpen,
    actionUsed,
    bonusActionUsed,
    resources,
    featureUses,
    spellSlots,
    pactSlots,
    activeFlyoutFeatureId,
    onActionToggle,
    onBonusActionToggle,
    onResourceClick,
    onResourceContextMenu,
    onSpellSlotToggle,
    onPactSlotToggle,
}) => (
    <div id="ddb-turn-resource-tray" className={`ddb-turn-resource-bar ${isOpen ? "open" : ""}`}>
        <div className="ddb-gem-group" title="Turn Action Economy">
            <button type="button" className={`ddb-action-gem action ${actionUsed ? "expended" : ""}`} onClick={onActionToggle} title={`Action: ${actionUsed ? "Expended" : "Available"} (Click to toggle)`} aria-label="Action point">
                <GemAction expended={actionUsed} />
            </button>
            <button type="button" className={`ddb-action-gem bonus ${bonusActionUsed ? "expended" : ""}`} onClick={onBonusActionToggle} title={`Bonus Action: ${bonusActionUsed ? "Expended" : "Available"} (Click to toggle)`} aria-label="Bonus action point">
                <GemBonusAction expended={bonusActionUsed} />
            </button>
        </div>
        {(resources.length > 0 || Object.values(spellSlots).some(slot => slot.max > 0) || pactSlots.max > 0) && (
            <>
                <div className="ddb-top-strip-divider" />
                <div className="ddb-deck-slots-group">
                    {resources.map(feature => {
                        const max = feature.limitedUse?.max || 0;
                        const used = featureUses[feature.id] ?? (feature.limitedUse?.used || 0);
                        const available = Math.max(0, max - used);
                        const { label, theme } = getResourceBadge(feature.name, feature.source);
                        const flyoutKind = getFeatureFlyoutKind(feature);
                        return (
                            <button
                                key={feature.id}
                                type="button"
                                className={`ddb-slot-pill-btn resource-pill ${theme} ${activeFlyoutFeatureId === feature.id ? "active-flyout-pill" : ""}`}
                                onClick={() => onResourceClick(feature)}
                                onContextMenu={event => {
                                    event.preventDefault();
                                    onResourceContextMenu(feature);
                                }}
                                title={flyoutKind ? `${feature.name}: ${available}/${max} available\nClick to open flyout bar (Right-click to expend/restore)` : `${feature.name}: ${available}/${max} available\nClick to expend/restore`}
                            >
                                <span className="ddb-slot-num">{label}</span>
                                {max <= 6 ? (
                                    <div className="ddb-slot-pips-row">
                                        {Array.from({ length: max }).map((_, index) => <div key={index} className={`ddb-slot-dot ${theme} ${index < available ? "filled" : "expended"}`} />)}
                                    </div>
                                ) : <span className="ddb-resource-pool-text">{available}/{max}</span>}
                                {used < 0 && <span className="ddb-resource-overcap">+{Math.abs(used)}</span>}
                            </button>
                        );
                    })}
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(level => {
                        const slot = spellSlots[level];
                        if (!slot || slot.max === 0) return null;
                        const available = slot.max - slot.used;
                        return (
                            <button key={level} type="button" className="ddb-slot-pill-btn" onClick={() => onSpellSlotToggle(level)} title={`Level ${level} Slots: ${available}/${slot.max} available\nClick to expend/restore`}>
                                <span className="ddb-slot-num">{ROMAN_NUMERALS[level - 1]}</span>
                                <div className="ddb-slot-pips-row">
                                    {Array.from({ length: slot.max }).map((_, index) => <div key={index} className={`ddb-slot-dot ${index < available ? "filled" : "expended"}`} />)}
                                </div>
                            </button>
                        );
                    })}
                    {pactSlots.max > 0 && (
                        <button type="button" className="ddb-slot-pill-btn pact-slot" onClick={onPactSlotToggle} title={`Pact Magic Slots: ${pactSlots.max - pactSlots.used}/${pactSlots.max}\nClick to expend/restore`}>
                            <span className="ddb-slot-num">PACT</span>
                            <div className="ddb-slot-pips-row">
                                {Array.from({ length: pactSlots.max }).map((_, index) => <div key={index} className={`ddb-slot-dot pact ${index < (pactSlots.max - pactSlots.used) ? "filled" : "expended"}`} />)}
                            </div>
                        </button>
                    )}
                </div>
            </>
        )}
    </div>
);
