

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { homepageContent } from "@/content/homepage";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { BrandMotif } from "@/components/ui/BrandMotif";

import earbudsImage from "@/assets/images/earbuds1.jpeg";
import keyboardImage from "@/assets/images/keyboard1.jpeg";
import mouseImage from "@/assets/images/mouse1.jpeg";
import powerbankImage from "@/assets/images/powerbank1.jpeg";

const heroImages = [
  { src: earbudsImage, alt: "Wireless earbuds" },
  { src: keyboardImage, alt: "Keyboard" },
  { src: mouseImage, alt: "Computer mouse" },
  { src: powerbankImage, alt: "Power bank" },
];

export function Hero() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentImage((current) => (current + 1) % heroImages.length);
    }, 2300);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(circle_at_20%_15%,rgba(245,140,76,0.18),transparent_20%),radial-gradient(circle_at_70%_12%,rgba(55,175,245,0.12),transparent_18%),radial-gradient(circle_at_50%_72%,rgba(244,103,100,0.08),transparent_26%)]" />

      <div className="relative mx-auto grid min-h-[calc(100vh-4.75rem)] w-[min(1180px,calc(100vw-2rem))] gap-12 py-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:py-16">
        <div data-reveal className="max-w-[42rem]">
          <BrandMotif className="mb-5 h-3 w-10" />
          <p className="section-kicker">{homepageContent.hero.eyebrow}</p>

          <h1 className="editorial-headline mt-6 text-[clamp(4rem,8vw,8rem)] text-ink">
            <span className="block">Products for</span>
            <span className="block">people who</span>
            <span className="block">care.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-muted sm:text-lg">
            {homepageContent.hero.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/products">{homepageContent.hero.primaryCta}</ButtonLink>
          </div>
        </div>

        <div data-reveal className="relative flex items-center justify-center">
          <div className="relative h-[28rem] w-full max-w-[32rem] sm:h-[34rem] lg:h-[40rem]">
            {heroImages.map((image, index) => {
              const isActive = index === currentImage;
              const positions = [
                "left-0 top-10 rotate-[-5deg]",
                "left-14 top-20 rotate-[3deg]",
                "right-4 top-12 rotate-[7deg]",
                "left-20 bottom-6 rotate-[-2deg]",
              ];

              return (
                <div
                  key={image.alt}
                  className={`absolute ${positions[index]} h-[16rem] w-[12.5rem] overflow-hidden rounded-[2rem] border border-line/80 bg-surface shadow-[0_28px_60px_rgba(23,20,16,0.08)] transition-all duration-700 ease-out sm:h-[18rem] sm:w-[13.5rem] lg:h-[20rem] lg:w-[15rem] ${
                    isActive ? "scale-100 opacity-100 z-20" : "scale-[0.96] opacity-45 z-10"
                  }`}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 1024px) 50vw, 27vw"
                    className="object-cover"
                    priority={index === 0}
                  />
                </div>
              );
            })}

            <div className="absolute bottom-4 right-2 rounded-full border border-line/80 bg-white/60 px-3 py-2 text-[0.62rem] uppercase tracking-[0.2em] text-ink backdrop-blur-sm">
              curated edit
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}