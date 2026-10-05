import { describe, expect, it } from "vitest";
import { canConvertSlotToSorceryPoints, convertSlotToSorceryPoints, getAvailableSorceryPoints, restoreSorceryPointsForLongRest } from "../sorceryPointRules";

describe("PHB 2024 Sorcery Point rules", () => {
    it("allows conversion when the full slot yield fits under the maximum", () => {
        expect(canConvertSlotToSorceryPoints(4, 2, 2)).toBe(true);
    });

    it("rejects conversion when points are full or the full yield would exceed the maximum", () => {
        expect(canConvertSlotToSorceryPoints(2, 0, 1)).toBe(false);
        expect(canConvertSlotToSorceryPoints(4, 1, 2)).toBe(false);
    });

    it("adds the slot level without exceeding the cap", () => {
        const spent = convertSlotToSorceryPoints(2, 2, 4);

        expect(getAvailableSorceryPoints(4, spent)).toBe(4);
    });

    it("normalizes saved over-cap values from older BG3 behavior", () => {
        expect(getAvailableSorceryPoints(4, -2)).toBe(4);
        expect(convertSlotToSorceryPoints(-2, 1, 4)).toBe(0);
    });

    it("restores the level-based maximum on Long Rest", () => {
        expect(restoreSorceryPointsForLongRest(4)).toBe(4);
    });
});
