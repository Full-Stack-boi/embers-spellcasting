import React, { useMemo, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import type { DDBParsedSpell } from "../../../types/ddb";
import { getSchoolStyle } from "../../../assets/spellInfo";
import {
    DAMAGE_TYPE_META,
    getDamageTypeIcon,
    IconClose,
    HexAbilityIcon,
    HexHeartIcon,
    HEX_ABILITIES,
    HEX_ABILITY_META,
    HexAbilityKey,
    IconEye,
    IconDiceD6,
    IconCaretUp,
    IconSquarePip,
    getWeaponIcon,
    IconFire,
} from "../shared/Bg3Icons";
import type { DDBWeaponAttack } from "../../../types/ddb";
import {
    FaFireFlameCurved,
    FaWandMagicSparkles,
    FaHandHoldingHeart,
    FaHandFist,
    FaShieldHalved,
} from "react-icons/fa6";
import { FONT_CREATE_OPTIONS } from "../../../assets/manual-formulas/index";

export type FeatureFlyoutKind =
    | "font_of_magic"
    | "harness_divine_power"
    | "arcane_recovery"
    | "focus_points"
    | "lay_on_hands"
    | "metamagic"
    | "maneuvers"
    | "cunning_strike"
    | "second_wind"
    | "tactical_mind"
    | "divine_spark"
    | "options_grid";

export interface BG3FlyoutSpell {
    id: string;
    name: string;
    level: number;
    school?: string;
    damage?: string;
    damageType?: string;
    castingTime?: string;
    rangeText?: string;
    notes?: string;
    rawDdbSpell?: DDBParsedSpell;
}

export interface BG3FlyoutWeaponData {
    weapon: DDBWeaponAttack;
    effectiveDamage: string;
    resolvedRiders?: import("../../../services/weaponDamageRiders").ResolvedWeaponRiders;
    selectedRiderChoice?: string;
    onSelectRiderChoice?: (choice: string) => void;
    onAttackRoll?: (weapon: DDBWeaponAttack) => void;
    onDamageRoll?: (weapon: DDBWeaponAttack) => void;
}

export interface BG3FlyoutFeatureData {
    id: string;
    name: string;
    kind: FeatureFlyoutKind;
    resourceName: string;
    availablePoints: number;
    maxPoints: number;
    sorcererLevel?: number;
    proficiencyBonus?: number;
    paladinLevel?: number;
    wizardLevel?: number;
    spellSlots: Record<number, { max: number; used: number }>;
    pactSlots?: { max: number; used: number; level: number };
    onConvertSlotToResource?: (slotLevel: number, isPact?: boolean) => void;
    onCreateSpellSlot?: (slotLevel: number, cost: number, minLevel: number) => void;
    onRegainExpendedSlot?: (slotLevel: number) => void;
    options?: import("../../../types/manualFormula").FeatureActionOption[];
    onSpendResourceAction?: (actionName: string, cost: number, details?: string, actionType?: "bonus" | "action" | "reaction" | "none") => void;
}

interface BG3FlyoutBarProps {
    spell?: BG3FlyoutSpell;
    weaponData?: BG3FlyoutWeaponData;
    featureData?: BG3FlyoutFeatureData;
    selectedLevel?: number;
    availableLevels?: number[];
    onSelectLevel?: (level: number) => void;
    onCast?: (level: number, hexAbility?: string, damageType?: string) => void;
    getRemainingSlots?: (level: number) => number;
    isPactLevel?: (level: number) => boolean;
    selectedDamageType?: string;
    onSelectDamageType?: (type: string) => void;
    damageTypeChoices?: string[];
    selectedHexAbility?: string | null;
    onSelectHexAbility?: (ability: string) => void;
    onClose: () => void;
}

const ROMAN_NUMERALS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"];

export const BG3FlyoutBar: React.FC<BG3FlyoutBarProps> = ({
    spell,
    weaponData,
    featureData,
    selectedLevel = 1,
    availableLevels = [],
    onSelectLevel,
    onCast,
    getRemainingSlots = () => 0,
    isPactLevel = () => false,
    selectedDamageType,
    onSelectDamageType,
    damageTypeChoices,
    selectedHexAbility,
    onSelectHexAbility,
    onClose,
}) => {
    // -------------------------------------------------------------
    // FEATURE FLYOUT STATE
    // -------------------------------------------------------------
    const [fontMode, setFontMode] = useState<"create" | "convert">("create");
    const [featureSlotLevel] = useState<number>(1);
    const [selectedActionIndex] = useState<number>(0);

    // -------------------------------------------------------------
    // SPELL / HEX STATE
    // -------------------------------------------------------------
    const isSpell = Boolean(spell);
    const isLeveled = (spell?.level ?? 0) > 0;
    const hasUpcast = isLeveled && availableLevels.length > 0;
    const hasChoices = Boolean(damageTypeChoices && damageTypeChoices.length > 0);
    const isSorcerousBurst = spell?.name.toLowerCase() === "sorcerous burst";
    const isHex = spell?.name.toLowerCase() === "hex" || spell?.id.toLowerCase() === "hex";

    const [hoveredAbility, setHoveredAbility] = useState<HexAbilityKey | null>(null);
    const [tooltipPosition, setTooltipPosition] = useState<{ left: number; top: number } | null>(null);
    const chosenAbility = (selectedHexAbility?.toLowerCase() as HexAbilityKey) || "dexterity";

    const schoolStyle = useMemo(() => {
        return getSchoolStyle(spell?.school);
    }, [spell?.school]);

    // Active damage type for element choices
    const currentDamageType = (selectedDamageType || spell?.damageType || (damageTypeChoices ? damageTypeChoices[0] : "fire")).toLowerCase();

    // -------------------------------------------------------------
    // KEYBOARD SHORTCUTS (Enter to Cast / Esc to Close)
    // -------------------------------------------------------------
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            } else if (e.key === "Enter") {
                if (weaponData) {
                    weaponData.onAttackRoll?.(weaponData.weapon);
                } else if (isSpell && onCast) {
                    onCast(selectedLevel, isHex ? chosenAbility : undefined, currentDamageType);
                }
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isSpell, onCast, selectedLevel, isHex, chosenAbility, currentDamageType, weaponData, onClose]);

    // -------------------------------------------------------------
    // HEADER CONTENT
    // -------------------------------------------------------------
    const headerContent = useMemo(() => {
        if (weaponData) {
            const riders = weaponData.resolvedRiders;
            let ridersText = "";
            if (riders) {
                const reasons = riders.flatBonusReasons.length > 0 ? ` (${riders.flatBonusReasons.join(", ")})` : "";
                const diceTexts = riders.activeDiceRiders.map(r => {
                    const bonusStr = r.flatBonus && r.flatBonus > 0 ? `+${r.flatBonus}` : "";
                    const capType = r.damageType ? r.damageType.charAt(0).toUpperCase() + r.damageType.slice(1) : "";
                    return ` • ${r.name}: +${r.dice ?? ""}${bonusStr} ${capType}`;
                }).join("");
                ridersText = `${reasons}${diceTexts}`;
            }
            return (
                <span className="ddb-flyout-header-base">
                    <span className="ddb-flyout-spell-title">{weaponData.weapon.name}</span>
                    <span className="ddb-flyout-base-meta">
                        {" "}• Range: {weaponData.weapon.rangeText} • Hit: +{weaponData.weapon.toHit} • Damage: {weaponData.effectiveDamage} {weaponData.weapon.damageType}{ridersText}
                    </span>
                </span>
            );
        }

        if (featureData) {
            switch (featureData.kind) {
                case "font_of_magic":
                    if (fontMode === "create") {
                        const opt = FONT_CREATE_OPTIONS.find(o => o.slotLevel === featureSlotLevel) || FONT_CREATE_OPTIONS[0];
                        return (
                            <span className="ddb-flyout-header-base">
                                <span className="ddb-flyout-spell-title">Font of Magic</span>
                                <span className="ddb-flyout-base-meta">
                                    {" "}• Create Spell Slot (Bonus Action) • <strong>{featureData.availablePoints} / {featureData.maxPoints} SP</strong> available • Level {opt.slotLevel} costs {opt.cost} SP
                                </span>
                            </span>
                        );
                    }
                    return (
                        <span className="ddb-flyout-header-base">
                            <span className="ddb-flyout-spell-title">Font of Magic</span>
                            <span className="ddb-flyout-base-meta">
                                {" "}• Convert Spell Slot to Sorcery Points (No Action) • <strong>{featureData.availablePoints} / {featureData.maxPoints} SP</strong> • Grants +{featureSlotLevel} SP
                            </span>
                        </span>
                    );
                case "harness_divine_power":
                    return (
                        <span className="ddb-flyout-header-base">
                            <span className="ddb-flyout-spell-title">Harness Divine Power</span>
                            <span className="ddb-flyout-base-meta">
                                {" "}• Regain 1 Expended Spell Slot • <strong>{featureData.availablePoints} / {featureData.maxPoints} Channel Divinity</strong> uses available
                            </span>
                        </span>
                    );
                case "arcane_recovery":
                    return (
                        <span className="ddb-flyout-header-base">
                            <span className="ddb-flyout-spell-title">Arcane Recovery</span>
                            <span className="ddb-flyout-base-meta">
                                {" "}• Regain Expended Spell Slots during Short Rest (Wizard)
                            </span>
                        </span>
                    );
                default: {
                    const opt = featureData.options?.[selectedActionIndex] || featureData.options?.[0];
                    return (
                        <span className="ddb-flyout-header-base">
                            <span className="ddb-flyout-spell-title">{featureData.name}</span>
                            <span className="ddb-flyout-base-meta">
                                {" "}• <strong>{featureData.availablePoints} / {featureData.maxPoints} {featureData.resourceName}</strong> available{opt ? ` • ${opt.name}: ${opt.desc}` : ""}
                            </span>
                        </span>
                    );
                }
            }
        }

        if (!spell) return null;

        // Hex Header
        if (isHex) {
            const activeKey = hoveredAbility || chosenAbility;
            const meta = HEX_ABILITY_META[activeKey];
            const upcastTxt = selectedLevel > 1 ? ` • Upcast Level ${selectedLevel}` : "";
            return (
                <span className="ddb-flyout-header-base">
                    <span className="ddb-flyout-spell-title">Hex ({meta.label})</span>
                    <span className="ddb-flyout-base-meta">
                        {" "}• +1d6 Necrotic on hit &amp; Disadvantage on {meta.label} Checks{upcastTxt}
                    </span>
                </span>
            );
        }

        // If spell has choices and is cantrip (like Sorcerous Burst)
        if (hasChoices && !hasUpcast) {
            return (
                <span className="ddb-flyout-header-title">
                    <span className="ddb-flyout-spell-title">{spell.name}</span>
                    {currentDamageType && (
                        <span className="ddb-flyout-type-badge" style={{ color: DAMAGE_TYPE_META[currentDamageType]?.color || "#cbd5e1" }}>
                            {" "}• {DAMAGE_TYPE_META[currentDamageType]?.label || currentDamageType.toUpperCase()}
                        </span>
                    )}
                </span>
            );
        }

        // If upcast level is higher than base level
        if (hasUpcast && selectedLevel > spell.level) {
            if (spell.damage) {
                const diceMatch = spell.damage.match(/^(\d+)d(\d+)/i);
                const maxDie = diceMatch ? diceMatch[2] : "6";
                const dmgType = DAMAGE_TYPE_META[currentDamageType]?.label || spell.damageType || "Damage";
                return (
                    <span className="ddb-flyout-header-upcast">
                        <strong className="ddb-flyout-upcast-tag">^Upcast : </strong>
                        <span className="ddb-flyout-upcast-text">
                            Deals an additional 1~{maxDie} {dmgType} damage per level.
                        </span>
                    </span>
                );
            }

            if (spell.rawDdbSpell?.higherLevels) {
                return (
                    <span className="ddb-flyout-header-upcast">
                        <strong className="ddb-flyout-upcast-tag">^Upcast : </strong>
                        <span className="ddb-flyout-upcast-text">{spell.rawDdbSpell.higherLevels}</span>
                    </span>
                );
            }

            return (
                <span className="ddb-flyout-header-upcast">
                    <strong className="ddb-flyout-upcast-tag">^Upcast : </strong>
                    <span className="ddb-flyout-upcast-text">Cast at Level {selectedLevel}</span>
                </span>
            );
        }

        // Base level display
        return (
            <span className="ddb-flyout-header-base">
                <span className="ddb-flyout-spell-title">{spell.name}</span>
                <span className="ddb-flyout-base-meta">
                    {" "}({spell.level === 0 ? "Cantrip" : `Level ${spell.level}`}) • {spell.castingTime || "1 Action"} • {spell.rangeText || "Self"}
                </span>
            </span>
        );
    }, [featureData, fontMode, featureSlotLevel, selectedActionIndex, spell, isHex, hoveredAbility, hasChoices, hasUpcast, selectedLevel, currentDamageType, weaponData]);

    return (
        <div className="ddb-bg3-flyout-bar" onClick={e => e.stopPropagation()}>
            {/* Hex Floating Tooltip */}
            {isHex && hoveredAbility && tooltipPosition && spell && createPortal(
                <div className="ddb-hex-bg3-tooltip" role="tooltip" style={tooltipPosition}>
                    <div className="ddb-hex-bg3-tooltip-header">
                        <div className="ddb-hex-bg3-tooltip-title-col">
                            <div className="ddb-hex-bg3-tooltip-title">
                                Hex ({HEX_ABILITY_META[hoveredAbility].label})
                            </div>
                            <div className="ddb-hex-bg3-tooltip-school">
                                Level 1 Enchantment Spell
                            </div>
                        </div>
                        <div className="ddb-hex-bg3-tooltip-icon">
                            <HexAbilityIcon ability={hoveredAbility} size={50} showPlus={false} />
                        </div>
                    </div>

                    <div className="ddb-hex-bg3-tooltip-dmg-block">
                        <div className="ddb-hex-bg3-tooltip-dmg-title">1~6 Damage</div>
                        <div className="ddb-hex-bg3-tooltip-dmg-badge">
                            <IconDiceD6 size={13} className="ddb-hex-die-icon" />
                            <span>1d6 Necrotic (Conditional)</span>
                        </div>
                    </div>

                    <div className="ddb-hex-bg3-tooltip-body">
                        Deal an additional <span className="ddb-hex-highlight-dmg">1~6 Necrotic damage</span> when you attack the target and impart <strong className="ddb-hex-highlight-dis">Disadvantage</strong> on {HEX_ABILITY_META[hoveredAbility].label} Checks.
                    </div>

                    <div className="ddb-hex-bg3-tooltip-meta">
                        <div className="ddb-hex-meta-row">
                            <HexHeartIcon size={14} glowColor="#e879f9" />
                            <span>Until Long Rest</span>
                        </div>
                        <div className="ddb-hex-meta-row">
                            <span className="ddb-hex-range-dot">⤢ {spell.rangeText || "27m / 90ft"}</span>
                            <span className="ddb-hex-conc-tag"><IconEye size={11} /> Concentration</span>
                        </div>
                    </div>

                    <div className="ddb-hex-bg3-tooltip-cost-bar">
                        <span className="ddb-hex-cost-pill bonus-action">
                            <IconCaretUp size={10} /> Bonus Action
                        </span>
                        <span className="ddb-hex-cost-pill spell-slot">
                            <IconSquarePip size={8} /> Level 1 Spell Slot
                        </span>
                    </div>
                </div>,
                document.body
            )}

            {/* Top row: Upcast/Spell Header and Close button */}
            <div className="ddb-bg3-flyout-top-row">
                <div className="ddb-bg3-flyout-header-text">
                    {headerContent}
                </div>
                <button
                    type="button"
                    className="ddb-bg3-flyout-close-btn"
                    onClick={onClose}
                    title="Close"
                    aria-label="Close"
                >
                    <IconClose size={11} />
                </button>
            </div>

            {/* Bottom row: Tiles Row */}
            <div className="ddb-bg3-flyout-tiles-row">
                {weaponData ? (
                    <>
                        <div className="ddb-bg3-flyout-tile base-tile" title={weaponData.weapon.name}>
                            {getWeaponIcon(weaponData.weapon.name, weaponData.weapon.type, 24)}
                        </div>

                        <div className="ddb-bg3-flyout-tile-divider" />

                        {weaponData.resolvedRiders?.availableRiderChoice && (
                            <>
                                <div className="ddb-bg3-flyout-subchoices-group">
                                    {weaponData.resolvedRiders.availableRiderChoice.choices.map((choice) => {
                                        const meta = DAMAGE_TYPE_META[choice.toLowerCase()] || {
                                            label: choice.toUpperCase(),
                                            color: "#cbd5e1",
                                            border: "#475569",
                                            bg: "#1e293b",
                                        };
                                        const current = weaponData.selectedRiderChoice || weaponData.resolvedRiders?.availableRiderChoice?.currentChoice;
                                        const isSelected = current === choice;
                                        const riderChoice = weaponData.resolvedRiders?.availableRiderChoice;
                                        const bonusStr = riderChoice && riderChoice.flatBonus > 0 ? `+${riderChoice.flatBonus}` : "";
                                        const tooltip = `${riderChoice?.riderName}: +${riderChoice?.bonusDice}${bonusStr} ${meta.label} damage`;
                                        const icon = getDamageTypeIcon(choice, 22);

                                        return (
                                            <button
                                                key={choice}
                                                type="button"
                                                className={`ddb-bg3-flyout-tile choice-tile ${isSelected ? "selected" : ""}`}
                                                style={{
                                                    background: meta.bg,
                                                    borderColor: isSelected ? "#ffffff" : meta.border,
                                                    color: meta.color,
                                                }}
                                                onClick={() => weaponData.onSelectRiderChoice?.(choice)}
                                                title={tooltip}
                                                aria-label={tooltip}
                                            >
                                                {icon || <span style={{ fontSize: "11px", fontWeight: 800 }}>{meta.label.slice(0, 3)}</span>}
                                            </button>
                                        );
                                    })}
                                </div>
                                <div className="ddb-bg3-flyout-tile-divider" />
                            </>
                        )}

                        <div className="ddb-bg3-flyout-subchoices-group">
                            <button
                                type="button"
                                className="ddb-bg3-flyout-tile mode-tile"
                                onClick={() => weaponData.onAttackRoll?.(weaponData.weapon)}
                                title={`Roll Attack (${weaponData.weapon.toHit >= 0 ? `+${weaponData.weapon.toHit}` : weaponData.weapon.toHit})`}
                            >
                                <IconDiceD6 size={12} />
                                <span>To Hit</span>
                            </button>
                            <button
                                type="button"
                                className="ddb-bg3-flyout-tile mode-tile"
                                onClick={() => weaponData.onDamageRoll?.(weaponData.weapon)}
                                title="Roll Damage"
                            >
                                <IconFire size={12} />
                                <span>Damage</span>
                            </button>
                        </div>
                    </>
                ) : featureData ? (
                    (() => {
                        if (featureData.kind === "font_of_magic") {
                            return (
                                <>
                                    {/* Left Tile: Sorcery Points Badge */}
                                    <div className="ddb-bg3-flyout-tile base-tile font-magic-tile" title={`Sorcery Points: ${featureData.availablePoints}/${featureData.maxPoints}`}>
                                        <FaFireFlameCurved size={18} color="#f59e0b" />
                                        <span className="ddb-font-magic-tile-sp">{featureData.availablePoints}</span>
                                    </div>

                                    <div className="ddb-bg3-flyout-tile-divider" />

                                    {/* Mode Selector Tiles: [ Create Slot ] [ Convert to SP ] */}
                                    <div className="ddb-bg3-flyout-subchoices-group">
                                        <button
                                            type="button"
                                            className={`ddb-bg3-flyout-tile mode-tile ${fontMode === "create" ? "selected" : ""}`}
                                            onClick={() => setFontMode("create")}
                                            title="Create Spell Slot (Bonus Action)"
                                        >
                                            <FaWandMagicSparkles size={12} color="#38bdf8" />
                                            <span>Create Slot</span>
                                        </button>
                                        <button
                                            type="button"
                                            className={`ddb-bg3-flyout-tile mode-tile ${fontMode === "convert" ? "selected" : ""}`}
                                            onClick={() => setFontMode("convert")}
                                            title="Convert Spell Slot to Sorcery Points (No Action)"
                                        >
                                            <FaFireFlameCurved size={12} color="#f59e0b" />
                                            <span>Convert to SP</span>
                                        </button>
                                    </div>

                                    <div className="ddb-bg3-flyout-tile-divider" />

                                    {/* Slot Selection Tiles */}
                                    {fontMode === "create" ? (
                                        <div className="ddb-bg3-flyout-levels-group">
                                            {FONT_CREATE_OPTIONS.map(opt => {
                                                const canAfford = featureData.availablePoints >= opt.cost && (featureData.sorcererLevel ?? 1) >= opt.minLevel;
                                                const roman = ROMAN_NUMERALS[opt.slotLevel - 1] || String(opt.slotLevel);

                                                return (
                                                    <button
                                                        key={opt.slotLevel}
                                                        type="button"
                                                        className={`ddb-bg3-flyout-tile slot-tile ${!canAfford ? "exhausted" : ""}`}
                                                        onClick={() => {
                                                            if (!canAfford) return;
                                                            featureData.onCreateSpellSlot?.(opt.slotLevel, opt.cost, opt.minLevel);
                                                            onClose();
                                                        }}
                                                        title={`Create Level ${opt.slotLevel} Slot: costs ${opt.cost} SP (Requires Sorcerer Lv ${opt.minLevel})\nClick to create slot`}
                                                    >
                                                        <span className="ddb-flyout-slot-num">{roman}</span>
                                                        <span className="ddb-font-magic-sublabel">{opt.cost} SP</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="ddb-bg3-flyout-levels-group">
                                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(lvl => {
                                                const s = featureData.spellSlots[lvl];
                                                if (!s || s.max <= 0) return null;
                                                const rem = Math.max(0, s.max - s.used);
                                                const isExhausted = rem === 0 || featureData.availablePoints >= featureData.maxPoints;
                                                const roman = ROMAN_NUMERALS[lvl - 1] || String(lvl);

                                                return (
                                                    <button
                                                        key={lvl}
                                                        type="button"
                                                        className={`ddb-bg3-flyout-tile slot-tile ${isExhausted ? "exhausted" : ""}`}
                                                        onClick={() => {
                                                            if (isExhausted) return;
                                                            featureData.onConvertSlotToResource?.(lvl);
                                                            onClose();
                                                        }}
                                                        title={`Convert Level ${lvl} Slot: ${rem}/${s.max} remaining\nGrants +${lvl} Sorcery Points\nClick to convert slot`}
                                                    >
                                                        <span className="ddb-flyout-slot-num">{roman}</span>
                                                        <span className="ddb-font-magic-sublabel">+{lvl} SP</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </>
                            );
                        }

                        if (featureData.kind === "harness_divine_power" || featureData.kind === "arcane_recovery") {
                            const isHarness = featureData.kind === "harness_divine_power";
                            const maxSlot = isHarness ? Math.ceil((featureData.proficiencyBonus ?? 2) / 2) : 5;

                            return (
                                <>
                                    <div className="ddb-bg3-flyout-tile base-tile" title={featureData.name}>
                                        <FaWandMagicSparkles size={20} color="#38bdf8" />
                                    </div>
                                    <div className="ddb-bg3-flyout-tile-divider" />
                                    <div className="ddb-bg3-flyout-levels-group">
                                        {[1, 2, 3, 4, 5].filter(lvl => lvl <= maxSlot && featureData.spellSlots[lvl]?.max > 0).map(lvl => {
                                            const s = featureData.spellSlots[lvl];
                                            const isExpended = (s?.used ?? 0) > 0;
                                            const roman = ROMAN_NUMERALS[lvl - 1] || String(lvl);
                                            const canRecover = isExpended && (!isHarness || featureData.availablePoints > 0);

                                            return (
                                                <button
                                                    key={lvl}
                                                    type="button"
                                                    className={`ddb-bg3-flyout-tile slot-tile ${!canRecover ? "exhausted" : ""}`}
                                                    onClick={() => {
                                                        if (!canRecover) return;
                                                        featureData.onRegainExpendedSlot?.(lvl);
                                                        onClose();
                                                    }}
                                                    title={`Level ${lvl}: ${s?.used ?? 0} expended\nClick to regain slot`}
                                                >
                                                    <span className="ddb-flyout-slot-num">{roman}</span>
                                                    <span className={`ddb-flyout-slot-pip normal ${isExpended ? "expended" : "active"}`} />
                                                </button>
                                            );
                                        })}
                                    </div>
                                </>
                            );
                        }

                        const options = featureData.options || [];

                        return (
                            <>
                                <div className="ddb-bg3-flyout-tile base-tile" title={featureData.name}>
                                    {featureData.kind === "focus_points" && <FaHandFist size={20} color="#38bdf8" />}
                                    {featureData.kind === "lay_on_hands" && <FaHandHoldingHeart size={20} color="#4ade80" />}
                                    {featureData.kind === "metamagic" && <FaFireFlameCurved size={20} color="#f59e0b" />}
                                    {featureData.kind === "maneuvers" && <FaShieldHalved size={20} color="#f97316" />}
                                    {featureData.kind === "cunning_strike" && <FaShieldHalved size={20} color="#a855f7" />}
                                    {featureData.kind === "tactical_mind" && <FaWandMagicSparkles size={20} color="#38bdf8" />}
                                    {featureData.kind === "divine_spark" && <FaHandHoldingHeart size={20} color="#fbbf24" />}
                                </div>
                                <div className="ddb-bg3-flyout-tile-divider" />
                                <div className="ddb-bg3-flyout-subchoices-group">
                                    {options.map((opt) => {
                                        const cost = opt.cost ?? 0;
                                        const desc = opt.desc || opt.description || "";
                                        const actionType: "action" | "bonus" | "reaction" | "none" =
                                            opt.actionType === "action" || opt.actionType === "bonus" || opt.actionType === "reaction"
                                                ? opt.actionType
                                                : "none";
                                        const affordable = featureData.availablePoints >= cost;
                                        return (
                                            <button
                                                key={opt.id}
                                                type="button"
                                                className={`ddb-bg3-flyout-tile mode-tile ${!affordable ? "exhausted" : ""}`}
                                                onClick={() => {
                                                    if (!affordable) return;
                                                    featureData.onSpendResourceAction?.(opt.name, cost, desc, actionType);
                                                    onClose();
                                                }}
                                                title={`${opt.name} (${cost} ${featureData.resourceName})\n${desc}\nClick to use`}
                                            >
                                                <span>{opt.name}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </>
                        );
                    })()
                ) : isHex ? (
                    /* ------------------------------------------------------------- */
                    /* CASE A: HEX SPELL WORKFLOW (Ability & Slot unified on bar)    */
                    /* ------------------------------------------------------------- */
                    <>
                        {/* Base Hex Tile */}
                        <div
                            className="ddb-bg3-flyout-tile base-tile hex-base-tile"
                            title="Hex (Level 1 Enchantment)"
                        >
                            <HexHeartIcon size={28} />
                        </div>

                        <div className="ddb-bg3-flyout-tile-divider" />

                        {/* 6 Ability Tiles (STR, DEX, CON, INT, WIS, CHA) */}
                        <div className="ddb-bg3-flyout-abilities-group">
                            {HEX_ABILITIES.map(ability => {
                                const isSelected = chosenAbility === ability.key;
                                const isHovered = hoveredAbility === ability.key;
                                return (
                                    <button
                                        key={ability.key}
                                        type="button"
                                        className={`ddb-bg3-flyout-tile hex-ability-tile ${isSelected ? "selected" : ""} ${isHovered ? "hovered" : ""}`}
                                        onMouseEnter={event => {
                                            const rect = event.currentTarget.getBoundingClientRect();
                                            const width = Math.min(360, window.innerWidth - 16);
                                            const hasRoomAbove = rect.top >= 300;
                                            const left = hasRoomAbove
                                                ? Math.max(8, Math.min(rect.left + rect.width / 2 - width / 2, window.innerWidth - width - 8))
                                                : rect.right + width + 16 <= window.innerWidth
                                                    ? rect.right + 16
                                                    : Math.max(8, rect.left - width - 16);
                                            setTooltipPosition({
                                                left,
                                                top: hasRoomAbove
                                                    ? rect.top - 300
                                                    : Math.max(8, (window.innerHeight - 280) / 2),
                                            });
                                            setHoveredAbility(ability.key);
                                        }}
                                        onMouseLeave={() => setHoveredAbility(null)}
                                        onClick={() => {
                                            if (onSelectHexAbility) {
                                                onSelectHexAbility(ability.key);
                                            }
                                        }}
                                        title={`Hex (${ability.label})\nClick to choose ability`}
                                        aria-label={`Hex ${ability.label}`}
                                    >
                                        <HexAbilityIcon ability={ability.key} size={28} showPlus={false} />
                                        <span className="ddb-hex-ability-short-label">{ability.label.slice(0, 3)}</span>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="ddb-bg3-flyout-tile-divider" />

                        {/* Spell Slot Level Tiles */}
                        <div className="ddb-bg3-flyout-levels-group">
                            {availableLevels.map(lvl => {
                                const isSelected = selectedLevel === lvl;
                                const isPact = isPactLevel(lvl);
                                const rem = getRemainingSlots(lvl);
                                const isExhausted = rem === 0;
                                const roman = ROMAN_NUMERALS[lvl - 1] || String(lvl);

                                return (
                                    <button
                                        key={lvl}
                                        type="button"
                                        className={`ddb-bg3-flyout-tile slot-tile hex-slot-tile ${isSelected ? "selected" : ""} ${isExhausted ? "exhausted" : ""} ${isPact ? "pact" : ""}`}
                                        onClick={() => {
                                            if (rem === 0) return;
                                            onSelectLevel?.(lvl);
                                        }}
                                        onDoubleClick={() => {
                                            if (rem === 0) return;
                                            onSelectLevel?.(lvl);
                                            onCast?.(lvl, chosenAbility);
                                        }}
                                        title={`Level ${lvl} ${isPact ? "(Pact Magic)" : ""}: ${rem} remaining\nClick to select slot (Double-click or Enter to quick-cast)`}
                                        aria-label={`Select level ${lvl} for Hex`}
                                    >
                                        <span className="ddb-flyout-slot-num">{roman}</span>
                                        <span
                                            className={`ddb-flyout-slot-pip ${isPact ? "pact" : "normal"} ${rem > 0 ? "active" : "expended"}`}
                                        />
                                    </button>
                                );
                            })}
                        </div>
                    </>
                ) : spell ? (
                    /* ------------------------------------------------------------- */
                    /* CASE B: STANDARD SPELLS / SUBCHOICES / UPCASTING               */
                    /* ------------------------------------------------------------- */
                    <>
                        {/* 1. Base Spell Icon (Far Left) */}
                        <div
                            className="ddb-bg3-flyout-tile base-tile"
                            title={`${spell.name} (${spell.level === 0 ? "Cantrip" : `Level ${spell.level}`})`}
                        >
                            {isSorcerousBurst ? (
                                <svg viewBox="0 0 100 100" width="28" height="28" className="ddb-burst-swirl-svg" aria-label="Sorcerous Burst">
                                    <defs>
                                        <radialGradient id="burstGrad" cx="50%" cy="50%" r="50%">
                                            <stop offset="0%" stopColor="#ffffff" />
                                            <stop offset="25%" stopColor="#ec4899" />
                                            <stop offset="50%" stopColor="#3b82f6" />
                                            <stop offset="75%" stopColor="#10b981" />
                                            <stop offset="100%" stopColor="#f59e0b" />
                                        </radialGradient>
                                    </defs>
                                    <circle cx="50" cy="50" r="42" fill="url(#burstGrad)" opacity="0.95" />
                                    <path
                                        d="M50 15 A35 35 0 0 1 85 50 A35 35 0 0 1 50 85 A35 35 0 0 1 15 50"
                                        fill="none"
                                        stroke="#ffffff"
                                        strokeWidth="5"
                                        strokeDasharray="16 8"
                                    />
                                </svg>
                            ) : (
                                <img
                                    src={schoolStyle.iconUrl || `https://media.dndbeyond.com/media/spell-school-icons/${(spell.school || "evocation").toLowerCase()}.svg`}
                                    alt={spell.name}
                                    className="ddb-bg3-flyout-school-svg"
                                    onError={e => {
                                        e.currentTarget.style.display = "none";
                                    }}
                                />
                            )}
                        </div>

                        <div className="ddb-bg3-flyout-tile-divider" />

                        {/* 2. Sub-Choice Variant Tiles (e.g. Chromatic Orb elements, Enhance Ability, etc.) */}
                        {hasChoices && damageTypeChoices && (
                            <div className="ddb-bg3-flyout-subchoices-group">
                                {damageTypeChoices.map(choice => {
                                    const meta = DAMAGE_TYPE_META[choice.toLowerCase()] || {
                                        label: choice.toUpperCase(),
                                        color: "#cbd5e1",
                                        border: "#475569",
                                        bg: "#1e293b",
                                    };
                                    const isSelected = currentDamageType === choice.toLowerCase();
                                    const icon = getDamageTypeIcon(choice, 24);

                                    return (
                                        <button
                                            key={choice}
                                            type="button"
                                            className={`ddb-bg3-flyout-tile choice-tile ${isSelected ? "selected" : ""}`}
                                            style={{
                                                background: meta.bg,
                                                borderColor: isSelected ? "#ffffff" : meta.border,
                                                color: meta.color,
                                            }}
                                            onClick={() => {
                                                if (onSelectDamageType) {
                                                    onSelectDamageType(choice);
                                                }
                                            }}
                                            onDoubleClick={() => {
                                                if (onSelectDamageType) {
                                                    onSelectDamageType(choice);
                                                }
                                                onCast?.(selectedLevel, undefined, choice);
                                            }}
                                            title={`Choose ${meta.label} (Double-click to cast)`}
                                            aria-label={`Choose ${meta.label}`}
                                        >
                                            {icon || <span style={{ fontSize: "11px", fontWeight: 800 }}>{meta.label.slice(0, 3)}</span>}
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {/* Divider if spell has both choices and upcasting */}
                        {hasChoices && hasUpcast && (
                            <div className="ddb-bg3-flyout-tile-divider" />
                        )}

                        {/* 3. Slot Level Tiles (e.g. Upcasting: I, II, III...) */}
                        {hasUpcast && (
                            <div className="ddb-bg3-flyout-levels-group">
                                {availableLevels.map(lvl => {
                                    const isSelected = selectedLevel === lvl;
                                    const isPact = isPactLevel(lvl);
                                    const rem = getRemainingSlots(lvl);
                                    const isExhausted = rem === 0;
                                    const isUpcastLevel = lvl > spell.level;
                                    const roman = ROMAN_NUMERALS[lvl - 1] || String(lvl);

                                    return (
                                        <button
                                            key={lvl}
                                            type="button"
                                            className={`ddb-bg3-flyout-tile slot-tile ${isSelected ? "selected" : ""} ${isExhausted ? "exhausted" : ""} ${isPact ? "pact" : ""}`}
                                            onClick={() => {
                                                if (rem === 0) return;
                                                onSelectLevel?.(lvl);
                                            }}
                                            onDoubleClick={() => {
                                                if (rem === 0) return;
                                                onSelectLevel?.(lvl);
                                                onCast?.(lvl, undefined, currentDamageType);
                                            }}
                                            title={`Level ${lvl} ${isPact ? "(Pact Magic)" : ""}: ${rem} remaining\nClick to select slot (Double-click or Enter to quick-cast)`}
                                            aria-label={`Cast at level ${lvl}`}
                                        >
                                            {/* Upcast chevron indicator */}
                                            {isUpcastLevel && (
                                                <span className="ddb-flyout-upcast-chevron" title="Upcast">^</span>
                                            )}

                                            {/* Roman numeral */}
                                            <span className="ddb-flyout-slot-num">{roman}</span>

                                            {/* Slot Pip dot */}
                                            <span
                                                className={`ddb-flyout-slot-pip ${isPact ? "pact" : "normal"} ${rem > 0 ? "active" : "expended"}`}
                                            />
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </>
                ) : null}
            </div>

            {/* Footer hint: ESC / Right-Click to cancel aiming • Enter to Quick-Cast */}
            <div className="ddb-bg3-flyout-hint">
                <span>
                    {weaponData ? (
                        <>Click map to attack • <kbd>ESC</kbd> / <kbd>Right-Click</kbd> to cancel aiming</>
                    ) : (
                        <>Click map to cast • <kbd>ESC</kbd> / <kbd>Right-Click</kbd> to cancel • <kbd>Enter</kbd> to Quick-Cast</>
                    )}
                </span>
            </div>
        </div>
    );
};
