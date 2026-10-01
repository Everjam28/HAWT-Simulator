import React from "react";
import { useSimulation } from "../../simulation/SimulationContext";
import { RealtimeChart } from "./RealtimeChart";

export function ChartsPanel() {
  const { charts, simulinkData } = useSimulation();
  const s = simulinkData?.series;

  return (
    <div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
        <RealtimeChart
          title="Velocidad del viento vs tiempo"
          data={charts.wind}
          unit="m/s"
          color="#3ED6C4"
          compareData={s?.windSpeed}
        />
        <RealtimeChart
          title="RPM del rotor vs tiempo"
          data={charts.rotorRpm}
          unit="rpm"
          color="#8FD3FF"
          compareData={s?.rotorRpm}
        />
        <RealtimeChart
          title="Potencia eléctrica vs tiempo"
          data={charts.electricPower}
          unit="W"
          color="#E8A93B"
          compareColor="#B79CFF"
          formatValue={(v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v.toFixed(0))}
          compareData={s?.electricPower}
        />
        <RealtimeChart
          title="RPM del generador vs tiempo"
          data={charts.generatorRpm}
          unit="rpm"
          color="#B79CFF"
          compareColor="#E8A93B"
          compareData={s?.generatorRpm}
        />
      </div>
      {simulinkData && (
        <p className="mt-2 text-[10px] text-ink-600">
          Línea discontinua = datos importados de <span className="text-ink-300">{simulinkData.fileName}</span> (Scope de
          Simulink), eje de tiempo normalizado para comparar la forma de la curva.
        </p>
      )}
    </div>
  );
}