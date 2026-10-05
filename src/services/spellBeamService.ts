/**
 * Spell Beam Service
 *
 * Resolves the effective number of beams, projectiles, or enemy targets required
 * for spells and attacks based on character level, spell slot level, and blueprint metadata.
 *
 * Rules:
 *  - Melee & Ranged Weapon Attacks: exactly 1 target.
 *  - Single-target Cantrips & Spells (Fire Bolt, Sorcerous Burst, Ray of Frost, Sacred Flame, Witch Bolt, etc.): exactly 1 target.
 *  - Multi-beam Cantrips (Eldritch Blast): 1 beam at lv 1-4, 2 at lv 5-10, 3 at lv 11-16, 4 at lv 17-20.
 *  - Multi-beam Leveled Spells (Scorching Ray, Magic Missile): base beams + scaling per upcast slot level.
 *  - Legacy Blueprint Correction: Spells with maxTargets === 2 that count the caster as target 0 (melee_weapon_attack, sacred_flame)
 *    are corrected so that only 1 enemy target click is required.
 */

import rawSpellsRecord from "../assets/spells_record.json";
import type { Spells } from "../types/spells";

const spellsRecord = rawSpellsRecord as unknown as Spells;

export interface SpellBeamInfo {
    /** Total number of beams, projectiles, or enemy targets needed to cast */
    totalBeams: number;
    /** Whether multiple beams can be directed at the same target or split among different targets */
    canSplitTargets: boolean;
    /** True if more than 1 beam is fired */
    isMultiBeam: boolean;
    /** Human-readable label (e.g. "Beam", "Ray", "Dart", "Target") */
    beamUnit: string;
}

/**
 * Normalizes a spell or attack ID for matching.
 */
function normalizeId(id: string): string {
    return id.toLowerCase().replace(/[^a-z0-9_]/g, "");
}

/**
 * Calculates effective beam count and targeting rules for any spell or attack.
 *
 * @param spellId The spell ID or weapon attack ID (e.g. "eldritch_blast", "sorcerous_burst", "melee_weapon_attack")
 * @param characterLevel Caster character level (default 1)
 * @param castSlotLevel Slot level if upcast (default undefined)
 */
export function getSpellBeamInfo(
    spellId: string,
    characterLevel: number = 1,
    castSlotLevel?: number,
    isGM: boolean = false
): SpellBeamInfo {
    const norm = normalizeId(spellId);

    // 1. Weapon Attacks (Always 1 target per attack)
    if (norm === "melee_weapon_attack" || norm === "ranged_weapon_attack" || norm.includes("unarmed") || norm.includes("weapon")) {
        return {
            totalBeams: 1,
            canSplitTargets: false,
            isMultiBeam: false,
            beamUnit: "Target",
        };
    }

    // 2. Eldritch Blast (Cantrip - scales with character level: 1 / 2 / 3 / 4 beams)
    if (norm.includes("eldritch_blast")) {
        const beams = characterLevel >= 17 ? 4 : characterLevel >= 11 ? 3 : characterLevel >= 5 ? 2 : 1;
        return {
            totalBeams: beams,
            canSplitTargets: true,
            isMultiBeam: beams > 1,
            beamUnit: "Beam",
        };
    }

    // 3. Scorching Ray (Level 2 - 3 rays + 1 per slot level above 2nd)
    if (norm.includes("scorching_ray")) {
        const slot = castSlotLevel ?? 2;
        const beams = 3 + Math.max(0, slot - 2);
        return {
            totalBeams: beams,
            canSplitTargets: true,
            isMultiBeam: true,
            beamUnit: "Ray",
        };
    }

    // 4. Magic Missile (Level 1 - 3 darts + 1 per slot level above 1st)
    if (norm.includes("magic_missile") || norm.includes("magic_missiles")) {
        const slot = castSlotLevel ?? 1;
        const beams = 3 + Math.max(0, slot - 1);
        return {
            totalBeams: beams,
            canSplitTargets: true,
            isMultiBeam: true,
            beamUnit: "Dart",
        };
    }

    // 5. Standard single-target cantrips & spells (Sorcerous Burst, Fire Bolt, Ray of Frost, Sacred Flame, Witch Bolt, etc.)
    // Even if damage scales with level (e.g. 2d8 for Sorcerous Burst at lv5), it remains 1 attack / 1 enemy target.
    const singleTargetCantrips = [
        "sorcerous_burst",
        "fire_bolt",
        "ray_of_frost",
        "frostbite",
        "sacred_flame",
        "toll_the_dead",
        "shocking_grasp",
        "chill_touch",
        "poison_spray",
        "acid_splash",
        "vicious_mockery",
        "mind_sliver",
        "primal_savagery",
        "thorn_whip",
        "produce_flame",
        "booming_blade",
        "green_flame_blade",
        "frigid_blade",
        "witch_bolt",
        "guiding_bolt",
        "inflict_wounds",
        "divine_smite",
        "chaos_bolt",
        "chromatic_orb",
        "disintegrate",
        "blight",
    ];

    if (singleTargetCantrips.some(c => norm.includes(c))) {
        return {
            totalBeams: 1,
            canSplitTargets: false,
            isMultiBeam: false,
            beamUnit: "Target",
        };
    }

    // 6. Check Blueprint definitions from spells_record.json
    let spell = spellsRecord[norm] || spellsRecord[spellId];
    if (!spell && spellId.startsWith("$.") && typeof localStorage !== "undefined") {
        try {
            const localSpellID = spellId.substring(2);
            const key = isGM ? `embers/spells/${localSpellID}` : `embers/spells/local/${localSpellID}`;
            const raw = localStorage.getItem(key);
            if (raw) spell = JSON.parse(raw);
        } catch {}
    }
    if (spell) {
        // If the blueprint specifies minTargets: 2 and maxTargets: 2 with firstTargetIsCaster / replicate: "first_to_all",
        // target 0 is the caster, meaning only 1 ENEMY token needs to be clicked.
        if (spell.maxTargets != null) {
            const countsCaster = spell.replicate === "first_to_all" || spell.minTargets === 2;
            const effectiveEnemyTargets = countsCaster ? Math.max(1, spell.maxTargets - 1) : spell.maxTargets;
            return {
                totalBeams: effectiveEnemyTargets,
                canSplitTargets: effectiveEnemyTargets > 1,
                isMultiBeam: effectiveEnemyTargets > 1,
                beamUnit: "Target",
            };
        }
    }

    // Default fallback: 1 enemy target
    return {
        totalBeams: 1,
        canSplitTargets: false,
        isMultiBeam: false,
        beamUnit: "Target",
    };
}
