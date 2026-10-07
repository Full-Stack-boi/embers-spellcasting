import React from "react";
import { getFeatureFlyoutKind } from "../../../assets/manual-formulas/index";
import { isActivatableBuffFeature } from "../../../services/buffService";
import type { ActiveBuff } from "../../../services/buffService";
import type { DDBFeatureAction } from "../../../types/ddb";
import { IconCheck, IconDragon } from "../shared/Bg3Icons";
import type { DetailDrawerItem, FeaturesFilter } from "../domain/types";

const FEATURE_FILTERS: FeaturesFilter[] = ["ALL", "CLASS", "SPECIES", "FEATS"];

export interface FeaturesTabProps {
    features: DDBFeatureAction[];
    filter: FeaturesFilter;
    onFilterChange: (filter: FeaturesFilter) => void;
    tokenId?: string;
    featureUses: Record<string, number>;
    expandedFeatures: Record<string, boolean>;
    activeBuffs: ActiveBuff[];
    activeFlyoutFeatureId: string | null;
    onSyncCharacter: (characterId?: string) => void | Promise<void>;
    onOpenDrawer: (item: NonNullable<DetailDrawerItem>) => void;
    onToggleFlyout: (featureId: string) => void;
    onActivateFeature: (feature: DDBFeatureAction) => void;
    onToggleFeatureUse: (feature: DDBFeatureAction, index: number) => void;
    onToggleExpanded: (featureId: string) => void;
}

function featureDrawerItem(feature: DDBFeatureAction): NonNullable<DetailDrawerItem> {
    return {
        type: "feature",
        id: feature.id,
        name: feature.name,
        category: feature.source === "class" ? "Class Feature" : feature.source === "race" ? "Species Trait" : "Feat",
        activationType: feature.activationType,
        rangeText: feature.rangeText,
        description: feature.description,
        rawDescription: feature.rawDescription,
        limitedUse: feature.limitedUse,
    };
}

export const FeaturesTab: React.FC<FeaturesTabProps> = ({
    features,
    filter,
    onFilterChange,
    tokenId,
    featureUses,
    expandedFeatures,
    activeBuffs,
    activeFlyoutFeatureId,
    onSyncCharacter,
    onOpenDrawer,
    onToggleFlyout,
    onActivateFeature,
    onToggleFeatureUse,
    onToggleExpanded,
}) => (
    <div className="ddb-tab-panel features-panel">
        <div className="ddb-subfilter-bar">
            {FEATURE_FILTERS.map(value => (
                <button key={value} type="button" className={`ddb-subfilter-btn ${filter === value ? "active" : ""}`} onClick={() => onFilterChange(value)}>
                    {value === "CLASS" ? "CLASS FEATURES" : value === "SPECIES" ? "SPECIES TRAITS" : value}
                </button>
            ))}
        </div>

        <div className="ddb-features-scroll-container">
            {features.length === 0 ? (
                <div className="ddb-features-empty">
                    <p>No features in this category, or no character linked.</p>
                    <button type="button" className="ddb-sync-prompt-btn" onClick={() => onSyncCharacter(tokenId)}>
                        <IconDragon size={13} />
                        <span>Sync D&amp;D Beyond Character</span>
                    </button>
                </div>
            ) : features.map(feature => {
                const maxUses = feature.limitedUse?.max ?? 0;
                const usedCount = featureUses[feature.id] ?? (feature.limitedUse?.used ?? 0);
                const isExpanded = Boolean(expandedFeatures[feature.id]);
                const featureName = feature.name.toLowerCase();
                const isBuffActive = activeBuffs.some(buff => buff.name.toLowerCase() === featureName || buff.id === feature.id || (buff.id === "innate_sorcery" && featureName.includes("innate sorcery")));
                const flyoutKind = getFeatureFlyoutKind(feature);
                const openDrawer = () => onOpenDrawer(featureDrawerItem(feature));

                return (
                    <div
                        key={feature.id}
                        className={`ddb-feature-card ${isBuffActive ? "buff-active-card" : ""} ${activeFlyoutFeatureId === feature.id ? "flyout-active-card" : ""}`}
                        onClick={() => flyoutKind ? onToggleFlyout(feature.id) : openDrawer()}
                        onContextMenu={event => { event.preventDefault(); openDrawer(); }}
                        style={{ cursor: "pointer" }}
                        title={flyoutKind ? "Click to open interactive flyout (Right-click for details)" : "Click to view details in drawer"}
                    >
                        <div className="ddb-feature-header-row">
                            <div className="ddb-feature-title-block">
                                <div className="ddb-feature-title-action-row">
                                    <h4 className="ddb-feature-title">{feature.name}</h4>
                                    {isActivatableBuffFeature(feature.name) && (
                                        <button
                                            type="button"
                                            className={`ddb-feature-activate-btn ${isBuffActive ? "active" : ""}`}
                                            aria-pressed={isBuffActive}
                                            onClick={event => { event.stopPropagation(); onActivateFeature(feature); }}
                                            title={isBuffActive ? `Active: Click to deactivate ${feature.name}` : `Click to activate ${feature.name}`}
                                        >
                                            {isBuffActive ? "Active" : "Activate"}
                                        </button>
                                    )}
                                </div>
                                <span className="ddb-feature-source-badge">
                                    {feature.source.toUpperCase()} {feature.activationType ? `• ${feature.activationType.toUpperCase()}` : ""}
                                </span>
                            </div>
                            {maxUses > 0 && (
                                <div className="ddb-feature-usage-tracker" onClick={event => event.stopPropagation()}>
                                    <span className="ddb-usage-label">USES:</span>
                                    <div className="ddb-usage-boxes-row">
                                        {Array.from({ length: maxUses }).map((_, index) => {
                                            const isChecked = index < usedCount;
                                            return (
                                                <button
                                                    key={index}
                                                    type="button"
                                                    className={`ddb-use-box ${isChecked ? "checked" : ""}`}
                                                    onClick={() => onToggleFeatureUse(feature, index)}
                                                    title={`Use ${index + 1}: ${isChecked ? "Expended" : "Available"} (Click to toggle)`}
                                                >
                                                    {isChecked && <IconCheck size={11} />}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <span className="ddb-reset-type">/ {feature.limitedUse?.resetType || "Long Rest"}</span>
                                </div>
                            )}
                        </div>

                        {feature.description && (
                            <div className="ddb-feature-body">
                                <p className={`ddb-feature-desc ${isExpanded ? "expanded" : "clamped"}`}>{feature.description}</p>
                                {feature.description.length > 140 && (
                                    <button type="button" className="ddb-more-less-btn" onClick={event => { event.stopPropagation(); onToggleExpanded(feature.id); }}>
                                        {isExpanded ? "Show Less" : "Show More"}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    </div>
);
