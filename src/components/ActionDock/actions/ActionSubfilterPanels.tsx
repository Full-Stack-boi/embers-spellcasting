import type { ReactNode } from "react";
import type { DDBFeatureAction, DDBWeaponAttack } from "../../../types/ddb";
import type { ActionsFilter, DockSpell } from "../domain/types";
import { IconSearch } from "../shared/Bg3Icons";
import { InlineSpellChips } from "./InlineSpellChips";
import { TwoWeaponFightingAction } from "./TwoWeaponFightingAction";

interface ActionSubfilterPanelsProps {
    filter: ActionsFilter;
    search: string;
    hasTwoWeaponFighting: boolean;
    offhandWeapon?: DDBWeaponAttack;
    primaryWeapon?: DDBWeaponAttack;
    bonusActionFeatures: DDBFeatureAction[];
    bonusActionSpells: DockSpell[];
    reactionFeatures: DDBFeatureAction[];
    reactionSpells: DockSpell[];
    otherFeatures: DDBFeatureAction[];
    limitedUseFeatures: DDBFeatureAction[];
    renderFeatureCard: (feature: DDBFeatureAction) => ReactNode;
    onTwoWeaponFighting: () => void;
    onOpportunityAttack: () => void;
    onSelectSpell: (spellId: string) => void;
    onOpenSpellDetails: (spellId: string) => void;
}

export function ActionSubfilterPanels({
    filter,
    search,
    hasTwoWeaponFighting,
    offhandWeapon,
    primaryWeapon,
    bonusActionFeatures,
    bonusActionSpells,
    reactionFeatures,
    reactionSpells,
    otherFeatures,
    limitedUseFeatures,
    renderFeatureCard,
    onTwoWeaponFighting,
    onOpportunityAttack,
    onSelectSpell,
    onOpenSpellDetails,
}: ActionSubfilterPanelsProps) {
    if (filter === "BONUS ACTION") {
        return (
            <div className="ddb-actions-list-panel">
                <div className="ddb-actions-category-header"><span className="ddb-category-title">BONUS ACTIONS</span></div>
                <div className="ddb-action-category-block">
                    <h4 className="ddb-category-block-title">Actions in Combat</h4>
                    <TwoWeaponFightingAction
                        enabled={hasTwoWeaponFighting}
                        offhandWeapon={offhandWeapon}
                        onActivate={onTwoWeaponFighting}
                        showUnavailable
                        detailedTitle
                    />
                </div>
                {bonusActionFeatures.length > 0 && (
                    <div className="ddb-action-category-block">
                        <h4 className="ddb-category-block-title">Feature Actions</h4>
                        {bonusActionFeatures.map(renderFeatureCard)}
                    </div>
                )}
                {bonusActionSpells.length > 0 && (
                    <div className="ddb-action-category-block">
                        <h4 className="ddb-category-block-title">Spells</h4>
                        <div className="ddb-action-card-item spells-line">
                            <div className="ddb-card-accent-bar" />
                            <div className="ddb-card-content ddb-spells-inline-wrap">
                                <InlineSpellChips spells={bonusActionSpells} onSelect={onSelectSpell} onOpenDetails={onOpenSpellDetails} titleSuffix=" (Right-click for info)" />
                            </div>
                        </div>
                    </div>
                )}
                {bonusActionFeatures.length === 0 && bonusActionSpells.length === 0 && !hasTwoWeaponFighting && (
                    <EmptyActionMessage search={search} message="No bonus actions matching" />
                )}
            </div>
        );
    }

    if (filter === "REACTION") {
        return (
            <div className="ddb-actions-list-panel">
                <div className="ddb-actions-category-header"><span className="ddb-category-title">REACTIONS</span></div>
                <div className="ddb-action-category-block">
                    <h4 className="ddb-category-block-title">Actions in Combat</h4>
                    <div className="ddb-action-card-item oa" onClick={onOpportunityAttack} title="Opportunity Attack: You can make an opportunity attack when a hostile creature that you can see moves out of your reach.">
                        <div className="ddb-card-accent-bar" />
                        <div className="ddb-card-content">
                            <span className="ddb-card-name">Opportunity Attack</span>
                            {primaryWeapon && <span className="ddb-card-meta">({primaryWeapon.name}: +{primaryWeapon.toHit} to hit, {primaryWeapon.damage} {primaryWeapon.damageType})</span>}
                        </div>
                    </div>
                </div>
                {reactionFeatures.length > 0 && (
                    <div className="ddb-action-category-block">
                        <h4 className="ddb-category-block-title">Feature Actions</h4>
                        {reactionFeatures.map(renderFeatureCard)}
                    </div>
                )}
                {reactionSpells.length > 0 && (
                    <div className="ddb-action-category-block">
                        <h4 className="ddb-category-block-title">Spells</h4>
                        <div className="ddb-action-card-item spells-line">
                            <div className="ddb-card-accent-bar" />
                            <div className="ddb-card-content ddb-spells-inline-wrap">
                                <InlineSpellChips spells={reactionSpells} onSelect={onSelectSpell} onOpenDetails={onOpenSpellDetails} />
                            </div>
                        </div>
                    </div>
                )}
                {reactionFeatures.length === 0 && reactionSpells.length === 0 && <EmptyActionMessage search={search} message="No reactions matching" />}
            </div>
        );
    }

    if (filter === "OTHER" || filter === "LIMITED USE") {
        const features = filter === "OTHER" ? otherFeatures : limitedUseFeatures;
        const title = filter === "OTHER" ? "OTHER ACTIONS" : "LIMITED USE";
        const emptyMessage = filter === "OTHER" ? "No other features matching" : "No limited-use features matching";
        return (
            <div className="ddb-actions-list-panel">
                <div className="ddb-actions-category-header"><span className="ddb-category-title">{title}</span></div>
                {features.length > 0 ? features.map(renderFeatureCard) : <EmptyActionMessage search={search} message={emptyMessage} />}
            </div>
        );
    }

    return null;
}

function EmptyActionMessage({ search, message }: { search: string; message: string }) {
    return (
        <div className="ddb-empty-search-state">
            <IconSearch size={22} className="ddb-empty-search-icon" />
            <span className="ddb-empty-search-text">{message} "{search}"</span>
        </div>
    );
}
