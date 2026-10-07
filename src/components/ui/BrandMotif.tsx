import { cn } from "@/lib/cn";

type BrandMotifProps = {
  className?: string;
  monochrome?: boolean;
};

export function BrandMotif({ className, monochrome = false }: BrandMotifProps) {
  const colors = monochrome ? ["#171410", "#171410", "#171410"] : ["#f58c4c", "#f46764", "#37aff5"];

  return (
    <div aria-hidden="true" className={cn("brand-motif", className)}>
      {colors.map((color, index) => (
        <span
          key={`${color}-${index}`}
          className="block h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
}
