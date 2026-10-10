# Class & Subclass Mechanics Architecture Guide

A complete reference and developer guide for creating, maintaining, and extending D&D 5e / 2024 class and subclass mechanics in Embers Spellcasting.

---

## 1. Core Architecture: Pure Data-Driven Philosophy

In Embers Spellcasting, all class features, subclass bonuses, resource pools, and weapon riders follow a **pure data-driven architecture**.

### The Golden Rule
> **UI components must be 100% zero-knowledge receivers and renderers.**
> 
> React components (`ActionDock`, `BG3FlyoutBar`, `WeaponTableRow`, `FeatureActionCard`, `DetailDrawerActions`) must **never** contain hardcoded checks for specific classes, subclasses, or feature names (e.g., `if (className === "Barbarian")`, `hasDivineFury`, or `feature.name.includes("Divine Fury")`).

All mechanics, scaling, conditions, resource costs, damage formulas, and element choices are declared as data in `src/assets/manual-formulas/classes/` and resolved dynamically through service resolvers (`resolveWeaponRiders`, `findMatchingActionFormula`, `computeClassFeatureResource`).

```
┌────────────────────────────────────────────────────────────────────────┐
│                        DATA LAYER (Pure Rules)                         │
│  src/assets/manual-formulas/classes/<class>/subclasses/<subclass>.ts   │
│  • Weapon Damage Riders (Rage, Divine Fury, Sneak Attack, Frenzy)      │
│  • Resource Definitions (Sorcery Points, Ki, Superiority Dice)         │
│  • Feature Options & Sub-Choices (Radiant/Necrotic, Metamagic, etc.)   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       RESOLVER / SERVICE LAYER                         │
│  src/services/weaponDamageRiders.ts                                    │
│  • resolveWeaponRiders({ character, weapon, activeBuffs, riderChoice })│
│  src/assets/manual-formulas/classes/index.ts                           │
│  • findMatchingActionFormula(featureName)                              │
│  src/services/classResourceService.ts                                  │
│  • resolveFeatureResource({ formula, character, feature })             │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        PRESENTATION / UI LAYER                         │
│  • BG3FlyoutBar: Renders dynamic SVG element tiles & calculates damage │
│  • WeaponTableRow: Renders dynamic rider chips & computed damage pills │
│  • FeatureActionCard: Renders option buttons from matching formula     │
│  • DetailDrawerActions: Renders drawer options from matching formula   │
│  • Side Game Log (DDBRollCard): Receives roll cards & spell events     │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Directory Structure

All class and subclass mechanics reside in `src/assets/manual-formulas/classes/`:

```
src/assets/manual-formulas/classes/
├── index.ts                      # Aggregates ALL_MANUAL_ACTION_FORMULAS and helper lookups
├── barbarian/
│   ├── index.ts                  # Base Barbarian formulas (Rage, Reckless Attack, Brutal Strike)
│   └── subclasses/
│       ├── pathOfTheBerserker.ts # Frenzy, Mindless Rage, Retaliation
│       ├── pathOfTheZealot.ts    # Divine Fury, Fanatical Focus, Zealous Presence
│       ├── pathOfTheWildHeart.ts
│       ├── pathOfTheWorldTree.ts
│       └── ...
├── cleric/
│   ├── index.ts                  # Channel Divinity, Divine Spark, Turn Undead
│   └── subclasses/
│       ├── lifeDomain.ts
│       ├── lightDomain.ts
│       └── ...
├── fighter/
│   ├── index.ts                  # Second Wind, Action Surge, Tactical Mind
│   └── subclasses/
│       └── battleMaster.ts       # Combat Superiority, Maneuvers
├── rogue/
│   ├── index.ts                  # Sneak Attack, Cunning Action, Cunning Strike
│   └── subclasses/
│       └── ...
├── sorcerer/
│   ├── index.ts                  # Font of Magic, Sorcery Points, Metamagic
│   └── subclasses/
│       └── ...
└── ...
```

---

## 3. Data Schemas & Interfaces

### 3.1 `ManualActionFormula`
Defines an action, class feature, or subclass rule:

```typescript
export interface ManualActionFormula {
  id: string;                                // Unique identifier (e.g. "embers:barbarian:zealot:divine-fury")
  name: string;                              // Display name (e.g. "Divine Fury")
  kind: "action" | "class_feature" | "feat";
  status: "verified" | "needs-review";
  classes: string[];                         // Required classes (e.g. ["barbarian"])
  subclass?: string;                         // Subclass identifier (e.g. "pathOfTheZealot")
  activationType: "action" | "bonus" | "reaction" | "special";
  resource?: {
    name: string;                            // e.g. "Rage", "Sorcery Points"
    resetType?: string;                      // "Short Rest" | "Long Rest"
  };
  operations: ManualActionOperation[];
  options?: FeatureActionOption[];           // Sub-choices rendered on flyout/drawer
  weaponRider?: WeaponDamageRiderOperation;  // Dynamic rider executed during weapon attacks
  description?: string;
  source?: string;                           // Book reference (e.g. "PHB 2024")
}
```

### 3.2 `WeaponDamageRiderOperation`
Defines additional damage dice or numeric modifiers applied to weapon strikes:

```typescript
export interface WeaponDamageRiderOperation {
  type: "weapon_damage_rider";
  id: string;                                // e.g. "divine-fury"
  name?: string;                             // e.g. "Divine Fury"
  classId: string;                           // Owning class (e.g. "barbarian")
  subclassId?: string;                       // Owning subclass (e.g. "pathOfTheZealot")
  minLevel?: number;                         // Minimum class level required (e.g. 3)
  requiresBuff?: string;                     // Buff required to be active (e.g. "rage")
  requiresWeaponProperties?: string[];       // e.g. ["finesse", "ranged"] for Sneak Attack
  
  // Flat damage bonus scaling (e.g. Rage +2, +3, +4)
  flat?: {
    byClassLevel: Array<{ minLevel: number; value: number }>;
  };
  
  // Extra damage dice
  dice?: string;                             // Fixed dice (e.g. "1d6")
  diceByClassLevel?: Array<{ minLevel: number; dice: string }>; // Scaling dice (e.g. Frenzy 2d6 -> 3d6)
  
  // Dynamic formula bonus
  bonus?: "halfClassLevel";                  // Scales bonus as Math.max(1, Math.floor(level / 2))
  
  // Damage type choices
  damageTypeChoices?: string[];              // e.g. ["Radiant", "Necrotic"]
  defaultChoice?: string;                    // e.g. "Radiant"
  
  // Frequency per turn
  frequency?: "every_hit" | "first_hit_per_turn";
}
```

### 3.3 `FeatureActionOption`
Defines selectable sub-actions or variant modes:

```typescript
export interface FeatureActionOption {
  id: string;                                // e.g. "radiant"
  name: string;                              // e.g. "Radiant"
  cost: number;                              // Resource cost (0 if free)
  desc: string;                              // Description tooltip
  actionType: "action" | "bonus" | "reaction" | "none";
}
```

---

## 4. How the Dynamic Pipeline Works

### 4.1 Weapon Attacks & Flyouts
1. When a player clicks a weapon in the Action Dock, `resolveWeaponRiders` is invoked with the active character, weapon, active buffs, and current rider choice.
2. `resolveWeaponRiders`:
   - Matches the character's class and level against `rider.classId` and `rider.minLevel`.
   - Validates subclass membership (`rider.subclassId`).
   - Checks if required buffs (`rider.requiresBuff`, e.g. `"rage"`) are active.
   - Calculates numeric flat bonuses (e.g., Rage +2) and extra dice riders (e.g., Divine Fury `1d6+2`).
   - Collects choices (`availableRiderChoice`, e.g., Radiant vs Necrotic).
3. The UI receives `ResolvedWeaponRiders`:
   - **`BG3FlyoutBar`**:
     - Header displays base damage plus all active riders: `Damage: 1d12+4 Slashing (Rage (+2)) • Divine Fury: +1d6+2 Radiant`.
     - Tiles render dynamic icon buttons for element choices (using `getDamageTypeIcon` with `#fde047` Radiant Sun / `#c084fc` Necrotic Skull) matching the BG3 flyout styling of Sorcerous Burst and Chromatic Orb.
   - **`WeaponTableRow`**:
     - Damage pill displays the effective formula.
     - Notes column renders interactive choice pills (`Radiant (+1d6+2)` / `Necrotic (+1d6+2)`).
   - **Roll Execution**:
     - Rolling damage automatically includes the base weapon, flat bonus, and extra rider dice cards in the side Game Log.
     - Redundant map banner popups (`OBR.notification.show`) are omitted in favor of the clean side Game Log.

### 4.2 Non-Damaging Spells & Spell Cast Logging
All spell casts (damaging or utility, e.g. `Aid`, `Bless`, `Shield`, `Mage Armor`, `Darkness`) automatically broadcast an `actionType: "SPELL"` roll card to the side Game Log (`DDBRollCard`):
- Action Name: Spell Name (e.g., `AID`, `DARKNESS`)
- Formula: Spell School & Slot Level (e.g., `Abjuration • Level 2`)
- Total Badge: `CAST` (rendered with `.is-text` styling in vibrant `#e879f9`)
- Subtitle: Concentration status or cast description
This ensures that other players and the DM know exactly what was cast without spamming bottom-center map notification toasts.

---

## 5. Step-by-Step: Adding New Mechanics

### Example A: Adding a Subclass Weapon Rider
Suppose you are implementing **Paladin: Oath of Devotion - Sacred Weapon** or **Ranger: Hunter's Colossus Slayer**.

1. **Create/Open the subclass file**: `src/assets/manual-formulas/classes/ranger/subclasses/hunter.ts`.
2. **Define the formula with a `weaponRider`**:

```typescript
import type { ManualActionFormula } from "../../../../../types/manualFormula";

export const HUNTER_FORMULAS: Record<string, ManualActionFormula> = {
  colossusSlayer: {
    id: "embers:ranger:hunter:colossus-slayer",
    name: "Colossus Slayer",
    kind: "class_feature",
    status: "verified",
    classes: ["ranger"],
    subclass: "hunter",
    activationType: "special",
    description: "Once per turn, deal an extra 1d8 damage to an injured target hit by a weapon attack.",
    weaponRider: {
      type: "weapon_damage_rider",
      id: "colossus-slayer",
      name: "Colossus Slayer",
      classId: "ranger",
      subclassId: "hunter",
      minLevel: 3,
      dice: "1d8",
      frequency: "first_hit_per_turn",
    },
  },
};
```

3. **Export and register**:
   - In `src/assets/manual-formulas/classes/ranger/index.ts`, include `HUNTER_FORMULAS`.
   - In `src/assets/manual-formulas/classes/index.ts`, add to `RANGER_CLASS_FORMULAS`.

4. **Done!**
   - No UI code needs to be modified.
   - Any level 3+ Hunter Ranger with this feature will automatically see `Colossus Slayer: +1d8` in the weapon flyout header, weapon table row, and damage roll breakdowns.

---

### Example B: Adding Sub-Choices / Options (e.g. Elemental Strike)
Suppose a feature gives a choice of elements (e.g., Fire, Cold, Lightning):

```typescript
elementalStrike: {
  id: "embers:fighter:elemental-strike",
  name: "Elemental Strike",
  kind: "class_feature",
  status: "verified",
  classes: ["fighter"],
  activationType: "special",
  weaponRider: {
    type: "weapon_damage_rider",
    id: "elemental-strike",
    name: "Elemental Strike",
    classId: "fighter",
    minLevel: 3,
    dice: "1d6",
    damageTypeChoices: ["fire", "cold", "lightning"],
    defaultChoice: "fire",
    frequency: "first_hit_per_turn",
  },
  options: [
    { id: "fire", name: "Fire", cost: 0, desc: "Deal 1d6 extra Fire damage", actionType: "none" },
    { id: "cold", name: "Cold", cost: 0, desc: "Deal 1d6 extra Cold damage", actionType: "none" },
    { id: "lightning", name: "Lightning", cost: 0, desc: "Deal 1d6 extra Lightning damage", actionType: "none" },
  ],
}
```

- `BG3FlyoutBar` automatically pulls `damageTypeChoices`, looks up icons from `getDamageTypeIcon(choice, 22)`, and renders the choice buttons.
- `FeatureActionCard` and `DetailDrawerActions` automatically render the 3 buttons from `options`.
- Choosing a tile switches the active rider for subsequent weapon damage rolls.

---

## 6. Testing & Verification

Unit tests are implemented with Vitest to guarantee formula correctness and scaling:

- **Run unit tests**:
  ```bash
  npx vitest run src/services/__tests__/weaponDamageRiders.test.ts
  ```
- **Run the full test suite**:
  ```bash
  npx vitest run
  ```
- **Build test**:
  ```bash
  npm run build
  ```

### Checklist for Adding Mechanics
- [ ] Formula is defined in `src/assets/manual-formulas/classes/<class>/`
- [ ] Exported in the class's `index.ts` and aggregated in `ALL_MANUAL_ACTION_FORMULAS`
- [ ] Uses valid `classId` (e.g. `"barbarian"`) matching D&D Beyond class name lowercased
- [ ] If requiring buffs (e.g. Rage), uses `requiresBuff: "rage"`
- [ ] Zero hardcoded checks in `ActionDock.tsx`, `BG3FlyoutBar.tsx`, or `WeaponTableRow.tsx`
- [ ] Unit test added in `src/services/__tests__/weaponDamageRiders.test.ts`
- [ ] `npm run build` succeeds without TypeScript or bundling warnings
