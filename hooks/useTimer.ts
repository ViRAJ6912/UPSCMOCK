"use client";

import { useEffect, useRef, useState } from "react";

export interface UseTimerOptions {
  initialSec: number;
  onExpire?: () => void;
  /** Called every tick (after state update). Use for autosave. */
  onTick?: (remaining: number) => void;
  paused?: boolean;
}

export function useTimer({ initialSec, onExpire, onTick, paused = false }: UseTimerOptions) {
  const [remaining, setRemaining] = useState<number>(initialSec);
  const expiredRef = useRef(false);
  const onTickRef = useRef(onTick);
  const onExpireRef = useRef(onExpire);

  // Always invoke the latest callbacks without re-creating the interval.
  useEffect(() => { onTickRef.current = onTick; }, [onTick]);
  useEffect(() => { onExpireRef.current = onExpire; }, [onExpire]);

  // Sync if the parent rehydrates from storage with a different initial value.
  useEffect(() => {
    setRemaining(initialSec);
    expiredRef.current = initialSec <= 0;
  }, [initialSec]);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 0) return 0;
        const next = prev - 1;
        onTickRef.current?.(next);
        if (next <= 0 && !expiredRef.current) {
          expiredRef.current = true;
          // Defer to avoid setState during render of a sibling.
          setTimeout(() => onExpireRef.current?.(), 0);
        }
        return next;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [paused]);

  return { remaining, setRemaining };
}
