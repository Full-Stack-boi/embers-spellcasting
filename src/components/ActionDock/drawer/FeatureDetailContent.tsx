import React from "react";
import { SORCERER_CLASS_FORMULAS } from "../../../assets/manual-formulas/index";
import { canConvertSlotToSorceryPoints, getAvailableSorceryPoints } from "../../../features/characterFeatures/domain/sorceryPointRules";
import type { ActiveBuff } from "../../../services/buffService";
import type { DDBParsedCharacter } from "../../../types/ddb";
import type { DetailDrawerItem, SpellSlotConfig } from "../domain/types";

type FeatureDrawerItem = Extract<NonNullable<DetailDrawerItem>, { type: "feature" }>;

interface FeatureDetailContentProps {
    item: FeatureDrawerItem;
    featureUses: Record<string, number>;
    activeBuffs: ActiveBuff[];
    character?: DDBParsedCharacter;
    spellSlots: Record<number, SpellSlotConfig>;
    pactSlots: SpellSlotConfig;
    onToggleFeatureUse: (feature: { id: string; limitedUse?: FeatureDrawerItem["limitedUse"] }, index: number) => void;
    onActivateFeature: (feature: FeatureDrawerItem) => void;
    onConvertSlotToSorceryPoints: (slotLevel: number, usePactSlot?: boolean) => void;
    onCreateSorcererSpellSlot: (slotLevel: number, pointCost: number, minimumClassLevel: number) => void;
}

export const FeatureDetailContent: React.FC<FeatureDetailContentProps> = ({
    item,
    featureUses,
    activeBuffs,
    character,
    spellSlots,
    pactSlots,
    onToggleFeatureUse,
    onActivateFeature,
    onConvertSlotToSorceryPoints,
    onCreateSorcererSpellSlot,
}) => {
    const isInnateSorcery = item.name.toLowerCase().includes("innate sorcery");
    const sorcererLevel = character?.classes
        .filter(characterClass => characterClass.name.toLowerCase().includes("sorcerer"))
        .reduce((total, characterClass) => total + characterClass.level, 0) ?? 0;
    const hasSorcererClass = sorcererLevel > 0;
    const maxPoints = item.limitedUse?.max ?? sorcererLevel;
    const usedPoints = featureUses[item.id] ?? item.limitedUse?.used ?? 0;
    const availablePoints = getAvailableSorceryPoints(maxPoints, usedPoints);
    const createSlotFormula = SORCERER_CLASS_FORMULAS.fontOfMagic.operations.find(operation => operation.type === "create_spell_slot");

    return (
        <div className="ddb-drawer-feature-content">
            {isInnateSorcery && (
                <div className="ddb-innate-sorcery-callout">
                    <div className="ddb-callout-card">
                        <h4 className="ddb-callout-title">Activate Innate Sorcery</h4>
                        <p className="ddb-callout-para">You unleash that magic for 1 minute, during which you gain the following benefits:</p>
                        <ul className="ddb-callout-list">
                            <li>The spell save DC of your Sorcerer spells increases by 1.</li>
                            <li>You have Advantage on the attack rolls of Sorcerer spells you cast.</li>
                        </ul>
                        <div className="ddb-callout-action-info"><span>Innate Sorcery: 1 Bonus Action</span></div>
                        <div className="ddb-callout-uses-row">
                            <span className="ddb-usage-label">Uses:</span>
                            <div className="ddb-feature-use-boxes">
                                {Array.from({ length: item.limitedUse?.max || 2 }).map((_, index) => {
                                    const usedCount = featureUses[item.id] ?? (item.limitedUse?.used ?? 0);
                                    return (
                                        <button
                                            key={index}
                                            type="button"
                                            className={`ddb-square-use-box ${index < usedCount ? "checked" : ""}`}
                                            onClick={() => onToggleFeatureUse({ id: item.id, limitedUse: item.limitedUse }, index)}
                                            title={`Use ${index + 1}`}
                                        />
                                    );
                                })}
                                <span className="ddb-reset-label">/ {item.limitedUse?.resetType || "Long Rest"}</span>
                            </div>
                        </div>
                    </div>
                    <div className="ddb-drawer-option-block">
                        <h4 className="ddb-drawer-option-heading">OPTION</h4>
                        <div className="ddb-option-select-box">
                            <div className="ddb-option-trigger"><span>Activate Innate Sorcery</span><span className="ddb-option-arrow">▲</span></div>
                            <div className="ddb-option-dropdown-panel">
                                <div className="ddb-option-dropdown-header">- Choose a Level 1 Option -</div>
                                <button
                                    type="button"
                                    className={`ddb-option-dropdown-item ${activeBuffs.some(buff => buff.name.toLowerCase().includes("innate sorcery")) ? "active" : ""}`}
                                    onClick={() => onActivateFeature(item)}
                                >
                                    <span className="ddb-option-checkmark">✓</span><span>Activate Innate Sorcery</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {item.rawDescription ? (
                <div className="ddb-rich-desc" dangerouslySetInnerHTML={{ __html: item.rawDescription }} />
            ) : (
                <p className="ddb-drawer-para">{item.description}</p>
            )}

            {item.limitedUse && item.limitedUse.max > 0 && !isInnateSorcery && (
                <div className="ddb-drawer-usage-section">
                    <span className="ddb-usage-label">Uses:</span>
                    <div className="ddb-feature-use-boxes">
                        {Array.from({ length: item.limitedUse.max }).map((_, index) => {
                            const usedCount = featureUses[item.id] ?? (item.limitedUse?.used ?? 0);
                            return (
                                <button
                                    key={index}
                                    type="button"
                                    className={`ddb-square-use-box ${index < usedCount ? "checked" : ""}`}
                                    onClick={() => onToggleFeatureUse({ id: item.id, limitedUse: item.limitedUse }, index)}
                                    title={`Use ${index + 1}`}
                                />
                            );
                        })}
                        <span className="ddb-reset-label">/ {item.limitedUse.resetType || "Long Rest"}</span>
                    </div>
                </div>
            )}

            {item.name.toLowerCase().includes("font of magic") && hasSorcererClass && character && (
                <div className="ddb-font-magic-actions">
                    <section className="ddb-font-magic-action-group">
                        <div className="ddb-font-magic-group-heading"><h4>Convert Spell Slot</h4><span>No Action</span></div>
                        <p>You can’t have more Sorcery Points than the maximum for your Sorcerer level.</p>
                        <div className="ddb-font-magic-current-points">Sorcery Points: <strong>{availablePoints}</strong> / {maxPoints}</div>
                        <div className="ddb-font-magic-button-list">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].flatMap(level => {
                                const slot = spellSlots[level];
                                if (!slot || slot.max <= slot.used) return [];
                                const canConvert = canConvertSlotToSorceryPoints(maxPoints, usedPoints, level);
                                return (
                                    <button key={`slot-${level}`} type="button" className="ddb-font-magic-action-btn" disabled={!canConvert} onClick={() => onConvertSlotToSorceryPoints(level)}>
                                        Level {level} slot <span>+{level} SP</span>
                                    </button>
                                );
                            })}
                            {pactSlots.max > pactSlots.used && character.pactMagic && (
                                <button
                                    key="pact-slot"
                                    type="button"
                                    className="ddb-font-magic-action-btn"
                                    disabled={!canConvertSlotToSorceryPoints(maxPoints, usedPoints, character.pactMagic.level)}
                                    onClick={() => onConvertSlotToSorceryPoints(character.pactMagic!.level, true)}
                                >
                                    Pact level {character.pactMagic.level} <span>+{character.pactMagic.level} SP</span>
                                </button>
                            )}
                            {Object.values(spellSlots).every(slot => slot.max <= slot.used) && pactSlots.max <= pactSlots.used && <span className="ddb-font-magic-empty">No spell slots available.</span>}
                            {availablePoints === 0 && (Object.values(spellSlots).some(slot => slot.max > slot.used) || pactSlots.max > pactSlots.used) && <span className="ddb-font-magic-empty">Sorcery Points are at their maximum.</span>}
                        </div>
                    </section>

                    <section className="ddb-font-magic-action-group">
                        <div className="ddb-font-magic-group-heading"><h4>Create Spell Slot</h4><span>Bonus Action · {availablePoints} SP available</span></div>
                        <p>Created slots disappear when you finish a Long Rest.</p>
                        <div className="ddb-font-magic-button-list">
                            {createSlotFormula?.type === "create_spell_slot" && createSlotFormula.options.map(option => {
                                const meetsLevel = sorcererLevel >= option.minimumClassLevel;
                                return (
                                    <button
                                        key={`create-${option.slotLevel}`}
                                        type="button"
                                        className="ddb-font-magic-action-btn"
                                        disabled={!meetsLevel || availablePoints < option.pointCost}
                                        onClick={() => onCreateSorcererSpellSlot(option.slotLevel, option.pointCost, option.minimumClassLevel)}
                                        title={!meetsLevel ? `Requires Sorcerer level ${option.minimumClassLevel}.` : undefined}
                                    >
                                        Level {option.slotLevel} slot <span>{option.pointCost} SP</span>
                                    </button>
                                );
                            })}
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
};
