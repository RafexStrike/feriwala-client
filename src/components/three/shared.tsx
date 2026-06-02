"use client";

import { ContactShadows, Environment, Sparkles } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { animation } from "@/config/animations";
import { palette, sceneSurfaces } from "@/config/materials";
import type { SceneItem } from "@/config/three";
import { Dock, Gadget, Hub, Keyboard, Lamp, Mouse, Speaker, ToolKit } from "./primitives";

const primitiveMap = {
  keyboard: Keyboard,
  mouse: Mouse,
  speaker: Speaker,
  dock: Dock,
  tool: ToolKit,
  lamp: Lamp,
  gadget: Gadget,
  hub: Hub,
} as const;

function useCompactScreen() {
  const [compactScreen, setCompactScreen] = useState(false);

  useEffect(() => {
    const updateCompactScreen = () => {
      setCompactScreen(window.innerWidth < 768);
    };

    updateCompactScreen();
    window.addEventListener("resize", updateCompactScreen, { passive: true });

    return () => window.removeEventListener("resize", updateCompactScreen);
  }, []);

  return compactScreen;
}

function SceneObject({
  item,
  index,
  animated,
  lowCost,
  sceneSpread,
}: {
  item: SceneItem;
  index: number;
  animated: boolean;
  lowCost: boolean;
  sceneSpread: number;
}) {
  const Primitive = primitiveMap[item.kind];
  const position = useMemo<[number, number, number]>(
    () => item.position.map((value) => value * sceneSpread) as [number, number, number],
    [item.position, sceneSpread],
  );

  const animationProps = useMemo(
    () => ({
      floatAmplitude: lowCost ? animation.primitives.floatAmplitude.mobile : animation.primitives.floatAmplitude.desktop,
      floatSpeed: animation.primitives.floatSpeed + index * 0.025,
      orbitSpeed: animated ? animation.primitives.orbitSpeed + index * 0.008 : 0,
      rotationSpeed: animation.primitives.rotationSpeed,
      wobbleAmplitude: animation.primitives.wobbleAmplitude * (0.92 + (index % 3) * 0.04),
      wobbleSpeed: animation.primitives.wobbleSpeed + (index % 2) * 0.08,
      phase: index * animation.primitives.phaseStep,
    }),
    [animated, index, lowCost],
  );

  return (
    <Primitive
      scale={item.scale}
      position={position}
      rotation={item.rotation}
      bodyColor={sceneSurfaces.canvas}
      accentColor={item.color}
      detailColor={palette.shadow}
      animation={animationProps}
    />
  );
}

function SceneStage({
  children,
  progress,
  background = sceneSurfaces.canvas,
  reducedMotion,
  lowCost,
}: {
  children: ReactNode;
  progress: number;
  background?: string;
  reducedMotion: boolean;
  lowCost: boolean;
}) {
  const spreadRotation = THREE.MathUtils.lerp(0.12, 0.04, progress);

  return (
    <Canvas
      camera={{ position: [0, 0, 7.4], fov: 38 }}
      dpr={lowCost ? [1, 1.15] : [1, 1.65]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      shadows={false}
    >
      <color attach="background" args={[background]} />
      <fog attach="fog" args={[background, 9, 18]} />
      <ambientLight intensity={1.15} />
      <directionalLight position={[5, 6, 5]} intensity={2.4} color="#FFF1E4" />
      <directionalLight position={[-4, -2, 4]} intensity={0.82} color={palette.sky} />
      <directionalLight position={[0, 4, -3]} intensity={0.55} color={palette.clay} />
      <group position={[0, 0, 0]} rotation={[0.05, spreadRotation, 0]}>
        {children}
      </group>
      <ContactShadows opacity={0.22} scale={9} blur={2.5} far={5.5} resolution={lowCost ? 128 : 256} color={palette.shadow} />
      {lowCost || reducedMotion ? null : <Environment preset="studio" />}
      {lowCost || reducedMotion ? null : <Sparkles count={18} size={1.8} scale={6} speed={0.26} color={palette.honey} />}
    </Canvas>
  );
}

export function SceneFallback({ title }: { title: string }) {
  return (
    <div className="flex h-full min-h-[28rem] items-end overflow-hidden rounded-[2rem] border border-line bg-[radial-gradient(circle_at_18%_20%,rgba(107,152,181,0.16),transparent_24%),radial-gradient(circle_at_82%_16%,rgba(200,133,123,0.14),transparent_22%),linear-gradient(145deg,#f7f5f2,#f0e6db)] p-6">
      <div>
        <p className="text-xs uppercase tracking-[0.32em] text-muted">Loading scene</p>
        <p className="mt-3 max-w-xs font-display text-4xl leading-none text-ink">{title}</p>
      </div>
    </div>
  );
}

export function UniverseCanvas({
  items,
  progress,
  animated = true,
  background = sceneSurfaces.canvas,
  reducedMotion = false,
}: {
  items: SceneItem[];
  progress: number;
  animated?: boolean;
  background?: string;
  reducedMotion?: boolean;
}) {
  const compactScreen = useCompactScreen();
  const lowCost = reducedMotion || compactScreen;
  const sceneSpread = animated
    ? THREE.MathUtils.lerp(animation.scene.spreadStart, animation.scene.spreadEnd, progress)
    : animation.scene.spreadStart;

  return (
    <SceneStage progress={progress} background={background} reducedMotion={reducedMotion} lowCost={lowCost}>
      {items.map((item, index) => (
        <SceneObject
          key={item.id}
          item={item}
          index={index}
          animated={animated}
          lowCost={lowCost}
          sceneSpread={sceneSpread}
        />
      ))}
    </SceneStage>
  );
}
