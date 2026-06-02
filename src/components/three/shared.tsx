"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Float, RoundedBox, Sparkles } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import type { SceneItem } from "@/config/three";
import type { ReactNode } from "react";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function ShapeNode({ item, progress, animated }: { item: SceneItem; progress: number; animated: boolean }) {
  const reducedMotion = useReducedMotion();
  const group = useRef<THREE.Group>(null);
  const targetProgress = reducedMotion ? 0.5 : progress;

  useFrame((state) => {
    if (!group.current) return;
    const spread = animated ? 1 - targetProgress : 1;
    group.current.position.x = item.position[0] * spread + Math.sin(state.clock.elapsedTime * 0.5 + item.scale) * 0.04;
    group.current.position.y = item.position[1] * spread + Math.cos(state.clock.elapsedTime * 0.45 + item.scale) * 0.04;
    group.current.position.z = item.position[2] * spread;
    group.current.rotation.x = item.rotation[0] + state.clock.elapsedTime * 0.12 * (animated ? 0.5 : 0.2);
    group.current.rotation.y = item.rotation[1] + state.clock.elapsedTime * 0.14 * (animated ? 0.5 : 0.2);
    group.current.rotation.z = item.rotation[2] + state.clock.elapsedTime * 0.08 * (animated ? 0.4 : 0.15);
  });

  return (
    <group ref={group} scale={item.scale}>
      <Float speed={1.1} rotationIntensity={0.3} floatIntensity={0.3}>
        <ProductPrimitive kind={item.kind} color={item.color} accent={item.accent} progress={targetProgress} />
      </Float>
    </group>
  );
}

function ProductPrimitive({
  kind,
  color,
  accent,
  progress,
}: {
  kind: SceneItem["kind"];
  color: string;
  accent: string;
  progress: number;
}) {
  const body = useMemo(() => new THREE.Color(color), [color]);
  const glow = useMemo(() => new THREE.Color(accent), [accent]);

  if (kind === "mouse") {
    return (
      <group>
        <RoundedBox args={[1.7, 0.75, 0.95]} radius={0.2} smoothness={6}>
          <meshStandardMaterial color={body} metalness={0.38} roughness={0.32} />
        </RoundedBox>
        <mesh position={[0, 0.14, 0.22]}>
          <sphereGeometry args={[0.12, 24, 24]} />
          <meshStandardMaterial color={glow} emissive={glow} emissiveIntensity={0.5} />
        </mesh>
      </group>
    );
  }

  if (kind === "speaker") {
    return (
      <group>
        <RoundedBox args={[1.7, 1.25, 0.7]} radius={0.16} smoothness={6}>
          <meshStandardMaterial color={body} metalness={0.3} roughness={0.28} />
        </RoundedBox>
        <mesh position={[0, 0, 0.38]}>
          <cylinderGeometry args={[0.34, 0.34, 0.16, 30]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.25} />
        </mesh>
      </group>
    );
  }

  if (kind === "dock" || kind === "hub") {
    return (
      <group>
        <RoundedBox args={[1.8, 0.38, 0.9]} radius={0.12} smoothness={6}>
          <meshStandardMaterial color={body} metalness={0.5} roughness={0.22} />
        </RoundedBox>
        <mesh position={[-0.42, 0.08, 0.12]}>
          <boxGeometry args={[0.16, 0.12, 0.12]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.35} />
        </mesh>
        <mesh position={[0.1, 0.08, 0.12]}>
          <boxGeometry args={[0.16, 0.12, 0.12]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.35} />
        </mesh>
        <mesh position={[0.6, 0.08, 0.12]}>
          <boxGeometry args={[0.16, 0.12, 0.12]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.35} />
        </mesh>
      </group>
    );
  }

  if (kind === "tool") {
    return (
      <group>
        <RoundedBox args={[1.2, 0.95, 0.45]} radius={0.12} smoothness={6}>
          <meshStandardMaterial color={body} metalness={0.2} roughness={0.38} />
        </RoundedBox>
        <mesh position={[0.45, -0.15, 0.35]} rotation={[0.2, 0, 0.45]}>
          <cylinderGeometry args={[0.06, 0.09, 1.05, 18]} />
          <meshStandardMaterial color={accent} />
        </mesh>
      </group>
    );
  }

  if (kind === "lamp") {
    return (
      <group>
        <mesh position={[0, -0.4, 0]}>
          <cylinderGeometry args={[0.42, 0.52, 0.2, 24]} />
          <meshStandardMaterial color={body} metalness={0.45} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.18, 0]}>
          <sphereGeometry args={[0.42, 32, 32]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.12} transparent opacity={0.85} />
        </mesh>
      </group>
    );
  }

  if (kind === "gadget") {
    return (
      <group>
        <RoundedBox args={[0.9, 0.9, 0.9]} radius={0.12} smoothness={6}>
          <meshStandardMaterial color={body} metalness={0.32} roughness={0.28} />
        </RoundedBox>
        <mesh position={[0, 0.32, 0]}>
          <sphereGeometry args={[0.14, 24, 24]} />
          <meshStandardMaterial color={glow} emissive={glow} emissiveIntensity={0.45} />
        </mesh>
      </group>
    );
  }

  return (
    <group>
      <RoundedBox args={[1.8, 0.42, 0.9]} radius={0.14} smoothness={6}>
        <meshStandardMaterial color={body} metalness={0.42} roughness={0.2} />
      </RoundedBox>
      <mesh position={[0, 0.14, 0.3]}>
        <boxGeometry args={[1.5, 0.1, 0.18]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.15} />
      </mesh>
    </group>
  );
}

function SceneStage({
  children,
  progress,
  background = "#f4efe6",
  reducedMotion,
}: {
  children: ReactNode;
  progress: number;
  background?: string;
  reducedMotion: boolean;
}) {
  return (
    <Canvas camera={{ position: [0, 0, 7.5], fov: 38 }} dpr={[1, 1.6]} gl={{ antialias: true, alpha: true }}>
      <color attach="background" args={[background]} />
      <ambientLight intensity={1.2} />
      <directionalLight position={[4, 5, 5]} intensity={2.4} color="#fff2e5" />
      <directionalLight position={[-4, -2, 3]} intensity={0.9} color="#6b98b5" />
      <group position={[0, 0, 0]} rotation={[0.1, -0.15 + progress * 0.2, 0]}>
        {children}
      </group>
      <ContactShadows opacity={0.24} scale={9} blur={2.4} far={5.5} resolution={256} color="#b89d86" />
      {reducedMotion ? null : <Environment preset="apartment" />}
      {reducedMotion ? null : <Sparkles count={24} size={2.4} scale={7} speed={0.4} color="#d2926f" />}
    </Canvas>
  );
}

export function SceneFallback({ title }: { title: string }) {
  return (
    <div className="flex h-full min-h-[28rem] items-end overflow-hidden rounded-[2rem] border border-line bg-[radial-gradient(circle_at_20%_20%,rgba(107,152,181,0.18),transparent_26%),radial-gradient(circle_at_80%_15%,rgba(200,133,123,0.16),transparent_22%),linear-gradient(145deg,#f7f2e9,#f0e4d7)] p-6">
      <div>
        <p className="text-xs uppercase tracking-[0.32em] text-muted">Fallback scene</p>
        <p className="mt-3 max-w-xs font-display text-4xl leading-none text-ink">{title}</p>
      </div>
    </div>
  );
}

export function UniverseCanvas({
  items,
  progress,
  animated = true,
  background = "#f4efe6",
  reducedMotion = false,
}: {
  items: SceneItem[];
  progress: number;
  animated?: boolean;
  background?: string;
  reducedMotion?: boolean;
}) {
  return (
    <SceneStage progress={progress} background={background} reducedMotion={reducedMotion}>
      {items.map((item) => (
        <ShapeNode key={item.id} item={item} progress={progress} animated={animated} />
      ))}
    </SceneStage>
  );
}
