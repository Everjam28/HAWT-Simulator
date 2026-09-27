import React from "react";
import * as THREE from "three";
import { steelShaftMaterial } from "./materials";
import { SECONDARY_SHAFT_LENGTH, SECONDARY_SHAFT_RADIUS } from "./dimensions";

interface SecondaryShaftProps {
  positionX: number;
  positionZ: number;
  onSelect: () => void;
  highlighted: boolean;
  groupRef?: React.MutableRefObject<THREE.Group | null>;
}

export function SecondaryShaft({ positionX, positionZ, onSelect, highlighted, groupRef }: SecondaryShaftProps) {
  return (
    <group ref={groupRef} position={[positionX, 0, positionZ]}>
      <mesh
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      >
        <cylinderGeometry args={[SECONDARY_SHAFT_RADIUS, SECONDARY_SHAFT_RADIUS, SECONDARY_SHAFT_LENGTH, 16]} />
        {highlighted ? (
          <meshStandardMaterial color="#3ED6C4" emissive="#3ED6C4" emissiveIntensity={0.5} metalness={0.8} roughness={0.25} />
        ) : (
          <primitive attach="material" object={steelShaftMaterial} />
        )}
      </mesh>
    </group>
  );
}