import type { ManualActionFormula } from "../../../../types/manualFormula";
import { CIRCLE_OF_BLOOD_FORMULAS } from "./subclasses/circleOfBlood";
import { CIRCLE_OF_ENTROPY_FORMULAS } from "./subclasses/circleOfEntropy";
import { CIRCLE_OF_MUTATION_FORMULAS } from "./subclasses/circleOfMutation";
import { CIRCLE_OF_THE_CITY_FORMULAS } from "./subclasses/circleOfTheCity";
import { CIRCLE_OF_THE_LAND_FORMULAS } from "./subclasses/circleOfTheLand";
import { CIRCLE_OF_THE_MOON_FORMULAS } from "./subclasses/circleOfTheMoon";
import { CIRCLE_OF_THE_SEA_FORMULAS } from "./subclasses/circleOfTheSea";
import { CIRCLE_OF_THE_STARS_FORMULAS } from "./subclasses/circleOfTheStars";

export const DRUID_CLASS_FORMULAS: Record<string, ManualActionFormula> = {
  primalOrder: {
    id: "embers:druid:primal-order",
    name: "Primal Order",
    kind: "class_feature",
    status: "verified",
    classes: ["druid"],
    activationType: "special",
    description: "Dedicate yourself to a sacred order of nature: Magician or Warden.",
    source: "Player's Handbook (2024), Druid: Primal Order",
    operations: [],
    options: [
      {
        id: "magician",
        name: "Magician",
        description: "You know one extra cantrip from the Druid spell list, and gain a bonus to Arcana and Nature checks equal to your Wisdom modifier (minimum +1).",
      },
      {
        id: "warden",
        name: "Warden",
        description: "Trained for battle, you gain proficiency with Martial weapons and training with Medium armor.",
      },
    ],
  },
  wildShape: {
    id: "embers:druid:wild-shape",
    name: "Wild Shape",
    kind: "class_feature",
    status: "verified",
    classes: ["druid"],
    activationType: "bonus",
    resource: {
      name: "Wild Shape",
      resetType: "Short or Long Rest",
      scaling: {
        type: "level_table",
        classId: "druid",
        table: [
          { minLevel: 2, value: 2 },
          { minLevel: 6, value: 3 },
          { minLevel: 17, value: 4 },
        ],
      },
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Wild Shape",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Beast Transformation",
        description:
          "Assume the shape of a known Beast form as a Bonus Action, gaining its physical traits, speed, and attacks while retaining mental stats and personality.",
      },
    ],
    description: "Magically assume the shape of a beast that you have learned.",
    source: "Player's Handbook (2024), Druid: Wild Shape",
  },
  wildCompanion: {
    id: "embers:druid:wild-companion",
    name: "Wild Companion",
    kind: "class_feature",
    status: "verified",
    classes: ["druid"],
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
        name: "Fey Familiar",
        description:
          "Cast Find Familiar without material components by expending 1 Wild Shape use; the familiar is a Fey spirit that disappears after a Long Rest.",
      },
    ],
    description: "Summon a nature spirit familiar using a use of your Wild Shape.",
    source: "Player's Handbook (2024), Druid: Wild Companion",
  },
  wildResurgence: {
    id: "embers:druid:wild-resurgence",
    name: "Wild Resurgence",
    kind: "class_feature",
    status: "verified",
    classes: ["druid"],
    activationType: "bonus",
    description: "Channel primal power between spell slots and Wild Shape.",
    source: "Player's Handbook (2024), Druid: Wild Resurgence",
    operations: [],
    options: [
      {
        id: "slot_to_wild_shape",
        name: "Convert Spell Slot to Wild Shape",
        description: "Once per turn, expend a spell slot to regain 1 expended use of Wild Shape.",
      },
      {
        id: "wild_shape_to_slot",
        name: "Convert Wild Shape to Spell Slot",
        description: "Once per Long Rest, expend 1 use of Wild Shape to regain one expended level 1 spell slot.",
      },
    ],
  },
  elementalFury: {
    id: "embers:druid:elemental-fury",
    name: "Elemental Fury",
    kind: "class_feature",
    status: "verified",
    classes: ["druid"],
    activationType: "special",
    description: "Infuse your attacks with the raw fury of nature: Primal Strike or Potent Cantrip.",
    source: "Player's Handbook (2024), Druid: Elemental Fury",
    operations: [],
    options: [
      {
        id: "primal_strike",
        name: "Primal Strike",
        description: "Once on each of your turns when you hit with an attack roll using a weapon or a beast form, deal an extra 1d8 Cold, Fire, Lightning, or Thunder damage (increases to 2d8 at Level 15).",
        weaponDamageRider: {
          damageFormula: "1d8",
          damageType: "cold",
          condition: "Once per turn on hit with a weapon or beast form attack",
        },
      },
      {
        id: "potent_cantrip",
        name: "Potent Cantrip",
        description: "Add your Wisdom modifier to the damage dealt by any Druid cantrip. At Level 15, the range of your Druid cantrips with a range of 10 feet or greater increases by 300 feet.",
      },
    ],
  },
  beastSpells: {
    id: "embers:druid:beast-spells",
    name: "Beast Spells",
    kind: "class_feature",
    status: "verified",
    classes: ["druid"],
    activationType: "special",
    description: "Cast spells in beast shape, providing verbal and somatic components freely.",
    source: "Player's Handbook (2024), Druid: Beast Spells",
    operations: [
      {
        type: "apply_effect",
        name: "Wild Shape Spellcasting",
        description: "While in Wild Shape, you can cast spells, performing verbal and somatic components in beast form. You cannot cast spells that require expensive material components.",
      },
    ],
  },
  archdruid: {
    id: "embers:druid:archdruid",
    name: "Archdruid",
    kind: "class_feature",
    status: "verified",
    classes: ["druid"],
    activationType: "special",
    description: "You embody the ultimate vitality and infinite endurance of nature.",
    source: "Player's Handbook (2024), Druid: Archdruid",
    operations: [
      {
        type: "apply_effect",
        name: "Evergreen Wild Shape & Nature Magician",
        description: "When you roll Initiative and have no uses of Wild Shape left, you regain 1 use. In addition, you can expend Wild Shape uses to regain level 1 spell slots without the once per Long Rest restriction.",
      },
    ],
  },
  ...CIRCLE_OF_BLOOD_FORMULAS,
  ...CIRCLE_OF_ENTROPY_FORMULAS,
  ...CIRCLE_OF_MUTATION_FORMULAS,
  ...CIRCLE_OF_THE_CITY_FORMULAS,
  ...CIRCLE_OF_THE_LAND_FORMULAS,
  ...CIRCLE_OF_THE_MOON_FORMULAS,
  ...CIRCLE_OF_THE_SEA_FORMULAS,
  ...CIRCLE_OF_THE_STARS_FORMULAS,
};

export {
  CIRCLE_OF_BLOOD_FORMULAS,
  CIRCLE_OF_ENTROPY_FORMULAS,
  CIRCLE_OF_MUTATION_FORMULAS,
  CIRCLE_OF_THE_CITY_FORMULAS,
  CIRCLE_OF_THE_LAND_FORMULAS,
  CIRCLE_OF_THE_MOON_FORMULAS,
  CIRCLE_OF_THE_SEA_FORMULAS,
  CIRCLE_OF_THE_STARS_FORMULAS,
};
