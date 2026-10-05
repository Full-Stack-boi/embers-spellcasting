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
    getFeatureFlyoutKind,
    computeClassFeatureResource,
    CUNNING_STRIKE_OPTIONS,
    TACTICAL_MIND_OPTIONS,
    DIVINE_SPARK_OPTIONS,
    FOCUS_POINT_OPTIONS,
    LAY_ON_HANDS_OPTIONS
} from "../../manual-formulas";
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
            expect(TACTICAL_MIND_OPTIONS.map(o => o.id)).toContain("tactical_mind");
            expect(TACTICAL_MIND_OPTIONS.map(o => o.id)).toContain("tactical_shift");
        });

        it("Paladin has Lay on Hands options", () => {
            expect(PALADIN_CLASS_FORMULAS.layOnHands).toBeDefined();
            expect(LAY_ON_HANDS_OPTIONS.map(o => o.id)).toEqual(["heal_hp", "neutralize_poison"]);
        });

        it("Rogue has Cunning Strike with all tactical debuff options", () => {
            expect(ROGUE_CLASS_FORMULAS.cunningStrike).toBeDefined();
            expect(CUNNING_STRIKE_OPTIONS.map(o => o.id)).toEqual([
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
            expect(DIVINE_SPARK_OPTIONS.map(o => o.id)).toEqual([
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
    });

    describe("Centralized Mechanics Registry (classMechanicRegistry)", () => {
        it("correctly identifies flyout kind from feature names", () => {
            expect(getFeatureFlyoutKind({ name: "Cunning Strike" })).toBe("cunning_strike");
            expect(getFeatureFlyoutKind({ name: "Tactical Mind" })).toBe("tactical_mind");
            expect(getFeatureFlyoutKind({ name: "Divine Spark" })).toBe("divine_spark");
            expect(getFeatureFlyoutKind({ name: "Font of Magic" })).toBe("font_of_magic");
            expect(getFeatureFlyoutKind({ name: "Focus Points" })).toBe("focus_points");
            expect(getFeatureFlyoutKind({ name: "Ki" })).toBe("focus_points");
            expect(getFeatureFlyoutKind({ name: "Lay on Hands" })).toBe("lay_on_hands");
            expect(getFeatureFlyoutKind({ name: "Combat Superiority (Maneuver)" })).toBe("maneuvers");
            expect(getFeatureFlyoutKind({ name: "Something Else" })).toBeNull();
        });

        it("calculates accurate resource counts based on class levels and uses", () => {
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
            const cunningCalc = computeClassFeatureResource({
                kind: "cunning_strike",
                character: mockRogue
            });
            expect(cunningCalc.resourceName).toBe("Sneak Attack Dice");
            expect(cunningCalc.maxPoints).toBe(4);
            expect(cunningCalc.availablePoints).toBe(4);

            // Fighter Second Wind (Level 5 gets 3 uses)
            const tacticalCalc = computeClassFeatureResource({
                kind: "tactical_mind",
                character: mockFighter,
                feature: { id: "feat-sw", name: "Second Wind" } as any,
                featureUses: { "feat-sw": 1 }
            });
            expect(tacticalCalc.resourceName).toBe("Second Wind");
            expect(tacticalCalc.maxPoints).toBe(3);
            expect(tacticalCalc.availablePoints).toBe(2);

            // Cleric Channel Divinity (Level 6 gets 2 uses)
            const divineSparkCalc = computeClassFeatureResource({
                kind: "divine_spark",
                character: mockCleric
            });
            expect(divineSparkCalc.resourceName).toBe("Channel Divinity");
            expect(divineSparkCalc.maxPoints).toBe(2);

            // Monk Focus Points (Level 4 gets 4 points)
            const monkCalc = computeClassFeatureResource({
                kind: "focus_points",
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
