
import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

interface OperatorNotesProps {
  notes: string;
  onNotesChange: (value: string) => void;
  onSaveNotes: () => void;
}

const OperatorNotes: React.FC<OperatorNotesProps> = ({ 
  notes, 
  onNotesChange,
  onSaveNotes 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>ملاحظات المشغل</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="أضف ملاحظاتك هنا..."
          className="min-h-[100px] text-right"
        />
      </CardContent>
      <CardFooter>
        <Button onClick={onSaveNotes}>حفظ الملاحظات</Button>
      </CardFooter>
    </Card>
  );
};

export default OperatorNotes;
