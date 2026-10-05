import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const BANNERET_FORMULAS: Record<string, ManualActionFormula> = {
  knightlyEnvoy: {
    id: "embers:fighter:banneret:knightly-envoy",
    name: "Knightly Envoy",
    kind: "class_feature",
    status: "verified",
    classes: ["fighter"],
    subclass: "banneret",
    activationType: "special",
    resource: {
      name: "Knightly Envoy",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Knightly Envoy",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Knightly Envoy",
        description:
          "You know how to conduct yourself with grace as a noble ambassador. You gain the following benefits.\n\nComprehension. You can cast the Comprehend Languages spell but only as a Ritual. Charisma is your spellcasting ability for it.\n\nPolyglot. You learn one language from the language tables in the Player’s Handbook or chapter 2 of this book. When you finish a Long Rest, you can replace a language learned from this benefit with another language you have heard, seen signed, or read in the past 24 ho...",
      },
    ],
    description:
      "You know how to conduct yourself with grace as a noble ambassador. You gain the following benefits.\n\nComprehension. You can cast the Comprehend Languages spell but only as a Ritual. Charisma is your spellcasting ability for it.\n\nPolyglot. You lear...",
    source: "Forgotten Realms: Heroes of Faerûn, Fighter: Banneret",
  },

  groupRecovery: {
    id: "embers:fighter:banneret:group-recovery",
    name: "Group Recovery",
    kind: "class_feature",
    status: "verified",
    classes: ["fighter"],
    subclass: "banneret",
    activationType: "special",
    resource: {
      name: "Group Recovery",
      resetType: "Short or Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Group Recovery",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Group Recovery",
        description:
          "When you use your Second Wind to regain Hit Points, you can choose a number of allies within a 30-foot Emanation originating from yourself, up to a number of allies equal to your Charisma modifier (minimum of one). Each of those allies regains Hit Points equal to 1d4 plus your Fighter level. Once you use this ability, you can’t use it again until you finish a Short or Long Rest.",
      },
    ],
    description:
      "When you use your Second Wind to regain Hit Points, you can choose a number of allies within a 30-foot Emanation originating from yourself, up to a number of allies equal to your Charisma modifier (minimum of one). Each of those allies regains Hit...",
    source: "Forgotten Realms: Heroes of Faerûn, Fighter: Banneret",
  },

  teamTactics: {
    id: "embers:fighter:banneret:team-tactics",
    name: "Team Tactics",
    kind: "class_feature",
    status: "verified",
    classes: ["fighter"],
    subclass: "banneret",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Team Tactics",
        description:
          "When you use Group Recovery, each chosen ally has Advantage on D20 Tests until the start of your next turn.",
      },
    ],
    description:
      "When you use Group Recovery, each chosen ally has Advantage on D20 Tests until the start of your next turn.",
    source: "Forgotten Realms: Heroes of Faerûn, Fighter: Banneret",
  },

  rallyingSurge: {
    id: "embers:fighter:banneret:rallying-surge",
    name: "Rallying Surge",
    kind: "class_feature",
    status: "verified",
    classes: ["fighter"],
    subclass: "banneret",
    activationType: "reaction",
    resource: {
      name: "Rallying Surge",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Rallying Surge",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Rallying Surge",
        description:
          "When you use your Action Surge, you can choose allies within a 30-foot Emanation originating from yourself, up to a number of allies equal to your Charisma modifier (minimum of one). Each of those allies can immediately take a Reaction to use one of the following options.\n\nAttack. The ally makes one attack with a weapon or an Unarmed Strike.\n\nMove. The ally moves up to half its Speed without provoking Opportunity Attacks.",
      },
    ],
    description:
      "When you use your Action Surge, you can choose allies within a 30-foot Emanation originating from yourself, up to a number of allies equal to your Charisma modifier (minimum of one). Each of those allies can immediately take a Reaction to use one ...",
    source: "Forgotten Realms: Heroes of Faerûn, Fighter: Banneret",
  },

  sharedResilience: {
    id: "embers:fighter:banneret:shared-resilience",
    name: "Shared Resilience",
    kind: "class_feature",
    status: "verified",
    classes: ["fighter"],
    subclass: "banneret",
    activationType: "reaction",
    resource: {
      name: "Shared Resilience",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Shared Resilience",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Shared Resilience",
        description:
          "When an ally you can see within 60 feet of yourself fails a saving throw, you can take a Reaction to expend a use of your Indomitable feature. The ally can immediately reroll the saving throw with a bonus equal to your Fighter level; the ally must use the new roll.",
      },
    ],
    description:
      "When an ally you can see within 60 feet of yourself fails a saving throw, you can take a Reaction to expend a use of your Indomitable feature. The ally can immediately reroll the saving throw with a bonus equal to your Fighter level; the ally must...",
    source: "Forgotten Realms: Heroes of Faerûn, Fighter: Banneret",
  },

  inspiringCommander: {
    id: "embers:fighter:banneret:inspiring-commander",
    name: "Inspiring Commander",
    kind: "class_feature",
    status: "verified",
    classes: ["fighter"],
    subclass: "banneret",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Inspiring Commander",
        description:
          "You gain the following benefits.\n\nBolstered Rally. The area of effect for both Group Recovery and Rallying Surge is now a 60-foot Emanation.\n\nUnshakable Bravery. You have Immunity to the Charmed and Frightened conditions.",
      },
    ],
    description:
      "You gain the following benefits.\n\nBolstered Rally. The area of effect for both Group Recovery and Rallying Surge is now a 60-foot Emanation.\n\nUnshakable Bravery. You have Immunity to the Charmed and Frightened conditions.",
    source: "Forgotten Realms: Heroes of Faerûn, Fighter: Banneret",
  },
};
