import { describe, it, expect } from "vitest";
import {
    isActivatableBuffFeature,
    getComputedBuffModifiers,
    ActiveBuff,
    KNOWN_BUFFS
} from "../buffService";

describe("buffService", () => {
    describe("isActivatableBuffFeature", () => {
        it("identifies known static buffs", () => {
            expect(isActivatableBuffFeature("Rage")).toBe(true);
            expect(isActivatableBuffFeature("Bladesong")).toBe(true);
            expect(isActivatableBuffFeature("Innate Sorcery")).toBe(true);
        });

        it("identifies description-driven buffs via natural language parser", () => {
            const desc = "For 1 minute, you enter a mystical trance. You gain +2 bonus to AC and your speed increases by 10 feet.";
            expect(isActivatableBuffFeature("Custom Trance", desc)).toBe(true);
        });

        it("identifies bonus action stance activations from description", () => {
            const desc = "As a bonus action, you emanate an aura of protective light. While active, you gain advantage on attack rolls.";
            expect(isActivatableBuffFeature("Radiant Aura", desc)).toBe(true);
        });

        it("returns false for non-buff features or passive traits", () => {
            expect(isActivatableBuffFeature("Darkvision", "You can see in dim light within 60 feet.")).toBe(false);
            expect(isActivatableBuffFeature("Sneak Attack", "Once per turn, you can deal an extra 1d6 damage.")).toBe(false);
            expect(isActivatableBuffFeature(null)).toBe(false);
            expect(isActivatableBuffFeature("")).toBe(false);
        });
    });

    describe("getComputedBuffModifiers", () => {
        it("combines modifiers across active buffs", () => {
            const buffs: ActiveBuff[] = [
                {
                    ...KNOWN_BUFFS.innate_sorcery,
                    activatedAt: Date.now()
                },
                {
                    id: "custom_buff",
                    name: "Battle Cry",
                    icon: "📢",
                    source: "Fighter",
                    durationText: "1 round",
                    description: "+2 damage",
                    damageBonus: 2,
                    activatedAt: Date.now()
                }
            ];

            const modifiers = getComputedBuffModifiers(buffs);
            expect(modifiers.spellSaveDcBonus).toBe(1);
            expect(modifiers.hasSpellAdvantage).toBe(true);
            expect(modifiers.damageBonus).toBe(2);
            expect(modifiers.hasAttackAdvantage).toBe(false);
        });

        it("returns zeroed modifiers for empty buff list", () => {
            const modifiers = getComputedBuffModifiers([]);
            expect(modifiers.spellSaveDcBonus).toBe(0);
            expect(modifiers.hasSpellAdvantage).toBe(false);
            expect(modifiers.hasAttackAdvantage).toBe(false);
            expect(modifiers.damageBonus).toBe(0);
        });
    });
});
