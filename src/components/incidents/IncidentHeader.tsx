
import React from "react";
import { ArrowLeft, Check, Search, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";

interface IncidentHeaderProps {
  // For incident detail page
  incidentId?: string;
  status?: string;
  onCompleteIncident?: () => void;
  onDeleteIncident?: () => void;
  
  // For incidents dashboard
  searchTerm?: string;
  onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNewIncident?: (incidentData: any) => void;
}

const IncidentHeader: React.FC<IncidentHeaderProps> = ({
  incidentId,
  status,
  onCompleteIncident,
  onDeleteIncident,
  searchTerm,
  onSearchChange,
  onNewIncident
}) => {
  const navigate = useNavigate();

  // For incident detail page
  if (incidentId && status) {
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
          <div className="mr-auto flex items-center gap-2">
            {status !== "تم المعالجة" && onCompleteIncident && (
              <Button onClick={onCompleteIncident} className="gap-1">
                <Check className="h-4 w-4 ml-1" />
                إنهاء البلاغ
              </Button>
            )}
            
            {onDeleteIncident && (
              <Button onClick={onDeleteIncident} variant="destructive" className="gap-1">
                <Trash2 className="h-4 w-4 ml-1" />
                حذف البلاغ
              </Button>
            )}
          </div>
        </div>
      </header>
    );
  }

  // For incidents dashboard
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
      <div className="flex flex-1 items-center gap-4 md:gap-8">
        <h1 className="text-xl font-semibold">البلاغات</h1>
        <div className="ml-auto flex gap-2">
          <div className="max-w-sm">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="بحث في البلاغات..."
                className="pl-8 pr-4"
                value={searchTerm}
                onChange={onSearchChange}
              />
            </div>
          </div>
          {onNewIncident && (
            <Button onClick={() => onNewIncident({})}>
              <Plus className="mr-1 h-4 w-4" />
              بلاغ جديد
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default IncidentHeader;
