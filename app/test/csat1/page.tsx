"use client";

import TestPage from "@/src/components/TestPage";
import questions from "@/src/data/csat1.json";

export default function CSAT1Test() {
  return <TestPage title="CSAT Paper II" paper="csat1" questions={questions} totalTime={7200} />;
}
