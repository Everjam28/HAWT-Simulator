import React from "react";
import { Play, Pause, RotateCcw, FastForward, Rewind } from "lucide-react";
import { useSimulation } from "../../simulation/SimulationContext";

export function PlaybackControls() {
  const { isRunning, start, pause, reset, timeScale, increaseSpeed, decreaseSpeed } = useSimulation();

  return (
    <div className="rounded-lg border border-base-700 bg-base-850 p-4 shadow-panel">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-300">Control de simulación</h2>

      <div className="mb-2 flex gap-2">
        {!isRunning ? (
          <button
            onClick={start}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-accent/90 px-3 py-2 text-sm font-medium text-base-950 transition hover:bg-accent"
          >
            <Play size={15} fill="currentColor" />
            Iniciar
          </button>
        ) : (
          <button
            onClick={pause}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-warn/90 px-3 py-2 text-sm font-medium text-base-950 transition hover:bg-warn"
          >
            <Pause size={15} fill="currentColor" />
            Pausar
          </button>
        )}
        <button
          onClick={reset}
          className="flex items-center justify-center gap-1.5 rounded-md border border-base-600 px-3 py-2 text-sm font-medium text-ink-300 transition hover:border-ink-500 hover:text-ink-100"
          title="Reiniciar"
        >
          <RotateCcw size={15} />
        </button>
      </div>

      <div className="flex items-center justify-between rounded-md bg-base-900 px-2 py-1.5">
        <button
          onClick={decreaseSpeed}
          className="rounded p-1.5 text-ink-300 transition hover:bg-base-700 hover:text-ink-100"
          title="Disminuir velocidad de simulación"
        >
          <Rewind size={14} />
        </button>
        <span className="font-mono text-xs tabular text-ink-100">{timeScale}×</span>
        <button
          onClick={increaseSpeed}
          className="rounded p-1.5 text-ink-300 transition hover:bg-base-700 hover:text-ink-100"
          title="Aumentar velocidad de simulación"
        >
          <FastForward size={14} />
        </button>
      </div>
    </div>
  );
}