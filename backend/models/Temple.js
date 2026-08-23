const mongoose = require('mongoose');

const templeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  deity: {
    type: String,
    required: true
  },
  coverImage: {
    type: String,
    default: ''
  },
  images: {
    type: [String],
    default: []
  },
  description: {
    type: String,
    default: ''
  },
  lat: { type: Number },
  lng: { type: Number },
  rituals: [{ type: String }],
  timings: [{ type: String }],
  facilities: {
    transport: { type: String, default: '' },
    stay: { type: String, default: '' }
  },
  guidelines: {
    dressCode: { type: String, default: '' },
    otherRules: { type: String, default: '' }
  },
  status: { type: String, enum: ['approved', 'pending'], default: 'approved' },
  isFeatured: { type: Boolean, default: false },
  isPopular: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Temple', templeSchema);
