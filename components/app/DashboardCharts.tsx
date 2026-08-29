"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function TrendChart({ data }: { data: { label: string; score: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
        <CartesianGrid stroke="#94A3B833" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
        <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{
            fontSize: 12,
            background: "#121A2B",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8,
            color: "#F4F7FB",
          }}
        />
        <Line type="monotone" dataKey="score" stroke="#22D3EE" strokeWidth={2} dot={{ r: 3, fill: "#22D3EE" }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
