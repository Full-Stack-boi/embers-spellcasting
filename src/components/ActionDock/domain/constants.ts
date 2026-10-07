import type { DDBWeaponAttack } from "../../../types/ddb";

export const DEFAULT_WEAPONS: DDBWeaponAttack[] = [
    {
        id: "w_dagger",
        name: "Dagger",
        type: "melee",
        rangeText: "20 (60)",
        rangeFeet: 60,
        toHit: 5,
        damage: "1d4+3",
        damageType: "Piercing",
        properties: ["Finesse", "Light", "Thrown"],
        cantripRiders: []
    },
    {
        id: "w_unarmed",
        name: "Unarmed Strike",
        type: "melee",
        rangeText: "5 ft. Reach",
        rangeFeet: 5,
        toHit: 2,
        damage: "1",
        damageType: "Bludgeoning",
        properties: [],
        cantripRiders: []
    }
];

export const COMBAT_ACTIONS: Array<{ name: string; description: string }> = [
    { name: "Attack", description: "Make one or more melee or ranged attacks with your equipped weapons or unarmed strike." },
    { name: "Dash", description: "Gain extra movement for the current turn equal to your speed." },
    { name: "Disengage", description: "Your movement doesn't provoke opportunity attacks for the rest of the turn." },
    { name: "Dodge", description: "Attackers have disadvantage against you, and you have advantage on DEX saving throws until your next turn." },
    { name: "Help", description: "Lend aid to an ally, granting advantage on their next ability check or attack roll." },
    { name: "Hide", description: "Make a Dexterity (Stealth) check to become unseen and unheard." },
    { name: "Ready", description: "Prepare an action with a trigger to use as a reaction before your next turn." },
    { name: "Search", description: "Devote attention to find something using a Perception or Investigation check." },
    { name: "Grapple", description: "Special melee attack to seize a creature within reach." },
    { name: "Shove", description: "Special melee attack to push a creature 5 ft. away or knock it prone." },
    { name: "Utilize", description: "Use an object or activate complex machinery that requires an action." }
];

export const DND_CONDITIONS = [
    "Blinded",
    "Charmed",
    "Deafened",
    "Frightened",
    "Grappled",
    "Incapacitated",
    "Invisible",
    "Paralyzed",
    "Petrified",
    "Poisoned",
    "Prone",
    "Restrained",
    "Stunned",
    "Unconscious"
] as const;
