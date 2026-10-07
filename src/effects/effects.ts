import { APP_KEY, ASSET_LOCATION } from "../config";
import { Effect, Effects } from "../types/effects";
import {
  GLOBAL_STORAGE_KEYS,
  getGlobalSettingsValue,
} from "../components/Settings/settings";
import OBR, {
  Image,
  Layer,
  Metadata,
  Vector2,
  buildImage,
} from "@owlbear-rodeo/sdk";
import { getSortedTargets, getTargetCount } from "../effectsTool";

import { MESSAGE_CHANNEL } from "./messageListener";
import effectsJSON from "../assets/effect_record.json";
import { getItemSize, waitMs } from "../utils";
import { log_error } from "../logging";
import { DARKNESS_ZONE_METADATA_KEY } from "../features/targeting/application/lineOfSightService";

export const effects = effectsJSON as unknown as Effects;
export const effectNames = gatherEffectNames();
export const effectMetadataKey = `${APP_KEY}/effect-id`;
export const spellMetadataKey = `${APP_KEY}/spell-id`;

function isEffect(obj: unknown): obj is Effect {
  const effectObject = obj as Effect;
  return (
    effectObject.basename != undefined &&
    effectObject.type != undefined &&
    effectObject.variants != undefined
  );
}

function getKeysFromEffectName(name: string) {
  return name.split(".");
}

function gatherEffectNames() {
  const names: string[] = [];
  function gatherNames(effects: Effects | Effect, prefix: string) {
    if (isEffect(effects)) {
      names.push(prefix);
      return;
    }
    for (const key of Object.keys(effects)) {
      if (isEffect(effects[key])) {
        names.push(`${prefix}${key}`);
      } else if (effects[key] != undefined) {
        gatherNames(effects[key], `${prefix}${key}.`);
      }
    }
  }
  gatherNames(effects, "");
  return names;
}

export function getEffect(name: string): Effect | undefined {
  const keys = getKeysFromEffectName(name);
  let effect: Effects | Effect = effects;
  for (const key of keys) {
    if ((effect as Effects)[key] == undefined || isEffect(effect)) {
      return undefined;
    }
    effect = effect[key];
  }
  if (isEffect(effect)) {
    return effect;
  }
  return undefined;
}

export function getEffectURL(
  name: string,
  variantName: string,
  variantIndex?: number,
) {
  // This function finds the appropriate effect and variant, and returns a URL to its video file
  const effect = getEffect(name);
  if (effect == undefined) {
    return undefined;
  }
  const variant = effect.variants[variantName];
  if (variant == undefined) {
    return undefined;
  }
  const variantPath = variant.name[variantIndex ?? 0];
  if (variantPath == undefined) {
    return undefined;
  }

  return `${ASSET_LOCATION}/${effect.basename}_${variantPath}.webm`;
}

export function urlVariant(url: string, variant?: number) {
  if (variant == undefined) {
    return url;
  }
  return `${url}?${variant}`;
}

export function getVariantName(effectName: string, distance: number) {
  // Given the name of an effect and the distance to the target, this function returns
  // the key of the variant whose resolution is best suited.
  const effect = getEffect(effectName);
  if (effect == undefined) {
    return undefined;
  }
  const closest: { name: string | undefined; distance: number } = {
    name: undefined,
    distance: 0,
  };

  for (const key of Object.keys(effect.variants)) {
    const variantLength = parseInt(key);
    if (variantLength < 0 || isNaN(variantLength)) {
      continue;
    }
    const newDistance = Math.abs(distance - variantLength);
    if (closest.name == undefined || newDistance < closest.distance) {
      closest.name = key;
      closest.distance = newDistance;
    }
  }
  return closest.name;
}

export function getRotation(source: Vector2, destination: Vector2) {
  const deltaX = destination.x - source.x;
  const deltaY = destination.y - source.y;
  const angleRadians = Math.atan2(deltaY, deltaX);
  const angleDegrees = angleRadians * (180 / Math.PI);
  return angleDegrees;
}

export function getDistance(source: Vector2, destination: Vector2) {
  return Math.sqrt(
    Math.pow(source.x - destination.x, 2) +
      Math.pow(source.y - destination.y, 2),
  );
}

export async function registerEffect(
  images: Image[],
  duration: number,
  spellCaster?: string,
) {
  if (duration >= 0) {
    await OBR.scene.local.addItems(images);
    await waitMs(duration);
    await OBR.scene.local.deleteItems(images.map((image) => image.id));
  } else {
    const [summonRule, id, role] = await Promise.all([
      getGlobalSettingsValue(GLOBAL_STORAGE_KEYS.SUMMONED_ENTITIES_RULE),
      OBR.player.getId(),
      OBR.player.getRole(),
    ]);
    if (
      (summonRule === "caster" && id === spellCaster) ||
      (summonRule === "gm-only" && role === "GM")
    ) {
      await OBR.scene.items.addItems(images);
    }
  }
}

export function buildEffectImage(
  effectName: string,
  effect: Effect,
  size: number,
  offset: Vector2,
  position: Vector2,
  rotation: number,
  variant?: number,
  variantIndex?: number,
  disableHit?: boolean,
  attachedTo?: string,
  duration?: number,
  loops?: number,
  metadata?: Metadata,
  layer?: Layer,
  zIndex?: number,
  spellName?: string,
  spellCaster?: string,
  spellCasterTokenId?: string,
  spellCharacterId?: string | number,
) {
  const effectVariantName = getVariantName(effectName, size * effect.dpi);
  if (effectVariantName == undefined) {
    log_error(`Could not find adequate variant for effect "${effectName}"`);
    return undefined;
  }
  const variantDistance = parseInt(effectVariantName);
  const scale = size / (variantDistance / effect.dpi);
  const scaleVector = {
    x: scale,
    y: scale,
  };
  const effectDurationArray = duration
    ? [duration]
    : effect.variants[effectVariantName].duration;
  const effectDuration =
    (loops ?? 1) *
    (variantIndex
      ? effectDurationArray.length > variantIndex
        ? effectDurationArray[variantIndex]
        : effectDurationArray[0]
      : effectDurationArray[0]);

  const url = getEffectURL(
    effectName,
    effectVariantName,
    variantIndex
      ? variantIndex % effect.variants[effectVariantName].name.length
      : undefined,
  );
  if (url == undefined) {
    log_error(
      `Could not find URL for effect "${effectName}" (selected variant: ${effectVariantName})`,
    );
    return undefined;
  }

  const gatheredMetadata: Metadata = {
    ...metadata,
    [effectMetadataKey]: effectName,
  };
  if (spellName != undefined) {
    gatheredMetadata[spellMetadataKey] = {
      name: spellName,
      caster: spellCaster,
      casterTokenId: spellCasterTokenId,
      characterId: spellCharacterId,
    };
    if (spellName.toLowerCase() === "darkness") {
      const existingZoneMeta = (gatheredMetadata[DARKNESS_ZONE_METADATA_KEY] as Record<string, unknown>) || {};
      gatheredMetadata[DARKNESS_ZONE_METADATA_KEY] = {
        ...existingZoneMeta,
        radiusFeet: (existingZoneMeta.radiusFeet as number) ?? 15,
        sourceCasterId: spellCasterTokenId || spellCaster,
        sourcePlayerId: spellCaster,
        sourceCharacterId: spellCharacterId ? String(spellCharacterId) : undefined,
      };
    }
  }

  const isCompanion =
    effectDuration < 0 && attachedTo == undefined && disableHit != true;

  const finalUrl = urlVariant(url, variant);
  console.log(`[Embers] Spawning effect "${effectName}" with URL:`, finalUrl);

  const isDarknessSpell = spellName?.toLowerCase() === "darkness";
  const resolvedDisableHit = isDarknessSpell ? false : (disableHit != undefined ? disableHit : effectDuration >= 0);
  const resolvedLocked = isDarknessSpell ? false : (effectDuration >= 0);
  const resolvedLayer = isDarknessSpell ? (layer ?? "CHARACTER") : (layer ?? (isCompanion ? "CHARACTER" : "ATTACHMENT"));
  const resolvedZIndex = isDarknessSpell ? (zIndex ?? -1) : zIndex;

  const image = buildImage(
    {
      width: effect.variants[effectVariantName].size[0],
      height: effect.variants[effectVariantName].size[1],
      url: finalUrl,
      mime: "video/webm",
    },
    {
      dpi: effect.dpi,
      offset: {
        x: effect.variants[effectVariantName].size[1] * offset.x,
        y: effect.variants[effectVariantName].size[1] * offset.y,
      },
    },
  )
    .scale(scaleVector)
    .position(position)
    .rotation(rotation)
    .disableHit(resolvedDisableHit)
    .locked(resolvedLocked)
    .metadata(gatheredMetadata)
    .layer(resolvedLayer);
  if (attachedTo != undefined) {
    // Maybe change the item this attaches to's metadata
    // to enable a context menu?
    image.attachedTo(attachedTo);
  }
  if (resolvedZIndex != undefined) {
    image.zIndex(resolvedZIndex);
  }
  return { image, effectDuration };
}

export function prefetchAssets(assets: string[]) {
  const fetches = assets.map(async (asset) => {
    const response = await fetch(asset, { cache: "force-cache" });
    await response.blob(); // Make sure all data is received
  });
  return Promise.all(fetches);
}

export function doEffect(effectName: string, effect?: Effect) {
  if (effect == undefined) {
    effect = getEffect(effectName);
  }
  if (effect == undefined) {
    log_error(`Unknown effect "${effectName}"`);
    return;
  }
  getSortedTargets().then((targets) => {
    OBR.scene.local.deleteItems(targets.map((item) => item.id));

    if (effect.type === "TARGET" || effect.type === "WALL") {
      if (targets.length < 2) {
        OBR.notification.show(
          `Embers: The effect "${effectName}" requires at least 2 targets`,
          "ERROR",
        );
        return;
      }

      OBR.broadcast.sendMessage(
        MESSAGE_CHANNEL,
        {
          instructions: targets.slice(1).map((target) => ({
            id: effectName,
            effectProperties: {
              copies: getTargetCount(target),
              source: targets[0].position,
              destination: target.position,
            },
          })),
        },
        { destination: "ALL" },
      );
    } else if (effect.type === "CIRCLE") {
      if (targets.length < 1) {
        OBR.notification.show(
          `Embers: The effect "${effectName}" requires at least 1 target`,
          "ERROR",
        );
        return;
      }

      const targetAttachments = targets.map(async (target) =>
        target.attachedTo
          ? (await OBR.scene.items.getItems([target.attachedTo]))[0]
          : undefined,
      );

      Promise.all(targetAttachments).then((attachments) => {
        OBR.broadcast.sendMessage(
          MESSAGE_CHANNEL,
          {
            instructions: targets.map((target, i) => ({
              id: effectName,
              effectProperties: {
                position: target.position,
                size: attachments[i] ? getItemSize(attachments[i]) : 5,
              },
            })),
          },
          { destination: "ALL" },
        );
      });
    } else if (effect.type === "CONE") {
      if (targets.length != 2) {
        OBR.notification.show(
          `Embers: The effect "${effectName}" requires exactly 2 targets`,
          "ERROR",
        );
        return;
      }

      OBR.broadcast.sendMessage(
        MESSAGE_CHANNEL,
        {
          instructions: [
            {
              id: effectName,
              effectProperties: {
                source: targets[0].position,
                destination: targets[1].position,
              },
            },
          ],
        },
        { destination: "ALL" },
      );
    }
  });
}
