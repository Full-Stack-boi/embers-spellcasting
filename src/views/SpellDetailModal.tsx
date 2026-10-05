import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import OBR from "@owlbear-rodeo/sdk";
import SpellDetailViewer from "../components/SpellDetailViewer/SpellDetailViewer";
import { APP_KEY } from "../config";
import { toolMetadataSelectedSpell } from "../effectsTool";
import { Box } from "@mui/material";

export const spellDetailModalId = `${APP_KEY}/spell-detail-modal`;

export async function openSpellDetailModal(spellID: string) {
    const search = window.location.search || "";
    await OBR.modal.open({
        id: spellDetailModalId,
        url: `${window.location.origin}/spell-detail-modal/${encodeURIComponent(spellID)}${search}`,
        width: 440,
        height: 540,
    });
}

export const SpellDetailModal: React.FC = () => {
    const { spellID } = useParams();
    const [id, setId] = useState<string>(spellID || "");

    useEffect(() => {
        if (!spellID) {
            OBR.player.getMetadata().then(meta => {
                const s = meta?.[toolMetadataSelectedSpell] as string | undefined;
                if (s) setId(s);
            });
        }
    }, [spellID]);

    if (!id) {
        return (
            <Box sx={{ p: 3, textAlign: "center", color: "#94a3b8" }}>
                No spell selected.
            </Box>
        );
    }

    return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", p: 2 }}>
            <SpellDetailViewer
                spellID={id}
                onClose={() => OBR.modal.close(spellDetailModalId)}
            />
        </Box>
    );
};

export default SpellDetailModal;
