import type {
  ManualActionFormula,
  FeatureActionOption,
} from "../../../../types/manualFormula";
import { ABERRANT_SORCERY_FORMULAS } from "./subclasses/aberrantSorcery";
import { APOCALYPSE_SORCERY_FORMULAS } from "./subclasses/apocalypseSorcery";
import { CLOCKWORK_SORCERY_FORMULAS } from "./subclasses/clockworkSorcery";
import { DRACONIC_SORCERY_FORMULAS } from "./subclasses/draconicSorcery";
import { HAUNTED_SORCERY_FORMULAS } from "./subclasses/hauntedSorcery";
import { HEROIC_SORCERY_FORMULAS, MYSTICAL_MANEUVER_OPTIONS } from "./subclasses/heroicSorcery";
import { SPELLFIRE_SORCERY_FORMULAS } from "./subclasses/spellfireSorcery";
import { WILD_MAGIC_SORCERY_FORMULAS } from "./subclasses/wildMagicSorcery";
import { WRETCHED_BLOODLINE_SORCERY_FORMULAS } from "./subclasses/wretchedBloodlineSorcery";

const FONT_CREATE_OPTIONS = [
  { slotLevel: 1, cost: 2, minLevel: 2 },
  { slotLevel: 2, cost: 3, minLevel: 3 },
  { slotLevel: 3, cost: 5, minLevel: 5 },
  { slotLevel: 4, cost: 6, minLevel: 7 },
  { slotLevel: 5, cost: 7, minLevel: 9 },
];

const METAMAGIC_OPTIONS: FeatureActionOption[] = [
  {
    id: "careful",
    name: "Careful Spell",
    cost: 1,
    desc: "Protect allies from spell effects (automatic success on saving throw)",
    actionType: "none",
  },
  {
    id: "distant",
    name: "Distant Spell",
    cost: 1,
    desc: "Double range or extend touch range to 30 ft",
    actionType: "none",
  },
  {
    id: "empowered",
    name: "Empowered Spell",
    cost: 1,
    desc: "Reroll damage dice up to Charisma modifier (minimum 1)",
    actionType: "none",
  },
  {
    id: "extended",
    name: "Extended Spell",
    cost: 1,
    desc: "Double duration up to 24 hours, or advantage on concentration saves",
    actionType: "none",
  },
  {
    id: "heightened",
    name: "Heightened Spell",
    cost: 2,
    desc: "Impose Disadvantage on target's first saving throw against the spell",
    actionType: "none",
  },
  {
    id: "quickened",
    name: "Quickened Spell",
    cost: 2,
    desc: "Change casting time from 1 action to 1 bonus action",
    actionType: "none",
  },
  {
    id: "seeking",
    name: "Seeking Spell",
    cost: 2,
    desc: "Reroll a missed spell attack roll",
    actionType: "none",
  },
  {
    id: "subtle",
    name: "Subtle Spell",
    cost: 1,
    desc: "Cast without Verbal, Somatic, or non-cost Material components",
    actionType: "none",
  },
  {
    id: "transmuted",
    name: "Transmuted Spell",
    cost: 1,
    desc: "Change elemental damage type to Acid, Cold, Fire, Lightning, Poison, or Thunder",
    actionType: "none",
  },
  {
    id: "twinned",
    name: "Twinned Spell",
    cost: 1,
    desc: "Target second creature when upcasting single-target spell",
    actionType: "none",
  },
];

export const SORCERER_CLASS_FORMULAS: Record<string, ManualActionFormula> = {
  fontOfMagic: {
    id: "embers:font-of-magic",
    name: "Font of Magic",
    kind: "class_feature",
    status: "verified",
    classes: ["sorcerer"],
    activationType: "special",
    flyoutType: "convert_slots",
    resource: {
      name: "Sorcery Points",
      canExceedMax: false,
      resetType: "Long Rest",
      scaling: {
        type: "class_level",
        classId: "sorcerer",
        multiplier: 1,
      },
    },
    operations: [
      {
        type: "convert_spell_slot_to_resource",
        actionType: "none",
        resourcePerSlotLevel: 1,
      },
      {
        type: "create_spell_slot",
        actionType: "bonus",
        maxSlotLevel: 5,
        options: [
          { slotLevel: 1, pointCost: 2, minimumClassLevel: 2 },
          { slotLevel: 2, pointCost: 3, minimumClassLevel: 3 },
          { slotLevel: 3, pointCost: 5, minimumClassLevel: 5 },
          { slotLevel: 4, pointCost: 6, minimumClassLevel: 7 },
          { slotLevel: 5, pointCost: 7, minimumClassLevel: 9 },
        ],
      },
    ],
    description:
      "Convert spell slots into Sorcery Points (no action) or create spell slots as a Bonus Action.",
    source: "Player's Handbook (2024), Sorcerer: Font of Magic",
  },
  metamagic: {
    id: "embers:sorcerer:metamagic",
    name: "Metamagic",
    kind: "class_feature",
    status: "verified",
    classes: ["sorcerer"],
    activationType: "special",
    flyoutType: "options_grid",
    options: METAMAGIC_OPTIONS,
    operations: [
      {
        type: "apply_effect",
        name: "Metamagic Shaping",
        description:
          "Expend Sorcery Points to alter spells: Careful, Distant, Empowered, Extended, Heightened, Quickened, Seeking, Subtle, Transmuted, or Twinned.",
      },
    ],
    description:
      "Alter and shape the fundamental parameters of your magic spells.",
    source: "Player's Handbook (2024), Sorcerer: Metamagic",
  },
  innateSorcery: {
    id: "embers:sorcerer:innate-sorcery",
    name: "Innate Sorcery",
    kind: "class_feature",
    status: "verified",
    classes: ["sorcerer"],
    activationType: "bonus",
    resource: {
      name: "Innate Sorcery",
      resetType: "Long Rest",
      scaling: {
        type: "flat",
        multiplier: 2,
      },
    },
    operations: [
      {
        type: "apply_effect",
        name: "Raw Arcana Surge",
        description:
          "Bonus Action unleash innate magic for 1 minute: spell save DC increases by +1, and you have Advantage on Sorcerer spell attack rolls (2/Long Rest).",
      },
    ],
    description:
      "Unleash the raw magical spring welling inside you for overwhelming spell accuracy.",
    source: "Player's Handbook (2024), Sorcerer: Innate Sorcery",
  },
  sorcerousRestoration: {
    id: "embers:sorcerer:sorcerous-restoration",
    name: "Sorcerous Restoration",
    kind: "class_feature",
    status: "verified",
    classes: ["sorcerer"],
    activationType: "special",
    description: "When you finish a Short Rest, you can regain expended Sorcery Points equal to half your Sorcerer level (rounded down). Once you use this feature, you cannot do so again until you finish a Long Rest.",
    source: "Player's Handbook (2024), Sorcerer: Sorcerous Restoration",
    operations: [
      {
        type: "apply_effect",
        name: "Short Rest Sorcery Point Recovery",
        description: "Regain Sorcery Points equal to half Sorcerer level on a Short Rest (1/Long Rest).",
      },
    ],
  },
  sorceryIncarnate: {
    id: "embers:sorcerer:sorcery-incarnate",
    name: "Sorcery Incarnate",
    kind: "class_feature",
    status: "verified",
    classes: ["sorcerer"],
    activationType: "special",
    description: "While Innate Sorcery is active, you can use up to two Metamagic options on a spell. In addition, when you have no uses of Innate Sorcery remaining, you can spend 2 Sorcery Points to activate it.",
    source: "Player's Handbook (2024), Sorcerer: Sorcery Incarnate",
    operations: [
      {
        type: "apply_effect",
        name: "Dual Metamagic & Innate Recharge",
        description: "Can apply two Metamagic options to a single spell while Innate Sorcery is active. Can activate Innate Sorcery by spending 2 Sorcery Points.",
      },
    ],
  },
  arcaneApotheosis: {
    id: "embers:sorcerer:arcane-apotheosis",
    name: "Arcane Apotheosis",
    kind: "class_feature",
    status: "verified",
    classes: ["sorcerer"],
    activationType: "special",
    description: "Your mastery of sorcery reaches its divine peak. While your Innate Sorcery is active, you can use one Metamagic option on each of your turns without spending Sorcery Points.",
    source: "Player's Handbook (2024), Sorcerer: Arcane Apotheosis",
    operations: [
      {
        type: "apply_effect",
        name: "Free Metamagic Surge",
        description: "While Innate Sorcery is active, use one Metamagic option per turn at 0 Sorcery Point cost.",
      },
    ],
  },
  ...ABERRANT_SORCERY_FORMULAS,
  ...APOCALYPSE_SORCERY_FORMULAS,
  ...CLOCKWORK_SORCERY_FORMULAS,
  ...DRACONIC_SORCERY_FORMULAS,
  ...HAUNTED_SORCERY_FORMULAS,
  ...HEROIC_SORCERY_FORMULAS,
  ...SPELLFIRE_SORCERY_FORMULAS,
  ...WILD_MAGIC_SORCERY_FORMULAS,
  ...WRETCHED_BLOODLINE_SORCERY_FORMULAS,
};

export {
  FONT_CREATE_OPTIONS,
  METAMAGIC_OPTIONS,
  ABERRANT_SORCERY_FORMULAS,
  APOCALYPSE_SORCERY_FORMULAS,
  CLOCKWORK_SORCERY_FORMULAS,
  DRACONIC_SORCERY_FORMULAS,
  HAUNTED_SORCERY_FORMULAS,
  HEROIC_SORCERY_FORMULAS,
  SPELLFIRE_SORCERY_FORMULAS,
  WILD_MAGIC_SORCERY_FORMULAS,
  WRETCHED_BLOODLINE_SORCERY_FORMULAS,
  MYSTICAL_MANEUVER_OPTIONS,
};
