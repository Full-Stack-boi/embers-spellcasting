import "./SpellSelectionPopover.css";

import { APP_KEY, ASSET_LOCATION } from "../config";
import { LOCAL_STORAGE_KEYS, getSettingsValue } from "../components/Settings/settings";
import { getSpell, spellIDs } from "../effects/spells";
import { getSpellMetadata, getSchoolStyle } from "../assets/spellInfo";
import { useEffect, useMemo, useState } from "react";

import OBR from "@owlbear-rodeo/sdk";
import { setSelectedSpell, toolID } from "../effectsTool";
import { useOBR } from "../platform/obr/react/providers";
import { constants } from "../constants";
import SpellDetailViewer from "../components/SpellDetailViewer/SpellDetailViewer";

export const spellPopoverId = `${APP_KEY}/spell-popover`;
export const mostRecentEffectsMetadataKey = `${APP_KEY}/most-recent-effects`;

type TabType = "ALL" | "CANTRIP" | "LV1" | "LV2" | "LV3+";

async function selectSpell(spellName: string) {
    // Update recent spells list
    const mostRecentSpellsList = (await getMostRecentSpells()).filter(
        name => name !== spellName
    );
    mostRecentSpellsList.splice(0, 0, spellName);
    if (mostRecentSpellsList.length > getSettingsValue(LOCAL_STORAGE_KEYS.MOST_RECENT_SPELLS_LIST_SIZE)) {
        mostRecentSpellsList.pop();
    }
    await OBR.player.setMetadata({ [mostRecentEffectsMetadataKey]: mostRecentSpellsList });

    setSelectedSpell(spellName);
    await OBR.tool.activateTool(toolID);

    // Close this popover
    await OBR.popover.close(spellPopoverId);
}

async function getMostRecentSpells(): Promise<string[]> {
    const metadata = await OBR.player.getMetadata();
    if (!metadata) return [];
    const mostRecentSpellsList = metadata[mostRecentEffectsMetadataKey];
    if (!Array.isArray(mostRecentSpellsList) || mostRecentSpellsList.length === 0) {
        return [];
    }
    return mostRecentSpellsList as string[];
}

async function getSortedSpellsList(): Promise<string[]> {
    const [metadata, mostRecentSpellsList] = await Promise.all([
        OBR.scene.getMetadata(),
        getMostRecentSpells()
    ]);
    const localSpellIDs = Array.isArray(metadata[constants.SPELL_LIST_METADATA_KEY])
        ? (metadata[constants.SPELL_LIST_METADATA_KEY] as string[])
        : [];
    const allSpellIDs = [...spellIDs, ...localSpellIDs.map(id => `$.${id}`)].sort((s1, s2) => s1.localeCompare(s2));
    const effectNamesWithoutMostRecent = allSpellIDs.filter(name => !mostRecentSpellsList.includes(name));
    return mostRecentSpellsList.concat(effectNamesWithoutMostRecent);
}

function normalizeSearch(str: string) {
    return str.toLowerCase().replaceAll("_", " ").replaceAll(".", " ");
}

interface SpellListItemProps {
    spellName: string;
    isGM: boolean;
    isPreviewed: boolean;
    onSelect: () => void;
    onHover: () => void;
}

const SpellListItem: React.FC<SpellListItemProps> = ({
    spellName,
    isGM,
    isPreviewed,
    onSelect,
    onHover
}) => {
    const [imgFailed, setImgFailed] = useState(false);
    const [ddbIconFailed, setDdbIconFailed] = useState(false);
    const spell = getSpell(spellName, isGM);
    const meta = getSpellMetadata(spellName, spell?.name);
    const schoolStyle = getSchoolStyle(meta.school);
    const thumbUrl = spell?.thumbnail ? `${ASSET_LOCATION}/${spell.thumbnail}` : null;
    const ddbSchoolIcon = meta.school ? `https://media.dndbeyond.com/media/spell-school-icons/${meta.school.toLowerCase()}.svg` : null;

    return (
        <li
            className={isPreviewed ? "active-preview" : ""}
            onClick={onSelect}
            onMouseEnter={onHover}
        >
            {thumbUrl && !imgFailed ? (
                <img
                    className="spell-selection-thumbnail"
                    src={thumbUrl}
                    alt=""
                    onError={() => setImgFailed(true)}
                    loading="lazy"
                />
            ) : ddbSchoolIcon && !ddbIconFailed ? (
                <div
                    className="spell-selection-thumbnail"
                    style={{
                        background: "#18191c",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxSizing: "border-box",
                        border: `1px solid ${schoolStyle.color}`
                    }}
                >
                    <img
                        src={ddbSchoolIcon}
                        alt=""
                        onError={() => setDdbIconFailed(true)}
                        style={{ width: "80%", height: "80%", objectFit: "contain" }}
                        loading="lazy"
                    />
                </div>
            ) : (
                <div
                    className="spell-selection-thumbnail"
                    style={{
                        background: schoolStyle.gradient,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.1rem",
                        boxSizing: "border-box"
                    }}
                >
                    {schoolStyle.emoji}
                </div>
            )}
            <div className="spell-item-info">
                <p className="spell-name">{meta.name}</p>
                <p className="spell-subtext">{meta.school}</p>
            </div>
            <span className="spell-level-badge">
                {meta.level === 0 ? "C" : `L${meta.level}`}
            </span>
        </li>
    );
};

export default function SpellSelectionPopover() {
    const obr = useOBR();
    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState<TabType>("ALL");
    const [sortedSpellsList, setSortedSpellsList] = useState<string[]>([]);
    const [previewSpell, setPreviewSpell] = useState<string>("");
    const [isGM, setIsGM] = useState(false);

    useEffect(() => {
        if (!obr.ready || !obr.player?.role) return;
        setIsGM(obr.player.role === "GM");
    }, [obr.ready, obr.player?.role]);

    useEffect(() => {
        if (!obr.ready || !obr.sceneReady) return;
        getSortedSpellsList().then(list => {
            setSortedSpellsList(list);
            if (list.length > 0) {
                setPreviewSpell(list[0]);
            }
        });
    }, [obr.ready, obr.sceneReady]);

    // Filter spells by search text and tab
    const filteredSpells = useMemo(() => {
        const query = normalizeSearch(search);
        return sortedSpellsList.filter(spellName => {
            const spell = getSpell(spellName, isGM);
            const meta = getSpellMetadata(spellName, spell?.name);

            // Tab filter
            if (activeTab === "CANTRIP" && meta.level !== 0) return false;
            if (activeTab === "LV1" && meta.level !== 1) return false;
            if (activeTab === "LV2" && meta.level !== 2) return false;
            if (activeTab === "LV3+" && meta.level < 3) return false;

            // Search filter
            if (!query) return true;
            const matchesId = normalizeSearch(spellName).includes(query);
            const matchesName = normalizeSearch(meta.name).includes(query);
            const matchesSchool = normalizeSearch(meta.school).includes(query);
            return matchesId || matchesName || matchesSchool;
        });
    }, [sortedSpellsList, search, activeTab, isGM]);

    // Ensure previewSpell points to an item in the filtered list
    useEffect(() => {
        if (filteredSpells.length > 0 && !filteredSpells.includes(previewSpell)) {
            setPreviewSpell(filteredSpells[0]);
        }
    }, [filteredSpells, previewSpell]);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.code === "Escape") {
            OBR.popover.close(spellPopoverId);
        } else if (event.code === "ArrowDown") {
            event.preventDefault();
            const currentIndex = filteredSpells.indexOf(previewSpell);
            if (currentIndex < filteredSpells.length - 1) {
                setPreviewSpell(filteredSpells[currentIndex + 1]);
            }
        } else if (event.code === "ArrowUp") {
            event.preventDefault();
            const currentIndex = filteredSpells.indexOf(previewSpell);
            if (currentIndex > 0) {
                setPreviewSpell(filteredSpells[currentIndex - 1]);
            }
        } else if (event.code === "Enter") {
            event.preventDefault();
            if (previewSpell) {
                selectSpell(previewSpell);
            }
        }
    };

    if (!obr.ready) {
        return null;
    }

    return (
        <div className="popover-container">
            <div className="spell-popover">
                {/* Left Pane: Search & Filtered List */}
                <div className="spell-list-pane">
                    <div className="spell-search-box">
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search spells or schools..."
                            autoFocus
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </div>

                    <div className="spell-filter-tabs">
                        <button
                            className={`spell-filter-tab ${activeTab === "ALL" ? "active" : ""}`}
                            onClick={() => setActiveTab("ALL")}
                        >
                            All
                        </button>
                        <button
                            className={`spell-filter-tab ${activeTab === "CANTRIP" ? "active" : ""}`}
                            onClick={() => setActiveTab("CANTRIP")}
                        >
                            Cantrip
                        </button>
                        <button
                            className={`spell-filter-tab ${activeTab === "LV1" ? "active" : ""}`}
                            onClick={() => setActiveTab("LV1")}
                        >
                            Lv 1
                        </button>
                        <button
                            className={`spell-filter-tab ${activeTab === "LV2" ? "active" : ""}`}
                            onClick={() => setActiveTab("LV2")}
                        >
                            Lv 2
                        </button>
                        <button
                            className={`spell-filter-tab ${activeTab === "LV3+" ? "active" : ""}`}
                            onClick={() => setActiveTab("LV3+")}
                        >
                            Lv 3+
                        </button>
                    </div>

                    <ul className="results-list">
                        {filteredSpells.length === 0 ? (
                            <li className="no-result">No spells found</li>
                        ) : (
                            filteredSpells.map(spellName => (
                                <SpellListItem
                                    key={spellName}
                                    spellName={spellName}
                                    isGM={isGM}
                                    isPreviewed={spellName === previewSpell}
                                    onSelect={() => selectSpell(spellName)}
                                    onHover={() => setPreviewSpell(spellName)}
                                />
                            ))
                        )}
                    </ul>
                </div>

                {/* Right Pane: Live Spell Card Preview */}
                <div className="spell-preview-pane">
                    {previewSpell ? (
                        <SpellDetailViewer
                            spellID={previewSpell}
                            onCast={() => selectSpell(previewSpell)}
                            castButtonLabel="⚡ Cast Spell"
                            style={{
                                border: "none",
                                boxShadow: "none",
                                background: "transparent",
                                padding: "4px 8px",
                                maxWidth: "100%",
                                width: "100%"
                            }}
                        />
                    ) : (
                        <div className="no-spells-found">
                            Select a spell to view details
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
