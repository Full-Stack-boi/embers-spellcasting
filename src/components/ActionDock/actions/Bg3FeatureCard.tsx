import type { DDBFeatureAction } from "../../../types/ddb";
import { getFeatureFlyoutKind } from "../../../assets/manual-formulas/index";
import type { DetailDrawerItem } from "../domain/types";
import { GemAction } from "../shared/Bg3Icons";
import { ActionGridTile } from "./ActionGridTile";

interface Bg3FeatureCardProps {
    feature: DDBFeatureAction;
    index: number;
    usedCount: number;
    selected: boolean;
    onToggleFlyout: (featureId: string) => void;
    onOpenDetails: (item: DetailDrawerItem) => void;
}

function getFeatureCategory(feature: DDBFeatureAction) {
    return feature.source === "class" ? "Class Feature" : feature.source === "feat" ? "Feat" : "Species Trait";
}

function toDetailItem(feature: DDBFeatureAction): DetailDrawerItem {
    return {
        type: "feature",
        id: feature.id,
        name: feature.name,
        category: getFeatureCategory(feature),
        activationType: feature.activationType,
        rangeText: feature.rangeText,
        description: feature.description,
        rawDescription: feature.rawDescription,
        limitedUse: feature.limitedUse,
    };
}

export function Bg3FeatureCard({ feature, index, usedCount, selected, onToggleFlyout, onOpenDetails }: Bg3FeatureCardProps) {
    const maxUses = feature.limitedUse?.max || 0;
    const flyoutKind = getFeatureFlyoutKind(feature);
    const isBonus = feature.activationType === "bonus";
    const isReaction = feature.activationType === "reaction";

    return (
        <ActionGridTile
            key={feature.id}
            name={feature.name}
            category={getFeatureCategory(feature)}
            subtitle={isBonus ? "Bonus Action" : isReaction ? "Reaction" : "Action"}
            details={[feature.rangeText || "Self", maxUses > 0 ? `${maxUses - usedCount}/${maxUses} uses` : "At will", feature.limitedUse?.resetType].filter(Boolean) as string[]}
            description={feature.description}
            icon={<GemAction expended={false} />}
            accent={isBonus ? "#d1a75e" : isReaction ? "#65b5d6" : "#62c982"}
            shortcut={index + 1}
            selected={selected}
            onActivate={() => flyoutKind ? onToggleFlyout(feature.id) : onOpenDetails(toDetailItem(feature))}
            onContextMenu={event => {
                event.preventDefault();
                onOpenDetails(toDetailItem(feature));
            }}
        />
    );
}
