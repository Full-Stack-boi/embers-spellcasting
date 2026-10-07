import { useEffect, useState } from "react";
import OBR from "@owlbear-rodeo/sdk";

import {
    DDB_ROLL_CHANNEL,
    getStoredRollHistory,
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
            setRollHistory(prev => [...newCards, ...prev].slice(0, 40));
            setUnreadRolls(prev => prev + newCards.length);
        };

        const unsubscribeLocal = subscribeToDDBRolls(handleNewCards);
        let unsubscribeBroadcast: (() => void) | null = null;
        try {
            unsubscribeBroadcast = OBR.broadcast.onMessage(DDB_ROLL_CHANNEL, (event) => {
                const payload = event.data as DDBRollLogPayload;
                if (payload && Array.isArray(payload.cards) && payload.cards.length > 0) {
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

        return () => {
            unsubscribeLocal();
            unsubscribeBroadcast?.();
            window.removeEventListener("embers:ddb-roll", handleWindowEvent);
        };
    }, [isObrReady]);

    return {
        rollHistory,
        setRollHistory,
        unreadRolls,
        setUnreadRolls,
    };
}
