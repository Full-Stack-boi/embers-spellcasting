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
          "When reduced to 0 Hit Points, you drop to 1 Hit Point instead (1/Long Rest); you suffer no drawbacks of old age.",
      },
    ],
    description:
      "Refuse to perish when mortal blows fall, sustained by ancient primordial lifeforce.",
    source: "Player's Handbook (2024), Paladin: Oath of the Ancients",
  },
};
