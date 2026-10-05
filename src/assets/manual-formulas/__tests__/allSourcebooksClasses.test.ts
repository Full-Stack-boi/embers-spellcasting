import { describe, it, expect } from "vitest";
import {
    CLASS_MANUAL_FORMULAS,
    ALL_MANUAL_ACTION_FORMULAS,
    BARBARIAN_CLASS_FORMULAS,
    BARD_CLASS_FORMULAS,
    CLERIC_CLASS_FORMULAS,
    DRUID_CLASS_FORMULAS,
    FIGHTER_CLASS_FORMULAS,
    GUNSLINGER_CLASS_FORMULAS,
    MONK_CLASS_FORMULAS,
    PALADIN_CLASS_FORMULAS,
    RANGER_CLASS_FORMULAS,
    ROGUE_CLASS_FORMULAS,
    SORCERER_CLASS_FORMULAS,
    WARLOCK_CLASS_FORMULAS,
    WIZARD_CLASS_FORMULAS,
    MONSTER_HUNTER_CLASS_FORMULAS,
    ARTIFICER_CLASS_FORMULAS,
} from "../classes";

describe("All Sourcebooks Classes and Subclasses Registry", () => {
    it("registers all 15 classes in CLASS_MANUAL_FORMULAS", () => {
        const classKeys = Object.keys(CLASS_MANUAL_FORMULAS);
        expect(classKeys).toEqual([
            "barbarian",
            "bard",
            "cleric",
            "druid",
            "fighter",
            "gunslinger",
            "monk",
            "paladin",
            "ranger",
            "rogue",
            "sorcerer",
            "warlock",
            "wizard",
            "monsterHunter",
            "artificer",
        ]);
    });

    it("aggregates an extensive collection of manual formulas in ALL_MANUAL_ACTION_FORMULAS", () => {
        const totalFormulas = Object.keys(ALL_MANUAL_ACTION_FORMULAS).length;
        // 68 subclasses + base classes features -> over 350 formulas!
        expect(totalFormulas).toBeGreaterThan(350);
    });

    describe("Grim Hollow: Player's Guide", () => {
        it("verifies Monster Hunter base class and 4 Guilds", () => {
            // Base Class
            expect(MONSTER_HUNTER_CLASS_FORMULAS.monsterGrimoire).toBeDefined();
            expect(MONSTER_HUNTER_CLASS_FORMULAS.studiedResponse).toBeDefined();
            expect(MONSTER_HUNTER_CLASS_FORMULAS.studiedResponse.activationType).toBe("reaction");
            expect(MONSTER_HUNTER_CLASS_FORMULAS.expertStrike).toBeDefined();

            // Carver Guild
            expect(MONSTER_HUNTER_CLASS_FORMULAS.closeQuarters).toBeDefined();
            expect(MONSTER_HUNTER_CLASS_FORMULAS.closeQuarters.subclass).toBe("carverGuild");
            expect(MONSTER_HUNTER_CLASS_FORMULAS.trueGrit).toBeDefined();

            // Devourer Guild
            expect(MONSTER_HUNTER_CLASS_FORMULAS.alchemicalGastronomy).toBeDefined();
            expect(MONSTER_HUNTER_CLASS_FORMULAS.transmutingMetabolism).toBeDefined();

            // Occultist Guild
            expect(MONSTER_HUNTER_CLASS_FORMULAS.arcaneInterference).toBeDefined();
            expect(MONSTER_HUNTER_CLASS_FORMULAS.magicalAegis).toBeDefined();

            // Trapper Guild
            expect(MONSTER_HUNTER_CLASS_FORMULAS.trapperGadgets).toBeDefined();
            expect(MONSTER_HUNTER_CLASS_FORMULAS.ambusherSAdvantage).toBeDefined();
        });

        it("verifies Barbarian subclasses (Fractured, Primal Spirit, Wrathful Dead)", () => {
            expect(BARBARIAN_CLASS_FORMULAS.rage).toBeDefined();
            expect(BARBARIAN_CLASS_FORMULAS.recklessAttack).toBeDefined();

            // Path of the Fractured
            expect(BARBARIAN_CLASS_FORMULAS.faceOfRage).toBeDefined();
            expect(BARBARIAN_CLASS_FORMULAS.faceOfRage.subclass).toBe("pathOfTheFractured");
            expect(BARBARIAN_CLASS_FORMULAS.betterHalf).toBeDefined();

            // Path of the Primal Spirit
            expect(BARBARIAN_CLASS_FORMULAS.primalCompanion).toBeDefined();
            expect(BARBARIAN_CLASS_FORMULAS.primalCompanion.subclass).toBe("pathOfThePrimalSpirit");

            // Path of the Wrathful Dead
            expect(BARBARIAN_CLASS_FORMULAS.finalNightCatharsis).toBeDefined();
            expect(BARBARIAN_CLASS_FORMULAS.finalNightCatharsis.subclass).toBe("pathOfTheWrathfulDead");
        });

        it("verifies Rogue subclasses (Highway Rider, Misfortune Bringer, Sanguine Thief)", () => {
            expect(ROGUE_CLASS_FORMULAS.sneakAttack).toBeDefined();
            expect(ROGUE_CLASS_FORMULAS.cunningAction).toBeDefined();

            // Highway Rider
            expect(ROGUE_CLASS_FORMULAS.trustyMount).toBeDefined();
            expect(ROGUE_CLASS_FORMULAS.trustyMount.subclass).toBe("highwayRider");

            // Misfortune Bringer
            expect(ROGUE_CLASS_FORMULAS.evilEye).toBeDefined();
            expect(ROGUE_CLASS_FORMULAS.evilEye.subclass).toBe("misfortuneBringer");

            // Sanguine Thief
            expect(ROGUE_CLASS_FORMULAS.stealBlood).toBeDefined();
            expect(ROGUE_CLASS_FORMULAS.stealBlood.subclass).toBe("sanguineThief");
        });

        it("verifies Warlock subclasses (The Coven, The First Vampire, The Parasite)", () => {
            expect(WARLOCK_CLASS_FORMULAS.eldritchInvocations).toBeDefined();

            // The Coven
            expect(WARLOCK_CLASS_FORMULAS.covenSpells).toBeDefined();
            expect(WARLOCK_CLASS_FORMULAS.covenSpells.subclass).toBe("theCoven");

            // The First Vampire Patron
            expect(WARLOCK_CLASS_FORMULAS.drainLife).toBeDefined();
            expect(WARLOCK_CLASS_FORMULAS.drainLife.subclass).toBe("theFirstVampirePatron");

            // The Parasite Patron
            expect(WARLOCK_CLASS_FORMULAS.spellSiphon).toBeDefined();
            expect(WARLOCK_CLASS_FORMULAS.spellSiphon.subclass).toBe("theParasitePatron");
        });

        it("verifies Druid subclasses (Blood, Entropy, Mutation)", () => {
            expect(DRUID_CLASS_FORMULAS.riteOfTheBloodMoon).toBeDefined();
            expect(DRUID_CLASS_FORMULAS.riteOfTheBloodMoon.subclass).toBe("circleOfBlood");

            expect(DRUID_CLASS_FORMULAS.catastrophicPower).toBeDefined();
            expect(DRUID_CLASS_FORMULAS.catastrophicPower.subclass).toBe("circleOfEntropy");

            expect(DRUID_CLASS_FORMULAS.mutateShape).toBeDefined();
            expect(DRUID_CLASS_FORMULAS.mutateShape.subclass).toBe("circleOfMutation");
        });

        it("verifies Wizard subclasses (Daemonologist, Plague Doctor, Sangromancer)", () => {
            expect(WIZARD_CLASS_FORMULAS.fairAndFoul).toBeDefined();
            expect(WIZARD_CLASS_FORMULAS.fairAndFoul.subclass).toBe("daemonologist");

            expect(WIZARD_CLASS_FORMULAS.potionCraft).toBeDefined();
            expect(WIZARD_CLASS_FORMULAS.potionCraft.subclass).toBe("plagueDoctor");

            expect(WIZARD_CLASS_FORMULAS.sangromancySavant).toBeDefined();
            expect(WIZARD_CLASS_FORMULAS.sangromancySavant.subclass).toBe("sangromancer");
        });
    });

    describe("Arcana Unleashed", () => {
        it("verifies AU Subclasses (Arcana Domain, Arcane Archer, Mystic Arts, Vestige, Conjurer, Enchanter, Necromancer, Transmuter)", () => {
            // Cleric: Arcana Domain
            expect(CLERIC_CLASS_FORMULAS.studentOfArcana).toBeDefined();
            expect(CLERIC_CLASS_FORMULAS.studentOfArcana.subclass).toBe("arcanaDomain");

            // Fighter: Arcane Archer
            expect(FIGHTER_CLASS_FORMULAS.arcaneArcherLore).toBeDefined();
            expect(FIGHTER_CLASS_FORMULAS.arcaneArcherLore.subclass).toBe("arcaneArcher");

            // Monk: Warrior of the Mystic Arts
            expect(MONK_CLASS_FORMULAS.mysticFightingStyle).toBeDefined();
            expect(MONK_CLASS_FORMULAS.mysticFightingStyle.subclass).toBe("warriorOfTheMysticArts");

            // Warlock: Vestige Patron
            expect(WARLOCK_CLASS_FORMULAS.vestigeCompanion).toBeDefined();
            expect(WARLOCK_CLASS_FORMULAS.vestigeCompanion.subclass).toBe("vestigePatron");

            // Wizard: Conjurer, Enchanter, Necromancer, Transmuter
            expect(WIZARD_CLASS_FORMULAS.benignTransposition).toBeDefined();
            expect(WIZARD_CLASS_FORMULAS.benignTransposition.subclass).toBe("conjurer");

            expect(WIZARD_CLASS_FORMULAS.hypnoticPresence).toBeDefined();
            expect(WIZARD_CLASS_FORMULAS.hypnoticPresence.subclass).toBe("enchanter");

            expect(WIZARD_CLASS_FORMULAS.undeadThralls).toBeDefined();
            expect(WIZARD_CLASS_FORMULAS.undeadThralls.subclass).toBe("necromancer");

            expect(WIZARD_CLASS_FORMULAS.transmuterSStone).toBeDefined();
            expect(WIZARD_CLASS_FORMULAS.transmuterSStone.subclass).toBe("transmuter");
        });
    });

    describe("Forgotten Realms: Heroes of Faerûn", () => {
        it("verifies FRHOF Subclasses across classes", () => {
            // Bard: College of the Moon
            expect(BARD_CLASS_FORMULAS.moonSInspiration).toBeDefined();
            expect(BARD_CLASS_FORMULAS.moonSInspiration.subclass).toBe("collegeOfTheMoon");

            // Cleric: Knowledge Domain
            expect(CLERIC_CLASS_FORMULAS.blessingsOfKnowledge).toBeDefined();
            expect(CLERIC_CLASS_FORMULAS.blessingsOfKnowledge.subclass).toBe("knowledgeDomain");

            // Fighter: Banneret
            expect(FIGHTER_CLASS_FORMULAS.rallyingSurge).toBeDefined();
            expect(FIGHTER_CLASS_FORMULAS.rallyingSurge.subclass).toBe("banneret");

            // Paladin: Oath of the Noble Genies
            expect(PALADIN_CLASS_FORMULAS.elementalSmite).toBeDefined();
            expect(PALADIN_CLASS_FORMULAS.elementalSmite.subclass).toBe("oathOfTheNobleGenies");

            // Ranger: Winter Walker
            expect(RANGER_CLASS_FORMULAS.frigidExplorer).toBeDefined();
            expect(RANGER_CLASS_FORMULAS.frigidExplorer.subclass).toBe("winterWalker");

            // Rogue: Scion of the Three
            expect(ROGUE_CLASS_FORMULAS.bloodthirst).toBeDefined();
            expect(ROGUE_CLASS_FORMULAS.bloodthirst.subclass).toBe("scionOfTheThree");

            // Sorcerer: Spellfire Sorcery
            expect(SORCERER_CLASS_FORMULAS.spellfireBurst).toBeDefined();
            expect(SORCERER_CLASS_FORMULAS.spellfireBurst.subclass).toBe("spellfireSorcery");

            // Wizard: Bladesinger
            expect(WIZARD_CLASS_FORMULAS.bladesong).toBeDefined();
            expect(WIZARD_CLASS_FORMULAS.bladesong.subclass).toBe("bladesinger");
        });
    });

    describe("Eberron: Forge of the Artificer", () => {
        it("verifies Artificer base class and all 5 subclasses", () => {
            // Base Class
            expect(ARTIFICER_CLASS_FORMULAS.tinkersMagic).toBeDefined();
            expect(ARTIFICER_CLASS_FORMULAS.flashOfGenius).toBeDefined();
            expect(ARTIFICER_CLASS_FORMULAS.flashOfGenius.activationType).toBe("reaction");

            // Alchemist
            expect(ARTIFICER_CLASS_FORMULAS.experimentalElixir).toBeDefined();
            expect(ARTIFICER_CLASS_FORMULAS.experimentalElixir.subclass).toBe("alchemist");

            // Armorer
            expect(ARTIFICER_CLASS_FORMULAS.arcaneArmor).toBeDefined();
            expect(ARTIFICER_CLASS_FORMULAS.arcaneArmor.subclass).toBe("armorer");

            // Artillerist
            expect(ARTIFICER_CLASS_FORMULAS.eldritchCannon).toBeDefined();
            expect(ARTIFICER_CLASS_FORMULAS.eldritchCannon.subclass).toBe("artillerist");

            // Battle Smith
            expect(ARTIFICER_CLASS_FORMULAS.steelDefender).toBeDefined();
            expect(ARTIFICER_CLASS_FORMULAS.steelDefender.subclass).toBe("battleSmith");

            // Cartographer
            expect(ARTIFICER_CLASS_FORMULAS.adventurerSAtlas).toBeDefined();
            expect(ARTIFICER_CLASS_FORMULAS.adventurerSAtlas.subclass).toBe("cartographer");
        });
    });

    describe("Valda's Spire of Secrets: Player Pack 2", () => {
        it("verifies VSSPP2 Gunslinger, Pistolero, and subclasses", () => {
            expect(GUNSLINGER_CLASS_FORMULAS.riskDice).toBeDefined();
            expect(GUNSLINGER_CLASS_FORMULAS.closeQuartersShooting).toBeDefined();
            expect(GUNSLINGER_CLASS_FORMULAS.fanTheHammer).toBeDefined();
            expect(GUNSLINGER_CLASS_FORMULAS.bulletTime).toBeDefined();

            expect(BARD_CLASS_FORMULAS.personaMasks).toBeDefined();
            expect(CLERIC_CLASS_FORMULAS.chromaticAffinity).toBeDefined();
            expect(DRUID_CLASS_FORMULAS.cityShape).toBeDefined();
            expect(RANGER_CLASS_FORMULAS.bestialAspect).toBeDefined();
            expect(SORCERER_CLASS_FORMULAS.heroicSoul).toBeDefined();
            expect(WIZARD_CLASS_FORMULAS.magicMissileSavant).toBeDefined();
        });
    });
});
