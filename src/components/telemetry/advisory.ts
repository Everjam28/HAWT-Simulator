import {
  CUT_IN_WIND_SPEED,
  SAFETY_WIND_WARNING,
  SAFETY_WIND_CUTOUT,
  SimulationInputs,
  TelemetrySnapshot,
} from "../../simulation/simulationTypes";

export type GuidanceTone = "ok" | "warn" | "danger";

export interface OperatingGuidance {
  tone: GuidanceTone;
  title: string;
  message: string;
}

/**
 * Genera en tiempo real una recomendación legible sobre qué parámetro
 * ajustar según el estado actual de la turbina (normal, viento elevado,
 * parada de seguridad, viento insuficiente).
 */
export function getOperatingGuidance(telemetry: TelemetrySnapshot, inputs: SimulationInputs): OperatingGuidance {
  const { windSpeed } = inputs;

  if (telemetry.safetyState === "parada") {
    return {
      tone: "danger",
      title: "Parada de seguridad activa",
      message: `El viento (${windSpeed.toFixed(1)} m/s) superó el límite de ${SAFETY_WIND_CUTOUT} m/s. Reduce la velocidad del viento por debajo de ${SAFETY_WIND_WARNING} m/s para reanudar la generación de forma segura.`,
    };
  }

  if (telemetry.safetyState === "advertencia") {
    return {
      tone: "warn",
      title: "Viento elevado — reducción automática activa",
      message: `El sistema de protección ya está reduciendo las RPM. Para volver a operación nominal, baja el viento por debajo de ${SAFETY_WIND_WARNING} m/s; si supera ${SAFETY_WIND_CUTOUT} m/s, el rotor se detendrá por completo.`,
    };
  }

  if (windSpeed < CUT_IN_WIND_SPEED) {
    return {
      tone: "warn",
      title: "Viento insuficiente para arrancar",
      message: `Por debajo de ${CUT_IN_WIND_SPEED} m/s el rotor no gira. Aumenta la velocidad del viento a al menos ${CUT_IN_WIND_SPEED} m/s para iniciar la generación.`,
    };
  }

  if (telemetry.operationalState === "viento-bajo") {
    return {
      tone: "warn",
      title: "Generación por debajo del óptimo",
      message: `El viento actual (${windSpeed.toFixed(1)} m/s) genera poca potencia. El rango nominal recomendado es de 8 a ${SAFETY_WIND_WARNING - 2} m/s aproximadamente; considera aumentarlo para mayor generación.`,
    };
  }

  return {
    tone: "ok",
    title: "Operación normal",
    message: `La turbina opera en su rango nominal (viento entre ${CUT_IN_WIND_SPEED} y ${SAFETY_WIND_WARNING} m/s). Cp = ${telemetry.powerCoefficient.toFixed(2)}, dentro de un rango físicamente válido (máx. teórico ≈ 0.59, límite de Betz).`,
  };
}