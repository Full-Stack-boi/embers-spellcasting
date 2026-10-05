import { Vector2 } from "@owlbear-rodeo/sdk";

export interface TokenVisionRules {
    darkvision?: number;              // e.g. 60, 120 (ft)
    devilsSight?: boolean;            // Can see through Magical Darkness <= 120 ft
    blindFighting?: number;           // e.g. 10 ft (blind fighting fighting style)
    truesight?: number;               // e.g. 120 ft
    tremorsense?: number;
    shadowMonkSight?: {
        enabled: boolean;
        sourceOnly: boolean;          // Only own darkness or all darkness
        range: number;
    };
    customDarknessVision?: {
        canSeeInMagicalDarkness: boolean;
        maxRange: number;
        description?: string;
    };
    spellRangeMultiplier?: number;
}

export interface DarknessZone {
    id: string;
    position: Vector2;
    radiusFeet: number;
    sourceCasterId?: string;
}

export interface VisionCheckResult {
    canSee: boolean;
    reason?: string;
    isBlockedByDarkness: boolean;
}
