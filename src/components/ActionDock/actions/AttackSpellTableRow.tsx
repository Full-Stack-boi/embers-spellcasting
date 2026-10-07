import React from "react";
import { getSchoolStyle, getSpellInitials, getSpellMetadata, isSpellUpcastable } from "../../../assets/spellInfo";
import { IconCastLightning, IconFire } from "../shared/Bg3Icons";
import type { DockSpell } from "../domain/types";

export interface AttackSpellTableRowProps {
    spell: DockSpell;
    isSelected: boolean;
    damageTypeOverride?: string;
    upcastPickerSpellId: string | null;
    onSelect: (spell: DockSpell) => void;
    onOpenDetails: (spell: DockSpell) => void;
    onAttackRoll: (spell: DockSpell) => void;
    onDamageRoll: (spell: DockSpell) => void;
    onOpenUpcastPicker: (spell: DockSpell) => void;
    renderUpcastPickerRow: (spell: DockSpell, colSpan: number) => React.ReactNode;
}

export const AttackSpellTableRow: React.FC<AttackSpellTableRowProps> = ({
    spell,
    isSelected,
    damageTypeOverride,
    upcastPickerSpellId,
    onSelect,
    onOpenDetails,
    onAttackRoll,
    onDamageRoll,
    onOpenUpcastPicker,
    renderUpcastPickerRow,
}) => {
    const meta = getSpellMetadata(spell.id, spell.name);
    const schoolStyle = getSchoolStyle(meta.school);
    const initials = getSpellInitials(meta.name);
    const isUpcastable = isSpellUpcastable(spell.id, meta);
    const damageType = damageTypeOverride ?? spell.damageType;

    return (
        <React.Fragment>
            <tr
                className={`ddb-table-row spell-row ${isSelected ? "selected" : ""}`}
                onClick={() => onSelect(spell)}
                onContextMenu={event => {
                    event.preventDefault();
                    onOpenDetails(spell);
                }}
            >
                <td className="td-attack">
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
                    </div>
                </td>
                <td className="td-range">{spell.rangeText}</td>
                <td className="td-hit">
                    {spell.hitOrDc ? (
                        <button type="button" className="ddb-roll-pill hit-pill" onClick={event => { event.stopPropagation(); onAttackRoll(spell); }} title={`Roll or Announce: ${spell.hitOrDc}`}>
                            <span>{spell.hitOrDc}</span>
                        </button>
                    ) : <span className="ddb-na-dash">—</span>}
                </td>
                <td className="td-damage">
                    {spell.damage ? (
                        <button type="button" className="ddb-roll-pill dmg-pill" onClick={event => { event.stopPropagation(); onDamageRoll(spell); }} title={`Roll Damage: ${spell.damage} ${damageType || ""}`}>
                            <IconFire size={11} />
                            <span>{spell.damage}</span>
                            {damageType && <span className="ddb-type-text">{damageType}</span>}
                        </button>
                    ) : <span className="ddb-na-dash">—</span>}
                </td>
                <td className="td-notes">
                    <div className="ddb-notes-cell">
                        <span>{spell.notes}</span>
                        <button type="button" className="ddb-cast-action-btn" onClick={event => { event.stopPropagation(); onOpenUpcastPicker(spell); }} title={`Cast ${spell.name} on OBR`}>
                            <IconCastLightning size={12} />
                            <span>{upcastPickerSpellId === spell.id ? "Close" : "Cast"}</span>
                        </button>
                    </div>
                </td>
            </tr>
            {upcastPickerSpellId === spell.id && renderUpcastPickerRow(spell, 5)}
        </React.Fragment>
    );
};
