import React from "react";
import { IconDragon, IconFocusCamera, IconUserCheck } from "../shared/Bg3Icons";

export interface CharacterIdentityProps {
    avatarUrl: string;
    name: string;
    classSummary: string;
    isSynced: boolean;
    isReadOnlyInspection: boolean;
    isPlayer: boolean;
    isOwnedByMe: boolean;
    otherOwnerName?: string;
    tokenId?: string;
    onOpenSync: () => void;
    onRelease: () => void;
    onClaim: () => void;
    onFocus: () => void;
}

export const CharacterIdentity: React.FC<CharacterIdentityProps> = ({
    avatarUrl,
    name,
    classSummary,
    isSynced,
    isReadOnlyInspection,
    isPlayer,
    isOwnedByMe,
    otherOwnerName,
    tokenId,
    onOpenSync,
    onRelease,
    onClaim,
    onFocus,
}) => (
    <div className="ddb-caster-identity-container">
        <div className="ddb-caster-identity-row">
            <div
                className="ddb-caster-identity"
                onClick={onOpenSync}
                title={isSynced ? `${name} (Click to re-sync)` : "Click to link D&D Beyond Character"}
            >
                <div className="ddb-caster-avatar-ring">
                    <img className="ddb-caster-avatar-img" src={avatarUrl} alt={name} />
                    {isSynced && <span className="ddb-synced-star">✦</span>}
                </div>
                <div className="ddb-caster-text-block">
                    <div className="ddb-caster-name-row">
                        <span className="ddb-caster-name">{name}</span>
                        {isReadOnlyInspection && (
                            <span className="ddb-inspection-badge" title="Viewing ally in read-only inspection mode">
                                Inspection
                            </span>
                        )}
                        {isPlayer && (
                            isOwnedByMe ? (
                                <div className="ddb-owner-actions-wrap">
                                    <span className="ddb-owner-badge owned" title="Your bound character token">
                                        <IconUserCheck size={9} /> Mine
                                    </span>
                                    <button type="button" className="ddb-release-token-btn" onClick={event => { event.stopPropagation(); onRelease(); }} title="Release token from your characters">
                                        ✕
                                    </button>
                                </div>
                            ) : otherOwnerName ? (
                                <span className="ddb-owner-badge other" title={`Claimed by ${otherOwnerName}`}>
                                    {otherOwnerName}
                                </span>
                            ) : (
                                <button type="button" className="ddb-claim-token-btn" onClick={event => { event.stopPropagation(); onClaim(); }} title="Claim this token as your character">
                                    Claim
                                </button>
                            )
                        )}
                        <span className={`ddb-sync-badge ${isSynced ? "synced" : "unsynced"}`}>
                            <IconDragon size={10} />
                            {isSynced ? "DDB" : "Sync"}
                        </span>
                    </div>
                    <span className="ddb-caster-subline">{classSummary}</span>
                </div>
            </div>

            {tokenId && (
                <button type="button" className="ddb-focus-camera-btn" onClick={event => { event.stopPropagation(); onFocus(); }} title={`Focus camera on ${name} (Shortcut: C)`}>
                    <IconFocusCamera size={13} />
                </button>
            )}
        </div>
    </div>
);
