import React from "react";
import type { DDBWeaponAttack } from "../../../types/ddb";
import type { DockSpell } from "../domain/types";
import type { WeaponTableRowProps } from "./WeaponTableRow";
import type { AttackSpellTableRowProps } from "./AttackSpellTableRow";
import { WeaponTableRow } from "./WeaponTableRow";
import { AttackSpellTableRow } from "./AttackSpellTableRow";

export interface AttackActionsTableProps {
    weapons: DDBWeaponAttack[];
    spells: DockSpell[];
    activeRiderMap: Record<string, string | null | undefined>;
    selectedSpellId: string | null;
    damageTypeOverrides: Record<string, string>;
    upcastPickerSpellId: string | null;
    onSelectWeapon: WeaponTableRowProps["onSelectWeapon"];
    onWeaponAttackRoll: WeaponTableRowProps["onAttackRoll"];
    onWeaponDamageRoll: WeaponTableRowProps["onDamageRoll"];
    onRiderClick: WeaponTableRowProps["onRiderClick"];
    onOpenWeaponDetails: WeaponTableRowProps["onOpenDetails"];
    onSelectSpell: AttackSpellTableRowProps["onSelect"];
    onOpenSpellDetails: AttackSpellTableRowProps["onOpenDetails"];
    onSpellAttackRoll: AttackSpellTableRowProps["onAttackRoll"];
    onSpellDamageRoll: AttackSpellTableRowProps["onDamageRoll"];
    onOpenUpcastPicker: AttackSpellTableRowProps["onOpenUpcastPicker"];
    renderUpcastPickerRow: AttackSpellTableRowProps["renderUpcastPickerRow"];
}

export const AttackActionsTable: React.FC<AttackActionsTableProps> = ({
    weapons,
    spells,
    activeRiderMap,
    selectedSpellId,
    damageTypeOverrides,
    upcastPickerSpellId,
    onSelectWeapon,
    onWeaponAttackRoll,
    onWeaponDamageRoll,
    onRiderClick,
    onOpenWeaponDetails,
    onSelectSpell,
    onOpenSpellDetails,
    onSpellAttackRoll,
    onSpellDamageRoll,
    onOpenUpcastPicker,
    renderUpcastPickerRow,
}) => (
    <table className="ddb-action-table">
        <thead>
            <tr>
                <th className="th-attack">ATTACK</th>
                <th className="th-range">RANGE</th>
                <th className="th-hit">HIT / DC</th>
                <th className="th-damage">DAMAGE</th>
                <th className="th-notes">NOTES</th>
            </tr>
        </thead>
        <tbody>
            {weapons.map(weapon => (
                <WeaponTableRow
                    key={weapon.id}
                    weapon={weapon}
                    activeRider={activeRiderMap[weapon.id]}
                    onSelectWeapon={onSelectWeapon}
                    onAttackRoll={onWeaponAttackRoll}
                    onDamageRoll={onWeaponDamageRoll}
                    onRiderClick={onRiderClick}
                    onOpenDetails={onOpenWeaponDetails}
                />
            ))}
            {spells.map(spell => (
                <AttackSpellTableRow
                    key={spell.id}
                    spell={spell}
                    isSelected={selectedSpellId === spell.id}
                    damageTypeOverride={damageTypeOverrides[spell.id]}
                    upcastPickerSpellId={upcastPickerSpellId}
                    onSelect={onSelectSpell}
                    onOpenDetails={onOpenSpellDetails}
                    onAttackRoll={onSpellAttackRoll}
                    onDamageRoll={onSpellDamageRoll}
                    onOpenUpcastPicker={onOpenUpcastPicker}
                    renderUpcastPickerRow={renderUpcastPickerRow}
                />
            ))}
        </tbody>
    </table>
);
