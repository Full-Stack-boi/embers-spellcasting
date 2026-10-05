import type { ManualActionFormula } from "../../../../types/manualFormula";
import { ARCHFEY_PATRON_FORMULAS } from "./subclasses/archfeyPatron";
import { CELESTIAL_PATRON_FORMULAS } from "./subclasses/celestialPatron";
import { FIEND_PATRON_FORMULAS } from "./subclasses/fiendPatron";
import { GREAT_OLD_ONE_PATRON_FORMULAS } from "./subclasses/greatOldOnePatron";
import { THE_COVEN_FORMULAS } from "./subclasses/theCoven";
import { THE_FIRST_VAMPIRE_PATRON_FORMULAS } from "./subclasses/theFirstVampirePatron";
import { THE_PARASITE_PATRON_FORMULAS } from "./subclasses/theParasitePatron";
import { VESTIGE_PATRON_FORMULAS } from "./subclasses/vestigePatron";

export const WARLOCK_CLASS_FORMULAS: Record<string, ManualActionFormula> = {
  eldritchInvocations: {
    id: "embers:warlock:eldritch-invocations",
    name: "Eldritch Invocations",
    kind: "class_feature",
    status: "verified",
    classes: ["warlock"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Occult Invocations",
        description:
          "Custom esoteric augmentations: Agonizing Blast, Armor of Shadows, Eldritch Mind, Pact of the Blade, Pact of the Tome, Pact of the Chain, Repelling Blast.",
      },
    ],
    description:
      "Forbidden occult knowledge granting magical gifts and passive eldritch buffs.",
    source: "Player's Handbook (2024), Warlock: Eldritch Invocations",
  },
  magicalCunning: {
    id: "embers:warlock:magical-cunning",
    name: "Magical Cunning",
    kind: "class_feature",
    status: "verified",
    classes: ["warlock"],
    activationType: "special",
    resource: {
      name: "Magical Cunning",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "apply_effect",
        name: "Pact Slot Rite",
        description:
          "Conduct a 1-minute occult rite to regain half your expended Pact Magic spell slots (rounded up) once per Long Rest.",
      },
    ],
    description:
      "Commune rapidly with your patron to replenish expended pact slots.",
    source: "Player's Handbook (2024), Warlock: Magical Cunning",
  },
  ...ARCHFEY_PATRON_FORMULAS,
  ...CELESTIAL_PATRON_FORMULAS,
  ...FIEND_PATRON_FORMULAS,
  ...GREAT_OLD_ONE_PATRON_FORMULAS,
  ...THE_COVEN_FORMULAS,
  ...THE_FIRST_VAMPIRE_PATRON_FORMULAS,
  ...THE_PARASITE_PATRON_FORMULAS,
  ...VESTIGE_PATRON_FORMULAS,
};

export {
  ARCHFEY_PATRON_FORMULAS,
  CELESTIAL_PATRON_FORMULAS,
  FIEND_PATRON_FORMULAS,
  GREAT_OLD_ONE_PATRON_FORMULAS,
  THE_COVEN_FORMULAS,
  THE_FIRST_VAMPIRE_PATRON_FORMULAS,
  THE_PARASITE_PATRON_FORMULAS,
  VESTIGE_PATRON_FORMULAS,
};
