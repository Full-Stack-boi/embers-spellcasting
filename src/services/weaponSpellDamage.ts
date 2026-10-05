import type { DDBWeaponAttack } from "../types/ddb";

export interface WeaponStepDamage {
    weaponDice: string;
    weaponFormula: string;
    extraDice?: string;
}

const NEXT_DIE: Record<number, number> = { 4: 6, 6: 8, 8: 10, 10: 12 };

export function increaseWeaponDamageDie(dice: string): string {
    const match = dice.match(/^(\d+)d(\d+)$/i);
    if (!match || Number(match[1]) !== 1) return dice;
    const nextSides = NEXT_DIE[Number(match[2])];
    return nextSides ? `1d${nextSides}` : dice;
}

export function buildWeaponStepDamage(
    weapon: Pick<DDBWeaponAttack, "damage" | "baseDamageDice" | "magicDamageBonus">,
    spellcastingModifier: number,
    extraDice?: string,
    steps = 1,
): WeaponStepDamage {
    const sourceDice = weapon.baseDamageDice ?? weapon.damage.match(/^\d+d\d+/i)?.[0] ?? "1d4";
    let weaponDice = sourceDice;
    for (let step = 0; step < steps; step++) weaponDice = increaseWeaponDamageDie(weaponDice);
    const flatBonus = spellcastingModifier + (weapon.magicDamageBonus ?? 0);
    const weaponFormula = `${weaponDice}${flatBonus > 0 ? `+${flatBonus}` : flatBonus < 0 ? flatBonus : ""}`;

    return {
        weaponDice,
        weaponFormula,
        extraDice: extraDice && !/^0d\d+$/i.test(extraDice) ? extraDice : undefined,
    };
}
