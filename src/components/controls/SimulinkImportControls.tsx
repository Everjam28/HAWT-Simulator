import React, { useRef, useState } from "react";
import { UploadCloud, FileCheck2, X, AlertTriangle } from "lucide-react";
import { useSimulation } from "../../simulation/SimulationContext";

export function SimulinkImportControls() {
  const { simulinkData, importSimulinkFile, clearSimulinkData, simulinkImportError } = useSimulation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setLoading(true);
    await importSimulinkFile(file);
    setLoading(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const paramCount = simulinkData ? Object.keys(simulinkData.parameters).length : 0;
  const seriesCount = simulinkData
    ? Object.keys(simulinkData.series).filter((k) => k !== "time").length
    : 0;

  return (
    <div className="rounded-lg border border-base-700 bg-base-850 p-4 shadow-panel">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-300">Comparación con Simulink</h2>

      <input
        ref={inputRef}
        type="file"
        accept=".csv,.json,.txt"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      <button
        onClick={() => inputRef.current?.click()}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-base-600 px-3 py-2.5 text-xs font-medium text-ink-300 transition hover:border-accent hover:text-accent disabled:opacity-50"
      >
        <UploadCloud size={15} />
        {loading ? "Leyendo archivo…" : "Importar archivo de Simulink (.csv / .json)"}
      </button>

      {simulinkImportError && (
        <div className="mt-2 flex items-start gap-2 rounded-md border border-danger/40 bg-danger-soft px-3 py-2 text-[11px] text-danger">
          <AlertTriangle size={13} className="mt-0.5 shrink-0" />
          <span>{simulinkImportError}</span>
        </div>
      )}

      {simulinkData && (
        <div className="mt-2 flex items-start justify-between gap-2 rounded-md border border-accent/40 bg-accent-soft px-3 py-2 text-[11px] text-accent">
          <div className="flex items-start gap-2">
            <FileCheck2 size={13} className="mt-0.5 shrink-0" />
            <div>
              <div className="font-medium">{simulinkData.fileName}</div>
              <div className="mt-0.5 text-accent/80">
                {paramCount > 0 && `${paramCount} parámetro(s) aplicado(s) a los sliders. `}
                {seriesCount > 0 && `${seriesCount} serie(s) disponible(s) para comparar en las gráficas.`}
              </div>
            </div>
          </div>
          <button onClick={clearSimulinkData} className="shrink-0 rounded p-0.5 hover:bg-base-700" title="Quitar datos importados">
            <X size={13} />
          </button>
        </div>
      )}

      <p className="mt-2 text-[10px] leading-relaxed text-ink-700">
        Exporta desde Simulink (Scope / To Workspace) un CSV con columnas como <code>time, windSpeed, rotorRpm,
        electricPower, generatorRpm</code>, o un JSON con <code>{"{ parameters, series }"}</code>.
      </p>
    </div>
  );
}