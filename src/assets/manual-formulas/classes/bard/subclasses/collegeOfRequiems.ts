import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const COLLEGE_OF_REQUIEMS_FORMULAS: Record<string, ManualActionFormula> =
  {
    chillingMelody: {
      id: "embers:bard:college-of-requiems:chilling-melody",
      name: "Chilling Melody",
      kind: "class_feature",
      status: "verified",
      classes: ["bard"],
      subclass: "collegeOfRequiems",
      activationType: "special",
      operations: [
        {
          type: "apply_effect",
          name: "Chilling Melody",
          description:
            "You learn two Necromancy cantrips of your choice. These count as Bard spells for you but don’t count against the number of cantrips you know.",
        },
      ],
      description:
        "You learn two Necromancy cantrips of your choice. These count as Bard spells for you but don’t count against the number of cantrips you know.",
      source: "Grim Hollow: Player’s Guide, Bard: College of Requiems",
    },

    pluckTheHeartstrings: {
      id: "embers:bard:college-of-requiems:pluck-the-heartstrings",
      name: "Pluck the Heartstrings",
      kind: "class_feature",
      status: "verified",
      classes: ["bard"],
      subclass: "collegeOfRequiems",
      activationType: "special",
      resource: {
        name: "Pluck the Heartstrings",
        resetType: "Long Rest",
      },
      operations: [
        {
          type: "resource_cost",
          resource: "Pluck the Heartstrings",
          amount: 1,
        },
        {
          type: "apply_effect",
          name: "Pluck the Heartstrings",
          description:
            "Your Bardic Inspiration can pluck at the tethers of life. Each creature that has a Bardic Inspiration die from you can use it for one of the following effects.\n\nDefense. When the creature is reduced to 0 Hit Points and not killed outright, the creature can roll the Bardic Inspiration die to be reduced to a number of Hit Points rolled on the Bardic Inspiration die instead.\n\nOffense. Immediately after the creature hits a target with an attack roll, the creature can roll the Bardic Inspiration d...",
        },
      ],
      description:
        "Your Bardic Inspiration can pluck at the tethers of life. Each creature that has a Bardic Inspiration die from you can use it for one of the following effects.\n\nDefense. When the creature is reduced to 0 Hit Points and not killed outright, the cre...",
      source: "Grim Hollow: Player’s Guide, Bard: College of Requiems",
    },

    stirTheBones: {
      id: "embers:bard:college-of-requiems:stir-the-bones",
      name: "Stir the Bones",
      kind: "class_feature",
      status: "verified",
      classes: ["bard"],
      subclass: "collegeOfRequiems",
      activationType: "special",
      resource: {
        name: "Stir the Bones",
        resetType: "Long Rest",
      },
      operations: [
        {
          type: "resource_cost",
          resource: "Stir the Bones",
          amount: 1,
        },
        {
          type: "apply_effect",
          name: "Stir the Bones",
          description:
            "You always have the Animate Dead spell prepared. It counts as a Bard spell for you.\n\nWhen you expend a use of Bardic Inspiration, choose Undead creatures under your control within 60 feet of yourself, up to a number equal to your Charisma modifier (minimum of one creature). The chosen creatures each gain a Bardic Inspiration die. These extra Bardic Inspiration dice do not count against your limit.\n\nWhen an Undead creature under your control expends a Bardic Inspiration die on an attack roll, ...",
        },
      ],
      description:
        "You always have the Animate Dead spell prepared. It counts as a Bard spell for you.\n\nWhen you expend a use of Bardic Inspiration, choose Undead creatures under your control within 60 feet of yourself, up to a number equal to your Charisma modifier...",
      source: "Grim Hollow: Player’s Guide, Bard: College of Requiems",
    },

    dualDeath: {
      id: "embers:bard:college-of-requiems:dual-death",
      name: "Dual Death",
      kind: "class_feature",
      status: "verified",
      classes: ["bard"],
      subclass: "collegeOfRequiems",
      activationType: "special",
      resource: {
        name: "Dual Death",
        resetType: "Long Rest",
      },
      operations: [
        {
          type: "resource_cost",
          resource: "Dual Death",
          amount: 1,
        },
        {
          type: "apply_effect",
          name: "Dual Death",
          description:
            "When you cast a Necromancy spell that targets only one creature, you can have it target a second creature within range.\n\nOnce you use this feature, you can’t use it again until you finish a Long Rest. You can also restore your use of it by expending one use of your Bardic Inspiration dice (no action required).",
        },
      ],
      description:
        "When you cast a Necromancy spell that targets only one creature, you can have it target a second creature within range.\n\nOnce you use this feature, you can’t use it again until you finish a Long Rest. You can also restore your use of it by expendi...",
      source: "Grim Hollow: Player’s Guide, Bard: College of Requiems",
    },
  };
