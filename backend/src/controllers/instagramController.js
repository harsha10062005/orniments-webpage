import { InstagramLink } from '../models/InstagramLink.js'

export async function listInstagram(req, res) {
  const items = await InstagramLink.find({ isActive: true }).sort({ createdAt: -1 })
  res.json({ items })
}

