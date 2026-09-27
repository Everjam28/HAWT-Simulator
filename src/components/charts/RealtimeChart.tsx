import React, { useMemo } from "react";
import { ChartPoint } from "../../simulation/simulationTypes";

interface RealtimeChartProps {
  title: string;
  data: ChartPoint[];
  unit?: string;
  color?: string;
  formatValue?: (v: number) => string;
}

const WIDTH = 300;
const HEIGHT = 84;
const PAD_X = 4;
const PAD_Y = 8;

export function RealtimeChart({ title, data, unit = "", color = "#3ED6C4", formatValue }: RealtimeChartProps) {
  const { path, area, lastValue, minLabel, maxLabel } = useMemo(() => {
    if (data.length < 2) {
      return { path: "", area: "", lastValue: 0, minLabel: 0, maxLabel: 0 };
    }

    const values = data.map((d) => d.value);
    let min = Math.min(...values);
    let max = Math.max(...values);
    if (max - min < 1e-6) {
      // Evita división por cero cuando la señal es plana
      max += 1;
      min -= 1;
    }
    const span = max - min;

    const points = data.map((d, i) => {
      const x = PAD_X + (i / (data.length - 1)) * (WIDTH - PAD_X * 2);
      const y = PAD_Y + (1 - (d.value - min) / span) * (HEIGHT - PAD_Y * 2);
      return [x, y] as [number, number];
    });

    const linePath = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
    const areaPath = `${linePath} L${points[points.length - 1][0].toFixed(1)},${HEIGHT - PAD_Y} L${points[0][0].toFixed(
      1
    )},${HEIGHT - PAD_Y} Z`;

    return {
      path: linePath,
      area: areaPath,
      lastValue: values[values.length - 1],
      minLabel: min,
      maxLabel: max,
    };
  }, [data]);

  const fmt = formatValue ?? ((v: number) => v.toFixed(1));

  return (
    <div className="rounded-md border border-base-700 bg-base-900 p-3">
      <div className="mb-1 flex items-baseline justify-between">
        <span className="text-[10px] uppercase tracking-wide text-ink-500">{title}</span>
        <span className="font-mono text-sm tabular" style={{ color }}>
          {data.length > 0 ? fmt(lastValue) : "—"} <span className="text-[10px] text-ink-500">{unit}</span>
        </span>
      </div>

      {data.length < 2 ? (
        <div className="flex h-[84px] items-center justify-center text-[10px] text-ink-700">
          Inicia la simulación para ver datos
        </div>
      ) : (
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="h-[84px] w-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id={`grad-${title}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <path d={area} fill={`url(#grad-${title})`} stroke="none" />
          <path d={path} fill="none" stroke={color} strokeWidth={1.75} strokeLinejoin="round" strokeLinecap="round" />
        </svg>
      )}

      {data.length >= 2 && (
        <div className="mt-0.5 flex justify-between text-[9px] text-ink-700">
          <span>{fmt(minLabel)}</span>
          <span>{fmt(maxLabel)}</span>
        </div>
      )}
    </div>
  );
}