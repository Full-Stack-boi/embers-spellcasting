import { ALL_CANTRIP_OVERRIDES } from "./cantrips";
import { ALL_LEVELED_SPELL_OVERRIDES } from "./spells";
import { ALL_MANUAL_ACTION_FORMULAS } from "./classes";
import type { DDBParsedSpell } from "../../types/ddb";
import { getRulesEditionForSourcebook } from "./sourcebooks";
import { vsspp2SpellOverrides } from "./sourcebook-vsspp2";
import directoryData from "./ddb-55e-directory.json";

export interface Ddb55eSpellDirectoryEntry {
  id: string;
  ddbId: number;
  name: string;
  level: number;
  school: string;
  concentration: boolean;
  ritual: boolean;
  legacyBadge: false;
}

interface Ddb55eSpellDirectory {
  metadata: {
    source: string;
    sourceUrl: string;
    selectedFilters: string[];
    pagesReviewed: number;
    resultCount: number;
    legacyBadgeExcluded: boolean;
    checkedAt: string;
  };
  spells: Ddb55eSpellDirectoryEntry[];
}

/** Persisted 5.5e directory snapshot, independent from manual mechanics. */
export const DDB_55E_SPELL_DIRECTORY = (directoryData as Ddb55eSpellDirectory)
  .spells;

const spellOverrides = {
  ...ALL_CANTRIP_OVERRIDES,
  ...ALL_LEVELED_SPELL_OVERRIDES,
  ...vsspp2SpellOverrides,
};

export type FormulaCoverageStatus = "in-progress" | "not-started";

export type Ddb55eCatalogPhaseStatus =
  | "complete"
  | "in-progress"
  | "not-started";

/** Source-discovery checkpoint; this does not claim that spell mechanics are implemented. */
export const DDB_55E_DIRECTORY_PROGRESS = {
  ...(directoryData as Ddb55eSpellDirectory).metadata,
  directoryEntries: DDB_55E_SPELL_DIRECTORY.length,
  catalogStatus: "complete" as Ddb55eCatalogPhaseStatus,
  mechanicsReviewStatus: "in-progress" as Ddb55eCatalogPhaseStatus,
  playtestStatus: "not-started" as Ddb55eCatalogPhaseStatus,
  note: "The directory snapshot is persisted spell by spell. Formula review and playtesting are tracked separately.",
} as const;

const ddb55eFormulaCounts = DDB_55E_SPELL_DIRECTORY.reduce(
  (counts, spell) => {
    const formula = spellOverrides[spell.id];
    if (!formula) counts.notStarted += 1;
    else if (
      formula.implementation?.sourceStatus === "checked" &&
      formula.implementation.playtestStatus === "passed"
    )
      counts.verified += 1;
    else counts.needsReview += 1;
    return counts;
  },
  { verified: 0, needsReview: 0, notStarted: 0 },
);

export const DDB_55E_MECHANICS_PROGRESS = {
  total: DDB_55E_SPELL_DIRECTORY.length,
  verified: ddb55eFormulaCounts.verified,
  needsReview: ddb55eFormulaCounts.needsReview,
  notStarted: ddb55eFormulaCounts.notStarted,
  status:
    ddb55eFormulaCounts.notStarted === 0 &&
    ddb55eFormulaCounts.needsReview === 0
      ? ("complete" as Ddb55eCatalogPhaseStatus)
      : ddb55eFormulaCounts.verified > 0 || ddb55eFormulaCounts.needsReview > 0
        ? ("in-progress" as Ddb55eCatalogPhaseStatus)
        : ("not-started" as Ddb55eCatalogPhaseStatus),
  note: "Formula counts use exact directory IDs. A matching formula is needs-review until its rules and behavior have been verified; directory metadata alone does not count.",
} as const;

export interface SpellManualCoverageEntry {
  id: string;
  name: string;
  level: number;
  sourceBook: string;
  rulesEdition: DDBParsedSpell["rulesEdition"];
  status: "not-started" | "needs-review" | "verified";
}

/** Creates a review queue from spells currently exposed by DDB sync or imported data. */
export function getSpellManualCoverage(
  spells: DDBParsedSpell[],
): SpellManualCoverageEntry[] {
  const seen = new Set<string>();

  return spells.flatMap((spell) => {
    const id =
      spell.id ||
      spell.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");
    if (seen.has(id)) return [];
    seen.add(id);

    const formula =
      spellOverrides[id] ??
      spellOverrides[
        spell.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "_")
          .replace(/^_+|_+$/g, "")
      ];
    return [
      {
        id,
        name: spell.name,
        level: spell.level,
        sourceBook:
          spell.sourceBook ?? formula?.category.source ?? "Unknown sourcebook",
        rulesEdition:
          spell.rulesEdition && spell.rulesEdition !== "unknown"
            ? spell.rulesEdition
            : getRulesEditionForSourcebook(
                spell.sourceBook ?? formula?.category.source,
              ),
        status: !formula
          ? ("not-started" as const)
          : formula.implementation?.sourceStatus === "checked" &&
              formula.implementation.playtestStatus === "passed"
            ? ("verified" as const)
            : ("needs-review" as const),
      },
    ];
  });
}

/** Per-spell queue for the complete persisted DDB 5.5e directory snapshot. */
export function getDdb55eDirectoryCoverage(): Array<
  SpellManualCoverageEntry & {
    ddbId: number;
    school: string;
    concentration: boolean;
    ritual: boolean;
    formulaStatus: "not-started" | "needs-review" | "verified";
    playtestStatus: "not-tested" | "passed" | "failed";
  }
> {
  return DDB_55E_SPELL_DIRECTORY.map((spell) => {
    const formula = spellOverrides[spell.id];
    return {
      id: spell.id,
      name: spell.name,
      level: spell.level,
      sourceBook: "D&D Beyond 5.5E Core Rules / Expanded Rules directory",
      rulesEdition: "2024",
      status: !formula
        ? "not-started"
        : formula.implementation?.sourceStatus === "checked" &&
            formula.implementation.playtestStatus === "passed"
          ? "verified"
          : "needs-review",
      ddbId: spell.ddbId,
      school: spell.school,
      concentration: spell.concentration,
      ritual: spell.ritual,
      formulaStatus: !formula
        ? "not-started"
        : formula.implementation?.sourceStatus === "checked" &&
            formula.implementation.playtestStatus === "passed"
          ? "verified"
          : "needs-review",
      playtestStatus: formula?.implementation?.playtestStatus ?? "not-tested",
    };
  });
}

export const MANUAL_FORMULA_COVERAGE = {
  cantrips: {
    status: "in-progress" as FormulaCoverageStatus,
    count: Object.values(spellOverrides).filter(
      (formula) => formula.category.spellType === "cantrip",
    ).length,
    note: "Selected overrides only. Use getSpellManualCoverage() to find unscribed spells from current DDB sync/imports.",
  },
  spells: {
    status: "in-progress" as FormulaCoverageStatus,
    count: Object.values(spellOverrides).filter(
      (formula) => formula.category.spellType === "spell",
    ).length,
    note: "Selected overrides only. The active DDB character does not expose every spell in owned sourcebooks.",
  },
  actions: {
    status: "not-started" as FormulaCoverageStatus,
    count: Object.values(ALL_MANUAL_ACTION_FORMULAS).filter(
      (formula) => formula.kind === "action",
    ).length,
    note: "Add manual action interpretations when DDB data is insufficient.",
  },
  classFeatures: {
    status: "in-progress" as FormulaCoverageStatus,
    count: Object.values(ALL_MANUAL_ACTION_FORMULAS).filter(
      (formula) => formula.kind === "class_feature",
    ).length,
    note: "Class-specific formulas live under classes/<class-name>/.",
  },
} as const;
