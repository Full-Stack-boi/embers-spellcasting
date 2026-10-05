import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const WRETCHED_BLOODLINE_SORCERY_FORMULAS: Record<
  string,
  ManualActionFormula
> = {
  badLuckCharm: {
    id: "embers:sorcerer:wretched-bloodline-sorcery:bad-luck-charm",
    name: "Bad Luck Charm",
    kind: "class_feature",
    status: "verified",
    classes: ["sorcerer"],
    subclass: "wretchedBloodlineSorcery",
    activationType: "bonus",
    resource: {
      name: "Bad Luck Charm",
      resetType: "Short or Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Bad Luck Charm",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Bad Luck Charm",
        description:
          "You have the ability to cast a sliver of your curse onto another temporarily. As a Bonus Action, choose a creature you can see within 30 feet of yourself. The chosen creature has Disadvantage on the next D20 Test it makes before the start of your next turn.\n\nOnce you use this feature, you can’t do so again until you finish a Short or Long Rest unless you spend 1 Sorcery Point (no action required) to restore your use of it.",
      },
    ],
    description:
      "You have the ability to cast a sliver of your curse onto another temporarily. As a Bonus Action, choose a creature you can see within 30 feet of yourself. The chosen creature has Disadvantage on the next D20 Test it makes before the start of your ...",
    source: "Grim Hollow: Player’s Guide, Sorcerer: Wretched Bloodline Sorcery",
  },

  bloodTies: {
    id: "embers:sorcerer:wretched-bloodline-sorcery:blood-ties",
    name: "Blood Ties",
    kind: "class_feature",
    status: "verified",
    classes: ["sorcerer"],
    subclass: "wretchedBloodlineSorcery",
    activationType: "special",
    resource: {
      name: "Blood Ties",
      resetType: "Short or Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Blood Ties",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Blood Ties",
        description:
          "Your senses easily attune to the supernatural forces that caused your inherited affliction. You always have the Detect Evil and Good spell prepared and can cast it without expending a spell slot.\n\nIn addition, choose one of the following types of creatures as the being that cursed your ancestor: Fey, Fiend, or Undead. On each of your turns while you maintain Concentration on Detect Evil and Good, including the turn when you cast it, creatures of the chosen type have Disadvantage on attack rol...",
      },
    ],
    description:
      "Your senses easily attune to the supernatural forces that caused your inherited affliction. You always have the Detect Evil and Good spell prepared and can cast it without expending a spell slot.\n\nIn addition, choose one of the following types of ...",
    source: "Grim Hollow: Player’s Guide, Sorcerer: Wretched Bloodline Sorcery",
  },

  wretchedCurse: {
    id: "embers:sorcerer:wretched-bloodline-sorcery:wretched-curse",
    name: "Wretched Curse",
    kind: "class_feature",
    status: "verified",
    classes: ["sorcerer"],
    subclass: "wretchedBloodlineSorcery",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Wretched Curse",
        description:
          "You suffer from a curse inherited from an ancestor who failed to uphold their end of a bargain with an otherworldly power. Choose one of the following curses that was passed down to you.\n\nHulking. Your ancestor was cursed with a hulking frame. You have Disadvantage on Dexterity (Stealth) checks to escape notice by moving quietly. In addition, your Hit Point maximum increases by 1, and it increases by 1 whenever you gain another Sorcerer level. Finally, you count as one size larger when determ...",
      },
    ],
    description:
      "You suffer from a curse inherited from an ancestor who failed to uphold their end of a bargain with an otherworldly power. Choose one of the following curses that was passed down to you.\n\nHulking. Your ancestor was cursed with a hulking frame. You...",
    source: "Grim Hollow: Player’s Guide, Sorcerer: Wretched Bloodline Sorcery",
  },

  shareTheBurden: {
    id: "embers:sorcerer:wretched-bloodline-sorcery:share-the-burden",
    name: "Share the Burden",
    kind: "class_feature",
    status: "verified",
    classes: ["sorcerer"],
    subclass: "wretchedBloodlineSorcery",
    activationType: "special",
    resource: {
      name: "Share the Burden",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Share the Burden",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Share the Burden",
        description:
          "You always have the Bestow Curse spell prepared. You can cast the spell by spending 3 Sorcery Points instead of a spell slot. When you cast the spell in this way, the spell doesn’t require Concentration, and its range changes to 60 feet for that casting.",
      },
    ],
    description:
      "You always have the Bestow Curse spell prepared. You can cast the spell by spending 3 Sorcery Points instead of a spell slot. When you cast the spell in this way, the spell doesn’t require Concentration, and its range changes to 60 feet for that c...",
    source: "Grim Hollow: Player’s Guide, Sorcerer: Wretched Bloodline Sorcery",
  },

  terrifyingVisage: {
    id: "embers:sorcerer:wretched-bloodline-sorcery:terrifying-visage",
    name: "Terrifying Visage",
    kind: "class_feature",
    status: "verified",
    classes: ["sorcerer"],
    subclass: "wretchedBloodlineSorcery",
    activationType: "bonus",
    resource: {
      name: "Terrifying Visage",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Terrifying Visage",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Terrifying Visage",
        description:
          "As a Bonus Action, you can adopt the terrifying visage of the being that cursed your ancestor for 10 minutes. During this time, you can take a Magic action to cause creatures of your choice you can see you within 30 feet of yourself to make a Wisdom saving throw. On a failed save, the target has the Frightened condition until the end of your next turn. In addition, while your Terrifying Visage feature is active, you gain the following benefit based on the creature type chosen with your Blood ...",
      },
    ],
    description:
      "As a Bonus Action, you can adopt the terrifying visage of the being that cursed your ancestor for 10 minutes. During this time, you can take a Magic action to cause creatures of your choice you can see you within 30 feet of yourself to make a Wisd...",
    source: "Grim Hollow: Player’s Guide, Sorcerer: Wretched Bloodline Sorcery",
  },

  vengefulSummons: {
    id: "embers:sorcerer:wretched-bloodline-sorcery:vengeful-summons",
    name: "Vengeful Summons",
    kind: "class_feature",
    status: "verified",
    classes: ["sorcerer"],
    subclass: "wretchedBloodlineSorcery",
    activationType: "action",
    resource: {
      name: "Vengeful Summons",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Vengeful Summons",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Vengeful Summons",
        description:
          "Your magic has become powerful enough that you can call and command a servant of those who cursed you. Choose one of the following creatures based on the choice you made with your Blood Ties feature: Lamia or Troll (Fey only), Barbed Devil, Incubus, or Succubus (Fiend only), Ghost or Wraith (Undead only).\n\nYou can take a Magic action and spend 5 Sorcery Points to summon your chosen creature. The creature appears in an unoccupied space you can see within 60 feet. It disappears when it drops to...",
      },
    ],
    description:
      "Your magic has become powerful enough that you can call and command a servant of those who cursed you. Choose one of the following creatures based on the choice you made with your Blood Ties feature: Lamia or Troll (Fey only), Barbed Devil, Incubu...",
    source: "Grim Hollow: Player’s Guide, Sorcerer: Wretched Bloodline Sorcery",
  },
};
