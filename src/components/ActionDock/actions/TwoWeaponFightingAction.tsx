import type { DDBWeaponAttack } from "../../../types/ddb";

interface TwoWeaponFightingActionProps {
    enabled: boolean;
    offhandWeapon?: DDBWeaponAttack;
    onActivate: () => void;
    showUnavailable?: boolean;
    detailedTitle?: boolean;
}

export function TwoWeaponFightingAction({
    enabled,
    offhandWeapon,
    onActivate,
    showUnavailable = false,
    detailedTitle = false,
}: TwoWeaponFightingActionProps) {
    if (!enabled) {
        return showUnavailable ? (
            <div className="ddb-action-card-item generic">
                <div className="ddb-card-accent-bar" />
                <span className="ddb-card-name">Two-Weapon Fighting (requires 2 equipped Light weapons)</span>
            </div>
        ) : null;
    }

    return (
        <div
            className="ddb-action-card-item twf"
            onClick={onActivate}
            title={detailedTitle
                ? "Two-Weapon Fighting: When you take the Attack action and attack with a Light weapon, make an extra attack with another Light weapon as a Bonus Action."
                : "Two-Weapon Fighting"}
        >
            <div className="ddb-card-accent-bar" />
            <div className="ddb-card-content">
                <span className="ddb-card-name">Two-Weapon Fighting</span>
                {offhandWeapon && (
                    <span className="ddb-card-meta">
                        ({offhandWeapon.name}: +{offhandWeapon.toHit} to hit, {offhandWeapon.damage} {offhandWeapon.damageType})
                    </span>
                )}
            </div>
        </div>
    );
}
