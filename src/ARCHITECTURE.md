# Source Architecture

Embers is a React extension for Owlbear Rodeo that provides dynamic spellcasting animations, tactical targeting, D&D Beyond character synchronization, and a Baldur's Gate 3 style Action Dock HUD.

The codebase is organized as a modular monolith: product capabilities are organized into domain-driven features, while Owlbear Rodeo integrations and UI components interface at clean architectural boundaries.

---

## 1. Directory Structure

```text
src/
  app/                         App entrypoint, route composition, global React providers
  assets/
    manual-formulas/           Deterministic spell, feat, and class mechanic formulas
      cantrips/                Cantrip formulas grouped by spell school (8 schools)
      spells/                  Leveled spell formulas grouped by school and level (1st-9th)
      classes/                 Class- and subclass-specific action formulas
      feats/                   Player-activated feat formulas and resource costs
      mechanics/               Class mechanic registry and scaling rules
  components/
    ActionDock/                Baldur's Gate 3 Action Dock HUD, BG3 flyout bar, dice roller
    CharacterChecks/           Ability and skill check roll cards and modifiers
    DDBRollLog/                D&D Beyond game log roll card inspector
    SpellDetailViewer/         Rich spell detail and statblock inspection modal
  features/
    characterFeatures/
      domain/                  Feature catalog, action injection, sorcery point rules
    targeting/
      domain/                  Range, grid, and area geometry; mathematical types
      application/             Line-of-sight raycasting, vision rules, and target filters
      infrastructure/obr/      Owlbear scene item lookups, token resolvers, overlay renderers
  platform/
    obr/react/                 Shared Owlbear Rodeo React context providers and hooks
  effects/                     Visual animation execution engine and blueprint resolvers
  services/                    Business logic services: DDB parser, combat state, roll logs
  types/                       Core domain TypeScript interfaces and data models
  utils/                       Shared deterministic utilities (dice parsing, math, easing)
  views/                       Top-level popovers and modal containers
```

---

## 2. Core Subsystems & Data Flow

### A. D&D Beyond Character Integration
- **Sync & Parse** (`src/services/ddbService.ts`): Fetches character payloads via local proxy or direct DDB endpoints, extracting abilities, skills, spell slots, prepared spells, and class actions into a normalized `DDBParsedCharacter` model.
- **Feature Action Catalog** (`src/features/characterFeatures/domain/characterFeatureCatalog.ts`): Enriches parsed character data with verified manual formulas for active feats and subclass abilities.
- **Roll Log Streaming** (`src/services/rollLogService.ts`): Polls or listens for game log dice rolls from D&D Beyond and surfaces them in the Action Dock roll history.

### B. Baldur's Gate 3 Action Dock HUD
- **Action Dock** (`src/components/ActionDock/ActionDock.tsx`): Bottom-docked interface rendering active spells, cantrips, weapon actions, and custom dice.
- **BG3 Flyout Bar** (`src/components/ActionDock/BG3FlyoutBar.tsx`): Multi-step spell casting flow handling slot upcasting, variant configurations (e.g., Hex ability curse selection), and target confirmation.
- **Combat State** (`src/services/combatStateService.ts`): Maintains client-side combat context such as active concentration spells and target curses (+1d6 Necrotic Hex damage on subsequent attack hits).

### C. Tactical Targeting & Vision
- **Targeting Domain** (`src/features/targeting/domain/`): Pure geometric calculations for circles, cones, lines, and token distances on square/hex grids.
- **Line of Sight & Darkvision** (`src/features/targeting/application/`): Computes line-of-sight raycasting and dynamic vision lighting against scene obstacles.
- **Aiming Overlays** (`src/features/targeting/infrastructure/obr/`): Renders interactive tethers, AoE grid highlights, and caster indicator rings directly onto the Owlbear Rodeo canvas.

### D. Spell Formula Engine & Effects Execution
- **Formula Registry** (`src/assets/manual-formulas/`): Catalogs 570+ verified cantrips, leveled spells, and sourcebook additions across all 8 schools of magic.
- **Formula Builder** (`src/services/spellFormulaBuilder.ts`): Evaluates dice expressions, cantrip tier scaling (levels 5, 11, 17), and upcast bonuses.
- **Animation Execution** (`src/effects/`): Spawns projectile beams, AoE blast meshes, and sound cues using Owlbear Rodeo scene attachments.

---

## 3. Dependency Rules

1. **Domain Isolation**:
   - `domain/` packages contain pure TypeScript rules, formulas, and math calculations.
   - Domain modules must **never** import React, `@owlbear-rodeo/sdk`, browser storage (`localStorage`), or network clients.
2. **Application Layer**:
   - `application/` services coordinate domain logic with state workflows.
   - Application modules may depend on domain code, but must not import React UI components.
3. **Infrastructure Boundary**:
   - `infrastructure/` and `platform/` isolate third-party APIs (such as Owlbear Rodeo SDK and browser APIs).
   - UI components should call application services rather than writing raw OBR metadata directly.
4. **Encapsulation**:
   - Features expose public interfaces through their entrypoint. External features should import from the feature root rather than internal implementation files.

---

## 4. Quality Standards & Verification

Every pull request or commit must pass all quality gates:

1. **Unit Testing**: Run `npm test` via Vitest. Ensure all test suites pass (targeting geometry, dice parsing, formula resolution, and character catalog verification).
2. **Type Safety & Build**: Run `npm run build` (`tsc -b && vite build`) with zero TypeScript diagnostic errors.
3. **Linting**: Run `npx eslint . --quiet` with zero warnings or errors.
