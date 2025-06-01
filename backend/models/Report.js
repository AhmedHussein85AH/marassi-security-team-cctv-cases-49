const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['incident', 'maintenance', 'system', 'custom'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  dateRange: {
    start: {
      type: Date,
      required: true
    },
    end: {
      type: Date,
      required: true
    }
  },
  filters: {
    cameras: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Camera'
    }],
    incidents: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Incident'
    }],
    severity: [{
      type: String,
      enum: ['low', 'medium', 'high', 'critical']
    }],
    status: [{
      type: String,
      enum: ['pending', 'investigating', 'resolved', 'closed']
    }]
  },
  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileUrl: {
    type: String
  },
  format: {
    type: String,
    enum: ['pdf', 'csv', 'excel'],
    default: 'pdf'
  },
  status: {
    type: String,
    enum: ['pending', 'generating', 'completed', 'failed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

reportSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Report', reportSchema); 