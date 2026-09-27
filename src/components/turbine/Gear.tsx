import React, { useMemo } from "react";
import * as THREE from "three";
import { createGearGeometry } from "./gearGeometry";
import { metallicGrayMaterial } from "./materials";

interface GearProps {
  radius: number;
  thickness: number;
  teeth?: number;
  position?: [number, number, number];
  rotationRef?: React.MutableRefObject<number>;
  highlighted?: boolean;
  onSelect?: () => void;
  groupRef?: React.MutableRefObject<THREE.Group | null>;
}

export function Gear({ radius, thickness, teeth = 16, position = [0, 0, 0], highlighted, onSelect, groupRef }: GearProps) {
  const geometry = useMemo(() => createGearGeometry({ radius, thickness, teeth }), [radius, thickness, teeth]);

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.();
      }}
    >
      <mesh geometry={geometry} castShadow receiveShadow>
        {highlighted ? (
          <meshStandardMaterial color="#3ED6C4" emissive="#3ED6C4" emissiveIntensity={0.55} metalness={0.6} roughness={0.3} />
        ) : (
          <primitive attach="material" object={metallicGrayMaterial} />
        )}
      </mesh>
    </group>
  );
}