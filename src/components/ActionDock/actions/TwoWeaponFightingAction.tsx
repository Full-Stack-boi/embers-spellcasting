import type { DDBWeaponAttack } from "../../../types/ddb";

interface TwoWeaponFightingActionProps {
    enabled: boolean;
    offhandWeapon?: DDBWeaponAttack;
    onActivate: () => void;
    onSwapHands?: () => void;
    showUnavailable?: boolean;
    detailedTitle?: boolean;
}

export function TwoWeaponFightingAction({
    enabled,
    offhandWeapon,
    onActivate,
    onSwapHands,
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
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                    <span className="ddb-card-name">Two-Weapon Fighting</span>
                    {onSwapHands && (
                        <button
                            type="button"
                            className="ddb-hand-badge offhand"
                            onClick={(e) => { e.stopPropagation(); onSwapHands(); }}
                            title="Click to Swap Main Hand & Off Hand"
                        >
                            ⇄ Swap Hands
                        </button>
                    )}
                </div>
                {offhandWeapon && (
                    <span className="ddb-card-meta">
                        ({offhandWeapon.name}: +{offhandWeapon.toHit} to hit, {offhandWeapon.damage} {offhandWeapon.damageType})
                    </span>
                )}
            </div>
        </div>
    );
}
