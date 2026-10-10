import React, { useCallback, useEffect, useState, useMemo } from "react";
import "./ActionDock.css";
import OBR, { isImage } from "@owlbear-rodeo/sdk";
import { spellIDs } from "../../effects/spells";
import { getCharacterFeatures } from "../../features/characterFeatures/domain/characterFeatureCatalog";
import {
    getSpellMetadata,
    registerDynamicSpells,
} from "../../assets/spellInfo";
import { setSelectedSpell, toolID, toolMetadataSelectedSpell, targetHighlightMetadataKey, stopAiming, hexChosenAbilityMetadataKey, selectedSpellDamageTypeMetadataKey, selectedSpellSlotLevelMetadataKey } from "../../effectsTool";
import { openSpellDetailModal } from "../../views/SpellDetailModal";
import { spellPopoverId } from "../../views/SpellSelectionPopover";
import { useOBR } from "../../platform/obr/react/providers/BaseOBRProvider";
import {
    IconDiceD20,
    IconSearch,
    IconClose,
    IconGrid,
    IconList,
} from "./shared/Bg3Icons";
import { focusCameraOnToken, isTokenOwnedByPlayer, getOtherClaimedPlayer, getMyPrimaryCharacterToken } from "../../features/player/playerCharacterService";
import {
    cacheDDBCharacter,
    ddbSpellToMetadata
} from "../../services/ddbService";
import { DDBParsedCharacter, DDBWeaponAttack, DDBFeatureAction, DDBParsedSpell } from "../../types/ddb";
import { openDDBSyncModal } from "../../views/DDBSyncModal";
import { clearStoredRollHistory, broadcastDDBRoll } from "../../services/rollLogService";
import type { DDBRollCardData } from "../../types/ddbRollLog";
import { rollFormula, combineDamageBonus } from "../../utils/dice";
import type { DamageType } from "../../types/spellFormula";
import { removeTokenBuff, getComputedBuffModifiers } from "../../services/buffService";
import { CustomDiceRoller } from "./overlays/CustomDiceRoller";
import "./overlays/CustomDiceRoller.css";
import {
    saveCombatState,
    COMBAT_STATE_STORAGE_PREFIX,
    EmbersCombatState
} from "../../services/combatStateService";
import { resolveSpellFormula } from "../../services/spellFormulaBuilder";
import { buildRegistry, setActiveRegistry } from "../../services/spellFormulaRegistry";
import { BG3FlyoutBar } from "./overlays/BG3FlyoutBar";
import { getFeatureFlyoutKind, findMatchingActionFormula } from "../../assets/manual-formulas";
import { resolveWeaponRiders } from "../../services/weaponDamageRiders";
import "./overlays/BG3FlyoutBar.css";
import { ActionGridTooltipProvider } from "./actions/ActionGridTile";
import { DEFAULT_WEAPONS } from "./domain/constants";
import { closeActionDock } from "./domain/popover";
import type { ActionsFilter, DetailDrawerItem, FeaturesFilter, InventoryFilter, MainTab, SpellSlotConfig, SpellsFilter } from "./domain/types";
import { useRollHistory } from "./hooks/useRollHistory";
import { useDockSizing } from "./hooks/useDockSizing";
import { InventoryTab } from "./character/InventoryTab";
import { BackgroundTab, ExtrasTab, NotesTab } from "./character/CharacterInfoTabs";
import { SpellsTab } from "./actions/SpellsTab";
import { FeatureActionCard } from "./actions/FeatureActionCard";
import { FeaturesTab } from "./actions/FeaturesTab";
import { ActionDockDetailDrawer } from "./drawer/ActionDockDetailDrawer";
import { useCombatStatePersistence } from "./hooks/useCombatStatePersistence";
import { useActiveCaster } from "./hooks/useActiveCaster";
import { UpcastPickerRow } from "./overlays/UpcastPickerRow";
import { ActionDockVitalsRail } from "./character/ActionDockVitalsRail";
import { TurnResourceBar } from "./character/TurnResourceBar";
import { Bg3SpellCard } from "./actions/Bg3SpellCard";
import { Bg3WeaponCard } from "./actions/Bg3WeaponCard";
import { Bg3CombatActionCard } from "./actions/Bg3CombatActionCard";
import { Bg3FeatureCard } from "./actions/Bg3FeatureCard";
import { Bg3GridContent } from "./actions/Bg3GridContent";
import { useActionLists } from "./hooks/useActionLists";
import { useCharacterTabData } from "./hooks/useCharacterTabData";
import { useFeatureFlyoutData } from "./hooks/useFeatureFlyoutData";
import { useHitPoints } from "./hooks/useHitPoints";
import { useCombatActionHandlers } from "./hooks/useCombatActionHandlers";
import { useSpellSelection } from "./hooks/useSpellSelection";
import { useInventoryAttunement } from "./hooks/useInventoryAttunement";
import { ActionsTabPanel } from "./actions/ActionsTabPanel";
import { useSpellCasting } from "./hooks/useSpellCasting";
import { useWeaponRollHandlers } from "./hooks/useWeaponRollHandlers";
import { useSpellDamageRoll } from "./hooks/useSpellDamageRoll";
import { useSpellAttackRoll } from "./hooks/useSpellAttackRoll";
import { useFeatureActivation } from "./hooks/useFeatureActivation";
import { useSpellResourceHandlers } from "./hooks/useSpellResourceHandlers";

export { getFeatureFlyoutKind };
export {
    actionDockPopoverId,
    closeActionDock,
    DOCK_SAVED_HEIGHT_KEY,
    getSavedDockHeight,
    openActionDock,
    RESOURCE_TRAY_FLOAT_HEIGHT,
    toggleActionDock,
} from "./domain/popover";
export type { DetailDrawerItem } from "./domain/types";

export const ActionDock: React.FC = () => {
    const obr = useOBR();

    const [mainTab, setMainTab] = useState<MainTab>("ACTIONS");
    const [isResourceTrayOpen, setIsResourceTrayOpen] = useState<boolean>(() => {
        try {
            const saved = localStorage.getItem("embers:action-dock-resources-open");
            if (saved !== null) return saved === "true";
        } catch {}
        return true;
    });
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


    // Detail Drawer & Character sheet interactive state
    const [drawerItem, setDrawerItem] = useState<DetailDrawerItem>(null);
    const [heroicInspiration, setHeroicInspiration] = useState<boolean>(false);
    const [customHp, setCustomHp] = useState<{ current: number; max: number; temp: number } | null>(null);
    const [isDiceRollerOpen, setIsDiceRollerOpen] = useState<boolean>(false);

    // Combat Trackers
    const [concentrationSpell, setConcentrationSpell] = useState<{ id: string; name: string } | null>(null);
    const [deathSaves, setDeathSaves] = useState<{ successes: number; failures: number }>({ successes: 0, failures: 0 });
    const [hitDiceUsed, setHitDiceUsed] = useState<Record<string, number>>({});
    const [exhaustionLevel, setExhaustionLevel] = useState<number>(0);
    const [conditions, setConditions] = useState<string[]>([]);
    const [isConditionsMenuOpen, setIsConditionsMenuOpen] = useState<boolean>(false);

    // UI: Resize & Spell Slot Picker
    const { panelHeight, isDraggingHeight, handleResizeStart, handleToggleExpandHeight } = useDockSizing();
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
    const { rollHistory, setRollHistory, unreadRolls, setUnreadRolls } = useRollHistory(obr.ready);

    // BG3 / DDB Action & Spell Slot tracking
    const [actionUsed, setActionUsed] = useState(false);
    const [bonusActionUsed, setBonusActionUsed] = useState(false);
    const [spellSlots, setSpellSlots] = useState<Record<number, SpellSlotConfig>>({});
    const [createdSpellSlots, setCreatedSpellSlots] = useState<Record<number, number>>({});
    const [pactSlots, setPactSlots] = useState<SpellSlotConfig>({ max: 0, used: 0 });



    const applyDdbSlots = useCallback((char: DDBParsedCharacter) => {
        const isCaster = (char.casterLevel ?? 0) > 0 || (char.classes || []).some(c =>
            ["wizard", "sorcerer", "cleric", "druid", "bard", "paladin", "ranger", "artificer"].includes(c.name.toLowerCase()) ||
            c.subclass?.toLowerCase().includes("eldritch knight") ||
            c.subclass?.toLowerCase().includes("arcane trickster")
        );
        if (isCaster && char.spellSlots) {
            const newSlots: Record<number, SpellSlotConfig> = {};
            for (let lvl = 1; lvl <= 9; lvl++) {
                const s = char.spellSlots[lvl];
                newSlots[lvl] = {
                    max: s ? s.max : 0,
                    used: s ? s.used : 0
                };
            }
            setSpellSlots(newSlots);
        } else {
            setSpellSlots({});
        }
        if (char.pactMagic) {
            setPactSlots({
                max: char.pactMagic.max,
                used: char.pactMagic.used
            });
        } else {
            setPactSlots({ max: 0, used: 0 });
        }
        if (char.heroicInspiration !== undefined) {
            setHeroicInspiration(Boolean(char.heroicInspiration));
        }
    }, [setSpellSlots, setPactSlots, setHeroicInspiration]);

    const {
        caster,
        selectedSpell,
        syncedDdbChar,
        activeBuffs,
        isSyncing,
        resyncCharacter,
        setSelectedSpell: setSelected,
        setSyncedDdbChar,
        setActiveBuffs,
    } = useActiveCaster(applyDdbSlots);
    const buffMods = useMemo(() => getComputedBuffModifiers(activeBuffs), [activeBuffs]);

    const [riderChoice, setRiderChoice] = useState<string | undefined>(undefined);
    const [aimingWeapon, setAimingWeapon] = useState<DDBWeaponAttack | null>(null);

    useEffect(() => {
        setRiderChoice(undefined);
        setAimingWeapon(null);
    }, [syncedDdbChar?.id, caster?.id]);

    useEffect(() => {
        if (!syncedDdbChar) {
            setPactSlots({ max: 0, used: 0 });
            setSpellSlots({});
        }
    }, [syncedDdbChar]);

    useEffect(() => {
        if (!syncedDdbChar?.pactMagic && spellsFilter === "PACT") {
            setSpellsFilter("ALL");
        }
    }, [syncedDdbChar?.pactMagic, spellsFilter]);

    useCombatStatePersistence({
        character: syncedDdbChar,
        spellSlots,
        setSpellSlots,
        createdSpellSlots,
        setCreatedSpellSlots,
        pactSlots,
        setPactSlots,
        featureUses,
        setFeatureUses,
        customHp,
        setCustomHp,
        actionUsed,
        setActionUsed,
        bonusActionUsed,
        setBonusActionUsed,
        heroicInspiration,
        setHeroicInspiration,
        concentrationSpell,
        setConcentrationSpell,
        deathSaves,
        setDeathSaves,
        hitDiceUsed,
        setHitDiceUsed,
        exhaustionLevel,
        setExhaustionLevel,
        conditions,
        setConditions,
    });

    const {
        toggleSlotPip,
        handleConvertSlotToSorceryPoints,
        handleCreateSorcererSpellSlot,
        togglePactPip,
        toggleClassResource,
        handleLongRest,
    } = useSpellResourceHandlers({
        character: syncedDdbChar,
        drawerItem,
        featureUses,
        setFeatureUses,
        spellSlots,
        setSpellSlots,
        pactSlots,
        setPactSlots,
        createdSpellSlots,
        setCreatedSpellSlots,
        setActionUsed,
        setBonusActionUsed,
        setConcentrationSpell,
        setDeathSaves,
        setHitDiceUsed,
        setExhaustionLevel,
    });

    const [castLevel, setCastLevel] = useState<number>(1);

    // Global keyboard shortcut: press 'C' to focus camera on active character token
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (
                e.target instanceof HTMLInputElement ||
                e.target instanceof HTMLTextAreaElement ||
                (e.target as HTMLElement)?.isContentEditable
            ) {
                return;
            }
            if ((e.key === "c" || e.key === "C") && !e.ctrlKey && !e.altKey && !e.metaKey) {
                e.preventDefault();
                if (obr.player?.id) {
                    getMyPrimaryCharacterToken(obr.player.id).then(primary => {
                        if (primary) {
                            focusCameraOnToken(primary.id);
                        } else if (caster?.id) {
                            focusCameraOnToken(caster.id);
                        }
                    }).catch(() => {
                        if (caster?.id) focusCameraOnToken(caster.id);
                    });
                } else if (caster?.id) {
                    focusCameraOnToken(caster.id);
                }
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [caster?.id, obr.player?.id]);

    const characterFeatures = useMemo(
        () => syncedDdbChar ? getCharacterFeatures(syncedDdbChar) : [],
        [syncedDdbChar]
    );

    const weaponsList = useMemo(
        () => (syncedDdbChar?.weapons && syncedDdbChar.weapons.length > 0)
            ? syncedDdbChar.weapons
            : DEFAULT_WEAPONS,
        [syncedDdbChar]
    );

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
            usesSpellSlot?: boolean;
            componentId?: number;
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
                        isPrepared: Boolean(s.isPrepared) || s.usesSpellSlot === false,
                        usesSpellSlot: s.usesSpellSlot,
                        componentId: s.componentId,
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
        setAimingWeapon(null);
        stopAiming().catch(() => {});
        OBR.notification.show("Aiming canceled", "INFO");
    };

    // Global ESC key and Right-Click listener to stop aiming and close flyout
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" || e.code === "Escape") {
                if (upcastPickerSpellId || selectedSpell || activeFlyoutFeatureId || aimingWeapon) {
                    e.preventDefault();
                    e.stopPropagation();
                    handleCancelAiming();
                }
            }
        };

        const handleContextMenu = (e: MouseEvent) => {
            if (upcastPickerSpellId || selectedSpell || activeFlyoutFeatureId || aimingWeapon) {
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
    }, [upcastPickerSpellId, selectedSpell, activeFlyoutFeatureId, aimingWeapon]);

    // Sync with OBR player metadata: if selected spell is cleared externally, close flyout; sync concentration
    useEffect(() => {
        if (!obr.ready) return;
        try {
            const unsub = OBR.player.onChange(player => {
                const sel = player.metadata[toolMetadataSelectedSpell] as string | undefined;
                if (!sel) {
                    setSelected(null);
                    setUpcastPickerSpellId(null);
                    setAimingWeapon(null);
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

    const {
        activeFlyoutSpell,
        getAvailableSlotLevels,
        getRemainingSlots,
        getSpellChoices,
        handleOpenUpcastPicker,
    } = useSpellSelection({
        spells: dockSpells,
        character: syncedDdbChar,
        spellRegistry,
        spellSlots,
        pactSlots,
        spellId: upcastPickerSpellId,
        selectedHexAbility,
        damageTypeOverrides: spellDamageTypeOverrides,
        setSpellId: setUpcastPickerSpellId,
        setSelectedLevel: setUpcastPickerLevel,
        setCastLevel,
        setDamageTypeOverrides: setSpellDamageTypeOverrides,
        setActiveFeatureId: setActiveFlyoutFeatureId,
        onSelectSpell: handleSelectSpell,
        onCancelAiming: handleCancelAiming,
    });
    const renderUpcastPickerRow = (spell: { id: string; level: number; rawDdbSpell?: DDBParsedSpell }, colSpan: number) => (
        <UpcastPickerRow
            key={`upcast-picker-${spell.id}`}
            spell={spell}
            colSpan={colSpan}
            availableLevels={getAvailableSlotLevels(spell.level)}
            selectedLevel={upcastPickerLevel}
            pactMagicLevel={syncedDdbChar?.pactMagic?.level}
            getRemainingSlots={getRemainingSlots}
            onLevelChange={level => {
                setUpcastPickerLevel(level);
                setCastLevel(level);
            }}
            onCast={(spellId, level) => {
                handleCastClick(spellId, level);
                setUpcastPickerSpellId(null);
            }}
            onCancel={() => setUpcastPickerSpellId(null)}
        />
    );
    const { castSpell: handleCastClick } = useSpellCasting({
        selectedSpell,
        casterId: caster?.id,
        player: obr.player ?? undefined,
        character: syncedDdbChar,
        castLevel,
        concentrationSpell,
        selectedHexAbility,
        characterFeatures,
        spellSlots,
        pactSlots,
        setSelected,
        setUpcastPickerSpellId,
        setSelectedHexAbility,
        setSpellSlots,
        setPactSlots,
        setConcentrationSpell,
    });
    const activeBuffNames = useMemo(() => activeBuffs.map(b => b.name), [activeBuffs]);

    const { handleWeaponAttackRoll, handleWeaponDamageRoll, handleRiderClick } = useWeaponRollHandlers({
        casterId: caster?.id,
        character: syncedDdbChar,
        hasAttackAdvantage: buffMods.hasAttackAdvantage,
        damageBonus: buffMods.damageBonus,
        activeBuffs: activeBuffNames,
        riderChoice,
        concentrationSpell,
        activeRiderMap,
        setActiveRiderMap,
        spells: dockSpells,
        setSelected,
    });

    const activeFlyoutWeaponData = useMemo(() => {
        if (!aimingWeapon) return null;
        const bonusNum = typeof buffMods.damageBonus === "number" && buffMods.damageBonus > 0 ? buffMods.damageBonus : 0;
        const effectiveDamage = combineDamageBonus(aimingWeapon.damage, bonusNum);
        const resolvedRiders = resolveWeaponRiders({
            character: syncedDdbChar,
            weapon: aimingWeapon,
            activeBuffs: activeBuffNames,
            riderChoice,
        });
        return {
            weapon: aimingWeapon,
            effectiveDamage,
            resolvedRiders,
            selectedRiderChoice: riderChoice,
            onSelectRiderChoice: (choice: string) => {
                setRiderChoice(choice);
                if (aimingWeapon) {
                    const spellId = aimingWeapon.type === "ranged" ? "ranged_weapon_attack" : "melee_weapon_attack";
                    setSelectedSpell(spellId, caster?.id, aimingWeapon.id, 1, choice !== "none" ? choice : undefined);
                }
            },
            onAttackRoll: handleWeaponAttackRoll,
            onDamageRoll: handleWeaponDamageRoll,
        };
    }, [aimingWeapon, buffMods.damageBonus, syncedDdbChar, activeBuffNames, riderChoice, caster?.id, handleWeaponAttackRoll, handleWeaponDamageRoll]);
    const handleSpellDamageRoll = useSpellDamageRoll({
        character: syncedDdbChar,
        spellRegistry,
        damageTypeOverrides: spellDamageTypeOverrides,
        onSelectSpell: handleSelectSpell,
        onOpenUpcastPicker: handleOpenUpcastPicker,
    });
    const handleSpellAttackRoll = useSpellAttackRoll({
        casterId: caster?.id,
        character: syncedDdbChar,
        hasSpellAdvantage: buffMods.hasSpellAdvantage,
        concentrationSpell,
        selectedHexAbility,
        onSelectSpell: handleSelectSpell,
    });
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

    // Weapon selection & aiming
    const handleSelectWeapon = (weapon: DDBWeaponAttack, mode: "melee" | "thrown" = "melee", attackCount = 1) => {
        const spellId = mode === "thrown" ? "ranged_weapon_attack" : "melee_weapon_attack";
        setSelectedSpell(spellId, caster?.id, weapon.id, attackCount, riderChoice !== "none" ? riderChoice : undefined);
        setSelected(spellId);
        setUpcastPickerSpellId(null);
        setActiveFlyoutFeatureId(null);
        setAimingWeapon(weapon);
        OBR.tool.activateTool(toolID);
        OBR.notification.show(`Aiming ${weapon.name} (${mode === "thrown" ? `${weapon.thrownRange || 20}/${weapon.thrownLongRange || 60} ft Thrown` : "5 ft Reach"}${attackCount > 1 ? ` - ${attackCount} Attacks` : ""})`, "INFO");
    };

    // Monk Flurry of Blows (2 Unarmed Strikes, 1 Focus Point, Bonus Action)
    const handleFlurryOfBlowsClick = async () => {
        const foundUnarmed = weaponsList.find(w => w.id === "weapon_unarmed_strike");
        const unarmedWeapon = foundUnarmed || {
            id: "weapon_unarmed_strike",
            name: "Unarmed Strike",
            type: "melee" as const,
            rangeText: "5 ft. Reach",
            rangeFeet: 5,
            toHit: (syncedDdbChar?.modifiers?.dex ?? 3) + (syncedDdbChar?.proficiencyBonus ?? 2),
            damage: `${syncedDdbChar?.martialArtsDie || "1d6"}+${syncedDdbChar?.modifiers?.dex ?? 3}`,
            damageType: "bludgeoning" as const,
            properties: ["Monk Weapon", "Martial Arts"],
        };

        if (syncedDdbChar) {
            const focusFeat = characterFeatures.find(f => {
                const n = f.name.toLowerCase();
                return (n.includes("focus") || n.includes("ki")) && f.limitedUse && f.limitedUse.max > 0;
            });
            if (focusFeat?.limitedUse) {
                const used = focusFeat.limitedUse.used ?? 0;
                const max = focusFeat.limitedUse.max ?? 0;
                if (used >= max) {
                    OBR.notification.show("No Focus Points remaining for Flurry of Blows!", "WARNING");
                    return;
                }
                focusFeat.limitedUse.used = used + 1;
                cacheDDBCharacter(syncedDdbChar);
            }
        }

        setBonusActionUsed(true);
        const spellId = "flurry_of_blows";
        await setSelectedSpell(spellId, caster?.id, unarmedWeapon.id, 2);
        setSelected(spellId);
        await OBR.tool.activateTool(toolID);
        OBR.notification.show("Flurry of Blows: Aiming 2 Unarmed Strikes (1 Focus Point spent)", "INFO");
    };

    // Monk Bonus Unarmed Strike (1 Unarmed Strike, Bonus Action)
    const handleBonusUnarmedStrikeClick = async () => {
        const foundUnarmed = weaponsList.find(w => w.id === "weapon_unarmed_strike");
        const unarmedWeapon = foundUnarmed || {
            id: "weapon_unarmed_strike",
            name: "Unarmed Strike",
            type: "melee" as const,
            rangeText: "5 ft. Reach",
            rangeFeet: 5,
            toHit: (syncedDdbChar?.modifiers?.dex ?? 3) + (syncedDdbChar?.proficiencyBonus ?? 2),
            damage: `${syncedDdbChar?.martialArtsDie || "1d6"}+${syncedDdbChar?.modifiers?.dex ?? 3}`,
            damageType: "bludgeoning" as const,
            properties: ["Monk Weapon", "Martial Arts"],
        };

        setBonusActionUsed(true);
        const spellId = "bonus_unarmed_strike";
        await setSelectedSpell(spellId, caster?.id, unarmedWeapon.id, 1);
        setSelected(spellId);
        await OBR.tool.activateTool(toolID);
        OBR.notification.show("Bonus Unarmed Strike: Aiming 1 strike as a Bonus Action", "INFO");
    };

    const { handleActivateFeature, handleToggleFeatureBox } = useFeatureActivation({
        casterId: caster?.id,
        character: syncedDdbChar,
        featureUses,
        setFeatureUses,
        setActiveBuffs,
        setBonusActionUsed,
        setActionUsed,
        onFlurry: handleFlurryOfBlowsClick,
        onBonusStrike: handleBonusUnarmedStrikeClick,
    });

    const {
        handleTwoWeaponFighting: handleTwoWeaponFightingClick,
        handleOpportunityAttack: handleOpportunityAttackClick,
        handleInitiativeRoll,
        handleToggleInspiration,
    } = useCombatActionHandlers({
        character: syncedDdbChar,
        weapons: weaponsList,
        setHeroicInspiration,
        onSelectWeapon: handleSelectWeapon,
    });
    // Quick HP Adjustments (Heal / Damage)
    const {
        currentHp: currentHpVal,
        maxHp: maxHpVal,
        heal: handleHpHeal,
        takeDamage: handleHpDamage,
    } = useHitPoints({
        customHp,
        setCustomHp,
        character: syncedDdbChar,
        concentrationSpell,
        deathSaves,
        setDeathSaves,
    });
    // Toggle expand description
    const toggleExpandFeature = (id: string) => {
        setExpandedFeatures(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const casterAvatarUrl = syncedDdbChar?.avatarUrl
        || (caster?.item && isImage(caster.item) ? caster.item.image.url : `${window.location.origin}/embers.svg`);
    const casterName = syncedDdbChar?.name
        || (caster?.name && caster.name !== "Caster" ? caster.name : (caster?.isDM ? "Dungeon Master" : "Caster"));
    const isOwnedByMe = Boolean(caster?.item && obr.player?.id && isTokenOwnedByPlayer(caster.item, obr.player.id));
    const otherOwner = caster?.item && obr.player?.id ? getOtherClaimedPlayer(caster.item, obr.player.id) : null;
    const isReadOnlyInspection = obr.player?.role === "PLAYER" && otherOwner != null;

    const {
        filteredWeapons,
        attackSpells,
        actionSpells,
        bonusActionSpells,
        reactionSpells,
        actionFeatures,
        bonusActionFeatures,
        reactionFeatures,
        otherFeatures,
        limitedUseFeatures,
        filteredCombatActions,
    } = useActionLists({ search: actionSearch, weapons: weaponsList, spells: dockSpells, features: characterFeatures });

    const activeFlyoutFeatureData = useFeatureFlyoutData({
        featureId: activeFlyoutFeatureId,
        features: characterFeatures,
        character: syncedDdbChar,
        featureUses,
        spellSlots,
        pactSlots,
        setFeatureUses,
        setSpellSlots,
        setActionUsed,
        setBonusActionUsed,
        onConvertSlot: handleConvertSlotToSorceryPoints,
        onCreateSpellSlot: handleCreateSorcererSpellSlot,
    });
    const characterInventory = syncedDdbChar?.inventory || [];
    const {
        spellGroups,
        filteredFeatures,
        attunedCount,
        filteredInventory,
        totalInventoryWeight,
        maxCarryWeight,
    } = useCharacterTabData({
        spells: dockSpells,
        spellsFilter,
        spellSearch,
        pactMagicLevel: syncedDdbChar?.pactMagic?.level,
        features: characterFeatures,
        featuresFilter,
        inventory: characterInventory,
        inventoryFilter,
        inventorySearch,
        strength: syncedDdbChar?.stats?.str ?? 10,
    });
    const { toggleAttunement: handleToggleItemAttunement } = useInventoryAttunement({
        character: syncedDdbChar,
        setCharacter: setSyncedDdbChar,
        drawerItem,
        setDrawerItem,
    });
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

    const spellAttackBonus = syncedDdbChar?.spellAttackBonus ?? 0;
    const spellAbility = syncedDdbChar?.spellCastingAbility ?? "CHA";
    const abilityModifier = syncedDdbChar?.modifiers ? (syncedDdbChar.modifiers[abilityModifierKey(spellAbility)] ?? 0) : 0;


    function abilityModifierKey(ability: string): "str" | "dex" | "con" | "int" | "wis" | "cha" {
        const lower = ability.toLowerCase();
        if (lower.startsWith("str")) return "str";
        if (lower.startsWith("dex")) return "dex";
        if (lower.startsWith("con")) return "con";
        if (lower.startsWith("int")) return "int";
        if (lower.startsWith("wis")) return "wis";
        return "cha";
    }

    const handleFeatureOptionRoll = (feature: { id: string; name: string }, optionId: string) => {
        const matching = findMatchingActionFormula(feature.name);
        const rider = matching?.weaponRider;
        if (!matching) return;

        if (rider) {
            setRiderChoice(optionId);
            const charClass = syncedDdbChar?.classes?.find(c => c.name.toLowerCase() === rider.classId.toLowerCase());
            const classLevel = charClass?.level ?? syncedDdbChar?.level ?? 1;
            const flatBonus = rider.bonus === "halfClassLevel" ? Math.max(1, Math.floor(classLevel / 2)) : 0;
            const dice = rider.dice || "1d6";
            const formula = flatBonus > 0 ? `${dice}+${flatBonus}` : dice;
            const roll = rollFormula(formula);
            const optObj = matching.options?.find(o => o.id === optionId);
            const label = optObj?.name || (optionId.charAt(0).toUpperCase() + optionId.slice(1));
            const casterName = syncedDdbChar?.name || "Character";

            const card: DDBRollCardData = {
                id: `${feature.id}_${optionId}_${Date.now()}`,
                casterName,
                actionName: feature.name.toUpperCase(),
                actionType: "DAMAGE",
                dieType: 6,
                diceBreakdown: roll.breakdown,
                formula: `${formula} ${label}`,
                total: roll.total,
                subtitle: `${matching.source || feature.name} • ${label}`,
                timestamp: Date.now(),
            };

            broadcastDDBRoll([card]);
        }
    };

    const renderFeatureCard = (feature: DDBFeatureAction) => (
        <FeatureActionCard
            key={feature.id}
            feature={feature}
            usedCount={featureUses[feature.id] ?? (feature.limitedUse?.used ?? 0)}
            activeBuff={activeBuffs.some(buff => buff.name.toLowerCase() === feature.name.toLowerCase() || buff.id === feature.id || (buff.id === "innate_sorcery" && feature.name.toLowerCase().includes("innate sorcery")))}
            activeFlyout={activeFlyoutFeatureId === feature.id}
            spells={dockSpells}
            onOpenDrawer={setDrawerItem}
            onToggleFlyout={featureId => {
                setUpcastPickerSpellId(null);
                setActiveFlyoutFeatureId(previous => previous === featureId ? null : featureId);
            }}
            onActivate={handleActivateFeature}
            onFlurry={handleFlurryOfBlowsClick}
            onBonusStrike={handleBonusUnarmedStrikeClick}
            onOpenSpell={handleOpenUpcastPicker}
            onToggleUse={handleToggleFeatureBox}
            onFeatureOptionClick={handleFeatureOptionRoll}
        />
    );

    // BG3 ACTION CARDS GRID HELPERS
    const handleToggleViewMode = (mode: "grid" | "table") => {
        setViewMode(mode);
        try {
            localStorage.setItem("embers:action-dock-view", mode);
        } catch {}
    };
    const renderBg3SpellCard = (spell: typeof dockSpells[0], index: number) => (
        <Bg3SpellCard
            spell={spell}
            index={index}
            selected={selectedSpell === spell.id}
            damageTypeOverride={spellDamageTypeOverrides[spell.id]}
            onActivate={selectedSpellData => {
                const choices = getSpellChoices(selectedSpellData);
                const isLeveled = selectedSpellData.level > 0;
                const isHex = selectedSpellData.name.toLowerCase() === "hex" || selectedSpellData.id.toLowerCase() === "hex";
                if (isLeveled || choices || isHex) {
                    handleOpenUpcastPicker(selectedSpellData);
                } else {
                    handleSelectSpell(selectedSpellData.id);
                }
            }}
            onOpenDetails={openSpellDetailModal}
        />
    );

    const renderBg3FeatureCard = (feature: DDBFeatureAction, index: number) => (
        <Bg3FeatureCard
            feature={feature}
            index={index}
            usedCount={featureUses[feature.id] ?? (feature.limitedUse?.used || 0)}
            selected={activeFlyoutFeatureId === feature.id}
            onToggleFlyout={featureId => {
                setUpcastPickerSpellId(null);
                setActiveFlyoutFeatureId(previous => previous === featureId ? null : featureId);
            }}
            onOpenDetails={setDrawerItem}
        />
    );

    const renderBg3WeaponCard = (weapon: DDBWeaponAttack, index: number) => (
        <Bg3WeaponCard
            weapon={weapon}
            index={index}
            onActivate={selectedWeapon => handleSelectWeapon(selectedWeapon, "melee")}
            onOpenDetails={selectedWeapon => setDrawerItem({ type: "weapon", weapon: selectedWeapon })}
        />
    );

    const renderBg3CombatActionCard = (action: { name: string; description: string }, index: number) => (
        <Bg3CombatActionCard
            action={action}
            index={index}
            onActivate={selectedAction => setDrawerItem({
                type: "feature",
                id: `act_${selectedAction.name.toLowerCase()}`,
                name: selectedAction.name,
                description: selectedAction.description,
                category: "Actions in Combat",
                activationType: "action"
            })}
        />
    );

    const renderTurnResourceBar = () => (
        <TurnResourceBar
            isOpen={isResourceTrayOpen}
            actionUsed={actionUsed}
            bonusActionUsed={bonusActionUsed}
            resources={characterResources}
            featureUses={featureUses}
            spellSlots={spellSlots}
            pactSlots={pactSlots}
            activeFlyoutFeatureId={activeFlyoutFeatureId}
            onActionToggle={() => setActionUsed(!actionUsed)}
            onBonusActionToggle={() => setBonusActionUsed(!bonusActionUsed)}
            onResourceClick={feature => {
                if (getFeatureFlyoutKind(feature)) {
                    setUpcastPickerSpellId(null);
                    setActiveFlyoutFeatureId(previous => previous === feature.id ? null : feature.id);
                } else {
                    toggleClassResource(feature);
                }
            }}
            onResourceContextMenu={toggleClassResource}
            onSpellSlotToggle={toggleSlotPip}
            onPactSlotToggle={togglePactPip}
        />
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
                <ActionDockVitalsRail
                    character={syncedDdbChar}
                    caster={caster}
                    isSyncing={isSyncing}
                    onResync={() => resyncCharacter(true)}
                    player={obr.player ? { id: obr.player.id, name: obr.player.name, role: obr.player.role } : undefined}
                    avatarUrl={casterAvatarUrl}
                    casterName={casterName}
                    classSummary={syncedDdbChar?.classes?.map(c => `${c.name} ${c.level}`).join(" / ") || "Adventurer"}
                    isReadOnlyInspection={isReadOnlyInspection}
                    isOwnedByMe={isOwnedByMe}
                    otherOwnerName={otherOwner?.playerName || (otherOwner ? "Player" : undefined)}
                    currentHp={currentHpVal}
                    maxHp={maxHpVal}
                    temporaryHp={customHp?.temp ?? syncedDdbChar?.hp?.temp ?? 0}
                    customTemporaryHp={customHp?.temp ?? (syncedDdbChar?.hp?.temp ?? 0)}
                    deathSaves={deathSaves}
                    setDeathSaves={setDeathSaves}
                    heroicInspiration={heroicInspiration}
                    drawerItem={drawerItem}
                    setDrawerItem={setDrawerItem}
                    isDiceRollerOpen={isDiceRollerOpen}
                    setIsDiceRollerOpen={setIsDiceRollerOpen}
                    isConditionsMenuOpen={isConditionsMenuOpen}
                    conditions={conditions}
                    exhaustionLevel={exhaustionLevel}
                    setExhaustionLevel={setExhaustionLevel}
                    activeBuffs={activeBuffs}
                    concentrationSpell={concentrationSpell}
                    unreadRolls={unreadRolls}
                    onUnreadRollsClear={() => setUnreadRolls(0)}
                    onLongRest={handleLongRest}
                    onDeathSaveRoll={handleRollDeathSave}
                    onHeal={() => handleHpHeal(1)}
                    onDamage={() => handleHpDamage(1)}
                    onInitiativeRoll={handleInitiativeRoll}
                    onToggleInspiration={handleToggleInspiration}
                    onOpenSpellBrowser={handleOpenBrowserClick}
                    onClearTargets={handleClearTargetsClick}
                    onBreakConcentration={handleBreakConcentration}
                    onToggleCondition={handleToggleCondition}
                    onToggleConditionMenu={() => setIsConditionsMenuOpen(prev => !prev)}
                    onRemoveBuff={async buffId => {
                        if (!caster?.id) return;
                        const remaining = await removeTokenBuff(caster.id, buffId);
                        setActiveBuffs(remaining);
                        const removedBuff = activeBuffs.find(buff => buff.id === buffId);
                        if (removedBuff) OBR.notification.show(`Deactivated ${removedBuff.name}`, "INFO");
                    }}
                />
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
                                            : (syncedDdbChar?.pactMagic
                                                ? (["ALL", "0", "1", "2", "PACT", "3+"] as SpellsFilter[])
                                                : (["ALL", "0", "1", "2", "3+"] as SpellsFilter[])
                                              ).map(filter => (
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
                                onClick={() => setIsResourceTrayOpen(open => {
                                    const next = !open;
                                    try {
                                        localStorage.setItem("embers:action-dock-resources-open", String(next));
                                    } catch {}
                                    return next;
                                })}
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
                        {(activeFlyoutSpell || activeFlyoutFeatureData || activeFlyoutWeaponData) && (
                            <div className="ddb-bg3-flyout-overlay">
                                <BG3FlyoutBar
                                    spell={activeFlyoutSpell || undefined}
                                    featureData={activeFlyoutFeatureData || undefined}
                                    weaponData={activeFlyoutWeaponData || undefined}
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
                                        if (activeFlyoutSpell || activeFlyoutWeaponData) handleCancelAiming();
                                        if (activeFlyoutFeatureId) setActiveFlyoutFeatureId(null);
                                    }}
                                />
                            </div>
                        )}
                        {viewMode === "grid" && (mainTab === "ACTIONS" || mainTab === "SPELLS") ? (
                            <div className="ddb-bg3-grid-pane">
                                <ActionGridTooltipProvider>
                                    <Bg3GridContent
                                        mainTab={mainTab}
                                        actionsFilter={actionsFilter}
                                        spellsFilter={spellsFilter}
                                        spellSearch={spellSearch}
                                        actionSearch={actionSearch}
                                        pactMagicLevel={syncedDdbChar?.pactMagic?.level}
                                        weapons={filteredWeapons}
                                        attackSpells={attackSpells}
                                        actionSpells={actionSpells}
                                        actionFeatures={actionFeatures}
                                        bonusActionSpells={bonusActionSpells}
                                        bonusActionFeatures={bonusActionFeatures}
                                        reactionSpells={reactionSpells}
                                        reactionFeatures={reactionFeatures}
                                        otherFeatures={otherFeatures}
                                        combatActions={filteredCombatActions}
                                        spells={dockSpells}
                                        renderWeaponCard={renderBg3WeaponCard}
                                        renderSpellCard={renderBg3SpellCard}
                                        renderFeatureCard={renderBg3FeatureCard}
                                        renderCombatActionCard={renderBg3CombatActionCard}
                                    />
                                </ActionGridTooltipProvider>
                            </div>
                        ) : (
                            <div className="ddb-dock-left-pane">
                                {mainTab === "ACTIONS" && (
                                    <ActionsTabPanel
                                        filter={actionsFilter}
                                        search={actionSearch}
                                        data={{
                                            filteredWeapons,
                                            attackSpells,
                                            actionFeatures,
                                            actionSpells,
                                            bonusActionFeatures,
                                            bonusActionSpells,
                                            reactionFeatures,
                                            reactionSpells,
                                            otherFeatures,
                                            limitedUseFeatures,
                                            filteredCombatActions,
                                            weaponsList,
                                            hasTwoWeaponFighting: Boolean(syncedDdbChar?.hasTwoWeaponFighting),
                                            offhandWeapon: syncedDdbChar?.offhandWeapon,
                                            activeRiderMap,
                                            selectedSpellId: selectedSpell,
                                            spellDamageTypeOverrides,
                                            upcastPickerSpellId,
                                            resolvedRiders: resolveWeaponRiders({
                                                character: syncedDdbChar,
                                                weapon: weaponsList[0] || DEFAULT_WEAPONS[0],
                                                activeBuffs: activeBuffNames,
                                                riderChoice,
                                            }),
                                            selectedRiderChoice: riderChoice,
                                            effectiveBonusDamage: typeof buffMods.damageBonus === "number" && buffMods.damageBonus > 0 ? buffMods.damageBonus : 0,
                                            onSelectRiderChoice: setRiderChoice,
                                        }}
                                        attackTableHandlers={{
                                            onSelectWeapon: handleSelectWeapon,
                                            onWeaponAttackRoll: handleWeaponAttackRoll,
                                            onWeaponDamageRoll: handleWeaponDamageRoll,
                                            onRiderClick: handleRiderClick,
                                            onOpenWeaponDetails: weapon => setDrawerItem({ type: "weapon", weapon }),
                                            onSelectSpell: spell => {
                                                handleSelectSpell(spell.id);
                                                setDrawerItem({ type: "spell", spell });
                                            },
                                            onOpenSpellDetails: spell => openSpellDetailModal(spell.id),
                                            onSpellAttackRoll: handleSpellAttackRoll,
                                            onSpellDamageRoll: handleSpellDamageRoll,
                                            onOpenUpcastPicker: handleOpenUpcastPicker,
                                            renderUpcastPickerRow,
                                        }}
                                        onFilterChange={setActionsFilter}
                                        onSearchChange={setActionSearch}
                                        renderFeatureCard={renderFeatureCard}
                                        onSelectSpell={handleSelectSpell}
                                        onOpenSpellDetails={openSpellDetailModal}
                                        onTwoWeaponFighting={handleTwoWeaponFightingClick}
                                        onOpportunityAttack={handleOpportunityAttackClick}
                                        onSelectCombatAction={action => setDrawerItem({
                                            type: "feature",
                                            id: `act_${action.name.toLowerCase()}`,
                                            name: action.name,
                                            description: action.description,
                                            category: "Actions in Combat",
                                            activationType: "action",
                                        })}
                                    />
                                )}
            {/* TAB BODY 2: SPELLS (Matches Screenshot 2) */}
            {/* ========================================================= */}
            {mainTab === "SPELLS" && (
                <SpellsTab
                    abilityModifier={abilityModifier}
                    spellAbility={spellAbility}
                    spellAttackBonus={spellAttackBonus}
                    hasSpellAdvantage={buffMods.hasSpellAdvantage}
                    spellSaveDcLabel={syncedDdbChar?.spellSaveDC ? `${syncedDdbChar.spellSaveDC + buffMods.spellSaveDcBonus}` : (syncedDdbChar?.spellSaveDCDisplay || "—")}
                    spellSaveDcBonus={buffMods.spellSaveDcBonus}
                    filter={spellsFilter}
                    onFilterChange={setSpellsFilter}
                    search={spellSearch}
                    onSearchChange={setSpellSearch}
                    groups={spellGroups}
                    selectedSpellId={selectedSpell}
                    damageTypeOverrides={spellDamageTypeOverrides}
                    upcastPickerSpellId={upcastPickerSpellId}
                    onSelectSpell={spell => {
                        handleSelectSpell(spell.id);
                        setDrawerItem({ type: "spell", spell });
                    }}
                    onContextMenuSpell={spell => openSpellDetailModal(spell.id)}
                    onOpenSpellDetails={spell => {
                        setDrawerItem({ type: "spell", spell });
                        openSpellDetailModal(spell.id);
                    }}
                    onAttackRoll={handleSpellAttackRoll}
                    onDamageRoll={handleSpellDamageRoll}
                    onOpenUpcastPicker={handleOpenUpcastPicker}
                    renderUpcastPickerRow={renderUpcastPickerRow}
                    hasPactMagic={Boolean(syncedDdbChar?.pactMagic)}
                />
            )}
            {/* ========================================================= */}
            {/* TAB BODY 3: FEATURES & TRAITS (Matches Screenshot 3) */}
            {/* ========================================================= */}
            {mainTab === "FEATURES" && (
                <FeaturesTab
                    features={filteredFeatures}
                    filter={featuresFilter}
                    onFilterChange={setFeaturesFilter}
                    tokenId={caster?.id}
                    featureUses={featureUses}
                    expandedFeatures={expandedFeatures}
                    activeBuffs={activeBuffs}
                    activeFlyoutFeatureId={activeFlyoutFeatureId}
                    onSyncCharacter={openDDBSyncModal}
                    onOpenDrawer={setDrawerItem}
                    onToggleFlyout={featureId => {
                        setUpcastPickerSpellId(null);
                        setActiveFlyoutFeatureId(previous => previous === featureId ? null : featureId);
                    }}
                    onActivateFeature={handleActivateFeature}
                    onToggleFeatureUse={handleToggleFeatureBox}
                    onToggleExpanded={toggleExpandFeature}
                />
            )}
            {/* TAB: INVENTORY */}
            {mainTab === "INVENTORY" && (
                <InventoryTab
                    character={syncedDdbChar}
                    attunedCount={attunedCount}
                    totalWeight={totalInventoryWeight}
                    maxCarryWeight={maxCarryWeight}
                    filter={inventoryFilter}
                    onFilterChange={setInventoryFilter}
                    search={inventorySearch}
                    onSearchChange={setInventorySearch}
                    items={filteredInventory}
                    onSelectItem={item => setDrawerItem({ type: "item", item })}
                />
            )}

            {/* TAB: BACKGROUND */}
            {mainTab === "BACKGROUND" && (
                <BackgroundTab character={syncedDdbChar} />
            )}

            {/* TAB: NOTES */}
            {mainTab === "NOTES" && (
                <NotesTab character={syncedDdbChar} />
            )}

            {/* TAB: EXTRAS */}
            {mainTab === "EXTRAS" && (
                <ExtrasTab characterName={casterName} />
            )}
                    </div>
                )}

                {drawerItem && (
                    <ActionDockDetailDrawer
                        item={drawerItem}
                        characterName={casterName}
                        attunedCount={attunedCount}
                        onClose={() => setDrawerItem(null)}
                        character={syncedDdbChar}
                        featureUses={featureUses}
                        activeBuffs={activeBuffs}
                        spellSlots={spellSlots}
                        pactSlots={pactSlots}
                        activeRiderMap={activeRiderMap}
                        spellFormula={drawerItem.type === "spell" ? spellRegistry?.get(drawerItem.spell.id) ?? resolveSpellFormula(drawerItem.spell) : null}
                        characterLevel={syncedDdbChar?.level ?? 1}
                        selectedDamageType={drawerItem.type === "spell" ? spellDamageTypeOverrides[drawerItem.spell.id] as DamageType | undefined : undefined}
                        onSelectDamageType={chosen => {
                            if (drawerItem.type !== "spell") return;
                            setSpellDamageTypeOverrides(previous => ({ ...previous, [drawerItem.spell.id]: chosen }));
                        }}
                        usedHitDice={hitDiceUsed}
                        onHeal={handleHpHeal}
                        onDamage={handleHpDamage}
                        onRollHitDie={handleRollHitDie}
                        history={rollHistory}
                        onClearHistory={() => { setRollHistory([]); clearStoredRollHistory(); }}
                        onToggleFeatureUse={handleToggleFeatureBox}
                        onActivateFeature={handleActivateFeature}
                        onConvertSlot={handleConvertSlotToSorceryPoints}
                        onCreateSlot={handleCreateSorcererSpellSlot}
                        onRiderClick={handleRiderClick}
                        actions={{
                            item: drawerItem,
                            activeRider: drawerItem.type === "weapon" ? activeRiderMap[drawerItem.weapon.id] : undefined,
                            activeBuffs,
                            castLevel,
                            pactMagicLevel: syncedDdbChar?.pactMagic?.level,
                            rollHistoryCount: rollHistory.length,
                            linkedSpells: drawerItem.type === "feature" ? dockSpells.filter(spell => {
                                if (spell.rawDdbSpell?.componentId && drawerItem.componentId && spell.rawDdbSpell.componentId === drawerItem.componentId) return true;
                                const spellName = spell.name.toLowerCase();
                                const featureDescription = (drawerItem.description || "").toLowerCase();
                                const featureName = drawerItem.name.toLowerCase();
                                return (featureDescription.includes(spellName) || (featureName.includes("shadow arts") && spellName === "darkness")) && (spell.usesSpellSlot === false || spell.fromChar);
                            }) : [],
                            getAvailableSlotLevels,
                            getRemainingSlots,
                            onCastLevelChange: setCastLevel,
                            onWeaponAttackRoll: handleWeaponAttackRoll,
                            onWeaponDamageRoll: handleWeaponDamageRoll,
                            onSelectWeapon: handleSelectWeapon,
                            onSpellAttackRoll: handleSpellAttackRoll,
                            onSpellDamageRoll: handleSpellDamageRoll,
                            onCastClick: handleCastClick,
                            onSelectSpell: handleSelectSpell,
                            onActivateFeature: handleActivateFeature,
                            onFlurryOfBlows: handleFlurryOfBlowsClick,
                            onBonusUnarmedStrike: handleBonusUnarmedStrikeClick,
                            onOpenUpcastPicker: handleOpenUpcastPicker,
                            onToggleItemAttunement: handleToggleItemAttunement,
                            onClearHistory: () => { setRollHistory([]); clearStoredRollHistory(); },
                            onClose: () => setDrawerItem(null),
                            onFeatureOptionClick: (feature, optionId) => handleFeatureOptionRoll(feature, optionId),
                        }}
                    />
                )}
            </div> {/* end ddb-action-content-workspace */}
        </main> {/* end ddb-action-deck-main */}
    </div> {/* end ddb-dock-2col-layout */}

            </div> {/* end ddb-action-sheet-container */}
        </div>
    );
};

export default ActionDock;
