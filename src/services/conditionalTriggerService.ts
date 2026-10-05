import { APP_KEY } from "../config";
import { ConditionalTrigger } from "../types/conditionalTrigger";
import { DDBRollCardData } from "../types/ddbRollLog";
import { rollDamageDDB } from "../utils/dice";
import { broadcastDDBRoll } from "./rollLogService";

export const CONDITIONAL_TRIGGERS_METADATA_KEY = `${APP_KEY}/conditional-triggers`;

// In-memory fallback for unit tests and non-OBR environments
let inMemoryTriggers: ConditionalTrigger[] = [];
const executingTriggerLocks = new Set<string>();

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
 * Loads active conditional triggers from OBR scene metadata or local fallback.
 */
export async function getActiveTriggers(): Promise<ConditionalTrigger[]> {
    try {
        const OBR = await getOBR();
        if (OBR && (typeof OBR.isReady === "boolean" ? OBR.isReady : true)) {
            const isSceneReady = await OBR.scene.isReady().catch(() => false);
            if (isSceneReady) {
                const metadata = await OBR.scene.getMetadata();
                const raw = metadata?.[CONDITIONAL_TRIGGERS_METADATA_KEY] as ConditionalTrigger[] | undefined;
                if (Array.isArray(raw)) {
                    inMemoryTriggers = raw;
                    return raw;
                }
            }
        }
    } catch {
        // Fallback to local
    }

    if (typeof window !== "undefined" && window.localStorage) {
        try {
            const stored = localStorage.getItem(CONDITIONAL_TRIGGERS_METADATA_KEY);
            if (stored) {
                inMemoryTriggers = JSON.parse(stored);
                return inMemoryTriggers;
            }
        } catch {
            // Ignore parse errors
        }
    }

    return inMemoryTriggers;
}

/**
 * Saves active conditional triggers to OBR scene metadata and local storage.
 */
export async function saveActiveTriggers(triggers: ConditionalTrigger[]): Promise<void> {
    inMemoryTriggers = triggers;

    try {
        const OBR = await getOBR();
        if (OBR && (typeof OBR.isReady === "boolean" ? OBR.isReady : true)) {
            const isSceneReady = await OBR.scene.isReady().catch(() => false);
            if (isSceneReady) {
                await OBR.scene.setMetadata({
                    [CONDITIONAL_TRIGGERS_METADATA_KEY]: triggers
                });
            }
        }
    } catch {
        
    }

    if (typeof window !== "undefined" && window.localStorage) {
        try {
            localStorage.setItem(CONDITIONAL_TRIGGERS_METADATA_KEY, JSON.stringify(triggers));
        } catch {
            // Ignore storage errors
        }
    }
}

/**
 * Adds or replaces an active conditional trigger on a target token.
 */
export async function addConditionalTrigger(trigger: ConditionalTrigger): Promise<void> {
    const current = await getActiveTriggers();
    // Replace existing trigger for the same spell on the same target
    const filtered = current.filter(t => !(t.targetId === trigger.targetId && t.spellId === trigger.spellId));
    filtered.push(trigger);
    await saveActiveTriggers(filtered);
}

/**
 * Removes an active trigger by ID.
 */
export async function removeConditionalTrigger(id: string): Promise<void> {
    const current = await getActiveTriggers();
    const updated = current.filter(t => t.id !== id);
    await saveActiveTriggers(updated);
}

/**
 * Retrieves all active triggers for a specific target token.
 */
export async function getActiveTriggersForTarget(targetId: string): Promise<ConditionalTrigger[]> {
    const current = await getActiveTriggers();
    return current.filter(t => t.targetId === targetId);
}

/**
 * Fires a conditional trigger, rolling the trigger damage, broadcasting the roll card,
 * showing an alert, and clearing the trigger.
 */
export async function fireConditionalTrigger(triggerId: string): Promise<DDBRollCardData | null> {
    if (executingTriggerLocks.has(triggerId)) {
        return null;
    }
    executingTriggerLocks.add(triggerId);

    try {
        const current = await getActiveTriggers();
        const triggerIndex = current.findIndex(t => t.id === triggerId);
        if (triggerIndex === -1) {
            return null;
        }
        const trigger = current[triggerIndex];

        // ATOMIC CLAIM: Remove trigger immediately from active list BEFORE rolling damage or broadcasting
        const updated = current.filter(t => t.id !== triggerId);
        await saveActiveTriggers(updated);

        const dmg = rollDamageDDB(trigger.damageFormula, trigger.damageType);
        const dieFaces = Number(trigger.damageFormula.match(/d(\d+)/i)?.[1] ?? 8);

        let subtitle = "Triggered Effect";
        if (trigger.conditionType === "movement") {
            subtitle = "Movement Trigger (Target moved 5+ ft)";
        } else if (trigger.conditionType === "action_attack_or_cast") {
            subtitle = "Action Trigger (Target attacked or cast a spell)";
        }

        const card: DDBRollCardData = {
            id: `${Date.now()}-trigger-${trigger.id}`,
            casterName: trigger.casterName || "Character",
            targetName: trigger.targetName || "Target",
            actionName: `${trigger.spellName.toUpperCase()} (TRIGGER)`,
            actionType: "DAMAGE",
            dieType: dieFaces,
            diceBreakdown: dmg.breakdown.replace(/\+/g, " + "),
            formula: `${trigger.damageFormula} ${trigger.damageType}`,
            total: dmg.total,
            subtitle,
            isConditionTrigger: true,
            triggerConditionDesc: trigger.conditionDescription || subtitle,
            timestamp: Date.now()
        };

        await broadcastDDBRoll([card]);

        // Show prominent warning notification so condition damage is unmistakable
        const OBR = await getOBR();
        if (OBR?.notification?.show) {
            OBR.notification.show(
                `${trigger.spellName} triggered: ${trigger.targetName} took ${dmg.total} ${trigger.damageType} damage (${trigger.conditionDescription || subtitle}).`,
                "WARNING"
            );
        }

        return card;
    } finally {
        setTimeout(() => {
            executingTriggerLocks.delete(triggerId);
        }, 3000);
    }
}

/**
 * Checks if target token moved 5ft+ from initial position and fires any active movement triggers.
 */
export async function checkAndFireMovementTriggers(
    targetId: string,
    currentPos: { x: number; y: number },
    dpi: number = 400
): Promise<DDBRollCardData[]> {
    const current = await getActiveTriggers();
    const movementTriggers = current.filter(t => t.targetId === targetId && t.conditionType === "movement");
    if (movementTriggers.length === 0) return [];

    const firedCards: DDBRollCardData[] = [];

    for (const trigger of movementTriggers) {
        if (executingTriggerLocks.has(trigger.id)) continue;

        if (!trigger.initialPosition) {
            const card = await fireConditionalTrigger(trigger.id);
            if (card) firedCards.push(card);
            continue;
        }

        const dx = currentPos.x - trigger.initialPosition.x;
        const dy = currentPos.y - trigger.initialPosition.y;
        const dist = Math.hypot(dx, dy);

        // Standard 5ft distance threshold on grid: approximately 0.6 * dpi
        const minMoveDistance = dpi * 0.6;
        if (dist >= minMoveDistance) {
            const card = await fireConditionalTrigger(trigger.id);
            if (card) firedCards.push(card);
        }
    }

    return firedCards;
}

/**
 * Checks and fires any active action triggers (e.g. Vengeful Blade) when a token attacks or casts.
 */
export async function checkAndFireActionTriggers(
    actorId: string,
    actionKind?: "attack" | "spell"
): Promise<DDBRollCardData[]> {
    void actionKind;
    const current = await getActiveTriggers();
    const actionTriggers = current.filter(t => t.targetId === actorId && t.conditionType === "action_attack_or_cast");
    if (actionTriggers.length === 0) return [];

    const firedCards: DDBRollCardData[] = [];
    for (const trigger of actionTriggers) {
        if (executingTriggerLocks.has(trigger.id)) continue;
        const card = await fireConditionalTrigger(trigger.id);
        if (card) firedCards.push(card);
    }

    return firedCards;
}

/**
 * Clears in-memory state (useful for tests).
 */
export function resetConditionalTriggerState(): void {
    inMemoryTriggers = [];
    executingTriggerLocks.clear();
}
