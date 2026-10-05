import OBR from "@owlbear-rodeo/sdk";
import { APP_KEY } from "../config";
import { DDBRollCardData, DDBRollLogPayload } from "../types/ddbRollLog";

export const DDB_ROLL_CHANNEL = `${APP_KEY}/roll-log`;
export const ddbRollLogPopoverId = `${APP_KEY}/ddb-roll-log`;
const ROLL_HISTORY_KEY = `${APP_KEY}/roll-history`;

export function getStoredRollHistory(): DDBRollCardData[] {
    try {
        const raw = localStorage.getItem(ROLL_HISTORY_KEY);
        if (!raw) return [];
        return JSON.parse(raw) as DDBRollCardData[];
    } catch {
        return [];
    }
}

export function saveStoredRollHistory(cards: DDBRollCardData[]): void {
    try {
        const existing = getStoredRollHistory();
        const merged = [...cards, ...existing].slice(0, 30);
        localStorage.setItem(ROLL_HISTORY_KEY, JSON.stringify(merged));
    } catch {
        // Ignore storage errors
    }
}

const POPOVER_STATE_KEY = `${APP_KEY}/popover-open`;
let isRollLogOpen = false;

// Initialize cross-context broadcast channel for popover state sync
let stateChannel: BroadcastChannel | null = null;
try {
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        stateChannel = new BroadcastChannel("ddb_roll_log_state");
        stateChannel.onmessage = (e) => {
            if (e.data && typeof e.data.open === "boolean") {
                isRollLogOpen = e.data.open;
            }
        };
    }
} catch {
    // Ignore channel creation errors in unsupported environments
}

if (typeof window !== "undefined") {
    window.addEventListener("storage", (e) => {
        if (e.key === POPOVER_STATE_KEY) {
            isRollLogOpen = e.newValue === "1";
        }
    });
}

export function setPopoverOpenState(open: boolean): void {
    isRollLogOpen = open;
    try {
        if (typeof localStorage !== "undefined") {
            localStorage.setItem(POPOVER_STATE_KEY, open ? "1" : "0");
        }
        stateChannel?.postMessage({ open });
    } catch {
        // Ignore storage / channel errors
    }
}

export function isPopoverCurrentlyOpen(): boolean {
    if (isRollLogOpen) return true;
    try {
        if (typeof localStorage !== "undefined") {
            return localStorage.getItem(POPOVER_STATE_KEY) === "1";
        }
    } catch {
        
    }
    return false;
}

type RollListener = (cards: DDBRollCardData[]) => void;
const localRollListeners = new Set<RollListener>();

export function subscribeToDDBRolls(listener: RollListener): () => void {
    localRollListeners.add(listener);
    return () => localRollListeners.delete(listener);
}

export function clearStoredRollHistory(): void {
    try {
        localStorage.removeItem(ROLL_HISTORY_KEY);
    } catch {
        // Ignore
    }
}

let cachedViewWidth = typeof window !== "undefined" ? window.innerWidth || 1440 : 1440;
let cachedViewHeight = typeof window !== "undefined" ? window.innerHeight || 900 : 900;

if (typeof window !== "undefined") {
    OBR.onReady(() => {
        Promise.all([OBR.viewport.getWidth(), OBR.viewport.getHeight()]).then(([w, h]) => {
            if (w && w > 200) cachedViewWidth = w;
            if (h && h > 200) cachedViewHeight = h;
        }).catch(() => {});
    });
}

export async function openDDBRollLogPopover(mode: "manual" | "auto" = "manual"): Promise<void> {
    try {
        // Non-blocking background refresh of viewport dimensions
        OBR.viewport.getWidth().then(w => { if (w && w > 200) cachedViewWidth = w; }).catch(() => {});
        OBR.viewport.getHeight().then(h => { if (h && h > 200) cachedViewHeight = h; }).catch(() => {});

        const viewWidth = cachedViewWidth;
        const viewHeight = cachedViewHeight;

        const popoverWidth = 360;
        const popoverHeight = Math.min(500, Math.max(280, Math.round(viewHeight * 0.55)));
        // Offset 88px from right edge to completely avoid Owlbear Rodeo's vertical tool rail (~64px-72px)
        const rightMargin = 88;
        const popoverRight = Math.max(16, viewWidth - popoverWidth - rightMargin);
        const popoverTop = Math.max(48, Math.round((viewHeight - popoverHeight) / 2) - 40);

        const search = typeof window !== "undefined" ? window.location.search || "" : "";
        const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost";
        const modeParam = `mode=${mode}`;
        const sep = search.includes("?") ? "&" : "?";
        const popoverUrl = `${origin}/ddb-roll-log${search}${sep}${modeParam}`;

        await OBR.popover.open({
            id: ddbRollLogPopoverId,
            url: popoverUrl,
            width: popoverWidth,
            height: popoverHeight,
            anchorReference: "POSITION",
            anchorPosition: {
                left: popoverRight,
                top: popoverTop,
            },
            anchorOrigin: {
                horizontal: "LEFT",
                vertical: "TOP",
            },
            transformOrigin: {
                horizontal: "LEFT",
                vertical: "TOP",
            },
            hidePaper: true,
            disableClickAway: true,
        });
        setPopoverOpenState(true);
    } catch (e) {
        console.error("Failed to open DDB Roll Log Popover", e);
    }
}

export async function closeDDBRollLogPopover(): Promise<void> {
    setPopoverOpenState(false);
    try {
        await OBR.popover.close(ddbRollLogPopoverId);
    } catch {
        // Ignore if already closed
    }
}

export async function toggleDDBRollLogPopover(): Promise<void> {
    if (isPopoverCurrentlyOpen()) {
        await closeDDBRollLogPopover();
        return;
    }
    await openDDBRollLogPopover("manual");
}

export async function broadcastDDBRoll(cards: DDBRollCardData[]): Promise<void> {
    if (!cards || cards.length === 0) return;

    saveStoredRollHistory(cards);

    // Notify local listeners immediately
    localRollListeners.forEach(fn => {
        try {
            fn(cards);
        } catch (err) {
            console.error("Error in local roll listener:", err);
        }
    });

    if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("embers:ddb-roll", { detail: cards }));
    }

    const payload: DDBRollLogPayload = {
        cards,
        senderId: await OBR.player.getId().catch(() => undefined),
    };

    try {
        await OBR.broadcast.sendMessage(DDB_ROLL_CHANNEL, payload, { destination: "ALL" });
    } catch {
        // Fallback if broadcast fails
    }

    // Open popover automatically when a roll is dispatched
    await openDDBRollLogPopover("auto");
}
