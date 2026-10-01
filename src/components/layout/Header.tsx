import React from "react";
import { Wind } from "lucide-react";
import { useSimulation } from "../../simulation/SimulationContext";
import { SafetyStatusBadge } from "../telemetry/StatusIndicator";

export function Header() {
  const { telemetry, isRunning } = useSimulation();

  return (
    <header className="flex flex-wrap items-center justify-between gap-2 border-b border-base-700 bg-base-900 px-4 py-2.5">
      <div className="flex items-center gap-2.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent-soft text-accent">
          <Wind size={16} />
        </div>
        <div className="leading-tight">
          <h1 className="text-sm font-semibold tracking-wide text-ink-100">
            AEROGEN-3H <span className="font-normal text-ink-500">· Simulador de Turbina Eólica HAWT</span>
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium ${
            isRunning ? "bg-ok-soft text-ok" : "bg-base-800 text-ink-500"
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${isRunning ? "bg-ok status-dot-live" : "bg-ink-700"}`} />
          {isRunning ? "Simulación activa" : "Simulación en pausa"}
        </span>
        <SafetyStatusBadge state={telemetry.safetyState} />
      </div>
    </header>
  );
}