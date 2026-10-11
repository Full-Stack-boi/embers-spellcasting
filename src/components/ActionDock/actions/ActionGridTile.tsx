import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export type ActionGridTileProps = {
    name: string;
    category: string;
    subtitle: string;
    description?: string;
    details?: string[];
    icon: React.ReactNode;
    accent: string;
    shortcut: number;
    selected?: boolean;
    disabled?: boolean;
    handBadge?: {
        type: "main" | "offhand";
        label: string;
        onClick?: () => void;
    };
    actionBadge?: {
        label: string;
        title?: string;
        onClick?: () => void;
        className?: string;
    };
    badgeText?: string;
    badgeClass?: string;
    onActivate: () => void;
    onContextMenu?: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

type ActionGridTooltipData = Pick<ActionGridTileProps, "name" | "category" | "subtitle" | "description" | "details" | "icon" | "accent">;
type ActionGridTooltipState = ActionGridTooltipData & { id: string; left: number; top: number };
type ActionGridTooltipContextValue = {
    activeId: string | null;
    showTooltip: (id: string, event: React.MouseEvent<HTMLButtonElement> | React.FocusEvent<HTMLButtonElement>, data: ActionGridTooltipData) => void;
    scheduleTooltipClose: () => void;
    keepTooltipOpen: () => void;
    hideTooltip: () => void;
};

const ActionGridTooltipContext = React.createContext<ActionGridTooltipContextValue | null>(null);

export const ActionGridTooltipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [tooltip, setTooltip] = useState<ActionGridTooltipState | null>(null);
    const hideTimer = useRef<number | undefined>(undefined);

    const keepTooltipOpen = () => {
        if (hideTimer.current !== undefined) {
            window.clearTimeout(hideTimer.current);
            hideTimer.current = undefined;
        }
    };

    const showTooltip: ActionGridTooltipContextValue["showTooltip"] = (id, event, data) => {
        keepTooltipOpen();
        const rect = event.currentTarget.getBoundingClientRect();
        const width = Math.min(270, window.innerWidth - 16);
        const estimatedHeight = Math.min(185, window.innerHeight - 16);
        const centeredLeft = Math.max(8, Math.min(rect.left + rect.width / 2 - width / 2, window.innerWidth - width - 8));
        const aboveTop = rect.top - estimatedHeight - 10;
        if (aboveTop >= 8) {
            setTooltip({ ...data, id, left: centeredLeft, top: aboveTop });
            return;
        }

        const gap = 9;
        const rightSpace = window.innerWidth - rect.right - gap;
        const leftSpace = rect.left - gap;
        const placeRight = rightSpace >= width || rightSpace >= leftSpace;
        const left = placeRight
            ? Math.max(8, Math.min(rect.right + gap, window.innerWidth - width - 8))
            : Math.max(8, rect.left - width - gap);
        const top = Math.max(8, Math.min(rect.top + rect.height / 2 - estimatedHeight / 2, window.innerHeight - estimatedHeight - 8));
        setTooltip({ ...data, id, left, top });
    };

    const hideTooltip = () => {
        keepTooltipOpen();
        setTooltip(null);
    };

    const scheduleTooltipClose = () => {
        keepTooltipOpen();
        hideTimer.current = window.setTimeout(() => {
            setTooltip(null);
            hideTimer.current = undefined;
        }, 240);
    };

    useEffect(() => () => keepTooltipOpen(), []);

    const contextValue: ActionGridTooltipContextValue = {
        activeId: tooltip?.id ?? null,
        showTooltip,
        scheduleTooltipClose,
        keepTooltipOpen,
        hideTooltip,
    };

    return (
        <ActionGridTooltipContext.Provider value={contextValue}>
            {children}
            {tooltip && createPortal(
                <div
                    id={tooltip.id}
                    className="ddb-bg3-grid-tooltip"
                    role="tooltip"
                    style={{ left: tooltip.left, top: tooltip.top }}
                    onMouseEnter={keepTooltipOpen}
                    onMouseLeave={hideTooltip}
                >
                    <div className="ddb-bg3-grid-tooltip-header">
                        <div>
                            <div className="ddb-bg3-grid-tooltip-title">{tooltip.name}</div>
                            <div className="ddb-bg3-grid-tooltip-subtitle">{tooltip.category} · {tooltip.subtitle}</div>
                        </div>
                        <span className="ddb-bg3-grid-tooltip-icon" style={{ color: tooltip.accent, borderColor: tooltip.accent }}>{tooltip.icon}</span>
                    </div>
                    {tooltip.details && tooltip.details.length > 0 && <div className="ddb-bg3-grid-tooltip-details">{tooltip.details.join(" · ")}</div>}
                    {tooltip.description && <div className="ddb-bg3-grid-tooltip-description">{tooltip.description}</div>}
                </div>,
                document.body
            )}
        </ActionGridTooltipContext.Provider>
    );
};

export const ActionGridTile: React.FC<ActionGridTileProps> = ({
    name,
    category,
    subtitle,
    description,
    details = [],
    icon,
    accent,
    shortcut,
    selected = false,
    disabled = false,
    handBadge,
    actionBadge,
    badgeText,
    badgeClass,
    onActivate,
    onContextMenu,
}) => {
    const tooltip = React.useContext(ActionGridTooltipContext);
    const tooltipId = React.useId();

    return (
        <button
            type="button"
            className={`ddb-bg3-icon-tile ${selected ? "selected" : ""} ${disabled ? "disabled" : ""}`}
            style={{ "--tile-accent": accent } as React.CSSProperties}
            aria-label={`${name}, ${category}`}
            aria-describedby={tooltip?.activeId === tooltipId ? tooltipId : undefined}
            aria-pressed={selected}
            aria-disabled={disabled}
            disabled={disabled}
            onMouseEnter={event => tooltip?.showTooltip(tooltipId, event, { name, category, subtitle, description, details, icon, accent })}
            onMouseLeave={() => tooltip?.scheduleTooltipClose()}
            onFocus={event => tooltip?.showTooltip(tooltipId, event, { name, category, subtitle, description, details, icon, accent })}
            onBlur={() => tooltip?.scheduleTooltipClose()}
            onClick={disabled ? undefined : onActivate}
            onContextMenu={disabled ? undefined : onContextMenu}
        >
            <span className="ddb-bg3-icon-tile-shortcut" aria-hidden="true">{shortcut}</span>
            <span className="ddb-bg3-icon-tile-art" aria-hidden="true">{icon}</span>
            {selected && <span className="ddb-bg3-icon-tile-selected" aria-hidden="true">✓</span>}
            {handBadge && (
                <span
                    className={`ddb-bg3-tile-hand-badge ${handBadge.type}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handBadge.onClick?.();
                    }}
                    onContextMenu={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handBadge.onClick?.();
                    }}
                    title={`${handBadge.type === "main" ? "Main Hand" : "Off Hand"} - Click or Right-click to Swap Hands`}
                >
                    {handBadge.label}
                </span>
            )}
            {actionBadge && (
                <span
                    className={`ddb-bg3-tile-action-badge ${actionBadge.className || ""}`}
                    onClick={(e) => {
                        if (actionBadge.onClick) {
                            e.stopPropagation();
                            e.preventDefault();
                            actionBadge.onClick();
                        }
                    }}
                    title={actionBadge.title || actionBadge.label}
                >
                    {actionBadge.label}
                </span>
            )}
            {badgeText && !handBadge && (
                <span className={`ddb-bg3-tile-pill-badge ${badgeClass || ""}`}>
                    {badgeText}
                </span>
            )}
        </button>
    );
};
