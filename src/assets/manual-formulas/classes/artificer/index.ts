import type { ManualActionFormula } from "../../../../types/manualFormula";
import { ALCHEMIST_FORMULAS } from "./subclasses/alchemist";
import { ARMORER_FORMULAS } from "./subclasses/armorer";
import { ARTILLERIST_FORMULAS } from "./subclasses/artillerist";
import { BATTLE_SMITH_FORMULAS } from "./subclasses/battleSmith";
import { CARTOGRAPHER_FORMULAS } from "./subclasses/cartographer";

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

  ...ALCHEMIST_FORMULAS,
  ...ARMORER_FORMULAS,
  ...ARTILLERIST_FORMULAS,
  ...BATTLE_SMITH_FORMULAS,
  ...CARTOGRAPHER_FORMULAS,
};

export {
  ALCHEMIST_FORMULAS,
  ARMORER_FORMULAS,
  ARTILLERIST_FORMULAS,
  BATTLE_SMITH_FORMULAS,
  CARTOGRAPHER_FORMULAS,
};
