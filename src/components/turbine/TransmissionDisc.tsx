import React from "react";
import * as THREE from "three";
import { metallicGrayMaterial } from "./materials";
import { TRANSMISSION_DISC_RADIUS, TRANSMISSION_DISC_THICKNESS } from "./dimensions";

interface TransmissionDiscProps {
  positionZ: number;
  onSelect: () => void;
  highlighted: boolean;
  groupRef?: React.MutableRefObject<THREE.Group | null>;
}

export function TransmissionDisc({ positionZ, onSelect, highlighted, groupRef }: TransmissionDiscProps) {
  return (
    <group ref={groupRef} position={[0, 0, positionZ]}>
      <mesh
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      >
        <cylinderGeometry args={[TRANSMISSION_DISC_RADIUS, TRANSMISSION_DISC_RADIUS, TRANSMISSION_DISC_THICKNESS, 28]} />
        {highlighted ? (
          <meshStandardMaterial color="#3ED6C4" emissive="#3ED6C4" emissiveIntensity={0.5} metalness={0.7} roughness={0.3} />
        ) : (
          <primitive attach="material" object={metallicGrayMaterial} />
        )}
      </mesh>
    </group>
  );
}