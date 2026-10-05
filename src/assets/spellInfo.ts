import { ALL_MANUAL_OVERRIDES } from "./manual-formulas";

export interface SpellMetadata {
    id: string;
    name: string;
    level: number; // 0 for Cantrip, 1-9
    school: "Abjuration" | "Conjuration" | "Divination" | "Enchantment" | "Evocation" | "Illusion" | "Necromancy" | "Transmutation";
    castingTime: string; // e.g. "1 Action", "1 Bonus Action", "1 Reaction"
    range: string; // e.g. "120 ft", "150 ft", "Touch", "Self (15 ft cone)"
    aoe?: string; // e.g. "20 ft radius Sphere", "15 ft Cone", "15 ft Cube", "100 ft Line"
    duration: string; // e.g. "Instantaneous", "1 minute (Concentration)", "8 hours"
    components: string; // e.g. "V, S", "V, S, M (bat guano and sulfur)"
    saveOrAttack?: string; // e.g. "DEX Save", "WIS Save", "Ranged Spell Attack", "Melee Spell Attack"
    damage?: string; // e.g. "8d6 Fire", "1d10 Force", "2d8 Radiant"
    concentration: boolean;
    ritual: boolean;
    description: string;
    higherLevels?: string;
    canUpcast?: boolean;
}

export const SPELL_INFO_MAP: Record<string, SpellMetadata> = {
    fireball: {
        id: "fireball",
        name: "Fireball",
        level: 3,
        school: "Evocation",
        castingTime: "1 Action",
        range: "150 ft",
        aoe: "20 ft radius Sphere (52 grid cells)",
        duration: "Instantaneous",
        components: "V, S, M (a tiny ball of bat guano and sulfur)",
        saveOrAttack: "DEX Save DC",
        damage: "8d6 Fire",
        concentration: false,
        ritual: false,
        description: "A bright streak flashes from your pointing finger to a point within range and then blossoms with a low roar into an explosion of flame. Each creature in a 20-foot-radius sphere centered on that point must make a Dexterity saving throw. A target takes 8d6 fire damage on a failed save, or half as much on a successful one.",
        higherLevels: "When cast using a spell slot of 4th level or higher, the damage increases by 1d6 for each slot level above 3rd."
    },
    burning_hands: {
        id: "burning_hands",
        name: "Burning Hands",
        level: 1,
        school: "Evocation",
        castingTime: "1 Action",
        range: "Self (15 ft cone)",
        aoe: "15 ft Cone",
        duration: "Instantaneous",
        components: "V, S",
        saveOrAttack: "DEX Save DC",
        damage: "3d6 Fire",
        concentration: false,
        ritual: false,
        description: "As you hold your hands with thumbs touching and fingers spread, a thin sheet of flames shoots forth from your outstretched fingertips. Each creature in a 15-foot cone must make a Dexterity saving throw. A creature takes 3d6 fire damage on a failed save, or half as much on a successful one. Flammable objects in the area that aren't being worn or carried ignite.",
        higherLevels: "When cast using a spell slot of 2nd level or higher, the damage increases by 1d6 for each slot level above 1st."
    },
    lightning_bolt: {
        id: "lightning_bolt",
        name: "Lightning Bolt",
        level: 3,
        school: "Evocation",
        castingTime: "1 Action",
        range: "Self (100 ft line)",
        aoe: "100 ft × 5 ft Line",
        duration: "Instantaneous",
        components: "V, S, M (a bit of fur and a rod of amber, crystal, or glass)",
        saveOrAttack: "DEX Save DC",
        damage: "8d6 Lightning",
        concentration: false,
        ritual: false,
        description: "A stroke of lightning forming a line 100 feet long and 5 feet wide blasts out from you in a direction you choose. Each creature in the line must make a Dexterity saving throw. A creature takes 8d6 lightning damage on a failed save, or half as much on a successful one.",
        higherLevels: "When cast using a spell slot of 4th level or higher, the damage increases by 1d6 for each slot level above 3rd."
    },
    thunderwave: {
        id: "thunderwave",
        name: "Thunderwave",
        level: 1,
        school: "Evocation",
        castingTime: "1 Action",
        range: "Self (15 ft cube)",
        aoe: "15 ft Cube (3×3 cells)",
        duration: "Instantaneous",
        components: "V, S",
        saveOrAttack: "CON Save DC",
        damage: "2d8 Thunder",
        concentration: false,
        ritual: false,
        description: "A wave of thunderous force sweeps out from you. Each creature in a 15-foot cube originating from you must make a Constitution saving throw. On a failed save, a creature takes 2d8 thunder damage and is pushed 10 feet away from you. On a successful save, it takes half damage and isn't pushed.",
        higherLevels: "When cast using a spell slot of 2nd level or higher, the damage increases by 1d8 for each slot level above 1st."
    },
    misty_step: {
        id: "misty_step",
        name: "Misty Step",
        level: 2,
        school: "Conjuration",
        castingTime: "1 Bonus Action",
        range: "30 ft",
        duration: "Instantaneous",
        components: "V",
        saveOrAttack: "None",
        concentration: false,
        ritual: false,
        description: "Briefly surrounded by silvery mist, you teleport up to 30 feet to an unoccupied space that you can see. Excellent for repositioning, escaping grapples, or traversing difficult terrain without provoking opportunity attacks."
    },
    eldritch_blast: {
        id: "eldritch_blast",
        name: "Eldritch Blast",
        level: 0,
        school: "Evocation",
        castingTime: "1 Action",
        range: "120 ft",
        duration: "Instantaneous",
        components: "V, S",
        saveOrAttack: "Ranged Spell Attack",
        damage: "1d10 Force",
        concentration: false,
        ritual: false,
        description: "A beam of crackling energy streaks toward a creature within range. Make a ranged spell attack against the target. On a hit, the target takes 1d10 force damage.",
        higherLevels: "The spell creates more beams at higher character levels: two beams at 5th level, three beams at 11th level, and four beams at 17th level."
    },
    fire_bolt: {
        id: "fire_bolt",
        name: "Fire Bolt",
        level: 0,
        school: "Evocation",
        castingTime: "1 Action",
        range: "120 ft",
        duration: "Instantaneous",
        components: "V, S",
        saveOrAttack: "Ranged Spell Attack",
        damage: "1d10 Fire",
        concentration: false,
        ritual: false,
        description: "You hurl a mote of fire at a creature or object within range. Make a ranged spell attack against the target. On a hit, the target takes 1d10 fire damage. A flammable object hit by this spell ignites if it isn't being worn or carried."
    },
    darkness: {
        id: "darkness",
        name: "Darkness",
        level: 2,
        school: "Evocation",
        castingTime: "1 Action",
        range: "60 ft",
        aoe: "15 ft radius Sphere",
        duration: "Up to 10 minutes (Concentration)",
        components: "V, M (bat fur and a drop of pitch or piece of coal)",
        saveOrAttack: "None",
        concentration: true,
        ritual: false,
        description: "Magical darkness spreads from a point you choose within range to fill a 15-foot-radius sphere for the duration. The darkness spreads around corners. A creature with darkvision can't see through this darkness, and nonmagical light can't illuminate it. Only Truesight or Devil's Sight can pierce through."
    },
    shatter: {
        id: "shatter",
        name: "Shatter",
        level: 2,
        school: "Evocation",
        castingTime: "1 Action",
        range: "60 ft",
        aoe: "10 ft radius Sphere",
        duration: "Instantaneous",
        components: "V, S, M (a chip of mica)",
        saveOrAttack: "CON Save DC",
        damage: "3d8 Thunder",
        concentration: false,
        ritual: false,
        description: "A sudden loud ringing noise, painfully intense, erupts from a point of your choice within range. Each creature in a 10-foot-radius sphere centered on that point must make a Constitution saving throw. A creature takes 3d8 thunder damage on a failed save, or half as much on a successful one.",
        higherLevels: "When cast using a spell slot of 3rd level or higher, the damage increases by 1d8 for each slot level above 2nd."
    },
    entangle: {
        id: "entangle",
        name: "Entangle",
        level: 1,
        school: "Conjuration",
        castingTime: "1 Action",
        range: "90 ft",
        aoe: "20 ft Square / Cube",
        duration: "Up to 1 minute (Concentration)",
        components: "V, S",
        saveOrAttack: "STR Save DC",
        concentration: true,
        ritual: false,
        description: "Grasping weeds and vines sprout from the ground in a 20-foot square starting from a point within range. For the duration, these plants turn the ground in the area into difficult terrain. A creature in the area when you cast the spell must succeed on a Strength saving throw or be restrained by the entangling plants."
    },
    web: {
        id: "web",
        name: "Web",
        level: 2,
        school: "Conjuration",
        castingTime: "1 Action",
        range: "60 ft",
        aoe: "20 ft Cube",
        duration: "Up to 1 hour (Concentration)",
        components: "V, S, M (a bit of spiderweb)",
        saveOrAttack: "DEX Save DC",
        concentration: true,
        ritual: false,
        description: "You conjure a mass of thick, sticky webbing at a point of your choice within range. The webs fill a 20-foot cube from that point for the duration. The webs are difficult terrain and lightly obscure their area. Each creature that starts its turn in the webs or enters them must make a Dexterity saving throw or be restrained."
    },
    cone_of_cold: {
        id: "cone_of_cold",
        name: "Cone of Cold",
        level: 5,
        school: "Evocation",
        castingTime: "1 Action",
        range: "Self (60 ft cone)",
        aoe: "60 ft Cone",
        duration: "Instantaneous",
        components: "V, S, M (a small crystal or glass cone)",
        saveOrAttack: "CON Save DC",
        damage: "8d8 Cold",
        concentration: false,
        ritual: false,
        description: "A blast of cold air erupts from your hands. Each creature in a 60-foot cone must make a Constitution saving throw. A creature takes 8d8 cold damage on a failed save, or half as much on a successful one. A creature killed by this spell becomes a frozen statue until it thaws.",
        higherLevels: "When cast using a spell slot of 6th level or higher, the damage increases by 1d8 for each slot level above 5th."
    },
    cure_wounds: {
        id: "cure_wounds",
        name: "Cure Wounds",
        level: 1,
        school: "Evocation",
        castingTime: "1 Action",
        range: "Touch (5 ft)",
        duration: "Instantaneous",
        components: "V, S",
        saveOrAttack: "None (Healing)",
        damage: "1d8 + Spellcasting Mod HP",
        concentration: false,
        ritual: false,
        description: "A creature you touch regains a number of hit points equal to 1d8 + your spellcasting ability modifier. This spell has no effect on undead or constructs.",
        higherLevels: "When cast using a spell slot of 2nd level or higher, the healing increases by 1d8 for each slot level above 1st."
    },
    scorching_ray: {
        id: "scorching_ray",
        name: "Scorching Ray",
        level: 2,
        school: "Evocation",
        castingTime: "1 Action",
        range: "120 ft",
        duration: "Instantaneous",
        components: "V, S",
        saveOrAttack: "Ranged Spell Attack",
        damage: "2d6 Fire per ray (3 rays)",
        concentration: false,
        ritual: false,
        description: "You create three rays of fire and hurl them at targets within range. You can hurl them at one target or several. Make a ranged spell attack for each ray. On a hit, the target takes 2d6 fire damage.",
        higherLevels: "When cast using a spell slot of 3rd level or higher, you create one additional ray for each slot level above 2nd."
    },
    magic_missiles: {
        id: "magic_missiles",
        name: "Magic Missile",
        level: 1,
        school: "Evocation",
        castingTime: "1 Action",
        range: "120 ft",
        duration: "Instantaneous",
        components: "V, S",
        saveOrAttack: "Automatic Hit",
        damage: "1d4 + 1 Force per dart (3 darts)",
        concentration: false,
        ritual: false,
        description: "You create three glowing darts of magical force. Each dart hits a creature of your choice that you can see within range. A dart deals 1d4 + 1 force damage to its target. The darts all strike simultaneously, and you can direct them to hit one creature or several.",
        higherLevels: "When cast using a spell slot of 2nd level or higher, the spell creates one more dart for each slot level above 1st."
    },
    guiding_bolt: {
        id: "guiding_bolt",
        name: "Guiding Bolt",
        level: 1,
        school: "Evocation",
        castingTime: "1 Action",
        range: "120 ft",
        duration: "1 round",
        components: "V, S",
        saveOrAttack: "Ranged Spell Attack",
        damage: "4d6 Radiant",
        concentration: false,
        ritual: false,
        description: "A flash of light streaks toward a creature of your choice within range. Make a ranged spell attack against the target. On a hit, the target takes 4d6 radiant damage, and the next attack roll made against this target before the end of your next turn has advantage.",
        higherLevels: "When cast using a spell slot of 2nd level or higher, the damage increases by 1d6 for each slot level above 1st.",
        canUpcast: true
    },
    shield: {
        id: "shield",
        name: "Shield",
        level: 1,
        school: "Abjuration",
        castingTime: "1 Reaction",
        range: "Self",
        duration: "1 round",
        components: "V, S",
        saveOrAttack: "None",
        concentration: false,
        ritual: false,
        description: "An invisible barrier of magical force appears and protects you. Until the start of your next turn, you have a +5 bonus to AC, including against the triggering attack, and you take no damage from magic missile.",
        canUpcast: false
    },
    shield_of_faith: {
        id: "shield_of_faith",
        name: "Shield of Faith",
        level: 1,
        school: "Abjuration",
        castingTime: "1 Bonus Action",
        range: "60 ft",
        duration: "Up to 10 minutes (Concentration)",
        components: "V, S, M (a small parchment with a bit of holy text)",
        saveOrAttack: "None",
        concentration: true,
        ritual: false,
        description: "A shimmering field appears and surrounds a creature of your choice within range, granting it a +2 bonus to AC for the duration.",
        canUpcast: false
    },
    bless: {
        id: "bless",
        name: "Bless",
        level: 1,
        school: "Enchantment",
        castingTime: "1 Action",
        range: "30 ft",
        duration: "Up to 1 minute (Concentration)",
        components: "V, S, M (a sprinkling of holy water)",
        saveOrAttack: "None (Buff)",
        concentration: true,
        ritual: false,
        description: "You bless up to three creatures of your choice within range. Whenever a target makes an attack roll or a saving throw before the spell ends, the target can roll a d4 and add the number rolled to the attack roll or saving throw.",
        higherLevels: "When cast using a spell slot of 2nd level or higher, you can target one additional creature for each slot level above 1st.",
        canUpcast: true
    },
    hold_person: {
        id: "hold_person",
        name: "Hold Person",
        level: 2,
        school: "Enchantment",
        castingTime: "1 Action",
        range: "60 ft",
        duration: "Up to 1 minute (Concentration)",
        components: "V, S, M (a small, straight piece of iron)",
        saveOrAttack: "WIS Save DC",
        concentration: true,
        ritual: false,
        description: "Choose a humanoid that you can see within range. The target must succeed on a Wisdom saving throw or be paralyzed for the duration. At the end of each of its turns, the target can make another Wisdom saving throw. On a success, the spell ends on the target.",
        higherLevels: "When cast using a spell slot of 3rd level or higher, you can target one additional humanoid for each slot level above 2nd.",
        canUpcast: true
    },
    spiritual_weapon: {
        id: "spiritual_weapon",
        name: "Spiritual Weapon",
        level: 2,
        school: "Evocation",
        castingTime: "1 Bonus Action",
        range: "60 ft",
        duration: "1 minute",
        components: "V, S",
        saveOrAttack: "Melee Spell Attack",
        damage: "1d8 + Spellcasting Mod Force",
        concentration: false,
        ritual: false,
        description: "You create a floating, spectral weapon within range that lasts for the duration or until you cast this spell again. When you cast the spell, you can make a melee spell attack against a creature within 5 feet of the weapon. On a hit, the target takes force damage equal to 1d8 + your spellcasting ability modifier.",
        higherLevels: "When cast using a spell slot of 3rd level or higher, the damage increases by 1d8 for every two slot levels above 2nd.",
        canUpcast: true
    },
    call_lightning: {
        id: "call_lightning",
        name: "Call Lightning",
        level: 3,
        school: "Conjuration",
        castingTime: "1 Action",
        range: "120 ft",
        aoe: "60 ft radius Cloud (5 ft bolt)",
        duration: "Up to 10 minutes (Concentration)",
        components: "V, S",
        saveOrAttack: "DEX Save DC",
        damage: "3d10 Lightning",
        concentration: true,
        ritual: false,
        description: "A storm cloud appears in the shape of a cylinder that is 60 feet across and 10 feet tall, centered on a point within range. When you cast the spell, choose a point under the cloud. A bolt of lightning flashes down from the cloud to that point. Each creature within 5 feet of that point must make a Dexterity saving throw. A creature takes 3d10 lightning damage on a failed save, or half as much on a successful one.",
        higherLevels: "When cast using a spell slot of 4th level or higher, the damage increases by 1d10 for each slot level above 3rd.",
        canUpcast: true
    },
    spirit_guardians: {
        id: "spirit_guardians",
        name: "Spirit Guardians",
        level: 3,
        school: "Conjuration",
        castingTime: "1 Action",
        range: "Self (15 ft radius)",
        aoe: "15 ft radius Emanation",
        duration: "Up to 10 minutes (Concentration)",
        components: "V, S, M (a holy symbol)",
        saveOrAttack: "WIS Save DC",
        damage: "3d8 Radiant or Necrotic",
        concentration: true,
        ritual: false,
        description: "You call forth spirits to protect you. They flit around you to a distance of 15 feet for the duration. An affected creature's speed is halved in the area, and when the creature enters the area for the first time on a turn or starts its turn there, it must make a Wisdom saving throw. On a failed save, the creature takes 3d8 radiant damage (if you are good or neutral) or 3d8 necrotic damage (if you are evil).",
        higherLevels: "When cast using a spell slot of 4th level or higher, the damage increases by 1d8 for each slot level above 3rd.",
        canUpcast: true
    },
    cloud_of_daggers: {
        id: "cloud_of_daggers",
        name: "Cloud of Daggers",
        level: 2,
        school: "Conjuration",
        castingTime: "1 Action",
        range: "60 ft",
        aoe: "5 ft Cube",
        duration: "Up to 1 minute (Concentration)",
        components: "V, S, M (a sliver of glass)",
        saveOrAttack: "Automatic Hit",
        damage: "4d4 Slashing",
        concentration: true,
        ritual: false,
        description: "You fill the air with spinning daggers in a cube 5 feet on each side, centered on a point you choose within range. A creature takes 4d4 slashing damage when it enters the spell's area for the first time on a turn or starts its turn there.",
        higherLevels: "When cast using a spell slot of 3rd level or higher, the damage increases by 2d4 for each slot level above 2nd.",
        canUpcast: true
    },
    moonbeam: {
        id: "moonbeam",
        name: "Moonbeam",
        level: 2,
        school: "Evocation",
        castingTime: "1 Action",
        range: "120 ft",
        aoe: "5 ft radius Cylinder",
        duration: "Up to 1 minute (Concentration)",
        components: "V, S, M (several seeds of any moonseed plant and a piece of opalescent feldspar)",
        saveOrAttack: "CON Save DC",
        damage: "2d10 Radiant",
        concentration: true,
        ritual: false,
        description: "A silvery beam of pale light shines down in a 5-foot-radius, 40-foot-high cylinder centered on a point within range. When a creature enters the spell's area for the first time on a turn or starts its turn there, it is engulfed in ghostly flames that cause searing pain, and it must make a Constitution saving throw. It takes 2d10 radiant damage on a failed save, or half as much on a successful one.",
        higherLevels: "When cast using a spell slot of 3rd level or higher, the damage increases by 1d10 for each slot level above 2nd.",
        canUpcast: true
    },
    banishment: {
        id: "banishment",
        name: "Banishment",
        level: 4,
        school: "Abjuration",
        castingTime: "1 Action",
        range: "60 ft",
        duration: "Up to 1 minute (Concentration)",
        components: "V, S, M (an item distasteful to the target)",
        saveOrAttack: "CHA Save DC",
        concentration: true,
        ritual: false,
        description: "You attempt to send one creature that you can see within range to another plane of existence. The target must succeed on a Charisma saving throw or be banished.",
        higherLevels: "When cast using a spell slot of 5th level or higher, you can target one additional creature for each slot level above 4th.",
        canUpcast: true
    },
    wall_of_fire: {
        id: "wall_of_fire",
        name: "Wall of Fire",
        level: 4,
        school: "Evocation",
        castingTime: "1 Action",
        range: "120 ft",
        aoe: "60 ft Line or 20 ft radius Ring",
        duration: "Up to 1 minute (Concentration)",
        components: "V, S, M (a small piece of phosphorus)",
        saveOrAttack: "DEX Save DC",
        damage: "5d8 Fire",
        concentration: true,
        ritual: false,
        description: "You create a wall of fire on a solid surface within range. You can make the wall up to 60 feet long, 20 feet high, and 1 foot thick, or a ringed wall up to 20 feet in diameter, 20 feet high, and 1 foot thick. One side of the wall, selected by you when you cast this spell, deals 5d8 fire damage to each creature within 10 feet of that side.",
        higherLevels: "When cast using a spell slot of 5th level or higher, the damage increases by 1d8 for each slot level above 4th.",
        canUpcast: true
    },
    disintegrate: {
        id: "disintegrate",
        name: "Disintegrate",
        level: 6,
        school: "Transmutation",
        castingTime: "1 Action",
        range: "60 ft",
        duration: "Instantaneous",
        components: "V, S, M (a lodestone and a pinch of dust)",
        saveOrAttack: "DEX Save DC",
        damage: "10d6 + 40 Force",
        concentration: false,
        ritual: false,
        description: "A thin green ray springs from your pointing finger to a target that you can see within range. The target can be a creature, an object, or a creation of magical force. A creature targeted by this spell must make a Dexterity saving throw. On a failed save, the target takes 10d6 + 40 force damage. The target is disintegrated if this damage leaves it with 0 hit points.",
        higherLevels: "When cast using a spell slot of 7th level or higher, the damage increases by 3d6 for each slot level above 6th.",
        canUpcast: true
    },
    divine_smite: {
        id: "divine_smite",
        name: "Divine Smite",
        level: 1,
        school: "Evocation",
        castingTime: "Hit Reaction",
        range: "Melee",
        duration: "Instantaneous",
        components: "None",
        saveOrAttack: "Melee Weapon Attack",
        damage: "2d8 Radiant",
        concentration: false,
        ritual: false,
        description: "When you hit a creature with a melee weapon attack, you can expend one spell slot to deal radiant damage to the target, in addition to the weapon's damage. The extra damage is 2d8 for a 1st-level spell slot, plus 1d8 for each spell level higher than 1st, to a maximum of 5d8. The damage increases by 1d8 if the target is an undead or a fiend.",
        higherLevels: "Expending a spell slot of 2nd level or higher increases the radiant damage by 1d8 for each slot level above 1st, up to 5d8.",
        canUpcast: true
    },
    witch_bolt: {
        id: "witch_bolt",
        name: "Witch Bolt",
        level: 1,
        school: "Evocation",
        castingTime: "1 Action",
        range: "30 ft",
        duration: "Up to 1 minute (Concentration)",
        components: "V, S, M (a twig from a tree that has been struck by lightning)",
        saveOrAttack: "Ranged Spell Attack",
        damage: "1d12 Lightning",
        concentration: true,
        ritual: false,
        description: "A beam of crackling blue energy lances out toward a creature within range, forming a sustained arc of lightning between you and the target. Make a ranged spell attack against that creature. On a hit, the target takes 1d12 lightning damage, and on each of your turns for the duration, you can use your action to deal 1d12 lightning damage to the target automatically.",
        higherLevels: "When cast using a spell slot of 2nd level or higher, the initial damage increases by 1d12 for each slot level above 1st.",
        canUpcast: true
    },
    sleep: {
        id: "sleep",
        name: "Sleep",
        level: 1,
        school: "Enchantment",
        castingTime: "1 Action",
        range: "90 ft",
        aoe: "20 ft radius Sphere",
        duration: "1 minute",
        components: "V, S, M (a pinch of fine sand, sweet rose petals, or a cricket)",
        saveOrAttack: "None (HP Pool)",
        damage: "5d8 HP pool",
        concentration: false,
        ritual: false,
        description: "This spell sends creatures into a magical slumber. Roll 5d8; the total is how many hit points of creatures this spell can affect. Creatures within 20 feet of a point you choose within range are affected in ascending order of their current hit points.",
        higherLevels: "When cast using a spell slot of 2nd level or higher, roll an additional 2d8 for each slot level above 1st.",
        canUpcast: true
    },
    fog_cloud: {
        id: "fog_cloud",
        name: "Fog Cloud",
        level: 1,
        school: "Conjuration",
        castingTime: "1 Action",
        range: "120 ft",
        aoe: "20 ft radius Sphere",
        duration: "Up to 1 hour (Concentration)",
        components: "V, S",
        saveOrAttack: "None (Obscured)",
        concentration: true,
        ritual: false,
        description: "You create a 20-foot-radius sphere of fog centered on a point within range. The sphere spreads around corners, and its area is heavily obscured. It lasts for the duration or until a wind of moderate or greater speed (at least 10 miles per hour) disperses it.",
        higherLevels: "When cast using a spell slot of 2nd level or higher, the sphere's radius increases by 20 feet for each slot level above 1st.",
        canUpcast: true
    },
    ice_knife: {
        id: "ice_knife",
        name: "Ice Knife",
        level: 1,
        school: "Conjuration",
        castingTime: "1 Action",
        range: "60 ft",
        aoe: "5 ft radius Burst",
        duration: "Instantaneous",
        components: "S, M (a drop of water or piece of ice)",
        saveOrAttack: "Ranged Spell Attack + DEX Save",
        damage: "1d10 Piercing + 2d6 Cold",
        concentration: false,
        ritual: false,
        description: "You create a shard of ice and fling it at one creature within range. Make a ranged spell attack against the target. On a hit, the target takes 1d10 piercing damage. Hit or miss, the shard then explodes. The target and each creature within 5 feet of the point where the ice exploded must succeed on a Dexterity saving throw or take 2d6 cold damage.",
        higherLevels: "When cast using a spell slot of 2nd level or higher, the cold damage increases by 1d6 for each slot level above 1st.",
        canUpcast: true
    },
    hex: {
        id: "hex",
        name: "Hex",
        level: 1,
        school: "Enchantment",
        castingTime: "1 Bonus Action",
        range: "90 ft",
        duration: "Up to 1 hour (Concentration)",
        components: "V, S, M (the petrified eye of a newt)",
        saveOrAttack: "None (Debuff)",
        damage: "1d6 Necrotic on hit",
        concentration: true,
        ritual: false,
        description: "You place a curse on a creature that you can see within range. Until the spell ends, you deal an extra 1d6 necrotic damage to the target whenever you hit it with an attack. Also, choose one ability when you cast the spell. The target has disadvantage on ability checks made with the chosen ability.",
        higherLevels: "When cast using a spell slot of 3rd or 4th level, concentration lasts up to 8 hours. At 5th level or higher, concentration lasts up to 24 hours.",
        canUpcast: true
    },
    hunters_mark: {
        id: "hunters_mark",
        name: "Hunter's Mark",
        level: 1,
        school: "Divination",
        castingTime: "1 Bonus Action",
        range: "90 ft",
        duration: "Up to 1 hour (Concentration)",
        components: "V",
        saveOrAttack: "None (Debuff)",
        damage: "1d6 Weapon damage on hit",
        concentration: true,
        ritual: false,
        description: "You choose a creature you can see within range and mystically mark it as your quarry. Until the spell ends, you deal an extra 1d6 damage to the target whenever you hit it with a weapon attack, and you have advantage on any Wisdom (Perception) or Wisdom (Survival) check you make to find it.",
        higherLevels: "When cast using a spell slot of 3rd or 4th level, concentration lasts up to 8 hours. At 5th level or higher, concentration lasts up to 24 hours.",
        canUpcast: true
    },
    chain_lightning: {
        id: "chain_lightning",
        name: "Chain Lightning",
        level: 6,
        school: "Evocation",
        castingTime: "1 Action",
        range: "150 ft",
        duration: "Instantaneous",
        components: "V, S, M (a bit of fur; a piece of amber, glass, or a crystal rod; and three silver pins)",
        saveOrAttack: "DEX Save DC",
        damage: "10d8 Lightning",
        concentration: false,
        ritual: false,
        description: "You create a bolt of lightning that arcs toward a target of your choice that you can see within range. Three bolts then leap from that target to as many as three other targets, each of which must be within 30 feet of the first target. A target takes 10d8 lightning damage on a failed save, or half as much on a successful one.",
        higherLevels: "When cast using a spell slot of 7th level or higher, one additional bolt leaps from the first target to another target for each slot level above 6th.",
        canUpcast: true
    },
    cloudkill: {
        id: "cloudkill",
        name: "Cloudkill",
        level: 5,
        school: "Conjuration",
        castingTime: "1 Action",
        range: "120 ft",
        aoe: "20 ft radius Sphere",
        duration: "Up to 10 minutes (Concentration)",
        components: "V, S",
        saveOrAttack: "CON Save DC",
        damage: "5d8 Poison",
        concentration: true,
        ritual: false,
        description: "You create a 20-foot-radius sphere of poisonous, yellow-green fog centered on a point you choose within range. The fog spreads around corners. It lasts for the duration or until a strong wind disperses the fog. When a creature enters the spell's area for the first time on a turn or starts its turn there, that creature must make a Constitution saving throw. The creature takes 5d8 poison damage on a failed save, or half as much on a successful one.",
        higherLevels: "When cast using a spell slot of 6th level or higher, the damage increases by 1d8 for each slot level above 5th.",
        canUpcast: true
    }
};

/**
 * Set of all spell IDs in D&D 5e / BG3 that scale with higher spell slots or can be upcast.
 */
export const UPCASTABLE_SPELLS = new Set<string>([
    // Level 1
    "arms_of_hadar",
    "bless",
    "burning_hands",
    "cure_wounds",
    "divine_smite",
    "fog_cloud",
    "guiding_bolt",
    "hex",
    "hunters_mark",
    "ice_knife",
    "magic_missiles",
    "sleep",
    "thunderwave",
    "witch_bolt",

    // Level 2
    "cloud_of_daggers",
    "flaming_sphere",
    "hold_person",
    "moonbeam",
    "scorching_ray",
    "shatter",
    "spiritual_weapon",

    // Level 3
    "call_lightning",
    "fireball",
    "lightning_bolt",
    "spirit_guardians",
    "thunder_step",

    // Level 4
    "banishment",
    "wall_of_fire",

    // Level 5
    "arcane_hand",
    "cloudkill",
    "cone_of_cold",

    // Level 6
    "chain_lightning",
    "disintegrate"
]);

/**
 * Checks whether a spell can be upcast or cast using alternative spell slots.
 * Returns false for Cantrips (Level 0) and spells without higher-slot scaling (e.g. Misty Step, Shield, Darkness).
 */
export function isSpellUpcastable(spellID: string, meta?: SpellMetadata): boolean {
    const key = spellID.toLowerCase().replace(/[^a-z0-9_]/g, "");
    
    // Check known upcastable list
    for (const id of UPCASTABLE_SPELLS) {
        if (key.includes(id) || id.includes(key)) {
            return true;
        }
    }

    const m = meta || getSpellMetadata(spellID);
    if (m.level === 0) return false;
    if (m.canUpcast !== undefined) return m.canUpcast;

    if (m.higherLevels) {
        const text = m.higherLevels.toLowerCase();
        return text.includes("slot level") || text.includes("spell slot of");
    }

    return false;
}

const dynamicSpellRegistry = new Map<string, SpellMetadata>();

/**
 * Registers dynamically loaded spell metadata (e.g. from D&D Beyond character sync).
 */
export function registerDynamicSpell(meta: SpellMetadata): void {
    const key = meta.id.toLowerCase().replace(/[^a-z0-9_]/g, "");
    dynamicSpellRegistry.set(key, meta);
    const nameKey = meta.name.toLowerCase().replace(/[^a-z0-9_]/g, "");
    dynamicSpellRegistry.set(nameKey, meta);
}

/**
 * Registers a list of dynamically loaded spell metadata.
 */
export function registerDynamicSpells(metas: SpellMetadata[]): void {
    for (const m of metas) {
        registerDynamicSpell(m);
    }
}

/**
 * Resolves spell metadata by ID or fallback to standard values.
 * Dynamically resolves from D&D Beyond character sync, dynamic registry, or built-in library.
 */
export function getSpellMetadata(spellID: string, spellName?: string): SpellMetadata {
    const key = spellID.toLowerCase().replace(/[^a-z0-9_]/g, "");
    const nameKey = spellName ? spellName.toLowerCase().replace(/[^a-z0-9_]/g, "") : "";

    // 1. Single Source of Truth: Manual Formula Catalog (569+ verified spells)
    const manual = ALL_MANUAL_OVERRIDES[spellID] ?? ALL_MANUAL_OVERRIDES[key] ?? (nameKey ? ALL_MANUAL_OVERRIDES[nameKey] : undefined);
    if (manual) {
        const schoolFormatted = (manual.category.school.charAt(0).toUpperCase() + manual.category.school.slice(1)) as SpellMetadata["school"];
        const baseDmg = manual.damage.find(d => d.isBase);
        const damageFormatted = baseDmg ? `${baseDmg.dice} ${baseDmg.type.charAt(0).toUpperCase() + baseDmg.type.slice(1)}` : undefined;
        let saveOrAttack: string | undefined = undefined;
        if (manual.interaction?.type === "save") {
            saveOrAttack = `${manual.interaction.saveAbility ?? "DEX"} Save DC`;
        } else if (manual.interaction?.type === "spell_attack" || manual.interaction?.type === "melee_spell_attack") {
            saveOrAttack = "Spell Attack";
        }
        const aoeFormatted = manual.area ? `${manual.area.sizeFeet} ft ${manual.area.shape}` : undefined;

        return {
            id: manual.id,
            name: manual.name,
            level: manual.category.level,
            school: schoolFormatted,
            castingTime: manual.casting.time,
            range: manual.casting.range,
            aoe: aoeFormatted,
            duration: manual.casting.duration,
            components: manual.casting.components,
            saveOrAttack,
            damage: damageFormatted,
            concentration: manual.category.concentration,
            ritual: manual.category.ritual,
            description: manual.notes || manual.effectNotes?.join(" ") || `Sparks and arcane energies concentrate at your command, creating a magical effect on the target.`,
            higherLevels: manual.upcasting?.notes,
            canUpcast: Boolean(manual.upcasting),
        };
    }

    // 2. Direct match in built-in SPELL_INFO_MAP
    if (SPELL_INFO_MAP[spellID]) {
        return SPELL_INFO_MAP[spellID];
    }
    for (const [id, meta] of Object.entries(SPELL_INFO_MAP)) {
        if (key === id || (key.length >= 4 && (key.includes(id) || id.includes(key)))) {
            return meta;
        }
    }

    // 2. Check dynamic in-memory registry
    if (dynamicSpellRegistry.has(key)) {
        return dynamicSpellRegistry.get(key)!;
    }
    if (nameKey && dynamicSpellRegistry.has(nameKey)) {
        return dynamicSpellRegistry.get(nameKey)!;
    }

    // 3. Dynamic lookup from cached D&D Beyond characters in localStorage
    if (typeof window !== "undefined" && window.localStorage) {
        try {
            for (let i = 0; i < localStorage.length; i++) {
                const storageKey = localStorage.key(i);
                if (storageKey && (storageKey.includes("ddb-cache") || storageKey.startsWith("ddb_char_"))) {
                    const raw = localStorage.getItem(storageKey);
                    if (raw) {
                        const char = JSON.parse(raw);
                        if (char && Array.isArray(char.spells)) {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const found = char.spells.find((s: any) => {
                                if (!s) return false;
                                const sKey = (s.id || "").toLowerCase().replace(/[^a-z0-9_]/g, "");
                                const sNameKey = (s.name || "").toLowerCase().replace(/[^a-z0-9_]/g, "");
                                return s.id === spellID
                                    || sKey === key
                                    || (nameKey && sNameKey === nameKey)
                                    || sNameKey === key
                                    || (key.length >= 4 && (sKey.includes(key) || key.includes(sKey)));
                            });
                            if (found) {
                                const meta: SpellMetadata = {
                                    id: found.id,
                                    name: found.name,
                                    level: typeof found.level === "number" ? found.level : 0,
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    school: (found.school as any) || "Evocation",
                                    castingTime: found.castingTime || "1 Action",
                                    range: found.rangeText || (found.range ? `${found.range} ft` : "Self"),
                                    aoe: found.aoe ? `${found.aoe.size} ft ${found.aoe.shape}` : undefined,
                                    duration: found.duration || "Instantaneous",
                                    components: found.components || "V, S",
                                    concentration: Boolean(found.concentration),
                                    ritual: Boolean(found.ritual),
                                    damage: found.damage,
                                    saveOrAttack: found.saveOrAttack,
                                    description: found.description || "",
                                    higherLevels: found.higherLevels,
                                    canUpcast: found.canUpcast
                                };
                                registerDynamicSpell(meta);
                                return meta;
                            }
                        }
                    }
                }
            }
        } catch {
            // LocalStorage errors ignored
        }
    }

    return {
        id: spellID,
        name: spellName || spellID.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
        level: 1,
        school: "Evocation",
        castingTime: "1 Action",
        range: "60 ft",
        duration: "Instantaneous",
        components: "V, S",
        concentration: false,
        ritual: false,
        description: `Sparks and arcane energies concentrate at your command, creating a magical effect on the target.`
    };
}

/**
 * Returns color, gradient, and emoji for a school of magic.
 */
export function getSchoolStyle(school?: string): { emoji: string; gradient: string; color: string; schoolKey: string; iconUrl: string } {
    const s = school?.toLowerCase() || "";
    if (s.includes("evoc")) {
        return { emoji: "🔥", gradient: "linear-gradient(135deg, #7f1d1d 0%, #1e1b4b 100%)", color: "#f87171", schoolKey: "evocation", iconUrl: "https://media.dndbeyond.com/media/spell-school-icons/evocation.svg" };
    }
    if (s.includes("necro")) {
        return { emoji: "💀", gradient: "linear-gradient(135deg, #3b0764 0%, #09090b 100%)", color: "#c084fc", schoolKey: "necromancy", iconUrl: "https://media.dndbeyond.com/media/spell-school-icons/necromancy.svg" };
    }
    if (s.includes("abjur")) {
        return { emoji: "🛡️", gradient: "linear-gradient(135deg, #064e3b 0%, #0f172a 100%)", color: "#34d399", schoolKey: "abjuration", iconUrl: "https://media.dndbeyond.com/media/spell-school-icons/abjuration.svg" };
    }
    if (s.includes("conjur")) {
        return { emoji: "🌀", gradient: "linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)", color: "#60a5fa", schoolKey: "conjuration", iconUrl: "https://media.dndbeyond.com/media/spell-school-icons/conjuration.svg" };
    }
    if (s.includes("trans")) {
        return { emoji: "⚡", gradient: "linear-gradient(135deg, #78350f 0%, #1c1917 100%)", color: "#fbbf24", schoolKey: "transmutation", iconUrl: "https://media.dndbeyond.com/media/spell-school-icons/transmutation.svg" };
    }
    if (s.includes("enchant")) {
        return { emoji: "✨", gradient: "linear-gradient(135deg, #831843 0%, #2e1065 100%)", color: "#f472b6", schoolKey: "enchantment", iconUrl: "https://media.dndbeyond.com/media/spell-school-icons/enchantment.svg" };
    }
    if (s.includes("illus")) {
        return { emoji: "🎭", gradient: "linear-gradient(135deg, #0e7490 0%, #1e1b4b 100%)", color: "#22d3ee", schoolKey: "illusion", iconUrl: "https://media.dndbeyond.com/media/spell-school-icons/illusion.svg" };
    }
    if (s.includes("divin")) {
        return { emoji: "👁️", gradient: "linear-gradient(135deg, #4338ca 0%, #1e1b4b 100%)", color: "#a5b4fc", schoolKey: "divination", iconUrl: "https://media.dndbeyond.com/media/spell-school-icons/divination.svg" };
    }
    return { emoji: "✨", gradient: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)", color: "#fef08a", schoolKey: "evocation", iconUrl: "https://media.dndbeyond.com/media/spell-school-icons/evocation.svg" };
}

/**
 * Returns a 2-character abbreviation for a spell name (e.g. Eldritch Blast -> EB, Fireball -> FB).
 */
export function getSpellInitials(name: string): string {
    const words = name.replace(/[^a-zA-Z0-9\s]/g, "").trim().split(/\s+/);
    if (words.length >= 2) {
        return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
}

/**
 * Formats a number to ordinal representation (1st, 2nd, 3rd, 4th, etc.)
 */
export function getOrdinal(n: number): string {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export interface ScaledSpellStats {
    level: number;
    damage?: string;
    description?: string;
    extraNote?: string;
}

/**
 * Calculates scaled spell statistics (damage, darts/rays, targets, radius) when cast at an upcast level.
 */
export function getScaledSpellStats(spellID: string, castLevel: number, meta?: SpellMetadata): ScaledSpellStats {
    const m = meta || getSpellMetadata(spellID);
    const baseLevel = m.level;
    if (castLevel <= baseLevel || !m.damage) {
        return {
            level: castLevel,
            damage: m.damage,
            description: m.description
        };
    }

    const diff = castLevel - baseLevel;
    const key = spellID.toLowerCase().replace(/[^a-z0-9_]/g, "");

    // Specific spell custom scaling rules
    if (key.includes("burning_hands")) {
        return { level: castLevel, damage: `${3 + diff}d6 Fire` };
    }
    if (key.includes("fireball")) {
        return { level: castLevel, damage: `${8 + diff}d6 Fire` };
    }
    if (key.includes("lightning_bolt")) {
        return { level: castLevel, damage: `${8 + diff}d6 Lightning` };
    }
    if (key.includes("thunderwave")) {
        return { level: castLevel, damage: `${2 + diff}d8 Thunder` };
    }
    if (key.includes("cure_wounds")) {
        return { level: castLevel, damage: `${1 + diff}d8 + Spellcasting Mod HP` };
    }
    if (key.includes("guiding_bolt")) {
        return { level: castLevel, damage: `${4 + diff}d6 Radiant` };
    }
    if (key.includes("magic_missile")) {
        return {
            level: castLevel,
            damage: `1d4 + 1 Force per dart (${3 + diff} darts)`,
            extraNote: `${3 + diff} glowing darts created`
        };
    }
    if (key.includes("scorching_ray")) {
        return {
            level: castLevel,
            damage: `2d6 Fire per ray (${3 + diff} rays)`,
            extraNote: `${3 + diff} fiery rays hurled`
        };
    }
    if (key.includes("shatter")) {
        return { level: castLevel, damage: `${3 + diff}d8 Thunder` };
    }
    if (key.includes("cone_of_cold")) {
        return { level: castLevel, damage: `${8 + diff}d8 Cold` };
    }
    if (key.includes("cloud_of_daggers")) {
        return { level: castLevel, damage: `${4 + diff * 2}d4 Slashing` };
    }
    if (key.includes("moonbeam")) {
        return { level: castLevel, damage: `${2 + diff}d10 Radiant` };
    }
    if (key.includes("call_lightning")) {
        return { level: castLevel, damage: `${3 + diff}d10 Lightning` };
    }
    if (key.includes("spirit_guardians")) {
        return { level: castLevel, damage: `${3 + diff}d8 Radiant or Necrotic` };
    }
    if (key.includes("spiritual_weapon")) {
        const bonus = Math.floor(diff / 2);
        return { level: castLevel, damage: `${1 + bonus}d8 + Spellcasting Mod Force` };
    }
    if (key.includes("wall_of_fire")) {
        return { level: castLevel, damage: `${5 + diff}d8 Fire` };
    }
    if (key.includes("disintegrate")) {
        return { level: castLevel, damage: `${10 + diff * 3}d6 + 40 Force` };
    }
    if (key.includes("divine_smite")) {
        const smiteDice = Math.min(5, 2 + diff);
        return { level: castLevel, damage: `${smiteDice}d8 Radiant` };
    }
    if (key.includes("sleep")) {
        return { level: castLevel, damage: `${5 + diff * 2}d8 HP pool` };
    }
    if (key.includes("ice_knife")) {
        return { level: castLevel, damage: `1d10 Piercing + ${2 + diff}d6 Cold` };
    }

    // Generic dice count increment regex: e.g. "3d6 Fire" -> "4d6 Fire"
    const match = m.damage.match(/^(\d+)(d\d+)(.*)$/);
    if (match) {
        const baseDice = parseInt(match[1], 10);
        const diceType = match[2];
        const rest = match[3];
        return {
            level: castLevel,
            damage: `${baseDice + diff}${diceType}${rest}`
        };
    }

    return {
        level: castLevel,
        damage: m.damage
    };
}
