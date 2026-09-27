import React from "react";
import * as THREE from "three";
import { Gear } from "./Gear";
import {
  GEAR_INTERMEDIATE_RADIUS,
  GEAR_MAIN_RADIUS,
  GEAR_SMALL_RADIUS,
  GEAR_THICKNESS,
} from "./dimensions";
import { darkMetalMaterial } from "./materials";

interface GearboxProps {
  positionZ: number;
  mainGearRef: React.MutableRefObject<THREE.Group | null>;
  intermediateGearRef: React.MutableRefObject<THREE.Group | null>;
  smallGearRef: React.MutableRefObject<THREE.Group | null>;
  onSelect: (id: string) => void;
  highlightedId: string | null;
}

// Desplazamiento del engranaje intermedio para que "engrane" visualmente
// con el grande y el pequeño (tangente a ambos radios)
const INTERMEDIATE_OFFSET_X = GEAR_MAIN_RADIUS + GEAR_INTERMEDIATE_RADIUS - 0.08;
const SMALL_OFFSET_X = INTERMEDIATE_OFFSET_X + GEAR_INTERMEDIATE_RADIUS + GEAR_SMALL_RADIUS - 0.06;

export function Gearbox({
  positionZ,
  mainGearRef,
  intermediateGearRef,
  smallGearRef,
  onSelect,
  highlightedId,
}: GearboxProps) {
  return (
    <group position={[0, 0, positionZ]}>
      {/* Carcasa abierta de la caja de engranajes (marco estructural) */}
      <mesh position={[SMALL_OFFSET_X * 0.35, 0, 0]}>
        <boxGeometry args={[SMALL_OFFSET_X + GEAR_SMALL_RADIUS + 0.3, GEAR_MAIN_RADIUS * 2.3, GEAR_THICKNESS * 2.6]} />
        <primitive attach="material" object={darkMetalMaterial} />
      </mesh>

      <group position={[0, 0, GEAR_THICKNESS * 1.5]}>
        <Gear
          radius={GEAR_MAIN_RADIUS}
          thickness={GEAR_THICKNESS}
          teeth={28}
          groupRef={mainGearRef}
          highlighted={highlightedId === "gear-main"}
          onSelect={() => onSelect("gear-main")}
        />
        <Gear
          radius={GEAR_INTERMEDIATE_RADIUS}
          thickness={GEAR_THICKNESS}
          teeth={18}
          position={[INTERMEDIATE_OFFSET_X, 0, 0]}
          groupRef={intermediateGearRef}
          highlighted={highlightedId === "gear-intermediate"}
          onSelect={() => onSelect("gear-intermediate")}
        />
        <Gear
          radius={GEAR_SMALL_RADIUS}
          thickness={GEAR_THICKNESS}
          teeth={10}
          position={[SMALL_OFFSET_X, 0, 0]}
          groupRef={smallGearRef}
          highlighted={highlightedId === "gear-small"}
          onSelect={() => onSelect("gear-small")}
        />
      </group>
    </group>
  );
}