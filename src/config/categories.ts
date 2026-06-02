export type Category = {
  slug: string;
  name: string;
  summary: string;
  accent: string;
  count: string;
};

export const categories: Category[] = [
  {
    slug: "keyboards",
    name: "Keyboards",
    summary: "Typing hardware with tactile stories, soft lighting, and a clean desk presence.",
    accent: "#6b98b5",
    count: "18 builds",
  },
  {
    slug: "mice",
    name: "Mice",
    summary: "Precision controls and compact forms tuned for work, play, and travel.",
    accent: "#c8857b",
    count: "12 shapes",
  },
  {
    slug: "audio",
    name: "Audio",
    summary: "Desk speakers, headsets, and compact listening tools with calm industrial lines.",
    accent: "#d2926f",
    count: "21 items",
  },
  {
    slug: "cleaning-tools",
    name: "Cleaning Tools",
    summary: "Soft kits, air tools, and maintenance gear that keep the setup looking intentional.",
    accent: "#8e9b8c",
    count: "9 kits",
  },
  {
    slug: "desk-accessories",
    name: "Desk Accessories",
    summary: "Trays, stands, lamps, risers, and the small pieces that finish the ritual.",
    accent: "#7f8f9b",
    count: "27 pieces",
  },
  {
    slug: "hubs",
    name: "Hubs",
    summary: "Docking, power, and expansion tools that make the desk feel unblocked.",
    accent: "#b69a6b",
    count: "14 hubs",
  },
  {
    slug: "gadgets",
    name: "Gadgets",
    summary: "Pocket companions and utility pieces for discovery-minded tech users.",
    accent: "#9a7fb6",
    count: "24 gadgets",
  },
];

export const categorySlugs = categories.map((category) => category.slug);
