import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const CELESTIAL_PATRON_FORMULAS: Record<string, ManualActionFormula> = {
  healingLight: {
    id: "embers:warlock:celestial:healing-light",
    name: "Healing Light",
    kind: "class_feature",
    status: "verified",
    classes: ["warlock"],
    subclass: "celestialPatron",
    activationType: "bonus",
    resource: {
      name: "Healing Light Pool",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "apply_effect",
        name: "Solar Touch Healing",
        description:
          "Pool of d6s equal to 1 + Warlock level. Bonus Action heal a creature within 60 ft, spending up to Charisma modifier dice (min 1).",
      },
    ],
    description: "Bestow warm celestial healing rays as a bonus action.",
    source: "Player's Handbook (2024), Warlock: Celestial Patron",
  },

  radiantSoul: {
    id: "embers:warlock:celestial:radiant-soul",
    name: "Radiant Soul",
    kind: "class_feature",
    status: "verified",
    classes: ["warlock"],
    subclass: "celestialPatron",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Celestial Flames",
        description:
          "Resistance to Radiant damage. Add Charisma modifier to one Radiant or Fire damage roll of spells you cast.",
      },
    ],
    description: "Infuse radiant and fire spells with sacred celestial fury.",
    source: "Player's Handbook (2024), Warlock: Celestial Patron",
  },

  searingVengeance: {
    id: "embers:warlock:celestial:searing-vengeance",
    name: "Searing Vengeance",
    kind: "class_feature",
    status: "verified",
    classes: ["warlock"],
    subclass: "celestialPatron",
    activationType: "special",
    resource: {
      name: "Searing Vengeance",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "apply_effect",
        name: "Solar Resurrection Burst",
        description:
          "When reduced to 0 HP, burst upright: regain half max HP, deal 2d8 + CHA Radiant damage to enemies within 30 ft, and Blind them until end of turn.",
      },
    ],
    description: "Erupt with blinding dawn light from the brink of defeat.",
    source: "Player's Handbook (2024), Warlock: Celestial Patron",
  },
};
