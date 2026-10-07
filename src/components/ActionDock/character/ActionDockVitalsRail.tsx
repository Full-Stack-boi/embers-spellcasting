import type { Dispatch, SetStateAction } from "react";
import OBR from "@owlbear-rodeo/sdk";
import type { DDBParsedCharacter } from "../../../types/ddb";
import type { ActiveBuff } from "../../../services/buffService";
import type { DetailDrawerItem } from "../domain/types";
import { bindTokenToPlayer, focusCameraOnToken, unbindTokenFromPlayer } from "../../../features/player/playerCharacterService";
import { openDDBSyncModal } from "../../../views/DDBSyncModal";
import { toggleDDBRollLogPopover } from "../../../services/rollLogService";
import { IconClearTargets, IconCheck, IconCondition, IconDiceD20, IconGameLog, IconGrimoire, IconLongRest } from "../shared/Bg3Icons";
import { CharacterIdentity } from "./CharacterIdentity";
import { DeathSavesControl } from "./DeathSavesControl";
import { HitPointSummary } from "./HitPointSummary";
import { CombatVitals } from "./CombatVitals";
import { ActiveStatusChips } from "./ActiveStatusChips";
import { ConditionsPopover } from "../overlays/ConditionsPopover";

interface ActionDockVitalsRailProps {
    character: DDBParsedCharacter | null;
    caster?: { id: string } | null;
    player?: { id?: string; name?: string; role?: string };
    avatarUrl: string;
    casterName: string;
    classSummary: string;
    isReadOnlyInspection: boolean;
    isOwnedByMe: boolean;
    otherOwnerName?: string;
    currentHp: number;
    maxHp: number;
    temporaryHp: number;
    customTemporaryHp: number;
    deathSaves: { successes: number; failures: number };
    setDeathSaves: Dispatch<SetStateAction<{ successes: number; failures: number }>>;
    heroicInspiration: boolean;
    drawerItem: DetailDrawerItem | null;
    setDrawerItem: Dispatch<SetStateAction<DetailDrawerItem | null>>;
    isDiceRollerOpen: boolean;
    setIsDiceRollerOpen: Dispatch<SetStateAction<boolean>>;
    isConditionsMenuOpen: boolean;
    conditions: string[];
    exhaustionLevel: number;
    setExhaustionLevel: Dispatch<SetStateAction<number>>;
    activeBuffs: ActiveBuff[];
    concentrationSpell: { id: string; name: string } | null;
    unreadRolls: number;
    onUnreadRollsClear: () => void;
    onLongRest: () => void;
    onDeathSaveRoll: () => void;
    onHeal: () => void;
    onDamage: () => void;
    onInitiativeRoll: () => void;
    onToggleInspiration: () => void;
    onOpenSpellBrowser: () => void;
    onClearTargets: () => void;
    onBreakConcentration: () => void;
    onToggleCondition: (condition: string) => void;
    onToggleConditionMenu: () => void;
    onRemoveBuff: (buffId: string) => void;
}

export function ActionDockVitalsRail({
    character, caster, player, avatarUrl, casterName, classSummary, isReadOnlyInspection, isOwnedByMe,
    otherOwnerName, currentHp, maxHp, temporaryHp, customTemporaryHp, deathSaves, setDeathSaves,
    heroicInspiration, drawerItem, setDrawerItem, isDiceRollerOpen, setIsDiceRollerOpen,
    isConditionsMenuOpen, conditions, exhaustionLevel, setExhaustionLevel,
    activeBuffs, concentrationSpell, unreadRolls, onUnreadRollsClear, onLongRest, onDeathSaveRoll,
    onHeal, onDamage, onInitiativeRoll, onToggleInspiration, onOpenSpellBrowser, onClearTargets,
    onBreakConcentration, onToggleCondition, onToggleConditionMenu, onRemoveBuff,
}: ActionDockVitalsRailProps) {
    const handleRelease = async () => {
        if (!caster?.id || !player?.id) return;
        await unbindTokenFromPlayer(caster.id);
        OBR.notification.show(`Removed "${casterName}" from your characters.`, "INFO");
    };
    const handleClaim = async () => {
        if (!caster?.id || !player?.id) return;
        await bindTokenToPlayer(caster.id, player.id, player.name);
        OBR.notification.show(`Bound ${casterName} to ${player.name || "you"}!`, "SUCCESS");
    };
    const handleRemoveBuff = async (buffId: string) => {
        if (!caster?.id) return;
        await onRemoveBuff(buffId);
    };

    return (
        <aside className="ddb-vitals-pillar">
            <CharacterIdentity
                avatarUrl={avatarUrl}
                name={casterName}
                classSummary={classSummary}
                isSynced={Boolean(character)}
                isReadOnlyInspection={isReadOnlyInspection}
                isPlayer={player?.role === "PLAYER"}
                isOwnedByMe={isOwnedByMe}
                otherOwnerName={otherOwnerName}
                tokenId={caster?.id}
                onOpenSync={() => openDDBSyncModal(caster?.id)}
                onRelease={handleRelease}
                onClaim={handleClaim}
                onFocus={() => { if (caster?.id) focusCameraOnToken(caster.id); }}
            />

            {character && currentHp === 0 && (
                <DeathSavesControl
                    successes={deathSaves.successes}
                    failures={deathSaves.failures}
                    onSuccessesChange={update => setDeathSaves(previous => ({ ...previous, successes: update(previous.successes) }))}
                    onFailuresChange={update => setDeathSaves(previous => ({ ...previous, failures: update(previous.failures) }))}
                    onRoll={onDeathSaveRoll}
                />
            )}

            {character && (
                <HitPointSummary
                    current={currentHp}
                    max={maxHp}
                    temporary={temporaryHp}
                    onOpenDetails={() => setDrawerItem({ type: "hp", current: currentHp, max: maxHp, temp: customTemporaryHp })}
                    onHeal={onHeal}
                    onDamage={onDamage}
                />
            )}

            {character && (
                <CombatVitals
                    character={character}
                    heroicInspiration={heroicInspiration}
                    onOpenDrawer={setDrawerItem}
                    onInitiativeRoll={onInitiativeRoll}
                    onToggleInspiration={onToggleInspiration}
                />
            )}

            <div className="ddb-pillar-toolbar">
                <button type="button" className="ddb-pillar-tool-btn rest" onClick={onLongRest} title="Long Rest: Reset all actions, spell slots, and feature uses"><IconLongRest size={12} /><span>Rest</span></button>
                <button type="button" className={`ddb-pillar-tool-btn ${drawerItem?.type === "checks" ? "active" : ""}`} onClick={() => setDrawerItem(drawerItem?.type === "checks" ? null : { type: "checks" })} title="Ability Checks & Saving Throws (Sheet Checks)"><IconCheck size={12} /><span>Checks</span></button>
                <button type="button" className={`ddb-pillar-tool-btn ${isDiceRollerOpen ? "active" : ""}`} onClick={() => setIsDiceRollerOpen(prev => !prev)} title="D&D Beyond Custom Dice Roller"><IconDiceD20 size={12} /></button>
                <button type="button" className={`ddb-pillar-tool-btn ${isConditionsMenuOpen ? "active" : ""}`} onClick={onToggleConditionMenu} title="Active Conditions & Exhaustion Tracker"><IconCondition size={12} />{conditions.length > 0 && <span className="ddb-pillar-tool-badge">{conditions.length}</span>}</button>
                <button type="button" className="ddb-pillar-tool-btn" onClick={onOpenSpellBrowser} title="Browse Complete Spell Library (.)"><IconGrimoire size={12} /></button>
                <button type="button" className="ddb-pillar-tool-btn" onClick={onClearTargets} title="Clear Target Highlights (X)"><IconClearTargets size={12} /></button>
                <button type="button" className="ddb-pillar-tool-btn" onClick={() => { toggleDDBRollLogPopover(); onUnreadRollsClear(); }} title="Toggle D&D Beyond Game Log" style={{ position: "relative" }}>
                    <IconGameLog size={12} />
                    {unreadRolls > 0 && <span className="ddb-unread-badge">{unreadRolls > 9 ? "9+" : unreadRolls}</span>}
                </button>
            </div>

            {(activeBuffs.length > 0 || concentrationSpell || conditions.length > 0 || exhaustionLevel > 0) && (
                <ActiveStatusChips
                    buffs={activeBuffs}
                    concentration={concentrationSpell}
                    conditions={conditions}
                    exhaustionLevel={exhaustionLevel}
                    onBreakConcentration={onBreakConcentration}
                    onToggleCondition={onToggleCondition}
                    onReduceExhaustion={() => setExhaustionLevel(previous => Math.max(0, previous - 1))}
                    onRemoveBuff={handleRemoveBuff}
                />
            )}
            {isConditionsMenuOpen && <ConditionsPopover conditions={conditions} exhaustionLevel={exhaustionLevel} onExhaustionChange={setExhaustionLevel} onToggleCondition={onToggleCondition} />}
        </aside>
    );
}
