import { PagePhoto } from '../models/PagePhoto.js'
import { configureCloudinary, uploadImageBuffer } from '../utils/cloudinary.js'

async function maybeUpload(file) {
  if (!file) return null
  configureCloudinary()
  const uploaded = await uploadImageBuffer(file.buffer, `${Date.now()}_${file.originalname}`)
  return { url: uploaded.url }
}

export async function listAdminPagePhotos(req, res) {
  const { pageName } = req.query
  const query = pageName ? { pageName } : {}
  const items = await PagePhoto.find(query).sort({ createdAt: -1 })
  res.json({ items })
}

export async function createAdminPagePhoto(req, res) {
  const { pageName, isActive, imageUrl } = req.body || {}
  if (!pageName) return res.status(400).json({ error: 'pageName is required' })

  let finalImageUrl = imageUrl || ''

  const file = req.file
  if (!finalImageUrl && file) {
    const uploaded = await maybeUpload(file)
    finalImageUrl = uploaded?.url || ''
  }

  if (!finalImageUrl) return res.status(400).json({ error: 'imageUrl or image file is required' })

  const created = await PagePhoto.create({
    pageName: String(pageName),
    imageUrl: finalImageUrl,
    isActive: isActive !== undefined ? String(isActive) === 'true' : true,
  })

  res.status(201).json({ pagePhoto: created })
}

export async function deleteAdminPagePhoto(req, res) {
  const { id } = req.params
  const deleted = await PagePhoto.findByIdAndDelete(id)
  if (!deleted) return res.status(404).json({ error: 'Page photo not found' })
  res.json({ ok: true })
}
