import React from "react";
import type { DDBWeaponAttack } from "../../../types/ddb";
import { IconDiceD20, IconFire, getWeaponIcon } from "../shared/Bg3Icons";
import { parseRiderString } from "../domain/riders";
import { combineDamageBonus } from "../../../utils/dice";

import type { ResolvedWeaponRiders } from "../../../services/weaponDamageRiders";

export type WeaponAimMode = "melee" | "thrown";

export interface WeaponTableRowProps {
    weapon: DDBWeaponAttack;
    activeRider?: string | null;
    resolvedRiders?: ResolvedWeaponRiders;
    selectedRiderChoice?: string;
    effectiveBonusDamage?: number;
    onSelectRiderChoice?: (choice: string) => void;
    onSelectWeapon: (weapon: DDBWeaponAttack, mode: WeaponAimMode) => void;
    onAttackRoll: (weapon: DDBWeaponAttack) => void;
    onDamageRoll: (weapon: DDBWeaponAttack, rider?: string | null) => void;
    onRiderClick: (weapon: DDBWeaponAttack, rider: ReturnType<typeof parseRiderString>) => void;
    onOpenDetails: (weapon: DDBWeaponAttack) => void;
}

export const WeaponTableRow: React.FC<WeaponTableRowProps> = ({
    weapon,
    activeRider,
    resolvedRiders,
    selectedRiderChoice,
    effectiveBonusDamage = 0,
    onSelectRiderChoice,
    onSelectWeapon,
    onAttackRoll,
    onDamageRoll,
    onRiderClick,
    onOpenDetails,
}) => {
    const riders = (weapon.cantripRiders || []).map(parseRiderString);
    const totalBonus = (typeof effectiveBonusDamage === "number" && effectiveBonusDamage > 0 ? effectiveBonusDamage : 0) + (resolvedRiders?.flatBonus ?? 0);
    const baseDamageFormula = combineDamageBonus(weapon.damage, totalBonus);
    const riderChoiceInfo = resolvedRiders?.availableRiderChoice;
    const isRiderActive = Boolean(riderChoiceInfo && selectedRiderChoice && selectedRiderChoice !== "none");
    const activeDiceRider = resolvedRiders?.activeDiceRiders.find(r => r.id === riderChoiceInfo?.riderId);
    const riderBonusNum = activeDiceRider?.bonus ?? (riderChoiceInfo?.flatBonus ?? 0);
    const riderBonusStr = riderBonusNum > 0 ? `+${riderBonusNum}` : "";
    const riderTag = isRiderActive && riderChoiceInfo
        ? `+${riderChoiceInfo.bonusDice}${riderBonusStr} ${(selectedRiderChoice || "").slice(0, 3)}`
        : "";

    return (
        <tr
            className="ddb-table-row weapon-row"
            onClick={() => {
                onSelectWeapon(weapon, "melee");
                onOpenDetails(weapon);
            }}
            title="Click to aim with weapon & view details"
        >
            <td className="td-attack">
                <div className="ddb-weapon-cell">
                    <span className="ddb-mini-weapon-badge">{getWeaponIcon(weapon.name, weapon.type, 13)}</span>
                    <span className="ddb-weapon-name">{weapon.name}</span>
                    {weapon.type && <span className="ddb-weapon-tag">{weapon.type}</span>}
                </div>
            </td>
            <td className="td-range" onClick={event => event.stopPropagation()}>
                {weapon.hasThrown ? (
                    <div className="ddb-range-stacked">
                        <button type="button" className="ddb-range-badge reach" onClick={() => onSelectWeapon(weapon, "melee")} title="Melee Reach (5 ft.) - Click to Aim">
                            5 ft. Reach
                        </button>
                        <button type="button" className="ddb-range-badge thrown" onClick={() => onSelectWeapon(weapon, "thrown")} title={`Thrown Range (${weapon.thrownRange || 20}/${weapon.thrownLongRange || 60} ft.) - Click to Aim`}>
                            {weapon.thrownRange || 20} ({weapon.thrownLongRange || 60})
                        </button>
                    </div>
                ) : (
                    <span className="ddb-range-clickable" onClick={() => onSelectWeapon(weapon, "melee")} title="Melee Reach (5 ft.) - Click to Aim">
                        {weapon.rangeText}
                    </span>
                )}
            </td>
            <td className="td-hit" onClick={event => event.stopPropagation()}>
                <button type="button" className="ddb-roll-pill hit-pill" onClick={() => onAttackRoll(weapon)} title={`Roll Attack: 1d20 + ${weapon.toHit}`}>
                    <IconDiceD20 size={11} />
                    <span>+{weapon.toHit}</span>
                </button>
            </td>
            <td className="td-damage" onClick={event => event.stopPropagation()}>
                <button
                    type="button"
                    className="ddb-roll-pill dmg-pill"
                    onClick={() => onDamageRoll(weapon, activeRider)}
                    title={`Roll Damage: ${baseDamageFormula} ${weapon.damageType}${isRiderActive ? ` (${riderTag})` : ""}${activeRider ? ` (+ ${activeRider})` : ""}`}
                >
                    <IconFire size={11} />
                    <span>{baseDamageFormula}</span>
                    <span className="ddb-type-text">
                        {weapon.damageType}
                        {isRiderActive && ` • ${riderTag}`}
                    </span>
                </button>
            </td>
            <td className="td-notes" onClick={event => event.stopPropagation()}>
                {weapon.properties.length > 0 && <span className="ddb-prop-list">{weapon.properties.join(", ")}</span>}
                {riderChoiceInfo && (
                    <div className="ddb-fury-chips-wrap">
                        <span className="ddb-fury-label">{riderChoiceInfo.riderName}:</span>
                        <button
                            type="button"
                            className={`ddb-fury-pill ${(!selectedRiderChoice || selectedRiderChoice === "none") ? "selected" : ""}`}
                            onClick={() => onSelectRiderChoice?.("none")}
                            title={`${riderChoiceInfo.riderName}: Off`}
                        >
                            None
                        </button>
                        {riderChoiceInfo.choices.map(choice => {
                            const isSelected = (selectedRiderChoice || riderChoiceInfo.currentChoice) === choice && selectedRiderChoice !== "none";
                            const choiceCap = choice.charAt(0).toUpperCase() + choice.slice(1);
                            const bonusStr = riderChoiceInfo.flatBonus > 0 ? `+${riderChoiceInfo.flatBonus}` : "";
                            return (
                                <button
                                    key={choice}
                                    type="button"
                                    className={`ddb-fury-pill ${choice.toLowerCase()} ${isSelected ? "selected" : ""}`}
                                    onClick={() => onSelectRiderChoice?.(isSelected ? "none" : choice)}
                                    title={`${riderChoiceInfo.riderName}: +${riderChoiceInfo.bonusDice}${bonusStr} ${choiceCap} damage`}
                                >
                                    {choiceCap} (+{riderChoiceInfo.bonusDice}{bonusStr})
                                </button>
                            );
                        })}
                    </div>
                )}
                {riders.length > 0 && (
                    <div className="ddb-rider-chips-wrap">
                        {riders.map((rider, index) => (
                            <button
                                key={index}
                                type="button"
                                className={`ddb-rider-pill ${activeRider === rider.name ? "selected" : ""}`}
                                onClick={() => onRiderClick(weapon, rider)}
                                title={`Add ${rider.name} (${rider.damage}): Click to roll combined damage & target with spell`}
                            >
                                <span className="rider-icon">{rider.icon}</span>
                                <span className="rider-label">{rider.name}: {rider.damage}</span>
                                {rider.moveTrigger && <span className="rider-trigger">({rider.moveTrigger})</span>}
                            </button>
                        ))}
                    </div>
                )}
            </td>
        </tr>
    );
};
