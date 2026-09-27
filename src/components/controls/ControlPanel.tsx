import React from "react";
import { Gauge, Shuffle } from "lucide-react";
import { useSimulation } from "../../simulation/SimulationContext";
import { SLIDER_RANGES } from "../../simulation/defaultSimulation";
import { SliderControl } from "./SliderControl";

export function ControlPanel() {
  const { inputs, setInput, randomMode, toggleRandomMode } = useSimulation();

  return (
    <div className="rounded-lg border border-base-700 bg-base-850 p-4 shadow-panel">
      <div className="mb-3 flex items-center justify-between text-ink-100">
        <div className="flex items-center gap-2">
          <Gauge size={15} className="text-accent" />
          <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-300">Parámetros de entrada</h2>
        </div>
        <button
          onClick={toggleRandomMode}
          title="Variar todos los parámetros aleatoriamente de forma continua"
          className={`flex items-center gap-1 rounded-md border px-2 py-1 text-[10px] font-medium transition ${
            randomMode
              ? "border-accent bg-accent-soft text-accent"
              : "border-base-600 text-ink-500 hover:border-ink-500 hover:text-ink-100"
          }`}
        >
          <Shuffle size={12} className={randomMode ? "animate-pulse" : ""} />
          Aleatorio
        </button>
      </div>

      <SliderControl
        label="Velocidad del viento"
        value={inputs.windSpeed}
        {...SLIDER_RANGES.windSpeed}
        decimals={1}
        onChange={(v) => setInput("windSpeed", v)}
      />
      <SliderControl
        label="Densidad del aire"
        value={inputs.airDensity}
        {...SLIDER_RANGES.airDensity}
        decimals={3}
        onChange={(v) => setInput("airDensity", v)}
      />
      <SliderControl
        label="Coeficiente de potencia (Cp)"
        value={inputs.powerCoefficient}
        {...SLIDER_RANGES.powerCoefficient}
        decimals={2}
        onChange={(v) => setInput("powerCoefficient", v)}
      />
      <SliderControl
        label="Eficiencia de transmisión"
        value={inputs.transmissionEfficiency}
        {...SLIDER_RANGES.transmissionEfficiency}
        decimals={2}
        onChange={(v) => setInput("transmissionEfficiency", v)}
      />
      <SliderControl
        label="Eficiencia del generador"
        value={inputs.generatorEfficiency}
        {...SLIDER_RANGES.generatorEfficiency}
        decimals={2}
        onChange={(v) => setInput("generatorEfficiency", v)}
      />
      <SliderControl
        label="Radio del rotor"
        value={inputs.rotorRadius}
        {...SLIDER_RANGES.rotorRadius}
        decimals={1}
        onChange={(v) => setInput("rotorRadius", v)}
      />
    </div>
  );
}