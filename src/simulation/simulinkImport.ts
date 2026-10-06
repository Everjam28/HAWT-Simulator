import { SimulationInputs } from "./simulationTypes";

export interface ImportedSeries {
  time: number[];
  windSpeed?: number[];
  rotorRpm?: number[];
  mainShaftRpm?: number[];
  secondaryShaftRpm?: number[];
  generatorRpm?: number[];
  windPower?: number[];
  mechanicalPower?: number[];
  electricPower?: number[];
}

export interface ImportedSimulinkData {
  fileName: string;
  parameters: Partial<SimulationInputs>;
  series: ImportedSeries;
}

// Alias de nombres de columnas/parámetros aceptados (normalizados a minúsculas
// sin espacios ni guiones), para tolerar exports de Simulink en español o inglés.
const PARAM_ALIASES: Record<keyof SimulationInputs, string[]> = {
  windSpeed: ["windspeed", "viento", "velocidadviento", "v", "wind"],
  airDensity: ["airdensity", "densidad", "densidadaire", "rho"],
  powerCoefficient: ["cp", "powercoefficient", "coeficientepotencia"],
  transmissionEfficiency: ["etatransmission", "eficienciatransmision", "transmissionefficiency", "etat"],
  generatorEfficiency: ["etagenerator", "eficienciagenerador", "generatorefficiency", "etag"],
  rotorRadius: ["rotorradius", "radio", "radiorotor", "r"],
};

const SERIES_ALIASES: Record<keyof ImportedSeries, string[]> = {
  time: ["time", "t", "tiempo", "tiempos"],
  windSpeed: ["windspeed", "viento", "velocidadviento", "wind", "v"],
  rotorRpm: ["rotorrpm", "rpmrotor", "rpmr"],
  mainShaftRpm: ["mainshaftrpm", "rpmejeprincipal", "rpmejeprimario"],
  secondaryShaftRpm: ["secondaryshaftrpm", "rpmejesecundario"],
  generatorRpm: ["generatorrpm", "rpmgenerador", "rpmgen"],
  windPower: ["windpower", "potenciaviento", "pwind"],
  mechanicalPower: ["mechanicalpower", "potenciamecanica", "pmec"],
  electricPower: ["electricpower", "potenciaelectrica", "pelectrica", "pelec"],
};

function normalize(key: string): string {
  return key.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
}

function matchAlias<T extends string>(header: string, aliasMap: Record<T, string[]>): T | null {
  const norm = normalize(header);
  for (const key of Object.keys(aliasMap) as T[]) {
    if (aliasMap[key].some((a) => normalize(a) === norm)) return key;
  }
  return null;
}

function parseCsv(text: string): { headers: string[]; rows: string[][] } {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
  if (lines.length === 0) throw new Error("El archivo CSV está vacío.");

  const delimiter = lines[0].includes(";") ? ";" : ",";
  const headers = lines[0].split(delimiter).map((h) => h.trim());
  const rows = lines.slice(1).map((l) => l.split(delimiter).map((c) => c.trim()));
  return { headers, rows };
}

function fromCsv(text: string): { parameters: Partial<SimulationInputs>; series: ImportedSeries } {
  const { headers, rows } = parseCsv(text);

  const paramCols: { index: number; key: keyof SimulationInputs }[] = [];
  const seriesCols: { index: number; key: keyof ImportedSeries }[] = [];

  headers.forEach((h, index) => {
    const paramKey = matchAlias(h, PARAM_ALIASES);
    const seriesKey = matchAlias(h, SERIES_ALIASES);
    // Una columna de tiempo/serie tiene prioridad sobre el mapeo de parámetro
    // si coincide con ambos (ej. "viento" puede ser parámetro fijo o serie).
    if (seriesKey) seriesCols.push({ index, key: seriesKey });
    else if (paramKey) paramCols.push({ index, key: paramKey });
  });

  if (seriesCols.length === 0 && paramCols.length === 0) {
    throw new Error(
      "No se reconoció ninguna columna. Usa encabezados como: time, windSpeed, rotorRpm, electricPower, generatorRpm, airDensity, Cp, rotorRadius, etc."
    );
  }

  const series: ImportedSeries = { time: [] };
  const seriesArrays: Partial<Record<keyof ImportedSeries, number[]>> = {};

  rows.forEach((row) => {
    seriesCols.forEach(({ index, key }) => {
      const raw = row[index];
      const value = Number(raw);
      if (Number.isNaN(value)) return;
      if (!seriesArrays[key]) seriesArrays[key] = [];
      seriesArrays[key]!.push(value);
    });
  });

  Object.assign(series, seriesArrays);
  if (!series.time || series.time.length === 0) {
    // Si no hay columna de tiempo explícita, se genera un índice 0..n-1
    const len = Math.max(0, ...Object.values(seriesArrays).map((a) => a?.length ?? 0));
    series.time = Array.from({ length: len }, (_, i) => i);
  }

  // Los parámetros escalares se toman de la última fila con datos válidos
  const parameters: Partial<SimulationInputs> = {};
  paramCols.forEach(({ index, key }) => {
    for (let r = rows.length - 1; r >= 0; r--) {
      const value = Number(rows[r][index]);
      if (!Number.isNaN(value)) {
        parameters[key] = value;
        break;
      }
    }
  });

  return { parameters, series };
}

function fromJson(text: string): { parameters: Partial<SimulationInputs>; series: ImportedSeries } {
  const data = JSON.parse(text);
  const parameters: Partial<SimulationInputs> = data.parameters ?? data.parametros ?? {};
  const rawSeries = data.series ?? data.datos ?? {};

  const series: ImportedSeries = { time: rawSeries.time ?? rawSeries.tiempo ?? [] };
  (Object.keys(SERIES_ALIASES) as (keyof ImportedSeries)[]).forEach((key) => {
    if (key === "time") return;
    if (Array.isArray(rawSeries[key])) {
      series[key] = rawSeries[key];
    }
  });

  return { parameters, series };
}

export async function parseSimulinkFile(file: File): Promise<ImportedSimulinkData> {
  const text = await file.text();
  const isJson = file.name.toLowerCase().endsWith(".json") || text.trim().startsWith("{");

  const { parameters, series } = isJson ? fromJson(text) : fromCsv(text);

  if (!series.time || series.time.length < 2) {
    throw new Error("El archivo no contiene suficientes puntos de datos en el tiempo para graficar.");
  }

  // El flujo de Simulink (export_simulation_csv.m) reporta P_electrica en
  // kW, siguiendo la convención del informe/guía, mientras el simulador
  // web trabaja internamente en vatios (W). Se convierte aquí para que la
  // curva importada se superponga a la escala correcta en las gráficas.
  if (series.electricPower) {
    series.electricPower = series.electricPower.map((kw) => kw * 1000);
  }

  return { fileName: file.name, parameters, series };
}