import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AlertTriangle, MessageCircle, Clipboard, Trash2 } from "lucide-react";
import type { Incident } from "@/types/incident";

interface IncidentTableProps {
  incidents: Incident[];
  onViewDetails: (id: string) => void;
  onDeleteIncident?: (id: string) => void;
}

const IncidentTable: React.FC<IncidentTableProps> = ({ incidents, onViewDetails, onDeleteIncident }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "تم المعالجة":
        return <Badge className="bg-green-100 text-green-800">{status}</Badge>;
      case "قيد المعالجة":
        return <Badge className="bg-blue-100 text-blue-800">{status}</Badge>;
      case "معلق":
        return <Badge className="bg-yellow-100 text-yellow-800">{status}</Badge>;
      case "جديد":
        return <Badge className="bg-purple-100 text-purple-800">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Table className="w-full">
      <TableHeader>
        <TableRow>
          <TableHead className="text-right w-[100px]">رقم البلاغ</TableHead>
          <TableHead className="text-right w-[150px]">نوع البلاغ</TableHead>
          <TableHead className="text-right w-[200px]">الموقع</TableHead>
          <TableHead className="text-right w-[120px]">التاريخ</TableHead>
          <TableHead className="text-right w-[100px]">الوقت</TableHead>
          <TableHead className="text-right w-[130px]">الحالة</TableHead>
          <TableHead className="text-right w-[150px]">المبلغ</TableHead>
          <TableHead className="text-right w-[100px]">التعليقات</TableHead>
          <TableHead className="text-right w-[150px]">ملاحظات المشغل</TableHead>
          <TableHead className="text-right w-[150px]">الإجراءات</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {incidents.map((incident) => (
          <TableRow key={incident.id}>
            <TableCell className="text-right">{incident.id}</TableCell>
            <TableCell className="text-right">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <span>{incident.type}</span>
              </div>
            </TableCell>
            <TableCell className="text-right">{incident.location}</TableCell>
            <TableCell className="text-right">{incident.date}</TableCell>
            <TableCell className="text-right">{incident.time}</TableCell>
            <TableCell className="text-right">{getStatusBadge(incident.status)}</TableCell>
            <TableCell className="text-right">{incident.reporter}</TableCell>
            <TableCell>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>{incident.comments.length}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="max-w-xs">
                      {incident.comments.length > 0 ? (
                        incident.comments.map((comment, idx) => (
                          <div key={idx} className="mb-2">
                            <div className="text-sm font-bold">{comment.user}</div>
                            <div className="text-sm">{comment.text}</div>
                            <div className="text-xs text-gray-500">{comment.timestamp}</div>
                          </div>
                        ))
                      ) : (
                        <span>لا توجد تعليقات</span>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TableCell>
            <TableCell>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex items-center gap-1">
                      <Clipboard className="w-4 h-4" />
                      {incident.operatorNotes ? (
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      ) : null}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="max-w-xs">
                      {incident.operatorNotes || "لا توجد ملاحظات"}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost"
                  size="sm" 
                  onClick={() => onViewDetails(incident.id)}
                >
                  عرض التفاصيل
                </Button>
                {onDeleteIncident && (
                  <Button 
                    variant="destructive"
                    size="sm" 
                    onClick={() => onDeleteIncident(incident.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default IncidentTable;
