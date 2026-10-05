import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const CIRCLE_OF_THE_CITY_FORMULAS: Record<string, ManualActionFormula> =
  {
    cityShape: {
      id: "embers:druid:circle-of-the-city:city-shape",
      name: "City Shape",
      kind: "class_feature",
      status: "verified",
      classes: ["druid"],
      subclass: "circleOfTheCity",
      activationType: "action",
      resource: {
        name: "Wild Shape",
        resetType: "Short or Long Rest",
      },
      operations: [
        {
          type: "resource_cost",
          resource: "Wild Shape",
          amount: 1,
        },
        {
          type: "apply_effect",
          name: "Architectural Casting",
          description:
            "Expend 1 use of Wild Shape to cast Meld into Stone, Passwall, or Stone Shape without expending a spell slot.",
        },
      ],
      description: "You manipulate brick, mortar, and stone with primal power.",
      source:
        "Valda's Spire of Secrets: Player Pack 2, Druid: Circle of the City",
    },

    urbanDruid: {
      id: "embers:druid:circle-of-the-city:urban-druid",
      name: "Urban Druid: Street Savvy",
      kind: "class_feature",
      status: "verified",
      classes: ["druid"],
      subclass: "circleOfTheCity",
      activationType: "special",
      operations: [
        {
          type: "apply_effect",
          name: "Street Savvy",
          description:
            "Add your Wisdom modifier (min +1) to checks with one chosen skill (Acrobatics, History, Intimidation, Investigation, Persuasion, or Stealth). Speak with Plants, Transport via Plants, and Tree Stride can target structures.",
        },
      ],
      description:
        "You adapt primal magic to urban environments and civil architecture.",
      source:
        "Valda's Spire of Secrets: Player Pack 2, Druid: Circle of the City",
    },

    objectShape: {
      id: "embers:druid:circle-of-the-city:object-shape",
      name: "Object Shape",
      kind: "class_feature",
      status: "verified",
      classes: ["druid"],
      subclass: "circleOfTheCity",
      activationType: "bonus",
      resource: {
        name: "Wild Shape",
        resetType: "Short or Long Rest",
      },
      operations: [
        {
          type: "resource_cost",
          resource: "Wild Shape",
          amount: 1,
        },
        {
          type: "apply_effect",
          name: "Animated Object Transformation",
          description:
            "When assuming Wild Shape, transform into an Animated Object (up to Large size; Huge at level 10) as if created by Animate Objects.",
        },
      ],
      description:
        "Transform into animated statues, furniture, iron constructs, or stone pillars.",
      source:
        "Valda's Spire of Secrets: Player Pack 2, Druid: Circle of the City",
    },

    wallWarp: {
      id: "embers:druid:circle-of-the-city:wall-warp",
      name: "Wall Warp",
      kind: "class_feature",
      status: "verified",
      classes: ["druid"],
      subclass: "circleOfTheCity",
      activationType: "reaction",
      resource: {
        name: "Wall Warp",
        resetType: "Long Rest",
      },
      operations: [
        {
          type: "resource_cost",
          resource: "Wall Warp",
          amount: 1,
        },
        {
          type: "apply_effect",
          name: "Defensive Stone Panel",
          duration: "Until end of next turn",
          description:
            "Reaction when a creature within 60 ft takes attack damage: manifest a 10x10 ft stone panel (AC 15, 30 HP) absorbing the damage.",
        },
      ],
      description:
        "Erect an instantaneous stone partition to absorb incoming attacks. 1/Long Rest or expend a level 3+ spell slot.",
      source:
        "Valda's Spire of Secrets: Player Pack 2, Druid: Circle of the City",
    },

    urbanColossus: {
      id: "embers:druid:circle-of-the-city:urban-colossus",
      name: "Urban Colossus",
      kind: "class_feature",
      status: "verified",
      classes: ["druid"],
      subclass: "circleOfTheCity",
      activationType: "special",
      operations: [
        {
          type: "apply_effect",
          name: "Colossus Enhancements",
          description:
            "While in Object Shape: AC becomes 18, damage threshold 10, Multiattack with Slam, and trample smaller creatures for 2d6 + WIS bludgeoning damage and Prone.",
        },
      ],
      description:
        "Your object transformations become towering juggernauts of urban warfare.",
      source:
        "Valda's Spire of Secrets: Player Pack 2, Druid: Circle of the City",
    },
  };
