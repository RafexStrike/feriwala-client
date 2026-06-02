import { categories } from "@/config/categories";
import { featuredProducts } from "@/config/products";

export const homepageContent = {
  nav: {
    logo: "Feriwala",
    primary: { label: "Products", href: "/products" },
  },
  hero: {
    eyebrow: "Curated multi-vendor tech marketplace",
    title: "A premium product universe for desks that deserve better.",
    description:
      "Feriwala brings together keyboards, mice, audio, desk tools, hubs, and small utilities in a discovery-first experience built for people who care how their setup feels.",
    primaryCta: "Explore products",
    secondaryCta: "See the universe",
    meta: ["Discovery-first", "Productivity-ready", "Multi-vendor"],
    stats: [
      { value: "200+", label: "vendors and makers" },
      { value: "7", label: "core categories" },
      { value: "48", label: "hourly curation refreshes" },
    ],
  },
  universe: {
    eyebrow: "Enter the universe",
    title: "The homepage starts like a cinematic object study, then settles into a shopping system.",
    description:
      "The first impression is a floating collection of tools and accessories. The second impression is structure: categories, features, and a path to the right gear.",
    notes: ["Warm lighting", "Clean motion", "No grid-first thinking"],
  },
  assembly: {
    eyebrow: "Assembly sequence",
    title: "Products move from floating discovery into a calm, workable setup.",
    description:
      "Objects drift, align, and snap into a desk composition that feels practical without losing the sense of theater.",
    bulletPoints: ["Scroll to reconfigure the layout", "Watch the desk settle into balance", "Feel the transition from browsing to building"],
  },
  editorial: {
    eyebrow: "Editorial layer",
    title: "This is not a storefront template. It is a product story with breathing room.",
    description:
      "Typography leads. Product variety follows. The result should feel warm, premium, and intentionally edited rather than overloaded.",
    pullQuote:
      "Discovery is the hook. Productivity is the promise. The homepage is designed to make both visible at once.",
  },
  categories: {
    eyebrow: "Category constellation",
    title: "A small galaxy of practical tools, each with its own personality.",
    description:
      "The category view keeps the range visible without flattening everything into a generic catalog grid.",
    items: categories.map((category) => ({
      slug: category.slug,
      name: category.name,
      summary: category.summary,
      accent: category.accent,
      count: category.count,
    })),
  },
  anatomy: {
    eyebrow: "Exploded anatomy",
    title: "Zoom in on the details that make a product feel carefully built.",
    description:
      "Anatomy shots reveal surfaces, joints, ports, and finishes, so the marketplace feels engineered rather than purely decorative.",
    parts: ["Surface finish", "Edge treatment", "Feedback feel", "Connectivity", "Cable discipline"],
  },
  marketplace: {
    eyebrow: "Marketplace scale",
    title: "One marketplace, many makers, one coherent experience.",
    description:
      "The story has to communicate that Feriwala is broad enough for exploration while still feeling considered and premium.",
    metrics: [
      { value: "7", label: "product families" },
      { value: "4", label: "featured card rows" },
      { value: "1", label: "cohesive brand universe" },
    ],
  },
  featured: {
    eyebrow: "Featured discovery",
    title: "A few products that show the range without overwhelming the page.",
    description:
      "These are the moments where the story becomes closer to commerce again, while keeping the editorial pace intact.",
    cta: "Browse the full collection",
    products: featuredProducts.slice(0, 6),
  },
  discovery: {
    eyebrow: "Immersive browsing",
    title: "A horizontal band of product ideas for fast scanning and quiet delight.",
    description:
      "Browsing should feel like moving through a curated shelf, not a database grid.",
  },
  trust: {
    eyebrow: "Trust and scale",
    title: "Enough structure to feel dependable, enough warmth to stay memorable.",
    description:
      "Signals like maker variety, category clarity, and a premium presentation help the marketplace feel ready for growth.",
    proof: ["Carefully organized categories", "Future-ready product pages", "Cohesive visual system"],
  },
  formation: {
    eyebrow: "Brand formation",
    title: "Everything converges into the Feriwala wordmark and leaves a clear final impression.",
    description:
      "By the end of the scroll, the page should feel like one unified brand system instead of separate modules.",
  },
  cta: {
    eyebrow: "Start here",
    title: "Explore the products universe and find the setup that feels right.",
    description:
      "The next step is simple: browse the products, open a category, and let the marketplace do the editing for you.",
    primaryCta: "Open products",
    secondaryCta: "Return to top",
  },
} as const;
