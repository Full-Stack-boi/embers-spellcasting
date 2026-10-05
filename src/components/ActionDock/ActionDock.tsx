import React, { useEffect, useState, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import "./ActionDock.css";
import OBR, { isImage } from "@owlbear-rodeo/sdk";
import { spellIDs, doSpell } from "../../effects/spells";
import { SORCERER_CLASS_FORMULAS } from "../../assets/manual-formulas";
import { getCharacterFeatures } from "../../features/characterFeatures/domain/characterFeatureCatalog";
import { canConvertSlotToSorceryPoints, convertSlotToSorceryPoints, getAvailableSorceryPoints } from "../../features/characterFeatures/domain/sorceryPointRules";
import {
    getSpellMetadata,
    getSchoolStyle,
    getSpellInitials,
    isSpellUpcastable,
    getOrdinal,
    registerDynamicSpells,
} from "../../assets/spellInfo";
import { resolveActiveCaster, ActiveCasterInfo } from "../../features/targeting/infrastructure/obr/activeCasterResolver";
import { setSelectedSpell, toolID, toolMetadataSelectedSpell, targetHighlightMetadataKey, getSortedTargets, stopAiming, hexChosenAbilityMetadataKey, selectedSpellDamageTypeMetadataKey, selectedSpellSlotLevelMetadataKey } from "../../effectsTool";
import { APP_KEY } from "../../config";
import { openSpellDetailModal } from "../../views/SpellDetailModal";
import { spellPopoverId } from "../../views/SpellSelectionPopover";
import { useOBR } from "../../platform/obr/react/providers/BaseOBRProvider";
import {
    GemAction,
    GemBonusAction,
    IconCastLightning,
    IconGrimoire,
    IconClearTargets,
    IconSpellInfo,
    IconLongRest,
    IconDragon,
    IconDiceD20,
    IconFire,
    IconCheck,
    IconSearch,
    IconClose,
    IconCondition,
    IconHitDice,
    IconGameLog,
    IconGrid,
    IconList,
    IconDashMovement,
    getWeaponIcon,
} from "./Bg3Icons";
import { extractBuffEffects } from "../../services/descriptionParser";
import {
    getLinkedDDBCharacterId,
    getCachedDDBCharacter,
    cacheDDBCharacter,
    fetchDDBCharacter,
    ddbSpellToMetadata,
    hasPotentCantrip,
    hasWeaponGraze
} from "../../services/ddbService";
import { DDBParsedCharacter, DDBWeaponAttack, DDBFeatureAction, DDBParsedSpell } from "../../types/ddb";
import { openDDBSyncModal } from "../../views/DDBSyncModal";
import { rollAttack, rollDamageBreakdown, rollDamageDDB, rollDamageExploding, rollDamageExplodingAnyDie, rollFormula } from "../../utils/dice";
import {
    broadcastDDBRoll,
    getStoredRollHistory,
    clearStoredRollHistory,
    subscribeToDDBRolls,
    toggleDDBRollLogPopover,
    DDB_ROLL_CHANNEL
} from "../../services/rollLogService";
import { DDBRollCardData, DDBRollLogPayload, DDBSubRollEntry, DDBSubRollExtraDamage } from "../../types/ddbRollLog";
import { getSpellBeamInfo } from "../../services/spellBeamService";
import { DDBRollCard } from "../DDBRollLog/DDBRollCard";
import type { DamageType } from "../../types/spellFormula";
import {
    ActiveBuff,
    KNOWN_BUFFS,
    getTokenBuffs,
    toggleTokenBuff,
    removeTokenBuff,
    getComputedBuffModifiers,
    isActivatableBuffFeature
} from "../../services/buffService";
import { CustomDiceRoller } from "./CustomDiceRoller";
import "./CustomDiceRoller.css";
import CharacterChecks from "../CharacterChecks/CharacterChecks";
import {
    loadCombatState,
    saveCombatState,
    resetCombatState,
    COMBAT_STATE_STORAGE_PREFIX,
    EmbersCombatState
} from "../../services/combatStateService";
import { SpellFormulaDisplay } from "./SpellFormulaDisplay";
import { resolveSpellFormula } from "../../services/spellFormulaBuilder";
import { addConditionalTrigger, checkAndFireActionTriggers } from "../../services/conditionalTriggerService";
import { resolveSpellConditionalTrigger } from "../../services/spellTriggerResolver";
import { buildRegistry, setActiveRegistry } from "../../services/spellFormulaRegistry";
import { BG3FlyoutBar, BG3FlyoutFeatureData } from "./BG3FlyoutBar";
import { getFeatureFlyoutKind, computeClassFeatureResource } from "../../assets/manual-formulas";
import "./BG3FlyoutBar.css";

export { getFeatureFlyoutKind };

export const actionDockPopoverId = `${APP_KEY}/action-dock-popover`;
export const DOCK_SAVED_HEIGHT_KEY = "embers:action-dock-height";
const RESOURCE_TRAY_FLOAT_HEIGHT = 40;

let cachedDockViewWidth = typeof window !== "undefined" ? window.innerWidth || 1440 : 1440;
let cachedDockViewHeight = typeof window !== "undefined" ? window.innerHeight || 900 : 900;

if (typeof window !== "undefined") {
    OBR.onReady(() => {
        Promise.all([OBR.viewport.getWidth(), OBR.viewport.getHeight()]).then(([w, h]) => {
            if (w && w > 200) cachedDockViewWidth = w;
            if (h && h > 200) cachedDockViewHeight = h;
        }).catch(() => {});
    });
}

export function getSavedDockHeight(): number | null {
    try {
        const val = localStorage.getItem(DOCK_SAVED_HEIGHT_KEY);
        if (val) {
            const parsed = parseInt(val, 10);
            if (!isNaN(parsed) && parsed >= 200 && parsed <= 900) {
                return parsed;
            }
        }
    } catch {}
    return null;
}

export async function closeActionDock() {
    try {
        await OBR.popover.close(actionDockPopoverId);
    } catch {}
}

let lastToggleTime = 0;
let isToggling = false;

export async function openActionDock() {
    if (isToggling) return;
    isToggling = true;
    try {
        const [w, h] = await Promise.all([
            OBR.viewport.getWidth(),
            OBR.viewport.getHeight()
        ]);
        if (w && w > 200) cachedDockViewWidth = w;
        if (h && h > 200) cachedDockViewHeight = h;
    } catch {}

    const viewWidth = cachedDockViewWidth;
    const viewHeight = cachedDockViewHeight;

    const extraLeftGutter = 60;
    // Stretch horizontally (up to 1480px or viewWidth - 140px) ensuring dockLeft >= 70px
    const dockWidth = Math.min(1480, Math.max(760, viewWidth - 140));

    // Sleek, compact default height: ~28% of screen (240px-280px) instead of 45% (380px+)
    const savedH = getSavedDockHeight();
    const defaultDockHeight = Math.min(280, Math.max(220, Math.round(viewHeight * 0.28)));
    const dockHeight = savedH ?? defaultDockHeight;
    const popoverHeight = dockHeight + RESOURCE_TRAY_FLOAT_HEIGHT;

    const dockLeft = Math.max(70, Math.round((viewWidth - dockWidth) / 2));
    const popoverLeft = Math.max(0, dockLeft - extraLeftGutter);
    const popoverWidth = dockWidth + extraLeftGutter;
    // Reserve a transparent strip above the dock for the floating resource tray.
    const popoverTop = Math.max(10, Math.round(viewHeight - popoverHeight - 16));

    const dockSearch = new URLSearchParams(window.location.search || "");
    dockSearch.set("dockHeight", String(dockHeight));
    try {
        // Close any existing/stale popover instance first to prevent OBR error
        try {
            await OBR.popover.close(actionDockPopoverId);
        } catch {}

        await OBR.popover.open({
            id: actionDockPopoverId,
            url: `${window.location.origin}/action-dock?${dockSearch.toString()}`,
            width: popoverWidth,
            height: popoverHeight,
            anchorReference: "POSITION",
            anchorPosition: {
                left: popoverLeft,
                top: popoverTop,
            },
            anchorOrigin: {
                horizontal: "LEFT",
                vertical: "TOP",
            },
            transformOrigin: {
                horizontal: "LEFT",
                vertical: "TOP",
            },
            hidePaper: true,
            disableClickAway: true,
        });
    } catch (err) {
        console.error("Failed to open ActionDock popover:", err);
    } finally {
        setTimeout(() => {
            isToggling = false;
        }, 350);
    }
}

export async function toggleActionDock() {
    const now = Date.now();
    if (now - lastToggleTime < 400 || isToggling) {
        return;
    }
    lastToggleTime = now;

    try {
        const height = await OBR.popover.getHeight(actionDockPopoverId);
        if (typeof height === "number" && height > 0) {
            await closeActionDock();
            return;
        }
    } catch {}
    await openActionDock();
}


interface SpellSlotConfig {
    max: number;
    used: number;
}

type MainTab = "ACTIONS" | "SPELLS" | "INVENTORY" | "FEATURES" | "BACKGROUND" | "NOTES" | "EXTRAS";
type ActionsFilter = "ALL" | "ATTACK" | "ACTION" | "BONUS ACTION" | "REACTION" | "OTHER" | "LIMITED USE";
type SpellsFilter = "ALL" | "0" | "1" | "2" | "PACT" | "3+";
type FeaturesFilter = "ALL" | "CLASS" | "SPECIES" | "FEATS";
type InventoryFilter = "ALL" | "EQUIPPED" | "ATTUNED" | "WEAPONS" | "ARMOR" | "GEAR";

export type DetailDrawerItem =
    | {
          type: "feature";
          id: string;
          name: string;
          category?: string;
          activationType?: string;
          rangeText?: string;
          description?: string;
          rawDescription?: string;
          limitedUse?: { max: number; used: number; resetType?: string };
      }
    | {
          type: "weapon";
          weapon: DDBWeaponAttack;
      }
    | {
          type: "spell";
          spell: {
              id: string;
              name: string;
              level: number;
              school: string;
              castingTime: string;
              rangeText: string;
              hitOrDc?: string;
              damage?: string;
              damageType?: string;
              notes?: string;
              rawDdbSpell?: DDBParsedSpell;
          };
      }
    | {
          type: "item";
          item: import("../../types/ddb").DDBInventoryItem;
      }
    | {
          type: "checks";
      }
    | {
          type: "ac";
          ac: number;
          breakdown: Array<{ label: string; value: string }>;
          description: string;
      }
    | {
          type: "hp";
          current: number;
          max: number;
          temp: number;
      }
    | {
          type: "defenses";
          resistances: string[];
          immunities: string[];
          vulnerabilities: string[];
      }
    | {
          type: "log";
      }
    | null;

// Fallback weapons if no DDB character is linked
const DEFAULT_WEAPONS: DDBWeaponAttack[] = [
    {
        id: "w_dagger",
        name: "Dagger",
        type: "melee",
        rangeText: "20 (60)",
        rangeFeet: 60,
        toHit: 5,
        damage: "1d4+3",
        damageType: "Piercing",
        properties: ["Finesse", "Light", "Thrown"],
        cantripRiders: []
    },
    {
        id: "w_unarmed",
        name: "Unarmed Strike",
        type: "melee",
        rangeText: "5 ft. Reach",
        rangeFeet: 5,
        toHit: 2,
        damage: "1",
        damageType: "Bludgeoning",
        properties: [],
        cantripRiders: []
    }
];

// Helper to parse cantrip rider strings into structured data
function parseRiderString(riderStr: string) {
    const [namePart, rest] = riderStr.split(":");
    const name = namePart ? namePart.trim() : "";
    const remaining = rest ? rest.trim() : "";

    const moveMatch = remaining.match(/\((.*?)\)/);
    const moveTrigger = moveMatch ? moveMatch[1] : undefined;

    let immediatePart = remaining;
    let triggerDice: string | undefined = undefined;

    if (remaining.includes(",")) {
        const parts = remaining.split(",");
        immediatePart = parts[0]?.trim() || "";
        triggerDice = parts[1]?.replace(/\(.*?\)/, "").replace(/(?:🌧️|🔥|⚡|❄️|💀)/gu, "").trim();
    } else if (moveTrigger) {
        immediatePart = "";
        triggerDice = remaining.replace(/\(.*?\)/, "").replace(/(?:🌧️|🔥|⚡|❄️|💀)/gu, "").trim();
    }

    const dicePart = immediatePart.replace(/\(.*?\)/, "").replace(/(?:🌧️|🔥|⚡|❄️|💀)/gu, "").trim();

    let damageType = "Thunder";
    let icon = "⚡";
    if (name.includes("Burning") || remaining.includes("🔥")) { damageType = "Fire"; icon = "🔥"; }
    else if (name.includes("Arc") || remaining.includes("⚡")) { damageType = "Lightning"; icon = "⚡"; }
    else if (name.includes("Frigid") || remaining.includes("❄️")) { damageType = "Cold"; icon = "❄️"; }
    else if (name.includes("Vengeful") || remaining.includes("💀")) { damageType = "Necrotic"; icon = "💀"; }
    else if (name.includes("Booming") || remaining.includes("🌧️")) { damageType = "Thunder"; icon = "🌧️"; }

    return {
        name,
        damage: dicePart || "1d8",
        damageType,
        icon,
        moveTrigger,
        triggerDice,
        raw: riderStr
    };
}

const COMBAT_ACTIONS: Array<{ name: string; description: string }> = [
    { name: "Attack", description: "Make one or more melee or ranged attacks with your equipped weapons or unarmed strike." },
    { name: "Dash", description: "Gain extra movement for the current turn equal to your speed." },
    { name: "Disengage", description: "Your movement doesn't provoke opportunity attacks for the rest of the turn." },
    { name: "Dodge", description: "Attackers have disadvantage against you, and you have advantage on DEX saving throws until your next turn." },
    { name: "Help", description: "Lend aid to an ally, granting advantage on their next ability check or attack roll." },
    { name: "Hide", description: "Make a Dexterity (Stealth) check to become unseen and unheard." },
    { name: "Ready", description: "Prepare an action with a trigger to use as a reaction before your next turn." },
    { name: "Search", description: "Devote attention to find something using a Perception or Investigation check." },
    { name: "Grapple", description: "Special melee attack to seize a creature within reach." },
    { name: "Shove", description: "Special melee attack to push a creature 5 ft. away or knock it prone." },
    { name: "Utilize", description: "Use an object or activate complex machinery that requires an action." }
];

type ActionGridTileProps = {
    name: string;
    category: string;
    subtitle: string;
    description?: string;
    details?: string[];
    icon: React.ReactNode;
    accent: string;
    shortcut: number;
    selected?: boolean;
    onActivate: () => void;
    onContextMenu?: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

type ActionGridTooltipData = Pick<ActionGridTileProps, "name" | "category" | "subtitle" | "description" | "details" | "icon" | "accent">;
type ActionGridTooltipState = ActionGridTooltipData & { id: string; left: number; top: number };
type ActionGridTooltipContextValue = {
    activeId: string | null;
    showTooltip: (id: string, event: React.MouseEvent<HTMLButtonElement> | React.FocusEvent<HTMLButtonElement>, data: ActionGridTooltipData) => void;
    scheduleTooltipClose: () => void;
    keepTooltipOpen: () => void;
    hideTooltip: () => void;
};

const ActionGridTooltipContext = React.createContext<ActionGridTooltipContextValue | null>(null);

const ActionGridTooltipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [tooltip, setTooltip] = useState<ActionGridTooltipState | null>(null);
    const hideTimer = useRef<number | undefined>(undefined);

    const keepTooltipOpen = () => {
        if (hideTimer.current !== undefined) {
            window.clearTimeout(hideTimer.current);
            hideTimer.current = undefined;
        }
    };

    const showTooltip: ActionGridTooltipContextValue["showTooltip"] = (id, event, data) => {
        keepTooltipOpen();
        const rect = event.currentTarget.getBoundingClientRect();
        const width = Math.min(270, window.innerWidth - 16);
        const estimatedHeight = Math.min(185, window.innerHeight - 16);
        const centeredLeft = Math.max(8, Math.min(rect.left + rect.width / 2 - width / 2, window.innerWidth - width - 8));
        const aboveTop = rect.top - estimatedHeight - 10;
        if (aboveTop >= 8) {
            setTooltip({ ...data, id, left: centeredLeft, top: aboveTop });
            return;
        }

        const gap = 9;
        const rightSpace = window.innerWidth - rect.right - gap;
        const leftSpace = rect.left - gap;
        const placeRight = rightSpace >= width || rightSpace >= leftSpace;
        const left = placeRight
            ? Math.max(8, Math.min(rect.right + gap, window.innerWidth - width - 8))
            : Math.max(8, rect.left - width - gap);
        const top = Math.max(8, Math.min(rect.top + rect.height / 2 - estimatedHeight / 2, window.innerHeight - estimatedHeight - 8));
        setTooltip({ ...data, id, left, top });
    };

    const hideTooltip = () => {
        keepTooltipOpen();
        setTooltip(null);
    };

    const scheduleTooltipClose = () => {
        keepTooltipOpen();
        hideTimer.current = window.setTimeout(() => {
            setTooltip(null);
            hideTimer.current = undefined;
        }, 240);
    };

    useEffect(() => () => keepTooltipOpen(), []);

    const contextValue: ActionGridTooltipContextValue = {
        activeId: tooltip?.id ?? null,
        showTooltip,
        scheduleTooltipClose,
        keepTooltipOpen,
        hideTooltip,
    };

    return (
        <ActionGridTooltipContext.Provider value={contextValue}>
            {children}
            {tooltip && createPortal(
                <div
                    id={tooltip.id}
                    className="ddb-bg3-grid-tooltip"
                    role="tooltip"
                    style={{ left: tooltip.left, top: tooltip.top }}
                    onMouseEnter={keepTooltipOpen}
                    onMouseLeave={hideTooltip}
                >
                    <div className="ddb-bg3-grid-tooltip-header">
                        <div>
                            <div className="ddb-bg3-grid-tooltip-title">{tooltip.name}</div>
                            <div className="ddb-bg3-grid-tooltip-subtitle">{tooltip.category} · {tooltip.subtitle}</div>
                        </div>
                        <span className="ddb-bg3-grid-tooltip-icon" style={{ color: tooltip.accent, borderColor: tooltip.accent }}>{tooltip.icon}</span>
                    </div>
                    {tooltip.details && tooltip.details.length > 0 && <div className="ddb-bg3-grid-tooltip-details">{tooltip.details.join(" · ")}</div>}
                    {tooltip.description && <div className="ddb-bg3-grid-tooltip-description">{tooltip.description}</div>}
                </div>,
                document.body
            )}
        </ActionGridTooltipContext.Provider>
    );
};

const ActionGridTile: React.FC<ActionGridTileProps> = ({
    name,
    category,
    subtitle,
    description,
    details = [],
    icon,
    accent,
    shortcut,
    selected = false,
    onActivate,
    onContextMenu,
}) => {
    const tooltip = React.useContext(ActionGridTooltipContext);
    const tooltipId = React.useId();

    return (
        <button
                type="button"
                className={`ddb-bg3-icon-tile ${selected ? "selected" : ""}`}
                style={{ "--tile-accent": accent } as React.CSSProperties}
                aria-label={`${name}, ${category}`}
                aria-describedby={tooltip?.activeId === tooltipId ? tooltipId : undefined}
                aria-pressed={selected}
                onMouseEnter={event => tooltip?.showTooltip(tooltipId, event, { name, category, subtitle, description, details, icon, accent })}
                onMouseLeave={() => tooltip?.scheduleTooltipClose()}
                onFocus={event => tooltip?.showTooltip(tooltipId, event, { name, category, subtitle, description, details, icon, accent })}
                onBlur={() => tooltip?.scheduleTooltipClose()}
                onClick={onActivate}
                onContextMenu={onContextMenu}
            >
                <span className="ddb-bg3-icon-tile-shortcut" aria-hidden="true">{shortcut}</span>
                <span className="ddb-bg3-icon-tile-art" aria-hidden="true">{icon}</span>
                {selected && <span className="ddb-bg3-icon-tile-selected" aria-hidden="true">✓</span>}
            </button>
    );
};

export const ActionDock: React.FC = () => {
    const obr = useOBR();
    const [caster, setCaster] = useState<ActiveCasterInfo | null>(null);
    const [selectedSpell, setSelected] = useState<string | null>(null);
    const [syncedDdbChar, setSyncedDdbChar] = useState<DDBParsedCharacter | null>(null);

    // Primary & sub tabs
    const [mainTab, setMainTab] = useState<MainTab>("ACTIONS");
    const [isResourceTrayOpen, setIsResourceTrayOpen] = useState(false);
    const [actionsFilter, setActionsFilter] = useState<ActionsFilter>("ALL");
    const [spellsFilter, setSpellsFilter] = useState<SpellsFilter>("ALL");
    const [featuresFilter, setFeaturesFilter] = useState<FeaturesFilter>("ALL");
    const [inventoryFilter, setInventoryFilter] = useState<InventoryFilter>("ALL");
    const [spellSearch, setSpellSearch] = useState<string>("");
    const [actionSearch, setActionSearch] = useState<string>("");
    const [inventorySearch, setInventorySearch] = useState<string>("");

    // Active cantrip rider selection for weapons { weaponId: riderName }
    const [activeRiderMap, setActiveRiderMap] = useState<Record<string, string | null>>({});

    // Feature action tracking for limited uses { featureId: usedCount }
    const [featureUses, setFeatureUses] = useState<Record<string, number>>({});
    const [expandedFeatures, setExpandedFeatures] = useState<Record<string, boolean>>({});

const DND_CONDITIONS = [
    "Blinded",
    "Charmed",
    "Deafened",
    "Frightened",
    "Grappled",
    "Incapacitated",
    "Invisible",
    "Paralyzed",
    "Petrified",
    "Poisoned",
    "Prone",
    "Restrained",
    "Stunned",
    "Unconscious"
] as const;

    // Detail Drawer & Character sheet interactive state
    const [drawerItem, setDrawerItem] = useState<DetailDrawerItem>(null);
    const [heroicInspiration, setHeroicInspiration] = useState<boolean>(false);
    const [customHp, setCustomHp] = useState<{ current: number; max: number; temp: number } | null>(null);
    const [isDiceRollerOpen, setIsDiceRollerOpen] = useState<boolean>(false);
    const [activeBuffs, setActiveBuffs] = useState<ActiveBuff[]>([]);
    const buffMods = useMemo(() => getComputedBuffModifiers(activeBuffs), [activeBuffs]);

    // Combat Trackers
    const [concentrationSpell, setConcentrationSpell] = useState<{ id: string; name: string } | null>(null);
    const [deathSaves, setDeathSaves] = useState<{ successes: number; failures: number }>({ successes: 0, failures: 0 });
    const [hitDiceUsed, setHitDiceUsed] = useState<Record<string, number>>({});
    const [exhaustionLevel, setExhaustionLevel] = useState<number>(0);
    const [conditions, setConditions] = useState<string[]>([]);
    const [isConditionsMenuOpen, setIsConditionsMenuOpen] = useState<boolean>(false);

    // UI: Resize & Spell Slot Picker
    const [panelHeight, setPanelHeight] = useState<number | null>(() => {
        const savedHeight = getSavedDockHeight();
        if (savedHeight) return savedHeight;
        const requestedHeight = Number(new URLSearchParams(window.location.search).get("dockHeight"));
        return Number.isFinite(requestedHeight) && requestedHeight >= 200 && requestedHeight <= 900
            ? requestedHeight
            : null;
    });
    const [isDraggingHeight, setIsDraggingHeight] = useState<boolean>(false);
    const dragRef = useRef<{ startY: number; startH: number } | null>(null);

    const [upcastPickerSpellId, setUpcastPickerSpellId] = useState<string | null>(null);
    const [upcastPickerLevel, setUpcastPickerLevel] = useState<number>(1);
    const [selectedHexAbility, setSelectedHexAbility] = useState<string>("dexterity");
    const [spellDamageTypeOverrides, setSpellDamageTypeOverrides] = useState<Record<string, DamageType | string>>({});
    const [activeFlyoutFeatureId, setActiveFlyoutFeatureId] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<"grid" | "table">(() => {
        try {
            const saved = localStorage.getItem("embers:action-dock-view");
            if (saved === "table" || saved === "grid") return saved;
        } catch {}
        return "grid";
    });

    // D&D Beyond Game Log State
    const [rollHistory, setRollHistory] = useState<DDBRollCardData[]>(() => getStoredRollHistory().slice(0, 30));
    const [unreadRolls, setUnreadRolls] = useState<number>(0);

    useEffect(() => {
        if (!obr.ready) return;

        const handleNewCards = (newCards: DDBRollCardData[]) => {
            if (!newCards || newCards.length === 0) return;
            setRollHistory(prev => [...newCards, ...prev].slice(0, 40));
            setUnreadRolls(prev => prev + newCards.length);
        };

        const unsubscribeLocal = subscribeToDDBRolls(handleNewCards);
        let unsubscribeBroadcast: (() => void) | null = null;
        try {
            unsubscribeBroadcast = OBR.broadcast.onMessage(DDB_ROLL_CHANNEL, (event) => {
                const payload = event.data as DDBRollLogPayload;
                if (payload && Array.isArray(payload.cards) && payload.cards.length > 0) {
                    handleNewCards(payload.cards);
                }
            });
        } catch (err) {
            console.warn("Failed to listen to roll broadcast in ActionDock:", err);
        }

        const handleWindowEvent = (e: Event) => {
            const custom = e as CustomEvent<DDBRollCardData[]>;
            if (custom.detail && Array.isArray(custom.detail)) {
                handleNewCards(custom.detail);
            }
        };
        window.addEventListener("embers:ddb-roll", handleWindowEvent);

        return () => {
            unsubscribeLocal();
            unsubscribeBroadcast?.();
            window.removeEventListener("embers:ddb-roll", handleWindowEvent);
        };
    }, [obr.ready]);

    // BG3 / DDB Action & Spell Slot tracking
    const [actionUsed, setActionUsed] = useState(false);
    const [bonusActionUsed, setBonusActionUsed] = useState(false);
    const [spellSlots, setSpellSlots] = useState<Record<number, SpellSlotConfig>>({});
    const [createdSpellSlots, setCreatedSpellSlots] = useState<Record<number, number>>({});
    const [pactSlots, setPactSlots] = useState<SpellSlotConfig>({ max: 0, used: 0 });

    const applyDdbSlots = (char: DDBParsedCharacter) => {
        if (char.spellSlots) {
            const newSlots: Record<number, SpellSlotConfig> = {};
            for (let lvl = 1; lvl <= 9; lvl++) {
                const s = char.spellSlots[lvl];
                newSlots[lvl] = {
                    max: s ? s.max : 0,
                    used: s ? s.used : 0
                };
            }
            setSpellSlots(newSlots);
        }
        if (char.pactMagic) {
            setPactSlots({
                max: char.pactMagic.max,
                used: char.pactMagic.used
            });
        }
        if (char.heroicInspiration !== undefined) {
            setHeroicInspiration(Boolean(char.heroicInspiration));
        }
    };

    const toggleSlotPip = (level: number) => {
        setSpellSlots(prev => {
            const current = prev[level];
            if (!current) return prev;
            const nextUsed = current.used >= current.max ? 0 : current.used + 1;
            return {
                ...prev,
                [level]: { ...current, used: nextUsed }
            };
        });
    };

    const handleConvertSlotToSorceryPoints = (slotLevel: number, usePactSlot = false, targetFeatId?: string) => {
        let featId = targetFeatId;
        let featMax: number | undefined;
        let featUsed: number | undefined;

        if (targetFeatId && syncedDdbChar) {
            const f = getCharacterFeatures(syncedDdbChar).find(it => it.id === targetFeatId);
            if (f) {
                featId = f.id;
                featMax = f.limitedUse?.max;
                featUsed = f.limitedUse?.used;
            }
        }
        if (!featId && drawerItem?.type === "feature" && drawerItem.name.toLowerCase().includes("font of magic")) {
            featId = drawerItem.id;
            featMax = drawerItem.limitedUse?.max;
            featUsed = drawerItem.limitedUse?.used;
        }
        if (!featId && syncedDdbChar) {
            const f = getCharacterFeatures(syncedDdbChar).find(it => it.name.toLowerCase().includes("font of magic"));
            if (f) {
                featId = f.id;
                featMax = f.limitedUse?.max;
                featUsed = f.limitedUse?.used;
            }
        }
        if (!featId) return;

        const sorcererLevel = syncedDdbChar?.classes
            .filter(characterClass => characterClass.name.toLowerCase().includes("sorcerer"))
            .reduce((total, characterClass) => total + characterClass.level, 0) ?? 0;
        const usedPoints = featureUses[featId] ?? featUsed ?? 0;
        const maxPoints = featMax || sorcererLevel;
        if (!canConvertSlotToSorceryPoints(maxPoints, usedPoints, slotLevel)) return;
        const slot = spellSlots[slotLevel];
        const hasSlot = usePactSlot
            ? pactSlots.max > pactSlots.used && pactSlots.max > 0 && syncedDdbChar?.pactMagic?.level === slotLevel
            : Boolean(slot && slot.max > slot.used);
        if (!hasSlot) return;

        if (usePactSlot) {
            setPactSlots(prev => ({ ...prev, used: prev.used + 1 }));
        } else {
            setSpellSlots(prev => ({
                ...prev,
                [slotLevel]: { ...prev[slotLevel], used: prev[slotLevel].used + 1 }
            }));
        }
        const conversion = SORCERER_CLASS_FORMULAS.fontOfMagic.operations.find(operation => operation.type === "convert_spell_slot_to_resource");
        if (!conversion || conversion.type !== "convert_spell_slot_to_resource") return;
        setFeatureUses(prev => ({ ...prev, [featId!]: convertSlotToSorceryPoints(usedPoints, slotLevel * conversion.resourcePerSlotLevel, maxPoints) }));
        // Converting a spell slot to Sorcery Points requires No Action (D&D 2024 PHB p.140 / 5e: no action required)
        OBR.notification.show(`Converted a level ${slotLevel} spell slot into ${slotLevel} Sorcery Point${slotLevel === 1 ? "" : "s"} (No action used).`, "SUCCESS");
    };

    const handleCreateSorcererSpellSlot = (slotLevel: number, pointCost: number, minimumClassLevel: number, targetFeatId?: string) => {
        let featId = targetFeatId;
        let featMax: number | undefined;
        let featUsed: number | undefined;

        if (targetFeatId && syncedDdbChar) {
            const f = getCharacterFeatures(syncedDdbChar).find(it => it.id === targetFeatId);
            if (f) {
                featId = f.id;
                featMax = f.limitedUse?.max;
                featUsed = f.limitedUse?.used;
            }
        }
        if (!featId && drawerItem?.type === "feature" && drawerItem.name.toLowerCase().includes("font of magic")) {
            featId = drawerItem.id;
            featMax = drawerItem.limitedUse?.max;
            featUsed = drawerItem.limitedUse?.used;
        }
        if (!featId && syncedDdbChar) {
            const f = getCharacterFeatures(syncedDdbChar).find(it => it.name.toLowerCase().includes("font of magic"));
            if (f) {
                featId = f.id;
                featMax = f.limitedUse?.max;
                featUsed = f.limitedUse?.used;
            }
        }
        if (!featId) return;

        const sorcererLevel = syncedDdbChar?.classes
            .filter(characterClass => characterClass.name.toLowerCase().includes("sorcerer"))
            .reduce((total, characterClass) => total + characterClass.level, 0) ?? 0;
        const usedPoints = featureUses[featId] ?? featUsed ?? 0;
        const maxPoints = featMax || sorcererLevel;
        if (sorcererLevel < minimumClassLevel || maxPoints - usedPoints < pointCost) return;

        setFeatureUses(prev => ({ ...prev, [featId!]: usedPoints + pointCost }));
        setSpellSlots(prev => ({
            ...prev,
            [slotLevel]: { max: (prev[slotLevel]?.max ?? 0) + 1, used: prev[slotLevel]?.used ?? 0 }
        }));
        setCreatedSpellSlots(prev => ({ ...prev, [slotLevel]: (prev[slotLevel] ?? 0) + 1 }));
        setBonusActionUsed(true);
        OBR.notification.show(`Created a level ${slotLevel} spell slot for ${pointCost} Sorcery Points. Bonus Action used.`, "SUCCESS");
    };

    const togglePactPip = () => {
        setPactSlots(prev => {
            if (prev.max <= 0) return prev;
            const nextUsed = prev.used >= prev.max ? 0 : prev.used + 1;
            return { ...prev, used: nextUsed };
        });
    };

    const toggleClassResource = (feat: DDBFeatureAction) => {
        const max = feat.limitedUse?.max ?? 0;
        if (max <= 0) return;
        const currentUsed = featureUses[feat.id] ?? (feat.limitedUse?.used ?? 0);
        const nextUsed = currentUsed >= max ? 0 : currentUsed + 1;
        setFeatureUses(prev => ({
            ...prev,
            [feat.id]: nextUsed
        }));
    };

    const handleLongRest = () => {
        setActionUsed(false);
        setBonusActionUsed(false);
        setSpellSlots(prev => {
            const reset: Record<number, SpellSlotConfig> = {};
            for (const [lvl, config] of Object.entries(prev)) {
                const level = Number(lvl);
                reset[level] = { max: Math.max(0, config.max - (createdSpellSlots[level] ?? 0)), used: 0 };
            }
            return reset;
        });
        setCreatedSpellSlots({});
        setPactSlots(prev => ({ ...prev, used: 0 }));
        setFeatureUses({});
        setConcentrationSpell(null);
        setDeathSaves({ successes: 0, failures: 0 });
        setHitDiceUsed({});
        setExhaustionLevel(prev => Math.max(0, prev - 1));
        if (syncedDdbChar?.id) {
            resetCombatState(syncedDdbChar.id).catch(console.error);
        }
        OBR.notification.show("Long Rest completed: Actions, slots, hit dice, and 1 exhaustion level restored!", "INFO");
    };

    // Load persisted combat state whenever a character is linked/synced
    useEffect(() => {
        if (!syncedDdbChar?.id) return;
        loadCombatState(syncedDdbChar.id).then(persisted => {
            if (!persisted) return;
            // Restore spell slots used count
            if (persisted.createdSpellSlots) {
                setSpellSlots(prev => {
                    const next: Record<number, SpellSlotConfig> = { ...prev };
                    for (const [lvlStr, created] of Object.entries(persisted.createdSpellSlots ?? {})) {
                        const lvl = Number(lvlStr);
                        if (next[lvl]) next[lvl] = { ...next[lvl], max: next[lvl].max + created };
                    }
                    return next;
                });
                setCreatedSpellSlots(persisted.createdSpellSlots);
            }
            if (persisted.spellSlotsUsed) {
                setSpellSlots(prev => {
                    const next: Record<number, SpellSlotConfig> = { ...prev };
                    for (const [lvlStr, used] of Object.entries(persisted.spellSlotsUsed)) {
                        const lvl = Number(lvlStr);
                        if (next[lvl]) {
                            next[lvl] = { ...next[lvl], used: Math.min(next[lvl].max, used) };
                        }
                    }
                    return next;
                });
            }
            if (typeof persisted.pactSlotsUsed === "number") {
                setPactSlots(prev => ({ ...prev, used: Math.min(prev.max, persisted.pactSlotsUsed) }));
            }
            if (persisted.featureUses) {
                setFeatureUses(persisted.featureUses);
            }
            if (typeof persisted.hpCurrent === "number" && syncedDdbChar.hp) {
                setCustomHp({
                    current: persisted.hpCurrent,
                    max: syncedDdbChar.hp.max,
                    temp: persisted.hpTemp || 0
                });
            }
            if (typeof persisted.actionUsed === "boolean") {
                setActionUsed(persisted.actionUsed);
            }
            if (typeof persisted.bonusActionUsed === "boolean") {
                setBonusActionUsed(persisted.bonusActionUsed);
            }
            if (typeof persisted.heroicInspiration === "boolean") {
                setHeroicInspiration(persisted.heroicInspiration);
            }
            if (persisted.concentrationSpellId && persisted.concentrationSpellName) {
                setConcentrationSpell({
                    id: persisted.concentrationSpellId,
                    name: persisted.concentrationSpellName
                });
            }
            if (persisted.deathSaves) {
                setDeathSaves(persisted.deathSaves);
            }
            if (persisted.hitDiceUsed) {
                setHitDiceUsed(persisted.hitDiceUsed);
            }
            if (typeof persisted.exhaustionLevel === "number") {
                setExhaustionLevel(persisted.exhaustionLevel);
            }
            if (Array.isArray(persisted.conditions)) {
                setConditions(persisted.conditions);
            }
        }).catch(console.error);
    }, [syncedDdbChar?.id]);

    // Debounced auto-save of combat state whenever combat resources change
    useEffect(() => {
        if (!syncedDdbChar?.id) return;
        const timer = setTimeout(() => {
            const slotsUsed: Record<number, number> = {};
            for (const [lvl, config] of Object.entries(spellSlots)) {
                if (config.used > 0) {
                    slotsUsed[Number(lvl)] = config.used;
                }
            }
            saveCombatState(syncedDdbChar.id, {
                spellSlotsUsed: slotsUsed,
                createdSpellSlots,
                pactSlotsUsed: pactSlots.used,
                featureUses,
                hpCurrent: customHp?.current ?? null,
                hpTemp: customHp?.temp ?? 0,
                actionUsed,
                bonusActionUsed,
                heroicInspiration,
                concentrationSpellId: concentrationSpell?.id ?? null,
                concentrationSpellName: concentrationSpell?.name ?? null,
                deathSaves,
                hitDiceUsed,
                exhaustionLevel,
                conditions
            }).catch(console.error);
        }, 500);

        return () => clearTimeout(timer);
    }, [
        syncedDdbChar?.id,
        spellSlots,
        createdSpellSlots,
        pactSlots.used,
        featureUses,
        customHp,
        actionUsed,
        bonusActionUsed,
        heroicInspiration,
        concentrationSpell,
        deathSaves,
        hitDiceUsed,
        exhaustionLevel,
        conditions
    ]);

    const [castLevel, setCastLevel] = useState<number>(1);

    // Refresh active caster and current selection reactively when player/selection changes
    useEffect(() => {
        if (!obr.ready || !obr.sceneReady || !obr.player?.role) return;

        const updateCaster = async () => {
            try {
                const role = obr.player!.role;
                const id = obr.player!.id;
                const active = await resolveActiveCaster(role, id);
                setCaster(active);

                if (active?.item) {
                    setActiveBuffs(getTokenBuffs(active.item));
                    const charId = getLinkedDDBCharacterId(active.item);
                    if (charId) {
                        const cached = getCachedDDBCharacter(charId);
                        if (cached) {
                            setSyncedDdbChar(cached);
                            applyDdbSlots(cached);
                        } else {
                            fetchDDBCharacter(charId).then(parsed => {
                                setSyncedDdbChar(parsed);
                                applyDdbSlots(parsed);
                            }).catch(console.error);
                        }
                    } else {
                        setSyncedDdbChar(null);
                    }
                } else {
                    setActiveBuffs([]);
                    setSyncedDdbChar(null);
                }

                const metadata = obr.player!.metadata;
                const currentSelected = metadata?.[toolMetadataSelectedSpell] as string | undefined;
                setSelected(currentSelected || null);
            } catch (err) {
                console.error("ActionDock update error:", err);
            }
        };

        updateCaster();
    }, [obr.ready, obr.sceneReady, obr.player]);

    // Listen to scene items changes to reactively update linked character
    useEffect(() => {
        if (!obr.ready || !obr.sceneReady) return;
        return OBR.scene.items.onChange(items => {
            if (!caster?.id) return;
            const updatedItem = items.find(it => it.id === caster.id);
            if (updatedItem) {
                setCaster(prev => prev ? { ...prev, item: updatedItem } : prev);
                setActiveBuffs(getTokenBuffs(updatedItem));
                const charId = getLinkedDDBCharacterId(updatedItem);
                if (charId) {
                    const cached = getCachedDDBCharacter(charId);
                    if (cached && cached.id !== syncedDdbChar?.id) {
                        setSyncedDdbChar(cached);
                        applyDdbSlots(cached);
                    }
                } else if (syncedDdbChar) {
                    setSyncedDdbChar(null);
                }
            }
        });
    }, [obr.ready, obr.sceneReady, caster?.id, syncedDdbChar]);

    // Build unified spells list combining D&D Beyond synced character spells with built-in library
    const dockSpells = useMemo(() => {
        const result: Array<{
            id: string;
            name: string;
            level: number;
            school: string;
            castingTime: string;
            rangeText: string;
            hitOrDc?: string;
            damage?: string;
            damageType?: string;
            notes?: string;
            isPrepared: boolean;
            fromChar: boolean;
            rawDdbSpell?: DDBParsedSpell;
        }> = [];
        const addedKeys = new Set<string>();

        // 1. Add character spells first
        if (syncedDdbChar && Array.isArray(syncedDdbChar.spells)) {
            registerDynamicSpells(syncedDdbChar.spells.map(ddbSpellToMetadata));
            syncedDdbChar.spells.forEach(s => {
                const normId = s.id.toLowerCase().replace(/[^a-z0-9_]/g, "");
                let finalId = s.id;
                for (const builtInId of spellIDs) {
                    const builtInNorm = builtInId.toLowerCase().replace(/[^a-z0-9_]/g, "");
                    if (builtInNorm === normId || (builtInNorm === "magic_missiles" && normId === "magic_missile")) {
                        finalId = builtInId;
                        break;
                    }
                }

                const nameKey = s.name.toLowerCase().trim();
                if (!addedKeys.has(finalId) && !addedKeys.has(nameKey)) {
                    addedKeys.add(finalId);
                    addedKeys.add(nameKey);

                    let hitOrDc: string | undefined = undefined;
                    if (s.saveOrAttack === "Spell Attack") {
                        const classStats = syncedDdbChar.classSpellStats?.find(
                            c => c.className.toLowerCase() === (s.castingClass || "").toLowerCase()
                        );
                        const bonus = classStats ? classStats.attackBonus : syncedDdbChar.spellAttackBonus;
                        hitOrDc = `+${bonus}`;
                    } else if (s.saveOrAttack && s.saveOrAttack.includes("Save")) {
                        const saveAbility = s.saveOrAttack.split(" ")[0] || "DEX";
                        const classStats = syncedDdbChar.classSpellStats?.find(
                            c => c.className.toLowerCase() === (s.castingClass || "").toLowerCase()
                        );
                        const dc = (classStats ? classStats.saveDC : syncedDdbChar.spellSaveDC) + buffMods.spellSaveDcBonus;
                        hitOrDc = `${saveAbility} ${dc}`;
                    } else if (s.saveOrAttack) {
                        hitOrDc = s.saveOrAttack;
                    }

                    result.push({
                        id: finalId,
                        name: s.name,
                        level: s.level,
                        school: s.school,
                        castingTime: s.castingTime || "1A",
                        rangeText: s.rangeText || (s.range ? `${s.range} ft.` : "Self"),
                        hitOrDc,
                        damage: s.damage,
                        damageType: s.damageType,
                        notes: s.components + (s.concentration ? ", C" : "") + (s.ritual ? ", R" : ""),
                        isPrepared: Boolean(s.isPrepared),
                        fromChar: true,
                        rawDdbSpell: s
                    });
                }
            });
        }

        // Only character spells from D&D Beyond are included in dockSpells.
        // We never inject library spells that the character does not have.
        return result;
    }, [syncedDdbChar, buffMods.spellSaveDcBonus]);

    const spellRegistry = useMemo(() => {
        if (!syncedDdbChar?.spells) return null;
        const reg = buildRegistry(syncedDdbChar.spells);
        setActiveRegistry(reg);
        return reg;
    }, [syncedDdbChar?.spells]);

    // Active spell selection
    const handleSelectSpell = (spellID: string) => {
        const meta = getSpellMetadata(spellID);
        const matchedDdbSpell = syncedDdbChar?.spells.find(s => s.id === spellID || s.name.toLowerCase() === spellID.toLowerCase());
        const effectiveLevel = matchedDdbSpell ? matchedDdbSpell.level : (meta.level ?? 0);
        setSelectedSpell(spellID);
        setSelected(spellID);
        setCastLevel(effectiveLevel);
        OBR.tool.activateTool(toolID);
    };

    // Cancel aiming and exit flyout (via ESC key, Right-Click, or close button)
    const handleCancelAiming = () => {
        setSelected(null);
        setUpcastPickerSpellId(null);
        setActiveFlyoutFeatureId(null);
        stopAiming().catch(() => {});
        OBR.notification.show("Aiming canceled", "INFO");
    };

    // Global ESC key and Right-Click listener to stop aiming and close flyout
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" || e.code === "Escape") {
                if (upcastPickerSpellId || selectedSpell || activeFlyoutFeatureId) {
                    e.preventDefault();
                    e.stopPropagation();
                    handleCancelAiming();
                }
            }
        };

        const handleContextMenu = (e: MouseEvent) => {
            if (upcastPickerSpellId || selectedSpell || activeFlyoutFeatureId) {
                e.preventDefault();
                e.stopPropagation();
                handleCancelAiming();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("contextmenu", handleContextMenu);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("contextmenu", handleContextMenu);
        };
    }, [upcastPickerSpellId, selectedSpell]);

    // Sync with OBR player metadata: if selected spell is cleared externally, close flyout; sync concentration
    useEffect(() => {
        if (!obr.ready) return;
        try {
            const unsub = OBR.player.onChange(player => {
                const sel = player.metadata[toolMetadataSelectedSpell] as string | undefined;
                if (!sel) {
                    setSelected(null);
                    setUpcastPickerSpellId(null);
                }
                if (syncedDdbChar?.id) {
                    const key = `${COMBAT_STATE_STORAGE_PREFIX}${syncedDdbChar.id}`;
                    const raw = player.metadata[key] as EmbersCombatState | undefined;
                    if (raw) {
                        if (raw.concentrationSpellId && raw.concentrationSpellName) {
                            setConcentrationSpell(prev => {
                                if (prev?.id === raw.concentrationSpellId && prev?.name === raw.concentrationSpellName) return prev;
                                return { id: raw.concentrationSpellId!, name: raw.concentrationSpellName! };
                            });
                        } else if (raw.concentrationSpellId === null) {
                            setConcentrationSpell(prev => prev ? null : prev);
                        }
                        if (raw.spellSlotsUsed) {
                            setSpellSlots(prev => {
                                let changed = false;
                                const next = { ...prev };
                                for (const [lvlStr, used] of Object.entries(raw.spellSlotsUsed)) {
                                    const lvl = Number(lvlStr);
                                    if (next[lvl] && next[lvl].used !== used) {
                                        next[lvl] = { ...next[lvl], used };
                                        changed = true;
                                    }
                                }
                                return changed ? next : prev;
                            });
                        }
                        if (typeof raw.pactSlotsUsed === "number") {
                            setPactSlots(prev => prev.used === raw.pactSlotsUsed ? prev : { ...prev, used: raw.pactSlotsUsed });
                        }
                    }
                }
            });
            return () => unsub();
        } catch (e) {
            console.warn("Failed to listen to player onChange in ActionDock:", e);
        }
    }, [obr.ready, syncedDdbChar?.id]);

    // Panel Resizing Handlers
    const handleResizeStart = (e: React.MouseEvent) => {
        const container = document.querySelector(".ddb-action-sheet-container") as HTMLElement;
        const currentH = container ? container.offsetHeight : (window.innerHeight || 400);
        dragRef.current = { startY: e.clientY, startH: currentH };
        setIsDraggingHeight(true);

        const onMouseMove = (ev: MouseEvent) => {
            if (!dragRef.current) return;
            const delta = dragRef.current.startY - ev.clientY; // dragging up increases height
            const maxAllowed = Math.max(220, (window.innerHeight || 800) - RESOURCE_TRAY_FLOAT_HEIGHT - 20);
            const newH = Math.max(220, Math.min(maxAllowed, dragRef.current.startH + delta));
            setPanelHeight(newH);
            try {
                localStorage.setItem(DOCK_SAVED_HEIGHT_KEY, String(newH));
            } catch {}
            if (OBR && OBR.popover && typeof OBR.popover.setHeight === "function") {
                OBR.popover.setHeight(actionDockPopoverId, newH + RESOURCE_TRAY_FLOAT_HEIGHT).catch(() => {});
            }
        };

        const onMouseUp = () => {
            dragRef.current = null;
            setIsDraggingHeight(false);
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        };

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
        e.preventDefault();
    };

    const handleToggleExpandHeight = () => {
        const maxH = Math.min(520, Math.max(380, Math.round(((window.innerHeight || 800) - RESOURCE_TRAY_FLOAT_HEIGHT) * 0.55)));
        const compactH = 260;
        setPanelHeight(prev => {
            const nextH = (prev && prev > 350) ? compactH : maxH;
            try {
                localStorage.setItem(DOCK_SAVED_HEIGHT_KEY, String(nextH));
            } catch {}
            if (OBR && OBR.popover && typeof OBR.popover.setHeight === "function") {
                OBR.popover.setHeight(actionDockPopoverId, nextH + RESOURCE_TRAY_FLOAT_HEIGHT).catch(() => {});
            }
            return nextH;
        });
    };

    // Spell Slot Picker Helpers
    const getAvailableSlotLevels = (baseLevel: number): number[] => {
        return Array.from({ length: 9 }, (_, i) => i + 1).filter(lvl => {
            if (lvl < baseLevel) return false;
            if (syncedDdbChar?.pactMagic && lvl === syncedDdbChar.pactMagic.level && pactSlots.max > 0) return true;
            const slot = spellSlots[lvl];
            return slot && slot.max > 0;
        });
    };

    const getRemainingSlots = (lvl: number): number => {
        let count = 0;
        const slot = spellSlots[lvl];
        if (slot) {
            count += Math.max(0, slot.max - slot.used);
        }
        if (syncedDdbChar?.pactMagic && lvl === syncedDdbChar.pactMagic.level) {
            count += Math.max(0, pactSlots.max - pactSlots.used);
        }
        return count;
    };

    // Helper to detect damage or sub-choices for spells (e.g. Sorcerous Burst, Chromatic Orb, etc.)
    const getSpellChoices = (spell: { id: string; name?: string }): string[] | null => {
        const spellObj = dockSpells.find(s => s.id === spell.id) || spell;
        const lowerName = (spellObj.name || "").toLowerCase().trim();
        if (lowerName === "sorcerous burst") {
            return ["acid", "cold", "fire", "lightning", "poison", "psychic", "thunder"];
        }
        if (lowerName === "chromatic orb") {
            return ["acid", "cold", "fire", "lightning", "poison", "thunder"];
        }
        if (lowerName === "dragon's breath") {
            return ["acid", "cold", "fire", "lightning", "poison"];
        }
        if (lowerName === "enhance ability") {
            return ["bear", "bull", "cat", "eagle", "fox", "owl"];
        }
        if (lowerName === "enlarge/reduce" || lowerName === "enlarge reduce") {
            return ["enlarge", "reduce"];
        }
        if (lowerName === "blindness/deafness" || lowerName === "blindness deafness") {
            return ["blindness", "deafness"];
        }
        if (lowerName === "command") {
            return ["approach", "drop", "flee", "grovel", "halt"];
        }
        if (lowerName === "glyph of warding") {
            return ["explosive_runes", "spell_glyph"];
        }
        if (lowerName === "protection from energy" || lowerName === "absorb elements") {
            return ["acid", "cold", "fire", "lightning", "thunder"];
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formula = spellRegistry?.get(spell.id) ?? resolveSpellFormula(spellObj as any);
        const choiceDmg = formula?.damage?.find(d => d.type === "choice");
        if (choiceDmg && choiceDmg.typeChoices && choiceDmg.typeChoices.length > 0) {
            return choiceDmg.typeChoices;
        }
        return null;
    };

    const activeFlyoutSpell = useMemo(() => {
        if (!upcastPickerSpellId) return null;
        return dockSpells.find(s => s.id === upcastPickerSpellId) || null;
    }, [upcastPickerSpellId, dockSpells]);

    const handleOpenUpcastPicker = (spell: { id: string; name?: string; level?: number }) => {
        const fullSpell = dockSpells.find(s => s.id === spell.id) || spell;
        const choices = getSpellChoices(fullSpell);
        const lvl = typeof fullSpell.level === "number" ? fullSpell.level : 0;
        const isLeveled = lvl > 0;
        const available = isLeveled ? getAvailableSlotLevels(lvl) : [];
        const isHex = fullSpell.name?.toLowerCase() === "hex" || fullSpell.id.toLowerCase() === "hex";

        // Toggle flyout if same spell is clicked again, else open new flyout & start aiming
        if (upcastPickerSpellId === fullSpell.id) {
            handleCancelAiming();
            return;
        }

        setActiveFlyoutFeatureId(null);
        setUpcastPickerSpellId(fullSpell.id);
        handleSelectSpell(fullSpell.id);

        if (isLeveled) {
            const firstAvailable = available.find(l => getRemainingSlots(l) > 0) ?? lvl;
            setUpcastPickerLevel(firstAvailable);
            setCastLevel(firstAvailable);
            OBR.player.setMetadata({
                [selectedSpellSlotLevelMetadataKey]: { spellId: fullSpell.id, slotLevel: firstAvailable }
            }).catch(() => {});
        } else {
            setUpcastPickerLevel(0);
            setCastLevel(0);
        }

        if (choices && choices.length > 0) {
            const currentChoice = spellDamageTypeOverrides[fullSpell.id] || choices[0];
            if (!spellDamageTypeOverrides[fullSpell.id]) {
                setSpellDamageTypeOverrides(prev => ({ ...prev, [fullSpell.id]: choices[0] }));
            }
            OBR.player.setMetadata({
                [selectedSpellDamageTypeMetadataKey]: { spellId: fullSpell.id, damageType: currentChoice }
            }).catch(() => {});
        }

        if (isHex) {
            const abilityToSave = selectedHexAbility || "dexterity";
            OBR.player.setMetadata({
                [hexChosenAbilityMetadataKey]: abilityToSave
            }).catch(() => {});
        }
    };

    const renderUpcastPickerRow = (spell: { id: string; level: number; rawDdbSpell?: DDBParsedSpell }, colSpan: number) => {
        const available = getAvailableSlotLevels(spell.level);
        const higherLevels = spell.rawDdbSpell?.higherLevels;
        return (
            <tr key={`upcast-picker-${spell.id}`} className="ddb-upcast-picker-row">
                <td colSpan={colSpan}>
                    <div className="ddb-upcast-picker" onClick={e => e.stopPropagation()}>
                        <div className="ddb-upcast-levels">
                            <span className="ddb-upcast-picker-label">Cast at level:</span>
                            {available.map(lvl => {
                                const rem = getRemainingSlots(lvl);
                                const isPact = Boolean(syncedDdbChar?.pactMagic && lvl === syncedDdbChar.pactMagic.level);
                                return (
                                    <button
                                        key={lvl}
                                        type="button"
                                        className={[
                                            "ddb-upcast-lvl-btn",
                                            upcastPickerLevel === lvl ? "selected" : "",
                                            rem === 0 ? "exhausted" : "",
                                            isPact ? "pact" : ""
                                        ].filter(Boolean).join(" ")}
                                        disabled={rem === 0}
                                        onClick={() => {
                                            setUpcastPickerLevel(lvl);
                                            setCastLevel(lvl);
                                        }}
                                        title={`${rem} slot${rem !== 1 ? "s" : ""} remaining`}
                                    >
                                        <span className="ddb-upcast-lvl-num">{lvl}</span>
                                        <span className="ddb-upcast-lvl-remain">{rem} left</span>
                                    </button>
                                );
                            })}
                        </div>
                        {higherLevels && upcastPickerLevel > spell.level && (
                            <div className="ddb-upcast-effect-text">
                                <span className="ddb-upcast-effect-label">At Level {upcastPickerLevel}:</span>
                                <span>{higherLevels}</span>
                            </div>
                        )}
                        <div className="ddb-upcast-confirm-row">
                            <button
                                type="button"
                                className="ddb-upcast-confirm-btn"
                                disabled={getRemainingSlots(upcastPickerLevel) === 0}
                                onClick={() => {
                                    handleCastClick(spell.id, upcastPickerLevel);
                                    setUpcastPickerSpellId(null);
                                }}
                            >
                                <IconCastLightning size={12} />
                                <span>Cast at Level {upcastPickerLevel}</span>
                            </button>
                            <button
                                type="button"
                                className="ddb-upcast-cancel-btn"
                                onClick={() => setUpcastPickerSpellId(null)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </td>
            </tr>
        );
    };

    const handleCastClick = async (spellIdToCast?: string, levelToUse?: number, hexAbility?: string, damageType?: string) => {
        const targetId = spellIdToCast || selectedSpell;
        if (!targetId) {
            OBR.notification.show("Select an attack or spell to cast", "INFO");
            return;
        }

        setSelectedSpell(targetId);
        setSelected(targetId);
        await OBR.tool.activateTool(toolID);

        if (damageType) {
            await OBR.player.setMetadata({
                [selectedSpellDamageTypeMetadataKey]: { spellId: targetId, damageType }
            });
        }

        const role = obr.player?.role || "PLAYER";
        const id = obr.player?.id || "";
        const meta = getSpellMetadata(targetId);
        const matchedDdbSpell = syncedDdbChar?.spells.find(s => s.id === targetId || s.name.toLowerCase() === targetId.toLowerCase());
        const baseSpellLevel = matchedDdbSpell ? matchedDdbSpell.level : (meta?.level ?? 0);
        const targetLevel = levelToUse !== undefined ? levelToUse : (castLevel !== undefined ? castLevel : baseSpellLevel);
        await OBR.player.setMetadata({ [selectedSpellSlotLevelMetadataKey]: { spellId: targetId, slotLevel: targetLevel } });
        const spellDisplayName = meta?.name || matchedDdbSpell?.name || targetId;

        const upcastMsg = (baseSpellLevel > 0 && targetLevel > baseSpellLevel)
            ? ` at ${getOrdinal(targetLevel)} Level`
            : "";

        const isHexSpell = targetId.toLowerCase() === "hex" || matchedDdbSpell?.name?.toLowerCase() === "hex";
        const isAlreadyHex = concentrationSpell?.id?.toLowerCase() === "hex" || concentrationSpell?.name?.toLowerCase() === "hex";

        if (isHexSpell) {
            const abilityToSave = hexAbility || selectedHexAbility || "dexterity";
            setSelectedHexAbility(abilityToSave);
            try {
                await OBR.player.setMetadata({
                    [hexChosenAbilityMetadataKey]: abilityToSave
                });
            } catch {}
            if (syncedDdbChar?.id) {
                saveCombatState(syncedDdbChar.id, {
                    hexAbility: abilityToSave
                }).catch(console.error);
            }
        }

        const currentTargets = await getSortedTargets();
        if (currentTargets.length === 0) {
            // No targets on map yet: enter aiming mode and inform user cleanly
            if (isHexSpell && isAlreadyHex) {
                OBR.notification.show(`Moving Hex (${(hexAbility || selectedHexAbility || "dexterity").toUpperCase()}) curse (Bonus Action, 0 slots consumed): Click target token on map`, "INFO");
            } else if (isHexSpell) {
                OBR.notification.show(`Aiming Hex (${(hexAbility || selectedHexAbility || "dexterity").toUpperCase()})${upcastMsg}: Click target token on map to curse`, "INFO");
            } else {
                OBR.notification.show(`Aiming ${spellDisplayName}${upcastMsg}: Click target token on map to cast`, "INFO");
            }
            return;
        }

        // Deduct 1 spell slot ONLY for leveled spells (baseSpellLevel >= 1).
        // Cantrips (level 0) are cast at-will and NEVER consume spell slots!
        // Moving an existing Hex curse does NOT consume a spell slot!
        if (baseSpellLevel >= 1 && targetLevel >= 1 && targetLevel <= 9 && !(isHexSpell && isAlreadyHex)) {
            const currentSlot = spellSlots[targetLevel];
            if (currentSlot && currentSlot.used < currentSlot.max) {
                setSpellSlots(prev => ({
                    ...prev,
                    [targetLevel]: { ...prev[targetLevel], used: prev[targetLevel].used + 1 }
                }));
            } else if (pactSlots.max > 0 && pactSlots.used < pactSlots.max) {
                // Deduct pact slot
                setPactSlots(prev => ({ ...prev, used: prev.used + 1 }));
            }
        }

        // Concentration Tracker
        if (matchedDdbSpell?.concentration) {
            const concSpellName = isHexSpell
                ? `Hex (${(hexAbility || selectedHexAbility || "dexterity").toUpperCase()})`
                : matchedDdbSpell.name;
            if (concentrationSpell && concentrationSpell.id !== matchedDdbSpell.id) {
                OBR.notification.show(`Concentration broken on "${concentrationSpell.name}"! Now concentrating on "${concSpellName}".`, "WARNING");
            }
            setConcentrationSpell({ id: matchedDdbSpell.id, name: concSpellName });
        }

        if (isHexSpell && isAlreadyHex) {
            OBR.notification.show(`Moved Hex (${(hexAbility || selectedHexAbility || "dexterity").toUpperCase()}) curse to new target (Bonus Action)`, "INFO");
        } else if (isHexSpell) {
            OBR.notification.show(`Casting Hex (${(hexAbility || selectedHexAbility || "dexterity").toUpperCase()})${upcastMsg}`, "INFO");
        } else {
            OBR.notification.show(`Casting ${spellDisplayName}${upcastMsg}`, "INFO");
        }
        await doSpell(targetId, id, role === "GM");
        setSelected(null);
        setUpcastPickerSpellId(null);
        await stopAiming();
    };

    const handleBreakConcentration = () => {
        if (concentrationSpell) {
            OBR.notification.show(`Ended concentration on "${concentrationSpell.name}".`, "INFO");
            setConcentrationSpell(null);
            if (syncedDdbChar?.id) {
                saveCombatState(syncedDdbChar.id, {
                    concentrationSpellId: null,
                    concentrationSpellName: null,
                    hexTargetId: null,
                    hexTargetName: null
                }).catch(console.error);
            }
        }
    };

    const handleRollDeathSave = () => {
        const roll = Math.floor(Math.random() * 20) + 1;
        if (roll === 20) {
            setCustomHp(prev => ({
                current: 1,
                max: prev?.max ?? (syncedDdbChar?.hp?.max ?? 10),
                temp: prev?.temp ?? 0
            }));
            setDeathSaves({ successes: 0, failures: 0 });
            OBR.notification.show("Natural 20! You regain 1 HP and stand back up!", "SUCCESS");
        } else if (roll === 1) {
            const nextFailures = Math.min(3, deathSaves.failures + 2);
            setDeathSaves(prev => ({ ...prev, failures: nextFailures }));
            if (nextFailures >= 3) {
                OBR.notification.show("Critical Failure (1)! 2 Death Save failures (3/3). You have died.", "ERROR");
            } else {
                OBR.notification.show(`Critical Failure (1)! 2 Death Save failures (${nextFailures}/3).`, "ERROR");
            }
        } else if (roll >= 10) {
            const nextSuccesses = Math.min(3, deathSaves.successes + 1);
            setDeathSaves(prev => ({ ...prev, successes: nextSuccesses }));
            if (nextSuccesses >= 3) {
                OBR.notification.show("Death Save Success! (3/3) You are STABLE.", "SUCCESS");
            } else {
                OBR.notification.show(`Death Save Success (Roll ${roll}): ${nextSuccesses}/3 successes.`, "INFO");
            }
        } else {
            const nextFailures = Math.min(3, deathSaves.failures + 1);
            setDeathSaves(prev => ({ ...prev, failures: nextFailures }));
            if (nextFailures >= 3) {
                OBR.notification.show("Death Save Failure! (3/3) You have died.", "ERROR");
            } else {
                OBR.notification.show(`Death Save Failure (Roll ${roll}): ${nextFailures}/3 failures.`, "WARNING");
            }
        }
    };

    const handleRollHitDie = (die: string, maxSides: number) => {
        const currentUsed = hitDiceUsed[die] || 0;
        const total = (syncedDdbChar?.hitDice || []).find(h => h.die === die)?.total || 1;
        if (currentUsed >= total) {
            OBR.notification.show(`No remaining ${die} Hit Dice available.`, "WARNING");
            return;
        }

        const conMod = syncedDdbChar?.modifiers.con ?? 0;
        const dieRoll = Math.floor(Math.random() * maxSides) + 1;
        const totalHeal = Math.max(1, dieRoll + conMod);

        const currentHp = currentHpVal;
        const maxHp = maxHpVal;
        const nextHp = Math.min(maxHp, currentHp + totalHeal);

        setCustomHp(prev => ({
            current: nextHp,
            max: maxHp,
            temp: prev?.temp ?? 0
        }));

        setHitDiceUsed(prev => ({
            ...prev,
            [die]: currentUsed + 1
        }));

        OBR.notification.show(`Short Rest Hit Die (${die}): Rolled ${dieRoll} + ${conMod} CON = healed ${totalHeal} HP (${nextHp}/${maxHp})`, "SUCCESS");
    };

    const handleToggleCondition = (cond: string) => {
        setConditions(prev => {
            if (prev.includes(cond)) {
                return prev.filter(c => c !== cond);
            } else {
                return [...prev, cond];
            }
        });
    };

    const handleClearTargetsClick = async () => {
        const items = await OBR.scene.local.getItems();
        const targets = items.filter(item => item.metadata[targetHighlightMetadataKey] != undefined);
        if (targets.length > 0) {
            await OBR.scene.local.deleteItems(targets.map(item => item.id));
        }
    };

    const handleOpenBrowserClick = () => {
        const search = window.location.search || "";
        OBR.popover.open({
            id: spellPopoverId,
            width: 760,
            height: 440,
            url: `${window.location.origin}/spell-selection-popover${search}`,
            hidePaper: true
        });
    };

    // Weapon attack roll click
    const handleWeaponAttackRoll = (weapon: DDBWeaponAttack) => {
        if (caster?.id) {
            checkAndFireActionTriggers(caster.id, "attack").catch(() => {});
        }
        const mode = buffMods.hasAttackAdvantage ? "advantage" : "normal";
        const roll = rollAttack(weapon.toHit, "", mode);
        const casterName = syncedDdbChar?.name || "Character";
        const isHexActive = concentrationSpell?.id?.toLowerCase() === "hex" || concentrationSpell?.name?.toLowerCase() === "hex";

        const cards: DDBRollCardData[] = [
            {
                id: `${Date.now()}-dock-atk`,
                casterName,
                targetName: "TARGET",
                actionName: weapon.name.toUpperCase(),
                actionType: "TO HIT",
                dieType: 20,
                diceBreakdown: `${roll.d20} ${roll.bonus >= 0 ? `+ ${roll.bonus}` : `- ${Math.abs(roll.bonus)}`}`,
                formula: `1d20${roll.bonus >= 0 ? `+${roll.bonus}` : `${roll.bonus}`}${mode === "advantage" ? " (ADV)" : ""}`,
                total: roll.total,
                subtitle: roll.isCrit ? "Critical Hit!" : roll.isMiss ? "Critical Miss!" : "Weapon Attack Roll",
                isCrit: roll.isCrit,
                isMiss: roll.isMiss,
                timestamp: Date.now()
            }
        ];

        let hexNotice = "";
        if (!roll.isMiss) {
            if (isHexActive) {
                const hexDice = roll.isCrit ? "2d6" : "1d6";
                const hexDmg = rollDamageDDB("1d6", "Necrotic", "", roll.isCrit);
                cards.push({
                    id: `${Date.now()}-dock-hex-dmg`,
                    casterName,
                    targetName: "TARGET",
                    actionName: "HEX (CURSE)",
                    actionType: "DAMAGE",
                    dieType: 6,
                    diceBreakdown: hexDmg.breakdown.replace(/\+/g, " + "),
                    formula: `${hexDice} Necrotic`,
                    total: hexDmg.total,
                    subtitle: roll.isCrit ? "Hex Critical Hit (+2d6 Necrotic)" : "Hex Curse (+1d6 Necrotic)",
                    isCrit: roll.isCrit,
                    timestamp: Date.now() + 1
                });
                hexNotice = ` | Hex: +${hexDmg.total} Necrotic`;
            }
        } else if (hasWeaponGraze(weapon)) {
            const abilityMod = Math.max(1, weapon.toHit - (syncedDdbChar?.proficiencyBonus ?? 2));
            const weaponDamageType = weapon.damageType || "Slashing";
            cards.push({
                id: `${Date.now()}-dock-graze-dmg`,
                casterName,
                targetName: "TARGET",
                actionName: `${weapon.name.toUpperCase()} (GRAZE)`,
                actionType: "DAMAGE",
                dieType: 0,
                diceBreakdown: `${abilityMod}`,
                formula: `${abilityMod} ${weaponDamageType}`,
                total: abilityMod,
                subtitle: "Weapon Mastery: Graze (Damage on Miss)",
                timestamp: Date.now() + 1
            });
            hexNotice = ` | Graze: ${abilityMod} ${weaponDamageType}`;
        }

        broadcastDDBRoll(cards);
        OBR.notification.show(`${casterName} - ${weapon.name}: ${roll.formatted}${hexNotice}`, roll.isCrit ? "SUCCESS" : roll.isMiss ? "WARNING" : "INFO");
    };

    // Weapon damage roll click
    const handleWeaponDamageRoll = async (weapon: DDBWeaponAttack, riderName?: string | null) => {
        if (caster?.id) {
            checkAndFireActionTriggers(caster.id, "attack").catch(() => {});
        }
        let riderObj: ReturnType<typeof parseRiderString> | undefined = undefined;
        if (riderName && weapon.cantripRiders) {
            const found = weapon.cantripRiders.find(r => r.startsWith(riderName));
            if (found) riderObj = parseRiderString(found);
        }

        const triggerInfo = riderObj
            ? resolveSpellConditionalTrigger(riderObj.name, riderObj.raw, syncedDdbChar?.level || 1)
            : null;

        // If rider has a conditional trigger, use only immediate on-hit damage (if any) for the initial attack
        const effectiveRiderDamage = triggerInfo && triggerInfo.hasTrigger
            ? (triggerInfo.immediateOnHitDice || "")
            : (riderObj?.damage || "");

        const { total, formatted } = rollDamageBreakdown(
            weapon.damage,
            weapon.damageType,
            "",
            riderObj ? {
                name: riderObj.name,
                damage: effectiveRiderDamage,
                damageType: riderObj.damageType,
                moveTrigger: undefined
            } : undefined
        );
        const casterName = syncedDdbChar?.name || "Character";
        const isHexActive = concentrationSpell?.id?.toLowerCase() === "hex" || concentrationSpell?.name?.toLowerCase() === "hex";

        let pendingTriggerId: string | undefined = undefined;
        let triggerSubtitle = "";

        if (triggerInfo && triggerInfo.hasTrigger) {
            const triggerId = `trig_${Date.now()}_dock`;
            pendingTriggerId = triggerId;
            let targetTokenId = "TARGET";
            let targetTokenName = "TARGET";
            let targetPosition: { x: number; y: number } | undefined = undefined;

            try {
                const selection = await OBR.player.getSelection().catch(() => [] as string[]);
                if (selection && selection.length > 0) {
                    const sceneItems = await OBR.scene.items.getItems(selection);
                    const selItem = sceneItems[0];
                    if (selItem) {
                        targetTokenId = selItem.id;
                        targetTokenName = selItem.name || "Target";
                        targetPosition = selItem.position;
                    }
                }
            } catch {
                // Ignore selection error
            }

            await addConditionalTrigger({
                id: triggerId,
                spellId: riderObj?.name.toLowerCase().replace(/[^a-z0-9_]/g, "") || "rider_spell",
                spellName: riderObj?.name || "Spell",
                casterName,
                targetId: targetTokenId,
                targetName: targetTokenName,
                conditionType: triggerInfo.conditionType,
                damageFormula: triggerInfo.damageDice,
                damageType: triggerInfo.damageType,
                conditionDescription: triggerInfo.conditionDesc,
                appliedAt: Date.now(),
                initialPosition: targetPosition
            });
            triggerSubtitle = ` • Condition Applied: ${triggerInfo.conditionDesc}`;
        }

        const cards: DDBRollCardData[] = [
            {
                id: `${Date.now()}-dock-dmg`,
                casterName,
                targetName: "TARGET",
                actionName: weapon.name.toUpperCase(),
                actionType: "DAMAGE",
                dieType: 8,
                diceBreakdown: formatted.replace(/^Damage:\s*\d+\s*[A-Za-z]*\s*\(/, "").replace(/\)$/, "").replace(/\+/g, " + "),
                formula: `${weapon.damage} ${weapon.damageType}`,
                total,
                subtitle: `Damage (${weapon.damageType})${triggerSubtitle}`,
                pendingTriggerId,
                pendingTriggerName: riderObj?.name,
                timestamp: Date.now()
            }
        ];

        let hexNotice = "";
        if (isHexActive) {
            const hexDmg = rollDamageDDB("1d6", "Necrotic");
            cards.push({
                id: `${Date.now()}-dock-hex-dmg`,
                casterName,
                targetName: "TARGET",
                actionName: "HEX (CURSE)",
                actionType: "DAMAGE",
                dieType: 6,
                diceBreakdown: hexDmg.breakdown.replace(/\+/g, " + "),
                formula: "1d6 Necrotic",
                total: hexDmg.total,
                subtitle: "Hex Curse (+1d6 Necrotic)",
                timestamp: Date.now() + 1
            });
            hexNotice = ` | Hex: +${hexDmg.total} Necrotic`;
        }

        broadcastDDBRoll(cards);
        OBR.notification.show(`${casterName} - ${weapon.name}: ${formatted}${hexNotice}`, "INFO");
    };

    // Cantrip rider clicked
    const handleRiderClick = (weapon: DDBWeaponAttack, rider: ReturnType<typeof parseRiderString>) => {
        const currentActive = activeRiderMap[weapon.id];
        const nextRider = currentActive === rider.name ? null : rider.name;
        setActiveRiderMap(prev => ({ ...prev, [weapon.id]: nextRider }));

        // Match known cantrip to enable visual spell animation
        const matchSpell = dockSpells.find(s => s.name.toLowerCase() === rider.name.toLowerCase());
        if (matchSpell) {
            setSelectedSpell(matchSpell.id);
            setSelected(matchSpell.id);
            OBR.tool.activateTool(toolID);
        }

        // Roll combined weapon + cantrip damage
        const { total, formatted } = rollDamageBreakdown(
            weapon.damage,
            weapon.damageType,
            "",
            {
                name: rider.name,
                damage: rider.damage,
                damageType: rider.damageType,
                moveTrigger: rider.moveTrigger
            }
        );
        const casterName = syncedDdbChar?.name || "Character";
        broadcastDDBRoll([
            {
                id: `${Date.now()}-dock-rider-dmg`,
                casterName,
                targetName: "TARGET",
                actionName: weapon.name.toUpperCase(),
                actionType: "DAMAGE",
                dieType: 8,
                diceBreakdown: formatted.replace(/^Damage:\s*\d+\s*[A-Za-z]*\s*\(/, "").replace(/\)$/, "").replace(/\+/g, " + "),
                formula: `${weapon.damage} + ${rider.damage}`,
                total,
                subtitle: `${rider.name} Rider Damage`,
                timestamp: Date.now()
            }
        ]);
        OBR.notification.show(`${casterName} - ${weapon.name}: ${formatted}`, "INFO");
    };

    // Spell attack roll or DC check
    const handleSpellAttackRoll = (spell: { id: string; name: string; hitOrDc?: string }) => {
        if (caster?.id) {
            checkAndFireActionTriggers(caster.id, "spell").catch(() => {});
        }
        handleSelectSpell(spell.id);
        const casterName = syncedDdbChar?.name || "Character";
        const charLevel = syncedDdbChar?.level ?? 1;
        const beamInfo = getSpellBeamInfo(spell.id, charLevel);

        if (spell.hitOrDc && spell.hitOrDc.startsWith("+")) {
            const bonus = parseInt(spell.hitOrDc.replace("+", ""), 10) || 0;
            const mode = buffMods.hasSpellAdvantage ? "advantage" : "normal";
            const isHexActive = concentrationSpell?.id?.toLowerCase() === "hex" || concentrationSpell?.name?.toLowerCase() === "hex";
            const ddbSpell = syncedDdbChar?.spells?.find(s => s.id === spell.id || s.name.toLowerCase() === spell.name.toLowerCase());
            const damageType = ddbSpell?.damageType || "Force";
            const dieFaces = Number(ddbSpell?.damage?.match(/d(\d+)/i)?.[1] ?? 10);

            // 1. Multi-beam spell (e.g. Eldritch Blast, Scorching Ray)
            if (beamInfo.isMultiBeam) {
                const subRolls: DDBSubRollEntry[] = [];
                let totalCombinedDamage = 0;
                let totalHexDamage = 0;
                let anyCrit = false;
                let allMiss = true;

                for (let b = 1; b <= beamInfo.totalBeams; b++) {
                    const roll = rollAttack(bonus, "", mode);
                    if (roll.isCrit) anyCrit = true;
                    if (!roll.isMiss) allMiss = false;

                    let bDmgResult: ReturnType<typeof rollDamageDDB> | null = null;
                    const extraDamage: DDBSubRollExtraDamage[] = [];

                    if (!roll.isMiss) {
                        bDmgResult = ddbSpell?.damage ? rollDamageDDB(ddbSpell.damage, damageType, "", roll.isCrit) : null;
                        if (bDmgResult) totalCombinedDamage += bDmgResult.total;

                        if (isHexActive) {
                            const hexDice = roll.isCrit ? "2d6" : "1d6";
                            const hexDmg = rollDamageDDB("1d6", "Necrotic", "", roll.isCrit);
                            totalHexDamage += hexDmg.total;
                            extraDamage.push({
                                name: "Hex",
                                total: hexDmg.total,
                                damageType: "Necrotic",
                                diceBreakdown: hexDmg.breakdown.replace(/\+/g, " + "),
                                formula: `${hexDice} Necrotic`,
                                isCrit: roll.isCrit,
                            });
                        }
                    } else {
                        // Miss / Critical Miss
                        const isCantrip = ddbSpell?.level === 0;
                        if (isCantrip && hasPotentCantrip(syncedDdbChar) && ddbSpell?.damage) {
                            const fullDmg = rollDamageDDB(ddbSpell.damage, damageType, "", false);
                            const halfDmg = Math.max(1, Math.floor(fullDmg.total / 2));
                            totalCombinedDamage += halfDmg;
                            bDmgResult = {
                                total: halfDmg,
                                damageType,
                                breakdown: `${halfDmg} (Half)`,
                                formatted: `${halfDmg} ${damageType}`,
                                message: `${halfDmg} ${damageType}`,
                            };
                        }
                    }

                    subRolls.push({
                        unitLabel: `${beamInfo.beamUnit.toUpperCase()} ${b}`,
                        targetName: "TARGET",
                        toHit: {
                            total: roll.total,
                            diceBreakdown: `${roll.d20} ${roll.bonus >= 0 ? `+ ${roll.bonus}` : `- ${Math.abs(roll.bonus)}`}`,
                            formula: `1d20${bonus >= 0 ? `+${bonus}` : `${bonus}`}${mode === "advantage" ? " (ADV)" : ""}`,
                            isCrit: roll.isCrit,
                            isMiss: roll.isMiss,
                        },
                        damage: bDmgResult ? {
                            total: bDmgResult.total,
                            damageType,
                            diceBreakdown: bDmgResult.breakdown.replace(/\+/g, " + "),
                            formula: `${ddbSpell?.damage || ""} ${damageType}`.trim(),
                            isCrit: roll.isCrit,
                        } : undefined,
                        extraDamage: extraDamage.length > 0 ? extraDamage : undefined,
                    });
                }

                const summaryTotal = totalHexDamage > 0
                    ? `${totalCombinedDamage} + ${totalHexDamage}`
                    : totalCombinedDamage;

                const groupedCard: DDBRollCardData = {
                    id: `${Date.now()}-dock-multi-${spell.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
                    casterName,
                    targetName: "TARGET",
                    actionName: spell.name.toUpperCase(),
                    actionType: "SPELL",
                    dieType: dieFaces,
                    diceBreakdown: subRolls.map(s => `${s.toHit?.total ?? 0}`).join(", "),
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
                OBR.notification.show(
                    `${casterName} - ${spell.name} (${beamInfo.totalBeams} ${beamInfo.beamUnit}s): ${subRolls.map(s => s.toHit?.total).join(", ")}`,
                    anyCrit ? "SUCCESS" : "INFO"
                );
                return;
            }

            // 2. Single-attack spell
            const roll = rollAttack(bonus, "", mode);
            const cards: DDBRollCardData[] = [
                {
                    id: `${Date.now()}-dock-spell-atk`,
                    casterName,
                    targetName: "TARGET",
                    actionName: spell.name.toUpperCase(),
                    actionType: "TO HIT",
                    dieType: 20,
                    diceBreakdown: `${roll.d20} ${roll.bonus >= 0 ? `+ ${roll.bonus}` : `- ${Math.abs(roll.bonus)}`}`,
                    formula: `1d20${bonus >= 0 ? `+${bonus}` : `${bonus}`}${mode === "advantage" ? " (ADV)" : ""}`,
                    total: roll.total,
                    subtitle: roll.isCrit ? "Critical Hit!" : roll.isMiss ? "Critical Miss!" : "Spell Attack Roll",
                    isCrit: roll.isCrit,
                    isMiss: roll.isMiss,
                    timestamp: Date.now()
                }
            ];

            let hexNotice = "";
            if (!roll.isMiss) {
                if (isHexActive) {
                    const hexDice = roll.isCrit ? "2d6" : "1d6";
                    const hexDmg = rollDamageDDB("1d6", "Necrotic", "", roll.isCrit);
                    cards.push({
                        id: `${Date.now()}-dock-hex-dmg`,
                        casterName,
                        targetName: "TARGET",
                        actionName: selectedHexAbility ? `HEX (${selectedHexAbility.toUpperCase()})` : "HEX (CURSE)",
                        actionType: "DAMAGE",
                        dieType: 6,
                        diceBreakdown: hexDmg.breakdown.replace(/\+/g, " + "),
                        formula: `${hexDice} Necrotic`,
                        total: hexDmg.total,
                        subtitle: roll.isCrit ? "Hex Critical Hit (+2d6 Necrotic)" : "Hex Curse (+1d6 Necrotic)",
                        isCrit: roll.isCrit,
                        timestamp: Date.now() + 1
                    });
                    hexNotice = ` | Hex: +${hexDmg.total} Necrotic`;
                }
            } else {
                const isCantrip = ddbSpell?.level === 0;
                if (isCantrip && hasPotentCantrip(syncedDdbChar) && ddbSpell?.damage) {
                    const fullDmg = rollDamageDDB(ddbSpell.damage, damageType, "", false);
                    const halfDmg = Math.max(1, Math.floor(fullDmg.total / 2));
                    const dieFaces = Number(ddbSpell.damage.match(/d(\d+)/i)?.[1] ?? 8);
                    cards.push({
                        id: `${Date.now()}-dock-potent-dmg`,
                        casterName,
                        targetName: "TARGET",
                        actionName: `${spell.name.toUpperCase()} (POTENT CANTRIP)`,
                        actionType: "DAMAGE",
                        dieType: dieFaces,
                        diceBreakdown: `${halfDmg} (Half)`,
                        formula: `${halfDmg} ${damageType}`,
                        total: halfDmg,
                        subtitle: "Potent Cantrip (Half Damage on Miss)",
                        timestamp: Date.now() + 1
                    });
                    hexNotice = ` | Potent Cantrip: ${halfDmg} ${damageType}`;
                }
            }

            broadcastDDBRoll(cards);
            OBR.notification.show(`${casterName} - ${spell.name}: ${roll.formatted}${hexNotice}`, roll.isCrit ? "SUCCESS" : roll.isMiss ? "WARNING" : "INFO");
        } else if (spell.hitOrDc) {
            OBR.notification.show(`${spell.name} Save: ${spell.hitOrDc}`, "INFO");
        } else {
            OBR.notification.show(`Selected ${spell.name}`, "INFO");
        }
    };

    // Activate/toggle feature buff (Innate Sorcery, Rage, Bladesong, etc.)
    const handleActivateFeature = async (feat: { id: string; name: string; limitedUse?: { max?: number; used?: number; resetType?: string }; activationType?: string }) => {
        if (!caster?.id) {
            OBR.notification.show("No active token selected to apply buff.", "WARNING");
            return;
        }

        const featLower = feat.name.toLowerCase();
        let buffData: Omit<ActiveBuff, "activatedAt"> | undefined = undefined;

        if (featLower.includes("innate sorcery")) {
            buffData = KNOWN_BUFFS.innate_sorcery;
        } else if (featLower.includes("rage")) {
            buffData = KNOWN_BUFFS.rage;
        } else if (featLower.includes("bladesong")) {
            buffData = KNOWN_BUFFS.bladesong;
        } else {
            // Auto-extract mechanical effects from description
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const parsedEffects = extractBuffEffects((feat as any).description || (feat as any).snippet || "");
            buffData = {
                id: feat.id,
                name: feat.name,
                icon: "✨",
                source: feat.activationType ? feat.activationType.toUpperCase() : "Feature",
                durationText: "1 minute",
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                description: (feat as any).description || (feat as any).snippet || "Active feature effect.",
                spellSaveDcBonus: parsedEffects.spellSaveDcBonus,
                spellAttackAdvantage: parsedEffects.spellAttackAdvantage,
                attackAdvantage: parsedEffects.attackAdvantage || (parsedEffects.advantage?.length ? true : undefined),
                damageBonus: parsedEffects.damageBonusFlat
            };
        }

        const buffToApply: ActiveBuff = {
            ...buffData,
            activatedAt: Date.now(),
        };

        const result = await toggleTokenBuff(caster.id, buffToApply);
        setActiveBuffs(result.buffs);

        if (result.active) {
            // Consume 1 use if limited uses exist and uses remain
            const currentUsed = featureUses[feat.id] ?? (feat.limitedUse?.used ?? 0);
            const maxUses = feat.limitedUse?.max ?? 0;
            if (maxUses > 0 && currentUsed < maxUses) {
                setFeatureUses(prev => ({ ...prev, [feat.id]: currentUsed + 1 }));
            }

            // Consume Bonus Action or Action pip
            if (feat.activationType === "bonus") {
                setBonusActionUsed(true);
            } else if (feat.activationType === "action") {
                setActionUsed(true);
            }

            OBR.notification.show(`Activated ${buffToApply.name}! ${buffToApply.description}`, "SUCCESS");
        } else {
            OBR.notification.show(`Deactivated ${buffToApply.name}`, "INFO");
        }
    };

    // Spell damage roll with generic exploding dice & damage choice support
    const handleSpellDamageRoll = (spell: {
        id: string;
        name: string;
        level: number;
        school: string;
        damage?: string;
        damageType?: string;
        castingTime?: string;
        rangeText?: string;
        notes?: string;
        rawDdbSpell?: DDBParsedSpell;
    }) => {
        handleSelectSpell(spell.id);

        if (spell.id.toLowerCase() === "hex" || spell.name.toLowerCase() === "hex") {
            handleOpenUpcastPicker(spell);
            return;
        }

        const formula = spellRegistry?.get(spell.id) ?? resolveSpellFormula(spell);
        const charLevel = syncedDdbChar?.level ?? 1;

        // Resolve effective dice with priority: (1) cantrip scale from registry,
        // (2) DDB spell damage string, (3) formula base dice (covers cantrips not in DDB sync)
        let effectiveDice: string | undefined;
        if (formula?.cantripScale) {
            const scaled = spellRegistry?.getCantripDice(spell.id, charLevel);
            // getCantripDice returns "—" when registry is missing; fallback to base dice
            effectiveDice = scaled && scaled !== "—" ? scaled : undefined;
        }
        if (!effectiveDice) {
            effectiveDice = (spell.damage as string | undefined) || undefined;
        }
        if (!effectiveDice) {
            // Last resort: use the formula's own base damage dice (e.g. Sorcerous Burst "1d8")
            const formulaBase = formula?.damage.find(d => d.isBase);
            if (formulaBase?.dice && formulaBase.dice !== "weapon") {
                effectiveDice = formulaBase.dice;
            }
        }

        if (!effectiveDice) {
            OBR.notification.show(`Selected ${spell.name}`, "INFO");
            return;
        }

        // Resolve effective damage type
        const baseDmg = formula?.damage.find(d => d.isBase);
        const chosenType = spellDamageTypeOverrides[spell.id] ??
            (baseDmg?.type === "choice" && baseDmg.typeChoices ? baseDmg.typeChoices[0] : (spell.damageType || ""));
        const damageTypeLabel = chosenType ? chosenType.charAt(0).toUpperCase() + chosenType.slice(1) : "";

        // Roll spell damage with exploding dice / exploding any die support
        const casterName = syncedDdbChar?.name || "Character";
        const dieFaces = Number(effectiveDice.match(/d(\d+)/i)?.[1] ?? 8);
        const explodingMechanic = formula?.mechanics?.find(m => m.kind === "exploding");
        const explodingAnyDie = formula?.mechanics?.find(m => m.kind === "exploding_any_die");

        const statKey = (syncedDdbChar?.spellCastingAbility?.toLowerCase() || "cha") as "int" | "wis" | "cha";
        const spellcastingMod = Math.max(1, syncedDdbChar?.modifiers?.[statKey] ?? 3);

        let dmgResult: ReturnType<typeof rollDamageDDB>;
        if (explodingMechanic) {
            const triggerValue = explodingMechanic.triggerValue ?? 8;
            const maxExplosions = explodingMechanic.maxExtra === "spellcastingMod"
                ? spellcastingMod
                : (typeof explodingMechanic.maxExtra === "number" ? explodingMechanic.maxExtra : 0);
            dmgResult = rollDamageExploding(effectiveDice, chosenType, triggerValue, maxExplosions);
        } else if (explodingAnyDie) {
            const maxExplosions = explodingAnyDie.maxExtra === "spellcastingMod"
                ? spellcastingMod
                : (typeof explodingAnyDie.maxExtra === "number" ? explodingAnyDie.maxExtra : 0);
            dmgResult = rollDamageExplodingAnyDie(effectiveDice, chosenType, maxExplosions);
        } else {
            dmgResult = rollDamageDDB(effectiveDice, chosenType);
        }

        const isExploded = Boolean(dmgResult.explosionCount && dmgResult.explosionCount > 0);
        const explosionCount = dmgResult.explosionCount ?? 0;
        broadcastDDBRoll([
            {
                id: `${Date.now()}-dock-spell-dmg`,
                casterName,
                targetName: "TARGET",
                actionName: spell.name.toUpperCase(),
                actionType: "DAMAGE",
                dieType: dieFaces,
                diceBreakdown: dmgResult.breakdown.replace(/\+/g, " + "),
                formula: isExploded
                    ? `${effectiveDice} ${damageTypeLabel} (+${explosionCount} Exploded)`.trim()
                    : `${effectiveDice} ${damageTypeLabel}`.trim(),
                total: dmgResult.total,
                subtitle: isExploded
                    ? `Damage (${damageTypeLabel || "Spell"}) • ${explosionCount} Bonus ${explosionCount > 1 ? "Dice" : "Die"}`
                    : `Damage (${damageTypeLabel || "Spell"})`,
                timestamp: Date.now()
            }
        ]);

        OBR.notification.show(`${spell.name} Damage: ${dmgResult.formatted}`, "INFO");
    };

    // Toggle limited use check
    const handleToggleFeatureBox = (feature: { id: string; limitedUse?: { used?: number } }, boxIndex: number) => {
        const currentUsed = featureUses[feature.id] ?? (feature.limitedUse?.used ?? 0);
        // If clicking on or below current used, decrease; otherwise set to boxIndex + 1
        const nextUsed = currentUsed < 0
            ? currentUsed + 1
            : (currentUsed === boxIndex + 1) ? boxIndex : boxIndex + 1;
        setFeatureUses(prev => ({
            ...prev,
            [feature.id]: nextUsed
        }));
    };

    // Weapon selection & aiming
    const handleSelectWeapon = (weapon: DDBWeaponAttack, mode: "melee" | "thrown" = "melee") => {
        const spellId = mode === "thrown" ? "ranged_weapon_attack" : "melee_weapon_attack";
        setSelectedSpell(spellId);
        setSelected(spellId);
        OBR.tool.activateTool(toolID);
        OBR.notification.show(`Aiming ${weapon.name} (${mode === "thrown" ? `${weapon.thrownRange || 20}/${weapon.thrownLongRange || 60} ft Thrown` : "5 ft Reach"})`, "INFO");
    };

    // Two-Weapon Fighting bonus action attack
    const handleTwoWeaponFightingClick = () => {
        if (syncedDdbChar?.offhandWeapon) {
            handleSelectWeapon(syncedDdbChar.offhandWeapon, "melee");
            const atkRoll = rollAttack(syncedDdbChar.offhandWeapon.toHit, "Two-Weapon Fighting (Offhand)");
            const dmgRoll = rollFormula(syncedDdbChar.offhandWeapon.damage);
            OBR.notification.show(`${atkRoll.message} | Dmg: ${dmgRoll.breakdown} ${syncedDdbChar.offhandWeapon.damageType}`, "INFO");
        } else {
            OBR.notification.show("Two-Weapon Fighting: Attack with second Light weapon as a Bonus Action", "INFO");
        }
    };

    // Opportunity Attack reaction
    const handleOpportunityAttackClick = () => {
        const primary = weaponsList[0];
        if (primary) {
            handleSelectWeapon(primary, "melee");
            const atkRoll = rollAttack(primary.toHit, `Opportunity Attack (${primary.name})`);
            const dmgRoll = rollFormula(primary.damage);
            OBR.notification.show(`${atkRoll.message} | Dmg: ${dmgRoll.breakdown} ${primary.damageType}`, "INFO");
        } else {
            OBR.notification.show("Opportunity Attack: Make 1 melee attack when a hostile creature leaves your reach", "INFO");
        }
    };

    // Roll Initiative with advantage if character has Weapon of Warning or advantage trait
    const handleInitiativeRoll = () => {
        const initBonus = syncedDdbChar?.initiative ?? (syncedDdbChar ? syncedDdbChar.modifiers.dex : 3);
        const hasAdv = syncedDdbChar?.hasInitiativeAdvantage ?? false;
        let roll = Math.floor(Math.random() * 20) + 1;
        let detail = `1d20 (${roll})`;
        if (hasAdv) {
            const roll2 = Math.floor(Math.random() * 20) + 1;
            const higher = Math.max(roll, roll2);
            detail = `Advantage [${roll}, ${roll2}] -> ${higher}`;
            roll = higher;
        }
        const total = roll + initBonus;
        OBR.notification.show(`Initiative: ${detail} + ${initBonus >= 0 ? `+${initBonus}` : initBonus} = ${total}`, "INFO");
    };

    // Toggle Heroic Inspiration
    const handleToggleInspiration = () => {
        setHeroicInspiration(prev => {
            const next = !prev;
            OBR.notification.show(next ? "Heroic Inspiration gained!" : "Heroic Inspiration spent", "INFO");
            return next;
        });
    };

    // Quick HP Adjustments (Heal / Damage)
    const handleHpHeal = (amount: number = 5) => {
        setCustomHp(prev => {
            const cur = prev ? prev.current : (syncedDdbChar?.hp?.current ?? 0);
            const max = prev ? prev.max : (syncedDdbChar?.hp?.max ?? 0);
            const temp = prev ? prev.temp : (syncedDdbChar?.hp?.temp ?? 0);
            const nextCur = Math.min(max, cur + amount);
            OBR.notification.show(`Healed +${amount} HP (${nextCur}/${max})`, "SUCCESS");
            if (nextCur > 0 && (deathSaves.successes > 0 || deathSaves.failures > 0)) {
                setDeathSaves({ successes: 0, failures: 0 });
            }
            return { current: nextCur, max, temp };
        });
    };

    const handleHpDamage = (amount: number = 5) => {
        setCustomHp(prev => {
            const cur = prev ? prev.current : (syncedDdbChar?.hp?.current ?? 0);
            const max = prev ? prev.max : (syncedDdbChar?.hp?.max ?? 0);
            const temp = prev ? prev.temp : (syncedDdbChar?.hp?.temp ?? 0);
            let remainingDmg = amount;
            let nextTemp = temp;
            if (nextTemp > 0) {
                const absorbed = Math.min(nextTemp, remainingDmg);
                nextTemp -= absorbed;
                remainingDmg -= absorbed;
            }
            const nextCur = Math.max(0, cur - remainingDmg);
            OBR.notification.show(`Took ${amount} damage (${nextCur}/${max})`, "WARNING");

            if (concentrationSpell && amount > 0) {
                const conDC = Math.max(10, Math.floor(amount / 2));
                OBR.notification.show(`Concentrating on "${concentrationSpell.name}"! Roll CON Save DC ${conDC}.`, "WARNING");
            }
            return { current: nextCur, max, temp: nextTemp };
        });
    };

    // Toggle expand description
    const toggleExpandFeature = (id: string) => {
        setExpandedFeatures(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const casterAvatarUrl = syncedDdbChar?.avatarUrl
        || (caster?.item && isImage(caster.item) ? caster.item.image.url : `${window.location.origin}/embers.svg`);
    const casterName = syncedDdbChar?.name
        || (caster?.name && caster.name !== "Caster" ? caster.name : (caster?.isDM ? "Dungeon Master" : "Caster"));

    const weaponsList = (syncedDdbChar?.weapons && syncedDdbChar.weapons.length > 0)
        ? syncedDdbChar.weapons
        : DEFAULT_WEAPONS;

    // Helper to match text against actionSearch
    const matchesActionSearch = (text?: string) => {
        if (!actionSearch.trim()) return true;
        if (!text) return false;
        return text.toLowerCase().includes(actionSearch.trim().toLowerCase());
    };

    // Filtered Weapons
    const filteredWeapons = weaponsList.filter(w => {
        if (!matchesActionSearch(w.name) && !matchesActionSearch(w.type) && !matchesActionSearch(w.damageType) && !w.properties.some(p => matchesActionSearch(p))) {
            return false;
        }
        return true;
    });

    // Helper to check if an action/feature name matches a spell in dockSpells
    const isSpellName = (name: string) => {
        const clean = name.toLowerCase().trim();
        return dockSpells.some(s => s.name.toLowerCase().trim() === clean);
    };

    // Direct Attack Spells (has attack roll: e.g. "+6")
    const attackSpells = dockSpells.filter(s => {
        const hasAttack = Boolean(s.hitOrDc && s.hitOrDc.startsWith("+"));
        if (!hasAttack) return false;
        return matchesActionSearch(s.name) || matchesActionSearch(s.damageType) || matchesActionSearch(s.notes);
    });

    // 1-Action Spells
    const actionSpells = dockSpells.filter(s => {
        const ct = s.castingTime.toLowerCase().trim();
        const isAction = (ct.includes("action") || ct === "1a" || ct === "a") && !ct.includes("bonus") && !ct.includes("reaction");
        if (!isAction) return false;
        return matchesActionSearch(s.name) || matchesActionSearch(s.damageType) || matchesActionSearch(s.notes);
    });

    // Bonus Action Spells
    const bonusActionSpells = dockSpells.filter(s => {
        const ct = s.castingTime.toLowerCase().trim();
        const isBA = ct.includes("bonus") || ct === "1ba" || ct === "ba";
        if (!isBA) return false;
        return matchesActionSearch(s.name) || matchesActionSearch(s.damageType) || matchesActionSearch(s.notes);
    });

    // Reaction Spells
    const reactionSpells = dockSpells.filter(s => {
        const ct = s.castingTime.toLowerCase().trim();
        const isReaction = ct.includes("reaction") || ct === "1r" || ct === "r";
        if (!isReaction) return false;
        return matchesActionSearch(s.name) || matchesActionSearch(s.damageType) || matchesActionSearch(s.notes);
    });

    const characterFeatures = useMemo(
        () => syncedDdbChar ? getCharacterFeatures(syncedDdbChar) : [],
        [syncedDdbChar]
    );

    // Action Features (1 Action) - exclude any feature that duplicates a spell
    const actionFeatures = characterFeatures.filter(a => {
        if (a.activationType !== "action") return false;
        if (isSpellName(a.name)) return false;
        if (a.name.toLowerCase().includes("circle spell") || a.name.toLowerCase().includes("initiate a circle spell")) return false;
        return matchesActionSearch(a.name) || matchesActionSearch(a.description);
    });

    // Bonus Action Features - exclude any feature that duplicates a spell
    const bonusActionFeatures = characterFeatures.filter(a => {
        if (a.activationType !== "bonus") return false;
        if (isSpellName(a.name)) return false;
        if (a.name.toLowerCase().includes("circle spell") || a.name.toLowerCase().includes("initiate a circle spell")) return false;
        return matchesActionSearch(a.name) || matchesActionSearch(a.description);
    });

    // Reaction Features - exclude any feature that duplicates a spell
    const reactionFeatures = characterFeatures.filter(a => {
        if (a.activationType !== "reaction") return false;
        if (isSpellName(a.name)) return false;
        return matchesActionSearch(a.name) || matchesActionSearch(a.description);
    });

    // Other/Special Features
    const otherFeatures = characterFeatures.filter(a => {
        if (a.activationType !== "special" && a.activationType !== "none") return false;
        if (a.name.toLowerCase().includes("circle spell") || a.name.toLowerCase().includes("initiate a circle spell")) return false;
        return matchesActionSearch(a.name) || matchesActionSearch(a.description);
    });

    // Limited Use Features
    const limitedUseFeatures = characterFeatures.filter(a => {
        if (!a.limitedUse || a.limitedUse.max <= 0) return false;
        if (a.name.toLowerCase().includes("circle spell") || a.name.toLowerCase().includes("initiate a circle spell")) return false;
        return matchesActionSearch(a.name) || matchesActionSearch(a.description);
    });

    // Filtered Combat Actions
    const filteredCombatActions = COMBAT_ACTIONS.filter(act =>
        matchesActionSearch(act.name) || matchesActionSearch(act.description)
    );

    const activeFlyoutFeature = useMemo(() => {
        if (!activeFlyoutFeatureId) return null;
        return characterFeatures.find(f => f.id === activeFlyoutFeatureId) || null;
    }, [activeFlyoutFeatureId, characterFeatures]);

    const activeFlyoutFeatureData = useMemo<BG3FlyoutFeatureData | null>(() => {
        if (!activeFlyoutFeature) return null;
        const kind = getFeatureFlyoutKind(activeFlyoutFeature);
        if (!kind) return null;

        const sorcererLevel = syncedDdbChar?.classes
            .filter(c => c.name.toLowerCase().includes("sorcerer"))
            .reduce((sum, c) => sum + c.level, 0) || 0;
        const paladinLevel = syncedDdbChar?.classes
            .filter(c => c.name.toLowerCase().includes("paladin"))
            .reduce((sum, c) => sum + c.level, 0) || 0;
        const wizardLevel = syncedDdbChar?.classes
            .filter(c => c.name.toLowerCase().includes("wizard"))
            .reduce((sum, c) => sum + c.level, 0) || 0;

        const pb = syncedDdbChar?.proficiencyBonus || 2;
        const used = featureUses[activeFlyoutFeature.id] ?? (activeFlyoutFeature.limitedUse?.used || 0);

        const resourceCalc = computeClassFeatureResource({
            kind,
            character: syncedDdbChar,
            feature: activeFlyoutFeature,
            featureUses
        });

        const maxPoints = resourceCalc.maxPoints;
        const resourceName = resourceCalc.resourceName;

        if (kind === "metamagic") {
            const fontFeat = characterFeatures.find(f => f.name.toLowerCase().includes("font of magic"));
            if (fontFeat) {
                const fontUsed = featureUses[fontFeat.id] ?? (fontFeat.limitedUse?.used || 0);
                const fontMax = fontFeat.limitedUse?.max || sorcererLevel;
                return {
                    id: activeFlyoutFeature.id,
                    name: activeFlyoutFeature.name,
                    kind,
                    resourceName: "Sorcery Points",
                    availablePoints: Math.max(0, fontMax - fontUsed),
                    maxPoints: fontMax,
                    sorcererLevel,
                    spellSlots,
                    pactSlots: syncedDdbChar?.pactMagic ? {
                        max: pactSlots.max,
                        used: pactSlots.used,
                        level: syncedDdbChar.pactMagic.level
                    } : undefined,
                    onSpendResourceAction: (actionName, cost, details, actionType) => {
                        const newUsed = fontUsed + cost;
                        setFeatureUses(prev => ({ ...prev, [fontFeat.id]: newUsed }));
                        if (actionType === "bonus") {
                            setBonusActionUsed(true);
                        } else if (actionType === "action") {
                            setActionUsed(true);
                        }
                        OBR.notification.show(`Used ${actionName} (${cost} SP). ${details || ""}`, "SUCCESS");
                    }
                };
            }
        }

        const availablePoints = resourceCalc.availablePoints;

        return {
            id: activeFlyoutFeature.id,
            name: activeFlyoutFeature.name,
            kind,
            resourceName,
            availablePoints,
            maxPoints,
            sorcererLevel,
            paladinLevel,
            wizardLevel,
            proficiencyBonus: pb,
            spellSlots,
            pactSlots: syncedDdbChar?.pactMagic ? {
                max: pactSlots.max,
                used: pactSlots.used,
                level: syncedDdbChar.pactMagic.level
            } : undefined,
            onConvertSlotToResource: (slotLevel, isPact) => {
                handleConvertSlotToSorceryPoints(slotLevel, Boolean(isPact), activeFlyoutFeature.id);
            },
            onCreateSpellSlot: (slotLevel, cost, minLevel) => {
                handleCreateSorcererSpellSlot(slotLevel, cost, minLevel, activeFlyoutFeature.id);
            },
            onRegainExpendedSlot: (slotLevel) => {
                setSpellSlots(prev => {
                    const s = prev[slotLevel];
                    if (!s || s.used <= 0) return prev;
                    return {
                        ...prev,
                        [slotLevel]: { ...s, used: s.used - 1 }
                    };
                });
                setFeatureUses(prev => ({
                    ...prev,
                    [activeFlyoutFeature.id]: used + 1
                }));
                OBR.notification.show(`Regained a level ${slotLevel} spell slot using ${activeFlyoutFeature.name}.`, "SUCCESS");
            },
            onSpendResourceAction: (actionName, cost, details, actionType) => {
                setFeatureUses(prev => ({
                    ...prev,
                    [activeFlyoutFeature.id]: used + cost
                }));
                if (actionType === "bonus") {
                    setBonusActionUsed(true);
                } else if (actionType === "action") {
                    setActionUsed(true);
                }
                OBR.notification.show(`Activated ${actionName} (spent ${cost} ${resourceName}). ${details || ""}`, "SUCCESS");
            }
        };
    }, [
        activeFlyoutFeature,
        characterFeatures,
        syncedDdbChar,
        featureUses,
        spellSlots,
        pactSlots,
        handleConvertSlotToSorceryPoints,
        handleCreateSorcererSpellSlot
    ]);

    // Filter spells for Tab 2: SPELLS
    const filteredAllSpells = dockSpells.filter(s => {
        if (spellsFilter === "0") return s.level === 0;
        if (spellsFilter === "1") return s.level === 1;
        if (spellsFilter === "2") return s.level === 2;
        if (spellsFilter === "PACT") return s.fromChar && s.level === (syncedDdbChar?.pactMagic?.level || 2);
        if (spellsFilter === "3+") return s.level >= 3;
        return true;
    }).filter(s => {
        if (!spellSearch) return true;
        return s.name.toLowerCase().includes(spellSearch.toLowerCase());
    });

    // Group spells by level for D&D Beyond hierarchical grouping
    const spellGroups = useMemo(() => {
        const groups: Array<{ label: string; level: number; spells: typeof dockSpells }> = [];
        const cantrips = filteredAllSpells.filter(s => s.level === 0);
        if (cantrips.length > 0) groups.push({ label: "CANTRIP", level: 0, spells: cantrips });

        for (let lvl = 1; lvl <= 9; lvl++) {
            const lvlSpells = filteredAllSpells.filter(s => s.level === lvl);
            if (lvlSpells.length > 0) {
                groups.push({ label: `${getOrdinal(lvl).toUpperCase()} LEVEL`, level: lvl, spells: lvlSpells });
            }
        }
        return groups;
    }, [filteredAllSpells]);

    // Filter features for Tab 3: FEATURES & TRAITS
    const featuresList: DDBFeatureAction[] = characterFeatures.filter(
        f => !f.name.toLowerCase().includes("circle spell") && !f.name.toLowerCase().includes("initiate a circle spell")
    );
    const filteredFeatures = featuresList.filter(f => {
        if (featuresFilter === "ALL") return true;
        if (featuresFilter === "CLASS") return f.source === "class";
        if (featuresFilter === "SPECIES") return f.source === "race";
        if (featuresFilter === "FEATS") return f.source === "feat";
        return true;
    });

    // Filter inventory for Tab: INVENTORY
    const attunedCount = useMemo(() => {
        return (syncedDdbChar?.inventory || []).filter(i => i.isAttuned).length;
    }, [syncedDdbChar?.inventory]);

    const handleToggleItemAttunement = (item: import("../../types/ddb").DDBInventoryItem) => {
        if (!syncedDdbChar) return;
        const currentAttuned = syncedDdbChar.inventory?.filter(i => i.isAttuned).length ?? 0;
        const willAttune = !item.isAttuned;

        if (willAttune && currentAttuned >= 3) {
            OBR.notification.show("Cannot attune: 3 of 3 attunement slots are already in use!", "WARNING");
            return;
        }

        const updatedInventory = (syncedDdbChar.inventory || []).map(i => {
            if (i.id === item.id) {
                return { ...i, isAttuned: willAttune };
            }
            return i;
        });

        const newAttunedCount = updatedInventory.filter(i => i.isAttuned).length;
        const updatedChar: DDBParsedCharacter = {
            ...syncedDdbChar,
            inventory: updatedInventory,
            attunement: { current: newAttunedCount, max: 3 }
        };

        setSyncedDdbChar(updatedChar);
        cacheDDBCharacter(updatedChar);

        if (drawerItem && drawerItem.type === "item" && drawerItem.item.id === item.id) {
            setDrawerItem({ ...drawerItem, item: { ...drawerItem.item, isAttuned: willAttune } });
        }

        OBR.notification.show(
            willAttune
                ? `${item.name} is now Attuned (${newAttunedCount}/3 slots)`
                : `${item.name} is now Unattuned (${newAttunedCount}/3 slots)`,
            "INFO"
        );
    };

    const filteredInventory = useMemo(() => {
        const items = syncedDdbChar?.inventory || [];
        return items.filter(item => {
            if (inventoryFilter === "EQUIPPED" && !item.equipped) return false;
            if (inventoryFilter === "ATTUNED" && !item.isAttuned && !item.canAttune) return false;
            if (inventoryFilter === "WEAPONS" && item.type?.toLowerCase() !== "weapon") return false;
            if (inventoryFilter === "ARMOR" && !item.type?.toLowerCase().includes("armor") && !item.type?.toLowerCase().includes("shield")) return false;
            if (inventoryFilter === "GEAR" && (item.type?.toLowerCase() === "weapon" || item.type?.toLowerCase().includes("armor"))) return false;

            if (inventorySearch.trim()) {
                const q = inventorySearch.trim().toLowerCase();
                return item.name.toLowerCase().includes(q) || (item.type || "").toLowerCase().includes(q) || (item.description || "").toLowerCase().includes(q);
            }
            return true;
        });
    }, [syncedDdbChar?.inventory, inventoryFilter, inventorySearch]);

    const totalInventoryWeight = useMemo(() => {
        const items = syncedDdbChar?.inventory || [];
        return items.reduce((acc, i) => acc + (i.weight * i.quantity), 0);
    }, [syncedDdbChar?.inventory]);
    const maxCarryWeight = (syncedDdbChar?.stats?.str ?? 10) * 15;

    // Resources tracker at the top (Class features, Feats like Lucky / Channeled Attack, Species traits, etc.)
    const characterResources = useMemo(() => {
        if (!syncedDdbChar) return [];
        const seenKeys = new Set<string>();
        return characterFeatures.filter(a => {
            if (!a.limitedUse || a.limitedUse.max <= 0) return false;
            // Include class resources, feat resources (Lucky, Channeled Attack, etc.), and species/race resources
            if (!(a.source === "class" || a.source === "feat" || a.source === "race")) return false;

            const norm = a.name.toLowerCase().replace(/[^a-z0-9]/g, "");
            const dedupKey = norm.includes("luck") ? "luck" :
                norm.includes("sorcerypoint") || norm.includes("fontofmagic") ? "sorcerypoint" :
                norm.includes("innatesorcery") ? "innatesorcery" :
                norm.includes("focuspoint") || norm.includes("kipoint") ? "focuspoint" :
                norm.includes("layonhands") ? "layonhands" :
                norm.includes("channeldivinity") ? "channeldivinity" :
                a.id || norm;

            if (seenKeys.has(dedupKey)) return false;
            seenKeys.add(dedupKey);
            return true;
        });
    }, [syncedDdbChar, characterFeatures]);

    function getResourceBadge(name: string, source?: string): { label: string; theme: string } {
        const lower = name.toLowerCase();
        // Class resources
        if (lower.includes("focus") || lower.includes("ki")) return { label: "KI", theme: "ki" };
        if (lower.includes("sorcery point") || lower.includes("font of magic")) return { label: "SORC", theme: "sorcery" };
        if (lower.includes("rage")) return { label: "RAGE", theme: "rage" };
        if (lower.includes("bardic inspiration")) return { label: "BARDIC", theme: "bard" };
        if (lower.includes("wild shape")) return { label: "WILD", theme: "druid" };
        if (lower.includes("channel divinity")) return { label: "DIVINE", theme: "divine" };
        if (lower.includes("action surge")) return { label: "SURGE", theme: "fighter" };
        if (lower.includes("second wind")) return { label: "WIND", theme: "fighter" };
        if (lower.includes("innate sorcery")) return { label: "INNATE", theme: "sorcery" };
        if (lower.includes("uncanny metabolism")) return { label: "METAB", theme: "ki" };
        if (lower.includes("magical cunning")) return { label: "CUNNING", theme: "warlock" };
        if (lower.includes("lay on hands")) return { label: "HANDS", theme: "divine" };

        // Feat resources
        if (lower.includes("luck")) return { label: "LUCK", theme: "luck" };
        if (lower.includes("channeled attack") || lower.includes("channeled")) return { label: "CHANNEL", theme: "channeled" };
        if (lower.includes("fey step")) return { label: "FEY", theme: "druid" };
        if (lower.includes("breath weapon")) return { label: "BREATH", theme: "rage" };
        if (lower.includes("healing hands")) return { label: "HEAL", theme: "divine" };
        if (lower.includes("inspiring leader")) return { label: "LEADER", theme: "bard" };

        // Source-based fallback theme
        const featTheme = source === "feat" ? "feat" : source === "race" ? "druid" : "generic";
        const clean = name.replace(/[^a-zA-Z0-9\s]/g, "").trim().split(/\s+/)[0].slice(0, 7).toUpperCase();
        return { label: clean || "RES", theme: featTheme };
    }

    const romanNumerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"];
    const spellAttackBonus = syncedDdbChar?.spellAttackBonus ?? 0;
    const spellAbility = syncedDdbChar?.spellCastingAbility ?? "CHA";
    const abilityModifier = syncedDdbChar?.modifiers ? (syncedDdbChar.modifiers[abilityModifierKey(spellAbility)] ?? 0) : 0;

    const currentHpVal = customHp ? customHp.current : (syncedDdbChar?.hp?.current ?? 0);
    const maxHpVal = customHp ? customHp.max : (syncedDdbChar?.hp?.max ?? 0);

    function abilityModifierKey(ability: string): "str" | "dex" | "con" | "int" | "wis" | "cha" {
        const lower = ability.toLowerCase();
        if (lower.startsWith("str")) return "str";
        if (lower.startsWith("dex")) return "dex";
        if (lower.startsWith("con")) return "con";
        if (lower.startsWith("int")) return "int";
        if (lower.startsWith("wis")) return "wis";
        return "cha";
    }

    const renderWeaponRow = (weapon: DDBWeaponAttack) => {
        const activeRider = activeRiderMap[weapon.id];
        const parsedRiders = (weapon.cantripRiders || []).map(parseRiderString);

        return (
            <tr
                key={weapon.id}
                className="ddb-table-row weapon-row"
                onClick={() => {
                    handleSelectWeapon(weapon, "melee");
                    setDrawerItem({ type: "weapon", weapon });
                }}
                title="Click to aim with weapon & view details"
            >
                <td className="td-attack">
                    <div className="ddb-weapon-cell">
                        <span className="ddb-mini-weapon-badge">
                            {getWeaponIcon(weapon.name, weapon.type, 13)}
                        </span>
                        <span className="ddb-weapon-name">{weapon.name}</span>
                        {weapon.type && (
                            <span className="ddb-weapon-tag">{weapon.type}</span>
                        )}
                    </div>
                </td>
                <td className="td-range" onClick={e => e.stopPropagation()}>
                    {weapon.hasThrown ? (
                        <div className="ddb-range-stacked">
                            <button
                                type="button"
                                className="ddb-range-badge reach"
                                onClick={() => handleSelectWeapon(weapon, "melee")}
                                title="Melee Reach (5 ft.) - Click to Aim"
                            >
                                5 ft. Reach
                            </button>
                            <button
                                type="button"
                                className="ddb-range-badge thrown"
                                onClick={() => handleSelectWeapon(weapon, "thrown")}
                                title={`Thrown Range (${weapon.thrownRange || 20}/${weapon.thrownLongRange || 60} ft.) - Click to Aim`}
                            >
                                {weapon.thrownRange || 20} ({weapon.thrownLongRange || 60})
                            </button>
                        </div>
                    ) : (
                        <span
                            className="ddb-range-clickable"
                            onClick={() => handleSelectWeapon(weapon, "melee")}
                            title="Melee Reach (5 ft.) - Click to Aim"
                        >
                            {weapon.rangeText}
                        </span>
                    )}
                </td>
                <td className="td-hit" onClick={e => e.stopPropagation()}>
                    <button
                        type="button"
                        className="ddb-roll-pill hit-pill"
                        onClick={() => handleWeaponAttackRoll(weapon)}
                        title={`Roll Attack: 1d20 + ${weapon.toHit}`}
                    >
                        <IconDiceD20 size={11} />
                        <span>+{weapon.toHit}</span>
                    </button>
                </td>
                <td className="td-damage" onClick={e => e.stopPropagation()}>
                    <button
                        type="button"
                        className="ddb-roll-pill dmg-pill"
                        onClick={() => handleWeaponDamageRoll(weapon, activeRider)}
                        title={`Roll Damage: ${weapon.damage} ${weapon.damageType}${activeRider ? ` (+ ${activeRider})` : ""}`}
                    >
                        <IconFire size={11} />
                        <span>{weapon.damage}</span>
                        <span className="ddb-type-text">{weapon.damageType}</span>
                    </button>
                </td>
                <td className="td-notes" onClick={e => e.stopPropagation()}>
                    {weapon.properties.length > 0 && (
                        <span className="ddb-prop-list">
                            {weapon.properties.join(", ")}
                        </span>
                    )}
                    {parsedRiders.length > 0 && (
                        <div className="ddb-rider-chips-wrap">
                            {parsedRiders.map((r, idx) => {
                                const isSelected = activeRider === r.name;
                                return (
                                    <button
                                        key={idx}
                                        type="button"
                                        className={`ddb-rider-pill ${isSelected ? "selected" : ""}`}
                                        onClick={() => handleRiderClick(weapon, r)}
                                        title={`Add ${r.name} (${r.damage}): Click to roll combined damage & target with spell`}
                                    >
                                        <span className="rider-icon">{r.icon}</span>
                                        <span className="rider-label">{r.name}: {r.damage}</span>
                                        {r.moveTrigger && (
                                            <span className="rider-trigger">({r.moveTrigger})</span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </td>
            </tr>
        );
    };

    const renderAttackSpellRow = (spell: typeof dockSpells[0]) => {
        const isSelected = selectedSpell === spell.id;
        const meta = getSpellMetadata(spell.id, spell.name);
        const schoolStyle = getSchoolStyle(meta.school);
        const initials = getSpellInitials(meta.name);
        const isUpcastable = isSpellUpcastable(spell.id, meta);
        const chosenDamageType = spellDamageTypeOverrides[spell.id] ?? spell.damageType;

        return (
            <React.Fragment key={spell.id}>
                <tr
                    className={`ddb-table-row spell-row ${isSelected ? "selected" : ""}`}
                    onClick={() => {
                        handleSelectSpell(spell.id);
                        setDrawerItem({ type: "spell", spell });
                    }}
                    onContextMenu={e => {
                        e.preventDefault();
                        openSpellDetailModal(spell.id);
                    }}
                >
                    <td className="td-attack">
                        <div className="ddb-spell-cell">
                            <span
                                className="ddb-mini-school-badge"
                                style={{ borderColor: schoolStyle.color, color: schoolStyle.color }}
                            >
                                <img
                                    src={schoolStyle.iconUrl || `https://media.dndbeyond.com/media/spell-school-icons/${(meta.school || spell.school || "evocation").toLowerCase()}.svg`}
                                    alt=""
                                    className="ddb-mini-school-svg"
                                    onError={(e) => {
                                        e.currentTarget.style.display = "none";
                                        if (e.currentTarget.parentElement) {
                                            e.currentTarget.parentElement.innerText = initials;
                                        }
                                    }}
                                />
                            </span>
                            <span className="ddb-spell-title">{spell.name}</span>
                            {isUpcastable && <span className="ddb-upcast-tag">+</span>}
                        </div>
                    </td>
                    <td className="td-range">{spell.rangeText}</td>
                    <td className="td-hit">
                        {spell.hitOrDc ? (
                            <button
                                type="button"
                                className="ddb-roll-pill hit-pill"
                                onClick={e => {
                                    e.stopPropagation();
                                    handleSpellAttackRoll(spell);
                                }}
                                title={`Roll or Announce: ${spell.hitOrDc}`}
                            >
                                <span>{spell.hitOrDc}</span>
                            </button>
                        ) : (
                            <span className="ddb-na-dash">—</span>
                        )}
                    </td>
                    <td className="td-damage">
                        {spell.damage ? (
                            <button
                                type="button"
                                className="ddb-roll-pill dmg-pill"
                                onClick={e => {
                                    e.stopPropagation();
                                    handleSpellDamageRoll(spell);
                                }}
                                title={`Roll Damage: ${spell.damage} ${chosenDamageType || ""}`}
                            >
                                <IconFire size={11} />
                                <span>{spell.damage}</span>
                                {chosenDamageType && (
                                    <span className="ddb-type-text">{chosenDamageType}</span>
                                )}
                            </button>
                        ) : (
                            <span className="ddb-na-dash">—</span>
                        )}
                    </td>
                    <td className="td-notes">
                        <div className="ddb-notes-cell">
                            <span>{spell.notes}</span>
                            <button
                                type="button"
                                className="ddb-cast-action-btn"
                                onClick={e => {
                                    e.stopPropagation();
                                    handleOpenUpcastPicker(spell);
                                }}
                                title={`Cast ${spell.name} on OBR`}
                            >
                                <IconCastLightning size={12} />
                                <span>{upcastPickerSpellId === spell.id ? "Close" : "Cast"}</span>
                            </button>
                        </div>
                    </td>
                </tr>
                {upcastPickerSpellId === spell.id && renderUpcastPickerRow(spell, 5)}
            </React.Fragment>
        );
    };

    const renderFeatureCard = (feat: DDBFeatureAction) => {
        const usedCount = featureUses[feat.id] ?? (feat.limitedUse?.used ?? 0);
        const maxUses = feat.limitedUse?.max ?? 0;
        const featLower = feat.name.toLowerCase();
        const canBeActivated = isActivatableBuffFeature(feat.name);
        const isBuffActive = activeBuffs.some(b => b.name.toLowerCase() === featLower || b.id === feat.id || (b.id === "innate_sorcery" && featLower.includes("innate sorcery")));
        const flyoutKind = getFeatureFlyoutKind(feat);

        return (
            <div
                key={feat.id}
                className={`ddb-action-category-block feature-block ${isBuffActive ? "buff-active-card" : ""} ${activeFlyoutFeatureId === feat.id ? "flyout-active-card" : ""}`}
                onClick={() => {
                    if (flyoutKind) {
                        setUpcastPickerSpellId(null);
                        setActiveFlyoutFeatureId(prev => prev === feat.id ? null : feat.id);
                    } else {
                        setDrawerItem({
                            type: "feature",
                            id: feat.id,
                            name: feat.name,
                            description: feat.description || "",
                            rawDescription: feat.rawDescription,
                            category: feat.source === "class" ? "Class Feature" : feat.source === "feat" ? "Feat" : "Racial Trait",
                            activationType: feat.activationType,
                            limitedUse: feat.limitedUse
                        });
                    }
                }}
                onContextMenu={e => {
                    e.preventDefault();
                    setDrawerItem({
                        type: "feature",
                        id: feat.id,
                        name: feat.name,
                        description: feat.description || "",
                        rawDescription: feat.rawDescription,
                        category: feat.source === "class" ? "Class Feature" : feat.source === "feat" ? "Feat" : "Racial Trait",
                        activationType: feat.activationType,
                        limitedUse: feat.limitedUse
                    });
                }}
                title={flyoutKind ? "Click to open interactive flyout (Right-click for drawer)" : "Click to view details in drawer"}
            >
                <div className="ddb-feature-header-row">
                    <div className="ddb-feature-title-block">
                        <div className="ddb-feature-title-action-row">
                            <h4 className="ddb-category-block-title feature-title">{feat.name}</h4>
                            {canBeActivated && (
                                <button
                                    type="button"
                                    className={`ddb-feature-activate-btn ${isBuffActive ? "active" : ""}`}
                                    aria-pressed={isBuffActive}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleActivateFeature(feat);
                                    }}
                                    title={isBuffActive ? `Active: Click to deactivate ${feat.name}` : `Click to activate ${feat.name}`}
                                >
                                    {isBuffActive ? "Active" : "Activate"}
                                </button>
                            )}
                        </div>
                        <span className="ddb-feature-source-badge">{feat.source.toUpperCase()}</span>
                    </div>
                </div>
                <p className="ddb-feature-description">{feat.description}</p>
                {maxUses > 0 && (
                    <div className="ddb-feature-use-boxes" onClick={e => e.stopPropagation()}>
                        {Array.from({ length: maxUses }).map((_, boxIdx) => (
                            <button
                                key={boxIdx}
                                type="button"
                                className={`ddb-square-use-box ${boxIdx < usedCount ? "checked" : ""}`}
                                onClick={() => handleToggleFeatureBox(feat, boxIdx)}
                                title={`Use ${boxIdx + 1} of ${maxUses}`}
                            />
                        ))}
                        <span className="ddb-reset-label">/ {feat.limitedUse?.resetType || "Long Rest"}</span>
                    </div>
                )}
            </div>
        );
    };

    // =========================================================
    // BG3 ACTION CARDS GRID HELPERS
    // =========================================================
    const handleToggleViewMode = (mode: "grid" | "table") => {
        setViewMode(mode);
        try {
            localStorage.setItem("embers:action-dock-view", mode);
        } catch {}
    };
    const renderBg3SpellCard = (spell: typeof dockSpells[0], index: number) => {
        const isSelected = selectedSpell === spell.id;
        const meta = getSpellMetadata(spell.id, spell.name);
        const schoolStyle = getSchoolStyle(meta?.school || spell.school);
        const schoolColor = schoolStyle?.color || "#c9a66b";
        const schoolIcon = schoolStyle?.iconUrl;
        const subtitle = spell.level === 0 ? "Cantrip" : `${getOrdinal(spell.level)} Level ${meta?.school || spell.school || "Spell"}`;
        const details = [spell.castingTime, spell.rangeText, spell.damage && `${spell.damage} ${spellDamageTypeOverrides[spell.id] ?? spell.damageType ?? ""}`, spell.hitOrDc].filter(Boolean) as string[];
        const description = (spell as typeof spell & { rawDdbSpell?: DDBParsedSpell }).rawDdbSpell?.description || spell.notes;

        return (
            <ActionGridTile
                key={spell.id}
                name={spell.name}
                category={spell.level === 0 ? "Cantrip" : "Spell"}
                subtitle={subtitle}
                details={details}
                description={description}
                accent={schoolColor}
                shortcut={index + 1}
                selected={isSelected}
                icon={schoolIcon ? (
                    <img
                        src={schoolIcon}
                        alt=""
                        className="ddb-bg3-icon-tile-school"
                        loading="lazy"
                        onError={event => { event.currentTarget.style.visibility = "hidden"; }}
                    />
                ) : <span className="ddb-bg3-icon-tile-initials">{getSpellInitials(spell.name)}</span>}
                onActivate={() => {
                    const choices = getSpellChoices(spell);
                    const isLeveled = spell.level > 0;
                    const isHex = spell.name.toLowerCase() === "hex" || spell.id.toLowerCase() === "hex";
                    if (isLeveled || choices || isHex) {
                        handleOpenUpcastPicker(spell);
                    } else {
                        handleSelectSpell(spell.id);
                    }
                }}
                onContextMenu={event => {
                    event.preventDefault();
                    openSpellDetailModal(spell.id);
                }}
            />
        );
    };

    const renderBg3WeaponCard = (weapon: DDBWeaponAttack, index: number) => {
        return <ActionGridTile
            key={weapon.id}
            name={weapon.name}
            category={"Weapon"}
            subtitle={weapon.type || "Attack"}
            details={[`+${weapon.toHit} to hit`, weapon.damage, weapon.damageType, weapon.rangeText].filter(Boolean) as string[]}
            icon={getWeaponIcon(weapon.name, weapon.type, 24)}
            accent="#62c982"
            shortcut={index + 1}
            onActivate={() => handleSelectWeapon(weapon, "melee")}
            onContextMenu={event => {
                event.preventDefault();
                setDrawerItem({ type: "weapon", weapon });
            }}
        />;
    };

    const renderBg3FeatureCard = (feat: DDBFeatureAction, index: number) => {
        const isBonus = feat.activationType === "bonus";
        const isReaction = feat.activationType === "reaction";
        const maxUses = feat.limitedUse?.max || 0;
        const usedCount = featureUses[feat.id] ?? (feat.limitedUse?.used || 0);
        const flyoutKind = getFeatureFlyoutKind(feat);

        return <ActionGridTile
                key={feat.id}
                name={feat.name}
                category={feat.source === "class" ? "Class Feature" : feat.source === "feat" ? "Feat" : "Species Trait"}
                subtitle={feat.activationType === "bonus" ? "Bonus Action" : feat.activationType === "reaction" ? "Reaction" : "Action"}
                details={[feat.rangeText || "Self", maxUses > 0 ? `${maxUses - usedCount}/${maxUses} uses` : "At will", feat.limitedUse?.resetType].filter(Boolean) as string[]}
                description={feat.description}
                icon={<GemAction expended={false} />}
                accent={isBonus ? "#d1a75e" : isReaction ? "#65b5d6" : "#62c982"}
                shortcut={index + 1}
                selected={activeFlyoutFeatureId === feat.id}
                onActivate={() => {
                    if (flyoutKind) {
                        setUpcastPickerSpellId(null);
                        setActiveFlyoutFeatureId(prev => prev === feat.id ? null : feat.id);
                    } else {
                        setDrawerItem({
                            type: "feature",
                            id: feat.id,
                            name: feat.name,
                            category: feat.source === "class" ? "Class Feature" : feat.source === "feat" ? "Feat" : "Species Trait",
                            activationType: feat.activationType,
                            rangeText: feat.rangeText,
                            description: feat.description,
                            rawDescription: feat.rawDescription,
                            limitedUse: feat.limitedUse
                        });
                    }
                }}
                onContextMenu={event => {
                    event.preventDefault();
                    setDrawerItem({
                        type: "feature",
                        id: feat.id,
                        name: feat.name,
                        category: feat.source === "class" ? "Class Feature" : feat.source === "feat" ? "Feat" : "Species Trait",
                        activationType: feat.activationType,
                        rangeText: feat.rangeText,
                        description: feat.description,
                        rawDescription: feat.rawDescription,
                        limitedUse: feat.limitedUse
                    });
                }}
            />;
    };

    const renderBg3CombatActionCard = (act: { name: string; description: string }, index: number) => {
        return <ActionGridTile
                key={act.name}
                name={act.name}
                category="Combat Action"
                subtitle="Action"
                description={act.description}
                icon={<IconDashMovement size={24} />}
                accent="#62c982"
                shortcut={index + 1}
                onActivate={() => setDrawerItem({
                    type: "feature",
                    id: `act_${act.name.toLowerCase()}`,
                    name: act.name,
                    description: act.description,
                    category: "Actions in Combat",
                    activationType: "action"
                })}
            />;
    };

    const renderBg3GridContent = () => {
        if (mainTab === "ACTIONS") {
            const sections: Array<{ title: string; items: React.ReactNode[] }> = [];
            let cardIdx = 0;
            const displayedNames = new Set<string>();

            const addWeapon = (items: React.ReactNode[], w: DDBWeaponAttack) => {
                const key = `weapon:${w.id || w.name}`.toLowerCase();
                if (displayedNames.has(key)) return;
                displayedNames.add(key);
                items.push(renderBg3WeaponCard(w, cardIdx++));
            };

            const addSpell = (items: React.ReactNode[], s: typeof dockSpells[0]) => {
                const key = `spell:${s.name}`.toLowerCase().trim();
                if (displayedNames.has(key)) return;
                displayedNames.add(key);
                items.push(renderBg3SpellCard(s, cardIdx++));
            };

            const addFeature = (items: React.ReactNode[], f: DDBFeatureAction) => {
                const key = `feat:${f.name}`.toLowerCase().trim();
                if (displayedNames.has(key)) return;
                displayedNames.add(key);
                items.push(renderBg3FeatureCard(f, cardIdx++));
            };

            const addCombatAction = (items: React.ReactNode[], act: { name: string; description: string }) => {
                const key = `act:${act.name}`.toLowerCase().trim();
                if (displayedNames.has(key)) return;
                displayedNames.add(key);
                items.push(renderBg3CombatActionCard(act, cardIdx++));
            };

            const addSection = (title: string, addItems: (items: React.ReactNode[]) => void) => {
                const items: React.ReactNode[] = [];
                addItems(items);
                if (items.length > 0) sections.push({ title, items });
            };

            if (actionsFilter === "ALL" || actionsFilter === "ATTACK") {
                addSection("Attacks & Weapons", items => {
                    filteredWeapons.forEach(weapon => addWeapon(items, weapon));
                    attackSpells.forEach(spell => addSpell(items, spell));
                });
            }
            if (actionsFilter === "ALL" || actionsFilter === "ACTION") {
                addSection("Actions", items => {
                    actionSpells.forEach(spell => addSpell(items, spell));
                    actionFeatures.forEach(feature => addFeature(items, feature));
                });
            }
            if (actionsFilter === "ALL" || actionsFilter === "BONUS ACTION") {
                addSection("Bonus Actions", items => {
                    bonusActionSpells.forEach(spell => addSpell(items, spell));
                    bonusActionFeatures.forEach(feature => addFeature(items, feature));
                });
            }
            if (actionsFilter === "ALL" || actionsFilter === "REACTION") {
                addSection("Reactions", items => {
                    reactionSpells.forEach(spell => addSpell(items, spell));
                    reactionFeatures.forEach(feature => addFeature(items, feature));
                });
            }
            if (actionsFilter === "ALL" || actionsFilter === "OTHER") {
                addSection("Other", items => filteredCombatActions.forEach(action => addCombatAction(items, action)));
            }

            if (sections.length === 0) {
                return (
                    <div className="ddb-empty-search-state">
                        <IconSearch size={22} className="ddb-empty-search-icon" />
                        <span className="ddb-empty-search-text">No actions matching your filter</span>
                    </div>
                );
            }

            return <div className="ddb-bg3-grid-sections">
                {sections.map(section => (
                    <section className="ddb-bg3-grid-section" key={section.title} aria-label={section.title}>
                        <h3 className="ddb-bg3-grid-section-title">{section.title}</h3>
                        <div className="ddb-bg3-grid-container">{section.items}</div>
                    </section>
                ))}
            </div>;
        }

        if (mainTab === "SPELLS") {
            const seenSpellNames = new Set<string>();
            const spellsToShow = dockSpells.filter(s => {
                if (spellsFilter === "0" && s.level !== 0) return false;
                if (spellsFilter === "1" && s.level !== 1) return false;
                if (spellsFilter === "2" && s.level !== 2) return false;
                if (spellsFilter === "3+" && s.level < 3) return false;
                if (spellsFilter === "PACT") {
                    const pactLvl = syncedDdbChar?.pactMagic?.level;
                    if (!pactLvl || s.level !== pactLvl) return false;
                }
                const activeSearch = (spellSearch || actionSearch).trim().toLowerCase();
                if (activeSearch) {
                    const matches = s.name.toLowerCase().includes(activeSearch) ||
                        (s.damageType && s.damageType.toLowerCase().includes(activeSearch));
                    if (!matches) return false;
                }
                const nameKey = s.name.toLowerCase().trim();
                if (seenSpellNames.has(nameKey)) return false;
                seenSpellNames.add(nameKey);
                return true;
            });

            if (spellsToShow.length === 0) {
                return (
                    <div className="ddb-empty-search-state">
                        <IconSearch size={22} className="ddb-empty-search-icon" />
                        <span className="ddb-empty-search-text">No spells matching your filter</span>
                    </div>
                );
            }

            const spellLevels = [...new Set(spellsToShow.map(spell => spell.level))].sort((a, b) => a - b);
            let shortcut = 0;
            return <div className="ddb-bg3-grid-sections">
                {spellLevels.map(level => (
                    <section className="ddb-bg3-grid-section" key={level} aria-label={level === 0 ? "Cantrips" : `Level ${level} spells`}>
                        <h3 className="ddb-bg3-grid-section-title">{level === 0 ? "Cantrips" : `Level ${level}`}</h3>
                        <div className="ddb-bg3-grid-container">
                            {spellsToShow.filter(spell => spell.level === level).map(spell => renderBg3SpellCard(spell, shortcut++))}
                        </div>
                    </section>
                ))}
            </div>;
        }

        return null;
    };

    const renderTurnResourceBar = () => (
        <div id="ddb-turn-resource-tray" className={`ddb-turn-resource-bar ${isResourceTrayOpen ? "open" : ""}`}>
            <div className="ddb-gem-group" title="Turn Action Economy">
                <button type="button" className={`ddb-action-gem action ${actionUsed ? "expended" : ""}`} onClick={() => setActionUsed(!actionUsed)} title={`Action: ${actionUsed ? "Expended" : "Available"} (Click to toggle)`} aria-label="Action point">
                    <GemAction expended={actionUsed} />
                </button>
                <button type="button" className={`ddb-action-gem bonus ${bonusActionUsed ? "expended" : ""}`} onClick={() => setBonusActionUsed(!bonusActionUsed)} title={`Bonus Action: ${bonusActionUsed ? "Expended" : "Available"} (Click to toggle)`} aria-label="Bonus action point">
                    <GemBonusAction expended={bonusActionUsed} />
                </button>
            </div>
            {(characterResources.length > 0 || Object.values(spellSlots).some(slot => slot.max > 0) || pactSlots.max > 0) && (
                <>
                    <div className="ddb-top-strip-divider" />
                    <div className="ddb-deck-slots-group">
                        {characterResources.map(feat => {
                            const max = feat.limitedUse?.max || 0;
                            const used = featureUses[feat.id] ?? (feat.limitedUse?.used || 0);
                            const available = Math.max(0, max - used);
                            const { label, theme } = getResourceBadge(feat.name, feat.source);
                            const flyoutKind = getFeatureFlyoutKind(feat);
                            return (
                                <button
                                    key={feat.id}
                                    type="button"
                                    className={`ddb-slot-pill-btn resource-pill ${theme} ${activeFlyoutFeatureId === feat.id ? "active-flyout-pill" : ""}`}
                                    onClick={() => {
                                        if (flyoutKind) {
                                            setUpcastPickerSpellId(null);
                                            setActiveFlyoutFeatureId(prev => prev === feat.id ? null : feat.id);
                                        } else {
                                            toggleClassResource(feat);
                                        }
                                    }}
                                    onContextMenu={(e) => {
                                        e.preventDefault();
                                        toggleClassResource(feat);
                                    }}
                                    title={flyoutKind ? `${feat.name}: ${available}/${max} available\nClick to open flyout bar (Right-click to expend/restore)` : `${feat.name}: ${available}/${max} available\nClick to expend/restore`}
                                >
                                    <span className="ddb-slot-num">{label}</span>
                                    {max <= 6 ? (
                                        <div className="ddb-slot-pips-row">
                                            {Array.from({ length: max }).map((_, idx) => <div key={idx} className={`ddb-slot-dot ${theme} ${idx < available ? "filled" : "expended"}`} />)}
                                        </div>
                                    ) : <span className="ddb-resource-pool-text">{available}/{max}</span>}
                                    {used < 0 && <span className="ddb-resource-overcap">+{Math.abs(used)}</span>}
                                </button>
                            );
                        })}
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(level => {
                            const slot = spellSlots[level];
                            if (!slot || slot.max === 0) return null;
                            const available = slot.max - slot.used;
                            return (
                                <button key={level} type="button" className="ddb-slot-pill-btn" onClick={() => toggleSlotPip(level)} title={`Level ${level} Slots: ${available}/${slot.max} available\nClick to expend/restore`}>
                                    <span className="ddb-slot-num">{romanNumerals[level - 1]}</span>
                                    <div className="ddb-slot-pips-row">
                                        {Array.from({ length: slot.max }).map((_, idx) => <div key={idx} className={`ddb-slot-dot ${idx < available ? "filled" : "expended"}`} />)}
                                    </div>
                                </button>
                            );
                        })}
                        {pactSlots.max > 0 && (
                            <button type="button" className="ddb-slot-pill-btn pact-slot" onClick={togglePactPip} title={`Pact Magic Slots: ${pactSlots.max - pactSlots.used}/${pactSlots.max}\nClick to expend/restore`}>
                                <span className="ddb-slot-num">PACT</span>
                                <div className="ddb-slot-pips-row">
                                    {Array.from({ length: pactSlots.max }).map((_, idx) => <div key={idx} className={`ddb-slot-dot pact ${idx < (pactSlots.max - pactSlots.used) ? "filled" : "expended"}`} />)}
                                </div>
                            </button>
                        )}
                    </div>
                </>
            )}
        </div>
    );

    return (
        <div className="ddb-dock-outer-wrapper">
            {/* D&D Beyond Floating Custom Dice Launcher (on the grass in the red circle area) */}
            <button
                type="button"
                className={`ddb-floating-dice-launcher ${isDiceRollerOpen ? "active" : ""}`}
                onClick={() => setIsDiceRollerOpen(prev => !prev)}
                title="D&D Beyond Custom Dice Roller"
                aria-label="Toggle custom dice roller"
            >
                <IconDiceD20 size={20} />
            </button>

            {/* D&D Beyond Custom Dice Roller Tray */}
            {isDiceRollerOpen && (
                <CustomDiceRoller
                    onClose={() => setIsDiceRollerOpen(false)}
                    casterName={casterName}
                />
            )}

            {isResourceTrayOpen && panelHeight !== null && (
                <div className="ddb-floating-resource-tray" style={{ bottom: `${panelHeight}px` }}>
                    {renderTurnResourceBar()}
                </div>
            )}

            <div
                className="ddb-action-sheet-container"
                style={panelHeight ? { height: `${panelHeight}px`, top: "auto", bottom: 0 } : undefined}
            >
            {/* Top Resize Handle (Drag up/down to resize, double click to toggle expand) */}
            <div
                className={`ddb-resize-handle ${isDraggingHeight ? "active" : ""}`}
                onMouseDown={handleResizeStart}
                onDoubleClick={handleToggleExpandHeight}
                title="Drag to resize dock height (or double-click to expand/shrink)"
            >
                <span className="ddb-resize-grip">— — —</span>
            </div>
            {/* ========================================================= */}
            {/* 2-COLUMN DOCK LAYOUT (Left Vitals Pillar + Right Action Deck) */}
            {/* ========================================================= */}
            <div className="ddb-dock-2col-layout">
                {/* ----------------------------------------------------- */}
                {/* LEFT COLUMN: Character Identity, Vitals, HP & Tools    */}
                {/* ----------------------------------------------------- */}
                <aside className="ddb-vitals-pillar">
                    {/* 1. Character Identity */}
                    <div
                        className="ddb-caster-identity"
                        onClick={() => openDDBSyncModal(caster?.id)}
                        title={syncedDdbChar ? `${syncedDdbChar.name} (Click to re-sync)` : "Click to link D&D Beyond Character"}
                    >
                        <div className="ddb-caster-avatar-ring">
                            <img className="ddb-caster-avatar-img" src={casterAvatarUrl} alt={casterName} />
                            {syncedDdbChar && <span className="ddb-synced-star">✦</span>}
                        </div>
                        <div className="ddb-caster-text-block">
                            <div className="ddb-caster-name-row">
                                <span className="ddb-caster-name">{casterName}</span>
                                <span className={`ddb-sync-badge ${syncedDdbChar ? "synced" : "unsynced"}`}>
                                    <IconDragon size={10} />
                                    {syncedDdbChar ? "DDB" : "Sync"}
                                </span>
                            </div>
                            <span className="ddb-caster-subline">
                                {syncedDdbChar?.classes?.map(c => `${c.name} ${c.level}`).join(" / ") || "Adventurer"}
                            </span>
                        </div>
                    </div>

                    {/* Death Saves (if HP is 0) */}
                    {syncedDdbChar && currentHpVal === 0 && (
                        <div className="ddb-death-saves-bar compact">
                            <div className="ddb-death-saves-pips-group">
                                <span className="ddb-death-save-label">SUCC:</span>
                                {[0, 1, 2].map(idx => (
                                    <span
                                        key={`ds-succ-${idx}`}
                                        className={`ddb-death-save-pip success ${deathSaves.successes > idx ? "checked" : ""}`}
                                        onClick={() => setDeathSaves(prev => ({ ...prev, successes: prev.successes === idx + 1 ? idx : idx + 1 }))}
                                    />
                                ))}
                            </div>
                            <div className="ddb-death-saves-pips-group">
                                <span className="ddb-death-save-label">FAIL:</span>
                                {[0, 1, 2].map(idx => (
                                    <span
                                        key={`ds-fail-${idx}`}
                                        className={`ddb-death-save-pip failure ${deathSaves.failures > idx ? "checked" : ""}`}
                                        onClick={() => setDeathSaves(prev => ({ ...prev, failures: prev.failures === idx + 1 ? idx : idx + 1 }))}
                                    />
                                ))}
                            </div>
                            <button type="button" className="ddb-death-save-roll-btn" onClick={handleRollDeathSave}>
                                D20
                            </button>
                        </div>
                    )}

                    {/* 2. Hit Points Box */}
                    {syncedDdbChar && (
                        <div
                            className="ddb-pillar-hp-box"
                            onClick={() => setDrawerItem({
                                type: "hp",
                                current: currentHpVal,
                                max: maxHpVal,
                                temp: customHp?.temp ?? (syncedDdbChar.hp?.temp ?? 0)
                            })}
                            title="Hit Points (Click for details & adjustments)"
                        >
                            <div className="ddb-hp-quick-adjust-col" onClick={e => e.stopPropagation()}>
                                <button
                                    type="button"
                                    className="ddb-hp-mini-btn heal"
                                    onClick={() => handleHpHeal(1)}
                                    title="+1 Heal"
                                >
                                    +1
                                </button>
                                <button
                                    type="button"
                                    className="ddb-hp-mini-btn dmg"
                                    onClick={() => handleHpDamage(1)}
                                    title="-1 Damage"
                                >
                                    -1
                                </button>
                            </div>
                            <div className="ddb-pillar-hp-center">
                                <div className="ddb-pillar-hp-row">
                                    <span className="ddb-pillar-hp-label">HP</span>
                                    <span className="ddb-cstat-val hp-nums">{currentHpVal} <span className="ddb-hp-slash">/</span> {maxHpVal}</span>
                                    {(customHp?.temp ?? syncedDdbChar.hp?.temp ?? 0) > 0 && (
                                        <span className="ddb-hp-temp-tag">+{customHp?.temp ?? syncedDdbChar.hp?.temp}</span>
                                    )}
                                </div>
                                <div className="ddb-pillar-hp-bar">
                                    <div
                                        className={`ddb-pillar-hp-bar-fill ${currentHpVal <= maxHpVal * 0.25 ? "critical" : currentHpVal <= maxHpVal * 0.5 ? "wounded" : "healthy"}`}
                                        style={{ width: `${Math.min(100, Math.max(0, (currentHpVal / (maxHpVal || 1)) * 100))}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 3. Combat Vitals Grid (AC, Initiative, Speed, Proficiency) */}
                    {syncedDdbChar && (
                        <div className="ddb-pillar-vitals-grid">
                            <div
                                className="ddb-pillar-vital-cell ac"
                                onClick={() => {
                                    setDrawerItem({
                                        type: "ac",
                                        ac: syncedDdbChar.armorClass ?? 0,
                                        breakdown: syncedDdbChar.acBreakdown || [
                                            { label: "Base Armor", value: `${syncedDdbChar.armorClass ?? 10}` }
                                        ],
                                        description: "Your Armor Class (AC) represents how well your character avoids being wounded in battle."
                                    });
                                }}
                                title="Armor Class (Click for AC breakdown)"
                            >
                                <span className="ddb-pillar-vital-val">{syncedDdbChar.armorClass ?? 0}</span>
                                <span className="ddb-pillar-vital-lbl">AC</span>
                            </div>

                            <button
                                type="button"
                                className="ddb-pillar-vital-cell init-btn"
                                onClick={handleInitiativeRoll}
                                title={`Initiative: ${(syncedDdbChar.initiative ?? 0) >= 0 ? "+" : ""}${syncedDdbChar.initiative ?? 0}${syncedDdbChar.hasInitiativeAdvantage ? " (Advantage)" : ""} - Click to Roll`}
                            >
                                <div className="ddb-init-row">
                                    <span className="ddb-pillar-vital-val">{(syncedDdbChar.initiative ?? 0) >= 0 ? "+" : ""}{syncedDdbChar.initiative ?? 0}</span>
                                    {syncedDdbChar.hasInitiativeAdvantage && (
                                        <span className="ddb-advantage-badge" title="Advantage on Initiative">A</span>
                                    )}
                                </div>
                                <span className="ddb-pillar-vital-lbl">INIT</span>
                            </button>

                            <div className="ddb-pillar-vital-cell speed" title="Walking Speed">
                                <span className="ddb-pillar-vital-val">{syncedDdbChar.speed || 30}<span className="ddb-cstat-unit">ft</span></span>
                                <span className="ddb-pillar-vital-lbl">SPEED</span>
                            </div>

                            <div className="ddb-pillar-vital-cell prof" title="Proficiency Bonus">
                                <span className="ddb-pillar-vital-val">+{syncedDdbChar.proficiencyBonus}</span>
                                <span className="ddb-pillar-vital-lbl">PROF</span>
                            </div>
                        </div>
                    )}

                    {/* 4. Inspiration & Defenses Row */}
                    {syncedDdbChar && (
                        <div className="ddb-pillar-aux-row">
                            <button
                                type="button"
                                className={`ddb-pillar-inspiration-btn ${heroicInspiration ? "active" : ""}`}
                                onClick={handleToggleInspiration}
                                title="Heroic Inspiration: Reroll any die (Click to toggle)"
                            >
                                <span className="ddb-inspiration-icon">🌅</span>
                                <span className="ddb-aux-btn-text">INSPIRATION</span>
                            </button>

                            <button
                                type="button"
                                className="ddb-pillar-defenses-btn"
                                onClick={() => setDrawerItem({
                                    type: "defenses",
                                    resistances: syncedDdbChar.defenses?.resistances || [],
                                    immunities: syncedDdbChar.defenses?.immunities || [],
                                    vulnerabilities: syncedDdbChar.defenses?.vulnerabilities || []
                                })}
                                title="Defenses: Click for full breakdown"
                            >
                                <span className="ddb-defenses-shield">🛡️</span>
                                <span className="ddb-aux-btn-text">DEFENSES</span>
                            </button>
                        </div>
                    )}

                    {/* 5. Utility & Rest Toolbar */}
                    <div className="ddb-pillar-toolbar">
                        <button
                            type="button"
                            className="ddb-pillar-tool-btn rest"
                            onClick={handleLongRest}
                            title="Long Rest: Reset all actions, spell slots, and feature uses"
                        >
                            <IconLongRest size={12} />
                            <span>Rest</span>
                        </button>
                        <button
                            type="button"
                            className={`ddb-pillar-tool-btn ${drawerItem?.type === "checks" ? "active" : ""}`}
                            onClick={() => setDrawerItem(drawerItem?.type === "checks" ? null : { type: "checks" })}
                            title="Ability Checks & Saving Throws (Sheet Checks)"
                        >
                            <IconCheck size={12} />
                            <span>Checks</span>
                        </button>
                        <button
                            type="button"
                            className={`ddb-pillar-tool-btn ${isDiceRollerOpen ? "active" : ""}`}
                            onClick={() => setIsDiceRollerOpen(prev => !prev)}
                            title="D&D Beyond Custom Dice Roller"
                        >
                            <IconDiceD20 size={12} />
                        </button>
                        <button
                            type="button"
                            className={`ddb-pillar-tool-btn ${isConditionsMenuOpen ? "active" : ""}`}
                            onClick={() => setIsConditionsMenuOpen(prev => !prev)}
                            title="Active Conditions & Exhaustion Tracker"
                        >
                            <IconCondition size={12} />
                            {conditions.length > 0 && <span className="ddb-pillar-tool-badge">{conditions.length}</span>}
                        </button>
                        <button
                            type="button"
                            className="ddb-pillar-tool-btn"
                            onClick={handleOpenBrowserClick}
                            title="Browse Complete Spell Library (.)"
                        >
                            <IconGrimoire size={12} />
                        </button>
                        <button
                            type="button"
                            className="ddb-pillar-tool-btn"
                            onClick={handleClearTargetsClick}
                            title="Clear Target Highlights (X)"
                        >
                            <IconClearTargets size={12} />
                        </button>
                        <button
                            type="button"
                            className="ddb-pillar-tool-btn"
                            onClick={() => {
                                toggleDDBRollLogPopover();
                                setUnreadRolls(0);
                            }}
                            title="Toggle D&D Beyond Game Log"
                            style={{ position: "relative" }}
                        >
                            <IconGameLog size={12} />
                            {unreadRolls > 0 && (
                                <span className="ddb-unread-badge">
                                    {unreadRolls > 9 ? "9+" : unreadRolls}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* 6. Active Status & Buffs Chips */}
                    {(activeBuffs.length > 0 || concentrationSpell || conditions.length > 0 || exhaustionLevel > 0) && (
                        <div className="ddb-pillar-buffs-wrap">
                            {concentrationSpell && (
                                <div className="ddb-buff-chip ddb-buff-chip-concentration" title={`Concentrating on ${concentrationSpell.name}\nClick ✕ to break concentration`}>
                                    <span className="ddb-buff-icon">💎</span>
                                    <span className="ddb-buff-name">CONC: {concentrationSpell.name}</span>
                                    <button
                                        type="button"
                                        className="ddb-buff-remove-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleBreakConcentration();
                                        }}
                                        title="Break Concentration"
                                    >✕</button>
                                </div>
                            )}
                            {conditions.map(cond => (
                                <div key={cond} className="ddb-buff-chip ddb-condition-chip" title={`Condition: ${cond}\nClick to remove`}>
                                    <span className="ddb-buff-icon">⚠️</span>
                                    <span className="ddb-buff-name">{cond.toUpperCase()}</span>
                                    <button
                                        type="button"
                                        className="ddb-buff-remove-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleToggleCondition(cond);
                                        }}
                                        title={`Remove ${cond}`}
                                    >✕</button>
                                </div>
                            ))}
                            {exhaustionLevel > 0 && (
                                <div className="ddb-buff-chip ddb-exhaustion-chip" title={`Exhaustion Level ${exhaustionLevel}: -${exhaustionLevel}d4 on d20 tests, -${exhaustionLevel * 5} ft speed`}>
                                    <span className="ddb-buff-icon">💀</span>
                                    <span className="ddb-buff-name">EXH {exhaustionLevel}</span>
                                    <button
                                        type="button"
                                        className="ddb-buff-remove-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setExhaustionLevel(prev => Math.max(0, prev - 1));
                                        }}
                                        title="Reduce exhaustion by 1"
                                    >–</button>
                                </div>
                            )}
                            {activeBuffs.map(buff => (
                                <div key={buff.id} className="ddb-buff-chip" title={`${buff.name}: ${buff.description}`}>
                                    <span className="ddb-buff-icon">{buff.icon}</span>
                                    <span className="ddb-buff-name">{buff.name}</span>
                                    <button
                                        type="button"
                                        className="ddb-buff-remove-btn"
                                        onClick={async (e) => {
                                            e.stopPropagation();
                                            if (caster?.id) {
                                                const remaining = await removeTokenBuff(caster.id, buff.id);
                                                setActiveBuffs(remaining);
                                                OBR.notification.show(`Deactivated ${buff.name}`, "INFO");
                                            }
                                        }}
                                        title={`Deactivate ${buff.name}`}
                                    >✕</button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Conditions Popover Menu */}
                    {isConditionsMenuOpen && (
                        <div className="ddb-conditions-popover pillar-floating">
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                                <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#f59e0b" }}>CONDITIONS</span>
                                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                    <span style={{ fontSize: "0.64rem", color: "#94a3b8" }}>Exhaustion:</span>
                                    <button
                                        type="button"
                                        style={{ background: "#334155", border: "none", color: "white", padding: "1px 6px", borderRadius: "3px", cursor: "pointer" }}
                                        onClick={() => setExhaustionLevel(prev => Math.max(0, prev - 1))}
                                    >
                                        -
                                    </button>
                                    <span style={{ fontSize: "0.7rem", fontWeight: 800, color: exhaustionLevel > 0 ? "#f87171" : "#e2e8f0" }}>{exhaustionLevel}</span>
                                    <button
                                        type="button"
                                        style={{ background: "#334155", border: "none", color: "white", padding: "1px 6px", borderRadius: "3px", cursor: "pointer" }}
                                        onClick={() => setExhaustionLevel(prev => Math.min(6, prev + 1))}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            <div className="ddb-conditions-grid">
                                {DND_CONDITIONS.map(cond => {
                                    const active = conditions.includes(cond);
                                    return (
                                        <button
                                            key={cond}
                                            type="button"
                                            className={`ddb-condition-toggle-btn ${active ? "active" : ""}`}
                                            onClick={() => handleToggleCondition(cond)}
                                        >
                                            <span>{cond}</span>
                                            <span>{active ? "✓" : "+"}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </aside>

                {/* ----------------------------------------------------- */}
                {/* RIGHT COLUMN: Action Deck Top Strip + Workspace       */}
                {/* ----------------------------------------------------- */}
                <main className="ddb-action-deck-main">
                    {/* Top Strip */}
                    <div className="ddb-deck-top-strip">
                        <div
                            className="ddb-top-strip-scrollable"
                            onWheel={(e) => {
                                if (e.deltaY !== 0) {
                                    e.currentTarget.scrollLeft += e.deltaY;
                                }
                            }}
                        >
                            {/* Primary Navigation Tabs */}
                            <div className="ddb-deck-tabs-group">
                                <button
                                    className={`ddb-deck-tab-btn ${mainTab === "ACTIONS" ? "active" : ""}`}
                                    onClick={() => setMainTab("ACTIONS")}
                                >
                                    ACTIONS
                                </button>
                                <button
                                    className={`ddb-deck-tab-btn ${mainTab === "SPELLS" ? "active" : ""}`}
                                    onClick={() => setMainTab("SPELLS")}
                                >
                                    SPELLS
                                </button>
                                <button
                                    className={`ddb-deck-tab-btn ${mainTab === "INVENTORY" ? "active" : ""}`}
                                    onClick={() => setMainTab("INVENTORY")}
                                >
                                    INVENTORY
                                </button>
                                <button
                                    className={`ddb-deck-tab-btn ${mainTab === "FEATURES" ? "active" : ""}`}
                                    onClick={() => setMainTab("FEATURES")}
                                >
                                    FEATURES
                                </button>
                            </div>
                            {(mainTab === "ACTIONS" || mainTab === "SPELLS") && (
                                <>
                                    <div className="ddb-top-strip-divider" />
                                    <div className="ddb-deck-subfilters">
                                        {mainTab === "ACTIONS"
                                            ? (["ALL", "ATTACK", "ACTION", "BONUS ACTION", "REACTION", "OTHER", "LIMITED USE"] as ActionsFilter[]).map(filter => (
                                                <button
                                                    key={filter}
                                                    type="button"
                                                    className={`ddb-deck-subfilter-btn ${actionsFilter === filter ? "active" : ""}`}
                                                    onClick={() => setActionsFilter(filter)}
                                                >
                                                    {filter === "BONUS ACTION" ? "BONUS" : filter === "LIMITED USE" ? "LIMITED" : filter}
                                                </button>
                                            ))
                                            : (["ALL", "0", "1", "2", "PACT", "3+"] as SpellsFilter[]).map(filter => (
                                                <button
                                                    key={filter}
                                                    type="button"
                                                    className={`ddb-deck-subfilter-btn ${spellsFilter === filter ? "active" : ""}`}
                                                    onClick={() => setSpellsFilter(filter)}
                                                >
                                                    {filter === "0" ? "0" : filter === "1" ? "1ST" : filter === "2" ? "2ND" : filter}
                                                </button>
                                            ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Top-Right Pinned Controls (Search, Grid/List Switcher, Close Button) */}
                        <div className="ddb-top-strip-pinned-right">
                            <button
                                type="button"
                                className={`ddb-resource-tray-toggle ${isResourceTrayOpen ? "active" : ""}`}
                                aria-expanded={isResourceTrayOpen}
                                aria-controls="ddb-turn-resource-tray"
                                onClick={() => setIsResourceTrayOpen(open => !open)}
                                title="Spell slots and class resources"
                            >
                                RESOURCES
                            </button>
                            {/* Search Input */}
                            <div className="ddb-deck-search-wrap">
                                <IconSearch size={11} className="ddb-search-icon" />
                                <input
                                    type="text"
                                    className="ddb-deck-search-input"
                                    placeholder={mainTab === "SPELLS" ? "Search spells..." : mainTab === "INVENTORY" ? "Search items..." : "Search actions..."}
                                    value={mainTab === "SPELLS" ? spellSearch : mainTab === "INVENTORY" ? inventorySearch : actionSearch}
                                    onChange={e => {
                                        const val = e.target.value;
                                        if (mainTab === "SPELLS") setSpellSearch(val);
                                        else if (mainTab === "INVENTORY") setInventorySearch(val);
                                        else setActionSearch(val);
                                    }}
                                />
                                {Boolean(mainTab === "SPELLS" ? spellSearch : mainTab === "INVENTORY" ? inventorySearch : actionSearch) && (
                                    <button
                                        type="button"
                                        className="ddb-search-clear-btn"
                                        onClick={() => {
                                            if (mainTab === "SPELLS") setSpellSearch("");
                                            else if (mainTab === "INVENTORY") setInventorySearch("");
                                            else setActionSearch("");
                                        }}
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>

                            {/* Hybrid View Switcher Toggle (GRID vs LIST) */}
                            <div className="ddb-view-switcher">
                                <button
                                    type="button"
                                    className={`ddb-view-btn ${viewMode === "grid" ? "active" : ""}`}
                                    onClick={() => handleToggleViewMode("grid")}
                                    title="Baldur's Gate 3 Action Grid View"
                                >
                                    <IconGrid size={13} />
                                    <span>GRID</span>
                                </button>
                                <button
                                    type="button"
                                    className={`ddb-view-btn ${viewMode === "table" ? "active" : ""}`}
                                    onClick={() => handleToggleViewMode("table")}
                                    title="Quick-Action List Table View"
                                >
                                    <IconList size={13} />
                                    <span>LIST</span>
                                </button>
                            </div>

                            {/* Close Button */}
                            <button
                                type="button"
                                className="ddb-close-dock-btn"
                                onClick={() => closeActionDock()}
                                title="Close Action Dock"
                            >
                                <IconClose size={13} />
                            </button>
                        </div>
                    </div>
                    {/* Workspace Area: BG3 Grid or Classic Table + Drawer */}
                    <div className="ddb-action-content-workspace">
                        {/* BALDUR'S GATE 3 SUB-ACTION & UPCAST FLYOUT BAR (Overlays action cards area completely) */}
                        {(activeFlyoutSpell || activeFlyoutFeatureData) && (
                            <div className="ddb-bg3-flyout-overlay">
                                <BG3FlyoutBar
                                    spell={activeFlyoutSpell || undefined}
                                    featureData={activeFlyoutFeatureData || undefined}
                                    selectedLevel={upcastPickerLevel}
                                    availableLevels={activeFlyoutSpell ? getAvailableSlotLevels(activeFlyoutSpell.level) : []}
                                    onSelectLevel={(lvl) => {
                                        setUpcastPickerLevel(lvl);
                                        setCastLevel(lvl);
                                        if (activeFlyoutSpell) {
                                            OBR.player.setMetadata({
                                                [selectedSpellSlotLevelMetadataKey]: { spellId: activeFlyoutSpell.id, slotLevel: lvl }
                                            }).catch(() => {});
                                        }
                                    }}
                                    onCast={(lvl, ability, damageType) => {
                                        if (activeFlyoutSpell) {
                                            handleCastClick(activeFlyoutSpell.id, lvl, ability, damageType);
                                        }
                                    }}
                                    getRemainingSlots={getRemainingSlots}
                                    isPactLevel={(lvl) => Boolean(syncedDdbChar?.pactMagic && lvl === syncedDdbChar.pactMagic.level)}
                                    selectedDamageType={activeFlyoutSpell ? spellDamageTypeOverrides[activeFlyoutSpell.id] : undefined}
                                    onSelectDamageType={(type) => {
                                        if (activeFlyoutSpell) {
                                            setSpellDamageTypeOverrides(prev => ({ ...prev, [activeFlyoutSpell.id]: type }));
                                            OBR.player.setMetadata({
                                                [selectedSpellDamageTypeMetadataKey]: { spellId: activeFlyoutSpell.id, damageType: type }
                                            }).catch(() => {});
                                        }
                                    }}
                                    damageTypeChoices={activeFlyoutSpell ? (getSpellChoices(activeFlyoutSpell) || undefined) : undefined}
                                    selectedHexAbility={selectedHexAbility}
                                    onSelectHexAbility={(ability) => {
                                        setSelectedHexAbility(ability);
                                        OBR.player.setMetadata({ [hexChosenAbilityMetadataKey]: ability }).catch(() => {});
                                    }}
                                    onClose={() => {
                                        if (activeFlyoutSpell) handleCancelAiming();
                                        if (activeFlyoutFeatureId) setActiveFlyoutFeatureId(null);
                                    }}
                                />
                            </div>
                        )}
                        {viewMode === "grid" && (mainTab === "ACTIONS" || mainTab === "SPELLS") ? (
                            <div className="ddb-bg3-grid-pane">
                                <ActionGridTooltipProvider>{renderBg3GridContent()}</ActionGridTooltipProvider>
                            </div>
                        ) : (
                            <div className="ddb-dock-left-pane">
                                {/* TAB BODY 1: ACTIONS (Matches Screenshot 1) */}
                                {mainTab === "ACTIONS" && (
                <div className="ddb-tab-panel actions-panel">
                    {/* Sub Filters & Search Bar */}
                    <div className="ddb-actions-filter-search-row">
                        <div className="ddb-subfilter-bar">
                            {(["ALL", "ATTACK", "ACTION", "BONUS ACTION", "REACTION", "OTHER", "LIMITED USE"] as ActionsFilter[]).map(filter => (
                                <button
                                    key={filter}
                                    className={`ddb-subfilter-btn ${actionsFilter === filter ? "active" : ""}`}
                                    onClick={() => setActionsFilter(filter)}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>
                        <div className="ddb-search-wrap">
                            <IconSearch size={12} className="ddb-search-icon" />
                            <input
                                type="text"
                                className="ddb-search-input"
                                placeholder="Search actions & skills..."
                                value={actionSearch}
                                onChange={e => setActionSearch(e.target.value)}
                            />
                            {actionSearch && (
                                <button
                                    type="button"
                                    className="ddb-search-clear-btn"
                                    onClick={() => setActionSearch("")}
                                    title="Clear search"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    </div>

                    {/* 1. Subfilter: ATTACK (Pure Weapons & Direct Attack Spells) */}
                    {actionsFilter === "ATTACK" && (
                        <div className="ddb-table-scroll-container">
                            <div className="ddb-actions-category-header in-table">
                                <span className="ddb-category-title">ATTACKS &amp; WEAPONS</span>
                            </div>
                            {(filteredWeapons.length > 0 || attackSpells.length > 0) ? (
                                <table className="ddb-action-table">
                                    <thead>
                                        <tr>
                                            <th className="th-attack">ATTACK</th>
                                            <th className="th-range">RANGE</th>
                                            <th className="th-hit">HIT / DC</th>
                                            <th className="th-damage">DAMAGE</th>
                                            <th className="th-notes">NOTES</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredWeapons.map(renderWeaponRow)}
                                        {attackSpells.map(renderAttackSpellRow)}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="ddb-empty-search-state">
                                    <IconSearch size={22} className="ddb-empty-search-icon" />
                                    <span className="ddb-empty-search-text">No attacks matching "{actionSearch}"</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* 2. Subfilter: ACTION (1 Action Features, Spells & Combat Actions) */}
                    {actionsFilter === "ACTION" && (
                        <div className="ddb-actions-list-panel">
                            <div className="ddb-actions-category-header">
                                <span className="ddb-category-title">ACTIONS (1 ACTION)</span>
                            </div>

                            {/* Actions in Combat */}
                            {filteredCombatActions.length > 0 && (
                                <div className="ddb-action-category-block">
                                    <h4 className="ddb-category-block-title">Actions in Combat</h4>
                                    <div className="ddb-combat-action-chips">
                                        {filteredCombatActions.map(act => (
                                            <button
                                                key={act.name}
                                                type="button"
                                                className="ddb-combat-action-chip"
                                                onClick={() => setDrawerItem({
                                                    type: "feature",
                                                    id: `act_${act.name.toLowerCase()}`,
                                                    name: act.name,
                                                    description: act.description,
                                                    category: "Actions in Combat",
                                                    activationType: "action"
                                                })}
                                                title={`${act.name}: ${act.description} (Click for details)`}
                                            >
                                                {act.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Feature Actions (1 Action) */}
                            {actionFeatures.length > 0 && (
                                <div className="ddb-action-category-block">
                                    <h4 className="ddb-category-block-title">Feature Actions</h4>
                                    {actionFeatures.map(renderFeatureCard)}
                                </div>
                            )}

                            {/* Spells (1 Action) */}
                            {actionSpells.length > 0 && (
                                <div className="ddb-action-category-block">
                                    <h4 className="ddb-category-block-title">Spells (1 Action)</h4>
                                    <div className="ddb-action-card-item spells-line">
                                        <div className="ddb-card-accent-bar" />
                                        <div className="ddb-card-content ddb-spells-inline-wrap">
                                            {actionSpells.map((s, idx) => (
                                                <span
                                                    key={s.id}
                                                    className="ddb-inline-spell-chip"
                                                    onClick={() => handleSelectSpell(s.id)}
                                                    onContextMenu={(e) => {
                                                        e.preventDefault();
                                                        openSpellDetailModal(s.id);
                                                    }}
                                                    title={`Click to aim & cast ${s.name} (Right-click for info)`}
                                                >
                                                    <em className="ddb-spell-name-italic">{s.name}</em>
                                                    {s.notes?.includes("C") ? " ◆" : ""} ({s.level === 0 ? "Cantrip" : getOrdinal(s.level)})
                                                    {idx < actionSpells.length - 1 ? ", " : ""}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {actionFeatures.length === 0 && actionSpells.length === 0 && filteredCombatActions.length === 0 && (
                                <div className="ddb-empty-search-state">
                                    <IconSearch size={22} className="ddb-empty-search-icon" />
                                    <span className="ddb-empty-search-text">No actions matching "{actionSearch}"</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* 3. Subfilter: BONUS ACTION */}
                    {actionsFilter === "BONUS ACTION" && (
                        <div className="ddb-actions-list-panel">
                            <div className="ddb-actions-category-header">
                                <span className="ddb-category-title">BONUS ACTIONS</span>
                            </div>

                            {/* Actions in Combat */}
                            <div className="ddb-action-category-block">
                                <h4 className="ddb-category-block-title">Actions in Combat</h4>
                                {syncedDdbChar?.hasTwoWeaponFighting ? (
                                    <div
                                        className="ddb-action-card-item twf"
                                        onClick={handleTwoWeaponFightingClick}
                                        title="Two-Weapon Fighting: When you take the Attack action and attack with a Light weapon, make an extra attack with another Light weapon as a Bonus Action."
                                    >
                                        <div className="ddb-card-accent-bar" />
                                        <div className="ddb-card-content">
                                            <span className="ddb-card-name">Two-Weapon Fighting</span>
                                            {syncedDdbChar.offhandWeapon && (
                                                <span className="ddb-card-meta">
                                                    ({syncedDdbChar.offhandWeapon.name}: +{syncedDdbChar.offhandWeapon.toHit} to hit, {syncedDdbChar.offhandWeapon.damage} {syncedDdbChar.offhandWeapon.damageType})
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="ddb-action-card-item generic">
                                        <div className="ddb-card-accent-bar" />
                                        <span className="ddb-card-name">Two-Weapon Fighting (requires 2 equipped Light weapons)</span>
                                    </div>
                                )}
                            </div>

                            {/* Feature Actions */}
                            {bonusActionFeatures.length > 0 && (
                                <div className="ddb-action-category-block">
                                    <h4 className="ddb-category-block-title">Feature Actions</h4>
                                    {bonusActionFeatures.map(renderFeatureCard)}
                                </div>
                            )}

                            {/* Spells */}
                            {bonusActionSpells.length > 0 && (
                                <div className="ddb-action-category-block">
                                    <h4 className="ddb-category-block-title">Spells</h4>
                                    <div className="ddb-action-card-item spells-line">
                                        <div className="ddb-card-accent-bar" />
                                        <div className="ddb-card-content ddb-spells-inline-wrap">
                                            {bonusActionSpells.map((s, idx) => (
                                                <span
                                                    key={s.id}
                                                    className="ddb-inline-spell-chip"
                                                    onClick={() => handleSelectSpell(s.id)}
                                                    onContextMenu={(e) => {
                                                        e.preventDefault();
                                                        openSpellDetailModal(s.id);
                                                    }}
                                                    title={`Click to aim & cast ${s.name} (Right-click for info)`}
                                                >
                                                    <em className="ddb-spell-name-italic">{s.name}</em>
                                                    {s.notes?.includes("C") ? " ◆" : ""} ({s.level === 0 ? "Cantrip" : getOrdinal(s.level)})
                                                    {idx < bonusActionSpells.length - 1 ? ", " : ""}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {bonusActionFeatures.length === 0 && bonusActionSpells.length === 0 && !syncedDdbChar?.hasTwoWeaponFighting && (
                                <div className="ddb-empty-search-state">
                                    <IconSearch size={22} className="ddb-empty-search-icon" />
                                    <span className="ddb-empty-search-text">No bonus actions matching "{actionSearch}"</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* 4. Subfilter: REACTION */}
                    {actionsFilter === "REACTION" && (
                        <div className="ddb-actions-list-panel">
                            <div className="ddb-actions-category-header">
                                <span className="ddb-category-title">REACTIONS</span>
                            </div>

                            {/* Actions in Combat */}
                            <div className="ddb-action-category-block">
                                <h4 className="ddb-category-block-title">Actions in Combat</h4>
                                <div
                                    className="ddb-action-card-item oa"
                                    onClick={handleOpportunityAttackClick}
                                    title="Opportunity Attack: You can make an opportunity attack when a hostile creature that you can see moves out of your reach."
                                >
                                    <div className="ddb-card-accent-bar" />
                                    <div className="ddb-card-content">
                                        <span className="ddb-card-name">Opportunity Attack</span>
                                        {weaponsList[0] && (
                                            <span className="ddb-card-meta">
                                                ({weaponsList[0].name}: +{weaponsList[0].toHit} to hit, {weaponsList[0].damage} {weaponsList[0].damageType})
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Feature Actions */}
                            {reactionFeatures.length > 0 && (
                                <div className="ddb-action-category-block">
                                    <h4 className="ddb-category-block-title">Feature Actions</h4>
                                    {reactionFeatures.map(renderFeatureCard)}
                                </div>
                            )}

                            {/* Spells */}
                            {reactionSpells.length > 0 && (
                                <div className="ddb-action-category-block">
                                    <h4 className="ddb-category-block-title">Spells</h4>
                                    <div className="ddb-action-card-item spells-line">
                                        <div className="ddb-card-accent-bar" />
                                        <div className="ddb-card-content ddb-spells-inline-wrap">
                                            {reactionSpells.map((s, idx) => (
                                                <span
                                                    key={s.id}
                                                    className="ddb-inline-spell-chip"
                                                    onClick={() => handleSelectSpell(s.id)}
                                                    onContextMenu={(e) => {
                                                        e.preventDefault();
                                                        openSpellDetailModal(s.id);
                                                    }}
                                                    title={`Click to aim & cast ${s.name} (Right-click for info)`}
                                                >
                                                    <em className="ddb-spell-name-italic">{s.name}</em>
                                                    {s.notes?.includes("C") ? " ◆" : ""} ({s.level === 0 ? "Cantrip" : getOrdinal(s.level)})
                                                    {idx < reactionSpells.length - 1 ? ", " : ""}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {reactionFeatures.length === 0 && reactionSpells.length === 0 && (
                                <div className="ddb-empty-search-state">
                                    <IconSearch size={22} className="ddb-empty-search-icon" />
                                    <span className="ddb-empty-search-text">No reactions matching "{actionSearch}"</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* 5. Subfilter: OTHER */}
                    {actionsFilter === "OTHER" && (
                        <div className="ddb-actions-list-panel">
                            <div className="ddb-actions-category-header">
                                <span className="ddb-category-title">OTHER ACTIONS</span>
                            </div>
                            {otherFeatures.length > 0 ? (
                                otherFeatures.map(renderFeatureCard)
                            ) : (
                                <div className="ddb-empty-search-state">
                                    <IconSearch size={22} className="ddb-empty-search-icon" />
                                    <span className="ddb-empty-search-text">No other features matching "{actionSearch}"</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* 6. Subfilter: LIMITED USE */}
                    {actionsFilter === "LIMITED USE" && (
                        <div className="ddb-actions-list-panel">
                            <div className="ddb-actions-category-header">
                                <span className="ddb-category-title">LIMITED USE</span>
                            </div>
                            {limitedUseFeatures.length > 0 ? (
                                limitedUseFeatures.map(renderFeatureCard)
                            ) : (
                                <div className="ddb-empty-search-state">
                                    <IconSearch size={22} className="ddb-empty-search-icon" />
                                    <span className="ddb-empty-search-text">No limited-use features matching "{actionSearch}"</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* 7. Subfilter: ALL (Complete categorized combat overview) */}
                    {actionsFilter === "ALL" && (
                        <div className="ddb-actions-list-panel all-actions-panel">
                            {/* Attacks Section */}
                            {(filteredWeapons.length > 0 || attackSpells.length > 0) && (
                                <div className="ddb-action-category-block">
                                    <div className="ddb-actions-category-header">
                                        <span className="ddb-category-title">ATTACKS &amp; WEAPONS</span>
                                    </div>
                                    <div className="ddb-table-scroll-container embedded">
                                        <table className="ddb-action-table">
                                            <thead>
                                                <tr>
                                                    <th className="th-attack">ATTACK</th>
                                                    <th className="th-range">RANGE</th>
                                                    <th className="th-hit">HIT / DC</th>
                                                    <th className="th-damage">DAMAGE</th>
                                                    <th className="th-notes">NOTES</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredWeapons.map(renderWeaponRow)}
                                                {attackSpells.map(renderAttackSpellRow)}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Action Features & Spells Section */}
                            {(actionFeatures.length > 0 || actionSpells.length > 0) && (
                                <div className="ddb-action-category-block">
                                    <div className="ddb-actions-category-header">
                                        <span className="ddb-category-title">ACTIONS (1 ACTION)</span>
                                    </div>
                                    {actionFeatures.map(renderFeatureCard)}
                                    {actionSpells.length > 0 && (
                                        <div className="ddb-action-card-item spells-line">
                                            <div className="ddb-card-accent-bar" />
                                            <div className="ddb-card-content ddb-spells-inline-wrap">
                                                {actionSpells.map((s, idx) => (
                                                    <span
                                                        key={s.id}
                                                        className="ddb-inline-spell-chip"
                                                        onClick={() => handleSelectSpell(s.id)}
                                                        onContextMenu={(e) => {
                                                            e.preventDefault();
                                                            openSpellDetailModal(s.id);
                                                        }}
                                                        title={`Click to aim & cast ${s.name}`}
                                                    >
                                                        <em className="ddb-spell-name-italic">{s.name}</em>
                                                        {s.notes?.includes("C") ? " ◆" : ""} ({s.level === 0 ? "Cantrip" : getOrdinal(s.level)})
                                                        {idx < actionSpells.length - 1 ? ", " : ""}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Bonus Actions Section */}
                            {(syncedDdbChar?.hasTwoWeaponFighting || bonusActionFeatures.length > 0 || bonusActionSpells.length > 0) && (
                                <div className="ddb-action-category-block">
                                    <div className="ddb-actions-category-header">
                                        <span className="ddb-category-title">BONUS ACTIONS</span>
                                    </div>
                                    {syncedDdbChar?.hasTwoWeaponFighting && (
                                        <div
                                            className="ddb-action-card-item twf"
                                            onClick={handleTwoWeaponFightingClick}
                                            title="Two-Weapon Fighting"
                                        >
                                            <div className="ddb-card-accent-bar" />
                                            <div className="ddb-card-content">
                                                <span className="ddb-card-name">Two-Weapon Fighting</span>
                                                {syncedDdbChar.offhandWeapon && (
                                                    <span className="ddb-card-meta">
                                                        ({syncedDdbChar.offhandWeapon.name}: +{syncedDdbChar.offhandWeapon.toHit} to hit, {syncedDdbChar.offhandWeapon.damage} {syncedDdbChar.offhandWeapon.damageType})
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    {bonusActionFeatures.map(renderFeatureCard)}
                                    {bonusActionSpells.length > 0 && (
                                        <div className="ddb-action-card-item spells-line">
                                            <div className="ddb-card-accent-bar" />
                                            <div className="ddb-card-content ddb-spells-inline-wrap">
                                                {bonusActionSpells.map((s, idx) => (
                                                    <span
                                                        key={s.id}
                                                        className="ddb-inline-spell-chip"
                                                        onClick={() => handleSelectSpell(s.id)}
                                                        onContextMenu={(e) => {
                                                            e.preventDefault();
                                                            openSpellDetailModal(s.id);
                                                        }}
                                                        title={`Click to aim & cast ${s.name}`}
                                                    >
                                                        <em className="ddb-spell-name-italic">{s.name}</em>
                                                        {s.notes?.includes("C") ? " ◆" : ""} ({s.level === 0 ? "Cantrip" : getOrdinal(s.level)})
                                                        {idx < bonusActionSpells.length - 1 ? ", " : ""}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Reactions Section */}
                            {(reactionFeatures.length > 0 || reactionSpells.length > 0 || weaponsList.length > 0) && (
                                <div className="ddb-action-category-block">
                                    <div className="ddb-actions-category-header">
                                        <span className="ddb-category-title">REACTIONS</span>
                                    </div>
                                    <div
                                        className="ddb-action-card-item oa"
                                        onClick={handleOpportunityAttackClick}
                                        title="Opportunity Attack"
                                    >
                                        <div className="ddb-card-accent-bar" />
                                        <div className="ddb-card-content">
                                            <span className="ddb-card-name">Opportunity Attack</span>
                                            {weaponsList[0] && (
                                                <span className="ddb-card-meta">
                                                    ({weaponsList[0].name}: +{weaponsList[0].toHit} to hit, {weaponsList[0].damage} {weaponsList[0].damageType})
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    {reactionFeatures.map(renderFeatureCard)}
                                    {reactionSpells.length > 0 && (
                                        <div className="ddb-action-card-item spells-line">
                                            <div className="ddb-card-accent-bar" />
                                            <div className="ddb-card-content ddb-spells-inline-wrap">
                                                {reactionSpells.map((s, idx) => (
                                                    <span
                                                        key={s.id}
                                                        className="ddb-inline-spell-chip"
                                                        onClick={() => handleSelectSpell(s.id)}
                                                        onContextMenu={(e) => {
                                                            e.preventDefault();
                                                            openSpellDetailModal(s.id);
                                                        }}
                                                        title={`Click to aim & cast ${s.name}`}
                                                    >
                                                        <em className="ddb-spell-name-italic">{s.name}</em>
                                                        {s.notes?.includes("C") ? " ◆" : ""} ({s.level === 0 ? "Cantrip" : getOrdinal(s.level)})
                                                        {idx < reactionSpells.length - 1 ? ", " : ""}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Actions in Combat Section */}
                            {filteredCombatActions.length > 0 && (
                                <div className="ddb-action-category-block">
                                    <div className="ddb-actions-category-header">
                                        <span className="ddb-category-title">ACTIONS IN COMBAT</span>
                                    </div>
                                    <div className="ddb-combat-action-chips">
                                        {filteredCombatActions.map(act => (
                                            <button
                                                key={act.name}
                                                type="button"
                                                className="ddb-combat-action-chip"
                                                onClick={() => setDrawerItem({
                                                    type: "feature",
                                                    id: `act_${act.name.toLowerCase()}`,
                                                    name: act.name,
                                                    description: act.description,
                                                    category: "Actions in Combat",
                                                    activationType: "action"
                                                })}
                                                title={`${act.name}: ${act.description} (Click for details)`}
                                            >
                                                {act.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Empty Search */}
                            {filteredWeapons.length === 0 && attackSpells.length === 0 && actionFeatures.length === 0 && actionSpells.length === 0 && bonusActionFeatures.length === 0 && bonusActionSpells.length === 0 && reactionFeatures.length === 0 && reactionSpells.length === 0 && filteredCombatActions.length === 0 && (
                                <div className="ddb-empty-search-state">
                                    <IconSearch size={22} className="ddb-empty-search-icon" />
                                    <span className="ddb-empty-search-text">No actions, weapons, or skills matching "{actionSearch}"</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* ========================================================= */}
            {/* TAB BODY 2: SPELLS (Matches Screenshot 2) */}
            {/* ========================================================= */}
            {mainTab === "SPELLS" && (
                <div className="ddb-tab-panel spells-panel">
                    {/* Top Stats Banner */}
                    <div className="ddb-spells-top-stats-banner">
                        <div className="ddb-stat-box">
                            <span className="ddb-stat-num">+{abilityModifier}</span>
                            <span className="ddb-stat-tag">MODIFIER ({spellAbility})</span>
                        </div>
                        <div className="ddb-stat-box">
                            <span className="ddb-stat-num">
                                +{spellAttackBonus}
                                {buffMods.hasSpellAdvantage && <span className="ddb-buff-badge-tag" title="Advantage on spell attacks">ADV</span>}
                            </span>
                            <span className="ddb-stat-tag">SPELL ATTACK</span>
                        </div>
                        <div className="ddb-stat-box">
                            <span className="ddb-stat-num">
                                {syncedDdbChar?.spellSaveDC ? `${syncedDdbChar.spellSaveDC + buffMods.spellSaveDcBonus}` : (syncedDdbChar?.spellSaveDCDisplay || "—")}
                                {buffMods.spellSaveDcBonus > 0 && <span className="ddb-buff-badge-tag" title={`+${buffMods.spellSaveDcBonus} DC from active buff`}>+{buffMods.spellSaveDcBonus}</span>}
                            </span>
                            <span className="ddb-stat-tag">SAVE DC</span>
                        </div>
                    </div>

                    {/* Sub Filters & Search */}
                    <div className="ddb-spells-filter-search-row">
                        <div className="ddb-subfilter-bar">
                            {(["ALL", "0", "1", "2", "PACT", "3+"] as SpellsFilter[]).map(filter => (
                                <button
                                    key={filter}
                                    className={`ddb-subfilter-btn ${spellsFilter === filter ? "active" : ""}`}
                                    onClick={() => setSpellsFilter(filter)}
                                >
                                    {filter === "0" ? "- 0 -" : filter === "1" ? "1ST" : filter === "2" ? "2ND" : filter}
                                </button>
                            ))}
                        </div>
                        <div className="ddb-search-wrap">
                            <IconSearch size={12} className="ddb-search-icon" />
                            <input
                                type="text"
                                className="ddb-search-input"
                                placeholder="Search spells..."
                                value={spellSearch}
                                onChange={e => setSpellSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Spells Table Container */}
                    <div className="ddb-table-scroll-container">
                        <table className="ddb-action-table spells-table">
                            <thead>
                                <tr>
                                    <th className="th-name">NAME</th>
                                    <th className="th-time">TIME</th>
                                    <th className="th-range">RANGE</th>
                                    <th className="th-hit">HIT / DC</th>
                                    <th className="th-effect">EFFECT</th>
                                    <th className="th-notes">NOTES</th>
                                    <th className="th-cast">CAST</th>
                                </tr>
                            </thead>
                            <tbody>
                                {spellGroups.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} style={{ textAlign: "center", padding: "16px", color: "#6b7280" }}>
                                            No spells found
                                        </td>
                                    </tr>
                                ) : (
                                    spellGroups.map(group => (
                                        <React.Fragment key={group.label}>
                                            <tr className="ddb-spell-group-row">
                                                <td colSpan={7} className="ddb-spell-group-cell">
                                                    <div className="ddb-spell-group-label">{group.label}</div>
                                                </td>
                                            </tr>
                                            {group.spells.map(spell => {
                                                const isSelected = selectedSpell === spell.id;
                                                const meta = getSpellMetadata(spell.id, spell.name);
                                                const schoolStyle = getSchoolStyle(meta.school);
                                                const initials = getSpellInitials(meta.name);
                                                const isUpcastable = isSpellUpcastable(spell.id, meta);

                                                return (
                                                    <React.Fragment key={spell.id}>
                                                        <tr
                                                            className={`ddb-table-row spell-row ${isSelected ? "selected" : ""}`}
                                                        onClick={() => {
                                                            handleSelectSpell(spell.id);
                                                            setDrawerItem({ type: "spell", spell });
                                                        }}
                                                        onContextMenu={e => {
                                                            e.preventDefault();
                                                            openSpellDetailModal(spell.id);
                                                        }}
                                                    >
                                                        <td className="td-name">
                                                            <div className="ddb-spell-cell">
                                                                <span
                                                                    className="ddb-mini-school-badge"
                                                                    style={{ borderColor: schoolStyle.color, color: schoolStyle.color }}
                                                                >
                                                                    <img
                                                                        src={schoolStyle.iconUrl || `https://media.dndbeyond.com/media/spell-school-icons/${(meta.school || spell.school || "evocation").toLowerCase()}.svg`}
                                                                        alt=""
                                                                        className="ddb-mini-school-svg"
                                                                        onError={(e) => {
                                                                            e.currentTarget.style.display = "none";
                                                                            if (e.currentTarget.parentElement) {
                                                                                e.currentTarget.parentElement.innerText = initials;
                                                                            }
                                                                        }}
                                                                    />
                                                                </span>
                                                                <span className="ddb-spell-title">{spell.name}</span>
                                                                {isUpcastable && <span className="ddb-upcast-tag">+</span>}
                                                                {spell.isPrepared && <span className="ddb-prep-pip" title="Prepared">✦</span>}
                                                            </div>
                                                        </td>
                                                        <td className="td-time">{spell.castingTime}</td>
                                                        <td className="td-range">{spell.rangeText}</td>
                                                        <td className="td-hit">
                                                            {spell.hitOrDc ? (
                                                                <button
                                                                    type="button"
                                                                    className="ddb-roll-pill hit-pill"
                                                                    onClick={e => {
                                                                        e.stopPropagation();
                                                                        handleSpellAttackRoll(spell);
                                                                    }}
                                                                    title={`Roll: ${spell.hitOrDc}`}
                                                                >
                                                                    <span>{spell.hitOrDc}</span>
                                                                </button>
                                                            ) : (
                                                                <span className="ddb-na-dash">—</span>
                                                            )}
                                                        </td>
                                                        <td className="td-effect">
                                                            {spell.damage ? (
                                                                <button
                                                                    type="button"
                                                                    className="ddb-roll-pill dmg-pill"
                                                                    onClick={e => {
                                                                        e.stopPropagation();
                                                                        handleSpellDamageRoll(spell);
                                                                    }}
                                                                    title={`Roll: ${spell.damage}`}
                                                                >
                                                                    <IconFire size={11} />
                                                                    <span>{spell.damage}</span>
                                                                    {spellDamageTypeOverrides[spell.id] && (
                                                                        <span className="ddb-type-text">{spellDamageTypeOverrides[spell.id]}</span>
                                                                    )}
                                                                </button>
                                                            ) : (
                                                                <span className="ddb-effect-desc">Control/Utility</span>
                                                            )}
                                                        </td>
                                                        <td className="td-notes">
                                                            <span className="ddb-notes-text">{spell.notes}</span>
                                                        </td>
                                                        <td className="td-cast">
                                                            <div className="ddb-cast-cell-actions">
                                                                <button
                                                                    type="button"
                                                                    className="ddb-quick-cast-btn"
                                                                    onClick={e => {
                                                                        e.stopPropagation();
                                                                        handleOpenUpcastPicker(spell);
                                                                    }}
                                                                    title={`Cast ${spell.name}`}
                                                                >
                                                                    <IconCastLightning size={12} />
                                                                    <span>{upcastPickerSpellId === spell.id ? "Close" : "Cast"}</span>
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="ddb-info-btn"
                                                                    onClick={e => {
                                                                        e.stopPropagation();
                                                                        setDrawerItem({ type: "spell", spell });
                                                                        openSpellDetailModal(spell.id);
                                                                    }}
                                                                    title="Spell Details"
                                                                >
                                                                    <IconSpellInfo size={13} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                        {upcastPickerSpellId === spell.id && renderUpcastPickerRow(spell, 6)}
                                                    </React.Fragment>
                                                );
                                            })}
                                        </React.Fragment>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ========================================================= */}
            {/* TAB BODY 3: FEATURES & TRAITS (Matches Screenshot 3) */}
            {/* ========================================================= */}
            {mainTab === "FEATURES" && (
                <div className="ddb-tab-panel features-panel">
                    {/* Sub Filters */}
                    <div className="ddb-subfilter-bar">
                        {(["ALL", "CLASS", "SPECIES", "FEATS"] as FeaturesFilter[]).map(filter => (
                            <button
                                key={filter}
                                className={`ddb-subfilter-btn ${featuresFilter === filter ? "active" : ""}`}
                                onClick={() => setFeaturesFilter(filter)}
                            >
                                {filter === "CLASS" ? "CLASS FEATURES" : filter === "SPECIES" ? "SPECIES TRAITS" : filter}
                            </button>
                        ))}
                    </div>

                    {/* Features List */}
                    <div className="ddb-features-scroll-container">
                        {filteredFeatures.length === 0 ? (
                            <div className="ddb-features-empty">
                                <p>No features in this category, or no character linked.</p>
                                <button
                                    type="button"
                                    className="ddb-sync-prompt-btn"
                                    onClick={() => openDDBSyncModal(caster?.id)}
                                >
                                    <IconDragon size={13} />
                                    <span>Sync D&amp;D Beyond Character</span>
                                </button>
                            </div>
                        ) : (
                            filteredFeatures.map(feat => {
                                const maxUses = feat.limitedUse?.max ?? 0;
                                const usedCount = featureUses[feat.id] ?? (feat.limitedUse?.used ?? 0);
                                const isExpanded = Boolean(expandedFeatures[feat.id]);
                                const featLower = feat.name.toLowerCase();
                                const canBeActivated = isActivatableBuffFeature(feat.name);
                                const isBuffActive = activeBuffs.some(b => b.name.toLowerCase() === featLower || b.id === feat.id || (b.id === "innate_sorcery" && featLower.includes("innate sorcery")));
                                const flyoutKind = getFeatureFlyoutKind(feat);

                                return (
                                    <div
                                        key={feat.id}
                                        className={`ddb-feature-card ${isBuffActive ? "buff-active-card" : ""} ${activeFlyoutFeatureId === feat.id ? "flyout-active-card" : ""}`}
                                        onClick={() => {
                                            if (flyoutKind) {
                                                setUpcastPickerSpellId(null);
                                                setActiveFlyoutFeatureId(prev => prev === feat.id ? null : feat.id);
                                            } else {
                                                setDrawerItem({
                                                    type: "feature",
                                                    id: feat.id,
                                                    name: feat.name,
                                                    category: feat.source === "class" ? "Class Feature" : feat.source === "race" ? "Species Trait" : "Feat",
                                                    activationType: feat.activationType,
                                                    rangeText: feat.rangeText,
                                                    description: feat.description,
                                                    rawDescription: feat.rawDescription,
                                                    limitedUse: feat.limitedUse
                                                });
                                            }
                                        }}
                                        onContextMenu={e => {
                                            e.preventDefault();
                                            setDrawerItem({
                                                type: "feature",
                                                id: feat.id,
                                                name: feat.name,
                                                category: feat.source === "class" ? "Class Feature" : feat.source === "race" ? "Species Trait" : "Feat",
                                                activationType: feat.activationType,
                                                rangeText: feat.rangeText,
                                                description: feat.description,
                                                rawDescription: feat.rawDescription,
                                                limitedUse: feat.limitedUse
                                            });
                                        }}
                                        style={{ cursor: "pointer" }}
                                        title={flyoutKind ? "Click to open interactive flyout (Right-click for details)" : "Click to view details in drawer"}
                                    >
                                        <div className="ddb-feature-header-row">
                                            <div className="ddb-feature-title-block">
                                                <div className="ddb-feature-title-action-row">
                                                    <h4 className="ddb-feature-title">{feat.name}</h4>
                                                    {canBeActivated && (
                                                        <button
                                                            type="button"
                                                            className={`ddb-feature-activate-btn ${isBuffActive ? "active" : ""}`}
                                                            aria-pressed={isBuffActive}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleActivateFeature(feat);
                                                            }}
                                                            title={isBuffActive ? `Active: Click to deactivate ${feat.name}` : `Click to activate ${feat.name}`}
                                                        >
                                                            {isBuffActive ? "Active" : "Activate"}
                                                        </button>
                                                    )}
                                                </div>
                                                <span className="ddb-feature-source-badge">
                                                    {feat.source.toUpperCase()} {feat.activationType ? `• ${feat.activationType.toUpperCase()}` : ""}
                                                </span>
                                            </div>
                                            {/* Interactive Usage Checkboxes */}
                                            {maxUses > 0 && (
                                                <div className="ddb-feature-usage-tracker" onClick={e => e.stopPropagation()}>
                                                    <span className="ddb-usage-label">USES:</span>
                                                    <div className="ddb-usage-boxes-row">
                                                        {Array.from({ length: maxUses }).map((_, boxIdx) => {
                                                            const isChecked = boxIdx < usedCount;
                                                            return (
                                                                <button
                                                                    key={boxIdx}
                                                                    type="button"
                                                                    className={`ddb-use-box ${isChecked ? "checked" : ""}`}
                                                                    onClick={() => handleToggleFeatureBox(feat, boxIdx)}
                                                                    title={`Use ${boxIdx + 1}: ${isChecked ? "Expended" : "Available"} (Click to toggle)`}
                                                                >
                                                                    {isChecked && <IconCheck size={11} />}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                    <span className="ddb-reset-type">
                                                        / {feat.limitedUse?.resetType || "Long Rest"}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {feat.description && (
                                            <div className="ddb-feature-body">
                                                <p className={`ddb-feature-desc ${isExpanded ? "expanded" : "clamped"}`}>
                                                    {feat.description}
                                                </p>
                                                {feat.description.length > 140 && (
                                                    <button
                                                        type="button"
                                                        className="ddb-more-less-btn"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleExpandFeature(feat.id);
                                                        }}
                                                    >
                                                        {isExpanded ? "Show Less" : "Show More"}
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}

            {/* TAB: INVENTORY */}
            {mainTab === "INVENTORY" && (
                <div className="ddb-tab-content-panel ddb-inventory-panel">
                    <div className="ddb-inv-summary-bar">
                        <div className="ddb-currencies-row">
                            <span className="ddb-curr-pill pp"><strong className="lbl">PP</strong> {syncedDdbChar?.currencies?.pp ?? 0}</span>
                            <span className="ddb-curr-pill gp"><strong className="lbl">GP</strong> {syncedDdbChar?.currencies?.gp ?? 0}</span>
                            <span className="ddb-curr-pill ep"><strong className="lbl">EP</strong> {syncedDdbChar?.currencies?.ep ?? 0}</span>
                            <span className="ddb-curr-pill sp"><strong className="lbl">SP</strong> {syncedDdbChar?.currencies?.sp ?? 0}</span>
                            <span className="ddb-curr-pill cp"><strong className="lbl">CP</strong> {syncedDdbChar?.currencies?.cp ?? 0}</span>
                        </div>
                        <div className="ddb-inv-meta-trackers">
                            <div className="ddb-attunement-tracker" title="Attunement / Augment (D&D 5e: Max 3 items)">
                                <span className="ddb-attune-lbl">ATTUNED:</span>
                                <span className="ddb-attune-val">{attunedCount} / 3</span>
                                <div className="ddb-attune-pips">
                                    {[0, 1, 2].map(idx => (
                                        <span
                                            key={idx}
                                            className={`ddb-attune-pip ${idx < attunedCount ? "filled" : ""}`}
                                            title={idx < attunedCount ? `Attunement Slot ${idx + 1} (Occupied)` : `Attunement Slot ${idx + 1} (Available)`}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="ddb-weight-tracker">
                                <span className="ddb-weight-lbl">WEIGHT:</span>
                                <span className="ddb-weight-val">
                                    {totalInventoryWeight.toFixed(1)} / {maxCarryWeight} lb.
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="ddb-actions-filter-search-row">
                        <div className="ddb-subfilter-tabs">
                            {(["ALL", "EQUIPPED", "ATTUNED", "WEAPONS", "ARMOR", "GEAR"] as InventoryFilter[]).map(f => (
                                <button
                                    key={f}
                                    type="button"
                                    className={`ddb-subfilter-btn ${inventoryFilter === f ? "active" : ""}`}
                                    onClick={() => setInventoryFilter(f)}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                        <div className="ddb-actions-search-wrap">
                            <IconSearch size={12} className="ddb-search-input-icon" />
                            <input
                                type="text"
                                className="ddb-actions-search-input"
                                placeholder="Search inventory..."
                                value={inventorySearch}
                                onChange={e => setInventorySearch(e.target.value)}
                            />
                            {inventorySearch && (
                                <button
                                    type="button"
                                    className="ddb-search-clear-btn"
                                    onClick={() => setInventorySearch("")}
                                    title="Clear search"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="ddb-actions-list-panel">
                        {filteredInventory.length > 0 ? (
                            <table className="ddb-weapons-table ddb-inventory-table">
                                <thead>
                                    <tr>
                                        <th className="th-equipped">STATUS</th>
                                        <th className="th-name">ITEM</th>
                                        <th className="th-type">TYPE</th>
                                        <th className="th-qty">QTY</th>
                                        <th className="th-weight">WEIGHT</th>
                                        <th className="th-cost">COST</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredInventory.map(item => (
                                        <tr
                                            key={item.id}
                                            className="ddb-table-row item-row"
                                            onClick={() => setDrawerItem({ type: "item", item })}
                                            title="Click to view details"
                                        >
                                            <td className="td-equipped">
                                                <div className="ddb-status-badges-stack">
                                                    {item.equipped ? (
                                                        <span className="ddb-equipped-badge">EQUIPPED</span>
                                                    ) : (
                                                        <span className="ddb-unequipped-dot">—</span>
                                                    )}
                                                    {item.isAttuned && (
                                                        <span className="ddb-attuned-badge" title="Attuned (Augment)">
                                                            ATTUNED
                                                        </span>
                                                    )}
                                                    {!item.isAttuned && (item.canAttune || item.requiresAttunement) && (
                                                        <span className="ddb-can-attune-badge" title="Requires Attunement">
                                                            ATTUNE
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="td-name">
                                                <span className="ddb-item-name">{item.name}</span>
                                                {item.rarity && item.rarity !== "Common" && (
                                                    <span className={`ddb-rarity-tag ${item.rarity.toLowerCase()}`}>
                                                        {item.rarity}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="td-type">{item.type || "Gear"}</td>
                                            <td className="td-qty">×{item.quantity}</td>
                                            <td className="td-weight">{item.weight > 0 ? `${item.weight} lb` : "—"}</td>
                                            <td className="td-cost">{item.cost !== null && item.cost !== undefined ? `${item.cost} GP` : "—"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="ddb-empty-search-state">
                                <IconSearch size={22} className="ddb-empty-search-icon" />
                                <span className="ddb-empty-search-text">No items found</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* TAB: BACKGROUND */}
            {mainTab === "BACKGROUND" && (
                <div className="ddb-tab-content-panel ddb-background-panel">
                    <div className="ddb-bg-card">
                        <div className="ddb-bg-header-row">
                            <span className="ddb-bg-title">{syncedDdbChar?.backgroundInfo?.name || "Background"}</span>
                            {syncedDdbChar?.backgroundInfo?.featureName && (
                                <span className="ddb-bg-feature-badge">Feature: {syncedDdbChar.backgroundInfo.featureName}</span>
                            )}
                        </div>
                        {syncedDdbChar?.backgroundInfo?.description && (
                            <div className="ddb-bg-desc">
                                <p>{syncedDdbChar.backgroundInfo.description}</p>
                            </div>
                        )}
                    </div>

                    <div className="ddb-characteristics-grid">
                        <div className="ddb-trait-card">
                            <span className="ddb-trait-title">PERSONALITY TRAITS</span>
                            <p className="ddb-trait-text">{syncedDdbChar?.backgroundInfo?.traits?.personalityTraits || "None defined."}</p>
                        </div>
                        <div className="ddb-trait-card">
                            <span className="ddb-trait-title">IDEALS</span>
                            <p className="ddb-trait-text">{syncedDdbChar?.backgroundInfo?.traits?.ideals || "None defined."}</p>
                        </div>
                        <div className="ddb-trait-card">
                            <span className="ddb-trait-title">BONDS</span>
                            <p className="ddb-trait-text">{syncedDdbChar?.backgroundInfo?.traits?.bonds || "None defined."}</p>
                        </div>
                        <div className="ddb-trait-card">
                            <span className="ddb-trait-title">FLAWS</span>
                            <p className="ddb-trait-text">{syncedDdbChar?.backgroundInfo?.traits?.flaws || "None defined."}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB: NOTES */}
            {mainTab === "NOTES" && (
                <div className="ddb-tab-content-panel ddb-notes-panel">
                    <div className="ddb-notes-section">
                        <span className="ddb-section-header-title">CHARACTER BACKSTORY</span>
                        <div className="ddb-notes-body-text">
                            {syncedDdbChar?.notesInfo?.backstory ? (
                                syncedDdbChar.notesInfo.backstory.split("\n\n").map((para, idx) => (
                                    <p key={idx}>{para}</p>
                                ))
                            ) : (
                                <p className="ddb-empty-notes-text">No backstory written yet.</p>
                            )}
                        </div>
                    </div>

                    {(syncedDdbChar?.notesInfo?.allies || syncedDdbChar?.notesInfo?.organizations) && (
                        <div className="ddb-notes-section">
                            <span className="ddb-section-header-title">ALLIES & ORGANIZATIONS</span>
                            <div className="ddb-notes-body-text">
                                <p>{syncedDdbChar.notesInfo.allies || syncedDdbChar.notesInfo.organizations}</p>
                            </div>
                        </div>
                    )}

                    {syncedDdbChar?.notesInfo?.enemies && (
                        <div className="ddb-notes-section">
                            <span className="ddb-section-header-title">ENEMIES</span>
                            <div className="ddb-notes-body-text">
                                <p>{syncedDdbChar.notesInfo.enemies}</p>
                            </div>
                        </div>
                    )}

                    {syncedDdbChar?.notesInfo?.otherNotes && (
                        <div className="ddb-notes-section">
                            <span className="ddb-section-header-title">OTHER NOTES</span>
                            <div className="ddb-notes-body-text">
                                <p>{syncedDdbChar.notesInfo.otherNotes}</p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* TAB: EXTRAS */}
            {mainTab === "EXTRAS" && (
                <div className="ddb-tab-content-panel ddb-extras-panel">
                    <div className="ddb-extras-empty-state">
                        <IconDragon size={28} className="ddb-extras-empty-icon" />
                        <h4 className="ddb-extras-empty-title">Extras & Companions</h4>
                        <p className="ddb-extras-empty-desc">
                            Summoned creatures, familiars, wild shapes, pets, and sidekicks linked to {casterName} will appear here.
                        </p>
                    </div>
                </div>
            )}
                    </div>
                )}

                {/* ========================================================= */}
                {/* 5. SLIDE-OUT DETAIL DRAWER (Matches Screenshot 1 & 5)      */}
                {/* ========================================================= */}
                {drawerItem && (
                    <div className={`ddb-detail-drawer ${drawerItem.type === "checks" ? "checks-mode" : ""}`}>
                        <div className="ddb-drawer-header">
                            <div className="ddb-drawer-header-top">
                                <span className="ddb-drawer-category">
                                    {drawerItem.type === "feature"
                                        ? (drawerItem.category || "Feature Action")
                                        : drawerItem.type === "weapon"
                                        ? (drawerItem.weapon.type === "melee" ? "Melee Weapon" : "Ranged Weapon")
                                        : drawerItem.type === "spell"
                                        ? (drawerItem.spell.level === 0 ? "Cantrip" : `${getOrdinal(drawerItem.spell.level)} Level • ${drawerItem.spell.school}`)
                                        : drawerItem.type === "item"
                                        ? "Inventory Item"
                                        : drawerItem.type === "checks"
                                        ? "Ability Checks & Saves"
                                        : drawerItem.type === "ac"
                                        ? "Armor Class"
                                        : drawerItem.type === "hp"
                                        ? "Hit Points"
                                        : drawerItem.type === "log"
                                        ? "D&D Beyond Game Log"
                                        : "Defenses"}
                                </span>
                                <button
                                    type="button"
                                    className="ddb-drawer-close-btn"
                                    onClick={() => setDrawerItem(null)}
                                    title="Close Drawer"
                                >
                                    ✕
                                </button>
                            </div>
                            <h3 className="ddb-drawer-title">
                                {drawerItem.type === "feature"
                                    ? drawerItem.name
                                    : drawerItem.type === "weapon"
                                    ? drawerItem.weapon.name
                                    : drawerItem.type === "spell"
                                    ? drawerItem.spell.name
                                    : drawerItem.type === "item"
                                    ? drawerItem.item.name
                                    : drawerItem.type === "checks"
                                    ? "Character Checks & Saves"
                                    : drawerItem.type === "ac"
                                    ? `Armor Class: ${drawerItem.ac}`
                                    : drawerItem.type === "hp"
                                    ? `Hit Points: ${drawerItem.current} / ${drawerItem.max}`
                                    : drawerItem.type === "log"
                                    ? `Game Log • ${casterName}`
                                    : "Defenses & Resistances"}
                            </h3>
                            {drawerItem.type === "item" && (
                                <div className="ddb-drawer-meta-row">
                                    <span className="ddb-drawer-badge">Qty: {drawerItem.item.quantity}</span>
                                    <span className="ddb-drawer-badge">{drawerItem.item.type || "Gear"}</span>
                                    <span className="ddb-drawer-badge">{drawerItem.item.rarity || "Common"}</span>
                                    {drawerItem.item.weight > 0 && <span className="ddb-drawer-badge">{drawerItem.item.weight} lb</span>}
                                    {drawerItem.item.cost !== null && drawerItem.item.cost !== undefined && <span className="ddb-drawer-badge">{drawerItem.item.cost} GP</span>}
                                    {drawerItem.item.isAttuned && <span className="ddb-drawer-badge attuned">Attuned ({attunedCount}/3)</span>}
                                    {!drawerItem.item.isAttuned && (drawerItem.item.canAttune || drawerItem.item.requiresAttunement) && (
                                        <span className="ddb-drawer-badge can-attune">Requires Attunement</span>
                                    )}
                                </div>
                            )}
                            {drawerItem.type === "feature" && (
                                <div className="ddb-drawer-meta-row">
                                    <span className="ddb-drawer-badge">
                                        Action: {drawerItem.activationType === "bonus" ? "1 Bonus Action" : drawerItem.activationType === "reaction" ? "Reaction" : drawerItem.activationType === "action" ? "1 Action" : "Special"}
                                    </span>
                                    {drawerItem.rangeText && !drawerItem.rangeText.startsWith("--") && (
                                        <span className="ddb-drawer-badge">Range: {drawerItem.rangeText}</span>
                                    )}
                                </div>
                            )}
                            {drawerItem.type === "weapon" && (
                                <div className="ddb-drawer-meta-row">
                                    <span className="ddb-drawer-badge">To Hit: +{drawerItem.weapon.toHit}</span>
                                    <span className="ddb-drawer-badge">Range: {drawerItem.weapon.rangeText}</span>
                                    <span className="ddb-drawer-badge">Damage: {drawerItem.weapon.damage} {drawerItem.weapon.damageType}</span>
                                </div>
                            )}
                            {drawerItem.type === "spell" && (
                                <div className="ddb-drawer-meta-row">
                                    <span className="ddb-drawer-badge">Time: {drawerItem.spell.castingTime}</span>
                                    <span className="ddb-drawer-badge">Range: {drawerItem.spell.rangeText}</span>
                                    {drawerItem.spell.hitOrDc && <span className="ddb-drawer-badge">{drawerItem.spell.hitOrDc}</span>}
                                </div>
                            )}
                        </div>

                        <div className="ddb-drawer-scrollable" role="region" aria-label="Details" tabIndex={0}>
                            {drawerItem.type === "feature" && (
                                <div className="ddb-drawer-feature-content">
                                    {drawerItem.name.toLowerCase().includes("innate sorcery") && (
                                        <div className="ddb-innate-sorcery-callout">
                                            <div className="ddb-callout-card">
                                                <h4 className="ddb-callout-title">Activate Innate Sorcery</h4>
                                                <p className="ddb-callout-para">
                                                    You unleash that magic for 1 minute, during which you gain the following benefits:
                                                </p>
                                                <ul className="ddb-callout-list">
                                                    <li>The spell save DC of your Sorcerer spells increases by 1.</li>
                                                    <li>You have Advantage on the attack rolls of Sorcerer spells you cast.</li>
                                                </ul>
                                                <div className="ddb-callout-action-info">
                                                    <span>Innate Sorcery: 1 Bonus Action</span>
                                                </div>
                                                <div className="ddb-callout-uses-row">
                                                    <span className="ddb-usage-label">Uses:</span>
                                                    <div className="ddb-feature-use-boxes">
                                                        {Array.from({ length: drawerItem.limitedUse?.max || 2 }).map((_, idx) => {
                                                            const usedCount = featureUses[drawerItem.id] ?? (drawerItem.limitedUse?.used ?? 0);
                                                            return (
                                                                <button
                                                                    key={idx}
                                                                    type="button"
                                                                    className={`ddb-square-use-box ${idx < usedCount ? "checked" : ""}`}
                                                                    onClick={() => handleToggleFeatureBox({ id: drawerItem.id, limitedUse: drawerItem.limitedUse }, idx)}
                                                                    title={`Use ${idx + 1}`}
                                                                />
                                                            );
                                                        })}
                                                        <span className="ddb-reset-label">/ {drawerItem.limitedUse?.resetType || "Long Rest"}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="ddb-drawer-option-block">
                                                <h4 className="ddb-drawer-option-heading">OPTION</h4>
                                                <div className="ddb-option-select-box">
                                                    <div className="ddb-option-trigger">
                                                        <span>Activate Innate Sorcery</span>
                                                        <span className="ddb-option-arrow">▲</span>
                                                    </div>
                                                    <div className="ddb-option-dropdown-panel">
                                                        <div className="ddb-option-dropdown-header">- Choose a Level 1 Option -</div>
                                                        <button
                                                            type="button"
                                                            className={`ddb-option-dropdown-item ${activeBuffs.some(b => b.name.toLowerCase().includes("innate sorcery")) ? "active" : ""}`}
                                                            onClick={() => handleActivateFeature(drawerItem)}
                                                        >
                                                            <span className="ddb-option-checkmark">✓</span>
                                                            <span>Activate Innate Sorcery</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {drawerItem.rawDescription ? (
                                        <div className="ddb-rich-desc" dangerouslySetInnerHTML={{ __html: drawerItem.rawDescription }} />
                                    ) : (
                                        <p className="ddb-drawer-para">{drawerItem.description}</p>
                                    )}
                                    {drawerItem.limitedUse && drawerItem.limitedUse.max > 0 && !drawerItem.name.toLowerCase().includes("innate sorcery") && (
                                        <div className="ddb-drawer-usage-section">
                                            <span className="ddb-usage-label">Uses:</span>
                                            <div className="ddb-feature-use-boxes">
                                                {Array.from({ length: drawerItem.limitedUse.max }).map((_, idx) => {
                                                    const usedCount = featureUses[drawerItem.id] ?? (drawerItem.limitedUse?.used ?? 0);
                                                    return (
                                                        <button
                                                            key={idx}
                                                            type="button"
                                                            className={`ddb-square-use-box ${idx < usedCount ? "checked" : ""}`}
                                                            onClick={() => handleToggleFeatureBox({ id: drawerItem.id, limitedUse: drawerItem.limitedUse }, idx)}
                                                            title={`Use ${idx + 1}`}
                                                        />
                                                    );
                                                })}
                                                <span className="ddb-reset-label">/ {drawerItem.limitedUse.resetType || "Long Rest"}</span>
                                            </div>
                                        </div>
                                    )}
                                    {drawerItem.name.toLowerCase().includes("font of magic") && syncedDdbChar?.classes.some(characterClass => characterClass.name.toLowerCase().includes("sorcerer")) && (() => {
                                        const formula = SORCERER_CLASS_FORMULAS.fontOfMagic.operations.find(operation => operation.type === "create_spell_slot");
                                        const sorcererLevel = syncedDdbChar.classes
                                            .filter(characterClass => characterClass.name.toLowerCase().includes("sorcerer"))
                                            .reduce((total, characterClass) => total + characterClass.level, 0);
                                        const usedPoints = featureUses[drawerItem.id] ?? drawerItem.limitedUse?.used ?? 0;
                                        const availablePoints = getAvailableSorceryPoints(drawerItem.limitedUse?.max ?? sorcererLevel, usedPoints);

                                        return (
                                            <div className="ddb-font-magic-actions">
                                                <section className="ddb-font-magic-action-group">
                                                    <div className="ddb-font-magic-group-heading">
                                                        <h4>Convert Spell Slot</h4>
                                                        <span>No Action</span>
                                                    </div>
                                                    <p>You can’t have more Sorcery Points than the maximum for your Sorcerer level.</p>
                                                    <div className="ddb-font-magic-current-points">
                                                        Sorcery Points: <strong>{availablePoints}</strong> / {drawerItem.limitedUse?.max ?? sorcererLevel}
                                                    </div>
                                                    <div className="ddb-font-magic-button-list">
                                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].flatMap(level => {
                                                            const slot = spellSlots[level];
                                                            if (!slot || slot.max <= slot.used) return [];
                                                            const canConvert = canConvertSlotToSorceryPoints(drawerItem.limitedUse?.max ?? sorcererLevel, usedPoints, level);
                                                            return [
                                                                <button
                                                                    key={`slot-${level}`}
                                                                    type="button"
                                                                    className="ddb-font-magic-action-btn"
                                                                    disabled={!canConvert}
                                                                    onClick={() => handleConvertSlotToSorceryPoints(level)}
                                                                >
                                                                    Level {level} slot <span>+{level} SP</span>
                                                                </button>
                                                            ];
                                                        })}
                                                        {pactSlots.max > pactSlots.used && syncedDdbChar.pactMagic && (
                                                            <button
                                                                key="pact-slot"
                                                                type="button"
                                                                className="ddb-font-magic-action-btn"
                                                                disabled={!canConvertSlotToSorceryPoints(drawerItem.limitedUse?.max ?? sorcererLevel, usedPoints, syncedDdbChar.pactMagic.level)}
                                                                onClick={() => handleConvertSlotToSorceryPoints(syncedDdbChar.pactMagic!.level, true)}
                                                            >
                                                                Pact level {syncedDdbChar.pactMagic.level} <span>+{syncedDdbChar.pactMagic.level} SP</span>
                                                            </button>
                                                        )}
                                                        {Object.values(spellSlots).every(slot => slot.max <= slot.used) && pactSlots.max <= pactSlots.used && (
                                                            <span className="ddb-font-magic-empty">No spell slots available.</span>
                                                        )}
                                                        {availablePoints === 0 && (Object.values(spellSlots).some(slot => slot.max > slot.used) || pactSlots.max > pactSlots.used) && (
                                                            <span className="ddb-font-magic-empty">Sorcery Points are at their maximum.</span>
                                                        )}
                                                    </div>
                                                </section>

                                                <section className="ddb-font-magic-action-group">
                                                    <div className="ddb-font-magic-group-heading">
                                                        <h4>Create Spell Slot</h4>
                                                        <span>Bonus Action · {availablePoints} SP available</span>
                                                    </div>
                                                    <p>Created slots disappear when you finish a Long Rest.</p>
                                                    <div className="ddb-font-magic-button-list">
                                                        {formula?.type === "create_spell_slot" && formula.options.map(option => {
                                                            const meetsLevel = sorcererLevel >= option.minimumClassLevel;
                                                            return (
                                                                <button
                                                                    key={`create-${option.slotLevel}`}
                                                                    type="button"
                                                                    className="ddb-font-magic-action-btn"
                                                                    disabled={!meetsLevel || availablePoints < option.pointCost}
                                                                    onClick={() => handleCreateSorcererSpellSlot(option.slotLevel, option.pointCost, option.minimumClassLevel)}
                                                                    title={!meetsLevel ? `Requires Sorcerer level ${option.minimumClassLevel}.` : undefined}
                                                                >
                                                                    Level {option.slotLevel} slot <span>{option.pointCost} SP</span>
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </section>
                                            </div>
                                        );
                                    })()}
                                </div>
                            )}

                            {drawerItem.type === "weapon" && (
                                <div className="ddb-drawer-weapon-content">
                                    <p className="ddb-drawer-para"><strong>Properties:</strong> {drawerItem.weapon.properties.join(", ") || "None"}</p>
                                    {drawerItem.weapon.cantripRiders && drawerItem.weapon.cantripRiders.length > 0 && (
                                        <div className="ddb-drawer-riders-section">
                                            <h4 className="ddb-drawer-subtitle">Weapon Cantrip Riders</h4>
                                            <div className="ddb-rider-chips-wrap">
                                                {drawerItem.weapon.cantripRiders.map((r, idx) => {
                                                    const parsed = parseRiderString(r);
                                                    const isSelected = activeRiderMap[drawerItem.weapon.id] === parsed.name;
                                                    return (
                                                        <button
                                                            key={idx}
                                                            type="button"
                                                            className={`ddb-rider-pill ${isSelected ? "selected" : ""}`}
                                                            onClick={() => handleRiderClick(drawerItem.weapon, parsed)}
                                                        >
                                                            <span className="rider-icon">{parsed.icon}</span>
                                                            <span className="rider-label">{parsed.name}: {parsed.damage}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {drawerItem.type === "spell" && (() => {
                                const formula = spellRegistry?.get(drawerItem.spell.id) ?? resolveSpellFormula(drawerItem.spell);
                                return (
                                    <div className="ddb-drawer-spell-content">
                                        {formula ? (
                                            <SpellFormulaDisplay
                                                formula={formula}
                                                charLevel={syncedDdbChar?.level ?? 1}
                                                selectedDamageType={spellDamageTypeOverrides[drawerItem.spell.id] as DamageType | undefined}
                                                onSelectDamageType={(chosen) => {
                                                    setSpellDamageTypeOverrides(prev => ({
                                                        ...prev,
                                                        [drawerItem.spell.id]: chosen
                                                    }));
                                                }}
                                            />
                                        ) : (
                                            <>
                                                <p className="ddb-drawer-para"><strong>Components:</strong> {drawerItem.spell.notes || "V, S"}</p>
                                                <p className="ddb-drawer-para"><strong>Duration:</strong> {drawerItem.spell.rawDdbSpell?.duration || "Instantaneous"}</p>
                                            </>
                                        )}
                                        {drawerItem.spell.rawDdbSpell?.description ? (
                                            <div className="ddb-drawer-spell-desc" style={{ marginTop: "8px" }}>
                                                <p>{drawerItem.spell.rawDdbSpell.description}</p>
                                            </div>
                                        ) : (
                                            <div className="ddb-drawer-spell-desc">
                                                <p>Select this spell to aim and cast on the battlefield.</p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })()}

                            {drawerItem.type === "ac" && (
                                <div className="ddb-drawer-ac-content">
                                    <ul className="ddb-ac-breakdown-list">
                                        {drawerItem.breakdown.map((b, idx) => (
                                            <li key={idx}><strong>{b.value}</strong> <span>{b.label}</span></li>
                                        ))}
                                    </ul>
                                    <p className="ddb-ac-explanation">{drawerItem.description}</p>
                                </div>
                            )}

                            {drawerItem.type === "hp" && (
                                <div className="ddb-drawer-hp-content">
                                    <div className="ddb-hp-drawer-grid">
                                        <div className="ddb-hp-stat-card">
                                            <span className="ddb-hp-label">CURRENT</span>
                                            <span className="ddb-hp-val">{drawerItem.current}</span>
                                        </div>
                                        <div className="ddb-hp-stat-card">
                                            <span className="ddb-hp-label">MAX</span>
                                            <span className="ddb-hp-val">{drawerItem.max}</span>
                                        </div>
                                        <div className="ddb-hp-stat-card">
                                            <span className="ddb-hp-label">TEMP</span>
                                            <span className="ddb-hp-val">{drawerItem.temp || "--"}</span>
                                        </div>
                                    </div>
                                    <div className="ddb-hp-quick-buttons">
                                        <button type="button" className="ddb-hp-btn heal" onClick={() => handleHpHeal(5)}>+5 Heal</button>
                                        <button type="button" className="ddb-hp-btn dmg" onClick={() => handleHpDamage(5)}>-5 Damage</button>
                                    </div>

                                    {/* Hit Dice Short Rest Healing */}
                                    {syncedDdbChar?.hitDice && syncedDdbChar.hitDice.length > 0 && (
                                        <div style={{ marginTop: "12px", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "8px" }}>
                                            <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#38bdf8", letterSpacing: "0.05em", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                                                <IconHitDice size={12} /> SHORT REST HIT DICE:
                                            </span>
                                            {syncedDdbChar.hitDice.map(hd => {
                                                const used = hitDiceUsed[hd.die] || 0;
                                                const remaining = Math.max(0, hd.total - used);
                                                const sides = parseInt(hd.die.replace("d", ""), 10) || 8;
                                                return (
                                                    <div key={hd.die} className="ddb-hit-dice-group">
                                                        <span style={{ fontSize: "0.72rem", color: "#cbd5e1" }}>
                                                            {hd.die}: <strong>{remaining}/{hd.total}</strong> left
                                                        </span>
                                                        <button
                                                            type="button"
                                                            className="ddb-hit-dice-roll-btn"
                                                            disabled={remaining <= 0}
                                                            onClick={() => handleRollHitDie(hd.die, sides)}
                                                        >
                                                            Spend & Roll ({hd.die}+{syncedDdbChar.modifiers.con})
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}

                            {drawerItem.type === "defenses" && (
                                <div className="ddb-drawer-defenses-content">
                                    <h4 className="ddb-drawer-subtitle">Resistances</h4>
                                    <p className="ddb-drawer-para">{drawerItem.resistances.length > 0 ? drawerItem.resistances.join(", ") : "None"}</p>
                                    <h4 className="ddb-drawer-subtitle">Damage Immunities</h4>
                                    <p className="ddb-drawer-para">{drawerItem.immunities.length > 0 ? drawerItem.immunities.join(", ") : "None"}</p>
                                    <h4 className="ddb-drawer-subtitle">Condition Immunities</h4>
                                    <p className="ddb-drawer-para">{drawerItem.vulnerabilities.length > 0 ? drawerItem.vulnerabilities.join(", ") : "None"}</p>
                                </div>
                            )}

                            {drawerItem.type === "item" && (
                                <div className="ddb-drawer-item-content">
                                    <h4 className="ddb-drawer-subtitle">{drawerItem.item.type || "Gear"}</h4>
                                    <p className="ddb-drawer-para">{drawerItem.item.description || "No description provided."}</p>
                                </div>
                            )}

                            {drawerItem.type === "checks" && (
                                <div className="ddb-drawer-checks-embed">
                                    <CharacterChecks passedChar={syncedDdbChar} />
                                </div>
                            )}

                            {drawerItem.type === "log" && (
                                <div className="ddb-drawer-log-embed" style={{ padding: "6px 2px", display: "flex", flexDirection: "column", gap: "8px" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 6px 4px" }}>
                                        <span style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8" }}>
                                            {rollHistory.length} Recorded Roll{rollHistory.length === 1 ? "" : "s"}
                                        </span>
                                        {rollHistory.length > 0 && (
                                            <button
                                                type="button"
                                                style={{
                                                    background: "rgba(255, 255, 255, 0.06)",
                                                    border: "1px solid rgba(255, 255, 255, 0.12)",
                                                    color: "#94a3b8",
                                                    fontSize: "11px",
                                                    padding: "2px 8px",
                                                    borderRadius: "4px",
                                                    cursor: "pointer"
                                                }}
                                                onClick={() => {
                                                    setRollHistory([]);
                                                    clearStoredRollHistory();
                                                }}
                                            >
                                                Clear History
                                            </button>
                                        )}
                                    </div>
                                    {rollHistory.length === 0 ? (
                                        <div style={{ padding: "40px 16px", textAlign: "center", color: "#64748b", fontSize: "12px", lineHeight: "1.6" }}>
                                            No dice rolls recorded yet.<br />
                                            Rolls from attacks, checks, saving throws, spells, or the dice roller will appear here in authentic D&D Beyond format.
                                        </div>
                                    ) : (
                                        rollHistory.map(card => (
                                            <DDBRollCard key={card.id} data={card} />
                                        ))
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="ddb-drawer-actions-bar">
                            {drawerItem.type === "weapon" && (
                                <>
                                    <button
                                        type="button"
                                        className="ddb-drawer-action-btn primary"
                                        onClick={() => handleWeaponAttackRoll(drawerItem.weapon)}
                                    >
                                        <IconDiceD20 size={12} />
                                        <span>Roll Attack (+{drawerItem.weapon.toHit})</span>
                                    </button>
                                    <button
                                        type="button"
                                        className="ddb-drawer-action-btn"
                                        onClick={() => handleWeaponDamageRoll(drawerItem.weapon, activeRiderMap[drawerItem.weapon.id])}
                                    >
                                        <IconFire size={12} />
                                        <span>Roll Damage ({drawerItem.weapon.damage})</span>
                                    </button>
                                    <button
                                        type="button"
                                        className="ddb-drawer-action-btn"
                                        onClick={() => handleSelectWeapon(drawerItem.weapon, "melee")}
                                    >
                                        <span>Aim</span>
                                    </button>
                                </>
                            )}
                            {drawerItem.type === "spell" && (
                                <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: "6px" }}>
                                    {drawerItem.spell.level > 0 && getAvailableSlotLevels(drawerItem.spell.level).length > 1 && (
                                        <div className="ddb-drawer-slot-picker">
                                            <span className="ddb-upcast-picker-label">Cast with Slot Level:</span>
                                            <div className="ddb-upcast-levels">
                                                {getAvailableSlotLevels(drawerItem.spell.level).map(lvl => {
                                                    const rem = getRemainingSlots(lvl);
                                                    const isPact = Boolean(syncedDdbChar?.pactMagic && lvl === syncedDdbChar.pactMagic.level);
                                                    return (
                                                        <button
                                                            key={lvl}
                                                            type="button"
                                                            className={[
                                                                "ddb-upcast-lvl-btn",
                                                                castLevel === lvl ? "selected" : "",
                                                                rem === 0 ? "exhausted" : "",
                                                                isPact ? "pact" : ""
                                                            ].filter(Boolean).join(" ")}
                                                            disabled={rem === 0}
                                                            onClick={() => setCastLevel(lvl)}
                                                            title={`${rem} slot${rem !== 1 ? "s" : ""} remaining`}
                                                        >
                                                            <span className="ddb-upcast-lvl-num">{lvl}</span>
                                                            <span className="ddb-upcast-lvl-remain">{rem} left</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                     <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                                        {drawerItem.spell.hitOrDc && drawerItem.spell.hitOrDc.startsWith("+") && (
                                            <button
                                                type="button"
                                                className="ddb-drawer-action-btn"
                                                onClick={() => handleSpellAttackRoll(drawerItem.spell)}
                                            >
                                                <IconDiceD20 size={12} />
                                                <span>Attack ({drawerItem.spell.hitOrDc})</span>
                                            </button>
                                        )}
                                        {drawerItem.spell.damage && (
                                            <button
                                                type="button"
                                                className="ddb-drawer-action-btn"
                                                onClick={() => handleSpellDamageRoll(drawerItem.spell)}
                                            >
                                                <IconFire size={12} />
                                                <span>Damage ({drawerItem.spell.damage})</span>
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            className="ddb-drawer-action-btn primary"
                                            disabled={drawerItem.spell.level > 0 && getRemainingSlots(castLevel) === 0}
                                            onClick={() => handleCastClick(drawerItem.spell.id, castLevel)}
                                        >
                                            <IconCastLightning size={12} />
                                            <span>
                                                {drawerItem.spell.level > 0 && castLevel > drawerItem.spell.level
                                                    ? `Cast at Level ${castLevel}`
                                                    : "Cast Spell"}
                                            </span>
                                        </button>
                                        <button
                                            type="button"
                                            className="ddb-drawer-action-btn"
                                            onClick={() => handleSelectSpell(drawerItem.spell.id)}
                                        >
                                            <span>Aim Target</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                            {drawerItem.type === "feature" && isActivatableBuffFeature(drawerItem.name) && (
                                <button
                                    type="button"
                                    className={`ddb-drawer-action-btn ${activeBuffs.some(b => b.name.toLowerCase() === drawerItem.name.toLowerCase() || b.id === drawerItem.id || (b.id === "innate_sorcery" && drawerItem.name.toLowerCase().includes("innate sorcery"))) ? "secondary active-buff-btn" : "primary"}`}
                                    onClick={() => handleActivateFeature(drawerItem)}
                                >
                                    <IconFire size={12} />
                                    <span>
                                        {activeBuffs.some(b => b.name.toLowerCase() === drawerItem.name.toLowerCase() || b.id === drawerItem.id || (b.id === "innate_sorcery" && drawerItem.name.toLowerCase().includes("innate sorcery")))
                                            ? `Active: Deactivate ${drawerItem.name}`
                                            : `Activate ${drawerItem.name}`}
                                    </span>
                                </button>
                            )}
                            {drawerItem.type === "item" && (drawerItem.item.canAttune || drawerItem.item.requiresAttunement || drawerItem.item.isAttuned) && (
                                <button
                                    type="button"
                                    className={`ddb-drawer-action-btn ${drawerItem.item.isAttuned ? "secondary" : "primary"}`}
                                    onClick={() => handleToggleItemAttunement(drawerItem.item)}
                                >
                                    <span>{drawerItem.item.isAttuned ? "Unattune Item" : "Attune Item"}</span>
                                </button>
                            )}
                            {drawerItem.type === "log" && (
                                <button
                                    type="button"
                                    className="ddb-drawer-action-btn"
                                    disabled={rollHistory.length === 0}
                                    onClick={() => {
                                        setRollHistory([]);
                                        clearStoredRollHistory();
                                    }}
                                >
                                    <span>Clear All Rolls</span>
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div> {/* end ddb-action-content-workspace */}
        </main> {/* end ddb-action-deck-main */}
    </div> {/* end ddb-dock-2col-layout */}

            </div> {/* end ddb-action-sheet-container */}
        </div>
    );
};

export default ActionDock;
