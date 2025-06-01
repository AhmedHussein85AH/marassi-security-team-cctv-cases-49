
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateIncidentPDF } from '@/utils/pdfGenerator';
import { Incident } from '@/types/incident';

interface ExportPDFButtonProps {
  incident: Incident;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'sm' | 'default' | 'lg';
}

const ExportPDFButton: React.FC<ExportPDFButtonProps> = ({ 
  incident, 
  variant = 'outline',
  size = 'default'
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleExportPDF = async () => {
    setIsGenerating(true);
    
    try {
      console.log('Generating PDF for incident:', incident.id);
      
      const pdf = await generateIncidentPDF(incident);
      
      // Save the PDF
      const fileName = `تقرير_البلاغ_${incident.id}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
      toast({
        title: 'تم تصدير التقرير',
        description: `تم إنشاء وتحميل تقرير PDF للبلاغ رقم ${incident.id}`,
      });
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: 'خطأ في التصدير',
        description: 'حدث خطأ أثناء إنشاء تقرير PDF',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={handleExportPDF}
      disabled={isGenerating}
      variant={variant}
      size={size}
      className="flex items-center gap-2"
    >
      {isGenerating ? (
        <Download className="h-4 w-4 animate-spin" />
      ) : (
        <FileText className="h-4 w-4" />
      )}
      {isGenerating ? 'جاري التصدير...' : 'تصدير PDF'}
    </Button>
  );
};

export default ExportPDFButton;
