import React from "react";
import { ControlPanel } from "../controls/ControlPanel";
import { PlaybackControls } from "../controls/PlaybackControls";
import { ViewControls } from "../controls/ViewControls";
import { CameraControls } from "../controls/CameraControls";
import { ScenarioControls } from "../controls/ScenarioControls";
import { SimulinkImportControls } from "../controls/SimulinkImportControls";

export function Sidebar() {
  return (
    <aside className="w-full shrink-0 space-y-3 overflow-y-auto border-b border-base-700 bg-base-950 p-3 lg:w-80 lg:border-b-0 lg:border-r">
      <ControlPanel />
      <PlaybackControls />
      <ViewControls />
      <CameraControls />
      <ScenarioControls />
      <SimulinkImportControls />
    </aside>
  );
}