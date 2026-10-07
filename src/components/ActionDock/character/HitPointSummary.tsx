import React from "react";

export interface HitPointSummaryProps {
    current: number;
    max: number;
    temporary: number;
    onOpenDetails: () => void;
    onHeal: () => void;
    onDamage: () => void;
}

export const HitPointSummary: React.FC<HitPointSummaryProps> = ({ current, max, temporary, onOpenDetails, onHeal, onDamage }) => (
    <div className="ddb-pillar-hp-box" onClick={onOpenDetails} title="Hit Points (Click for details & adjustments)">
        <div className="ddb-hp-quick-adjust-col" onClick={event => event.stopPropagation()}>
            <button type="button" className="ddb-hp-mini-btn heal" onClick={onHeal} title="+1 Heal">+1</button>
            <button type="button" className="ddb-hp-mini-btn dmg" onClick={onDamage} title="-1 Damage">-1</button>
        </div>
        <div className="ddb-pillar-hp-center">
            <div className="ddb-pillar-hp-row">
                <span className="ddb-pillar-hp-label">HP</span>
                <span className="ddb-cstat-val hp-nums">{current} <span className="ddb-hp-slash">/</span> {max}</span>
                {temporary > 0 && <span className="ddb-hp-temp-tag">+{temporary}</span>}
            </div>
            <div className="ddb-pillar-hp-bar">
                <div
                    className={`ddb-pillar-hp-bar-fill ${current <= max * 0.25 ? "critical" : current <= max * 0.5 ? "wounded" : "healthy"}`}
                    style={{ width: `${Math.min(100, Math.max(0, (current / (max || 1)) * 100))}%` }}
                />
            </div>
        </div>
    </div>
);
