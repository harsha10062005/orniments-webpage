import { Banner } from '../models/Banner.js'

export async function listBanners(req, res) {
  const items = await Banner.find({ isActive: true })
    .sort({ position: 1, createdAt: -1 })
    .limit(10)
  res.json({ items })
}

