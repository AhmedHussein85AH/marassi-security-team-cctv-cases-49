
import React from "react";
import { ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface IncidentHeaderProps {
  incidentId: string;
  status: string;
  onCompleteIncident: () => void;
}

const IncidentHeader: React.FC<IncidentHeaderProps> = ({
  incidentId,
  status,
  onCompleteIncident,
}) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
      <div className="flex flex-1 items-center gap-4 md:gap-8">
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-1"
          onClick={() => navigate("/incidents")}
        >
          <ArrowLeft className="h-4 w-4 ml-1" />
          عودة للبلاغات
        </Button>
        <div className="mr-auto">
          {status !== "تم المعالجة" && (
            <Button onClick={onCompleteIncident} className="gap-1">
              <Check className="h-4 w-4 ml-1" />
              إنهاء البلاغ
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default IncidentHeader;
