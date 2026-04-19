const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reminderSchema = new Schema({
  healthcareProvider: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  dueDate: { type: Date, required: true },
  isSent: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Reminder', reminderSchema);
