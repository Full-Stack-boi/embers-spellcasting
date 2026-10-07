import React from "react";
import type { ActiveBuff } from "../../../services/buffService";

interface ActiveStatusChipsProps {
    buffs: ActiveBuff[];
    concentration: { id: string; name: string } | null;
    conditions: string[];
    exhaustionLevel: number;
    onBreakConcentration: () => void;
    onToggleCondition: (condition: string) => void;
    onReduceExhaustion: () => void;
    onRemoveBuff: (buffId: string) => void | Promise<void>;
}

export const ActiveStatusChips: React.FC<ActiveStatusChipsProps> = ({
    buffs,
    concentration,
    conditions,
    exhaustionLevel,
    onBreakConcentration,
    onToggleCondition,
    onReduceExhaustion,
    onRemoveBuff,
}) => (
    <div className="ddb-pillar-buffs-wrap">
        {concentration && (
            <div className="ddb-buff-chip ddb-buff-chip-concentration" title={`Concentrating on ${concentration.name}\nClick ✕ to break concentration`}>
                <span className="ddb-buff-icon">💎</span>
                <span className="ddb-buff-name">CONC: {concentration.name}</span>
                <button type="button" className="ddb-buff-remove-btn" onClick={event => { event.stopPropagation(); onBreakConcentration(); }} title="Break Concentration">✕</button>
            </div>
        )}
        {conditions.map(condition => (
            <div key={condition} className="ddb-buff-chip ddb-condition-chip" title={`Condition: ${condition}\nClick to remove`}>
                <span className="ddb-buff-icon">⚠️</span>
                <span className="ddb-buff-name">{condition.toUpperCase()}</span>
                <button type="button" className="ddb-buff-remove-btn" onClick={event => { event.stopPropagation(); onToggleCondition(condition); }} title={`Remove ${condition}`}>✕</button>
            </div>
        ))}
        {exhaustionLevel > 0 && (
            <div className="ddb-buff-chip ddb-exhaustion-chip" title={`Exhaustion Level ${exhaustionLevel}: -${exhaustionLevel}d4 on d20 tests, -${exhaustionLevel * 5} ft speed`}>
                <span className="ddb-buff-icon">💀</span>
                <span className="ddb-buff-name">EXH {exhaustionLevel}</span>
                <button type="button" className="ddb-buff-remove-btn" onClick={event => { event.stopPropagation(); onReduceExhaustion(); }} title="Reduce exhaustion by 1">–</button>
            </div>
        )}
        {buffs.map(buff => (
            <div key={buff.id} className="ddb-buff-chip" title={`${buff.name}: ${buff.description}`}>
                <span className="ddb-buff-icon">{buff.icon}</span>
                <span className="ddb-buff-name">{buff.name}</span>
                <button type="button" className="ddb-buff-remove-btn" onClick={event => { event.stopPropagation(); void onRemoveBuff(buff.id); }} title={`Deactivate ${buff.name}`}>✕</button>
            </div>
        ))}
    </div>
);
