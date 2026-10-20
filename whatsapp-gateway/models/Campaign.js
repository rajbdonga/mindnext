const mongoose = require('mongoose');

const CampaignSchema = new mongoose.Schema({
  campaignName: { type: String, default: 'Default MindNext WhatsApp Campaign' },
  isRunning: { type: Boolean, default: false },
  isPaused: { type: Boolean, default: false },
  senderNumber: { type: String, default: '+91 94290 66805' },
  minDelay: { type: Number, default: 120 },
  maxDelay: { type: Number, default: 180 },
  workStartHour: { type: String, default: '09:00:00 AM' },
  workEndHour: { type: String, default: '09:00:00 PM' },
  lunchBreakEnabled: { type: Boolean, default: true },
  lunchStartHour: { type: String, default: '01:30:00 PM' },
  lunchEndHour: { type: String, default: '02:15:00 PM' },
  batchBreakEnabled: { type: Boolean, default: true },
  batchMsgCount: { type: Number, default: 25 },
  batchPauseMin: { type: Number, default: 15 },
  campaignStartDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
  campaignEndDate: { type: String, default: () => new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0] },
  sentToday: { type: Number, default: 0 },
  todayQuota: { type: Number, default: 250 },
  currentBatchCount: { type: Number, default: 0 },
  messageTemplate: {
    type: String,
    default: 'Good AfterNoon Doctor {name},\n\nI hope you are doing well.\n\nWe provide the *latest medical research articles* along with *concise, easy-to-read summaries* tailored to your specialization. This helps you stay updated with global studies while saving your valuable time.\n\n📄 I would be happy to share a *complimentary sample* for your review. Kindly let me know if you would like to receive it.\n\nThank you.\n\nBest Regards,\n*MindNext Team*'
  },
  stopOptOut: { type: Boolean, default: false },
  attachment: {
    enabled: { type: Boolean, default: true },
    fileName: { type: String, default: 'Sample.pdf' },
    mimetype: { type: String, default: 'application/pdf' },
    filePath: { type: String, default: 'uploads/Sample.pdf' }
  },
  offDates: [{ type: String }],
  dateSchedule: [{
    date: String,
    targetCount: Number,
    sentCount: Number,
    status: String
  }],
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Campaign', CampaignSchema);
