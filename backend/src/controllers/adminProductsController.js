import { Category } from '../models/Category.js'
import { Product } from '../models/Product.js'
import { configureCloudinary, uploadImageBuffer } from '../utils/cloudinary.js'

function parseBool(v) {
  if (typeof v === 'boolean') return v
  if (v === undefined || v === null) return undefined
  return String(v) === 'true'
}

function parseSpecifications(value) {
  if (!value) return []
  if (Array.isArray(value)) return value
  try {
    const parsed = JSON.parse(value)
    if (Array.isArray(parsed)) return parsed
    return []
  } catch {
    return []
  }
}

async function uploadImages(files = []) {
  configureCloudinary()
  const results = []
  for (let i = 0; i < files.length; i++) {
    const f = files[i]
    const uploaded = await uploadImageBuffer(
      f.buffer,
      `${Date.now()}_${i}_${f.originalname}`,
    )
    results.push(uploaded)
  }
  return results
}

/** Accept JSON array string, or one URL per line (https://...). */
function parseImageUrlsInput(raw) {
  if (raw === undefined || raw === null) return []
  const s = String(raw).trim()
  if (!s) return []
  if (s.startsWith('[')) {
    try {
      const parsed = JSON.parse(s)
      if (!Array.isArray(parsed)) return []
      return parsed
        .map((item) => (typeof item === 'string' ? item.trim() : item?.url))
        .filter(Boolean)
    } catch {
      return []
    }
  }
  return s
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => /^https?:\/\//i.test(line))
}

function urlsToImageDocs(urls) {
  return urls.map((url) => ({ url: String(url).trim(), publicId: undefined }))
}

export async function getAdminProduct(req, res) {
  const { id } = req.params
  const product = await Product.findById(id).populate('category', 'name slug')
  if (!product) return res.status(404).json({ error: 'Product not found' })
  res.json({ product })
}

export async function listAdminProducts(req, res) {
  const { page, limit } = req.query
  const pageNum = Math.max(1, Number(page || 1))
  const perPage = Math.min(100, Math.max(1, Number(limit || 20)))

  const [items, total] = await Promise.all([
    Product.find({})
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * perPage)
      .limit(perPage),
    Product.countDocuments({}),
  ])

  res.json({ items, total, page: pageNum, limit: perPage })
}

export async function createAdminProduct(req, res) {
  const {
    productName,
    categoryId,
    price,
    discountPrice,
    description,
    availabilityStatus,
    featured,
    trending,
    newArrival,
    stockQuantity,
    visibility,
    specifications,
  } = req.body || {}

  if (!productName) return res.status(400).json({ error: 'productName is required' })
  if (!categoryId) return res.status(400).json({ error: 'categoryId is required' })

  const categoryExists = await Category.exists({ _id: categoryId })
  if (!categoryExists) return res.status(400).json({ error: 'Invalid categoryId' })

  const files = req.files?.images || []
  let images = []
  if (files.length) {
    const uploadedImages = await uploadImages(files)
    images = uploadedImages.map((u) => ({ url: u.url, publicId: u.publicId }))
  } else {
    const urlList = parseImageUrlsInput(req.body.imageUrls)
    if (!urlList.length) {
      return res.status(400).json({
        error:
          'Add at least one image file, or paste image URLs in the Image URLs field (one per line, https://...). For file uploads, set Cloudinary keys in backend/.env.',
      })
    }
    images = urlsToImageDocs(urlList)
  }

  const specArr = parseSpecifications(specifications)

  const created = await Product.create({
    productName: String(productName).trim(),
    category: categoryId,
    price: Number(price || 0),
    discountPrice: Number(discountPrice || 0),
    description: description ? String(description) : '',
    images,
    availabilityStatus: availabilityStatus || 'available',
    featured: parseBool(featured) ?? false,
    trending: parseBool(trending) ?? false,
    newArrival: parseBool(newArrival) ?? false,
    stockQuantity: Number(stockQuantity || 0),
    visibility: parseBool(visibility) ?? true,
    specifications: specArr,
  })

  res.status(201).json({ product: created })
}

export async function updateAdminProduct(req, res) {
  const { id } = req.params

  const existing = await Product.findById(id)
  if (!existing) return res.status(404).json({ error: 'Product not found' })

  const {
    productName,
    categoryId,
    price,
    discountPrice,
    description,
    availabilityStatus,
    featured,
    trending,
    newArrival,
    stockQuantity,
    visibility,
    specifications,
  } = req.body || {}

  let images = existing.images
  const files = req.files?.images
  if (files && files.length) {
    const uploadedImages = await uploadImages(files)
    images = uploadedImages.map((u) => ({ url: u.url, publicId: u.publicId }))
  } else if (req.body.imageUrls !== undefined) {
    const urlList = parseImageUrlsInput(req.body.imageUrls)
    if (urlList.length) images = urlsToImageDocs(urlList)
  }

  const specArr = specifications ? parseSpecifications(specifications) : existing.specifications

  if (categoryId) {
    const categoryExists = await Category.exists({ _id: categoryId })
    if (!categoryExists) return res.status(400).json({ error: 'Invalid categoryId' })
  }

  const updated = await Product.findByIdAndUpdate(
    id,
    {
      ...(productName !== undefined ? { productName: String(productName).trim() } : {}),
      ...(categoryId !== undefined ? { category: categoryId } : {}),
      ...(price !== undefined ? { price: Number(price) } : {}),
      ...(discountPrice !== undefined ? { discountPrice: Number(discountPrice) } : {}),
      ...(description !== undefined ? { description: String(description) } : {}),
      images,
      ...(availabilityStatus !== undefined ? { availabilityStatus } : {}),
      ...(featured !== undefined ? { featured: parseBool(featured) } : {}),
      ...(trending !== undefined ? { trending: parseBool(trending) } : {}),
      ...(newArrival !== undefined ? { newArrival: parseBool(newArrival) } : {}),
      ...(stockQuantity !== undefined ? { stockQuantity: Number(stockQuantity) } : {}),
      ...(visibility !== undefined ? { visibility: parseBool(visibility) } : {}),
      specifications: specArr,
    },
    { new: true },
  ).populate('category', 'name slug')

  res.json({ product: updated })
}

export async function deleteAdminProduct(req, res) {
  const { id } = req.params
  const deleted = await Product.findByIdAndDelete(id)
  if (!deleted) return res.status(404).json({ error: 'Product not found' })
  res.json({ ok: true })
}

