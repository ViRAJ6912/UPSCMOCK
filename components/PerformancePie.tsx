"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface Props {
  correct: number;
  wrong: number;
  skipped: number;
}

export function PerformancePie({ correct, wrong, skipped }: Props) {
  const data = [
    { name: "Correct", value: correct, color: "#16a34a" },
    { name: "Wrong", value: wrong, color: "#dc2626" },
    { name: "Unattempted", value: skipped, color: "#94a3b8" },
  ];
  const total = correct + wrong + skipped;
  return (
    <div className="relative w-full h-[220px]">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
            stroke="none"
          >
            {data.map((d) => (
              <Cell key={d.name} fill={d.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ borderRadius: 8, border: "1px solid rgba(0,0,0,0.08)", fontSize: 12 }}
            formatter={(value: number, name: string) => [`${value}`, name]}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="font-serif text-2xl text-ink font-bold">{total}</div>
        <div className="text-[10px] uppercase tracking-wider text-ink-mute">Questions</div>
      </div>
    </div>
  );
}
