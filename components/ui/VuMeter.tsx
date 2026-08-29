type VuMeterProps = {
  label: string;
  value: number;
  max?: number;
  segments?: number;
};

export function VuMeter({ label, value, max = 10, segments = 10 }: VuMeterProps) {
  const filled = Math.round((Math.max(0, Math.min(max, value)) / max) * segments);

  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="text-[11px] font-medium uppercase tracking-wide text-mist">{label}</span>
        <span className="text-sm font-semibold tabular-nums">{value.toFixed(0)}/{max}</span>
      </div>
      <div className="flex gap-1" role="meter" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max} aria-label={label}>
        {Array.from({ length: segments }).map((_, i) => (
          <span
            key={i}
            className={`h-2 flex-1 rounded-sm ${i < filled ? "bg-signal" : "bg-mist/20"}`}
          />
        ))}
      </div>
    </div>
  );
}
