"use client";

import { useParams } from "next/navigation";
import TestPage from "@/src/components/TestPage";

const subjectMap: Record<string, { title: string; file: string }> = {
  "ancient-history": { title: "Ancient History", file: "gs-ancient-history" },
  "medieval-history": { title: "Medieval History", file: "gs-medieval-history" },
  "modern-history": { title: "Modern History", file: "gs-modern-history" },
  "art-culture": { title: "Art & Culture", file: "gs-art-culture" },
  "polity": { title: "Polity & Governance", file: "gs-polity" },
  "economy": { title: "Economy", file: "gs-economy" },
  "geography": { title: "Geography", file: "gs-geography" },
  "environment": { title: "Environment & Ecology", file: "gs-environment" },
  "science": { title: "Science & Technology", file: "gs-science" },
  "international-relations": { title: "International Relations", file: "gs-international-relations" },
  "current-affairs": { title: "Current Affairs", file: "gs-current-affairs" },
};

// Static imports for all JSON files
import ancientHistory from "@/src/data/gs-ancient-history.json";
import medievalHistory from "@/src/data/gs-medieval-history.json";
import modernHistory from "@/src/data/gs-modern-history.json";
import artCulture from "@/src/data/gs-art-culture.json";
import polity from "@/src/data/gs-polity.json";
import economy from "@/src/data/gs-economy.json";
import geography from "@/src/data/gs-geography.json";
import environment from "@/src/data/gs-environment.json";
import science from "@/src/data/gs-science.json";
import internationalRelations from "@/src/data/gs-international-relations.json";
import currentAffairs from "@/src/data/gs-current-affairs.json";

const dataMap: Record<string, typeof ancientHistory> = {
  "ancient-history": ancientHistory,
  "medieval-history": medievalHistory,
  "modern-history": modernHistory,
  "art-culture": artCulture,
  "polity": polity,
  "economy": economy,
  "geography": geography,
  "environment": environment,
  "science": science,
  "international-relations": internationalRelations,
  "current-affairs": currentAffairs,
};

export default function GSSubjectTest() {
  const params = useParams();
  const slug = params.subject as string;
  const subject = subjectMap[slug];
  const questions = dataMap[slug];

  if (!subject || !questions) return <div className="flex min-h-screen items-center justify-center text-zinc-500">Subject not found.</div>;

  return <TestPage title={subject.title} paper={`gs-${slug}`} questions={questions} totalTime={3600} />;
}
