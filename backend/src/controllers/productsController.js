import { Category } from '../models/Category.js'
import { Product } from '../models/Product.js'

export async function getProducts(req, res) {
  const {
    q,
    category,
    availability,
    priceMin,
    priceMax,
    featured,
    trending,
    newArrival,
    sort,
    limit,
    page,
  } = req.query

  const pageNum = Math.max(1, Number(page || 1))
  const perPage = Math.min(50, Math.max(1, Number(limit || 12)))

  const filters = { visibility: true }

  if (q) {
    const search = String(q).trim()
    filters.productName = { $regex: search, $options: 'i' }
  }

  if (availability) {
    const a = String(availability)
    filters.availabilityStatus = a
  }

  // Price filter (uses base price; discount filtering can be added later)
  if (priceMin || priceMax) {
    filters.price = {}
    if (priceMin) filters.price.$gte = Number(priceMin)
    if (priceMax) filters.price.$lte = Number(priceMax)
  }

  if (featured === 'true') filters.featured = true
  if (trending === 'true') filters.trending = true
  if (newArrival === 'true') filters.newArrival = true

  let categoryId
  if (category) {
    const c = String(category)
    const maybeId = c.match(/^[a-fA-F0-9]{24}$/) ? c : null
    if (maybeId) {
      categoryId = maybeId
    } else {
      const found = await Category.findOne({ slug: c })
      categoryId = found?._id
    }
    if (categoryId) filters.category = categoryId
  }

  const sortMode = String(sort || 'latest')
  const mongoSort =
    sortMode === 'trending'
      ? { trending: -1, createdAt: -1 }
      : { createdAt: -1 }

  const [items, total] = await Promise.all([
    Product.find(filters)
      .populate('category', 'name slug')
      .sort(mongoSort)
      .skip((pageNum - 1) * perPage)
      .limit(perPage),
    Product.countDocuments(filters),
  ])

  res.json({
    items,
    total,
    page: pageNum,
    limit: perPage,
  })
}

export async function getProductById(req, res) {
  const { id } = req.params
  const product = await Product.findOne({ _id: id, visibility: true }).populate(
    'category',
    'name slug',
  )
  if (!product) return res.status(404).json({ error: 'Product not found' })
  res.json({ product })
}

