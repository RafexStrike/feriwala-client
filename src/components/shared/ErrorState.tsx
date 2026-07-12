import { cn } from '@/lib/cn';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  icon?: LucideIcon;
  title: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export function ErrorState({
  icon: Icon,
  title,
  message,
  onRetry,
  retryLabel = 'Try again',
  className,
}: ErrorStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center py-16 px-4', className)}>
      {Icon && (
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-clay/10 text-clay">
          <Icon className="h-8 w-8" strokeWidth={1.5} />
        </div>
      )}
      <h3 className="font-display text-2xl text-ink">{title}</h3>
      <p className="mt-2 max-w-sm text-muted">{message}</p>
      {onRetry && (
        <Button className="mt-6" variant="default" onClick={onRetry}>
          {retryLabel}
        </Button>
      )}
    </div>
  );
}