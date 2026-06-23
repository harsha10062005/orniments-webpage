import { Category } from '../models/Category.js'

export async function listAdminCategories(req, res) {
  const items = await Category.find({}).sort({ createdAt: -1 })
  res.json({ items })
}

export async function createAdminCategory(req, res) {
  const { name, slug } = req.body || {}
  if (!name || !slug) return res.status(400).json({ error: 'name and slug are required' })

  const existing = await Category.findOne({ slug })
  if (existing) return res.status(409).json({ error: 'Category slug already exists' })

  const item = await Category.create({
    name: String(name).trim(),
    slug: String(slug).trim(),
  })

  res.status(201).json({ category: item })
}

export async function updateAdminCategory(req, res) {
  const { id } = req.params
  const { name, slug } = req.body || {}
  const updated = await Category.findByIdAndUpdate(
    id,
    {
      ...(name !== undefined ? { name: String(name).trim() } : {}),
      ...(slug !== undefined ? { slug: String(slug).trim() } : {}),
    },
    { new: true },
  )
  if (!updated) return res.status(404).json({ error: 'Category not found' })
  res.json({ category: updated })
}

export async function deleteAdminCategory(req, res) {
  const { id } = req.params
  const deleted = await Category.findByIdAndDelete(id)
  if (!deleted) return res.status(404).json({ error: 'Category not found' })
  res.json({ ok: true })
}

