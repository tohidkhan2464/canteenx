import mongoose, { Schema } from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
  menuItemId: { type: Schema.Types.ObjectId, ref: 'MenuItem', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

const OrderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [OrderItemSchema],
    totalAmount: { type: Number, required: true },
    paymentStatus: { type: String, enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'], default: 'PENDING' },
    paymentMethod: { type: String, default: 'MOCK' },
    pickupSlotId: { type: Schema.Types.ObjectId, ref: 'PickupSlot', required: true },
    status: {
      type: String,
      enum: ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'PICKED_UP', 'CANCELLED', 'REJECTED'],
      default: 'PENDING',
    },
    qrCode: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
