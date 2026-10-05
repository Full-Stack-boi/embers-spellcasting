import React, { useEffect, useMemo, useState } from "react";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { Route, Routes, useSearchParams } from "react-router";
import OBR from "@owlbear-rodeo/sdk";
import { darkTheme, lightTheme } from "../config/theme";
import { BaseOBRProvider } from "../platform/obr/react/providers/BaseOBRProvider";
import ActionDock from "../components/ActionDock/ActionDock";
import DDBRollLogPopover from "../views/DDBRollLogPopover";
import DDBSyncModal from "../views/DDBSyncModal";
import Docs from "../views/Docs";
import Listings from "../views/Listings";
import Main from "../views/Main";
import NewSpellModal from "../views/NewSpellModal";
import SpellDetailModal from "../views/SpellDetailModal";
import SpellSelectionPopover from "../views/SpellSelectionPopover";
import Tutorials from "../views/Tutorials";
import { log_error } from "../logging";

class ActionDockErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean; error: unknown }
> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: unknown) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("ActionDock ErrorBoundary caught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ color: "#f87171", padding: 16, background: "#181b20", borderRadius: 8, border: "1px solid #dc2626" }}>
                    <h3>Something went wrong in Action Bar</h3>
                    <pre style={{ fontSize: 12, whiteSpace: "pre-wrap" }}>{String(this.state.error)}</pre>
                </div>
            );
        }
        return this.props.children;
    }
}

export default function ExtensionApp() {
    const [searchParams] = useSearchParams();
    const [ready, setReady] = useState(false);
    const [themeMode, setThemeMode] = useState<"DARK" | "LIGHT">("DARK");

    useEffect(() => {
        if (!ready) return;
        try {
            OBR.theme.getTheme().then(theme => setThemeMode(theme.mode));
            return OBR.theme.onChange(theme => setThemeMode(theme.mode));
        } catch (error) {
            log_error(error);
            setReady(false);
        }
    }, [ready]);

    useEffect(() => OBR.onReady(() => setReady(true)), []);

    const isExtension =
        Boolean(searchParams.get("obrref")) ||
        window.location.pathname.includes("action-dock") ||
        window.location.pathname.includes("spell-") ||
        window.location.pathname.includes("new-spell") ||
        window.location.pathname.includes("ddb-") ||
        window.self !== window.top;

    const routes = useMemo(() => {
        if (!isExtension) {
            return (
                <Routes>
                    <Route index element={<Docs />} />
                    <Route path="tutorials" element={<Tutorials />} />
                    <Route path="listings" element={<Listings />} />
                </Routes>
            );
        }

        return (
            <BaseOBRProvider>
                <ThemeProvider theme={themeMode === "DARK" ? darkTheme : lightTheme}>
                    <CssBaseline />
                    <Box sx={{ height: "100vh", bgcolor: "transparent" }}>
                        <Routes>
                            <Route index element={<Main />} />
                            <Route path="spell-selection-popover" element={<SpellSelectionPopover />} />
                            <Route path="new-spell-modal/:spellID?" element={<NewSpellModal />} />
                            <Route path="action-dock" element={<ActionDockErrorBoundary><ActionDock /></ActionDockErrorBoundary>} />
                            <Route path="spell-detail-modal/:spellID?" element={<SpellDetailModal />} />
                            <Route path="ddb-sync-modal/:tokenId?" element={<DDBSyncModal />} />
                            <Route path="ddb-roll-log" element={<DDBRollLogPopover />} />
                        </Routes>
                    </Box>
                </ThemeProvider>
            </BaseOBRProvider>
        );
    }, [isExtension, themeMode]);

    const isRollLog = window.location.pathname.includes("ddb-roll-log");
    if (isRollLog) {
        return <DDBRollLogPopover />;
    }

    return routes;
}
