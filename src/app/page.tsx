import { ScrollEffects } from "@/components/home/ScrollEffects";
import { Hero } from "@/components/sections/Hero";
import { Universe } from "@/components/sections/Universe";
import { Assembly } from "@/components/sections/Assembly";
import { Editorial } from "@/components/sections/Editorial";
import { Categories } from "@/components/sections/Categories";
import { Anatomy } from "@/components/sections/Anatomy";
import { Marketplace } from "@/components/sections/Marketplace";
import { Featured } from "@/components/sections/Featured";
import { Discovery } from "@/components/sections/Discovery";
import { Trust } from "@/components/sections/Trust";
import { Formation } from "@/components/sections/Formation";
import { CTA } from "@/components/sections/CTA";

export default function HomePage() {
  return (
    <>
      <ScrollEffects />
      <main>
        <Hero />
        <Universe />
        <Assembly />
        <Editorial />
        <Categories />
        <Anatomy />
        <Marketplace />
        <Featured />
        <Discovery />
        <Trust />
        <Formation />
        <CTA />
      </main>
    </>
  );
}
