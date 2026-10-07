# Action Dock Refactor Handoff

## Goal

Keep the Action Dock behavior and public API stable while making each file responsible for one feature area. The container should primarily coordinate shared state and compose the major regions; domain rules, handlers, and UI regions belong in focused modules.

Do not change the popover ID, localStorage keys, OBR metadata keys, D&D Beyond cache semantics, routes, roll card payloads, or action/targeting order as part of this refactor.

## Current Structure

`src/components/ActionDock/` contains the public entry point and feature folders:

- `actions/`: action/spell/feature cards, tables, filters, tab panel, and grid content.
- `character/`: identity, vitals, HP/death saves, inventory and character info tabs, resource tray.
- `drawer/`: detail drawer shell, header, detail content, and drawer actions.
- `domain/`: shared Action Dock types, constants, popover helpers, and rider parsing.
- `hooks/`: character selection/sync, sizing, persistence, roll handlers, spell/resource state, and inventory handlers.
- `overlays/`: flyout, conditions, custom dice, DDB sync, roll history, and upcast picker UI.
- `shared/`: shared icons.
- `styles/`: CSS split by visual feature; `ActionDock.css` imports these files.
- `ActionDock.tsx`: shared state orchestration and composition.
- `index.ts`: stable public barrel. Existing direct imports from `ActionDock.tsx` also remain supported.

## Completed

- Split the original ActionDock stylesheet into feature-focused CSS files.
- Extracted popover helpers, types/constants, rider parsing, and public exports.
- Split the main tabs, action filters/tables/cards, BG3 grid cards, character/vitals UI, and detail drawer UI.
- Extracted dock sizing, caster selection, character tab data, action lists, combat persistence/actions, HP, inventory attunement, spell selection/casting, weapon/spell roll handlers, feature activation, and spell resource handlers into hooks.
- Moved files into feature folders and updated local imports, including consumers outside ActionDock.
- Latest verified `ActionDock.tsx` size: 1,533 lines. It is smaller and more organized, but further extraction is still needed before it is a thin coordinator.

## Next Work

1. Extract the right-side action workspace from `ActionDock.tsx` into an `actions/` component. Keep tab switching, search/filter values, and event handlers owned by the container; use explicit props grouped by feature where that makes the contract easier to scan.
2. Review the remaining DDB spell-list construction and OBR player metadata subscription in `ActionDock.tsx`; move them to focused hooks only if their inputs/outputs can be expressed clearly.
3. Recheck that the public barrel exports the established API: default `ActionDock`, `openActionDock`, `closeActionDock`, `toggleActionDock`, `actionDockPopoverId`, `DetailDrawerItem`, and `getFeatureFlyoutKind`.
4. Run the full test suite and a manual OBR smoke test when available. Do not treat a Vitest `ENOENT` under the Windows sandbox temporary `ssr` directory as an assertion failure; retry with the fork pool and record the exact result.

## Verification

Last checked after moving the folders:

- `npm run build`: passed. Vite still reports the pre-existing Owlbear SDK mixed-import warning and the large CharacterChecks bundle warning.
- `npx eslint src/components/ActionDock --quiet`: passed.
- `npx vitest run --pool=forks src/services/__tests__/spellBeam.test.ts src/services/__tests__/spellFormula.test.ts`: 2 files, 26 tests passed.
- `git diff --check`: passed after the folder move and documentation update.

## Working Rules

- Prefer the closest existing feature folder; avoid adding folders that contain only one unrelated file.
- Keep CSS next to its owning entry stylesheet or component where the current import structure expects it.
- Use `index.ts` for compatibility rather than requiring unrelated callers to follow internal folder moves.
- After each extraction, verify the complete call path and preserve roll/OBR side-effect order.
