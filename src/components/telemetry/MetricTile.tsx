import React from "react";

interface MetricTileProps {
  label: string;
  value: string;
  unit?: string;
  accent?: boolean;
}

export function MetricTile({ label, value, unit, accent }: MetricTileProps) {
  return (
    <div className="rounded-md border border-base-700 bg-base-900 px-3 py-2">
      <div className="mb-0.5 text-[10px] uppercase tracking-wide text-ink-500">{label}</div>
      <div className={`font-mono text-base tabular ${accent ? "text-accent" : "text-ink-100"}`}>
        {value}
        {unit && <span className="ml-1 text-xs text-ink-500">{unit}</span>}
      </div>
    </div>
  );
}