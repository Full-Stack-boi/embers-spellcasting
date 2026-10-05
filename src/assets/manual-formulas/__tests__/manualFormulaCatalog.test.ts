import { describe, expect, it } from "vitest";
import { ALL_MANUAL_FORMULAS, classifySpellCatalogEntry, DDB_55E_DIRECTORY_PROGRESS, DDB_55E_MECHANICS_PROGRESS, DDB_55E_SPELL_DIRECTORY, DND_SOURCEBOOK_SPELLS, getDdb55eDirectoryCoverage, getRulesEditionForSourcebook, getSpellManualCoverage, MANUAL_FORMULA_COVERAGE, SORCERER_CLASS_FORMULAS, vsspp2SpellOverrides } from "..";

describe("manual formula catalog", () => {
    it("exposes spell, cantrip, and class-feature records through one registry", () => {
        const kinds = new Set(Object.values(ALL_MANUAL_FORMULAS).map(record => record.kind));

        expect(kinds).toContain("spell");
        expect(kinds).toContain("cantrip");
        expect(kinds).toContain("class_feature");
    });

    it("reports partial coverage without implying the manual spell list is complete", () => {
        expect(MANUAL_FORMULA_COVERAGE.cantrips.count).toBeGreaterThan(0);
        expect(MANUAL_FORMULA_COVERAGE.spells.count).toBeGreaterThan(0);
        expect(MANUAL_FORMULA_COVERAGE.actions.status).toBe("not-started");
        expect(MANUAL_FORMULA_COVERAGE.classFeatures.count).toBeGreaterThanOrEqual(11);
    });

    it("keeps 5.5e directory discovery separate from per-spell mechanics progress", () => {
        expect(DDB_55E_DIRECTORY_PROGRESS).toMatchObject({
            directoryEntries: 444,
            pagesReviewed: 23,
            legacyBadgeExcluded: true,
            catalogStatus: "complete",
            mechanicsReviewStatus: "in-progress"
        });
        expect(DDB_55E_SPELL_DIRECTORY).toHaveLength(444);
        expect(new Set(DDB_55E_SPELL_DIRECTORY.map(spell => spell.id)).size).toBe(444);
        expect(new Set(DDB_55E_SPELL_DIRECTORY.map(spell => spell.ddbId)).size).toBe(444);
        expect(DDB_55E_SPELL_DIRECTORY.every(spell => spell.legacyBadge === false)).toBe(true);
        expect(getDdb55eDirectoryCoverage()).toHaveLength(444);
        expect(DDB_55E_MECHANICS_PROGRESS).toMatchObject({
            total: 444,
            verified: 0,
            needsReview: 444,
            notStarted: 0,
            status: "in-progress"
        });
        expect(DDB_55E_MECHANICS_PROGRESS.verified + DDB_55E_MECHANICS_PROGRESS.needsReview + DDB_55E_MECHANICS_PROGRESS.notStarted).toBe(444);
    });

    it("builds a deduplicated per-source review queue for accessible spells", () => {
        const spell = {
            id: "sorcerous_burst",
            name: "Sorcerous Burst",
            level: 0,
            school: "Evocation",
            source: "class" as const,
            rulesEdition: "2024" as const,
            description: "",
            castingTime: "1 Action",
            range: 120,
            rangeText: "120 ft",
            duration: "Instantaneous",
            components: "V, S",
            concentration: false,
            ritual: false,
            canUpcast: false,
            isPrepared: true
        };
        const queue = getSpellManualCoverage([spell, spell]);

        expect(queue).toEqual([{
            id: "sorcerous_burst",
            name: "Sorcerous Burst",
            level: 0,
            sourceBook: "Player's Handbook (2024), pg. 318",
            rulesEdition: "2024",
            status: "needs-review"
        }]);
    });

    it("recognizes Valda's Player Pack 2 as 2024 rules under the Mage Hand Press category", () => {
        expect(getRulesEditionForSourcebook("Valda’s Spire of Secrets: Player Pack 2")).toBe("2024");
        expect(getRulesEditionForSourcebook("A different Mage Hand Press book")).toBe("unknown");
    });

    it("adds Arcane Vigor with Hit Dice expenditure and upcast limit documented", () => {
        const arcaneVigor = ALL_MANUAL_FORMULAS.arcane_vigor;

        expect(arcaneVigor?.kind).toBe("spell");
        if (arcaneVigor?.kind === "spell") {
            expect(arcaneVigor.formula.category.classes).toEqual(["artificer", "sorcerer", "wizard"]);
            expect(arcaneVigor.formula.category.level).toBe(2);
            expect(arcaneVigor.formula.upcasting?.notes).toContain("maximum number of Hit Dice");
            expect(arcaneVigor.formula.implementation?.runtimeStatus).toBe("manual");
            expect(arcaneVigor.formula.implementation?.manualSteps).toHaveLength(3);
        }
    });

    it("records the next eight reviewed 2024 level-two spell formulas", () => {
        const ids = ["alter_self", "animal_messenger", "arcane_lock", "barkskin", "blur", "darkvision", "enthrall", "find_traps"];
        for (const id of ids) {
            expect(ALL_MANUAL_FORMULAS[id]?.kind).toBe("spell");
            const formula = ALL_MANUAL_FORMULAS[id];
            if (formula?.kind === "spell") {
                expect(formula.formula.category.level).toBe(2);
                expect(formula.formula.category.source).toContain("2024");
                expect(formula.formula.isManualOverride).toBe(true);
            }
        }
        expect(ALL_MANUAL_FORMULAS.animal_messenger?.kind === "spell" && ALL_MANUAL_FORMULAS.animal_messenger.formula.interaction?.saveAbility).toBe("CHA");
        expect(ALL_MANUAL_FORMULAS.barkskin?.kind === "spell" && ALL_MANUAL_FORMULAS.barkskin.formula.casting.time).toBe("1 bonus action");
        expect(ALL_MANUAL_FORMULAS.enthrall?.kind === "spell" && ALL_MANUAL_FORMULAS.enthrall.formula.interaction?.saveAbility).toBe("WIS");
        expect(ALL_MANUAL_FORMULAS.find_traps?.kind === "spell" && ALL_MANUAL_FORMULAS.find_traps.formula.effectNotes?.[0]).toContain("not its location");
    });

    it("records five more 2024 level-two formulas and marks ongoing area effects", () => {
        const ids = ["gust_of_wind", "protection_from_poison", "silence", "spike_growth", "zone_of_truth"];
        for (const id of ids) {
            const record = ALL_MANUAL_FORMULAS[id];
            expect(record?.kind).toBe("spell");
            if (record?.kind === "spell") {
                expect(record.formula.category.level).toBe(2);
                expect(record.formula.category.source).toContain("2024");
                expect(record.formula.isManualOverride).toBe(true);
            }
        }
        expect(ALL_MANUAL_FORMULAS.silence?.kind === "spell" && ALL_MANUAL_FORMULAS.silence.formula.category.ritual).toBe(true);
        expect(ALL_MANUAL_FORMULAS.spike_growth?.kind === "spell" && ALL_MANUAL_FORMULAS.spike_growth.formula.effectNotes?.[0]).toContain("every 5 feet");
        expect(ALL_MANUAL_FORMULAS.zone_of_truth?.kind === "spell" && ALL_MANUAL_FORMULAS.zone_of_truth.formula.interaction?.saveAbility).toBe("CHA");
    });

    it("uses checked Player's Handbook citations for 2024 spell sources", () => {
        for (const [id, page] of [["mirror_image", 299], ["see_invisibility", 314]] as const) {
            const record = ALL_MANUAL_FORMULAS[id];
            expect(record?.kind).toBe("spell");
            if (record?.kind === "spell") {
                expect(record.formula.category.source).toBe(`Player's Handbook (2024), pg. ${page}`);
            }
        }
    });

    it("records Dissonant Whispers damage, save, upcasting, and forced movement", () => {
        const record = ALL_MANUAL_FORMULAS.dissonant_whispers;

        expect(record?.kind).toBe("spell");
        if (record?.kind === "spell") {
            expect(record.formula.category.source).toBe("Player's Handbook (2024), pg. 264");
            expect(record.formula.interaction).toMatchObject({ type: "save", saveAbility: "WIS" });
            expect(record.formula.damage).toEqual([{ dice: "3d6", type: "psychic", isBase: true }]);
            expect(record.formula.upcasting?.perSlotLevel).toEqual({ dice: "1d6", type: "psychic" });
            expect(record.formula.effectNotes?.[0]).toContain("Reaction");
            expect(record.formula.implementation?.playtestStatus).toBe("not-tested");
        }
        expect(DDB_55E_MECHANICS_PROGRESS).toMatchObject({ needsReview: 444, notStarted: 0 });
    });

    it("records the verified E spells and starts F with Fabricate", () => {
        const expected = ["earthquake", "ensnaring_strike", "etherealness", "evards_black_tentacles", "eyebite", "fabricate"];
        for (const id of expected) {
            const record = ALL_MANUAL_FORMULAS[id];
            expect(record?.kind, id).toBe("spell");
            if (record?.kind === "spell") {
                expect(record.formula.category.source, id).toContain("Player's Handbook (2024)");
                expect(record.formula.implementation?.sourceStatus, id).toBe("checked");
                expect(record.formula.implementation?.playtestStatus, id).toBe("not-tested");
                expect(record.formula.implementation?.manualSteps.length, id).toBeGreaterThan(0);
            }
        }
        expect(ALL_MANUAL_FORMULAS.ensnaring_strike?.kind === "spell" && ALL_MANUAL_FORMULAS.ensnaring_strike.formula.upcasting?.perSlotLevel).toEqual({ dice: "1d6", type: "piercing" });
        expect(ALL_MANUAL_FORMULAS.earthquake?.kind === "spell" && ALL_MANUAL_FORMULAS.earthquake.formula.damage).toEqual(expect.arrayContaining([
            expect.objectContaining({ dice: "1d6", type: "bludgeoning" }),
            expect.objectContaining({ dice: "12d6", type: "bludgeoning" }),
        ]));
    });

    it("records the checked F spells with source and playtest states", () => {
        const expected = ["find_familiar", "find_steed", "find_the_path", "finger_of_death", "fire_shield", "fire_storm", "flame_strike", "flesh_to_stone", "forbiddance", "forcecage", "foresight"];
        for (const id of expected) {
            const record = ALL_MANUAL_FORMULAS[id];
            expect(record?.kind, id).toBe("spell");
            if (record?.kind === "spell") {
                expect(record.formula.category.source, id).toContain("Player's Handbook (2024)");
                expect(record.formula.implementation?.sourceStatus, id).toBe("checked");
                expect(record.formula.implementation?.playtestStatus, id).toBe("not-tested");
                expect(record.formula.implementation?.manualSteps.length, id).toBeGreaterThan(0);
            }
        }
        expect(ALL_MANUAL_FORMULAS.finger_of_death?.kind === "spell" && ALL_MANUAL_FORMULAS.finger_of_death.formula.damage[0]).toMatchObject({ dice: "7d8 + 30", type: "necrotic" });
        expect(ALL_MANUAL_FORMULAS.flame_strike?.kind === "spell" && ALL_MANUAL_FORMULAS.flame_strike.formula.damage).toEqual(expect.arrayContaining([
            expect.objectContaining({ dice: "5d6", type: "fire" }),
            expect.objectContaining({ dice: "5d6", type: "radiant" }),
        ]));
    });

    it("records the verified G Free Rules spells without marking them playtested", () => {
        const expected = ["gaseous_form", "gate", "giant_insect", "glibness", "globe_of_invulnerability", "glyph_of_warding", "greater_invisibility", "guardian_of_faith", "guards_and_wards"];
        for (const id of expected) {
            const record = ALL_MANUAL_FORMULAS[id];
            expect(record?.kind, id).toBe("spell");
            if (record?.kind === "spell") {
                expect(record.formula.category.source, id).toContain("Player's Handbook (2024)");
                expect(record.formula.implementation?.sourceStatus, id).toBe("checked");
                expect(record.formula.implementation?.playtestStatus, id).toBe("not-tested");
                expect(record.formula.implementation?.manualSteps.length, id).toBeGreaterThan(0);
            }
        }
        expect(ALL_MANUAL_FORMULAS.glyph_of_warding?.kind === "spell" && ALL_MANUAL_FORMULAS.glyph_of_warding.formula.damage[0]).toMatchObject({ dice: "5d8", type: "acid" });
        expect(ALL_MANUAL_FORMULAS.greater_invisibility?.kind === "spell" && ALL_MANUAL_FORMULAS.greater_invisibility.formula.casting.duration).toBe("Concentration, up to 1 minute");
    });

    it("records the checked H Free Rules spells and their distinct 2024 mechanics", () => {
        const expected = ["hallow", "hallucinatory_terrain", "harm", "haste", "heal", "hellish_rebuke", "heroes_feast", "heroism", "hex", "hold_monster", "holy_aura", "hunters_mark", "hypnotic_pattern"];
        for (const id of expected) {
            const record = ALL_MANUAL_FORMULAS[id];
            expect(record?.kind, id).toBe("spell");
            if (record?.kind === "spell") {
                expect(record.formula.category.source, id).toContain("Player's Handbook (2024)");
                expect(record.formula.implementation?.sourceStatus, id).toBe("checked");
                expect(record.formula.implementation?.playtestStatus, id).toBe("not-tested");
                expect(record.formula.implementation?.manualSteps.length, id).toBeGreaterThan(0);
            }
        }
        expect(ALL_MANUAL_FORMULAS.hex?.kind === "spell" && ALL_MANUAL_FORMULAS.hex.formula.damage[0]).toMatchObject({ dice: "1d6", type: "necrotic" });
        expect(ALL_MANUAL_FORMULAS.hunters_mark?.kind === "spell" && ALL_MANUAL_FORMULAS.hunters_mark.formula.damage[0]).toMatchObject({ dice: "1d6", type: "force" });
        expect(ALL_MANUAL_FORMULAS.haste?.kind === "spell" && ALL_MANUAL_FORMULAS.haste.formula.effectNotes?.[1]).toContain("Incapacitated");
    });

    it("records the checked I Free Rules spells with scaling and manual triggers", () => {
        const expected = ["ice_storm", "illusory_script", "imprisonment", "incendiary_cloud", "insect_plague"];
        for (const id of expected) {
            const record = ALL_MANUAL_FORMULAS[id];
            expect(record?.kind, id).toBe("spell");
            if (record?.kind === "spell") {
                expect(record.formula.category.source, id).toContain("Player's Handbook (2024)");
                expect(record.formula.implementation?.sourceStatus, id).toBe("checked");
                expect(record.formula.implementation?.playtestStatus, id).toBe("not-tested");
                expect(record.formula.implementation?.manualSteps.length, id).toBeGreaterThan(0);
            }
        }
        expect(ALL_MANUAL_FORMULAS.ice_storm?.kind === "spell" && ALL_MANUAL_FORMULAS.ice_storm.formula.damage).toHaveLength(2);
        expect(ALL_MANUAL_FORMULAS.imprisonment?.kind === "spell" && ALL_MANUAL_FORMULAS.imprisonment.formula.effectNotes?.[0]).toContain("Minimus Containment");
        expect(ALL_MANUAL_FORMULAS.insect_plague?.kind === "spell" && ALL_MANUAL_FORMULAS.insect_plague.formula.upcasting?.perSlotLevel).toEqual({ dice: "1d10", type: "piercing" });
    });

    it("records the checked L Free Rules spells with area, components, and manual triggers", () => {
        const expected = ["legend_lore", "leomunds_secret_chest", "leomunds_tiny_hut", "locate_animals_or_plants", "locate_creature"];
        for (const id of expected) {
            const record = ALL_MANUAL_FORMULAS[id];
            expect(record?.kind, id).toBe("spell");
            if (record?.kind === "spell") {
                expect(record.formula.category.source, id).toMatch(/^Player's Handbook \(2024\), pg\. \d+$/);
                expect(record.formula.implementation?.sourceStatus, id).toBe("checked");
                expect(record.formula.implementation?.playtestStatus, id).toBe("not-tested");
                expect(record.formula.implementation?.manualSteps.length, id).toBeGreaterThan(0);
            }
        }
        expect(ALL_MANUAL_FORMULAS.locate_animals_or_plants?.kind === "spell" && ALL_MANUAL_FORMULAS.locate_animals_or_plants.formula.category.source).toBe("Player's Handbook (2024), pg. 292");
        expect(ALL_MANUAL_FORMULAS.legend_lore?.kind === "spell" && ALL_MANUAL_FORMULAS.legend_lore.formula.notes).toContain("trombone");
        expect(ALL_MANUAL_FORMULAS.leomunds_secret_chest?.kind === "spell" && ALL_MANUAL_FORMULAS.leomunds_secret_chest.formula.effectNotes?.[2]).toContain("cumulative 5%");
        expect(ALL_MANUAL_FORMULAS.leomunds_tiny_hut?.kind === "spell" && ALL_MANUAL_FORMULAS.leomunds_tiny_hut.formula.category.school).toBe("evocation");
        expect(ALL_MANUAL_FORMULAS.leomunds_tiny_hut?.kind === "spell" && ALL_MANUAL_FORMULAS.leomunds_tiny_hut.formula.category.ritual).toBe(true);
        expect(ALL_MANUAL_FORMULAS.locate_animals_or_plants?.kind === "spell" && ALL_MANUAL_FORMULAS.locate_animals_or_plants.formula.category.ritual).toBe(true);
        expect(ALL_MANUAL_FORMULAS.locate_creature?.kind === "spell" && ALL_MANUAL_FORMULAS.locate_creature.formula.category.concentration).toBe(true);
    });

    it("records the checked M Free Rules spells with container, triggers, and area scaling", () => {
        const expected = ["magic_circle", "magic_jar", "magic_mouth", "major_image", "mass_cure_wounds"];
        for (const id of expected) {
            const record = ALL_MANUAL_FORMULAS[id];
            expect(record?.kind, id).toBe("spell");
            if (record?.kind === "spell") {
                expect(record.formula.category.source, id).toContain("Player's Handbook (2024)");
                expect(record.formula.implementation?.sourceStatus, id).toBe("checked");
                expect(record.formula.implementation?.playtestStatus, id).toBe("not-tested");
                expect(record.formula.implementation?.manualSteps.length, id).toBeGreaterThan(0);
            }
        }
        expect(ALL_MANUAL_FORMULAS.magic_circle?.kind === "spell" && ALL_MANUAL_FORMULAS.magic_circle.formula.area?.shape).toBe("Cylinder");
        expect(ALL_MANUAL_FORMULAS.magic_jar?.kind === "spell" && ALL_MANUAL_FORMULAS.magic_jar.formula.interaction?.saveAbility).toBe("CHA");
        expect(ALL_MANUAL_FORMULAS.magic_mouth?.kind === "spell" && ALL_MANUAL_FORMULAS.magic_mouth.formula.category.ritual).toBe(true);
        expect(ALL_MANUAL_FORMULAS.major_image?.kind === "spell" && ALL_MANUAL_FORMULAS.major_image.formula.area?.shape).toBe("Cube");
        expect(ALL_MANUAL_FORMULAS.mass_cure_wounds?.kind === "spell" && ALL_MANUAL_FORMULAS.mass_cure_wounds.formula.category.school).toBe("abjuration");
        expect(ALL_MANUAL_FORMULAS.mass_cure_wounds?.kind === "spell" && ALL_MANUAL_FORMULAS.mass_cure_wounds.formula.damage[0]?.dice).toBe("5d8");
    });

    it("records the checked M2 Free Rules spells with healing pools, maze escapes, and acid riders", () => {
        const expected = ["mass_heal", "mass_healing_word", "mass_suggestion", "maze", "meld_into_stone", "melfs_acid_arrow"];
        for (const id of expected) {
            const record = ALL_MANUAL_FORMULAS[id];
            expect(record?.kind, id).toBe("spell");
            if (record?.kind === "spell") {
                expect(record.formula.category.source, id).toContain("Player's Handbook (2024)");
                expect(record.formula.implementation?.sourceStatus, id).toBe("checked");
                expect(record.formula.implementation?.playtestStatus, id).toBe("not-tested");
                expect(record.formula.implementation?.manualSteps.length, id).toBeGreaterThan(0);
            }
        }
        expect(ALL_MANUAL_FORMULAS.mass_heal?.kind === "spell" && ALL_MANUAL_FORMULAS.mass_heal.formula.damage[0]?.dice).toBe("700");
        expect(ALL_MANUAL_FORMULAS.mass_healing_word?.kind === "spell" && ALL_MANUAL_FORMULAS.mass_healing_word.formula.casting.time).toBe("Bonus Action");
        expect(ALL_MANUAL_FORMULAS.mass_suggestion?.kind === "spell" && ALL_MANUAL_FORMULAS.mass_suggestion.formula.interaction?.saveAbility).toBe("WIS");
        expect(ALL_MANUAL_FORMULAS.maze?.kind === "spell" && ALL_MANUAL_FORMULAS.maze.formula.effectNotes?.[1]).toContain("DC 20");
        expect(ALL_MANUAL_FORMULAS.meld_into_stone?.kind === "spell" && ALL_MANUAL_FORMULAS.meld_into_stone.formula.category.ritual).toBe(true);
        expect(ALL_MANUAL_FORMULAS.melfs_acid_arrow?.kind === "spell" && ALL_MANUAL_FORMULAS.melfs_acid_arrow.formula.damage).toHaveLength(2);
    });

    it("records the checked M3 Free Rules spells with meteor areas, psionic tracking, and mind protections", () => {
        const expected = ["meteor_swarm", "mind_blank", "mind_spike", "mirage_arcane", "mislead", "modify_memory"];
        for (const id of expected) {
            const record = ALL_MANUAL_FORMULAS[id];
            expect(record?.kind, id).toBe("spell");
            if (record?.kind === "spell") {
                expect(record.formula.category.source, id).toContain("Player's Handbook (2024)");
                expect(record.formula.implementation?.sourceStatus, id).toBe("checked");
                expect(record.formula.implementation?.playtestStatus, id).toBe("not-tested");
                expect(record.formula.implementation?.manualSteps.length, id).toBeGreaterThan(0);
            }
        }
        expect(ALL_MANUAL_FORMULAS.meteor_swarm?.kind === "spell" && ALL_MANUAL_FORMULAS.meteor_swarm.formula.damage).toHaveLength(2);
        expect(ALL_MANUAL_FORMULAS.mind_blank?.kind === "spell" && ALL_MANUAL_FORMULAS.mind_blank.formula.casting.duration).toBe("24 hours");
        expect(ALL_MANUAL_FORMULAS.mind_spike?.kind === "spell" && ALL_MANUAL_FORMULAS.mind_spike.formula.category.school).toBe("divination");
        expect(ALL_MANUAL_FORMULAS.mind_spike?.kind === "spell" && ALL_MANUAL_FORMULAS.mind_spike.formula.category.concentration).toBe(true);
        expect(ALL_MANUAL_FORMULAS.mirage_arcane?.kind === "spell" && ALL_MANUAL_FORMULAS.mirage_arcane.formula.casting.duration).toBe("10 days");
        expect(ALL_MANUAL_FORMULAS.mislead?.kind === "spell" && ALL_MANUAL_FORMULAS.mislead.formula.category.concentration).toBe(true);
        expect(ALL_MANUAL_FORMULAS.modify_memory?.kind === "spell" && ALL_MANUAL_FORMULAS.modify_memory.formula.interaction?.saveAbility).toBe("WIS");
    });

    it("records the checked M4 Free Rules spells with faithful watchdog, magnificent mansion, private sanctum, spectral sword, and terrain reshaping", () => {
        const expected = ["mordenkainens_faithful_hound", "mordenkainens_magnificent_mansion", "mordenkainens_private_sanctum", "mordenkainens_sword", "move_earth"];
        for (const id of expected) {
            const record = ALL_MANUAL_FORMULAS[id];
            expect(record?.kind, id).toBe("spell");
            if (record?.kind === "spell") {
                expect(record.formula.category.source, id).toContain("Player's Handbook (2024)");
                expect(record.formula.implementation?.sourceStatus, id).toBe("checked");
                expect(record.formula.implementation?.playtestStatus, id).toBe("not-tested");
                expect(record.formula.implementation?.manualSteps.length, id).toBeGreaterThan(0);
            }
        }
        expect(ALL_MANUAL_FORMULAS.mordenkainens_faithful_hound?.kind === "spell" && ALL_MANUAL_FORMULAS.mordenkainens_faithful_hound.formula.damage[0]?.dice).toBe("4d8");
        expect(ALL_MANUAL_FORMULAS.mordenkainens_faithful_hound?.kind === "spell" && ALL_MANUAL_FORMULAS.mordenkainens_faithful_hound.formula.casting.duration).toBe("8 hours");
        expect(ALL_MANUAL_FORMULAS.mordenkainens_magnificent_mansion?.kind === "spell" && ALL_MANUAL_FORMULAS.mordenkainens_magnificent_mansion.formula.casting.range).toBe("300 ft.");
        expect(ALL_MANUAL_FORMULAS.mordenkainens_private_sanctum?.kind === "spell" && ALL_MANUAL_FORMULAS.mordenkainens_private_sanctum.formula.area?.shape).toBe("Cube");
        expect(ALL_MANUAL_FORMULAS.mordenkainens_sword?.kind === "spell" && ALL_MANUAL_FORMULAS.mordenkainens_sword.formula.category.concentration).toBe(true);
        expect(ALL_MANUAL_FORMULAS.mordenkainens_sword?.kind === "spell" && ALL_MANUAL_FORMULAS.mordenkainens_sword.formula.damage[0]?.dice).toBe("4d12");
        expect(ALL_MANUAL_FORMULAS.move_earth?.kind === "spell" && ALL_MANUAL_FORMULAS.move_earth.formula.category.concentration).toBe(true);
    });

    it("records the checked N & O Free Rules spells with divination wards, magic aura deception, and spheres", () => {
        const expected = ["nondetection", "nystuls_magic_aura", "otilukes_freezing_sphere", "otilukes_resilient_sphere", "ottos_irresistible_dance"];
        for (const id of expected) {
            const record = ALL_MANUAL_FORMULAS[id];
            expect(record?.kind, id).toBe("spell");
            if (record?.kind === "spell") {
                expect(record.formula.category.source, id).toContain("Player's Handbook (2024)");
                expect(record.formula.implementation?.sourceStatus, id).toBe("checked");
                expect(record.formula.implementation?.playtestStatus, id).toBe("not-tested");
                expect(record.formula.implementation?.manualSteps.length, id).toBeGreaterThan(0);
            }
        }
        expect(ALL_MANUAL_FORMULAS.nondetection?.kind === "spell" && ALL_MANUAL_FORMULAS.nondetection.formula.category.school).toBe("abjuration");
        expect(ALL_MANUAL_FORMULAS.nystuls_magic_aura?.kind === "spell" && ALL_MANUAL_FORMULAS.nystuls_magic_aura.formula.casting.duration).toBe("24 hours");
        expect(ALL_MANUAL_FORMULAS.otilukes_freezing_sphere?.kind === "spell" && ALL_MANUAL_FORMULAS.otilukes_freezing_sphere.formula.damage[0]?.dice).toBe("10d6");
        expect(ALL_MANUAL_FORMULAS.otilukes_resilient_sphere?.kind === "spell" && ALL_MANUAL_FORMULAS.otilukes_resilient_sphere.formula.category.school).toBe("abjuration");
        expect(ALL_MANUAL_FORMULAS.otilukes_resilient_sphere?.kind === "spell" && ALL_MANUAL_FORMULAS.otilukes_resilient_sphere.formula.category.concentration).toBe(true);
        expect(ALL_MANUAL_FORMULAS.ottos_irresistible_dance?.kind === "spell" && ALL_MANUAL_FORMULAS.ottos_irresistible_dance.formula.category.concentration).toBe(true);
        expect(ALL_MANUAL_FORMULAS.ottos_irresistible_dance?.kind === "spell" && ALL_MANUAL_FORMULAS.ottos_irresistible_dance.formula.interaction?.saveAbility).toBe("WIS");
    });

    it("records the checked P1 Free Rules spells with passages, phantasms, phantom steed, and planar summons/bindings", () => {
        const expected = ["passwall", "phantasmal_force", "phantasmal_killer", "phantom_steed", "planar_ally", "planar_binding"];
        for (const id of expected) {
            const record = ALL_MANUAL_FORMULAS[id];
            expect(record?.kind, id).toBe("spell");
            if (record?.kind === "spell") {
                expect(record.formula.category.source, id).toContain("Player's Handbook (2024)");
                expect(record.formula.implementation?.sourceStatus, id).toBe("checked");
                expect(record.formula.implementation?.playtestStatus, id).toBe("not-tested");
                expect(record.formula.implementation?.manualSteps.length, id).toBeGreaterThan(0);
            }
        }
        expect(ALL_MANUAL_FORMULAS.passwall?.kind === "spell" && ALL_MANUAL_FORMULAS.passwall.formula.casting.duration).toBe("1 hour");
        expect(ALL_MANUAL_FORMULAS.phantasmal_force?.kind === "spell" && ALL_MANUAL_FORMULAS.phantasmal_force.formula.interaction?.saveAbility).toBe("INT");
        expect(ALL_MANUAL_FORMULAS.phantasmal_killer?.kind === "spell" && ALL_MANUAL_FORMULAS.phantasmal_killer.formula.damage[0]?.dice).toBe("4d10");
        expect(ALL_MANUAL_FORMULAS.phantom_steed?.kind === "spell" && ALL_MANUAL_FORMULAS.phantom_steed.formula.category.ritual).toBe(true);
        expect(ALL_MANUAL_FORMULAS.planar_ally?.kind === "spell" && ALL_MANUAL_FORMULAS.planar_ally.formula.category.school).toBe("conjuration");
        expect(ALL_MANUAL_FORMULAS.planar_binding?.kind === "spell" && ALL_MANUAL_FORMULAS.planar_binding.formula.interaction?.saveAbility).toBe("CHA");
    });

    it("records the checked P2 Free Rules spells with plane shift, plant growth, polymorph, and power words", () => {
        const expected = ["plane_shift", "plant_growth", "polymorph", "power_word_heal", "power_word_kill", "power_word_stun"];
        for (const id of expected) {
            const record = ALL_MANUAL_FORMULAS[id];
            expect(record?.kind, id).toBe("spell");
            if (record?.kind === "spell") {
                expect(record.formula.category.source, id).toContain("Player's Handbook (2024)");
                expect(record.formula.implementation?.sourceStatus, id).toBe("checked");
                expect(record.formula.implementation?.playtestStatus, id).toBe("not-tested");
                expect(record.formula.implementation?.manualSteps.length, id).toBeGreaterThan(0);
            }
        }
        expect(ALL_MANUAL_FORMULAS.plane_shift?.kind === "spell" && ALL_MANUAL_FORMULAS.plane_shift.formula.category.school).toBe("conjuration");
        expect(ALL_MANUAL_FORMULAS.plant_growth?.kind === "spell" && ALL_MANUAL_FORMULAS.plant_growth.formula.area?.shape).toBe("Sphere");
        expect(ALL_MANUAL_FORMULAS.polymorph?.kind === "spell" && ALL_MANUAL_FORMULAS.polymorph.formula.effectNotes?.[2]).toContain("Temporary Hit Points");
        expect(ALL_MANUAL_FORMULAS.power_word_heal?.kind === "spell" && ALL_MANUAL_FORMULAS.power_word_heal.formula.casting.duration).toBe("Instantaneous");
        expect(ALL_MANUAL_FORMULAS.power_word_kill?.kind === "spell" && ALL_MANUAL_FORMULAS.power_word_kill.formula.damage[0]?.dice).toBe("12d12");
        expect(ALL_MANUAL_FORMULAS.power_word_stun?.kind === "spell" && ALL_MANUAL_FORMULAS.power_word_stun.formula.interaction?.saveAbility).toBe("CON");
    });

    it("records the checked P3 Free Rules spells with prismatic rays, prismatic wall layers, programmed illusions, and energy protections", () => {
        const expected = ["prismatic_spray", "prismatic_wall", "programmed_illusion", "project_image", "protection_from_energy"];
        for (const id of expected) {
            const record = ALL_MANUAL_FORMULAS[id];
            expect(record?.kind, id).toBe("spell");
            if (record?.kind === "spell") {
                expect(record.formula.category.source, id).toContain("Player's Handbook (2024)");
                expect(record.formula.implementation?.sourceStatus, id).toBe("checked");
                expect(record.formula.implementation?.playtestStatus, id).toBe("not-tested");
                expect(record.formula.implementation?.manualSteps.length, id).toBeGreaterThan(0);
            }
        }
        expect(ALL_MANUAL_FORMULAS.prismatic_spray?.kind === "spell" && ALL_MANUAL_FORMULAS.prismatic_spray.formula.damage[0]?.dice).toBe("12d6");
        expect(ALL_MANUAL_FORMULAS.prismatic_wall?.kind === "spell" && ALL_MANUAL_FORMULAS.prismatic_wall.formula.category.concentration).toBe(false);
        expect(ALL_MANUAL_FORMULAS.programmed_illusion?.kind === "spell" && ALL_MANUAL_FORMULAS.programmed_illusion.formula.area?.shape).toBe("Cube");
        expect(ALL_MANUAL_FORMULAS.project_image?.kind === "spell" && ALL_MANUAL_FORMULAS.project_image.formula.casting.range).toBe("500 miles");
        expect(ALL_MANUAL_FORMULAS.protection_from_energy?.kind === "spell" && ALL_MANUAL_FORMULAS.protection_from_energy.formula.casting.duration).toBe("Concentration, up to 1 hour");
    });

    it("records the checked R1 Free Rules spells with revival penalties, telepathic bonds, ray mechanics, and regeneration", () => {
        const expected = ["raise_dead", "rarys_telepathic_bond", "ray_of_enfeeblement", "ray_of_sickness", "regenerate", "reincarnate"];
        for (const id of expected) {
            const record = ALL_MANUAL_FORMULAS[id];
            expect(record?.kind, id).toBe("spell");
            if (record?.kind === "spell") {
                expect(record.formula.category.source, id).toContain("Player's Handbook (2024)");
                expect(record.formula.implementation?.sourceStatus, id).toBe("checked");
                expect(record.formula.implementation?.playtestStatus, id).toBe("not-tested");
                expect(record.formula.implementation?.manualSteps.length, id).toBeGreaterThan(0);
            }
        }
        expect(ALL_MANUAL_FORMULAS.raise_dead?.kind === "spell" && ALL_MANUAL_FORMULAS.raise_dead.formula.category.school).toBe("necromancy");
        expect(ALL_MANUAL_FORMULAS.rarys_telepathic_bond?.kind === "spell" && ALL_MANUAL_FORMULAS.rarys_telepathic_bond.formula.category.ritual).toBe(true);
        expect(ALL_MANUAL_FORMULAS.ray_of_enfeeblement?.kind === "spell" && ALL_MANUAL_FORMULAS.ray_of_enfeeblement.formula.interaction?.saveAbility).toBe("CON");
        expect(ALL_MANUAL_FORMULAS.ray_of_sickness?.kind === "spell" && ALL_MANUAL_FORMULAS.ray_of_sickness.formula.interaction?.type).toBe("spell_attack");
        expect(ALL_MANUAL_FORMULAS.regenerate?.kind === "spell" && ALL_MANUAL_FORMULAS.regenerate.formula.category.concentration).toBe(false);
        expect(ALL_MANUAL_FORMULAS.reincarnate?.kind === "spell" && ALL_MANUAL_FORMULAS.reincarnate.formula.category.classes).toEqual(["druid"]);
    });

    it("records the checked R2 Free Rules spells with curse breaks, full resurrection, reversed gravity, revivify, and rope trick", () => {
        const expected = ["remove_curse", "resurrection", "reverse_gravity", "revivify", "rope_trick"];
        for (const id of expected) {
            const record = ALL_MANUAL_FORMULAS[id];
            expect(record?.kind, id).toBe("spell");
            if (record?.kind === "spell") {
                expect(record.formula.category.source, id).toContain("Player's Handbook (2024)");
                expect(record.formula.implementation?.sourceStatus, id).toBe("checked");
                expect(record.formula.implementation?.playtestStatus, id).toBe("not-tested");
                expect(record.formula.implementation?.manualSteps.length, id).toBeGreaterThan(0);
            }
        }
        expect(ALL_MANUAL_FORMULAS.remove_curse?.kind === "spell" && ALL_MANUAL_FORMULAS.remove_curse.formula.category.school).toBe("abjuration");
        expect(ALL_MANUAL_FORMULAS.resurrection?.kind === "spell" && ALL_MANUAL_FORMULAS.resurrection.formula.casting.duration).toBe("Instantaneous");
        expect(ALL_MANUAL_FORMULAS.reverse_gravity?.kind === "spell" && ALL_MANUAL_FORMULAS.reverse_gravity.formula.area?.shape).toBe("Cylinder");
        expect(ALL_MANUAL_FORMULAS.revivify?.kind === "spell" && ALL_MANUAL_FORMULAS.revivify.formula.casting.time).toBe("1 action");
        expect(ALL_MANUAL_FORMULAS.rope_trick?.kind === "spell" && ALL_MANUAL_FORMULAS.rope_trick.formula.category.concentration).toBe(false);
    });

    it("records the checked S1 Free Rules spells with scorching rays, scrying modifiers, smites, and sequestering", () => {
        const expected = ["scorching_ray", "scrying", "searing_smite", "seeming", "sending", "sequester"];
        for (const id of expected) {
            const record = ALL_MANUAL_FORMULAS[id];
            expect(record?.kind, id).toBe("spell");
            if (record?.kind === "spell") {
                expect(record.formula.category.source, id).toContain("Player's Handbook (2024)");
                expect(record.formula.implementation?.sourceStatus, id).toBe("checked");
                expect(record.formula.implementation?.playtestStatus, id).toBe("not-tested");
                expect(record.formula.implementation?.manualSteps.length, id).toBeGreaterThan(0);
            }
        }
        expect(ALL_MANUAL_FORMULAS.scorching_ray?.kind === "spell" && ALL_MANUAL_FORMULAS.scorching_ray.formula.damage[0]?.dice).toBe("2d6");
        expect(ALL_MANUAL_FORMULAS.scrying?.kind === "spell" && ALL_MANUAL_FORMULAS.scrying.formula.interaction?.saveAbility).toBe("WIS");
        expect(ALL_MANUAL_FORMULAS.searing_smite?.kind === "spell" && ALL_MANUAL_FORMULAS.searing_smite.formula.category.concentration).toBe(false);
        expect(ALL_MANUAL_FORMULAS.seeming?.kind === "spell" && ALL_MANUAL_FORMULAS.seeming.formula.casting.duration).toBe("8 hours");
        expect(ALL_MANUAL_FORMULAS.sending?.kind === "spell" && ALL_MANUAL_FORMULAS.sending.formula.casting.range).toBe("Unlimited");
        expect(ALL_MANUAL_FORMULAS.sequester?.kind === "spell" && ALL_MANUAL_FORMULAS.sequester.formula.category.school).toBe("transmutation");
    });

    it("records the checked S2 Free Rules spells with shapechange temp HP, glowing smites, simulacrum, and control", () => {
        const expected = ["shapechange", "shining_smite", "silent_image", "simulacrum", "sleet_storm", "slow"];
        for (const id of expected) {
            const record = ALL_MANUAL_FORMULAS[id];
            expect(record?.kind, id).toBe("spell");
            if (record?.kind === "spell") {
                expect(record.formula.category.source, id).toContain("Player's Handbook (2024)");
                expect(record.formula.implementation?.sourceStatus, id).toBe("checked");
                expect(record.formula.implementation?.playtestStatus, id).toBe("not-tested");
                expect(record.formula.implementation?.manualSteps.length, id).toBeGreaterThan(0);
            }
        }
        expect(ALL_MANUAL_FORMULAS.shapechange?.kind === "spell" && ALL_MANUAL_FORMULAS.shapechange.formula.effectNotes?.[1]).toContain("Temporary Hit Points");
        expect(ALL_MANUAL_FORMULAS.shining_smite?.kind === "spell" && ALL_MANUAL_FORMULAS.shining_smite.formula.damage[0]?.type).toBe("radiant");
        expect(ALL_MANUAL_FORMULAS.silent_image?.kind === "spell" && ALL_MANUAL_FORMULAS.silent_image.formula.area?.sizeFeet).toBe(15);
        expect(ALL_MANUAL_FORMULAS.simulacrum?.kind === "spell" && ALL_MANUAL_FORMULAS.simulacrum.formula.casting.time).toBe("12 hours");
        expect(ALL_MANUAL_FORMULAS.sleet_storm?.kind === "spell" && ALL_MANUAL_FORMULAS.sleet_storm.formula.area?.shape).toBe("Cylinder");
        expect(ALL_MANUAL_FORMULAS.slow?.kind === "spell" && ALL_MANUAL_FORMULAS.slow.formula.area?.shape).toBe("Cube");
    });

    it("records the checked S3 Free Rules spells with nature speech, spirit guardians emanation, stinking gas, and stone shaping", () => {
        const expected = ["speak_with_animals", "speak_with_dead", "speak_with_plants", "spirit_guardians", "stinking_cloud", "stone_shape"];
        for (const id of expected) {
            const record = ALL_MANUAL_FORMULAS[id];
            expect(record?.kind, id).toBe("spell");
            if (record?.kind === "spell") {
                expect(record.formula.category.source, id).toContain("Player's Handbook (2024)");
                expect(record.formula.implementation?.sourceStatus, id).toBe("checked");
                expect(record.formula.implementation?.playtestStatus, id).toBe("not-tested");
                expect(record.formula.implementation?.manualSteps.length, id).toBeGreaterThan(0);
            }
        }
        expect(ALL_MANUAL_FORMULAS.speak_with_animals?.kind === "spell" && ALL_MANUAL_FORMULAS.speak_with_animals.formula.category.ritual).toBe(true);
        expect(ALL_MANUAL_FORMULAS.speak_with_dead?.kind === "spell" && ALL_MANUAL_FORMULAS.speak_with_dead.formula.category.school).toBe("necromancy");
        expect(ALL_MANUAL_FORMULAS.speak_with_plants?.kind === "spell" && ALL_MANUAL_FORMULAS.speak_with_plants.formula.area?.shape).toBe("Emanation");
        expect(ALL_MANUAL_FORMULAS.spirit_guardians?.kind === "spell" && ALL_MANUAL_FORMULAS.spirit_guardians.formula.area?.shape).toBe("Emanation");
        expect(ALL_MANUAL_FORMULAS.stinking_cloud?.kind === "spell" && ALL_MANUAL_FORMULAS.stinking_cloud.formula.area?.shape).toBe("Sphere");
        expect(ALL_MANUAL_FORMULAS.stone_shape?.kind === "spell" && ALL_MANUAL_FORMULAS.stone_shape.formula.casting.duration).toBe("Instantaneous");
    });

    it("records the checked S4 Free Rules spells with stoneskin defenses, storm vengeance, summon dragon, and sun/symbol spells", () => {
        const expected = ["stoneskin", "storm_of_vengeance", "summon_dragon", "sunbeam", "sunburst", "symbol"];
        for (const id of expected) {
            const record = ALL_MANUAL_FORMULAS[id];
            expect(record?.kind, id).toBe("spell");
            if (record?.kind === "spell") {
                expect(record.formula.category.source, id).toContain("Player's Handbook (2024)");
                expect(record.formula.implementation?.sourceStatus, id).toBe("checked");
                expect(record.formula.implementation?.playtestStatus, id).toBe("not-tested");
                expect(record.formula.implementation?.manualSteps.length, id).toBeGreaterThan(0);
            }
        }
        expect(ALL_MANUAL_FORMULAS.stoneskin?.kind === "spell" && ALL_MANUAL_FORMULAS.stoneskin.formula.category.school).toBe("transmutation");
        expect(ALL_MANUAL_FORMULAS.storm_of_vengeance?.kind === "spell" && ALL_MANUAL_FORMULAS.storm_of_vengeance.formula.casting.range).toBe("1 mile");
        expect(ALL_MANUAL_FORMULAS.summon_dragon?.kind === "spell" && ALL_MANUAL_FORMULAS.summon_dragon.formula.category.school).toBe("conjuration");
        expect(ALL_MANUAL_FORMULAS.sunbeam?.kind === "spell" && ALL_MANUAL_FORMULAS.sunbeam.formula.damage[0]?.dice).toBe("6d8");
        expect(ALL_MANUAL_FORMULAS.sunburst?.kind === "spell" && ALL_MANUAL_FORMULAS.sunburst.formula.damage[0]?.dice).toBe("12d6");
        expect(ALL_MANUAL_FORMULAS.symbol?.kind === "spell" && ALL_MANUAL_FORMULAS.symbol.formula.category.school).toBe("abjuration");
    });

    it("records the checked T1 Free Rules spells with laughter, telekinesis, teleportation, disk, and time stop", () => {
        const expected = ["tashas_hideous_laughter", "telekinesis", "teleport", "teleportation_circle", "tensers_floating_disk", "time_stop"];
        for (const id of expected) {
            const record = ALL_MANUAL_FORMULAS[id];
            expect(record?.kind, id).toBe("spell");
            if (record?.kind === "spell") {
                expect(record.formula.category.source, id).toContain("Player's Handbook (2024)");
                expect(record.formula.implementation?.sourceStatus, id).toBe("checked");
                expect(record.formula.implementation?.playtestStatus, id).toBe("not-tested");
                expect(record.formula.implementation?.manualSteps.length, id).toBeGreaterThan(0);
            }
        }
        expect(ALL_MANUAL_FORMULAS.tashas_hideous_laughter?.kind === "spell" && ALL_MANUAL_FORMULAS.tashas_hideous_laughter.formula.category.school).toBe("enchantment");
        expect(ALL_MANUAL_FORMULAS.telekinesis?.kind === "spell" && ALL_MANUAL_FORMULAS.telekinesis.formula.interaction?.saveAbility).toBe("STR");
        expect(ALL_MANUAL_FORMULAS.teleport?.kind === "spell" && ALL_MANUAL_FORMULAS.teleport.formula.category.level).toBe(7);
        expect(ALL_MANUAL_FORMULAS.teleportation_circle?.kind === "spell" && ALL_MANUAL_FORMULAS.teleportation_circle.formula.category.level).toBe(5);
        expect(ALL_MANUAL_FORMULAS.tensers_floating_disk?.kind === "spell" && ALL_MANUAL_FORMULAS.tensers_floating_disk.formula.category.ritual).toBe(true);
        expect(ALL_MANUAL_FORMULAS.time_stop?.kind === "spell" && ALL_MANUAL_FORMULAS.time_stop.formula.category.level).toBe(9);
    });

    it("records the checked T2 Free Rules spells with languages, plant gates, tree striding, true polymorph, resurrection, and tsunami", () => {
        const expected = ["tongues", "transport_via_plants", "tree_stride", "true_polymorph", "true_resurrection", "true_seeing", "tsunami"];
        for (const id of expected) {
            const record = ALL_MANUAL_FORMULAS[id];
            expect(record?.kind, id).toBe("spell");
            if (record?.kind === "spell") {
                expect(record.formula.category.source, id).toContain("Player's Handbook (2024)");
                expect(record.formula.implementation?.sourceStatus, id).toBe("checked");
                expect(record.formula.implementation?.playtestStatus, id).toBe("not-tested");
                expect(record.formula.implementation?.manualSteps.length, id).toBeGreaterThan(0);
            }
        }
        expect(ALL_MANUAL_FORMULAS.tongues?.kind === "spell" && ALL_MANUAL_FORMULAS.tongues.formula.category.school).toBe("divination");
        expect(ALL_MANUAL_FORMULAS.transport_via_plants?.kind === "spell" && ALL_MANUAL_FORMULAS.transport_via_plants.formula.category.level).toBe(6);
        expect(ALL_MANUAL_FORMULAS.tree_stride?.kind === "spell" && ALL_MANUAL_FORMULAS.tree_stride.formula.category.school).toBe("conjuration");
        expect(ALL_MANUAL_FORMULAS.true_polymorph?.kind === "spell" && ALL_MANUAL_FORMULAS.true_polymorph.formula.category.level).toBe(9);
        expect(ALL_MANUAL_FORMULAS.true_resurrection?.kind === "spell" && ALL_MANUAL_FORMULAS.true_resurrection.formula.category.school).toBe("necromancy");
        expect(ALL_MANUAL_FORMULAS.true_seeing?.kind === "spell" && ALL_MANUAL_FORMULAS.true_seeing.formula.category.level).toBe(6);
        expect(ALL_MANUAL_FORMULAS.tsunami?.kind === "spell" && ALL_MANUAL_FORMULAS.tsunami.formula.damage[0]?.dice).toBe("6d10");
    });

    it("records the checked UVW1 Free Rules spells with servants, vampiric touches, spheres, and elemental walls", () => {
        const expected = ["unseen_servant", "vampiric_touch", "vitriolic_sphere", "wall_of_fire", "wall_of_force", "wall_of_ice", "wall_of_stone", "wall_of_thorns"];
        for (const id of expected) {
            const record = ALL_MANUAL_FORMULAS[id];
            expect(record?.kind, id).toBe("spell");
            if (record?.kind === "spell") {
                expect(record.formula.category.source, id).toContain("Player's Handbook (2024)");
                expect(record.formula.implementation?.sourceStatus, id).toBe("checked");
                expect(record.formula.implementation?.playtestStatus, id).toBe("not-tested");
                expect(record.formula.implementation?.manualSteps.length, id).toBeGreaterThan(0);
            }
        }
        expect(ALL_MANUAL_FORMULAS.unseen_servant?.kind === "spell" && ALL_MANUAL_FORMULAS.unseen_servant.formula.category.ritual).toBe(true);
        expect(ALL_MANUAL_FORMULAS.vampiric_touch?.kind === "spell" && ALL_MANUAL_FORMULAS.vampiric_touch.formula.damage[0]?.dice).toBe("3d6");
        expect(ALL_MANUAL_FORMULAS.vitriolic_sphere?.kind === "spell" && ALL_MANUAL_FORMULAS.vitriolic_sphere.formula.damage[0]?.dice).toBe("10d4");
        expect(ALL_MANUAL_FORMULAS.wall_of_fire?.kind === "spell" && ALL_MANUAL_FORMULAS.wall_of_fire.formula.damage[0]?.dice).toBe("5d8");
        expect(ALL_MANUAL_FORMULAS.wall_of_force?.kind === "spell" && ALL_MANUAL_FORMULAS.wall_of_force.formula.category.school).toBe("evocation");
        expect(ALL_MANUAL_FORMULAS.wall_of_ice?.kind === "spell" && ALL_MANUAL_FORMULAS.wall_of_ice.formula.damage[0]?.dice).toBe("10d6");
        expect(ALL_MANUAL_FORMULAS.wall_of_stone?.kind === "spell" && ALL_MANUAL_FORMULAS.wall_of_stone.formula.category.level).toBe(5);
        expect(ALL_MANUAL_FORMULAS.wall_of_thorns?.kind === "spell" && ALL_MANUAL_FORMULAS.wall_of_thorns.formula.damage[0]?.dice).toBe("7d8");
    });

    it("records the checked W2 Free Rules spells with warding bonds, water mobility, weird illusions, wind spells, wish, and recall", () => {
        const expected = ["warding_bond", "water_breathing", "water_walk", "weird", "wind_walk", "wind_wall", "wish", "word_of_recall"];
        for (const id of expected) {
            const record = ALL_MANUAL_FORMULAS[id];
            expect(record?.kind, id).toBe("spell");
            if (record?.kind === "spell") {
                expect(record.formula.category.source, id).toContain("Player's Handbook (2024)");
                expect(record.formula.implementation?.sourceStatus, id).toBe("checked");
                expect(record.formula.implementation?.playtestStatus, id).toBe("not-tested");
                expect(record.formula.implementation?.manualSteps.length, id).toBeGreaterThan(0);
            }
        }
        expect(ALL_MANUAL_FORMULAS.warding_bond?.kind === "spell" && ALL_MANUAL_FORMULAS.warding_bond.formula.category.school).toBe("abjuration");
        expect(ALL_MANUAL_FORMULAS.water_breathing?.kind === "spell" && ALL_MANUAL_FORMULAS.water_breathing.formula.category.ritual).toBe(true);
        expect(ALL_MANUAL_FORMULAS.water_walk?.kind === "spell" && ALL_MANUAL_FORMULAS.water_walk.formula.category.ritual).toBe(true);
        expect(ALL_MANUAL_FORMULAS.weird?.kind === "spell" && ALL_MANUAL_FORMULAS.weird.formula.damage[0]?.dice).toBe("10d10");
        expect(ALL_MANUAL_FORMULAS.wind_walk?.kind === "spell" && ALL_MANUAL_FORMULAS.wind_walk.formula.category.level).toBe(6);
        expect(ALL_MANUAL_FORMULAS.wind_wall?.kind === "spell" && ALL_MANUAL_FORMULAS.wind_wall.formula.damage[0]?.dice).toBe("4d8");
        expect(ALL_MANUAL_FORMULAS.wish?.kind === "spell" && ALL_MANUAL_FORMULAS.wish.formula.category.level).toBe(9);
        expect(ALL_MANUAL_FORMULAS.word_of_recall?.kind === "spell" && ALL_MANUAL_FORMULAS.word_of_recall.formula.category.school).toBe("conjuration");
    });

    it("records the reconciled C and D Free Rules spells with clone, contact other plane, undead creation, delayed blast fireball, dispel evil/good, dragon breath, and instant summons", () => {
        const expected = ["clone", "contact_other_plane", "create_undead", "creation", "delayed_blast_fireball", "dispel_evil_and_good", "dragons_breath", "drawmijs_instant_summons"];
        for (const id of expected) {
            const record = ALL_MANUAL_FORMULAS[id];
            expect(record?.kind, id).toBe("spell");
            if (record?.kind === "spell") {
                expect(record.formula.category.source, id).toContain("Player's Handbook (2024)");
                expect(record.formula.implementation?.sourceStatus, id).toBe("checked");
                expect(record.formula.implementation?.playtestStatus, id).toBe("not-tested");
                expect(record.formula.implementation?.manualSteps.length, id).toBeGreaterThan(0);
            }
        }
        expect(ALL_MANUAL_FORMULAS.clone?.kind === "spell" && ALL_MANUAL_FORMULAS.clone.formula.category.level).toBe(8);
        expect(ALL_MANUAL_FORMULAS.contact_other_plane?.kind === "spell" && ALL_MANUAL_FORMULAS.contact_other_plane.formula.category.ritual).toBe(true);
        expect(ALL_MANUAL_FORMULAS.create_undead?.kind === "spell" && ALL_MANUAL_FORMULAS.create_undead.formula.category.level).toBe(6);
        expect(ALL_MANUAL_FORMULAS.creation?.kind === "spell" && ALL_MANUAL_FORMULAS.creation.formula.category.school).toBe("illusion");
        expect(ALL_MANUAL_FORMULAS.delayed_blast_fireball?.kind === "spell" && ALL_MANUAL_FORMULAS.delayed_blast_fireball.formula.damage[0]?.dice).toBe("12d6");
        expect(ALL_MANUAL_FORMULAS.dispel_evil_and_good?.kind === "spell" && ALL_MANUAL_FORMULAS.dispel_evil_and_good.formula.interaction?.saveAbility).toBe("CHA");
        expect(ALL_MANUAL_FORMULAS.dragons_breath?.kind === "spell" && ALL_MANUAL_FORMULAS.dragons_breath.formula.damage[0]?.dice).toBe("3d6");
        expect(ALL_MANUAL_FORMULAS.drawmijs_instant_summons?.kind === "spell" && ALL_MANUAL_FORMULAS.drawmijs_instant_summons.formula.category.ritual).toBe(true);
    });

    it("tracks new Free Rules formulas as source-checked but not playtested", () => {
        for (const id of ["animal_shapes", "antimagic_field", "arcane_eye", "conjure_woodland_beings"]) {
            const record = ALL_MANUAL_FORMULAS[id];
            expect(record?.kind).toBe("spell");
            if (record?.kind === "spell") {
                expect(record.formula.isManualOverride).toBe(true);
                expect(record.formula.implementation?.sourceStatus).toBe("checked");
                expect(record.formula.implementation?.playtestStatus).toBe("not-tested");
                expect(record.formula.implementation?.manualSteps.length).toBeGreaterThan(0);
            }
        }
        const woodlandBeings = ALL_MANUAL_FORMULAS.conjure_woodland_beings;
        expect(woodlandBeings?.kind).toBe("spell");
        if (woodlandBeings?.kind === "spell") {
            expect(woodlandBeings.formula.damage[0]?.dice).toBe("5d8");
            expect(woodlandBeings.formula.category.source).toContain("pg. 255");
        }
    });

    it("registers five additional Basic Rules spells with their manual rules tracked", () => {
        for (const id of ["antipathy_sympathy", "aura_of_life", "bigbys_hand", "circle_of_death", "clairvoyance"]) {
            const record = ALL_MANUAL_FORMULAS[id];
            expect(record?.kind).toBe("spell");
            if (record?.kind === "spell") {
                expect(record.formula.implementation?.sourceStatus).toBe("checked");
                expect(record.formula.implementation?.playtestStatus).toBe("not-tested");
                expect(record.formula.implementation?.manualSteps.length).toBeGreaterThan(0);
            }
        }
        const hand = ALL_MANUAL_FORMULAS.bigbys_hand;
        expect(hand?.kind).toBe("spell");
        if (hand?.kind === "spell") expect(hand.formula.upcasting?.notes).toContain("2d8");
        const death = ALL_MANUAL_FORMULAS.circle_of_death;
        expect(death?.kind).toBe("spell");
        if (death?.kind === "spell") expect(death.formula.damage[0]?.dice).toBe("8d8");
    });

    it("tracks five more Free Rules spells, including recurring saves and manual area limits", () => {
        for (const id of ["cloudkill", "commune", "commune_with_nature", "compulsion", "cone_of_cold"]) {
            const record = ALL_MANUAL_FORMULAS[id];
            expect(record?.kind).toBe("spell");
            if (record?.kind === "spell") {
                expect(record.formula.implementation?.sourceStatus).toBe("checked");
                expect(record.formula.implementation?.playtestStatus).toBe("not-tested");
                expect(record.formula.implementation?.manualSteps.length).toBeGreaterThan(0);
            }
        }
        const cloudkill = ALL_MANUAL_FORMULAS.cloudkill;
        expect(cloudkill?.kind).toBe("spell");
        if (cloudkill?.kind === "spell") expect(cloudkill.formula.upcasting?.perSlotLevel?.dice).toBe("1d8");
        const cone = ALL_MANUAL_FORMULAS.cone_of_cold;
        expect(cone?.kind).toBe("spell");
        if (cone?.kind === "spell") expect(cone.formula.notes).toContain("supports Spheres only");
    });

    it("registers six additional Free Rules spells and records the Conjure Elemental erratum", () => {
        for (const id of ["conjure_celestial", "conjure_elemental", "control_water", "control_weather", "counterspell", "create_food_and_water"]) {
            const record = ALL_MANUAL_FORMULAS[id];
            expect(record?.kind).toBe("spell");
            if (record?.kind === "spell") {
                expect(record.formula.implementation?.sourceStatus).toBe("checked");
                expect(record.formula.implementation?.playtestStatus).toBe("not-tested");
                expect(record.formula.implementation?.manualSteps.length).toBeGreaterThan(0);
            }
        }
        const counterspell = ALL_MANUAL_FORMULAS.counterspell;
        expect(counterspell?.kind).toBe("spell");
        if (counterspell?.kind === "spell") expect(counterspell.formula.interaction?.saveAbility).toBe("CON");
        const elemental = ALL_MANUAL_FORMULAS.conjure_elemental;
        expect(elemental?.kind).toBe("spell");
        if (elemental?.kind === "spell") {
            expect(elemental.formula.category.source).toContain("errata applied");
            expect(elemental.formula.upcasting?.perSlotLevel?.dice).toBe("2d8");
        }
    });

    it("adds long-duration Astral Projection, Awaken, and Befuddlement rules with manual tracking", () => {
        for (const id of ["astral_projection", "awaken", "befuddlement"]) {
            const record = ALL_MANUAL_FORMULAS[id];
            expect(record?.kind).toBe("spell");
            if (record?.kind === "spell") {
                expect(record.formula.implementation?.sourceStatus).toBe("checked");
                expect(record.formula.implementation?.playtestStatus).toBe("not-tested");
                expect(record.formula.implementation?.manualSteps.length).toBeGreaterThan(0);
            }
        }
        const befuddlement = ALL_MANUAL_FORMULAS.befuddlement;
        expect(befuddlement?.kind).toBe("spell");
        if (befuddlement?.kind === "spell") expect(befuddlement.formula.damage[0]?.dice).toBe("10d12");
    });

    it("adds Confusion, Contagion, and Contingency with their ongoing rules tracked", () => {
        for (const id of ["confusion", "contagion", "contingency"]) {
            const record = ALL_MANUAL_FORMULAS[id];
            expect(record?.kind).toBe("spell");
            if (record?.kind === "spell") {
                expect(record.formula.category.source).toContain("Player's Handbook (2024)");
                expect(record.formula.implementation?.sourceStatus).toBe("checked");
                expect(record.formula.implementation?.playtestStatus).toBe("not-tested");
                expect(record.formula.implementation?.manualSteps.length).toBeGreaterThan(0);
            }
        }
        const confusion = ALL_MANUAL_FORMULAS.confusion;
        if (confusion?.kind === "spell") {
            expect(confusion.formula.interaction?.saveAbility).toBe("WIS");
            expect(confusion.formula.area).toEqual({ shape: "Sphere", sizeFeet: 10 });
            expect(confusion.formula.upcasting?.notes).toContain("radius per spell slot level above 4");
        }
        const contagion = ALL_MANUAL_FORMULAS.contagion;
        if (contagion?.kind === "spell") expect(contagion.formula.damage[0]?.dice).toBe("11d8");
        const contingency = ALL_MANUAL_FORMULAS.contingency;
        if (contingency?.kind === "spell") expect(contingency.formula.casting.time).toBe("10 minutes");
    });

    it("adds eight more Free Rules spells with reviewed effects and manual tracking", () => {
        for (const id of ["daylight", "death_ward", "dispel_magic", "fear", "fly", "freedom_of_movement", "geas", "greater_restoration"]) {
            const record = ALL_MANUAL_FORMULAS[id];
            expect(record?.kind).toBe("spell");
            if (record?.kind === "spell") {
                expect(record.formula.category.source).toContain("Player's Handbook (2024)");
                expect(record.formula.implementation?.sourceStatus).toBe("checked");
                expect(record.formula.implementation?.playtestStatus).toBe("not-tested");
                expect(record.formula.implementation?.manualSteps.length).toBeGreaterThan(0);
            }
        }
        const fear = ALL_MANUAL_FORMULAS.fear;
        if (fear?.kind === "spell") expect(fear.formula.category.level).toBe(3);
        const geas = ALL_MANUAL_FORMULAS.geas;
        if (geas?.kind === "spell") expect(geas.formula.damage[0]?.dice).toBe("5d10");
        const dispelMagic = ALL_MANUAL_FORMULAS.dispel_magic;
        if (dispelMagic?.kind === "spell") expect(dispelMagic.formula.upcasting?.notes).toContain("DC 10 + spell level");
    });

    it("records five more source-checked spells with their edge cases", () => {
        for (const id of ["demiplane", "detect_evil_and_good", "dimension_door", "divination", "dominate_person"]) {
            const record = ALL_MANUAL_FORMULAS[id];
            expect(record?.kind).toBe("spell");
            if (record?.kind === "spell") {
                expect(record.formula.category.source).toContain("Player's Handbook (2024)");
                expect(record.formula.implementation?.sourceStatus).toBe("checked");
                expect(record.formula.implementation?.playtestStatus).toBe("not-tested");
                expect(record.formula.implementation?.manualSteps.length).toBeGreaterThan(0);
            }
        }
        const dimensionDoor = ALL_MANUAL_FORMULAS.dimension_door;
        if (dimensionDoor?.kind === "spell") expect(dimensionDoor.formula.damage[0]?.dice).toBe("4d6");
        const dominatePerson = ALL_MANUAL_FORMULAS.dominate_person;
        if (dominatePerson?.kind === "spell") expect(dominatePerson.formula.upcasting?.notes).toContain("8 hours");
    });

    it("records seven additional Free Rules spells and their distinct triggers", () => {
        for (const id of ["disintegrate", "divine_favor", "divine_smite", "divine_word", "dominate_beast", "dominate_monster", "dream"]) {
            const record = ALL_MANUAL_FORMULAS[id];
            expect(record?.kind).toBe("spell");
            if (record?.kind === "spell") {
                expect(record.formula.category.source).toContain("Player's Handbook (2024)");
                expect(record.formula.implementation?.sourceStatus).toBe("checked");
                expect(record.formula.implementation?.playtestStatus).toBe("not-tested");
                expect(record.formula.implementation?.manualSteps.length).toBeGreaterThan(0);
            }
        }
        const disintegrate = ALL_MANUAL_FORMULAS.disintegrate;
        if (disintegrate?.kind === "spell") {
            expect(disintegrate.formula.damage[0]?.dice).toBe("10d6+40");
            expect(disintegrate.formula.upcasting?.perSlotLevel?.dice).toBe("3d6");
        }
        const divineSmite = ALL_MANUAL_FORMULAS.divine_smite;
        if (divineSmite?.kind === "spell") expect(divineSmite.formula.casting.time).toContain("immediately after hitting");
        const dream = ALL_MANUAL_FORMULAS.dream;
        if (dream?.kind === "spell") expect(dream.formula.damage[0]?.dice).toBe("3d6");
    });

    it("records four additional spells from the D&D Free Rules 2024 spell descriptions", () => {
        for (const id of ["bless", "blink", "blight", "blade_barrier"] as const) {
            const record = ALL_MANUAL_FORMULAS[id];
            expect(record?.kind).toBe("spell");
            if (record?.kind === "spell") {
                expect(record.formula.category.source).toContain("Player's Handbook (2024)");
                expect(record.formula.isManualOverride).toBe(true);
            }
        }
        const bless = ALL_MANUAL_FORMULAS.bless;
        const blight = ALL_MANUAL_FORMULAS.blight;
        const bladeBarrier = ALL_MANUAL_FORMULAS.blade_barrier;
        if (bless?.kind === "spell") expect(bless.formula.upcasting?.notes).toContain("additional creature");
        if (blight?.kind === "spell") expect(blight.formula.damage[0]?.dice).toBe("8d8");
        if (bladeBarrier?.kind === "spell") {
            expect(bladeBarrier.formula.interaction?.saveAbility).toBe("DEX");
            expect(bladeBarrier.formula.damage[0]?.dice).toBe("6d10");
            expect(bladeBarrier.formula.effectNotes?.join(" ")).toContain("once per turn");
        }
    });

    it("records three more spells present in the D&D Free Rules spell descriptions", () => {
        for (const id of ["banishment", "beacon_of_hope", "charm_monster"] as const) {
            const record = ALL_MANUAL_FORMULAS[id];
            expect(record?.kind).toBe("spell");
            if (record?.kind === "spell") {
                expect(record.formula.category.source).toContain("Player's Handbook (2024)");
                expect(record.formula.isManualOverride).toBe(true);
            }
        }
        const banishment = ALL_MANUAL_FORMULAS.banishment;
        const charmMonster = ALL_MANUAL_FORMULAS.charm_monster;
        if (banishment?.kind === "spell") {
            expect(banishment.formula.interaction?.saveAbility).toBe("CHA");
            expect(banishment.formula.upcasting?.notes).toContain("above 4");
        }
        if (charmMonster?.kind === "spell") {
            expect(charmMonster.formula.interaction?.saveAbility).toBe("WIS");
            expect(charmMonster.formula.category.concentration).toBe(false);
        }
    });

    it("records five further spells from the D&D Free Rules 2024 descriptions", () => {
        for (const id of ["animate_dead", "animate_objects", "antilife_shell", "call_lightning", "chain_lightning"] as const) {
            const record = ALL_MANUAL_FORMULAS[id];
            expect(record?.kind).toBe("spell");
            if (record?.kind === "spell") {
                expect(record.formula.category.source).toContain("Player's Handbook (2024)");
                expect(record.formula.isManualOverride).toBe(true);
            }
        }
        const animateDead = ALL_MANUAL_FORMULAS.animate_dead;
        const callLightning = ALL_MANUAL_FORMULAS.call_lightning;
        const chainLightning = ALL_MANUAL_FORMULAS.chain_lightning;
        if (animateDead?.kind === "spell") expect(animateDead.formula.upcasting?.notes).toContain("two additional Undead");
        if (callLightning?.kind === "spell") {
            expect(callLightning.formula.damage[0]?.dice).toBe("3d10");
            expect(callLightning.formula.effectNotes?.join(" ")).toContain("later turns");
        }
        if (chainLightning?.kind === "spell") {
            expect(chainLightning.formula.damage[0]?.dice).toBe("10d8");
            expect(chainLightning.formula.upcasting?.notes).toContain("additional bolt");
        }
    });

    it("records four additional Free Rules spells and applies current Conjure errata", () => {
        for (const id of ["bestow_curse", "conjure_animals", "conjure_fey", "conjure_minor_elementals"] as const) {
            const record = ALL_MANUAL_FORMULAS[id];
            expect(record?.kind).toBe("spell");
            if (record?.kind === "spell") {
                expect(record.formula.category.source).toContain("Player's Handbook (2024)");
                expect(record.formula.isManualOverride).toBe(true);
            }
        }
        const bestowCurse = ALL_MANUAL_FORMULAS.bestow_curse;
        const conjureAnimals = ALL_MANUAL_FORMULAS.conjure_animals;
        const conjureFey = ALL_MANUAL_FORMULAS.conjure_fey;
        const conjureMinorElementals = ALL_MANUAL_FORMULAS.conjure_minor_elementals;
        if (bestowCurse?.kind === "spell") {
            expect(bestowCurse.formula.interaction?.saveAbility).toBe("WIS");
            expect(bestowCurse.formula.damage[0]?.dice).toBe("1d8");
            expect(bestowCurse.formula.upcasting?.notes).toContain("Level 9");
        }
        if (conjureAnimals?.kind === "spell") expect(conjureAnimals.formula.damage[0]?.dice).toBe("3d10");
        if (conjureFey?.kind === "spell") {
            expect(conjureFey.formula.damage[0]?.dice).toBe("3d12");
            expect(conjureFey.formula.upcasting?.perSlotLevel?.dice).toBe("1d12");
        }
        if (conjureMinorElementals?.kind === "spell") {
            expect(conjureMinorElementals.formula.damage[0]?.dice).toBe("2d8");
            expect(conjureMinorElementals.formula.damage[0]?.typeChoices).toEqual(["acid", "cold", "fire", "lightning"]);
            expect(conjureMinorElementals.formula.upcasting?.perSlotLevel?.dice).toBe("1d8");
        }
    });

    it("distinguishes a spell's cast action from its later attack or repeat damage", () => {
        const flameBlade = ALL_MANUAL_FORMULAS.flame_blade;
        const heatMetal = ALL_MANUAL_FORMULAS.heat_metal;
        const suggestion = ALL_MANUAL_FORMULAS.suggestion;
        const web = ALL_MANUAL_FORMULAS.web;

        expect(flameBlade?.kind).toBe("spell");
        expect(heatMetal?.kind).toBe("spell");
        expect(suggestion?.kind).toBe("spell");
        expect(web?.kind).toBe("spell");
        if (flameBlade?.kind === "spell") {
            expect(flameBlade.formula.casting.time).toBe("1 bonus action");
            expect(flameBlade.formula.damage[0]).toMatchObject({ dice: "3d6", type: "fire" });
            expect(flameBlade.formula.notes).toContain("Casting creates the blade but does not make its attack. Make the attack with a later Magic action; track concentration and the light.");
        }
        if (heatMetal?.kind === "spell") expect(heatMetal.formula.notes).toContain("initial damage has no save");
        if (suggestion?.kind === "spell") expect(suggestion.formula.interaction?.saveAbility).toBe("WIS");
        if (web?.kind === "spell") expect(web.formula.effectNotes?.[1]).toContain("Dexterity save");
    });

    it("uses checked Player's Handbook pages for recent formulas", () => {
        const references = {
            alter_self: "pg. 239",
            animal_messenger: "pg. 240",
            arcane_lock: "pg. 242",
            barkskin: "pg. 245",
            blur: "pg. 248",
            darkvision: "pg. 260",
            enthrall: "pg. 269",
            find_traps: "pg. 273",
            flame_blade: "pg. 275",
            gentle_repose: "pg. 278",
            gust_of_wind: "pg. 282",
            heat_metal: "pg. 284",
            knock: "pg. 290",
            levitate: "pg. 291",
            locate_object: "pg. 293",
            magic_weapon: "pg. 295",
            moonbeam: "pg. 300",
            prayer_of_healing: "pg. 307",
            protection_from_poison: "pg. 310",
            silence: "pg. 316",
            spike_growth: "pg. 318",
            suggestion: "pg. 320",
            web: "pg. 340",
            zone_of_truth: "pg. 343"
        };
        for (const [id, page] of Object.entries(references)) {
            const record = ALL_MANUAL_FORMULAS[id];
            expect(record?.kind).toBe("spell");
            if (record?.kind === "spell") {
                expect(record.formula.category.source).toBe(`Player's Handbook (2024), ${page}`);
            }
        }
    });

    it("records Acid Splash area, saving throw, and cantrip scaling", () => {
        const acidSplash = ALL_MANUAL_FORMULAS.acid_splash;

        expect(acidSplash?.kind).toBe("cantrip");
        if (acidSplash?.kind === "cantrip") {
            expect(acidSplash.formula.interaction?.saveAbility).toBe("DEX");
            expect(acidSplash.formula.area).toEqual({ shape: "Sphere", sizeFeet: 5 });
            expect(acidSplash.formula.damage[0]).toMatchObject({ dice: "1d6", type: "acid" });
            expect(acidSplash.formula.cantripScale?.tiers.map(tier => tier.totalDice)).toEqual(["1d6", "2d6", "3d6", "4d6"]);
            expect(acidSplash.formula.category.source).toContain("Player's Handbook (2024)");
        }
    });

    it("records the 2024 level-one healing, attack, and detection formulas", () => {
        const cureWounds = ALL_MANUAL_FORMULAS.cure_wounds;
        const detectMagic = ALL_MANUAL_FORMULAS.detect_magic;
        const guidingBolt = ALL_MANUAL_FORMULAS.guiding_bolt;
        const healingWord = ALL_MANUAL_FORMULAS.healing_word;

        expect(cureWounds?.kind).toBe("spell");
        expect(detectMagic?.kind).toBe("spell");
        expect(guidingBolt?.kind).toBe("spell");
        expect(healingWord?.kind).toBe("spell");
        if (cureWounds?.kind === "spell") {
            expect(cureWounds.formula.damage[0]).toMatchObject({ dice: "2d8", type: "healing" });
            expect(cureWounds.formula.upcasting?.perSlotLevel).toEqual({ dice: "2d8", type: "healing" });
        }
        if (detectMagic?.kind === "spell") {
            expect(detectMagic.formula.category.ritual).toBe(true);
            expect(detectMagic.formula.effectNotes?.join(" ")).toContain("30 feet");
        }
        if (guidingBolt?.kind === "spell") {
            expect(guidingBolt.formula.damage[0]).toMatchObject({ dice: "4d6", type: "radiant" });
            expect(guidingBolt.formula.interaction?.type).toBe("spell_attack");
        }
        if (healingWord?.kind === "spell") {
            expect(healingWord.formula.casting.time).toBe("Bonus Action");
            expect(healingWord.formula.damage[0]).toMatchObject({ dice: "2d4", type: "healing" });
        }
    });

    it("records 2024 control and support spells with their manual targeting riders", () => {
        const bane = ALL_MANUAL_FORMULAS.bane;
        const command = ALL_MANUAL_FORMULAS.command;
        const entangle = ALL_MANUAL_FORMULAS.entangle;
        const faerieFire = ALL_MANUAL_FORMULAS.faerie_fire;
        const shieldOfFaith = ALL_MANUAL_FORMULAS.shield_of_faith;

        expect(bane?.kind).toBe("spell");
        expect(command?.kind).toBe("spell");
        expect(entangle?.kind).toBe("spell");
        expect(faerieFire?.kind).toBe("spell");
        expect(shieldOfFaith?.kind).toBe("spell");
        if (bane?.kind === "spell") expect(bane.formula.interaction?.saveAbility).toBe("CHA");
        if (command?.kind === "spell") expect(command.formula.interaction?.saveAbility).toBe("WIS");
        if (entangle?.kind === "spell") expect(entangle.formula.effectNotes?.join(" ")).toContain("20-foot square");
        if (faerieFire?.kind === "spell") expect(faerieFire.formula.interaction?.saveAbility).toBe("DEX");
        if (shieldOfFaith?.kind === "spell") expect(shieldOfFaith.formula.casting.time).toBe("Bonus Action");
    });

    it("records 2024 level-one damage and defense spell mechanics", () => {
        const chromaticOrb = ALL_MANUAL_FORMULAS.chromatic_orb;
        const colorSpray = ALL_MANUAL_FORMULAS.color_spray;
        const falseLife = ALL_MANUAL_FORMULAS.false_life;
        const inflictWounds = ALL_MANUAL_FORMULAS.inflict_wounds;
        const protection = ALL_MANUAL_FORMULAS.protection_from_evil_and_good;

        expect(chromaticOrb?.kind).toBe("spell");
        expect(colorSpray?.kind).toBe("spell");
        expect(falseLife?.kind).toBe("spell");
        expect(inflictWounds?.kind).toBe("spell");
        expect(protection?.kind).toBe("spell");
        if (chromaticOrb?.kind === "spell") {
            expect(chromaticOrb.formula.damage[0]?.typeChoices).toContain("lightning");
            expect(chromaticOrb.formula.effectNotes?.join(" ")).toContain("two or more d8s");
        }
        if (colorSpray?.kind === "spell") expect(colorSpray.formula.interaction?.saveAbility).toBe("CON");
        if (falseLife?.kind === "spell") expect(falseLife.formula.effectNotes?.[0]).toContain("Temporary Hit Points");
        if (inflictWounds?.kind === "spell") expect(inflictWounds.formula.upcasting?.perSlotLevel).toEqual({ dice: "1d10", type: "necrotic" });
        if (protection?.kind === "spell") expect(protection.formula.category.concentration).toBe(true);
    });

    it("records 2024 level-one utility and movement spell formulas", () => {
        const alarm = ALL_MANUAL_FORMULAS.alarm;
        const animalFriendship = ALL_MANUAL_FORMULAS.animal_friendship;
        const createWater = ALL_MANUAL_FORMULAS.create_or_destroy_water;
        const detectPoison = ALL_MANUAL_FORMULAS.detect_poison_and_disease;
        const disguiseSelf = ALL_MANUAL_FORMULAS.disguise_self;
        const expeditiousRetreat = ALL_MANUAL_FORMULAS.expeditious_retreat;
        const featherFall = ALL_MANUAL_FORMULAS.feather_fall;
        const fogCloud = ALL_MANUAL_FORMULAS.fog_cloud;

        for (const formula of [alarm, animalFriendship, createWater, detectPoison, disguiseSelf, expeditiousRetreat, featherFall, fogCloud]) {
            expect(formula?.kind).toBe("spell");
        }
        if (alarm?.kind === "spell") expect(alarm.formula.category.ritual).toBe(true);
        if (animalFriendship?.kind === "spell") expect(animalFriendship.formula.upcasting?.notes).toContain("additional Beast");
        if (createWater?.kind === "spell") expect(createWater.formula.effectNotes?.[0]).toContain("10 gallons");
        if (detectPoison?.kind === "spell") expect(detectPoison.formula.category.concentration).toBe(true);
        if (disguiseSelf?.kind === "spell") expect(disguiseSelf.formula.effectNotes?.[0]).toContain("Study");
        if (expeditiousRetreat?.kind === "spell") expect(expeditiousRetreat.formula.casting.time).toBe("Bonus Action");
        if (featherFall?.kind === "spell") expect(featherFall.formula.casting.time).toContain("Reaction");
        if (fogCloud?.kind === "spell") expect(fogCloud.formula.upcasting?.notes).toContain("20 feet");
    });

    it("records 2024 level-one charm, language, and terrain spells", () => {
        const charmPerson = ALL_MANUAL_FORMULAS.charm_person;
        const comprehendLanguages = ALL_MANUAL_FORMULAS.comprehend_languages;
        const goodberry = ALL_MANUAL_FORMULAS.goodberry;
        const grease = ALL_MANUAL_FORMULAS.grease;
        const jump = ALL_MANUAL_FORMULAS.jump;
        const longstrider = ALL_MANUAL_FORMULAS.longstrider;
        const purify = ALL_MANUAL_FORMULAS.purify_food_and_drink;
        const sanctuary = ALL_MANUAL_FORMULAS.sanctuary;

        for (const formula of [charmPerson, comprehendLanguages, goodberry, grease, jump, longstrider, purify, sanctuary]) {
            expect(formula?.kind).toBe("spell");
        }
        if (charmPerson?.kind === "spell") expect(charmPerson.formula.interaction?.saveAbility).toBe("WIS");
        if (comprehendLanguages?.kind === "spell") expect(comprehendLanguages.formula.category.ritual).toBe(true);
        if (goodberry?.kind === "spell") expect(goodberry.formula.effectNotes?.join(" ")).toContain("ten magical berries");
        if (grease?.kind === "spell") expect(grease.formula.interaction?.saveAbility).toBe("DEX");
        if (jump?.kind === "spell") expect(jump.formula.casting.time).toBe("Bonus Action");
        if (longstrider?.kind === "spell") expect(longstrider.formula.upcasting?.notes).toContain("additional creature");
        if (purify?.kind === "spell") expect(purify.formula.category.ritual).toBe(true);
        if (sanctuary?.kind === "spell") expect(sanctuary.formula.effectNotes?.join(" ")).toContain("damaging spell");
    });

    it("records 2024 identification, defense, and area-damage formulas", () => {
        const identify = ALL_MANUAL_FORMULAS.identify;
        const iceKnife = ALL_MANUAL_FORMULAS.ice_knife;
        const mageArmor = ALL_MANUAL_FORMULAS.mage_armor;
        const shield = ALL_MANUAL_FORMULAS.shield;
        const thunderwave = ALL_MANUAL_FORMULAS.thunderwave;

        for (const formula of [identify, iceKnife, mageArmor, shield, thunderwave]) expect(formula?.kind).toBe("spell");
        if (identify?.kind === "spell") expect(identify.formula.category.ritual).toBe(true);
        if (iceKnife?.kind === "spell") {
            expect(iceKnife.formula.damage.map(entry => entry.dice)).toEqual(["1d10", "2d6"]);
            expect(iceKnife.formula.notes).toContain("even if the attack misses");
        }
        if (mageArmor?.kind === "spell") expect(mageArmor.formula.effectNotes?.join(" ")).toContain("13 + its Dexterity modifier");
        if (shield?.kind === "spell") expect(shield.formula.casting.time).toContain("Reaction");
        if (thunderwave?.kind === "spell") expect(thunderwave.formula.interaction?.saveAbility).toBe("CON");
    });

    it("records core 2024 level-two support, control, and movement formulas", () => {
        const aid = ALL_MANUAL_FORMULAS.aid;
        const augury = ALL_MANUAL_FORMULAS.augury;
        const blindness = ALL_MANUAL_FORMULAS.blindness_deafness;
        const darkness = ALL_MANUAL_FORMULAS.darkness;
        const holdPerson = ALL_MANUAL_FORMULAS.hold_person;
        const invisibility = ALL_MANUAL_FORMULAS.invisibility;
        const lesserRestoration = ALL_MANUAL_FORMULAS.lesser_restoration;
        const mistyStep = ALL_MANUAL_FORMULAS.misty_step;
        const spiritualWeapon = ALL_MANUAL_FORMULAS.spiritual_weapon;

        for (const formula of [aid, augury, blindness, darkness, holdPerson, invisibility, lesserRestoration, mistyStep, spiritualWeapon]) {
            expect(formula?.kind).toBe("spell");
        }
        if (aid?.kind === "spell") expect(aid.formula.effectNotes?.[0]).toContain("Hit Point maximum");
        if (augury?.kind === "spell") expect(augury.formula.category.ritual).toBe(true);
        if (blindness?.kind === "spell") expect(blindness.formula.interaction?.saveAbility).toBe("CON");
        if (darkness?.kind === "spell") expect(darkness.formula.area).toEqual({ shape: "Sphere", sizeFeet: 15 });
        if (holdPerson?.kind === "spell") expect(holdPerson.formula.interaction?.saveAbility).toBe("WIS");
        if (invisibility?.kind === "spell") expect(invisibility.formula.effectNotes?.join(" ")).toContain("attack roll");
        if (lesserRestoration?.kind === "spell") expect(lesserRestoration.formula.casting.time).toBe("Bonus Action");
        if (mistyStep?.kind === "spell") expect(mistyStep.formula.effectNotes?.[0]).toContain("30 feet");
        if (spiritualWeapon?.kind === "spell") expect(spiritualWeapon.formula.interaction?.type).toBe("spell_attack");
    });

    it("records additional 2024 level-two utility and transformation spells", () => {
        const calmEmotions = ALL_MANUAL_FORMULAS.calm_emotions;
        const continualFlame = ALL_MANUAL_FORMULAS.continual_flame;
        const detectThoughts = ALL_MANUAL_FORMULAS.detect_thoughts;
        const enhanceAbility = ALL_MANUAL_FORMULAS.enhance_ability;
        const enlargeReduce = ALL_MANUAL_FORMULAS.enlarge_reduce;
        const flamingSphere = ALL_MANUAL_FORMULAS.flaming_sphere;

        for (const formula of [calmEmotions, continualFlame, detectThoughts, enhanceAbility, enlargeReduce, flamingSphere]) {
            expect(formula?.kind).toBe("spell");
        }
        if (calmEmotions?.kind === "spell") expect(calmEmotions.formula.interaction?.saveAbility).toBe("CHA");
        if (continualFlame?.kind === "spell") expect(continualFlame.formula.casting.duration).toBe("Until dispelled");
        if (detectThoughts?.kind === "spell") expect(detectThoughts.formula.category.concentration).toBe(true);
        if (enhanceAbility?.kind === "spell") expect(enhanceAbility.formula.upcasting?.notes).toContain("additional creature");
        if (enlargeReduce?.kind === "spell") expect(enlargeReduce.formula.interaction?.saveAbility).toBe("CON");
        if (flamingSphere?.kind === "spell") expect(flamingSphere.formula.damage[0]).toMatchObject({ dice: "2d6", type: "fire" });
    });

    it("records 2024 level-two movement, perception, and object utility", () => {
        const repose = ALL_MANUAL_FORMULAS.gentle_repose;
        const knock = ALL_MANUAL_FORMULAS.knock;
        const levitate = ALL_MANUAL_FORMULAS.levitate;
        const locateObject = ALL_MANUAL_FORMULAS.locate_object;
        const mirrorImage = ALL_MANUAL_FORMULAS.mirror_image;
        const passWithoutTrace = ALL_MANUAL_FORMULAS.pass_without_trace;
        const seeInvisibility = ALL_MANUAL_FORMULAS.see_invisibility;
        const spiderClimb = ALL_MANUAL_FORMULAS.spider_climb;

        for (const formula of [repose, knock, levitate, locateObject, mirrorImage, passWithoutTrace, seeInvisibility, spiderClimb]) {
            expect(formula?.kind).toBe("spell");
        }
        if (repose?.kind === "spell") expect(repose.formula.category.ritual).toBe(true);
        if (knock?.kind === "spell") expect(knock.formula.effectNotes?.join(" ")).toContain("300 feet");
        if (levitate?.kind === "spell") expect(levitate.formula.interaction?.saveAbility).toBe("CON");
        if (locateObject?.kind === "spell") expect(locateObject.formula.category.concentration).toBe(true);
        if (mirrorImage?.kind === "spell") expect(mirrorImage.formula.effectNotes?.join(" ")).toContain("d6");
        if (passWithoutTrace?.kind === "spell") expect(passWithoutTrace.formula.effectNotes?.join(" ")).toContain("+10");
        if (seeInvisibility?.kind === "spell") expect(seeInvisibility.formula.effectNotes?.join(" ")).toContain("Ethereal Plane");
        if (spiderClimb?.kind === "spell") expect(spiderClimb.formula.category.concentration).toBe(true);
    });

    it("records Elementalism's five utility options without claiming automation", () => {
        const elementalism = ALL_MANUAL_FORMULAS.elementalism;

        expect(elementalism?.kind).toBe("cantrip");
        if (elementalism?.kind === "cantrip") {
            expect(elementalism.formula.casting.range).toBe("30 ft.");
            expect(elementalism.formula.effectNotes).toHaveLength(4);
            expect(elementalism.formula.effectNotes?.join(" ")).toContain("Sculpt Element");
            expect(elementalism.formula.implementation).toBeUndefined();
        }
    });

    it("records source-checked utility cantrips with table-resolved effects", () => {
        const druidcraft = ALL_MANUAL_FORMULAS.druidcraft;
        const bladeWard = ALL_MANUAL_FORMULAS.blade_ward;
        const dancingLights = ALL_MANUAL_FORMULAS.dancing_lights;
        const friends = ALL_MANUAL_FORMULAS.friends;
        const guidance = ALL_MANUAL_FORMULAS.guidance;
        const light = ALL_MANUAL_FORMULAS.light;
        const mageHand = ALL_MANUAL_FORMULAS.mage_hand;
        const mending = ALL_MANUAL_FORMULAS.mending;
        const message = ALL_MANUAL_FORMULAS.message;
        const mindSliver = ALL_MANUAL_FORMULAS.mind_sliver;
        const minorIllusion = ALL_MANUAL_FORMULAS.minor_illusion;
        const prestidigitation = ALL_MANUAL_FORMULAS.prestidigitation;
        const produceFlame = ALL_MANUAL_FORMULAS.produce_flame;
        const resistance = ALL_MANUAL_FORMULAS.resistance;
        const sacredFlame = ALL_MANUAL_FORMULAS.sacred_flame;
        const spareTheDying = ALL_MANUAL_FORMULAS.spare_the_dying;
        const starryWisp = ALL_MANUAL_FORMULAS.starry_wisp;
        const thaumaturgy = ALL_MANUAL_FORMULAS.thaumaturgy;
        const thunderclap = ALL_MANUAL_FORMULAS.thunderclap;
        const trueStrike = ALL_MANUAL_FORMULAS.true_strike;
        const thornWhip = ALL_MANUAL_FORMULAS.thorn_whip;
        const viciousMockery = ALL_MANUAL_FORMULAS.vicious_mockery;
        const wordOfRadiance = ALL_MANUAL_FORMULAS.word_of_radiance;

        expect(druidcraft?.kind).toBe("cantrip");
        expect(bladeWard?.kind).toBe("cantrip");
        expect(dancingLights?.kind).toBe("cantrip");
        expect(friends?.kind).toBe("cantrip");
        expect(guidance?.kind).toBe("cantrip");
        expect(light?.kind).toBe("cantrip");
        expect(mageHand?.kind).toBe("cantrip");
        expect(mending?.kind).toBe("cantrip");
        expect(message?.kind).toBe("cantrip");
        expect(mindSliver?.kind).toBe("cantrip");
        expect(minorIllusion?.kind).toBe("cantrip");
        expect(prestidigitation?.kind).toBe("cantrip");
        expect(produceFlame?.kind).toBe("cantrip");
        expect(resistance?.kind).toBe("cantrip");
        expect(sacredFlame?.kind).toBe("cantrip");
        expect(spareTheDying?.kind).toBe("cantrip");
        expect(starryWisp?.kind).toBe("cantrip");
        expect(thaumaturgy?.kind).toBe("cantrip");
        expect(thunderclap?.kind).toBe("cantrip");
        expect(trueStrike?.kind).toBe("cantrip");
        expect(thornWhip?.kind).toBe("cantrip");
        expect(viciousMockery?.kind).toBe("cantrip");
        expect(wordOfRadiance?.kind).toBe("cantrip");
        if (guidance?.kind === "cantrip") expect(guidance.formula.category.concentration).toBe(true);
        if (friends?.kind === "cantrip") expect(friends.formula.effectNotes?.join(" ")).toContain("24 hours");
        if (bladeWard?.kind === "cantrip") expect(bladeWard.formula.effectNotes?.[0]).toContain("1d4");
        if (dancingLights?.kind === "cantrip") expect(dancingLights.formula.category.concentration).toBe(true);
        if (light?.kind === "cantrip") expect(light.formula.effectNotes?.[0]).toContain("20 feet");
        if (mageHand?.kind === "cantrip") expect(mageHand.formula.effectNotes?.join(" ")).toContain("10 pounds");
        if (mending?.kind === "cantrip") expect(mending.formula.casting.time).toBe("1 minute");
        if (message?.kind === "cantrip") expect(message.formula.casting.range).toBe("120 ft.");
        if (mindSliver?.kind === "cantrip") {
            expect(mindSliver.formula.interaction?.saveAbility).toBe("INT");
            expect(mindSliver.formula.effectNotes?.[0]).toContain("1d4");
        }
        if (minorIllusion?.kind === "cantrip") expect(minorIllusion.formula.effectNotes?.join(" ")).toContain("5-foot Cube");
        if (prestidigitation?.kind === "cantrip") expect(prestidigitation.formula.effectNotes?.join(" ")).toContain("three");
        if (produceFlame?.kind === "cantrip") {
            expect(produceFlame.formula.casting.time).toBe("Bonus Action");
            expect(produceFlame.formula.effectNotes?.join(" ")).toContain("Magic action");
        }
        if (resistance?.kind === "cantrip") expect(resistance.formula.effectNotes?.join(" ")).toContain("once per turn");
        if (sacredFlame?.kind === "cantrip") expect(sacredFlame.formula.notes).toContain("Half Cover");
        if (spareTheDying?.kind === "cantrip") expect(spareTheDying.formula.effectNotes?.join(" ")).toContain("120 feet");
        if (starryWisp?.kind === "cantrip") expect(starryWisp.formula.effectNotes?.join(" ")).toContain("Invisible");
        if (thaumaturgy?.kind === "cantrip") expect(thaumaturgy.formula.category.classes).toEqual(["cleric"]);
        if (thunderclap?.kind === "cantrip") expect(thunderclap.formula.interaction?.saveAbility).toBe("CON");
        if (trueStrike?.kind === "cantrip") {
            expect(trueStrike.formula.interaction?.useSpellcastingMod).toBe(true);
            expect(trueStrike.formula.damage[0]?.dice).toBe("weapon");
            expect(trueStrike.formula.cantripScale?.extraDamageType).toBe("radiant");
        }
        if (thornWhip?.kind === "cantrip") {
            expect(thornWhip.formula.casting.range).toBe("30 ft.");
            expect(thornWhip.formula.effectNotes?.[0]).toContain("10 feet");
        }
        if (viciousMockery?.kind === "cantrip") expect(viciousMockery.formula.interaction?.saveAbility).toBe("WIS");
        if (wordOfRadiance?.kind === "cantrip") expect(wordOfRadiance.formula.category.classes).toEqual(["cleric"]);
        expect(getDdb55eDirectoryCoverage().find(spell => spell.id === "mage_hand")?.formulaStatus).toBe("needs-review");
    });

    it("excludes DDB Legacy entries and requires sourcebook-level edition verification", () => {
        expect(classifySpellCatalogEntry({ legacyBadge: true, rulesEdition: "2024" })).toBe("exclude-legacy");
        expect(classifySpellCatalogEntry({ legacyBadge: false, rulesEdition: "2024" })).toBe("include-2024");
        expect(classifySpellCatalogEntry({ legacyBadge: false, rulesEdition: "2014" })).toBe("exclude-non-2024");
        expect(classifySpellCatalogEntry({ legacyBadge: false, rulesEdition: "unknown" })).toBe("needs-edition-review");
    });

    it("indexes every spell in Valda Player Pack 2 and tracks manual coverage", () => {
        expect(DND_SOURCEBOOK_SPELLS).toHaveLength(21);
        expect(new Set(DND_SOURCEBOOK_SPELLS.map(spell => spell.id)).size).toBe(21);
        expect(DND_SOURCEBOOK_SPELLS.find(spell => spell.id === "arc_blade")?.formulaStatus).toBe("needs-review");
        expect(DND_SOURCEBOOK_SPELLS.find(spell => spell.id === "frigid_blade")?.classes).toEqual(["sorcerer", "warlock", "wizard"]);
        expect(DND_SOURCEBOOK_SPELLS.every(spell => spell.formulaStatus === "needs-review")).toBe(true);
        expect(Object.keys(vsspp2SpellOverrides).sort()).toEqual(DND_SOURCEBOOK_SPELLS.map(spell => spell.id).sort());
        expect(Object.values(vsspp2SpellOverrides).every(formula => formula.isManualOverride && formula.category.source?.includes("Valda's Spire"))).toBe(true);
        expect(Object.values(vsspp2SpellOverrides).every(formula =>
            formula.implementation?.sourceStatus === "checked" &&
            ["assisted", "manual"].includes(formula.implementation.runtimeStatus) &&
            formula.implementation.playtestStatus === "not-tested" &&
            formula.implementation.manualSteps.length > 0
        )).toBe(true);
    });

    it("records attack/save, scaling, areas, and manual follow-up rules for all VSSPP2 spells", () => {
        expect(vsspp2SpellOverrides.arc_blade.interaction?.weaponAttack?.rangedSpellAttack?.rangeFeet).toBe(15);
        expect(vsspp2SpellOverrides.burning_blade.mechanics?.some(item => item.kind === "exploding_any_die")).toBe(true);
        expect(vsspp2SpellOverrides.cosmic_horror.interaction?.saveAbility).toBe("WIS");
        expect(vsspp2SpellOverrides.rocks_fall.area?.sizeFeet).toBe(60);
        expect(vsspp2SpellOverrides.sword_of_judgment.effectNotes?.[0]).toContain("once per turn");
        expect(vsspp2SpellOverrides.flashback.effectNotes?.[0]).toContain("GM adjudicates");
    });

    it("records Batch PHB-A formulas (Arcane Gate, Armor of Agathys, Arms of Hadar, Aura of Purity, Aura of Vitality)", () => {
        const expected = ["arcane_gate", "armor_of_agathys", "arms_of_hadar", "aura_of_purity", "aura_of_vitality"];
        for (const id of expected) {
            const record = ALL_MANUAL_FORMULAS[id];
            expect(record?.kind, id).toBe("spell");
            if (record?.kind === "spell") {
                expect(record.formula.category.source, id).toContain("Player's Handbook (2024)");
                expect(record.formula.implementation?.sourceStatus, id).toBe("checked");
                expect(record.formula.implementation?.playtestStatus, id).toBe("not-tested");
                expect(record.formula.implementation?.manualSteps.length, id).toBeGreaterThan(0);
                expect(record.formula.notes, id).toContain("Marked for detailed verification");
            }
        }
        expect(ALL_MANUAL_FORMULAS.arcane_gate?.kind === "spell" && ALL_MANUAL_FORMULAS.arcane_gate.formula.category.level).toBe(6);
        expect(ALL_MANUAL_FORMULAS.armor_of_agathys?.kind === "spell" && ALL_MANUAL_FORMULAS.armor_of_agathys.formula.casting.time).toBe("1 bonus action");
        expect(ALL_MANUAL_FORMULAS.arms_of_hadar?.kind === "spell" && ALL_MANUAL_FORMULAS.arms_of_hadar.formula.interaction?.saveAbility).toBe("STR");
        expect(ALL_MANUAL_FORMULAS.aura_of_purity?.kind === "spell" && ALL_MANUAL_FORMULAS.aura_of_purity.formula.area?.sizeFeet).toBe(30);
        expect(ALL_MANUAL_FORMULAS.aura_of_vitality?.kind === "spell" && ALL_MANUAL_FORMULAS.aura_of_vitality.formula.category.school).toBe("abjuration");
    });

    it("records Batch PHB-B formulas (Banishing Smite, Beast Sense, Blinding Smite, Circle of Power, Cloud of Daggers)", () => {
        const expected = ["banishing_smite", "beast_sense", "blinding_smite", "circle_of_power", "cloud_of_daggers"];
        for (const id of expected) {
            const record = ALL_MANUAL_FORMULAS[id];
            expect(record?.kind, id).toBe("spell");
            if (record?.kind === "spell") {
                expect(record.formula.category.source, id).toContain("Player's Handbook (2024)");
                expect(record.formula.implementation?.sourceStatus, id).toBe("checked");
                expect(record.formula.implementation?.playtestStatus, id).toBe("not-tested");
                expect(record.formula.implementation?.manualSteps.length, id).toBeGreaterThan(0);
                expect(record.formula.notes, id).toContain("Marked for detailed verification");
            }
        }
        expect(ALL_MANUAL_FORMULAS.banishing_smite?.kind === "spell" && ALL_MANUAL_FORMULAS.banishing_smite.formula.category.level).toBe(5);
        expect(ALL_MANUAL_FORMULAS.beast_sense?.kind === "spell" && ALL_MANUAL_FORMULAS.beast_sense.formula.category.ritual).toBe(true);
        expect(ALL_MANUAL_FORMULAS.blinding_smite?.kind === "spell" && ALL_MANUAL_FORMULAS.blinding_smite.formula.category.concentration).toBe(false);
        expect(ALL_MANUAL_FORMULAS.circle_of_power?.kind === "spell" && ALL_MANUAL_FORMULAS.circle_of_power.formula.area?.sizeFeet).toBe(30);
        expect(ALL_MANUAL_FORMULAS.cloud_of_daggers?.kind === "spell" && ALL_MANUAL_FORMULAS.cloud_of_daggers.formula.area?.shape).toBe("Cube");
    });

    it("records Batch PHB-C formulas (Compelled Duel, Conjure Barrage, Conjure Volley, Cordon of Arrows, Crown of Madness)", () => {
        const batchC = ["compelled_duel", "conjure_barrage", "conjure_volley", "cordon_of_arrows", "crown_of_madness"];
        for (const id of batchC) {
            const record = ALL_MANUAL_FORMULAS[id];
            expect(record?.kind, id).toBe("spell");
            if (record?.kind === "spell") {
                expect(record.formula.category.source, id).toContain("Player's Handbook (2024)");
                expect(record.formula.implementation?.sourceStatus, id).toBe("checked");
                expect(record.formula.implementation?.playtestStatus, id).toBe("not-tested");
                expect(record.formula.implementation?.manualSteps.length, id).toBeGreaterThan(0);
                expect(record.formula.notes, id).toContain("Marked for detailed verification");
            }
        }
        expect(ALL_MANUAL_FORMULAS.compelled_duel?.kind === "spell" && ALL_MANUAL_FORMULAS.compelled_duel.formula.interaction?.type).toBe("save");
        expect(ALL_MANUAL_FORMULAS.conjure_barrage?.kind === "spell" && ALL_MANUAL_FORMULAS.conjure_barrage.formula.damage?.[0]?.dice).toBe("5d8");
        expect(ALL_MANUAL_FORMULAS.conjure_volley?.kind === "spell" && ALL_MANUAL_FORMULAS.conjure_volley.formula.damage?.[0]?.dice).toBe("8d8");
        expect(ALL_MANUAL_FORMULAS.cordon_of_arrows?.kind === "spell" && ALL_MANUAL_FORMULAS.cordon_of_arrows.formula.damage?.[0]?.dice).toBe("2d4");
        expect(ALL_MANUAL_FORMULAS.crown_of_madness?.kind === "spell" && ALL_MANUAL_FORMULAS.crown_of_madness.formula.category.school).toBe("enchantment");
    });

    it("records Batch PHB-D formulas (Crusader's Mantle, Destructive Wave, Elemental Weapon, Feign Death, Fount of Moonlight)", () => {
        const batchD = ["crusaders_mantle", "destructive_wave", "elemental_weapon", "feign_death", "fount_of_moonlight"];
        for (const id of batchD) {
            const record = ALL_MANUAL_FORMULAS[id];
            expect(record?.kind, id).toBe("spell");
            if (record?.kind === "spell") {
                expect(record.formula.category.source, id).toContain("Player's Handbook (2024)");
                expect(record.formula.implementation?.sourceStatus, id).toBe("checked");
                expect(record.formula.implementation?.playtestStatus, id).toBe("not-tested");
                expect(record.formula.implementation?.manualSteps.length, id).toBeGreaterThan(0);
                expect(record.formula.notes, id).toContain("Marked for detailed verification");
            }
        }
        expect(ALL_MANUAL_FORMULAS.crusaders_mantle?.kind === "spell" && ALL_MANUAL_FORMULAS.crusaders_mantle.formula.area?.sizeFeet).toBe(30);
        expect(ALL_MANUAL_FORMULAS.destructive_wave?.kind === "spell" && ALL_MANUAL_FORMULAS.destructive_wave.formula.damage?.[0]?.dice).toBe("5d6");
        expect(ALL_MANUAL_FORMULAS.elemental_weapon?.kind === "spell" && ALL_MANUAL_FORMULAS.elemental_weapon.formula.category.classes).toEqual(["druid", "paladin", "ranger"]);
        expect(ALL_MANUAL_FORMULAS.feign_death?.kind === "spell" && ALL_MANUAL_FORMULAS.feign_death.formula.category.ritual).toBe(true);
        expect(ALL_MANUAL_FORMULAS.fount_of_moonlight?.kind === "spell" && ALL_MANUAL_FORMULAS.fount_of_moonlight.formula.damage?.[0]?.dice).toBe("2d6");
    });

    it("records Batch PHB-E formulas (Grasping Vine, Hail of Thorns, Hunger of Hadar, Jallarzi's Storm of Radiance, Lightning Arrow)", () => {
        const batchE = ["grasping_vine", "hail_of_thorns", "hunger_of_hadar", "jallarzis_storm_of_radiance", "lightning_arrow"];
        for (const id of batchE) {
            const record = ALL_MANUAL_FORMULAS[id];
            expect(record?.kind, id).toBe("spell");
            if (record?.kind === "spell") {
                expect(record.formula.category.source, id).toContain("Player's Handbook (2024)");
                expect(record.formula.implementation?.sourceStatus, id).toBe("checked");
                expect(record.formula.implementation?.playtestStatus, id).toBe("not-tested");
                expect(record.formula.implementation?.manualSteps.length, id).toBeGreaterThan(0);
                expect(record.formula.notes, id).toContain("Marked for detailed verification");
            }
        }
        expect(ALL_MANUAL_FORMULAS.grasping_vine?.kind === "spell" && ALL_MANUAL_FORMULAS.grasping_vine.formula.interaction?.type).toBe("melee_spell_attack");
        expect(ALL_MANUAL_FORMULAS.hail_of_thorns?.kind === "spell" && ALL_MANUAL_FORMULAS.hail_of_thorns.formula.category.concentration).toBe(false);
        expect(ALL_MANUAL_FORMULAS.hunger_of_hadar?.kind === "spell" && ALL_MANUAL_FORMULAS.hunger_of_hadar.formula.area?.sizeFeet).toBe(20);
        expect(ALL_MANUAL_FORMULAS.jallarzis_storm_of_radiance?.kind === "spell" && ALL_MANUAL_FORMULAS.jallarzis_storm_of_radiance.formula.damage?.[0]?.dice).toBe("2d10");
        expect(ALL_MANUAL_FORMULAS.lightning_arrow?.kind === "spell" && ALL_MANUAL_FORMULAS.lightning_arrow.formula.damage?.[0]?.dice).toBe("4d8");
    });

    it("records Batch PHB-F formulas (Power Word Fortify, Sleep, Staggering Smite, Steel Wind Strike, Summon Aberration)", () => {
        const batchF = ["power_word_fortify", "sleep", "staggering_smite", "steel_wind_strike", "summon_aberration"];
        for (const id of batchF) {
            const record = ALL_MANUAL_FORMULAS[id];
            expect(record?.kind, id).toBe("spell");
            if (record?.kind === "spell") {
                expect(record.formula.category.source, id).toContain("Player's Handbook (2024)");
                expect(record.formula.implementation?.sourceStatus, id).toBe("checked");
                expect(record.formula.implementation?.playtestStatus, id).toBe("not-tested");
                expect(record.formula.implementation?.manualSteps.length, id).toBeGreaterThan(0);
                expect(record.formula.notes, id).toContain("Marked for detailed verification");
            }
        }
        expect(ALL_MANUAL_FORMULAS.power_word_fortify?.kind === "spell" && ALL_MANUAL_FORMULAS.power_word_fortify.formula.category.level).toBe(7);
        expect(ALL_MANUAL_FORMULAS.sleep?.kind === "spell" && ALL_MANUAL_FORMULAS.sleep.formula.category.concentration).toBe(true);
        expect(ALL_MANUAL_FORMULAS.staggering_smite?.kind === "spell" && ALL_MANUAL_FORMULAS.staggering_smite.formula.category.concentration).toBe(false);
        expect(ALL_MANUAL_FORMULAS.steel_wind_strike?.kind === "spell" && ALL_MANUAL_FORMULAS.steel_wind_strike.formula.damage?.[0]?.dice).toBe("6d10");
        expect(ALL_MANUAL_FORMULAS.summon_aberration?.kind === "spell" && ALL_MANUAL_FORMULAS.summon_aberration.formula.interaction?.type).toBe("utility");
    });

    it("records Batch PHB-G formulas (Summon Beast, Summon Celestial, Summon Construct, Summon Elemental, Summon Fey)", () => {
        const batchG = ["summon_beast", "summon_celestial", "summon_construct", "summon_elemental", "summon_fey"];
        for (const id of batchG) {
            const record = ALL_MANUAL_FORMULAS[id];
            expect(record?.kind, id).toBe("spell");
            if (record?.kind === "spell") {
                expect(record.formula.category.source, id).toContain("Player's Handbook (2024)");
                expect(record.formula.implementation?.sourceStatus, id).toBe("checked");
                expect(record.formula.implementation?.playtestStatus, id).toBe("not-tested");
                expect(record.formula.implementation?.manualSteps.length, id).toBeGreaterThan(0);
                expect(record.formula.notes, id).toContain("Marked for detailed verification");
            }
        }
        expect(ALL_MANUAL_FORMULAS.summon_beast?.kind === "spell" && ALL_MANUAL_FORMULAS.summon_beast.formula.interaction?.type).toBe("utility");
        expect(ALL_MANUAL_FORMULAS.summon_celestial?.kind === "spell" && ALL_MANUAL_FORMULAS.summon_celestial.formula.category.level).toBe(5);
        expect(ALL_MANUAL_FORMULAS.summon_construct?.kind === "spell" && ALL_MANUAL_FORMULAS.summon_construct.formula.category.classes).toEqual(["wizard"]);
        expect(ALL_MANUAL_FORMULAS.summon_elemental?.kind === "spell" && ALL_MANUAL_FORMULAS.summon_elemental.formula.category.classes).toContain("druid");
        expect(ALL_MANUAL_FORMULAS.summon_fey?.kind === "spell" && ALL_MANUAL_FORMULAS.summon_fey.formula.damage?.[0]?.dice).toBe("2d6+3");
    });

    it("records Batch PHB-H formulas (Summon Fiend, Summon Undead, Swift Quiver, Synaptic Static, Tasha's Bubbling Cauldron)", () => {
        const batchH = ["summon_fiend", "summon_undead", "swift_quiver", "synaptic_static", "tashas_bubbling_cauldron"];
        for (const id of batchH) {
            const record = ALL_MANUAL_FORMULAS[id];
            expect(record?.kind, id).toBe("spell");
            if (record?.kind === "spell") {
                expect(record.formula.category.source, id).toContain("Player's Handbook (2024)");
                expect(record.formula.implementation?.sourceStatus, id).toBe("checked");
                expect(record.formula.implementation?.playtestStatus, id).toBe("not-tested");
                expect(record.formula.implementation?.manualSteps.length, id).toBeGreaterThan(0);
                expect(record.formula.notes, id).toContain("Marked for detailed verification");
            }
        }
        expect(ALL_MANUAL_FORMULAS.summon_fiend?.kind === "spell" && ALL_MANUAL_FORMULAS.summon_fiend.formula.category.level).toBe(6);
        expect(ALL_MANUAL_FORMULAS.summon_undead?.kind === "spell" && ALL_MANUAL_FORMULAS.summon_undead.formula.interaction?.type).toBe("utility");
        expect(ALL_MANUAL_FORMULAS.swift_quiver?.kind === "spell" && ALL_MANUAL_FORMULAS.swift_quiver.formula.category.classes).toEqual(["ranger"]);
        expect(ALL_MANUAL_FORMULAS.synaptic_static?.kind === "spell" && ALL_MANUAL_FORMULAS.synaptic_static.formula.damage?.[0]?.dice).toBe("8d6");
        expect(ALL_MANUAL_FORMULAS.tashas_bubbling_cauldron?.kind === "spell" && ALL_MANUAL_FORMULAS.tashas_bubbling_cauldron.formula.category.school).toBe("conjuration");
    });

    it("records Batch PHB-I formulas (Telepathy, Thunderous Smite, Witch Bolt, Wrathful Smite, Yolande's Regal Presence)", () => {
        const batchI = ["telepathy", "thunderous_smite", "witch_bolt", "wrathful_smite", "yolandes_regal_presence"];
        for (const id of batchI) {
            const record = ALL_MANUAL_FORMULAS[id];
            expect(record?.kind, id).toBe("spell");
            if (record?.kind === "spell") {
                expect(record.formula.category.source, id).toContain("Player's Handbook (2024)");
                expect(record.formula.implementation?.sourceStatus, id).toBe("checked");
                expect(record.formula.implementation?.playtestStatus, id).toBe("not-tested");
                expect(record.formula.implementation?.manualSteps.length, id).toBeGreaterThan(0);
                expect(record.formula.notes, id).toContain("Marked for detailed verification");
            }
        }
        expect(ALL_MANUAL_FORMULAS.telepathy?.kind === "spell" && ALL_MANUAL_FORMULAS.telepathy.formula.category.level).toBe(8);
        expect(ALL_MANUAL_FORMULAS.thunderous_smite?.kind === "spell" && ALL_MANUAL_FORMULAS.thunderous_smite.formula.category.concentration).toBe(false);
        expect(ALL_MANUAL_FORMULAS.witch_bolt?.kind === "spell" && ALL_MANUAL_FORMULAS.witch_bolt.formula.damage?.[0]?.dice).toBe("2d12");
        expect(ALL_MANUAL_FORMULAS.wrathful_smite?.kind === "spell" && ALL_MANUAL_FORMULAS.wrathful_smite.formula.category.school).toBe("necromancy");
        expect(ALL_MANUAL_FORMULAS.yolandes_regal_presence?.kind === "spell" && ALL_MANUAL_FORMULAS.yolandes_regal_presence.formula.area?.sizeFeet).toBe(10);
    });

    it("registers Arc Blade as a manual weapon-based cantrip with level scaling", () => {
        const arcBladeRecord = ALL_MANUAL_FORMULAS.arc_blade;

        expect(arcBladeRecord?.kind).toBe("cantrip");
        if (arcBladeRecord?.kind === "cantrip") {
            expect(arcBladeRecord.formula.name).toBe("Arc Blade");
            expect(arcBladeRecord.formula.interaction?.type).toBe("weapon_based");
            expect(arcBladeRecord.formula.interaction?.weaponAttack?.rangedSpellAttack).toEqual({
                rangeFeet: 15,
                damageType: "lightning",
            });
            expect(arcBladeRecord.formula.cantripScale?.tiers.map(tier => tier.totalDice)).toEqual(["0d6", "1d6", "2d6", "3d6"]);
        }
    });

    it("keeps Font of Magic Sorcerer-only and defines its creation table", () => {
        const fontOfMagic = SORCERER_CLASS_FORMULAS.fontOfMagic;
        const createSlots = fontOfMagic.operations.find(operation => operation.type === "create_spell_slot");

        expect(fontOfMagic.classes).toEqual(["sorcerer"]);
        expect(fontOfMagic.resource?.canExceedMax).toBe(false);
        expect(fontOfMagic.source).toContain("2024");
        expect(createSlots?.type).toBe("create_spell_slot");
        if (createSlots?.type === "create_spell_slot") {
            expect(createSlots.options).toEqual([
                { slotLevel: 1, pointCost: 2, minimumClassLevel: 2 },
                { slotLevel: 2, pointCost: 3, minimumClassLevel: 3 },
                { slotLevel: 3, pointCost: 5, minimumClassLevel: 5 },
                { slotLevel: 4, pointCost: 6, minimumClassLevel: 7 },
                { slotLevel: 5, pointCost: 7, minimumClassLevel: 9 }
            ]);
        }
    });

    it("records Batch Partner-A formulas (Alustriel's Mooncloak, Aura of Evasion, Backlash, Battle Familiar, Blade of Disaster, Cacophonic Shield, Catnap, Conjure Constructs, Death Armor)", () => {
        const batchPartnerA = [
            "alustriels_mooncloak",
            "aura_of_evasion",
            "backlash",
            "battle_familiar",
            "blade_of_disaster",
            "cacophonic_shield",
            "catnap",
            "conjure_constructs",
            "death_armor",
        ];
        for (const id of batchPartnerA) {
            const record = ALL_MANUAL_FORMULAS[id];
            expect(record?.kind, id).toBe("spell");
            if (record?.kind === "spell") {
                expect(record.formula.implementation?.sourceStatus, id).toBe("checked");
                expect(record.formula.implementation?.playtestStatus, id).toBe("not-tested");
                expect(record.formula.implementation?.manualSteps.length, id).toBeGreaterThan(0);
            }
        }
        expect(ALL_MANUAL_FORMULAS.alustriels_mooncloak?.kind === "spell" && ALL_MANUAL_FORMULAS.alustriels_mooncloak.formula.area?.sizeFeet).toBe(20);
        expect(ALL_MANUAL_FORMULAS.aura_of_evasion?.kind === "spell" && ALL_MANUAL_FORMULAS.aura_of_evasion.formula.category.level).toBe(7);
        expect(ALL_MANUAL_FORMULAS.backlash?.kind === "spell" && ALL_MANUAL_FORMULAS.backlash.formula.casting.time).toBe("1 reaction");
        expect(ALL_MANUAL_FORMULAS.battle_familiar?.kind === "spell" && ALL_MANUAL_FORMULAS.battle_familiar.formula.category.level).toBe(2);
        expect(ALL_MANUAL_FORMULAS.blade_of_disaster?.kind === "spell" && ALL_MANUAL_FORMULAS.blade_of_disaster.formula.damage[0]?.dice).toBe("10d6");
        expect(ALL_MANUAL_FORMULAS.cacophonic_shield?.kind === "spell" && ALL_MANUAL_FORMULAS.cacophonic_shield.formula.area?.sizeFeet).toBe(10);
        expect(ALL_MANUAL_FORMULAS.catnap?.kind === "spell" && ALL_MANUAL_FORMULAS.catnap.formula.category.level).toBe(3);
        expect(ALL_MANUAL_FORMULAS.conjure_constructs?.kind === "spell" && ALL_MANUAL_FORMULAS.conjure_constructs.formula.damage[0]?.dice).toBe("3d6");
        expect(ALL_MANUAL_FORMULAS.death_armor?.kind === "spell" && ALL_MANUAL_FORMULAS.death_armor.formula.damage[0]?.dice).toBe("2d4");
    });

    it("records Batch Partner-B formulas (Deryan's Helpful Homunculi, Detonate, Dirge, Disruptive Tune, Distorted Distance, Doomtide, Dueling Ground, Elminster's Effulgent Spheres, Elminster's Elusion)", () => {
        const batchPartnerB = [
            "deryans_helpful_homunculi",
            "detonate",
            "dirge",
            "disruptive_tune",
            "distorted_distance",
            "doomtide",
            "dueling_ground",
            "elminsters_effulgent_spheres",
            "elminsters_elusion",
        ];
        for (const id of batchPartnerB) {
            const record = ALL_MANUAL_FORMULAS[id];
            expect(record?.kind, id).toBe("spell");
            if (record?.kind === "spell") {
                expect(record.formula.implementation?.sourceStatus, id).toBe("checked");
                expect(record.formula.implementation?.playtestStatus, id).toBe("not-tested");
                expect(record.formula.implementation?.manualSteps.length, id).toBeGreaterThan(0);
            }
        }
        expect(ALL_MANUAL_FORMULAS.deryans_helpful_homunculi?.kind === "spell" && ALL_MANUAL_FORMULAS.deryans_helpful_homunculi.formula.category.ritual).toBe(true);
        expect(ALL_MANUAL_FORMULAS.detonate?.kind === "spell" && ALL_MANUAL_FORMULAS.detonate.formula.damage[0]?.dice).toBe("10d10");
        expect(ALL_MANUAL_FORMULAS.dirge?.kind === "spell" && ALL_MANUAL_FORMULAS.dirge.formula.area?.sizeFeet).toBe(60);
        expect(ALL_MANUAL_FORMULAS.disruptive_tune?.kind === "spell" && ALL_MANUAL_FORMULAS.disruptive_tune.formula.area?.sizeFeet).toBe(20);
        expect(ALL_MANUAL_FORMULAS.distorted_distance?.kind === "spell" && ALL_MANUAL_FORMULAS.distorted_distance.formula.damage[0]?.dice).toBe("2d10");
        expect(ALL_MANUAL_FORMULAS.doomtide?.kind === "spell" && ALL_MANUAL_FORMULAS.doomtide.formula.damage[0]?.dice).toBe("5d6");
        expect(ALL_MANUAL_FORMULAS.dueling_ground?.kind === "spell" && ALL_MANUAL_FORMULAS.dueling_ground.formula.category.ritual).toBe(true);
        expect(ALL_MANUAL_FORMULAS.elminsters_effulgent_spheres?.kind === "spell" && ALL_MANUAL_FORMULAS.elminsters_effulgent_spheres.formula.damage[0]?.dice).toBe("3d6");
        expect(ALL_MANUAL_FORMULAS.elminsters_elusion?.kind === "spell" && ALL_MANUAL_FORMULAS.elminsters_elusion.formula.casting.time).toBe("1 bonus action");
    });

    it("records Batch Partner-C formulas (Enervation, Entrancing Mirrors, Festering Blast, Fractured Awareness, Grave Ground, Hindsight, Holy Star of Mystra, Homunculus Servant, Illusory Dragon)", () => {
        const batchPartnerC = [
            "enervation",
            "entrancing_mirrors",
            "festering_blast",
            "fractured_awareness",
            "grave_ground",
            "hindsight",
            "holy_star_of_mystra",
            "homunculus_servant",
            "illusory_dragon",
        ];
        for (const id of batchPartnerC) {
            const record = ALL_MANUAL_FORMULAS[id];
            expect(record?.kind, id).toBe("spell");
            if (record?.kind === "spell") {
                expect(record.formula.implementation?.sourceStatus, id).toBe("checked");
                expect(record.formula.implementation?.playtestStatus, id).toBe("not-tested");
                expect(record.formula.implementation?.manualSteps.length, id).toBeGreaterThan(0);
            }
        }
        expect(ALL_MANUAL_FORMULAS.enervation?.kind === "spell" && ALL_MANUAL_FORMULAS.enervation.formula.damage[0]?.dice).toBe("6d8");
        expect(ALL_MANUAL_FORMULAS.entrancing_mirrors?.kind === "spell" && ALL_MANUAL_FORMULAS.entrancing_mirrors.formula.damage[0]?.dice).toBe("7d6");
        expect(ALL_MANUAL_FORMULAS.festering_blast?.kind === "spell" && ALL_MANUAL_FORMULAS.festering_blast.formula.area?.sizeFeet).toBe(60);
        expect(ALL_MANUAL_FORMULAS.fractured_awareness?.kind === "spell" && ALL_MANUAL_FORMULAS.fractured_awareness.formula.damage[0]?.dice).toBe("12d10");
        expect(ALL_MANUAL_FORMULAS.grave_ground?.kind === "spell" && ALL_MANUAL_FORMULAS.grave_ground.formula.damage[0]?.dice).toBe("6d6");
        expect(ALL_MANUAL_FORMULAS.hindsight?.kind === "spell" && ALL_MANUAL_FORMULAS.hindsight.formula.category.level).toBe(9);
        expect(ALL_MANUAL_FORMULAS.holy_star_of_mystra?.kind === "spell" && ALL_MANUAL_FORMULAS.holy_star_of_mystra.formula.damage[0]?.dice).toBe("4d10");
        expect(ALL_MANUAL_FORMULAS.homunculus_servant?.kind === "spell" && ALL_MANUAL_FORMULAS.homunculus_servant.formula.category.ritual).toBe(true);
        expect(ALL_MANUAL_FORMULAS.illusory_dragon?.kind === "spell" && ALL_MANUAL_FORMULAS.illusory_dragon.formula.damage[0]?.dice).toBe("6d6");
    });

    it("records Batch Partner-D formulas (Inflict Doubt, Invulnerability, Iron Body, Laeral's Silver Lance, Lightning Ring, Moment of Prescience, Mordenkainen's Lucubration, Negative Energy Flood, Power Word Pain)", () => {
        const batchPartnerD = [
            "inflict_doubt",
            "invulnerability",
            "iron_body",
            "laerals_silver_lance",
            "lightning_ring",
            "moment_of_prescience",
            "mordenkainens_lucubration",
            "negative_energy_flood",
            "power_word_pain",
        ];
        for (const id of batchPartnerD) {
            const record = ALL_MANUAL_FORMULAS[id];
            expect(record?.kind, id).toBe("spell");
            if (record?.kind === "spell") {
                expect(record.formula.implementation?.sourceStatus, id).toBe("checked");
                expect(record.formula.implementation?.playtestStatus, id).toBe("not-tested");
                expect(record.formula.implementation?.manualSteps.length, id).toBeGreaterThan(0);
            }
        }
        expect(ALL_MANUAL_FORMULAS.inflict_doubt?.kind === "spell" && ALL_MANUAL_FORMULAS.inflict_doubt.formula.category.level).toBe(3);
        expect(ALL_MANUAL_FORMULAS.invulnerability?.kind === "spell" && ALL_MANUAL_FORMULAS.invulnerability.formula.category.level).toBe(9);
        expect(ALL_MANUAL_FORMULAS.iron_body?.kind === "spell" && ALL_MANUAL_FORMULAS.iron_body.formula.category.level).toBe(8);
        expect(ALL_MANUAL_FORMULAS.laerals_silver_lance?.kind === "spell" && ALL_MANUAL_FORMULAS.laerals_silver_lance.formula.area?.sizeFeet).toBe(120);
        expect(ALL_MANUAL_FORMULAS.lightning_ring?.kind === "spell" && ALL_MANUAL_FORMULAS.lightning_ring.formula.casting.time).toBe("1 bonus action");
        expect(ALL_MANUAL_FORMULAS.moment_of_prescience?.kind === "spell" && ALL_MANUAL_FORMULAS.moment_of_prescience.formula.casting.time).toBe("1 reaction");
        expect(ALL_MANUAL_FORMULAS.mordenkainens_lucubration?.kind === "spell" && ALL_MANUAL_FORMULAS.mordenkainens_lucubration.formula.category.level).toBe(5);
        expect(ALL_MANUAL_FORMULAS.negative_energy_flood?.kind === "spell" && ALL_MANUAL_FORMULAS.negative_energy_flood.formula.damage[0]?.dice).toBe("3d10 + 25");
        expect(ALL_MANUAL_FORMULAS.power_word_pain?.kind === "spell" && ALL_MANUAL_FORMULAS.power_word_pain.formula.damage[0]?.dice).toBe("6d8");
    });

    it("records Batch Partner-E formulas (Reweave Fate, Simbul's Synostodweomer, Songal's Elemental Suffusion, Spellfire Flare, Spellfire Storm, Spirit Lantern, Summon Dinosaur, Summon Plant, Syluné’s Viper)", () => {
        const batchPartnerE = [
            "reweave_fate",
            "simbuls_synostodweomer",
            "songals_elemental_suffusion",
            "spellfire_flare",
            "spellfire_storm",
            "spirit_lantern",
            "summon_dinosaur",
            "summon_plant",
            "sylunes_viper",
        ];
        for (const id of batchPartnerE) {
            const record = ALL_MANUAL_FORMULAS[id];
            expect(record?.kind, id).toBe("spell");
            if (record?.kind === "spell") {
                expect(record.formula.implementation?.sourceStatus, id).toBe("checked");
                expect(record.formula.implementation?.playtestStatus, id).toBe("not-tested");
                expect(record.formula.implementation?.manualSteps.length, id).toBeGreaterThan(0);
            }
        }
        expect(ALL_MANUAL_FORMULAS.reweave_fate?.kind === "spell" && ALL_MANUAL_FORMULAS.reweave_fate.formula.casting.time).toBe("1 reaction");
        expect(ALL_MANUAL_FORMULAS.simbuls_synostodweomer?.kind === "spell" && ALL_MANUAL_FORMULAS.simbuls_synostodweomer.formula.category.level).toBe(7);
        expect(ALL_MANUAL_FORMULAS.songals_elemental_suffusion?.kind === "spell" && ALL_MANUAL_FORMULAS.songals_elemental_suffusion.formula.area?.sizeFeet).toBe(15);
        expect(ALL_MANUAL_FORMULAS.spellfire_flare?.kind === "spell" && ALL_MANUAL_FORMULAS.spellfire_flare.formula.damage[0]?.dice).toBe("2d10");
        expect(ALL_MANUAL_FORMULAS.spellfire_storm?.kind === "spell" && ALL_MANUAL_FORMULAS.spellfire_storm.formula.damage[0]?.dice).toBe("4d10");
        expect(ALL_MANUAL_FORMULAS.spirit_lantern?.kind === "spell" && ALL_MANUAL_FORMULAS.spirit_lantern.formula.category.level).toBe(5);
        expect(ALL_MANUAL_FORMULAS.summon_dinosaur?.kind === "spell" && ALL_MANUAL_FORMULAS.summon_dinosaur.formula.category.level).toBe(6);
        expect(ALL_MANUAL_FORMULAS.summon_plant?.kind === "spell" && ALL_MANUAL_FORMULAS.summon_plant.formula.category.level).toBe(5);
        expect(ALL_MANUAL_FORMULAS.sylunes_viper?.kind === "spell" && ALL_MANUAL_FORMULAS.sylunes_viper.formula.casting.time).toBe("1 bonus action");
    });

    it("records Batch Partner-F formulas (Transfix, Uncertain Footing, Vision of Elapsing Eons, Wail of the Banshee, Wardaway, Waves of Exhaustion, Wither and Bloom, Zone of Amicability)", () => {
        const batchPartnerF = [
            "transfix",
            "uncertain_footing",
            "vision_of_elapsing_eons",
            "wail_of_the_banshee",
            "wardaway",
            "waves_of_exhaustion",
            "wither_and_bloom",
            "zone_of_amicability",
        ];
        for (const id of batchPartnerF) {
            const record = ALL_MANUAL_FORMULAS[id];
            expect(record?.kind, id).toBe("spell");
            if (record?.kind === "spell") {
                expect(record.formula.implementation?.sourceStatus, id).toBe("checked");
                expect(record.formula.implementation?.playtestStatus, id).toBe("not-tested");
                expect(record.formula.implementation?.manualSteps.length, id).toBeGreaterThan(0);
            }
        }
        expect(ALL_MANUAL_FORMULAS.transfix?.kind === "spell" && ALL_MANUAL_FORMULAS.transfix.formula.damage[0]?.dice).toBe("4d8");
        expect(ALL_MANUAL_FORMULAS.uncertain_footing?.kind === "spell" && ALL_MANUAL_FORMULAS.uncertain_footing.formula.category.level).toBe(2);
        expect(ALL_MANUAL_FORMULAS.vision_of_elapsing_eons?.kind === "spell" && ALL_MANUAL_FORMULAS.vision_of_elapsing_eons.formula.damage[0]?.dice).toBe("10d12");
        expect(ALL_MANUAL_FORMULAS.wail_of_the_banshee?.kind === "spell" && ALL_MANUAL_FORMULAS.wail_of_the_banshee.formula.damage[0]?.dice).toBe("12d10");
        expect(ALL_MANUAL_FORMULAS.wardaway?.kind === "spell" && ALL_MANUAL_FORMULAS.wardaway.formula.damage[0]?.dice).toBe("2d4");
        expect(ALL_MANUAL_FORMULAS.waves_of_exhaustion?.kind === "spell" && ALL_MANUAL_FORMULAS.waves_of_exhaustion.formula.area?.sizeFeet).toBe(60);
        expect(ALL_MANUAL_FORMULAS.wither_and_bloom?.kind === "spell" && ALL_MANUAL_FORMULAS.wither_and_bloom.formula.damage[0]?.dice).toBe("3d6");
        expect(ALL_MANUAL_FORMULAS.zone_of_amicability?.kind === "spell" && ALL_MANUAL_FORMULAS.zone_of_amicability.formula.category.level).toBe(4);
    });
});
