import { ScenarioId, SimulationInputs } from "./simulationTypes";

export const DEFAULT_SIMULATION_INPUTS: SimulationInputs = {
  windSpeed: 8,
  airDensity: 1.225,
  powerCoefficient: 0.4,
  transmissionEfficiency: 0.9,
  generatorEfficiency: 0.95,
  rotorRadius: 25,
};

export const SLIDER_RANGES = {
  windSpeed: { min: 0, max: 30, step: 0.1, unit: "m/s" },
  airDensity: { min: 0.9, max: 1.3, step: 0.001, unit: "kg/m³" },
  powerCoefficient: { min: 0.1, max: 0.59, step: 0.01, unit: "" },
  transmissionEfficiency: { min: 0.7, max: 1.0, step: 0.01, unit: "" },
  generatorEfficiency: { min: 0.7, max: 1.0, step: 0.01, unit: "" },
  rotorRadius: { min: 10, max: 50, step: 0.5, unit: "m" },
} as const;

export interface ScenarioDefinition {
  id: ScenarioId;
  label: string;
  description: string;
  windSpeed?: number;
  variable?: boolean;
}

export const SCENARIOS: ScenarioDefinition[] = [
  {
    id: "bajo",
    label: "Viento bajo",
    description: "4 m/s — apenas por encima del arranque",
    windSpeed: 4,
  },
  {
    id: "normal",
    label: "Viento normal",
    description: "8 m/s — operación nominal",
    windSpeed: 8,
  },
  {
    id: "fuerte",
    label: "Viento fuerte",
    description: "15 m/s — alta generación",
    windSpeed: 15,
  },
  {
    id: "muy-fuerte",
    label: "Viento muy fuerte",
    description: "25 m/s — límite de seguridad",
    windSpeed: 25,
  },
  {
    id: "variable",
    label: "Viento variable",
    description: "Oscila automáticamente entre 3 y 20 m/s",
    variable: true,
  },
];

export const MAX_CHART_POINTS = 120;
export const CHART_WINDOW_SECONDS = 60; // ventana de tiempo simulado que cubren las gráficas