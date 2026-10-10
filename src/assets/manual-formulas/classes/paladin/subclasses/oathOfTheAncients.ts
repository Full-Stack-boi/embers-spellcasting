import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const OATH_OF_THE_ANCIENTS_FORMULAS: Record<
  string,
  ManualActionFormula
> = {
  naturesWrath: {
    id: "embers:paladin:ancients:natures-wrath",
    name: "Channel Divinity: Nature's Wrath",
    kind: "class_feature",
    status: "verified",
    classes: ["paladin"],
    subclass: "oathOfTheAncients",
    activationType: "action",
    operations: [
      {
        type: "apply_effect",
        name: "Constricting Vines",
        description:
          "Action expend 1 Channel Divinity: spectral vines erupt around a creature within 30 feet; target must succeed on Strength or Dexterity save or be Restrained.",
      },
    ],
    description:
      "Ensnare wicked foes in grasping thorny vines of the primeval woods.",
    source: "Player's Handbook (2024), Paladin: Oath of the Ancients",
  },

  turnTheFaithless: {
    id: "embers:paladin:ancients:turn-the-faithless",
    name: "Channel Divinity: Turn the Faithless",
    kind: "class_feature",
    status: "verified",
    classes: ["paladin"],
    subclass: "oathOfTheAncients",
    activationType: "action",
    operations: [
      {
        type: "apply_effect",
        name: "Ancient Repulsion",
        description:
          "Action expend 1 Channel Divinity: each Fey and Fiend within 30 feet makes Wisdom save or is Turned for 1 minute.",
      },
    ],
    description:
      "Repel unnatural otherworldly predators with the primordial authority of the wild.",
    source: "Player's Handbook (2024), Paladin: Oath of the Ancients",
  },

  auraOfWarding: {
    id: "embers:paladin:ancients:aura-of-warding",
    name: "Aura of Warding",
    kind: "class_feature",
    status: "verified",
    classes: ["paladin"],
    subclass: "oathOfTheAncients",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Primordial Energy Resistance",
        description:
          "You and allies in your aura have Resistance to Necrotic, Psychic, and Radiant damage.",
      },
    ],
    description:
      "Ancient wards veil your aura, granting resistance against necrotic, psychic, and radiant energy.",
    source: "Player's Handbook (2024), Paladin: Oath of the Ancients",
  },

  undyingSentinel: {
    id: "embers:paladin:ancients:undying-sentinel",
    name: "Undying Sentinel",
    kind: "class_feature",
    status: "verified",
    classes: ["paladin"],
    subclass: "oathOfTheAncients",
    activationType: "special",
    resource: {
      name: "Undying Sentinel",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "apply_effect",
        name: "Defy Death",
        description:
          "When reduced to 0 Hit Points, you drop to 1 Hit Point instead and regain Hit Points equal to 3x your Paladin level (1/Long Rest); you suffer no drawbacks of old age.",
      },
    ],
    description:
      "Refuse to perish when mortal blows fall, sustained by ancient primordial lifeforce.",
    source: "Player's Handbook (2024), Paladin: Oath of the Ancients",
  },

  elderChampion: {
    id: "embers:paladin:ancients:elder-champion",
    name: "Elder Champion",
    kind: "class_feature",
    status: "verified",
    classes: ["paladin"],
    subclass: "oathOfTheAncients",
    activationType: "bonus",
    resource: {
      name: "Elder Champion",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "apply_effect",
        name: "Primeval Nature Avatar",
        duration: "1 minute",
        description:
          "As a Bonus Action, assume nature avatar form for 1 minute: regain 10 Hit Points at start of each of your turns; cast Paladin spells with casting time of 1 action as a Bonus Action; enemies within 10 ft have Disadvantage on saves against your Paladin spells and Channel Divinity (1/Long Rest or expend a level 5 spell slot).",
      },
    ],
    description:
      "Level 20 Capstone: Become an elder force of primeval nature with rapid regeneration and swift spellcasting.",
    source: "Player's Handbook (2024), Paladin: Oath of the Ancients",
  },
};
