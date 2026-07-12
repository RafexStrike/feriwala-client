import { cn } from '@/lib/cn';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
    variant?: 'default' | 'outline';
  };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center py-16 px-4', className)}>
      <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted/10 text-muted">
        <Icon className="h-8 w-8" strokeWidth={1.5} />
      </div>
      <h3 className="font-display text-2xl text-ink">{title}</h3>
      <p className="mt-2 max-w-sm text-muted">{description}</p>
      {action && (
        <Button
          className="mt-6"
          variant={action.variant || 'default'}
          asChild={!!action.href}
          onClick={action.onClick}
        >
          {action.href ? (
            <a href={action.href}>{action.label}</a>
          ) : (
            action.label
          )}
        </Button>
      )}
    </div>
  );
}