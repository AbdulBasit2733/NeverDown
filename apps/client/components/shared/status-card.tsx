import { WebsiteDisplay } from "@/services/websiteService";
import { Badge } from "../ui/badge";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";

export function StatusBadge({ status }: { status: WebsiteDisplay["status"] }) {
  if (status === "up")
    return (
      <Badge variant="outline" className="gap-1.5 text-green-600 border-green-200 bg-green-50 dark:bg-green-950/30 dark:border-green-900 dark:text-green-400">
        <CheckCircle className="w-3 h-3" /> Online
      </Badge>
    );
  if (status === "down")
    return (
      <Badge variant="outline" className="gap-1.5 text-destructive border-destructive/20 bg-destructive/5">
        <AlertCircle className="w-3 h-3" /> Offline
      </Badge>
    );
  return (
    <Badge variant="outline" className="gap-1.5 text-yellow-600 border-yellow-200 bg-yellow-50 dark:bg-yellow-950/30 dark:border-yellow-900 dark:text-yellow-400">
      <Clock className="w-3 h-3 animate-spin" /> Checking
    </Badge>
  );
}