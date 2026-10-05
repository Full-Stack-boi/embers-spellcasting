import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const NECROMANCER_FORMULAS: Record<string, ManualActionFormula> = {
  necromancySavant: {
    id: "embers:wizard:necromancer:necromancy-savant",
    name: "Necromancy Savant",
    kind: "class_feature",
    status: "verified",
    classes: ["wizard"],
    subclass: "necromancer",
    activationType: "special",
    resource: {
      name: "Necromancy Savant",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Necromancy Savant",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Necromancy Savant",
        description:
          "Choose two Wizard spells from the Necromancy school, each of which must be no higher than level 2, and add them to your spellbook for free.\n\nIn addition, whenever you gain access to a new level of spell slots in this class, you can add one Wizard spell from the Necromancy school to your spellbook for free. The chosen spell must be of a level for which you have spell slots.",
      },
    ],
    description:
      "Choose two Wizard spells from the Necromancy school, each of which must be no higher than level 2, and add them to your spellbook for free.\n\nIn addition, whenever you gain access to a new level of spell slots in this class, you can add one Wizard ...",
    source: "Arcana Unleashed, Wizard: Necromancer",
  },

  necromancySpellbook: {
    id: "embers:wizard:necromancer:necromancy-spellbook",
    name: "Necromancy Spellbook",
    kind: "class_feature",
    status: "verified",
    classes: ["wizard"],
    subclass: "necromancer",
    activationType: "reaction",
    resource: {
      name: "Necromancy Spellbook",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Necromancy Spellbook",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Necromancy Spellbook",
        description:
          "Your spellbook’s necromantic secrets grant you additional powers. You gain the following benefits.\n\nNecrotic Resistance. You have Resistance to Necrotic damage.\n\nUndead Familiar. The Find Familiar spell appears in your spellbook. When you cast the spell, you choose one of the normal forms for your familiar or one of the following special forms: Skeleton or Zombie (see appendix B of the Player’s Handbook for the familiar’s stat block). When you choose one of the normal forms, you can choose Un...",
      },
    ],
    description:
      "Your spellbook’s necromantic secrets grant you additional powers. You gain the following benefits.\n\nNecrotic Resistance. You have Resistance to Necrotic damage.\n\nUndead Familiar. The Find Familiar spell appears in your spellbook. When you cast the...",
    source: "Arcana Unleashed, Wizard: Necromancer",
  },

  gravePower: {
    id: "embers:wizard:necromancer:grave-power",
    name: "Grave Power",
    kind: "class_feature",
    status: "verified",
    classes: ["wizard"],
    subclass: "necromancer",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Grave Power",
        description:
          "You have discovered more necromantic insights and inscribed them in your spellbook. While holding your spellbook, you gain the following benefits.\n\nGrave Resilience. When you use Arcane Recovery, your Exhaustion level, if any, decreases by 1.\n\nOverwhelming Necrosis. Damage from your Wizard spells and Wizard features ignores Resistance to Necrotic damage.\n\nLife and death are interchangeable states of being to the most powerful mages.",
      },
    ],
    description:
      "You have discovered more necromantic insights and inscribed them in your spellbook. While holding your spellbook, you gain the following benefits.\n\nGrave Resilience. When you use Arcane Recovery, your Exhaustion level, if any, decreases by 1.\n\nOve...",
    source: "Arcana Unleashed, Wizard: Necromancer",
  },

  undeadThralls: {
    id: "embers:wizard:necromancer:undead-thralls",
    name: "Undead Thralls",
    kind: "class_feature",
    status: "verified",
    classes: ["wizard"],
    subclass: "necromancer",
    activationType: "special",
    resource: {
      name: "Undead Thralls",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Undead Thralls",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Undead Thralls",
        description:
          "You always have Animate Dead prepared and can cast it without expending a spell slot, but you must finish a Long Rest before you can cast it in this way again. Whenever you start casting the spell, you can increase the spell’s effective level by 1.\n\nIn addition, while holding your spellbook, you gain the following benefits.\n\nUndead Fortitude. Whenever you cast a Necromancy spell that creates or summons an Undead, the Undead’s Hit Point maximum and current Hit Points increase by a number equal...",
      },
    ],
    description:
      "You always have Animate Dead prepared and can cast it without expending a spell slot, but you must finish a Long Rest before you can cast it in this way again. Whenever you start casting the spell, you can increase the spell’s effective level by 1...",
    source: "Arcana Unleashed, Wizard: Necromancer",
  },

  harvestUndead: {
    id: "embers:wizard:necromancer:harvest-undead",
    name: "Harvest Undead",
    kind: "class_feature",
    status: "verified",
    classes: ["wizard"],
    subclass: "necromancer",
    activationType: "reaction",
    operations: [
      {
        type: "apply_effect",
        name: "Harvest Undead",
        description:
          "You have learned more secrets about the nuances of life and death. Immediately after you become Bloodied but aren’t reduced to 0 Hit Points from taking damage, you can take a Reaction to reduce an Undead creature under your control that you can see to 0 Hit Points. You then immediately regain a number of Hit Points equal to your Wizard level.",
      },
    ],
    description:
      "You have learned more secrets about the nuances of life and death. Immediately after you become Bloodied but aren’t reduced to 0 Hit Points from taking damage, you can take a Reaction to reduce an Undead creature under your control that you can se...",
    source: "Arcana Unleashed, Wizard: Necromancer",
  },

  deathSMaster: {
    id: "embers:wizard:necromancer:death-s-master",
    name: "Death’s Master",
    kind: "class_feature",
    status: "verified",
    classes: ["wizard"],
    subclass: "necromancer",
    activationType: "bonus",
    resource: {
      name: "Death’s Master",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Death’s Master",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Death’s Master",
        description:
          "Abstruse rituals within your spellbook allow you mastery over undeath. While holding your spellbook, you gain the following benefits.\n\nBolster Undead. As a Bonus Action, choose any number of Undead you have created or summoned with a Necromancy spell that are within 60 feet of you. Those Undead each gain Temporary Hit Points equal to your Wizard level. Once you use this Bonus Action, you can’t do so again until you finish a Long Rest.\n\nExtinguish Undead. When an Undead creature you can see is...",
      },
    ],
    description:
      "Abstruse rituals within your spellbook allow you mastery over undeath. While holding your spellbook, you gain the following benefits.\n\nBolster Undead. As a Bonus Action, choose any number of Undead you have created or summoned with a Necromancy sp...",
    source: "Arcana Unleashed, Wizard: Necromancer",
  },
};
