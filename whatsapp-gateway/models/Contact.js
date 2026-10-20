const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  phone: { type: String, required: true, index: true },
  name: { type: String, default: 'સન્માનનીય ક્લાયન્ટ' },
  company: { type: String, default: '' },
  email: { type: String, default: '' },
  type: { type: String, enum: ['whatsapp', 'email', 'both'], default: 'whatsapp' },
  status: { type: String, enum: ['pending', 'queued', 'sending', 'sent', 'failed', 'opt_out'], default: 'pending' },
  sentAt: { type: Date, default: null },
  errorMessage: { type: String, default: null },
  source: { type: String, default: 'manual_csv' },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Contact', ContactSchema);
