import { Enquiry } from '../models/Enquiry.js'

export async function createEnquiry(req, res) {
  const { customerName, phoneNumber, productName, message } = req.body || {}
  if (!customerName || !phoneNumber) {
    return res.status(400).json({ error: 'customerName and phoneNumber are required' })
  }

  const enquiry = await Enquiry.create({
    customerName: String(customerName).trim(),
    phoneNumber: String(phoneNumber).trim(),
    productName: productName ? String(productName).trim() : '',
    message: message ? String(message).trim() : '',
  })

  res.status(201).json({ enquiry })
}

