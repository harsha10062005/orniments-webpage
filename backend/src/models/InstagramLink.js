import mongoose from 'mongoose'

const instagramLinkSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, trim: true },
    label: { type: String, default: 'Instagram' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
)

export const InstagramLink = mongoose.model('InstagramLink', instagramLinkSchema)

