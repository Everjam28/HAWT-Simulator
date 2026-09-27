import React from "react";
import * as THREE from "three";
import { steelShaftMaterial } from "./materials";
import { MAIN_SHAFT_LENGTH, MAIN_SHAFT_RADIUS } from "./dimensions";

interface MainShaftProps {
  onSelect: () => void;
  highlighted: boolean;
  groupRef?: React.MutableRefObject<THREE.Group | null>;
  baseZ: number;
}

export function MainShaft({ onSelect, highlighted, groupRef, baseZ }: MainShaftProps) {
  return (
    <group ref={groupRef} position={[0, 0, baseZ]}>
      <mesh
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, MAIN_SHAFT_LENGTH / 2]}
        castShadow
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      >
        <cylinderGeometry args={[MAIN_SHAFT_RADIUS, MAIN_SHAFT_RADIUS, MAIN_SHAFT_LENGTH, 20]} />
        {highlighted ? (
          <meshStandardMaterial color="#3ED6C4" emissive="#3ED6C4" emissiveIntensity={0.5} metalness={0.8} roughness={0.25} />
        ) : (
          <primitive attach="material" object={steelShaftMaterial} />
        )}
      </mesh>
    </group>
  );
}