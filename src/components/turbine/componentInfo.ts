import { SelectedComponentInfo, TelemetrySnapshot } from "../../simulation/simulationTypes";

export const COMPONENT_INFO: Record<string, SelectedComponentInfo> = {
  hub: {
    id: "hub",
    name: "Cubo del rotor",
    description:
      "Une las tres aspas al eje principal y transmite el par de giro capturado del viento hacia el tren motriz.",
    getRpm: (t: TelemetrySnapshot) => t.rotorRpm,
  },
  "main-shaft": {
    id: "main-shaft",
    name: "Eje principal",
    description:
      "Eje de baja velocidad que conecta el cubo del rotor con la caja de engranajes, dentro de la góndola.",
    getRpm: (t: TelemetrySnapshot) => t.mainShaftRpm,
  },
  "transmission-disc": {
    id: "transmission-disc",
    name: "Disco de transmisión",
    description: "Disco metálico montado sobre el eje principal que estabiliza el giro antes de la caja de engranajes.",
    getRpm: (t: TelemetrySnapshot) => t.mainShaftRpm,
  },
  "gear-main": {
    id: "gear-main",
    name: "Engranaje principal",
    description: "Engranaje grande conectado al eje principal; transmite el movimiento hacia el sistema de aumento de velocidad.",
    getRpm: (t: TelemetrySnapshot) => t.mainShaftRpm,
  },
  "gear-intermediate": {
    id: "gear-intermediate",
    name: "Engranaje intermedio",
    description: "Etapa intermedia de la caja de engranajes; incrementa la velocidad entre el engranaje principal y el secundario.",
    getRpm: (t: TelemetrySnapshot) => t.mainShaftRpm * 6.5,
  },
  "gear-small": {
    id: "gear-small",
    name: "Engranaje secundario",
    description: "Engranaje pequeño conectado al eje de alta velocidad; entrega el giro final al generador.",
    getRpm: (t: TelemetrySnapshot) => t.secondaryShaftRpm,
  },
  "secondary-shaft": {
    id: "secondary-shaft",
    name: "Eje secundario",
    description: "Eje de alta velocidad que conecta la caja de engranajes con el generador eléctrico.",
    getRpm: (t: TelemetrySnapshot) => t.secondaryShaftRpm,
  },
  generator: {
    id: "generator",
    name: "Generador",
    description: "Convierte la energía mecánica de rotación en energía eléctrica mediante inducción electromagnética.",
    getRpm: (t: TelemetrySnapshot) => t.generatorRpm,
  },
};