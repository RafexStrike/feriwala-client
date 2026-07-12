import { cn } from "@/lib/cn";

interface PageHeaderProps {
  title: string;
  description?: string;
  eyebrow?: string;
  className?: string;
  actions?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  eyebrow,
  className,
  actions,
}: PageHeaderProps) {
  return (
    <div className={cn("max-w-3xl", className)}>
      {eyebrow && (
        <p className="text-xs uppercase tracking-[0.32em] text-muted">{eyebrow}</p>
      )}
      <h1 className="mt-4 font-display text-[clamp(2.5rem,5vw,4.8rem)] leading-[0.95] tracking-[-0.03em] text-ink">
        {title}
      </h1>
      {description && (
        <p className="mt-5 max-w-2xl text-[1.02rem] leading-8 text-muted">{description}</p>
      )}
      {actions && <div className="mt-6">{actions}</div>}
    </div>
  );
}