import type { ManualActionFormula } from "../../../types/manualFormula";

export const GRIM_HOLLOW_FEAT_FORMULAS: Record<string, ManualActionFormula> = {
  sangromantic_initiate: {
    id: "feat:sangromantic-initiate",
    name: "Sangromantic Initiate: Blood Reserve",
    kind: "feat",
    status: "verified",
    classes: [],
    activationType: "special",
    resource: {
      name: "Sangromancy Dice",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Sangromancy Dice",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Expend Sangromancy Die",
        description:
          "Expend one of your 2d12 Sangromancy dice instead of expending a Hit Point Die when casting a Sangromancy spell.",
      },
    ],
    description:
      "You have a pool of two d12 Sangromancy dice. When you cast a Sangromancy spell that requires you to expend Hit Point Dice, you can expend one or both of these dice instead of your own Hit Point Dice. You regain these expended dice when you finish a Long Rest. In addition, you learn one 1st-level Sangromancy spell and can cast it once per Long Rest without expending a spell slot.",
    source: "Grim Hollow: Player’s Guide, pg. 42",
    notes:
      "Provides 2d12 pool per Long Rest for Sangromancy casting. Grants 1 free 1st-level Sangromancy spell cast per Long Rest.",
  },

  fortune_of_the_thaumaturge: {
    id: "feat:fortune-of-the-thaumaturge",
    name: "Fortune of the Thaumaturge",
    kind: "feat",
    status: "verified",
    classes: [],
    activationType: "special",
    resource: {
      name: "Fortune Dice Uses",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Fortune Dice Uses",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Add Hit Die to d20",
        description:
          "Expend and roll 1 Hit Point Die, adding the result to your failed d20 Test. If you roll the minimum or maximum on the die, you do not expend the Hit Point Die.",
      },
    ],
    description:
      "When you fail a d20 Test, you can expend one Hit Point Die, roll it, and add the result to the total, potentially turning a failure into a success. If you roll the minimum or maximum number on the die, you regain the expended Hit Point Die. You can use this ability a number of times equal to your Proficiency Bonus per Long Rest.",
    source: "Grim Hollow: Player’s Guide, pg. 39",
    notes:
      "Usable PB times per Long Rest. On min/max roll, the Hit Die is not consumed.",
  },

  lightning_caster: {
    id: "feat:lightning-caster",
    name: "Lightning Caster",
    kind: "feat",
    status: "verified",
    classes: [],
    activationType: "bonus",
    operations: [
      {
        type: "apply_effect",
        name: "Fork Cantrip",
        description:
          "As a Bonus Action after casting a single-target cantrip with an Action, repeat the cantrip targeting a second creature within range.",
      },
    ],
    description:
      "When you cast a cantrip with a casting time of 1 Action that targets only one creature, you can use a Bonus Action to target a second creature within range with the same cantrip. In addition, once per Long Rest when you cast a spell as a Reaction, you can do so without expending a spell slot.",
    source: "Grim Hollow: Player’s Guide, pg. 41",
    notes:
      "Bonus Action duplicate single-target cantrip. Reaction cast with no spell slot 1/Long Rest.",
  },

  witch_hunter: {
    id: "feat:witch-hunter",
    name: "Witch Hunter: Counter Magic",
    kind: "feat",
    status: "verified",
    classes: [],
    activationType: "reaction",
    operations: [
      {
        type: "saving_throw",
        ability: "WIS",
        dc: "spell_save",
        failure: "The spell proceeds normally.",
        success: "The spell dissipates with no effect on you.",
      },
    ],
    description:
      "When you are targeted by a spell that affects only you, you can use your Reaction to make a Wisdom saving throw against the caster's spell save DC. On a success, the spell fails and has no effect on you. In addition, when you hit a creature with a melee weapon attack, its Speed is reduced by 15 feet until the end of its next turn.",
    source: "Grim Hollow: Player’s Guide, pg. 43",
    notes:
      "Reaction WIS save vs spell DC to nullify single-target spell. Melee hit reduces target speed by 15 ft.",
  },

  thrown_weapon_master: {
    id: "feat:thrown-weapon-master",
    name: "Thrown Weapon Master: Rapid Volley",
    kind: "feat",
    status: "verified",
    classes: [],
    activationType: "bonus",
    operations: [
      {
        type: "attack",
        attackType: "ranged",
        range: "20/60 ft.",
        onHit:
          "Weapons with the Thrown property automatically return to your hand immediately after the attack.",
      },
    ],
    description:
      "You can draw or stow weapons with the Thrown property as part of each attack. As a Bonus Action, you can make two ranged attacks with simple weapons that have the Thrown property, or retrieve all thrown weapons within 5 feet. Any simple or martial weapon with the Thrown property that you throw gains the Returning property.",
    source: "Grim Hollow: Player’s Guide, pg. 43",
    notes:
      "Bonus Action two thrown simple attacks or retrieve all within 5 ft. All thrown weapons return to hand.",
  },

  triage_expert: {
    id: "feat:triage-expert",
    name: "Triage Expert",
    kind: "feat",
    status: "verified",
    classes: [],
    activationType: "action",
    operations: [
      {
        type: "apply_effect",
        name: "Combat Medicine",
        description:
          "Utilize a Healer's Kit on a creature within 5 feet. The creature expends one Hit Point Die, rolls it plus your Wisdom or Intelligence modifier, and regains that many Hit Points.",
      },
    ],
    description:
      "As an Action, you can use one charge of a Healer's Kit to tend to a creature within 5 feet. The creature can expend one Hit Point Die to regain Hit Points equal to the roll + your Intelligence or Wisdom modifier. Whenever you roll dice to restore Hit Points, roll one additional die and discard the lowest roll.",
    source: "Grim Hollow: Player’s Guide, pg. 40",
    notes:
      "Uses Healer's Kit to heal via Hit Die. Discard lowest die on all healing rolls.",
  },
};
