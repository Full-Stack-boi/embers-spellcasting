import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const CIRCLE_OF_MUTATION_FORMULAS: Record<string, ManualActionFormula> =
  {
    circleForms: {
      id: "embers:druid:circle-of-mutation:circle-forms",
      name: "Circle Forms",
      kind: "class_feature",
      status: "verified",
      classes: ["druid"],
      subclass: "circleOfMutation",
      activationType: "bonus",
      resource: {
        name: "Circle Forms",
        resetType: "Long Rest",
      },
      operations: [
        {
          type: "resource_cost",
          resource: "Circle Forms",
          amount: 1,
        },
        {
          type: "apply_effect",
          name: "Circle Forms",
          description:
            "You channel the endless possibilities of nature when you assume a Wild Shape form, granting you the benefits below.\n\nChallenge Rating. The maximum Challenge Rating for the form equals your Druid level divided by 3 (rounded down).\n\nPredator’s Strike. When you hit a creature with an attack roll using a Beast form’s attack in Wild Shape, you add +2 to the damage dealt.\n\nUnpredictable. You can take the Dash, Disengage, or Influence action as a Bonus Action.",
        },
      ],
      description:
        "You channel the endless possibilities of nature when you assume a Wild Shape form, granting you the benefits below.\n\nChallenge Rating. The maximum Challenge Rating for the form equals your Druid level divided by 3 (rounded down).\n\nPredator’s Strik...",
      source: "Grim Hollow: Player’s Guide, Druid: Circle of Mutation",
    },

    mutateShape: {
      id: "embers:druid:circle-of-mutation:mutate-shape",
      name: "Mutate Shape",
      kind: "class_feature",
      status: "verified",
      classes: ["druid"],
      subclass: "circleOfMutation",
      activationType: "bonus",
      resource: {
        name: "Mutate Shape",
        resetType: "Long Rest",
      },
      operations: [
        {
          type: "resource_cost",
          resource: "Mutate Shape",
          amount: 1,
        },
        {
          type: "apply_effect",
          name: "Mutate Shape",
          description:
            "When you assume a Wild Shape form, or as a Bonus Action while your Wild Shape is active, you can expend a spell slot to gain Mutation Points equal to the slot’s level. These Mutation Points last until they are spent, you gain additional Mutation Points, or you leave the form. While you have Mutation Points, you can spend them on your turn (no action required by you) to gain a Mutation from the list below. When you do, your body distends and reconstitutes in a gruesome display.\n\nMutations last...",
        },
      ],
      description:
        "When you assume a Wild Shape form, or as a Bonus Action while your Wild Shape is active, you can expend a spell slot to gain Mutation Points equal to the slot’s level. These Mutation Points last until they are spent, you gain additional Mutation P...",
      source: "Grim Hollow: Player’s Guide, Druid: Circle of Mutation",
    },

    mutationOptions: {
      id: "embers:druid:circle-of-mutation:mutation-options",
      name: "Mutation Options",
      kind: "class_feature",
      status: "verified",
      classes: ["druid"],
      subclass: "circleOfMutation",
      activationType: "bonus",
      resource: {
        name: "Mutation Options",
        resetType: "Long Rest",
      },
      operations: [
        {
          type: "resource_cost",
          resource: "Mutation Options",
          amount: 1,
        },
        {
          type: "apply_effect",
          name: "Mutation Options",
          description:
            "The following options are available to your Mutate Shape feature. The options are presented in alphabetical order.\n\nRepeatable. A Mutation can be gained only once for each Wildshape use unless its description states otherwise in a “Repeatable” subsection.\n\nCreature of the Sea\n\nCost: 1 Mutation Point\n\nYou gain a Swim Speed equal to your Speed, and you can breathe underwater. For an additional 1 Mutation Point, you gain a Swim Speed equal to twice your speed.\n\nCreature of the Sky\n\nCost: 3 Mutat...",
        },
      ],
      description:
        "The following options are available to your Mutate Shape feature. The options are presented in alphabetical order.\n\nRepeatable. A Mutation can be gained only once for each Wildshape use unless its description states otherwise in a “Repeatable” sub...",
      source: "Grim Hollow: Player’s Guide, Druid: Circle of Mutation",
    },

    unnaturalAndUnnerving: {
      id: "embers:druid:circle-of-mutation:unnatural-and-unnerving",
      name: "Unnatural and Unnerving",
      kind: "class_feature",
      status: "verified",
      classes: ["druid"],
      subclass: "circleOfMutation",
      activationType: "special",
      resource: {
        name: "Unnatural and Unnerving",
        resetType: "Long Rest",
      },
      operations: [
        {
          type: "resource_cost",
          resource: "Unnatural and Unnerving",
          amount: 1,
        },
        {
          type: "apply_effect",
          name: "Unnatural and Unnerving",
          description:
            "When you expend a level 2+ spell slot to gain Mutation Points, you regain one expended spell slot. The slot you regain must be of a level lower than the slot you expended and can’t be higher than level 5.\n\nIn addition, while in Wild Shape form, you gain the following benefits.\n\nUnnatural Attacks. Each of your attacks in Wild Shape form can deal its normal damage type or Force damage. You make this choice each time you hit with those attacks.\n\nUnnerving Aura. You have Advantage on Charisma (De...",
        },
      ],
      description:
        "When you expend a level 2+ spell slot to gain Mutation Points, you regain one expended spell slot. The slot you regain must be of a level lower than the slot you expended and can’t be higher than level 5.\n\nIn addition, while in Wild Shape form, yo...",
      source: "Grim Hollow: Player’s Guide, Druid: Circle of Mutation",
    },

    endlessEvolution: {
      id: "embers:druid:circle-of-mutation:endless-evolution",
      name: "Endless Evolution",
      kind: "class_feature",
      status: "verified",
      classes: ["druid"],
      subclass: "circleOfMutation",
      activationType: "special",
      resource: {
        name: "Endless Evolution",
        resetType: "Long Rest",
      },
      operations: [
        {
          type: "resource_cost",
          resource: "Endless Evolution",
          amount: 1,
        },
        {
          type: "apply_effect",
          name: "Endless Evolution",
          description:
            "When you gain Mutation Points, you gain an additional number of Mutation Points equal to your Wisdom modifier (minimum 1). In addition, you can now spend your Mutation Points on the following Mutations.\n\nCreature of Earth\n\nCost: 3 Mutation Points\n\nYou have Tremorsense with a range of 30 feet. You can spend 2 additional Mutation Points to gain a Burrow Speed equal to your Speed.\n\nElemental Inurement\n\nCost: 2 Mutation Points\n\nYou gain Resistance to one of the following damage types of your choi...",
        },
      ],
      description:
        "When you gain Mutation Points, you gain an additional number of Mutation Points equal to your Wisdom modifier (minimum 1). In addition, you can now spend your Mutation Points on the following Mutations.\n\nCreature of Earth\n\nCost: 3 Mutation Points\n...",
      source: "Grim Hollow: Player’s Guide, Druid: Circle of Mutation",
    },

    apexPredator: {
      id: "embers:druid:circle-of-mutation:apex-predator",
      name: "Apex Predator",
      kind: "class_feature",
      status: "verified",
      classes: ["druid"],
      subclass: "circleOfMutation",
      activationType: "action",
      resource: {
        name: "Apex Predator",
        resetType: "Long Rest",
      },
      operations: [
        {
          type: "resource_cost",
          resource: "Apex Predator",
          amount: 1,
        },
        {
          type: "apply_effect",
          name: "Apex Predator",
          description:
            "Your mastery of mutation has made you an apex predator, granting you the following benefits.\n\nEvolved Attacks. Once per turn, you can deal an extra 2d10 Force damage to a target you hit with a Wild Shape form’s attack.\n\nMutate Beasts. As a Magic action, you can touch a Beast and expend a spell slot, causing the target to mutate. You gain Mutation Points equal to the slot’s level, which you must immediately spend on Mutations for the Beast. Unspent Mutation Points are lost. Mutations remain un...",
        },
      ],
      description:
        "Your mastery of mutation has made you an apex predator, granting you the following benefits.\n\nEvolved Attacks. Once per turn, you can deal an extra 2d10 Force damage to a target you hit with a Wild Shape form’s attack.\n\nMutate Beasts. As a Magic a...",
      source: "Grim Hollow: Player’s Guide, Druid: Circle of Mutation",
    },
  };
