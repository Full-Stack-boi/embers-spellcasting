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
    description: "Forbidden occult knowledge granting magical gifts, pact weapons, and passive buffs.",
    source: "Player's Handbook (2024), Warlock: Eldritch Invocations",
    operations: [],
    options: [
      {
        id: "pact_blade",
        name: "Pact of the Blade",
        description: "Bonus Action conjure or bond with a pact weapon. You can use your Charisma modifier for attack and damage rolls, and choose Necrotic, Psychic, or Radiant damage.",
      },
      {
        id: "pact_tome",
        name: "Pact of the Tome",
        description: "Conjure a Book of Shadows granting three extra cantrips and two level 1 ritual spells from any class list.",
      },
      {
        id: "pact_chain",
        name: "Pact of the Chain",
        description: "Cast Find Familiar with enhanced forms (Imp, Quasit, Pseudodragon, Sphinx of Wonder, Skeleton). You can command the familiar to attack as one of your attacks.",
      },
      {
        id: "agonizing_blast",
        name: "Agonizing Blast",
        description: "Add your Charisma modifier to the damage of Eldritch Blast (or chosen damage cantrip).",
      },
      {
        id: "thirsting_blade",
        name: "Thirsting Blade",
        description: "You can attack twice with your pact weapon when you take the Attack action on your turn.",
      },
      {
        id: "devouring_blade",
        name: "Devouring Blade",
        description: "You can attack three times with your pact weapon when you take the Attack action on your turn (Level 12+).",
      },
      {
        id: "lifedrinker",
        name: "Lifedrinker",
        description: "Once per turn when you hit with your pact weapon, deal extra 1d6 Necrotic, Psychic, or Radiant damage, and regain HP equal to the damage dealt.",
        weaponDamageRider: {
          damageFormula: "1d6",
          damageType: "necrotic",
          condition: "Once per turn with pact weapon",
        },
      },
      {
        id: "repelling_blast",
        name: "Repelling Blast",
        description: "When you hit a creature with Eldritch Blast, push the creature up to 10 feet straight away from you.",
      },
      {
        id: "armor_of_shadows",
        name: "Armor of Shadows",
        description: "Cast Mage Armor on yourself at will without expending a spell slot.",
      },
      {
        id: "fiendish_vigor",
        name: "Fiendish Vigor",
        description: "Cast False Life on yourself at will as a level 1 spell without expending a spell slot, maximizing the temporary HP (12 Temp HP).",
      },
    ],
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
  mysticArcanum: {
    id: "embers:warlock:mystic-arcanum",
    name: "Mystic Arcanum",
    kind: "class_feature",
    status: "verified",
    classes: ["warlock"],
    activationType: "special",
    description: "Your patron bestows secret arcanum spells of 6th, 7th, 8th, and 9th level that can each be cast once per Long Rest without expending a spell slot.",
    source: "Player's Handbook (2024), Warlock: Mystic Arcanum",
    operations: [],
    options: [
      {
        id: "arcanum_6",
        name: "6th-Level Arcanum",
        description: "Cast your chosen 6th-level arcanum spell once without expending a spell slot (recharges on Long Rest).",
      },
      {
        id: "arcanum_7",
        name: "7th-Level Arcanum",
        description: "Cast your chosen 7th-level arcanum spell once without expending a spell slot (recharges on Long Rest).",
      },
      {
        id: "arcanum_8",
        name: "8th-Level Arcanum",
        description: "Cast your chosen 8th-level arcanum spell once without expending a spell slot (recharges on Long Rest).",
      },
      {
        id: "arcanum_9",
        name: "9th-Level Arcanum",
        description: "Cast your chosen 9th-level arcanum spell once without expending a spell slot (recharges on Long Rest).",
      },
    ],
  },
  eldritchMaster: {
    id: "embers:warlock:eldritch-master",
    name: "Eldritch Master",
    kind: "class_feature",
    status: "verified",
    classes: ["warlock"],
    activationType: "special",
    resource: {
      name: "Eldritch Master",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "apply_effect",
        name: "Full Pact Recharge",
        description: "Spend 1 minute entreating your patron to regain all expended Pact Magic spell slots (1/Long Rest).",
      },
    ],
    description: "Draw directly upon your patron's inner reserve to replenish all your pact magic in moments.",
    source: "Player's Handbook (2024), Warlock: Eldritch Master",
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
