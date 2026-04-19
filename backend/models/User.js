const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['healthcare_provider', 'admin'], default: 'healthcare_provider' },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
