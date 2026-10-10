import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const COLLEGE_OF_GLAMOUR_FORMULAS: Record<string, ManualActionFormula> =
  {
    beguilingMagic: {
      id: "embers:bard:glamour:beguiling-magic",
      name: "Beguiling Magic",
      kind: "class_feature",
      status: "verified",
      classes: ["bard"],
      subclass: "collegeOfGlamour",
      activationType: "special",
      operations: [
        {
          type: "apply_effect",
          name: "Fey Allure",
          description:
            "When you cast an Enchantment or Illusion spell, force a creature you can see within 60 feet to make a Wisdom saving throw or be Charmed or Frightened for 1 minute.",
        },
      ],
      description:
        "Enchant onlookers with supernatural fey charm whenever weaving illusory magic.",
      source: "Player's Handbook (2024), Bard: College of Glamour",
    },

    mantleOfInspiration: {
      id: "embers:bard:glamour:mantle-of-inspiration",
      name: "Mantle of Inspiration",
      kind: "class_feature",
      status: "verified",
      classes: ["bard"],
      subclass: "collegeOfGlamour",
      activationType: "bonus",
      operations: [
        {
          type: "apply_effect",
          name: "Mantle Cloak",
          description:
            "As a Bonus Action, expend 1 Bardic Inspiration to grant Temporary HP equal to 2x the die roll to allies within 60 ft, allowing them to use a Reaction to move up to their speed without Opportunity Attacks.",
        },
      ],
      description:
        "Cloak your allies in majestic otherworldly radiance and tactical repositioning.",
      source: "Player's Handbook (2024), Bard: College of Glamour",
    },

    mantleOfMajesty: {
      id: "embers:bard:glamour:mantle-of-majesty",
      name: "Mantle of Majesty",
      kind: "class_feature",
      status: "verified",
      classes: ["bard"],
      subclass: "collegeOfGlamour",
      activationType: "bonus",
      resource: {
        name: "Mantle of Majesty",
        resetType: "Long Rest",
      },
      operations: [
        {
          type: "apply_effect",
          name: "Imperial Presence",
          description:
            "As a Bonus Action, radiate sovereign majesty for 1 minute: cast Command as a Bonus Action without expending a spell slot each turn.",
        },
      ],
      description:
        "Assume unearthly sovereign grandeur that forces foes to obey your every command.",
      source: "Player's Handbook (2024), Bard: College of Glamour",
    },

    unbreakableMajesty: {
      id: "embers:bard:glamour:unbreakable-majesty",
      name: "Unbreakable Majesty",
      kind: "class_feature",
      status: "verified",
      classes: ["bard"],
      subclass: "collegeOfGlamour",
      activationType: "bonus",
      resource: {
        name: "Unbreakable Majesty",
        resetType: "Long Rest",
      },
      operations: [
        {
          type: "apply_effect",
          name: "Aura of Inviolable Grandeur",
          description: "For 1 minute, whenever any creature hits you with an attack roll, it must make a Charisma save against your spell save DC or the attack misses. Can also be used by expending 1 Bardic Inspiration.",
        },
      ],
      description: "Assume a terrifyingly majestic presence that turns enemy strikes aside.",
      source: "Player's Handbook (2024), Bard: College of Glamour",
    },
  };
