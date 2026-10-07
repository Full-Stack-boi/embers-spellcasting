import React from "react";
import type { SpellFormula, DamageType } from "../../../types/spellFormula";
import { SpellFormulaDisplay } from "./SpellFormulaDisplay";
import type { DetailDrawerItem } from "../domain/types";

type SpellDrawerItem = Extract<NonNullable<DetailDrawerItem>, { type: "spell" }>;

interface SpellDetailContentProps {
    item: SpellDrawerItem;
    formula?: SpellFormula;
    characterLevel: number;
    selectedDamageType?: DamageType;
    onSelectDamageType: (damageType: DamageType) => void;
}

export const SpellDetailContent: React.FC<SpellDetailContentProps> = ({
    item,
    formula,
    characterLevel,
    selectedDamageType,
    onSelectDamageType,
}) => (
    <div className="ddb-drawer-spell-content">
        {formula ? (
            <SpellFormulaDisplay
                formula={formula}
                charLevel={characterLevel}
                selectedDamageType={selectedDamageType}
                onSelectDamageType={onSelectDamageType}
            />
        ) : (
            <>
                <p className="ddb-drawer-para"><strong>Components:</strong> {item.spell.notes || "V, S"}</p>
                <p className="ddb-drawer-para"><strong>Duration:</strong> {item.spell.rawDdbSpell?.duration || "Instantaneous"}</p>
            </>
        )}
        {item.spell.rawDdbSpell?.description ? (
            <div className="ddb-drawer-spell-desc" style={{ marginTop: "8px" }}><p>{item.spell.rawDdbSpell.description}</p></div>
        ) : (
            <div className="ddb-drawer-spell-desc"><p>Select this spell to aim and cast on the battlefield.</p></div>
        )}
    </div>
);
