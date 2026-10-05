import type {
  ManualActionFormula,
  FeatureActionOption,
} from "../../../../../types/manualFormula";

export const PERSONA_MASK_OPTIONS: FeatureActionOption[] = [
  {
    id: "angel",
    name: "Angel",
    cost: 1,
    desc: "On hit (1/turn): expend Bardic Inspiration for extra Radiant damage equal to roll",
    actionType: "none",
  },
  {
    id: "archmage",
    name: "Archmage",
    cost: 0,
    desc: "Prepared: Fire Bolt, Scorching Ray, Thunderwave, Lightning Bolt (5th), Ice Storm (7th), Wall of Stone (9th)",
    actionType: "none",
  },
  {
    id: "devil",
    name: "Devil",
    cost: 1,
    desc: "Reaction when taking damage within 30 ft: deal 2x Bardic Inspiration fire damage and gain equal Temp HP",
    actionType: "reaction",
  },
  {
    id: "dragon",
    name: "Dragon",
    cost: 1,
    desc: "Bonus Action: 15-ft Cone DEX Save vs 2x Bardic Inspiration fire damage (half on success)",
    actionType: "bonus",
  },
  {
    id: "faceless",
    name: "Faceless",
    cost: 0,
    desc: "Cast Disguise Self without spell slot (1 min casting time, 8 hr duration)",
    actionType: "action",
  },
  {
    id: "gladiator",
    name: "Gladiator",
    cost: 1,
    desc: "Proficient in Martial weapons & Shields; Bonus Action attack using Bardic Inspiration",
    actionType: "bonus",
  },
  {
    id: "hierophant",
    name: "Hierophant",
    cost: 0,
    desc: "Prepared: Aid, Cure Wounds, Spare the Dying, Revivify (5th), Death Ward (7th), Mass Cure Wounds (9th)",
    actionType: "none",
  },
  {
    id: "jester",
    name: "Jester",
    cost: 1,
    desc: "Bonus Action: move half speed without OA; expend Bardic Inspiration to cast Vicious Mockery",
    actionType: "bonus",
  },
  {
    id: "noble",
    name: "Noble",
    cost: 1,
    desc: "Wear as part of BA; allies rolling your Bardic Inspiration roll twice and take higher",
    actionType: "bonus",
  },
];

export const COLLEGE_OF_MASKS_FORMULAS: Record<string, ManualActionFormula> = {
  personaMasks: {
    id: "embers:bard:college-of-masks:persona-masks",
    name: "Persona Masks",
    kind: "class_feature",
    status: "verified",
    classes: ["bard"],
    subclass: "collegeOfMasks",
    activationType: "bonus",
    resource: {
      name: "Bardic Inspiration",
      resetType: "Short or Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Bardic Inspiration",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Wear or Swap Mask",
        description:
          "As a Bonus Action, put on or switch a persona mask. You gain the benefits of the worn mask.",
      },
    ],
    description:
      "You channel archetypal roles through enchanted persona masks, gaining unique combat options, bonus prepared spells, and special reactions.",
    source: "Valda's Spire of Secrets: Player Pack 2, Bard: College of Masks",
    notes:
      "Know 3 masks at 3rd level, 4 at 6th, and 5 at 14th level. You can exchange one mask for another when finishing a Long Rest.",
  },

  thespian: {
    id: "embers:bard:college-of-masks:thespian",
    name: "Thespian: Dramatic Flair",
    kind: "class_feature",
    status: "verified",
    classes: ["bard"],
    subclass: "collegeOfMasks",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Dramatic Flair",
        description:
          "Add your Bardic Inspiration die to Charisma (Performance) checks without expending it. Gain Disguise Kit proficiency.",
      },
    ],
    description:
      "Your theatrical training enhances performances without draining your inspiring power.",
    source: "Valda's Spire of Secrets: Player Pack 2, Bard: College of Masks",
  },

  virtuosoSkill: {
    id: "embers:bard:college-of-masks:virtuoso-skill",
    name: "Virtuoso Skill",
    kind: "class_feature",
    status: "verified",
    classes: ["bard"],
    subclass: "collegeOfMasks",
    activationType: "special",
    resource: {
      name: "Virtuoso Skill",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Virtuoso Skill",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Charisma D20 Test",
        description:
          "Once per turn when you make a D20 Test, make it with Charisma instead of its normal ability.",
      },
    ],
    description:
      "You can substitute pure Charisma for any D20 Test once per turn.",
    source: "Valda's Spire of Secrets: Player Pack 2, Bard: College of Masks",
    notes:
      "Usable a number of times equal to your Charisma modifier (minimum 1) per Long Rest.",
  },

  masterOfManyFaces: {
    id: "embers:bard:college-of-masks:master-of-many-faces",
    name: "Master of Many Faces",
    kind: "class_feature",
    status: "verified",
    classes: ["bard"],
    subclass: "collegeOfMasks",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Dual Masks",
        description:
          "You can wear two persona masks simultaneously, gaining the benefits of both.",
      },
    ],
    description:
      "You achieve supreme theatrical mastery, donning two masks at once.",
    source: "Valda's Spire of Secrets: Player Pack 2, Bard: College of Masks",
  },
};
