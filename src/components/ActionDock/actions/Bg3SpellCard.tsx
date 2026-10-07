import type { DDBParsedSpell } from "../../../types/ddb";
import { getOrdinal, getSchoolStyle, getSpellInitials, getSpellMetadata } from "../../../assets/spellInfo";
import { ActionGridTile } from "./ActionGridTile";

export interface DockGridSpell {
    id: string;
    name: string;
    level: number;
    school: string;
    castingTime: string;
    rangeText: string;
    hitOrDc?: string;
    damage?: string;
    damageType?: string;
    notes?: string;
    rawDdbSpell?: DDBParsedSpell;
}

interface Bg3SpellCardProps {
    spell: DockGridSpell;
    index: number;
    selected: boolean;
    damageTypeOverride?: string;
    onActivate: (spell: DockGridSpell) => void;
    onOpenDetails: (spellId: string) => void;
}

export function Bg3SpellCard({ spell, index, selected, damageTypeOverride, onActivate, onOpenDetails }: Bg3SpellCardProps) {
    const meta = getSpellMetadata(spell.id, spell.name);
    const school = meta?.school || spell.school;
    const schoolStyle = getSchoolStyle(school);
    const subtitle = spell.level === 0 ? "Cantrip" : `${getOrdinal(spell.level)} Level ${school || "Spell"}`;
    const details = [
        spell.castingTime,
        spell.rangeText,
        spell.damage && `${spell.damage} ${damageTypeOverride ?? spell.damageType ?? ""}`,
        spell.hitOrDc,
    ].filter(Boolean) as string[];

    return (
        <ActionGridTile
            key={spell.id}
            name={spell.name}
            category={spell.level === 0 ? "Cantrip" : "Spell"}
            subtitle={subtitle}
            details={details}
            description={spell.rawDdbSpell?.description || spell.notes}
            accent={schoolStyle?.color || "#c9a66b"}
            shortcut={index + 1}
            selected={selected}
            icon={schoolStyle?.iconUrl ? (
                <img
                    src={schoolStyle.iconUrl}
                    alt=""
                    className="ddb-bg3-icon-tile-school"
                    loading="lazy"
                    onError={event => { event.currentTarget.style.visibility = "hidden"; }}
                />
            ) : <span className="ddb-bg3-icon-tile-initials">{getSpellInitials(spell.name)}</span>}
            onActivate={() => onActivate(spell)}
            onContextMenu={event => {
                event.preventDefault();
                onOpenDetails(spell.id);
            }}
        />
    );
}
