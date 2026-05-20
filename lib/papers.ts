import "server-only";
import fs from "node:fs";
import path from "node:path";
import type { PaperMeta, PaperData, Question } from "@/types";

/**
 * Static manifest of every paper this platform supports. To add a new paper
 * later (e.g. gs2, csat3), drop a `data/<id>.json` file into the repo and
 * (if not already listed below) extend this manifest. Papers whose JSON
 * file is missing are filtered out automatically.
 */
export const PAPER_DEFS: Record<string, PaperMeta> = {
  gs1: {
    id: "gs1", code: "GS1", name: "GS Paper 1", type: "gs",
    total: 100, marks: 200, perCorrect: 2, perWrong: -0.66,
    durationSec: 7200, difficulty: "Mixed",
    description: "General Studies covering History, Polity, Economy, Geography, Environment, S&T, IR.",
    file: "gs1.json",
  },
  gs2: {
    id: "gs2", code: "GS2", name: "GS Paper 2", type: "gs",
    total: 100, marks: 200, perCorrect: 2, perWrong: -0.66,
    durationSec: 7200, difficulty: "Mixed",
    description: "General Studies covering History, Polity, Economy, Geography, Environment, S&T, IR.",
    file: "gs2.json",
  },
  gs3: {
    id: "gs3", code: "GS3", name: "GS Paper 3", type: "gs",
    total: 100, marks: 200, perCorrect: 2, perWrong: -0.66,
    durationSec: 7200, difficulty: "Mixed",
    description: "General Studies covering History, Polity, Economy, Geography, Environment, S&T, IR.",
    file: "gs3.json",
  },
  gs4: {
    id: "gs4", code: "GS4", name: "GS Paper 4", type: "gs",
    total: 100, marks: 200, perCorrect: 2, perWrong: -0.66,
    durationSec: 7200, difficulty: "Mixed",
    description: "General Studies covering History, Polity, Economy, Geography, Environment, S&T, IR.",
    file: "gs4.json",
  },
  gs5: {
    id: "gs5", code: "GS5", name: "GS Paper 5", type: "gs",
    total: 100, marks: 200, perCorrect: 2, perWrong: -0.66,
    durationSec: 7200, difficulty: "Mixed",
    description: "General Studies covering History, Polity, Economy, Geography, Environment, S&T, IR.",
    file: "gs5.json",
  },
  csat1: {
    id: "csat1", code: "CSAT1", name: "CSAT Paper 1", type: "csat",
    total: 80, marks: 200, perCorrect: 2.5, perWrong: -0.83,
    durationSec: 7200, qualifying: 66, difficulty: "Mixed",
    description: "Aptitude paper: Reading Comprehension, Reasoning, Quant, DI. Qualifying at 33% (66 marks).",
    file: "csat1.json",
  },
  csat2: {
    id: "csat2", code: "CSAT2", name: "CSAT Paper 2", type: "csat",
    total: 80, marks: 200, perCorrect: 2.5, perWrong: -0.83,
    durationSec: 7200, qualifying: 66, difficulty: "Mixed",
    description: "Aptitude paper: Reading Comprehension, Reasoning, Quant, DI. Qualifying at 33% (66 marks).",
    file: "csat2.json",
  },
  csat3: {
    id: "csat3", code: "CSAT3", name: "CSAT Paper 3", type: "csat",
    total: 80, marks: 200, perCorrect: 2.5, perWrong: -0.83,
    durationSec: 7200, qualifying: 66, difficulty: "Mixed",
    description: "Aptitude paper: Reading Comprehension, Reasoning, Quant, DI. Qualifying at 33% (66 marks).",
    file: "csat3.json",
  },
  csat4: {
    id: "csat4", code: "CSAT4", name: "CSAT Paper 4", type: "csat",
    total: 80, marks: 200, perCorrect: 2.5, perWrong: -0.83,
    durationSec: 7200, qualifying: 66, difficulty: "Mixed",
    description: "Aptitude paper: Reading Comprehension, Reasoning, Quant, DI. Qualifying at 33% (66 marks).",
    file: "csat4.json",
  },
  csat5: {
    id: "csat5", code: "CSAT5", name: "CSAT Paper 5", type: "csat",
    total: 80, marks: 200, perCorrect: 2.5, perWrong: -0.83,
    durationSec: 7200, qualifying: 66, difficulty: "Mixed",
    description: "Aptitude paper: Reading Comprehension, Reasoning, Quant, DI. Qualifying at 33% (66 marks).",
    file: "csat5.json",
  },
};

const DATA_DIR = path.join(process.cwd(), "data");

function paperFileExists(file: string): boolean {
  try {
    return fs.existsSync(path.join(DATA_DIR, file));
  } catch {
    return false;
  }
}

/** All paper metas whose data file is present on disk. */
export function getAvailablePapers(): PaperMeta[] {
  return Object.values(PAPER_DEFS).filter((p) => paperFileExists(p.file));
}

export function getPapersByType(type: "gs" | "csat"): PaperMeta[] {
  return getAvailablePapers().filter((p) => p.type === type);
}

export function getPaperMeta(id: string): PaperMeta | null {
  return PAPER_DEFS[id] ?? null;
}

export async function loadPaper(id: string): Promise<PaperData | null> {
  const meta = PAPER_DEFS[id];
  if (!meta) return null;
  const filePath = path.join(DATA_DIR, meta.file);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  const questions = JSON.parse(raw) as Question[];
  return { meta, questions };
}
