"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function TrendChart({ data }: { data: { label: string; score: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
        <CartesianGrid stroke="#9C918633" vertical={false} />
        <XAxis dataKey="label" tick={{ fontFamily: "var(--font-mono)", fontSize: 11, fill: "#9C9186" }} axisLine={false} tickLine={false} />
        <YAxis domain={[0, 10]} tick={{ fontFamily: "var(--font-mono)", fontSize: 11, fill: "#9C9186" }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ fontFamily: "var(--font-mono)", fontSize: 12, background: "#211C17", border: "1px solid #9C918633", color: "#F3ECDD" }}
        />
        <Line type="monotone" dataKey="score" stroke="#E8432B" strokeWidth={2} dot={{ r: 3, fill: "#CFA038" }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
