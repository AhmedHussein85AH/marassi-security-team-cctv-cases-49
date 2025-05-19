
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface IncidentDetailsProps {
  incident: {
    description: string;
    propertyInfo?: string;
    vehicleInfo?: string;
  };
}

const IncidentDetails: React.FC<IncidentDetailsProps> = ({ incident }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>تفاصيل إضافية</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="font-medium mb-2">وصف الحادث</div>
          <div className="text-sm text-muted-foreground whitespace-pre-wrap text-right">
            {incident.description}
          </div>
        </div>

        {incident.propertyInfo && (
          <div>
            <div className="font-medium mb-2">معلومات العقار</div>
            <div className="text-sm text-muted-foreground whitespace-pre-wrap text-right">
              {incident.propertyInfo}
            </div>
          </div>
        )}

        {incident.vehicleInfo && (
          <div>
            <div className="font-medium mb-2">تفاصيل المركبات</div>
            <div className="text-sm text-muted-foreground whitespace-pre-wrap text-right">
              {incident.vehicleInfo}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IncidentDetails;
