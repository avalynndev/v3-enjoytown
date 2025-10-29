import { cn } from "@/lib/utils";
import type { PropsWithChildren, HTMLAttributes } from "react";

interface ContainerProps
  extends PropsWithChildren<HTMLAttributes<HTMLDivElement>> {
  className?: string;
}

export const Container = ({ children, className, ...rest }: ContainerProps) => {
  return (
    <div
      className={cn("mx-auto max-w-7xl space-y-4 px-4 py-4", className)}
      {...rest}
    >
      {children}
    </div>
  );
};
