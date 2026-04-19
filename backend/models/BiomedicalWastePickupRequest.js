const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const biomedicalWastePickupRequestSchema = new Schema({
  name: { type: String, required: true },
  contactNumber: { type: String, required: true },
  address: { type: String, required: true },
  descriptionOfWaste: { type: String, required: true },
  preferredPickupDate: { type: Date, required: true },
  image: { type: String },  // Added field for image filename or path
  location: {
    latitude: { type: Number },
    longitude: { type: Number }
  }
}, { timestamps: true });

module.exports = mongoose.model('BiomedicalWastePickupRequest', biomedicalWastePickupRequestSchema);
