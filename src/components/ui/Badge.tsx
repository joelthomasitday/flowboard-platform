import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "primary" | "secondary" | "accent" | "outline";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-surface-sunken text-deep-blue/60 border-border-soft",
  primary: "bg-deep-blue/5 text-deep-blue border-deep-blue/10",
  secondary: "bg-soft-blue/10 text-deep-blue border-soft-blue/20",
  accent: "bg-light-green/15 text-deep-blue border-light-green/30",
  outline: "bg-transparent text-deep-blue/60 border-border-blue/40",
};

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest",
        "transition-colors duration-200",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}
