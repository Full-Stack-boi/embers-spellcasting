import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const LIGHT_DOMAIN_FORMULAS: Record<string, ManualActionFormula> = {
  wardingFlare: {
    id: "embers:cleric:light:warding-flare",
    name: "Warding Flare",
    kind: "class_feature",
    status: "verified",
    classes: ["cleric"],
    subclass: "lightDomain",
    activationType: "reaction",
    resource: {
      name: "Warding Flare",
      resetType: "Long Rest",
    },
    operations: [
      {
        type: "apply_effect",
        name: "Blinding Flash",
        description:
          "Reaction when a creature you can see within 30 feet attacks you or an ally: impose Disadvantage on the attack roll (Wisdom modifier uses, min 1).",
      },
    ],
    description:
      "Blind incoming attackers with a burst of brilliant solar light.",
    source: "Player's Handbook (2024), Cleric: Light Domain",
  },

  radianceOfTheDawn: {
    id: "embers:cleric:light:radiance-of-the-dawn",
    name: "Channel Divinity: Radiance of the Dawn",
    kind: "class_feature",
    status: "verified",
    classes: ["cleric"],
    subclass: "lightDomain",
    activationType: "action",
    operations: [
      {
        type: "apply_effect",
        name: "Solar Burst",
        description:
          "Action expend 1 Channel Divinity: dispel magical darkness within 30 feet and force hostile creatures in the area to make a Constitution save, taking 2d10 + Cleric level Radiant damage (half on success).",
      },
    ],
    description:
      "Ignite a devastating burst of dawn light that purges darkness and incinerates foes.",
    source: "Player's Handbook (2024), Cleric: Light Domain",
  },

  improvedWardingFlare: {
    id: "embers:cleric:light:improved-warding-flare",
    name: "Improved Warding Flare",
    kind: "class_feature",
    status: "verified",
    classes: ["cleric"],
    subclass: "lightDomain",
    activationType: "special",
    operations: [
      {
        type: "apply_effect",
        name: "Luminescent Ward",
        description:
          "You can use Warding Flare to protect allies within 30 feet. In addition, whenever you use Warding Flare, you grant the target of the attack Temporary Hit Points equal to 2d6 + your Wisdom modifier.",
      },
    ],
    description:
      "Empower your Warding Flare to shield allies and grant radiant temporary hit points.",
    source: "Player's Handbook (2024), Cleric: Light Domain",
  },

  coronaOfLight: {
    id: "embers:cleric:light:corona-of-light",
    name: "Corona of Light",
    kind: "class_feature",
    status: "verified",
    classes: ["cleric"],
    subclass: "lightDomain",
    activationType: "action",
    operations: [
      {
        type: "apply_effect",
        name: "Sunlight Emanation",
        description:
          "Action activate a 60-foot sunlight aura for 1 minute: enemies in the aura have Disadvantage on saving throws against radiant and fire spells you cast.",
      },
    ],
    description: "Radiate piercing holy sunlight that melts magical defenses.",
    source: "Player's Handbook (2024), Cleric: Light Domain",
  },
};
