 import { PagePhoto } from '../models/PagePhoto.js'

export async function listPagePhotos(req, res) {
  const { pageName } = req.params
  const items = await PagePhoto.find({ pageName, isActive: true }).sort({ createdAt: -1 })
  res.json({ items })
}
