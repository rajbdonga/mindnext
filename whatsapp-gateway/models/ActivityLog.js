const mongoose = require('mongoose');

const ActivityLogSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  type: { type: String, default: 'cron' }, // cron, email, inquiry, system
  level: { type: String, enum: ['info', 'success', 'warn', 'error'], default: 'info' },
  message: { type: String, required: true },
  details: { type: mongoose.Schema.Types.Mixed, default: {} }
});

module.exports = mongoose.model('ActivityLog', ActivityLogSchema);
