import React from "react";
import { getOrdinal } from "../../../assets/spellInfo";
import type { DockSpell } from "../domain/types";

interface InlineSpellChipsProps {
    spells: DockSpell[];
    onSelect: (spellId: string) => void;
    onOpenDetails: (spellId: string) => void;
    titleSuffix?: string;
}

export const InlineSpellChips: React.FC<InlineSpellChipsProps> = ({ spells, onSelect, onOpenDetails, titleSuffix = "" }) => (
    <>
        {spells.map((spell, index) => (
            <span
                key={spell.id}
                className="ddb-inline-spell-chip"
                onClick={() => onSelect(spell.id)}
                onContextMenu={event => {
                    event.preventDefault();
                    onOpenDetails(spell.id);
                }}
                title={`Click to aim & cast ${spell.name}${titleSuffix}`}
            >
                <em className="ddb-spell-name-italic">{spell.name}</em>
                {spell.notes?.includes("C") ? " ◆" : ""} ({spell.level === 0 ? "Cantrip" : getOrdinal(spell.level)})
                {index < spells.length - 1 ? ", " : ""}
            </span>
        ))}
    </>
);
