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
    "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas";
  const styles =
    variant === "primary"
      ? "bg-gradient-to-r from-orange to-coral text-white shadow-[0_18px_35px_rgba(245,140,76,0.26)] hover:-translate-y-0.5 hover:shadow-[0_22px_40px_rgba(244,103,100,0.28)]"
      : "border border-line bg-surface text-ink hover:-translate-y-0.5 hover:border-ink/20 hover:bg-white/60";

  return (
    <Link href={href} className={cn(base, styles, className)}>
      {children}
    </Link>
  );
}
