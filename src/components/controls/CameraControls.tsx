import React from "react";
import { useSimulation } from "../../simulation/SimulationContext";
import { CameraPreset } from "../../simulation/simulationTypes";

const CAMERA_OPTIONS: { id: CameraPreset; label: string }[] = [
  { id: "completa", label: "Vista completa" },
  { id: "frontal", label: "Vista frontal" },
  { id: "lateral", label: "Vista lateral" },
  { id: "superior", label: "Vista superior" },
  { id: "interior", label: "Vista interior" },
];

export function CameraControls() {
  const { cameraPreset, setCameraPreset } = useSimulation();

  return (
    <div className="rounded-lg border border-base-700 bg-base-850 p-4 shadow-panel">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-300">Cámara</h2>
      <div className="flex flex-wrap gap-2">
        {CAMERA_OPTIONS.map((opt) => {
          const active = cameraPreset === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => setCameraPreset(opt.id)}
              className={`rounded-md border px-2.5 py-1.5 text-xs font-medium transition ${
                active
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-base-600 text-ink-300 hover:border-ink-500 hover:text-ink-100"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}