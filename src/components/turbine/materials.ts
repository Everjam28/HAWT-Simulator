import * as THREE from "three";

export const whiteShellMaterial = new THREE.MeshStandardMaterial({
  color: "#F2F4F7",
  roughness: 0.42,
  metalness: 0.08,
});

export const lightGrayMaterial = new THREE.MeshStandardMaterial({
  color: "#D7DCE3",
  roughness: 0.5,
  metalness: 0.1,
});

export const metallicGrayMaterial = new THREE.MeshStandardMaterial({
  color: "#8B94A1",
  roughness: 0.35,
  metalness: 0.75,
});

export const darkMetalMaterial = new THREE.MeshStandardMaterial({
  color: "#3A424E",
  roughness: 0.32,
  metalness: 0.85,
});

export const steelShaftMaterial = new THREE.MeshStandardMaterial({
  color: "#B8BFC9",
  roughness: 0.28,
  metalness: 0.9,
});

export const accentTealMaterial = new THREE.MeshStandardMaterial({
  color: "#3ED6C4",
  roughness: 0.4,
  metalness: 0.3,
  emissive: new THREE.Color("#0d3b36"),
  emissiveIntensity: 0.4,
});

export const glassShellMaterial = new THREE.MeshPhysicalMaterial({
  color: "#EAF4F2",
  roughness: 0.15,
  metalness: 0,
  transmission: 0.92,
  thickness: 0.4,
  transparent: true,
  opacity: 0.28,
  depthWrite: false,
});

export const selectionHighlightMaterial = new THREE.MeshStandardMaterial({
  color: "#3ED6C4",
  emissive: new THREE.Color("#3ED6C4"),
  emissiveIntensity: 0.6,
  roughness: 0.3,
  metalness: 0.4,
});