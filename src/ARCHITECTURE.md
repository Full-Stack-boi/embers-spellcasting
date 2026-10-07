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
- **Universal Feature Discovery**: Dynamically scans all `classFeatures` and `subclassDefinition.classFeatures` up to the current level (filtering out `hideInSheet`). Extracts actions, resource costs, and descriptions generically across all D&D 5e classes without hardcoding class or subclass names.
- **Non-Slot & Innate Spells (`usesSpellSlot: false`)**: Captures subclass, racial, and pact spells that do not consume standard spell slots (e.g. Monk Shadow Arts *Darkness*, Tiefling *Hellish Rebuke*), preserving them even when flagged as unprepared by DDB.
- **Feature Action Catalog** (`src/features/characterFeatures/domain/characterFeatureCatalog.ts`): Enriches parsed character data with verified manual formulas for active feats and subclass abilities.
- **Roll Log Streaming** (`src/services/rollLogService.ts`): Polls or listens for game log dice rolls from D&D Beyond and surfaces them in the Action Dock roll history.

### B. Baldur's Gate 3 Action Dock HUD
- **Action Dock** (`src/components/ActionDock/ActionDock.tsx`): Bottom-docked interface rendering active spells, cantrips, weapon actions, class features, and custom dice.
- **BG3 Flyout Bar** (`src/components/ActionDock/overlays/BG3FlyoutBar.tsx`): Multi-step spell casting flow handling slot upcasting, variant configurations (e.g., Hex ability curse selection), and target confirmation.
- **Resource-Agnostic Casting**: Decouples spell slot checks from non-slot spells, allowing features to deduct custom class resources (Focus Points, Sorcery Points, Superiority Dice) instead of spell slots.
- **Feature Drawers & Action Cards**: Exposes direct action buttons (`Cast [Spell]`, `Strike x2`, `Bonus Strike`) within feature tooltips and drawers.
- **Combat State** (`src/services/combatStateService.ts`): Maintains client-side combat context such as active concentration spells and target curses (+1d6 Necrotic Hex damage on subsequent attack hits).

### C. Tactical Targeting & Vision
- **Targeting Domain** (`src/features/targeting/domain/`): Pure geometric calculations for circles, cones, lines, and token distances on square/hex grids.
- **Line of Sight & Darkvision** (`src/features/targeting/application/`): Computes line-of-sight raycasting and dynamic vision lighting against scene obstacles.
- **Magical Darkness & Self-Cast Attribution**:
  - Per D&D 2024 PHB rules, Monk: Warrior of Shadow can see within the Darkness sphere *only when created by their own spell* (`shadowMonkSight: { enabled: true, sourceOnly: true, range: 60 }`). Unlike Warlock's Devil's Sight, it does not pierce enemy magical darkness.
  - Caster attribution is preserved strictly across Token ID (`sourceCasterId`) and D&D Beyond Character ID (`sourceCharacterId`) and evaluated via `isDarknessZoneFromCaster`.
  - Token vision metadata on scene items is kept continuously synchronized via `ActionDock` using `TOKEN_VISION_METADATA_KEY`.
- **Darkness Vision & Combat Enforcement**:
  - When a creature lacks vision to pierce a Darkness zone (e.g., enemy Darkness for a Shadow Monk, or any Darkness for standard creatures without Devil's Sight or Truesight), the client renders an opaque black smoke overlay (`darkness.black.opaque`). Viewers who can see in darkness receive no local fog overlay.
  - True mechanical blindness is enforced via the combat targeting engine (`evaluateLineOfSight`): weapon attacks through or inside enemy darkness suffer **Disadvantage** (`[DIS]` in game log, Amber tether), while attacks from within own darkness gain **Advantage** (`[ADV]`, Green tether) against blinded defenders. Spells requiring sight to cast are blocked.
- **Draggable Darkness & Multi-Tier Scene Layer Hierarchy**:
  - The Darkness system uses a robust multi-tier visual hierarchy across Owlbear Rodeo scene layers:
    1. `layer: "PROP"`, `zIndex: -1`, `disableAutoZIndex: true` **Base Darkness**: Draggable spell anchor (`disableHit: false`, `locked: false`) kept below CHARACTER tokens while remaining selectable and draggable via empty canvas space. OBR zIndex only orders items within the same layer.
    2. `layer: "CHARACTER"`, `zIndex: 0` **Ground Tokens**: Ground creatures (`elevation <= 15 ft`).
    3. `layer: "ATTACHMENT"`, `zIndex: 1` **Darkness Fog Overlay**: Only viewers lacking vision receive a local opaque fog item on `OBR.scene.local`, with `disableHit: true` so Token interactions pass through. Viewers who can see the Darkness receive no local overlay. Flying tokens at `zIndex: 10` remain above the opaque fog.
    4. `layer: "ATTACHMENT"`, `zIndex: 10` **Flying Tokens**: Elevated creatures (`elevation > 15 ft`) are placed on the `ATTACHMENT` layer at `zIndex: 10`. Since $10 > 1$, flying tokens render sharply and clearly on top of the smoke veil.
  - Auto-migration in `darknessVisionHandler.ts` places legacy Darkness items on `PROP` with auto z-index disabled; token synchronization manages token layer (`CHARACTER` vs `ATTACHMENT`) and `zIndex` (0 vs 10) dynamically based on elevation.
  - **Combat Target & Character Token Validation** (`isValidCombatTargetToken`, `isCharacterToken`): Standalone image tokens elevated to `ATTACHMENT` are fully recognized as valid playable character targets and combat recipients (`attachedTo === undefined && item.type === "IMAGE"`), while attached spell effects, darkness zones, and templates remain excluded. Context menu filters support both `CHARACTER` and `ATTACHMENT` layers.
- **3D Elevation & Flight Line of Sight Engine**:
  - Computes 3D geometry (`Point3D`, `distancePoint3DToSegment3DFeet`, `doesSegmentIntersectSphere3D`) against the 15-foot radius Darkness sphere.
  - Reads token altitude via `readTokenElevation`: supports official `rodeo.owlbear.elevation`, `com.battle-system.elevation`, `eu.armindo.embers/elevation`, and active `Fly` buffs (default 30 ft).
  - Flying creatures with elevation $> 15$ ft shooting over the 15-foot darkness sphere have unobstructed 3D line of sight (`doesSegmentIntersectSphere3D` returns `false`), allowing them to attack targets on the other side of darkness without Disadvantage.
  - Includes token context menu ("Toggle Flight (Embers)") to switch between Ground (0 ft) and Flying (30 ft).
- **Aiming Overlays** (`src/features/targeting/infrastructure/obr/`): Renders interactive tethers, AoE grid highlights, and caster indicator rings directly onto the Owlbear Rodeo canvas.

### D. Deterministic Caster & Weapon Resolution Pipeline
- **Explicit Caster Binding** (`toolMetadataSelectedCaster`): When entering aiming mode (`setSelectedSpell`), the initiating token ID is pinned to player metadata. `activeCasterResolver.ts` checks this pin with highest priority (Step 0), preventing map selections or target hovers from hijacking the caster identity.
- **Exact Weapon Resolution** (`toolMetadataSelectedWeapon`): Specific weapon IDs (such as `weapon_unarmed_strike` or individual equipped weapons) are bound during weapon/unarmed actions, avoiding default fallbacks to the first equipped inventory item.
- **Multi-Strike Execution** (`toolMetadataAttackCount`): Supports multi-attack abilities (e.g., Flurry of Blows = 2 strikes) by orchestrating sequential attack rolls, damage calculations, and animation triggers within a single targeting confirmation.

### E. Multi-Player Token Ownership & Claim Protection
- **Token-Player Ownership** (`src/features/player/playerCharacterService.ts`): Tracks which player owns which token via scene item metadata (`embers/characterOwner`).
- **Claim Protection**: Prevents players from claiming or overriding tokens already claimed by another player.
- **Read-Only Inspection Mode**: When selecting an ally token owned by another player, the Action Dock displays a Dark Sapphire status badge showing the owner's name and renders the sheet in read-only inspection mode (hiding action buttons and claim controls).
- **Camera Return (`C` Key)**: Pressing `C` instantly returns and re-centers the player's viewport onto their own primary character token.

### F. Spell Formula Engine & Effects Execution
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

## 4. UI Style & Design Principles

1. **Dark Fantasy Aesthetic**:
   - Design matches the Baldur's Gate 3 HUD aesthetic with dark slate, obsidian, and metallic accent palettes.
   - Ally / Other Player Badges use Dark Sapphire styling (background `#161e2a`, border `#1e3a8a`, text `#93c5fd`).
2. **Strict Emoji Discipline**:
   - **No AI / generic emojis**: Characters such as `✨` (sparkles) or `👤` (silhouette) are strictly forbidden in UI cards, status badges, and roll logs to preserve an authentic tabletop fantasy tone.
   - Use clean SVG icons, unicode symbols (e.g., `⚔`, `⚡`, `✦`, `🔮`), or stylized CSS badges instead.

---

## 5. Quality Standards & Verification

Every pull request or commit must pass all quality gates:

1. **Unit Testing**: Run `npm test` via Vitest. Ensure all test suites pass (targeting geometry, dice parsing, formula resolution, and character catalog verification).
2. **Type Safety & Build**: Run `npm run build` (`tsc -b && vite build`) with zero TypeScript diagnostic errors.
3. **Linting**: Run `npx eslint . --quiet` with zero warnings or errors.
