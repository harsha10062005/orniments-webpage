import { Router } from 'express'
import { memoryUpload } from '../../middleware/upload.js'
import {
  listAdminBanners,
  createAdminBanner,
  updateAdminBanner,
  deleteAdminBanner,
} from '../../controllers/adminBannersController.js'

export const bannersAdminRouter = Router()

bannersAdminRouter.get('/', listAdminBanners)

bannersAdminRouter.post(
  '/',
  memoryUpload.single('image'),
  createAdminBanner,
)

bannersAdminRouter.put(
  '/:id',
  memoryUpload.single('image'),
  updateAdminBanner,
)

bannersAdminRouter.delete('/:id', deleteAdminBanner)

