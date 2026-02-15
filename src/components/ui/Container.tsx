import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Container({ className, children, ...props }: ContainerProps) {
  return (
    <div
      className={cn("mx-auto w-full max-w-[1440px] px-6 sm:px-10 lg:px-16", className)}
      {...props}
    >
      {children}
    </div>
  );
}
