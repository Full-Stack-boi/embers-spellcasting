import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const COLLEGE_OF_DANCE_FORMULAS: Record<string, ManualActionFormula> = {
  dazzlingFootwork: {
    id: "embers:bard:dance:dazzling-footwork",
    name: "Dazzling Footwork",
    kind: "class_feature",
    status: "verified",
    classes: ["bard"],
    subclass: "collegeOfDance",
    activationType: "bonus",
    operations: [
      {
        type: "apply_effect",
        name: "Dancer's Cadence",
        description:
          "While not wearing armor or wielding a shield: AC = 10 + DEX mod + CHA mod; your Unarmed Strikes deal Bardic Inspiration die damage with Dexterity; Bonus Action make an Unarmed Strike.",
      },
    ],
    description:
      "Weave acrobatic footwork and unarmed dance strikes into combat choreography.",
    source: "Player's Handbook (2024), Bard: College of Dance",
  },

  inspiringMovement: {
    id: "embers:bard:dance:inspiring-movement",
    name: "Inspiring Movement",
    kind: "class_feature",
    status: "verified",
    classes: ["bard"],
    subclass: "collegeOfDance",
    activationType: "reaction",
    operations: [
      {
        type: "apply_effect",
        name: "Evasive Tango",
        description:
          "Reaction when an enemy ends its turn within 5 feet: move up to half your speed without provoking Opportunity Attacks, and an ally within 30 ft can move half speed.",
      },
    ],
    description:
      "Evade enemy close-quarters positioning with fluid tandem steps.",
    source: "Player's Handbook (2024), Bard: College of Dance",
  },

  tandemFootwork: {
    id: "embers:bard:dance:tandem-footwork",
    name: "Tandem Footwork",
    kind: "class_feature",
    status: "verified",
    classes: ["bard"],
    subclass: "collegeOfDance",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Initiative Choreography",
        description:
          "When rolling Initiative, spend 1 Bardic Inspiration to grant you and allies within 60 feet a bonus equal to the roll.",
      },
    ],
    description:
      "Coordinate opening positioning to ensure your party strikes first.",
    source: "Player's Handbook (2024), Bard: College of Dance",
  },

  leadingEvasion: {
    id: "embers:bard:dance:leading-evasion",
    name: "Leading Evasion",
    kind: "class_feature",
    status: "verified",
    classes: ["bard"],
    subclass: "collegeOfDance",
    activationType: "special",
    description: "When you succeed on a Dexterity saving throw to take half damage, you take no damage, and half damage on failure. Allies within 5 feet share this benefit.",
    source: "Player's Handbook (2024), Bard: College of Dance",
    operations: [
      {
        type: "apply_effect",
        name: "Synchronized Evasion",
        description: "Take no damage on successful Dex saves and half damage on failures; creatures within 5 feet share this benefit while you are not Incapacitated.",
      },
    ],
  },
};
