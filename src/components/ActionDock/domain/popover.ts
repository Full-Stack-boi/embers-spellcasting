import OBR from "@owlbear-rodeo/sdk";

import { APP_KEY } from "../../../config";

export const actionDockPopoverId = `${APP_KEY}/action-dock-popover`;
export const DOCK_SAVED_HEIGHT_KEY = "embers:action-dock-height";
export const RESOURCE_TRAY_FLOAT_HEIGHT = 40;

let cachedDockViewWidth = typeof window !== "undefined" ? window.innerWidth || 1440 : 1440;
let cachedDockViewHeight = typeof window !== "undefined" ? window.innerHeight || 900 : 900;

if (typeof window !== "undefined") {
    OBR.onReady(() => {
        Promise.all([OBR.viewport.getWidth(), OBR.viewport.getHeight()]).then(([w, h]) => {
            if (w && w > 200) cachedDockViewWidth = w;
            if (h && h > 200) cachedDockViewHeight = h;
        }).catch(() => {});
    });
}

export function getSavedDockHeight(): number | null {
    try {
        const val = localStorage.getItem(DOCK_SAVED_HEIGHT_KEY);
        if (val) {
            const parsed = parseInt(val, 10);
            if (!isNaN(parsed) && parsed >= 200 && parsed <= 900) {
                return parsed;
            }
        }
    } catch {}
    return null;
}

export async function closeActionDock() {
    try {
        await OBR.popover.close(actionDockPopoverId);
    } catch {}
}

let lastToggleTime = 0;
let isToggling = false;

export async function openActionDock() {
    if (isToggling) return;
    isToggling = true;
    try {
        const [w, h] = await Promise.all([
            OBR.viewport.getWidth(),
            OBR.viewport.getHeight()
        ]);
        if (w && w > 200) cachedDockViewWidth = w;
        if (h && h > 200) cachedDockViewHeight = h;
    } catch {}

    const viewWidth = cachedDockViewWidth;
    const viewHeight = cachedDockViewHeight;

    const extraLeftGutter = 60;
    const dockWidth = Math.min(1480, Math.max(760, viewWidth - 140));

    const savedH = getSavedDockHeight();
    const defaultDockHeight = Math.min(280, Math.max(220, Math.round(viewHeight * 0.28)));
    const dockHeight = savedH ?? defaultDockHeight;
    const popoverHeight = dockHeight + RESOURCE_TRAY_FLOAT_HEIGHT;

    const dockLeft = Math.max(70, Math.round((viewWidth - dockWidth) / 2));
    const popoverLeft = Math.max(0, dockLeft - extraLeftGutter);
    const popoverWidth = dockWidth + extraLeftGutter;
    const popoverTop = Math.max(10, Math.round(viewHeight - popoverHeight - 16));

    const dockSearch = new URLSearchParams(window.location.search || "");
    dockSearch.set("dockHeight", String(dockHeight));
    try {
        try {
            await OBR.popover.close(actionDockPopoverId);
        } catch {}

        await OBR.popover.open({
            id: actionDockPopoverId,
            url: `${window.location.origin}/action-dock?${dockSearch.toString()}`,
            width: popoverWidth,
            height: popoverHeight,
            anchorReference: "POSITION",
            anchorPosition: {
                left: popoverLeft,
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
    } catch (err) {
        console.error("Failed to open ActionDock popover:", err);
    } finally {
        setTimeout(() => {
            isToggling = false;
        }, 350);
    }
}

export async function toggleActionDock() {
    const now = Date.now();
    if (now - lastToggleTime < 400 || isToggling) {
        return;
    }
    lastToggleTime = now;

    try {
        const height = await OBR.popover.getHeight(actionDockPopoverId);
        if (typeof height === "number" && height > 0) {
            await closeActionDock();
            return;
        }
    } catch {}
    await openActionDock();
}
