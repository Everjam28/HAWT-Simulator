import React from "react";

interface SliderControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  decimals?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function SliderControl({
  label,
  value,
  min,
  max,
  step,
  unit = "",
  decimals = 2,
  onChange,
  disabled,
}: SliderControlProps) {
  return (
    <div className="mb-4">
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="text-xs font-medium text-ink-300">{label}</span>
        <span className="font-mono text-xs tabular text-accent">
          {value.toFixed(decimals)} {unit}
        </span>
      </div>
      <input
        type="range"
        className="sim-slider"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <div className="mt-0.5 flex justify-between text-[10px] text-ink-700">
        <span>
          {min} {unit}
        </span>
        <span>
          {max} {unit}
        </span>
      </div>
    </div>
  );
}