/**
 * Manual Spell Formula Overrides — Illusion Cantrips
 */

import type { SpellFormula } from "../../../types/spellFormula";

export const illusionCantripOverrides: Record<string, SpellFormula> = {
  // Dancing Lights (Player's Handbook 2024, pg. 259)
  dancing_lights: {
    id: "dancing_lights",
    name: "Dancing Lights",
    category: {
      spellType: "cantrip",
      school: "illusion",
      level: 0,
      classes: ["artificer", "bard", "sorcerer", "wizard"],
      source: "Player's Handbook (2024), pg. 259",
      concentration: true,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "120 ft.",
      components: "V, S, M (a bit of phosphorus)",
      duration: "Concentration, up to 1 minute",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Create up to four torch-size lights or combine them into one vaguely humanoid Medium form. Each sheds dim light in a 10-foot radius.",
      "As a Bonus Action, move the lights up to 60 feet within range; keep each within 20 feet of another. A light vanishes if it exceeds the spell's range.",
    ],
    isManualOverride: true,
    notes:
      "Light placement, grouping, and Bonus Action movement are tracked manually. Illrigger access is limited to Architect of Ruin.",
  },

  // Minor Illusion (D&D Free Rules 2024, Spell Descriptions)
  minor_illusion: {
    id: "minor_illusion",
    name: "Minor Illusion",
    category: {
      spellType: "cantrip",
      school: "illusion",
      level: 0,
      classes: ["bard", "sorcerer", "warlock", "wizard"],
      source: "Player's Handbook (2024), pg. 298",
      concentration: false,
      ritual: false,
    },
    casting: {
      time: "1 action",
      range: "30 ft.",
      components: "S, M (a bit of fleece)",
      duration: "1 minute",
    },
    interaction: { type: "utility" },
    damage: [],
    effectNotes: [
      "Create either a sound or an image of an object no larger than a 5-foot Cube. The illusion ends if you cast this spell again.",
      "A creature can use the Study action to identify it with a successful Intelligence (Investigation) check against your spell save DC; the illusion then appears faint to that creature.",
      "An image cannot create sound, light, smell, or other sensory effects. Physical interaction reveals it as an illusion because objects pass through it.",
    ],
    isManualOverride: true,
    notes:
      "Sound/image selection and Investigation adjudication are manual; the image cannot deal damage or create conditions.",
  },
};
