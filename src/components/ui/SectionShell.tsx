import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

type SectionShellProps = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
  className?: string;
  align?: "left" | "center";
};

export function SectionShell({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
  align = "left",
}: SectionShellProps) {
  return (
    <section id={id} className={cn("relative overflow-hidden py-[clamp(5rem,9vw,8rem)]", className)}>
      <div className="mx-auto w-[min(1180px,calc(100vw-2rem))]">
        <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
          <p className="text-xs uppercase tracking-[0.32em] text-muted">{eyebrow}</p>
          <h2 className="mt-4 font-display text-[clamp(2.5rem,5vw,5rem)] leading-[0.95] tracking-[-0.03em] text-ink">
            {title}
          </h2>
          <p className="mt-5 max-w-2xl text-[1.02rem] leading-8 text-muted">{description}</p>
        </div>
        {children ? <div className="mt-12">{children}</div> : null}
      </div>
    </section>
  );
}
