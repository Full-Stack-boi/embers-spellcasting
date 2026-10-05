import { describe, expect, it } from "vitest";
import {
    ALL_MANUAL_ACTION_FORMULAS,
    CLASS_MANUAL_FORMULAS,
    SORCERER_CLASS_FORMULAS,
    FIGHTER_CLASS_FORMULAS,
    MONK_CLASS_FORMULAS,
    PALADIN_CLASS_FORMULAS,
    WIZARD_CLASS_FORMULAS,
    CLERIC_CLASS_FORMULAS,
    BARD_CLASS_FORMULAS,
    DRUID_CLASS_FORMULAS,
    RANGER_CLASS_FORMULAS,
    GUNSLINGER_CLASS_FORMULAS,
    FONT_CREATE_OPTIONS,
    METAMAGIC_OPTIONS,
    MANEUVER_OPTIONS,
    FOCUS_POINT_OPTIONS,
    LAY_ON_HANDS_OPTIONS,
    PERSONA_MASK_OPTIONS,
    COLLEGE_OF_MASKS_FORMULAS,
    DRAGON_DOMAIN_FORMULAS,
    LEGENDARY_ASPECT_OPTIONS,
    CIRCLE_OF_THE_CITY_FORMULAS,
    BEASTBORNE_FORMULAS,
    BESTIAL_ASPECT_LEVELS,
    HEROIC_SORCERY_FORMULAS,
    MYSTICAL_MANEUVER_OPTIONS,
    MAGIC_MISSILE_MAGE_FORMULAS,
    VERSATILE_MISSILE_OPTIONS,
    PISTOLERO_FORMULAS,
} from "../index";

describe("Class and Subclass Manual Formulas Architecture", () => {
    it("registers all supported classes in CLASS_MANUAL_FORMULAS registry", () => {
        expect(CLASS_MANUAL_FORMULAS).toHaveProperty("sorcerer");
        expect(CLASS_MANUAL_FORMULAS).toHaveProperty("fighter");
        expect(CLASS_MANUAL_FORMULAS).toHaveProperty("monk");
        expect(CLASS_MANUAL_FORMULAS).toHaveProperty("paladin");
        expect(CLASS_MANUAL_FORMULAS).toHaveProperty("wizard");
        expect(CLASS_MANUAL_FORMULAS).toHaveProperty("cleric");
        expect(CLASS_MANUAL_FORMULAS).toHaveProperty("bard");
        expect(CLASS_MANUAL_FORMULAS).toHaveProperty("druid");
        expect(CLASS_MANUAL_FORMULAS).toHaveProperty("ranger");
        expect(CLASS_MANUAL_FORMULAS).toHaveProperty("gunslinger");
    });

    it("verifies Sorcerer formulas, Font of Magic rules, Metamagic, and Heroic Sorcery subclass", () => {
        expect(SORCERER_CLASS_FORMULAS.fontOfMagic).toBeDefined();
        expect(SORCERER_CLASS_FORMULAS.fontOfMagic.classes).toContain("sorcerer");

        const convertOp = SORCERER_CLASS_FORMULAS.fontOfMagic.operations.find(o => o.type === "convert_spell_slot_to_resource");
        expect(convertOp).toBeDefined();
        if (convertOp && convertOp.type === "convert_spell_slot_to_resource") {
            expect(convertOp.actionType).toBe("none");
        }

        const createOp = SORCERER_CLASS_FORMULAS.fontOfMagic.operations.find(o => o.type === "create_spell_slot");
        expect(createOp).toBeDefined();
        if (createOp && createOp.type === "create_spell_slot") {
            expect(createOp.actionType).toBe("bonus");
            expect(createOp.options).toHaveLength(5);
        }

        expect(FONT_CREATE_OPTIONS).toHaveLength(5);
        expect(FONT_CREATE_OPTIONS[0]).toEqual({ slotLevel: 1, cost: 2, minLevel: 2 });

        // Metamagic options do not consume action by themselves
        expect(METAMAGIC_OPTIONS.length).toBeGreaterThanOrEqual(5);
        for (const meta of METAMAGIC_OPTIONS) {
            expect(meta.actionType).toBe("none");
        }

        // Heroic Sorcery (VSSPP2)
        expect(HEROIC_SORCERY_FORMULAS.heroicSoul).toBeDefined();
        expect(HEROIC_SORCERY_FORMULAS.heroicSoul.subclass).toBe("heroicSorcery");
        expect(HEROIC_SORCERY_FORMULAS.mysticalManeuvers).toBeDefined();
        expect(HEROIC_SORCERY_FORMULAS.mysticalManeuvers.activationType).toBe("bonus");
        expect(MYSTICAL_MANEUVER_OPTIONS).toHaveLength(3);
    });

    it("verifies Fighter base formulas and Battle Master subclass maneuvers", () => {
        expect(FIGHTER_CLASS_FORMULAS.secondWind).toBeDefined();
        expect(FIGHTER_CLASS_FORMULAS.secondWind.activationType).toBe("bonus");

        expect(FIGHTER_CLASS_FORMULAS.actionSurge).toBeDefined();

        expect(FIGHTER_CLASS_FORMULAS.combatSuperiority).toBeDefined();
        expect(FIGHTER_CLASS_FORMULAS.combatSuperiority.subclass).toBe("battleMaster");

        // Maneuver action types: Riposte is reaction, on-hit maneuvers are none
        const riposte = MANEUVER_OPTIONS.find(m => m.id === "riposte");
        expect(riposte?.actionType).toBe("reaction");

        const trip = MANEUVER_OPTIONS.find(m => m.id === "trip");
        expect(trip?.actionType).toBe("none");
    });

    it("verifies Monk Focus Points and action types", () => {
        expect(MONK_CLASS_FORMULAS.focusPoints).toBeDefined();
        expect(MONK_CLASS_FORMULAS.focusPoints.classes).toContain("monk");

        const flurry = FOCUS_POINT_OPTIONS.find(f => f.id === "flurry");
        expect(flurry?.actionType).toBe("bonus");

        const stun = FOCUS_POINT_OPTIONS.find(f => f.id === "stun");
        expect(stun?.actionType).toBe("none");
    });

    it("verifies Paladin Lay on Hands and Channel Divinity", () => {
        expect(PALADIN_CLASS_FORMULAS.layOnHands).toBeDefined();
        expect(PALADIN_CLASS_FORMULAS.channelDivinity).toBeDefined();

        for (const opt of LAY_ON_HANDS_OPTIONS) {
            expect(opt.actionType).toBe("bonus");
        }
    });

    it("verifies Wizard Arcane Recovery and Magic Missile Mage subclass (VSSPP2)", () => {
        expect(WIZARD_CLASS_FORMULAS.arcaneRecovery).toBeDefined();
        expect(WIZARD_CLASS_FORMULAS.arcaneRecovery.classes).toContain("wizard");

        // Magic Missile Mage (VSSPP2)
        expect(MAGIC_MISSILE_MAGE_FORMULAS.magicMissileSavant).toBeDefined();
        expect(MAGIC_MISSILE_MAGE_FORMULAS.magicMissileSavant.subclass).toBe("magicMissileMage");
        expect(MAGIC_MISSILE_MAGE_FORMULAS.magicMissileSavant.activationType).toBe("action");
        expect(MAGIC_MISSILE_MAGE_FORMULAS.versatileMissiles).toBeDefined();
        expect(VERSATILE_MISSILE_OPTIONS).toHaveLength(3);
        expect(MAGIC_MISSILE_MAGE_FORMULAS.shieldOfMissiles).toBeDefined();
        expect(MAGIC_MISSILE_MAGE_FORMULAS.gigaMissile).toBeDefined();
    });

    it("verifies Cleric Channel Divinity and Dragon Domain subclass (VSSPP2)", () => {
        expect(CLERIC_CLASS_FORMULAS.channelDivinity).toBeDefined();
        expect(CLERIC_CLASS_FORMULAS.channelDivinity.classes).toContain("cleric");

        // Dragon Domain (VSSPP2)
        expect(DRAGON_DOMAIN_FORMULAS.chromaticAffinity).toBeDefined();
        expect(DRAGON_DOMAIN_FORMULAS.chromaticAffinity.subclass).toBe("dragonDomain");
        expect(DRAGON_DOMAIN_FORMULAS.draconicMajesty).toBeDefined();
        expect(DRAGON_DOMAIN_FORMULAS.wyrmsBlessing).toBeDefined();
        expect(DRAGON_DOMAIN_FORMULAS.legendaryAspect).toBeDefined();
        expect(LEGENDARY_ASPECT_OPTIONS).toHaveLength(3);
    });

    it("verifies Bard Bardic Inspiration and College of Masks subclass (VSSPP2)", () => {
        expect(BARD_CLASS_FORMULAS.bardicInspiration).toBeDefined();
        expect(BARD_CLASS_FORMULAS.bardicInspiration.classes).toContain("bard");

        // College of Masks (VSSPP2)
        expect(COLLEGE_OF_MASKS_FORMULAS.personaMasks).toBeDefined();
        expect(COLLEGE_OF_MASKS_FORMULAS.personaMasks.subclass).toBe("collegeOfMasks");
        expect(COLLEGE_OF_MASKS_FORMULAS.personaMasks.activationType).toBe("bonus");
        expect(PERSONA_MASK_OPTIONS).toHaveLength(9);
        expect(COLLEGE_OF_MASKS_FORMULAS.virtuosoSkill).toBeDefined();
        expect(COLLEGE_OF_MASKS_FORMULAS.masterOfManyFaces).toBeDefined();
    });

    it("verifies Druid Wild Shape and Circle of the City subclass (VSSPP2)", () => {
        expect(DRUID_CLASS_FORMULAS.wildShape).toBeDefined();
        expect(DRUID_CLASS_FORMULAS.wildShape.classes).toContain("druid");

        // Circle of the City (VSSPP2)
        expect(CIRCLE_OF_THE_CITY_FORMULAS.cityShape).toBeDefined();
        expect(CIRCLE_OF_THE_CITY_FORMULAS.cityShape.subclass).toBe("circleOfTheCity");
        expect(CIRCLE_OF_THE_CITY_FORMULAS.objectShape).toBeDefined();
        expect(CIRCLE_OF_THE_CITY_FORMULAS.wallWarp).toBeDefined();
        expect(CIRCLE_OF_THE_CITY_FORMULAS.wallWarp.activationType).toBe("reaction");
        expect(CIRCLE_OF_THE_CITY_FORMULAS.urbanColossus).toBeDefined();
    });

    it("verifies Ranger Hunter's Mark and Beastborne subclass (VSSPP2)", () => {
        expect(RANGER_CLASS_FORMULAS.huntersMark).toBeDefined();
        expect(RANGER_CLASS_FORMULAS.huntersMark.classes).toContain("ranger");

        // Beastborne (VSSPP2)
        expect(BEASTBORNE_FORMULAS.bestialAspect).toBeDefined();
        expect(BEASTBORNE_FORMULAS.bestialAspect.subclass).toBe("beastborne");
        expect(BEASTBORNE_FORMULAS.bestialAspect.activationType).toBe("bonus");
        expect(BESTIAL_ASPECT_LEVELS).toHaveLength(5);
        expect(BEASTBORNE_FORMULAS.lycanthrope).toBeDefined();
        expect(BEASTBORNE_FORMULAS.monstrousResilience).toBeDefined();
    });

    it("verifies Gunslinger Risk Dice and Pistolero subclass (VSSPP2)", () => {
        expect(GUNSLINGER_CLASS_FORMULAS.riskDice).toBeDefined();
        expect(GUNSLINGER_CLASS_FORMULAS.riskDice.classes).toContain("gunslinger");

        // Pistolero (VSSPP2)
        expect(PISTOLERO_FORMULAS.fanTheHammer).toBeDefined();
        expect(PISTOLERO_FORMULAS.fanTheHammer.subclass).toBe("pistolero");
        expect(PISTOLERO_FORMULAS.fanTheHammer.activationType).toBe("bonus");
        expect(PISTOLERO_FORMULAS.showdown).toBeDefined();
        expect(PISTOLERO_FORMULAS.bulletTime).toBeDefined();
    });

    it("aggregates all class and subclass formulas in ALL_MANUAL_ACTION_FORMULAS", () => {
        const formulaIds = Object.keys(ALL_MANUAL_ACTION_FORMULAS);
        // Base classes
        expect(formulaIds).toContain("embers:font-of-magic");
        expect(formulaIds).toContain("embers:sorcerer:metamagic");
        expect(formulaIds).toContain("embers:sorcerer:innate-sorcery");
        expect(formulaIds).toContain("embers:fighter:second-wind");
        expect(formulaIds).toContain("embers:fighter:action-surge");
        expect(formulaIds).toContain("embers:monk:focus-points");
        expect(formulaIds).toContain("embers:paladin:lay-on-hands");
        expect(formulaIds).toContain("embers:paladin:channel-divinity");
        expect(formulaIds).toContain("embers:wizard:arcane-recovery");
        expect(formulaIds).toContain("embers:cleric:channel-divinity");
        expect(formulaIds).toContain("embers:bard:bardic-inspiration");
        expect(formulaIds).toContain("embers:druid:wild-shape");
        expect(formulaIds).toContain("embers:ranger:hunters-mark");
        expect(formulaIds).toContain("embers:gunslinger:risk-dice");

        // Subclasses (Battle Master + 7 VSSPP2 subclasses)
        expect(formulaIds).toContain("embers:fighter:battle-master:combat-superiority");
        expect(formulaIds).toContain("embers:bard:college-of-masks:persona-masks");
        expect(formulaIds).toContain("embers:cleric:dragon-domain:chromatic-affinity");
        expect(formulaIds).toContain("embers:druid:circle-of-the-city:city-shape");
        expect(formulaIds).toContain("embers:ranger:beastborne:bestial-aspect");
        expect(formulaIds).toContain("embers:sorcerer:heroic-sorcery:heroic-soul");
        expect(formulaIds).toContain("embers:wizard:magic-missile-mage:magic-missile-savant");
        expect(formulaIds).toContain("embers:gunslinger:pistolero:fan-the-hammer");
    });
});
