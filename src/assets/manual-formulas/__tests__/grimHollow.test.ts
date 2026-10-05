import { describe, expect, it } from "vitest";
import {
    ALL_MANUAL_FORMULAS,
    ALL_MANUAL_OVERRIDES,
    DND_SPELL_SOURCEBOOKS,
    getRulesEditionForSourcebook,
    grimHollowSpellOverrides
} from "../index";

describe("Grim Hollow: Player’s Guide Spell Catalog", () => {
    it("registers Grim Hollow sourcebook in DND_SPELL_SOURCEBOOKS", () => {
        const ghBook = DND_SPELL_SOURCEBOOKS.find(b => b.id === "grim-hollow-players-guide");
        expect(ghBook).toBeDefined();
        expect(ghBook?.title).toBe("Grim Hollow: Player’s Guide");
        expect(ghBook?.publisher).toBe("Ghostfire Gaming");
        expect(ghBook?.rulesEdition).toBe("2024");
        expect(ghBook?.ddbCategory).toBe("Grim Hollow");
    });

    it("identifies Grim Hollow page citations as 2024 rules edition", () => {
        expect(getRulesEditionForSourcebook("Grim Hollow: Player’s Guide, pg. 185")).toBe("2024");
        expect(getRulesEditionForSourcebook("Grim Hollow: Player’s Guide, pg. 198")).toBe("2024");
        expect(getRulesEditionForSourcebook("Grim Hollow: Player’s Guide")).toBe("2024");
    });

    it("loads all 101 Grim Hollow spells into grimHollowSpellOverrides", () => {
        const spellKeys = Object.keys(grimHollowSpellOverrides);
        expect(spellKeys.length).toBe(101);
    });

    it("merges all 101 spells into ALL_MANUAL_OVERRIDES and ALL_MANUAL_FORMULAS", () => {
        for (const [id, formula] of Object.entries(grimHollowSpellOverrides)) {
            expect(ALL_MANUAL_OVERRIDES[id]).toBeDefined();
            expect(ALL_MANUAL_OVERRIDES[id].name).toBe(formula.name);

            const record = ALL_MANUAL_FORMULAS[id];
            expect(record).toBeDefined();
            expect(record.kind === "spell" || record.kind === "cantrip").toBe(true);
            if (record.kind === "spell" || record.kind === "cantrip") {
                expect(record.formula.id).toBe(id);
                expect(record.formula.category.source).toContain("Grim Hollow: Player’s Guide");
                expect(record.formula.implementation?.sourceStatus).toBe("checked");
                expect(record.formula.isManualOverride).toBe(true);
            }
        }
    });

    it("verifies Arboreal Curse mechanics (Level 7 Transmutation, CON save, until dispelled)", () => {
        const spell = grimHollowSpellOverrides.arboreal_curse;
        expect(spell).toBeDefined();
        expect(spell.name).toBe("Arboreal Curse");
        expect(spell.category.level).toBe(7);
        expect(spell.category.school).toBe("transmutation");
        expect(spell.category.spellType).toBe("spell");
        expect(spell.casting.time).toBe("1 Action");
        expect(spell.casting.range).toBe("60 ft.");
        expect(spell.casting.duration).toBe("Until Dispelled");
        expect(spell.category.source).toBe("Grim Hollow: Player’s Guide, pg. 185");
        expect(spell.interaction?.type).toBe("save");
        expect(spell.interaction?.saveAbility).toBe("CON");
    });

    it("verifies Ride the Lightning mechanics (Level 4 Conjuration, 4d6 Lightning, DEX save)", () => {
        const spell = grimHollowSpellOverrides.ride_the_lightning;
        expect(spell).toBeDefined();
        expect(spell.name).toBe("Ride the Lightning");
        expect(spell.category.level).toBe(4);
        expect(spell.category.school).toBe("conjuration");
        expect(spell.category.source).toBe("Grim Hollow: Player’s Guide, pg. 198");
        expect(spell.interaction?.type).toBe("save");
        expect(spell.interaction?.saveAbility).toBe("DEX");
        expect(spell.damage.length).toBeGreaterThan(0);
        expect(spell.damage[0].dice).toBe("4d6");
        expect(spell.damage[0].type).toBe("lightning");
        expect(spell.upcasting?.notes).toContain("Using a Higher-Level Spell Slot");
        expect(spell.upcasting?.perSlotLevel?.dice).toBe("1d6");
    });

    it("verifies Arcane Aegis mechanics (Level 1 Abjuration, 2d10 Temp HP, upcasting)", () => {
        const spell = grimHollowSpellOverrides.arcane_aegis;
        expect(spell).toBeDefined();
        expect(spell.name).toBe("Arcane Aegis");
        expect(spell.category.level).toBe(1);
        expect(spell.category.school).toBe("abjuration");
        expect(spell.category.source).toBe("Grim Hollow: Player’s Guide, pg. 185");
        expect(spell.upcasting?.notes).toContain("additional 2d10 Temporary Hit Points");
        expect(spell.upcasting?.perSlotLevel?.dice).toBe("2d10");
    });

    it("verifies Grim Hollow Summon Plant does not conflict with Arcana Unleashed Summon Plant", () => {
        // Grim Hollow version is level 2
        const ghSummonPlant = grimHollowSpellOverrides.summon_plant_gh;
        expect(ghSummonPlant).toBeDefined();
        expect(ghSummonPlant.category.level).toBe(2);
        expect(ghSummonPlant.category.source).toContain("Grim Hollow: Player’s Guide");

        // Arcana Unleashed version is level 5
        const auSummonPlant = ALL_MANUAL_OVERRIDES.summon_plant;
        expect(auSummonPlant).toBeDefined();
        expect(auSummonPlant.category.level).toBe(5);
        expect(auSummonPlant.category.source).toContain("Arcana Unleashed");
    });

    it("verifies Sangromancy spells require Hit Point Dice expenditure", () => {
        const bloodRush = grimHollowSpellOverrides.blood_rush;
        expect(bloodRush).toBeDefined();
        expect(bloodRush.category.level).toBe(1);
        expect(bloodRush.effectNotes?.[0]).toContain("expend one Hit Point Die");

        const bloodTide = grimHollowSpellOverrides.blood_tide;
        expect(bloodTide).toBeDefined();
        expect(bloodTide.category.level).toBe(6);
        expect(bloodTide.effectNotes?.[0]).toContain("expend six Hit Point Dice");
    });
});
