import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const OATH_OF_PESTILENCE_FORMULAS: Record<string, ManualActionFormula> =
  {
    debilitatingFever: {
      id: "embers:paladin:oath-of-pestilence:debilitating-fever",
      name: "Debilitating Fever",
      kind: "class_feature",
      status: "verified",
      classes: ["paladin"],
      subclass: "oathOfPestilence",
      activationType: "special",
      resource: {
        name: "Debilitating Fever",
        resetType: "Long Rest",
      },
      operations: [
        {
          type: "resource_cost",
          resource: "Debilitating Fever",
          amount: 1,
        },
        {
          type: "apply_effect",
          name: "Debilitating Fever",
          description:
            "You can inflict disease upon a creature. When you hit a creature with an attack roll using a weapon or Unarmed Strike, you can expend one use of your Channel Divinity to give that creature the Poisoned condition for 1 minute. While Poisoned in this way, the target also has the Incapacitated condition. At the end of each of its turns, the Poisoned target makes a Constitution save, ending the effect on itself on a success.",
        },
      ],
      description:
        "You can inflict disease upon a creature. When you hit a creature with an attack roll using a weapon or Unarmed Strike, you can expend one use of your Channel Divinity to give that creature the Poisoned condition for 1 minute. While Poisoned in thi...",
      source: "Grim Hollow: Player’s Guide, Paladin: Oath of Pestilence",
    },

    entropicInfection: {
      id: "embers:paladin:oath-of-pestilence:entropic-infection",
      name: "Entropic Infection",
      kind: "class_feature",
      status: "verified",
      classes: ["paladin"],
      subclass: "oathOfPestilence",
      activationType: "action",
      resource: {
        name: "Entropic Infection",
        resetType: "Long Rest",
      },
      operations: [
        {
          type: "resource_cost",
          resource: "Entropic Infection",
          amount: 1,
        },
        {
          type: "apply_effect",
          name: "Entropic Infection",
          description:
            "As a Magic action, you can expend one use of your Channel Divinity and select a creature you can see within 30 feet of yourself. For 1 minute, if you deal damage to the target, the target takes an extra 2d6 Necrotic damage. In addition, the target loses Resistance and Immunity to Necrotic damage. The target can make a Constitution save against the Paladin's spell save DC at the end of each of its turns, ending the effect on itself on a success.",
        },
      ],
      description:
        "As a Magic action, you can expend one use of your Channel Divinity and select a creature you can see within 30 feet of yourself. For 1 minute, if you deal damage to the target, the target takes an extra 2d6 Necrotic damage. In addition, the target...",
      source: "Grim Hollow: Player’s Guide, Paladin: Oath of Pestilence",
    },

    oathOfPestilenceSpells: {
      id: "embers:paladin:oath-of-pestilence:oath-of-pestilence-spells",
      name: "Oath of Pestilence Spells",
      kind: "class_feature",
      status: "verified",
      classes: ["paladin"],
      subclass: "oathOfPestilence",
      activationType: "special",
      operations: [
        {
          type: "apply_effect",
          name: "Oath of Pestilence Spells",
          description:
            "The magic of your oath ensures you always have certain spells ready; when you reach a Paladin level specified in the Oath of Pestilence Spells table, you thereafter always have the listed spells prepared.\n\nOath of Pestilence Spells\nPaladin Level\tSpells\n3\tBane, Inflict Wounds\n5\tMelf's Acid Arrow, Ray of Enfeeblement\n9\tFlash Fever, Stinking Cloud\n13\tBlight, Confusion\n17\tContagion, Insect Plague",
        },
      ],
      description:
        "The magic of your oath ensures you always have certain spells ready; when you reach a Paladin level specified in the Oath of Pestilence Spells table, you thereafter always have the listed spells prepared.\n\nOath of Pestilence Spells\nPaladin Level\tS...",
      source: "Grim Hollow: Player’s Guide, Paladin: Oath of Pestilence",
    },

    auraOfRampantSickness: {
      id: "embers:paladin:oath-of-pestilence:aura-of-rampant-sickness",
      name: "Aura of Rampant Sickness",
      kind: "class_feature",
      status: "verified",
      classes: ["paladin"],
      subclass: "oathOfPestilence",
      activationType: "reaction",
      operations: [
        {
          type: "apply_effect",
          name: "Aura of Rampant Sickness",
          description:
            "You emit an aura of contagion and virulence. When a creature within your Aura of Protection is about to make a D20 Test, you can take a Reaction to impose Disadvantage on that D20 Test.\n\nThere are days when you can just make out the glint of their armor through the haze, like they’re waiting for something.\n\n— Liesech Doctor",
        },
      ],
      description:
        "You emit an aura of contagion and virulence. When a creature within your Aura of Protection is about to make a D20 Test, you can take a Reaction to impose Disadvantage on that D20 Test.\n\nThere are days when you can just make out the glint of their...",
      source: "Grim Hollow: Player’s Guide, Paladin: Oath of Pestilence",
    },

    disgustingResilience: {
      id: "embers:paladin:oath-of-pestilence:disgusting-resilience",
      name: "Disgusting Resilience",
      kind: "class_feature",
      status: "verified",
      classes: ["paladin"],
      subclass: "oathOfPestilence",
      activationType: "special",
      resource: {
        name: "Disgusting Resilience",
        resetType: "Long Rest",
      },
      operations: [
        {
          type: "resource_cost",
          resource: "Disgusting Resilience",
          amount: 1,
        },
        {
          type: "apply_effect",
          name: "Disgusting Resilience",
          description:
            "When you are reduced to 0 Hit Points and not killed outright, you can spend any number of Hit Dice, roll them, and reduce the damage taken by the total rolled on those dice.\n\nIn addition, if you are killed, your corpse explodes in a shower of pus and gore. Each creature in a 20-foot Emanation originating from you makes Constitution saving throw against the Paladin's spell save DC, taking 8d6 Necrotic damage on a failed save or half as much damage on a successful one.",
        },
      ],
      description:
        "When you are reduced to 0 Hit Points and not killed outright, you can spend any number of Hit Dice, roll them, and reduce the damage taken by the total rolled on those dice.\n\nIn addition, if you are killed, your corpse explodes in a shower of pus ...",
      source: "Grim Hollow: Player’s Guide, Paladin: Oath of Pestilence",
    },

    plaguebringer: {
      id: "embers:paladin:oath-of-pestilence:plaguebringer",
      name: "Plaguebringer",
      kind: "class_feature",
      status: "verified",
      classes: ["paladin"],
      subclass: "oathOfPestilence",
      activationType: "bonus",
      resource: {
        name: "Plaguebringer",
        resetType: "Long Rest",
      },
      operations: [
        {
          type: "resource_cost",
          resource: "Plaguebringer",
          amount: 1,
        },
        {
          type: "apply_effect",
          name: "Plaguebringer",
          description:
            "As a Bonus Action, you gain the benefits below for 10 minutes, or until you end them (no action required). Once you use this feature, you can’t use it again until you finish a Long Rest. You can also restore your use of it by expending a level 5 spell slot (no action required).\n\nOne with Plague. You are immune to Poison damage and the Poisoned condition, and you have Resistance to Necrotic damage.\n\nBolstered by Rot. Your Hit Point maximum can’t be reduced.\n\nEntropic Radiance. Whenever an enem...",
        },
      ],
      description:
        "As a Bonus Action, you gain the benefits below for 10 minutes, or until you end them (no action required). Once you use this feature, you can’t use it again until you finish a Long Rest. You can also restore your use of it by expending a level 5 s...",
      source: "Grim Hollow: Player’s Guide, Paladin: Oath of Pestilence",
    },
  };
