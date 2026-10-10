import "./Main.css";

import { Box, Button, Tab, Tabs } from "@mui/material";
import {
  FaDisplay,
  FaGear,
  FaHatWizard,
  FaPlus,
  FaDiceD20,
} from "react-icons/fa6";
import OBR from "@owlbear-rodeo/sdk";
import { toolID } from "../effectsTool";
import { useEffect, useState } from "react";
import { openActionDock } from "../components/ActionDock/ActionDock";

import CustomSpells from "../components/CustomSpells";
import MovementHandler from "../components/MovementHandler";
import SceneControls from "../components/SceneControls";
import Settings from "../components/Settings";
import SpellDetails from "../components/SpellDetails";
import CharacterChecks from "../components/CharacterChecks/CharacterChecks";
import { useOBR } from "../platform/obr/react/providers";

const MENU_OPTIONS = [
  {
    label: "Checks",
    icon: <FaDiceD20 className="tab-icon" />,
    component: <CharacterChecks />,
    role: "PLAYER",
  },
  {
    label: "Current Spell",
    icon: <FaHatWizard className="tab-icon" />,
    component: <SpellDetails />,
    role: "PLAYER",
  },
  {
    label: "Custom Spells",
    icon: <FaPlus className="tab-icon" />,
    component: <CustomSpells />,
    role: "GM",
  },
  {
    label: "Scene",
    icon: <FaDisplay className="tab-icon" />,
    component: <SceneControls />,
    role: "PLAYER",
  },
  {
    label: "Settings",
    icon: <FaGear className="tab-icon" />,
    component: <Settings />,
    role: "PLAYER",
  },
];

const SPELL_DETAIL_TAB = 1;

export default function Main() {
  const obr = useOBR();
  // const [toolSelected, setToolSelected] = useState(false);
  const [previouslySelectedTab, setPreviouslySelectedTab] = useState(0);
  const [selectedTab, setSelectedTab] = useState(0);

  const [isGM, setIsGM] = useState(false);

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
    if (!obr.ready) {
      return;
    }

    return OBR.tool.onToolChange((tool) => {
      const selectedOurTool = tool === toolID;
      // setToolSelected(selectedOurTool);
      setPreviouslySelectedTab(selectedTab);
      setSelectedTab(
        selectedOurTool ? SPELL_DETAIL_TAB : previouslySelectedTab,
      );
    });
  }, [obr.ready, selectedTab, previouslySelectedTab]);

  return (
    <Box
      sx={{
        height: "100vh",
        maxHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        boxSizing: "border-box",
        bgcolor: "#0d1117",
        color: "#e5e7eb",
        colorScheme: "dark",
        fontFamily: 'Roboto, "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            bgcolor: "#111622",
            borderBottom: "1px solid #1e2638",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.4)",
            flexShrink: 0,
          }}
        >
          <Box sx={{ px: 2, pt: 1.5, pb: 0.75 }}>
            <Button
              variant="contained"
              fullWidth
              onClick={() => openActionDock()}
              sx={{
                background: "linear-gradient(180deg, #c82d38 0%, #991b1b 100%)",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "0.85rem",
                border: "1px solid #f87171",
                boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
                "&:hover": {
                  background: "linear-gradient(180deg, #e11d48 0%, #c82d38 100%)",
                  borderColor: "#fca5a5",
                  boxShadow: "0 0 12px rgba(225, 29, 72, 0.4)",
                },
              }}
            >
              Action Bar (B)
            </Button>
          </Box>

          <Tabs
            value={selectedTab}
            sx={{
              width: "100%",
              minHeight: "42px",
              "& .MuiTabs-flexContainer": {
                justifyContent: "space-between",
                px: 1.5,
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "#e11d48",
                height: 2.5,
                borderRadius: "2px 2px 0 0",
              },
              "& .MuiTab-root": {
                color: "#94a3b8",
                minWidth: "2.5rem",
                minHeight: "40px",
                p: 1,
                fontSize: "0.95rem",
                transition: "all 0.15s ease",
                "&:hover": {
                  color: "#f1f5f9",
                  bgcolor: "rgba(255, 255, 255, 0.04)",
                },
                "&.Mui-selected": {
                  color: "#f43f5e",
                },
              },
            }}
            onChange={(_, value) => setSelectedTab(value)}
          >
            {MENU_OPTIONS.map((option, index) => {
              if (option.role == "GM" && !isGM) return;
              return (
                <Tab
                  key={index + "-option"}
                  value={index}
                  icon={option.icon}
                  iconPosition="start"
                />
              );
            })}
          </Tabs>
        </Box>

        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            p: 1,
            pb: 3,
            bgcolor: "#0d1117",
            overflowX: "hidden",
            overflowY: "auto",
            scrollbarWidth: "thin",
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#2a3241",
              borderRadius: "3px",
            },
            "&::-webkit-scrollbar-track": {
              background: "#0d1117",
            },
            "&::-webkit-scrollbar-button": {
              display: "none",
              width: 0,
              height: 0,
            },
          }}
        >
          {MENU_OPTIONS[selectedTab].component}
        </Box>
      </Box>

      <MovementHandler />
    </Box>
  );
}
