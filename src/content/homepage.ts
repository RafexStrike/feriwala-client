import { categories } from "@/config/categories";
import { featuredProducts } from "@/config/products";

export const homepageContent = {
  nav: {
    logo: "Feriwala",
    primary: { label: "Products", href: "/products" },
  },
  hero: {
    eyebrow: "Curated marketplace for your setup",
    title: "Products for people who care.",
    description:
      "Discover keyboards, mice, audio gear, desk accessories, and productivity gadgets hand-picked for quality and intention.",
    primaryCta: "Explore Products",
    image: "https://images.unsplash.com/photo-1587829191301-d55a63c75d4e?w=1200&q=80",
  },
  categories: {
    eyebrow: "Browse by category",
    title: "Find what you're looking for.",
    description: "Explore our curated collection organized by product type.",
    items: categories.map((category) => ({
      slug: category.slug,
      name: category.name,
      summary: category.summary,
      accent: category.accent,
      count: category.count,
    })),
  },
  brandStatement: {
    eyebrow: "Why Feriwala",
    title: "A curated marketplace, not a catalog.",
    description:
      "We believe great tools make work feel better. Every product on Feriwala is chosen for its quality, design, and purpose. No algorithm. No endless scrolling. Just the best.",
    highlights: [
      {
        title: "Carefully Curated",
        description: "Every product is hand-selected for quality and intention.",
      },
      {
        title: "Multi-Vendor",
        description: "Discover products from makers and brands worldwide.",
      },
      {
        title: "Productivity-Focused",
        description: "Tools designed to make your setup feel better.",
      },
    ],
  },
  featured: {
    eyebrow: "Featured products",
    title: "Start exploring.",
    description: "A selection of our most popular and highest-rated items.",
    cta: "Browse all products",
    products: featuredProducts.slice(0, 6),
  },
  trust: {
    eyebrow: "Why trust us",
    title: "Built for people who care about their setup.",
    description:
      "We're obsessed with quality, discovery, and making your workspace feel intentional.",
    proof: [
      "Vendor-verified products",
      "Premium curation process",
      "Community-driven reviews",
    ],
  },
  finalCta: {
    eyebrow: "Ready to explore",
    title: "Find your next favorite product.",
    description: "Browse our full collection and discover tools that fit your style.",
    primaryCta: "Explore Products",
    secondaryCta: "Learn more",
  },
} as const;
