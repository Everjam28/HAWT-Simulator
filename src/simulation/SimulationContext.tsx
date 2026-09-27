import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { computeTelemetry } from "./physics";
import { DEFAULT_SIMULATION_INPUTS, MAX_CHART_POINTS, SCENARIOS, SLIDER_RANGES } from "./defaultSimulation";
import {
  CameraPreset,
  ChartPoint,
  ScenarioId,
  SelectedComponentInfo,
  SimulationInputs,
  TelemetrySnapshot,
  ViewMode,
} from "./simulationTypes";

interface RotationAngles {
  rotor: number; // rad, cubo + aspas + eje principal + disco
  secondary: number; // rad, eje secundario + generador
  gearMain: number; // rad, engranaje grande (misma velocidad que el rotor)
  gearIntermediate: number; // rad, engranaje intermedio (sentido opuesto)
  gearSmall: number; // rad, engranaje pequeño (misma velocidad que el eje secundario)
}

export interface ChartHistories {
  wind: ChartPoint[];
  rotorRpm: ChartPoint[];
  electricPower: ChartPoint[];
  generatorRpm: ChartPoint[];
}

interface SimulationContextValue {
  inputs: SimulationInputs;
  setInput: <K extends keyof SimulationInputs>(key: K, value: SimulationInputs[K]) => void;

  isRunning: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;

  timeScale: number;
  increaseSpeed: () => void;
  decreaseSpeed: () => void;

  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

  cameraPreset: CameraPreset;
  setCameraPreset: (preset: CameraPreset) => void;

  scenario: ScenarioId;
  applyScenario: (id: ScenarioId) => void;

  randomMode: boolean;
  toggleRandomMode: () => void;

  showLabels: boolean;
  toggleShowLabels: () => void;

  telemetry: TelemetrySnapshot;
  charts: ChartHistories;

  rotationRef: React.MutableRefObject<RotationAngles>;

  selectedComponent: SelectedComponentInfo | null;
  selectComponent: (info: SelectedComponentInfo | null) => void;
}

const SimulationContext = createContext<SimulationContextValue | null>(null);

const initialTelemetry = computeTelemetry(DEFAULT_SIMULATION_INPUTS, 0);

export function SimulationProvider({ children }: { children: React.ReactNode }) {
  const [inputs, setInputs] = useState<SimulationInputs>(DEFAULT_SIMULATION_INPUTS);
  const [isRunning, setIsRunning] = useState(false);
  const [timeScale, setTimeScale] = useState(1);
  const [viewMode, setViewModeState] = useState<ViewMode>("exterior");
  const [cameraPreset, setCameraPresetState] = useState<CameraPreset>("completa");
  const [scenario, setScenario] = useState<ScenarioId>("normal");
  const [randomMode, setRandomMode] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [telemetry, setTelemetry] = useState<TelemetrySnapshot>(initialTelemetry);
  const [charts, setCharts] = useState<ChartHistories>({
    wind: [],
    rotorRpm: [],
    electricPower: [],
    generatorRpm: [],
  });
  const [selectedComponent, setSelectedComponent] = useState<SelectedComponentInfo | null>(null);

  // Refs para el bucle de animación de alta frecuencia (no provocan re-render de React)
  const inputsRef = useRef(inputs);
  inputsRef.current = inputs;

  const isRunningRef = useRef(isRunning);
  isRunningRef.current = isRunning;

  const timeScaleRef = useRef(timeScale);
  timeScaleRef.current = timeScale;

  const scenarioRef = useRef(scenario);
  scenarioRef.current = scenario;

  const randomModeRef = useRef(randomMode);
  randomModeRef.current = randomMode;

  const randomTargetsRef = useRef<SimulationInputs>({ ...DEFAULT_SIMULATION_INPUTS });
  const randomRetimeRef = useRef(0);

  const elapsedRef = useRef(0);
  const lastFrameRef = useRef<number | null>(null);
  const uiThrottleRef = useRef(0);
  const variablePhaseRef = useRef(0);

  const rotationRef = useRef<RotationAngles>({
    rotor: 0,
    secondary: 0,
    gearMain: 0,
    gearIntermediate: 0,
    gearSmall: 0,
  });

  const rafIdRef = useRef<number | null>(null);

  const tick = useCallback((now: number) => {
    if (lastFrameRef.current === null) lastFrameRef.current = now;
    const rawDt = (now - lastFrameRef.current) / 1000;
    lastFrameRef.current = now;
    const dt = Math.min(rawDt, 0.1); // evita saltos grandes si la pestaña se pausa

    if (isRunningRef.current) {
      const scaledDt = dt * timeScaleRef.current;
      elapsedRef.current += scaledDt;

      // Modo viento variable: modula la velocidad del viento automáticamente
      if (scenarioRef.current === "variable") {
        variablePhaseRef.current += scaledDt * 0.18;
        const base = 11.5;
        const amplitude = 8.5;
        const nextWind = Math.max(
          0,
          base + amplitude * Math.sin(variablePhaseRef.current) + 1.5 * Math.sin(variablePhaseRef.current * 2.7)
        );
        inputsRef.current = { ...inputsRef.current, windSpeed: Number(nextWind.toFixed(2)) };
      }

      // Modo aleatorio: todos los parámetros de entrada varían continuamente
      // hacia objetivos aleatorios, con una interpolación suave (random walk)
      if (randomModeRef.current) {
        randomRetimeRef.current -= scaledDt;
        if (randomRetimeRef.current <= 0) {
          randomRetimeRef.current = 2.5 + Math.random() * 2.5;
          const ranges = SLIDER_RANGES;
          randomTargetsRef.current = {
            windSpeed: ranges.windSpeed.min + Math.random() * (ranges.windSpeed.max - ranges.windSpeed.min),
            airDensity: ranges.airDensity.min + Math.random() * (ranges.airDensity.max - ranges.airDensity.min),
            powerCoefficient:
              ranges.powerCoefficient.min + Math.random() * (ranges.powerCoefficient.max - ranges.powerCoefficient.min),
            transmissionEfficiency:
              ranges.transmissionEfficiency.min +
              Math.random() * (ranges.transmissionEfficiency.max - ranges.transmissionEfficiency.min),
            generatorEfficiency:
              ranges.generatorEfficiency.min +
              Math.random() * (ranges.generatorEfficiency.max - ranges.generatorEfficiency.min),
            rotorRadius: ranges.rotorRadius.min + Math.random() * (ranges.rotorRadius.max - ranges.rotorRadius.min),
          };
        }
        const lerpRate = Math.min(scaledDt * 0.6, 1);
        const target = randomTargetsRef.current;
        const cur = inputsRef.current;
        inputsRef.current = {
          windSpeed: cur.windSpeed + (target.windSpeed - cur.windSpeed) * lerpRate,
          airDensity: cur.airDensity + (target.airDensity - cur.airDensity) * lerpRate,
          powerCoefficient: cur.powerCoefficient + (target.powerCoefficient - cur.powerCoefficient) * lerpRate,
          transmissionEfficiency:
            cur.transmissionEfficiency + (target.transmissionEfficiency - cur.transmissionEfficiency) * lerpRate,
          generatorEfficiency:
            cur.generatorEfficiency + (target.generatorEfficiency - cur.generatorEfficiency) * lerpRate,
          rotorRadius: cur.rotorRadius + (target.rotorRadius - cur.rotorRadius) * lerpRate,
        };
      }

      const snapshot = computeTelemetry(inputsRef.current, elapsedRef.current);

      // Integrar ángulos de rotación (rad = rpm * 2π/60 * dt)
      const rpmToRadPerSec = (2 * Math.PI) / 60;
      const r = rotationRef.current;
      r.rotor += snapshot.rotorRpm * rpmToRadPerSec * scaledDt;
      r.secondary += snapshot.secondaryShaftRpm * rpmToRadPerSec * scaledDt;
      r.gearMain = r.rotor;
      r.gearIntermediate -= snapshot.rotorRpm * rpmToRadPerSec * scaledDt * 1.6; // sentido opuesto, engranaje intermedio
      r.gearSmall = r.secondary;

      // Actualizar React state a una frecuencia moderada (para no saturar el render)
      uiThrottleRef.current += dt;
      if (uiThrottleRef.current >= 0.12) {
        uiThrottleRef.current = 0;
        setTelemetry(snapshot);
        if (scenarioRef.current === "variable" && !randomModeRef.current) {
          setInputs((prev) => ({ ...prev, windSpeed: inputsRef.current.windSpeed }));
        }
        if (randomModeRef.current) {
          setInputs({ ...inputsRef.current });
        }
        setCharts((prev) => {
          const push = (arr: ChartPoint[], value: number): ChartPoint[] => {
            const next = [...arr, { t: snapshot.time, value }];
            if (next.length > MAX_CHART_POINTS) next.shift();
            return next;
          };
          return {
            wind: push(prev.wind, snapshot.windSpeed),
            rotorRpm: push(prev.rotorRpm, snapshot.rotorRpm),
            electricPower: push(prev.electricPower, snapshot.electricPower),
            generatorRpm: push(prev.generatorRpm, snapshot.generatorRpm),
          };
        });
      }
    }

    rafIdRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    rafIdRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
    };
  }, [tick]);

  const setInput = useCallback(
    <K extends keyof SimulationInputs>(key: K, value: SimulationInputs[K]) => {
      setScenario("manual");
      setRandomMode(false);
      setInputs((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const start = useCallback(() => {
    lastFrameRef.current = null;
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => setIsRunning(false), []);

  const reset = useCallback(() => {
    setIsRunning(false);
    elapsedRef.current = 0;
    lastFrameRef.current = null;
    variablePhaseRef.current = 0;
    randomRetimeRef.current = 0;
    setRandomMode(false);
    rotationRef.current = { rotor: 0, secondary: 0, gearMain: 0, gearIntermediate: 0, gearSmall: 0 };
    setInputs(DEFAULT_SIMULATION_INPUTS);
    setScenario("normal");
    setTimeScale(1);
    setTelemetry(computeTelemetry(DEFAULT_SIMULATION_INPUTS, 0));
    setCharts({ wind: [], rotorRpm: [], electricPower: [], generatorRpm: [] });
  }, []);

  const increaseSpeed = useCallback(() => {
    setTimeScale((prev) => Math.min(prev * 2, 8));
  }, []);
  const decreaseSpeed = useCallback(() => {
    setTimeScale((prev) => Math.max(prev / 2, 0.25));
  }, []);

  const setViewMode = useCallback((mode: ViewMode) => {
    setViewModeState(mode);
    if (mode === "transmision") setCameraPresetState("interior");
    if (mode === "interior") setCameraPresetState("interior");
  }, []);

  const setCameraPreset = useCallback((preset: CameraPreset) => {
    setCameraPresetState(preset);
  }, []);

  const applyScenario = useCallback((id: ScenarioId) => {
    setScenario(id);
    setRandomMode(false);
    const def = SCENARIOS.find((s) => s.id === id);
    if (def && typeof def.windSpeed === "number") {
      setInputs((prev) => ({ ...prev, windSpeed: def.windSpeed as number }));
    }
  }, []);

  const toggleRandomMode = useCallback(() => {
    setRandomMode((prev) => {
      const next = !prev;
      if (next) {
        setScenario("manual");
        randomRetimeRef.current = 0; // fuerza a elegir nuevos objetivos de inmediato
      }
      return next;
    });
  }, []);

  const toggleShowLabels = useCallback(() => {
    setShowLabels((prev) => !prev);
  }, []);

  const selectComponent = useCallback((info: SelectedComponentInfo | null) => {
    setSelectedComponent(info);
  }, []);

  const value = useMemo<SimulationContextValue>(
    () => ({
      inputs,
      setInput,
      isRunning,
      start,
      pause,
      reset,
      timeScale,
      increaseSpeed,
      decreaseSpeed,
      viewMode,
      setViewMode,
      cameraPreset,
      setCameraPreset,
      scenario,
      applyScenario,
      randomMode,
      toggleRandomMode,
      showLabels,
      toggleShowLabels,
      telemetry,
      charts,
      rotationRef,
      selectedComponent,
      selectComponent,
    }),
    [
      inputs,
      setInput,
      isRunning,
      start,
      pause,
      reset,
      timeScale,
      increaseSpeed,
      decreaseSpeed,
      viewMode,
      setViewMode,
      cameraPreset,
      setCameraPreset,
      scenario,
      applyScenario,
      randomMode,
      toggleRandomMode,
      showLabels,
      toggleShowLabels,
      telemetry,
      charts,
      selectedComponent,
      selectComponent,
    ]
  );

  return <SimulationContext.Provider value={value}>{children}</SimulationContext.Provider>;
}

export function useSimulation(): SimulationContextValue {
  const ctx = useContext(SimulationContext);
  if (!ctx) throw new Error("useSimulation debe usarse dentro de SimulationProvider");
  return ctx;
}