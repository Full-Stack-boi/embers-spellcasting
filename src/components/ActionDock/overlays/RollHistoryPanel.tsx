import React from "react";
import { DDBRollCard } from "../../DDBRollLog/DDBRollCard";
import type { DDBRollCardData } from "../../../types/ddbRollLog";

interface RollHistoryPanelProps {
    history: DDBRollCardData[];
    onClear: () => void;
}

export const RollHistoryPanel: React.FC<RollHistoryPanelProps> = ({ history, onClear }) => (
    <div className="ddb-drawer-log-embed" style={{ padding: "6px 2px", display: "flex", flexDirection: "column", gap: "8px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 6px 4px" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8" }}>
                {history.length} Recorded Roll{history.length === 1 ? "" : "s"}
            </span>
            {history.length > 0 && (
                <button
                    type="button"
                    style={{
                        background: "rgba(255, 255, 255, 0.06)",
                        border: "1px solid rgba(255, 255, 255, 0.12)",
                        color: "#94a3b8",
                        fontSize: "11px",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        cursor: "pointer",
                    }}
                    onClick={onClear}
                >
                    Clear History
                </button>
            )}
        </div>
        {history.length === 0 ? (
            <div style={{ padding: "40px 16px", textAlign: "center", color: "#64748b", fontSize: "12px", lineHeight: "1.6" }}>
                No dice rolls recorded yet.<br />
                Rolls from attacks, checks, saving throws, spells, or the dice roller will appear here in authentic D&amp;D Beyond format.
            </div>
        ) : (
            history.map(card => <DDBRollCard key={card.id} data={card} />)
        )}
    </div>
);
