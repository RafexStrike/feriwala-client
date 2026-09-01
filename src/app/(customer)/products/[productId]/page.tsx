import { notFound } from "next/navigation";
import { ProductDetailContent } from "./ProductDetailContent";

interface Props {
  params: Promise<{ productId: string }>;
}

export async function generateStaticParams() {
  return [];
}

export default async function ProductDetailPage({ params }: Props) {
  const { productId } = await params;
  const product = await getProductServer(productId);

  if (!product) {
    notFound();
  }

  return <ProductDetailContent initialProduct={product} productId={productId} />;
}

async function getProductServer(productId: string) {
  try {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
    const response = await fetch(`${API_BASE}/products/${productId}`, {
      next: { revalidate: 60 },
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.success ? data.data : null;
  } catch {
    return null;
  }
}