import { cn } from '@/lib/cn';

interface PriceDisplayProps {
  price: number;
  originalPrice?: number;
  currency?: string;
  locale?: string;
  className?: string;
  showCurrencySymbol?: boolean;
}

export function PriceDisplay({
  price,
  originalPrice,
  currency = 'BDT',
  locale = 'en-BD',
  className,
  showCurrencySymbol = true,
}: PriceDisplayProps) {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  const formattedPrice = formatter.format(price);
  const formattedOriginal = originalPrice ? formatter.format(originalPrice) : null;

  return (
    <div className={cn('flex items-baseline gap-2', className)}>
      <span className="font-medium text-ink">{formattedPrice}</span>
      {formattedOriginal && (
        <span className="text-sm line-through text-muted">{formattedOriginal}</span>
      )}
    </div>
  );
}

export function PriceRange({ min, max, ...props }: { min: number; max: number } & Omit<PriceDisplayProps, 'price'>) {
  const locale = props.locale ?? 'en-BD';
  const currency = props.currency ?? 'BDT';

  if (min === max) return <PriceDisplay price={min} {...props} locale={locale} currency={currency} />;
  
  return (
    <div className={cn('flex items-baseline gap-2', props.className)}>
      <span className="font-medium text-ink">
        {new Intl.NumberFormat(locale, { style: 'currency', currency, currencyDisplay: 'narrowSymbol' }).format(min)}
        {' '}–{' '}
        {new Intl.NumberFormat(locale, { style: 'currency', currency, currencyDisplay: 'narrowSymbol' }).format(max)}
      </span>
    </div>
  );
}