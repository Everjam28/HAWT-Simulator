import React, { useMemo } from "react";
import { ChartPoint } from "../../simulation/simulationTypes";

interface RealtimeChartProps {
  title: string;
  data: ChartPoint[];
  unit?: string;
  color?: string;
  formatValue?: (v: number) => string;
  /** Serie de comparación (ej. datos importados de Simulink), graficada en
   * el mismo panel con línea discontinua y su propio eje X normalizado. */
  compareData?: number[];
  compareLabel?: string;
  compareColor?: string;
}

const WIDTH = 300;
const HEIGHT = 84;
const PAD_X = 4;
const PAD_Y = 8;

function buildPath(values: number[], min: number, max: number) {
  const span = max - min || 1;
  const points = values.map((v, i) => {
    const x = PAD_X + (i / Math.max(values.length - 1, 1)) * (WIDTH - PAD_X * 2);
    const y = PAD_Y + (1 - (v - min) / span) * (HEIGHT - PAD_Y * 2);
    return [x, y] as [number, number];
  });
  return points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
}

export function RealtimeChart({
  title,
  data,
  unit = "",
  color = "#3ED6C4",
  formatValue,
  compareData,
  compareLabel = "Simulink",
  compareColor = "#E8A93B",
}: RealtimeChartProps) {
  const fmt = formatValue ?? ((v: number) => v.toFixed(1));

  const { path, area, lastValue, minLabel, maxLabel, comparePath } = useMemo(() => {
    if (data.length < 2) {
      return { path: "", area: "", lastValue: 0, minLabel: 0, maxLabel: 0, comparePath: "" };
    }

    const values = data.map((d) => d.value);
    const allValues = compareData && compareData.length > 1 ? [...values, ...compareData] : values;
    let min = Math.min(...allValues);
    let max = Math.max(...allValues);
    if (max - min < 1e-6) {
      max += 1;
      min -= 1;
    }

    const linePath = buildPath(values, min, max);
    const cmpPath = compareData && compareData.length > 1 ? buildPath(compareData, min, max) : "";

    const span = max - min;
    const points = values.map((v, i) => {
      const x = PAD_X + (i / (values.length - 1)) * (WIDTH - PAD_X * 2);
      const y = PAD_Y + (1 - (v - min) / span) * (HEIGHT - PAD_Y * 2);
      return [x, y] as [number, number];
    });
    const areaPath = `${linePath} L${points[points.length - 1][0].toFixed(1)},${HEIGHT - PAD_Y} L${points[0][0].toFixed(
      1
    )},${HEIGHT - PAD_Y} Z`;

    return {
      path: linePath,
      area: areaPath,
      lastValue: values[values.length - 1],
      minLabel: min,
      maxLabel: max,
      comparePath: cmpPath,
    };
  }, [data, compareData]);

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
          {comparePath && (
            <path
              d={comparePath}
              fill="none"
              stroke={compareColor}
              strokeWidth={1.5}
              strokeDasharray="4 3"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          )}
        </svg>
      )}

      <div className="mt-0.5 flex items-center justify-between text-[9px] text-ink-700">
        {data.length >= 2 ? (
          <>
            <span>{fmt(minLabel)}</span>
            <span>{fmt(maxLabel)}</span>
          </>
        ) : (
          <span />
        )}
      </div>

      {comparePath && (
        <div className="mt-1.5 flex items-center gap-3 text-[9px] text-ink-500">
          <span className="flex items-center gap-1">
            <span className="inline-block h-[2px] w-3" style={{ backgroundColor: color }} />
            Simulador
          </span>
          <span className="flex items-center gap-1">
            <span
              className="inline-block h-0 w-3 border-t-2"
              style={{ borderColor: compareColor, borderStyle: "dashed" }}
            />
            {compareLabel}
          </span>
        </div>
      )}
    </div>
  );
}