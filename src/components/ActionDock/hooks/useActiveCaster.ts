import { useEffect, useState } from "react";
import OBR from "@owlbear-rodeo/sdk";
import { useOBR } from "../../../platform/obr/react/providers/BaseOBRProvider";
import { TOKEN_VISION_METADATA_KEY } from "../../../features/targeting/application/lineOfSightService";
import { resolveActiveCaster, type ActiveCasterInfo } from "../../../features/targeting/infrastructure/obr/activeCasterResolver";
import { getLinkedDDBCharacterId, getCachedDDBCharacter, fetchDDBCharacter } from "../../../services/ddbService";
import { getTokenBuffs } from "../../../services/buffService";
import type { ActiveBuff } from "../../../services/buffService";
import type { DDBParsedCharacter } from "../../../types/ddb";
import { toolMetadataSelectedSpell } from "../../../effectsTool";

export function useActiveCaster(applyDdbSlots: (character: DDBParsedCharacter) => void) {
    const obr = useOBR();
    const [caster, setCaster] = useState<ActiveCasterInfo | null>(null);
    const [selectedSpell, setSelectedSpell] = useState<string | null>(null);
    const [syncedDdbChar, setSyncedDdbChar] = useState<DDBParsedCharacter | null>(null);
    const [activeBuffs, setActiveBuffs] = useState<ActiveBuff[]>([]);

    useEffect(() => {
        if (!obr.ready || !obr.sceneReady || !obr.player?.role) return;

        const updateCaster = async () => {
            try {
                const role = obr.player!.role;
                const id = obr.player!.id;
                const active = await resolveActiveCaster(role, id);
                setCaster(active);

                if (active?.item) {
                    setActiveBuffs(getTokenBuffs(active.item));
                    const characterId = getLinkedDDBCharacterId(active.item);
                    if (characterId) {
                        const applyCharacter = (character: DDBParsedCharacter) => {
                            setSyncedDdbChar(character);
                            applyDdbSlots(character);
                            if (character.senses) {
                                const currentVision = active.item!.metadata[TOKEN_VISION_METADATA_KEY] as unknown;
                                if (!currentVision || JSON.stringify(currentVision) !== JSON.stringify(character.senses)) {
                                    OBR.scene.items.updateItems([active.item!.id], items => {
                                        for (const item of items) item.metadata[TOKEN_VISION_METADATA_KEY] = character.senses;
                                    }).catch(console.error);
                                }
                            }
                        };
                        const cached = getCachedDDBCharacter(characterId);
                        if (cached) applyCharacter(cached);
                        else fetchDDBCharacter(characterId).then(applyCharacter).catch(console.error);
                    } else {
                        setSyncedDdbChar(null);
                    }
                } else {
                    setActiveBuffs([]);
                    setSyncedDdbChar(null);
                }

                const metadata = obr.player!.metadata;
                const currentSelected = metadata?.[toolMetadataSelectedSpell] as string | undefined;
                setSelectedSpell(currentSelected || null);
            } catch (error) {
                console.error("ActionDock update error:", error);
            }
        };

        updateCaster();
    }, [obr.ready, obr.sceneReady, obr.player, applyDdbSlots]);

    useEffect(() => {
        if (!obr.ready || !obr.sceneReady) return;
        return OBR.scene.items.onChange(items => {
            if (!caster?.id) return;
            const updatedItem = items.find(item => item.id === caster.id);
            if (!updatedItem) return;
            setCaster(previous => previous ? { ...previous, item: updatedItem } : previous);
            setActiveBuffs(getTokenBuffs(updatedItem));
            const characterId = getLinkedDDBCharacterId(updatedItem);
            if (characterId) {
                const cached = getCachedDDBCharacter(characterId);
                if (cached && cached.id !== syncedDdbChar?.id) {
                    setSyncedDdbChar(cached);
                    applyDdbSlots(cached);
                }
            } else if (syncedDdbChar) {
                setSyncedDdbChar(null);
            }
        });
    }, [obr.ready, obr.sceneReady, caster?.id, syncedDdbChar, applyDdbSlots]);

    return {
        caster,
        selectedSpell,
        syncedDdbChar,
        activeBuffs,
        setSelectedSpell,
        setSyncedDdbChar,
        setActiveBuffs,
    };
}
