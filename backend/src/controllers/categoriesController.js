import { Category } from '../models/Category.js'

export async function listCategories(req, res) {
  const items = await Category.find({}).sort({ createdAt: -1 })
  res.json({ items })
}

