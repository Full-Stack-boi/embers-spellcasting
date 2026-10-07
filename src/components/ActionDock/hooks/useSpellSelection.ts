import { useMemo, type Dispatch, type SetStateAction } from "react";
import OBR from "@owlbear-rodeo/sdk";
import { hexChosenAbilityMetadataKey, selectedSpellDamageTypeMetadataKey, selectedSpellSlotLevelMetadataKey } from "../../../effectsTool";
import { resolveSpellFormula } from "../../../services/spellFormulaBuilder";
import type { SpellFormulaRegistry } from "../../../services/spellFormulaRegistry";
import type { DDBParsedCharacter } from "../../../types/ddb";
import type { SpellSlotConfig, DockSpell } from "../domain/types";

interface UseSpellSelectionOptions {
    spells: DockSpell[];
    character: DDBParsedCharacter | null;
    spellRegistry: SpellFormulaRegistry | null;
    spellSlots: Record<number, SpellSlotConfig>;
    pactSlots: SpellSlotConfig;
    spellId: string | null;
    selectedHexAbility: string;
    damageTypeOverrides: Record<string, string>;
    setSpellId: Dispatch<SetStateAction<string | null>>;
    setSelectedLevel: Dispatch<SetStateAction<number>>;
    setCastLevel: Dispatch<SetStateAction<number>>;
    setDamageTypeOverrides: Dispatch<SetStateAction<Record<string, string>>>;
    setActiveFeatureId: Dispatch<SetStateAction<string | null>>;
    onSelectSpell: (spellId: string) => void;
    onCancelAiming: () => void;
}

export function useSpellSelection({
    spells,
    character,
    spellRegistry,
    spellSlots,
    pactSlots,
    spellId,
    selectedHexAbility,
    damageTypeOverrides,
    setSpellId,
    setSelectedLevel,
    setCastLevel,
    setDamageTypeOverrides,
    setActiveFeatureId,
    onSelectSpell,
    onCancelAiming,
}: UseSpellSelectionOptions) {
    const getAvailableSlotLevels = (baseLevel: number): number[] => Array.from({ length: 9 }, (_, index) => index + 1).filter(level => {
        if (level < baseLevel) return false;
        if (character?.pactMagic && level === character.pactMagic.level && pactSlots.max > 0) return true;
        const slot = spellSlots[level];
        return Boolean(slot && slot.max > 0);
    });

    const getRemainingSlots = (level: number): number => {
        let count = 0;
        const slot = spellSlots[level];
        if (slot) count += Math.max(0, slot.max - slot.used);
        if (character?.pactMagic && level === character.pactMagic.level) {
            count += Math.max(0, pactSlots.max - pactSlots.used);
        }
        return count;
    };

    const getSpellChoices = (spell: { id: string; name?: string }): string[] | null => {
        const spellData = spells.find(item => item.id === spell.id) || spell;
        const name = (spellData.name || "").toLowerCase().trim();
        const choicesBySpell: Record<string, string[]> = {
            "sorcerous burst": ["acid", "cold", "fire", "lightning", "poison", "psychic", "thunder"],
            "chromatic orb": ["acid", "cold", "fire", "lightning", "poison", "thunder"],
            "dragon's breath": ["acid", "cold", "fire", "lightning", "poison"],
            "enhance ability": ["bear", "bull", "cat", "eagle", "fox", "owl"],
            "enlarge/reduce": ["enlarge", "reduce"],
            "enlarge reduce": ["enlarge", "reduce"],
            "blindness/deafness": ["blindness", "deafness"],
            "blindness deafness": ["blindness", "deafness"],
            command: ["approach", "drop", "flee", "grovel", "halt"],
            "glyph of warding": ["explosive_runes", "spell_glyph"],
            "protection from energy": ["acid", "cold", "fire", "lightning", "thunder"],
            "absorb elements": ["acid", "cold", "fire", "lightning", "thunder"],
        };
        if (choicesBySpell[name]) return choicesBySpell[name];

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formula = spellRegistry?.get(spell.id) ?? resolveSpellFormula(spellData as any);
        const choiceDamage = formula?.damage?.find(damage => damage.type === "choice");
        return choiceDamage?.typeChoices?.length ? choiceDamage.typeChoices : null;
    };

    const activeFlyoutSpell = useMemo(() => {
        if (!spellId) return null;
        return spells.find(spell => spell.id === spellId) || null;
    }, [spellId, spells]);

    const handleOpenUpcastPicker = (spell: { id: string; name?: string; level?: number; usesSpellSlot?: boolean }) => {
        const fullSpell = spells.find(item => item.id === spell.id) || spell;
        const choices = getSpellChoices(fullSpell);
        const level = typeof fullSpell.level === "number" ? fullSpell.level : 0;
        const usesSlot = fullSpell.usesSpellSlot !== false;
        const isLeveled = level > 0 && usesSlot;
        const availableLevels = isLeveled ? getAvailableSlotLevels(level) : [];
        const isHex = fullSpell.name?.toLowerCase() === "hex" || fullSpell.id.toLowerCase() === "hex";

        if (spellId === fullSpell.id) {
            onCancelAiming();
            return;
        }

        setActiveFeatureId(null);
        setSpellId(fullSpell.id);
        onSelectSpell(fullSpell.id);

        if (isLeveled) {
            const firstAvailable = availableLevels.find(availableLevel => getRemainingSlots(availableLevel) > 0) ?? level;
            setSelectedLevel(firstAvailable);
            setCastLevel(firstAvailable);
            OBR.player.setMetadata({
                [selectedSpellSlotLevelMetadataKey]: { spellId: fullSpell.id, slotLevel: firstAvailable },
            }).catch(() => {});
        } else {
            setSelectedLevel(0);
            setCastLevel(0);
        }

        if (choices?.length) {
            const selectedChoice = damageTypeOverrides[fullSpell.id] || choices[0];
            if (!damageTypeOverrides[fullSpell.id]) {
                setDamageTypeOverrides(previous => ({ ...previous, [fullSpell.id]: choices[0] }));
            }
            OBR.player.setMetadata({
                [selectedSpellDamageTypeMetadataKey]: { spellId: fullSpell.id, damageType: selectedChoice },
            }).catch(() => {});
        }

        if (isHex) {
            OBR.player.setMetadata({
                [hexChosenAbilityMetadataKey]: selectedHexAbility || "dexterity",
            }).catch(() => {});
        }
    };

    return { activeFlyoutSpell, getAvailableSlotLevels, getRemainingSlots, getSpellChoices, handleOpenUpcastPicker };
}
