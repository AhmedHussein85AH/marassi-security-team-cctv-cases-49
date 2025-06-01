const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const auth = require('../middleware/auth');
const { generateReport } = require('../utils/reportGenerator');

// Get all reports
router.get('/', auth, async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('generatedBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single report
router.get('/:id', auth, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('generatedBy', 'name email')
      .populate('filters.cameras', 'name location')
      .populate('filters.incidents', 'title description');
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new report
router.post('/', auth, async (req, res) => {
  const report = new Report({
    ...req.body,
    generatedBy: req.user._id,
    status: 'pending'
  });

  try {
    const newReport = await report.save();
    
    // Start report generation in background
    generateReport(newReport._id).catch(error => {
      console.error('Report generation failed:', error);
    });

    res.status(201).json(newReport);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update report
router.patch('/:id', auth, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Only allow updates if report is not in generating state
    if (report.status === 'generating') {
      return res.status(400).json({ message: 'Cannot update report while it is being generated' });
    }

    Object.keys(req.body).forEach(key => {
      report[key] = req.body[key];
    });

    const updatedReport = await report.save();
    res.json(updatedReport);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete report
router.delete('/:id', auth, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    await report.remove();
    res.json({ message: 'Report deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get report status
router.get('/:id/status', auth, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.json({ status: report.status });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Download report
router.get('/:id/download', auth, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    if (report.status !== 'completed') {
      return res.status(400).json({ message: 'Report is not ready for download' });
    }

    if (!report.fileUrl) {
      return res.status(404).json({ message: 'Report file not found' });
    }

    // Set appropriate headers based on report format
    const contentType = {
      pdf: 'application/pdf',
      csv: 'text/csv',
      excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }[report.format];

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${report.title}.${report.format}"`);
    
    // Stream the file
    const fileStream = require('fs').createReadStream(report.fileUrl);
    fileStream.pipe(res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 