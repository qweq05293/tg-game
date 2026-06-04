import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { Loading03Icon } from "@hugeicons/core-free-icons";

// 1. Explicitly omit native attributes that could cause object-property conflicts
interface SpinnerProps extends Omit<
  React.ComponentProps<"svg">,
  "strokeWidth"
> {
  strokeWidth?: number; // Re-define it strictly as a number matching HugeiconsIcon
}

function Spinner({ className, strokeWidth = 2, ...props }: SpinnerProps) {
  return (
    <HugeiconsIcon
      icon={Loading03Icon}
      strokeWidth={strokeWidth} // 2. Now strictly typed as a number
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  );
}

export { Spinner };
