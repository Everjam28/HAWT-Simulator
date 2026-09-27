import React from "react";
import { Html } from "@react-three/drei";
import { ViewMode } from "../../simulation/simulationTypes";

interface LabelDef {
  id: string;
  text: string;
  position: [number, number, number];
}

interface Labels3DProps {
  viewMode: ViewMode;
  labels: LabelDef[];
  visible: boolean;
}

export function Labels3D({ viewMode, labels, visible }: Labels3DProps) {
  if (viewMode === "exterior" || !visible) return null;

  return (
    <>
      {labels.map((label) => (
        <Html
          key={label.id}
          position={label.position}
          center
          distanceFactor={14}
          occlude={false}
          style={{ pointerEvents: "none" }}
        >
          <div className="whitespace-nowrap rounded border border-accent/40 bg-base-900/85 px-2 py-0.5 text-[10px] font-medium text-accent shadow-lg backdrop-blur-sm">
            {label.text}
          </div>
        </Html>
      ))}
    </>
  );
}