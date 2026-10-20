const mongoose = require('mongoose');

const InquirySchema = new mongoose.Schema({
  id: { type: String, unique: true, index: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  company: { type: String, default: '' },
  interest: { type: String, default: 'Custom Software & Web Platforms' },
  timeline: { type: String, default: 'Immediate (Within 30 days)' },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'In Discussion', 'Proposal Sent', 'Closed', 'Archived'],
    default: 'New'
  },
  priority: {
    type: String,
    enum: ['Low', 'Normal', 'High', 'Urgent'],
    default: 'Normal'
  },
  notes: [{ type: String }],
  assignedTo: { type: String, default: 'Enterprise Pod' }
});

module.exports = mongoose.model('Inquiry', InquirySchema);
