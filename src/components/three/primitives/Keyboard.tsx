"use client";

import { memo, useMemo } from "react";
import { RoundedBox } from "@react-three/drei";
import { forwardRef } from "react";
import * as THREE from "three";
import { primitiveMaterials, PrimitiveRig, type PrimitiveProps, usePrimitiveColor } from "./shared";

type KeySpec = {
  position: [number, number, number];
  size: [number, number, number];
  rotation?: [number, number, number];
};

function Key({ position, size, rotation = [0, 0, 0], color }: KeySpec & { color: string }) {
  return (
    <RoundedBox args={size} radius={0.05} smoothness={5} position={position} rotation={rotation}>
      <meshStandardMaterial color={color} roughness={0.62} metalness={0.02} envMapIntensity={0.45} />
    </RoundedBox>
  );
}

function KeyboardComponent({ scale, position, rotation, bodyColor, accentColor, detailColor, animation }: PrimitiveProps, ref: React.ForwardedRef<THREE.Group>) {
  const shellColor = usePrimitiveColor(bodyColor, primitiveMaterials.shell.color);
  const keyColor = usePrimitiveColor(detailColor, "#D9D1C7");
  const accent = usePrimitiveColor(accentColor, primitiveMaterials.accentSky.color);

  const keys = useMemo<KeySpec[]>(
    () => [
      ...Array.from({ length: 12 }, (_, index) => ({
        position: [-0.82 + index * 0.15, 0.28, 0] as [number, number, number],
        size: [0.11, 0.05, 0.11 + (index % 3) * 0.008] as [number, number, number],
      })) as KeySpec[],
      ...Array.from({ length: 12 }, (_, index) => ({
        position: [-0.74 + index * 0.15, 0.08, 0] as [number, number, number],
        size: [0.11, 0.05, 0.108 + (index % 2) * 0.006] as [number, number, number],
      })) as KeySpec[],
      ...Array.from({ length: 11 }, (_, index) => ({
        position: [-0.66 + index * 0.15, -0.12, 0] as [number, number, number],
        size: [0.11, 0.05, 0.106 + (index % 4) * 0.005] as [number, number, number],
      })) as KeySpec[],
      { position: [-0.48, -0.33, 0], size: [0.24, 0.05, 0.11] as [number, number, number] },
      { position: [-0.16, -0.33, 0], size: [0.16, 0.05, 0.11] as [number, number, number] },
      { position: [0.09, -0.33, 0], size: [0.7, 0.05, 0.11] as [number, number, number] },
      { position: [0.58, -0.33, 0], size: [0.16, 0.05, 0.11] as [number, number, number] },
      { position: [0.81, -0.33, 0], size: [0.18, 0.05, 0.11] as [number, number, number] },
    ],
    [],
  );

  return (
    <PrimitiveRig ref={ref} scale={scale} position={position} rotation={rotation} animation={animation}>
      <group>
        <RoundedBox args={[2.55, 0.28, 1.02]} radius={0.18} smoothness={8}>
          <meshStandardMaterial color={shellColor} roughness={0.8} metalness={0.03} envMapIntensity={0.65} />
        </RoundedBox>
        <RoundedBox args={[2.38, 0.05, 0.88]} radius={0.08} smoothness={6} position={[0, 0.14, -0.02]}>
          <meshStandardMaterial color={accent} roughness={0.36} metalness={0.03} emissive={accent} emissiveIntensity={0.04} />
        </RoundedBox>
        <mesh position={[-1.03, 0.14, 0.34]}>
          <boxGeometry args={[0.14, 0.04, 0.11]} />
          <meshStandardMaterial color="#A89687" roughness={0.52} metalness={0.02} />
        </mesh>
        <mesh position={[-0.86, 0.14, 0.34]}>
          <boxGeometry args={[0.14, 0.04, 0.11]} />
          <meshStandardMaterial color="#A89687" roughness={0.52} metalness={0.02} />
        </mesh>
        <mesh position={[-0.69, 0.14, 0.34]}>
          <boxGeometry args={[0.14, 0.04, 0.11]} />
          <meshStandardMaterial color="#A89687" roughness={0.52} metalness={0.02} />
        </mesh>
        {keys.map((key, index) => (
          <Key key={index} {...key} color={keyColor} />
        ))}
      </group>
    </PrimitiveRig>
  );
}

export const Keyboard = memo(forwardRef(KeyboardComponent));

export type { PrimitiveProps as KeyboardProps };
