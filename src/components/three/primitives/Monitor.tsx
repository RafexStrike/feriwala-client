"use client";

import { memo, forwardRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { RoundedBox, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { PrimitiveRig, primitiveMaterials, type PrimitiveProps, usePrimitiveColor } from "./shared";

// ==========================================
// 1. Realistic Monitor Component
// ==========================================
function MonitorComponent(
  { scale, position, rotation, bodyColor, accentColor, detailColor, animation }: PrimitiveProps,
  ref: React.ForwardedRef<THREE.Group>
) {
  // Color setup
  const shellColor = usePrimitiveColor(bodyColor, primitiveMaterials.shell?.color || "#18181B");
  const accent = usePrimitiveColor(accentColor, primitiveMaterials.accentClay?.color || "#27272A");
  const detail = usePrimitiveColor(detailColor, "#3B82F6"); // Status LED Blue glow

  return (
    <PrimitiveRig ref={ref} scale={scale} position={position} rotation={rotation} animation={animation}>
      <group position={[0, 0, 0]}>

        {/* ---------------- DISPLAY HEAD ---------------- */}
        <group position={[0, 0.45, 0]}>
          
          {/* Main Outer Bezel Frame */}
          <RoundedBox args={[1.8, 1.05, 0.04]} radius={0.015} smoothness={4} position={[0, 0, 0]}>
            <meshStandardMaterial color={shellColor} roughness={0.3} metalness={0.4} />
          </RoundedBox>

          {/* Recessed Back Housing Hump */}
          <RoundedBox args={[1.4, 0.75, 0.08]} radius={0.03} smoothness={4} position={[0, 0, -0.05]}>
            <meshStandardMaterial color={accent} roughness={0.5} metalness={0.2} />
          </RoundedBox>

          {/* Screen Glass Surface */}
          <mesh position={[0, 0.01, 0.021]}>
            <planeGeometry args={[1.74, 0.98]} />
            <meshStandardMaterial
              color="#050508"
              roughness={0.1}
              metalness={0.9}
              envMapIntensity={1.5}
            />
          </mesh>

          {/* Active Screen Display Area (Subtle IPS Glow Panel) */}
          <mesh position={[0, 0.01, 0.022]}>
            <planeGeometry args={[1.72, 0.96]} />
            <meshStandardMaterial
              color="#0F172A"
              emissive="#1E293B"
              emissiveIntensity={0.3}
              roughness={0.2}
            />
          </mesh>

          {/* Bottom Chin Bar */}
          <mesh position={[0, -0.495, 0.018]}>
            <boxGeometry args={[1.78, 0.05, 0.015]} />
            <meshStandardMaterial color={shellColor} roughness={0.4} metalness={0.3} />
          </mesh>

          {/* Front Power / Status LED Indicator */}
          <mesh position={[0.82, -0.495, 0.026]}>
            <cylinderGeometry args={[0.005, 0.005, 0.003, 12]} rotation={[Math.PI / 2, 0, 0]} />
            <meshStandardMaterial color={detail} emissive={detail} emissiveIntensity={1.2} />
          </mesh>
        </group>

        {/* ---------------- STAND & NECK ---------------- */}
        <group position={[0, 0, 0]}>
          
          {/* Vertical Support Arm Column */}
          <mesh position={[0, 0.28, -0.12]} rotation={[-0.08, 0, 0]}>
            <boxGeometry args={[0.12, 0.65, 0.06]} />
            <meshStandardMaterial color={accent} roughness={0.3} metalness={0.7} />
          </mesh>

          {/* Metallic VESA Mounting Joint Block */}
          <RoundedBox args={[0.18, 0.18, 0.05]} radius={0.01} smoothness={3} position={[0, 0.45, -0.08]}>
            <meshStandardMaterial color="#52525B" roughness={0.25} metalness={0.85} />
          </RoundedBox>

          {/* Cable Management Pass-through Cutout Ring */}
          <mesh position={[0, 0.15, -0.13]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.04, 0.012, 16, 24]} />
            <meshStandardMaterial color={shellColor} roughness={0.5} />
          </mesh>

          {/* Flat Heavy Base Plate */}
          <group position={[0, -0.06, -0.04]}>
            {/* Main Base Wedge */}
            <mesh position={[0, 0.01, 0]}>
              <cylinderGeometry args={[0.38, 0.42, 0.02, 32]} />
              <meshStandardMaterial color={shellColor} roughness={0.35} metalness={0.5} />
            </mesh>

            {/* Rubber Feet Ring underneath base */}
            <mesh position={[0, -0.002, 0]}>
              <cylinderGeometry args={[0.4, 0.4, 0.005, 32]} />
              <meshStandardMaterial color="#09090B" roughness={0.9} />
            </mesh>
          </group>

        </group>

      </group>
    </PrimitiveRig>
  );
}

export const Monitor = memo(forwardRef(MonitorComponent));
export type { PrimitiveProps as MonitorProps };

// ==========================================
// 2. Next.js Single Page Test Harness
// ==========================================
export default function MonitorPage() {
  const [isMounted, setIsMounted] = useState(false);

  // Prevent SSR execution for WebGL Context
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div style={{ width: "100vw", height: "100vh", backgroundColor: "#0a0a0c" }} />;
  }

  return (
    <main style={{ width: "100vw", height: "100vh", backgroundColor: "#0a0a0c" }}>
      <Canvas camera={{ position: [0, 0.6, 2.5], fov: 45 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[4, 5, 4]} intensity={1.5} />
        <directionalLight position={[-4, 2, -3]} intensity={0.5} color="#3b82f6" />

        {/* Render Monitor */}
        <Monitor position={[0, -0.2, 0]} />

        <OrbitControls makeDefault minDistance={1} maxDistance={8} target={[0, 0.3, 0]} />
      </Canvas>
    </main>
  );
}