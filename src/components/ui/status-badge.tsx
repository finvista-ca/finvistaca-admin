import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const s = status.toLowerCase();
  
  let variant: "default" | "secondary" | "destructive" | "outline" = "default";
  let customClass = "";

  if (["completed", "confirmed", "delivered", "resolved"].includes(s)) {
    customClass = "bg-emerald-100 text-emerald-800 hover:bg-emerald-100/80 border-emerald-200";
  } else if (["pending", "new"].includes(s)) {
    customClass = "bg-amber-100 text-amber-800 hover:bg-amber-100/80 border-amber-200";
  } else if (["cancelled", "failed", "rejected"].includes(s)) {
    variant = "destructive";
  } else if (["sent", "contacted", "shortlisted"].includes(s)) {
    customClass = "bg-blue-100 text-blue-800 hover:bg-blue-100/80 border-blue-200";
  } else {
    variant = "outline";
  }

  return (
    <Badge 
      variant={variant} 
      className={cn("capitalize px-2.5 py-0.5", customClass, className)}
    >
      {status}
    </Badge>
  );
}
