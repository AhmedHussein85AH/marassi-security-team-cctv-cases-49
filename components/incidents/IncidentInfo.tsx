
import React from "react";
import { 
  AlertTriangle, 
  MapPin, 
  Calendar,
  Clock, 
  User
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface IncidentInfoProps {
  incident: {
    type: string;
    location: string;
    date: string;
    time: string;
    reporter: string;
  };
}

const IncidentInfo: React.FC<IncidentInfoProps> = ({ incident }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>معلومات البلاغ</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <div>
            <div className="font-medium">نوع البلاغ</div>
            <div className="text-sm text-muted-foreground">{incident.type}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          <div>
            <div className="font-medium">الموقع</div>
            <div className="text-sm text-muted-foreground">{incident.location}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          <div>
            <div className="font-medium">التاريخ</div>
            <div className="text-sm text-muted-foreground">{incident.date}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          <div>
            <div className="font-medium">الوقت</div>
            <div className="text-sm text-muted-foreground">{incident.time}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <User className="h-5 w-5" />
          <div>
            <div className="font-medium">المبلغ</div>
            <div className="text-sm text-muted-foreground">{incident.reporter}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IncidentInfo;
