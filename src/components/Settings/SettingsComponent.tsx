import "./SettingsComponent.css";

import { Box, Dialog, DialogContent, DialogTitle, Fade, Typography } from "@mui/material";
import {
    FaArrowsToDot,
    FaCrown,
    FaGear,
    FaImage,
    FaSliders,
    FaTrashCan,
    FaUser,
    FaXmark,
} from "react-icons/fa6";
import OBR, { GridScale, isImage } from "@owlbear-rodeo/sdk";
import { useCallback, useEffect, useRef, useState } from "react";
import {
    getGlobalSettingsValue,
    getSettingsValue,
    GLOBAL_STORAGE_KEYS,
    GRID_UNIT_FACTORS,
    LOCAL_STORAGE_KEYS,
    setGlobalSettingsValue,
    setSettingsValue,
    SETTINGS_CHANNEL,
} from "./settings";
import { useOBR } from "../../platform/obr/react/providers";
import { SimplifiedItem } from "../../types/misc";

type ModalType = "choose-caster-type";

function parseGridScale(raw: string): GridScale {
    const regexMatch = raw.match(/(\d*)(\.\d*)?([a-zA-Z]*)/);
    if (regexMatch) {
        const multiplier = parseFloat(regexMatch[1]);
        const digits = parseFloat(regexMatch[2]);
        const unit = regexMatch[3] || "";
        if (!isNaN(multiplier) && !isNaN(digits)) {
            return {
                raw,
                parsed: {
                    multiplier: multiplier + digits,
                    unit,
                    digits: regexMatch[2].length - 1,
                },
            };
        }
        if (!isNaN(multiplier) && isNaN(digits)) {
            return { raw, parsed: { multiplier, unit, digits: 0 } };
        }
    }
    return { raw, parsed: { multiplier: 1, unit: "", digits: 0 } };
}

function tryComputeGridScaling(gridScale: GridScale | null) {
    if (gridScale == null) {
        return null;
    }
    const gridScaleFactor = gridScale.parsed.multiplier;
    const unitFactor = GRID_UNIT_FACTORS[gridScale.parsed.unit] ?? 1;
    return 5 / (gridScaleFactor * unitFactor);
}

export default function Settings() {
    const obr = useOBR();

    const [mostRecentSize, _setMostRecentSize] = useState<number | null>(null);
    const [gridScalingFactor, _setGridScalingFactor] = useState<number | null | undefined>(undefined);
    const [keepTargets, setKeepTargets] = useState<boolean | null>(null);
    const [playersCastSpells, setPlayersCastSpells] = useState<boolean | null>(null);
    const [summonedEntities, setSummonedEntities] = useState<string | null>(null);
    const [darknessOpacityMode, setDarknessOpacityMode] = useState<string | null>(null);
    const [gridScale, setGridScale] = useState<GridScale | null>(null);
    const [defaultCaster, setDefaultCaster] = useState<SimplifiedItem[] | null>(null);
    const [animationRate, _setAnimationRate] = useState<number | null>(null);
    const [modalOpened, setModalOpened] = useState<ModalType | null>(null);
    const [smartActionOnTarget, setSmartActionOnTarget] = useState<boolean | null>(null);
    const mainDiv = useRef<HTMLDivElement>(null);

    const setMostRecentSize = useCallback((size: string) => {
        const recentSize = parseInt(size);
        if (isNaN(recentSize)) {
            _setMostRecentSize(null);
            return;
        }
        _setMostRecentSize(recentSize);
    }, []);

    const setGridScalingFactor = useCallback((factor: string) => {
        const scaleFactor = parseFloat(factor);
        if (isNaN(scaleFactor)) {
            _setGridScalingFactor(null);
            return;
        }
        _setGridScalingFactor(scaleFactor);
    }, []);

    const setAnimationRate = useCallback((rate: string) => {
        const intRate = parseInt(rate);
        if (isNaN(intRate)) {
            _setAnimationRate(null);
            return;
        }
        _setAnimationRate(intRate);
    }, []);

    const handleAssetPicker = useCallback(() => {
        OBR.assets.downloadImages(true).then((selection) => {
            if (selection.length > 0) {
                setDefaultCaster(selection);
            }
        });
    }, []);

    const handleSetCasterFromSelection = useCallback(() => {
        OBR.player.getSelection().then((itemIDs) => {
            OBR.scene.items.getItems(itemIDs).then((items) => {
                const selection = items.filter((item) => isImage(item));
                if (selection.length > 0) {
                    setDefaultCaster(selection.map((selected) => ({ ...selected, type: "CHARACTER" })));
                }
            });
        });
    }, []);

    const reloadSettings = useCallback(() => {
        _setMostRecentSize(getSettingsValue(LOCAL_STORAGE_KEYS.MOST_RECENT_SPELLS_LIST_SIZE));
        _setGridScalingFactor(getSettingsValue(LOCAL_STORAGE_KEYS.GRID_SCALING_FACTOR));
        _setAnimationRate(getSettingsValue(LOCAL_STORAGE_KEYS.ANIMATION_UPDATE_RATE));
        setKeepTargets(getSettingsValue(LOCAL_STORAGE_KEYS.KEEP_SELECTED_TARGETS));
        setDefaultCaster(getSettingsValue(LOCAL_STORAGE_KEYS.DEFAULT_CASTER));
        setSmartActionOnTarget(getSettingsValue(LOCAL_STORAGE_KEYS.SMART_ACTION_ON_TARGET) ?? true);
    }, []);

    const closeModal = () => {
        setModalOpened(null);
    };

    useEffect(() => {
        reloadSettings();
    }, [reloadSettings]);

    useEffect(() => {
        if (!obr.ready || !obr.sceneReady) {
            return;
        }
        getGlobalSettingsValue(GLOBAL_STORAGE_KEYS.PLAYERS_CAN_CAST_SPELLS).then((value) =>
            setPlayersCastSpells(value as boolean)
        );
        getGlobalSettingsValue(GLOBAL_STORAGE_KEYS.SUMMONED_ENTITIES_RULE).then((value) =>
            setSummonedEntities(value as string)
        );
        getGlobalSettingsValue(GLOBAL_STORAGE_KEYS.DARKNESS_OPACITY_MODE).then((value) =>
            setDarknessOpacityMode((value as string) ?? "dynamic")
        );
    }, [obr.ready, obr.sceneReady]);

    useEffect(() => {
        if (!obr.ready || !obr.sceneReady) {
            return;
        }
        const handler = OBR.scene.grid.onChange((grid) => {
            const parsedGridScale = parseGridScale(grid.scale);
            setGridScale(parsedGridScale);
        });
        OBR.scene.grid.getScale().then((scale) => setGridScale(scale));

        return handler;
    }, [obr.ready, obr.sceneReady]);

    useEffect(() => {
        if (!obr.ready || !obr.sceneReady) {
            return;
        }

        return OBR.broadcast.onMessage(SETTINGS_CHANNEL, () => {
            reloadSettings();
        });
    }, [obr.ready, obr.sceneReady, reloadSettings]);

    useEffect(() => {
        if (mostRecentSize == null) {
            return;
        }
        if (isNaN(mostRecentSize) || mostRecentSize <= 0) {
            setSettingsValue(LOCAL_STORAGE_KEYS.MOST_RECENT_SPELLS_LIST_SIZE, null);
            return;
        }
        setSettingsValue(LOCAL_STORAGE_KEYS.MOST_RECENT_SPELLS_LIST_SIZE, mostRecentSize);
    }, [mostRecentSize]);

    useEffect(() => {
        if (gridScalingFactor === undefined) return;
        if (gridScalingFactor == null || isNaN(gridScalingFactor) || gridScalingFactor <= 0) {
            setSettingsValue(LOCAL_STORAGE_KEYS.GRID_SCALING_FACTOR, null);
            return;
        }
        setSettingsValue(LOCAL_STORAGE_KEYS.GRID_SCALING_FACTOR, gridScalingFactor);
    }, [gridScalingFactor]);

    useEffect(() => {
        if (keepTargets == null) {
            return;
        }
        setSettingsValue(LOCAL_STORAGE_KEYS.KEEP_SELECTED_TARGETS, keepTargets);
    }, [keepTargets]);

    useEffect(() => {
        if (defaultCaster == null) {
            return;
        }
        setSettingsValue(LOCAL_STORAGE_KEYS.DEFAULT_CASTER, defaultCaster);
    }, [defaultCaster]);

    useEffect(() => {
        if (animationRate == null) {
            return;
        }
        if (isNaN(animationRate) || animationRate <= 0) {
            setSettingsValue(LOCAL_STORAGE_KEYS.ANIMATION_UPDATE_RATE, null);
            return;
        }
        setSettingsValue(LOCAL_STORAGE_KEYS.ANIMATION_UPDATE_RATE, animationRate);
    }, [animationRate]);

    useEffect(() => {
        if (playersCastSpells == null) {
            return;
        }
        setGlobalSettingsValue(GLOBAL_STORAGE_KEYS.PLAYERS_CAN_CAST_SPELLS, playersCastSpells);
    }, [playersCastSpells]);

    useEffect(() => {
        if (summonedEntities == null) {
            return;
        }
        setGlobalSettingsValue(GLOBAL_STORAGE_KEYS.SUMMONED_ENTITIES_RULE, summonedEntities);
    }, [summonedEntities]);

    useEffect(() => {
        if (darknessOpacityMode == null) {
            return;
        }
        setGlobalSettingsValue(GLOBAL_STORAGE_KEYS.DARKNESS_OPACITY_MODE, darknessOpacityMode);
    }, [darknessOpacityMode]);

    const casterNameDisplay = defaultCaster && defaultCaster.length > 0
        ? defaultCaster.map((img) => img.name).join(", ")
        : null;

    return (
        <div ref={mainDiv} className="settings-container">
            <div className="settings-header">
                <div className="settings-header-title">
                    <FaGear className="settings-header-icon" />
                    <span>Settings</span>
                </div>
            </div>

            <div className="settings-card">
                <div className="settings-card-header">
                    <div className="settings-card-title-group">
                        <FaSliders style={{ color: "#38bdf8" }} />
                        <span>Local Settings</span>
                    </div>
                    <span className="settings-card-badge local">Client Only</span>
                </div>

                <div className="settings-row" title="If set, the first target for some spells will be one of these tokens, when applicable.">
                    <div className="settings-row-info">
                        <span className="settings-row-label">Default caster</span>
                        <span className="settings-row-desc">Initial target token for spells</span>
                    </div>
                    <div className="settings-row-control">
                        {casterNameDisplay && (
                            <span className="settings-caster-chip" title={casterNameDisplay}>
                                {casterNameDisplay}
                            </span>
                        )}
                        <button
                            type="button"
                            className="settings-btn-tactical"
                            onClick={() => setModalOpened("choose-caster-type")}
                        >
                            <FaUser style={{ fontSize: "0.7rem" }} />
                            <span>{casterNameDisplay ? "Change" : "Select"}</span>
                        </button>
                    </div>
                </div>

                <div className="settings-row" title="A scaling factor for effects; a spell's width and height will be multiplied by this number. Useful if your grid size is not 5ft.">
                    <div className="settings-row-info">
                        <span className="settings-row-label">Grid scaling factor</span>
                        <span className="settings-row-desc">Multiplier for non-5ft grids</span>
                    </div>
                    <div className="settings-row-control">
                        <input
                            name="grid-scaling-factor"
                            min="0"
                            step="0.1"
                            type="number"
                            placeholder={(tryComputeGridScaling(gridScale) ?? 1).toString()}
                            className="settings-dark-input"
                            value={gridScalingFactor ?? ""}
                            onChange={(event) => setGridScalingFactor(event.target.value)}
                        />
                    </div>
                </div>

                <div className="settings-row" title="Clicking a character token while aiming will immediately cast and roll the attack/spell (Shift+click for Advantage, Ctrl+click for Disadvantage).">
                    <div className="settings-row-info">
                        <span className="settings-row-label">Smart Action-on-Target</span>
                        <span className="settings-row-desc">Aim-click token to cast (Shift: Adv, Ctrl: Disadv)</span>
                    </div>
                    <div className="settings-row-control">
                        <label className="settings-toggle-switch">
                            <input
                                type="checkbox"
                                checked={smartActionOnTarget ?? true}
                                onChange={(event) => {
                                    setSmartActionOnTarget(event.currentTarget.checked);
                                    setSettingsValue(LOCAL_STORAGE_KEYS.SMART_ACTION_ON_TARGET, event.currentTarget.checked);
                                }}
                            />
                            <span className="settings-toggle-slider" />
                        </label>
                    </div>
                </div>

                <div className="settings-row" title="Whether to keep the selected targets the same after a spell is cast / the tool is de-selected.">
                    <div className="settings-row-info">
                        <span className="settings-row-label">Keep selected targets</span>
                        <span className="settings-row-desc">Preserve targets after cast</span>
                    </div>
                    <div className="settings-row-control">
                        <label className="settings-toggle-switch">
                            <input
                                type="checkbox"
                                checked={keepTargets ?? false}
                                onChange={(event) => setKeepTargets(event.currentTarget.checked)}
                            />
                            <span className="settings-toggle-slider" />
                        </label>
                    </div>
                </div>

                <div className="settings-row" title="The maximum size of the recent spells list in the spellbook.">
                    <div className="settings-row-info">
                        <span className="settings-row-label">Recent spells list size</span>
                        <span className="settings-row-desc">Max items in quick spells</span>
                    </div>
                    <div className="settings-row-control">
                        <input
                            name="recent-spells-list-size"
                            min="0"
                            type="number"
                            className="settings-dark-input"
                            value={mostRecentSize ?? ""}
                            onChange={(event) => setMostRecentSize(event.target.value)}
                        />
                    </div>
                </div>

                <div className="settings-row" title="How many updates per second are performed when animating items.">
                    <div className="settings-row-info">
                        <span className="settings-row-label">Animation update rate</span>
                        <span className="settings-row-desc">Animation FPS (updates/sec)</span>
                    </div>
                    <div className="settings-row-control">
                        <input
                            name="animation-update-rate"
                            min="0"
                            type="number"
                            className="settings-dark-input"
                            value={animationRate ?? ""}
                            onChange={(event) => setAnimationRate(event.target.value)}
                        />
                    </div>
                </div>
            </div>

            {obr.player?.role === "GM" && (
                <div className="settings-card">
                    <div className="settings-card-header">
                        <div className="settings-card-title-group">
                            <FaCrown style={{ color: "#fbbf24" }} />
                            <span>GM Settings</span>
                        </div>
                        <span className="settings-card-badge gm">GM Only</span>
                    </div>

                    <div className="settings-row" title="If set to false, only the GM can cast spells.">
                        <div className="settings-row-info">
                            <span className="settings-row-label">Players can cast spells</span>
                            <span className="settings-row-desc">Allow players to cast spells</span>
                        </div>
                        <div className="settings-row-control">
                            <label className="settings-toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={playersCastSpells ?? false}
                                    onChange={(event) => setPlayersCastSpells(event.currentTarget.checked)}
                                />
                                <span className="settings-toggle-slider" />
                            </label>
                        </div>
                    </div>

                    <div
                        className="settings-row"
                        title='Who should own items summoned by Embers. "Caster" means the player who cast the spell will own them, while "GM" means that the GM will own them.'
                    >
                        <div className="settings-row-info">
                            <span className="settings-row-label">Summoned entities rule</span>
                            <span className="settings-row-desc">Ownership of summoned items</span>
                        </div>
                        <div className="settings-row-control">
                            <select
                                className="settings-dark-select"
                                onChange={(event) => setSummonedEntities(event.target.value)}
                                value={summonedEntities ?? ""}
                            >
                                <option value="gm-only">GM Only</option>
                                <option value="caster">Caster</option>
                            </select>
                        </div>
                    </div>

                    <div
                        className="settings-row"
                        title="Darkness spell opacity mode. 'Dynamic' applies D&D rules (Devil's Sight/Truesight see through, others see opaque black fog). 'Always Transparent' makes all darkness transparent for the whole room. 'Always Opaque' forces solid fog for everyone."
                    >
                        <div className="settings-row-info">
                            <span className="settings-row-label">Darkness opacity mode</span>
                            <span className="settings-row-desc">Dynamic vision vs fixed fog</span>
                        </div>
                        <div className="settings-row-control">
                            <select
                                className="settings-dark-select"
                                onChange={(event) => setDarknessOpacityMode(event.target.value)}
                                value={darknessOpacityMode ?? "dynamic"}
                            >
                                <option value="dynamic">Dynamic (Vision)</option>
                                <option value="always-transparent">Always Transparent</option>
                                <option value="always-opaque">Always Opaque</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

            <Dialog
                open={modalOpened === "choose-caster-type"}
                onClose={closeModal}
                slots={{ transition: Fade }}
                slotProps={{
                    transition: { timeout: 250 },
                    paper: { className: "settings-modal-paper" },
                }}
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle className="settings-modal-title">
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <FaUser style={{ color: "#e11d48" }} />
                            <span>Choose Default Caster</span>
                        </div>
                        <button
                            type="button"
                            onClick={closeModal}
                            style={{
                                background: "none",
                                border: "none",
                                color: "#9ca3af",
                                cursor: "pointer",
                                fontSize: "1rem",
                                padding: 4,
                            }}
                        >
                            <FaXmark />
                        </button>
                    </div>
                </DialogTitle>

                <DialogContent sx={{ p: 2, pt: "12px !important" }}>
                    <Typography variant="body2" sx={{ color: "#cbd5e1", mb: 1.5, fontSize: "0.82rem" }}>
                        Choose an asset image or use your currently selected token on the scene map:
                    </Typography>

                    <div
                        style={{
                            background: "#182030",
                            border: "1px solid #26334d",
                            borderRadius: 6,
                            padding: "8px 12px",
                            marginBottom: "16px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 700 }}>
                            Current Caster:
                        </span>
                        <span
                            style={{
                                fontSize: "0.8rem",
                                fontWeight: 800,
                                color: casterNameDisplay ? "#60a5fa" : "#64748b",
                            }}
                        >
                            {casterNameDisplay ?? "None"}
                        </span>
                    </div>

                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        <button
                            type="button"
                            className="settings-modal-btn primary"
                            onClick={() => {
                                handleSetCasterFromSelection();
                                closeModal();
                            }}
                        >
                            <FaArrowsToDot style={{ marginRight: 6 }} /> Use Selected Token
                        </button>
                        <button
                            type="button"
                            className="settings-modal-btn secondary"
                            onClick={() => {
                                handleAssetPicker();
                                closeModal();
                            }}
                        >
                            <FaImage style={{ marginRight: 6 }} /> Pick From Assets
                        </button>
                        {defaultCaster && defaultCaster.length > 0 && (
                            <button
                                type="button"
                                className="settings-modal-btn danger"
                                onClick={() => {
                                    setDefaultCaster([]);
                                    closeModal();
                                }}
                            >
                                <FaTrashCan style={{ marginRight: 6 }} /> Clear Selection
                            </button>
                        )}
                    </Box>
                </DialogContent>
            </Dialog>
        </div>
    );
}
