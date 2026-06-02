import type { MeshStandardMaterialParameters } from "three";

export const palette = {
  background: "#F7F5F2",
  surface: "#F2ECE4",
  surfaceSoft: "#E9E1D7",
  ink: "#211D18",
  muted: "#6F655D",
  line: "rgba(61, 48, 38, 0.12)",
  shadow: "#B9A996",
  sky: "#6B98B5",
  clay: "#C8857B",
  honey: "#D2926F",
} as const;

export const materials = {
  shell: {
    color: palette.surface,
    roughness: 0.78,
    metalness: 0.03,
    envMapIntensity: 0.7,
  },
  shellDeep: {
    color: palette.surfaceSoft,
    roughness: 0.82,
    metalness: 0.02,
    envMapIntensity: 0.55,
  },
  accentSky: {
    color: palette.sky,
    roughness: 0.48,
    metalness: 0.04,
    envMapIntensity: 0.52,
  },
  accentClay: {
    color: palette.clay,
    roughness: 0.5,
    metalness: 0.04,
    envMapIntensity: 0.52,
  },
  accentHoney: {
    color: palette.honey,
    roughness: 0.46,
    metalness: 0.04,
    envMapIntensity: 0.52,
  },
  detail: {
    color: "#B4A79B",
    roughness: 0.68,
    metalness: 0.02,
    envMapIntensity: 0.48,
  },
  indicator: {
    color: "#F8E6D6",
    roughness: 0.35,
    metalness: 0.03,
    emissive: "#E7B88E",
    emissiveIntensity: 0.1,
  },
  glowSky: {
    color: palette.sky,
    roughness: 0.3,
    metalness: 0.02,
    emissive: palette.sky,
    emissiveIntensity: 0.16,
  },
  glowClay: {
    color: palette.clay,
    roughness: 0.3,
    metalness: 0.02,
    emissive: palette.clay,
    emissiveIntensity: 0.16,
  },
  glowHoney: {
    color: palette.honey,
    roughness: 0.3,
    metalness: 0.02,
    emissive: palette.honey,
    emissiveIntensity: 0.16,
  },
} satisfies Record<string, MeshStandardMaterialParameters>;

export const sceneSurfaces = {
  canvas: palette.background,
  warm: "#F4EFE8",
  sand: "#F3EBDD",
  rose: "#F5E8E2",
} as const;
