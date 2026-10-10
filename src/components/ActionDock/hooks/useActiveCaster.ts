import { useEffect, useState, useCallback } from "react";
import OBR from "@owlbear-rodeo/sdk";
import { useOBR } from "../../../platform/obr/react/providers/BaseOBRProvider";
import { TOKEN_VISION_METADATA_KEY } from "../../../features/targeting/application/lineOfSightService";
import { resolveActiveCaster, type ActiveCasterInfo } from "../../../features/targeting/infrastructure/obr/activeCasterResolver";
import { getLinkedDDBCharacterId, getCachedDDBCharacter, fetchDDBCharacter, cacheDDBCharacter } from "../../../services/ddbService";
import { getTokenBuffs } from "../../../services/buffService";
import type { ActiveBuff } from "../../../services/buffService";
import type { DDBParsedCharacter } from "../../../types/ddb";
import { toolMetadataSelectedSpell } from "../../../effectsTool";

const inFlightSyncs = new Map<number, Promise<DDBParsedCharacter | null>>();
const lastSyncTimestamps = new Map<number, number>();
const SYNC_THROTTLE_MS = 10000;

export function useActiveCaster(applyDdbSlots: (character: DDBParsedCharacter) => void) {
    const obr = useOBR();
    const [caster, setCaster] = useState<ActiveCasterInfo | null>(null);
    const [selectedSpell, setSelectedSpell] = useState<string | null>(null);
    const [syncedDdbChar, setSyncedDdbChar] = useState<DDBParsedCharacter | null>(null);
    const [activeBuffs, setActiveBuffs] = useState<ActiveBuff[]>([]);
    const [isSyncing, setIsSyncing] = useState<boolean>(false);

    const syncCharacter = useCallback(async (characterId: number, force = false): Promise<DDBParsedCharacter | null> => {
        const now = Date.now();
        const lastTime = lastSyncTimestamps.get(characterId) || 0;
        if (!force && now - lastTime < SYNC_THROTTLE_MS) {
            return null;
        }

        const existingPromise = inFlightSyncs.get(characterId);
        if (existingPromise) {
            return existingPromise;
        }

        setIsSyncing(true);
        const syncPromise = (async () => {
            try {
                const fresh = await fetchDDBCharacter(characterId);
                if (fresh) {
                    lastSyncTimestamps.set(characterId, Date.now());
                    cacheDDBCharacter(fresh);
                    return fresh;
                }
                return null;
            } catch (err) {
                console.warn(`[Embers] Background character sync failed for ID ${characterId}:`, err);
                return null;
            } finally {
                inFlightSyncs.delete(characterId);
                setIsSyncing(false);
            }
        })();

        inFlightSyncs.set(characterId, syncPromise);
        return syncPromise;
    }, []);

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
                        if (cached) {
                            applyCharacter(cached);
                        } else {
                            fetchDDBCharacter(characterId).then(fresh => {
                                if (fresh) {
                                    cacheDDBCharacter(fresh);
                                    applyCharacter(fresh);
                                }
                            }).catch(console.error);
                        }
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
        if (!obr.ready || !obr.sceneReady || !caster?.item) return;
        const characterId = getLinkedDDBCharacterId(caster.item);
        if (!characterId) return;

        let cancelled = false;
        syncCharacter(characterId, false).then(fresh => {
            if (cancelled || !fresh) return;
            if (caster?.item && getLinkedDDBCharacterId(caster.item) === characterId) {
                setSyncedDdbChar(fresh);
                applyDdbSlots(fresh);
            }
        }).catch(() => {});

        return () => {
            cancelled = true;
        };
    }, [obr.ready, obr.sceneReady, caster?.id, syncCharacter, applyDdbSlots]);

    const resyncCharacter = useCallback(async (force = true) => {
        if (!caster?.item) return;
        const characterId = getLinkedDDBCharacterId(caster.item);
        if (!characterId) return;
        try {
            const fresh = await syncCharacter(characterId, force);
            if (fresh) {
                setSyncedDdbChar(fresh);
                applyDdbSlots(fresh);
                OBR.notification.show(`${fresh.name} re-synced from D&D Beyond.`, "SUCCESS");
            }
        } catch {
            OBR.notification.show("Failed to re-sync character from D&D Beyond.", "WARNING");
        }
    }, [caster?.item, syncCharacter, applyDdbSlots]);

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
        isSyncing,
        resyncCharacter,
        setSelectedSpell,
        setSyncedDdbChar,
        setActiveBuffs,
    };
}
