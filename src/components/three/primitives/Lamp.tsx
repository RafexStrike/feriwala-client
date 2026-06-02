"use client";

import { memo } from "react";
import { RoundedBox } from "@react-three/drei";
import { forwardRef } from "react";
import * as THREE from "three";
import { PrimitiveRig, primitiveMaterials, type PrimitiveProps, usePrimitiveColor } from "./shared";

function LampComponent({ scale, position, rotation, bodyColor, accentColor, detailColor, animation }: PrimitiveProps, ref: React.ForwardedRef<THREE.Group>) {
  const shellColor = usePrimitiveColor(bodyColor, primitiveMaterials.shell.color);
  const accent = usePrimitiveColor(accentColor, primitiveMaterials.glowHoney.color);
  const detail = usePrimitiveColor(detailColor, "#9C8E80");

  return (
    <PrimitiveRig ref={ref} scale={scale} position={position} rotation={rotation} animation={animation}>
      <group>
        <mesh position={[0, -0.56, 0]}>
          <cylinderGeometry args={[0.54, 0.6, 0.18, 28]} />
          <meshStandardMaterial color={shellColor} roughness={0.68} metalness={0.02} envMapIntensity={0.48} />
        </mesh>
        <mesh position={[0.02, -0.18, 0]}>
          <cylinderGeometry args={[0.06, 0.08, 0.82, 16]} />
          <meshStandardMaterial color={detail} roughness={0.5} metalness={0.02} />
        </mesh>
        <mesh position={[0.24, 0.16, 0]} rotation={[0, 0, 0.34]}>
          <cylinderGeometry args={[0.045, 0.06, 0.58, 16]} />
          <meshStandardMaterial color={detail} roughness={0.5} metalness={0.02} />
        </mesh>
        <mesh position={[0.45, 0.42, 0]}>
          <cylinderGeometry args={[0.26, 0.31, 0.12, 28]} />
          <meshStandardMaterial color={accent} roughness={0.34} metalness={0.02} emissive={accent} emissiveIntensity={0.12} />
        </mesh>
        <mesh position={[0.45, 0.42, 0.03]}>
          <sphereGeometry args={[0.2, 24, 24]} />
          <meshStandardMaterial color="#F7E8DD" roughness={0.3} metalness={0.01} emissive={accent} emissiveIntensity={0.08} />
        </mesh>
        <RoundedBox args={[0.18, 0.1, 0.18]} radius={0.03} smoothness={4} position={[0.13, 0.02, 0]}>
          <meshStandardMaterial color={detail} roughness={0.46} metalness={0.02} />
        </RoundedBox>
      </group>
    </PrimitiveRig>
  );
}

export const Lamp = memo(forwardRef(LampComponent));

export type { PrimitiveProps as LampProps };
