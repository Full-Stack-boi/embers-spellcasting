import { describe, expect, it } from "vitest";
import { ALL_MANUAL_FORMULAS } from "../index";
import * as fs from "fs";
import * as path from "path";

interface ScrapedSpell {
  id: string;
  name: string;
  ddbId: number;
  source: string;
  stats: {
    Level?: string;
    "Casting Time"?: string;
    "Range/Area"?: string;
    Components?: string;
    Duration?: string;
    School?: string;
    "Attack/Save"?: string;
    "Damage/Effect"?: string;
  };
  upcast?: string | null;
  descSnippet?: string;
}

const scratchPath = path.resolve(__dirname, "../../../../scratch/all_337_scraped_ddb.json");
const scrapedData: ScrapedSpell[] = fs.existsSync(scratchPath)
  ? JSON.parse(fs.readFileSync(scratchPath, "utf8"))
  : [];

function parseDdbLevel(levelStr?: string): number {
  if (!levelStr) return 0;
  if (/cantrip/i.test(levelStr)) return 0;
  const m = levelStr.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : 0;
}

describe.skipIf(!scrapedData.length)("Verify 337 D&D Beyond Scraped Spells Against Catalog Formulas", () => {
  it("has exactly 337 scraped spells", () => {
    expect(scrapedData.length).toBe(337);
  });

  it("ensures all 337 spells in catalog now have exact Player's Handbook page citations", () => {
    for (const scraped of scrapedData) {
      const record = ALL_MANUAL_FORMULAS[scraped.id];
      expect(record, scraped.id).toBeDefined();
      if (record && (record.kind === "spell" || record.kind === "cantrip")) {
        expect(record.formula.category.source, scraped.id).toMatch(/Player's Handbook \(2024\), pg\. \d+/);
      }
    }
  });

  const discrepancies: Array<{ id: string; name: string; field: string; expected: any; actual: any }> = [];

  for (const scraped of scrapedData) {
    const record = ALL_MANUAL_FORMULAS[scraped.id];

    if (!record) {
      discrepancies.push({
        id: scraped.id,
        name: scraped.name,
        field: "missing_in_catalog",
        expected: "Formula exists",
        actual: "Not found",
      });
      continue;
    }

    const formula = record.kind === "spell" || record.kind === "cantrip" ? record.formula : null;
    if (!formula) continue;

    // 1. Level check
    const expectedLevel = parseDdbLevel(scraped.stats.Level);
    if (formula.category.level !== expectedLevel) {
      discrepancies.push({
        id: scraped.id,
        name: scraped.name,
        field: "level",
        expected: expectedLevel,
        actual: formula.category.level,
      });
    }

    // 2. School check
    const expectedSchool = scraped.stats.School?.toLowerCase().trim();
    if (expectedSchool && formula.category.school.toLowerCase().trim() !== expectedSchool) {
      discrepancies.push({
        id: scraped.id,
        name: scraped.name,
        field: "school",
        expected: expectedSchool,
        actual: formula.category.school,
      });
    }

    // 3. Concentration check
    const expectedConcentration = /concentration/i.test(scraped.stats.Duration || "");
    if (formula.category.concentration !== expectedConcentration) {
      discrepancies.push({
        id: scraped.id,
        name: scraped.name,
        field: "concentration",
        expected: expectedConcentration,
        actual: formula.category.concentration,
      });
    }

    // 4. Casting Time check
    const expectedTime = scraped.stats["Casting Time"]?.toLowerCase().trim();
    if (expectedTime) {
      const actualTime = formula.casting.time.toLowerCase().trim();
      const match =
        (expectedTime.includes("action") && actualTime.includes("action") && !expectedTime.includes("bonus") && !actualTime.includes("bonus")) ||
        (expectedTime.includes("bonus action") && actualTime.includes("bonus action")) ||
        (expectedTime.includes("reaction") && actualTime.includes("reaction")) ||
        (expectedTime.includes("minute") && actualTime.includes("minute")) ||
        (expectedTime.includes("hour") && actualTime.includes("hour"));
      const isSpecialKnown = scraped.id === "plant_growth" && expectedTime.includes("special") && actualTime.includes("1 action or 8 hours");
      if (!isSpecialKnown && !match && !actualTime.includes(expectedTime) && !expectedTime.includes(actualTime)) {
        discrepancies.push({
          id: scraped.id,
          name: scraped.name,
          field: "castingTime",
          expected: expectedTime,
          actual: actualTime,
        });
      }
    }
  }

  it("checks for any major mechanical discrepancies between DDB and catalog", () => {
    if (discrepancies.length > 0) {
      console.warn("Discrepancies found:", discrepancies);
    }
    expect(discrepancies).toEqual([]);
  });
});
