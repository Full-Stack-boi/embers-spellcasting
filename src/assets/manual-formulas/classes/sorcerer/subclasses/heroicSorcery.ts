import type {
  ManualActionFormula,
  FeatureActionOption,
} from "../../../../../types/manualFormula";

export const MYSTICAL_MANEUVER_OPTIONS: FeatureActionOption[] = [
  {
    id: "blinding",
    name: "Blinding Attack",
    cost: 2,
    desc: "Add +2d8 damage; target CON Save vs spell save DC or Blinded 1 minute",
    actionType: "bonus",
  },
  {
    id: "ruinous",
    name: "Ruinous Blow",
    cost: 2,
    desc: "Add +2d8 damage; target suffers −3 penalty to AC until end of your next turn",
    actionType: "bonus",
  },
  {
    id: "wounding",
    name: "Wounding Strike",
    cost: 2,
    desc: "Add +2d8 damage; target takes 1d8 Necrotic damage at start of each turn and cannot heal",
    actionType: "bonus",
  },
];

export const HEROIC_SORCERY_FORMULAS: Record<string, ManualActionFormula> = {
  heroicSpells: {
    id: "embers:sorcerer:heroic-sorcery:heroic-spells",
    name: "Heroic Spells",
    kind: "class_feature",
    status: "verified",
    classes: ["sorcerer"],
    subclass: "heroicSorcery",
    activationType: "special",
    operations: [],
    description:
      "When you reach a Sorcerer level specified in the Heroic Spells table, you thereafter always have the listed spells prepared: Level 3: Arc Blade, Burning Blade, Frigid Blade, Heroism, Magic Weapon, Mirror Image, Shield; Level 5: Haste, Phantom Steed; Level 7: Death Ward, Stoneskin; Level 9: Legend Lore, Hold Monster.",
    source: "Valda's Spire of Secrets: Player Pack 2, Sorcerer: Heroic Spells",
  },

  heroicSoul: {
    id: "embers:sorcerer:heroic-sorcery:heroic-soul",
    name: "Heroic Soul",
    kind: "class_feature",
    status: "verified",
    classes: ["sorcerer"],
    subclass: "heroicSorcery",
    activationType: "special",
    resource: {
      name: "Sorcery Points",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Sorcery Points",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Heroic Temp HP",
        description:
          "At the start of your turn, spend 1 Sorcery Point (no action required) to gain Temporary Hit Points equal to 1d6 + your Sorcerer level.",
      },
    ],
    description:
      "Reincarnated hero resilience fuels your defenses at the dawn of each round.",
    source: "Valda's Spire of Secrets: Player Pack 2, Sorcerer: Heroic Sorcery",
  },

  innateBladework: {
    id: "embers:sorcerer:heroic-sorcery:innate-bladework",
    name: "Innate Bladework & Martial Training",
    kind: "class_feature",
    status: "verified",
    classes: ["sorcerer"],
    subclass: "heroicSorcery",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Charisma Weapon Attacks",
        description:
          "While Innate Sorcery is active, use Charisma instead of Strength or Dexterity for attack and damage rolls with proficient weapons. Gain Martial weapons, Light/Medium armor, and Shields training.",
      },
    ],
    description:
      "Channel inward magical fury directly into your martial weapon strikes.",
    source: "Valda's Spire of Secrets: Player Pack 2, Sorcerer: Heroic Sorcery",
  },

  extraAttack: {
    id: "embers:sorcerer:heroic-sorcery:extra-attack",
    name: "Extra Attack (Sorcerer)",
    kind: "class_feature",
    status: "verified",
    classes: ["sorcerer"],
    subclass: "heroicSorcery",
    activationType: "action",
    operations: [
      {
        type: "apply_effect",
        name: "Cantrip Weapon Attack",
        description:
          "Attack twice whenever taking the Attack action. You can replace one attack with an action Sorcerer cantrip.",
      },
    ],
    description: "Weave spell cantrips seamlessly between weapon swings.",
    source: "Valda's Spire of Secrets: Player Pack 2, Sorcerer: Heroic Sorcery",
  },

  mysticalManeuvers: {
    id: "embers:sorcerer:heroic-sorcery:mystical-maneuvers",
    name: "Mystical Maneuvers",
    kind: "class_feature",
    status: "verified",
    classes: ["sorcerer"],
    subclass: "heroicSorcery",
    activationType: "bonus",
    options: MYSTICAL_MANEUVER_OPTIONS,
    resource: {
      name: "Sorcery Points",
      resetType: "Long Rest",
    },
    weaponRider: {
      type: "weapon_damage_rider",
      id: "embers:sorcerer:heroic-sorcery:mystical-maneuvers:rider",
      name: "Mystical Maneuvers",
      classId: "sorcerer",
      subclassId: "heroicSorcery",
      minLevel: 6,
      dice: "2d8",
      frequency: "first_hit_per_turn",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Sorcery Points",
        amount: 2,
      },
      {
        type: "apply_effect",
        name: "Maneuver Strike",
        description:
          "On weapon or unarmed hit, spend 2 Sorcery Points as a Bonus Action for Blinding Attack (+2d8, CON save vs Blinded), Ruinous Blow (+2d8, −3 AC), or Wounding Strike (+2d8, 1d8/turn bleed).",
      },
    ],
    description: "Infuse striking blows with sorcerous devastation.",
    source: "Valda's Spire of Secrets: Player Pack 2, Sorcerer: Heroic Sorcery",
  },

  sorcerousKindling: {
    id: "embers:sorcerer:heroic-sorcery:sorcerous-kindling",
    name: "Sorcerous Kindling",
    kind: "class_feature",
    status: "verified",
    classes: ["sorcerer"],
    subclass: "heroicSorcery",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Combat Sorcery Fuel",
        description:
          "Once per turn, when you score a critical hit with a weapon attack against a hostile creature or reduce a hostile creature to 0 hit points with a weapon attack, you regain 2 Sorcery Points.",
      },
    ],
    description:
      "The ebb and flow of battle hones your sorcery and fuels your magic.",
    source: "Valda's Spire of Secrets: Player Pack 2, Sorcerer: Heroic Sorcery",
  },

  heroicHaste: {
    id: "embers:sorcerer:heroic-sorcery:heroic-haste",
    name: "Heroic Haste",
    kind: "class_feature",
    status: "verified",
    classes: ["sorcerer"],
    subclass: "heroicSorcery",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Unfettered Haste",
        description:
          "When casting Haste targeting yourself, the spell does not require Concentration, and you suffer no lethargy penalty when it ends.",
      },
    ],
    description: "Transcend temporal limitations without fear of exhaustion (Level 18).",
    source: "Valda's Spire of Secrets: Player Pack 2, Sorcerer: Heroic Sorcery",
  },
};
