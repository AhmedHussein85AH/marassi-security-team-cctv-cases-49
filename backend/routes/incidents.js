const express = require('express');
const router = express.Router();
const Incident = require('../models/Incident');
const auth = require('../middleware/auth');

const ALL_TYPES = [
  "تحرش", "حادث", "محاولة تجاوزات أعمار", "فعل فاضح", "اعتداء/ضرب", "سير مخالف",
  "إزعاج", "تعاطي مخدرات", "ركن مخالف", "مضاربة", "حالات طوارئ", "تسلل",
  "أخرى", "تجريب", "تعليقات متعلقة", "سرقة"
];
const ALL_STATUSES = ["pending", "investigating", "resolved", "closed"];

/**
 * @route   GET /api/incidents
 * @desc    جلب جميع الحوادث مع دعم الفلترة
 */
router.get('/', auth, async (req, res) => {
  try {
    // دعم الفلترة عبر الكويري
    const filter = {};
    if (req.query.type) filter.type = req.query.type;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.severity) filter.severity = req.query.severity;
    if (req.query.cameraId) filter.cameraId = req.query.cameraId;

    const incidents = await Incident.find(filter)
      .populate('reportedBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate('cameraId', 'name location')
      .sort({ createdAt: -1 });

    res.json(incidents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   GET /api/incidents/:id
 * @desc    جلب حادثة واحدة بالتفصيل
 */
router.get('/:id', auth, async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id)
      .populate('reportedBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate('cameraId', 'name location');
    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }
    res.json(incident);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   POST /api/incidents
 * @desc    إنشاء حادثة جديدة
 */
router.post('/', auth, async (req, res) => {
  try {
    const { title, type, description, location, cameraId, severity, assignedTo, evidence } = req.body;
    if (!title || !type || !description || !location || !cameraId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const incident = new Incident({
      title,
      type,
      description,
      location,
      cameraId,
      severity,
      assignedTo,
      evidence,
      reportedBy: req.user._id
    });
    const newIncident = await incident.save();
    res.status(201).json(newIncident);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @route   PATCH /api/incidents/:id
 * @desc    تحديث حادثة
 */
router.patch('/:id', auth, async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);
    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }
    // تحديث الحقول المسموح بها فقط
    const allowed = ['title', 'type', 'description', 'location', 'cameraId', 'severity', 'status', 'assignedTo', 'evidence'];
    allowed.forEach(key => {
      if (req.body[key] !== undefined) incident[key] = req.body[key];
    });
    const updatedIncident = await incident.save();
    res.json(updatedIncident);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @route   DELETE /api/incidents/:id
 * @desc    حذف حادثة
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);
    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }
    await incident.remove();
    res.json({ message: 'Incident deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   POST /api/incidents/:id/notes
 * @desc    إضافة ملاحظة لحادثة
 */
router.post('/:id/notes', auth, async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);
    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }
    if (!req.body.content) {
      return res.status(400).json({ message: 'Note content is required' });
    }
    incident.notes.push({
      content: req.body.content,
      addedBy: req.user._id
    });
    const updatedIncident = await incident.save();
    res.json(updatedIncident);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @route   PATCH /api/incidents/:id/status
 * @desc    تحديث حالة الحادثة فقط
 */
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);
    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }
    if (!req.body.status) {
      return res.status(400).json({ message: 'Status is required' });
    }
    incident.status = req.body.status;
    const updatedIncident = await incident.save();
    res.json(updatedIncident);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @route   GET /api/incidents/stats
 * @desc    جلب إحصائيات الحوادث
 */
router.get('/stats', auth, async (req, res) => {
  try {
    // جلب جميع الحوادث
    const incidents = await Incident.find()
      .populate('reportedBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate('cameraId', 'name location');

    // تحليل البيانات
    const stats = {
      byType: {},
      byStatus: {},
      bySeverity: {},
      byDay: {},
      total: incidents.length
    };

    // تحليل البيانات حسب النوع والحالة والشدة
    incidents.forEach(incident => {
      // حسب النوع
      stats.byType[incident.type] = (stats.byType[incident.type] || 0) + 1;
      
      // حسب الحالة
      stats.byStatus[incident.status] = (stats.byStatus[incident.status] || 0) + 1;
      
      // حسب الشدة
      stats.bySeverity[incident.severity] = (stats.bySeverity[incident.severity] || 0) + 1;
      
      // حسب اليوم
      const day = new Date(incident.createdAt).toLocaleDateString('ar-SA');
      stats.byDay[day] = (stats.byDay[day] || 0) + 1;
    });

    // تحويل البيانات إلى مصفوفات للـ charts
    const typeData = ALL_TYPES.map(type => ({
      type,
      count: stats.byType[type] || 0
    }));
    const statusData = ALL_STATUSES.map(status => ({
      status,
      count: stats.byStatus[status] || 0
    }));

    const chartData = {
      typeData,
      statusData,
      severityData: Object.entries(stats.bySeverity).map(([severity, count]) => ({
        severity,
        count
      })),
      dayData: Object.entries(stats.byDay).map(([day, count]) => ({
        day,
        count
      }))
    };

    res.json({
      stats,
      chartData,
      incidents
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 