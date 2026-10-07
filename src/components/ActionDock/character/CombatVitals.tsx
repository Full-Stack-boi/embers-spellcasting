import React from "react";
import type { DDBParsedCharacter } from "../../../types/ddb";
import type { DetailDrawerItem } from "../domain/types";

interface CombatVitalsProps {
    character: DDBParsedCharacter;
    heroicInspiration: boolean;
    onOpenDrawer: (item: NonNullable<DetailDrawerItem>) => void;
    onInitiativeRoll: () => void;
    onToggleInspiration: () => void;
}

export const CombatVitals: React.FC<CombatVitalsProps> = ({
    character,
    heroicInspiration,
    onOpenDrawer,
    onInitiativeRoll,
    onToggleInspiration,
}) => (
    <>
        <div className="ddb-pillar-vitals-grid">
            <div
                className="ddb-pillar-vital-cell ac"
                onClick={() => onOpenDrawer({
                    type: "ac",
                    ac: character.armorClass ?? 0,
                    breakdown: character.acBreakdown || [
                        { label: "Base Armor", value: `${character.armorClass ?? 10}` },
                    ],
                    description: "Your Armor Class (AC) represents how well your character avoids being wounded in battle.",
                })}
                title="Armor Class (Click for AC breakdown)"
            >
                <span className="ddb-pillar-vital-val">{character.armorClass ?? 0}</span>
                <span className="ddb-pillar-vital-lbl">AC</span>
            </div>

            <button
                type="button"
                className="ddb-pillar-vital-cell init-btn"
                onClick={onInitiativeRoll}
                title={`Initiative: ${(character.initiative ?? 0) >= 0 ? "+" : ""}${character.initiative ?? 0}${character.hasInitiativeAdvantage ? " (Advantage)" : ""} - Click to Roll`}
            >
                <div className="ddb-init-row">
                    <span className="ddb-pillar-vital-val">{(character.initiative ?? 0) >= 0 ? "+" : ""}{character.initiative ?? 0}</span>
                    {character.hasInitiativeAdvantage && <span className="ddb-advantage-badge" title="Advantage on Initiative">A</span>}
                </div>
                <span className="ddb-pillar-vital-lbl">INIT</span>
            </button>

            <div className="ddb-pillar-vital-cell speed" title="Walking Speed">
                <span className="ddb-pillar-vital-val">{character.speed || 30}<span className="ddb-cstat-unit">ft</span></span>
                <span className="ddb-pillar-vital-lbl">SPEED</span>
            </div>

            <div className="ddb-pillar-vital-cell prof" title="Proficiency Bonus">
                <span className="ddb-pillar-vital-val">+{character.proficiencyBonus}</span>
                <span className="ddb-pillar-vital-lbl">PROF</span>
            </div>
        </div>

        <div className="ddb-pillar-aux-row">
            <button
                type="button"
                className={`ddb-pillar-inspiration-btn ${heroicInspiration ? "active" : ""}`}
                onClick={onToggleInspiration}
                title="Heroic Inspiration: Reroll any die (Click to toggle)"
            >
                <span className="ddb-inspiration-icon">🌅</span>
                <span className="ddb-aux-btn-text">INSPIRATION</span>
            </button>

            <button
                type="button"
                className="ddb-pillar-defenses-btn"
                onClick={() => onOpenDrawer({
                    type: "defenses",
                    resistances: character.defenses?.resistances || [],
                    immunities: character.defenses?.immunities || [],
                    vulnerabilities: character.defenses?.vulnerabilities || [],
                })}
                title="Defenses: Click for full breakdown"
            >
                <span className="ddb-defenses-shield">🛡️</span>
                <span className="ddb-aux-btn-text">DEFENSES</span>
            </button>
        </div>
    </>
);
