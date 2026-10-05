/**
 * Manual Spell Formula Overrides — Leveled Spells Index
 *
 * Merges all school-specific leveled spell overrides.
 */

import type { SpellFormula } from "../../../types/spellFormula";

export { abjurationSpellOverrides } from "./abjuration";
export { conjurationSpellOverrides } from "./conjuration";
export { divinationSpellOverrides } from "./divination";
export { enchantmentSpellOverrides } from "./enchantment";
export { evocationSpellOverrides } from "./evocation";
export { illusionSpellOverrides } from "./illusion";
export { necromancySpellOverrides } from "./necromancy";
export { transmutationSpellOverrides } from "./transmutation";

import { abjurationSpellOverrides } from "./abjuration";
import { conjurationSpellOverrides } from "./conjuration";
import { divinationSpellOverrides } from "./divination";
import { enchantmentSpellOverrides } from "./enchantment";
import { evocationSpellOverrides } from "./evocation";
import { illusionSpellOverrides } from "./illusion";
import { necromancySpellOverrides } from "./necromancy";
import { transmutationSpellOverrides } from "./transmutation";

export const ALL_LEVELED_SPELL_OVERRIDES: Record<string, SpellFormula> = {
  ...abjurationSpellOverrides,
  ...conjurationSpellOverrides,
  ...divinationSpellOverrides,
  ...enchantmentSpellOverrides,
  ...evocationSpellOverrides,
  ...illusionSpellOverrides,
  ...necromancySpellOverrides,
  ...transmutationSpellOverrides,
};
