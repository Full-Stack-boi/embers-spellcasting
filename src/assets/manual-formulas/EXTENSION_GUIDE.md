# Standard Operating Procedure (SOP): Sourcebook Content Extension Guide

This guide defines the standard process for adding new sourcebook content (Spells, Feats, Backgrounds, and Class Mechanics) to Embers Spellcasting. Follow these steps to ensure consistent data structures, rigorous validation, and complete test coverage.

---

## 1. Architecture Overview

Rule definitions and mechanical formulas in Embers Spellcasting are structured across six key domains:

1. **Sourcebook Registry** (`sourcebooks.ts`): Registers book identity, publisher metadata, rules edition (2024 vs. 2014), and D&D Beyond catalog categories.
2. **Spells & Formulas**:
   - **Cantrips** (`cantrips/<school>.ts`): 0th-level cantrips partitioned into 8 school files (`abjuration.ts`, `conjuration.ts`, `divination.ts`, `enchantment.ts`, `evocation.ts`, `illusion.ts`, `necromancy.ts`, `transmutation.ts`).
   - **Leveled Spells** (`spells/<school>.ts`): 1st- through 9th-level spells partitioned into 8 school files, grouped sequentially by level comments (`// --- 1st Level ---`, etc.).
   - **Sourcebook Spells** (`sourcebook-<name>.ts`, `sourcebookSpells.ts`): Dedicated formulas for partner/supplement content (e.g., Grim Hollow, Valda's Spire of Secrets, Arcana Unleashed).
3. **Feats & Active Mechanics** (`feats/<name>.ts`): Player-activated feats with resource costs, bonus actions, reactions, or passive modifiers (e.g., PHB 2024, Grim Hollow, Arcana Unleashed).
4. **Class & Subclass Mechanics** (`classes/<class>/`, `mechanics/classMechanicRegistry.ts`): Class features, subclass scaling, resource pools (e.g., Sorcery Points, Ki, Channel Divinity), and subclass spell lists.
5. **Backgrounds Registry** (`backgrounds/index.ts`): 2024 Background mappings connecting ability score options, origin feats, skill proficiencies, and tool proficiencies.
6. **Character Feature Injection** (`src/features/characterFeatures/domain/characterFeatureCatalog.ts`): Translates verified feats, subclass abilities, and class mechanics into interactive action buttons within the Baldur's Gate 3 Action Dock.

---

## 2. Step-by-Step Workflow

### Step 1: Register Sourcebook in `sourcebooks.ts`
1. Open `src/assets/manual-formulas/sourcebooks.ts`.
2. If introducing a new publisher, add category definitions to `DndBeyondSourceCategory`.
3. Add the book entry to `DND_SPELL_SOURCEBOOKS`:
```typescript
{
    id: "your-book-id",                      // Lowercase kebab-case identifier
    title: "Exact Book Title",               // Full title matching official publication
    publisher: "Publisher Name",             // e.g., Wizards of the Coast, Ghostfire Gaming
    rulesEdition: "2024",                    // "2024" or "2014"
    ddbCategory: "Category Name",
    verificationSource: "D&D Beyond partner release, Publisher Name"
}
```

---

### Step 2: Source Inspection & Verification
*Important: Do not import Legacy 2014 content when implementing 2024/5.5e rules.*

1. **Locate Source Filters**:
   - Open D&D Beyond Spells directory: `https://www.dndbeyond.com/spells`
   - Inspect `filter-source` or `filter-source-category` parameters.
2. **Fetch Detail Endpoints**:
   - D&D Beyond requires the URL slug in spell detail paths to avoid **HTTP 404**:
     ```javascript
     // Correct:
     fetch(`https://www.dndbeyond.com/spells/${item.ddbId}-${item.slug}`)
     // Incorrect (returns 404):
     fetch(`https://www.dndbeyond.com/spells/${item.ddbId}`)
     ```
3. **Verified DOM Selectors**:
   - **Statblock** (`.ddb-statblock-item`):
     - `.ddb-statblock-item-label` (Level, Casting Time, Range/Area, Components, Duration, School, Attack/Save, Damage/Effect)
     - `.ddb-statblock-item-value`
   - **Source Citations** (`.spell-source, .sources, .page-item-details, .source`): e.g., `Grim Hollow: Player’s Guide, pg. 185`
   - **Description & Upcasting** (`.detail-content p, .primary-content p`):
     - Parse paragraphs starting with `Using a Higher-Level Spell Slot` or `At Higher Levels`.
   - **Legacy Exclusion**: Always omit rows and badges bearing the `Legacy` tag.

---

### Step 3: Implement Spell Formulas
For core spells:
1. Place cantrips in `src/assets/manual-formulas/cantrips/<school>.ts`.
2. Place leveled spells in `src/assets/manual-formulas/spells/<school>.ts` under the appropriate level section comment (`// --- 1st Level ---`, etc.).

For partner or third-party sourcebooks:
1. Create `src/assets/manual-formulas/sourcebook-<book>.ts`.
2. Define helper builders such as `makeSpell` or `make<Book>Spell`.
3. Construct the record mapping: `Record<string, SpellFormula>`.
4. **Collision Handling**:
   - If a spell name collides with an existing core or supplement spell, append a source abbreviation suffix to the key (e.g., `summon_plant_gh` for Grim Hollow vs. Arcana Unleashed).
5. **Register in `src/assets/manual-formulas/index.ts`**:
   - Import the formulas and merge them into `ALL_MANUAL_OVERRIDES` and `ALL_MANUAL_FORMULAS`.
   - Export for public consumers.

---

### Step 4: Add Feats with Active Mechanics
When sourcebooks include active feats (actions, bonus actions, reactions, or resource pools):

1. **Implement in `src/assets/manual-formulas/feats/<book>.ts`**:
   - Define entries conforming to `ManualActionFormula`:
   ```typescript
   export const BOOK_FEAT_FORMULAS: Record<string, ManualActionFormula> = {
       feat_key: {
           id: "feat:unique-id",
           name: "Feat Name: Sub-action Name",
           kind: "feat",
           status: "verified",
           classes: [],
           activationType: "bonus", // "action" | "bonus" | "reaction" | "special"
           resource: {
               name: "Resource Pool Name",
               resetType: "Long Rest" // or "Short Rest"
           },
           operations: [
               { type: "resource_cost", resource: "...", amount: 1 },
               { type: "apply_effect", name: "...", description: "..." }
           ],
           description: "Concise rule description explaining mechanics and triggers.",
           source: "Book Title, pg. XX"
       }
   };
   ```
2. **Aggregate in `src/assets/manual-formulas/feats/index.ts`**:
   - Spread the new dictionary into `ALL_MANUAL_FEAT_FORMULAS`.
3. **Expose in Action Dock (`characterFeatureCatalog.ts`)**:
   - Add feature fallback matching logic using `hasFeatOrAction(character, "Feat Name")`.
   - Construct `DDBFeatureAction` items with calculated `limitedUse` (e.g., based on `character.proficiencyBonus`).

---

### Step 5: Register Backgrounds
Add 2024-compliant backgrounds in `src/assets/manual-formulas/backgrounds/index.ts`:
```typescript
background_id: {
    id: "background_id",
    name: "Background Name",
    sourcebookId: "book-id",
    source: "Book Title",
    abilityScores: ["STR", "DEX", "CON"], // 3 choices per 2024 rules
    featId: "feat:origin-feat-id",
    featName: "Origin Feat Name",
    skills: ["Skill 1", "Skill 2"],
    tool: "Tool Proficiency"
}
```
Include each entry in `ALL_BACKGROUNDS`.

---

### Step 6: Class & Subclass Mechanics
When adding class mechanics:
1. Place subclass features under `src/assets/manual-formulas/classes/<class>/subclasses/<subclass>.ts`.
2. Register subclass action formulas and resources in `src/assets/manual-formulas/mechanics/classMechanicRegistry.ts`.
3. Ensure resource resets (Short Rest vs. Long Rest) and level-based scaling formulas are explicitly defined.

---

## 3. Quality Assurance & Testing

Every content change must satisfy all three quality gates:

1. **Unit Tests (`npm test`)**:
   - Add or update dedicated tests in `src/assets/manual-formulas/__tests__/<book>.test.ts`.
   - Validate catalog counts, required fields, and absence of `undefined` values.
   - Verify that all existing unit tests pass without regressions (100% pass rate).
2. **Type Checking & Production Build (`npm run build`)**:
   - Run `tsc -b && vite build` to ensure zero compilation or type errors.
   - Ensure bundle chunks assemble cleanly without missing dependencies.
3. **Linting (`npx eslint . --quiet`)**:
   - Confirm zero lint errors or warnings.
