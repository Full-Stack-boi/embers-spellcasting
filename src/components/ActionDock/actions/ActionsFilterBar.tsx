import React from "react";
import { IconSearch } from "../shared/Bg3Icons";
import type { ActionsFilter } from "../domain/types";

const ACTION_FILTERS: ActionsFilter[] = ["ALL", "ATTACK", "ACTION", "BONUS ACTION", "REACTION", "OTHER", "LIMITED USE"];

interface ActionsFilterBarProps {
    filter: ActionsFilter;
    search: string;
    onFilterChange: (filter: ActionsFilter) => void;
    onSearchChange: (search: string) => void;
}

export const ActionsFilterBar: React.FC<ActionsFilterBarProps> = ({ filter, search, onFilterChange, onSearchChange }) => (
    <div className="ddb-actions-filter-search-row">
        <div className="ddb-subfilter-bar">
            {ACTION_FILTERS.map(value => (
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
        <div className="ddb-search-wrap">
            <IconSearch size={12} className="ddb-search-icon" />
            <input
                type="text"
                className="ddb-search-input"
                placeholder="Search actions & skills..."
                value={search}
                onChange={event => onSearchChange(event.target.value)}
            />
            {search && (
                <button
                    type="button"
                    className="ddb-search-clear-btn"
                    onClick={() => onSearchChange("")}
                    title="Clear search"
                >
                    ✕
                </button>
            )}
        </div>
    </div>
);
