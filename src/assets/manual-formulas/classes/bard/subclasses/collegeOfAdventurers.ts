import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const COLLEGE_OF_ADVENTURERS_FORMULAS: Record<
  string,
  ManualActionFormula
> = {
  talentedAdventurer: {
    id: "embers:bard:college-of-adventurers:talented-adventurer",
    name: "Talented Adventurer",
    kind: "class_feature",
    status: "verified",
    classes: ["bard"],
    subclass: "collegeOfAdventurers",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Talented Adventurer",
        description:
          "You learn an adventurer’s talent of your choice from the “Adventurer’s Talent Options” section later in this subclass’s description. You learn an additional adventurer’s talent of your choice when you reach Bard levels 6 and 14.",
      },
    ],
    description:
      "You learn an adventurer’s talent of your choice from the “Adventurer’s Talent Options” section later in this subclass’s description. You learn an additional adventurer’s talent of your choice when you reach Bard levels 6 and 14.",
    source: "Grim Hollow: Player’s Guide, Bard: College of Adventurers",
  },

  partyPlanner: {
    id: "embers:bard:college-of-adventurers:party-planner",
    name: "Party Planner",
    kind: "class_feature",
    status: "verified",
    classes: ["bard"],
    subclass: "collegeOfAdventurers",
    activationType: "special",
    resource: {
      name: "Party Planner",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Party Planner",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Party Planner",
        description:
          "While a creature has a Bardic Inspiration die from you, it can use a Bonus Action to take the Help action.",
      },
    ],
    description:
      "While a creature has a Bardic Inspiration die from you, it can use a Bonus Action to take the Help action.",
    source: "Grim Hollow: Player’s Guide, Bard: College of Adventurers",
  },

  wellRounded: {
    id: "embers:bard:college-of-adventurers:well-rounded",
    name: "Well-Rounded",
    kind: "class_feature",
    status: "verified",
    classes: ["bard"],
    subclass: "collegeOfAdventurers",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Well-Rounded",
        description:
          "You gain proficiency with one type of Artisan’s Tools of your choice, you gain proficiency in one skill of your choice, and you know one language of your choice.",
      },
    ],
    description:
      "You gain proficiency with one type of Artisan’s Tools of your choice, you gain proficiency in one skill of your choice, and you know one language of your choice.",
    source: "Grim Hollow: Player’s Guide, Bard: College of Adventurers",
  },

  improvisationalTalent: {
    id: "embers:bard:college-of-adventurers:improvisational-talent",
    name: "Improvisational Talent",
    kind: "class_feature",
    status: "verified",
    classes: ["bard"],
    subclass: "collegeOfAdventurers",
    activationType: "special",
    resource: {
      name: "Improvisational Talent",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Improvisational Talent",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Improvisational Talent",
        description:
          "When you finish a Long Rest, you can choose one adventurer’s talent you know and replace it with one you don’t.\n\nJust show me what you can. I promise, I’m a quick study.\n\n—Wandering Bard",
      },
    ],
    description:
      "When you finish a Long Rest, you can choose one adventurer’s talent you know and replace it with one you don’t.\n\nJust show me what you can. I promise, I’m a quick study.\n\n—Wandering Bard",
    source: "Grim Hollow: Player’s Guide, Bard: College of Adventurers",
  },

  adventurerSTalents: {
    id: "embers:bard:college-of-adventurers:adventurer-s-talents",
    name: "Adventurer’s Talents",
    kind: "class_feature",
    status: "verified",
    classes: ["bard"],
    subclass: "collegeOfAdventurers",
    activationType: "bonus",
    resource: {
      name: "Adventurer’s Talents",
      resetType: "Short or Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Adventurer’s Talents",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Adventurer’s Talents",
        description:
          "The adventurer’s talents are listed in alphabetical order:\n\nBarbarian. You’ve learned to fight with primal ferocity. As a Bonus Action while you aren’t wearing Heavy armor, you can enter a rampage for 1 minute. During this time, you have Resistance to Bludgeoning, Piercing, and Slashing damage, and you can’t maintain Concentration. Your rampage ends early if you use a Bonus Action or have the Incapacitated condition.\n\nOnce you use this talent, you can’t use it again until you finish a Long Re...",
      },
    ],
    description:
      "The adventurer’s talents are listed in alphabetical order:\n\nBarbarian. You’ve learned to fight with primal ferocity. As a Bonus Action while you aren’t wearing Heavy armor, you can enter a rampage for 1 minute. During this time, you have Resistanc...",
    source: "Grim Hollow: Player’s Guide, Bard: College of Adventurers",
  },
};
