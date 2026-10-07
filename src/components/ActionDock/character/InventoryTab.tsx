import React from "react";
import { IconSearch } from "../shared/Bg3Icons";
import type { DDBParsedCharacter, DDBInventoryItem } from "../../../types/ddb";
import type { InventoryFilter } from "../domain/types";

const INVENTORY_FILTERS: InventoryFilter[] = ["ALL", "EQUIPPED", "ATTUNED", "WEAPONS", "ARMOR", "GEAR"];

export interface InventoryTabProps {
    character: DDBParsedCharacter | null;
    attunedCount: number;
    totalWeight: number;
    maxCarryWeight: number;
    filter: InventoryFilter;
    onFilterChange: (filter: InventoryFilter) => void;
    search: string;
    onSearchChange: (search: string) => void;
    items: DDBInventoryItem[];
    onSelectItem: (item: DDBInventoryItem) => void;
}

export const InventoryTab: React.FC<InventoryTabProps> = ({
    character,
    attunedCount,
    totalWeight,
    maxCarryWeight,
    filter,
    onFilterChange,
    search,
    onSearchChange,
    items,
    onSelectItem,
}) => (
    <div className="ddb-tab-content-panel ddb-inventory-panel">
        <div className="ddb-inv-summary-bar">
            <div className="ddb-currencies-row">
                <span className="ddb-curr-pill pp"><strong className="lbl">PP</strong> {character?.currencies?.pp ?? 0}</span>
                <span className="ddb-curr-pill gp"><strong className="lbl">GP</strong> {character?.currencies?.gp ?? 0}</span>
                <span className="ddb-curr-pill ep"><strong className="lbl">EP</strong> {character?.currencies?.ep ?? 0}</span>
                <span className="ddb-curr-pill sp"><strong className="lbl">SP</strong> {character?.currencies?.sp ?? 0}</span>
                <span className="ddb-curr-pill cp"><strong className="lbl">CP</strong> {character?.currencies?.cp ?? 0}</span>
            </div>
            <div className="ddb-inv-meta-trackers">
                <div className="ddb-attunement-tracker" title="Attunement / Augment (D&D 5e: Max 3 items)">
                    <span className="ddb-attune-lbl">ATTUNED:</span>
                    <span className="ddb-attune-val">{attunedCount} / 3</span>
                    <div className="ddb-attune-pips">
                        {[0, 1, 2].map(index => (
                            <span
                                key={index}
                                className={`ddb-attune-pip ${index < attunedCount ? "filled" : ""}`}
                                title={index < attunedCount ? `Attunement Slot ${index + 1} (Occupied)` : `Attunement Slot ${index + 1} (Available)`}
                            />
                        ))}
                    </div>
                </div>
                <div className="ddb-weight-tracker">
                    <span className="ddb-weight-lbl">WEIGHT:</span>
                    <span className="ddb-weight-val">{totalWeight.toFixed(1)} / {maxCarryWeight} lb.</span>
                </div>
            </div>
        </div>

        <div className="ddb-actions-filter-search-row">
            <div className="ddb-subfilter-tabs">
                {INVENTORY_FILTERS.map(value => (
                    <button
                        key={value}
                        type="button"
                        className={`ddb-subfilter-btn ${filter === value ? "active" : ""}`}
                        onClick={() => onFilterChange(value)}
                    >
                        {value}
                    </button>
                ))}
            </div>
            <div className="ddb-actions-search-wrap">
                <IconSearch size={12} className="ddb-search-input-icon" />
                <input
                    type="text"
                    className="ddb-actions-search-input"
                    placeholder="Search inventory..."
                    value={search}
                    onChange={event => onSearchChange(event.target.value)}
                />
                {search && (
                    <button type="button" className="ddb-search-clear-btn" onClick={() => onSearchChange("")} title="Clear search">
                        ✕
                    </button>
                )}
            </div>
        </div>

        <div className="ddb-actions-list-panel">
            {items.length > 0 ? (
                <table className="ddb-weapons-table ddb-inventory-table">
                    <thead>
                        <tr>
                            <th className="th-equipped">STATUS</th>
                            <th className="th-name">ITEM</th>
                            <th className="th-type">TYPE</th>
                            <th className="th-qty">QTY</th>
                            <th className="th-weight">WEIGHT</th>
                            <th className="th-cost">COST</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(item => (
                            <tr
                                key={item.id}
                                className="ddb-table-row item-row"
                                onClick={() => onSelectItem(item)}
                                title="Click to view details"
                            >
                                <td className="td-equipped">
                                    <div className="ddb-status-badges-stack">
                                        {item.equipped ? <span className="ddb-equipped-badge">EQUIPPED</span> : <span className="ddb-unequipped-dot">—</span>}
                                        {item.isAttuned && <span className="ddb-attuned-badge" title="Attuned (Augment)">ATTUNED</span>}
                                        {!item.isAttuned && (item.canAttune || item.requiresAttunement) && <span className="ddb-can-attune-badge" title="Requires Attunement">ATTUNE</span>}
                                    </div>
                                </td>
                                <td className="td-name">
                                    <span className="ddb-item-name">{item.name}</span>
                                    {item.rarity && item.rarity !== "Common" && <span className={`ddb-rarity-tag ${item.rarity.toLowerCase()}`}>{item.rarity}</span>}
                                </td>
                                <td className="td-type">{item.type || "Gear"}</td>
                                <td className="td-qty">×{item.quantity}</td>
                                <td className="td-weight">{item.weight > 0 ? `${item.weight} lb` : "—"}</td>
                                <td className="td-cost">{item.cost !== null && item.cost !== undefined ? `${item.cost} GP` : "—"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="ddb-empty-search-state">
                    <IconSearch size={22} className="ddb-empty-search-icon" />
                    <span className="ddb-empty-search-text">No items found</span>
                </div>
            )}
        </div>
    </div>
);
