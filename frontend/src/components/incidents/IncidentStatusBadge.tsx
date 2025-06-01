
import React from "react";
import { Badge } from "@/components/ui/badge";

interface IncidentStatusBadgeProps {
  status: string;
}

const IncidentStatusBadge: React.FC<IncidentStatusBadgeProps> = ({ status }) => {
  let variant: "default" | "success" | "warning" | "info" = "default";

  switch (status) {
    case "تم المعالجة":
      variant = "success";
      break;
    case "قيد المعالجة":
      variant = "info";
      break;
    case "معلق":
      variant = "warning";
      break;
    default:
      variant = "default";
  }

  return (
    <Badge variant={variant} className="mr-2">
      {status}
    </Badge>
  );
};

export default IncidentStatusBadge;
