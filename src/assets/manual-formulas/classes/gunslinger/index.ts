import type { ManualActionFormula } from "../../../../types/manualFormula";
import { PISTOLERO_FORMULAS } from "./subclasses/pistolero";

export const GUNSLINGER_CLASS_FORMULAS: Record<string, ManualActionFormula> = {
  quickDraw: {
    id: "embers:gunslinger:quick-draw",
    name: "Quick Draw",
    kind: "class_feature",
    status: "verified",
    classes: ["gunslinger"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Fast Hands on Firearms",
        description:
          "You can draw or stow two weapons when you would normally be able to draw or stow only one. You also gain a bonus to your initiative rolls equal to your Proficiency Bonus.",
      },
    ],
    description: "Lightning-fast reflexes allow you to draw firearms in the blink of an eye.",
    source: "Valda's Spire of Secrets: Player Pack 2, Gunslinger: Quick Draw",
  },

  riskDice: {
    id: "embers:gunslinger:risk-dice",
    name: "Risk Dice",
    kind: "class_feature",
    status: "verified",
    classes: ["gunslinger"],
    activationType: "special",
    resource: {
      name: "Risk Dice",
      resetType: "Short or Long Rest",
      scaling: {
        type: "level_table",
        table: [
          { minLevel: 2, value: 2 },
          { minLevel: 5, value: 3 },
          { minLevel: 9, value: 4 },
          { minLevel: 13, value: 5 },
          { minLevel: 17, value: 6 },
        ],
      },
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Risk Dice",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "High Stakes Gamble",
        description:
          "Fuel high-stakes maneuvers, deeds, and trick shots using Risk Dice (d6 at 2nd level, d8 at 5th, d10 at 11th, d12 at 17th).",
      },
    ],
    description:
      "Your deadly prowess with firearms and reckless courage are measured by your pool of Risk Dice.",
    source: "Valda's Spire of Secrets: Player Pack 2, Gunslinger: Risk Dice",
  },

  extraAttack: {
    id: "embers:gunslinger:extra-attack",
    name: "Extra Attack (Gunslinger)",
    kind: "class_feature",
    status: "verified",
    classes: ["gunslinger"],
    activationType: "action",
    operations: [
      {
        type: "apply_effect",
        name: "Double Firearm Strike",
        description: "You can attack twice instead of once whenever you take the Attack action on your turn.",
      },
    ],
    description: "Chain rapid firearm shots with deadly rhythm.",
    source: "Valda's Spire of Secrets: Player Pack 2, Gunslinger: Extra Attack",
  },

  gutShot: {
    id: "embers:gunslinger:gut-shot",
    name: "Gut Shot",
    kind: "class_feature",
    status: "verified",
    classes: ["gunslinger"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Lodged Projectile",
        description:
          "When you score a Critical Hit with a firearm against a creature, you can lodge a projectile in it. While lodged, the target suffers a -2 penalty to attack rolls and AC until an action is taken to remove it.",
      },
    ],
    description: "Savage precision leaves painful projectiles lodged in critical monster anatomy.",
    source: "Valda's Spire of Secrets: Player Pack 2, Gunslinger: Gut Shot",
  },

  evasion: {
    id: "embers:gunslinger:evasion",
    name: "Evasion (Gunslinger)",
    kind: "class_feature",
    status: "verified",
    classes: ["gunslinger"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Agile Avoidance",
        description:
          "When subjected to an effect that allows a Dexterity saving throw to take half damage, take no damage on a success and half on a failure.",
      },
    ],
    description: "Instinctive agility dodges blasts and explosions.",
    source: "Valda's Spire of Secrets: Player Pack 2, Gunslinger: Evasion",
  },

  rapidReload: {
    id: "embers:gunslinger:rapid-reload",
    name: "Rapid Reload",
    kind: "class_feature",
    status: "verified",
    classes: ["gunslinger"],
    activationType: "bonus",
    operations: [
      {
        type: "apply_effect",
        name: "Quick Chamber",
        description: "You can reload any firearm as a Bonus Action or object interaction without slowing your stride.",
      },
    ],
    description: "Seamless reloading under heavy fire.",
    source: "Valda's Spire of Secrets: Player Pack 2, Gunslinger: Rapid Reload",
  },

  maverick: {
    id: "embers:gunslinger:maverick",
    name: "Maverick",
    kind: "class_feature",
    status: "verified",
    classes: ["gunslinger"],
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Legendary Gambler",
        description:
          "Level 20 Capstone: When you roll Initiative and have no Risk Dice remaining, you immediately regain 2 Risk Dice. In addition, whenever you roll a Risk Die, you can choose to take the maximum result instead of rolling (1/Short or Long Rest).",
      },
    ],
    description: "Level 20 Capstone: You are a peerless gunslinger who never runs out of luck in the face of death.",
    source: "Valda's Spire of Secrets: Player Pack 2, Gunslinger: Maverick",
  },

  ...PISTOLERO_FORMULAS,
};

export { PISTOLERO_FORMULAS };
