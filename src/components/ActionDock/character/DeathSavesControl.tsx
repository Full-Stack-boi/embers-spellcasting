import React from "react";

export interface DeathSavesControlProps {
    successes: number;
    failures: number;
    onSuccessesChange: (update: (previous: number) => number) => void;
    onFailuresChange: (update: (previous: number) => number) => void;
    onRoll: () => void;
}

export const DeathSavesControl: React.FC<DeathSavesControlProps> = ({
    successes,
    failures,
    onSuccessesChange,
    onFailuresChange,
    onRoll,
}) => (
    <div className="ddb-death-saves-bar compact">
        <div className="ddb-death-saves-pips-group">
            <span className="ddb-death-save-label">SUCC:</span>
            {[0, 1, 2].map(index => (
                <span
                    key={`ds-succ-${index}`}
                    className={`ddb-death-save-pip success ${successes > index ? "checked" : ""}`}
                    onClick={() => onSuccessesChange(previous => previous === index + 1 ? index : index + 1)}
                />
            ))}
        </div>
        <div className="ddb-death-saves-pips-group">
            <span className="ddb-death-save-label">FAIL:</span>
            {[0, 1, 2].map(index => (
                <span
                    key={`ds-fail-${index}`}
                    className={`ddb-death-save-pip failure ${failures > index ? "checked" : ""}`}
                    onClick={() => onFailuresChange(previous => previous === index + 1 ? index : index + 1)}
                />
            ))}
        </div>
        <button type="button" className="ddb-death-save-roll-btn" onClick={onRoll}>D20</button>
    </div>
);
