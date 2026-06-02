"use client";

import { assemblyItems } from "@/config/three";
import { UniverseCanvas } from "./shared";

export default function AssemblyScene({
  progress,
  reducedMotion,
}: {
  progress: number;
  reducedMotion: boolean;
}) {
  return (
    <UniverseCanvas
      items={assemblyItems}
      progress={reducedMotion ? 0.72 : progress}
      animated={!reducedMotion}
      background="#f6f0e8"
      reducedMotion={reducedMotion}
    />
  );
}
