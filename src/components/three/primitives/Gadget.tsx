"use client";

import { memo } from "react";
import { RoundedBox } from "@react-three/drei";
import { forwardRef } from "react";
import * as THREE from "three";
import { PrimitiveRig, primitiveMaterials, type PrimitiveProps, usePrimitiveColor } from "./shared";

function GadgetComponent({ scale, position, rotation, bodyColor, accentColor, detailColor, animation }: PrimitiveProps, ref: React.ForwardedRef<THREE.Group>) {
  const shellColor = usePrimitiveColor(bodyColor, primitiveMaterials.shellDeep.color);
  const accent = usePrimitiveColor(accentColor, primitiveMaterials.accentSky.color);
  const detail = usePrimitiveColor(detailColor, "#B0A294");

  return (
    <PrimitiveRig ref={ref} scale={scale} position={position} rotation={rotation} animation={animation}>
      <group>
        <RoundedBox args={[0.92, 0.92, 0.92]} radius={0.2} smoothness={6}>
          <meshStandardMaterial color={shellColor} roughness={0.58} metalness={0.03} envMapIntensity={0.55} />
        </RoundedBox>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.46, 0.08, 14, 32]} />
          <meshStandardMaterial color={accent} roughness={0.34} metalness={0.03} emissive={accent} emissiveIntensity={0.08} />
        </mesh>
        <mesh position={[0, 0.28, 0.28]}>
          <sphereGeometry args={[0.16, 20, 20]} />
          <meshStandardMaterial color="#F7E8DB" roughness={0.34} metalness={0.01} emissive={accent} emissiveIntensity={0.08} />
        </mesh>
        <mesh position={[-0.34, -0.18, 0.1]} rotation={[0.12, 0, 0.78]}>
          <capsuleGeometry args={[0.06, 0.58, 8, 14]} />
          <meshStandardMaterial color={detail} roughness={0.48} metalness={0.02} />
        </mesh>
        <mesh position={[0.28, -0.26, -0.1]} rotation={[0, 0.22, -0.42]}>
          <capsuleGeometry args={[0.05, 0.42, 8, 14]} />
          <meshStandardMaterial color={detail} roughness={0.48} metalness={0.02} />
        </mesh>
        <RoundedBox args={[0.16, 0.16, 0.16]} radius={0.04} smoothness={4} position={[0.28, 0.05, -0.38]}>
          <meshStandardMaterial color={primitiveMaterials.glowClay.color} roughness={0.28} metalness={0.02} emissive={primitiveMaterials.glowClay.color} emissiveIntensity={0.16} />
        </RoundedBox>
      </group>
    </PrimitiveRig>
  );
}

export const Gadget = memo(forwardRef(GadgetComponent));

export type { PrimitiveProps as GadgetProps };
