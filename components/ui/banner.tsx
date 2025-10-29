import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

type BannerProps = {
  url?: string;
} & ComponentProps<"div">;

export const Banner = ({ url, className, ...props }: BannerProps) => {
  return (
    <div
      {...props}
      className={cn(
        "w-full overflow-hidden md:rounded-lg aspect-16/7 border-b lg:border max-h-[55dvh]",
        !url && "border-dashed bg-background",
        className,
      )}
    >
      <div
        style={{
          backgroundImage: `url('${url}')`,
          backgroundSize: "cover",
        }}
        className="h-full w-full"
      />
    </div>
  );
};
