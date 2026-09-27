import React, { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useSimulation } from "../../simulation/SimulationContext";
import { NACELLE_CENTER_HEIGHT, NACELLE_LENGTH } from "../turbine/dimensions";

interface CameraControllerProps {
  // Ref al componente <OrbitControls> de @react-three/drei (tipado como any
  // para evitar depender directamente del paquete transitivo three-stdlib).
  controlsRef: React.MutableRefObject<any>;
}

const H = NACELLE_CENTER_HEIGHT;
const FRONT_Z = NACELLE_LENGTH / 2;

const PRESETS: Record<string, { position: [number, number, number]; target: [number, number, number] }> = {
  completa: { position: [55, H * 0.75, 85], target: [0, H * 0.55, 0] },
  frontal: { position: [0, H, FRONT_Z + 60], target: [0, H, 0] },
  lateral: { position: [70, H, 0], target: [0, H, 0] },
  superior: { position: [0.1, H + 60, 0.1], target: [0, H, 0] },
  interior: { position: [8, H + 2, -6], target: [0, H, -8] },
};

export function CameraController({ controlsRef }: CameraControllerProps) {
  const { camera } = useThree();
  const { cameraPreset } = useSimulation();
  const transitioning = useRef(true);
  const listenerAttached = useRef(false);
  const targetPos = useRef(new THREE.Vector3(...PRESETS.completa.position));
  const targetLook = useRef(new THREE.Vector3(...PRESETS.completa.target));

  useEffect(() => {
    const preset = PRESETS[cameraPreset] ?? PRESETS.completa;
    targetPos.current.set(...preset.position);
    targetLook.current.set(...preset.target);
    transitioning.current = true;
  }, [cameraPreset]);

  useFrame(() => {
    // En cuanto el usuario arrastra manualmente, cede el control por completo
    // (cancela cualquier transición automática hacia un preset de cámara).
    if (!listenerAttached.current && controlsRef.current) {
      controlsRef.current.addEventListener("start", () => {
        transitioning.current = false;
      });
      listenerAttached.current = true;
    }

    if (!transitioning.current) return;
    camera.position.lerp(targetPos.current, 0.06);

    const controls = controlsRef.current;
    if (controls) {
      controls.target.lerp(targetLook.current, 0.06);
      controls.update();
    } else {
      camera.lookAt(targetLook.current);
    }

    const distToTarget = camera.position.distanceTo(targetPos.current);
    if (distToTarget < 0.15) {
      transitioning.current = false;
    }
  });

  return null;
}