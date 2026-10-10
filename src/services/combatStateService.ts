import { APP_KEY } from "../config";

export const COMBAT_STATE_STORAGE_PREFIX = `${APP_KEY}/combat-state/`;

export interface DdbResourceBaseline {
    spellSlotsUsed?: Record<number, number>;
    pactSlotsUsed?: number;
    featureUses?: Record<string, number>;
    hitDiceUsed?: Record<string, number>;
}

export interface EmbersCombatState {
    characterId: number;
    spellSlotsUsed: Record<number, number>;
    createdSpellSlots?: Record<number, number>;
    pactSlotsUsed: number;
    featureUses: Record<string, number>;
    hpCurrent: number | null;
    hpTemp: number;
    actionUsed: boolean;
    bonusActionUsed: boolean;
    heroicInspiration: boolean;
    concentrationSpellId: string | null;
    concentrationSpellName: string | null;
    hexTargetId?: string | null;
    hexTargetName?: string | null;
    hexAbility?: string | null;
    deathSaves: { successes: number; failures: number };
    hitDiceUsed: Record<string, number>;
    exhaustionLevel: number;
    conditions: string[];
    ddbBaseline?: DdbResourceBaseline;
    lastUpdated: string;
}

export function isHexConcentrationActive(state: EmbersCombatState | null | undefined): boolean {
    if (!state) return false;
    const id = state.concentrationSpellId?.toLowerCase();
    const name = state.concentrationSpellName?.toLowerCase();
    return id === "hex" || name === "hex" || (name ? name.startsWith("hex") : false);
}

export function getDefaultCombatState(characterId: number): EmbersCombatState {
    return {
        characterId,
        spellSlotsUsed: {},
        createdSpellSlots: {},
        pactSlotsUsed: 0,
        featureUses: {},
        hpCurrent: null,
        hpTemp: 0,
        actionUsed: false,
        bonusActionUsed: false,
        heroicInspiration: false,
        concentrationSpellId: null,
        concentrationSpellName: null,
        hexTargetId: null,
        hexTargetName: null,
        hexAbility: null,
        deathSaves: { successes: 0, failures: 0 },
        hitDiceUsed: {},
        exhaustionLevel: 0,
        conditions: [],
        ddbBaseline: {},
        lastUpdated: new Date().toISOString()
    };
}

/**
 * Safely retrieves OBR instance in browser environment without throwing in node/tests.
 */
async function getOBR() {
    if (typeof window === "undefined" || !window.location) return null;
    try {
        const mod = await import("@owlbear-rodeo/sdk");
        return mod.default;
    } catch {
        return null;
    }
}

/**
 * Loads persisted combat state for a given character from OBR player metadata or localStorage fallback.
 */
export async function loadCombatState(characterId: number): Promise<EmbersCombatState | null> {
    if (!characterId) return null;

    // 1. Try OBR player metadata if running in OBR iframe
    try {
        const OBR = await getOBR();
        if (OBR && (typeof OBR.isReady === "boolean" ? OBR.isReady : true)) {
            const metadata = await OBR.player.getMetadata();
            const key = `${COMBAT_STATE_STORAGE_PREFIX}${characterId}`;
            const raw = metadata?.[key] as EmbersCombatState | undefined;
            if (raw && raw.characterId === characterId) {
                return raw;
            }
        }
    } catch {
        // Fallback to localStorage if OBR is not connected
    }

    // 2. Fallback to localStorage
    try {
        if (typeof window !== "undefined" && window.localStorage) {
            const raw = localStorage.getItem(`${COMBAT_STATE_STORAGE_PREFIX}${characterId}`);
            if (raw) {
                const parsed = JSON.parse(raw) as EmbersCombatState;
                if (parsed.characterId === characterId) {
                    return parsed;
                }
            }
        }
    } catch {
        // Ignore storage errors
    }

    return null;
}

/**
 * Saves combat state to OBR player metadata and localStorage.
 */
export async function saveCombatState(characterId: number, patch: Partial<EmbersCombatState>): Promise<void> {
    if (!characterId) return;

    const existing = (await loadCombatState(characterId)) || getDefaultCombatState(characterId);
    const updated: EmbersCombatState = {
        ...existing,
        ...patch,
        characterId,
        lastUpdated: new Date().toISOString()
    };

    const key = `${COMBAT_STATE_STORAGE_PREFIX}${characterId}`;

    // 1. Save to OBR player metadata
    try {
        const OBR = await getOBR();
        if (OBR) {
            await OBR.player.setMetadata({
                [key]: updated
            });
        }
    } catch {
        // Fallback if OBR fails
    }

    // 2. Always mirror to localStorage for offline resilience
    try {
        if (typeof window !== "undefined" && window.localStorage) {
            localStorage.setItem(key, JSON.stringify(updated));
        }
    } catch {
        // Ignore storage errors
    }
}

/**
 * Resets combat state (e.g. on Long Rest)
 */
export async function resetCombatState(characterId: number): Promise<EmbersCombatState> {
    const fresh = getDefaultCombatState(characterId);
    await saveCombatState(characterId, fresh);
    return fresh;
}
