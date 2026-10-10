import { useEffect, useRef } from "react";
import type { Dispatch, SetStateAction, MutableRefObject } from "react";
import type { DDBParsedCharacter } from "../../../types/ddb";
import { loadCombatState, saveCombatState, type DdbResourceBaseline } from "../../../services/combatStateService";
import type { SpellSlotConfig } from "../domain/types";
import { extractDdbBaseline } from "../domain/resourceMerge";

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
    ddbBaselineRef?: MutableRefObject<DdbResourceBaseline>;
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
    ddbBaselineRef,
}: UseCombatStatePersistenceOptions) {
    const loadedCharIdRef = useRef<number | null>(null);
    const internalBaselineRef = useRef<DdbResourceBaseline>({});
    const effectiveBaselineRef = ddbBaselineRef || internalBaselineRef;

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
                effectiveBaselineRef.current = character ? extractDdbBaseline(character) : {};
                return;
            }
            effectiveBaselineRef.current = persisted.ddbBaseline ?? (character ? extractDdbBaseline(character) : {});
            if (persisted.createdSpellSlots) {
                setSpellSlots(previous => {
                    const next = { ...previous };
                    for (const [levelString, created] of Object.entries(persisted.createdSpellSlots ?? {})) {
                        const level = Number(levelString);
                        if (next[level]) {
                            next[level] = { ...next[level], max: next[level].max + created };
                        } else if (character?.spellSlots?.[level]) {
                            next[level] = { max: character.spellSlots[level].max + created, used: 0 };
                        }
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
                        if (next[level]) {
                            next[level] = { ...next[level], used: Math.min(next[level].max, used) };
                        } else if (character?.spellSlots?.[level]) {
                            const max = character.spellSlots[level].max + (persisted.createdSpellSlots?.[level] ?? 0);
                            next[level] = { max, used: Math.min(max, used) };
                        }
                    }
                    return next;
                });
            }
            if (typeof persisted.pactSlotsUsed === "number") {
                setPactSlots(previous => {
                    const max = previous.max > 0 ? previous.max : (character?.pactMagic?.max ?? 0);
                    return { ...previous, max, used: Math.min(max, persisted.pactSlotsUsed) };
                });
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
                ddbBaseline: effectiveBaselineRef.current,
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

    return { ddbBaselineRef: effectiveBaselineRef };
}
