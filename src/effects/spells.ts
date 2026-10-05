import { BlueprintValue, Variables } from "../types/blueprint";
import { LOCAL_STORAGE_KEYS, getDefaultGridScaleFactor, getSettingsValue } from "../components/Settings/settings";
import OBR, { Image, Item, Vector2, isImage } from "@owlbear-rodeo/sdk";
import { ReplicationType, Spell, Spells } from "../types/spells";
import { getSortedTargets, getTargetCount, playerSelectedTargetsMetadataKey } from "../effectsTool";
import { resolveBlueprint, resolveSimpleValue } from "./blueprint";

import { APP_KEY } from "../config";
import { ALL_MANUAL_OVERRIDES } from "../assets/manual-formulas";
import { normalizeSpellId } from "../services/spellFormulaBuilder";
import { EffectInstruction } from "../types/messageListener";
import { MESSAGE_CHANNEL } from "./messageListener";
import { SimplifiedItem } from "../types/misc";
import { getItemSize } from "../utils";
import { log_error } from "../logging";
import spellsJSON from "../assets/spells_record.json";
import { constants } from "../constants";
import { resolveActiveCaster } from "../features/targeting/infrastructure/obr/activeCasterResolver";
import { getSpellMetadata } from "../assets/spellInfo";

export const spells = spellsJSON as Spells;
export const spellIDs = Object.keys(spells);

export interface Target {
    id?: string;
    position: Vector2;
    size: number;
    count?: number;
}

function itemToTarget(item: Item): Target {
    return {
        id: item.attachedTo,
        position: item.position,
        size: getItemSize(item),
        count: getTargetCount(item)
    }
}

function replicateSpell(variables: Variables[], targets: Target[], parameterValues: object, replicationType: ReplicationType) {
    if (replicationType === "no") {
        variables.push({
            targets,
            ...parameterValues
        });
    }
    else if (replicationType === "all") {
        for (const target of targets) {
            variables.push({
                targets: [target],
                ...parameterValues
            });
        }
    }
    else if (replicationType === "first_to_all") {
        const firstTarget = targets[0];
        if (targets.length === 1) {
            variables.push({
                targets: [firstTarget],
                ...parameterValues
            });
        }
        for (const target of targets.slice(1)) {
            variables.push({
                targets: [
                    firstTarget,
                    target
                ],
                ...parameterValues
            });
        }
    }
}

function copySpellVariables(variables: Variables[], copyDelay: number) {
    if (copyDelay < 0) {
        // In the case of a negative copy delay, we don't copy the variables
        // and the count of the targets is set to 1
        for (const variableSet of variables) {
            for (const target of (variableSet.targets ?? []) as { count: number }[]) {
                target.count = 1;
            }
        }
    }
    if (copyDelay > 0) {
        // In the case of a positive delay, we need to replicate the spell
        // a number of times equal to the maximum target count, and set the
        // count to 0
        const newVariables: Variables[] = [];
        for (const variableSet of variables) {
            let count = 0;
            for (const target of (variableSet.targets ?? []) as { count: number }[]) {
                count = Math.max(count, target.count);
                target.count = 1;
            }
            for (let i = 0; i < count - 1; i++) {
                newVariables.push(variableSet);
            }
        }
        variables.push(...newVariables);
    }
}

function copySpellInstructions(instructions: EffectInstruction[], copyDelay: number) {
    if (copyDelay > 0) {
        // In the case of a positive delay, we add the delay to each instruction,
        // sequentially
        for (let i = 0; i < instructions.length; i++) {
            const instruction = instructions[i];
            if (instruction.delay == undefined) {
                instruction.delay = copyDelay * i;
            }
            else {
                instruction.delay += copyDelay * i;
            }
            if (instruction.instructions) {
                copySpellInstructions(instruction.instructions, copyDelay);
            }
        }
    }
}

/**
 * Resolves a fallback visual archetype from spells_record.json for spells without dedicated animation blueprints.
 */
function resolveFallbackSpellKey(meta: { name: string; school?: string; level?: number; damage?: string }): string {
    const nameLower = meta.name.toLowerCase();
    const school = (meta.school || "").toLowerCase();
    const damage = (meta.damage || "").toLowerCase();

    // 1. Weapon / Melee cantrips and attacks
    if (nameLower.includes("blade") || nameLower.includes("strike") || nameLower.includes("smite") || (nameLower.includes("touch") && damage)) {
        if (damage.includes("thunder") || nameLower.includes("booming")) return "shatter";
        if (damage.includes("necrotic") || nameLower.includes("vengeful")) return "toll_the_dead";
        if (damage.includes("fire") || nameLower.includes("burning")) return "fire_bolt";
        if (damage.includes("cold") || nameLower.includes("frigid")) return "frostbite";
        if (damage.includes("lightning") || nameLower.includes("arc")) return "witch_bolt";
        return "melee_weapon_attack";
    }

    // 2. Specific damage elements
    if (damage.includes("fire") || nameLower.includes("fire") || nameLower.includes("burst")) {
        return meta.level === 0 ? "fire_bolt" : "burning_hands";
    }
    if (damage.includes("cold") || nameLower.includes("frost") || nameLower.includes("chill") || nameLower.includes("ice")) {
        return "ray_of_frost";
    }
    if (damage.includes("lightning") || damage.includes("shock") || nameLower.includes("lightning")) {
        return "witch_bolt";
    }
    if (damage.includes("radiant") || nameLower.includes("sacred") || nameLower.includes("divine")) {
        return "sacred_flame";
    }
    if (damage.includes("necrotic") || nameLower.includes("death") || school.includes("necro")) {
        return "toll_the_dead";
    }
    if (damage.includes("force") || nameLower.includes("blast")) {
        return "eldritch_blast";
    }

    // 3. School fallbacks
    if (school.includes("abjur")) {
        return "shield";
    }
    if (school.includes("conjur")) {
        return "misty_step";
    }
    if (school.includes("divin")) {
        return "detect_magic";
    }
    if (school.includes("enchant") || school.includes("illus")) {
        return "mind_sliver";
    }
    if (school.includes("necro")) {
        return "toll_the_dead";
    }
    if (school.includes("trans")) {
        return "bless";
    }
    if (school.includes("evoc")) {
        return "magic_missiles";
    }

    return "magic_missiles";
}

export function getSpell(spellID: string, isGM: boolean = false): Spell|undefined {
    if (spellID.startsWith("$.")) {
        const localSpellID = spellID.substring(2);
        const spellJSON = localStorage.getItem(
            isGM ? `${APP_KEY}/spells/${localSpellID}` : `${APP_KEY}/spells/${OBR.room.id}/${localSpellID}`
        );
        if (spellJSON == undefined) {
            return undefined;
        }
        const spell = JSON.parse(spellJSON);
        return spell;
    }
    if (spells[spellID]) {
        return spells[spellID];
    }

    const norm = spellID.toLowerCase().replace(/[^a-z0-9_]/g, "");
    if (spells[norm]) return spells[norm];
    if (norm === "magic_missile" && spells["magic_missiles"]) return spells["magic_missiles"];

    // Dynamic resolution for D&D Beyond spells: map to fallback animation archetype
    const meta = getSpellMetadata(spellID);
    if (meta && meta.name) {
        const archetypeKey = resolveFallbackSpellKey(meta);
        if (spells[archetypeKey]) {
            return {
                ...spells[archetypeKey],
                name: meta.name,
                thumbnail: undefined // Never inherit another spell's thumbnail to prevent duplicate icons
            };
        }
    }

    return undefined;
}

/**
 * Returns the effective casting range in feet for a spell.
 */
export function getSpellRange(spell?: Spell, spellID?: string): number {
    const rawId = spellID ?? spell?.name ?? "";
    const norm = rawId.toLowerCase().replace(/[^a-z0-9_]/g, "");
    if (norm === "misty_step" || norm.includes("misty_step")) return 30;

    if (rawId) {
        const manual = ALL_MANUAL_OVERRIDES[rawId] ?? ALL_MANUAL_OVERRIDES[normalizeSpellId(spell?.name ?? rawId)];
        const manualRange = manual?.casting.range ?? "";
        const manualRangeMatch = manualRange.match(/(\d+)\s*-?\s*ft/i);
        if (manualRangeMatch) return Number(manualRangeMatch[1]);
        if (/touch/i.test(manualRange)) return 5;
        if (/self/i.test(manualRange)) {
            if (manual?.interaction?.type === "weapon_based") return manual.interaction.weaponAttack?.rangedSpellAttack?.rangeFeet ?? 5;
            return 0;
        }
        const normalizedId = rawId.toLowerCase();
        if (normalizedId === "melee_weapon_attack" || normalizedId.includes("unarmed")) return 5;
        const meta = getSpellMetadata(rawId);
        if (meta?.range) {
            const rangeLower = meta.range.toLowerCase();
            if (rangeLower.includes("touch")) return 5;
            const match = meta.range.match(/(\d+)\s*ft/i);
            if (match) return parseInt(match[1], 10);
            if (rangeLower.includes("self")) {
                const idLower = rawId.toLowerCase();
                if (idLower.includes("blade") || idLower.includes("strike") || idLower.includes("melee") || idLower.includes("unarmed")) return 5;
                return 0;
            }
        }
    }
    if (spell?.range != undefined) return spell.range;
    return 60; // Standard 60 ft fallback
}

/**
 * Returns AoE template parameters if the spell is an Area of Effect spell.
 */
export function getSpellAoE(spell?: Spell, spellID?: string): { shape: "Sphere" | "Cone" | "Cube" | "Line"; size: number } | undefined {
    let customSize: number | undefined = undefined;
    if (spellID) {
        try {
            const raw = localStorage.getItem(`${APP_KEY}/spell-parameters/${spellID}`);
            if (raw) {
                const parsed = JSON.parse(raw);
                const val = parsed.length ?? parsed.radius ?? parsed.size;
                if (typeof val === "number" && val > 0) {
                    customSize = val * 5; // Convert cells to feet (5ft per cell)
                }
            }
        } catch {}
        // Correct legacy blueprint bugs where original blueprints stored diameter (or doubled values) instead of radius in cells
        const normalizedId = spellID.toLowerCase().replace(/[^a-z0-9_]/g, "");
        const legacyDiscrepancies: Record<string, { legacySizes: number[]; correctSize: number }> = {
            burning_hands: { legacySizes: [25], correctSize: 15 },
            fireball: { legacySizes: [50], correctSize: 20 },
            darkness: { legacySizes: [30], correctSize: 15 },
            shatter: { legacySizes: [20], correctSize: 10 },
            spirit_guardians: { legacySizes: [30], correctSize: 15 },
            fog_cloud: { legacySizes: [40], correctSize: 20 },
            cloudkill: { legacySizes: [40], correctSize: 20 },
            silence: { legacySizes: [40], correctSize: 20 },
            arms_of_hadar: { legacySizes: [20], correctSize: 10 },
            antilife_shell: { legacySizes: [20], correctSize: 10 },
            thunder_step: { legacySizes: [20], correctSize: 10 },
            moonbeam: { legacySizes: [10], correctSize: 5 },
            call_lightning: { legacySizes: [125], correctSize: 60 },
            sleet_storm: { legacySizes: [25], correctSize: 40 },
            wall_of_fire: { legacySizes: [30], correctSize: 10 },
            wall_of_force: { legacySizes: [30], correctSize: 10 },
            whirlwind: { legacySizes: [15], correctSize: 10 },
            detect_magic: { legacySizes: [60], correctSize: 30 }
        };

        for (const [key, rule] of Object.entries(legacyDiscrepancies)) {
            if (normalizedId.includes(key) && customSize != null && rule.legacySizes.includes(customSize)) {
                customSize = rule.correctSize;
                break;
            }
        }
    }

    // 1. Single Source of Truth: Manual Formula Catalog (566+ spells)
    const manual = spellID
        ? ALL_MANUAL_OVERRIDES[spellID] ?? ALL_MANUAL_OVERRIDES[normalizeSpellId(spell?.name ?? spellID)]
        : undefined;
    if (manual?.area) {
        let shape: "Sphere" | "Cone" | "Cube" | "Line" = "Sphere";
        if (manual.area.shape === "Cone") shape = "Cone";
        else if (manual.area.shape === "Cube") shape = "Cube";
        else if (manual.area.shape === "Line") shape = "Line";
        else shape = "Sphere";
        return { shape, size: customSize ?? manual.area.sizeFeet };
    }

    // 2. OBR Custom / Local Spell Item AoE
    if (spell?.aoeShape && spell?.aoeSize) {
        return { shape: spell.aoeShape, size: customSize ?? spell.aoeSize };
    }

    // 3. Fallback: Parse dynamic metadata from D&D Beyond description if not in catalog
    if (spellID) {
        const meta = getSpellMetadata(spellID);
        if (meta?.aoe) {
            const sphereMatch = meta.aoe.match(/(\d+)\s*ft\s*(radius\s*)?(Sphere|Emanation|Cylinder|Burst|Cloud)/i);
            if (sphereMatch) {
                const size = parseInt(sphereMatch[1], 10);
                return { shape: "Sphere", size: customSize ?? size };
            }
            const coneMatch = meta.aoe.match(/(\d+)\s*ft\s*Cone/i);
            if (coneMatch) {
                const size = parseInt(coneMatch[1], 10);
                return { shape: "Cone", size: customSize ?? size };
            }
            const cubeMatch = meta.aoe.match(/(\d+)\s*ft\s*(Square|Cube)/i);
            if (cubeMatch) {
                const size = parseInt(cubeMatch[1], 10);
                return { shape: "Cube", size: customSize ?? size };
            }
            const lineMatch = meta.aoe.match(/(\d+)\s*ft.*Line/i);
            if (lineMatch) {
                const size = parseInt(lineMatch[1], 10);
                return { shape: "Line", size: customSize ?? size };
            }
        }
    }

    return undefined;
}

export async function getAllSpellNames(): Promise<string[]> {
    const metadata = await OBR.scene.getMetadata();
    const spellList = (metadata[constants.SPELL_LIST_METADATA_KEY] ?? []) as string[];
    return [...spellIDs, ...spellList.map(spell => `$.${spell}`)];
}

export function destroySpell(spellID: string, playerID: string, items: Item[], isGM: boolean = false) {
    const spell = getSpell(spellID, isGM);
    if (spell == undefined) {
        log_error(`Unknown spell "${spellID}"`);
        return;
    }

    const instructions: EffectInstruction[] = [];
    // FIXME: this should probably work more similarly to doSpell
    const variables: Variables = {
        targets: items.map(item => ({
            id: item.id,
            attachedId: item.attachedTo,
            position: item.position,
            size: getItemSize(item),
            count: 1
        }))
    };

    const { value, error } = resolveBlueprint(spell.onDestroyBlueprints ?? [], variables);
    if (error) {
        OBR.notification.show(`Blueprint error: ${error}`, "ERROR");
        return;
    }
    instructions.push(...value?.instructions ?? []);

    const message = {
        instructions,
        spellData: {
            name: spellID,
            caster: playerID
        }
    };
    OBR.broadcast.sendMessage(MESSAGE_CHANNEL, message, { destination: "ALL" });
}

function enforceSpellRules(targets: Target[], minTargets?: number, maxTargets?: number) {
    if (minTargets != undefined && targets.length < minTargets) {
        return `Please select at least ${minTargets} target(s) (${targets.length} selected)`;
    }

    if (maxTargets != undefined && targets.length > maxTargets) {
        return `Please select at most ${maxTargets} target(s) (${targets.length} selected)`;
    }

    return null;
}

function tokenMatchStrength(casterToken: SimplifiedItem, token: Image) {
    if (casterToken.image.url !== token.image.url) {
        return 0;
    }
    let strength = 0;
    if (token.visible) {
        strength += 100;
    }
    if (casterToken.name === token.name) {
        strength++;
    }
    if (casterToken.grid.dpi === token.grid.dpi) {
        strength++;
    }
    if (casterToken.grid.offset.x === token.grid.offset.x && casterToken.grid.offset.y === token.grid.offset.y) {
        strength++;
    }
    if (casterToken.image.height === token.image.height) {
        strength++;
    }
    if (casterToken.image.width === token.image.width) {
        strength++;
    }
    return strength;
}

async function setFirstTarget(firstTargetIsCasterBP: BlueprintValue<boolean> | undefined, targets: Target[], parameters: Record<string, unknown>, replicationType: ReplicationType, maxTargets?: number, playerID?: string, isGM: boolean = false) {
    const variables: Variables = {
        targets,
        ...parameters
    };

    const { value, error } = resolveSimpleValue(firstTargetIsCasterBP, "firstTargetIsCaster", "boolean", variables);
    if (error) {
        log_error(error);
    }
    const firstTargetIsCaster = value ?? replicationType === "first_to_all";
    if (!firstTargetIsCaster) {
        return;
    }
    if (maxTargets && targets.length >= maxTargets) {
        return;
    }

    const casterTokens = getSettingsValue(LOCAL_STORAGE_KEYS.DEFAULT_CASTER);
    if (casterTokens && casterTokens.length > 0) {
        if (targets.length > 0 && targets[0].id) {
            const possibleCasterToken = (await OBR.scene.items.getItems([targets[0].id]))[0];
            if (possibleCasterToken && isImage(possibleCasterToken)) {
                for (const casterToken of casterTokens) {
                    if (tokenMatchStrength(casterToken, possibleCasterToken)) {
                        // Player still selected themselves
                        return;
                    }
                }
            }
        }

        // Let's try to find the caster
        const items = await OBR.scene.items.getItems();
        let match: Item|undefined = undefined;
        let matchStrength = 0;

        for (const item of items) {
            if (!isImage(item)) {
                continue;
            }
            for (const casterToken of casterTokens) {
                const strength = tokenMatchStrength(casterToken, item);
                if (strength > matchStrength) {
                    matchStrength = strength;
                    match = item;
                }
            }
        }

        if (match !== undefined) {
            // We found a match, add it to targets
            targets.unshift({
                id: match.id,
                count: 1,
                position: match.position,
                size: getItemSize(match)
            });
            return;
        }
    }

    // Auto-resolve active caster if no default caster set or matched
    if (playerID) {
        const activeCaster = await resolveActiveCaster(isGM ? "GM" : "PLAYER", playerID);
        if (activeCaster) {
            // If target 0 is already the active caster, do nothing
            if (targets.length > 0 && targets[0].id === activeCaster.id) {
                return;
            }
            targets.unshift({
                id: activeCaster.id,
                count: 1,
                position: activeCaster.position,
                size: getItemSize(activeCaster.item)
            });
        }
    }
}

export async function doSpell(spellID: string, playerID: string, isGM: boolean) {
    const spell = getSpell(spellID, isGM);
    if (spell == undefined) {
        log_error(`Unknown spell "${spellID}"`);
        return;
    }
    const settingsGridScaleFactor = getSettingsValue(LOCAL_STORAGE_KEYS.GRID_SCALING_FACTOR);
    const gridScaleFactorPromise = settingsGridScaleFactor != null ? new Promise(resolve => resolve(settingsGridScaleFactor)) : getDefaultGridScaleFactor();
    const [targets, gridScaleFactor] = await Promise.all([getSortedTargets(), gridScaleFactorPromise]);

    const replicationType = spell.replicate ?? "no";
    const copyDelay = spell.copy ?? 150;
    const parameterValuesString = localStorage.getItem(`${APP_KEY}/spell-parameters/${spellID}`);

    const parameterValues = parameterValuesString ? JSON.parse(parameterValuesString) : {};
    const normId = spellID.toLowerCase().replace(/[^a-z0-9_]/g, "");
    const spriteHealingMap: Record<string, { wrongRadius: number[]; correctDiameter: number }> = {
        darkness: { wrongRadius: [3], correctDiameter: 6 },
        fireball: { wrongRadius: [4], correctDiameter: 8 },
        shatter: { wrongRadius: [2], correctDiameter: 4 },
        spirit_guardians: { wrongRadius: [3], correctDiameter: 6 },
        fog_cloud: { wrongRadius: [4], correctDiameter: 8 },
        cloudkill: { wrongRadius: [4], correctDiameter: 8 },
        silence: { wrongRadius: [4], correctDiameter: 8 },
        arms_of_hadar: { wrongRadius: [2], correctDiameter: 4 },
        moonbeam: { wrongRadius: [1], correctDiameter: 2 },
        thunder_step: { wrongRadius: [2], correctDiameter: 4 },
        antilife_shell: { wrongRadius: [2], correctDiameter: 4 },
        detect_magic: { wrongRadius: [6], correctDiameter: 12 },
        burning_hands: { wrongRadius: [5], correctDiameter: 3 }
    };

    for (const parameter of spell.parameters ?? []) {
        if (parameterValues[parameter.id] == undefined) {
            parameterValues[parameter.id] = parameter.defaultValue;
        }
        if (parameter.id === "radius" || parameter.id === "length" || parameter.id === "size") {
            const rule = spriteHealingMap[normId];
            if (rule && rule.wrongRadius.includes(parameterValues[parameter.id] as number)) {
                parameterValues[parameter.id] = rule.correctDiameter;
                try {
                    localStorage.setItem(`${APP_KEY}/spell-parameters/${spellID}`, JSON.stringify({ ...parameterValues, [parameter.id]: rule.correctDiameter }));
                } catch {}
            }
            // FIXME: this doesn't seem like a clean way to do it
            parameterValues[parameter.id] *= gridScaleFactor as number;
        }
    }

    const instructions: EffectInstruction[] = [];
    const interactionIds = new Set<string>();
    let interactionCount = 0;
    const variables: Variables[] = [];
    const targetObjects = targets.map(target => itemToTarget(target));

    // For Self-centered sphere AoE spells (e.g. Detect Magic, Spirit Guardians), the only valid target is the active caster!
    const spellAoE = getSpellAoE(spell, spellID);
    const spellMaxRange = getSpellRange(spell, spellID);
    if (spellAoE?.shape === "Sphere" && spellMaxRange === 0) {
        const activeCaster = await resolveActiveCaster(isGM ? "GM" : "PLAYER", playerID);
        if (activeCaster) {
            targetObjects.length = 0;
            targetObjects.push({
                id: activeCaster.id,
                position: activeCaster.position,
                size: getItemSize(activeCaster.item),
                count: 1
            });
        }
    } else {
        await setFirstTarget(spell.firstTargetIsCaster, targetObjects, parameterValues, replicationType, spell.maxTargets, playerID, isGM);
    }
    replicateSpell(variables, targetObjects, parameterValues, replicationType);
    copySpellVariables(variables, copyDelay);

    const error = enforceSpellRules(targetObjects, spell.minTargets, spell.maxTargets);
    if (error) {
        OBR.notification.show(error, "ERROR");
        return;
    }

    if (!getSettingsValue(LOCAL_STORAGE_KEYS.KEEP_SELECTED_TARGETS)) {
        if (targets.length > 0) {
            OBR.scene.local.deleteItems(targets.map(item => item.id));
        }
        OBR.player.setMetadata({ [playerSelectedTargetsMetadataKey]: [] });
    }

    for (const variableSet of variables) {
        // Add all targets back into variableSet
        variableSet.globalTargets = targetObjects;
        const { value, error } = resolveBlueprint(spell.blueprints ?? [], variableSet);
        if (error) {
            OBR.notification.show(`Blueprint error: ${error}`, "ERROR");
            return;
        }
        instructions.push(...value?.instructions ?? []);
        for (const interaction of value?.interactions?.ids ?? []) {
            interactionIds.add(interaction);
        }
        interactionCount += value?.interactions?.count ?? 0;
    }

    copySpellInstructions(instructions, copyDelay);

    const message = {
        instructions,
        interactions: {
            ids: Array.from(interactionIds.values()),
            count: interactionCount,
        },
        spellData: {
            name: spellID,
            caster: playerID
        }
    };
    OBR.broadcast.sendMessage(MESSAGE_CHANNEL, message, { destination: "ALL" });
}
