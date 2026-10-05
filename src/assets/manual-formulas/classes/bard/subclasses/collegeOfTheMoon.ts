import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const COLLEGE_OF_THE_MOON_FORMULAS: Record<string, ManualActionFormula> =
  {
    moonSInspiration: {
      id: "embers:bard:college-of-the-moon:moon-s-inspiration",
      name: "Moon’s Inspiration",
      kind: "class_feature",
      status: "verified",
      classes: ["bard"],
      subclass: "collegeOfTheMoon",
      activationType: "bonus",
      resource: {
        name: "Moon’s Inspiration",
        resetType: "Long Rest",
      },
      operations: [
        {
          type: "resource_cost",
          resource: "Moon’s Inspiration",
          amount: 1,
        },
        {
          type: "apply_effect",
          name: "Moon’s Inspiration",
          description:
            "The primal and ever-changing power of the moon flows through you, granting you the following benefits.\n\nInspired Eclipse. When you take a Bonus Action to give a creature a Bardic Inspiration die, you can have the Invisible condition and teleport up to 30 feet to an unoccupied space you can see as part of that Bonus Action. This invisibility lasts until the start of your next turn and ends early immediately after you make an attack roll, deal damage, or cast a spell.\n\nLunar Vitality. Once per ...",
        },
      ],
      description:
        "The primal and ever-changing power of the moon flows through you, granting you the following benefits.\n\nInspired Eclipse. When you take a Bonus Action to give a creature a Bardic Inspiration die, you can have the Invisible condition and teleport u...",
      source: "Forgotten Realms: Heroes of Faerûn, Bard: College of the Moon",
    },

    primalLore: {
      id: "embers:bard:college-of-the-moon:primal-lore",
      name: "Primal Lore",
      kind: "class_feature",
      status: "verified",
      classes: ["bard"],
      subclass: "collegeOfTheMoon",
      activationType: "special",
      operations: [
        {
          type: "apply_effect",
          name: "Primal Lore",
          description:
            "You learn Druidic and one cantrip from the Druid spell list. It counts as a Bard spell for you but doesn’t count against the number of cantrips you know. Whenever you gain a Bard level, you can replace this cantrip with another cantrip of your choice from the Druid spell list.\n\nAdditionally, choose one of the following skills: Animal Handling, Insight, Medicine, Nature, Perception, or Survival. You have proficiency in that skill.",
        },
      ],
      description:
        "You learn Druidic and one cantrip from the Druid spell list. It counts as a Bard spell for you but doesn’t count against the number of cantrips you know. Whenever you gain a Bard level, you can replace this cantrip with another cantrip of your cho...",
      source: "Forgotten Realms: Heroes of Faerûn, Bard: College of the Moon",
    },

    blessingOfMoonlight: {
      id: "embers:bard:college-of-the-moon:blessing-of-moonlight",
      name: "Blessing of Moonlight",
      kind: "class_feature",
      status: "verified",
      classes: ["bard"],
      subclass: "collegeOfTheMoon",
      activationType: "special",
      resource: {
        name: "Blessing of Moonlight",
        resetType: "Long Rest",
      },
      operations: [
        {
          type: "resource_cost",
          resource: "Blessing of Moonlight",
          amount: 1,
        },
        {
          type: "apply_effect",
          name: "Blessing of Moonlight",
          description:
            "You always have the Moonbeam spell prepared.\n\nWhen you cast Moonbeam, you can modify the spell so that you glow faintly while the spell is active. While glowing, you shed Dim Light out to 5 feet, and whenever a creature fails its saving throw against the effects of this Moonbeam, another creature of your choice that you can see within 60 feet of yourself regains 2d4 Hit Points.\n\nOnce you use this feature to modify a casting of Moonbeam, you can’t use it again until you finish a Long Rest.",
        },
      ],
      description:
        "You always have the Moonbeam spell prepared.\n\nWhen you cast Moonbeam, you can modify the spell so that you glow faintly while the spell is active. While glowing, you shed Dim Light out to 5 feet, and whenever a creature fails its saving throw agai...",
      source: "Forgotten Realms: Heroes of Faerûn, Bard: College of the Moon",
    },

    eventideSSplendor: {
      id: "embers:bard:college-of-the-moon:eventide-s-splendor",
      name: "Eventide’s Splendor",
      kind: "class_feature",
      status: "verified",
      classes: ["bard"],
      subclass: "collegeOfTheMoon",
      activationType: "reaction",
      resource: {
        name: "Eventide’s Splendor",
        resetType: "Long Rest",
      },
      operations: [
        {
          type: "resource_cost",
          resource: "Eventide’s Splendor",
          amount: 1,
        },
        {
          type: "apply_effect",
          name: "Eventide’s Splendor",
          description:
            "You become suffused with the might of the moon, improving your Moon’s Inspiration in the following ways.\n\nShadow of the New Moon. When you use Inspired Eclipse, the creature who received the Bardic Inspiration die can also have the Invisible condition and immediately take a Reaction to teleport up to 30 feet to an unoccupied space it can see. The creature remains Invisible until the start of its next turn.\n\nVibrance of the Full Moon. When you use Lunar Vitality, you can roll 1d6 and use the n...",
        },
      ],
      description:
        "You become suffused with the might of the moon, improving your Moon’s Inspiration in the following ways.\n\nShadow of the New Moon. When you use Inspired Eclipse, the creature who received the Bardic Inspiration die can also have the Invisible condi...",
      source: "Forgotten Realms: Heroes of Faerûn, Bard: College of the Moon",
    },
  };
