import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const BATTLE_SMITH_FORMULAS: Record<string, ManualActionFormula> = {
  toolsOfTheTrade: {
    id: "embers:artificer:battle-smith:tools-of-the-trade",
    name: "Tools of the Trade",
    kind: "class_feature",
    status: "verified",
    classes: ["artificer"],
    subclass: "battleSmith",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Tools of the Trade",
        description:
          "You gain the following benefits.\n\nTool Proficiency. You gain proficiency with Smith’s Tools. If you already have this proficiency, you gain proficiency with one other type of Artisan’s Tools of your choice.\n\nWeapon Crafting. When you craft a nonmagical or magic weapon, the amount of time required to craft it is halved.",
      },
    ],
    description:
      "You gain the following benefits.\n\nTool Proficiency. You gain proficiency with Smith’s Tools. If you already have this proficiency, you gain proficiency with one other type of Artisan’s Tools of your choice.\n\nWeapon Crafting. When you craft a nonma...",
    source: "Eberron: Forge of the Artificer, artificer: Battle Smith",
  },

  battleSmithSpells: {
    id: "embers:artificer:battle-smith:battle-smith-spells",
    name: "Battle Smith Spells",
    kind: "class_feature",
    status: "verified",
    classes: ["artificer"],
    subclass: "battleSmith",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Battle Smith Spells",
        description:
          "When you reach an Artificer level specified in the Battle Smith Spells table, you thereafter always have the listed spells prepared.\n\nBattle Smith Spells\nArtificer Level\tSpells\n3\tHeroism, Shield\n5\tShining Smite, Warding Bond\n9\tAura of Vitality, Conjure Barrage\n13\tAura of Purity, Fire Shield\n17\tBanishing Smite, Mass Cure Wounds",
      },
    ],
    description:
      "When you reach an Artificer level specified in the Battle Smith Spells table, you thereafter always have the listed spells prepared.\n\nBattle Smith Spells\nArtificer Level\tSpells\n3\tHeroism, Shield\n5\tShining Smite, Warding Bond\n9\tAura of Vitality, Co...",
    source: "Eberron: Forge of the Artificer, artificer: Battle Smith",
  },

  battleReady: {
    id: "embers:artificer:battle-smith:battle-ready",
    name: "Battle Ready",
    kind: "class_feature",
    status: "verified",
    classes: ["artificer"],
    subclass: "battleSmith",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Battle Ready",
        description:
          "Your combat training and your experiments with magic have paid off in two ways.\n\nArcane Empowerment. When you attack with a magic weapon, you can use your Intelligence modifier, instead of your Strength or Dexterity modifier, for the attack and damage rolls.\n\nWeapon Knowledge. You gain proficiency with Martial weapons. You can use a weapon with which you have proficiency as a Spellcasting Focus for your Artificer spells.",
      },
    ],
    description:
      "Your combat training and your experiments with magic have paid off in two ways.\n\nArcane Empowerment. When you attack with a magic weapon, you can use your Intelligence modifier, instead of your Strength or Dexterity modifier, for the attack and da...",
    source: "Eberron: Forge of the Artificer, artificer: Battle Smith",
  },

  steelDefender: {
    id: "embers:artificer:battle-smith:steel-defender",
    name: "Steel Defender",
    kind: "class_feature",
    status: "verified",
    classes: ["artificer"],
    subclass: "battleSmith",
    activationType: "bonus",
    resource: {
      name: "Steel Defender",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Steel Defender",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Steel Defender",
        description:
          "Your tinkering has borne you a companion, a Steel Defender (see the stat block). You determine the defender’s appearance and whether it has two legs or four; your choices don’t affect the defender’s game statistics.\n\nThe defender is Friendly to you and your allies and obeys you. It vanishes if you die.\n\nThe Defender in Combat. In combat, the defender acts during your turn. It can move and take its Reaction on its own, but the only action it takes is the Dodge action unless you take a Bonus Ac...",
      },
    ],
    description:
      "Your tinkering has borne you a companion, a Steel Defender (see the stat block). You determine the defender’s appearance and whether it has two legs or four; your choices don’t affect the defender’s game statistics.\n\nThe defender is Friendly to yo...",
    source: "Eberron: Forge of the Artificer, artificer: Battle Smith",
  },

  steelDefender2: {
    id: "embers:artificer:battle-smith:steel-defender",
    name: "STEEL DEFENDER",
    kind: "class_feature",
    status: "verified",
    classes: ["artificer"],
    subclass: "battleSmith",
    activationType: "reaction",
    resource: {
      name: "STEEL DEFENDER",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "STEEL DEFENDER",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "STEEL DEFENDER",
        description:
          "Medium Construct, Neutral\n\nAC 12 + your Intelligence modifier\n\nHP 5 + five times your Artificer level (the defender has a number of Hit Dice [d8s] equal to your Artificer level)\n\nSpeed 40 ft.\n\nABILITY\tSCORE\tMOD\tSAVE\nSTR\t14\t+2\t+2\nDex\t12\t+1\t+1\nCon\t14\t+2\t+2\n\nABILITY\tSCORE\tMOD\tSAVE\nInt\t4\t−3\t−3\nWis\t10\t+0\t+0\nCha\t6\t−2\t−2\n\nImmunities Poison; Charmed, Exhaustion, Poisoned\n\nSenses Darkvision 60 ft.; Passive Perception 10\n\nLanguages Understands the languages you know\n\nCR None (XP 0; PB equals your Profi...",
      },
    ],
    description:
      "Medium Construct, Neutral\n\nAC 12 + your Intelligence modifier\n\nHP 5 + five times your Artificer level (the defender has a number of Hit Dice [d8s] equal to your Artificer level)\n\nSpeed 40 ft.\n\nABILITY\tSCORE\tMOD\tSAVE\nSTR\t14\t+2\t+2\nDex\t12\t+1\t+1\nCon\t1...",
    source: "Eberron: Forge of the Artificer, artificer: Battle Smith",
  },

  extraAttack: {
    id: "embers:artificer:battle-smith:extra-attack",
    name: "Extra Attack",
    kind: "class_feature",
    status: "verified",
    classes: ["artificer"],
    subclass: "battleSmith",
    activationType: "action",
    operations: [
      {
        type: "apply_effect",
        name: "Extra Attack",
        description:
          "You can attack twice instead of once whenever you take the Attack action on your turn. You can forgo one of your attacks when you take the Attack action to command your Steel Defender to take the Force-Empowered Rend action.",
      },
    ],
    description:
      "You can attack twice instead of once whenever you take the Attack action on your turn. You can forgo one of your attacks when you take the Attack action to command your Steel Defender to take the Force-Empowered Rend action.",
    source: "Eberron: Forge of the Artificer, artificer: Battle Smith",
  },

  arcaneJolt: {
    id: "embers:artificer:battle-smith:arcane-jolt",
    name: "Arcane Jolt",
    kind: "class_feature",
    status: "verified",
    classes: ["artificer"],
    subclass: "battleSmith",
    activationType: "special",
    resource: {
      name: "Arcane Jolt",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Arcane Jolt",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Arcane Jolt",
        description:
          "When either you hit a target with an attack roll using a magic weapon or your Steel Defender hits a target, you can channel magical energy through the strike to create one of the following effects:\n\nDestructive Energy. The target takes an extra 2d6 Force damage.\nRestorative Energy. Choose one creature or object you can see within 30 feet of the target. Healing energy flows into the chosen recipient, restoring 2d6 Hit Points to it.\n\nYou can use this energy a number of times equal to your Intel...",
      },
    ],
    description:
      "When either you hit a target with an attack roll using a magic weapon or your Steel Defender hits a target, you can channel magical energy through the strike to create one of the following effects:\n\nDestructive Energy. The target takes an extra 2d...",
    source: "Eberron: Forge of the Artificer, artificer: Battle Smith",
  },

  improvedDefender: {
    id: "embers:artificer:battle-smith:improved-defender",
    name: "Improved Defender",
    kind: "class_feature",
    status: "verified",
    classes: ["artificer"],
    subclass: "battleSmith",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Improved Defender",
        description:
          "Your Arcane Jolt and Steel Defender have become more powerful, granting these benefits.\n\nImproved Jolt. The extra damage and healing of your Arcane Jolt both increase to 4d6.\n\nImproved Deflection. Whenever your Steel Defender uses its Deflect Attack, the attacker takes Force damage equal to 1d4 plus your Intelligence modifier.",
      },
    ],
    description:
      "Your Arcane Jolt and Steel Defender have become more powerful, granting these benefits.\n\nImproved Jolt. The extra damage and healing of your Arcane Jolt both increase to 4d6.\n\nImproved Deflection. Whenever your Steel Defender uses its Deflect Atta...",
    source: "Eberron: Forge of the Artificer, artificer: Battle Smith",
  },
};
