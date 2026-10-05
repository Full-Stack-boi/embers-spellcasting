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
        <Box sx={{ px: 2, pt: 1.5, pb: 0.5, flexShrink: 0 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => openActionDock()}
            sx={{
              background: "linear-gradient(180deg, #d97706 0%, #b45309 100%)",
              color: "#ffffff",
              fontWeight: 700,
              fontSize: "0.85rem",
              border: "1px solid #fde047",
              boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
              "&:hover": {
                background: "linear-gradient(180deg, #f59e0b 0%, #d97706 100%)",
                borderColor: "#fef08a",
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
            flexShrink: 0,
            "& .MuiTabs-flexContainer": {
              justifyContent: "space-between",
              px: 2,
            },
            pt: 1,
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
                sx={{
                  minWidth: "2rem",
                  minHeight: 0,
                  p: 1.5,
                }}
              />
            );
          })}
        </Tabs>
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            p: 0.75,
            pb: 4,
            overflowX: "hidden",
            overflowY: "auto",
            scrollbarWidth: "thin", // For Firefox
            "&::-webkit-scrollbar": {
              width: "6px", // For Chrome, Safari, and Opera
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
