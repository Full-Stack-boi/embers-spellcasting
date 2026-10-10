import type {
  ManualActionFormula,
  FeatureActionOption,
} from "../../../../types/manualFormula";
import { ALCHEMIST_FORMULAS } from "./subclasses/alchemist";
import { ARMORER_FORMULAS, ARMOR_MODEL_OPTIONS } from "./subclasses/armorer";
import { ARTILLERIST_FORMULAS } from "./subclasses/artillerist";
import { BATTLE_SMITH_FORMULAS } from "./subclasses/battleSmith";
import { CARTOGRAPHER_FORMULAS } from "./subclasses/cartographer";

export const INFUSION_OPTIONS: FeatureActionOption[] = [
  {
    id: "enhanced_defense",
    name: "Enhanced Defense",
    cost: 1,
    desc: "+1 AC bonus (+2 at 10th level) to a suit of armor or a shield",
    actionType: "none",
  },
  {
    id: "enhanced_weapon",
    name: "Enhanced Weapon",
    cost: 1,
    desc: "+1 bonus (+2 at 10th level) to attack and damage rolls made with the weapon",
    actionType: "none",
  },
  {
    id: "mind_sharpener",
    name: "Mind Sharpener",
    cost: 1,
    desc: "Reaction: Spend 1 of 4 charges to succeed on a failed Constitution save to maintain concentration",
    actionType: "reaction",
  },
  {
    id: "repeating_shot",
    name: "Repeating Shot",
    cost: 1,
    desc: "+1 attack and damage bonus with ranged weapon, ignores loading property, produces magical ammo",
    actionType: "none",
  },
  {
    id: "radiant_weapon",
    name: "Radiant Weapon",
    cost: 1,
    desc: "+1 attack and damage bonus, shed bright light, Reaction to blind an attacker who hits you (CON save)",
    actionType: "reaction",
  },
  {
    id: "replicate_magic_item",
    name: "Replicate Magic Item",
    cost: 1,
    desc: "Infuse a mundane item to replicate a common or uncommon magical item (e.g. Bag of Holding, Goggles of Night)",
    actionType: "none",
  },
];

export const ARTIFICER_CLASS_FORMULAS: Record<string, ManualActionFormula> = {
  tinkersMagic: {
    id: "embers:artificer:tinkers-magic",
    name: "Tinker's Magic",
    kind: "class_feature",
    status: "verified",
    classes: ["artificer"],
    activationType: "action",
    resource: {
      name: "Tinker's Magic Uses",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Tinker's Magic Uses",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Magical Fabrication",
        description:
          "Cast Mending at will, or channel magic through tinker's tools to create temporary mundane gear and tools (Intelligence modifier uses per Long Rest).",
      },
    ],
    description:
      "You possess an inventive knack for imbuing mundane objects with spark of magic.",
    source: "Eberron: Forge of the Artificer, Artificer: Tinker's Magic",
  },

  magicalTinkering: {
    id: "embers:artificer:magical-tinkering",
    name: "Magical Tinkering",
    kind: "class_feature",
    status: "verified",
    classes: ["artificer"],
    activationType: "action",
    operations: [
      {
        type: "apply_effect",
        name: "Mundane Spark",
        description:
          "Touch a Tiny nonmagical object to imbue it with a magical property (shed light, emit recorded message, odor, or visual effect). You can affect up to your Intelligence modifier objects simultaneously.",
      },
    ],
    description: "Invest a spark of spontaneous magic into mundane objects.",
    source: "Eberron: Forge of the Artificer, Artificer: Magical Tinkering",
  },

  infuseItem: {
    id: "embers:artificer:infuse-item",
    name: "Infuse Item",
    kind: "class_feature",
    status: "verified",
    classes: ["artificer"],
    activationType: "special",
    options: INFUSION_OPTIONS,
    resource: {
      name: "Active Infusions",
      resetType: "Long Rest",
      scaling: {
        type: "level_table",
        table: [
          { minLevel: 2, value: 2 },
          { minLevel: 6, value: 3 },
          { minLevel: 11, value: 4 },
          { minLevel: 15, value: 5 },
          { minLevel: 19, value: 6 },
        ],
      },
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Active Infusions",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Infuse Item",
        description:
          "Touch a mundane object at the end of a Long Rest to turn it into a magical item using your known infusions.",
      },
    ],
    description: "Imbue mundane items with powerful magical prototype properties.",
    source: "Eberron: Forge of the Artificer, Artificer: Infuse Item",
  },

  theRightToolForTheJob: {
    id: "embers:artificer:the-right-tool-for-the-job",
    name: "The Right Tool for the Job",
    kind: "class_feature",
    status: "verified",
    classes: ["artificer"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Produce Artisan Tools",
        description:
          "With Thieves' Tools or Tinker's Tools in hand, magically create one set of Artisan's Tools in an unoccupied space within 5 feet after 1 hour of uninterrupted work.",
      },
    ],
    description: "Conjure precisely the artisan tools you need for any inventive endeavor.",
    source: "Eberron: Forge of the Artificer, Artificer: The Right Tool for the Job",
  },

  toolExpertise: {
    id: "embers:artificer:tool-expertise",
    name: "Tool Expertise",
    kind: "class_feature",
    status: "verified",
    classes: ["artificer"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Double Tool Proficiency",
        description:
          "Your Proficiency Bonus is doubled for any ability check you make that uses your proficiency with a tool.",
      },
    ],
    description: "Flawless technical mastery with any tool in your hands.",
    source: "Eberron: Forge of the Artificer, Artificer: Tool Expertise",
  },

  flashOfGenius: {
    id: "embers:artificer:flash-of-genius",
    name: "Flash of Genius",
    kind: "class_feature",
    status: "verified",
    classes: ["artificer"],
    activationType: "reaction",
    resource: {
      name: "Flash of Genius",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Flash of Genius",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Brilliant Insight",
        description:
          "When you or another creature within 30 feet makes an ability check or saving throw, take a Reaction to add your Intelligence modifier to the roll.",
      },
    ],
    description:
      "You gain the ability to come up with brilliant solutions under pressure.",
    source: "Eberron: Forge of the Artificer, Artificer: Flash of Genius",
  },

  magicItemAdept: {
    id: "embers:artificer:magic-item-adept",
    name: "Magic Item Adept",
    kind: "class_feature",
    status: "verified",
    classes: ["artificer"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Attune 4 Items",
        description:
          "You can attune to up to four magic items at once. Crafting a common or uncommon magic item takes you a quarter of the normal time and costs half as much gold.",
      },
    ],
    description: "Exceptional affinity with magic items and rapid enchanting.",
    source: "Eberron: Forge of the Artificer, Artificer: Magic Item Adept",
  },

  spellStoringItem: {
    id: "embers:artificer:spell-storing-item",
    name: "Spell-Storing Item",
    kind: "class_feature",
    status: "verified",
    classes: ["artificer"],
    activationType: "action",
    resource: {
      name: "Spell-Storing Item Uses",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Spell-Storing Item Uses",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Item Spell Activation",
        description:
          "Store a 1st- or 2nd-level Artificer spell into a weapon or focus. While holding the object, a creature can activate the spell using its action (up to 2x your Intelligence modifier times).",
      },
    ],
    description: "Store miniature spell matrices into portable artifacts.",
    source: "Eberron: Forge of the Artificer, Artificer: Spell-Storing Item",
  },

  magicItemSavant: {
    id: "embers:artificer:magic-item-savant",
    name: "Magic Item Savant",
    kind: "class_feature",
    status: "verified",
    classes: ["artificer"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Attune 5 Items & Ignore Requirements",
        description:
          "You can attune to up to five magic items at once. You ignore all class, race, spell, and level requirements for attuning to or using magic items.",
      },
    ],
    description: "Bypass attunement restrictions through deeper arcane engineering.",
    source: "Eberron: Forge of the Artificer, Artificer: Magic Item Savant",
  },

  magicItemMaster: {
    id: "embers:artificer:magic-item-master",
    name: "Magic Item Master",
    kind: "class_feature",
    status: "verified",
    classes: ["artificer"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Attune 6 Items",
        description: "You can attune to up to six magic items simultaneously.",
      },
    ],
    description: "Unprecedented capacity to harness multiple simultaneous enchantments.",
    source: "Eberron: Forge of the Artificer, Artificer: Magic Item Master",
  },

  soulOfArtifice: {
    id: "embers:artificer:soul-of-artifice",
    name: "Soul of Artifice",
    kind: "class_feature",
    status: "verified",
    classes: ["artificer"],
    activationType: "reaction",
    operations: [
      {
        type: "apply_effect",
        name: "Attunement Save Bonus & Cheat Death",
        description:
          "Gain a +1 bonus to all saving throws for every magic item you are currently attuned to (up to +6). If you are reduced to 0 HP but not killed outright, you can take a Reaction to end one of your Artificer infusions to drop to 1 HP instead.",
      },
    ],
    description:
      "Level 20 Capstone: Your understanding of magic items reaches transcendence, reinforcing your spirit with living enchantments.",
    source: "Eberron: Forge of the Artificer, Artificer: Soul of Artifice",
  },

  ...ALCHEMIST_FORMULAS,
  ...ARMORER_FORMULAS,
  ...ARTILLERIST_FORMULAS,
  ...BATTLE_SMITH_FORMULAS,
  ...CARTOGRAPHER_FORMULAS,
};

export {
  ALCHEMIST_FORMULAS,
  ARMORER_FORMULAS,
  ARMOR_MODEL_OPTIONS,
  ARTILLERIST_FORMULAS,
  BATTLE_SMITH_FORMULAS,
  CARTOGRAPHER_FORMULAS,
};
