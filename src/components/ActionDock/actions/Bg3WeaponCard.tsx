import type { DDBWeaponAttack } from "../../../types/ddb";
import { getWeaponIcon } from "../shared/Bg3Icons";
import { ActionGridTile } from "./ActionGridTile";

interface Bg3WeaponCardProps {
    weapon: DDBWeaponAttack;
    index: number;
    mode?: "melee" | "thrown";
    isMainHand?: boolean;
    isOffHand?: boolean;
    onSwapHands?: () => void;
    onActivate: (weapon: DDBWeaponAttack, mode?: "melee" | "thrown") => void;
    onOpenDetails: (weapon: DDBWeaponAttack) => void;
}

export function Bg3WeaponCard({
    weapon,
    index,
    mode = "melee",
    isMainHand,
    isOffHand,
    onSwapHands,
    onActivate,
    onOpenDetails,
}: Bg3WeaponCardProps) {
    const isThrownMode = mode === "thrown";
    const displayName = isThrownMode ? `Throw ${weapon.name}` : weapon.name;
    const baseDamage = isThrownMode && weapon.properties?.some(p => p.toLowerCase().includes("versatile"))
        ? weapon.damage.replace(/\b1d8\b/, "1d6")
        : weapon.damage;

    const handBadge = isMainHand
        ? {
            type: "main" as const,
            label: "MH ⇄",
            onClick: onSwapHands,
        }
        : isOffHand
        ? {
            type: "offhand" as const,
            label: "OH ⇄",
            onClick: onSwapHands,
        }
        : undefined;

    const actionBadge = isThrownMode
        ? {
            label: "THROWN",
            className: "thrown-indicator",
            title: `Thrown Ranged Attack (${weapon.thrownRange || 20}/${weapon.thrownLongRange || 60} ft.)`,
        }
        : weapon.hasThrown
        ? {
            label: "THROW",
            className: "throw",
            title: `Throw ${weapon.name} (${weapon.thrownRange || 20}/${weapon.thrownLongRange || 60} ft.)`,
            onClick: () => onActivate(weapon, "thrown"),
        }
        : undefined;

    const subtitle = isThrownMode
        ? `Thrown · ${weapon.thrownRange || 20}/${weapon.thrownLongRange || 60} ft`
        : isMainHand
        ? `Main Hand · ${weapon.type || "Melee"}`
        : isOffHand
        ? `Off Hand · ${weapon.type || "Melee"}`
        : (weapon.type || "Attack");

    const details = [
        isThrownMode ? "Thrown Ranged Attack" : isMainHand ? "Main Hand (Primary)" : isOffHand ? "Off Hand (Bonus Action)" : undefined,
        `+${weapon.toHit} to hit`,
        baseDamage,
        weapon.damageType,
        isThrownMode ? `${weapon.thrownRange || 20}/${weapon.thrownLongRange || 60} ft` : weapon.rangeText,
        (!isThrownMode && (isMainHand || isOffHand)) ? "⇄ Click badge to swap hands" : undefined,
    ].filter(Boolean) as string[];

    return (
        <ActionGridTile
            key={isThrownMode ? `${weapon.id}__thrown` : weapon.id}
            name={displayName}
            category={isThrownMode ? "Weapon (Thrown)" : "Weapon"}
            subtitle={subtitle}
            details={details}
            icon={getWeaponIcon(weapon.name, weapon.type, 24)}
            accent={isThrownMode ? "#f59e0b" : "#62c982"}
            shortcut={index + 1}
            handBadge={isThrownMode ? undefined : handBadge}
            actionBadge={actionBadge}
            onActivate={() => onActivate(weapon, isThrownMode ? "thrown" : "melee")}
            onContextMenu={event => {
                event.preventDefault();
                onOpenDetails(weapon);
            }}
        />
    );
}
