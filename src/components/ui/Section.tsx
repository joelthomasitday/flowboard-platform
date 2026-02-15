import { cn } from "@/lib/utils";

type SectionSpacing = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  spacing?: SectionSpacing;
}

const spacingStyles: Record<SectionSpacing, string> = {
  none: "py-0",
  xs: "py-6 md:py-8",
  sm: "py-10 md:py-16",
  md: "py-16 md:py-24",
  lg: "py-24 md:py-32",
  xl: "py-32 md:py-48",
  "2xl": "py-48 md:py-64",
};

export function Section({
  className,
  spacing = "lg",
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(spacingStyles[spacing], className)}
      {...props}
    >
      {children}
    </section>
  );
}
