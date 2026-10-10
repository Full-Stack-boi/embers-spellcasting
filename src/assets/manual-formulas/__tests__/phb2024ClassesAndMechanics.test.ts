import { describe, it, expect } from "vitest";
import {
    BARBARIAN_CLASS_FORMULAS,
    BARD_CLASS_FORMULAS,
    CLERIC_CLASS_FORMULAS,
    DRUID_CLASS_FORMULAS,
    FIGHTER_CLASS_FORMULAS,
    MONK_CLASS_FORMULAS,
    PALADIN_CLASS_FORMULAS,
    RANGER_CLASS_FORMULAS,
    ROGUE_CLASS_FORMULAS,
    SORCERER_CLASS_FORMULAS,
    WARLOCK_CLASS_FORMULAS,
    WIZARD_CLASS_FORMULAS,
    ALL_MANUAL_ACTION_FORMULAS,
    findMatchingActionFormula,
    CUNNING_STRIKE_OPTIONS,
    TACTICAL_MIND_OPTIONS,
    DIVINE_SPARK_OPTIONS,
    FOCUS_POINT_OPTIONS,
    LAY_ON_HANDS_OPTIONS
} from "../../manual-formulas";
import { resolveFeatureResource } from "../../../services/classResourceService";
import type { DDBParsedCharacter } from "../../../types/ddb";

describe("PHB 2024 Classes, Subclasses & Mechanics Centralization", () => {
    describe("All 48 PHB 2024 Subclasses Registered", () => {
        it("Barbarian: Berserker, Wild Heart, World Tree, Zealot", () => {
            expect(BARBARIAN_CLASS_FORMULAS.frenzy).toBeDefined(); // Berserker
            expect(BARBARIAN_CLASS_FORMULAS.rageOfTheWilds).toBeDefined(); // Wild Heart
            expect(BARBARIAN_CLASS_FORMULAS.branchesOfTheTree).toBeDefined(); // World Tree
            expect(BARBARIAN_CLASS_FORMULAS.divineFury).toBeDefined(); // Zealot
        });

        it("Bard: Dance, Glamour, Lore, Valor", () => {
            expect(BARD_CLASS_FORMULAS.dazzlingFootwork).toBeDefined(); // Dance
            expect(BARD_CLASS_FORMULAS.mantleOfInspiration).toBeDefined(); // Glamour
            expect(BARD_CLASS_FORMULAS.cuttingWords).toBeDefined(); // Lore
            expect(BARD_CLASS_FORMULAS.combatInspiration).toBeDefined(); // Valor
        });

        it("Cleric: Life, Light, Trickery, War", () => {
            expect(CLERIC_CLASS_FORMULAS.preserveLife).toBeDefined(); // Life
            expect(CLERIC_CLASS_FORMULAS.radianceOfTheDawn).toBeDefined(); // Light
            expect(CLERIC_CLASS_FORMULAS.invokeDuplicity).toBeDefined(); // Trickery
            expect(CLERIC_CLASS_FORMULAS.guidedStrike).toBeDefined(); // War
        });

        it("Druid: Land, Moon, Sea, Stars", () => {
            expect(DRUID_CLASS_FORMULAS.naturalRecovery).toBeDefined(); // Land
            expect(DRUID_CLASS_FORMULAS.combatWildShape).toBeDefined(); // Moon
            expect(DRUID_CLASS_FORMULAS.wrathOfTheSea).toBeDefined(); // Sea
            expect(DRUID_CLASS_FORMULAS.starryForm).toBeDefined(); // Stars
        });

        it("Fighter: Battle Master, Champion, Eldritch Knight, Psi Warrior", () => {
            expect(FIGHTER_CLASS_FORMULAS.combatSuperiority).toBeDefined(); // Battle Master
            expect(FIGHTER_CLASS_FORMULAS.improvedCritical).toBeDefined(); // Champion
            expect(FIGHTER_CLASS_FORMULAS.weaponBond).toBeDefined(); // Eldritch Knight
            expect(FIGHTER_CLASS_FORMULAS.psionicPower).toBeDefined(); // Psi Warrior
        });

        it("Monk: Mercy, Shadow, Elements, Open Hand", () => {
            expect(MONK_CLASS_FORMULAS.handOfHealing).toBeDefined(); // Mercy
            expect(MONK_CLASS_FORMULAS.shadowArts).toBeDefined(); // Shadow
            expect(MONK_CLASS_FORMULAS.elementalAttunement).toBeDefined(); // Elements
            expect(MONK_CLASS_FORMULAS.openHandTechnique).toBeDefined(); // Open Hand
        });

        it("Paladin: Devotion, Glory, Ancients, Vengeance", () => {
            expect(PALADIN_CLASS_FORMULAS.sacredWeapon).toBeDefined(); // Devotion
            expect(PALADIN_CLASS_FORMULAS.peerlessAthlete).toBeDefined(); // Glory
            expect(PALADIN_CLASS_FORMULAS.naturesWrath).toBeDefined(); // Ancients
            expect(PALADIN_CLASS_FORMULAS.vowOfEnmity).toBeDefined(); // Vengeance
        });

        it("Ranger: Beast Master, Fey Wanderer, Gloom Stalker, Hunter", () => {
            expect(RANGER_CLASS_FORMULAS.primalCompanion).toBeDefined(); // Beast Master
            expect(RANGER_CLASS_FORMULAS.dreadfulStrikes).toBeDefined(); // Fey Wanderer
            expect(RANGER_CLASS_FORMULAS.dreadAmbusher).toBeDefined(); // Gloom Stalker
            expect(RANGER_CLASS_FORMULAS.huntersPrey).toBeDefined(); // Hunter
        });

        it("Rogue: Arcane Trickster, Assassin, Soulknife, Thief", () => {
            expect(ROGUE_CLASS_FORMULAS.mageHandLegerdemain).toBeDefined(); // Arcane Trickster
            expect(ROGUE_CLASS_FORMULAS.assassinate).toBeDefined(); // Assassin
            expect(ROGUE_CLASS_FORMULAS.psychicBlades).toBeDefined(); // Soulknife
            expect(ROGUE_CLASS_FORMULAS.fastHands).toBeDefined(); // Thief
        });

        it("Sorcerer: Aberrant, Clockwork, Draconic, Wild Magic", () => {
            expect(SORCERER_CLASS_FORMULAS.telepathicSpeech).toBeDefined(); // Aberrant
            expect(SORCERER_CLASS_FORMULAS.restoreBalance).toBeDefined(); // Clockwork
            expect(SORCERER_CLASS_FORMULAS.draconicResilience).toBeDefined(); // Draconic
            expect(SORCERER_CLASS_FORMULAS.tidesOfChaos).toBeDefined(); // Wild Magic
        });

        it("Warlock: Archfey, Celestial, Fiend, Great Old One", () => {
            expect(WARLOCK_CLASS_FORMULAS.stepsOfTheFey).toBeDefined(); // Archfey
            expect(WARLOCK_CLASS_FORMULAS.healingLight).toBeDefined(); // Celestial
            expect(WARLOCK_CLASS_FORMULAS.darkOnesBlessing).toBeDefined(); // Fiend
            expect(WARLOCK_CLASS_FORMULAS.awakenedMind).toBeDefined(); // Great Old One
        });

        it("Wizard: Abjurer, Diviner, Evoker, Illusionist", () => {
            expect(WIZARD_CLASS_FORMULAS.arcaneWard).toBeDefined(); // Abjurer
            expect(WIZARD_CLASS_FORMULAS.portent).toBeDefined(); // Diviner
            expect(WIZARD_CLASS_FORMULAS.sculptSpells).toBeDefined(); // Evoker
            expect(WIZARD_CLASS_FORMULAS.improvedMinorIllusion).toBeDefined(); // Illusionist
        });
    });

    describe("PHB 2024 Core Class Mechanics in Action Formulas", () => {
        it("Fighter has Tactical Mind and Second Wind", () => {
            expect(FIGHTER_CLASS_FORMULAS.tacticalMind).toBeDefined();
            expect(FIGHTER_CLASS_FORMULAS.secondWind).toBeDefined();
            expect(FIGHTER_CLASS_FORMULAS.actionSurge).toBeDefined();
            expect(TACTICAL_MIND_OPTIONS.map((o: { id: string }) => o.id)).toContain("tactical_mind");
            expect(TACTICAL_MIND_OPTIONS.map((o: { id: string }) => o.id)).toContain("tactical_shift");
        });

        it("Paladin has Lay on Hands options", () => {
            expect(PALADIN_CLASS_FORMULAS.layOnHands).toBeDefined();
            expect(LAY_ON_HANDS_OPTIONS.map((o: { id: string }) => o.id)).toEqual(["heal_hp", "neutralize_poison"]);
        });

        it("Rogue has Cunning Strike with all tactical debuff options", () => {
            expect(ROGUE_CLASS_FORMULAS.cunningStrike).toBeDefined();
            expect(CUNNING_STRIKE_OPTIONS.map((o: { id: string }) => o.id)).toEqual([
                "poison",
                "trip",
                "withdraw",
                "daze",
                "knock_out",
                "obscure"
            ]);
        });

        it("Cleric has Divine Spark in Channel Divinity", () => {
            expect(CLERIC_CLASS_FORMULAS.divineSpark).toBeDefined();
            expect(DIVINE_SPARK_OPTIONS.map((o: { id: string }) => o.id)).toEqual([
                "divine_spark_heal",
                "divine_spark_damage",
                "turn_undead"
            ]);
        });

        it("Monk has Uncanny Metabolism and Deflect Attacks in Focus Points", () => {
            expect(MONK_CLASS_FORMULAS.focusPoints).toBeDefined();
            const optionIds = FOCUS_POINT_OPTIONS.map(o => o.id);
            expect(optionIds).toContain("metabolism");
            expect(optionIds).toContain("deflect");
        });

        it("aggregates formulas into ALL_MANUAL_ACTION_FORMULAS", () => {
            expect(Object.keys(ALL_MANUAL_ACTION_FORMULAS).length).toBeGreaterThan(300);
            expect(ALL_MANUAL_ACTION_FORMULAS["embers:fighter:tactical-mind"]).toBeDefined();
            expect(ALL_MANUAL_ACTION_FORMULAS["embers:rogue:cunning-strike"]).toBeDefined();
            expect(ALL_MANUAL_ACTION_FORMULAS["embers:cleric:divine-spark"]).toBeDefined();
        });

        it("Barbarian Level 1-20 and Level 20 Capstone", () => {
            expect(BARBARIAN_CLASS_FORMULAS.rage).toBeDefined();
            expect(BARBARIAN_CLASS_FORMULAS.unarmoredDefense).toBeDefined();
            expect(BARBARIAN_CLASS_FORMULAS.recklessAttack).toBeDefined();
            expect(BARBARIAN_CLASS_FORMULAS.brutalStrike).toBeDefined();
            expect(BARBARIAN_CLASS_FORMULAS.primalChampion).toBeDefined(); // Level 20 Capstone (+4 STR, +4 CON)
        });

        it("Fighter Level 1-20 and Level 20 Capstone", () => {
            expect(FIGHTER_CLASS_FORMULAS.extraAttack).toBeDefined();
            expect(FIGHTER_CLASS_FORMULAS.twoExtraAttacks).toBeDefined(); // Level 11
            expect(FIGHTER_CLASS_FORMULAS.studiedAttacks).toBeDefined(); // Level 13
            expect(FIGHTER_CLASS_FORMULAS.threeExtraAttacks).toBeDefined(); // Level 20 Capstone (4 attacks)
        });

        it("Rogue Level 1-20 and Level 20 Capstone", () => {
            expect(ROGUE_CLASS_FORMULAS.sneakAttack).toBeDefined();
            expect(ROGUE_CLASS_FORMULAS.uncannyDodge).toBeDefined();
            expect(ROGUE_CLASS_FORMULAS.evasion).toBeDefined();
            expect(ROGUE_CLASS_FORMULAS.reliableTalent).toBeDefined();
            expect(ROGUE_CLASS_FORMULAS.strokeOfLuck).toBeDefined(); // Level 20 Capstone (turn miss/fail into 20)
        });

        it("Monk Level 1-20 and Level 20 Capstone", () => {
            expect(MONK_CLASS_FORMULAS.martialArts).toBeDefined();
            expect(MONK_CLASS_FORMULAS.stunningStrike).toBeDefined();
            expect(MONK_CLASS_FORMULAS.empoweredStrikes).toBeDefined();
            expect(MONK_CLASS_FORMULAS.heightenedFocus).toBeDefined();
            expect(MONK_CLASS_FORMULAS.bodyAndMind).toBeDefined(); // Level 20 Capstone (+4 DEX, +4 WIS)
        });

        it("Paladin Level 1-20 and Level 20 Subclass Capstones", () => {
            expect(PALADIN_CLASS_FORMULAS.paladinsSmite).toBeDefined();
            expect(PALADIN_CLASS_FORMULAS.radiantStrikes).toBeDefined();
            expect(PALADIN_CLASS_FORMULAS.restoringTouch).toBeDefined();
            expect(PALADIN_CLASS_FORMULAS.holyNimbus).toBeDefined(); // Devotion Lv20
            expect(PALADIN_CLASS_FORMULAS.livingLegend).toBeDefined(); // Glory Lv20
            expect(PALADIN_CLASS_FORMULAS.elderChampion).toBeDefined(); // Ancients Lv20
            expect(PALADIN_CLASS_FORMULAS.avengingAngel).toBeDefined(); // Vengeance Lv20
        });

        it("Ranger Level 1-20 and Level 20 Capstone", () => {
            expect(RANGER_CLASS_FORMULAS.favoredEnemy).toBeDefined();
            expect(RANGER_CLASS_FORMULAS.tireless).toBeDefined();
            expect(RANGER_CLASS_FORMULAS.relentlessHunter).toBeDefined();
            expect(RANGER_CLASS_FORMULAS.foeSlayer).toBeDefined(); // Level 20 Capstone (1d10 HM die)
        });

        it("Cleric Level 1-20 and Level 20 Capstone", () => {
            expect(CLERIC_CLASS_FORMULAS.divineOrder).toBeDefined();
            expect(CLERIC_CLASS_FORMULAS.blessedStrikes).toBeDefined();
            expect(CLERIC_CLASS_FORMULAS.divineIntervention).toBeDefined();
            expect(CLERIC_CLASS_FORMULAS.greaterDivineIntervention).toBeDefined(); // Level 20 Capstone (Wish)
        });

        it("Druid Level 1-20 and Level 20 Capstone", () => {
            expect(DRUID_CLASS_FORMULAS.primalOrder).toBeDefined();
            expect(DRUID_CLASS_FORMULAS.wildShape).toBeDefined();
            expect(DRUID_CLASS_FORMULAS.wildCompanion).toBeDefined();
            expect(DRUID_CLASS_FORMULAS.wildResurgence).toBeDefined();
            expect(DRUID_CLASS_FORMULAS.elementalFury).toBeDefined();
            expect(DRUID_CLASS_FORMULAS.beastSpells).toBeDefined();
            expect(DRUID_CLASS_FORMULAS.archdruid).toBeDefined(); // Level 20 Capstone
        });

        it("Bard Level 1-20 and Level 20 Capstone", () => {
            expect(BARD_CLASS_FORMULAS.bardicInspiration).toBeDefined();
            expect(BARD_CLASS_FORMULAS.fontOfInspiration).toBeDefined();
            expect(BARD_CLASS_FORMULAS.countercharm).toBeDefined();
            expect(BARD_CLASS_FORMULAS.magicalSecrets).toBeDefined();
            expect(BARD_CLASS_FORMULAS.superiorInspiration).toBeDefined();
            expect(BARD_CLASS_FORMULAS.wordsOfCreation).toBeDefined(); // Level 20 Capstone
        });

        it("Sorcerer Level 1-20 and Level 20 Capstone", () => {
            expect(SORCERER_CLASS_FORMULAS.innateSorcery).toBeDefined();
            expect(SORCERER_CLASS_FORMULAS.fontOfMagic).toBeDefined();
            expect(SORCERER_CLASS_FORMULAS.metamagic).toBeDefined();
            expect(SORCERER_CLASS_FORMULAS.sorcerousRestoration).toBeDefined();
            expect(SORCERER_CLASS_FORMULAS.sorceryIncarnate).toBeDefined();
            expect(SORCERER_CLASS_FORMULAS.arcaneApotheosis).toBeDefined(); // Level 20 Capstone
        });

        it("Warlock Level 1-20 and Level 20 Capstone", () => {
            expect(WARLOCK_CLASS_FORMULAS.eldritchInvocations).toBeDefined();
            expect(WARLOCK_CLASS_FORMULAS.magicalCunning).toBeDefined();
            expect(WARLOCK_CLASS_FORMULAS.mysticArcanum).toBeDefined();
            expect(WARLOCK_CLASS_FORMULAS.eldritchMaster).toBeDefined(); // Level 20 Capstone
        });

        it("Wizard Level 1-20 and Level 20 Capstone", () => {
            expect(WIZARD_CLASS_FORMULAS.arcaneRecovery).toBeDefined();
            expect(WIZARD_CLASS_FORMULAS.scholar).toBeDefined();
            expect(WIZARD_CLASS_FORMULAS.memorizeSpell).toBeDefined();
            expect(WIZARD_CLASS_FORMULAS.spellMastery).toBeDefined();
            expect(WIZARD_CLASS_FORMULAS.signatureSpells).toBeDefined(); // Level 20 Capstone
        });
    });

    describe("Data-Driven Class Feature & Resource Resolution", () => {
        it("correctly matches formulas from feature names", () => {
            expect(findMatchingActionFormula("Cunning Strike")?.id).toBe("embers:rogue:cunning-strike");
            expect(findMatchingActionFormula("Tactical Mind")?.id).toBe("embers:fighter:tactical-mind");
            expect(findMatchingActionFormula("Divine Spark")?.id).toBe("embers:cleric:divine-spark");
            expect(findMatchingActionFormula("Font of Magic")?.id).toBe("embers:font-of-magic");
            expect(findMatchingActionFormula("Focus Points")?.id).toBe("embers:monk:focus-points");
            expect(findMatchingActionFormula("Lay on Hands")?.id).toBe("embers:paladin:lay-on-hands");
            expect(findMatchingActionFormula("Combat Superiority: Maneuvers")?.id).toBe("embers:fighter:battle-master:combat-superiority");
        });

        it("calculates accurate resource counts based on formula scaling and character data", () => {
            const mockRogue: DDBParsedCharacter = {
                classes: [{ name: "Rogue", level: 7, isStartingClass: true }]
            } as any;

            const mockFighter: DDBParsedCharacter = {
                classes: [{ name: "Fighter", level: 5, isStartingClass: true }]
            } as any;

            const mockCleric: DDBParsedCharacter = {
                classes: [{ name: "Cleric", level: 6, isStartingClass: true }]
            } as any;

            const mockMonk: DDBParsedCharacter = {
                classes: [{ name: "Monk", level: 4, isStartingClass: true }]
            } as any;

            // Rogue Sneak Attack / Cunning Strike dice (Math.ceil(7 / 2) = 4)
            const cunningFormula = findMatchingActionFormula("Cunning Strike");
            const cunningCalc = resolveFeatureResource({
                formula: cunningFormula,
                character: mockRogue
            });
            expect(cunningCalc.resourceName).toBe("Sneak Attack Dice");
            expect(cunningCalc.maxPoints).toBe(4);
            expect(cunningCalc.availablePoints).toBe(4);

            // Fighter Second Wind (Level 5 gets 3 uses from table)
            const swFormula = findMatchingActionFormula("Second Wind");
            const tacticalCalc = resolveFeatureResource({
                formula: swFormula,
                character: mockFighter,
                feature: { id: "feat-sw", name: "Second Wind" } as any,
                featureUses: { "feat-sw": 1 }
            });
            expect(tacticalCalc.resourceName).toBe("Second Wind");
            expect(tacticalCalc.maxPoints).toBe(3);
            expect(tacticalCalc.availablePoints).toBe(2);

            // Cleric Channel Divinity (Level 6 gets 2 uses from table)
            const cdFormula = findMatchingActionFormula("Channel Divinity");
            const divineSparkCalc = resolveFeatureResource({
                formula: cdFormula,
                character: mockCleric
            });
            expect(divineSparkCalc.resourceName).toBe("Channel Divinity");
            expect(divineSparkCalc.maxPoints).toBe(2);

            // Monk Focus Points (Level 4 gets 4 points)
            const monkFormula = findMatchingActionFormula("Focus Points");
            const monkCalc = resolveFeatureResource({
                formula: monkFormula,
                character: mockMonk,
                feature: { id: "feat-fp", name: "Focus Points" } as any,
                featureUses: { "feat-fp": 3 }
            });
            expect(monkCalc.resourceName).toBe("Focus Points (Ki)");
            expect(monkCalc.maxPoints).toBe(4);
            expect(monkCalc.availablePoints).toBe(1);
        });
    });
});
