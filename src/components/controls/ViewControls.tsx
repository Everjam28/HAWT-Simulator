import React from "react";
import { Box, ScanEye, Layers, Cog, Tag } from "lucide-react";
import { useSimulation } from "../../simulation/SimulationContext";
import { ViewMode } from "../../simulation/simulationTypes";

const VIEW_OPTIONS: { id: ViewMode; label: string; icon: React.ReactNode }[] = [
  { id: "exterior", label: "Exterior", icon: <Box size={14} /> },
  { id: "interior", label: "Interior", icon: <ScanEye size={14} /> },
  { id: "corte", label: "Corte", icon: <Layers size={14} /> },
  { id: "transmision", label: "Transmisión", icon: <Cog size={14} /> },
];

export function ViewControls() {
  const { viewMode, setViewMode, showLabels, toggleShowLabels } = useSimulation();

  return (
    <div className="rounded-lg border border-base-700 bg-base-850 p-4 shadow-panel">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-300">Vistas del modelo</h2>
      <div className="grid grid-cols-2 gap-2">
        {VIEW_OPTIONS.map((opt) => {
          const active = viewMode === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => setViewMode(opt.id)}
              className={`flex items-center justify-center gap-1.5 rounded-md border px-2 py-2 text-xs font-medium transition ${
                active
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-base-600 text-ink-300 hover:border-ink-500 hover:text-ink-100"
              }`}
            >
              {opt.icon}
              {opt.label}
            </button>
          );
        })}
      </div>

      <label className="mt-3 flex cursor-pointer items-center gap-2 border-t border-base-700 pt-3 text-xs text-ink-300">
        <input
          type="checkbox"
          checked={showLabels}
          onChange={toggleShowLabels}
          className="h-3.5 w-3.5 accent-accent"
        />
        <Tag size={13} className="text-ink-500" />
        Mostrar nombres de componentes
      </label>
    </div>
  );
}