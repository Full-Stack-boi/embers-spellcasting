import type { ReactNode } from "react";
import type { DDBFeatureAction, DDBWeaponAttack } from "../../../types/ddb";
import type { ActionsFilter, DockSpell } from "../domain/types";
import { ActionAllOverview } from "./ActionAllOverview";
import { ActionsFilterBar } from "./ActionsFilterBar";
import { ActionSubfilterPanels } from "./ActionSubfilterPanels";
import { AttackActionsTable, type AttackActionsTableProps } from "./AttackActionsTable";
import { CombatActionChips } from "./CombatActionChips";
import { InlineSpellChips } from "./InlineSpellChips";
import { IconSearch } from "../shared/Bg3Icons";

interface ActionsTabData {
    filteredWeapons: DDBWeaponAttack[];
    attackSpells: DockSpell[];
    actionFeatures: DDBFeatureAction[];
    actionSpells: DockSpell[];
    bonusActionFeatures: DDBFeatureAction[];
    bonusActionSpells: DockSpell[];
    reactionFeatures: DDBFeatureAction[];
    reactionSpells: DockSpell[];
    otherFeatures: DDBFeatureAction[];
    limitedUseFeatures: DDBFeatureAction[];
    filteredCombatActions: Array<{ name: string; description: string }>;
    weaponsList: DDBWeaponAttack[];
    hasTwoWeaponFighting: boolean;
    offhandWeapon?: DDBWeaponAttack;
    activeRiderMap: Record<string, string | null | undefined>;
    selectedSpellId: string | null;
    spellDamageTypeOverrides: Record<string, string>;
    upcastPickerSpellId: string | null;
    resolvedRiders?: import("../../../services/weaponDamageRiders").ResolvedWeaponRiders;
    selectedRiderChoice?: string;
    effectiveBonusDamage?: number;
    onSelectRiderChoice?: (choice: string) => void;
}

interface ActionsTabPanelProps {
    filter: ActionsFilter;
    search: string;
    data: ActionsTabData;
    attackTableHandlers: Omit<AttackActionsTableProps,
        "weapons" | "spells" | "activeRiderMap" | "selectedSpellId" | "damageTypeOverrides" | "upcastPickerSpellId" |
        "resolvedRiders" | "selectedRiderChoice" | "effectiveBonusDamage" | "onSelectRiderChoice">;
    onFilterChange: (filter: ActionsFilter) => void;
    onSearchChange: (search: string) => void;
    renderFeatureCard: (feature: DDBFeatureAction) => ReactNode;
    onSelectSpell: (spellId: string) => void;
    onOpenSpellDetails: (spellId: string) => void;
    onTwoWeaponFighting: () => void;
    onOpportunityAttack: () => void;
    onSelectCombatAction: (action: { name: string; description: string }) => void;
}

export function ActionsTabPanel({
    filter,
    search,
    data,
    attackTableHandlers,
    onFilterChange,
    onSearchChange,
    renderFeatureCard,
    onSelectSpell,
    onOpenSpellDetails,
    onTwoWeaponFighting,
    onOpportunityAttack,
    onSelectCombatAction,
}: ActionsTabPanelProps) {
    const attackTable = (
        <AttackActionsTable
            {...attackTableHandlers}
            weapons={data.filteredWeapons}
            spells={data.attackSpells}
            activeRiderMap={data.activeRiderMap}
            selectedSpellId={data.selectedSpellId}
            damageTypeOverrides={data.spellDamageTypeOverrides}
            upcastPickerSpellId={data.upcastPickerSpellId}
            resolvedRiders={data.resolvedRiders}
            selectedRiderChoice={data.selectedRiderChoice}
            effectiveBonusDamage={data.effectiveBonusDamage}
            onSelectRiderChoice={data.onSelectRiderChoice}
        />
    );

    return (
        <div className="ddb-tab-panel actions-panel">
            <ActionsFilterBar filter={filter} search={search} onFilterChange={onFilterChange} onSearchChange={onSearchChange} />

            {filter === "ATTACK" && (
                <div className="ddb-table-scroll-container">
                    <div className="ddb-actions-category-header in-table"><span className="ddb-category-title">ATTACKS &amp; WEAPONS</span></div>
                    {(data.filteredWeapons.length > 0 || data.attackSpells.length > 0) ? attackTable : (
                        <div className="ddb-empty-search-state">
                            <IconSearch size={22} className="ddb-empty-search-icon" />
                            <span className="ddb-empty-search-text">No attacks matching "{search}"</span>
                        </div>
                    )}
                </div>
            )}

            {filter === "ACTION" && (
                <div className="ddb-actions-list-panel">
                    <div className="ddb-actions-category-header"><span className="ddb-category-title">ACTIONS (1 ACTION)</span></div>
                    {data.filteredCombatActions.length > 0 && (
                        <div className="ddb-action-category-block">
                            <h4 className="ddb-category-block-title">Actions in Combat</h4>
                            <CombatActionChips actions={data.filteredCombatActions} onSelect={onSelectCombatAction} />
                        </div>
                    )}
                    {data.actionFeatures.length > 0 && (
                        <div className="ddb-action-category-block">
                            <h4 className="ddb-category-block-title">Feature Actions</h4>
                            {data.actionFeatures.map(renderFeatureCard)}
                        </div>
                    )}
                    {data.actionSpells.length > 0 && (
                        <div className="ddb-action-category-block">
                            <h4 className="ddb-category-block-title">Spells (1 Action)</h4>
                            <div className="ddb-action-card-item spells-line">
                                <div className="ddb-card-accent-bar" />
                                <div className="ddb-card-content ddb-spells-inline-wrap">
                                    <InlineSpellChips spells={data.actionSpells} onSelect={onSelectSpell} onOpenDetails={onOpenSpellDetails} titleSuffix=" (Right-click for info)" />
                                </div>
                            </div>
                        </div>
                    )}
                    {data.actionFeatures.length === 0 && data.actionSpells.length === 0 && data.filteredCombatActions.length === 0 && (
                        <div className="ddb-empty-search-state">
                            <IconSearch size={22} className="ddb-empty-search-icon" />
                            <span className="ddb-empty-search-text">No actions matching "{search}"</span>
                        </div>
                    )}
                </div>
            )}

            <ActionSubfilterPanels
                filter={filter}
                search={search}
                hasTwoWeaponFighting={data.hasTwoWeaponFighting}
                offhandWeapon={data.offhandWeapon}
                primaryWeapon={data.weaponsList[0]}
                bonusActionFeatures={data.bonusActionFeatures}
                bonusActionSpells={data.bonusActionSpells}
                reactionFeatures={data.reactionFeatures}
                reactionSpells={data.reactionSpells}
                otherFeatures={data.otherFeatures}
                limitedUseFeatures={data.limitedUseFeatures}
                renderFeatureCard={renderFeatureCard}
                onTwoWeaponFighting={onTwoWeaponFighting}
                onOpportunityAttack={onOpportunityAttack}
                onSelectSpell={onSelectSpell}
                onOpenSpellDetails={onOpenSpellDetails}
            />

            {filter === "ALL" && (
                <ActionAllOverview
                    attackTable={attackTable}
                    weapons={data.filteredWeapons}
                    attackSpells={data.attackSpells}
                    primaryWeapon={data.weaponsList[0]}
                    hasTwoWeaponFighting={data.hasTwoWeaponFighting}
                    offhandWeapon={data.offhandWeapon}
                    actionFeatures={data.actionFeatures}
                    actionSpells={data.actionSpells}
                    bonusActionFeatures={data.bonusActionFeatures}
                    bonusActionSpells={data.bonusActionSpells}
                    reactionFeatures={data.reactionFeatures}
                    reactionSpells={data.reactionSpells}
                    otherFeatures={data.otherFeatures}
                    combatActions={data.filteredCombatActions}
                    search={search}
                    renderFeatureCard={renderFeatureCard}
                    onTwoWeaponFighting={onTwoWeaponFighting}
                    onOpportunityAttack={onOpportunityAttack}
                    onSelectSpell={onSelectSpell}
                    onOpenSpellDetails={onOpenSpellDetails}
                    onSelectCombatAction={onSelectCombatAction}
                />
            )}
        </div>
    );
}
