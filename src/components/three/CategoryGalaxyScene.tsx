"use client";

import { categoryGalaxyItems } from "@/config/three";
import { UniverseCanvas } from "./shared";

export default function CategoryGalaxyScene({
  progress,
  reducedMotion,
}: {
  progress: number;
  reducedMotion: boolean;
}) {
  return (
    <UniverseCanvas
      items={categoryGalaxyItems}
      progress={reducedMotion ? 0.44 : progress}
      animated={!reducedMotion}
      background="#f6f0e8"
      reducedMotion={reducedMotion}
    />
  );
}
