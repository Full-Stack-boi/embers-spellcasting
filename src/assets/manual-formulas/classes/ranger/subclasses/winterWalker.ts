import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const WINTER_WALKER_FORMULAS: Record<string, ManualActionFormula> = {
  frigidExplorer: {
    id: "embers:ranger:winter-walker:frigid-explorer",
    name: "Frigid Explorer",
    kind: "class_feature",
    status: "verified",
    classes: ["ranger"],
    subclass: "winterWalker",
    activationType: "special",
    resource: {
      name: "Frigid Explorer",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Frigid Explorer",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Frigid Explorer",
        description:
          "You gain the following benefits.\n\nBiting Cold. Damage from your weapon attacks, Ranger spells, and Ranger features ignores Resistance to Cold damage.\n\nFrost Resistance. You have Resistance to Cold damage.\n\nPolar Strikes. When you hit a creature with an attack roll using a weapon, you can deal an extra 1d4 Cold damage to the target, which can take this extra damage only once per turn. When you reach Ranger level 11, this extra damage increases to 1d6.",
      },
    ],
    description:
      "You gain the following benefits.\n\nBiting Cold. Damage from your weapon attacks, Ranger spells, and Ranger features ignores Resistance to Cold damage.\n\nFrost Resistance. You have Resistance to Cold damage.\n\nPolar Strikes. When you hit a creature wi...",
    source: "Forgotten Realms: Heroes of Faerûn, Ranger: Winter Walker",
  },

  hunterSRime: {
    id: "embers:ranger:winter-walker:hunter-s-rime",
    name: "Hunter’s Rime",
    kind: "class_feature",
    status: "verified",
    classes: ["ranger"],
    subclass: "winterWalker",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Hunter’s Rime",
        description:
          "Ice rimes you and your prey, protecting you and hindering them. When you cast Hunter’s Mark, you gain Temporary Hit Points equal to 1d10 plus your Ranger level.\n\nAdditionally, while a creature is marked by your Hunter’s Mark, it can’t take the Disengage action.",
      },
    ],
    description:
      "Ice rimes you and your prey, protecting you and hindering them. When you cast Hunter’s Mark, you gain Temporary Hit Points equal to 1d10 plus your Ranger level.\n\nAdditionally, while a creature is marked by your Hunter’s Mark, it can’t take the Dis...",
    source: "Forgotten Realms: Heroes of Faerûn, Ranger: Winter Walker",
  },

  winterWalkerSpells: {
    id: "embers:ranger:winter-walker:winter-walker-spells",
    name: "Winter Walker Spells",
    kind: "class_feature",
    status: "verified",
    classes: ["ranger"],
    subclass: "winterWalker",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Winter Walker Spells",
        description:
          "When you reach a Ranger level specified in the Winter Walker Spells table, you thereafter always have the listed spells prepared.\n\nWinter Walker Spells\nRanger Level\tSpell\n3\tIce Knife\n5\tHold Person\n9\tRemove Curse\n13\tIce Storm\n17\tCone of Cold",
      },
    ],
    description:
      "When you reach a Ranger level specified in the Winter Walker Spells table, you thereafter always have the listed spells prepared.\n\nWinter Walker Spells\nRanger Level\tSpell\n3\tIce Knife\n5\tHold Person\n9\tRemove Curse\n13\tIce Storm\n17\tCone of Cold",
    source: "Forgotten Realms: Heroes of Faerûn, Ranger: Winter Walker",
  },

  fortifyingSoul: {
    id: "embers:ranger:winter-walker:fortifying-soul",
    name: "Fortifying Soul",
    kind: "class_feature",
    status: "verified",
    classes: ["ranger"],
    subclass: "winterWalker",
    activationType: "action",
    resource: {
      name: "Fortifying Soul",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Fortifying Soul",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Fortifying Soul",
        description:
          "Your experience surviving harrowing environments allows you to bolster your allies in addition to yourself. As a Magic action, choose a number of creatures you can see equal to your Wisdom modifier (minimum of one). Each chosen creature regains Hit Points equal to 1d10 plus your Ranger level and has Advantage on saving throws to avoid or end the Frightened condition for 1 hour.\n\nOnce you use this feature, you can’t use it again until you finish a Long Rest.",
      },
    ],
    description:
      "Your experience surviving harrowing environments allows you to bolster your allies in addition to yourself. As a Magic action, choose a number of creatures you can see equal to your Wisdom modifier (minimum of one). Each chosen creature regains Hi...",
    source: "Forgotten Realms: Heroes of Faerûn, Ranger: Winter Walker",
  },

  chillingRetribution: {
    id: "embers:ranger:winter-walker:chilling-retribution",
    name: "Chilling Retribution",
    kind: "class_feature",
    status: "verified",
    classes: ["ranger"],
    subclass: "winterWalker",
    activationType: "reaction",
    resource: {
      name: "Chilling Retribution",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Chilling Retribution",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Chilling Retribution",
        description:
          "When a creature hits you with an attack roll, you can take a Reaction to force the creature to make a Wisdom saving throw against your spell save DC. On a failed save, the target has the Stunned condition until the end of your next turn. While the target is Stunned, its Speed is reduced to 0 feet.\n\nYou can use this feature a number of times equal to your Wisdom modifier (minimum of once), and you regain all expended uses when you finish a Long Rest.",
      },
    ],
    description:
      "When a creature hits you with an attack roll, you can take a Reaction to force the creature to make a Wisdom saving throw against your spell save DC. On a failed save, the target has the Stunned condition until the end of your next turn. While the...",
    source: "Forgotten Realms: Heroes of Faerûn, Ranger: Winter Walker",
  },

  frozenHaunt: {
    id: "embers:ranger:winter-walker:frozen-haunt",
    name: "Frozen Haunt",
    kind: "class_feature",
    status: "verified",
    classes: ["ranger"],
    subclass: "winterWalker",
    activationType: "special",
    resource: {
      name: "Frozen Haunt",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Frozen Haunt",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Frozen Haunt",
        description:
          "When you cast Hunter’s Mark, you can adopt a ghostly, snowy form. This form lasts until the spell ends, and while you are in this form, you gain the following benefits. Once you use this feature, you can’t use it again until you finish a Long Rest unless you expend a level 4+ spell slot (no action required).\n\nFrozen Soul. You have Immunity to Cold damage. When you first adopt this form and at the start of each of your subsequent turns, each creature of your choice in a 15-foot Emanation origi...",
      },
    ],
    description:
      "When you cast Hunter’s Mark, you can adopt a ghostly, snowy form. This form lasts until the spell ends, and while you are in this form, you gain the following benefits. Once you use this feature, you can’t use it again until you finish a Long Rest...",
    source: "Forgotten Realms: Heroes of Faerûn, Ranger: Winter Walker",
  },
};
