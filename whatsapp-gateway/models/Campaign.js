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
    default: '{નમસ્તે|હેલો} {name} જી,\n\nMindNext Technologies તરફથી આપનું હાર્દિક સ્વાગત છે. અમારી નવી ક્લાઉડ અને આઈટી સર્વિસ અંગે આપને માહિતગાર કરવા આ સંદેશ પાઠવ્યો છે.\n\nઆપ વધુ વિગત માટે અમારી સાઇટ mindnext.in જોઈ શકો છો.\n\nઆભાર,\nMindNext Team'
  },
  stopOptOut: { type: Boolean, default: true },
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
