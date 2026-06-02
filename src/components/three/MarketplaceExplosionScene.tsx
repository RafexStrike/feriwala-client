"use client";

import { animation } from "@/config/animations";
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
      progress={reducedMotion ? animation.scene.spreadEnd + 0.12 : progress}
      animated={!reducedMotion}
      background="#F3EBDD"
      reducedMotion={reducedMotion}
    />
  );
}
