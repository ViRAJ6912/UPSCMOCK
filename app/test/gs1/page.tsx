"use client";

import TestPage from "@/src/components/TestPage";
import questions from "@/src/data/gs1.json";

export default function GS1Test() {
  return <TestPage title="GS Paper I" paper="gs1" questions={questions} totalTime={7200} />;
}
