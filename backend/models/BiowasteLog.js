const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const biowasteLogSchema = new Schema({
  healthcareProvider: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  wasteType: { type: String, required: true },
  quantityKg: { type: Number, required: true },
  disposalDate: { type: Date, required: true },
  disposalMethod: { type: String, required: true },
  status: { type: String, enum: ['pending', 'collected', 'disposed'], default: 'pending' },
  notes: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('BiowasteLog', biowasteLogSchema);
