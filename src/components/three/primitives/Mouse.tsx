"use client";

import { memo } from "react";
import { RoundedBox } from "@react-three/drei";
import { PrimitiveRig, primitiveMaterials, type PrimitiveProps, usePrimitiveColor } from "./shared";

function MouseComponent({ scale, position, rotation, bodyColor, accentColor, detailColor, animation }: PrimitiveProps) {
  const shellColor = usePrimitiveColor(bodyColor, primitiveMaterials.shellDeep.color);
  const accent = usePrimitiveColor(accentColor, primitiveMaterials.accentClay.color);
  const detail = usePrimitiveColor(detailColor, "#9F9183");

  return (
    <PrimitiveRig scale={scale} position={position} rotation={rotation} animation={animation}>
      <group>
        <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0.02, 0]}>
          <capsuleGeometry args={[0.39, 1.02, 10, 18]} />
          <meshStandardMaterial color={shellColor} roughness={0.54} metalness={0.03} envMapIntensity={0.55} />
        </mesh>
        <RoundedBox args={[0.86, 0.04, 0.06]} radius={0.02} smoothness={4} position={[0.02, 0.19, 0]}>
          <meshStandardMaterial color={detail} roughness={0.45} metalness={0.02} />
        </RoundedBox>
        <mesh position={[0.12, 0.22, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.075, 0.075, 0.16, 18]} />
          <meshStandardMaterial color={accent} roughness={0.36} metalness={0.03} emissive={accent} emissiveIntensity={0.04} />
        </mesh>
        <mesh position={[0.12, 0.22, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.16, 12]} />
          <meshStandardMaterial color="#F3E6DA" roughness={0.42} metalness={0.01} />
        </mesh>
      </group>
    </PrimitiveRig>
  );
}

export const Mouse = memo(MouseComponent);

export type { PrimitiveProps as MouseProps };
