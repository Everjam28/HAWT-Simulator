import React from "react";
import { X, Info } from "lucide-react";
import { useSimulation } from "../../simulation/SimulationContext";

export function ComponentInfoPanel() {
  const { selectedComponent, selectComponent, telemetry } = useSimulation();

  if (!selectedComponent) return null;

  const rpm = selectedComponent.getRpm(telemetry);

  return (
    <div className="pointer-events-auto absolute right-3 top-3 w-72 rounded-lg border border-accent/40 bg-base-900/95 p-4 shadow-panel backdrop-blur-sm">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <Info size={15} className="text-accent" />
          <h3 className="text-sm font-semibold text-ink-100">{selectedComponent.name}</h3>
        </div>
        <button
          onClick={() => selectComponent(null)}
          className="rounded p-0.5 text-ink-500 transition hover:bg-base-700 hover:text-ink-100"
          title="Cerrar"
        >
          <X size={14} />
        </button>
      </div>

      <p className="mb-3 text-xs leading-relaxed text-ink-300">{selectedComponent.description}</p>

      <div className="flex items-center justify-between rounded-md border border-base-700 bg-base-850 px-3 py-2">
        <span className="text-[10px] uppercase tracking-wide text-ink-500">Velocidad de rotación</span>
        <span className="font-mono text-sm tabular text-accent">{rpm.toFixed(1)} rpm</span>
      </div>

      <div className="mt-2 flex items-center justify-between rounded-md border border-base-700 bg-base-850 px-3 py-2">
        <span className="text-[10px] uppercase tracking-wide text-ink-500">Estado</span>
        <span
          className={`text-xs font-medium ${
            telemetry.operationalState === "generando"
              ? "text-ok"
              : telemetry.operationalState === "viento-bajo"
              ? "text-warn"
              : "text-danger"
          }`}
        >
          {telemetry.operationalState === "generando"
            ? "En movimiento"
            : telemetry.operationalState === "viento-bajo"
            ? "Girando lentamente"
            : "Detenido"}
        </span>
      </div>
    </div>
  );
}