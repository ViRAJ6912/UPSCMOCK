import { cn } from "@/lib/cn";

interface Props {
  tone: "ok" | "bad" | "info" | "neutral";
  children: React.ReactNode;
}

export function StatusPill({ tone, children }: Props) {
  const palette = {
    ok: "bg-ok/10 text-ok",
    bad: "bg-bad/10 text-bad",
    info: "bg-info/10 text-info",
    neutral: "bg-ink/5 text-ink-soft",
  } as const;
  return (
    <span className={cn("inline-block px-3 py-1 rounded-full text-xs font-semibold", palette[tone])}>
      {children}
    </span>
  );
}
