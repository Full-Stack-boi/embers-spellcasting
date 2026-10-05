import { describe, expect, it } from "vitest";
import {
    ALL_BACKGROUNDS,
    ALL_MANUAL_FEAT_FORMULAS,
    ARCANA_UNLEASHED_BACKGROUNDS,
    ARCANA_UNLEASHED_FEAT_FORMULAS,
    GRIM_HOLLOW_BACKGROUNDS,
    GRIM_HOLLOW_FEAT_FORMULAS,
    PHB_2024_BACKGROUNDS,
    PHB_2024_FEAT_FORMULAS,
    VSSPP2_FEAT_FORMULAS
} from "../index";

describe("Backgrounds and Feats Catalog", () => {
    describe("Backgrounds Registry", () => {
        it("contains all 16 PHB 2024 backgrounds", () => {
            expect(Object.keys(PHB_2024_BACKGROUNDS).length).toBe(16);
            expect(PHB_2024_BACKGROUNDS.wayfarer.featName).toBe("Lucky");
            expect(PHB_2024_BACKGROUNDS.acolyte.featName).toBe("Magic Initiate (Cleric)");
            expect(PHB_2024_BACKGROUNDS.soldier.skills).toEqual(["Athletics", "Intimidation"]);
        });

        it("contains all 25 Grim Hollow: Player's Guide backgrounds", () => {
            expect(Object.keys(GRIM_HOLLOW_BACKGROUNDS).length).toBe(25);
            expect(GRIM_HOLLOW_BACKGROUNDS.beast_hunter.featName).toBe("Blood Hound");
            expect(GRIM_HOLLOW_BACKGROUNDS.scion_of_the_thaumaturge.featName).toBe("Fortune of the Thaumaturge");
            expect(GRIM_HOLLOW_BACKGROUNDS.physician.featName).toBe("Triage Expert");
            expect(GRIM_HOLLOW_BACKGROUNDS.executioner.featName).toBe("Deathbound");
        });

        it("contains all 10 Arcana Unleashed backgrounds", () => {
            expect(Object.keys(ARCANA_UNLEASHED_BACKGROUNDS).length).toBe(10);
            expect(ARCANA_UNLEASHED_BACKGROUNDS.horizon_weaver_initiate.featName).toBe("Portal Jumper");
            expect(ARCANA_UNLEASHED_BACKGROUNDS.agent_of_the_ninth_quill.featName).toBe("Arcane Infiltrator");
            expect(ARCANA_UNLEASHED_BACKGROUNDS.familiar_trainer.featName).toBe("Familiar Friend");
        });

        it("merges all 51 backgrounds into ALL_BACKGROUNDS with valid fields", () => {
            expect(Object.keys(ALL_BACKGROUNDS).length).toBe(51);

            for (const [id, bg] of Object.entries(ALL_BACKGROUNDS)) {
                expect(bg.id).toBe(id);
                expect(bg.name).toBeTruthy();
                expect(bg.abilityScores.length).toBe(3);
                expect(bg.featId).toBeTruthy();
                expect(bg.featName).toBeTruthy();
                expect(bg.skills.length).toBe(2);
                expect(bg.tool).toBeTruthy();
            }
        });
    });

    describe("Active Feats Registry", () => {
        it("contains PHB 2024 active feats with proper resources and operations", () => {
            expect(PHB_2024_FEAT_FORMULAS.lucky).toBeDefined();
            expect(PHB_2024_FEAT_FORMULAS.lucky.resource?.name).toBe("Luck Points");
            expect(PHB_2024_FEAT_FORMULAS.telekinetic.activationType).toBe("bonus");
            expect(PHB_2024_FEAT_FORMULAS.shield_master.activationType).toBe("bonus");
            expect(PHB_2024_FEAT_FORMULAS.inspiring_leader.activationType).toBe("special");
        });

        it("contains Grim Hollow active feats with Sangromancy and reaction mechanics", () => {
            expect(GRIM_HOLLOW_FEAT_FORMULAS.sangromantic_initiate).toBeDefined();
            expect(GRIM_HOLLOW_FEAT_FORMULAS.sangromantic_initiate.resource?.name).toBe("Sangromancy Dice");
            expect(GRIM_HOLLOW_FEAT_FORMULAS.witch_hunter.activationType).toBe("reaction");
            expect(GRIM_HOLLOW_FEAT_FORMULAS.lightning_caster.activationType).toBe("bonus");
            expect(GRIM_HOLLOW_FEAT_FORMULAS.thrown_weapon_master.activationType).toBe("bonus");
        });

        it("contains Arcana Unleashed active feats with Phase Step and Boon mechanics", () => {
            expect(ARCANA_UNLEASHED_FEAT_FORMULAS.portal_jumper).toBeDefined();
            expect(ARCANA_UNLEASHED_FEAT_FORMULAS.portal_jumper.resource?.name).toBe("Phase Step Uses");
            expect(ARCANA_UNLEASHED_FEAT_FORMULAS.arcane_infiltrator.activationType).toBe("bonus");
            expect(ARCANA_UNLEASHED_FEAT_FORMULAS.boon_of_the_iron_mind.name).toContain("Unshakable Focus");
            expect(ARCANA_UNLEASHED_FEAT_FORMULAS.boon_of_the_iron_mind.description).toContain("Concentration");
        });

        it("contains all 8 VSSPP2 active feats with unique mechanics", () => {
            expect(Object.keys(VSSPP2_FEAT_FORMULAS).length).toBe(8);
            expect(VSSPP2_FEAT_FORMULAS.spellblade.name).toContain("Channeled Attack");
            expect(VSSPP2_FEAT_FORMULAS.familiar_keeper.activationType).toBe("reaction");
            expect(VSSPP2_FEAT_FORMULAS.showman.activationType).toBe("bonus");
            expect(VSSPP2_FEAT_FORMULAS.flex_caster.name).toContain("Upcast & Downcast");
            expect(VSSPP2_FEAT_FORMULAS.magitechnician.resource?.name).toBe("Magic Item Recharge Uses");
            expect(VSSPP2_FEAT_FORMULAS.metabolistic_magic.name).toContain("Vital Fuel");
            expect(VSSPP2_FEAT_FORMULAS.pyromaniac.name).toContain("Flare Damage");
            expect(VSSPP2_FEAT_FORMULAS.shock_trooper.name).toContain("First Strike");
        });

        it("merges all active feats into ALL_MANUAL_FEAT_FORMULAS", () => {
            for (const formula of Object.values(ALL_MANUAL_FEAT_FORMULAS)) {
                expect(formula.id).toBeTruthy();
                expect(formula.kind).toBe("feat");
                expect(formula.status).toBe("verified");
                expect(formula.operations.length).toBeGreaterThan(0);
            }
        });
    });
});
