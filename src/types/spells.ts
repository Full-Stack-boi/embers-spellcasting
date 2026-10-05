import { BlueprintValue, EffectBlueprint } from "./blueprint";

export type ReplicationType = "no" | "all" | "first_to_all";
export type ParameterType = "options" | "number" | "boolean" | "asset";

export type OptionsContent = {
  value: string;
  label: string;
}[];

export interface NumberContent {
  min?: number;
  max?: number;
}

export type BooleanContent = undefined;

export interface AssetContent {
  multiple: boolean;
}

export interface Parameter {
  name: string;
  id: string;
  type: ParameterType;
  defaultValue: unknown;
  content?: OptionsContent | NumberContent | BooleanContent | AssetContent;
}

export interface Spell {
  // The name of the effect to play
  name?: string;
  // Minimum number of targets
  minTargets?: number;
  // Maximum number of targets
  maxTargets?: number;
  // Thumbnail image to display for this effect
  thumbnail?: string;
  // Whether this effect should be repeated and how to do so
  replicate?: ReplicationType;
  // Whether this effect should be copied when targetting the same item multiple times and how to do so
  copy?: number;
  // Whether the first target is the caster's token
  firstTargetIsCaster?: BlueprintValue<boolean>;
  // List of parameters for this spell
  parameters?: Parameter[];

  // Blueprint for the effect to play
  blueprints?: EffectBlueprint[];

  // Blueprint for the effect to play when it is destroyed
  onDestroyBlueprints?: EffectBlueprint[];

  // Range in feet (e.g. 120 for Eldritch Blast, 150 for Fireball, 5 for Touch)
  range?: number;
  // AoE Shape if this spell covers an area (Sphere, Cone, Cube, Line)
  aoeShape?: "Sphere" | "Cone" | "Cube" | "Line";
  // AoE size in feet (e.g. 20 for Fireball 20ft radius)
  aoeSize?: number;
}

export interface Spells {
  [key: string]: Spell;
}
