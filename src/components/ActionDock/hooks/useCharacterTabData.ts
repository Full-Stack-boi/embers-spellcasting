import { useMemo } from "react";
import type { DDBFeatureAction, DDBInventoryItem } from "../../../types/ddb";
import { getOrdinal } from "../../../assets/spellInfo";
import type { FeaturesFilter, InventoryFilter, SpellsFilter, DockSpell } from "../domain/types";

interface UseCharacterTabDataOptions {
    spells: DockSpell[];
    spellsFilter: SpellsFilter;
    spellSearch: string;
    pactMagicLevel?: number;
    features: DDBFeatureAction[];
    featuresFilter: FeaturesFilter;
    inventory: DDBInventoryItem[];
    inventoryFilter: InventoryFilter;
    inventorySearch: string;
    strength: number;
}

export function useCharacterTabData({
    spells,
    spellsFilter,
    spellSearch,
    pactMagicLevel,
    features,
    featuresFilter,
    inventory,
    inventoryFilter,
    inventorySearch,
    strength,
}: UseCharacterTabDataOptions) {
    const filteredAllSpells = useMemo(() => spells.filter(spell => {
        if (spellsFilter === "0" && spell.level !== 0) return false;
        if (spellsFilter === "1" && spell.level !== 1) return false;
        if (spellsFilter === "2" && spell.level !== 2) return false;
        if (spellsFilter === "PACT" && (!spell.fromChar || spell.level !== (pactMagicLevel || 2))) return false;
        if (spellsFilter === "3+" && spell.level < 3) return false;
        return !spellSearch || spell.name.toLowerCase().includes(spellSearch.toLowerCase());
    }), [spells, spellsFilter, spellSearch, pactMagicLevel]);

    const spellGroups = useMemo(() => {
        const groups: Array<{ label: string; level: number; spells: DockSpell[] }> = [];
        const cantrips = filteredAllSpells.filter(spell => spell.level === 0);
        if (cantrips.length > 0) groups.push({ label: "CANTRIP", level: 0, spells: cantrips });

        for (let level = 1; level <= 9; level++) {
            const levelSpells = filteredAllSpells.filter(spell => spell.level === level);
            if (levelSpells.length > 0) groups.push({ label: `${getOrdinal(level).toUpperCase()} LEVEL`, level, spells: levelSpells });
        }
        return groups;
    }, [filteredAllSpells]);

    const featuresList = useMemo(() => features.filter(feature =>
        !feature.name.toLowerCase().includes("circle spell") && !feature.name.toLowerCase().includes("initiate a circle spell")
    ), [features]);
    const filteredFeatures = useMemo(() => featuresList.filter(feature => {
        if (featuresFilter === "CLASS") return feature.source === "class";
        if (featuresFilter === "SPECIES") return feature.source === "race";
        if (featuresFilter === "FEATS") return feature.source === "feat";
        return true;
    }), [featuresList, featuresFilter]);

    const attunedCount = useMemo(() => inventory.filter(item => item.isAttuned).length, [inventory]);
    const filteredInventory = useMemo(() => {
        const normalizedSearch = inventorySearch.trim().toLowerCase();
        return inventory.filter(item => {
            if (inventoryFilter === "EQUIPPED" && !item.equipped) return false;
            if (inventoryFilter === "ATTUNED" && !item.isAttuned && !item.canAttune) return false;
            if (inventoryFilter === "WEAPONS" && item.type?.toLowerCase() !== "weapon") return false;
            if (inventoryFilter === "ARMOR" && !item.type?.toLowerCase().includes("armor") && !item.type?.toLowerCase().includes("shield")) return false;
            if (inventoryFilter === "GEAR" && (item.type?.toLowerCase() === "weapon" || item.type?.toLowerCase().includes("armor"))) return false;
            if (!normalizedSearch) return true;
            return item.name.toLowerCase().includes(normalizedSearch) ||
                (item.type || "").toLowerCase().includes(normalizedSearch) ||
                (item.description || "").toLowerCase().includes(normalizedSearch);
        });
    }, [inventory, inventoryFilter, inventorySearch]);
    const totalInventoryWeight = useMemo(() => inventory.reduce((total, item) => total + (item.weight * item.quantity), 0), [inventory]);

    return {
        spellGroups,
        filteredFeatures,
        attunedCount,
        filteredInventory,
        totalInventoryWeight,
        maxCarryWeight: strength * 15,
    };
}
