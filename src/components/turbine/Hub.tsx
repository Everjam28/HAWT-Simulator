import React from "react";
import * as THREE from "three";
import { whiteShellMaterial } from "./materials";
import { HUB_RADIUS } from "./dimensions";
import { Blade } from "./Blade";

interface HubProps {
  rotorRadius: number;
  onSelect: (id: string) => void;
  highlighted: boolean;
  groupRef?: React.MutableRefObject<THREE.Group | null>;
}

const BLADE_COUNT = 3;

export function Hub({ rotorRadius, onSelect, highlighted, groupRef }: HubProps) {
  return (
    <group
      ref={groupRef}
      onClick={(e) => {
        e.stopPropagation();
        onSelect("hub");
      }}
    >
      {/* Cubo central */}
      <mesh castShadow>
        <sphereGeometry args={[HUB_RADIUS, 20, 16]} />
        {highlighted ? (
          <meshStandardMaterial color="#3ED6C4" emissive="#3ED6C4" emissiveIntensity={0.5} />
        ) : (
          <primitive attach="material" object={whiteShellMaterial} />
        )}
      </mesh>
      {/* Cono de nariz */}
      <mesh position={[0, 0, HUB_RADIUS * 1.15]} rotation={[Math.PI / 2, 0, 0]} material={whiteShellMaterial}>
        <coneGeometry args={[HUB_RADIUS * 0.72, HUB_RADIUS * 1.5, 18]} />
      </mesh>

      {Array.from({ length: BLADE_COUNT }).map((_, i) => {
        const angle = (i * Math.PI * 2) / BLADE_COUNT;
        return (
          <group key={i} rotation={[0, 0, angle]}>
            <Blade rotorRadius={rotorRadius} hubRadius={HUB_RADIUS} />
          </group>
        );
      })}
    </group>
  );
}