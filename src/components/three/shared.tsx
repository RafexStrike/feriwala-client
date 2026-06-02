"use client";

import { ContactShadows, Environment, Sparkles } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState, useRef } from "react";
import * as THREE from "three";
import { animation } from "@/config/animations";
import { DEBUG_3D, FALLBACK_TEST } from "@/config/debug";
import { PRIMITIVE_NORMALIZATION } from "@/config/objectSizing";
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

function DebugInfo() {
  useFrame(({ camera }) => {
    if (DEBUG_3D) {
      console.log(`Camera Position: ${camera.position.x.toFixed(2)}, ${camera.position.y.toFixed(2)}, ${camera.position.z.toFixed(2)}`);
    }
  });
  return null;
}

function DebugBox({ objectRef }: { objectRef: React.RefObject<THREE.Group | null> }) {
  const helperRef = useRef<THREE.BoxHelper>(null);

  useEffect(() => {
    if (!DEBUG_3D || !objectRef.current) return;
    const helper = new THREE.BoxHelper(objectRef.current, 0xffff00);
    helperRef.current = helper;
    return () => {
      helperRef.current?.dispose();
    };
  }, [objectRef]);

  useFrame(() => {
    if (helperRef.current) {
      helperRef.current.update();
    }
  });

  return <primitive object={helperRef.current || {}} />;
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
  const ref = useRef<THREE.Group>(null);
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
    <>
      {FALLBACK_TEST ? (
        <mesh ref={ref} position={position}>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color="hotpink" />
        </mesh>
      ) : (
        <Primitive
          ref={ref}
          scale={item.scale * (PRIMITIVE_NORMALIZATION[item.kind] ?? 1)}
          position={position}
          rotation={item.rotation}
          bodyColor={sceneSurfaces.canvas}
          accentColor={item.color}
          detailColor={palette.shadow}
          animation={animationProps}
        />
      )}
      {DEBUG_3D && <DebugBox objectRef={ref} />}
    </>
  );
}

import { SceneFrame } from "./SceneFrame";

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
    <SceneFrame progress={progress} background={background} reducedMotion={reducedMotion} lowCost={lowCost}>
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
    </SceneFrame>
  );
}
