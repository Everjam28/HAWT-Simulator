import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Tower } from "./Tower";
import { NacelleShell } from "./Nacelle";
import { Hub } from "./Hub";
import { MainShaft } from "./MainShaft";
import { TransmissionDisc } from "./TransmissionDisc";
import { Gearbox } from "./Gearbox";
import { SecondaryShaft } from "./SecondaryShaft";
import { Generator } from "./Generator";
import { Labels3D } from "./Labels3D";
import { useSimulation } from "../../simulation/SimulationContext";
import { COMPONENT_INFO } from "./componentInfo";
import {
  GEAR_SMALL_RADIUS,
  GEAR_INTERMEDIATE_RADIUS,
  GEAR_MAIN_RADIUS,
  MAIN_SHAFT_LENGTH,
  NACELLE_CENTER_HEIGHT,
  NACELLE_LENGTH,
  SECONDARY_SHAFT_LENGTH,
  GENERATOR_LENGTH,
  TRANSMISSION_DISC_RADIUS,
} from "./dimensions";

const INTERMEDIATE_OFFSET_X = GEAR_MAIN_RADIUS + GEAR_INTERMEDIATE_RADIUS - 0.08;
const SMALL_OFFSET_X = INTERMEDIATE_OFFSET_X + GEAR_INTERMEDIATE_RADIUS + GEAR_SMALL_RADIUS - 0.06;

export function Turbine() {
  const { inputs, viewMode, rotationRef, selectedComponent, selectComponent, showLabels } = useSimulation();

  // Refs de los grupos que giran a la velocidad del eje principal (rotor)
  const hubGroupRef = useRef<THREE.Group>(null);
  const mainShaftGroupRef = useRef<THREE.Group>(null);
  const discGroupRef = useRef<THREE.Group>(null);
  const mainGearRef = useRef<THREE.Group>(null);

  // Ref del engranaje intermedio (sentido de giro opuesto)
  const intermediateGearRef = useRef<THREE.Group>(null);

  // Refs de los grupos que giran a la velocidad del eje secundario (alta velocidad)
  const smallGearRef = useRef<THREE.Group>(null);
  const secondaryShaftGroupRef = useRef<THREE.Group>(null);
  const generatorRotorRef = useRef<THREE.Group>(null);

  const nacelleFrontZ = NACELLE_LENGTH / 2;
  const shaftBaseZ = nacelleFrontZ - MAIN_SHAFT_LENGTH;
  const discZ = nacelleFrontZ - MAIN_SHAFT_LENGTH * 0.32;
  const gearboxZ = shaftBaseZ - 0.55;
  const secondaryShaftZ = gearboxZ - SECONDARY_SHAFT_LENGTH / 2 - 0.35;
  const generatorZ = secondaryShaftZ - SECONDARY_SHAFT_LENGTH / 2 - GENERATOR_LENGTH / 2 - 0.1;

  useFrame(() => {
    const r = rotationRef.current;
    if (hubGroupRef.current) hubGroupRef.current.rotation.z = r.rotor;
    if (mainShaftGroupRef.current) mainShaftGroupRef.current.rotation.z = r.rotor;
    if (discGroupRef.current) discGroupRef.current.rotation.z = r.rotor;
    if (mainGearRef.current) mainGearRef.current.rotation.z = r.rotor;

    if (intermediateGearRef.current) intermediateGearRef.current.rotation.z = r.gearIntermediate;

    if (smallGearRef.current) smallGearRef.current.rotation.z = r.secondary;
    if (secondaryShaftGroupRef.current) secondaryShaftGroupRef.current.rotation.z = r.secondary;
    if (generatorRotorRef.current) generatorRotorRef.current.rotation.z = r.secondary;
  });

  const handleSelect = (id: string) => {
    const info = COMPONENT_INFO[id];
    if (info) selectComponent(info);
  };

  const showInternals = viewMode === "interior" || viewMode === "corte" || viewMode === "transmision";
  const showExteriorShell = viewMode !== "transmision";
  const showHubBlades = viewMode !== "transmision";

  const labels = [
    {
      id: "main-shaft",
      text: "Eje principal",
      position: [0, 0.5, nacelleFrontZ - MAIN_SHAFT_LENGTH * 0.65] as [number, number, number],
    },
    {
      id: "transmission-disc",
      text: "Disco de transmisión",
      position: [0, TRANSMISSION_DISC_RADIUS + 0.3, discZ] as [number, number, number],
    },
    {
      id: "gear-main",
      text: "Engranaje principal",
      position: [0, GEAR_MAIN_RADIUS + 0.35, gearboxZ] as [number, number, number],
    },
    {
      id: "gear-intermediate",
      text: "Engranaje intermedio",
      position: [INTERMEDIATE_OFFSET_X, GEAR_INTERMEDIATE_RADIUS + 0.3, gearboxZ] as [number, number, number],
    },
    {
      id: "gear-small",
      text: "Engranaje secundario",
      position: [SMALL_OFFSET_X, GEAR_SMALL_RADIUS + 0.3, gearboxZ] as [number, number, number],
    },
    {
      id: "secondary-shaft",
      text: "Eje secundario",
      position: [SMALL_OFFSET_X, 0.35, secondaryShaftZ] as [number, number, number],
    },
    { id: "generator", text: "Generador", position: [SMALL_OFFSET_X, 0.95, generatorZ] as [number, number, number] },
  ];

  return (
    <group>
      <Tower />

      {/* Grupo de la góndola completa, montado en la parte superior de la torre */}
      <group position={[0, NACELLE_CENTER_HEIGHT, 0]}>
        {showExteriorShell && <NacelleShell viewMode={viewMode} />}

        {showHubBlades && (
          <group position={[0, 0, nacelleFrontZ + 0.25]}>
            <Hub
              rotorRadius={inputs.rotorRadius}
              onSelect={handleSelect}
              highlighted={selectedComponent?.id === "hub"}
              groupRef={hubGroupRef}
            />
          </group>
        )}

        {showInternals && (
          <>
            <MainShaft
              baseZ={shaftBaseZ}
              onSelect={() => handleSelect("main-shaft")}
              highlighted={selectedComponent?.id === "main-shaft"}
              groupRef={mainShaftGroupRef}
            />
            <TransmissionDisc
              positionZ={discZ}
              onSelect={() => handleSelect("transmission-disc")}
              highlighted={selectedComponent?.id === "transmission-disc"}
              groupRef={discGroupRef}
            />
            <Gearbox
              positionZ={gearboxZ}
              mainGearRef={mainGearRef}
              intermediateGearRef={intermediateGearRef}
              smallGearRef={smallGearRef}
              onSelect={handleSelect}
              highlightedId={selectedComponent?.id ?? null}
            />
            <SecondaryShaft
              positionX={SMALL_OFFSET_X}
              positionZ={secondaryShaftZ}
              onSelect={() => handleSelect("secondary-shaft")}
              highlighted={selectedComponent?.id === "secondary-shaft"}
              groupRef={secondaryShaftGroupRef}
            />
            <Generator
              positionX={SMALL_OFFSET_X}
              positionZ={generatorZ}
              onSelect={() => handleSelect("generator")}
              highlighted={selectedComponent?.id === "generator"}
              rotorGroupRef={generatorRotorRef}
            />
          </>
        )}

        <Labels3D viewMode={viewMode} labels={labels} visible={showLabels} />
      </group>
    </group>
  );
}