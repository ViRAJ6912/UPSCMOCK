"use client";

import { useParams } from "next/navigation";
import TestPage from "@/src/components/TestPage";

const subjectMap: Record<string, { title: string }> = {
  "comprehension": { title: "Reading Comprehension" },
  "logical-reasoning": { title: "Logical Reasoning" },
  "analytical-reasoning": { title: "Analytical Reasoning" },
  "quantitative": { title: "Quantitative Aptitude" },
  "data-interpretation": { title: "Data Interpretation" },
  "mental-ability": { title: "Mental Ability" },
};

import comprehension from "@/src/data/csat-comprehension.json";
import logicalReasoning from "@/src/data/csat-logical-reasoning.json";
import analyticalReasoning from "@/src/data/csat-analytical-reasoning.json";
import quantitative from "@/src/data/csat-quantitative.json";
import dataInterpretation from "@/src/data/csat-data-interpretation.json";
import mentalAbility from "@/src/data/csat-mental-ability.json";

const dataMap: Record<string, typeof comprehension> = {
  "comprehension": comprehension,
  "logical-reasoning": logicalReasoning,
  "analytical-reasoning": analyticalReasoning,
  "quantitative": quantitative,
  "data-interpretation": dataInterpretation,
  "mental-ability": mentalAbility,
};

export default function CSATSubjectTest() {
  const params = useParams();
  const slug = params.subject as string;
  const subject = subjectMap[slug];
  const questions = dataMap[slug];

  if (!subject || !questions) return <div className="flex min-h-screen items-center justify-center text-zinc-500">Subject not found.</div>;

  return <TestPage title={subject.title} paper={`csat-${slug}`} questions={questions} totalTime={3600} />;
}
