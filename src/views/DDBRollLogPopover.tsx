import React, { useEffect, useState, useRef, useCallback } from "react";
import OBR from "@owlbear-rodeo/sdk";
import "./DDBRollLogPopover.css";
import { DDBRollCardData, DDBRollLogPayload } from "../types/ddbRollLog";
import { DDBRollCard } from "../components/DDBRollLog/DDBRollCard";
import {
    DDB_ROLL_CHANNEL,
    closeDDBRollLogPopover,
    setPopoverOpenState,
    getStoredRollHistory,
    clearStoredRollHistory,
    subscribeToDDBRolls,
} from "../services/rollLogService";

export const DDBRollLogPopover: React.FC = () => {
    const [cards, setCards] = useState<DDBRollCardData[]>(() => getStoredRollHistory().slice(0, 15));
    const [isHovered, setIsHovered] = useState(false);
    const dismissTimerRef = useRef<number | null>(null);

    const isManual = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("mode") === "manual";

    const resetAutoDismissTimer = useCallback(() => {
        if (dismissTimerRef.current) {
            window.clearTimeout(dismissTimerRef.current);
            dismissTimerRef.current = null;
        }
        // Only auto dismiss after 12s if NOT manual mode, not hovered, and has cards
        if (!isManual && !isHovered && cards.length > 0) {
            dismissTimerRef.current = window.setTimeout(() => {
                closeDDBRollLogPopover();
            }, 12000);
        }
    }, [isManual, isHovered, cards.length]);

    useEffect(() => {
        resetAutoDismissTimer();
        return () => {
            if (dismissTimerRef.current) {
                window.clearTimeout(dismissTimerRef.current);
            }
        };
    }, [cards, resetAutoDismissTimer]);

    useEffect(() => {
        setPopoverOpenState(true);
        const handleUnload = () => {
            setPopoverOpenState(false);
        };
        window.addEventListener("beforeunload", handleUnload);

        let unsubscribeBroadcast: (() => void) | null = null;
        let isMounted = true;

        OBR.onReady(() => {
            if (!isMounted) return;
            try {
                unsubscribeBroadcast = OBR.broadcast.onMessage(DDB_ROLL_CHANNEL, (event) => {
                    const payload = event.data as DDBRollLogPayload;
                    if (payload && Array.isArray(payload.cards) && payload.cards.length > 0) {
                        setCards(prev => [...payload.cards, ...prev].slice(0, 20));
                    }
                });
            } catch (err) {
                console.warn("Failed to subscribe in DDBRollLogPopover:", err);
            }
        });

        // 2. In-memory local listener
        const unsubscribeLocal = subscribeToDDBRolls((newCards) => {
            setCards(prev => [...newCards, ...prev].slice(0, 20));
        });

        // 3. Custom window event listener
        const handleWindowEvent = (e: Event) => {
            const custom = e as CustomEvent<DDBRollCardData[]>;
            if (custom.detail && Array.isArray(custom.detail)) {
                setCards(prev => [...custom.detail, ...prev].slice(0, 20));
            }
        };
        window.addEventListener("embers:ddb-roll", handleWindowEvent);

        return () => {
            isMounted = false;
            setPopoverOpenState(false);
            window.removeEventListener("beforeunload", handleUnload);
            unsubscribeBroadcast?.();
            unsubscribeLocal();
            window.removeEventListener("embers:ddb-roll", handleWindowEvent);
        };
    }, []);

    const handleClear = () => {
        setCards([]);
        clearStoredRollHistory();
    };

    return (
        <div
            className="ddb-roll-popover-container"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="ddb-roll-popover-header">
                <div className="ddb-roll-popover-title">
                    <span>GAME LOG</span>
                </div>
                <div className="ddb-roll-popover-controls">
                    {cards.length > 0 && (
                        <button
                            type="button"
                            className="ddb-roll-popover-btn"
                            onClick={handleClear}
                            title="Clear Log"
                        >
                            Clear
                        </button>
                    )}
                    <button
                        type="button"
                        className="ddb-roll-popover-btn"
                        onClick={() => closeDDBRollLogPopover()}
                        title="Close"
                    >
                        ✕
                    </button>
                </div>
            </div>

            <div className="ddb-roll-popover-list">
                {cards.length === 0 ? (
                    <div className="ddb-roll-empty">No recent rolls</div>
                ) : (
                    cards.map(card => (
                        <DDBRollCard key={card.id} data={card} />
                    ))
                )}
            </div>
        </div>
    );
};

export default DDBRollLogPopover;
