import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const VESTIGE_PATRON_FORMULAS: Record<string, ManualActionFormula> = {
  vestigeCompanion: {
    id: "embers:warlock:vestige-patron:vestige-companion",
    name: "Vestige Companion",
    kind: "class_feature",
    status: "verified",
    classes: ["warlock"],
    subclass: "vestigePatron",
    activationType: "bonus",
    resource: {
      name: "Vestige Companion",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Vestige Companion",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Vestige Companion",
        description:
          "The vestige manifests, drawing strength from your pact. It uses the Vestige Companion stat block and is a Celestial, Fiend, or Undead (choose when you gain this feature). You determine what the vestige looks like, but regardless of its form, the vestige bears features indicating its supernatural origin. For example, you might decide your vestige is an oversize floating skull etched with sigils, a circle of glowing runes, or a constantly shifting abstract shape. The vestige is Friendly to you ...",
      },
    ],
    description:
      "The vestige manifests, drawing strength from your pact. It uses the Vestige Companion stat block and is a Celestial, Fiend, or Undead (choose when you gain this feature). You determine what the vestige looks like, but regardless of its form, the v...",
    source: "Arcana Unleashed, Warlock: Vestige Patron",
  },

  vestigeSpells: {
    id: "embers:warlock:vestige-patron:vestige-spells",
    name: "Vestige Spells",
    kind: "class_feature",
    status: "verified",
    classes: ["warlock"],
    subclass: "vestigePatron",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Vestige Spells",
        description:
          "The magic of your Vestige Companion ensures you always have certain spells ready. Select one of the following Cleric domains: Life, Light, Trickery, or War. The Domain Spells of your chosen domain are Warlock spells for you. When you reach a Warlock level equal to a Cleric level listed on the Domain Spells table for the domain you have chosen, you thereafter always have the listed spells prepared.\n\nFor example, if you chose the War Domain for this feature, when you reach Warlock level 3, you ...",
      },
    ],
    description:
      "The magic of your Vestige Companion ensures you always have certain spells ready. Select one of the following Cleric domains: Life, Light, Trickery, or War. The Domain Spells of your chosen domain are Warlock spells for you. When you reach a Warlo...",
    source: "Arcana Unleashed, Warlock: Vestige Patron",
  },

  vestigePower: {
    id: "embers:warlock:vestige-patron:vestige-power",
    name: "Vestige Power",
    kind: "class_feature",
    status: "verified",
    classes: ["warlock"],
    subclass: "vestigePatron",
    activationType: "special",
    resource: {
      name: "Vestige Power",
      resetType: "Short or Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Vestige Power",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Vestige Power",
        description:
          "Your Vestige Companion now regains its use of Divine Power whenever you finish a Short or Long Rest or when you use your Magical Cunning feature. In addition, while within 30 feet of your Vestige Companion, you have Resistance to the same damage types as the vestige.",
      },
    ],
    description:
      "Your Vestige Companion now regains its use of Divine Power whenever you finish a Short or Long Rest or when you use your Magical Cunning feature. In addition, while within 30 feet of your Vestige Companion, you have Resistance to the same damage t...",
    source: "Arcana Unleashed, Warlock: Vestige Patron",
  },

  vestigeRecovery: {
    id: "embers:warlock:vestige-patron:vestige-recovery",
    name: "Vestige Recovery",
    kind: "class_feature",
    status: "verified",
    classes: ["warlock"],
    subclass: "vestigePatron",
    activationType: "reaction",
    resource: {
      name: "Vestige Recovery",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Vestige Recovery",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Vestige Recovery",
        description:
          "When your Vestige Companion would drop to 0 Hit Points, you can take a Reaction and expend a Pact Magic spell slot to instead change its Hit Points to its Hit Point maximum. The vestige then teleports to an unoccupied space you can see within 30 feet of it. Once you use this feature, you can’t do so again until you finish a Long Rest.",
      },
    ],
    description:
      "When your Vestige Companion would drop to 0 Hit Points, you can take a Reaction and expend a Pact Magic spell slot to instead change its Hit Points to its Hit Point maximum. The vestige then teleports to an unoccupied space you can see within 30 f...",
    source: "Arcana Unleashed, Warlock: Vestige Patron",
  },

  semblanceOfLife: {
    id: "embers:warlock:vestige-patron:semblance-of-life",
    name: "Semblance of Life",
    kind: "class_feature",
    status: "verified",
    classes: ["warlock"],
    subclass: "vestigePatron",
    activationType: "bonus",
    resource: {
      name: "Semblance of Life",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Semblance of Life",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Semblance of Life",
        description:
          "Your Vestige Companion continues to grow in strength, and with your assistance, it can briefly adopt a more powerful form. Depending on the vestige’s type, you can take a Magic action while the vestige is within 90 feet of you to shape-shift it for 1 hour into one of the following forms: Celestial Spirit (Celestial vestige; see the Summon Celestial spell in the Player’s Handbook), Fiendish Spirit (Fiend vestige; see the Summon Fiend spell in the Player’s Handbook), or Undead Spirit (Undead ve...",
      },
    ],
    description:
      "Your Vestige Companion continues to grow in strength, and with your assistance, it can briefly adopt a more powerful form. Depending on the vestige’s type, you can take a Magic action while the vestige is within 90 feet of you to shape-shift it fo...",
    source: "Arcana Unleashed, Warlock: Vestige Patron",
  },
};
