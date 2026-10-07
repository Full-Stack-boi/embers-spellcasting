import { useMemo, type Dispatch, type SetStateAction } from "react";
import OBR from "@owlbear-rodeo/sdk";
import { computeClassFeatureResource, getFeatureFlyoutKind } from "../../../assets/manual-formulas/index";
import type { DDBFeatureAction, DDBParsedCharacter } from "../../../types/ddb";
import type { BG3FlyoutFeatureData } from "../overlays/BG3FlyoutBar";
import type { SpellSlotConfig } from "../domain/types";

interface UseFeatureFlyoutDataOptions {
    featureId: string | null;
    features: DDBFeatureAction[];
    character: DDBParsedCharacter | null;
    featureUses: Record<string, number>;
    spellSlots: Record<number, SpellSlotConfig>;
    pactSlots: SpellSlotConfig;
    setFeatureUses: Dispatch<SetStateAction<Record<string, number>>>;
    setSpellSlots: Dispatch<SetStateAction<Record<number, SpellSlotConfig>>>;
    setActionUsed: Dispatch<SetStateAction<boolean>>;
    setBonusActionUsed: Dispatch<SetStateAction<boolean>>;
    onConvertSlot: (slotLevel: number, usePact: boolean, targetFeatureId?: string) => void;
    onCreateSpellSlot: (slotLevel: number, cost: number, minLevel: number, targetFeatureId?: string) => void;
}

export function useFeatureFlyoutData({
    featureId,
    features,
    character,
    featureUses,
    spellSlots,
    pactSlots,
    setFeatureUses,
    setSpellSlots,
    setActionUsed,
    setBonusActionUsed,
    onConvertSlot,
    onCreateSpellSlot,
}: UseFeatureFlyoutDataOptions) {
    const feature = useMemo(() => {
        if (!featureId) return null;
        return features.find(item => item.id === featureId) || null;
    }, [featureId, features]);

    const featureData = useMemo<BG3FlyoutFeatureData | null>(() => {
        if (!feature) return null;
        const kind = getFeatureFlyoutKind(feature);
        if (!kind) return null;

        const levelOf = (className: string) => character?.classes
            .filter(classInfo => classInfo.name.toLowerCase().includes(className))
            .reduce((sum, classInfo) => sum + classInfo.level, 0) || 0;
        const sorcererLevel = levelOf("sorcerer");
        const paladinLevel = levelOf("paladin");
        const wizardLevel = levelOf("wizard");
        const proficiencyBonus = character?.proficiencyBonus || 2;
        const used = featureUses[feature.id] ?? (feature.limitedUse?.used || 0);
        const resource = computeClassFeatureResource({ kind, character, feature, featureUses });
        const pact = character?.pactMagic ? {
            max: pactSlots.max,
            used: pactSlots.used,
            level: character.pactMagic.level,
        } : undefined;

        if (kind === "metamagic") {
            const fontFeature = features.find(item => item.name.toLowerCase().includes("font of magic"));
            if (fontFeature) {
                const fontUsed = featureUses[fontFeature.id] ?? (fontFeature.limitedUse?.used || 0);
                const fontMax = fontFeature.limitedUse?.max || sorcererLevel;
                return {
                    id: feature.id,
                    name: feature.name,
                    kind,
                    resourceName: "Sorcery Points",
                    availablePoints: Math.max(0, fontMax - fontUsed),
                    maxPoints: fontMax,
                    sorcererLevel,
                    spellSlots,
                    pactSlots: pact,
                    onSpendResourceAction: (actionName, cost, details, actionType) => {
                        setFeatureUses(previous => ({ ...previous, [fontFeature.id]: fontUsed + cost }));
                        if (actionType === "bonus") setBonusActionUsed(true);
                        else if (actionType === "action") setActionUsed(true);
                        OBR.notification.show(`Used ${actionName} (${cost} SP). ${details || ""}`, "SUCCESS");
                    },
                };
            }
        }

        return {
            id: feature.id,
            name: feature.name,
            kind,
            resourceName: resource.resourceName,
            availablePoints: resource.availablePoints,
            maxPoints: resource.maxPoints,
            sorcererLevel,
            paladinLevel,
            wizardLevel,
            proficiencyBonus,
            spellSlots,
            pactSlots: pact,
            onConvertSlotToResource: (slotLevel, isPact) => onConvertSlot(slotLevel, Boolean(isPact), feature.id),
            onCreateSpellSlot: (slotLevel, cost, minLevel) => onCreateSpellSlot(slotLevel, cost, minLevel, feature.id),
            onRegainExpendedSlot: slotLevel => {
                setSpellSlots(previous => {
                    const slot = previous[slotLevel];
                    if (!slot || slot.used <= 0) return previous;
                    return { ...previous, [slotLevel]: { ...slot, used: slot.used - 1 } };
                });
                setFeatureUses(previous => ({ ...previous, [feature.id]: used + 1 }));
                OBR.notification.show(`Regained a level ${slotLevel} spell slot using ${feature.name}.`, "SUCCESS");
            },
            onSpendResourceAction: (actionName, cost, details, actionType) => {
                setFeatureUses(previous => ({ ...previous, [feature.id]: used + cost }));
                if (actionType === "bonus") setBonusActionUsed(true);
                else if (actionType === "action") setActionUsed(true);
                OBR.notification.show(`Activated ${actionName} (spent ${cost} ${resource.resourceName}). ${details || ""}`, "SUCCESS");
            },
        };
    }, [feature, features, character, featureUses, spellSlots, pactSlots, setFeatureUses, setSpellSlots, setActionUsed, setBonusActionUsed, onConvertSlot, onCreateSpellSlot]);

    return featureData;
}
