import type {
  ManualActionFormula,
  FeatureActionOption,
} from "../../../../../types/manualFormula";

export const BESTIAL_ASPECT_LEVELS: FeatureActionOption[] = [
  {
    id: "aspect_1",
    name: "Level 1: Carnage",
    cost: 1,
    desc: "+2 bonus to damage rolls with weapons and Unarmed Strikes (+3 at level 11)",
    actionType: "none",
  },
  {
    id: "aspect_2",
    name: "Level 2: Fast Movement",
    cost: 2,
    desc: "Speed increases by 10 feet",
    actionType: "none",
  },
  {
    id: "aspect_3",
    name: "Level 3: Blood Frenzy",
    cost: 3,
    desc: "Advantage on attack rolls against any creature missing Hit Points",
    actionType: "none",
  },
  {
    id: "aspect_4",
    name: "Level 4: Thick Hide",
    cost: 4,
    desc: "+2 bonus to AC if not wielding a Shield",
    actionType: "none",
  },
  {
    id: "aspect_5",
    name: "Level 5: Retaliation",
    cost: 5,
    desc: "Reaction when taking damage from creature within 5 ft: make one melee attack against it",
    actionType: "reaction",
  },
];

export const BEASTBORNE_FORMULAS: Record<string, ManualActionFormula> = {
  bestialAspect: {
    id: "embers:ranger:beastborne:bestial-aspect",
    name: "Bestial Aspect",
    kind: "class_feature",
    status: "verified",
    classes: ["ranger"],
    subclass: "beastborne",
    activationType: "bonus",
    options: BESTIAL_ASPECT_LEVELS,
    weaponRider: {
      type: "weapon_damage_rider",
      id: "embers:ranger:beastborne:carnage:rider",
      name: "Bestial Aspect: Carnage",
      classId: "ranger",
      subclassId: "beastborne",
      minLevel: 3,
      flat: {
        byClassLevel: [
          { minLevel: 3, value: 2 },
          { minLevel: 11, value: 3 },
        ],
      },
      frequency: "every_hit",
    },
    resource: {
      name: "Bestial Aspect Level",
      resetType: "Combat Momentum",
    },
    operations: [
      {
        type: "apply_effect",
        name: "Advance Bestial Aspect",
        description:
          "As a Bonus Action on dealing damage to an enemy, increase your Bestial Aspect Level by 1 (max 5). Resets to 0 if you don't deal damage for 1 minute.",
      },
    ],
    description:
      "Awaken feral bloodlust in combat, accumulating ferocious benefits as your aspect level builds from 1 to 5.",
    source: "Valda's Spire of Secrets: Player Pack 2, Ranger: Beastborne",
    notes:
      "Gains cumulative benefits of current level and all lower levels. Cast Hunter’s Mark as part of this Bonus Action at level 11.",
  },

  lycanthrope: {
    id: "embers:ranger:beastborne:lycanthrope",
    name: "Lycanthrope: Feral Claws",
    kind: "class_feature",
    status: "verified",
    classes: ["ranger"],
    subclass: "beastborne",
    activationType: "action",
    operations: [
      {
        type: "attack",
        attackType: "melee",
        attackAbility: "DEX",
        range: "5 ft.",
        damage: [{ dice: "1d6", damageType: "slashing" }],
        onHit:
          "Deals 1d6 + STR or DEX slashing damage. Also grants Climb Speed equal to Speed and +60 ft Darkvision.",
      },
    ],
    description:
      "Vicious retractable claws count as Unarmed Strikes utilizing Dexterity or Strength.",
    source: "Valda's Spire of Secrets: Player Pack 2, Ranger: Beastborne",
  },

  feralHowl: {
    id: "embers:ranger:beastborne:feral-howl",
    name: "Feral Howl",
    kind: "class_feature",
    status: "verified",
    classes: ["ranger"],
    subclass: "beastborne",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Instant Aspect Surge",
        description:
          "When rolling Initiative, roll 1d4 and immediately set your Bestial Aspect Level to the result.",
      },
    ],
    description: "Leap straight into fury at the onset of combat.",
    source: "Valda's Spire of Secrets: Player Pack 2, Ranger: Beastborne",
  },

  monstrousResilience: {
    id: "embers:ranger:beastborne:monstrous-resilience",
    name: "Monstrous Resilience",
    kind: "class_feature",
    status: "verified",
    classes: ["ranger"],
    subclass: "beastborne",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Damage Shrug",
        description:
          "Once per turn when you take damage, reduce the damage taken by CON modifier + current Bestial Aspect Level.",
      },
    ],
    description: "Your supernatural resilience shrugs off incoming wounds.",
    source: "Valda's Spire of Secrets: Player Pack 2, Ranger: Beastborne",
  },
};
