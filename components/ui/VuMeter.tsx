type VuMeterProps = {
  label: string;
  value: number; // 0-10
  max?: number;
  segments?: number;
};

export function VuMeter({ label, value, max = 10, segments = 10 }: VuMeterProps) {
  const filled = Math.round((Math.max(0, Math.min(max, value)) / max) * segments);

  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="font-mono text-[11px] uppercase tracking-widest text-mist">{label}</span>
        <span className="font-mono text-sm font-medium">{value.toFixed(0)}/{max}</span>
      </div>
      <div className="flex gap-1" role="meter" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max} aria-label={label}>
        {Array.from({ length: segments }).map((_, i) => {
          const isFilled = i < filled;
          const isHot = i >= segments - 2;
          return (
            <span
              key={i}
              className={`h-2.5 flex-1 rounded-[2px] transition-colors ${
                isFilled ? (isHot ? "bg-signal" : "bg-brass") : "bg-mist/20"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
