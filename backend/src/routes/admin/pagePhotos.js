import { Router } from 'express'
import { memoryUpload } from '../../middleware/upload.js'
import {
  listAdminPagePhotos,
  createAdminPagePhoto,
  deleteAdminPagePhoto,
} from '../../controllers/adminPagePhotosController.js'

export const pagePhotosAdminRouter = Router()

pagePhotosAdminRouter.get('/', listAdminPagePhotos)

pagePhotosAdminRouter.post(
  '/',
  memoryUpload.single('image'),
  createAdminPagePhoto,
)

pagePhotosAdminRouter.delete('/:id', deleteAdminPagePhoto)
