import { useState } from "react";
import type { MouseEvent } from "react";
import OBR from "@owlbear-rodeo/sdk";
import {
    actionDockPopoverId,
    DOCK_SAVED_HEIGHT_KEY,
    getSavedDockHeight,
    RESOURCE_TRAY_FLOAT_HEIGHT,
} from "../domain/popover";

export function useDockSizing() {
    const [panelHeight, setPanelHeight] = useState<number | null>(() => {
        const savedHeight = getSavedDockHeight();
        if (savedHeight) return savedHeight;
        const requestedHeight = Number(new URLSearchParams(window.location.search).get("dockHeight"));
        return Number.isFinite(requestedHeight) && requestedHeight >= 200 && requestedHeight <= 900
            ? requestedHeight
            : null;
    });
    const [isDraggingHeight, setIsDraggingHeight] = useState(false);

    const handleResizeStart = (event: MouseEvent) => {
        const container = document.querySelector(".ddb-action-sheet-container") as HTMLElement | null;
        const startHeight = container ? container.offsetHeight : (window.innerHeight || 400);
        const startY = event.clientY;
        setIsDraggingHeight(true);

        const onMouseMove = (moveEvent: globalThis.MouseEvent) => {
            const delta = startY - moveEvent.clientY;
            const maxAllowed = Math.max(220, (window.innerHeight || 800) - RESOURCE_TRAY_FLOAT_HEIGHT - 20);
            const nextHeight = Math.max(220, Math.min(maxAllowed, startHeight + delta));
            setPanelHeight(nextHeight);
            try {
                localStorage.setItem(DOCK_SAVED_HEIGHT_KEY, String(nextHeight));
            } catch {}
            if (OBR?.popover && typeof OBR.popover.setHeight === "function") {
                OBR.popover.setHeight(actionDockPopoverId, nextHeight + RESOURCE_TRAY_FLOAT_HEIGHT).catch(() => {});
            }
        };

        const onMouseUp = () => {
            setIsDraggingHeight(false);
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        };

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
        event.preventDefault();
    };

    const handleToggleExpandHeight = () => {
        const maxHeight = Math.min(520, Math.max(380, Math.round(((window.innerHeight || 800) - RESOURCE_TRAY_FLOAT_HEIGHT) * 0.55)));
        setPanelHeight(previousHeight => {
            const nextHeight = previousHeight && previousHeight > 350 ? 260 : maxHeight;
            try {
                localStorage.setItem(DOCK_SAVED_HEIGHT_KEY, String(nextHeight));
            } catch {}
            if (OBR?.popover && typeof OBR.popover.setHeight === "function") {
                OBR.popover.setHeight(actionDockPopoverId, nextHeight + RESOURCE_TRAY_FLOAT_HEIGHT).catch(() => {});
            }
            return nextHeight;
        });
    };

    return { panelHeight, isDraggingHeight, handleResizeStart, handleToggleExpandHeight };
}
