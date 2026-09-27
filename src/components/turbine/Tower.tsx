import React from "react";
import { whiteShellMaterial } from "./materials";
import { TOWER_BASE_RADIUS, TOWER_HEIGHT, TOWER_TOP_RADIUS } from "./dimensions";

export function Tower() {
  return (
    <group>
      {/* Base de cimentación */}
      <mesh position={[0, 0.4, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[TOWER_BASE_RADIUS * 1.55, TOWER_BASE_RADIUS * 1.75, 0.8, 28]} />
        <meshStandardMaterial color="#C7CDD6" roughness={0.7} metalness={0.05} />
      </mesh>

      {/* Torre cónica */}
      <mesh position={[0, TOWER_HEIGHT / 2 + 0.8, 0]} castShadow receiveShadow material={whiteShellMaterial}>
        <cylinderGeometry args={[TOWER_TOP_RADIUS, TOWER_BASE_RADIUS, TOWER_HEIGHT, 24, 1, false]} />
      </mesh>

      {/* Anillos de refuerzo visual */}
      {[0.25, 0.5, 0.75].map((f, i) => (
        <mesh key={i} position={[0, 0.8 + TOWER_HEIGHT * f, 0]}>
          <torusGeometry
            args={[TOWER_BASE_RADIUS + (TOWER_TOP_RADIUS - TOWER_BASE_RADIUS) * f + 0.02, 0.05, 8, 24]}
          />
          <meshStandardMaterial color="#C7CDD6" roughness={0.6} metalness={0.1} />
        </mesh>
      ))}
    </group>
  );
}