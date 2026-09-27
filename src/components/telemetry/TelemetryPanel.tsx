import React, { useState } from "react";
import { Activity, ShieldAlert, LineChart, LayoutGrid } from "lucide-react";
import { useSimulation } from "../../simulation/SimulationContext";
import { formatWatts } from "../../simulation/physics";
import { MetricTile } from "./MetricTile";
import { OperationalStatusBadge, SafetyStatusBadge } from "./StatusIndicator";
import { getOperatingGuidance } from "./advisory";
import { ChartsPanel } from "../charts/ChartsPanel";

const GUIDANCE_STYLES: Record<string, string> = {
  ok: "border-ok/40 bg-ok-soft text-ok",
  warn: "border-warn/40 bg-warn-soft text-warn",
  danger: "border-danger/40 bg-danger-soft text-danger",
};

type TelemetryDisplayMode = "metrics" | "charts";

export function TelemetryPanel() {
  const { telemetry, inputs } = useSimulation();
  const guidance = getOperatingGuidance(telemetry, inputs);
  const [mode, setMode] = useState<TelemetryDisplayMode>("metrics");

  return (
    <div className="rounded-lg border border-base-700 bg-base-850 p-4 shadow-panel">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Activity size={15} className="text-accent" />
          <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-300">
            {mode === "metrics" ? "Telemetría en tiempo real" : "Gráficas en tiempo real"}
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <OperationalStatusBadge state={telemetry.operationalState} />
          <SafetyStatusBadge state={telemetry.safetyState} />
          <div className="ml-1 flex overflow-hidden rounded-md border border-base-600">
            <button
              onClick={() => setMode("metrics")}
              title="Ver métricas numéricas"
              className={`flex items-center gap-1 px-2 py-1 text-[10px] font-medium transition ${
                mode === "metrics" ? "bg-accent-soft text-accent" : "text-ink-500 hover:text-ink-100"
              }`}
            >
              <LayoutGrid size={12} />
              Métricas
            </button>
            <button
              onClick={() => setMode("charts")}
              title="Ver gráficas en tiempo real"
              className={`flex items-center gap-1 border-l border-base-600 px-2 py-1 text-[10px] font-medium transition ${
                mode === "charts" ? "bg-accent-soft text-accent" : "text-ink-500 hover:text-ink-100"
              }`}
            >
              <LineChart size={12} />
              Gráficas
            </button>
          </div>
        </div>
      </div>

      {mode === "metrics" ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          <MetricTile label="Viento" value={telemetry.windSpeed.toFixed(1)} unit="m/s" />
          <MetricTile label="RPM rotor" value={telemetry.rotorRpm.toFixed(2)} unit="rpm" />
          <MetricTile label="RPM eje principal" value={telemetry.mainShaftRpm.toFixed(2)} unit="rpm" />
          <MetricTile label="RPM eje secundario" value={telemetry.secondaryShaftRpm.toFixed(0)} unit="rpm" />
          <MetricTile label="RPM generador" value={telemetry.generatorRpm.toFixed(0)} unit="rpm" accent />
          <MetricTile label="Potencia del viento" value={formatWatts(telemetry.windPower)} />
          <MetricTile label="Potencia mecánica" value={formatWatts(telemetry.mechanicalPower)} />
          <MetricTile label="Potencia eléctrica" value={formatWatts(telemetry.electricPower)} accent />
          <MetricTile label="Cp" value={telemetry.powerCoefficient.toFixed(2)} />
          <MetricTile label="Eficiencia transmisión" value={`${(telemetry.transmissionEfficiency * 100).toFixed(0)}%`} />
          <MetricTile label="Eficiencia generador" value={`${(telemetry.generatorEfficiency * 100).toFixed(0)}%`} />
          <MetricTile label="Relación de transmisión" value={`1:${telemetry.gearRatio}`} />
        </div>
      ) : (
        <ChartsPanel />
      )}

      <div className={`mt-3 flex items-start gap-2 rounded-md border px-3 py-2.5 text-xs ${GUIDANCE_STYLES[guidance.tone]}`}>
        <ShieldAlert size={15} className="mt-0.5 shrink-0" />
        <div>
          <div className="font-semibold">{guidance.title}</div>
          <div className="mt-0.5 leading-snug opacity-90">{guidance.message}</div>
        </div>
      </div>
    </div>
  );
}