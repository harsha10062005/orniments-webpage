import { InstagramLink } from '../models/InstagramLink.js'

export async function listAdminInstagram(req, res) {
  const items = await InstagramLink.find({}).sort({ createdAt: -1 })
  res.json({ items })
}

export async function upsertAdminInstagram(req, res) {
  const { url, label, isActive } = req.body || {}
  if (!url) return res.status(400).json({ error: 'url is required' })

  const existing = await InstagramLink.findOne({})
  if (!existing) {
    const created = await InstagramLink.create({
      url: String(url),
      label: label ? String(label) : 'Instagram',
      isActive: isActive !== undefined ? String(isActive) === 'true' : true,
    })
    return res.status(201).json({ item: created })
  }

  const updated = await InstagramLink.findByIdAndUpdate(
    existing._id,
    {
      url: String(url),
      label: label !== undefined ? String(label) : existing.label,
      isActive: isActive !== undefined ? String(isActive) === 'true' : existing.isActive,
    },
    { new: true },
  )
  res.json({ item: updated })
}

