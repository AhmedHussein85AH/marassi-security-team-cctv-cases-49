
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateIncidentPDF } from '@/utils/pdfGenerator';
import { Incident } from '@/types/incident';

interface EmailReportDialogProps {
  incident: Incident;
}

const EmailReportDialog: React.FC<EmailReportDialogProps> = ({ incident }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [emailData, setEmailData] = useState({
    to: '',
    cc: '',
    subject: `تقرير البلاغ رقم ${incident.id}`,
    message: `السلام عليكم ورحمة الله وبركاته،

نرفق لكم تقرير البلاغ رقم ${incident.id} الذي تم تسجيله بتاريخ ${incident.date}.

تفاصيل البلاغ:
- نوع البلاغ: ${incident.type}
- الموقع: ${incident.location}
- الحالة: ${incident.status}
- المبلغ: ${incident.reporter}

يرجى مراجعة التقرير المرفق للاطلاع على التفاصيل الكاملة.

مع تحياتنا،
فريق الأمن والسلامة`
  });
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const handleSendEmail = async () => {
    if (!emailData.to.trim()) {
      toast({
        title: 'خطأ',
        description: 'يرجى إدخال عنوان بريد إلكتروني صحيح',
        variant: 'destructive',
      });
      return;
    }

    setIsSending(true);

    try {
      // Generate PDF
      console.log('Generating PDF for email...');
      const pdf = await generateIncidentPDF(incident);
      
      // Convert PDF to base64 for email attachment
      const pdfBlob = pdf.output('blob');
      const pdfBase64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(pdfBlob);
      });

      // Here you would integrate with your email service
      // For now, we'll simulate the email sending
      console.log('Email data:', {
        to: emailData.to,
        cc: emailData.cc,
        subject: emailData.subject,
        message: emailData.message,
        attachment: pdfBase64
      });

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: 'تم إرسال البريد الإلكتروني',
        description: `تم إرسال تقرير البلاغ رقم ${incident.id} إلى ${emailData.to}`,
      });

      setIsOpen(false);
      setEmailData(prev => ({ ...prev, to: '', cc: '', message: prev.message }));

    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: 'خطأ في الإرسال',
        description: 'حدث خطأ أثناء إرسال البريد الإلكتروني',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          إرسال بالبريد
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]" dir="rtl">
        <DialogHeader>
          <DialogTitle>إرسال تقرير البلاغ بالبريد الإلكتروني</DialogTitle>
          <DialogDescription>
            أدخل تفاصيل البريد الإلكتروني لإرسال تقرير البلاغ رقم {incident.id}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="email-to">إلى *</Label>
            <Input
              id="email-to"
              type="email"
              placeholder="example@email.com"
              value={emailData.to}
              onChange={(e) => setEmailData(prev => ({ ...prev, to: e.target.value }))}
              className="text-right"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="email-cc">نسخة كربونية (اختياري)</Label>
            <Input
              id="email-cc"
              type="email"
              placeholder="cc@email.com"
              value={emailData.cc}
              onChange={(e) => setEmailData(prev => ({ ...prev, cc: e.target.value }))}
              className="text-right"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="email-subject">الموضوع</Label>
            <Input
              id="email-subject"
              value={emailData.subject}
              onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
              className="text-right"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="email-message">الرسالة</Label>
            <Textarea
              id="email-message"
              value={emailData.message}
              onChange={(e) => setEmailData(prev => ({ ...prev, message: e.target.value }))}
              className="min-h-[150px] text-right"
              placeholder="اكتب رسالتك هنا..."
            />
          </div>
        </div>
        
        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            إلغاء
          </Button>
          <Button onClick={handleSendEmail} disabled={isSending}>
            {isSending ? (
              <>
                <Send className="mr-2 h-4 w-4 animate-pulse" />
                جاري الإرسال...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                إرسال
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmailReportDialog;
