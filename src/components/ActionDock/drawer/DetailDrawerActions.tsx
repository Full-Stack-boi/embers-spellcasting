import React from "react";
import { IconCastLightning, IconDiceD20, IconDragon, IconFire } from "../shared/Bg3Icons";
import type { ActiveBuff } from "../../../services/buffService";
import { isActivatableBuffFeature } from "../../../services/buffService";
import type { DDBInventoryItem, DDBWeaponAttack } from "../../../types/ddb";
import type { DetailDrawerItem, DockSpell } from "../domain/types";

type DrawerItem = NonNullable<DetailDrawerItem>;
type FeatureItem = Extract<DrawerItem, { type: "feature" }>;
type SpellItem = Extract<DrawerItem, { type: "spell" }>;

interface DetailDrawerActionsProps {
    item: DrawerItem;
    activeRider?: string | null;
    activeBuffs: ActiveBuff[];
    castLevel: number;
    pactMagicLevel?: number;
    rollHistoryCount: number;
    linkedSpells: DockSpell[];
    getAvailableSlotLevels: (baseLevel: number) => number[];
    getRemainingSlots: (level: number) => number;
    onCastLevelChange: (level: number) => void;
    onWeaponAttackRoll: (weapon: DDBWeaponAttack) => void;
    onWeaponDamageRoll: (weapon: DDBWeaponAttack, riderName?: string | null) => void;
    onSelectWeapon: (weapon: DDBWeaponAttack, mode?: "melee" | "thrown") => void;
    onSpellAttackRoll: (spell: SpellItem["spell"]) => void;
    onSpellDamageRoll: (spell: SpellItem["spell"]) => void;
    onCastClick: (spellId: string, level: number) => void;
    onSelectSpell: (spellId: string) => void;
    onActivateFeature: (feature: FeatureItem) => void;
    onFlurryOfBlows: () => void;
    onBonusUnarmedStrike: () => void;
    onOpenUpcastPicker: (spell: DockSpell) => void;
    onToggleItemAttunement: (item: DDBInventoryItem) => void;
    onClearHistory: () => void;
    onClose: () => void;
}

export const DetailDrawerActions: React.FC<DetailDrawerActionsProps> = ({
    item,
    activeRider,
    activeBuffs,
    castLevel,
    pactMagicLevel,
    rollHistoryCount,
    linkedSpells,
    getAvailableSlotLevels,
    getRemainingSlots,
    onCastLevelChange,
    onWeaponAttackRoll,
    onWeaponDamageRoll,
    onSelectWeapon,
    onSpellAttackRoll,
    onSpellDamageRoll,
    onCastClick,
    onSelectSpell,
    onActivateFeature,
    onFlurryOfBlows,
    onBonusUnarmedStrike,
    onOpenUpcastPicker,
    onToggleItemAttunement,
    onClearHistory,
    onClose,
}) => {
    const isBuffActive = item.type === "feature" && activeBuffs.some(buff =>
        buff.name.toLowerCase() === item.name.toLowerCase()
        || buff.id === item.id
        || (buff.id === "innate_sorcery" && item.name.toLowerCase().includes("innate sorcery")),
    );

    return (
        <div className="ddb-drawer-actions-bar">
            {item.type === "weapon" && (
                <>
                    <button type="button" className="ddb-drawer-action-btn primary" onClick={() => onWeaponAttackRoll(item.weapon)}>
                        <IconDiceD20 size={12} /><span>Roll Attack (+{item.weapon.toHit})</span>
                    </button>
                    <button type="button" className="ddb-drawer-action-btn" onClick={() => onWeaponDamageRoll(item.weapon, activeRider)}>
                        <IconFire size={12} /><span>Roll Damage ({item.weapon.damage})</span>
                    </button>
                    <button type="button" className="ddb-drawer-action-btn" onClick={() => onSelectWeapon(item.weapon, "melee")}><span>Aim</span></button>
                </>
            )}

            {item.type === "spell" && (
                <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: "6px" }}>
                    {item.spell.level > 0 && getAvailableSlotLevels(item.spell.level).length > 1 && (
                        <div className="ddb-drawer-slot-picker">
                            <span className="ddb-upcast-picker-label">Cast with Slot Level:</span>
                            <div className="ddb-upcast-levels">
                                {getAvailableSlotLevels(item.spell.level).map(level => {
                                    const remaining = getRemainingSlots(level);
                                    const isPact = level === pactMagicLevel;
                                    return (
                                        <button
                                            key={level}
                                            type="button"
                                            className={["ddb-upcast-lvl-btn", castLevel === level ? "selected" : "", remaining === 0 ? "exhausted" : "", isPact ? "pact" : ""].filter(Boolean).join(" ")}
                                            disabled={remaining === 0}
                                            onClick={() => onCastLevelChange(level)}
                                            title={`${remaining} slot${remaining !== 1 ? "s" : ""} remaining`}
                                        >
                                            <span className="ddb-upcast-lvl-num">{level}</span><span className="ddb-upcast-lvl-remain">{remaining} left</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                    {item.spell.level > 0 && !item.spell.isPrepared && (
                        <div className="ddb-drawer-unprepared-notice">Spell is not prepared on D&amp;D Beyond. Prepare it on your character sheet to cast or roll.</div>
                    )}
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                        {item.spell.hitOrDc?.startsWith("+") && (
                            <button type="button" className={`ddb-drawer-action-btn ${item.spell.level > 0 && !item.spell.isPrepared ? "disabled" : ""}`} disabled={item.spell.level > 0 && !item.spell.isPrepared} onClick={() => onSpellAttackRoll(item.spell)} title={item.spell.level > 0 && !item.spell.isPrepared ? "Spell is not prepared" : undefined}>
                                <IconDiceD20 size={12} /><span>Attack ({item.spell.hitOrDc})</span>
                            </button>
                        )}
                        {item.spell.damage && (
                            <button type="button" className={`ddb-drawer-action-btn ${item.spell.level > 0 && !item.spell.isPrepared ? "disabled" : ""}`} disabled={item.spell.level > 0 && !item.spell.isPrepared} onClick={() => onSpellDamageRoll(item.spell)} title={item.spell.level > 0 && !item.spell.isPrepared ? "Spell is not prepared" : undefined}>
                                <IconFire size={12} /><span>Damage ({item.spell.damage})</span>
                            </button>
                        )}
                        <button
                            type="button"
                            className={`ddb-drawer-action-btn primary ${item.spell.level > 0 && !item.spell.isPrepared ? "disabled" : ""}`}
                            disabled={item.spell.level > 0 && (!item.spell.isPrepared || (item.spell.usesSpellSlot !== false && getRemainingSlots(castLevel) === 0))}
                            onClick={() => onCastClick(item.spell.id, castLevel)}
                            title={item.spell.level > 0 && !item.spell.isPrepared ? "Spell is not prepared" : undefined}
                        >
                            <IconCastLightning size={12} />
                            <span>{item.spell.level > 0 && !item.spell.isPrepared ? "Unprepared" : item.spell.level > 0 && castLevel > item.spell.level ? `Cast at Level ${castLevel}` : "Cast Spell"}</span>
                        </button>
                        <button type="button" className={`ddb-drawer-action-btn ${item.spell.level > 0 && !item.spell.isPrepared ? "disabled" : ""}`} disabled={item.spell.level > 0 && !item.spell.isPrepared} onClick={() => onSelectSpell(item.spell.id)} title={item.spell.level > 0 && !item.spell.isPrepared ? "Spell is not prepared" : undefined}>
                            <span>Aim Target</span>
                        </button>
                    </div>
                </div>
            )}

            {item.type === "feature" && isActivatableBuffFeature(item.name) && (
                <button type="button" className={`ddb-drawer-action-btn ${isBuffActive ? "secondary active-buff-btn" : "primary"}`} onClick={() => onActivateFeature(item)}>
                    <IconFire size={12} /><span>{isBuffActive ? `Active: Deactivate ${item.name}` : `Activate ${item.name}`}</span>
                </button>
            )}
            {item.type === "feature" && item.name.toLowerCase().includes("flurry of blows") && (
                <button type="button" className="ddb-drawer-action-btn primary" onClick={() => { onFlurryOfBlows(); onClose(); }}><IconDragon size={12} /><span>Strike x2 (1 Focus Point)</span></button>
            )}
            {item.type === "feature" && (item.name.toLowerCase().includes("bonus unarmed strike") || (item.name.toLowerCase().includes("martial arts") && item.activationType === "bonus")) && !item.name.toLowerCase().includes("flurry") && (
                <button type="button" className="ddb-drawer-action-btn primary" onClick={() => { onBonusUnarmedStrike(); onClose(); }}><IconDragon size={12} /><span>Bonus Strike (1 Strike)</span></button>
            )}
            {item.type === "feature" && linkedSpells.length > 0 && (
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "6px" }}>
                    {linkedSpells.map(spell => (
                        <button key={spell.id} type="button" className="ddb-drawer-action-btn primary" onClick={() => { onOpenUpcastPicker(spell); onClose(); }}>
                            <IconCastLightning size={12} /><span>Cast {spell.name}</span>
                        </button>
                    ))}
                </div>
            )}
            {item.type === "item" && (item.item.canAttune || item.item.requiresAttunement || item.item.isAttuned) && (
                <button type="button" className={`ddb-drawer-action-btn ${item.item.isAttuned ? "secondary" : "primary"}`} onClick={() => onToggleItemAttunement(item.item)}>
                    <span>{item.item.isAttuned ? "Unattune Item" : "Attune Item"}</span>
                </button>
            )}
            {item.type === "log" && (
                <button type="button" className="ddb-drawer-action-btn" disabled={rollHistoryCount === 0} onClick={onClearHistory}><span>Clear All Rolls</span></button>
            )}
        </div>
    );
};
