"use client";

import { formationItems } from "@/config/three";
import { UniverseCanvas } from "./shared";

export default function FormationScene({
  progress,
  reducedMotion,
}: {
  progress: number;
  reducedMotion: boolean;
}) {
  return (
    <UniverseCanvas
      items={formationItems}
      progress={reducedMotion ? 0.7 : progress}
      animated={!reducedMotion}
      background="#f3ede3"
      reducedMotion={reducedMotion}
    />
  );
}
