import type { Dispatch, SetStateAction } from "react";
import OBR from "@owlbear-rodeo/sdk";
import type { DDBParsedCharacter } from "../../../types/ddb";

interface CustomHitPoints {
    current: number;
    max: number;
    temp: number;
}

interface DeathSaves {
    successes: number;
    failures: number;
}

interface UseHitPointsOptions {
    customHp: CustomHitPoints | null;
    setCustomHp: Dispatch<SetStateAction<CustomHitPoints | null>>;
    character: DDBParsedCharacter | null;
    concentrationSpell: { id: string; name: string } | null;
    deathSaves: DeathSaves;
    setDeathSaves: Dispatch<SetStateAction<DeathSaves>>;
}

export function useHitPoints({ customHp, setCustomHp, character, concentrationSpell, deathSaves, setDeathSaves }: UseHitPointsOptions) {
    const currentHp = customHp ? customHp.current : (character?.hp?.current ?? 0);
    const maxHp = customHp ? customHp.max : (character?.hp?.max ?? 0);

    const heal = (amount = 5) => {
        setCustomHp(previous => {
            const current = previous ? previous.current : (character?.hp?.current ?? 0);
            const max = previous ? previous.max : (character?.hp?.max ?? 0);
            const temp = previous ? previous.temp : (character?.hp?.temp ?? 0);
            const nextCurrent = Math.min(max, current + amount);
            OBR.notification.show(`Healed +${amount} HP (${nextCurrent}/${max})`, "SUCCESS");
            if (nextCurrent > 0 && (deathSaves.successes > 0 || deathSaves.failures > 0)) {
                setDeathSaves({ successes: 0, failures: 0 });
            }
            return { current: nextCurrent, max, temp };
        });
    };

    const takeDamage = (amount = 5) => {
        setCustomHp(previous => {
            const current = previous ? previous.current : (character?.hp?.current ?? 0);
            const max = previous ? previous.max : (character?.hp?.max ?? 0);
            const temp = previous ? previous.temp : (character?.hp?.temp ?? 0);
            let remainingDamage = amount;
            let nextTemp = temp;
            if (nextTemp > 0) {
                const absorbed = Math.min(nextTemp, remainingDamage);
                nextTemp -= absorbed;
                remainingDamage -= absorbed;
            }
            const nextCurrent = Math.max(0, current - remainingDamage);
            OBR.notification.show(`Took ${amount} damage (${nextCurrent}/${max})`, "WARNING");

            if (concentrationSpell && amount > 0) {
                const concentrationDc = Math.max(10, Math.floor(amount / 2));
                OBR.notification.show(`Concentrating on "${concentrationSpell.name}"! Roll CON Save DC ${concentrationDc}.`, "WARNING");
            }
            return { current: nextCurrent, max, temp: nextTemp };
        });
    };

    return { currentHp, maxHp, heal, takeDamage };
}
