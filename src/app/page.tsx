import { ScrollEffects } from "@/components/home/ScrollEffects";
import { Hero } from "@/components/sections/Hero";
import { Categories } from "@/components/sections/Categories";
import { BrandStatement } from "@/components/sections/BrandStatement";
import { Featured } from "@/components/sections/Featured";
import { Trust } from "@/components/sections/Trust";
import { CTA } from "@/components/sections/CTA";

export default function HomePage() {
  return (
    <>
      <ScrollEffects />
      <main>
        <Hero />
        <Categories />
        <BrandStatement />
        <Featured />
        <Trust />
        <CTA />
      </main>
    </>
  );
}
