import React from "react";
import { Wind, CloudDrizzle, CloudLightning, Tornado, Waves } from "lucide-react";
import { useSimulation } from "../../simulation/SimulationContext";
import { SCENARIOS } from "../../simulation/defaultSimulation";
import { ScenarioId } from "../../simulation/simulationTypes";

const SCENARIO_ICONS: Record<ScenarioId, React.ReactNode> = {
  bajo: <CloudDrizzle size={14} />,
  normal: <Wind size={14} />,
  fuerte: <CloudLightning size={14} />,
  "muy-fuerte": <Tornado size={14} />,
  variable: <Waves size={14} />,
  manual: <Wind size={14} />,
};

export function ScenarioControls() {
  const { scenario, applyScenario } = useSimulation();

  return (
    <div className="rounded-lg border border-base-700 bg-base-850 p-4 shadow-panel">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-300">Escenarios</h2>
      <div className="grid grid-cols-1 gap-2">
        {SCENARIOS.map((s) => {
          const active = scenario === s.id;
          return (
            <button
              key={s.id}
              onClick={() => applyScenario(s.id)}
              className={`flex items-center gap-2 rounded-md border px-3 py-2 text-left transition ${
                active
                  ? "border-accent bg-accent-soft"
                  : "border-base-600 hover:border-ink-500"
              }`}
            >
              <span className={active ? "text-accent" : "text-ink-500"}>{SCENARIO_ICONS[s.id]}</span>
              <span className="flex-1">
                <span className={`block text-xs font-medium ${active ? "text-accent" : "text-ink-100"}`}>
                  {s.label}
                </span>
                <span className="block text-[10px] text-ink-500">{s.description}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}