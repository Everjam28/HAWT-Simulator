import React from "react";
import { SimulationProvider } from "./simulation/SimulationContext";
import { Scene } from "./components/simulation/Scene";
import { ControlPanel } from "./components/controls/ControlPanel";
import { PlaybackControls } from "./components/controls/PlaybackControls";
import { ViewControls } from "./components/controls/ViewControls";
import { CameraControls } from "./components/controls/CameraControls";
import { ScenarioControls } from "./components/controls/ScenarioControls";
import { TelemetryPanel } from "./components/telemetry/TelemetryPanel";

/**
 * NOTA: Este es un ensamblaje TEMPORAL para poder previsualizar el
 * simulador mientras se completan las fases restantes (telemetría,
 * gráficas y layout final). Se reemplazará por el dashboard completo
 * en la Fase 6.
 */
export default function App() {
  return (
    <SimulationProvider>
      <div className="flex h-screen w-screen flex-col bg-base-950">
        <header className="flex items-center justify-between border-b border-base-700 bg-base-900 px-4 py-2.5">
          <h1 className="text-sm font-semibold tracking-wide text-ink-100">
            AEROGEN-3H <span className="text-ink-500">· Simulador de Turbina Eólica HAWT</span>
          </h1>
          <span className="rounded border border-base-600 px-2 py-0.5 text-[10px] uppercase tracking-wide text-ink-500">
            Vista previa — en construcción
          </span>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <aside className="w-72 shrink-0 space-y-3 overflow-y-auto border-r border-base-700 bg-base-950 p-3">
            <ControlPanel />
            <PlaybackControls />
            <ViewControls />
            <CameraControls />
            <ScenarioControls />
          </aside>

          <main className="flex flex-1 flex-col overflow-hidden">
            <div className="flex-1">
              <Scene />
            </div>
            <div className="max-h-64 overflow-y-auto border-t border-base-700 p-3">
              <TelemetryPanel />
            </div>
          </main>
        </div>
      </div>
    </SimulationProvider>
  );
}