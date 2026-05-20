"use client";

import { AnimatePresence, motion } from "framer-motion";

interface Props {
  open: boolean;
  attempted: number;
  total: number;
  onCancel: () => void;
  onConfirm: () => void;
  busy?: boolean;
  /** Display "Time up" variant */
  forced?: boolean;
}

export function SubmitModal({ open, attempted, total, onCancel, onConfirm, busy, forced }: Props) {
  const remaining = total - attempted;
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={busy ? undefined : onCancel}
        >
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 10, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="bg-surface rounded-2xl shadow-card max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-serif text-xl text-ink mb-2">
              {forced ? "Time Up — Auto Submit" : "Submit Test?"}
            </h3>
            <p className="text-sm text-ink-soft leading-relaxed mb-4">
              {forced
                ? "Your time has expired. The test will be submitted now."
                : "Once submitted, you cannot change your answers."}
            </p>
            <div className="grid grid-cols-3 gap-2 mb-5">
              <Box label="Total" value={total} />
              <Box label="Attempted" value={attempted} tone="ok" />
              <Box label="Skipped" value={remaining} tone="warn" />
            </div>
            <div className="flex justify-end gap-2">
              {!forced && (
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={busy}
                  className="px-4 py-2 text-sm font-medium rounded-lg border border-black/10 text-ink-soft hover:bg-paper transition disabled:opacity-50"
                >
                  Continue Test
                </button>
              )}
              <button
                type="button"
                onClick={onConfirm}
                disabled={busy}
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-accent text-white hover:bg-accent-dark transition disabled:opacity-50"
              >
                {busy ? "Submitting…" : "Submit Test"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Box({ label, value, tone = "neutral" }: { label: string; value: number; tone?: "neutral" | "ok" | "warn" }) {
  const cls =
    tone === "ok" ? "bg-ok/10 text-ok"
      : tone === "warn" ? "bg-warn/10 text-warn"
      : "bg-paper text-ink";
  return (
    <div className={`rounded-lg p-2 text-center ${cls}`}>
      <div className="font-serif text-xl font-bold">{value}</div>
      <div className="text-[10px] uppercase tracking-wider opacity-80">{label}</div>
    </div>
  );
}
