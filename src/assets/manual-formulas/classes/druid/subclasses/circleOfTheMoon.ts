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
  };
