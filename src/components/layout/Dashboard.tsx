import React from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { Scene } from "../simulation/Scene";
import { TelemetryPanel } from "../telemetry/TelemetryPanel";

export function Dashboard() {
  return (
    <div className="flex h-screen w-screen flex-col bg-base-950">
      <Header />

      <div className="flex flex-1 flex-col overflow-hidden lg:flex-row">
        <Sidebar />

        <main className="flex flex-1 flex-col overflow-hidden">
          <div className="min-h-[280px] flex-1">
            <Scene />
          </div>

          <div className="max-h-[42vh] shrink-0 overflow-y-auto border-t border-base-700 bg-base-950 p-3">
            <TelemetryPanel />
          </div>
        </main>
      </div>
    </div>
  );
}