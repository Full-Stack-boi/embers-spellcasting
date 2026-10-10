import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const OATH_OF_GLORY_FORMULAS: Record<string, ManualActionFormula> = {
  peerlessAthlete: {
    id: "embers:paladin:glory:peerless-athlete",
    name: "Channel Divinity: Peerless Athlete",
    kind: "class_feature",
    status: "verified",
    classes: ["paladin"],
    subclass: "oathOfGlory",
    activationType: "bonus",
    operations: [
      {
        type: "apply_effect",
        name: "Athletic Legend",
        description:
          "Bonus Action expend 1 Channel Divinity: for 1 hour, gain Advantage on Athletics and Acrobatics checks, increase jump distance by 10 ft, and carry capacity is doubled.",
      },
    ],
    description:
      "Channel heroic mythic athleticism to overcome physical trials.",
    source: "Player's Handbook (2024), Paladin: Oath of Glory",
  },

  inspiringSmite: {
    id: "embers:paladin:glory:inspiring-smite",
    name: "Channel Divinity: Inspiring Smite",
    kind: "class_feature",
    status: "verified",
    classes: ["paladin"],
    subclass: "oathOfGlory",
    activationType: "bonus",
    operations: [
      {
        type: "apply_effect",
        name: "Heroic Ward",
        description:
          "Immediately after casting a Smite spell, expend 1 Channel Divinity to distribute 2d8 + Paladin level Temporary HP among allies within 30 feet.",
      },
    ],
    description: "Inspire nearby comrades with heroic vigor when smiting evil.",
    source: "Player's Handbook (2024), Paladin: Oath of Glory",
  },

  auraOfAlacrity: {
    id: "embers:paladin:glory:aura-of-alacrity",
    name: "Aura of Alacrity",
    kind: "class_feature",
    status: "verified",
    classes: ["paladin"],
    subclass: "oathOfGlory",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Fleet Speed Aura",
        description:
          "Your speed increases by 10 feet. In addition, allies who start their turn in your aura gain a +10-foot bonus to their speed until the end of that turn.",
      },
    ],
    description:
      "Embolden companions with swift, sweeping strides across the battlefield.",
    source: "Player's Handbook (2024), Paladin: Oath of Glory",
  },

  gloriousDefense: {
    id: "embers:paladin:glory:glorious-defense",
    name: "Glorious Defense",
    kind: "class_feature",
    status: "verified",
    classes: ["paladin"],
    subclass: "oathOfGlory",
    activationType: "reaction",
    resource: {
      name: "Glorious Defense",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "apply_effect",
        name: "Deflective Counter",
        description:
          "Reaction when you or an ally within 10 ft is attacked: add Charisma modifier to target AC. If attack misses, make one weapon attack against the attacker.",
      },
    ],
    description:
      "Turn aside enemy strikes and instantly counterattack with glorious precision.",
    source: "Player's Handbook (2024), Paladin: Oath of Glory",
  },

  livingLegend: {
    id: "embers:paladin:glory:living-legend",
    name: "Living Legend",
    kind: "class_feature",
    status: "verified",
    classes: ["paladin"],
    subclass: "oathOfGlory",
    activationType: "bonus",
    resource: {
      name: "Living Legend",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "apply_effect",
        name: "Mythic Hero Form",
        duration: "10 minutes",
        description:
          "As a Bonus Action, empower yourself for 10 minutes: Advantage on Charisma checks; once on each of your turns when you miss with an attack, you can make the attack hit instead; Reaction reroll failed saves (1/Long Rest or expend a level 5 spell slot).",
      },
    ],
    description:
      "Level 20 Capstone: Become a legendary mythic warrior incapable of missing and defying fate.",
    source: "Player's Handbook (2024), Paladin: Oath of Glory",
  },
};
