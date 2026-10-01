import React, { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Grid } from "@react-three/drei";
import { Turbine } from "../turbine/Turbine";
import { CameraController } from "./CameraController";
import { useSimulation } from "../../simulation/SimulationContext";
import { ComponentInfoPanel } from "../telemetry/ComponentInfoPanel";

export function Scene() {
  const controlsRef = useRef<any>(null);
  const { selectComponent } = useSimulation();

  return (
    <div className="relative h-full w-full">
      <Canvas
        shadows
        camera={{ position: [55, 45, 85], fov: 42, near: 0.5, far: 500 }}
        onPointerMissed={() => selectComponent(null)}
      >
        <color attach="background" args={["#0c141d"]} />
        <fog attach="fog" args={["#0c141d", 140, 320]} />

        <ambientLight intensity={0.55} />
        <directionalLight
          position={[60, 90, 40]}
          intensity={1.4}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-80}
          shadow-camera-right={80}
          shadow-camera-top={80}
          shadow-camera-bottom={-80}
          shadow-camera-far={260}
        />
        <directionalLight position={[-50, 30, -60]} intensity={0.35} color="#8fb4ff" />
        <hemisphereLight args={["#9db8d6", "#1a2230", 0.5]} />

        <Suspense fallback={null}>
          <Turbine />
        </Suspense>

        <Grid
          position={[0, 0.02, 0]}
          args={[300, 300]}
          cellSize={5}
          cellThickness={0.5}
          cellColor="#233045"
          sectionSize={25}
          sectionThickness={1}
          sectionColor="#33455f"
          fadeDistance={180}
          fadeStrength={1}
          infiniteGrid
        />
        <ContactShadows position={[0, 0.01, 0]} opacity={0.55} scale={140} blur={2.4} far={60} />

        <OrbitControls
          ref={controlsRef}
          makeDefault
          enableDamping
          dampingFactor={0.06}
          enablePan
          screenSpacePanning
          panSpeed={1}
          rotateSpeed={0.85}
          zoomSpeed={1}
          minDistance={0.8}
          maxDistance={280}
        />
        <CameraController controlsRef={controlsRef} />
      </Canvas>
      <ComponentInfoPanel />
    </div>
  );
}