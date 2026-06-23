import { Router } from 'express'
import { memoryUpload } from '../../middleware/upload.js'
import {
  listAdminProducts,
  getAdminProduct,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
} from '../../controllers/adminProductsController.js'

export const productsAdminRouter = Router()

productsAdminRouter.get('/', listAdminProducts)
productsAdminRouter.get('/:id', getAdminProduct)

productsAdminRouter.post(
  '/',
  memoryUpload.fields([{ name: 'images', maxCount: 10 }]),
  createAdminProduct,
)

productsAdminRouter.put(
  '/:id',
  memoryUpload.fields([{ name: 'images', maxCount: 10 }]),
  updateAdminProduct,
)

productsAdminRouter.delete('/:id', deleteAdminProduct)

