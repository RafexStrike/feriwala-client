"use client";

import { useEffect, useMemo, useRef, useState, type ComponentType } from "react";
import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";
import { animation } from "@/config/animations";
import { cn } from "@/lib/cn";
import { SceneFallback } from "./shared";

type SceneId = "floating-universe" | "assembly" | "category-galaxy" | "marketplace-explosion" | "formation";

type SceneProps = {
  progress: number;
  reducedMotion: boolean;
};

const sceneImports: Record<SceneId, () => Promise<{ default: ComponentType<SceneProps> }>> = {
  "floating-universe": () => import("./FloatingUniverseScene"),
  assembly: () => import("./AssemblyScene"),
  "category-galaxy": () => import("./CategoryGalaxyScene"),
  "marketplace-explosion": () => import("./MarketplaceExplosionScene"),
  formation: () => import("./FormationScene"),
};

export function SceneSlot({
  scene,
  className,
  fallbackTitle,
  scrub = true,
}: {
  scene: SceneId;
  className?: string;
  fallbackTitle: string;
  scrub?: boolean;
}) {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0.5);
  const [active, setActive] = useState(false);

  const SceneComponent = useMemo(
    () =>
      dynamic(sceneImports[scene], {
        ssr: false,
        loading: () => <SceneFallback title={fallbackTitle} />,
      }),
    [fallbackTitle, scene],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setActive(true);
          observer.disconnect();
        }
      },
      { rootMargin: "320px 0px" },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!scrub || reducedMotion || typeof window === "undefined") return;
    if (!active) return;

    let cleanup: (() => void) | undefined;

    void import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
      void import("gsap").then(({ default: gsap }) => {
        gsap.registerPlugin(ScrollTrigger);
        const trigger = ScrollTrigger.create({
          trigger: ref.current,
          start: animation.scene.scrubStart,
          end: animation.scene.scrubEnd,
          scrub: true,
          onUpdate: (self) => setProgress(self.progress),
        });

        cleanup = () => trigger.kill();
      });
    });

    return () => cleanup?.();
  }, [active, reducedMotion, scrub]);

  return (
    <div
      ref={ref}
      data-parallax
      className={cn("relative isolate overflow-hidden rounded-[2rem] border border-line bg-surface shadow-soft", className)}
    >
      {active ? <SceneComponent progress={reducedMotion ? 0.5 : progress} reducedMotion={Boolean(reducedMotion)} /> : <SceneFallback title={fallbackTitle} />}
    </div>
  );
}
