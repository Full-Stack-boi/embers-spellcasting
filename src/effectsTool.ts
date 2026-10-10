import {
  GLOBAL_STORAGE_KEYS,
  LOCAL_STORAGE_KEYS,
  SETTINGS_CHANNEL,
  getGlobalSettingsValue,
  getSettingsValue,
  setSettingsValue,
} from "./components/Settings/settings";
import OBR, {
  Image,
  Item,
  Vector2,
  buildImage,
  isImage,
} from "@owlbear-rodeo/sdk";

import { APP_KEY } from "./config";
import {
  doSpell,
  getSpell,
  getSpellAoE,
  getSpellRange,
  isTeleportSpell,
} from "./effects/spells";
import { getItemSize } from "./utils";
import { log_error } from "./logging";
import { spellPopoverId } from "./views/SpellSelectionPopover";
import { resolveActiveCaster } from "./features/targeting/infrastructure/obr/activeCasterResolver";
import {
  clearAimingOverlay,
  renderAimingOverlay,
} from "./features/targeting/infrastructure/obr/aimingOverlayRenderer";
import {
  clearAoePreview,
  renderAoePreview,
} from "./features/targeting/infrastructure/obr/aoePreviewRenderer";
import {
  GridInfo,
  isWithinRange,
  snapAoECenter,
  snapToCellCenter,
} from "./features/targeting/domain/targetingGeometry";
import {
  openActionDock,
  toggleActionDock,
} from "./components/ActionDock/ActionDock";
import { openSpellDetailModal } from "./views/SpellDetailModal";
import {
  DARKNESS_ZONE_METADATA_KEY,
  EFFECT_METADATA_KEY,
  SPELL_METADATA_KEY,
  ELEVATION_METADATA_KEY,
  evaluateLineOfSight,
  extractDarknessZones,
  isValidCombatTargetToken,
  readTokenElevation,
  readTokenVisionRules,
} from "./features/targeting/application/lineOfSightService";
import {
  getTokenBuffs,
  getComputedBuffModifiers,
} from "./services/buffService";
import {
  rollAttack,
  rollDamageBreakdown,
  rollDamageDDB,
  rollDamageExploding,
  rollDamageExplodingAnyDie,
  combineDamageBonus,
  doubleDiceFormula,
  DDBDamageResult,
} from "./utils/dice";
import {
  resolveWeaponRiders,
  type ActiveWeaponRider,
} from "./services/weaponDamageRiders";
import {
  getLinkedDDBCharacterId,
  getCachedDDBCharacter,
  findCachedDDBCharacter,
  hasPotentCantrip,
  hasWeaponGraze,
} from "./services/ddbService";
import {
  resolveFormulaDamageDice,
  resolveSpellFormula,
} from "./services/spellFormulaBuilder";
import { buildWeaponStepDamage } from "./services/weaponSpellDamage";
import { getSpellBeamInfo } from "./services/spellBeamService";
import {
  broadcastDDBRoll,
  toggleDDBRollLogPopover,
} from "./services/rollLogService";
import {
  DDBRollCardData,
  DDBSubRollEntry,
  DDBSubRollExtraDamage,
} from "./types/ddbRollLog";
import {
  loadCombatState,
  saveCombatState,
  isHexConcentrationActive,
  getDefaultCombatState,
} from "./services/combatStateService";
import {
  addConditionalTrigger,
  checkAndFireActionTriggers,
} from "./services/conditionalTriggerService";
import { resolveSpellConditionalTrigger } from "./services/spellTriggerResolver";
import type { DDBParsedCharacter } from "./types/ddb";

export const toolID = `${APP_KEY}/effect-tool`;
export const toolMetadataSelectedSpell = `${APP_KEY}/selected-spell`;
export const toolMetadataSelectedCaster = `${APP_KEY}/selected-caster`;
export const toolMetadataSelectedWeapon = `${APP_KEY}/selected-weapon-id`;
export const toolMetadataAttackCount = `${APP_KEY}/attack-count`;
export const selectedRiderChoiceMetadataKey = `${APP_KEY}/selected-rider-choice`;
export const hexChosenAbilityMetadataKey = `${APP_KEY}/hex-chosen-ability`;
export const selectedSpellDamageTypeMetadataKey = `${APP_KEY}/selected-spell-damage-type`;
export const selectedSpellSlotLevelMetadataKey = `${APP_KEY}/selected-spell-slot-level`;
export const effectsToolModeID = `${APP_KEY}/effects-tool-mode`;
export const removeTargetToolModeID = `${APP_KEY}/remove-effects-tool-mode`;
export const effectsToolActionID = `${APP_KEY}/effects-tool-action`;
export const settingsToolActionID = `${APP_KEY}/settings-tool-action`;
export const selectSpellToolActionID = `${APP_KEY}/select-spell-tool-action`;
export const actionDockToolActionID = `${APP_KEY}/action-dock-tool-action`;
export const gameLogToolActionID = `${APP_KEY}/game-log-tool-action`;
export const spellInfoToolActionID = `${APP_KEY}/spell-info-tool-action`;
export const clearTargetSelectionToolActionID = `${APP_KEY}/clear-target-selection-tool-action`;
export const targetHighlightMetadataKey = `${APP_KEY}/target-highlight`;
export const previousToolMetadataKey = `${APP_KEY}/previous-tool`;
export const playerSelectedTargetsMetadataKey = `${APP_KEY}/selected-targets`;
export const defaultCasterMenuId = `${APP_KEY}/default-caster-menu`;

export interface TargetHighlightMetadata {
  id: number;
  count: number;
}

export { isValidCombatTargetToken };

export async function deductSpellSlotIfLeveled(
  charId: number,
  slotLevel: number,
  ddbChar?: DDBParsedCharacter | null,
  isPact = false,
): Promise<void> {
  if (!charId || slotLevel <= 0) return;
  const combatState =
    (await loadCombatState(charId)) || getDefaultCombatState(charId);
  const usesPact =
    isPact ||
    Boolean(
      ddbChar?.pactMagic &&
      slotLevel === ddbChar.pactMagic.level &&
      (!ddbChar?.spellSlots?.[slotLevel] ||
        ddbChar.spellSlots[slotLevel].max === 0),
    );
  if (usesPact) {
    await saveCombatState(charId, {
      pactSlotsUsed: (combatState.pactSlotsUsed ?? 0) + 1,
    });
  } else {
    const currentUsed = combatState.spellSlotsUsed?.[slotLevel] ?? 0;
    await saveCombatState(charId, {
      spellSlotsUsed: {
        ...(combatState.spellSlotsUsed || {}),
        [slotLevel]: currentUsed + 1,
      },
    });
  }
}

function deactivateTool() {
  clearAimingOverlay();
  clearAoePreview();
  OBR.scene.local.getItems().then((items) => {
    const targets = items.filter(
      (item) => item.metadata[targetHighlightMetadataKey] != undefined,
    );
    OBR.scene.local.deleteItems(targets.map((item) => item.id));
    OBR.player.setMetadata({
      [playerSelectedTargetsMetadataKey]: targets.map((target) => ({
        item: target,
        count: getTargetCount(target),
        id: getTargetID(target),
      })),
    });
  });
}

export async function stopAiming(): Promise<void> {
  clearAimingOverlay();
  clearAoePreview();
  await clearAllTargets();
  setSelectedSpell("");
  await OBR.player.setMetadata({
    [toolMetadataSelectedSpell]: undefined,
    [toolMetadataSelectedCaster]: undefined,
    [toolMetadataSelectedWeapon]: undefined,
    [toolMetadataAttackCount]: undefined,
    [selectedRiderChoiceMetadataKey]: undefined,
    [playerSelectedTargetsMetadataKey]: [],
  });
  await OBR.tool.setMetadata(toolID, {
    [toolMetadataSelectedSpell]: undefined,
    [toolMetadataSelectedCaster]: undefined,
    [toolMetadataSelectedWeapon]: undefined,
    [toolMetadataAttackCount]: undefined,
    [selectedRiderChoiceMetadataKey]: undefined,
  });
  try {
    const metadata = await OBR.player.getMetadata();
    const previousTool = metadata[previousToolMetadataKey] as
      | string
      | undefined;
    if (previousTool && previousTool !== toolID) {
      await OBR.tool.activateTool(previousTool);
    } else {
      await OBR.tool.activateTool("default");
    }
  } catch {}
}

function buildTarget(
  id: number,
  scale: number,
  position: Vector2,
  isFirst: boolean,
  attachedTo?: string,
  count?: number,
) {
  const target = buildImage(
    {
      url: `${window.location.origin}/${isFirst ? "first-" : ""}target.webm`,
      width: 1000,
      height: 1000,
      mime: "video/webm",
    },
    {
      dpi: 1000,
      offset: { x: 500, y: 500 },
    },
  )
    .scale({ x: scale, y: scale })
    .position(position)
    .locked(true)
    .disableHit(attachedTo != undefined)
    .metadata({
      [targetHighlightMetadataKey]: {
        id,
        count: count ?? 1,
      },
    });
  if (attachedTo != undefined) {
    target.attachedTo(attachedTo);
  }
  if (count != undefined && count != 1) {
    target.plainText(count.toString());
  }
  return target.build();
}

async function incrementTargetCount(target: Image) {
  await OBR.scene.local.updateItems<Image>([target.id], (items) => {
    for (const item of items) {
      const newCount = (getTargetCount(item) ?? 0) + 1;
      item.metadata[targetHighlightMetadataKey] = {
        count: newCount,
        id: getTargetID(item),
      };
      if (newCount > 1) {
        item.text.plainText = newCount.toString();
      }
    }
  });
}

async function removeTarget(target: Image, targets: Image[]) {
  if (targets.length >= 2 && getTargetID(target) == getTargetID(targets[0])) {
    OBR.scene.local.updateItems<Image>([targets[1].id], (items) => {
      if (items[0]) {
        items[0].image.url = `${window.location.origin}/first-target.webm`;
      }
    });
  }
  OBR.scene.local.deleteItems([target.id]);
}

export function setSelectedSpell(
  spellName: string,
  casterId?: string,
  weaponId?: string,
  attackCount?: number,
  riderChoice?: string,
) {
  OBR.player.setMetadata({
    [toolMetadataSelectedSpell]: spellName || undefined,
    [toolMetadataSelectedCaster]: casterId || undefined,
    [toolMetadataSelectedWeapon]: weaponId || undefined,
    [toolMetadataAttackCount]: attackCount || undefined,
    [selectedRiderChoiceMetadataKey]: riderChoice || undefined,
  });
  OBR.tool.setMetadata(toolID, {
    [toolMetadataSelectedSpell]: spellName || undefined,
    [toolMetadataSelectedCaster]: casterId || undefined,
    [toolMetadataSelectedWeapon]: weaponId || undefined,
    [toolMetadataAttackCount]: attackCount || undefined,
    [selectedRiderChoiceMetadataKey]: riderChoice || undefined,
  });
}

export function getTargetHighlightMetadata(
  item: Item,
): TargetHighlightMetadata | undefined {
  const highlightMetadata = item.metadata[targetHighlightMetadataKey];
  if (highlightMetadata == undefined) {
    return undefined;
  }
  const thmHighlightMetadata = highlightMetadata as TargetHighlightMetadata;
  if (
    typeof thmHighlightMetadata.id !== "number" ||
    typeof thmHighlightMetadata.count !== "number"
  ) {
    return undefined;
  }
  return thmHighlightMetadata;
}

export function getTargetID(item: Item) {
  return getTargetHighlightMetadata(item)?.id;
}

export function getTargetCount(item: Item) {
  return getTargetHighlightMetadata(item)?.count;
}

export async function getSortedTargets() {
  const items = await OBR.scene.local.getItems();
  return items
    .filter(
      (item) => isImage(item) && getTargetHighlightMetadata(item) != undefined,
    )
    .sort((a, b) => (getTargetID(a) ?? 0) - (getTargetID(b) ?? 0)) as Image[];
}

export async function clearAllTargets(): Promise<void> {
  clearAimingOverlay();
  clearAoePreview();
  const targets = await getSortedTargets();
  if (targets.length > 0) {
    await OBR.scene.local.deleteItems(targets.map((t) => t.id));
  }
  await OBR.player.setMetadata({
    [playerSelectedTargetsMetadataKey]: [],
  });
}

async function getPointerPosition(
  position: Vector2,
  snapToGrid: boolean,
): Promise<Vector2> {
  if (snapToGrid) {
    const grid = await getSceneGridInfo();
    return snapToCellCenter(position, grid);
  }
  return position;
}

export function setupEffectsTool(
  playerRole: "GM" | "PLAYER",
  playerID: string,
) {
  getGlobalSettingsValue(GLOBAL_STORAGE_KEYS.PLAYERS_CAN_CAST_SPELLS).then(
    (canCastSpells) => {
      if (!canCastSpells && playerRole !== "GM") {
        return;
      }
      OBR.tool.create({
        id: toolID,
        defaultMode: effectsToolModeID,
        defaultMetadata: {
          [toolMetadataSelectedSpell]: undefined,
        },
        icons: [
          {
            icon: `${window.location.origin}/embers.svg`,
            label: "Cast spell",
          },
        ],
        shortcut: "Shift+C",
        onClick(context) {
          if (context.activeTool === toolID) {
            toggleActionDock();
            return true;
          }
          OBR.player.setMetadata({
            [previousToolMetadataKey]: context.activeTool,
          });
          openActionDock();
          return true;
        },
      });
      setupToolActions(playerRole, playerID);
      setupTargetToolModes(playerRole, playerID);
    },
  );
  return OBR.tool.onToolChange((tool) => {
    if (
      tool == toolID &&
      getSettingsValue(LOCAL_STORAGE_KEYS.KEEP_SELECTED_TARGETS)
    ) {
      OBR.player.getMetadata().then((metadata) => {
        const oldTargets = metadata[playerSelectedTargetsMetadataKey] as {
          item: Item;
          count: number;
          id: number;
        }[];
        if (oldTargets == undefined) {
          return;
        }
        const minTargetId = Math.min(...oldTargets.map((target) => target.id));
        for (const target of oldTargets) {
          const targetHighlight = buildTarget(
            target.id,
            target.item.scale.x,
            target.item.position,
            target.id === minTargetId,
            target.item.attachedTo,
            target.count,
          );
          OBR.scene.local.addItems([targetHighlight]);
        }
      });
    }
  });
}

async function setupToolActions(playerRole: "GM" | "PLAYER", playerID: string) {
  // Cast spell action
  await OBR.tool.createAction({
    id: effectsToolActionID,
    icons: [
      {
        icon: `${window.location.origin}/cast.svg`,
        label: "Cast Selected Spell",
        filter: {
          activeTools: [toolID],
        },
      },
    ],
    disabled: {
      metadata: [
        {
          key: toolMetadataSelectedSpell,
          value: undefined,
        },
      ],
    },
    shortcut: "Enter",
    onClick() {
      Promise.all([
        OBR.player.getMetadata(),
        getGlobalSettingsValue(GLOBAL_STORAGE_KEYS.PLAYERS_CAN_CAST_SPELLS),
      ]).then(([metadata, canCastSpells]) => {
        if (!canCastSpells && playerRole !== "GM") {
          OBR.notification.show(
            "Embers: You do not have permission to cast spells",
            "ERROR",
          );
          return;
        }
        if (typeof metadata[toolMetadataSelectedSpell] != "string") {
          log_error(
            `Invalid spell selected ("${metadata?.[toolMetadataSelectedSpell]}")`,
          );
          OBR.notification.show(
            `Embers: Invalid spell selected ("${metadata?.[toolMetadataSelectedSpell]}")`,
            "ERROR",
          );
          return;
        }
        doSpell(
          metadata[toolMetadataSelectedSpell],
          playerID,
          playerRole === "GM",
        ).then(() => {
          if (!getSettingsValue(LOCAL_STORAGE_KEYS.KEEP_SELECTED_TARGETS)) {
            clearAllTargets();
          }
        });
      });
    },
  });

  // Select spell action
  await OBR.tool.createAction({
    id: selectSpellToolActionID,
    icons: [
      {
        icon: `${window.location.origin}/pick-spell.svg`,
        label: "Select Spell (.)",
        filter: {
          activeTools: [toolID],
        },
      },
    ],
    shortcut: ".",
    onClick() {
      // Open popup to select a spell
      const search = window.location.search || "";
      OBR.popover.open({
        id: spellPopoverId,
        width: 760,
        height: 440,
        url: `${window.location.origin}/spell-selection-popover${search}`,
        hidePaper: true,
      });
    },
  });

  // BG3 Action Dock toggle action
  try {
    await OBR.tool.createAction({
      id: actionDockToolActionID,
      icons: [
        {
          icon: `${window.location.origin}/embers.svg`,
          label: "Action Bar (B)",
          filter: {
            activeTools: [toolID],
          },
        },
      ],
      shortcut: "b",
      onClick() {
        toggleActionDock();
      },
    });
  } catch (e) {
    console.warn("Failed to create actionDock tool action:", e);
  }

  // Game Log action (L)
  try {
    await OBR.tool.createAction({
      id: gameLogToolActionID,
      icons: [
        {
          icon: `${window.location.origin}/log.svg`,
          label: "Game Log (L)",
          filter: {
            activeTools: [toolID],
          },
        },
      ],
      shortcut: "l",
      onClick() {
        toggleDDBRollLogPopover();
      },
    });
  } catch (e) {
    console.warn("Failed to create gameLog tool action:", e);
  }

  // Spell Info Card action
  await OBR.tool.createAction({
    id: spellInfoToolActionID,
    icons: [
      {
        icon: `${window.location.origin}/pick-spell.svg`,
        label: "Spell Info (I)",
        filter: {
          activeTools: [toolID],
        },
      },
    ],
    disabled: {
      metadata: [
        {
          key: toolMetadataSelectedSpell,
          value: undefined,
        },
      ],
    },
    shortcut: "i",
    onClick() {
      OBR.player.getMetadata().then((metadata) => {
        const selectedSpell = metadata?.[toolMetadataSelectedSpell] as
          | string
          | undefined;
        if (selectedSpell) {
          openSpellDetailModal(selectedSpell);
        }
      });
    },
  });

  // Clear target selection action
  await OBR.tool.createAction({
    id: clearTargetSelectionToolActionID,
    icons: [
      {
        icon: `${window.location.origin}/remove-selection.svg`,
        label: "Clear Target Selection",
        filter: {
          activeTools: [toolID],
        },
      },
    ],
    shortcut: "x",
    onClick() {
      clearAllTargets();
    },
  });
}

async function getSceneGridInfo(): Promise<GridInfo> {
  const [gridDpi, gridScale] = await Promise.all([
    OBR.scene.grid.getDpi(),
    OBR.scene.grid.getScale(),
  ]);

  let cellCenterOffset: Vector2 = { x: gridDpi / 2, y: gridDpi / 2 };
  try {
    const snapCorner = await OBR.scene.grid.snapPosition(
      { x: 0, y: 0 },
      undefined,
      true,
      false,
    );
    const cornerX = ((snapCorner.x % gridDpi) + gridDpi) % gridDpi;
    const cornerY = ((snapCorner.y % gridDpi) + gridDpi) % gridDpi;
    cellCenterOffset = {
      x: (cornerX + gridDpi / 2) % gridDpi,
      y: (cornerY + gridDpi / 2) % gridDpi,
    };
  } catch {}

  return {
    dpi: gridDpi,
    scaleMultiplier: gridScale.parsed?.multiplier ?? 5,
    cellCenterOffset,
  };
}

async function setupTargetToolModes(
  playerRole: "GM" | "PLAYER",
  playerID: string,
) {
  await OBR.tool.createMode({
    id: effectsToolModeID,
    icons: [
      {
        icon: `${window.location.origin}/target.svg`,
        label: "Add Targets",
        filter: {
          activeTools: [toolID],
        },
      },
    ],
    cursors: [
      {
        cursor: "pointer",
        filter: {
          target: [
            {
              key: "layer",
              value: "CHARACTER",
              coordinator: "||",
            },
            {
              key: "layer",
              value: "DRAWING",
            },
          ],
        },
      },
    ],
    shortcut: "A",
    async onToolMove(_context, event) {
      const metadata = await OBR.player.getMetadata();
      const selectedSpell = metadata?.[toolMetadataSelectedSpell] as
        | string
        | undefined;
      if (!selectedSpell) {
        clearAimingOverlay();
        clearAoePreview();
        return;
      }

      const activeCaster = await resolveActiveCaster(playerRole, playerID);
      if (!activeCaster) {
        clearAimingOverlay();
        clearAoePreview();
        return;
      }

      const grid = await getSceneGridInfo();

      const spell = getSpell(selectedSpell, playerRole === "GM");
      const aoe = getSpellAoE(spell, selectedSpell);

      if (aoe) {
        clearAimingOverlay();
        const maxRange = getSpellRange(spell, selectedSpell);
        const isSelfCentered = aoe.shape === "Sphere" && maxRange === 0;

        const isTargetToken = !event.shiftKey && isValidCombatTargetToken(event.target);
        const targetPos = isSelfCentered
          ? activeCaster.position
          : isTargetToken
            ? event.target!.position
            : event.pointerPosition;

        await renderAoePreview({
          template: {
            shape: aoe.shape,
            origin: activeCaster.position,
            cursor: targetPos,
            sizeFeet: aoe.size,
          },
          grid,
          casterId: activeCaster.id,
        });
      } else {
        clearAoePreview();
        const maxRange = getSpellRange(spell, selectedSpell);
        const isTargetToken = !event.shiftKey && isValidCombatTargetToken(event.target);
        const targetPos = isTargetToken
          ? event.target!.position
          : !event.shiftKey
            ? snapToCellCenter(event.pointerPosition, grid)
            : event.pointerPosition;

        // Check Line of Sight against any darkness zones
        const sceneItems = await OBR.scene.items.getItems();
        const darknessZones = extractDarknessZones(sceneItems);
        const visionRules = activeCaster.item
          ? readTokenVisionRules(activeCaster.item)
          : {};
        const casterElevation = readTokenElevation(activeCaster.item);
        const targetElevation = readTokenElevation(event.target);
        const visionCheck = evaluateLineOfSight(
          activeCaster.position,
          targetPos,
          darknessZones,
          grid,
          {
            isDM: false,
            casterId: activeCaster.id,
            playerId: playerID,
            characterId: activeCaster.item ? getLinkedDDBCharacterId(activeCaster.item) ?? undefined : undefined,
            visionRules,
            casterElevation,
            targetElevation,
          },
        );

        const isWeapon =
          selectedSpell === "melee_weapon_attack" ||
          selectedSpell === "ranged_weapon_attack";

        let hasAdvantage = false;
        let hasDisadvantage = false;

        if (darknessZones.length > 0) {
          const casterInDarkness = darknessZones.some((zone) => {
            const dx = activeCaster.position.x - zone.position.x;
            const dy = activeCaster.position.y - zone.position.y;
            const distFeet =
              (Math.sqrt(dx * dx + dy * dy) / grid.dpi) * grid.scaleMultiplier;
            return distFeet <= zone.radiusFeet;
          });

          if (!visionCheck.canSee) {
            if (isWeapon) {
              hasDisadvantage = true;
            }
          } else if (casterInDarkness) {
            const targetToken = sceneItems.find(
              (item) =>
                isValidCombatTargetToken(item) &&
                Math.hypot(
                  item.position.x - targetPos.x,
                  item.position.y - targetPos.y,
                ) <
                  grid.dpi / 2,
            );
            const targetVisionRules = targetToken
              ? readTokenVisionRules(targetToken)
              : {};
            const targetHasDarknessVision = Boolean(
              targetVisionRules.devilsSight ||
                (targetVisionRules.truesight &&
                  targetVisionRules.truesight >= 15) ||
                (targetVisionRules.blindFighting &&
                  targetVisionRules.blindFighting >= 10),
            );
            if (!targetHasDarknessVision) {
              hasAdvantage = true;
            }
          }
        }

        await renderAimingOverlay({
          casterPos: activeCaster.position,
          cursorPos: targetPos,
          maxRangeFeet: maxRange,
          grid,
          visionCheck,
          isWeapon,
          hasAdvantage,
          hasDisadvantage,
        });
      }
    },
    async onToolClick(_context, event) {
      let targetIsUnseenInDarkness = false;
      let casterHasDarknessAdvantage = false;

      // Check single-target range clamping & darkness vision if a spell is selected
      const metadata = await OBR.player.getMetadata();
      const selectedSpell = metadata?.[toolMetadataSelectedSpell] as
        | string
        | undefined;
      const damageChoice = metadata?.[selectedSpellDamageTypeMetadataKey] as
        | { spellId?: unknown; damageType?: unknown }
        | undefined;
      const selectedDamageType =
        damageChoice &&
        damageChoice.spellId === selectedSpell &&
        typeof damageChoice.damageType === "string"
          ? damageChoice.damageType
          : undefined;
      const slotChoice = metadata?.[selectedSpellSlotLevelMetadataKey] as
        | { spellId?: unknown; slotLevel?: unknown }
        | undefined;
      if (selectedSpell) {
        const spell = getSpell(selectedSpell, playerRole === "GM");
        const aoe = getSpellAoE(spell, selectedSpell);
        const activeCaster = await resolveActiveCaster(playerRole, playerID);
        const maxRange = getSpellRange(spell, selectedSpell);
        const isSelfCentered = Boolean(
          aoe && aoe.shape === "Sphere" && maxRange === 0 && activeCaster,
        );

        if (isSelfCentered && activeCaster) {
          clearAimingOverlay();
          clearAoePreview();

          const targetHighlight = buildTarget(
            1,
            getItemSize(activeCaster.item) * 1.31,
            activeCaster.position,
            true,
            activeCaster.id,
          );
          await OBR.scene.local.addItems([targetHighlight]);

          await doSpell(selectedSpell, playerID, playerRole === "GM");

          if (!getSettingsValue(LOCAL_STORAGE_KEYS.KEEP_SELECTED_TARGETS)) {
            await clearAllTargets();
          } else {
            clearAimingOverlay();
            clearAoePreview();
          }

          const charId = activeCaster.item
            ? getLinkedDDBCharacterId(activeCaster.item)
            : null;
          const ddbChar =
            (charId ? getCachedDDBCharacter(charId) : null) ??
            (activeCaster.item?.name
              ? findCachedDDBCharacter(activeCaster.item.name)
              : null);
          const casterName =
            ddbChar?.name || activeCaster.item?.name || "Caster";
          const spellName = spell?.name || selectedSpell;

          if (charId) {
            const ddbSpell = ddbChar?.spells?.find(
              (s) =>
                s.name.toLowerCase() === selectedSpell.toLowerCase() ||
                s.id === selectedSpell,
            );
            const castSlotLevel =
              slotChoice?.spellId === selectedSpell &&
              typeof slotChoice.slotLevel === "number"
                ? slotChoice.slotLevel
                : (ddbSpell?.level ?? 0);
            if (castSlotLevel >= 1) {
              await deductSpellSlotIfLeveled(charId, castSlotLevel, ddbChar);
            }
          }

          OBR.notification.show(
            `${casterName} activated ${spellName} (Centered on Self)`,
            "SUCCESS",
          );
          await stopAiming();
          return;
        }

        if (aoe && maxRange > 0 && activeCaster) {
          const grid = await getSceneGridInfo();
          const isTargetToken = Boolean(!event.shiftKey && isValidCombatTargetToken(event.target));
          const targetPos = isTargetToken
            ? event.target!.position
            : !event.shiftKey
              ? snapAoECenter(event.pointerPosition, aoe.shape, aoe.size, grid)
              : event.pointerPosition;
          const rangeCheck = isWithinRange(
            activeCaster.position,
            targetPos,
            maxRange,
            grid,
          );
          if (!rangeCheck.withinRange) {
            OBR.notification.show(
              `Out of range! (Max: ${maxRange} ft, AoE center is at ${rangeCheck.currentDistanceFeet} ft)`,
              "WARNING",
            );
            return false;
          }
        } else if (!aoe && activeCaster) {
          const grid = await getSceneGridInfo();
          const maxRangeFeet = getSpellRange(spell, selectedSpell);
          const isTargetToken = Boolean(!event.shiftKey && isValidCombatTargetToken(event.target));
          const targetPos = isTargetToken
            ? event.target!.position
            : !event.shiftKey
              ? snapToCellCenter(event.pointerPosition, grid)
              : event.pointerPosition;
          const rangeCheck = isWithinRange(
            activeCaster.position,
            targetPos,
            maxRangeFeet,
            grid,
          );
          if (!rangeCheck.withinRange) {
            OBR.notification.show(
              `Out of range! (Max: ${maxRangeFeet} ft, Target is at ${rangeCheck.currentDistanceFeet} ft)`,
              "WARNING",
            );
            return false;
          }

          // Vision / Darkness Line of Sight check
          const sceneItems = await OBR.scene.items.getItems();
          const darknessZones = extractDarknessZones(sceneItems);

          if (darknessZones.length > 0) {
            const visionRules = activeCaster.item
              ? readTokenVisionRules(activeCaster.item)
              : {};
            const casterElevation = readTokenElevation(activeCaster.item);
            const targetElevation = readTokenElevation(event.target);
            const visionCheck = evaluateLineOfSight(
              activeCaster.position,
              targetPos,
              darknessZones,
              grid,
              {
                isDM: false,
                casterId: activeCaster.id,
                playerId: playerID,
                characterId: activeCaster.item ? getLinkedDDBCharacterId(activeCaster.item) ?? undefined : undefined,
                visionRules,
                casterElevation,
                targetElevation,
              },
            );

            const isWeapon =
              selectedSpell === "melee_weapon_attack" ||
              selectedSpell === "ranged_weapon_attack";

            if (!visionCheck.canSee) {
              // 5.5e Rule: If attacking an unseen target in Darkness:
              // Physical weapon attacks can still be made, but suffer Disadvantage.
              // Spells requiring sight ("that you can see") cannot target the creature.
              if (isWeapon) {
                targetIsUnseenInDarkness = true;
                OBR.notification.show(
                  "Attacking in Darkness without special vision (Disadvantage applied)",
                  "INFO",
                );
              } else {
                OBR.notification.show(
                  `Cannot target: ${visionCheck.reason || "Blocked by Magical Darkness (requires sight)!"}`,
                  "WARNING",
                );
                return false;
              }
            } else {
              // Caster can see! Check if caster is inside Darkness (with Devil's Sight / Truesight)
              // while target outside cannot see caster -> Unseen Attacker gives Advantage!
              const targetItem = isValidCombatTargetToken(event.target) ? event.target : undefined;
              if (targetItem) {
                const targetVisionRules = readTokenVisionRules(
                  targetItem as any,
                );
                const reverseVisionCheck = evaluateLineOfSight(
                  targetPos,
                  activeCaster.position,
                  darknessZones,
                  grid,
                  {
                    isDM: false,
                    casterId: targetItem.id,
                    playerId: (targetItem as any).metadata?.["embers/characterOwner"] as string | undefined,
                    characterId: getLinkedDDBCharacterId(targetItem) ?? undefined,
                    visionRules: targetVisionRules,
                    casterElevation: targetElevation,
                    targetElevation: casterElevation,
                  },
                );
                if (!reverseVisionCheck.canSee) {
                  // Defender cannot see attacker -> Attacker has Advantage (Invisible / Unseen Attacker)
                  casterHasDarknessAdvantage = true;
                  OBR.notification.show(
                    "Attacking from inside Darkness with special vision (Advantage applied)",
                    "INFO",
                  );
                }
              }
            }
          }
        }
      }

      // User is clicking on a character token or drawing object
      if (isValidCombatTargetToken(event.target)) {
        const canCast =
          playerRole === "GM" ||
          (await getGlobalSettingsValue(
            GLOBAL_STORAGE_KEYS.PLAYERS_CAN_CAST_SPELLS,
          ));
        const smartActionEnabled =
          getSettingsValue(LOCAL_STORAGE_KEYS.SMART_ACTION_ON_TARGET) !== false;

        if (selectedSpell && smartActionEnabled && canCast) {
          const activeCaster = await resolveActiveCaster(playerRole, playerID);
          const buffs = activeCaster?.item
            ? getTokenBuffs(activeCaster.item)
            : [];
          const buffMods = getComputedBuffModifiers(buffs);

          let rollMode: "normal" | "advantage" | "disadvantage" = "normal";
          if (event.ctrlKey || event.altKey || event.metaKey) {
            rollMode = "disadvantage";
          } else if (event.shiftKey) {
            rollMode = "advantage";
          } else if (targetIsUnseenInDarkness) {
            rollMode = "disadvantage";
          } else if (casterHasDarknessAdvantage) {
            rollMode = "advantage";
          } else {
            const isWeapon =
              selectedSpell === "melee_weapon_attack" ||
              selectedSpell === "ranged_weapon_attack";
            if (isWeapon && buffMods.hasAttackAdvantage) {
              rollMode = "advantage";
            } else if (!isWeapon && buffMods.hasSpellAdvantage) {
              rollMode = "advantage";
            }
          }

          const charId = activeCaster?.item
            ? getLinkedDDBCharacterId(activeCaster.item)
            : null;
          const ddbChar =
            (charId ? getCachedDDBCharacter(charId) : null) ??
            (activeCaster?.item?.name
              ? findCachedDDBCharacter(activeCaster.item.name)
              : null);
          const charLevel = ddbChar?.level ?? 1;
          const beamInfo = getSpellBeamInfo(
            selectedSpell,
            charLevel,
            undefined,
            playerRole === "GM",
          );

          const targets = await getSortedTargets();
          const existingTarget = targets.find(
            (image) => image.attachedTo === event.target!.id,
          );

          if (!existingTarget) {
            const targetHighlight = buildTarget(
              ((targets.length > 0
                ? getTargetID(targets[targets.length - 1])
                : undefined) ?? 0) + 1,
              getItemSize(event.target!) * 1.31,
              event.target!.position,
              targets.length === 0,
              event.target!.id,
            );
            await OBR.scene.local.addItems([targetHighlight]);
          } else {
            await incrementTargetCount(existingTarget);
          }

          // Count total allocated beams across all targets including the click just made
          const currentAllocatedBeams =
            targets.reduce((sum, t) => sum + (getTargetCount(t) ?? 1), 0) + 1;

          if (currentAllocatedBeams >= beamInfo.totalBeams) {
            clearAimingOverlay();
            clearAoePreview();
            await doSpell(selectedSpell, playerID, playerRole === "GM");

            // Auto-cleanup canvas: delete lingering targets and clear tether
            if (!getSettingsValue(LOCAL_STORAGE_KEYS.KEEP_SELECTED_TARGETS)) {
              await clearAllTargets();
            } else {
              clearAimingOverlay();
              clearAoePreview();
            }

            const casterName =
              ddbChar?.name || activeCaster?.item?.name || "Caster";
            const targetName = event.target?.name || "Target";

            const combatState = charId ? await loadCombatState(charId) : null;
            const isHexActive = isHexConcentrationActive(combatState);
            const hexActionName = combatState?.hexAbility
              ? `HEX (${combatState.hexAbility.toUpperCase()})`
              : "HEX (CURSE)";

            const ddbSpell = ddbChar?.spells?.find(
              (s) =>
                s.name.toLowerCase() === selectedSpell.toLowerCase() ||
                s.id === selectedSpell,
            );
            const spell = getSpell(selectedSpell, playerRole === "GM");
            const spellAttackBonus = ddbChar?.spellAttackBonus ?? 5;
            const spellSaveDC =
              (ddbChar?.spellSaveDC ?? 13) + buffMods.spellSaveDcBonus;
            const spellName = ddbSpell?.name || spell?.name || selectedSpell;

            const isCastingHex =
              selectedSpell.toLowerCase() === "hex" ||
              spellName.toLowerCase() === "hex";
            const spellFormula = resolveSpellFormula({
              id: ddbSpell?.id || selectedSpell,
              name: spellName,
              level: ddbSpell?.level ?? 0,
              school: ddbSpell?.school ?? "",
              damage: ddbSpell?.damage,
              damageType: ddbSpell?.damageType,
            });
            const isWeaponBasedSpell =
              spellFormula.interaction?.type === "weapon_based";
            const castSlotLevel =
              slotChoice?.spellId === selectedSpell &&
              typeof slotChoice.slotLevel === "number"
                ? slotChoice.slotLevel
                : (ddbSpell?.level ?? spellFormula.category.level);

            // Deduct spell slot if leveled spell and not moving hex
            if (
              charId &&
              castSlotLevel >= 1 &&
              !(isCastingHex && isHexActive)
            ) {
              await deductSpellSlotIfLeveled(charId, castSlotLevel, ddbChar);
            }

            if (activeCaster?.id) {
              await checkAndFireActionTriggers(activeCaster.id, "spell").catch(
                () => {},
              );
            }

            // Concentration tracking for non-hex spells (Hex manages its own state below)
            if (charId && ddbSpell?.concentration && !isCastingHex) {
              if (
                combatState?.concentrationSpellName &&
                combatState.concentrationSpellId !== ddbSpell.id
              ) {
                OBR.notification.show(
                  `Concentration broken on "${combatState.concentrationSpellName}"! Now concentrating on "${spellName}".`,
                  "WARNING",
                );
              }
              await saveCombatState(charId, {
                concentrationSpellId: ddbSpell.id,
                concentrationSpellName: spellName,
              });
            }

            if (isCastingHex) {
              let chosenAbility = "dexterity";
              try {
                const playerMeta = await OBR.player.getMetadata();
                if (playerMeta[hexChosenAbilityMetadataKey]) {
                  chosenAbility = String(
                    playerMeta[hexChosenAbilityMetadataKey],
                  ).toLowerCase();
                } else if (combatState?.hexAbility) {
                  chosenAbility = combatState.hexAbility.toLowerCase();
                }
              } catch {
                // fallback to dexterity
              }
              const abilityLabel =
                chosenAbility.charAt(0).toUpperCase() + chosenAbility.slice(1);
              const abilityUpper = chosenAbility.toUpperCase();

              if (charId) {
                await saveCombatState(charId, {
                  concentrationSpellId: "hex",
                  concentrationSpellName: `Hex (${abilityLabel})`,
                  hexTargetId: event.target?.id || "",
                  hexTargetName: targetName,
                  hexAbility: chosenAbility,
                });
              }
              const ddbCards: DDBRollCardData[] = [
                {
                  id: `${Date.now()}-hex-cast`,
                  casterName,
                  targetName,
                  actionName: `HEX (${abilityUpper})`,
                  actionType: "SPELL",
                  dieType: 6,
                  diceBreakdown: "Hex Curse Applied",
                  formula: "Concentration, up to 1 hr",
                  total: "CURSED",
                  subtitle: `Disadvantage on ${abilityLabel} checks • +1d6 Necrotic per attack hit`,
                  timestamp: Date.now(),
                },
              ];
              broadcastDDBRoll(ddbCards);
              OBR.notification.show(
                `${casterName} cursed ${targetName} with Hex (${abilityLabel})! Concentration active: Disadvantage on ${abilityLabel} checks & +1d6 Necrotic on each attack hit.`,
                "SUCCESS",
              );
              await stopAiming();
              return;
            }

            if (
              selectedSpell === "melee_weapon_attack" ||
              selectedSpell === "ranged_weapon_attack" ||
              selectedSpell === "flurry_of_blows"
            ) {
              if (activeCaster?.id) {
                await checkAndFireActionTriggers(
                  activeCaster.id,
                  "attack",
                ).catch(() => {});
              }
              const playerMeta = await OBR.player.getMetadata();
              const selectedWeaponId =
                (playerMeta[toolMetadataSelectedWeapon] as string) ||
                (selectedSpell === "flurry_of_blows" ? "weapon_unarmed_strike" : undefined);
              const weapon =
                (selectedWeaponId && ddbChar?.weapons?.find((w) => w.id === selectedWeaponId)) ||
                (selectedSpell === "flurry_of_blows"
                  ? ddbChar?.weapons?.find((w) => w.name.toLowerCase().includes("unarmed"))
                  : undefined) ||
                ddbChar?.weapons?.[0];
              const attackCount =
                selectedSpell === "flurry_of_blows"
                  ? 2
                  : Math.max(1, (playerMeta[toolMetadataAttackCount] as number) || 1);

              if (weapon) {
                const isFlurry = selectedSpell === "flurry_of_blows";
                const ddbCards: DDBRollCardData[] = [];
                const reports: string[] = [];
                const activeBuffNames = buffs.map((b) => b.name);
                const savedRiderChoice =
                  (playerMeta[selectedRiderChoiceMetadataKey] as string) || undefined;
                const usedRidersThisTurn = new Set<string>();

                for (let i = 1; i <= attackCount; i++) {
                  const strikeSuffix = isFlurry || attackCount > 1 ? ` (Strike ${i})` : "";
                  const actionLabel = isFlurry
                    ? `FLURRY OF BLOWS${strikeSuffix}`
                    : `${weapon.name.toUpperCase()}${strikeSuffix}`;

                  const roll = rollAttack(weapon.toHit, "", rollMode);
                  ddbCards.push({
                    id: `${Date.now()}-${i}-atk`,
                    casterName,
                    targetName,
                    actionName: actionLabel,
                    actionType: "TO HIT",
                    dieType: 20,
                    diceBreakdown: `${roll.d20} ${roll.bonus >= 0 ? `+ ${roll.bonus}` : `- ${Math.abs(roll.bonus)}`}`,
                    formula: `1d20${roll.bonus >= 0 ? `+${roll.bonus}` : `${roll.bonus}`}${roll.mode === "advantage" ? " (ADV)" : roll.mode === "disadvantage" ? " (DIS)" : ""}`,
                    total: roll.total,
                    subtitle: roll.isCrit
                      ? "Critical Hit!"
                      : roll.isMiss
                        ? "Critical Miss!"
                        : `${weapon.name} Attack Roll`,
                    isCrit: roll.isCrit,
                    isMiss: roll.isMiss,
                    rollMode: roll.mode,
                    isAdvantage: roll.mode === "advantage",
                    isDisadvantage: roll.mode === "disadvantage",
                    timestamp: Date.now() + (i * 3),
                  });

                  let dmgReport = "";
                  let hexNotice = "";

                  if (!roll.isMiss) {
                    const riders = resolveWeaponRiders({
                      character: ddbChar,
                      weapon,
                      activeBuffs: activeBuffNames,
                      riderChoice: savedRiderChoice,
                      usedRidersThisTurn,
                    });

                    const effectiveFormula = combineDamageBonus(
                      weapon.damage,
                      riders.flatBonus,
                    );
                    const baseDmg = rollDamageBreakdown(
                      effectiveFormula,
                      weapon.damageType,
                      "",
                      undefined,
                      roll.isCrit,
                    );

                    const extraRiderRolls: Array<{
                      rider: ActiveWeaponRider;
                      dmg: ReturnType<typeof rollDamageDDB>;
                    }> = [];

                    for (const rider of riders.activeDiceRiders) {
                      const rolledDice =
                        roll.isCrit && rider.dice
                          ? rider.dice.replace(
                              /^(\d+)d(\d+)/i,
                              (_, n, s) => `${Number(n) * 2}d${s}`,
                            )
                          : rider.dice || "1d6";

                      const riderFormula = rider.bonus
                        ? `${rolledDice}+${rider.bonus}`
                        : rolledDice;
                      const riderRoll = rollDamageDDB(
                        riderFormula,
                        rider.damageType,
                        "",
                        false,
                      );
                      extraRiderRolls.push({ rider, dmg: riderRoll });
                      if (rider.frequency === "first_hit_per_turn") {
                        usedRidersThisTurn.add(rider.id);
                      }
                    }

                    const totalDamage =
                      baseDmg.total +
                      extraRiderRolls.reduce((sum, r) => sum + r.dmg.total, 0);

                    const baseFormulaForDisplay = roll.isCrit
                      ? doubleDiceFormula(effectiveFormula)
                      : effectiveFormula;

                    let combinedFormula = `${baseFormulaForDisplay} ${weapon.damageType}`;
                    if (extraRiderRolls.length > 0) {
                      combinedFormula +=
                        " + " +
                        extraRiderRolls
                          .map((r) => {
                            const riderDiceForDisplay = roll.isCrit && r.rider.dice
                              ? doubleDiceFormula(r.rider.dice)
                              : (r.rider.dice || "1d6");
                            return `${riderDiceForDisplay}${r.rider.bonus ? `+${r.rider.bonus}` : ""} ${r.rider.damageType}`;
                          })
                          .join(" + ");
                    }

                    const baseBreakdownClean = baseDmg.formatted
                      .replace(/^Damage:\s*\d+\s*[A-Za-z]*\s*\(/, "")
                      .replace(/\)$/, "")
                      .replace(/\+/g, " + ");
                    let combinedBreakdown = `${baseBreakdownClean} (${weapon.damageType})`;
                    if (extraRiderRolls.length > 0) {
                      combinedBreakdown +=
                        " + " +
                        extraRiderRolls
                          .map(
                            (r) =>
                              `${r.dmg.breakdown.replace(/\+/g, " + ")} (${r.rider.damageType})`,
                          )
                          .join(" + ");
                    }

                    const subtitleParts: string[] = [
                      `Damage (${weapon.damageType})`,
                    ];
                    if (riders.flatBonusReasons.length > 0) {
                      subtitleParts.push(...riders.flatBonusReasons);
                    }
                    if (extraRiderRolls.length > 0) {
                      subtitleParts.push(
                        ...extraRiderRolls.map(
                          (r) => `${r.rider.name} (${r.rider.damageType})`,
                        ),
                      );
                    }

                    ddbCards.push({
                      id: `${Date.now()}-${i}-dmg`,
                      casterName,
                      targetName,
                      actionName: actionLabel,
                      actionType: "DAMAGE",
                      dieType: 8,
                      diceBreakdown: combinedBreakdown,
                      formula: combinedFormula,
                      total: totalDamage,
                      subtitle: subtitleParts.join(" • "),
                      isCrit: roll.isCrit,
                      timestamp: Date.now() + (i * 3) + 1,
                    });
                    dmgReport = ` | Damage: ${totalDamage}`;

                    if (isHexActive) {
                      const hexDice = roll.isCrit ? "2d6" : "1d6";
                      const hexDmg = rollDamageDDB(
                        "1d6",
                        "Necrotic",
                        "",
                        roll.isCrit,
                      );
                      ddbCards.push({
                        id: `${Date.now()}-${i}-hex-dmg`,
                        casterName,
                        targetName,
                        actionName: hexActionName,
                        actionType: "DAMAGE",
                        dieType: 6,
                        diceBreakdown: hexDmg.breakdown.replace(/\+/g, " + "),
                        formula: `${hexDice} Necrotic`,
                        total: hexDmg.total,
                        subtitle: roll.isCrit
                          ? "Hex Critical Hit (+2d6 Necrotic)"
                          : "Hex Curse (+1d6 Necrotic)",
                        isCrit: roll.isCrit,
                        timestamp: Date.now() + (i * 3) + 2,
                      });
                      hexNotice = ` | Hex: +${hexDmg.total} Necrotic`;
                    }
                  } else if (hasWeaponGraze(weapon)) {
                    const abilityMod = Math.max(
                      1,
                      weapon.toHit - (ddbChar?.proficiencyBonus ?? 2),
                    );
                    ddbCards.push({
                      id: `${Date.now()}-${i}-graze-dmg`,
                      casterName,
                      targetName,
                      actionName: `${actionLabel} (GRAZE)`,
                      actionType: "DAMAGE",
                      dieType: 0,
                      diceBreakdown: `${abilityMod}`,
                      formula: `${abilityMod} ${weapon.damageType}`,
                      total: abilityMod,
                      subtitle: "Weapon Mastery: Graze (Damage on Miss)",
                      timestamp: Date.now() + (i * 3) + 1,
                    });
                    dmgReport = ` | Graze: ${abilityMod} ${weapon.damageType}`;
                  } else {
                    dmgReport = " | Miss (0 Damage)";
                  }

                  reports.push(`Strike ${i}: ${roll.formatted}${dmgReport}${hexNotice}`);
                }

                broadcastDDBRoll(ddbCards);
              } else {
                if (activeCaster?.id) {
                  await checkAndFireActionTriggers(
                    activeCaster.id,
                    "attack",
                  ).catch(() => {});
                }
                const roll = rollAttack(
                  ddbChar?.modifiers?.str
                    ? ddbChar.modifiers.str + ddbChar.proficiencyBonus
                    : 5,
                  "",
                  rollMode,
                );
                const ddbCards: DDBRollCardData[] = [
                  {
                    id: `${Date.now()}-unarmed`,
                    casterName,
                    targetName,
                    actionName: "UNARMED STRIKE",
                    actionType: "TO HIT",
                    dieType: 20,
                    diceBreakdown: `${roll.d20} ${roll.bonus >= 0 ? `+ ${roll.bonus}` : `- ${Math.abs(roll.bonus)}`}`,
                    formula: `1d20${roll.bonus >= 0 ? `+${roll.bonus}` : `${roll.bonus}`}${roll.mode === "advantage" ? " (ADV)" : roll.mode === "disadvantage" ? " (DIS)" : ""}`,
                    total: roll.total,
                    subtitle: roll.isCrit
                      ? "Critical Hit!"
                      : roll.isMiss
                        ? "Critical Miss!"
                        : "Unarmed Attack",
                    isCrit: roll.isCrit,
                    isMiss: roll.isMiss,
                    rollMode: roll.mode,
                    isAdvantage: roll.mode === "advantage",
                    isDisadvantage: roll.mode === "disadvantage",
                    timestamp: Date.now(),
                  },
                ];
                if (!roll.isMiss) {
                  const unarmedDmg = Math.max(
                    1,
                    1 + (ddbChar?.modifiers?.str ?? 0),
                  );
                  ddbCards.push({
                    id: `${Date.now()}-dmg`,
                    casterName,
                    targetName,
                    actionName: "UNARMED STRIKE",
                    actionType: "DAMAGE",
                    dieType: 0,
                    diceBreakdown: `${unarmedDmg}`,
                    formula: `${unarmedDmg} Bludgeoning`,
                    total: unarmedDmg,
                    subtitle: "Unarmed Strike Damage",
                    isCrit: roll.isCrit,
                    timestamp: Date.now() + 1,
                  });

                  if (isHexActive) {
                    const hexDice = roll.isCrit ? "2d6" : "1d6";
                    const hexDmg = rollDamageDDB(
                      "1d6",
                      "Necrotic",
                      "",
                      roll.isCrit,
                    );
                    ddbCards.push({
                      id: `${Date.now()}-hex-dmg`,
                      casterName,
                      targetName,
                      actionName: hexActionName,
                      actionType: "DAMAGE",
                      dieType: 6,
                      diceBreakdown: hexDmg.breakdown.replace(/\+/g, " + "),
                      formula: `${hexDice} Necrotic`,
                      total: hexDmg.total,
                      subtitle: roll.isCrit
                        ? "Hex Critical Hit (+2d6 Necrotic)"
                        : "Hex Curse (+1d6 Necrotic)",
                      isCrit: roll.isCrit,
                      timestamp: Date.now() + 2,
                    });
                  }
                }
                broadcastDDBRoll(ddbCards);
              }
            } else {
              const applicableClass = spellFormula.category.classes
                .map((className) =>
                  ddbChar?.classSpellStats?.find(
                    (stat) =>
                      stat.className.toLowerCase() === className.toLowerCase(),
                  ),
                )
                .find((stat): stat is NonNullable<typeof stat> =>
                  Boolean(stat),
                );
              const statKey = (ddbChar?.spellCastingAbility?.toLowerCase() ||
                "cha") as "int" | "wis" | "cha";
              const spellcastingModifier =
                applicableClass?.modifier ??
                ddbChar?.modifiers?.[statKey] ??
                Math.max(
                  1,
                  (ddbChar?.spellAttackBonus ?? spellAttackBonus) -
                    (ddbChar?.proficiencyBonus ?? 2),
                );

              const rollSpellDamageFormula = (
                dice: string,
                dmgType: string,
                isCrit: boolean = false,
              ): DDBDamageResult => {
                const exploding = spellFormula.mechanics?.find(
                  (m) => m.kind === "exploding",
                );
                const explodingAnyDie = spellFormula.mechanics?.find(
                  (m) => m.kind === "exploding_any_die",
                );

                if (exploding) {
                  const triggerValue = exploding.triggerValue ?? 8;
                  const maxExplosions =
                    exploding.maxExtra === "spellcastingMod"
                      ? Math.max(1, spellcastingModifier)
                      : typeof exploding.maxExtra === "number"
                        ? exploding.maxExtra
                        : 0;
                  return rollDamageExploding(
                    dice,
                    dmgType,
                    triggerValue,
                    maxExplosions,
                    "",
                    isCrit,
                  );
                }
                if (explodingAnyDie) {
                  const maxExplosions =
                    explodingAnyDie.maxExtra === "spellcastingMod"
                      ? Math.max(1, spellcastingModifier)
                      : typeof explodingAnyDie.maxExtra === "number"
                        ? explodingAnyDie.maxExtra
                        : 0;
                  return rollDamageExplodingAnyDie(
                    dice,
                    dmgType,
                    maxExplosions,
                    isCrit,
                  );
                }
                return rollDamageDDB(dice, dmgType, "", isCrit);
              };

              if (isWeaponBasedSpell) {
                const weapon = ddbChar?.weapons?.find(
                  (candidate) =>
                    candidate.type === "melee" &&
                    candidate.isProficient !== false,
                );
                if (!weapon) {
                  OBR.notification.show(
                    `${spellName} requires a linked character and an equipped proficient melee weapon.`,
                    "WARNING",
                  );
                  await stopAiming();
                  return;
                }

                const meleeReach =
                  spellFormula.interaction?.weaponAttack?.meleeRangeFeet ?? 5;
                const isWithinMeleeReach = Boolean(
                  activeCaster &&
                  isWithinRange(
                    activeCaster.position,
                    event.target!.position,
                    meleeReach,
                    await getSceneGridInfo(),
                  ).withinRange,
                );
                const rangedDelivery =
                  spellFormula.interaction?.weaponAttack?.rangedSpellAttack;
                const isRangedDelivery = Boolean(
                  rangedDelivery && !isWithinMeleeReach,
                );
                const scaleTier = [...(spellFormula.cantripScale?.tiers ?? [])]
                  .filter((tier) => tier.minLevel <= charLevel)
                  .sort((a, b) => b.minLevel - a.minLevel)[0];
                const weaponStep = spellFormula.mechanics?.find(
                  (mechanic) => mechanic.kind === "weapon_step_upgrade",
                );
                const damageParts = buildWeaponStepDamage(
                  weapon,
                  spellcastingModifier,
                  scaleTier?.totalDice,
                  weaponStep?.steps ?? 0,
                );
                const weaponSpellAttackBonus =
                  spellcastingModifier +
                  (ddbChar?.proficiencyBonus ?? 0) +
                  (weapon.magicDamageBonus ?? 0);
                const usesWeaponDamageType = selectedDamageType === "weapon";
                const weaponDamageType = isRangedDelivery
                  ? rangedDelivery!.damageType
                  : usesWeaponDamageType
                    ? weapon.damageType
                    : String(
                        spellFormula.damage.find((entry) => entry.isBase)
                          ?.typeChoices?.[0] ?? "",
                      ).replace(/^./, (char) => char.toUpperCase());
                const attack = rollAttack(weaponSpellAttackBonus, "", rollMode);
                const extraDamageType = String(
                  spellFormula.cantripScale?.extraDamageType ?? "Cold",
                );
                const exploding = spellFormula.mechanics?.find(
                  (mechanic) => mechanic.kind === "exploding_any_die",
                );
                const maxExplosions =
                  exploding?.maxExtra === "spellcastingMod"
                    ? spellcastingModifier
                    : (exploding?.maxExtra ?? 0);
                const weaponDamage = exploding
                  ? rollDamageExplodingAnyDie(
                      damageParts.weaponFormula,
                      weaponDamageType,
                      maxExplosions,
                      attack.isCrit,
                    )
                  : rollDamageDDB(
                      damageParts.weaponFormula,
                      weaponDamageType,
                      "",
                      attack.isCrit,
                    );
                const extraDamage = damageParts.extraDice
                  ? exploding
                    ? rollDamageExplodingAnyDie(
                        damageParts.extraDice,
                        extraDamageType,
                        Math.max(
                          0,
                          maxExplosions - (weaponDamage.explosionCount ?? 0),
                        ),
                        attack.isCrit,
                      )
                    : rollDamageDDB(
                        damageParts.extraDice,
                        extraDamageType,
                        "",
                        attack.isCrit,
                      )
                  : null;
                const totalDamage =
                  weaponDamage.total + (extraDamage?.total ?? 0);
                const weaponFormulaForDisplay = attack.isCrit
                  ? doubleDiceFormula(damageParts.weaponFormula)
                  : damageParts.weaponFormula;
                const extraDiceForDisplay = attack.isCrit && damageParts.extraDice
                  ? doubleDiceFormula(damageParts.extraDice)
                  : damageParts.extraDice;

                const damageFormula = [
                  `${weaponFormulaForDisplay} ${weaponDamageType}`,
                  extraDiceForDisplay
                    ? `${extraDiceForDisplay} ${extraDamageType}`
                    : "",
                ]
                  .filter(Boolean)
                  .join(" + ");
                const ddbCards: DDBRollCardData[] = [
                  {
                    id: `${Date.now()}-frigid-atk`,
                    casterName,
                    targetName,
                    actionName: spellName.toUpperCase(),
                    actionType: "TO HIT",
                    dieType: 20,
                    diceBreakdown: `${attack.d20} ${attack.bonus >= 0 ? `+ ${attack.bonus}` : `- ${Math.abs(attack.bonus)}`}`,
                    formula: `1d20${attack.bonus >= 0 ? `+${attack.bonus}` : `${attack.bonus}`}${attack.mode === "advantage" ? " (ADV)" : attack.mode === "disadvantage" ? " (DIS)" : ""}`,
                    total: attack.total,
                    subtitle: isRangedDelivery
                      ? "Ranged Spell Attack Roll"
                      : `${weapon.name} Melee Attack Roll`,
                    isCrit: attack.isCrit,
                    isMiss: attack.isMiss,
                    rollMode: attack.mode,
                    isAdvantage: attack.mode === "advantage",
                    isDisadvantage: attack.mode === "disadvantage",
                    timestamp: Date.now(),
                  },
                ];
                if (!attack.isMiss) {
                  ddbCards.push({
                    id: `${Date.now()}-frigid-dmg`,
                    casterName,
                    targetName,
                    actionName: spellName.toUpperCase(),
                    actionType: "DAMAGE",
                    dieType: Number(
                      damageParts.weaponDice.match(/d(\d+)/i)?.[1] ?? 8,
                    ),
                    diceBreakdown: [
                      weaponDamage.breakdown,
                      extraDamage?.breakdown,
                    ]
                      .filter(Boolean)
                      .join(" + ")
                      .replace(/\+/g, " + "),
                    formula: damageFormula,
                    total: totalDamage,
                    subtitle: `${weapon.name} + ${spellName} Damage`,
                    isCrit: attack.isCrit,
                    timestamp: Date.now() + 1,
                  });

                  if (isHexActive) {
                    const hexDice = attack.isCrit ? "2d6" : "1d6";
                    const hexDamage = rollDamageDDB(
                      "1d6",
                      "Necrotic",
                      "",
                      attack.isCrit,
                    );
                    ddbCards.push({
                      id: `${Date.now()}-frigid-hex`,
                      casterName,
                      targetName,
                      actionName: hexActionName,
                      actionType: "DAMAGE",
                      dieType: 6,
                      diceBreakdown: hexDamage.breakdown.replace(/\+/g, " + "),
                      formula: `${hexDice} Necrotic`,
                      total: hexDamage.total,
                      subtitle: attack.isCrit
                        ? "Hex Critical Hit (+2d6 Necrotic)"
                        : "Hex Curse (+1d6 Necrotic)",
                      isCrit: attack.isCrit,
                      timestamp: Date.now() + 2,
                    });
                  }

                  const triggerInfo = resolveSpellConditionalTrigger(
                    spellName,
                    spellFormula.effectNotes?.join(" ") ||
                      ddbSpell?.description ||
                      "",
                    charLevel,
                    spellFormula,
                  );
                  if (
                    triggerInfo &&
                    triggerInfo.hasTrigger &&
                    event.target?.id
                  ) {
                    const triggerId = `trig_${Date.now()}_${event.target.id}`;
                    await addConditionalTrigger({
                      id: triggerId,
                      spellId: spellFormula.id,
                      spellName,
                      casterId: activeCaster?.id,
                      casterName,
                      targetId: event.target.id,
                      targetName,
                      conditionType: triggerInfo.conditionType,
                      damageFormula: triggerInfo.damageDice,
                      damageType: triggerInfo.damageType,
                      conditionDescription: triggerInfo.conditionDesc,
                      appliedAt: Date.now(),
                      initialPosition: event.target.position,
                    });
                    if (ddbCards[1]) {
                      ddbCards[1].pendingTriggerId = triggerId;
                      ddbCards[1].pendingTriggerName = spellName;
                      ddbCards[1].subtitle = `${weapon.name} + ${spellName} (Condition Applied)`;
                    }
                  }
                } else {
                  // Miss / Critical Miss!
                  const isCantrip =
                    spellFormula.category.spellType === "cantrip";
                  if (isCantrip && hasPotentCantrip(ddbChar) && extraDamage) {
                    const halfDamage = Math.max(
                      1,
                      Math.floor(extraDamage.total / 2),
                    );
                    ddbCards.push({
                      id: `${Date.now()}-potent-dmg`,
                      casterName,
                      targetName,
                      actionName: `${spellName.toUpperCase()} (POTENT CANTRIP)`,
                      actionType: "DAMAGE",
                      dieType: 8,
                      diceBreakdown: `${halfDamage} (Half)`,
                      formula: `${halfDamage} ${extraDamageType}`,
                      total: halfDamage,
                      subtitle: "Potent Cantrip (Half Damage on Miss)",
                      timestamp: Date.now() + 1,
                    });
                  } else if (hasWeaponGraze(weapon)) {
                    const abilityMod = Math.max(
                      1,
                      weapon.toHit - (ddbChar?.proficiencyBonus ?? 2),
                    );
                    ddbCards.push({
                      id: `${Date.now()}-graze-dmg`,
                      casterName,
                      targetName,
                      actionName: `${weapon.name.toUpperCase()} (GRAZE)`,
                      actionType: "DAMAGE",
                      dieType: 0,
                      diceBreakdown: `${abilityMod}`,
                      formula: `${abilityMod} ${weaponDamageType}`,
                      total: abilityMod,
                      subtitle: "Weapon Mastery: Graze (Damage on Miss)",
                      timestamp: Date.now() + 1,
                    });
                  }
                }

                broadcastDDBRoll(ddbCards);
              } else if (beamInfo.isMultiBeam) {
                // Multi-beam attack (e.g. Eldritch Blast, Scorching Ray): roll for each beam in Grouped D&D Beyond format
                const beamReports: string[] = [];
                const subRolls: DDBSubRollEntry[] = [];
                let totalCombinedDamage = 0;
                let totalHexDamage = 0;
                let anyCrit = false;
                let allMiss = true;

                // Resolve target tokens if multiple targets were selected
                const targetTokens: string[] = [];
                for (const t of targets) {
                  const count = getTargetCount(t) ?? 1;
                  const attachedId = t.attachedTo;
                  for (let k = 0; k < count; k++) {
                    if (attachedId) targetTokens.push(attachedId);
                  }
                }

                let tokenNameMap = new Map<string, string>();
                if (targetTokens.length > 0) {
                  try {
                    const tokenItems =
                      await OBR.scene.items.getItems(targetTokens);
                    tokenNameMap = new Map(
                      tokenItems.map((item) => [
                        item.id,
                        item.name || targetName,
                      ]),
                    );
                  } catch {
                  }
                }

                const damageType =
                  selectedDamageType || ddbSpell?.damageType || "Force";
                const dieFaces = Number(
                  ddbSpell?.damage?.match(/d(\d+)/i)?.[1] ?? 10,
                );

                for (let b = 1; b <= beamInfo.totalBeams; b++) {
                  const roll = rollAttack(spellAttackBonus, "", rollMode);
                  if (roll.isCrit) anyCrit = true;
                  if (!roll.isMiss) allMiss = false;

                  let hexSuffix = "";
                  const extraDamage: DDBSubRollExtraDamage[] = [];
                  const isCantrip =
                    spellFormula.category.spellType === "cantrip";
                  let bDmgResult: DDBDamageResult | null = null;

                  if (!roll.isMiss) {
                    const dmg = ddbSpell?.damage
                      ? rollSpellDamageFormula(
                          ddbSpell.damage,
                          damageType,
                          roll.isCrit,
                        )
                      : null;
                    if (dmg) {
                      bDmgResult = dmg;
                      totalCombinedDamage += dmg.total;
                    }

                    if (isHexActive) {
                      const hexDice = roll.isCrit ? "2d6" : "1d6";
                      const hexDmg = rollDamageDDB(
                        "1d6",
                        "Necrotic",
                        "",
                        roll.isCrit,
                      );
                      totalHexDamage += hexDmg.total;
                      extraDamage.push({
                        name: "Hex",
                        total: hexDmg.total,
                        damageType: "Necrotic",
                        diceBreakdown: hexDmg.breakdown.replace(/\+/g, " + "),
                        formula: `${hexDice} Necrotic`,
                        isCrit: roll.isCrit,
                      });
                      hexSuffix = ` | Hex: +${hexDmg.total}`;
                    }
                  } else if (
                    isCantrip &&
                    hasPotentCantrip(ddbChar) &&
                    ddbSpell?.damage
                  ) {
                    const baseDmg = rollSpellDamageFormula(
                      ddbSpell.damage,
                      damageType,
                      false,
                    );
                    if (baseDmg) {
                      const halfTotal = Math.max(
                        1,
                        Math.floor(baseDmg.total / 2),
                      );
                      totalCombinedDamage += halfTotal;
                      bDmgResult = {
                        total: halfTotal,
                        damageType,
                        breakdown: `${halfTotal} (Half)`,
                        formatted: `Damage: ${halfTotal} ${damageType} (Potent Cantrip)`,
                        message: `Damage: ${halfTotal} ${damageType} (Potent Cantrip)`,
                      };
                    }
                  }

                  const beamTargetId = targetTokens[b - 1];
                  const bTarget =
                    (beamTargetId
                      ? tokenNameMap.get(beamTargetId)
                      : undefined) || targetName;
                  const dmgStr = bDmgResult
                    ? ` | ${bDmgResult.formatted}`
                    : roll.isMiss
                      ? " | Miss (0 Damage)"
                      : "";
                  beamReports.push(
                    `[${beamInfo.beamUnit} ${b}] ${roll.formatted}${dmgStr}${hexSuffix}`,
                  );

                  subRolls.push({
                    unitLabel: `${beamInfo.beamUnit.toUpperCase()} ${b}`,
                    targetName: bTarget,
                    toHit: {
                      total: roll.total,
                      diceBreakdown: `${roll.d20} ${roll.bonus >= 0 ? `+ ${roll.bonus}` : `- ${Math.abs(roll.bonus)}`}`,
                      formula: `1d20${roll.bonus >= 0 ? `+${roll.bonus}` : `${roll.bonus}`}${roll.mode === "advantage" ? " (ADV)" : roll.mode === "disadvantage" ? " (DIS)" : ""}`,
                      isCrit: roll.isCrit,
                      isMiss: roll.isMiss,
                    },
                    damage: bDmgResult
                      ? {
                          total: bDmgResult.total,
                          damageType,
                          diceBreakdown: bDmgResult.breakdown.replace(
                            /\+/g,
                            " + ",
                          ),
                          formula: (() => {
                            const beamDiceForDisplay = roll.isCrit && ddbSpell?.damage
                              ? doubleDiceFormula(ddbSpell.damage)
                              : (ddbSpell?.damage || "");
                            return bDmgResult.explosionCount && bDmgResult.explosionCount > 0
                              ? `${beamDiceForDisplay} ${damageType} (+${bDmgResult.explosionCount} Exploded)`.trim()
                              : `${beamDiceForDisplay} ${damageType}`.trim();
                          })(),
                          isCrit: roll.isCrit,
                        }
                      : undefined,
                    extraDamage:
                      extraDamage.length > 0 ? extraDamage : undefined,
                  });
                }

                const uniqueTargets = Array.from(
                  new Set(subRolls.map((s) => s.targetName).filter(Boolean)),
                );
                const targetLabel =
                  uniqueTargets.length > 1
                    ? `${uniqueTargets.length} TARGETS`
                    : uniqueTargets[0] || targetName;

                const summaryTotal =
                  totalHexDamage > 0
                    ? `${totalCombinedDamage} + ${totalHexDamage}`
                    : totalCombinedDamage;

                const groupedCard: DDBRollCardData = {
                  id: `${Date.now()}-multi-${spellName.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
                  casterName,
                  targetName: targetLabel,
                  actionName: spellName.toUpperCase(),
                  actionType: "SPELL",
                  dieType: dieFaces,
                  diceBreakdown: subRolls
                    .map((s) => `${s.toHit?.total ?? 0}`)
                    .join(", "),
                  formula: `${beamInfo.totalBeams} ${beamInfo.beamUnit}s (${ddbSpell?.damage || ""} ${damageType} each)`,
                  total: summaryTotal,
                  subtitle: anyCrit
                    ? `Critical Hit! • ${beamInfo.totalBeams} ${beamInfo.beamUnit}s`
                    : `${beamInfo.totalBeams} ${beamInfo.beamUnit}s • ${damageType}`,
                  isCrit: anyCrit,
                  isMiss: allMiss,
                  timestamp: Date.now(),
                  subRolls,
                };

                broadcastDDBRoll([groupedCard]);
              } else if (
                ["spell_attack", "melee_spell_attack"].includes(
                  spellFormula.interaction?.type ?? "",
                ) ||
                ddbSpell?.saveOrAttack === "Spell Attack" ||
                spell?.name?.toLowerCase().includes("attack") ||
                selectedSpell.toLowerCase().includes("attack")
              ) {
                const roll = rollAttack(spellAttackBonus, "", rollMode);
                const baseDamage = spellFormula.damage.find(
                  (entry) => entry.isBase,
                );
                const damageDice =
                  resolveFormulaDamageDice(
                    spellFormula,
                    charLevel,
                    castSlotLevel,
                  ) ?? ddbSpell?.damage;
                const damageType =
                  selectedDamageType ||
                  baseDamage?.type ||
                  ddbSpell?.damageType ||
                  "";
                const dmg =
                  damageDice && !["weapon", "weapon+1step"].includes(damageDice)
                    ? rollSpellDamageFormula(
                        damageDice,
                        damageType,
                        roll.isCrit,
                      )
                    : null;
                const ddbCards: DDBRollCardData[] = [
                  {
                    id: `${Date.now()}-atk`,
                    casterName,
                    targetName,
                    actionName: spellName.toUpperCase(),
                    actionType: "TO HIT",
                    dieType: 20,
                    diceBreakdown: `${roll.d20} ${roll.bonus >= 0 ? `+ ${roll.bonus}` : `- ${Math.abs(roll.bonus)}`}`,
                    formula: `1d20${roll.bonus >= 0 ? `+${roll.bonus}` : `${roll.bonus}`}${roll.mode === "advantage" ? " (ADV)" : roll.mode === "disadvantage" ? " (DIS)" : ""}`,
                    total: roll.total,
                    subtitle: roll.isCrit
                      ? "Critical Hit!"
                      : roll.isMiss
                        ? "Critical Miss!"
                        : "Spell Attack Roll",
                    isCrit: roll.isCrit,
                    isMiss: roll.isMiss,
                    rollMode: roll.mode,
                    isAdvantage: roll.mode === "advantage",
                    isDisadvantage: roll.mode === "disadvantage",
                    timestamp: Date.now(),
                  },
                ];

                if (!roll.isMiss) {
                  if (dmg) {
                    const isExploded = Boolean(
                      dmg.explosionCount && dmg.explosionCount > 0,
                    );
                    const explosionCount = dmg.explosionCount ?? 0;
                    const dieFaces = Number(
                      damageDice?.match(/d(\d+)/i)?.[1] ?? 8,
                    );
                    ddbCards.push({
                      id: `${Date.now()}-dmg`,
                      casterName,
                      targetName,
                      actionName: spellName.toUpperCase(),
                      actionType: "DAMAGE",
                      dieType: dieFaces,
                      diceBreakdown: dmg.breakdown.replace(/\+/g, " + "),
                      formula: (() => {
                        const spellDiceForDisplay = roll.isCrit && damageDice
                          ? doubleDiceFormula(damageDice)
                          : (damageDice || "");
                        return isExploded
                          ? `${spellDiceForDisplay} ${damageType} (+${explosionCount} Exploded)`.trim()
                          : `${spellDiceForDisplay} ${damageType}`.trim();
                      })(),
                      total: dmg.total,
                      subtitle: isExploded
                        ? `Damage (${damageType || "Spell"}) • ${explosionCount} Bonus ${explosionCount > 1 ? "Dice" : "Die"}`
                        : `Damage (${damageType || "Spell"})`,
                      isCrit: roll.isCrit,
                      timestamp: Date.now(),
                    });
                  }

                  if (isHexActive) {
                    const hexDice = roll.isCrit ? "2d6" : "1d6";
                    const hexDmg = rollDamageDDB(
                      "1d6",
                      "Necrotic",
                      "",
                      roll.isCrit,
                    );
                    ddbCards.push({
                      id: `${Date.now()}-hex-dmg`,
                      casterName,
                      targetName,
                      actionName: hexActionName,
                      actionType: "DAMAGE",
                      dieType: 6,
                      diceBreakdown: hexDmg.breakdown.replace(/\+/g, " + "),
                      formula: `${hexDice} Necrotic`,
                      total: hexDmg.total,
                      subtitle: roll.isCrit
                        ? "Hex Critical Hit (+2d6 Necrotic)"
                        : "Hex Curse (+1d6 Necrotic)",
                      isCrit: roll.isCrit,
                      timestamp: Date.now() + 1,
                    });
                  }
                } else {
                  // Miss / Critical Miss
                  const isCantrip =
                    spellFormula.category.spellType === "cantrip" ||
                    ddbSpell?.level === 0;
                  if (isCantrip && hasPotentCantrip(ddbChar) && dmg) {
                    const halfDamage = Math.max(1, Math.floor(dmg.total / 2));
                    const dieFaces = Number(
                      damageDice?.match(/d(\d+)/i)?.[1] ?? 8,
                    );
                    ddbCards.push({
                      id: `${Date.now()}-potent-dmg`,
                      casterName,
                      targetName,
                      actionName: `${spellName.toUpperCase()} (POTENT CANTRIP)`,
                      actionType: "DAMAGE",
                      dieType: dieFaces,
                      diceBreakdown: `${halfDamage} (Half)`,
                      formula: `${halfDamage} ${damageType}`,
                      total: halfDamage,
                      subtitle: "Potent Cantrip (Half Damage on Miss)",
                      timestamp: Date.now() + 1,
                    });
                  }
                }

                broadcastDDBRoll(ddbCards);
              } else if (
                spellFormula.interaction?.type === "save" ||
                (ddbSpell?.saveOrAttack &&
                  ddbSpell.saveOrAttack.includes("Save"))
              ) {
                const saveType =
                  spellFormula.interaction?.saveAbility ||
                  ddbSpell?.saveOrAttack?.split(" ")[0] ||
                  "DEX";
                const baseDamage = spellFormula.damage.find(
                  (entry) => entry.isBase,
                );
                const damageDice =
                  resolveFormulaDamageDice(
                    spellFormula,
                    charLevel,
                    castSlotLevel,
                  ) ?? ddbSpell?.damage;
                const damageType =
                  selectedDamageType ||
                  baseDamage?.type ||
                  ddbSpell?.damageType ||
                  "";
                const dmg = damageDice
                  ? rollSpellDamageFormula(damageDice, damageType, false)
                  : null;
                const ddbCards: DDBRollCardData[] = [
                  {
                    id: `${Date.now()}-save`,
                    casterName,
                    targetName,
                    actionName: spellName.toUpperCase(),
                    actionType: "SAVE",
                    dieType: 20,
                    diceBreakdown: `DC ${spellSaveDC}`,
                    formula: `${saveType} Save`,
                    total: `DC ${spellSaveDC}`,
                    subtitle: `Target makes ${saveType} Save`,
                    timestamp: Date.now(),
                  },
                ];
                if (dmg) {
                  const isExploded = Boolean(
                    dmg.explosionCount && dmg.explosionCount > 0,
                  );
                  const explosionCount = dmg.explosionCount ?? 0;
                  const dieFaces = Number(
                    damageDice?.match(/d(\d+)/i)?.[1] ?? 8,
                  );
                  ddbCards.push({
                    id: `${Date.now()}-dmg`,
                    casterName,
                    targetName,
                    actionName: spellName.toUpperCase(),
                    actionType: "DAMAGE",
                    dieType: dieFaces,
                    diceBreakdown: dmg.breakdown.replace(/\+/g, " + "),
                    formula: isExploded
                      ? `${damageDice || ""} ${damageType} (+${explosionCount} Exploded)`.trim()
                      : `${damageDice || ""} ${damageType}`.trim(),
                    total: dmg.total,
                    subtitle: isExploded
                      ? `Damage (${damageType || "Spell"}) • ${explosionCount} Bonus ${explosionCount > 1 ? "Dice" : "Die"}`
                      : `Damage (${damageType || "Spell"})`,
                    timestamp: Date.now(),
                  });
                }
                broadcastDDBRoll(ddbCards);
              } else {
                const triggerInfo = resolveSpellConditionalTrigger(
                  spellName,
                  spellFormula.effectNotes?.join(" ") ||
                    ddbSpell?.description ||
                    "",
                  charLevel,
                  spellFormula,
                );
                if (triggerInfo && triggerInfo.hasTrigger && event.target?.id) {
                  const triggerId = `trig_${Date.now()}_${event.target.id}`;
                  await addConditionalTrigger({
                    id: triggerId,
                    spellId: spellFormula.id,
                    spellName,
                    casterId: activeCaster?.id,
                    casterName,
                    targetId: event.target.id,
                    targetName,
                    conditionType: triggerInfo.conditionType,
                    damageFormula: triggerInfo.damageDice,
                    damageType: triggerInfo.damageType,
                    conditionDescription: triggerInfo.conditionDesc,
                    appliedAt: Date.now(),
                    initialPosition: event.target.position,
                  });
                  broadcastDDBRoll([
                    {
                      id: `${Date.now()}-spell`,
                      casterName,
                      targetName,
                      actionName: spellName.toUpperCase(),
                      actionType: "SPELL",
                      dieType: 20,
                      diceBreakdown: "-",
                      formula: `${triggerInfo.damageDice} ${triggerInfo.damageType} (Conditional)`,
                      total: "Applied",
                      subtitle: `Condition: triggers if ${triggerInfo.conditionDesc.toLowerCase()}`,
                      pendingTriggerId: triggerId,
                      pendingTriggerName: spellName,
                      timestamp: Date.now(),
                    },
                  ]);
                  OBR.notification.show(
                    `${casterName} -> ${targetName} (${spellName}): Condition applied (will trigger if ${triggerInfo.conditionDesc.toLowerCase()})`,
                    "INFO",
                  );
                } else {
                  const baseDamage = spellFormula.damage.find(
                    (entry) => entry.isBase,
                  );
                  const damageDice =
                    resolveFormulaDamageDice(
                      spellFormula,
                      charLevel,
                      castSlotLevel,
                    ) ?? ddbSpell?.damage;
                  const damageType =
                    selectedDamageType ||
                    baseDamage?.type ||
                    ddbSpell?.damageType ||
                    "";
                  const dmg = damageDice
                    ? rollSpellDamageFormula(damageDice, damageType, false)
                    : null;
                  if (dmg) {
                    const isExploded = Boolean(
                      dmg.explosionCount && dmg.explosionCount > 0,
                    );
                    const explosionCount = dmg.explosionCount ?? 0;
                    const dieFaces = Number(
                      damageDice?.match(/d(\d+)/i)?.[1] ?? 8,
                    );
                    broadcastDDBRoll([
                      {
                        id: `${Date.now()}-spell`,
                        casterName,
                        targetName,
                        actionName: spellName.toUpperCase(),
                        actionType: "DAMAGE",
                        dieType: dieFaces,
                        diceBreakdown: dmg.breakdown.replace(/\+/g, " + "),
                        formula: isExploded
                          ? `${damageDice || ""} ${damageType} (+${explosionCount} Exploded)`.trim()
                          : `${damageDice || ""} ${damageType}`.trim(),
                        total: dmg.total,
                        subtitle: isExploded
                          ? `${spellName} • ${explosionCount} Bonus ${explosionCount > 1 ? "Dice" : "Die"}`
                          : `${spellName} Effect`,
                        timestamp: Date.now(),
                      },
                    ]);
                  }
                }
                if (isTeleportSpell(selectedSpell)) {
                  await stopAiming();
                }
              }
            }
            await stopAiming();
          } else {
            const targetName = event.target?.name || "Target";
            OBR.notification.show(
              `${beamInfo.beamUnit} ${currentAllocatedBeams}/${beamInfo.totalBeams} allocated to ${targetName}. Click next target or same target to cast.`,
              "INFO",
            );
          }
          return;
        }

        // Default manual targeting (when smart action is off or no spell selected)
        getSortedTargets().then((targets) => {
          const selected: Image | undefined = targets.filter(
            (image) => image.attachedTo === event.target!.id,
          )[0];

          if (!selected) {
            const targetHighlight = buildTarget(
              ((targets.length > 0
                ? getTargetID(targets[targets.length - 1])
                : undefined) ?? 0) + 1,
              getItemSize(event.target!) * 1.31,
              event.target!.position,
              targets.length == 0,
              event.target!.id,
            );
            OBR.scene.local.addItems([targetHighlight]);
          } else {
            incrementTargetCount(selected);
          }
        });
      }
      // User is clicking on a free target
      else if (
        !event.shiftKey &&
        event.target &&
        getTargetHighlightMetadata(event.target) != undefined
      ) {
        incrementTargetCount(event.target! as Image);
      }
      // No target is being selected, just a position
      else {
        const [targets, defaultPosition, metadata, grid] = await Promise.all([
          getSortedTargets(),
          getPointerPosition(event.pointerPosition, !event.shiftKey),
          OBR.player.getMetadata(),
          getSceneGridInfo(),
        ]);

        const selectedSpell = metadata?.[toolMetadataSelectedSpell] as
          | string
          | undefined;
        const spell = selectedSpell
          ? getSpell(selectedSpell, playerRole === "GM")
          : undefined;
        const aoe = getSpellAoE(spell, selectedSpell);
        const position =
          !event.shiftKey && aoe
            ? snapAoECenter(event.pointerPosition, aoe.shape, aoe.size, grid)
            : defaultPosition;

        const targetHighlight = buildTarget(
          ((targets.length > 0
            ? getTargetID(targets[targets.length - 1])
            : undefined) ?? 0) + 1,
          2 / 3,
          position,
          targets.length === 0,
        );
        await OBR.scene.local.addItems([targetHighlight]);

        const canCast =
          playerRole === "GM" ||
          (await getGlobalSettingsValue(
            GLOBAL_STORAGE_KEYS.PLAYERS_CAN_CAST_SPELLS,
          ));
        const smartActionEnabled =
          getSettingsValue(LOCAL_STORAGE_KEYS.SMART_ACTION_ON_TARGET) !== false;

        const isAoESpell = aoe != undefined;
        const isPointTargeted =
          spell?.minTargets === 1 && spell?.maxTargets === 1;

        if (
          selectedSpell &&
          smartActionEnabled &&
          canCast &&
          (isTeleportSpell(selectedSpell) || isAoESpell || isPointTargeted)
        ) {
          clearAimingOverlay();
          clearAoePreview();
          await doSpell(selectedSpell, playerID, playerRole === "GM");

          if (!getSettingsValue(LOCAL_STORAGE_KEYS.KEEP_SELECTED_TARGETS)) {
            await clearAllTargets();
          } else {
            clearAimingOverlay();
            clearAoePreview();
          }

          const activeCaster = await resolveActiveCaster(playerRole, playerID);
          const charId = activeCaster?.item
            ? getLinkedDDBCharacterId(activeCaster.item)
            : null;
          const ddbChar =
            (charId ? getCachedDDBCharacter(charId) : null) ??
            (activeCaster?.item?.name
              ? findCachedDDBCharacter(activeCaster.item.name)
              : null);
          const casterName =
            ddbChar?.name || activeCaster?.item?.name || "Caster";
          const spellName = spell?.name || selectedSpell;

          const ddbSpell = ddbChar?.spells?.find(
            (s) =>
              s.name.toLowerCase() === selectedSpell.toLowerCase() ||
              s.id === selectedSpell,
          );
          const slotChoice = metadata?.[selectedSpellSlotLevelMetadataKey] as
            | { spellId?: unknown; slotLevel?: unknown }
            | undefined;
          const castSlotLevel =
            slotChoice?.spellId === selectedSpell &&
            typeof slotChoice.slotLevel === "number"
              ? slotChoice.slotLevel
              : (ddbSpell?.level ?? 2);

          if (charId) {
            if (castSlotLevel >= 1) {
              await deductSpellSlotIfLeveled(charId, castSlotLevel, ddbChar);
            }

            // Concentration tracking for ground/AoE spells (e.g. Darkness)
            if (ddbSpell?.concentration) {
              const combatState = await loadCombatState(charId);
              if (
                combatState?.concentrationSpellName &&
                combatState.concentrationSpellId !== ddbSpell.id
              ) {
                OBR.notification.show(
                  `Concentration broken on "${combatState.concentrationSpellName}"! Now concentrating on "${spellName}".`,
                  "WARNING",
                );
              }
              await saveCombatState(charId, {
                concentrationSpellId: ddbSpell.id,
                concentrationSpellName: spellName,
              });
            }
          }

          const spellCard: DDBRollCardData = {
            id: `${Date.now()}-cast-${selectedSpell}`,
            casterName: casterName || "Character",
            targetName: "GROUND / AOE",
            actionName: spellName.toUpperCase(),
            actionType: "SPELL",
            dieType: 20,
            diceBreakdown:
              castSlotLevel > 0 ? `Level ${castSlotLevel}` : "Cantrip",
            formula: ddbSpell?.school
              ? `${ddbSpell.school} • ${castSlotLevel > 0 ? `Level ${castSlotLevel}` : "Cantrip"}`
              : castSlotLevel > 0
                ? `Level ${castSlotLevel}`
                : "Cantrip",
            total: "CAST",
            subtitle: ddbSpell?.concentration
              ? "Concentration Active"
              : "Spell Cast",
            timestamp: Date.now(),
          };
          broadcastDDBRoll([spellCard]);

          await stopAiming();
        }
      }
    },
    onKeyDown(_context, event) {
      if (event.code === "Escape") {
        stopAiming();
      } else if (event.code === "KeyI") {
        OBR.player.getMetadata().then((metadata) => {
          const selectedSpell = metadata?.[toolMetadataSelectedSpell] as
            | string
            | undefined;
          if (selectedSpell) {
            openSpellDetailModal(selectedSpell);
          } else {
            OBR.notification.show(
              "No spell currently selected. Select a spell first (press . or B).",
              "INFO",
            );
          }
        });
      }
    },
    onDeactivate(context) {
      clearAimingOverlay();
      clearAoePreview();
      if (
        context.activeTool != toolID ||
        context.activeMode != removeTargetToolModeID
      ) {
        deactivateTool();
      }
    },
  });
  await OBR.tool.createMode({
    id: removeTargetToolModeID,
    icons: [
      {
        icon: `${window.location.origin}/remove-target.svg`,
        label: "Remove Targets",
        filter: {
          activeTools: [toolID],
        },
      },
    ],
    cursors: [
      {
        cursor: "pointer",
        filter: {
          target: [
            {
              key: "layer",
              value: "CHARACTER",
              coordinator: "||",
            },
            {
              key: "layer",
              value: "DRAWING",
            },
          ],
        },
      },
    ],
    shortcut: "R",
    onToolClick(_context, event) {
      // User clicked on an object with an attached target
      if (isValidCombatTargetToken(event.target)) {
        getSortedTargets().then((targets) => {
          const selected: Image | undefined = targets.filter(
            (image) => image.attachedTo === event.target!.id,
          )[0];
          if (selected != undefined) {
            removeTarget(selected, targets);
          }
        });
      }
      // User clicked on a free target
      else if (
        event.target &&
        getTargetHighlightMetadata(event.target) != undefined
      ) {
        getSortedTargets().then((targets) => {
          removeTarget(event.target! as Image, targets);
        });
      }
    },
    onDeactivate(context) {
      if (
        context.activeTool != toolID ||
        context.activeMode != effectsToolModeID
      ) {
        deactivateTool();
      }
    },
  });
}

export async function setupDefaultCasterMenuOption() {
  await OBR.contextMenu.remove(defaultCasterMenuId);
  await OBR.contextMenu.create({
    id: defaultCasterMenuId,
    icons: [
      {
        icon: "/embers.svg",
        label: "Set default caster",
      },
    ],
    onClick: async () => {
      const selection = await OBR.player.getSelection();
      if (selection == undefined) return;

      const items = await OBR.scene.items.getItems(selection);
      setSettingsValue(LOCAL_STORAGE_KEYS.DEFAULT_CASTER, items);
      OBR.broadcast.sendMessage(SETTINGS_CHANNEL, {}, { destination: "LOCAL" });
    },
  });
}

export const elevationMenuId = `${APP_KEY}/elevation-menu`;

export async function setupElevationMenuOption() {
  await OBR.contextMenu.remove(elevationMenuId);
  await OBR.contextMenu.create({
    id: elevationMenuId,
    icons: [
      {
        icon: "/embers.svg",
        label: "Toggle Flight (Embers)",
        filter: {
          some: [
            { key: "layer", operator: "==", value: "CHARACTER" },
            { key: "layer", operator: "==", value: "ATTACHMENT" },
          ],
        },
      },
    ],
    onClick: async (context) => {
      const targetItems = context.items?.filter(it =>
        (it as any).attachedTo === undefined &&
        it.metadata?.[DARKNESS_ZONE_METADATA_KEY] === undefined &&
        it.metadata?.[EFFECT_METADATA_KEY] === undefined &&
        it.metadata?.[SPELL_METADATA_KEY] === undefined
      );
      if (!targetItems || targetItems.length === 0) return;

      const firstItem = targetItems[0];
      const currentEle = readTokenElevation(firstItem);
      // Toggle between 0 ft (ground) and 30 ft (flying)
      const nextEle = currentEle > 15 ? 0 : 30;

      await OBR.scene.items.updateItems(targetItems.map(it => it.id), (items) => {
        for (const it of items) {
          it.metadata = {
            ...it.metadata,
            [ELEVATION_METADATA_KEY]: nextEle,
          };
          it.layer = nextEle > 15 ? "ATTACHMENT" : "CHARACTER";
          it.zIndex = nextEle > 15 ? 10 : 0;
        }
      });

      OBR.notification.show(
        nextEle > 15
          ? `Flight enabled: Elevation set to ${nextEle} ft (Flying above darkness)`
          : `Grounded: Elevation reset to 0 ft`,
        "INFO",
      );
    },
  });
}

