import React, { useMemo } from "react";
import { createBladeGeometry } from "./bladeGeometry";
import { whiteShellMaterial } from "./materials";

interface BladeProps {
  rotorRadius: number; // radio total del rotor (metros) - controla la longitud del aspa
  hubRadius: number;
}

export function Blade({ rotorRadius, hubRadius }: BladeProps) {
  const span = Math.max(rotorRadius - hubRadius * 0.9, 1);

  const geometry = useMemo(
    () =>
      createBladeGeometry({
        length: span,
        rootChord: Math.max(span * 0.14, 0.9),
        tipChord: Math.max(span * 0.035, 0.18),
        rootThickness: 0.24,
        tipThickness: 0.09,
        rootTwistDeg: 14,
        tipTwistDeg: -4,
      }),
    [span]
  );

  return (
    <mesh geometry={geometry} position={[0, hubRadius * 0.85, 0]} material={whiteShellMaterial} castShadow receiveShadow />
  );
}