// Tipos centrales del dominio de simulación de la turbina eólica.

export type ViewMode = "exterior" | "interior" | "corte" | "transmision";

export type CameraPreset =
  | "frontal"
  | "lateral"
  | "superior"
  | "interior"
  | "completa";

export type ScenarioId =
  | "bajo"
  | "normal"
  | "fuerte"
  | "muy-fuerte"
  | "variable"
  | "manual";

export type TurbineOperationalState = "generando" | "viento-bajo" | "detenida";

export type SafetyState = "normal" | "advertencia" | "parada";

export interface SimulationInputs {
  windSpeed: number; // m/s
  airDensity: number; // kg/m^3
  powerCoefficient: number; // Cp, adimensional
  transmissionEfficiency: number; // 0-1
  generatorEfficiency: number; // 0-1
  rotorRadius: number; // m
}

export interface TelemetrySnapshot {
  time: number; // s, tiempo de simulación transcurrido
  windSpeed: number; // m/s
  rotorRpm: number;
  mainShaftRpm: number;
  secondaryShaftRpm: number;
  generatorRpm: number;
  windPower: number; // W
  mechanicalPower: number; // W
  electricPower: number; // W
  powerCoefficient: number;
  transmissionEfficiency: number;
  generatorEfficiency: number;
  operationalState: TurbineOperationalState;
  safetyState: SafetyState;
  gearRatio: number;
}

export interface ChartPoint {
  t: number;
  value: number;
}

export interface SelectedComponentInfo {
  id: string;
  name: string;
  description: string;
  getRpm: (t: TelemetrySnapshot) => number;
}

export const GEAR_RATIO = 42; // relación caja de engranajes eje principal -> eje secundario/generador

export const SAFETY_WIND_WARNING = 22; // m/s - umbral de advertencia
export const SAFETY_WIND_CUTOUT = 25; // m/s - umbral de parada de seguridad
export const CUT_IN_WIND_SPEED = 3; // m/s - por debajo de esto no hay generación útil

export const MAX_ROTOR_RPM = 22; // límite mecánico razonable para el rotor principal