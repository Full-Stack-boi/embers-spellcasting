import React from "react";
import {
    FaBoltLightning,
    FaBookOpen,
    FaBullseye,
    FaCircleInfo,
    FaCrosshairs,
    FaDiamond,
    FaDragon,
    FaFireFlameCurved,
    FaHandFist,
    FaMoon,
    FaMusic,
    FaPersonWalking,
    FaShieldHalved,
    FaSun,
    FaWandMagicSparkles,
    FaYinYang,
    FaDiceD20,
    FaFire,
    FaCheck,
    FaMagnifyingGlass,
    FaXmark,
    FaArrowUpRightFromSquare,
    FaTriangleExclamation,
    FaHeartPulse,
    FaScroll,
    FaClockRotateLeft,
    FaTableList,
    FaGrip,
    FaEye,
    FaDiceD6,
    FaCaretUp,
    FaSquare,
    FaLocationCrosshairs,
    FaUserCheck,
} from "react-icons/fa6";

export const IconFocusCamera: React.FC<IconProps> = ({ size = 14, className }) => <FaLocationCrosshairs size={size} className={className} aria-hidden="true" />;
export const IconUserCheck: React.FC<IconProps> = ({ size = 12, className }) => <FaUserCheck size={size} className={className} aria-hidden="true" />;

type IconProps = { size?: number; className?: string };

export const GemAction: React.FC<{ expended?: boolean }> = ({ expended }) => (
    <FaBoltLightning aria-hidden="true" style={{ opacity: expended ? 0.4 : 1 }} />
);

export const GemBonusAction: React.FC<{ expended?: boolean }> = ({ expended }) => (
    <FaDiamond aria-hidden="true" style={{ opacity: expended ? 0.4 : 1 }} />
);

export const GlyphSorcery: React.FC = () => <FaFireFlameCurved aria-hidden="true" />;
export const GlyphPower: React.FC = () => <FaSun aria-hidden="true" />;
export const IconCastLightning: React.FC<IconProps> = ({ size = 20, className }) => <FaWandMagicSparkles size={size} className={className} aria-hidden="true" />;
export const IconGrimoire: React.FC<IconProps> = ({ size = 20, className }) => <FaBookOpen size={size} className={className} aria-hidden="true" />;
export const IconClearTargets: React.FC<IconProps> = ({ size = 16, className }) => <FaCrosshairs size={size} className={className} aria-hidden="true" />;
export const IconSpellInfo: React.FC<IconProps> = ({ size = 16, className }) => <FaCircleInfo size={size} className={className} aria-hidden="true" />;
export const IconRangedBow: React.FC<IconProps> = ({ size = 16, className }) => <FaBullseye size={size} className={className} aria-hidden="true" />;
export const IconLongRest: React.FC<IconProps> = ({ size = 14, className }) => <FaMoon size={size} className={className} aria-hidden="true" />;
export const IconMeleeSwords: React.FC<IconProps> = ({ size = 16, className }) => <FaHandFist size={size} className={className} aria-hidden="true" />;
export const IconDashMovement: React.FC<IconProps> = ({ size = 16, className }) => <FaPersonWalking size={size} className={className} aria-hidden="true" />;
export const IconDragon: React.FC<IconProps> = ({ size = 14, className }) => <FaDragon size={size} className={className} aria-hidden="true" />;
export const GlyphKi: React.FC = () => <FaYinYang aria-hidden="true" />;
export const GlyphBardic: React.FC = () => <FaMusic aria-hidden="true" />;
export const GlyphDefense: React.FC = () => <FaShieldHalved aria-hidden="true" />;
export const IconDiceD20: React.FC<IconProps> = ({ size = 14, className }) => <FaDiceD20 size={size} className={className} aria-hidden="true" />;
export const IconFire: React.FC<IconProps> = ({ size = 14, className }) => <FaFire size={size} className={className} aria-hidden="true" />;
export const IconCheck: React.FC<IconProps> = ({ size = 12, className }) => <FaCheck size={size} className={className} aria-hidden="true" />;
export const IconSearch: React.FC<IconProps> = ({ size = 13, className }) => <FaMagnifyingGlass size={size} className={className} aria-hidden="true" />;
export const IconClose: React.FC<IconProps> = ({ size = 13, className }) => <FaXmark size={size} className={className} aria-hidden="true" />;
export const IconExternal: React.FC<IconProps> = ({ size = 12, className }) => <FaArrowUpRightFromSquare size={size} className={className} aria-hidden="true" />;
export const IconCondition: React.FC<IconProps> = ({ size = 12, className }) => <FaTriangleExclamation size={size} className={className} aria-hidden="true" />;
export const IconHitDice: React.FC<IconProps> = ({ size = 12, className }) => <FaHeartPulse size={size} className={className} aria-hidden="true" />;
export const IconGameLog: React.FC<IconProps> = ({ size = 13, className }) => <FaScroll size={size} className={className} aria-hidden="true" />;
export const IconHistory: React.FC<IconProps> = ({ size = 12, className }) => <FaClockRotateLeft size={size} className={className} aria-hidden="true" />;
export const IconGrid: React.FC<IconProps> = ({ size = 12, className }) => <FaGrip size={size} className={className} aria-hidden="true" />;
export const IconList: React.FC<IconProps> = ({ size = 12, className }) => <FaTableList size={size} className={className} aria-hidden="true" />;
export const IconEye: React.FC<IconProps> = ({ size = 12, className }) => <FaEye size={size} className={className} aria-hidden="true" />;
export const IconDiceD6: React.FC<IconProps> = ({ size = 14, className }) => <FaDiceD6 size={size} className={className} aria-hidden="true" />;
export const IconCaretUp: React.FC<IconProps> = ({ size = 10, className }) => <FaCaretUp size={size} className={className} aria-hidden="true" />;
export const IconSquarePip: React.FC<IconProps> = ({ size = 8, className }) => <FaSquare size={size} className={className} aria-hidden="true" />;

// D&D Weapon & Skill Icons
import {
    GiDaggerRose,
    GiBroadsword,
    GiPocketBow,
    GiFist,
    GiWizardStaff,
    GiWarAxe,
    GiWarhammer,
    GiSwordsPower,
    GiAcidBlob,
    GiSnowflake1,
    GiFlame,
    GiLightningArc,
    GiSkullCrossedBones,
    GiThirdEye,
    GiSoundWaves,
    GiBiceps,
    GiSprint,
    GiShield,
    GiBrain,
    GiAllSeeingEye,
    GiDramaMasks,
} from "react-icons/gi";

export {
    GiDaggerRose,
    GiBroadsword,
    GiPocketBow,
    GiFist,
    GiWizardStaff,
    GiWarAxe,
    GiWarhammer,
    GiSwordsPower,
    GiAcidBlob,
    GiSnowflake1,
    GiFlame,
    GiLightningArc,
    GiSkullCrossedBones,
    GiThirdEye,
    GiSoundWaves,
};

export const DAMAGE_TYPE_META: Record<string, { label: string; color: string; border: string; bg: string }> = {
    acid: { label: "Acid", color: "#bef264", border: "#65a30d", bg: "#1e2612" },
    cold: { label: "Cold", color: "#7dd3fc", border: "#0284c7", bg: "#0e263d" },
    fire: { label: "Fire", color: "#fdba74", border: "#ea580c", bg: "#38160f" },
    lightning: { label: "Lightning", color: "#93c5fd", border: "#2563eb", bg: "#172554" },
    poison: { label: "Poison", color: "#86efac", border: "#16a34a", bg: "#142918" },
    psychic: { label: "Psychic", color: "#f0abfc", border: "#a21caf", bg: "#34113f" },
    thunder: { label: "Thunder", color: "#d8b4fe", border: "#7e22ce", bg: "#2b144a" },
    radiant: { label: "Radiant", color: "#fde047", border: "#ca8a04", bg: "#332608" },
    necrotic: { label: "Necrotic", color: "#c084fc", border: "#9333ea", bg: "#230f38" },
    force: { label: "Force", color: "#f472b6", border: "#db2777", bg: "#3b1129" },
    bear: { label: "Bear's Endurance", color: "#10b981", border: "#059669", bg: "#064e3b" },
    bull: { label: "Bull's Strength", color: "#ef4444", border: "#dc2626", bg: "#7f1d1d" },
    cat: { label: "Cat's Grace", color: "#38bdf8", border: "#0284c7", bg: "#0c4a6e" },
    eagle: { label: "Eagle's Splendor", color: "#facc15", border: "#ca8a04", bg: "#713f12" },
    fox: { label: "Fox's Cunning", color: "#a855f7", border: "#9333ea", bg: "#581c87" },
    owl: { label: "Owl's Wisdom", color: "#818cf8", border: "#6366f1", bg: "#312e81" },
    enlarge: { label: "Enlarge (+1d4)", color: "#f97316", border: "#ea580c", bg: "#7c2d12" },
    reduce: { label: "Reduce (-1d4)", color: "#64748b", border: "#475569", bg: "#1e293b" },
    blindness: { label: "Blindness", color: "#e11d48", border: "#be123c", bg: "#881337" },
    deafness: { label: "Deafness", color: "#8b5cf6", border: "#7c3aed", bg: "#4c1d95" },
    approach: { label: "Approach", color: "#38bdf8", border: "#0284c7", bg: "#0c4a6e" },
    drop: { label: "Drop", color: "#f59e0b", border: "#d97706", bg: "#78350f" },
    flee: { label: "Flee", color: "#ef4444", border: "#dc2626", bg: "#7f1d1d" },
    grovel: { label: "Grovel", color: "#a855f7", border: "#9333ea", bg: "#581c87" },
    halt: { label: "Halt", color: "#eab308", border: "#ca8a04", bg: "#713f12" },
    explosive_runes: { label: "Explosive Runes", color: "#f97316", border: "#ea580c", bg: "#7c2d12" },
    spell_glyph: { label: "Spell Glyph", color: "#38bdf8", border: "#0284c7", bg: "#0c4a6e" },
};

export function getDamageTypeIcon(type: string, size = 24): React.ReactElement | null {
    switch (type.toLowerCase()) {
        case "acid":
            return <GiAcidBlob size={size} aria-hidden="true" />;
        case "cold":
            return <GiSnowflake1 size={size} aria-hidden="true" />;
        case "fire":
            return <GiFlame size={size} aria-hidden="true" />;
        case "lightning":
            return <GiLightningArc size={size} aria-hidden="true" />;
        case "poison":
            return <GiSkullCrossedBones size={size} aria-hidden="true" />;
        case "psychic":
            return <GiThirdEye size={size} aria-hidden="true" />;
        case "thunder":
            return <GiSoundWaves size={size} aria-hidden="true" />;
        default:
            return null;
    }
}

export function getWeaponIcon(name: string, type?: string, size = 18): React.ReactElement {
    const lower = `${name} ${type || ""}`.toLowerCase();
    if (lower.includes("dagger") || lower.includes("knife") || lower.includes("blade")) {
        return <GiDaggerRose size={size} aria-hidden="true" />;
    }
    if (lower.includes("bow") || lower.includes("crossbow") || lower.includes("sling") || lower.includes("arrow") || lower.includes("ranged")) {
        return <GiPocketBow size={size} aria-hidden="true" />;
    }
    if (lower.includes("axe") || lower.includes("halberd") || lower.includes("glaive")) {
        return <GiWarAxe size={size} aria-hidden="true" />;
    }
    if (lower.includes("hammer") || lower.includes("mace") || lower.includes("club") || lower.includes("flail") || lower.includes("morningstar")) {
        return <GiWarhammer size={size} aria-hidden="true" />;
    }
    if (lower.includes("staff") || lower.includes("rod") || lower.includes("wand")) {
        return <GiWizardStaff size={size} aria-hidden="true" />;
    }
    if (lower.includes("unarmed") || lower.includes("punch") || lower.includes("fist") || lower.includes("kick") || lower.includes("strike")) {
        return <GiFist size={size} aria-hidden="true" />;
    }
    if (lower.includes("sword") || lower.includes("rapier") || lower.includes("scimitar") || lower.includes("greatsword") || lower.includes("longsword") || lower.includes("shortsword")) {
        return <GiBroadsword size={size} aria-hidden="true" />;
    }
    return <GiSwordsPower size={size} aria-hidden="true" />;
}

export type HexAbilityKey = "strength" | "dexterity" | "constitution" | "intelligence" | "wisdom" | "charisma";

export interface HexAbilityInfo {
    key: HexAbilityKey;
    short: "STR" | "DEX" | "CON" | "INT" | "WIS" | "CHA";
    label: string;
    color: string;
    accent: string;
    description: string;
    checks: string;
}

export const HEX_ABILITY_META: Record<HexAbilityKey, HexAbilityInfo> = {
    strength: {
        key: "strength",
        short: "STR",
        label: "Strength",
        color: "#f472b6",
        accent: "#db2777",
        description: "Deal an additional 1~6 Necrotic damage when you attack the target and impart Disadvantage on Strength Checks.",
        checks: "Athletics (shoves, grapples, jumping)"
    },
    dexterity: {
        key: "dexterity",
        short: "DEX",
        label: "Dexterity",
        color: "#38bdf8",
        accent: "#0284c7",
        description: "Deal an additional 1~6 Necrotic damage when you attack the target and impart Disadvantage on Dexterity Checks.",
        checks: "Initiative, Acrobatics, Stealth, Sleight of Hand"
    },
    constitution: {
        key: "constitution",
        short: "CON",
        label: "Constitution",
        color: "#fb923c",
        accent: "#ea580c",
        description: "Deal an additional 1~6 Necrotic damage when you attack the target and impart Disadvantage on Constitution Checks.",
        checks: "Stamina, holding breath, forced marches"
    },
    intelligence: {
        key: "intelligence",
        short: "INT",
        label: "Intelligence",
        color: "#c084fc",
        accent: "#9333ea",
        description: "Deal an additional 1~6 Necrotic damage when you attack the target and impart Disadvantage on Intelligence Checks.",
        checks: "Arcana, History, Investigation, Nature, Religion"
    },
    wisdom: {
        key: "wisdom",
        short: "WIS",
        label: "Wisdom",
        color: "#34d399",
        accent: "#059669",
        description: "Deal an additional 1~6 Necrotic damage when you attack the target and impart Disadvantage on Wisdom Checks.",
        checks: "Perception, Insight, Survival, Medicine, Animal Handling"
    },
    charisma: {
        key: "charisma",
        short: "CHA",
        label: "Charisma",
        color: "#facc15",
        accent: "#ca8a04",
        description: "Deal an additional 1~6 Necrotic damage when you attack the target and impart Disadvantage on Charisma Checks.",
        checks: "Deception, Intimidation, Performance, Persuasion"
    }
};

export const HEX_ABILITIES = Object.values(HEX_ABILITY_META);

export const HexHeartIcon: React.FC<{ size?: number; glowColor?: string; className?: string }> = ({
    size = 28,
    glowColor = "#e879f9",
    className
}) => (
    <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className={className}
        style={{ filter: `drop-shadow(0 0 5px ${glowColor})` }}
        aria-hidden="true"
    >
        <path
            d="M50 88 C20 62 8 45 8 28 A22 22 0 0 1 50 18 A22 22 0 0 1 92 28 C92 45 80 62 50 88 Z"
            fill="rgba(168, 85, 247, 0.22)"
            stroke={glowColor}
            strokeWidth="5"
            strokeLinejoin="round"
        />
        <path
            d="M50 78 C28 56 18 42 18 29 A14 14 0 0 1 50 22 A14 14 0 0 1 82 29 C82 42 72 56 50 78 Z"
            fill="none"
            stroke="rgba(240, 171, 252, 0.45)"
            strokeWidth="2"
            strokeDasharray="4 3"
        />
    </svg>
);

export const HexAbilityIcon: React.FC<{
    ability: HexAbilityKey;
    size?: number;
    showPlus?: boolean;
    className?: string;
}> = ({ ability, size = 32, showPlus = true, className = "" }) => {
    const meta = HEX_ABILITY_META[ability];
    const iconSize = Math.round(size * 0.46);

    const renderInnerIcon = () => {
        switch (ability) {
            case "strength":
                return <GiBiceps size={iconSize} color={meta.color} />;
            case "dexterity":
                return <GiSprint size={iconSize} color={meta.color} />;
            case "constitution":
                return <GiShield size={iconSize} color={meta.color} />;
            case "intelligence":
                return <GiBrain size={iconSize} color={meta.color} />;
            case "wisdom":
                return <GiAllSeeingEye size={iconSize} color={meta.color} />;
            case "charisma":
                return <GiDramaMasks size={iconSize} color={meta.color} />;
        }
    };

    return (
        <div
            className={`ddb-hex-ability-icon-wrapper ${className}`}
            style={{ width: size, height: size, position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
        >
            <HexHeartIcon size={size} glowColor={meta.color} />
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.9))",
                    transform: "translateY(-1px)"
                }}
            >
                {renderInnerIcon()}
            </div>
            {showPlus && (
                <div
                    style={{
                        position: "absolute",
                        top: -2,
                        right: -2,
                        width: 10,
                        height: 10,
                        background: "#0f172a",
                        border: "1px solid #c084fc",
                        borderRadius: 2,
                        color: "#ffffff",
                        fontSize: 9,
                        fontWeight: 900,
                        lineHeight: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.8)"
                    }}
                >
                    +
                </div>
            )}
        </div>
    );
};
