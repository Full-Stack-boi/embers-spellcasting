import "./SceneControls.css";

import {
    FaArrowPointer,
    FaEye,
    FaEyeSlash,
    FaLink,
    FaLinkSlash,
    FaSquareMinus,
    FaLocationCrosshairs,
} from "react-icons/fa6";
import OBR, { Item, Player } from "@owlbear-rodeo/sdk";
import { destroySpell, getSpell } from "../effects/spells";
import { effectMetadataKey, spellMetadataKey } from "../effects/effects";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    focusCameraOnToken,
    getMyPrimaryCharacterToken,
    bindTokenToPlayer,
    unbindTokenFromPlayer,
    isCharacterToken,
    getOtherClaimedPlayer
} from "../features/player/playerCharacterService";

import { MessageType } from "../types/messageListener";
import { Spell } from "../types/spells";
import { useOBR } from "../platform/obr/react/providers";
import { Typography } from "@mui/material";

function SpellDisplay({
    spellID,
    effectID,
    item,
    caster,
}: {
    spellID?: string;
    effectID?: string;
    item: Item;
    caster: Player;
}) {
    const obr = useOBR();
    const [spell, setSpell] = useState<Spell>();
    const [attachedToName, setAttachedToName] = useState<string>();
    const [isGM, setIsGM] = useState<boolean>(false);

    const selectItem = useCallback(() => {
        OBR.player.select([item.id], false);
    }, [item]);

    const toggleItemVisibility = useCallback(() => {
        OBR.scene.items.updateItems([item], (items) => {
            for (const itemDraft of items) {
                itemDraft.visible = !item.visible;
            }
        });
    }, [item]);

    const toggleItemDisableHit = useCallback(() => {
        OBR.scene.items.updateItems([item], (items) => {
            for (const itemDraft of items) {
                itemDraft.disableHit = !item.disableHit;
            }
        });
    }, [item]);

    const deleteItem = useCallback(() => {
        if (
            spellID != undefined &&
            spell?.onDestroyBlueprints &&
            spell.onDestroyBlueprints.length > 0
        ) {
            destroySpell(spellID, caster.id, [item]);
        }
        OBR.scene.items.deleteItems([item.id]);
    }, [item, spellID, spell?.onDestroyBlueprints, caster.id]);

    useEffect(() => {
        if (!obr.ready || !obr.player?.role) {
            return;
        }
        if (obr.player.role != "GM" && isGM) {
            setIsGM(false);
        } else if (obr.player.role == "GM" && !isGM) {
            setIsGM(true);
        }
    }, [obr.ready, obr.player?.role, isGM]);

    useEffect(() => {
        if (spellID == undefined) {
            return;
        }
        setSpell(getSpell(spellID, isGM));
    }, [spellID, isGM]);

    useEffect(() => {
        if (item.attachedTo != undefined) {
            OBR.scene.items
                .getItems([item.attachedTo])
                .then((item) => setAttachedToName(item[0]?.name));
        }
    }, [item.attachedTo]);

    if (spell == undefined) {
        return null;
    }

    return (
        <div className="scene-spell-display-item">
            <p
                title={`Spell name: ${
                    spell.name
                }\nEffect ID: ${effectID}\nAttached to: ${
                    attachedToName ?? "nothing"
                }\nCaster: ${caster.name}`}
            >
                {" "}
                {spell.name}
            </p>
            <div className="scene-spell-display-controls">
                <div
                    className="scene-spell-display-control-button"
                    onClick={selectItem}
                    title="Select this effect"
                >
                    <FaArrowPointer />
                </div>
                <div
                    className="scene-spell-display-control-button"
                    onClick={toggleItemDisableHit}
                    title={item.disableHit ? "Enable hit" : "Disable hit"}
                >
                    {item.disableHit ? <FaLinkSlash /> : <FaLink />}
                </div>
                <div
                    className="scene-spell-display-control-button"
                    onClick={toggleItemVisibility}
                    title={item.visible ? "Hide effect" : "Show effect"}
                >
                    {item.visible ? <FaEye /> : <FaEyeSlash />}
                </div>
                <div
                    className="scene-spell-display-control-button"
                    onClick={deleteItem}
                    title="Delete this effect"
                >
                    <FaSquareMinus />
                </div>
            </div>
        </div>
    );
}

function MyCharacterCard() {
    const obr = useOBR();
    const [primaryToken, setPrimaryToken] = useState<Item | null>(null);

    const refreshCharacter = useCallback(async () => {
        if (!obr.ready || !obr.sceneReady || !obr.player?.id) return;
        const token = await getMyPrimaryCharacterToken(obr.player.id);
        setPrimaryToken(token);
    }, [obr.ready, obr.sceneReady, obr.player?.id]);

    useEffect(() => {
        refreshCharacter();
        return OBR.scene.items.onChange(() => {
            refreshCharacter();
        });
    }, [refreshCharacter]);

    const handleFocusCamera = async () => {
        if (primaryToken) {
            await focusCameraOnToken(primaryToken.id);
        }
    };

    const handleSelectToken = async () => {
        if (primaryToken) {
            await OBR.player.select([primaryToken.id], true);
        }
    };

    const handleUnbindCharacter = async () => {
        if (primaryToken) {
            await unbindTokenFromPlayer(primaryToken.id);
            OBR.notification.show(`Removed "${primaryToken.name || "Token"}" from your characters.`, "INFO");
            await refreshCharacter();
        }
    };

    const handleClaimCurrentSelection = async () => {
        if (!obr.player?.id) return;
        const selection = await OBR.player.getSelection();
        if (!selection || selection.length === 0) {
            OBR.notification.show("Please select a character token on the map first.", "WARNING");
            return;
        }
        const items = await OBR.scene.items.getItems([selection[0]]);
        const item = items[0];
        if (!item || !isCharacterToken(item)) {
            OBR.notification.show("Selected item is not a valid character token.", "WARNING");
            return;
        }
        const otherOwner = getOtherClaimedPlayer(item, obr.player.id);
        if (otherOwner) {
            OBR.notification.show(`This character is already claimed by ${otherOwner.playerName || "another player"}.`, "WARNING");
            return;
        }
        await bindTokenToPlayer(selection[0], obr.player.id, obr.player.name);
        OBR.notification.show("Claimed selected token as your character!", "SUCCESS");
        await refreshCharacter();
    };

    return (
        <div className="scene-character-card">
            <Typography variant="h6" className="subtitle" sx={{ mb: 1 }}>
                My Character
            </Typography>
            {primaryToken ? (
                <div className="scene-character-body">
                    <div className="scene-character-info">
                        <span className="scene-character-name">{primaryToken.name || "Unnamed Character"}</span>
                        <span className="scene-character-badge">Bound</span>
                    </div>
                    <div className="scene-character-actions">
                        <button
                            type="button"
                            className="scene-char-btn primary"
                            onClick={handleFocusCamera}
                            title="Focus camera on character (C)"
                        >
                            <FaLocationCrosshairs style={{ marginRight: 6 }} /> Focus Camera
                        </button>
                        <button
                            type="button"
                            className="scene-char-btn secondary"
                            onClick={handleSelectToken}
                            title="Select character token"
                        >
                            Select Token
                        </button>
                        <button
                            type="button"
                            className="scene-char-btn danger"
                            onClick={handleUnbindCharacter}
                            title="Release this character"
                        >
                            Release
                        </button>
                    </div>
                </div>
            ) : (
                <div className="scene-character-unbound">
                    <p className="scene-character-hint">
                        No character bound yet. Select your token on the map and claim it below.
                    </p>
                    <button
                        type="button"
                        className="scene-char-btn primary"
                        onClick={handleClaimCurrentSelection}
                    >
                        Claim Selected Token
                    </button>
                </div>
            )}
        </div>
    );
}

export default function SceneControls() {
    const obr = useOBR();
    const [party, setParty] = useState<Player[]>([]);
    const [player, setPlayer] = useState<Player | null>(null);
    const [globalSpellItems, _setGlobalSpellItems] = useState<Item[]>([]);

    const spellEffectsPresent = useMemo(() => {
        const playerIDs = [player, ...party]
            .map((player) => player?.id)
            .filter((player) => player != undefined);
        for (const item of globalSpellItems) {
            const caster = (
                item.metadata[spellMetadataKey] as MessageType["spellData"]
            )?.caster;
            if (caster != undefined && playerIDs.includes(caster)) {
                return true;
            }
        }
        return false;
    }, [player, party, globalSpellItems]);

    const setGlobalSpellItems = useCallback(
        (items: Item[]) =>
            _setGlobalSpellItems(
                items.filter(
                    (item) =>
                        item.metadata[effectMetadataKey] != undefined ||
                        item.metadata[spellMetadataKey] != undefined
                )
            ),
        []
    );

    const PlayerEffects = useCallback(
        ({ player }: { player: Player }) => {
            const playerItems = globalSpellItems.filter(
                (item) =>
                    (
                        item.metadata[
                            spellMetadataKey
                        ] as MessageType["spellData"]
                    )?.caster === player.id &&
                    (
                        item.metadata[
                            spellMetadataKey
                        ] as MessageType["spellData"]
                    )?.name != undefined
            );

            if (playerItems.length === 0) {
                return null;
            }

            return (
                <div>
                    <p className="bold">{player.name}</p>
                    <ul className="scene-spell-list">
                        {playerItems.map((item) => (
                            <SpellDisplay
                                key={item.id}
                                spellID={
                                    (
                                        item.metadata[
                                            spellMetadataKey
                                        ] as MessageType["spellData"]
                                    )?.name
                                }
                                effectID={
                                    item.metadata[effectMetadataKey] as string
                                }
                                item={item}
                                caster={player}
                            />
                        ))}
                    </ul>
                </div>
            );
        },
        [globalSpellItems]
    );

    useEffect(() => {
        if (!obr.ready || !obr.sceneReady || obr.player?.role !== "GM") {
            setParty([]);
            return;
        }
        setParty(obr.party);
    }, [obr.ready, obr.sceneReady, obr.party, obr.player?.role]);

    useEffect(() => {
        if (!obr.ready || !obr.sceneReady) {
            setPlayer(null);
            return;
        }
        setPlayer(obr.player);
    }, [obr.ready, obr.sceneReady, obr.player]);

    useEffect(() => {
        if (!obr.ready || !obr.sceneReady) {
            return;
        }

        const unmountGlobal = OBR.scene.items.onChange(setGlobalSpellItems);
        OBR.scene.items.getItems().then((globalItems) => {
            setGlobalSpellItems(globalItems);
        });

        return () => {
            unmountGlobal();
        };
    }, [obr.ready, obr.sceneReady, setGlobalSpellItems]);

    return (
        <div>
            {player ? (
                <>
                    <MyCharacterCard />
                    <Typography variant="h6" className="subtitle">
                        Active Effects
                    </Typography>
                    {[player, ...party].map((player) => (
                        <PlayerEffects key={player.id} player={player} />
                    ))}
                    {!spellEffectsPresent && (
                        <p>No spell effects in this scene.</p>
                    )}
                </>
            ) : (
                <p>No scene selected.</p>
            )}
        </div>
    );
}
