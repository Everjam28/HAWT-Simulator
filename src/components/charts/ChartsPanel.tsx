import React from "react";
import { useSimulation } from "../../simulation/SimulationContext";
import { RealtimeChart } from "./RealtimeChart";

export function ChartsPanel() {
  const { charts } = useSimulation();

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
      <RealtimeChart title="Velocidad del viento vs tiempo" data={charts.wind} unit="m/s" color="#3ED6C4" />
      <RealtimeChart title="RPM del rotor vs tiempo" data={charts.rotorRpm} unit="rpm" color="#8FD3FF" />
      <RealtimeChart
        title="Potencia eléctrica vs tiempo"
        data={charts.electricPower}
        unit="W"
        color="#E8A93B"
        formatValue={(v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v.toFixed(0))}
      />
      <RealtimeChart title="RPM del generador vs tiempo" data={charts.generatorRpm} unit="rpm" color="#B79CFF" />
    </div>
  );
}