import React from "react";
import type { DDBParsedSpell } from "../../../types/ddb";
import { IconCastLightning } from "../shared/Bg3Icons";

interface UpcastPickerRowProps {
    spell: { id: string; level: number; rawDdbSpell?: DDBParsedSpell };
    colSpan: number;
    availableLevels: number[];
    selectedLevel: number;
    pactMagicLevel?: number;
    getRemainingSlots: (level: number) => number;
    onLevelChange: (level: number) => void;
    onCast: (spellId: string, level: number) => void;
    onCancel: () => void;
}

export const UpcastPickerRow: React.FC<UpcastPickerRowProps> = ({
    spell,
    colSpan,
    availableLevels,
    selectedLevel,
    pactMagicLevel,
    getRemainingSlots,
    onLevelChange,
    onCast,
    onCancel,
}) => (
    <tr className="ddb-upcast-picker-row">
        <td colSpan={colSpan}>
            <div className="ddb-upcast-picker" onClick={event => event.stopPropagation()}>
                <div className="ddb-upcast-levels">
                    <span className="ddb-upcast-picker-label">Cast at level:</span>
                    {availableLevels.map(level => {
                        const remaining = getRemainingSlots(level);
                        const isPact = level === pactMagicLevel;
                        return (
                            <button
                                key={level}
                                type="button"
                                className={["ddb-upcast-lvl-btn", selectedLevel === level ? "selected" : "", remaining === 0 ? "exhausted" : "", isPact ? "pact" : ""].filter(Boolean).join(" ")}
                                disabled={remaining === 0}
                                onClick={() => onLevelChange(level)}
                                title={`${remaining} slot${remaining !== 1 ? "s" : ""} remaining`}
                            >
                                <span className="ddb-upcast-lvl-num">{level}</span><span className="ddb-upcast-lvl-remain">{remaining} left</span>
                            </button>
                        );
                    })}
                </div>
                {spell.rawDdbSpell?.higherLevels && selectedLevel > spell.level && (
                    <div className="ddb-upcast-effect-text">
                        <span className="ddb-upcast-effect-label">At Level {selectedLevel}:</span>
                        <span>{spell.rawDdbSpell.higherLevels}</span>
                    </div>
                )}
                <div className="ddb-upcast-confirm-row">
                    <button type="button" className="ddb-upcast-confirm-btn" disabled={getRemainingSlots(selectedLevel) === 0} onClick={() => onCast(spell.id, selectedLevel)}>
                        <IconCastLightning size={12} /><span>Cast at Level {selectedLevel}</span>
                    </button>
                    <button type="button" className="ddb-upcast-cancel-btn" onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </td>
    </tr>
);
