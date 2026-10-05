import type { ManualActionFormula } from "../../../../types/manualFormula";
import {
  FONT_CREATE_OPTIONS,
  METAMAGIC_OPTIONS,
} from "../../mechanics/classMechanicRegistry";
import { ABERRANT_SORCERY_FORMULAS } from "./subclasses/aberrantSorcery";
import { APOCALYPSE_SORCERY_FORMULAS } from "./subclasses/apocalypseSorcery";
import { CLOCKWORK_SORCERY_FORMULAS } from "./subclasses/clockworkSorcery";
import { DRACONIC_SORCERY_FORMULAS } from "./subclasses/draconicSorcery";
import { HAUNTED_SORCERY_FORMULAS } from "./subclasses/hauntedSorcery";
import { HEROIC_SORCERY_FORMULAS } from "./subclasses/heroicSorcery";
import { SPELLFIRE_SORCERY_FORMULAS } from "./subclasses/spellfireSorcery";
import { WILD_MAGIC_SORCERY_FORMULAS } from "./subclasses/wildMagicSorcery";
import { WRETCHED_BLOODLINE_SORCERY_FORMULAS } from "./subclasses/wretchedBloodlineSorcery";
import { MYSTICAL_MANEUVER_OPTIONS } from "./subclasses/heroicSorcery";

export const SORCERER_CLASS_FORMULAS: Record<string, ManualActionFormula> = {
  fontOfMagic: {
    id: "embers:font-of-magic",
    name: "Font of Magic",
    kind: "class_feature",
    status: "verified",
    classes: ["sorcerer"],
    activationType: "special",
    resource: {
      name: "Sorcery Points",
      maxPerClassLevel: 1,
      canExceedMax: false,
      resetType: "Long Rest",
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
