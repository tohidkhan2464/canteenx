import mongoose from 'mongoose';

const PickupSlotSchema = new mongoose.Schema(
  {
    startTime: { type: String, required: true }, // e.g., '1:00 PM'
    endTime: { type: String, required: true }, // e.g., '1:10 PM'
    maxOrders: { type: Number, required: true },
    currentOrders: { type: Number, default: 0 },
    status: { type: String, enum: ['AVAILABLE', 'FULL', 'CLOSED'], default: 'AVAILABLE' },
  },
  { timestamps: true }
);

export default mongoose.models.PickupSlot || mongoose.model('PickupSlot', PickupSlotSchema);
