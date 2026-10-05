import type { SpellFormula } from "../../types/spellFormula";

const source = "Valda's Spire of Secrets: Player Pack 2 (2024 rules)";
const classes = {
  blades: ["sorcerer", "warlock", "wizard"],
  bardWizard: ["bard", "wizard"],
  arcane: ["sorcerer", "warlock", "wizard"],
};

function makeSpell(input: {
  id: string;
  name: string;
  level: number;
  school: SpellFormula["category"]["school"];
  classes: string[];
  time: string;
  range: string;
  components: string;
  duration: string;
  interaction?: SpellFormula["interaction"];
  damage?: SpellFormula["damage"];
  scaling?: SpellFormula["cantripScale"];
  upcasting?: SpellFormula["upcasting"];
  mechanics?: SpellFormula["mechanics"];
  area?: SpellFormula["area"];
  effectNotes?: string[];
}): SpellFormula {
  return {
    id: input.id,
    name: input.name,
    category: {
      spellType: input.level === 0 ? "cantrip" : "spell",
      school: input.school,
      level: input.level,
      classes: input.classes,
      source,
      concentration: input.duration.toLowerCase().includes("concentration"),
      ritual: input.time.toLowerCase().includes("ritual"),
    },
    casting: {
      time: input.time,
      range: input.range,
      components: input.components,
      duration: input.duration,
    },
    interaction: input.interaction,
    damage: input.damage ?? [],
    cantripScale: input.scaling,
    upcasting: input.upcasting,
    mechanics: input.mechanics,
    area: input.area,
    effectNotes: input.effectNotes,
    implementation: {
      sourceStatus: "checked",
      runtimeStatus:
        input.interaction || input.damage?.length ? "assisted" : "manual",
      playtestStatus: "not-tested",
      manualSteps: [
        "Review the result and apply HP changes on the character sheet; spell rolls do not update Owlbear token HP.",
        ...(input.effectNotes ?? [
          "Resolve this spell's effect with the GM; no automatic effect is applied to tokens.",
        ]),
      ],
    },
    isManualOverride: true,
  };
}

const weaponCantrip = (id: string, name: string, damageType: "fire" | "cold") =>
  makeSpell({
    id,
    name,
    level: 0,
    school: "evocation",
    classes: classes.blades,
    time: "1 action",
    range: "Self",
    components: "S, M (proficient melee weapon worth 1+ CP)",
    duration: "Instantaneous",
    interaction: { type: "weapon_based", useSpellcastingMod: true },
    damage: [
      {
        dice: id === "frigid_blade" ? "weapon+1step" : "weapon",
        type: "choice",
        typeChoices: [damageType, "weapon"],
        isBase: true,
      },
    ],
    scaling: {
      tiers: [
        { minLevel: 1, totalDice: "0d6" },
        { minLevel: 5, totalDice: "1d6" },
        { minLevel: 11, totalDice: "2d6" },
        { minLevel: 17, totalDice: "3d6" },
      ],
      scaleMode: "add_dice",
      extraDamageType: damageType,
    },
    mechanics: [
      ...(id === "frigid_blade"
        ? [{ kind: "weapon_step_upgrade" as const, steps: 1 }]
        : []),
      ...(id === "burning_blade"
        ? [
            {
              kind: "exploding_any_die" as const,
              maxExtra: "spellcastingMod" as const,
            },
          ]
        : []),
    ],
    effectNotes:
      id === "burning_blade"
        ? [
            "On a maximum weapon or spell damage die, add another die of that size; repeat, capped at spellcasting modifier extra dice.",
          ]
        : undefined,
  });

export const vsspp2SpellOverrides: Record<string, SpellFormula> = {
  arc_blade: makeSpell({
    id: "arc_blade",
    name: "Arc Blade",
    level: 0,
    school: "evocation",
    classes: classes.blades,
    time: "1 action",
    range: "15 ft.",
    components: "S, M (proficient melee weapon worth 1+ CP)",
    duration: "Instantaneous",
    interaction: {
      type: "weapon_based",
      useSpellcastingMod: true,
      weaponAttack: {
        meleeRangeFeet: 5,
        rangedSpellAttack: { rangeFeet: 15, damageType: "lightning" },
      },
    },
    damage: [
      {
        dice: "weapon",
        type: "choice",
        typeChoices: ["lightning", "weapon"],
        isBase: true,
      },
    ],
    scaling: {
      tiers: [
        { minLevel: 1, totalDice: "0d6" },
        { minLevel: 5, totalDice: "1d6" },
        { minLevel: 11, totalDice: "2d6" },
        { minLevel: 17, totalDice: "3d6" },
      ],
      scaleMode: "add_dice",
      extraDamageType: "lightning",
    },
  }),
  blunder: makeSpell({
    id: "blunder",
    name: "Blunder",
    level: 2,
    school: "enchantment",
    classes: classes.bardWizard,
    time: "1 reaction (when a creature you see within range hits a target)",
    range: "30 ft.",
    components: "S, M (a banana peel)",
    duration: "Instantaneous",
    interaction: { type: "save", saveAbility: "WIS" },
    effectNotes: [
      "On failed save, choose Fumble (drop a held object in a chosen space up to 10 ft. away; if the attack weapon is dropped, the attacker can make an Unarmed Strike for that attack) or Prat Fall (Prone; apply Prone's attack disadvantage to the triggering attack).",
    ],
  }),
  burning_blade: weaponCantrip("burning_blade", "Burning Blade", "fire"),
  candy_blast: makeSpell({
    id: "candy_blast",
    name: "Candy Blast",
    level: 0,
    school: "conjuration",
    classes: ["sorcerer", "wizard"],
    time: "1 action",
    range: "60 ft.",
    components: "V, S",
    duration: "Instantaneous",
    interaction: { type: "spell_attack" },
    damage: [{ dice: "1d8", type: "force", isBase: true }],
    scaling: {
      tiers: [
        { minLevel: 1, totalDice: "1d8" },
        { minLevel: 5, totalDice: "2d8" },
        { minLevel: 11, totalDice: "3d8" },
        { minLevel: 17, totalDice: "4d8" },
      ],
      scaleMode: "replace",
    },
    effectNotes: [
      "On hit, create a 5-foot-square patch of Difficult Terrain in the target's space; it lasts 1 minute or until the candy is removed.",
    ],
  }),
  cheat: makeSpell({
    id: "cheat",
    name: "Cheat",
    level: 0,
    school: "divination",
    classes: ["bard", "sorcerer", "warlock", "wizard"],
    time: "1 bonus action",
    range: "Self",
    components: "S, M (a weighted die)",
    duration: "Until end of your next turn",
    effectNotes: [
      "Until the effect ends, reroll any ability check you make to play a nonmagical game of skill; you must use the new roll. Does not alter magical games or effects such as Deck of Many Things.",
    ],
  }),
  cosmic_horror: makeSpell({
    id: "cosmic_horror",
    name: "Cosmic Horror",
    level: 3,
    school: "conjuration",
    classes: classes.arcane,
    time: "1 action",
    range: "60 ft.",
    components: "V, S, M (a dream journal)",
    duration: "Concentration, up to 1 minute",
    interaction: { type: "save", saveAbility: "WIS" },
    damage: [{ dice: "6d6", type: "psychic", isBase: true }],
    area: { shape: "Sphere", sizeFeet: 10 },
    upcasting: {
      notes: "+1d6 per slot level above 3rd",
      perSlotLevel: { dice: "1d6", type: "psychic" },
    },
    effectNotes: [
      "Failed save: Frightened for duration; repeat Wisdom save at end of each turn. Successful save: half damage only.",
    ],
  }),
  flashback: makeSpell({
    id: "flashback",
    name: "Flashback",
    level: 3,
    school: "divination",
    classes: ["bard", "cleric", "wizard"],
    time: "1 action",
    range: "Self",
    components: "V, S",
    duration: "Instantaneous",
    effectNotes: [
      "Player proposes a preparation made within the last 24 hours; GM determines plausibility and may call for an ability check. Cannot remove creatures/objects, harm creatures, or move unattended creatures/objects. GM adjudicates outcome.",
    ],
  }),
  flawed_reconstruction: makeSpell({
    id: "flawed_reconstruction",
    name: "Flawed Reconstruction",
    level: 1,
    school: "transmutation",
    classes: classes.arcane,
    time: "1 action",
    range: "Touch",
    components: "V, S, M (a needle and thread)",
    duration: "Instantaneous",
    interaction: { type: "utility" },
    damage: [{ dice: "3d6", type: "healing", isBase: true }],
    upcasting: {
      notes:
        "+2d6 healing and +1d6 hit point maximum reduction per slot level above 1st",
      perSlotLevel: { dice: "2d6", type: "healing" },
    },
    effectNotes: [
      "Also reduce target's hit point maximum by 1d6 per slot level (minimum maximum 1). Track reduced maximum until restored by the applicable rules.",
    ],
  }),
  frenzy: makeSpell({
    id: "frenzy",
    name: "Frenzy",
    level: 6,
    school: "enchantment",
    classes: classes.bardWizard,
    time: "1 action",
    range: "120 ft.",
    components: "V, S, M (a drop of fresh blood)",
    duration: "Concentration, up to 1 minute",
    interaction: { type: "save", saveAbility: "WIS" },
    area: { shape: "Sphere", sizeFeet: 20 },
    effectNotes: [
      "On failed save, Frenzied: regards visible creatures as enemies; randomly chooses targets for attacks, spells, and abilities among visible creatures in range; makes opportunity attacks when provoked. Repeat save at end of each turn.",
    ],
  }),
  frigid_blade: weaponCantrip("frigid_blade", "Frigid Blade", "cold"),
  mandys_marvelous_dress: makeSpell({
    id: "mandys_marvelous_dress",
    name: "Mandy's Marvelous Dress",
    level: 4,
    school: "conjuration",
    classes: ["bard"],
    time: "1 action",
    range: "Touch",
    components: "V, S, M (glass slipper worth 100+ GP)",
    duration: "Concentration, special",
    effectNotes: [
      "Willing wearer can replace a Charisma D20 Test roll with 10. A visible attacker must succeed on Wisdom save or miss; on success it is immune to this effect until spell ends. Ends at next midnight where time passes normally, otherwise after 24 hours. Dressing/jewelry and removal details require manual tracking.",
    ],
  }),
  protect_threshold: makeSpell({
    id: "protect_threshold",
    name: "Protect Threshold",
    level: 2,
    school: "abjuration",
    classes: ["sorcerer", "wizard"],
    time: "1 action or ritual",
    range: "Touch",
    components: "V, S, M (salt; 1 oz. per foot of portal perimeter)",
    duration: "10 minutes",
    interaction: { type: "save", saveAbility: "WIS" },
    damage: [{ dice: "4d6", type: "psychic", isBase: true }],
    upcasting: {
      notes: "+1d6 per slot level above 2nd",
      perSlotLevel: { dice: "1d6", type: "psychic" },
    },
    effectNotes: [
      "Ward a doorway, window, or other portal. Triggering creature takes half damage on successful save; maintain ward trigger manually.",
    ],
  }),
  rocks_fall: makeSpell({
    id: "rocks_fall",
    name: "Rocks Fall",
    level: 8,
    school: "conjuration",
    classes: ["druid", "sorcerer", "warlock", "wizard"],
    time: "1 action",
    range: "120 ft.",
    components: "V, S, M (ten dice)",
    duration: "Instantaneous",
    interaction: { type: "save", saveAbility: "DEX" },
    damage: [{ dice: "10d8", type: "bludgeoning", isBase: true }],
    area: { shape: "Sphere", sizeFeet: 60 },
    effectNotes: [
      "Cylinder radius 60 ft., height 120 ft. Success: half damage only. Failure: target is buried (Prone and Restrained); action Strength (Athletics) check vs spell save DC ends both conditions on success. The preview marks the top-down 60-foot-radius footprint; verify vertical eligibility manually.",
    ],
  }),
  rusting_grasp: makeSpell({
    id: "rusting_grasp",
    name: "Rusting Grasp",
    level: 3,
    school: "transmutation",
    classes: ["druid", "sorcerer", "wizard"],
    time: "1 action",
    range: "Touch",
    components: "V, S",
    duration: "Instantaneous",
    interaction: { type: "melee_spell_attack" },
    damage: [{ dice: "6d4", type: "acid", isBase: true }],
    upcasting: {
      notes:
        "+2d4 per slot level above 3rd; against objects, destroy an additional cubic foot per level",
      perSlotLevel: { dice: "2d4", type: "acid" },
    },
    effectNotes: [
      "On hit, target AC is reduced by 3 (minimum 10) for 1 hour. Nonmagical metal object not worn/carried: corrode selected parts fitting within a 1-foot cube; no attack roll against that effect.",
    ],
  }),
  seance: makeSpell({
    id: "seance",
    name: "Séance",
    level: 3,
    school: "necromancy",
    classes: classes.bardWizard,
    time: "10 minutes",
    range: "Self",
    components:
      "V, S, M (crystal ball, tarot deck, or ouija board and incense worth 50+ GP)",
    duration: "1 minute",
    effectNotes: [
      "Caster and at least three willing creatures conjure a familiar free/willing spirit. Cannot target the same spirit again for 10 days. Up to three questions; answers may be cryptic/untruthful if hostile. 5% chance of wrong spirit. GM adjudication required.",
    ],
  }),
  soul_effigy: makeSpell({
    id: "soul_effigy",
    name: "Soul Effigy",
    level: 4,
    school: "necromancy",
    classes: ["warlock"],
    time: "1 minute or ritual",
    range: "Touch",
    components: "V, S, M (straw doll worth 1+ CP)",
    duration: "8 hours",
    interaction: { type: "save", saveAbility: "CON" },
    damage: [{ dice: "2d8", type: "choice", isBase: true }],
    effectNotes: [
      "Failed save binds a Humanoid's soul fragment; ends if doll is destroyed or target is on another plane. Magic action: Control (target next turn limited to Dash/Disengage/Hide/Utilize), Harm (2d8 appropriate damage ignoring resistance/immunity), or Restrained until end of your next turn. Track doll and state manually.",
    ],
  }),
  stone_bones: makeSpell({
    id: "stone_bones",
    name: "Stone Bones",
    level: 2,
    school: "transmutation",
    classes: ["druid", "paladin", "ranger", "sorcerer", "wizard"],
    time: "1 bonus action",
    range: "30 ft.",
    components: "V, S",
    duration: "Until end of your next turn",
    effectNotes: [
      "Choose a visible creature; it gains resistance to bludgeoning, piercing, and slashing damage. Track duration and damage resistance manually.",
    ],
  }),
  swift_flight: makeSpell({
    id: "swift_flight",
    name: "Swift Flight",
    level: 2,
    school: "transmutation",
    classes: ["sorcerer", "wizard"],
    time: "1 bonus action",
    range: "Touch",
    components: "V, S, M (a bird's wing feather)",
    duration: "Until end of your next turn",
    effectNotes: [
      "Target has Fly Speed 60 ft. and can hover; when effect ends, it falls if airborne and unsupported. Track speed and end-of-duration fall manually.",
    ],
  }),
  sword_of_judgment: makeSpell({
    id: "sword_of_judgment",
    name: "Sword of Judgment",
    level: 5,
    school: "conjuration",
    classes: ["cleric", "paladin"],
    time: "1 action",
    range: "60 ft.",
    components: "V, S, M (a strand of horse hair)",
    duration: "Concentration, up to 1 minute",
    interaction: { type: "save", saveAbility: "DEX" },
    damage: [{ dice: "4d8", type: "force", isBase: true }],
    area: { shape: "Sphere", sizeFeet: 20 },
    upcasting: {
      notes: "+1d8 per slot level above 5th",
      perSlotLevel: { dice: "1d8", type: "force" },
    },
    effectNotes: [
      "When a creature in area attacks or casts a spell, caster may force save before trigger; success half damage. At most once per turn per creature. Track trigger usage manually.",
    ],
  }),
  transient_bulwark: makeSpell({
    id: "transient_bulwark",
    name: "Transient Bulwark",
    level: 1,
    school: "abjuration",
    classes: ["sorcerer", "wizard"],
    time: "1 action or ritual",
    range: "Self",
    components: "V, S, M (consumed pearl worth 10+ GP)",
    duration: "8 hours",
    effectNotes: [
      "Apply a -10 penalty to the next attack roll against the caster, then end the spell. Track the one-use ward manually.",
    ],
  }),
  zephyrs_feather: makeSpell({
    id: "zephyrs_feather",
    name: "Zephyr's Feather",
    level: 1,
    school: "conjuration",
    classes: ["druid", "ranger", "sorcerer", "warlock", "wizard"],
    time: "1 action",
    range: "Self",
    components: "V, S, M (a dove's feather)",
    duration: "Concentration, up to 1 minute",
    interaction: { type: "spell_attack" },
    damage: [{ dice: "1d8", type: "force", isBase: true }],
    upcasting: {
      notes: "+1d8 per slot level above 1st",
      perSlotLevel: { dice: "1d8", type: "force" },
    },
    effectNotes: [
      "Creates four feathers. On cast and as a Bonus Action on later turns, expend one for a ranged spell attack against a visible creature within 120 ft.; hit deals 1d8 Force. Track remaining feathers and concentration manually.",
    ],
  }),
};
