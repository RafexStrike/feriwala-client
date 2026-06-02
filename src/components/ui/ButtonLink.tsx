import { cn } from "@/lib/cn";
import Link from "next/link";
import type { ReactNode } from "react";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
};

export function ButtonLink({ href, children, variant = "primary", className }: ButtonLinkProps) {
  const base =
    "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition-transform duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas";
  const styles =
    variant === "primary"
      ? "bg-ink text-canvas shadow-soft hover:-translate-y-0.5 hover:bg-ink/95"
      : "border border-line bg-surface text-ink hover:-translate-y-0.5 hover:border-ink/20 hover:bg-ink/5";

  return (
    <Link href={href} className={cn(base, styles, className)}>
      {children}
    </Link>
  );
}
