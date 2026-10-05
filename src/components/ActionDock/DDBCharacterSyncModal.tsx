import React, { useState, useEffect } from "react";
import "./DDBCharacterSyncModal.css";
import OBR from "@owlbear-rodeo/sdk";
import {
    extractDDBCharacterId,
    fetchDDBCharacter,
    getCachedDDBCharacter,
    cacheDDBCharacter,
    parseDDBCharacterData,
    linkCharacterToToken,
    getLinkedDDBCharacterId
} from "../../services/ddbService";
import { DDBParsedCharacter } from "../../types/ddb";
import { TOKEN_VISION_METADATA_KEY } from "../../features/targeting/application/lineOfSightService";

interface DDBCharacterSyncModalProps {
    isOpen: boolean;
    onClose: () => void;
    activeTokenId?: string;
    onCharacterSynced?: (char: DDBParsedCharacter) => void;
}

export const DDBCharacterSyncModal: React.FC<DDBCharacterSyncModalProps> = ({
    isOpen,
    onClose,
    activeTokenId,
    onCharacterSynced
}) => {
    const [urlInput, setUrlInput] = useState("");
    const [jsonInput, setJsonInput] = useState("");
    const [isJsonMode, setIsJsonMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [character, setCharacter] = useState<DDBParsedCharacter | null>(null);

    // Load existing linked character for active token if available
    useEffect(() => {
        if (!isOpen || !activeTokenId) return;

        (async () => {
            try {
                const items = await OBR.scene.items.getItems([activeTokenId]);
                if (items.length > 0) {
                    const charId = getLinkedDDBCharacterId(items[0]);
                    if (charId) {
                        const cached = getCachedDDBCharacter(charId);
                        if (cached) {
                            setCharacter(cached);
                            setUrlInput(`https://www.dndbeyond.com/characters/${charId}`);
                        }
                    }
                }
            } catch {}
        })();
    }, [isOpen, activeTokenId]);

    if (!isOpen) return null;

    const handleSync = async () => {
        setErrorMsg(null);
        const charId = extractDDBCharacterId(urlInput);
        if (!charId) {
            setErrorMsg("Please enter a valid D&D Beyond Character URL or ID");
            return;
        }

        setIsLoading(true);
        try {
            const parsed = await fetchDDBCharacter(charId);
            setCharacter(parsed);

            // Link to active token if present
            if (activeTokenId) {
                await linkCharacterToToken(activeTokenId, charId);

                // Also sync vision rules to token metadata
                if (parsed.senses) {
                    await OBR.scene.items.updateItems([activeTokenId], items => {
                        items.forEach(item => {
                            item.metadata[TOKEN_VISION_METADATA_KEY] = parsed.senses;
                        });
                    });
                }
            }

            OBR.notification.show(`Synced ${parsed.name} (Lv ${parsed.level}) from D&D Beyond!`, "SUCCESS");
            onCharacterSynced?.(parsed);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to sync character";
            setErrorMsg(message);
            OBR.notification.show(message, "ERROR");
        } finally {
            setIsLoading(false);
        }
    };

    const handleImportJson = async () => {
        setErrorMsg(null);
        if (!jsonInput.trim()) {
            setErrorMsg("Please paste your character JSON data");
            return;
        }

        setIsLoading(true);
        try {
            const raw = JSON.parse(jsonInput.trim());
            if (raw.success === false || raw.data?.serverMessage) {
                setErrorMsg(
                    `D&D Beyond Error: ${raw.data?.serverMessage || raw.message || "Unauthorized"}.\n\n` +
                    `Your character appears to be set to Private. Please edit your character on D&D Beyond, open the "Home" tab, and change Character Privacy to "Public".`
                );
                setIsLoading(false);
                return;
            }

            const parsed = parseDDBCharacterData(raw);
            setCharacter(parsed);
            cacheDDBCharacter(parsed);

            if (activeTokenId) {
                await linkCharacterToToken(activeTokenId, parsed.id);
                if (parsed.senses) {
                    await OBR.scene.items.updateItems([activeTokenId], items => {
                        items.forEach(item => {
                            item.metadata[TOKEN_VISION_METADATA_KEY] = parsed.senses;
                        });
                    });
                }
            }

            OBR.notification.show(`Synced ${parsed.name} (Lv ${parsed.level}) from JSON!`, "SUCCESS");
            onCharacterSynced?.(parsed);
            setIsJsonMode(false);
            setJsonInput("");
        } catch (err) {
            setErrorMsg(err instanceof Error && err.message.includes("Private") ? err.message : "Invalid JSON format. Please make sure you copied the full character data.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUnlink = async () => {
        if (activeTokenId) {
            await OBR.scene.items.updateItems([activeTokenId], items => {
                items.forEach(item => {
                    delete item.metadata[`eu.armindo.embers/ddb-character-id`];
                });
            });
        }
        setCharacter(null);
        setUrlInput("");
        OBR.notification.show("Unlinked D&D Beyond Character", "INFO");
    };

    const extractedId = extractDDBCharacterId(urlInput);
    const ddbApiUrl = `https://character-service.dndbeyond.com/character/v5/character/${extractedId || 170484944}`;

    return (
        <div className="ddb-modal-backdrop" onClick={onClose}>
            <div className="ddb-modal-card" onClick={e => e.stopPropagation()}>
                <div className="ddb-modal-header">
                    <div className="ddb-modal-title-group">
                        <span className="ddb-modal-icon">🐉</span>
                        <h3 className="ddb-modal-title">D&D Beyond Character Sync</h3>
                    </div>
                    <button className="ddb-modal-close-btn" onClick={onClose}>✕</button>
                </div>

                <div className="ddb-modal-body">
                    <p className="ddb-modal-desc">
                        Paste your D&D Beyond Character URL or ID to auto-sync spells, slots, spell save DC, and senses.
                    </p>

                    {!isJsonMode ? (
                        <div className="ddb-input-row">
                            <input
                                type="text"
                                className="ddb-url-input"
                                placeholder="https://www.dndbeyond.com/characters/..."
                                value={urlInput}
                                onChange={e => setUrlInput(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && handleSync()}
                                disabled={isLoading}
                            />
                            <button
                                className="ddb-sync-btn"
                                onClick={handleSync}
                                disabled={isLoading}
                            >
                                {isLoading ? "Syncing..." : "Sync"}
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <p className="ddb-modal-desc" style={{ color: "#cbd5e1" }}>
                                1. Open{" "}
                                <a
                                    className="ddb-api-link"
                                    href={ddbApiUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    D&D Beyond API Link ↗
                                </a>{" "}
                                in a new tab.<br />
                                2. Copy all text (Ctrl+A, Ctrl+C) and paste below:
                            </p>
                            <p className="ddb-modal-desc" style={{ color: "#9ca3af", fontSize: "0.75rem" }}>
                                💡 Note: If the link shows &quot;Unauthorized Access Attempt&quot;, your character is Private. In D&amp;D Beyond: Edit Character → &quot;Home&quot; tab → set <strong>Character Privacy</strong> to <strong>Public</strong>.
                            </p>
                            <textarea
                                className="ddb-json-textarea"
                                rows={5}
                                placeholder='Paste { "id": 170484944, "data": { ... } } here...'
                                value={jsonInput}
                                onChange={e => setJsonInput(e.target.value)}
                                disabled={isLoading}
                            />
                            <button
                                className="ddb-sync-btn"
                                onClick={handleImportJson}
                                disabled={isLoading}
                            >
                                {isLoading ? "Importing..." : "Import JSON"}
                            </button>
                        </div>
                    )}

                    <button
                        type="button"
                        className="ddb-toggle-json-btn"
                        onClick={() => setIsJsonMode(!isJsonMode)}
                    >
                        {isJsonMode ? "← Back to URL Sync" : "Can't connect? Paste Character JSON directly"}
                    </button>

                    {errorMsg && (
                        <div className="ddb-error-banner" style={{ whiteSpace: "pre-line" }}>
                            {errorMsg}
                        </div>
                    )}

                    {character && (
                        <div className="ddb-char-summary-card">
                            <div className="ddb-char-header">
                                {character.avatarUrl && (
                                    <img
                                        className="ddb-char-avatar"
                                        src={character.avatarUrl}
                                        alt={character.name}
                                    />
                                )}
                                <div className="ddb-char-info">
                                    <h4 className="ddb-char-name">{character.name}</h4>
                                    <span className="ddb-char-classes">
                                        Level {character.level} {character.classes.map(c => `${c.name}${c.subclass ? ` (${c.subclass})` : ""}`).join(" / ")}
                                    </span>
                                </div>
                            </div>

                            <div className="ddb-char-stats-grid">
                                <div className="ddb-stat-chip">
                                    <span className="ddb-stat-label">Spell Save DC</span>
                                    <span className="ddb-stat-value">{character.spellSaveDC}</span>
                                </div>
                                <div className="ddb-stat-chip">
                                    <span className="ddb-stat-label">Spell Attack</span>
                                    <span className="ddb-stat-value">+{character.spellAttackBonus}</span>
                                </div>
                                <div className="ddb-stat-chip">
                                    <span className="ddb-stat-label">Ability</span>
                                    <span className="ddb-stat-value">{character.spellCastingAbility}</span>
                                </div>
                                <div className="ddb-stat-chip">
                                    <span className="ddb-stat-label">Spells</span>
                                    <span className="ddb-stat-value">{character.spells.length} loaded</span>
                                </div>
                            </div>

                            {character.senses?.darkvision ? (
                                <div className="ddb-senses-row">
                                    👁️ Darkvision: {character.senses.darkvision} ft
                                    {character.senses.devilsSight ? " • 😈 Devil's Sight" : ""}
                                </div>
                            ) : null}

                            <div className="ddb-char-actions">
                                <button className="ddb-unlink-btn" onClick={handleUnlink}>
                                    Unlink Character
                                </button>
                                <button className="ddb-resync-btn" onClick={handleSync} disabled={isLoading}>
                                    ↻ Re-sync Now
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
