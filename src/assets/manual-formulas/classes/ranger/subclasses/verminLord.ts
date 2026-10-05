import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const VERMIN_LORD_FORMULAS: Record<string, ManualActionFormula> = {
  verminkin: {
    id: "embers:ranger:vermin-lord:verminkin",
    name: "Verminkin",
    kind: "class_feature",
    status: "verified",
    classes: ["ranger"],
    subclass: "verminLord",
    activationType: "bonus",
    resource: {
      name: "Verminkin",
      resetType: "Short or Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Verminkin",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Verminkin",
        description:
          "You can comprehend and verbally communicate with Tiny Beasts.\n\nAs a Magic action, you can expend a spell slot to summon vermin swarms. You summon a number of swarms equal to the slot’s level for 1 hour. Each swarm is summoned to an unoccupied space you can see within 30 feet of yourself. A swarm uses the Swarm of Vermin stat block.\n\nIn combat, each swarm acts during your turn. It can move and use its Reaction on its own, but the only action it takes is the Dodge action unless you take a Bonus...",
      },
    ],
    description:
      "You can comprehend and verbally communicate with Tiny Beasts.\n\nAs a Magic action, you can expend a spell slot to summon vermin swarms. You summon a number of swarms equal to the slot’s level for 1 hour. Each swarm is summoned to an unoccupied spac...",
    source: "Grim Hollow: Player’s Guide, Ranger: Vermin Lord",
  },

  swarmingStrikes: {
    id: "embers:ranger:vermin-lord:swarming-strikes",
    name: "Swarming Strikes",
    kind: "class_feature",
    status: "verified",
    classes: ["ranger"],
    subclass: "verminLord",
    activationType: "bonus",
    resource: {
      name: "Swarming Strikes",
      resetType: "Short or Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Swarming Strikes",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Swarming Strikes",
        description:
          "As a Bonus Action, you can command all of your swarms to make an Attack action instead of just one. Alternatively, a single swarm can attack twice instead of once when it takes the Attack action.\n\nYou can use this feature a number of times equal to your Wisdom modifier plus your Proficiency Bonus, and you regain all expended uses when you finish a Short or Long Rest.",
      },
    ],
    description:
      "As a Bonus Action, you can command all of your swarms to make an Attack action instead of just one. Alternatively, a single swarm can attack twice instead of once when it takes the Attack action.\n\nYou can use this feature a number of times equal t...",
    source: "Grim Hollow: Player’s Guide, Ranger: Vermin Lord",
  },

  verminLordSpells: {
    id: "embers:ranger:vermin-lord:vermin-lord-spells",
    name: "Vermin Lord Spells",
    kind: "class_feature",
    status: "verified",
    classes: ["ranger"],
    subclass: "verminLord",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Vermin Lord Spells",
        description:
          "When you reach a Ranger level specified in the Vermin Lord Spells table, you thereafter always have the listed spells prepared.\n\nVermin Lord Spells\nRanger Level\tSpells\n3\tConsumption\n5\tAnimal Messenger\n9\tFlash Fever\n13\tFreedom of Movement\n17\tContagion",
      },
    ],
    description:
      "When you reach a Ranger level specified in the Vermin Lord Spells table, you thereafter always have the listed spells prepared.\n\nVermin Lord Spells\nRanger Level\tSpells\n3\tConsumption\n5\tAnimal Messenger\n9\tFlash Fever\n13\tFreedom of Movement\n17\tContagion",
    source: "Grim Hollow: Player’s Guide, Ranger: Vermin Lord",
  },

  filthAndFortitude: {
    id: "embers:ranger:vermin-lord:filth-and-fortitude",
    name: "Filth and Fortitude",
    kind: "class_feature",
    status: "verified",
    classes: ["ranger"],
    subclass: "verminLord",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Filth and Fortitude",
        description:
          "The time you’ve spent with plague-bearing rodents has rendered you immune to the Poisoned conditions. Additionally, you gain proficiency in Constitution saving throws.",
      },
    ],
    description:
      "The time you’ve spent with plague-bearing rodents has rendered you immune to the Poisoned conditions. Additionally, you gain proficiency in Constitution saving throws.",
    source: "Grim Hollow: Player’s Guide, Ranger: Vermin Lord",
  },

  infectiousSpread: {
    id: "embers:ranger:vermin-lord:infectious-spread",
    name: "Infectious Spread",
    kind: "class_feature",
    status: "verified",
    classes: ["ranger"],
    subclass: "verminLord",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Infectious Spread",
        description:
          "When you use Swarming Strikes, each swarm that takes the Attack action makes one additional attack. Each creature damaged by a swarm's attack during this action has the Poisoned condition until the start of your next turn.\n\nWe don’t have time to count all of them! Just write ‘hundreds of rodent bites.’\n\n— Altenheim Investigator",
      },
    ],
    description:
      "When you use Swarming Strikes, each swarm that takes the Attack action makes one additional attack. Each creature damaged by a swarm's attack during this action has the Poisoned condition until the start of your next turn.\n\nWe don’t have time to c...",
    source: "Grim Hollow: Player’s Guide, Ranger: Vermin Lord",
  },

  strengthOfTheSwarm: {
    id: "embers:ranger:vermin-lord:strength-of-the-swarm",
    name: "Strength of the Swarm",
    kind: "class_feature",
    status: "verified",
    classes: ["ranger"],
    subclass: "verminLord",
    activationType: "reaction",
    operations: [
      {
        type: "apply_effect",
        name: "Strength of the Swarm",
        description:
          "You can call on your rodent minions for defense. When you take damage from a creature you can see within 10 feet of yourself, you can take a Reaction to direct the damage toward a swarm you control you can see within 5 feet of yourself.",
      },
    ],
    description:
      "You can call on your rodent minions for defense. When you take damage from a creature you can see within 10 feet of yourself, you can take a Reaction to direct the damage toward a swarm you control you can see within 5 feet of yourself.",
    source: "Grim Hollow: Player’s Guide, Ranger: Vermin Lord",
  },

  swarmOfVermin: {
    id: "embers:ranger:vermin-lord:swarm-of-vermin",
    name: "SWARM OF VERMIN",
    kind: "class_feature",
    status: "verified",
    classes: ["ranger"],
    subclass: "verminLord",
    activationType: "special",
    resource: {
      name: "SWARM OF VERMIN",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "SWARM OF VERMIN",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "SWARM OF VERMIN",
        description:
          "Medium Swarm of Tiny Beasts, Unaligned\n\nAC 11 + the spell level\n\nHP 5 + 10 per spell level (the swarm has Hit Dice [d8s] equal to the spell's level)\n\nSpeed 30 ft., Climb 30 ft.\n\nABILITY\tSCORE\tMOD\tSAVE\nSTR\t9\t-1\t-1\nDEX\t13\t+1\t+1\nCON\t12\t+1\t+1\n\nABILITY\tSCORE\tMOD\tSAVE\nINT\t2\t-4\t-4\nWIS\t10\t+0\t+0\nCHA\t5\t-3\t-3\n\nResistances Bludgeoning, Piercing, Slashing\n\nImmunities Charmed, Frightened, Grappled, Paralyzed, Petrified, Prone, Restrained, Stunned\n\nSenses Darkvision 30 ft., Passive Perception 10\n\nLanguages ...",
      },
    ],
    description:
      "Medium Swarm of Tiny Beasts, Unaligned\n\nAC 11 + the spell level\n\nHP 5 + 10 per spell level (the swarm has Hit Dice [d8s] equal to the spell's level)\n\nSpeed 30 ft., Climb 30 ft.\n\nABILITY\tSCORE\tMOD\tSAVE\nSTR\t9\t-1\t-1\nDEX\t13\t+1\t+1\nCON\t12\t+1\t+1\n\nABILITY...",
    source: "Grim Hollow: Player’s Guide, Ranger: Vermin Lord",
  },
};
