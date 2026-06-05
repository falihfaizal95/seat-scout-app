import { PLATFORM_INFO, type Platform } from "@/types/ticket";
import { cn } from "@/lib/utils";

interface PlatformBadgeProps {
  platform: Platform;
  size?: "sm" | "md" | "lg";
  showName?: boolean;
  className?: string;
}

export default function PlatformBadge({ platform, size = "md", showName = true, className }: PlatformBadgeProps) {
  const info = PLATFORM_INFO[platform];
  if (!info) return null;

  const sizes = {
    sm: "text-[11px] px-2 py-1 gap-1.5",
    md: "text-sm px-2.5 py-1.5 gap-2",
    lg: "text-base px-3 py-2 gap-2.5",
  };

  const dotSizes = {
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2",
    lg: "w-2.5 h-2.5",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-semibold rounded-lg border transition-colors",
        sizes[size],
        className
      )}
      style={{
        backgroundColor: `${info.color}18`,
        borderColor: `${info.color}35`,
        color: info.color,
      }}
    >
      <span className={cn("rounded-full flex-shrink-0", dotSizes[size])} style={{ backgroundColor: info.color }} />
      {showName && info.name}
    </span>
  );
}
