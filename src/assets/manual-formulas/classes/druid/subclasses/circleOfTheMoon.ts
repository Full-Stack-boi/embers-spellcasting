import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const CIRCLE_OF_THE_MOON_FORMULAS: Record<string, ManualActionFormula> =
  {
    combatWildShape: {
      id: "embers:druid:moon:combat-wild-shape",
      name: "Combat Wild Shape",
      kind: "class_feature",
      status: "verified",
      classes: ["druid"],
      subclass: "circleOfTheMoon",
      activationType: "bonus",
      operations: [
        {
          type: "apply_effect",
          name: "Moonlit Beast Form",
          description:
            "Adopt Wild Shape as a Bonus Action. Base AC = 13 + WIS mod; gain Temporary HP = 3x Druid level; beast attacks deal normal damage or Radiant damage; Bonus Action expend spell slot to heal 1d8 HP per slot level.",
        },
      ],
      description:
        "Shift swiftly into formidable predatory beast forms blessed by the moon.",
      source: "Player's Handbook (2024), Druid: Circle of the Moon",
    },

    improvedCircleForms: {
      id: "embers:druid:moon:improved-circle-forms",
      name: "Improved Circle Forms",
      kind: "class_feature",
      status: "verified",
      classes: ["druid"],
      subclass: "circleOfTheMoon",
      activationType: "special",
      description: "While in a beast shape from Wild Shape, you add your Wisdom modifier to the damage rolls of your beast attacks.",
      source: "Player's Handbook (2024), Druid: Circle of the Moon",
      operations: [],
      weaponDamageRider: {
        damageFormula: "WIS",
        damageType: "radiant",
        condition: "While in Wild Shape beast form",
      },
    },

    moonlightStep: {
      id: "embers:druid:moon:moonlight-step",
      name: "Moonlight Step",
      kind: "class_feature",
      status: "verified",
      classes: ["druid"],
      subclass: "circleOfTheMoon",
      activationType: "bonus",
      resource: {
        name: "Moonlight Step",
        resetType: "Long Rest",
      },
      operations: [
        {
          type: "apply_effect",
          name: "Lunar Teleport",
          description:
            "Bonus Action teleport up to 30 feet to an unoccupied space you can see and gain Advantage on the next attack roll you make before the end of this turn (Wisdom modifier uses, min 1).",
        },
      ],
      description:
        "Fade into moonbeams and blink across the battlefield with lethal momentum.",
      source: "Player's Handbook (2024), Druid: Circle of the Moon",
    },

    lunarForm: {
      id: "embers:druid:moon:lunar-form",
      name: "Lunar Form",
      kind: "class_feature",
      status: "verified",
      classes: ["druid"],
      subclass: "circleOfTheMoon",
      activationType: "special",
      description: "When using Moonlight Step, you can teleport a willing ally with you. In addition, once per turn while in Wild Shape, you can deal an extra 2d10 Radiant damage on a hit.",
      source: "Player's Handbook (2024), Druid: Circle of the Moon",
      operations: [],
      weaponDamageRider: {
        damageFormula: "2d10",
        damageType: "radiant",
        condition: "Once per turn while in Wild Shape",
      },
    },
  };
