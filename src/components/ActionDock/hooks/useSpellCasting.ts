import type { Dispatch, SetStateAction } from "react";
import OBR from "@owlbear-rodeo/sdk";
import { getOrdinal, getSpellMetadata } from "../../../assets/spellInfo";
import { setSelectedSpell, toolID, hexChosenAbilityMetadataKey, selectedSpellSlotLevelMetadataKey, selectedSpellDamageTypeMetadataKey } from "../../../effectsTool";
import { doSpell } from "../../../effects/spells";
import { saveCombatState } from "../../../services/combatStateService";
import { cacheDDBCharacter } from "../../../services/ddbService";
import { getSortedTargets, stopAiming } from "../../../effectsTool";
import type { DDBFeatureAction, DDBParsedCharacter } from "../../../types/ddb";
import type { SpellSlotConfig } from "../domain/types";
import { broadcastDDBRoll } from "../../../services/rollLogService";
import type { DDBRollCardData } from "../../../types/ddbRollLog";

interface UseSpellCastingOptions {
    selectedSpell: string | null;
    casterId?: string;
    player?: { role?: string; id?: string };
    character: DDBParsedCharacter | null;
    castLevel: number;
    concentrationSpell: { id: string; name: string } | null;
    selectedHexAbility: string;
    characterFeatures: DDBFeatureAction[];
    spellSlots: Record<number, SpellSlotConfig>;
    pactSlots: SpellSlotConfig;
    setSelected: Dispatch<SetStateAction<string | null>>;
    setUpcastPickerSpellId: Dispatch<SetStateAction<string | null>>;
    setSelectedHexAbility: Dispatch<SetStateAction<string>>;
    setSpellSlots: Dispatch<SetStateAction<Record<number, SpellSlotConfig>>>;
    setPactSlots: Dispatch<SetStateAction<SpellSlotConfig>>;
    setConcentrationSpell: Dispatch<SetStateAction<{ id: string; name: string } | null>>;
}

export function useSpellCasting({
    selectedSpell,
    casterId,
    player,
    character,
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
}: UseSpellCastingOptions) {
    const castSpell = async (spellIdToCast?: string, levelToUse?: number, hexAbility?: string, damageType?: string) => {
        const targetId = spellIdToCast || selectedSpell;
        if (!targetId) {
            OBR.notification.show("Select an attack or spell to cast", "INFO");
            return;
        }

        setSelectedSpell(targetId, casterId);
        setSelected(targetId);
        await OBR.tool.activateTool(toolID);

        if (damageType) {
            await OBR.player.setMetadata({
                [selectedSpellDamageTypeMetadataKey]: { spellId: targetId, damageType },
            });
        }

        const role = player?.role || "PLAYER";
        const playerId = player?.id || "";
        const metadata = getSpellMetadata(targetId);
        const matchedSpell = character?.spells.find(spell => spell.id === targetId || spell.name.toLowerCase() === targetId.toLowerCase());
        if (matchedSpell && !matchedSpell.isPrepared && matchedSpell.level > 0 && matchedSpell.usesSpellSlot !== false) {
            OBR.notification.show(`${matchedSpell.name} is not prepared!`, "WARNING");
            return;
        }

        const baseSpellLevel = matchedSpell ? matchedSpell.level : (metadata?.level ?? 0);
        const targetLevel = levelToUse !== undefined ? levelToUse : (castLevel !== undefined ? castLevel : baseSpellLevel);
        await OBR.player.setMetadata({ [selectedSpellSlotLevelMetadataKey]: { spellId: targetId, slotLevel: targetLevel } });
        const spellDisplayName = metadata?.name || matchedSpell?.name || targetId;
        const upcastMessage = baseSpellLevel > 0 && targetLevel > baseSpellLevel ? ` at ${getOrdinal(targetLevel)} Level` : "";
        const isHexSpell = targetId.toLowerCase() === "hex" || matchedSpell?.name?.toLowerCase() === "hex";
        const isAlreadyHex = concentrationSpell?.id?.toLowerCase() === "hex" || concentrationSpell?.name?.toLowerCase() === "hex";

        if (isHexSpell) {
            const abilityToSave = hexAbility || selectedHexAbility || "dexterity";
            setSelectedHexAbility(abilityToSave);
            try {
                await OBR.player.setMetadata({ [hexChosenAbilityMetadataKey]: abilityToSave });
            } catch {}
            if (character?.id) saveCombatState(character.id, { hexAbility: abilityToSave }).catch(console.error);
        }

        const currentTargets = await getSortedTargets();
        if (currentTargets.length === 0) {
            if (isHexSpell && isAlreadyHex) {
                OBR.notification.show(`Moving Hex (${(hexAbility || selectedHexAbility || "dexterity").toUpperCase()}) curse (Bonus Action, 0 slots consumed): Click target token on map`, "INFO");
            } else if (isHexSpell) {
                OBR.notification.show(`Aiming Hex (${(hexAbility || selectedHexAbility || "dexterity").toUpperCase()})${upcastMessage}: Click target token on map to curse`, "INFO");
            } else {
                OBR.notification.show(`Aiming ${spellDisplayName}${upcastMessage}: Click target token on map to cast`, "INFO");
            }
            return;
        }

        if (baseSpellLevel >= 1 && targetLevel >= 1 && targetLevel <= 9 && !(isHexSpell && isAlreadyHex) && matchedSpell?.usesSpellSlot !== false) {
            const currentSlot = spellSlots[targetLevel];
            if (currentSlot && currentSlot.used < currentSlot.max) {
                setSpellSlots(previous => ({ ...previous, [targetLevel]: { ...previous[targetLevel], used: previous[targetLevel].used + 1 } }));
            } else if (pactSlots.max > 0 && pactSlots.used < pactSlots.max) {
                setPactSlots(previous => ({ ...previous, used: previous.used + 1 }));
            }
        } else if (matchedSpell?.usesSpellSlot === false) {
            const requiresFocus = targetId.toLowerCase() === "darkness" || (matchedSpell.notes?.toLowerCase().includes("focus") ?? false);
            if (requiresFocus && character) {
                const focusFeature = characterFeatures.find(feature => {
                    const name = feature.name.toLowerCase();
                    return (name.includes("focus") || name.includes("ki")) && feature.limitedUse && feature.limitedUse.max > 0;
                });
                if (focusFeature?.limitedUse) {
                    const used = focusFeature.limitedUse.used ?? 0;
                    const max = focusFeature.limitedUse.max ?? 0;
                    if (used >= max) {
                        OBR.notification.show(`No Focus Points remaining to cast ${spellDisplayName}!`, "WARNING");
                        return;
                    }
                    focusFeature.limitedUse.used = used + 1;
                    cacheDDBCharacter(character);
                    OBR.notification.show(`Expended 1 Focus Point to cast ${spellDisplayName}`, "INFO");
                }
            }
        }

        if (matchedSpell?.concentration) {
            const concentrationName = isHexSpell
                ? `Hex (${(hexAbility || selectedHexAbility || "dexterity").toUpperCase()})`
                : matchedSpell.name;
            if (concentrationSpell && concentrationSpell.id !== matchedSpell.id) {
                OBR.notification.show(`Concentration broken on "${concentrationSpell.name}"! Now concentrating on "${concentrationName}".`, "WARNING");
            }
            setConcentrationSpell({ id: matchedSpell.id, name: concentrationName });
        }

        const casterName = character?.name || "Character";
        const spellCard: DDBRollCardData = {
            id: `${Date.now()}-cast-${targetId}`,
            casterName,
            targetName: currentTargets.length > 0 ? "TARGET" : "SELF",
            actionName: spellDisplayName.toUpperCase(),
            actionType: "SPELL",
            dieType: 20,
            diceBreakdown: targetLevel > 0 ? `Level ${targetLevel}` : "Cantrip",
            formula: matchedSpell?.school
                ? `${matchedSpell.school} • ${targetLevel > 0 ? `Level ${targetLevel}` : "Cantrip"}`
                : targetLevel > 0
                  ? `Level ${targetLevel}`
                  : "Cantrip",
            total: "CAST",
            subtitle: matchedSpell?.concentration ? "Concentration Active" : "Spell Cast",
            timestamp: Date.now(),
        };
        broadcastDDBRoll([spellCard]);

        await doSpell(targetId, playerId, role === "GM");
        setSelected(null);
        setUpcastPickerSpellId(null);
        await stopAiming();
    };

    return { castSpell };
}
