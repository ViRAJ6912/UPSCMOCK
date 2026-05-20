"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { OptionKey, PaperMeta, Question, TestProgress } from "@/types";
import { clearProgress, loadProgress, saveProgress } from "@/lib/storage";

export interface UseTestStateArgs {
  paper: PaperMeta;
  questions: Question[];
}

export interface QuestionStatusFlags {
  answered: boolean;
  marked: boolean;
  visited: boolean;
}

export function useTestState({ paper, questions }: UseTestStateArgs) {
  const [hydrated, setHydrated] = useState(false);
  const [answers, setAnswers] = useState<Array<OptionKey | null>>(() =>
    Array(questions.length).fill(null),
  );
  const [marked, setMarked] = useState<boolean[]>(() => Array(questions.length).fill(false));
  const [visited, setVisited] = useState<boolean[]>(() => Array(questions.length).fill(false));
  const [currentIdx, setCurrentIdx] = useState(0);
  const [startedAt, setStartedAt] = useState<number>(() => Date.now());
  const [initialRemaining, setInitialRemaining] = useState<number>(paper.durationSec);
  const remainingRef = useRef<number>(paper.durationSec);

  // Hydrate from localStorage once on mount.
  useEffect(() => {
    const saved = loadProgress(paper.id);
    const now = Date.now();
    if (
      saved &&
      saved.paperId === paper.id &&
      Array.isArray(saved.answers) &&
      saved.answers.length === questions.length
    ) {
      setAnswers(saved.answers);
      setMarked(saved.marked.length === questions.length ? saved.marked : Array(questions.length).fill(false));
      setVisited(saved.visited.length === questions.length ? saved.visited : Array(questions.length).fill(false));
      setCurrentIdx(Math.min(Math.max(0, saved.currentIdx ?? 0), questions.length - 1));
      setStartedAt(saved.startedAt ?? now);
      const elapsedSinceSave = Math.max(0, Math.floor((now - (saved.lastSavedAt ?? now)) / 1000));
      const adjusted = Math.max(0, (saved.remainingSec ?? paper.durationSec) - elapsedSinceSave);
      setInitialRemaining(adjusted);
      remainingRef.current = adjusted;
    } else {
      setStartedAt(now);
      setInitialRemaining(paper.durationSec);
      remainingRef.current = paper.durationSec;
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paper.id, questions.length]);

  // Mark current question as visited whenever the index changes.
  useEffect(() => {
    setVisited((v) => {
      if (v[currentIdx]) return v;
      const next = [...v];
      next[currentIdx] = true;
      return next;
    });
  }, [currentIdx]);

  const persist = useCallback(
    (remainingSec: number) => {
      remainingRef.current = remainingSec;
      const progress: TestProgress = {
        paperId: paper.id,
        answers,
        marked,
        visited,
        currentIdx,
        startedAt,
        remainingSec,
        lastSavedAt: Date.now(),
      };
      saveProgress(paper.id, progress);
    },
    [paper.id, answers, marked, visited, currentIdx, startedAt],
  );

  const selectAnswer = useCallback((idx: number, key: OptionKey | null) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[idx] = key;
      return next;
    });
  }, []);

  const toggleMark = useCallback((idx: number) => {
    setMarked((prev) => {
      const next = [...prev];
      next[idx] = !next[idx];
      return next;
    });
  }, []);

  const goTo = useCallback((idx: number) => {
    setCurrentIdx((curr) => {
      const clamped = Math.max(0, Math.min(questions.length - 1, idx));
      return clamped === curr ? curr : clamped;
    });
  }, [questions.length]);

  const next = useCallback(() => {
    setCurrentIdx((i) => Math.min(questions.length - 1, i + 1));
  }, [questions.length]);

  const prev = useCallback(() => {
    setCurrentIdx((i) => Math.max(0, i - 1));
  }, []);

  // Save on any change to the test state (debounced via microtask coalescing).
  useEffect(() => {
    if (!hydrated) return;
    persist(remainingRef.current);
  }, [hydrated, answers, marked, visited, currentIdx, persist]);

  const stats = useMemo(() => {
    let answered = 0, markedOnly = 0, markedAnswered = 0, skipped = 0, unseen = 0;
    for (let i = 0; i < questions.length; i++) {
      const hasAns = answers[i] != null;
      if (marked[i] && hasAns) markedAnswered++;
      else if (marked[i]) markedOnly++;
      else if (hasAns) answered++;
      else if (visited[i]) skipped++;
      else unseen++;
    }
    return {
      answered,
      markedOnly,
      markedAnswered,
      skipped,
      unseen,
      attempted: answered + markedAnswered,
      remaining: questions.length - (answered + markedAnswered),
    };
  }, [questions.length, answers, marked, visited]);

  const finalize = useCallback(() => {
    clearProgress(paper.id);
  }, [paper.id]);

  return {
    hydrated,
    answers,
    marked,
    visited,
    currentIdx,
    initialRemaining,
    stats,
    selectAnswer,
    toggleMark,
    goTo,
    next,
    prev,
    persist,
    finalize,
  };
}
