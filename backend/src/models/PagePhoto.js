import mongoose from 'mongoose'

const pagePhotoSchema = new mongoose.Schema(
  {
    pageName: { type: String, required: true },
    imageUrl: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
)

export const PagePhoto = mongoose.model('PagePhoto', pagePhotoSchema)
