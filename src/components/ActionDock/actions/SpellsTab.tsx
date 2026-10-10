import React from "react";
import { getSchoolStyle, getSpellInitials, getSpellMetadata, isSpellUpcastable } from "../../../assets/spellInfo";
import { IconCastLightning, IconFire, IconSearch, IconSpellInfo } from "../shared/Bg3Icons";
import type { DockSpell, SpellGroup, SpellsFilter } from "../domain/types";

const SPELL_FILTERS: SpellsFilter[] = ["ALL", "0", "1", "2", "PACT", "3+"];

export interface SpellsTabProps {
    abilityModifier: number;
    spellAbility: string;
    spellAttackBonus: number;
    hasSpellAdvantage: boolean;
    spellSaveDcLabel: string;
    spellSaveDcBonus: number;
    filter: SpellsFilter;
    onFilterChange: (filter: SpellsFilter) => void;
    search: string;
    onSearchChange: (search: string) => void;
    groups: SpellGroup[];
    selectedSpellId: string | null;
    damageTypeOverrides: Record<string, string>;
    upcastPickerSpellId: string | null;
    onSelectSpell: (spell: DockSpell) => void;
    onContextMenuSpell: (spell: DockSpell) => void;
    onOpenSpellDetails: (spell: DockSpell) => void;
    onAttackRoll: (spell: DockSpell) => void;
    onDamageRoll: (spell: DockSpell) => void;
    onOpenUpcastPicker: (spell: DockSpell) => void;
    renderUpcastPickerRow: (spell: DockSpell, colSpan: number) => React.ReactNode;
    hasPactMagic?: boolean;
}

export const SpellsTab: React.FC<SpellsTabProps> = ({
    abilityModifier,
    spellAbility,
    spellAttackBonus,
    hasSpellAdvantage,
    spellSaveDcLabel,
    spellSaveDcBonus,
    filter,
    onFilterChange,
    search,
    onSearchChange,
    groups,
    selectedSpellId,
    damageTypeOverrides,
    upcastPickerSpellId,
    onSelectSpell,
    onContextMenuSpell,
    onOpenSpellDetails,
    onAttackRoll,
    onDamageRoll,
    onOpenUpcastPicker,
    renderUpcastPickerRow,
    hasPactMagic = false,
}) => {
    const spellFilters = hasPactMagic ? SPELL_FILTERS : SPELL_FILTERS.filter(value => value !== "PACT");
    return (
    <div className="ddb-tab-panel spells-panel">
        <div className="ddb-spells-top-stats-banner">
            <div className="ddb-stat-box">
                <span className="ddb-stat-num">+{abilityModifier}</span>
                <span className="ddb-stat-tag">MODIFIER ({spellAbility})</span>
            </div>
            <div className="ddb-stat-box">
                <span className="ddb-stat-num">
                    +{spellAttackBonus}
                    {hasSpellAdvantage && <span className="ddb-buff-badge-tag" title="Advantage on spell attacks">ADV</span>}
                </span>
                <span className="ddb-stat-tag">SPELL ATTACK</span>
            </div>
            <div className="ddb-stat-box">
                <span className="ddb-stat-num">
                    {spellSaveDcLabel}
                    {spellSaveDcBonus > 0 && <span className="ddb-buff-badge-tag" title={`+${spellSaveDcBonus} DC from active buff`}>+{spellSaveDcBonus}</span>}
                </span>
                <span className="ddb-stat-tag">SAVE DC</span>
            </div>
        </div>

        <div className="ddb-spells-filter-search-row">
            <div className="ddb-subfilter-bar">
                {spellFilters.map(value => (
                    <button
                        key={value}
                        type="button"
                        className={`ddb-subfilter-btn ${filter === value ? "active" : ""}`}
                        onClick={() => onFilterChange(value)}
                    >
                        {value === "0" ? "- 0 -" : value === "1" ? "1ST" : value === "2" ? "2ND" : value}
                    </button>
                ))}
            </div>
            <div className="ddb-search-wrap">
                <IconSearch size={12} className="ddb-search-icon" />
                <input
                    type="text"
                    className="ddb-search-input"
                    placeholder="Search spells..."
                    value={search}
                    onChange={event => onSearchChange(event.target.value)}
                />
            </div>
        </div>

        <div className="ddb-table-scroll-container">
            <table className="ddb-action-table spells-table">
                <thead>
                    <tr>
                        <th className="th-name">NAME</th>
                        <th className="th-time">TIME</th>
                        <th className="th-range">RANGE</th>
                        <th className="th-hit">HIT / DC</th>
                        <th className="th-effect">EFFECT</th>
                        <th className="th-notes">NOTES</th>
                        <th className="th-cast">CAST</th>
                    </tr>
                </thead>
                <tbody>
                    {groups.length === 0 ? (
                        <tr>
                            <td colSpan={7} style={{ textAlign: "center", padding: "16px", color: "#6b7280" }}>No spells found</td>
                        </tr>
                    ) : groups.map(group => (
                        <React.Fragment key={group.label}>
                            <tr className="ddb-spell-group-row">
                                <td colSpan={7} className="ddb-spell-group-cell"><div className="ddb-spell-group-label">{group.label}</div></td>
                            </tr>
                            {group.spells.map(spell => {
                                const isSelected = selectedSpellId === spell.id;
                                const meta = getSpellMetadata(spell.id, spell.name);
                                const schoolStyle = getSchoolStyle(meta.school);
                                const initials = getSpellInitials(meta.name);
                                const isUpcastable = isSpellUpcastable(spell.id, meta);

                                return (
                                    <React.Fragment key={spell.id}>
                                        <tr
                                            className={`ddb-table-row spell-row ${isSelected ? "selected" : ""}`}
                                            onClick={() => onSelectSpell(spell)}
                                            onContextMenu={event => {
                                                event.preventDefault();
                                                onContextMenuSpell(spell);
                                            }}
                                        >
                                            <td className="td-name">
                                                <div className="ddb-spell-cell">
                                                    <span className="ddb-mini-school-badge" style={{ borderColor: schoolStyle.color, color: schoolStyle.color }}>
                                                        <img
                                                            src={schoolStyle.iconUrl || `https://media.dndbeyond.com/media/spell-school-icons/${(meta.school || spell.school || "evocation").toLowerCase()}.svg`}
                                                            alt=""
                                                            className="ddb-mini-school-svg"
                                                            onError={event => {
                                                                event.currentTarget.style.display = "none";
                                                                if (event.currentTarget.parentElement) event.currentTarget.parentElement.innerText = initials;
                                                            }}
                                                        />
                                                    </span>
                                                    <span className="ddb-spell-title">{spell.name}</span>
                                                    {isUpcastable && <span className="ddb-upcast-tag">+</span>}
                                                    {spell.isPrepared && <span className="ddb-prep-pip" title="Prepared">✦</span>}
                                                </div>
                                            </td>
                                            <td className="td-time">{spell.castingTime}</td>
                                            <td className="td-range">{spell.rangeText}</td>
                                            <td className="td-hit">
                                                {spell.hitOrDc ? (
                                                    <button type="button" className="ddb-roll-pill hit-pill" onClick={event => { event.stopPropagation(); onAttackRoll(spell); }} title={`Roll: ${spell.hitOrDc}`}>
                                                        <span>{spell.hitOrDc}</span>
                                                    </button>
                                                ) : <span className="ddb-na-dash">—</span>}
                                            </td>
                                            <td className="td-effect">
                                                {spell.damage ? (
                                                    <button type="button" className="ddb-roll-pill dmg-pill" onClick={event => { event.stopPropagation(); onDamageRoll(spell); }} title={`Roll: ${spell.damage}`}>
                                                        <IconFire size={11} />
                                                        <span>{spell.damage}</span>
                                                        {damageTypeOverrides[spell.id] && <span className="ddb-type-text">{damageTypeOverrides[spell.id]}</span>}
                                                    </button>
                                                ) : <span className="ddb-effect-desc">Control/Utility</span>}
                                            </td>
                                            <td className="td-notes"><span className="ddb-notes-text">{spell.notes}</span></td>
                                            <td className="td-cast">
                                                <div className="ddb-cast-cell-actions">
                                                    <button type="button" className="ddb-quick-cast-btn" onClick={event => { event.stopPropagation(); onOpenUpcastPicker(spell); }} title={`Cast ${spell.name}`}>
                                                        <IconCastLightning size={12} />
                                                        <span>{upcastPickerSpellId === spell.id ? "Close" : "Cast"}</span>
                                                    </button>
                                                    <button type="button" className="ddb-info-btn" onClick={event => { event.stopPropagation(); onOpenSpellDetails(spell); }} title="Spell Details">
                                                        <IconSpellInfo size={13} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        {upcastPickerSpellId === spell.id && renderUpcastPickerRow(spell, 6)}
                                    </React.Fragment>
                                );
                            })}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
    );
};
