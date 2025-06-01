const Report = require('../models/Report');
const Incident = require('../models/Incident');
const Camera = require('../models/Camera');
const path = require('path');
const fs = require('fs').promises;
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const { Parser } = require('json2csv');

const REPORTS_DIR = path.join(__dirname, '../reports');

// Ensure reports directory exists
async function ensureReportsDir() {
  try {
    await fs.access(REPORTS_DIR);
  } catch {
    await fs.mkdir(REPORTS_DIR, { recursive: true });
  }
}

// Generate PDF report
async function generatePDF(report, data) {
  const doc = new PDFDocument();
  const filePath = path.join(REPORTS_DIR, `${report._id}.pdf`);
  const stream = fs.createWriteStream(filePath);

  doc.pipe(stream);

  // Add title
  doc.fontSize(20).text(report.title, { align: 'center' });
  doc.moveDown();

  // Add description
  doc.fontSize(12).text(report.description);
  doc.moveDown();

  // Add date range
  doc.text(`Date Range: ${new Date(report.dateRange.start).toLocaleDateString()} - ${new Date(report.dateRange.end).toLocaleDateString()}`);
  doc.moveDown();

  // Add data based on report type
  switch (report.type) {
    case 'incident':
      await generateIncidentReport(doc, data);
      break;
    case 'maintenance':
      await generateMaintenanceReport(doc, data);
      break;
    case 'system':
      await generateSystemReport(doc, data);
      break;
    default:
      doc.text('No specific report template available');
  }

  doc.end();

  return filePath;
}

// Generate Excel report
async function generateExcel(report, data) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Report');

  // Add title
  worksheet.mergeCells('A1:D1');
  worksheet.getCell('A1').value = report.title;
  worksheet.getCell('A1').font = { size: 16, bold: true };

  // Add data based on report type
  switch (report.type) {
    case 'incident':
      await generateIncidentExcel(worksheet, data);
      break;
    case 'maintenance':
      await generateMaintenanceExcel(worksheet, data);
      break;
    case 'system':
      await generateSystemExcel(worksheet, data);
      break;
  }

  const filePath = path.join(REPORTS_DIR, `${report._id}.xlsx`);
  await workbook.xlsx.writeFile(filePath);
  return filePath;
}

// Generate CSV report
async function generateCSV(report, data) {
  const fields = getFieldsForReportType(report.type);
  const parser = new Parser({ fields });
  const csv = parser.parse(data);

  const filePath = path.join(REPORTS_DIR, `${report._id}.csv`);
  await fs.writeFile(filePath, csv);
  return filePath;
}

// Main report generation function
async function generateReport(reportId) {
  try {
    await ensureReportsDir();

    const report = await Report.findById(reportId);
    if (!report) {
      throw new Error('Report not found');
    }

    // Update status to generating
    report.status = 'generating';
    await report.save();

    // Fetch data based on filters
    const data = await fetchReportData(report);

    // Generate report based on format
    let filePath;
    switch (report.format) {
      case 'pdf':
        filePath = await generatePDF(report, data);
        break;
      case 'excel':
        filePath = await generateExcel(report, data);
        break;
      case 'csv':
        filePath = await generateCSV(report, data);
        break;
      default:
        throw new Error('Unsupported report format');
    }

    // Update report with file URL and status
    report.fileUrl = filePath;
    report.status = 'completed';
    await report.save();

  } catch (error) {
    console.error('Report generation failed:', error);
    
    // Update report status to failed
    const report = await Report.findById(reportId);
    if (report) {
      report.status = 'failed';
      await report.save();
    }
  }
}

// Helper function to fetch data based on report filters
async function fetchReportData(report) {
  const query = {
    createdAt: {
      $gte: new Date(report.dateRange.start),
      $lte: new Date(report.dateRange.end)
    }
  };

  if (report.filters.cameras?.length) {
    query.cameraId = { $in: report.filters.cameras };
  }

  if (report.filters.severity?.length) {
    query.severity = { $in: report.filters.severity };
  }

  if (report.filters.status?.length) {
    query.status = { $in: report.filters.status };
  }

  return await Incident.find(query)
    .populate('cameraId', 'name location')
    .populate('reportedBy', 'name email')
    .populate('assignedTo', 'name email');
}

module.exports = {
  generateReport
}; 