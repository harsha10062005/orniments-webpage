import mongoose from 'mongoose'

const enquirySchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true },
    productName: { type: String, default: '' },
    message: { type: String, default: '' },

    status: {
      type: String,
      enum: ['new', 'replied', 'closed'],
      default: 'new',
    },

    adminReplyMessage: { type: String, default: '' },
  },
  { timestamps: true },
)

export const Enquiry = mongoose.model('Enquiry', enquirySchema)

