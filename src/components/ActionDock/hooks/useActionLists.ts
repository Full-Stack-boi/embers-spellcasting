import type { DDBFeatureAction, DDBWeaponAttack } from "../../../types/ddb";
import { COMBAT_ACTIONS } from "../domain/constants";
import type { DockSpell } from "../domain/types";

interface UseActionListsOptions {
    search: string;
    weapons: DDBWeaponAttack[];
    spells: DockSpell[];
    features: DDBFeatureAction[];
}

export function useActionLists({ search, weapons, spells, features }: UseActionListsOptions) {
    const normalizedSearch = search.trim().toLowerCase();
    const matchesSearch = (text?: string) => !normalizedSearch || Boolean(text?.toLowerCase().includes(normalizedSearch));
    const isSpellName = (name: string) => {
        const normalizedName = name.toLowerCase().trim();
        return spells.some(spell => spell.name.toLowerCase().trim() === normalizedName);
    };
    const isCircleSpellFeature = (name: string) => {
        const normalizedName = name.toLowerCase();
        return normalizedName.includes("circle spell") || normalizedName.includes("initiate a circle spell");
    };
    const matchesFeature = (feature: DDBFeatureAction) => matchesSearch(feature.name) || matchesSearch(feature.description);
    const matchesSpell = (spell: DockSpell) => matchesSearch(spell.name) || matchesSearch(spell.damageType) || matchesSearch(spell.notes);
    const visibleSpells = spells.filter(spell => spell.isPrepared || spell.level === 0);

    const filteredWeapons = weapons.filter(weapon =>
        matchesSearch(weapon.name) || matchesSearch(weapon.type) || matchesSearch(weapon.damageType) || weapon.properties.some(matchesSearch)
    );
    const attackSpells = visibleSpells.filter(spell => Boolean(spell.hitOrDc?.startsWith("+")) && matchesSpell(spell));
    const actionSpells = visibleSpells.filter(spell => {
        const castingTime = spell.castingTime.toLowerCase().trim();
        return (castingTime.includes("action") || castingTime === "1a" || castingTime === "a") &&
            !castingTime.includes("bonus") && !castingTime.includes("reaction") && matchesSpell(spell);
    });
    const bonusActionSpells = visibleSpells.filter(spell => {
        const castingTime = spell.castingTime.toLowerCase().trim();
        return (castingTime.includes("bonus") || castingTime === "1ba" || castingTime === "ba") && matchesSpell(spell);
    });
    const reactionSpells = visibleSpells.filter(spell => {
        const castingTime = spell.castingTime.toLowerCase().trim();
        return (castingTime.includes("reaction") || castingTime === "1r" || castingTime === "r") && matchesSpell(spell);
    });

    const actionFeatures = features.filter(feature => feature.activationType === "action" &&
        !isSpellName(feature.name) && !isCircleSpellFeature(feature.name) && matchesFeature(feature));
    const bonusActionFeatures = features.filter(feature => feature.activationType === "bonus" &&
        !isSpellName(feature.name) && !isCircleSpellFeature(feature.name) && matchesFeature(feature));
    const reactionFeatures = features.filter(feature => feature.activationType === "reaction" &&
        !isSpellName(feature.name) && matchesFeature(feature));
    const otherFeatures = features.filter(feature =>
        (feature.activationType === "special" || feature.activationType === "none") &&
        !isCircleSpellFeature(feature.name) && matchesFeature(feature));
    const limitedUseFeatures = features.filter(feature =>
        Boolean(feature.limitedUse && feature.limitedUse.max > 0) &&
        !isCircleSpellFeature(feature.name) && matchesFeature(feature));
    const filteredCombatActions = COMBAT_ACTIONS.filter(action => matchesSearch(action.name) || matchesSearch(action.description));

    return {
        filteredWeapons,
        attackSpells,
        actionSpells,
        bonusActionSpells,
        reactionSpells,
        actionFeatures,
        bonusActionFeatures,
        reactionFeatures,
        otherFeatures,
        limitedUseFeatures,
        filteredCombatActions,
    };
}
