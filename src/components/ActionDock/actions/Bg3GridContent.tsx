import type { ReactNode } from "react";
import type { DDBFeatureAction, DDBWeaponAttack } from "../../../types/ddb";
import type { ActionsFilter, DockSpell, MainTab, SpellsFilter } from "../domain/types";
import { IconSearch } from "../shared/Bg3Icons";

interface CombatAction {
    name: string;
    description: string;
}

interface Bg3GridContentProps {
    mainTab: MainTab;
    actionsFilter: ActionsFilter;
    spellsFilter: SpellsFilter;
    spellSearch: string;
    actionSearch: string;
    pactMagicLevel?: number;
    weapons: DDBWeaponAttack[];
    attackSpells: DockSpell[];
    actionSpells: DockSpell[];
    actionFeatures: DDBFeatureAction[];
    bonusActionSpells: DockSpell[];
    bonusActionFeatures: DDBFeatureAction[];
    reactionSpells: DockSpell[];
    reactionFeatures: DDBFeatureAction[];
    otherFeatures?: DDBFeatureAction[];
    combatActions: CombatAction[];
    spells: DockSpell[];
    renderWeaponCard: (weapon: DDBWeaponAttack, index: number) => ReactNode;
    renderSpellCard: (spell: DockSpell, index: number) => ReactNode;
    renderFeatureCard: (feature: DDBFeatureAction, index: number) => ReactNode;
    renderCombatActionCard: (action: CombatAction, index: number) => ReactNode;
}

export function Bg3GridContent({
    mainTab,
    actionsFilter,
    spellsFilter,
    spellSearch,
    actionSearch,
    pactMagicLevel,
    weapons,
    attackSpells,
    actionSpells,
    actionFeatures,
    bonusActionSpells,
    bonusActionFeatures,
    reactionSpells,
    reactionFeatures,
    otherFeatures,
    combatActions,
    spells,
    renderWeaponCard,
    renderSpellCard,
    renderFeatureCard,
    renderCombatActionCard,
}: Bg3GridContentProps) {
    if (mainTab === "ACTIONS") {
        const sections: Array<{ title: string; items: ReactNode[] }> = [];
        let cardIndex = 0;
        const displayedNames = new Set<string>();

        const addUnique = (items: ReactNode[], key: string, render: () => ReactNode) => {
            const normalizedKey = key.toLowerCase().trim();
            if (displayedNames.has(normalizedKey)) return;
            displayedNames.add(normalizedKey);
            items.push(render());
        };

        const addSection = (title: string, addItems: (items: ReactNode[]) => void) => {
            const items: ReactNode[] = [];
            addItems(items);
            if (items.length > 0) sections.push({ title, items });
        };

        if (actionsFilter === "ALL" || actionsFilter === "ATTACK") {
            addSection("Attacks & Weapons", items => {
                weapons.forEach(weapon => addUnique(items, `weapon:${weapon.id || weapon.name}`, () => renderWeaponCard(weapon, cardIndex++)));
                attackSpells.forEach(spell => addUnique(items, `spell:${spell.name}`, () => renderSpellCard(spell, cardIndex++)));
            });
        }
        if (actionsFilter === "ALL" || actionsFilter === "ACTION") {
            addSection("Actions", items => {
                actionSpells.forEach(spell => addUnique(items, `spell:${spell.name}`, () => renderSpellCard(spell, cardIndex++)));
                actionFeatures.forEach(feature => addUnique(items, `feat:${feature.name}`, () => renderFeatureCard(feature, cardIndex++)));
            });
        }
        if (actionsFilter === "ALL" || actionsFilter === "BONUS ACTION") {
            addSection("Bonus Actions", items => {
                bonusActionSpells.forEach(spell => addUnique(items, `spell:${spell.name}`, () => renderSpellCard(spell, cardIndex++)));
                bonusActionFeatures.forEach(feature => addUnique(items, `feat:${feature.name}`, () => renderFeatureCard(feature, cardIndex++)));
            });
        }
        if (actionsFilter === "ALL" || actionsFilter === "REACTION") {
            addSection("Reactions", items => {
                reactionSpells.forEach(spell => addUnique(items, `spell:${spell.name}`, () => renderSpellCard(spell, cardIndex++)));
                reactionFeatures.forEach(feature => addUnique(items, `feat:${feature.name}`, () => renderFeatureCard(feature, cardIndex++)));
            });
        }
        if (actionsFilter === "ALL" || actionsFilter === "OTHER") {
            addSection("Other", items => {
                otherFeatures?.forEach(feature => addUnique(items, `feat:${feature.name}`, () => renderFeatureCard(feature, cardIndex++)));
                combatActions.forEach(action => addUnique(items, `act:${action.name}`, () => renderCombatActionCard(action, cardIndex++)));
            });
        }

        if (sections.length === 0) {
            return <div className="ddb-empty-search-state">
                <IconSearch size={22} className="ddb-empty-search-icon" />
                <span className="ddb-empty-search-text">No actions matching your filter</span>
            </div>;
        }

        return <div className="ddb-bg3-grid-sections">
            {sections.map(section => (
                <section className="ddb-bg3-grid-section" key={section.title} aria-label={section.title}>
                    <h3 className="ddb-bg3-grid-section-title">{section.title}</h3>
                    <div className="ddb-bg3-grid-container">{section.items}</div>
                </section>
            ))}
        </div>;
    }

    if (mainTab === "SPELLS") {
        const seenSpellNames = new Set<string>();
        const activeSearch = (spellSearch || actionSearch).trim().toLowerCase();
        const spellsToShow = spells.filter(spell => {
            if (spellsFilter === "0" && spell.level !== 0) return false;
            if (spellsFilter === "1" && spell.level !== 1) return false;
            if (spellsFilter === "2" && spell.level !== 2) return false;
            if (spellsFilter === "3+" && spell.level < 3) return false;
            if (spellsFilter === "PACT" && (!pactMagicLevel || spell.level !== pactMagicLevel)) return false;
            if (activeSearch && !spell.name.toLowerCase().includes(activeSearch) && !spell.damageType?.toLowerCase().includes(activeSearch)) return false;

            const nameKey = spell.name.toLowerCase().trim();
            if (seenSpellNames.has(nameKey)) return false;
            seenSpellNames.add(nameKey);
            return true;
        });

        if (spellsToShow.length === 0) {
            return <div className="ddb-empty-search-state">
                <IconSearch size={22} className="ddb-empty-search-icon" />
                <span className="ddb-empty-search-text">No spells matching your filter</span>
            </div>;
        }

        const spellLevels = [...new Set(spellsToShow.map(spell => spell.level))].sort((a, b) => a - b);
        let shortcut = 0;
        return <div className="ddb-bg3-grid-sections">
            {spellLevels.map(level => (
                <section className="ddb-bg3-grid-section" key={level} aria-label={level === 0 ? "Cantrips" : `Level ${level} spells`}>
                    <h3 className="ddb-bg3-grid-section-title">{level === 0 ? "Cantrips" : `Level ${level}`}</h3>
                    <div className="ddb-bg3-grid-container">
                        {spellsToShow.filter(spell => spell.level === level).map(spell => renderSpellCard(spell, shortcut++))}
                    </div>
                </section>
            ))}
        </div>;
    }

    return null;
}
