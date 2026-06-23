import { Banner } from '../models/Banner.js'
import { configureCloudinary, uploadImageBuffer } from '../utils/cloudinary.js'

async function maybeUpload(file) {
  if (!file) return null
  configureCloudinary()
  const uploaded = await uploadImageBuffer(file.buffer, `${Date.now()}_${file.originalname}`)
  return { url: uploaded.url }
}

export async function listAdminBanners(req, res) {
  const items = await Banner.find({}).sort({ createdAt: -1 })
  res.json({ items })
}

export async function createAdminBanner(req, res) {
  const { title, linkUrl, position, isActive, imageUrl } = req.body || {}
  let finalImageUrl = imageUrl || ''

  const file = req.file
  if (!finalImageUrl && file) {
    const uploaded = await maybeUpload(file)
    finalImageUrl = uploaded?.url || ''
  }

  if (!finalImageUrl) return res.status(400).json({ error: 'imageUrl or image file is required' })

  const created = await Banner.create({
    title: title ? String(title) : '',
    imageUrl: finalImageUrl,
    linkUrl: linkUrl ? String(linkUrl) : '',
    position: position !== undefined ? Number(position) : 0,
    isActive: isActive !== undefined ? String(isActive) === 'true' : true,
  })

  res.status(201).json({ banner: created })
}

export async function updateAdminBanner(req, res) {
  const { id } = req.params
  const existing = await Banner.findById(id)
  if (!existing) return res.status(404).json({ error: 'Banner not found' })

  const { title, linkUrl, position, isActive, imageUrl } = req.body || {}
  let finalImageUrl = imageUrl || existing.imageUrl

  if (req.file) {
    const uploaded = await maybeUpload(req.file)
    if (uploaded?.url) finalImageUrl = uploaded.url
  }

  const updated = await Banner.findByIdAndUpdate(
    id,
    {
      ...(title !== undefined ? { title: String(title) } : {}),
      ...(linkUrl !== undefined ? { linkUrl: String(linkUrl) } : {}),
      ...(position !== undefined ? { position: Number(position) } : {}),
      ...(isActive !== undefined ? { isActive: String(isActive) === 'true' } : {}),
      imageUrl: finalImageUrl,
    },
    { new: true },
  )

  res.json({ banner: updated })
}

export async function deleteAdminBanner(req, res) {
  const { id } = req.params
  const deleted = await Banner.findByIdAndDelete(id)
  if (!deleted) return res.status(404).json({ error: 'Banner not found' })
  res.json({ ok: true })
}

