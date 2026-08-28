

"use client";

import { useEffect, useState } from "react";

import { homepageContent } from "@/content/homepage";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Reveal } from "@/components/ui/Reveal";

import Image from "next/image";

import earbudsImage from "@/assets/images/earbuds1.jpeg";
import keyboardImage from "@/assets/images/keyboard1.jpeg";
import mouseImage from "@/assets/images/mouse1.jpeg";
import powerbankImage from "@/assets/images/powerbank1.jpeg";

const heroImages = [
  {
    src: earbudsImage,
    alt: "Wireless earbuds",
  },
  {
    src: keyboardImage,
    alt: "Keyboard",
  },
  {
    src: mouseImage,
    alt: "Computer mouse",
  },
  {
    src: powerbankImage,
    alt: "Power bank",
  },
];

export function Hero() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentImage((current) => (current + 1) % heroImages.length);
    }, 1800);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F7F5F2] via-[#FCFBF9] to-white">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-[min(1180px,calc(100vw-2rem))] gap-10 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-16">

        {/* LEFT SIDE */}
        <div data-reveal className="max-w-2xl">
          <p
            data-reveal
            className="text-xs uppercase tracking-[0.32em] text-muted"
          >
            {homepageContent.hero.eyebrow}
          </p>

          <Reveal>
            <h1 className="mt-5 font-display text-[clamp(3.4rem,8vw,7.2rem)] leading-[0.92] tracking-[-0.05em] text-ink">
              {homepageContent.hero.title}
            </h1>
          </Reveal>

          <Reveal delay={0.08}>
            <p className="mt-6 max-w-xl text-[1.04rem] leading-8 text-muted">
              {homepageContent.hero.description}
            </p>
          </Reveal>

          <Reveal delay={0.14}>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/products">
                {homepageContent.hero.primaryCta}
              </ButtonLink>
            </div>
          </Reveal>
        </div>

        {/* RIGHT SIDE - IMAGE SLIDER */}
        <div
          data-reveal
          className="relative flex min-h-[28rem] items-center justify-center lg:min-h-[42rem]"
        >
          {/* Very subtle background glow */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(107,152,181,0.14),transparent_50%)] blur-2xl" />

          {/* Slider area */}
          <div className="relative h-[26rem] w-full sm:h-[32rem] lg:h-[40rem]">
            {heroImages.map((image, index) => {
              const isActive = index === currentImage;

              return (
                <div
                  key={image.alt}
                  className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out ${isActive
                    ? "scale-100 opacity-100"
                    : "scale-[0.97] opacity-0"
                    }`}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 1024px) 90vw, 45vw"
                    className="object-contain"
                    priority={index === 0}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}