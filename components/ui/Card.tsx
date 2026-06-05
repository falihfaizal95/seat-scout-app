import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glass?: boolean;
  hover?: boolean;
  onClick?: () => void;
}

export default function Card({
  children,
  className,
  glass = false,
  hover = false,
  onClick,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-2xl border border-[var(--border)]",
        glass ? "glass" : "bg-[var(--bg-secondary)]",
        hover && "cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-soft dark:hover:shadow-soft-dark hover:border-brand-200 dark:hover:border-brand-800",
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}
