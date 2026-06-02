import { categories } from "@/config/categories";
import { featuredProducts } from "@/config/products";

export type SceneItem = {
  id: string;
  label: string;
  kind: "keyboard" | "mouse" | "speaker" | "dock" | "tool" | "lamp" | "gadget" | "hub";
  color: string;
  accent: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
};

export const floatingUniverseItems: SceneItem[] = featuredProducts.slice(0, 6).map((product, index) => ({
  id: product.slug,
  label: product.name,
  kind: index === 0 ? "keyboard" : index === 1 ? "mouse" : index === 2 ? "speaker" : index === 3 ? "tool" : index === 4 ? "dock" : "gadget",
  color: product.accent,
  accent: product.accent,
  position: [
    [-2.6, 0.6, -0.5],
    [2.1, -0.4, 0.2],
    [0.8, 1.4, -0.7],
    [-1.4, -1.3, 0.6],
    [2.8, 1.3, -0.2],
    [0.1, -0.9, 0.9],
  ][index] as [number, number, number],
  rotation: [
    [0.2, -0.4, -0.1],
    [-0.1, 0.5, 0.2],
    [0.6, 0.3, -0.3],
    [-0.5, -0.2, 0.1],
    [0.3, 0.7, 0.2],
    [0.15, -0.6, 0.25],
  ][index] as [number, number, number],
  scale: [1.15, 0.85, 0.9, 0.72, 0.7, 0.62][index],
}));

export const assemblyItems: SceneItem[] = featuredProducts.slice(0, 5).map((product, index) => ({
  id: `assembly-${product.slug}`,
  label: product.name,
  kind: index === 0 ? "keyboard" : index === 1 ? "dock" : index === 2 ? "lamp" : index === 3 ? "mouse" : "gadget",
  color: product.accent,
  accent: product.accent,
  position: [
    [-3.2 + index * 1.55, 0.6 - index * 0.14, -0.2 + index * 0.08],
    [-2.2 + index * 1.2, -0.3 + index * 0.06, 0.1 - index * 0.05],
    [-1.1 + index * 0.8, 0.9 - index * 0.2, -0.15],
    [0, 0, 0],
    [1.4, -0.5, 0.2],
  ][index] as [number, number, number],
  rotation: [
    [0.25, -0.3, -0.15],
    [0.1, 0.2, 0.1],
    [-0.2, 0.45, -0.1],
    [0.35, -0.15, 0.1],
    [-0.15, 0.3, 0.2],
  ][index] as [number, number, number],
  scale: [1, 0.85, 0.74, 0.66, 0.56][index],
}));

export const categoryGalaxyItems: SceneItem[] = categories.map((category, index) => ({
  id: category.slug,
  label: category.name,
  kind: index % 4 === 0 ? "keyboard" : index % 4 === 1 ? "mouse" : index % 4 === 2 ? "dock" : "gadget",
  color: category.accent,
  accent: category.accent,
  position: [
    Math.cos((index / categories.length) * Math.PI * 2) * 2.7,
    Math.sin((index / categories.length) * Math.PI * 2) * 1.7,
    index % 2 === 0 ? -0.4 : 0.3,
  ] as [number, number, number],
  rotation: [0.2 * index, -0.3 + index * 0.04, 0.12 * index] as [number, number, number],
  scale: 0.58 + (index % 3) * 0.1,
}));

export const marketplaceExplosionItems: SceneItem[] = featuredProducts.map((product, index) => ({
  id: `market-${product.slug}`,
  label: product.name,
  kind: index % 3 === 0 ? "hub" : index % 3 === 1 ? "tool" : "gadget",
  color: product.accent,
  accent: product.accent,
  position: [
    [0, 0, 0],
    [1.8, 0.7, -0.2],
    [-1.6, -0.8, 0.5],
    [0.6, -1.8, -0.1],
    [-2.1, 1.4, 0.2],
    [2.4, -1.2, 0.3],
    [-0.4, 2.1, -0.25],
    [1.1, -0.2, 1.1],
  ][index] as [number, number, number],
  rotation: [
    [0.15, 0.12, 0],
    [0.25, -0.2, 0.1],
    [-0.3, 0.35, -0.05],
    [0.05, -0.24, 0.14],
    [0.2, 0.5, 0.12],
    [-0.1, -0.35, 0.1],
    [0.4, 0.14, -0.18],
    [0.3, -0.2, 0.25],
  ][index] as [number, number, number],
  scale: [1.1, 0.92, 0.84, 0.66, 0.6, 0.64, 0.56, 0.5][index],
}));

export const formationItems: SceneItem[] = featuredProducts.slice(0, 6).map((product, index) => ({
  id: `formation-${product.slug}`,
  label: product.name,
  kind: index === 0 ? "keyboard" : index === 1 ? "mouse" : index === 2 ? "speaker" : index === 3 ? "hub" : index === 4 ? "tool" : "gadget",
  color: product.accent,
  accent: product.accent,
  position: [[-2.2, 0.8, -0.6], [1.8, 0.2, 0.3], [0.3, 1.4, -0.2], [-1.4, -1.1, 0.4], [2.4, -0.8, -0.1], [0.7, -1.6, 0.7]][index] as [number, number, number],
  rotation: [[0.1, -0.25, -0.12], [0.18, 0.35, 0.08], [-0.2, 0.45, -0.14], [0.35, -0.1, 0.1], [-0.12, 0.26, 0.16], [0.24, -0.38, 0.2]][index] as [number, number, number],
  scale: [0.96, 0.88, 0.72, 0.66, 0.62, 0.54][index],
}));
