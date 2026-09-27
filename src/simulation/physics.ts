import {
  CUT_IN_WIND_SPEED,
  GEAR_RATIO,
  MAX_ROTOR_RPM,
  SAFETY_WIND_CUTOUT,
  SAFETY_WIND_WARNING,
  SafetyState,
  SimulationInputs,
  TelemetrySnapshot,
  TurbineOperationalState,
} from "./simulationTypes";

/**
 * Relación de velocidad de punta de pala (Tip Speed Ratio) óptima asumida
 * para una turbina tripala moderna. Determina qué tan rápido gira el rotor
 * respecto a la velocidad del viento y el radio: omega = (TSR * v) / R
 */
const OPTIMAL_TIP_SPEED_RATIO = 6.5;

const RAD_S_TO_RPM = 60 / (2 * Math.PI);

export function sweptArea(rotorRadius: number): number {
  return Math.PI * rotorRadius * rotorRadius;
}

export function windPower(
  airDensity: number,
  rotorRadius: number,
  windSpeed: number
): number {
  const A = sweptArea(rotorRadius);
  return 0.5 * airDensity * A * Math.pow(windSpeed, 3);
}

export function mechanicalPower(
  pWind: number,
  powerCoefficient: number
): number {
  return pWind * powerCoefficient;
}

export function electricPower(
  pMechanical: number,
  transmissionEfficiency: number,
  generatorEfficiency: number
): number {
  return pMechanical * transmissionEfficiency * generatorEfficiency;
}

/**
 * Determina si la turbina debe reducir o detener el rotor por seguridad,
 * y devuelve el factor de derateo de RPM (1 = sin restricción, 0 = detenida).
 */
export function safetyDerateFactor(windSpeed: number): {
  factor: number;
  state: SafetyState;
} {
  if (windSpeed >= SAFETY_WIND_CUTOUT) {
    return { factor: 0, state: "parada" };
  }
  if (windSpeed >= SAFETY_WIND_WARNING) {
    // Reducción progresiva y lineal entre el umbral de advertencia y el de corte
    const span = SAFETY_WIND_CUTOUT - SAFETY_WIND_WARNING;
    const progress = (windSpeed - SAFETY_WIND_WARNING) / span; // 0..1
    const factor = 1 - progress * 0.65; // reduce hasta el 35% de la RPM nominal
    return { factor, state: "advertencia" };
  }
  return { factor: 1, state: "normal" };
}

export function rotorRpm(windSpeed: number, rotorRadius: number): number {
  if (windSpeed < CUT_IN_WIND_SPEED) return 0;

  const { factor } = safetyDerateFactor(windSpeed);
  if (factor <= 0) return 0;

  const omega = (OPTIMAL_TIP_SPEED_RATIO * windSpeed) / rotorRadius; // rad/s
  const rawRpm = omega * RAD_S_TO_RPM;
  const limitedRpm = Math.min(rawRpm, MAX_ROTOR_RPM);
  return limitedRpm * factor;
}

export function operationalState(
  windSpeed: number,
  rpm: number
): TurbineOperationalState {
  if (windSpeed < CUT_IN_WIND_SPEED || rpm <= 0.05) return "detenida";
  if (windSpeed < 5.5) return "viento-bajo";
  return "generando";
}

/**
 * Calcula un snapshot de telemetría completo a partir de las entradas
 * actuales de la simulación y el tiempo transcurrido.
 */
export function computeTelemetry(
  inputs: SimulationInputs,
  elapsedTime: number
): TelemetrySnapshot {
  const { windSpeed, airDensity, powerCoefficient, transmissionEfficiency, generatorEfficiency, rotorRadius } =
    inputs;

  const pWind = windPower(airDensity, rotorRadius, windSpeed);
  const { state: safetyState } = safetyDerateFactor(windSpeed);
  const rRpm = rotorRpm(windSpeed, rotorRadius);

  const isRunning = rRpm > 0.05;

  const pMechanical = isRunning ? mechanicalPower(pWind, powerCoefficient) : 0;
  const pElectric = isRunning
    ? electricPower(pMechanical, transmissionEfficiency, generatorEfficiency)
    : 0;

  const mainShaftRpm = rRpm;
  const secondaryShaftRpm = rRpm * GEAR_RATIO;
  const generatorRpm = secondaryShaftRpm;

  return {
    time: elapsedTime,
    windSpeed,
    rotorRpm: rRpm,
    mainShaftRpm,
    secondaryShaftRpm,
    generatorRpm,
    windPower: pWind,
    mechanicalPower: pMechanical,
    electricPower: pElectric,
    powerCoefficient,
    transmissionEfficiency,
    generatorEfficiency,
    operationalState: operationalState(windSpeed, rRpm),
    safetyState,
    gearRatio: GEAR_RATIO,
  };
}

export function formatWatts(watts: number): string {
  if (watts >= 1_000_000) return `${(watts / 1_000_000).toFixed(2)} MW`;
  if (watts >= 1_000) return `${(watts / 1_000).toFixed(2)} kW`;
  return `${watts.toFixed(0)} W`;
}