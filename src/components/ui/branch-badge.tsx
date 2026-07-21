import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface BranchBadgeProps {
  branch?: string;
  className?: string;
}

export function BranchBadge({ branch, className }: BranchBadgeProps) {
  if (!branch) return <span className={className}>-</span>;
  
  const isHeadOffice = branch === "Vijayawada" || branch === "Vijayawada (Head Office)";
  const displayName = isHeadOffice ? "Vijayawada" : branch;

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <span>{displayName}</span>
      {isHeadOffice && (
        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-[10px] px-1.5 py-0 leading-none h-[18px] font-medium shrink-0">
          Head Office
        </Badge>
      )}
    </div>
  );
}
