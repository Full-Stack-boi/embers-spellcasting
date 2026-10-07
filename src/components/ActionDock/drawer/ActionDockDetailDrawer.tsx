import type { ComponentProps } from "react";
import type { DDBParsedCharacter } from "../../../types/ddb";
import type { DDBRollCardData } from "../../../types/ddbRollLog";
import type { ActiveBuff } from "../../../services/buffService";
import type { DamageType, SpellFormula } from "../../../types/spellFormula";
import type { DetailDrawerItem, SpellSlotConfig } from "../domain/types";
import { DetailDrawerHeader } from "./DetailDrawerHeader";
import { FeatureDetailContent } from "./FeatureDetailContent";
import { StaticDetailContent } from "./StaticDetailContent";
import { SpellDetailContent } from "./SpellDetailContent";
import { HitPointDrawerContent } from "./HitPointDrawerContent";
import { RollHistoryPanel } from "../overlays/RollHistoryPanel";
import { DetailDrawerActions } from "./DetailDrawerActions";

interface ActionDockDetailDrawerProps {
    item: NonNullable<DetailDrawerItem>;
    characterName: string;
    attunedCount: number;
    onClose: () => void;
    character: DDBParsedCharacter | null;
    featureUses: Record<string, number>;
    activeBuffs: ActiveBuff[];
    spellSlots: Record<number, SpellSlotConfig>;
    pactSlots: SpellSlotConfig;
    activeRiderMap: Record<string, string | null | undefined>;
    spellFormula: SpellFormula | null;
    characterLevel: number;
    selectedDamageType?: DamageType;
    onSelectDamageType: (damageType: string) => void;
    usedHitDice: Record<string, number>;
    onHeal: (amount: number) => void;
    onDamage: (amount: number) => void;
    onRollHitDie: (die: string, maxSides: number) => void;
    history: DDBRollCardData[];
    onClearHistory: () => void;
    actions: ComponentProps<typeof DetailDrawerActions>;
    onToggleFeatureUse: ComponentProps<typeof FeatureDetailContent>["onToggleFeatureUse"];
    onActivateFeature: ComponentProps<typeof FeatureDetailContent>["onActivateFeature"];
    onConvertSlot: ComponentProps<typeof FeatureDetailContent>["onConvertSlotToSorceryPoints"];
    onCreateSlot: ComponentProps<typeof FeatureDetailContent>["onCreateSorcererSpellSlot"];
    onRiderClick: ComponentProps<typeof StaticDetailContent>["onRiderClick"];
}

export function ActionDockDetailDrawer({
    item, characterName, attunedCount, onClose, character, featureUses, activeBuffs, spellSlots, pactSlots,
    activeRiderMap, spellFormula, characterLevel, selectedDamageType, onSelectDamageType, usedHitDice,
    onHeal, onDamage, onRollHitDie, history, onClearHistory, actions, onToggleFeatureUse, onActivateFeature,
    onConvertSlot, onCreateSlot, onRiderClick,
}: ActionDockDetailDrawerProps) {
    return (
        <div className={`ddb-detail-drawer ${item.type === "checks" ? "checks-mode" : ""}`}>
            <DetailDrawerHeader item={item} characterName={characterName} attunedCount={attunedCount} onClose={onClose} />
            <div className="ddb-drawer-scrollable" role="region" aria-label="Details" tabIndex={0}>
                {item.type === "feature" && (
                    <FeatureDetailContent
                        item={item} featureUses={featureUses} activeBuffs={activeBuffs} character={character ?? undefined}
                        spellSlots={spellSlots} pactSlots={pactSlots} onToggleFeatureUse={onToggleFeatureUse}
                        onActivateFeature={onActivateFeature} onConvertSlotToSorceryPoints={onConvertSlot}
                        onCreateSorcererSpellSlot={onCreateSlot}
                    />
                )}
                <StaticDetailContent item={item} character={character} activeRiderMap={activeRiderMap} onRiderClick={onRiderClick} />
                {item.type === "spell" && (
                    <SpellDetailContent
                        item={item} formula={spellFormula ?? undefined} characterLevel={characterLevel}
                        selectedDamageType={selectedDamageType} onSelectDamageType={onSelectDamageType}
                    />
                )}
                {item.type === "hp" && (
                    <HitPointDrawerContent item={item} character={character ?? undefined} usedHitDice={usedHitDice} onHeal={onHeal} onDamage={onDamage} onRollHitDie={onRollHitDie} />
                )}
                {item.type === "log" && <RollHistoryPanel history={history} onClear={onClearHistory} />}
            </div>
            <DetailDrawerActions {...actions} item={item} onClose={onClose} />
        </div>
    );
}
