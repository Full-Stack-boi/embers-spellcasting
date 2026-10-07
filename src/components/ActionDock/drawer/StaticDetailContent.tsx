import React from "react";
import type { DDBParsedCharacter, DDBWeaponAttack } from "../../../types/ddb";
import CharacterChecks from "../../CharacterChecks/CharacterChecks";
import { parseRiderString } from "../domain/riders";
import type { DetailDrawerItem } from "../domain/types";

interface StaticDetailContentProps {
    item: NonNullable<DetailDrawerItem>;
    character: DDBParsedCharacter | null;
    activeRiderMap: Record<string, string | null | undefined>;
    onRiderClick: (weapon: DDBWeaponAttack, rider: ReturnType<typeof parseRiderString>) => void;
}

export const StaticDetailContent: React.FC<StaticDetailContentProps> = ({ item, character, activeRiderMap, onRiderClick }) => {
    if (item.type === "weapon") {
        return (
            <div className="ddb-drawer-weapon-content">
                <p className="ddb-drawer-para"><strong>Properties:</strong> {item.weapon.properties.join(", ") || "None"}</p>
                {item.weapon.cantripRiders && item.weapon.cantripRiders.length > 0 && (
                    <div className="ddb-drawer-riders-section">
                        <h4 className="ddb-drawer-subtitle">Weapon Cantrip Riders</h4>
                        <div className="ddb-rider-chips-wrap">
                            {item.weapon.cantripRiders.map((rider, index) => {
                                const parsed = parseRiderString(rider);
                                const isSelected = activeRiderMap[item.weapon.id] === parsed.name;
                                return (
                                    <button
                                        key={index}
                                        type="button"
                                        className={`ddb-rider-pill ${isSelected ? "selected" : ""}`}
                                        onClick={() => onRiderClick(item.weapon, parsed)}
                                    >
                                        <span className="rider-icon">{parsed.icon}</span>
                                        <span className="rider-label">{parsed.name}: {parsed.damage}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    if (item.type === "ac") {
        return (
            <div className="ddb-drawer-ac-content">
                <ul className="ddb-ac-breakdown-list">
                    {item.breakdown.map((entry, index) => (
                        <li key={index}><strong>{entry.value}</strong> <span>{entry.label}</span></li>
                    ))}
                </ul>
                <p className="ddb-ac-explanation">{item.description}</p>
            </div>
        );
    }

    if (item.type === "defenses") {
        return (
            <div className="ddb-drawer-defenses-content">
                <h4 className="ddb-drawer-subtitle">Resistances</h4>
                <p className="ddb-drawer-para">{item.resistances.length > 0 ? item.resistances.join(", ") : "None"}</p>
                <h4 className="ddb-drawer-subtitle">Damage Immunities</h4>
                <p className="ddb-drawer-para">{item.immunities.length > 0 ? item.immunities.join(", ") : "None"}</p>
                <h4 className="ddb-drawer-subtitle">Condition Immunities</h4>
                <p className="ddb-drawer-para">{item.vulnerabilities.length > 0 ? item.vulnerabilities.join(", ") : "None"}</p>
            </div>
        );
    }

    if (item.type === "item") {
        return (
            <div className="ddb-drawer-item-content">
                <h4 className="ddb-drawer-subtitle">{item.item.type || "Gear"}</h4>
                <p className="ddb-drawer-para">{item.item.description || "No description provided."}</p>
            </div>
        );
    }

    if (item.type === "checks") {
        return <div className="ddb-drawer-checks-embed"><CharacterChecks passedChar={character} /></div>;
    }

    return null;
};
