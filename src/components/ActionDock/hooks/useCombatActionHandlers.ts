import type { Dispatch, SetStateAction } from "react";
import OBR from "@owlbear-rodeo/sdk";
import type { DDBParsedCharacter, DDBWeaponAttack } from "../../../types/ddb";
import { rollAttack, rollFormula } from "../../../utils/dice";

interface UseCombatActionHandlersOptions {
    character: DDBParsedCharacter | null;
    weapons: DDBWeaponAttack[];
    offhandWeapon?: DDBWeaponAttack;
    setHeroicInspiration: Dispatch<SetStateAction<boolean>>;
    onSelectWeapon: (weapon: DDBWeaponAttack, mode?: "melee" | "thrown", attackCount?: number) => void;
}

export function useCombatActionHandlers({ character, weapons, offhandWeapon, setHeroicInspiration, onSelectWeapon }: UseCombatActionHandlersOptions) {
    const handleTwoWeaponFighting = () => {
        const effectiveOffhand = offhandWeapon || character?.offhandWeapon;
        if (effectiveOffhand) {
            onSelectWeapon(effectiveOffhand, "melee");
            const attack = rollAttack(effectiveOffhand.toHit, "Two-Weapon Fighting (Offhand)");
            const damage = rollFormula(effectiveOffhand.damage);
            OBR.notification.show(`${attack.message} | Dmg: ${damage.breakdown} ${effectiveOffhand.damageType}`, "INFO");
        } else {
            OBR.notification.show("Two-Weapon Fighting: Attack with second Light weapon as a Bonus Action", "INFO");
        }
    };

    const handleOpportunityAttack = () => {
        const weapon = weapons[0];
        if (weapon) {
            onSelectWeapon(weapon, "melee");
            const attack = rollAttack(weapon.toHit, `Opportunity Attack (${weapon.name})`);
            const damage = rollFormula(weapon.damage);
            OBR.notification.show(`${attack.message} | Dmg: ${damage.breakdown} ${weapon.damageType}`, "INFO");
        } else {
            OBR.notification.show("Opportunity Attack: Make 1 melee attack when a hostile creature leaves your reach", "INFO");
        }
    };

    const handleInitiativeRoll = () => {
        const initiativeBonus = character?.initiative ?? (character ? character.modifiers.dex : 3);
        const hasAdvantage = character?.hasInitiativeAdvantage ?? false;
        let roll = Math.floor(Math.random() * 20) + 1;
        let detail = `1d20 (${roll})`;
        if (hasAdvantage) {
            const secondRoll = Math.floor(Math.random() * 20) + 1;
            const higherRoll = Math.max(roll, secondRoll);
            detail = `Advantage [${roll}, ${secondRoll}] -> ${higherRoll}`;
            roll = higherRoll;
        }
        const total = roll + initiativeBonus;
        OBR.notification.show(`Initiative: ${detail} + ${initiativeBonus >= 0 ? `+${initiativeBonus}` : initiativeBonus} = ${total}`, "INFO");
    };

    const handleToggleInspiration = () => {
        setHeroicInspiration(previous => {
            const next = !previous;
            OBR.notification.show(next ? "Heroic Inspiration gained!" : "Heroic Inspiration spent", "INFO");
            return next;
        });
    };

    return { handleTwoWeaponFighting, handleOpportunityAttack, handleInitiativeRoll, handleToggleInspiration };
}
