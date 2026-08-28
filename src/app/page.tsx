import { ScrollEffects } from "@/components/home/ScrollEffects";
import { Hero } from "@/components/sections/Hero";
import { BrandStatement } from "@/components/sections/BrandStatement";
import { Trust } from "@/components/sections/Trust";
import { CTA } from "@/components/sections/CTA";

export default function HomePage() {
  return (
    <>
      <ScrollEffects />
      <main>
        <Hero />
        <BrandStatement />
        <Trust />
        <CTA />
      </main>
    </>
  );
}
