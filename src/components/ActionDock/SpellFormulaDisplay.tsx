/**
 * SpellFormulaDisplay
 *
 * Renders structured spell formula data inside the ActionDock drawer panel.
 * V1: Display only. V2 will add inline roll buttons.
 */

import type { SpellFormula, SpellMechanic, CantripScaleTier, DamageType } from "../../types/spellFormula";

// ─── School Badge Colors ───────────────────────────────────────────────────────

const SCHOOL_COLORS: Record<string, string> = {
    abjuration:    "#7b9fd4",
    conjuration:   "#b19cd9",
    divination:    "#f0c44a",
    enchantment:   "#f48fb1",
    evocation:     "#ef7c56",
    illusion:      "#80cbc4",
    necromancy:    "#90a4ae",
    transmutation: "#81c784",
    any:           "#aaaaaa",
};

// ─── Damage Type Display ───────────────────────────────────────────────────────

const DAMAGE_TYPE_LABELS: Record<string, string> = {
    acid: "Acid", bludgeoning: "Bludgeoning", cold: "Cold",
    fire: "Fire", force: "Force", lightning: "Lightning",
    necrotic: "Necrotic", piercing: "Piercing", poison: "Poison",
    psychic: "Psychic", radiant: "Radiant", slashing: "Slashing",
    thunder: "Thunder", weapon: "Weapon Type", choice: "Your Choice",
    healing: "Healing",
};

// ─── Sub-components ────────────────────────────────────────────────────────────

function CategoryBadge({ formula }: { formula: SpellFormula }) {
    const { school, spellType, level } = formula.category;
    const color = SCHOOL_COLORS[school] ?? "#aaa";
    const schoolLabel = school.charAt(0).toUpperCase() + school.slice(1);
    const typeLabel = spellType === "cantrip"
        ? "Cantrip"
        : `Level ${level} Spell`;

    return (
        <div className="sfd-category-row">
            <span className="sfd-school-badge" style={{ borderColor: color, color }}>
                {schoolLabel}
            </span>
            <span className="sfd-type-label">{typeLabel}</span>
            {formula.category.concentration && (
                <span className="sfd-tag conc">Concentration</span>
            )}
            {formula.category.ritual && (
                <span className="sfd-tag ritual">Ritual</span>
            )}
            {formula.isManualOverride && (
                <span className="sfd-tag verified" title="Formula verified by hand">
                    Verified
                </span>
            )}
        </div>
    );
}

function CastingRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="sfd-cast-row">
            <span className="sfd-cast-label">{label}</span>
            <span className="sfd-cast-value">{value}</span>
        </div>
    );
}

function InteractionRow({ formula }: { formula: SpellFormula }) {
    if (!formula.interaction) return null;
    const { type, saveAbility, useSpellcastingMod } = formula.interaction;

    const typeLabels: Record<string, string> = {
        spell_attack:       "Ranged Spell Attack",
        melee_spell_attack: "Melee Spell Attack",
        save:               saveAbility ? `${saveAbility} Saving Throw` : "Saving Throw",
        utility:            "Utility (No Roll)",
        weapon_based:       formula.interaction.weaponAttack?.rangedSpellAttack
            ? `Melee Weapon Attack / Ranged Spell Attack (${formula.interaction.weaponAttack.rangedSpellAttack.rangeFeet} ft.)`
            : "Melee Weapon Attack",
    };

    return (
        <div className="sfd-row">
            <span className="sfd-row-label">Attack / Save</span>
            <span className="sfd-row-value">
                {typeLabels[type] ?? type}
                {useSpellcastingMod && (
                    <span className="sfd-mod-note"> · Uses Spell Mod</span>
                )}
            </span>
        </div>
    );
}

function DamageRow({
    formula,
    charLevel,
    selectedDamageType,
    onSelectDamageType
}: {
    formula: SpellFormula;
    charLevel: number;
    selectedDamageType?: DamageType;
    onSelectDamageType?: (type: DamageType) => void;
}) {
    const baseIndex = formula.damage.findIndex(damage => damage.isBase);
    const base = formula.damage[baseIndex];
    if (!base) return null;

    // Additive cantrip scaling is a separate damage component, not a replacement
    // for the base weapon or spell damage.
    const scaleTiers = formula.cantripScale
        ? [...formula.cantripScale.tiers].sort((a, b) => b.minLevel - a.minLevel)
        : [];
    const tier = scaleTiers.find((entry: CantripScaleTier) => charLevel >= entry.minLevel);
    const additiveScale = formula.cantripScale?.scaleMode === "add_dice";
    const extraDice = additiveScale && tier && !/^0d\d+$/.test(tier.totalDice)
        ? tier.totalDice
        : undefined;

    const damageRows = formula.damage.map((damage, index) => {
        if (tier?.damageDice?.[index]) return tier.damageDice[index];
        if (damage.isBase && !additiveScale && tier) return tier.totalDice;
        return damage.dice;
    });

    const isChoice = base.type === "choice" && base.typeChoices && base.typeChoices.length > 0;
    const currentActiveType = selectedDamageType ?? (isChoice ? base.typeChoices![0] : base.type);

    return (
        <div className="sfd-row sfd-damage-row">
            <span className="sfd-row-label">Damage</span>
            <div className="sfd-damage-content">
                {formula.damage.map((damage, index) => {
                    const damageType = damage.isBase && isChoice ? currentActiveType : damage.type;
                    const typeLabel = DAMAGE_TYPE_LABELS[damageType] ?? damageType;
                    return (
                        <div key={`${damage.dice}-${index}`} className="sfd-damage-entry">
                            <div className="sfd-damage-block">
                                <span className="sfd-dice">{damageRows[index]}</span>
                                <span className="sfd-damage-type">{typeLabel}</span>
                            </div>
                            {damage.condition && (
                                <span className="sfd-damage-condition">{damage.condition}</span>
                            )}
                        </div>
                    );
                })}
                {extraDice && formula.cantripScale?.extraDamageType && (
                    <div className="sfd-damage-entry">
                        <div className="sfd-damage-block">
                            <span className="sfd-dice">{extraDice}</span>
                            <span className="sfd-damage-type">
                                {DAMAGE_TYPE_LABELS[formula.cantripScale.extraDamageType] ?? formula.cantripScale.extraDamageType}
                            </span>
                        </div>
                        <span className="sfd-damage-condition">Cantrip scaling</span>
                    </div>
                )}
                {isChoice && onSelectDamageType && (
                    <div className="sfd-choice-picker">
                        <span className="sfd-choice-picker-label">Select Damage Type:</span>
                        <div className="sfd-choice-chips">
                            {base.typeChoices!.map(choice => {
                                const isSelected = currentActiveType === choice;
                                return (
                                    <button
                                        key={choice}
                                        type="button"
                                        className={`sfd-choice-chip ${isSelected ? "selected" : ""}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onSelectDamageType(choice);
                                        }}
                                    >
                                        {choice.toUpperCase()}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function CantripScaleRow({ formula, charLevel }: { formula: SpellFormula; charLevel: number }) {
    if (!formula.cantripScale) return null;
    const { tiers, scaleMode, extraDamageType } = formula.cantripScale;

    const tierStrings = tiers.map((t: CantripScaleTier) => {
        const active = charLevel >= t.minLevel;
        return (
            <span key={t.minLevel} className={`sfd-scale-tier ${active ? "active" : "dim"}`}>
                <span className="sfd-scale-lv">Lv.{t.minLevel}</span>
                <span className="sfd-scale-dice">{t.totalDice}</span>
            </span>
        );
    });

    const modeNote = scaleMode === "add_dice" && extraDamageType
        ? ` + extra ${DAMAGE_TYPE_LABELS[extraDamageType] ?? extraDamageType}`
        : "";

    return (
        <div className="sfd-row sfd-scale-row">
            <span className="sfd-row-label">Scales at{modeNote}</span>
            <div className="sfd-scale-tiers">{tierStrings}</div>
        </div>
    );
}

function UpcastRow({ formula }: { formula: SpellFormula }) {
    if (!formula.upcasting?.notes) return null;
    return (
        <div className="sfd-row">
            <span className="sfd-row-label">Upcast</span>
            <span className="sfd-row-value sfd-upcast-notes">{formula.upcasting.notes}</span>
        </div>
    );
}

function ImplementationStatus({ formula }: { formula: SpellFormula }) {
    const status = formula.implementation;
    if (!status) return null;
    const runtimeLabel = status.runtimeStatus === "assisted" ? "ROLL ASSISTED" : "MANUAL RESOLUTION";
    const playtestLabel = status.playtestStatus === "not-tested" ? "NOT PLAYTESTED" : status.playtestStatus.toUpperCase();
    return (
        <section className={`sfd-implementation sfd-implementation-${status.runtimeStatus}`} aria-label="Implementation status">
            <div className="sfd-implementation-heading">
                <strong>{runtimeLabel}</strong>
                <span>{status.sourceStatus === "checked" ? "SOURCE CHECKED" : "SOURCE UNCHECKED"}</span>
                <span>{playtestLabel}</span>
            </div>
            <ul>
                {status.manualSteps.map((step, index) => <li key={`${formula.id}-manual-${index}`}>{step}</li>)}
            </ul>
        </section>
    );
}

function MechanicsRow({ mechanics }: { mechanics: SpellMechanic[] }) {
    if (!mechanics.length) return null;

    return (
        <>
            {mechanics.map((m, i) => {
                let label = "";
                let desc = "";

                switch (m.kind) {
                    case "exploding":
                        label = "Exploding Dice";
                        desc = `Roll ${m.triggerValue} → add ${m.addDice} (max: ${
                            m.maxExtra === "spellcastingMod" ? "Spell Mod" : m.maxExtra
                        } extra dice)`;
                        break;
                    case "exploding_any_die":
                        label = "Exploding Dice";
                        desc = `Each maximum damage die adds another die of that size (max: ${m.maxExtra === "spellcastingMod" ? "Spell Mod" : m.maxExtra} extra dice)`;
                        break;
                    case "weapon_step_upgrade":
                        label = "Weapon Step";
                        desc = `Weapon die steps up ${m.steps} tier${m.steps > 1 ? "s" : ""} (d4→d6→d8→d10→d12)`;
                        break;
                    case "rider":
                        label = "Conditional";
                        desc = `${m.dice} ${DAMAGE_TYPE_LABELS[m.type] ?? m.type} ${m.condition}`;
                        break;
                    case "concentration_dot":
                        label = "DoT";
                        desc = `${m.dice} ${DAMAGE_TYPE_LABELS[m.type] ?? m.type} per turn`;
                        break;
                }

                return (
                    <div key={i} className="sfd-row sfd-mechanic-row">
                        <span className="sfd-row-label">
                            <span className="sfd-mechanic-tag">{label}</span>
                        </span>
                        <span className="sfd-row-value sfd-mechanic-desc">{desc}</span>
                    </div>
                );
            })}
        </>
    );
}

function ClassesRow({ classes, source }: { classes: string[]; source?: string }) {
    if (!classes.length && !source) return null;
    return (
        <div className="sfd-row sfd-meta-row">
            {classes.length > 0 && (
                <span className="sfd-cast-value">
                    {classes.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(", ")}
                </span>
            )}
            {source && (
                <span className="sfd-source">{source}</span>
            )}
        </div>
    );
}

// ─── Main Component ────────────────────────────────────────────────────────────

interface SpellFormulaDisplayProps {
    formula: SpellFormula;
    charLevel: number;
    selectedDamageType?: DamageType;
    onSelectDamageType?: (type: DamageType) => void;
}

export function SpellFormulaDisplay({
    formula,
    charLevel,
    selectedDamageType,
    onSelectDamageType
}: SpellFormulaDisplayProps) {
    return (
        <div className="sfd-root">
            {/* Category: School badge + spell type */}
            <CategoryBadge formula={formula} />

            <div className="sfd-divider" />

            {/* Casting parameters */}
            <div className="sfd-cast-block">
                <CastingRow label="Casting Time" value={formula.casting.time} />
                <CastingRow label="Range"        value={formula.casting.range} />
                <CastingRow label="Duration"     value={formula.casting.duration} />
                <CastingRow label="Components"   value={formula.casting.components} />
            </div>

            <div className="sfd-divider" />

            {/* Attack / Save */}
            <InteractionRow formula={formula} />

            {/* Damage at current level */}
            <DamageRow
                formula={formula}
                charLevel={charLevel}
                selectedDamageType={selectedDamageType}
                onSelectDamageType={onSelectDamageType}
            />

            {/* Cantrip tiers */}
            <CantripScaleRow formula={formula} charLevel={charLevel} />

            {/* Upcast notes */}
            <UpcastRow formula={formula} />

            {/* Special mechanics */}
            {formula.mechanics && formula.mechanics.length > 0 && (
                <>
                    <div className="sfd-divider" />
                    <MechanicsRow mechanics={formula.mechanics} />
                </>
            )}

            {/* Notes */}
            {formula.notes && (
                <p className="sfd-notes">{formula.notes}</p>
            )}

            {formula.effectNotes?.map((note, index) => (
                <p className="sfd-notes" key={`${formula.id}-effect-${index}`}>{note}</p>
            ))}

            <ImplementationStatus formula={formula} />

            {/* Source / classes */}
            <div className="sfd-divider" />
            <ClassesRow classes={formula.category.classes} source={formula.category.source} />

            
        </div>
    );
}
