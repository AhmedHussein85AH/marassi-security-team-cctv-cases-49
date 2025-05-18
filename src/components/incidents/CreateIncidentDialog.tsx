
import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import IncidentForm from "@/components/incidents/IncidentForm";
import type { Incident } from "@/stores/incidentStore";

interface CreateIncidentDialogProps {
  onSubmit: (incidentData: Partial<Incident>) => void;
}

const CreateIncidentDialog: React.FC<CreateIncidentDialogProps> = ({ onSubmit }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>إضافة بلاغ جديد</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]" dir="rtl">
        <DialogHeader>
          <DialogTitle>إضافة بلاغ جديد</DialogTitle>
        </DialogHeader>
        <IncidentForm onSubmit={onSubmit} />
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateIncidentDialog;
