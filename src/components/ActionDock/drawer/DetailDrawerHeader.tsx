import React from "react";
import { getOrdinal } from "../../../assets/spellInfo";
import type { DetailDrawerItem } from "../domain/types";

export interface DetailDrawerHeaderProps {
    item: NonNullable<DetailDrawerItem>;
    characterName: string;
    attunedCount: number;
    onClose: () => void;
}

export const DetailDrawerHeader: React.FC<DetailDrawerHeaderProps> = ({ item, characterName, attunedCount, onClose }) => (
    <div className="ddb-drawer-header">
        <div className="ddb-drawer-header-top">
            <span className="ddb-drawer-category">
                {item.type === "feature"
                    ? (item.category || "Feature Action")
                    : item.type === "weapon"
                    ? (item.weapon.type === "melee" ? "Melee Weapon" : "Ranged Weapon")
                    : item.type === "spell"
                    ? (item.spell.level === 0 ? "Cantrip" : `${getOrdinal(item.spell.level)} Level • ${item.spell.school}`)
                    : item.type === "item"
                    ? "Inventory Item"
                    : item.type === "checks"
                    ? "Ability Checks & Saves"
                    : item.type === "ac"
                    ? "Armor Class"
                    : item.type === "hp"
                    ? "Hit Points"
                    : item.type === "log"
                    ? "D&D Beyond Game Log"
                    : "Defenses"}
            </span>
            <button type="button" className="ddb-drawer-close-btn" onClick={onClose} title="Close Drawer">✕</button>
        </div>
        <h3 className="ddb-drawer-title">
            {item.type === "feature"
                ? item.name
                : item.type === "weapon"
                ? item.weapon.name
                : item.type === "spell"
                ? item.spell.name
                : item.type === "item"
                ? item.item.name
                : item.type === "checks"
                ? "Character Checks & Saves"
                : item.type === "ac"
                ? `Armor Class: ${item.ac}`
                : item.type === "hp"
                ? `Hit Points: ${item.current} / ${item.max}`
                : item.type === "log"
                ? `Game Log • ${characterName}`
                : "Defenses & Resistances"}
        </h3>
        {item.type === "item" && (
            <div className="ddb-drawer-meta-row">
                <span className="ddb-drawer-badge">Qty: {item.item.quantity}</span>
                <span className="ddb-drawer-badge">{item.item.type || "Gear"}</span>
                <span className="ddb-drawer-badge">{item.item.rarity || "Common"}</span>
                {item.item.weight > 0 && <span className="ddb-drawer-badge">{item.item.weight} lb</span>}
                {item.item.cost !== null && item.item.cost !== undefined && <span className="ddb-drawer-badge">{item.item.cost} GP</span>}
                {item.item.isAttuned && <span className="ddb-drawer-badge attuned">Attuned ({attunedCount}/3)</span>}
                {!item.item.isAttuned && (item.item.canAttune || item.item.requiresAttunement) && <span className="ddb-drawer-badge can-attune">Requires Attunement</span>}
            </div>
        )}
        {item.type === "feature" && (
            <div className="ddb-drawer-meta-row">
                <span className="ddb-drawer-badge">
                    Action: {item.activationType === "bonus" ? "1 Bonus Action" : item.activationType === "reaction" ? "Reaction" : item.activationType === "action" ? "1 Action" : "Special"}
                </span>
                {item.rangeText && !item.rangeText.startsWith("--") && <span className="ddb-drawer-badge">Range: {item.rangeText}</span>}
            </div>
        )}
        {item.type === "weapon" && (
            <div className="ddb-drawer-meta-row">
                <span className="ddb-drawer-badge">To Hit: +{item.weapon.toHit}</span>
                <span className="ddb-drawer-badge">Range: {item.weapon.rangeText}</span>
                <span className="ddb-drawer-badge">Damage: {item.weapon.damage} {item.weapon.damageType}</span>
            </div>
        )}
        {item.type === "spell" && (
            <div className="ddb-drawer-meta-row">
                <span className="ddb-drawer-badge">Time: {item.spell.castingTime}</span>
                <span className="ddb-drawer-badge">Range: {item.spell.rangeText}</span>
                {item.spell.hitOrDc && <span className="ddb-drawer-badge">{item.spell.hitOrDc}</span>}
            </div>
        )}
    </div>
);
