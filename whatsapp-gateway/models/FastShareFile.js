const mongoose = require('mongoose');

const FastShareFileSchema = new mongoose.Schema({
  transferCode: { type: String, required: true, unique: true, index: true },
  fileName: { type: String, required: true },
  fileSize: { type: Number, required: true },
  mimeType: { type: String, default: 'application/octet-stream' },
  peerId: { type: String, default: null },
  downloadCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) }
});

module.exports = mongoose.model('FastShareFile', FastShareFileSchema);
