import { getFeatureFlyoutKind, findMatchingActionFormula } from "../../../assets/manual-formulas/index";
import { isActivatableBuffFeature } from "../../../services/buffService";
import type { DDBFeatureAction } from "../../../types/ddb";
import type { DetailDrawerItem, DockSpell } from "../domain/types";

export interface FeatureActionCardProps {
    feature: DDBFeatureAction;
    usedCount: number;
    activeBuff: boolean;
    activeFlyout: boolean;
    spells: DockSpell[];
    onOpenDrawer: (item: NonNullable<DetailDrawerItem>) => void;
    onToggleFlyout: (featureId: string) => void;
    onActivate: (feature: DDBFeatureAction) => void;
    onFlurry: () => void;
    onBonusStrike: () => void;
    onOpenSpell: (spell: DockSpell) => void;
    onToggleUse: (feature: DDBFeatureAction, index: number) => void;
    onFeatureOptionClick?: (feature: DDBFeatureAction, optionId: string) => void;
}

function toDrawerItem(feature: DDBFeatureAction): NonNullable<DetailDrawerItem> {
    return {
        type: "feature",
        id: feature.id,
        name: feature.name,
        description: feature.description || "",
        rawDescription: feature.rawDescription,
        componentId: feature.componentId,
        category: feature.source === "class" ? "Class Feature" : feature.source === "feat" ? "Feat" : "Racial Trait",
        activationType: feature.activationType,
        limitedUse: feature.limitedUse,
    };
}

export const FeatureActionCard: React.FC<FeatureActionCardProps> = ({
    feature,
    usedCount,
    activeBuff,
    activeFlyout,
    spells,
    onOpenDrawer,
    onToggleFlyout,
    onActivate,
    onFlurry,
    onBonusStrike,
    onOpenSpell,
    onToggleUse,
    onFeatureOptionClick,
}) => {
    const featureName = feature.name.toLowerCase();
    const canActivate = isActivatableBuffFeature(feature.name);
    const flyoutKind = getFeatureFlyoutKind(feature);
    const isFlurry = featureName.includes("flurry of blows");
    const isBonusStrike = featureName.includes("bonus unarmed strike") || (featureName.includes("martial arts") && feature.activationType === "bonus");
    const matchingFormula = findMatchingActionFormula(feature.name);
    const linkedSpells = spells.filter(spell => {
        if (spell.rawDdbSpell?.componentId && feature.componentId && spell.rawDdbSpell.componentId === feature.componentId) return true;
        const featureDescription = (feature.description || "").toLowerCase();
        const spellName = spell.name.toLowerCase();
        return (featureDescription.includes(spellName) || (featureName.includes("shadow arts") && spellName === "darkness")) && (spell.usesSpellSlot === false || spell.fromChar);
    });
    const openDrawer = () => onOpenDrawer(toDrawerItem(feature));

    return (
        <div
            className={`ddb-action-category-block feature-block ${activeBuff ? "buff-active-card" : ""} ${activeFlyout ? "flyout-active-card" : ""}`}
            onClick={() => flyoutKind ? onToggleFlyout(feature.id) : openDrawer()}
            onContextMenu={event => { event.preventDefault(); openDrawer(); }}
            title={flyoutKind ? "Click to open interactive flyout (Right-click for drawer)" : "Click to view details in drawer"}
        >
            <div className="ddb-feature-header-row">
                <div className="ddb-feature-title-block">
                    <div className="ddb-feature-title-action-row">
                        <h4 className="ddb-category-block-title feature-title">{feature.name}</h4>
                        {canActivate && (
                            <button
                                type="button"
                                className={`ddb-feature-activate-btn ${activeBuff ? "active" : ""}`}
                                aria-pressed={activeBuff}
                                onClick={event => { event.stopPropagation(); onActivate(feature); }}
                                title={activeBuff ? `Active: Click to deactivate ${feature.name}` : `Click to activate ${feature.name}`}
                            >
                                {activeBuff ? "Active" : "Activate"}
                            </button>
                        )}
                    </div>
                    <span className="ddb-feature-source-badge">{feature.source.toUpperCase()}</span>
                </div>
            </div>

            {(isFlurry || isBonusStrike || (matchingFormula?.options && matchingFormula.options.length > 0) || linkedSpells.length > 0) && (
                <div className="ddb-feature-linked-spells" style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "4px", marginBottom: "4px" }} onClick={event => event.stopPropagation()}>
                    {isFlurry && <button type="button" className="ddb-feature-cast-spell-btn" onClick={onFlurry} title="Execute 2 Unarmed Strikes (1 Focus Point, Bonus Action)">Strike x2 (1 Focus)</button>}
                    {isBonusStrike && !isFlurry && <button type="button" className="ddb-feature-cast-spell-btn" onClick={onBonusStrike} title="Execute 1 Unarmed Strike (Bonus Action)">Bonus Strike</button>}
                    {matchingFormula?.options?.map(opt => (
                        <button
                            key={opt.id}
                            type="button"
                            className="ddb-feature-cast-spell-btn"
                            onClick={() => onFeatureOptionClick?.(feature, opt.id)}
                            title={opt.desc || opt.name}
                        >
                            {opt.name}
                        </button>
                    ))}
                    {linkedSpells.map(spell => (
                        <button key={spell.id} type="button" className="ddb-feature-cast-spell-btn" onClick={() => onOpenSpell(spell)} title={`Cast ${spell.name} from ${feature.name}`}>
                            Cast {spell.name}
                        </button>
                    ))}
                </div>
            )}

            <p className="ddb-feature-description">{feature.description}</p>
            {(feature.limitedUse?.max ?? 0) > 0 && (
                <div className="ddb-feature-use-boxes" onClick={event => event.stopPropagation()}>
                    {Array.from({ length: feature.limitedUse?.max ?? 0 }).map((_, index) => (
                        <button
                            key={index}
                            type="button"
                            className={`ddb-square-use-box ${index < usedCount ? "checked" : ""}`}
                            onClick={() => onToggleUse(feature, index)}
                            title={`Use ${index + 1} of ${feature.limitedUse?.max}`}
                        />
                    ))}
                    <span className="ddb-reset-label">/ {feature.limitedUse?.resetType || "Long Rest"}</span>
                </div>
            )}
        </div>
    );
};
