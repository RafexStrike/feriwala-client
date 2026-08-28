import { categories } from "@/config/categories";

export type ProductCard = {
  slug: string;
  name: string;
  categorySlug: string;
  categoryName: string;
  priceLabel: string;
  summary: string;
  accent: string;
  chips: string[];
};

export const featuredProducts: ProductCard[] = [
  {
    slug: "orbit-75",
    name: "Orbit 75 Keyboard",
    categorySlug: "keyboards",
    categoryName: "Keyboards",
    priceLabel: "From ৳179",
    summary: "A compact, tactile board with a sculpted profile and quiet premium glow.",
    accent: "#6b98b5",
    chips: ["Hot-swappable", "75% layout", "PBT keycaps"],
  },
  {
    slug: "vector-one",
    name: "Vector One Mouse",
    categorySlug: "mice",
    categoryName: "Mice",
    priceLabel: "From ৳89",
    summary: "Light, precise, and calm in the hand with a shape that disappears into focus.",
    accent: "#c8857b",
    chips: ["54g", "Hybrid grip", "Silent click"],
  },
  {
    slug: "halo-dock",
    name: "Halo Dock Audio",
    categorySlug: "audio",
    categoryName: "Audio",
    priceLabel: "From ৳149",
    summary: "A desk speaker with warm tones, a minimal bezel, and layered output control.",
    accent: "#d2926f",
    chips: ["Bluetooth 5.4", "Stereo pair", "Desk mode"],
  },
  {
    slug: "clean-loop",
    name: "Clean Loop Kit",
    categorySlug: "cleaning-tools",
    categoryName: "Cleaning Tools",
    priceLabel: "From ৳34",
    summary: "A soft maintenance kit for screens, switches, surfaces, and weekly resets.",
    accent: "#8e9b8c",
    chips: ["Microfiber", "Brush set", "Travel pouch"],
  },
  {
    slug: "edge-riser",
    name: "Edge Riser",
    categorySlug: "desk-accessories",
    categoryName: "Desk Accessories",
    priceLabel: "From ৳69",
    summary: "A low-profile elevation piece that clears space and keeps lines crisp.",
    accent: "#7f8f9b",
    chips: ["Aluminum", "Cable pass", "Anti-slip"],
  },
  {
    slug: "flow-hub",
    name: "Flow Hub 7",
    categorySlug: "hubs",
    categoryName: "Hubs",
    priceLabel: "From ৳129",
    summary: "A compact expansion hub with power delivery, display routing, and quiet utility.",
    accent: "#b69a6b",
    chips: ["7 ports", "4K ready", "PD 100W"],
  },
  {
    slug: "micro-glow",
    name: "Micro Glow Gadget",
    categorySlug: "gadgets",
    categoryName: "Gadgets",
    priceLabel: "From ৳49",
    summary: "A pocket-sized tool for tiny tasks, subtle indicators, and desk-side delight.",
    accent: "#9a7fb6",
    chips: ["USB-C", "Haptic cue", "Portable"],
  },
  {
    slug: "tone-arc",
    name: "Tone Arc Headset",
    categorySlug: "audio",
    categoryName: "Audio",
    priceLabel: "From ৳219",
    summary: "A soft-contact headset built for long sessions, clean calls, and clear playlists.",
    accent: "#d2926f",
    chips: ["ANC", "48h battery", "Soft pads"],
  },
];

export const productsByCategory = categories.reduce<Record<string, ProductCard[]>>((collection, category) => {
  collection[category.slug] = featuredProducts.filter((product) => product.categorySlug === category.slug);
  return collection;
}, {});
