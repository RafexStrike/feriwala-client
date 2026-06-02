"use client";

import { marketplaceExplosionItems } from "@/config/three";
import { UniverseCanvas } from "./shared";

export default function MarketplaceExplosionScene({
  progress,
  reducedMotion,
}: {
  progress: number;
  reducedMotion: boolean;
}) {
  return (
    <UniverseCanvas
      items={marketplaceExplosionItems}
      progress={reducedMotion ? 0.5 : progress}
      animated={!reducedMotion}
      background="#f4efe6"
      reducedMotion={reducedMotion}
    />
  );
}
