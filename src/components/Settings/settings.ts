import { APP_KEY } from "../../config";
import OBR, { GridScale } from "@owlbear-rodeo/sdk";

export const LOCAL_STORAGE_KEYS = {
    MOST_RECENT_SPELLS_LIST_SIZE: "most-recent-list",
    GRID_SCALING_FACTOR: "grid-scaling-factor",
    KEEP_SELECTED_TARGETS: "keep-selected-targets",
    DEFAULT_CASTER: "default-caster",
    ANIMATION_UPDATE_RATE: "animation-update-rate",
    SMART_ACTION_ON_TARGET: "smart-action-on-target",
};

export const GLOBAL_STORAGE_KEYS = {
    PLAYERS_CAN_CAST_SPELLS: "players-cast-spells",
    SUMMONED_ENTITIES_RULE: "summoned-entities"
};

export const SETTINGS_CHANNEL = `${APP_KEY}/settings`;

export const DEFAULT_VALUES = {
    [LOCAL_STORAGE_KEYS.MOST_RECENT_SPELLS_LIST_SIZE]: 10,
    [LOCAL_STORAGE_KEYS.GRID_SCALING_FACTOR]: null,
    [LOCAL_STORAGE_KEYS.KEEP_SELECTED_TARGETS]: false,
    [LOCAL_STORAGE_KEYS.DEFAULT_CASTER]: [],
    [LOCAL_STORAGE_KEYS.ANIMATION_UPDATE_RATE]: 50,
    [LOCAL_STORAGE_KEYS.SMART_ACTION_ON_TARGET]: true,
    [GLOBAL_STORAGE_KEYS.PLAYERS_CAN_CAST_SPELLS]: true,
    [GLOBAL_STORAGE_KEYS.SUMMONED_ENTITIES_RULE]: "caster",
}

// Migrate legacy default: keep-selected-targets used to default to true.
// Ensure it defaults to false so target markers are cleaned up after casting.
try {
    const MIGRATION_KEY = `${APP_KEY}/migrated-keep-targets-default-v2`;
    if (typeof localStorage !== "undefined" && !localStorage.getItem(MIGRATION_KEY)) {
        const settingsObjectString = localStorage.getItem(`${APP_KEY}/settings`);
        if (settingsObjectString) {
            const settingsObject = JSON.parse(settingsObjectString);
            if (settingsObject[LOCAL_STORAGE_KEYS.KEEP_SELECTED_TARGETS] === true) {
                settingsObject[LOCAL_STORAGE_KEYS.KEEP_SELECTED_TARGETS] = false;
                localStorage.setItem(`${APP_KEY}/settings`, JSON.stringify(settingsObject));
            }
        }
        localStorage.setItem(MIGRATION_KEY, "true");
    }
} catch {
    // Ignore in non-browser or test environments
}

export const GRID_UNIT_FACTORS: Record<string, number> = {
    "ft": 1,
    "m": 1.524,
}

function tryComputeGridScaling(gridScale: GridScale | null) {
    if (gridScale == null) {
        return null;
    }
    const gridScaleFactor = gridScale.parsed.multiplier;
    const unitFactor = GRID_UNIT_FACTORS[gridScale.parsed.unit] ?? 1;
    return 5 / (gridScaleFactor * unitFactor);
}

export async function getDefaultGridScaleFactor() {
    const gridScale = await OBR.scene.grid.getScale();
    return tryComputeGridScaling(gridScale) ?? 1;
}

export function getSettingsValue(key: string) {
    const settingsObjectString = localStorage.getItem(`${APP_KEY}/settings`);
    if (settingsObjectString == undefined) {
        return DEFAULT_VALUES[key];
    }
    const settingsObject = JSON.parse(settingsObjectString);
    if (settingsObject[key] == undefined) {
        return DEFAULT_VALUES[key];
    }
    return settingsObject[key];
}

export function setSettingsValue(key: string, value: unknown) {
    const settingsObjectString = localStorage.getItem(`${APP_KEY}/settings`);
    if (settingsObjectString == undefined) {
        localStorage.setItem(`${APP_KEY}/settings`, JSON.stringify({ [key]: value }));
        return;
    }
    const settingsObject = JSON.parse(settingsObjectString);
    settingsObject[key] = value;
    localStorage.setItem(`${APP_KEY}/settings`, JSON.stringify(settingsObject));
}

export async function getGlobalSettingsValue(key: string) {
    const metadata = await OBR.scene.getMetadata();
    const settingsObject = metadata[`${APP_KEY}/settings/${key}`];
    if (settingsObject == undefined) {
        return DEFAULT_VALUES[key];
    }
    return settingsObject;
}

export async function setGlobalSettingsValue(key: string, value: unknown) {
    await OBR.scene.setMetadata({
        [`${APP_KEY}/settings/${key}`]: value
    });
}
