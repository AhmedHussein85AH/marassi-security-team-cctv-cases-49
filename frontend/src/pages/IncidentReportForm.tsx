import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { FileText, Upload } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const initialForm = {
  fileReference: '',
  dateOfReport: '',
  dateOfIncident: '',
  timeOfReport: '',
  timeOfIncident: '',
  incidentLocation: '',
  incidentCategory: '',
  responsible: '',
  authorities: {
    police: false,
    civilDefence: false,
    ambulance: false,
    others: false,
    othersText: ''
  },
  incidentDetails: '',
  actionTaken: '',
  images: [] as File[],
  receivedBy: '',
  designation: '',
  reportSubmittedBy: '',
  refNo: ''
};

const IncidentReportForm = () => {
  const [form, setForm] = useState(initialForm);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setForm({
      ...form,
      authorities: {
        ...form.authorities,
        [name]: checked
      }
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const remainingSlots = 5 - form.images.length;
      const newFiles = files.slice(0, remainingSlots);
      
      if (newFiles.length > 0) {
        setForm({ ...form, images: [...form.images, ...newFiles] });
        setImagePreviews([...imagePreviews, ...newFiles.map(file => URL.createObjectURL(file))]);
      }
    }
  };

  const handleExportPDF = async () => {
    const doc = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });
    
    // استخدام الخط الافتراضي
    doc.setFont('helvetica');
    doc.setR2L(true);

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 32;
    let y = 48;
    const tableWidth = pageWidth - margin * 2;
    const gray: [number, number, number] = [100, 100, 100];
    const borderColor: [number, number, number] = [0, 0, 0];

    // Header
    doc.setFontSize(10);
    doc.setTextColor(180);
    doc.text('marassi', margin, y);
    doc.setFontSize(18);
    doc.setTextColor(120);
    doc.text('EMAAR', pageWidth - margin - 60, y);
    y += 14;
    doc.setDrawColor(0);
    doc.setLineWidth(1);
    doc.line(margin, y, pageWidth - margin, y);
    y += 12;

    // File Reference (أحمر)
    doc.setFontSize(12);
    doc.setTextColor(255,0,0);
    doc.setFont('helvetica', 'bold');
    doc.text('File Reference:', margin, y);
    doc.setTextColor(0);
    doc.setFont('helvetica', 'normal');
    doc.text(form.fileReference || '', margin + 100, y);
    y += 24;

    // Incident Summary Title
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0);
    doc.text('Incident Summary (INSUM)', pageWidth/2, y, { align: 'center' });
    y += 20;

    // Authorities row as image
    // Create a canvas
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 30;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.font = '14px Arial';
      ctx.textBaseline = 'middle';
      let x = 0;
      const drawBox = (checked: boolean, label: string) => {
        ctx.strokeRect(x, 7, 14, 14);
        if (checked) {
          ctx.beginPath();
          ctx.moveTo(x+3, 14);
          ctx.lineTo(x+7, 18);
          ctx.lineTo(x+12, 9);
          ctx.stroke();
        }
        ctx.fillText(label, x + 18, 14);
        x += ctx.measureText(label).width + 32;
      };
      drawBox(form.authorities.police, 'Police');
      drawBox(form.authorities.civilDefence, 'Civil Defence');
      drawBox(form.authorities.ambulance, 'Ambulance');
      drawBox(form.authorities.others, 'Others' + (form.authorities.others && form.authorities.othersText ? ': ' + form.authorities.othersText : ''));
    }
    const authoritiesImg = canvas.toDataURL('image/png');

    // Main Table + Footer as one table (skip authorities row)
    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      tableWidth: 'auto',
      body: [
        [
          { content: 'Date of Report', styles: { fillColor: gray, textColor: 255, fontStyle: 'bold', halign: 'center', minCellHeight: 28 } },
          { content: form.dateOfReport || '', styles: { fillColor: [255,255,255], halign: 'center', minCellHeight: 28 } },
          { content: 'Date of incident', styles: { fillColor: gray, textColor: 255, fontStyle: 'bold', halign: 'center', minCellHeight: 28 } },
          { content: form.dateOfIncident || '', styles: { fillColor: [255,255,255], halign: 'center', minCellHeight: 28 } },
        ],
        [
          { content: 'Time of Report', styles: { fillColor: gray, textColor: 255, fontStyle: 'bold', halign: 'center', minCellHeight: 28 } },
          { content: form.timeOfReport || '', styles: { fillColor: [255,255,255], halign: 'center', minCellHeight: 28 } },
          { content: 'Time of incident', styles: { fillColor: gray, textColor: 255, fontStyle: 'bold', halign: 'center', minCellHeight: 28 } },
          { content: form.timeOfIncident || '', styles: { fillColor: [255,255,255], halign: 'center', minCellHeight: 28 } },
        ],
        [
          { content: 'Incident Specific Location', styles: { fillColor: gray, textColor: 255, fontStyle: 'bold', halign: 'center', minCellHeight: 28 } },
          { content: form.incidentLocation || '', colSpan: 3, styles: { fillColor: [255,255,255], halign: 'left', minCellHeight: 28 } },
        ],
        [
          { content: 'Incident Category', styles: { fillColor: gray, textColor: 255, fontStyle: 'bold', halign: 'center', minCellHeight: 28 } },
          { content: form.incidentCategory || '', colSpan: 3, styles: { fillColor: [255,255,255], halign: 'left', minCellHeight: 28 } },
        ],
        [
          { content: 'Responsible', styles: { fillColor: gray, textColor: 255, fontStyle: 'bold', halign: 'center', minCellHeight: 28 } },
          { content: form.responsible || '', colSpan: 3, styles: { fillColor: [255,255,255], halign: 'left', minCellHeight: 28 } },
        ],
        // Authorities row as image
        [
          { content: 'Local Authorities Involvement', styles: { fillColor: gray, textColor: 255, fontStyle: 'bold', halign: 'center', valign: 'middle', minCellHeight: 28 } },
          { content: '', colSpan: 3, styles: { fillColor: [255,255,255], halign: 'left', valign: 'middle', minCellHeight: 28 } }
        ],
        [
          { content: 'Incident Details', colSpan: 4, styles: { fillColor: gray, textColor: 255, fontStyle: 'bold', halign: 'center', minCellHeight: 32 } }
        ],
        [
          { content: form.incidentDetails || '', colSpan: 4, styles: { fillColor: [255,255,255], halign: 'left', minCellHeight: 120 } }
        ],
        [
          { content: 'Action Taken', colSpan: 4, styles: { fillColor: gray, textColor: 255, fontStyle: 'bold', halign: 'center', minCellHeight: 32 } }
        ],
        [
          { content: form.actionTaken || '', colSpan: 4, styles: { fillColor: [255,255,255], halign: 'left', minCellHeight: 120 } }
        ],
        // --- صف الصور بنفس تنسيق Action Taken ---
        ...(form.images.length > 0 ? [
          [
            { content: 'Images', colSpan: 4, styles: { fillColor: gray, textColor: 255, fontStyle: 'bold', halign: 'center', minCellHeight: 32 } }
          ],
          [
            { content: '', colSpan: 4, styles: { fillColor: [255,255,255], halign: 'center', minCellHeight: 80 } }
          ]
        ] : []),
        // --- الفوتر ---
        [
          { content: 'Report Submitted by Emaar Security Group-MISR', colSpan: 4, styles: { fillColor: gray, textColor: 255, fontStyle: 'bold', halign: 'center', minCellHeight: 18 } }
        ],
        [
          { content: 'Received By', styles: { fillColor: gray, textColor: 255, fontStyle: 'bold', halign: 'center', minCellHeight: 16 } },
          { content: form.receivedBy || '', styles: { fillColor: [255,255,255], halign: 'left', minCellHeight: 16 } },
          { content: 'Designation', styles: { fillColor: gray, textColor: 255, fontStyle: 'bold', halign: 'center', minCellHeight: 16 } },
          { content: form.designation || '', styles: { fillColor: [255,255,255], halign: 'left', minCellHeight: 16 } },
        ],
        [
          { content: 'Report Submitted by', styles: { fillColor: gray, textColor: 255, fontStyle: 'bold', halign: 'center', minCellHeight: 16 } },
          { content: form.reportSubmittedBy || '', styles: { fillColor: [255,255,255], halign: 'left', minCellHeight: 16 } },
          { content: 'Ref No.', styles: { fillColor: gray, textColor: 255, fontStyle: 'bold', halign: 'center', minCellHeight: 16 } },
          { content: form.refNo || '', styles: { fillColor: [255,255,255], halign: 'left', minCellHeight: 16 } },
        ]
      ],
      columnStyles: {
        0: { cellWidth: (tableWidth/4) },
        1: { cellWidth: (tableWidth/4) },
        2: { cellWidth: (tableWidth/4) },
        3: { cellWidth: (tableWidth/4) }
      },
      theme: 'grid',
      styles: { 
        font: 'helvetica', 
        fontSize: 12, 
        cellPadding: 4, 
        valign: 'middle', 
        lineColor: borderColor, 
        lineWidth: 1,
        halign: 'right'
      },
      tableLineColor: borderColor,
      tableLineWidth: 1,
      didDrawCell: (data) => {
        // Insert the authorities image in the correct cell
        if (data.row.index === 5 && data.column.index === 1) {
          const cellWidth = data.cell.width;
          const cellHeight = data.cell.height;
          const imgWidth = 280;
          const imgHeight = 22;
          const x = data.cell.x + (cellWidth - imgWidth) / 2;
          const y = data.cell.y + (cellHeight - imgHeight) / 2;
          doc.addImage(authoritiesImg, 'PNG', x, y, imgWidth, imgHeight);
        }
        // رسم الصور في الخانة المخصصة فقط
        if (form.images.length > 0 && data.row.index === 11 && data.column.index === 0) {
          const cellWidth = data.cell.width;
          const imgHeight = 60;
          const imgWidth = imgHeight * 1.5;
          const maxImagesPerRow = 3;
          const totalImagesWidth = (imgWidth * Math.min(form.images.length, maxImagesPerRow)) + (12 * (Math.min(form.images.length, maxImagesPerRow) - 1));
          
          // حساب نقطة البداية لتوسيط الصور أفقياً
          let startX = data.cell.x + (cellWidth - totalImagesWidth) / 2;
          let x = startX;
          let y = data.cell.y + 10;
          
          for (let i = 0; i < form.images.length; i++) {
            const img = new Image();
            img.src = URL.createObjectURL(form.images[i]);
            
            // إذا وصلنا إلى نهاية الصف، نبدأ صفاً جديداً
            if (i > 0 && i % maxImagesPerRow === 0) {
              x = startX;
              y += imgHeight + 10;
            }
            
            doc.addImage(img, 'JPEG', x, y, imgWidth, imgHeight);
            x += imgWidth + 12;
          }
        }
      }
    });

    doc.save('incident-report.pdf');
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Incident Report Form
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4">
            {/* File Reference and Dates */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">File Reference</label>
                <Input name="fileReference" value={form.fileReference} onChange={handleInput} dir="rtl" className="text-right" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date of Report</label>
                <Input type="date" name="dateOfReport" value={form.dateOfReport} onChange={handleInput} dir="rtl" className="text-right" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date of incident</label>
                <Input type="date" name="dateOfIncident" value={form.dateOfIncident} onChange={handleInput} dir="rtl" className="text-right" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Time of Report</label>
                <Input type="time" name="timeOfReport" value={form.timeOfReport} onChange={handleInput} dir="rtl" className="text-right" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Time of incident</label>
                <Input type="time" name="timeOfIncident" value={form.timeOfIncident} onChange={handleInput} dir="rtl" className="text-right" />
              </div>
            </div>

            {/* Location, Category, Responsible */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Incident Specific Location</label>
                <Input name="incidentLocation" value={form.incidentLocation} onChange={handleInput} dir="rtl" className="text-right" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Incident Category</label>
                <Input name="incidentCategory" value={form.incidentCategory} onChange={handleInput} dir="rtl" className="text-right" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Responsible</label>
                <Input name="responsible" value={form.responsible} onChange={handleInput} dir="rtl" className="text-right" />
              </div>
            </div>

            {/* Authorities Involvement */}
            <div>
              <label className="block text-sm font-medium mb-1">Local Authorities Involvement</label>
              <div className="flex gap-4 flex-wrap">
                <label className="flex items-center gap-2">
                  <Checkbox name="police" checked={form.authorities.police} onChange={handleCheckbox} /> Police
                </label>
                <label className="flex items-center gap-2">
                  <Checkbox name="civilDefence" checked={form.authorities.civilDefence} onChange={handleCheckbox} /> Civil Defence
                </label>
                <label className="flex items-center gap-2">
                  <Checkbox name="ambulance" checked={form.authorities.ambulance} onChange={handleCheckbox} /> Ambulance
                </label>
                <label className="flex items-center gap-2">
                  <Checkbox name="others" checked={form.authorities.others} onChange={handleCheckbox} /> Others
                </label>
                {form.authorities.others && (
                  <Input name="othersText" value={form.authorities.othersText} onChange={e => setForm({ ...form, authorities: { ...form.authorities, othersText: e.target.value } })} placeholder="Specify" className="w-32" dir="rtl" className="text-right" />
                )}
              </div>
            </div>

            {/* Incident Details */}
            <div>
              <label className="block text-sm font-medium mb-1">Incident Details</label>
              <Textarea name="incidentDetails" value={form.incidentDetails} onChange={handleInput} rows={5} dir="rtl" className="text-right" />
            </div>

            {/* Action Taken */}
            <div>
              <label className="block text-sm font-medium mb-1">Action Taken</label>
              <Textarea name="actionTaken" value={form.actionTaken} onChange={handleInput} rows={5} dir="rtl" className="text-right" />
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium mb-1">Attach Images (Max 5)</label>
              <Input 
                type="file" 
                accept="image/*" 
                multiple 
                onChange={handleImageChange} 
                disabled={form.images.length >= 5}
              />
              <div className="flex gap-4 mt-4 flex-wrap">
                {imagePreviews.map((src, idx) => (
                  <div key={idx} className="relative">
                    <img src={src} alt="preview" className="w-40 h-32 object-cover border rounded" />
                    <button
                      type="button"
                      onClick={() => {
                        const newImages = [...form.images];
                        const newPreviews = [...imagePreviews];
                        newImages.splice(idx, 1);
                        newPreviews.splice(idx, 1);
                        setForm({ ...form, images: newImages });
                        setImagePreviews(newPreviews);
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              {form.images.length >= 5 && (
                <p className="text-sm text-red-500 mt-2">Maximum 5 images allowed</p>
              )}
            </div>

            {/* Footer Fields */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Received By</label>
                <Input name="receivedBy" value={form.receivedBy} onChange={handleInput} dir="rtl" className="text-right" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Designation</label>
                <Input name="designation" value={form.designation} onChange={handleInput} dir="rtl" className="text-right" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Report Submitted by</label>
                <Input name="reportSubmittedBy" value={form.reportSubmittedBy} onChange={handleInput} dir="rtl" className="text-right" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ref No.</label>
                <Input name="refNo" value={form.refNo} onChange={handleInput} dir="rtl" className="text-right" />
              </div>
            </div>

            <Button type="button" onClick={handleExportPDF} className="mt-4 flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Export as PDF
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default IncidentReportForm; 