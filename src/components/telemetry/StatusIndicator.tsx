import React from "react";
import { SafetyState, TurbineOperationalState } from "../../simulation/simulationTypes";

interface OperationalBadgeProps {
  state: TurbineOperationalState;
}

const OPERATIONAL_META: Record<TurbineOperationalState, { label: string; dot: string; text: string; bg: string }> = {
  generando: { label: "Generando", dot: "bg-ok", text: "text-ok", bg: "bg-ok-soft" },
  "viento-bajo": { label: "Viento bajo", dot: "bg-warn", text: "text-warn", bg: "bg-warn-soft" },
  detenida: { label: "Turbina detenida", dot: "bg-danger", text: "text-danger", bg: "bg-danger-soft" },
};

export function OperationalStatusBadge({ state }: OperationalBadgeProps) {
  const meta = OPERATIONAL_META[state];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${meta.bg} ${meta.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot} status-dot-live`} />
      {meta.label}
    </span>
  );
}

interface SafetyBadgeProps {
  state: SafetyState;
}

const SAFETY_META: Record<SafetyState, { label: string; dot: string; text: string; bg: string }> = {
  normal: { label: "Operación normal", dot: "bg-ok", text: "text-ok", bg: "bg-ok-soft" },
  advertencia: { label: "Viento elevado", dot: "bg-warn", text: "text-warn", bg: "bg-warn-soft" },
  parada: { label: "Parada de seguridad", dot: "bg-danger", text: "text-danger", bg: "bg-danger-soft" },
};

export function SafetyStatusBadge({ state }: SafetyBadgeProps) {
  const meta = SAFETY_META[state];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${meta.bg} ${meta.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot} ${state !== "normal" ? "status-dot-live" : ""}`} />
      {meta.label}
    </span>
  );
}