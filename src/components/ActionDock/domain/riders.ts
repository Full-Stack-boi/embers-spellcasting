export function parseRiderString(riderStr: string) {
    const [namePart, rest] = riderStr.split(":");
    const name = namePart ? namePart.trim() : "";
    const remaining = rest ? rest.trim() : "";

    const moveMatch = remaining.match(/\((.*?)\)/);
    const moveTrigger = moveMatch ? moveMatch[1] : undefined;

    let immediatePart = remaining;
    let triggerDice: string | undefined = undefined;

    if (remaining.includes(",")) {
        const parts = remaining.split(",");
        immediatePart = parts[0]?.trim() || "";
        triggerDice = parts[1]?.replace(/\(.*?\)/, "").replace(/(?:🌧️|🔥|⚡|❄️|💀)/gu, "").trim();
    } else if (moveTrigger) {
        immediatePart = "";
        triggerDice = remaining.replace(/\(.*?\)/, "").replace(/(?:🌧️|🔥|⚡|❄️|💀)/gu, "").trim();
    }

    const dicePart = immediatePart.replace(/\(.*?\)/, "").replace(/(?:🌧️|🔥|⚡|❄️|💀)/gu, "").trim();

    let damageType = "Thunder";
    let icon = "⚡";
    if (name.includes("Burning") || remaining.includes("🔥")) { damageType = "Fire"; icon = "🔥"; }
    else if (name.includes("Arc") || remaining.includes("⚡")) { damageType = "Lightning"; icon = "⚡"; }
    else if (name.includes("Frigid") || remaining.includes("❄️")) { damageType = "Cold"; icon = "❄️"; }
    else if (name.includes("Vengeful") || remaining.includes("💀")) { damageType = "Necrotic"; icon = "💀"; }
    else if (name.includes("Booming") || remaining.includes("🌧️")) { damageType = "Thunder"; icon = "🌧️"; }

    return {
        name,
        damage: dicePart || "1d8",
        damageType,
        icon,
        moveTrigger,
        triggerDice,
        raw: riderStr
    };
}
