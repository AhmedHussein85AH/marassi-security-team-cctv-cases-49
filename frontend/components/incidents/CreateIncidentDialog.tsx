
import React, { useState } from "react";
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
import type { Incident } from "@/types/incident";

interface CreateIncidentDialogProps {
  onSubmit: (incidentData: Partial<Incident>) => void;
}

const CreateIncidentDialog: React.FC<CreateIncidentDialogProps> = ({ onSubmit }) => {
  const [open, setOpen] = useState(false);

  const handleSubmit = (incidentData: Partial<Incident>) => {
    onSubmit(incidentData);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>إضافة بلاغ جديد</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]" dir="rtl">
        <DialogHeader>
          <DialogTitle>إضافة بلاغ جديد</DialogTitle>
        </DialogHeader>
        <IncidentForm onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateIncidentDialog;
