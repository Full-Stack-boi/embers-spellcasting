import type { Item } from "@owlbear-rodeo/sdk";
import { APP_KEY } from "../config";
import { isDescriptionActivatableBuff } from "./descriptionParser";

async function getOBR() {
    if (typeof window !== "undefined") {
        const mod = await import("@owlbear-rodeo/sdk");
        return mod.default;
    }
    return null;
}

export const ACTIVE_BUFFS_METADATA_KEY = `${APP_KEY}/active-buffs`;

export interface ActiveBuff {
    id: string;
    name: string;
    icon: string;
    source: string;
    durationText: string;
    description: string;
    spellSaveDcBonus?: number;
    spellAttackAdvantage?: boolean;
    attackAdvantage?: boolean;
    damageBonus?: number;
    activatedAt: number;
}

export const KNOWN_BUFFS: Record<string, Omit<ActiveBuff, "activatedAt">> = {
    innate_sorcery: {
        id: "innate_sorcery",
        name: "Innate Sorcery",
        icon: "🔥",
        source: "Sorcerer",
        durationText: "1 minute (10 rounds)",
        description: "+1 to Sorcerer spell save DC and Advantage on Sorcerer spell attack rolls.",
        spellSaveDcBonus: 1,
        spellAttackAdvantage: true,
    },
    rage: {
        id: "rage",
        name: "Rage",
        icon: "🩸",
        source: "Barbarian",
        durationText: "1 minute",
        description: "Advantage on STR checks & saving throws, +2 melee damage, resistance to physical damage.",
        attackAdvantage: true,
        damageBonus: 2,
    },
    bladesong: {
        id: "bladesong",
        name: "Bladesong",
        icon: "⚔️",
        source: "Wizard",
        durationText: "1 minute",
        description: "AC bonus equal to INT mod, +10 ft speed, Advantage on Acrobatics checks.",
    },
};

/**
 * Determines whether a given feature represents an activatable buff or stance
 * (e.g. Innate Sorcery, Rage, Bladesong).
 */
export function isActivatableBuffFeature(name?: string | null, description?: string | null): boolean {
    if (!name) return false;
    const lower = name.toLowerCase().trim();
    if (KNOWN_BUFFS[lower]) return true;
    if (description && isDescriptionActivatableBuff(description)) return true;
    return (
        lower.includes("innate sorcery") ||
        lower.includes("rage") ||
        lower.includes("bladesong") ||
        lower.includes("frenzy") ||
        lower.includes("starry form")
    );
}

/**
 * Extracts active buffs from a token's metadata.
 */
export function getTokenBuffs(item?: Item | null): ActiveBuff[] {
    if (!item?.metadata) return [];
    const raw = item.metadata[ACTIVE_BUFFS_METADATA_KEY];
    if (Array.isArray(raw)) {
        return raw as ActiveBuff[];
    }
    return [];
}

/**
 * Computes combined stat modifications from active buffs.
 */
export function getComputedBuffModifiers(buffs: ActiveBuff[]) {
    let spellSaveDcBonus = 0;
    let hasSpellAdvantage = false;
    let hasAttackAdvantage = false;
    let damageBonus = 0;

    for (const buff of buffs) {
        if (buff.spellSaveDcBonus) spellSaveDcBonus += buff.spellSaveDcBonus;
        if (buff.spellAttackAdvantage) hasSpellAdvantage = true;
        if (buff.attackAdvantage) hasAttackAdvantage = true;
        if (buff.damageBonus) damageBonus += buff.damageBonus;
    }

    return {
        spellSaveDcBonus,
        hasSpellAdvantage,
        hasAttackAdvantage,
        damageBonus
    };
}

/**
 * Adds an active buff to a token.
 */
export async function addTokenBuff(tokenId: string, buff: ActiveBuff): Promise<ActiveBuff[]> {
    const OBR = await getOBR();
    if (!OBR) return [buff];
    let updated: ActiveBuff[] = [];
    await OBR.scene.items.updateItems([tokenId], items => {
        items.forEach(item => {
            const current = getTokenBuffs(item).filter(b => b.id !== buff.id);
            updated = [...current, buff];
            item.metadata[ACTIVE_BUFFS_METADATA_KEY] = updated;
        });
    });
    return updated;
}

/**
 * Removes an active buff from a token.
 */
export async function removeTokenBuff(tokenId: string, buffId: string): Promise<ActiveBuff[]> {
    const OBR = await getOBR();
    if (!OBR) return [];
    let updated: ActiveBuff[] = [];
    await OBR.scene.items.updateItems([tokenId], items => {
        items.forEach(item => {
            const current = getTokenBuffs(item);
            updated = current.filter(b => b.id !== buffId);
            item.metadata[ACTIVE_BUFFS_METADATA_KEY] = updated;
        });
    });
    return updated;
}

/**
 * Toggles an active buff on/off on a token.
 */
export async function toggleTokenBuff(tokenId: string, buff: ActiveBuff): Promise<{ active: boolean; buffs: ActiveBuff[] }> {
    const OBR = await getOBR();
    if (!OBR) return { active: false, buffs: [] };
    let isActive = false;
    let updated: ActiveBuff[] = [];

    await OBR.scene.items.updateItems([tokenId], items => {
        items.forEach(item => {
            const current = getTokenBuffs(item);
            const exists = current.some(b => b.id === buff.id);
            if (exists) {
                updated = current.filter(b => b.id !== buff.id);
                isActive = false;
            } else {
                updated = [...current, buff];
                isActive = true;
            }
            item.metadata[ACTIVE_BUFFS_METADATA_KEY] = updated;
        });
    });

    return { active: isActive, buffs: updated };
}
