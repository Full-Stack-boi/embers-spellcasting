export type DndRulesEdition = "2014" | "2024" | "unknown";
export type DndBeyondSourceCategory =
  | "5.5E Core Rules"
  | "5.5E Expanded Rules"
  | "Mage Hand Press"
  | "Grim Hollow";
export type SpellCatalogDecision =
  | "include-2024"
  | "exclude-legacy"
  | "exclude-non-2024"
  | "needs-edition-review";

export interface DndSpellSourcebook {
  id: string;
  title: string;
  publisher: string;
  rulesEdition: Exclude<DndRulesEdition, "unknown">;
  ddbCategory: DndBeyondSourceCategory;
  verificationSource: string;
}

/**
 * Verified book-level mappings for D&D Beyond's source filters.
 * Add partnered books individually: one publisher category can contain books
 * published for different rules editions.
 */
export const DND_SPELL_SOURCEBOOKS: DndSpellSourcebook[] = [
  {
    id: "grim-hollow-players-guide",
    title: "Grim Hollow: Player’s Guide",
    publisher: "Ghostfire Gaming",
    rulesEdition: "2024",
    ddbCategory: "Grim Hollow",
    verificationSource: "D&D Beyond partner release, Ghostfire Gaming",
  },
  {
    id: "valdas-spire-of-secrets-player-pack-2",
    title: "Valda's Spire of Secrets: Player Pack 2",
    publisher: "Mage Hand Press",
    rulesEdition: "2024",
    ddbCategory: "Mage Hand Press",
    verificationSource: "D&D Beyond partner release schedule, Q3 2026",
  },
  {
    id: "forgotten-realms-heroes-of-faerun",
    title: "Forgotten Realms: Heroes of Faerûn",
    publisher: "Wizards of the Coast",
    rulesEdition: "2024",
    ddbCategory: "5.5E Expanded Rules",
    verificationSource: "D&D Beyond 5.5E Expanded Rules directory",
  },
  {
    id: "arcana-unleashed",
    title: "Arcana Unleashed",
    publisher: "Partner Content",
    rulesEdition: "2024",
    ddbCategory: "5.5E Expanded Rules",
    verificationSource: "D&D Beyond 5.5E Expanded Rules directory",
  },
  {
    id: "eberron-forge-of-the-artificer",
    title: "Eberron: Forge of the Artificer",
    publisher: "Wizards of the Coast",
    rulesEdition: "2024",
    ddbCategory: "5.5E Expanded Rules",
    verificationSource: "D&D Beyond 5.5E Expanded Rules directory",
  },
];

function normalizeSourcebookTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function getRulesEditionForSourcebook(
  sourceBook?: string,
): DndRulesEdition {
  if (!sourceBook) return "unknown";

  const normalizedTitle = normalizeSourcebookTitle(sourceBook);
  const knownBook = DND_SPELL_SOURCEBOOKS.find((book) =>
    normalizedTitle.includes(normalizeSourcebookTitle(book.title)),
  );
  if (knownBook) return knownBook.rulesEdition;
  if (/\b(2014|legacy)\b/.test(normalizedTitle)) return "2014";
  if (/\b(2024|5 5e|5 2)\b/.test(normalizedTitle)) return "2024";
  return "unknown";
}

/** Keeps Legacy directory entries out and refuses to infer an edition from a publisher category. */
export function classifySpellCatalogEntry(input: {
  legacyBadge: boolean;
  rulesEdition: DndRulesEdition;
}): SpellCatalogDecision {
  if (input.legacyBadge) return "exclude-legacy";
  if (input.rulesEdition === "2024") return "include-2024";
  if (input.rulesEdition === "2014") return "exclude-non-2024";
  return "needs-edition-review";
}
