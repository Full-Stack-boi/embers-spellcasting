import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const THE_PARASITE_PATRON_FORMULAS: Record<string, ManualActionFormula> =
  {
    spellSiphon: {
      id: "embers:warlock:the-parasite-patron:spell-siphon",
      name: "Spell Siphon",
      kind: "class_feature",
      status: "verified",
      classes: ["warlock"],
      subclass: "theParasitePatron",
      activationType: "reaction",
      resource: {
        name: "Spell Siphon",
        resetType: "Long Rest",
      },
      operations: [
        {
          type: "resource_cost",
          resource: "Spell Siphon",
          amount: 1,
        },
        {
          type: "apply_effect",
          name: "Spell Siphon",
          description:
            "Your patron has taught you to siphon magic from your enemies and make it your own. Immediately after a creature you can see within 60 feet of you casts a spell, you can take a Reaction to force the creature to make a Charisma saving throw. The DC equals your spell save DC. On a failed save, that creature can't cast the spell again until 8 hours have passed. While this effect lasts, if the spell was at least level 1 and of a level you can cast, you have that spell prepared.\n\nThe maximum number...",
        },
      ],
      description:
        "Your patron has taught you to siphon magic from your enemies and make it your own. Immediately after a creature you can see within 60 feet of you casts a spell, you can take a Reaction to force the creature to make a Charisma saving throw. The DC ...",
      source: "Grim Hollow: Player’s Guide, Warlock: The Parasite Patron",
    },

    physicalSpecimen: {
      id: "embers:warlock:the-parasite-patron:physical-specimen",
      name: "Physical Specimen",
      kind: "class_feature",
      status: "verified",
      classes: ["warlock"],
      subclass: "theParasitePatron",
      activationType: "bonus",
      resource: {
        name: "Physical Specimen",
        resetType: "Long Rest",
      },
      operations: [
        {
          type: "resource_cost",
          resource: "Physical Specimen",
          amount: 1,
        },
        {
          type: "apply_effect",
          name: "Physical Specimen",
          description:
            "Your patron has enhanced your physical form to improve your utility as a host and pawn. As a Bonus Action, once per Long Rest, choose a number of the following benefits up to your Charisma modifier (minimum of one) that lasts until you finish a Long Rest. Whenever you finish a Short Rest, you can choose one of your selected benefits and replace it with another from this list.\n\nYour Hit Point maximum increases by an amount equal to your Warlock level.\nYou gain Darkvision with a range of 60 fee...",
        },
      ],
      description:
        "Your patron has enhanced your physical form to improve your utility as a host and pawn. As a Bonus Action, once per Long Rest, choose a number of the following benefits up to your Charisma modifier (minimum of one) that lasts until you finish a Lo...",
      source: "Grim Hollow: Player’s Guide, Warlock: The Parasite Patron",
    },

    symbioticSentinel: {
      id: "embers:warlock:the-parasite-patron:symbiotic-sentinel",
      name: "Symbiotic Sentinel",
      kind: "class_feature",
      status: "verified",
      classes: ["warlock"],
      subclass: "theParasitePatron",
      activationType: "special",
      operations: [
        {
          type: "apply_effect",
          name: "Symbiotic Sentinel",
          description:
            "Your patron remains alert to threats to its host at all times. You can’t be surprised and you have Advantage on Initiative rolls. You also have Advantage on saving throws to avoid or end the Charmed and Frightened conditions.",
        },
      ],
      description:
        "Your patron remains alert to threats to its host at all times. You can’t be surprised and you have Advantage on Initiative rolls. You also have Advantage on saving throws to avoid or end the Charmed and Frightened conditions.",
      source: "Grim Hollow: Player’s Guide, Warlock: The Parasite Patron",
    },

    spawnPawn: {
      id: "embers:warlock:the-parasite-patron:spawn-pawn",
      name: "Spawn Pawn",
      kind: "class_feature",
      status: "verified",
      classes: ["warlock"],
      subclass: "theParasitePatron",
      activationType: "special",
      resource: {
        name: "Spawn Pawn",
        resetType: "Long Rest",
      },
      operations: [
        {
          type: "resource_cost",
          resource: "Spawn Pawn",
          amount: 1,
        },
        {
          type: "apply_effect",
          name: "Spawn Pawn",
          description:
            "You always have the Dominate Person spell prepared. You can also cast it once without a spell slot, and you regain the ability to do so when you finish a Long Rest.\n\nIn addition, taking damage can’t break your Concentration on Dominate Person. When a creature succeeds on its saving throw, it takes Psychic damage equal to your Warlock level.",
        },
      ],
      description:
        "You always have the Dominate Person spell prepared. You can also cast it once without a spell slot, and you regain the ability to do so when you finish a Long Rest.\n\nIn addition, taking damage can’t break your Concentration on Dominate Person. Whe...",
      source: "Grim Hollow: Player’s Guide, Warlock: The Parasite Patron",
    },

    larvalRegeneration: {
      id: "embers:warlock:the-parasite-patron:larval-regeneration",
      name: "Larval Regeneration",
      kind: "class_feature",
      status: "verified",
      classes: ["warlock"],
      subclass: "theParasitePatron",
      activationType: "action",
      resource: {
        name: "Larval Regeneration",
        resetType: "Long Rest",
      },
      operations: [
        {
          type: "resource_cost",
          resource: "Larval Regeneration",
          amount: 1,
        },
        {
          type: "apply_effect",
          name: "Larval Regeneration",
          description:
            "When you die, a larval parasite bursts from your corpse. You control the parasite. The parasite uses the Rat stat block except it has your Hit Points; Hit Point Dice; Intelligence, Wisdom, and Charisma scores; class features; languages; and feats. It can’t cast spells. In addition, it has the following ability:\n\nBurrowing Possession. As a Magic action, the parasite can cause a Humanoid within 5 feet of it to make a Strength or Dexterity saving throw (your choice) against your Warlock spell sa...",
        },
      ],
      description:
        "When you die, a larval parasite bursts from your corpse. You control the parasite. The parasite uses the Rat stat block except it has your Hit Points; Hit Point Dice; Intelligence, Wisdom, and Charisma scores; class features; languages; and feats....",
      source: "Grim Hollow: Player’s Guide, Warlock: The Parasite Patron",
    },
  };
