"use client";

type WaveformProps = {
  active?: boolean;
  bars?: number;
  className?: string;
};

// A quiet ambient waveform used both as decoration (landing hero) and as a live
// "listening" indicator (voice input). When inactive it sits at rest, low bars.
export function Waveform({ active = true, bars = 24, className = "" }: WaveformProps) {
  return (
    <div className={`flex h-10 items-center gap-[3px] ${className}`} aria-hidden>
      {Array.from({ length: bars }).map((_, i) => {
        const delay = (i % 8) * 0.09;
        const heightSeed = 0.3 + ((i * 37) % 10) / 14;
        return (
          <span
            key={i}
            className={`w-[3px] flex-shrink-0 rounded-full ${
              active ? "bg-signal animate-wave" : "bg-mist/40"
            }`}
            style={
              active
                ? { height: `${heightSeed * 100}%`, animationDelay: `${delay}s`, animationDuration: "0.9s" }
                : { height: "20%" }
            }
          />
        );
      })}
    </div>
  );
}
