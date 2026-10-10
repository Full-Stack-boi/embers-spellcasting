import type { Dispatch, SetStateAction } from "react";
import OBR from "@owlbear-rodeo/sdk";
import { extractBuffEffects } from "../../../services/descriptionParser";
import { KNOWN_BUFFS, toggleTokenBuff, type ActiveBuff } from "../../../services/buffService";
import type { DDBParsedCharacter } from "../../../types/ddb";
interface ActivatableFeature {
    id: string;
    name: string;
    activationType?: string;
    description?: string;
    snippet?: string;
    limitedUse?: { max?: number; used?: number };
}

interface UseFeatureActivationOptions {
    casterId?: string;
    character?: DDBParsedCharacter | null;
    featureUses: Record<string, number>;
    setFeatureUses: Dispatch<SetStateAction<Record<string, number>>>;
    setActiveBuffs: Dispatch<SetStateAction<ActiveBuff[]>>;
    setBonusActionUsed: Dispatch<SetStateAction<boolean>>;
    setActionUsed: Dispatch<SetStateAction<boolean>>;
    onFlurry: () => Promise<void>;
    onBonusStrike: () => Promise<void>;
}

export function useFeatureActivation({
    casterId,
    character,
    featureUses,
    setFeatureUses,
    setActiveBuffs,
    setBonusActionUsed,
    setActionUsed,
    onFlurry,
    onBonusStrike,
}: UseFeatureActivationOptions) {
    const handleActivateFeature = async (feat: ActivatableFeature) => {
        if (!casterId) {
            OBR.notification.show("No active token selected.", "WARNING");
            return;
        }

        const featLower = feat.name.toLowerCase();
        if (featLower.includes("flurry of blows")) {
            await onFlurry();
            return;
        }
        if (featLower.includes("bonus unarmed strike") || (featLower.includes("martial arts") && feat.activationType === "bonus")) {
            await onBonusStrike();
            return;
        }

        let buffData: Omit<ActiveBuff, "activatedAt"> | undefined;
        if (featLower.includes("innate sorcery")) {
            buffData = KNOWN_BUFFS.innate_sorcery;
        } else if (featLower.includes("rage")) {
            const barbClass = character?.classes?.find(c => c.name.toLowerCase().includes("barbarian"));
            const barbLevel = barbClass?.level ?? character?.level ?? 1;
            const rageBonus = barbLevel >= 16 ? 4 : barbLevel >= 9 ? 3 : 2;
            buffData = {
                ...KNOWN_BUFFS.rage,
                damageBonus: rageBonus,
                description: `Advantage on STR checks & saving throws, +${rageBonus} melee damage, resistance to physical damage.`,
            };
        } else if (featLower.includes("bladesong")) {
            buffData = KNOWN_BUFFS.bladesong;
        } else {
            const description = feat.description || feat.snippet || "";
            const parsedEffects = extractBuffEffects(description);
            buffData = {
                id: feat.id,
                name: feat.name,
                icon: "",
                source: feat.activationType ? feat.activationType.toUpperCase() : "Feature",
                durationText: "1 minute",
                description: description || "Active feature effect.",
                spellSaveDcBonus: parsedEffects.spellSaveDcBonus,
                spellAttackAdvantage: parsedEffects.spellAttackAdvantage,
                attackAdvantage: parsedEffects.attackAdvantage || (parsedEffects.advantage?.length ? true : undefined),
                damageBonus: parsedEffects.damageBonusFlat,
            };
        }

        const buffToApply: ActiveBuff = { ...buffData, activatedAt: Date.now() };
        const result = await toggleTokenBuff(casterId, buffToApply);
        setActiveBuffs(result.buffs);
        if (result.active) {
            const currentUsed = featureUses[feat.id] ?? (feat.limitedUse?.used ?? 0);
            const maxUses = feat.limitedUse?.max ?? 0;
            if (maxUses > 0 && currentUsed < maxUses) {
                setFeatureUses(prev => ({ ...prev, [feat.id]: currentUsed + 1 }));
            }
            if (feat.activationType === "bonus") setBonusActionUsed(true);
            else if (feat.activationType === "action") setActionUsed(true);
            OBR.notification.show(`Activated ${buffToApply.name}! ${buffToApply.description}`, "SUCCESS");
        } else {
            OBR.notification.show(`Deactivated ${buffToApply.name}`, "INFO");
        }
    };

    const handleToggleFeatureBox = (feature: { id: string; limitedUse?: { used?: number } }, boxIndex: number) => {
        const currentUsed = featureUses[feature.id] ?? (feature.limitedUse?.used ?? 0);
        const nextUsed = currentUsed < 0
            ? currentUsed + 1
            : (currentUsed === boxIndex + 1) ? boxIndex : boxIndex + 1;
        setFeatureUses(prev => ({ ...prev, [feature.id]: nextUsed }));
    };

    return { handleActivateFeature, handleToggleFeatureBox };
}
