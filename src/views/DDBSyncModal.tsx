import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import OBR from "@owlbear-rodeo/sdk";
import { DDBCharacterSyncModal } from "../components/ActionDock/overlays/DDBCharacterSyncModal";
import { APP_KEY } from "../config";
import { Box } from "@mui/material";

export const ddbSyncModalId = `${APP_KEY}/ddb-sync-modal`;

/**
 * Opens the native OBR floating modal for D&D Beyond character synchronization.
 */
export async function openDDBSyncModal(tokenId?: string) {
    const search = window.location.search || "";
    const tokenParam = tokenId ? `/${encodeURIComponent(tokenId)}` : "";
    await OBR.modal.open({
        id: ddbSyncModalId,
        url: `${window.location.origin}/ddb-sync-modal${tokenParam}${search}`,
        width: 480,
        height: 560,
    });
}

export const DDBSyncModal: React.FC = () => {
    const { tokenId } = useParams();
    const [activeTokenId, setActiveTokenId] = useState<string | undefined>(tokenId);

    useEffect(() => {
        if (!tokenId) {
            // If no token was passed in params, try resolving current selection
            OBR.player.getSelection().then(selection => {
                if (selection && selection.length === 1) {
                    setActiveTokenId(selection[0]);
                }
            });
        }
    }, [tokenId]);

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                bgcolor: "#0a0c10",
                p: 0,
            }}
        >
            <DDBCharacterSyncModal
                isOpen={true}
                onClose={() => OBR.modal.close(ddbSyncModalId)}
                activeTokenId={activeTokenId}
                onCharacterSynced={() => {
                    // Modal can remain open to display character card, or close after a brief delay
                }}
            />
        </Box>
    );
};

export default DDBSyncModal;
