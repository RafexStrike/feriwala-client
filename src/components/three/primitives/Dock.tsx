"use client";

import { memo } from "react";
import { RoundedBox } from "@react-three/drei";
import { PrimitiveRig, primitiveMaterials, type PrimitiveProps, usePrimitiveColor } from "./shared";

function DockComponent({ scale, position, rotation, bodyColor, accentColor, detailColor, animation }: PrimitiveProps) {
  const shellColor = usePrimitiveColor(bodyColor, primitiveMaterials.shellDeep.color);
  const accent = usePrimitiveColor(accentColor, primitiveMaterials.accentSky.color);
  const detail = usePrimitiveColor(detailColor, "#968779");

  return (
    <PrimitiveRig scale={scale} position={position} rotation={rotation} animation={animation}>
      <group>
        <RoundedBox args={[2.48, 0.22, 0.96]} radius={0.16} smoothness={8}>
          <meshStandardMaterial color={shellColor} roughness={0.72} metalness={0.03} envMapIntensity={0.6} />
        </RoundedBox>
        <RoundedBox args={[1.58, 0.06, 0.44]} radius={0.04} smoothness={4} position={[0, 0.15, -0.02]}>
          <meshStandardMaterial color={accent} roughness={0.34} metalness={0.03} emissive={accent} emissiveIntensity={0.04} />
        </RoundedBox>
        <RoundedBox args={[0.12, 0.26, 0.12]} radius={0.03} smoothness={4} position={[-0.84, -0.15, 0.26]}>
          <meshStandardMaterial color={detail} roughness={0.45} metalness={0.02} />
        </RoundedBox>
        <RoundedBox args={[0.12, 0.26, 0.12]} radius={0.03} smoothness={4} position={[0.84, -0.15, 0.26]}>
          <meshStandardMaterial color={detail} roughness={0.45} metalness={0.02} />
        </RoundedBox>
        <mesh position={[0, -0.17, 0]}>
          <cylinderGeometry args={[0.06, 0.08, 0.22, 16]} />
          <meshStandardMaterial color="#CFC3B6" roughness={0.5} metalness={0.02} />
        </mesh>
      </group>
    </PrimitiveRig>
  );
}

export const Dock = memo(DockComponent);

export type { PrimitiveProps as DockProps };
