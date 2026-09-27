import React from "react";
import { whiteShellMaterial, glassShellMaterial } from "./materials";
import { NACELLE_LENGTH, NACELLE_RADIUS } from "./dimensions";
import { ViewMode } from "../../simulation/simulationTypes";

interface NacelleShellProps {
  viewMode: ViewMode;
}

/**
 * Carcasa aerodinámica de la góndola. Según el modo de vista:
 * - exterior: carcasa blanca opaca completa
 * - interior: la carcasa desaparece por completo
 * - corte: mitad superior visible en blanco, mitad inferior recortada (transparente)
 * - transmision: carcasa muy transparente (vidrio) para enfocar la cámara en el tren motriz
 */
export function NacelleShell({ viewMode }: NacelleShellProps) {
  if (viewMode === "interior") return null;

  if (viewMode === "corte") {
    return (
      <group>
        {/* Mitad superior sólida */}
        <mesh position={[0, 0.05, 0]} material={whiteShellMaterial} castShadow>
          <sphereGeometry
            args={[NACELLE_RADIUS, 20, 16, 0, Math.PI * 2, 0, Math.PI / 2]}
          />
        </mesh>
        <mesh
          position={[0, 0.05, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[1, 1, NACELLE_LENGTH / (NACELLE_RADIUS * 2)]}
          material={whiteShellMaterial}
        >
          <cylinderGeometry args={[NACELLE_RADIUS, NACELLE_RADIUS, NACELLE_RADIUS * 2, 20, 1, true, 0, Math.PI]} />
        </mesh>
        {/* Mitad inferior transparente para dejar ver el mecanismo */}
        <mesh
          position={[0, 0.05, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[1, 1, NACELLE_LENGTH / (NACELLE_RADIUS * 2)]}
          material={glassShellMaterial}
        >
          <cylinderGeometry args={[NACELLE_RADIUS, NACELLE_RADIUS, NACELLE_RADIUS * 2, 20, 1, true, Math.PI, Math.PI]} />
        </mesh>
      </group>
    );
  }

  const material = viewMode === "transmision" ? glassShellMaterial : whiteShellMaterial;

  return (
    <group>
      {/* Cuerpo principal capsular */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} material={material} castShadow={viewMode === "exterior"}>
        <capsuleGeometry args={[NACELLE_RADIUS, NACELLE_LENGTH - NACELLE_RADIUS * 2, 8, 20]} />
      </mesh>
    </group>
  );
}