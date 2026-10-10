import type {
  ManualActionFormula,
  FeatureActionOption,
} from "../../../../../types/manualFormula";

export const LEGENDARY_ASPECT_OPTIONS: FeatureActionOption[] = [
  {
    id: "rend",
    name: "Rend",
    cost: 1,
    desc: "Move up to Speed and cast 1-Action Cleric cantrip OR make 1 melee attack using Wisdom",
    actionType: "none",
  },
  {
    id: "tail_swipe",
    name: "Tail Swipe",
    cost: 1,
    desc: "Each Large or smaller creature within 10 ft falls Prone",
    actionType: "none",
  },
  {
    id: "wingbeat",
    name: "Wingbeat",
    cost: 1,
    desc: "Move up to Speed with Fly Speed without provoking Opportunity Attacks",
    actionType: "none",
  },
];

export const DRAGON_DOMAIN_FORMULAS: Record<string, ManualActionFormula> = {
  chromaticAffinity: {
    id: "embers:cleric:dragon-domain:chromatic-affinity",
    name: "Chromatic Affinity",
    kind: "class_feature",
    status: "verified",
    classes: ["cleric"],
    subclass: "dragonDomain",
    activationType: "special",
    resource: {
      name: "Chromatic Affinity",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Chromatic Affinity",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Draconic Elemental Damage",
        description:
          "Change Necrotic or Radiant spell damage to Acid, Cold, Fire, Lightning, or Poison. Deal extra damage equal to your Cleric level once per turn.",
      },
    ],
    description:
      "You align with dragon gods, transmuting divine magic into elemental breath and inflicting bonus elemental damage.",
    source: "Valda's Spire of Secrets: Player Pack 2, Cleric: Dragon Domain",
    notes: "Bonus damage usable Wisdom modifier times (min 1) per Long Rest.",
  },

  draconicMajesty: {
    id: "embers:cleric:dragon-domain:draconic-majesty",
    name: "Channel Divinity: Draconic Majesty",
    kind: "class_feature",
    status: "verified",
    classes: ["cleric"],
    subclass: "dragonDomain",
    activationType: "action",
    resource: {
      name: "Channel Divinity",
      resetType: "Short or Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Channel Divinity",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Majestic Aura",
        duration: "1 minute",
        description:
          "30-ft Emanation. Chosen creatures make a Wisdom saving throw or become Charmed or Frightened (your choice) for 1 minute.",
      },
    ],
    description:
      "As a Magic action, channel divine draconic authority in a 30-foot aura to terrify or entrance creatures.",
    source: "Valda's Spire of Secrets: Player Pack 2, Cleric: Dragon Domain",
  },

  wyrmsBlessing: {
    id: "embers:cleric:dragon-domain:wyrms-blessing",
    name: "Channel Divinity: Wyrm’s Blessing",
    kind: "class_feature",
    status: "verified",
    classes: ["cleric"],
    subclass: "dragonDomain",
    activationType: "action",
    resource: {
      name: "Channel Divinity",
      resetType: "Short or Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Channel Divinity",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "No-Concentration Dragon's Breath / Protection from Energy",
        description:
          "Cast Dragon’s Breath or Protection from Energy on yourself without expending a spell slot and without requiring Concentration.",
      },
    ],
    description:
      "Expend 1 Channel Divinity to imbue yourself with draconic breath or ward without concentrating.",
    source: "Valda's Spire of Secrets: Player Pack 2, Cleric: Dragon Domain",
  },

  legendaryAspect: {
    id: "embers:cleric:dragon-domain:legendary-aspect",
    name: "Legendary Aspect",
    kind: "class_feature",
    status: "verified",
    classes: ["cleric"],
    subclass: "dragonDomain",
    activationType: "special",
    options: LEGENDARY_ASPECT_OPTIONS,
    resource: {
      name: "Legendary Actions",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Legendary Actions",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Legendary Action",
        description:
          "Immediately after another creature's turn, manifest draconic appendages to use Rend, Tail Swipe, or Wingbeat.",
      },
    ],
    description:
      "You gain 3 Legendary Actions per Long Rest, acting immediately after another creature's turn. Can restore 1 use by expending a level 2+ spell slot.",
    source: "Valda's Spire of Secrets: Player Pack 2, Cleric: Dragon Domain",
  },
};
