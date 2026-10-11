import { renderToStaticMarkup } from "react-dom/server";
import { describe, it, expect, vi } from "vitest";
import { Bg3WeaponCard } from "../Bg3WeaponCard";
import type { DDBWeaponAttack } from "../../../../types/ddb";

describe("Bg3WeaponCard Thrown & Melee Rendering", () => {
  const dagger: DDBWeaponAttack = {
    id: "weapon_dagger",
    name: "Dagger",
    type: "melee",
    toHit: 5,
    damage: "1d4+3",
    damageType: "Piercing",
    rangeText: "20/60 ft.",
    rangeFeet: 5,
    hasThrown: true,
    thrownRange: 20,
    thrownLongRange: 60,
    properties: ["Finesse", "Light", "Thrown"],
  };

  const greatsword: DDBWeaponAttack = {
    id: "weapon_greatsword",
    name: "Greatsword",
    type: "melee",
    toHit: 7,
    damage: "2d6+4",
    damageType: "Slashing",
    rangeText: "5 ft.",
    rangeFeet: 5,
    hasThrown: false,
    properties: ["Heavy", "Two-Handed"],
  };

  it("renders a normal melee card with THROW text badge (NO emoji 🎯) when weapon hasThrown is true", () => {
    const html = renderToStaticMarkup(
      <Bg3WeaponCard
        weapon={dagger}
        index={0}
        mode="melee"
        onActivate={vi.fn()}
        onOpenDetails={vi.fn()}
      />
    );

    // Verify Dagger name is present
    expect(html).toContain("Dagger");
    // Verify THROW text badge is present
    expect(html).toContain("THROW");
    // Verify strict constraint: NO emojis like 🎯
    expect(html).not.toContain("🎯");
  });

  it("does not render a THROW badge for non-thrown melee weapons", () => {
    const html = renderToStaticMarkup(
      <Bg3WeaponCard
        weapon={greatsword}
        index={1}
        mode="melee"
        onActivate={vi.fn()}
        onOpenDetails={vi.fn()}
      />
    );

    expect(html).toContain("Greatsword");
    expect(html).not.toContain("THROW");
    expect(html).not.toContain("🎯");
  });

  it("renders a companion Throw weapon card with THROWN indicator and amber theme when mode is thrown", () => {
    const html = renderToStaticMarkup(
      <Bg3WeaponCard
        weapon={dagger}
        index={2}
        mode="thrown"
        onActivate={vi.fn()}
        onOpenDetails={vi.fn()}
      />
    );

    // Verify companion card title
    expect(html).toContain("Throw Dagger");
    // Verify THROWN text badge
    expect(html).toContain("THROWN");
    // Verify amber accent color
    expect(html).toContain("#f59e0b");
    // Verify strict constraint: NO emojis like 🎯
    expect(html).not.toContain("🎯");
  });
});
