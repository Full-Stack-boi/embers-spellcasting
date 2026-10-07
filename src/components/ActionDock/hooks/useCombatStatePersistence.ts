import { useEffect, useRef } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { DDBParsedCharacter } from "../../../types/ddb";
import { loadCombatState, saveCombatState } from "../../../services/combatStateService";
import type { SpellSlotConfig } from "../domain/types";

type StateSetter<T> = Dispatch<SetStateAction<T>>;
type CustomHp = { current: number; max: number; temp: number } | null;
type ConcentrationSpell = { id: string; name: string } | null;
type DeathSaves = { successes: number; failures: number };

interface UseCombatStatePersistenceOptions {
    character: DDBParsedCharacter | null;
    spellSlots: Record<number, SpellSlotConfig>;
    setSpellSlots: StateSetter<Record<number, SpellSlotConfig>>;
    createdSpellSlots: Record<number, number>;
    setCreatedSpellSlots: StateSetter<Record<number, number>>;
    pactSlots: SpellSlotConfig;
    setPactSlots: StateSetter<SpellSlotConfig>;
    featureUses: Record<string, number>;
    setFeatureUses: StateSetter<Record<string, number>>;
    customHp: CustomHp;
    setCustomHp: StateSetter<CustomHp>;
    actionUsed: boolean;
    setActionUsed: StateSetter<boolean>;
    bonusActionUsed: boolean;
    setBonusActionUsed: StateSetter<boolean>;
    heroicInspiration: boolean;
    setHeroicInspiration: StateSetter<boolean>;
    concentrationSpell: ConcentrationSpell;
    setConcentrationSpell: StateSetter<ConcentrationSpell>;
    deathSaves: DeathSaves;
    setDeathSaves: StateSetter<DeathSaves>;
    hitDiceUsed: Record<string, number>;
    setHitDiceUsed: StateSetter<Record<string, number>>;
    exhaustionLevel: number;
    setExhaustionLevel: StateSetter<number>;
    conditions: string[];
    setConditions: StateSetter<string[]>;
}

export function useCombatStatePersistence({
    character,
    spellSlots,
    setSpellSlots,
    createdSpellSlots,
    setCreatedSpellSlots,
    pactSlots,
    setPactSlots,
    featureUses,
    setFeatureUses,
    customHp,
    setCustomHp,
    actionUsed,
    setActionUsed,
    bonusActionUsed,
    setBonusActionUsed,
    heroicInspiration,
    setHeroicInspiration,
    concentrationSpell,
    setConcentrationSpell,
    deathSaves,
    setDeathSaves,
    hitDiceUsed,
    setHitDiceUsed,
    exhaustionLevel,
    setExhaustionLevel,
    conditions,
    setConditions,
}: UseCombatStatePersistenceOptions) {
    const loadedCharIdRef = useRef<number | null>(null);

    useEffect(() => {
        if (!character?.id) {
            loadedCharIdRef.current = null;
            setConcentrationSpell(null);
            return;
        }
        setConcentrationSpell(null);
        loadCombatState(character.id).then(persisted => {
            loadedCharIdRef.current = character.id;
            if (!persisted) {
                setConcentrationSpell(null);
                return;
            }
            if (persisted.createdSpellSlots) {
                setSpellSlots(previous => {
                    const next = { ...previous };
                    for (const [levelString, created] of Object.entries(persisted.createdSpellSlots ?? {})) {
                        const level = Number(levelString);
                        if (next[level]) next[level] = { ...next[level], max: next[level].max + created };
                    }
                    return next;
                });
                setCreatedSpellSlots(persisted.createdSpellSlots);
            }
            if (persisted.spellSlotsUsed) {
                setSpellSlots(previous => {
                    const next = { ...previous };
                    for (const [levelString, used] of Object.entries(persisted.spellSlotsUsed)) {
                        const level = Number(levelString);
                        if (next[level]) next[level] = { ...next[level], used: Math.min(next[level].max, used) };
                    }
                    return next;
                });
            }
            if (typeof persisted.pactSlotsUsed === "number") {
                setPactSlots(previous => ({ ...previous, used: Math.min(previous.max, persisted.pactSlotsUsed) }));
            }
            if (persisted.featureUses) setFeatureUses(persisted.featureUses);
            if (typeof persisted.hpCurrent === "number" && character.hp) {
                setCustomHp({ current: persisted.hpCurrent, max: character.hp.max, temp: persisted.hpTemp || 0 });
            }
            if (typeof persisted.actionUsed === "boolean") setActionUsed(persisted.actionUsed);
            if (typeof persisted.bonusActionUsed === "boolean") setBonusActionUsed(persisted.bonusActionUsed);
            if (typeof persisted.heroicInspiration === "boolean") setHeroicInspiration(persisted.heroicInspiration);
            if (persisted.concentrationSpellId && persisted.concentrationSpellName) {
                setConcentrationSpell({ id: persisted.concentrationSpellId, name: persisted.concentrationSpellName });
            } else {
                setConcentrationSpell(null);
            }
            if (persisted.deathSaves) setDeathSaves(persisted.deathSaves);
            if (persisted.hitDiceUsed) setHitDiceUsed(persisted.hitDiceUsed);
            if (typeof persisted.exhaustionLevel === "number") setExhaustionLevel(persisted.exhaustionLevel);
            if (Array.isArray(persisted.conditions)) setConditions(persisted.conditions);
        }).catch(console.error);
    }, [character?.id]);

    useEffect(() => {
        if (!character?.id || loadedCharIdRef.current !== character.id) return;
        const timer = setTimeout(() => {
            const slotsUsed: Record<number, number> = {};
            for (const [level, config] of Object.entries(spellSlots)) {
                if (config.used > 0) slotsUsed[Number(level)] = config.used;
            }
            saveCombatState(character.id, {
                spellSlotsUsed: slotsUsed,
                createdSpellSlots,
                pactSlotsUsed: pactSlots.used,
                featureUses,
                hpCurrent: customHp?.current ?? null,
                hpTemp: customHp?.temp ?? 0,
                actionUsed,
                bonusActionUsed,
                heroicInspiration,
                concentrationSpellId: concentrationSpell?.id ?? null,
                concentrationSpellName: concentrationSpell?.name ?? null,
                deathSaves,
                hitDiceUsed,
                exhaustionLevel,
                conditions,
            }).catch(console.error);
        }, 500);
        return () => clearTimeout(timer);
    }, [
        character?.id,
        spellSlots,
        createdSpellSlots,
        pactSlots.used,
        featureUses,
        customHp,
        actionUsed,
        bonusActionUsed,
        heroicInspiration,
        concentrationSpell,
        deathSaves,
        hitDiceUsed,
        exhaustionLevel,
        conditions,
    ]);

}
