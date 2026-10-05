import type {
  ManualActionFormula,
  FeatureActionOption,
} from "../../../../../types/manualFormula";

export const VERSATILE_MISSILE_OPTIONS: FeatureActionOption[] = [
  {
    id: "trip",
    name: "Trip Missile",
    cost: 1,
    desc: "Forgo 1 dart: target STR Save vs spell save DC or Prone",
    actionType: "none",
  },
  {
    id: "blinding",
    name: "Blinding Missile",
    cost: 3,
    desc: "Forgo 3 darts: target CON Save vs spell save DC or Blinded until start of your next turn",
    actionType: "none",
  },
  {
    id: "stunning",
    name: "Stunning Missile",
    cost: 5,
    desc: "Forgo 5 darts: target CON Save vs spell save DC or Stunned until start of your next turn",
    actionType: "none",
  },
];

export const MAGIC_MISSILE_MAGE_FORMULAS: Record<string, ManualActionFormula> =
  {
    magicMissileSavant: {
      id: "embers:wizard:magic-missile-mage:magic-missile-savant",
      name: "Magic Missile Savant",
      kind: "class_feature",
      status: "verified",
      classes: ["wizard"],
      subclass: "magicMissileMage",
      activationType: "action",
      resource: {
        name: "Free Magic Missiles",
        resetType: "Long Rest (1 on Short Rest)",
      },
      operations: [
        {
          type: "resource_cost",
          resource: "Free Magic Missiles",
          amount: 1,
        },
        {
          type: "apply_effect",
          name: "Enhanced Free Magic Missile",
          description:
            "Cast Magic Missile without expending a spell slot. Creates extra force darts (+1 at 3rd, +2 at 6th, +3 at 10th, +4 at 14th level). Darts penetrate effects that specifically block Magic Missile (such as Shield).",
        },
      ],
      description:
        "You obsessively refine Magic Missile into an infallible, penetrating barrage.",
      source:
        "Valda's Spire of Secrets: Player Pack 2, Wizard: Magic Missile Mage",
      notes:
        "Free cast usable Intelligence modifier times (min 1) per Long Rest; regain 1 use on Short Rest.",
    },

    versatileMissiles: {
      id: "embers:wizard:magic-missile-mage:versatile-missiles",
      name: "Versatile Missiles",
      kind: "class_feature",
      status: "verified",
      classes: ["wizard"],
      subclass: "magicMissileMage",
      activationType: "special",
      operations: [
        {
          type: "apply_effect",
          name: "Condition Missile",
          description:
            "When casting Magic Missile, forgo darts to apply special effects: Trip (1 dart), Blinding (3 darts), or Stunning (5 darts).",
        },
      ],
      description:
        "Sacrifice force darts to subject victims to devastating physical debuffs.",
      source:
        "Valda's Spire of Secrets: Player Pack 2, Wizard: Magic Missile Mage",
    },

    shieldOfMissiles: {
      id: "embers:wizard:magic-missile-mage:shield-of-missiles",
      name: "Shield of Missiles",
      kind: "class_feature",
      status: "verified",
      classes: ["wizard"],
      subclass: "magicMissileMage",
      activationType: "special",
      resource: {
        name: "Shield of Missiles",
        resetType: "Long Rest",
      },
      operations: [
        {
          type: "resource_cost",
          resource: "Shield of Missiles",
          amount: 1,
        },
        {
          type: "apply_effect",
          name: "Orbiting Barrier",
          duration: "1 minute",
          description:
            "Darts orbit you in a 10-ft Emanation: gain +1 AC per dart (max +5). Attackers that miss you take dart damage. Can expend darts to damage creatures in emanation. 1/Long Rest or expend a level 3+ slot.",
        },
      ],
      description:
        "Form an impenetrable, retaliatory shield of force darts orbiting your person.",
      source:
        "Valda's Spire of Secrets: Player Pack 2, Wizard: Magic Missile Mage",
    },

    gigaMissile: {
      id: "embers:wizard:magic-missile-mage:giga-missile",
      name: "Giga-Missile",
      kind: "class_feature",
      status: "verified",
      classes: ["wizard"],
      subclass: "magicMissileMage",
      activationType: "special",
      resource: {
        name: "Giga-Missile",
        resetType: "Long Rest",
      },
      operations: [
        {
          type: "resource_cost",
          resource: "Giga-Missile",
          amount: 1,
        },
        {
          type: "apply_effect",
          name: "Overcharged Force Darts",
          description:
            "When casting Magic Missile, each dart deals extra Force damage equal to your Intelligence modifier (minimum of +1). 1/Long Rest or expend a level 6+ slot.",
        },
      ],
      description: "Imbue every single dart with overwhelming lethal force.",
      source:
        "Valda's Spire of Secrets: Player Pack 2, Wizard: Magic Missile Mage",
    },
  };
