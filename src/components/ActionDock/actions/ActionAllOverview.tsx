import type { ReactNode } from "react";
import type { DDBFeatureAction, DDBWeaponAttack } from "../../../types/ddb";
import type { DockSpell } from "../domain/types";
import { IconSearch } from "../shared/Bg3Icons";
import { CombatActionChips } from "./CombatActionChips";
import { InlineSpellChips } from "./InlineSpellChips";
import { TwoWeaponFightingAction } from "./TwoWeaponFightingAction";

interface CombatAction {
    name: string;
    description: string;
}

interface ActionAllOverviewProps {
    attackTable: ReactNode;
    weapons: DDBWeaponAttack[];
    attackSpells: DockSpell[];
    primaryWeapon?: DDBWeaponAttack;
    hasTwoWeaponFighting: boolean;
    offhandWeapon?: DDBWeaponAttack;
    actionFeatures: DDBFeatureAction[];
    actionSpells: DockSpell[];
    bonusActionFeatures: DDBFeatureAction[];
    bonusActionSpells: DockSpell[];
    reactionFeatures: DDBFeatureAction[];
    reactionSpells: DockSpell[];
    combatActions: CombatAction[];
    search: string;
    renderFeatureCard: (feature: DDBFeatureAction) => ReactNode;
    onTwoWeaponFighting: () => void;
    onOpportunityAttack: () => void;
    onSelectSpell: (spellId: string) => void;
    onOpenSpellDetails: (spellId: string) => void;
    onSelectCombatAction: (action: CombatAction) => void;
}

export function ActionAllOverview({
    attackTable,
    weapons,
    attackSpells,
    primaryWeapon,
    hasTwoWeaponFighting,
    offhandWeapon,
    actionFeatures,
    actionSpells,
    bonusActionFeatures,
    bonusActionSpells,
    reactionFeatures,
    reactionSpells,
    combatActions,
    search,
    renderFeatureCard,
    onTwoWeaponFighting,
    onOpportunityAttack,
    onSelectSpell,
    onOpenSpellDetails,
    onSelectCombatAction,
}: ActionAllOverviewProps) {
    const hasContent = weapons.length > 0 || attackSpells.length > 0 || actionFeatures.length > 0 || actionSpells.length > 0 ||
        bonusActionFeatures.length > 0 || bonusActionSpells.length > 0 || reactionFeatures.length > 0 ||
        reactionSpells.length > 0 || combatActions.length > 0;

    return (
        <div className="ddb-actions-list-panel all-actions-panel">
            {(weapons.length > 0 || attackSpells.length > 0) && (
                <div className="ddb-action-category-block">
                    <div className="ddb-actions-category-header"><span className="ddb-category-title">ATTACKS &amp; WEAPONS</span></div>
                    <div className="ddb-table-scroll-container embedded">{attackTable}</div>
                </div>
            )}

            {(actionFeatures.length > 0 || actionSpells.length > 0) && (
                <div className="ddb-action-category-block">
                    <div className="ddb-actions-category-header"><span className="ddb-category-title">ACTIONS (1 ACTION)</span></div>
                    {actionFeatures.map(renderFeatureCard)}
                    {actionSpells.length > 0 && <SpellLine spells={actionSpells} onSelect={onSelectSpell} onOpenDetails={onOpenSpellDetails} />}
                </div>
            )}

            {(hasTwoWeaponFighting || bonusActionFeatures.length > 0 || bonusActionSpells.length > 0) && (
                <div className="ddb-action-category-block">
                    <div className="ddb-actions-category-header"><span className="ddb-category-title">BONUS ACTIONS</span></div>
                    <TwoWeaponFightingAction enabled={hasTwoWeaponFighting} offhandWeapon={offhandWeapon} onActivate={onTwoWeaponFighting} />
                    {bonusActionFeatures.map(renderFeatureCard)}
                    {bonusActionSpells.length > 0 && <SpellLine spells={bonusActionSpells} onSelect={onSelectSpell} onOpenDetails={onOpenSpellDetails} />}
                </div>
            )}

            {(reactionFeatures.length > 0 || reactionSpells.length > 0 || primaryWeapon != null) && (
                <div className="ddb-action-category-block">
                    <div className="ddb-actions-category-header"><span className="ddb-category-title">REACTIONS</span></div>
                    <div className="ddb-action-card-item oa" onClick={onOpportunityAttack} title="Opportunity Attack: You can make an opportunity attack when a hostile creature that you can see moves out of your reach.">
                        <div className="ddb-card-accent-bar" />
                        <div className="ddb-card-content">
                            <span className="ddb-card-name">Opportunity Attack</span>
                            {primaryWeapon && <span className="ddb-card-meta">({primaryWeapon.name}: +{primaryWeapon.toHit} to hit, {primaryWeapon.damage} {primaryWeapon.damageType})</span>}
                        </div>
                    </div>
                    {reactionFeatures.map(renderFeatureCard)}
                    {reactionSpells.length > 0 && <SpellLine spells={reactionSpells} onSelect={onSelectSpell} onOpenDetails={onOpenSpellDetails} />}
                </div>
            )}

            {combatActions.length > 0 && (
                <div className="ddb-action-category-block">
                    <div className="ddb-actions-category-header"><span className="ddb-category-title">ACTIONS IN COMBAT</span></div>
                    <CombatActionChips actions={combatActions} onSelect={onSelectCombatAction} />
                </div>
            )}

            {!hasContent && (
                <div className="ddb-empty-search-state">
                    <IconSearch size={22} className="ddb-empty-search-icon" />
                    <span className="ddb-empty-search-text">No actions, weapons, or skills matching "{search}"</span>
                </div>
            )}
        </div>
    );
}

function SpellLine({ spells, onSelect, onOpenDetails }: {
    spells: DockSpell[];
    onSelect: (spellId: string) => void;
    onOpenDetails: (spellId: string) => void;
}) {
    return (
        <div className="ddb-action-card-item spells-line">
            <div className="ddb-card-accent-bar" />
            <div className="ddb-card-content ddb-spells-inline-wrap">
                <InlineSpellChips spells={spells} onSelect={onSelect} onOpenDetails={onOpenDetails} />
            </div>
        </div>
    );
}
