import React from "react";
import { IconHitDice } from "../shared/Bg3Icons";
import type { DDBParsedCharacter } from "../../../types/ddb";
import type { DetailDrawerItem } from "../domain/types";

type HitPointDrawerItem = Extract<NonNullable<DetailDrawerItem>, { type: "hp" }>;

interface HitPointDrawerContentProps {
    item: HitPointDrawerItem;
    character?: DDBParsedCharacter;
    usedHitDice: Record<string, number>;
    onHeal: (amount: number) => void;
    onDamage: (amount: number) => void;
    onRollHitDie: (die: string, maxSides: number) => void;
}

export const HitPointDrawerContent: React.FC<HitPointDrawerContentProps> = ({
    item,
    character,
    usedHitDice,
    onHeal,
    onDamage,
    onRollHitDie,
}) => (
    <div className="ddb-drawer-hp-content">
        <div className="ddb-hp-drawer-grid">
            <div className="ddb-hp-stat-card">
                <span className="ddb-hp-label">CURRENT</span>
                <span className="ddb-hp-val">{item.current}</span>
            </div>
            <div className="ddb-hp-stat-card">
                <span className="ddb-hp-label">MAX</span>
                <span className="ddb-hp-val">{item.max}</span>
            </div>
            <div className="ddb-hp-stat-card">
                <span className="ddb-hp-label">TEMP</span>
                <span className="ddb-hp-val">{item.temp || "--"}</span>
            </div>
        </div>
        <div className="ddb-hp-quick-buttons">
            <button type="button" className="ddb-hp-btn heal" onClick={() => onHeal(5)}>+5 Heal</button>
            <button type="button" className="ddb-hp-btn dmg" onClick={() => onDamage(5)}>-5 Damage</button>
        </div>

        {character?.hitDice && character.hitDice.length > 0 && (
            <div style={{ marginTop: "12px", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "8px" }}>
                <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#38bdf8", letterSpacing: "0.05em", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    <IconHitDice size={12} /> SHORT REST HIT DICE:
                </span>
                {character.hitDice.map(hitDie => {
                    const used = usedHitDice[hitDie.die] || 0;
                    const remaining = Math.max(0, hitDie.total - used);
                    const sides = parseInt(hitDie.die.replace("d", ""), 10) || 8;
                    return (
                        <div key={hitDie.die} className="ddb-hit-dice-group">
                            <span style={{ fontSize: "0.72rem", color: "#cbd5e1" }}>
                                {hitDie.die}: <strong>{remaining}/{hitDie.total}</strong> left
                            </span>
                            <button
                                type="button"
                                className="ddb-hit-dice-roll-btn"
                                disabled={remaining <= 0}
                                onClick={() => onRollHitDie(hitDie.die, sides)}
                            >
                                Spend &amp; Roll ({hitDie.die}+{character.modifiers.con})
                            </button>
                        </div>
                    );
                })}
            </div>
        )}
    </div>
);
