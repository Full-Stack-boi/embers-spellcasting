import type { Dispatch, SetStateAction } from "react";
import OBR from "@owlbear-rodeo/sdk";
import { cacheDDBCharacter } from "../../../services/ddbService";
import type { DDBInventoryItem, DDBParsedCharacter } from "../../../types/ddb";
import type { DetailDrawerItem } from "../domain/types";

interface UseInventoryAttunementOptions {
    character: DDBParsedCharacter | null;
    setCharacter: Dispatch<SetStateAction<DDBParsedCharacter | null>>;
    drawerItem: DetailDrawerItem;
    setDrawerItem: Dispatch<SetStateAction<DetailDrawerItem>>;
}

export function useInventoryAttunement({ character, setCharacter, drawerItem, setDrawerItem }: UseInventoryAttunementOptions) {
    const toggleAttunement = (item: DDBInventoryItem) => {
        if (!character) return;
        const currentAttuned = character.inventory?.filter(inventoryItem => inventoryItem.isAttuned).length ?? 0;
        const willAttune = !item.isAttuned;

        if (willAttune && currentAttuned >= 3) {
            OBR.notification.show("Cannot attune: 3 of 3 attunement slots are already in use!", "WARNING");
            return;
        }

        const updatedInventory = (character.inventory || []).map(inventoryItem =>
            inventoryItem.id === item.id ? { ...inventoryItem, isAttuned: willAttune } : inventoryItem
        );
        const newAttunedCount = updatedInventory.filter(inventoryItem => inventoryItem.isAttuned).length;
        const updatedCharacter: DDBParsedCharacter = {
            ...character,
            inventory: updatedInventory,
            attunement: { current: newAttunedCount, max: 3 },
        };

        setCharacter(updatedCharacter);
        cacheDDBCharacter(updatedCharacter);

        if (drawerItem?.type === "item" && drawerItem.item.id === item.id) {
            setDrawerItem({ ...drawerItem, item: { ...drawerItem.item, isAttuned: willAttune } });
        }

        OBR.notification.show(
            willAttune
                ? `${item.name} is now Attuned (${newAttunedCount}/3 slots)`
                : `${item.name} is now Unattuned (${newAttunedCount}/3 slots)`,
            "INFO"
        );
    };

    return { toggleAttunement };
}
