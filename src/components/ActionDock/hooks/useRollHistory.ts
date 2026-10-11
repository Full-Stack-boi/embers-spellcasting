import { useEffect, useState } from "react";
import OBR from "@owlbear-rodeo/sdk";

import {
    DDB_ROLL_CHANNEL,
    ROLL_HISTORY_KEY,
    getStoredRollHistory,
    saveStoredRollHistory,
    subscribeToDDBRolls
} from "../../../services/rollLogService";
import type { DDBRollCardData, DDBRollLogPayload } from "../../../types/ddbRollLog";

export function useRollHistory(isObrReady: boolean) {
    const [rollHistory, setRollHistory] = useState<DDBRollCardData[]>(() => getStoredRollHistory().slice(0, 30));
    const [unreadRolls, setUnreadRolls] = useState<number>(0);

    useEffect(() => {
        if (!isObrReady) return;

        const handleNewCards = (newCards: DDBRollCardData[]) => {
            if (!newCards || newCards.length === 0) return;
            setRollHistory(prev => {
                const existingIds = new Set(prev.map(c => c.id));
                const unique = newCards.filter(c => !existingIds.has(c.id));
                if (unique.length === 0) return prev;
                setUnreadRolls(prevUnread => prevUnread + unique.length);
                return [...unique, ...prev].slice(0, 40);
            });
        };

        const unsubscribeLocal = subscribeToDDBRolls(handleNewCards);
        let unsubscribeBroadcast: (() => void) | null = null;
        try {
            unsubscribeBroadcast = OBR.broadcast.onMessage(DDB_ROLL_CHANNEL, (event) => {
                const payload = event.data as DDBRollLogPayload;
                if (payload && Array.isArray(payload.cards) && payload.cards.length > 0) {
                    saveStoredRollHistory(payload.cards);
                    handleNewCards(payload.cards);
                }
            });
        } catch (err) {
            console.warn("Failed to listen to roll broadcast in ActionDock:", err);
        }

        const handleWindowEvent = (e: Event) => {
            const custom = e as CustomEvent<DDBRollCardData[]>;
            if (custom.detail && Array.isArray(custom.detail)) {
                handleNewCards(custom.detail);
            }
        };
        window.addEventListener("embers:ddb-roll", handleWindowEvent);

        const handleStorageEvent = (e: StorageEvent) => {
            if (e.key === ROLL_HISTORY_KEY && e.newValue) {
                try {
                    const parsed = JSON.parse(e.newValue) as DDBRollCardData[];
                    if (Array.isArray(parsed)) {
                        setRollHistory(parsed.slice(0, 40));
                    }
                } catch {
                    // Ignore
                }
            }
        };
        window.addEventListener("storage", handleStorageEvent);

        return () => {
            unsubscribeLocal();
            unsubscribeBroadcast?.();
            window.removeEventListener("embers:ddb-roll", handleWindowEvent);
            window.removeEventListener("storage", handleStorageEvent);
        };
    }, [isObrReady]);

    return {
        rollHistory,
        setRollHistory,
        unreadRolls,
        setUnreadRolls,
    };
}
