import mongoose from 'mongoose'

const moneySchema = {
  type: Number,
  min: 0,
  required: true,
}

const productSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true, trim: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },

    price: moneySchema,
    discountPrice: { type: Number, min: 0, default: 0 },
    description: { type: String, default: '' },

    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: false },
      },
    ],

    availabilityStatus: {
      type: String,
      enum: ['available', 'out_of_stock', 'coming_soon'],
      default: 'available',
    },

    featured: { type: Boolean, default: false },
    trending: { type: Boolean, default: false },
    newArrival: { type: Boolean, default: false },

    stockQuantity: { type: Number, min: 0, default: 0 },

    visibility: { type: Boolean, default: true }, // Admin controls public visibility

    specifications: [
      {
        label: { type: String, default: '' },
        value: { type: String, default: '' },
      },
    ],
  },
  { timestamps: true },
)

export const Product = mongoose.model('Product', productSchema)

