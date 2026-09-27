import React from "react";
import { darkMetalMaterial, accentTealMaterial } from "./materials";
import { GENERATOR_LENGTH, GENERATOR_RADIUS } from "./dimensions";

interface GeneratorProps {
  positionX: number;
  positionZ: number;
  onSelect: () => void;
  highlighted: boolean;
  rotorGroupRef: React.MutableRefObject<import("three").Group | null>;
}

export function Generator({ positionX, positionZ, onSelect, highlighted, rotorGroupRef }: GeneratorProps) {
  return (
    <group position={[positionX, 0, positionZ]}>
      {/* Carcasa exterior del generador */}
      <mesh
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      >
        <cylinderGeometry args={[GENERATOR_RADIUS, GENERATOR_RADIUS, GENERATOR_LENGTH, 24]} />
        {highlighted ? (
          <meshStandardMaterial color="#3ED6C4" emissive="#3ED6C4" emissiveIntensity={0.45} metalness={0.7} roughness={0.35} />
        ) : (
          <primitive attach="material" object={darkMetalMaterial} />
        )}
      </mesh>

      {/* Aletas de refrigeración */}
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh key={i} position={[0, 0, -GENERATOR_LENGTH / 2 + (i + 0.5) * (GENERATOR_LENGTH / 10)]}>
          <torusGeometry args={[GENERATOR_RADIUS * 1.03, 0.03, 6, 24]} />
          <meshStandardMaterial color="#232A33" metalness={0.6} roughness={0.5} />
        </mesh>
      ))}

      {/* Rotor interno visible (representación simplificada) */}
      <group ref={rotorGroupRef}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[GENERATOR_RADIUS * 0.55, GENERATOR_RADIUS * 0.55, GENERATOR_LENGTH * 0.85, 16]} />
          <primitive attach="material" object={accentTealMaterial} />
        </mesh>
      </group>
    </group>
  );
}