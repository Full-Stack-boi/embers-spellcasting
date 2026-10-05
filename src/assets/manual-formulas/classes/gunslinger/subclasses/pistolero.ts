import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const PISTOLERO_FORMULAS: Record<string, ManualActionFormula> = {
  closeQuartersShooting: {
    id: "embers:gunslinger:pistolero:close-quarters-shooting",
    name: "Close-Quarters Shooting",
    kind: "class_feature",
    status: "verified",
    classes: ["gunslinger"],
    subclass: "pistolero",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Point-Blank Precision",
        description:
          "Being within 5 feet of an enemy doesn’t impose Disadvantage on your attack rolls with Ranged weapons.",
      },
    ],
    description: "You excel at lethal firearm combat at point-blank range.",
    source: "Valda's Spire of Secrets: Player Pack 2, Gunslinger: Pistolero",
  },

  fanTheHammer: {
    id: "embers:gunslinger:pistolero:fan-the-hammer",
    name: "Fan the Hammer [Maneuver]",
    kind: "class_feature",
    status: "verified",
    classes: ["gunslinger"],
    subclass: "pistolero",
    activationType: "bonus",
    resource: {
      name: "Risk Die",
      resetType: "Short or Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Risk Die",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Rapid Fire Barrage",
        description:
          "Bonus Action when taking the Attack action with a one-handed Ranged weapon: make two additional ranged attacks with that weapon (always with Disadvantage, free hand required).",
      },
    ],
    description:
      "Unleash a blistering spray of lead by rapid-cocking your sidearm.",
    source: "Valda's Spire of Secrets: Player Pack 2, Gunslinger: Pistolero",
  },

  disarm: {
    id: "embers:gunslinger:pistolero:disarm",
    name: "Pistolero Disarm",
    kind: "class_feature",
    status: "verified",
    classes: ["gunslinger"],
    subclass: "pistolero",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Shoot Weapon Away",
        description:
          "On Critical Hit triggering Gut Shot, force target to drop held object landing up to 15 ft away instead of lodging a projectile.",
      },
    ],
    description: "Shoot weapons and objects directly out of enemy hands.",
    source: "Valda's Spire of Secrets: Player Pack 2, Gunslinger: Pistolero",
  },

  showdown: {
    id: "embers:gunslinger:pistolero:showdown",
    name: "Showdown [Maneuver]",
    kind: "class_feature",
    status: "verified",
    classes: ["gunslinger"],
    subclass: "pistolero",
    activationType: "special",
    resource: {
      name: "Risk Die",
      resetType: "Short or Long Rest",
    },
    operations: [
      {
        type: "resource_cost",
        resource: "Risk Die",
        amount: 1,
      },
      {
        type: "apply_effect",
        name: "Quickdraw Attack",
        description:
          "When you roll Initiative, expend 1 Risk Die to draw a Ranged weapon and attack (+Risk Die damage). On hit, target has Disadvantage on attacks against others during round 1.",
      },
    ],
    description: "Strike first in high noon shootouts.",
    source: "Valda's Spire of Secrets: Player Pack 2, Gunslinger: Pistolero",
  },

  bulletTime: {
    id: "embers:gunslinger:pistolero:bullet-time",
    name: "Bullet Time",
    kind: "class_feature",
    status: "verified",
    classes: ["gunslinger"],
    subclass: "pistolero",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Hyper-Focus Advantage",
        description:
          "Once on each of your turns when making a ranged attack with a weapon, gain Advantage on the attack roll.",
      },
    ],
    description:
      "Perception slows to a crawl, letting you line up pinpoint trick shots.",
    source: "Valda's Spire of Secrets: Player Pack 2, Gunslinger: Pistolero",
  },
};
