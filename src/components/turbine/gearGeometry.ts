import * as THREE from "three";

export interface GearGeometryOptions {
  radius: number;
  thickness: number;
  teeth?: number;
  toothDepthRatio?: number; // profundidad del diente relativa al radio
  boreRadius?: number; // radio del orificio central del eje
}

/**
 * Crea la geometría de un engranaje recto con dientes trapezoidales reales
 * (no un simple cilindro), mediante extrusión de una forma 2D dentada.
 */
export function createGearGeometry(opts: GearGeometryOptions): THREE.ExtrudeGeometry {
  const { radius, thickness, teeth = 16, toothDepthRatio = 0.12, boreRadius = radius * 0.28 } = opts;

  const outerRadius = radius;
  const innerRadius = radius * (1 - toothDepthRatio);
  const shape = new THREE.Shape();

  const anglePerTooth = (Math.PI * 2) / teeth;
  const toothWidthRatio = 0.5; // fracción del paso angular ocupada por la cresta del diente

  let started = false;
  for (let i = 0; i < teeth; i++) {
    const baseAngle = i * anglePerTooth;
    const a0 = baseAngle;
    const a1 = baseAngle + anglePerTooth * (0.5 - toothWidthRatio / 2);
    const a2 = baseAngle + anglePerTooth * (0.5 + toothWidthRatio / 2);
    const a3 = baseAngle + anglePerTooth;

    const p0 = [Math.cos(a0) * innerRadius, Math.sin(a0) * innerRadius];
    const p1 = [Math.cos(a1) * innerRadius, Math.sin(a1) * innerRadius];
    const p2 = [Math.cos(a1) * outerRadius, Math.sin(a1) * outerRadius];
    const p3 = [Math.cos(a2) * outerRadius, Math.sin(a2) * outerRadius];
    const p4 = [Math.cos(a2) * innerRadius, Math.sin(a2) * innerRadius];
    const p5 = [Math.cos(a3) * innerRadius, Math.sin(a3) * innerRadius];

    if (!started) {
      shape.moveTo(p0[0], p0[1]);
      started = true;
    }
    shape.lineTo(p1[0], p1[1]);
    shape.lineTo(p2[0], p2[1]);
    shape.lineTo(p3[0], p3[1]);
    shape.lineTo(p4[0], p4[1]);
    shape.lineTo(p5[0], p5[1]);
  }
  shape.closePath();

  if (boreRadius > 0) {
    const hole = new THREE.Path();
    hole.absarc(0, 0, boreRadius, 0, Math.PI * 2, true);
    shape.holes.push(hole);
  }

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: true,
    bevelThickness: thickness * 0.06,
    bevelSize: thickness * 0.04,
    bevelSegments: 1,
    curveSegments: 8,
  });
  // El engranaje queda extruido a lo largo de +Z, centrado en el origen.
  // La orientación final respecto al eje que representa se ajusta con la
  // rotación del componente que lo instancia (ver Gear.tsx / Gearbox.tsx).
  geometry.translate(0, 0, -thickness / 2);
  return geometry;
}