import React, { useEffect, useState } from "react";
import "./SpellDetailViewer.css";
import { getSpellMetadata, isSpellUpcastable, getScaledSpellStats, getOrdinal } from "../../assets/spellInfo";
import { setSelectedSpell } from "../../effectsTool";
import OBR from "@owlbear-rodeo/sdk";
import { toolID } from "../../effectsTool";
import { IconCastLightning } from "../ActionDock/Bg3Icons";

export interface SpellDetailViewerProps {
    spellID: string;
    spellName?: string;
    onClose?: () => void;
    onCast?: (castLevel?: number) => void;
    compact?: boolean;
    castButtonLabel?: string;
    style?: React.CSSProperties;
}

export const SpellDetailViewer: React.FC<SpellDetailViewerProps> = ({
    spellID,
    spellName,
    onClose,
    onCast,
    compact = false,
    castButtonLabel,
    style
}) => {
    const meta = getSpellMetadata(spellID, spellName);
    const [castLevel, setCastLevel] = useState<number>(meta.level);

    useEffect(() => {
        setCastLevel(meta.level);
    }, [spellID, meta.level]);

    const isUpcastable = isSpellUpcastable(spellID, meta);
    const scaled = getScaledSpellStats(spellID, castLevel, meta);

    const handleCast = (levelToCast: number = castLevel) => {
        setSelectedSpell(spellID);
        OBR.tool.activateTool(toolID);
        const upcastMsg = levelToCast > meta.level
            ? ` at ${getOrdinal(levelToCast)} Level (${scaled.damage || "Upcast"})`
            : "";
        OBR.notification.show(`Selected ${meta.name}${upcastMsg}`, "INFO");
        if (onCast) {
            onCast(levelToCast);
        } else if (onClose) {
            onClose();
        }
    };

    const levelText = meta.level === 0 ? "Cantrip" : `Level ${meta.level}`;
    const ddbSchoolIcon = meta.school ? `https://media.dndbeyond.com/media/spell-school-icons/${meta.school.toLowerCase()}.svg` : null;

    return (
        <div className={`bg3-spell-card ${compact ? "compact" : ""}`} style={style}>
            {/* Header */}
            <div className="bg3-card-header">
                <div className="bg3-card-title-group">
                    {ddbSchoolIcon && (
                        <img className="bg3-card-ddb-school-icon" src={ddbSchoolIcon} alt={meta.school} loading="lazy" />
                    )}
                    <div className="bg3-card-title-text">
                        <h3 className="bg3-card-title">{meta.name}</h3>
                        <p className="bg3-card-subtitle">{meta.school}</p>
                    </div>
                </div>
                <div className="bg3-card-badges">
                    <span className="bg3-badge bg3-badge-level">{levelText}</span>
                    {meta.concentration && (
                        <span className="bg3-badge bg3-badge-concentration" title="Requires Concentration">
                            Conc
                        </span>
                    )}
                    {meta.ritual && (
                        <span className="bg3-badge bg3-badge-ritual" title="Can be cast as a Ritual">
                            Ritual
                        </span>
                    )}
                </div>
            </div>

            {/* D&D Beyond Cast & Level Selector Bar */}
            <div className="dndb-cast-action-bar">
                <button
                    className="dndb-cast-btn"
                    onClick={() => handleCast(castLevel)}
                    title={`Cast ${meta.name} at ${getOrdinal(castLevel)} level`}
                >
                    <IconCastLightning />
                    <span>CAST</span>
                    <span className="dndb-slot-badge">
                        {meta.level === 0 ? "CANTRIP" : `${getOrdinal(castLevel)} SPELL SLOT`}
                    </span>
                </button>

                {isUpcastable && (
                    <div className="dndb-level-selector">
                        <span className="dndb-level-label">LEVEL</span>
                        <div className="dndb-stepper">
                            <button
                                className="dndb-step-btn"
                                onClick={() => setCastLevel(prev => Math.max(meta.level, prev - 1))}
                                disabled={castLevel <= meta.level}
                                title="Decrease spell slot level"
                            >
                                −
                            </button>
                            <span className="dndb-level-value">{getOrdinal(castLevel)}</span>
                            <button
                                className="dndb-step-btn"
                                onClick={() => setCastLevel(prev => Math.min(9, prev + 1))}
                                disabled={castLevel >= 9}
                                title="Increase spell slot level (Upcast)"
                            >
                                +
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* D&D Beyond Scaled Damage Banner */}
            {scaled.damage && (
                <div className="dndb-scaled-damage-banner">
                    <span className="dndb-damage-amount">{scaled.damage}</span>
                    <span className="dndb-damage-label">Damage / Effect</span>
                    {castLevel > meta.level && (
                        <span className="dndb-upcast-tag">Upcast +{castLevel - meta.level}</span>
                    )}
                </div>
            )}

            {/* Core Stats Grid */}
            <div className="bg3-card-stats-grid">
                <div className="bg3-stat-item">
                    <span className="bg3-stat-label">Casting Time</span>
                    <span className="bg3-stat-value">{meta.castingTime}</span>
                </div>
                <div className="bg3-stat-item">
                    <span className="bg3-stat-label">Range</span>
                    <span className="bg3-stat-value highlight-range">{meta.range}</span>
                </div>
                {meta.aoe && (
                    <div className="bg3-stat-item" style={{ gridColumn: "span 2" }}>
                        <span className="bg3-stat-label">Area of Effect</span>
                        <span className="bg3-stat-value" style={{ color: "#fb923c" }}>{meta.aoe}</span>
                    </div>
                )}
                <div className="bg3-stat-item">
                    <span className="bg3-stat-label">Duration</span>
                    <span className="bg3-stat-value">{meta.duration}</span>
                </div>
                <div className="bg3-stat-item">
                    <span className="bg3-stat-label">Components</span>
                    <span className="bg3-stat-value">{meta.components}</span>
                </div>
                {scaled.damage && (
                    <div className="bg3-stat-item">
                        <span className="bg3-stat-label">Damage / Effect</span>
                        <span className="bg3-stat-value highlight-damage">{scaled.damage}</span>
                    </div>
                )}
                {meta.saveOrAttack && (
                    <div className="bg3-stat-item">
                        <span className="bg3-stat-label">Attack / Save</span>
                        <span className="bg3-stat-value">{meta.saveOrAttack}</span>
                    </div>
                )}
            </div>

            {/* Spell Description */}
            <p className="bg3-card-description">{meta.description}</p>

            {/* Higher Levels Upcast */}
            {meta.higherLevels && (
                <div className="bg3-card-higher-levels">
                    <strong>At Higher Levels: </strong>
                    {meta.higherLevels}
                </div>
            )}

            {/* Actions */}
            {!compact && (
                <div className="bg3-card-footer">
                    {onClose && (
                        <button className="bg3-close-btn" onClick={onClose}>
                            Close
                        </button>
                    )}
                    <button className="bg3-cast-btn" onClick={() => handleCast(castLevel)}>
                        {castButtonLabel ? castButtonLabel : (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                <IconCastLightning />
                                <span>Cast Spell</span>
                            </span>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

export default SpellDetailViewer;
