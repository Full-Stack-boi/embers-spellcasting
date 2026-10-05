import { describe, it, expect } from "vitest";
import { resolveSpellConditionalTrigger } from "../spellTriggerResolver";
import { SpellFormula } from "../../types/spellFormula";
import { ALL_MANUAL_OVERRIDES } from "../../assets/manual-formulas";

describe("spellTriggerResolver", () => {
    it("resolves Booming Blade correctly across all scaling levels", () => {
        // Level 1-4: no immediate extra cantrip damage, 1d8 on move
        const lv1 = resolveSpellConditionalTrigger("Booming Blade", "", 1);
        expect(lv1?.hasTrigger).toBe(true);
        expect(lv1?.conditionType).toBe("movement");
        expect(lv1?.damageDice).toBe("1d8");
        expect(lv1?.damageType).toBe("Thunder");
        expect(lv1?.immediateOnHitDice).toBe("");

        // Level 5-10: 1d8 immediate, 2d8 on move
        const lv5 = resolveSpellConditionalTrigger("Booming Blade", "", 5);
        expect(lv5?.damageDice).toBe("2d8");
        expect(lv5?.immediateOnHitDice).toBe("1d8");

        // Level 11-16: 2d8 immediate, 3d8 on move
        const lv11 = resolveSpellConditionalTrigger("Booming Blade", "", 11);
        expect(lv11?.damageDice).toBe("3d8");
        expect(lv11?.immediateOnHitDice).toBe("2d8");

        // Level 17+: 3d8 immediate, 4d8 on move
        const lv17 = resolveSpellConditionalTrigger("Booming Blade", "", 17);
        expect(lv17?.damageDice).toBe("4d8");
        expect(lv17?.immediateOnHitDice).toBe("3d8");
    });

    it("resolves Booming Blade when formula is explicitly provided as argument", () => {
        // Even when formula is passed in directly, scaling must work identically
        const lv1 = resolveSpellConditionalTrigger("Booming Blade", "", 1, ALL_MANUAL_OVERRIDES["booming_blade"]);
        expect(lv1?.damageDice).toBe("1d8");
        expect(lv1?.immediateOnHitDice).toBe("");

        const lv5 = resolveSpellConditionalTrigger("Booming Blade", "", 5, ALL_MANUAL_OVERRIDES["booming_blade"]);
        expect(lv5?.damageDice).toBe("2d8");
        expect(lv5?.immediateOnHitDice).toBe("1d8");
    });

    it("resolves Vengeful Blade with action_attack_or_cast condition", () => {
        const vb = resolveSpellConditionalTrigger("Vengeful Blade", "", 5);
        expect(vb?.hasTrigger).toBe(true);
        expect(vb?.conditionType).toBe("action_attack_or_cast");
        expect(vb?.damageType).toBe("Necrotic");
        expect(vb?.damageDice).toBe("2d8");
    });

    it("resolves future custom spells using explicit formula mechanic", () => {
        const customFormula: SpellFormula = {
            id: "hellfire_rebuke_custom",
            name: "Hellfire Rebuke",
            category: { spellType: "spell", school: "evocation", level: 1, classes: ["warlock"], concentration: false, ritual: false },
            casting: { time: "1 reaction", range: "60 ft", components: "V, S", duration: "Instantaneous" },
            damage: [],
            mechanics: [
                {
                    kind: "conditional_trigger",
                    triggerCondition: "took_damage",
                    conditionDesc: "When damaged by a creature within 60 ft",
                    damageDice: "3d10",
                    damageType: "fire"
                }
            ],
            isManualOverride: true
        };

        const resolved = resolveSpellConditionalTrigger("Hellfire Rebuke", "", 1, customFormula);
        expect(resolved?.hasTrigger).toBe(true);
        expect(resolved?.conditionType).toBe("took_damage");
        expect(resolved?.damageDice).toBe("3d10");
        expect(resolved?.damageType).toBe("fire");
        expect(resolved?.conditionDesc).toBe("When damaged by a creature within 60 ft");
    });

    it("dynamically infers movement condition for future unknown spells from description", () => {
        const desc = "The weapon hums with kinetic tension. If the target moves 5 feet or more before then, it takes 2d6 thunder damage.";
        const inferred = resolveSpellConditionalTrigger("Kinetic Brand", desc, 1);
        expect(inferred?.hasTrigger).toBe(true);
        expect(inferred?.conditionType).toBe("movement");
        expect(inferred?.damageDice).toBe("2d6");
        expect(inferred?.damageType).toBe("Thunder");
    });

    it("dynamically infers action condition for future unknown spells from description", () => {
        const desc = "You curse the foe. If the target makes an attack or casts a spell, it takes 3d8 psychic damage.";
        const inferred = resolveSpellConditionalTrigger("Curse of Hesitation", desc, 1);
        expect(inferred?.hasTrigger).toBe(true);
        expect(inferred?.conditionType).toBe("action_attack_or_cast");
        expect(inferred?.damageDice).toBe("3d8");
        expect(inferred?.damageType).toBe("Psychic");
    });

    it("returns null for spells without conditional triggers", () => {
        expect(resolveSpellConditionalTrigger("Fire Bolt", "You hurl a mote of fire. 1d10 fire damage on hit.")).toBeNull();
        expect(resolveSpellConditionalTrigger("Eldritch Blast", "A beam of crackling energy. 1d10 force damage.")).toBeNull();
    });
});
