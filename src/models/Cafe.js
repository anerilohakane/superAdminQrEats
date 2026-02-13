import mongoose from 'mongoose';

const CafeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a cafe name'],
  },
  ownerName: {
    type: String,
    required: [true, 'Please provide the owner name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
  },
  phone: {
    type: String,
    required: [true, 'Please provide a phone number'],
  },
  address: {
    type: String,
    required: [true, 'Please provide an address'],
  },
  specialty: {
    type: String,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'paused'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

delete mongoose.models.Cafe;
export default mongoose.models.Cafe || mongoose.model('Cafe', CafeSchema);
