import { cn } from "@/lib/cn";

interface AdminHeaderProps {
  title: string;
  description?: string;
  className?: string;
  actions?: React.ReactNode;
}

export function AdminHeader({
  title,
  description,
  className,
  actions,
}: AdminHeaderProps) {
  return (
    <div className={cn("mb-8", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl tracking-tight text-ink">
            {title}
          </h1>
          {description && (
            <p className="mt-2 text-muted">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
    </div>
  );
}
