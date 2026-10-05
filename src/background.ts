import OBR from "@owlbear-rodeo/sdk";
import { setupDefaultCasterMenuOption, setupEffectsTool } from "./effectsTool";
import { setupDDBTokenContextMenuOption } from "./services/ddbService";
import {
  sendSpellsUpdate,
  setupGMLocalSpells,
  setupPlayerLocalSpells,
} from "./effects/localSpells";
import { constants } from "./constants";
import { setupMessageListener } from "./effects/messageListener";
import {
  DDB_ROLL_CHANNEL,
  openDDBRollLogPopover,
} from "./services/rollLogService";
import { checkAndFireMovementTriggers } from "./services/conditionalTriggerService";

function loadSpellListFromLocalStorage() {
  // Update scene metadata
  const spellListJSON = localStorage.getItem(constants.SPELL_LIST_METADATA_KEY);
  if (spellListJSON == undefined) {
    return;
  }
  const spellList = JSON.parse(spellListJSON);
  OBR.scene.setMetadata({ [constants.SPELL_LIST_METADATA_KEY]: spellList });
}

function setupLocalSpells(role: "GM" | "PLAYER") {
  if (role === "PLAYER") {
    return setupPlayerLocalSpells();
  } else if (role === "GM") {
    return setupGMLocalSpells();
  }
  return null;
}

async function isDesignatedTriggerArbitrator(): Promise<boolean> {
  try {
    const myRole = await OBR.player.getRole();
    if (myRole === "GM") return true;

    const players = await OBR.party.getPlayers();
    const hasOnlineGM = players.some((p) => p.role === "GM");
    if (hasOnlineGM) {
      return false;
    }

    const myId = await OBR.player.getId();
    const allPlayerIds = [myId, ...players.map((p) => p.id)].sort();
    return allPlayerIds[0] === myId;
  } catch {
    return true;
  }
}

function setupScene() {
  setupDefaultCasterMenuOption();
  setupDDBTokenContextMenuOption();
  loadSpellListFromLocalStorage();

  let interval: number | null = null;
  let lastRole: string, lastId: string;
  let unsubscribeTool: (() => void) | null = null;
  let unsubscribeLocalSpells: (() => void) | null = null;

  Promise.all([OBR.player.getRole(), OBR.player.getId()]).then(([role, id]) => {
    unsubscribeTool = setupEffectsTool(role, id);
    unsubscribeLocalSpells = setupLocalSpells(role);

    if (role === "GM") {
      interval = window.setInterval(() => {
        sendSpellsUpdate("all");
      }, 30000);
    }

    lastRole = role;
    lastId = id;
  });

  const unsubscribePlayer = OBR.player.onChange((player) => {
    if (player.role === lastRole && player.id === lastId) return;

    if (unsubscribeTool) {
      unsubscribeTool();
    }
    if (unsubscribeLocalSpells) {
      unsubscribeLocalSpells();
    }
    if (interval !== null) {
      clearInterval(interval);
    }

    unsubscribeTool = setupEffectsTool(player.role, player.id);
    unsubscribeLocalSpells = setupLocalSpells(player.role);
    interval = window.setInterval(() => {
      sendSpellsUpdate("all");
    }, 30000);
  });

  const lastBackgroundPositions = new Map<string, { x: number; y: number }>();
  let bgDpi = 400;
  OBR.scene.grid
    .getDpi()
    .then((d) => {
      bgDpi = d;
    })
    .catch(() => {});
  const unsubGrid = OBR.scene.grid.onChange((g) => {
    bgDpi = g.dpi;
  });

  // Seed initial positions so static items do not trigger movement on startup
  OBR.scene.items
    .getItems()
    .then((items) => {
      for (const item of items) {
        lastBackgroundPositions.set(item.id, {
          x: item.position.x,
          y: item.position.y,
        });
      }
    })
    .catch(() => {});

  const unsubItems = OBR.scene.items.onChange(async (items) => {
    const isArbitrator = await isDesignatedTriggerArbitrator();
    if (!isArbitrator) return;

    for (const item of items) {
      const prev = lastBackgroundPositions.get(item.id);
      if (prev && (prev.x !== item.position.x || prev.y !== item.position.y)) {
        await checkAndFireMovementTriggers(item.id, item.position, bgDpi).catch(
          () => {},
        );
      }
      lastBackgroundPositions.set(item.id, {
        x: item.position.x,
        y: item.position.y,
      });
    }
  });

  return () => {
    if (interval !== null) clearInterval(interval);
    unsubscribePlayer();
    unsubscribeTool?.();
    unsubGrid();
    unsubItems();
  };
}

function setup() {
  if (window.interactionRecord) {
    window.interactionRecord.clear();
  } else {
    window.interactionRecord = new Map();
  }

  setupMessageListener();

  OBR.broadcast.onMessage(DDB_ROLL_CHANNEL, async (event) => {
    const payload =
      event.data as import("./types/ddbRollLog").DDBRollLogPayload;
    const myId = await OBR.player.getId().catch(() => null);
    if (payload?.senderId && myId && payload.senderId === myId) {
      return;
    }
    openDDBRollLogPopover();
  });

  let unsubscribe: (() => void) | null = null;
  OBR.scene.isReady().then((ready) => {
    if (ready) {
      unsubscribe = setupScene();
    }
  });
  OBR.scene.onReadyChange((ready) => {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }
    if (ready) {
      unsubscribe = setupScene();
    }
  });
}

OBR.onReady(setup);
