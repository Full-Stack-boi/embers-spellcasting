export interface ResourceBadge {
    label: string;
    theme: string;
}

export function getResourceBadge(name: string, source?: string): ResourceBadge {
    const lower = name.toLowerCase();
    if (lower.includes("focus") || lower.includes("ki")) return { label: "KI", theme: "ki" };
    if (lower.includes("sorcery point") || lower.includes("font of magic")) return { label: "SORC", theme: "sorcery" };
    if (lower.includes("rage")) return { label: "RAGE", theme: "rage" };
    if (lower.includes("bardic inspiration")) return { label: "BARDIC", theme: "bard" };
    if (lower.includes("wild shape")) return { label: "WILD", theme: "druid" };
    if (lower.includes("channel divinity")) return { label: "DIVINE", theme: "divine" };
    if (lower.includes("action surge")) return { label: "SURGE", theme: "fighter" };
    if (lower.includes("second wind")) return { label: "WIND", theme: "fighter" };
    if (lower.includes("innate sorcery")) return { label: "INNATE", theme: "sorcery" };
    if (lower.includes("uncanny metabolism")) return { label: "METAB", theme: "ki" };
    if (lower.includes("magical cunning")) return { label: "CUNNING", theme: "warlock" };
    if (lower.includes("lay on hands")) return { label: "HANDS", theme: "divine" };
    if (lower.includes("luck")) return { label: "LUCK", theme: "luck" };
    if (lower.includes("channeled attack") || lower.includes("channeled")) return { label: "CHANNEL", theme: "channeled" };
    if (lower.includes("fey step")) return { label: "FEY", theme: "druid" };
    if (lower.includes("breath weapon")) return { label: "BREATH", theme: "rage" };
    if (lower.includes("healing hands")) return { label: "HEAL", theme: "divine" };
    if (lower.includes("inspiring leader")) return { label: "LEADER", theme: "bard" };

    const theme = source === "feat" ? "feat" : source === "race" ? "druid" : "generic";
    const label = name.replace(/[^a-zA-Z0-9\s]/g, "").trim().split(/\s+/)[0].slice(0, 7).toUpperCase();
    return { label: label || "RES", theme };
}
