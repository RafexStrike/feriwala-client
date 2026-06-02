"use client";

import { useFrame } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { memo, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { animation } from "@/config/animations";
import { materials, palette } from "@/config/materials";

export type PrimitiveScale = number | [number, number, number];
export type PrimitiveVector3 = [number, number, number];

export type PrimitiveAnimation = {
  floatAmplitude?: number;
  floatSpeed?: number;
  orbitSpeed?: number;
  rotationSpeed?: number;
  wobbleAmplitude?: number;
  wobbleSpeed?: number;
  phase?: number;
};

export type PrimitiveColors = {
  bodyColor?: string;
  accentColor?: string;
  detailColor?: string;
};

export type PrimitiveProps = PrimitiveColors & {
  scale?: PrimitiveScale;
  position?: PrimitiveVector3;
  rotation?: PrimitiveVector3;
  animation?: PrimitiveAnimation;
};

type PrimitiveRigProps = Pick<PrimitiveProps, "scale" | "position" | "rotation" | "animation"> & {
  children: ReactNode;
};

export function usePrimitiveColor(baseColor: string | undefined, fallbackColor: string) {
  return useMemo(() => baseColor ?? fallbackColor, [baseColor, fallbackColor]);
}

export const PrimitiveRig = memo(function PrimitiveRig({
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  animation: motionOverrides,
  children,
}: PrimitiveRigProps) {
  const reducedMotion = useReducedMotion();
  const group = useRef<THREE.Group>(null);
  const basePosition = useRef<PrimitiveVector3>(position);
  const baseRotation = useRef<PrimitiveVector3>(rotation);

  useEffect(() => {
    basePosition.current = position;
  }, [position]);

  useEffect(() => {
    baseRotation.current = rotation;
  }, [rotation]);

  const motion = useMemo(
    () => ({
      floatAmplitude: motionOverrides?.floatAmplitude ?? animation.primitives.floatAmplitude.desktop,
      floatSpeed: motionOverrides?.floatSpeed ?? animation.primitives.floatSpeed,
      orbitSpeed: motionOverrides?.orbitSpeed ?? animation.primitives.orbitSpeed,
      rotationSpeed: motionOverrides?.rotationSpeed ?? animation.primitives.rotationSpeed,
      wobbleAmplitude: motionOverrides?.wobbleAmplitude ?? animation.primitives.wobbleAmplitude,
      wobbleSpeed: motionOverrides?.wobbleSpeed ?? animation.primitives.wobbleSpeed,
      phase: motionOverrides?.phase ?? 0,
    }),
    [motionOverrides],
  );

  useFrame(({ clock }) => {
    if (!group.current) return;

    const time = clock.elapsedTime + motion.phase;
    const motionScale = reducedMotion ? animation.primitives.reducedMotionMultiplier : 1;

    group.current.position.set(
      basePosition.current[0] + Math.sin(time * motion.floatSpeed) * motion.floatAmplitude * motionScale,
      basePosition.current[1] + Math.cos(time * motion.floatSpeed * 0.86) * motion.floatAmplitude * 0.72 * motionScale,
      basePosition.current[2] + Math.sin(time * motion.floatSpeed * 0.62) * motion.floatAmplitude * 0.25 * motionScale,
    );

    group.current.rotation.set(
      baseRotation.current[0] + Math.sin(time * motion.rotationSpeed) * motion.wobbleAmplitude * 0.42 * motionScale,
      baseRotation.current[1] + time * motion.orbitSpeed * motionScale,
      baseRotation.current[2] + Math.cos(time * motion.wobbleSpeed) * motion.wobbleAmplitude * 0.28 * motionScale,
    );
  });

  return (
    <group ref={group} position={position} rotation={rotation} scale={scale}>
      {children}
    </group>
  );
});

export const primitiveMaterials = {
  shell: materials.shell,
  shellDeep: materials.shellDeep,
  accentSky: materials.accentSky,
  accentClay: materials.accentClay,
  accentHoney: materials.accentHoney,
  detail: materials.detail,
  indicator: materials.indicator,
  glowSky: materials.glowSky,
  glowClay: materials.glowClay,
  glowHoney: materials.glowHoney,
} as const;

export const scenePalette = palette;
