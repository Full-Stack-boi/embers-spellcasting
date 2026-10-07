import type { DDBWeaponAttack } from "../../../types/ddb";
import { getWeaponIcon } from "../shared/Bg3Icons";
import { ActionGridTile } from "./ActionGridTile";

interface Bg3WeaponCardProps {
    weapon: DDBWeaponAttack;
    index: number;
    onActivate: (weapon: DDBWeaponAttack) => void;
    onOpenDetails: (weapon: DDBWeaponAttack) => void;
}

export function Bg3WeaponCard({ weapon, index, onActivate, onOpenDetails }: Bg3WeaponCardProps) {
    return (
        <ActionGridTile
            key={weapon.id}
            name={weapon.name}
            category="Weapon"
            subtitle={weapon.type || "Attack"}
            details={[`+${weapon.toHit} to hit`, weapon.damage, weapon.damageType, weapon.rangeText].filter(Boolean) as string[]}
            icon={getWeaponIcon(weapon.name, weapon.type, 24)}
            accent="#62c982"
            shortcut={index + 1}
            onActivate={() => onActivate(weapon)}
            onContextMenu={event => {
                event.preventDefault();
                onOpenDetails(weapon);
            }}
        />
    );
}
