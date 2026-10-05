import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const DEVOURER_GUILD_FORMULAS: Record<string, ManualActionFormula> = {
  alchemicalGastronomy: {
    id: "embers:monster-hunter:devourer-guild:alchemical-gastronomy",
    name: "Alchemical Gastronomy",
    kind: "class_feature",
    status: "verified",
    classes: ["monster-hunter"],
    subclass: "devourerGuild",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Alchemical Gastronomy",
        description:
          "You gain proficiency with Alchemist’s Supplies and Cook’s Utensils.",
      },
    ],
    description:
      "You gain proficiency with Alchemist’s Supplies and Cook’s Utensils.",
    source: "Grim Hollow: Player’s Guide, monster-hunter: Devourer Guild",
  },

  transmutingMetabolism: {
    id: "embers:monster-hunter:devourer-guild:transmuting-metabolism",
    name: "Transmuting Metabolism",
    kind: "class_feature",
    status: "verified",
    classes: ["monster-hunter"],
    subclass: "devourerGuild",
    activationType: "bonus",
    resource: {
      name: "Transmuting Metabolism",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Transmuting Metabolism",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Transmuting Metabolism",
        description:
          "You gain the ability to consume monster remains, which causes your body to adopt powerful and frightening mutations. These appear in the “Mutations” section later in the subclass’s description.\n\nSalvaging Portions. As a Utilize action, you can harvest a single portion from the physical remains of a creature. Only one portion can be harvested from each creature. Record the monster’s creature type. A harvested portion lasts until you finish a Long Rest, at which point it loses its potency.\n\nCon...",
      },
    ],
    description:
      "You gain the ability to consume monster remains, which causes your body to adopt powerful and frightening mutations. These appear in the “Mutations” section later in the subclass’s description.\n\nSalvaging Portions. As a Utilize action, you can har...",
    source: "Grim Hollow: Player’s Guide, monster-hunter: Devourer Guild",
  },

  synchronizedResponse: {
    id: "embers:monster-hunter:devourer-guild:synchronized-response",
    name: "Synchronized Response",
    kind: "class_feature",
    status: "verified",
    classes: ["monster-hunter"],
    subclass: "devourerGuild",
    activationType: "reaction",
    operations: [
      {
        type: "apply_effect",
        name: "Synchronized Response",
        description:
          "Your ingestion of monsters heightens your understanding of them and their behaviour. You gain this additional effect when you consume a monster portion: For 1 minute, when you make an attack as part of a Reaction, you deal an extra 1d6 damage. This damage has the same type as the weapon or Unarmed Strike used for the attack.",
      },
    ],
    description:
      "Your ingestion of monsters heightens your understanding of them and their behaviour. You gain this additional effect when you consume a monster portion: For 1 minute, when you make an attack as part of a Reaction, you deal an extra 1d6 damage. Thi...",
    source: "Grim Hollow: Player’s Guide, monster-hunter: Devourer Guild",
  },

  gnawingHunger: {
    id: "embers:monster-hunter:devourer-guild:gnawing-hunger",
    name: "Gnawing Hunger",
    kind: "class_feature",
    status: "verified",
    classes: ["monster-hunter"],
    subclass: "devourerGuild",
    activationType: "special",
    resource: {
      name: "Gnawing Hunger",
      resetType: "Short or Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Gnawing Hunger",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Gnawing Hunger",
        description:
          "Your hunger for your enemy allows you to partake of its essence during battle. When you deal damage to a creature with a melee attack using a weapon or Unarmed Strike, you gain Temporary Hit Points equal to half the damage dealt. If the target is a creature type in your Monster Grimoire, you instead gain Temporary Hit Points equal to the damage dealt instead.\n\nYou can use this feature a number of times equal to your Intelligence modifier (minimum of once). You regain all expended uses when yo...",
      },
    ],
    description:
      "Your hunger for your enemy allows you to partake of its essence during battle. When you deal damage to a creature with a melee attack using a weapon or Unarmed Strike, you gain Temporary Hit Points equal to half the damage dealt. If the target is ...",
    source: "Grim Hollow: Player’s Guide, monster-hunter: Devourer Guild",
  },

  alchemicalDecoctions: {
    id: "embers:monster-hunter:devourer-guild:alchemical-decoctions",
    name: "Alchemical Decoctions",
    kind: "class_feature",
    status: "verified",
    classes: ["monster-hunter"],
    subclass: "devourerGuild",
    activationType: "special",
    resource: {
      name: "Alchemical Decoctions",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Alchemical Decoctions",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Alchemical Decoctions",
        description:
          "You can spend 1 hour and 20 GP worth of alchemical ingredients (such as special herbs or monster salvage) to use your Alchemist’s Supplies to convert a monster portion into a decoction. A decoction is a magic potion that grants the benefits of a consumed monster portion. You can have 4 unconsumed decoctions active. You can destroy a decoction as a Utilize action.\n\nA creature other than you can consume 1 decoction without adverse effects. A creature gains 1 Exhaustion level for each decoction ...",
      },
    ],
    description:
      "You can spend 1 hour and 20 GP worth of alchemical ingredients (such as special herbs or monster salvage) to use your Alchemist’s Supplies to convert a monster portion into a decoction. A decoction is a magic potion that grants the benefits of a c...",
    source: "Grim Hollow: Player’s Guide, monster-hunter: Devourer Guild",
  },

  acquiredTaste: {
    id: "embers:monster-hunter:devourer-guild:acquired-taste",
    name: "Acquired Taste",
    kind: "class_feature",
    status: "verified",
    classes: ["monster-hunter"],
    subclass: "devourerGuild",
    activationType: "reaction",
    operations: [
      {
        type: "apply_effect",
        name: "Acquired Taste",
        description:
          "Your hunger for monster portions has increased to the point of being insatiable. You can now consume 1 additional portion safely. Additionally, for 1 minute when you consume a portion, you have Advantage, on attack rolls made as part of a Reaction.",
      },
    ],
    description:
      "Your hunger for monster portions has increased to the point of being insatiable. You can now consume 1 additional portion safely. Additionally, for 1 minute when you consume a portion, you have Advantage, on attack rolls made as part of a Reaction.",
    source: "Grim Hollow: Player’s Guide, monster-hunter: Devourer Guild",
  },

  mutations: {
    id: "embers:monster-hunter:devourer-guild:mutations",
    name: "Mutations",
    kind: "class_feature",
    status: "verified",
    classes: ["monster-hunter"],
    subclass: "devourerGuild",
    activationType: "bonus",
    operations: [
      {
        type: "apply_effect",
        name: "Mutations",
        description:
          "The mutations are presented here in alphabetical order, with required creature types shown in brackets after the mutation’s name.\n\nAcid Blood (Aberration, Ooze, Plant). For 1 minute, your blood becomes acidic. Each time a creature hits you with an attack while within 5 feet of you, it takes 2d6 Acid damage.\n\nAcumen (Celestial, Fiend, Fey). For 1 hour, you have Advantage on Wisdom (Insight) checks. Additionally, choose either Intimidation or Persuasion. You have Advantage on ability checks usi...",
      },
    ],
    description:
      "The mutations are presented here in alphabetical order, with required creature types shown in brackets after the mutation’s name.\n\nAcid Blood (Aberration, Ooze, Plant). For 1 minute, your blood becomes acidic. Each time a creature hits you with an...",
    source: "Grim Hollow: Player’s Guide, monster-hunter: Devourer Guild",
  },
};
