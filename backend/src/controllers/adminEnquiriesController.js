import { Enquiry } from '../models/Enquiry.js'

export async function listAdminEnquiries(req, res) {
  const { status } = req.query
  const filters = {}
  if (status) filters.status = String(status)

  const items = await Enquiry.find(filters).sort({ createdAt: -1 }).limit(200)
  res.json({ items })
}

export async function replyAdminEnquiry(req, res) {
  const { id } = req.params
  const { status, adminReplyMessage } = req.body || {}

  const enquiry = await Enquiry.findById(id)
  if (!enquiry) return res.status(404).json({ error: 'Enquiry not found' })

  enquiry.adminReplyMessage = adminReplyMessage ? String(adminReplyMessage) : enquiry.adminReplyMessage
  if (status) enquiry.status = String(status)
  if (!enquiry.status) enquiry.status = 'replied'

  await enquiry.save()
  res.json({ enquiry })
}

