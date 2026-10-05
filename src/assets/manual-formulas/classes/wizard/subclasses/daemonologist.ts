import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const DAEMONOLOGIST_FORMULAS: Record<string, ManualActionFormula> = {
  fairAndFoul: {
    id: "embers:wizard:daemonologist:fair-and-foul",
    name: "Fair and Foul",
    kind: "class_feature",
    status: "verified",
    classes: ["wizard"],
    subclass: "daemonologist",
    activationType: "special",
    resource: {
      name: "Fair and Foul",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Fair and Foul",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Fair and Foul",
        description:
          "The spells listed below can be added to your spellbook for no cost when you reach the associated level.\n\nEach time you finish a Long Rest, choose whether you are siphoning power from Arch Daemons or Arch Seraphs. Consult the table below that corresponds to your choice; you can prepare the spells listed for your Wizard level and lower, but you can’t prepare the ones for the opposite faction. For example, if you choose Arch Daemon as your siphoned power, you can’t prepare the spells listed in t...",
      },
    ],
    description:
      "The spells listed below can be added to your spellbook for no cost when you reach the associated level.\n\nEach time you finish a Long Rest, choose whether you are siphoning power from Arch Daemons or Arch Seraphs. Consult the table below that corre...",
    source: "Grim Hollow: Player’s Guide, Wizard: Daemonologist",
  },

  stolenSecrets: {
    id: "embers:wizard:daemonologist:stolen-secrets",
    name: "Stolen Secrets",
    kind: "class_feature",
    status: "verified",
    classes: ["wizard"],
    subclass: "daemonologist",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Stolen Secrets",
        description:
          "You have uncovered or stolen secret power from agents of the Arch Daemons and Arch Seraphs. You gain one Eldritch Invocation of your choice.\n\nPrerequisites. If an invocation has a prerequisite, you must meet it to learn that invocation. If an invocation has a Warlock level prerequisite, you use your Wizard level instead. For example, if an invocation requires you to be a level 5+ Warlock, you can select the invocation once you reach Wizard level 5.\n\nReplacing and Gaining Invocations. Whenever...",
      },
    ],
    description:
      "You have uncovered or stolen secret power from agents of the Arch Daemons and Arch Seraphs. You gain one Eldritch Invocation of your choice.\n\nPrerequisites. If an invocation has a prerequisite, you must meet it to learn that invocation. If an invo...",
    source: "Grim Hollow: Player’s Guide, Wizard: Daemonologist",
  },

  borrowedTonguesAndHides: {
    id: "embers:wizard:daemonologist:borrowed-tongues-and-hides",
    name: "Borrowed Tongues and Hides",
    kind: "class_feature",
    status: "verified",
    classes: ["wizard"],
    subclass: "daemonologist",
    activationType: "bonus",
    resource: {
      name: "Borrowed Tongues and Hides",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Borrowed Tongues and Hides",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Borrowed Tongues and Hides",
        description:
          "Your ability to siphon power from Celestials and Fiends is enhanced. You gain the following benefits.\n\nArch Daemon Boon. While you are siphoning power from Arch Daemons, you have Resistance to Necrotic damage. In addition, Fiends that know languages can understand your speech and you can understand theirs, even if you do not share a language.\n\nArch Seraph Boon. While you are siphoning power from Arch Seraphs, you have Resistance to Radiant damage. In addition, Celestials that know languages c...",
      },
    ],
    description:
      "Your ability to siphon power from Celestials and Fiends is enhanced. You gain the following benefits.\n\nArch Daemon Boon. While you are siphoning power from Arch Daemons, you have Resistance to Necrotic damage. In addition, Fiends that know languag...",
    source: "Grim Hollow: Player’s Guide, Wizard: Daemonologist",
  },

  unearthlyCountenance: {
    id: "embers:wizard:daemonologist:unearthly-countenance",
    name: "Unearthly Countenance",
    kind: "class_feature",
    status: "verified",
    classes: ["wizard"],
    subclass: "daemonologist",
    activationType: "bonus",
    resource: {
      name: "Unearthly Countenance",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Unearthly Countenance",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Unearthly Countenance",
        description:
          "As a Bonus Action, you adopt an infernal or celestial countenance for 10 minutes. For the duration, your appearance gains aspects of the power you choose. You gain the following benefits.\n\nCommanding Presence. You have Advantage on Charisma checks.\n\nImproved Spells. When you expend a spell slot to cast a spell from the Arch Daemon or Arch Seraph table, the spell is cast as if you had spent a spell slot of one level higher.\n\nUnearthly Wings. You gain a Fly Speed of 60 feet.Once you use this fe...",
      },
    ],
    description:
      "As a Bonus Action, you adopt an infernal or celestial countenance for 10 minutes. For the duration, your appearance gains aspects of the power you choose. You gain the following benefits.\n\nCommanding Presence. You have Advantage on Charisma checks...",
    source: "Grim Hollow: Player’s Guide, Wizard: Daemonologist",
  },

  eternalWarEruption: {
    id: "embers:wizard:daemonologist:eternal-war-eruption",
    name: "Eternal War Eruption",
    kind: "class_feature",
    status: "verified",
    classes: ["wizard"],
    subclass: "daemonologist",
    activationType: "action",
    resource: {
      name: "Eternal War Eruption",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Eternal War Eruption",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Eternal War Eruption",
        description:
          "You use the powers at your command to call forth warring celestials and infernals. As a Magic action, you summon a manifestation of the war between Arch Daemons and Arch Seraphs in a 30-foot-radius Sphere centered on a point within 120 feet of yourself.\n\nEach creature in the Sphere must make a Charisma saving throw against your spell save DC. On a failed save, a creature takes 4d10 Necrotic damage, 4d10 Radiant damage, and has the Blinded condition until the end of its next turn. On a success...",
      },
    ],
    description:
      "You use the powers at your command to call forth warring celestials and infernals. As a Magic action, you summon a manifestation of the war between Arch Daemons and Arch Seraphs in a 30-foot-radius Sphere centered on a point within 120 feet of you...",
    source: "Grim Hollow: Player’s Guide, Wizard: Daemonologist",
  },
};
