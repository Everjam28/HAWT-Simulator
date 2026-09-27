import * as THREE from "three";

/**
 * Genera el perfil 2D de un aspa (semejante a un perfil NACA simétrico)
 * como una lista de puntos [x, z] alrededor de la cuerda, cerrada.
 * x = posición a lo largo de la cuerda (0 = borde de ataque, chord = borde de fuga)
 * z = espesor (perpendicular a la cuerda)
 */
function airfoilProfile(chord: number, thicknessRatio: number, pointsPerSide: number): [number, number][] {
  const upper: [number, number][] = [];
  const lower: [number, number][] = [];

  for (let i = 0; i <= pointsPerSide; i++) {
    const t = i / pointsPerSide; // 0..1 fracción de cuerda
    const x = t;
    // Distribución de espesor tipo NACA de 4 dígitos
    const yt =
      5 *
      thicknessRatio *
      (0.2969 * Math.sqrt(x) - 0.126 * x - 0.3516 * x * x + 0.2843 * x * x * x - 0.1015 * x * x * x * x);
    upper.push([x * chord, yt * chord]);
    lower.push([x * chord, -yt * chord]);
  }

  // Cerrar el contorno: borde de ataque -> superior -> borde de fuga -> inferior (invertido)
  const profile: [number, number][] = [...upper, ...lower.slice(1, -1).reverse()];
  return profile;
}

export interface BladeGeometryOptions {
  length: number; // envergadura total del aspa
  rootChord: number;
  tipChord: number;
  rootThickness: number; // relación espesor/cuerda en la raíz
  tipThickness: number;
  rootTwistDeg: number;
  tipTwistDeg: number;
  spanSegments?: number;
  chordPoints?: number; // puntos por lado del perfil
  pitchOffsetRatio?: number; // punto de la cuerda usado como eje de giro (0..1)
}

export function createBladeGeometry(opts: BladeGeometryOptions): THREE.BufferGeometry {
  const {
    length,
    rootChord,
    tipChord,
    rootThickness,
    tipThickness,
    rootTwistDeg,
    tipTwistDeg,
    spanSegments = 14,
    chordPoints = 8,
    pitchOffsetRatio = 0.32,
  } = opts;

  const ringCount = spanSegments + 1;
  const profileSample = airfoilProfile(1, 0.12, chordPoints);
  const ptsPerRing = profileSample.length;

  const positions: number[] = [];

  for (let ring = 0; ring < ringCount; ring++) {
    const s = ring / spanSegments; // 0 raíz .. 1 punta
    // Ahusamiento: interpolación no lineal para que se estreche progresivamente
    const taper = 1 - Math.pow(s, 1.35);
    const chord = THREE.MathUtils.lerp(tipChord, rootChord, taper);
    const thicknessRatio = THREE.MathUtils.lerp(tipThickness, rootThickness, taper);
    const twistDeg = THREE.MathUtils.lerp(rootTwistDeg, tipTwistDeg, s);
    const twistRad = THREE.MathUtils.degToRad(twistDeg);

    const profile = airfoilProfile(chord, thicknessRatio, chordPoints);
    const pitchOffset = chord * pitchOffsetRatio;

    const cosT = Math.cos(twistRad);
    const sinT = Math.sin(twistRad);

    const spanPos = s * length;

    for (let p = 0; p < ptsPerRing; p++) {
      const [px, pz] = profile[p];
      const cx = px - pitchOffset;
      // Rotar el perfil (torsión aerodinámica) alrededor del eje de envergadura (Y)
      const rx = cx * cosT - pz * sinT;
      const rz = cx * sinT + pz * cosT;
      positions.push(rx, spanPos, rz);
    }
  }

  const indices: number[] = [];
  for (let ring = 0; ring < ringCount - 1; ring++) {
    for (let p = 0; p < ptsPerRing; p++) {
      const a = ring * ptsPerRing + p;
      const b = ring * ptsPerRing + ((p + 1) % ptsPerRing);
      const c = (ring + 1) * ptsPerRing + p;
      const d = (ring + 1) * ptsPerRing + ((p + 1) % ptsPerRing);
      indices.push(a, c, b);
      indices.push(b, c, d);
    }
  }

  // Tapa de la raíz (fan triangulation)
  const rootCenterIndex = positions.length / 3;
  positions.push(0, 0, 0);
  for (let p = 0; p < ptsPerRing; p++) {
    const a = p;
    const b = (p + 1) % ptsPerRing;
    indices.push(rootCenterIndex, b, a);
  }

  // Tapa de la punta
  const tipRingStart = (ringCount - 1) * ptsPerRing;
  const tipCenterIndex = positions.length / 3;
  const tipSpanPos = length;
  positions.push(0, tipSpanPos, 0);
  for (let p = 0; p < ptsPerRing; p++) {
    const a = tipRingStart + p;
    const b = tipRingStart + ((p + 1) % ptsPerRing);
    indices.push(tipCenterIndex, a, b);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}