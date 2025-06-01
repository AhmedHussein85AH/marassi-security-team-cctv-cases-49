
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Incident } from '@/types/incident';

export const generateIncidentPDF = async (incident: Incident): Promise<jsPDF> => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;
  let yPosition = 30;

  // Add Arabic font support (using built-in font for now)
  pdf.setFont('helvetica', 'normal');
  
  // Header
  pdf.setFontSize(20);
  pdf.setTextColor(33, 150, 243);
  pdf.text('تقرير الحادث', pageWidth - margin, yPosition, { align: 'right' });
  
  yPosition += 15;
  pdf.setFontSize(14);
  pdf.setTextColor(100, 100, 100);
  pdf.text(`رقم البلاغ: ${incident.id}`, pageWidth - margin, yPosition, { align: 'right' });
  
  yPosition += 10;
  pdf.text(`تاريخ الإنشاء: ${new Date().toLocaleDateString('ar-SA')}`, pageWidth - margin, yPosition, { align: 'right' });
  
  // Draw line separator
  yPosition += 10;
  pdf.setDrawColor(200, 200, 200);
  pdf.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 15;

  // Basic Information Section
  pdf.setFontSize(16);
  pdf.setTextColor(51, 51, 51);
  pdf.text('المعلومات الأساسية', pageWidth - margin, yPosition, { align: 'right' });
  yPosition += 15;

  const basicInfo = [
    ['نوع البلاغ', incident.type],
    ['الموقع', incident.location],
    ['التاريخ', incident.date],
    ['الوقت', incident.time],
    ['الحالة', incident.status],
    ['المبلغ', incident.reporter]
  ];

  autoTable(pdf, {
    startY: yPosition,
    head: [['القيمة', 'البيان']],
    body: basicInfo,
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

  yPosition = (pdf as any).lastAutoTable.finalY + 20;

  // Description Section
  if (incident.description) {
    pdf.setFontSize(16);
    pdf.setTextColor(51, 51, 51);
    pdf.text('وصف الحادث', pageWidth - margin, yPosition, { align: 'right' });
    yPosition += 15;

    pdf.setFontSize(12);
    pdf.setTextColor(80, 80, 80);
    const splitDescription = pdf.splitTextToSize(incident.description, pageWidth - 2 * margin);
    pdf.text(splitDescription, pageWidth - margin, yPosition, { align: 'right' });
    yPosition += splitDescription.length * 6 + 15;
  }

  // Property Information
  if (incident.propertyInfo) {
    pdf.setFontSize(16);
    pdf.setTextColor(51, 51, 51);
    pdf.text('معلومات العقار', pageWidth - margin, yPosition, { align: 'right' });
    yPosition += 15;

    pdf.setFontSize(12);
    pdf.setTextColor(80, 80, 80);
    const splitProperty = pdf.splitTextToSize(incident.propertyInfo, pageWidth - 2 * margin);
    pdf.text(splitProperty, pageWidth - margin, yPosition, { align: 'right' });
    yPosition += splitProperty.length * 6 + 15;
  }

  // Vehicle Information
  if (incident.vehicleInfo) {
    pdf.setFontSize(16);
    pdf.setTextColor(51, 51, 51);
    pdf.text('معلومات المركبات', pageWidth - margin, yPosition, { align: 'right' });
    yPosition += 15;

    pdf.setFontSize(12);
    pdf.setTextColor(80, 80, 80);
    const splitVehicle = pdf.splitTextToSize(incident.vehicleInfo, pageWidth - 2 * margin);
    pdf.text(splitVehicle, pageWidth - margin, yPosition, { align: 'right' });
    yPosition += splitVehicle.length * 6 + 15;
  }

  // Operator Notes
  if (incident.operatorNotes) {
    pdf.setFontSize(16);
    pdf.setTextColor(51, 51, 51);
    pdf.text('ملاحظات المشغل', pageWidth - margin, yPosition, { align: 'right' });
    yPosition += 15;

    pdf.setFontSize(12);
    pdf.setTextColor(80, 80, 80);
    const splitNotes = pdf.splitTextToSize(incident.operatorNotes, pageWidth - 2 * margin);
    pdf.text(splitNotes, pageWidth - margin, yPosition, { align: 'right' });
    yPosition += splitNotes.length * 6 + 15;
  }

  // Comments Section
  if (incident.comments && incident.comments.length > 0) {
    // Check if new page is needed
    if (yPosition > 250) {
      pdf.addPage();
      yPosition = 30;
    }

    pdf.setFontSize(16);
    pdf.setTextColor(51, 51, 51);
    pdf.text('التعليقات', pageWidth - margin, yPosition, { align: 'right' });
    yPosition += 15;

    const commentsData = incident.comments.map(comment => [
      comment.timestamp,
      comment.user,
      comment.text
    ]);

    autoTable(pdf, {
      startY: yPosition,
      head: [['التوقيت', 'المستخدم', 'التعليق']],
      body: commentsData,
      styles: {
        font: 'helvetica',
        fontSize: 9,
        cellPadding: 4,
        halign: 'right'
      },
      headStyles: {
        fillColor: [76, 175, 80],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [248, 248, 248]
      },
      margin: { left: margin, right: margin }
    });

    yPosition = (pdf as any).lastAutoTable.finalY + 20;
  }

  // Images Section
  if (incident.images && incident.images.length > 0) {
    // Check if new page is needed
    if (yPosition > 200) {
      pdf.addPage();
      yPosition = 30;
    }

    pdf.setFontSize(16);
    pdf.setTextColor(51, 51, 51);
    pdf.text('الصور المرفقة', pageWidth - margin, yPosition, { align: 'right' });
    yPosition += 15;

    // Add images (up to 4 per page)
    let imageCount = 0;
    const imagesPerPage = 4;
    const imageWidth = 80;
    const imageHeight = 60;

    for (const imageUrl of incident.images) {
      if (imageCount > 0 && imageCount % imagesPerPage === 0) {
        pdf.addPage();
        yPosition = 30;
      }

      try {
        const xPosition = margin + (imageCount % 2) * (imageWidth + 10);
        const currentYPosition = yPosition + Math.floor((imageCount % imagesPerPage) / 2) * (imageHeight + 10);

        pdf.addImage(imageUrl, 'JPEG', xPosition, currentYPosition, imageWidth, imageHeight);
        imageCount++;
      } catch (error) {
        console.error('Error adding image to PDF:', error);
      }
    }
  }

  // Footer
  const pageCount = pdf.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text(`صفحة ${i} من ${pageCount}`, pageWidth - margin, pdf.internal.pageSize.getHeight() - 10, { align: 'right' });
    pdf.text('نظام إدارة الأمن والسلامة', margin, pdf.internal.pageSize.getHeight() - 10, { align: 'left' });
  }

  return pdf;
};
