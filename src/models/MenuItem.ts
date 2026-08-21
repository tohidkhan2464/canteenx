import mongoose, { Schema } from 'mongoose';

const MenuItemSchema = new mongoose.Schema(
  {
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String },
    isAvailable: { type: Boolean, default: true },
    estimatedPreparationTime: { type: Number }, // in minutes
  },
  { timestamps: true }
);

export default mongoose.models.MenuItem || mongoose.model('MenuItem', MenuItemSchema);
