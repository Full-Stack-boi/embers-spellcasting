import React from "react";
import { DND_CONDITIONS } from "../domain/constants";

interface ConditionsPopoverProps {
    conditions: string[];
    exhaustionLevel: number;
    onExhaustionChange: (update: (current: number) => number) => void;
    onToggleCondition: (condition: string) => void;
}

export const ConditionsPopover: React.FC<ConditionsPopoverProps> = ({ conditions, exhaustionLevel, onExhaustionChange, onToggleCondition }) => (
    <div className="ddb-conditions-popover pillar-floating">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
            <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#f59e0b" }}>CONDITIONS</span>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "0.64rem", color: "#94a3b8" }}>Exhaustion:</span>
                <button type="button" style={{ background: "#334155", border: "none", color: "white", padding: "1px 6px", borderRadius: "3px", cursor: "pointer" }} onClick={() => onExhaustionChange(current => Math.max(0, current - 1))}>-</button>
                <span style={{ fontSize: "0.7rem", fontWeight: 800, color: exhaustionLevel > 0 ? "#f87171" : "#e2e8f0" }}>{exhaustionLevel}</span>
                <button type="button" style={{ background: "#334155", border: "none", color: "white", padding: "1px 6px", borderRadius: "3px", cursor: "pointer" }} onClick={() => onExhaustionChange(current => Math.min(6, current + 1))}>+</button>
            </div>
        </div>
        <div className="ddb-conditions-grid">
            {DND_CONDITIONS.map(condition => {
                const active = conditions.includes(condition);
                return (
                    <button key={condition} type="button" className={`ddb-condition-toggle-btn ${active ? "active" : ""}`} onClick={() => onToggleCondition(condition)}>
                        <span>{condition}</span><span>{active ? "✓" : "+"}</span>
                    </button>
                );
            })}
        </div>
    </div>
);
