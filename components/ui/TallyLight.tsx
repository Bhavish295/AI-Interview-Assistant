type TallyLightProps = {
  label?: string;
  active?: boolean;
  size?: "sm" | "md";
};

export function TallyLight({ label = "In progress", active = true, size = "md" }: TallyLightProps) {
  const dot = size === "sm" ? "h-1.5 w-1.5" : "h-2 w-2";
  const text = size === "sm" ? "text-[11px]" : "text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-medium ${text} ${
        active
          ? "border-signal/30 bg-signal/10 text-signal"
          : "border-mist/30 bg-mist/10 text-mist"
      }`}
    >
      <span
        className={`${dot} rounded-full ${active ? "bg-signal animate-pulse-dot" : "bg-mist"}`}
        aria-hidden
      />
      {label}
    </span>
  );
}
