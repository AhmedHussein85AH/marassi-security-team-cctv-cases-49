import React, { useState } from 'react';
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import MainSidebar from "@/components/MainSidebar";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, FileSpreadsheet, FileText } from 'lucide-react';
import useCallCenterStore from '@/stores/callCenterStore';
import { CallCenterReport } from '@/types/callCenterReports';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { useToast } from "@/hooks/use-toast";

const CallCenterReports = () => {
  const { reports, addReport } = useCallCenterStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const { toast } = useToast();

  const [newReport, setNewReport] = useState<Partial<CallCenterReport>>({
    timing: '',
    date: '',
    unitNumber: '',
    sectorName: '',
    reportReceiver: '',
    constructionSupervisor: ''
  });

  const filteredReports = reports.filter(report =>
    report.unitNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.sectorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.reportReceiver.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddReport = () => {
    if (!newReport.timing || !newReport.date || !newReport.unitNumber) {
      toast({
        title: "خطأ",
        description: "يرجى ملء الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    const reportToAdd: CallCenterReport = {
      id: Date.now().toString(),
      timing: newReport.timing || '',
      date: newReport.date || '',
      unitNumber: newReport.unitNumber || '',
      sectorName: newReport.sectorName || '',
      reportReceiver: newReport.reportReceiver || '',
      constructionSupervisor: newReport.constructionSupervisor || ''
    };

    addReport(reportToAdd);
    setNewReport({
      timing: '',
      date: '',
      unitNumber: '',
      sectorName: '',
      reportReceiver: '',
      constructionSupervisor: ''
    });
    setShowAddForm(false);
    
    toast({
      title: "تم الإضافة بنجاح",
      description: "تم إضافة البلاغ الجديد",
    });
  };

  const handleSelectReport = (reportId: string) => {
    setSelectedReports(prev => {
      if (prev.includes(reportId)) {
        return prev.filter(id => id !== reportId);
      } else {
        return [...prev, reportId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedReports.length === filteredReports.length) {
      setSelectedReports([]);
    } else {
      setSelectedReports(filteredReports.map(report => report.id));
    }
  };

  const exportToExcel = () => {
    const excelData = filteredReports.map((report, index) => ({
      'م': index + 1,
      'التوقيت': report.timing,
      'التاريخ': report.date,
      'رقم الوحدة': report.unitNumber,
      'اسم القطاع': report.sectorName,
      'مستلم البلاغ': report.reportReceiver,
      'مشرف أعمار': report.constructionSupervisor
    }));

    const ws = XLSX.utils.json_to_sheet(excelData, {
      header: ['م', 'التوقيت', 'التاريخ', 'رقم الوحدة', 'اسم القطاع', 'مستلم البلاغ', 'مشرف أعمار']
    });

    ws['!dir'] = 'rtl';
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'بلاغات الكول سنتر');
    XLSX.writeFile(wb, `بلاغات_الكول_سنتر_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
    
    toast({
      title: "تم التصدير بنجاح",
      description: "تم تصدير الملف إلى Excel",
    });
  };

  const exportSelectedToExcel = () => {
    if (selectedReports.length === 0) {
      toast({
        title: "تنبيه",
        description: "الرجاء تحديد البلاغات المراد تصديرها",
        variant: "destructive",
      });
      return;
    }

    const selectedData = filteredReports.filter(report => selectedReports.includes(report.id));
    const worksheet = XLSX.utils.json_to_sheet(selectedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "بلاغات الكول سنتر");
    XLSX.writeFile(workbook, `بلاغات_الكول_سنتر_المحددة_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
    
    toast({
      title: "تم التصدير بنجاح",
      description: "تم تصدير البلاغات المحددة إلى Excel",
    });
  };

  const exportToPDF = () => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(20);
    pdf.setTextColor(33, 150, 243);
    pdf.text('تقرير بلاغات الكول سنتر', pageWidth - margin, 30, { align: 'right' });
    
    pdf.setFontSize(12);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`تاريخ الإنشاء: ${format(new Date(), 'yyyy-MM-dd HH:mm')}`, pageWidth - margin, 45, { align: 'right' });

    const tableData = filteredReports.map((report, index) => [
      index + 1,
      report.timing,
      report.date,
      report.unitNumber,
      report.sectorName,
      report.reportReceiver,
      report.constructionSupervisor
    ]);

    autoTable(pdf, {
      startY: 60,
      head: [['م', 'التوقيت', 'التاريخ', 'رقم الوحدة', 'اسم القطاع', 'مستلم البلاغ', 'مشرف أعمار']],
      body: tableData,
      styles: {
        font: 'helvetica',
        fontSize: 10,
        cellPadding: 5,
        halign: 'right'
      },
      headStyles: {
        fillColor: [63, 81, 181],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      margin: { left: margin, right: margin }
    });

    pdf.save(`بلاغات_الكول_سنتر_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
    
    toast({
      title: "تم التصدير بنجاح",
      description: "تم تصدير الملف إلى PDF",
    });
  };

  return (
    <SidebarProvider>
      <div className="h-screen flex w-full bg-slate-50 dark:bg-slate-950" dir="rtl">
        <MainSidebar activeItem="call-center-reports" />
        <SidebarInset className="overflow-auto">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger />
            <div className="flex flex-1 items-center gap-4 md:gap-8">
              <h1 className="text-xl font-bold">بلاغات الكول سنتر</h1>
            </div>
          </header>
          
          <main className="flex-1 p-6">
            <div className="mb-4">
              <p className="text-muted-foreground">إدارة ومتابعة بلاغات الكول سنتر</p>
            </div>

            <div className="flex gap-4 mb-6">
              <Button onClick={() => setShowAddForm(!showAddForm)} className="gap-2">
                <Plus className="h-4 w-4" />
                إضافة بلاغ جديد
              </Button>
              <Button onClick={exportToExcel} variant="outline" className="gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                تصدير الكل إلى Excel
              </Button>
              <Button onClick={exportSelectedToExcel} variant="outline" className="gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                تصدير المحدد إلى Excel
              </Button>
              <Button onClick={exportToPDF} variant="outline" className="gap-2">
                <FileText className="h-4 w-4" />
                تصدير إلى PDF
              </Button>
            </div>

            {showAddForm && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>إضافة بلاغ جديد</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Input
                      type="time"
                      placeholder="التوقيت"
                      value={newReport.timing}
                      onChange={(e) => setNewReport({...newReport, timing: e.target.value})}
                    />
                    <Input
                      type="date"
                      value={newReport.date}
                      onChange={(e) => setNewReport({...newReport, date: e.target.value})}
                    />
                    <Input
                      placeholder="رقم الوحدة"
                      value={newReport.unitNumber}
                      onChange={(e) => setNewReport({...newReport, unitNumber: e.target.value})}
                    />
                    <Input
                      placeholder="اسم القطاع"
                      value={newReport.sectorName}
                      onChange={(e) => setNewReport({...newReport, sectorName: e.target.value})}
                    />
                    <Input
                      placeholder="مستلم البلاغ"
                      value={newReport.reportReceiver}
                      onChange={(e) => setNewReport({...newReport, reportReceiver: e.target.value})}
                    />
                    <Input
                      placeholder="مشرف أعمار"
                      value={newReport.constructionSupervisor}
                      onChange={(e) => setNewReport({...newReport, constructionSupervisor: e.target.value})}
                    />
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button onClick={handleAddReport}>إضافة البلاغ</Button>
                    <Button variant="outline" onClick={() => setShowAddForm(false)}>إلغاء</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>قائمة البلاغات</CardTitle>
                <Input
                  placeholder="البحث في البلاغات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm text-right"
                />
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">
                        <Checkbox
                          checked={selectedReports.length === filteredReports.length}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead className="text-right">م</TableHead>
                      <TableHead className="text-right">التوقيت</TableHead>
                      <TableHead className="text-right">التاريخ</TableHead>
                      <TableHead className="text-right">رقم الوحدة</TableHead>
                      <TableHead className="text-right">اسم القطاع</TableHead>
                      <TableHead className="text-right">مستلم البلاغ</TableHead>
                      <TableHead className="text-right">مشرف أعمار</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.map((report, index) => (
                      <TableRow 
                        key={report.id}
                        className={selectedReports.includes(report.id) ? "bg-muted/50" : ""}
                      >
                        <TableCell>
                          <Checkbox
                            checked={selectedReports.includes(report.id)}
                            onCheckedChange={() => handleSelectReport(report.id)}
                          />
                        </TableCell>
                        <TableCell className="text-right">{index + 1}</TableCell>
                        <TableCell className="text-right">{report.timing}</TableCell>
                        <TableCell className="text-right">{report.date}</TableCell>
                        <TableCell className="text-right">{report.unitNumber}</TableCell>
                        <TableCell className="text-right">{report.sectorName}</TableCell>
                        <TableCell className="text-right">{report.reportReceiver}</TableCell>
                        <TableCell className="text-right">{report.constructionSupervisor}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default CallCenterReports;
