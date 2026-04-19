const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reportSchema = new Schema({
  healthcareProvider: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  reportType: { type: String, required: true },
  generatedAt: { type: Date, default: Date.now },
  data: { type: Schema.Types.Mixed, required: true }, // JSON or other structured data
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
