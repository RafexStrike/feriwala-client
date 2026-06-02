"use client";

import { floatingUniverseItems } from "@/config/three";
import { UniverseCanvas } from "./shared";

export default function FloatingUniverseScene({
  progress,
  reducedMotion,
}: {
  progress: number;
  reducedMotion: boolean;
}) {
  return <UniverseCanvas items={floatingUniverseItems} progress={progress} animated={!reducedMotion} reducedMotion={reducedMotion} />;
}
