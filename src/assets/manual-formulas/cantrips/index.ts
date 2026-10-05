/**
 * Manual Spell Formula Overrides — Cantrips Index
 *
 * Merges all school-specific cantrip overrides.
 */

import type { SpellFormula } from "../../../types/spellFormula";

export { abjurationCantripOverrides } from "./abjuration";
export { conjurationCantripOverrides } from "./conjuration";
export { divinationCantripOverrides } from "./divination";
export { enchantmentCantripOverrides } from "./enchantment";
export { evocationCantripOverrides } from "./evocation";
export { illusionCantripOverrides } from "./illusion";
export { necromancyCantripOverrides } from "./necromancy";
export { transmutationCantripOverrides } from "./transmutation";

import { abjurationCantripOverrides } from "./abjuration";
import { conjurationCantripOverrides } from "./conjuration";
import { divinationCantripOverrides } from "./divination";
import { enchantmentCantripOverrides } from "./enchantment";
import { evocationCantripOverrides } from "./evocation";
import { illusionCantripOverrides } from "./illusion";
import { necromancyCantripOverrides } from "./necromancy";
import { transmutationCantripOverrides } from "./transmutation";

export const ALL_CANTRIP_OVERRIDES: Record<string, SpellFormula> = {
  ...abjurationCantripOverrides,
  ...conjurationCantripOverrides,
  ...divinationCantripOverrides,
  ...enchantmentCantripOverrides,
  ...evocationCantripOverrides,
  ...illusionCantripOverrides,
  ...necromancyCantripOverrides,
  ...transmutationCantripOverrides,
};
